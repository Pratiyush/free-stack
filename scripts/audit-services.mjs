#!/usr/bin/env node
/**
 * Audit every src/content/services/*.yml against the production-ready bar:
 *   - Zod schema (subset mirrored from src/content.config.ts)
 *   - brand_color is a #RRGGBB hex
 *   - public/logos/<slug>.svg exists
 *   - summary ≤ 180 chars
 *   - pricing_url returns HTTP 2xx/3xx via HEAD (10s timeout, follow redirects)
 *
 * Usage:
 *   node scripts/audit-services.mjs [--json] [--no-http] [--strict]
 *
 * Flags:
 *   --json     also write data/audit-report.json
 *   --no-http  skip the HTTP HEAD checks (useful in CI)
 *   --strict   also fail on placeholder brand_color (#888888)
 *
 * Exit: 0 on pass, 1 on any failure.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';

const args = new Set(process.argv.slice(2));
const JSON_OUT = args.has('--json');
const NO_HTTP = args.has('--no-http');
const STRICT = args.has('--strict');

const SERVICES_DIR = path.resolve('src/content/services');
const LOGOS_DIR = path.resolve('public/logos');
const REPORT_DIR = path.resolve('data');
const REPORT_FILE = path.join(REPORT_DIR, 'audit-report.json');

const TIER_TYPES = ['always-free', 'free-plan', 'trial-credit', 'pay-as-you-go'];
const SUBCATEGORIES = ['permanent', 'expiring-credits', 'limited'];

const pricingTier = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
});

// Schema mirror of src/content.config.ts services collection.
const serviceSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string().regex(/^[a-z0-9-]+$/),
  subcategory: z.enum(SUBCATEGORIES).optional(),
  brand_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  logo: z.string().regex(/^\/logos\/.+\.svg$/),
  summary: z.string().min(10).max(180),
  notes: z.string().optional(),
  tier_type: z.enum(TIER_TYPES),
  free_tier: z.array(z.string().min(3)).min(1),
  pricing: z.array(pricingTier).min(1),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  official_url: z.string().url(),
  pricing_url: z.string().url().optional(),
  docs_url: z.string().url().optional(),
  date_added: z.coerce.date(),
  date_updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  date_verified: z.coerce.date(),
  last_changed: z.coerce.date().optional(),
  maintainer_notes: z.string().optional(),
  submitted_by: z.string().optional(),
});

async function listYaml(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(dir, e.name));
}

/** HEAD request with HTTP fallback to GET (some hosts 405 on HEAD). */
async function checkUrl(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: ctrl.signal,
    });
    // Some servers return 405 / 403 for HEAD; retry as GET.
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
    }
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function auditOne(file) {
  const rel = path.relative(process.cwd(), file);
  const findings = [];
  let data;
  try {
    data = yaml.load(await readFile(file, 'utf-8'));
  } catch (err) {
    return {
      file: rel,
      ok: false,
      findings: [{ level: 'error', msg: `yaml parse: ${err.message}` }],
    };
  }

  // Schema.
  const result = serviceSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      findings.push({
        level: 'error',
        msg: `schema: ${issue.path.join('.') || '(root)'} — ${issue.message}`,
      });
    }
    // Continue to surface every problem in one report.
  }

  // brand_color hex.
  if (data?.brand_color && !/^#[0-9a-fA-F]{6}$/.test(data.brand_color)) {
    findings.push({ level: 'error', msg: `brand_color: '${data.brand_color}' is not #RRGGBB` });
  }
  // Placeholder check (only fatal under --strict).
  if (data?.brand_color && data.brand_color.toLowerCase() === '#888888') {
    findings.push({
      level: STRICT ? 'error' : 'warn',
      msg: 'brand_color is placeholder #888888 (story 3.6 will replace)',
    });
  }

  // Logo file exists.
  if (data?.slug) {
    const logoPath = path.join(LOGOS_DIR, `${data.slug}.svg`);
    if (!existsSync(logoPath)) {
      // Missing logo is a warn (not error) so audit doesn't block CI between
      // story 3.5 (migration stubs) and 3.6 (bulk logo fetch). --strict (story
      // 3.11) flips warnings into failures before tagging v0.5.0.
      findings.push({ level: 'warn', msg: `missing logo file: public/logos/${data.slug}.svg` });
    }
  }

  // Summary length (also caught by schema, but kept for clarity in --json).
  if (typeof data?.summary === 'string' && data.summary.length > 180) {
    findings.push({ level: 'error', msg: `summary is ${data.summary.length} chars (>180)` });
  }

  // Pricing URL liveness.
  if (!NO_HTTP && data?.pricing_url) {
    const r = await checkUrl(data.pricing_url);
    if (!r.ok) {
      findings.push({
        level: 'error',
        msg: `pricing_url ${data.pricing_url} → ${r.status || 'no response'}${r.error ? ` (${r.error})` : ''}`,
      });
    }
  }

  const ok = !findings.some((f) => f.level === 'error');
  return { file: rel, slug: data?.slug, ok, findings };
}

async function main() {
  const files = await listYaml(SERVICES_DIR);
  if (files.length === 0) {
    console.log('No services to audit.');
    return;
  }

  console.log(`Auditing ${files.length} services${NO_HTTP ? ' (HTTP checks skipped)' : ''}...`);

  // Sequential to keep output readable and avoid hammering hosts.
  const results = [];
  for (const f of files) {
    const r = await auditOne(f);
    results.push(r);
  }

  const failed = results.filter((r) => !r.ok);
  const warns = results.flatMap((r) => r.findings.filter((f) => f.level === 'warn')).length;

  // Human-readable report.
  for (const r of results) {
    if (r.ok && r.findings.length === 0) continue;
    const icon = r.ok ? '!' : '✗';
    console.log(`${icon} ${r.file}`);
    for (const f of r.findings) {
      console.log(`    · [${f.level}] ${f.msg}`);
    }
  }

  console.log('');
  console.log(`Audited: ${files.length}`);
  console.log(`Passed:  ${files.length - failed.length}`);
  console.log(`Failed:  ${failed.length}`);
  console.log(`Warns:   ${warns}`);

  if (JSON_OUT) {
    await mkdir(REPORT_DIR, { recursive: true });
    await writeFile(
      REPORT_FILE,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          total: files.length,
          passed: files.length - failed.length,
          failed: failed.length,
          warns,
          strict: STRICT,
          no_http: NO_HTTP,
          results,
        },
        null,
        2,
      ),
      'utf-8',
    );
    console.log(`Report: ${path.relative(process.cwd(), REPORT_FILE)}`);
  }

  if (failed.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error('audit-services crashed:', err);
  process.exit(1);
});

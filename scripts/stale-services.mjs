#!/usr/bin/env node
/**
 * Stale-services report — scans src/content/services/*.yml and lists any
 * service whose `date_verified` is more than STALE_DAYS old (default 60).
 *
 * Output: a markdown report printed to stdout. The monthly verification
 * cron (.github/workflows/monthly-verify.yml) also captures stdout into
 * a dated file under data/ and feeds the same body to peter-evans/create-issue-from-file.
 *
 * Usage:
 *   node scripts/stale-services.mjs              # report to stdout
 *   STALE_DAYS=90 node scripts/stale-services.mjs
 *
 * Exit code is always 0 — staleness is informational, not a failure.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const SERVICES_DIR = path.resolve('src/content/services');
const STALE_DAYS = Number(process.env.STALE_DAYS ?? 60);
const NOW = new Date();

function daysBetween(a, b) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

async function listYaml(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(dir, e.name));
}

function parseService(raw, file) {
  try {
    const data = yaml.load(raw);
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch (err) {
    console.error(`# parse error in ${file}: ${err.message}`);
    return null;
  }
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  const files = await listYaml(SERVICES_DIR);
  const stale = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf-8');
    const data = parseService(raw, file);
    if (!data) continue;

    const verified = toDate(data.date_verified);
    if (!verified) {
      stale.push({
        slug: data.slug ?? path.basename(file, path.extname(file)),
        name: data.name ?? data.slug ?? path.basename(file),
        category: data.category ?? 'unknown',
        pricing_url: data.pricing_url ?? data.official_url ?? '',
        date_verified: '(missing)',
        age_days: Infinity,
      });
      continue;
    }

    const age = daysBetween(NOW, verified);
    if (age > STALE_DAYS) {
      stale.push({
        slug: data.slug ?? path.basename(file, path.extname(file)),
        name: data.name ?? data.slug ?? path.basename(file),
        category: data.category ?? 'unknown',
        pricing_url: data.pricing_url ?? data.official_url ?? '',
        date_verified: verified.toISOString().slice(0, 10),
        age_days: age,
      });
    }
  }

  stale.sort((a, b) => b.age_days - a.age_days);

  const today = NOW.toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# Monthly verification — ${today}`);
  lines.push('');
  lines.push(
    `Scanned **${files.length}** services. Threshold: \`date_verified\` older than **${STALE_DAYS} days**.`,
  );
  lines.push('');
  lines.push(`**Stale services: ${stale.length}**`);
  lines.push('');

  if (stale.length === 0) {
    lines.push('Nothing to triage. All services were re-verified inside the window.');
    process.stdout.write(lines.join('\n') + '\n');
    return;
  }

  lines.push('| # | Service | Category | Last verified | Age (days) | Pricing URL |');
  lines.push('|---|---------|----------|---------------|-----------:|-------------|');
  stale.forEach((s, i) => {
    const ageStr = Number.isFinite(s.age_days) ? String(s.age_days) : '∞';
    const url = s.pricing_url ? s.pricing_url.replace(/\|/g, '\\|') : '—';
    const linkCell = s.pricing_url ? `[link](${url})` : '—';
    lines.push(
      `| ${i + 1} | \`${s.slug}\` | ${s.category} | ${s.date_verified} | ${ageStr} | ${linkCell} |`,
    );
  });

  lines.push('');
  lines.push('## How to triage');
  lines.push('');
  lines.push(
    '1. Open the pricing URL for each row and confirm the free-tier limits still match the YAML at `src/content/services/<slug>.yml`.',
  );
  lines.push(
    '2. If the free tier is unchanged: bump `date_verified` (and `date_updated`) to today and ship a PR.',
  );
  lines.push(
    '3. If the free tier shrank or grew: update `free_tier`, `pricing[]`, and `facets` to match; bump both dates.',
  );
  lines.push(
    '4. If the free tier was removed entirely: delete the YAML and add a one-line reason to "Services We Don\'t Include" in `README.md`.',
  );

  process.stdout.write(lines.join('\n') + '\n');
}

main().catch((err) => {
  console.error('stale-services crashed:', err);
  process.exit(1);
});

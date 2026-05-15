#!/usr/bin/env node
/**
 * Bulk logo + brand-color sweep across every YAML in src/content/services/.
 *
 * For each service:
 *   1. Derive a simpleicons slug from the YAML's `name` and `slug` fields.
 *      Tries, in order:
 *        a) manual alias from scripts/aliases.mjs
 *        b) exact slug after stripping hyphens
 *        c) name lowercased with non-alphanumeric stripped
 *        d) first word of name only
 *   2. If matched in `simple-icons` (npm package, bundled SVG paths + hex):
 *        - Compose an SVG with `fill="#<hex>"`
 *        - Write to public/logos/<service-slug>.svg
 *        - Update the YAML's `brand_color` to `#<hex>` (uppercased)
 *      Skip the YAML update if the service already has a non-placeholder
 *      brand_color (seeded in v0.2.0). Still write the SVG if missing.
 *   3. If no match: leave YAML alone, log to docs/logo-coverage.md as a miss.
 *
 * Usage:
 *   node scripts/bulk-fetch-logos.mjs [--dry-run] [--only=<slug>]
 *
 * Output: prints a summary table + writes docs/logo-coverage.md.
 *
 * Source policy (per docs/logo-fallback.md / CLAUDE.md):
 *   simpleicons.org → freeicons.io → Lucide. This script handles only the
 *   simpleicons leg. Story 3.7 mops up Lucide + manual SVGs for the misses.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import * as simpleIcons from 'simple-icons';
import { aliases } from './aliases.mjs';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1];

const ROOT = process.cwd();
const SERVICES_DIR = path.resolve(ROOT, 'src/content/services');
const LOGOS_DIR = path.resolve(ROOT, 'public/logos');
const COVERAGE_FILE = path.resolve(ROOT, 'docs/logo-coverage.md');

const PLACEHOLDER_COLOR = '#888888';

// Build a Map of slug → icon for fast lookup.
const ALL_ICONS = Object.values(simpleIcons).filter((i) => i && typeof i === 'object' && i.slug);
const BY_SLUG = new Map(ALL_ICONS.map((i) => [i.slug, i]));

/**
 * Normalize a string to a simpleicons-style slug:
 *   "Cloudflare Workers AI"  -> "cloudflareworkersai"
 *   "Auth0"                  -> "auth0"
 *   "Google Analytics 4"     -> "googleanalytics4"
 *
 * simpleicons strips numbers from the slug for *some* products but not all.
 * We always include digits and let the lookup fall through on misses.
 */
function nameToIconSlug(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Derive candidate simpleicons slugs in priority order.
 * The first one that hits `BY_SLUG` wins.
 */
function candidatesFor(service) {
  const out = [];
  const slug = service.slug; // free-stack slug, kebab-cased
  const name = service.name; // human title

  // 1. Manual alias.
  if (aliases[slug]) out.push(aliases[slug]);

  // 2. Slug with hyphens removed.
  if (slug) out.push(slug.replace(/-/g, ''));

  // 3. Full name → slug.
  if (name) out.push(nameToIconSlug(name));

  // 4. First word of name only (handles "Cloudflare R2" → "cloudflare").
  if (name) {
    const firstWord = name.split(/[\s().-]+/)[0] || '';
    if (firstWord) out.push(nameToIconSlug(firstWord));
  }

  // De-dupe while preserving order.
  return [...new Set(out.filter(Boolean))];
}

function findIcon(service) {
  const candidates = candidatesFor(service);
  for (const c of candidates) {
    const icon = BY_SLUG.get(c);
    if (icon) return { icon, matched_slug: c, candidates };
  }
  return { icon: null, matched_slug: null, candidates };
}

/**
 * Compose a colored SVG from a simpleicons entry. The bundled SVG is
 * monochrome and uses `currentColor` — set `fill="#<hex>"` on the root tag.
 */
function composeSvg(icon) {
  let svg = icon.svg;
  const hex = icon.hex;
  // Inject/replace a fill on the root <svg> tag.
  if (/<svg[^>]*\bfill=/.test(svg)) {
    svg = svg.replace(/(<svg[^>]*?)\bfill="[^"]*"/, `$1fill="#${hex}"`);
  } else {
    svg = svg.replace(/<svg\b/, `<svg fill="#${hex}"`);
  }
  return svg;
}

/**
 * Update only the `brand_color` line in a YAML file, in place, preserving
 * everything else byte-for-byte. js-yaml's load/dump round-trip would reflow
 * the file and lose comment formatting — we don't want that.
 */
async function updateBrandColorInPlace(file, newHex) {
  const raw = await readFile(file, 'utf-8');
  // Match `brand_color:` followed by an optional quoted or bare hex value.
  const re = /^(brand_color:\s*['"]?)#?[0-9A-Fa-f]{6}(['"]?)\s*$/m;
  if (!re.test(raw)) return { updated: false, reason: 'no brand_color line found' };
  const next = raw.replace(re, `$1${newHex}$2`);
  if (next === raw) return { updated: false, reason: 'already at target value' };
  await writeFile(file, next, 'utf-8');
  return { updated: true };
}

async function listServices() {
  const entries = await readdir(SERVICES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(SERVICES_DIR, e.name))
    .sort();
}

async function main() {
  await mkdir(LOGOS_DIR, { recursive: true });
  await mkdir(path.dirname(COVERAGE_FILE), { recursive: true });

  const files = await listServices();
  if (files.length === 0) {
    console.log('No service YAMLs found.');
    return;
  }

  const hits = []; // { slug, name, matched_slug, hex, svg_path }
  const misses = []; // { slug, name, candidates }
  const errors = []; // { slug, error }
  let yamlsUpdated = 0;
  let svgsWritten = 0;

  for (const file of files) {
    let data;
    try {
      data = yaml.load(await readFile(file, 'utf-8'));
    } catch (err) {
      errors.push({ slug: path.basename(file, '.yml'), error: `yaml parse: ${err.message}` });
      continue;
    }
    if (!data?.slug) {
      errors.push({ slug: path.basename(file, '.yml'), error: 'no slug field' });
      continue;
    }
    if (ONLY && data.slug !== ONLY) continue;

    try {
      const { icon, matched_slug, candidates } = findIcon(data);

      if (!icon) {
        misses.push({ slug: data.slug, name: data.name, candidates });
        continue;
      }

      const hex = `#${icon.hex.toUpperCase()}`;
      const svgPath = path.join(LOGOS_DIR, `${data.slug}.svg`);
      const hasReal =
        data.brand_color && data.brand_color.toLowerCase() !== PLACEHOLDER_COLOR.toLowerCase();

      // Update YAML brand_color only if currently placeholder.
      if (!hasReal) {
        if (!DRY_RUN) {
          const r = await updateBrandColorInPlace(file, hex);
          if (r.updated) yamlsUpdated++;
        } else {
          yamlsUpdated++;
        }
      }

      // Write SVG unless one already exists (seed YAMLs may have one).
      if (!existsSync(svgPath)) {
        if (!DRY_RUN) {
          await writeFile(svgPath, composeSvg(icon), 'utf-8');
        }
        svgsWritten++;
      }

      hits.push({
        slug: data.slug,
        name: data.name,
        matched_slug,
        hex,
        kept_seed_color: hasReal,
        seed_color: hasReal ? data.brand_color : null,
        svg_written: !existsSync(svgPath) || svgsWritten > 0,
      });
    } catch (err) {
      errors.push({ slug: data.slug, error: err.message });
    }
  }

  const scanned = files.length;
  const coverage = scanned ? (hits.length / scanned) * 100 : 0;

  // Write coverage report.
  if (!DRY_RUN) {
    await writeCoverageReport({ scanned, hits, misses, errors, coverage });
  }

  // Print summary.
  console.log('');
  console.log('Bulk logo fetch summary');
  console.log('─'.repeat(40));
  console.log(`services scanned : ${scanned}`);
  console.log(`hits             : ${hits.length}`);
  console.log(`misses           : ${misses.length}`);
  console.log(`errors           : ${errors.length}`);
  console.log(`YAMLs updated    : ${yamlsUpdated}`);
  console.log(`SVGs written     : ${svgsWritten}`);
  console.log(`coverage         : ${coverage.toFixed(1)}%`);
  if (DRY_RUN) console.log('(dry run — no files written)');
  if (coverage < 80) {
    console.log('');
    console.log(`! coverage below 80% target — see ${path.relative(ROOT, COVERAGE_FILE)}`);
  }
}

async function writeCoverageReport({ scanned, hits, misses, errors, coverage }) {
  const lines = [];
  lines.push('# Logo Coverage Report');
  lines.push('');
  lines.push(
    '> Generated by `scripts/bulk-fetch-logos.mjs`. Do **not** edit by hand — re-run the script.',
  );
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Services scanned:** ${scanned}`);
  lines.push(`**simpleicons hits:** ${hits.length} (${coverage.toFixed(1)}%)`);
  lines.push(`**Misses (need story 3.7):** ${misses.length}`);
  lines.push(`**Errors:** ${errors.length}`);
  lines.push('');
  lines.push('Format per line: `slug — name — matched-simpleicons-slug — result`.');
  lines.push('');

  lines.push('## ✅ simpleicons hits');
  lines.push('');
  for (const h of hits.sort((a, b) => a.slug.localeCompare(b.slug))) {
    const tail = h.kept_seed_color
      ? ` (kept seed color ${h.seed_color}, simpleicons would be ${h.hex})`
      : ` → ${h.hex}`;
    lines.push(`- \`${h.slug}\` — ${h.name} — \`${h.matched_slug}\`${tail}`);
  }
  lines.push('');

  lines.push('## ⚠️ No simpleicons match (story 3.7)');
  lines.push('');
  if (misses.length === 0) {
    lines.push('_None._');
  } else {
    for (const m of misses.sort((a, b) => a.slug.localeCompare(b.slug))) {
      const tried = m.candidates.length ? m.candidates.join(', ') : '(none)';
      lines.push(`- \`${m.slug}\` — ${m.name} — tried: \`${tried}\` → no match`);
    }
  }
  lines.push('');

  lines.push('## ❌ Errors');
  lines.push('');
  if (errors.length === 0) {
    lines.push('_None._');
  } else {
    for (const e of errors.sort((a, b) => a.slug.localeCompare(b.slug))) {
      lines.push(`- \`${e.slug}\` — ${e.error}`);
    }
  }
  lines.push('');

  await writeFile(COVERAGE_FILE, lines.join('\n'), 'utf-8');
}

main().catch((err) => {
  console.error('bulk-fetch-logos crashed:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Migrate a legacy categories/<slug>.md file to typed YAML in
 * src/content/services/<slug>.yml — one YAML per table row.
 *
 * Usage:
 *   node scripts/migrate-md-to-yaml.mjs <category-md-file> [--dry-run] [--force]
 *
 * Behavior:
 * - Parses pipe-delimited service tables from the source MD.
 * - Detects subsection headings (Permanent / Free Credits Expire / Severely
 *   Limited) and stamps subcategory: permanent | expiring-credits | limited.
 * - Slug = service name lowercased, non-alphanumeric → '-', collapsed, trimmed.
 * - Writes placeholders for brand_color (#888888) and logo (<slug>.svg) so
 *   story 3.6 (logo sweep) can fill them in.
 * - Maps source MD slug (filename without .md) to target category slug via
 *   docs/category-taxonomy.md.
 * - Skips existing YAMLs unless --force.
 * - --dry-run writes nothing but still prints stats.
 *
 * Exits 0 unless the source file is unreadable.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));

const DRY_RUN = flags.has('--dry-run');
const FORCE = flags.has('--force');

if (positional.length === 0) {
  console.error(
    'Usage: node scripts/migrate-md-to-yaml.mjs <category-md-file> [--dry-run] [--force]',
  );
  process.exit(1);
}

const SRC_FILE = path.resolve(positional[0]);
if (!existsSync(SRC_FILE)) {
  console.error(`Source file not found: ${SRC_FILE}`);
  process.exit(1);
}

const SERVICES_DIR = path.resolve('src/content/services');
const TAXONOMY_FILE = path.resolve('docs/category-taxonomy.md');
const TODAY = new Date().toISOString().slice(0, 10);
const VERIFIED_MONTH = TODAY.slice(0, 7); // YYYY-MM

/** Parse the taxonomy table to build a source-slug → target-slug map. */
async function loadTaxonomyMap() {
  const raw = await readFile(TAXONOMY_FILE, 'utf-8');
  // Rows like: `### N. Title` followed by a yaml block with `slug:` and
  // `- Migrated from: <slug>.md`. We can mine both signals in one pass.
  const map = new Map();
  const lines = raw.split('\n');
  let currentTarget = null;
  for (const line of lines) {
    const slugMatch = line.match(/^slug:\s*([a-z0-9-]+)\s*$/);
    if (slugMatch) {
      currentTarget = slugMatch[1];
      continue;
    }
    const migratedMatch = line.match(/Migrated from:\s*`?([a-z0-9-]+)\.md`?/);
    if (migratedMatch && currentTarget) {
      map.set(migratedMatch[1], currentTarget);
    }
  }
  return map;
}

/** Convert a service display name to a kebab-case slug. */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Strip Markdown link syntax → return { text, url } for the first link found. */
function parseLink(cell) {
  const m = cell.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (m) return { text: m[1].trim(), url: m[2].trim() };
  return { text: cell.trim(), url: '' };
}

/** Split a markdown pipe row into trimmed cells, dropping the outer empties. */
function splitRow(line) {
  // Trim leading/trailing pipe whitespace, then split on |.
  const stripped = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return stripped.split('|').map((c) => c.trim());
}

/** Determine subcategory from a markdown subsection heading line. */
function detectSubcategory(headingText) {
  const h = headingText.toLowerCase();
  if (h.includes('permanent free')) return 'permanent';
  if (h.includes('free credits') || h.includes('expire')) return 'expiring-credits';
  if (h.includes('severely limited') || h.includes('not recommended')) return 'limited';
  return null;
}

/** Heuristically derive a credit-card boolean note from the cell text. */
function parseCreditCard(cell) {
  const v = cell.toLowerCase();
  if (v.startsWith('no')) return false;
  if (v.startsWith('yes')) return true;
  return null;
}

/** Build the YAML body string for one service. Matches seed-YAML field order. */
function renderYaml(svc) {
  const yamlEscape = (s) => {
    if (s === '' || s === null || s === undefined) return "''";
    // Quote if value contains characters YAML treats specially.
    if (/[:#&*!|>'"%@`,{}\[\]?-]|^\s|\s$/.test(s)) {
      return `'${s.replace(/'/g, "''")}'`;
    }
    return s;
  };

  const lines = [];
  lines.push(`name: ${yamlEscape(svc.name)}`);
  lines.push(`slug: ${svc.slug}`);
  lines.push(`category: ${svc.category}`);
  if (svc.subcategory) lines.push(`subcategory: ${svc.subcategory}`);
  lines.push(`brand_color: '${svc.brand_color}'`);
  lines.push(`logo: /logos/${svc.slug}.svg`);
  lines.push('');
  lines.push(`summary: ${yamlEscape(svc.summary)}`);
  lines.push('');
  lines.push(`tier_type: ${svc.tier_type}`);
  lines.push('');
  lines.push('free_tier:');
  for (const b of svc.free_tier) lines.push(`  - ${yamlEscape(b)}`);
  lines.push('');
  lines.push('pricing:');
  lines.push('  - name: Free');
  lines.push('    price: 0');
  lines.push('    unit: /month');
  lines.push('');
  lines.push('tags: []');
  lines.push('');
  lines.push(`official_url: ${svc.official_url}`);
  if (svc.pricing_url) lines.push(`pricing_url: ${svc.pricing_url}`);
  if (svc.notes) {
    lines.push('');
    lines.push(`notes: ${yamlEscape(svc.notes)}`);
  }
  lines.push('');
  lines.push(`date_added: ${TODAY}`);
  lines.push(`date_verified: ${VERIFIED_MONTH}-01`);
  lines.push('');
  return lines.join('\n');
}

/** Heuristic tier_type from subcategory + credit-card hint. */
function inferTierType(subcategory, creditCard) {
  if (subcategory === 'expiring-credits') return 'trial-credit';
  if (subcategory === 'limited') return 'free-plan';
  // permanent or unknown
  if (creditCard === false) return 'always-free';
  return 'free-plan';
}

/** Compose a <=180 char summary string from the free tier + key limits. */
function buildSummary(freeTier, keyLimits) {
  const base = [freeTier, keyLimits].filter(Boolean).join(' — ');
  if (base.length <= 180) return base;
  return base.slice(0, 177).trimEnd() + '...';
}

async function main() {
  const taxonomyMap = await loadTaxonomyMap();
  const srcBasename = path.basename(SRC_FILE, '.md');
  const targetCategory = taxonomyMap.get(srcBasename) || srcBasename;
  if (!taxonomyMap.has(srcBasename)) {
    console.warn(`! No taxonomy mapping for '${srcBasename}.md'; using '${srcBasename}' as-is.`);
  }

  const raw = await readFile(SRC_FILE, 'utf-8');
  const lines = raw.split('\n');

  const services = [];
  // Default to `permanent` for categories like hosting.md that have a single
  // unlabeled table. Subsection headings will override this.
  let currentSubcategory = 'permanent';
  let inTable = false;
  let headerCells = null;

  for (const line of lines) {
    // Detect a level-2 subsection heading.
    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim();
      const sub = detectSubcategory(heading);
      // If the heading looks like a tier subsection, set it. Otherwise
      // (e.g. '## Notes'), null it out so subsequent tables aren't treated
      // as service rows.
      currentSubcategory = sub;
      inTable = false;
      headerCells = null;
      continue;
    }

    // Detect a markdown table row.
    if (line.trim().startsWith('|')) {
      // Skip the separator line (---|---|...).
      if (/^\|[\s\-:|]+\|?\s*$/.test(line)) {
        inTable = headerCells !== null;
        continue;
      }
      const cells = splitRow(line);
      if (!inTable && headerCells === null) {
        // First row of the table is the header.
        headerCells = cells.map((c) => c.toLowerCase());
        continue;
      }
      if (inTable && headerCells) {
        // A data row. Use header cells to index by name where possible.
        // Common columns: Service | Free Tier/Free Offer | Key Limits/Why Limited |
        //                 Rate Limits | Credit Card | Verified | Link
        const idx = (label) => headerCells.findIndex((h) => h.includes(label));
        const iService = idx('service');
        const iFreeTier = idx('free tier') !== -1 ? idx('free tier') : idx('free offer');
        const iKeyLimits = idx('key limits') !== -1 ? idx('key limits') : idx('why limited');
        const iRate = idx('rate limit');
        const iCard = idx('credit card');
        const iLink = idx('link');

        const serviceName = cells[iService] || '';
        if (!serviceName) continue;
        const slug = slugify(serviceName);
        if (!slug) continue;

        const freeTierText = iFreeTier >= 0 ? cells[iFreeTier] || '' : '';
        const keyLimitsText = iKeyLimits >= 0 ? cells[iKeyLimits] || '' : '';
        const rateText = iRate >= 0 ? cells[iRate] || '' : '';
        const cardText = iCard >= 0 ? cells[iCard] || '' : '';
        const linkCell = iLink >= 0 ? cells[iLink] || '' : '';
        const link = parseLink(linkCell);

        const summary = buildSummary(freeTierText, keyLimitsText);
        const free_tier = [freeTierText, keyLimitsText, rateText]
          .filter(Boolean)
          .filter((b) => b.length >= 3);

        const creditCard = parseCreditCard(cardText);
        const tier_type = inferTierType(currentSubcategory, creditCard);

        // Derive official_url from the pricing URL host.
        let officialUrl = '';
        if (link.url) {
          try {
            const u = new URL(link.url);
            officialUrl = `${u.protocol}//${u.hostname}/`;
          } catch {
            officialUrl = link.url;
          }
        }

        services.push({
          name: serviceName,
          slug,
          category: targetCategory,
          subcategory: currentSubcategory || undefined,
          brand_color: '888888',
          summary,
          tier_type,
          free_tier:
            free_tier.length > 0 ? free_tier : [freeTierText || 'See pricing page for details'],
          official_url: officialUrl || 'https://example.com/',
          pricing_url: link.url || undefined,
          notes: rateText && !free_tier.includes(rateText) ? undefined : undefined,
        });
      }
      continue;
    }

    // Any non-table, non-heading line ends the current table.
    if (line.trim() === '') continue;
    inTable = false;
    headerCells = null;
  }

  // Tally subcategory counts.
  const tally = { permanent: 0, 'expiring-credits': 0, limited: 0, unset: 0 };
  for (const s of services) {
    const key = s.subcategory || 'unset';
    tally[key] = (tally[key] || 0) + 1;
  }

  let written = 0;
  let skipped = 0;
  let errors = 0;

  if (!DRY_RUN) {
    await mkdir(SERVICES_DIR, { recursive: true });
  }

  for (const svc of services) {
    const target = path.join(SERVICES_DIR, `${svc.slug}.yml`);
    if (existsSync(target) && !FORCE) {
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      written++; // would-write count
      continue;
    }
    try {
      const body = renderYaml(svc);
      await writeFile(target, body, 'utf-8');
      written++;
    } catch (err) {
      console.error(`✗ ${svc.slug}: ${err.message}`);
      errors++;
    }
  }

  // Stats block.
  console.log('');
  console.log(`Source: ${path.relative(process.cwd(), SRC_FILE)}`);
  console.log(
    `Target category: ${targetCategory}${taxonomyMap.has(srcBasename) ? '' : ' (no taxonomy mapping)'}`,
  );
  console.log(`Parsed: ${services.length} rows`);
  console.log(
    `  permanent=${tally.permanent}  expiring-credits=${tally['expiring-credits']}  limited=${tally.limited}  unset=${tally.unset}`,
  );
  if (DRY_RUN) {
    console.log(`Would write: ${written}  skipped (already exist): ${skipped}`);
  } else {
    console.log(`Wrote: ${written}  skipped (already exist): ${skipped}  errors: ${errors}`);
  }
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error('migrate-md-to-yaml crashed:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Story 5.1b — generate per-service 1200×630 OG cards as PNG.
 *
 * Reads every YAML in src/content/services/, composes an SVG with the service's
 * brand color band, name (Fraunces), tier badge, free-tier headline, and the
 * opentier wordmark + URL footer. @resvg/resvg-js rasterises to PNG.
 *
 * Output: public/og/<slug>.png (gitignored — regenerated on build).
 *
 * Also generates public/og/default.png — the homepage / fallback card.
 *
 * Usage:
 *   node scripts/generate-og-cards.mjs           # generate all
 *   node scripts/generate-og-cards.mjs --only=<slug>  # one service
 *   node scripts/generate-og-cards.mjs --force   # regenerate even if newer than YAML
 */
import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { Resvg } from '@resvg/resvg-js';

const SERVICES_DIR = path.resolve('src/content/services');
const OUT_DIR = path.resolve('public/og');
const FRAUNCES_WOFF2 = path.resolve(
  'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2',
);
const INTER_WOFF2 = path.resolve(
  'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
);

const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const FORCE = process.argv.includes('--force');

const TIER_LABEL = {
  'always-free': 'Always free',
  'free-plan': 'Free plan',
  'trial-credit': 'Trial credit',
  'pay-as-you-go': 'Pay as you go',
};

// Escape for safe embedding in SVG text nodes.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Word-wrap text into N lines of approximately maxChars each.
function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      lines.push(line.trim());
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line += ' ' + w;
    }
  }
  if (lines.length < maxLines && line.trim()) lines.push(line.trim());
  // Truncate the final line with an ellipsis if we ran out of room
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.replace(/.{3}$/, '…');
  }
  return lines;
}

function svgFor({ name, brandColor, tier, freeTierHeadline }) {
  const accent = brandColor && /^#[0-9a-fA-F]{6}$/.test(brandColor) ? brandColor : '#b73d22';
  const tierLabel = TIER_LABEL[tier] ?? tier ?? 'Free';
  const nameLines = wrap(name, 22, 2);
  const headlineLines = wrap(freeTierHeadline ?? '', 56, 2);

  // The accent tint behind the title — 9% of brand color over paper-warm.
  const accentTint = `${accent}1a`; // hex alpha (~10%)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .title { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-weight: 400; }
      .title-italic { font-style: italic; }
      .body { font-family: 'Inter Tight', system-ui, sans-serif; font-weight: 400; }
      .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 400; letter-spacing: 0.08em; }
    </style>
  </defs>

  <!-- Paper-warm background -->
  <rect width="1200" height="630" fill="#fdfaf2" />
  <rect width="1200" height="630" fill="${accentTint}" />
  <rect width="1200" height="630" fill="#fdfaf2" opacity="0.4" />

  <!-- Brand-color head band -->
  <rect x="0" y="0" width="1200" height="12" fill="${accent}" />

  <!-- Issue mast -->
  <text x="80" y="76" class="mono" font-size="20" fill="#6b6460">
    FREE-STACK · ISSUE 009 · ${new Date().toISOString().slice(0, 10).toUpperCase()}
  </text>
  <line x1="80" x2="1120" y1="92" y2="92" stroke="#d8d3c6" stroke-width="1" />

  <!-- Tier badge -->
  <rect x="80" y="120" width="${tierLabel.length * 11 + 28}" height="32" rx="4" fill="${accent}" />
  <text x="${80 + 14}" y="142" class="mono" font-size="13" fill="#fdfaf2" letter-spacing="0.1em">
    ${esc(tierLabel.toUpperCase())}
  </text>

  <!-- Service name (Fraunces, italic, large) -->
  ${nameLines
    .map(
      (line, i) =>
        `<text x="80" y="${260 + i * 96}" class="title title-italic" font-size="96" fill="#1a1a1a">${esc(line)}</text>`,
    )
    .join('\n  ')}

  <!-- Free-tier headline -->
  ${headlineLines
    .map(
      (line, i) =>
        `<text x="80" y="${480 + i * 36}" class="body" font-size="28" fill="#4a443e">${esc(line)}</text>`,
    )
    .join('\n  ')}

  <!-- Footer mast: wordmark + URL -->
  <line x1="80" x2="1120" y1="560" y2="560" stroke="#d8d3c6" stroke-width="1" />
  <text x="80" y="600" class="title" font-size="32" fill="#1a1a1a">
    <tspan fill="${accent}">∗</tspan> opentier
  </text>
  <text x="1120" y="600" class="mono" font-size="18" fill="#6b6460" text-anchor="end">
    opentier.dev
  </text>
</svg>`;
}

let fraunces = null;
let inter = null;
async function loadFonts() {
  if (fraunces && inter) return;
  if (existsSync(FRAUNCES_WOFF2)) fraunces = await readFile(FRAUNCES_WOFF2);
  if (existsSync(INTER_WOFF2)) inter = await readFile(INTER_WOFF2);
}

async function renderToPng(svgString) {
  await loadFonts();
  const fontBuffers = [];
  if (fraunces) fontBuffers.push(fraunces);
  if (inter) fontBuffers.push(inter);
  const resvg = new Resvg(svgString, {
    font: {
      // Pass woff2 buffers — recent @resvg/resvg-js decodes woff2 natively
      fontBuffers,
      loadSystemFonts: true,
      defaultFontFamily: 'Georgia',
    },
    fitTo: { mode: 'width', value: 1200 },
  });
  return resvg.render().asPng();
}

async function isUpToDate(yamlPath, pngPath) {
  if (FORCE || !existsSync(pngPath)) return false;
  const yamlStat = await stat(yamlPath);
  const pngStat = await stat(pngPath);
  return pngStat.mtimeMs > yamlStat.mtimeMs;
}

async function generateOne(slug) {
  const yamlPath = path.join(SERVICES_DIR, `${slug}.yml`);
  const pngPath = path.join(OUT_DIR, `${slug}.png`);
  if (await isUpToDate(yamlPath, pngPath)) {
    return { slug, skipped: true };
  }
  const data = yaml.load(await readFile(yamlPath, 'utf-8'));
  const svg = svgFor({
    name: data.name,
    brandColor: data.brand_color,
    tier: data.tier_type,
    freeTierHeadline: data.summary,
  });
  const png = await renderToPng(svg);
  await writeFile(pngPath, png);
  return { slug, written: true };
}

async function generateDefault() {
  const pngPath = path.join(OUT_DIR, 'default.png');
  if (!FORCE && existsSync(pngPath)) return { default: true, skipped: true };
  const svg = svgFor({
    name: 'opentier',
    brandColor: '#b73d22',
    tier: 'always-free',
    freeTierHeadline:
      '300 verified developer free tiers across 27 categories. No ads, no affiliate links.',
  });
  const png = await renderToPng(svg);
  await writeFile(pngPath, png);
  return { default: true, written: true };
}

async function listAllSlugs() {
  const entries = await readdir(SERVICES_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.yml'))
    .map((e) => e.name.replace(/\.yml$/, ''))
    .sort();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const slugs = ONLY ? [ONLY] : await listAllSlugs();
  console.log(
    `Generating ${slugs.length} OG card${slugs.length === 1 ? '' : 's'} → ${path.relative(process.cwd(), OUT_DIR)}/`,
  );
  let written = 0;
  let skipped = 0;
  const errors = [];
  for (const slug of slugs) {
    try {
      const r = await generateOne(slug);
      if (r.written) written++;
      else skipped++;
    } catch (err) {
      errors.push({ slug, msg: err.message });
    }
  }
  // Default OG card for homepage / catalog / /legal / etc.
  try {
    const r = await generateDefault();
    if (r.written) written++;
    else skipped++;
  } catch (err) {
    errors.push({ slug: 'default', msg: err.message });
  }
  console.log(`Written: ${written}  Skipped (up-to-date): ${skipped}  Errors: ${errors.length}`);
  if (errors.length) {
    for (const e of errors.slice(0, 10)) console.error(`  ✗ ${e.slug} — ${e.msg}`);
    if (errors.length > 10) console.error(`  ... and ${errors.length - 10} more`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('generate-og-cards crashed:', err);
  process.exit(1);
});

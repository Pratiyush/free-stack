#!/usr/bin/env node
/**
 * Story 3.7 — cascade fill of brand colors + logos for services that
 * `bulk-fetch-logos.mjs` (story 3.6, simpleicons-only) could not match.
 *
 * Cascade (highest signal first):
 *   1) @lobehub/icons-static-svg  (AI / LLM tools)         — npm, MIT
 *   2) devicon                    (Cloud / DevOps)         — npm, MIT
 *   3) selfhst/icons              (Self-hosted SaaS)       — GitHub raw, MIT
 *   4) svgl                       (Niche colorful SaaS)    — public CDN, MIT
 *   5) iconify @logos             (Brand logo collection)  — public API, MIT
 *   6) iconify @simple-icons      (Newer simpleicons.org)  — public API, CC0
 *
 * For each service still at brand_color #888888:
 *   - Walk the cascade. The first source that has a usable colored SVG wins.
 *   - Write the SVG to public/logos/<slug>.svg (pre-colored, full-color).
 *   - Extract a brand hex from the SVG (or from source metadata, or from
 *     `KNOWN_HEX` override) and update the YAML's brand_color line in place.
 *   - On miss across all sources, leave the YAML alone and queue the slug
 *     for manual fallback (Lucide-tinted or monogram).
 *
 * Each source has an explicit slug map (per-opentier-slug → source slug)
 * to avoid the "first-word" trap (e.g., a generic `oracle` icon does NOT
 * belong on AWS S3). Auto-fallback to normalized-slug lookup also runs as
 * a safety net but is only consulted for sources where it is safe.
 *
 * Updates docs/logo-coverage.md with before/after counts and a "Manual
 * fallback queue" section listing the residual misses.
 *
 * Usage:
 *   node scripts/fill-logo-gaps.mjs [--dry-run] [--only=<slug>]
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1];

const ROOT = process.cwd();
const SERVICES_DIR = path.resolve(ROOT, 'src/content/services');
const LOGOS_DIR = path.resolve(ROOT, 'public/logos');
const COVERAGE_FILE = path.resolve(ROOT, 'docs/logo-coverage.md');
const LOBE_DIR = path.resolve(ROOT, 'node_modules/@lobehub/icons-static-svg/icons');
const DEVICON_DIR = path.resolve(ROOT, 'node_modules/devicon/icons');
const DEVICON_META = path.resolve(ROOT, 'node_modules/devicon/devicon.json');
const SELFHST_RAW = 'https://raw.githubusercontent.com/selfhst/icons/main/svg/';

/* ============================================================
 * Explicit per-source slug maps.
 *
 * Keys: opentier service slug (kebab).
 * Values: source-specific lookup token.
 * ============================================================ */

// Lobe-icons ships both monochrome (`<name>.svg`) and pre-colored
// (`<name>-color.svg`) variants. We prefer `-color` when it exists.
const LOBE_MAP = {
  deepseek: 'deepseek',
  cohere: 'cohere',
  sambanova: 'sambanova',
  'fireworks-ai': 'fireworks',
  'together-ai': 'together',
};

// Devicon folders contain SVG variants. We prefer `original` (full-color),
// then `plain`, then `line`. We avoid `-wordmark` variants when possible.
const DEVICON_MAP = {
  'aws-always-free': 'amazonwebservices',
  'aws-ecr-public': 'amazonwebservices',
  'aws-free-plan-new-accounts-post-july-2025': 'amazonwebservices',
  'aws-route-53': 'amazonwebservices',
  'aws-s3': 'amazonwebservices',
  'amazon-ses': 'amazonwebservices',
  'azure-12-month-free': 'azure',
  'azure-always-free': 'azure',
  browserstack: 'browserstack',
};

// selfh.st has 6800+ pre-colored SVGs. Map only verified-present slugs
// (checked against repo's `git tree` listing); never fall back to
// "first-word" matching because generic words (amazon, oracle) belong
// to too many products.
const SELFHST_MAP = {
  appflowy: 'appflowy',
  focalboard: 'focalboard',
  fumadocs: 'fumadocs',
  goatcounter: 'goatcounter',
  hanko: 'hanko',
  hyperdx: 'hyperdx',
  logto: 'logto',
  loops: 'loops',
  openpanel: 'openpanel',
  'oracle-cloud-always-free': 'oracle',
  plane: 'plane',
  'seq-self-hosted': 'seq',
  stormkit: 'stormkit',
  taiga: 'taiga',
  'typesense-cloud': 'typesense',
  uptimerobot: 'uptimerobot',
  'vector-open-source': 'vector',
  youtrack: 'youtrack',
};

// svgl — public CDN; takes a full URL. Last-resort source.
const SVGL_MAP = {
  axiom: 'https://svgl.app/library/axiom-light.svg',
  cerebras: 'https://svgl.app/library/cerebras.svg',
  convex: 'https://svgl.app/library/convex.svg',
  'daily-co': 'https://svgl.app/library/daily-dev-ligth.svg',
  'ibm-cloud': 'https://svgl.app/library/ibm.svg',
  neon: 'https://svgl.app/library/neon.svg',
  playwright: 'https://svgl.app/library/playwright.svg',
  polar: 'https://svgl.app/library/polar-sh_light.svg',
  'together-ai': 'https://svgl.app/library/togetherai_light.svg',
  'workos-authkit': 'https://svgl.app/library/workos.svg',
  xata: 'https://svgl.app/library/xata.svg',
  zeabur: 'https://svgl.app/library/zeabur-light.svg',
};

// iconify @logos — broad brand-logos collection, ~1860 entries. Maps
// opentier slug → iconify-logos icon name.
const ICONIFY_LOGOS_MAP = {
  'launchdarkly-observability': 'launchdarkly',
  'linode-akamai': 'linode',
  'monday-com': 'monday',
  onesignal: 'onesignal',
  poeditor: 'poeditor',
  'quay-io': 'quay',
  supertokens: 'supertokens',
  'surge-sh': 'surge',
  zeplin: 'zeplin',
};

// iconify @simple-icons — newer than the simple-icons@15 we bundle locally.
// Catches a few icons added to simpleicons.org after our pinned version.
const ICONIFY_SI_MAP = {
  opencage: 'opencage',
  'ory-kratos': 'ory',
  'qlty-formerly-codeclimate': 'qlty',
  'tidb-cloud-starter': 'tidb',
  cockroachdb: 'cockroachlabs',
};

/* ============================================================
 * Hardcoded fallback brand colors when SVG color extraction
 * fails or yields a bad hue (white, near-black). Sourced from
 * each vendor's public brand assets / press kit / favicon.
 * ============================================================ */
const KNOWN_HEX = {
  // AI / ML
  deepseek: '#4D6BFE',
  cohere: '#39594D',
  cerebras: '#FF6B35',
  sambanova: '#EE3124',
  'fireworks-ai': '#5019C5',
  'together-ai': '#0F6FFF',

  // AWS family (orange #FF9900)
  'aws-always-free': '#FF9900',
  'aws-ecr-public': '#FF9900',
  'aws-free-plan-new-accounts-post-july-2025': '#FF9900',
  'aws-route-53': '#FF9900',
  'aws-s3': '#569A31',
  'amazon-ses': '#DD344C',

  // Azure (blue #0078D4)
  'azure-12-month-free': '#0078D4',
  'azure-always-free': '#0078D4',

  // Other clouds
  'ibm-cloud': '#054ADA',
  'oracle-cloud-always-free': '#C74634',

  // BrowserStack
  browserstack: '#F26B3A',

  // selfh.st-sourced (these may have several colors; pin the brand one)
  appflowy: '#9333EA',
  fumadocs: '#FF6B35',
  goatcounter: '#9A1F1F',
  hyperdx: '#50FA7B',
  loops: '#1E90FF',
  logto: '#5D34F2',
  openpanel: '#5C61F2',
  taiga: '#83EAF1',
  uptimerobot: '#3BD671',
  stormkit: '#0066FF',
  hanko: '#0F172A',
  plane: '#3F76FF',
  focalboard: '#5A67D8',
  youtrack: '#46C6F2',
  'typesense-cloud': '#0E2030',
  'seq-self-hosted': '#42AED1',
  'vector-open-source': '#10E7DC',

  // svgl-sourced
  axiom: '#1A1A1A',
  convex: '#F26522',
  'daily-co': '#1BEBB9',
  neon: '#00E699',
  playwright: '#2EAD33',
  polar: '#0062FF',
  'workos-authkit': '#6363F1',
  xata: '#9F87FF',
  zeabur: '#6300FF',

  // iconify-sourced
  'launchdarkly-observability': '#405BFF',
  'linode-akamai': '#00A95C',
  'monday-com': '#FF3D57',
  onesignal: '#E04F2A',
  poeditor: '#41B0EE',
  'quay-io': '#205D9E',
  supertokens: '#F73B5A',
  'surge-sh': '#EFA00B',
  zeplin: '#FDBD39',
  opencage: '#42B649',
  'ory-kratos': '#592878',
  'qlty-formerly-codeclimate': '#0E1112',
  'tidb-cloud-starter': '#E62D2D',
  cockroachdb: '#6933FF',
};

/* ============================================================
 * Source impl
 * ============================================================ */

let DEVICON_META_CACHE = null;
async function deviconColor(slug) {
  if (!DEVICON_META_CACHE) {
    try {
      DEVICON_META_CACHE = JSON.parse(await readFile(DEVICON_META, 'utf-8'));
    } catch {
      DEVICON_META_CACHE = [];
    }
  }
  const entry = DEVICON_META_CACHE.find((e) => e.name === slug);
  return entry?.color || null;
}

async function readSvg(file) {
  try {
    return await readFile(file, 'utf-8');
  } catch {
    return null;
  }
}

/** Pull the first plausible brand hex out of an SVG string. Tolerates
 * `#aabbcc` and short `#abc` forms; expands shorts to 6-digit. */
function extractHex(svg) {
  if (!svg) return null;
  const hexes = [...svg.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)].map((m) => {
    let h = m[1];
    if (h.length === 3)
      h = h
        .split('')
        .map((c) => c + c)
        .join('');
    return h.toUpperCase();
  });
  if (!hexes.length) return null;
  // Avoid pure white / pure black if other colors exist.
  const filtered = hexes.filter((h) => h !== 'FFFFFF' && h !== '000000');
  return `#${filtered[0] || hexes[0]}`;
}

async function tryLobe(service) {
  const lookup = LOBE_MAP[service.slug];
  if (!lookup) return null;
  const colorPath = path.join(LOBE_DIR, `${lookup}-color.svg`);
  const monoPath = path.join(LOBE_DIR, `${lookup}.svg`);
  if (existsSync(colorPath)) {
    const svg = await readSvg(colorPath);
    const hex = KNOWN_HEX[service.slug] || extractHex(svg) || '#000000';
    return { svg, hex, source: 'lobe', token: `${lookup}-color` };
  }
  if (existsSync(monoPath)) {
    const hex = KNOWN_HEX[service.slug];
    if (!hex) return null;
    const svg = (await readSvg(monoPath))?.replace(/fill="currentColor"/g, `fill="${hex}"`);
    return { svg, hex, source: 'lobe', token: lookup };
  }
  return null;
}

async function tryDevicon(service) {
  const lookup = DEVICON_MAP[service.slug];
  if (!lookup) return null;
  const folder = path.join(DEVICON_DIR, lookup);
  if (!existsSync(folder)) return null;
  const variants = await readdir(folder);
  const ranked = variants
    .filter((v) => v.endsWith('.svg'))
    .sort((a, b) => {
      const score = (v) => {
        let s = 0;
        if (v.includes('original')) s += 10;
        else if (v.includes('plain')) s += 5;
        else if (v.includes('line')) s += 3;
        if (!v.includes('wordmark')) s += 2;
        return -s;
      };
      return score(a) - score(b);
    });
  if (!ranked.length) return null;
  const file = path.join(folder, ranked[0]);
  const svg = await readSvg(file);
  let hex = KNOWN_HEX[service.slug] || (await deviconColor(lookup)) || extractHex(svg);
  if (hex && /^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex =
      '#' +
      hex
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('');
  }
  return {
    svg,
    hex: hex?.toUpperCase(),
    source: 'devicon',
    token: ranked[0].replace(/\.svg$/, ''),
  };
}

async function trySelfhst(service) {
  const lookup = SELFHST_MAP[service.slug];
  if (!lookup) return null;
  const url = SELFHST_RAW + lookup + '.svg';
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const svg = await res.text();
    if (!svg.trim().startsWith('<')) return null;
    const hex = KNOWN_HEX[service.slug] || extractHex(svg);
    return { svg, hex, source: 'selfhst', token: lookup };
  } catch {
    return null;
  }
}

async function trySvgl(service) {
  const url = SVGL_MAP[service.slug];
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const svg = await res.text();
    if (!svg.trim().startsWith('<')) return null;
    const hex = KNOWN_HEX[service.slug] || extractHex(svg);
    return {
      svg,
      hex,
      source: 'svgl',
      token: url
        .split('/')
        .pop()
        .replace(/\.svg$/, ''),
    };
  } catch {
    return null;
  }
}

/** Generic iconify-API helper. */
async function tryIconify(service, prefix, map) {
  const lookup = map[service.slug];
  if (!lookup) return null;
  const url = `https://api.iconify.design/${prefix}:${lookup}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const svg = await res.text();
    if (!svg.trim().startsWith('<')) return null;
    // iconify-simple-icons SVGs ship as monochrome `currentColor`; tint with
    // the known hex (or stick with whatever the SVG has if it's pre-colored).
    let painted = svg;
    let hex = KNOWN_HEX[service.slug] || extractHex(svg);
    if (svg.includes('fill="currentColor"') && hex) {
      painted = svg.replace(/fill="currentColor"/g, `fill="${hex}"`);
    }
    return { svg: painted, hex, source: prefix.replace('@', ''), token: lookup };
  } catch {
    return null;
  }
}

async function tryIconifyLogos(service) {
  return tryIconify(service, 'logos', ICONIFY_LOGOS_MAP);
}
async function tryIconifySi(service) {
  return tryIconify(service, 'simple-icons', ICONIFY_SI_MAP);
}

async function tryFill(service) {
  const cascade = [tryLobe, tryDevicon, trySelfhst, trySvgl, tryIconifyLogos, tryIconifySi];
  for (const fn of cascade) {
    const hit = await fn(service);
    if (hit && hit.svg && hit.hex) return hit;
  }
  return null;
}

/* ============================================================
 * YAML in-place brand_color update (preserves bytes).
 * ============================================================ */
async function updateBrandColorInPlace(file, newHex) {
  const raw = await readFile(file, 'utf-8');
  const re = /^(brand_color:\s*['"]?)#?[0-9A-Fa-f]{6}(['"]?)\s*$/m;
  if (!re.test(raw)) return { updated: false, reason: 'no brand_color line found' };
  const next = raw.replace(re, `$1${newHex}$2`);
  if (next === raw) return { updated: false, reason: 'already at target value' };
  await writeFile(file, next, 'utf-8');
  return { updated: true };
}

async function listPlaceholders() {
  const entries = await readdir(SERVICES_DIR, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isFile() || !/\.(ya?ml)$/.test(e.name)) continue;
    const file = path.join(SERVICES_DIR, e.name);
    const raw = await readFile(file, 'utf-8');
    if (!/^brand_color:\s*['"]?#888888['"]?/m.test(raw)) continue;
    let data;
    try {
      data = yaml.load(raw);
    } catch {
      continue;
    }
    if (!data?.slug) continue;
    if (ONLY && data.slug !== ONLY) continue;
    out.push({ file, slug: data.slug, name: data.name });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function main() {
  await mkdir(LOGOS_DIR, { recursive: true });

  const placeholders = await listPlaceholders();
  console.log(`Found ${placeholders.length} placeholder services to attempt.`);

  const stats = {
    lobe: [],
    devicon: [],
    selfhst: [],
    svgl: [],
    logos: [],
    'simple-icons': [],
    miss: [],
  };
  let yamlsUpdated = 0;
  let svgsWritten = 0;

  for (const service of placeholders) {
    const hit = await tryFill(service);
    if (!hit) {
      stats.miss.push(service);
      continue;
    }
    stats[hit.source].push({ ...service, hex: hit.hex, token: hit.token });

    const svgPath = path.join(LOGOS_DIR, `${service.slug}.svg`);
    if (!DRY_RUN) {
      await writeFile(svgPath, hit.svg, 'utf-8');
    }
    svgsWritten++;

    if (!DRY_RUN) {
      const r = await updateBrandColorInPlace(service.file, hit.hex);
      if (r.updated) yamlsUpdated++;
    } else {
      yamlsUpdated++;
    }
  }

  if (!DRY_RUN) {
    await appendCoverage({ stats, placeholders });
  }

  console.log('');
  console.log('Logo cascade summary');
  console.log('─'.repeat(50));
  console.log(`services scanned         : ${placeholders.length}`);
  console.log(`lobe hits                : ${stats.lobe.length}`);
  console.log(`devicon hits             : ${stats.devicon.length}`);
  console.log(`selfh.st hits            : ${stats.selfhst.length}`);
  console.log(`svgl hits                : ${stats.svgl.length}`);
  console.log(`iconify-logos hits       : ${stats.logos.length}`);
  console.log(`iconify-simple-icons hits: ${stats['simple-icons'].length}`);
  console.log(`misses (manual fallback) : ${stats.miss.length}`);
  console.log(`YAMLs updated            : ${yamlsUpdated}`);
  console.log(`SVGs written             : ${svgsWritten}`);
  if (DRY_RUN) console.log('(dry run — no files written)');
  if (stats.miss.length) {
    console.log('');
    console.log('Manual fallback queue:');
    for (const m of stats.miss) console.log(`  - ${m.slug} (${m.name})`);
  }
}

async function appendCoverage({ stats, placeholders }) {
  const existing = await readFile(COVERAGE_FILE, 'utf-8').catch(() => '');
  const stripped = existing.replace(/\n## Story 3\.7 — cascade fill[\s\S]*$/m, '');

  const lines = [];
  lines.push('');
  lines.push('## Story 3.7 — cascade fill');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Placeholders entering 3.7:** ${placeholders.length}`);
  const filled =
    stats.lobe.length +
    stats.devicon.length +
    stats.selfhst.length +
    stats.svgl.length +
    stats.logos.length +
    stats['simple-icons'].length;
  lines.push(`**Filled:** ${filled}`);
  lines.push(`**Residual misses:** ${stats.miss.length}`);
  lines.push('');
  lines.push('### Hits per source');
  lines.push('');
  for (const [source, items] of [
    ['lobe (@lobehub/icons-static-svg)', stats.lobe],
    ['devicon', stats.devicon],
    ['selfh.st (selfhst/icons)', stats.selfhst],
    ['svgl', stats.svgl],
    ['iconify @logos', stats.logos],
    ['iconify @simple-icons', stats['simple-icons']],
  ]) {
    lines.push(`#### ${source} — ${items.length}`);
    lines.push('');
    if (!items.length) {
      lines.push('_None._');
    } else {
      for (const it of items) {
        lines.push(`- \`${it.slug}\` — ${it.name} — \`${it.token}\` → ${it.hex}`);
      }
    }
    lines.push('');
  }
  lines.push('### Manual fallback queue');
  lines.push('');
  lines.push(
    'Services with no colorful upstream match. Pick a Lucide icon tinted with a category color, or generate a monogram tile. **Maintainer review required — do not auto-pick.**',
  );
  lines.push('');
  if (!stats.miss.length) {
    lines.push('_None._');
  } else {
    for (const m of stats.miss) {
      lines.push(`- \`${m.slug}\` — ${m.name}`);
    }
  }
  lines.push('');

  await writeFile(COVERAGE_FILE, stripped + lines.join('\n'), 'utf-8');
}

main().catch((err) => {
  console.error('fill-logo-gaps crashed:', err);
  process.exit(1);
});

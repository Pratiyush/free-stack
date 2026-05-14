#!/usr/bin/env node
/**
 * Fetch a service logo from simpleicons.org (REQUIRED first source), falling back
 * to freeicons.io, then a Lucide generic icon. Writes to public/logos/<slug>.svg.
 *
 * Usage:
 *   pnpm dlx node scripts/fetch-logo.mjs <slug> <simpleicons-name> [brand-hex]
 *   e.g. node scripts/fetch-logo.mjs supabase supabase 3FCF8E
 *
 * Flags:
 *   --force   Overwrite an existing logo at public/logos/<slug>.svg
 *   --source  simpleicons | freeicons | lucide (default: try in order)
 *
 * simpleicons.org policy (per CLAUDE.md):
 *   - Must check this source first.
 *   - The `hex` field on the simpleicons entry is the canonical brand_color.
 *   - Re-fill the monochrome SVG with the brand hex so cards are colorful.
 *
 * freeicons.io policy:
 *   - Verify license per-icon. Some require attribution.
 *   - Attribution entries are appended to public/logos/CREDITS.md.
 *
 * Lucide policy:
 *   - Use only as a last-resort generic fallback (e.g., `database` icon for
 *     a brandless database service). Tint with brand_color or grey.
 */
import { writeFile, mkdir, readFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));
const [slug, iconName, brandHexArg] = positional;

if (!slug) {
  console.error(
    'Usage: node scripts/fetch-logo.mjs <slug> [icon-name] [hex] [--force] [--source=X]',
  );
  process.exit(1);
}

const force = flags.has('--force');
const sourceFlag = args.find((a) => a.startsWith('--source='))?.split('=')[1];

const LOGOS_DIR = path.resolve('public/logos');
const CREDITS_FILE = path.join(LOGOS_DIR, 'CREDITS.md');
const target = path.join(LOGOS_DIR, `${slug}.svg`);

if (existsSync(target) && !force) {
  console.error(`Already exists: ${target}\nPass --force to overwrite.`);
  process.exit(1);
}

async function fetchSimpleicons(name) {
  const apiUrl = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${name}.svg`;
  const metaUrl = `https://cdn.jsdelivr.net/npm/simple-icons@latest/_data/simple-icons.json`;

  const svgRes = await fetch(apiUrl);
  if (!svgRes.ok) return null;
  let svg = await svgRes.text();

  // Fetch the metadata to get the brand hex (unless overridden by CLI arg)
  let hex = brandHexArg?.replace(/^#/, '');
  if (!hex) {
    try {
      const metaRes = await fetch(metaUrl);
      if (metaRes.ok) {
        const meta = await metaRes.json();
        const entry = meta.icons?.find((i) => i.slug === name || i.title.toLowerCase() === name);
        hex = entry?.hex;
      }
    } catch {
      // ignore — hex stays undefined
    }
  }

  if (hex) {
    // Replace any existing fill or add one to the <svg> tag
    if (/fill=/.test(svg.split('>')[0])) {
      svg = svg.replace(/(<svg[^>]*?)fill="[^"]*"/, `$1fill="#${hex}"`);
    } else {
      svg = svg.replace(/(<svg\b)/, `$1 fill="#${hex}"`);
    }
  }

  return { svg, hex, source: 'simpleicons.org' };
}

async function fetchFreeicons(_name) {
  // freeicons.io has no public CDN-style API. The maintainer downloads the
  // SVG manually from https://freeicons.io and pipes it through this script
  // via stdin, or runs the simpleicons path first and falls back manually.
  // This stub exists so the contract is documented.
  return null;
}

function lucideFallback(slug) {
  // Generic gear icon as the absolute last resort. Tinted neutral grey.
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a5550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="${slug}"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    hex: undefined,
    source: 'lucide-fallback',
  };
}

async function recordCredit({ slug, source, hex }) {
  await mkdir(LOGOS_DIR, { recursive: true });
  if (!existsSync(CREDITS_FILE)) {
    await writeFile(
      CREDITS_FILE,
      '# Logo Credits\n\nPer-service logo source attribution. Used to satisfy license terms.\n\n| Slug | Source | Brand hex |\n|---|---|---|\n',
      'utf-8',
    );
  }
  await appendFile(CREDITS_FILE, `| ${slug} | ${source} | ${hex ? `#${hex}` : '—'} |\n`, 'utf-8');
}

async function main() {
  await mkdir(LOGOS_DIR, { recursive: true });
  const trySources = sourceFlag ? [sourceFlag] : ['simpleicons', 'freeicons', 'lucide'];

  let result = null;
  for (const src of trySources) {
    if (src === 'simpleicons' && iconName) {
      result = await fetchSimpleicons(iconName);
      if (result) break;
    } else if (src === 'freeicons') {
      result = await fetchFreeicons(iconName ?? slug);
      if (result) break;
    } else if (src === 'lucide') {
      result = lucideFallback(slug);
      break;
    }
  }

  if (!result) {
    console.error(`Could not resolve a logo for "${slug}". Tried: ${trySources.join(', ')}`);
    console.error(`Try: node scripts/fetch-logo.mjs ${slug} <simpleicons-name>`);
    process.exit(1);
  }

  await writeFile(target, result.svg, 'utf-8');
  await recordCredit({ slug, source: result.source, hex: result.hex });
  console.log(
    `✓ ${path.relative(process.cwd(), target)} from ${result.source}${result.hex ? ` (#${result.hex})` : ''}`,
  );
}

main().catch((err) => {
  console.error('fetch-logo crashed:', err);
  process.exit(1);
});

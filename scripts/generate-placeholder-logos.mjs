#!/usr/bin/env node
/**
 * For every service YAML whose `logo: /logos/<slug>.svg` points to a missing
 * file, generate a brand-colored placeholder SVG containing the first letter
 * of the service name. Idempotent — never overwrites an existing logo.
 *
 * This unblocks CI (`pnpm check-logos`) for services that fell off the
 * simpleicons → lobe-icons → devicon → selfh.st cascade in story 3.7. Each
 * placeholder gets replaced by a real icon as the catalog matures.
 *
 * Usage:
 *   node scripts/generate-placeholder-logos.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const SERVICES_DIR = path.resolve('src/content/services');
const LOGOS_DIR = path.resolve('public/logos');

function placeholderSvg({ letter, color }) {
  // 24×24 viewBox — same as simpleicons output so the existing render
  // pipeline (fill="<brand>" overrides) keeps working. Letter centered.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" rx="4" fill="${color}" />
  <text x="12" y="16" text-anchor="middle" fill="#fdfaf2"
        font-family="ui-sans-serif, system-ui, sans-serif"
        font-size="13" font-weight="600">${letter}</text>
</svg>
`;
}

async function main() {
  const entries = await readdir(SERVICES_DIR, { withFileTypes: true });
  const yamls = entries
    .filter((e) => e.isFile() && e.name.endsWith('.yml'))
    .map((e) => path.join(SERVICES_DIR, e.name));

  let written = 0;
  let skipped = 0;
  const writtenSlugs = [];

  for (const file of yamls) {
    const data = yaml.load(await readFile(file, 'utf-8'));
    if (!data?.logo || !data?.slug) {
      skipped++;
      continue;
    }
    const logoPath = path.join('public', data.logo);
    if (existsSync(logoPath)) {
      skipped++;
      continue;
    }
    // Use the brand color if defined, otherwise the placeholder grey
    const color = data.brand_color ?? '#888888';
    const letter = (data.name?.[0] ?? data.slug[0] ?? '?').toUpperCase();
    await writeFile(logoPath, placeholderSvg({ letter, color }), 'utf-8');
    written++;
    writtenSlugs.push(data.slug);
  }

  console.log(`Placeholder logos written: ${written}`);
  console.log(`Already present: ${skipped}`);
  if (written && written <= 60) {
    console.log('\nNew placeholders for:');
    for (const s of writtenSlugs) console.log(`  · ${s}`);
  }
}

main().catch((err) => {
  console.error('generate-placeholder-logos crashed:', err);
  process.exit(1);
});

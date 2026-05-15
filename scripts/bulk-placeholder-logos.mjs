#!/usr/bin/env node
/**
 * Generate brand-colored letter-mark SVGs for any service YAML that doesn't
 * yet have a logo at public/logos/<slug>.svg. The placeholder is good enough
 * to pass check-logos and render cards while real logos are fetched
 * incrementally via scripts/fetch-logo.mjs.
 *
 * Idempotent: skips services that already have a logo.
 * Records each generated placeholder in public/logos/CREDITS.md as "placeholder".
 */
import { readdir, readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const SERVICES_DIR = path.resolve('src/content/services');
const LOGOS_DIR = path.resolve('public/logos');
const CREDITS_FILE = path.join(LOGOS_DIR, 'CREDITS.md');

await mkdir(LOGOS_DIR, { recursive: true });
if (!existsSync(CREDITS_FILE)) {
  await writeFile(
    CREDITS_FILE,
    '# Logo Credits\n\nPer-service logo source attribution. Used to satisfy license terms.\n\n| Slug | Source | Brand hex |\n|---|---|---|\n',
    'utf-8',
  );
}

const entries = await readdir(SERVICES_DIR);
const yamls = entries.filter((e) => /\.(ya?ml)$/.test(e));

let generated = 0;
for (const file of yamls) {
  const data = yaml.load(await readFile(path.join(SERVICES_DIR, file), 'utf-8'));
  const slug = data?.slug;
  if (!slug) continue;
  const target = path.join(LOGOS_DIR, `${slug}.svg`);
  if (existsSync(target)) continue;

  const accent = data.brand_color ?? '#1a1a1a';
  const letter =
    (data.name ?? slug)
      .replace(/[^a-zA-Z]/g, '')
      .charAt(0)
      .toUpperCase() || '?';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${data.name}">
  <rect width="64" height="64" rx="14" fill="${accent}"/>
  <text x="32" y="44" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="36" font-weight="600" fill="#ffffff">${letter}</text>
</svg>
`;

  await writeFile(target, svg, 'utf-8');
  await appendFile(CREDITS_FILE, `| ${slug} | placeholder | ${accent} |\n`, 'utf-8');
  generated++;
}

console.log(`✓ Generated ${generated} placeholder logo(s). Existing logos preserved.`);

#!/usr/bin/env node
/**
 * Verify every service YAML's `logo: /logos/<slug>.svg` resolves to an actual SVG
 * at public/logos/<slug>.svg. Reports missing logos and exits non-zero if any.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const SERVICES_DIR = path.resolve('src/content/services');
const LOGOS_DIR = path.resolve('public/logos');

async function listYaml(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(dir, e.name));
}

async function main() {
  const services = await listYaml(SERVICES_DIR);
  if (services.length === 0) {
    console.log('No services to check.');
    return;
  }

  const missing = [];
  for (const file of services) {
    const raw = await readFile(file, 'utf-8');
    const data = yaml.load(raw);
    if (!data?.logo) {
      missing.push({ file, reason: 'no logo field' });
      continue;
    }
    const logoPath = path.join('public', data.logo);
    if (!existsSync(logoPath)) {
      missing.push({ file, reason: `missing ${logoPath}`, slug: data.slug, logo: data.logo });
    }
  }

  if (missing.length > 0) {
    console.error(`✗ ${missing.length} service(s) have missing logos:`);
    for (const m of missing) {
      console.error(`  · ${path.relative(process.cwd(), m.file)}: ${m.reason}`);
    }
    process.exit(1);
  }
  console.log(`✓ All ${services.length} service logos present.`);
}

main().catch((err) => {
  console.error('check-logos crashed:', err);
  process.exit(1);
});

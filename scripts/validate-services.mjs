#!/usr/bin/env node
/**
 * Validate all service + category YAML files against the Zod schema mirrored from
 * src/content.config.ts. Fast standalone check used by pnpm validate and CI.
 *
 * Exits 0 on success, 1 on first schema error with a file + field message.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { serviceSchema, categorySchema } from '../src/lib/schema.mjs';

const SERVICES_DIR = path.resolve('src/content/services');
const CATEGORIES_DIR = path.resolve('src/content/categories');

async function listYaml(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(dir, e.name));
}

async function validateFile(file, schema, label) {
  const raw = await readFile(file, 'utf-8');
  let parsed;
  try {
    parsed = yaml.load(raw);
  } catch (err) {
    console.error(`✗ ${label} ${file}: YAML parse error: ${err.message}`);
    return false;
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    console.error(`✗ ${label} ${path.relative(process.cwd(), file)}:`);
    for (const issue of result.error.issues) {
      console.error(`  · ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
    return false;
  }
  return true;
}

async function main() {
  const services = await listYaml(SERVICES_DIR);
  const categories = await listYaml(CATEGORIES_DIR);

  console.log(`Validating ${services.length} services and ${categories.length} categories...`);

  let ok = true;
  for (const f of categories) {
    if (!(await validateFile(f, categorySchema, 'category'))) ok = false;
  }
  for (const f of services) {
    if (!(await validateFile(f, serviceSchema, 'service'))) ok = false;
  }

  if (!ok) {
    console.error('\nValidation failed. Fix errors above.');
    process.exit(1);
  }
  console.log(`✓ All ${services.length + categories.length} YAML files valid.`);
}

main().catch((err) => {
  console.error('Validator crashed:', err);
  process.exit(1);
});

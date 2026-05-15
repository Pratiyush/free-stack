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
import { z } from 'zod';

const SERVICES_DIR = path.resolve('src/content/services');
const CATEGORIES_DIR = path.resolve('src/content/categories');

const TIER_TYPES = ['always-free', 'free-plan', 'trial-credit', 'pay-as-you-go'];
const SUBCATEGORIES = ['permanent', 'expiring-credits', 'limited'];

const pricingTier = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
});

const serviceSchema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string().regex(/^[a-z0-9-]+$/),
  subcategory: z.enum(SUBCATEGORIES).optional(),
  brand_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  logo: z.string().regex(/^\/logos\/.+\.svg$/),
  summary: z.string().min(10).max(180),
  notes: z.string().optional(),
  tier_type: z.enum(TIER_TYPES),
  free_tier: z.array(z.string().min(3)).min(1),
  pricing: z.array(pricingTier).min(1),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  official_url: z.string().url(),
  pricing_url: z.string().url().optional(),
  docs_url: z.string().url().optional(),
  date_added: z.coerce.date(),
  date_updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  date_verified: z.coerce.date(),
  last_changed: z.coerce.date().optional(),
  maintainer_notes: z.string().optional(),
  submitted_by: z.string().optional(),
});

const categorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(60),
  blurb: z.string().min(10).max(220),
  icon: z.string().optional(),
  order: z.number().default(100),
  parent: z.string().nullable().optional(),
});

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

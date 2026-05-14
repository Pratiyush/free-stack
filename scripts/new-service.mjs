#!/usr/bin/env node
/**
 * Scaffold a stub service YAML at src/content/services/<slug>.yml.
 * Usage: pnpm new:service <slug>
 *   e.g. pnpm new:service supabase
 */
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: pnpm new:service <slug>');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('Slug must be kebab-case (lowercase a–z, 0–9, -).');
  process.exit(1);
}

const target = path.resolve('src/content/services', `${slug}.yml`);
if (existsSync(target)) {
  console.error(`Already exists: ${target}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const template = `name: ${slug}
slug: ${slug}
category: # <category-slug from docs/category-taxonomy.md>
# subcategory: permanent | expiring-credits | limited (optional; only for ai-apis)
brand_color: "#000000"  # from simpleicons.org
logo: /logos/${slug}.svg

summary: >
  One-line description of what this service does and the headline free-tier
  benefit. Max 180 characters.

tier_type: free-plan  # always-free | free-plan | trial-credit | pay-as-you-go

free_tier:
  - First concrete free-tier benefit
  - Second concrete free-tier benefit

pricing:
  - name: Free
    description: ""
    price: 0
    unit: /month
  - name: Pro
    price: 20
    unit: /month

tags: []

official_url: https://example.com
pricing_url: https://example.com/pricing
# docs_url: https://example.com/docs

date_added: ${today}
date_verified: ${today}
`;

await writeFile(target, template, 'utf-8');
console.log(`✓ Created ${path.relative(process.cwd(), target)}`);
console.log(`Next steps:`);
console.log(`  1. Fill in category, brand_color, summary, free_tier, pricing`);
console.log(`  2. Add public/logos/${slug}.svg (from simpleicons.org if available)`);
console.log(`  3. Run pnpm validate && pnpm check-logos && pnpm build`);

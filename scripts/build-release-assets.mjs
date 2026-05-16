#!/usr/bin/env node
/**
 * Build release assets: a flat JSON index and a flat Markdown export of every
 * service. These get attached to each tagged release by
 * .github/workflows/release-assets.yml so downstream consumers can pin a
 * version of the catalog without scraping the site.
 *
 * Outputs (under dist-assets/):
 *   - index.json     — array of compact service records (same shape as
 *                       compare.astro embeds for client-side filtering)
 *   - services.md    — one section per category, one bullet per service
 *
 * Pure Node — no Astro runtime needed. Reads YAML directly so the script
 * works whether or not `pnpm build` has been run.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = path.resolve('.');
const SERVICES_DIR = path.resolve(ROOT, 'src/content/services');
const CATEGORIES_DIR = path.resolve(ROOT, 'src/content/categories');
const OUT_DIR = path.resolve(ROOT, 'dist-assets');

const SITE_URL = 'https://freestack.is-a.dev';

async function listYaml(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.(ya?ml)$/.test(e.name))
    .map((e) => path.join(dir, e.name));
}

async function loadAll(dir) {
  const files = await listYaml(dir);
  const out = [];
  for (const f of files) {
    const raw = await readFile(f, 'utf-8');
    try {
      const data = yaml.load(raw);
      if (data && typeof data === 'object') out.push(data);
    } catch (err) {
      console.error(`skip ${f}: ${err.message}`);
    }
  }
  return out;
}

function isoDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toISOString().slice(0, 10);
}

/* Strip Markdown emphasis from service names (some YAMLs use **Name**). */
function plainName(name) {
  if (!name) return '';
  return String(name).replace(/\*\*/g, '').replace(/\*/g, '').trim();
}

function buildIndex(services) {
  return services
    .map((s) => ({
      slug: s.slug,
      name: plainName(s.name),
      category: s.category,
      subcategory: s.subcategory ?? null,
      tier_type: s.tier_type,
      brand_color: s.brand_color ?? null,
      logo: s.logo ?? null,
      summary: s.summary ?? '',
      free_tier: Array.isArray(s.free_tier) ? s.free_tier : [],
      tags: Array.isArray(s.tags) ? s.tags : [],
      official_url: s.official_url,
      pricing_url: s.pricing_url ?? s.official_url,
      docs_url: s.docs_url ?? null,
      date_added: isoDate(s.date_added),
      date_verified: isoDate(s.date_verified),
      facets: s.facets ?? {},
      url: `${SITE_URL}/service/${s.slug}`,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function buildMarkdown(services, categories) {
  const today = new Date().toISOString().slice(0, 10);
  const catMeta = new Map(categories.map((c) => [c.slug, c]));

  /* group services by category, sort each group by name */
  const groups = new Map();
  for (const s of services) {
    const arr = groups.get(s.category) ?? [];
    arr.push(s);
    groups.set(s.category, arr);
  }
  for (const arr of groups.values()) {
    arr.sort((a, b) => plainName(a.name).localeCompare(plainName(b.name)));
  }

  /* category order: use category YAML `order` field when present, fallback to alphabetic */
  const orderedCats = [...groups.keys()].sort((a, b) => {
    const ao = catMeta.get(a)?.order ?? 100;
    const bo = catMeta.get(b)?.order ?? 100;
    if (ao !== bo) return ao - bo;
    return a.localeCompare(b);
  });

  const lines = [];
  lines.push(`# free-stack — services export`);
  lines.push('');
  lines.push(
    `Generated ${today} · ${services.length} services across ${orderedCats.length} categories.`,
  );
  lines.push('');
  lines.push(`Source: <${SITE_URL}> · Each entry verified against its official pricing page.`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const slug of orderedCats) {
    const meta = catMeta.get(slug);
    const heading = meta?.name ?? slug;
    const blurb = meta?.blurb ?? '';
    lines.push(`## ${heading}`);
    lines.push('');
    if (blurb) {
      lines.push(`_${blurb}_`);
      lines.push('');
    }
    for (const s of groups.get(slug) ?? []) {
      const name = plainName(s.name);
      const url = `${SITE_URL}/service/${s.slug}`;
      const tier = s.tier_type ?? 'unknown';
      const summary = (s.summary ?? '').replace(/\s+/g, ' ').trim();
      lines.push(`- **[${name}](${url})** — \`${tier}\` — ${summary}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const [services, categories] = await Promise.all([
    loadAll(SERVICES_DIR),
    loadAll(CATEGORIES_DIR),
  ]);

  if (services.length === 0) {
    console.error('No services found — refusing to write empty release assets.');
    process.exit(1);
  }

  const index = buildIndex(services);
  const md = buildMarkdown(services, categories);

  const jsonPath = path.join(OUT_DIR, 'index.json');
  const mdPath = path.join(OUT_DIR, 'services.md');

  await writeFile(jsonPath, JSON.stringify(index, null, 2) + '\n', 'utf-8');
  await writeFile(mdPath, md, 'utf-8');

  console.log(`wrote ${path.relative(ROOT, jsonPath)} — ${index.length} services`);
  console.log(`wrote ${path.relative(ROOT, mdPath)} — ${md.length} bytes`);
}

main().catch((err) => {
  console.error('build-release-assets crashed:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * v3.0.0 — postbuild step that prefixes internal-link hrefs with the site base.
 *
 * Astro DOES auto-prefix static asset URLs (/_astro/, public/) under `base`,
 * but it does NOT rewrite `<a href="/foo">` tags emitted from .astro source.
 * Rather than touching every component to wrap hrefs in u(), we walk dist/*.html
 * and prefix any href starting with `/` that isn't already prefixed.
 *
 * Skips:
 *   - protocol URLs:    href="https://…", href="mailto:…", href="tel:…"
 *   - protocol-relative href="//cdn.example.com"
 *   - hash + query:     href="#main", href="?slugs=…"
 *   - already prefixed: href="/opentier/…"
 *
 * Configurable via PUBLIC_SITE_BASE env (matches astro.config.mjs). Defaults
 * to "/opentier" so today's GH Pages subpath works without env wiring.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const BASE = (process.env.PUBLIC_SITE_BASE ?? '/opentier').replace(/\/$/, '');

if (BASE === '' || BASE === '/') {
  console.log('PUBLIC_SITE_BASE is "/" — no prefixing needed. Exiting clean.');
  process.exit(0);
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.name.endsWith('.html') || e.name.endsWith('.xml')) {
      yield full;
    }
  }
}

function prefixOne(attrName) {
  // attrName is "href" or "src" or "action"
  const re = new RegExp(`\\b${attrName}="(/[^"]*)"`, 'g');
  return (html) =>
    html.replace(re, (m, p) => {
      if (p.startsWith('//')) return m; // protocol-relative
      if (p === BASE || p.startsWith(BASE + '/')) return m; // already prefixed
      return `${attrName}="${BASE}${p}"`;
    });
}

const fixes = [prefixOne('href'), prefixOne('src'), prefixOne('action')];

async function main() {
  try {
    await stat(DIST);
  } catch {
    console.error(`dist/ not found at ${DIST}. Run \`pnpm build\` first.`);
    process.exit(1);
  }

  let touched = 0;
  let unchanged = 0;
  for await (const file of walk(DIST)) {
    const before = await readFile(file, 'utf-8');
    let after = before;
    for (const fn of fixes) after = fn(after);
    if (after !== before) {
      await writeFile(file, after);
      touched++;
    } else {
      unchanged++;
    }
  }
  console.log(`Prefix=${BASE}. Touched: ${touched}  Unchanged: ${unchanged}`);
}

main().catch((err) => {
  console.error('prefix-internal-links crashed:', err);
  process.exit(1);
});

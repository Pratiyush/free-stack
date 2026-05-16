/**
 * Build-time base-aware URL helper. Pages live at one of:
 *   - pratiyush.github.io/opentier/  (today)
 *   - opentier.dev/                  (Day 5 / DNS cutover)
 *
 * `import.meta.env.BASE_URL` is the Astro `base` config (with trailing slash).
 * This helper prefixes any internal path so the same code works at both.
 *
 * Usage in Astro:
 *   import { u } from '~/lib/url';
 *   <a href={u('/catalog')}>Catalog</a>
 *
 * Falsy paths return the base ("/" or "/opentier") so it can be passed safely
 * to <a href={u('/')}>.
 */
export function u(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path || path === '/') return base + '/';
  // Already absolute (http(s)://, mailto:, tel:, anchors, etc.) → pass through.
  if (/^([a-z]+:|#|\?)/i.test(path)) return path;
  return base + (path.startsWith('/') ? '' : '/') + path;
}

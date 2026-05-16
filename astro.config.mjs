import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import tailwindcss from '@tailwindcss/vite';

// v3.0.0 rebrand — opentier.dev replaces opentier / opentier.dev.
//
// `base` is read from PUBLIC_SITE_BASE so one config works for both the
// GitHub Pages subpath (pratiyush.github.io/opentier/) and the eventual
// apex opentier.dev custom domain. Set in the deploy workflow:
//
//   - Pages preview today:        PUBLIC_SITE_BASE=/opentier
//   - opentier.dev custom domain: PUBLIC_SITE_BASE=/
//
// Default is the Pages subpath since that's what's live until DNS lands.
const BASE = process.env.PUBLIC_SITE_BASE ?? '/opentier';

export default defineConfig({
  site: 'https://opentier.dev',
  base: BASE,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
});

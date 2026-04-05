# Documentation & CMS

> Documentation hosting, wikis, and content management with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| GitBook | Free for individuals & OSS | Unlimited traffic, public publishing, GitBook subdomain, Git sync | 1 user only, no team collaboration, no custom domain on free (custom domain requires $65/mo+) | ✅ 2026-04 | [gitbook.com/pricing](https://www.gitbook.com/pricing) |
| Read the Docs | Free for open-source (community) | Unlimited builds, unlimited bandwidth, versioned docs, search | Public/open-source projects only, ad-supported (EthicalAds) | ✅ 2026-04 | [about.readthedocs.com/pricing](https://about.readthedocs.com/pricing/) |
| Hashnode | Free forever (all users) | Unlimited posts, custom domain, GitHub backup, built-in newsletter, analytics | Single-author blog; team features require Startup plan ($199/mo) | ✅ 2026-04 | [hashnode.com/pricing](https://hashnode.com/pricing) |
| Mintlify | Hobby plan (free) | Custom domain, web editor, API playground, MDX support, LLM-optimized docs (llms.txt, MCP servers) | 1 editor seat, no AI features, no collaboration; Pro is $250/mo | ✅ 2026-04 | [mintlify.com/pricing](https://www.mintlify.com/pricing) |
| Notion | Free plan (permanent) | Unlimited pages & blocks (single user), 5MB file upload limit, 10 guest collaborators | 7-day version history, no AI on free tier, 1 synced DB (100 rows) | ✅ 2026-04 | [notion.com/pricing](https://www.notion.com/pricing) |
| Docusaurus + GitHub Pages | Fully free (OSS + free hosting) | Unlimited pages, Markdown/MDX, versioning, search, i18n | Static site generator -- deploy free on GitHub Pages (1GB site, 100GB bandwidth/mo) or Cloudflare Pages (unlimited) | ✅ 2026-04 | [docusaurus.io](https://docusaurus.io/) |
| Docsify + GitHub Pages | Fully free (OSS + free hosting) | No build step, Markdown-based, plugins for search/theming | Client-side rendered; same GitHub Pages limits (1GB site, 100GB bandwidth/mo) | ✅ 2026-04 | [docsify.js.org](https://docsify.js.org/) |
| Nextra | Fully free (OSS, MIT license) | Next.js-based, MDX, full-text search (Pagefind), themes for docs & blog | Static site generator -- deploy on Vercel/Cloudflare/Netlify free tiers. Used by Next.js, React, Tailwind docs | ✅ 2026-04 | [nextra.site](https://nextra.site/) |
| Starlight (Astro) | Fully free (OSS, MIT license) | Astro-based, Markdown/MDX/Markdoc, built-in search (Pagefind), i18n, dark/light themes, accessibility | Framework-agnostic: extend with React, Vue, Svelte, Solid. Deploy on any static host | ✅ 2026-04 | [starlight.astro.build](https://starlight.astro.build/) |
| Fumadocs | Fully free (OSS, MIT license) | Next.js-native, built-in OpenAPI rendering, full-text search (Orama), headless component API | Supports Next.js, Tanstack Start, React Router, Waku. ~150K downloads/mo and growing fast | ✅ 2026-04 | [fumadocs.dev](https://www.fumadocs.dev/) |

## Notes

- **Ghost** was evaluated but excluded: Ghost CMS is open-source (self-host free), but Ghost(Pro) managed hosting starts at $15/mo with no free tier.
- **GitBook** free tier no longer includes custom domains -- custom domains now require the Premium plan ($65/mo+). Open-source projects can apply for a Sponsored Site plan (ad-supported) to access premium features for free.
- **Nextra**, **Starlight**, and **Fumadocs** are static site generators, not hosted platforms -- pair with free hosting (Vercel, Cloudflare Pages, Netlify, GitHub Pages) for a fully free docs stack.
- **Fumadocs** is the fastest-growing option for Next.js teams (3x YoY download growth). It powers docs for v0 by Vercel and offers a uniquely composable architecture (Content -> Core -> UI).
- **Starlight** is built on Astro and is framework-agnostic -- supports React, Vue, Svelte, and Solid components within docs pages.
- **Read the Docs** is the gold standard for open-source Python/Sphinx docs but also supports MkDocs.
- **Hashnode** is the most generous hosted option: truly free with custom domains, newsletters, and GitHub backup included.
- **Mintlify** now ships LLM-ready output (llms.txt, skill.md, auto-generated MCP servers) free on every tier including Hobby.

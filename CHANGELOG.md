# Changelog

All notable changes to free-stack are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Maintainers: add entries under `## [Unreleased]` as PRs merge. At release time, rename `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` and start a fresh `[Unreleased]` block.

---

## [Unreleased]

Sprint 3 progress toward `v0.5.0`. Entries land as PRs merge to `rebuild/astro`; finalised at tag time.

### Added

- `scripts/migrate-md-to-yaml.mjs` — parse the legacy `categories/*.md` tables and emit typed service YAML, with subcategory detection from section headings (`permanent` / `expiring-credits` / `limited`).
- `scripts/audit-services.mjs` — post-migration audit: hex `brand_color`, logo file presence, summary length, optional pricing URL HTTP check. CI gate runs `pnpm audit-services --no-http` after `check-logos`.
- `package.json` scripts: `migrate-md`, `audit-services`.
- 17 missing category YAMLs to complete the 27-category taxonomy (baas, code-quality, collaboration, communication, containers, design, dev-tools, documentation, iaas, logs, maps, mobile, paas, payments, project-management, security, translation).
- 252 service YAML files migrated from `categories/*.md` — catalog grows from 50 seeded → 302 total services. Each new YAML carries placeholder `brand_color: '#888888'` and a logo path filled by the Sprint-3 logo sweep.
- `docs/sprints/sprint-3.md` — detailed Sprint-3 execution plan with per-service migration tracker (305 subtasks, 48 pre-checked from v0.2.0 seeds), per-service AC, per-category AC, and Visual Verification Protocol.
- `docs/sprints/sprint-3.md` §10 — Playwright pricing-drift verification spec for story 3.11 (text-presence checks against live `pricing_url` for both free-tier limits and paid plan prices; hard-fails on sunset phrases; integrates with Sprint-5 monthly cron).

### Fixed

- Migration script emits `brand_color: '#888888'` (was `'888888'` without the `#`, which failed the `^#[0-9a-fA-F]{6}$` schema regex).
- Migration script `buildSummary` enforces the schema's 10-char minimum by falling back to `<Service> — free tier; see the pricing page for details.` when the source MD's Free Tier + Key Limits columns produce a too-short string.
- Audit script demotes "missing logo file" from error to warn, so CI stays green between story 3.5 (migration stubs) and 3.6 (logo sweep). `--strict` flips it back to fail before tagging.

---

## [0.2.0] - 2026-05-15 — Seed Catalogue

### Added

- 4 UI primitives in `src/components/ui/`: `ServiceCard.astro`, `TierBadge.astro`, `CategoryChip.astro`, `SearchBox.astro`
- Brand-colored service cards — accent strip rendered from each service's `brand_color` (simpleicons.org hex)
- Logo asset pipeline (`scripts/fetch-logo.mjs`) with mandatory source order: simpleicons.org → freeicons.io → Lucide; documented in `docs/logo-fallback.md`
- 50 seed services across 10 categories in `src/content/services/` + `src/content/categories/`
- 51 brand-colored placeholder logos in `public/logos/`
- Home page (`/`) — editorial hero, recently-verified strip, category grid
- Catalog page (`/catalog`) with `SearchBox`, tier-type filter, category filter
- Service detail page (`/service/[slug]`) with pricing table, free-tier bullets, last-verified date, outbound links with `rel="noopener noreferrer"`
- Category listing page (`/category/[slug]`) — generates a page per seed category at build time
- Supporting pages: `/sponsors` (non-commercial banner, donate buttons), `/submit` (deep-links to issue forms), `/about`, `/methodology`, branded `/404`
- Components preview page (`/components-preview`) for primitives

### Changed

- Home page is now editorial (Fraunces hero, paper-cream palette) — sponsor purple confined to `/sponsors` and footer only

---

## [0.1.0] - 2026-05-15 — Astro 6 Foundation

### Added

- Astro 6 project scaffold with TypeScript strict mode
- Zod content schema for services and categories (`src/content.config.ts`)
- Design tokens (`src/styles/tokens.css`) and global styles
- `BaseLayout.astro` with editorial typography (Fraunces / Inter Tight / JetBrains Mono)
- Smoke-test home page at `/`
- Maintenance scripts: `pnpm validate`, `pnpm check-logos`, `pnpm new:service`
- CI workflow (`.github/workflows/ci.yml`): lint → validate → check-logos → build
- GitHub Pages preview deploy for the `rebuild/astro` branch
- Conventional Commits PR-title lint workflow
- `.github/FUNDING.yml` for GitHub Sponsors + Buy Me a Coffee
- `docs/category-taxonomy.md` — locked taxonomy for the 27 categories
- `release-notes/v0.1.0.md` — first release notes file in the new workflow

### Changed

- Reformatted CHANGELOG into Keep a Changelog 1.1.0 structure
- Project now uses pnpm (was: ad-hoc edits to a static HTML page)
- `.gitignore` adds Astro build artifacts (`dist/`, `.astro/`, `node_modules/`)

### Deprecated

- `.github/workflows/deploy-pages.yml` — the legacy GitHub Pages deploy that serves `docs/index.html` will retire when the Astro site cuts over at `v0.5.0`

---

## [1.0.0] - 2026-04-05 — MD-era launch (frozen snapshot)

### Stats

- 323 verified entries across 27 categories
- Every entry verified against official pricing pages (April 2026)
- 58 signed commits, all by Pratiyush Kumar Singh

### Added since [0.1.0-md]

- 9 new categories: `code-quality`, `project-management`, `maps`, `containers`, `logs`, `docs`, `communication`, `translation`, `iaas`
- Deep-verified all 27 categories with web research (official pricing pages)
- Top Picks section in README
- "Services We Don't Include" section (dead/removed free tiers)
- Entry counts per category in README
- GPG-signed commits
- CI link checker fix (accept redirects, non-blocking)

### Key findings from verification

- Firebase Auth Spark plan uses 3K DAU limit (not 50K MAU)
- Gemini API cut free limits 50–80% in Dec 2025
- Mixpanel switched to 20M events/mo free (Feb 2026)
- Appwrite pauses after 7 days inactivity (Feb 2026)
- Let's Encrypt switching to 45-day certs (May 2026)
- Postman eliminated free team plans (Mar 2026)
- Fauna shut down (May 2025)
- Microsoft AppCenter retired (Mar 2025)

---

## [0.1.0-md] - 2026-04-05 — Initial MD content (renamed from `[0.1.0]` to disambiguate from upcoming Astro `v0.1.0`)

### Added

- 18 category files with ~160 verified entries total
- Categories: `hosting`, `databases`, `auth`, `analytics`, `ai-ml`, `email`, `storage`, `testing`, `dev-tools`, `dns`, `search`, `security`, `mobile`, `paas`, `baas`, `design`, `payments`, `collaboration`
- README with category index table
- CONTRIBUTING.md with quality bar and style guide
- PR template with verification checklist
- Issue templates (add-service, report-outdated, suggest-category)
- GitHub Actions: weekly link checker (lychee)
- MIT License

### Removed (verified as no longer free)

- PlanetScale (free tier removed Apr 2024)
- ElephantSQL (shut down Jan 2025)
- Heroku (free tier removed 2022)
- Railway (trial credit only)
- Fly.io (free tier removed for new users 2024)
- SendGrid (free tier removed May 2025)
- Travis CI (no meaningful free tier since 2020)

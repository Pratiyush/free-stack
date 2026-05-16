# Changelog

All notable changes to free-stack are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Maintainers: add entries under `## [Unreleased]` as PRs merge. At release time, rename `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` and start a fresh `[Unreleased]` block.

---

## [Unreleased]

Next: 5-day storytelling launch sprint. Day 2 ships sponsor plumbing (`<SponsorMeter />`, `/sponsors` redesign, $100/month target). Day 3 expands the YAML schema with 10 new optional fields (signup_friction, free_tier_limits, regional_pricing, tos_red_flags, refund_policy, support_sla, compliance_certifications, inactive_account_policy, rate_limits, contract_terms) — additive, no migration. Day 4 backfills the new fields on top-20 services. Day 5 publishes the live Lighthouse audit + the sponsor pitch. v2.1 finishes 5.1b (per-service OG cards) + 5.1c (font subset).

---

## [2.0.0] - 2026-05-16 — Production Quality

Sprint 5 ships. The site has the trust plumbing it needs to live in public: a takedown policy with a 48-hour SLA, monthly verification cron, Playwright drift verifier, WCAG AA contrast pass, full SEO essentials. The content layer gained structured `facets:` and `tags:` blocks on all 300 services. New annual report at `/state-of-free-tiers/2026`. Three pre-existing critical bugs caught and fixed (RSS, deploy branch, search wiring).

### Added

**Trust + legal**

- `/legal` page + takedown policy (story 5.6). Removal mailto, 48-hour SLA, `removals@freestack.is-a.dev` via Cloudflare Email Routing. Footer link from every page.
- SEO essentials (story 5.3): `og:image` + Twitter card meta on every page, BreadcrumbList JSON-LD on category + service pages, Organization + WebSite + SearchAction schema on home, `theme-color`, `color-scheme` meta.

**Tooling**

- `.github/workflows/monthly-verify.yml` (story 5.7) — 1st-of-month cron opens a GitHub issue listing services with `date_verified` > 60 days old. `scripts/stale-services.mjs` powers it.
- `src/pages/changelog.astro` (story 5.7) — public `/changelog` page rendering this file with per-version anchors (`#200`, `#090`, etc.).
- `.github/workflows/release-assets.yml` + `scripts/build-release-assets.mjs` (story 5.7) — on tag push, attaches `dist-assets/index.json` (225 KB, 300 services) + `dist-assets/services.md` (44 KB, 27-section flat Markdown) to the GitHub Release.
- `tests/pricing-drift.spec.ts` (story 5.8) — Playwright drift verifier for ~20 JS-rendered / bot-blocked services. Weekly cron at Mondays 09:00 UTC; on failure opens a `pricing-drift`-labelled issue. `playwright.config.ts` + `scripts/identify-js-rendered-services.mjs` + `docs/playwright-verifier.md`.
- Opt-in Cloudflare Web Analytics (story 5.12) — env-gated via `PUBLIC_CF_ANALYTICS_TOKEN`. No cookies, no PII, no JS unless the token is set. `.env.example` documents.

**Process**

- `.github/CODEOWNERS` (story 5.9) — routes `src/content/services/`, `src/content/categories/`, schema, docs, workflows, CLAUDE.md to `@Pratiyush`.
- Five YAML issue forms (story 5.9): `01-submit-service.yml`, `02-pricing-change.yml`, `03-free-tier-removed.yml`, `04-suggest-category.yml`, `05-other.yml`, plus `config.yml` disabling blank issues. Replaces the 5 legacy `.md` templates.
- `.github/release-drafter.yml` + `.github/workflows/release-drafter.yml` (story 5.9) — auto-categorises merged PRs into draft release notes by label.

**Content**

- `facets:` block populated on all 300 services (story 5.4). 109 services have at least one extracted facet across 10 typed keys (`storage_gb`, `bandwidth_gb_month`, `requests_per_day`, `requests_per_month`, `cc_required`, `oss`, `self_host`, `team_seats`, `credit_usd`, `api_access`). 191 services carry empty `facets: {}` — schema-valid, "not yet quantified."
- `tags:` populated on all 300 services (story 5.5). 1,315 total tag entries, avg 4.4 per service, kebab-case, deduped. Tags derived from category + subcategory + tier_type + free_tier text + summary heuristics.
- `src/pages/state-of-free-tiers/2026.astro` (story 5.13) — annual report, ~1,300 words across 8 roman-numeral sections (dateline, stat grid, most improved, biggest cuts, dead services, methodology, 2027 outlook, colophon). Datelined as Issue №009.

**Code quality (story 5.10)**

- `src/lib/schema.mjs` + `src/lib/schema.ts` — Zod schemas extracted from `src/content.config.ts` so both Node scripts (`audit-services.mjs`, `validate-services.mjs`) and Astro pages (`~/lib/schema`) share a single source of truth.
- `src/lib/theme.ts` — `FALLBACK_BRAND_COLOR` + `PLACEHOLDER_BRAND_COLOR` exported, replacing scattered `#1a1a1a` + `#888888` literals.

**Tools used to ship the catalog**

- `scripts/backfill-facets-tags.mjs` (story 5.4 + 5.5) — pure-heuristic derivation from free_tier bullets + category + summary. No web fetches. Auto-protects existing values via merge. `--dry-run` flag for safe preview.
- `scripts/visual-snap.mjs` (story 5.0d) — Playwright screenshot of 7 key pages × 2 viewports for design review.

### Changed

- WCAG AA contrast (story 5.2) — tokens bumped: `--color-ink-soft: #4a443e` (was `#5a5550`; 7.5:1 on paper), `--color-ink-faint: #6b6460` (was `#8a8580`; 5.5:1, was failing), `--color-coral: #b73d22` (was `#d94c2a`; 5.8:1, was failing). `--color-coral-accent: #d94c2a` kept for borders/dots only.
- BaseLayout (story 5.2 + 5.3 + 5.6 + 5.12) — adds skip-to-main link, `:focus-visible` outline, og:image + Twitter card meta, `theme-color` + `color-scheme` meta, env-gated CF beacon, `/legal` footer link. Drops the useless same-origin `<link rel="preconnect">`.
- `src/pages/service/[slug].astro` (story 5.3 + 5.10) — JSON-LD switched to `@graph` with SoftwareApplication + BreadcrumbList. Added `availability: https://schema.org/InStock`. Replaced `any` types with `ServiceEntry`, `PricingTier`, `Sources` from `~/lib/schema`. Switched `collectSources` from `Array.isArray(s.overrides)` to `Object.entries(s.overrides)` (latent bug fix).
- `src/pages/category/[slug].astro` (story 5.3 + 5.11) — CollectionPage + BreadcrumbList JSON-LD. Empty state rebuilt as paper-warm dashed card matching `/catalog` style.
- `src/pages/index.astro` (story 5.3 + 5.10) — Organization + WebSite + SearchAction JSON-LD via `@graph`. Imports brand-color constants from `~/lib/theme`. Bumped Issue № to 009.
- `src/components/ui/ServiceTable.astro` (story 5.11) — `.hide-mobile` class on Category/Quotas/CC columns; drops `min-width` below 720px.
- `src/pages/compare.astro` (story 5.11) — 6 quick-start chips (anthropic-claude, groq, supabase, vercel, neon, openai) visible when slugs count is 0.

### Fixed

- **`SearchBox` wired to Pagefind** (story 5.0c) — search input was a ghost feature; built index but never queried it. Now does what it says, debounced 80ms, with zero-state "No services match these filters" card.
- **`deploy-pages.yml` branch reference** (story 5.0b) — was targeting non-existent `main`; corrected to `master` (canonical) + removed obsolete `categories/**` path filter.
- **RSS audit false-positive** (story 5.0a) — auditor reported RSS truncated to 1 item; the feed is fine (50 `<item>` elements verified). Auditor was tripped by the minified one-line XML format.
- Prettier auto-formatted 9 new files to keep CI green.

### Deferred (split to v2.1)

- **5.1b — Per-service OG cards** (1200×630 PNGs). Every page falls back to `favicon.svg` today. Tracked as task #72.
- **5.1c — Self-host font subset + preload critical face**. Fontsource Variable doesn't ship per-subset; needs a one-off solution. Tracked as task #73.
- **5.1d — Live Lighthouse audit baseline**. Measure on production domain, write `docs/lighthouse-baseline.md`. Tracked as task #74.

### Deferred (upstream)

- **5.14 — DNS cutover to `freestack.is-a.dev`** — upstream is-a.dev PR, not in our repo.

### Stats

- 339 pages built. 327 YAMLs valid (300 services + 27 categories). Pagefind indexed 339 pages. Sitemap: 336 URLs.
- 1,315 tag entries. 109 services with extracted facets. 50 services with placeholder `brand_color: '#888888'` (logo cascade follow-up).
- 16 Sprint-5 stories shipped. 3 deferred to v2.1. 1 deferred upstream.

---

## [0.9.0] - 2026-05-15 — Content Depth + View Modes

Every service now carries the full pricing breakdown — every published tier, every feature, every signup URL. The catalog can render as grid or info-dense table with inline-expand on row click. Hero is bigger, with dateline + Issue № inline, sidebar pull-quote, and a stronger 6-column wall of brand-colored logos.

### Added

- **Schema additions** (purely additive — all 300 existing YAMLs validate unchanged):
  - `pricingTier`: optional `features[]` (bullet list of what's included), `cta_url` (tier-specific signup link), `billing` (monthly / annual / one-time / usage-based / free).
  - Service: optional `paid_tier_highlights[]` (3-5 bullets summarising what users get above Free).
- **`src/components/ui/ViewToggle.astro`** — Grid ↔ Table chip pair. Persists to `localStorage` + URL `?view=table`.
- **`src/components/ui/ServiceTable.astro`** — info-dense table renderer with sortable columns, brand-color row accent, inline-expand accordion. Pattern from `ref/design-experiments/table.html` + `dashboard.html`.
- **12 parallel content-expansion agents** (background) — each owned a batch of 25 services, fetched live pricing pages, extracted every tier into the new schema. Total: **271/300 services expanded** (29 skipped as bot-blocked / JS-rendered; tracked for Sprint 5 Playwright verifier).

### Changed

- **`src/pages/index.astro`** — Issue № + dateline merged INTO the hero (above the h1, not a separate strip). H1 capped at 5.5rem (was 4.4rem). Added sidebar pull-quote drawn from `ref/docs/CONVERSATION.md`. Wall-of-logos is now a fixed 6-column grid with service names visible by default. View Transition wired on wall-tile click.
- **`src/pages/catalog.astro`** — dual-render with grid AND table view; toggle controls `[hidden]`. Filters now sync to table-row visibility too.
- **`src/pages/category/[slug].astro`** — same dual-render with view toggle.
- **271 services** received fresh `pricing[]` arrays with `features[]` / `cta_url` / `billing` per tier, plus a service-level `paid_tier_highlights[]`. `date_verified` and `date_updated` bumped to `2026-05-15` across all updated entries.
- **3 YAML quoting fixes** — `betterstack.yml`, `tidb-cloud-starter.yml`, `twilio.yml`, `turso.yml`, `typesense-cloud.yml` had list items containing colons (e.g. `- Enterprise add-ons: SSO, ...`) that YAML parses as mappings; wrapped in quotes.
- **One YAML parse fix** — `loops.yml` had `- "Powered by Loops" footer branding` (quoted prefix + unquoted suffix → parse error). Re-quoted as full string.

### Skipped (deferred to Sprint 5 Playwright verifier)

29 services across 4 batches couldn't be expanded via WebFetch because their pricing pages are bot-blocked or JS-rendered:
- brevo, brevo-sendinblue, canva (Cloudflare interstitial)
- coherence (ECONNREFUSED across hosts), crowdin (JS-rendered)
- linode-akamai (Akamai 403), meta-llama-api (no public pricing)
- papertrail (SolarWinds 403), qodana-jetbrains, quay-io (RedHat 403)
- render, sendbird (domain safety check), strapi-cloud (JS-rendered)
- umami-cloud, vonage (403), youtrack (JS-rendered)

---

## [0.8.0] - 2026-05-15 — Editorial Polish

Sprint 4 ships the v4 design pass synthesised from the 10-agent review of `ref/`. The catalog reads like an almanac now: periodic-table cards with brand-colored head-bands, Issue №/dateline chrome on every service page, a wall-of-logos hero, View Transitions, and a real `/compare?slugs=…` route.

### Added

- **`src/pages/compare.astro`** — real `/compare?slugs=…` route with type-to-search picker, sortable facet rows grouped by Overview / Quotas / Capabilities / Restrictions / Trial / Operational, URL state sync, max 4 services, fully client-side from a pre-rendered JSON blob.
- **`docs/sprints/sprint-4.md`** — Sprint 4 plan including all 6 stories, spec deltas vs the v3 brief, and the parallel-track outline.
- **View Transitions** — `<ClientRouter />` in BaseLayout + `transition:name="card-<slug>"` on cards; catalog → detail animates smoothly without a JS framework.
- **Tokens** — `--color-paper-warm` (hero zones), `--color-ink-softer` (masthead bands), `--color-ink-faint` (serials, dateline metadata).

### Changed

- **`ServiceCard.astro`** rebuilt with periodic-table treatment: 4px brand-color head-band on top (was 4px left strip), 9% brand-tinted hero zone, framed white logo inset, hanging em-dash bullets, conditional `cc_required` pill, border-color-only hover (no translate).
- **`src/pages/service/[slug].astro`** rebuilt with editorial almanac chrome: `§ <CATEGORY> · № <SERIAL>` masthead, italic Fraunces h1, mono uppercase `VERIFIED · ADDED` dateline rule, roman-numeral section dividers, italic Fraunces brand-color Free row in the pricing table, footnote-style sources block.
- **`src/pages/index.astro`** rebuilt with editorial hero: masthead bar (Issue №005 · May 2026 / VERIFIED date), paper-cream + radial coral tints, italic Fraunces h1 with brand-color emphasis, stats as a definition list, 48-tile periodic-table wall-of-logos that lights up on hover.
- **`src/pages/catalog.astro`** — sticky filter bar with IntersectionObserver sentinel pattern; coral focus-visible ring on filter buttons.

### Skipped / deferred to v0.9.0

- Full hash-sync overlay drawer (View Transitions handle the navigation case now)
- Filter category chips with live counts
- `__all` reset chip pattern

---

## [0.5.0] - 2026-05-15 — Full Migration

Sprint 3 ships. Every service is now a typed YAML record; the legacy 27 Markdown tables are gone; the catalogue carries optional `facets` + `sources` blocks for the comparison-table renderer; logo coverage reaches ~83% (250/300 services with real brand colors + tinted SVGs).

### Added

**Tooling**
- `scripts/migrate-md-to-yaml.mjs` — parse the legacy `categories/*.md` tables and emit typed service YAML, with subcategory detection from section headings (`permanent` / `expiring-credits` / `limited`).
- `scripts/audit-services.mjs` — post-migration audit: hex `brand_color`, logo file presence, summary length, optional pricing URL HTTP check. CI gate runs `pnpm audit-services --no-http` after `check-logos`.
- `scripts/bulk-fetch-logos.mjs` + `simple-icons` dependency — bulk-fetch real brand colors and tinted SVG logos from simpleicons.org for every service.
- `package.json` scripts: `migrate-md`, `audit-services`, `bulk-fetch-logos`.

**Schema**
- Optional `facets` block on the service schema (18 fields covering quotas, capabilities, restrictions, trial/credit info, operational characteristics).
- Optional `sources` block on the service schema (per-record provenance for pricing + brand assets + per-field overrides).

**Content (catalog)**
- 17 missing category YAMLs to complete the 27-category taxonomy (baas, code-quality, collaboration, communication, containers, design, dev-tools, documentation, iaas, logs, maps, mobile, paas, payments, project-management, security, translation).
- 252 service YAML files migrated from `categories/*.md` — catalog grew from 50 seeded → 302 services initially; net 300 after triage removed 2 dead services.
- 146 real brand colors + colored logo SVGs from simpleicons.org (story 3.6 sweep — 60.6% coverage; remaining ~106 services fall back via lobe-icons + devicon + selfh.st cascade in story 3.7).

**Routes / rendering**
- Subcategory rendering on `/category/<slug>` pages — three sections (Permanent Free Tiers / Free Credits & Trial / Severely Limited) with counts and per-section blurbs. Empty sections are skipped.
- Sitemap (`/sitemap-index.xml` + `/sitemap-0.xml`, 336 entries via `@astrojs/sitemap`).
- RSS feed at `/rss.xml` — 50 most-recently-verified services with absolute URLs, sorted by `date_verified` desc.
- Schema.org `SoftwareApplication` JSON-LD in `<head>` on every `/service/<slug>` page (description, offers, applicationCategory).

**Verification (story 3.11 first run)**
- `data/pricing-verify-report.json` — 300-service pricing-drift report from a 6-sub-agent parallel curl sweep.
- `docs/sprints/sprint-3-pricing-drift.md` — human-readable triage MD with real-drift / likely-false-positive / weak-sunset / bot-blocked / needs-JS / error buckets.

**Docs**
- `docs/sprints/sprint-3.md` — detailed Sprint-3 execution plan with per-service migration tracker (305 subtasks, 48 pre-checked from v0.2.0 seeds), per-service AC, per-category AC, Visual Verification Protocol, and §10 Playwright pricing-drift verification spec.
- `ref/design-experiments/combined-v3.html` + `v3-design-brief.html` + `v3-design-brief-prompt.txt` + `screenshots/` — packaged hand-off for the v4 design pass (gitignored under `ref/`, local-only).

### Changed

- 300-service catalogue replaces the legacy MD-table corpus. Every record is a Zod-validated YAML.
- 76 services received `date_verified` bumps to `2026-05-15` after the triage sweep (60 confirm-pass + 16 with content updates).
- 16 services updated with drift fixes — notable: Mixpanel free tier shrank from 20M → 1M events/month; Cloudflare Workers AI pay-as-you-go corrected from $0.50/1M → $0.011/1K neurons; Argos CI renamed "Free" → "Hobby"; Koyeb shifted from always-free to credit-based; POEditor free tier shrank 30k → 1k strings.
- 2 URL fixes: `netlify-dns` pricing_url corrected (was 404); `orama` pricing_url switched from JS-rendered docs to static `/pricing` page.

### Removed

- Service `tebi` — pivoted from S3-compatible storage to hospitality POS; previous 25 GB / 250 GB free tier no longer exists.
- Service `adaptable-io` — confirmed shut down February 2025; DNS A-record gone.

### Fixed

- Migration script emits `brand_color: '#888888'` (was `'888888'` without the `#`, which failed the `^#[0-9a-fA-F]{6}$` schema regex).
- Migration script `buildSummary` enforces the schema's 10-char minimum by falling back to `<Service> — free tier; see the pricing page for details.` when the source MD's Free Tier + Key Limits columns produce a too-short string.
- Audit script demotes "missing logo file" from error to warn, so CI stays green between story 3.5 (migration stubs) and 3.6 (logo sweep). `--strict` flips it back to fail before tagging.

### Deferred to v0.8.0+

- Story 3.13 — production cut-over to the Astro build (`freestack.is-a.dev` still points at the v1.0.0 MD-era site).
- Story 3.14b — Astro port of catalog from v4 mockup (blocked on external v4 design pass per `ref/design-experiments/v3-design-brief.html`).
- Playwright pricing-drift verifier (Sprint 4 §10 of `docs/sprints/sprint-3.md`).
- Compare modal as `/compare?slugs=a,b,c` real route.
- Story 3.7 residual: ~50 services still carry `brand_color: '#888888'` placeholder; the cascade fell back to monochrome for self-hosted or niche services. Logged in `docs/logo-coverage.md` for follow-up.

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

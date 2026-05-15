# Sprint 5 — `v2.0.0` "Production Quality"

> **Source of truth.** Refined from an 8-agent project audit on 2026-05-15 + the Sprint 5 question round in conversation. 18 stories, 3-4 week duration. Replaces the old Sprint 5 stub.

**Owner:** Pratiyush  **Branch base:** `rebuild/astro`  **Tag on completion:** `v2.0.0`  **Generated:** 2026-05-15

---

## Sprint goal

Take free-stack from "feature-complete v0.9.0" to "production-grade v2.0.0": fix 3 critical bugs found in audit, hit Lighthouse 98+, pass WCAG 2.2 AA, ship SEO essentials, populate the content gaps that the compare page needs, cut over `freestack.is-a.dev` from the legacy MD site to the Astro build, and launch with social posts (drafts for maintainer review).

## Locked decisions (from 2026-05-15 AskUserQuestion round 4)

- **Scope:** all 18 stories. 3-4 week sprint.
- **Facets backfill:** parallel agents + WebFetch live pricing (story 5.4).
- **First task next session:** Lighthouse audit + a11y contrast fixes (story 5.1 + 5.2).
- **Hosting:** stay on GitHub Pages (confirmed previously).
- **Marketing:** drafts queued in `marketing/`, posted AFTER v2.0.0 ships.

---

## 3 critical bugs found in the audit (5.0 — Tier 0)

These were silently broken and not in the prior plan.

### 5.0a — Fix the RSS feed (broken — 1 malformed item)
**Symptom:** `dist/rss.xml` has only a single `</item>` close tag; the feed renderer is collapsing all entries.
**Fix:** debug `astro-rss` integration; likely a content-collection iterator issue. Validate against W3C feed validator after.
**Owner:** astro-implementer.

### 5.0b — Fix `deploy-pages.yml` branch trigger (main → master/rebuild-astro)
**Symptom:** workflow triggers on `push: branches: [main]` but `main` doesn't exist; only `master` and `rebuild/astro` are canonical.
**Fix:** change to `branches: [master, rebuild/astro]`. Decide which deploys to which Pages target.
**Owner:** astro-tech-lead.

### 5.0c — Wire the SearchBox to the catalog grid (currently a ghost feature)
**Symptom:** `<SearchBox id="catalog-search" />` renders on `/catalog` but no JS handler filters the grid.
**Fix:** add an input event listener that filters cards + table rows by name/slug, updates result count, composes with existing tier+category filters.
**Owner:** astro-implementer.

---

## Stories — Tier 1 (block production cutover)

### 5.1 — Lighthouse 98+ audit + CI budget
**Quick wins from the perf audit:**
- Defer Pagefind to `/catalog` only (saves ~300KB on every other page)
- Preload Inter Tight (body font) in `<head>`; lazy-load Fraunces / JBM
- Drop unused Fontsource subsets (cyrillic / vietnamese / greek) — ~120KB
- Audit ClientRouter (View Transitions) — 16KB JS; test with and without; remove if TTI improves
- Compare page: defer the 132KB inline JSON to a separate fetch OR paginate

**Deliverable:** `.github/workflows/lighthouse.yml` with mobile budget ≥98, desktop ≥99. PR fails on regression.

### 5.2 — Accessibility WCAG 2.2 AA fixes
**From the a11y audit:**
- Bump `--color-ink-faint` from `#8a8580` to `#6b6460` (passes 5.5:1 on paper)
- Darken or reposition `--color-coral` so text uses don't fail 4.5:1 (consider: coral stays for accents only, not text)
- Compare picker: add `role="dialog"` + `aria-modal="true"` + focus trap + escape-to-close
- Add `:focus-visible` to picker buttons, view-toggle, detail-link
- Add skip-to-main link in `BaseLayout.astro`
- Add `aria-live="polite"` to compare-page lede + empty state
- Mobile: compare picker results dropdown overflow fix at 360px

### 5.3 — SEO essentials
**From the SEO audit:**
- Add `og:image` (default site logo SVG; per-service brand-color composite later)
- Add Twitter card meta (`twitter:card`, `twitter:title`, etc.) to `BaseLayout`
- Add `BreadcrumbList` JSON-LD on `/service/[slug]` and `/category/[slug]`
- Add `Organization` + `WebSite` (with `potentialAction` SearchAction) on home page
- `SoftwareApplication` schema: add `availability: 'InStock'` and tier-specific `applicationCategory` (currently hardcoded `DeveloperApplication`)

### 5.6 — Takedown policy + `/legal` page + removals@ email
- `src/pages/legal.astro` — trademark disclaimer, 48-hour removal promise, GDPR/CCPA stance, contact `removals@freestack.is-a.dev`
- Cloudflare Email Routing setup (free) forwarding `removals@` to maintainer inbox
- Footer link in `BaseLayout`
- `docs/takedown-policy.md` for the maintainer-side procedure

### 5.14 — Production cutover (gated on 5.1 + 5.2 + 5.6 green)
- Open PR to `is-a-dev/register` repo retargeting `freestack.is-a.dev` at the Astro deploy
- Set up Cloudflare Page Rules (free tier — 3 rules) for redirects from `docs/index.html` anchor links to new `/category/<slug>` URLs
- Retire `docs/index.html` (move to `docs/_legacy/` to preserve)
- Update README + CLAUDE.md to remove "legacy MD site at freestack.is-a.dev" notes

---

## Stories — Tier 2 (high value)

### 5.4 — Facets backfill (parallel agents + WebFetch live pricing)
**Methodology:**
- 12 parallel agents, 25 services each
- Each agent: fetch the service's `pricing_url`, extract facet values from page text (requests/day, storage GB, bandwidth, CC required, custom domain, SSL, OSS flag, self-host flag, auto-pause days, trial days, credit USD)
- Write back to YAML's `facets:` block
- Skip rules same as v0.9.0 batch (bot-blocked → log, no YAML change)
- Expected outcome: 270/300 services with facets; 30 deferred to story 5.8 Playwright verifier

### 5.5 — Tags taxonomy + 50 missing logos
**Tags:**
- Build a curated tag list (~30-50 tags) derived from category + facet patterns
- Bulk-apply via script: each service gets 2-5 tags based on category + key facets
- 247 services currently have `tags: []`

**Logos:**
- 50 services with `brand_color: '#888888'` (placeholder) + missing logo file
- Source from selfh.st icons + lobe-icons + custom SVGs
- Update `docs/logo-coverage.md` with each fallback rationale

### 5.7 — Monthly verify cron + `/changelog` page + build assets in releases
- `.github/workflows/monthly-verify.yml` — runs 1st of month, opens issue listing services where `date_verified > 60 days old`
- `src/pages/changelog.astro` — renders `CHANGELOG.md` with per-version anchors (`/changelog#v090`)
- `.github/workflows/release-assets.yml` — on tag push, builds `data/index.json` (flat catalog) + `data/services.md` (flat Markdown export) and uploads via `gh release upload`

### 5.8 — Playwright pricing-drift verifier (for the 20 bot-blocked services)
- Headless Chromium fetches the pricing pages that returned "needs-js" / "bot-blocked" in v0.9.0
- Same extraction logic as v0.9.0 content batch
- Pair with the monthly verify cron from 5.7
- Target services: `brevo`, `brevo-sendinblue`, `canva`, `coherence`, `crowdin`, `ibm-cloud`, `iconbuddy`, `lark`, `lemonsqueezy`, `linode-akamai`, `meta-llama-api`, `papertrail`, `qodana-jetbrains`, `quay-io`, `render`, `sendbird`, `strapi-cloud`, `umami-cloud`, `vonage`, `youtrack`

### 5.9 — Contributor workflow (CODEOWNERS + YAML issue forms + Release Drafter)
- `.github/CODEOWNERS` — auto-request review on `src/content/services/` + `docs/` + `.github/workflows/`
- Replace 5 Markdown templates with YAML form templates:
  - `01-submit-service.yml`
  - `02-pricing-change.yml`
  - `03-free-tier-change.yml`
  - `04-suggest-category.yml`
  - `05-other.yml`
- `.github/release-drafter.yml` + workflow — auto-categorize PR titles into release notes

---

## Stories — Tier 3 (nice to have)

### 5.10 — Code quality cleanup
- Extract Zod schema from `src/content.config.ts` to `src/lib/schema.ts`; import in `validate-services.mjs` and `audit-services.mjs` to kill duplication
- Remove unused deps from `package.json`: `simple-icons`, `@lucide/astro`
- Replace 3 `any` types in `src/pages/service/[slug].astro` with proper types
- Hoist hard-coded `#1a1a1a` default-accent into `src/lib/theme.ts` constants
- Tighten ESLint config (add `no-explicit-any`, `no-unused-vars`)

### 5.11 — UX polish
- "No services match" empty state for zero-result search/filter combos
- Table view at <720px: hide non-essential columns (Category, Quotas) OR vertical-stack
- Compare picker: add 3 example service chips on first paint (mobile discoverability)
- 404 page polish — link to category browse

### 5.12 — Cloudflare Web Analytics (opt-in, no cookies)
- Env-gated via `PUBLIC_CF_ANALYTICS_TOKEN`
- Off by default; you flip env var to enable
- No PII, no cookies
- Document in `/methodology` page and `CLAUDE.md`

### 5.13 — State of Free Tiers 2026 annual report
- Long-form editorial at `src/pages/state-of-free-tiers/2026.astro`
- Content from the drift triage: Mixpanel 20M → 1M events; Cloudflare Workers AI 22× pricing error; POEditor 30k → 1k strings; Tebi pivoted to POS; Adaptable.io shut down
- Year-over-year trends
- Drives the marketing posts (5.15)

### 5.15 — Marketing launch
- Draft posts in `marketing/drafts/` (gitignored):
  - X thread (5-7 posts)
  - Dev.to long-form
  - LinkedIn announcement
  - Hacker News "Show HN" draft + timing
  - Reddit r/programming + r/webdev drafts
- Newsletter sketch (Buttondown signup deferred — needs backend; saved for v2.1+)
- All drafts require maintainer approval before posting (memory rule: no autonomous posting)

---

## Release artifacts

1. Annotated tag `v2.0.0` (signed if GPG configured)
2. `CHANGELOG.md` `[Unreleased]` rolled to `[2.0.0] - YYYY-MM-DD`
3. `release-notes/v2.0.0.md` — first line user-facing: "v2.0.0 — production quality: Lighthouse 98+, WCAG AA, takedown policy, monthly verification, Cloudflare Web Analytics opt-in, State of Free Tiers 2026, full content backfill, production cutover from MD-era site to Astro build."
4. GitHub Release with build assets (`data/index.json`, `data/services.md`) attached via story 5.7
5. Cut-over announcement: short blog post or pinned issue explaining the migration to anyone watching the legacy MD site

---

## Definition of Done

Tag-time gates:
- All 18 stories merged
- `pnpm lint && pnpm validate && pnpm check-logos && pnpm audit-services --no-http && pnpm build` all green
- Lighthouse CI green (mobile ≥98, desktop ≥99)
- WCAG axe-core check green on 5 representative pages
- `freestack.is-a.dev` resolves to the Astro deploy
- RSS feed validates against W3C feed validator
- Marketing drafts approved + posted (or explicitly held)

---

## Sprint 5 → v2.1.0 carry-overs (out of scope)

- Newsletter signup form (needs backend service like Buttondown or Resend)
- 2nd maintainer onboarding (needs a real human)
- Per-service OG-image composite generator (default site logo is fine for v2.0.0)
- Dashboard view (deferred per v0.8.0 design synthesis)
- Domain change to `freestack.dev` (decide based on traffic)
- Filter `__all` reset chip pattern from `ref/design-experiments/combined.html`

---

## Critical files to read before implementation

- `CLAUDE.md` — project law
- `src/content.config.ts` — Zod schema (will be extracted in 5.10)
- `docs/sprints/sprint-4.md` — last sprint, for pattern reference
- `ref/design-experiments/v3-design-brief.html` — original design synthesis
- `release-notes/v0.9.0.md` — what just shipped
- The 8-agent audit findings (in conversation history — synthesized here)

## See also

- Plan file: `~/.claude/plans/and-get-ignore-and-cozy-frog.md`
- Scrum-team agents: `.claude/agents/`
- Sprint 4 retro: not written yet — write `docs/sprints/sprint-4-retro.md` if you want one

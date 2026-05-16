# Sprint-6 Day-4 review — synthesis of 10 parallel review agents

Run on 2026-05-16 against rebuild/astro at commit `397fa97` deployed to `https://pratiyush.github.io/opentier/`.

All 10 agents read-only. Findings deduped + triaged by severity. Day-4 action column = `fix` (ship today) / `defer` (v4.1) / `gated` (waiting on user).

---

## BLOCKER (Day-4 ship if cheap)

| Finding | Source | File | Day-4 |
|---|---|---|---|
| `robots.txt` points to old `freestack.is-a.dev` sitemap | Agent 7 | `public/robots.txt` | **fix** |
| OG image meta has double `/opentier/` prefix (e.g. `https://opentier.dev/opentier/og/*.png`) | Agent 7 | `src/layouts/BaseLayout.astro:29` (absoluteOgImage construction) | **fix** |
| Canonical URLs all carry `/opentier/` subpath (canonical should point to the apex, not the Pages subpath) | Agent 7 | `src/layouts/BaseLayout.astro:24` (canonical default `Astro.url.href` includes base) | **fix** |
| `vector-open-source` has only 1 pricing row (OSS, no paid tier) — schema-valid but content-rule-violating | Agent 8 | `src/content/services/vector-open-source.yml` | **fix** (add explicit "Enterprise: Contact sales") |
| BaseLayout has duplicate `u()` helper diverging from `src/lib/url.ts` | Agent 3 | `src/layouts/BaseLayout.astro:28` | **fix** (import from lib) |
| CF Analytics beacon loaded with no CSP — third-party trust dependency | Agent 6 | `src/layouts/BaseLayout.astro:130-138` | **fix** (add `<meta http-equiv="Content-Security-Policy">`) |
| `day-5-ask-backup.md` references `v2.0.0` (wrong) — risk of accidental publishing | Agent 9 | `marketing/drafts/day-5-ask-backup.md` | **fix** (delete or move to archive/) |

---

## HIGH (ship today if scope allows, else v4.1)

| Finding | Source | File | Day-4 |
|---|---|---|---|
| Multiple `:focus-visible` gaps (site-nav, hero CTAs, filter-select, category-chips, sponsor-footer-link) | Agent 2 | `BaseLayout.astro` + `index.astro` + `catalog.astro` + `CategoryChip.astro` + `SponsorMeter.astro` | **fix** (one-pass CSS sweep) |
| h2 font-size drift: `1.35rem` (about/submit/methodology) vs `1.45rem` (service detail) — pick one + apply globally | Agent 1 | 4 files | **fix** |
| Hardcoded `#fff` for logo frame should be a token | Agent 1 | `src/pages/service/[slug].astro:523` | **fix** |
| `fetch-logo.mjs` missing AbortController timeout — network hangs | Agent 3 | `scripts/fetch-logo.mjs:59,67` | defer (not in production hot path) |
| BaseLayout hardcoded `href="/"` and `href="/catalog"` bypass `u()` helper (post-build prefixer covers, but inconsistent) | Agent 3 | `src/layouts/BaseLayout.astro:145, 150-153, 174-176` | defer (works via post-build) |
| Inline `<style>` @font-face block IS the home perf regression (100→91→93). Render-blocking + duplicate of Fontsource bundle | Agent 5 | `src/layouts/BaseLayout.astro:99-126` | defer (v4.1 — needs proper async-CSS strategy) |
| 8.5MB total in `public/og/*.png` — fine for serving, but inflates repo + CI artifact | Agent 5 | `public/og/` | defer |
| No Content-Security-Policy header | Agent 6 | n/a | **fix** (via meta) — same as BLOCKER above |
| `pratiyush1@gmail.com` exposed on `/legal` (spam vector) | Agent 6 | `src/pages/legal.astro` | defer (intentional — known contact email) |
| 10 pages missing JSON-LD entirely (catalog, submit, changelog, methodology, about, sponsors, compare, legal, components-preview, state-of-free-tiers) | Agent 7 | various | defer (catalog + state-of-free-tiers worth doing v4.1) |
| 40 pages share identical meta descriptions (mostly category-derived defaults like "Free plan (permanent)") | Agent 7 | service pages | defer (real fix = better summary in each YAML) |
| `signup_friction` field at 3% adoption (10/300) but 238 services are `free-plan` tier_type — biggest content gap | Agent 4 | YAMLs | defer (v4.1 catalog-sprint) |
| Day-2-pain receipt URLs are placeholders (`mixpanel.com/pricing-update-2026` doesn't exist) — must verify before posting | Agent 9 | `marketing/drafts/day-2-pain.md:30-44` | **fix** (mark draft as "URLs need verification" + add to Day-5 checklist) |
| HN submission at 09:45 ET on Monday May 18 — Monday is HN's lowest-traffic day | Agent 9 | `marketing/drafts/day-5-launch.md:17` | **fix** (move HN to Tue May 19 morning if domain DNS allows) |

---

## MED / LOW

These don't block Day-5 launch but cluster well as a v4.1 polish sweep. Listed grouped by category:

**Tokens / consistency (Agent 1):**
- CTA button padding drift across index/sponsors/404
- Hardcoded shadow `rgba(26,26,26,0.08)` instead of token
- Border-radius drift (3px in SearchBox vs 4px token elsewhere)
- `.card-category` margin `0.2rem` should be `--space-xs`

**A11y (Agent 2):**
- ServiceTable rows use `role="button"` + `tabindex` instead of semantic `<button>`
- CC indicator is colour-only in table (no icon/text)
- Category-filter `<select>` lacks explicit `<label>`

**Code (Agent 3):**
- Magic numbers (300, 271, 29, 100) embedded in state-of-free-tiers prose — should live in `src/lib/stats.ts`
- `compare.astro:66` hardcoded `/compare?slugs=` instead of `u()`

**Schema (Agent 4):**
- 11 schema fields with 0/300 usage (notes, docs_url, last_changed, submitted_by, free_tier_limits, regional_pricing, refund_policy, support_sla, compliance_certifications, rate_limits, contract_terms) — likely partly false-positive for `notes` (many services do use it; verify); the rest are real
- `paid_tier_highlights` 280/300 (93%) — solid
- 2 tag near-duplicates: `database`/`databases`, `logs`/`logging`
- `tier_type` distribution: always-free=54, free-plan=238, trial-credit=7, **pay-as-you-go=1** — that last bucket has almost no entries
- `signup_friction` 10/300 (3%) — biggest backfill candidate
- Audit script missing validation for `tos_red_flags`, `compliance_certifications`, `inactive_account_policy`, `facets` newer fields

**Perf (Agent 5):**
- Pagefind index 2.2 MB loaded on every page (only used on catalog) — defer lazy-load to v4.1
- Latin-only font subset would save ~30% (current loads Cyrillic, Greek unicode-ranges we don't need)
- 3 synchronous `<link rel="stylesheet">` (BaseLayout + ServiceCard + index) — can inline critical CSS later

**Security (Agent 6):**
- 8 workflows pin actions to major versions (`@v4`, etc.) not SHAs — supply-chain best-practice miss, low risk

**SEO (Agent 7):**
- 40 service pages duplicate descriptions — fix via better YAML `summary` content (v4.1 catalog-sprint)

**Content (Agent 8):**
- `ably`, `motherduck` have `#888888` placeholder + generic summaries
- `tailscale` summary "Personal plan" too vague

**Marketing (Agent 9):**
- Image asset ambiguity on Day-4 — `day-4-engine.png` doesn't match the "I bought a domain" story (generate a registrar-receipt mock)

**Build (Agent 10):**
- `release-drafter.yml` scoped to master only — pending rebuild/astro PRs won't trigger; auto-resolves on master cutover

---

## Day-4 ship batch (the actual fix list)

| # | What | File(s) | LoC est. |
|---|---|---|---|
| F1 | `robots.txt` rebrand | `public/robots.txt` | 3 |
| F2 | Drop `${base}` from `absoluteOgImage` (avoid double prefix) | `src/layouts/BaseLayout.astro:29` | 2 |
| F3 | Compute canonical without the base prefix | `src/layouts/BaseLayout.astro:24` | 5 |
| F4 | Import + use shared `u()` from `~/lib/url`, delete inline copy | `src/layouts/BaseLayout.astro:27-29` | 5 |
| F5 | Add `<meta http-equiv="Content-Security-Policy">` | `src/layouts/BaseLayout.astro:head` | 8 |
| F6 | Add Enterprise "Contact sales" row to vector-open-source pricing | `src/content/services/vector-open-source.yml` | 4 |
| F7 | `:focus-visible` sweep across header nav, hero CTAs, filter-select, CategoryChip, SponsorMeter | 5 files | ~30 |
| F8 | Unify `.block h2` to one font-size (1.4rem chosen as midpoint) | 4 page files | 4 |
| F9 | `#fff` → `var(--color-paper)` for logo-frame bg | `src/pages/service/[slug].astro:523` | 1 |
| F10 | Move `day-5-ask-backup.md` → `marketing/drafts/_archive/` so accidental publishing is harder | move | 0 |
| F11 | Annotate `day-2-pain.md` receipt URLs as "VERIFY BEFORE POSTING" + add to Day-5 checklist | `marketing/drafts/day-2-pain.md` | 6 |
| F12 | Move HN submission in Day-5 posting plan from Mon 09:45 → Tue 09:30 ET (note Day-5 = May 18 = Mon; HN best Tue-Thu) | `marketing/drafts/day-5-launch.md:17` | 2 |

Total: **~70 LoC across 11 files** for the Day-4 commit batch. Verifiable via the 17-test E2E + lighthouse re-run.

---

## Net read

**State of v4.0:** Strong. Site is fully functional, fully styled, deployed at the GH Pages preview URL, with E2E tests, drift verifier, sponsor meter, OG cards, font preload — all the v2.0/2.1 work paid off. The audit surfaced **no BLOCKERS in deployed functionality** — every BLOCKER above is a meta/SEO/CSP issue, not a "site is broken" issue.

**Biggest content gap:** `signup_friction` at 3%. v4.1 catalog-sprint should fix this — and the agent's "11 zero-usage schema fields" finding (after the `notes` false-positive caveat) is the same story: the schema has more fields than the content fills.

**Biggest perf gap:** the inline `@font-face` block in BaseLayout. Already known (lighthouse-baseline.md noted it). Defers cleanly to v4.1 because the fix needs careful async-CSS strategy and the v4.0 catalog perf is already 98 mobile.

**Day 5 is shippable** with the Day-4 fix batch above. The marketing-draft issues (receipt URLs, HN timing) become the launch-day pre-flight checklist.

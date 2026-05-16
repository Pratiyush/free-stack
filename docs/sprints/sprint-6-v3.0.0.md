# Sprint 6 → v3.0.0 — opentier

Source of truth for the v3.0.0 work. Built from page-by-page audit of the live v2.0.1 deploy at `https://pratiyush.github.io/opentier/` (rebranded, base=`/opentier`, all internal links prefixed, screenshots in `dist-assets/snapshots/v3.0-live/`).

**Theme:** opentier rebrand + production polish + measurable end-to-end quality. We're moving from "shipped + livedo" to "shipped + maintained + measured."

**Cadence:** 5 daily sprints (Day 1 to Day 5). Day 5 is the **public launch** — all marketing posts go out that day, not before. Days 1-4 are build / verify / image-prep.

**Today is Day 3.**

---

## Decisions confirmed via the latest session

| Decision | Answer |
|---|---|
| Rebrand brand name | `opentier` (drops the TLD) |
| Domain | `opentier.dev` (user buying) |
| GitHub repo | renamed `Pratiyush/opentier` |
| Live URL today | `pratiyush.github.io/opentier/` |
| Live URL after DNS | `opentier.dev/` (apex, no subpath) |
| `base` config | `PUBLIC_SITE_BASE` env, defaults to `/opentier` |
| Internal-link prefixing | postbuild script `prefix-internal-links.mjs` (runs after `astro build`) |
| Immutable releases | user disabling in repo settings → v3.0.0 ships clean |
| Public launch day | Day 5 (not Day 1 as in the v2.0.0 plan) |
| Mirror hosting | GitLab Pages as backup |

---

## Page-by-page audit (live v2.0.1)

| Page | Desktop h | Mobile h | DOM | Verdict |
|---|---:|---:|---:|---|
| `/` index | 5,056 | **11,435** | 492 | Desktop beautiful. Mobile is 2.3× too tall — periodic-table grid becomes one wasteful column. |
| `/catalog` | **23,181** | **89,841** | **15,631** | Critical. 300 services in one document. Needs virtualisation. |
| `/category/ai-apis` | 3,807 | 7,789 | 1,130 | Best-in-show category page. Subcategory sections work well. |
| `/service/anthropic-claude` | 1,881 | 2,505 | 155 | Clean. **Missing:** facets, signup_friction, tos_red_flags, inactive_account_policy data (in YAML but not rendered). |
| `/state-of-free-tiers/2026` | 5,589 | 7,973 | 228 | Reads like a real editorial page. |
| `/compare` | 1,050 | 1,332 | 102 | Empty-state lands well. Quick-start chips help. |
| `/sponsors` | 2,842 | 3,941 | 166 | Meter + ledger + tiers + honesty clause all working. |
| `/legal` | 2,448 | 3,331 | 123 | Takedown policy clear. |
| `/changelog` | 13,721 | 20,234 | 682 | Long but it's a changelog; tolerable. |
| `/methodology` `/about` `/submit` | 1.4-1.7k | 1.8-2.4k | ~90 | Functional but thin. |

---

## Critical findings (rank-ordered for the sprint)

### 1. Mobile homepage is 11,435 px tall (REGRESSION since v2.0.0)

The wall-of-logos drops to one column at narrow viewports, with each tile rendering with aspect-ratio padding the same as desktop. Result: huge vertical waste, 8-10 screen-scrolls just to get past the grid. The user flagged this in v2.0.0; it's still there.

**Fix:** 3-col grid at ≤640px (was 1-col), shorter tiles (60vw min), remove the aspect-ratio: 1 hard rule on mobile.

### 2. Catalog is 15,631 DOM nodes / 89,841 px on mobile

300 service cards rendered in one document, every card has ~50 DOM nodes (title, summary, free_tier bullets, tier badge, CC pill, "Details →" link, footer). Mobile Lighthouse already flagged `dom-size` (perf 88).

**Fix:** virtualise. Render the first 30 cards eagerly, the rest as the user scrolls (IntersectionObserver). OR paginate (preferred — server-side, no JS dependency).

### 3. Service detail page renders 0/10 of the new schema fields

We expanded the YAML schema in v2.0.0 with 10 capture-everything blocks (signup_friction, free_tier_limits, regional_pricing, tos_red_flags, refund_policy, support_sla, compliance_certifications, inactive_account_policy, rate_limits, contract_terms). Today the detail page shows: name, summary, free tier bullets, pricing table, link list, tags. **None of the new fields are rendered.** We spent a day capturing the data; it's invisible.

**Fix:** add 3 new sections to `service/[slug].astro`:
- "Signup friction" (CC? Phone? GitHub-gate?) — single inline row
- "Watch for" (tos_red_flags + inactive_account_policy as warning bullets)
- "Operational" (rate_limits, support_sla, compliance_certifications) — small definition list

### 4. `<a href="#main">` skip link is the only `<a href="#X">` on the homepage

Skip-to-main works. But no anchor links elsewhere — could navigate within the long state-of-free-tiers page or the changelog. Minor.

### 5. Compare page empty-state has 6 quick-start chips, but the input is a `<input>` with no live results

When the user types in the search input, no autocomplete or live filtering shows. They have to know the slug exactly. Even though we already index 300 services in Pagefind, the compare page doesn't use it.

**Fix:** wire Pagefind into the compare picker. Type → live results dropdown.

### 6. Sponsor meter is hand-edited JSON, not API-backed

Data file `data/sponsor-progress.json` is `0/100` until the user manually edits after sponsorship comes in. Per the original plan, API integration was deferred to v2.1+ but never queued. Putting on the v3.0.0 list because the launch post (Day 5) will direct people to the meter.

**Fix:** GitHub Sponsors GraphQL query + Buy Me a Coffee scraper → `data/sponsor-progress.json` regenerated daily via cron. Or: simpler, just GitHub Sponsors API since BMC has no public API.

### 7. View Transitions don't include the wall-of-logos tiles

`transition:name="card-<slug>"` is on ServiceCard but not on the homepage wall tiles. Clicking a wall tile is just a regular link navigation.

**Fix:** add `transition:name` to the wall tiles in `index.astro`.

### 8. RSS feed has 50 items but they're sorted by `date_verified` not `date_added`

If a service gets re-verified (same content, new date), it floats to the top of the RSS. That's wrong for "what's new" subscribers.

**Fix:** sort by `last_changed` if present, else `date_added`.

### 9. `<meta name="description">` is identical across most pages

Every page inherits the BaseLayout default: "300 verified free tiers for developers across 27 categories. No ads, no affiliate links." That's fine for the homepage but burns SEO opportunity on category pages (which should describe the category) and service pages (which should describe the service — we have `summary`!).

**Fix:** make all top-level pages pass an explicit `description={...}` to BaseLayout.

### 10. Catalog mobile lacks pagination breadcrumb

When a user is scrolling the catalog and at the 50th service, there's no indication of where they are or how many left. No "200/300 viewed" or "Top" jump.

**Fix:** sticky "back to top" pill at the bottom-right after 2 screens of scroll. Optional: section anchors per letter of alphabet.

---

## v3.0.0 sprint plan (Day-by-day)

### Day 3 (today, May 16) — Build foundations

- [x] #81 — base-aware link prefixing via postbuild script
- [x] #82 — wire `PUBLIC_SITE_BASE` env into deploy-pages.yml
- [x] #83 — this audit document
- [ ] #89 — README + repo description rebrand (1 file + 1 API call)
- [ ] Critical finding #1 — Mobile homepage compression (3-col grid)
- [ ] Critical finding #3 — Render the 10 new schema fields on service detail page

### Day 4 (May 17) — Test + measure

- [ ] #84 — Playwright drift verifier: real assertions, runs against 20 actual bot-blocked services
- [ ] #85 — Playwright E2E happy-path: home → category → service → compare → submit
- [ ] #86 — 5 LinkedIn-style infographic PNGs (one per day, marketing-with-images)
- [ ] Critical finding #2 — Catalog virtualisation OR pagination
- [ ] Critical finding #9 — Per-page descriptions
- [ ] #90 — Re-run Lighthouse against the v3.0.0-rebranded site

### Day 5 (May 18) — Public launch day

- [ ] #88 — opentier.dev CNAME + DNS verification (if domain is purchased)
- [ ] #87 — GitLab Pages mirror live (or document as v3.1 follow-up)
- [ ] #91 — Day-5 launch posts (one post per platform with the infographic attached)
- [ ] Critical finding #5 — Compare picker wired to Pagefind
- [ ] Critical finding #7 — View Transitions on wall-of-logos
- [ ] Tag v3.0.0 (this time with immutable-releases disabled, clean ship)

### Deferred to v3.1 (not blocking Day 5)

- Critical finding #4 (anchor links within long pages) — low value
- Critical finding #6 (live sponsor API) — manual JSON edit works for a month or two
- Critical finding #8 (RSS sort by last_changed) — small impact, can ship as point release
- Critical finding #10 (back-to-top + alphabet anchors) — depends on virtualisation
- "Capture everything" YAML backfill to all 300 services (Day 4's #79 only did top 20)

---

## Critical files for the sprint

### Build/CI (Days 3-5)

- `astro.config.mjs` — `base` env + `site` already done
- `scripts/prefix-internal-links.mjs` — already done; lives as postbuild
- `.github/workflows/deploy-pages.yml` — already env-wired

### v3.0 source changes

- `src/pages/index.astro` — mobile periodic-table grid CSS; wall-tile `transition:name` (findings #1, #7)
- `src/pages/service/[slug].astro` — render 3 new sections from schema (finding #3)
- `src/pages/catalog.astro` — virtualisation OR pagination (finding #2)
- `src/pages/compare.astro` — Pagefind wire-up for the search input (finding #5)
- `src/pages/category/[slug].astro` — per-page `description` (finding #9)
- `src/pages/service/[slug].astro` — `description={summary}` (finding #9)
- `src/pages/sponsors.astro` — optional API wiring (deferred)
- `src/utils/rss.ts` (or equivalent) — sort change (finding #8 — deferred)

### v3.0 testing

- `tests/pricing-drift.spec.ts` — already scaffolded, needs real assertions (#84)
- `tests/e2e.spec.ts` — NEW (#85)
- `playwright.config.ts` — add `baseURL` for the live deploy

### v3.0 marketing

- `marketing/drafts/day-*-opentier.md` — rewrites with opentier brand (#91)
- `marketing/launch-kit.md` — already opentier-branded by sed sweep
- `marketing/drafts/images/day-1.png` through `day-5.png` — NEW (#86)

### v3.0 hosting

- `.gitlab-ci.yml` — NEW for GitLab Pages mirror (#87)
- `public/CNAME` — NEW with `opentier.dev` content once domain is purchased (#88)

---

## Verification (per critical finding)

- **#1 Mobile homepage:** snap-live.mjs after fix; mobile homepage `h < 5000px`.
- **#2 Catalog perf:** Lighthouse mobile perf > 95 on `/catalog`; DOM nodes < 5,000.
- **#3 Schema rendering:** open `/service/anthropic-claude` — visible sections for signup_friction + ToS red flags + operational.
- **#5 Compare picker:** type "supa" in compare input — see Supabase appear in a live dropdown.
- **#7 Wall view transitions:** click any wall tile — smooth morph to service detail (not abrupt page swap).
- **#9 Descriptions:** `curl https://opentier.dev/category/databases | grep "og:description"` shows the category blurb, not the generic site default.

---

## Open questions (need user answers before Day 4)

1. **GitLab Pages — mirror only, or primary?** If mirror: GitHub Pages stays canonical. If primary: we need to repoint DNS and learn GitLab Pages auth. **Default assumption: mirror only.**
2. **opentier.dev domain — bought today / Day 4 / Day 5?** If Day 5: we ship the launch posts pointing to `pratiyush.github.io/opentier/` (less professional). If today: we can finalize the DNS PR and Day 5 posts both point to the apex domain.
3. **Sponsor live API for v3.0 or v3.1?** Per ranking it's v3.1, but the launch is harder to land with a `$0/$100` static meter than a `$X/$100` real one.
4. **OG cards regenerate per-page or only the default + service?** Today only service detail pages get a unique OG card. Other surfaces (sponsors, state-of-free-tiers, category, legal) use the default. Worth $20 more work to give each top-level page its own card?

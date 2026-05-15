# Contributing to free-stack

Thanks for contributing. This guide covers the YAML record model, the local dev loop, and the PR checklist.

---

## Issue-First Workflow

**Every change must have a GitHub issue first.** Before opening a PR:

1. Search existing issues — your idea may already be there.
2. If not, file a new issue describing the change.
3. Wait for a maintainer to acknowledge or label it (`add-service`, `update-service`, `verify`, `fix`, etc.).
4. Reference the issue in your PR body (`Closes #123`).

This keeps the work tracked and avoids duplicate effort.

---

## Local development

You'll need Node 22+ and pnpm 10.

```bash
pnpm install
pnpm dev          # Astro dev server at http://localhost:4321
```

Useful scripts (defined in [`package.json`](package.json)):

| Command                          | What it does                                                                |
| -------------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                       | Run the Astro dev server                                                    |
| `pnpm build`                     | Production build (also runs Pagefind + sitemap)                             |
| `pnpm lint`                      | Prettier check on the whole tree                                            |
| `pnpm lint:fix`                  | Prettier autofix                                                            |
| `pnpm validate`                  | Zod-validate every YAML record against the schema                           |
| `pnpm check-logos`               | Confirm every service has a logo file at `public/logos/<slug>.svg`          |
| `pnpm audit-services --no-http`  | Schema/logo/summary/brand-color audit (HTTP checks off for fast local runs) |
| `pnpm new:service <slug>`        | Scaffold a stub YAML at `src/content/services/<slug>.yml`                   |
| `pnpm bulk-fetch-logos`          | Refetch logos from simpleicons in bulk                                      |

**Required local gate before every PR:**

```bash
pnpm lint && pnpm validate && pnpm check-logos && pnpm audit-services --no-http && pnpm build
```

All five must pass. CI runs the same chain (with `audit-services` HTTP checks enabled).

---

## The YAML record

Every service lives as a single YAML file at `src/content/services/<slug>.yml`. The canonical schema (Zod) is in [`src/content.config.ts`](src/content.config.ts) — read that file for the authoritative rules. The fields below summarise what each YAML record must (and may) contain.

### Required fields (13)

| Field           | Type                                                                                | Notes                                                            |
| --------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `name`          | `string` (1–60 chars)                                                               | Display name as the brand spells it                              |
| `slug`          | kebab-case `string`                                                                 | Matches the filename; URL-safe                                   |
| `category`      | kebab-case `string`                                                                 | Must be a slug from [`docs/category-taxonomy.md`](docs/category-taxonomy.md) |
| `logo`          | `string` matching `/logos/<slug>.svg`                                               | File must exist in `public/logos/`                               |
| `summary`       | `string` (10–180 chars)                                                             | One-line pitch for cards and meta tags                           |
| `tier_type`     | `always-free` \| `free-plan` \| `trial-credit` \| `pay-as-you-go`                   | See `/methodology` for definitions                               |
| `free_tier`     | `string[]` (≥1 bullet, each ≥3 chars)                                               | Concrete limits — quotas, rate limits, restrictions              |
| `pricing`       | `{name, price, unit?, description?}[]` (≥1 row)                                     | At minimum a "Free" row; usually includes the next paid tier     |
| `tags`          | `string[]` (kebab-case; defaults to `[]`)                                           | Optional; used for filtering                                     |
| `official_url`  | URL                                                                                 | Homepage                                                         |
| `date_added`    | date (`YYYY-MM-DD`)                                                                 | When the entry first landed                                      |
| `date_verified` | date (`YYYY-MM-DD`)                                                                 | Last time the free tier was checked against the live pricing page|
| (and either `pricing_url` is present, or the record explains in `notes`) | URL | Strongly preferred over the homepage         |

### Optional fields

- `subcategory` — `permanent` \| `expiring-credits` \| `limited` (used to bucket AI APIs and similar tier-mixed categories).
- `brand_color` — `#RRGGBB` hex (from [simpleicons.org](https://simpleicons.org) where available). Drives the card accent.
- `notes` — free-form caveats (e.g., "auto-pauses after 7 days inactivity").
- `docs_url`, `last_changed`, `maintainer_notes`, `submitted_by` — self-explanatory.
- `facets` — typed quotas and capabilities (`storage_gb`, `requests_per_day`, `cc_required`, `oss`, `self_host`, `trial_days`, `credit_usd`, etc.). Optional but encouraged — it's what powers structured comparison on the site. Full list in `src/content.config.ts`.
- `sources` — per-fact provenance blocks (`pricing`, `brand`, `overrides`) recording the URL, type (`simpleicons`, `lucide`, `devicon`, `lobe-icons`, `selfhst`, `custom`, `manual`), and verification date. Optional; useful for auditability.

### Scaffolding a new service

```bash
pnpm new:service <slug>
```

That writes a stub YAML at `src/content/services/<slug>.yml` with `date_added` / `date_verified` set to today. Fill in the rest, run the local gate, and open a PR.

### Adding a logo

Logos live at `public/logos/<slug>.svg`. The lookup cascade (per [CLAUDE.md](CLAUDE.md) and Sprint 3.7):

1. **[simpleicons.org](https://simpleicons.org)** — preferred. Use the brand `hex` for `brand_color` and render the SVG with `fill="#<hex>"` so it's full-color, not monochrome.
2. **[lobe-icons](https://github.com/lobehub/lobe-icons)** — good fallback for AI/ML services and recent SaaS that simpleicons hasn't picked up yet.
3. **[devicon](https://devicon.dev/)** — covers most developer tools and language ecosystems.
4. **[selfh.st icons](https://selfh.st/icons/)** — covers self-hosted / OSS that the others miss.
5. **Last resort:** a brand-colored placeholder generated by `scripts/bulk-placeholder-logos.mjs`. Note the fallback in `docs/logo-coverage.md`.

`pnpm check-logos` will fail the build if a referenced logo file is missing.

---

## PR workflow

### Branch naming

| Type            | Pattern                | Example                         |
| --------------- | ---------------------- | ------------------------------- |
| Add service     | `add/<slug>`           | `add/supabase`                  |
| Update service  | `update/<slug>`        | `update/vercel`                 |
| Expand category | `expand/<category>`    | `expand/databases`              |
| Fix             | `fix/<description>`    | `fix/dead-links`                |
| Docs            | `docs/<scope>`         | `docs/rewrite-for-yaml-workflow`|
| Cleanup         | `cleanup/<scope>`      | `cleanup/untrack-junk`          |

### PR title — Conventional Commits

The PR-title lint workflow (`.github/workflows/`) requires Conventional Commits. Use one of:

- `feat: <short description>` — new capability or schema change
- `fix: <short description>` — bug fix
- `content: <service> — <what changed>` — service add/update/remove
- `docs: <scope>` — docs-only change
- `chore: <scope>` — tooling, deps, infra

Examples:

- `content: add Supabase to baas`
- `content: update Vercel free-tier limits`
- `feat: add facets and sources schema blocks`
- `fix: POEditor free-tier drift (30k→1k strings)`

### PR body

Use the template at [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). At a minimum it must include:

1. **`Closes #N`** — the issue this PR resolves (or `Part of #N` for multi-PR work).
2. **What changed** — 1–3 sentences summarising the diff.
3. **Verification checklist** for content PRs:
   - [ ] YAML at `src/content/services/<slug>.yml` validates (`pnpm validate` passes)
   - [ ] `pricing_url` points to the official pricing page (not the homepage)
   - [ ] `date_verified` is set to today
   - [ ] `free_tier` bullets include concrete quotas and rate limits
   - [ ] `brand_color` matches the service's simpleicons hex (or the fallback is logged in `docs/logo-coverage.md`)
   - [ ] Logo file exists at `public/logos/<slug>.svg` (`pnpm check-logos` passes)
   - [ ] `notes` updated if the entry has caveats (auto-pause, CC-required, trial-only, etc.)

### Required checks before merge

- CI (lint → validate → check-logos → audit-services → build) must be green.
- The deploy preview build on `rebuild/astro` must also be green if the PR touches site rendering.

---

## Reporting outdated entries

If a service has changed its free tier or shut down:

1. Open an issue using the "Report Outdated" template.
2. Link to the current pricing page and quote the relevant phrasing.
3. Describe what changed (limit cut, free tier removed, CC now required, etc.).

A maintainer (or you, with an approved PR) will either update `date_verified` and the affected fields, or move the service into the "Services We Don't Include" section of [`README.md`](README.md).

---

## Quality bar

We accept entries that:

- Offer a **genuine free tier** (permanent free, free plan, or trial credits with a meaningful baseline — see [`/methodology`](https://freestack.is-a.dev/methodology) for the exact definitions).
- Are **actively maintained** and operational.
- Have **clear pricing documentation** we can link to.
- Are **useful to developers** (no filler, no AppSumo lifetime deals run by absent owners).

We close PRs that:

- Don't reference a GitHub issue.
- Add services without verification against the live pricing page.
- Fail the local gate (`lint`, `validate`, `check-logos`, `audit-services`, `build`).
- Add self-hosted-only software (this catalog is for SaaS / PaaS / IaaS / BaaS — self-hostable software with a hosted free tier is fine).
- Add services that only offer a finite trial without a permanent free baseline.

---

## Style

- **Service names:** capitalise the way the brand spells it ("PostHog", not "posthog").
- **Slugs:** kebab-case, ASCII only.
- **`summary`:** one sentence, ≤ 180 chars, lead with what the service does and the headline free-tier number.
- **`free_tier` bullets:** concrete numbers — "500MB", not "limited storage".
- **`pricing_url`:** the pricing page, not the homepage.
- **No emojis inside YAML values.**

---

## Code of Conduct

Be respectful. This is a community resource. No spam, no self-promotion without genuine value.

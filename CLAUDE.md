# Free-Stack Project Rules

## Issue-First Workflow

**Every repo change MUST have a GitHub issue first** (except marketing/ which is .gitignore'd).

- Before making any code/content change, create a GitHub issue describing the work
- Reference the issue number in commits and PRs
- Close issues via PR merge

## PR Workflow

- One PR per issue (unless tightly related)
- Branch naming: `add/[service]`, `update/[service]`, `fix/[description]`, `expand/[category]`, `cleanup/[scope]`, `docs/[scope]`
- PR title format: Conventional Commits (`content: add <service> to <category>` / `content: update <service>` / `feat: <change>` / `fix: <change>` / `docs: <scope>` / `chore: <scope>`). The PR-title lint workflow enforces this.
- Target branch: `master` (see Branch hygiene below).

### Required PR body

Every PR description must include:

1. **Closes #N** — the issue this PR resolves (or `Part of #N` for multi-PR work)
2. **What changed** — 1–3 sentences summarizing the diff
3. **Verification checklist** — for content PRs:
   - [ ] YAML at `src/content/services/<slug>.yml` validates (`pnpm validate` is green)
   - [ ] `pricing_url` points to the official pricing page (not the homepage)
   - [ ] `date_verified` is set to the current month/year
   - [ ] `free_tier` bullets include concrete quotas and rate limits where available
   - [ ] `brand_color` matches the simpleicons.org hex (or fallback is logged in `docs/logo-coverage.md`)
   - [ ] Logo file exists at `public/logos/<slug>.svg` (`pnpm check-logos` is green)
   - [ ] `notes` updated if the entry has caveats (auto-pause, CC-required, trial-only, etc.)

The PR template at `.github/PULL_REQUEST_TEMPLATE.md` is the source of truth — keep it in sync with this checklist.

### Required checks before merge

- **GitHub Pages build (`deploy-pages.yml`)** must be green. Merging with a red Pages build leaves the site broken; block merge until fixed.
- **Link check (`link-check.yml`)** is weekly, not per-PR — does not block merge, but failures get triaged (see Link Check section below).

### Branch hygiene

- **`master` is the only canonical branch.** Target all PRs at `master`. A `main` ref existed briefly during a rename experiment — **never push to, merge into, or base a branch off `main`**. It will be deleted once the migration completes.
- **Always sync `master` before starting work**: `git checkout master && git pull --ff-only` before `git checkout -b <new-branch>`. Stale-base branches cause merge conflicts and stale-PR thrash.
- **Verify the branch name with `git status` before every `git push`.** No pushes to `master` directly — always via PR. No accidental pushes to `main`.
- **Delete merged feature branches** locally and on origin (`gh pr merge --delete-branch` handles origin; `git branch -d <name>` locally).
- **Worktrees**: if work was done in a `git worktree` (separate checkout for parallel branches), **remove the worktree as soon as its PR is merged**. From the main repo run `git worktree remove <path>` (or `git worktree remove --force <path>` if it has untracked files you've already saved elsewhere). List active worktrees with `git worktree list`. Lingering merged worktrees pin stale refs, confuse `git status` in the wrong directory, and waste disk.

## Releases & Tags

Every merged PR that ships user-visible content or behavior gets a tagged GitHub Release. No silent merges to canonical.

- **Semver applies**:
  - `MAJOR` (X.0.0) — restructures, schema changes, breaking PR-template changes (e.g., the YAML migration tracked in #372).
  - `MINOR` (1.X.0) — new categories, new automation, new top-level sections in README/docs.
  - `PATCH` (1.0.X) — individual service add/update/remove, link fixes, doc tweaks, cleanup PRs.
- **Tag format**: `vMAJOR.MINOR.PATCH`. Annotated tags only (`git tag -a vX.Y.Z -m "..."`). Sign if a signing key is set up locally.
- **Release notes**: start from `gh release create vX.Y.Z --generate-notes`; rewrite the first line to highlight the user-visible change (not just the commit title). Group entries by type if more than one PR is in the tag.
- **Build must be green before tagging**: the GitHub Pages deploy run on the merge commit must have succeeded. No tags on red builds — fix the deploy first, then tag.
- **One tag per ship event**: bundle maintenance commits (refactors, dep bumps, cleanup) into the next service-ship tag rather than tagging them alone. Releases should map to things contributors and users care about.
- **Auto-build assets**: when the build script (Phase 3+ of #372) lands, the release pipeline attaches `data/index.json` and a flat-Markdown export as release assets so downstream consumers can pin a version.

## Content Rules

- **Every service is a typed YAML at `src/content/services/<slug>.yml`** validated against the Zod schema in `src/content.config.ts`. The legacy `categories/*.md` tables were migrated during Sprint 3 (`docs/sprints/sprint-3.md`) and will be deleted in story 3.12 once this docs rewrite lands.
- Required fields per record: `name`, `slug`, `category`, `logo`, `summary` (10–180 chars), `tier_type` (`always-free` / `free-plan` / `trial-credit` / `pay-as-you-go`), `free_tier` (≥1 bullet), `pricing` (≥1 row), `tags`, `official_url`, `date_added`, `date_verified`. `pricing_url` is strongly preferred over the homepage. Full spec lives in `src/content.config.ts` — that file is the source of truth.
- Optional but encouraged: `subcategory`, `brand_color` (from simpleicons.org hex), `notes`, `docs_url`, plus the **`facets`** block (typed quotas/capabilities — `storage_gb`, `requests_per_day`, `cc_required`, `oss`, `self_host`, `trial_days`, `credit_usd`, etc.) and the **`sources`** block (per-fact provenance with URL + verified date) added in story 3.14a.
- `date_verified` must be the current month/year at write time. Re-verify against the live pricing page, not blog posts.
- Logo lookup cascade (story 3.7): simpleicons.org → lobe-icons → devicon → selfh.st icons → brand-colored placeholder (logged in `docs/logo-coverage.md`). Render simpleicons SVGs with `fill="#<brand_color>"` so they're full-color, not monochrome.

## Site Presentation

- **Astro site (production target).** The site is built from `src/content/services/*.yml` and `src/content/categories/*.yml`. Pages live in `src/pages/`; primitives in `src/components/ui/`. Service cards render the `brand_color` accent automatically — don't hard-code colors in components.
- **Comparison surfaces are free-tier-only.** Category pages and the catalog (`/catalog`) surface free-tier fields (limits, rate limits, `facets.cc_required`, `facets.trial_days`). Paid upgrade paths belong in the service's `notes` or in `pricing[]` rows beyond `name: Free` — never collapsed into the free-tier comparison row. Services with no permanent free tier go in `subcategory: expiring-credits` or `subcategory: limited` so they group correctly on the site (see `ai-apis` category for the canonical pattern).
- **Legacy: `docs/index.html`.** The static HTML site is retained for the GitHub Pages preview only. It gets retired at production cut-over (story 3.13). Don't add features to it; fix only if it actively breaks.

## Scanning & Verification

- **Sprint 3 sweep (complete).** Every service in `src/content/services/*.yml` was re-verified during the Sprint 3 pricing-drift sweep. Pass rate, drift cohort, and per-batch decisions live in `docs/sprints/sprint-3-pricing-drift.md`.
- **Ongoing cadence.** A weekly cron lands in Sprint 5 to re-run the pricing-drift check; until then, `date_verified` is bumped per-PR when a service is touched.
- **Daily scan at 8 PM** — scheduled task `free-stack-daily` checks for new free tiers across tracked categories and writes draft entries to `marketing/drafts/YYYY-MM-DD-<service>.md` for review before any commit. The scan never opens issues or PRs autonomously; it only proposes drafts.
- **Dead services** go to "Services We Don't Include" in `README.md` with a one-line reason, and their YAML is deleted from `src/content/services/`.

## Link Check

- `.github/workflows/link-check.yml` runs weekly via `lychee`.
- On failure: auto-file an issue labeled `dead-link` listing the broken URLs; assign to the maintainer.
- Dead links get fixed (new URL) or the entry is moved to "Services We Don't Include" — never left broken.

## Marketing (Local Only)

- `marketing/` folder is in `.gitignore` — never pushed.
- All social posts require user review before posting — **no autonomous posting under any circumstances**.
- Track progress in `marketing/PLAN.md` and `marketing/LOG.md`.
- Outreach tracked in `marketing/OUTREACH.md`.
- Drafts live in `marketing/drafts/`; promoted posts get logged in `LOG.md` with the platform + URL.

## Social Posting Schedule

- **2x/week**: create infographic + post to X, Dev.to, LinkedIn
- Two accounts: Personal + Professional
- Always create a visual/infographic with each post
- Posts are queued in `marketing/drafts/` for review; the maintainer approves each one before publishing

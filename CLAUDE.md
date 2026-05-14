# Free-Stack Project Rules

## Issue-First Workflow

**Every repo change MUST have a GitHub issue first** (except marketing/ which is .gitignore'd).

- Before making any code/content change, create a GitHub issue describing the work
- Reference the issue number in commits and PRs
- Close issues via PR merge

## PR Workflow

- One PR per issue (unless tightly related)
- Branch naming: `add/[service]`, `update/[service]`, `fix/[description]`, `expand/[category]`, `cleanup/[scope]`, `docs/[scope]`
- PR title format: `add: [service] to [category]` / `update: [service]` / `expand: [category] comparisons`
- Target branch: `main`

### Required PR body

Every PR description must include:

1. **Closes #N** — the issue this PR resolves (or `Part of #N` for multi-PR work)
2. **What changed** — 1–3 sentences summarizing the diff
3. **Verification checklist** — for content PRs:
   - [ ] Entry follows the table format in the target category
   - [ ] `Link` points to the pricing page (not the homepage)
   - [ ] `Verified` is set to the current month/year
   - [ ] Rate limits included where available
   - [ ] Notes section updated if the entry has caveats

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

## Content Rules

- Every service entry must follow the table format in each category file
- Include verified date (current month/year)
- Link to pricing page, not homepage
- Include rate limits when available
- Use Lucide icons (https://github.com/lucide-icons/lucide) for service logos where a match exists; otherwise use https://simpleicons.org/

## Site Presentation (`docs/index.html`)

- **Cards reflect each product's brand identity.** Service cards and CTA buttons should match the product's brand color. Source of truth: the `hex` value on the service's https://simpleicons.org/ entry. Apply it as the card accent, header bar, or button background — pick one consistent surface per card so the page doesn't visually shout.
- **Logos must be colorful (full-color), not monochrome.** simpleicons.org returns monochrome SVGs by default; render them with the brand hex (`fill="#<hex>"`) so each card is recognizable at a glance. Fall back to the brand's official logo asset only if simpleicons.org doesn't carry the service.
- **Comparison tables are free-tier-only.** The per-category comparison table shows what each service offers at **no cost** — free-tier limits, free-tier rate limits, credit-card-required flag. Paid plans and upgrade paths get a separate "Upgrade path" line in the service's `Notes`, never inside the free-tier comparison row. Services that have **no permanent free tier** (trial-only, free credits expire) belong in a clearly labeled subsection (see `ai-ml.md`'s `Free Credits (Expire)` / `Severely Limited` pattern) so they're not confused with permanent-free offerings.

## Scanning & Verification

- **Daily scan at 8 PM** — scheduled task `free-stack-daily` checks for new free tiers across tracked categories and writes draft entries to `marketing/drafts/YYYY-MM-DD-<service>.md` for review before any commit. The scan never opens issues or PRs autonomously; it only proposes drafts.
- **Monthly verification sweep** — re-verify every entry's `Verified` date; bump it or remove the entry based on the current pricing-page reality.
- **Dead services** go to "Services We Don't Include" in README with a one-line reason.

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

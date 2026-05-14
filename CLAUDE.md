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

- **`main` is the only canonical branch.** A stale `master` ref exists on `origin` from the pre-rename history — **never push to, merge into, or base a branch off `master`**. It should be deleted (`git push origin --delete master`) once confirmed unused.
- **Always sync `main` before starting work**: `git checkout main && git pull --ff-only` before `git checkout -b <new-branch>`. Stale-base branches cause merge conflicts and stale-PR thrash.
- **Verify the branch name with `git status` before every `git push`.** No pushes to `main` directly — always via PR. No accidental pushes to `master`.
- **Delete merged feature branches** locally and on origin (`gh pr merge --delete-branch` handles origin; `git branch -d <name>` locally).

## Content Rules

- Every service entry must follow the table format in each category file
- Include verified date (current month/year)
- Link to pricing page, not homepage
- Include rate limits when available
- Use Lucide icons (https://github.com/lucide-icons/lucide) for service logos where a match exists; otherwise use https://simpleicons.org/

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

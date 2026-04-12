# Free-Stack Project Rules

## Issue-First Workflow

**Every repo change MUST have a GitHub issue first** (except marketing/ which is .gitignore'd).

- Before making any code/content change, create a GitHub issue describing the work
- Reference the issue number in commits and PRs
- Close issues via PR merge

## PR Workflow

- One PR per issue (unless tightly related)
- Branch naming: `add/[service]`, `update/[service]`, `fix/[description]`, `expand/[category]`
- PR title format: `add: [service] to [category]` or `update: [service]` or `expand: [category] comparisons`
- Target branch: `main`

## Content Rules

- Every service entry must follow the table format in each category file
- Include verified date (current month/year)
- Link to pricing page, not homepage
- Include rate limits when available
- Use Lucide icons (https://github.com/lucide-icons/lucide) for service logos where a match exists

## Scanning & Verification

- Daily scan at 8 PM for new free tiers
- Monthly verification sweep of all entries
- Dead services go to "Services We Don't Include" in README

## Marketing (Local Only)

- marketing/ folder is in .gitignore — never pushed
- All social posts require user review before posting
- Track progress in marketing/PLAN.md and marketing/LOG.md
- Outreach tracked in marketing/OUTREACH.md

## Social Posting Schedule

- 2x/week: Create infographic + post to X, Dev.to, LinkedIn
- Two accounts: Personal + Professional
- Always create visual/infographic with each post

# Testing & CI/CD

> Free continuous integration, testing infrastructure, and visual regression tools.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| GitHub Actions | 2,000 mins/mo (private repos); unlimited for public repos | 500 MB packages storage; 10 concurrent jobs; 6 hr max job runtime | Per-repo and per-workflow concurrency limits | 2026-04 | [Pricing](https://github.com/pricing) |
| GitLab CI | 400 compute mins/mo | 5 users per group; 10 GB storage per project; unlimited on self-hosted runners | Minutes reset monthly; no rollover | 2026-04 | [Pricing](https://about.gitlab.com/pricing/) |
| CircleCI | 30,000 credits/mo (~6,000 build mins) | 5 active users; 2 GB storage; 30x Docker/Linux concurrency | Credits expire monthly; no rollover | 2026-04 | [Pricing](https://circleci.com/pricing/) |
| Codecov | Free for open source; 5 users on private repos | Unlimited coverage reports for public repos; full feature set | No documented rate limits | 2026-04 | [Pricing](https://about.codecov.io/pricing/) |
| Percy (BrowserStack) | 5,000 screenshots/mo | Unlimited users and projects; 30-day build history | Screenshots reset monthly | 2026-04 | [Pricing](https://percy.io/pricing) |
| Chromatic | 5,000 snapshots/mo; unlimited for open source | Unlimited collaborators and Storybooks; 1 snapshot = 1 story x 1 browser x 1 viewport | No overage allowed -- testing stops at limit | 2026-04 | [Pricing](https://www.chromatic.com/pricing) |
| Playwright | Fully free and open source | No limits -- runs locally or in CI; supports Chromium, Firefox, WebKit | N/A (local execution) | 2026-04 | [Docs](https://playwright.dev/) |
| Depot | Free developer tier | Per-minute billing tracked per second; no minimum; fast Docker + GHA builds | Exact free minutes not publicly documented | 2026-04 | [Pricing](https://depot.dev/pricing) |
| Travis CI | First 100 builds free (trial only) | No permanent free tier for private or open-source repos since 2020 | Credit-based after trial | 2026-04 | [Pricing](https://www.travis-ci.com/pricing/) |
| BrowserStack | Free for Percy (5K screenshots) + Test Management only | Core products (Live, Automate) require paid plans starting at $29/mo | 30-min Live + 100-min Automate trial only | 2026-04 | [Pricing](https://www.browserstack.com/pricing) |

## Notes

- **Permanent free tiers**: GitHub Actions, GitLab CI, CircleCI, Codecov, Percy, Chromatic, and Playwright all offer permanent free tiers.
- **Travis CI** no longer offers a meaningful free tier -- listed for reference only. Most open-source projects have migrated to GitHub Actions.
- **BrowserStack** only offers permanent free access to Percy and Test Management; core testing products are paid-only after trial.
- **GitHub Actions** is the de facto standard for open-source CI/CD with unlimited minutes on public repos.
- **Playwright** is a fully open-source test framework with no SaaS dependency -- pair it with GitHub Actions for a completely free E2E testing pipeline.
- **Percy** and **Chromatic** both offer 5,000 free screenshots/snapshots per month, making them viable for visual regression testing on small-to-medium projects.

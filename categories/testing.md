# Testing & CI/CD

> Free continuous integration, testing infrastructure, and visual regression tools.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| GitHub Actions | 2,000 mins/mo (private repos); unlimited for public repos | 500 MB packages storage; 10 concurrent jobs; 6 hr max job runtime | Per-repo and per-workflow concurrency limits | 2026-04 | [Pricing](https://github.com/pricing) |
| GitLab CI | 400 compute mins/mo | 5 users per top-level group; 10 GB storage per project; unlimited on self-hosted runners | Minutes reset monthly; no rollover | 2026-04 | [Pricing](https://about.gitlab.com/pricing/) |
| CircleCI | 30,000 credits/mo (~6,000 build mins on Linux/Docker) | 5 active users; 400K credits/mo for open-source Linux/Arm/Docker builds | Credits expire monthly; no rollover | 2026-04 | [Pricing](https://circleci.com/pricing/) |
| Percy (BrowserStack) | 5,000 screenshots/mo | Unlimited users and projects; cross-browser; 30-day build history | Screenshots reset monthly | 2026-04 | [Pricing](https://percy.io/pricing) |
| Chromatic | 5,000 snapshots/mo; unlimited for qualifying open source | Unlimited collaborators and Storybooks; 1 snapshot = 1 story x 1 browser x 1 viewport | No overage allowed -- testing stops at limit | 2026-04 | [Pricing](https://www.chromatic.com/pricing) |
| Argos CI | 5,000 screenshots/mo; open-source sponsorship available | Unlimited projects; screenshot = 1 page x 1 browser x 1 viewport | No overage -- stops at limit | 2026-04 | [Pricing](https://argos-ci.com/pricing) |
| Playwright | Fully free and open source | No limits -- runs locally or in CI; supports Chromium, Firefox, WebKit | N/A (local execution) | 2026-04 | [Docs](https://playwright.dev/) |
| Qase | Free for up to 3 users, 2 projects | Unlimited test cases; 2 concurrent test runs; 500 MB storage; Jira integration; REST API | No documented rate limits | 2026-04 | [Pricing](https://qase.io/pricing) |
| Travis CI | First 100 builds free (trial only) | No permanent free tier for private or open-source repos since 2020 | Credit-based after trial | 2026-04 | [Pricing](https://www.travis-ci.com/pricing/) |
| BrowserStack | Free for Percy (5K screenshots) + Test Management only | Core products (Live, Automate) require paid plans starting at $12.50/mo | 30-min Live + 100-min Automate trial only | 2026-04 | [Pricing](https://www.browserstack.com/pricing) |

## Notes

- **GitHub Actions** 2026 pricing update: runner prices dropped up to 39% on Jan 1, 2026. Starting Mar 1, 2026, self-hosted runners consume free-tier minutes at list price rates.
- **Playwright** 1.57+ switched from Chromium builds to Chrome for Testing on most platforms. 1.58 added Timeline view in HTML reports for performance debugging.
- **Argos CI** (new) is an open-source visual regression tool offering 5,000 free screenshots/mo -- a strong alternative to Percy/Chromatic with a developer-friendly experience.
- **Qase** (new) is a test management platform with a free tier for up to 3 users and 2 projects, including API access and Jira integration.
- **Travis CI** no longer offers a meaningful free tier -- listed for reference only. Most open-source projects have migrated to GitHub Actions.
- **BrowserStack** only offers permanent free access to Percy and Test Management; core testing products (Live, Automate) are paid-only after trial.
- **Playwright** is a fully open-source test framework with no SaaS dependency -- pair it with GitHub Actions for a completely free E2E testing pipeline.
- **Percy**, **Chromatic**, and **Argos CI** all offer 5,000 free screenshots/snapshots per month, making them viable for visual regression testing on small-to-medium projects.
- **Depot** was researched but excluded -- its Developer plan (500 build mins, 1 user) appears to be a paid plan, not a free tier. A 7-day free trial is available.
- **Currents.dev** was researched but excluded -- no confirmed permanent free tier; offers a trial and a "Community" plan with unspecified limits.

---

*Last verified: 2026-04*

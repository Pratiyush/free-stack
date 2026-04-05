# Code Quality

> Code analysis, coverage, linting, and review tools with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| SonarCloud | Free for open source; 50K LoC for private repos | 30 languages; GitHub, GitLab, Bitbucket, Azure DevOps integration | No documented rate limits | 2026-04 | [Pricing](https://www.sonarsource.com/plans-and-pricing/) |
| Codacy | Free Pro plan for open-source repos; Starter plan for small teams (up to 2 committers) | Static analysis, coverage tracking, 49 languages; public repos unlimited | Per-committer seat model | 2026-04 | [Pricing](https://www.codacy.com/pricing) |
| CodeClimate (Qlty) | Free for public open-source repos | Quality metrics: complexity, duplication, security, style; test coverage tracking | No documented rate limits | 2026-04 | [Pricing](https://codeclimate.com/quality/pricing) |
| Codecov | Free for up to 5 users; unlimited public repos | Unlimited coverage reports for public repos; full feature set on private repos for 5 users | No documented rate limits | 2026-04 | [Pricing](https://about.codecov.io/pricing/) |
| Coveralls | Free for open-source (public) repos | Unlimited public repos; coverage history and badge support | No documented rate limits | 2026-04 | [Pricing](https://coveralls.io/pricing) |
| DeepSource | Free: 1 private repo, 3 team members, 500 analysis runs/mo, 50 Autofix runs/mo; unlimited public repos | Static analysis, SAST, secrets detection; supports Python, Go, JS, Ruby, and more | 500 analysis runs/mo on free tier | 2026-04 | [Pricing](https://deepsource.com/pricing) |
| CodeRabbit | Free for public and private repos; unlimited repos and team members | AI code review on PRs; GitHub, GitLab, Azure DevOps, Bitbucket | 200 files/hr; 4 PR reviews/hr; 3 back-to-back reviews then cooldown | 2026-04 | [Pricing](https://www.coderabbit.ai/pricing) |

## Notes

- **Permanent free tiers**: SonarCloud, Codacy, CodeClimate, Codecov, Coveralls, DeepSource, and CodeRabbit all offer permanent free tiers.
- **Open source advantage**: Codacy gives the full Pro plan free for open-source repos. CodeRabbit gives full Pro features indefinitely for public repos.
- **SonarCloud** is the most widely adopted static analysis platform -- the 50K LoC limit on private repos is sufficient for small projects.
- **Codecov** and **Coveralls** both focus on test coverage and integrate well with CI pipelines like GitHub Actions.
- **DeepSource** stands out with AI-powered Autofix suggestions included in the free tier.
- **CodeRabbit** replaced Codiga (which had limited free tier documentation) as it offers a more substantial and well-documented free AI code review experience.

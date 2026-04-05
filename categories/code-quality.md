# Code Quality

> Code analysis, coverage, linting, and review tools with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| SonarCloud (SonarQube Cloud) | Free for open source; 50K LoC for private repos | 30 languages; GitHub, GitLab, Bitbucket, Azure DevOps integration | No documented rate limits | 2026-04 | [Pricing](https://www.sonarsource.com/plans-and-pricing/) |
| Codacy | Free for open-source repos (full Pro features); Starter plan free for up to 2 committers | Static analysis, SAST, SCA, secrets detection, coverage tracking; 49 languages | Per-committer seat model | 2026-04 | [Pricing](https://www.codacy.com/pricing) |
| Qlty (formerly CodeClimate) | Free CLI for all use (no contributor limits); Qlty Cloud free for unlimited private contributors | Linting, auto-formatting, maintainability, security; 70+ static analysis tools; 40+ languages; test coverage in PRs | No documented rate limits | 2026-04 | [Pricing](https://codeclimate.com/quality/pricing) |
| Codecov | Free for up to 5 users; unlimited public repos | Unlimited coverage reports for public repos; full feature set on private repos for 5 users | No documented rate limits | 2026-04 | [Pricing](https://about.codecov.io/pricing/) |
| Coveralls | Free for open-source (public) repos | Unlimited public repos; coverage history and badge support | No documented rate limits | 2026-04 | [Pricing](https://coveralls.io/pricing) |
| DeepSource | Free: 1 private repo, 3 team members, 500 analysis runs/mo, 50 Autofix runs/mo; unlimited public repos | Static analysis, SAST, secrets detection; supports Python, Go, JS, Ruby, and more | 500 analysis runs/mo on free tier | 2026-04 | [Pricing](https://deepsource.com/pricing) |
| CodeRabbit | Free for public and private repos; unlimited repos and team members | AI code review on PRs; GitHub, GitLab, Azure DevOps, Bitbucket; Pro features free on public repos | 200 files/hr; 4 PR reviews/hr; 3 back-to-back reviews then cooldown | 2026-04 | [Pricing](https://www.coderabbit.ai/pricing) |
| Qodana (JetBrains) | Community tier: free forever; 4 free Community linters (JVM, Python, .NET, Clang) | Self-hosted via Docker; supports private repos; limited data storage in Qodana Cloud; 15 linters total (4 free) | No documented rate limits | 2026-04 | [Pricing](https://www.jetbrains.com/qodana/buy/) |
| Trunk Check | Free for public repos + private repos with up to 5 active committers | Universal meta-linter aggregating 100+ linting/formatting tools; all features included regardless of tier; soft enforcement | No documented rate limits | 2026-04 | [Pricing](https://trunk.io/pricing) |
| Biome | Fully free and open source (MIT/Apache 2.0) | All-in-one linter + formatter for JS, TS, JSX, JSON, CSS, GraphQL; 450+ rules; written in Rust; zero-config | N/A -- local tool, no API | 2026-04 | [GitHub](https://github.com/biomejs/biome) |

## Notes

- **Permanent free tiers**: SonarCloud, Codacy, Qlty, Codecov, Coveralls, DeepSource, CodeRabbit, Qodana Community, and Trunk Check all offer permanent free tiers.
- **Fully open source**: Biome is MIT/Apache 2.0 licensed and runs entirely locally -- no cloud dependency, no rate limits, no account required.
- **Open source advantage**: Codacy gives the full Pro plan free for open-source repos. CodeRabbit gives full Pro features indefinitely for public repos.
- **SonarCloud** is the most widely adopted static analysis platform -- the 50K LoC limit on private repos is sufficient for small projects.
- **Qlty** (the CodeClimate rebrand) now offers a free Rust-based CLI with no contributor limits plus a free cloud tier for unlimited private contributors.
- **Qodana** brings JetBrains IDE inspections into CI/CD. The Community tier is free but limited to 4 language linters; paid tiers start at $6/contributor/mo.
- **Trunk Check** is a meta-linter that aggregates 100+ existing tools (ESLint, Prettier, etc.) into a single CLI with hold-the-line and caching -- free for small teams.
- **Biome** is the fastest-growing ESLint/Prettier replacement, written in Rust. It is not a cloud service but a local tool -- included here because it is a key code quality tool with zero cost.
- **Codecov** and **Coveralls** both focus on test coverage and integrate well with CI pipelines like GitHub Actions.
- **DeepSource** stands out with AI-powered Autofix suggestions included in the free tier (50 runs/mo).

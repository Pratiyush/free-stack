# Security

> Free security scanning, secrets management, SSL/TLS, and dependency protection tools.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Snyk** | Free plan | 400 Open Source tests, 100 Code tests, 300 IaC tests, 100 Container tests per billing period; public repos unlimited | IDE scans don't count toward limits; suitable for 1-3 private repos | 2026-04 | [Pricing](https://snyk.io/plans/) |
| **Semgrep** | Community Edition (open-source) + AppSec Platform free tier | CE: unlimited SAST scans, 30+ languages, 3,000+ community rules, single-file analysis (LGPL-2.1); AppSec Platform: free for up to 10 contributors/10 private repos with cross-file SAST, SCA, and Secrets | Team plan $35/contributor/mo beyond free tier | 2026-04 | [Pricing](https://semgrep.dev/pricing/) |
| **Dependabot (GitHub)** | Free for all repos | Unlimited -- security alerts, version updates, grouped PRs across 30+ ecosystems; free for public and private repos on all GitHub plans | Default: 5 open PRs at a time; custom auto-triage rules free on public repos only | 2026-04 | [Docs](https://docs.github.com/en/code-security/dependabot) |
| **Socket.dev** | Free for open source | Unlimited devs and repos for open-source projects; 70+ risk types detected; malware blocking; package health scores free for everyone | Free forever for open-source; paid starts at $25/mo for private repos | 2026-04 | [Pricing](https://socket.dev/pricing) |
| **GitGuardian** | Starter (free) | Up to 25 contributing developers (commit authors in last 90 days), unlimited real-time secret scanning on private repos; no credit card required | 10K API calls/mo (rolling month); auto-trial starts if >25 devs | 2026-04 | [Pricing](https://www.gitguardian.com/pricing) |
| **Trivy (Aqua Security)** | Open-source (Apache 2.0) | Full vulnerability, misconfiguration, secret, SBOM, and license scanning for containers, filesystems, repos, VMs, and Kubernetes; no usage limits | Self-hosted only; Trivy Enterprise (paid) adds centralized management and compliance reporting | 2026-04 | [Trivy](https://trivy.dev/) |
| **Let's Encrypt** | Free forever | Unlimited free SSL/TLS certificates; up to 100 SANs per cert; switching to 45-day certificates on May 13, 2026 (from 90-day) | 50 certs/registered domain/week; 300 new orders/3 hrs per account; renewals exempt from domain limit | 2026-04 | [Rate Limits](https://letsencrypt.org/docs/rate-limits/) |
| **Cloudflare SSL** | Free plan | Universal SSL, automatic issuance and renewal, global CDN, DDoS protection | Unmetered DDoS; 5 firewall rules; community-only support | 2026-04 | [Free Plan](https://www.cloudflare.com/plans/free/) |
| **HashiCorp Vault** | Community Edition (self-hosted) | Full secrets management, encryption, identity -- self-hosted only | HCP Vault Secrets free tier EOL July 2026; use Community Edition | 2026-04 | [Vault](https://www.hashicorp.com/en/lp/vault-p) |
| **1Password** | Free for open-source teams | 1Password Teams free for eligible open-source projects; no expiry | No general free tier; individual plans from $2.99/mo; 14-day trial otherwise | 2026-04 | [Open Source](https://github.com/1Password/for-open-source) |

## Notes

- **Best zero-config**: Dependabot -- built into GitHub, free for all repos, zero setup beyond a YAML file.
- **Best SAST**: Semgrep -- Community Edition is unlimited open-source SAST; the AppSec Platform free tier (10 contributors, 10 repos) adds cross-file analysis, SCA, and secrets detection with no cost.
- **Best secret scanning**: GitGuardian free tier covers up to 25 devs with unlimited real-time scanning.
- **Best container/IaC scanning**: Trivy -- fully open-source, scans containers, K8s, IaC, filesystems, and generates SBOMs. No managed free tier, but trivial to run in CI/CD.
- **Socket.dev** is permanently free for open-source projects and focuses on supply chain attacks (malware in dependencies) rather than traditional CVE scanning.
- **Let's Encrypt** is switching to 45-day certificates on May 13, 2026 (opt-in phase). Renewals are exempt from rate limits, so this should not require config changes if your ACME client auto-renews.
- **Cloudflare** free plan is production-grade: SSL + CDN + DDoS protection at zero cost.
- **HCP Vault Secrets** (managed) is being discontinued (EOL July 2026) -- use the self-hosted Community Edition instead.
- **Aqua Security** (maker of Trivy) offers commercial CNAPP products but has no meaningful free tier beyond the open-source Trivy scanner itself.
- **Snyk** free plan works well for individual devs or small teams (1-3 private repos); CI/CD-heavy teams with 10+ repos will exhaust monthly test quotas quickly.

---

*Last verified: 2026-04*

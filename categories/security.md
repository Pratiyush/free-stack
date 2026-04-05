# Security

> Free security scanning, secrets management, SSL/TLS, and dependency protection tools.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Snyk** | Free plan | 400 Open Source tests, 100 Code tests, 300 IaC tests, 100 Container tests per billing period | Unlimited public repo scans; 1-3 active repos suitable | ✅ 2026-04 | [Pricing](https://snyk.io/plans/) |
| **Dependabot (GitHub)** | Free for all repos | Unlimited — security alerts, version updates, grouped PRs across 30+ ecosystems | No usage limits; free for public and private repos on all GitHub plans | ✅ 2026-04 | [Docs](https://docs.github.com/en/code-security/dependabot) |
| **Socket.dev** | Free for open source | Unlimited devs and repos; 70+ risk types detected; malware blocking | Free forever for open-source; paid starts at $25/mo for private repos | ✅ 2026-04 | [Pricing](https://socket.dev/pricing) |
| **GitGuardian** | Starter (free) | Up to 25 developers, unlimited real-time secret scanning | 10K API calls/mo (rolling month); no credit card required | ✅ 2026-04 | [Pricing](https://www.gitguardian.com/pricing) |
| **Let's Encrypt** | Free forever | Unlimited free SSL/TLS certificates; up to 100 SANs per cert | 50 certs/domain/week; 300 new orders/3 hrs per account | ✅ 2026-04 | [Rate Limits](https://letsencrypt.org/docs/rate-limits/) |
| **Cloudflare SSL** | Free plan | Universal SSL, automatic issuance and renewal, global CDN, DDoS protection | Unmetered DDoS; 5 firewall rules; community-only support | ✅ 2026-04 | [Free Plan](https://www.cloudflare.com/plans/free/) |
| **HashiCorp Vault** | Community Edition (self-hosted) | Full secrets management, encryption, identity — self-hosted only | HCP Vault Secrets free tier EOL July 2026; use Community Edition | ✅ 2026-04 | [Vault](https://www.hashicorp.com/en/lp/vault-p) |
| **1Password** | Free for open-source teams | 1Password Teams free for eligible open-source projects; no expiry | No general free tier; individual plans from $2.99/mo; 14-day trial otherwise | ✅ 2026-04 | [Open Source](https://github.com/1Password/for-open-source) |

## Notes

- **Best zero-config**: Dependabot — built into GitHub, free for all repos, zero setup beyond a YAML file.
- **Best secret scanning**: GitGuardian free tier covers up to 25 devs with unlimited real-time scanning.
- **Let's Encrypt** is moving to 45-day certificates starting May 2026 (opt-in phase).
- **Cloudflare** free plan is production-grade: SSL + CDN + DDoS protection at zero cost.
- **HCP Vault Secrets** (managed) is being discontinued (EOL July 2026) — use the self-hosted Community Edition instead.
- **Socket.dev** is permanently free for open-source projects; private repos require paid plan.

# Containers & Registries

> Container registries, orchestration, and Docker-related services with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Docker Hub | Docker Personal (free forever) | Unlimited public repos, 1 private repo, Docker Scout (3 repos), 50 min/mo Build Cloud | 200 pulls per 6-hour window (unauthenticated: 100/6hr) | ✅ 2026-04 | [docker.com/pricing](https://www.docker.com/pricing/) |
| GitHub Container Registry | Free for public images (currently free) | Unlimited public image storage, 500MB private package storage, 1GB data transfer/mo (private) | No rate limit on public images; Actions pulls always free | ✅ 2026-04 | [docs.github.com/packages](https://docs.github.com/en/billing/concepts/product-billing/github-packages) |
| GitLab Container Registry | Free tier (included with GitLab Free) | 5GB total namespace storage (shared with repos/LFS/registry), unlimited private images | 5 users per namespace, CI/CD 400 min/mo (shared) | ✅ 2026-04 | [about.gitlab.com/pricing](https://about.gitlab.com/pricing/) |
| Quay.io | Free for public repos | Unlimited public repos, anonymous pulls allowed | Fair use: 100GB storage, 1TB egress/mo (soft limits, contact for OSS exceptions) | ✅ 2026-04 | [quay.io/plans](https://quay.io/plans/) |
| AWS ECR Public | Free permanently (public repos) | 50GB storage for public repos, cross-region replication | 500GB/mo anonymous transfer, 5TB/mo authenticated transfer; same-region AWS compute always free | ✅ 2026-04 | [aws.amazon.com/ecr/pricing](https://aws.amazon.com/ecr/pricing/) |
| Google Artifact Registry | Free tier (permanent) | 0.5GB storage free (per billing account across all projects) | Inbound transfer free; outbound charged at Premium tier rates beyond free quota | ✅ 2026-04 | [cloud.google.com/artifact-registry/pricing](https://cloud.google.com/artifact-registry/pricing) |
| Harbor (self-hosted) | Open-source, fully free | Unlimited repos, images, and users (self-hosted) | No vendor rate limits; limited by your own infrastructure | ✅ 2026-04 | [goharbor.io](https://goharbor.io/) |

## Notes

- **AWS ECR Private** offers only 500MB free for 12 months (not permanent) -- excluded from the table.
- **Docker Hub** rate limits are per-IP for unauthenticated and per-account for authenticated users; HTTP 429 returned when exceeded.
- **GitHub Container Registry** is "currently free" for public images with a promise of 1-month advance notice before any pricing changes.
- **Quay.io** has no paid-only features difference; paid tiers ($15/mo+) add private repos only.
- **Google Artifact Registry** 0.5GB is quite small -- best paired with CI/CD pipelines that clean up old images.

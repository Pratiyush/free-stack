# Containers & Registries

> Container registries, cloud dev environments, and Docker-related services with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Docker Hub | Docker Personal (free forever) | Unlimited public repos, 1 private repo, Docker Scout (3 repos), 50 min/mo Build Cloud | 200 pulls per 6-hour window (unauthenticated: 100/6hr); HTTP 429 when exceeded | ✅ 2026-04 | [docker.com/pricing](https://www.docker.com/pricing/) |
| GitHub Container Registry | Free for public images (currently free) | Unlimited public image storage, 500MB private package storage, 1GB data transfer/mo (private) | No rate limit on public images; Actions pulls always free; fair-use policy on excessive egress | ✅ 2026-04 | [docs.github.com/packages](https://docs.github.com/en/billing/concepts/product-billing/github-packages) |
| GitLab Container Registry | Free tier (included with GitLab Free) | 5GB total namespace storage (shared with repos/LFS/registry), unlimited private images | 5 users per namespace, CI/CD 400 min/mo (shared) | ✅ 2026-04 | [about.gitlab.com/pricing](https://about.gitlab.com/pricing/) |
| Quay.io | Free for public repos | Unlimited public repos, anonymous pulls allowed | Fair use: 100GB storage, 1TB egress/mo (soft limits, contact for OSS exceptions) | ✅ 2026-04 | [quay.io/plans](https://quay.io/plans/) |
| AWS ECR Public | Free permanently (public repos) | 50GB storage for public repos, cross-region replication | 500GB/mo anonymous transfer, 5TB/mo authenticated transfer; same-region AWS compute always free | ✅ 2026-04 | [aws.amazon.com/ecr/pricing](https://aws.amazon.com/ecr/pricing/) |
| Google Artifact Registry | Free tier (permanent) | 0.5GB storage free (per billing account across all projects) | Inbound transfer free; outbound charged at Premium tier rates beyond free quota | ✅ 2026-04 | [cloud.google.com/artifact-registry/pricing](https://cloud.google.com/artifact-registry/pricing) |
| Harbor (self-hosted) | Open-source, fully free | Unlimited repos, images, and users (self-hosted) | No vendor rate limits; limited by your own infrastructure | ✅ 2026-04 | [goharbor.io](https://goharbor.io/) |
| GitHub Codespaces | Free for personal accounts | 120 core-hours/mo (60 hrs on 2-core), 15GB storage/mo | Compute: $0.18/hr after free quota; storage: $0.07/GB/mo after free quota | ✅ 2026-04 | [github.com/features/codespaces](https://github.com/features/codespaces) |
| Gitpod | Free tier (permanent) | 50 hours/month, up to 4 vCPUs, 16GB RAM, 80GB disk per workspace | Up to 3 parallel environments; auto-delete after 3 days of inactivity; paid starts at $9/mo | ✅ 2026-04 | [gitpod.io/pricing](https://gitpod.io/pricing) |

## Notes

- **AWS ECR Private** offers only 500MB free for 12 months (not permanent) -- excluded from the table.
- **Docker Hub** rate limits are per-IP for unauthenticated and per-account for authenticated users; HTTP 429 returned when exceeded. Docker Personal requires fewer than 250 employees AND less than $10M annual revenue.
- **GitHub Container Registry** is "currently free" for public images with a promise of 30-day advance notice before any pricing changes. Fair-use team may flag excessive egress.
- **Quay.io** has no paid-only features difference; paid tiers ($15/mo+) add private repos only.
- **Google Artifact Registry** 0.5GB is quite small -- best paired with CI/CD pipelines that clean up old images.
- **GitHub Codespaces** free quota applies to personal accounts only; organization/enterprise accounts do not include free usage.
- **Gitpod** was acquired by and now operates as Gitpod Flex; the free tier provides $10 worth of usage (~40 OCUs) per month.

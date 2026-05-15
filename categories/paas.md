# Platform as a Service (PaaS)

> Managed platforms for deploying applications without infrastructure management.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Render** | Free plan (no credit card required) | 750 free instance hours/mo, 100 GB bandwidth/mo, 500 build minutes/mo, free PostgreSQL (1 GB, **30-day expiry**) | Services spin down after 15 min idle, ~1 min cold start; 14-day grace period after DB expiry before deletion | ✅ 2026-04 | [render.com/pricing](https://render.com/pricing) |
| **Koyeb** | Starter plan (forever-free) | 1 web service (Frankfurt or Washington DC), 512 MB RAM, 0.1 vCPU, 2 GB SSD, 1 free PostgreSQL (1 GB, 5 hrs active/day), 100 GB outbound bandwidth/mo | Scale-to-zero enforced, single instance only, no credit card required, commercial use allowed | ✅ 2026-04 | [koyeb.com/pricing](https://www.koyeb.com/pricing) |
| **DigitalOcean App Platform** | Free plan | 3 static sites, 1 GiB outbound data transfer/mo per app | Static sites only on free tier, no dynamic apps; additional static apps $3/mo | ✅ 2026-04 | [digitalocean.com/pricing/app-platform](https://www.digitalocean.com/pricing/app-platform) |
| **Coolify** | Free (open-source, self-hosted) | Unlimited apps, all features included, deploy Docker/Nixpacks/Buildpacks | Requires your own server (e.g. $5/mo VPS), no managed free cloud | ✅ 2026-04 | [coolify.io/pricing](https://coolify.io/pricing) |
| **Coherence** | Free tier for small teams | 1 environment, 1 app, managed CI/CD pipelines on your own cloud account | Connects to your AWS/GCP, limited to 1 active environment | ✅ 2026-04 | [withcoherence.com/pricing](https://www.withcoherence.com/pricing) |
| **Zeabur** | Free Serverless plan | Serverless deployments, auto-scaling, shared compute, community support | Usage-based beyond free credits, serverless only on free tier | ✅ 2026-04 | [zeabur.com/pricing](https://zeabur.com/pricing) |
| **Back4App Containers** | Free plan (no credit card required) | 0.25 CPU, 256 MB RAM, auto-sleep after inactivity, free subdomain | Containers sleep on inactivity, limited compute | ✅ 2026-04 | [back4app.com/pricing](https://www.back4app.com/pricing/container-as-a-service) |
| **Qovery** | Free plan (BYOC -- bring your own cloud) | 1 cluster, 5 environments, unlimited developers, preview environments, community support | Deploys to **your own** AWS/GCP/Azure account (you pay cloud infra costs); Qovery layer is free | ✅ 2026-04 | [qovery.com/pricing](https://www.qovery.com/pricing) |

## Notes

- **Render** updated its free PostgreSQL expiry from 90 days to **30 days** (changed May 2024). After expiry, you get a 14-day grace period to upgrade before data is deleted.
- **Koyeb** is one of the few PaaS providers that explicitly allows commercial use on its free tier.
- **Qovery** is free as a management layer, but it requires you to bring your own cloud account (AWS/GCP/Azure). The underlying cloud compute costs are yours. Best for teams already on AWS who want a Heroku-like workflow.
- **Coolify** is self-hosted, so "free" means the software itself -- you still need a VPS.

## Evaluated but Excluded

- **Heroku** -- permanently removed its free tier in November 2022. Cheapest option is $5/mo (Eco dynos).
- **Railway** -- offers only a one-time $5 trial credit (expires in 30 days), not a permanent free tier.
- **Fly.io** -- removed its free tier for new users in 2024; only a 2-hour or 7-day trial remains.
- **Cyclic** -- service was shut down.
- **Porter Cloud** -- offers a free trial only (not a permanent free tier). Startup deal gives 25 vCPU + 50 GB RAM free for 6 months, but requires qualification. Metered billing beyond trial.
- **Aptible** -- no free tier. 30-day trial only (3 GB compute, 20 GB storage, 1 endpoint). Pay-as-you-go starts at ~$0.08/GB RAM/hr. Compliance-focused, premium pricing.

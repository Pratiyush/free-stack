# ☁️ Platform as a Service (PaaS)

> Managed platforms for deploying applications without infrastructure management.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Render | Free plan (no credit card required) | 750 free instance hours/mo, 100GB bandwidth/mo, 500 build minutes/mo, free PostgreSQL (1 GB, 90-day expiry) | Services spin down after 15 min idle, ~1 min cold start | ✅ 2026-04 | [render.com/pricing](https://render.com/pricing) |
| Koyeb | Starter plan (forever-free) | 1 web service (Frankfurt or Washington DC), 512MB RAM, 0.1 vCPU, 2GB SSD, 1 free PostgreSQL (1GB, 5 hrs active/day), 100GB outbound bandwidth/mo | Scale-to-zero enforced, single instance only, no credit card required | ✅ 2026-04 | [koyeb.com/pricing](https://www.koyeb.com/pricing) |
| DigitalOcean App Platform | Free plan | 3 static sites, 1 GiB outbound data transfer/mo per app | Static sites only on free tier, no dynamic apps | ✅ 2026-04 | [digitalocean.com/pricing/app-platform](https://www.digitalocean.com/pricing/app-platform) |
| Coolify | Free (open-source, self-hosted) | Unlimited apps, all features included, deploy Docker/Nixpacks/Buildpacks | Requires your own server (e.g. $5/mo VPS), no managed free cloud | ✅ 2026-04 | [coolify.io/pricing](https://coolify.io/pricing) |
| Adaptable.io | Free plan | Shared container, 256MB RAM, auto-sleep after inactivity, managed MongoDB/PostgreSQL included | Wakes on request, limited to hobby use | ✅ 2026-04 | [adaptable.io/pricing](https://adaptable.io/pricing) |
| Coherence | Free tier for small teams | 1 environment, 1 app, managed CI/CD pipelines on your own cloud account | Connects to your AWS/GCP, limited to 1 active environment | ✅ 2026-04 | [withcoherence.com/pricing](https://www.withcoherence.com/pricing) |
| Zeabur | Free Serverless plan | Serverless deployments, auto-scaling, shared compute, community support | Usage-based beyond free credits, serverless only on free tier | ✅ 2026-04 | [zeabur.com/pricing](https://zeabur.com/pricing) |
| Back4App Containers | Free plan (no credit card required) | 0.25 CPU, 256MB RAM, auto-sleep after inactivity, free subdomain | Containers sleep on inactivity, limited compute | ✅ 2026-04 | [back4app.com/pricing/container-as-a-service](https://www.back4app.com/pricing/container-as-a-service) |

## Notes

- **Heroku** was evaluated but excluded: it permanently removed its free tier in November 2022. The cheapest option is now $5/mo (Eco dynos).
- **Railway** was evaluated but excluded: it offers only a one-time $5 trial credit (expires in 30 days), not a permanent free tier.
- **Fly.io** was evaluated but excluded: it removed its free tier for new users in 2024; only a 2-hour or 7-day trial remains.
- **Cyclic** was evaluated but excluded: the service was shut down.
- Coolify is self-hosted, so "free" means the software itself -- you still need a VPS.

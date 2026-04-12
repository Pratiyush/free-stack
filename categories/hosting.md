# Hosting & Deployment

> Free hosting, deployment, and serverless platforms.

| Service | Free Tier | Limits | Rate Limits | Credit Card | Verified | Link |
|---------|-----------|--------|-------------|-------------|----------|------|
| Vercel | Hobby plan (personal, non-commercial) | 100 GB bandwidth/mo, 1M edge requests/mo, 1M function invocations/mo, 4 hrs active CPU/mo, 360 GB-hrs provisioned memory/mo, 1 GB blob storage, 5K image transformations/mo, 100 MB max upload via CLI | Hard caps; no overage on Hobby. Services pause until next billing cycle. 100 deploys/day | No | ✅ 2026-04 | [vercel.com/pricing](https://vercel.com/pricing) |
| Netlify | Free plan (credit-based since Sep 2025) | 100 GB bandwidth/mo, 300 build minutes/mo, 10 GB storage, 125K serverless function invocations/mo, 1M edge function invocations/mo, 100 form submissions/mo | Hard caps; site suspended for remainder of month if exceeded. 1 team member only | No | ✅ 2026-04 | [netlify.com/pricing](https://www.netlify.com/pricing/) |
| Cloudflare Pages | Free plan (commercial use allowed) | Unlimited bandwidth, unlimited requests, unlimited sites (soft limit 100 projects), 500 builds/mo, 20K files per site, 25 MB max file size, 20 min build timeout | 100K Workers/Functions requests/day (shared). Workers stop running when limit hit, no surprise charges | No | ✅ 2026-04 | [cloudflare.com/plans/developer-platform](https://www.cloudflare.com/plans/developer-platform/) |
| GitHub Pages | Free with GitHub Free account | 1 GB site size (recommended), 100 GB bandwidth/mo (soft), 10 builds/hr (soft), static sites only | Soft limits; GitHub sends polite email if exceeded. Public repos only on free plan (no Pages from private repos) | No | ✅ 2026-04 | [github.com/pricing](https://github.com/pricing) |
| Render | Free plan | 750 free instance hours/mo, 100 GB bandwidth/mo, 500 build minutes/mo, 1 GB Postgres (expires after 30 days) | Services spin down after 15 min idle (~1 min cold start). Free Postgres deleted 44 days after creation if not upgraded | Conflicting info; may be required for web services but not static sites | ✅ 2026-04 | [render.com/pricing](https://render.com/pricing) |
| Firebase Hosting | Spark plan (free) | 10 GB storage, 360 MB/day transfer (~10 GB/mo), custom domains, SSL included | Hard cap on Spark; no overage billing. Note: Cloud Storage for Firebase on Spark lost access Feb 2026 (Hosting unaffected) | No | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Deno Deploy | Free plan | 1M requests/mo, 100 GB egress/mo, 1 GiB KV storage, commercial use allowed | Hard caps on requests and egress | No | ✅ 2026-04 | [deno.com/deploy/pricing](https://deno.com/deploy/pricing) |
| Koyeb | Starter plan (forever-free) | 1 web service, 512 MB RAM, 0.1 vCPU, 2 GB SSD, 100 GB outbound bandwidth/mo, 5 custom domains, 1 free Postgres (5 hrs active, 1 GB storage) | Single instance only; Frankfurt or Washington DC region | No | ✅ 2026-04 | [koyeb.com/pricing](https://www.koyeb.com/pricing) |
| Surge.sh | Free plan | Unlimited static sites, custom domains, basic SSL on *.surge.sh subdomains | Static sites only. No custom SSL on free tier (requires $30/mo Surge Professional). No documented bandwidth cap | No | ✅ 2026-04 | [surge.sh/pricing](https://surge.sh/pricing) |
| Zeabur | Serverless plan (free) | $5/mo free credits (resets monthly), unlimited projects, unlimited services, up to 1 vCPU and 2 GB memory per service. No persistent volumes (no databases) | Auto-sleep after inactivity (cold-start latency). Services suspended when credits exhausted until next month reset | No | ✅ 2026-04 | [zeabur.com/pricing](https://zeabur.com/pricing) |
| Stormkit | Self-hosted free tier (1 seat) | Unlimited applications, 15 deploys/mo, self-hosted on your own infra | Cloud version starts at $20/mo (no free cloud tier). Self-hosted only | No | ✅ 2026-04 | [stormkit.io](https://www.stormkit.io/) |

## Notes

- **Railway** offers only a one-time $5 trial credit (30 days), then $1/mo free credit on the Free plan -- not a permanent meaningful free tier. Credit card required.
- **Fly.io** removed its free tier for new users in 2024. Only a 2-hour trial (or 7 days, whichever comes first) remains. Legacy Hobby plan users keep old allowances. Credit card required.
- **Coolify Cloud** has no free tier ($5/mo minimum). The self-hosted open-source version is free but requires your own server.
- **Fleek** (fleek.co) discontinued its IPFS hosting service on January 31, 2026. The current Fleek platform (fleek.xyz) focuses on AI/edge compute and is a different product. Excluded due to hosting discontinuation.
- **Begin.com** (built on Architect/arc.codes) has minimal current presence and no clearly documented free hosting tier as of 2026. Excluded.
- **Cloudflare Pages** stands out with unlimited bandwidth, no credit card, and commercial use allowed on the free plan.
- **Vercel** and **Render** free services spin down or pause with inactivity.
- **Netlify** switched to credit-based pricing in September 2025; the free plan is unchanged but sites are now suspended (not just throttled) when limits are exceeded.
- **Firebase Hosting** transfer limit is documented as 360 MB/day, which totals roughly 10 GB/mo.
- **Zeabur** is a credit-based free tier ($5/mo); actual runtime depends on your resource consumption rate.
- **Stormkit** is only free as a self-hosted solution; you must provide your own server infrastructure.

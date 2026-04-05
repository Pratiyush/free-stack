# Hosting & Deployment

> Free hosting, deployment, and serverless platforms for developers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Vercel | Hobby plan (personal, non-commercial) | 100GB bandwidth/mo, 1M edge requests/mo, 1M function invocations/mo, 1GB blob storage, 100 deploys/day | 4 hrs active CPU/mo, 360 GB-hrs provisioned memory/mo | ✅ 2026-04 | [vercel.com/pricing](https://vercel.com/pricing) |
| Netlify | Free plan | 100GB bandwidth/mo, 300 build minutes/mo, 10GB storage, 125K serverless function invocations/mo, 1M edge function invocations/mo | 100 form submissions/mo, 1 team member | ✅ 2026-04 | [netlify.com/pricing](https://www.netlify.com/pricing/) |
| Cloudflare Pages | Free plan (commercial use allowed) | Unlimited bandwidth, unlimited requests, unlimited sites, 500 builds/mo, 20,000 files per site, 25MB max file size | 100K Workers requests/day (shared with Functions) | ✅ 2026-04 | [cloudflare.com/plans/developer-platform](https://www.cloudflare.com/plans/developer-platform/) |
| GitHub Pages | Free with GitHub Free account | 1GB site size (recommended), 100GB bandwidth/mo (soft limit), 10 builds/hr (soft limit) | Public repos only on free plan, 10-min deploy timeout | ✅ 2026-04 | [github.com/pricing](https://github.com/pricing) |
| Render | Free plan | 750 free instance hours/mo, 100GB bandwidth/mo, 500 build minutes/mo | Services spin down after 15 min idle, ~1 min cold start | ✅ 2026-04 | [render.com/pricing](https://render.com/pricing) |
| Firebase Hosting | Spark plan (free) | 10GB storage, 10GB transfer/mo, global CDN included | Hard cap, no overage billing on Spark | ✅ 2026-04 | [firebase.google.com/pricing](https://firebase.google.com/pricing) |
| Deno Deploy | Free plan (no credit card required) | 1M requests/mo, 100GB egress/mo, 1 GiB KV storage | - | ✅ 2026-04 | [deno.com/deploy/pricing](https://deno.com/deploy/pricing) |
| Surge.sh | Free plan | Unlimited static sites, unlimited custom domains, no bandwidth limit | Static sites only, no SSL on free tier | ✅ 2026-04 | [surge.sh/pricing](https://surge.sh/pricing) |
| Koyeb | Free plan (forever-free) | 1 web service (Frankfurt or Washington DC), 512MB RAM, 0.1 vCPU, 2GB SSD, 100GB outbound bandwidth/mo | Single instance only | ✅ 2026-04 | [koyeb.com/pricing](https://www.koyeb.com/pricing) |

## Notes

- **Railway** and **Fly.io** were evaluated but excluded: Railway offers only a one-time $5 trial credit (not a permanent free tier), and Fly.io removed its free tier for new users in 2024 (only a 2-hour or 7-day trial remains).
- Cloudflare Pages stands out with unlimited bandwidth and no credit card requirement.
- Render and Vercel free services spin down or pause with inactivity.

# Log Management

> Centralized logging, log analysis, and observability with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Grafana Cloud (Loki) | Free forever plan | 50GB logs/mo, 10K metrics series, 50GB traces, 3 users | 14-day log retention on free tier | ✅ 2026-04 | [grafana.com/pricing](https://grafana.com/pricing/) |
| Axiom | Always Free tier (no credit card) | 500GB ingest/mo, 100 GB-hours query compute, 100GB storage | 30-day retention, 1,000 users, 100 datasets, 1,024 fields/dataset | ✅ 2026-04 | [axiom.co/pricing](https://axiom.co/pricing) |
| Better Stack (Logtail) | Free plan | 3GB logs, 10 uptime monitors, 1 status page, 100K exceptions | 3-day log retention; paid starts at $0.10/GB ingested | ✅ 2026-04 | [betterstack.com/pricing](https://betterstack.com/pricing) |
| Sumo Logic | Free forever account | 500MB daily ingest, basic dashboards and search | 7-day data retention, 20 credits/day for logs+metrics+traces | ✅ 2026-04 | [sumologic.com/pricing](https://www.sumologic.com/pricing) |
| Papertrail | Free plan | 50MB/mo log volume | 48-hour searchable retention, 7-day archive; no saved searches on free | ✅ 2026-04 | [papertrail.com/plans](https://www.papertrail.com/plans/) |
| Logflare | Free metered plan | Unlimited sources, email/webhook/Slack/Discord alerts | 5 events/sec avg over 60s, 90-day retention; no SMS alerts on free | ✅ 2026-04 | [logflare.app/pricing](https://logflare.app/pricing) |
| HyperDX | Free tier (no credit card) | 3GB/mo storage, session replay + logs + traces unified | 3-day retention, 1 user; open-source self-host option available | ✅ 2026-04 | [hyperdx.io/pricing](https://www.hyperdx.io/pricing) |
| Datadog | Free tier (infrastructure only) | 5 hosts, 1-day metric retention, basic dashboards | Logs NOT included in free tier (paid add-on at $0.10/GB); free is infra-monitoring only | ✅ 2026-04 | [datadoghq.com/pricing](https://www.datadoghq.com/pricing/) |

## Notes

- **Axiom** stands out with 500GB/mo free ingest -- by far the most generous for log volume.
- **Grafana Cloud** includes Loki (logs), Prometheus (metrics), and Tempo (traces) in one free tier -- best full-stack observability bundle.
- **Datadog** free tier does NOT include log management; logs require a paid plan. Listed for awareness since it is frequently searched.
- **Logflare** is owned by Supabase and integrates natively with Supabase and Cloudflare projects.
- **HyperDX** is also available as a self-hosted open-source project (Apache 2.0) for unlimited usage.

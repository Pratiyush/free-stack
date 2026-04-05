# Analytics & Monitoring

> Free analytics, error tracking, uptime monitoring, and observability services.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Google Analytics 4 | Free (standard plan) | Unlimited pageviews/events, 50 custom dimensions, 50 custom metrics, 30 conversions | Data sampling applied on large queries; 14-month data retention (adjustable) | ✅ 2026-04 | [analytics.google.com](https://analytics.google.com/) |
| PostHog | Free tier (usage-based) | 1M events/mo, 5K session recordings/mo, unlimited team members, 1 project | 1-year data retention on free plan; community support only | ✅ 2026-04 | [posthog.com/pricing](https://posthog.com/pricing) |
| Mixpanel | Free plan | 1M events/mo, 5 saved reports per seat, 10K session replays/mo | No group analytics, no data export, limited cohorts on free tier | ✅ 2026-04 | [mixpanel.com/pricing](https://mixpanel.com/pricing/) |
| Amplitude | Starter plan (free) | 50,000 MTU (monthly tracked users), unlimited events, 10 saved charts | 12-month data retention; basic session replay included | ✅ 2026-04 | [amplitude.com/pricing](https://amplitude.com/pricing) |
| New Relic | Free Forever tier | 100 GB data ingest/mo, 1 full-platform user, unlimited basic users | Access to all 50+ platform capabilities (APM, infra, logs, synthetics); ingestion stops at limit | ✅ 2026-04 | [newrelic.com/pricing](https://newrelic.com/pricing) |
| Grafana Cloud | Free tier | 10K active metrics series, 50 GB logs/mo, 50 GB traces/mo, 3 users | 14-day metric retention; community support only | ✅ 2026-04 | [grafana.com/pricing](https://grafana.com/pricing/) |
| Sentry | Developer plan (free) | 5,000 errors/mo, 10K performance transactions/mo, 50 session replays/mo | 1 user seat, 30-day data retention; ingestion stops when quota exhausted | ✅ 2026-04 | [sentry.io/pricing](https://sentry.io/pricing/) |
| UptimeRobot | Free plan | 50 monitors, 1 status page, 5-minute check intervals | HTTP(S), ping, port, keyword, heartbeat monitors; personal/non-commercial use only | ✅ 2026-04 | [uptimerobot.com/pricing](https://uptimerobot.com/pricing/) |
| BetterStack | Free tier | 10 monitors, 10 heartbeats, 1 status page, 100K exceptions, 5K replays | 3-minute check intervals | ✅ 2026-04 | [betterstack.com/pricing](https://betterstack.com/pricing) |
| Datadog | Free plan | 5 hosts, core infrastructure metrics, 1-day metric retention | Very limited retention; no APM, logs, or advanced monitoring on free tier | ✅ 2026-04 | [datadoghq.com/pricing](https://www.datadoghq.com/pricing/) |

## Notes

- **Google Analytics 4** remains the most widely used free analytics tool, though it comes with data sampling and privacy trade-offs (data shared with Google).
- **PostHog** is notable for being open-source with a generous 1M events/mo free tier and self-hosting option.
- **New Relic** offers the most comprehensive free observability platform (100 GB ingest across all signals), but is limited to 1 full-platform user.
- **Datadog**'s free tier is extremely limited (1-day retention, 5 hosts) and is primarily useful for evaluation rather than production.
- **UptimeRobot** restricts its free plan to personal/non-commercial use as of 2025.

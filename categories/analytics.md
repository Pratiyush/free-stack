# Analytics & Monitoring

> Free analytics, error tracking, uptime monitoring, and observability services.

## Web & Product Analytics

| Service | Free Tier | Limits | Gotchas | Verified | Link |
|---------|-----------|--------|---------|----------|------|
| Google Analytics 4 | Free (standard) | Unlimited events (up to 10M/property/mo recommended), 500 event types, 50 custom dimensions, 50 custom metrics | Default 2-month event-data retention (max 14 months for explorations); aggressive sampling on 500K+ row queries; data shared with Google | 2026-04 | [analytics.google.com](https://analytics.google.com/) |
| PostHog | Free (usage-based) | 1M events/mo, 5K session recordings/mo, unlimited team members, 1 project | 1-year data retention (cold storage after); open-source self-host option (MIT, Docker Compose); community support only | 2026-04 | [posthog.com/pricing](https://posthog.com/pricing) |
| Mixpanel | Free plan | 20M events/mo (new event-based pricing since Feb 2026), unlimited reports, 20K session replays/mo | No group analytics or data export on free tier; limited cohorts; older accounts may still see 1M event cap on legacy MTU pricing | 2026-04 | [mixpanel.com/pricing](https://mixpanel.com/pricing/) |
| Amplitude | Starter (free) | 50K MTU, 10M events/mo, 1K session replays/mo, unlimited feature flags | 1,000 events per MTU cap; 12-month data retention; 10 saved charts; community support only | 2026-04 | [amplitude.com/pricing](https://amplitude.com/pricing) |
| Umami Cloud | Free tier | 100K events/mo, 3 websites | 6-month data retention; open-source self-host option (unlimited events, free); Pro at $20/mo for higher limits | 2026-04 | [umami.is/pricing](https://umami.is/pricing) |
| Plausible | No free cloud tier | Self-hosted community edition is free (open-source, AGPL) | Cloud starts at $9/mo; lightweight, cookie-free, GDPR-compliant by default; no free managed hosting | 2026-04 | [plausible.io](https://plausible.io/) |
| GoatCounter | Free (personal use) | Reasonable personal/non-commercial pageviews, no hard cap | Donation-supported; commercial use from $5/mo; self-host option available (open-source) | 2026-04 | [goatcounter.com](https://www.goatcounter.com/) |
| OpenPanel | Free cloud tier | 10K events/mo on cloud, all features included | Self-host free with unlimited events (open-source); cloud paid starts at $2.50/mo; no limits on users, dashboards, or retention | 2026-04 | [openpanel.dev/pricing](https://openpanel.dev/pricing) |

## Observability & APM

| Service | Free Tier | Limits | Gotchas | Verified | Link |
|---------|-----------|--------|---------|----------|------|
| New Relic | Free Forever | 100 GB data ingest/mo, 1 full-platform user, unlimited basic users | Access to all 50+ capabilities (APM, infra, logs, synthetics); ingestion stops at limit; alerts at 85% usage | 2026-04 | [newrelic.com/pricing](https://newrelic.com/pricing) |
| Grafana Cloud | Free tier | 10K active metrics series, 50 GB logs, 50 GB traces, 3 users | 14-day retention on free tier (paid gets 13 months for metrics); community support only | 2026-04 | [grafana.com/pricing](https://grafana.com/pricing/) |
| Sentry | Developer (free) | 5K errors/mo, 5M spans, 5 GB logs, 50 session replays, 1 GB attachments | 1 user only; 30-day data retention; 1 cron monitor + 1 uptime monitor; 20 metric alerts; ingestion stops at quota | 2026-04 | [sentry.io/pricing](https://sentry.io/pricing/) |
| Datadog | Free plan | 5 hosts, core infrastructure metrics | 1-day metric retention; no APM, logs, or advanced monitoring; Datadog branding; useful for evaluation only | 2026-04 | [datadoghq.com/pricing](https://www.datadoghq.com/pricing/) |
| LaunchDarkly Observability | Developer (free) | 5K session replays + errors/mo, 10M logs + traces/mo | Formerly Highlight.io (acquired Apr 2025); Highlight.io deprecated Feb 2026; open-source self-host still available on GitHub | 2026-04 | [launchdarkly.com](https://launchdarkly.com/docs/home/observability) |

## Uptime & Synthetic Monitoring

| Service | Free Tier | Limits | Gotchas | Verified | Link |
|---------|-----------|--------|---------|----------|------|
| UptimeRobot | Free plan | 50 monitors, 1 status page, 5-min check intervals | HTTP(S), ping, port, keyword, heartbeat monitors; **personal/non-commercial use only** since Nov 2024 | 2026-04 | [uptimerobot.com/pricing](https://uptimerobot.com/pricing/) |
| BetterStack | Free tier | 10 monitors, 10 heartbeats, 1 status page, 100K exceptions, 5K replays | 3-min check intervals; Slack and email alerts included | 2026-04 | [betterstack.com/pricing](https://betterstack.com/pricing) |
| Checkly | Hobby (free) | 10 uptime monitors, 10K API check runs/mo, 1K browser/Playwright runs/mo | Email/Slack/Webhook alerting; Playwright-powered browser checks; no private locations on free tier | 2026-04 | [checklyhq.com/pricing](https://www.checklyhq.com/pricing/) |
| Cronitor | Hacker (free) | 5 monitors (cron jobs, heartbeats, or uptime) | 1-month data retention; email + Slack alerts; paid starts at $20/mo for 20 monitors | 2026-04 | [cronitor.io/pricing](https://cronitor.io/pricing) |

## Notes

- **Mixpanel** switched to event-based pricing in February 2026, boosting its free tier from 1M to 20M events/month for new customers -- the most generous free product analytics tier available.
- **PostHog** remains the strongest open-source all-in-one option (analytics + session replay + feature flags + experiments) with a generous 1M events/mo free cloud tier and a self-hostable MIT-licensed edition.
- **New Relic** offers the most comprehensive free observability platform (100 GB ingest across all signals), but is limited to 1 full-platform user.
- **Highlight.io** was acquired by LaunchDarkly in April 2025. The standalone Highlight.io service was deprecated in February 2026; its observability features now live inside LaunchDarkly's free Developer plan.
- **Plausible** and **Umami** are the top privacy-focused alternatives. Plausible has no free cloud tier but is free to self-host (AGPL). Umami offers a free cloud tier (100K events/mo) plus a free self-host option.
- **UptimeRobot** restricts its free plan to personal/non-commercial use since November 2024. For commercial uptime monitoring, **Checkly** and **BetterStack** are the best free alternatives.
- **Datadog**'s free tier (1-day retention, 5 hosts, no APM/logs) is effectively evaluation-only and not suitable for production use.
- **June.so** appears to be winding down operations and is not recommended for new projects.
- **Google Analytics 4** remains the most widely used free analytics tool but comes with privacy trade-offs, data sampling on large queries, and a default 2-month event-data retention (adjustable to 14 months).

# Developer Tools

> Free development tools, AI code editors, project management, and collaboration.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **GitHub** | Free plan | Unlimited public/private repos, unlimited collaborators, 500 MB Packages storage, 2,000 Actions min/mo (private repos), unlimited Actions (public repos) | 5,000 API requests/hr (authenticated) | 2026-04 | [Pricing](https://github.com/pricing) |
| **GitLab** | Free tier | 5 users (private repos), 10 GiB repo+LFS storage, 400 CI/CD compute min/mo, unlimited public repos | 10 req/sec per user | 2026-04 | [Pricing](https://about.gitlab.com/pricing/) |
| **Bitbucket** | Free plan | Up to 5 users, unlimited public/private repos, 1 GB total workspace storage, 1 GB LFS, 50 build min/mo, 90-day pipeline log retention | API: 1,000 req/hr | 2026-04 | [Pricing](https://www.atlassian.com/software/bitbucket/pricing) |
| **Linear** | Free plan | Unlimited members, 250 active issues, 2 teams, unlimited archived issues, all integrations + API/webhooks, 10 MB file uploads | No published rate limit | 2026-04 | [Pricing](https://linear.app/pricing) |
| **Figma** | Starter plan | 3 Figma files per team project, unlimited drafts, unlimited editors/viewers, 3 pages/file, 30-day version history, no Dev Mode | No published rate limit | 2026-04 | [Pricing](https://www.figma.com/pricing/) |
| **Postman** | Free plan | 1 user only (as of Mar 2026), unlimited collection runs, basic monitoring, core API testing features | 300 Postman API requests/min | 2026-04 | [Pricing](https://www.postman.com/pricing/) |
| **Insomnia** | Free plan (open source, MIT) | Unlimited local collections, unlimited requests, all HTTP/GraphQL/gRPC/WebSocket support, no cloud sync or team collaboration | Local only, no sync | 2026-04 | [Pricing](https://insomnia.rest/pricing) |
| **Cursor** | Hobby plan (free) | 2,000 code completions/mo, 50 slow premium model requests, basic chat, full VS Code-based editor | Completions reset monthly | 2026-04 | [Pricing](https://cursor.com/docs/models-and-pricing) |
| **Windsurf** | Free plan | 25 prompt credits/mo, unlimited Tab completions, access to zero-cost models after credits exhaust | Credits reset monthly | 2026-04 | [Pricing](https://windsurf.com/pricing) |
| **Val Town** | Free plan | 100K val runs/day, serverless TypeScript/JS functions, HTTP endpoints, cron jobs, persistent storage | Runs reset daily | 2026-04 | [Pricing](https://www.val.town/pricing) |
| **Replit** | Starter plan (free) | 0.5 vCPU, 512 MB RAM, 10 GB storage, public projects only, Agent 3 trial (expires), unlimited public apps | Compute caps enforced | 2026-04 | [Pricing](https://replit.com/pricing) |
| **ngrok** | Free plan | 3 concurrent endpoints, 1 dev domain, 20K HTTP requests/mo, 1 GB bandwidth/mo, HTTPS tunnels, no custom domains | Interstitial warning page on free plan | 2026-04 | [Pricing](https://ngrok.com/pricing) |
| **Tailscale** | Personal plan | 3 users, 100 devices, unlimited subnet routers, MagicDNS, HTTPS certs, ACLs, personal/non-commercial use only | No published rate limit | 2026-04 | [Pricing](https://tailscale.com/pricing) |

## Notes

- **Postman** eliminated free team plans in March 2026; free is now single-user only. Collection runs are now unlimited on all plans. Teams of 2+ must pay.
- **Cursor** (new) offers a free Hobby plan with 2,000 completions and 50 slow premium requests per month. Enough for a quick trial but not a full workday of AI-assisted coding.
- **Windsurf** (new) offers 25 free prompt credits/mo with unlimited Tab completions. After credits are exhausted, only zero-cost models remain available (degraded quality). Pricing restructured in early 2026.
- **Val Town** (new) is a serverless TypeScript runtime with 100K free runs/day -- excellent for small APIs, cron jobs, and quick backend scripts without infrastructure.
- **Replit** (new) Starter plan is free but limited: 0.5 vCPU, 512 MB RAM, public-only projects. Agent 3 AI trial expires, pushing toward paid plans. Good for learning and prototyping.
- **GitHub** Actions minutes are unlimited for public repositories; 2,000 min/mo applies only to private repos on free plan. Runner prices dropped up to 39% on Jan 1, 2026.
- **GitLab** 5-user limit applies only to private top-level groups on GitLab.com; self-hosted GitLab CE is fully free and open source.
- **Bitbucket** workspace storage limit enforced at 1 GB since May 2025; snippets removed from free plan; pipeline log retention reduced to 90 days.
- **Linear** free tier caps at 250 active issues with a hard limit -- no grace period or overage. Archived issues do not count.
- **Figma** Starter plan no longer includes FigJam files in the team project count (3 Figma files only). Dev Mode is not available on Starter.
- **Insomnia** is open source (MIT); the free tier has full local functionality but no cloud sync/collaboration. Paid plans ($5-18/mo) add cloud sync and team features.
- **ngrok** free plan now supports 3 concurrent endpoints (up from 1) and 20K HTTP requests/mo. Interstitial warning page remains on free plan.
- **Tailscale** Personal plan is explicitly for non-commercial, personal use only.

---

*Last verified: 2026-04*

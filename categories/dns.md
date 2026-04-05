# DNS & Domains

> Free DNS hosting, domain management, dynamic DNS, and DNS resolvers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Cloudflare DNS** | Free plan | Unlimited zones, 200 DNS records/zone (zones created after Sep 2024; 1,000 for older zones), unlimited DNS queries, proxied traffic + DDoS protection | No query caps; API: 1,200 req/5min | 2026-04 | [Pricing](https://www.cloudflare.com/plans/) |
| **Cloudflare 1.1.1.1 + WARP** | Free (resolver + VPN) | Public DNS resolver (1.1.1.1/1.0.0.1), WARP VPN with no data cap, DNS-over-HTTPS/TLS, malware blocking (1.1.1.2) | No bandwidth cap on free WARP | 2026-04 | [Info](https://1.1.1.1/) |
| **Namecheap FreeDNS** | Free | A/AAAA/CNAME/NS/MX/TXT/SRV records, dynamic DNS, email forwarding, URL forwarding, works with any registrar | No published query limit | 2026-04 | [FreeDNS](https://www.namecheap.com/domains/freedns/) |
| **DuckDNS** | Free | 5 subdomains per account (*.duckdns.org), IPv4+IPv6, HTTPS support, API-based updates, no ads | 5 subdomains max | 2026-04 | [Home](https://www.duckdns.org/) |
| **No-IP** | Free Dynamic DNS | 1 hostname, must confirm every 30 days or hostname is deleted, no TXT records, no 4th-level subdomains | 1 hostname; 30-day renewal | 2026-04 | [Pricing](https://www.noip.com/pricing) |
| **Vercel DNS** | Free (Hobby plan) | Up to 50 custom domains/project, automatic SSL, HTTPS, integrated with Vercel deployments | Included with Hobby plan limits | 2026-04 | [Docs](https://vercel.com/docs/domains) |
| **Netlify DNS** | Free (Starter plan) | Unlimited custom domains, automatic SSL/TLS, HTTPS, integrated with Netlify deploys, ALIAS/ANAME support | Included with Starter plan limits | 2026-04 | [Docs](https://docs.netlify.com/manage/domains/) |
| **Squarespace Domains** | DNS included with domain purchase | Full DNS management, WHOIS privacy free, email forwarding (up to 100 addresses), SSL/TLS, DNSSEC support, no dynamic DNS | No free tier without domain purchase | 2026-04 | [Domains](https://domains.squarespace.com/) |
| **AWS Route 53** | No free tier | $0.50/hosted zone/mo + $0.40/M queries; alias queries to AWS resources are free; zone deleted within 12 hrs not charged | Pay-per-use only | 2026-04 | [Pricing](https://aws.amazon.com/route53/pricing/) |

## Notes

- **Cloudflare DNS** is the strongest free DNS offering -- unlimited queries, DDoS protection, and proxy/CDN included at no cost.
- **AWS Route 53** is listed for reference but has no permanent free tier; it is pay-per-use ($0.50/zone/mo minimum).
- **Squarespace Domains** (formerly Google Domains) includes DNS management free with any domain purchase but does not offer standalone free DNS hosting.
- **Freenom** (.tk/.ml/.ga/.cf/.gq) domains still technically exist but are unreliable -- domains get revoked arbitrarily. Not recommended for any serious use.
- **DuckDNS** is a community-run nonprofit; excellent for homelab and IoT use cases.
- **No-IP** free tier requires manual 30-day hostname confirmation or the hostname is automatically deleted.
- **Vercel DNS** and **Netlify DNS** are best used when already deploying on those platforms; DNS is tightly integrated with their deployment pipelines.

---

*Last verified: 2026-04*

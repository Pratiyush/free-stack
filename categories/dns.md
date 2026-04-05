# DNS & Domains

> Free DNS hosting, domain management, dynamic DNS, and DNS resolvers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| **Cloudflare DNS** | Free plan | Unlimited zones, 200 DNS records/zone (zones created after Sep 2024; 1,000 for older zones), unlimited DNS queries, proxied traffic + DDoS protection | No query caps; API: 1,200 req/5min | 2026-04 | [Pricing](https://www.cloudflare.com/plans/) |
| **Cloudflare 1.1.1.1 + WARP** | Free (resolver + VPN) | Public DNS resolver (1.1.1.1/1.0.0.1), WARP VPN with no data cap, DNS-over-HTTPS/TLS, malware blocking (1.1.1.2) | No bandwidth cap on free WARP | 2026-04 | [Info](https://1.1.1.1/) |
| **NextDNS** | Free plan | 300K queries/mo, unlimited devices, unlimited configurations, all features (ad blocking, tracker blocking, parental controls); reverts to plain resolver (no filtering/logging) after limit | Email alerts at 250K and 300K; Pro $1.99/mo for unlimited | 2026-04 | [Pricing](https://nextdns.io/pricing) |
| **DNS4EU** | Free public resolver | EU-funded GDPR-compliant recursive DNS; 5 resolver variants (default, child protection, ad blocking, etc.); DNSSEC, DoH, DoT; nodes in 14+ EU member states; MISP threat intelligence | No usage caps for individuals | 2026-04 | [Public](https://www.joindns4.eu/for-public) |
| **Namecheap FreeDNS** | Free | A/AAAA/CNAME/NS/MX/TXT/SRV records, dynamic DNS, email forwarding, URL forwarding, works with any registrar | No published query limit | 2026-04 | [FreeDNS](https://www.namecheap.com/domains/freedns/) |
| **DuckDNS** | Free | 5 subdomains per account (*.duckdns.org), IPv4+IPv6, HTTPS support, API-based updates, no ads | 5 subdomains max | 2026-04 | [Home](https://www.duckdns.org/) |
| **No-IP** | Free Dynamic DNS | 1 hostname, must confirm every 30 days or hostname is deleted, no TXT records, no 4th-level subdomains | 1 hostname; 30-day renewal | 2026-04 | [Pricing](https://www.noip.com/pricing) |
| **Vercel DNS** | Free (Hobby plan) | Up to 50 custom domains/project, automatic SSL, HTTPS, integrated with Vercel deployments; non-commercial use only | Included with Hobby plan limits | 2026-04 | [Docs](https://vercel.com/docs/domains) |
| **Netlify DNS** | Free plan | Custom domains with SSL, HTTPS, global CDN, ALIAS/ANAME support, branch deploys, standalone subdomain delegation | 100 GB bandwidth/mo included | 2026-04 | [Docs](https://docs.netlify.com/manage/domains/) |
| **Bunny DNS** | Pay-per-use (has free allowance) | First 20M standard queries/mo free; scriptable DNS records, built-in monitoring, all advanced features included | Overages: $0.10/M standard, $0.30/M smart queries; **$1/mo minimum across all Bunny services** | 2026-04 | [Pricing](https://bunny.net/pricing/dns/) |
| **Squarespace Domains** | DNS included with domain purchase | Full DNS management, WHOIS privacy free, email forwarding (up to 100 addresses), SSL/TLS, DNSSEC support | No free tier without domain purchase | 2026-04 | [Domains](https://domains.squarespace.com/) |
| **AWS Route 53** | No free tier | $0.50/hosted zone/mo + $0.40/M queries; alias queries to AWS resources are free; zone deleted within 12 hrs not charged | Pay-per-use only | 2026-04 | [Pricing](https://aws.amazon.com/route53/pricing/) |

## Notes

- **Cloudflare DNS** is the strongest free DNS offering -- unlimited queries, DDoS protection, and proxy/CDN included at no cost.
- **NextDNS** is the best free DNS filtering/privacy resolver -- 300K queries/mo with ad blocking, tracker blocking, and analytics. After the limit, it continues resolving but without filtering.
- **DNS4EU** is the EU's official public resolver (launched June 2025), privacy-focused with GDPR compliance, DNSSEC, and threat intelligence. Replaces the now-defunct **dns0.eu** (shut down due to sustainability issues).
- **Bunny DNS** has a generous 20M free queries/mo allowance but requires a $1/mo minimum spend across all Bunny services, so it is not truly free unless you use other Bunny products.
- **DuckDNS** is community-run and nonprofit; excellent for homelab and IoT. It experienced downtime in mid-2025 but appears operational again as of early 2026.
- **No-IP** free tier requires manual 30-day hostname confirmation or the hostname is automatically deleted.
- **Vercel DNS** and **Netlify DNS** are best used when already deploying on those platforms; DNS is tightly integrated with their deployment pipelines.
- **AWS Route 53** is listed for reference but has no permanent free tier; it is pay-per-use ($0.50/zone/mo minimum).
- **Squarespace Domains** (formerly Google Domains) includes DNS management free with any domain purchase but does not offer standalone free DNS hosting.
- **Freenom** (.tk/.ml/.ga/.cf/.gq) domains are unreliable -- domains get revoked arbitrarily. Not recommended.

---

*Last verified: 2026-04*

# Infrastructure as a Service (IaaS)

> Cloud infrastructure free tiers from major providers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Oracle Cloud Always Free | Permanent free tier (most generous) | 4 ARM Ampere A1 cores, 24 GB RAM (split across up to 4 VMs), 2 AMD VMs (1/8 OCPU + 1 GB each), 200 GB block storage, 10 TB/month outbound, 2 autonomous databases | ARM instances may face capacity constraints in popular regions due to high demand | ✅ 2026-04 | [oracle.com/cloud/free](https://www.oracle.com/cloud/free/) |
| GCP Always Free | Permanent free tier | 1 e2-micro VM (2 vCPU shared, 1 GB RAM) in us-west1/central1/east1 only, 30GB standard persistent disk, 1GB outbound, 5 GB Cloud Storage, 1 TB BigQuery queries/month, 2M Cloud Functions invocations, 180K vCPU-seconds Cloud Run, 120 build-min/day | Billing account required but no charges within limits; limits shared across all projects per billing account | ✅ 2026-04 | [cloud.google.com/free](https://cloud.google.com/free) |
| AWS Always Free | Permanent free tier (30+ services) | Lambda: 1M invocations + 400K GB-sec/month, DynamoDB: 25 GB, S3: 5 GB, CloudFront: 1 TB + 10M requests, SNS: 1M publishes | No free compute (EC2) on always-free tier; EC2 t2.micro is 12-month trial only | ✅ 2026-04 | [aws.amazon.com/free](https://aws.amazon.com/free/) |
| AWS Free Plan (new accounts, post-July 2025) | Credit-based free plan (6 months) | $100 credits at sign-up + up to $100 more for exploring services. Aurora PostgreSQL now included | Replaces 12-month trial for new accounts created after July 15, 2025. 6-month plan; converts to paid after | ✅ 2026-04 | [aws.amazon.com/free](https://aws.amazon.com/free/) |
| Azure Always Free | Permanent free tier (55+ services) | Functions: 1M executions/month, Blob Storage: 5 GB LRS, Cosmos DB: 1,000 RU/s + 25 GB, App Service: 10 web/mobile/API apps | No always-free VM; B1S VM is 12-month trial only. $200 credit for first 30 days on new accounts | ✅ 2026-04 | [azure.microsoft.com/pricing/free-services](https://azure.microsoft.com/en-us/pricing/free-services) |
| Azure 12-Month Free | 12-month trial (new accounts) | B1S Linux VM 750 hrs/month, SQL Database, Blob Storage 5 GB, Bandwidth 15 GB | **Expires after 12 months** -- auto-converts to pay-as-you-go unless deprovisioned | ✅ 2026-04 | [azure.microsoft.com/pricing/free-services](https://azure.microsoft.com/en-us/pricing/free-services) |
| IBM Cloud | Lite plan (permanent, 40+ services) | Watson APIs free tier, Cloud Functions, Cloudant (lite), Db2 (lite), Object Storage (25 GB) | Quota resets monthly; hitting quota suspends service for remainder of month. $200 credit for 30 days on new Pay-as-you-go accounts | ✅ 2026-04 | [ibm.com/cloud/free](https://www.ibm.com/products/cloud/free) |
| Vultr | Trial credits only (not permanent) | $250-$300 free credits for new accounts (30 days). Full platform access: VPS, bare metal, K8s, 32 global DCs | **Trial only** -- credit card required, credits expire after 12 months. Cheapest plan: $2.50/mo (1 vCPU, 512MB) | ✅ 2026-04 | [vultr.com](https://www.vultr.com/) |
| Linode (Akamai) | Trial credits only (not permanent) | $100 free credits for 60 days. Access to Compute, Object Storage, Block Storage, NodeBalancers | **Trial only** -- credit card required, unused credits expire. GPU plans excluded from trial | ✅ 2026-04 | [linode.com/pricing](https://www.linode.com/pricing/) |
| Hetzner | No free tier | **No permanent free tier.** Referral programs may offer EUR 20 credit. Cheapest plan: EUR 3.49/month (CX23: 2 vCPU, 4 GB RAM) | Not applicable -- included for completeness as frequently asked about | ✅ 2026-04 | [hetzner.com/cloud](https://www.hetzner.com/cloud/) |

## Notes

- **Oracle Cloud Always Free** is the clear winner for free compute: 4 ARM cores + 24 GB RAM permanently is unmatched by any other provider. Availability issues ("Out of Host Capacity") persist in popular regions -- try less popular regions or use retry scripts.
- **GCP** is the only major provider offering a permanent free VM (e2-micro), though it is very small (1 GB RAM, shared CPU, US regions only).
- **AWS** post-July 2025: new accounts get a credit-based Free Plan ($100 at sign-up + $100 earnable) for 6 months instead of the legacy 12-month trial. Accounts created before July 15, 2025 remain on the legacy program. Aurora PostgreSQL was added to the free tier in March 2026.
- **Azure** similarly has no always-free VM; B1S is 12-month trial. Charges apply immediately when quotas are exceeded -- set billing alerts.
- **IBM Cloud** Lite plan is permanent but limited; Watson AI APIs are the main draw.
- **Vultr** and **Linode (Akamai)** are trial-credit-only providers with no permanent free tier. Vultr offers up to $300 in credits (30 days); Linode offers $100 (60 days). Both require credit cards and are listed for completeness.
- **Hetzner** has no free tier but is included because it is frequently asked about. At EUR 3.49/month, it is the cheapest paid option for real compute.
- For always-free production workloads, combine **Oracle Cloud** (compute + storage) with **AWS/GCP** (serverless functions + CDN).

# 💳 Payments & Billing

> Free tiers for payment processing, subscriptions, billing infrastructure, and merchant-of-record services.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Stripe | No monthly fee, pay-per-transaction | 2.9% + 30c per card transaction (US), 1.5% + 25c (EEA), 1.5% + 20p (UK), no setup fee, no monthly fee | +1.5% for international cards, +1% for currency conversion, ACH debit 0.8% capped at $5, Radar fraud protection included | ✅ 2026-04 | [stripe.com/pricing](https://stripe.com/pricing) |
| LemonSqueezy | No monthly fee, Merchant of Record | 5% + 50c per transaction, handles global tax/VAT compliance, no setup fee | +1.5% for international (non-US) transactions, MoR model means LemonSqueezy handles all tax filing, 2026: integrating Stripe Managed Payments for improved infrastructure | ✅ 2026-04 | [lemonsqueezy.com/pricing](https://www.lemonsqueezy.com/pricing) |
| Paddle | No monthly fee, Merchant of Record | 5% + 50c per transaction, handles global tax compliance, invoicing, and chargebacks | MoR model (Paddle is seller of record), handles all tax remittance, effective rate can be higher with 2-3% currency conversion margin on cross-currency payouts | ✅ 2026-04 | [paddle.com/pricing](https://www.paddle.com/pricing) |
| Polar | No monthly fee, Merchant of Record | 4% + 40c per transaction, handles global tax/VAT/GST compliance, supports subscriptions/one-time/usage-based/free products | Stripe's 2.9%+30c included in the 4% rate, +1.5% international card fee passed through at cost, +0.5% for subscription payments | ✅ 2026-04 | [polar.sh/resources/pricing](https://polar.sh/resources/pricing) |
| Creem | No monthly fee, Merchant of Record | 3.9% + 40c per transaction, 0% on first 1,000 EUR revenue, handles global tax compliance | Lower rate than Paddle/LemonSqueezy, designed for indie hackers and SaaS | ✅ 2026-04 | [creem.io/pricing](https://www.creem.io/pricing) |
| RevenueCat | Free up to $2,500 MTR | All features included free under $2,500/mo tracked revenue (gross, before App Store/Google Play commission), then 1% of MTR | No charges in months under threshold, no subscriber count limits, no implementation fees | ✅ 2026-04 | [revenuecat.com/pricing](https://www.revenuecat.com/pricing/) |
| Hyperswitch | Free (open-source, self-hosted) | Open-source payment orchestrator written in Rust, single API to connect multiple payment processors, smart routing & retry logic, visual workflow builder | Self-hosted: free with no transaction fees, fully managed cloud available from Juspay with enterprise SLAs, supports cards/wallets/BNPL/UPI/Pay-by-Bank globally | ✅ 2026-04 | [hyperswitch.io](https://hyperswitch.io/) |
| Lago | Free (open-source, self-hosted) / Cloud Starter $0/mo | Self-hosted: fully free (AGPLv3), no per-transaction fees. Cloud Starter: first $250K cumulative invoiced revenue free, then 0.75% of revenue processed | Event-driven metering up to 15K events/sec, supports flat-rate + usage-based + tiered + volume + package pricing models, no revenue share on self-hosted | ✅ 2026-04 | [getlago.com/pricing](https://getlago.com/pricing) |
| Gumroad | No monthly fee | 10% flat fee per transaction (includes payment processing), handles payouts and tax collection | Higher rate but simplest setup, no code required, instant storefront | ✅ 2026-04 | [gumroad.com/pricing](https://gumroad.com/pricing) |
| PayPal | No monthly fee (standard) | 2.99% + 49c per transaction (US), no setup fee | +1.5% for international transactions, dispute fees apply, widely recognized checkout | ✅ 2026-04 | [paypal.com/us/business/pricing](https://www.paypal.com/us/business/pricing) |

## Notes

- None of these services charge monthly fees -- all are pay-per-transaction or revenue-based.
- **Merchant of Record (MoR)** services (LemonSqueezy, Paddle, Polar, Creem) handle global tax compliance, which is invaluable for indie developers selling internationally.
- **Creem** has the lowest MoR rate (3.9% + 40c) plus a 0% introductory period on the first 1,000 EUR. **Polar** (4% + 40c) is next, 20% cheaper than Paddle/LemonSqueezy.
- **Hyperswitch** is a game-changer for teams that want full control: self-host an open-source payment orchestrator (Rust, high performance) that routes across Stripe, Adyen, Braintree, etc. with zero transaction fees on the self-hosted version.
- **Lago** fills the billing/metering gap: open-source alternative to Stripe Billing for usage-based pricing, with a generous cloud free tier ($250K cumulative revenue). Used by Mistral.ai, PayPal, Synthesia.
- **RevenueCat** is specifically for mobile in-app subscriptions (iOS/Android) and is genuinely free under $2,500/mo revenue.
- **Stripe** has the lowest per-transaction rate but leaves tax compliance to you. High-volume merchants can negotiate rates down to 1.5-2.5%.

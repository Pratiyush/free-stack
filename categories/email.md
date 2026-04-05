# Email & Messaging

> Free email APIs, transactional email, marketing email, and SMS platforms.

## Transactional Email

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Resend | Free forever | 3,000 emails/month (100/day); 1 domain; 1-day log retention | 2-5 req/sec (varies by account) | 2026-04 | [Pricing](https://resend.com/pricing) |
| Brevo (Sendinblue) | Free forever | 300 emails/day (~9,000/month); 100,000 contacts; Brevo branding | Not published | 2026-04 | [Pricing](https://www.brevo.com/pricing/) |
| Mailtrap | Free forever | 4,000 emails/month; 150/day; 1 domain; 1 user; 3-day log retention | Per-plan limits | 2026-04 | [Pricing](https://mailtrap.io/pricing/) |
| Mailgun | Free forever (no CC) | 100 emails/day (~3,000/month); 1 domain; 1-day log retention | Standard API limits | 2026-04 | [Pricing](https://www.mailgun.com/pricing/) |
| Postmark | Free forever (Developer) | 100 emails/month; no inbound processing; no overage (stops at limit) | Standard API limits | 2026-04 | [Pricing](https://postmarkapp.com/pricing) |
| Plunk | Free forever (open source) | 3,000 emails/month; unlimited contacts; self-host = free (pay SES costs) | Not published | 2026-04 | [Pricing](https://www.useplunk.com/pricing) |
| MailerSend | Free forever | 500 emails/month; 100/day; 1 domain; 1 template; 1 API token | Not published | 2026-04 | [Pricing](https://www.mailersend.com/pricing) |
| Amazon SES | Free for 12 months (pre-Jul 2025 accounts: 3,000/month); new accounts get $200 AWS credits | Then $0.10/1,000 emails | Standard AWS limits | 2026-04 | [Pricing](https://aws.amazon.com/ses/pricing/) |
| SMTP2GO | Free forever | 1,000 emails/month; 200/day (25/hr until domain verified); 5-day log retention | Hourly limit removed after domain verification | 2026-04 | [Pricing](https://www.smtp2go.com/pricing/) |

## Marketing Email

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Brevo (Sendinblue) | Free forever | 300 emails/day; 100,000 contacts; automation capped at 2,000 contacts; Brevo branding | Not published | 2026-04 | [Pricing](https://www.brevo.com/pricing/) |
| Loops | Free forever | 4,000 emails/30 days; 1,000 contacts; unlimited automations; light branding | Not published | 2026-04 | [Pricing](https://loops.so/pricing) |
| Mailchimp | Free forever (heavily restricted) | 500 emails/month (250/day); 250 contacts; no automations; Mailchimp branding; 30-day support only | Not published | 2026-04 | [Pricing](https://mailchimp.com/pricing/marketing/) |

## Client-Side / No Backend

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| EmailJS | Free forever | 200 emails/month; 2 templates; 50KB attachment max | Not published | 2026-04 | [Pricing](https://www.emailjs.com/pricing/) |

## SMS

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Twilio | $15 trial credit (one-time) | Trial prefix on messages; verified numbers only | 1 msg/sec (trial) | 2026-04 | [Pricing](https://www.twilio.com/en-us/pricing) |

## Excluded Services

- **SendGrid**: Free tier permanently removed May 27, 2025. Now offers only a 60-day trial (100 emails/day), then paid plans from $19.95/month. ([Source](https://sendgrid.com/en-us/pricing))
- **Bird (SparkPost/MessageBird)**: No clear free tier published. Paid plans start at ~$20/month. Rocky post-acquisition experience reported by customers. Excluded due to unclear free offering. ([Source](https://bird.com/en/pricing/email))
- **React Email**: A template library (open source), not a sending service. Use it with Resend, Postmark, SES, etc. No pricing -- it is free MIT-licensed code. ([Source](https://react.email))

## Notes

- **Best for transactional email**: Resend (3,000/month, modern DX, React Email integration) or Mailtrap (4,000/month, built for testing + production).
- **Best for marketing**: Brevo is the strongest option with 100K contacts on free tier, though automation is capped at 2,000 contacts. Loops is excellent for SaaS (1,000 contacts, full automation).
- **Best for testing/dev**: Mailtrap (sandbox + sending), Postmark (reliable delivery, tiny volume), or Mailgun (100/day, no CC).
- **Cheapest at scale**: Amazon SES ($0.10/1,000 emails) or Plunk self-hosted (same SES pricing, open-source UI).
- **EmailJS**: Unique -- sends email from client-side JS without a backend. Good for contact forms on static sites.
- **Twilio SMS**: Trial credit only, not a permanent free tier. Included for reference. US outbound: $0.0079/segment + carrier surcharges.
- **Mailchimp**: Free tier was cut again in Jan 2026 (from 500 to 250 contacts, automations removed entirely). Barely usable for anything beyond a tiny newsletter.
- **Amazon SES free tier changed**: Accounts created after July 15, 2025 get $200 AWS credits (shared across all services) instead of the dedicated 3,000 emails/month for 12 months.
- **Plunk**: Open-source (AGPL-3.0), self-hostable. Cloud version offers 3,000 emails/month free. Built on AWS SES. Good alternative to Resend for those who want to own their infrastructure.
- **Mailtrap upgrade**: Free tier increased to 4,000 emails/month (up from 1,000 previously). Strong pick for transactional email.

> Last verified: 2026-04-05

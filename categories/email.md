# Email & Messaging

> Free email APIs, transactional email, marketing email, and SMS platforms.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Brevo (Sendinblue) | Free forever | 300 emails/day (~9,000/month); 100,000 contacts | Not published | 2026-04 | [Pricing](https://www.brevo.com/pricing/) |
| Resend | Free forever | 3,000 emails/month (100/day); 1 domain | 5 req/sec | 2026-04 | [Pricing](https://resend.com/pricing) |
| Mailtrap | Free forever | 1,000 emails/month; 500/day; 1 domain | Per-plan limits | 2026-04 | [Pricing](https://mailtrap.io/pricing/) |
| Mailgun | Free forever (with CC for full access) | 100 emails/day; 1 domain; 1-day log retention | Standard API limits | 2026-04 | [Pricing](https://www.mailgun.com/pricing/) |
| Amazon SES | Free for 12 months (new accounts) | 3,000 emails/month free; then $0.10/1,000 emails | Standard AWS limits | 2026-04 | [Pricing](https://aws.amazon.com/ses/pricing/) |
| Postmark | Free forever (Developer tier) | 100 emails/month; no inbound processing | Standard API limits | 2026-04 | [Pricing](https://postmarkapp.com/pricing) |
| EmailJS | Free forever | 200 emails/month; 2 templates; 50KB max size | Not published | 2026-04 | [Pricing](https://www.emailjs.com/pricing/) |
| Mailchimp | Free forever (heavily restricted) | 500 emails/month (250/day); 250 contacts; Mailchimp branding | Not published | 2026-04 | [Pricing](https://mailchimp.com/pricing/marketing/) |
| Twilio (SMS) | $15 trial credit (one-time) | Trial prefix on messages; verified numbers only; 50 SMS/day | 1 msg/sec (trial) | 2026-04 | [Pricing](https://www.twilio.com/en-us/pricing) |

## Notes

- **SendGrid**: No longer has a permanent free tier as of May 2025. Only a 60-day trial (100 emails/day). Excluded per rules.
- **Best for transactional email**: Resend (3,000/month, modern DX) or Brevo (300/day with contacts).
- **Best for testing**: Mailtrap (built for email testing with sandbox) or Postmark (reliable delivery, tiny volume).
- **Best for marketing**: Brevo is the only real option with 100K contacts on free tier, though automation is capped at 2,000 contacts.
- **Cheapest at scale**: Amazon SES ($0.10/1,000 emails) after the 12-month free tier ends.
- **EmailJS**: Unique -- sends email from client-side JS without a backend. Good for contact forms.
- **Twilio SMS**: Trial credit only, not a permanent free tier. Included for reference.
- **Mailchimp**: Free tier was drastically cut in Jan 2026 (from 500 to 250 contacts). Barely usable.

> Last verified: 2026-04

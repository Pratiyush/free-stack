# Communication APIs

> Messaging, video, voice, and real-time communication APIs with free tiers.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Agora | 10,000 free minutes/month | Audio and video calling; HD video at $3.99/1K min after free tier | Free minutes apply per account; does NOT apply to CDN live streaming or Signaling SDK | ✅ 2026-04 | [agora.io/pricing](https://www.agora.io/en/pricing/) |
| Ably | Free plan (permanent) | 6M messages/month, 200 peak connections, no credit card required | No time limit on free tier; messages counted by publish + delivery | ✅ 2026-04 | [ably.com/pricing](https://ably.com/pricing) |
| Daily.co | Free plan (permanent) | 10,000 participant-minutes/month, no credit card required | 1-day log retention on free tier (3 days with card on file); HD video included | ✅ 2026-04 | [daily.co/pricing](https://www.daily.co/pricing/video-sdk/) |
| Pusher Channels | Sandbox plan (permanent) | 100 concurrent connections, 200,000 messages/day | Daily message cap resets at midnight UTC; not suited for production workloads | ✅ 2026-04 | [pusher.com/channels/pricing](https://pusher.com/channels/pricing/) |
| Stream | Free for teams <5 members & <$10K revenue | Maker plan: $100/month free credit; Build plan: 100 MAU for dev/prototype only | Media transfer billed separately (~$0.12/GB); not intended for production on free tier | ✅ 2026-04 | [getstream.io/chat/pricing](https://getstream.io/chat/pricing/) |
| Sendbird | Developer plan (permanent) | 100 MAU, 10 peak concurrent connections, unlimited messages, all Pro features | No credit card required; 30-day trial available for 1,000 MAU with Pro features | ✅ 2026-04 | [sendbird.com/pricing/chat](https://sendbird.com/pricing/chat) |
| LiveKit | Build plan (free) | 5,000 WebRTC minutes/mo, 1,000 agent session minutes/mo, 50GB data transfer/mo | No credit card required; open-source server can be self-hosted for unlimited free usage | ✅ 2026-04 | [livekit.com/pricing](https://livekit.com/pricing) |
| Liveblocks | Starter plan (free) | 500 monthly active rooms, 8GB storage, real-time collaboration + presence + comments | Plans paused when free limits exceeded; first-day sessions don't count toward MAU billing | ✅ 2026-04 | [liveblocks.io/pricing](https://liveblocks.io/pricing) |
| PartyKit (Cloudflare) | Free tier (included with Cloudflare Workers free) | Runs on Cloudflare Durable Objects; each room is an edge-deployed DO with 128MB memory limit | Acquired by Cloudflare (2024); uses Workers free tier (100K requests/day). Hibernation API reduces memory usage | ✅ 2026-04 | [partykit.io](https://www.partykit.io/) |
| Twilio | Trial credit only (not permanent) | $15 one-time trial credit; SMS prefixed with trial notice, calls to verified numbers only | **Trial only** -- no permanent free tier; pay-as-you-go after credit consumed | ✅ 2026-04 | [twilio.com/pricing](https://www.twilio.com/en-us/pricing) |
| Vonage | Trial credit only (not permanent) | $10 free credit for Video API; free credits for other APIs (amounts vary) | **Trial only** -- no permanent free tier; usage-based pricing after credit consumed | ✅ 2026-04 | [vonage.com/communications-apis/pricing](https://www.vonage.com/communications-apis/pricing/) |

## Notes

- **Agora** and **Daily.co** are the most generous for video/voice with 10K free minutes/month each, permanently.
- **Ably** offers the best permanent free tier for real-time pub/sub messaging (6M messages/month).
- **Pusher** free tier is capped daily (200K messages/day) rather than monthly, which is unusual -- plan around daily spikes.
- **LiveKit** is open-source (Apache 2.0) and can be self-hosted for zero cost. The managed cloud free tier (Build plan) includes 5K WebRTC minutes and 1K agent session minutes. HIPAA compliance requires Scale plan ($500/mo).
- **Liveblocks** provides collaborative features (presence, cursors, comments, notifications) rather than audio/video. Best for multiplayer document editing (like Figma/Notion-style collaboration).
- **PartyKit** was acquired by Cloudflare in 2024 and now runs on Cloudflare Workers/Durable Objects infrastructure. Best for custom real-time multiplayer logic at the edge. Hibernation API allows scaling to thousands of concurrent connections per room.
- **Twilio** and **Vonage** are listed for completeness but only offer one-time trial credits, not permanent free tiers.
- **Stream** free tier is restricted to small teams (<5 people, <$10K revenue) -- verify eligibility before relying on it.
- **Sendbird** Developer plan is permanent but limited to 100 MAU, making it dev/prototype only.

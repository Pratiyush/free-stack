# AI & Machine Learning

> Free AI APIs, LLM access, and ML platforms.

| Service | Free Tier | Limits | Rate Limits | Verified | Link |
|---------|-----------|--------|-------------|----------|------|
| Google Gemini API | Free tier (no CC required) | Gemini 2.5 Flash: 250 req/day, 250K TPM; Flash-Lite: 1,000 req/day | 10-15 RPM depending on model | 2026-04 | [Pricing](https://ai.google.dev/gemini-api/docs/rate-limits) |
| Groq | Free forever (no CC required) | Access to Llama, Mixtral, Gemma models; 14,400 req/day | 30 RPM per model | 2026-04 | [Pricing](https://console.groq.com/docs/rate-limits) |
| Mistral AI | Free Experiment tier (no CC required) | All models incl. Mistral Large; ~1B tokens/month | ~1 RPS, 500K TPM | 2026-04 | [Pricing](https://mistral.ai/pricing) |
| Cloudflare Workers AI | 10,000 Neurons/day free | 10,000 Neurons/day across all models; resets at 00:00 UTC | Per-model limits apply | 2026-04 | [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) |
| Together AI | $25 free credits + 71 free models | 200+ open-source models; free models include Llama, DeepSeek V3, Qwen | 6,000 RPM, 2M TPM | 2026-04 | [Pricing](https://www.together.ai/pricing) |
| Hugging Face Inference | Free monthly credits | ~100K characters/month; 1,000s of models (text, image, audio) | 60 RPM | 2026-04 | [Pricing](https://huggingface.co/pricing) |
| Cohere | Trial key (free forever) | 1,000 API calls/month; all models (Command R+, Embed, Rerank) | 20 RPM (Chat), 5 RPM (Embed) | 2026-04 | [Pricing](https://cohere.com/pricing) |
| OpenAI | Extremely limited free tier | GPT-3.5 Turbo only; 200 req/day | 3 RPM | 2026-04 | [Pricing](https://openai.com/api/pricing/) |
| Anthropic (Claude) | ~$5 starter credits (one-time) | Credits for new accounts only; expires; not a permanent free tier | Standard rate limits | 2026-04 | [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Replicate | Limited free runs (select models) | "Try for Free" collection; limited runs then billing required | Varies by model | 2026-04 | [Pricing](https://replicate.com/pricing) |

## Notes

- **Best permanent free tiers**: Google Gemini, Groq, Mistral, and Cloudflare Workers AI offer genuine always-free access with no credit card required.
- **Credit-based trials**: Together AI ($25), Anthropic (~$5), and Replicate offer one-time credits that expire -- not permanent free tiers.
- **OpenAI**: The free tier is severely limited (3 RPM, GPT-3.5 only). Not practical for real apps.
- **Cohere**: Free trial key is ongoing but restricted to non-production use.
- **Together AI**: 71 models are completely free (no credits consumed), making it one of the most generous options for open-source model access.

> Last verified: 2026-04

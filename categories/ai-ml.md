# AI & Machine Learning

> Free AI APIs, LLM access, and ML platforms -- verified April 2026.

## Permanent Free Tiers (No Credit Card Required)

| Service | Free Tier | Key Limits | Rate Limits | Credit Card | Verified | Link |
|---------|-----------|------------|-------------|-------------|----------|------|
| Google Gemini API | Free tier, multiple models | 2.5 Pro: 100 RPD; Flash: 250 RPD; Flash-Lite: 1,000 RPD; all share 250K TPM, 1M context | Pro 5 RPM, Flash 10 RPM, Flash-Lite 15 RPM | No | 2026-04 | [Pricing](https://ai.google.dev/gemini-api/docs/rate-limits) |
| Groq | Free forever | Llama, Gemma, Whisper models; 14,400 RPD (varies by model), 500K TPD for some models | 30 RPM per model (varies) | No | 2026-04 | [Pricing](https://console.groq.com/docs/rate-limits) |
| Mistral AI | Free Experiment tier | All models incl. Mistral Large & Codestral; ~1B tokens/month | ~1 RPS, 500K TPM | No (phone verification) | 2026-04 | [Pricing](https://mistral.ai/pricing) |
| Cerebras | Free tier, 1M tokens/day | Llama 3.1 8B, Qwen 3 32B/235B, and more; ultra-fast inference (~2,600 tok/sec) | Rate-limited (free tier); 10x higher on Developer tier | No | 2026-04 | [Pricing](https://www.cerebras.ai/pricing) |
| Cloudflare Workers AI | 10,000 Neurons/day | 10,000 Neurons/day across all models; resets 00:00 UTC; many open-source models | Per-model limits apply | No | 2026-04 | [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) |
| OpenRouter | 29+ free models | DeepSeek V3/R1, Llama, Qwen3 Coder 480B, and more; 50 RPD free | 20 RPM | No | 2026-04 | [Free Models](https://openrouter.ai/collections/free-models) |
| Cohere | Trial key (free forever) | 1,000 API calls/month; Command R+, R7B, Embed 4, Rerank 3.5 | Chat 20 RPM, Embed 5 RPM | No | 2026-04 | [Pricing](https://cohere.com/pricing) |
| Hugging Face Inference | Free monthly credits | ~100K characters/month; 1,000s of models (text, image, audio) | 60 RPM | No | 2026-04 | [Pricing](https://huggingface.co/pricing) |

## Free Credits (One-Time or Trial -- Expire)

| Service | Free Offer | Key Limits | Rate Limits | Credit Card | Verified | Link |
|---------|------------|------------|-------------|-------------|----------|------|
| Together AI | $25 free credits + 71 permanently free models | 200+ models; free models include Llama 3.1 405B, DeepSeek V3, Qwen | 6,000 RPM, 2M TPM | No | 2026-04 | [Pricing](https://www.together.ai/pricing) |
| DeepSeek | 5M free tokens (30-day expiry) | DeepSeek V3/V4, R1; no rate limits on API; chat is free unlimited | No hard rate limits | No | 2026-04 | [Pricing](https://api-docs.deepseek.com/quick_start/pricing) |
| xAI (Grok) | $25 free credits + up to $150/mo via data sharing | Grok 4, 4.1 Fast; 2M context window | Standard rate limits | Yes (for API) | 2026-04 | [Pricing](https://docs.x.ai/developers/models) |
| SambaNova | $5 free credits (30-day expiry) + rate-limited free tier after | Llama models (8B, 70B, 405B); free tier continues with low rate limits | Free: ~30 RPM (small models), ~1 RPM (large) | No | 2026-04 | [Pricing](https://cloud.sambanova.ai/plans/pricing) |
| Anthropic (Claude) | ~$5 starter credits (one-time) | New accounts only; credits expire; no permanent free tier | Standard rate limits | Yes | 2026-04 | [Pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| Fireworks AI | $1 free starter credits | 50+ models, fast inference | High rate limits | Yes (after credits) | 2026-04 | [Pricing](https://fireworks.ai/pricing) |
| Replicate | Limited free runs (select models) | "Try for Free" collection; limited runs then billing required | Varies by model | Yes (after trial) | 2026-04 | [Pricing](https://replicate.com/pricing) |

## Severely Limited / Not Recommended for Free Use

| Service | Free Offer | Why Limited | Credit Card | Link |
|---------|------------|-------------|-------------|------|
| OpenAI | GPT-3.5 Turbo only, 3 RPM | Free trial credits discontinued mid-2025; only GPT-3.5 at 3 RPM; payment method likely required | Conflicting reports (likely yes) | [Pricing](https://openai.com/api/pricing/) |
| Perplexity API | No free tier for API | Must add payment method to generate API key; Pro subscribers get $5/mo credit only | Yes | [Pricing](https://docs.perplexity.ai/docs/getting-started/pricing) |
| Meta Llama API | Limited preview, no confirmed free tier | Official API at llama.com in limited preview; use Groq/Together/OpenRouter for free Llama access instead | Unknown | [API](https://www.llama.com/products/llama-api/) |

## Notes

- **Best permanent free tiers**: Google Gemini (strongest models), Groq (fastest inference), Mistral (most generous token limits), Cerebras (ultra-fast, 1M tokens/day), and Cloudflare Workers AI offer genuine always-free access with no credit card.
- **Best for open-source models**: Together AI (71 permanently free models including Llama 3.1 405B) and OpenRouter (29+ free models) provide the widest free access to open-source models.
- **Cerebras is new and notable**: 1M tokens/day free, ~2,600 tokens/sec inference speed -- the fastest free option available.
- **DeepSeek**: Cheapest paid API ($0.14-0.50/M tokens) with free chat; API free credits are limited (5M tokens, 30 days).
- **Gemini changes (Dec 2025)**: Google reduced free tier limits by 50-80% and removed Pro model from free tier. 2.5 Pro is now available but limited to 5 RPM / 100 RPD.
- **OpenAI**: Free tier is not practical for any real use. Free trial credits were discontinued in mid-2025.
- **Cohere**: Free Trial key is ongoing but restricted to non-production use only.
- **xAI/Grok**: $25 signup credits are generous, plus $150/mo possible through data sharing program -- but requires credit card for API.
- **Perplexity API**: No free tier at all for API access. Not suitable for free-stack projects.

> Last verified: 2026-04-05

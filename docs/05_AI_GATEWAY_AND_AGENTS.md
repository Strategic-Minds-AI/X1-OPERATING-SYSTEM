# X1 | Vercel AI Gateway + voice/agent contracts
## Mandatory LLM routing
Every LLM reasoning, tool invocation, prompt completion and language-model audio inference uses Vercel AI Gateway. Reject Base44 InvokeLLM and direct provider LLM calls.

Vercel announced realtime voice/audio through AI Gateway June 29, 2026, with AI SDK 7 beta. Applicability to this Vercel team, exact model name and supported codec/token-mint route must be verified in staging prior to live session activation.

## Planned BFF endpoints (not yet connected)
- POST `/api/v1/avatars`: authenticated draft creation; consent claim; idempotency key; no training
- POST `/api/v1/avatars/{id}/enrollment`: admin approval required; storage/rights checks
- POST `/api/v1/videos`: approved source, script, avatar, voice, quote and signed job
- POST `/api/v1/live/sessions`: exact ephemeral token/session TTL/usage cap, verified avatar identity
- POST `/api/v1/live/sessions/{id}/interrupt`: cancel transport + generation sequence
- POST `/api/v1/live/sessions/{id}/close`: cleanup and final cost receipt
- GET `/api/v1/agents/jobs/{id}`: tenant-scoped, approved queue status and receipts
- POST `/api/v1/agents/work-packets`: classification/approval before queue insertion

## Safety
Authorization checked on each API request, not only WebSocket handshake. Immutable tool audit records. Deny sending email, posting, spending, production changes, account provisioning or secret edits without exact signed approval. Prevent prompt injection from changing system scope. Set request budgets and concurrency caps.

## Multi-agent contracts
Planner decomposes acceptance checks and proposes packet; Architect validates coupling; Builder edits isolated branch; Tester runs build/E2E; Independent Validator re-fetches head SHA and receipts; Release Agent can only *request* promotion. No agent self-authorizes protected changes.

## Realtime voice events
`session_started`, `mic_ready`, `user_speech_start/end`, `assistant_audio_chunk`, `renderer_frame`, `interrupted`, `tool_approval_required`, `session_closing`, `session_closed`, `error`. Include monotonic sequence, IDs, timestamp, schema version. Use ephemeral speaker media keys, never server master keys in client.

## Official reference
https://vercel.com/changelog/realtime-voice-speech-and-transcription-now-supported-on-ai-gateway
https://vercel.com/changelog/ai-sdk-7

# X1 + Eden Skye: Executive Agent Integration
**As of 2026-10-13:** branch-only implementation. No new repository, supervisor, database, deployment or third-party model account was created.

## Source truth
- Application source: Strategic-Minds-AI/X1-OPERATING-SYSTEMS, derived from feature/x1-avatar-studio-foundation-20261011 at a8862072ec103289c8b9b3217e0be173f43dcfdd.
- Current development change: feature/x1-eden-executive-integration-20261013.
- Existing X1 swarm runtime: Strategic-Minds-AI/x1-ai-hub-swarm-runtime, existing leased work queue and worker on Railway, NOT modified or duplicated.
- Existing Eden Base44 app: 6a8ab2c3080538da4dadb3ef, identity/personality content donor only. X1 runtime prohibits Base44 SDK, functions and database dependencies.
- XTREME Communications OS Base44 app: 6a9b71a5d35335afb9198950, phone and messaging inventory donor for a later provider-neutral X1 communications adapter. No calls or messages initiated.
- Approved Eden face/voice asset and consent packet need independent rights and asset hash verification before migration. A static ES monogram is a labeled placeholder, not the approved portrait.

## What is now implemented
- X1 sidebar > Eden Skye operator workspace without changing other X1 sections.
- AI identification/disclosure, human handoff boundary, draft-only tasks across onboarding, communications, commercials and X1 mission planning.
- Pure x1.eden.work-packet.v1 draft schema with bounded fields and approval status; unknown/privileged fields rejected.
- GET /api/eden/status: no-store, non-sensitive statuses. An environment variable being set does not equal a working integration.
- POST /api/eden/commands: server-to-server preview-only, HMAC-derived stable draft ID, no queue/provider calls and no persistence. Requires X1_EDEN_MODE=preview plus a >=32-character server-only X1_EDEN_PREVIEW_TOKEN as Authorization Bearer. Disabled without both. Never place token in frontend source, NEXT_PUBLIC variables or browser requests.
- Registry contract config/eden-agent.manifest.json for an eventual existing X1 orchestrator handoff.

## Architecture and status
Operator / X1 studio UI -> local typed draft -> future signed X1 WorkPacket -> existing X1 queue and Railway worker -> audited provider-neutral connectors -> independently validated results / receipts.

This branch implements only the first two stages, plus a server-side protected draft route for internal staging. AI inference, avatar WebRTC and audio, signed queue dispatch, Supabase RLS/memory and Twilio/Telnyx are not bound. No fake "live" claims.

## Invariants
1. X1 is authority. Eden must never have a duplicate scheduler, auto-dispatcher or cross-tenant unverified permissions.
2. X1 source remains Base44-free. Copy only independently approved Eden persona/asset data after provenance checks; do not copy private chats or biometric records without consent.
3. External actions stay deny-all until consent, verified tenant membership, compliant channel, opt-out/quiet-hours policy, approved scope, idempotency, cost cap and operator authorization.
4. Voice and video interactions identify Eden as AI; do not fabricate real-human experiences or use another person's likeness/voice without permission.
5. Secrets remain server side; frontend local drafts do not authenticate or dispatch.
6. Independent Guardian checks cannot be self-certified by builder agents.

## Minimal validation
- node --test tests/eden-integration.test.mjs: required contract/security behavior, no provider calls.
- Existing npm run test (typecheck + architecture + mission + next eligible).
- npm run build.
- Inspect exact branch SHA, source diff, mandatory CI results and receipt before preview deployment.
- Browser QA for X1 navigation, keyboard focus, form and mobile 390px / desktop 1440px on an authorized preview.
- Negative tests: tenant spoof, cross-site POST, missing token, wrong token, unsupported action, oversized prompt and missing provider binding.

## Follow-up delivery packets
1. WP-EDEN-02: Authenticated Supabase tenant and signed X1 queue broker; dry-run first, independent receipt.
2. WP-EDEN-03: Provider-neutral Xtreme Communications status and communications-draft bridge with signed callbacks. No Digital Dominance 2.0 or customer sends.
3. WP-EDEN-04: Approved face asset -> private X1 storage with consent/hash; licensed voice/video renderer; interruption/turn-taking and per-session spend tests.
4. WP-EDEN-05: Vercel AI Gateway conversational reasoning (verified entitlement), opt-in memory and refusal tests; human handoff.
5. WP-EDEN-06: Isolated inbound test; outbound only after separately approved consent/compliance release.

## Release/rollback
- PASS for committed source only until independent CI. No production release.
- Abandon/revert this feature branch; original X1 avatar branch and main remain unchanged.
- Any live X1 rollback requires operator approval and exact known-good deployment commit.
- Merge, Vercel domain, Railway worker, Supabase RLS, Twilio routing, HeyGen credits, live social/email/SMS/voice remain gated.

## Evidence gaps
Unknown: provider credentials/configuration, staged tenant authentication, X1 broker readiness, approved portrait rights, session latency, real audio/video, phone handoff, cost accounting, independent visual parity and production deployment identity.

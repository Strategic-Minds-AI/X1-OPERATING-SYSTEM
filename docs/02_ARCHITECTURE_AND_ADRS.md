# X1 | Architecture, provider boundaries and ADRs
## System diagram
```text
                        X1 Avatar Studio on Vercel (Next.js)
                    /            |             |              \
            Client/Creator    Live Player    Operator      X1 Agent Console
                    \            |             |              /
               Supabase Auth -> Vercel BFF/API (session/permission broker)
                                   | 
       +---------------------------+----------------------------+
       |                           |                            |
 Supabase Postgres + RLS    Vercel AI Gateway           Railway X1 control
 Storage (private)         (LLM + realtime audio)      (existing swarm)
       |                           |                            |
       +----------------------+----+----------------------------+
                              |
                    Media orchestration service
                     WebRTC / LiveKit signaling
                              |
                   GPU Avatar Renderer Adapter
                (consented likeness + licensed weights)
                              |
             streamed A/V with timestamps and barge-in
```

## ADR-001: No Base44
Reject managed authoring-runtime lock-in. No Base44 SDK, entities, auth, functions, InvokeLLM or production hosting. CI scans runtime source. If source requires Base44, it fails.

## ADR-002: Canonical source
`Strategic-Minds-AI/X1-OPERATING-SYSTEM` owns product app/docs. `x1-ai-hub-*` retain runtime/queue authority. `EDENSKYESTUDIOS` and old Digital Dominance repos donors under explicit migration. Never force-copy entire applications across forks.

## ADR-003: LLM traffic
All language-model inference through Vercel AI Gateway. Realtime voice availability must be verified with actual account/model before use. External ASR/TTS or video-specialist inference is separately specified and approved; no direct LLM provider bypass.

## ADR-004: Autonomous coding supervisor
Use existing X1 staging `x1_work_queue` and existing Railway preview worker, not a new cron or second lease system. No work dispatched without authenticated tenant, idempotency and action-class authorization; branch-only writes and independent validator. The human does not need to type CONTINUE, but must approve protected operations.

## ADR-005: Avatar GPU isolation
Next.js serverless API must NOT run heavy persistent video model. Independent GPU worker with session lease, explicit idle timeout, queue caps, renderer adapter and video transport. Railway can orchestrate; model host selected by actual GPU support/cost tests.

## ADR-006: Identity/biometrics
Private source assets, explicit rights & revocable consent, proof of control over likeness and voice, age/safety constraints, AI-video disclosure and audit history. Do not enroll or synthesize real third-party identities without authorization.

## ADR-007: Separation of commercial modes
Executive Eden, generic customer-facing studio and other creator products share engines under distinct tenant permissions, brands and persona contracts; no implicit leak between workspaces.

## Engineering invariants
No provider secrets in browser. No user raw portrait forwarded to third-party model without recorded approval. Fail-closed if Auth, tenant context, consent or renderer unavailable. Any generated output marked as synthetic where appropriate. Never report readiness based on UI mockup.

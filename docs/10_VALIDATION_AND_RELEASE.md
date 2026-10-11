# X1 | Independent validation, repair and release gates
## Formal states
UNKNOWN / BLOCKED / FAIL / PASS. Mark PASS only when observed and stored. 'READY' Vercel deployment does not certify product functionality.

## Build gates
`npm run typecheck`; `npm run test:architecture`; `npm run build`. Check dependencies for Base44 SDK, external keys and unapproved provider bypass. Next.js vulnerability scan and lockfile pin. CI must run against exact source SHA.

## Functional gates
Avatar draft creation only in local session; no promise of persistence; search filters and navigation work; creation modal consent required. Calls to real avatar jobs and autonomous queue **must return 503** until auth and service bindings exist.

## Integration gates
- Supabase: tenant ID from signed session; RLS denial negative test and storage signed URL TTL.
- Vercel: preview project team/commit SHA and branch; direct-route 200; log inspection.
- Railway: existing worker identity, one authoritative heartbeat, lease acquisition/release and signed packet receipts; no duplicate supervisor.
- Gateway: all LLM traces through Vercel; no direct LLM provider bypass; voice/codec/latency tested.
- Renderer: real video frame stream, lip/audio sync and likeness lock. Identity owner consent retained.

## E2E acceptance
Browsers Chrome/Safari; mobile 390x844 and desktop 1440x900. 5/20 min sessions; 30 turns, interruptions, network jitter/disconnect, overload and forced cleanup. Capture p50/p95, costs, WebRTC track state, security events and reviewer findings.
Upload should reject huge/unsupported media, expired/revoked consent and cross-tenant references. Source media must not be public by default.
No perf claims without screenshots/logs/results dated per run.

## Release protocol
Builder submits PR with artifact/source hashes. QA Sentinel re-fetches exact code and runtime separately, verifies requirements, writes signed receipt. Release manager only proposes a promotion. Protected merge, prod deploy, schema, DNS, secrets, spend and live messages require separate scoped operator approval. Record rollback SHA, DB migration rollback, worker deploy revert and stale queue cancellation.

## Current validation
Source tree and docs created in isolated feature branch. Automated GitHub Actions planned on PR. No independent frontend screenshot, build, functional or live audiovisual acceptance yet.

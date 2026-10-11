# 23 | Avatar Studio autonomous coding: exact cross-repo integration contract
Status: **SPECIFICATION ONLY**. All endpoints below describe a proposed guarded contract; they are NOT deployed.

## Scope and authoritative ownership
- Product source/UI/jobs API: `Strategic-Minds-AI/X1-OPERATING-SYSTEM`, Avatar Studio bounded context in PR #4.
- Queue/leases/tenant execution ledger: existing X1 Supabase staging `uvdkzsbjackpjvpoxtyk`.
- Worker/supervisor: existing Railway `x1-swarm-preview`; no additional polling daemon/cron.
- Code proposer + signed branch writer + CI verifier: merge selectively from X1 swarm PR #9 **after** auth-failclosed PR #7 and sandbox PR #8 integration tests.
- Renderer and video/voice production jobs are DIFFERENT queues/action types; code agents must never run renderer enrollment, contact customers or access unconsented media to test code.

## Proposed HTTP boundary (not currently implemented)
`POST /api/engineering/jobs` requires an authenticated server-validated session + tenant membership; accepts a canonical packet reference, not arbitrary shell commands, a browser-provided tenant ID, or a raw secret. Normalize input, run role/approval checks and return `202` with generated work ID and receipt on valid nonproduction queue enqueue, `403` on denied policy, `409` on idempotency conflict, `422` on invalid schema, and `503` while disabled/unbound.
`GET /api/engineering/jobs/{jobId}` returns tenant-filtered state and redacted receipt IDs only; no secrets, third-party raw text or another tenant's job.
`POST /api/engineering/jobs/{jobId}/cancel` requests lease-aware idempotent cancellation from the existing supervisor, never arbitrary process termination.
No API endpoint can auto-approve mutation, change tenant or bypass a failed staging bootstrap.

## Work packet schema v1, required fields
`packet_id`, `mission_id`, `tenant_id` (server-assigned), `repo` (allowlisted product repo), `branch` (new isolated feature branch only), `source_sha` (40-hex), `action_class` (READ_ONLY or NON_PRODUCTION_MUTATION), `objective`, `source_refs`, `allowed_paths` (bounded exact paths; no workflows/secrets), `acceptance`, `validator_identity`, `budget_ref`, `max_attempts<=3`, `timeout_seconds`, `expires_at`, `approval_receipt_id` where action demands it, `idempotency_key` (SHA-256 canonical form), `trace_id`. Map into existing SQL/RPC names, not a duplicate table. Sign the authorization independently of the coding model.

## State machine
`DRAFT -> AUTHORIZED -> QUEUED -> LEASED -> RUNNING -> CANDIDATE_COMMIT -> INDEPENDENT_VALIDATION -> VERIFIED -> DONE`.
Alternates: `BLOCKED_AUTH`, `BLOCKED_BUDGET`, `BLOCKED_SCOPE`, `BLOCKED_DEPENDENCY`, `FAILED_REPAIRABLE`, `REPAIR_EXHAUSTED`, `CANCELED`, `DEADLETTER`.
Protected actions NEVER enter RUNNING based on an unsigned model suggestion. A refused or expired authorization becomes BLOCKED, not a retryable FAILED loop.

## Implementation adapter interfaces
1. `SessionAuthz`: verify session, tenant membership, code-agent capability, action class, expiry and distinct approver. All identity claims are server authoritative.
2. `MissionEnqueue`: validate typed packet; check current source SHA and dependency state; canonical idempotency; queue through existing signed gateway/RPC; return durable work ID.
3. `WorkerDispatch`: use `processNextWork`, existing lease+heartbeat, signed bootstrap authorization. Deny production/default branch, disallowed path, spend and tenant mismatch.
4. `SandboxRunner`: immutable base source, allowlisted repo, isolated working directory, capped duration/size/CPU/network, scoped short-lived credentials and owner-tagged cleanup. Never use Railway production filesystem as scratch.
5. `GatewayCodingProposer`: Vercel AI Gateway **only**, explicitly approved model budget/token limits; redact inputs, defend against repository prompt injection; a generated proposal is UNTRUSTED.
6. `BranchWriter`: verify independent scoped signed grant, exact allowed paths, stale SHA rejection, nonprotected target, atomic update and read-after-write commit SHA.
7. `IndependentVerifier`: distinct actor re-fetches branch/CI at candidate commit; checks status, work packet, tests, path diff, RLS/security constraints; emits separate signed validation receipt.
8. `ReceiptAndRecovery`: records work ID, tenant, repo, initial/candidate SHA, model token/cost, approval, lease, sandbox instance, CI URL, independent verdict, retry count and rollback point. Resume only idempotent stages.

## Security non-negotiables
- All provider secrets stay in an approved provider vault. GitHub App installation token or tightly scoped branch token, no global PAT in frontend.
- Use separate identities/credentials for builder and reviewer; model cannot mint authorization or reviewer credentials.
- Prevent path traversal, case-variant protected branches, hidden .github/workflows edits, symlink escapes, arbitrary URLs, outbound callbacks and credential exfiltration.
- No automatic GitHub protected/default-branch merge, production deploy, DNS, schema/RLS, billing, secrets, paid GPU or customer/public communication.
- Kill switch defaults off and must stop new lease/start safely while preserving forensic receipts. Leased job shutdown respects timeout and rollback.
- Avatar consent/rights and original source media are not coding agent fixtures; use synthetic, fabricated test assets with no human likeness.

## Interface acceptance tests (must execute, not merely exist on paper)
A1 invalid/missing session => denied without queue record. A2 tenant crossover => 403 and no data exposure. A3 protected branch/repo/workflow file => denied. A4 stale source SHA => blocked. A5 duplicate request => one job. A6 expired signing/lease => blocked. A7 forced auth 401 or control-plane outage => BLOCKED with no handler invocation. A8 exhausted retries => deadletter and notification. A9 gateway down/budget zero => blocked without direct-provider fallback. A10 valid signed READ_ONLY packet => lease/finish + matching audit receipt. A11 valid approved branch-only test => exact branch commit + independent CI + draft PR. A12 validator rejection => bounded repair then blocked if still red. A13 restart during worker task => reconciles exactly once. A14 no second worker or scheduler; stable lease ownership. A15 kill switch => no new coding jobs. A16 provider records no unexpected spend.

## Dependency caveat
Swarm #7/#8/#9 have distinct unmerged heads. Their green CI is evidence about isolated branches only, NOT a tested integration. Build one new feature branch using exact source SHAs, run combined tests, then use a separately scoped staging activation approval. Never turn on solely because these documents are committed.

# 24 | Avatar Studio autonomous coding activation runbook and QA receipt gates
Scope: nonproduction autonomous **engineering** of the HeyGen-parity Avatar Studio. This is NOT a switch for live face/voice rendering or the broader X1 corporate platform. Status: **BLOCKED / NOT ACTIVATED** until evidence gates below pass.

## 0. Preflight and gate ownership
Before any mutation, re-fetch current product PR #4 and swarm PRs #7/#8/#9 exact head SHAs, plus Railway deployed code, Supabase staging state, Vercel preview project branch/target and existing schedulers. If SHAs drift, stop and rebase integration plan. Verify repo rights, staging tenant membership, actions/RPC permissions, artifact retention, Git branch protection and rollback identity. No record of rights means UNKNOWN, not PASS.

## 1. Reconcile work contracts, avoid duplicate schedulers
Map `config/mission.x1-avatar-studio.json` 10 machine DAG tasks to `docs/09_BUILDER_WORKPACKS.md` 12 work packets; mark a single execution owner and accountable independent QA role. Resolve expected source SHA and idempotency key for each job. Record that the verified Railway deployment (2026-10-06 SHA `c9371658a47924f309b6c125e480dd444ea17bd0`) predates coding-agent PR #9. Confirm unique supervisor, cadence, queue and worker identity; do not create another cron.

## 2. Merge-free staging integration branch
Create separate isolated integration branch in `Strategic-Minds-AI/x1-ai-hub-swarm-runtime` from a verified head. Selectively reconcile #7 fail-closed auth, #8 sandbox contracts and #9 proposer/writer/verifier modules. Do not merge protected/default branch. Review contracts: `work-queue-client.ts`, `worker-orchestrator.ts`, `authorization-verifier.ts`, `worker-main-gateway.ts`; preserve current working READ_ONLY behavior. Test all conflicting file changes. Extend handler behind default-off nonproduction feature gate; reject signed grants from untrusted tenants.

## 3. CI and synthetic dry-run gates: NO spend
Execute typecheck, unit, auth-negative, lease, sandbox, gateway mock, signed branch-writer mock, independent CI verifier, idempotency/deadletter and timeout tests against exact integration SHA. Require complete test matrix A1-A9/A12-A15 from doc 23. Record build logs, test counts, SHA and no-secret-leak security scan. A synthetic test is not a deployed canary.

## 4. Authenticated READ_ONLY staging canary
Use **existing** staging tenant and worker with verified authorization, not fabricated credentials. Submit exactly one harmless signed READ_ONLY packet using the existing queue and approved operator scope. Observe original queue row, lease holder, heartbeat, control-plane authorization, handler result, finish state and execution/audit receipt. Read after completion and verify no duplicate job, no unexpected retries, no business/customer data read, no writes beyond expected queue/receipt. If auth denies, mark BLOCKED; do not retry with relaxed permissions.

## 5. Nonproduction coding canary (separate scoped approval)
Require approved GitHub branch-writer binding, independent validator identity and zero-or-bounded provider budget; create sandbox with TTL and resource tags. Start from exact allowed product SHA and an allowlist like `tests/avatar-autocoding-canary.test.mjs` and `docs/canary/**` only. Run a synthetic coding request that does not touch real avatars or client data. Require: gateway model call under documented budget if approved; machine-readable proposal; candidate branch commit; GitHub CI on candidate SHA; independent validator readback; draft PR; bounded repair on controlled failure; receipts and deterministic rollback. If a no-cost model canary is impossible, run sandbox/writer mocks only and keep MODEL_BACKED_ACTIVE=false.

## 6. Failure/recovery/kill-switch proof
Induce controlled expired lease, SIGTERM during sandbox execution, auth 401, control plane outage, deliberate CI failure, model error, candidate SHA drift and budget exceeded. Verify blocked tasks do not run, work is not double-applied, repair max 3, tenant isolation intact, no abandoned paid resources, and receipts persist. Restore baseline and independently check next eligible task only; no auto-escalation of protected work.

## 7. Restricted activation decision, not automatic launch
Only after separate reviewer PASS for 0-6 may the operator approve a **staging-only bounded** feature gate: exact repo/worker/service, branch/SHA, tenant, permitted paths/tasks, model route, currency budget ceiling, TTL/concurrency, dates, rollback ID and emergency disable. Re-run canary after deployment at the deployed SHA. Queue propagation alone is insufficient; require a completed code change and validated independent receipt. Production remains a distinct later approval.

## Receipt fields mandatory
`receipt_id, captured_at_utc, repo, branch, source_sha, candidate_sha, deployment_id, environment, tenant_id_pseudonym, worker_id, authorization_receipt_id, queue_work_id, lease_id, idempotency_hash, sandbox_id, runner_version, gateway_route, model_id, max_budget, observed_cost, tests_run, tests_pass, tests_fail, ci_url, independent_validator_id, validation_result, retry_count, rollback_target, next_packet, protected_action_hold`. Redact sensitive tenant/subject/credential data.

## Work packet queue, dependency order
| Packet | Objective | Acceptance evidence | Current state |
|---|---|---|---|
| AC-001 | Pin exact product/swarm/runtime head SHAs | source ledger + drift check | READ preflight available |
| AC-002 | Reconcile auth fail-closed (#7) | 401/503 denied, 0 handler invocations | NOT INTEGRATED |
| AC-003 | Reconcile sandbox fleet (#8) | tenant TTL isolation + cleanup tests | NOT INTEGRATED |
| AC-004 | Reconcile proposal, branch writer, validator (#9) | merged test suite green, default off | NOT INTEGRATED |
| AC-005 | Bind Avatar Studio signed queue API | Auth/RLS/idempotency negative tests | API 503 / NOT CONNECTED |
| AC-006 | Real signed READ_ONLY work canary | lease + heartbeat + execution receipt | NOT VERIFIED |
| AC-007 | Branch-write sandbox canary | scoped grant, branch commit, CI, independent receipt | NOT VERIFIED |
| AC-008 | Interrupted/repair/restart canary | correct blocked/deadletter, no duplication | NOT VERIFIED |
| AC-009 | Budget-aware model coding canary | Gateway route, cost receipt, strict cap | APPROVAL / ENTITLEMENT REQUIRED |
| AC-010 | Staging bounded coding activation review | external validator + rollback + operator gate | BLOCKED |

## Essential environment checklist (names only; no values)
Existing worker: `X1_SYSTEM_TENANT_ID`, `X1_CONTROL_PLANE_URL`, `X1_DB_GATEWAY_URL`, `X1_INTERNAL_SERVICE_TOKEN`, authorization-signing reference and `X1_WORKER_ID`. Candidate coding adapter: `GATEWAY_MODEL_ID`, `AI_GATEWAY_API_KEY` (approved alias determined by source), GitHub scoped app/token reference, grant-signing key reference, sandbox provider binding, enable flag default false, cost ceiling, TTL/concurrency, independent verifier identity, alert sink and emergency kill switch. Reconcile actual code names in the integration branch before setting any variable. **Never request or copy secret values into GitHub, prompt or chat.**

## Rollback and stop criteria
- Stop immediately for authorization drift, missing tenant, repeated 401/403, candidate outside allowlist, secret exposure, unexpected costs, duplicate worker/lease, provenance mismatch, validator disagreement or any prod-target mutation.
- Flip independently approved feature gate OFF, stop new leases, drain/cancel in-flight safe work per status, preserve audit trail; shut down owned sandbox resources only after archive receipt; restore previous worker deployment SHA if operator authorizes scoped rollback.
- Never delete staging tables, alter production policies or rotate credentials without separate approval.
- If initial failure is outside active branch: do not patch production to make green tests.

## Explicit non-goals
No general X1 corporate frontend changes; no Base44; no avatar face/voice cloning or third-party identity collection during engineering canary; no live model/GPU cost until approved; no automatic default-branch merge, publishing or customer contact.

## Go / no-go
Docs present != coding live. UI preview READY != agent live. CI PASS != lease PASS. One canary != 24/7 continuity. **Current decision: NO-GO for autonomous coding activation; GO for isolated branch integration and safe synthetic validation.**

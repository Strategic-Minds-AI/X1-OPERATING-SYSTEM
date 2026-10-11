# X1 | Autonomous coding system, without repeated chat prompts
## Objective
The operator submits a mission **once**. A persistent authorized runtime decomposes it into bounded packets, makes progress in isolated branches, independently validates it, retries only fixable failures, persists all results, and requests human input **only at meaningful protected gates**. A chat message or open browser window is not a durable execution engine.

## Reuse, no duplicate heartbeats
The 2026-10-11 readback discovered X1 Staging Supabase `x1_work_queue`, `x1_task_leases`, `x1_execution_ledger`, `x1_worker_heartbeats`, `x1_audit_receipts` and a Railway `x1-swarm-preview` service. These are authoritative. Add *coding capability* to the existing X1 swarm via a separate branch and workflow; never create a second polling daemon without reconciliation.

## Work packet example
```json
{
  "schema": "x1.work-packet.v1",
  "packet_id": "WP-X1-AVATAR-001",
  "mission_id": "X1-AVATAR-STUDIO-20261011",
  "repo": "Strategic-Minds-AI/X1-OPERATING-SYSTEM",
  "base_ref": "feature/x1-avatar-studio-foundation-20261011",
  "action_class": "NON_PRODUCTION_MUTATION",
  "scope": ["src/**", "tests/**", "docs/**"],
  "task": "Bind tenant-aware read-only Supabase app API in staging",
  "allowed_actions": ["read", "feature_branch_commit", "draft_pr", "test"],
  "forbidden_actions": ["deploy_production", "secret_write", "billing", "merge_main", "messaging"],
  "acceptance": ["typecheck_pass", "build_pass", "rls_cross_tenant_denial_proven", "independent_review"],
  "validator_role": "X1-QA-SENTINEL",
  "max_attempts": 3,
  "timeout_seconds": 1800,
  "budget_usd": 0,
  "idempotency_key": "sha256-of-canonical-packet",
  "rollback": "revert isolated branch commit",
  "approval_reference": null
}
```
The existing X1 queue's `action_class` values are READ_ONLY, NON_PRODUCTION_MUTATION, PROTECTED_MUTATION and PRODUCTION_RELEASE. Queue `idempotency_key` demands 64 lowercase hex characters. Map the JSON contract into existing SQL columns; do not create another public work queue.

## Loop and agent responsibilities
1. Mission intake via authenticated app/API -> define objective, allowed repos, budget, quality contract; persist mission.
2. Planner forms a dependency graph of packets; rejects open-ended instruction not tied to tests.
3. Controller classifies action and verifies tenant/approval/permissions; creates canonical SHA/idempotency and persists pending eligible packets.
4. Existing single Railway worker owns leases and heartbeats; protected packets remain BLOCKED until signed approval.
5. Coding Sandbox allocates isolated Git branch and short-lived credentials; can use supported coding harness (Codex/AI SDK 7 adapter/other audited sandbox) only after tool availability and license tests. No arbitrary shell access on production secrets.
6. Builder writes code, runs typecheck/test/build, produces receipts, opens DRAFT PR.
7. Independent validator separately fetches branch SHA and re-runs checks and security gates. Failing checks route to bounded repair (max 3).
8. Verified packet => progress update in durable ledger; advance dependent eligible packets automatically, never needing the user to type CONTINUE.
9. Protected deployment, migrations, production rollouts, paid GPU, DNS, credentials and customer messaging route to an approval inbox with scoped diff, rollback and cost.
10. Recovery: lease expiration, heartbeat mismatch, worker crash and dead-letter receive durable incident, no blind re-execution of a non-idempotent action.

## Security and spend
Least-privilege short-lived repo scoped credentials; scrub prompts and logs for secrets. Network allowlist where possible, CI policy, no self-merging to protected branches. Concurrency limits per tenant/provider; no billed model/GPU tool invoked without authorized budget. Separate Implementer and Validator identities. Stop queue if budget/approval registry unavailable.

## What is and is not active
**Existing** SQL tables and Railway swarm are live and confirmed through connector inventory. **New coding-agent executor, model binding, signed queue submission and UI queue bridge in this branch are NOT active.** Need independent auth/worker smoke receipt before reporting autonomy operational.

## Minimal activation gate
Read live worker source/authorization contract; test 1 READ_ONLY deterministic packet against staging; observe lease, receipt, independent validator; then 1 nonproduction GitHub branch write; verify bound model uses Vercel AI Gateway and no recurring duplicate runner. Never auto-activate on repo merge.

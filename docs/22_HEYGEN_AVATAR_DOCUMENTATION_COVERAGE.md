# 22 | Independent Avatar Studio: architecture coverage and current source truth
Audit date: 2026-10-11. **Product boundary: the independently owned HeyGen-category Avatar Studio.** The broader X1 Operating System is an infrastructure provider, not the product under review.

## Evidence pinned for this audit
- Product code/architecture: `Strategic-Minds-AI/X1-OPERATING-SYSTEM`, PR #4, head `a8862072ec103289c8b9b3217e0be173f43dcfdd`; foundation branch `feature/x1-avatar-studio-foundation-20261011`.
- Code-agent extension: `Strategic-Minds-AI/x1-ai-hub-swarm-runtime`, draft PR #9, head `54c4072ae5d7b0b055e5fcba28f53f618f8ea719`.
- Separate prerequisites: swarm PR #7 authorization fail-closed, head `7a6d1fc0a22b39be8481680c2dde701ea9a0f493`; swarm PR #8 ephemeral sandbox fleet, head `f8243fc5ddb04680baa5babe046ed39001c7f80d`.
- Authenticated provider readback: Supabase `uvdkzsbjackpjvpoxtyk` ACTIVE_HEALTHY; Railway preview project `f442cf0a-7275-4c2b-bf73-2dda4254e002`, `x1-swarm-preview` last successful deployment `2f067649-c275-43a8-a13b-505bcd9c08f1` dated 2026-10-06, code SHA `c9371658a47924f309b6c125e480dd444ea17bd0`. This is *not* PR #9. Existing Vercel preview project `prj_KtO8DbrNZilaO8DulDzWBSBSxYRB` has deployments requiring target/branch verification; some unrelated V2 frontend branch deployments targeted this preview project and were canceled.
- CI: product PR #4 run `38130269615` SUCCESS; swarm PR #9 run `38130190290` SUCCESS. CI does not prove authorized model use, actual branch writes, worker dispatch, or live rendering.

## Existing numbered document inventory
01 Product and HeyGen-category parity spec; 02 system architecture/ADRs; 03 Supabase data contract; 04 avatar renderer/media; 05 AI Gateway/agents; 06 infrastructure/bindings; 07 autonomous coding; 08 frontend/Eden visual handoff; 09 builder work packets; 10 validation/release; 11 governance/consent/costs; 12 Growth migration; 13 continuity/handoff; 14 coding-agent system prompt; 15 research sources; 16 blocker receipt; 17 platform bootstrap; 18 AutoBuild machine bootstrap; 19 automated validation receipts; 20 provider-ready scaffold; 21 parallel PR convergence. Also `docs/START_HERE.md`, `config/mission.x1-avatar-studio.json`, `.github/workflows/quality.yml`, fail-closed API routes and draft renderer/migration.

## Required architecture mapping
| Discipline | Source already in PR #4 | Documentation | Execution proof today |
|---|---|---|---|
| Product, modes, user roles, HeyGen benchmark | 01, 15 | PRESENT | parity UNKNOWN |
| Frontend, navigation, responsive/accessibility | 08, 10, app source | PRESENT | compiled/CI PASS; browser and final visual QA UNKNOWN |
| Backend/API authentication and BFF | 02, 03, 05, `src/app/api` | PRESENT, needs wire contract | API 503 by design; BLOCKED |
| Supabase Postgres, RLS, private media, consent | 03, draft SQL | PRESENT | staging project healthy; avatar migration UNAPPLIED; tenant tests UNKNOWN |
| Model gateway, TTS/ASR and voice streaming | 05 | PRESENT | real model entitlement, token exchange and media tests UNKNOWN |
| Avatar rendering, WebRTC, likeness/license | 04, 11, renderer stub | PRESENT | renderer 503, GPU/licensed weights NOT BOUND |
| Autonomous mission planner | 07, 09, 18, mission JSON, scripts | PRESENT | deterministic offline dry-run and CI PASS |
| Persistent work lease/queue | 02, 07, 18, existing swarm | PRESENT, reused | staging signed lease for avatar job NOT VERIFIED |
| Code proposer / model-backed harness | 07, swarm PR #9 adapter | PRESENT, disabled | no approved model call or cost receipt |
| Isolated coding sandbox and branch writer | swarm PRs #8/#9 | PRESENT, disabled | synthetic tests only; no real sandbox branch-write canary |
| Independent validator and bounded repair | 10, 19, swarm PR #9 | PRESENT, tests | CI and dry-run tests PASS; end-to-end canary absent |
| Deployment, rollbacks, incident/deadletter | 06, 10, 17, swarm docs | PRESENT, needs ops runbook | no avatar coding deployment/canary |
| Identity/voice consent, misuse and provenance | 03, 04, 11 | PRESENT | Eden source asset bytes/consent not verified |
| Observability, costs, incident notification | 07, 10, 11, 18 | PARTIAL | no live joined trace+budget+code receipt |
| Commercial tenant/billing/public release | 01, 03, 11 | DESIGN ONLY | not authorized or tested |

## Critical source-code truth
- Product `src/app/api/engineering/jobs/route.ts` GET/POST deliberately return 503 `X1_QUEUE_BRIDGE_NOT_CONNECTED`.
- Product mission `activation.queueBridge=false`, `activation.modelInference=false`, `activation.gpu=false`, `activation.production=false`; `status=SCAFFOLD_NOT_QUEUED`.
- Swarm `src/worker-main-gateway.ts` handler accepts READ_ONLY only; mutation work throws `NO_PREVIEW_HANDLER_FOR_MUTATION`.
- Swarm `src/autobuild-pipeline.ts` is `runAutoBuildDryRun`, and accepted result is `PLAN_READY`, not CODE_WRITTEN.
- Swarm `src/github-branch-writer.ts` is disabled by default and requires time-limited signed grant, specific repo/branch/SHA, allowlisted paths and an authorized GitHub token.
- Swarm `src/gateway-coding-adapter.ts` refuses inference without `enabled`, authorization receipt and model/API key; its source is not deployed in the verified Railway worker.
- Repo CI `quality.yml` filters PR file paths and does **not** trigger on docs-only changes; docs readback is not a CI PASS.
- Engineering source and general X1 V2 marketing/visual branches are separate. Do not merge or rebrand unrelated X1 code to claim Avatar Studio readiness.

## Architectural gaps to close before activation
1. **Authenticated route-to-queue interface**: typed schema, bearer/session verification, server-assigned tenant, idempotency and permission tests.
2. **Cross-branch runtime integration**: review and converge swarm #7/#8/#9 in ONE isolated integration branch against a single source SHA; no duplicate supervisor.
3. **Actual sandbox executor**: limited network/runtime/filesystem/credential scope; verified cleanup, TTL, retries and owner tags; no production secret mounts.
4. **Independent QA authority**: commit SHA-bound CI readback by a separate validator identity, plus negative privilege tests and repair caps.
5. **Budget/secret binding approvals**: named secrets in provider vaults, exact spender model, ceilings, revocation and kill switch; never write secrets to docs.
6. **Operational evidence**: one signed READ_ONLY staging lease/finish receipt, one approved nonproduction branch mutation, independent CI, recoverable restart and rollback.
7. **Product-specific test fixtures**: mocked avatar job, safe fake identity assets, no accidental real face/voice enrollment or GPU call.
8. **Documentation drift**: reconcile 10 machine DAG tasks against the 12 product work packets before automated scheduling.

**Readiness determination: DOCUMENTATION SUBSTANTIALLY PRESENT; AUTONOMOUS CODING ACTIVATION = BLOCKED.** Do not equate successful unit tests with unattended runtime operation. See docs 23 and 24 for implementation and acceptance contracts.

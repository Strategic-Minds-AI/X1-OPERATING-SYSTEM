# X1 | Start here (2026-10-11)
## Decision record
The operator selected X1 Operating System as replacement **umbrella** for Digital Dominance, and authorized the creation of a multi-avatar, HeyGen-category software platform, rather than an Eden-only prototype. Base44 is explicitly excluded from the entire runtime and builder pipeline.

## Phase / step / TODO
**PHASE:** BUILD FOUNDATION **STEP:** branch-only product/bootstrap. **TODO:** verify source; build portable Studio shell; produce code/infra/agent packets; validate; prepare staging connections; gate all production/spend/secret changes.

## Exact source-truth receipts (read-only connector evidence)
- GitHub `Strategic-Minds-AI/X1-OPERATING-SYSTEM`, main HEAD `3c2bf4b275bd50b70bf29f248f10ccd5762c229f` during discovery. Initial tree: `README.md` only. This branch supplies first frontend.
- Existing `Strategic-Minds-AI/x1-ai-hub-swarm-runtime` has real work execution implementation (`src/worker-orchestrator.ts`, `src/work-queue-client.ts`, `src/authorization-verifier.ts`, `src/execution-ledger.ts`), CI and documented contracts. Do not build a competing supervisor.
- Supabase org `Strategic Minds AI`; project `uvdkzsbjackpjvpoxtyk` called X1 AI Hub Staging reports ACTIVE_HEALTHY. Tables `x1_work_queue`, `x1_task_leases`, `x1_execution_ledger`, `x1_audit_receipts`, `x1_worker_heartbeats`, `x1_tenants` are present and RLS enabled; this does NOT prove app authorization is bound.
- Railway workspace `Strategic Minds AI`. Existing `X1 AI Hub Swarm Preview` project ID `f442cf0a-7275-4c2b-bf73-2dda4254e002`: `x1-swarm-preview` service last successful deploy Oct 6, 2026 on `feature/mandatory-capability-bootstrap`, plus `project-zero-control-plane-preview`. Production-named Railway environment is not proof this is an operator-approved commercial production release.
- Vercel team Strategic Minds Advisory ID `team_aFdds8lsbHMwe2ip4aQdbQ3d`. Existing preview `x1-smai-v2-frontend-preview` project ID `prj_zIyHERu9LRPkmiGFUUHvie8Jzof1`, `READY`, target null. It is a donor; Git linkage and app content remain to be inspected independently.
- Separate Eden source `Strategic-Minds/EDENSKYESTUDIOS` Next.js 16 frontend/API and Eden V2 Drive packet `https://drive.google.com/drive/folders/1UTo9XWJXo4pKYRnnRALeM7lrqHWMv2s4`. Do not overwrite creator/commerce routes or substitute Eden's face.

## What this branch implements
A responsive product UI shell and fail-closed integration endpoints. It does not create paid services, models, live WebRTC sessions, database schemas, production deployments, new supervisors or credentials.

## Decision gates
- operator needs to authorize any new billed resource / avatar GPU.
- only independent validated branch/build can be promoted after release request.
- independent reviewer must verify real model output and lip-sync; 'UI exists' is not HeyGen parity.

## Next eligible packet
`WP-X1-AVATAR-001`: authenticated nonproduction Supabase tenant/session read binding + gateway availability canary; implement on this branch and validate before first live avatar.

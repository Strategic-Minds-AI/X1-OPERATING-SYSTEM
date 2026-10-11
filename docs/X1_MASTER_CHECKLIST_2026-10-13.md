# X1 | End-to-end master checklist
**Current verification date:** 2026-10-11 (operator local time, EDT).  
**Presentation target:** 2026-10-13.  
**Repository:** private `Strategic-Minds-AI/X1-OPERATING-SYSTEM`.  
**Development branch:** `feature/x1-self-build-canary-20261011`.  
**Read-back commit at handoff:** `8067522cd3507435e55bbe9fa1296389d60f0ad1`. Always fetch a fresh SHA.  
**Release:** feature branch only. No production deploy/merge or customer contact.

The only checkboxes marked complete below are backed by observed source, actual read-back or linked CI. Every checklist item still unchecked must be treated as an action or independent verification task, not a claimed finished capability.

## Gate A: Demonstration in next 48 hours (P0; executive-facing)
- [x] A private canonical X1 repository and preserved donor history.
- [x] X1 Studio split UI with chat, instant-estimate preview, visual inspector, source view and device toggles, local only.
- [x] 97 real template docs, searchable registry and a separate 100-service research candidate list.
- [x] Deterministic CRM canary generator emits real HTML/CSS/JS, README and source SHA-256 hashes.
- [x] Sample CRM add/search/filter/advance/export/reset interactions implemented using synthetic local data.
- [x] X1 self-build GitHub Actions separate builder and independent-verifier jobs (run `38131952107` at SHA `8067522...`).
- [x] X1 unit/regression test run `38131952009`: 50 tests PASS, 0 fail.
- [x] Canary browser harness 14/14 interactions in separate QA runner; desktop 1440x900 and mobile 390x844 screenshots generated (not visual parity certification).
- [ ] Review screenshots by humans for premium polish, spacing and legibility, and record operator acceptance.
- [ ] Independently reproduce a live operator clickthrough in X1 Studio on Windows without relying solely on CI fixture.
- [ ] Verify a protected **clickable nonproduction preview URL** with actual end-user interaction proof and approved visibility/cost.
- [ ] Produce a shareable 5-minute demo link or screen capture for the October 13 audience; avoid exposing local-only HTTP to the public.
- [ ] Explain truthfully that the demo is a deterministic template compiler, not general AI coding.
- [ ] Validate original locked customer-facing Website Launch Engine visual reference separately; don't overwrite it.

**Demo references:** `docs/X1_EXECUTIVE_DEMO_2026-10-13.md`; https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131952107 and https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131952009.

## Gate B: X1 core runtime and JARVIS Docker (P0)
- [x] Authorized JARVIS-COMMAND machine is online through Remote Desktop Commander.
- [x] Docker daemon 29.8.1 responsive and live X1-related containers listed at 2026-10-11 08:47 EDT.
- [x] Local `http://127.0.0.1:4311/health` returned HTTP 200.
- [x] Read-only discovery identified `sm-code-architect`, `sm-validator`, `sm-orchestrator`, `sm-control-plane`, staging and other role containers.
- [ ] Determine the authoritative supervisor, exact lease owner and Docker Compose project.
- [ ] Resolve two `sm-estate-reconciler` containers (one prefixed `9829a1c2601f_`) **only after** proving duplicate ownership and defining rollback. Do not blindly stop containers.
- [ ] Inventory actual health/logs and code-runner isolation boundaries without printing secrets.
- [ ] Harden local mutation endpoints with authenticated operator identity and least-privilege role checks.
- [ ] Run unauthorized caller, replay, tenant crossover, idempotency and cancellation negative tests.
- [ ] Bind existing JARVIS/Docker authority to current private X1 source and staging leases, retaining one heartbeat.
- [ ] Prove Docker worker produces actual app files/build/test receipts, not only a `BUILD_PACKET.json`.
- [ ] Reconcile the original `x1_work_queue`, `x1_task_leases`, `x1_execution_ledger`, `x1_audit_receipts` in staging `uvdkzsbjackpjvpoxtyk`. No new parallel queue.

## Gate C: GPT-to-X1 autonomous coding (highest product P0)
- [ ] Authenticate GPT-facing command gateway, require human/tenant role and scope, reject forged job submissions.
- [ ] Convert one chat instruction into a reviewed, versioned, immutable mission manifest.
- [ ] Dispatch to a **single** existing X1 staging queue with idempotency key, lease and fencing token.
- [ ] Allocate a short-lived, least-privilege container/worktree, network limits, memory and cost envelope.
- [ ] Bind permitted model routing using existing Vercel AI Gateway without exposing or changing credentials.
- [ ] Generate new source files for a prompt not already covered by a deterministic scaffold.
- [ ] Run dependency install, lint/typecheck/build/tests on those changed files.
- [ ] Repair failure using bounded retries and preserve before/after diff and root-cause record.
- [ ] Independent validator on separate identity/container reviews exact source, browser functionality and negative security cases.
- [ ] Publish only a protected preview after gated approval, return clickable URL, SHA, evidence, log and rollback.
- [ ] Prove mission persist/resume/cancel after ChatGPT conversation ends and control plane restarts.
- [ ] Run three clean independent end-to-end cycles on the **same** SHA and preview deployment.
- [ ] Prevent any production, paid, DNS, real contact, social or default-branch action without separate explicit scoped approval.

## Gate D: Ten-minute unattended policy (REQUESTED, NOT ACTIVE)
- [ ] Implement idle detection in an authenticated X1 runtime based on last verified operator activity, not inferred ChatGPT typing/online status.
- [ ] Define `operator_idle_after_seconds=600` and re-check operator idle state immediately before transition.
- [ ] Transition **only already-approved, immutable, preview-safe queued jobs** to unattended mode. No blanket authorization for new projects, model spend, secrets, deployments or outbound.
- [ ] Enforce single supervisor and bounded budget/retry/lease/stop policy. Reject duplicate transitions.
- [ ] Check an operator-specific pause/stop/override flag before any job step and on reconnection.
- [ ] Keep objective receipts and a morning continuation summary, not fabricated persistent activity.
- [ ] Verify synthetic timeout transition, cancellation, duplicate heartbeat, lease expiry, restart and replay tests in staging.
- [ ] Obtain scoped operator approval to activate the existing runtime scheduler/idle trigger after all safety tests.
- [ ] Mark activation explicitly with service ID, UTC timestamp, configuration SHA and independently verified test receipts.

**Do not rely on a ChatGPT task/automation to detect 10-minute typing inactivity. Native scheduled tasks cannot poll every 10 minutes (hourly maximum). No unattended Docker coding mode was enabled by this document.**

## Gate E: Chat-first v0-style visual studio
- [x] Basic chat + bounded Instant Estimate section copy edits + preview, inspector and viewport selection.
- [x] Template recommendations from general chat intents, with draft-only semantics.
- [x] Local `Build CRM canary` action creates actual app files and loads a preview in the Studio.
- [ ] Real arbitrary React/Next.js/Vite source editing with saved diffs and visual selection mapped to components.
- [ ] Real responsive design tokens, images, fonts, layouts and drag/reorder edits with undo/redo.
- [ ] Integrate donor `VisualPageEditor.jsx`, `VisualPreview.jsx`, `BuilderEditor.jsx` and `BuilderChat.jsx` through independent APIs without Base44 dependence.
- [ ] Persistent project/chat history and attached artifact references after restart.
- [ ] Show live agent step status, approvals, budgets, failure and independent QA records.
- [ ] QA desktop 1440x900 + mobile 390x844 and explicitly compare locked approved website.
- [ ] Connect optional v0 API **only if** source economics/security/permissions are approved; X1 owns native editor.

## Gate F: Project files and source ingestion/synchronization
- [x] X1 ChatGPT Project has attached authoritative reference files (blueprints, V1/2 ZIPs, research workbooks, design screenshots, `PROJECT_INSTRUCTIONS.md` and `GPT-SYNC-INFO.txt`), visible in Files surface.
- [x] Connected GitHub connector can read and edit private X1 repo development branches.
- [ ] Establish a manifest of Project attachment IDs, titles, timestamps, content hashes, classification, authority, donor branch and approved location.
- [ ] Independently scan/triage attachments for secrets before copying source.
- [ ] Define one-way approved Project inputs -> reviewed X1 source import. The Project folder does **not** currently auto-sync to GitHub.
- [ ] If required, implement authenticated bi-directional synchronization with conflict resolution, signed lineage, user-visible receipts and scoped connector permissions.
- [ ] Prove edits reflect both ways with read-back and negative authorization tests; protect originals and avoid duplication.
- [ ] Map latest `PROJECT_INSTRUCTIONS.md` and approved customer design references into the governance source-of-truth file.

## Gate G: Website launch factory after coding engine ready
- [x] Original `XTREME-SYSTEMS/digital-dominance` preserved as untouched source donor.
- [x] Original approved customer Website Launch Engine reference identified and LOCKED.
- [x] Ten South Florida synthetic market candidates with separate market and preview authorization.
- [ ] Recover real original site generator, `VisualEditor` and 350-site claim using actual deployed reachable URLs and provider receipts.
- [ ] Connect the original lead-generation/estimate form's authentic conversion flow with consent safeguards.
- [ ] Replace any simulated `live` state or fabricated URL in original WebsiteFactory.
- [ ] Deliver original premium industry variants, not generic or visually identical card templates.
- [ ] Demand and market scoring grounded in dated evidence and economics; no fabricated Google rank/CPC.
- [ ] Build 1 -> 10 -> 100 independent preview batches with unique helpful content, verified facts and release approvals.
- [ ] Create tenant-scoped client portal, CRM, onboarding and lead analytics with RLS negative tests.
- [ ] Draft-first social creative and calendar, signed campaign-specific approval for publication.
- [ ] Google Search Console, Analytics, sitemaps, canonical metadata, helpful content and spam-policy checks.
- [ ] Approval-gated Vercel previews and domain/GoDaddy onboarding without automatic spending.

## Gate H: Infrastructure, security and production launch (protected)
- [ ] Inventory and correct RLS-disabled Strategic Intelligence tables using planned, reviewed policies and staging tests.
- [ ] Verify role model platform_admin/tenant_owner/editor/viewer in APIs and database policies.
- [ ] Bind verified, server-side-only secrets and gateway model caps (no Project-file secret ingestion).
- [ ] Reconcile Railway / Vercel / Supabase identities, budgets, deployments and exact SHA without extra workers.
- [ ] Test recovery from crashes, rate limits, DNS errors, browser exceptions and worker loss.
- [ ] Independent security, observability, backup/rollback and accessibility review with actionable receipts.
- [ ] Separate approvals for `main` merges, production deploy, prod DB/RLS, DNS, secrets, paid provisioning and outbound communication.

## State labels
`VERIFIED`: evidence and exact matching source SHA. `PARTIAL`: some exercised routes. `NOT VERIFIED`: no independent proof. `BLOCKED`: security, permission or source conflict. `GATED`: needs operator approval.

**Next instruction in a new chat:** Read `docs/X1_NEW_CHAT_HANDOFF_2026-10-11.md`; reconcile Docker and X1 executor; keep improving a protected clickable demo; never start a new repository, queue or supervisor.

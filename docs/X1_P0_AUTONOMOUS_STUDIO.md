# X1 P0: Autonomous Coding + Manus-Class Execution + v0-Style Studio
Status: **EXECUTION-PRIORITY AND LOCAL STUDIO V1, NOT AUTONOMOUS PARITY**
Canonical project: `Strategic-Minds-AI/X1-OPERATING-SYSTEM` (private).
Development base SHA: `6a4fbb0d85ef8debff52b90b657790ebbaed0f8c`.

## The operator's preferred interface is the product contract
One chat/project interface. **Chat on left, live sandbox preview on right, design mode selectable elements, property inspector, source view, viewport switches, revision diff, task stream, build/error/repair trace and proof receipts.** This is an original implementation reusing owned donor concepts, not a copy of v0's or Base44's proprietary code. Approved Website Launch Engine customer-facing visuals remain LOCKED.

## Real donor reuse
- `XTREME-SYSTEMS/digital-dominance` original `src/components/visual-editor/VisualPreview.jsx` supplies device-aware section-based preview pattern; original `VisualPageEditor.jsx` supplies section inspector + reorder/save contract. Both currently call Base44 entities and must be adapted behind X1 API, **not embedded directly**.
- `src/components/codestudio/BuilderEditor.jsx` supplies code/preview mode; `BuilderChat.jsx` supplies message-history UX but was a *talking guide*, not a real code-writing worker. Do not claim it generated files.
- X1's existing `src/batch-wizard.mjs` and `src/instant-estimate-preview.mjs` implement donor-derived immutable pack sections and local noindex HTML render.
- New local studio `apps/x1-studio/index.html`, `src/studio-kernel.mjs`, and routes in `src/wizard-server.mjs` provide **actual local, deterministic section chat edits, inspector edits, live preview, source inspection** and fail-closed new-app mission drafting. They do not call a paid AI model or start sandbox builds.

## Priority gates in precise order

**P0A: Studio usability** (implemented in safe branch; requires CI and browser QA)
- [x] Integrate chat + full-page preview + section inspector into the existing wizard server, not another system.
- [x] Desktop/tablet/mobile viewport controls and noindex local preview route.
- [x] Constrained natural-language copy edits, inspector edits, hash invalidation of market/preview approvals.
- [x] Read-only generated source view. No arbitrary file edits or unauthenticated execution.
- [ ] Independently click through design mode in a real browser at 1440x900 and 390x844, capture screenshots, inspect accessibility, forms and console.

**P0B: Real autonomous coding engine** (BLOCKED until secure runtime ownership)
- [ ] Identify sole authoritative X1 staging job supervisor and lease owner. Existing JARVIS showed **two** `sm-estate-reconciler` containers; resolve collision, not with another queue.
- [ ] Introduce authenticated tenant-scoped server gateway to existing X1 `x1_work_queue`/leases/ledger/receipts. Never expose localhost control-plane mutation endpoints without auth.
- [ ] Use one isolated permitted workspace/container/VM per job. No unrestricted Docker socket, cross-tenant cookies or static provider keys in agent prompts.
- [ ] Link server-authorized GPT chat missions to a true build agent that writes actual repo files to the approved short-lived worktree.
- [ ] Real compiler: install/test/lint/build (where project permits) with bounded log output, errors and three-retry repair loop.
- [ ] Independent validator in separate sandbox: check source SHA, code tests, backend, redirects/routes, auth/RLS, accessibility, mobile/Desktop visual lock, failures and artifact URLs. Validator cannot be same identity as builder.
- [ ] Artifact proof: real source commit, sandbox/build ID, preview route, logs and signed receipts, **no fabricated successful status**.

**P0C: Manus-class continuity and orchestration**
- [ ] Persistent mission execution between ChatGPT turns with durable checkpoint, lease fencing, retry/backoff and cancellation.
- [ ] Ability to fork child research/code/QA tasks with exact budget/permission envelopes.
- [ ] Live chat transcript and step-by-step browser/terminal activity with real tool provenance and source links.
- [ ] Run a five-mission benchmark suite against documented Manus/v0 behavior and report OBSERVED/INFERRED/UNKNOWN, not arbitrary parity percentage.
- [ ] PAUSE/RESUME/STOP and owner approval for every protected operation.
- [ ] Prove one complete authored application before advertising unattended multiple simultaneous projects.

**P1: Actual v0 API connector (OPTIONAL, explicit economics decision)**
v0 exposes Platform API chat/project/preview generation, including a v2 beta. Research its current privacy, model, pricing and sandbox billing. Prefer X1's native editor and existing Vercel AI Gateway where possible. No v0 API key is bound or billable call authorized by this branch. No dependence on v0 platform for core product ownership.

**P2: Digital Dominance 1→10→100**
After real code-engine evidence and premium visual parity, run useful content/market ranking and validated 1, then 10, then 100 previews. No thin location doorway pages and no ranking promise.

## Acceptance: how operator knows X1 is ready
One user instruction -> persistent authenticated X1 mission ID -> exact source branch/files changed by isolated coding sandbox -> automated build/tests + bounded repair -> separately owned browser/QA proof at 1440x900 / 390x844 -> clickable preview -> owner accepts final release. Show exact cost, state and rollback. None of these phases may be simulated and marked complete.

## Current blockers verified previously
- JARVIS control-plane local heartbeat 200, Docker role containers running, but `build_system` writes a `BUILD_PACKET.json` and README rather than a built app.
- Original validator checks build packet existence and governance flags rather than executing full application QA.
- Two running `sm-estate-reconciler` containers were observed. Existing local control-plane mutation routes have no clear app-layer authorization.
- X1 staging queue historical receipts do not prove a current coding lease.
- Synthetic local Studio is not a customer-hosted app; no Vercel deployment has been authorized; GitHub CI and browser evidence required before PASS.

## Source-of-truth ownership
The X1 canonical private repository remains the sole integration destination. Preserve original factory `XTREME-SYSTEMS/digital-dominance` and other historical donor repos without overwriting their running functions. X1 `main`, secrets, production DB, spending, domains, public posting and customer outbound remain separately approved release operations.

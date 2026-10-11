# X1 OPERATING SYSTEM | OMNISWARM Phase-0 Forensic Dossier
**Strategic Minds AI | Intelligence in Motion | 2026-10-11**
Status: **RESEARCH DRAFT**, not a released application or full competitive test.
Owner: Strategic Minds AI. Approval: unapproved research / branch-safe documentation.
Input OMNISWARM source SHA-256: `0392a896f451f34fdde6e3a474f99bd8a611822cc97e41dd6f2ede5a23a8a3b9`.
Identity decision: **X1 OPERATING SYSTEM** is the corporate command/execution architecture; **Digital Dominance** is its flagship commercial website and lead-generation division.

## Evidence standard
DOCUMENTED = official public specification. OBSERVED = witnessed public browser or connected-provider readback. OPEN_SOURCE = inspected public repo. INFERRED = hypothesis requiring a test. UNKNOWN = no defensible evidence. Do not infer Manus or Genspark proprietary internals from a page.
No login bypass, proprietary copying, real customer data, spending, external messaging, or production changes.

## 1. Manus: task-lifecycle and cloud workflow reference
**DOCUMENTED:** Manus API v2 has asynchronous tasks, multi-turn task messages, projects, files, agents, connectors, skills, event webhooks, and explicit website publication/checkpoints. `task.detail` can distinguish stopped foreground work from ongoing background jobs. Webhook signatures are RSA-SHA256 with a timestamp replay defense. Official per-user API limit currently lists 10 `task.create` per minute. A rate limit is a documented API quota, not proven achievable autonomous task throughput.
**OBSERVED:** Authorized Xtreme Cloud Browser navigated to Manus v2 official docs and enumerated Task Lifecycle, Connectors, Projects, Agents, Website, Webhooks and related headings. Navigation receipt: `rcpt_1791706668202_z0wobm`.
**UNKNOWN:** Private model routing, internal scheduler, sandbox ownership, staffing/agent graph, recovery metrics, per-task margins and competitor test pass rates.
**X1 adaptation:** Immutable mission state, idempotency, scoped approvals, authenticated callback receipts, checkpointed artifacts and real background-job completion checks. Reuse the current X1 queue; never create another task authority.
Sources: https://open.manus.ai/docs/v2/introduction ; https://open.manus.ai/docs/v2/task-lifecycle ; https://open.manus.ai/docs/v2/webhooks-overview ; https://open.manus.ai/docs/v2/webhooks-security ; https://open.manus.ai/docs/v2/rate-limits ; https://open.manus.ai/docs/v2/website

## 2. Genspark: specialist-tool UX and skill reuse
**DOCUMENTED:** Genspark Super Agent describes plan-and-act work and reusable user-taught workflows/skills, with specialized Slides, Sheets, Docs, Code, app integrations and SecondBrain context. Public help materials describe tier/credit restrictions; per-outcome cost is not independently verified.
**OBSERVED:** Browser navigated to Genspark official Super Agent help, detected no CAPTCHA, and enumerated 46 semantic elements including Workflows, Custom Agent, AI Docs/Sheets/Slides, Skills, SecondBrain, GenTeam and integrations. Browser receipt: `rcpt_1791706722087_xz437q`.
**UNKNOWN:** Underlying agent execution independence, internal orchestration architecture, effective quality, cost per deliverable and proprietary tool internals.
**X1 adaptation:** One sentence -> completed, useful artifact; visible milestones; reusable skill/workflow catalog; durable institutional context; multiple actual specialist calls only when independently verified.
Sources: https://www.genspark.ai/helpcenter/super-agent ; https://mufg.genspark.ai/helpcenter/membership-plans

## 3. OpenClaw: publicly inspectable executor candidate
**OPEN_SOURCE / DOCUMENTED:** `openclaw/openclaw` includes a gateway runbook for long-running process, RPC, channels and HTTP/OpenAI-compatible APIs. It has a documented configurable sandbox; default sandbox mode is **off**, scope **agent**, default backend **docker**. Gateway remains on host while enabled sandboxing isolates eligible tools, not every component. The repo LICENSE is MIT with copyright notice-retention obligations.
**X1 decision:** Option **B**: evaluate OpenClaw as a least-privilege adapter *under* X1, never a competing supervisor/queue. Require test of session/tenant containment, tool allowlists, host escape boundaries, outbound networking, operator approval flow, concurrency and cost before deployment.
**UNKNOWN:** X1/OpenClaw interoperability, independent failover, real enterprise isolation and commercial operating cost. No OpenClaw gateway was installed or provisioned.
Sources: https://github.com/openclaw/openclaw ; https://github.com/openclaw/openclaw/blob/main/LICENSE ; https://github.com/openclaw/openclaw/blob/main/docs/gateway/index.md ; https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing/modes-scope-and-backend.md

## 4. Current Strategic Minds execution reality (live READ evidence)
| Component | Verified evidence | Decision |
|---|---|---|
| Integration repo | `Strategic-Minds-AI/digital-dominance-os` private; feature branch pre-write SHA `ab9f1167d2a5d79be112f77d5c99da7b0c7586b7`; mission/Council draft modules and offline tests; 2 successful bootstrap Actions runs | PRESERVE + CONNECT; no production claim |
| Original factory | `XTREME-SYSTEMS/digital-dominance` private; main SHA `97cb8c6b78e876797e326bc4874893aa3066680f` | PRESERVE and audit parity before extracting |
| Staging X1 DB | Supabase `uvdkzsbjackpjvpoxtyk` ACTIVE_HEALTHY; SQL grouped queue: COMPLETED 36, BLOCKED 16, DEAD_LETTER 20; no READY/RUNNING statuses | REPAIR/authenticate one worker, do not create new queue/cron |
| Strategic Intelligence DB | SQL `relrowsecurity=false` on `agent_secret`, `client_tasks`, `onboarding_clients`, `swarm_tasks` | SECURITY BLOCK: determine API grants/exposure and independently design RLS before sensitive production access |
| JARVIS | `JARVIS-COMMAND` online; authorized archive accessible | CONNECT only after scoped sandbox canary |
| Browser | Xtreme Cloud Browser engine 3.1.0 healthy; public semantic browser observations succeeded | QA lane partly usable |
| Browser screenshot | Screenshot request failed: `BLOB_READ_WRITE_TOKEN` missing for storage | BLOCKED; no screenshot or 3-pass visual evidence |
| Railway | Projects including X1 AI Hub Production, APEX Command, Strategic Sandbox and Website Factory Canary exist | Services/leases still require fresh proof |
| SwarmNexus archive | Local `34_SWARM_SYSTEM/98_IMPORTED_DOWNLOADS/2026-10-10` has architecture/workflow/agent/memory files; architecture explicitly describes single-model simulated specialist roles | EXTRACT prompt/workflow templates only, not proof of independently running swarm |
| Approved visual | `https://website-launch-engine-xps.vercel.app/` is the locked operator-approved visual reference | PRESERVE; full backend/3-pass QA still unverified here |

Existing `src/council.mjs` accepts a caller-supplied independence flag. It is useful validation scaffolding, not cryptographic proof that reviews came from separately executing models. Cross-tenant privileges and source provenance need enforcement on the server side.

**Exclusion:** Do not inspect, mutate, migrate or run on BE_NEAR_ME source, files or deployment. Other donor documents mentioning it are not authorization.

## 5. Target integrated execution path
```text
Operator GPT / Client Eden
  -> authenticated identity, consent, tenant scope
  -> Vision Cortex evidence and genuinely separate peer review
  -> typed WorkPacket (immutable source SHA, budget, idempotency, approvals)
  -> ONE existing X1 queue/lease/supervisor
  -> approved JARVIS/Railway isolated executor
  -> original Digital Dominance generator wrapped behind provider-neutral adapter
  -> verifiable branch build and Vercel preview
  -> independent Cloud Browser + Fault Line / Guardian review
  -> 3 complete PASS runs at 1440x900 and 390x844 on same SHA/deployment
  -> explicit operator release gate
  -> tenant client portal, useful-content SEO/AEO/GEO and revenue attribution
```
Source/authority order: current operator decision -> approved visual/spec -> current runtime receipts -> immutable GitHub SHA -> existing Supabase queue -> Drive and historical donors -> inference. Design remains Brand B / Design 2 / Workflow C. Never replicate thin geo doorway pages.

## 6. Mandatory benchmark suite: NOT RUN
Comparable authorized synthetic cases (results all NOT RUN): vague app prompt, reliable-source research, document/spreadsheet artifact, website lead form, tenant login/persistence, multi-step public browser journey, chat-close continuation, injected worker failure, code rollback, independent QA, genuinely separate specialist workers, adversarial prompt injection, refusal of unauthorized action, hard spend cap, durable memory on resume. Metrics: functional correctness, time, actual model+compute cost, actions/interventions, errors, time to recover, audit evidence, threat failures and UX. No product scored above competitors without identical executable tests and receipts.

## 7. Security, cost and roadmap
**P0:** (a) resolve X1 queue authorization and single-supervisor live worker; (b) inspect sensitive table grants/exposure without modifying prod RLS; (c) fix evidence-storage route under secrets custodian only with approval; (d) establish one real isolated synthetic website build end to end.
**P1:** bridge scoped GPT/Eden intake, original generator, typed deployment artifacts, signed Council review identity and independent 3-pass QA. No nonproduction branch auto-promotion.
**P2:** tenant portal and revenue attribution, social drafts with approval, support and retention; then measured 1->10->100 scale.
Default unauthorized new external spend is **zero**; actual token/compute cost may not be zero and is UNKNOWN until provider billing receipts are read. Cost per successful validated build = actual model + worker/browser + retries + QA + storage/deploy + allocated support. Use only grounded lead/conversion economics. No fixed profit/price/rank projections.

## 8. Actual work packets and gate
A: Official-competitor evidence collection. B: Browser semantic flow mapping and screenshot-storage repair proposal. C: X1-only supervisor/typed contract. D: donor classification and hash lineage. E: staging auth and RLS/security audit. F: independent attributable Council decisions. G: one useful paid-value funnel/client journey with tracked attribution. H: synthetic real code sandbox + browser/QA separate validator.
All dispatches require actual independently running workers/receipts; the above is a plan and research record, not a claimed live swarm.

## Receipt
Read-only public research + private authenticated source/DB inspection completed. Branch research file write planned; no production modification, client communication, new worker, secret change or spending. SOURCE baseline `ab9f1167d2a5d79be112f77d5c99da7b0c7586b7`. Bootstrap CI successful at that previous SHA; no build/E2E tests for newly written research. Rollback = revert this isolated documentation commit only. Screenshot and competitor execution benchmarks BLOCKED/NOT RUN. NEXT = trace X1 staging auth/leases and one worker canary; separately inspect RLS exposure before any client-data write.
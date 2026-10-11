# X1 | End-to-End Master Mission Checklist

**Demo target:** 2026-10-13  |  **Canonical codebase:** private `Strategic-Minds-AI/X1-OPERATING-SYSTEM`  |  **Source:** `data/x1-master-checklist.json`

**Rules:** A checkmark records a task acknowledgment, NOT independent QA. A task is VERIFIED only when a matching source SHA, actual result and independent proof are attached. Checklist checkboxes in the Studio browser are local to that device until an authenticated durable backend exists. Original repositories/assets/design are not overwritten. No automatic production, billing, DNS, mass SEO publication, secrets or customer outbound.

## Priority 0 | Critical path for October 13

1. Demonstrate source-generated client CRM and real browser controls against latest commit.
2. Fix/mobile-review screenshot, accessible nav and actual operator demo path.
3. Reconcile existing X1 heartbeat and secure the current control plane, do NOT make duplicates.
4. Attach actual isolated code-writing worker via existing staging X1 job queue, fenced lease and bounded cost.
5. Demonstrate automatic TEST -> REPAIR -> independent QA with real source SHA, artifact URL and rollback.
6. Enable idle eligibility exactly after 600 seconds of **authenticated operator inactivity**, *only after* back-end worker gates pass. Local Studio may run only an allowlisted synthetic build while its browser remains open.

## Current proof
- **SRC-01** [VERIFIED_AT_PRIOR_SHA]: Canonical private X1 repository confirmed; [prior evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM). Must revalidate at HEAD.
- **SRC-02** [VERIFIED_AT_PRIOR_SHA]: Template registry installed; [prior evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38130259927). Must revalidate at HEAD.
- **CAN-01** [VERIFIED_AT_PRIOR_SHA]: Real source-generating synthetic CRM canary; [prior evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131487528). Must revalidate at HEAD.
- **CAN-02** [VERIFIED_AT_PRIOR_SHA]: Separate static validation of generated artifact; [prior evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131487528). Must revalidate at HEAD.
- **CAN-03** [VERIFIED_AT_PRIOR_SHA]: Desktop and mobile evidence artifacts; [prior evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131487528). Must revalidate at HEAD.

## Operator checklist (all 79 work items)

### Verified Historical Evidence (5)

- [ ] **SRC-01** Canonical private X1 repository confirmed (`P0`, VERIFIED_AT_PRIOR_SHA)  
  - PASS means: Source repository private in GitHub; main unchanged
  - [Previous evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM)
- [ ] **SRC-02** Template registry installed (`P0`, VERIFIED_AT_PRIOR_SHA)  
  - PASS means: 97 machine-listed template documents and 100 research candidate niches have CI evidence
  - [Previous evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38130259927)
- [ ] **CAN-01** Real source-generating synthetic CRM canary (`P0`, VERIFIED_AT_PRIOR_SHA)  
  - PASS means: Source compiler emits HTML, CSS, JS and SHA-256 manifest on ephemeral CI runner
  - [Previous evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131487528)
- [ ] **CAN-02** Separate static validation of generated artifact (`P0`, VERIFIED_AT_PRIOR_SHA)  
  - PASS means: Second CI runner verifies exact generated file hashes and 23 static release-safety checks
  - [Previous evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131487528)
- [ ] **CAN-03** Desktop and mobile evidence artifacts (`P0`, VERIFIED_AT_PRIOR_SHA)  
  - PASS means: Chromium captured desktop 1440x900 and mobile 390x844 images, not yet approved as premium visual parity
  - [Previous evidence](https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/38131487528)

### Foundation & Governance (6)

- [ ] **SRC-03** Preserve old donor repositories and rollback SHAs (`P0`, TODO)  
  - PASS means: Show Git hashes for original factory and all migrations before refactoring
- [ ] **SRC-04** Freeze canonical X1 module ownership map (`P0`, TODO)  
  - PASS means: One repo destination; assign original generator, editor, adapters, QA and client module owners
- [ ] **SRC-05** Create reproducible dev workstation setup (`P0`, TODO)  
  - PASS means: Authorized JARVIS host checkout, Node setup, exact branch and local preview instructions
- [ ] **SRC-06** Protect main branch and production gates (`P0`, TODO)  
  - PASS means: No default branch merge, deployment, secrets or budget changes without owner approval
- [ ] **SRC-07** Verify source and screenshot provenance (`P0`, TODO)  
  - PASS means: Commit SHA, CI job IDs, screenshot hashes and independent reviewers on same artifact
- [ ] **SRC-08** Create automated dependency and secret scan (`P1`, TODO)  
  - PASS means: CI logs for provider credentials, licenses and vulnerability inventory

### Autonomous Coding Execution (9)

- [ ] **COD-01** Replace build-packet-only worker with actual source-writing executor (`P0`, TODO)  
  - PASS means: Existing X1 lease produces modified worktree/files, not a pretend build receipt
- [ ] **COD-02** Create per-job isolated disposable coding workspace (`P0`, TODO)  
  - PASS means: No cross-tenant filesystem access; no host Docker socket or unrestricted keys
- [ ] **COD-03** Version source-writing mission contract (`P0`, TODO)  
  - PASS means: Pinned repo/ref, acceptance tests, allowlisted paths, token budget, explicit outcome
- [ ] **COD-04** Add compilation and actual application smoke test (`P0`, TODO)  
  - PASS means: npm install/build/test in sandbox with exit code and captured logs
- [ ] **COD-05** Add bounded automatic repair loop (`P0`, TODO)  
  - PASS means: Reproduce, modify only failing layer, max 3 attempts, preserve diffs and receipts
- [ ] **COD-06** Support browser and API work through authorized tools (`P1`, TODO)  
  - PASS means: Allowlist browser navigation, form actions, API calls, immutable audit references
- [ ] **COD-07** Return preview artifact and exact repository commit (`P0`, TODO)  
  - PASS means: A real testable URL or authenticated preview artifact, not a simulated URL
- [ ] **COD-08** Build a second unrelated app from natural-language chat (`P0`, TODO)  
  - PASS means: Prove not only fixed synthetic CRM-template compilation
- [ ] **COD-09** Parallel sandbox concurrency with quota controls (`P1`, TODO)  
  - PASS means: 2 isolated jobs, fenced leases, fair scheduling, no credential leakage

### X1 Runtime, Queue & Continuity (11)

- [ ] **RUN-01** Reconcile duplicate estate-reconciler containers (`P0`, TODO)  
  - PASS means: Demonstrate one authoritative supervisor and zero competing lease owners
- [ ] **RUN-02** Inventory existing X1 staging queue and roles (`P0`, TODO)  
  - PASS means: Real schema/lease fields, heartbeat owner, job routing and source SHA
- [ ] **RUN-03** Authenticate X1 local control plane mutations (`P0`, TODO)  
  - PASS means: Scoped service identity, tenant enforcement and denied anonymous cross-tenant writes
- [ ] **RUN-04** Connect sandbox to existing X1 work queue (`P0`, TODO)  
  - PASS means: One idempotent staging job claimed and acknowledged by the real executor
- [ ] **RUN-05** Durable pause/resume/checkpoint across browser shutdown (`P0`, TODO)  
  - PASS means: Mission continues after browser closes with independent queue receipts
- [ ] **RUN-06** Implement idle operator-presence event contract (`P0`, TODO)  
  - PASS means: Server-trusted authenticated last-active event; not a guess based on ChatGPT silence
- [ ] **RUN-07** Implement exactly 10-minute idle eligibility (`P0`, TODO)  
  - PASS means: No operator interaction for 600 seconds with replay and clock-skew tests
- [ ] **RUN-08** Lease-aware safe-only unattended work selection (`P0`, TODO)  
  - PASS means: Approved branch-safe queued jobs only; protected actions stop and request consent
- [ ] **RUN-09** Recover from worker restart, lease timeout and duplicate claims (`P0`, TODO)  
  - PASS means: Fencing tokens; no duplicate deployments, spending or client contact
- [ ] **RUN-10** Add 24/7 reconciler health and dead-letter reporting (`P1`, TODO)  
  - PASS means: Use existing heartbeat and alert on missing worker without adding duplicate cron
- [ ] **RUN-11** Prove unattended offline handoff (`P0`, TODO)  
  - PASS means: Close browser, wait >10m, verify queued approved job proceeds with proof receipts

### Chat & Visual Builder (9)

- [ ] **UI-01** Verify chat/preview side-by-side baseline (`P0`, TODO)  
  - PASS means: Live user instructions + preview toggles, screenshot checks on current commit
- [ ] **UI-02** Make full-page design mode truly editable (`P0`, TODO)  
  - PASS means: Select real DOM section, adjust properties and persist versioned source changes
- [ ] **UI-03** Add source diff and version history (`P0`, TODO)  
  - PASS means: Compare old/new files, undo/redo/restore by commit without regenerating approved design
- [ ] **UI-04** Add console, build and agent task streams (`P0`, TODO)  
  - PASS means: Show actual logs and stderr with source/job IDs, not animated fake agents
- [ ] **UI-05** Add template selection inside conversation (`P0`, TODO)  
  - PASS means: Suggest actual registry entries and accept operator selection/edits
- [ ] **UI-06** Persist multi-device projects and sessions (`P1`, TODO)  
  - PASS means: Authenticated sessions survive refresh/login and work from phone
- [ ] **UI-07** Desktop 1440 and mobile 390 Studio interaction tests (`P0`, TODO)  
  - PASS means: True clicking/navigation/keyboard screenshot evidence at same SHA
- [ ] **UI-08** Improve mobile command-center navigation (`P0`, TODO)  
  - PASS means: No awkward wraps/overflow; readable menu and active states
- [ ] **UI-09** Preserve locked Website Launch Engine visual language (`P0`, TODO)  
  - PASS means: Reference screenshots vs actual composed website and operator check

### Universal Template and Knowledge System (6)

- [ ] **LIB-01** Promote template catalog to versioned executable contracts (`P1`, TODO)  
  - PASS means: Validated inputs, preview generator key, permissions and acceptance tests per template
- [ ] **LIB-02** Validate original donor prompts and 42 capabilities (`P1`, TODO)  
  - PASS means: Map actual implementations; remove placeholders and inactive fake statuses
- [ ] **LIB-03** Verify 50 engineering prompt library and 52-category taxonomy (`P1`, TODO)  
  - PASS means: Read exact donor hash and classify source-derived vs generated items
- [ ] **LIB-04** Attach business brand/site/agent packs to editor (`P1`, TODO)  
  - PASS means: Immutable pack versions, rights and preview-only import path
- [ ] **LIB-05** Ensure full document/checklist generation and receipts (`P0`, TODO)  
  - PASS means: Every new project gets intake, spec, QA, approval, rollback and owner tasks
- [ ] **LIB-06** Create real reusable template for second app family (`P0`, TODO)  
  - PASS means: A proven non-CRM app with distinct user flows and independently green CI

### Independent Testing & Security (8)

- [ ] **QA-01** Run full independent Chrome flow for CRM canary (`P0`, TODO)  
  - PASS means: Add/search/filter/advance/export/reset real DOM test and artifacts at current SHA
- [ ] **QA-02** Three consecutive passing browser/QA rounds on one SHA (`P0`, TODO)  
  - PASS means: Same code/version and independent validator ID; reject stale screenshots
- [ ] **QA-03** Enforce negative tenant auth and RLS tests (`P0`, TODO)  
  - PASS means: Anonymous and cross-tenant read/write attempts fail at every layer
- [ ] **QA-04** Harden localhost against DNS rebinding/CSRF (`P0`, TODO)  
  - PASS means: Host allowlist, origin enforcement, restricted paths and authentication as appropriate
- [ ] **QA-05** Validate supply chain and third-party asset licenses (`P0`, TODO)  
  - PASS means: No copied proprietary editor code or unlicensed visual assets
- [ ] **QA-06** Independent accessibility keyboard/screen reader checks (`P0`, TODO)  
  - PASS means: WCAG-oriented contrast, focus targets, semantics and mobile performance
- [ ] **QA-07** Capture signed execution receipt and rollback proof (`P0`, TODO)  
  - PASS means: Immutable manifest, exact SHA, validator run, artifact hash, operator receipt
- [ ] **QA-08** Test forbidden production operations fail closed (`P0`, TODO)  
  - PASS means: No DNS, spend, real client SMS/email/social, production data from unattended mode

### Digital Dominance Site Factory (8)

- [ ] **DD-01** Reconcile original 350-site claim with live evidence (`P1`, TODO)  
  - PASS means: Reachable URLs, routing, real deployment IDs, no configured-record substitution
- [ ] **DD-02** Extract original generator/visual editor from Base44 dependencies (`P0`, TODO)  
  - PASS means: Reuse working logic behind native provider-neutral X1 adapter
- [ ] **DD-03** Restore 20 full-page premium industry templates (`P1`, TODO)  
  - PASS means: Distinct compositions/assets, readability and licensed photography
- [ ] **DD-04** Make Industry → Template → Quantity workflow functional (`P1`, TODO)  
  - PASS means: Choose full-page design and amount, propose credible market list
- [ ] **DD-05** Research and score target markets factually (`P1`, TODO)  
  - PASS means: Dated intent, competition, buyer economics, uncertainty and source list
- [ ] **DD-06** Run 1 then 10 independently verified preview builds (`P1`, TODO)  
  - PASS means: Real preview URLs, functional leads, screenshot receipts, approval-first
- [ ] **DD-07** Review scaled SEO useful content and location policy (`P1`, TODO)  
  - PASS means: No thin doorway city clones, false office locations or ranking promises
- [ ] **DD-08** Enable approved release and monitoring pipeline (`P2`, TODO)  
  - PASS means: Only scoped operator approval; rollback, telemetry and actual URL evidence

### Client Business OS (5)

- [ ] **CL-01** Eden Skye onboarding spec and consent (`P1`, TODO)  
  - PASS means: Accessible conversational intake and explicit consent evidence
- [ ] **CL-02** Tenant-authenticated client portal and CRM (`P1`, TODO)  
  - PASS means: Own leads/projects/sites only; tested role boundaries
- [ ] **CL-03** Lead inbox source and conversion attribution (`P1`, TODO)  
  - PASS means: Synthetic first, real providers after consent and security approval
- [ ] **CL-04** Client content and website approval portal (`P1`, TODO)  
  - PASS means: Immutable approvals tied to changes and actual preview versions
- [ ] **CL-05** Client support, notifications and handoff (`P2`, TODO)  
  - PASS means: Draft-first outbound, opt-in channels, auditable delivery receipt

### Social, SEO, Analytics and Business Growth (5)

- [ ] **GROW-01** Original 30-day social campaign draft pipeline (`P1`, TODO)  
  - PASS means: Approved brand rules, image/video rights and scheduled draft receipts
- [ ] **GROW-02** Immutable content campaign sign-off (`P1`, TODO)  
  - PASS means: Signed channels, media hashes, cadence and bounded duration
- [ ] **GROW-03** Separate protected outbound publishing authority (`P2`, TODO)  
  - PASS means: Real publication/replies/DMs gated, no inherited blanket consent
- [ ] **GROW-04** SEO/AEO/GEO truthful content operations (`P1`, TODO)  
  - PASS means: Original helpful content, fact verification, search-console outcomes
- [ ] **GROW-05** Evidence-based lead/revenue measurement (`P1`, TODO)  
  - PASS means: Analytics attribution, real events, risk-adjusted ROI, no invented results

### Executive Demo | October 13 (7)

- [ ] **DEMO-01** Ensure exact current X1 CI passes (`P0`, TODO)  
  - PASS means: Current branch commit with unit+build+independent QA all green
- [ ] **DEMO-02** Prove presentation user journey live (`P0`, TODO)  
  - PASS means: Chat prompt -> template -> Build CRM canary -> real preview -> add/search/filter/export/reset
- [ ] **DEMO-03** Capture desktop/mobile executive screenshots (`P0`, TODO)  
  - PASS means: Current branch, clean mobile nav and no horizontal overflow
- [ ] **DEMO-04** Package the evidence dashboard (`P0`, TODO)  
  - PASS means: Source archive, CI artifacts, independent receipt, rollback and video-ready script
- [ ] **DEMO-05** Prepare a five-minute boss-facing demo script (`P0`, TODO)  
  - PASS means: Clear distinction: template-based self-build proven; general autonomy remains gated
- [ ] **DEMO-06** Ensure safe fallback if internet/worker is unavailable (`P0`, TODO)  
  - PASS means: Local browser preview with synthetic data and pre-verified artifacts
- [ ] **DEMO-07** Final owner visual acceptance (`P0`, TODO)  
  - PASS means: Review screenshot/UX and explicitly approve any public presentation deployment

## 10-minute idle autonomy: release gates

**Safe local mode:** Browser-open event observer watches pointer/keyboard activity and may launch one **allowlisted synthetic CRM canary compilation plus local static preflight** when 600 seconds expire. It has no general coding capability, no active background process when the tab/browser is closed, no production permissions and no paid model routing.

**True unattended mode (BLOCKED):** Requires authenticated cross-device operator-presence events, one existing X1 authoritative queue/heartbeat, scoped signed job leases, existing secure coding executor, budget cap and idempotency, branch-only file writes, separate independent QA, explicit gates for production and external actions. Do not mark it operational without browser-closed overnight receipt evidence.

**If operator doesn't respond:** Continue only explicitly authorized `safe_branch`/`synthetic` work from immutable approved mission packets. Pause/deny: production deploy, default merge, DNS, domain buying, spending, secrets, permissions, RLS/prod database, real SMS/email, social posting/replies, destructive operations and unknown tasks.

**Rollback:** reset branch changes to parent commit in X1 dev and keep original production baseline untouched. No automated rollback outside tested authorized staging work.

## Source and visual acceptance
- Preserve locked public reference `https://website-launch-engine-xps.vercel.app/` and original Digital Dominance generation source.
- For all material design changes: exact 1440x900 and 390x844 screenshots, keyboard/navigation tests, independent reviewer and explicit visual approval.
- Do not confuse a screenshot, build packet, queued record or inactive city record with a live customer-ready system.

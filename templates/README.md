# X1 Universal Template Library

**Canonical location:** This private X1 repository. No new app, queue, worker, secret store, Supabase project, or template repository was created.

## What is installed

**97 complete, individually versioned starter documents** in `templates/library/{family}/{template-id}.md`:
- App (12): client CRM, onboarding, portals, SaaS, PWA, commerce, analytics, marketplaces, chat and estimators.
- Website (20): industry-specific **design briefs**, not 20 independently approved full-page compositions.
- Agent (9): orchestrator, coder, independent QA, researcher, design, SEO, social, support, security.
- Automation (10): coding loop, preview batch, QA, SEO, social drafts, leads, handoff, repair, research and intake.
- Documents (16): PRD, architecture, scope, contracts, onboarding, runbooks, provenance, QA, handoff and receipts.
- Brand (4): logo, brand, web and media briefs.
- Growth (5): lead attribution, market scoring, profitability, editorial and campaigns.
- Validation (7): browser, visual lock, tenant RLS, security, build, Google spam and sandbox isolation.
- Integration (8): authenticated GPT/X1, Supabase, GitHub, Vercel, Railway, Google, GoDaddy and communications.
- Operations (6): singleton supervisor, receipt ledger, roles, rollback, approval and health.

**100 service labels** in `templates/research/top100-service-candidates.json`: operator's 2026-10-06 provisional portfolio. They are NOT 100 independently researched markets, websites, designs or authorized deployments. Regulated categories have a separate advisory flag, not a substitute for compliance review.

## Operator path: choose instead of configure

1. Open the local X1 Studio `http://127.0.0.1:4391/studio`, select **Templates**, or navigate directly to `http://127.0.0.1:4391/templates`.
2. Filter by family or search. Pick one template and describe the objective in one textarea.
3. Select **Create editable project brief**. A versioned Markdown draft downloads with a list of outstanding intake fields and QA/release gates.
4. Complete missing fields from trusted business source material, preserving source SHA and tenant scope.
5. When a real authenticated X1 coding executor is available, a governed agent may turn the reviewed spec into a sandbox job. **Not supported yet by this code.**
6. Independently test at desktop 1440x900 and mobile 390x844 before any preview or release claim. Approval remains separate.

The template API is **local loopback only**:
- `GET /api/templates`, optional `?family=app&q=CRM`: 97 entries and honest readiness metadata.
- `GET /api/templates/docs/<id>`: corresponding committed Markdown source.
- `POST /api/templates/draft` with JSON `{"id":"app-client-crm","values":{"objective":"Make a client lead inbox"}}`: deterministic draft receipt and filled Markdown document, **not a job dispatch**.

## Source of truth, reuse and priority

The original private `XTREME-SYSTEMS/digital-dominance` donor was read at SHA `692a4b6774c5913569b8a1097d3f30937b4332cd`. This library adapts organization and field contracts from `base44/shared/builderLibrary.ts` (42 capabilities), `engineeringPromptLibrary.ts` (50 prompts), `pipelinePromptLibrary.ts` (52 categories), `agentTaxonomy.ts`, `universalBenchmarkPacks.ts` and `packDesignConstitution.ts`. Donor libraries are source catalogues, **not proof that their defined generators or agents currently run**. No Base44 SDK code was copied into X1.

The approved Website Launch Engine baseline remains `https://website-launch-engine-xps.vercel.app/`. Its Instant Estimate design and industry imagery remain visually locked. These 20 industry brief records do not authorize replacement with generic cards or gradients. The highest priority is still **real autonomous coding + Manus-grade durable sandboxes + v0-style visual editor**, not flooding Google with thin sites.

## How to extend

Edit `templates/catalog.json` with a unique stable ID, supported family, version, required intake, deliverables, evidence gates, donor source and truthful `DOCUMENTED_NOT_EXECUTED` readiness. Add the matching `templates/library/<family>/<id>.md`, with actual instructions and QA steps. Tests fail when an ID, document, intake/gate or provenance is missing.

Never mark `VERIFIED` unless independent build, tenant-security, browser/visual evidence and applicable release receipts are attached. No live outreach, billing, DNS, production deployment, RLS or secrets operations through this catalog.

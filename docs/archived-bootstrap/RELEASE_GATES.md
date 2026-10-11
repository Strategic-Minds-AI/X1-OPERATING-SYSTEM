# Protected actions and acceptance

## Always require narrowly scoped operator approval
Production deploy, protected branch merge, domains/DNS, production Supabase RLS/permissions, secrets, paid model usage, payment setup, customer email/SMS/voice/outbound, social publication and replies, remote access to customer systems, destructive actions.

## Safe development scope
Read source, write versioned docs, isolate a development branch, run zero-cost deterministic local tests and preview-only work on an explicitly approved synthetic tenant. All other actions require current verified receipts and actual worker authorization.

## Three-pass UI release contract
Each of **three independent browser sessions** must PASS on the **same deployment ID and source SHA**, inspecting full desktop 1440x900 and mobile 390x844 flows: every intended interactive button, nav route, gallery, forms including invalid input, keyboard/focus, auth/tenant deny checks, security and accessibility, actual test lead capture, isolated fault recovery, rollback and broken state repairs. Reviewer cannot be the producing coder and cannot accept one model role-playing multiple validators.

GitHub CI passing is a **code gate**, not a frontend QA gate. Deployment READY is not visual approval. Do not share a newly labeled working frontend link until the three-pass contract is met, even if a preview returns HTTP 200.

## Completion communication
Branded email, Eden thank-you video and warranty are drafted, then delivered only after verified deployment/receipt, explicit customer-contact authorization, asset rights and operator release approval. No automated "completed" mail from this new repository by default.

## Source and rollback
Every operation includes tenant, principal, mission ID, source SHA, deployment ID where relevant, job/lease owner, cost receipt, test IDs, rollback baseline SHA, decision owner, state and error class.

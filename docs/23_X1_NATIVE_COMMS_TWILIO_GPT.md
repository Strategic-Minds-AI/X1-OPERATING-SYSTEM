# XTREME Communications → X1 | Twilio + GPT native integration

**2026-10-13 | Action class: BRANCH_WRITE | Release: BLOCKED until independent staging evidence**

## Objective and source authority
Port the existing XTREME Communications communications capabilities into the canonical X1 application without creating a new competing communications repo, Base44 runtime, supervisor, scheduler, queue, or Twilio identity.

- Destination: Strategic-Minds-AI/X1-OPERATING-SYSTEMS, branch feature/x1-comms-twilio-gpt-20261013, based on Eden/X1 integration.
- Donor: XTREME-SYSTEMS/xtreme-communications-os, main SHA 35449a7cd0469c65d87c2579dc112df5bd9a4c88; Base44 app 6a9b71a5d35335afb9198950. PRESERVE it, do not mutate.
- Existing Eden source already added to X1; Communications is a separate X1 workspace linked to Eden.
- X1's existing Supabase lease/queue, Railway supervisor and Vercel AI Gateway remain unchanged.
- Source classification: config/x1-comms-migration.json. Never import the whole donor: it has ~444 source files, managed Base44 authentication and functions, customer billing, message storage and live sender controls. Only compatible, reviewed functionality belongs in X1.

## Source observations and limits
Donor records showed one enabled Telnyx provider marked connected, three enabled voice/SMS/MMS routes, and fourteen phone records. The previous operator-provided Twilio number ending 1174 was NOT present in that number inventory, so its Twilio ownership/voice route is not inferred. Donor provider record state does not prove an authenticated Telnyx provider test.
An existing read-only donor function gptTwilio inspects a pinned Twilio account and number; gatewayTwilio has purchase and send actions. The X1 port takes the first and excludes the second until scoped release approvals.

## Implemented (X1 native, no production mutations)
- X1 left navigation **Communications** alongside Eden Skye. Native Next.js UI with overview, multichannel studio, Twilio, GPT Sync and migration panels.
- Readiness: GET /api/comms/readiness, returns only flags named CONFIGURED_NOT_VERIFIED or NOT_CONFIGURED; no provider/tenant secrets or customer records. No "live" claims.
- GPT/tool entry: POST /api/comms/gpt, only in preview with X1_COMMS_MODE=preview, at least 32 characters in X1_COMMS_PREVIEW_TOKEN, and server-pinned X1_COMMS_ALLOWED_TENANT_ID. API requires Authorization: Bearer (server-side) and rejects cross-site Origin, unsupported actions, oversized bodies, missing/invalid token and extra privileged properties. This is INTERNAL preview bearer, not public OAuth or production tenant auth.
- Safe read operations: inspect_connection and inspect_number use pinned Twilio account equality (TWILIO_ACCOUNT_SID must equal separately configured X1_TWILIO_APPROVED_ACCOUNT_SID), pinned number ending 1174, GET-only Twilio REST endpoint, Basic Auth server-side using preferred API key SID + secret or fallback auth token. Fail closed if X1_COMMS_TWILIO_READ_ENABLED is not true, credentials not configured, or ownership/routing mismatch. Provider error messages and credential-bearing webhook paths/queries are redacted.
- Safe draft operations: SMS, MMS, voice call, WhatsApp, email, campaign, number route and Eden handoff. All return status DRAFT_NOT_DISPATCHED, customer_contact_allowed=false, signed_queue_dispatched=false, approval_required=true. No real recipients are contacted by this branch.
- GPT Actions/OpenAPI: GET /api/comms/openapi publishes a deployment-origin-aware OpenAPI 3.1 schema. Only read and draft actions are advertised. A private ChatGPT Action/plugin can import this schema after verified preview host and server token provisioning; existing XTREME Communications MCP is left intact. A schema alone does NOT mean the user's GPT/plugin is connected.
- Local browser Composer generates review packets with no server writes, contacts import or secret access.

## Deployment environment names only
Configure in Vercel Preview *after separate exact secret-target approval*:
- X1_COMMS_MODE=preview.
- X1_COMMS_PREVIEW_TOKEN: strong private 32+ character token, server only, never NEXT_PUBLIC, ideally rotated and scoped per test.
- X1_COMMS_ALLOWED_TENANT_ID: verified staging tenant identity, NEVER client-supplied.
- X1_COMMS_TWILIO_READ_ENABLED=true: explicit on/off read-only Twilio inspection.
- TWILIO_ACCOUNT_SID + X1_TWILIO_APPROVED_ACCOUNT_SID: separately pinned matching account identity, server only.
- TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET (preferred), OR TWILIO_AUTH_TOKEN.
- TELNYX_API_KEY: future approved provider-neutral adapter (NOT read or modified here).

Do not copy secrets from Base44 into Git, request bodies, browser JavaScript, GPT instructions, files, chat, or CI logs. The GitHub secret scanner correctly blocked an initial hardcoded Twilio account SID attempt; the committed port omits it and requires provider-native env binding.

## Activation sequence with exact gates
1. Run npm test and npm run build on the exact branch SHA; independent CI receipt required.
2. Build isolated X1 Avatar Studio preview on existing Vercel project after updating that preview project's branch allowlist; no production domain change.
3. Browser smoke at 1440 and 390 px: X1 nav, Communications tab, sample draft, response/disclosure, API readiness, OpenAPI presence; no phone calls or paid provider actions.
4. After operator approves the exact preview secret target, use secrets custodian to bind X1_COMMS_PREVIEW_TOKEN and pin the authenticated tenant; verify POST rejects unauthorized and returns synthetic drafts.
5. After separate operator approval for real Twilio account inspection, bind account credentials through the provider vault, set read flag, verify exact account and pinned number via GET, inspect existing voice/backup/status callback hosts, and confirm no excluded routing. No changes to voice routes.
6. Bind true X1 tenant auth, roles, consent, idempotency, delivery/opt-out compliance, audit ledger and existing X1 signed work queue. Independent conflict/tenant tests, no second scheduler.
7. Implement separately reviewed Twilio SMS/MMS/voice POST provider adapter, signed Twilio webhook/TwiML, Twilio-specific messaging registrations, opt-out and emergency escalation, controlled sandbox callbacks, per-channel approvals, provider budgets and retries.
8. Register private OpenAPI Action/plugin with ChatGPT only after preview URL, token security and each action are independently verified. Do not claim an installed GPT connector until the registration is observed.
9. Later migrate opt-in inbox, CRM, campaign orchestration, agent voice/video and analytics data following staging RLS and consent review. Retain donor rollback until feature parity.

## Test and release gates
- node --test tests/comms-integration.test.mjs, plus npm run test, npm run build.
- Required negative cases: no bearer, wrong bearer, origin mismatch, cross-site, forbidden send/buy/call, missing tenant, wrong account/number, missing Twilio credentials, masked errors, unsupported provider and media URLs, non-consented live channel.
- No actual call/SMS/MMS/email/WhatsApp/campaign sent or Twilio number purchase.
- No rollback of donor required. Revert or close integration branch for app rollback; restore original dedicated preview's build ignore rule if a preview setting is changed.

## After-preview QA receipt
Mark independent CI, actual Vercel deployment ID, browser navigation and screenshot evidence, outbound provider verification and GPT plugin registration individually PASS/FAIL/BLOCKED/UNKNOWN. A GitHub typecheck PASS is not equal to provider connectivity. Don't turn preview-only UI into a live caller.

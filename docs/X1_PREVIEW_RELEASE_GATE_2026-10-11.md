# X1 staging API | Preview release gate | 2026-10-11

Status: PREVIEW PREPARED; LIVE INTEGRATION NOT ACTIVATED. No production release, no credentials modified.

## Canonical scope
Repository: Strategic-Minds-AI/X1-OPERATING-SYSTEMS
Branch: feature/x1-staging-readonly-api-20261011
App root: apps/strategic-minds-v2
Vercel project: prj_PIDgTashnTCpsWbKUBCjHz55yXqT (x1-operating-system)
Staging Supabase: uvdkzsbjackpjvpoxtyk
Production Supabase: vgsmyhqqtkkluhypxyua (protected)

## Evidence, 2026-10-11
- The branch already has API functions api/x1/health.js and api/x1/operator-status.js and server-only helper server/x1-staging.mjs.
- Preview-only helper rejects non-staging SUPABASE_URL and production runtime, fails closed when credentials are missing, and never returns server credentials.
- Checked live staging metadata for x1_tenants, x1_tenant_memberships, and x1_work_queue: relevant columns and status values agree with the adapter's current GET queries; RLS enabled on these tables.
- Staging x1_tenant_memberships has 0 records. The protected operator-status endpoint cannot yield a successful real authorized read until legitimate Auth user and membership onboarding.
- Commit d67383e7cdb13536fb55fba9eb0e340f45171025 has a successful GitHub frontend-qa check. This is evidence of CI, NOT of current live Auth/queue connectivity.
- Vercel lists multiple READY deployments from this branch, including dpl_9XERfHXUz88vLtZyLjBEhRZjFRN5 with Preview-like target null. One deployment dpl_5hGhfvcXpE1pmdf6AqFwmKAdNYSD is flagged as target=production. Do NOT redeploy or reassign aliases without a scoped release decision.
- The branch-specific Vercel environment-variable lookup yielded no variables; this does NOT by itself prove absence because environment inventories may be partial or separately scoped. Correct Preview staging binding remains UNKNOWN.

## Acceptance / no-go criteria
1. Confirm Vercel project root apps/strategic-minds-v2 for the selected Preview deployment; verify the exact Git SHA and target=preview, not production.
2. Through provider-native protected configuration (requires explicit scoped operator approval), bind Preview-only SUPABASE_URL to https://uvdkzsbjackpjvpoxtyk.supabase.co and appropriate staging-only publishable/anon and server credential references. Never copy or reuse production service credentials. No VITE_ or NEXT_PUBLIC_ prefixes for privileged keys.
3. Confirm Railway staging worker points to staging only. Do not change worker schedules or production bindings.
4. Independently GET /api/x1/health on a specifically identified Preview URL: expect 503 UNBOUND until securely configured, then 200 CONFIGURED_NOT_VALIDATED. HTTP 200 is not a database connection proof.
5. Synthetic unauthorized GET /api/x1/operator-status must return 401; POST must return 405. Ensure function is served as JSON, not SPA HTML/404.
6. Only after approved test operator Auth creation and appropriate scoped x1_tenant_memberships record: verify authenticated tenant-scoped GET against staging, cross-tenant denial, and no corresponding production writes.
7. Run npm run check and independent browser tests on the final SHA; record exact deployment ID, URL, test results, rollback deployment.
8. No production release, default-branch merge, production schema/RLS changes, or new secrets without separate approval.

## Rollback
Revert branch-only commits or discontinue the Preview deployment. Preserve production domains, database, credentials, workers and scheduler untouched.

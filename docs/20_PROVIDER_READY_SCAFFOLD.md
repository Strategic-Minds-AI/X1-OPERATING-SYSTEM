# X1 provider-ready, disabled infrastructure
2026-10-11 branch-only additions:
- `infra/supabase/migrations/20261011_x1_avatar_studio_DRAFT.sql` includes additive multi-tenant identities, assets, consents, sessions and event schema with RLS enabled and NO public policies. It is **not applied**. Verify policies, rights retention and rollback before migrating even staging.
- `services/avatar-renderer/` standalone container + FastAPI health/session contract. Explicitly returns HTTP 503 until auth, consent, GPU/licensed rendering models and signed stream coordination are ready. NOT DEPLOYED.
- `scripts/next-eligible.mjs` deterministically calculates safe next packets from source-controlled mission DAG; writes `artifacts/ci/next-eligible.json`; does not enqueue anything.
- Existing GitHub Actions `quality.yml` writes commit-bound validation receipt and now includes next-eligible plan artifact.
This avoids creating duplicative Supabase/Railway/Vercel resources merely to fill diagrams.

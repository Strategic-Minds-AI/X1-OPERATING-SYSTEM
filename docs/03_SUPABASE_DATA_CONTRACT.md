# X1 Supabase | Existing staging, minimal avatar extensions (migration PLAN ONLY)
Current verified staging project: `uvdkzsbjackpjvpoxtyk`, ACTIVE_HEALTHY. RLS is enabled on existing X1 tables. DO NOT create duplicate tenants/work queues/lease/receipts or apply schema migrations in this work packet.

## Reuse existing authoritative tables
`public.x1_tenants`, `x1_tenant_memberships`, `x1_work_queue`, `x1_task_leases`, `x1_execution_ledger`, `x1_audit_receipts`, `x1_worker_heartbeats`. Verify existing tenant identifier and access via server-authorized claims, not client-supplied tenant IDs.

## Proposed new schema, NOT applied
- `x1_avatar_identities`: identity_uuid, tenant_id, display_name, kind, status(draft|consent_pending|verified|training|ready|suspended|deleted), source_hash, rights_receipt_id, created_by, created_at, model_version.
- `x1_avatar_assets`: asset_uuid, identity_uuid, tenant_id, private_bucket, object_key, sha256, media_kind, metadata, retention_until, created_at.
- `x1_avatar_consents`: consent_uuid, identity_uuid, tenant_id, subject_owner_id, rights_basis, capture_method, scope, expires_at, revoked_at, evidence_key.
- `x1_avatar_training_jobs`: job_uuid, tenant_id, avatar_id, renderer_adapter, idempotency_key unique, status, estimated_cost, approval_ref, artifact_ref, receipt_ref.
- `x1_avatar_live_sessions`: session_uuid, tenant_id, identity_uuid, operator_id, provider_route, started_at, expires_at, stopped_at, status, metering, media_trace_id.
- `x1_avatar_videos`: video_uuid, tenant_id, avatar_id, script_version, renderer, export_key, watermark_flag, approval_status, receipts.
- `x1_voice_profiles`: voice_uuid, tenant_id, consent_ref, provider, model_id, status, asset_keys, enrollment_history.
- `x1_avatar_session_events`: event_uuid, session_uuid, tenant_id, sequence, event_type, emitted_at, metadata; avoid storing raw audio/transcript by default.
- `x1_avatar_cost_events`: tenant, job/session, provider, resource_quantity, billed_cost, budget_ref, timestamp.

## Security invariants
- Every row is tenant-scoped. RLS policy refers to authenticated verified membership, never unaudited user input.
- Private buckets with signed short-lived read access; encryption, purge, revocation and deletion workflow.
- Voice biometric/face-related artifacts require higher retention and consent gates.
- Migrations are additive, idempotent, versioned and reversible in staging first. Service role credentials live only server-side in provider secret store.
- Never store unhashed raw API keys; ensure content-policy and abuse escalation path.
- Validate cross-tenant reads/writes, expired consent, two simultaneous enrollments, at-least-once event handling and revocation.

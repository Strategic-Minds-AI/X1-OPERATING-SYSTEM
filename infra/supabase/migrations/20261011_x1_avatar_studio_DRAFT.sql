-- X1 Avatar Studio additive data-layer proposal.
-- NOT APPLIED. REQUIRES SUPABASE STAGING MIGRATION + RLS REVIEW APPROVAL.
-- Existing tenant tables x1_tenants / x1_tenant_memberships are source truth.
-- No auth-user-facing RLS policies are added in this DRAFT: fail closed by default.

CREATE TABLE IF NOT EXISTS public.x1_avatar_identities (
  avatar_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.x1_tenants(tenant_id),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 140),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','consent_pending','approved','render_ready','suspended','retired')),
  created_by uuid,
  identity_asset_sha256 text
    CHECK (identity_asset_sha256 IS NULL OR identity_asset_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,avatar_id)
);
ALTER TABLE public.x1_avatar_identities ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.x1_avatar_assets (
  asset_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  avatar_id uuid NOT NULL,
  object_key text NOT NULL,
  object_sha256 text NOT NULL CHECK (object_sha256 ~ '^[a-f0-9]{64}$'),
  media_kind text NOT NULL CHECK (media_kind IN ('image','video','audio','model','thumbnail')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id,avatar_id) REFERENCES public.x1_avatar_identities(tenant_id,avatar_id),
  UNIQUE (tenant_id,asset_id)
);
ALTER TABLE public.x1_avatar_assets ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.x1_avatar_consents (
  consent_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  avatar_id uuid NOT NULL,
  subject_reference text NOT NULL,
  evidence_object_key text NOT NULL,
  grant_scope text NOT NULL CHECK (char_length(grant_scope) BETWEEN 5 AND 2000),
  verified_by uuid,
  granted_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  FOREIGN KEY (tenant_id,avatar_id) REFERENCES public.x1_avatar_identities(tenant_id,avatar_id)
);
ALTER TABLE public.x1_avatar_consents ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.x1_avatar_sessions (
  session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  avatar_id uuid NOT NULL,
  initiated_by uuid,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','connecting','active','stopping','closed','failed')),
  media_session_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 minutes',
  closed_at timestamptz,
  FOREIGN KEY (tenant_id,avatar_id) REFERENCES public.x1_avatar_identities(tenant_id,avatar_id),
  UNIQUE (tenant_id,session_id)
);
ALTER TABLE public.x1_avatar_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.x1_avatar_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  session_id uuid NOT NULL,
  sequence_number bigint NOT NULL,
  event_type text NOT NULL CHECK (char_length(event_type) BETWEEN 3 AND 80),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id,session_id) REFERENCES public.x1_avatar_sessions(tenant_id,session_id),
  UNIQUE (session_id,sequence_number)
);
ALTER TABLE public.x1_avatar_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_x1_avatar_identities_tenant
  ON public.x1_avatar_identities(tenant_id,status);
CREATE INDEX IF NOT EXISTS idx_x1_avatar_sessions_tenant
  ON public.x1_avatar_sessions(tenant_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_x1_avatar_events_session
  ON public.x1_avatar_events(session_id,sequence_number);

-- No client privileges/policies created here.
-- Staging-only policy/membership design needs independent RLS test before activation.

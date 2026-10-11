// Donor integration manifest, not an SDK adapter. No network or secrets.
export const PROVIDERS = Object.freeze({
  FACTORY_DONOR: Object.freeze({repository:"XTREME-SYSTEMS/digital-dominance",role:"legacy_generation_chat_visual_editor",bound:false}),
  APPROVED_FRONTEND: Object.freeze({url:"https://website-launch-engine-xps.vercel.app/",role:"visual_baseline_do_not_redesign",bound:false}),
  VISION_CORTEX: Object.freeze({role:"vision_system_dna_council_decisions",bound:false}),
  X1_STAGING: Object.freeze({projectId:"uvdkzsbjackpjvpoxtyk",role:"existing_authoritative_staging_queue",bound:false}),
  JARVIS: Object.freeze({role:"existing_local_control_plane_agents",bound:false}),
  XTREME_CLOUD_BROWSER: Object.freeze({role:"read_authorized_business_sources_and_browser_QA",bound:false}),
  FAULT_LINE: Object.freeze({role:"independent_fault_qa",bound:false}),
  BE_NEAR_ME: Object.freeze({repository:"Strategic-Minds-AI/be-near-me-platform",role:"video_and_media_donor",bound:false}),
  EDEN_SKYE: Object.freeze({role:"eight_step_consent_intake_and_avatar_donor",bound:false}),
  VERCEL: Object.freeze({role:"approved_frontend_preview_and_APIs",bound:false}),
  SUPABASE: Object.freeze({role:"existing_tenant_auth_queue_ledger",bound:false}),
  RAILWAY: Object.freeze({role:"reuse_only_verified_existing_workers",bound:false}),
  OPENCLAW: Object.freeze({role:"candidate_agent_adapter_not_required",bound:false})
});
export function describeIntegration(name) {
  if (!Object.hasOwn(PROVIDERS,name)) throw new Error("UNKNOWN_PROVIDER");
  return Object.freeze({...PROVIDERS[name],status: "NOT_BOUND_IN_THIS_REPO"});
}

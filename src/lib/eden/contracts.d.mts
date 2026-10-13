export type EdenAction =
  | "draft_onboarding"
  | "draft_communications"
  | "draft_commercial_script"
  | "draft_x1_mission"
  | "request_human_handoff";
export type EdenChannel = "web" | "voice" | "sms" | "mms" | "email" | "video" | "internal";
export type EdenDraftInput = { action: EdenAction; channel: EdenChannel; instruction: string };
export declare const EDEN_IDENTITY: Readonly<{
  id: string; display_name: string; owner: string; role: string;
  type: string; disclosure: string; source_identity: string;
  image_status: string; voice_status: string; model_status: string;
}>;
export declare const EDEN_ACTIONS: readonly EdenAction[];
export declare const EDEN_CHANNELS: readonly EdenChannel[];
export declare class EdenContractError extends Error {
  readonly code: string;
  constructor(code: string);
}
export declare function createEdenDraft(input: EdenDraftInput | unknown): Readonly<{
  schema: string; agent_id: string; agent_disclosure: string; source_system: string;
  action: EdenAction; requested_channel: EdenChannel; instruction: string;
  status: string; execution_authorized: false; customer_contact_allowed: false;
  provider_calls_made: 0; queue_enqueued: false; approval_required: true;
  approvals_required: readonly string[]; handoff: string; privacy: string;
}>;
export declare function createEdenReadiness(flags?: {
  gatewayConfigured?: boolean; queueConfigured?: boolean;
  rendererConfigured?: boolean; communicationsConfigured?: boolean;
}): Record<string, unknown>;

/**
 * Eden Skye X1-owned executive-agent contract.
 * Pure logic used in both the operator UI and the protected draft API.
 * No network calls, persistence, scheduling, voice or customer contact.
 */
export const EDEN_IDENTITY = Object.freeze({
  id: "eden-skye",
  display_name: "Eden Skye",
  owner: "Strategic Minds AI",
  role: "X1 executive AI assistant and onboarding host",
  type: "fictional_ai_persona",
  disclosure: "I'm Eden Skye, an AI assistant for Strategic Minds AI.",
  source_identity: "Existing Eden Skye source, subject to identity/asset verification",
  image_status: "AWAITING_APPROVED_SOURCE_ASSET",
  voice_status: "NOT_ENROLLED",
  model_status: "NOT_CONNECTED"
});

export const EDEN_ACTIONS = Object.freeze([
  "draft_onboarding",
  "draft_communications",
  "draft_commercial_script",
  "draft_x1_mission",
  "request_human_handoff"
]);

export const EDEN_CHANNELS = Object.freeze([
  "web", "voice", "sms", "mms", "email", "video", "internal"
]);

export class EdenContractError extends Error {
  constructor(code) {
    super(code);
    this.name = "EdenContractError";
    this.code = code;
  }
}

/** @param {unknown} value */
export function createEdenDraft(value) {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    throw new EdenContractError("INVALID_DRAFT_PAYLOAD");
  }
  const body = /** @type {Record<string, unknown>} */ (value);
  const allowed = new Set(["action", "channel", "instruction"]);
  if (Object.keys(body).some(key => !allowed.has(key))) {
    throw new EdenContractError("UNRECOGNIZED_OR_PRIVILEGED_FIELD");
  }
  if (typeof body.action !== "string" || !EDEN_ACTIONS.includes(body.action)) {
    throw new EdenContractError("ACTION_NOT_ALLOWED");
  }
  if (typeof body.channel !== "string" || !EDEN_CHANNELS.includes(body.channel)) {
    throw new EdenContractError("CHANNEL_NOT_ALLOWED");
  }
  if (typeof body.instruction !== "string") {
    throw new EdenContractError("INSTRUCTION_REQUIRED");
  }
  const instruction = body.instruction.trim();
  if (!instruction || instruction.length > 1600) {
    throw new EdenContractError("INSTRUCTION_LENGTH_INVALID");
  }
  return Object.freeze({
    schema: "x1.eden.work-packet.v1",
    agent_id: EDEN_IDENTITY.id,
    agent_disclosure: EDEN_IDENTITY.disclosure,
    source_system: "x1-operating-system",
    action: body.action,
    requested_channel: body.channel,
    instruction,
    status: "DRAFT_NOT_DISPATCHED",
    execution_authorized: false,
    customer_contact_allowed: false,
    provider_calls_made: 0,
    queue_enqueued: false,
    approval_required: true,
    approvals_required: [
      "x1_authenticated_tenant",
      "operator_action_scope",
      "source_and_consent_validation",
      "independent_execution_gate"
    ],
    handoff: "Existing X1 signed work queue only, after verification",
    privacy: "No local draft persistence or transcript capture"
  });
}

/** @param {{gatewayConfigured?:boolean, queueConfigured?:boolean, rendererConfigured?:boolean, communicationsConfigured?:boolean}=} flags */
export function createEdenReadiness(flags = {}) {
  const configured = value => value === true ? "CONFIGURED_NOT_VERIFIED" : "NOT_CONFIGURED";
  return {
    schema: "x1.eden.readiness.v1",
    name: EDEN_IDENTITY.display_name,
    persona: EDEN_IDENTITY.role,
    disclosure: EDEN_IDENTITY.disclosure,
    stage: "ISOLATED_PREVIEW",
    integration_type: "X1_NATIVE_AGENT",
    identity_source: "MIGRATION_REFERENCE_ONLY",
    base44_runtime_dependency: false,
    features: {
      draft_command: "AVAILABLE_LOCAL",
      x1_signed_queue: configured(flags.queueConfigured),
      ai_gateway: configured(flags.gatewayConfigured),
      avatar_renderer: configured(flags.rendererConfigured),
      communications: configured(flags.communicationsConfigured),
      realtime_conversation: "NOT_VERIFIED",
      external_messages: "BLOCKED",
      autonomous_production_actions: "BLOCKED"
    },
    authorized_session: false,
    production_ready: false,
    instructions: "Use draft mode until authenticated tenant, independent QA, secrets and approved provider routes are bound."
  };
}

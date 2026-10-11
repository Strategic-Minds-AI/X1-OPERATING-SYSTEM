import { createHash } from "node:crypto";

export const OMNISWARM_PACKET_VERSION = "omniswarm-research-packet-v1";

/**
 * Preparation only. Packet creation never starts workers, spends money,
 * changes accounts, or writes to X1. The authenticated X1 owner must separately
 * validate identity, existing lease, permissions, budget and task authorization.
 */
export const RESEARCH_LANES = Object.freeze([
  Object.freeze({ id: "A", name: "Competitive Intelligence", objective: "Manus, Genspark, OpenClaw and evidence-ranked alternatives" }),
  Object.freeze({ id: "B", name: "Browser and Product Forensics", objective: "Authorized public UX journeys, screenshots and interaction evidence" }),
  Object.freeze({ id: "C", name: "Systems Architecture", objective: "Persistent sessions, tools, memory, sandbox and execution contracts" }),
  Object.freeze({ id: "D", name: "Strategic Minds Estate Audit", objective: "Existing X1, JARVIS, donor source, agents and reusable capabilities" }),
  Object.freeze({ id: "E", name: "Security and Reliability", objective: "Duplicate worker ownership, tenant isolation, Fault Line and independent QA" }),
  Object.freeze({ id: "F", name: "Corporate Intelligence and Governance", objective: "Vision Cortex, independently evidenced peer Council and institutional memory" }),
  Object.freeze({ id: "G", name: "Product and Commercial Architecture", objective: "High-value services, onboarding, monetization and financial controls" }),
  Object.freeze({ id: "H", name: "Engineering and Independent Validation", objective: "Safe adapters, tests, clean-room implementation and QA receipts" })
]);

const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export class PacketError extends Error {
  constructor(code) { super(code); this.code = code; }
}
function requireValid(condition, code) {
  if (!condition) throw new PacketError(code);
}

export function createOmniswarmPackets({
  missionId, projectId = "digital-dominance-os",
  sourceRepo = "Strategic-Minds-AI/digital-dominance-os", sourceSha,
  action = "READ", maxCostCents = 0
} = {}) {
  requireValid(typeof missionId === "string" && /^[a-zA-Z0-9_-]{5,100}$/.test(missionId), "MISSION_ID_REQUIRED");
  requireValid(typeof projectId === "string" && /^[a-zA-Z0-9_-]{3,100}$/.test(projectId), "PROJECT_ID_INVALID");
  requireValid(typeof sourceRepo === "string" && /^[\w.-]+\/[\w.-]+$/.test(sourceRepo), "SOURCE_REPO_INVALID");
  requireValid(typeof sourceSha === "string" && /^[a-f0-9]{40}$/.test(sourceSha), "PINNED_SHA_REQUIRED");
  requireValid(action === "READ" || action === "DRAFT", "ACTION_NOT_PERMITTED");
  requireValid(maxCostCents === 0, "UNAPPROVED_COST_NOT_PERMITTED");
  return Object.freeze(RESEARCH_LANES.map(lane => {
    const identity = { version: OMNISWARM_PACKET_VERSION, missionId, projectId, sourceRepo, sourceSha, laneId: lane.id };
    const digest = hash(identity);
    return Object.freeze({
      ...identity, packetId: "omni-" + digest.slice(0, 20),
      idempotencyKey: digest, title: lane.name, objective: lane.objective,
      allowedAction: action, maxCostCents: 0, dispatched: false,
      status: "DRAFT_NOT_DISPATCHED", executorReceipt: null,
      existingX1LeaseVerified: false, noNewQueueOrSupervisor: true,
      requires: Object.freeze(["authenticated_X1_queue_and_lease", "verified_worker_identity", "bounded_execution_scope", "independent_evidence_receipt"]),
      evidence: Object.freeze(["source_url", "observed_at", "confidence_label", "source_sha", "specialist_identity", "artifact_or_test_receipt"]),
      protectedReleaseAuthorized: false, actualIndependentAgentExecutionVerified: false
    });
  }));
}

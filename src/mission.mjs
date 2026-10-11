import {createHash} from "node:crypto";
export const MISSION_VERSION = "ddos-mission-v1";
const risky = new Set(["PRODUCTION_DEPLOY","PRODUCTION_DB","MERGE_MAIN","DNS","SECRETS","BILLING","SOCIAL_PUBLISH","OUTBOUND","REMOTE_CLIENT_ACCESS","DELETE"]);
const types = [
  ["website",/website|landing page|funnel|site\b/i],
  ["app",/\bapp\b|software|saas|platform|portal/i],
  ["agent",/\bagent\b|assistant|chatbot|automation/i],
  ["intelligence",/data|analytics|research|dashboard|intelligence/i],
  ["media",/video|social|creator|content|media/i]
];
function sha(obj){return createHash("sha256").update(JSON.stringify(obj)).digest("hex");}
export class MissionError extends Error{constructor(code){super(code);this.code=code;}}
function must(condition,code){if(!condition)throw new MissionError(code);}
export function draftMission({vision,projectId,sourceSha,sourceRepo="XTREME-SYSTEMS/digital-dominance",action="DRAFT"}={},authority={}){
  must(typeof vision==="string" && vision.trim().length>=12 && vision.trim().length<=2000,"VISION_LENGTH_INVALID");
  must(typeof projectId==="string" && /^[a-zA-Z0-9_-]{3,100}$/.test(projectId),"PROJECT_ID_INVALID");
  must(typeof sourceSha==="string" && /^[a-f0-9]{40}$/.test(sourceSha),"SOURCE_SHA_REQUIRED");
  must(typeof sourceRepo==="string" && /^[\w.-]+\/[\w.-]+$/.test(sourceRepo),"SOURCE_REPOSITORY_INVALID");
  must(authority.principalVerified===true && authority.tenantVerified===true && /^[0-9a-f-]{36}$/.test(authority.tenantId||""),"VERIFIED_TENANT_REQUIRED");
  must(action==="DRAFT","PROTECTED_ACTION_NOT_AUTHORIZED");
  const sanitized=vision.trim().replace(/\s+/g," ");
  const categories=types.filter(([,re])=>re.test(sanitized)).map(([name])=>name);
  const taskType=categories.length?categories[0]:"custom";
  const identity={projectId,tenantId:authority.tenantId,sourceSha,sourceRepo,vision:sanitized,taskType};
  return Object.freeze({
    version:MISSION_VERSION,missionId:"ddos-"+sha(identity).slice(0,20),idempotencyKey:sha(identity),
    status:"DRAFT_REQUIRES_SCOPE_AND_APPROVAL",actionClass:"DRAFT",maxCostCents:0,
    projectId,tenantId:authority.tenantId,sourceSha,sourceRepo,request:sanitized,
    suggestedType:taskType,suggestedCategories:categories,
    approved:false,dispatched:false,deploymentId:null,clientContactAllowed:false,
    needs:["fact_check","scope","acceptance_criteria","cost_estimate","owner_review","verified_existing_queue"],
    instructions:"Treat classification as a suggestion; inspect original working source and canonical tenant permissions before dispatch."
  });
}
export function checkProtectedAction(action){return risky.has(action)?"REQUIRES_OPERATOR_APPROVAL":action==="READ"||action==="DRAFT"?"ELIGIBLE_FOR_SCOPE_CHECK":"BLOCKED_UNKNOWN_ACTION";}

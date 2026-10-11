import {createHash} from "node:crypto";
import {proposeBatch, BatchError} from "./batch-wizard.mjs";

export const STUDIO_PHASES=Object.freeze([
 "PLAN","AUTHORIZE","CODE","BUILD","TEST","REPAIR","INDEPENDENT_QA","PREVIEW","RELEASE_APPROVAL"
]);
export const STUDIO_CAPABILITIES=Object.freeze({
 localVisualEditing:"WORKING_LOCAL_DRAFT",
 localChatCopyEdits:"WORKING_BOUNDED_COMMANDS",
 localHtmlPreview:"WORKING_NOINDEX",
 universalCodeGeneration:"BLOCKED_EXECUTOR_NOT_BOUND",
 x1LeaseExecution:"BLOCKED_AUTH_AND_SINGLE_SUPERVISOR",
 liveTerminal:"NOT_CONNECTED",
 trueV0Service:"NOT_CONNECTED_NO_SPEND",
 independentBrowserValidation:"NOT_VERIFIED",
 productionRelease:"PROTECTED"
});
const SECTION_IDS=new Set(["hero","benefits","process","estimate","faq"]);
const FIELD_IDS=new Set(["headline","body"]);
export function createStudioMission(goal,{sourceSha="unbound"}={}){
 if(typeof goal!=="string" || goal.trim().length<8 || goal.length>2000)throw new BatchError("MISSION_TEXT_REQUIRED");
 const mission=goal.trim(),sha=createHash("sha256").update(mission+"|"+sourceSha+"|x1-studio-v1").digest("hex");
 return Object.freeze({
  id:"mission-"+sha.slice(0,18),sourceSha,goal:mission,
  status:"DRAFT_NOT_DISPATCHED",permission:"READ_AND_PLAN_ONLY",
  estimatedCost:"UNASSESSED",budgetAuthorizedCents:0,sourceRepo:"Strategic-Minds-AI/X1-OPERATING-SYSTEM",
  execution:"NOT_STARTED",jobId:null,previewUrl:null,
  phases:STUDIO_PHASES.map(name=>({name,state:"BLOCKED_NOT_RUN"})),
  blockers:["NO_AUTHENTICATED_X1_JOB_ADAPTER","NO_APPROVED_CODING_SANDBOX","NO_INDEPENDENT_QA_RECEIPTS"]
 });
}
export function applyLocalVisualEdit(plan,{sectionId,field,value}={}){
 if(!SECTION_IDS.has(sectionId)||!FIELD_IDS.has(field))throw new BatchError("SECTION_FIELD_NOT_ALLOWED");
 if(typeof value!=="string"||!value.trim()||value.trim().length>(field==="headline"?120:360))throw new BatchError("EDIT_TEXT_INVALID");
 if(!plan || !Array.isArray(plan.sections) || !plan.planHash) throw new BatchError("MISSING_PLAN");
 const sections=plan.sections.map(s=>({
  ...s,content:{...s.content,[field]:s.section_id===sectionId?value.trim():s.content[field]}
 }));
 const current=plan.sections.find(s=>s.section_id===sectionId)?.content?.[field];
 if(current===value.trim())return Object.freeze({plan,previousPlanHash:plan.planHash,changed:false,
   approvalState:"UNCHANGED",operation:"NOOP_LOCAL_DRAFT",domainChanges:0,externalCalls:0});
 const revised=proposeBatch({quantity:10,templateKey:plan.templateKey,markets:plan.markets,sections});
 return Object.freeze({
  plan:revised,previousPlanHash:plan.planHash,
  changed:revised.planHash!==plan.planHash,approvalState:"RESET_TO_CONFIGURED",
  operation:"LOCAL_SECTION_DRAFT_ONLY",domainChanges:0,externalCalls:0
 });
}
function decodeValue(s){return s.replace(/^["']|["']$/g,"").trim();}
export function interpretStudioMessage(plan,message,{sourceSha="unbound"}={}){
 if(typeof message!=="string"||!message.trim()||message.length>2000)throw new BatchError("MESSAGE_TEXT_INVALID");
 const text=message.trim();
 const pattern=/^(?:please\s+)?(?:set|change|update)\s+(?:the\s+)?(hero|benefits|process|estimate|faq)\s+(headline|body|text|description)\s+(?:to|:)\s*(.+)$/i;
 const match=text.match(pattern);
 if(match){
  const field=/^(body|text|description)$/i.test(match[2])?"body":"headline";
  const sectionId=match[1].toLowerCase();
  const edit=applyLocalVisualEdit(plan,{sectionId,field,value:decodeValue(match[3])});
  return Object.freeze({mode:"LOCAL_VISUAL_EDIT",status:"APPLIED_TO_LOCAL_DRAFT",
   message:edit.changed?"Updated "+sectionId+" "+field+". Previous preview approvals were invalidated.":"The requested text is already in this draft.",
   edit,mission:null,canPublish:false});
 }
 const mission=createStudioMission(text,{sourceSha});
 return Object.freeze({mode:"AUTONOMOUS_MISSION_DRAFT",status:"DRAFT_NOT_DISPATCHED",
  message:"Prepared an engineering mission, but it was NOT sent to an autonomous coding worker. The authenticated X1 sandbox executor and independent QA are not connected yet. You can still edit the sample website locally.",
  edit:null,mission,canPublish:false});
}

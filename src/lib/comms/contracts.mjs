/**
 * Native X1 Communications capability contracts extracted from XTREME
 * Communications. No Base44 dependencies, runtime writes or provider calls.
 * Twilio account SID is intentionally NOT stored in Git.
 */
export const APPROVED_TWILIO_NUMBER = "+18665711174";
export const COMMS_CHANNELS = Object.freeze(["sms","mms","voice","whatsapp","email","internal"]);
export const COMMS_ACTIONS = Object.freeze([
 "inspect_connection","inspect_number","draft_sms","draft_mms","draft_voice_call",
 "draft_whatsapp","draft_email","draft_campaign","draft_number_route","draft_eden_handoff"
]);
export const ACTION_CHANNELS = Object.freeze({
 draft_sms:"sms",draft_mms:"mms",draft_voice_call:"voice",
 draft_whatsapp:"whatsapp",draft_email:"email",
 draft_number_route:"voice",draft_eden_handoff:"internal"
});
export const COMMS_FEATURES = Object.freeze([
 {id:"sms",name:"SMS Messaging",provider:"Twilio / Telnyx",state:"DRAFT_ONLY"},
 {id:"mms",name:"MMS Media",provider:"Twilio / Telnyx",state:"DRAFT_ONLY"},
 {id:"voice",name:"Programmable Voice",provider:"Twilio / Telnyx",state:"DRAFT_ONLY"},
 {id:"whatsapp",name:"WhatsApp Business",provider:"Provider review",state:"DRAFT_ONLY"},
 {id:"email",name:"Email / Follow-ups",provider:"Approved mail gateway",state:"DRAFT_ONLY"},
 {id:"numbers",name:"Phone Number Inventory",provider:"Twilio",state:"READ_ONLY_GATED"},
 {id:"routing",name:"Call / Number Routing",provider:"Approved provider",state:"DRAFT_ONLY"},
 {id:"campaigns",name:"Campaign Automation",provider:"Existing X1 queue",state:"DRAFT_ONLY"},
 {id:"inbox",name:"Omnichannel Inbox",provider:"Tenant-scoped store",state:"NOT_CONNECTED"},
 {id:"crm",name:"CRM / Google Contacts",provider:"Approved connectors",state:"NOT_CONNECTED"},
 {id:"eden",name:"Eden Voice / Handoff",provider:"Existing X1 agent",state:"DRAFT_ONLY"},
 {id:"gpt",name:"GPT Tool Bridge",provider:"OpenAPI / scoped server route",state:"CONTRACT_READY"},
 {id:"webhooks",name:"Signed Webhooks",provider:"Twilio / Telnyx",state:"NOT_CONNECTED"},
 {id:"analytics",name:"Usage / Audit Ledger",provider:"Existing X1 ledger",state:"NOT_CONNECTED"}
]);
export class CommsContractError extends Error {
 constructor(code){super(code);this.name="CommsContractError";this.code=code;}
}
const fail=code=>{throw new CommsContractError(code);};
const E164=/^\+[1-9]\d{7,14}$/;
const EMAIL=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const allowed=new Set(["action","provider","number","channel","to","subject","message",
 "media_urls","purpose","consent_reference","idempotency_key","campaign_size"]);
function txt(value,field,max,required=false){
 if(value===undefined||value===null||value===""){
  if(required)fail(field.toUpperCase()+"_REQUIRED");return null;
 }
 if(typeof value!=="string"||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))fail(field.toUpperCase()+"_INVALID");
 const result=value.trim();
 if(!result&&required)fail(field.toUpperCase()+"_REQUIRED");
 return result||null;
}
export function createCommsDraft(body){
 if(!body||typeof body!=="object"||Array.isArray(body))fail("INVALID_BODY");
 if(Object.keys(body).some(key=>!allowed.has(key)))fail("UNRECOGNIZED_OR_PRIVILEGED_FIELD");
 const action=body.action;
 if(typeof action!=="string"||!COMMS_ACTIONS.includes(action))fail("ACTION_NOT_ALLOWED");
 const provider=body.provider===undefined?"twilio":body.provider;
 if(!["twilio","telnyx"].includes(provider))fail("PROVIDER_NOT_ALLOWED");
 if(action==="inspect_connection"||action==="inspect_number"){
  if(provider!=="twilio")fail("INSPECT_PROVIDER_NOT_SUPPORTED");
  if(body.number!==undefined&&body.number!==APPROVED_TWILIO_NUMBER)fail("NUMBER_OUTSIDE_APPROVED_SCOPE");
  if(Object.keys(body).some(k=>!["action","provider","number"].includes(k)))fail("INSPECT_INPUT_NOT_ALLOWED");
  return Object.freeze({schema:"x1.comms.command.v1",action,provider,number_suffix:"1174",scope:"READ_ONLY"});
 }
 if(body.number!==undefined)fail("INSPECTION_NUMBER_ONLY");
 const channel=ACTION_CHANNELS[action]||body.channel;
 if(!COMMS_CHANNELS.includes(channel))fail("CHANNEL_NOT_ALLOWED");
 if(ACTION_CHANNELS[action]&&body.channel!==undefined&&body.channel!==channel)fail("CHANNEL_ACTION_MISMATCH");
 const to=txt(body.to,"to",254);
 if(to&&(channel==="email"?!EMAIL.test(to):channel==="internal"?false:!E164.test(to)))fail("RECIPIENT_FORMAT_INVALID");
 const message=txt(body.message,"message",2400,action!=="draft_number_route");
 const subject=txt(body.subject,"subject",180);
 const purpose=txt(body.purpose,"purpose",240);
 const consent=txt(body.consent_reference,"consent_reference",128);
 const idem=txt(body.idempotency_key,"idempotency_key",120);
 const urls=body.media_urls===undefined?[]:body.media_urls;
 if(!Array.isArray(urls)||urls.length>4||urls.some(v=>typeof v!=="string"||v.length>700||!/^https:\/\//i.test(v)))fail("MEDIA_URLS_INVALID");
 if(urls.length&&action!=="draft_mms")fail("MEDIA_NOT_ALLOWED_FOR_ACTION");
 if(body.campaign_size!==undefined&&action!=="draft_campaign")fail("CAMPAIGN_SIZE_NOT_ALLOWED");
 const size=action==="draft_campaign"?(body.campaign_size===undefined?1:body.campaign_size):null;
 if(size!==null&&(!Number.isInteger(size)||size<1||size>100))fail("CAMPAIGN_SIZE_INVALID");
 if(action==="draft_email"&&!subject)fail("SUBJECT_REQUIRED");
 if(action==="draft_campaign"&&!purpose)fail("PURPOSE_REQUIRED");
 return Object.freeze({
  schema:"x1.comms.work-packet.v1",source:"x1-native-comms",
  donor:"XTREME-SYSTEMS/xtreme-communications-os",
  action,provider,channel,to,subject,message,media_urls:urls.slice(),
  purpose,consent_reference:consent,idempotency_key:idem,campaign_size:size,
  source_number_suffix:"1174",status:"DRAFT_NOT_DISPATCHED",
  action_class:"DRAFT_ONLY",customer_contact_allowed:false,
  billable_provider_actions:0,signed_queue_dispatched:false,
  approval_required:true,gates:[
    "verified_x1_tenant_and_principal","verified_provider_and_owned_number",
    "recorded_consent_and_opt_out","bounded_cost_and_idempotency",
    "channel_specific_operator_approval","independent_guardian_validation"
  ],destination:"Existing signed X1 queue after activation",
  persistence:"NONE",backend_runtime:"NOT_EXECUTED"
 });
}
export function createCommsReadiness(flags={}){
 const label=x=>x===true?"CONFIGURED_NOT_VERIFIED":"NOT_CONFIGURED";
 return Object.freeze({
  schema:"x1.comms.readiness.v1",service:"x1-native-communications",
  stage:"PREVIEW_CAPABILITY_PORT",source_system:"XTREME Communications OS",
  system_of_record:"X1 Operating System",source_number_suffix:"1174",
  gpt_schema:"/x1-comms-openapi.json",
  provider_status:{twilio:label(flags.twilioConfigured),telnyx:label(flags.telnyxConfigured),
   x1_queue:label(flags.queueConfigured),ai_gateway:label(flags.aiGatewayConfigured)},
  gpt_bridge:label(flags.gptTokenConfigured),
  modules:COMMS_FEATURES,live_send_allowed:false,production_ready:false,
  duplicate_worker_created:false,base44_runtime_dependency:false
 });
}

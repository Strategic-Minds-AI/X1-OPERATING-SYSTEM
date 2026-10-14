import test from "node:test";
import assert from "node:assert/strict";
import {
 COMMS_ACTIONS,COMMS_CHANNELS,COMMS_FEATURES,APPROVED_TWILIO_NUMBER,
 CommsContractError,createCommsDraft,createCommsReadiness
} from "../src/lib/comms/contracts.mjs";
import {createTwilioInspector} from "../src/lib/comms/twilio-reader.mjs";
import {createCommsHandler} from "../src/lib/comms/gpt-handler.mjs";
import {createCommsOpenApi} from "../src/lib/comms/openapi.mjs";

const SID="AC"+"a".repeat(32);
const OTHER_SID="AC"+"c".repeat(32);
const APIKEY="SK"+"b".repeat(32);
const TOKEN="x1-comms-preview-secret-for-synthetic-test-2026";
const URL="https://x1-preview.example/api/comms/gpt";
const defaultEnv={
 TWILIO_ACCOUNT_SID:SID,
 X1_TWILIO_APPROVED_ACCOUNT_SID:SID,
 TWILIO_API_KEY_SID:APIKEY,
 TWILIO_API_KEY_SECRET:"nonproduction-mocked-secret"
};
const envFor=map=>key=>map[key];
const text="A synthetic welcome for a fictional customer.";
const good={action:"draft_sms",channel:"sms",provider:"twilio",message:text};
function req(body=good,opts={}){
 const headers={
  Authorization:"Bearer "+(opts.secret||TOKEN),
  "Content-Type":"application/json",
  ...opts.headers
 };
 if(opts.origin)headers.Origin=opts.origin;
 if(opts.site)headers["Sec-Fetch-Site"]=opts.site;
 if(opts.noAuth)delete headers.Authorization;
 return new Request(URL,{method:"POST",headers,body:opts.raw??JSON.stringify(body)});
}
const handler=(o={})=>createCommsHandler({
 mode:"preview",token:TOKEN,tenantId:"staging-tenant-a",
 env:envFor(defaultEnv),...o
});
async function call(h,request){const r=await h(request);return {status:r.status,body:await r.json(),headers:r.headers};}
const accountResponse=()=>Response.json({sid:SID,status:"active",type:"Full"});
const numberResponse=fields=>Response.json({incoming_phone_numbers:[
 {account_sid:SID,phone_number:APPROVED_TWILIO_NUMBER,
  capabilities:{sms:true,mms:true,voice:true},...fields}
]});

test("channel and action inventories cover major communications paths",()=>{
 for(const name of ["sms","mms","voice","whatsapp","email","internal"])assert.ok(COMMS_CHANNELS.includes(name));
 for(const name of ["draft_sms","draft_mms","draft_voice_call","draft_email","draft_campaign","draft_eden_handoff","inspect_connection","inspect_number"])assert.ok(COMMS_ACTIONS.includes(name));
 assert.ok(COMMS_FEATURES.some(x=>x.id==="gpt"));
 assert.ok(COMMS_FEATURES.some(x=>x.id==="crm"));
});
test("draft is never executable or sent",()=>{
 const p=createCommsDraft(good);
 assert.equal(p.status,"DRAFT_NOT_DISPATCHED");
 assert.equal(p.customer_contact_allowed,false);
 assert.equal(p.billable_provider_actions,0);
 assert.equal(p.signed_queue_dispatched,false);
 assert.equal(p.approval_required,true);
});
test("draft requires tenant, owned number and channel-level approvals",()=>{
 const p=createCommsDraft(good);
 for(const expected of ["verified_x1_tenant_and_principal","verified_provider_and_owned_number","recorded_consent_and_opt_out","channel_specific_operator_approval"]){
  assert.ok(p.gates.includes(expected));
 }
});
test("draft recipient E164 works for valid number",()=>{
 const p=createCommsDraft({...good,to:"+15551234567"});
 assert.equal(p.to,"+15551234567");
});
test("draft email recipient and subject are validated",()=>{
 const p=createCommsDraft({action:"draft_email",provider:"twilio",to:"test@example.com",message:"Synthetic test",subject:"Welcome"});
 assert.equal(p.channel,"email");assert.equal(p.subject,"Welcome");
});
test("draft accepts SMS with no recipient",()=>{
 assert.equal(createCommsDraft(good).to,null);
});
test("whatsapp draft is not a live whatsapp send",()=>{
 const p=createCommsDraft({action:"draft_whatsapp",provider:"telnyx",message:text});
 assert.equal(p.channel,"whatsapp");assert.equal(p.customer_contact_allowed,false);
});
test("voice draft does not initiate a call",()=>{
 const p=createCommsDraft({action:"draft_voice_call",message:"Call purpose",to:"+15551234567"});
 assert.equal(p.channel,"voice");assert.equal(p.signed_queue_dispatched,false);
});
test("campaign can plan bounded batch of 100",()=>{
 const p=createCommsDraft({action:"draft_campaign",channel:"sms",message:text,purpose:"Synthetic opt-in nurture",campaign_size:100});
 assert.equal(p.campaign_size,100);assert.equal(p.status,"DRAFT_NOT_DISPATCHED");
});
test("Eden handoff uses internal channel",()=>{
 const p=createCommsDraft({action:"draft_eden_handoff",message:"Prepare callback plan"});
 assert.equal(p.channel,"internal");assert.equal(p.customer_contact_allowed,false);
});
test("only fixed number accepted for Twilio inspect",()=>{
 assert.equal(createCommsDraft({action:"inspect_number",number:APPROVED_TWILIO_NUMBER}).scope,"READ_ONLY");
 assert.throws(()=>createCommsDraft({action:"inspect_number",number:"+15555555555"}),CommsContractError);
});
test("inspection rejects text or tenant-injection",()=>{
 assert.throws(()=>createCommsDraft({action:"inspect_connection",message:"force send"}),/INSPECT_INPUT_NOT_ALLOWED/);
 assert.throws(()=>createCommsDraft({action:"inspect_number",tenant_id:"other"}),/UNRECOGNIZED_OR_PRIVILEGED_FIELD/);
});
test("unknown live send and buy actions are disallowed",()=>{
 for(const action of ["send_sms","send_mms","make_call","buy","send_whatsapp","broadcast","delete"])
  assert.throws(()=>createCommsDraft({action,message:"hello"}),/ACTION_NOT_ALLOWED/);
});
test("extra authorization and recipient routing fields are denied",()=>{
 for(const field of ["authorized","tenant_id","approved","api_key","from","reply_url","callback_url","execute","spend_cap"])
  assert.throws(()=>createCommsDraft({...good,[field]:"spoof"}),/UNRECOGNIZED_OR_PRIVILEGED_FIELD/);
});
test("invalid input types are rejected",()=>{
 for(const value of [undefined,null,42,[],false,"SMS"])
  assert.throws(()=>createCommsDraft(value),CommsContractError);
});
test("invalid phone and email formats are denied",()=>{
 assert.throws(()=>createCommsDraft({...good,to:"123"}),/RECIPIENT_FORMAT_INVALID/);
 assert.throws(()=>createCommsDraft({action:"draft_email",message:"note",subject:"Hi",to:"invalid"}),/RECIPIENT_FORMAT_INVALID/);
});
test("message length and control chars are rejected",()=>{
 assert.throws(()=>createCommsDraft({...good,message:"x".repeat(2401)}),/MESSAGE_INVALID/);
 assert.throws(()=>createCommsDraft({...good,message:"test\u0000bad"}),/MESSAGE_INVALID/);
});
test("draft campaign size is capped and does not accept fractional sizes",()=>{
 for(const size of [0,101,1.5,-1])
  assert.throws(()=>createCommsDraft({action:"draft_campaign",channel:"sms",message:text,purpose:"Review",campaign_size:size}),/CAMPAIGN_SIZE_INVALID/);
});
test("campaign requires a purpose",()=>{
 assert.throws(()=>createCommsDraft({action:"draft_campaign",channel:"sms",message:text}),/PURPOSE_REQUIRED/);
});
test("email requires a subject",()=>{
 assert.throws(()=>createCommsDraft({action:"draft_email",message:"hello"}),/SUBJECT_REQUIRED/);
});
test("media URLs are limited and require HTTPS",()=>{
 assert.throws(()=>createCommsDraft({...good,media_urls:["http://example.com"]}),/MEDIA_URLS_INVALID/);
 assert.throws(()=>createCommsDraft({...good,media_urls:["https://a.test","https://b.test","https://c.test","https://d.test","https://e.test"]}),/MEDIA_URLS_INVALID/);
 assert.throws(()=>createCommsDraft({...good,media_urls:["https://a.test"]}),/MEDIA_NOT_ALLOWED_FOR_ACTION/);
});
test("MMS with media stays a dry draft",()=>{
 const p=createCommsDraft({action:"draft_mms",message:"test",media_urls:["https://example.com/image.jpg"]});
 assert.equal(p.media_urls.length,1);assert.equal(p.customer_contact_allowed,false);
});
test("cross-channel spoof is denied",()=>{
 assert.throws(()=>createCommsDraft({...good,channel:"voice"}),/CHANNEL_ACTION_MISMATCH/);
});
test("configured provider readiness never claims live verification",()=>{
 const status=createCommsReadiness({twilioConfigured:true,telnyxConfigured:true,queueConfigured:true,gptTokenConfigured:true});
 assert.equal(status.provider_status.twilio,"CONFIGURED_NOT_VERIFIED");
 assert.equal(status.gpt_bridge,"CONFIGURED_NOT_VERIFIED");
 assert.equal(status.live_send_allowed,false);
 assert.equal(status.production_ready,false);
 assert.equal(status.base44_runtime_dependency,false);
});
test("unconfigured provider readiness is explicit",()=>{
 const status=createCommsReadiness();
 assert.equal(status.provider_status.twilio,"NOT_CONFIGURED");
 assert.equal(status.gpt_bridge,"NOT_CONFIGURED");
});
test("GPT command rejects GET",async()=>{
 const r=await call(handler(),new Request(URL,{method:"GET"}));
 assert.equal(r.status,405);
});
test("GPT command rejects missing preview configuration",async()=>{
 const r=await call(handler({mode:"disabled"}),req());
 assert.equal(r.status,503);
});
test("GPT command rejects missing tenant",async()=>{
 const r=await call(handler({tenantId:undefined}),req());
 assert.equal(r.status,503);
});
test("GPT command rejects weak token",async()=>{
 const r=await call(handler({token:"short"}),req());
 assert.equal(r.status,503);
});
test("GPT command rejects missing bearer",async()=>{
 const r=await call(handler(),req(good,{noAuth:true}));
 assert.equal(r.status,401);
});
test("GPT command rejects wrong bearer",async()=>{
 const r=await call(handler(),req(good,{secret:"a-different-synthetic-long-token-from-attacker"}));
 assert.equal(r.status,401);
});
test("GPT command rejects cross-site requests",async()=>{
 const r=await call(handler(),req(good,{site:"cross-site"}));
 assert.equal(r.status,403);
});
test("GPT command rejects foreign Origin",async()=>{
 const r=await call(handler(),req(good,{origin:"https://attacker.example"}));
 assert.equal(r.status,403);
});
test("GPT command accepts same Origin in preview",async()=>{
 const r=await call(handler(),req(good,{origin:"https://x1-preview.example"}));
 assert.equal(r.status,200);
});
test("GPT command rejects non-JSON",async()=>{
 const r=await call(handler(),req(good,{headers:{"Content-Type":"text/plain"}}));
 assert.equal(r.status,415);
});
test("GPT command rejects malformed JSON",async()=>{
 const r=await call(handler(),req(good,{raw:"invalid {"}));
 assert.equal(r.status,400);
});
test("GPT command rejects oversized payload",async()=>{
 const r=await call(handler(),req(good,{raw:JSON.stringify({...good,message:"a".repeat(8500)})}));
 assert.equal(r.status,413);
});
test("GPT command rejects direct send action without provider activity",async()=>{
 let calls=0;const h=handler({readEnabled:true,fetcher:async()=>{calls++;return accountResponse();}});
 const r=await call(h,req({action:"send_sms",message:text}));
 assert.equal(r.status,400);assert.equal(calls,0);
});
test("GPT draft returns deterministic opaque receipt and nothing sent",async()=>{
 const h=handler();
 const r=await call(h,req());
 const again=await call(h,req());
 assert.equal(r.status,200);
 assert.equal(r.body.status,"DRAFT_NOT_DISPATCHED");
 assert.equal(r.body.sent,false);assert.equal(r.body.stored,false);
 assert.equal(r.body.queued,false);assert.equal(r.body.billable_actions,0);
 assert.equal(r.body.draft_id,again.body.draft_id);
 assert.ok(!JSON.stringify(r.body).includes(TOKEN));
 assert.equal(r.headers.get("cache-control"),"no-store");
});
test("Twilio inspect disabled by default, no network request",async()=>{
 let calls=0;
 const h=handler({fetcher:async()=>{calls++;return accountResponse();}});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,503);assert.equal(calls,0);
});
test("Twilio requires independent account pin before reading",async()=>{
 let calls=0;
 const h=handler({readEnabled:true,env:envFor({...defaultEnv,X1_TWILIO_APPROVED_ACCOUNT_SID:OTHER_SID}),fetcher:async()=>{calls++;return accountResponse();}});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,503);assert.equal(calls,0);
});
test("Twilio requires a server credential",async()=>{
 const h=handler({readEnabled:true,env:envFor({TWILIO_ACCOUNT_SID:SID,X1_TWILIO_APPROVED_ACCOUNT_SID:SID})});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,503);
});
test("Twilio account inspect uses GET, fixed host and sanitized payload",async()=>{
 let request;
 const h=handler({readEnabled:true,fetcher:async(url,opts)=>{request={url,opts};return accountResponse();}});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,200);assert.equal(r.body.account_verified,true);
 assert.equal(r.body.live_voice,"UNKNOWN");
 assert.equal(request.opts.method,"GET");
 assert.ok(request.url.startsWith("https://api.twilio.com/2010-04-01/Accounts/"));
 assert.equal(request.opts.redirect,"error");
 assert.ok(!JSON.stringify(r.body).includes(SID));
});
test("Twilio rejects provider account mismatch",async()=>{
 const h=handler({readEnabled:true,fetcher:async()=>Response.json({sid:OTHER_SID,status:"active"})});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,502);assert.equal(r.body.account_verified,false);
});
test("Twilio inspect_number verifies owner and masks route secrets",async()=>{
 const h=handler({readEnabled:true,fetcher:async()=>numberResponse({
  voice_url:"https://u:private@voice.example/secret-path?key=private",
  voice_fallback_url:"https://backup.example/callback?token=private",
  capabilities:{sms:true,mms:false,voice:true}
 })});
 const r=await call(h,req({action:"inspect_number"}));
 assert.equal(r.status,200);
 assert.equal(r.body.ownership_verified,true);
 assert.equal(r.body.voice_route.host,"voice.example");
 assert.equal(r.body.capabilities.mms,false);
 assert.ok(!JSON.stringify(r.body).includes("private"));
});
test("Twilio does not accept a phone number from another account",async()=>{
 const h=handler({readEnabled:true,fetcher:async()=>Response.json({incoming_phone_numbers:[
  {account_sid:OTHER_SID,phone_number:APPROVED_TWILIO_NUMBER}
 ]})});
 const r=await call(h,req({action:"inspect_number"}));
 assert.equal(r.status,404);
});
test("Twilio blocks routing inspect for unapproved number without fetch",async()=>{
 let calls=0;
 const h=handler({readEnabled:true,fetcher:async()=>{calls++;return numberResponse();}});
 const r=await call(h,req({action:"inspect_number",number:"+18885550000"}));
 assert.equal(r.status,400);assert.equal(calls,0);
});
test("Twilio reports excluded Digital Dominance 2.0 route as excluded",async()=>{
 const h=handler({readEnabled:true,fetcher:async()=>numberResponse({
  voice_url:"https://digital-dominance-2-0.base44.app/hijack"
 })});
 const r=await call(h,req({action:"inspect_number"}));
 assert.equal(r.body.voice_route.excluded,true);
});
test("Twilio provider error text never leaks into GPT response",async()=>{
 const h=handler({readEnabled:true,fetcher:async()=>Response.json({error:"do-not-echo-protected-secret"},{status:401})});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,502);
 assert.ok(!JSON.stringify(r.body).includes("do-not-echo"));
});
test("Twilio network exception stays masked",async()=>{
 const h=handler({readEnabled:true,fetcher:async()=>{throw new Error("secret-host-network-error");}});
 const r=await call(h,req({action:"inspect_connection"}));
 assert.equal(r.status,502);
 assert.ok(!JSON.stringify(r.body).includes("secret-host"));
});
test("OpenAPI is valid shape with only preview, read and draft actions",()=>{
 const api=createCommsOpenApi("https://staging.example");
 assert.equal(api.openapi,"3.1.0");
 assert.equal(api.servers[0].url,"https://staging.example");
 assert.equal(api.paths["/api/comms/gpt"].post.operationId,"prepareOrInspectX1Communications");
 assert.equal(api.paths["/api/comms/gpt"].post.security[0].InternalPreviewBearer.length,0);
 assert.ok(api.components.schemas.CommsInput.properties.action.enum.includes("inspect_connection"));
 assert.ok(!api.components.schemas.CommsInput.properties.action.enum.includes("send_sms"));
});
test("OpenAPI rejects unsafe http external origins",()=>{
 assert.throws(()=>createCommsOpenApi("http://external.example"),/X1_COMMS_OPENAPI_ORIGIN_REQUIRED/);
 assert.equal(createCommsOpenApi("http://localhost:3000").servers[0].url,"http://localhost:3000");
});
test("OpenAPI rejects credential-bearing origin",()=>{
 assert.throws(()=>createCommsOpenApi("https://alice:password@staging.example"),/X1_COMMS_OPENAPI_ORIGIN_REQUIRED/);
});

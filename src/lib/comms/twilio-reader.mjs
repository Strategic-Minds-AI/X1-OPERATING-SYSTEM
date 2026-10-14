/**
 * Twilio read-only provider adapter for X1.
 * Derived from XTREME Communications gptTwilio/reader.mjs.
 * Does not import Base44, mutate routes, buy numbers, or send messages/calls.
 */
import { APPROVED_TWILIO_NUMBER } from "./contracts.mjs";
const SID=/^AC[a-fA-F0-9]{32}$/;
const KEY=/^SK[a-fA-F0-9]{32}$/;
const safeHost=value=>{
 if(!value)return null;
 try {
  const url=new URL(value);
  const excluded=url.hostname==="digital-dominance-2-0.base44.app";
  return {configured:true,protocol:url.protocol,host:url.hostname,
    verified_https:url.protocol==="https:",excluded};
 } catch {return {configured:true,valid_url:false};}
};
const fail=(status,code)=>({status,body:{provider:"twilio",status:code,
 account_verified:false,live_voice:"UNKNOWN"}});
export function createTwilioInspector({env,fetcher=fetch}){
 return async function inspect(action){
  if(action!=="inspect_connection"&&action!=="inspect_number")return fail(400,"ACTION_NOT_ALLOWED");
  const sid=env("TWILIO_ACCOUNT_SID");
  const approved=env("X1_TWILIO_APPROVED_ACCOUNT_SID");
  const token=env("TWILIO_AUTH_TOKEN");
  const keySid=env("TWILIO_API_KEY_SID");
  const keySecret=env("TWILIO_API_KEY_SECRET");
  if(!SID.test(sid||"")||!SID.test(approved||"")||sid!==approved){
   return fail(503,"PINNED_ACCOUNT_BINDING_REQUIRED");
  }
  const auth=KEY.test(keySid||"")&&keySecret?keySid+":"+keySecret:(token?sid+":"+token:null);
  if(!auth)return fail(503,"CREDENTIALS_REQUIRED");
  const relative=action==="inspect_connection"?".json":
    "/IncomingPhoneNumbers.json?"+new URLSearchParams({PhoneNumber:APPROVED_TWILIO_NUMBER,PageSize:"1"});
  const url="https://api.twilio.com/2010-04-01/Accounts/"+sid+relative;
  let response;
  try {
   response=await fetcher(url,{
    method:"GET",
    headers:{Authorization:"Basic "+Buffer.from(auth).toString("base64"),Accept:"application/json"},
    redirect:"error",cache:"no-store",signal:AbortSignal.timeout(10000)
   });
  }catch{
   return fail(502,"PROVIDER_UNAVAILABLE");
  }
  if(!response?.ok)return fail(502,"PROVIDER_RESPONSE_UNVERIFIED");
  let data;
  try{data=await response.json();}catch{return fail(502,"INVALID_PROVIDER_RESPONSE");}
  if(!data||typeof data!=="object")return fail(502,"INVALID_PROVIDER_RESPONSE");
  if(action==="inspect_connection"){
   if(data.sid!==sid)return fail(502,"ACCOUNT_MISMATCH");
   return {status:200,body:{
    provider:"twilio",account_verified:true,
    account_status:typeof data.status==="string"?data.status.slice(0,40):"UNKNOWN",
    account_type:typeof data.type==="string"?data.type.slice(0,40):"UNKNOWN",
    account_suffix:sid.slice(-4),number_suffix:"1174",
    live_voice:"UNKNOWN",provider_mutations:0
   }};
  }
  const number=(Array.isArray(data.incoming_phone_numbers)?data.incoming_phone_numbers:[])
    .find(entry=>entry?.account_sid===sid&&entry?.phone_number===APPROVED_TWILIO_NUMBER);
  if(!number)return fail(404,"NUMBER_NOT_FOUND_IN_PINNED_ACCOUNT");
  return {status:200,body:{
   provider:"twilio",number_suffix:"1174",account_suffix:sid.slice(-4),
   ownership_verified:true,account_verified:true,
   capabilities:{
    sms:number.capabilities?.sms===true,
    mms:number.capabilities?.mms===true,
    voice:number.capabilities?.voice===true
   },
   voice_route:safeHost(number.voice_url),
   fallback_route:safeHost(number.voice_fallback_url),
   status_callback:safeHost(number.status_callback),
   voice_method:["GET","POST"].includes(number.voice_method)?number.voice_method:null,
   voice_application_configured:Boolean(number.voice_application_sid),
   live_voice:"UNKNOWN",routing_changed:false,provider_mutations:0
  }};
 };
}

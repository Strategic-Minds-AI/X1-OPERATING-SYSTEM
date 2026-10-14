import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { CommsContractError, createCommsDraft } from "./contracts.mjs";
import { createTwilioInspector } from "./twilio-reader.mjs";

const headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
const json=(body,status=200)=>Response.json(body,{status,headers});
function sameToken(value, expected){
 if(!value||typeof expected!=="string")return false;
 const a=createHash("sha256").update(value).digest();
 const b=createHash("sha256").update(expected).digest();
 return timingSafeEqual(a,b);
}
/**
 * Staging-only GPT/tool handler. One server-verified tenant and a scoped
 * internal bearer token. Not public OAuth, not general multi-tenant auth.
 * Drafts never dispatch. Twilio inspections are optional GETs, never writes.
 */
export function createCommsHandler(options={}){
 const {mode,token,tenantId,readEnabled=false,env=()=>undefined,fetcher=fetch}=options;
 return async function handler(request){
  try {
   if(request.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405);
   if(mode!=="preview"||typeof token!=="string"||token.length<32||!tenantId)
    return json({error:"X1_COMMS_BRIDGE_NOT_BOUND",dispatched:false},503);
   if(request.headers.get("sec-fetch-site")==="cross-site")
    return json({error:"CROSS_SITE_DENIED"},403);
   const origin=request.headers.get("origin");
   if(origin){
    let same=false;
    try{same=new URL(origin).origin===new URL(request.url).origin;}catch{}
    if(!same)return json({error:"ORIGIN_DENIED"},403);
   }
   const authorization=request.headers.get("authorization")||"";
   const bearer=/^Bearer ([A-Za-z0-9_-]{32,256})$/.exec(authorization)?.[1];
   if(!bearer||!sameToken(bearer,token))
    return json({error:"UNAUTHORIZED"},401);
   if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type")||""))
    return json({error:"JSON_REQUIRED"},415);
   const size=Number(request.headers.get("content-length")||"0");
   if(!Number.isSafeInteger(size)||size>8192)
    return json({error:"PAYLOAD_TOO_LARGE"},413);
   const raw=await request.text();
   if(raw.length>8192)return json({error:"PAYLOAD_TOO_LARGE"},413);
   let data;
   try{data=JSON.parse(raw);}catch{return json({error:"INVALID_JSON"},400);}
   let packet;
   try{packet=createCommsDraft(data);}
   catch(error){
    return error instanceof CommsContractError
      ?json({error:error.code,dispatched:false},400)
      :json({error:"INVALID_REQUEST",dispatched:false},400);
   }
   if(packet.scope==="READ_ONLY"){
    if(readEnabled!==true)return json({provider:"twilio",status:"READ_ONLY_INSPECTION_DISABLED",live_voice:"UNKNOWN"},503);
    const result=await createTwilioInspector({env,fetcher})(packet.action);
    return json(result.body,result.status);
   }
   const digest=createHmac("sha256",token)
    .update(String(tenantId)+":"+JSON.stringify(packet)).digest("hex").slice(0,32);
   return json({
    schema:"x1.comms.draft-receipt.v1",draft_id:"x1-comms-"+digest,
    packet,tenant_bound:true,status:"DRAFT_NOT_DISPATCHED",
    queued:false,stored:false,sent:false,provider_calls_made:0,
    billable_actions:0,approval_required:true
   },200);
  }catch{
   return json({error:"X1_COMMS_UNAVAILABLE",dispatched:false},503);
  }
 };
}

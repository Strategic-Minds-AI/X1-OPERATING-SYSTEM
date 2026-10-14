import {COMMS_ACTIONS} from "./contracts.mjs";

/** GPT/OpenAPI is a contract, not an already installed ChatGPT connector. */
export function createCommsOpenApi(origin){
 let base;
 try{
  const url=new URL(origin);
  if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))
   throw new Error("PUBLIC_HTTPS_ORIGIN_REQUIRED");
  if(url.username||url.password||url.search||url.hash)throw new Error("INVALID_ORIGIN");
  base=url.origin;
 }catch{throw new Error("X1_COMMS_OPENAPI_ORIGIN_REQUIRED");}
 return {
  openapi:"3.1.0",
  info:{
   title:"X1 XTREME Communications GPT Tools",
   version:"0.1.0",
   description:"Single X1 communications gateway. Read-only Twilio account/number inspection when explicitly enabled, plus approval-only drafts. NEVER sends messages, dials, purchases numbers, or starts a workflow from these endpoints."
  },
  servers:[{url:base}],
  components:{
   securitySchemes:{InternalPreviewBearer:{
    type:"http",scheme:"bearer",bearerFormat:"opaque server-scoped token",
    description:"Server-scoped X1 preview token, issued by the operator in provider secret management. Never paste tokens into a message or public GPT instruction."
   }},
   schemas:{
    CommsInput:{
     type:"object",additionalProperties:false,
     required:["action"],
     properties:{
      action:{type:"string",enum:COMMS_ACTIONS},
      provider:{type:"string",enum:["twilio","telnyx"],default:"twilio"},
      number:{type:"string",description:"For inspect_number only; restricted to operator-approved Twilio number."},
      channel:{type:"string",enum:["sms","mms","voice","whatsapp","email","internal"]},
      to:{type:"string",maxLength:254,description:"Optional recipient for draft preparation only. No live sends."},
      subject:{type:"string",maxLength:180},message:{type:"string",maxLength:2400},
      media_urls:{type:"array",maxItems:4,items:{type:"string",format:"uri"}},
      purpose:{type:"string",maxLength:240},
      consent_reference:{type:"string",maxLength:128},
      idempotency_key:{type:"string",maxLength:120},
      campaign_size:{type:"integer",minimum:1,maximum:100}
     }
    }
   }
  },
  paths:{
   "/api/comms/readiness":{
    get:{
     operationId:"getX1CommunicationsReadiness",
     summary:"Get public readiness and feature state (not a provider authentication check)",
     description:"Never returns secrets, active contact records or customer messages.",
     responses:{"200":{description:"X1 readiness snapshot; configuration does not mean live provider verified."}}
    }
   },
   "/api/comms/gpt":{
    post:{
     operationId:"prepareOrInspectX1Communications",
     summary:"Inspect Twilio or prepare an approval-gated communications draft",
     description:"Preview only. Bound to one server-configured tenant. No outbound actions. Real Twilio GET requires separate account pinning and read-enabled policy.",
     security:[{InternalPreviewBearer:[]}],
     requestBody:{
      required:true,
      content:{"application/json":{schema:{"$ref":"#/components/schemas/CommsInput"}}}
     },
     responses:{
      "200":{description:"Safe inspection or non-executable draft with receipt"},
      "400":{description:"Invalid action or body; not executed"},
      "401":{description:"Unauthorized"},
      "403":{description:"Cross-site input denied"},
      "503":{description:"Not configured, insufficient binding, or provider unavailable"}
     }
    }
   }
  },
  "x-x1-gpt-sync":{
   activation:"REQUIRES_OPERATOR_PRIVATE_GPT_CONNECTION",
   source:"Strategic-Minds-AI/X1-OPERATING-SYSTEMS",
   staged_actions_only:true,
   no_live_dispatch:true,
   preserve_existing_xtreme_communications_mcp:true
  }
 };
}

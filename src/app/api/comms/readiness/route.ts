import { createCommsReadiness } from "@/lib/comms/contracts.mjs";

export const dynamic="force-dynamic";
export const runtime="nodejs";

export function GET():Response{
 const readiness=createCommsReadiness({
  twilioConfigured:Boolean(process.env.TWILIO_ACCOUNT_SID &&
   process.env.X1_TWILIO_APPROVED_ACCOUNT_SID &&
   (process.env.TWILIO_AUTH_TOKEN ||
     (process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET))),
  telnyxConfigured:Boolean(process.env.TELNYX_API_KEY),
  queueConfigured:Boolean(process.env.X1_RAILWAY_WORKER_URL),
  aiGatewayConfigured:Boolean(process.env.X1_GATEWAY_API_KEY),
  gptTokenConfigured:Boolean(process.env.X1_COMMS_PREVIEW_TOKEN &&
    process.env.X1_COMMS_ALLOWED_TENANT_ID && process.env.X1_COMMS_MODE==="preview")
 });
 return Response.json(readiness,{
  status:200,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}
 });
}

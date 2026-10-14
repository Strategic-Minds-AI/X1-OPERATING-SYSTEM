import { createCommsHandler } from "@/lib/comms/gpt-handler.mjs";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function POST(request:Request):Promise<Response>{
 return createCommsHandler({
  mode:process.env.X1_COMMS_MODE,
  token:process.env.X1_COMMS_PREVIEW_TOKEN,
  tenantId:process.env.X1_COMMS_ALLOWED_TENANT_ID,
  readEnabled:process.env.X1_COMMS_TWILIO_READ_ENABLED==="true",
  env:(key:string)=>process.env[key]
 })(request);
}
export function GET():Response{
 return Response.json({error:"METHOD_NOT_ALLOWED"},{
  status:405,headers:{"Cache-Control":"no-store"}
 });
}

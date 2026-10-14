import {createCommsOpenApi} from "@/lib/comms/openapi.mjs";

export const dynamic="force-dynamic";
export const runtime="nodejs";

export function GET(request:Request):Response{
 const vercelHost=process.env.VERCEL_URL;
 const safeHost=typeof vercelHost==="string"&&
   /^[a-z0-9][a-z0-9.-]*\.vercel\.app$/i.test(vercelHost)
   ? "https://"+vercelHost:null;
 const origin=safeHost||new URL(request.url).origin;
 try{
  return Response.json(createCommsOpenApi(origin),{
   status:200,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}
  });
 }catch{
  return Response.json({error:"OPENAPI_ORIGIN_UNAVAILABLE"},{
   status:503,headers:{"Cache-Control":"no-store"}
  });
 }
}

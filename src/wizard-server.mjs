import {createServer} from "node:http";
import {readFile,writeFile,mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname,resolve,join} from "node:path";
import {proposeBatch,approveMarkets,authorizePreview,buildSyntheticPreviewBatch,verifyGeneratedBatch,BatchError} from "./batch-wizard.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const entry=join(root,"apps/batch-wizard/index.html");
const host="127.0.0.1";
const port=Number(process.env.WIZARD_PORT||4391);
if(!Number.isInteger(port)||port<1024||port>65535) throw new Error("INVALID_PORT");
const maxBytes=24000;
let plan=proposeBatch(),batch=null,receipt=null;
const html=await readFile(entry,"utf8");

function reply(res,status,data,contentType="application/json; charset=utf-8"){
  res.writeHead(status,{"Content-Type":contentType,"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow",
   "X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'"});
  res.end(typeof data==="string"?data:JSON.stringify(data));
}
function view(){return {plan,batch:batch?{...batch,sites:batch.sites.map(({html,...s})=>s)}:null,receipt,
  runtime:"LOOPBACK_SYNTHETIC_ONLY",auth:"NO_PRODUCTION_AUTH",publicDeploy:false,visualParity:"NOT_TESTED"};}
async function readBody(req){let size=0,chunks=[];for await(const c of req){size+=c.length;if(size>maxBytes)throw new BatchError("PAYLOAD_TOO_LARGE");chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString("utf8"))}catch{throw new BatchError("INVALID_JSON")}}
export function createWizardServer(){
 return createServer(async(req,res)=>{
  try{
    const pathname=new URL(req.url,"http://"+host+":"+port).pathname;
    if(req.method==="GET"&&pathname==="/"){return reply(res,200,html,"text/html; charset=utf-8");}
    if(req.method==="GET"&&pathname==="/api/state"){return reply(res,200,view());}
    if(req.method==="GET"&&pathname.startsWith("/previews/")){
      const site=batch?.sites.find(s=>pathname==="/previews/"+s.id+".html");
      if(!site)return reply(res,404,{error:"PREVIEW_NOT_GENERATED"});
      return reply(res,200,site.html,"text/html; charset=utf-8");
    }
    if(req.method!=="POST") return reply(res,404,{error:"ROUTE_NOT_FOUND"});
    const origin=req.headers.origin;
    const allowedOrigin="http://"+host+":"+port;
    if(origin!==allowedOrigin)return reply(res,403,{error:"LOCAL_ORIGIN_REQUIRED"});
    if(!req.headers["content-type"]?.startsWith("application/json"))return reply(res,415,{error:"JSON_ONLY"});
    const body=await readBody(req);
    if(pathname==="/api/plan"){
      plan=proposeBatch({quantity:body.quantity,templateKey:body.templateKey,markets:body.markets,sections:body.sections});
      batch=null;receipt=null;
      return reply(res,200,view());
    }
    if(pathname==="/api/approve-markets"){
      plan=approveMarkets(plan,{actor:"synthetic-local-operator",planHash:body.planHash,intent:body.intent});
      return reply(res,200,view());
    }
    if(pathname==="/api/approve-preview"){
      plan=authorizePreview(plan,{actor:"synthetic-local-operator",planHash:body.planHash,intent:body.intent});
      return reply(res,200,view());
    }
    if(pathname==="/api/generate"){
      if(Object.keys(body).length!==0)return reply(res,422,{error:"GENERATION_ACCEPTS_NO_PROVIDER_PARAMETERS"});
      batch=buildSyntheticPreviewBatch(plan);
      receipt=verifyGeneratedBatch(batch);
      const output=join(root,"out","synthetic-preview-"+batch.batchId);
      await mkdir(output,{recursive:true});
      await Promise.all(batch.sites.map(s=>writeFile(join(output,s.id+".html"),s.html,{flag:"w"})));
      await writeFile(join(output,"static-qa-receipt.json"),JSON.stringify(receipt,null,2));
      await writeFile(join(output,"manifest.json"),JSON.stringify(view(),null,2));
      return reply(res,200,view());
    }
    return reply(res,404,{error:"ROUTE_NOT_FOUND"});
  }catch(error){
    const code=error instanceof BatchError?error.code:"INTERNAL_SYNTHETIC_SERVER_ERROR";
    if(!(error instanceof BatchError)) console.error(error);
    return reply(res,error instanceof BatchError?422:500,{error:code});
  }
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 createWizardServer().listen(port,host,()=>console.log("PREVIEW-ONLY wizard: http://"+host+":"+port+" (no public binding, no production actions)"));
}

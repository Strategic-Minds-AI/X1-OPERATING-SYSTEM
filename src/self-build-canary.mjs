import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile,realpath,stat} from "node:fs/promises";
import {resolve,join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
import {getTemplate} from "./template-registry.mjs";

export const CANARY_TEMPLATE_ID="app-client-crm";
export const CANARY_POLICY="X1-LOCAL-SELF-BUILD-V1";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const seedRoot=join(root,"scaffolds","client-crm");
const hash=s=>createHash("sha256").update(s).digest("hex");
export function safeText(s,max=1200){
 if(typeof s!=="string"||s.trim().length<8||s.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))throw Error("INVALID_OBJECTIVE");
 return s.trim();
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function titleFromObjective(s){
 const text=safeText(s);
 if(/(?:crm|lead|client|portal)/i.test(text))return "Client Command Center";
 return "X1 Business Command Center";
}
export function planCanary({templateId=CANARY_TEMPLATE_ID,objective,sourceSha="LOCAL_UNPINNED"}={}){
 if(templateId!==CANARY_TEMPLATE_ID||!getTemplate(templateId))throw Error("CANARY_TEMPLATE_NOT_SUPPORTED");
 const cleaned=safeText(objective);
 if(typeof sourceSha!=="string"||!(sourceSha==="LOCAL_UNPINNED"||/^[a-f0-9]{40}$/.test(sourceSha)))throw Error("SOURCE_SHA_INVALID");
 const digest=hash(JSON.stringify({templateId,objective:cleaned,sourceSha,policy:CANARY_POLICY}));
 return Object.freeze({id:"canary-"+digest.slice(0,16),objective:cleaned,title:titleFromObjective(cleaned),
  templateId,sourceSha,planSha256:digest,scope:"SYNTHETIC_CLIENT_CRM_ONLY",productionAuthorized:false,
  publishedUrl:null,externalCalls:0,paidProvisioning:0,executionMode:"DETERMINISTIC_TEMPLATE_COMPILER",
  approval:"LOCAL_PREVIEW_ONLY",modelGeneration:false});
}
export async function compileCanary(input={}){
 const p=planCanary(input);
 const files={};
 for(const name of ["index.html","styles.css","app.js"]){
  files[name]=await readFile(join(seedRoot,name),"utf8");
 }
 files["index.html"]=files["index.html"].replaceAll("%%TITLE%%",escape(p.title)).replaceAll("%%OBJECTIVE%%",escape(p.objective));
 if(files["index.html"].includes("%%"))throw Error("UNRESOLVED_TEMPLATE_VARIABLE");
 files["README.md"]=[
  "# "+p.title,"",
  "Built by the X1 reproducible self-build canary using **real source files** and an original scaffold.",
  "Requested objective: "+p.objective.replaceAll(/\r|\n/g," "),
  "Template: "+p.templateId+" | Plan SHA-256: "+p.planSha256,
  "Source SHA: "+p.sourceSha,
  "Build kind: DETERMINISTIC TEMPLATE COMPILER (not general AI source generation)",
  "Data: synthetic browser-only data, persisted to browser localStorage.",
  "Run: open index.html in an authorized local browser, or serve with a static local HTTP server.",
  "No real tenant auth, backend/CRM provider, leads, messaging, external calls, paid services or published domains.",
  "Independent validation status is NOT_RUN until a separate runner verifies this build.",""
 ].join("\n");
 const fileHashes=Object.fromEntries(Object.entries(files).map(([name,content])=>[name,hash(content)]));
 const manifest={schema:"x1.self-build.canary/1",kind:"generated_source_application",...p,files:fileHashes,
  codeGenerated:true,generationProof:"GENERATED_SOURCE_FILES",selfCheck:"PENDING",independentQa:"NOT_RUN",
  visualParity:"NOT_TESTED",realClientData:false,releaseEligible:false};
 return Object.freeze({plan:p,files,manifest});
}
export async function materializeCanary(input={}){
 const pack=await compileCanary(input);
 const outRoot=join(root,"out");
 await mkdir(outRoot,{recursive:true});
 const expectedRoot=await realpath(outRoot);
 if(expectedRoot!==outRoot)throw Error("OUTPUT_ROOT_SYMLINK_BLOCKED");
 const dir=join(outRoot,pack.plan.id);
 await mkdir(dir,{recursive:true});
 if((await realpath(dir))!==dir)throw Error("OUTPUT_DIRECTORY_SYMLINK_BLOCKED");
 for(const [name,body]of Object.entries(pack.files))await writeFile(join(dir,name),body,{encoding:"utf8",flag:"w"});
 const check=spawnSync(process.execPath,["--check",join(dir,"app.js")],{timeout:7000,encoding:"utf8",shell:false});
 if(check.status!==0)throw Error("GENERATED_JAVASCRIPT_SYNTAX_FAILED: "+String(check.stderr).slice(0,220));
 for(const name of ["index.html","styles.css","app.js"]){
  const f=await stat(join(dir,name));if(f.size<250)throw Error("GENERATED_FILE_TOO_SMALL:"+name);
 }
 const manifest={...pack.manifest,selfCheck:"PASS",independentQa:"NOT_RUN",generatedFiles:Object.keys(pack.files).length,
  receiptType:"SELF_BUILD_STATIC_COMPILATION_ONLY",projectTitle:pack.plan.title};
 await writeFile(join(dir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
 return {dir,manifest,previewFiles:pack.files,status:"CODE_GENERATED_SELF_CHECK_PASS_INDEPENDENT_QA_NOT_RUN"};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const objective=process.argv[2]||"Build a premium CRM with a lead inbox, demo pipeline, and interactive dashboard";
 const sourceSha=process.env.GITHUB_SHA&&/^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA)?process.env.GITHUB_SHA:"LOCAL_UNPINNED";
 materializeCanary({objective,sourceSha}).then(result=>{
  process.stdout.write(JSON.stringify({status:result.status,output:result.dir,files:result.manifest.files,planSha256:result.manifest.planSha256,
   sourceSha:result.manifest.sourceSha,independentQa:result.manifest.independentQa})+"\n");
 }).catch(e=>{process.stderr.write(String(e.message||e)+"\n");process.exitCode=1;});
}

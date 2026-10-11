import {createHash} from "node:crypto";
import {readFile,writeFile} from "node:fs/promises";
import {resolve,join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const sha=s=>createHash("sha256").update(s).digest("hex");
const passes=(name,pass,evidence)=>({name,pass:!!pass,evidence:String(evidence).slice(0,350)});
export async function validateGeneratedApp(dir,{expectedSourceSha=null,independentRunId="LOCAL_INDEPENDENT_CHECK"}={}){
 if(typeof dir!=="string"||!dir.trim())throw Error("MISSING_BUILD_DIRECTORY");
 const path=resolve(dir);
 const raw=await readFile(join(path,"manifest.json"),"utf8");
 const manifest=JSON.parse(raw);
 const checks=[],files={};
 checks.push(passes("real_source_manifest",manifest.schema==="x1.self-build.canary/1"&&manifest.codeGenerated===true,manifest.schema));
 checks.push(passes("known_template",manifest.templateId==="app-client-crm",manifest.templateId));
 checks.push(passes("self_build_completed",manifest.selfCheck==="PASS",manifest.selfCheck));
 checks.push(passes("immutable_plan",/^[a-f0-9]{64}$/.test(manifest.planSha256||""),"sha256 plan"));
 checks.push(passes("no_production_permission",manifest.productionAuthorized===false&&manifest.releaseEligible===false&&!manifest.publishedUrl,"release blocked"));
 checks.push(passes("no_real_data_or_spend",manifest.realClientData===false&&manifest.externalCalls===0&&manifest.paidProvisioning===0,"synthetic only"));
 if(expectedSourceSha)checks.push(passes("source_sha_pinned",manifest.sourceSha===expectedSourceSha,manifest.sourceSha));
 for(const name of ["index.html","styles.css","app.js","README.md"]){
  const content=await readFile(join(path,name),"utf8");
  files[name]=content;
  checks.push(passes("file_hash_"+name,sha(content)===manifest.files[name],manifest.files[name]||"missing"));
  checks.push(passes("file_has_substance_"+name,content.length>250,String(content.length)+" bytes"));
 }
 checks.push(passes("html_noindex",/name="robots" content="noindex,nofollow"/.test(files["index.html"]),"noindex,nofollow"));
 checks.push(passes("real_html_ui",/<main id="content">/.test(files["index.html"])&&/id="lead-dialog"/.test(files["index.html"])&&/id="main-nav"/.test(files["index.html"]),"live UI controls"));
 checks.push(passes("linked_source",files["index.html"].includes("./styles.css")&&files["index.html"].includes("./app.js"),"CSS+JS linked"));
 checks.push(passes("no_placeholders",!files["index.html"].includes("%%"),"all content bound"));
 checks.push(passes("responsive_layout",files["styles.css"].includes("@media(max-width:820px)")&&files["styles.css"].includes("@media(max-width:510px)"),"820,510 breakpoints"));
 checks.push(passes("app_interactions",["addEventListener","localStorage","showModal","Export CSV","changeStatus","data-view"].every(z=>(files["app.js"]+files["index.html"]).includes(z)),"dynamic local interactions"));
 checks.push(passes("no_outbound_calls",!/\bfetch\s*\(|XMLHttpRequest|sendBeacon\s*\(|new WebSocket|https?:\/\//.test(files["app.js"]),"no network-capable app code"));
 const synt=spawnSync(process.execPath,["--check",join(path,"app.js")],{timeout:8000,shell:false,encoding:"utf8"});
 checks.push(passes("app_script_syntax",synt.status===0,synt.status===0?"node --check PASS":String(synt.stderr).slice(0,180)));
 const passed=checks.every(x=>x.pass);
 const receipt={schema:"x1.qa.canary/1",id:"qa-"+sha(manifest.planSha256+"|"+independentRunId).slice(0,18),
  buildId:manifest.id,templateId:manifest.templateId,sourceSha:manifest.sourceSha,
  planSha256:manifest.planSha256,runId:independentRunId,
  qaOwner:"SEPARATE_QA_RUNNER",builderOwner:"X1_DETERMINISTIC_COMPILER",
  sourceAndStaticTests:passed?"PASS":"FAIL",browserScreenshots:"NOT_EXECUTED",
  visualParity:"NOT_CERTIFIED",clientSecurityReview:"NOT_EXECUTED",
  status:passed?"STATIC_VALIDATED_BROWSER_QA_PENDING":"FAILED",
  productionRelease:false,checks};
 return receipt;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir=process.argv[2];
 const expected=process.env.GITHUB_SHA||null;
 validateGeneratedApp(dir,{expectedSourceSha:expected,independentRunId:process.env.GITHUB_RUN_ID||"LOCAL_INDEPENDENT_CHECK"}).then(async r=>{
  await writeFile(join(resolve(dir),"independent-qa-receipt.json"),JSON.stringify(r,null,2)+"\n");
  process.stdout.write(JSON.stringify({result:r.status,checks:r.checks.length,passes:r.checks.filter(c=>c.pass).length,failed:r.checks.filter(c=>!c.pass),id:r.id})+"\n");
  if(r.sourceAndStaticTests!=="PASS")process.exitCode=1;
 }).catch(e=>{process.stderr.write(String(e.message||e)+"\n");process.exitCode=1;});
}

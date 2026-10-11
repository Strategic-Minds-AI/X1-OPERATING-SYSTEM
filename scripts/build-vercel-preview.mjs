import {rm,mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve,join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {compileCanary} from "../src/self-build-canary.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const out=join(root,"dist");
const compiled=await compileCanary({
 templateId:"app-client-crm",
 objective:"Build a premium client command center with real browser-local lead creation, searching, pipeline status changes, and CSV export",
 sourceSha:process.env.VERCEL_GIT_COMMIT_SHA&&/^[a-f0-9]{40}$/.test(process.env.VERCEL_GIT_COMMIT_SHA)?process.env.VERCEL_GIT_COMMIT_SHA:"LOCAL_UNPINNED"
});
await rm(out,{recursive:true,force:true});
await mkdir(join(out,"client-command"),{recursive:true});
const landing=await readFile(join(root,"preview-assets","index.html"),"utf8");
await writeFile(join(out,"index.html"),landing,"utf8");
for(const [name,data] of Object.entries(compiled.files)){
 await writeFile(join(out,"client-command",name),data,"utf8");
}
await writeFile(join(out,"client-command","manifest.json"),JSON.stringify({
 ...compiled.manifest,
 sourceAndStaticTests:"PENDING_INDEPENDENT_CI",
 visualParity:"NOT_CERTIFIED",
 browserInteractions:"NOT_AUTOMATED_IN_THIS_BUILD",
 releaseEligible:false
},null,2)+"\n","utf8");
console.log(JSON.stringify({result:"STATIC_PREVIEW_GENERATED",files:Object.keys(compiled.files).length+2,project:compiled.plan.title,previewOnly:true,productionAuthorized:false}));

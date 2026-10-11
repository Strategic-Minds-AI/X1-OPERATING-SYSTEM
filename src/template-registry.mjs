import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
export const CATALOG=Object.freeze(JSON.parse(readFileSync(new URL("../templates/catalog.json",import.meta.url),"utf8")));
const VALID=/^[a-f0-9]{40}$|^[a-f0-9]{64}$/;
const byId=new Map(CATALOG.templates.map(t=>[t.id,Object.freeze(t)]));
const VALID_FIELDS=new Set(["source_sha","tenant_id","objective","audience","known_facts","verified_facts","constraints"]);
export function getTemplate(id){return byId.get(id)||null;}
export function listTemplates({family,query="",limit=120}={}){
 if(family!==undefined&&!CATALOG.families.includes(family))throw Error("UNRECOGNIZED_FAMILY");
 if(typeof query!=="string"||query.length>180)throw Error("INVALID_SEARCH");
 if(!Number.isInteger(limit)||limit<1||limit>120)throw Error("INVALID_LIMIT");
 const q=query.trim().toLowerCase();
 return CATALOG.templates.filter(t=>(!family||t.family===family)&&(!q||[t.id,t.title,t.composition||"",t.family].some(s=>s.toLowerCase().includes(q)))).slice(0,limit);
}
export function catalogueReport(){return {
 schema:CATALOG.schema,version:CATALOG.version,total:CATALOG.templates.length,
 families:Object.fromEntries(CATALOG.families.map(f=>[f,listTemplates({family:f}).length])),
 implemented:CATALOG.templates.filter(t=>t.implementation!=="SCHEMA_ONLY"&&t.implementation!=="SPEC_ONLY").length,
 visuallyApproved:0,productionCertified:0,
 executionConnected:false,previewPublishAllowed:false
};}
export function draftFromTemplate(id,values={},sourceSha="UNBOUND"){
 const t=getTemplate(id);if(!t)throw Error("UNKNOWN_TEMPLATE");
 if(!values||typeof values!=="object"||Array.isArray(values))throw Error("INVALID_INPUT");
 if(sourceSha!=="UNBOUND"&&!VALID.test(sourceSha))throw Error("INVALID_SOURCE_SHA");
 const invalid=Object.keys(values).filter(k=>!t.intake.includes(k));
 if(invalid.length)throw Error("EXTRANEOUS_INPUT");
 for(const [k,v] of Object.entries(values)){
  if(typeof v!=="string" || v.length>3000 || /[\u0000-\u001f]/.test(v))throw Error("INVALID_FIELD_VALUE:"+k);
 }
 const clean=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,v.trim()]).filter(([,v])=>v));
 const missing=t.intake.filter(k=>!clean[k]);
 const digest=createHash("sha256").update(JSON.stringify({version:CATALOG.version,id,clean,sourceSha})).digest("hex");
 return Object.freeze({
  id:"draft-"+digest.slice(0,18),catalogVersion:CATALOG.version,templateId:t.id,
  templateFamily:t.family,sourceSha,planHash:digest,values:clean,missing,
  deliverables:t.deliverables,gates:t.gates,status:"DRAFT_NOT_DISPATCHED",
  productionAuthorized:false,authorizedCostCents:0,externalCalls:0,
  qaStatus:"NOT_RUN",visualParity:"NOT_TESTED",
  warning:"This is a template intake document only. No code, production site, or agent worker has been generated."
 });
}
function escapeMd(s){return String(s).replace(/[\r\n]/g," ").replace(/[<>]/g,c=>c==="<"?"&lt;":"&gt;").slice(0,3000);}
export function renderTemplateDocument(t, draft){
 if(!t?.id||!t.intake||!t.deliverables)throw Error("INVALID_TEMPLATE");
 if(draft&&draft.templateId!==t.id)throw Error("MISMATCHED_DRAFT");
 return [
 "# "+t.title,"",
 "**Template ID:** "+t.id+"  ",
 "**Family:** "+t.family+"  ",
 "**Version:** "+t.version+"  ",
 "**State:** "+t.readiness+"  ",
 "**Source:** "+t.donor+"  ",
 "**Execution:** NOT RUN · **Production:** NOT AUTHORIZED","",
 "## Purpose",
 "Reusable planning and implementation contract. Original design composition, truthful facts, tenant isolation and independent proof are required before release.",
 "","## Intake checklist",
 ...t.intake.map(k=>{
  const value=draft?.values?.[k];
  return "- ["+(value?"x":" ")+"] **"+k+"**"+(value?": "+escapeMd(value):": [INPUT REQUIRED]");
 }),
 "","## Required outputs",
 ...t.deliverables.map(s=>"- [ ] "+s),
 "","## Mandatory gates",
 ...t.gates.map(s=>"- [ ] "+s),
 "","## Approval and operating limits",
 "- Source SHA pinned: "+(draft?.sourceSha||"NOT SET"),
 "- Owner approval is required for external customer contact, production deployment, paid provisioning, domain/DNS, social posts, production data/RLS, secrets and permissions.",
 "- No independent validator evidence yet. Documents do not imply deployed software or 100 working websites.",
 "- Ensure regulatory review for sensitive industries and prohibit misleading scaled location/doorway pages.",
 "","## Handoff receipt",
 "- Template revision: "+t.version,
 "- Immutable input hash: "+(draft?.planHash||"NOT PREPARED"),
 "- Missing fields: "+(draft?.missing?.join(", ")||"NOT EVALUATED"),
 "- Current QA result: NOT RUN",
 "- Rollback SHA: [REQUIRED BEFORE BRANCH EDIT]",
 ""].join("\n");
}
export function matchTemplate(text,{limit=5}={}){
 if(typeof text!=="string"||text.length>2000)throw Error("INVALID_QUERY");
 if(!Number.isInteger(limit)||limit<1||limit>10)throw Error("INVALID_LIMIT");
 const tokens=[...new Set((text.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>w.length>2))];
 return CATALOG.templates.map(t=>{
  const title=t.title.toLowerCase(),words=(t.title+" "+t.id).toLowerCase();
  const score=tokens.reduce((n,w)=>n+(title.includes(w)?3:words.includes(w)?1:0),0);
  return {template:t,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.template.id.localeCompare(b.template.id)).slice(0,limit).map(x=>({...x.template,matchScore:x.score}));
}

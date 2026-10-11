import {createHash} from "node:crypto";
import {renderInstantEstimatePreview} from "./instant-estimate-preview.mjs";

/** Extracted contracts, NOT the Base44 runtime:
 * WebsiteFactory config.primary_city / primary_state and configured state,
 * packSync translatePack section_id/section_type/content/enabled,
 * VisualEditor section-based edit/preview model,
 * Instant Estimate multistep flow. See docs/BATCH_WIZARD_DONOR_LINEAGE.md.
 */
export const TEN_APPROVED_CANDIDATE_MARKETS=Object.freeze([
  "Fort Lauderdale","Pompano Beach","Boca Raton","Deerfield Beach","Hollywood",
  "Davie","Plantation","Coral Springs","Delray Beach","West Palm Beach"
]);
export const DESIGN_KEY="instant-estimate";
export const LOCKED_REFERENCE="https://website-launch-engine-xps.vercel.app/";
export const POLICY_VERSION="ddos-preview-only-v1";
export const PREVIEW_STATES=Object.freeze(["configured","markets_approved","preview_authorized","preview_ready","failed"]);
export const BASE_PACK=Object.freeze({
 template_key:DESIGN_KEY,kind:"web_pack",brand_config:{company_name:"Strategic Minds AI",phone:"(772) 209-0266",state:"Florida"},
 sections:[
  {section_id:"hero",section_type:"hero",enabled:true,content:{headline:"Your garage. Reimagined.",body:"Explore an epoxy flooring estimate experience built for your project."}},
  {section_id:"benefits",section_type:"benefits",enabled:true,content:{headline:"Built around your project",body:"Choose a system, explore finish options, and outline the work before requesting a detailed quote."}},
  {section_id:"process",section_type:"process",enabled:true,content:{headline:"Simple from first step to final finish",body:"Tell us the size, existing condition and finish you are considering."}},
  {section_id:"estimate",section_type:"estimate",enabled:true,content:{headline:"Start your Instant Estimate",body:"Use this preview form to outline a project. No information is sent or stored."}},
  {section_id:"faq",section_type:"faq",enabled:true,content:{headline:"Questions, answered",body:"Final material choices, preparation and pricing depend on an assessment of your floor."}}
 ]
});
export function hash(value){return createHash("sha256").update(JSON.stringify(value)).digest("hex");}
export class BatchError extends Error{constructor(code){super(code);this.code=code;}}
function insist(condition,code){if(!condition)throw new BatchError(code);}
function text(value,limit=260){insist(typeof value==="string" && value.trim().length>0 && value.trim().length<=limit,"INVALID_TEXT");return value.trim();}
export function normalizeSections(sections=BASE_PACK.sections){
 insist(Array.isArray(sections)&&sections.length===5,"SECTIONS_REQUIRE_FIVE_CANONICAL_BLOCKS");
 const expected=BASE_PACK.sections.map(x=>x.section_id);
 insist(sections.map(x=>x.section_id).sort().join("|")===expected.sort().join("|"),"SECTION_STRUCTURE_CHANGED");
 return sections.map(s=>({
   section_id:s.section_id,
   section_type:BASE_PACK.sections.find(x=>x.section_id===s.section_id).section_type,
   enabled:s.enabled!==false,
   content:{headline:text(s.content?.headline,120),body:text(s.content?.body,360)}
 }));
}
export function proposeBatch({quantity=10,templateKey=DESIGN_KEY,markets=TEN_APPROVED_CANDIDATE_MARKETS,sections=BASE_PACK.sections}={}){
 insist(quantity===10,"SYNTHETIC_QUANTITY_MUST_BE_TEN");
 insist(templateKey===DESIGN_KEY,"LOCKED_TEMPLATE_ONLY");
 insist(Array.isArray(markets)&&markets.length===10,"TEN_MARKETS_REQUIRED");
 insist(new Set(markets).size===10 && markets.every(m=>TEN_APPROVED_CANDIDATE_MARKETS.includes(m)),"MARKET_NOT_IN_APPROVED_CANDIDATE_SET");
 const normalized=normalizeSections(sections);
 const input={version:POLICY_VERSION,quantity,templateKey,markets:[...markets],sections:normalized};
 return Object.freeze({
  ...input,planHash:hash(input),status:"configured",marketScore:"UNSCORED_USER_SUPPLIED",
  mode:"SYNTHETIC_LOCAL_ONLY",designReference:LOCKED_REFERENCE,
  visualParity:"NOT_TESTED",productionAllowed:false,paidProvisioningAllowed:false,
  providerIntegration:"NOT_CONNECTED",sourceLineage:"DONOR_ADAPTED_SECTION_AND_ESTIMATOR_CONTRACTS"
 });
}
export function approveMarkets(plan,approval){
 insist(plan.status==="configured","MARKET_APPROVAL_OUT_OF_ORDER");
 insist(approval?.planHash===plan.planHash,"STALE_PLAN");
 insist(approval?.intent==="APPROVE_SYNTHETIC_MARKETS","EXPLICIT_MARKET_APPROVAL_REQUIRED");
 const actor=text(approval.actor,90);
 return Object.freeze({...plan,status:"markets_approved",marketApproval:Object.freeze({actor,planHash:plan.planHash,synthetic:true})});
}
export function authorizePreview(plan,approval){
 insist(plan.status==="markets_approved" && plan.marketApproval?.planHash===plan.planHash,"PREVIEW_REQUIRES_MARKET_APPROVAL");
 insist(approval?.intent==="APPROVE_TEN_LOCAL_PREVIEWS"&&approval.planHash===plan.planHash,"EXPLICIT_PREVIEW_APPROVAL_REQUIRED");
 const actor=text(approval.actor,90);
 insist(actor===plan.marketApproval.actor,"APPROVAL_ACTOR_MISMATCH");
 return Object.freeze({...plan,status:"preview_authorized",previewApproval:Object.freeze({actor,planHash:plan.planHash,synthetic:true})});
}
export function buildSyntheticPreviewBatch(plan){
 insist(plan.status==="preview_authorized","BUILD_REQUIRES_TWO_APPROVALS");
 insist(plan.quantity===10 && plan.mode==="SYNTHETIC_LOCAL_ONLY" && plan.productionAllowed===false,"PRODUCTION_PROHIBITED");
 insist(plan.previewApproval?.planHash===plan.planHash,"PREVIEW_APPROVAL_MISMATCH");
 const pages=plan.markets.map((city,index)=>{
  const slug=city.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  const id="preview-"+String(index+1).padStart(2,"0")+"-"+slug;
  const html=renderInstantEstimatePreview({city,state:"Florida",sections:plan.sections,brand:BASE_PACK.brand_config,planHash:plan.planHash});
  return Object.freeze({id,city,state:"Florida",status:"preview_ready",localPath:"/previews/"+id+".html",html,sha256:hash(html),
   siteIndex:index+1,realDeploymentUrl:null,independentQAPassed:false,productionEligible:false});
 });
 insist(new Set(pages.map(p=>p.id)).size===10,"DUPLICATE_PREVIEW_ID");
 return Object.freeze({batchId:"batch-"+plan.planHash.slice(0,18),planHash:plan.planHash,
   state:"preview_ready",sites:pages,createdFor:"LOCAL_SYNTHETIC_QA",
   receipts:pages.map(p=>({id:p.id,contentSha256:p.sha256,build:"GENERATED_LOCAL_HTML",browserQA:"NOT_RUN",status:"UNVALIDATED"})),
   productionProvisioned:false,networkCalls:0,paidCalls:0,
   releaseApproval:null,independentQAPassed:false});
}
export function verifyGeneratedBatch(batch){
 insist(batch.state==="preview_ready"&&batch.sites.length===10,"INVALID_SYNTHETIC_BATCH");
 const checks=batch.sites.map(site=>{
  const html=site.html,observed=hash(html),failures=[];
  if(observed!==site.sha256)failures.push("HASH_MISMATCH");
  if(!html.includes('<meta name="robots" content="noindex,nofollow">'))failures.push("NOT_NOINDEX");
  if(!html.includes("SYNTHETIC PREVIEW"))failures.push("MISSING_DEMO_BANNER");
  if(!html.includes('<form id="estimate-form"'))failures.push("MISSING_FORM");
  if(!html.includes('name="viewport"'))failures.push("MISSING_VIEWPORT");
  if(!html.includes('type="button" id="details-back"'))failures.push("MISSING_BACK_CONTROL");
  if(!html.includes('name="finish"'))failures.push("MISSING_FINISH_INPUT");
  if(!html.includes("No information is sent"))failures.push("MISSING_PRIVACY_WARNING");
  return {siteId:site.id,sha256:observed,staticChecks:failures.length===0?"PASS":"FAIL",failures,independentBrowserQA:"NOT_PERFORMED",visualParity:"NOT_TESTED"};
 });
 return Object.freeze({kind:"STATIC_SYNTHETIC_QA_RECEIPT",planHash:batch.planHash,checks,
   staticGate:checks.every(x=>x.staticChecks==="PASS")?"PASS":"FAIL",
   browserGate:"BLOCKED_NOT_RUN",releaseGate:"BLOCKED_NOT_AUTHORIZED",
   certifiedForRelease:false,independentFullBrowserPasses:0});
}

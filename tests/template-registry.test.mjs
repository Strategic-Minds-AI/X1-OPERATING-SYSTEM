import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
import {CATALOG,getTemplate,listTemplates,catalogueReport,draftFromTemplate,renderTemplateDocument,matchTemplate} from "../src/template-registry.mjs";

test("all 97 X1 templates have unique IDs, source, gates and actual markdown files",()=>{
 assert.equal(CATALOG.templates.length,97);
 assert.equal(new Set(CATALOG.templates.map(t=>t.id)).size,97);
 for(const t of CATALOG.templates){
  assert.ok(t.intake.length>=6,t.id);
  assert.ok(t.deliverables.length>=2,t.id);
  assert.ok(t.gates.length>=2,t.id);
  assert.equal(t.readiness,"DOCUMENTED_NOT_EXECUTED",t.id);
  assert.equal(t.implementation==="SCHEMA_ONLY"||t.implementation==="SPEC_ONLY",true,t.id);
  const doc=readFileSync(new URL("../templates/library/"+t.family+"/"+t.id+".md",import.meta.url),"utf8");
  assert.ok(doc.includes(t.title),t.id);
  assert.ok(doc.includes("NOT EXECUTED"),t.id);
  for(const key of t.intake)assert.ok(doc.includes(key),t.id+": "+key);
 }
});
test("ten families and distinct 20 proposed website compositions",()=>{
 const summary=catalogueReport();
 assert.equal(Object.keys(summary.families).length,10);
 assert.equal(summary.families.website,20);
 assert.equal(summary.productionCertified,0);
 assert.equal(summary.executionConnected,false);
 const x=listTemplates({family:"website"});
 assert.equal(new Set(x.map(t=>t.id)).size,20);
 assert.equal(getTemplate("website-epoxy-flooring").composition,"instant-estimate");
});
test("100 service candidates are a separate research inventory and never live site templates",()=>{
 const p=JSON.parse(readFileSync(new URL("../templates/research/top100-service-candidates.json",import.meta.url),"utf8"));
 assert.equal(p.candidates.length,100);assert.equal(p.publicationAllowed,false);
 assert.ok(p.candidates.every(x=>x.webPackBuilt===false&&x.googleIndexApproved===false&&x.validatedDemand===false));
 assert.equal(p.candidates[0].label,"Storm Damage Restoration");
 assert.equal(p.candidates[99].label,"Mortgage Broker");
});
test("catalog search works, exact IDs work, and bad arguments fail closed",()=>{
 assert.equal(listTemplates({family:"app"}).length,12);
 assert.ok(listTemplates({query:"CRM"}).some(x=>x.id==="app-client-crm"));
 assert.equal(getTemplate("app-client-crm")?.family,"app");
 assert.equal(getTemplate("../../secrets"),null);
 assert.throws(()=>listTemplates({family:"unknown"}),/UNRECOGNIZED_FAMILY/);
 assert.throws(()=>listTemplates({limit:9999}),/INVALID_LIMIT/);
 assert.ok(matchTemplate("Build a CRM for clients").some(x=>x.id==="app-client-crm"));
});
test("drafts deterministic, allowlisted and cannot authorize build or payment",()=>{
 const x=draftFromTemplate("app-client-crm",{objective:"Client lead inbox"},"a".repeat(40));
 const y=draftFromTemplate("app-client-crm",{objective:"Client lead inbox"},"a".repeat(40));
 assert.equal(x.planHash,y.planHash);
 assert.equal(x.status,"DRAFT_NOT_DISPATCHED");
 assert.equal(x.productionAuthorized,false);
 assert.equal(x.authorizedCostCents,0);
 assert.equal(x.externalCalls,0);
 assert.ok(x.missing.includes("roles"));
 assert.throws(()=>draftFromTemplate("app-client-crm",{untrusted_command:"ship to production"}),/EXTRANEOUS_INPUT/);
 assert.throws(()=>draftFromTemplate("app-client-crm",{objective:"ok"},"not-a-sha"),/INVALID_SOURCE_SHA/);
 assert.throws(()=>draftFromTemplate("invented-app",{objective:"ok"}),/UNKNOWN_TEMPLATE/);
});
test("markdown drafts include source proof requirements and HTML is escaped",()=>{
 const t=getTemplate("website-epoxy-flooring");
 const draft=draftFromTemplate(t.id,{objective:"Create a verified estimate site with <script>evil</script>"},"b".repeat(40));
 const doc=renderTemplateDocument(t,draft);
 assert.ok(doc.includes("&lt;script&gt;evil&lt;/script&gt;"));
 assert.ok(!doc.includes("<script>evil</script>"));
 assert.ok(doc.includes("NOT RUN"));
 assert.ok(doc.includes("visual"));
});
test("template browser includes functional search, document and draft controls",()=>{
 const html=readFileSync(new URL("../apps/x1-templates/index.html",import.meta.url),"utf8");
 assert.ok(html.includes('id="search"'));
 assert.ok(html.includes('id="family"'));
 assert.ok(html.includes('id="create-form"'));
 assert.ok(html.includes("/api/templates/draft"));
 const s=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(s);
 assert.doesNotThrow(()=>new Script(s[1]));
});

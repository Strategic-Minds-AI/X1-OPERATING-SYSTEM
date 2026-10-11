import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {planCanary,compileCanary,materializeCanary} from "../src/self-build-canary.mjs";
import {validateGeneratedApp} from "../src/self-build-validator.mjs";
const fixture={templateId:"app-client-crm",objective:"Build a premium client CRM dashboard with demo leads, status pipeline, and interactive navigation",
 sourceSha:"a".repeat(40)};
test("X1 creates a deterministic source-verified canary plan",async()=>{
 const a=planCanary(fixture),b=planCanary(fixture);
 assert.equal(a.id,b.id);
 assert.equal(a.planSha256,b.planSha256);
 assert.equal(a.productionAuthorized,false);
 assert.equal(a.paidProvisioning,0);
 assert.equal(a.modelGeneration,false);
 const p=await compileCanary(fixture);
 assert.equal(Object.keys(p.files).length,4);
 assert.match(p.files["index.html"],/Client Command Center/);
 assert.match(p.files["app.js"],/localStorage/);
 assert.match(p.files["styles.css"],/@media/);
});
test("disallows unapproved templates, unpinned source and unsafe objective",()=>{
 assert.throws(()=>planCanary({...fixture,templateId:"app-untrusted"}),/CANARY_TEMPLATE_NOT_SUPPORTED/);
 assert.throws(()=>planCanary({...fixture,sourceSha:"bad"}),/SOURCE_SHA_INVALID/);
 assert.throws(()=>planCanary({...fixture,objective:"hi"}),/INVALID_OBJECTIVE/);
});
test("escapes user-provided script contents in generated HTML",async()=>{
 const p=await compileCanary({...fixture,objective:"Build an app with <script>alert(1)</script> but never execute that text"});
 assert.ok(p.files["index.html"].includes("&lt;script&gt;"));
 assert.ok(!p.files["index.html"].includes("<script>alert(1)</script>"));
});
test("writes real HTML/CSS/JS files and separately validates SHA and syntax",async()=>{
 const build=await materializeCanary(fixture);
 assert.equal(build.status,"CODE_GENERATED_SELF_CHECK_PASS_INDEPENDENT_QA_NOT_RUN");
 assert.equal(build.manifest.independentQa,"NOT_RUN");
 const js=await readFile(build.dir+"/app.js","utf8");
 assert.ok(js.includes("function renderLeads"));
 const r=await validateGeneratedApp(build.dir,{expectedSourceSha:fixture.sourceSha,independentRunId:"ci-demo-validator"});
 assert.equal(r.sourceAndStaticTests,"PASS",JSON.stringify(r.checks.filter(c=>!c.pass)));
 assert.equal(r.browserScreenshots,"NOT_EXECUTED");
 assert.equal(r.productionRelease,false);
 assert.ok(r.checks.length>=20);
 const mismatched=await validateGeneratedApp(build.dir,{expectedSourceSha:"b".repeat(40)});
 assert.equal(mismatched.sourceAndStaticTests,"FAIL");
});

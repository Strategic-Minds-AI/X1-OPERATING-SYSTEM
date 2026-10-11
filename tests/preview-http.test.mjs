import test from "node:test";
import assert from "node:assert/strict";
import {createWizardServer} from "../src/wizard-server.mjs";
test("ten localhost HTML routes require both approvals",async()=>{
 const server=createWizardServer();
 await new Promise((resolve,reject)=>server.once("error",reject).listen(4391,"127.0.0.1",resolve));
 const base="http://127.0.0.1:4391";
 const send=(path,payload)=>fetch(base+path,{method:"POST",headers:{"Origin":base,"Content-Type":"application/json"},body:JSON.stringify(payload)});
 try{
  const root=await fetch(base+"/");
  assert.equal(root.status,200);
  const studio=await fetch(base+"/studio");
  assert.equal(studio.status,200);
  assert.match(await studio.text(),/Build with a conversation/);
  const preview=await fetch(base+"/api/studio/preview");
  assert.equal(preview.status,200);
  assert.match(await preview.text(),/noindex,nofollow/);
  const visual=await send("/api/studio/message",{message:"Set hero headline to The X1 Studio makes edits"});
  assert.equal(visual.status,200);
  const applied=await visual.json();
  assert.equal(applied.result.status,"APPLIED_TO_LOCAL_DRAFT");
  assert.equal(applied.state.plan.sections[0].content.headline,"The X1 Studio makes edits");
  const unbound=await (await send("/api/studio/message",{message:"Build a complete customer CRM and dashboard"})).json();
  assert.equal(unbound.result.status,"DRAFT_NOT_DISPATCHED");
  assert.equal(unbound.result.mission.jobId,null);
  assert.equal(unbound.state.capabilities.x1LeaseExecution,"BLOCKED_AUTH_AND_SINGLE_SUPERVISOR");
  const before=await send("/api/generate",{});
  assert.equal(before.status,422);
  const state=await (await fetch(base+"/api/state")).json();
  const hash=state.plan.planHash;
  assert.equal((await send("/api/approve-markets",{planHash:hash,intent:"APPROVE_SYNTHETIC_MARKETS"})).status,200);
  assert.equal((await send("/api/approve-preview",{planHash:hash,intent:"APPROVE_TEN_LOCAL_PREVIEWS"})).status,200);
  const generated=await (await send("/api/generate",{})).json();
  assert.equal(generated.batch.sites.length,10);
  assert.equal(generated.receipt.staticGate,"PASS");
  for(const site of generated.batch.sites){
   const response=await fetch(base+site.localPath);
   assert.equal(response.status,200);
   assert.match(response.headers.get("x-robots-tag"),/noindex/);
  }
 }finally{await new Promise(resolve=>server.close(resolve));}
});

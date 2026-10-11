import test from "node:test";
import assert from "node:assert/strict";
import {proposeBatch, approveMarkets, authorizePreview, buildSyntheticPreviewBatch, verifyGeneratedBatch} from "../src/batch-wizard.mjs";
test("ten sites planned using approved candidate markets", () => {
 const p=proposeBatch();
 assert.equal(p.quantity,10);
 assert.equal(p.status,"configured");
 assert.equal(p.templateKey,"instant-estimate");
 assert.equal(p.productionAllowed,false);
});
test("generation blocked without market approval",()=>{
 assert.throws(()=>buildSyntheticPreviewBatch(proposeBatch()),{code:"BUILD_REQUIRES_TWO_APPROVALS"});
});
test("ten noindex pages produced after two approvals",()=>{
 const plan=proposeBatch();
 const reviewed=approveMarkets(plan,{actor:"synthetic-local-operator",planHash:plan.planHash,intent:"APPROVE_SYNTHETIC_MARKETS"});
 const authorized=authorizePreview(reviewed,{actor:"synthetic-local-operator",planHash:plan.planHash,intent:"APPROVE_TEN_LOCAL_PREVIEWS"});
 const batch=buildSyntheticPreviewBatch(authorized);
 assert.equal(batch.sites.length,10);
 assert.equal(new Set(batch.sites.map(x=>x.id)).size,10);
 assert.ok(batch.sites.every(x=>x.html.includes("noindex,nofollow")));
 assert.ok(batch.sites.every(x=>x.realDeploymentUrl===null));
 assert.equal(batch.productionProvisioned,false);
 const receipt=verifyGeneratedBatch(batch);
 assert.equal(receipt.staticGate,"PASS");
 assert.equal(receipt.browserGate,"BLOCKED_NOT_RUN");
 assert.equal(receipt.certifiedForRelease,false);
});
test("rejects 100-site quantity in protected synthetic workflow",()=>{
 assert.throws(()=>proposeBatch({quantity:100}),{code:"SYNTHETIC_QUANTITY_MUST_BE_TEN"});
});

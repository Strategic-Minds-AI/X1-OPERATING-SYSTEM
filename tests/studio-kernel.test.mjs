import test from "node:test";
import assert from "node:assert/strict";
import {proposeBatch,approveMarkets} from "../src/batch-wizard.mjs";
import {applyLocalVisualEdit,interpretStudioMessage,createStudioMission,STUDIO_PHASES,STUDIO_CAPABILITIES} from "../src/studio-kernel.mjs";

test("bounded chat command actually changes a donor visual-editor section",()=>{
 const p=proposeBatch();
 const m=interpretStudioMessage(p,"Set hero headline to A new garage begins here",{sourceSha:"7".repeat(40)});
 assert.equal(m.mode,"LOCAL_VISUAL_EDIT");
 assert.equal(m.status,"APPLIED_TO_LOCAL_DRAFT");
 assert.equal(m.edit.plan.sections[0].content.headline,"A new garage begins here");
 assert.notEqual(m.edit.plan.planHash,p.planHash);
 assert.equal(m.edit.plan.status,"configured");
 assert.equal(m.edit.operation,"LOCAL_SECTION_DRAFT_ONLY");
});
test("changing a previously approved pack invalidates approval",()=>{
 const p=proposeBatch();
 const authorized=approveMarkets(p,{actor:"synthetic-local-operator",planHash:p.planHash,intent:"APPROVE_SYNTHETIC_MARKETS"});
 const edit=applyLocalVisualEdit(authorized,{sectionId:"faq",field:"body",value:"Unique example FAQ text"});
 assert.equal(edit.plan.status,"configured");
 assert.equal(edit.plan.marketApproval,undefined);
 assert.equal(edit.plan.previewApproval,undefined);
});
test("unexpected element and invalid field are rejected",()=>{
 const p=proposeBatch();
 assert.throws(()=>applyLocalVisualEdit(p,{sectionId:"payment",field:"headline",value:"Pay"}),{code:"SECTION_FIELD_NOT_ALLOWED"});
 assert.throws(()=>applyLocalVisualEdit(p,{sectionId:"hero",field:"html",value:"<script>x</script>"}),{code:"SECTION_FIELD_NOT_ALLOWED"});
 assert.throws(()=>applyLocalVisualEdit(p,{sectionId:"hero",field:"headline",value:""}),{code:"EDIT_TEXT_INVALID"});
});
test("arbitrary application requests are non-dispatched plan data, NOT executed",()=>{
 const r=interpretStudioMessage(proposeBatch(),"Build a customer CRM with login and leads",{sourceSha:"f".repeat(40)});
 assert.equal(r.mode,"AUTONOMOUS_MISSION_DRAFT");
 assert.equal(r.status,"DRAFT_NOT_DISPATCHED");
 assert.equal(r.mission.jobId,null);
 assert.equal(r.mission.previewUrl,null);
 assert.equal(r.mission.budgetAuthorizedCents,0);
 assert.equal(r.mission.phases.length,STUDIO_PHASES.length);
 assert.ok(r.mission.phases.every(p=>p.state==="BLOCKED_NOT_RUN"));
 assert.equal(STUDIO_CAPABILITIES.universalCodeGeneration,"BLOCKED_EXECUTOR_NOT_BOUND");
});
test("mission idempotency and input validation",()=>{
 const a=createStudioMission("Build a customer portal",{sourceSha:"a".repeat(40)});
 const b=createStudioMission("Build a customer portal",{sourceSha:"a".repeat(40)});
 assert.equal(a.id,b.id);
 assert.throws(()=>createStudioMission("Hi"),{code:"MISSION_TEXT_REQUIRED"});
});

test("unchanged copy never invalidates an existing approval",()=>{
 const p=proposeBatch();
 const approved=approveMarkets(p,{actor:"synthetic-local-operator",planHash:p.planHash,intent:"APPROVE_SYNTHETIC_MARKETS"});
 const edit=applyLocalVisualEdit(approved,{sectionId:"hero",field:"headline",value:"Your garage. Reimagined."});
 assert.equal(edit.changed,false);
 assert.equal(edit.approvalState,"UNCHANGED");
 assert.equal(edit.plan,approved);
 assert.equal(edit.plan.status,"markets_approved");
});

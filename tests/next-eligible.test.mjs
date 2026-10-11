import test from "node:test";import assert from "node:assert/strict";
import {loadMission} from "../scripts/validate-mission.mjs";
import {planNext} from "../scripts/next-eligible.mjs";
test("next eligible tasks are read only and protected tasks remain held",()=>{
 const x=planNext(loadMission());
 assert.deepEqual(x.eligible.map(y=>y.id),["X1-BOOT-002","X1-BOOT-003"]);
 assert.deepEqual(x.approvalRequired.map(y=>y.id),["X1-BOOT-007","X1-BOOT-010"]);
 assert.equal(x.queued,false);
});
test("new eligible tasks appear deterministically after signed completion would be recorded",()=>{
 const d=loadMission();
 const x=d.tasks.find(y=>y.id==="X1-BOOT-003");
 x.state="VERIFIED";x.evidence="https://github.com/example/verified";
 const result=planNext(d);
 assert.ok(result.eligible.some(y=>y.id==="X1-BOOT-004"));
 assert.ok(result.eligible.some(y=>y.id==="X1-BOOT-008"));
});

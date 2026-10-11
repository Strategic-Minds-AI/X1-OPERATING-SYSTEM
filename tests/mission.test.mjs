import test from "node:test";
import assert from "node:assert/strict";
import {loadMission,validateMission} from "../scripts/validate-mission.mjs";
test("the default X1 mission is valid and unactivated",()=>{const d=loadMission();assert.deepEqual(validateMission(d),[]);assert.equal(d.activation.queueBridge,false);});
test("rejects a cycle and unheld production release",()=>{
 const d=loadMission();const x=d.tasks.find(t=>t.id==="X1-BOOT-001");x.dependsOn=["X1-BOOT-010"];
 const y=d.tasks.find(t=>t.id==="X1-BOOT-010");y.state="PENDING";
 const failures=validateMission(d).join("\n");assert.match(failures,/cycle/);assert.match(failures,/protected task not held/);
});
test("rejects accidental queue activation and spend",()=>{
 const d=loadMission();d.activation.queueBridge=true;d.tasks.find(t=>t.id==="X1-BOOT-004").costLimitUsd=99;
 const failures=validateMission(d).join("\n");assert.match(failures,/unsafe activation/);assert.match(failures,/unapproved spend/);
});

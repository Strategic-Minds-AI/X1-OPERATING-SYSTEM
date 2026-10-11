import test from "node:test";
import assert from "node:assert/strict";
import {IDLE_THRESHOLD_MS,evaluateLocalIdle,LOCAL_IDLE_OPERATIONS,PROTECTED_IDLE_OPERATIONS} from "../src/idle-policy.mjs";
const base={now:600000,lastActivityAt:0,armed:true,alreadyFired:false,operation:"SYNTHETIC_CRM_CANARY_COMPILE",browserOpen:true};
test("exactly 10 minutes of inactivity allows only one safe local synthetic canary",()=>{
 const early=evaluateLocalIdle({...base,now:599999});assert.equal(early.canRun,false);
 const due=evaluateLocalIdle(base);assert.equal(due.canRun,true);assert.equal(due.idleSeconds,600);
 assert.equal(due.allowedProduction,false);
 assert.equal(evaluateLocalIdle({...base,alreadyFired:true}).canRun,false);
});
test("manual pause, closed browser, and active operator block local auto mode",()=>{
 for(const changed of [{armed:false},{browserOpen:false},{lastActivityAt:350000}]){
  assert.equal(evaluateLocalIdle({...base,...changed}).canRun,false);
 }
});
test("no protected production or costly action can use idle mode",()=>{
 for(const operation of PROTECTED_IDLE_OPERATIONS){
  const state=evaluateLocalIdle({...base,operation});
  assert.equal(state.canRun,false,operation);
  assert.equal(state.allowedProduction,false);
 }
 assert.equal(LOCAL_IDLE_OPERATIONS.length,2);
});
test("time rollback and invalid operator state fail closed",()=>{
 assert.throws(()=>evaluateLocalIdle({...base,now:-1}),/INVALID_IDLE_TIMESTAMPS/);
 assert.throws(()=>evaluateLocalIdle({...base,lastActivityAt:600001}),/INVALID_IDLE_TIMESTAMPS/);
 assert.throws(()=>evaluateLocalIdle({...base,armed:"yes"}),/INVALID_IDLE_STATE/);
});

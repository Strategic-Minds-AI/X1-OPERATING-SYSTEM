import test from "node:test";
import assert from "node:assert/strict";
import { createOmniswarmPackets, RESEARCH_LANES, PacketError } from "../src/omniswarm-packets.mjs";

const input = Object.freeze({ missionId: "OMNISWARM_20261011", sourceSha: "ab9f1167d2a5d79be112f77d5c99da7b0c7586b7" });

test("eight defined specialist lanes, unique idempotency keys", () => {
  const packets = createOmniswarmPackets(input);
  assert.equal(packets.length, 8);
  assert.equal(RESEARCH_LANES.length, 8);
  assert.equal(new Set(packets.map(p => p.laneId)).size, 8);
  assert.equal(new Set(packets.map(p => p.idempotencyKey)).size, 8);
});
test("stable across repeated preparation and pinned to the exact source", () => {
  const a = createOmniswarmPackets(input);
  assert.deepEqual(a, createOmniswarmPackets(input));
  const b = createOmniswarmPackets({...input, sourceSha: "7253548029067c17c581ccbfd932c44b2e977567"});
  assert.notEqual(a[0].idempotencyKey, b[0].idempotencyKey);
});
test("no dispatch, spending or release authority conveyed by a packet", () => {
  for (const p of createOmniswarmPackets(input)) {
    assert.equal(p.status, "DRAFT_NOT_DISPATCHED");
    assert.equal(p.dispatched, false);
    assert.equal(p.executorReceipt, null);
    assert.equal(p.maxCostCents, 0);
    assert.equal(p.protectedReleaseAuthorized, false);
    assert.equal(p.actualIndependentAgentExecutionVerified, false);
    assert.equal(p.existingX1LeaseVerified, false);
    assert.equal(p.noNewQueueOrSupervisor, true);
  }
});
test("reject malformed source and missing mission", () => {
  assert.throws(() => createOmniswarmPackets({...input, sourceSha:"main"}), {code:"PINNED_SHA_REQUIRED"});
  assert.throws(() => createOmniswarmPackets({sourceSha:input.sourceSha}), {code:"MISSION_ID_REQUIRED"});
});
test("block protected actions and nonzero requested budgets", () => {
  for (const action of ["PRODUCTION_DEPLOY","OUTBOUND","SOCIAL_PUBLISH","DELETE","EXECUTE"]) {
    assert.throws(() => createOmniswarmPackets({...input,action}), {code:"ACTION_NOT_PERMITTED"});
  }
  assert.throws(() => createOmniswarmPackets({...input,maxCostCents:1}), {code:"UNAPPROVED_COST_NOT_PERMITTED"});
});
test("read and draft are accepted but both remain undispatched", () => {
  for (const action of ["READ","DRAFT"]) {
    const ps=createOmniswarmPackets({...input,action});
    assert.ok(ps.every(p=>p.allowedAction===action&&p.dispatched===false));
  }
});

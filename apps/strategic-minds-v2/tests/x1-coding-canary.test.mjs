import test from "node:test";
import assert from "node:assert/strict";
import { runCodingCanary } from "../api/x1/coding-canary.js";

function response() {
  return {
    headers: {}, statusCode: 200, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    end(value) { this.body = JSON.parse(value); }
  };
}
test("coding canary returns deterministic read-only preview proof", () => {
  const r = response();
  runCodingCanary({ method: "GET" }, r, { VERCEL_ENV: "preview" });
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.status, "SOURCE_CANARY_READY");
  assert.equal(r.body.dispatch, "DISABLED");
  assert.equal(r.body.writes, "DISABLED");
  assert.equal(r.body.proof, "x1-coding-canary-20261011-v1");
  assert.match(r.headers["Cache-Control"], /no-store/);
});
test("production and missing environment fail closed", () => {
  for (const env of [{ VERCEL_ENV: "production" }, {}]) {
    const r = response();
    runCodingCanary({ method: "GET" }, r, env);
    assert.equal(r.statusCode, 404);
    assert.equal(r.body.status, "NOT_AVAILABLE");
  }
});
test("POST is rejected and never dispatches a job", () => {
  const r = response();
  runCodingCanary({ method: "POST" }, r, { VERCEL_ENV: "preview" });
  assert.equal(r.statusCode, 405);
  assert.equal(r.headers.Allow, "GET");
});

import test from "node:test";
import assert from "node:assert/strict";

// Live Preview-only smoke probe. Explicit URL required; never run against production aliases.
// Usage: X1_PREVIEW_URL=https://<immutable-preview-host>.vercel.app node --test tests/x1-preview-smoke.live.mjs
const raw = process.env.X1_PREVIEW_URL;
const enabled = Boolean(raw);
const preview = enabled ? new URL(raw) : null;
const stagingProductionAlias = new Set([
  "x1-operating-system.vercel.app",
  "x1-operating-system-strategic-minds-advisory.vercel.app",
  "strategicmindsai.com"
]);
function isSafePreview(url) {
  return url.protocol === "https:" &&
    url.pathname === "/" && !url.search && !url.hash &&
    url.hostname.endsWith(".vercel.app") &&
    !stagingProductionAlias.has(url.hostname) &&
    !url.username && !url.password;
}
async function probe(path, method = "GET") {
  const response = await fetch(new URL(path, preview), {
    method, redirect: "manual",
    signal: AbortSignal.timeout(12000),
    headers: { accept: "application/json" }
  });
  const contentType = response.headers.get("content-type") || "";
  assert.match(contentType, /application\/json/i, "API route must serve JSON, never SPA HTML");
  const body = await response.json();
  assert.ok(body && typeof body === "object");
  assert.doesNotMatch(JSON.stringify(body), /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEY/i);
  return { response, body };
}

test("target URL is a nonproduction immutable Preview host", { skip: !enabled }, () => {
  assert.equal(isSafePreview(preview), true, "Refuse potentially production target");
});

test("staging health is fail-closed or explicitly configured; never claims connectivity", { skip: !enabled }, async () => {
  assert.equal(isSafePreview(preview), true);
  const { response, body } = await probe("/api/x1/health");
  assert.ok([200, 503].includes(response.status), "Unexpected health status: " + response.status);
  assert.ok(["CONFIGURED_NOT_VALIDATED", "UNBOUND"].includes(body.status));
  assert.equal(body.writes, "DISABLED");
  assert.equal(body.dispatch, "DISABLED");
  assert.match(response.headers.get("cache-control") || "", /no-store/);
});

test("unauthenticated operator request is rejected without private data", { skip: !enabled }, async () => {
  assert.equal(isSafePreview(preview), true);
  const { response, body } = await probe("/api/x1/operator-status");
  assert.equal(response.status, 401);
  assert.equal(body.reason, "AUTHENTICATION_REQUIRED");
});

test("write methods never activate queue or worker", { skip: !enabled }, async () => {
  assert.equal(isSafePreview(preview), true);
  const { response, body } = await probe("/api/x1/operator-status", "POST");
  assert.equal(response.status, 405);
  assert.equal(body.status, "METHOD_NOT_ALLOWED");
});

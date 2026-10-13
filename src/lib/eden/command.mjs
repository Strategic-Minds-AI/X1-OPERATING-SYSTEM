import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { createEdenDraft, EdenContractError } from "./contracts.mjs";

const safeHeaders = Object.freeze({
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
});
const reply = (body, status) => Response.json(body, { status, headers: safeHeaders });

function sameSecret(input, expected) {
  if (typeof input !== "string" || !input || typeof expected !== "string") return false;
  const left = createHash("sha256").update(input).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

/**
 * Internal X1 preview command API. Plans only; never calls providers or writes
 * to the X1 work queue. Auth is an internal scoped bearer, not browser login.
 * @param {{mode?:string,secret?:string}} [options]
 */
export function createEdenCommandHandler(options = {}) {
  return async function handle(request) {
    try {
      if (request.method !== "POST") {
        return reply({ error: "METHOD_NOT_ALLOWED" }, 405);
      }
      if (options.mode !== "preview" || !options.secret || options.secret.length < 32) {
        return reply({ error: "EDEN_PREVIEW_NOT_AUTHORIZED", executed: false }, 503);
      }
      if (request.headers.get("sec-fetch-site") === "cross-site") {
        return reply({ error: "CROSS_SITE_DENIED" }, 403);
      }
      const origin = request.headers.get("origin");
      if (origin && new URL(origin).origin !== new URL(request.url).origin) {
        return reply({ error: "ORIGIN_DENIED" }, 403);
      }
      const header = request.headers.get("authorization") || "";
      const match = /^Bearer ([A-Za-z0-9_-]{32,256})$/.exec(header);
      if (!match || !sameSecret(match[1], options.secret)) {
        return reply({ error: "UNAUTHORIZED" }, 401);
      }
      if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) {
        return reply({ error: "JSON_REQUIRED" }, 415);
      }
      const length = Number(request.headers.get("content-length") || 0);
      if (!Number.isSafeInteger(length) || length > 4096) {
        return reply({ error: "PAYLOAD_TOO_LARGE" }, 413);
      }
      const text = await request.text();
      if (text.length > 4096) {
        return reply({ error: "PAYLOAD_TOO_LARGE" }, 413);
      }
      let body;
      try { body = JSON.parse(text); } catch {
        return reply({ error: "INVALID_JSON" }, 400);
      }
      let packet;
      try { packet = createEdenDraft(body); } catch (error) {
        if (error instanceof EdenContractError) {
          return reply({ error: error.code, executed: false }, 400);
        }
        throw error;
      }
      const id = createHmac("sha256", options.secret).update(JSON.stringify(packet)).digest("hex").slice(0, 28);
      return reply({
        status: "DRAFT_NOT_DISPATCHED",
        draft_id: "eden-" + id,
        packet,
        stored: false,
        dispatched: false,
        customer_contacted: false,
        billable_actions: 0
      }, 200);
    } catch {
      return reply({ error: "EDEN_PREVIEW_UNAVAILABLE", executed: false }, 503);
    }
  };
}

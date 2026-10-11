// X1 development/preview-only coding canary: deterministic, read-only, and dependency-free.
import { respond } from "../../server/x1-staging.mjs";

export function runCodingCanary(req, res, env = process.env) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return respond(res, 405, { status: "METHOD_NOT_ALLOWED" });
  }
  if (!["preview", "development"].includes(env.VERCEL_ENV)) {
    return respond(res, 404, { status: "NOT_AVAILABLE" });
  }
  return respond(res, 200, {
    service: "x1-coding-canary",
    status: "SOURCE_CANARY_READY",
    environment: "NON_PRODUCTION",
    dispatch: "DISABLED",
    writes: "DISABLED",
    proof: "x1-coding-canary-20261011-v1"
  });
}

export default function handler(req, res) {
  return runCodingCanary(req, res);
}

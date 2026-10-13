import { createEdenCommandHandler } from "@/lib/eden/command.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Staging-only, internal bearer authentication. No public browser token.
// This route creates an in-memory draft; it never sends messages or queues work.
export async function POST(request: Request): Promise<Response> {
  return createEdenCommandHandler({
    mode: process.env.X1_EDEN_MODE,
    secret: process.env.X1_EDEN_PREVIEW_TOKEN
  })(request);
}

export function GET(): Response {
  return Response.json({ error: "METHOD_NOT_ALLOWED" }, {
    status: 405, headers: { "Cache-Control": "no-store" }
  });
}

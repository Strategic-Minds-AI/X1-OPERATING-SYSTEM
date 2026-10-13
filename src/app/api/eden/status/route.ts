import { createEdenReadiness } from "@/lib/eden/contracts.mjs";

export const dynamic = "force-dynamic";

// Disclosure-friendly readiness only. Environment presence is not live validation.
export function GET(): Response {
  const snapshot = createEdenReadiness({
    gatewayConfigured: Boolean(process.env.X1_GATEWAY_API_KEY),
    queueConfigured: Boolean(process.env.X1_RAILWAY_WORKER_URL),
    rendererConfigured: Boolean(process.env.X1_RENDERER_URL),
    communicationsConfigured: Boolean(process.env.X1_COMMUNICATIONS_GATEWAY_URL)
  });
  return Response.json(snapshot, {
    status: 200,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });
}

import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export function GET() {
 return NextResponse.json({
  service: "x1-avatar-studio",
  phase: "frontend-foundation",
  status: "scaffold",
  render_engine: "not-connected",
  llm_gateway: "not-validated",
  backend_binding: "not-connected",
  no_base44_runtime: true
 }, {headers: {"Cache-Control": "no-store"}});
}

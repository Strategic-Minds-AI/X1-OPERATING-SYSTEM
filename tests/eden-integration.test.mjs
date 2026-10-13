import test from "node:test";
import assert from "node:assert/strict";
import {
  EDEN_IDENTITY, EDEN_ACTIONS, EDEN_CHANNELS,
  EdenContractError, createEdenDraft, createEdenReadiness
} from "../src/lib/eden/contracts.mjs";
import { createEdenCommandHandler } from "../src/lib/eden/command.mjs";

const SECRET = "x1-preview-test-token-32-characters-minimum";
const ENDPOINT = "https://x1-preview.example/api/eden/commands";
const payload = () => ({ action: "draft_onboarding", channel: "web", instruction: "Prepare a welcome flow for a synthetic company." });
function request(value = payload(), options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (options.secret !== false) headers.Authorization = "Bearer " + (options.secret || SECRET);
  if (options.origin) headers.Origin = options.origin;
  if (options.site) headers["Sec-Fetch-Site"] = options.site;
  if (options.headers) Object.assign(headers, options.headers);
  return new Request(ENDPOINT, {
    method: "POST", headers,
    body: options.raw !== undefined ? options.raw : JSON.stringify(value)
  });
}
const handler = config => createEdenCommandHandler({ mode: "preview", secret: SECRET, ...config });
const invoke = async (h, req) => {
  const response = await h(req);
  return { status: response.status, body: await response.json(), headers: response.headers };
};

test("Eden is registered as a fictional executive AI identity", () => {
  assert.equal(EDEN_IDENTITY.id, "eden-skye");
  assert.match(EDEN_IDENTITY.disclosure, /AI assistant/i);
  assert.equal(EDEN_IDENTITY.model_status, "NOT_CONNECTED");
});
test("Eden actions are exclusively draft and handoff preparations", () => {
  assert.ok(EDEN_ACTIONS.includes("draft_x1_mission"));
  assert.ok(!EDEN_ACTIONS.includes("make_call"));
  assert.ok(!EDEN_ACTIONS.includes("send_sms"));
});
test("Eden communications channels are explicit and constrained", () => {
  assert.ok(EDEN_CHANNELS.includes("sms"));
  assert.ok(!EDEN_CHANNELS.includes("arbitrary_network"));
});
test("Eden X1 work packet is local only and discloses AI status", () => {
  const packet = createEdenDraft(payload());
  assert.equal(packet.status, "DRAFT_NOT_DISPATCHED");
  assert.equal(packet.execution_authorized, false);
  assert.equal(packet.queue_enqueued, false);
  assert.equal(packet.provider_calls_made, 0);
  assert.match(packet.agent_disclosure,/AI assistant/);
});
test("Eden draft always requires operator and tenant-bound approvals", () => {
  const packet = createEdenDraft(payload());
  assert.equal(packet.approval_required, true);
  assert.ok(packet.approvals_required.includes("x1_authenticated_tenant"));
  assert.ok(packet.approvals_required.includes("operator_action_scope"));
});
test("draft instructions are trimmed and do not persist by themselves", () => {
  const packet = createEdenDraft({...payload(), instruction:"  Create a synthetic welcome.  "});
  assert.equal(packet.instruction,"Create a synthetic welcome.");
  assert.equal(packet.privacy.includes("No local draft persistence"),true);
});
test("draft denies payloads that are not objects", () => {
  for(const value of [undefined,null,[],42,"text"])
    assert.throws(()=>createEdenDraft(value), EdenContractError);
});
test("draft rejects extra privileged input like tenant, recipient, or publish", () => {
  for(const key of ["tenant_id","recipient","to_number","approved","execute","provider_url"]) {
    assert.throws(()=>createEdenDraft({...payload(),[key]:"attacker"}),/UNRECOGNIZED_OR_PRIVILEGED_FIELD/);
  }
});
test("draft rejects unsupported action and channel",()=>{
  assert.throws(()=>createEdenDraft({...payload(),action:"make_call"}),/ACTION_NOT_ALLOWED/);
  assert.throws(()=>createEdenDraft({...payload(),channel:"external_raw"}),/CHANNEL_NOT_ALLOWED/);
});
test("draft rejects empty and overlong instructions",()=>{
  assert.throws(()=>createEdenDraft({...payload(),instruction:"  "}),/INSTRUCTION_LENGTH_INVALID/);
  assert.throws(()=>createEdenDraft({...payload(),instruction:"x".repeat(1601)}),/INSTRUCTION_LENGTH_INVALID/);
});
test("valid live-channel request is still only a draft",()=>{
  const packet=createEdenDraft({...payload(),action:"draft_communications",channel:"voice"});
  assert.equal(packet.customer_contact_allowed,false);
  assert.equal(packet.queue_enqueued,false);
});
test("unbound status does not claim provider readiness",()=>{
  const status=createEdenReadiness();
  assert.equal(status.production_ready,false);
  assert.equal(status.features.ai_gateway,"NOT_CONFIGURED");
  assert.equal(status.features.realtime_conversation,"NOT_VERIFIED");
  assert.equal(status.features.external_messages,"BLOCKED");
});
test("configured env flags remain unverified and never assert production",()=>{
  const status=createEdenReadiness({gatewayConfigured:true,queueConfigured:true,rendererConfigured:true,communicationsConfigured:true});
  assert.equal(status.features.ai_gateway,"CONFIGURED_NOT_VERIFIED");
  assert.equal(status.features.communications,"CONFIGURED_NOT_VERIFIED");
  assert.equal(status.production_ready,false);
});
test("handler rejects method before authorization",async()=>{
  const req=new Request(ENDPOINT,{method:"GET"});
  const r=await invoke(handler(),req);
  assert.equal(r.status,405);
});
test("handler rejects unconfigured mode with no external side effects",async()=>{
  const r=await invoke(handler({mode:"disabled"}),request());
  assert.equal(r.status,503);
  assert.equal(r.body.executed,false);
});
test("handler rejects weak server token in preview",async()=>{
  const r=await invoke(handler({secret:"short"}),request());
  assert.equal(r.status,503);
});
test("handler denies missing bearer",async()=>{
  const r=await invoke(handler(),request(payload(),{secret:false}));
  assert.equal(r.status,401);
});
test("handler denies wrong bearer",async()=>{
  const r=await invoke(handler(),request(payload(),{secret:"another-token-of-over-32-characters-in-length"}));
  assert.equal(r.status,401);
});
test("handler rejects cross-site browser calls",async()=>{
  const r=await invoke(handler(),request(payload(),{site:"cross-site"}));
  assert.equal(r.status,403);
});
test("handler rejects mismatched Origin",async()=>{
  const r=await invoke(handler(),request(payload(),{origin:"https://other.example"}));
  assert.equal(r.status,403);
});
test("handler allows the same Origin for server-authorized preview",async()=>{
  const r=await invoke(handler(),request(payload(),{origin:"https://x1-preview.example"}));
  assert.equal(r.status,200);
});
test("handler rejects non-JSON content type",async()=>{
  const r=await invoke(handler(),request(payload(),{headers:{"Content-Type":"text/plain"}}));
  assert.equal(r.status,415);
});
test("handler rejects malformed JSON",async()=>{
  const r=await invoke(handler(),request(payload(),{raw:"{broken"}));
  assert.equal(r.status,400);
});
test("handler returns safe 400 for prohibited live action",async()=>{
  const r=await invoke(handler(),request({...payload(),action:"send_sms"}));
  assert.equal(r.status,400);
  assert.equal(r.body.executed,false);
});
test("handler returns preview draft, not a queue dispatch",async()=>{
  const r=await invoke(handler(),request());
  assert.equal(r.status,200);
  assert.equal(r.body.dispatched,false);
  assert.equal(r.body.customer_contacted,false);
  assert.equal(r.body.packet.queue_enqueued,false);
  assert.equal(r.body.billable_actions,0);
  assert.match(r.body.draft_id,/^eden-[a-f0-9]{28}$/);
});
test("same approved draft gives deterministic idempotency receipt",async()=>{
  const h=handler();
  const a=await invoke(h,request());
  const b=await invoke(h,request());
  assert.equal(a.body.draft_id,b.body.draft_id);
});
test("preview secret is not included in any response",async()=>{
  const r=await invoke(handler(),request());
  assert.ok(!JSON.stringify(r.body).includes(SECRET));
  assert.equal(r.headers.get("cache-control"),"no-store");
});
test("oversized request is rejected",async()=>{
  const r=await invoke(handler(),request(payload(),{raw:JSON.stringify({...payload(),instruction:"y".repeat(5000)})}));
  assert.equal(r.status,413);
});
test("human handoff is also a draft, not an actual contact",()=>{
  const r=createEdenDraft({action:"request_human_handoff",channel:"email",instruction:"Plan a handoff to the internal team."});
  assert.equal(r.customer_contact_allowed,false);
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const html=readFileSync(new URL("../apps/x1-studio/index.html",import.meta.url),"utf8");
test("studio ships valid inline JavaScript and accessible chat/preview controls",()=>{
 const match=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(match,"missing studio browser script");
 assert.doesNotThrow(()=>new Script(match[1]));
 for(const control of ['id="chat-form"','id="chat-text"','id="site-preview"','id="inspector"','id="headline"','id="body-copy"','id="tab-source"','id="device"']){
  assert.ok(html.includes(control),"missing "+control);
 }
 assert.match(html,/aria-label="Builder chat"/);
 assert.match(html,/aria-label="Visual editor"/);
});
test("studio is clearly local-only, not a fake published app",()=>{
 assert.match(html,/NOINDEX DRAFT/);
 assert.match(html,/No public deployment/);
 assert.match(html,/Autonomous code worker: not connected/);
 assert.ok(!html.includes('onclick="deployProduction'));
});

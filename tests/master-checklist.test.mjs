import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Script} from "node:vm";
const data=JSON.parse(readFileSync(new URL("../data/x1-master-checklist.json",import.meta.url),"utf8"));
const html=readFileSync(new URL("../apps/x1-checklist/index.html",import.meta.url),"utf8");
const studio=readFileSync(new URL("../apps/x1-studio/index.html",import.meta.url),"utf8");
const md=readFileSync(new URL("../docs/X1_MASTER_CHECKLIST_2026-10-13.md",import.meta.url),"utf8");
test("source-of-truth checklist covers 79 distinct tasks, 11 phases and actual acceptance criteria",()=>{
 assert.equal(data.tasks.length,79);
 assert.equal(new Set(data.tasks.map(x=>x.id)).size,79);
 assert.equal(new Set(data.tasks.map(x=>x.phase)).size,11);
 assert.ok(data.tasks.every(x=>x.doneWhen.length>35 && ["P0","P1","P2"].includes(x.priority)));
 assert.ok(data.tasks.some(x=>x.id==="RUN-11"));
 assert.ok(data.tasks.some(x=>x.id==="QA-08"));
 assert.ok(data.tasks.some(x=>x.id==="DEMO-07"));
});
test("prior evidence does not count as fresh certification or merge permission",()=>{
 assert.equal(data.tasks.filter(x=>x.status==="VERIFIED_AT_PRIOR_SHA").length,5);
 assert.equal(data.tasks.filter(x=>x.status==="VERIFIED_AT_CURRENT_SHA").length,0);
 assert.equal(data.instructions.backendDurableWorkerActive,false);
 assert.ok(data.tasks.filter(x=>x.status==="VERIFIED_AT_PRIOR_SHA").every(x=>x.evidence.startsWith("https://github.com/")));
 assert.match(md,/true unattended mode/i);
 for(const x of data.tasks)assert.ok(md.includes(x.id));
});
test("interactive board has actual accessible local checkboxes and never edits evidence status",()=>{
 for(const id of ['id="phases"','id="filter"','id="find"','id="copy"','id="download"'])assert.ok(html.includes(id),id);
 assert.match(html,/localStorage\.setItem/);
 assert.match(html,/Checking a task means/);
 const match=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(match);
 assert.doesNotThrow(()=>new Script(match[1]));
 assert.match(html,/task\.status\.startsWith/);
});
test("Studio auto-idle is clearly local one-shot, 600-second and cancellable",()=>{
 assert.ok(studio.includes('id="idle-toggle"'));
 assert.ok(studio.includes('id="idle-status"'));
 assert.ok(studio.includes('href="/checklist"'));
 assert.ok(studio.includes("idleThresholdMs=600000"));
 assert.ok(studio.includes('idleFired=true'));
 assert.ok(studio.includes('templateId:"app-client-crm"'));
 assert.ok(studio.includes('"Pause local auto-build"'));
 assert.ok(studio.includes("No paid AI, background worker, production provisioning"));
 const match=studio.match(/<script>([\s\S]*?)<\/script>/);assert.ok(match);
 assert.doesNotThrow(()=>new Script(match[1]));
});

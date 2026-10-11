import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
function allFiles(folder){
 return readdirSync(folder,{withFileTypes:true}).flatMap(x=>x.isDirectory()?allFiles(join(folder,x.name)):[join(folder,x.name)]);
}
test("runtime source does not import Base44 SDK or use managed backend",()=>{
 const files=allFiles(join(process.cwd(),"src")).filter(x=>/\.(tsx?|mjs|jsx?)$/.test(x));
 for(const file of files){
  const s=readFileSync(file,"utf8");
  for(const bad of [/from\s+["']@base44\//i,/require\(["']@base44\//i,/base44Client/i,/base44\.entities/i,/base44\.integrations/i,/base44\.functions/i,/InvokeLLM/i]){
    assert.equal(bad.test(s),false,"forbidden Base44 runtime reference in "+file);
  }
 }
});
test("unbound avatar creation is fail-closed",()=>{
 const s=readFileSync("src/app/api/avatars/route.ts","utf8");
 assert.match(s,/AVATAR_ENROLLMENT_DISABLED/);
 assert.match(s,/status:503/);
});
test("unbound autonomous work queue is fail-closed",()=>{
 const s=readFileSync("src/app/api/engineering/jobs/route.ts","utf8");
 assert.match(s,/X1_QUEUE_BRIDGE_NOT_CONNECTED/);
 assert.match(s,/status:503/);
});

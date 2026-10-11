import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const actions=new Set(["READ_ONLY","NON_PRODUCTION_MUTATION","PROTECTED_MUTATION","PRODUCTION_RELEASE"]);
const taskStates=new Set(["VERIFIED","PENDING","BLOCKED","APPROVAL_REQUIRED"]);
export function validateMission(d){
 const problems=[];
 if(!d||d.schema!=="x1.autobuild.mission.v1"||typeof d.missionId!=="string") problems.push("invalid schema");
 if(d?.activation?.queueBridge!==false||d?.activation?.production!==false||d?.activation?.protectedJobsRequireApproval!==true) problems.push("unsafe activation");
 if(!Array.isArray(d?.tasks)||d.tasks.length<3) problems.push("missing tasks");
 const tasks=d?.tasks||[];
 const ids=new Set();
 for(const t of tasks){
  if(typeof t.id!=="string"||!/^X1-[A-Z0-9-]+$/.test(t.id)) problems.push("task id malformed");
  if(ids.has(t.id)) problems.push("duplicate task "+t.id);
  ids.add(t.id);
  if(!actions.has(t.action)||!taskStates.has(t.state)) problems.push("invalid action/state "+t.id);
  if(!Array.isArray(t.dependsOn)||!Array.isArray(t.acceptance)||t.acceptance.length<1) problems.push("missing acceptance/dependencies "+t.id);
  if(["PROTECTED_MUTATION","PRODUCTION_RELEASE"].includes(t.action)&&t.state!=="APPROVAL_REQUIRED"&&t.state!=="BLOCKED") problems.push("protected task not held "+t.id);
  if(t.action==="NON_PRODUCTION_MUTATION"&&t.costLimitUsd!==0) problems.push("unapproved spend "+t.id);
  if(t.state==="VERIFIED"&&!t.evidence) problems.push("verified without evidence "+t.id);
 }
 const index=new Map(tasks.map(t=>[t.id,t]));const visiting=new Set(),visited=new Set();
 function visit(id){
  if(visiting.has(id)){problems.push("dependency cycle "+id);return;}
  if(visited.has(id)) return;
  const task=index.get(id);
  if(!task) {problems.push("unknown dependency "+id);return;}
  visiting.add(id);
  for(const dep of task.dependsOn||[]){
   if(dep===id){problems.push("self dependency "+id);continue;}
   visit(dep);
  }
  visiting.delete(id);visited.add(id);
 }
 for(const t of tasks) visit(t.id);
 return [...new Set(problems)];
}
export function loadMission(file=resolve("config/mission.x1-avatar-studio.json")){return JSON.parse(readFileSync(file,"utf8"));}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const errs=validateMission(loadMission());
 if(errs.length){console.error(errs.join("\n"));process.exitCode=1;}else console.log("PASS: X1 mission schema, dependency DAG, costs, evidence and approval holds validated");
}

import { mkdirSync,writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadMission,validateMission } from "./validate-mission.mjs";
export function planNext(mission){
 const errors=validateMission(mission);
 if(errors.length) throw new Error("X1_MISSION_INVALID:"+errors.join(","));
 const map=new Map(mission.tasks.map(t=>[t.id,t]));
 const done=new Set(mission.tasks.filter(t=>t.state==="VERIFIED").map(t=>t.id));
 const ready=[],protectedActions=[],blocked=[];
 for(const task of mission.tasks){
  if(task.state==="VERIFIED")continue;
  if(task.state==="APPROVAL_REQUIRED" || ["PROTECTED_MUTATION","PRODUCTION_RELEASE"].includes(task.action)){
    protectedActions.push({id:task.id,reason:"PROTECTED_APPROVAL_REQUIRED"});continue;
  }
  if(task.state==="BLOCKED"){blocked.push({id:task.id,reason:"TASK_BLOCKED"});continue;}
  const waiting=task.dependsOn.filter(id=>!done.has(id));
  if(waiting.length){blocked.push({id:task.id,reason:"WAITING_FOR_DEPENDENCIES",waiting});continue;}
  ready.push({id:task.id,title:task.title,action:task.action,acceptance:task.acceptance,costLimitUsd:task.costLimitUsd});
 }
 ready.sort((a,b)=>(a.action==="READ_ONLY"?0:1)-(b.action==="READ_ONLY"?0:1));
 return {schema:"x1.mission.plan.v1",missionId:mission.missionId,eligible:ready,
  approvalRequired:protectedActions,blocked,queued:false,codeExecutionActivated:false};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const result=planNext(loadMission());mkdirSync("artifacts/ci",{recursive:true});
 writeFileSync("artifacts/ci/next-eligible.json",JSON.stringify(result,null,2)+"\n");
 console.log("X1 next eligible: "+result.eligible.map(x=>x.id).join(", "));
 console.log("X1 approval-required: "+result.approvalRequired.map(x=>x.id).join(", "));
 console.log("DRY RUN ONLY: no jobs queued or executed");
}

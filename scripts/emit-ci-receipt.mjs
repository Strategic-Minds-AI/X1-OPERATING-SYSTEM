import {writeFileSync,mkdirSync} from "node:fs";
const sourceSha=process.env.X1_SOURCE_SHA||"";
const runId=process.env.X1_RUN_ID||"";
const jobStatus=process.env.X1_JOB_STATUS||"";
if(!/^[a-f0-9]{40}$/.test(sourceSha)||!/^\d+$/.test(runId)||!["success","failure","cancelled"].includes(jobStatus)){
 console.error("CI receipt missing exact run identity or status");process.exit(1);
}
const receipt={
 schema:"x1.validation.ci.v1",
 provider:"github-actions",
 repository:"Strategic-Minds-AI/X1-OPERATING-SYSTEM",
 sourceSha,runId:Number(runId),
 runUrl:"https://github.com/Strategic-Minds-AI/X1-OPERATING-SYSTEM/actions/runs/"+runId,
 result:jobStatus==="success"?"PASS":"FAIL",
 observedAt:new Date().toISOString(),
 scope:"build, TypeScript, architecture and mission tests",
 note:"This automated receipt is not an independent production release approval or live avatar validation."
};
mkdirSync("artifacts/ci",{recursive:true});
writeFileSync("artifacts/ci/validation-receipt.json",JSON.stringify(receipt,null,2)+"\n");
console.log("CI receipt recorded for immutable SHA "+sourceSha);

// Evidence-based anti-hierarchical *recommendation* contract.
// Never misrepresent a single model prompt with multiple personas as independent agents.
export function reviewCouncil({proposalId,sourceSha,reviews,authorId}={}){
  const errors=[];
  if(typeof proposalId!=="string"||proposalId.length<5)errors.push("PROPOSAL_ID_REQUIRED");
  if(!/^[a-f0-9]{40}$/.test(sourceSha||""))errors.push("PINNED_SOURCE_REQUIRED");
  if(!Array.isArray(reviews)||reviews.length<3)errors.push("MINIMUM_THREE_REVIEWS");
  const ids=new Set(), votes=[];
  for(const r of reviews||[]){
    if(!r||typeof r.agentId!=="string"||!r.agentId||ids.has(r.agentId)){errors.push("UNIQUE_AGENTS_REQUIRED");continue;}
    ids.add(r.agentId);
    if(r.agentId===authorId)errors.push("BUILDER_CANNOT_VALIDATE_OWN_RELEASE");
    if(r.independentlyExecuted!==true||!r.evidenceId||!r.sourceSha||r.sourceSha!==sourceSha)errors.push("INDEPENDENCE_OR_EVIDENCE_UNVERIFIED");
    if(!["approve","reject","abstain"].includes(r.vote))errors.push("INVALID_VOTE");
    if(r.securityBlocker===true)errors.push("SECURITY_BLOCKER");
    votes.push({agentId:r.agentId,vote:r.vote});
  }
  const approve=votes.filter(v=>v.vote==="approve").length;
  const reject=votes.filter(v=>v.vote==="reject").length;
  const quorum=votes.length>=3&&votes.length===reviews?.length;
  return Object.freeze({
    proposalId,sourceSha,quorum,approve,reject,abstain:votes.length-approve-reject,votes,
    status:errors.length?"BLOCKED_EVIDENCE_OR_SECURITY":approve>reject&&approve>=2&&quorum?"COUNCIL_RECOMMENDS_APPROVAL":"COUNCIL_DOES_NOT_RECOMMEND",
    errors:[...new Set(errors)],operatorReleaseAuthorized:false,automatedDeploymentAuthorized:false
  });
}

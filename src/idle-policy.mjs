export const IDLE_THRESHOLD_MS=600000;
export const LOCAL_IDLE_OPERATIONS=Object.freeze(["SYNTHETIC_CRM_CANARY_COMPILE","SYNTHETIC_STATIC_PREFLIGHT"]);
export const PROTECTED_IDLE_OPERATIONS=Object.freeze(["DEPLOY_PRODUCTION","MERGE_MAIN","PROD_DB_WRITE","DNS_CHANGE","SPENDING","SECRETS_CHANGE","PERMISSION_CHANGE","CLIENT_CONTACT","SOCIAL_PUBLISH","DESTRUCTIVE_WRITE"]);
export function evaluateLocalIdle({now,lastActivityAt,armed,alreadyFired,operation="SYNTHETIC_CRM_CANARY_COMPILE",browserOpen=true}={}){
 if(!Number.isFinite(now)||!Number.isFinite(lastActivityAt)||lastActivityAt<0||now<lastActivityAt)throw Error("INVALID_IDLE_TIMESTAMPS");
 if(typeof armed!=="boolean"||typeof alreadyFired!=="boolean"||typeof browserOpen!=="boolean")throw Error("INVALID_IDLE_STATE");
 const ms=Math.max(0,now-lastActivityAt);
 const eligible=armed&&!alreadyFired&&browserOpen&&ms>=IDLE_THRESHOLD_MS;
 const allowed=LOCAL_IDLE_OPERATIONS.includes(operation);
 return Object.freeze({idleMs:ms,idleSeconds:Math.floor(ms/1000),eligible,allowed,
  canRun:eligible&&allowed,operation:allowed?operation:"BLOCKED_OPERATION",allowedProduction:false,
  openBrowserRequired:true,requiresAuthenticatedDurableQueueForClosedBrowser:true,
  reason:!armed?"PAUSED_BY_OPERATOR":alreadyFired?"ALREADY_RAN_THIS_IDLE_EPOCH":!browserOpen?"NO_OPEN_BROWSER":!allowed?"OPERATION_NOT_ALLOWLISTED":ms<IDLE_THRESHOLD_MS?"WAIT_FOR_600_SECONDS":"SAFE_LOCAL_CANARY_ELIGIBLE"});
}

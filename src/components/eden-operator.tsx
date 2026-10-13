"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createEdenDraft,
  EDEN_IDENTITY,
  type EdenAction,
  type EdenChannel
} from "@/lib/eden/contracts.mjs";
import styles from "./eden-operator.module.css";

type Readiness = {
  features?: Record<string, string>;
  stage?: string;
  production_ready?: boolean;
};
const activities: { label: string; value: EdenAction }[] = [
  { label: "Onboard a new business", value: "draft_onboarding" },
  { label: "Prepare a communications workflow", value: "draft_communications" },
  { label: "Write an avatar commercial brief", value: "draft_commercial_script" },
  { label: "Prepare an X1 engineering mission", value: "draft_x1_mission" },
  { label: "Prepare a human handoff", value: "request_human_handoff" }
];
const channels: {label:string;value:EdenChannel}[] = [
  {label:"Website",value:"web"},
  {label:"Internal X1",value:"internal"},
  {label:"Voice",value:"voice"},
  {label:"SMS",value:"sms"},
  {label:"MMS",value:"mms"},
  {label:"Email",value:"email"},
  {label:"Video",value:"video"}
];

export default function EdenOperatorPanel() {
  const [action,setAction]=useState<EdenAction>("draft_onboarding");
  const [channel,setChannel]=useState<EdenChannel>("web");
  const [instruction,setInstruction]=useState("");
  const [draft,setDraft]=useState<ReturnType<typeof createEdenDraft> | null>(null);
  const [readiness,setReadiness]=useState<Readiness | null>(null);
  const [statusError,setStatusError]=useState(false);
  const [notice,setNotice]=useState("");

  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/eden/status",{cache:"no-store",signal:controller.signal})
      .then(async res=> { if(!res.ok) throw new Error("STATUS_UNAVAILABLE"); return res.json(); })
      .then((value:Readiness)=>{if(!controller.signal.aborted)setReadiness(value);})
      .catch(()=>{if(!controller.signal.aborted)setStatusError(true);});
    return ()=>controller.abort();
  },[]);

  function onDraft(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setDraft(createEdenDraft({ action, channel, instruction }));
      setNotice("Draft prepared locally. No agent job, call, message, or video was initiated.");
    } catch (error) {
      setDraft(null);
      setNotice(error instanceof Error ? error.message : "Invalid mission brief.");
    }
  }
  async function copyDraft(){
    if(!draft)return;
    try {
      if(!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(JSON.stringify(draft,null,2));
      setNotice("Draft copied. Review approvals before submitting to the existing X1 queue.");
    } catch {
      setNotice("Clipboard unavailable. Select and copy the draft JSON manually.");
    }
  }

  return <div className={styles.root} data-testid="x1-eden-workspace">
    <div className="eyebrow"><span className="eyebrow-line"/> EXECUTIVE AI · X1 NATIVE</div>
    <div className="heading-row">
      <div><h1>Eden Skye</h1><p className="subhead">Your executive AI identity, onboarding host and future communications operator, governed by X1.</p></div>
      <span className={styles.badge}>PREVIEW / NO LIVE ACTIONS</span>
    </div>
    <div className={styles.hero}>
      <div className={styles.monogram} aria-label="Eden Skye profile placeholder, approved portrait pending">ES</div>
      <div className={styles.heroText}>
        <span className={styles.kicker}>STRATEGIC MINDS AI · INTELLIGENCE IN MOTION</span>
        <h2>Hello, I&apos;m Eden Skye.</h2>
        <p>{EDEN_IDENTITY.disclosure} I can help prepare onboarding flows, X1 missions and content briefs. Live conversation and outbound communications are not yet connected.</p>
        <div className={styles.pills}>
          <span>AI identity disclosed</span><span>Source avatar pending verification</span><span>Single X1 supervisor</span>
        </div>
      </div>
    </div>
    <div className={styles.metricGrid} aria-label="Eden integration readiness">
      {[
        ["X1 command drafts","LOCAL ONLY"],
        ["Agent queue",readiness?.features?.x1_signed_queue || "NOT VERIFIED"],
        ["AI Gateway",readiness?.features?.ai_gateway || "NOT VERIFIED"],
        ["Real-time avatar",readiness?.features?.realtime_conversation || "NOT VERIFIED"]
      ].map(([title,status])=><div className={styles.metric} key={title}>
        <span>{title}</span><strong>{status}</strong>
      </div>)}
    </div>
    {statusError&&<p className={styles.alert} role="status">X1 readiness service could not be verified. Draft mode remains local.</p>}
    <div className={styles.grid}>
      <section className={styles.panel} aria-label="Prepare Eden work packet">
        <h3>Prepare a mission for Eden</h3>
        <p>Eden creates a structured draft here. It is not dispatched to a queue, voice provider or customer.</p>
        <form onSubmit={onDraft} className={styles.form}>
          <label>Objective
            <select value={action} onChange={event=>setAction(event.target.value as EdenAction)}>
              {activities.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>Future channel
            <select value={channel} onChange={event=>setChannel(event.target.value as EdenChannel)}>
              {channels.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label>What should Eden prepare?
            <textarea required minLength={1} maxLength={1600} rows={5} value={instruction}
              onChange={event=>setInstruction(event.target.value)}
              placeholder="Describe the outcome. Do not include passwords, customer contact details or sensitive records in this preview." />
          </label>
          <button className="primary-btn" type="submit">Prepare X1 draft</button>
        </form>
        {notice&&<p className={styles.notice} role="status">{notice}</p>}
      </section>
      <section className={styles.panel} aria-label="Eden X1 draft receipt">
        <h3>X1 work-packet preview</h3>
        <p>Approval-first, tenant-scoped dispatch will use the existing X1 worker once independently validated.</p>
        {draft?<><pre className={styles.code}>{JSON.stringify(draft,null,2)}</pre>
          <button type="button" className="outline-btn" onClick={copyDraft}>Copy review packet</button>
        </>:<div className={styles.empty}>Your reviewed draft will appear here. No calls, SMS, uploads or paid model usage occur.</div>}
        <div className={styles.blocked}>LIVE CALLS · VIDEO STREAMS · CUSTOMER SENDS: BLOCKED UNTIL RELEASE VALIDATION</div>
      </section>
    </div>
  </div>;
}

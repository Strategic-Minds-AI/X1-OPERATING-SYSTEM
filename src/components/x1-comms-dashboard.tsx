"use client";

import {useEffect,useState,type FormEvent} from "react";
import {
 COMMS_FEATURES,COMMS_ACTIONS,ACTION_CHANNELS,createCommsDraft,
 type CommsAction,type CommsProvider,type CommsChannel,type CommsDraftPacket,
 type CommsInspectPacket
} from "@/lib/comms/contracts.mjs";
import styles from "./x1-comms-dashboard.module.css";

type Readiness={
 stage?:string;gpt_bridge?:string;provider_status?:Record<string,string>;
 source_number_suffix?:string;production_ready?:boolean;modules?:typeof COMMS_FEATURES;
};
type Tab="Overview"|"Studio"|"Twilio"|"GPT Sync"|"Migration";
const tabs:Tab[]=["Overview","Studio","Twilio","GPT Sync","Migration"];
const draftActions:{value:CommsAction;label:string}[]=[
 {value:"draft_sms",label:"SMS message"},
 {value:"draft_mms",label:"MMS with media"},
 {value:"draft_voice_call",label:"Outbound voice call brief"},
 {value:"draft_whatsapp",label:"WhatsApp message"},
 {value:"draft_email",label:"Email campaign message"},
 {value:"draft_campaign",label:"Batch campaign proposal"},
 {value:"draft_number_route",label:"Voice routing proposal"},
 {value:"draft_eden_handoff",label:"Eden Skye agent handoff"}
];
const stageLabel=(state:string)=>state.replaceAll("_"," ");
export default function X1Communications({openEden}:{openEden?:()=>void}){
 const [tab,setTab]=useState<Tab>("Overview");
 const [readiness,setReadiness]=useState<Readiness|null>(null);
 const [readinessFailed,setReadinessFailed]=useState(false);
 const [action,setAction]=useState<CommsAction>("draft_sms");
 const [provider,setProvider]=useState<CommsProvider>("twilio");
 const [channel,setChannel]=useState<CommsChannel>("sms");
 const [recipient,setRecipient]=useState("");
 const [subject,setSubject]=useState("");
 const [message,setMessage]=useState("");
 const [purpose,setPurpose]=useState("");
 const [consent,setConsent]=useState("");
 const [packet,setPacket]=useState<CommsDraftPacket|CommsInspectPacket|null>(null);
 const [notice,setNotice]=useState("");
 const [filters,setFilters]=useState("all");
 useEffect(()=>{
  const ctl=new AbortController();
  fetch("/api/comms/readiness",{cache:"no-store",signal:ctl.signal})
   .then(r=>{if(!r.ok)throw new Error("not ready");return r.json();})
   .then((v:Readiness)=>{if(!ctl.signal.aborted)setReadiness(v);})
   .catch(()=>{if(!ctl.signal.aborted)setReadinessFailed(true);});
  return ()=>ctl.abort();
 },[]);
 function selectAction(next:CommsAction){
  setAction(next);
  setChannel((ACTION_CHANNELS[next]||"sms") as CommsChannel);
  setPacket(null);
  setNotice("");
 }
 function prepare(e:FormEvent<HTMLFormElement>){
  e.preventDefault();
  try{
   const data={action,provider,channel,
    to:recipient||undefined,subject:subject||undefined,
    message:message||undefined,purpose:purpose||undefined,
    consent_reference:consent||undefined};
   const draft=createCommsDraft(data);
   setPacket(draft);
   setNotice("X1 review packet prepared. Nothing was sent, queued, purchased or scheduled.");
  }catch(e){
   setPacket(null);
   setNotice(e instanceof Error?e.message:"Invalid communication draft");
  }
 }
 async function copy(value:string){
  try{
   if(!navigator.clipboard)throw new Error("clipboard");
   await navigator.clipboard.writeText(value);
   setNotice("Copied. This is a review artifact, not an authorization.");
  }catch{
   setNotice("Clipboard unavailable. Select and copy the text manually.");
  }
 }
 const filtered=COMMS_FEATURES.filter(m=>filters==="all"||
  (filters==="ready"?["CONTRACT_READY","READ_ONLY_GATED"].includes(m.state):
  m.state==="DRAFT_ONLY"));
 return <div className={styles.root} data-testid="x1-comms-workspace">
  <div className="eyebrow"><span className="eyebrow-line"/> X1 OPERATING SYSTEM · NATIVE COMMUNICATIONS</div>
  <div className="heading-row">
   <div><h1>XTREME Communications<span className="heading-spark">✦</span></h1>
    <p className="subhead">Twilio · Telnyx · Eden Skye · GPT tools, under one X1 control plane.</p>
   </div><span className={styles.badge}>ISOLATED PREVIEW</span>
  </div>
  <div className={styles.hero}>
   <div className={styles.rings}><div className={styles.center}>X1</div></div>
   <div className={styles.heroBody}>
    <span className={styles.kicker}>ONE COMMUNICATIONS ENGINE. EVERY CHANNEL.</span>
    <h2>Connect every conversation.</h2>
    <p>The existing XTREME Communications system is preserved as the source. X1 owns the new interfaces, authorization and future agent dispatch. Live external communication is disabled until independent provider, compliance and tenant validation.</p>
    <div className={styles.actions}>
     <button className="primary-btn" onClick={()=>setTab("Studio")} type="button">Prepare communication</button>
     {openEden&&<button className="outline-btn" onClick={openEden} type="button">Open Eden Skye</button>}
    </div>
   </div>
  </div>
  <div className={styles.summary}>
   {[
    ["Twilio",readiness?.provider_status?.twilio||"NOT VERIFIED"],
    ["Telnyx",readiness?.provider_status?.telnyx||"NOT VERIFIED"],
    ["GPT Bridge",readiness?.gpt_bridge||"NOT VERIFIED"],
    ["Outbound send","DISABLED BY POLICY"]
   ].map(([label,value])=><div className={styles.summaryItem} key={label}>
    <span>{label}</span><strong>{stageLabel(value)}</strong>
   </div>)}
  </div>
  <div className={styles.tabs} role="tablist" aria-label="X1 communications sections">
   {tabs.map(name=><button key={name} type="button" role="tab"
    aria-selected={tab===name} className={tab===name?styles.tabActive:styles.tab}
    onClick={()=>setTab(name)}>{name}</button>)}
  </div>
  {readinessFailed&&<p role="status" className={styles.alert}>Could not verify X1 readiness; all live actions remain blocked.</p>}
  {tab==="Overview"&&<section aria-label="Communications capabilities">
   <div className={styles.sectionHeading}>
    <div><h3>Capability inventory</h3><p>Ported from existing XTREME Communications source. Each status reflects X1, not donor marketing claims.</p></div>
    <select aria-label="Filter modules" value={filters} onChange={e=>setFilters(e.target.value)}>
     <option value="all">All modules</option><option value="ready">Read / GPT contracts</option><option value="drafts">Draft-capable</option>
    </select>
   </div>
   <div className={styles.moduleGrid}>{filtered.map((m,i)=><div key={m.id} className={styles.moduleCard}>
    <div className={styles.moduleTop}><span className={styles.moduleNumber}>{String(i+1).padStart(2,"0")}</span>
     <span className={styles.moduleState}>{stageLabel(m.state)}</span></div>
    <h4>{m.name}</h4><p>{m.provider}</p>
   </div>)}</div>
  </section>}
  {tab==="Studio"&&<div className={styles.twoCols}>
   <section className={styles.panel} aria-label="Prepare communications work">
    <h3>Multichannel command studio</h3><p>Compose one governed X1 packet. No customer contact, usage charges, recording or provider dispatch.</p>
    <form className={styles.form} onSubmit={prepare}>
     <label>Action<select value={action} onChange={e=>selectAction(e.target.value as CommsAction)}>
      {draftActions.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
     </select></label>
     <div className={styles.formPair}>
      <label>Provider<select value={provider} onChange={e=>setProvider(e.target.value as CommsProvider)}>
       <option value="twilio">Twilio</option><option value="telnyx">Telnyx</option>
      </select></label>
      <label>Channel<select value={channel} onChange={e=>setChannel(e.target.value as CommsChannel)}
       disabled={Boolean(ACTION_CHANNELS[action])}>
       {["sms","mms","voice","whatsapp","email","internal"].map(c=><option key={c} value={c}>{c.toUpperCase()}</option>)}
      </select></label>
     </div>
     <label>Recipient (optional until approved)
      <input value={recipient} onChange={e=>setRecipient(e.target.value)}
       placeholder={channel==="email"?"recipient@example.com":"+1XXXXXXXXXX"} autoComplete="off"/>
     </label>
     {channel==="email"&&<label>Subject<input value={subject} onChange={e=>setSubject(e.target.value)} maxLength={180}/></label>}
     <label>Purpose or campaign objective
      <input value={purpose} maxLength={240} onChange={e=>setPurpose(e.target.value)}
       placeholder="Onboard a synthetic customer; no live outreach"/>
     </label>
     <label>Message / call brief
      <textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={2400}
       rows={5} placeholder="Draft the script or message. Avoid real personal information in staging."/>
     </label>
     <label>Consent record reference (optional draft metadata)
      <input value={consent} onChange={e=>setConsent(e.target.value)} maxLength={128}
       placeholder="Consent must be verified before any live send"/>
     </label>
     <button type="submit" className="primary-btn">Generate approval packet</button>
    </form>
    {notice&&<p role="status" className={styles.notice}>{notice}</p>}
   </section>
   <section className={styles.panel} aria-label="Communications draft receipt">
    <h3>Governed work packet</h3><p>Review before any future authenticated X1 queue submission.</p>
    {packet?<><pre className={styles.code}>{JSON.stringify(packet,null,2)}</pre>
     <button type="button" className="outline-btn" onClick={()=>copy(JSON.stringify(packet,null,2))}>Copy work packet</button>
    </>:<div className={styles.empty}>Create a synthetic communications draft to inspect all approval and execution gates.</div>}
    <p className={styles.danger}>LIVE SEND / BUY / RECORD / DEPLOY: NOT ENABLED</p>
   </section>
  </div>}
  {tab==="Twilio"&&<section className={styles.panel}>
   <h3>Twilio provider control</h3>
   <p>Scoped to the previously approved phone number ending 1174. No Twilio account ID or credentials appear in source control or the browser.</p>
   <div className={styles.dataList}>
    {[
     ["Number","+1 (866) ••• •1174"],
     ["Account verification","SERVER-SIDE ENV + PROVIDER GET REQUIRED"],
     ["Current X1 binding",readiness?.provider_status?.twilio||"UNVERIFIED"],
     ["Account inspection","READ-ONLY, GPT TOOL AUTH REQUIRED"],
     ["Number ownership / voice webhook","NOT YET VERIFIED"],
     ["Outbound dialing / SMS","EXPLICIT APPROVAL REQUIRED"]
    ].map(([a,b])=><div key={a}><span>{a}</span><strong>{b}</strong></div>)}
   </div>
   <p className={styles.muted}>Twilio account and number inspection uses a pinned account match, GET-only REST adapter, redacted webhook hosts, 10-second timeout and no provider mutations.</p>
  </section>}
  {tab==="GPT Sync"&&<section className={styles.panel}>
   <h3>GPT command interface</h3>
   <p>X1 exposes an OpenAPI tool contract for GPTs and agents. Existing XTREME Communications GPT access remains operational in its original connector. Activation of this new X1 endpoint requires a secret-scoped server credential and a validated preview URL.</p>
   <div className={styles.dataList}>
    <div><span>OpenAPI schema</span><strong>/x1-comms-openapi.json</strong></div>
    <div><span>Authenticated command route</span><strong>POST /api/comms/gpt</strong></div>
    <div><span>Public readiness route</span><strong>GET /api/comms/readiness</strong></div>
    <div><span>GPT read actions</span><strong>inspect_connection · inspect_number</strong></div>
    <div><span>GPT safe drafts</span><strong>SMS · MMS · Voice · WhatsApp · Email · Campaign · Eden</strong></div>
    <div><span>Auth contract</span><strong>Server-side bearer, pinned tenant, no browser key</strong></div>
   </div>
   <button className="outline-btn" type="button"
    onClick={()=>copy(new URL("/x1-comms-openapi.json",window.location.href).href)}>
    Copy current preview OpenAPI URL
   </button>
   <p className={styles.danger}>GPT SYNC CONTRACT READY. LIVE GPT CONNECTOR BINDING NOT YET VERIFIED.</p>
  </section>}
  {tab==="Migration"&&<section className={styles.panel}>
   <h3>Migration and isolation</h3>
   <p>Keep source code authority in X1 while retaining the verified XTREME Communications donor, existing Telnyx infrastructure, and single X1 durable queue.</p>
   <div className={styles.dataList}>
    <div><span>Original repository</span><strong>XTREME-SYSTEMS/xtreme-communications-os (preserved)</strong></div>
    <div><span>X1 app runtime</span><strong>Next.js, no Base44 SDK</strong></div>
    <div><span>Twilio</span><strong>Pinned account GET reader and review packets</strong></div>
    <div><span>Telnyx</span><strong>Existing donor connection preserved</strong></div>
    <div><span>Eden Skye</span><strong>Existing X1 executive assistant workspace</strong></div>
    <div><span>Workers & queues</span><strong>Reuse existing X1 Railway and Supabase only</strong></div>
    <div><span>Rollback</span><strong>Abandon integration branch; original systems unchanged</strong></div>
   </div>
  </section>}
 </div>;
}

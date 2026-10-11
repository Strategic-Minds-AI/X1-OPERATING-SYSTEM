"use client";
import { useState } from "react";

type Section = "Overview" | "Avatar Studio" | "Video Creator" | "Live Sessions" | "Voice Lab" | "Agent Workspace" | "Asset Library" | "Settings";
type Avatar = {id:string; name:string; role:string; mode:string; color:string; initials:string; kind:"reference"|"local"};
const initialAvatars:Avatar[] = [
 {id:"eden",name:"Eden Skye",role:"Executive digital human",mode:"Identity locked · pending engine",color:"rose",initials:"ES",kind:"reference"},
 {id:"sample-a",name:"Studio concept 01",role:"Demonstration identity",mode:"UI concept only",color:"violet",initials:"01",kind:"reference"},
 {id:"sample-b",name:"Studio concept 02",role:"Demonstration identity",mode:"UI concept only",color:"ocean",initials:"02",kind:"reference"},
 {id:"sample-c",name:"Studio concept 03",role:"Demonstration identity",mode:"UI concept only",color:"amber",initials:"03",kind:"reference"}
];
const groups:{title:string;items:{name:Section;icon:string}[]}[]=[
 {title:"WORKSPACE",items:[{name:"Overview",icon:"grid"},{name:"Avatar Studio",icon:"face"},{name:"Video Creator",icon:"video"},{name:"Live Sessions",icon:"radio"},{name:"Voice Lab",icon:"audio"}]},
 {title:"X1 OPERATING SYSTEM",items:[{name:"Agent Workspace",icon:"cpu"},{name:"Asset Library",icon:"layers"},{name:"Settings",icon:"settings"}]}
];
const icons:Record<string,React.ReactNode>={
 grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 face:<><circle cx="12" cy="9" r="5"/><path d="M4 21c1-5 15-5 16 0"/><path d="M9 9h.01M15 9h.01"/></>,
 video:<><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/></>,
 radio:<><circle cx="12" cy="12" r="2"/><path d="M7.5 7.5a6 6 0 0 0 0 9M16.5 7.5a6 6 0 0 1 0 9M4.5 4.5a10 10 0 0 0 0 15M19.5 4.5a10 10 0 0 1 0 15"/></>,
 audio:<><path d="M3 10v4M7 7v10M11 3v18M15 8v8M19 5v14"/></>,
 cpu:<><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></>,
 layers:<><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
 settings:<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
 plus:<path d="M12 5v14M5 12h14"/>, arrow:<path d="M5 12h14m-6-6 6 6-6 6"/>,
 chevron:<path d="m9 6 6 6-6 6"/>, spark:<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>,
 search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
 shield:<><path d="M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></>,
 more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
 close:<path d="m5 5 14 14M19 5 5 19"/>, check:<path d="m5 12 5 5L19 7"/>,
 upload:<><path d="M12 16V3m-5 5 5-5 5 5"/><path d="M4 16v4h16v-4"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
 alert:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5M12 16v.1"/></>,
 menu:<path d="M3 6h18M3 12h18M3 18h18"/>
};
function I({name,size=19}:{name:string;size?:number}){
 return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{icons[name]||icons.spark}</svg>;
}
function Status({children,kind="neutral"}:{children:React.ReactNode;kind?:"neutral"|"success"|"warning"}){return <span className={"status "+kind}>{children}</span>}
function Portrait({avatar,large=false}:{avatar:Avatar;large?:boolean}){return <div className={"portrait "+avatar.color+(large?" large":"")}>
 <div className="portrait-glow"/><div className="portrait-lines"/><div className="portrait-figure"><div className="portrait-head"/><div className="portrait-shoulders"/></div>
 <div className="portrait-initial">{avatar.initials}</div>
 </div>}
export default function X1Studio(){
 const [section,setSection]=useState<Section>("Avatar Studio");
 const [selected,setSelected]=useState("eden");
 const [avatars,setAvatars]=useState<Avatar[]>(initialAvatars);
 const [modal,setModal]=useState(false);
 const [draftName,setDraftName]=useState("");
 const [draftType,setDraftType]=useState("Video avatar");
 const [rights,setRights]=useState(false);
 const [source,setSource]=useState("");
 const [search,setSearch]=useState("");
 const [toast,setToast]=useState("");
 const [drawer,setDrawer]=useState(false);
 const [videoPrompt,setVideoPrompt]=useState("");
 const [voicePrompt,setVoicePrompt]=useState("");
 const [tab,setTab]=useState("All avatars");
 const selectedAvatar=avatars.find(x=>x.id===selected)||avatars[0];
 const notify=(msg:string)=>{setToast(msg);};
 const selectSection=(x:Section)=>{setSection(x);setDrawer(false);setToast("");};
 const filtered=avatars.filter(a=>(tab!=="Local drafts"||a.kind==="local")&&[a.name,a.role].join(" ").toLowerCase().includes(search.toLowerCase()));
 function addDraft(e:React.FormEvent){
  e.preventDefault();if(!rights||!draftName.trim()){notify("Enter a name and confirm your rights to the source material.");return;}
  const id="draft-"+Date.now();
  setAvatars(v=>[{id,name:draftName.trim(),role:draftType+" · "+(source||"No source uploaded"),mode:"Local UI draft · not enrolled",color:"violet",initials:draftName.trim().slice(0,2).toUpperCase(),kind:"local"},...v]);
  setSelected(id);setModal(false);setDraftName("");setSource("");setRights(false);notify("Local draft created in this browser session. No data was uploaded or model trained.");
 }
 return <div className="x1-app">
 <aside className={"sidebar "+(drawer?"open":"")}>
  <div className="brand"><span className="brand-mark">X<span>1</span></span><span className="brand-text"><strong>X1 OPERATING SYSTEM</strong><small>CREATIVE INTELLIGENCE</small></span></div>
  <div className="workspace-picker"><div className="workspace-avatar">S</div><div><b>Strategic Minds AI</b><small>Private workspace</small></div><I name="chevron" size={16}/></div>
  <div className="side-groups">{groups.map(group=><div className="side-group" key={group.title}><div className="group-title">{group.title}</div>{group.items.map(item=><button type="button" key={item.name} className={"nav-btn "+(item.name===section?"active":"")} onClick={()=>selectSection(item.name)}><I name={item.icon} size={18}/><span>{item.name}</span>{item.name==="Avatar Studio"&&<small>01</small>}</button>)}</div>)}</div>
  <div className="sidebar-footer"><div className="footer-notice"><span className="signal"/><div><b>Foundation mode</b><small>Integrations not yet activated</small></div></div><div className="sidebar-user"><div className="user-dot">X</div><div><b>X1 Operator</b><small>Prototype access</small></div><I name="more" size={17}/></div></div>
 </aside>
 <main className="main"><header className="topbar"><div className="breadcrumb"><button className="mobile-menu" aria-label="Open navigation" onClick={()=>setDrawer(!drawer)}><I name="menu"/></button><span>Workspace</span><I name="chevron" size={14}/><b>{section}</b></div><div className="topbar-right"><Status>DEVELOPMENT PREVIEW</Status><span className="top-divider"/><span className="icon-bubble"><I name="shield" size={17}/></span><span className="header-avatar">S</span></div></header>
 <div className="content">
 {section==="Avatar Studio"&&<><div className="eyebrow"><span className="eyebrow-line"/> DIGITAL HUMAN CREATION</div><div className="heading-row"><div><h1>Avatar Studio<span className="heading-spark">✦</span></h1><p className="subhead">Create extraordinary digital personalities, powered by intelligence you control.</p></div><button className="primary-btn" onClick={()=>setModal(true)}><I name="plus" size={18}/>Create avatar</button></div>
 <div className="feature-banner"><div className="feature-content"><span className="feature-kicker"><I name="spark" size={15}/> INTRODUCING X1 LIVE</span><h2>Your presence.<br/><em>Beyond the screen.</em></h2><p>A new canvas for real-time digital humans. Design identities, prepare voices, and connect independent rendering engines.</p><button className="feature-cta" onClick={()=>notify("Real-time renderer is not connected. The private test will open after GPU and WebRTC validation.")}>Explore live avatars <I name="arrow" size={16}/></button></div><div className="feature-visual"><div className="orb orb-a"/><div className="orb orb-b"/><div className="wire-ring r1"/><div className="wire-ring r2"/><div className="wire-ring r3"/><span className="vertical-brand">X1 / DIGITAL HUMAN</span><div className="hero-monogram">X1</div></div><div className="feature-note">OWNED INFRASTRUCTURE · NO BASE44</div></div>
 <div className="section-title-row"><div><h3>Your avatar workspace <span className="small-count">{avatars.length}</span></h3><p>Prototype identities and approved digital humans</p></div><div className="tabs">{["All avatars","Local drafts"].map(t=><button className={tab===t?"chosen":""} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div></div>
 <div className="toolbar"><label className="search-field"><I name="search" size={17}/><input aria-label="Search avatars" placeholder="Search avatars..." value={search} onChange={e=>setSearch(e.target.value)}/></label><Status kind="warning">Rendering engine pending</Status></div>
 <div className="avatar-grid">{filtered.map(a=><button className={"avatar-card "+(a.id===selected?"selected":"")} key={a.id} onClick={()=>{setSelected(a.id);notify(a.name+" selected.");}}><Portrait avatar={a}/><div className="avatar-copy"><b>{a.name}</b><span>{a.role}</span><small>{a.mode}</small></div><I name="chevron" size={17}/></button>)}<button className="new-avatar-card" onClick={()=>setModal(true)}><span><I name="plus" size={25}/></span><b>Create new avatar</b><small>Begin a consent-based identity draft</small></button></div>
 <div className="detail-panel"><div className="detail-icon"><I name="face" size={21}/></div><div><b>{selectedAvatar.name} <Status>{selectedAvatar.kind==="local"?"LOCAL DRAFT":"IDENTITY REFERENCE"}</Status></b><p>{selectedAvatar.kind==="local"?"Saved in this browser session only.":"Your source-of-truth identity must be verified before training."} Video renderer, voice transport and enrollment are not connected yet.</p></div><button className="outline-btn" onClick={()=>notify("Live avatar test is gated until real-time renderer, licensed likeness and session services pass validation.")}>Live test <I name="arrow" size={15}/></button></div></>}
 {section==="Overview"&&<><div className="eyebrow"><span className="eyebrow-line"/> COMMAND CENTER</div><div className="heading-row"><div><h1>Welcome to X1<span className="heading-spark">✦</span></h1><p className="subhead">One operating system for digital humans and autonomous engineering.</p></div><button className="primary-btn" onClick={()=>selectSection("Avatar Studio")}><I name="arrow"/>Open Studio</button></div><div className="metrics-grid">{[["Digital identities",String(avatars.length),"Local preview catalog"],["Rendering services","0","Connected and tested"],["Active live sessions","0","No sessions started"],["Autonomous builds","Not bound","X1 staging bridge pending"]].map(x=><div className="metric" key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></div>)}</div><div className="empty-panel"><I name="spark" size={35}/><h2>One platform. Many possibilities.</h2><p>Open Avatar Studio to begin creating your first approved digital-human identity.</p><button className="outline-btn" onClick={()=>selectSection("Avatar Studio")}>Open Avatar Studio <I name="arrow"/></button></div></>}
 {section==="Video Creator"&&<><div className="eyebrow"><span className="eyebrow-line"/> GENERATIVE PRODUCTION</div><div className="heading-row"><div><h1>Video Creator</h1><p className="subhead">Storyboard, script and prepare intelligent avatar-led video.</p></div><Status kind="warning">RENDERER OFFLINE</Status></div><div className="workspace-panel"><div className="panel-label">01 / YOUR SCRIPT</div><textarea className="creative-textarea" placeholder="Write what your digital human should say..." value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)}/><div className="composer-bottom"><span><I name="alert" size={15}/> Generation will remain disabled until licensed video inference is connected.</span><button className="primary-btn" onClick={()=>notify(videoPrompt.trim()?"Script prepared locally. No rendering backend has been connected.":"Please write a script first.")}>Prepare script <I name="arrow"/></button></div></div></>}
 {section==="Live Sessions"&&<><div className="eyebrow"><span className="eyebrow-line"/> REALTIME CONVERSATIONS</div><div className="heading-row"><div><h1>Live Sessions</h1><p className="subhead">Low-latency, interruptible conversations with visual AI agents.</p></div><Status kind="warning">WEBRTC UNBOUND</Status></div><div className="live-stage"><div className="live-orb"/><div className="live-center"><I name="radio" size={36}/><h2>Live avatar sessions</h2><p>Media transport and GPU rendering are not yet connected. We won't substitute a static portrait for a live avatar.</p><button className="outline-btn" onClick={()=>notify("Live sessions unavailable until an independently verified renderer and real-time media bridge are connected.")}>Check readiness <I name="arrow"/></button></div></div></>}
 {section==="Voice Lab"&&<><div className="eyebrow"><span className="eyebrow-line"/> VOICE DESIGN</div><div className="heading-row"><div><h1>Voice Lab</h1><p className="subhead">Design and test consented voices for your digital identities.</p></div><Status kind="warning">PROVIDER PENDING</Status></div><div className="workspace-panel"><div className="panel-label">VOICE DIRECTION</div><textarea className="creative-textarea" placeholder="Describe the desired voice, speaking tempo and tone..." value={voicePrompt} onChange={e=>setVoicePrompt(e.target.value)}/><div className="composer-bottom"><span><I name="shield" size={16}/> Only consented voices may be enrolled.</span><button className="primary-btn" onClick={()=>notify("Voice notes retained in the current browser session only. No voice synthesis is active.")}>Save voice notes <I name="check"/></button></div></div></>}
 {section==="Agent Workspace"&&<><div className="eyebrow"><span className="eyebrow-line"/> AUTONOMOUS ENGINEERING</div><div className="heading-row"><div><h1>X1 Agent Workspace</h1><p className="subhead">Safe queued engineering tasks, approvals, leases and receipts.</p></div><Status kind="warning">QUEUE BRIDGE NOT BOUND</Status></div><div className="metrics-grid">{[["Control-plane source","X1 staging","Existing validated schema"],["Worker orchestration","Railway","Existing swarm preview"],["Autonomous dispatch","Disabled","Until signed authorization"],["Protected release","Approval","Always operator-gated"]].map(x=><div className="metric" key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></div>)}</div><div className="empty-panel"><I name="cpu" size={36}/><h2>Engineering queue will live here.</h2><p>Connect the existing X1 Supabase work queue and Railway swarm through signed, tenant-scoped APIs. No jobs have been dispatched by this prototype.</p><button className="outline-btn" onClick={()=>notify("No queue integration is active. Read docs/X1_AUTONOMOUS_CODING.md before binding.")}>View connection status <I name="arrow"/></button></div></>}
 {section==="Asset Library"&&<><div className="eyebrow"><span className="eyebrow-line"/> MEDIA & RIGHTS</div><div className="heading-row"><div><h1>Asset Library</h1><p className="subhead">Manage consented identity references, audio and video assets.</p></div><button className="primary-btn" onClick={()=>setModal(true)}><I name="upload"/>New draft</button></div><div className="empty-panel"><I name="layers" size={36}/><h2>Private asset vault</h2><p>Supabase Storage will hold approved source assets after authenticated uploads, consent receipts and tenant-isolation testing. The library is currently unbound.</p></div></>}
 {section==="Settings"&&<><div className="eyebrow"><span className="eyebrow-line"/> OWNED INFRASTRUCTURE</div><div className="heading-row"><div><h1>Workspace Settings</h1><p className="subhead">One control plane. Explicit ownership. No hidden provider lock-in.</p></div><Status>PREVIEW CONFIGURATION</Status></div><div className="settings-panel">{[["GitHub","Canonical X1 repository","Code source"],["Vercel","Frontend + AI Gateway","Project binding pending"],["Supabase","Tenant data + queues","Binding pending"],["Railway","Persistent X1 workers","Reuse existing preview"],["Avatar GPU","Self-hosted video inference","Unprovisioned"],["Base44","Not used","ZERO runtime dependencies"]].map(row=><div className="setting-row" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b><small>{row[2]}</small></div>)}</div></>}
 <footer className="page-footer"><span>© 2026 Strategic Minds AI · X1 Operating System</span><span>FOUNDATION PREVIEW · NO BILLABLE SERVICES STARTED BY THIS APP</span></footer>
 </div>
 </main>
 {toast&&<div className="toast" role="status"><I name="alert" size={17}/><span>{toast}</span><button aria-label="Dismiss notification" onClick={()=>setToast("")}><I name="close" size={16}/></button></div>}
 {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><div className="modal" role="dialog" aria-modal="true" aria-label="Create an avatar draft"><div className="modal-heading"><div><span className="feature-kicker">NEW DIGITAL IDENTITY</span><h2>Create an avatar draft</h2><p>This prepares a local specification. No upload or training occurs.</p></div><button className="x-button" onClick={()=>setModal(false)} aria-label="Close"><I name="close"/></button></div><form onSubmit={addDraft}><label className="form-field">Avatar name<input required value={draftName} onChange={e=>setDraftName(e.target.value)} placeholder="e.g. Eden Skye"/></label><label className="form-field">Creation approach<select value={draftType} onChange={e=>setDraftType(e.target.value)}><option>Video avatar</option><option>Photo avatar</option><option>Stylized 3D avatar</option></select></label><label className="form-field">Local reference file <small>(filename only; nothing is uploaded)</small><input type="file" accept="image/*,video/*" onChange={e=>setSource(e.target.files?.[0]?.name||"")}/></label><label className="consent"><input type="checkbox" required checked={rights} onChange={e=>setRights(e.target.checked)}/><span>I confirm I have the necessary rights and consent for this identity and any source media.</span></label><button type="submit" className="primary-btn wide"><I name="plus"/>Create local draft</button></form></div></div>}
 {drawer&&<button className="mobile-scrim" aria-label="Close navigation" onClick={()=>setDrawer(false)}/>}
 </div>;
}

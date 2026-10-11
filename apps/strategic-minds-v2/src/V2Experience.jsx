import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Bot, BrainCircuit, ChartNoAxesCombined, CheckCircle2, DatabaseZap, Globe2, Headphones, Menu, Phone, Search, ShieldCheck, Sparkles, Workflow, X } from 'lucide-react';
import './V2Experience.css';
import './V2Motion.css';
import './X1Brand.css';

const ASSETS='/v2-assets/';
const EDEN_PHONE='tel:+18665711174';
const BUSINESS_PHONE='tel:+17722090266';
const EMAIL='jeremy@strategicmindsai.com';
const X1_STUDIO='https://x1-avatar-studio-preview-o0e8zgksl-strategic-minds-advisory.vercel.app/';
// A/B/C are operator preview variants, not a verified live experiment.
const VARIANTS=[{id:'a',label:'MYSTERY'},{id:'b',label:'EXPLORE'},{id:'c',label:'EDEN'}];
const SERVICES=[
 {icon:BrainCircuit,title:'X1 Intelligence',copy:'A unified operating vision for decision support, business AI and actionable insight.'},
 {icon:Workflow,title:'Autonomous Build Engine',copy:'Governed engineering workflows with human approvals and independently verified changes.'},
 {icon:Bot,title:'AI Agent Workspace',copy:'Purpose-built agent experiences with controlled tools, memory and clear operating boundaries.'},
 {icon:Headphones,title:'Eden Skye & Digital Humans',copy:'Explore human-centered AI onboarding, voice experiences and emerging avatar capabilities.'},
 {icon:Globe2,title:'Website & Funnel Factory',copy:'Premium original digital experiences with repeatable, quality-controlled production.'},
 {icon:DatabaseZap,title:'Client OS & CRM',copy:'Bring customer relationships, lead intelligence, and operations together in one place.'},
 {icon:Search,title:'X1 Growth Intelligence',copy:'Evidence-led SEO, AEO, GEO and local discovery with strict content quality standards.'},
 {icon:ChartNoAxesCombined,title:'Measurement & Validation',copy:'Test outcomes, review receipts and continuously improve real business performance.'}
];
const STEPS=[
 {field:'business',label:'Business or industry',title:'Tell Eden about your business.',placeholder:'For example: Residential construction'},
 {field:'goal',label:'Your highest priority',title:'What should AI help you with first?',options:['Capture and qualify leads','Automate repetitive tasks','Build an AI website','Create AI agents','Organize business data','Explore my opportunities']},
 {field:'market',label:'Service area or market',title:'Where are you hoping to grow?',placeholder:'For example: South Florida'},
 {field:'notes',label:'A final thought (optional)',title:'What else would you like Eden to know?',placeholder:'A challenge, an idea or a dream',optional:true}
];
function eventV2(action,variant,extra={}) {
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('smai:v2-interaction',{detail:{action,variant,...extra}}));
}
function PreviewHead({variant}) {
 useEffect(()=>{
  const title=document.title; document.title='X1 Operating System | Strategic Minds AI | Design Preview '+variant.toUpperCase();
  const prior=document.querySelector('meta[name="robots"]');
  const meta=prior||document.createElement('meta'); const old=prior?.content;
  if(!prior){meta.name='robots';document.head.appendChild(meta);}
  meta.content='noindex,nofollow,noarchive';
  return()=>{document.title=title;if(prior)meta.content=old;else meta.remove();};
 },[variant]);
 return null;
}
function Call({eden=false,variant,small=false}) {
 return <a className={'v2-call '+(eden?'v2-call-eden':'v2-call-now')+(small?' v2-call-small':'')}
 href={eden?EDEN_PHONE:BUSINESS_PHONE}
 aria-label={eden?'Call Eden Skye at 866-571-1174':'Call Strategic Minds AI at 772-209-0266'}
 title={eden?'866-571-1174':'772-209-0266'}
 onClick={()=>eventV2(eden?'eden_phone_click':'business_phone_click',variant)}>
 {eden?<Sparkles size={16}/>:<Phone size={16}/>}<span>{eden?'CALL EDEN':'CALL NOW'}</span></a>;
}
function Navigation({variant}) {
 const [open,setOpen]=useState(false);
 const pages=[
 ['HOME','/v2/a'],['X1 PLATFORM','/v2/b#services'],['AVATAR STUDIO',X1_STUDIO],
 ['AUTOMATION','/v2/b#process'],['PRICING','/pricing'],
 ['CLIENT PORTAL','/portal'],['CONTACT','/v2/c#onboarding']
 ];
 return <header className="v2-header"><div className="v2-header-grid">
  <Call eden variant={variant}/>
  <div className="v2-nav-shell">
   <button type="button" className="v2-menu" aria-label={open?'Close navigation':'Open navigation'}
    aria-controls="v2-links" aria-expanded={open} onClick={()=>setOpen(x=>!x)}>
    <span>EXPLORE</span>{open?<X size={20}/>:<Menu size={20}/>}</button>
   <nav id="v2-links" className={'v2-nav-links'+(open?' v2-nav-open':'')} aria-label="Main navigation">
   {pages.map(([name,href],i)=><a key={name} href={href} aria-current={i===0?'page':undefined}
    {...(name==='AVATAR STUDIO'?{target:'_blank',rel:'noopener noreferrer',title:'X1 Avatar Studio development preview opens in a new tab'}:{})}
    onClick={()=>{setOpen(false);eventV2('navigation',variant,{target:name});}}>{name}</a>)}
   </nav>
  </div>
  <Call variant={variant}/>
 </div></header>;
}
function Brand({small=false}) {
 return <div className={'v2-brand'+(small?' v2-brand-small':'')}>
  <div className="v2-emblem-stage"><img src={ASSETS+'silver-emblem.png'} alt="Metallic Strategic Minds AI S emblem" width="370" height="360" className="v2-emblem"/><span className="v2-emblem-glint" aria-hidden="true"/></div>
  <img src={ASSETS+'chrome-wordmark.png'} alt="Strategic Minds AI" width="1065" height="78" className="v2-wordmark"/>
  <span className="v2-tagline"><i aria-hidden="true"/>INTELLIGENCE IN MOTION<i aria-hidden="true"/></span>
 </div>;
}
function X1Signature({compact=false}) {
 return <div className={'v2-x1-signature'+(compact?' v2-x1-signature-compact':'')}
  aria-label="X1 Operating System by Strategic Minds AI">
  <span className="v2-x1-monogram" aria-hidden="true">X<span>1</span></span>
  <span className="v2-x1-signature-copy"><strong>X1 OPERATING SYSTEM</strong>
   <small>UNIFIED INTELLIGENCE · STRATEGIC MINDS AI</small></span>
  <span className="v2-x1-spark" aria-hidden="true"><Sparkles size={17}/></span>
 </div>;
}
function Earth() {return <div className="v2-earth" aria-hidden="true">
  <img src={ASSETS+'connected-earth.jpg'} alt="" width="1254" height="306"/>
  <svg className="v2-network" viewBox="0 0 1254 306" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <path className="v2-network-track" d="M104 230 Q276 56 464 205"/>
    <path className="v2-network-flow" d="M104 230 Q276 56 464 205"/>
    <path className="v2-network-track" d="M464 205 Q670 25 860 181"/>
    <path className="v2-network-flow" d="M464 205 Q670 25 860 181"/>
    <path className="v2-network-track" d="M860 181 Q1011 35 1171 232"/>
    <path className="v2-network-flow" d="M860 181 Q1011 35 1171 232"/>
    <path className="v2-network-track" d="M261 253 Q599 81 1015 253"/>
    <path className="v2-network-flow" d="M261 253 Q599 81 1015 253"/>
    <circle className="v2-network-beacon" cx="104" cy="230" r="3.6"/>
    <circle className="v2-network-beacon" cx="464" cy="205" r="4"/>
    <circle className="v2-network-beacon" cx="860" cy="181" r="3.8"/>
    <circle className="v2-network-beacon" cx="1171" cy="232" r="3"/>
  </svg>
</div>;}
function Cta({variant,label='START YOUR AI TRANSFORMATION'}) {
 return <Link to="/v2/eden#onboarding" className="v2-main-cta"
  onClick={()=>eventV2('onboarding_cta',variant)}>
  <span>{label}</span><span className="v2-cta-arrow"><ArrowRight size={18}/></span></Link>;
}
function Hero({variant,expanded=false}) {
 return <section className={'v2-hero v2-earth-hero'+(expanded?' v2-earth-hero-expanded':'')}>
  <div className="v2-nebula" aria-hidden="true"/>
  <Earth/>
  <div className="v2-hero-center">
   <X1Signature/>
   <Brand/>
   {expanded?<div className="v2-hero-statement"><h1>Build Smarter.<span>Grow Faster.</span></h1><Cta variant={variant}/></div>
   :<div className="v2-hero-statement v2-hero-statement-short">
    <h1 className="v2-visually-hidden">X1 Operating System by Strategic Minds AI. Intelligence in Motion. Build Smarter. Grow Faster.</h1>
    <Cta variant={variant} label="BUILD SMARTER.  GROW FASTER."/></div>}
   <div className="v2-x1-pathways" aria-label="Explore X1 Operating System">
    <Link to="/v2/b#services" onClick={()=>eventV2('x1_platform_explore',variant)}>EXPLORE THE PLATFORM <ArrowUpRight size={15}/></Link>
    <span aria-hidden="true" className="v2-x1-pathway-divider"/>
    <a href={X1_STUDIO} target="_blank" rel="noopener noreferrer" title="X1 Avatar Studio development preview opens in a new tab"
     onClick={()=>eventV2('x1_avatar_preview',variant)}>AVATAR STUDIO PREVIEW <ArrowUpRight size={15}/></a>
   </div>
  </div>
  {expanded&&<a href="#services" className="v2-down-link">EXPLORE OUR SOLUTIONS <ArrowRight size={16}/></a>}
 </section>;
}
function ServiceCards({variant}) {
 return <section className="v2-section v2-services" id="services"><div className="v2-wrap">
  <div className="v2-heading"><p className="v2-eyebrow">THE X1 PLATFORM</p><h2>One intelligent operating system.<em>Built around your business.</em></h2>
  <p>From premium websites and human-centered AI to client operations and governed engineering, X1 brings the pieces of a modern digital business into one coherent vision.</p></div>
  <div className="v2-card-grid">{SERVICES.map(({icon:Icon,title,copy},i)=>
   <a className="v2-service-card" id={i===6?'visibility':undefined} key={title} href="/v2/c#onboarding"
     onClick={()=>eventV2('service_selected',variant,{service:title})}>
    <span className="v2-card-icon"><Icon size={34} strokeWidth={1.45}/></span>
    <h3>{title}</h3><p>{copy}</p><span className="v2-card-arrow"><ArrowUpRight size={19}/></span>
   </a>
  )}</div>
 </div></section>;
}
function LongPage({variant}) {
 return <><Hero variant={variant} expanded/><ServiceCards variant={variant}/>
  <section className="v2-section v2-reach"><div className="v2-wrap v2-reach-grid">
   <div><p className="v2-eyebrow">THE X1 ECOSYSTEM</p>
    <h2>One platform.<em>Every moving part connected.</em></h2>
    <p>Discover an integrated direction for AI experiences, customer engagement, automation and measurable digital growth. Every capability advances through deliberate validation.</p>
    <a className="v2-alt-cta" href="/v2/c#onboarding" onClick={()=>eventV2('growth_cta',variant)}>EXPLORE YOUR OPPORTUNITY <ArrowRight size={18}/></a>
   </div><img src={ASSETS+'connected-earth.jpg'} alt="Glowing global connectivity across Earth" width="1254" height="306" loading="lazy"/>
  </div></section>
  <section className="v2-section v2-process" id="process"><div className="v2-wrap">
   <div className="v2-heading"><p className="v2-eyebrow">THE X1 METHOD</p>
    <h2>Discover. Design. <em>Build. Improve.</em></h2></div>
   <div className="v2-process-grid">{[['01','Discover','Find your highest-value opportunity.'],['02','Architect','Select a practical system and milestones.'],['03','Validate','Build a real preview and verify outcomes.'],['04','Improve','Measure performance and refine.']].map(([n,t,copy])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{copy}</p></div>)}</div>
  </div></section>
  <section className="v2-last-cta"><p className="v2-eyebrow">INTELLIGENCE IN MOTION</p><h2>Make your next idea <em>intelligent.</em></h2>
   <div className="v2-last-buttons"><Call eden variant={variant}/><Cta variant={variant}/></div></section>
 </>;
}
function Onboarding({variant}) {
 const [step,setStep]=useState(0),[data,setData]=useState({business:'',goal:'',market:'',notes:''}),[done,setDone]=useState(false);
 const q=STEPS[step],value=data[q.field]||'',ok=q.optional||value.trim().length>0;
 const body=['Strategic Minds AI - voluntary discovery request','','Business or industry: '+data.business,
  'AI priority: '+data.goal,'Target market: '+data.market,'Notes: '+(data.notes||'No additional notes')].join('\n');
 const mailto='mailto:'+EMAIL+'?subject='+encodeURIComponent('Strategic Minds AI | New discovery request')+'&body='+encodeURIComponent(body);
 return <section className="v2-section v2-onboarding" id="onboarding"><div className="v2-wrap">
  <div className="v2-onboarding-panel"><div className="v2-heading"><p className="v2-eyebrow">START WITH EDEN</p>
   <h2>Your AI discovery journey.</h2><p>Four simple questions. No overwhelming forms.</p></div>
   <div className="v2-steps" aria-label="Onboarding progress">{STEPS.map((s,i)=><span key={s.field} className={i<=step?'is-current':''}/>)}</div>
   {!done?<form onSubmit={e=>{e.preventDefault();if(!ok)return;
      eventV2('onboarding_step',variant,{step:step+1});
      if(step===STEPS.length-1)setDone(true);else setStep(x=>x+1);}}>
    <p className="v2-step-count">QUESTION {step+1} OF 4</p><h3>{q.title}</h3>
    <label htmlFor={'v2-field-'+q.field}>{q.label}</label>
    {q.options?<select id={'v2-field-'+q.field} value={value}
      onChange={e=>setData({...data,[q.field]:e.target.value})}>
      <option value="">Choose one</option>{q.options.map(v=><option key={v}>{v}</option>)}</select>
     :<input id={'v2-field-'+q.field} value={value} type="text" autoComplete="off"
       maxLength={180} placeholder={q.placeholder} onChange={e=>setData({...data,[q.field]:e.target.value})}/>}
    <div className="v2-form-actions">{step>0&&<button type="button" className="v2-quiet" onClick={()=>setStep(s=>s-1)}>BACK</button>}
     <button type="submit" className="v2-alt-cta" disabled={!ok}>{step===3?'REVIEW MY ANSWERS':'CONTINUE'} <ArrowRight size={17}/></button></div>
   </form>:<div className="v2-finished" role="status"><CheckCircle2 size={34}/><h3>Your discovery brief is ready.</h3>
      <p><strong>Business:</strong> {data.business}</p><p><strong>Goal:</strong> {data.goal}</p><p><strong>Market:</strong> {data.market}</p>
      <p>No details have been sent to any server. You can choose to open a prefilled email draft.</p>
      <div className="v2-form-actions"><button type="button" className="v2-quiet" onClick={()=>{setStep(0);setDone(false)}}>EDIT</button>
       <a href={mailto} className="v2-alt-cta" onClick={()=>eventV2('open_discovery_email',variant)}>OPEN EMAIL DRAFT <ArrowUpRight size={18}/></a></div>
    </div>}
   <p className="v2-privacy"><ShieldCheck size={15}/> Answers remain in this browser until you choose to share them.</p>
  </div>
 </div></section>;
}
function EdenPage({variant}) {
 return <><section className="v2-hero v2-eden-hero">
  <div className="v2-nebula" aria-hidden="true"/>
  <div className="v2-wrap v2-eden-grid">
   <div className="v2-eden-copy"><Brand small/><X1Signature compact/>
    <p className="v2-eyebrow"><span className="v2-green-dot"/> MEET YOUR AI WELCOME HOST</p>
    <h1>Meet Eden Skye.<em>Your guide to X1.</em></h1>
    <p>Meet the welcome host for the X1 Operating System, created by Strategic Minds AI. Eden helps you clarify your goals and explore what intelligent business systems can do for you.</p>
    <div className="v2-eden-actions"><a href="#onboarding" className="v2-main-cta"
      onClick={()=>eventV2('eden_onboarding_start',variant)}>START WITH EDEN <span className="v2-cta-arrow"><ArrowRight size={18}/></span></a>
      <Call eden variant={variant}/></div>
    <p className="v2-eden-note"><ShieldCheck size={17}/> Eden is an AI assistant. Live HeyGen video is not yet active in this preview.</p>
   </div>
   <figure className="v2-eden-figure"><img src={ASSETS+'eden-skye-original.avif'} alt="Eden Skye with dark brown hair, glasses and a futuristic black jacket" width="900" height="1100"/>
    <figcaption><span className="v2-green-dot"/> EDEN SKYE <small>AI ONBOARDING SPECIALIST</small></figcaption>
   </figure>
  </div></section>
  <Onboarding variant={variant}/>
  <ServiceCards variant={variant}/>
  <section className="v2-last-cta"><h2>Ready when you are.</h2><div className="v2-last-buttons"><Call eden variant={variant}/><a href="#onboarding" className="v2-alt-cta">START YOUR DISCOVERY <ArrowRight size={18}/></a></div></section>
 </>;
}
export default function V2Experience(){
 const {variant:route}=useParams(),variant=route==='b'?'b':route==='c'||route==='eden'?'c':'a';
 return <div className={'v2-page v2-variant-'+variant}>
   <PreviewHead variant={variant}/><a href="#main-content" className="v2-skip">Skip to content</a>
   <Navigation variant={variant}/>
   <main id="main-content">{variant==='a'?<Hero variant="a"/>:variant==='b'?<LongPage variant="b"/>:<EdenPage variant="c"/>}</main>
   <footer className="v2-footer"><strong><span className="v2-x1-footer-mark">X1</span> OPERATING SYSTEM</strong><span>BY STRATEGIC MINDS AI · INTELLIGENCE IN MOTION</span><Link to="/pricing">PRICING</Link><Link to="/portal">CLIENT PORTAL</Link>
    <p><a href={'mailto:'+EMAIL}>{EMAIL}</a> · <a href={BUSINESS_PHONE}>(772) 209-0266</a></p></footer>
   <nav className="v2-variant-switch" aria-label="Design preview selection">
    <span>NOINDEX · DESIGN PREVIEW</span><div>{VARIANTS.map(x=><Link key={x.id}
      to={'/v2/'+x.id} title={x.label} aria-current={variant===x.id?'page':undefined}
      onClick={()=>eventV2('switch_preview',variant,{next:x.id})} className={variant===x.id?'selected':''}>{x.id.toUpperCase()}</Link>)}</div>
   </nav>
 </div>;
}

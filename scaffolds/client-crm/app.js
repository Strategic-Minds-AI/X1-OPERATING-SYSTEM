"use strict";
// Source-controlled X1 synthetic CRM canary. No network, credentials, clients, or production operations.
(function(){
 const seed=[
  {id:1,name:"Harborview Property Group",service:"Epoxy flooring estimate",market:"Pompano Beach",status:"Qualified",date:"Today"},
  {id:2,name:"Lighthouse Retail",service:"Commercial flooring",market:"Boca Raton",status:"New",date:"Today"},
  {id:3,name:"Palmline Contractors",service:"Website redesign",market:"Fort Lauderdale",status:"Won",date:"Yesterday"},
  {id:4,name:"Coastal Auto Group",service:"Lead generation website",market:"Deerfield Beach",status:"New",date:"Yesterday"},
  {id:5,name:"Coral Creek Services",service:"Client portal",market:"Coral Springs",status:"Qualified",date:"Tuesday"},
  {id:6,name:"Atlantic Property Care",service:"Instant Estimate",market:"West Palm Beach",status:"New",date:"Monday"}
 ];
 const storeKey="x1-demo-client-command-v1";
 const el=id=>document.getElementById(id);
 let data=load(),view="overview",filter="All",query="";
 function load(){try{const s=JSON.parse(localStorage.getItem(storeKey));if(Array.isArray(s)&&s.length<=100&&s.every(x=>typeof x.name==="string"&&typeof x.service==="string"))return s;}catch{}return structuredClone(seed);}
 function save(){localStorage.setItem(storeKey,JSON.stringify(data));}
 function html(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
 function make(tag,text,cls){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=text;return e;}
 function rowHead(title,description){return '<div class="headline-row"><div><h2 class="section-title">'+html(title)+'</h2><p class="subtle">'+html(description)+'</p></div><button class="primary" id="open-new" type="button">+ New demo lead</button></div>';}
 const statuses=["New","Qualified","Won"];
 function counts(){return {total:data.length,new:data.filter(x=>x.status==="New").length,qualified:data.filter(x=>x.status==="Qualified").length,won:data.filter(x=>x.status==="Won").length};}
 function attach(){const button=el("open-new");if(button)button.addEventListener("click",()=>el("lead-dialog").showModal());}
 function metric(label,n,change){return '<div class="kpi"><span class="kpi-label">'+html(label)+'</span><span class="kpi-value">'+html(n)+'</span><span class="kpi-meta">'+html(change)+'</span></div>';}
 function renderOverview(){const s=counts();
 el("view-container").innerHTML=rowHead("At a glance","A complete working interface backed by local synthetic data")+
  '<div class="kpis">'+metric("Total demo leads",s.total,"Saved in this browser")+metric("New inquiries",s.new,"Awaiting qualification")+metric("Qualified opportunities",s.qualified,"Ready for follow-up")+metric("Won examples",s.won,"Synthetic conversions")+'</div>'+
  '<div class="two-grid"><section class="panel"><h2 class="panel-title">Pipeline momentum</h2><p class="panel-sub">Illustrative status distribution, not measured business results</p><div class="graph">'+
  ["New","Qualified","Won"].map((name,i)=>'<div class="bar-col"><div class="bar '+(i===2?"strong":"")+'" style="height:'+Math.max(6,Math.round((data.filter(x=>x.status===name).length/Math.max(1,data.length))*170))+'px"></div><span>'+name+'</span></div>').join("")+
  '</div></section><section class="panel"><h2 class="panel-title">Activity ledger</h2><p class="panel-sub">Real actions are recorded locally only</p><ul class="timeline"><li><span class="bullet"></span><span><strong>Project scaffold generated</strong>Files emitted by the X1 canary builder</span></li><li><span class="bullet"></span><span><strong>Client inbox available</strong>Search, filtering, status changes and CSV</span></li><li><span class="bullet"></span><span><strong>No external integrations</strong>Production provider bindings remain gated</span></li></ul></section></div>';
 attach();
 }
 function changeStatus(id){const row=data.find(x=>x.id===id);if(!row)return;row.status=statuses[(statuses.indexOf(row.status)+1)%statuses.length];save();render();}
 function csvCell(value){let s=String(value).replace(/\r|\n/g," ");if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 function exportCsv(){const rows=[["Name","Service","Market","Status","Date"],...data.map(x=>[x.name,x.service,x.market,x.status,x.date])];
 const csv=rows.map(r=>r.map(csvCell).join(",")).join("\r\n");const u=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 const a=document.createElement("a");a.href=u;a.download="x1-synthetic-leads.csv";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
 }
 function renderLeads(){
  let rows=data.filter(x=>(filter==="All"||x.status===filter)&&[x.name,x.service,x.market].some(y=>y.toLowerCase().includes(query.toLowerCase())));
  el("view-container").innerHTML=rowHead("Lead inbox","Search, add, filter, export and advance synthetic leads")+
   '<div class="table-toolbar"><input type="search" id="find-lead" aria-label="Search demo leads" placeholder="Search name, service or market…" value="'+html(query)+'"><div class="filters">'+
    ["All",...statuses].map(f=>'<button class="filter '+(filter===f?"active":"")+'" data-status="'+f+'" type="button">'+f+'</button>').join("")+
   '</div><button class="outline small" type="button" id="export">Export CSV ↓</button></div>'+
   '<div class="table-wrap"><table><thead><tr><th>Customer</th><th>Market</th><th>Status</th><th>Received</th><th>Action</th></tr></thead><tbody>'+
   rows.map(x=>'<tr><td><div class="lead-name">'+html(x.name)+'</div><div class="lead-service">'+html(x.service)+'</div></td><td>'+html(x.market)+'</td><td><span class="pill '+x.status.toLowerCase()+'">'+x.status+'</span></td><td>'+html(x.date)+'</td><td><button class="row-button" data-advance="'+x.id+'" type="button" aria-label="Advance '+html(x.name)+' status">Advance ↗</button></td></tr>').join("")+
   '</tbody></table>'+(rows.length?"":'<div class="empty">No matching synthetic leads. Try another filter.</div>')+'</div>';
  attach();
  el("find-lead").addEventListener("input",e=>{query=e.target.value;const start=e.target.selectionStart;renderLeads();el("find-lead").focus();el("find-lead").setSelectionRange(start,start);});
  document.querySelectorAll("[data-status]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.status;renderLeads();}));
  document.querySelectorAll("[data-advance]").forEach(b=>b.addEventListener("click",()=>changeStatus(Number(b.dataset.advance))));
  el("export").addEventListener("click",exportCsv);
 }
 function renderSites(){
  el("view-container").innerHTML='<div class="headline-row"><div><h2 class="section-title">Website fleet</h2><p class="subtle">Preview-only examples for the presentation. No real domains provisioned.</p></div></div>'+
  '<div class="tiles"><article class="tile"><span class="muted">01 / PREVIEW CONCEPT</span><h3>Instant Estimate</h3><p>Original premium site design remains locked until independent visual QA.</p><span class="pill qualified">Preview concept</span></article>'+
  '<article class="tile"><span class="muted">02 / PREVIEW CONCEPT</span><h3>Client Portal</h3><p>Actual synthetic inbox interactions are implemented in this generated app.</p><span class="pill qualified">Local canary</span></article></div>';
 }
 function renderAutomations(){
  el("view-container").innerHTML='<div class="headline-row"><div><h2 class="section-title">Automation readiness</h2><p class="subtle">Visible capability states rather than simulated agent activity.</p></div></div>'+
  '<div class="tiles"><article class="tile"><span class="muted">VERIFIABLE IN THIS APP</span><h3>Local lead workflow</h3><p>Add, search, filter, advance status and export sample leads. All in-browser.</p><span class="pill won">Working locally</span></article>'+
  '<article class="tile"><span class="muted">CONNECTION REQUIRED</span><h3>Autonomous agent queue</h3><p>X1 authenticating queue leases, coding executor and independent browser QA are not bound here.</p><span class="pill qualified">Not connected</span></article></div>';
 }
 function render(){
  el("lead-count").textContent=data.length;
  document.querySelectorAll("[data-view]").forEach(b=>{b.classList.toggle("selected",b.dataset.view===view);b.setAttribute("aria-current",b.dataset.view===view?"page":"false");});
  el("current-view").textContent={overview:"Overview",leads:"Lead inbox",sites:"Websites",automations:"Automations"}[view];
  ({overview:renderOverview,leads:renderLeads,sites:renderSites,automations:renderAutomations})[view]();
 }
 document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.view;render();}));
 el("reset").addEventListener("click",()=>{data=structuredClone(seed);save();filter="All";query="";render();});
 el("cancel").addEventListener("click",()=>el("lead-dialog").close());
 el("lead-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(!e.currentTarget.reportValidity())return;
  const clean=id=>el(id).value.trim().slice(0,100);
  data.unshift({id:Math.max(0,...data.map(x=>x.id))+1,name:clean("lead-name"),service:clean("lead-service"),market:clean("lead-market"),status:"New",date:"Today"});
  if(data.length>100)data=data.slice(0,100);save();el("lead-dialog").close();el("lead-form").reset();view="leads";render();
 });
 render();
})();

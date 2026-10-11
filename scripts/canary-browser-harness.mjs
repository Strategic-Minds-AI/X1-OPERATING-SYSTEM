import {readFile,writeFile} from "node:fs/promises";
import {resolve,join} from "node:path";
const dir=resolve(process.argv[2]||".");
const source=await readFile(join(dir,"index.html"),"utf8");
// Actual Chromium executes the generated app.js plus this independent interaction harness.
// The synthetic app is never deployed or given real client data.
const script=[
"(function(){",
"window.addEventListener('load',function(){",
" const checks=[];const check=(name,okay)=>checks.push({name,pass:Boolean(okay)});",
" try {",
" check('initial_kpi_visible',!!document.querySelector('.kpis'));",
" check('six_seed_leads',document.getElementById('lead-count').textContent==='6');",
" document.querySelector('[data-view=leads]').click();",
" check('lead_nav_click',document.querySelectorAll('tbody tr').length===6);",
" const q=document.getElementById('find-lead');q.value='Harborview';q.dispatchEvent(new Event('input',{bubbles:true}));",
" check('lead_search',document.querySelectorAll('tbody tr').length===1);",
" const a=document.getElementById('find-lead');a.value='';a.dispatchEvent(new Event('input',{bubbles:true}));",
" document.querySelector('[data-status=Qualified]').click();",
" check('qualified_filter',document.querySelectorAll('tbody tr').length===2);",
" document.querySelector('[data-status=All]').click();",
" document.getElementById('open-new').click();",
" check('lead_dialog_open',document.getElementById('lead-dialog').open===true);",
" for(const [id,val] of [['lead-name','Synthetic Canary Co'],['lead-service','Demo CRM'],['lead-market','Boca Raton']])document.getElementById(id).value=val;",
" document.getElementById('lead-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));",
" check('create_seventh_lead',document.querySelectorAll('tbody tr').length===7);",
" check('updated_side_count',document.getElementById('lead-count').textContent==='7');",
" check('generated_lead_visible',document.querySelector('tbody').textContent.includes('Synthetic Canary Co'));",
" document.querySelector('tbody [data-advance]').click();",
" check('status_advance',document.querySelector('tbody .pill').textContent==='Qualified');",
" document.getElementById('reset').click();",
" check('reset_demo',document.getElementById('lead-count').textContent==='6');",
" document.querySelector('[data-view=sites]').click();",
" check('sites_nav',document.getElementById('current-view').textContent==='Websites');",
" document.querySelector('[data-view=automations]').click();",
" check('automations_nav',document.getElementById('current-view').textContent==='Automations');",
" document.querySelector('[data-view=overview]').click();",
" check('overview_nav',!!document.querySelector('.kpis'));",
" }catch(e){checks.push({name:'BROWSER_EXCEPTION',pass:false,error:String(e)})}",
" const total=checks.length,passes=checks.filter(c=>c.pass).length;",
" const o=document.createElement('output');o.id='x1-browser-qa-result';o.textContent=(passes===total?'PASS':'FAIL')+':'+passes+'/'+total;document.body.appendChild(o);",
"});",
"})();"
].join("\n");
if(!source.includes("</body>"))throw Error("MISSING_HTML_BODY_MARKER");
await writeFile(join(dir,"qa-harness.html"),source.replace("</body>","<script>"+script+"</script></body>"));
process.stdout.write("CANARY_BROWSER_HARNESS_CREATED\n");

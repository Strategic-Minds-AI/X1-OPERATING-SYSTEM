import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('X1 primary lockup matches corporate V2 and original Strategic Minds parent brand is preserved',()=>{
 const s=read('../src/V2Experience.jsx'),css=read('../src/X1Brand.css');
 for(const token of ['X1 OPERATING SYSTEM','UNIFIED INTELLIGENCE · STRATEGIC MINDS AI','v2-x1-monogram','silver-emblem.png','chrome-wordmark.png','connected-earth.jpg','INTELLIGENCE IN MOTION'])
  assert.ok(s.includes(token),token);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/max-width:520px/);
});
test('X1 branded navigation stays useful, accessible and disclosure-safe',()=>{
 const s=read('../src/V2Experience.jsx');
 for(const label of ['X1 PLATFORM','AVATAR STUDIO','AUTOMATION','CLIENT PORTAL'])assert.ok(s.includes(label),label);
 assert.match(s,/noopener noreferrer/);
 assert.match(s,/AVATAR STUDIO PREVIEW/);
 assert.match(s,/noindex,nofollow,noarchive/);
 assert.doesNotMatch(s,/\/strategic-minds#/);
});
test('No runtime platform lock-in was added',()=>{
 const s=read('../src/V2Experience.jsx')+read('../src/X1Brand.css');
 assert.doesNotMatch(s,/@base44|InvokeLLM|base44\\.app|from ['"]base44/);
});

import {homography,cssMatrix,portalGeometry} from '../lib/room-projection.mjs';
type Point=[number,number];type Quad=Point[];
const room=document.querySelector<HTMLElement>('[data-room]')!;
const world=room.querySelector<HTMLElement>('[data-world]')!;
const viewport=room.querySelector<HTMLElement>('[data-viewport]')!;
const page=room.querySelector<HTMLElement>('[data-channel-page]')!;
const stage=room.querySelector<HTMLElement>('[data-portal-stage]')!;
const plane=room.querySelector<HTMLElement>('[data-portal-plane]')!;
const map=room.querySelector<HTMLDialogElement>('[data-map-dialog]')!;
const tools=room.querySelector<HTMLElement>('[data-tools]')!;
const motion=room.querySelector<HTMLButtonElement>('button[data-motion]')!;
const light=room.querySelector<HTMLButtonElement>('[data-light]')!;
const links=Array.from(room.querySelectorAll<HTMLAnchorElement>('[data-entry]'));
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches,active='',current:Quad|null=null,source:Quad|null=null,abort:AbortController|null=null,pushed=false;
let scale=1,panX=0,panY=0,initialized=false,returnFocus:HTMLElement|null=null;
try {const saved=localStorage.getItem('echo-room-motion');if(saved!==null)paused=saved==='paused';}catch{}
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
function syncMotion(){document.body.dataset.motion=paused?'paused':'running';motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'开启动效':'暂停动效');room.querySelector('[data-motion-label]')!.textContent=paused?'▷':'Ⅱ';}
syncMotion();motion.addEventListener('click',()=>{paused=!paused;syncMotion();try{localStorage.setItem('echo-room-motion',paused?'paused':'running');}catch{}});
preference.addEventListener('change',e=>{paused=e.matches;syncMotion();});
function moveScene(){panX=clamp(panX,innerWidth-1536*scale,0);panY=clamp(panY,innerHeight-1024*scale,0);world.style.setProperty('--room-scale',String(scale));world.style.setProperty('--room-x',`${panX}px`);world.style.setProperty('--room-y',`${panY}px`);}
function fitScene(){scale=Math.max(innerWidth/1536,innerHeight/1024);if(!initialized){panX=(innerWidth-1536*scale)*.5+(innerWidth<700?1536*scale*.055:0);panY=(innerHeight-1024*scale)*.5+Math.min(14,(1024*scale-innerHeight)*.5);initialized=true;}moveScene();room.classList.toggle('can-pan',1536*scale>innerWidth+20);if(active&&room.dataset.phase==='page'){prepare(active);setProjection(screenQuad(active));}}
fitScene();window.addEventListener('resize',()=>{initialized=false;fitScene();});
light.addEventListener('click',()=>{const night=room.dataset.light!=='night';room.dataset.light=night?'night':'day';light.textContent=night?'☾':'☼';light.setAttribute('aria-pressed',String(night));light.setAttribute('aria-label',night?'切换到白天':'切换到夜晚');});
function geometry(id:string){return portalGeometry[id as keyof typeof portalGeometry];}
function sceneQuad(id:string):Quad {const r=(world.querySelector<HTMLElement>(`[data-source="${id}"]`)||world).getBoundingClientRect();return geometry(id).outer.map(p=>[r.left+p[0]*r.width/1536,r.top+p[1]*r.height/1024] as Point);}
function frontQuad(id:string):Quad {const points=geometry(id).outer;const width=(Math.hypot(points[1][0]-points[0][0],points[1][1]-points[0][1])+Math.hypot(points[2][0]-points[3][0],points[2][1]-points[3][1]))/2;const height=(Math.hypot(points[3][0]-points[0][0],points[3][1]-points[0][1])+Math.hypot(points[2][0]-points[1][0],points[2][1]-points[1][1]))/2;const ratio=width/height;const w=Math.min(innerWidth*.88,innerHeight*.78*ratio),h=w/ratio,x=(innerWidth-w)/2,y=(innerHeight-h)/2;return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];}
function screenQuad(id:string):Quad {const h=homography(geometry(id).inner,[[0,0],[innerWidth,0],[innerWidth,innerHeight],[0,innerHeight]]);return geometry(id).outer.map(([x,y])=>{const z=h[6]*x+h[7]*y+1;return [(h[0]*x+h[1]*y+h[2])/z,(h[3]*x+h[4]*y+h[5])/z] as Point;});}
function setProjection(q:Quad){if(!source)return;current=q;plane.style.transform=cssMatrix(homography(source,q));}
function prepare(id:string){source=geometry(id).outer as Quad;const clone=room.querySelector(`[data-portal-template="${id}"] svg`)!.cloneNode(true) as SVGElement;clone.querySelectorAll('[id]').forEach(e=>{const old=e.id;e.id=old+'-active';clone.querySelectorAll('[clip-path]').forEach(c=>{if(c.getAttribute('clip-path')===`url(#${old})`)c.setAttribute('clip-path',`url(#${old}-active)`);});});plane.replaceChildren(clone);stage.dataset.kind=id;room.querySelectorAll<HTMLElement>('[data-source]').forEach(s=>s.classList.toggle('object-away',s.dataset.source===id));}
function tween(from:Quad,to:Quad,duration:number,signal:AbortSignal,phase:string):Promise<boolean>{room.dataset.phase=phase;stage.dataset.phase=phase;return new Promise(resolve=>{if(paused){setProjection(to);resolve(true);return;}let frame=0;const started=performance.now();const stop=()=>{cancelAnimationFrame(frame);resolve(false);};signal.addEventListener('abort',stop,{once:true});function tick(now:number){if(signal.aborted)return;const t=Math.min(1,(now-started)/duration),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;setProjection(from.map((p,i)=>[p[0]+(to[i][0]-p[0])*ease,p[1]+(to[i][1]-p[1])*ease]));stage.style.setProperty('--progress',String(t));if(t<1)frame=requestAnimationFrame(tick);else {signal.removeEventListener('abort',stop);resolve(true);}}frame=requestAnimationFrame(tick);});}
function showPage(id:string){room.querySelectorAll<HTMLElement>('[data-channel]').forEach(s=>s.hidden=s.dataset.channel!==id);page.dataset.kind=id;page.setAttribute('aria-label',links.find(l=>l.dataset.entry===id)?.getAttribute('aria-label')||'房间里的内容');page.hidden=false;page.scrollTop=0;room.dataset.phase='page';stage.dataset.phase='page';page.classList.add('page-visible');page.querySelector<HTMLElement>(`[data-channel="${id}"] h2`)?.focus({preventScroll:true});document.title=(page.querySelector(`[data-channel="${id}"] h2`)?.textContent||'ECHO')+' · ECHO';}
async function enter(id:string,animate=true){const link=links.find(l=>l.dataset.entry===id);if(!link)return;abort?.abort();abort=new AbortController();const signal=abort.signal;if(map.open)map.close();returnFocus=link;active=id;room.dataset.selected=id;tools.hidden=true;viewport.inert=true;page.hidden=true;page.classList.remove('page-visible');prepare(id);stage.hidden=false;stage.classList.remove('stage-returning');const original=sceneQuad(id);setProjection(original);
 if(animate&&!paused){if(!await tween(original,frontQuad(id),id==='video'?1050:950,signal,'approach'))return;const front=frontQuad(id);if(!await tween(front,front,350,signal,'front'))return;if(!await tween(front,screenQuad(id),720,signal,'enter'))return;}else {setProjection(screenQuad(id));}
 if(signal.aborted)return;if(link.dataset.target){location.assign(link.dataset.target);return;}showPage(id);
}
async function leave(){if(!active)return;abort?.abort();abort=new AbortController();const signal=abort.signal;const id=active;page.classList.remove('page-visible');page.hidden=true;prepare(id);stage.hidden=false;stage.classList.add('stage-returning');const original=sceneQuad(id);const start=current||screenQuad(id);
 if(!paused){if(!await tween(start,frontQuad(id),650,signal,'return-front'))return;if(!await tween(frontQuad(id),original,900,signal,'return-room'))return;}else setProjection(original);
 if(signal.aborted)return;stage.hidden=true;tools.hidden=false;viewport.inert=false;world.querySelectorAll('.object-away').forEach(e=>e.classList.remove('object-away'));active='';delete room.dataset.selected;room.dataset.phase='room';delete room.dataset.hover;document.title='ECHO · 创作房间';returnFocus?.focus({preventScroll:true});
}
function open(id:string){if(active===id&&room.dataset.phase==='page')return;history.pushState({echoRoom:id},'',`/room/${id}/`);pushed=true;enter(id);}
function close(){if(!active)return;if(pushed||history.state?.echoRoom){pushed=false;history.back();}else{history.replaceState(null,'','/');leave();}}
links.forEach(link=>{link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();open(link.dataset.entry!);});link.addEventListener('pointerenter',()=>{room.dataset.hover=link.dataset.entry;});link.addEventListener('pointerleave',()=>{delete room.dataset.hover;});link.addEventListener('focus',()=>{room.dataset.hover=link.dataset.entry;});link.addEventListener('blur',()=>{delete room.dataset.hover;});});
room.querySelector('[data-channel-close]')!.addEventListener('click',close);
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){e.preventDefault();close();}});
function route(){const match=location.pathname.match(/^\/room\/([^/]+)\//),id=match?.[1];if(id&&links.some(l=>l.dataset.entry===id)){if(id!==active||room.dataset.phase!=='page')enter(id);}else if(active)leave();}
window.addEventListener('popstate',route);
room.querySelector('[data-map]')!.addEventListener('click',()=>map.showModal());room.querySelector('[data-map-close]')!.addEventListener('click',()=>map.close());map.addEventListener('click',e=>{if(e.target===map)map.close();});
room.querySelectorAll<HTMLAnchorElement>('[data-map-entry]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();open(a.dataset.mapEntry!);}));
room.querySelectorAll<HTMLButtonElement>('[data-pan]').forEach(b=>b.addEventListener('click',()=>{panX+=(b.dataset.pan==='left'?1:-1)*innerWidth*.6;moveScene();}));
let drag:{x:number;y:number;panX:number;panY:number;id:number}|null=null,dragged=false;
viewport.addEventListener('pointerdown',e=>{if(active||e.button!==0)return;drag={x:e.clientX,y:e.clientY,panX,panY,id:e.pointerId};dragged=false;});
viewport.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>7){dragged=true;viewport.setPointerCapture(e.pointerId);room.classList.add('is-dragging');panX=drag.panX+dx;panY=drag.panY+dy;moveScene();}});
function release(){drag=null;room.classList.remove('is-dragging');}viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
viewport.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopPropagation();dragged=false;}},true);
const planeButton=room.querySelector<HTMLButtonElement>('[data-plane]')!;let flightTimer:ReturnType<typeof setTimeout>;
planeButton.addEventListener('click',()=>{if(paused)return;clearTimeout(flightTimer);planeButton.classList.remove('is-flying');requestAnimationFrame(()=>requestAnimationFrame(()=>{planeButton.classList.add('is-flying');flightTimer=setTimeout(()=>planeButton.classList.remove('is-flying'),3200);}));});
let catTimer:ReturnType<typeof setTimeout>;room.querySelector('[data-cat]')!.addEventListener('click',()=>{clearTimeout(catTimer);room.classList.remove('cat-awake');requestAnimationFrame(()=>{room.classList.add('cat-awake');catTimer=setTimeout(()=>room.classList.remove('cat-awake'),2600);});});
const initial=location.pathname.match(/^\/room\/([^/]+)\//)?.[1]||location.hash.slice(1);if(links.some(l=>l.dataset.entry===initial)){history.replaceState(null,'',`/room/${initial}/`);enter(initial,false);}

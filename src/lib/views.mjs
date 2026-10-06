export const AUTHOR_KEY='echo-author-mode';
export const COUNTER_ENDPOINT='https://busuanzi.9420.ltd/api';
const WINDOW=30*60*1000;
export function startReader({path,hostname,storage,request,visible=()=>true,schedule=setTimeout,cancel=clearTimeout,now=Date.now,onValue=()=>{},onState=()=>{}}){
 let stopped=false,timer,elapsed=0;const key=`echo-read:${path}`;
 const author=()=>{try{return !storage||storage.getItem(AUTHOR_KEY)==='on';}catch{return true;}};
 const recent=()=>{try{const stamp=Number(storage?.getItem(key));return stamp>0&&now()-stamp<WINDOW;}catch{return true;}};
 const production=hostname==='z-q-chen.github.io';
 async function read(increment){
  try{const result=await request(increment?'POST':'GET',`https://z-q-chen.github.io${path}`);const count=result?.data?.page_pv;if(result?.success!==true||!Number.isSafeInteger(count)||count<0)throw new Error('Invalid count');if(!stopped){onValue(count);onState(author()?'author':'ready');}return true;}
  catch{if(!stopped)onState('unavailable');return false;}
 }
 async function tick(){if(stopped)return;if(author()){onState('author');return;}if(recent())return;if(visible())elapsed++;if(elapsed>=8){let previous=null;try{previous=storage.getItem(key);storage.setItem(key,String(now()));}catch{onState('unavailable');return;}const success=await read(true);if(!success){try{if(previous)storage.setItem(key,previous);else storage.removeItem(key);}catch{}}return;}timer=schedule(tick,1000);}
 if(production){read(false);if(!author()&&!recent())timer=schedule(tick,1000);}else onState('preview');
 return ()=>{stopped=true;if(timer)cancel(timer);};
}

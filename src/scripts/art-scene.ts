// Native generative sculpture: no media files, libraries or network requests.
export function mountArt(scene:HTMLElement){
  const canvas=scene.querySelector('canvas')!;
  const ctx=canvas.getContext('2d',{alpha:true});
  const button=scene.querySelector<HTMLButtonElement>('button')!;
  if(!ctx)return;
  button.hidden=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches,visible=true,raf=0,last=0,time=0,frames=0,w=0,h=0;
  let aimX=0,aimY=0,mouseX=0,mouseY=0;
  const pulses:{age:number;x:number;y:number}[]=[];
  const stars=Array.from({length:64},(_,i)=>({x:((i*0.61803398875)%1),y:((i*0.41421356237)%1),size:i%9===0?1.4:0.6}));
  function syncButton(){
    button.setAttribute('aria-label',paused?'播放动画':'暂停动画');
    button.setAttribute('aria-pressed',String(paused));
    button.querySelector('.motion-icon')!.textContent=paused?'▷':'Ⅱ';
    button.querySelector('.motion-label')!.textContent=paused?'STILL':'LIVE';
    scene.dataset.motion=paused?'paused':'running';
  }
  function resize(){
    const rect=scene.getBoundingClientRect();w=rect.width;h=rect.height;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx!.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function draw(){
    if(!w||!h)return;
    ctx!.clearRect(0,0,w,h);
    const small=w<650;
    const cx=w*(small?.53:.61),cy=h*(small?.43:.46);
    const scale=Math.min(w*(small?.32:.27),h*.34);
    const yaw=time*.095+mouseX*.45,tilt=.78+Math.sin(time*.13)*.18+mouseY*.3;
    const sy=Math.sin(yaw),co=Math.cos(yaw),st=Math.sin(tilt),ct=Math.cos(tilt);
    const spin=time*.065;
    const project=(x:number,y:number,z:number)=>{
      const x1=x*co-z*sy,z1=x*sy+z*co;
      const y1=y*ct-z1*st,z2=y*st+z1*ct;
      const c=Math.cos(spin),s=Math.sin(spin),perspective=4.5/(4.5-z2);
      return{x:cx+(x1*c-y1*s)*scale*perspective,y:cy+(x1*s+y1*c)*scale*perspective,z:z2};
    };
    // Sparse, deterministic star field keeps the canvas quiet around the sculpture.
    stars.forEach((star,i)=>{
      const x=star.x*w+Math.sin(time*.1+i)*5,y=star.y*h+Math.cos(time*.12+i)*6;
      ctx!.fillStyle=`rgba(162,193,225,${.15+.18*(1+Math.sin(time*.7+i))*.5})`;
      ctx!.fillRect(x,y,star.size,star.size);
    });
    const halo=ctx!.createRadialGradient(cx,cy,scale*.2,cx,cy,scale*2.2);
    halo.addColorStop(0,'rgba(21,60,130,.12)');halo.addColorStop(.55,'rgba(35,53,109,.055)');halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx!.fillStyle=halo;ctx!.fillRect(0,0,w,h);
    const count=small?64:88,steps=small?144:192;
    const lines=[];
    for(let i=0;i<count;i++){
      const v=i/count*Math.PI*2;const pts=[];let depth=0;
      for(let j=0;j<=steps;j++){
        const u=j/steps*Math.PI*2;
        const twist=v+u*3+Math.sin(u*2+time*.27)*.45+time*.15;
        const radius=.42+.065*Math.sin(u*3+time*.4);
        const ring=1.12+.14*Math.cos(u*3-time*.24);
        const radial=ring+radius*Math.cos(twist);
        const p=project(radial*Math.cos(u),radial*Math.sin(u),radius*Math.sin(twist)+.12*Math.sin(u*2+time*.3));
        pts.push(p);depth+=p.z;
      }
      lines.push({pts,depth:depth/pts.length,i});
    }
    lines.sort((a,b)=>a.depth-b.depth);
    const gradient=ctx!.createLinearGradient(cx-scale*1.6,cy-scale,cx+scale*1.4,cy+scale);
    gradient.addColorStop(0,'#ff7149');gradient.addColorStop(.3,'#ff9a80');gradient.addColorStop(.48,'#fdc5b0');gradient.addColorStop(.58,'#b8dce7');gradient.addColorStop(.76,'#37a9ed');gradient.addColorStop(1,'#3064ff');
    ctx!.globalCompositeOperation='screen';
    lines.forEach(({pts,depth,i})=>{
      ctx!.beginPath();pts.forEach((p,j)=>j?ctx!.lineTo(p.x,p.y):ctx!.moveTo(p.x,p.y));
      ctx!.strokeStyle=gradient;
      ctx!.globalAlpha=.24+(depth+.7)*.23;
      ctx!.lineWidth=i%7===0?1.4:.7;
      ctx!.stroke();
    });
    // Satellites trace the same three-dimensional field.
    for(let i=0;i<7;i++){
      const a=time*.18+i*Math.PI*2/7;const p=project(1.95*Math.cos(a),1.95*Math.sin(a),.16*Math.sin(a*3));
      ctx!.globalAlpha=.4;ctx!.fillStyle=i%2?'#ff8a65':'#86d9ff';
      ctx!.beginPath();ctx!.arc(p.x,p.y,i%3===0?2:1,0,Math.PI*2);ctx!.fill();
    }
    pulses.forEach(p=>{
      ctx!.globalAlpha=Math.max(0,1-p.age/2)*.5;
      ctx!.strokeStyle='#9bd8ff';ctx!.lineWidth=.8;
      ctx!.beginPath();ctx!.arc(p.x,p.y,p.age*160+10,0,Math.PI*2);ctx!.stroke();
    });
    ctx!.globalAlpha=1;ctx!.globalCompositeOperation='source-over';
    scene.dataset.frame=String(++frames);
  }
  function schedule(){if(!raf&&visible&&!paused&&!document.hidden)raf=requestAnimationFrame(tick);}
  function tick(now:number){
    raf=0;
    const dt=last?Math.min((now-last)/1000,.04):0;last=now;
    time+=dt;mouseX+=(aimX-mouseX)*.045;mouseY+=(aimY-mouseY)*.045;
    pulses.forEach(p=>p.age+=dt);while(pulses[0]?.age>2)pulses.shift();
    draw();schedule();
  }
  function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
  syncButton();
  button.addEventListener('click',()=>{paused=!paused;syncButton();if(paused)stop();else schedule();});
  scene.parentElement!.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect();aimX=(e.clientX-r.left)/r.width-.5;aimY=(e.clientY-r.top)/r.height-.5;});
  scene.parentElement!.addEventListener('pointerleave',()=>{aimX=0;aimY=0;});
  scene.parentElement!.addEventListener('pointerdown',e=>{
    if((e.target as HTMLElement).closest('a,button')||paused)return;
    const r=scene.getBoundingClientRect();pulses.push({age:0,x:e.clientX-r.left,y:e.clientY-r.top});
    if(pulses.length>5)pulses.shift();
  });
  reduced.addEventListener('change',e=>{paused=e.matches;syncButton();if(paused)stop();else schedule();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else schedule();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else stop();});observer.observe(scene);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(scene);
  window.addEventListener('pagehide',()=>{stop();observer.disconnect();resizeObserver.disconnect();},{once:true});
  resize();schedule();
}

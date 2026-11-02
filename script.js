// -------------------------- INDEX.HTML --------------------------

gsap.registerPlugin(ScrollTrigger);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,desk=matchMedia('(min-width:1000px) and (min-height:700px)').matches;

/* ===== gato vetorial animado (canvas 2x, sem pixelar) ===== */
function makeCat(cv,ink){const g=cv.getContext('2d'),W=120,H=80;cv.width=W*2;cv.height=H*2;cv.style.imageRendering='auto';
 const S={mode:'idle',ph:0,hop:0,last:performance.now()},B='#c98a4b',D='#915626',C='#f3e9d6';
 const thick=(f,w,col)=>{g.beginPath();f();g.lineWidth=w+4;g.strokeStyle=ink;g.stroke();g.lineWidth=w;g.strokeStyle=col;g.stroke()};
 const outl=col=>{g.fillStyle=col;g.fill();g.lineWidth=3;g.strokeStyle=ink;g.stroke()};
 function draw(now){const dt=Math.min(.05,(now-S.last)/1000);S.last=now;const t=now/1000,walk=S.mode==='walk',sleep=S.mode==='sleep';
  if(walk)S.ph+=dt*11;
  g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,W,H);g.lineJoin=g.lineCap='round';
  const hop=S.hop>0?-Math.sin((1-S.hop)*Math.PI)*16:0;if(S.hop>0)S.hop=Math.max(0,S.hop-dt*1.6);
  g.translate(0,(walk?Math.sin(S.ph*2)*1.3:Math.sin(t*2)*.5)+hop+(sleep?12:0));
  const sw=Math.sin(t*(walk?8:2.2))*(walk?6:9)*(sleep?.25:1);
  thick(()=>{g.moveTo(88,42);g.bezierCurveTo(102,46,108,30,102+sw*.5,16+Math.abs(sw)*.25)},5,B);
  const a=walk?Math.sin(S.ph)*.7:0;
  const leg=(x,r)=>{if(sleep)return;g.save();g.translate(x,50);g.rotate(r);thick(()=>{g.moveTo(0,0);g.lineTo(0,17)},5,D);g.restore()};
  leg(82,-a);leg(72,a);
  const ry=sleep?11:16+Math.sin(t*2)*.5;
  g.beginPath();g.ellipse(62,sleep?46:42,28,ry,0,0,7);outl(B);
  [56,65,74].forEach(x=>thick(()=>{g.moveTo(x,(sleep?46:42)-ry+3);g.lineTo(x+2,(sleep?46:42)-ry+9)},3,D));
  leg(52,a);leg(44,-a);
  const hx=30,hy=sleep?46:34,tw=(t%5)<.25?.25:0;
  [[-1,0],[1,tw]].forEach(([s,tr])=>{g.save();g.translate(hx+s*8,hy-10);g.rotate(tr*s);g.beginPath();g.moveTo(-s*8,5);g.lineTo(s*1,-14);g.lineTo(s*10,6);g.closePath();outl(B);g.restore()});
  g.beginPath();g.arc(hx,hy,15,0,7);outl(B);
  const blink=sleep||(t%3.6)<.13;
  [-6.5,6.5].forEach(x=>{if(blink){thick(()=>{g.moveTo(hx+x-3,hy-2);g.quadraticCurveTo(hx+x,hy+1,hx+x+3,hy-2)},1.5,ink)}else{g.fillStyle=ink;g.beginPath();g.ellipse(hx+x,hy-2,2.6,3.2,0,0,7);g.fill();g.fillStyle=C;g.beginPath();g.arc(hx+x+.8,hy-3,.9,0,7);g.fill()}});
  g.fillStyle='#e58a8a';g.beginPath();g.moveTo(hx-2,hy+3);g.lineTo(hx+2,hy+3);g.lineTo(hx,hy+5.5);g.fill();
  g.lineWidth=1.4;g.strokeStyle=ink;g.beginPath();g.moveTo(hx,hy+5.5);g.quadraticCurveTo(hx-2,hy+8,hx-4,hy+6.5);g.moveTo(hx,hy+5.5);g.quadraticCurveTo(hx+2,hy+8,hx+4,hy+6.5);
  [-1,1].forEach(s=>[3,6].forEach((y,i)=>{g.moveTo(hx+s*9,hy+y);g.lineTo(hx+s*21,hy+y+(i?4:-3))}));g.stroke()}
 return{S,draw}}

/* ===== cursor leve ===== */
const cur=$('#cur');let cp=null;
addEventListener('pointermove',e=>{if(cp)return;cp=requestAnimationFrame(()=>{cur.style.transform=`translate3d(${e.clientX-8}px,${e.clientY-8}px,0)`;cp=null});},{passive:true});
document.addEventListener('pointerover',e=>cur.classList.toggle('big',!!e.target.closest('a,button,.card,.gp')),{passive:true});

/* ===== loader ===== */
const cols=$('#cols');for(let i=0;i<10;i++)cols.append(document.createElement('div'));
const lcat=makeCat($('#lcat'),'#f3e9d6');lcat.S.mode='walk';let lraf=requestAnimationFrame(function L(n){lcat.draw(n);lraf=requestAnimationFrame(L)});const lt=setInterval(()=>{$('#dots').textContent='.'.repeat(1+(Date.now()/300|0)%3)},300);
const prog={v:0};
const lg=gsap.to(prog,{v:100,duration:reduce?.1:2.4,ease:'steps(24)',onUpdate(){const p=Math.round(prog.v);$('#lb').style.width=p+'%';$('#lp').textContent=p+'%'}});
const loaded=new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r));
Promise.race([Promise.all([loaded,lg.then()]),new Promise(r=>setTimeout(r,7000))]).then(exitLoader);
function exitLoader(){clearInterval(lt);cancelAnimationFrame(lraf);
  gsap.timeline({onComplete(){$('#ld').remove();ScrollTrigger.refresh()}})
   .to('#ld .in',{opacity:0,y:-30,duration:.3})
   .to('#cols div',{scaleY:0,duration:.5,ease:'steps(5)',stagger:{each:.05,from:'random'}},'-=.1');
  startHero();}

/* ===== tipografia cinética ===== */
const kin=$('#kin');
(function split(node){[...node.childNodes].forEach(n=>{if(n.nodeType===3){const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(w=>{if(!w.trim()){f.append(w);return}const s=document.createElement('span');s.style.cssText='display:inline-block;white-space:nowrap';[...w].forEach(c=>{const i=document.createElement('span');i.className='ch';i.textContent=c;s.append(i)});f.append(s)});n.replaceWith(f)}else if(n.nodeType===1)split(n)})})(kin);
gsap.set('.hero',{opacity:0});
function startHero(){
  gsap.to('.hero',{opacity:1,duration:.8,ease:'power1.out'});
  if(reduce)return;
  gsap.from('.ch',{yPercent:()=>gsap.utils.random(-140,140),rotation:()=>gsap.utils.random(-50,50),opacity:0,duration:.9,ease:'back.out(2)',stagger:{each:.02,from:'random'},delay:.5});
  kin.addEventListener('pointerover',e=>{const c=e.target.closest('.ch');if(c&&!c._b){c._b=1;gsap.fromTo(c,{y:0},{y:-18,rotation:gsap.utils.random(-12,12),duration:.18,yoyo:true,repeat:1,onComplete:()=>c._b=0})}},{passive:true});
}

/* ===== ticker ===== */
const items=['FRONT-END','EDIÇÃO DE VÍDEO','LANDING PAGES','SQL + JSON','DESIGN','ACESSÍVEL'];
const star='<svg class="i"><use href="#star"/></svg>';
$('#tk').innerHTML=Array(4).fill(items).flat().map(t=>`<span>${t}</span>${star}`).join('');
if(!reduce){const tw=gsap.to('#tk',{xPercent:-50,duration:30,ease:'none',repeat:-1});
 ScrollTrigger.create({onUpdate:s=>{const v=s.getVelocity();tw.timeScale(1+Math.abs(v)/400);gsap.to('.ticker',{skewX:gsap.utils.clamp(-8,8,v/-300),duration:.3,overwrite:true})}});
 setInterval(()=>tw.timeScale()>1&&tw.timeScale(1+(tw.timeScale()-1)*.6),120)}

/* ===== transição de cores por seção ===== */
$$('[data-bg]').forEach(s=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',
  onToggle:self=>{if(self.isActive)gsap.to(document.documentElement,{'--bg':s.dataset.bg,'--fg':s.dataset.fg,duration:.6,overwrite:'auto'})}}));

/* ===== scroll horizontal + reveals ===== */
if(desk&&!reduce){
  const ht=$('#ht'),dist=()=>ht.scrollWidth-innerWidth;
  gsap.to(ht,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#esp',pin:true,scrub:.6,start:'top top',end:()=>'+='+dist(),invalidateOnRefresh:true,refreshPriority:2}});
  /* sobre fixado: objetos aparecem a cada scroll */
  const tl=gsap.timeline({scrollTrigger:{trigger:'#sobre',pin:true,scrub:.6,start:'top top',end:'+=2200',refreshPriority:1}});
  const sob=$('#sob');sob.innerHTML=[...sob.textContent].map(c=>`<span style="display:inline-block">${c===' '?'&nbsp;':c}</span>`).join('');
  tl.from(sob.children,{yPercent:130,rotation:()=>gsap.utils.random(-25,25),opacity:0,stagger:.05,ease:'steps(6)'})
    .from('.imgs a:nth-child(1)',{x:-600,rotation:-30,opacity:0})
    .from('.imgs a:nth-child(2)',{y:500,rotation:15,opacity:0})
    .from('.imgs a:nth-child(3)',{x:600,rotation:30,opacity:0})
    .from('.tags span',{scale:0,rotation:()=>gsap.utils.random(-20,20),stagger:.2,ease:'back.out(3)'})
    .from('#sobre .mono,#open',{y:40,opacity:0,stagger:.2})
    .from('#sobre .o3',{scale:0,rotation:180,duration:1.2},0)
    .from('.me',{xPercent:120,opacity:0,duration:1},0.5);
  $$('.rv').forEach(h=>gsap.from(h,{x:-100,opacity:0,duration:.7,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 85%'}}));
  $$('.pane').forEach((p,i)=>gsap.from(p,{yPercent:40,opacity:0,delay:i*.1,scrollTrigger:{trigger:'.panes',start:'top 85%'}}));
}

/* ===== vídeos: só tocam quando visíveis ===== */
const fill=(id,l)=>$('#'+id).innerHTML=[...l,...l].map(v=>`<video src="assets/videos/${v.s}.mp4" poster="assets/posters/${v.s}.webp" title="${v.t}" muted loop playsinline preload="none" onerror="fbv(this)"></video>`).join('');
fill('tr1',SITE.r1);fill('tr2',SITE.r2);
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.2});
$$('.track video').forEach(v=>io.observe(v));
if(!reduce){const a=gsap.to('#tr1',{xPercent:-50,duration:40,ease:'none',repeat:-1}),b=gsap.fromTo('#tr2',{xPercent:-50},{xPercent:0,duration:40,ease:'none',repeat:-1});
 $$('.rail').forEach((r,i)=>{const t=i?b:a;r.onpointerenter=()=>t.timeScale(.15);r.onpointerleave=()=>t.timeScale(1)})}

/* ===== projetos do GitHub (edite aqui) ===== */
const PROJ=SITE.proj;
$('#gpl').innerHTML=PROJ.map(p=>`<article class="gp"><div class="m"><img src="${p.img}" alt="" loading="lazy" onerror="this.remove()"><video src="${p.vid}" muted loop playsinline preload="none" onerror="this.remove()"></video><span class="hint px">HOVER ▶</span></div><div class="b"><h3>${p.n}</h3><p>${p.d}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="case.html?id=${p.id}">Estudo de caso <svg class="i"><use href="#arrow"/></svg></a><a class="btn dark" href="${p.url}" target="_blank" rel="noopener" style="border-color:var(--paper)"><svg class="i"><use href="#git"/></svg> GitHub</a></div></div></article>`).join('');
$$('.gp').forEach(c=>{const v=c.querySelector('video');
 c.onpointerenter=()=>v.play().catch(()=>{});c.onpointerleave=()=>{v.pause();v.currentTime=0};
 c.addEventListener('click',e=>{if(matchMedia('(pointer:coarse)').matches&&!e.target.closest('a')){c.classList.toggle('on');c.classList.contains('on')?v.play().catch(()=>{}):v.pause()}})});
/* pacotes */
$('#pk').innerHTML=SITE.pack.map(k=>`<div class="pc${k.top?' top':''}"><span class="tg px">MAIS PEDIDO</span><h3>${k.n}</h3><ul>${k.itens.map(i=>`<li><svg class="i"><use href="#star"/></svg>${i}</li>`).join('')}</ul><div class="pz px">PRAZO: ${k.prazo.toUpperCase()}</div><div class="pr">${k.preco}</div><a class="btn${k.top?' dark':''}" href="#" data-wa="${k.n}">Quero esse <svg class="i"><use href="#arrow"/></svg></a></div>`).join('');
if(!reduce){gsap.from('.pc',{y:80,rotation:3,opacity:0,stagger:.15,ease:'steps(6)',scrollTrigger:{trigger:'#pk',start:'top 85%'}})}
if(!reduce)gsap.from('.gp',{y:80,rotation:3,opacity:0,stagger:.15,ease:'steps(6)',scrollTrigger:{trigger:'#gpl',start:'top 85%'}});

/* ===== canvas pixel do hero ===== */
const cv=$('#cv'),g=cv.getContext('2d'),im=g.createImageData(96,96);
const pal=['#0d0a07','#3b2210','#915626','#c98a4b','#f3e9d6'].map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
let t=0,mx=48,my=48,vis=true,fr=0;
cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*96;my=(e.clientY-r.top)/r.height*96},{passive:true});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
function frame(){t+=.06;const d=im.data;
 for(let y=0;y<96;y++)for(let x=0;x<96;x++){const dd=Math.hypot(x-mx,y-my);let v=(Math.sin(x*.12+t)+Math.sin(y*.14-t*1.3)+Math.sin(dd*.18-t*2.2)+3)/6+((x&1)^(y&1))*.05;
  const c=pal[Math.min(4,v*5|0)],i=(y*96+x)*4;d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255}
 g.putImageData(im,0,0)}
frame();(function loop(){requestAnimationFrame(loop);if(!vis||(++fr&1))return;try{frame()}catch(e){}})();

/* ===== objetos 3D pixelados (three.js) ===== */
function px3(cv){if(!window.THREE)return;const k=cv.dataset.k;
 const r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false});r.setPixelRatio(1);r.setSize(128,128,false);
 const s=new THREE.Scene(),c=new THREE.PerspectiveCamera(40,1,.1,50);c.position.z=7;
 s.add(new THREE.AmbientLight(0xffffff,.65));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(3,4,5);s.add(dl);
 const grp=new THREE.Group();s.add(grp);
 const add=(geo,col,x,y,sc)=>{const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:col,flatShading:true}));m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x0d0a07})));m.position.set(x,y,0);m.scale.setScalar(sc);grp.add(m);return m};
 const B=new THREE.BoxGeometry(2,2,2),O=new THREE.OctahedronGeometry(1.6),T=new THREE.TetrahedronGeometry(1.5);
 let sp=[];
 if(k==='cube'){add(B,0xf3e9d6,0,0,1);sp.push(add(T,0x0d0a07,2.2,1.4,.5))}
 else if(k==='oct'){add(O,0x915626,0,0,1.1)}
 else{add(B,0x0d0a07,-1.7,.9,.7);add(O,0xf3e9d6,1.4,.5,.8);add(T,0xc98a4b,0,-1.6,.8)}
 let on=true;new IntersectionObserver(e=>on=e[0].isIntersecting).observe(cv);
 let last=0;(function a(n){requestAnimationFrame(a);if(!on||n-last<33)return;last=n;grp.rotation.y+=.03;grp.rotation.x+=.012;grp.children.forEach((m,i)=>m.rotation.z+=.01*(i+1));r.render(s,c)})(0)}
$$('canvas[data-k]').forEach(px3);

/* ===== gato que anda com o scroll ===== */
const catw=$('#catw'),cc=$('#cat'),bub=$('#bub'),zz=$('#zz');let lastY=scrollY,tm,lastAct=performance.now(),mvT=0;
let running=false;const cat=makeCat(cc,'#0d0a07');
(function C(n){requestAnimationFrame(C);cat.S.mode=running||n-mvT<200?'walk':(n-lastAct>7000?'sleep':'idle');zz.style.display=cat.S.mode==='sleep'?'block':'none';cat.draw(n)})(performance.now());
const mvq=gsap.quickTo(catw,'x',{duration:.5,ease:'none'});
addEventListener('pointermove',()=>lastAct=performance.now(),{passive:true});
addEventListener('scroll',()=>{const n=performance.now(),max=document.documentElement.scrollHeight-innerHeight,p=max>0?scrollY/max:0;
  const dir=scrollY>=lastY?1:-1;lastY=scrollY;mvT=lastAct=n;cc.style.transform=`scaleX(${dir>0?-1:1})`;mvq(p*(innerWidth-130)+4)},{passive:true});
const say=txt=>{cat.S.hop=1;window.sfx&&sfx.meow();lastAct=performance.now();clearInterval(tm);bub.classList.add('on');let i=0;bub.textContent='';tm=setInterval(()=>{bub.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(tm);setTimeout(()=>bub.classList.remove('on'),4500)}},28)};
const lines0=null;const lines={'.hero':'Oi! Sou o gato do s1za. Role a página!','#esp':'Front-end, vídeo, banco de dados... ele faz de tudo!','#proj':'Essas edições têm ritmo até pra gato.','#gps':'Projetos de verdade. Passe o mouse!','#sobre':'Quer saber mais? Clique em continuar!'};
Object.entries(lines).forEach(([s,t])=>ScrollTrigger.create({trigger:s,start:'top 60%',end:'bottom 40%',onEnter:()=>say(t),onEnterBack:()=>say(t)}));
cc.parentElement.style.pointerEvents='auto';cc.onclick=()=>bub.classList.toggle('on');
catw.style.left='4px';

/* ===== som 8-bit ===== */
var AC=null,SND=false;try{SND=localStorage.getItem('snd')==='1'}catch(e){}
function tone(f,d,type='square',v=.04,sl=0){if(!SND)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.linearRampToValueAtTime(f+sl,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
var sfx={click:()=>{tone(660,.05);setTimeout(()=>tone(990,.06),45)},meow:()=>{tone(520,.12,'square',.04,300);setTimeout(()=>tone(820,.22,'square',.04,-380),110)},on:()=>{tone(523,.08);setTimeout(()=>tone(784,.12),80)}};
const snd=$('#snd');const paint=()=>{snd.classList.toggle('on',SND);snd.setAttribute('aria-pressed',SND);snd.textContent='SOM: '+(SND?'ON':'OFF')};paint();
snd.onclick=e=>{e.stopPropagation();SND=!SND;try{localStorage.setItem('snd',SND?'1':'0')}catch(x){}paint();if(SND)sfx.on()};
document.addEventListener('click',e=>{if(e.target.closest('a,button')&&!e.target.closest('#snd'))sfx.click()});

/* ===== menu mobile ===== */
const bg=$('#bg'),mn=$('#mn');
const tg=o=>{mn.classList.toggle('on',o);bg.classList.toggle('on',o);bg.setAttribute('aria-expanded',o)};
bg.onclick=()=>tg(!mn.classList.contains('on'));mn.addEventListener('click',e=>{if(e.target.closest('a'))tg(false)});

/* ===== WhatsApp ===== */
$$('[data-wa]').forEach(a=>{const k=a.dataset.wa,m=k?`Olá! Vim pelo seu portfólio e quero saber mais sobre: ${k}.`:'Olá! Vim pelo seu portfólio e gostaria de fazer um orçamento.';a.href=`https://wa.me/${SITE.wa}?text=${encodeURIComponent(m)}`;a.target='_blank';a.rel='noopener'});

/* ===== easter egg: digite "gato" ===== */
let buf='';addEventListener('keydown',e=>{if(e.key.length!==1)return;buf=(buf+e.key.toLowerCase()).slice(-4);if(buf==='gato')run()});
function run(){if(running)return;running=true;sfx.meow();say('MIAU! Você achou o segredo!');const w=innerWidth-130;
 gsap.timeline({onComplete(){running=false}}).set(cc,{scaleX:-1}).to(catw,{x:w,duration:1.4,ease:'none'}).call(()=>{gsap.set(cc,{scaleX:1});cat.S.hop=1;sfx.meow()}).to(catw,{x:4,duration:1.4,ease:'none'}).call(()=>{cat.S.hop=1;sfx.meow()}).to(catw,{x:()=>{const m=document.documentElement.scrollHeight-innerHeight;return (m>0?scrollY/m:0)*(innerWidth-130)+4},duration:.8,ease:'power2.out'})}

/* ===== fundos com plano B + refresh ===== */
$$('.pane[data-d]').forEach(p=>{const n=p.dataset.d;probe(`assets/fotos/design${n}.webp`,`assets/fotos/Design${n}.png`,u=>p.style.backgroundImage=`linear-gradient(#0d0a0099,#0d0a0099),url("${u}")`)});
probe('assets/fotos/fundo.webp','assets/fotos/fundo_D.png',u=>$('#sobre').style.setProperty('--fundo',`url("${u}")`));
addEventListener('load',()=>ScrollTrigger.refresh());if(document.fonts)document.fonts.ready.then(()=>ScrollTrigger.refresh());

/* ===== popups ===== */
const pop=$('#pop'),tut=$('#tut'),tv=$('#tv');
$('#gh').onclick=()=>{pop.classList.add('on');gsap.from('#pop div',{scale:.6,rotation:-6,duration:.4,ease:'back.out(2)'})};
$('#open').onclick=()=>{tut.classList.add('on');tv.play().catch(()=>{})};
const closeT=()=>{tut.classList.remove('on');tv.pause()};$('#tx').onclick=closeT;tut.onclick=e=>{if(e.target===tut)closeT()};
pop.onclick=e=>{if(e.target===pop)pop.classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape'){pop.classList.remove('on');closeT();tg(false)}});

// -------------------------- Gal.HTML --------------------------
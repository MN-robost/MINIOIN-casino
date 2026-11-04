/* 3D Кости (Three.js): ставка на сумму двух кубиков */
(()=>{
let T,r,sc,cam,D=[],SH=[],ok=0,sel='o',busy=0;
const PIP={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const ORD=[2,5,1,6,3,4],EU={1:[0,0],6:[Math.PI,0],2:[0,Math.PI/2],5:[0,-Math.PI/2],3:[-Math.PI/2,0],4:[Math.PI/2,0]};
const face=n=>{const k=document.createElement('canvas');k.width=k.height=128;const x=k.getContext('2d');x.fillStyle='#f6f1ff';x.fillRect(0,0,128,128);
  x.fillStyle=n==1?'#d4163c':'#16081f';PIP[n].forEach(([a,b])=>{x.beginPath();x.arc(64+a*30,64+b*30,12,0,7);x.fill()});const t=new T.CanvasTexture(k);t.colorSpace=T.SRGBColorSpace;return t};
(window.T3||Promise.reject()).then(t=>{T=t;
  r=new T.WebGLRenderer({canvas:$('#dc'),alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(760,280,false);
  sc=new T.Scene();cam=new T.PerspectiveCamera(36,760/280,.1,100);cam.position.set(0,6.5,8.5);cam.lookAt(0,0,0);
  sc.add(new T.AmbientLight(0xffffff,1.2));const dl=new T.DirectionalLight(0xffffff,2.4);dl.position.set(3,8,4);sc.add(dl);const pl=new T.PointLight(0xff2bd6,150,0,2);pl.position.set(-5,3,3);sc.add(pl);
  const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(0,0,0,.7)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);const st=new T.CanvasTexture(c);
  for(let i=0;i<2;i++){const d=new T.Mesh(new T.BoxGeometry(1.4,1.4,1.4),ORD.map(n=>new T.MeshStandardMaterial({map:face(n),roughness:.35})));d.position.set(i?1.3:-1.3,.7,0);d.rotation.set(.4,.6,.2);sc.add(d);D.push(d);
    const s=new T.Mesh(new T.PlaneGeometry(2.6,2.6),new T.MeshBasicMaterial({map:st,transparent:true,depthWrite:false}));s.rotation.x=-Math.PI/2;s.position.set(d.position.x,.01,0);sc.add(s);SH.push(s)}
  ok=1;r.render(sc,cam);new IntersectionObserver(e=>e[0].isIntersecting&&r.render(sc,cam)).observe($('#dice'))}).catch(()=>{});
function roll(vals){return new Promise(res=>{
  const t0=performance.now(),Y=new T.Vector3(0,1,0),sx=-6;
  const F=vals.map(v=>{const[ex,ez]=EU[v];return new T.Quaternion().setFromAxisAngle(Y,Math.random()*6.28).multiply(new T.Quaternion().setFromEuler(new T.Euler(ex,0,ez)))});
  const ax=D.map(()=>new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize()),sp=D.map(()=>7+Math.random()*4),tz=D.map(()=>(Math.random()-.5)*1.2),tx=[-1.5+Math.random()*.6,1.2+Math.random()*.6];
  [260,520,760,1000,1300].forEach(ms=>setTimeout(()=>noise(.05,.12,1500,2),ms));
  (function f(n){const p=Math.min((n-t0)/1800,1),e=1-Math.pow(1-p,3);
    D.forEach((d,i)=>{d.position.set(sx+(tx[i]-sx)*e,.7+Math.abs(Math.sin(p*Math.PI*3.5))*(1-p)*2.4,tz[i]*e);
      d.quaternion.copy(new T.Quaternion().setFromAxisAngle(ax[i],(1-e)*sp[i]*2).multiply(F[i]));
      SH[i].position.set(d.position.x,.01,d.position.z);const s=1/(1+(d.position.y-.7)*.5);SH[i].scale.setScalar(s);SH[i].material.opacity=s});
    r.render(sc,cam);p<1?requestAnimationFrame(f):res()})(t0)})}
$$('[data-d]').forEach(b=>b.onclick=()=>{sel=b.dataset.d;$$('[data-d]').forEach(x=>x.classList.toggle('on',x===b));sfx.click()});
$('#dgo').onclick=async()=>{
  if(busy)return;const st=S.bet;if(!bet(st))return;busy=1;$('#dgo').disabled=true;say('');
  const a=1+Math.random()*6|0,b=1+Math.random()*6|0,sum=a+b;
  if(ok){sfx.spin();await roll([a,b])}else await new Promise(q=>setTimeout(q,600));
  const win=sel=='u'?sum<7:sel=='o'?sum>7:sum==7,got=settle(st,win?Math.floor(st*(sel=='s'?5.5:2.2)):0);
  say(`🎲 ${a} + ${b} = ${sum} — `+(win?`ПОБЕДА +${got-st}! 🎉`:'мимо 😬'));busy=0;$('#dgo').disabled=false};
})();

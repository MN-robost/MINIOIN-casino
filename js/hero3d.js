/* 3D-сцена: золотая корона, фишки, кубики, монеты (Three.js подгружается с CDN) */
(async()=>{
const hero=$('#hero');
try{
const T=await (window.T3=import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'));
const r=new T.WebGLRenderer({canvas:$('#h3d'),alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
const sc=new T.Scene(),cam=new T.PerspectiveCamera(40,2,.1,100);cam.position.set(0,.3,11);
sc.add(new T.AmbientLight(0xffffff,1.1));
const l1=new T.PointLight(0xff2bd6,260,0,2);l1.position.set(-6,3,6);const l2=new T.PointLight(0x19f0ff,260,0,2);l2.position.set(6,-2,6);
const l3=new T.DirectionalLight(0xffffff,2);l3.position.set(2,5,8);sc.add(l1,l2,l3);
// корона
const sh=new T.Shape();[[-1.5,-.8],[1.5,-.8],[1.65,.7],[.75,0],[0,1.1],[-.75,0],[-1.65,.7]].forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();
const gold=new T.MeshPhongMaterial({color:0xffc93c,shininess:130,specular:0xffffff,emissive:0x4a2a00});
const crown=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.5,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:4}),gold);crown.geometry.center();
const cg=new T.Group();cg.add(crown);cg.scale.setScalar(1.25);
[[-1.65,.55,0xff2bd6],[0,.95,0xffffff],[1.65,.55,0x19f0ff]].forEach(([x,y,c])=>{const j=new T.Mesh(new T.SphereGeometry(.2,24,16),new T.MeshPhongMaterial({color:c,emissive:c,emissiveIntensity:.8,shininess:100}));j.position.set(x,y,0);cg.add(j)});
sc.add(cg);
// фишки
const tex=c=>{const k=document.createElement('canvas');k.width=k.height=128;const x=k.getContext('2d');x.fillStyle=c;x.fillRect(0,0,128,128);x.strokeStyle='#fff';x.lineWidth=8;x.setLineDash([14,10]);x.beginPath();x.arc(64,64,52,0,7);x.stroke();x.setLineDash([]);x.lineWidth=4;x.beginPath();x.arc(64,64,34,0,7);x.stroke();x.fillStyle='#fff';x.font='bold 38px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('$',64,66);const t=new T.CanvasTexture(k);t.colorSpace=T.SRGBColorSpace;return t};
const chip=c=>{const m=new T.MeshPhongMaterial({color:new T.Color(c),shininess:60}),tm=new T.MeshPhongMaterial({map:tex(c),shininess:60});return new T.Mesh(new T.CylinderGeometry(1,1,.26,48),[m,tm,tm])};
// кубики
const PIP={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const face=n=>{const k=document.createElement('canvas');k.width=k.height=128;const x=k.getContext('2d');x.fillStyle='#f4f0ff';x.fillRect(0,0,128,128);x.fillStyle=n==1?'#d4163c':'#16081f';PIP[n].forEach(([a,b])=>{x.beginPath();x.arc(64+a*30,64+b*30,12,0,7);x.fill()});const t=new T.CanvasTexture(k);t.colorSpace=T.SRGBColorSpace;return t};
const dice=()=>new T.Mesh(new T.BoxGeometry(1.4,1.4,1.4),[1,2,3,4,5,6].map(n=>new T.MeshStandardMaterial({map:face(n),roughness:.35})));
const coin=()=>new T.Mesh(new T.CylinderGeometry(.6,.6,.12,40),gold);
const items=[];
[['#d4163c',0],['#1d6fe0',1],['#14a85a',2],['#8b5cf6',3]].forEach(([c,i])=>items.push({m:chip(c),s:.35,p:i*1.57,rx:.012,ry:.02}));
[0,1].forEach(i=>items.push({m:dice(),s:.3,p:.8+i*3.14,rx:.015,ry:.011}));
[0,1,2].forEach(i=>items.push({m:coin(),s:.42,p:.4+i*2.1,rx:.03,ry:.02}));
items.forEach(o=>sc.add(o.m));
let R=6,on=true,mx=0,my=0;
new IntersectionObserver(e=>on=e[0].isIntersecting).observe(hero);
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const resize=()=>{const w=hero.clientWidth,h=hero.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.position.z=cam.aspect<2.2?11+(2.2-cam.aspect)*5:11;cam.updateProjectionMatrix();R=Math.min(7.5,cam.aspect*3)};
new ResizeObserver(resize).observe(hero);resize();
const t0=performance.now();
(function f(n){requestAnimationFrame(f);if(!on||document.hidden)return;const t=(n-t0)/1000;
  cg.rotation.y=Math.sin(t*.6)*.7+mx*.8;cg.rotation.x=my*.4;cg.position.y=Math.sin(t*1.2)*.15;
  items.forEach(o=>{const a=t*o.s+o.p;o.m.position.set(Math.cos(a)*R,Math.sin(a*1.7)*.9,Math.sin(a)*2.4-1);o.m.rotation.x+=o.rx;o.m.rotation.y+=o.ry});
  r.render(sc,cam)})(t0);
}catch(e){hero.style.display='none'}
})();

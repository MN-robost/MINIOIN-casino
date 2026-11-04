/* 3D: колёса рулетки и удачи, стопка фишек в покере (Three.js) */
(window.T3||Promise.reject()).then(T=>{
const light=sc=>{sc.add(new T.AmbientLight(0xffffff,1.2));const d=new T.DirectionalLight(0xffffff,2);d.position.set(2,8,4);sc.add(d);const p=new T.PointLight(0xff2bd6,120,0,2);p.position.set(-4,3,2);sc.add(p)};
const gold=new T.MeshPhongMaterial({color:0xffc93c,shininess:120,specular:0xffffff,emissive:0x3a2200});
const mkR=(cv,w,h)=>{const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.setSize(w,h,false);return r};
function wheel3(c2,segs,ball){
  const cv=document.createElement('canvas');cv.width=660;cv.height=520;cv.style.cssText='width:100%;max-width:520px;height:auto;display:block;margin:0 auto';
  c2.parentNode.insertBefore(cv,c2);c2.style.display='none';
  const r=mkR(cv,660,520),sc=new T.Scene(),cam=new T.PerspectiveCamera(38,660/520,.1,100);cam.position.set(0,7,6.2);cam.lookAt(0,0,.3);light(sc);
  const off=document.createElement('canvas');off.width=off.height=512;wheel(off,segs,0,1);
  const tx=new T.CanvasTexture(off);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=8;
  const g=new T.Group();sc.add(g);
  const base=new T.Mesh(new T.CylinderGeometry(3.5,3.65,.5,64),gold);base.position.y=-.1;sc.add(base);
  const disc=new T.Mesh(new T.CircleGeometry(3.15,64),new T.MeshPhongMaterial({map:tx,shininess:40}));disc.rotation.x=-Math.PI/2;disc.position.y=.18;g.add(disc);
  const rim=new T.Mesh(new T.TorusGeometry(3.2,.13,16,80),gold);rim.rotation.x=Math.PI/2;rim.position.y=.2;sc.add(rim);
  const hub=new T.Mesh(new T.ConeGeometry(.45,.7,24),gold);hub.position.y=.5;g.add(hub);
  const pt=new T.Mesh(new T.ConeGeometry(.22,.55,16),new T.MeshPhongMaterial({color:0x19f0ff,emissive:0x19f0ff,emissiveIntensity:.8}));pt.rotation.x=Math.PI/2;pt.position.set(0,.55,-3.55);sc.add(pt);
  let bl=null,last=[0];
  if(ball){bl=new T.Mesh(new T.SphereGeometry(.14,20,16),new T.MeshPhongMaterial({color:0xffffff,shininess:150,emissive:0x333333}));bl.visible=false;sc.add(bl)}
  const draw=(rot,pr)=>{last=[rot,pr];g.rotation.y=-rot;
    if(bl){if(pr===undefined)bl.visible=false;else{bl.visible=true;const th=37.7*Math.pow(1-pr,4),rad=3-.6*Math.max(0,(pr-.7)/.3),y=.4+(pr>.93&&pr<1?Math.abs(Math.sin((pr-.93)*140))*.12:0);bl.position.set(Math.sin(th)*rad,y,-Math.cos(th)*rad)}}
    r.render(sc,cam)};
  c2.r3=draw;draw(0);new IntersectionObserver(e=>e[0].isIntersecting&&draw(last[0],last[1])).observe(cv)}
wheel3($('#rw'),RS,1);wheel3($('#lw'),FS,0);
/* стопка фишек в банке покера */
const COL=['#d4163c','#1d6fe0','#14a85a','#222222','#8b5cf6','#e0a010'];
const tex=c=>{const k=document.createElement('canvas');k.width=k.height=128;const x=k.getContext('2d');x.fillStyle=c;x.fillRect(0,0,128,128);x.strokeStyle='#fff';x.lineWidth=8;x.setLineDash([14,10]);x.beginPath();x.arc(64,64,52,0,7);x.stroke();x.setLineDash([]);x.lineWidth=4;x.beginPath();x.arc(64,64,34,0,7);x.stroke();x.fillStyle='#fff';x.font='bold 38px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('$',64,66);const t=new T.CanvasTexture(k);t.colorSpace=T.SRGBColorSpace;return t};
const cv=$('#ps'),r=mkR(cv,170,130),sc=new T.Scene(),cam=new T.PerspectiveCamera(38,170/130,.1,100);cam.position.set(0,3.4,7.2);cam.lookAt(0,1.7,0);light(sc);
const grp=new T.Group();sc.add(grp);const st=[];
for(let i=0;i<14;i++){const m=new T.MeshPhongMaterial({color:new T.Color(COL[i%6]),shininess:60}),tm=new T.MeshPhongMaterial({map:tex(COL[i%6]),shininess:60}),c=new T.Mesh(new T.CylinderGeometry(.9,.9,.26,40),[m,tm,tm]);
  c.position.set((Math.random()-.5)*.08,.13+i*.27,(Math.random()-.5)*.08);c.rotation.y=Math.random()*6;c.visible=false;grp.add(c);st.push(c)}
window.potStack=(pot,bb)=>{const n=pot>0?Math.min(14,1+Math.floor(pot/(bb*1.5))):0;st.forEach((c,i)=>c.visible=i<n)};
let on=false;new IntersectionObserver(e=>on=e[0].isIntersecting).observe(cv);
(function f(){requestAnimationFrame(f);if(!on)return;grp.rotation.y+=.012;r.render(sc,cam)})();
}).catch(()=>{});

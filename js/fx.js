/* Эффекты: звук, большой выигрыш, счётчик, звёзды */
function noise(d=.08,v=.1,f=1200,q=1,type='bandpass',dl=0){if(!S.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
  const n=AC.sampleRate*d|0,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
  const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();fl.type=type;fl.frequency.value=f;fl.Q.value=q;g.gain.value=v;s.buffer=b;s.connect(fl);fl.connect(g);g.connect(AC.destination);s.start(AC.currentTime+dl)}catch(e){}}
const chime=(n,t0=0,w='sine',v=.12)=>n.forEach((f,i)=>{tone(f,.5,w,t0+i*.09,v);tone(f*2,.35,'sine',t0+i*.09,v/4)});
Object.assign(sfx,{
  click:()=>tone(620,.05,'sine',0,.06),tick:()=>{tone(260,.05,'sine',0,.05);noise(.03,.04,2500)},rt:()=>{noise(.05,.06,800,1.5,'lowpass');tone(140+Math.random()*50,.07,'sine',0,.07)},wt:p=>{const q=880-420*p;tone(q,.25,'sine',0,.08);tone(q*2.01,.12,'sine',0,.02)},fin:r=>r?([0,.1,.2].forEach(d=>noise(.05,.08,900,2,'lowpass',d)),chime([659,880],.3,'sine',.06)):chime([523,659,784,988],0,'sine',.08),
  spin:()=>{noise(.7,.05,500,.7,'lowpass');noise(.9,.03,1400,.5,'bandpass',.15)},stop:c=>{tone(150+c*35,.2,'sine',0,.14);noise(.05,.07,900)},
  card:()=>{noise(.05,.1,3000,.8,'highpass');tone(200,.05,'sine',0,.04)},
  win:()=>chime([523,659,784,1047]),big:()=>{chime([523,659,784,1047,1319]);chime([392,523,659,784],.45,'triangle',.08)},
  lose:()=>[330,262,196].forEach((f,i)=>tone(f,.3,'sine',i*.12,.07))});
const jp_open=()=>!!$('#jp');
function jackpot(p,ref){
  const x=p/ref,t=x>=100?'JACKPOT':x>=50?'MEGA WIN':'BIG WIN',o=document.createElement('div');o.id='jp';
  o.innerHTML=`<div><h1>${t}</h1><b id="jn"></b><small>нажми, чтобы закрыть</small></div>`;document.body.appendChild(o);
  if(window.T3)window.T3.then(T=>rain(T,o)).catch(()=>{});sfx.big();setTimeout(sfx.big,700);coins(70);setTimeout(()=>coins(50),1000);setTimeout(()=>coins(50),2200);
  const t0=performance.now();
  (function f(n){const k=Math.min((n-t0)/2800,1),e=$('#jn');if(!e)return;e.innerHTML=ic('🪙 '+Math.floor(p*(1-Math.pow(1-k,3))).toLocaleString('ru'));
    if(k<1){requestAnimationFrame(f);if(Math.random()<.2)tone(600+k*800,.05,'sine',0,.05)}})(t0);
  const close=()=>o.remove();o.onclick=close;setTimeout(close,7000)}
let balShown=null;
function tickBal(){const t=Math.floor(S.bal),e=$('#bal');if(balShown===null)balShown=t;cancelAnimationFrame(tickBal.r);
  (function f(){const d=t-balShown,s=Math.sign(d)*Math.max(1,Math.ceil(Math.abs(d)*.12));balShown=Math.abs(s)>=Math.abs(d)?t:balShown+s;e.innerHTML='<i class="cn"></i> '+balShown.toLocaleString('ru');if(balShown!==t)tickBal.r=requestAnimationFrame(f)})()}
for(let i=0;i<30;i++){const s=document.createElement('i');s.className='st';s.style.cssText=`left:${Math.random()*100}vw;top:${Math.random()*100}vh;animation-delay:${Math.random()*4}s`;document.body.appendChild(s)}
ui();

function rain(T,host){
  const cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';host.prepend(cv);
  const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.setSize(innerWidth,innerHeight,false);
  const sc=new T.Scene(),cam=new T.PerspectiveCamera(50,innerWidth/innerHeight,.1,100);cam.position.z=14;
  sc.add(new T.AmbientLight(0xffffff,1.2));const dl=new T.DirectionalLight(0xffffff,2.5);dl.position.set(3,6,8);sc.add(dl);
  const g=new T.CylinderGeometry(.55,.55,.12,32),m=new T.MeshPhongMaterial({color:0xffc93c,shininess:140,specular:0xffffff,emissive:0x4a2a00});
  const cs=Array.from({length:70},()=>{const c=new T.Mesh(g,m);c.position.set((Math.random()-.5)*26,10+Math.random()*30,(Math.random()-.5)*8);
    c.userData={v:.08+Math.random()*.1,rx:Math.random()*.1,rz:Math.random()*.1};c.rotation.set(Math.random()*6,0,Math.random()*6);sc.add(c);return c});
  let n=0;(function f(){if(!host.isConnected){r.dispose();return}requestAnimationFrame(f);
    cs.forEach(c=>{c.position.y-=c.userData.v;c.rotation.x+=c.userData.rx;c.rotation.z+=c.userData.rz;if(c.position.y<-10&&n<260){c.position.y=10+Math.random()*6;n++}});r.render(sc,cam)})()}
document.body.insertAdjacentHTML('afterbegin','<div class="floor"></div>');

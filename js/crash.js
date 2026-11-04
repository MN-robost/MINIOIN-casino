/* Ракетка (crash) */
(()=>{
const cv=$('#cc'),x=cv.getContext('2d'),R=.15;
let s='idle',m=1,cp=2,t0=0,stake=0,cashed=0,P=[],H=[],lt=0,lx=60,ly=300;
function draw(){
  const W=cv.width,Hh=cv.height,t=m>1?Math.log(m)/R:0,tm=Math.max(8,t*1.15),ym=Math.max(2,m*1.2);
  x.clearRect(0,0,W,Hh);x.strokeStyle='#ffffff14';x.lineWidth=1;
  for(let i=1;i<6;i++){x.beginPath();x.moveTo(0,Hh*i/6);x.lineTo(W,Hh*i/6);x.moveTo(W*i/6,0);x.lineTo(W*i/6,Hh);x.stroke()}
  const X=u=>40+(W-80)*u/tm,Y=v=>Hh-30-(Hh-60)*(v-1)/(ym-1),col=s=='boom'?'#ff3b5c':'#19f0ff';
  x.beginPath();x.moveTo(X(0),Y(1));for(let u=0;u<=t;u+=Math.max(t/90,.02))x.lineTo(X(u),Y(Math.exp(R*u)));x.lineTo(X(t),Y(m));
  x.strokeStyle=col;x.lineWidth=5;x.shadowColor=col;x.shadowBlur=22;x.stroke();x.shadowBlur=0;
  lx=X(t);ly=Y(m);
  if(s!='boom'){const sl=(Hh-60)/(ym-1)*R*m/((W-80)/tm);x.save();x.translate(lx,ly);x.rotate(-Math.atan(sl)+Math.PI/4);x.font='36px serif';x.textAlign='center';x.fillText('🚀',0,10);x.restore()}
  P=P.filter(p=>p.l>0);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l-=.02;x.globalAlpha=Math.max(p.l,0);x.fillStyle=p.l>.5?'#ffd54a':'#ff2bd6';x.beginPath();x.arc(p.x,p.y,5,0,7);x.fill()});x.globalAlpha=1;
  x.font='bold 70px sans-serif';x.textAlign='center';x.fillStyle=s=='boom'?'#ff3b5c':cashed?'#19ff8c':'#fff';x.shadowColor=x.fillStyle;x.shadowBlur=24;
  x.fillText('×'+m.toFixed(2),W/2,Hh/2+10);x.shadowBlur=0;
  if(s=='boom'){x.font='bold 24px sans-serif';x.fillText('💥 УЛЕТЕЛА!',W/2,Hh/2+50)}
}
function cash(){cashed=1;$('#cout').disabled=true;const g=settle(stake,Math.floor(stake*m),stake);say(`✅ Забрал на ×${m.toFixed(2)} → +${g-stake} 🪙`)}
function boom(){
  s='boom';$('#cout').disabled=true;
  if(!cashed){settle(stake,0);say(`💥 Ракета рухнула на ×${cp.toFixed(2)}`)}
  H.push(cp);$('#chist').innerHTML=H.slice(-12).map(v=>`<span style="color:${v>=10?'#ffd54a':v>=2?'#19f0ff':'#ff6b8a'}">×${v.toFixed(2)}</span>`).join('');
  P=Array.from({length:60},()=>({x:lx,y:ly,vx:(Math.random()-.5)*12,vy:(Math.random()-.5)*12,l:1}));
  document.body.classList.add('shake');setTimeout(()=>document.body.classList.remove('shake'),1500);
  if(!cashed)sfx.lose();[200,150,100].forEach((f,i)=>tone(f,.3,'sine',i*.08,.1));
  setTimeout(()=>{s='idle';m=1;$('#cgo').disabled=false;draw()},1800)}
function loop(n){
  if(s=='fly'){m=Math.exp(R*(n-t0)/1000);const a=+$('#cauto').value;
    if(!cashed&&a>=1.1&&m>=a)cash();
    if(m>=cp){m=cp;boom()}else if(n-lt>90){lt=n;tone(180+Math.min(m,30)*40,.08,'sine',0,.05)}}
  draw();if(s!='idle'||P.length)requestAnimationFrame(loop)}
$('#cgo').onclick=()=>{
  if(s!='idle'||!bet(S.bet))return;stake=S.bet;cashed=0;
  cp=Math.min(500,Math.max(1,Math.floor(97/(1-Math.random()))/100));
  s='fly';m=1;P=[];t0=performance.now();lt=0;say('');$('#cgo').disabled=true;$('#cout').disabled=false;sfx.win();requestAnimationFrame(loop)};
$('#cout').onclick=()=>{if(s=='fly'&&!cashed)cash()};
draw();
})();

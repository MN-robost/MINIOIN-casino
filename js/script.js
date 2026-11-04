
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let S={bal:1000,debt:0,bet:50,mult:0,ins:0,snd:1,gift:0,xp:0,fs:0,fsb:0};
try{Object.assign(S,JSON.parse(localStorage.getItem('gmc2')||'{}'))}catch(e){}
S.fs=0;S.fsw=0;
/* звук */
let AC;
function tone(f,d=.12,t='sine',dl=0,v=.15){if(!S.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),s=AC.currentTime+dl;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g);g.connect(AC.destination);o.start(s);o.stop(s+d)}catch(e){}}
const sfx={click:()=>tone(500,.05,'square',0,.06),tick:()=>tone(900,.03,'triangle',0,.07),
win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',i*.1)),
big:()=>[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.3,'square',i*.09,.1)),
lose:()=>[300,220,160].forEach((f,i)=>tone(f,.25,'sawtooth',i*.13,.08)),card:()=>tone(250,.07,'square',0,.07)};
/* состояние */
let curTab='lobby';
function stat(g,k,v){const s=S.st=S.st||{},o=s[g]=s[g]||{n:0,w:0,v:0,b:0};o[k]+=v;if(k==='v'&&v>o.b)o.b=v}
function ui(){S.peak=Math.max(S.peak||0,S.bal);
  (window.tickBal||(()=>$('#bal').textContent='🪙 '+Math.floor(S.bal).toLocaleString('ru')))();
  $('#debt').hidden=!S.debt;$('#debt').textContent='🕴️ Долг: '+S.debt;
  $$('.chip').forEach(c=>c.classList.toggle('on',+c.dataset.b===S.bet));
  $('#flags').textContent=(S.mult?'✨ Множитель ×2  ':'')+(S.ins?'🛡️ Страховка':'');
  $('#snd').textContent=S.snd?'🔊':'🔇';$('#buy').textContent='💥 Купить бонус · '+S.bet*TH[th].buy;
  try{localStorage.setItem('gmc2',JSON.stringify(S))}catch(e){}
}
const ic=s=>String(s).replaceAll('🪙','<i class="cn"></i>');const say=t=>$('#msg').innerHTML=ic(t);
function coins(n=24){for(let i=0;i<n;i++){const c=document.createElement('div');c.className='coin';c.innerHTML=['<i class="cn"></i>','<i class="cn"></i>','✨'][i%3];c.style.left=Math.random()*100+'vw';c.style.animationDelay=Math.random()*.8+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),3200)}}
function bet(st){if(st>S.bal){say('Не хватает фишек! Загляни в магазин бонусов 😈');sfx.lose();return false}S.bal-=st;stat(curTab,'n',1);stat(curTab,'w',st);ui();return true}
function settle(st,p,ref=st){
  if(p>st&&S.mult){p=st+(p-st)*2;S.mult=0}
  if(!p&&S.ins&&st){p=st;S.ins=0;say('🛡️ Страховка вернула ставку!')}
  S.bal+=p;stat(curTab,'v',p);ui();
  if(p>st){const b=$('#bal');b.classList.add('win');setTimeout(()=>b.classList.remove('win'),600);p>=ref*20?jackpot(p,ref):p>=ref*8?(sfx.big(),coins(40)):(sfx.win(),coins(12))}else if(p<st)sfx.lose();
  return p}
const AC_={slots:0,roul:'#19f0ff',lucky:'#ffd54a',bj:'#19ff8c',poker:'#8b5cf6',shop:'#ff9d00',crash:'#ff3b5c',tumble:'#ff7ad9',lobby:'#ff2bd6',dice:'#ff9d00'};
const setAc=c=>document.documentElement.style.setProperty('--ac',c);
$('#tabs').onclick=e=>{const t=e.target.dataset.t;if(!t)return;curTab=t;document.body.dataset.tab=t;sfx.click();say('');
  $$('#tabs button').forEach(b=>b.classList.toggle('on',b===e.target));$$('section').forEach(s=>s.classList.toggle('on',s.id===t));
  setAc(AC_[t]||TH[th].c)};
$$('.chip').forEach(c=>c.onclick=()=>{S.bet=+c.dataset.b;sfx.click();ui()});
$('#snd').onclick=()=>{S.snd=!S.snd;ui();sfx.click()};
$('#enter').onclick=()=>{sfx.big();$('#splash').classList.add('off');document.body.classList.add('in')};

/* ---------- слоты ---------- */
const TH=[
 {n:'НЕОНОВАЯ ВИШНЯ · 3×3',s:['🍒','🍋','🔔','⭐','💎','7️⃣'],wild:'',sc:'🎁',c:'#ff2bd6',C:3,R:3,k:0.7170,sn:3,buy:12},
 {n:'ЗОЛОТО ФАРАОНА · 5×3',s:['🐍','🦂','🏺','👁️','👑','🔱'],wild:'☀️',sc:'⚱️',c:'#ffd54a',C:5,R:3,k:0.1293,sn:4,buy:13},
 {n:'КОСМО-БАНАН · 5×5',s:['🍌','🚀','👽','🌙','🛸','🌌'],wild:'🌟',sc:'☄️',c:'#19f0ff',C:5,R:5,k:0.0745,sn:5,buy:11}];
const W=[6,5,4,3,2,1],PAY=[2,3,6,12,25,100];
let th=0,busy=0;
const pool=()=>{const t=TH[th],p=[];t.s.forEach((x,i)=>{for(let k=0;k<W[i];k++)p.push(x)});if(t.wild)p.push(t.wild,t.wild);p.push(t.sc,t.sc);return p};
const lines=t=>{const L=[];for(let r=0;r<t.R;r++)L.push([...Array(t.C)].map((_,c)=>[c,r]));
  const z=[...Array(t.C)].map((_,c)=>Math.round((t.R-1)*(1-Math.abs(2*c/(t.C-1)-1))));
  L.push(z.map((r,c)=>[c,r]),z.map((r,c)=>[c,t.R-1-r]));return L};
$('#th').innerHTML=TH.map((t,i)=>`<button data-i="${i}">${t.s[4]} ${t.n}</button>`).join('');
const cellH=()=>TH[th].R>3?58:76;
function setTh(i){if(busy||S.fs>0)return;th=i;const t=TH[i],h=cellH();setAc(t.c);$('#sname').textContent=t.n;
  $$('#th button').forEach((b,k)=>b.classList.toggle('on',k===i));
  $('#reels').style.setProperty('--h',h+'px');
  const P=pool(),rn=()=>P[Math.floor(Math.random()*P.length)];
  $('#reels').innerHTML=[...Array(t.C)].map(()=>`<div class="reel" style="height:${t.R*h}px"><div class="strip">${Array.from({length:t.R},()=>`<i>${rn()}</i>`).join('')}</div></div>`).join('')}
$('#th').onclick=e=>{if(e.target.dataset.i!==undefined){sfx.click();setTh(+e.target.dataset.i);ui()}};
let fin=[],turbo=0,quick=0,fsTot=0,fsN=0;
const TF=()=>turbo||quick?.3:1;
async function spin(){
  if(busy)return;let st=S.bet;const free=S.fs>0;
  if(free){S.fs--;fsN++;st=S.fsb}else if(!bet(st))return;
  busy=1;$('#spin').disabled=$('#buy').disabled=true;$('#skip').hidden=false;say('');sfx.spin();
  const t=TH[th],h=cellH(),P0=pool(),P=free?P0.filter((x,i,a)=>x!==t.sc||a.indexOf(x)===i):P0;
  const rn=()=>P[Math.random()*P.length|0],g=[...Array(t.C)].map(()=>Array.from({length:t.R},rn)),S_=$$('.strip');fin=[];
  await Promise.all(S_.map((s,c)=>new Promise(res=>{
    const old=[...s.children].map(x=>x.textContent),mid=Array.from({length:Math.round((14+c*6)*Math.max(TF(),.4))},rn),T=(1.2+c*.35)*TF();
    s.style.transition='none';s.style.transform='translateY(0)';
    s.innerHTML=old.concat(mid,g[c]).map(x=>`<i>${x}</i>`).join('');s.parentNode.classList.add('spin');s.offsetHeight;
    s.style.transition=`transform ${T}s cubic-bezier(.16,.8,.24,1.05)`;s.style.transform=`translateY(${-(mid.length+t.R)*h}px)`;
    let d=0,tm;const end=()=>{if(d)return;d=1;clearTimeout(tm);s.style.transition='none';s.style.transform='none';s.innerHTML=g[c].map(x=>`<i>${x}</i>`).join('');s.parentNode.classList.remove('spin');sfx.stop(c);res()};
    tm=setTimeout(end,T*1000+60);fin.push(end)})));
  $('#skip').hidden=true;
  let win=0,hit=[];
  lines(t).forEach(l=>{const sy=l.map(([c,r])=>g[c][r]);let b=null,n=0;
    for(const x of sy){if(x===t.sc)break;if(x===t.wild||b===null||x===b){if(x!==t.wild&&b===null)b=x;n++}else break}
    if(n>=3){win+=st*PAY[b===null?5:t.s.indexOf(b)]*(n==3?1:n==4?3:10)*t.k;hit.push(...l.slice(0,n))}});
  if(free)win*=2;win=Math.floor(win);
  const scn=g.flat().filter(x=>x===t.sc).length;
  hit.forEach(([c,r])=>S_[c].children[r].classList.add('hit'));
  if(scn>=t.sn)g.forEach((col,c)=>col.forEach((x,r)=>x===t.sc&&S_[c].children[r].classList.add('hit')));
  let m;
  if(free){fsTot+=win;m=win?`Бонус-спин: +${win}`:'Бонус-спин: без выигрыша'}
  else{const got=settle(st,win,st);m=got?`🎉 Выигрыш +${got}`:'Не повезло... крутим ещё!'}
  if(scn>=t.sn){sfx.big();if(free){S.fs=Math.min(S.fs+5,Math.max(0,20-fsN));m+=' · 🎁 +5 спинов!'}else{S.fs=8;S.fsb=st;fsTot=0;fsN=0;m+=' · 🎁 БОНУСНАЯ ИГРА: 8 спинов!'}}
  else if(scn>0)m+=` · ${t.sc} ${scn}/${t.sn}`;
  if(!jp_open())say(m);
  if(S.fs>0){$('#fsi').textContent=`🎁 Бонус: осталось ${S.fs} · накоплено ${fsTot}`;busy=0;setTimeout(spin,(free?900:1500)*TF()+200)}
  else{if(free){const g2=settle(0,fsTot,S.fsb);if(!jp_open())say(`🎁 Бонус завершён: +${g2} 🪙 в банк`);quick=0}
    $('#fsi').textContent='';busy=0;$('#spin').disabled=$('#buy').disabled=false}
}
$('#spin').onclick=()=>{if(!busy&&S.fs<=0)spin()};
$('#buy').onclick=()=>{if(busy||S.fs>0)return;if(!bet(S.bet*TH[th].buy))return;S.fs=8;S.fsb=S.bet;fsTot=0;fsN=0;$('#spin').disabled=$('#buy').disabled=true;sfx.big();say('🎁 Бонусная игра!');setTimeout(spin,700)};
$('#skip').onclick=()=>{if(S.fs>0)quick=1;fin.slice().forEach(f=>f())};
$('#turbo').onclick=e=>{turbo^=1;e.currentTarget.classList.toggle('on',!!turbo)};
setTh(0);

/* ---------- колёса (общий код) ---------- */
function wheel(cv,segs,rot,np,pr){if(cv.r3){cv.r3(rot,pr);return}
  const x=cv.getContext('2d'),Wd=cv.width,c=Wd/2,n=segs.length,s=6.2832/n,R=c-12;
  x.clearRect(0,0,Wd,Wd);x.save();x.translate(c,c);x.rotate(rot);
  segs.forEach((g,i)=>{const a=i*s-1.5708-s/2;x.beginPath();x.moveTo(0,0);x.arc(0,0,R,a,a+s);x.closePath();x.fillStyle=g.c;x.fill();x.strokeStyle='#ffd54a88';x.lineWidth=1;x.stroke();
    x.save();x.rotate(a+s/2);x.translate(R*.8,0);x.rotate(1.5708);x.fillStyle='#fff';x.font='bold '+Math.round(Wd/30)+'px sans-serif';x.textAlign='center';x.fillText(g.t,0,4);x.restore()});
  x.beginPath();x.arc(0,0,R*.4,0,7);x.fillStyle='#12071f';x.fill();x.strokeStyle='#ff2bd6';x.lineWidth=4;x.stroke();x.restore();
  if(!np){x.beginPath();x.moveTo(c-13,0);x.lineTo(c+13,0);x.lineTo(c,26);x.closePath();x.fillStyle='#19f0ff';x.fill()}}
function spinW(cv,segs,idx,o,done){sfx.spin();
  const s=6.2832/segs.length,from=o.r,to=-idx*s+6.2832*(5+Math.floor(Math.random()*3)),t0=performance.now();let last=-1;
  (function f(now){const p=Math.min((now-t0)/4500,1);o.r=from+(to-from)*(1-Math.pow(1-p,4));wheel(cv,segs,o.r,0,p);
    const k=Math.floor(o.r/s);if(k!==last){last=k;(segs.length>33?sfx.rt:sfx.wt)(p)}
    if(p<1)requestAnimationFrame(f);else{o.r%=6.2832;sfx.fin(segs.length>33);done()}})(t0)}

/* рулетка */
const ORD=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const RED=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const RS=ORD.map(n=>({t:n,c:n?RED.includes(n)?'#c00f2e':'#151515':'#0a8d4c'}));
const RW={red:n=>RED.includes(n),black:n=>n&&!RED.includes(n),even:n=>n&&n%2==0,odd:n=>n%2==1,low:n=>n>=1&&n<=18,high:n=>n>=19,d1:n=>n>=1&&n<=12,d2:n=>n>=13&&n<=24,d3:n=>n>=25,zero:n=>n==0};
const RM={d1:3,d2:3,d3:3,zero:36};
const RO=[['red','Красное ×2','r'],['black','Чёрное ×2','b'],['even','Чёт ×2'],['odd','Нечет ×2'],['low','1–18 ×2'],['high','19–36 ×2'],['d1','1–12 ×3'],['d2','13–24 ×3'],['d3','25–36 ×3'],['zero','Зеро ×36','g']];
$('#rb').innerHTML=RO.map(x=>`<button class="${x[2]||''}" data-k="${x[0]}">${x[1]}</button>`).join('');
let rk=null;const ro={r:0};wheel($('#rw'),RS,0);
$('#rb').onclick=e=>{const k=e.target.dataset.k;if(!k)return;rk=k;$('#rnum').value='';$$('#rb button').forEach(b=>b.classList.toggle('on',b===e.target));sfx.click()};
$('#rnum').oninput=()=>{rk=null;$$('#rb button').forEach(b=>b.classList.remove('on'))};
$('#rgo').onclick=()=>{
  let k=rk,num=null;const tx=$('#rnum').value;
  if(tx!==''){num=+tx;if(!(num>=0&&num<=36))return say('Число от 0 до 36');k='num'}
  if(!k)return say('Сначала выбери, на что ставишь 👆');
  const st=S.bet;if(!bet(st))return;$('#rgo').disabled=true;say('');
  const i=Math.floor(Math.random()*37),n=ORD[i];
  spinW($('#rw'),RS,i,ro,()=>{
    const win=k==='num'?n===num:!!RW[k](n),mul=k==='num'?36:RM[k]||2;
    const got=settle(st,win?st*mul:0);
    say(`Выпало ${n} ${n==0?'🟢':RED.includes(n)?'🔴':'⚫'} — `+(got>st?`ПОБЕДА +${got-st}! 🎉`:got===st?'ставка возвращена':'мимо 😬'));
    $('#rgo').disabled=false})};

/* колесо удачи */
const FW=[0,1,.5,0,2,0,1,0,.5,10,0,1,0,2,0,.5,0,5,1,0,.5,0,2,0,1,.5,0,0,.5,0];
const fcol=v=>v==0?'#1b1030':v<1?'#5b2bb0':v==1?'#0a8fa0':v==2?'#c0188f':v==5?'#d98a00':'#b8860b';
const FS=FW.map(v=>({t:v?'×'+v:'✖',c:fcol(v)}));
const lo={r:0};wheel($('#lw'),FS,0);
$('#lgo').onclick=()=>{
  const st=S.bet;if(!bet(st))return;$('#lgo').disabled=true;say('');
  const i=Math.floor(Math.random()*FW.length),v=FW[i];
  spinW($('#lw'),FS,i,lo,()=>{const got=settle(st,Math.floor(st*v),st);
    say(v>=10?'💎 ДЖЕКПОТ ×10!!!':v?`Множитель ×${v} → ${got} 🪙`:'Пусто... ✖');$('#lgo').disabled=false})};

/* ---------- карты ---------- */
const mk=()=>{const d=[];for(const s of ['♠','♥','♦','♣'])for(const r of ['2','3','4','5','6','7','8','9','10','J','Q','K','A'])d.push({r,s});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d};
const cardEl=(c,h,x='')=>h?'<div class="card back"></div>':`<div class="card ${'♥♦'.includes(c.s)?'red':''}" ${x}>${c.r}${c.s}</div>`;
/* блэкджек */
let deck,P=[],D=[],sk=0,live=0;
const val=h=>{let t=0,a=0;h.forEach(c=>{if(c.r==='A'){t+=11;a++}else t+=['J','Q','K'].includes(c.r)?10:+c.r});while(t>21&&a--)t-=10;return t};
function draw(hide){
  $('#ph').innerHTML=P.map(c=>cardEl(c)).join('');$('#dh').innerHTML=D.map((c,i)=>cardEl(c,hide&&i===1)).join('');
  $('#pv').textContent=P.length?val(P):'';$('#dv').textContent=D.length?(hide?val([D[0]]):val(D)):'';
  $('#hit').disabled=$('#stand').disabled=!live;$('#dbl').disabled=!(live&&P.length===2&&S.bal>=sk);$('#deal').disabled=!!live}
$('#deal').onclick=()=>{sk=S.bet;if(!bet(sk))return;deck=mk();P=[deck.pop(),deck.pop()];D=[deck.pop(),deck.pop()];live=1;say('');sfx.card();draw(1);if(val(P)===21)end()};
$('#hit').onclick=()=>{P.push(deck.pop());sfx.card();draw(1);if(val(P)>=21)end()};
$('#stand').onclick=()=>end();
$('#dbl').onclick=()=>{S.bal-=sk;sk*=2;ui();P.push(deck.pop());sfx.card();end()};
function end(){
  live=0;const pv=val(P),nat=pv===21&&P.length===2;
  if(pv<=21&&!nat)while(val(D)<17)D.push(deck.pop());
  const dv=val(D);let p=0,t;
  if(pv>21)t='Перебор! 💥';
  else if(nat&&!(dv===21&&D.length===2)){p=Math.floor(sk*2.5);t='БЛЭКДЖЕК! 3:2 🎰'}
  else if(dv>21||pv>dv){p=sk*2;t='Вы победили! 🎉'}
  else if(pv===dv){p=sk;t='Ничья'}else t='Дилер выиграл';
  draw(0);const got=settle(sk,p);say(t+(got>sk?` +${got-sk}`:''))}

/* ---------- магазин ---------- */
document.addEventListener('click',e=>{
  const k=e.target.dataset&&e.target.dataset.buy;if(!k)return;
  if(k==='reset'){if(confirm('Сбросить баланс, долг, VIP и все бонусы?')){try{localStorage.removeItem('gmc2')}catch(x){}location.reload()}return}
  if(k==='mult'||k==='ins'){const c=k==='mult'?300:150;if(S.bal<c)return say('Не хватает фишек');S.bal-=c;S[k]=1;sfx.win();say('Бонус куплен!')}
  if(k==='box'){if(S.bal<100)return say('Не хватает фишек');S.bal-=100;const r=[0,0,0,0,0,0,0,0,25,25,25,25,50,50,50,100,100,150,250,1000][Math.floor(Math.random()*20)];S.bal+=r;say(r?`📦 В лутбоксе ${r} 🪙`:'📦 Пусто... бывает');r>=200?(sfx.big(),coins(30)):r?sfx.win():sfx.lose()}
  if(k==='loan'){S.bal+=1000;S.debt+=1500;sfx.big();coins(20);say('Дядя Вито доволен. Пока что. 🕴️')}
  if(k==='repay'){if(!S.debt)return say('Долгов нет — ты чист!');const p=Math.min(S.debt,Math.floor(S.bal));S.bal-=p;S.debt-=p;sfx.win();say(S.debt?'Часть вернул. Вито ждёт остальное...':'Долг закрыт! Дядя Вито кивает 🤝')}
  if(k==='gift'){if(S.gift)return say('Подарок уже получен');S.gift=1;S.bal+=500;sfx.big();coins(30)}
  ui()});
ui();

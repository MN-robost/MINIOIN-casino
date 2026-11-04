/* Покер: Texas Hold'em без лимита, ты + 3 бота, побочные банки */
(()=>{
const NM=[['Ты','🧑'],['Дядя Вито','🕴️'],['Лола','💋'],['Бобби','🐒']],
CAT=['Старшая карта','Пара','Две пары','Сет','Стрит','Флеш','Фулл-хаус','Каре','Стрит-флеш'],RKS=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const SP={f:['Пас...','Не мой день','Сдаюсь, босс'],c:['Колл','Уравняю','Ладно, смотрим'],k:['Чек','Стучу по столу'],r:['Рейз!','А если так?','Поднимаю!','Блефую? Узнаешь!'],a:['ВА-БАНК!!!','ALL-IN, детка!','Всё или ничего!'],w:['Мой банк! 😎','Спасибо за фишки','Изи']};
const rd=a=>a[Math.random()*a.length|0],sleep=ms=>new Promise(r=>setTimeout(r,ms));
let Pl=NM.map((n,i)=>({id:i,n:n[0],a:n[1],stack:1000,h:[],bet:0,tot:0,f:0,say:'',w:0})),board=[],pot=0,cur=0,bb=50,dealer=0,pres=null,run=0;
const stk=p=>p.id?p.stack:S.bal,el=p=>p.id?$(`.seat[data-i="${p.id}"]`):$('#you');
function fly(a,b,n=4){if(!a||!b)return;const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
  for(let i=0;i<n;i++){const c=document.createElement('div');c.className='fc pchip';c.style.setProperty('--c',['#d4163c','#1d6fe0','#14a85a','#222','#8b5cf6'][Math.random()*5|0]);document.body.appendChild(c);
    c.animate([{left:A.left+A.width/2+'px',top:A.top+A.height/2+'px',transform:'translate(-50%,-50%)'},{left:B.left+B.width/2+(Math.random()*40-20)+'px',top:B.top+B.height/2+'px',transform:'translate(-50%,-50%) scale(.7) rotate(300deg)'}],
      {duration:650+i*90,delay:i*70,easing:'cubic-bezier(.3,.7,.3,1)',fill:'both'}).onfinish=()=>c.remove()}}
function bub(p,t){if(!p.id)return;const e=el(p);if(!e)return;const b=document.createElement('div');b.className='bub';b.textContent=t;e.appendChild(b);setTimeout(()=>b.remove(),1900)}
function put(p,a){a=Math.max(0,Math.min(a,stk(p)));if(p.id)p.stack-=a;else{S.bal-=a;stat('poker','w',a);ui()}p.bet+=a;p.tot+=a;pot+=a;if(a>0){fly(el(p),$('#pot'),Math.min(6,1+(a/bb|0)));tone(700,.05,'square',0,.05)}}
function sc5(h){
  const v=h.map(c=>c.v).sort((a,b)=>b-a),fl=h.every(c=>c.s==h[0].s),cn={};v.forEach(q=>cn[q]=(cn[q]||0)+1);
  const g=Object.entries(cn).map(([r,n])=>[n,+r]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);
  let st=0;if(new Set(v).size==5){if(v[0]-v[4]==4)st=v[0];else if(v.join()=='14,5,4,3,2')st=5}
  const cat=st&&fl?8:g[0][0]==4?7:g[0][0]==3&&g[1][0]==2?6:fl?5:st?4:g[0][0]==3?3:g[0][0]==2&&g[1][0]==2?2:g[0][0]==2?1:0;
  return cat*1e10+(st?[st]:g.map(q=>q[1])).reduce((a,r)=>a*15+r,0)}
function best(c){if(c.length<=5)return sc5(c);const n=c.length;let b=0;
  for(let i=0;i<n;i++)for(let j=n==6?i:i+1;j<n;j++){if(n==6&&j>i)break;b=Math.max(b,sc5(c.filter((_,k)=>k!=i&&k!=j)))}return b}
function str(p){
  if(board.length<3){const[a,b]=p.h.map(c=>c.v).sort((x,y)=>y-x);return a/14*.4+b/14*.25+(a==b?.35:0)+(p.h[0].s==p.h[1].s?.05:0)+(a-b<=2?.05:0)}
  return[.2,.45,.65,.75,.85,.9,.95,1,1][Math.floor(best(p.h.concat(board))/1e10)]}
function bot(p,tc,cr){
  const s=str(p)+(Math.random()-.5)*.25,mx=p.bet+p.stack,rz=()=>Math.min(mx,cur+Math.max(bb,Math.floor((pot+tc)*(.35+Math.random()*.5))));
  if(tc&&s<.3+tc/(pot+tc)*.25&&Math.random()>.1)return'f';
  if(cr&&s>.9&&Math.random()<.25)return{r:mx};
  if(cr&&s>.72&&Math.random()<.55)return{r:rz()};
  if(!tc&&cr&&s>.55&&Math.random()<.3)return{r:rz()};return'c'}
function cards(rev){
  $('#seats').classList.toggle('rev',!!rev);
  $('#seats').innerHTML=Pl.slice(1).map(p=>`<div class="seat" data-i="${p.id}"><i class="av">${p.a}</i> <b>${p.n}${p.id==dealer?' 🔘':''}</b> <span data-s="${p.id}"></span><div class="hand">${p.h.map(c=>cardEl(c,!(rev&&!p.f))).join('')}</div><em data-e="${p.id}"></em></div>`).join('');
  $('#board').innerHTML=[0,1,2,3,4].map(i=>board[i]?cardEl(board[i]):'<div class="card ph"></div>').join('');
  $('#you').innerHTML=Pl[0].h.map(c=>cardEl(c)).join('');info()}
function info(){
  Pl.forEach(p=>{const e=$(`[data-e="${p.id}"]`),s=$(`[data-s="${p.id}"]`),q=$(`.seat[data-i="${p.id}"]`);
    if(e)e.textContent=p.f?'фолд':(p.bet?'ставка '+p.bet+' · ':'')+p.say;if(s)s.innerHTML='<i class="cn"></i>'+p.stack;if(q){q.classList.toggle('fold',!!p.f);q.classList.toggle('win',!!p.w)}});
  const me=Pl[0];$('#you').classList.toggle('win',!!me.w);$('#me').textContent=me.f?'ты сбросил':(me.bet?'твоя ставка '+me.bet+' · ':'')+me.say;$('#pot').innerHTML='<i class="pchip"></i> Банк: '+pot;window.potStack&&window.potStack(pot,bb)}
function pact(tc){return new Promise(res=>{
  const me=Pl[0],mx=me.bet+S.bal,mn=Math.min(mx,cur+bb),B=['#pf','#pk','#pr','#q1','#q2','#q3','#q4'].map($),r=$('#prs'),can=S.bal>tc;
  B.forEach(b=>b.disabled=false);[B[2],B[3],B[4],B[5],B[6]].forEach(b=>b.disabled=!can);r.disabled=!can;
  B[1].textContent=tc?`Колл ${Math.min(tc,S.bal)}`:'Чек';r.min=mn;r.max=mx;r.step=1;r.value=mn;
  const upd=()=>{B[2].textContent=+r.value>=mx?'ALL-IN':`Рейз до ${r.value}`;$('#pv2').textContent=r.value},set=v=>{r.value=Math.max(mn,Math.min(mx,Math.round(v)));upd()};
  upd();r.oninput=upd;B[3].onclick=()=>set(mn);B[4].onclick=()=>set(cur+(pot+tc)/2);B[5].onclick=()=>set(cur+pot+tc);B[6].onclick=()=>done({r:mx});
  const done=a=>{B.forEach(b=>b.disabled=true);r.disabled=true;pres=null;res(a)};
  B[0].onclick=()=>done('f');B[1].onclick=()=>done('c');B[2].onclick=()=>done({r:+r.value});pres=1})}
async function round(i){
  const acted=new Set();let rc=0;
  while(true){
    const al=Pl.filter(p=>!p.f);if(al.length<2)return;const can=al.filter(q=>stk(q)>0);if(can.length<=1&&(!can.length||can[0].bet>=cur))return;
    if(al.every(p=>(acted.has(p.id)&&p.bet>=cur)||stk(p)==0))return;
    const p=Pl[i%4];i++;if(p.f||stk(p)==0)continue;
    const tc=cur-p.bet;let a;
    if(p.id==0)a=await pact(tc);else{await sleep(Pl[0].f?150:900);a=bot(p,tc,rc<4)}
    if(a=='f'){p.f=1;p.say='фолд';bub(p,rd(SP.f));if(!p.id)sfx.lose()}
    else if(a=='c'||a.r<=cur){put(p,tc);acted.add(p.id);p.say=tc?'колл':'чек';bub(p,rd(tc?SP.c:SP.k))}
    else{put(p,a.r-p.bet);cur=Math.max(cur,p.bet);rc++;acted.clear();acted.add(p.id);const ai=stk(p)==0;p.say=ai?'ALL-IN!':'рейз';bub(p,rd(ai?SP.a:SP.r));if(ai){sfx.big();document.body.classList.add('shake');setTimeout(()=>document.body.classList.remove('shake'),1500)}}
    info()}}
async function hand(){
  if(run)return;bb=S.bet;if(S.bal<bb*6)return say('Мало фишек для стола — загляни в магазин бонусов');
  run=1;stat('poker','n',1);$('#pdeal').disabled=true;pot=0;board=[];
  const dk=mk().map(c=>({...c,v:RKS.indexOf(c.r)+2}));
  Pl.forEach(p=>{p.h=[dk.pop(),dk.pop()];p.bet=p.tot=p.f=p.w=0;p.say='';if(p.id&&p.stack<bb*10)p.stack=1000});
  dealer=(dealer+1)%4;cards(0);sfx.card();
  put(Pl[(dealer+1)%4],bb/2);put(Pl[(dealer+2)%4],bb);cur=bb;info();
  say(`Дилер: ${Pl[dealer].n} · блайнды ${bb/2}/${bb}`);
  await round(dealer+3);
  for(let s=1;s<4&&Pl.filter(p=>!p.f).length>1;s++){
    for(let k=0;k<(s==1?3:1);k++)board.push(dk.pop());
    Pl.forEach(p=>{p.bet=0;p.say=''});cur=0;const ai=Pl.some(p=>!p.f&&stk(p)==0);cards(ai?1:0);sfx.card();await sleep(ai?1400:600);if(!ai)await round(dealer+1)}
  const al=Pl.filter(p=>!p.f),sc={};
  if(al.length>1){cards(1);al.forEach(p=>sc[p.id]=best(p.h.concat(board)))}else sc[al[0].id]=0;
  const win=[0,0,0,0],back=[0,0,0,0];let prev=0;
  [...new Set(Pl.map(p=>p.tot).filter(x=>x>0))].sort((a,b)=>a-b).forEach(L=>{
    const part=Pl.filter(p=>p.tot>=L),amt=(L-prev)*part.length;prev=L;
    let eg=part.filter(p=>!p.f);if(!eg.length)eg=al;if(part.length==1&&eg.length==1&&eg[0]===part[0]){back[part[0].id]+=amt;return}
    const m=Math.max(...eg.map(p=>sc[p.id])),ws=eg.filter(p=>sc[p.id]==m),sh=Math.floor(amt/ws.length);ws.forEach(p=>win[p.id]+=sh);win[ws[0].id]+=amt-sh*ws.length});
  const mxw=Math.max(...win),W=mxw>0?Pl.filter(p=>win[p.id]==mxw):[],me=Pl[0];
  Pl.forEach(p=>{p.w=win[p.id]>0?1:0;if(p.id)p.stack+=win[p.id]+back[p.id]});
  settle(me.tot,win[0]+back[0],Math.max(me.tot,bb));
  Pl.forEach(p=>{if(win[p.id]){fly($('#pot'),el(p),6);bub(p,rd(SP.w))}else if(back[p.id])fly($('#pot'),el(p),3)});
  say((W.length?`${W.map(p=>p.n).join(' и ')} ${W.length>1?'делят':'выигрывает'} ${mxw} 🪙`+(al.length>1?` · ${CAT[Math.floor(sc[W[0].id]/1e10)]}`:''):'Ставки возвращены')+(back[0]?` · тебе вернулась неоплаченная ставка ${back[0]}`:'')+(win[0]?' 🎉':''));
  pot=0;info();run=0;$('#pdeal').disabled=false}
$('#pdeal').onclick=hand;
window.__pk={get Pl(){return Pl},get board(){return board}};
})();

/* Сладкий взрыв: слот с каскадами 6×5 (scatter-pays) */
(()=>{
const SY=['🍓','🍇','🍉','🍋','🍒','🍭','🍬','💎'],BP=[.2,.25,.3,.4,.6,1,2,5],C=6,R=5,sl=ms=>new Promise(r=>setTimeout(r,ms));
const rn=()=>Math.floor(Math.random()*8);let g=[],busy=0;
function show(nw,pop){
  let o='';for(let r=0;r<R;r++)for(let c=0;c<C;c++)o+=`<div class="tc ${pop&&pop.has(g[c][r])?'pop':''} ${nw&&r<nw[c]?'drop':''}" style="--c:${c};--r:${r}">${SY[g[c][r]]}</div>`;
  $('#tg').innerHTML=o}
g=Array.from({length:C},()=>Array.from({length:R},rn));show();
$('#tgo').onclick=async()=>{
  if(busy)return;const st=S.bet;if(!bet(st))return;busy=1;$('#tgo').disabled=true;say('');
  g=Array.from({length:C},()=>Array.from({length:R},rn));show(Array(C).fill(R));[0,1,2,3,4,5].forEach(i=>tone(250+i*60,.08,'triangle',i*.05,.07));
  await sl(900);let tot=0,m=1;
  while(true){
    const cnt={};g.flat().forEach(x=>cnt[x]=(cnt[x]||0)+1);
    const w=Object.keys(cnt).filter(x=>cnt[x]>=8).map(Number);if(!w.length)break;
    let win=0;w.forEach(x=>win+=st*BP[x]*(cnt[x]-7));win=Math.floor(win*m*1.1);tot+=win;
    const set=new Set(w);show(null,set);say(`💥 Каскад ×${m}: +${win}`);[0,1,2].forEach(i=>tone(500+m*90+i*140,.18,'triangle',i*.07,.1));
    await sl(800);
    const nw=[];g=g.map((col,i)=>{const keep=col.filter(x=>!set.has(x));nw[i]=R-keep.length;return Array.from({length:nw[i]},rn).concat(keep)});
    show(nw);await sl(750);m++}
  const got=settle(st,tot,st);if(!jp_open())say(got?`🍬 Итого +${got} 🪙`:'Без каскадов... ещё раз!');
  busy=0;$('#tgo').disabled=false};
})();

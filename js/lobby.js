/* Лобби: карточки игр с 3D-наклоном */
(()=>{
const G=[['slots','🍒','Слоты','3 слота: 3×3, 5×3, 5×5 · бонус-игры','#ff2bd6'],['tumble','🍬','Сладкий взрыв','Каскады и растущие множители','#ff7ad9'],['roul','🎯','Рулетка','Классика с неоновым колесом','#19f0ff'],
['lucky','🎡','Колесо удачи','Множитель до ×10','#ffd54a'],['bj','🃏','Блэкджек','3:2 за блэкджек','#19ff8c'],['poker','♠️','Покер',"Hold'em против 3 ботов, all-in",'#8b5cf6'],
['crash','🚀','Ракетка','Забери выигрыш до взрыва','#ff3b5c'],['dice','🎲','3D Кости','Больше, меньше или ровно 7','#ff9d00'],['shop','💎','Бонусы','Множители, лутбоксы, дядя Вито','#ffd54a']];
const L=$('#lobby'),B={slots:'HOT',tumble:'NEW',roul:'3D',lucky:'3D',poker:'3D',dice:'3D',crash:'LIVE'};
L.innerHTML='<div class="jpb"><small>ПРОГРЕССИВНЫЙ ДЖЕКПОТ</small><b id="jpv"></b></div><h2>ВЫБИРАЙ ИГРУ</h2><div class="gg">'+G.map((g,i)=>`<div class="gc" data-t="${g[0]}" style="--c:${g[4]};--i:${i}"><em>${B[g[0]]||''}</em><i>${g[1]}</i><b>${g[2]}</b><span>${g[3]}</span></div>`).join('')+'</div><div class="tk"><div id="tkc"></div></div>';
L.onmousemove=e=>{const c=e.target.closest('.gc');if(!c)return;const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
  c.style.transform=`perspective(700px) rotateY(${x*18}deg) rotateX(${-y*18}deg) translateZ(14px)`;c.style.setProperty('--gx',x*100+50+'%');c.style.setProperty('--gy',y*100+50+'%')};
L.onmouseout=e=>{const c=e.target.closest('.gc');if(c&&!c.contains(e.relatedTarget))c.style.transform=''};
L.onclick=e=>{const c=e.target.closest('.gc');if(c)document.querySelector(`#tabs [data-t="${c.dataset.t}"]`).click()};

document.querySelector('.brand').onclick=()=>{sfx.click();document.querySelector('#tabs [data-t="lobby"]').click();scrollTo({top:0,behavior:'smooth'})};
$('#sh1').innerHTML=[...'GOLDEN MINION'].map((c,i)=>`<span style="animation-delay:${2+i*.07}s">${c==' '?'&nbsp;':c}</span>`).join('');

/* джекпот-счётчик и лента «живых» выигрышей (оформление, ненастоящие данные) */
let jv=1284930;const jel=$('#jpv');setInterval(()=>{jv+=Math.floor(Math.random()*37)+3;jel.innerHTML='<i class="cn"></i> '+jv.toLocaleString('ru')},120);
const NM=['Дядя Вито','Лола','Бобби','Нео','Мэверик','Сакура','Босс','Тень','Фортуна'],GM=['в Слотах','в Рулетке','в Ракетке','в Покере','в Костях','в Сладком взрыве','на Колесе удачи'];
const tk=Array.from({length:16},()=>`<span>🏆 ${NM[Math.random()*NM.length|0]} выиграл <b>${(500+Math.floor(Math.random()*90000)).toLocaleString('ru')}</b> ${GM[Math.random()*GM.length|0]}</span>`).join('');
$('#tkc').innerHTML=tk+tk;
/* летающие символы с параллаксом, частицы, свет за курсором */
const FL=['🍒','💎','7️⃣','🎲','♠️','🎰','🍀','👑','🔔','⭐','🃏','💰'];
FL.forEach((s,i)=>{const d=10+Math.random()*60,e=document.createElement('div');e.className='fl';e.style.cssText=`--x:${Math.random()*94}vw;--y:${Math.random()*90}vh;--d:${d}`;
  e.innerHTML=`<i style="font-size:${22+d*.7}px;filter:blur(${d<25?2:0}px);animation-duration:${5+Math.random()*6}s;animation-delay:-${Math.random()*6}s">${s}</i>`;document.body.appendChild(e)});
const cg=document.createElement('div');cg.id='cg';document.body.appendChild(cg);
let pr=0;addEventListener('pointermove',e=>{if(pr)return;pr=requestAnimationFrame(()=>{pr=0;document.body.style.setProperty('--mx',(e.clientX/innerWidth-.5)*2);document.body.style.setProperty('--my',(e.clientY/innerHeight-.5)*2);cg.style.transform=`translate3d(${e.clientX-250}px,${e.clientY-250}px,0)`})});
const pc=document.createElement('canvas');pc.id='pt';document.body.prepend(pc);const px=pc.getContext('2d'),PS=[];let PW,PH;
const rs=()=>{PW=pc.width=innerWidth;PH=pc.height=innerHeight};addEventListener('resize',rs);rs();
for(let i=0;i<(innerWidth<700?24:46);i++)PS.push({x:Math.random()*PW,y:Math.random()*PH,r:1+Math.random()*2.5,v:.15+Math.random()*.5,ph:Math.random()*6,c:['#ff2bd6','#19f0ff','#ffd54a'][i%3]});
(function f(){requestAnimationFrame(f);if(document.hidden)return;px.clearRect(0,0,PW,PH);px.globalCompositeOperation='lighter';
  PS.forEach(p=>{p.y-=p.v;p.ph+=.01;p.x+=Math.sin(p.ph)*.3;if(p.y<-10){p.y=PH+10;p.x=Math.random()*PW}px.globalAlpha=.55;px.fillStyle=p.c;px.shadowColor=p.c;px.shadowBlur=12;px.beginPath();px.arc(p.x,p.y,p.r,0,7);px.fill()});px.globalAlpha=1})();
})();

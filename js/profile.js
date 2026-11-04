/* Профиль: статистика по всем играм */
(()=>{const N={slots:'Слоты',tumble:'Сладкий взрыв',roul:'Рулетка',lucky:'Колесо удачи',bj:'Блэкджек',poker:'Покер',crash:'Ракетка',dice:'3D Кости'};
$('#profbtn').onclick=()=>{const s=S.st||{};let tn=0,tw=0,tv=0,bb=0;
  const rows=Object.keys(N).map(k=>{const o=s[k]||{n:0,w:0,v:0,b:0};tn+=o.n;tw+=o.w;tv+=o.v;bb=Math.max(bb,o.b);
    return `<tr><td>${N[k]}</td><td>${o.n}</td><td>${o.w}</td><td>${o.v}</td><td>${o.b}</td><td>${o.w?Math.round(o.v/o.w*100)+'%':'—'}</td></tr>`}).join('');
  $('#prof').innerHTML=`<div class="pbox"><h2>👤 ПРОФИЛЬ</h2><p>Баланс: <b>${Math.floor(S.bal)}</b> · Рекорд баланса: <b>${Math.floor(S.peak||S.bal)}</b> · Крупнейший выигрыш: <b>${bb}</b> · Долг: <b>${S.debt}</b></p>
  <table><tr><th>Игра</th><th>Раундов</th><th>Поставлено</th><th>Возвращено</th><th>Рекорд</th><th>Возврат</th></tr>${rows}<tr><th>Всего</th><th>${tn}</th><th>${tw}</th><th>${tv}</th><th>${bb}</th><th>${tw?Math.round(tv/tw*100)+'%':'—'}</th></tr></table>
  <button class="gold" id="pclose">Закрыть</button></div>`;
  $('#prof').hidden=false;$('#pclose').onclick=()=>$('#prof').hidden=true};
})();

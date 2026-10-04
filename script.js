var COLORS=["#ed1c24","#e6a800","#2e9e4f","#0a6fd6","#8e3bd6","#ff7a1a","#e0338f","#17a2a2"],ON=["#fff","#1b1220","#fff","#fff","#fff","#1b1220","#fff","#fff"],AV=["👩","👨","👦","👧","🐱","🐶","🦊","🐼"];
function ck(p){return (p.k||0)%COLORS.length}
var entered=0,lastLead=-2;
var KEY="uno-leaderboard-v1";
var state={players:[{n:"",p:0},{n:"",p:0},{n:"",p:0},{n:"",p:0}]};
try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&s.players&&s.players.length>0)state=s}catch(e){}
state.h=state.h||[];
state.players.forEach(function(p,i){if(["Mama","Father","Bohdan","Angelina"][i]===p.n)p.n=""});
state.players.forEach(function(p,i){if(p.k===undefined)p.k=i});
var cfg={sound:true,fx:true,bg:true,low:false,theme:"auto",chips:[10,20,50],scale:100,haptic:true,awake:false,snd:"pop",glass:true,gb:18,ga:14,gh:100};
try{var c0=JSON.parse(localStorage.getItem("uno-cfg-v1"));if(c0)for(var k0 in c0)cfg[k0]=c0[k0]}catch(e){}
function saveCfg(){try{localStorage.setItem("uno-cfg-v1",JSON.stringify(cfg))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
var wrap=document.getElementById("players"),cards=[];
function crown(){var v=state.players.map(function(p){return p.p}),m=cfg.low?Math.min.apply(null,v):Math.max.apply(null,v),any=v.some(function(x){return x!==0});
var li=any?v.indexOf(m):-1;if(li!==lastLead&&li>-1&&lastLead!==-2&&cfg.bg&&cards[li]){cards[li].classList.remove("tada");void cards[li].offsetWidth;cards[li].classList.add("tada")}lastLead=li;
cards.forEach(function(c,i){c.classList.toggle("lead",any&&v[i]===m)});strip()}
function render(){
wrap.innerHTML="";cards=[];
state.players.forEach(function(pl,i){
var c=document.createElement("div");c.className="card";c.style.setProperty("--c",COLORS[ck(pl)]);c.style.setProperty("--on",ON[ck(pl)]);if(i>=entered){c.classList.add("enter");c.style.animationDelay=((i-entered)*70)+"ms"}
c.innerHTML='<div class="crown">👑</div><span class="corner tl">+</span><span class="corner br">+</span>'+
'<div class="head"><button class="av" aria-label="Change avatar"></button><input class="name" aria-label="Name"><button class="rm" aria-label="Remove">✕</button></div>'+
'<div class="oval"><div class="score"></div></div>'+
'<div class="row"><input type="number" inputmode="numeric" placeholder="'+t("points")+'"><button class="add">'+t("add")+'</button></div>'+
chipsHtml();
var nm=c.querySelector(".name");nm.value=pl.n;nm.placeholder=t("player")+" "+(i+1);nm.oninput=function(){pl.n=nm.value;save();histUI()};
setAv(c.querySelector(".av"),pl.a||AV[ck(pl)]);c.querySelector(".av").onclick=function(){openPick(i)};
var rm=c.querySelector(".rm");if(state.players.length<3)rm.style.display="none";
rm.onclick=function(){if(!rm.dataset.a){rm.dataset.a=1;rm.textContent="🗑?";setTimeout(function(){rm.dataset.a="";rm.textContent="✕"},2500);return}
state.players.splice(i,1);state.h=state.h.filter(function(e){return e.i!==i}).map(function(e){return{i:e.i>i?e.i-1:e.i,v:e.v}});save();render();histUI();beep(250)};
var sc=c.querySelector(".score");var shown=pl.p,tk=0;function upd(){var from=shown,to=pl.p,t0=performance.now(),my=++tk;if(!cfg.bg||from===to){sc.textContent=to;shown=to;return}(function f(now){if(my!==tk)return;var k=Math.min(1,(now-t0)/380);shown=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));sc.textContent=shown;if(k<1)requestAnimationFrame(f)})(t0)}upd();
var inp=c.querySelector("input[type=number]");
function add(v){if(isNaN(v)||v===0)return;pl.p+=v;inp.value="";state.h.push({i:i,v:v});if(state.h.length>200)state.h.shift();save();beep(v>0?660:300);vib(v>0?15:[10,40,10]);histUI();
sc.classList.remove("pop");void sc.offsetWidth;sc.classList.add("pop");fl(c,v);burst(c,v);upd();crown()}
c.querySelector(".add").onclick=function(){add(parseInt(inp.value,10))};
inp.onkeydown=function(e){if(e.key==="Enter")add(parseInt(inp.value,10))};
c.querySelectorAll(".chip").forEach(function(b){b.onclick=function(){add(parseInt(b.dataset.v,10))}});
wrap.appendChild(c);cards.push(c);
});
var first0=entered===0;entered=state.players.length;if(state.players.length<12){var ap=document.createElement("button");ap.className="addp"+(first0?" enter":"");ap.textContent=t("addp");ap.onclick=function(){var u=state.players.map(function(p){return p.k}),k=0;while(u.indexOf(k)>-1)k++;state.players.push({n:"",p:0,k:k});save();render();beep(700);var cs=wrap.querySelectorAll(".card");cs[cs.length-1].querySelector(".name").focus()};wrap.appendChild(ap)}
crown();
}
function esc(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML}
document.getElementById("make").onclick=function(){
var l=state.players.map(function(p,i){return{n:p.n||t("player")+" "+(i+1),p:p.p,c:COLORS[ck(p)],a:p.a||AV[ck(p)]}}).sort(function(a,b){return cfg.low?a.p-b.p:b.p-a.p});
var order=l.length>=3?[1,0,2]:[1,0],HH=[230,175,130],h='<h2>🏆 '+t("lb")+'</h2><div class="podium">';
order.forEach(function(k){var x=l[k];h+='<div class="pc"><div class="pav">'+(k===0&&x.a.indexOf("data:")!==0?"👑":avH(x.a))+'</div><div class="pn">'+esc(x.n)+'</div><div class="pp" data-v="'+x.p+'">0 '+t("pts")+'</div><div class="blk" data-h="'+HH[k]+'" style="--c:'+x.c+'">'+(k+1)+'</div></div>'});
h+='</div>';
l.slice(3).forEach(function(x,j){h+='<div class="fourth" style="--n:'+j+'"><span class="r">'+(j+4)+'</span><span class="n">'+avH(x.a)+' '+esc(x.n)+'</span><span class="p">'+x.p+'</span></div>'});
h+='<div style="text-align:center;margin-top:14px"><button class="back" id="copy">📋 '+t("copy")+'</button></div>';
var b=document.getElementById("board");b.className="board show";b.innerHTML=h;
var cp=document.getElementById("copy");cp.onclick=function(){var tx="🃏 UNO\n"+l.map(function(x,i){return (i+1)+". "+x.n+" — "+x.p}).join("\n");try{navigator.clipboard.writeText(tx).then(function(){cp.textContent="✅ "+t("copied")},function(){cp.textContent=t("nocopy")})}catch(e){cp.textContent=t("nocopy")}};
countUp(b);setTimeout(function(){b.querySelectorAll(".blk").forEach(function(e){e.style.transitionDelay=((3-parseInt(e.textContent,10))*.28)+"s";e.style.height=e.dataset.h*0.85+"px"})},80);
b.scrollIntoView({behavior:"smooth",block:"center"});if(cfg.fx)confetti();fanfare();vib([30,60,30,60,90]);
};
var rb=document.getElementById("reset"),armed=false;
rb.onclick=function(){
if(!armed){armed=true;rb.textContent=t("tap");setTimeout(function(){armed=false;rb.textContent=t("reset")},2500);return}
state.players.forEach(function(p){p.p=0});state.h=[];save();render();histUI();document.getElementById("board").className="board";armed=false;rb.textContent=t("reset")};
function confetti(){
var cv=document.getElementById("fx"),x=cv.getContext("2d");cv.width=innerWidth;cv.height=innerHeight;
var P=[],i;for(i=0;i<140;i++)P.push({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.5,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,s:5+Math.random()*7,c:COLORS[i%4]==="#e6a800"?"#f7c600":COLORS[i%4],r:Math.random()*6});
var t=0;(function f(){x.clearRect(0,0,cv.width,cv.height);P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.r+=.15;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});
if(++t<170)requestAnimationFrame(f);else x.clearRect(0,0,cv.width,cv.height)})();
}
function fl(c,v){var e=document.createElement("span");e.className="fl";e.textContent=(v>0?"+":"")+v;c.appendChild(e);setTimeout(function(){e.remove()},1000)}
function countUp(b){var t0=performance.now();var els=b.querySelectorAll(".pp");(function f(now){var k=Math.min(1,(now-t0)/1100);els.forEach(function(e){e.textContent=Math.round(e.dataset.v*(1-Math.pow(1-k,3)))+" "+t("pts")});if(k<1)requestAnimationFrame(f)})(t0)}
(function(){var cv=document.getElementById("bg"),x=cv.getContext("2d"),P=[],W,H,i,last=0,C=["#ed1c24","#f7c600","#2e9e4f","#0a6fd6"],S=["0","1","2","3","4","5","6","7","8","9","+2","⇄","⛔"],SP=[];
function mk(c,t){var o=document.createElement("canvas");o.width=64;o.height=96;var g=o.getContext("2d");g.fillStyle=c;g.strokeStyle="#fff";g.lineWidth=4;g.beginPath();(g.roundRect||g.rect).call(g,4,4,56,88,10);g.fill();g.stroke();g.fillStyle="#fff";g.font="28px 'Lilita One','Arial Black',sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText(t,32,50);return o}
for(i=0;i<12;i++)SP.push(mk(C[i%4],S[i%S.length]));
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener("resize",rs);
for(i=0;i<(innerWidth<600?7:12);i++)P.push({x:Math.random()*W,y:Math.random()*H,s:.6+Math.random()*.8,v:.4+Math.random()*.9,r:Math.random()*6,w:(Math.random()-.5)*.02,k:i%12});
function f(t){requestAnimationFrame(f);if(document.hidden||document.body.classList.contains("calm")||t-last<33)return;last=t;x.clearRect(0,0,W,H);x.globalAlpha=.3;
for(var j=0;j<P.length;j++){var p=P[j];p.y+=p.v;p.r+=p.w;if(p.y>H+90){p.y=-90;p.x=Math.random()*W}var c=Math.cos(p.r)*p.s,n=Math.sin(p.r)*p.s;x.setTransform(c,n,-n,c,p.x,p.y);x.drawImage(SP[p.k],-32,-48)}
x.setTransform(1,0,0,1,0,0)}
requestAnimationFrame(f)})();
var AVL=["👩","👨","👦","👧","👵","👴","🧒","🧑","🐱","🐶","🦊","🐼","🦁","🐸","🤖","👑"];
function chipsHtml(){return '<div class="chips">'+cfg.chips.map(function(v){return '<button class="chip" data-v="'+v+'">+'+v+'</button>'}).join("")+'<button class="chip neg" data-v="-'+cfg.chips[0]+'">−'+cfg.chips[0]+'</button></div>'}
var AC;function beep(f,d,t){if(!cfg.sound)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain();d=d||.15;o.type=t||({soft:"sine",arcade:"square",pop:"triangle"})[cfg.snd||"pop"];o.frequency.value=f;g.gain.setValueAtTime(.16,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function fanfare(){[523,659,784,1047].forEach(function(f,i){setTimeout(function(){beep(f,.25,"square")},i*140)})}
function histUI(){var ul=document.getElementById("hl");if(!ul)return;ul.innerHTML="";document.getElementById("hc").textContent=state.h.length;
if(!state.h.length){ul.innerHTML='<li class="empty">'+t("none")+'</li>';return}
state.h.slice(-30).reverse().forEach(function(e){var li=document.createElement("li"),n=document.createElement("span"),b=document.createElement("b");li.style.setProperty("--c",COLORS[ck(state.players[e.i])]);li.appendChild(document.createElement("i"));n.textContent=state.players[e.i].n||t("player")+" "+(e.i+1);b.textContent=(e.v>0?"+":"")+e.v;li.appendChild(n);li.appendChild(b);ul.appendChild(li)})}
function applyCfg(){var r=document.documentElement,g=cfg.glass;var dk=cfg.theme==="auto"?matchMedia("(prefers-color-scheme:dark)").matches:cfg.theme==="dark";r.setAttribute("data-mode",dk?"dark":"light");r.style.setProperty("--ui",cfg.scale/100);r.style.setProperty("--gb",(g?cfg.gb:0)+"px");r.style.setProperty("--ga",g?cfg.ga/100:.08);r.style.setProperty("--gh",g?cfg.gh/100:.25);if(cfg.skin&&cfg.skin!=="classic")r.setAttribute("data-skin",cfg.skin);else r.removeAttribute("data-skin");if(cfg.theme==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",cfg.theme);document.body.classList.toggle("calm",!cfg.bg)}
var modal=document.getElementById("modal");
function syncSet(){["sound","fx","bg","low","haptic","awake"].forEach(function(k){document.getElementById("s-"+k).checked=!!cfg[k]});
document.querySelectorAll("#s-theme button").forEach(function(b){b.classList.toggle("on",b.dataset.t===cfg.theme)});
for(var i=0;i<3;i++)document.getElementById("q"+i).value=cfg.chips[i]}
var SL=[["scale","s-scale","%"],["gb","s-gb","px"],["ga","s-ga","%"],["gh","s-gh","%"]];
function syncG(){document.getElementById("s-glass").checked=!!cfg.glass;SL.forEach(function(a){document.getElementById(a[1]).value=cfg[a[0]];document.getElementById("v-"+a[1].slice(2)).textContent=cfg[a[0]]+a[2]})}
SL.forEach(function(a){var el=document.getElementById(a[1]);el.oninput=function(){cfg[a[0]]=+this.value;document.getElementById("v-"+a[1].slice(2)).textContent=this.value+a[2];applyCfg()};el.onchange=saveCfg});
document.getElementById("s-glass").onchange=function(){cfg.glass=this.checked;saveCfg();applyCfg();beep(600)};
function openSet(){syncSet();syncX();syncG();modal.hidden=false}
["sound","fx","bg","low","haptic","awake"].forEach(function(k){document.getElementById("s-"+k).onchange=function(){cfg[k]=this.checked;saveCfg();applyCfg();crown();if(k==="awake")wake();beep(600)}});
document.querySelectorAll("#s-theme button").forEach(function(b){b.onclick=function(){cfg.theme=b.dataset.t;saveCfg();applyCfg();syncSet()}});
[0,1,2].forEach(function(i){document.getElementById("q"+i).onchange=function(){var v=parseInt(this.value,10);if(v>0){cfg.chips[i]=v;saveCfg();render()}}});
document.getElementById("s-clear").onclick=function(){state.players.forEach(function(p,i){p.n="";delete p.a});save();render();histUI();this.textContent="✅ Done"};
document.getElementById("s-close").onclick=function(){modal.hidden=true};
modal.onclick=function(e){if(e.target===modal)modal.hidden=true};
document.addEventListener("keydown",function(e){if(e.key==="Escape"){modal.hidden=true;pick.hidden=true}});
document.getElementById("gear1").onclick=openSet;document.getElementById("gear2").onclick=openSet;
document.getElementById("undo").onclick=function(){var e=state.h.pop();if(!e)return;state.players[e.i].p-=e.v;save();render();histUI();beep(250)};
var T={},K=["sub", "tag", "play", "settings", "menu", "undo", "hist", "none", "points", "add", "make", "reset", "tap", "lb", "pts", "copy", "copied", "nocopy", "player", "sound", "fx", "anim", "low", "theme", "style", "auto", "light", "dark", "quick", "clear", "done", "lang", "pick", "own", "use", "photo", "def"],LD={"en": ["Leaderboard", "Add points, then crown the champion", "▶ PLAY", "⚙️ Settings", "← Menu", "↩ Undo", "📜 History", "No points yet", "Points", "Add", "🏆 Make leaderboard", "Reset", "Tap again!", "Leaderboard", "pts", "Copy results", "Copied!", "Can't copy", "Player", "🔊 Sound", "🎉 Confetti", "✨ Animations", "🏆 Lowest score wins", "🌓 Mode", "🎨 Style", "Auto", "Light", "Dark", "⚡ Quick buttons", "Reset names & icons", "Done", "🌐 Language", "Choose icon", "Type any emoji", "Use", "📷 Photo", "Default"], "uk": ["Таблиця лідерів", "Додавайте очки та визначайте чемпіона", "▶ ГРАТИ", "⚙️ Налаштування", "← Меню", "↩ Скасувати", "📜 Історія", "Ще немає очок", "Очки", "Додати", "🏆 Створити таблицю", "Скинути", "Натисни ще раз!", "Таблиця лідерів", "очк.", "Копіювати результати", "Скопійовано!", "Не вдалося", "Гравець", "🔊 Звук", "🎉 Конфеті", "✨ Анімації", "🏆 Перемагає найменше", "🌓 Режим", "🎨 Стиль", "Авто", "Світла", "Темна", "⚡ Швидкі кнопки", "Скинути імена та іконки", "Готово", "🌐 Мова", "Обери іконку", "Введи будь-яке емодзі", "Ок", "📷 Фото", "Стандарт"], "de": ["Rangliste", "Punkte eintragen und den Champion krönen", "▶ SPIELEN", "⚙️ Einstellungen", "← Menü", "↩ Rückgängig", "📜 Verlauf", "Noch keine Punkte", "Punkte", "Hinzufügen", "🏆 Rangliste erstellen", "Zurücksetzen", "Nochmal tippen!", "Rangliste", "Pkt.", "Ergebnis kopieren", "Kopiert!", "Nicht möglich", "Spieler", "🔊 Ton", "🎉 Konfetti", "✨ Animationen", "🏆 Niedrigste Punktzahl gewinnt", "🌓 Modus", "🎨 Stil", "Auto", "Hell", "Dunkel", "⚡ Schnelltasten", "Namen & Symbole zurücksetzen", "Fertig", "🌐 Sprache", "Symbol wählen", "Beliebiges Emoji eingeben", "OK", "📷 Foto", "Standard"], "ru": ["Таблица лидеров", "Добавляйте очки и определите чемпиона", "▶ ИГРАТЬ", "⚙️ Настройки", "← Меню", "↩ Отменить", "📜 История", "Очков пока нет", "Очки", "Добавить", "🏆 Создать таблицу", "Сбросить", "Нажми ещё раз!", "Таблица лидеров", "очк.", "Копировать результаты", "Скопировано!", "Не удалось", "Игрок", "🔊 Звук", "🎉 Конфетти", "✨ Анимации", "🏆 Побеждает наименьший счёт", "🌓 Режим", "🎨 Стиль", "Авто", "Светлая", "Тёмная", "⚡ Быстрые кнопки", "Сбросить имена и значки", "Готово", "🌐 Язык", "Выбери значок", "Введи любой эмодзи", "ОК", "📷 Фото", "По умолчанию"]};
Object.keys(LD).forEach(function(l){T[l]={};K.forEach(function(k,i){T[l][k]=LD[l][i]})});
var X={en:{addp:"＋ Add player",scale:"📐 Interface size",glass:"🫧 Liquid Glass",blur:"Blur",opac:"Transparency",shine:"Shine",haptic:"📳 Vibration",awake:"☀️ Keep screen on",snd:"🎵 Sound style",starts:"goes first!"},uk:{addp:"＋ Додати гравця",scale:"📐 Розмір інтерфейсу",glass:"🫧 Рідке скло",blur:"Розмиття",opac:"Прозорість",shine:"Блиск",haptic:"📳 Вібрація",awake:"☀️ Не гасити екран",snd:"🎵 Стиль звуку",starts:"починає!"},de:{addp:"＋ Spieler hinzufügen",scale:"📐 Größe der Oberfläche",glass:"🫧 Liquid Glass",blur:"Unschärfe",opac:"Transparenz",shine:"Glanz",haptic:"📳 Vibration",awake:"☀️ Bildschirm anlassen",snd:"🎵 Klangstil",starts:"fängt an!"},ru:{addp:"＋ Добавить игрока",scale:"📐 Размер интерфейса",glass:"🫧 Жидкое стекло",blur:"Размытие",opac:"Прозрачность",shine:"Блик",haptic:"📳 Вибрация",awake:"☀️ Не гасить экран",snd:"🎵 Стиль звука",starts:"начинает!"}};
Object.keys(X).forEach(function(l){Object.assign(T[l],X[l])});
function strip(){var el=document.getElementById("strip");if(!el)return;var old={};Array.from(el.children).forEach(function(ch){old[ch.dataset.i]=ch.getBoundingClientRect()});el.innerHTML="";
state.players.map(function(p,i){return{p:p,i:i}}).sort(function(a,b){return cfg.low?a.p.p-b.p.p:b.p.p-a.p.p}).forEach(function(o,r){
var c=document.createElement("div"),d=document.createElement("span"),n=document.createElement("span"),b=document.createElement("b");
c.dataset.i=o.i;c.className="chipx"+(r===0&&o.p.p!==0?" first":"");c.style.setProperty("--c",COLORS[ck(o.p)]);d.className="d";setAv(d,o.p.a||AV[ck(o.p)]);
n.textContent=(r===0&&o.p.p!==0?"👑 ":"")+(o.p.n||t("player")+" "+(o.i+1));b.textContent=o.p.p;
c.appendChild(d);c.appendChild(n);c.appendChild(b);el.appendChild(c)});
if(cfg.bg){var z=cfg.scale/100;Array.from(el.children).forEach(function(ch){var q=old[ch.dataset.i];if(!q)return;var n=ch.getBoundingClientRect(),dx=(q.left-n.left)/z,dy=(q.top-n.top)/z;if(dx||dy)ch.animate([{transform:"translate("+dx+"px,"+dy+"px)"},{transform:"none"}],{duration:380,easing:"cubic-bezier(.2,1.2,.4,1)"})})}}
var GUESS=(navigator.language||"en").slice(0,2);
function t(k){return (T[cfg.lang||GUESS]||T.en)[k]||T.en[k]||k}
function applyLang(){document.querySelectorAll("[data-i]").forEach(function(e){e.textContent=t(e.dataset.i)});document.querySelectorAll("[data-ip]").forEach(function(e){e.placeholder=t(e.dataset.ip)});document.documentElement.lang=cfg.lang||GUESS}
function setAv(el,a){if(a.indexOf("data:")===0){el.textContent="";el.style.backgroundImage="url("+a+")"}else{el.style.backgroundImage="";el.textContent=a}}
function avH(a){return a.indexOf("data:")===0?'<img class="pim" alt="" src="'+a+'">':a}
var pickI=0,pick=document.getElementById("pick"),EM="👩 👨 👦 👧 👵 👴 🧒 🧑 👶 🧔 👸 🤴 🦸 🧙 🧛 🧜 🧚 🥷 🤠 🥳 😎 🤓 😺 🐱 🐶 🦊 🐼 🦁 🐯 🐸 🐵 🐰 🐻 🐨 🐷 🐮 🦄 🐲 🐧 🦉 🐙 🦖 🐢 🤖 👽 👻 💀 🎃 ⚽ 🎮 🚀 🌈 🔥 ⭐ 🍕 🍔 🍩 🍓 🍉 🌵 🎸 👑 💎".split(" ");
function openPick(i){pickI=i;pick.hidden=false}
function setAvatar(a){var p=state.players[pickI];if(a)p.a=a;else delete p.a;save();render();pick.hidden=true;beep(520)}
EM.forEach(function(e){var b=document.createElement("button");b.className="eb";b.textContent=e;b.onclick=function(){setAvatar(e)};document.getElementById("eg").appendChild(b)});
document.getElementById("ownb").onclick=function(){var v=document.getElementById("own").value.trim();if(!v)return;var f=window.Intl&&Intl.Segmenter?Array.from(new Intl.Segmenter().segment(v))[0].segment:Array.from(v)[0];document.getElementById("own").value="";setAvatar(f)};
document.getElementById("noph").onclick=function(){setAvatar(null)};
document.getElementById("photo").onclick=function(){document.getElementById("file").click()};
document.getElementById("file").onchange=function(){var f=this.files[0];this.value="";if(!f)return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement("canvas");c.width=c.height=96;var m=Math.min(im.width,im.height);c.getContext("2d").drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,96,96);setAvatar(c.toDataURL("image/jpeg",.75))};im.src=r.result};r.readAsDataURL(f)};
document.getElementById("p-close").onclick=function(){pick.hidden=true};
pick.onclick=function(e){if(e.target===pick)pick.hidden=true};
var SW=[["classic", "#ed1c24", "#0a6fd6"], ["ocean", "#0a6fd6", "#1fc8c8"], ["sunset", "#ff7a3d", "#ff3d81"], ["forest", "#2e9e4f", "#b6e03d"], ["neon", "#ff2bd6", "#19f0ff"], ["gold", "#f7c600", "#ed1c24"], ["midnight", "#3a3aff", "#7a1fff"], ["candy", "#ff8fc7", "#8fd3ff"], ["aurora", "#19f0a5", "#7a5cff"], ["lava", "#ff3b1f", "#ff9d00"], ["lavender", "#9b6dff", "#ff7ad9"], ["cyber", "#00f0ff", "#ffe600"], ["coffee", "#c8873a", "#8a5a2b"], ["space", "#5b3bff", "#00c2ff"], ["sakura", "#ff8fb1", "#ffc2d6"], ["mint", "#3ddc97", "#7fe0ff"], ["ice", "#5aa9ff", "#a8d8ff"]];
function syncX(){document.getElementById("s-snd").value=cfg.snd||"pop";document.getElementById("s-lang").value=cfg.lang||(T[GUESS]?GUESS:"en");document.querySelectorAll("#s-skin .sw").forEach(function(b){b.classList.toggle("on",b.dataset.k===(cfg.skin||"classic"))})}
SW.forEach(function(w){var b=document.createElement("button");b.className="sw";b.dataset.k=w[0];b.setAttribute("aria-label",w[0]);b.style.background="linear-gradient(135deg,"+w[1]+","+w[2]+")";b.onclick=function(){cfg.skin=w[0];saveCfg();applyCfg();syncX();beep(600)};document.getElementById("s-skin").appendChild(b)});
document.getElementById("s-lang").onchange=function(){cfg.lang=this.value;saveCfg();applyLang();render();histUI();document.getElementById("board").className="board"};
function vib(x){if(cfg.haptic&&navigator.vibrate)try{navigator.vibrate(x)}catch(e){}}
var WL=null;function wake(){try{if(cfg.awake&&navigator.wakeLock){navigator.wakeLock.request("screen").then(function(l){WL=l}).catch(function(){})}else if(WL){WL.release();WL=null}}catch(e){}}
document.addEventListener("visibilitychange",function(){if(!document.hidden&&cfg.awake)wake()});
try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",function(){applyCfg()})}catch(e){}
document.getElementById("s-snd").onchange=function(){cfg.snd=this.value;saveCfg();beep(660)};
function burst(c,v){if(!cfg.bg)return;var e=v>0?"✨":"💥";for(var i=0;i<7;i++){var q=document.createElement("i"),a=Math.random()*6.28,r=50+Math.random()*60;q.className="sp";q.textContent=e;q.style.setProperty("--dx",Math.cos(a)*r+"px");q.style.setProperty("--dy",Math.sin(a)*r+"px");c.appendChild(q);setTimeout(function(x){x.remove()},800,q)}}
var tt=0;function toast(m){var e=document.getElementById("toast");e.textContent=m;e.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){e.classList.remove("on")},2600)}
var rolling=0;
document.getElementById("rand").onclick=function(){if(rolling)return;rolling=1;var n=state.players.length,pk=Math.floor(Math.random()*n),steps=n*3+pk+1,k=0,d=70;
(function go(){cards.forEach(function(c){c.classList.remove("pick")});var cur=k%n;cards[cur].classList.add("pick");beep(380+cur*50,.06);vib(8);
if(k>=steps-1){rolling=0;toast("🎲 "+(state.players[cur].n||t("player")+" "+(cur+1))+" "+t("starts"));cards[cur].scrollIntoView({block:"nearest",behavior:"smooth"});fanfare();if(cfg.fx)confetti();setTimeout(function(){cards[cur].classList.remove("pick")},2600);return}
k++;d*=n>6?1.05:1.09;setTimeout(go,d)})()};
var menu=document.getElementById("menu"),game=document.getElementById("game"),portal=document.getElementById("portal");
function warp(toGame){
portal.className="in";if(toGame)menu.classList.add("leave");
setTimeout(function(){if(toGame){entered=0;render()}menu.hidden=toGame;game.hidden=!toGame;menu.classList.remove("leave");scrollTo(0,0);
portal.className="out";setTimeout(function(){portal.className=""},720)},720)}
document.getElementById("play").onclick=function(){beep(520,.2);warp(true)};
document.getElementById("back").onclick=function(){warp(false)};
render();histUI();applyCfg();applyLang();wake();

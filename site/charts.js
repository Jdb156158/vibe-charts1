// Chart drawing functions adapted directly from film/index.html.
const canvas=document.querySelector('#chart'),g=canvas.getContext('2d');
const O='#ef4e24',P='#f2efe9',N='#111317',C=['#ef4e24','#eeaa70','#477c79','#bab6aa'];
let dark=false,mode=0,selection=[2,2,0,0,61],showPrevious=true,started=0,raf=0,elapsed=2,ready=false;
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-Math.pow(1-clamp(x),4);
function text(s,x,y,size=28,color=dark?'#f4f0e7':'#191b1d',align='left',serif=false,weight=500){g.fillStyle=color;g.font=serif?`italic ${size}px Georgia`:`${weight} ${size}px SC`;g.textAlign=align;g.textBaseline='middle';g.fillText(s,x,y)}
function rr(x,y,w,h,r=20,fill){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill()}}
function line(x,y,x2,y2,color='#8884',w=1){g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.strokeStyle=color;g.lineWidth=w;g.stroke()}
function circle(x,y,r,color){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=color;g.fill()}
function pill(label,x,y,w=140,active=false){rr(x,y,w,44,22,active?O:dark?'#272a30':'#f2f0eb');text(label,x+w/2,y+22,20,active?'white':dark?'#ddd':'#6d6b65','center')}
function shell(title,value,unit,u){g.save();g.shadowColor=dark?'#0005':'#241e1318';g.shadowBlur=38;g.shadowOffsetY=22;rr(0,0,850,660,28,dark?'#1b1e24':'#fff');g.restore();text(title,42,47,25,dark?'#b2b5be':'#85817a');text(value,42,115,64,undefined,'left',false,700);text(unit,Math.max(190,42+g.measureText(value).width+18),120,22,dark?'#9599a2':'#969188');pill('H1 2026',655,30,150);line(42,171,808,171,dark?'#ffffff12':'#17171712')}
function tooltip(label,x,y,w=150){rr(x,y,w,52,12,dark?'#f5f0e7':'#1d2025');text(label,x+w/2,y+26,22,dark?'#111317':'#fff','center')}
function bars(u,mini=false){let p=ease(u/.85);if(mini)p=.65+.35*ease(u);shell('ORDERS / 订单',Math.round(210*p).toString(),'次',u);let vals=[18,28,22,38,46,58],focus=u>.65?selection[0]:-1;for(let j=0;j<4;j++){let y=490-j*85;line(95,y,794,y,dark?'#ffffff10':'#1717170b');text(String(j*20),69,y,18,dark?'#777d88':'#a29e96','right')}
 vals.forEach((v,i)=>{let x=119+i*112;rr(x,230,64,260,30,dark?'#ffffff0a':'#f0eeea');let h=v/60*255*ease((u-i*.055)/.7);if(mini)h=v/60*255*p;rr(x,490-h,64,h,Math.min(30,h/2),focus<0||focus===i?O:dark?'#96523c':'#f4baa2');text('0'+(i+1),x+32,530,20,dark?'#b5b5b5':'#aaa39a','center');if(i===focus)tooltip(v+' 次',x-26,490-h-68,118)});line(42,571,808,571,dark?'#ffffff12':'#17171712');text('Jan — Jun',42,613,21,dark?'#9b9da3':'#8a857d');text('六个月 · 同一刻度',808,613,21,dark?'#b8bac0':'#67635d','right')}
function trend(u){const vals=[12,22,18,32,26,46],p=ease(u/.9),pts=vals.map((v,i)=>[110+i*132,510-v/60*300]);shell('VISITS / 访问量',(46*p).toFixed(1)+'K','最新',u);[0,20,40,60].forEach(v=>{const y=510-v/60*300;line(90,y,787,y,'#ffffff12');text(v+'K',72,y,18,'#7c8391','right')});g.save();g.beginPath();g.rect(90,190,710*p,360);g.clip();let grad=g.createLinearGradient(0,230,0,520);grad.addColorStop(0,'#ef4e2455');grad.addColorStop(1,'#ef4e2400');g.beginPath();g.moveTo(pts[0][0],510);pts.forEach(a=>g.lineTo(...a));g.lineTo(pts[5][0],510);g.closePath();g.fillStyle=grad;g.fill();g.beginPath();pts.forEach((a,i)=>i?g.lineTo(...a):g.moveTo(...a));g.strokeStyle=O;g.lineWidth=6;g.lineJoin='round';g.stroke();g.restore();let focus=selection[1];if(u>.6){let[x,y]=pts[focus];line(x,190,x,515,'#ffffff35',2);circle(x,y,14,'#ef4e2444');circle(x,y,6,'#ff744b');tooltip(vals[focus]+'K',Math.min(660,x-65),Math.max(185,y-78),130)}pts.forEach(([x],i)=>text('0'+(i+1),x,548,20,'#8a909c','center'));text('逐点聚焦 · 数值跟随',42,613,23,'#adb3bd');text('TREND ↗',808,613,22,'#ec8c6b','right')}
function share(u){let p=ease(u/.8),vals=[42,28,18,12],focus=selection[2];shell('SOURCES / 流量来源','100','%',u);let angle=-Math.PI/2;vals.forEach((v,i)=>{let end=angle+v/100*Math.PI*2;g.beginPath();g.arc(275,400,156,angle+.035,Math.max(angle+.036,angle+(end-angle)*p-.035));g.strokeStyle=C[i];g.lineWidth=i===focus?48:37;g.globalAlpha=i===focus?1:.55;g.stroke();g.globalAlpha=1;angle=end});text(Math.round(vals[focus]*p)+'%',275,395,69,undefined,'center',false,700);text(['直接访问','自然搜索','社交媒体','其他来源'][focus],275,451,23,dark?'#a5a5a5':'#8a857d','center');['直接访问','自然搜索','社交媒体','其他来源'].forEach((s,i)=>{let y=277+i*75;if(i===focus)rr(506,y-25,295,55,12,'#f3efe8');circle(531,y,6,C[i]);text(s,552,y,23,'#6f6b64');text(vals[i]+'%',772,y,25,i===focus?O:'#8f8a82','right',false,700)});text('聚焦一项 · 看清构成',42,613,23,'#8a857d');text('42 + 28 + 18 + 12 = 100%',808,613,20,'#8a857d','right')}
function radar(u){let p=ease(u/.7),cx=322,cy=410,r=165,vs=[82,66,90,72,88],old=[62,76,58,88,52],labs=['效率','稳定','体验','覆盖','响应'];shell('SCORE / 多维表现',Math.round(80*p).toString(),'/ 100',u);function pt(i,v){let a=i*Math.PI*2/5-Math.PI/2;return[cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v]}for(let k=1;k<=4;k++){g.beginPath();for(let i=0;i<5;i++){let a=pt(i,k/4);i?g.lineTo(...a):g.moveTo(...a)}g.closePath();g.strokeStyle='#ffffff18';g.lineWidth=1;g.stroke()}for(let i=0;i<5;i++){let a=pt(i,1);line(cx,cy,...a,'#ffffff18');let b=pt(i,1.2);text(labs[i],...b,21,'#a7adb8','center')}
 for(let j=0;j<2;j++){if(j===0&&!showPrevious)continue;let data=j?vs:old;g.beginPath();data.forEach((v,i)=>{let a=pt(i,v/100*p);i?g.lineTo(...a):g.moveTo(...a)});g.closePath();g.fillStyle=j?'#ef4e242f':'#477c7916';g.fill();g.strokeStyle=j?O:'#72a5a1';g.lineWidth=j?4:2;g.stroke();if(j)data.forEach((v,i)=>circle(...pt(i,v/100*p),5,O))}text('本期',607,302,24,'#f2eee6');line(560,302,590,302,O,5);if(showPrevious){text('上期',607,350,24,'#9fa7b4');line(560,350,590,350,'#72a5a1',3);}text('80',635,440,65,'#f4f0e7','center',false,700);text('综合表现',635,493,22,'#9199a7','center');text('叠加轮廓 · 对比长短板',42,613,23,'#adb3bd')}
function heat(u){let p=ease(u/.9);shell('ACTIVITY / 活跃分布','14','周',u);let colors=['#f0eeea','#f9dac7','#f5b18a','#f08050',O];for(let row=0;row<7;row++){text(['一','二','三','四','五','六','日'][row],64,239+row*43,18,'#aaa39a','center');for(let col=0;col<14;col++){let v=(row*11+col*7+col*row)%20;let q=clamp((u-col*.035-row*.02)/.32);rr(94+col*49,220+row*43,37,33,6,colors[Math.floor(v/4.01)*q|0]);}}let col=selection[4]%14,row=Math.floor(selection[4]/14),v=(row*11+col*7+col*row)%20,x=94+col*49,y=220+row*43;if(u>.85){g.strokeStyle='#222';g.lineWidth=3;rr(x-3,y-3,43,39,8);g.stroke();tooltip('活跃 '+v+' 次',Math.min(673,Math.max(42,x-45)),y-72,135)}text('浅',94,567,20,'#aaa39a');colors.forEach((c,i)=>rr(132+i*29,554,22,22,5,c));text('深',291,567,20,'#aaa39a');text('颜色越深 · 活跃越多',42,613,23,'#8a857d');text('14 周记录',808,613,21,'#8a857d','right')}

const charts=[bars,trend,share,radar,heat];
const info=[
 ['COMPARE','Bars','柱状比大小','渐次生长，重点突出。','滑过柱条，聚焦一个月份。','同一刻度，从零比较。','柱状图，使用左右方向键查看六个月的订单数量'],
 ['CHANGE','Trend','折线看趋势','指针滑过，数值跟随。','沿折线移动，读出每个时间点。','位置变化，呈现走势。','折线图，使用左右方向键查看六个月的访问量'],
 ['COMPOSITION','Share','环形看占比','展开构成，聚焦一项。','触碰圆环或右侧图例，切换来源。','42 + 28 + 18 + 12 = 100%。','环形图，使用左右方向键查看四种流量来源'],
 ['DIMENSIONS','Radar','雷达比维度','轮廓叠加，差异显现。','开关上期对比，看清各维度差异。','每个维度统一为 0–100 分。','雷达图，按回车或空格开关上期对比'],
 ['DENSITY','Heatmap','热力看密度','由浅入深，热点浮现。','滑过或点按格子，查看当天次数。','颜色越深，活跃次数越多。','热力图，使用上下左右方向键浏览十四周的活跃次数']
];
function readout(){
 let s='';
 if(mode===0)s=['一','二','三','四','五','六'][selection[0]]+'月 · '+[18,28,22,38,46,58][selection[0]]+' 次订单';
 if(mode===1)s=['一','二','三','四','五','六'][selection[1]]+'月 · '+[12,22,18,32,26,46][selection[1]]+'K 访问';
 if(mode===2)s=['直接访问','自然搜索','社交媒体','其他来源'][selection[2]]+' · '+[42,28,18,12][selection[2]]+'%';
 if(mode===3)s=showPrevious?'本期 / 上期 · 两个轮廓对比':'仅显示本期 · 综合表现 80 / 100';
 if(mode===4){let col=selection[4]%14,row=Math.floor(selection[4]/14);s='第 '+(col+1)+' 周 · 周'+['一','二','三','四','五','六','日'][row]+' · '+((row*11+col*7+col*row)%20)+' 次';}
 const target=document.querySelector('#readout');if(target.textContent!==s)target.textContent=s;
}
function draw(u=elapsed){if(!ready)return;g.clearRect(0,0,1020,800);dark=mode===1||mode===3;g.save();g.translate(85,70);charts[mode](u);g.restore();readout();}
function animate(now){elapsed=Math.min(2,(now-started)/1000);draw();if(elapsed<2)raf=requestAnimationFrame(animate);else raf=0;}
function replay(){cancelAnimationFrame(raf);if(matchMedia('(prefers-reduced-motion: reduce)').matches){elapsed=2;draw();return;}started=performance.now();raf=requestAnimationFrame(animate);}
function setMode(value){mode=value;document.querySelectorAll('[role=tab]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===mode));b.tabIndex=i===mode?0:-1;});document.querySelector('#chart-panel').setAttribute('aria-labelledby','tab-'+mode);let d=info[mode];['kicker','chart-title','chart-subtitle','description','instruction','data-note'].forEach((id,i)=>document.getElementById(id).textContent=d[i]);canvas.setAttribute('aria-label',d[6]);document.querySelector('.lab').classList.toggle('is-dark',mode===1||mode===3);document.querySelector('#compare').hidden=mode!==3;document.querySelector('#previous').hidden=mode===3;document.querySelector('#next').hidden=mode===3;replay();readout();}
function update(){draw();}
function step(delta){if(mode===3)return;const n=[6,6,4,1,98][mode];selection[mode]=(selection[mode]+delta+n)%n;update();}
function compare(){showPrevious=!showPrevious;let b=document.querySelector('#compare');b.setAttribute('aria-pressed',String(showPrevious));b.textContent='上期对比：'+(showPrevious?'开':'关');update();}
function point(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*1020/r.width-85,y=(e.clientY-r.top)*800/r.height-70;if(x<0||x>850||y<170||y>575)return;
 if(mode===0)selection[0]=Math.max(0,Math.min(5,Math.round((x-151)/112)));
 if(mode===1)selection[1]=Math.max(0,Math.min(5,Math.round((x-110)/132)));
 if(mode===2){if(x>500&&y>250&&y<530)selection[2]=Math.min(3,Math.max(0,Math.round((y-277)/75)));else{let dx=x-275,dy=y-400,r=Math.hypot(dx,dy);if(r<90||r>195)return;let a=(Math.atan2(dy,dx)+Math.PI/2+Math.PI*2)%(Math.PI*2)/(Math.PI*2);selection[2]=a<.42?0:a<.70?1:a<.88?2:3;}}
 if(mode===4){let col=Math.floor((x-94)/49),row=Math.floor((y-220)/43);if(col<0||col>=14||row<0||row>=7)return;selection[4]=row*14+col;}
 update();
}
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')point(e)});canvas.addEventListener('pointerdown',e=>{point(e);canvas.focus({preventScroll:true})});
canvas.addEventListener('keydown',e=>{if(mode===3&&(e.key==='Enter'||e.key===' ')){e.preventDefault();compare();return;}let delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:mode===4?-14:-1,ArrowDown:mode===4?14:1}[e.key];if(delta!==undefined){e.preventDefault();step(delta)}});
const tabs=[...document.querySelectorAll('[role=tab]')];tabs.forEach((b,i)=>{b.addEventListener('click',()=>setMode(i));b.addEventListener('keydown',e=>{let n=e.key==='ArrowRight'?(i+1)%5:e.key==='ArrowLeft'?(i+4)%5:e.key==='Home'?0:e.key==='End'?4:null;if(n!==null){e.preventDefault();setMode(n);tabs[n].focus()}})});
document.querySelector('#replay').onclick=replay;document.querySelector('#previous').onclick=()=>step(-1);document.querySelector('#next').onclick=()=>step(1);document.querySelector('#compare').onclick=compare;
window.chartsReady=Promise.all([document.fonts.load('500 30px SC'),document.fonts.load('700 60px SC')]).then(()=>document.fonts.ready).then(()=>{ready=true;setMode(0)});

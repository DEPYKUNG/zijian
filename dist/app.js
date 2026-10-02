const $=id=>document.getElementById(id);
const examples=[{"text":"我把周末空了出来，想去你说过的那家小店。\n\n路线查好了，天气也看过了。见面以后先吃饭，再沿着河边走一段。\n\n至于那些攒了很久的话，等你坐在对面，我再慢慢讲。","phrase":"我想见你"},{"text":"下班时绕进了花店，今天的晚饭多加了一颗蛋。\n\n洗完衣服，坐在窗边听了半张专辑。也没发生什么大事，心情很好，还抽出时间照顾自己。\n\n明天的事，明天再说。","phrase":"今天也很好"},{"text":"这几天走得慢，路上倒多看见了几家店。\n\n有些事还没做完，有些话还没想好，就慢下来，给自己多一点时间。\n\n等公交的时候，买杯热茶。车来了就上，没来就再站一会儿。","phrase":"慢慢来"},{"text":"想起上次一起吃饭，你把最后一块蛋糕推给了我。\n\n谢谢那天没有急着给建议，陪我坐到店员开始收桌子。\n\n现在事情已经过去了，但我还记得，你一直都在。","phrase":"谢谢你在"},{"text":"我存了很多想发给你的照片，却总在发送前停一下。\n\n喜欢的店、好笑的路牌、新听到的歌，都想找个理由和你聊。\n\n今天把理由省掉，就问你一句：周末有空吗？","phrase":"我喜欢你"},{"text":"把闹钟关掉，好好吃完一顿早餐。\n\n冰箱里还有水果，阳台上的衣服已经干了。生活里这些小事，值得留出时间一件件做。\n\n晚上去附近走走，回来再把灯打开。","phrase":"好好生活"},{"text":"周末先去一趟车站，买张不用赶回来的票。\n\n在陌生的街道走走，看看当地人在哪里吃早餐，傍晚再去河边坐一会儿。\n\n世界还有很多地方，等着我们带回新的照片。","phrase":"去看看世界"},{"text":"我们把剩下的东西装进纸箱，在楼下吃了最后一顿面。\n\n门口那家店还会开着，这条路也会照常有人经过。\n\n再有机会回来，就约在老地方见。","phrase":"我们再见"},{"text":"早上的地铁挤满了人，耳机里刚好放到自己喜欢的歌。\n\n今天按自己的节奏做事，先把手头这一件做完，再往前走一步。\n\n晚饭留给自己选，不用照着别人的安排。","phrase":"按自己的节奏走"},{"text":"周末留一天不做安排，把手机放在桌上。\n\n睡醒之后吃点东西，书读到哪里就在哪里停。\n\n下午的日历还是空白，可以出门，也可以继续待在家里。","phrase":"留一点空白"},{"text":"下次一起出门，走到街角先买两瓶水。\n\n如果还有力气，就坐车去远一点的地方。地图上没标出来的小店，也进去看看。\n\n到了傍晚再决定几点回家，今天不用赶路。","phrase":"一起走远一点"},{"text":"搬走以后，我还会经过那条街，只是少拐进一栋楼。\n\n外卖地址要改，常用的钥匙要还。有些习惯得重新学，花一点时间也没关系。\n\n我会记得那张餐桌，和你坐在对面的样子。","phrase":"我会记得你"}];
const palettes=[['春日来信','#edf0b0','#f069a3'],['午夜海浪','#123c3e','#67bccb'],['蓝色假期','#cee9ef','#317ac2'],['橘子日落','#f3d19a','#d75d35']];
let chars=[],selected=new Set(),palette=0,view='both',seed=2,exampleIndex=examples.findIndex(example=>example.phrase==='一起走远一点'),hitboxes=[];
const canvas=$('art');let ctx=canvas.getContext('2d');
function showToast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2500)}
function preset(){selected.clear();let start=0;for(const c of Array.from(examples[exampleIndex].phrase)){let i=chars.indexOf(c,start);if(i>=0){selected.add(i);start=i+1}}}
function loadText(auto=false){chars=Array.from($('source').value);selected.clear();if(auto)preset();renderWords();draw()}
function renderWords(){const scroll=$('words').scrollTop;const frag=document.createDocumentFragment();chars.forEach((c,i)=>{if(c==='\n'){frag.append(document.createElement('br'));return}if(/\s/.test(c)){frag.append(document.createTextNode(c));return}let b=document.createElement('button');b.textContent=c;b.className='char'+(selected.has(i)?' selected':'');b.setAttribute('aria-pressed',selected.has(i));b.setAttribute('aria-label',`第${i+1}个字：${c}`);b.onclick=()=>toggle(i);frag.append(b)});$('words').replaceChildren(frag);$('words').scrollTop=scroll;$('count').textContent=`${chars.length} / 800`;$('sentence').textContent=chars.filter((_,i)=>selected.has(i)).join('')||'—';$('selectedCount').textContent=`${selected.size} 字`;$('sourceSummary').textContent=$('source').value.replace(/\s+/g,' ')||'—';$('wordsSummary').textContent=chars.filter((_,i)=>selected.has(i)).join('')||'—'}
function toggle(i){selected.has(i)?selected.delete(i):selected.add(i);renderWords();draw()}
function random(n){let x=Math.sin(n*127.1+seed*311.7)*43758.5453;return x-Math.floor(x)}
function edgeNoise(n){const v=Math.sin(n*91.73+12.19)*43758.5453;return v-Math.floor(v)}
function paperBlock(x,y,w,h,key){
 const rough=Number($('roughness').value)/100;
 if(!rough){ctx.fillRect(x,y,w,h);return}
 const amplitude=Math.min(w,h)*.085*rough;
 ctx.beginPath();ctx.moveTo(x,y);
 const edges=[[x,y,x+w,y,0,-1],[x+w,y,x+w,y+h,1,0],[x+w,y+h,x,y+h,0,1],[x,y+h,x,y,-1,0]];
 edges.forEach(([ax,ay,bx,by,nx,ny],edge)=>{const count=Math.max(2,Math.ceil(Math.hypot(bx-ax,by-ay)/5));for(let j=1;j<count;j++){const t=j/count,offset=(edgeNoise(key*997+edge*131+j)-.5)*2*amplitude;ctx.lineTo(ax+(bx-ax)*t+nx*offset,ay+(by-ay)*t+ny*offset)}ctx.lineTo(bx,by)});
 ctx.closePath();ctx.fill();
}
const fontWeights=[300,400,500,600,700];
const weightNames=['细体','常规','中等','半粗','粗体'];
const alignmentNames=['左对齐','居中','右对齐'];
const poetryFormats=[{label:'方形 1:1',width:1200,height:1200},{label:'竖版 3:4',width:1200,height:1600},{label:'竖版 9:16',width:1080,height:1920},{label:'竖版 2:3',width:1200,height:1800},{label:'横版 4:3',width:1600,height:1200},{label:'横版 16:9',width:1920,height:1080},{label:'横版 3:2',width:1800,height:1200}];
function poetryFormat(){return poetryFormats[Number($('format').value)]||poetryFormats[0]}
const typeDefaults={size:24,cutSize:56,weight:2,letterSpacing:3,lineHeight:1.35,paragraphSpacing:8,alignment:0};
let textOverflow=false,actualSourceSize=24;
function selectedWeight(){return fontWeights[Number($('weight').value)]}
function syncSliders(){
 $('weight').setAttribute('aria-valuetext',weightNames[Number($('weight').value)]);
 $('alignment').setAttribute('aria-valuetext',alignmentNames[Number($('alignment').value)]);
 $('format').setAttribute('aria-valuetext',poetryFormat().label);
}
function layoutText(fs,padding,W){
 ctx.font=`${selectedWeight()} ${fs}px "Noto Serif SC", "Songti SC", serif`;
 const fitScale=fs/(Number($('size').value)*1.4);
 const gap=Number($('letterSpacing').value)*1.4*fitScale;
 const paragraphGap=Number($('paragraphSpacing').value)*1.4*fitScale;
 const lineHeight=fs*Number($('lineHeight').value),lines=[];
 let x=padding,y=padding,line=[];
 const finishLine=()=>{lines.push(line);line=[]};
 chars.forEach((c,i)=>{
  if(c==='\n'){if(chars[i-1]!=='\n'){finishLine();y+=lineHeight+(chars[i+1]==='\n'?paragraphGap:0);x=padding}return}
  const glyphWidth=ctx.measureText(c).width,cw=Math.max(glyphWidth+gap,fs*.25);
  if(x+glyphWidth>W-padding&&x>padding){finishLine();x=padding;y+=lineHeight}
  line.push({c,i,x,y,w:cw,glyphWidth,h:Math.max(lineHeight,fs*1.23)});x+=cw;
 });
 finishLine();
 const align=Number($('alignment').value);
 const positions=lines.flatMap(row=>{
  if(!row.length)return row;
  const last=row[row.length-1],width=last.x+last.glyphWidth-padding;
  const shift=Math.max(0,W-padding*2-width)*(align===1?.5:align===2?1:0);
  return row.map(p=>({...p,x:p.x+shift}));
 });
 return {positions,height:positions.length?Math.max(...positions.map(p=>p.y-padding+p.h)):0};
}

function layoutCut(fs,picked,W,base,area,spread){
 const angle=.48*spread,rough=Number($('roughness').value)/100;
 const maxWidth=fs*(1.15*Math.cos(angle)+1.36*Math.sin(angle)+.18*rough);
 const maxHeight=fs*(1.36*Math.cos(angle)+1.15*Math.sin(angle)+.18*rough);
 const cw=(maxWidth+fs*.25)/(1-.24*spread),ch=(maxHeight+fs*.3)/(1-.35*spread);
 const cols=Math.max(1,Math.min(picked.length||1,Math.floor((W-100)/cw)));
 const rows=Math.ceil(picked.length/cols),overflow=!!picked.length&&(cw>W-100||rows*ch>area-100);
 const positions=picked.map(({c,i:key},i)=>{const row=Math.floor(i/cols),col=i%cols,rowCount=Math.min(cols,picked.length-row*cols);return {c,key,x:W/2+(col-(rowCount-1)/2)*cw+(random(i+100)-.5)*cw*.24*spread,y:base+area/2+(row-(rows-1)/2)*ch+(random(i)-.5)*ch*.35*spread,angle:(random(i+50)-.5)*.96*spread}});
 return {positions,overflow,cw,ch};
}

function draw(target=canvas,scale=1){
 const previousCtx=ctx;try{ctx=target.getContext('2d');
 const format=poetryFormat(),W=format.width,H=format.height;
 target.width=W*scale;target.height=H*scale;ctx.setTransform(scale,0,0,scale,0,0);
 const split=H*.53;
 const [name,top,bottom]=palettes[palette];
 ctx.fillStyle=view==='cut'?bottom:top;ctx.fillRect(0,0,W,H);
 if(view==='both'){ctx.fillStyle=bottom;ctx.fillRect(0,split,W,H-split)}
 hitboxes=[];textOverflow=false;const size=Number($('size').value)*1.4,padding=78;
 ctx.textBaseline='top';
 if(view!=='cut'){
  const available=(view==='both'?split:H)-padding*2;
  let fs=size,layout=layoutText(fs,padding,W);
  if(layout.height>available){let low=0,high=size;for(let j=0;j<20;j++){const mid=(low+high)/2;if(layoutText(mid,padding,W).height>available)high=mid;else low=mid}fs=low;layout=layoutText(fs,padding,W)}
  actualSourceSize=fs/1.4;
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,view==='both'?split:H);ctx.clip();
  layout.positions.forEach(({c,i,x,y,w,glyphWidth,h})=>{
   ctx.fillStyle=bottom;
   if(selected.has(i))paperBlock(x,y+fs*.1,Math.max(glyphWidth,4),fs*1.13,i);
   else ctx.fillText(c,x,y);
   if(!/\s/.test(c)&&y+h<=(view==='both'?split:H))hitboxes.push({i,x,y,w:Math.max(w,glyphWidth),h});
  });
  ctx.restore();
 }
 if(view!=='source'){
  const picked=chars.map((c,i)=>({c,i})).filter(({i})=>selected.has(i));
  const base=view==='both'?split:0,area=H-base,spread=Number($('dispersion').value)/100;
  const fs=Number($('cutSize').value)*1.4;
  const cutLayout=layoutCut(fs,picked,W,base,area,spread);
  textOverflow=cutLayout.overflow;
  ctx.save();ctx.beginPath();ctx.rect(0,base,W,area);ctx.clip();
  cutLayout.positions.forEach(({c,key,x,y,angle})=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=top;paperBlock(-fs*.56,-fs*.65,fs*1.15,fs*1.36,key);ctx.fillStyle=bottom;ctx.font=`${selectedWeight()} ${fs}px "Noto Serif SC", "Songti SC", serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c,0,0);ctx.restore()});
  ctx.restore();
  if(!picked.length){ctx.fillStyle=top;ctx.textAlign='center';ctx.font='30px sans-serif';ctx.textAlign='start'}
 }
 const texture=Number($('texture').value);
 if(texture>0){const im=ctx.getImageData(0,0,target.width,target.height);let state=739;for(let p=0;p<im.data.length;p+=4){state=(state*1664525+1013904223)>>>0;const n=(state/4294967296-.5)*34*texture/100;im.data[p]+=n;im.data[p+1]+=n;im.data[p+2]+=n}ctx.putImageData(im,0,0)}
 $('dimensions').textContent=`${W} × ${H}`;$('sizeValue').value=view!=='cut'&&actualSourceSize<Number($('size').value)-.1?`实际 ${actualSourceSize.toFixed(1)}`:$('size').value;
 $('cutSizeValue').value=$('cutSize').value;
 $('size').setAttribute('aria-valuetext',`设定 ${$('size').value}，实际 ${actualSourceSize.toFixed(1)}`);
 $('textureValue').value=`${texture}%`;
 $('letterSpacingValue').value=`${$('letterSpacing').value} px`;
 $('paragraphSpacingValue').value=`${$('paragraphSpacing').value} px`;
 $('dispersionValue').value=`${$('dispersion').value}%`;
 $('weightValue').value=weightNames[Number($('weight').value)];
 $('lineHeightValue').value=`${Number($('lineHeight').value).toFixed(2)} 倍`;
 $('alignmentValue').value=alignmentNames[Number($('alignment').value)];
 $('formatValue').value=format.label;
 $('overflowNotice').hidden=!textOverflow;
 $('export').disabled=textOverflow;
 syncSliders();
 $('roughnessValue').value=`${$('roughness').value}%`;
 }finally{ctx=previousCtx}
}
let pendingDraw=0;
function scheduleDraw(){cancelAnimationFrame(pendingDraw);pendingDraw=requestAnimationFrame(()=>{pendingDraw=0;draw()})}

palettes.forEach((p,i)=>{let b=document.createElement('button');b.className='palette'+(!i?' active':'');b.setAttribute('aria-label',p[0]);b.setAttribute('aria-pressed',!i);b.innerHTML=`<div class="swatch"><i style="background:${p[1]}"></i><i style="background:${p[2]}"></i></div><span>${p[0]}</span>`;b.onclick=()=>{palette=i;document.querySelectorAll('.palette').forEach((el,j)=>{el.classList.toggle('active',i===j);el.setAttribute('aria-pressed',i===j)});draw()};$('palettes').append(b)});
$('source').value=examples[exampleIndex].text;loadText(true);$('source').addEventListener('input',()=>loadText());$('clear').onclick=()=>{selected.clear();renderWords();draw()};$('example').onclick=()=>{exampleIndex=(exampleIndex+1)%examples.length;$('source').value=examples[exampleIndex].text;loadText(true)};['size','format','texture','letterSpacing','paragraphSpacing','roughness','dispersion','weight','lineHeight','alignment','cutSize'].forEach(id=>$(id).addEventListener('input',scheduleDraw));document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('.tabs button').forEach(el=>el.classList.toggle('active',el===b));draw()});canvas.onclick=e=>{let r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height;let hit=hitboxes.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);if(hit)toggle(hit.i)};$('export').onclick=async()=>{cancelAnimationFrame(pendingDraw);pendingDraw=0;try{await document.fonts.ready;const scale=Number($('exportScale').value);const output=document.createElement('canvas');draw(output,[1,1.5,2,3].includes(scale)?scale:1);if(textOverflow){showToast('选字超出纸张，请减小选字字号或减少选字');return}output.toBlob(blob=>{if(!blob){showToast('导出失败，请重试');return}let a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=`字间-${view}-${scale}x-${Date.now()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);showToast('作品已导出')},'image/png')}catch{showToast('导出失败，请重试')}};document.fonts.ready.then(()=>draw());

const editorSheet=$('editorSheet');
const sheetHandle=$('sheetHandle');
let previousOverflow='',sheetExpanded=false,sheetGesture=null,suppressHandleClickUntil=0;
function sheetViewport(){const vp=window.visualViewport;return {top:vp?.offsetTop||0,height:vp?.height||window.innerHeight}}
function collapsedSheetTop(vp){return Math.min(vp.top+vp.height,Math.max(vp.top,document.querySelector('.workspace').getBoundingClientRect().bottom+12))}
function setSheetGeometry(top,vp){
 editorSheet.style.top=`${top}px`;
 editorSheet.style.height=`${Math.max(0,vp.top+vp.height-top)}px`;
}
function updateSheetBounds(){
 if(!editorSheet.open||sheetGesture)return;
 const vp=sheetViewport();setSheetGeometry(sheetExpanded?vp.top:collapsedSheetTop(vp),vp);
}
function setSheetExpanded(expanded){
 sheetExpanded=expanded;editorSheet.classList.toggle('is-fullscreen',expanded);
 sheetHandle.setAttribute('aria-expanded',String(expanded));
 sheetHandle.setAttribute('aria-label',expanded?'下滑收起全屏':'上滑全屏，下滑关闭');
 updateSheetBounds();
}
function openEditor(panel){
 $('sourcePanel').hidden=panel!=='source';$('wordsPanel').hidden=panel!=='words';
 $('sheetTitle').textContent=panel==='source'?'原文':'选字';
 if(!editorSheet.open){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';editorSheet.showModal();setSheetExpanded(false)}
 updateSheetBounds();
}
$('openSource').onclick=()=>openEditor('source');
$('openWords').onclick=()=>openEditor('words');
editorSheet.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;sheetGesture=null;editorSheet.classList.remove('is-dragging');setSheetExpanded(false)});
editorSheet.addEventListener('click',e=>{if(e.target!==editorSheet)return;const r=editorSheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)editorSheet.close()});
sheetHandle.addEventListener('pointerdown',e=>{
 if(e.button!==0||!e.isPrimary)return;
 sheetGesture={id:e.pointerId,y:e.clientY,top:editorSheet.getBoundingClientRect().top,time:performance.now(),delta:0,expanded:sheetExpanded};
 sheetHandle.setPointerCapture(e.pointerId);editorSheet.classList.add('is-dragging');
});
sheetHandle.addEventListener('pointermove',e=>{
 if(!sheetGesture||e.pointerId!==sheetGesture.id)return;
 sheetGesture.delta=e.clientY-sheetGesture.y;
 const vp=sheetViewport(),top=Math.max(vp.top,Math.min(sheetGesture.expanded?collapsedSheetTop(vp):vp.top+vp.height-44,sheetGesture.top+sheetGesture.delta));
 setSheetGeometry(top,vp);
});
function finishSheetGesture(e,cancelled=false){
 if(!sheetGesture||e.pointerId!==sheetGesture.id)return;
 const g=sheetGesture;sheetGesture=null;editorSheet.classList.remove('is-dragging');
 if(sheetHandle.hasPointerCapture(e.pointerId))sheetHandle.releasePointerCapture(e.pointerId);
 const elapsed=Math.max(1,performance.now()-g.time);
 const distance=cancelled?g.delta:e.clientY-g.y;
 if(Math.abs(distance)>8)suppressHandleClickUntil=performance.now()+500;
 if(!cancelled&&(distance<-55||distance<-15&&-distance/elapsed>.45))setSheetExpanded(true);
 else if(!cancelled&&(distance>55||distance>15&&distance/elapsed>.45)){
  if(g.expanded)setSheetExpanded(false);else editorSheet.close();
 }else updateSheetBounds();
}
sheetHandle.addEventListener('pointerup',e=>finishSheetGesture(e));
sheetHandle.addEventListener('pointercancel',e=>finishSheetGesture(e,true));
sheetHandle.addEventListener('lostpointercapture',e=>finishSheetGesture(e,true));
sheetHandle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')suppressHandleClickUntil=0});
sheetHandle.onclick=e=>{
 if(!editorSheet.open||performance.now()<suppressHandleClickUntil){e.preventDefault?.();return}
 setSheetExpanded(!sheetExpanded);
};
window.addEventListener('resize',updateSheetBounds);
window.visualViewport?.addEventListener('resize',updateSheetBounds);
window.visualViewport?.addEventListener('scroll',updateSheetBounds);
if(typeof ResizeObserver!=='undefined')new ResizeObserver(updateSheetBounds).observe(document.querySelector('.workspace'));

$('resetType').onclick=()=>{Object.entries(typeDefaults).forEach(([id,value])=>$(id).value=value);draw()};

// Keep the current work when navigating between the two pages in this tab.
const poetryControls=['size','format','texture','letterSpacing','paragraphSpacing','roughness','dispersion','weight','lineHeight','alignment','cutSize'];
try{
 const saved=JSON.parse(sessionStorage.getItem('zijian-poetry'));
 if(saved&&typeof saved.text==='string'){
  $('source').value=saved.text.slice(0,800);loadText();
  selected=new Set((Array.isArray(saved.selected)?saved.selected:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<chars.length));
  for(const id of poetryControls){const n=Number(saved.controls?.[id]);if(Number.isFinite(n)&&saved.controls?.[id]!==undefined)$(id).value=Math.min(Number($(id).max),Math.max(Number($(id).min),n))}
  if(Number.isInteger(saved.palette)&&saved.palette>=0&&saved.palette<palettes.length)palette=saved.palette;
  if(['both','source','cut'].includes(saved.view))view=saved.view;
  if(Number.isFinite(saved.seed))seed=saved.seed;
  if(Number.isInteger(saved.exampleIndex)&&saved.exampleIndex>=0&&saved.exampleIndex<examples.length)exampleIndex=saved.exampleIndex;
  document.querySelectorAll('.palette').forEach((button,i)=>{button.classList.toggle('active',i===palette);button.setAttribute('aria-pressed',i===palette)});
  document.querySelectorAll('.tabs button').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  renderWords();draw();
 }
}catch{}
window.addEventListener('pagehide',()=>{
 try{sessionStorage.setItem('zijian-poetry',JSON.stringify({text:$('source').value,selected:[...selected],palette,view,seed,exampleIndex,controls:Object.fromEntries(poetryControls.map(id=>[id,$(id).value]))}))}catch{}
});

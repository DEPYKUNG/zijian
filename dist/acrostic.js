(() => {
 const examples=[
  {head:'春风有信',lines:['春山渐暖花初醒','风过长堤柳色新','有约不辞千里路','信笺一纸寄归人']},
  {head:'平安喜乐',lines:['平湖照影晚风轻','安坐窗前听雨声','喜见故人携酒至','乐将心事付繁星']},
  {head:'万事顺意',lines:['万里晴空云作伴','事逢新岁梦相随','顺风轻送归帆远','意在青山不在催']},
  {head:'花好月圆',lines:['花开小院香盈袖','好景长留在眼前','月照归舟人未远','圆圆灯火待团圆']},
  {head:'好好生活',lines:['好风吹过旧窗台','好梦随春缓缓来','生就一身闲意气','活将今日酿成诗']},
  {head:'山河无恙',lines:['山间明月照归途','河畔清风拂柳梢','无事且听窗外雨','恙消春暖见花朝']}
 ];
 const localLibrary=typeof module!=='undefined'&&module.exports?require('./acrostic-library.js'):globalThis.ZijianAcrosticLibrary;
 function generateLines(head,variant=0,previous=[]){
  head=cleanHead(head);if(!head)return [];
  const preset=examples.find(item=>item.head===head);
  if(preset&&variant===0&&!previous.length)return [...preset.lines];
  return localLibrary.generate(head,variant,previous);
 }
 const palettes=[['春日来信','#edf0b0','#f069a3'],['午夜海浪','#123c3e','#67bccb'],['蓝色假期','#cee9ef','#317ac2'],['橘子日落','#f3d19a','#d75d35']];
 const weights=[300,400,500,600,700],weightNames=['细体','常规','中等','半粗','粗体'];
 const cleanHead=value=>Array.from(String(value).replace(/[\s，。！？、；：,.!?;:]/g,'')).slice(0,12).join('');
 const compose=(head,bodies)=>Array.from(cleanHead(head)).map((char,index)=>char+String(bodies[index]||''));
 if(typeof module!=='undefined'&&module.exports){module.exports={examples,palettes,cleanHead,compose,generateLines};return}
 const el=id=>document.getElementById(id),canvas=el('acroArt');let ctx=canvas.getContext('2d');
 let state={head:examples[0].head,bodies:examples[0].lines.map(line=>Array.from(line).slice(1).join('')),palette:0,acroSize:38,acroWeight:2,acroSpacing:4,acroLineGap:24},view='both',panel='heads',generationVariant=0,generationHistory=[];
 try{const saved=JSON.parse(sessionStorage.getItem('zijian-acrostic'));if(saved){state.head=cleanHead(saved.head||state.head);if(Array.isArray(saved.bodies))state.bodies=saved.bodies.slice(0,12).map(x=>String(x).slice(0,60));for(const [key,min,max] of [['palette',0,3],['acroSize',20,64],['acroWeight',0,4],['acroSpacing',0,20],['acroLineGap',0,80]])if(Number.isFinite(saved[key]))state[key]=Math.max(min,Math.min(max,Math.round(saved[key])))}}catch{}
 function save(){try{sessionStorage.setItem('zijian-acrostic',JSON.stringify(state))}catch{}}
 window.addEventListener('pagehide',save);
 function textWidth(text,spacing){return Array.from(text).reduce((n,c)=>n+ctx.measureText(c).width,0)+Math.max(0,Array.from(text).length-1)*spacing}
 function spacedText(text,x,y,spacing){for(const c of Array.from(text)){ctx.fillText(c,x,y);x+=ctx.measureText(c).width+spacing}}
 function draw(target=canvas,scale=1){
  const previousCtx=ctx;try{ctx=target.getContext('2d');target.width=1200*scale;target.height=1200*scale;ctx.setTransform(scale,0,0,scale,0,0);
  const [name,light,dark]=palettes[state.palette],lines=compose(state.head,state.bodies),heads=state.head;
  ctx.clearRect(0,0,1200,1200);ctx.fillStyle=view==='heads'?dark:light;ctx.fillRect(0,0,1200,1200);
  if(view==='both'){ctx.fillStyle=dark;ctx.fillRect(0,900,1200,300)}
  ctx.textBaseline='middle';ctx.textAlign='left';
  if(view!=='heads'&&lines.length){
   const area=view==='both'?900:1200,gap=state.acroLineGap*2;let spacing=state.acroSpacing*2;
   let size=Math.min(state.acroSize*2,(area-120-Math.max(0,lines.length-1)*gap)/lines.length);size=Math.max(16,size);
   ctx.font=`${weights[state.acroWeight]} ${size}px 'Noto Serif SC','Songti SC',serif`;
   const widest=Math.max(...lines.map(line=>textWidth(line,spacing)));if(widest>1040){const scale=1040/widest;size*=scale;spacing*=scale;ctx.font=`${weights[state.acroWeight]} ${size}px 'Noto Serif SC','Songti SC',serif`}
   const actualGap=Math.min(gap,Math.max(0,(area-120-lines.length*size)/Math.max(1,lines.length-1))),total=lines.length*size+(lines.length-1)*actualGap;
   ctx.fillStyle=dark;
   lines.forEach((line,i)=>spacedText(line,(1200-textWidth(line,spacing))/2,(area-total)/2+size/2+i*(size+actualGap),spacing));
  }
  if(view!=='poem'&&heads){
   let size=96;const spacing=18;ctx.font=`${weights[state.acroWeight]} ${size}px 'Noto Serif SC','Songti SC',serif`;
   const width=textWidth(heads,spacing);if(width>1000){size*=(1000-Math.max(0,Array.from(heads).length-1)*spacing)/(width-Math.max(0,Array.from(heads).length-1)*spacing);ctx.font=`${weights[state.acroWeight]} ${size}px 'Noto Serif SC','Songti SC',serif`}
   ctx.fillStyle=light;spacedText(heads,(1200-textWidth(heads,spacing))/2,view==='both'?1050:600,spacing);
  }
  }finally{ctx=previousCtx}
 }
 function render(){
  el('acroHeadSummary').textContent=state.head||'—';el('acroPoemSummary').textContent=compose(state.head,state.bodies).join('，')||'—';
  el('acroHeadsCount').textContent=`${Array.from(state.head).length} / 12`;
  for(const id of ['acroSize','acroWeight','acroSpacing','acroLineGap']){el(id).value=state[id];el(id+'Value').textContent=id==='acroWeight'?weightNames[state[id]]:state[id]}
  document.querySelectorAll('[data-acro-palette]').forEach(button=>{const active=Number(button.dataset.acroPalette)===state.palette;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
  el('acroExport').disabled=!state.head;draw();save();
 }
 function renderPoemEditor(){
  el('acroPoemPanel').replaceChildren(...Array.from(state.head).map((char,i)=>{
   const label=document.createElement('label');label.className='acro-line-editor';const prefix=document.createElement('span');prefix.className='acro-line-prefix';prefix.textContent=char;
   const input=document.createElement('input');input.type='text';input.maxLength=60;input.value=state.bodies[i]||'';input.placeholder='续写这一句';input.setAttribute('aria-label',`第${i+1}句，首字${char}`);
   input.addEventListener('input',()=>{state.bodies[i]=input.value;render()});label.append(prefix,input);return label;
  }));
 }
 function refreshPanel(){el('acroSheetTitle').textContent=panel==='heads'?'藏头':'诗句';el('acroHeadsPanel').hidden=panel!=='heads';el('acroPoemPanel').hidden=panel!=='poem';el('acroHeadsInput').value=state.head;renderPoemEditor()}
 function changeExample(){const candidates=examples.filter(item=>item.head!==state.head),next=candidates[Math.floor(Math.random()*candidates.length)];generationVariant=0;generationHistory=[];state.head=next.head;state.bodies=next.lines.map(line=>Array.from(line).slice(1).join(''));render();if(editorSheet.open)refreshPanel()}
 function generateForHead(head,reroll=false){
  const next=cleanHead(head);if(!reroll&&next===state.head)return;
  if(next!==state.head){generationVariant=0;generationHistory=[]}else if(reroll)generationVariant++;
  const previous=next===state.head?compose(state.head,state.bodies):[];
  if(previous.length)generationHistory.push(previous);generationHistory=generationHistory.slice(-6);
  state.head=next;state.bodies=generateLines(next,generationVariant,generationHistory.flat()).map(line=>Array.from(line).slice(1).join(''));render();
  if(panel==='poem'&&editorSheet.open)renderPoemEditor();
 }
 el('acroExample').onclick=changeExample;el('acroSheetExample').onclick=()=>generateForHead(state.head,true);
 el('acroGenerate').onclick=()=>generateForHead(state.head,true);

 el('acroHeadsInput').addEventListener('input',event=>{if(event.isComposing)return;generateForHead(event.target.value)});
 el('acroHeadsInput').addEventListener('compositionend',event=>{generateForHead(event.target.value)});
 el('acroHeadsInput').addEventListener('blur',()=>{el('acroHeadsInput').value=state.head});
 for(const id of ['acroSize','acroWeight','acroSpacing','acroLineGap'])el(id).addEventListener('input',()=>{state[id]=Number(el(id).value);render()});
 el('acroPalettes').replaceChildren(...palettes.map(([name,light,dark],i)=>{const b=document.createElement('button');b.type='button';b.className='palette';b.dataset.acroPalette=i;b.setAttribute('aria-label',name);const swatch=document.createElement('span');swatch.className='swatch';for(const color of [light,dark]){const c=document.createElement('i');c.style.background=color;swatch.append(c)}const label=document.createElement('span');label.textContent=name;b.append(swatch,label);b.onclick=()=>{state.palette=i;render()};return b}));
 document.querySelectorAll('[data-acro-view]').forEach(button=>button.onclick=()=>{view=button.dataset.acroView;document.querySelectorAll('[data-acro-view]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});draw()});
 let toastTimer;function toast(message){el('acroToast').textContent=message;el('acroToast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el('acroToast').classList.remove('show'),2500)}
 el('acroExport').onclick=async()=>{if(!state.head)return;try{await document.fonts.ready;const scale=Number(el('exportScale').value);const output=document.createElement('canvas');draw(output,[1,1.5,2,3].includes(scale)?scale:1);const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));if(!blob)throw Error();const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`字间-藏头诗-${state.head}-${scale}x.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch{toast('导出失败，请重试')}};
const editorSheet=el('acroSheet');
const sheetHandle=el('acroSheetHandle');
let sheetExpanded=false,sheetGesture=null,suppressHandleClickUntil=0,lockedBody=null,lockedScrollY=0;
function lockPage(){
 const body=document.body;lockedScrollY=window.scrollY||0;lockedBody={};
 for(const key of ['position','top','left','right','width','overflow'])lockedBody[key]=body.style[key];
 body.style.position='fixed';body.style.top=`${-lockedScrollY}px`;body.style.left='0';body.style.right='0';body.style.width='100%';body.style.overflow='hidden';
}
function unlockPage(){
 if(!lockedBody)return;for(const [key,value] of Object.entries(lockedBody))document.body.style[key]=value;
 lockedBody=null;window.scrollTo?.(0,lockedScrollY);
}
function sheetViewport(){const vp=window.visualViewport;return {top:vp?.offsetTop||0,height:vp?.height||window.innerHeight}}
function collapsedSheetTop(vp){return Math.min(vp.top+vp.height,Math.max(vp.top,document.querySelector('.workspace').getBoundingClientRect().bottom+12))}
function setSheetGeometry(top,vp){
 editorSheet.style.top=`${top}px`;
 editorSheet.style.height=`${Math.max(0,vp.top+vp.height-top)}px`;
}
function updateSheetBounds(){
 if(!editorSheet.open||sheetGesture)return;
 const vp=sheetViewport(),collapsed=Math.min(collapsedSheetTop(vp),vp.top+Math.max(0,vp.height-180));
 editorSheet.classList.toggle('is-fullscreen',sheetExpanded);
 sheetHandle.setAttribute('aria-expanded',String(sheetExpanded));
 sheetHandle.setAttribute('aria-label',sheetExpanded?'下滑收起全屏':'上滑全屏，下滑关闭');
 setSheetGeometry(sheetExpanded?vp.top:collapsed,vp);
}
function setSheetExpanded(expanded){
 sheetExpanded=expanded;editorSheet.classList.toggle('is-fullscreen',expanded);
 sheetHandle.setAttribute('aria-expanded',String(expanded));
 sheetHandle.setAttribute('aria-label',expanded?'下滑收起全屏':'上滑全屏，下滑关闭');
 updateSheetBounds();
}
function openPicker(){
 refreshPanel();
 if(!editorSheet.open){lockPage();suppressHandleClickUntil=0;editorSheet.showModal();editorSheet.focus({preventScroll:true});setSheetExpanded(false)}
 updateSheetBounds();
}
el('openAcroHeads').onclick=()=>{panel='heads';openPicker()};
el('openAcroPoem').onclick=()=>{panel='poem';openPicker()};
editorSheet.addEventListener('close',()=>{sheetGesture=null;unlockPage();editorSheet.classList.remove('is-dragging');setSheetExpanded(false)});
editorSheet.addEventListener('click',e=>{if(e.target!==editorSheet)return;const r=editorSheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)editorSheet.close()});
function startSheetGesture(e){
 if(e.button!==0||!e.isPrimary)return;
 sheetGesture={id:e.pointerId,y:e.clientY,top:editorSheet.getBoundingClientRect().top,time:performance.now(),delta:0,expanded:sheetExpanded};
 if(e.pointerType!=='touch')sheetHandle.setPointerCapture(e.pointerId);editorSheet.classList.add('is-dragging');
}
function moveSheetGesture(e){
 if(!sheetGesture||e.pointerId!==sheetGesture.id)return;
 sheetGesture.delta=e.clientY-sheetGesture.y;
 const vp=sheetViewport(),top=Math.max(vp.top,Math.min(sheetGesture.expanded?collapsedSheetTop(vp):vp.top+vp.height-44,sheetGesture.top+sheetGesture.delta));
 setSheetGeometry(top,vp);
}
sheetHandle.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')startSheetGesture(e)});
sheetHandle.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')moveSheetGesture(e)});
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
sheetHandle.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')finishSheetGesture(e)});
sheetHandle.addEventListener('pointercancel',e=>finishSheetGesture(e,true));
sheetHandle.addEventListener('lostpointercapture',e=>finishSheetGesture(e,true));
function touchGestureEvent(touch){return {button:0,isPrimary:true,pointerType:'touch',pointerId:touch.identifier+1000,clientY:touch.clientY}}
sheetHandle.addEventListener('touchstart',e=>{if(e.touches.length!==1)return;e.preventDefault();startSheetGesture(touchGestureEvent(e.touches[0]))},{passive:false});
sheetHandle.addEventListener('touchmove',e=>{if(!sheetGesture)return;const touch=Array.from(e.touches).find(t=>t.identifier+1000===sheetGesture.id);if(touch){e.preventDefault();moveSheetGesture(touchGestureEvent(touch))}},{passive:false});
sheetHandle.addEventListener('touchend',e=>{if(!sheetGesture)return;const touch=Array.from(e.changedTouches).find(t=>t.identifier+1000===sheetGesture.id);if(touch){e.preventDefault();const tapped=Math.abs(touch.clientY-sheetGesture.y)<=8;finishSheetGesture(touchGestureEvent(touch));if(tapped&&editorSheet.open){suppressHandleClickUntil=performance.now()+500;setSheetExpanded(!sheetExpanded)}}},{passive:false});
sheetHandle.addEventListener('touchcancel',e=>{if(!sheetGesture)return;const touch=Array.from(e.changedTouches).find(t=>t.identifier+1000===sheetGesture.id);if(touch)finishSheetGesture(touchGestureEvent(touch),true)},{passive:false});
sheetHandle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')suppressHandleClickUntil=0});
sheetHandle.onclick=e=>{
 if(!editorSheet.open||performance.now()<suppressHandleClickUntil){e.preventDefault?.();return}
 setSheetExpanded(!sheetExpanded);
};
window.addEventListener('resize',updateSheetBounds);
window.visualViewport?.addEventListener('resize',updateSheetBounds);
window.visualViewport?.addEventListener('scroll',updateSheetBounds);
if(typeof ResizeObserver!=='undefined')new ResizeObserver(updateSheetBounds).observe(document.querySelector('.workspace'));

 render();
 document.fonts?.ready.then(()=>draw());
})();

const modeRoutes=['/poetry/','/turtle/','/acrostic/'];
document.getElementById('modeSelect').addEventListener('change',event=>{if(modeRoutes.includes(event.target.value))window.location.assign(event.target.value)});
window.addEventListener('pageshow',()=>{document.getElementById('modeSelect').value=modeRoutes.find(route=>location.pathname.startsWith(route.slice(0,-1)))||'/poetry/'});
const brandModeTrigger=document.getElementById('brandModeTrigger');
const brandModeMenu=document.getElementById('brandModeMenu');
function closeModeMenu(restoreFocus=false){brandModeMenu.hidden=true;brandModeTrigger.setAttribute('aria-expanded','false');if(restoreFocus)brandModeTrigger.focus({preventScroll:true})}
brandModeTrigger.addEventListener('click',()=>{const opening=brandModeMenu.hidden;brandModeMenu.hidden=!opening;brandModeTrigger.setAttribute('aria-expanded',String(opening))});
brandModeTrigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();brandModeMenu.hidden=false;brandModeTrigger.setAttribute('aria-expanded','true');brandModeMenu.querySelector('a').focus()}});
document.addEventListener('click',event=>{if(!event.target.closest('.toolbar-brand'))closeModeMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!brandModeMenu.hidden){event.preventDefault();closeModeMenu(true)}});
document.addEventListener('focusin',event=>{if(!event.target.closest('.toolbar-brand'))closeModeMenu()});
brandModeMenu.addEventListener('click',()=>closeModeMenu());
window.addEventListener('pageshow',()=>closeModeMenu());
window.matchMedia('(max-width:720px)').addEventListener('change',()=>closeModeMenu());

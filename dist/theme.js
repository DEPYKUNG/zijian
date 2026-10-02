(() => {
 const modes=['system','light','dark'],names={system:'跟随系统',light:'浅色',dark:'深色'};
 const root=document.documentElement,query=window.matchMedia('(prefers-color-scheme: dark)'),phoneQuery=window.matchMedia('(max-width: 720px)');
 let preference='system';
 function read(){try{const saved=localStorage.getItem('zijian-theme');preference=modes.includes(saved)?saved:'system'}catch{preference='system'}}
 function apply(){
  const theme=preference==='system'?(query.matches?'dark':'light'):preference;
  root.dataset.theme=theme;root.style.colorScheme=theme;
  const button=document.getElementById('themeToggle');if(!button)return;
  const next=modes[(modes.indexOf(preference)+1)%modes.length];
  button.setAttribute('aria-label',`当前${names[preference]}，切换为${names[next]}`);button.title=`${names[preference]} · 点击切换为${names[next]}`;
  button.dataset.mode=preference;
  const paths={system:phoneQuery.matches?'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z M10 5h4 M11 19h2':'M3 4h18v13H3z M8 21h8 M12 17v4',light:'M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.6 5.6l1.4 1.4 M17 17l1.4 1.4 M5.6 18.4 7 17 M17 7l1.4-1.4 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',dark:'M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z'};
  button.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[preference]}"/></svg>`;
 }
 read();apply();
 function setup(){const button=document.getElementById('themeToggle');if(!button)return;button.addEventListener('click',()=>{preference=modes[(modes.indexOf(preference)+1)%modes.length];try{localStorage.setItem('zijian-theme',preference)}catch{}apply()});apply()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
 query.addEventListener('change',apply);phoneQuery.addEventListener('change',apply);
 window.addEventListener('pageshow',()=>{read();apply()});
 window.addEventListener('storage',event=>{if(event.key==='zijian-theme'){read();apply()}});
})();

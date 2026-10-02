/* Guided lateral thinking games with a graded title picker. */
(function () {
 'use strict';
 const puzzles = typeof module !== 'undefined' && module.exports ? require('./soup-library.js') : window.soupLibrary;
 function randomPuzzle(level, currentId, random = Math.random) {
  const choices = puzzles.filter(item => item.level === level && item.id !== currentId);
  return choices[Math.min(choices.length - 1, Math.max(0, Math.floor(random() * choices.length)))];
 }
 function createGame(puzzle = puzzles[0]) {
  let step = 0, accepted = false, completed = false, rejected = new Set();
  return {
   get state() { return {step, accepted, completed, rejected: Array.from(rejected), clues: puzzle.steps.slice(0, step + Number(accepted)).map(item => item.clue)}; },
   choose(index) {
    const current = puzzle.steps[step];
    if(completed || accepted || !Number.isInteger(index) || index < 0 || index >= current.answers.length || rejected.has(index)) return null;
    const correct = index === current.correct;
    if(correct) accepted = true; else rejected.add(index);
    return {correct, feedback: current.feedback[index]};
   },
   next() {
    if(!accepted || completed) return false;
    if(step === puzzle.steps.length - 1) completed = true;
    else { step++; accepted = false; rejected = new Set(); }
    return true;
   },
   reset() { step = 0; accepted = false; completed = false; rejected = new Set(); }
  };
 }
 if(typeof module !== 'undefined' && module.exports) { module.exports = {puzzle: puzzles[0], puzzles, createGame, randomPuzzle}; return; }
 const el = id => document.getElementById(id);
 let puzzle = puzzles[0], game = createGame(puzzle), selectedLevel = puzzle.level;
 let previewView = 'story';
 function renderPreview() {
  if(previewView === 'solution' && !game.state.completed) previewView = 'story';
  el('soupStoryView').hidden = previewView !== 'story';
  el('soupCluesView').hidden = previewView !== 'clues';
  el('soupSolutionView').hidden = previewView !== 'solution';
  el('soupPaper').classList.toggle('show-clues', previewView === 'clues');
  document.querySelectorAll('[data-soup-view]').forEach(button => { const active = button.dataset.soupView === previewView; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
 }
 document.querySelectorAll('[data-soup-view]').forEach(button => button.onclick = () => { previewView = button.dataset.soupView; renderPreview(); });
 try {
  const saved = JSON.parse(sessionStorage.getItem('zijian-turtle'));
  if(saved?.puzzleId) { puzzle = puzzles.find(item => item.id === saved.puzzleId) || puzzles[0]; game = createGame(puzzle); selectedLevel = ['入门','进阶'].includes(saved.level) ? saved.level : puzzle.level; }
  if(saved && Number.isInteger(saved.step) && saved.step >= 0 && saved.step < puzzle.steps.length) {
   for(let i = 0; i < saved.step; i++) { game.choose(puzzle.steps[i].correct); game.next(); }
   for(const index of Array.isArray(saved.rejected) ? saved.rejected : []) if(index !== puzzle.steps[saved.step].correct) game.choose(index);
   if(saved.accepted) game.choose(puzzle.steps[saved.step].correct);
   if(saved.completed && saved.step === puzzle.steps.length - 1 && saved.accepted) game.next();
  }
 } catch {}
 window.addEventListener('pagehide', () => { try { sessionStorage.setItem('zijian-turtle', JSON.stringify({...game.state,puzzleId:puzzle.id,level:selectedLevel})); } catch {} });
 el('soupTitle').textContent = puzzle.title;
 el('soupStory').textContent = puzzle.story;
 function render(feedback = '') {
  const state = game.state, current = puzzle.steps[state.step];
  el('soupTitle').textContent = puzzle.title; el('soupStory').textContent = puzzle.story;
  el('soupCurrentTitle').textContent = puzzle.title; el('soupCurrentLevel').textContent = puzzle.level;
  el('soupSolutionTab').disabled = !state.completed;
  el('soupPreviewSolution').textContent = state.completed ? puzzle.solution : '';
  renderPreview();
  el('soupProgress').textContent = `${state.clues.length} / ${puzzle.steps.length}`;
  el('soupClueCount').textContent = state.clues.length;
  const clues = state.clues.map((clue, index) => {
   const line = document.createElement('p'); line.textContent = `${index + 1}. ${clue}`; return line;
  });
  if(!clues.length) { const line = document.createElement('p'); line.className = 'soup-empty'; line.textContent = '等待第一条线索'; clues.push(line); }
  el('soupClues').replaceChildren(...clues);
  el('soupQuestionPanel').hidden = state.completed;
  el('soupResult').hidden = !state.completed;
  if(state.completed) { el('soupFeedback').textContent = ''; el('soupFeedback').hidden = true; el('soupSolution').textContent = puzzle.solution; return; }
  el('soupStep').textContent = `第 ${state.step + 1} 步 / ${puzzle.steps.length}`;
  el('soupQuestion').textContent = current.question;
  const reason = feedback || (state.accepted ? current.feedback[current.correct] : state.rejected.length ? current.feedback[state.rejected[state.rejected.length - 1]] : '');
  el('soupFeedback').textContent = reason ? `${state.accepted ? '回答正确' : '回答错误'}。${reason}` : '';
  el('soupFeedback').hidden = !reason;
  el('soupFeedback').classList.toggle('is-correct', state.accepted);
  el('soupNext').disabled = !state.accepted;
  el('soupNext').textContent = state.step === puzzle.steps.length - 1 ? '查看汤底' : '继续推理';
  const buttons = current.answers.map((answer, index) => {
   const button = document.createElement('button'); button.type = 'button'; button.className = 'editor-shortcut soup-answer';
   const marker = document.createElement('span'); marker.className = 'soup-answer-marker'; marker.textContent = String.fromCharCode(65 + index);
   const text = document.createElement('span'); text.className = 'soup-answer-text'; text.textContent = answer;
   const rejected = state.rejected.includes(index), correct = state.accepted && index === current.correct;
   button.disabled = state.accepted || rejected;
   button.classList.toggle('is-wrong', rejected); button.classList.toggle('is-correct', correct);
   button.append(marker, text);
   if(rejected || correct) { marker.textContent = correct ? '✓' : '×'; button.setAttribute('aria-label', `${answer}，${correct ? '正确' : '已排除'}`); }
   button.onclick = event => { const result = game.choose(index); if(result) { previewView = 'story'; render(result.feedback); if(result.correct && event.detail === 0) el('soupNext').focus({preventScroll:true}); } };
   return button;
  });
  el('soupAnswers').replaceChildren(...buttons);
 }
 function focusQuestion() { el(game.state.completed ? 'soupResultTitle' : 'soupQuestion').focus({preventScroll:true}); }
 el('soupNext').onclick = () => { if(game.next()) { if(game.state.completed) previewView = 'solution'; render(); focusQuestion(); } };
 const reset = () => { game.reset(); previewView = 'story'; render(); focusQuestion(); };
 el('soupReset').onclick = reset; el('soupReplay').onclick = reset;

 function selectPuzzle(next) {
  if(!next) return;
  puzzle = next; game = createGame(puzzle); previewView = 'story';
  render();
  if(el('soupPicker').open) el('soupPicker').close();
  try { sessionStorage.setItem('zijian-turtle', JSON.stringify({...game.state,puzzleId:puzzle.id,level:selectedLevel})); } catch {}
 }
 function changeRandom() { selectPuzzle(randomPuzzle(selectedLevel,puzzle.id)); }
 function renderPicker() {
  document.querySelectorAll('[data-soup-level]').forEach(button => {
   const active = button.dataset.soupLevel === selectedLevel;
   button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active));
  });
  const rows = puzzles.filter(item => item.level === selectedLevel).map(item => {
   const button = document.createElement('button'); button.type = 'button'; button.className = 'soup-puzzle-row';
   button.textContent = item.title; button.classList.toggle('active',item.id === puzzle.id);
   button.setAttribute('aria-pressed',String(item.id === puzzle.id)); button.onclick = () => selectPuzzle(item);
   return button;
  });
  el('soupPuzzleList').replaceChildren(...rows); el('soupPuzzleList').scrollTop = 0;
 }
 document.querySelectorAll('[data-soup-level]').forEach(button => button.onclick = () => { selectedLevel = button.dataset.soupLevel; renderPicker(); });
 el('soupRandom').onclick = changeRandom; el('soupPickerRandom').onclick = changeRandom;
const editorSheet=el('soupPicker');
const sheetHandle=el('soupPickerHandle');
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
function openPicker(){
 renderPicker();
 if(!editorSheet.open){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';editorSheet.showModal();setSheetExpanded(false)}
 updateSheetBounds();
}
el('openSoupPicker').onclick=openPicker;
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
 render();
})();

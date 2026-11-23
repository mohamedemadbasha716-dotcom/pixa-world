import 'server-only';
/** Owner-practice navigation only. No saved progress or new access grants. */
export function practiceNavigation(source:string){
 const injection=`
// Temporary navigation snapshots stay inside this iframe only.
const stageSnapshots=new Map();let stageAttempt=null;
const originalTaskRender=renderTask;
renderTask=function(){
 if(stageAttempt!==attempt?.attemptId){stageAttempt=attempt?.attemptId;stageSnapshots.clear();}
 if(!stageSnapshots.has(state.index))stageSnapshots.set(state.index,{state:structuredClone(state),attempt:structuredClone(attempt),serverResult:structuredClone(serverResult),record:structuredClone(practiceAttempts.get(attempt.attemptId))});
 originalTaskRender();
 const bar=document.createElement('nav');bar.className='stage-navigation';bar.setAttribute('aria-label','التنقل بين مراحل الدرس');
 bar.innerHTML='<button id="stage-words" class="secondary">→ كلمات الدرس</button><button id="stage-previous" class="secondary" '+(state.index===0?'disabled':'')+'>→ النشاط السابق</button><label>مراحل الدرس <select id="stage-select"><option value="words">الكلمات والتدريب</option><option value="game" selected>اللعبة · النشاط '+(state.index+1)+'</option></select></label><span>التالي بيتفتح بعد الإجابة، من زر كمّل ←</span>';
 main.querySelector('.game-toolbar').after(bar);
 const words=()=>overview(state.lesson.id);
 bar.querySelector('#stage-words').onclick=words;bar.querySelector('select').onchange=e=>{if(e.target.value==='words')words()};
 bar.querySelector('#stage-previous').onclick=()=>{if(state.pending||state.index===0)return;stopAudio();const ix=state.index-1,snapshot=stageSnapshots.get(ix);if(!snapshot)return;state=structuredClone(snapshot.state);attempt=structuredClone(snapshot.attempt);serverResult=structuredClone(snapshot.serverResult);practiceAttempts.set(attempt.attemptId,structuredClone(snapshot.record));for(const key of stageSnapshots.keys())if(key>=ix)stageSnapshots.delete(key);renderTask();heading();};
};
const originalMapRender=renderMap;
renderMap=function(){originalMapRender();const nav=main.querySelector('.practice-map-nav');if(!nav)return;const current=Number(new URLSearchParams(location.search).get('map')||'1');const controls=document.createElement('div');controls.className='map-arrow-controls';controls.innerHTML='<button id="map-previous" class="secondary" '+(current===1?'disabled':'')+'>→ الخريطة السابقة</button><label>اختار الخريطة <select id="map-select">'+Array.from(nav.querySelectorAll('a')).map((a,i)=>'<option value="'+(i+1)+'" '+(i+1===current?'selected':'')+'>'+a.textContent+'</option>').join('')+'</select></label><button id="map-next" class="secondary" '+(current===5?'disabled':'')+'>الخريطة التالية ←</button>';nav.prepend(controls);const go=id=>{stopAudio();location.href='/api/english-adventure/play?practice=1&map='+id;};controls.querySelector('#map-previous').onclick=()=>go(current-1);controls.querySelector('#map-next').onclick=()=>go(current+1);controls.querySelector('select').onchange=e=>go(Number(e.target.value));};
`;
 // Install wrappers before the original first map render.
 return source.replace("$('#settings').onclick",injection+"\n$('#settings').onclick");
}
export const navigationStyles=`.stage-navigation,.map-arrow-controls{display:flex!important;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:15px;margin-bottom:15px;background:#173e45;border:1px solid #86aaa5;border-radius:16px;direction:rtl}.stage-navigation label,.map-arrow-controls label{display:flex;gap:10px;align-items:center;color:#fff0cb}.stage-navigation select,.map-arrow-controls select{max-width:100%;min-height:46px;padding:8px 12px;border:2px solid #96bab4;border-radius:10px;color:#fff0cb;background:#234d54;font:bold 16px Arial}.stage-navigation button:disabled,.map-arrow-controls button:disabled{opacity:.4}.stage-navigation span{font-size:13px;color:#ddceaf}@media(max-width:500px){.stage-navigation,.map-arrow-controls{flex-direction:column;align-items:stretch}.stage-navigation label,.map-arrow-controls label{flex-wrap:wrap}.stage-navigation button,.map-arrow-controls button{min-height:48px}}`;

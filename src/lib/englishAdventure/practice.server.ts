import 'server-only';
/** Owner-only UI review. No progress, attempts, rewards or account writes. */
export function ownerPracticeApp(source:string){
 const original="async function api(path,body){const response=";
 if(!source.includes(original))throw new Error('practice_ui_version_mismatch');
 const replacement=`const practiceAttempts=new Map();let practiceSequence=0;
async function api(path,body){
 if(path==='attempt'){
  if(body.action==='begin'){const id='practice-'+(++practiceSequence);practiceAttempts.set(id,{lessonId:body.lessonId,index:0,revision:0,score:0});return {attemptId:id,index:0,revision:0}}
  const a=practiceAttempts.get(body.attemptId);if(!a||a.lessonId!==body.lessonId||a.revision!==body.revision)throw new Error('جلسة المعاينة اتغيّرت. ارجع وابدأ المحطة تاني.');
  const task=state.lesson.tasks[a.index];if(!task||task.id!==body.taskId)throw new Error('ترتيب المعاينة غير صحيح.');
  const correct=String(task.answer).trim()===String(body.answer).trim();
  if(correct||task.review){a.index++;if(task.review&&correct&&!(task.listening&&body.readingAlternative))a.score++}a.revision++;
  const reviewCount=state.lesson.tasks.filter(t=>t.review).length;return {correct,index:a.index,revision:a.revision,score:a.score,finished:a.index===state.lesson.tasks.length,complete:a.index===state.lesson.tasks.length&&(!reviewCount||a.score>=Math.ceil(reviewCount*.8))};
 }
 const response=`;
 let app=source.replace(original,replacement);
 app="import {createEnglishDeviceAudio} from './device-audio?practice=1';\n"+app;
 // Carrier recordings preserve the target while disclosing every extra spoken word.
 app=app.replace("import {audioFiles} from './audio';","import {audioFiles,audioPhrases} from './audio';");
 app=app.replace("$('#exit').onclick=()=>","if(t.spoken&&audioPhrases[t.spoken]){const hint=document.createElement('p');hint.className='quiet carrier-hint';hint.textContent=audioPhrases[t.spoken]==='I like jam.'?'التسجيل جملة قصيرة فيها الكلمة المطلوبة. اختار الكلمة اللي تسمعها.':/^[A-Z]$/.test(t.spoken)?'التسجيل بيقول The letter قبل اسم الحرف. اختار الحرف اللي تسمعه.':'التسجيل بيقول The word قبل الكلمة المطلوبة. اختار الكلمة اللي تسمعها.';$('#listen').before(hint);}$('#exit').onclick=()=>");
 app=app.replace("main.querySelectorAll('[data-say]').forEach","main.querySelectorAll('[data-say]').forEach(b=>{const phrase=audioPhrases[b.dataset.say];if(phrase){const note=document.createElement('small');note.lang='en';note.dir='ltr';note.textContent='Recording: '+phrase;b.append(note);b.setAttribute('aria-label',b.dataset.say+'. Recording: '+phrase);}});main.querySelectorAll('[data-say]').forEach");
 app=app.replace('let currentAudio=null,audioGeneration=0;',`let currentAudio=null,audioGeneration=0,deviceDone=null;
const deviceAudio=createEnglishDeviceAudio({synthesis:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,onState:s=>{const status=$('#audio-status');if(s.kind==='speaking'&&status)status.textContent='صوت الجهاز: '+s.voice+' ('+s.lang+').';if(s.kind==='ended'){const done=deviceDone;deviceDone=null;if(status)status.textContent='اكتمل صوت الجهاز.';done?.();}else if(['error','timeout','unsupported','no-english-voice','unconfirmed-end','empty'].includes(s.kind)){deviceDone=null;if(status)status.textContent='صوت إنجليزي مناسب مش متاح أو التشغيل متأكدش. جرّب تاني أو استخدم بديل القراءة.';}}});`);
 app=app.replace('function stopAudio(){audioGeneration++;', 'function stopAudio(){deviceDone=null;deviceAudio.stop();audioGeneration++;');
 app=app.replace("if(!path){notice('الصوت مش جاهز','العبارة دي لسه مفيش لها تسجيل. استخدم بديل القراءة لو متاح.');return false}","if(!path){stopAudio();const generation=audioGeneration;deviceDone=()=>{if(generation===audioGeneration)onDone?.()};const started=deviceAudio.start(text,{letter:/^[A-Z]$/.test(text)});const status=$('#audio-status');if(status)status.textContent='بنستخدم صوت الجهاز الإنجليزي. صوته وجودته حسب الجهاز، مش التسجيل الثابت.';return started}");
 app=app.replace("main.querySelectorAll('[data-say]').forEach", "main.querySelectorAll('[data-say]').forEach(b=>{if(!audioFiles[b.dataset.say]){const icon=b.querySelector('.speaker');if(icon)icon.textContent='صوت الجهاز';}});main.querySelectorAll('[data-say]').forEach");
 app=app.replace('function heading(){', "document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio()});window.addEventListener('pagehide',stopAudio);function heading(){");
 app=app.replaceAll('تسجيلات إنجليزية مولّدة ومرفقة بالمحتوى.','التسجيلات الجاهزة مرفقة بالمحتوى. العبارات الناقصة بتستخدم صوت الجهاز الإنجليزي، وجودته وتوفره حسب الجهاز.');

 app=app.replace('function renderTask(){', "function renderTask(){const activeTaskControl=document.activeElement;const focusData=activeTaskControl?.closest('.play-area')?Object.entries(activeTaskControl.dataset).find(([k])=>k!=='value'):null;");
 app=app.replace("$('#next')&&($('#next').onclick", "if(focusData&&!state.feedback){const [key,value]=focusData;main.querySelectorAll('.play-area button').forEach(b=>{if(b.dataset[key]===value&&!b.disabled)b.focus({preventScroll:true})});}$('#next')&&($('#next').onclick");


 app=app.replace("main.querySelectorAll('[data-lesson]').forEach", "const mapNav=document.createElement('nav');mapNav.className='practice-map-nav';mapNav.setAttribute('aria-label','خرائط الإنجليزية الخمس');mapNav.innerHTML='<p>اختار عالم الاستكشاف</p><div>'+['\\u062c\\u0632\\u064a\\u0631\\u0629 \\u0627\\u0644\\u0628\\u062f\\u0627\\u064a\\u0627\\u062a', '\\u0628\\u064a\\u062a \\u0627\\u0644\\u0627\\u0643\\u062a\\u0634\\u0627\\u0641\\u0627\\u062a', '\\u0627\\u0644\\u062d\\u062f\\u064a\\u0642\\u0629 \\u0627\\u0644\\u062d\\u064a\\u0629', '\\u0645\\u062f\\u064a\\u0646\\u0629 \\u0627\\u0644\\u0631\\u062d\\u0644\\u0627\\u062a', '\\u0645\\u0647\\u0631\\u062c\\u0627\\u0646 \\u0627\\u0644\\u062d\\u0643\\u0627\\u064a\\u0627\\u062a'].map((name,i)=>'<a href=\"/api/english-adventure/play?practice=1&map='+(i+1)+'\" target=\"_self\" aria-current=\"'+((new URLSearchParams(location.search).get('map')||'1')===String(i+1)?'page':'false')+'\">'+(i+1)+' · '+name+'</a>').join('')+'</div>';main.querySelector('.map-intro').after(mapNav);main.querySelectorAll('[data-lesson]').forEach");

 app=app.replace("'/api/english-adventure/'+path,{", "'/api/english-adventure/'+path+(path.includes('?')?'&':'?')+'practice=1',{");
 app=app.replace("let saved={done:initial.completed,best:initial.best||0}","let saved={done:[],best:0}");
 app=app.replace("function progress(){return lessons.filter(l=>saved.done.includes(l.id)).length}","function progress(){return 0}");
 app=app.replace("if(passed&&!saved.done.includes(l.id))saved.done.push(l.id);if(isFinal)saved.best=Math.max(saved.best,state.score);",'');
 app=app.replace("<strong>${progress()} / ${lessons.length}</strong>",'<strong>معاينة</strong>');
 app=app.replaceAll('محطات اكتمل تدريبها','معاينة مؤقتة، مفيش حفظ');
 app=app.replaceAll('التقدّم مرتبط بحسابك','معاينة للأدمن فقط، مفيش حفظ أو مكافآت');
 app=app.replaceAll('تقدّمك محفوظ على حسابك بعد اكتمال المحطة.','دي معاينة مؤقتة فقط. النتيجة مش محفوظة ومش بتتحسب في الحساب.');
 app=app.replaceAll('التقدّم محفوظ على حسابك بعد اكتمال كل محطة.','المعاينة دي مش بتحفظ تقدّم، ومش بتضيف نقاط أو مكافآت.');
 app=app.replaceAll('التقدّم مرتبط بحسابك. الإجابات بتتبعت للتحقق والحفظ،','المعاينة مش مرتبطة بتقدّم الحساب. الإجابات بتتراجع مؤقتًا في الصفحة،');
 app=app.replaceAll('تقدم المحطة مش محفوظ لسه','خروج من المعاينة المؤقتة').replaceAll('المحطة بتتحفظ لما تكمّلها. تقدر تكمّل دلوقتي أو ترجع للخريطة من الزر اللي تحت.','المعاينة مش بتتحفظ. تقدر تكمّل دلوقتي أو ترجع للخريطة من الزر اللي تحت.');
 app=app.replace("$('.brand').onclick", "const banner=document.createElement('aside');banner.id='practice-banner';banner.setAttribute('role','status');banner.style.cssText='position:relative;flex:none;background:#f0c678;color:#11192f;padding:12px 16px;text-align:center;font:bold 14px/1.7 Arial';banner.textContent='معاينة خاصة للأدمن: الألعاب والشكل والصوت فقط. مفيش حفظ أو نقاط أو مكافآت. إعادة تحميل الصفحة بتبدأ جلسة جديدة.';document.body.prepend(banner);\n$('.brand').onclick");
 app=app.replaceAll('النجاح من ٨ إجابات مستقلة من ١٠ في التحدّي.','النتيجة للتجربة فقط، ومش بتتحسب في الحساب.');
 return app;
}

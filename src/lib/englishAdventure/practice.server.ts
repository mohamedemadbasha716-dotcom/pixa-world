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
 app=app.replace("'/api/english-adventure/'+path,{", "'/api/english-adventure/'+path+(path.includes('?')?'&':'?')+'practice=1',{");
 app=app.replace("let saved={done:initial.completed,best:initial.best||0}","let saved={done:[],best:0}");
 app=app.replace("function progress(){return lessons.filter(l=>saved.done.includes(l.id)).length}","function progress(){return 0}");
 app=app.replace("if(passed&&!saved.done.includes(l.id))saved.done.push(l.id);if(isFinal)saved.best=Math.max(saved.best,state.score);",'');
 app=app.replaceAll('محطات اكتمل تدريبها','معاينة مؤقتة، مفيش حفظ');
 app=app.replaceAll('التقدّم مرتبط بحسابك','معاينة للأدمن فقط، مفيش حفظ أو مكافآت');
 app=app.replaceAll('تقدّمك محفوظ على حسابك بعد اكتمال المحطة.','دي معاينة مؤقتة فقط. النتيجة مش محفوظة ومش بتتحسب في الحساب.');
 app=app.replaceAll('التقدّم محفوظ على حسابك بعد اكتمال كل محطة.','المعاينة دي مش بتحفظ تقدّم، ومش بتضيف نقاط أو مكافآت.');
 app=app.replaceAll('التقدّم مرتبط بحسابك. الإجابات بتتبعت للتحقق والحفظ،','المعاينة مش مرتبطة بتقدّم الحساب. الإجابات بتتراجع مؤقتًا في الصفحة،');
 app=app.replaceAll('تقدم المحطة مش محفوظ لسه','خروج من المعاينة المؤقتة').replaceAll('المحطة بتتحفظ لما تكمّلها. تقدر تكمّل دلوقتي أو ترجع للخريطة من الزر اللي تحت.','المعاينة مش بتتحفظ. تقدر تكمّل دلوقتي أو ترجع للخريطة من الزر اللي تحت.');
 app=app.replace("$('.brand').onclick", "const banner=document.createElement('aside');banner.id='practice-banner';banner.setAttribute('role','status');banner.style.cssText='position:sticky;top:0;z-index:100;background:#f0c678;color:#11192f;padding:12px 16px;text-align:center;font:bold 14px/1.7 Arial';banner.textContent='معاينة خاصة للأدمن: الألعاب والشكل والصوت فقط. مفيش حفظ أو نقاط أو مكافآت. إعادة تحميل الصفحة بتبدأ جلسة جديدة.';document.body.prepend(banner);\n$('.brand').onclick");
 return app;
}

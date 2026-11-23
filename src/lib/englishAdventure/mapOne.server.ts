import 'server-only';
import {allLessons} from './curriculum.server';
import {alphabetChapters} from './alphabet.draft.server';
import {ownerPracticeApp} from './practice.server';
import modules from '../../../2-english-adventure-mechanics.json';
export const mapOneModules=modules;
export const mapOneLessons=allLessons.map(l=>l.id!=='hello'?(l.id==='numbers'?{...l,name:'حديقة الأعداد'}:l):{...l,name:'ميناء الحروف واللقاء',en:'Letters and hello',goal:'تكتشف الحروف الكبيرة والصغيرة، وتتعلم التحية والتعريف بالاسم.',chapters:[...alphabetChapters.map(c=>({id:c.id,name:c.name,goal:c.goal,taskIds:c.tasks.map(t=>t.id),vocab:c.letters.flatMap(x=>[[x.upper,'اسم الحرف، مش صوته جوه الكلمة'],[x.word,x.ar]])})),{id:'greetings',name:'Hello, friend!',goal:l.goal,taskIds:l.tasks.map(t=>t.id),vocab:l.vocab}],tasks:[...alphabetChapters.flatMap(c=>c.tasks),...l.tasks]});
export function mapOneApp(source:string){
 let app=ownerPracticeApp(source);
 app="import {renderJourneyTask,wireJourneyTask,journeyStyles} from './journey?practice=1&map=1';\nimport {installSpeechPractice} from './speech?practice=1&map=1';\nconst extraStyle=document.createElement('style');extraStyle.textContent=journeyStyles;document.head.append(extraStyle);\n"+app;
 app=app.replace("'./audio'","'./audio?practice=1&map=1'").replace("'./curriculum'","'./curriculum?practice=1&map=1'");
 app=app.replace('function taskScene(t){','function taskScene(t){const extra=renderJourneyTask(t,state.selection||[]);if(extra)return extra;');
 app=app.replace('state.index++;state.load=0;','state.index++;state.load=0;state.selection=[];');
 app=app.replace('if(locked){main.querySelectorAll',"wireJourneyTask(main,t,state.selection||[],v=>{state.selection=v;state.feedback=null;renderTask()},v=>submit(v));if(locked){main.querySelectorAll");
 app=app.replace('async function overview(id){','async function overview(id,chapterId){');
 app=app.replace("state={screen:'overview'", "const fullLesson=l;const chapter=l.chapters?.find(c=>c.id===chapterId)||l.chapters?.[0];if(chapter)l={...l,en:chapter.name,goal:chapter.goal,vocab:chapter.vocab,tasks:l.tasks.filter(t=>chapter.taskIds.includes(t.id))};state={screen:'overview'");
 app=app.replace("$('#back').onclick=renderMap;", "if(fullLesson.chapters){const chapters=document.createElement('nav');chapters.className='alphabet-chapters';chapters.setAttribute('aria-label','فصول الحروف والتحية');chapters.innerHTML='<h2>اختار فصل صغير</h2><p>أسماء الحروف مش هي أصواتها. هنا بنربط شكل الحرف الكبير بالصغير وبنشوفه جوه كلمة، مش دورة أصوات كاملة.</p><div>'+fullLesson.chapters.map(c=>'<button type=\"button\" data-chapter=\"'+c.id+'\" aria-pressed=\"'+(c.id===chapter.id)+'\">'+esc(c.name)+'</button>').join('')+'</div>';main.querySelector('.intro-grid').before(chapters);chapters.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>overview(id,b.dataset.chapter));}installSpeechPractice(main,l);$('#back').onclick=renderMap;");
 app=app.replaceAll('لا نفتح الميكروفون ولا نجمع تسجيلات، ومفيش تقييم نطق.','المايك اختياري وبموافقة واضحة. المتصفح ممكن يعالج الصوت بخدمته؛ بيكسا مش بيحفظ تسجيل أو نص. مش تقييم نطق.').replaceAll('مفيش تسجيل صوت ولا تقييم نطق.','تدريب مايك اختياري في صفحة الكلمات، مش تقييم نطق.');
 app=app.replaceAll('من غير تسجيل صوت أو فتح ميكروفون.','من غير حفظ تسجيلات أو نص في بيكسا. المايك اختياري بخدمة المتصفح.');
 app=app.replaceAll('الخريطة الأولى تعلّم التحية والاسم،','الخريطة الأولى تعلّم أشكال الحروف الكبيرة والصغيرة وأسماءها وكلمات مرتبطة بها، والتحية والاسم،');
 app=app.replaceAll('شغّل قطار الكلمات، قابل أصدقاءك، واجمع نور الجزيرة.','اكتشف الحروف، قابل أصدقاءك، واجمع نور الجزيرة.').replaceAll('نكتشف الجزيرة سوا، محطة ورا محطة. جاهز نركب قطار الكلمات؟','نكتشف الجزيرة سوا، محطة ورا محطة. جاهز للمغامرة؟').replaceAll('اركب القطار','ابدأ المغامرة').replaceAll('قطار النجوم','حديقة الأعداد');
 app=app.replaceAll('/api/english-adventure/assets/islands.webp','/api/english-adventure/assets/starter-world.webp').replaceAll('/api/english-adventure/assets/harbour.webp','/api/english-adventure/assets/starter-world.webp').replaceAll('جزر خيالية متصلة بسكة قطار، فيها ميناء وحديقة وبيت ومرصد','جزيرة بداية فيها بيت شجرة وحديقة عد وبيت أسرة وزهور وبركة').replaceAll('قطار بيكسا مستعد للرحلة في الميناء','الأسد ليو يرحب بك في جزيرة البدايات');
 return app;
}
export const mapOneStyles=`.alphabet-chapters{padding:24px;background:#173b44;border:1px solid #dcbb76;border-radius:18px;margin-bottom:24px}.alphabet-chapters p{line-height:1.9}.alphabet-chapters>div{display:flex;flex-wrap:wrap;gap:10px;direction:ltr}.alphabet-chapters button{padding:14px 18px;min-height:48px;border:2px solid #8db4b5;border-radius:12px;background:#224750;color:#fff0ce;font:bold 18px Arial}.alphabet-chapters button[aria-pressed=true]{background:#f0cc86;color:#14333c;border-color:#fff0b9}`;

import 'server-only';
import packBase from '../../../5-2-english-adventure-resources.json';
import packTwo from '../../../6-2-english-adventure-resources-2.json';
import packThree from '../../../7-2-english-adventure-resources-3.json';
const pack={audio:packBase.audio,assets:{...packBase.assets,...packTwo.assets,...packThree.assets}};
import modules from '../../../2-english-adventure-mechanics.json';
import {mapTwo} from './map-two.draft.server';
import {ownerPracticeApp} from './practice.server';
export const mapTwoResources=pack;
export const mapTwoCurriculum=mapTwo;
export const mapTwoModules=modules;
export function mapTwoApp(source:string){
 let app=ownerPracticeApp(source);
 app="import {renderDiscoveryTask,wireDiscoveryTask,mechanicStyles} from './mechanics?practice=1&map=2';\nimport {installSpeechPractice} from './speech?practice=1&map=2';\nconst style=document.createElement('style');style.textContent=mechanicStyles;document.head.append(style);\n"+app;
 app=app.replace("'/api/english-adventure/'+path+(path.includes('?')?'&':'?')+'practice=1'", "'/api/english-adventure/'+path+(path.includes('?')?'&':'?')+'practice=1&map=2'");
 app=app.replace("'./audio'","'./audio?practice=1&map=2'").replace("'./curriculum'","'./curriculum?practice=1&map=2'");
 app=app.replaceAll('جزيرة البدايات','بيت الاكتشافات').replaceAll('تاج الجزيرة','مفاتيح البيت').replaceAll("id==='body'","id==='classroom-mission'").replaceAll("l.id==='body'","l.id==='classroom-mission'");
 app=app.replaceAll('/api/english-adventure/assets/islands.webp','/api/english-adventure/assets/discovery-world.webp').replaceAll('/api/english-adventure/assets/harbour.webp','/api/english-adventure/assets/discovery-rooms.webp');
 app=app.replaceAll('جزر خيالية متصلة بسكة قطار، فيها ميناء وحديقة وبيت ومرصد','بيت اكتشافات خيالي بخمس محطات بين غرف وورشة وفصل').replaceAll('قطار بيكسا مستعد للرحلة في الميناء','بيت بأربع غرف جاهزة للاكتشاف');
 app=app.replaceAll('الإنجليزية · الخريطة ١','الإنجليزية · الخريطة ٢').replaceAll('كمّلت تحدّي الخريطة الأولى.','كمّلت تحدّي بيت الاكتشافات.');
 app=app.replaceAll('شغّل قطار الكلمات، قابل أصدقاءك، واجمع نور الجزيرة.','افتح أبواب البيت، جهّز حقيبتك، واكتشف مكان كل حاجة.').replaceAll('نكتشف الجزيرة سوا، محطة ورا محطة. جاهز نركب قطار الكلمات؟','كل باب وراه مغامرة. نكتشف البيت والمدرسة سوا؟');
 app=app.replaceAll('نتعلم أجزاء الجسم، وبعدها تحدّي مراجعة جوا نفس الدرس.','نتعلم أوامر الفصل، وبعدها نراجع البيت والمدرسة جوا نفس الدرس.').replaceAll('اركب القطار','ادخل المغامرة').replaceAll('أحسنت! القطار جاهز.','أحسنت! باب جديد اتفتح.');
 app=app.replace('function renderTask(){',"function renderTask(){main.dataset.lesson=state.lesson.id;");
 app=app.replace('function taskScene(t){','function taskScene(t){const scene=renderDiscoveryTask(t,state.packed||[]);if(scene)return scene;');
 app=app.replace("if(locked){main.querySelectorAll", "wireDiscoveryTask(main,t,state.packed||[],v=>{state.packed=v;state.feedback=null;renderTask()},v=>submit(v));\nif(locked){main.querySelectorAll");
 app=app.replace('state.index++;state.load=0;','state.index++;state.load=0;state.packed=[];');
 app=app.replace("main.querySelectorAll('[data-say]').forEach", "installSpeechPractice(main,l);main.querySelectorAll('[data-say]').forEach");
 // Keep the privacy claim precise: optional speech uses the browser service only after consent.
 app=app.replaceAll('لا نفتح الميكروفون ولا نجمع تسجيلات، ومفيش تقييم نطق.','المايك اختياري بموافقة واضحة. المتصفح ممكن يعالج الصوت بخدمته، وبيكسا مش بيحفظ التسجيل أو النص. مش تقييم نطق.');
 app=app.replaceAll('مفيش تسجيل صوت ولا تقييم نطق.','المايك اختياري في صفحة الكلمات، مش تقييم نطق ولا شرط للتقدم.');
 app=app.replaceAll('الخريطة الأولى تعلّم التحية والاسم، الأعداد ١–١٠ والسن، الأسرة، ٨ ألوان وأجزاء الجسم.','الخريطة الثانية بتعلّم البيت والأثاث وأدوات المدرسة وin وon وunder وأوامر فصل بسيطة.');
 app=app.replaceAll('من غير تسجيل صوت أو فتح ميكروفون.','من غير حفظ تسجيل صوت أو النص في بيكسا. تدريب المايك اختياري وبيعتمد على خدمة المتصفح.');
 app=app.replaceAll('باقي خرائط الإنجليزية والفرنسية والإيطالية مش موجودة في الإصدار ده.','دي معاينة خاصة للخريطة الثانية، مش تسليم المنهج كله.');
 return app;
}
export const mapTwoStyles=`
/* Approved illustrated discovery world; game controls stay on readable surfaces. */
.map-intro{background:#142d36}.island-map{border-block:1px solid #e7c48055}.map-art{object-position:center}.map-shade{background:linear-gradient(#0d273522,transparent 45%,#0c243c88)}
.game-world{background:#142b38}#main[data-lesson=classroom-mission] .play-area.order,#main[data-lesson=home-furniture] .play-area.order,#main[data-lesson=home-rooms] .play-area.order{background:linear-gradient(#10293888,#102938cc),url('/api/english-adventure/assets/discovery-classroom.webp') center/cover!important}.play-area{background:linear-gradient(#16333eeb,#102631f7)!important;min-height:220px}.play-area.scene{padding:16px}.game-question{background:#142b38}.speech-practice{margin:32px 0;padding:24px;border:1px solid #84bcb38a;border-radius:18px;background:#142f3a}.speech-practice p{line-height:1.8;max-width:780px}.speech-practice select{padding:12px;max-width:100%;font:18px Arial;color:#15353c;border-radius:9px}.speech-practice label{line-height:2}.speech-practice input{width:20px;height:20px;vertical-align:middle}.speech-practice button{margin-top:10px}.position-scene{background:linear-gradient(#244655,#13323e)}
@media(max-width:600px){.play-area.scene{padding:8px}.station-title{min-width:110px;max-width:145px;font-size:13px;padding:8px 10px}.station small{font-size:10px}.speech-practice{padding:16px}.game{padding:16px 12px}.game-question{padding:22px 16px}.game-question h1{font-size:27px}.intro-postcard{transform:none}.island-map{height:auto;aspect-ratio:1/1.15;min-height:420px;overflow:hidden}.map-art{width:100%;height:100%;left:0;transform:none;object-fit:cover;opacity:1}.map-shade{background:linear-gradient(#17333b11,transparent 65%,#10263188)}.station{--x:unset!important;position:absolute;width:auto;max-width:none;min-width:0;min-height:0;display:flex;flex-direction:column;gap:0;left:var(--x)!important;top:var(--y)!important;transform:translate(-50%,-50%);padding:0;border:0;background:transparent!important;border-radius:0}.station:not(:disabled):hover{transform:translate(-50%,-53%)}.station-title{display:block;flex:none;max-width:115px;font-size:12px;white-space:normal;line-height:1.4;background:#153642ee;border:1px solid #f3cf8555;border-radius:14px;padding:6px 8px;margin-top:5px;text-align:center}.station small{display:none}.station-circle{width:40px;height:40px;font-size:19px}.station:nth-of-type(1){left:25%!important;top:61%!important}.station:nth-of-type(2){left:56%!important;top:79%!important}.station:nth-of-type(3){left:43%!important;top:30%!important}.station:nth-of-type(4){left:78%!important;top:49%!important}.station:nth-of-type(5){left:84%!important;top:11%!important}.map-caption{bottom:2px;left:2%;right:2%;font-size:9px}.map-intro{padding:20px 20px 12px}.lion-guide{margin-bottom:12px}.journey-bottom .next-stop{display:none}.journey-bottom{display:block}.finale-card{margin-top:12px}}
`;

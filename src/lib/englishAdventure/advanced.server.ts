import 'server-only';
import {mapThree} from './map-three.draft.server';
import {mapFour} from './map-four.draft.server';
import {mapFive} from './map-five.draft.server';
import {mapOneApp} from './mapOne.server';
import {mapTwoStyles} from './mapTwo.server';
export const advancedMaps={'3':mapThree,'4':mapFour,'5':mapFive};
export function advancedApp(source:string,id:keyof typeof advancedMaps){
 const map=advancedMaps[id],final=map.lessons[map.lessons.length-1].id;
 let app=mapOneApp(source).replaceAll('practice=1&map=1','practice=1&map='+id);
 app=app.replace("'/api/english-adventure/'+path+(path.includes('?')?'&':'?')+'practice=1'", "'/api/english-adventure/'+path+(path.includes('?')?'&':'?')+'practice=1&map="+id+"'");
 app="import {renderGardenTask,wireDiscoveryTask,gardenStyles} from './garden?practice=1&map="+id+"';\nimport {renderSceneTask,wireSceneTask,sceneStyles} from './scenes?practice=1&map="+id+"';\n"+app;
 app=app.replace('extraStyle.textContent=journeyStyles','extraStyle.textContent=journeyStyles+gardenStyles+sceneStyles');
 app=app.replace('const extra=renderJourneyTask(t,state.selection||[]);', 'const extra=renderJourneyTask(t,state.selection||[])||renderSceneTask(t,state.selection||[])||renderGardenTask(t,state.selection||[]);');
 app=app.replace('if(locked){main.querySelectorAll',"wireDiscoveryTask(main,t,state.selection||[],v=>{state.selection=v;state.feedback=null;renderTask()},v=>submit(v));wireSceneTask(main,t,state.selection||[],v=>{state.selection=v;state.feedback=null;renderTask()},v=>submit(v));if(locked){main.querySelectorAll");
 app=app.replaceAll('الخريطة ١','الخريطة '+id);
 app=app.replaceAll('الإنجليزية · الخريطة ١','الإنجليزية · الخريطة '+id).replaceAll('الخريطة الأولى',map.name).replaceAll('جزيرة البدايات',map.name).replaceAll('تاج الجزيرة','وسام المغامرة').replaceAll("id==='body'","id==='"+final+"'");
 app=app.replaceAll('اكتشف الحروف، قابل أصدقاءك، واجمع نور الجزيرة.',map.description).replaceAll('نكتشف الجزيرة سوا، محطة ورا محطة. جاهز للمغامرة؟','مغامرة جديدة وكلمات جديدة. خُد وقتك في كل محطة.').replaceAll('اركب القطار','ابدأ المغامرة').replaceAll('أحسنت! القطار جاهز.','أحسنت! خطوة جديدة في المغامرة.');
 app=app.replaceAll('نتعلم أجزاء الجسم، وبعدها تحدّي مراجعة جوا نفس الدرس.','نتعلم كلمات المحطة، وبعدها مراجعة الخريطة جوا نفس الدرس.');
 if(id==='5')app=app.replaceAll('/api/english-adventure/assets/starter-world.webp','/api/english-adventure/assets/festival-world.webp');
 if(id==='3'||id==='4'){const image=id==='3'?'garden-world.webp':'town-world.webp';app=app.replaceAll('/api/english-adventure/assets/starter-world.webp','/api/english-adventure/assets/'+image).replaceAll('/api/english-adventure/assets/harbour.webp','/api/english-adventure/assets/'+image).replaceAll('جزر خيالية متصلة بسكة قطار، فيها ميناء وحديقة وبيت ومرصد',id==='3'?'حديقة حيوانات وأشجار وبركة ومسار اكتشاف':'مدينة خيالية فيها بيت وحافلة ومرصد وساحة').replaceAll('قطار بيكسا مستعد للرحلة في الميناء',id==='3'?'الأسد ليو في الحديقة':'الأسد ليو في المدينة');}
 app=app.replaceAll('جزيرة بداية فيها بيت شجرة وحديقة عد وبيت أسرة وزهور وبركة',map.description).replaceAll('الأسد ليو يرحب بك في جزيرة البدايات','الأسد ليو يرحب بك في '+map.name);
 const start=app.indexOf('function about(){'),end=app.indexOf('\n',start);
 if(start<0||end<0)throw Error('advanced_about_version');
 app=app.slice(0,start)+"function about(){notice('للأهل والمعلّم','"+map.name+"، خمس محطات أصلية لتأسيس الإنجليزية. المراجعة جوه المحطة الخامسة. دي معاينة خاصة للأدمن من غير حفظ أو مكافآت. الصوت بيشتغل بزر اسمع لما التسجيل متاح، وفيه بديل قراءة واضح. تدريب المايك اختياري وبموافقة، بخدمة المتصفح ومن غير حفظ تسجيل أو نص في بيكسا. مش تقييم نطق أو شهادة مستوى.')}\n"+app.slice(end);
 return app;
}
// Private practice layout. World illustrations available for maps3/4; lesson scenes still in progress.
export const advancedStyles=mapTwoStyles.replaceAll(".game-world{background:#142b38}",'.game-world{background:#142b38}').replace(/#main\[data-lesson=classroom-mission\][\s\S]*?important\}/,'')+`.map-art{opacity:.8}.play-area{background:linear-gradient(#16333edb,#102631f2),url('/api/english-adventure/assets/garden-world.webp') center/cover!important}.game-question{background:#142b38}.scene-choices,.discovery-grid{width:100%}.timeline-strip{color:#e9d8aa}.intro-postcard img{object-fit:cover}.speech-practice{margin:28px 0}`;

export function illustratedMapStyles(id:string){if(id==='2')return '';const points=id==='1'?[[17,39],[25,73],[59,35],[66,57],[88,56]]:id==='5'?[[17,31],[33,55],[54,51],[58,77],[84,29]]:id==='3'?[[15,70],[40,43],[55,70],[86,72],[83,34]]:[[10,58],[32,57],[81,51],[43,31],[65,27]];const mobile=id==='1'?[[20,27],[20,76],[66,30],[68,58],[78,83]]:id==='5'?[[19,27],[22,75],[77,70],[51,49],[79,22]]:id==='3'?[[18,67],[40,35],[52,78],[80,63],[79,24]]:[[17,66],[47,80],[79,58],[31,24],[76,20]];return points.map(([x,y],i)=>'.station:nth-of-type('+(i+1)+'){left:'+x+'%!important;top:'+y+'%!important}').join('')+'@media(max-width:600px){.island-map{aspect-ratio:1.04;min-height:360px}.map-art{object-fit:cover}.station-title{max-width:105px}'+mobile.map(([x,y],i)=>'.station:nth-of-type('+(i+1)+'){left:'+x+'%!important;top:'+y+'%!important}').join('')+'}'+'.play-area{background:linear-gradient(#16333edb,#102631f2),url(/api/english-adventure/assets/'+(id==='1'?'starter-world.webp':id==='3'?'garden-world.webp':id==='4'?'town-world.webp':'festival-world.webp')+') center/cover!important}';}

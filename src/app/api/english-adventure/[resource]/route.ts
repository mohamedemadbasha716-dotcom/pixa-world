import {practiceNavigation,navigationStyles} from '@/lib/englishAdventure/navigation.server';
import {bundledAudio,audioPhrases} from '@/lib/englishAdventure/audio.server';
import {advancedMaps,advancedApp,advancedStyles,illustratedMapStyles} from '@/lib/englishAdventure/advanced.server';
import {mapOneLessons,mapOneApp,mapOneStyles,mapOneModules} from '@/lib/englishAdventure/mapOne.server';
import {mapTwoApp,mapTwoStyles,mapTwoCurriculum,mapTwoResources,mapTwoModules} from '@/lib/englishAdventure/mapTwo.server';
import {NextResponse} from 'next/server';
import {ownerPracticeApp} from '@/lib/englishAdventure/practice.server';
import {englishResources} from '@/lib/englishAdventure/resources.server';
import {identity,database,privateHeaders,errorStatus} from '@/lib/englishAdventure/server';
import {lessonAccess} from '@/lib/englishAdventure/access';
import {allLessons,palette} from '@/lib/englishAdventure/curriculum.server';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{resource:string}>}){
 try{const {actor}=await identity(request);const {resource}=await params;const practice=new URL(request.url).searchParams.get('practice')==='1';if(practice&&!actor.isAdmin)throw new Error('forbidden');
 const mapId=new URL(request.url).searchParams.get('map')||'1';if(!['1','2','3','4','5'].includes(mapId))throw new Error('unknown_lesson');const advanced=Object.hasOwn(advancedMaps,mapId)?advancedMaps[mapId as keyof typeof advancedMaps]:null;const second=mapId==='2';if(mapId!=='1'&&!practice)throw new Error('forbidden');const selectedLessons=advanced?advanced.lessons:second?mapTwoCurriculum.lessons:practice?mapOneLessons:allLessons;
 if(practice&&['journey','mechanics','speech','garden','scenes','device-audio'].includes(resource)){const code=resource==='device-audio'?mapTwoModules.deviceAudio:resource==='journey'?mapOneModules.journey:resource==='mechanics'?mapTwoModules.source:resource==='garden'?mapTwoModules.garden:resource==='scenes'?mapTwoModules.scenes:mapTwoModules.speech;return new Response(code,{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}});}
 if(resource==='curriculum'){const lessons=selectedLessons.map(({tasks,...lesson})=>({...lesson,tasks:[]}));return new Response('export const lessons='+JSON.stringify(lessons)+';export const allLessons=lessons;export const palette='+JSON.stringify(palette)+';',{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}})}
 if(resource==='lesson'){
 const id=new URL(request.url).searchParams.get('id')||'';
 if(practice){const lesson=selectedLessons.find(l=>l.id===id);if(!lesson)throw new Error('unknown_lesson');return Response.json(lesson,{headers:privateHeaders});}
 const {data,error}=await database().from('english_adventure_progress').select('lesson_id,completed').eq('user_id',actor.id);if(error)throw new Error('storage_unavailable');
 const access=lessonAccess(actor,id,data||[]);if(!access.allowed)throw new Error(access.reason);
 const lesson=allLessons.find(l=>l.id===id)!;return Response.json({...lesson,tasks:lesson.tasks.map(({answer,...task})=>task)},{headers:privateHeaders});
 }
 if(practice&&resource==='audio')return new Response('export const audioFiles='+JSON.stringify(bundledAudio)+';export const audioPhrases='+JSON.stringify(audioPhrases)+';',{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}});
 if(resource==='audio'){const file=englishResources.ui.audio;return new Response(file.replaceAll('assets/audio/','/api/english-adventure/assets/audio/'),{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}})}
 if(!['app','style','play'].includes(resource))return new Response('Not found',{status:404,headers:privateHeaders});
 let text=englishResources.ui[resource as 'app'|'style'|'play'];
 if(practice&&resource==='app')text=(advanced?advancedApp(text,mapId as keyof typeof advancedMaps):second?mapTwoApp(text):mapOneApp(text)).replace("'./audio'","'./audio?practice=1'").replace("'./curriculum'","'./curriculum?practice=1'");
 if(advanced&&resource==='style')text+=advancedStyles+illustratedMapStyles(mapId);else if(second&&resource==='style')text+=mapTwoStyles;else if(practice&&resource==='style')text+=mapTwoStyles+mapOneStyles+illustratedMapStyles('1');
 if(practice&&resource==='style')text+='\n.practice-map-nav{display:block!important;direction:rtl;padding:18px 24px;background:#15353d}.practice-map-nav p{display:block;width:100%;margin:0 0 12px;color:#e9d4a5}.practice-map-nav>div{display:flex;width:100%;flex-wrap:wrap;gap:10px}.practice-map-nav a{display:block;text-decoration:none;color:#fff0c9;border:1px solid #92b9b6;padding:12px 15px;min-height:44px;border-radius:12px;font:bold 14px Arial;background:#224854}.practice-map-nav a[aria-current=page]{background:#edc779;color:#173b43;border-color:#ffe3a1}.sentence-track .word:disabled{visibility:visible;opacity:1}.game-world.solved .play-area button:disabled{opacity:1}';
 if(practice&&resource==='app')text=practiceNavigation(text);
 if(practice&&resource==='style')text+=navigationStyles;
 if(resource==='style')text=text.replaceAll('assets/','/api/english-adventure/assets/');
 if(resource==='play')text=text.replace('href="styles.css"','href="style"').replace('src="app.js"','src="app"').replace('لا تحتاج إلى حساب أو تسجيل صوت.','الدخول بحسابك مطلوب. مفيش تسجيل صوت.');
 if(practice&&resource==='play')text=text.replace('href="style"','href="style?practice=1&map='+mapId+'"');
 if(practice&&resource==='play')text=text.replaceAll('الخريطة ١','الخريطة '+mapId);
 if(practice&&resource==='play')text=text.replace('src="app"','src="app?practice=1&map='+mapId+'"');
 return new Response(text,{headers:{...privateHeaders,'Content-Type':resource==='play'?'text/html; charset=utf-8':resource==='style'?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'"}});
 }catch(error){return NextResponse.json({error:'sign_in_required'},{status:errorStatus(error),headers:privateHeaders})}
}

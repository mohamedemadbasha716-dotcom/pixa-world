import {NextResponse} from 'next/server';
import {englishResources} from '@/lib/englishAdventure/resources.server';
import {identity,database,privateHeaders,errorStatus} from '@/lib/englishAdventure/server';
import {lessonAccess} from '@/lib/englishAdventure/access';
import {allLessons,palette} from '@/lib/englishAdventure/curriculum.server';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{resource:string}>}){
 try{const {actor}=await identity(request);const {resource}=await params;
 if(resource==='curriculum'){const lessons=allLessons.map(({tasks,...lesson})=>({...lesson,tasks:[]}));return new Response('export const lessons='+JSON.stringify(lessons)+';export const allLessons=lessons;export const palette='+JSON.stringify(palette)+';',{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}})}
 if(resource==='lesson'){
 const id=new URL(request.url).searchParams.get('id')||'';
 const {data,error}=await database().from('english_adventure_progress').select('lesson_id,completed').eq('user_id',actor.id);if(error)throw new Error('storage_unavailable');
 const access=lessonAccess(actor,id,data||[]);if(!access.allowed)throw new Error(access.reason);
 const lesson=allLessons.find(l=>l.id===id)!;return Response.json({...lesson,tasks:lesson.tasks.map(({answer,...task})=>task)},{headers:privateHeaders});
 }
 if(resource==='audio'){const file=englishResources.ui.audio;return new Response(file.replaceAll('assets/audio/','/api/english-adventure/assets/audio/'),{headers:{...privateHeaders,'Content-Type':'text/javascript; charset=utf-8'}})}
 if(!['app','style','play'].includes(resource))return new Response('Not found',{status:404,headers:privateHeaders});
 let text=englishResources.ui[resource as 'app'|'style'|'play'];
 if(resource==='style')text=text.replaceAll('assets/','/api/english-adventure/assets/');
 if(resource==='play')text=text.replace('href="styles.css"','href="style"').replace('src="app.js"','src="app"').replace('لا تحتاج إلى حساب أو تسجيل صوت.','الدخول بحسابك مطلوب. مفيش تسجيل صوت.');
 return new Response(text,{headers:{...privateHeaders,'Content-Type':resource==='play'?'text/html; charset=utf-8':resource==='style'?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'"}});
 }catch(error){return NextResponse.json({error:'sign_in_required'},{status:errorStatus(error),headers:privateHeaders})}
}

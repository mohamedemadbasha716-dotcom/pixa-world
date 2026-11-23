import {NextResponse} from 'next/server';
import {identity,database,privateHeaders,errorStatus,safeMutation} from '@/lib/englishAdventure/server';
async function bootstrap(request:Request,setCookie:boolean){
 try{if(setCookie)safeMutation(request);const {actor,token}=await identity(request);
 if(new URL(request.url).searchParams.get('practice')==='1'){if(!actor.isAdmin)throw new Error('forbidden');const response=NextResponse.json({userId:actor.id,admin:true,practice:true,completed:[],best:0},{headers:privateHeaders});if(setCookie)response.cookies.set('pixa_english_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/english-adventure',maxAge:3600});return response;}
 const {data,error}=await database().from('english_adventure_progress').select('lesson_id,completed,best_score').eq('user_id',actor.id);
 if(error)throw new Error('storage_unavailable');
 const response=NextResponse.json({userId:actor.id,admin:actor.isAdmin,completed:(data||[]).filter(p=>p.completed).map(p=>p.lesson_id),best:Math.max(0,...(data||[]).map(p=>p.best_score||0))},{headers:privateHeaders});
 if(setCookie)response.cookies.set('pixa_english_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/english-adventure',maxAge:3600});
 return response;}catch(error){return NextResponse.json({error:'account_or_storage_unavailable'},{status:errorStatus(error),headers:privateHeaders});}
}
export async function GET(request:Request){return bootstrap(request,false)}
export async function POST(request:Request){return bootstrap(request,true)}
export async function DELETE(request:Request){
 try{safeMutation(request);const response=NextResponse.json({ok:true},{headers:privateHeaders});response.cookies.set('pixa_english_session','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/english-adventure',maxAge:0});return response}
 catch{return NextResponse.json({error:'forbidden'},{status:403,headers:privateHeaders})}
}

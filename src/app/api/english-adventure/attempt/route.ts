import {NextResponse} from 'next/server';
import {identity,database,privateHeaders,errorStatus,safeMutation} from '@/lib/englishAdventure/server';
import {beginAttempt,acceptAnswer,type Attempt} from '@/lib/englishAdventure/session';
import {allLessons} from '@/lib/englishAdventure/curriculum.server';
export async function POST(request:Request){
 try{
  safeMutation(request);const {actor}=await identity(request);const db=database();
  const body=await request.json();if(JSON.stringify(body).length>2048)throw new Error('forbidden');
  const lesson=allLessons.find(l=>l.id===body.lessonId);if(!lesson)throw new Error('unknown_lesson');
  const {data:progress,error:pe}=await db.from('english_adventure_progress').select('lesson_id,completed').eq('user_id',actor.id);if(pe)throw new Error('storage_unavailable');
  if(body.action==='begin'){
   const state=beginAttempt(actor,lesson.id,progress||[]);
   const {data,error}=await db.from('english_adventure_attempts').insert({user_id:actor.id,lesson_id:lesson.id,state,revision:0}).select('id').single();
   if(error)throw new Error('storage_unavailable');
   return NextResponse.json({attemptId:data.id,index:0,revision:0},{headers:privateHeaders});
  }
  if(body.action!=='answer'||typeof body.attemptId!=='string'||typeof body.taskId!=='string'||!['string','number'].includes(typeof body.answer)||typeof body.readingAlternative!=='boolean')throw new Error('forbidden');
  const {data:row,error:re}=await db.from('english_adventure_attempts').select('id,state,revision,lesson_id').eq('id',body.attemptId).eq('user_id',actor.id).single();
  if(re||!row||row.lesson_id!==lesson.id)throw new Error('forbidden');
  if(row.revision!==body.revision)throw new Error('conflict');
  const previous=row.state as Attempt;
  if(previous.index>=lesson.tasks.length)throw new Error('conflict');
  const task=lesson.tasks[previous.index];
  const state=acceptAnswer(actor,previous,lesson.tasks,body.taskId,body.answer,body.readingAlternative);
  const correct=String(task.answer).trim()===String(body.answer).trim();
  // Atomic compare-and-swap plus progress persistence. Function is service-role only.
  const {error}=await db.rpc('english_adventure_save_answer',{p_attempt:row.id,p_user:actor.id,p_revision:row.revision,p_state:state,p_completed:state.complete,p_lesson:lesson.id,p_score:state.reviewScore});
  if(error)throw new Error(error.message.includes('conflict')?'conflict':'storage_unavailable');
  return NextResponse.json({correct,index:state.index,revision:row.revision+1,complete:state.complete,score:state.reviewScore,finished:state.index===lesson.tasks.length},{headers:privateHeaders});
 }catch(error){return NextResponse.json({error:'answer_not_saved'},{status:errorStatus(error),headers:privateHeaders})}
}

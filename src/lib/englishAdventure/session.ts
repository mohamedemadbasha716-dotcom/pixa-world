import { lessonAccess, type VerifiedActor, type ProgressRecord } from './access';
export type TaskAnswer = {id:string;answer:string|number;review?:boolean;listening?:boolean};
export type Attempt = {userId:string;lessonId:string;index:number;reviewScore:number;usedReading:boolean;complete:boolean};
export function beginAttempt(actor:VerifiedActor,lessonId:string,progress:ProgressRecord[]):Attempt {
  const access=lessonAccess(actor,lessonId,progress);
  if(!access.allowed)throw new Error(access.reason);
  return {userId:actor.id,lessonId,index:0,reviewScore:0,usedReading:false,complete:false};
}
export function acceptAnswer(actor:VerifiedActor,attempt:Attempt,tasks:ReadonlyArray<TaskAnswer>,taskId:string,answer:string|number,readingAlternative:boolean):Attempt {
  if(actor.id!==attempt.userId)throw new Error('forbidden');
  if(attempt.complete)throw new Error('attempt_complete');
  const task=tasks[attempt.index];
  if(!task||task.id!==taskId)throw new Error('out_of_sequence');
  const correct=String(answer).trim()===String(task.answer).trim();
  if(!task.review&&!correct)return {...attempt};
  const index=attempt.index+1;
  const reviewScore=attempt.reviewScore+(task.review&&correct&&!(task.listening&&readingAlternative)?1:0);
  const final=index===tasks.length;
  const reviewCount=tasks.filter(t=>t.review).length;
  const required=Math.ceil(reviewCount*.8);
  return {...attempt,index,reviewScore,usedReading:attempt.usedReading||readingAlternative,complete:final&&(reviewCount===0||reviewScore>=required)};
}

import {PGlite} from '/tmp/pixa-sql-rehearsal/node_modules/@electric-sql/pglite/dist/index.js';
import {readFile} from 'node:fs/promises';
const db=new PGlite();
await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated,service_role;insert into auth.users values('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');`);
await db.exec(await readFile(new URL('../../supabase/proposals/english-adventure.sql',import.meta.url),'utf8'));
const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002';
await db.exec(`insert into public.english_adventure_progress(user_id,lesson_id,completed) values('${a}','hello',true),('${b}','hello',true);set role authenticated;set request.jwt.claim.sub='${a}';`);
let rows=(await db.query('select user_id from public.english_adventure_progress')).rows;if(rows.length!==1||rows[0].user_id!==a)throw Error('RLS failed');
let denies=0;
for(const sql of [`insert into public.english_adventure_progress(user_id,lesson_id) values('${a}','numbers')`,`select * from public.english_adventure_attempts`,`select public.english_adventure_save_answer(gen_random_uuid(),'${a}',0,'{}',true,'hello',10)`]){try{await db.exec(sql)}catch{denies++}}
if(denies!==3)throw Error('Direct client operation allowed');
await db.exec('reset role;set role anon;');try{await db.exec('select * from public.english_adventure_progress');throw Error('anon allowed')}catch(e){if(e.message==='anon allowed')throw e}
await db.exec(`reset role;set role service_role;`);
const id=(await db.query(`insert into public.english_adventure_attempts(user_id,lesson_id,state) values('${a}','numbers','{}') returning id`)).rows[0].id;
await db.query(`select public.english_adventure_save_answer($1,$2,0,$3,true,'numbers',8)`,[id,a,{complete:true,index:8}]);
rows=(await db.query(`select best_score from public.english_adventure_progress where user_id=$1 and lesson_id='numbers'`,[a])).rows;if(rows[0]?.best_score!==8)throw Error('RPC did not save');
let conflict=false;try{await db.query(`select public.english_adventure_save_answer($1,$2,0,'{}',true,'numbers',10)`,[id,a])}catch{conflict=true}if(!conflict)throw Error('Revision replay accepted');
let wrong=false;try{await db.query(`select public.english_adventure_save_answer($1,$2,1,'{}',true,'numbers',10)`,[id,b])}catch{wrong=true}if(!wrong)throw Error('Cross user update');
console.log(JSON.stringify({status:'pass',engine:'isolated PostgreSQL PGlite',migration:true,ownUserReadOnly:true,anonymousDenied:true,directAttemptAndRpcDenied:true,transactionalSave:true,replayAndCrossAccountDenied:true,liveDatabase:false}));await db.close();

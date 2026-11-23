// Local only, isolated fake auth/storage. No live provider traffic or user records.
import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from '/downloads/pixa-english-world/node_modules/playwright-core/index.mjs';
const root=process.env.PIXA_QA_ROOT||new URL('../..',import.meta.url).pathname.replace(/\/$/,'');
const curriculum=await import('data:text/javascript;base64,'+Buffer.from((await readFile(root+'/src/lib/englishAdventure/curriculum.server.js','utf8')).replace("import 'server-only';",'')).toString('base64'));
const progress=new Map(),attempts=new Map();let seq=0,failSave=false;
const backend=createServer(async(req,res)=>{let raw='';for await(const c of req)raw+=c;const body=raw?JSON.parse(raw):{};const u=new URL(req.url,'http://localhost');const auth=req.headers.authorization||'';const uid=auth.includes('member-a')?'user-a':auth.includes('member-b')?'user-b':auth.includes('owner-preview')?'user-admin':null;const json=(v,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(v))};
 if(u.pathname==='/auth/v1/user')return uid?json({id:uid,email:uid+'@example.invalid',email_confirmed_at:'2026-01-01T00:00:00Z',is_anonymous:false}):json({message:'Invalid token'},401);
 if(u.pathname==='/rest/v1/rpc/pixa_is_owner')return uid?json(uid==='user-admin'):json({error:'unauthenticated'},401);
 if(auth!=='Bearer local-service-test')return json({error:'forbidden'},403);
 const user=u.searchParams.get('user_id')?.slice(3);
 if(u.pathname==='/rest/v1/english_adventure_progress')return json(progress.get(user)||[]);
 if(u.pathname==='/rest/v1/english_adventure_attempts'){
 if(req.method==='POST'){const id='attempt-'+(++seq);attempts.set(id,{...body,id});return json({id})}
 const id=u.searchParams.get('id')?.slice(3),row=attempts.get(id);return row&&row.user_id===user?json(row):json({error:'not found'},404);
 }
 if(u.pathname==='/rest/v1/rpc/english_adventure_save_answer'){if(failSave)return json({message:'storage down'},500);
 const row=attempts.get(body.p_attempt);if(!row||row.user_id!==body.p_user||row.revision!==body.p_revision)return json({message:'conflict'},409);
 row.state=body.p_state;row.revision++;if(body.p_completed){const ps=progress.get(body.p_user)||[];const old=ps.find(p=>p.lesson_id===body.p_lesson);if(old)old.best_score=Math.max(old.best_score,body.p_score);else ps.push({lesson_id:body.p_lesson,completed:true,best_score:body.p_score});progress.set(body.p_user,ps)}return json(null);
 }json({error:'unknown'},404);
}).listen(19999,'127.0.0.1');
await new Promise(r=>backend.once('listening',r));
const proc=spawn('node',['node_modules/next/dist/bin/next','start','-p','19998'],{cwd:root,env:{...process.env,NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:19999',NEXT_PUBLIC_SUPABASE_ANON_KEY:'local-anon-test',SUPABASE_SERVICE_ROLE_KEY:'local-service-test'}});proc.stdout.on('data',()=>{});proc.stderr.on('data',c=>process.stderr.write(c));
const base='http://127.0.0.1:19998',origin=base;let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 const anon=await fetch(base+'/api/english-adventure/play');if(anon.status!==401)throw Error('anonymous leak');
 browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){setTimeout(()=>this.onended?.(),0);return Promise.resolve()}});
 const response=await page.request.post(base+'/api/english-adventure/bootstrap',{headers:{origin,Authorization:'Bearer member-a'},data:{}});if(!response.ok())throw Error('Bootstrap '+response.status());
 await page.goto(base+'/api/english-adventure/play');await page.locator('[data-lesson=hello]').first().waitFor();
 const locked=await page.request.get(base+'/api/english-adventure/lesson?id=body');if(locked.status()!==403)throw Error('sequence bypass');
 const curr=await (await page.request.get(base+'/api/english-adventure/curriculum')).text();if(curr.includes('answer')||curr.includes('Nora arrives'))throw Error('answer/content leak');
 await page.locator('[data-lesson=body]').first().click();if(!await page.locator('#dialog').isVisible())throw Error('locked UI');await page.locator('#close-dialog').click();
 await mkdir(root+'/english-qa',{recursive:true});
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});await page.screenshot({path:root+'/english-qa/map-'+width+'.png',fullPage:true});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('overflow map')}
 let count=0;
 for(const lesson of curriculum.allLessons){await page.locator('[data-lesson="'+lesson.id+'"]').first().click();await page.locator('#start').click();for(const t of lesson.tasks){await page.setViewportSize({width:390,height:844});if(t.spoken){await page.locator('#listen').click();await page.waitForFunction(()=>!document.querySelector('[data-value]').disabled)}
 if(t.id==='h1'){await page.locator('[data-value="Goodbye!"]').click();await page.locator('.feedback.retry strong').waitFor();if(await page.locator('#next').count())throw Error('wrong advance')}
 if(t.type==='load'){for(let i=0;i<t.answer;i++)await page.locator('#plus').click();await page.locator('#submit-load').click()}else if(t.type==='order'){const used=new Set();for(const word of t.answer.split(' ')){const ix=t.words.findIndex((w,i)=>w===word&&!used.has(i));used.add(ix);await page.locator('[data-word="'+ix+'"]').click()}await page.locator('#submit-order').click()}else await page.locator('[data-value="'+t.answer+'"]').click();
 await page.locator('#next').waitFor();if(count%8===0)await page.screenshot({path:root+'/english-qa/task-'+t.id+'.png',fullPage:true});await page.locator('#next').click();count++;
 }await page.locator('#return-map').click()}
 if(progress.get('user-a')?.length!==5)throw Error('completion not persisted');await page.reload();await page.locator('.completed').first().waitFor();if(await page.locator('.station.completed').count()!==5)throw Error('reload lost progress');
 await page.screenshot({path:root+'/english-qa/completed.png',fullPage:true});
 await page.request.post(base+'/api/english-adventure/bootstrap',{headers:{origin,Authorization:'Bearer member-b'},data:{}});const b=await (await page.request.get(base+'/api/english-adventure/bootstrap')).json();if(b.completed.length)throw Error('cross account leak');
 const forged=await page.request.post(base+'/api/english-adventure/attempt',{headers:{origin},data:{action:'answer',lessonId:'hello',attemptId:'attempt-1',revision:0,taskId:'h1',answer:'Hello!',readingAlternative:false}});if(forged.status()!==403)throw Error('cross account mutation');
 const csrf=await page.request.post(base+'/api/english-adventure/attempt',{headers:{origin:'https://other.invalid'},data:{action:'begin',lessonId:'hello'}});if(csrf.status()!==403)throw Error('CSRF accepted');
 // Save failure must not advance server attempt or unlock progress.
 const begin=await (await page.request.post(base+'/api/english-adventure/attempt',{headers:{origin},data:{action:'begin',lessonId:'hello'}})).json();
 failSave=true;
 const saveBody={action:'answer',lessonId:'hello',attemptId:begin.attemptId,revision:0,taskId:'h1',answer:'Hello!',readingAlternative:false};
 const failure=await page.request.post(base+'/api/english-adventure/attempt',{headers:{origin},data:saveBody});
 if(failure.status()!==503||attempts.get(begin.attemptId).state.index!==0||(progress.get('user-b')||[]).length)throw Error('failed save advanced');
 failSave=false;
 const parallel=await Promise.all([1,2].map(()=>page.request.post(base+'/api/english-adventure/attempt',{headers:{origin},data:saveBody})));
 if(parallel.filter(r=>r.status()===200).length!==1||parallel.filter(r=>r.status()===409).length!==1)throw Error('parallel replay accepted');
 // A separate browser gets account A progress, not localStorage progress.
 const second=await browser.newContext();await second.request.post(base+'/api/english-adventure/bootstrap',{headers:{origin,Authorization:'Bearer member-a'},data:{}});
 const synced=await (await second.request.get(base+'/api/english-adventure/bootstrap')).json();if(synced.completed.length!==5)throw Error('cross browser sync');await second.close();
 // Verified server-configured owner preview, not client flags, bypasses sequence.
 await page.request.post(base+'/api/english-adventure/bootstrap',{headers:{origin,Authorization:'Bearer owner-preview'},data:{}});
 if(!(await page.request.get(base+'/api/english-adventure/lesson?id=body')).ok())throw Error('owner preview denied');
 const badBegin=await (await page.request.post(base+'/api/english-adventure/attempt',{headers:{origin},data:{action:'begin',lessonId:'body'}})).json();
 let revision=0;
 for(const t of curriculum.allLessons[4].tasks){const reading=!!t.listening;const result=await (await page.request.post(base+'/api/english-adventure/attempt',{headers:{origin},data:{action:'answer',lessonId:'body',attemptId:badBegin.attemptId,revision,taskId:t.id,answer:t.review?'incorrect':t.answer,readingAlternative:reading}})).json();revision=result.revision;}
 if((progress.get('user-admin')||[]).length)throw Error('failed review completed');
 await page.request.delete(base+'/api/english-adventure/bootstrap',{headers:{origin},data:{}});if((await page.request.get(base+'/api/english-adventure/play')).status()!==401)throw Error('logout retained access');
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({status:'pass',activities:count,widths:[320,390,1280],anonymousDenied:true,sequenceDenied:true,persisted:true,crossAccountDenied:true,csrfDenied:true,fakeBackendOnly:true,failedSaveNoUnlock:true,concurrentReplayDenied:true,separateBrowserSync:true,ownerPreview:true,failedReviewNoCompletion:true,logoutDenied:true}));
}finally{await browser?.close();proc.kill();backend.close()}

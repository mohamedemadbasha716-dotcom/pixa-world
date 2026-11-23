// Optional ungraded browser speech-text practice. No app recording or transcript storage.
export const normalizeSpeech=s=>String(s).normalize('NFKC').toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();
export const speechMatches=(heard,target)=>normalizeSpeech(heard)===normalizeSpeech(target);
export function createSpeechPractice({Recognition,onState,timeoutMs=9000,setTimer=setTimeout,clearTimer=clearTimeout}){
 let active=null,timer=null,serial=0;
 const clear=()=>{if(timer!==null)clearTimer(timer);timer=null};
 function cancel(){serial++;clear();if(active){const r=active;active=null;r.onresult=r.onerror=r.onend=r.onnomatch=null;try{r.abort()}catch{}}}
 function start(target){cancel();if(!Recognition){onState({kind:'unsupported'});return false}const generation=serial;let settled=false;const r=new Recognition;active=r;r.lang='en-GB';r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
  const done=value=>{if(generation!==serial||settled)return;settled=true;clear();active=null;r.onresult=r.onerror=r.onend=r.onnomatch=null;try{r.abort()}catch{}onState(value)};
  r.onresult=e=>{const transcript=e.results?.[0]?.[0]?.transcript||'';done({kind:transcript?'result':'no-speech',transcript,matched:speechMatches(transcript,target)})};
  r.onerror=e=>done({kind:'error',error:e.error});r.onend=()=>done({kind:'no-speech'});r.onnomatch=()=>done({kind:'no-speech'});
  timer=setTimer(()=>done({kind:'timeout'}),timeoutMs);try{r.start();onState({kind:'listening'});return true}catch{done({kind:'error',error:'start-failed'});return false}
 }
 return{start,cancel};
}
export function installSpeechPractice(root,lesson){
 root.querySelector('#speech-practice')?.remove();const targets=lesson.vocab.map(x=>x[0]);const panel=document.createElement('section');panel.id='speech-practice';panel.className='speech-practice';panel.innerHTML='<h2>جرّب تقولها</h2><p>تدريب اختياري على التعرّف على الكلام، مش تقييم نطق ومفيش نقاط. المتصفح ممكن يرسل الصوت لخدمة التعرّف التابعة له، وبيكسا مش بيحفظ تسجيل أو النص. لو مش مناسب، كمل الألعاب من غير مايك.</p><label>اختار كلمة أو جملة <select id="speech-target" lang="en" dir="ltr"></select></label><p><label><input id="speech-consent" type="checkbox"> موافق أستخدم تعرّف المتصفح على الكلام في المحاولة دي.</label></p><button id="speech-start" class="primary">ابدأ المايك</button> <button id="speech-cancel" class="secondary">إيقاف</button><p id="speech-status" role="status" aria-live="polite"></p>';
 root.querySelector('.lesson-intro')?.append(panel);const select=panel.querySelector('select');targets.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;select.append(o)});
 const status=panel.querySelector('#speech-status'),start=panel.querySelector('#speech-start'),consent=panel.querySelector('#speech-consent');
 const controller=createSpeechPractice({Recognition:window.SpeechRecognition||window.webkitSpeechRecognition,onState:s=>{start.disabled=s.kind==='listening';if(s.kind==='listening')status.textContent='المايك شغّال. قول العبارة مرة واحدة، ثم استنى.';else if(s.kind==='result')status.textContent=s.matched?'المتصفح كتب نفس العبارة. جرّب كلمة جديدة لو تحب.':'المتصفح سمع: '+s.transcript+'. مش نفس العبارة، اسمعها وجرب تاني، أو كمل من غير مايك.';else if(s.kind==='unsupported')status.textContent='التعرّف على الكلام مش مدعوم في المتصفح ده. الألعاب متاحة من غير مايك.';else if(s.kind==='error')status.textContent=['not-allowed','service-not-allowed'].includes(s.error)?'إذن المايك مش متاح. تقدر تسمح بيه من إعدادات المتصفح أو تكمل من غيره.':'التعرّف توقف أو الشبكة مش متاحة. جرّب تاني أو كمل من غير مايك.';else status.textContent='مفيش كلام واضح وصل. المايك اتوقف، جرب تاني لو تحب.';if(s.kind!=='listening')consent.checked=false;}});
 start.onclick=()=>{if(!consent.checked){status.textContent='اقرأ تنبيه الصوت ووافق لو حابب تجرب، أو كمل من غير مايك.';return}controller.start(select.value)};
 const stop=()=>{controller.cancel();start.disabled=false;consent.checked=false;status.textContent='المايك اتوقف.'};panel.querySelector('#speech-cancel').onclick=stop;select.onchange=stop;
 const observer=new MutationObserver(()=>{if(!panel.isConnected){controller.cancel();observer.disconnect();document.removeEventListener('visibilitychange',visibility)}});observer.observe(root,{childList:true,subtree:true});const visibility=()=>{if(document.hidden)stop()};document.addEventListener('visibilitychange',visibility);return controller;
}

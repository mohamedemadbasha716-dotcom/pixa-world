// Device English playback for missing clips. Bundled recordings remain first choice.
export function selectEnglishVoice(voices){const english=voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang));return english.find(v=>/^en[-_]GB$/i.test(v.lang)&&/Google|Natural|Daniel|Serena|Arthur/i.test(v.name))||english.find(v=>/^en[-_]GB$/i.test(v.lang))||english.find(v=>/^en[-_]US$/i.test(v.lang))||english[0]||null;}
export function letterNameText(letter){if(!/^[A-Z]$/i.test(letter))throw Error('invalid_letter');return letter.toUpperCase()==='Z'?'The letter zed.':'The letter '+letter.toUpperCase()+'.';}
export function createEnglishDeviceAudio({synthesis,Utterance,onState,setTimer=setTimeout,clearTimer=clearTimeout}){
 let serial=0,current=null,timer=null,voiceListener=null;
 const cleanup=()=>{if(timer!==null)clearTimer(timer);timer=null;if(voiceListener&&synthesis?.removeEventListener)synthesis.removeEventListener('voiceschanged',voiceListener);voiceListener=null;if(current){current.onend=current.onerror=current.onstart=null;current=null}};
 function stop(){serial++;cleanup();try{synthesis?.cancel()}catch{}onState({kind:'stopped'})}
 function start(text,{letter=false}={}){stop();const run=serial;if(!synthesis||!Utterance){onState({kind:'unsupported'});return false}const spoken=letter?letterNameText(text):String(text).trim();if(!spoken){onState({kind:'empty'});return false}
 const fail=kind=>{if(run!==serial)return;cleanup();onState({kind})};
 const speak=()=>{if(run!==serial)return;const voice=selectEnglishVoice(synthesis.getVoices());if(!voice){fail('no-english-voice');return}cleanup();const u=new Utterance(spoken);current=u;u.voice=voice;u.lang=voice.lang;u.rate=letter?.78:.88;u.pitch=1;u.volume=1;let started=false;
 u.onstart=()=>{if(run===serial){started=true;onState({kind:'speaking',voice:voice.name,lang:voice.lang})}};
 u.onend=()=>{if(run!==serial)return;cleanup();onState({kind:started?'ended':'unconfirmed-end'})};u.onerror=e=>{if(run!==serial)return;cleanup();onState({kind:'error',error:e.error})};
 timer=setTimer(()=>{if(run!==serial)return;cleanup();serial++;try{synthesis.cancel()}catch{}onState({kind:'timeout'})},Math.max(12000,spoken.length*160));
 try{synthesis.speak(u);onState({kind:'requested',voice:voice.name,lang:voice.lang})}catch{fail('error')}
 };
 const voices=synthesis.getVoices();if(voices.length){speak();return true}onState({kind:'loading-voices'});voiceListener=()=>{if(synthesis.getVoices().length)speak()};synthesis.addEventListener?.('voiceschanged',voiceListener);timer=setTimer(()=>{timer=null;if(run===serial)speak()},2000);return true;
 }
 return{start,stop};
}

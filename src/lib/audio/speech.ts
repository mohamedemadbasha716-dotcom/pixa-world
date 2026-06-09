// ═══════════════════════════════════════════════════════════════
// 🎙️ Speech.ts - نظام النطق الموحّد (StreamElements TTS)
// صوت راجل ألماني دقيق - نفس الصوت على كل الأجهزة
// ═══════════════════════════════════════════════════════════════

let currentAudio: HTMLAudioElement | null = null;

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 🗣️ النطق الموحّد - StreamElements TTS
 * صوت Hans الراجل الألماني - نفس الصوت في كل الأجهزة
 */
export function speak(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined') return;
  
  stopSpeaking();
  
  const cleanText = text.trim();
  if (!cleanText) return;
  
  try {
    const encodedText = encodeURIComponent(cleanText);
    
    // 🎯 StreamElements TTS - صوت راجل ألماني (Hans)
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Hans&text=${encodedText}`;
    
    const audio = new Audio(url);
    audio.playbackRate = options.rate ?? 0.9;
    audio.volume = options.volume ?? 1.0;
    
    audio.play().catch(err => {
      console.warn('🔇 StreamElements failed, trying Google TTS:', err);
      fallbackToGoogleTTS(cleanText, options);
    });
    
    currentAudio = audio;
  } catch (err) {
    console.warn('TTS Error:', err);
    fallbackToGoogleTTS(cleanText, options);
  }
}

/**
 * 🔄 Fallback 1: Google Translate TTS
 */
function fallbackToGoogleTTS(text: string, options: SpeechOptions = {}) {
  try {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=de&client=tw-ob`;
    
    const audio = new Audio(url);
    audio.playbackRate = options.rate ?? 0.85;
    audio.volume = options.volume ?? 1.0;
    
    audio.play().catch(() => fallbackToBrowserTTS(text, options));
    currentAudio = audio;
  } catch {
    fallbackToBrowserTTS(text, options);
  }
}

/**
 * 🔄 Fallback 2: صوت المتصفح
 */
function fallbackToBrowserTTS(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = options.rate ?? 0.85;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(v => v.lang.startsWith('de'));
  if (germanVoice) utterance.voice = germanVoice;
  
  window.speechSynthesis.speak(utterance);
}

/**
 * 🔤 نطق حرف (بطيء وواضح)
 */
export function speakLetter(letter: string) {
  speak(letter, { rate: 0.75 });
}

/**
 * 📝 نطق كلمة
 */
export function speakWord(word: string) {
  speak(word, { rate: 0.9 });
}

/**
 * 🔢 نطق رقم
 */
export function speakNumber(text: string) {
  speak(text, { rate: 0.85 });
}

/**
 * 💬 نطق جملة كاملة
 */
export function speakSentence(sentence: string) {
  speak(sentence, { rate: 0.95 });
}

/**
 * ⏹️ إيقاف النطق
 */
export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 🔍 دالة تشخيصية (للتوافق)
 */
export function logAvailableGermanVoices() {
  console.log('🎙️ Using StreamElements TTS - Voice: Hans (German Male)');
}

/**
 * 🎯 للتوافق مع الكود القديم
 */
export function getBestGermanVoice(): SpeechSynthesisVoice | null {
  return null;
}
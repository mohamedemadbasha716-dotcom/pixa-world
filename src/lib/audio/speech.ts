// ═══════════════════════════════════════════════════════════════
// 🎙️ Speech.ts - نظام النطق الموحّد (Google Translate TTS)
// نفس الصوت على كل الأجهزة - بدون أي تسجيل أو API Key
// ═══════════════════════════════════════════════════════════════

let currentAudio: HTMLAudioElement | null = null;
const audioCache = new Map<string, string>();

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 🗣️ النطق الموحّد - Google Translate TTS
 * نفس الصوت الأنثوي الألماني على كل الأجهزة
 */
export function speak(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined') return;
  
  // إيقاف أي صوت شغال
  stopSpeaking();
  
  const cleanText = text.trim();
  if (!cleanText) return;
  
  // Cache key
  const cacheKey = cleanText.toLowerCase();
  
  try {
    const encodedText = encodeURIComponent(cleanText);
    
    // Google Translate TTS - صوت موحّد
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=de&client=tw-ob&ttsspeed=1`;
    
    const audio = new Audio(url);
    audio.playbackRate = options.rate ?? 0.85;
    audio.volume = options.volume ?? 1.0;
    
    audio.play().catch(err => {
      console.warn('🔇 Google TTS failed, using browser fallback:', err);
      fallbackToBrowserTTS(cleanText, options);
    });
    
    currentAudio = audio;
  } catch (err) {
    console.warn('TTS Error:', err);
    fallbackToBrowserTTS(cleanText, options);
  }
}

/**
 * 🔄 Fallback لو Google TTS فشل (لو في مشكلة نت)
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
  const germanVoice = voices.find(v => 
    v.name.includes('Google') && v.lang.startsWith('de')
  ) || voices.find(v => v.lang.startsWith('de'));
  
  if (germanVoice) utterance.voice = germanVoice;
  
  window.speechSynthesis.speak(utterance);
}

/**
 * 🔤 نطق حرف (بطيء وواضح)
 */
export function speakLetter(letter: string) {
  speak(letter, { rate: 0.7 });
}

/**
 * 📝 نطق كلمة
 */
export function speakWord(word: string) {
  speak(word, { rate: 0.85 });
}

/**
 * 🔢 نطق رقم
 */
export function speakNumber(text: string) {
  speak(text, { rate: 0.8 });
}

/**
 * 💬 نطق جملة كاملة
 */
export function speakSentence(sentence: string) {
  speak(sentence, { rate: 0.9 });
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
 * 🔍 دالة تشخيصية (للتوافق مع الكود القديم)
 */
export function logAvailableGermanVoices() {
  console.log('🎙️ Using Google Translate TTS - Unified voice across all devices');
}

/**
 * 🎯 للتوافق مع الكود القديم
 */
export function getBestGermanVoice(): SpeechSynthesisVoice | null {
  return null;
}
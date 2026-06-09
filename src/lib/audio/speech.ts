// ═══════════════════════════════════════════════════════════════
// 🎙️ Speech.ts - صوت Hans الراجل الألماني (StreamElements)
// ═══════════════════════════════════════════════════════════════

let currentAudio: HTMLAudioElement | null = null;

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 🗣️ النطق بصوت Hans الراجل الألماني
 */
export function speak(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined') return;
  
  stopSpeaking();
  
  const cleanText = text.trim();
  if (!cleanText) return;
  
  const encodedText = encodeURIComponent(cleanText);
  const url = `https://api.streamelements.com/kappa/v2/speech?voice=Hans&text=${encodedText}`;
  
  const audio = new Audio(url);
  audio.playbackRate = options.rate ?? 0.9;
  audio.volume = options.volume ?? 1.0;
  audio.crossOrigin = 'anonymous';
  
  audio.play().catch(err => {
    console.error('🔇 Hans voice failed:', err);
  });
  
  currentAudio = audio;
}

/**
 * 🔤 نطق حرف
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
 * 💬 نطق جملة
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
}

/**
 * 🔍 دالة تشخيصية (للتوافق)
 */
export function logAvailableGermanVoices() {
  console.log('🎙️ Voice: Hans (German Male) - StreamElements');
}

/**
 * 🎯 للتوافق مع الكود القديم
 */
export function getBestGermanVoice(): SpeechSynthesisVoice | null {
  return null;
}
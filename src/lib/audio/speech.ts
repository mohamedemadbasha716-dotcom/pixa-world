// ═══════════════════════════════════════════════════════════════
// 🎙️ Speech.ts - صوت راجل ألماني عبر Backend Route
// ═══════════════════════════════════════════════════════════════

let currentAudio: HTMLAudioElement | null = null;

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 🗣️ النطق عبر Backend
 */
export function speak(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined') return;
  
  stopSpeaking();
  
  const cleanText = text.trim();
  if (!cleanText) return;
  
  const encodedText = encodeURIComponent(cleanText);
  const url = `/api/tts?text=${encodedText}`;
  
  const audio = new Audio(url);
  audio.playbackRate = options.rate ?? 0.9;
  audio.volume = options.volume ?? 1.0;
  
  audio.play().catch(err => {
    console.error('🔇 TTS failed:', err);
  });
  
  currentAudio = audio;
}

export function speakLetter(letter: string) {
  speak(letter, { rate: 0.75 });
}

export function speakWord(word: string) {
  speak(word, { rate: 0.9 });
}

export function speakNumber(text: string) {
  speak(text, { rate: 0.85 });
}

export function speakSentence(sentence: string) {
  speak(sentence, { rate: 0.95 });
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function logAvailableGermanVoices() {
  console.log('🎙️ Using Backend TTS Route');
}

export function getBestGermanVoice(): SpeechSynthesisVoice | null {
  return null;
}
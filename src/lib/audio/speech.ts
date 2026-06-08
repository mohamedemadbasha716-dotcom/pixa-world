// ═══════════════════════════════════════
// 🗣️ النطق بالألمانية (Text-to-Speech)
// ═══════════════════════════════════════

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

export function speak(text: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined') return;

  const {
    rate = 0.75,
    pitch = 1.1,
    lang = 'de-DE',
  } = options;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  window.speechSynthesis.speak(utterance);
}

export function speakLetter(letter: string) {
  speak(letter, { rate: 0.6, pitch: 1.2 });
}

export function speakWord(word: string) {
  speak(word, { rate: 0.7, pitch: 1.1 });
}

export function speakNumber(text: string) {
  speak(text, { rate: 0.65, pitch: 1.1 });
}

export function speakSentence(sentence: string) {
  speak(sentence, { rate: 0.75, pitch: 1.1 });
}
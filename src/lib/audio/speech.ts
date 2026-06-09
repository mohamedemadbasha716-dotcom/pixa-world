// ═══════════════════════════════════════════════════════════════
// 🎙️ Speech.ts - نظام النطق الألماني (صوت المتصفح)
// ═══════════════════════════════════════════════════════════════

// 🎯 قائمة الأصوات الذكورية الألمانية - مرتبة من الأفضل
const GERMAN_MALE_VOICES_PRIORITY = [
  'Google Deutsch',
  'Microsoft Conrad Online (Natural) - German (Germany)',
  'Microsoft Killian Online (Natural) - German (Germany)',
  'Microsoft Florian Online (Natural) - German (Germany)',
  'Microsoft Bernd Online (Natural) - German (Germany)',
  'Microsoft Stefan Desktop - German',
  'Microsoft Stefan - German (Germany)',
  'Microsoft Stefan',
  'Markus',
  'Yannick',
  'Stefan',
  'Conrad',
  'Killian',
  'Hans',
  'Bernd',
];

let cachedVoice: SpeechSynthesisVoice | null = null;

/**
 * 🎯 يجيب أفضل صوت ألماني متاح
 */
export function getBestGermanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  
  const germanVoices = voices.filter(v => v.lang.startsWith('de'));
  if (germanVoices.length === 0) return null;
  
  // ابحث بالترتيب
  for (const priorityName of GERMAN_MALE_VOICES_PRIORITY) {
    const exact = germanVoices.find(v => v.name === priorityName);
    if (exact) {
      cachedVoice = exact;
      console.log('🎙️ Voice:', exact.name);
      return exact;
    }
  }
  
  for (const priorityName of GERMAN_MALE_VOICES_PRIORITY) {
    const partial = germanVoices.find(v => 
      v.name.toLowerCase().includes(priorityName.toLowerCase())
    );
    if (partial) {
      cachedVoice = partial;
      console.log('🎙️ Voice:', partial.name);
      return partial;
    }
  }
  
  // أول صوت ألماني
  cachedVoice = germanVoices[0];
  console.log('🎙️ Voice (fallback):', cachedVoice.name);
  return cachedVoice;
}

// 🔄 إعادة تحميل الأصوات
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getBestGermanVoice();
  };
  setTimeout(() => getBestGermanVoice(), 100);
  setTimeout(() => getBestGermanVoice(), 1000);
}

// ═══════════════════════════════════════════════════════════════
// 🗣️ دوال النطق
// ═══════════════════════════════════════════════════════════════

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function speak(text: string, options: SpeechOptions = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = options.rate ?? 0.85;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  
  const voice = getBestGermanVoice();
  if (voice) utterance.voice = voice;
  
  window.speechSynthesis.speak(utterance);
}

export function speakLetter(letter: string) {
  speak(letter, { rate: 0.6 });
}

export function speakWord(word: string) {
  speak(word, { rate: 0.75 });
}

export function speakNumber(text: string) {
  speak(text, { rate: 0.7 });
}

export function speakSentence(sentence: string) {
  speak(sentence, { rate: 0.8 });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function logAvailableGermanVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  const german = voices.filter(v => v.lang.startsWith('de'));
  console.log('═══════════════════════════════════');
  console.log('🎙️ الأصوات الألمانية المتاحة:');
  german.forEach((v, i) => {
    console.log(`${i + 1}. ${v.name} | ${v.lang} | ${v.localService ? '💻' : '☁️'}`);
  });
  console.log('═══════════════════════════════════');
}
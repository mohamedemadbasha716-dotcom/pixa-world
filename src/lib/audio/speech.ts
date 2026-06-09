// ═══════════════════════════════════════════════════════════════
// 🎙️ Speech.ts - صوت راجل ألماني (مع فلتر للأصوات النسائية)
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

// 🚫 أصوات نسائية معروفة - نرفضها
const FEMALE_VOICES_BLACKLIST = [
  'anna', 'petra', 'marlene', 'vicki', 'katja', 
  'hedda', 'helga', 'hanna', 'amala', 'female',
  'eva', 'ingrid', 'gisela', 'erika', 'klara'
];

let cachedVoice: SpeechSynthesisVoice | null = null;

/**
 * 🎯 يجيب أفضل صوت راجل ألماني
 */
export function getBestGermanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  
  const allGermanVoices = voices.filter(v => v.lang.startsWith('de'));
  if (allGermanVoices.length === 0) return null;
  
  // 🚫 شيل الأصوات النسائية
  const maleVoices = allGermanVoices.filter(v => {
    const nameLower = v.name.toLowerCase();
    return !FEMALE_VOICES_BLACKLIST.some(female => nameLower.includes(female));
  });
  
  const germanVoices = maleVoices.length > 0 ? maleVoices : allGermanVoices;
  
  console.log('🎙️ Male voices found:', maleVoices.map(v => v.name));
  
  // 1️⃣ بحث دقيق
  for (const priorityName of GERMAN_MALE_VOICES_PRIORITY) {
    const exact = germanVoices.find(v => v.name === priorityName);
    if (exact) {
      cachedVoice = exact;
      console.log('🎙️ ✅', exact.name);
      return exact;
    }
  }
  
  // 2️⃣ بحث جزئي
  for (const priorityName of GERMAN_MALE_VOICES_PRIORITY) {
    const partial = germanVoices.find(v => 
      v.name.toLowerCase().includes(priorityName.toLowerCase())
    );
    if (partial) {
      cachedVoice = partial;
      console.log('🎙️ ✅', partial.name);
      return partial;
    }
  }
  
  // 3️⃣ أول صوت راجل
  cachedVoice = germanVoices[0];
  console.log('🎙️ ⚠️', cachedVoice.name);
  return cachedVoice;
}

// 🔄 تحديث الأصوات
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
  utterance.pitch = options.pitch ?? 0.95; // ⬇️ أقل شوية = صوت أعمق
  utterance.volume = options.volume ?? 1.0;
  
  const voice = getBestGermanVoice();
  if (voice) utterance.voice = voice;
  
  window.speechSynthesis.speak(utterance);
}

export function speakLetter(letter: string) {
  speak(letter, { rate: 0.6, pitch: 0.95 });
}

export function speakWord(word: string) {
  speak(word, { rate: 0.75, pitch: 0.95 });
}

export function speakNumber(text: string) {
  speak(text, { rate: 0.7, pitch: 0.95 });
}

export function speakSentence(sentence: string) {
  speak(sentence, { rate: 0.8, pitch: 0.95 });
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
  console.log('🎙️ All German voices:');
  german.forEach((v, i) => {
    console.log(`${i + 1}. "${v.name}" | ${v.lang}`);
  });
  console.log('═══════════════════════════════════');
}
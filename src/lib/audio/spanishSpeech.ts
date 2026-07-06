// ═══════════════════════════════════════
// 🎙️ نطق الأسبانية - أفضل صوت راجل (Web Speech API)
// ═══════════════════════════════════════

// قائمة بأفضل الأصوات الأسبانية (راجل) بالترتيب من الأفضل للأقل
const PREFERRED_SPANISH_VOICES = [
  // 🥇 Google - أفضل جودة (متاح في Chrome/Edge)
  'Google español',
  'Google español de España',
  
  // 🥈 Microsoft Natural - جودة عالية جداً (Edge/Windows 11)
  'Microsoft Alvaro Online (Natural) - Spanish (Spain)',
  'Microsoft Dario Online (Natural) - Spanish (Spain)',
  'Microsoft Teo Online (Natural) - Spanish (Spain)',
  
  // 🥉 Microsoft Desktop - جودة كويسة (Windows)
  'Microsoft Pablo - Spanish (Spain)',
  'Microsoft Pablo Desktop - Spanish',
  'Microsoft Pablo',
  'Microsoft Helena - Spanish (Spain)',
  
  // 🍎 Apple - جودة ممتازة (Mac/iOS/iPhone)
  'Diego',            // أفضل صوت راجل أسباني على Apple
  'Jorge',            // صوت أسباني (إسباني)
  'Juan',             // بديل
  
  // 🎯 أصوات بديلة
  'Pablo',
  'Alvaro',
  'Dario',
  'Teo',
];

let cachedSpanishVoice: SpeechSynthesisVoice | null = null;
let spanishVoicesReady = false;

/**
 * تحميل الأصوات (بعض المتصفحات بتحتاج وقت)
 */
function ensureSpanishVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    if (spanishVoicesReady) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      spanishVoicesReady = true;
      resolve();
      return;
    }

    // انتظر تحميل الأصوات
    const handler = () => {
      spanishVoicesReady = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve();
    };

    window.speechSynthesis.onvoiceschanged = handler;

    // Timeout بعد ثانيتين (لو ما اتحملوش)
    setTimeout(() => {
      spanishVoicesReady = true;
      resolve();
    }, 2000);
  });
}

/**
 * اختيار أفضل صوت أسباني (راجل)
 */
function getBestSpanishVoice(): SpeechSynthesisVoice | null {
  if (cachedSpanishVoice) return cachedSpanishVoice;
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1️⃣ ابحث عن صوت من القائمة المفضلة (بالترتيب)
  for (const preferred of PREFERRED_SPANISH_VOICES) {
    const voice = voices.find(v => v.name === preferred);
    if (voice) {
      cachedSpanishVoice = voice;
      return voice;
    }
  }

  // 2️⃣ ابحث عن أي صوت أسباني فيه أسماء راجل
  const maleKeywords = ['male', 'diego', 'pablo', 'jorge', 'juan', 'alvaro', 'dario', 'teo'];
  const spanishMaleVoice = voices.find(v =>
    v.lang.startsWith('es') &&
    maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );
  if (spanishMaleVoice) {
    cachedSpanishVoice = spanishMaleVoice;
    return spanishMaleVoice;
  }

  // 3️⃣ ابحث عن صوت Google أسباني (لو موجود بأي اسم)
  const googleVoice = voices.find(v =>
    v.lang.startsWith('es') && v.name.toLowerCase().includes('google')
  );
  if (googleVoice) {
    cachedSpanishVoice = googleVoice;
    return googleVoice;
  }

  // 4️⃣ ابحث عن صوت أسباني من إسبانيا تحديداً (es-ES)
  const spainVoice = voices.find(v => v.lang === 'es-ES');
  if (spainVoice) {
    cachedSpanishVoice = spainVoice;
    return spainVoice;
  }

  // 5️⃣ أي صوت أسباني
  const anySpanishVoice = voices.find(v => v.lang.startsWith('es'));
  if (anySpanishVoice) {
    cachedSpanishVoice = anySpanishVoice;
    return anySpanishVoice;
  }

  return null;
}

/**
 * النطق الفعلي
 */
function speakSpanishText(text: string, rate: number = 0.85) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // إيقاف أي صوت شغّال
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';  // 🇪🇸 إسبانية إسبانيا (Castilian)
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voice = getBestSpanishVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

/**
 * 🔤 نطق حرف أسباني (أبطأ للوضوح)
 */
export function speakSpanishLetter(letter: string) {
  ensureSpanishVoicesLoaded().then(() => {
    speakSpanishText(letter, 0.7);
  });
}

/**
 * 📝 نطق كلمة أسبانية (سرعة عادية)
 */
export function speakSpanishWord(word: string) {
  ensureSpanishVoicesLoaded().then(() => {
    speakSpanishText(word, 0.85);
  });
}

/**
 * 🔢 نطق رقم أسباني
 */
export function speakSpanishNumber(text: string) {
  ensureSpanishVoicesLoaded().then(() => {
    speakSpanishText(text, 0.85);
  });
}

/**
 * 💬 نطق جملة أسبانية كاملة (سرعة طبيعية)
 */
export function speakSpanishSentence(sentence: string) {
  ensureSpanishVoicesLoaded().then(() => {
    speakSpanishText(sentence, 0.95);
  });
}

/**
 * 🔇 إيقاف النطق
 */
export function stopSpanishSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/**
 * 🛠️ Debug: عرض كل الأصوات الأسبانية المتاحة
 * استدعيها من Console: import('./spanishSpeech').then(m => m.debugSpanishVoices())
 */
export function debugSpanishVoices() {
  if (typeof window === 'undefined') return;

  ensureSpanishVoicesLoaded().then(() => {
    const voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
    const selected = getBestSpanishVoice();

    console.log('🇪🇸 Spanish Voices Available:');
    console.table(spanishVoices.map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService ? 'Local' : 'Online',
    })));

    console.log('✅ Selected Voice:', selected?.name ?? 'None found');
  });
}

// تحميل الأصوات تلقائياً عند بدء التطبيق
if (typeof window !== 'undefined') {
  ensureSpanishVoicesLoaded();
}
// ═══════════════════════════════════════
// 🔊 أصوات التفاعل (Sound Effects)
// ═══════════════════════════════════════

export function playCoinSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.1, 0.2].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880 + i * 220, ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(1760 + i * 220, ctx.currentTime + t + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.2);
    });
  } catch {}
}

export function playBuzzSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export function playComboSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch {}
}

export function playRoyalSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.4);
    });
  } catch {}
}

export function playClickSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

// ═══════════════════════════════════════
// 🎙️ نطق الألمانية - أفضل صوت راجل (Web Speech API)
// ═══════════════════════════════════════

// قائمة بأفضل الأصوات الألمانية (راجل) بالترتيب من الأفضل للأقل
const PREFERRED_GERMAN_VOICES = [
  // 🥇 Google - أفضل جودة (متاح في Chrome/Edge)
  'Google Deutsch',
  
  // 🥈 Microsoft Natural - جودة عالية جداً (Edge/Windows 11)
  'Microsoft Conrad Online (Natural) - German (Germany)',
  'Microsoft Killian Online (Natural) - German (Germany)',
  'Microsoft Bernd Online (Natural) - German (Germany)',
  
  // 🥉 Microsoft Desktop - جودة كويسة (Windows)
  'Microsoft Stefan - German (Germany)',
  'Microsoft Stefan Desktop - German',
  'Microsoft Stefan',
  
  // 🍎 Apple - جودة ممتازة (Mac/iOS/iPhone)
  'Markus',           // أفضل صوت راجل ألماني على Apple
  'Yannick',
  
  // 🎯 أصوات بديلة
  'Stefan',
  'Conrad',
  'Hans',
  'Bernd',
  'Killian',
];

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesReady = false;

/**
 * تحميل الأصوات (بعض المتصفحات بتحتاج وقت)
 */
function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    if (voicesReady) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesReady = true;
      resolve();
      return;
    }

    // انتظر تحميل الأصوات
    const handler = () => {
      voicesReady = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve();
    };

    window.speechSynthesis.onvoiceschanged = handler;

    // Timeout بعد ثانيتين (لو ما اتحملوش)
    setTimeout(() => {
      voicesReady = true;
      resolve();
    }, 2000);
  });
}

/**
 * اختيار أفضل صوت ألماني (راجل)
 */
function getBestGermanVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1️⃣ ابحث عن صوت من القائمة المفضلة (بالترتيب)
  for (const preferred of PREFERRED_GERMAN_VOICES) {
    const voice = voices.find(v => v.name === preferred);
    if (voice) {
      cachedVoice = voice;
      return voice;
    }
  }

  // 2️⃣ ابحث عن أي صوت ألماني فيه كلمة "male" أو أسماء راجل
  const maleKeywords = ['male', 'stefan', 'conrad', 'markus', 'hans', 'bernd', 'killian', 'yannick'];
  const germanMaleVoice = voices.find(v =>
    v.lang.startsWith('de') &&
    maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );
  if (germanMaleVoice) {
    cachedVoice = germanMaleVoice;
    return germanMaleVoice;
  }

  // 3️⃣ ابحث عن صوت Google ألماني (لو موجود بأي اسم)
  const googleVoice = voices.find(v =>
    v.lang.startsWith('de') && v.name.toLowerCase().includes('google')
  );
  if (googleVoice) {
    cachedVoice = googleVoice;
    return googleVoice;
  }

  // 4️⃣ أي صوت ألماني
  const anyGermanVoice = voices.find(v => v.lang.startsWith('de'));
  if (anyGermanVoice) {
    cachedVoice = anyGermanVoice;
    return anyGermanVoice;
  }

  return null;
}

/**
 * النطق الفعلي
 */
function speak(text: string, rate: number = 0.85) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // إيقاف أي صوت شغّال
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voice = getBestGermanVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

/**
 * 🔤 نطق حرف ألماني (أبطأ للوضوح)
 */
export function speakLetter(letter: string) {
  ensureVoicesLoaded().then(() => {
    speak(letter, 0.7);
  });
}

/**
 * 📝 نطق كلمة ألمانية (سرعة عادية)
 */
export function speakWord(word: string) {
  ensureVoicesLoaded().then(() => {
    speak(word, 0.85);
  });
}

/**
 * 💬 نطق جملة كاملة (سرعة طبيعية)
 */
export function speakSentence(sentence: string) {
  ensureVoicesLoaded().then(() => {
    speak(sentence, 0.95);
  });
}

/**
 * 🛠️ Debug: عرض كل الأصوات المتاحة (للتطوير)
 * استدعيها من Console: import('./sounds').then(m => m.debugVoices())
 */
export function debugVoices() {
  if (typeof window === 'undefined') return;

  ensureVoicesLoaded().then(() => {
    const voices = window.speechSynthesis.getVoices();
    const germanVoices = voices.filter(v => v.lang.startsWith('de'));
    const selected = getBestGermanVoice();

    console.log('🇩🇪 German Voices Available:');
    console.table(germanVoices.map(v => ({
      name: v.name,
      lang: v.lang,
      local: v.localService ? 'Local' : 'Online',
    })));

    console.log('✅ Selected Voice:', selected?.name ?? 'None found');
  });
}

// تحميل الأصوات تلقائياً عند بدء التطبيق
if (typeof window !== 'undefined') {
  ensureVoicesLoaded();
}
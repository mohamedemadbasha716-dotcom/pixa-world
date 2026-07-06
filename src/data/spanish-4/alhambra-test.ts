// src/data/spanish-4/alhambra-test.ts

// ═══════════════════════════════════════
// 🇪🇸 اختبار الجنوب - La Alhambra
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER A2.1
// المرجع: DELE Escolar A2 Assessment Standards
// 15 سؤال = 3 جولات × 5 أسئلة
// مناسب للأطفال 9-10 سنوات
// الدرس: es-alhambra-test
// نوع: اختبار شامل للخريطة 4 (Comprehensive Test)
// ربط ثقافي: قصر الحمراء - جوهرة الأندلس 🏰
// ═══════════════════════════════════════

export type TestCategory = 'verbs-regular' | 'verbs-irregular' | 'nature' | 'entertainment' | 'recipes' | 'communication' | 'places';
export type TestRound = 'recognize' | 'write' | 'speak';

export interface SpanishTestQuestion {
  id: string;
  category: TestCategory;
  categoryAr: string;
  categoryEmoji: string;
  word: string;
  wordAr: string;
  emoji: string;
  round: TestRound;
  color: string;
  gradient: [string, string];
  choices?: { emoji: string; word: string; wordAr: string }[];
}

export interface SpanishTestRound {
  round: TestRound;
  title: string;
  titleEs: string;
  description: string;
  emoji: string;
  questions: SpanishTestQuestion[];
}

// ═══════════════════════════════════════
// 🎯 الأسئلة الكاملة (15 سؤال)
// ═══════════════════════════════════════
export const SPANISH_TEST_QUESTIONS: SpanishTestQuestion[] = [
  // ═══════════════════════════════════════
  // 🎧 Round 1: Reconocer (اختر الصورة من السماع)
  // ═══════════════════════════════════════
  {
    id: 'q1',
    category: 'verbs-regular',
    categoryAr: 'أفعال منتظمة',
    categoryEmoji: '🏛️',
    word: 'hablar',
    wordAr: 'يتكلم',
    emoji: '🗣️',
    round: 'recognize',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
    choices: [
      { emoji: '🗣️', word: 'hablar', wordAr: 'يتكلم' },
      { emoji: '👀', word: 'mirar', wordAr: 'يبص' },
      { emoji: '👂', word: 'escuchar', wordAr: 'يسمع' },
    ],
  },
  {
    id: 'q2',
    category: 'verbs-irregular',
    categoryAr: 'أفعال شاذة',
    categoryEmoji: '🎭',
    word: 'ser',
    wordAr: 'يكون',
    emoji: '✨',
    round: 'recognize',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
    choices: [
      { emoji: '🚶', word: 'ir', wordAr: 'يروح' },
      { emoji: '✨', word: 'ser', wordAr: 'يكون' },
      { emoji: '🤲', word: 'tener', wordAr: 'يملك' },
    ],
  },
  {
    id: 'q3',
    category: 'nature',
    categoryAr: 'طبيعة',
    categoryEmoji: '🦩',
    word: 'el árbol',
    wordAr: 'الشجرة',
    emoji: '🌳',
    round: 'recognize',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
    choices: [
      { emoji: '🌳', word: 'el árbol', wordAr: 'الشجرة' },
      { emoji: '🌸', word: 'la flor', wordAr: 'الوردة' },
      { emoji: '🌊', word: 'el río', wordAr: 'النهر' },
    ],
  },
  {
    id: 'q4',
    category: 'recipes',
    categoryAr: 'وصفات',
    categoryEmoji: '🍳',
    word: 'cocinar',
    wordAr: 'يطبخ',
    emoji: '👨‍🍳',
    round: 'recognize',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    choices: [
      { emoji: '👨‍🍳', word: 'cocinar', wordAr: 'يطبخ' },
      { emoji: '🔪', word: 'cortar', wordAr: 'يقطع' },
      { emoji: '🥣', word: 'mezclar', wordAr: 'يخلط' },
    ],
  },
  {
    id: 'q5',
    category: 'places',
    categoryAr: 'أماكن',
    categoryEmoji: '🕌',
    word: 'la ciudad',
    wordAr: 'المدينة',
    emoji: '🏙️',
    round: 'recognize',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
    choices: [
      { emoji: '🏙️', word: 'la ciudad', wordAr: 'المدينة' },
      { emoji: '🏘️', word: 'el pueblo', wordAr: 'القرية' },
      { emoji: '⛲', word: 'la plaza', wordAr: 'الميدان' },
    ],
  },

  // ═══════════════════════════════════════
  // ✍️ Round 2: Escribir (اكتب الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q6',
    category: 'verbs-irregular',
    categoryAr: 'أفعال شاذة',
    categoryEmoji: '🎭',
    word: 'ir',
    wordAr: 'يروح',
    emoji: '🚶',
    round: 'write',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'q7',
    category: 'nature',
    categoryAr: 'طبيعة',
    categoryEmoji: '🦩',
    word: 'rio',
    wordAr: 'النهر',
    emoji: '🌊',
    round: 'write',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'q8',
    category: 'entertainment',
    categoryAr: 'ترفيه',
    categoryEmoji: '🎬',
    word: 'pelicula',
    wordAr: 'الفيلم',
    emoji: '🎬',
    round: 'write',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'q9',
    category: 'recipes',
    categoryAr: 'وصفات',
    categoryEmoji: '🍳',
    word: 'delicioso',
    wordAr: 'لذيذ',
    emoji: '🤤',
    round: 'write',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'q10',
    category: 'communication',
    categoryAr: 'تواصل',
    categoryEmoji: '📮',
    word: 'carta',
    wordAr: 'الرسالة',
    emoji: '✉️',
    round: 'write',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════════════════════════════════
  // 🎤 Round 3: Hablar (انطق الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q11',
    category: 'verbs-regular',
    categoryAr: 'أفعال منتظمة',
    categoryEmoji: '🏛️',
    word: 'trabajar',
    wordAr: 'يشتغل',
    emoji: '💼',
    round: 'speak',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'q12',
    category: 'entertainment',
    categoryAr: 'ترفيه',
    categoryEmoji: '🎬',
    word: 'la música',
    wordAr: 'الموسيقى',
    emoji: '🎵',
    round: 'speak',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'q13',
    category: 'communication',
    categoryAr: 'تواصل',
    categoryEmoji: '📮',
    word: 'el teléfono',
    wordAr: 'الموبايل',
    emoji: '📱',
    round: 'speak',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'q14',
    category: 'places',
    categoryAr: 'أماكن',
    categoryEmoji: '🕌',
    word: 'bonito',
    wordAr: 'جميل',
    emoji: '🌸',
    round: 'speak',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'q15',
    category: 'nature',
    categoryAr: 'طبيعة',
    categoryEmoji: '🦩',
    word: 'la montaña',
    wordAr: 'الجبل',
    emoji: '⛰️',
    round: 'speak',
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
];

// ═══════════════════════════════════════
// 📊 تقسيم الأسئلة على الجولات
// ═══════════════════════════════════════
export const SPANISH_TEST_ROUNDS: SpanishTestRound[] = [
  {
    round: 'recognize',
    title: 'الجولة 1: التعرف',
    titleEs: 'Ronda 1: Reconocer',
    description: 'استمع واختر الصورة الصحيحة',
    emoji: '🎧',
    questions: SPANISH_TEST_QUESTIONS.filter(q => q.round === 'recognize'),
  },
  {
    round: 'write',
    title: 'الجولة 2: الكتابة',
    titleEs: 'Ronda 2: Escribir',
    description: 'اكتب الكلمة بالإسباني',
    emoji: '✍️',
    questions: SPANISH_TEST_QUESTIONS.filter(q => q.round === 'write'),
  },
  {
    round: 'speak',
    title: 'الجولة 3: التحدث',
    titleEs: 'Ronda 3: Hablar',
    description: 'انطق الكلمة بصوت واضح',
    emoji: '🎤',
    questions: SPANISH_TEST_QUESTIONS.filter(q => q.round === 'speak'),
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان الفئات
// ═══════════════════════════════════════
export const CATEGORY_COLORS: Record<TestCategory, { bg: string; text: string }> = {
  'verbs-regular':   { bg: 'rgba(220,38,38,0.7)',  text: '#DC2626' },
  'verbs-irregular': { bg: 'rgba(162,98,7,0.7)',   text: '#A16207' },
  'nature':          { bg: 'rgba(34,197,94,0.7)',  text: '#22C55E' },
  'entertainment':   { bg: 'rgba(252,211,77,0.7)', text: '#FCD34D' },
  'recipes':         { bg: 'rgba(249,115,22,0.7)', text: '#F97316' },
  'communication':   { bg: 'rgba(59,130,246,0.7)', text: '#3B82F6' },
  'places':          { bg: 'rgba(185,28,28,0.7)',  text: '#B91C1C' },
};

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function compareTestWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[¿?¡!]/g, '')
      .replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();

  return normalize(input) === normalize(target);
}

export function calculateTestStars(correctAnswers: number, totalQuestions: number): 0 | 1 | 2 | 3 {
  const percentage = (correctAnswers / totalQuestions) * 100;
  if (percentage >= 87) return 3;
  if (percentage >= 60) return 2;
  if (percentage >= 33) return 1;
  return 0;
}

export function getTestResultMessage(stars: 0 | 1 | 2 | 3): { titleEs: string; titleAr: string; messageAr: string } {
  switch (stars) {
    case 3:
      return {
        titleEs: '¡Sultán de la Alhambra!',
        titleAr: 'سلطان قصر الحمراء!',
        messageAr: 'أنت ملك الأندلس! أتقنت أراضي الجنوب بالكامل! 🏆🏰',
      };
    case 2:
      return {
        titleEs: '¡Muy bien, andaluz!',
        titleAr: 'أحسنت يا أندلسي!',
        messageAr: 'أداء رائع في أراضي الجنوب! 🌟🕌',
      };
    case 1:
      return {
        titleEs: '¡Buen intento!',
        titleAr: 'محاولة جيدة!',
        messageAr: 'بداية جيدة! تدرب أكثر لتحكم الأندلس! 💪',
      };
    case 0:
      return {
        titleEs: '¡No te rindas!',
        titleAr: 'لا تستسلم!',
        messageAr: 'قصر الحمراء بُني في سنين طويلة! راجع الدروس! 🔄',
      };
  }
}

// ═══════════════════════════════════════
// 📊 ثوابت الاختبار
// ═══════════════════════════════════════
export const TOTAL_TEST_QUESTIONS = SPANISH_TEST_QUESTIONS.length; // 15
export const TOTAL_TEST_ROUNDS = SPANISH_TEST_ROUNDS.length; // 3
export const QUESTIONS_PER_ROUND = 5;
export const PASSING_THRESHOLD = 5;
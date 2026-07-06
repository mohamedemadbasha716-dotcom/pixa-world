// src/data/spanish-3/sagrada-test.ts

// ═══════════════════════════════════════
// 🇪🇸 اختبار المتوسط - Sagrada Familia
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER A1.2
// المرجع: DELE Escolar A1 Assessment Standards
// 15 سؤال = 3 جولات × 5 أسئلة
// مناسب للأطفال 8-9 سنوات
// الدرس: es-sagrada-test
// نوع: اختبار شامل للخريطة 3 (Comprehensive Test)
// ربط ثقافي: ساغرادا فاميليا - تحفة غاودي المعمارية ⛪
// ═══════════════════════════════════════

export type TestCategory = 'time' | 'health' | 'sports' | 'shopping' | 'transport' | 'countries' | 'art';
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
    category: 'time',
    categoryAr: 'الوقت',
    categoryEmoji: '🕐',
    word: 'la mañana',
    wordAr: 'الصباح',
    emoji: '🌅',
    round: 'recognize',
    color: '#F59E0B',
    gradient: ['#FCD34D', '#D97706'],
    choices: [
      { emoji: '🌅', word: 'la mañana', wordAr: 'الصباح' },
      { emoji: '☀️', word: 'la tarde', wordAr: 'بعد الظهر' },
      { emoji: '🌙', word: 'la noche', wordAr: 'الليل' },
    ],
  },
  {
    id: 'q2',
    category: 'health',
    categoryAr: 'الصحة',
    categoryEmoji: '🏥',
    word: 'fiebre',
    wordAr: 'حمى',
    emoji: '🌡️',
    round: 'recognize',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    choices: [
      { emoji: '🤕', word: 'dolor de cabeza', wordAr: 'صداع' },
      { emoji: '🌡️', word: 'fiebre', wordAr: 'حمى' },
      { emoji: '😷', word: 'tos', wordAr: 'كحة' },
    ],
  },
  {
    id: 'q3',
    category: 'sports',
    categoryAr: 'الرياضة',
    categoryEmoji: '⚽',
    word: 'el fútbol',
    wordAr: 'كرة القدم',
    emoji: '⚽',
    round: 'recognize',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
    choices: [
      { emoji: '⚽', word: 'el fútbol', wordAr: 'كرة القدم' },
      { emoji: '🏀', word: 'el baloncesto', wordAr: 'كرة السلة' },
      { emoji: '🎾', word: 'el tenis', wordAr: 'التنس' },
    ],
  },
  {
    id: 'q4',
    category: 'shopping',
    categoryAr: 'التسوق',
    categoryEmoji: '🛒',
    word: 'el dinero',
    wordAr: 'الفلوس',
    emoji: '💰',
    round: 'recognize',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
    choices: [
      { emoji: '💰', word: 'el dinero', wordAr: 'الفلوس' },
      { emoji: '🏷️', word: 'barato', wordAr: 'رخيص' },
      { emoji: '💸', word: 'caro', wordAr: 'غالي' },
    ],
  },
  {
    id: 'q5',
    category: 'art',
    categoryAr: 'الفن',
    categoryEmoji: '🎨',
    word: 'el pincel',
    wordAr: 'الفرشاة',
    emoji: '🖌️',
    round: 'recognize',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
    choices: [
      { emoji: '🖌️', word: 'el pincel', wordAr: 'الفرشاة' },
      { emoji: '🎨', word: 'la pintura', wordAr: 'الطلاء' },
      { emoji: '✏️', word: 'el lápiz', wordAr: 'القلم' },
    ],
  },

  // ═══════════════════════════════════════
  // ✍️ Round 2: Escribir (اكتب الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q6',
    category: 'time',
    categoryAr: 'الوقت',
    categoryEmoji: '🕐',
    word: 'hoy',
    wordAr: 'النهاردة',
    emoji: '📅',
    round: 'write',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'q7',
    category: 'health',
    categoryAr: 'الصحة',
    categoryEmoji: '🏥',
    word: 'medico',
    wordAr: 'الدكتور',
    emoji: '👨‍⚕️',
    round: 'write',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'q8',
    category: 'sports',
    categoryAr: 'الرياضة',
    categoryEmoji: '⚽',
    word: 'jugar',
    wordAr: 'يلعب',
    emoji: '🎯',
    round: 'write',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'q9',
    category: 'shopping',
    categoryAr: 'التسوق',
    categoryEmoji: '🛒',
    word: 'comprar',
    wordAr: 'يشتري',
    emoji: '🛍️',
    round: 'write',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'q10',
    category: 'transport',
    categoryAr: 'المواصلات',
    categoryEmoji: '🚇',
    word: 'tren',
    wordAr: 'القطر',
    emoji: '🚂',
    round: 'write',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },

  // ═══════════════════════════════════════
  // 🎤 Round 3: Hablar (انطق الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q11',
    category: 'time',
    categoryAr: 'الوقت',
    categoryEmoji: '🕐',
    word: 'la hora',
    wordAr: 'الساعة',
    emoji: '🕐',
    round: 'speak',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'q12',
    category: 'health',
    categoryAr: 'الصحة',
    categoryEmoji: '🏥',
    word: 'agua',
    wordAr: 'الماء',
    emoji: '💧',
    round: 'speak',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'q13',
    category: 'transport',
    categoryAr: 'المواصلات',
    categoryEmoji: '🚇',
    word: 'el metro',
    wordAr: 'المترو',
    emoji: '🚇',
    round: 'speak',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'q14',
    category: 'countries',
    categoryAr: 'الدول',
    categoryEmoji: '🌍',
    word: 'España',
    wordAr: 'إسبانيا',
    emoji: '🇪🇸',
    round: 'speak',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'q15',
    category: 'art',
    categoryAr: 'الفن',
    categoryEmoji: '🎨',
    word: 'música',
    wordAr: 'الموسيقى',
    emoji: '🎵',
    round: 'speak',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
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
  time:      { bg: 'rgba(14,165,233,0.7)',  text: '#0EA5E9' },
  health:    { bg: 'rgba(34,197,94,0.7)',   text: '#22C55E' },
  sports:    { bg: 'rgba(220,38,38,0.7)',   text: '#DC2626' },
  shopping:  { bg: 'rgba(249,115,22,0.7)',  text: '#F97316' },
  transport: { bg: 'rgba(124,58,237,0.7)',  text: '#7C3AED' },
  countries: { bg: 'rgba(6,182,212,0.7)',   text: '#06B6D4' },
  art:       { bg: 'rgba(236,72,153,0.7)',  text: '#EC4899' },
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
        titleEs: '¡Como Gaudí!',
        titleAr: 'زي غاودي!',
        messageAr: 'أنت فنان حقيقي! أتقنت سواحل المتوسط! 🏆⛪',
      };
    case 2:
      return {
        titleEs: '¡Muy bien, artista!',
        titleAr: 'أحسنت يا فنان!',
        messageAr: 'أداء رائع في سواحل المتوسط! استمر! 🌟🌊',
      };
    case 1:
      return {
        titleEs: '¡Buen intento!',
        titleAr: 'محاولة جيدة!',
        messageAr: 'بداية جيدة! تدرب أكثر لتصبح فناناً حقيقياً! 💪',
      };
    case 0:
      return {
        titleEs: '¡No te rindas!',
        titleAr: 'لا تستسلم!',
        messageAr: 'غاودي بنى ساغرادا فاميليا في سنين طويلة! راجع الدروس! 🔄',
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
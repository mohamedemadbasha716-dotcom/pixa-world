// src/data/spanish-2/consuegra-test.ts

// ═══════════════════════════════════════
// 🇪🇸 اختبار قشتالة - Molinos de Don Quijote
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER A1.1
// المرجع: DELE Escolar A1 Assessment Standards
// 15 سؤال = 3 جولات × 5 أسئلة
// مناسب للأطفال 7-8 سنوات
// الدرس: es-consuegra-test
// نوع: اختبار شامل للخريطة 2 (Comprehensive Test)
// ربط ثقافي: طواحين دون كيخوتي - رمز المغامرة والإبداع 🌬️
// ═══════════════════════════════════════

export type TestCategory = 'body' | 'clothes' | 'food' | 'school' | 'house' | 'feelings';
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
    category: 'body',
    categoryAr: 'الجسم',
    categoryEmoji: '💪',
    word: 'la mano',
    wordAr: 'اليد',
    emoji: '✋',
    round: 'recognize',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
    choices: [
      { emoji: '✋', word: 'la mano', wordAr: 'اليد' },
      { emoji: '👁️', word: 'el ojo', wordAr: 'العين' },
      { emoji: '👂', word: 'la oreja', wordAr: 'الأذن' },
    ],
  },
  {
    id: 'q2',
    category: 'clothes',
    categoryAr: 'الملابس',
    categoryEmoji: '👗',
    word: 'la camisa',
    wordAr: 'القميص',
    emoji: '👕',
    round: 'recognize',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
    choices: [
      { emoji: '👖', word: 'los pantalones', wordAr: 'البنطلون' },
      { emoji: '👕', word: 'la camisa', wordAr: 'القميص' },
      { emoji: '👟', word: 'los zapatos', wordAr: 'الأحذية' },
    ],
  },
  {
    id: 'q3',
    category: 'food',
    categoryAr: 'الطعام',
    categoryEmoji: '🍖',
    word: 'el pan',
    wordAr: 'الخبز',
    emoji: '🍞',
    round: 'recognize',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    choices: [
      { emoji: '🥛', word: 'la leche', wordAr: 'الحليب' },
      { emoji: '🍞', word: 'el pan', wordAr: 'الخبز' },
      { emoji: '🧀', word: 'el queso', wordAr: 'الجبنة' },
    ],
  },
  {
    id: 'q4',
    category: 'house',
    categoryAr: 'المنزل',
    categoryEmoji: '🏚️',
    word: 'la cocina',
    wordAr: 'المطبخ',
    emoji: '🍳',
    round: 'recognize',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
    choices: [
      { emoji: '🛏️', word: 'el dormitorio', wordAr: 'غرفة النوم' },
      { emoji: '🍳', word: 'la cocina', wordAr: 'المطبخ' },
      { emoji: '🚿', word: 'el baño', wordAr: 'الحمام' },
    ],
  },
  {
    id: 'q5',
    category: 'feelings',
    categoryAr: 'المشاعر',
    categoryEmoji: '💖',
    word: 'feliz',
    wordAr: 'سعيد',
    emoji: '😄',
    round: 'recognize',
    color: '#F59E0B',
    gradient: ['#FCD34D', '#D97706'],
    choices: [
      { emoji: '😢', word: 'triste', wordAr: 'حزين' },
      { emoji: '😄', word: 'feliz', wordAr: 'سعيد' },
      { emoji: '😠', word: 'enfadado', wordAr: 'زعلان' },
    ],
  },

  // ═══════════════════════════════════════
  // ✍️ Round 2: Escribir (اكتب الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q6',
    category: 'body',
    categoryAr: 'الجسم',
    categoryEmoji: '💪',
    word: 'el ojo',
    wordAr: 'العين',
    emoji: '👁️',
    round: 'write',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'q7',
    category: 'school',
    categoryAr: 'المدرسة',
    categoryEmoji: '🎓',
    word: 'libro',
    wordAr: 'كتاب',
    emoji: '📖',
    round: 'write',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'q8',
    category: 'food',
    categoryAr: 'الطعام',
    categoryEmoji: '🍖',
    word: 'agua',
    wordAr: 'ماء',
    emoji: '💧',
    round: 'write',
    color: '#06B6D4',
    gradient: ['#67E8F9', '#0891B2'],
  },
  {
    id: 'q9',
    category: 'clothes',
    categoryAr: 'الملابس',
    categoryEmoji: '👗',
    word: 'zapatos',
    wordAr: 'أحذية',
    emoji: '👟',
    round: 'write',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'q10',
    category: 'feelings',
    categoryAr: 'المشاعر',
    categoryEmoji: '💖',
    word: 'bien',
    wordAr: 'بخير',
    emoji: '🙂',
    round: 'write',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════════════════════════════════
  // 🎤 Round 3: Hablar (انطق الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q11',
    category: 'school',
    categoryAr: 'المدرسة',
    categoryEmoji: '🎓',
    word: 'la escuela',
    wordAr: 'المدرسة',
    emoji: '🏫',
    round: 'speak',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'q12',
    category: 'body',
    categoryAr: 'الجسم',
    categoryEmoji: '💪',
    word: 'la cabeza',
    wordAr: 'الرأس',
    emoji: '🧠',
    round: 'speak',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'q13',
    category: 'house',
    categoryAr: 'المنزل',
    categoryEmoji: '🏚️',
    word: 'la casa',
    wordAr: 'البيت',
    emoji: '🏠',
    round: 'speak',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'q14',
    category: 'feelings',
    categoryAr: 'المشاعر',
    categoryEmoji: '💖',
    word: 'cansado',
    wordAr: 'تعبان',
    emoji: '🥱',
    round: 'speak',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'q15',
    category: 'food',
    categoryAr: 'الطعام',
    categoryEmoji: '🍖',
    word: 'la manzana',
    wordAr: 'التفاحة',
    emoji: '🍎',
    round: 'speak',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
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
  body:     { bg: 'rgba(59,130,246,0.7)',  text: '#3B82F6' },
  clothes:  { bg: 'rgba(236,72,153,0.7)',  text: '#EC4899' },
  food:     { bg: 'rgba(249,115,22,0.7)',  text: '#F97316' },
  school:   { bg: 'rgba(124,58,237,0.7)',  text: '#7C3AED' },
  house:    { bg: 'rgba(162,98,7,0.7)',    text: '#A16207' },
  feelings: { bg: 'rgba(236,72,153,0.7)',  text: '#EC4899' },
};

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

/**
 * مقارنة كلمتين للاختبار
 */
export function compareTestWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[¿?¡!]/g, '')
      .replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, '') // يتجاهل أدوات التعريف
      .replace(/\s+/g, ' ')
      .trim();

  return normalize(input) === normalize(target);
}

/**
 * حساب نظام النجوم
 */
export function calculateTestStars(correctAnswers: number, totalQuestions: number): 0 | 1 | 2 | 3 {
  const percentage = (correctAnswers / totalQuestions) * 100;
  if (percentage >= 87) return 3;
  if (percentage >= 60) return 2;
  if (percentage >= 33) return 1;
  return 0;
}

/**
 * رسالة تشجيع حسب النتيجة
 */
export function getTestResultMessage(stars: 0 | 1 | 2 | 3): { titleEs: string; titleAr: string; messageAr: string } {
  switch (stars) {
    case 3:
      return {
        titleEs: '¡Como Don Quijote!',
        titleAr: 'زي دون كيخوتي!',
        messageAr: 'أنت فارس قشتالة الحقيقي! أتقنت كل شيء! 🏆⚔️',
      };
    case 2:
      return {
        titleEs: '¡Muy bien, caballero!',
        titleAr: 'أحسنت يا فارس!',
        messageAr: 'أداء رائع في قلاع قشتالة! استمر! 🌟🏰',
      };
    case 1:
      return {
        titleEs: '¡Buen intento!',
        titleAr: 'محاولة جيدة!',
        messageAr: 'بداية شجاعة! تدرب أكثر لتصبح فارساً حقيقياً! 💪',
      };
    case 0:
      return {
        titleEs: '¡No te rindas!',
        titleAr: 'لا تستسلم!',
        messageAr: 'دون كيخوتي لم يستسلم! راجع الدروس وحاول مجدداً! 🔄',
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
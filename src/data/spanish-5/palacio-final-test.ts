// src/data/spanish-5/palacio-final-test.ts

// ═══════════════════════════════════════
// 🇪🇸 الاختبار النهائي الكبير - Palacio Real de Madrid
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER A2.2
// المرجع: DELE A2 Assessment Standards
// 15 سؤال = 3 جولات × 5 أسئلة
// مناسب للأطفال 10-11 سنة
// الدرس: es-palacio-final-test
// نوع: الاختبار النهائي الكبير للخريطة 5 والمنهج كله!
// ربط ثقافي: القصر الملكي - جوهرة العاصمة مدريد 👑
// ═══════════════════════════════════════

export type TestCategory = 'fiestas' | 'vacaciones' | 'arte' | 'deporte' | 'medioambiente' | 'hispano' | 'lectura';
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
    category: 'fiestas',
    categoryAr: 'أعياد',
    categoryEmoji: '🕛',
    word: 'la Navidad',
    wordAr: 'الكريسماس',
    emoji: '🎄',
    round: 'recognize',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
    choices: [
      { emoji: '🎄', word: 'la Navidad', wordAr: 'الكريسماس' },
      { emoji: '🎊', word: 'el Año Nuevo', wordAr: 'السنة الجديدة' },
      { emoji: '🎂', word: 'el cumpleaños', wordAr: 'عيد الميلاد' },
    ],
  },
  {
    id: 'q2',
    category: 'vacaciones',
    categoryAr: 'إجازات',
    categoryEmoji: '🏖️',
    word: 'la playa',
    wordAr: 'الشاطئ',
    emoji: '🏖️',
    round: 'recognize',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
    choices: [
      { emoji: '🏖️', word: 'la playa', wordAr: 'الشاطئ' },
      { emoji: '🌊', word: 'el mar', wordAr: 'البحر' },
      { emoji: '☀️', word: 'el sol', wordAr: 'الشمس' },
    ],
  },
  {
    id: 'q3',
    category: 'arte',
    categoryAr: 'فن',
    categoryEmoji: '🖼️',
    word: 'el pintor',
    wordAr: 'الرسام',
    emoji: '👨‍🎨',
    round: 'recognize',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
    choices: [
      { emoji: '👨‍🎨', word: 'el pintor', wordAr: 'الرسام' },
      { emoji: '🎨', word: 'la pintura', wordAr: 'الطلاء' },
      { emoji: '🖼️', word: 'el cuadro', wordAr: 'اللوحة' },
    ],
  },
  {
    id: 'q4',
    category: 'deporte',
    categoryAr: 'رياضة',
    categoryEmoji: '⚽',
    word: 'el estadio',
    wordAr: 'الاستاد',
    emoji: '🏟️',
    round: 'recognize',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
    choices: [
      { emoji: '🏟️', word: 'el estadio', wordAr: 'الاستاد' },
      { emoji: '⚽', word: 'el jugador', wordAr: 'اللاعب' },
      { emoji: '🏆', word: 'ganar', wordAr: 'يفوز' },
    ],
  },
  {
    id: 'q5',
    category: 'hispano',
    categoryAr: 'دول',
    categoryEmoji: '🌍',
    word: 'el mundo',
    wordAr: 'العالم',
    emoji: '🌐',
    round: 'recognize',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
    choices: [
      { emoji: '🌐', word: 'el mundo', wordAr: 'العالم' },
      { emoji: '🇲🇽', word: 'México', wordAr: 'المكسيك' },
      { emoji: '🇦🇷', word: 'Argentina', wordAr: 'الأرجنتين' },
    ],
  },

  // ═══════════════════════════════════════
  // ✍️ Round 2: Escribir (اكتب الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q6',
    category: 'fiestas',
    categoryAr: 'أعياد',
    categoryEmoji: '🕛',
    word: 'regalo',
    wordAr: 'الهدية',
    emoji: '🎁',
    round: 'write',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'q7',
    category: 'arte',
    categoryAr: 'فن',
    categoryEmoji: '🖼️',
    word: 'museo',
    wordAr: 'المتحف',
    emoji: '🏛️',
    round: 'write',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'q8',
    category: 'medioambiente',
    categoryAr: 'بيئة',
    categoryEmoji: '🌋',
    word: 'reciclar',
    wordAr: 'يعيد التدوير',
    emoji: '♻️',
    round: 'write',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'q9',
    category: 'lectura',
    categoryAr: 'قراءة',
    categoryEmoji: '📚',
    word: 'libro',
    wordAr: 'الكتاب',
    emoji: '📕',
    round: 'write',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'q10',
    category: 'vacaciones',
    categoryAr: 'إجازات',
    categoryEmoji: '🏖️',
    word: 'hotel',
    wordAr: 'الفندق',
    emoji: '🏨',
    round: 'write',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },

  // ═══════════════════════════════════════
  // 🎤 Round 3: Hablar (انطق الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q11',
    category: 'vacaciones',
    categoryAr: 'إجازات',
    categoryEmoji: '🏖️',
    word: 'nadar',
    wordAr: 'يسبح',
    emoji: '🏊',
    round: 'speak',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'q12',
    category: 'deporte',
    categoryAr: 'رياضة',
    categoryEmoji: '⚽',
    word: 'ganar',
    wordAr: 'يفوز',
    emoji: '🏆',
    round: 'speak',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'q13',
    category: 'medioambiente',
    categoryAr: 'بيئة',
    categoryEmoji: '🌋',
    word: 'el planeta',
    wordAr: 'الكوكب',
    emoji: '🌎',
    round: 'speak',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'q14',
    category: 'hispano',
    categoryAr: 'دول',
    categoryEmoji: '🌍',
    word: 'hablar',
    wordAr: 'يتكلم',
    emoji: '🗣️',
    round: 'speak',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'q15',
    category: 'lectura',
    categoryAr: 'قراءة',
    categoryEmoji: '📚',
    word: 'aprender',
    wordAr: 'يتعلم',
    emoji: '🎓',
    round: 'speak',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
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
  fiestas:         { bg: 'rgba(220,38,38,0.7)',  text: '#DC2626' },
  vacaciones:      { bg: 'rgba(14,165,233,0.7)', text: '#0EA5E9' },
  arte:            { bg: 'rgba(124,58,237,0.7)', text: '#7C3AED' },
  deporte:         { bg: 'rgba(234,179,8,0.7)',  text: '#EAB308' },
  medioambiente:   { bg: 'rgba(249,115,22,0.7)', text: '#F97316' },
  hispano:         { bg: 'rgba(236,72,153,0.7)', text: '#EC4899' },
  lectura:         { bg: 'rgba(161,98,7,0.7)',   text: '#A16207' },
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
        titleEs: '¡Rey del español!',
        titleAr: 'ملك اللغة الأسبانية!',
        messageAr: '🏆 مبروك! أنت أكملت المنهج كامل! جاهز لشهادة A2 الرسمية! 👑🇪🇸',
      };
    case 2:
      return {
        titleEs: '¡Príncipe hispano!',
        titleAr: 'أمير أسباني!',
        messageAr: '🌟 أداء رائع في القصر الملكي! أنت قريب من الملك! 👑',
      };
    case 1:
      return {
        titleEs: '¡Aventurero!',
        titleAr: 'مغامر!',
        messageAr: '💪 بداية شجاعة! تدرب أكثر لتصبح ملك الأسبانية!',
      };
    case 0:
      return {
        titleEs: '¡Inténtalo!',
        titleAr: 'حاول تاني!',
        messageAr: '🔄 لا تستسلم! القصر الملكي بُني في سنوات، والتعلم يحتاج صبر!',
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
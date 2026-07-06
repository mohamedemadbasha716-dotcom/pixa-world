// src/data/spanish/north-test.ts

// ═══════════════════════════════════════
// 🇪🇸 اختبار الشمال - Faro de la Isla Pancha
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1
// المرجع: DELE Escolar A1 Assessment Standards
// 15 سؤال = 3 جولات × 5 أسئلة
// مناسب للأطفال 6-7 سنوات
// الدرس: es-faro-test
// نوع: اختبار شامل (Comprehensive Test)
// ربط ثقافي: المنارة - رمز إنارة المعرفة 🌊
// ═══════════════════════════════════════

export type TestCategory = 'alphabet' | 'numbers' | 'colors' | 'family' | 'fruits' | 'animals' | 'greetings';
export type TestRound = 'recognize' | 'write' | 'speak';

export interface SpanishTestQuestion {
  id: string;
  category: TestCategory;
  categoryAr: string;
  categoryEmoji: string;
  word: string;          // الكلمة الإسبانية
  wordAr: string;        // الترجمة العربية
  emoji: string;         // الإيموجي البصري
  round: TestRound;
  color: string;
  gradient: [string, string];
  // للجولة الأولى (Recognize): اختيارات الإيموجي
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
    category: 'animals',
    categoryAr: 'حيوانات',
    categoryEmoji: '🐾',
    word: 'Perro',
    wordAr: 'كلب',
    emoji: '🐶',
    round: 'recognize',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
    choices: [
      { emoji: '🐶', word: 'Perro', wordAr: 'كلب' },
      { emoji: '🐱', word: 'Gato', wordAr: 'قطة' },
      { emoji: '🐰', word: 'Conejo', wordAr: 'أرنب' },
    ],
  },
  {
    id: 'q2',
    category: 'fruits',
    categoryAr: 'فواكه',
    categoryEmoji: '🍓',
    word: 'Manzana',
    wordAr: 'تفاحة',
    emoji: '🍎',
    round: 'recognize',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
    choices: [
      { emoji: '🍌', word: 'Plátano', wordAr: 'موز' },
      { emoji: '🍎', word: 'Manzana', wordAr: 'تفاحة' },
      { emoji: '🍊', word: 'Naranja', wordAr: 'برتقالة' },
    ],
  },
  {
    id: 'q3',
    category: 'family',
    categoryAr: 'عائلة',
    categoryEmoji: '❤️',
    word: 'Mamá',
    wordAr: 'ماما',
    emoji: '👩',
    round: 'recognize',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
    choices: [
      { emoji: '👨', word: 'Papá', wordAr: 'بابا' },
      { emoji: '👩', word: 'Mamá', wordAr: 'ماما' },
      { emoji: '👶', word: 'Bebé', wordAr: 'رضيع' },
    ],
  },
  {
    id: 'q4',
    category: 'colors',
    categoryAr: 'ألوان',
    categoryEmoji: '🎨',
    word: 'Azul',
    wordAr: 'أزرق',
    emoji: '🔵',
    round: 'recognize',
    color: '#2563EB',
    gradient: ['#3B82F6', '#1E40AF'],
    choices: [
      { emoji: '🔴', word: 'Rojo', wordAr: 'أحمر' },
      { emoji: '🔵', word: 'Azul', wordAr: 'أزرق' },
      { emoji: '🟢', word: 'Verde', wordAr: 'أخضر' },
    ],
  },
  {
    id: 'q5',
    category: 'greetings',
    categoryAr: 'تحيات',
    categoryEmoji: '👋',
    word: 'Hola',
    wordAr: 'مرحبا',
    emoji: '👋',
    round: 'recognize',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
    choices: [
      { emoji: '👋', word: 'Hola', wordAr: 'مرحبا' },
      { emoji: '🙏', word: 'Gracias', wordAr: 'شكرا' },
      { emoji: '🚪', word: 'Adiós', wordAr: 'وداعا' },
    ],
  },

  // ═══════════════════════════════════════
  // ✍️ Round 2: Escribir (اكتب الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q6',
    category: 'numbers',
    categoryAr: 'أرقام',
    categoryEmoji: '🔢',
    word: 'Cinco',
    wordAr: 'خمسة',
    emoji: '5️⃣',
    round: 'write',
    color: '#FFD700',
    gradient: ['#FFD700', '#E6C200'],
  },
  {
    id: 'q7',
    category: 'colors',
    categoryAr: 'ألوان',
    categoryEmoji: '🎨',
    word: 'Verde',
    wordAr: 'أخضر',
    emoji: '🟢',
    round: 'write',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'q8',
    category: 'animals',
    categoryAr: 'حيوانات',
    categoryEmoji: '🐾',
    word: 'Gato',
    wordAr: 'قطة',
    emoji: '🐱',
    round: 'write',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'q9',
    category: 'fruits',
    categoryAr: 'فواكه',
    categoryEmoji: '🍓',
    word: 'Uva',
    wordAr: 'عنب',
    emoji: '🍇',
    round: 'write',
    color: '#9333EA',
    gradient: ['#A855F7', '#6B21A8'],
  },
  {
    id: 'q10',
    category: 'greetings',
    categoryAr: 'تحيات',
    categoryEmoji: '👋',
    word: 'Gracias',
    wordAr: 'شكرا',
    emoji: '🙏',
    round: 'write',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },

  // ═══════════════════════════════════════
  // 🎤 Round 3: Hablar (انطق الكلمة)
  // ═══════════════════════════════════════
  {
    id: 'q11',
    category: 'alphabet',
    categoryAr: 'حروف',
    categoryEmoji: '🔤',
    word: 'Sol',
    wordAr: 'شمس',
    emoji: '☀️',
    round: 'speak',
    color: '#FCA311',
    gradient: ['#FCA311', '#E08E0A'],
  },
  {
    id: 'q12',
    category: 'numbers',
    categoryAr: 'أرقام',
    categoryEmoji: '🔢',
    word: 'Diez',
    wordAr: 'عشرة',
    emoji: '🔟',
    round: 'speak',
    color: '#34D399',
    gradient: ['#34D399', '#2AB882'],
  },
  {
    id: 'q13',
    category: 'family',
    categoryAr: 'عائلة',
    categoryEmoji: '❤️',
    word: 'Abuelo',
    wordAr: 'جدي',
    emoji: '👴',
    round: 'speak',
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
  {
    id: 'q14',
    category: 'alphabet',
    categoryAr: 'حروف',
    categoryEmoji: '🔤',
    word: 'Luna',
    wordAr: 'قمر',
    emoji: '🌙',
    round: 'speak',
    color: '#C084FC',
    gradient: ['#C084FC', '#A06EE0'],
  },
  {
    id: 'q15',
    category: 'greetings',
    categoryAr: 'تحيات',
    categoryEmoji: '👋',
    word: 'Buenos días',
    wordAr: 'صباح الخير',
    emoji: '☀️',
    round: 'speak',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
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
  alphabet: { bg: 'rgba(192,132,252,0.7)', text: '#C084FC' },
  numbers: { bg: 'rgba(255,215,0,0.7)', text: '#FFD700' },
  colors: { bg: 'rgba(34,197,94,0.7)', text: '#22C55E' },
  family: { bg: 'rgba(236,72,153,0.7)', text: '#EC4899' },
  fruits: { bg: 'rgba(239,68,68,0.7)', text: '#EF4444' },
  animals: { bg: 'rgba(162,98,7,0.7)', text: '#A16207' },
  greetings: { bg: 'rgba(245,158,11,0.7)', text: '#F59E0B' },
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
        titleEs: '¡Excelente!',
        titleAr: 'ممتاز!',
        messageAr: 'أنت بطل حقيقي! أتقنت كل شيء! 🏆',
      };
    case 2:
      return {
        titleEs: '¡Muy bien!',
        titleAr: 'جيد جداً!',
        messageAr: 'أداء رائع! استمر في التعلم! 🌟',
      };
    case 1:
      return {
        titleEs: '¡Bien hecho!',
        titleAr: 'أحسنت!',
        messageAr: 'بداية جيدة! تدرب أكثر وستتحسن! 💪',
      };
    case 0:
      return {
        titleEs: '¡Inténtalo de nuevo!',
        titleAr: 'حاول مرة أخرى!',
        messageAr: 'لا تستسلم! راجع الدروس وحاول مجدداً! 🔄',
      };
  }
}

// ═══════════════════════════════════════
// 📊 ثوابت الاختبار
// ═══════════════════════════════════════
export const TOTAL_TEST_QUESTIONS = SPANISH_TEST_QUESTIONS.length; // 15
export const TOTAL_TEST_ROUNDS = SPANISH_TEST_ROUNDS.length; // 3
export const QUESTIONS_PER_ROUND = 5;
export const PASSING_THRESHOLD = 5; // الحد الأدنى للنجاح
// src/data/spanish-2/body.ts

// ═══════════════════════════════════════
// 🇪🇸 أجزاء الجسم - Castillo de Segovia
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER A1.1
// المرجع: Plan Curricular - Nociones específicas 7.4 (Cuerpo)
// 15 جزء = 3 مجموعات × 5 أجزاء
// مناسب للأطفال 7-8 سنوات
// الدرس: es-segovia-body
//
// 🎓 القاعدة الوحيدة: Este/Esta es + اسم
//    - Este (هذا) للمذكر
//    - Esta (هذه) للمؤنث
//
// 📚 الفلو الأكاديمي لكل كلمة:
//    1. تعلم الكلمة (Listen → Write → Speak)
//    2. تعلم أداة الإشارة (Listen → Write → Speak)
//    3. تركيب الجملة (Build → Speak)
// ═══════════════════════════════════════

export interface SpanishBodyPart {
  // الكلمة الأساسية
  word: string;                    // ojo
  wordAr: string;                  // عين
  emoji: string;
  imageName: string;
  
  // الجنس النحوي
  gender: 'M' | 'F';               // مذكر / مؤنث
  
  // أداة الإشارة المناسبة
  article: 'Este' | 'Esta';        // Este للمذكر | Esta للمؤنث
  articleAr: string;               // هذا | هذه
  indefinite: 'un' | 'una';        // un للمذكر | una للمؤنث
  
  // الجملة الكاملة
  sentenceEs: string;              // Este es un ojo
  sentenceAr: string;              // هذا عين
  sentenceWords: string[];         // ["Este", "es", "un", "ojo"]
  sentenceDistractors: string[];   // كلمات مشتتة للـ Build
  
  // التصميم
  color: string;
  gradient: [string, string];
}

export interface SpanishBodyGroup {
  parts: SpanishBodyPart[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_BODY: SpanishBodyPart[] = [
  // ═══════════════════════════════════════
  // 👤 المجموعة الأولى: الوجه (La Cara)
  // ═══════════════════════════════════════
  {
    word: 'ojo',
    wordAr: 'عين',
    emoji: '👁️',
    imageName: 'ojo',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un ojo',
    sentenceAr: 'هذا عين',
    sentenceWords: ['Este', 'es', 'un', 'ojo'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1E40AF'],
  },
  {
    word: 'boca',
    wordAr: 'فم',
    emoji: '👄',
    imageName: 'boca',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una boca',
    sentenceAr: 'هذه فم',
    sentenceWords: ['Esta', 'es', 'una', 'boca'],
    sentenceDistractors: ['Este', 'un'],
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    word: 'nariz',
    wordAr: 'أنف',
    emoji: '👃',
    imageName: 'nariz',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una nariz',
    sentenceAr: 'هذه أنف',
    sentenceWords: ['Esta', 'es', 'una', 'nariz'],
    sentenceDistractors: ['Este', 'un'],
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    word: 'oreja',
    wordAr: 'أذن',
    emoji: '👂',
    imageName: 'oreja',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una oreja',
    sentenceAr: 'هذه أذن',
    sentenceWords: ['Esta', 'es', 'una', 'oreja'],
    sentenceDistractors: ['Este', 'un'],
    color: '#A855F7',
    gradient: ['#C084FC', '#7E22CE'],
  },
  {
    word: 'cabeza',
    wordAr: 'رأس',
    emoji: '👤',
    imageName: 'cabeza',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una cabeza',
    sentenceAr: 'هذه رأس',
    sentenceWords: ['Esta', 'es', 'una', 'cabeza'],
    sentenceDistractors: ['Este', 'un'],
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },

  // ═══════════════════════════════════════
  // 💪 المجموعة الثانية: الجسم العلوي (El Cuerpo Superior)
  // ═══════════════════════════════════════
  {
    word: 'brazo',
    wordAr: 'ذراع',
    emoji: '💪',
    imageName: 'brazo',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un brazo',
    sentenceAr: 'هذا ذراع',
    sentenceWords: ['Este', 'es', 'un', 'brazo'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#10B981',
    gradient: ['#34D399', '#047857'],
  },
  {
    word: 'mano',
    wordAr: 'يد',
    emoji: '✋',
    imageName: 'mano',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una mano',
    sentenceAr: 'هذه يد',
    sentenceWords: ['Esta', 'es', 'una', 'mano'],
    sentenceDistractors: ['Este', 'un'],
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    word: 'dedo',
    wordAr: 'إصبع',
    emoji: '👆',
    imageName: 'dedo',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un dedo',
    sentenceAr: 'هذا إصبع',
    sentenceWords: ['Este', 'es', 'un', 'dedo'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#F472B6',
    gradient: ['#FBA4D4', '#DB2777'],
  },
  {
    word: 'hombro',
    wordAr: 'كتف',
    emoji: '🤷',
    imageName: 'hombro',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un hombro',
    sentenceAr: 'هذا كتف',
    sentenceWords: ['Este', 'es', 'un', 'hombro'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
  {
    word: 'cuello',
    wordAr: 'رقبة',
    emoji: '🦒',
    imageName: 'cuello',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un cuello',
    sentenceAr: 'هذه رقبة',
    sentenceWords: ['Este', 'es', 'un', 'cuello'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#0891B2',
    gradient: ['#06B6D4', '#155E75'],
  },

  // ═══════════════════════════════════════
  // 🦵 المجموعة الثالثة: الجسم السفلي (El Cuerpo Inferior)
  // ═══════════════════════════════════════
  {
    word: 'pierna',
    wordAr: 'ساق',
    emoji: '🦵',
    imageName: 'pierna',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una pierna',
    sentenceAr: 'هذه ساق',
    sentenceWords: ['Esta', 'es', 'una', 'pierna'],
    sentenceDistractors: ['Este', 'un'],
    color: '#16A34A',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    word: 'pie',
    wordAr: 'قدم',
    emoji: '🦶',
    imageName: 'pie',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un pie',
    sentenceAr: 'هذه قدم',
    sentenceWords: ['Este', 'es', 'un', 'pie'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#DB2777',
    gradient: ['#EC4899', '#9F1239'],
  },
  {
    word: 'rodilla',
    wordAr: 'ركبة',
    emoji: '🦴',
    imageName: 'rodilla',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una rodilla',
    sentenceAr: 'هذه ركبة',
    sentenceWords: ['Esta', 'es', 'una', 'rodilla'],
    sentenceDistractors: ['Este', 'un'],
    color: '#E11D48',
    gradient: ['#FB7185', '#9F1239'],
  },
  {
    word: 'espalda',
    wordAr: 'ظهر',
    emoji: '🚶',
    imageName: 'espalda',
    gender: 'F',
    article: 'Esta',
    articleAr: 'هذه',
    indefinite: 'una',
    sentenceEs: 'Esta es una espalda',
    sentenceAr: 'هذا ظهر',
    sentenceWords: ['Esta', 'es', 'una', 'espalda'],
    sentenceDistractors: ['Este', 'un'],
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    word: 'cuerpo',
    wordAr: 'جسم',
    emoji: '🧍',
    imageName: 'cuerpo',
    gender: 'M',
    article: 'Este',
    articleAr: 'هذا',
    indefinite: 'un',
    sentenceEs: 'Este es un cuerpo',
    sentenceAr: 'هذا جسم',
    sentenceWords: ['Este', 'es', 'un', 'cuerpo'],
    sentenceDistractors: ['Esta', 'una'],
    color: '#0E7490',
    gradient: ['#22D3EE', '#0E7490'],
  },
];

export const SPANISH_BODY_GROUPS: SpanishBodyGroup[] = [
  {
    parts: SPANISH_BODY.slice(0, 5),
    title: 'الوجه',
    titleEs: 'La Cara',
    groupId: 0,
  },
  {
    parts: SPANISH_BODY.slice(5, 10),
    title: 'الجسم العلوي',
    titleEs: 'El Cuerpo Superior',
    groupId: 1,
  },
  {
    parts: SPANISH_BODY.slice(10, 15),
    title: 'الجسم السفلي',
    titleEs: 'El Cuerpo Inferior',
    groupId: 2,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للنصوص
// ═══════════════════════════════════════
export const DARK_SPANISH_BODY_COLORS: Record<string, string> = {
  '#3B82F6': '#1E3A8A',
  '#DC2626': '#7F1D1D',
  '#EC4899': '#831843',
  '#A855F7': '#581C87',
  '#F59E0B': '#78350F',
  '#10B981': '#064E3B',
  '#FCD34D': '#78350F',
  '#F472B6': '#9F1239',
  '#78716C': '#292524',
  '#0891B2': '#164E63',
  '#16A34A': '#14532D',
  '#DB2777': '#831843',
  '#E11D48': '#881337',
  '#7C3AED': '#4C1D95',
  '#0E7490': '#164E63',
};

export function getDarkSpanishBodyColor(originalColor: string): string {
  return DARK_SPANISH_BODY_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function getSpanishBodyByWord(word: string): SpanishBodyPart | undefined {
  return SPANISH_BODY.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية لأجزاء الجسم (للمرحلة Listen Word)
 */
export function generateSpanishBodyChoices(
  correctWord: string,
  count: number = 3
): SpanishBodyPart[] {
  const correctPart = getSpanishBodyByWord(correctWord);
  if (!correctPart) return [];

  const allParts = SPANISH_BODY.filter((p) => p.word !== correctWord);
  const shuffled = allParts.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctPart];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * توليد اختيارات لأداة الإشارة (Este/Esta)
 * للمرحلة Listen Article
 */
export function generateArticleChoices(correctArticle: 'Este' | 'Esta'): string[] {
  return ['Este', 'Esta'].sort(() => Math.random() - 0.5);
}

/**
 * توليد كلمات الـ Build Sentence مع التشتيت
 */
export function generateSentenceWordPool(part: SpanishBodyPart): string[] {
  return [...part.sentenceWords, ...part.sentenceDistractors]
    .sort(() => Math.random() - 0.5);
}

/**
 * التحقق من ترتيب الكلمات في الجملة
 */
export function checkSentenceOrder(selected: string[], correct: string[]): boolean {
  if (selected.length !== correct.length) return false;
  return selected.every((word, i) => word === correct[i]);
}

/**
 * مقارنة كلمتين (للـ Write)
 */
export function compareSpanishWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, '');
  return normalize(input) === normalize(target);
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_BODY = SPANISH_BODY.length; // 15
export const TOTAL_SPANISH_BODY_GROUPS = SPANISH_BODY_GROUPS.length; // 3
export const PHASES_PER_WORD = 7; // 3 word + 3 article + 1 sentence build = 7
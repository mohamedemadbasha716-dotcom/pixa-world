// src/data/spanish-2/clothes.ts

// ═══════════════════════════════════════
// 🇪🇸 الملابس - Museo del Traje
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER A1.1
// المرجع: Plan Curricular - Nociones específicas 9.1 (Ropa)
// 15 قطعة ملابس = 3 مجموعات × 5 قطع
// مناسب للأطفال 7-8 سنوات
// الدرس: es-traje-clothes
// 🆕 الميزة اللغوية: Llevo (ألبس)
// 🎓 المنهج: Communicative Approach (الجرامر في السياق)
// ═══════════════════════════════════════

export interface SpanishClothingItem {
  // الكلمة الأساسية
  word: string;          // Camisa
  wordAr: string;        // قميص
  emoji: string;         // 👔
  imageName: string;     // camisa
  
  // الجملة الكاملة (للجرامر في السياق)
  sentenceEs: string;          // Llevo una camisa
  sentenceAr: string;          // ألبس قميص
  sentenceWords: string[];     // ["Llevo", "una", "camisa"]
  sentenceDistractors: string[]; // ["dos", "tengo", "casa"]
  
  // شرح مصغر للجرامر
  grammarHint: {
    pattern: string;     // "Llevo + una + ropa"
    patternAr: string;   // "ألبس + واحدة + ملابس"
  };
  
  // معلومات إضافية
  category: 'Superior' | 'Inferior' | 'Accesorios';
  categoryAr: string;
  gender: 'M' | 'F';     // مذكر / مؤنث (un/una)
  
  // التصميم
  color: string;
  gradient: [string, string];
}

export interface SpanishClothingGroup {
  items: SpanishClothingItem[];
  title: string;
  titleEs: string;
  groupId: number;
  
  grammarFocus: {
    pattern: string;
    patternAr: string;
    description: string;
  };
}

export const SPANISH_CLOTHES: SpanishClothingItem[] = [
  // ═══════════════════════════════════════
  // 👕 المجموعة الأولى: الملابس العلوية (Ropa Superior)
  // 🎓 الجرامر: Llevo + un/una + ropa (تعريف Llevo + التذكير والتأنيث)
  // ═══════════════════════════════════════
  {
    word: 'Camisa',
    wordAr: 'قميص',
    emoji: '👔',
    imageName: 'camisa',
    sentenceEs: 'Llevo una camisa',
    sentenceAr: 'ألبس قميص',
    sentenceWords: ['Llevo', 'una', 'camisa'],
    sentenceDistractors: ['un', 'tengo', 'casa'],
    grammarHint: {
      pattern: 'Llevo + una + ropa',
      patternAr: 'ألبس + واحدة + ملابس',
    },
    category: 'Superior',
    categoryAr: 'علوية',
    gender: 'F',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1E40AF'],
  },
  {
    word: 'Camiseta',
    wordAr: 'تي شيرت',
    emoji: '👕',
    imageName: 'camiseta',
    sentenceEs: 'Llevo una camiseta',
    sentenceAr: 'ألبس تي شيرت',
    sentenceWords: ['Llevo', 'una', 'camiseta'],
    sentenceDistractors: ['dos', 'tengo', 'mesa'],
    grammarHint: {
      pattern: 'Llevo + una + ropa',
      patternAr: 'ألبس + واحدة + ملابس',
    },
    category: 'Superior',
    categoryAr: 'علوية',
    gender: 'F',
    color: '#10B981',
    gradient: ['#34D399', '#047857'],
  },
  {
    word: 'Suéter',
    wordAr: 'سويتر',
    emoji: '🧥',
    imageName: 'sueter',
    sentenceEs: 'Llevo un suéter',
    sentenceAr: 'ألبس سويتر',
    sentenceWords: ['Llevo', 'un', 'suéter'],
    sentenceDistractors: ['una', 'tengo', 'libro'],
    grammarHint: {
      pattern: 'Llevo + un + ropa',
      patternAr: 'ألبس + واحد + ملابس',
    },
    category: 'Superior',
    categoryAr: 'علوية',
    gender: 'M',
    color: '#A855F7',
    gradient: ['#C084FC', '#7E22CE'],
  },
  {
    word: 'Chaqueta',
    wordAr: 'جاكيت',
    emoji: '🧥',
    imageName: 'chaqueta',
    sentenceEs: 'Llevo una chaqueta',
    sentenceAr: 'ألبس جاكيت',
    sentenceWords: ['Llevo', 'una', 'chaqueta'],
    sentenceDistractors: ['un', 'tengo', 'sol'],
    grammarHint: {
      pattern: 'Llevo + una + ropa',
      patternAr: 'ألبس + واحدة + ملابس',
    },
    category: 'Superior',
    categoryAr: 'علوية',
    gender: 'F',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    word: 'Vestido',
    wordAr: 'فستان',
    emoji: '👗',
    imageName: 'vestido',
    sentenceEs: 'Llevo un vestido',
    sentenceAr: 'ألبس فستان',
    sentenceWords: ['Llevo', 'un', 'vestido'],
    sentenceDistractors: ['una', 'tengo', 'agua'],
    grammarHint: {
      pattern: 'Llevo + un + ropa',
      patternAr: 'ألبس + واحد + ملابس',
    },
    category: 'Superior',
    categoryAr: 'علوية',
    gender: 'M',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },

  // ═══════════════════════════════════════
  // 👖 المجموعة الثانية: الملابس السفلية (Ropa Inferior)
  // 🎓 الجرامر: Llevo + ropa + color (مقدمة للألوان)
  // ═══════════════════════════════════════
  {
    word: 'Pantalones',
    wordAr: 'بنطلون',
    emoji: '👖',
    imageName: 'pantalones',
    sentenceEs: 'Llevo pantalones azules',
    sentenceAr: 'ألبس بنطلون أزرق',
    sentenceWords: ['Llevo', 'pantalones', 'azules'],
    sentenceDistractors: ['una', 'rojos', 'casa'],
    grammarHint: {
      pattern: 'Llevo + ropa + لون',
      patternAr: 'ألبس + ملابس + لون',
    },
    category: 'Inferior',
    categoryAr: 'سفلية',
    gender: 'M',
    color: '#1E40AF',
    gradient: ['#3B82F6', '#1E3A8A'],
  },
  {
    word: 'Shorts',
    wordAr: 'شورت',
    emoji: '🩳',
    imageName: 'shorts',
    sentenceEs: 'Llevo shorts rojos',
    sentenceAr: 'ألبس شورت أحمر',
    sentenceWords: ['Llevo', 'shorts', 'rojos'],
    sentenceDistractors: ['una', 'azules', 'libro'],
    grammarHint: {
      pattern: 'Llevo + ropa + لون',
      patternAr: 'ألبس + ملابس + لون',
    },
    category: 'Inferior',
    categoryAr: 'سفلية',
    gender: 'M',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    word: 'Falda',
    wordAr: 'تنورة',
    emoji: '👗',
    imageName: 'falda',
    sentenceEs: 'Llevo una falda rosa',
    sentenceAr: 'ألبس تنورة وردية',
    sentenceWords: ['Llevo', 'una', 'falda', 'rosa'],
    sentenceDistractors: ['un', 'azul', 'sol'],
    grammarHint: {
      pattern: 'Llevo + una + ropa + لون',
      patternAr: 'ألبس + واحدة + ملابس + لون',
    },
    category: 'Inferior',
    categoryAr: 'سفلية',
    gender: 'F',
    color: '#F472B6',
    gradient: ['#FBA4D4', '#DB2777'],
  },
  {
    word: 'Calcetines',
    wordAr: 'شراب',
    emoji: '🧦',
    imageName: 'calcetines',
    sentenceEs: 'Llevo calcetines blancos',
    sentenceAr: 'ألبس شراب أبيض',
    sentenceWords: ['Llevo', 'calcetines', 'blancos'],
    sentenceDistractors: ['una', 'negros', 'mesa'],
    grammarHint: {
      pattern: 'Llevo + ropa + لون',
      patternAr: 'ألبس + ملابس + لون',
    },
    category: 'Inferior',
    categoryAr: 'سفلية',
    gender: 'M',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    word: 'Zapatos',
    wordAr: 'حذاء',
    emoji: '👟',
    imageName: 'zapatos',
    sentenceEs: 'Llevo zapatos negros',
    sentenceAr: 'ألبس حذاء أسود',
    sentenceWords: ['Llevo', 'zapatos', 'negros'],
    sentenceDistractors: ['una', 'rojos', 'agua'],
    grammarHint: {
      pattern: 'Llevo + ropa + لون',
      patternAr: 'ألبس + ملابس + لون',
    },
    category: 'Inferior',
    categoryAr: 'سفلية',
    gender: 'M',
    color: '#1F2937',
    gradient: ['#374151', '#111827'],
  },

  // ═══════════════════════════════════════
  // 🧤 المجموعة الثالثة: الإكسسوارات (Accesorios)
  // 🎓 الجرامر: Llevo + ropa + adjetivo (الصفات)
  // ═══════════════════════════════════════
  {
    word: 'Sombrero',
    wordAr: 'قبعة',
    emoji: '🎩',
    imageName: 'sombrero',
    sentenceEs: 'Llevo un sombrero grande',
    sentenceAr: 'ألبس قبعة كبيرة',
    sentenceWords: ['Llevo', 'un', 'sombrero', 'grande'],
    sentenceDistractors: ['una', 'pequeño', 'casa'],
    grammarHint: {
      pattern: 'Llevo + un + ropa + صفة',
      patternAr: 'ألبس + واحد + ملابس + صفة',
    },
    category: 'Accesorios',
    categoryAr: 'إكسسوارات',
    gender: 'M',
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
  {
    word: 'Bufanda',
    wordAr: 'كوفية',
    emoji: '🧣',
    imageName: 'bufanda',
    sentenceEs: 'Llevo una bufanda larga',
    sentenceAr: 'ألبس كوفية طويلة',
    sentenceWords: ['Llevo', 'una', 'bufanda', 'larga'],
    sentenceDistractors: ['un', 'corta', 'sol'],
    grammarHint: {
      pattern: 'Llevo + una + ropa + صفة',
      patternAr: 'ألبس + واحدة + ملابس + صفة',
    },
    category: 'Accesorios',
    categoryAr: 'إكسسوارات',
    gender: 'F',
    color: '#16A34A',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    word: 'Guantes',
    wordAr: 'قفازات',
    emoji: '🧤',
    imageName: 'guantes',
    sentenceEs: 'Llevo guantes calientes',
    sentenceAr: 'ألبس قفازات دافية',
    sentenceWords: ['Llevo', 'guantes', 'calientes'],
    sentenceDistractors: ['una', 'fríos', 'mesa'],
    grammarHint: {
      pattern: 'Llevo + ropa + صفة',
      patternAr: 'ألبس + ملابس + صفة',
    },
    category: 'Accesorios',
    categoryAr: 'إكسسوارات',
    gender: 'M',
    color: '#0891B2',
    gradient: ['#06B6D4', '#155E75'],
  },
  {
    word: 'Gafas',
    wordAr: 'نظارة',
    emoji: '👓',
    imageName: 'gafas',
    sentenceEs: 'Llevo gafas modernas',
    sentenceAr: 'ألبس نظارة عصرية',
    sentenceWords: ['Llevo', 'gafas', 'modernas'],
    sentenceDistractors: ['un', 'viejas', 'pan'],
    grammarHint: {
      pattern: 'Llevo + ropa + صفة',
      patternAr: 'ألبس + ملابس + صفة',
    },
    category: 'Accesorios',
    categoryAr: 'إكسسوارات',
    gender: 'F',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    word: 'Mochila',
    wordAr: 'شنطة ظهر',
    emoji: '🎒',
    imageName: 'mochila',
    sentenceEs: 'Llevo una mochila pesada',
    sentenceAr: 'ألبس شنطة تقيلة',
    sentenceWords: ['Llevo', 'una', 'mochila', 'pesada'],
    sentenceDistractors: ['un', 'ligera', 'flor'],
    grammarHint: {
      pattern: 'Llevo + una + ropa + صفة',
      patternAr: 'ألبس + واحدة + ملابس + صفة',
    },
    category: 'Accesorios',
    categoryAr: 'إكسسوارات',
    gender: 'F',
    color: '#E11D48',
    gradient: ['#FB7185', '#9F1239'],
  },
];

export const SPANISH_CLOTHES_GROUPS: SpanishClothingGroup[] = [
  {
    items: SPANISH_CLOTHES.slice(0, 5),
    title: 'الملابس العلوية',
    titleEs: 'Grupo 1: Ropa Superior',
    groupId: 0,
    grammarFocus: {
      pattern: 'Llevo + un/una + ropa',
      patternAr: 'ألبس + واحد/واحدة + ملابس',
      description: 'تعلم الفعل Llevo (ألبس) مع التذكير والتأنيث',
    },
  },
  {
    items: SPANISH_CLOTHES.slice(5, 10),
    title: 'الملابس السفلية',
    titleEs: 'Grupo 2: Ropa Inferior',
    groupId: 1,
    grammarFocus: {
      pattern: 'Llevo + ropa + color',
      patternAr: 'ألبس + ملابس + لون',
      description: 'إضافة الألوان لوصف الملابس (azules, rojos, blancos)',
    },
  },
  {
    items: SPANISH_CLOTHES.slice(10, 15),
    title: 'الإكسسوارات',
    titleEs: 'Grupo 3: Accesorios',
    groupId: 2,
    grammarFocus: {
      pattern: 'Llevo + ropa + adjetivo',
      patternAr: 'ألبس + ملابس + صفة',
      description: 'إضافة الصفات لوصف الإكسسوارات (grande, larga, pesada)',
    },
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للنصوص
// ═══════════════════════════════════════
export const DARK_SPANISH_CLOTHES_COLORS: Record<string, string> = {
  '#3B82F6': '#1E3A8A',
  '#10B981': '#064E3B',
  '#A855F7': '#581C87',
  '#DC2626': '#7F1D1D',
  '#EC4899': '#831843',
  '#1E40AF': '#1E3A8A',
  '#F59E0B': '#78350F',
  '#F472B6': '#9F1239',
  '#FCD34D': '#78350F',
  '#1F2937': '#030712',
  '#78716C': '#292524',
  '#16A34A': '#14532D',
  '#0891B2': '#164E63',
  '#7C3AED': '#4C1D95',
  '#E11D48': '#881337',
};

export function getDarkSpanishClothesColor(originalColor: string): string {
  return DARK_SPANISH_CLOTHES_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function getSpanishClothesByWord(word: string): SpanishClothingItem | undefined {
  return SPANISH_CLOTHES.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

export function generateSpanishClothesChoices(
  correctWord: string,
  count: number = 3
): SpanishClothingItem[] {
  const correctItem = getSpanishClothesByWord(correctWord);
  if (!correctItem) return [];

  const allItems = SPANISH_CLOTHES.filter((p) => p.word !== correctWord);
  const shuffled = allItems.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctItem];

  return choices.sort(() => Math.random() - 0.5);
}

export function generateClothesSentenceWordPool(item: SpanishClothingItem): string[] {
  return [...item.sentenceWords, ...item.sentenceDistractors]
    .sort(() => Math.random() - 0.5);
}

export function checkClothesSentenceOrder(selected: string[], correct: string[]): boolean {
  if (selected.length !== correct.length) return false;
  return selected.every((word, i) => word === correct[i]);
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_CLOTHES = SPANISH_CLOTHES.length; // 15
export const TOTAL_SPANISH_CLOTHES_GROUPS = SPANISH_CLOTHES_GROUPS.length; // 3
export const PHASES_PER_SPANISH_CLOTHES = 3; // listen + build + speak
export const TOTAL_ANSWERS_PER_SPANISH_CLOTHES_LESSON =
  TOTAL_SPANISH_CLOTHES * PHASES_PER_SPANISH_CLOTHES; // 45
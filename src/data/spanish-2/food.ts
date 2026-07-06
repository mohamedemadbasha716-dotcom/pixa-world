// ═══════════════════════════════════════════════════════════
// 🍖 Spanish Food Lesson Data
// 🏛️ Mesón de Cándido - Map 2, Lesson 3
// ═══════════════════════════════════════════════════════════

export interface SpanishFoodItem {
  // المعرّف
  id: string;
  
  // الكلمة الأساسية (مع أداة التعريف)
  word: string;          // مثل: "el pan"
  wordAr: string;        // مثل: "الخبز"
  emoji: string;         // مثل: "🍞"
  
  // الجملة الكاملة
  sentenceEs: string;    // مثل: "Como pan"
  sentenceAr: string;    // مثل: "آكل خبز"
  sentenceWords: string[]; // ["Como", "pan"]
  
  // التصنيف
  category: 'Principal' | 'Postre' | 'Bebida';
  categoryAr: string;
  
  // الجنس النحوي
  gender: 'M' | 'F';
  article: 'el' | 'la';
  
  // نوع الفعل المستخدم
  verb: 'comer' | 'beber';
  verbAr: string;
  
  // الجرامر
  grammarHint: {
    pattern: string;     // مثل: "Como + اسم طعام"
    rule: string;        // شرح بسيط
  };
  
  // الألوان
  color: string;
  gradient: [string, string];
}

// ═══════════════════════════════════════════════════════════
// 📚 البيانات الكاملة - 15 صنف
// ═══════════════════════════════════════════════════════════

export const SPANISH_FOODS: SpanishFoodItem[] = [
  // ═══════════ Group 1: Comidas Principales (الأطباق الرئيسية) ═══════════
  {
    id: 'pan',
    word: 'el pan',
    wordAr: 'الخبز',
    emoji: '🍞',
    sentenceEs: 'Como pan',
    sentenceAr: 'آكل خبز',
    sentenceWords: ['Como', 'pan'],
    category: 'Principal',
    categoryAr: 'طبق رئيسي',
    gender: 'M',
    article: 'el',
    verb: 'comer',
    verbAr: 'يأكل',
    grammarHint: {
      pattern: 'Como + اسم طعام',
      rule: 'Como معناها "أنا آكل" - من فعل comer',
    },
    color: '#D97706',
    gradient: ['#F59E0B', '#92400E'],
  },
  {
    id: 'arroz',
    word: 'el arroz',
    wordAr: 'الأرز',
    emoji: '🍚',
    sentenceEs: 'Quiero arroz',
    sentenceAr: 'عايز رز',
    sentenceWords: ['Quiero', 'arroz'],
    category: 'Principal',
    categoryAr: 'طبق رئيسي',
    gender: 'M',
    article: 'el',
    verb: 'comer',
    verbAr: 'يريد',
    grammarHint: {
      pattern: 'Quiero + اسم',
      rule: 'Quiero معناها "أنا عايز" - من فعل querer',
    },
    color: '#FBBF24',
    gradient: ['#FCD34D', '#D97706'],
  },
  {
    id: 'carne',
    word: 'la carne',
    wordAr: 'اللحم',
    emoji: '🥩',
    sentenceEs: 'Me gusta la carne',
    sentenceAr: 'بحب اللحم',
    sentenceWords: ['Me', 'gusta', 'la', 'carne'],
    category: 'Principal',
    categoryAr: 'طبق رئيسي',
    gender: 'F',
    article: 'la',
    verb: 'comer',
    verbAr: 'يأكل',
    grammarHint: {
      pattern: 'Me gusta + la/el + اسم',
      rule: 'Me gusta معناها "بحب" - لازم أداة التعريف معاها',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'pescado',
    word: 'el pescado',
    wordAr: 'السمك',
    emoji: '🐟',
    sentenceEs: 'Como pescado',
    sentenceAr: 'آكل سمك',
    sentenceWords: ['Como', 'pescado'],
    category: 'Principal',
    categoryAr: 'طبق رئيسي',
    gender: 'M',
    article: 'el',
    verb: 'comer',
    verbAr: 'يأكل',
    grammarHint: {
      pattern: 'Como + اسم طعام',
      rule: 'مع Como مش لازم أداة تعريف',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'pasta',
    word: 'la pasta',
    wordAr: 'المكرونة',
    emoji: '🍝',
    sentenceEs: 'Quiero pasta',
    sentenceAr: 'عايز مكرونة',
    sentenceWords: ['Quiero', 'pasta'],
    category: 'Principal',
    categoryAr: 'طبق رئيسي',
    gender: 'F',
    article: 'la',
    verb: 'comer',
    verbAr: 'يريد',
    grammarHint: {
      pattern: 'Quiero + اسم',
      rule: 'Quiero بدون أداة تعريف في الكلام البسيط',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },

  // ═══════════ Group 2: Postres y Dulces (الحلويات) ═══════════
  {
    id: 'tarta',
    word: 'la tarta',
    wordAr: 'الكعكة',
    emoji: '🎂',
    sentenceEs: 'Me gusta la tarta',
    sentenceAr: 'بحب الكعكة',
    sentenceWords: ['Me', 'gusta', 'la', 'tarta'],
    category: 'Postre',
    categoryAr: 'حلويات',
    gender: 'F',
    article: 'la',
    verb: 'comer',
    verbAr: 'يأكل',
    grammarHint: {
      pattern: 'Me gusta + la + مؤنث',
      rule: 'la قبل المؤنث (la tarta)',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'helado',
    word: 'el helado',
    wordAr: 'الآيس كريم',
    emoji: '🍦',
    sentenceEs: 'Quiero helado',
    sentenceAr: 'عايز آيس كريم',
    sentenceWords: ['Quiero', 'helado'],
    category: 'Postre',
    categoryAr: 'حلويات',
    gender: 'M',
    article: 'el',
    verb: 'comer',
    verbAr: 'يريد',
    grammarHint: {
      pattern: 'Quiero + مذكر',
      rule: 'el قبل المذكر (el helado)',
    },
    color: '#A78BFA',
    gradient: ['#C4B5FD', '#7C3AED'],
  },
  {
    id: 'galleta',
    word: 'la galleta',
    wordAr: 'البسكويت',
    emoji: '🍪',
    sentenceEs: 'Como una galleta',
    sentenceAr: 'آكل بسكويت',
    sentenceWords: ['Como', 'una', 'galleta'],
    category: 'Postre',
    categoryAr: 'حلويات',
    gender: 'F',
    article: 'la',
    verb: 'comer',
    verbAr: 'يأكل',
    grammarHint: {
      pattern: 'Como + una + مؤنث',
      rule: 'una معناها "واحدة" للمؤنث',
    },
    color: '#CA8A04',
    gradient: ['#EAB308', '#854D0E'],
  },
  {
    id: 'chocolate',
    word: 'el chocolate',
    wordAr: 'الشيكولاتة',
    emoji: '🍫',
    sentenceEs: 'Me gusta el chocolate',
    sentenceAr: 'بحب الشيكولاتة',
    sentenceWords: ['Me', 'gusta', 'el', 'chocolate'],
    category: 'Postre',
    categoryAr: 'حلويات',
    gender: 'M',
    article: 'el',
    verb: 'comer',
    verbAr: 'يأكل',
    grammarHint: {
      pattern: 'Me gusta + el + مذكر',
      rule: 'el للمذكر مع Me gusta',
    },
    color: '#78350F',
    gradient: ['#92400E', '#451A03'],
  },
  {
    id: 'donut',
    word: 'el donut',
    wordAr: 'الدوناتس',
    emoji: '🍩',
    sentenceEs: 'Quiero un donut',
    sentenceAr: 'عايز دوناتس',
    sentenceWords: ['Quiero', 'un', 'donut'],
    category: 'Postre',
    categoryAr: 'حلويات',
    gender: 'M',
    article: 'el',
    verb: 'comer',
    verbAr: 'يريد',
    grammarHint: {
      pattern: 'Quiero + un + مذكر',
      rule: 'un معناها "واحد" للمذكر',
    },
    color: '#F472B6',
    gradient: ['#F9A8D4', '#DB2777'],
  },

  // ═══════════ Group 3: Bebidas (المشروبات) ═══════════
  {
    id: 'agua',
    word: 'el agua',
    wordAr: 'المياه',
    emoji: '💧',
    sentenceEs: 'Bebo agua',
    sentenceAr: 'أشرب مياه',
    sentenceWords: ['Bebo', 'agua'],
    category: 'Bebida',
    categoryAr: 'مشروبات',
    gender: 'F',
    article: 'el',
    verb: 'beber',
    verbAr: 'يشرب',
    grammarHint: {
      pattern: 'Bebo + اسم مشروب',
      rule: 'Bebo معناها "أنا أشرب" - من فعل beber',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'leche',
    word: 'la leche',
    wordAr: 'الحليب',
    emoji: '🥛',
    sentenceEs: 'Bebo leche',
    sentenceAr: 'أشرب حليب',
    sentenceWords: ['Bebo', 'leche'],
    category: 'Bebida',
    categoryAr: 'مشروبات',
    gender: 'F',
    article: 'la',
    verb: 'beber',
    verbAr: 'يشرب',
    grammarHint: {
      pattern: 'Bebo + اسم مشروب',
      rule: 'leche مؤنثة بس مع Bebo مش محتاجين أداة',
    },
    color: '#F3F4F6',
    gradient: ['#FFFFFF', '#9CA3AF'],
  },
  {
    id: 'zumo',
    word: 'el zumo',
    wordAr: 'العصير',
    emoji: '🧃',
    sentenceEs: 'Quiero zumo',
    sentenceAr: 'عايز عصير',
    sentenceWords: ['Quiero', 'zumo'],
    category: 'Bebida',
    categoryAr: 'مشروبات',
    gender: 'M',
    article: 'el',
    verb: 'beber',
    verbAr: 'يريد',
    grammarHint: {
      pattern: 'Quiero + مشروب',
      rule: 'في إسبانيا يقولوا zumo، في أمريكا اللاتينية jugo',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'cafe',
    word: 'el café',
    wordAr: 'القهوة',
    emoji: '☕',
    sentenceEs: 'Me gusta el café',
    sentenceAr: 'بحب القهوة',
    sentenceWords: ['Me', 'gusta', 'el', 'café'],
    category: 'Bebida',
    categoryAr: 'مشروبات',
    gender: 'M',
    article: 'el',
    verb: 'beber',
    verbAr: 'يشرب',
    grammarHint: {
      pattern: 'Me gusta + el + مذكر',
      rule: 'café بفتحة على الـ é',
    },
    color: '#78350F',
    gradient: ['#92400E', '#451A03'],
  },
  {
    id: 'te',
    word: 'el té',
    wordAr: 'الشاي',
    emoji: '🍵',
    sentenceEs: 'Bebo té',
    sentenceAr: 'أشرب شاي',
    sentenceWords: ['Bebo', 'té'],
    category: 'Bebida',
    categoryAr: 'مشروبات',
    gender: 'M',
    article: 'el',
    verb: 'beber',
    verbAr: 'يشرب',
    grammarHint: {
      pattern: 'Bebo + مشروب',
      rule: 'té بفتحة (é) عشان نفرّقها عن te (ضمير)',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5 أصناف)
// ═══════════════════════════════════════════════════════════

export interface SpanishFoodGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishFoodItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_FOOD_GROUPS: SpanishFoodGroup[] = [
  {
    id: 'group-principales',
    titleEs: 'Comidas Principales',
    titleAr: 'الأطباق الرئيسية',
    emoji: '🍖',
    items: SPANISH_FOODS.filter(f => f.category === 'Principal'),
    grammarFocus: {
      pattern: 'Como / Quiero / Me gusta + اسم',
      description: '3 طرق للتعبير: آكل، عايز، بحب',
    },
  },
  {
    id: 'group-postres',
    titleEs: 'Postres y Dulces',
    titleAr: 'الحلويات',
    emoji: '🍰',
    items: SPANISH_FOODS.filter(f => f.category === 'Postre'),
    grammarFocus: {
      pattern: 'un (مذكر) / una (مؤنث) + اسم',
      description: 'un للمذكر و una للمؤنث = "واحد/واحدة"',
    },
  },
  {
    id: 'group-bebidas',
    titleEs: 'Bebidas',
    titleAr: 'المشروبات',
    emoji: '🥤',
    items: SPANISH_FOODS.filter(f => f.category === 'Bebida'),
    grammarFocus: {
      pattern: 'Bebo + مشروب',
      description: 'فعل beber (يشرب) للمشروبات، comer للأكل',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 توليد اختيارات عشوائية للـ Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishFoodChoices(
  correctWord: string,
  count: number = 3
): SpanishFoodItem[] {
  const correct = SPANISH_FOODS.find(f => f.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_FOODS.filter(f => f.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];
  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد مجموعة كلمات للـ Build Phase
// ═══════════════════════════════════════════════════════════

export function generateFoodSentenceWordPool(
  item: SpanishFoodItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];
  
  // كلمات مشتتة شائعة في موضوع الطعام
  const commonDistractors = ['No', 'Sí', 'mucho', 'poco', 'el', 'la', 'un', 'una', 'Bebo', 'Como', 'Quiero'];
  
  // نجيب كلمات من جمل تانية
  const otherItems = SPANISH_FOODS.filter(f => f.id !== item.id);
  const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(2, shuffledOthers.length); i++) {
    const randomWord = shuffledOthers[i].sentenceWords[
      Math.floor(Math.random() * shuffledOthers[i].sentenceWords.length)
    ];
    
    if (!correctWords.includes(randomWord) && !distractors.includes(randomWord)) {
      distractors.push(randomWord);
    }
  }
  
  // نخلط الكلمات
  const allWords = [...correctWords, ...distractors];
  return allWords.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// ✅ التحقق من ترتيب الجملة
// ═══════════════════════════════════════════════════════════

export function checkFoodSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;
  
  return selectedWords.every((word, idx) => 
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
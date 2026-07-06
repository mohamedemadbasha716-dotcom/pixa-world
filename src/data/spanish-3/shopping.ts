// ═══════════════════════════════════════════════════════════
// 🛒 Spanish Shopping Lesson Data
// 🏪 Mercado de La Boquería - Map 3, Lesson 4
// ═══════════════════════════════════════════════════════════

export interface SpanishShoppingItem {
  id: string;

  // الكلمة الأساسية
  word: string;       // مثل: "el dinero"
  wordAr: string;     // مثل: "الفلوس"
  emoji: string;

  // الجملة الكاملة
  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  // التصنيف
  category: 'Dinero' | 'Tienda' | 'Mercado';
  categoryAr: string;

  // الجرامر
  grammarHint: {
    pattern: string;
    rule: string;
  };

  // ملاحظة إضافية
  note?: string;

  // الألوان
  color: string;
  gradient: [string, string];
}

// ═══════════════════════════════════════════════════════════
// 📚 البيانات الكاملة - 15 كلمة
// ═══════════════════════════════════════════════════════════

export const SPANISH_SHOPPING_ITEMS: SpanishShoppingItem[] = [
  // ═══════════ Group 1: Dinero y Precios (الفلوس والأسعار) ═══════════
  {
    id: 'dinero',
    word: 'el dinero',
    wordAr: 'الفلوس',
    emoji: '💰',
    sentenceEs: 'Tengo dinero',
    sentenceAr: 'معايا فلوس',
    sentenceWords: ['Tengo', 'dinero'],
    category: 'Dinero',
    categoryAr: 'الفلوس',
    grammarHint: {
      pattern: 'Tengo + اسم',
      rule: 'Tengo = عندي/معايا',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'euro',
    word: 'el euro',
    wordAr: 'اليورو',
    emoji: '💶',
    sentenceEs: 'Cuesta un euro',
    sentenceAr: 'سعره يورو',
    sentenceWords: ['Cuesta', 'un', 'euro'],
    category: 'Dinero',
    categoryAr: 'الفلوس',
    grammarHint: {
      pattern: 'Cuesta + سعر',
      rule: 'Cuesta = سعره - من فعل costar',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'barato',
    word: 'barato',
    wordAr: 'رخيص',
    emoji: '💚',
    sentenceEs: 'Es barato',
    sentenceAr: 'ده رخيص',
    sentenceWords: ['Es', 'barato'],
    category: 'Dinero',
    categoryAr: 'الفلوس',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: barata',
    },
    note: 'للمؤنث: barata',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'caro',
    word: 'caro',
    wordAr: 'غالي',
    emoji: '💸',
    sentenceEs: 'Es caro',
    sentenceAr: 'ده غالي',
    sentenceWords: ['Es', 'caro'],
    category: 'Dinero',
    categoryAr: 'الفلوس',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: cara',
    },
    note: 'للمؤنث: cara',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'cuanto',
    word: '¿Cuánto cuesta?',
    wordAr: 'بكام؟',
    emoji: '🏷️',
    sentenceEs: '¿Cuánto cuesta?',
    sentenceAr: 'بكام ده؟',
    sentenceWords: ['Cuánto', 'cuesta'],
    category: 'Dinero',
    categoryAr: 'الفلوس',
    grammarHint: {
      pattern: '¿Cuánto cuesta?',
      rule: 'أهم سؤال في التسوق!',
    },
    note: 'انتبه للـ ¿ ? في السؤال',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },

  // ═══════════ Group 2: En la Tienda (في المحل) ═══════════
  {
    id: 'tienda',
    word: 'la tienda',
    wordAr: 'المحل',
    emoji: '🏪',
    sentenceEs: 'Voy a la tienda',
    sentenceAr: 'رايح المحل',
    sentenceWords: ['Voy', 'a', 'la', 'tienda'],
    category: 'Tienda',
    categoryAr: 'في المحل',
    grammarHint: {
      pattern: 'Voy a + la + مكان',
      rule: 'Voy = رايح - من فعل ir',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'comprar',
    word: 'comprar',
    wordAr: 'يشتري',
    emoji: '🛍️',
    sentenceEs: 'Quiero comprar',
    sentenceAr: 'عايز أشتري',
    sentenceWords: ['Quiero', 'comprar'],
    category: 'Tienda',
    categoryAr: 'في المحل',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'Quiero = عايز',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'vender',
    word: 'vender',
    wordAr: 'يبيع',
    emoji: '🏷️',
    sentenceEs: 'Van a vender',
    sentenceAr: 'هيبيعوا',
    sentenceWords: ['Van', 'a', 'vender'],
    category: 'Tienda',
    categoryAr: 'في المحل',
    grammarHint: {
      pattern: 'Van a + فعل',
      rule: 'Van a = هيعملوا (المستقبل القريب)',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'pagar',
    word: 'pagar',
    wordAr: 'يدفع',
    emoji: '💳',
    sentenceEs: 'Voy a pagar',
    sentenceAr: 'هدفع',
    sentenceWords: ['Voy', 'a', 'pagar'],
    category: 'Tienda',
    categoryAr: 'في المحل',
    grammarHint: {
      pattern: 'Voy a + فعل',
      rule: 'Voy a = هعمل (المستقبل القريب)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'bolsa',
    word: 'la bolsa',
    wordAr: 'الشنطة',
    emoji: '👜',
    sentenceEs: 'Necesito una bolsa',
    sentenceAr: 'محتاج شنطة',
    sentenceWords: ['Necesito', 'una', 'bolsa'],
    category: 'Tienda',
    categoryAr: 'في المحل',
    grammarHint: {
      pattern: 'Necesito + una + مؤنث',
      rule: 'bolsa مؤنثة → una bolsa',
    },
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },

  // ═══════════ Group 3: En el Mercado (في السوق) ═══════════
  {
    id: 'mercado',
    word: 'el mercado',
    wordAr: 'السوق',
    emoji: '🏛️',
    sentenceEs: 'Voy al mercado',
    sentenceAr: 'رايح السوق',
    sentenceWords: ['Voy', 'al', 'mercado'],
    category: 'Mercado',
    categoryAr: 'في السوق',
    grammarHint: {
      pattern: 'Voy al + مذكر',
      rule: 'al = a + el (اختصار مع المذكر)',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'pan',
    word: 'el pan',
    wordAr: 'الخبز',
    emoji: '🍞',
    sentenceEs: 'Compro pan',
    sentenceAr: 'بشتري خبز',
    sentenceWords: ['Compro', 'pan'],
    category: 'Mercado',
    categoryAr: 'في السوق',
    grammarHint: {
      pattern: 'Compro + اسم',
      rule: 'Compro = بشتري - من فعل comprar',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'fruta',
    word: 'la fruta',
    wordAr: 'الفاكهة',
    emoji: '🍎',
    sentenceEs: 'Compro fruta',
    sentenceAr: 'بشتري فاكهة',
    sentenceWords: ['Compro', 'fruta'],
    category: 'Mercado',
    categoryAr: 'في السوق',
    grammarHint: {
      pattern: 'Compro + اسم',
      rule: 'fruta مؤنثة → la fruta',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'mucho',
    word: 'mucho',
    wordAr: 'كتير',
    emoji: '📦',
    sentenceEs: 'Compro mucho',
    sentenceAr: 'بشتري كتير',
    sentenceWords: ['Compro', 'mucho'],
    category: 'Mercado',
    categoryAr: 'في السوق',
    grammarHint: {
      pattern: 'Compro + كمية',
      rule: 'mucho = كتير (بيتغير مع المؤنث: mucha)',
    },
    note: 'للمؤنث: mucha',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'poco',
    word: 'poco',
    wordAr: 'شوية',
    emoji: '🤏',
    sentenceEs: 'Compro poco',
    sentenceAr: 'بشتري شوية',
    sentenceWords: ['Compro', 'poco'],
    category: 'Mercado',
    categoryAr: 'في السوق',
    grammarHint: {
      pattern: 'Compro + كمية',
      rule: 'poco = شوية (عكس mucho)',
    },
    note: 'للمؤنث: poca',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishShoppingGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishShoppingItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_SHOPPING_GROUPS: SpanishShoppingGroup[] = [
  {
    id: 'group-dinero',
    titleEs: 'Dinero y Precios',
    titleAr: 'الفلوس والأسعار',
    emoji: '💰',
    items: SPANISH_SHOPPING_ITEMS.filter(i => i.category === 'Dinero'),
    grammarFocus: {
      pattern: 'Es + صفة / Cuesta + سعر',
      description: 'كلمات وأسئلة السعر والفلوس',
    },
  },
  {
    id: 'group-tienda',
    titleEs: 'En la Tienda',
    titleAr: 'في المحل',
    emoji: '🏪',
    items: SPANISH_SHOPPING_ITEMS.filter(i => i.category === 'Tienda'),
    grammarFocus: {
      pattern: 'Voy a + فعل (المستقبل القريب)',
      description: 'أفعال التسوق: comprar, vender, pagar',
    },
  },
  {
    id: 'group-mercado',
    titleEs: 'En el Mercado',
    titleAr: 'في السوق',
    emoji: '🏛️',
    items: SPANISH_SHOPPING_ITEMS.filter(i => i.category === 'Mercado'),
    grammarFocus: {
      pattern: 'Compro + كمية + اسم',
      description: 'التسوق من السوق: mucho / poco',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishShoppingChoices(
  correctWord: string,
  count: number = 3
): SpanishShoppingItem[] {
  const correct = SPANISH_SHOPPING_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_SHOPPING_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateShoppingSentenceWordPool(
  item: SpanishShoppingItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_SHOPPING_ITEMS.filter(i => i.id !== item.id);
  const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
    const words = shuffledOthers[i].sentenceWords.filter(w => !correctWords.includes(w));
    const randomWord = words[Math.floor(Math.random() * words.length)];

    if (randomWord && !distractors.includes(randomWord)) {
      distractors.push(randomWord);
    }
  }

  return [...correctWords, ...distractors].sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// ✅ التحقق من ترتيب الجملة
// ═══════════════════════════════════════════════════════════

export function checkShoppingSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
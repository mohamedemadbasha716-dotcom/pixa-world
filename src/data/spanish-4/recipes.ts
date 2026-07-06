// ═══════════════════════════════════════════════════════════
// 🍳 Spanish Recipes Lesson Data
// 🏛️ Taberna Triana - Map 4, Lesson 5
// ═══════════════════════════════════════════════════════════

export interface SpanishRecipesItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Ingrediente' | 'Cocinar' | 'Mesa';
  categoryAr: string;

  grammarHint: {
    pattern: string;
    rule: string;
  };

  note?: string;

  color: string;
  gradient: [string, string];
}

// ═══════════════════════════════════════════════════════════
// 📚 البيانات الكاملة - 15 كلمة
// ═══════════════════════════════════════════════════════════

export const SPANISH_RECIPES_ITEMS: SpanishRecipesItem[] = [
  // ═══════════ Group 1: Ingredientes (المكونات) ═══════════
  {
    id: 'aceite',
    word: 'el aceite',
    wordAr: 'الزيت',
    emoji: '🫒',
    sentenceEs: 'Uso aceite',
    sentenceAr: 'باستخدم زيت',
    sentenceWords: ['Uso', 'aceite'],
    category: 'Ingrediente',
    categoryAr: 'مكونات',
    grammarHint: {
      pattern: 'Uso + مكون',
      rule: 'Uso = باستخدم - من فعل usar',
    },
    color: '#84CC16',
    gradient: ['#A3E635', '#4D7C0F'],
  },
  {
    id: 'sal',
    word: 'la sal',
    wordAr: 'الملح',
    emoji: '🧂',
    sentenceEs: 'Añado sal',
    sentenceAr: 'باضيف ملح',
    sentenceWords: ['Añado', 'sal'],
    category: 'Ingrediente',
    categoryAr: 'مكونات',
    grammarHint: {
      pattern: 'Añado + مكون',
      rule: 'Añado = باضيف - من فعل añadir',
    },
    note: 'ñ بينطق "ني"',
    color: '#E5E7EB',
    gradient: ['#F3F4F6', '#9CA3AF'],
  },
  {
    id: 'azucar',
    word: 'el azúcar',
    wordAr: 'السكر',
    emoji: '🍬',
    sentenceEs: 'Añado azúcar',
    sentenceAr: 'باضيف سكر',
    sentenceWords: ['Añado', 'azúcar'],
    category: 'Ingrediente',
    categoryAr: 'مكونات',
    grammarHint: {
      pattern: 'Añado + مكون',
      rule: 'azúcar بفتحة على الـ ú',
    },
    note: 'azúcar بفتحة على الـ ú',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'arroz',
    word: 'el arroz',
    wordAr: 'الأرز',
    emoji: '🍚',
    sentenceEs: 'Cocino arroz',
    sentenceAr: 'باطبخ أرز',
    sentenceWords: ['Cocino', 'arroz'],
    category: 'Ingrediente',
    categoryAr: 'مكونات',
    grammarHint: {
      pattern: 'Cocino + طعام',
      rule: 'Cocino = باطبخ - من فعل cocinar',
    },
    color: '#FEF3C7',
    gradient: ['#FEF9C3', '#CA8A04'],
  },
  {
    id: 'huevo',
    word: 'el huevo',
    wordAr: 'البيضة',
    emoji: '🥚',
    sentenceEs: 'Como un huevo',
    sentenceAr: 'باكل بيضة',
    sentenceWords: ['Como', 'un', 'huevo'],
    category: 'Ingrediente',
    categoryAr: 'مكونات',
    grammarHint: {
      pattern: 'Como + un + مذكر',
      rule: 'Como = باكل - من فعل comer',
    },
    color: '#FBBF24',
    gradient: ['#FDE047', '#B45309'],
  },

  // ═══════════ Group 2: Cocinar (الطبخ) ═══════════
  {
    id: 'cocinar',
    word: 'cocinar',
    wordAr: 'يطبخ',
    emoji: '👨‍🍳',
    sentenceEs: 'Me gusta cocinar',
    sentenceAr: 'بحب أطبخ',
    sentenceWords: ['Me', 'gusta', 'cocinar'],
    category: 'Cocinar',
    categoryAr: 'أفعال الطبخ',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'cocinar = يطبخ (المصدر)',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'freir',
    word: 'freír',
    wordAr: 'يقلي',
    emoji: '🍳',
    sentenceEs: 'Voy a freír',
    sentenceAr: 'هقلي',
    sentenceWords: ['Voy', 'a', 'freír'],
    category: 'Cocinar',
    categoryAr: 'أفعال الطبخ',
    grammarHint: {
      pattern: 'Voy a + فعل',
      rule: 'Voy a = هعمل (المستقبل القريب)',
    },
    note: 'freír بفتحة على الـ í',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'mezclar',
    word: 'mezclar',
    wordAr: 'يخلط',
    emoji: '🥣',
    sentenceEs: 'Quiero mezclar',
    sentenceAr: 'عايز أخلط',
    sentenceWords: ['Quiero', 'mezclar'],
    category: 'Cocinar',
    categoryAr: 'أفعال الطبخ',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'Quiero = عايز - من فعل querer',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'cortar',
    word: 'cortar',
    wordAr: 'يقطع',
    emoji: '🔪',
    sentenceEs: 'Necesito cortar',
    sentenceAr: 'محتاج أقطع',
    sentenceWords: ['Necesito', 'cortar'],
    category: 'Cocinar',
    categoryAr: 'أفعال الطبخ',
    grammarHint: {
      pattern: 'Necesito + فعل',
      rule: 'Necesito = محتاج - من فعل necesitar',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'probar',
    word: 'probar',
    wordAr: 'يتذوق',
    emoji: '😋',
    sentenceEs: 'Quiero probar',
    sentenceAr: 'عايز أذوق',
    sentenceWords: ['Quiero', 'probar'],
    category: 'Cocinar',
    categoryAr: 'أفعال الطبخ',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'probar = يتذوق أو يجرب',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },

  // ═══════════ Group 3: En la Mesa (على السفرة) ═══════════
  {
    id: 'plato',
    word: 'el plato',
    wordAr: 'الطبق',
    emoji: '🍽️',
    sentenceEs: 'El plato está listo',
    sentenceAr: 'الطبق جاهز',
    sentenceWords: ['El', 'plato', 'está', 'listo'],
    category: 'Mesa',
    categoryAr: 'على السفرة',
    grammarHint: {
      pattern: 'El + اسم + está + صفة',
      rule: 'está = مؤقت (للحالة)',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'receta',
    word: 'la receta',
    wordAr: 'الوصفة',
    emoji: '📖',
    sentenceEs: 'Sigo la receta',
    sentenceAr: 'باتبع الوصفة',
    sentenceWords: ['Sigo', 'la', 'receta'],
    category: 'Mesa',
    categoryAr: 'على السفرة',
    grammarHint: {
      pattern: 'Sigo + la + مؤنث',
      rule: 'Sigo = باتبع - من فعل seguir',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'delicioso',
    word: 'delicioso',
    wordAr: 'لذيذ',
    emoji: '🤤',
    sentenceEs: 'Es delicioso',
    sentenceAr: 'ده لذيذ',
    sentenceWords: ['Es', 'delicioso'],
    category: 'Mesa',
    categoryAr: 'على السفرة',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: deliciosa',
    },
    note: 'للمؤنث: deliciosa',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'caliente',
    word: 'caliente',
    wordAr: 'سخن',
    emoji: '🔥',
    sentenceEs: 'Está caliente',
    sentenceAr: 'ده سخن',
    sentenceWords: ['Está', 'caliente'],
    category: 'Mesa',
    categoryAr: 'على السفرة',
    grammarHint: {
      pattern: 'Está + صفة',
      rule: 'caliente لا تتغير مع الجنس',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'frio',
    word: 'frío',
    wordAr: 'بارد',
    emoji: '🧊',
    sentenceEs: 'Está frío',
    sentenceAr: 'ده بارد',
    sentenceWords: ['Está', 'frío'],
    category: 'Mesa',
    categoryAr: 'على السفرة',
    grammarHint: {
      pattern: 'Está + صفة',
      rule: 'للمؤنث: fría',
    },
    note: 'frío بفتحة على الـ í / للمؤنث: fría',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishRecipesGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishRecipesItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_RECIPES_GROUPS: SpanishRecipesGroup[] = [
  {
    id: 'group-ingredientes',
    titleEs: 'Ingredientes',
    titleAr: 'المكونات',
    emoji: '🥘',
    items: SPANISH_RECIPES_ITEMS.filter(i => i.category === 'Ingrediente'),
    grammarFocus: {
      pattern: 'Uso / Añado / Cocino + مكون',
      description: 'أفعال استخدام المكونات في الطبخ',
    },
  },
  {
    id: 'group-cocinar',
    titleEs: 'Cocinar',
    titleAr: 'أفعال الطبخ',
    emoji: '👨‍🍳',
    items: SPANISH_RECIPES_ITEMS.filter(i => i.category === 'Cocinar'),
    grammarFocus: {
      pattern: 'Me gusta / Voy a / Quiero + فعل',
      description: 'أفعال الطبخ بصيغة المصدر',
    },
  },
  {
    id: 'group-mesa',
    titleEs: 'En la Mesa',
    titleAr: 'على السفرة',
    emoji: '🍽️',
    items: SPANISH_RECIPES_ITEMS.filter(i => i.category === 'Mesa'),
    grammarFocus: {
      pattern: 'El/La + اسم + está + صفة',
      description: 'وصف حالة الأكل: está للحالة المؤقتة',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishRecipesChoices(
  correctWord: string,
  count: number = 3
): SpanishRecipesItem[] {
  const correct = SPANISH_RECIPES_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_RECIPES_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateRecipesSentenceWordPool(
  item: SpanishRecipesItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_RECIPES_ITEMS.filter(i => i.id !== item.id);
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

export function checkRecipesSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
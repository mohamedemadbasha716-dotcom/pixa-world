// ═══════════════════════════════════════════════════════════
// 🏚️ Spanish House Lesson Data
// 🏛️ Casas Colgadas - Map 2, Lesson 4
// ═══════════════════════════════════════════════════════════

export interface SpanishHouseItem {
  // المعرّف
  id: string;
  
  // الكلمة الأساسية (مع أداة التعريف)
  word: string;          // مثل: "la casa"
  wordAr: string;        // مثل: "البيت"
  emoji: string;         // مثل: "🏠"
  
  // الجملة الكاملة
  sentenceEs: string;    // مثل: "Mi casa tiene una cocina"
  sentenceAr: string;    // مثل: "بيتي فيه مطبخ"
  sentenceWords: string[]; // ["Mi", "casa", "tiene", "una", "cocina"]
  
  // التصنيف
  category: 'Habitacion' | 'Mueble' | 'Parte';
  categoryAr: string;
  
  // الجنس النحوي
  gender: 'M' | 'F';
  article: 'el' | 'la';
  indefiniteArticle: 'un' | 'una';
  
  // الجرامر
  grammarHint: {
    pattern: string;     // مثل: "Mi casa tiene + un/una + غرفة"
    rule: string;        // شرح بسيط
  };
  
  // الألوان
  color: string;
  gradient: [string, string];
}

// ═══════════════════════════════════════════════════════════
// 📚 البيانات الكاملة - 15 صنف
// ═══════════════════════════════════════════════════════════

export const SPANISH_HOUSE_ITEMS: SpanishHouseItem[] = [
  // ═══════════ Group 1: Habitaciones (الغرف الرئيسية) ═══════════
  {
    id: 'casa',
    word: 'la casa',
    wordAr: 'البيت',
    emoji: '🏠',
    sentenceEs: 'Mi casa es grande',
    sentenceAr: 'بيتي كبير',
    sentenceWords: ['Mi', 'casa', 'es', 'grande'],
    category: 'Habitacion',
    categoryAr: 'البيت',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Mi casa es + صفة',
      rule: 'Mi casa = بيتي، es = هو/هي، grande = كبير',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'salon',
    word: 'el salón',
    wordAr: 'الصالة',
    emoji: '🛋️',
    sentenceEs: 'Mi casa tiene un salón',
    sentenceAr: 'بيتي فيه صالة',
    sentenceWords: ['Mi', 'casa', 'tiene', 'un', 'salón'],
    category: 'Habitacion',
    categoryAr: 'الغرف',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi casa tiene + un + مذكر',
      rule: 'tiene = عنده/فيه، un = واحد (للمذكر)',
    },
    color: '#92400E',
    gradient: ['#B45309', '#451A03'],
  },
  {
    id: 'dormitorio',
    word: 'el dormitorio',
    wordAr: 'غرفة النوم',
    emoji: '🛏️',
    sentenceEs: 'Mi dormitorio es bonito',
    sentenceAr: 'غرفة نومي حلوة',
    sentenceWords: ['Mi', 'dormitorio', 'es', 'bonito'],
    category: 'Habitacion',
    categoryAr: 'الغرف',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi + غرفة + es + صفة',
      rule: 'بدل ما نقول Mi casa، ممكن نقول Mi dormitorio مباشرة',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'cocina',
    word: 'la cocina',
    wordAr: 'المطبخ',
    emoji: '🍳',
    sentenceEs: 'Mi casa tiene una cocina',
    sentenceAr: 'بيتي فيه مطبخ',
    sentenceWords: ['Mi', 'casa', 'tiene', 'una', 'cocina'],
    category: 'Habitacion',
    categoryAr: 'الغرف',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Mi casa tiene + una + مؤنث',
      rule: 'una = واحدة (للمؤنث)',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'bano',
    word: 'el baño',
    wordAr: 'الحمام',
    emoji: '🚿',
    sentenceEs: 'Mi casa tiene un baño',
    sentenceAr: 'بيتي فيه حمام',
    sentenceWords: ['Mi', 'casa', 'tiene', 'un', 'baño'],
    category: 'Habitacion',
    categoryAr: 'الغرف',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi casa tiene + un + مذكر',
      rule: 'baño فيها حرف ñ خاص بالإسبانية',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },

  // ═══════════ Group 2: Muebles (الأثاث) ═══════════
  {
    id: 'silla',
    word: 'la silla',
    wordAr: 'الكرسي',
    emoji: '🪑',
    sentenceEs: 'Hay una silla',
    sentenceAr: 'في كرسي',
    sentenceWords: ['Hay', 'una', 'silla'],
    category: 'Mueble',
    categoryAr: 'الأثاث',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'Hay = يوجد / فيه (موجود)',
    },
    color: '#854D0E',
    gradient: ['#A16207', '#422006'],
  },
  {
    id: 'cama',
    word: 'la cama',
    wordAr: 'السرير',
    emoji: '🛌',
    sentenceEs: 'Hay una cama',
    sentenceAr: 'في سرير',
    sentenceWords: ['Hay', 'una', 'cama'],
    category: 'Mueble',
    categoryAr: 'الأثاث',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'مع المؤنث: Hay una cama',
    },
    color: '#9333EA',
    gradient: ['#A855F7', '#6B21A8'],
  },
  {
    id: 'television',
    word: 'la televisión',
    wordAr: 'التليفزيون',
    emoji: '📺',
    sentenceEs: 'Hay una televisión',
    sentenceAr: 'في تليفزيون',
    sentenceWords: ['Hay', 'una', 'televisión'],
    category: 'Mueble',
    categoryAr: 'الأثاث',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'televisión مؤنثة في الإسبانية',
    },
    color: '#1E40AF',
    gradient: ['#3B82F6', '#1E3A8A'],
  },
  {
    id: 'puerta',
    word: 'la puerta',
    wordAr: 'الباب',
    emoji: '🚪',
    sentenceEs: 'Hay una puerta',
    sentenceAr: 'في باب',
    sentenceWords: ['Hay', 'una', 'puerta'],
    category: 'Mueble',
    categoryAr: 'الأثاث',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'puerta مؤنثة → una puerta',
    },
    color: '#78350F',
    gradient: ['#92400E', '#451A03'],
  },
  {
    id: 'ventana',
    word: 'la ventana',
    wordAr: 'الشباك',
    emoji: '🪟',
    sentenceEs: 'Hay una ventana',
    sentenceAr: 'في شباك',
    sentenceWords: ['Hay', 'una', 'ventana'],
    category: 'Mueble',
    categoryAr: 'الأثاث',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'الشباك مؤنث في الإسبانية',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },

  // ═══════════ Group 3: Otras Partes (أجزاء أخرى) ═══════════
  {
    id: 'jardin',
    word: 'el jardín',
    wordAr: 'الحديقة',
    emoji: '🌳',
    sentenceEs: 'Mi casa tiene un jardín',
    sentenceAr: 'بيتي عنده حديقة',
    sentenceWords: ['Mi', 'casa', 'tiene', 'un', 'jardín'],
    category: 'Parte',
    categoryAr: 'أجزاء أخرى',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi casa tiene + un + مذكر',
      rule: 'jardín مذكر، فنستخدم un',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'garaje',
    word: 'el garaje',
    wordAr: 'الجراج',
    emoji: '🚗',
    sentenceEs: 'Mi casa tiene un garaje',
    sentenceAr: 'بيتي فيه جراج',
    sentenceWords: ['Mi', 'casa', 'tiene', 'un', 'garaje'],
    category: 'Parte',
    categoryAr: 'أجزاء أخرى',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi casa tiene + un + مذكر',
      rule: 'garaje مذكر → un garaje',
    },
    color: '#6B7280',
    gradient: ['#9CA3AF', '#374151'],
  },
  {
    id: 'escalera',
    word: 'la escalera',
    wordAr: 'السلم',
    emoji: '🪜',
    sentenceEs: 'Hay una escalera',
    sentenceAr: 'في سلم',
    sentenceWords: ['Hay', 'una', 'escalera'],
    category: 'Parte',
    categoryAr: 'أجزاء أخرى',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'escalera مؤنثة',
    },
    color: '#D97706',
    gradient: ['#F59E0B', '#92400E'],
  },
  {
    id: 'balcon',
    word: 'el balcón',
    wordAr: 'البلكونة',
    emoji: '🏛️',
    sentenceEs: 'Mi casa tiene un balcón',
    sentenceAr: 'بيتي فيه بلكونة',
    sentenceWords: ['Mi', 'casa', 'tiene', 'un', 'balcón'],
    category: 'Parte',
    categoryAr: 'أجزاء أخرى',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi casa tiene + un + مذكر',
      rule: 'balcón مذكر برغم انه ينتهي بـ ón',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'banera',
    word: 'la bañera',
    wordAr: 'البانيو',
    emoji: '🛁',
    sentenceEs: 'Hay una bañera',
    sentenceAr: 'في بانيو',
    sentenceWords: ['Hay', 'una', 'bañera'],
    category: 'Parte',
    categoryAr: 'أجزاء أخرى',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Hay + una + مؤنث',
      rule: 'bañera فيها حرف ñ',
    },
    color: '#0891B2',
    gradient: ['#06B6D4', '#0E7490'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5 أصناف)
// ═══════════════════════════════════════════════════════════

export interface SpanishHouseGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishHouseItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_HOUSE_GROUPS: SpanishHouseGroup[] = [
  {
    id: 'group-habitaciones',
    titleEs: 'Habitaciones',
    titleAr: 'الغرف الرئيسية',
    emoji: '🏠',
    items: SPANISH_HOUSE_ITEMS.filter(h => h.category === 'Habitacion'),
    grammarFocus: {
      pattern: 'Mi casa tiene + un/una + غرفة',
      description: 'tiene = عنده/فيه، un للمذكر، una للمؤنث',
    },
  },
  {
    id: 'group-muebles',
    titleEs: 'Muebles',
    titleAr: 'الأثاث',
    emoji: '🪑',
    items: SPANISH_HOUSE_ITEMS.filter(h => h.category === 'Mueble'),
    grammarFocus: {
      pattern: 'Hay + un/una + شيء',
      description: 'Hay معناها "يوجد / فيه" - بنستخدمها لما نقول إن شيء موجود',
    },
  },
  {
    id: 'group-partes',
    titleEs: 'Otras Partes',
    titleAr: 'أجزاء أخرى',
    emoji: '🌳',
    items: SPANISH_HOUSE_ITEMS.filter(h => h.category === 'Parte'),
    grammarFocus: {
      pattern: 'Mi casa tiene / Hay + un/una',
      description: 'نستخدم أي تركيبة حسب السياق',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 توليد اختيارات عشوائية للـ Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishHouseChoices(
  correctWord: string,
  count: number = 3
): SpanishHouseItem[] {
  const correct = SPANISH_HOUSE_ITEMS.find(h => h.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_HOUSE_ITEMS.filter(h => h.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];
  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد مجموعة كلمات للـ Build Phase
// ═══════════════════════════════════════════════════════════

export function generateHouseSentenceWordPool(
  item: SpanishHouseItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];
  
  // نجيب كلمات من جمل تانية
  const otherItems = SPANISH_HOUSE_ITEMS.filter(h => h.id !== item.id);
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

export function checkHouseSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;
  
  return selectedWords.every((word, idx) => 
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
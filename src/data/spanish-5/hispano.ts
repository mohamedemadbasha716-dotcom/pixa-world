// ═══════════════════════════════════════════════════════════
// 🌍 Spanish Mundo Hispano Lesson Data
// 🏛️ Casa de América - Map 5, Lesson 6
// ═══════════════════════════════════════════════════════════

export interface SpanishHispanoItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Paises' | 'Cultura' | 'Diversidad';
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

export const SPANISH_HISPANO_ITEMS: SpanishHispanoItem[] = [
  // ═══════════ Group 1: Países Hispanos (الدول الناطقة بالأسبانية) ═══════════
  {
    id: 'mexico',
    word: 'México',
    wordAr: 'المكسيك',
    emoji: '🇲🇽',
    sentenceEs: 'Vivo en México',
    sentenceAr: 'عايش في المكسيك',
    sentenceWords: ['Vivo', 'en', 'México'],
    category: 'Paises',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Vivo en + بلد',
      rule: 'Vivo = عايش - من فعل vivir',
    },
    note: 'México بفتحة على الـ é',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'argentina',
    word: 'Argentina',
    wordAr: 'الأرجنتين',
    emoji: '🇦🇷',
    sentenceEs: 'Argentina es grande',
    sentenceAr: 'الأرجنتين كبيرة',
    sentenceWords: ['Argentina', 'es', 'grande'],
    category: 'Paises',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'بلد + es + صفة',
      rule: 'grande لا تتغير مع الجنس',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'colombia',
    word: 'Colombia',
    wordAr: 'كولومبيا',
    emoji: '🇨🇴',
    sentenceEs: 'Colombia es hermosa',
    sentenceAr: 'كولومبيا جميلة',
    sentenceWords: ['Colombia', 'es', 'hermosa'],
    category: 'Paises',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'بلد + es + صفة مؤنثة',
      rule: 'hermosa = جميلة (مؤنث)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'peru',
    word: 'Perú',
    wordAr: 'بيرو',
    emoji: '🇵🇪',
    sentenceEs: 'Voy a Perú',
    sentenceAr: 'رايح بيرو',
    sentenceWords: ['Voy', 'a', 'Perú'],
    category: 'Paises',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Voy a + بلد',
      rule: 'Perú بفتحة على الـ ú',
    },
    note: 'Perú بفتحة على الـ ú',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'cuba',
    word: 'Cuba',
    wordAr: 'كوبا',
    emoji: '🇨🇺',
    sentenceEs: 'Cuba es una isla',
    sentenceAr: 'كوبا جزيرة',
    sentenceWords: ['Cuba', 'es', 'una', 'isla'],
    category: 'Paises',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'بلد + es + una + مؤنث',
      rule: 'isla مؤنثة → una isla',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════ Group 2: Cultura Hispana (الثقافة الأسبانية) ═══════════
  {
    id: 'tradicion',
    word: 'la tradición',
    wordAr: 'التقليد',
    emoji: '🎊',
    sentenceEs: 'Amo la tradición',
    sentenceAr: 'بحب التقاليد',
    sentenceWords: ['Amo', 'la', 'tradición'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'Amo + la + مؤنث',
      rule: 'Amo = بحب (بشدة) - من فعل amar',
    },
    note: 'tradición بفتحة على الـ ó',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'idioma-hispano',
    word: 'el idioma',
    wordAr: 'اللغة',
    emoji: '💬',
    sentenceEs: 'El idioma es español',
    sentenceAr: 'اللغة أسبانية',
    sentenceWords: ['El', 'idioma', 'es', 'español'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'El + اسم + es + صفة',
      rule: 'idioma مذكر رغم انتهائه بـ a',
    },
    note: 'idioma مذكر: el idioma',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'comida-hispana',
    word: 'la comida',
    wordAr: 'الأكل',
    emoji: '🌮',
    sentenceEs: 'La comida es rica',
    sentenceAr: 'الأكل لذيذ',
    sentenceWords: ['La', 'comida', 'es', 'rica'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'La + اسم + es + صفة',
      rule: 'rica = لذيذة (مؤنث) / للمذكر: rico',
    },
    note: 'للمذكر: rico',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'danza',
    word: 'la danza',
    wordAr: 'الرقصة',
    emoji: '💃',
    sentenceEs: 'La danza es alegre',
    sentenceAr: 'الرقصة مبهجة',
    sentenceWords: ['La', 'danza', 'es', 'alegre'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'La + اسم + es + صفة',
      rule: 'alegre = مبهج (لا تتغير مع الجنس)',
    },
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
  {
    id: 'historia-hispana',
    word: 'la historia',
    wordAr: 'التاريخ',
    emoji: '📜',
    sentenceEs: 'Estudio historia',
    sentenceAr: 'بادرس التاريخ',
    sentenceWords: ['Estudio', 'historia'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'Estudio + اسم',
      rule: 'Estudio = بادرس - من فعل estudiar',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },

  // ═══════════ Group 3: Diversidad (التنوع) ═══════════
  {
    id: 'mundo-hispano',
    word: 'el mundo',
    wordAr: 'العالم',
    emoji: '🌐',
    sentenceEs: 'El mundo es diverso',
    sentenceAr: 'العالم متنوع',
    sentenceWords: ['El', 'mundo', 'es', 'diverso'],
    category: 'Diversidad',
    categoryAr: 'تنوع',
    grammarHint: {
      pattern: 'El + اسم + es + صفة',
      rule: 'diverso = متنوع (مذكر)',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'hablar-hispano',
    word: 'hablar',
    wordAr: 'يتكلم',
    emoji: '🗣️',
    sentenceEs: 'Todos hablan español',
    sentenceAr: 'الكل بيتكلم أسباني',
    sentenceWords: ['Todos', 'hablan', 'español'],
    category: 'Diversidad',
    categoryAr: 'تنوع',
    grammarHint: {
      pattern: 'Todos + فعل جمع',
      rule: 'Todos = الكل / hablan = بيتكلموا (جمع)',
    },
    note: 'مع الجمع: hablan (مش habla)',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'conocer',
    word: 'conocer',
    wordAr: 'يتعرف على',
    emoji: '👋',
    sentenceEs: 'Quiero conocer gente',
    sentenceAr: 'عايز أتعرف على ناس',
    sentenceWords: ['Quiero', 'conocer', 'gente'],
    category: 'Diversidad',
    categoryAr: 'تنوع',
    grammarHint: {
      pattern: 'Quiero + فعل + اسم',
      rule: 'gente = ناس (مؤنث جمعي)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'viajar-hispano',
    word: 'viajar',
    wordAr: 'يسافر',
    emoji: '✈️',
    sentenceEs: 'Me gusta viajar',
    sentenceAr: 'بحب أسافر',
    sentenceWords: ['Me', 'gusta', 'viajar'],
    category: 'Diversidad',
    categoryAr: 'تنوع',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'viajar = يسافر (المصدر)',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'hermoso',
    word: 'hermoso',
    wordAr: 'جميل',
    emoji: '🌸',
    sentenceEs: '¡Es hermoso!',
    sentenceAr: 'ده جميل!',
    sentenceWords: ['Es', 'hermoso'],
    category: 'Diversidad',
    categoryAr: 'تنوع',
    grammarHint: {
      pattern: '¡Es + صفة!',
      rule: 'للمؤنث: hermosa',
    },
    note: 'للمؤنث: hermosa',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishHispanoGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishHispanoItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_HISPANO_GROUPS: SpanishHispanoGroup[] = [
  {
    id: 'group-paises',
    titleEs: 'Países Hispanos',
    titleAr: 'الدول الأسبانية',
    emoji: '🌎',
    items: SPANISH_HISPANO_ITEMS.filter(i => i.category === 'Paises'),
    grammarFocus: {
      pattern: 'Vivo en / Voy a / [بلد] es + صفة',
      description: 'وصف الدول الناطقة بالأسبانية',
    },
  },
  {
    id: 'group-cultura',
    titleEs: 'Cultura Hispana',
    titleAr: 'الثقافة الأسبانية',
    emoji: '🎭',
    items: SPANISH_HISPANO_ITEMS.filter(i => i.category === 'Cultura'),
    grammarFocus: {
      pattern: 'La + اسم + es + صفة / Amo / Estudio',
      description: 'الثقافة والتقاليد الأسبانية',
    },
  },
  {
    id: 'group-diversidad',
    titleEs: 'Diversidad',
    titleAr: 'التنوع',
    emoji: '🌐',
    items: SPANISH_HISPANO_ITEMS.filter(i => i.category === 'Diversidad'),
    grammarFocus: {
      pattern: 'Todos + فعل / Quiero + فعل / ¡Es + صفة!',
      description: 'التعبير عن التنوع والسفر',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishHispanoChoices(
  correctWord: string,
  count: number = 3
): SpanishHispanoItem[] {
  const correct = SPANISH_HISPANO_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_HISPANO_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateHispanoSentenceWordPool(
  item: SpanishHispanoItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_HISPANO_ITEMS.filter(i => i.id !== item.id);
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

export function checkHispanoSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
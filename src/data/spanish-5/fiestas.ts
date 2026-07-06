// ═══════════════════════════════════════════════════════════
// 🕛 Spanish Fiestas Lesson Data
// 🏛️ Puerta del Sol - Map 5, Lesson 1
// ═══════════════════════════════════════════════════════════

export interface SpanishFiestasItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Fiesta' | 'Celebracion' | 'Ambiente';
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

export const SPANISH_FIESTAS_ITEMS: SpanishFiestasItem[] = [
  // ═══════════ Group 1: Fiestas Populares (الأعياد الشعبية) ═══════════
  {
    id: 'navidad',
    word: 'la Navidad',
    wordAr: 'الكريسماس',
    emoji: '🎄',
    sentenceEs: 'Feliz Navidad',
    sentenceAr: 'كريسماس سعيد',
    sentenceWords: ['Feliz', 'Navidad'],
    category: 'Fiesta',
    categoryAr: 'أعياد',
    grammarHint: {
      pattern: 'Feliz + عيد',
      rule: 'Feliz = سعيد - تحية العيد',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'ano-nuevo',
    word: 'el Año Nuevo',
    wordAr: 'السنة الجديدة',
    emoji: '🎊',
    sentenceEs: '¡Feliz Año Nuevo!',
    sentenceAr: 'سنة جديدة سعيدة!',
    sentenceWords: ['Feliz', 'Año', 'Nuevo'],
    category: 'Fiesta',
    categoryAr: 'أعياد',
    grammarHint: {
      pattern: '¡Feliz + عيد!',
      rule: 'Año بحرف ñ (ينطق "ني")',
    },
    note: 'Año بحرف ñ',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'cumpleanos',
    word: 'el cumpleaños',
    wordAr: 'عيد الميلاد',
    emoji: '🎂',
    sentenceEs: 'Mi cumpleaños es hoy',
    sentenceAr: 'عيد ميلادي النهاردة',
    sentenceWords: ['Mi', 'cumpleaños', 'es', 'hoy'],
    category: 'Fiesta',
    categoryAr: 'أعياد',
    grammarHint: {
      pattern: 'Mi + اسم + es + وقت',
      rule: 'cumpleaños = birthday (بحرف ñ)',
    },
    note: 'cumpleaños بحرف ñ',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'fiesta',
    word: 'la fiesta',
    wordAr: 'الحفلة',
    emoji: '🎉',
    sentenceEs: 'Voy a la fiesta',
    sentenceAr: 'رايح الحفلة',
    sentenceWords: ['Voy', 'a', 'la', 'fiesta'],
    category: 'Fiesta',
    categoryAr: 'أعياد',
    grammarHint: {
      pattern: 'Voy a + la + مؤنث',
      rule: 'Voy = رايح - من فعل ir',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'regalo',
    word: 'el regalo',
    wordAr: 'الهدية',
    emoji: '🎁',
    sentenceEs: 'Tengo un regalo',
    sentenceAr: 'عندي هدية',
    sentenceWords: ['Tengo', 'un', 'regalo'],
    category: 'Fiesta',
    categoryAr: 'أعياد',
    grammarHint: {
      pattern: 'Tengo + un + مذكر',
      rule: 'regalo = هدية (مذكر)',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },

  // ═══════════ Group 2: Celebraciones (الاحتفالات) ═══════════
  {
    id: 'celebrar',
    word: 'celebrar',
    wordAr: 'يحتفل',
    emoji: '🥳',
    sentenceEs: 'Vamos a celebrar',
    sentenceAr: 'يلا نحتفل',
    sentenceWords: ['Vamos', 'a', 'celebrar'],
    category: 'Celebracion',
    categoryAr: 'احتفالات',
    grammarHint: {
      pattern: 'Vamos a + فعل',
      rule: 'Vamos a = يلا نعمل (المستقبل الجماعي)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'cantar',
    word: 'cantar',
    wordAr: 'يغني',
    emoji: '🎤',
    sentenceEs: 'Me gusta cantar',
    sentenceAr: 'بحب أغني',
    sentenceWords: ['Me', 'gusta', 'cantar'],
    category: 'Celebracion',
    categoryAr: 'احتفالات',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'cantar = يغني (المصدر)',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'bailar',
    word: 'bailar',
    wordAr: 'يرقص',
    emoji: '💃',
    sentenceEs: 'Quiero bailar',
    sentenceAr: 'عايز أرقص',
    sentenceWords: ['Quiero', 'bailar'],
    category: 'Celebracion',
    categoryAr: 'احتفالات',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'Quiero = عايز - من فعل querer',
    },
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
  {
    id: 'invitar',
    word: 'invitar',
    wordAr: 'يدعو',
    emoji: '💌',
    sentenceEs: 'Voy a invitar amigos',
    sentenceAr: 'هدعو أصحابي',
    sentenceWords: ['Voy', 'a', 'invitar', 'amigos'],
    category: 'Celebracion',
    categoryAr: 'احتفالات',
    grammarHint: {
      pattern: 'Voy a + فعل + اسم',
      rule: 'Voy a invitar = هدعو',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'felicitar',
    word: 'felicitar',
    wordAr: 'يهنئ',
    emoji: '🤗',
    sentenceEs: 'Te felicito',
    sentenceAr: 'باهنيك',
    sentenceWords: ['Te', 'felicito'],
    category: 'Celebracion',
    categoryAr: 'احتفالات',
    grammarHint: {
      pattern: 'Te + فعل',
      rule: 'Te felicito = باهنيك (تهنئة شخصية)',
    },
    note: 'Te = ك (ضمير المخاطب)',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },

  // ═══════════ Group 3: Ambiente Festivo (الجو الاحتفالي) ═══════════
  {
    id: 'musica-fiesta',
    word: 'la música',
    wordAr: 'الموسيقى',
    emoji: '🎵',
    sentenceEs: 'Escucho música',
    sentenceAr: 'باسمع موسيقى',
    sentenceWords: ['Escucho', 'música'],
    category: 'Ambiente',
    categoryAr: 'جو احتفالي',
    grammarHint: {
      pattern: 'Escucho + اسم',
      rule: 'música بفتحة على الـ ú',
    },
    note: 'música بفتحة على الـ ú',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'fuegos',
    word: 'los fuegos',
    wordAr: 'الألعاب النارية',
    emoji: '🎆',
    sentenceEs: 'Veo los fuegos',
    sentenceAr: 'باشوف الألعاب النارية',
    sentenceWords: ['Veo', 'los', 'fuegos'],
    category: 'Ambiente',
    categoryAr: 'جو احتفالي',
    grammarHint: {
      pattern: 'Veo + los + جمع',
      rule: 'fuegos = fireworks (جمع)',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'uvas',
    word: 'las uvas',
    wordAr: 'العنب',
    emoji: '🍇',
    sentenceEs: 'Como uvas',
    sentenceAr: 'باكل عنب',
    sentenceWords: ['Como', 'uvas'],
    category: 'Ambiente',
    categoryAr: 'جو احتفالي',
    grammarHint: {
      pattern: 'Como + اسم',
      rule: 'الأسبان بياكلوا 12 عنبة في رأس السنة!',
    },
    note: 'تقليد أسباني: 12 عنبة في رأس السنة',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'brindar',
    word: 'brindar',
    wordAr: 'يشرب نخب',
    emoji: '🥂',
    sentenceEs: 'Vamos a brindar',
    sentenceAr: 'يلا نشرب نخب',
    sentenceWords: ['Vamos', 'a', 'brindar'],
    category: 'Ambiente',
    categoryAr: 'جو احتفالي',
    grammarHint: {
      pattern: 'Vamos a + فعل',
      rule: 'brindar = يشرب نخب في احتفال',
    },
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'feliz-fiesta',
    word: 'feliz',
    wordAr: 'سعيد',
    emoji: '😊',
    sentenceEs: 'Estoy muy feliz',
    sentenceAr: 'أنا سعيد أوي',
    sentenceWords: ['Estoy', 'muy', 'feliz'],
    category: 'Ambiente',
    categoryAr: 'جو احتفالي',
    grammarHint: {
      pattern: 'Estoy + muy + صفة',
      rule: 'muy = أوي (تكثير)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishFiestasGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishFiestasItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_FIESTAS_GROUPS: SpanishFiestasGroup[] = [
  {
    id: 'group-fiestas',
    titleEs: 'Fiestas Populares',
    titleAr: 'الأعياد الشعبية',
    emoji: '🎉',
    items: SPANISH_FIESTAS_ITEMS.filter(i => i.category === 'Fiesta'),
    grammarFocus: {
      pattern: 'Feliz + عيد / Voy a + مكان',
      description: 'تحية الأعياد والذهاب للحفلات',
    },
  },
  {
    id: 'group-celebracion',
    titleEs: 'Celebraciones',
    titleAr: 'الاحتفالات',
    emoji: '🥳',
    items: SPANISH_FIESTAS_ITEMS.filter(i => i.category === 'Celebracion'),
    grammarFocus: {
      pattern: 'Vamos a / Voy a / Quiero + فعل',
      description: 'أفعال الاحتفال في المستقبل القريب',
    },
  },
  {
    id: 'group-ambiente',
    titleEs: 'Ambiente Festivo',
    titleAr: 'الجو الاحتفالي',
    emoji: '🎊',
    items: SPANISH_FIESTAS_ITEMS.filter(i => i.category === 'Ambiente'),
    grammarFocus: {
      pattern: 'Escucho / Veo / Como + اسم',
      description: 'وصف جو الاحتفال والتقاليد الأسبانية',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishFiestasChoices(
  correctWord: string,
  count: number = 3
): SpanishFiestasItem[] {
  const correct = SPANISH_FIESTAS_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_FIESTAS_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateFiestasSentenceWordPool(
  item: SpanishFiestasItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_FIESTAS_ITEMS.filter(i => i.id !== item.id);
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

export function checkFiestasSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
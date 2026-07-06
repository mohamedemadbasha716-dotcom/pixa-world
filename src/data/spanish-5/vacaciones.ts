// ═══════════════════════════════════════════════════════════
// 🏖️ Spanish Vacaciones Lesson Data
// 🏛️ Playa de Palma - Map 5, Lesson 2
// ═══════════════════════════════════════════════════════════

export interface SpanishVacacionesItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Playa' | 'Viajar' | 'Diversion';
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

export const SPANISH_VACACIONES_ITEMS: SpanishVacacionesItem[] = [
  // ═══════════ Group 1: En la Playa (على الشاطئ) ═══════════
  {
    id: 'playa',
    word: 'la playa',
    wordAr: 'الشاطئ',
    emoji: '🏖️',
    sentenceEs: 'Voy a la playa',
    sentenceAr: 'رايح الشاطئ',
    sentenceWords: ['Voy', 'a', 'la', 'playa'],
    category: 'Playa',
    categoryAr: 'شاطئ',
    grammarHint: {
      pattern: 'Voy a + la + مؤنث',
      rule: 'Voy = رايح - من فعل ir',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'sol',
    word: 'el sol',
    wordAr: 'الشمس',
    emoji: '☀️',
    sentenceEs: 'Hace sol',
    sentenceAr: 'الشمس طالعة',
    sentenceWords: ['Hace', 'sol'],
    category: 'Playa',
    categoryAr: 'شاطئ',
    grammarHint: {
      pattern: 'Hace + طقس',
      rule: 'Hace = بيعمل - نستخدمها مع الطقس',
    },
    note: 'مع الطقس نستخدم Hace',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'mar',
    word: 'el mar',
    wordAr: 'البحر',
    emoji: '🌊',
    sentenceEs: 'Me gusta el mar',
    sentenceAr: 'بحب البحر',
    sentenceWords: ['Me', 'gusta', 'el', 'mar'],
    category: 'Playa',
    categoryAr: 'شاطئ',
    grammarHint: {
      pattern: 'Me gusta + el + مذكر',
      rule: 'mar مذكر → el mar',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'arena',
    word: 'la arena',
    wordAr: 'الرمل',
    emoji: '🏝️',
    sentenceEs: 'Juego en la arena',
    sentenceAr: 'بالعب في الرمل',
    sentenceWords: ['Juego', 'en', 'la', 'arena'],
    category: 'Playa',
    categoryAr: 'شاطئ',
    grammarHint: {
      pattern: 'Juego en + la + مكان',
      rule: 'en = في (للمكان)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'nadar',
    word: 'nadar',
    wordAr: 'يسبح',
    emoji: '🏊',
    sentenceEs: 'Quiero nadar',
    sentenceAr: 'عايز أسبح',
    sentenceWords: ['Quiero', 'nadar'],
    category: 'Playa',
    categoryAr: 'شاطئ',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'nadar = يسبح (المصدر)',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════ Group 2: Viajar (السفر) ═══════════
  {
    id: 'viaje',
    word: 'el viaje',
    wordAr: 'الرحلة',
    emoji: '✈️',
    sentenceEs: 'Un viaje largo',
    sentenceAr: 'رحلة طويلة',
    sentenceWords: ['Un', 'viaje', 'largo'],
    category: 'Viajar',
    categoryAr: 'سفر',
    grammarHint: {
      pattern: 'Un + مذكر + صفة',
      rule: 'largo = طويل (مذكر)',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'maleta',
    word: 'la maleta',
    wordAr: 'الشنطة',
    emoji: '🧳',
    sentenceEs: 'Hago la maleta',
    sentenceAr: 'باعمل الشنطة',
    sentenceWords: ['Hago', 'la', 'maleta'],
    category: 'Viajar',
    categoryAr: 'سفر',
    grammarHint: {
      pattern: 'Hago + la + مؤنث',
      rule: 'Hago la maleta = باحضر الشنطة (تعبير ثابت)',
    },
    note: 'تعبير ثابت للسفر',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'pasaporte',
    word: 'el pasaporte',
    wordAr: 'جواز السفر',
    emoji: '📘',
    sentenceEs: 'Tengo mi pasaporte',
    sentenceAr: 'معايا جواز السفر',
    sentenceWords: ['Tengo', 'mi', 'pasaporte'],
    category: 'Viajar',
    categoryAr: 'سفر',
    grammarHint: {
      pattern: 'Tengo + mi + اسم',
      rule: 'mi = بتاعي/ي (ملكية)',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'hotel',
    word: 'el hotel',
    wordAr: 'الفندق',
    emoji: '🏨',
    sentenceEs: 'Reservo un hotel',
    sentenceAr: 'باحجز فندق',
    sentenceWords: ['Reservo', 'un', 'hotel'],
    category: 'Viajar',
    categoryAr: 'سفر',
    grammarHint: {
      pattern: 'Reservo + un + مذكر',
      rule: 'Reservo = باحجز - من فعل reservar',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'visitar',
    word: 'visitar',
    wordAr: 'يزور',
    emoji: '🚶',
    sentenceEs: 'Voy a visitar España',
    sentenceAr: 'هزور إسبانيا',
    sentenceWords: ['Voy', 'a', 'visitar', 'España'],
    category: 'Viajar',
    categoryAr: 'سفر',
    grammarHint: {
      pattern: 'Voy a + فعل + مكان',
      rule: 'Voy a = هعمل (المستقبل القريب)',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },

  // ═══════════ Group 3: Diversión (المتعة) ═══════════
  {
    id: 'descansar',
    word: 'descansar',
    wordAr: 'يرتاح',
    emoji: '😌',
    sentenceEs: 'Necesito descansar',
    sentenceAr: 'محتاج أرتاح',
    sentenceWords: ['Necesito', 'descansar'],
    category: 'Diversion',
    categoryAr: 'متعة',
    grammarHint: {
      pattern: 'Necesito + فعل',
      rule: 'descansar = يرتاح',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'tomar-fotos',
    word: 'tomar fotos',
    wordAr: 'يصور',
    emoji: '📸',
    sentenceEs: 'Me gusta tomar fotos',
    sentenceAr: 'بحب أصور',
    sentenceWords: ['Me', 'gusta', 'tomar', 'fotos'],
    category: 'Diversion',
    categoryAr: 'متعة',
    grammarHint: {
      pattern: 'Me gusta + فعل + اسم',
      rule: 'tomar fotos = ياخد صور (تعبير)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'recuerdo',
    word: 'el recuerdo',
    wordAr: 'التذكار',
    emoji: '🎁',
    sentenceEs: 'Compro un recuerdo',
    sentenceAr: 'باشتري تذكار',
    sentenceWords: ['Compro', 'un', 'recuerdo'],
    category: 'Diversion',
    categoryAr: 'متعة',
    grammarHint: {
      pattern: 'Compro + un + مذكر',
      rule: 'recuerdo = ذكرى / هدية تذكارية',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'isla',
    word: 'la isla',
    wordAr: 'الجزيرة',
    emoji: '🏝️',
    sentenceEs: 'Visito una isla',
    sentenceAr: 'بازور جزيرة',
    sentenceWords: ['Visito', 'una', 'isla'],
    category: 'Diversion',
    categoryAr: 'متعة',
    grammarHint: {
      pattern: 'Visito + una + مؤنث',
      rule: 'Visito = بازور',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'genial',
    word: 'genial',
    wordAr: 'رائع',
    emoji: '🤩',
    sentenceEs: '¡Es genial!',
    sentenceAr: 'ده رائع!',
    sentenceWords: ['Es', 'genial'],
    category: 'Diversion',
    categoryAr: 'متعة',
    grammarHint: {
      pattern: '¡Es + صفة!',
      rule: 'genial لا تتغير مع الجنس',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishVacacionesGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishVacacionesItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_VACACIONES_GROUPS: SpanishVacacionesGroup[] = [
  {
    id: 'group-playa',
    titleEs: 'En la Playa',
    titleAr: 'على الشاطئ',
    emoji: '🏖️',
    items: SPANISH_VACACIONES_ITEMS.filter(i => i.category === 'Playa'),
    grammarFocus: {
      pattern: 'Voy a / Hace / Juego en + مكان',
      description: 'أفعال الشاطئ + وصف الطقس بـ Hace',
    },
  },
  {
    id: 'group-viajar',
    titleEs: 'Viajar',
    titleAr: 'السفر',
    emoji: '✈️',
    items: SPANISH_VACACIONES_ITEMS.filter(i => i.category === 'Viajar'),
    grammarFocus: {
      pattern: 'Hago / Tengo / Reservo / Voy a',
      description: 'أفعال التحضير للسفر',
    },
  },
  {
    id: 'group-diversion',
    titleEs: 'Diversión',
    titleAr: 'المتعة',
    emoji: '🌴',
    items: SPANISH_VACACIONES_ITEMS.filter(i => i.category === 'Diversion'),
    grammarFocus: {
      pattern: 'Necesito / Me gusta / Compro + فعل/اسم',
      description: 'التعبير عن الاحتياجات والاستمتاع',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishVacacionesChoices(
  correctWord: string,
  count: number = 3
): SpanishVacacionesItem[] {
  const correct = SPANISH_VACACIONES_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_VACACIONES_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateVacacionesSentenceWordPool(
  item: SpanishVacacionesItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_VACACIONES_ITEMS.filter(i => i.id !== item.id);
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

export function checkVacacionesSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
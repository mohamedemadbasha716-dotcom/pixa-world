// ═══════════════════════════════════════════════════════════
// 🚇 Spanish Transport Lesson Data
// 🚉 Metro de Valencia - Map 3, Lesson 5
// ═══════════════════════════════════════════════════════════

export interface SpanishTransportItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Vehiculo' | 'Calle' | 'Viajar';
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

export const SPANISH_TRANSPORT_ITEMS: SpanishTransportItem[] = [
  // ═══════════ Group 1: Vehículos (المواصلات) ═══════════
  {
    id: 'coche',
    word: 'el coche',
    wordAr: 'العربية',
    emoji: '🚗',
    sentenceEs: 'Voy en coche',
    sentenceAr: 'رايح بالعربية',
    sentenceWords: ['Voy', 'en', 'coche'],
    category: 'Vehiculo',
    categoryAr: 'مواصلات',
    grammarHint: {
      pattern: 'Voy en + مواصلة',
      rule: 'مع المواصلات: en (بدون el/la)',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'autobus',
    word: 'el autobús',
    wordAr: 'الأتوبيس',
    emoji: '🚌',
    sentenceEs: 'Voy en autobús',
    sentenceAr: 'رايح بالأتوبيس',
    sentenceWords: ['Voy', 'en', 'autobús'],
    category: 'Vehiculo',
    categoryAr: 'مواصلات',
    grammarHint: {
      pattern: 'Voy en + مواصلة',
      rule: 'autobús بفتحة على الـ ú',
    },
    note: 'autobús بفتحة على الـ ú',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'tren',
    word: 'el tren',
    wordAr: 'القطر',
    emoji: '🚂',
    sentenceEs: 'Voy en tren',
    sentenceAr: 'رايح بالقطر',
    sentenceWords: ['Voy', 'en', 'tren'],
    category: 'Vehiculo',
    categoryAr: 'مواصلات',
    grammarHint: {
      pattern: 'Voy en + مواصلة',
      rule: 'tren = train بس بنطق مختلف',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'metro',
    word: 'el metro',
    wordAr: 'المترو',
    emoji: '🚇',
    sentenceEs: 'Voy en metro',
    sentenceAr: 'رايح بالمترو',
    sentenceWords: ['Voy', 'en', 'metro'],
    category: 'Vehiculo',
    categoryAr: 'مواصلات',
    grammarHint: {
      pattern: 'Voy en + مواصلة',
      rule: 'metro زي الإنجليزي بس بنطق مختلف',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'avion',
    word: 'el avión',
    wordAr: 'الطيارة',
    emoji: '✈️',
    sentenceEs: 'Voy en avión',
    sentenceAr: 'رايح بالطيارة',
    sentenceWords: ['Voy', 'en', 'avión'],
    category: 'Vehiculo',
    categoryAr: 'مواصلات',
    grammarHint: {
      pattern: 'Voy en + مواصلة',
      rule: 'avión بفتحة على الـ ó',
    },
    note: 'avión بفتحة على الـ ó',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },

  // ═══════════ Group 2: En la Calle (في الشارع) ═══════════
  {
    id: 'calle',
    word: 'la calle',
    wordAr: 'الشارع',
    emoji: '🛣️',
    sentenceEs: 'Cruzo la calle',
    sentenceAr: 'بعدي الشارع',
    sentenceWords: ['Cruzo', 'la', 'calle'],
    category: 'Calle',
    categoryAr: 'في الشارع',
    grammarHint: {
      pattern: 'Cruzo + la + اسم',
      rule: 'Cruzo = بعدي - من فعل cruzar',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'semaforo',
    word: 'el semáforo',
    wordAr: 'الإشارة',
    emoji: '🚦',
    sentenceEs: 'Espero el semáforo',
    sentenceAr: 'مستني الإشارة',
    sentenceWords: ['Espero', 'el', 'semáforo'],
    category: 'Calle',
    categoryAr: 'في الشارع',
    grammarHint: {
      pattern: 'Espero + el + اسم',
      rule: 'Espero = مستني - من فعل esperar',
    },
    note: 'semáforo بفتحة على الـ á',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'parada',
    word: 'la parada',
    wordAr: 'المحطة',
    emoji: '🚏',
    sentenceEs: 'Espero en la parada',
    sentenceAr: 'مستني في المحطة',
    sentenceWords: ['Espero', 'en', 'la', 'parada'],
    category: 'Calle',
    categoryAr: 'في الشارع',
    grammarHint: {
      pattern: 'Espero en + la + مكان',
      rule: 'parada من فعل parar (يقف)',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'rapido',
    word: 'rápido',
    wordAr: 'سريع',
    emoji: '⚡',
    sentenceEs: 'El tren es rápido',
    sentenceAr: 'القطر سريع',
    sentenceWords: ['El', 'tren', 'es', 'rápido'],
    category: 'Calle',
    categoryAr: 'في الشارع',
    grammarHint: {
      pattern: 'El/La + اسم + es + صفة',
      rule: 'للمؤنث: rápida',
    },
    note: 'rápido بفتحة على الـ á',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'lento',
    word: 'lento',
    wordAr: 'بطيء',
    emoji: '🐌',
    sentenceEs: 'El autobús es lento',
    sentenceAr: 'الأتوبيس بطيء',
    sentenceWords: ['El', 'autobús', 'es', 'lento'],
    category: 'Calle',
    categoryAr: 'في الشارع',
    grammarHint: {
      pattern: 'El + اسم + es + صفة',
      rule: 'للمؤنث: lenta',
    },
    note: 'للمؤنث: lenta',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },

  // ═══════════ Group 3: Viajar (السفر) ═══════════
  {
    id: 'aeropuerto',
    word: 'el aeropuerto',
    wordAr: 'المطار',
    emoji: '🛫',
    sentenceEs: 'Voy al aeropuerto',
    sentenceAr: 'رايح المطار',
    sentenceWords: ['Voy', 'al', 'aeropuerto'],
    category: 'Viajar',
    categoryAr: 'السفر',
    grammarHint: {
      pattern: 'Voy al + مذكر',
      rule: 'al = a + el (اختصار المذكر)',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'estacion',
    word: 'la estación',
    wordAr: 'المحطة',
    emoji: '🚉',
    sentenceEs: 'Voy a la estación',
    sentenceAr: 'رايح المحطة',
    sentenceWords: ['Voy', 'a', 'la', 'estación'],
    category: 'Viajar',
    categoryAr: 'السفر',
    grammarHint: {
      pattern: 'Voy a la + مؤنث',
      rule: 'estación مؤنثة → la estación',
    },
    note: 'estación بفتحة على الـ ó',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'billete',
    word: 'el billete',
    wordAr: 'التذكرة',
    emoji: '🎫',
    sentenceEs: 'Necesito un billete',
    sentenceAr: 'محتاج تذكرة',
    sentenceWords: ['Necesito', 'un', 'billete'],
    category: 'Viajar',
    categoryAr: 'السفر',
    grammarHint: {
      pattern: 'Necesito + un + مذكر',
      rule: 'billete مذكر → un billete',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'llegar',
    word: 'llegar',
    wordAr: 'يصل',
    emoji: '📍',
    sentenceEs: 'Quiero llegar',
    sentenceAr: 'عايز أوصل',
    sentenceWords: ['Quiero', 'llegar'],
    category: 'Viajar',
    categoryAr: 'السفر',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'llegar = يصل (المصدر)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'salir',
    word: 'salir',
    wordAr: 'يخرج',
    emoji: '🚪',
    sentenceEs: 'Voy a salir',
    sentenceAr: 'هخرج',
    sentenceWords: ['Voy', 'a', 'salir'],
    category: 'Viajar',
    categoryAr: 'السفر',
    grammarHint: {
      pattern: 'Voy a + فعل',
      rule: 'Voy a salir = هخرج (المستقبل القريب)',
    },
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishTransportGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishTransportItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_TRANSPORT_GROUPS: SpanishTransportGroup[] = [
  {
    id: 'group-vehiculos',
    titleEs: 'Vehículos',
    titleAr: 'المواصلات',
    emoji: '🚗',
    items: SPANISH_TRANSPORT_ITEMS.filter(i => i.category === 'Vehiculo'),
    grammarFocus: {
      pattern: 'Voy en + مواصلة',
      description: 'مع المواصلات نستخدم en بدون أداة تعريف',
    },
  },
  {
    id: 'group-calle',
    titleEs: 'En la Calle',
    titleAr: 'في الشارع',
    emoji: '🚦',
    items: SPANISH_TRANSPORT_ITEMS.filter(i => i.category === 'Calle'),
    grammarFocus: {
      pattern: 'Cruzo / Espero + مكان',
      description: 'أفعال الشارع + صفات السرعة',
    },
  },
  {
    id: 'group-viajar',
    titleEs: 'Viajar',
    titleAr: 'السفر',
    emoji: '✈️',
    items: SPANISH_TRANSPORT_ITEMS.filter(i => i.category === 'Viajar'),
    grammarFocus: {
      pattern: 'Voy al / Necesito / Quiero',
      description: 'أفعال السفر والذهاب للأماكن',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishTransportChoices(
  correctWord: string,
  count: number = 3
): SpanishTransportItem[] {
  const correct = SPANISH_TRANSPORT_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_TRANSPORT_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateTransportSentenceWordPool(
  item: SpanishTransportItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_TRANSPORT_ITEMS.filter(i => i.id !== item.id);
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

export function checkTransportSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
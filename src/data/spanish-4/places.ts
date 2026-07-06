// ═══════════════════════════════════════════════════════════
// 🕌 Spanish Places Lesson Data
// 🏛️ Mezquita de Córdoba - Map 4, Lesson 7
// ═══════════════════════════════════════════════════════════

export interface SpanishPlacesItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Lugar' | 'Adjetivo' | 'Ubicacion';
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

export const SPANISH_PLACES_ITEMS: SpanishPlacesItem[] = [
  // ═══════════ Group 1: Tipos de Lugares (أنواع الأماكن) ═══════════
  {
    id: 'ciudad',
    word: 'la ciudad',
    wordAr: 'المدينة',
    emoji: '🏙️',
    sentenceEs: 'La ciudad es grande',
    sentenceAr: 'المدينة كبيرة',
    sentenceWords: ['La', 'ciudad', 'es', 'grande'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    grammarHint: {
      pattern: 'La + مكان + es + صفة',
      rule: 'ciudad مؤنثة → La ciudad',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'pueblo',
    word: 'el pueblo',
    wordAr: 'القرية',
    emoji: '🏘️',
    sentenceEs: 'El pueblo es pequeño',
    sentenceAr: 'القرية صغيرة',
    sentenceWords: ['El', 'pueblo', 'es', 'pequeño'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    grammarHint: {
      pattern: 'El + مكان + es + صفة',
      rule: 'pueblo مذكر → El pueblo',
    },
    note: 'pequeño بحرف ñ',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'parque',
    word: 'el parque',
    wordAr: 'الحديقة',
    emoji: '🌳',
    sentenceEs: 'El parque es bonito',
    sentenceAr: 'الحديقة جميلة',
    sentenceWords: ['El', 'parque', 'es', 'bonito'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    grammarHint: {
      pattern: 'El + مكان + es + صفة',
      rule: 'parque مذكر رغم انتهائه بـ e',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'plaza',
    word: 'la plaza',
    wordAr: 'الميدان',
    emoji: '⛲',
    sentenceEs: 'La plaza es famosa',
    sentenceAr: 'الميدان مشهور',
    sentenceWords: ['La', 'plaza', 'es', 'famosa'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    grammarHint: {
      pattern: 'La + مكان + es + صفة مؤنثة',
      rule: 'مع المؤنث: famosa (مش famoso)',
    },
    note: 'مع plaza: famosa (مؤنث)',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'museo',
    word: 'el museo',
    wordAr: 'المتحف',
    emoji: '🖼️',
    sentenceEs: 'El museo es antiguo',
    sentenceAr: 'المتحف قديم',
    sentenceWords: ['El', 'museo', 'es', 'antiguo'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    grammarHint: {
      pattern: 'El + مكان + es + صفة',
      rule: 'antiguo = قديم / للمؤنث: antigua',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },

  // ═══════════ Group 2: Adjetivos (الصفات) ═══════════
  {
    id: 'grande',
    word: 'grande',
    wordAr: 'كبير',
    emoji: '🔺',
    sentenceEs: 'Es muy grande',
    sentenceAr: 'ده كبير أوي',
    sentenceWords: ['Es', 'muy', 'grande'],
    category: 'Adjetivo',
    categoryAr: 'صفات',
    grammarHint: {
      pattern: 'Es + muy + صفة',
      rule: 'grande لا تتغير مع الجنس',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'pequeno',
    word: 'pequeño',
    wordAr: 'صغير',
    emoji: '🔻',
    sentenceEs: 'Es pequeño',
    sentenceAr: 'ده صغير',
    sentenceWords: ['Es', 'pequeño'],
    category: 'Adjetivo',
    categoryAr: 'صفات',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: pequeña',
    },
    note: 'للمؤنث: pequeña',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'bonito',
    word: 'bonito',
    wordAr: 'جميل',
    emoji: '🌸',
    sentenceEs: 'Es bonito',
    sentenceAr: 'ده جميل',
    sentenceWords: ['Es', 'bonito'],
    category: 'Adjetivo',
    categoryAr: 'صفات',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: bonita',
    },
    note: 'للمؤنث: bonita',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'antiguo',
    word: 'antiguo',
    wordAr: 'قديم',
    emoji: '📜',
    sentenceEs: 'Es antiguo',
    sentenceAr: 'ده قديم',
    sentenceWords: ['Es', 'antiguo'],
    category: 'Adjetivo',
    categoryAr: 'صفات',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: antigua',
    },
    note: 'للمؤنث: antigua',
    color: '#78350F',
    gradient: ['#A16207', '#451A03'],
  },
  {
    id: 'moderno',
    word: 'moderno',
    wordAr: 'حديث',
    emoji: '🏢',
    sentenceEs: 'Es moderno',
    sentenceAr: 'ده حديث',
    sentenceWords: ['Es', 'moderno'],
    category: 'Adjetivo',
    categoryAr: 'صفات',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: moderna',
    },
    note: 'للمؤنث: moderna',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },

  // ═══════════ Group 3: Ubicación (الموقع) ═══════════
  {
    id: 'cerca',
    word: 'cerca',
    wordAr: 'قريب',
    emoji: '📍',
    sentenceEs: 'Está cerca',
    sentenceAr: 'ده قريب',
    sentenceWords: ['Está', 'cerca'],
    category: 'Ubicacion',
    categoryAr: 'موقع',
    grammarHint: {
      pattern: 'Está + مكان',
      rule: 'Está للمكان / Es للصفة الدائمة',
    },
    note: 'Está للمكان (مؤقت)',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'lejos',
    word: 'lejos',
    wordAr: 'بعيد',
    emoji: '🛣️',
    sentenceEs: 'Está lejos',
    sentenceAr: 'ده بعيد',
    sentenceWords: ['Está', 'lejos'],
    category: 'Ubicacion',
    categoryAr: 'موقع',
    grammarHint: {
      pattern: 'Está + مكان',
      rule: 'عكس cerca',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'aqui',
    word: 'aquí',
    wordAr: 'هنا',
    emoji: '👉',
    sentenceEs: 'Estoy aquí',
    sentenceAr: 'أنا هنا',
    sentenceWords: ['Estoy', 'aquí'],
    category: 'Ubicacion',
    categoryAr: 'موقع',
    grammarHint: {
      pattern: 'Estoy + مكان',
      rule: 'Estoy = أنا (للمكان)',
    },
    note: 'aquí بفتحة على الـ í',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'alli',
    word: 'allí',
    wordAr: 'هناك',
    emoji: '👈',
    sentenceEs: 'Está allí',
    sentenceAr: 'ده هناك',
    sentenceWords: ['Está', 'allí'],
    category: 'Ubicacion',
    categoryAr: 'موقع',
    grammarHint: {
      pattern: 'Está + مكان',
      rule: 'عكس aquí',
    },
    note: 'allí بفتحة على الـ í',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'famoso',
    word: 'famoso',
    wordAr: 'مشهور',
    emoji: '⭐',
    sentenceEs: 'Es famoso',
    sentenceAr: 'ده مشهور',
    sentenceWords: ['Es', 'famoso'],
    category: 'Ubicacion',
    categoryAr: 'موقع',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: famosa',
    },
    note: 'للمؤنث: famosa',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishPlacesGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishPlacesItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_PLACES_GROUPS: SpanishPlacesGroup[] = [
  {
    id: 'group-lugares',
    titleEs: 'Tipos de Lugares',
    titleAr: 'أنواع الأماكن',
    emoji: '🏛️',
    items: SPANISH_PLACES_ITEMS.filter(i => i.category === 'Lugar'),
    grammarFocus: {
      pattern: 'El/La + مكان + es + صفة',
      description: 'وصف الأماكن باستخدام Es',
    },
  },
  {
    id: 'group-adjetivos',
    titleEs: 'Adjetivos',
    titleAr: 'الصفات',
    emoji: '✨',
    items: SPANISH_PLACES_ITEMS.filter(i => i.category === 'Adjetivo'),
    grammarFocus: {
      pattern: 'Es + muy + صفة',
      description: 'الصفات تتغير مع الجنس (o للمذكر / a للمؤنث)',
    },
  },
  {
    id: 'group-ubicacion',
    titleEs: 'Ubicación',
    titleAr: 'الموقع',
    emoji: '🗺️',
    items: SPANISH_PLACES_ITEMS.filter(i => i.category === 'Ubicacion'),
    grammarFocus: {
      pattern: 'Está + مكان / Es + صفة',
      description: 'Está للمكان (مؤقت) و Es للصفة الدائمة',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishPlacesChoices(
  correctWord: string,
  count: number = 3
): SpanishPlacesItem[] {
  const correct = SPANISH_PLACES_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_PLACES_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generatePlacesSentenceWordPool(
  item: SpanishPlacesItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_PLACES_ITEMS.filter(i => i.id !== item.id);
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

export function checkPlacesSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
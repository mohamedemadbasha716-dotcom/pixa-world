// ═══════════════════════════════════════════════════════════
// 🌍 Spanish Countries Lesson Data
// 🏛️ Ciudad de las Artes y las Ciencias - Map 3, Lesson 6
// ═══════════════════════════════════════════════════════════

export interface SpanishCountriesItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Pais' | 'Nacionalidad' | 'Idioma';
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

export const SPANISH_COUNTRIES_ITEMS: SpanishCountriesItem[] = [
  // ═══════════ Group 1: Países del Mundo (دول العالم) ═══════════
  {
    id: 'espana',
    word: 'España',
    wordAr: 'إسبانيا',
    emoji: '🇪🇸',
    sentenceEs: 'Soy de España',
    sentenceAr: 'أنا من إسبانيا',
    sentenceWords: ['Soy', 'de', 'España'],
    category: 'Pais',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Soy de + بلد',
      rule: 'Soy de = أنا من - من فعل ser',
    },
    note: 'España بحرف كبير + ñ',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'egipto',
    word: 'Egipto',
    wordAr: 'مصر',
    emoji: '🇪🇬',
    sentenceEs: 'Soy de Egipto',
    sentenceAr: 'أنا من مصر',
    sentenceWords: ['Soy', 'de', 'Egipto'],
    category: 'Pais',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Soy de + بلد',
      rule: 'Egipto = مصر (بحرف كبير)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'mexico',
    word: 'México',
    wordAr: 'المكسيك',
    emoji: '🇲🇽',
    sentenceEs: 'Soy de México',
    sentenceAr: 'أنا من المكسيك',
    sentenceWords: ['Soy', 'de', 'México'],
    category: 'Pais',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Soy de + بلد',
      rule: 'México بفتحة على الـ é',
    },
    note: 'México بفتحة على الـ é',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'argentina',
    word: 'Argentina',
    wordAr: 'الأرجنتين',
    emoji: '🇦🇷',
    sentenceEs: 'Soy de Argentina',
    sentenceAr: 'أنا من الأرجنتين',
    sentenceWords: ['Soy', 'de', 'Argentina'],
    category: 'Pais',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Soy de + بلد',
      rule: 'Argentina دولة في أمريكا الجنوبية',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'francia',
    word: 'Francia',
    wordAr: 'فرنسا',
    emoji: '🇫🇷',
    sentenceEs: 'Soy de Francia',
    sentenceAr: 'أنا من فرنسا',
    sentenceWords: ['Soy', 'de', 'Francia'],
    category: 'Pais',
    categoryAr: 'دول',
    grammarHint: {
      pattern: 'Soy de + بلد',
      rule: 'Francia = France بس بنطق مختلف',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════ Group 2: Nacionalidades (الجنسيات) ═══════════
  {
    id: 'espanol',
    word: 'español',
    wordAr: 'إسباني',
    emoji: '👨',
    sentenceEs: 'Soy español',
    sentenceAr: 'أنا إسباني',
    sentenceWords: ['Soy', 'español'],
    category: 'Nacionalidad',
    categoryAr: 'جنسيات',
    grammarHint: {
      pattern: 'Soy + جنسية',
      rule: 'للبنت: española',
    },
    note: 'للبنت: española',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'egipcio',
    word: 'egipcio',
    wordAr: 'مصري',
    emoji: '🐫',
    sentenceEs: 'Soy egipcio',
    sentenceAr: 'أنا مصري',
    sentenceWords: ['Soy', 'egipcio'],
    category: 'Nacionalidad',
    categoryAr: 'جنسيات',
    grammarHint: {
      pattern: 'Soy + جنسية',
      rule: 'للبنت: egipcia',
    },
    note: 'للبنت: egipcia',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'mexicano',
    word: 'mexicano',
    wordAr: 'مكسيكي',
    emoji: '🌵',
    sentenceEs: 'Soy mexicano',
    sentenceAr: 'أنا مكسيكي',
    sentenceWords: ['Soy', 'mexicano'],
    category: 'Nacionalidad',
    categoryAr: 'جنسيات',
    grammarHint: {
      pattern: 'Soy + جنسية',
      rule: 'للبنت: mexicana',
    },
    note: 'للبنت: mexicana',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'argentino',
    word: 'argentino',
    wordAr: 'أرجنتيني',
    emoji: '⚽',
    sentenceEs: 'Soy argentino',
    sentenceAr: 'أنا أرجنتيني',
    sentenceWords: ['Soy', 'argentino'],
    category: 'Nacionalidad',
    categoryAr: 'جنسيات',
    grammarHint: {
      pattern: 'Soy + جنسية',
      rule: 'للبنت: argentina',
    },
    note: 'للبنت: argentina',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'frances',
    word: 'francés',
    wordAr: 'فرنسي',
    emoji: '🥐',
    sentenceEs: 'Soy francés',
    sentenceAr: 'أنا فرنسي',
    sentenceWords: ['Soy', 'francés'],
    category: 'Nacionalidad',
    categoryAr: 'جنسيات',
    grammarHint: {
      pattern: 'Soy + جنسية',
      rule: 'للبنت: francesa',
    },
    note: 'francés بفتحة على الـ é / للبنت: francesa',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════ Group 3: Idiomas y Mundo (اللغات والعالم) ═══════════
  {
    id: 'mundo',
    word: 'el mundo',
    wordAr: 'العالم',
    emoji: '🌍',
    sentenceEs: 'El mundo es grande',
    sentenceAr: 'العالم كبير',
    sentenceWords: ['El', 'mundo', 'es', 'grande'],
    category: 'Idioma',
    categoryAr: 'العالم واللغات',
    grammarHint: {
      pattern: 'El + اسم + es + صفة',
      rule: 'grande = كبير (لا يتغير مع الجنس)',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'idioma',
    word: 'el idioma',
    wordAr: 'اللغة',
    emoji: '💬',
    sentenceEs: 'Hablo un idioma',
    sentenceAr: 'باتكلم لغة',
    sentenceWords: ['Hablo', 'un', 'idioma'],
    category: 'Idioma',
    categoryAr: 'العالم واللغات',
    grammarHint: {
      pattern: 'Hablo + un + مذكر',
      rule: 'Hablo = باتكلم - من فعل hablar',
    },
    note: 'idioma مذكر رغم انتهائه بـ a',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'espanol-idioma',
    word: 'el español',
    wordAr: 'الإسبانية',
    emoji: '🇪🇸',
    sentenceEs: 'Hablo español',
    sentenceAr: 'باتكلم إسباني',
    sentenceWords: ['Hablo', 'español'],
    category: 'Idioma',
    categoryAr: 'العالم واللغات',
    grammarHint: {
      pattern: 'Hablo + لغة',
      rule: 'مع Hablo مش لازم أداة تعريف',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'arabe',
    word: 'el árabe',
    wordAr: 'العربية',
    emoji: '🇸🇦',
    sentenceEs: 'Hablo árabe',
    sentenceAr: 'باتكلم عربي',
    sentenceWords: ['Hablo', 'árabe'],
    category: 'Idioma',
    categoryAr: 'العالم واللغات',
    grammarHint: {
      pattern: 'Hablo + لغة',
      rule: 'árabe بفتحة على الـ á',
    },
    note: 'árabe بفتحة على الـ á',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'ingles',
    word: 'el inglés',
    wordAr: 'الإنجليزية',
    emoji: '🇬🇧',
    sentenceEs: 'Hablo inglés',
    sentenceAr: 'باتكلم إنجليزي',
    sentenceWords: ['Hablo', 'inglés'],
    category: 'Idioma',
    categoryAr: 'العالم واللغات',
    grammarHint: {
      pattern: 'Hablo + لغة',
      rule: 'inglés بفتحة على الـ é',
    },
    note: 'inglés بفتحة على الـ é',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishCountriesGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishCountriesItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_COUNTRIES_GROUPS: SpanishCountriesGroup[] = [
  {
    id: 'group-paises',
    titleEs: 'Países del Mundo',
    titleAr: 'دول العالم',
    emoji: '🌍',
    items: SPANISH_COUNTRIES_ITEMS.filter(i => i.category === 'Pais'),
    grammarFocus: {
      pattern: 'Soy de + بلد',
      description: 'للتعريف بمكان الأصل: Soy de + اسم البلد',
    },
  },
  {
    id: 'group-nacionalidades',
    titleEs: 'Nacionalidades',
    titleAr: 'الجنسيات',
    emoji: '👤',
    items: SPANISH_COUNTRIES_ITEMS.filter(i => i.category === 'Nacionalidad'),
    grammarFocus: {
      pattern: 'Soy + جنسية',
      description: 'الجنسيات بحرف صغير + تتغير مع الجنس',
    },
  },
  {
    id: 'group-idiomas',
    titleEs: 'Idiomas y Mundo',
    titleAr: 'اللغات والعالم',
    emoji: '💬',
    items: SPANISH_COUNTRIES_ITEMS.filter(i => i.category === 'Idioma'),
    grammarFocus: {
      pattern: 'Hablo + لغة',
      description: 'Hablo = باتكلم - نستخدمها مع اللغات',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishCountriesChoices(
  correctWord: string,
  count: number = 3
): SpanishCountriesItem[] {
  const correct = SPANISH_COUNTRIES_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_COUNTRIES_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateCountriesSentenceWordPool(
  item: SpanishCountriesItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_COUNTRIES_ITEMS.filter(i => i.id !== item.id);
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

export function checkCountriesSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
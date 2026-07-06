// ═══════════════════════════════════════════════════════════
// ⚽ Spanish Deporte Profesional Lesson Data
// 🏛️ Estadio Bernabéu - Map 5, Lesson 4
// ═══════════════════════════════════════════════════════════

export interface SpanishDeporteItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Partido' | 'Equipo' | 'Aficionados';
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

export const SPANISH_DEPORTE_ITEMS: SpanishDeporteItem[] = [
  // ═══════════ Group 1: El Partido (المباراة) ═══════════
  {
    id: 'estadio',
    word: 'el estadio',
    wordAr: 'الاستاد',
    emoji: '🏟️',
    sentenceEs: 'Voy al estadio',
    sentenceAr: 'رايح الاستاد',
    sentenceWords: ['Voy', 'al', 'estadio'],
    category: 'Partido',
    categoryAr: 'مباراة',
    grammarHint: {
      pattern: 'Voy al + مذكر',
      rule: 'al = a + el (اختصار مع المذكر)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'jugador',
    word: 'el jugador',
    wordAr: 'اللاعب',
    emoji: '⚽',
    sentenceEs: 'Es un buen jugador',
    sentenceAr: 'ده لاعب شاطر',
    sentenceWords: ['Es', 'un', 'buen', 'jugador'],
    category: 'Partido',
    categoryAr: 'مباراة',
    grammarHint: {
      pattern: 'Es + un + صفة + مذكر',
      rule: 'buen = صيغة مختصرة من bueno',
    },
    note: 'buen قبل الاسم / bueno بعد الاسم',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'arbitro',
    word: 'el árbitro',
    wordAr: 'الحكم',
    emoji: '🧑‍⚖️',
    sentenceEs: 'El árbitro pita',
    sentenceAr: 'الحكم بيصفر',
    sentenceWords: ['El', 'árbitro', 'pita'],
    category: 'Partido',
    categoryAr: 'مباراة',
    grammarHint: {
      pattern: 'El + شخص + فعل',
      rule: 'pita = بيصفر (من فعل pitar)',
    },
    note: 'árbitro بفتحة على الـ á',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'gol',
    word: 'el gol',
    wordAr: 'الجول',
    emoji: '🥅',
    sentenceEs: '¡Marcó un gol!',
    sentenceAr: 'سجل جول!',
    sentenceWords: ['Marcó', 'un', 'gol'],
    category: 'Partido',
    categoryAr: 'مباراة',
    grammarHint: {
      pattern: '¡Marcó + un + مذكر!',
      rule: 'Marcó = سجّل (فعل ماضي)',
    },
    note: 'Marcó بفتحة على الـ ó (ماضي)',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'ganar-deporte',
    word: 'ganar',
    wordAr: 'يفوز',
    emoji: '🏆',
    sentenceEs: 'Vamos a ganar',
    sentenceAr: 'يلا نفوز',
    sentenceWords: ['Vamos', 'a', 'ganar'],
    category: 'Partido',
    categoryAr: 'مباراة',
    grammarHint: {
      pattern: 'Vamos a + فعل',
      rule: 'Vamos a = يلا نعمل (المستقبل الجماعي)',
    },
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },

  // ═══════════ Group 2: El Equipo (الفريق) ═══════════
  {
    id: 'equipo-deporte',
    word: 'el equipo',
    wordAr: 'الفريق',
    emoji: '👥',
    sentenceEs: 'Mi equipo es fuerte',
    sentenceAr: 'فريقي قوي',
    sentenceWords: ['Mi', 'equipo', 'es', 'fuerte'],
    category: 'Equipo',
    categoryAr: 'فريق',
    grammarHint: {
      pattern: 'Mi + اسم + es + صفة',
      rule: 'fuerte = قوي (لا يتغير مع الجنس)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'capitan',
    word: 'el capitán',
    wordAr: 'الكابتن',
    emoji: '🎖️',
    sentenceEs: 'Es el capitán',
    sentenceAr: 'ده الكابتن',
    sentenceWords: ['Es', 'el', 'capitán'],
    category: 'Equipo',
    categoryAr: 'فريق',
    grammarHint: {
      pattern: 'Es + el + مذكر',
      rule: 'capitán بفتحة على الـ á',
    },
    note: 'capitán بفتحة على الـ á',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'entrenador',
    word: 'el entrenador',
    wordAr: 'المدرب',
    emoji: '👨‍🏫',
    sentenceEs: 'Escucho al entrenador',
    sentenceAr: 'باسمع المدرب',
    sentenceWords: ['Escucho', 'al', 'entrenador'],
    category: 'Equipo',
    categoryAr: 'فريق',
    grammarHint: {
      pattern: 'Escucho al + شخص',
      rule: 'مع الأشخاص المذكر: al = a + el',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'uniforme',
    word: 'el uniforme',
    wordAr: 'الزي',
    emoji: '👕',
    sentenceEs: 'Lleva el uniforme',
    sentenceAr: 'لابس الزي',
    sentenceWords: ['Lleva', 'el', 'uniforme'],
    category: 'Equipo',
    categoryAr: 'فريق',
    grammarHint: {
      pattern: 'Lleva + el + اسم',
      rule: 'Lleva = لابس - من فعل llevar',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'pelota',
    word: 'la pelota',
    wordAr: 'الكرة',
    emoji: '⚽',
    sentenceEs: 'Pateo la pelota',
    sentenceAr: 'باشوت الكرة',
    sentenceWords: ['Pateo', 'la', 'pelota'],
    category: 'Equipo',
    categoryAr: 'فريق',
    grammarHint: {
      pattern: 'Pateo + la + مؤنث',
      rule: 'Pateo = باشوت - من فعل patear',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },

  // ═══════════ Group 3: Aficionados (المشجعين) ═══════════
  {
    id: 'aficionado',
    word: 'el aficionado',
    wordAr: 'المشجع',
    emoji: '📣',
    sentenceEs: 'Soy un aficionado',
    sentenceAr: 'أنا مشجع',
    sentenceWords: ['Soy', 'un', 'aficionado'],
    category: 'Aficionados',
    categoryAr: 'مشجعين',
    grammarHint: {
      pattern: 'Soy + un + مذكر',
      rule: 'للبنت: Soy una aficionada',
    },
    note: 'للبنت: aficionada',
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
  {
    id: 'animar',
    word: 'animar',
    wordAr: 'يشجع',
    emoji: '🙌',
    sentenceEs: 'Vamos a animar',
    sentenceAr: 'يلا نشجع',
    sentenceWords: ['Vamos', 'a', 'animar'],
    category: 'Aficionados',
    categoryAr: 'مشجعين',
    grammarHint: {
      pattern: 'Vamos a + فعل',
      rule: 'animar = يشجع (المصدر)',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'campeon',
    word: 'el campeón',
    wordAr: 'البطل',
    emoji: '👑',
    sentenceEs: 'Es el campeón',
    sentenceAr: 'ده البطل',
    sentenceWords: ['Es', 'el', 'campeón'],
    category: 'Aficionados',
    categoryAr: 'مشجعين',
    grammarHint: {
      pattern: 'Es + el + شخص',
      rule: 'campeón بفتحة على الـ ó',
    },
    note: 'campeón بفتحة على الـ ó / للبنت: campeona',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'rapido-deporte',
    word: 'rápido',
    wordAr: 'سريع',
    emoji: '⚡',
    sentenceEs: 'Es muy rápido',
    sentenceAr: 'ده سريع أوي',
    sentenceWords: ['Es', 'muy', 'rápido'],
    category: 'Aficionados',
    categoryAr: 'مشجعين',
    grammarHint: {
      pattern: 'Es + muy + صفة',
      rule: 'rápido بفتحة على الـ á / للمؤنث: rápida',
    },
    note: 'rápido بفتحة على الـ á',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'vamos',
    word: '¡Vamos!',
    wordAr: 'يلا!',
    emoji: '🔥',
    sentenceEs: '¡Vamos, equipo!',
    sentenceAr: 'يلا يا فريق!',
    sentenceWords: ['Vamos', 'equipo'],
    category: 'Aficionados',
    categoryAr: 'مشجعين',
    grammarHint: {
      pattern: '¡Vamos + شخص!',
      rule: '¡Vamos! = صيحة تشجيع أسبانية شهيرة',
    },
    note: 'صيحة التشجيع الأسبانية الأشهر',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishDeporteGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishDeporteItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_DEPORTE_GROUPS: SpanishDeporteGroup[] = [
  {
    id: 'group-partido',
    titleEs: 'El Partido',
    titleAr: 'المباراة',
    emoji: '🏟️',
    items: SPANISH_DEPORTE_ITEMS.filter(i => i.category === 'Partido'),
    grammarFocus: {
      pattern: 'Voy al + مكان / Es un + صفة + شخص',
      description: 'وصف المباراة واللاعبين',
    },
  },
  {
    id: 'group-equipo',
    titleEs: 'El Equipo',
    titleAr: 'الفريق',
    emoji: '👥',
    items: SPANISH_DEPORTE_ITEMS.filter(i => i.category === 'Equipo'),
    grammarFocus: {
      pattern: 'Mi + اسم / Escucho / Lleva / Pateo',
      description: 'أفعال الفريق والملابس',
    },
  },
  {
    id: 'group-aficionados',
    titleEs: 'Aficionados',
    titleAr: 'المشجعين',
    emoji: '📣',
    items: SPANISH_DEPORTE_ITEMS.filter(i => i.category === 'Aficionados'),
    grammarFocus: {
      pattern: '¡Vamos! / Soy un + شخص / Es muy + صفة',
      description: 'صيحات التشجيع والتعريف بالمشجعين',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishDeporteChoices(
  correctWord: string,
  count: number = 3
): SpanishDeporteItem[] {
  const correct = SPANISH_DEPORTE_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_DEPORTE_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateDeporteSentenceWordPool(
  item: SpanishDeporteItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_DEPORTE_ITEMS.filter(i => i.id !== item.id);
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

export function checkDeporteSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
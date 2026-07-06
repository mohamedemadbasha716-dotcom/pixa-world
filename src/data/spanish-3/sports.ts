// ═══════════════════════════════════════════════════════════
// ⚽ Spanish Sports Lesson Data
// 🏟️ Camp Nou - Map 3, Lesson 3
// ═══════════════════════════════════════════════════════════

export interface SpanishSportsItem {
  id: string;

  // الكلمة الأساسية
  word: string;       // مثل: "el fútbol"
  wordAr: string;     // مثل: "كرة القدم"
  emoji: string;

  // الجملة الكاملة
  sentenceEs: string;     // مثل: "Juego al fútbol"
  sentenceAr: string;     // مثل: "ألعب كرة القدم"
  sentenceWords: string[];// ["Juego", "al", "fútbol"]

  // التصنيف
  category: 'Deporte' | 'Pasatiempo' | 'Estadio';
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

export const SPANISH_SPORTS_ITEMS: SpanishSportsItem[] = [
  // ═══════════ Group 1: Deportes Populares (الرياضات الشهيرة) ═══════════
  {
    id: 'futbol',
    word: 'el fútbol',
    wordAr: 'كرة القدم',
    emoji: '⚽',
    sentenceEs: 'Juego al fútbol',
    sentenceAr: 'ألعب كرة القدم',
    sentenceWords: ['Juego', 'al', 'fútbol'],
    category: 'Deporte',
    categoryAr: 'رياضات',
    grammarHint: {
      pattern: 'Juego al + رياضة',
      rule: 'Juego al = ألعب - نستخدمها مع الرياضات بالكرة',
    },
    note: 'fútbol بفتحة على الـ ú',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'baloncesto',
    word: 'el baloncesto',
    wordAr: 'كرة السلة',
    emoji: '🏀',
    sentenceEs: 'Juego al baloncesto',
    sentenceAr: 'ألعب كرة السلة',
    sentenceWords: ['Juego', 'al', 'baloncesto'],
    category: 'Deporte',
    categoryAr: 'رياضات',
    grammarHint: {
      pattern: 'Juego al + رياضة',
      rule: 'baloncesto = balón (كرة) + cesto (سلة)',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'tenis',
    word: 'el tenis',
    wordAr: 'التنس',
    emoji: '🎾',
    sentenceEs: 'Juego al tenis',
    sentenceAr: 'ألعب التنس',
    sentenceWords: ['Juego', 'al', 'tenis'],
    category: 'Deporte',
    categoryAr: 'رياضات',
    grammarHint: {
      pattern: 'Juego al + رياضة',
      rule: 'tenis زي الإنجليزي بس بنطق مختلف',
    },
    color: '#84CC16',
    gradient: ['#A3E635', '#4D7C0F'],
  },
  {
    id: 'natacion',
    word: 'la natación',
    wordAr: 'السباحة',
    emoji: '🏊',
    sentenceEs: 'Me gusta la natación',
    sentenceAr: 'بحب السباحة',
    sentenceWords: ['Me', 'gusta', 'la', 'natación'],
    category: 'Deporte',
    categoryAr: 'رياضات',
    grammarHint: {
      pattern: 'Me gusta + la + رياضة',
      rule: 'مع الرياضات بدون كرة نستخدم Me gusta',
    },
    note: 'natación بفتحة على الـ ó',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'ciclismo',
    word: 'el ciclismo',
    wordAr: 'ركوب الدراجات',
    emoji: '🚴',
    sentenceEs: 'Practico ciclismo',
    sentenceAr: 'أمارس ركوب الدراجات',
    sentenceWords: ['Practico', 'ciclismo'],
    category: 'Deporte',
    categoryAr: 'رياضات',
    grammarHint: {
      pattern: 'Practico + رياضة',
      rule: 'Practico = أمارس - من فعل practicar',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },

  // ═══════════ Group 2: Pasatiempos (الهوايات) ═══════════
  {
    id: 'musica',
    word: 'la música',
    wordAr: 'الموسيقى',
    emoji: '🎵',
    sentenceEs: 'Escucho música',
    sentenceAr: 'أستمع للموسيقى',
    sentenceWords: ['Escucho', 'música'],
    category: 'Pasatiempo',
    categoryAr: 'هوايات',
    grammarHint: {
      pattern: 'Escucho + اسم',
      rule: 'Escucho = أستمع - من فعل escuchar',
    },
    note: 'música بفتحة على الـ ú',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'videojuegos',
    word: 'los videojuegos',
    wordAr: 'ألعاب الفيديو',
    emoji: '🎮',
    sentenceEs: 'Juego videojuegos',
    sentenceAr: 'ألعب ألعاب فيديو',
    sentenceWords: ['Juego', 'videojuegos'],
    category: 'Pasatiempo',
    categoryAr: 'هوايات',
    grammarHint: {
      pattern: 'Juego + اسم',
      rule: 'videojuegos = video + juegos (ألعاب)',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'lectura',
    word: 'la lectura',
    wordAr: 'القراءة',
    emoji: '📚',
    sentenceEs: 'Me gusta la lectura',
    sentenceAr: 'بحب القراءة',
    sentenceWords: ['Me', 'gusta', 'la', 'lectura'],
    category: 'Pasatiempo',
    categoryAr: 'هوايات',
    grammarHint: {
      pattern: 'Me gusta + la + هواية',
      rule: 'lectura من فعل leer (يقرأ)',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'dibujo',
    word: 'el dibujo',
    wordAr: 'الرسم',
    emoji: '🎨',
    sentenceEs: 'Me gusta el dibujo',
    sentenceAr: 'بحب الرسم',
    sentenceWords: ['Me', 'gusta', 'el', 'dibujo'],
    category: 'Pasatiempo',
    categoryAr: 'هوايات',
    grammarHint: {
      pattern: 'Me gusta + el + هواية',
      rule: 'dibujo مذكر → el dibujo',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'baile',
    word: 'el baile',
    wordAr: 'الرقص',
    emoji: '💃',
    sentenceEs: 'Me gusta bailar',
    sentenceAr: 'بحب أرقص',
    sentenceWords: ['Me', 'gusta', 'bailar'],
    category: 'Pasatiempo',
    categoryAr: 'هوايات',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'bailar = فعل الرقص (المصدر)',
    },
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },

  // ═══════════ Group 3: En el Estadio (في الملعب) ═══════════
  {
    id: 'equipo',
    word: 'el equipo',
    wordAr: 'الفريق',
    emoji: '👥',
    sentenceEs: 'Mi equipo gana',
    sentenceAr: 'فريقي بيكسب',
    sentenceWords: ['Mi', 'equipo', 'gana'],
    category: 'Estadio',
    categoryAr: 'الملعب',
    grammarHint: {
      pattern: 'Mi + اسم + فعل',
      rule: 'Mi معناها "بتاعي/ي" (ملكية)',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'partido',
    word: 'el partido',
    wordAr: 'المباراة',
    emoji: '🏟️',
    sentenceEs: 'Veo el partido',
    sentenceAr: 'أشاهد المباراة',
    sentenceWords: ['Veo', 'el', 'partido'],
    category: 'Estadio',
    categoryAr: 'الملعب',
    grammarHint: {
      pattern: 'Veo + el + اسم',
      rule: 'Veo = أشاهد - من فعل ver',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'gol',
    word: 'el gol',
    wordAr: 'الجول',
    emoji: '🥅',
    sentenceEs: '¡Gol! ¡Gol!',
    sentenceAr: 'جول! جول!',
    sentenceWords: ['Gol', 'Gol'],
    category: 'Estadio',
    categoryAr: 'الملعب',
    grammarHint: {
      pattern: '¡Gol!',
      rule: 'كلمة الفرحة في الملعب!',
    },
    note: 'من علامات التعجب ¡ ! في الأسبانية',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'ganar',
    word: 'ganar',
    wordAr: 'يفوز',
    emoji: '🏆',
    sentenceEs: 'Quiero ganar',
    sentenceAr: 'عايز أفوز',
    sentenceWords: ['Quiero', 'ganar'],
    category: 'Estadio',
    categoryAr: 'الملعب',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'Quiero = عايز - من فعل querer',
    },
    color: '#FFD700',
    gradient: ['#FDE047', '#B45309'],
  },
  {
    id: 'jugar',
    word: 'jugar',
    wordAr: 'يلعب',
    emoji: '🎯',
    sentenceEs: 'Me gusta jugar',
    sentenceAr: 'بحب ألعب',
    sentenceWords: ['Me', 'gusta', 'jugar'],
    category: 'Estadio',
    categoryAr: 'الملعب',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'jugar = فعل اللعب (المصدر)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishSportsGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishSportsItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_SPORTS_GROUPS: SpanishSportsGroup[] = [
  {
    id: 'group-deportes',
    titleEs: 'Deportes Populares',
    titleAr: 'الرياضات الشهيرة',
    emoji: '⚽',
    items: SPANISH_SPORTS_ITEMS.filter(i => i.category === 'Deporte'),
    grammarFocus: {
      pattern: 'Juego al / Me gusta / Practico',
      description: 'رياضات بالكرة → Juego al | بدون كرة → Me gusta',
    },
  },
  {
    id: 'group-pasatiempos',
    titleEs: 'Pasatiempos',
    titleAr: 'الهوايات',
    emoji: '🎨',
    items: SPANISH_SPORTS_ITEMS.filter(i => i.category === 'Pasatiempo'),
    grammarFocus: {
      pattern: 'Me gusta + هواية / Escucho / Juego',
      description: 'أفعال متنوعة للتعبير عن الهوايات',
    },
  },
  {
    id: 'group-estadio',
    titleEs: 'En el Estadio',
    titleAr: 'في الملعب',
    emoji: '🏟️',
    items: SPANISH_SPORTS_ITEMS.filter(i => i.category === 'Estadio'),
    grammarFocus: {
      pattern: 'Mi + اسم / Veo / Quiero + فعل',
      description: 'كلمات وأفعال المباراة والفريق',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishSportsChoices(
  correctWord: string,
  count: number = 3
): SpanishSportsItem[] {
  const correct = SPANISH_SPORTS_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_SPORTS_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateSportsSentenceWordPool(
  item: SpanishSportsItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_SPORTS_ITEMS.filter(i => i.id !== item.id);
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

export function checkSportsSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
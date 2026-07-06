// ═══════════════════════════════════════════════════════════
// 🖼️ Spanish Arte y Cultura Lesson Data
// 🏛️ Museo del Prado - Map 5, Lesson 3
// ═══════════════════════════════════════════════════════════

export interface SpanishArteItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Clasico' | 'Cultura' | 'Museo';
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

export const SPANISH_ARTE_ITEMS: SpanishArteItem[] = [
  // ═══════════ Group 1: Arte Clásico (الفن الكلاسيكي) ═══════════
  {
    id: 'cuadro',
    word: 'el cuadro',
    wordAr: 'اللوحة',
    emoji: '🖼️',
    sentenceEs: 'Miro un cuadro',
    sentenceAr: 'باتفرج على لوحة',
    sentenceWords: ['Miro', 'un', 'cuadro'],
    category: 'Clasico',
    categoryAr: 'فن كلاسيكي',
    grammarHint: {
      pattern: 'Miro + un + مذكر',
      rule: 'Miro = باتفرج - من فعل mirar',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'pintor',
    word: 'el pintor',
    wordAr: 'الرسام',
    emoji: '👨‍🎨',
    sentenceEs: 'Picasso es pintor',
    sentenceAr: 'بيكاسو رسام',
    sentenceWords: ['Picasso', 'es', 'pintor'],
    category: 'Clasico',
    categoryAr: 'فن كلاسيكي',
    grammarHint: {
      pattern: 'اسم + es + مهنة',
      rule: 'للبنت: pintora',
    },
    note: 'للبنت: pintora',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'escultura',
    word: 'la escultura',
    wordAr: 'التمثال',
    emoji: '🗿',
    sentenceEs: 'Es una escultura',
    sentenceAr: 'ده تمثال',
    sentenceWords: ['Es', 'una', 'escultura'],
    category: 'Clasico',
    categoryAr: 'فن كلاسيكي',
    grammarHint: {
      pattern: 'Es + una + مؤنث',
      rule: 'escultura مؤنثة → una escultura',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'retrato',
    word: 'el retrato',
    wordAr: 'البورتريه',
    emoji: '🖼️',
    sentenceEs: 'Es un retrato famoso',
    sentenceAr: 'ده بورتريه مشهور',
    sentenceWords: ['Es', 'un', 'retrato', 'famoso'],
    category: 'Clasico',
    categoryAr: 'فن كلاسيكي',
    grammarHint: {
      pattern: 'Es + un + مذكر + صفة',
      rule: 'retrato = صورة شخصية بالرسم',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'paisaje',
    word: 'el paisaje',
    wordAr: 'المنظر الطبيعي',
    emoji: '🌄',
    sentenceEs: 'Un paisaje bonito',
    sentenceAr: 'منظر طبيعي جميل',
    sentenceWords: ['Un', 'paisaje', 'bonito'],
    category: 'Clasico',
    categoryAr: 'فن كلاسيكي',
    grammarHint: {
      pattern: 'Un + مذكر + صفة',
      rule: 'paisaje = المنظر الطبيعي في اللوحة',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },

  // ═══════════ Group 2: Cultura Española (الثقافة الأسبانية) ═══════════
  {
    id: 'flamenco',
    word: 'el flamenco',
    wordAr: 'الفلامنكو',
    emoji: '💃',
    sentenceEs: 'Me encanta el flamenco',
    sentenceAr: 'بحب الفلامنكو أوي',
    sentenceWords: ['Me', 'encanta', 'el', 'flamenco'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'Me encanta + el + اسم',
      rule: 'Me encanta = بحب أوي (أقوى من Me gusta)',
    },
    note: 'Me encanta أقوى من Me gusta',
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
  {
    id: 'guitarra',
    word: 'la guitarra',
    wordAr: 'الجيتار',
    emoji: '🎸',
    sentenceEs: 'Toco la guitarra',
    sentenceAr: 'بالعب جيتار',
    sentenceWords: ['Toco', 'la', 'guitarra'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'Toco + la + آلة',
      rule: 'Toco = بالعب/باعزف - من فعل tocar',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'teatro',
    word: 'el teatro',
    wordAr: 'المسرح',
    emoji: '🎭',
    sentenceEs: 'Voy al teatro',
    sentenceAr: 'رايح المسرح',
    sentenceWords: ['Voy', 'al', 'teatro'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'Voy al + مذكر',
      rule: 'al = a + el (اختصار مع المذكر)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'opera',
    word: 'la ópera',
    wordAr: 'الأوبرا',
    emoji: '🎼',
    sentenceEs: 'Escucho ópera',
    sentenceAr: 'باسمع أوبرا',
    sentenceWords: ['Escucho', 'ópera'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'Escucho + اسم',
      rule: 'ópera بفتحة على الـ ó',
    },
    note: 'ópera بفتحة على الـ ó',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'escritor',
    word: 'el escritor',
    wordAr: 'الكاتب',
    emoji: '✍️',
    sentenceEs: 'Cervantes es escritor',
    sentenceAr: 'سيرفانتس كاتب',
    sentenceWords: ['Cervantes', 'es', 'escritor'],
    category: 'Cultura',
    categoryAr: 'ثقافة',
    grammarHint: {
      pattern: 'اسم + es + مهنة',
      rule: 'للبنت: escritora',
    },
    note: 'للبنت: escritora',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },

  // ═══════════ Group 3: En el Museo (في المتحف) ═══════════
  {
    id: 'museo',
    word: 'el museo',
    wordAr: 'المتحف',
    emoji: '🏛️',
    sentenceEs: 'Visito el museo',
    sentenceAr: 'بازور المتحف',
    sentenceWords: ['Visito', 'el', 'museo'],
    category: 'Museo',
    categoryAr: 'متحف',
    grammarHint: {
      pattern: 'Visito + el + مذكر',
      rule: 'Visito = بازور - من فعل visitar',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'admirar',
    word: 'admirar',
    wordAr: 'يعجب بـ',
    emoji: '🤩',
    sentenceEs: 'Admiro el arte',
    sentenceAr: 'باعجب بالفن',
    sentenceWords: ['Admiro', 'el', 'arte'],
    category: 'Museo',
    categoryAr: 'متحف',
    grammarHint: {
      pattern: 'Admiro + el + اسم',
      rule: 'Admiro = باعجب بـ - من فعل admirar',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'obra',
    word: 'la obra',
    wordAr: 'العمل الفني',
    emoji: '🎨',
    sentenceEs: 'Una obra maestra',
    sentenceAr: 'تحفة فنية',
    sentenceWords: ['Una', 'obra', 'maestra'],
    category: 'Museo',
    categoryAr: 'متحف',
    grammarHint: {
      pattern: 'Una + مؤنث + صفة',
      rule: 'obra maestra = تحفة فنية',
    },
    note: 'obra maestra = masterpiece',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'famoso-arte',
    word: 'famoso',
    wordAr: 'مشهور',
    emoji: '⭐',
    sentenceEs: 'Es muy famoso',
    sentenceAr: 'ده مشهور أوي',
    sentenceWords: ['Es', 'muy', 'famoso'],
    category: 'Museo',
    categoryAr: 'متحف',
    grammarHint: {
      pattern: 'Es + muy + صفة',
      rule: 'للمؤنث: famosa',
    },
    note: 'للمؤنث: famosa',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'maravilloso',
    word: 'maravilloso',
    wordAr: 'رائع جداً',
    emoji: '😍',
    sentenceEs: '¡Es maravilloso!',
    sentenceAr: 'ده رائع جداً!',
    sentenceWords: ['Es', 'maravilloso'],
    category: 'Museo',
    categoryAr: 'متحف',
    grammarHint: {
      pattern: '¡Es + صفة قوية!',
      rule: 'للمؤنث: maravillosa',
    },
    note: 'للمؤنث: maravillosa',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishArteGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishArteItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_ARTE_GROUPS: SpanishArteGroup[] = [
  {
    id: 'group-clasico',
    titleEs: 'Arte Clásico',
    titleAr: 'الفن الكلاسيكي',
    emoji: '🎨',
    items: SPANISH_ARTE_ITEMS.filter(i => i.category === 'Clasico'),
    grammarFocus: {
      pattern: 'Es + un/una + اسم + صفة',
      description: 'وصف اللوحات والفنانين',
    },
  },
  {
    id: 'group-cultura',
    titleEs: 'Cultura Española',
    titleAr: 'الثقافة الأسبانية',
    emoji: '🎭',
    items: SPANISH_ARTE_ITEMS.filter(i => i.category === 'Cultura'),
    grammarFocus: {
      pattern: 'Me encanta / Toco / Escucho + اسم',
      description: 'Me encanta = بحب أوي (أقوى من Me gusta)',
    },
  },
  {
    id: 'group-museo',
    titleEs: 'En el Museo',
    titleAr: 'في المتحف',
    emoji: '🏛️',
    items: SPANISH_ARTE_ITEMS.filter(i => i.category === 'Museo'),
    grammarFocus: {
      pattern: 'Visito / Admiro + اسم / Es + muy + صفة',
      description: 'التعبير عن الإعجاب في المتحف',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishArteChoices(
  correctWord: string,
  count: number = 3
): SpanishArteItem[] {
  const correct = SPANISH_ARTE_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_ARTE_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateArteSentenceWordPool(
  item: SpanishArteItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_ARTE_ITEMS.filter(i => i.id !== item.id);
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

export function checkArteSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
// ═══════════════════════════════════════════════════════════
// 🎬 Spanish Entertainment Lesson Data
// 🎥 Festival de Cine de Málaga - Map 4, Lesson 4
// ═══════════════════════════════════════════════════════════

export interface SpanishEntertainmentItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Cine' | 'Casa' | 'Diversion';
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

export const SPANISH_ENTERTAINMENT_ITEMS: SpanishEntertainmentItem[] = [
  // ═══════════ Group 1: En el Cine (في السينما) ═══════════
  {
    id: 'pelicula',
    word: 'la película',
    wordAr: 'الفيلم',
    emoji: '🎬',
    sentenceEs: 'Veo una película',
    sentenceAr: 'باتفرج على فيلم',
    sentenceWords: ['Veo', 'una', 'película'],
    category: 'Cine',
    categoryAr: 'في السينما',
    grammarHint: {
      pattern: 'Veo + una + مؤنث',
      rule: 'Veo = باتفرج - من فعل ver',
    },
    note: 'película بفتحة على الـ í',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },
  {
    id: 'actor',
    word: 'el actor',
    wordAr: 'الممثل',
    emoji: '🎭',
    sentenceEs: 'Es un actor famoso',
    sentenceAr: 'ده ممثل مشهور',
    sentenceWords: ['Es', 'un', 'actor', 'famoso'],
    category: 'Cine',
    categoryAr: 'في السينما',
    grammarHint: {
      pattern: 'Es + un + مذكر + صفة',
      rule: 'famoso = مشهور (للمؤنث: famosa)',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'actriz',
    word: 'la actriz',
    wordAr: 'الممثلة',
    emoji: '👸',
    sentenceEs: 'Ella es actriz',
    sentenceAr: 'هي ممثلة',
    sentenceWords: ['Ella', 'es', 'actriz'],
    category: 'Cine',
    categoryAr: 'في السينما',
    grammarHint: {
      pattern: 'Ella + es + مهنة',
      rule: 'Ella = هي / actriz = مهنة بدون un/una',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'director',
    word: 'el director',
    wordAr: 'المخرج',
    emoji: '🎥',
    sentenceEs: 'El director es bueno',
    sentenceAr: 'المخرج شاطر',
    sentenceWords: ['El', 'director', 'es', 'bueno'],
    category: 'Cine',
    categoryAr: 'في السينما',
    grammarHint: {
      pattern: 'El + اسم + es + صفة',
      rule: 'bueno = شاطر/كويس (للمؤنث: buena)',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'entrada',
    word: 'la entrada',
    wordAr: 'التذكرة',
    emoji: '🎫',
    sentenceEs: 'Compro una entrada',
    sentenceAr: 'باشتري تذكرة',
    sentenceWords: ['Compro', 'una', 'entrada'],
    category: 'Cine',
    categoryAr: 'في السينما',
    grammarHint: {
      pattern: 'Compro + una + مؤنث',
      rule: 'entrada = تذكرة الدخول',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },

  // ═══════════ Group 2: En Casa (في البيت) ═══════════
  {
    id: 'television',
    word: 'la televisión',
    wordAr: 'التلفزيون',
    emoji: '📺',
    sentenceEs: 'Miro la televisión',
    sentenceAr: 'باتفرج على التلفزيون',
    sentenceWords: ['Miro', 'la', 'televisión'],
    category: 'Casa',
    categoryAr: 'في البيت',
    grammarHint: {
      pattern: 'Miro + la + مؤنث',
      rule: 'Miro = باتفرج - من فعل mirar',
    },
    note: 'televisión بفتحة على الـ ó',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'programa',
    word: 'el programa',
    wordAr: 'البرنامج',
    emoji: '📻',
    sentenceEs: 'Veo el programa',
    sentenceAr: 'باتفرج على البرنامج',
    sentenceWords: ['Veo', 'el', 'programa'],
    category: 'Casa',
    categoryAr: 'في البيت',
    grammarHint: {
      pattern: 'Veo + el + مذكر',
      rule: 'programa مذكر رغم انتهائه بـ a',
    },
    note: 'programa مذكر: el programa',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'dibujos',
    word: 'los dibujos',
    wordAr: 'الكرتون',
    emoji: '🎨',
    sentenceEs: 'Me gustan los dibujos',
    sentenceAr: 'بحب الكرتون',
    sentenceWords: ['Me', 'gustan', 'los', 'dibujos'],
    category: 'Casa',
    categoryAr: 'في البيت',
    grammarHint: {
      pattern: 'Me gustan + los + جمع',
      rule: 'مع الجمع: gustan (مش gusta)',
    },
    note: 'dibujos جمع → gustan (مش gusta)',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'libro-ent',
    word: 'el libro',
    wordAr: 'الكتاب',
    emoji: '📚',
    sentenceEs: 'Leo un libro',
    sentenceAr: 'باقرا كتاب',
    sentenceWords: ['Leo', 'un', 'libro'],
    category: 'Casa',
    categoryAr: 'في البيت',
    grammarHint: {
      pattern: 'Leo + un + مذكر',
      rule: 'Leo = باقرا - من فعل leer',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'juego',
    word: 'el juego',
    wordAr: 'اللعبة',
    emoji: '🎮',
    sentenceEs: 'Juego un juego',
    sentenceAr: 'بالعب لعبة',
    sentenceWords: ['Juego', 'un', 'juego'],
    category: 'Casa',
    categoryAr: 'في البيت',
    grammarHint: {
      pattern: 'Juego + un + اسم',
      rule: 'Juego = بالعب (فعل) / juego = لعبة (اسم)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },

  // ═══════════ Group 3: Diversión (المتعة) ═══════════
  {
    id: 'divertido',
    word: 'divertido',
    wordAr: 'ممتع',
    emoji: '😄',
    sentenceEs: 'Es muy divertido',
    sentenceAr: 'ده ممتع أوي',
    sentenceWords: ['Es', 'muy', 'divertido'],
    category: 'Diversion',
    categoryAr: 'المتعة',
    grammarHint: {
      pattern: 'Es + muy + صفة',
      rule: 'muy = أوي / للمؤنث: divertida',
    },
    note: 'للمؤنث: divertida',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'aburrido',
    word: 'aburrido',
    wordAr: 'ممل',
    emoji: '😴',
    sentenceEs: 'Es aburrido',
    sentenceAr: 'ده ممل',
    sentenceWords: ['Es', 'aburrido'],
    category: 'Diversion',
    categoryAr: 'المتعة',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: aburrida',
    },
    note: 'للمؤنث: aburrida',
    color: '#6366F1',
    gradient: ['#818CF8', '#4338CA'],
  },
  {
    id: 'interesante',
    word: 'interesante',
    wordAr: 'مثير',
    emoji: '🤩',
    sentenceEs: 'Es interesante',
    sentenceAr: 'ده مثير',
    sentenceWords: ['Es', 'interesante'],
    category: 'Diversion',
    categoryAr: 'المتعة',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'interesante لا تتغير مع الجنس',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'reir',
    word: 'reír',
    wordAr: 'يضحك',
    emoji: '😂',
    sentenceEs: 'Me gusta reír',
    sentenceAr: 'بحب أضحك',
    sentenceWords: ['Me', 'gusta', 'reír'],
    category: 'Diversion',
    categoryAr: 'المتعة',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'reír = يضحك (المصدر)',
    },
    note: 'reír بفتحة على الـ í',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'sonar',
    word: 'soñar',
    wordAr: 'يحلم',
    emoji: '💭',
    sentenceEs: 'Quiero soñar',
    sentenceAr: 'عايز أحلم',
    sentenceWords: ['Quiero', 'soñar'],
    category: 'Diversion',
    categoryAr: 'المتعة',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'soñar بحرف ñ (ينطق ني)',
    },
    note: 'ñ بينطق "ني"',
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishEntertainmentGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishEntertainmentItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_ENTERTAINMENT_GROUPS: SpanishEntertainmentGroup[] = [
  {
    id: 'group-cine',
    titleEs: 'En el Cine',
    titleAr: 'في السينما',
    emoji: '🎬',
    items: SPANISH_ENTERTAINMENT_ITEMS.filter(i => i.category === 'Cine'),
    grammarFocus: {
      pattern: 'Veo / Compro / Es + un/una + اسم',
      description: 'أفعال السينما + التعريف بالممثلين',
    },
  },
  {
    id: 'group-casa',
    titleEs: 'En Casa',
    titleAr: 'في البيت',
    emoji: '📺',
    items: SPANISH_ENTERTAINMENT_ITEMS.filter(i => i.category === 'Casa'),
    grammarFocus: {
      pattern: 'Miro / Veo / Leo / Juego + اسم',
      description: 'أفعال الترفيه المنزلي (تلفزيون، كتب، ألعاب)',
    },
  },
  {
    id: 'group-diversion',
    titleEs: 'Diversión',
    titleAr: 'المتعة',
    emoji: '🎉',
    items: SPANISH_ENTERTAINMENT_ITEMS.filter(i => i.category === 'Diversion'),
    grammarFocus: {
      pattern: 'Es + صفة / Me gusta + فعل',
      description: 'وصف الأشياء والأفعال الممتعة',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishEntertainmentChoices(
  correctWord: string,
  count: number = 3
): SpanishEntertainmentItem[] {
  const correct = SPANISH_ENTERTAINMENT_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_ENTERTAINMENT_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateEntertainmentSentenceWordPool(
  item: SpanishEntertainmentItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_ENTERTAINMENT_ITEMS.filter(i => i.id !== item.id);
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

export function checkEntertainmentSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
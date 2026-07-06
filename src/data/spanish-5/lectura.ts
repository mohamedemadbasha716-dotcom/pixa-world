// ═══════════════════════════════════════════════════════════
// 📚 Spanish Lectura y Escritura Lesson Data
// 🏛️ Biblioteca Nacional - Map 5, Lesson 7
// ═══════════════════════════════════════════════════════════

export interface SpanishLecturaItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Biblioteca' | 'Escribir' | 'Aprender';
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

export const SPANISH_LECTURA_ITEMS: SpanishLecturaItem[] = [
  // ═══════════ Group 1: En la Biblioteca (في المكتبة) ═══════════
  {
    id: 'libro-lectura',
    word: 'el libro',
    wordAr: 'الكتاب',
    emoji: '📕',
    sentenceEs: 'Leo un libro',
    sentenceAr: 'باقرا كتاب',
    sentenceWords: ['Leo', 'un', 'libro'],
    category: 'Biblioteca',
    categoryAr: 'مكتبة',
    grammarHint: {
      pattern: 'Leo + un + مذكر',
      rule: 'Leo = باقرا - من فعل leer',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'pagina',
    word: 'la página',
    wordAr: 'الصفحة',
    emoji: '📄',
    sentenceEs: 'Paso la página',
    sentenceAr: 'باقلب الصفحة',
    sentenceWords: ['Paso', 'la', 'página'],
    category: 'Biblioteca',
    categoryAr: 'مكتبة',
    grammarHint: {
      pattern: 'Paso + la + مؤنث',
      rule: 'Paso = باقلب - من فعل pasar',
    },
    note: 'página بفتحة على الـ á',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'cuento',
    word: 'el cuento',
    wordAr: 'القصة',
    emoji: '📖',
    sentenceEs: 'Es un cuento bonito',
    sentenceAr: 'ده قصة جميلة',
    sentenceWords: ['Es', 'un', 'cuento', 'bonito'],
    category: 'Biblioteca',
    categoryAr: 'مكتبة',
    grammarHint: {
      pattern: 'Es + un + مذكر + صفة',
      rule: 'cuento = قصة قصيرة',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'novela',
    word: 'la novela',
    wordAr: 'الرواية',
    emoji: '📚',
    sentenceEs: 'Me gusta la novela',
    sentenceAr: 'بحب الرواية',
    sentenceWords: ['Me', 'gusta', 'la', 'novela'],
    category: 'Biblioteca',
    categoryAr: 'مكتبة',
    grammarHint: {
      pattern: 'Me gusta + la + مؤنث',
      rule: 'novela = رواية طويلة',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'diccionario',
    word: 'el diccionario',
    wordAr: 'القاموس',
    emoji: '📔',
    sentenceEs: 'Uso el diccionario',
    sentenceAr: 'باستخدم القاموس',
    sentenceWords: ['Uso', 'el', 'diccionario'],
    category: 'Biblioteca',
    categoryAr: 'مكتبة',
    grammarHint: {
      pattern: 'Uso + el + مذكر',
      rule: 'diccionario = قاموس اللغة',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  // ═══════════ Group 2: Escribir (الكتابة) ═══════════
  {
    id: 'escribir',
    word: 'escribir',
    wordAr: 'يكتب',
    emoji: '✍️',
    sentenceEs: 'Me gusta escribir',
    sentenceAr: 'بحب أكتب',
    sentenceWords: ['Me', 'gusta', 'escribir'],
    category: 'Escribir',
    categoryAr: 'كتابة',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'escribir = يكتب (المصدر)',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'papel-lectura',
    word: 'el papel',
    wordAr: 'الورق',
    emoji: '📃',
    sentenceEs: 'Necesito papel',
    sentenceAr: 'محتاج ورق',
    sentenceWords: ['Necesito', 'papel'],
    category: 'Escribir',
    categoryAr: 'كتابة',
    grammarHint: {
      pattern: 'Necesito + اسم',
      rule: 'Necesito = محتاج',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'boligrafo',
    word: 'el bolígrafo',
    wordAr: 'القلم',
    emoji: '🖊️',
    sentenceEs: 'Uso un bolígrafo',
    sentenceAr: 'باستخدم قلم',
    sentenceWords: ['Uso', 'un', 'bolígrafo'],
    category: 'Escribir',
    categoryAr: 'كتابة',
    grammarHint: {
      pattern: 'Uso + un + مذكر',
      rule: 'bolígrafo بفتحة على الـ í',
    },
    note: 'bolígrafo بفتحة على الـ í',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'palabra',
    word: 'la palabra',
    wordAr: 'الكلمة',
    emoji: '💭',
    sentenceEs: 'Aprendo una palabra',
    sentenceAr: 'باتعلم كلمة',
    sentenceWords: ['Aprendo', 'una', 'palabra'],
    category: 'Escribir',
    categoryAr: 'كتابة',
    grammarHint: {
      pattern: 'Aprendo + una + مؤنث',
      rule: 'Aprendo = باتعلم - من فعل aprender',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'frase',
    word: 'la frase',
    wordAr: 'الجملة',
    emoji: '📝',
    sentenceEs: 'Escribo una frase',
    sentenceAr: 'باكتب جملة',
    sentenceWords: ['Escribo', 'una', 'frase'],
    category: 'Escribir',
    categoryAr: 'كتابة',
    grammarHint: {
      pattern: 'Escribo + una + مؤنث',
      rule: 'Escribo = باكتب - من فعل escribir',
    },
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },

  // ═══════════ Group 3: Aprender (التعلم) ═══════════
  {
    id: 'aprender',
    word: 'aprender',
    wordAr: 'يتعلم',
    emoji: '🎓',
    sentenceEs: 'Quiero aprender',
    sentenceAr: 'عايز أتعلم',
    sentenceWords: ['Quiero', 'aprender'],
    category: 'Aprender',
    categoryAr: 'تعلم',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'aprender = يتعلم (المصدر)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'ensenar',
    word: 'enseñar',
    wordAr: 'يعلّم',
    emoji: '👨‍🏫',
    sentenceEs: 'El profesor enseña',
    sentenceAr: 'المعلم بيدرّس',
    sentenceWords: ['El', 'profesor', 'enseña'],
    category: 'Aprender',
    categoryAr: 'تعلم',
    grammarHint: {
      pattern: 'El + شخص + فعل',
      rule: 'enseñar بحرف ñ (ينطق ني)',
    },
    note: 'enseñar بحرف ñ',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'leccion',
    word: 'la lección',
    wordAr: 'الدرس',
    emoji: '📚',
    sentenceEs: 'Estudio la lección',
    sentenceAr: 'بادرس الدرس',
    sentenceWords: ['Estudio', 'la', 'lección'],
    category: 'Aprender',
    categoryAr: 'تعلم',
    grammarHint: {
      pattern: 'Estudio + la + مؤنث',
      rule: 'lección بفتحة على الـ ó',
    },
    note: 'lección بفتحة على الـ ó',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'interesante-lectura',
    word: 'interesante',
    wordAr: 'مثير',
    emoji: '🤩',
    sentenceEs: 'Es interesante',
    sentenceAr: 'ده مثير',
    sentenceWords: ['Es', 'interesante'],
    category: 'Aprender',
    categoryAr: 'تعلم',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'interesante لا تتغير مع الجنس',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'inteligente',
    word: 'inteligente',
    wordAr: 'ذكي',
    emoji: '🧠',
    sentenceEs: 'Eres inteligente',
    sentenceAr: 'أنت ذكي',
    sentenceWords: ['Eres', 'inteligente'],
    category: 'Aprender',
    categoryAr: 'تعلم',
    grammarHint: {
      pattern: 'Eres + صفة',
      rule: 'Eres = أنت (من فعل ser)',
    },
    note: 'inteligente لا تتغير مع الجنس',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishLecturaGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishLecturaItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_LECTURA_GROUPS: SpanishLecturaGroup[] = [
  {
    id: 'group-biblioteca',
    titleEs: 'En la Biblioteca',
    titleAr: 'في المكتبة',
    emoji: '📖',
    items: SPANISH_LECTURA_ITEMS.filter(i => i.category === 'Biblioteca'),
    grammarFocus: {
      pattern: 'Leo / Uso / Paso + كتاب',
      description: 'أفعال القراءة والمكتبة',
    },
  },
  {
    id: 'group-escribir',
    titleEs: 'Escribir',
    titleAr: 'الكتابة',
    emoji: '✍️',
    items: SPANISH_LECTURA_ITEMS.filter(i => i.category === 'Escribir'),
    grammarFocus: {
      pattern: 'Necesito / Uso / Aprendo / Escribo',
      description: 'أدوات وأفعال الكتابة',
    },
  },
  {
    id: 'group-aprender',
    titleEs: 'Aprender',
    titleAr: 'التعلم',
    emoji: '🎓',
    items: SPANISH_LECTURA_ITEMS.filter(i => i.category === 'Aprender'),
    grammarFocus: {
      pattern: 'Quiero / Estudio + فعل/اسم',
      description: 'أفعال التعلم والتعليم',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishLecturaChoices(
  correctWord: string,
  count: number = 3
): SpanishLecturaItem[] {
  const correct = SPANISH_LECTURA_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_LECTURA_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateLecturaSentenceWordPool(
  item: SpanishLecturaItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_LECTURA_ITEMS.filter(i => i.id !== item.id);
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

export function checkLecturaSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
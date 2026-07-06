// ═══════════════════════════════════════════════════════════
// 🎨 Spanish Art Lesson Data
// 🖼️ Museo Dalí - Map 3, Lesson 7
// ═══════════════════════════════════════════════════════════

export interface SpanishArtItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Herramienta' | 'TipoArte' | 'Color';
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

export const SPANISH_ART_ITEMS: SpanishArtItem[] = [
  // ═══════════ Group 1: Herramientas de Arte (أدوات الفن) ═══════════
  {
    id: 'pincel',
    word: 'el pincel',
    wordAr: 'الفرشاة',
    emoji: '🖌️',
    sentenceEs: 'Uso un pincel',
    sentenceAr: 'باستخدم فرشاة',
    sentenceWords: ['Uso', 'un', 'pincel'],
    category: 'Herramienta',
    categoryAr: 'أدوات فن',
    grammarHint: {
      pattern: 'Uso + un + مذكر',
      rule: 'Uso = باستخدم - من فعل usar',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'pintura',
    word: 'la pintura',
    wordAr: 'الطلاء',
    emoji: '🎨',
    sentenceEs: 'Uso pintura',
    sentenceAr: 'باستخدم طلاء',
    sentenceWords: ['Uso', 'pintura'],
    category: 'Herramienta',
    categoryAr: 'أدوات فن',
    grammarHint: {
      pattern: 'Uso + اسم',
      rule: 'pintura = الدهان/الطلاء أو اللوحة',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'lapiz-art',
    word: 'el lápiz',
    wordAr: 'القلم الرصاص',
    emoji: '✏️',
    sentenceEs: 'Dibujo con lápiz',
    sentenceAr: 'برسم بالقلم الرصاص',
    sentenceWords: ['Dibujo', 'con', 'lápiz'],
    category: 'Herramienta',
    categoryAr: 'أدوات فن',
    grammarHint: {
      pattern: 'Dibujo con + أداة',
      rule: 'Dibujo = برسم / con = بـ (بواسطة)',
    },
    note: 'lápiz بفتحة على الـ á',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'papel',
    word: 'el papel',
    wordAr: 'الورق',
    emoji: '📄',
    sentenceEs: 'Necesito papel',
    sentenceAr: 'محتاج ورق',
    sentenceWords: ['Necesito', 'papel'],
    category: 'Herramienta',
    categoryAr: 'أدوات فن',
    grammarHint: {
      pattern: 'Necesito + اسم',
      rule: 'papel = الورق (زي paper بس بنطق مختلف)',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'color',
    word: 'el color',
    wordAr: 'اللون',
    emoji: '🌈',
    sentenceEs: 'Me gusta el color',
    sentenceAr: 'بحب اللون',
    sentenceWords: ['Me', 'gusta', 'el', 'color'],
    category: 'Herramienta',
    categoryAr: 'أدوات فن',
    grammarHint: {
      pattern: 'Me gusta + el + مذكر',
      rule: 'color مذكر → el color',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },

  // ═══════════ Group 2: Tipos de Arte (أنواع الفن) ═══════════
  {
    id: 'dibujar',
    word: 'dibujar',
    wordAr: 'يرسم',
    emoji: '✍️',
    sentenceEs: 'Me gusta dibujar',
    sentenceAr: 'بحب أرسم',
    sentenceWords: ['Me', 'gusta', 'dibujar'],
    category: 'TipoArte',
    categoryAr: 'أنواع فن',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'dibujar = يرسم (المصدر)',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'pintar',
    word: 'pintar',
    wordAr: 'يلوّن',
    emoji: '🖼️',
    sentenceEs: 'Quiero pintar',
    sentenceAr: 'عايز ألوّن',
    sentenceWords: ['Quiero', 'pintar'],
    category: 'TipoArte',
    categoryAr: 'أنواع فن',
    grammarHint: {
      pattern: 'Quiero + فعل',
      rule: 'pintar = يلوّن أو يدهن (المصدر)',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'foto',
    word: 'la foto',
    wordAr: 'الصورة',
    emoji: '📸',
    sentenceEs: 'Saco una foto',
    sentenceAr: 'باخد صورة',
    sentenceWords: ['Saco', 'una', 'foto'],
    category: 'TipoArte',
    categoryAr: 'أنواع فن',
    grammarHint: {
      pattern: 'Saco + una + مؤنث',
      rule: 'Saco una foto = باخد صورة (تعبير ثابت)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'musica-art',
    word: 'la música',
    wordAr: 'الموسيقى',
    emoji: '🎵',
    sentenceEs: 'Escucho música',
    sentenceAr: 'باسمع موسيقى',
    sentenceWords: ['Escucho', 'música'],
    category: 'TipoArte',
    categoryAr: 'أنواع فن',
    grammarHint: {
      pattern: 'Escucho + اسم',
      rule: 'Escucho = باسمع - من فعل escuchar',
    },
    note: 'música بفتحة على الـ ú',
    color: '#DB2777',
    gradient: ['#F472B6', '#9F1239'],
  },
  {
    id: 'baile-art',
    word: 'el baile',
    wordAr: 'الرقص',
    emoji: '💃',
    sentenceEs: 'Me gusta el baile',
    sentenceAr: 'بحب الرقص',
    sentenceWords: ['Me', 'gusta', 'el', 'baile'],
    category: 'TipoArte',
    categoryAr: 'أنواع فن',
    grammarHint: {
      pattern: 'Me gusta + el + مذكر',
      rule: 'baile مذكر → el baile',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },

  // ═══════════ Group 3: Colores Especiales (ألوان خاصة) ═══════════
  {
    id: 'dorado',
    word: 'dorado',
    wordAr: 'ذهبي',
    emoji: '🟡',
    sentenceEs: 'Es dorado',
    sentenceAr: 'ده ذهبي',
    sentenceWords: ['Es', 'dorado'],
    category: 'Color',
    categoryAr: 'ألوان خاصة',
    grammarHint: {
      pattern: 'Es + صفة لون',
      rule: 'للمؤنث: dorada',
    },
    note: 'للمؤنث: dorada',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'plateado',
    word: 'plateado',
    wordAr: 'فضي',
    emoji: '⚪',
    sentenceEs: 'Es plateado',
    sentenceAr: 'ده فضي',
    sentenceWords: ['Es', 'plateado'],
    category: 'Color',
    categoryAr: 'ألوان خاصة',
    grammarHint: {
      pattern: 'Es + صفة لون',
      rule: 'للمؤنث: plateada',
    },
    note: 'للمؤنث: plateada',
    color: '#94A3B8',
    gradient: ['#CBD5E1', '#475569'],
  },
  {
    id: 'brillante',
    word: 'brillante',
    wordAr: 'لامع',
    emoji: '✨',
    sentenceEs: 'Es brillante',
    sentenceAr: 'ده لامع',
    sentenceWords: ['Es', 'brillante'],
    category: 'Color',
    categoryAr: 'ألوان خاصة',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'brillante لا تتغير مع الجنس',
    },
    color: '#FBBF24',
    gradient: ['#FDE047', '#D97706'],
  },
  {
    id: 'oscuro',
    word: 'oscuro',
    wordAr: 'غامق',
    emoji: '⚫',
    sentenceEs: 'Es oscuro',
    sentenceAr: 'ده غامق',
    sentenceWords: ['Es', 'oscuro'],
    category: 'Color',
    categoryAr: 'ألوان خاصة',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: oscura',
    },
    note: 'للمؤنث: oscura',
    color: '#334155',
    gradient: ['#64748B', '#1E293B'],
  },
  {
    id: 'claro',
    word: 'claro',
    wordAr: 'فاتح',
    emoji: '⚪',
    sentenceEs: 'Es claro',
    sentenceAr: 'ده فاتح',
    sentenceWords: ['Es', 'claro'],
    category: 'Color',
    categoryAr: 'ألوان خاصة',
    grammarHint: {
      pattern: 'Es + صفة',
      rule: 'للمؤنث: clara',
    },
    note: 'للمؤنث: clara',
    color: '#E0E7FF',
    gradient: ['#F1F5F9', '#94A3B8'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishArtGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishArtItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_ART_GROUPS: SpanishArtGroup[] = [
  {
    id: 'group-herramientas',
    titleEs: 'Herramientas de Arte',
    titleAr: 'أدوات الفن',
    emoji: '🖌️',
    items: SPANISH_ART_ITEMS.filter(i => i.category === 'Herramienta'),
    grammarFocus: {
      pattern: 'Uso / Dibujo con / Necesito + أداة',
      description: 'أفعال استخدام الأدوات الفنية',
    },
  },
  {
    id: 'group-tipos',
    titleEs: 'Tipos de Arte',
    titleAr: 'أنواع الفن',
    emoji: '🎨',
    items: SPANISH_ART_ITEMS.filter(i => i.category === 'TipoArte'),
    grammarFocus: {
      pattern: 'Me gusta / Quiero + فعل فني',
      description: 'التعبير عن الحب والرغبة في الفن',
    },
  },
  {
    id: 'group-colores',
    titleEs: 'Colores Especiales',
    titleAr: 'ألوان خاصة',
    emoji: '🌈',
    items: SPANISH_ART_ITEMS.filter(i => i.category === 'Color'),
    grammarFocus: {
      pattern: 'Es + صفة لون',
      description: 'الألوان الخاصة والصفات البصرية',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishArtChoices(
  correctWord: string,
  count: number = 3
): SpanishArtItem[] {
  const correct = SPANISH_ART_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_ART_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateArtSentenceWordPool(
  item: SpanishArtItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_ART_ITEMS.filter(i => i.id !== item.id);
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

export function checkArtSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
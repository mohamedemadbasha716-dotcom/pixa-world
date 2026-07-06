// ═══════════════════════════════════════════════════════════
// 🏛️ Spanish School Lesson Data
// 🎓 Universidad de Salamanca - Map 2, Lesson 5
// ═══════════════════════════════════════════════════════════

export interface SpanishSchoolItem {
  // المعرّف
  id: string;
  
  // الكلمة الأساسية (مع أداة التعريف)
  word: string;          // مثل: "el libro"
  wordAr: string;        // مثل: "الكتاب"
  emoji: string;         // مثل: "📖"
  
  // الجملة الكاملة
  sentenceEs: string;    // مثل: "Tengo un libro"
  sentenceAr: string;    // مثل: "عندي كتاب"
  sentenceWords: string[]; // ["Tengo", "un", "libro"]
  
  // التصنيف
  category: 'Util' | 'Lugar' | 'Persona';
  categoryAr: string;
  
  // الجنس النحوي
  gender: 'M' | 'F';
  article: 'el' | 'la' | 'las';
  indefiniteArticle: 'un' | 'una' | 'unas';
  
  // الجرامر
  grammarHint: {
    pattern: string;     // مثل: "Tengo + un/una + أداة"
    rule: string;        // شرح بسيط
  };
  
  // الألوان
  color: string;
  gradient: [string, string];
}

// ═══════════════════════════════════════════════════════════
// 📚 البيانات الكاملة - 15 صنف
// ═══════════════════════════════════════════════════════════

export const SPANISH_SCHOOL_ITEMS: SpanishSchoolItem[] = [
  // ═══════════ Group 1: Útiles Escolares (الأدوات المدرسية) ═══════════
  {
    id: 'libro',
    word: 'el libro',
    wordAr: 'الكتاب',
    emoji: '📖',
    sentenceEs: 'Tengo un libro',
    sentenceAr: 'عندي كتاب',
    sentenceWords: ['Tengo', 'un', 'libro'],
    category: 'Util',
    categoryAr: 'أدوات مدرسية',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Tengo + un + مذكر',
      rule: 'Tengo معناها "عندي" - من فعل tener',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'lapiz',
    word: 'el lápiz',
    wordAr: 'القلم الرصاص',
    emoji: '✏️',
    sentenceEs: 'Tengo un lápiz',
    sentenceAr: 'عندي قلم رصاص',
    sentenceWords: ['Tengo', 'un', 'lápiz'],
    category: 'Util',
    categoryAr: 'أدوات مدرسية',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Tengo + un + مذكر',
      rule: 'lápiz بفتحة على الـ á',
    },
    color: '#FBBF24',
    gradient: ['#FCD34D', '#D97706'],
  },
  {
    id: 'boligrafo',
    word: 'el bolígrafo',
    wordAr: 'القلم الجاف',
    emoji: '🖊️',
    sentenceEs: 'Tengo un bolígrafo',
    sentenceAr: 'عندي قلم جاف',
    sentenceWords: ['Tengo', 'un', 'bolígrafo'],
    category: 'Util',
    categoryAr: 'أدوات مدرسية',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Tengo + un + مذكر',
      rule: 'bolígrafo بفتحة على الـ í',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'cuaderno',
    word: 'el cuaderno',
    wordAr: 'الكشكول',
    emoji: '📓',
    sentenceEs: 'Tengo un cuaderno',
    sentenceAr: 'عندي كشكول',
    sentenceWords: ['Tengo', 'un', 'cuaderno'],
    category: 'Util',
    categoryAr: 'أدوات مدرسية',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Tengo + un + مذكر',
      rule: 'cuaderno مذكر → un cuaderno',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'mochila',
    word: 'la mochila',
    wordAr: 'الشنطة',
    emoji: '🎒',
    sentenceEs: 'Tengo una mochila',
    sentenceAr: 'عندي شنطة',
    sentenceWords: ['Tengo', 'una', 'mochila'],
    category: 'Util',
    categoryAr: 'أدوات مدرسية',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Tengo + una + مؤنث',
      rule: 'mochila مؤنثة → una mochila',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },

  // ═══════════ Group 2: Lugares de la Escuela (أماكن في المدرسة) ═══════════
  {
    id: 'escuela',
    word: 'la escuela',
    wordAr: 'المدرسة',
    emoji: '🏫',
    sentenceEs: 'Voy a la escuela',
    sentenceAr: 'رايح المدرسة',
    sentenceWords: ['Voy', 'a', 'la', 'escuela'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Voy a + la + مؤنث',
      rule: 'Voy a معناها "رايح إلى" - من فعل ir',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'clase',
    word: 'la clase',
    wordAr: 'الفصل',
    emoji: '🚪',
    sentenceEs: 'Voy a la clase',
    sentenceAr: 'رايح الفصل',
    sentenceWords: ['Voy', 'a', 'la', 'clase'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Voy a + la + مؤنث',
      rule: 'clase مؤنثة → la clase',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'biblioteca',
    word: 'la biblioteca',
    wordAr: 'المكتبة',
    emoji: '📚',
    sentenceEs: 'Voy a la biblioteca',
    sentenceAr: 'رايح المكتبة',
    sentenceWords: ['Voy', 'a', 'la', 'biblioteca'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Voy a + la + مؤنث',
      rule: 'biblioteca = مكتبة، تشبه كلمة Bible في الإنجليزية',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'patio',
    word: 'el patio',
    wordAr: 'الفناء',
    emoji: '⚽',
    sentenceEs: 'Voy al patio',
    sentenceAr: 'رايح الفناء',
    sentenceWords: ['Voy', 'al', 'patio'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Voy al + مذكر (a + el = al)',
      rule: 'مع المذكر: a + el = al (اختصار مهم!)',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'aula',
    word: 'el aula',
    wordAr: 'القاعة',
    emoji: '🎨',
    sentenceEs: 'Voy al aula',
    sentenceAr: 'رايح القاعة',
    sentenceWords: ['Voy', 'al', 'aula'],
    category: 'Lugar',
    categoryAr: 'أماكن',
    gender: 'F',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Voy al + اسم',
      rule: 'aula استثناء: نستخدم el مع إنها مؤنث (لأنها تبدأ بـ a)',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },

  // ═══════════ Group 3: Personas y Materias (الأشخاص والمواد) ═══════════
  {
    id: 'profesor',
    word: 'el profesor',
    wordAr: 'المعلم',
    emoji: '👨‍🏫',
    sentenceEs: 'Mi profesor es bueno',
    sentenceAr: 'معلمي كويس',
    sentenceWords: ['Mi', 'profesor', 'es', 'bueno'],
    category: 'Persona',
    categoryAr: 'أشخاص',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Mi + شخص + es + صفة',
      rule: 'بدون أداة تعريف بعد Mi',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'estudiante',
    word: 'el estudiante',
    wordAr: 'الطالب',
    emoji: '👨‍🎓',
    sentenceEs: 'Soy un estudiante',
    sentenceAr: 'أنا طالب',
    sentenceWords: ['Soy', 'un', 'estudiante'],
    category: 'Persona',
    categoryAr: 'أشخاص',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Soy + un + اسم',
      rule: 'Soy معناها "أنا" - من فعل ser',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'matematicas',
    word: 'las matemáticas',
    wordAr: 'الرياضيات',
    emoji: '🔢',
    sentenceEs: 'Me gustan las matemáticas',
    sentenceAr: 'بحب الرياضيات',
    sentenceWords: ['Me', 'gustan', 'las', 'matemáticas'],
    category: 'Persona',
    categoryAr: 'مواد دراسية',
    gender: 'F',
    article: 'las',
    indefiniteArticle: 'unas',
    grammarHint: {
      pattern: 'Me gustan + las + جمع',
      rule: 'مع الجمع: gustan (مش gusta) + las',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'historia',
    word: 'la historia',
    wordAr: 'التاريخ',
    emoji: '📜',
    sentenceEs: 'Me gusta la historia',
    sentenceAr: 'بحب التاريخ',
    sentenceWords: ['Me', 'gusta', 'la', 'historia'],
    category: 'Persona',
    categoryAr: 'مواد دراسية',
    gender: 'F',
    article: 'la',
    indefiniteArticle: 'una',
    grammarHint: {
      pattern: 'Me gusta + la + مؤنث',
      rule: 'مع المفرد: gusta + la',
    },
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    id: 'arte',
    word: 'el arte',
    wordAr: 'الفن',
    emoji: '🎨',
    sentenceEs: 'Me gusta el arte',
    sentenceAr: 'بحب الفن',
    sentenceWords: ['Me', 'gusta', 'el', 'arte'],
    category: 'Persona',
    categoryAr: 'مواد دراسية',
    gender: 'M',
    article: 'el',
    indefiniteArticle: 'un',
    grammarHint: {
      pattern: 'Me gusta + el + مذكر',
      rule: 'arte مذكرة → el arte',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5 أصناف)
// ═══════════════════════════════════════════════════════════

export interface SpanishSchoolGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishSchoolItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_SCHOOL_GROUPS: SpanishSchoolGroup[] = [
  {
    id: 'group-utiles',
    titleEs: 'Útiles Escolares',
    titleAr: 'الأدوات المدرسية',
    emoji: '📚',
    items: SPANISH_SCHOOL_ITEMS.filter(s => s.category === 'Util'),
    grammarFocus: {
      pattern: 'Tengo + un/una + أداة',
      description: 'Tengo معناها "عندي" - من فعل tener',
    },
  },
  {
    id: 'group-lugares',
    titleEs: 'Lugares de la Escuela',
    titleAr: 'أماكن في المدرسة',
    emoji: '🏫',
    items: SPANISH_SCHOOL_ITEMS.filter(s => s.category === 'Lugar'),
    grammarFocus: {
      pattern: 'Voy a la / al + مكان',
      description: 'Voy a + la (مؤنث) أو al = a+el (مذكر)',
    },
  },
  {
    id: 'group-personas',
    titleEs: 'Personas y Materias',
    titleAr: 'الأشخاص والمواد',
    emoji: '👨‍🏫',
    items: SPANISH_SCHOOL_ITEMS.filter(s => s.category === 'Persona'),
    grammarFocus: {
      pattern: 'Mi / Soy / Me gusta + اسم',
      description: '3 طرق للتعبير: ملكية، تعريف نفس، إعجاب',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 توليد اختيارات عشوائية للـ Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishSchoolChoices(
  correctWord: string,
  count: number = 3
): SpanishSchoolItem[] {
  const correct = SPANISH_SCHOOL_ITEMS.find(s => s.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_SCHOOL_ITEMS.filter(s => s.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];
  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد مجموعة كلمات للـ Build Phase
// ═══════════════════════════════════════════════════════════

export function generateSchoolSentenceWordPool(
  item: SpanishSchoolItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];
  
  // نجيب كلمات من جمل تانية
  const otherItems = SPANISH_SCHOOL_ITEMS.filter(s => s.id !== item.id);
  const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(2, shuffledOthers.length); i++) {
    const randomWord = shuffledOthers[i].sentenceWords[
      Math.floor(Math.random() * shuffledOthers[i].sentenceWords.length)
    ];
    
    if (!correctWords.includes(randomWord) && !distractors.includes(randomWord)) {
      distractors.push(randomWord);
    }
  }
  
  // نخلط الكلمات
  const allWords = [...correctWords, ...distractors];
  return allWords.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// ✅ التحقق من ترتيب الجملة
// ═══════════════════════════════════════════════════════════

export function checkSchoolSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;
  
  return selectedWords.every((word, idx) => 
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
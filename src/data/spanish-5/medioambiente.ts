// ═══════════════════════════════════════════════════════════
// 🌋 Spanish Medio Ambiente Lesson Data
// 🏛️ Teide Tenerife - Map 5, Lesson 5
// ═══════════════════════════════════════════════════════════

export interface SpanishMedioAmbienteItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Naturaleza' | 'Proteger' | 'Ecologia';
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

export const SPANISH_MEDIOAMBIENTE_ITEMS: SpanishMedioAmbienteItem[] = [
  // ═══════════ Group 1: La Naturaleza (الطبيعة) ═══════════
  {
    id: 'montana',
    word: 'la montaña',
    wordAr: 'الجبل',
    emoji: '⛰️',
    sentenceEs: 'La montaña es alta',
    sentenceAr: 'الجبل عالي',
    sentenceWords: ['La', 'montaña', 'es', 'alta'],
    category: 'Naturaleza',
    categoryAr: 'طبيعة',
    grammarHint: {
      pattern: 'La + مكان + es + صفة',
      rule: 'alta = عالية (مؤنث)',
    },
    note: 'montaña بحرف ñ',
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
  {
    id: 'volcan',
    word: 'el volcán',
    wordAr: 'البركان',
    emoji: '🌋',
    sentenceEs: 'El volcán es enorme',
    sentenceAr: 'البركان ضخم',
    sentenceWords: ['El', 'volcán', 'es', 'enorme'],
    category: 'Naturaleza',
    categoryAr: 'طبيعة',
    grammarHint: {
      pattern: 'El + مكان + es + صفة',
      rule: 'volcán بفتحة على الـ á',
    },
    note: 'volcán بفتحة على الـ á',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'bosque',
    word: 'el bosque',
    wordAr: 'الغابة',
    emoji: '🌲',
    sentenceEs: 'Voy al bosque',
    sentenceAr: 'رايح الغابة',
    sentenceWords: ['Voy', 'al', 'bosque'],
    category: 'Naturaleza',
    categoryAr: 'طبيعة',
    grammarHint: {
      pattern: 'Voy al + مذكر',
      rule: 'al = a + el (اختصار مع المذكر)',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'rio-eco',
    word: 'el río',
    wordAr: 'النهر',
    emoji: '🏞️',
    sentenceEs: 'El río es largo',
    sentenceAr: 'النهر طويل',
    sentenceWords: ['El', 'río', 'es', 'largo'],
    category: 'Naturaleza',
    categoryAr: 'طبيعة',
    grammarHint: {
      pattern: 'El + مكان + es + صفة',
      rule: 'río بفتحة على الـ í',
    },
    note: 'río بفتحة على الـ í',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'tierra',
    word: 'la tierra',
    wordAr: 'الأرض',
    emoji: '🌍',
    sentenceEs: 'Cuidamos la tierra',
    sentenceAr: 'بنحمي الأرض',
    sentenceWords: ['Cuidamos', 'la', 'tierra'],
    category: 'Naturaleza',
    categoryAr: 'طبيعة',
    grammarHint: {
      pattern: 'Cuidamos + la + اسم',
      rule: 'Cuidamos = بنحمي/بنعتني (نحن)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },

  // ═══════════ Group 2: Proteger el Planeta (احمِ الكوكب) ═══════════
  {
    id: 'reciclar',
    word: 'reciclar',
    wordAr: 'يعيد التدوير',
    emoji: '♻️',
    sentenceEs: 'Vamos a reciclar',
    sentenceAr: 'يلا نعيد التدوير',
    sentenceWords: ['Vamos', 'a', 'reciclar'],
    category: 'Proteger',
    categoryAr: 'حماية',
    grammarHint: {
      pattern: 'Vamos a + فعل',
      rule: 'reciclar = يعيد التدوير (المصدر)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'basura',
    word: 'la basura',
    wordAr: 'القمامة',
    emoji: '🗑️',
    sentenceEs: 'Tiro la basura',
    sentenceAr: 'برمي القمامة',
    sentenceWords: ['Tiro', 'la', 'basura'],
    category: 'Proteger',
    categoryAr: 'حماية',
    grammarHint: {
      pattern: 'Tiro + la + اسم',
      rule: 'Tiro = برمي - من فعل tirar',
    },
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
  {
    id: 'agua-eco',
    word: 'el agua',
    wordAr: 'الماء',
    emoji: '💧',
    sentenceEs: 'Ahorro agua',
    sentenceAr: 'باوفر ماء',
    sentenceWords: ['Ahorro', 'agua'],
    category: 'Proteger',
    categoryAr: 'حماية',
    grammarHint: {
      pattern: 'Ahorro + اسم',
      rule: 'Ahorro = باوفر - من فعل ahorrar',
    },
    note: 'agua مؤنثة رغم استخدام el',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'aire',
    word: 'el aire',
    wordAr: 'الهواء',
    emoji: '💨',
    sentenceEs: 'El aire es limpio',
    sentenceAr: 'الهواء نظيف',
    sentenceWords: ['El', 'aire', 'es', 'limpio'],
    category: 'Proteger',
    categoryAr: 'حماية',
    grammarHint: {
      pattern: 'El + اسم + es + صفة',
      rule: 'limpio = نظيف (مذكر)',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'limpio',
    word: 'limpio',
    wordAr: 'نظيف',
    emoji: '✨',
    sentenceEs: 'El parque está limpio',
    sentenceAr: 'الحديقة نظيفة',
    sentenceWords: ['El', 'parque', 'está', 'limpio'],
    category: 'Proteger',
    categoryAr: 'حماية',
    grammarHint: {
      pattern: 'Está + صفة (مؤقت)',
      rule: 'للمؤنث: limpia',
    },
    note: 'للمؤنث: limpia / Está للحالة المؤقتة',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },

  // ═══════════ Group 3: Ecología (البيئة) ═══════════
  {
    id: 'planeta',
    word: 'el planeta',
    wordAr: 'الكوكب',
    emoji: '🌎',
    sentenceEs: 'Amo mi planeta',
    sentenceAr: 'بحب كوكبي',
    sentenceWords: ['Amo', 'mi', 'planeta'],
    category: 'Ecologia',
    categoryAr: 'بيئة',
    grammarHint: {
      pattern: 'Amo + mi + اسم',
      rule: 'planeta مذكر رغم انتهائه بـ a',
    },
    note: 'planeta مذكر: el planeta',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'proteger',
    word: 'proteger',
    wordAr: 'يحمي',
    emoji: '🛡️',
    sentenceEs: 'Debo proteger',
    sentenceAr: 'لازم أحمي',
    sentenceWords: ['Debo', 'proteger'],
    category: 'Ecologia',
    categoryAr: 'بيئة',
    grammarHint: {
      pattern: 'Debo + فعل',
      rule: 'Debo = لازم - من فعل deber',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'animal-eco',
    word: 'el animal',
    wordAr: 'الحيوان',
    emoji: '🦊',
    sentenceEs: 'Cuido al animal',
    sentenceAr: 'بعتني بالحيوان',
    sentenceWords: ['Cuido', 'al', 'animal'],
    category: 'Ecologia',
    categoryAr: 'بيئة',
    grammarHint: {
      pattern: 'Cuido al + مذكر',
      rule: 'مع الأشخاص/الحيوانات: نضيف a',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'verde-eco',
    word: 'verde',
    wordAr: 'أخضر',
    emoji: '🌿',
    sentenceEs: 'Un mundo verde',
    sentenceAr: 'عالم أخضر',
    sentenceWords: ['Un', 'mundo', 'verde'],
    category: 'Ecologia',
    categoryAr: 'بيئة',
    grammarHint: {
      pattern: 'Un + اسم + صفة',
      rule: 'verde لا تتغير مع الجنس',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'contaminar',
    word: 'contaminar',
    wordAr: 'يلوّث',
    emoji: '🚫',
    sentenceEs: 'No contaminar',
    sentenceAr: 'ممنوع التلوث',
    sentenceWords: ['No', 'contaminar'],
    category: 'Ecologia',
    categoryAr: 'بيئة',
    grammarHint: {
      pattern: 'No + فعل',
      rule: 'No = ممنوع/لا (النهي)',
    },
    note: 'No + فعل = النهي',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishMedioAmbienteGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishMedioAmbienteItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_MEDIOAMBIENTE_GROUPS: SpanishMedioAmbienteGroup[] = [
  {
    id: 'group-naturaleza',
    titleEs: 'La Naturaleza',
    titleAr: 'الطبيعة',
    emoji: '🌍',
    items: SPANISH_MEDIOAMBIENTE_ITEMS.filter(i => i.category === 'Naturaleza'),
    grammarFocus: {
      pattern: 'El/La + مكان + es + صفة',
      description: 'وصف عناصر الطبيعة',
    },
  },
  {
    id: 'group-proteger',
    titleEs: 'Proteger el Planeta',
    titleAr: 'احمِ الكوكب',
    emoji: '♻️',
    items: SPANISH_MEDIOAMBIENTE_ITEMS.filter(i => i.category === 'Proteger'),
    grammarFocus: {
      pattern: 'Vamos a / Tiro / Ahorro + اسم',
      description: 'أفعال الحفاظ على البيئة',
    },
  },
  {
    id: 'group-ecologia',
    titleEs: 'Ecología',
    titleAr: 'البيئة',
    emoji: '🌱',
    items: SPANISH_MEDIOAMBIENTE_ITEMS.filter(i => i.category === 'Ecologia'),
    grammarFocus: {
      pattern: 'Debo / Amo / No + فعل',
      description: 'التعبير عن الواجب والحب والنهي',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishMedioAmbienteChoices(
  correctWord: string,
  count: number = 3
): SpanishMedioAmbienteItem[] {
  const correct = SPANISH_MEDIOAMBIENTE_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_MEDIOAMBIENTE_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateMedioAmbienteSentenceWordPool(
  item: SpanishMedioAmbienteItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_MEDIOAMBIENTE_ITEMS.filter(i => i.id !== item.id);
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

export function checkMedioAmbienteSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
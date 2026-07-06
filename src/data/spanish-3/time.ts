// ═══════════════════════════════════════════════════════════
// 🕐 Spanish Time Lesson Data
// 🏛️ Torre del Reloj Port Vell - Map 3, Lesson 1
// ═══════════════════════════════════════════════════════════

export interface SpanishTimeItem {
  id: string;

  // الكلمة الأساسية
  word: string;       // مثل: "la mañana"
  wordAr: string;     // مثل: "الصباح"
  emoji: string;

  // الجملة الكاملة
  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  // التصنيف
  category: 'Momento' | 'Hora' | 'Dia';
  categoryAr: string;

  // للساعة التفاعلية (اختياري)
  clockHour?: number;      // 1-12
  clockMinute?: number;    // 0, 15, 30, 45

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

export const SPANISH_TIME_ITEMS: SpanishTimeItem[] = [
  // ═══════════ Group 1: Momentos del Día (أوقات اليوم) ═══════════
  {
    id: 'manana',
    word: 'la mañana',
    wordAr: 'الصباح',
    emoji: '🌅',
    sentenceEs: 'Es la mañana',
    sentenceAr: 'دلوقتي الصباح',
    sentenceWords: ['Es', 'la', 'mañana'],
    category: 'Momento',
    categoryAr: 'أوقات اليوم',
    clockHour: 8,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Es + la + وقت',
      rule: 'Es معناها "دلوقتي" - نستخدمها مع وقت اليوم',
    },
    color: '#F59E0B',
    gradient: ['#FCD34D', '#D97706'],
  },
  {
    id: 'tarde',
    word: 'la tarde',
    wordAr: 'بعد الظهر',
    emoji: '☀️',
    sentenceEs: 'Es la tarde',
    sentenceAr: 'دلوقتي بعد الظهر',
    sentenceWords: ['Es', 'la', 'tarde'],
    category: 'Momento',
    categoryAr: 'أوقات اليوم',
    clockHour: 3,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Es + la + وقت',
      rule: 'tarde = من بعد الظهر لحد الغروب',
    },
    color: '#FB923C',
    gradient: ['#FDBA74', '#C2410C'],
  },
  {
    id: 'noche',
    word: 'la noche',
    wordAr: 'الليل',
    emoji: '🌙',
    sentenceEs: 'Es la noche',
    sentenceAr: 'دلوقتي الليل',
    sentenceWords: ['Es', 'la', 'noche'],
    category: 'Momento',
    categoryAr: 'أوقات اليوم',
    clockHour: 9,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Es + la + وقت',
      rule: 'noche = وقت النوم من بعد الغروب',
    },
    color: '#6366F1',
    gradient: ['#818CF8', '#4338CA'],
  },
  {
    id: 'hoy',
    word: 'hoy',
    wordAr: 'النهاردة',
    emoji: '📅',
    sentenceEs: 'Hoy es lunes',
    sentenceAr: 'النهاردة الاتنين',
    sentenceWords: ['Hoy', 'es', 'lunes'],
    category: 'Momento',
    categoryAr: 'أوقات اليوم',
    grammarHint: {
      pattern: 'Hoy es + يوم',
      rule: 'Hoy = النهاردة، بنستخدمها مع اليوم',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'ahora',
    word: 'ahora',
    wordAr: 'دلوقتي',
    emoji: '⏰',
    sentenceEs: 'Ahora es tarde',
    sentenceAr: 'دلوقتي بعد الظهر',
    sentenceWords: ['Ahora', 'es', 'tarde'],
    category: 'Momento',
    categoryAr: 'أوقات اليوم',
    grammarHint: {
      pattern: 'Ahora + es + وقت',
      rule: 'Ahora = دلوقتي / في هذه اللحظة',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },

  // ═══════════ Group 2: Las Horas (الساعات) ═══════════
  {
    id: 'una',
    word: 'la una',
    wordAr: 'الساعة واحدة',
    emoji: '1️⃣',
    sentenceEs: 'Es la una',
    sentenceAr: 'الساعة واحدة',
    sentenceWords: ['Es', 'la', 'una'],
    category: 'Hora',
    categoryAr: 'الساعات',
    clockHour: 1,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Es la una',
      rule: 'استثناء! الواحدة بس بتستخدم Es (مش Son)',
    },
    note: 'استثناء مهم!',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'dos',
    word: 'las dos',
    wordAr: 'الساعة اتنين',
    emoji: '2️⃣',
    sentenceEs: 'Son las dos',
    sentenceAr: 'الساعة اتنين',
    sentenceWords: ['Son', 'las', 'dos'],
    category: 'Hora',
    categoryAr: 'الساعات',
    clockHour: 2,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Son las + رقم',
      rule: 'من الساعة اتنين لفوق: Son las',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'tres',
    word: 'las tres',
    wordAr: 'الساعة تلاتة',
    emoji: '3️⃣',
    sentenceEs: 'Son las tres',
    sentenceAr: 'الساعة تلاتة',
    sentenceWords: ['Son', 'las', 'tres'],
    category: 'Hora',
    categoryAr: 'الساعات',
    clockHour: 3,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Son las + رقم',
      rule: 'tres = 3',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'cinco',
    word: 'las cinco',
    wordAr: 'الساعة خمسة',
    emoji: '5️⃣',
    sentenceEs: 'Son las cinco',
    sentenceAr: 'الساعة خمسة',
    sentenceWords: ['Son', 'las', 'cinco'],
    category: 'Hora',
    categoryAr: 'الساعات',
    clockHour: 5,
    clockMinute: 0,
    grammarHint: {
      pattern: 'Son las + رقم',
      rule: 'cinco = 5',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'media',
    word: 'media',
    wordAr: 'ونص',
    emoji: '🕕',
    sentenceEs: 'Son las tres y media',
    sentenceAr: 'الساعة تلاتة ونص',
    sentenceWords: ['Son', 'las', 'tres', 'y', 'media'],
    category: 'Hora',
    categoryAr: 'الساعات',
    clockHour: 3,
    clockMinute: 30,
    grammarHint: {
      pattern: 'Son las + رقم + y media',
      rule: 'y media = ونص (30 دقيقة)',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },

  // ═══════════ Group 3: Días de la Semana (أيام الأسبوع) ═══════════
  {
    id: 'lunes',
    word: 'lunes',
    wordAr: 'الاتنين',
    emoji: '1️⃣',
    sentenceEs: 'Hoy es lunes',
    sentenceAr: 'النهاردة الاتنين',
    sentenceWords: ['Hoy', 'es', 'lunes'],
    category: 'Dia',
    categoryAr: 'أيام الأسبوع',
    grammarHint: {
      pattern: 'Hoy es + يوم',
      rule: 'أيام الأسبوع كلها بحرف صغير في الأسبانية',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'martes',
    word: 'martes',
    wordAr: 'التلات',
    emoji: '2️⃣',
    sentenceEs: 'Hoy es martes',
    sentenceAr: 'النهاردة التلات',
    sentenceWords: ['Hoy', 'es', 'martes'],
    category: 'Dia',
    categoryAr: 'أيام الأسبوع',
    grammarHint: {
      pattern: 'Hoy es + يوم',
      rule: 'martes = التلات (زي Mars/المريخ)',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'miercoles',
    word: 'miércoles',
    wordAr: 'الأربع',
    emoji: '3️⃣',
    sentenceEs: 'Hoy es miércoles',
    sentenceAr: 'النهاردة الأربع',
    sentenceWords: ['Hoy', 'es', 'miércoles'],
    category: 'Dia',
    categoryAr: 'أيام الأسبوع',
    grammarHint: {
      pattern: 'Hoy es + يوم',
      rule: 'انتبه للـ é (بفتحة)',
    },
    note: 'miércoles بفتحة على الـ é',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'sabado',
    word: 'sábado',
    wordAr: 'السبت',
    emoji: '🎉',
    sentenceEs: 'Hoy es sábado',
    sentenceAr: 'النهاردة السبت',
    sentenceWords: ['Hoy', 'es', 'sábado'],
    category: 'Dia',
    categoryAr: 'أيام الأسبوع',
    grammarHint: {
      pattern: 'Hoy es + يوم',
      rule: 'sábado = يوم الأجازة الأول',
    },
    note: 'sábado بفتحة على الـ á',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'domingo',
    word: 'domingo',
    wordAr: 'الحد',
    emoji: '⛪',
    sentenceEs: 'Hoy es domingo',
    sentenceAr: 'النهاردة الحد',
    sentenceWords: ['Hoy', 'es', 'domingo'],
    category: 'Dia',
    categoryAr: 'أيام الأسبوع',
    grammarHint: {
      pattern: 'Hoy es + يوم',
      rule: 'domingo = يوم الأجازة والصلاة',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishTimeGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishTimeItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_TIME_GROUPS: SpanishTimeGroup[] = [
  {
    id: 'group-momentos',
    titleEs: 'Momentos del Día',
    titleAr: 'أوقات اليوم',
    emoji: '🌅',
    items: SPANISH_TIME_ITEMS.filter(i => i.category === 'Momento'),
    grammarFocus: {
      pattern: 'Es + la/el + وقت اليوم',
      description: 'Es معناها "دلوقتي" - نستخدمها للتعبير عن الوقت الحالي',
    },
  },
  {
    id: 'group-horas',
    titleEs: 'Las Horas',
    titleAr: 'الساعات',
    emoji: '🕐',
    items: SPANISH_TIME_ITEMS.filter(i => i.category === 'Hora'),
    grammarFocus: {
      pattern: 'Es la una / Son las + رقم',
      description: 'الواحدة استثناء! باقي الساعات: Son las',
    },
  },
  {
    id: 'group-dias',
    titleEs: 'Días de la Semana',
    titleAr: 'أيام الأسبوع',
    emoji: '📅',
    items: SPANISH_TIME_ITEMS.filter(i => i.category === 'Dia'),
    grammarFocus: {
      pattern: 'Hoy es + يوم',
      description: 'Hoy = النهاردة، وأيام الأسبوع بحرف صغير',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishTimeChoices(
  correctWord: string,
  count: number = 3
): SpanishTimeItem[] {
  const correct = SPANISH_TIME_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_TIME_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateTimeSentenceWordPool(
  item: SpanishTimeItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_TIME_ITEMS.filter(i => i.id !== item.id);
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

export function checkTimeSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
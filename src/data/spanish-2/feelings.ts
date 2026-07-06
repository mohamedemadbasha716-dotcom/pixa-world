// ═══════════════════════════════════════════════════════════
// 🎨 Spanish Feelings Lesson Data
// 🎨 Museo del Greco - Map 2, Lesson 6
// ═══════════════════════════════════════════════════════════

export interface SpanishFeelingItem {
  id: string;

  // الكلمة الأساسية
  word: string;       // مثل: "feliz"
  wordAr: string;     // مثل: "سعيد"
  emoji: string;

  // الجملة الكاملة
  sentenceEs: string;     // مثل: "Estoy feliz"
  sentenceAr: string;     // مثل: "أنا سعيد"
  sentenceWords: string[];// ["Estoy", "feliz"]

  // التصنيف
  category: 'Positiva' | 'Dificil';
  categoryAr: string;

  // الجرامر
  grammarHint: {
    pattern: string;
    rule: string;
  };

  // ملاحظة بسيطة لو الكلمة بتتغير مع الجنس
  note?: string;

  // الألوان
  color: string;
  gradient: [string, string];
}

// ═══════════════════════════════════════════════════════════
// 📚 البيانات الكاملة - 8 مشاعر
// ═══════════════════════════════════════════════════════════

export const SPANISH_FEELING_ITEMS: SpanishFeelingItem[] = [
  {
    id: 'feliz',
    word: 'feliz',
    wordAr: 'سعيد',
    emoji: '😄',
    sentenceEs: 'Estoy feliz',
    sentenceAr: 'أنا سعيد',
    sentenceWords: ['Estoy', 'feliz'],
    category: 'Positiva',
    categoryAr: 'مشاعر مريحة',
    grammarHint: {
      pattern: 'Estoy + شعور',
      rule: 'Estoy معناها: أنا أشعر / أنا حاليًا',
    },
    color: '#F59E0B',
    gradient: ['#FCD34D', '#D97706'],
  },
  {
    id: 'contento',
    word: 'contento',
    wordAr: 'مبسوط',
    emoji: '😊',
    sentenceEs: 'Estoy contento',
    sentenceAr: 'أنا مبسوط',
    sentenceWords: ['Estoy', 'contento'],
    category: 'Positiva',
    categoryAr: 'مشاعر مريحة',
    grammarHint: {
      pattern: 'Estoy + صفة',
      rule: 'للبنت ممكن نقول: contenta بدل contento',
    },
    note: 'للبنت: contenta',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'tranquilo',
    word: 'tranquilo',
    wordAr: 'هادئ',
    emoji: '😌',
    sentenceEs: 'Estoy tranquilo',
    sentenceAr: 'أنا هادئ',
    sentenceWords: ['Estoy', 'tranquilo'],
    category: 'Positiva',
    categoryAr: 'مشاعر مريحة',
    grammarHint: {
      pattern: 'Estoy + صفة',
      rule: 'للبنت ممكن نقول: tranquila',
    },
    note: 'للبنت: tranquila',
    color: '#06B6D4',
    gradient: ['#67E8F9', '#0891B2'],
  },
  {
    id: 'bien',
    word: 'bien',
    wordAr: 'بخير',
    emoji: '🙂',
    sentenceEs: 'Estoy bien',
    sentenceAr: 'أنا بخير',
    sentenceWords: ['Estoy', 'bien'],
    category: 'Positiva',
    categoryAr: 'مشاعر مريحة',
    grammarHint: {
      pattern: 'Estoy + bien',
      rule: 'bien معناها: بخير / كويس',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },

  {
    id: 'triste',
    word: 'triste',
    wordAr: 'حزين',
    emoji: '😢',
    sentenceEs: 'Estoy triste',
    sentenceAr: 'أنا حزين',
    sentenceWords: ['Estoy', 'triste'],
    category: 'Dificil',
    categoryAr: 'مشاعر صعبة',
    grammarHint: {
      pattern: 'Estoy + شعور',
      rule: 'triste لا تتغير غالبًا مع ولد أو بنت',
    },
    color: '#6366F1',
    gradient: ['#818CF8', '#4338CA'],
  },
  {
    id: 'enfadado',
    word: 'enfadado',
    wordAr: 'زعلان / غاضب',
    emoji: '😠',
    sentenceEs: 'Estoy enfadado',
    sentenceAr: 'أنا زعلان',
    sentenceWords: ['Estoy', 'enfadado'],
    category: 'Dificil',
    categoryAr: 'مشاعر صعبة',
    grammarHint: {
      pattern: 'Estoy + صفة',
      rule: 'للبنت ممكن نقول: enfadada',
    },
    note: 'للبنت: enfadada',
    color: '#EF4444',
    gradient: ['#F87171', '#B91C1C'],
  },
  {
    id: 'cansado',
    word: 'cansado',
    wordAr: 'تعبان',
    emoji: '🥱',
    sentenceEs: 'Estoy cansado',
    sentenceAr: 'أنا تعبان',
    sentenceWords: ['Estoy', 'cansado'],
    category: 'Dificil',
    categoryAr: 'مشاعر صعبة',
    grammarHint: {
      pattern: 'Estoy + صفة',
      rule: 'للبنت ممكن نقول: cansada',
    },
    note: 'للبنت: cansada',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'enfermo',
    word: 'enfermo',
    wordAr: 'مريض',
    emoji: '🤒',
    sentenceEs: 'Estoy enfermo',
    sentenceAr: 'أنا مريض',
    sentenceWords: ['Estoy', 'enfermo'],
    category: 'Dificil',
    categoryAr: 'مشاعر صعبة',
    grammarHint: {
      pattern: 'Estoy + صفة',
      rule: 'للبنت ممكن نقول: enferma',
    },
    note: 'للبنت: enferma',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishFeelingGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishFeelingItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_FEELING_GROUPS: SpanishFeelingGroup[] = [
  {
    id: 'group-positive',
    titleEs: 'Sentimientos Positivos',
    titleAr: 'المشاعر المريحة',
    emoji: '🌞',
    items: SPANISH_FEELING_ITEMS.filter(i => i.category === 'Positiva'),
    grammarFocus: {
      pattern: 'Estoy + feliz / bien / contento',
      description: 'بنستخدم Estoy عشان نصف إحساسنا الحالي',
    },
  },
  {
    id: 'group-difficult',
    titleEs: 'Sentimientos Difíciles',
    titleAr: 'المشاعر الصعبة',
    emoji: '🌧️',
    items: SPANISH_FEELING_ITEMS.filter(i => i.category === 'Dificil'),
    grammarFocus: {
      pattern: 'Estoy + triste / cansado / enfermo',
      description: 'بنوصف المشاعر والحالة الحالية بـ Estoy',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishFeelingChoices(
  correctWord: string,
  count: number = 3
): SpanishFeelingItem[] {
  const correct = SPANISH_FEELING_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_FEELING_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateFeelingSentenceWordPool(
  item: SpanishFeelingItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_FEELING_ITEMS.filter(i => i.id !== item.id);
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

export function checkFeelingSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
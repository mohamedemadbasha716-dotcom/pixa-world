// ═══════════════════════════════════════════════════════════
// 🇪🇸 Spanish Regular Verbs Lesson Data
// 🏛️ Universidad de Sevilla - Map 4, Lesson 1
// ═══════════════════════════════════════════════════════════

export interface SpanishVerbsRegularItem {
  id: string;

  word: string;       // الفعل (المصدر)
  wordAr: string;     // الترجمة العربية

  conjugated: string; // الفعل مع yo
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  verbType: 'AR' | 'ER' | 'IR';
  verbTypeAr: string;

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

export const SPANISH_VERBS_REGULAR_ITEMS: SpanishVerbsRegularItem[] = [

  // ═══════════ Group 1: أفعال AR ═══════════
  {
    id: 'hablar',
    word: 'hablar',
    wordAr: 'يتكلم',
    conjugated: 'hablo',
    emoji: '🗣️',
    sentenceEs: 'Yo hablo español',
    sentenceAr: 'أنا باتكلم إسباني',
    sentenceWords: ['Yo', 'hablo', 'español'],
    verbType: 'AR',
    verbTypeAr: 'فعل AR',
    grammarHint: {
      pattern: 'hablar → hablo',
      rule: 'شيل AR وحط O مع Yo',
    },
    color: '#F59E0B',
    gradient: ['#FCD34D', '#D97706'],
  },
  {
    id: 'escuchar',
    word: 'escuchar',
    wordAr: 'يسمع',
    conjugated: 'escucho',
    emoji: '🎧',
    sentenceEs: 'Yo escucho música',
    sentenceAr: 'أنا باسمع موسيقى',
    sentenceWords: ['Yo', 'escucho', 'música'],
    verbType: 'AR',
    verbTypeAr: 'فعل AR',
    grammarHint: {
      pattern: 'escuchar → escucho',
      rule: 'شيل AR وحط O مع Yo',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'caminar',
    word: 'caminar',
    wordAr: 'يمشي',
    conjugated: 'camino',
    emoji: '🚶',
    sentenceEs: 'Yo camino al colegio',
    sentenceAr: 'أنا بامشي للمدرسة',
    sentenceWords: ['Yo', 'camino', 'al', 'colegio'],
    verbType: 'AR',
    verbTypeAr: 'فعل AR',
    grammarHint: {
      pattern: 'caminar → camino',
      rule: 'شيل AR وحط O مع Yo',
    },
    color: '#10B981',
    gradient: ['#34D399', '#059669'],
  },
  {
    id: 'trabajar',
    word: 'trabajar',
    wordAr: 'يشتغل',
    conjugated: 'trabajo',
    emoji: '💼',
    sentenceEs: 'Yo trabajo mucho',
    sentenceAr: 'أنا بشتغل كتير',
    sentenceWords: ['Yo', 'trabajo', 'mucho'],
    verbType: 'AR',
    verbTypeAr: 'فعل AR',
    grammarHint: {
      pattern: 'trabajar → trabajo',
      rule: 'شيل AR وحط O مع Yo',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'mirar',
    word: 'mirar',
    wordAr: 'يشوف',
    conjugated: 'miro',
    emoji: '👀',
    sentenceEs: 'Yo miro la tele',
    sentenceAr: 'أنا بشوف التلفزيون',
    sentenceWords: ['Yo', 'miro', 'la', 'tele'],
    verbType: 'AR',
    verbTypeAr: 'فعل AR',
    grammarHint: {
      pattern: 'mirar → miro',
      rule: 'شيل AR وحط O مع Yo',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },

  // ═══════════ Group 2: أفعال ER ═══════════
  {
    id: 'comer',
    word: 'comer',
    wordAr: 'ياكل',
    conjugated: 'como',
    emoji: '🍕',
    sentenceEs: 'Yo como pizza',
    sentenceAr: 'أنا باكل بيتزا',
    sentenceWords: ['Yo', 'como', 'pizza'],
    verbType: 'ER',
    verbTypeAr: 'فعل ER',
    grammarHint: {
      pattern: 'comer → como',
      rule: 'شيل ER وحط O مع Yo',
    },
    color: '#EF4444',
    gradient: ['#FCA5A5', '#DC2626'],
  },
  {
    id: 'beber',
    word: 'beber',
    wordAr: 'يشرب',
    conjugated: 'bebo',
    emoji: '💧',
    sentenceEs: 'Yo bebo agua',
    sentenceAr: 'أنا باشرب ميه',
    sentenceWords: ['Yo', 'bebo', 'agua'],
    verbType: 'ER',
    verbTypeAr: 'فعل ER',
    grammarHint: {
      pattern: 'beber → bebo',
      rule: 'شيل ER وحط O مع Yo',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'leer',
    word: 'leer',
    wordAr: 'يقرأ',
    conjugated: 'leo',
    emoji: '📖',
    sentenceEs: 'Yo leo un libro',
    sentenceAr: 'أنا باقرأ كتاب',
    sentenceWords: ['Yo', 'leo', 'un', 'libro'],
    verbType: 'ER',
    verbTypeAr: 'فعل ER',
    grammarHint: {
      pattern: 'leer → leo',
      rule: 'شيل ER وحط O مع Yo',
    },
    note: 'leer استثناء: بيتحول لـ leo مش leeo',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'correr',
    word: 'correr',
    wordAr: 'يجري',
    conjugated: 'corro',
    emoji: '🏃',
    sentenceEs: 'Yo corro rápido',
    sentenceAr: 'أنا بجري بسرعة',
    sentenceWords: ['Yo', 'corro', 'rápido'],
    verbType: 'ER',
    verbTypeAr: 'فعل ER',
    grammarHint: {
      pattern: 'correr → corro',
      rule: 'شيل ER وحط O مع Yo',
    },
    color: '#84CC16',
    gradient: ['#A3E635', '#4D7C0F'],
  },
  {
    id: 'aprender',
    word: 'aprender',
    wordAr: 'يتعلم',
    conjugated: 'aprendo',
    emoji: '🧠',
    sentenceEs: 'Yo aprendo español',
    sentenceAr: 'أنا بتعلم إسباني',
    sentenceWords: ['Yo', 'aprendo', 'español'],
    verbType: 'ER',
    verbTypeAr: 'فعل ER',
    grammarHint: {
      pattern: 'aprender → aprendo',
      rule: 'شيل ER وحط O مع Yo',
    },
    color: '#6366F1',
    gradient: ['#818CF8', '#4338CA'],
  },

  // ═══════════ Group 3: أفعال IR ═══════════
  {
    id: 'vivir',
    word: 'vivir',
    wordAr: 'يسكن',
    conjugated: 'vivo',
    emoji: '🏠',
    sentenceEs: 'Yo vivo en Egipto',
    sentenceAr: 'أنا ساكن في مصر',
    sentenceWords: ['Yo', 'vivo', 'en', 'Egipto'],
    verbType: 'IR',
    verbTypeAr: 'فعل IR',
    grammarHint: {
      pattern: 'vivir → vivo',
      rule: 'شيل IR وحط O مع Yo',
    },
    color: '#14B8A6',
    gradient: ['#2DD4BF', '#0F766E'],
  },
  {
    id: 'escribir',
    word: 'escribir',
    wordAr: 'يكتب',
    conjugated: 'escribo',
    emoji: '✏️',
    sentenceEs: 'Yo escribo en árabe',
    sentenceAr: 'أنا بكتب بالعربي',
    sentenceWords: ['Yo', 'escribo', 'en', 'árabe'],
    verbType: 'IR',
    verbTypeAr: 'فعل IR',
    grammarHint: {
      pattern: 'escribir → escribo',
      rule: 'شيل IR وحط O مع Yo',
    },
    color: '#F59E0B',
    gradient: ['#FCD34D', '#B45309'],
  },
  {
    id: 'abrir',
    word: 'abrir',
    wordAr: 'يفتح',
    conjugated: 'abro',
    emoji: '🚪',
    sentenceEs: 'Yo abro la puerta',
    sentenceAr: 'أنا بافتح الباب',
    sentenceWords: ['Yo', 'abro', 'la', 'puerta'],
    verbType: 'IR',
    verbTypeAr: 'فعل IR',
    grammarHint: {
      pattern: 'abrir → abro',
      rule: 'شيل IR وحط O مع Yo',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'subir',
    word: 'subir',
    wordAr: 'يطلع فوق',
    conjugated: 'subo',
    emoji: '🪜',
    sentenceEs: 'Yo subo las escaleras',
    sentenceAr: 'أنا بطلع السلم',
    sentenceWords: ['Yo', 'subo', 'las', 'escaleras'],
    verbType: 'IR',
    verbTypeAr: 'فعل IR',
    grammarHint: {
      pattern: 'subir → subo',
      rule: 'شيل IR وحط O مع Yo',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'partir',
    word: 'partir',
    wordAr: 'يسافر',
    conjugated: 'parto',
    emoji: '✈️',
    sentenceEs: 'Yo parto mañana',
    sentenceAr: 'أنا هسافر بكره',
    sentenceWords: ['Yo', 'parto', 'mañana'],
    verbType: 'IR',
    verbTypeAr: 'فعل IR',
    grammarHint: {
      pattern: 'partir → parto',
      rule: 'شيل IR وحط O مع Yo',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishVerbsRegularGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  verbType: 'AR' | 'ER' | 'IR';
  items: SpanishVerbsRegularItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_VERBS_REGULAR_GROUPS: SpanishVerbsRegularGroup[] = [
  {
    id: 'group-ar',
    titleEs: 'Verbos en -AR',
    titleAr: 'أفعال AR',
    emoji: '🟡',
    verbType: 'AR',
    items: SPANISH_VERBS_REGULAR_ITEMS.filter(i => i.verbType === 'AR'),
    grammarFocus: {
      pattern: '-AR → yo hablo',
      description: 'الأفعال اللي بتخلص بـ AR: بنشيل AR ونحط O مع Yo',
    },
  },
  {
    id: 'group-er',
    titleEs: 'Verbos en -ER',
    titleAr: 'أفعال ER',
    emoji: '🔵',
    verbType: 'ER',
    items: SPANISH_VERBS_REGULAR_ITEMS.filter(i => i.verbType === 'ER'),
    grammarFocus: {
      pattern: '-ER → yo como',
      description: 'الأفعال اللي بتخلص بـ ER: بنشيل ER ونحط O مع Yo',
    },
  },
  {
    id: 'group-ir',
    titleEs: 'Verbos en -IR',
    titleAr: 'أفعال IR',
    emoji: '🟣',
    verbType: 'IR',
    items: SPANISH_VERBS_REGULAR_ITEMS.filter(i => i.verbType === 'IR'),
    grammarFocus: {
      pattern: '-IR → yo vivo',
      description: 'الأفعال اللي بتخلص بـ IR: بنشيل IR ونحط O مع Yo',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎨 ألوان أنواع الأفعال
// ═══════════════════════════════════════════════════════════

export const VERB_TYPE_STYLES = {
  AR: {
    bg: 'rgba(245,158,11,0.7)',
    border: '#F59E0B',
    label: 'فعل -AR',
    badgeGradient: 'linear-gradient(135deg, #FCD34D, #D97706)',
  },
  ER: {
    bg: 'rgba(59,130,246,0.7)',
    border: '#3B82F6',
    label: 'فعل -ER',
    badgeGradient: 'linear-gradient(135deg, #60A5FA, #1D4ED8)',
  },
  IR: {
    bg: 'rgba(139,92,246,0.7)',
    border: '#8B5CF6',
    label: 'فعل -IR',
    badgeGradient: 'linear-gradient(135deg, #A78BFA, #6D28D9)',
  },
};

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateVerbsRegularChoices(
  correctWord: string,
  count: number = 3
): SpanishVerbsRegularItem[] {
  const correct = SPANISH_VERBS_REGULAR_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_VERBS_REGULAR_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);

  return [...wrongChoices, correct].sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateVerbsSentenceWordPool(
  item: SpanishVerbsRegularItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_VERBS_REGULAR_ITEMS.filter(i => i.id !== item.id);
  const shuffledOthers = [...otherItems].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
    const words = shuffledOthers[i].sentenceWords.filter(
      w => !correctWords.includes(w)
    );
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

export function checkVerbsSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;
  return selectedWords.every(
    (word, idx) => word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
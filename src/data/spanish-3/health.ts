// ═══════════════════════════════════════════════════════════
// 🏥 Spanish Health Lesson Data
// 🏛️ Hospital Sant Pau - Map 3, Lesson 2
// ═══════════════════════════════════════════════════════════

export interface SpanishHealthItem {
  id: string;

  // الكلمة الأساسية
  word: string;       // مثل: "dolor de cabeza"
  wordAr: string;     // مثل: "صداع"
  emoji: string;

  // الجملة الكاملة
  sentenceEs: string;     // مثل: "Tengo dolor de cabeza"
  sentenceAr: string;     // مثل: "عندي صداع"
  sentenceWords: string[];// ["Tengo", "dolor", "de", "cabeza"]

  // التصنيف
  category: 'Sintoma' | 'Hospital' | 'Salud';
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

export const SPANISH_HEALTH_ITEMS: SpanishHealthItem[] = [
  // ═══════════ Group 1: Síntomas (الأعراض) ═══════════
  {
    id: 'dolor-cabeza',
    word: 'dolor de cabeza',
    wordAr: 'صداع',
    emoji: '🤕',
    sentenceEs: 'Tengo dolor de cabeza',
    sentenceAr: 'عندي صداع',
    sentenceWords: ['Tengo', 'dolor', 'de', 'cabeza'],
    category: 'Sintoma',
    categoryAr: 'الأعراض',
    grammarHint: {
      pattern: 'Tengo + عرض',
      rule: 'Tengo معناها "عندي" - نستخدمها مع الأعراض',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'fiebre',
    word: 'fiebre',
    wordAr: 'حمى',
    emoji: '🌡️',
    sentenceEs: 'Tengo fiebre',
    sentenceAr: 'عندي حمى',
    sentenceWords: ['Tengo', 'fiebre'],
    category: 'Sintoma',
    categoryAr: 'الأعراض',
    grammarHint: {
      pattern: 'Tengo + عرض',
      rule: 'fiebre = الحمى/السخونية',
    },
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'tos',
    word: 'tos',
    wordAr: 'كحة',
    emoji: '😷',
    sentenceEs: 'Tengo tos',
    sentenceAr: 'عندي كحة',
    sentenceWords: ['Tengo', 'tos'],
    category: 'Sintoma',
    categoryAr: 'الأعراض',
    grammarHint: {
      pattern: 'Tengo + عرض',
      rule: 'tos = الكحة (تُنطق: توس)',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    id: 'frio',
    word: 'frío',
    wordAr: 'برد',
    emoji: '🥶',
    sentenceEs: 'Tengo frío',
    sentenceAr: 'حاسس بالبرد',
    sentenceWords: ['Tengo', 'frío'],
    category: 'Sintoma',
    categoryAr: 'الأعراض',
    grammarHint: {
      pattern: 'Tengo + إحساس',
      rule: 'في الأسبانية: Tengo frío مش "أنا بارد"',
    },
    note: 'frío بفتحة على الـ í',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'sueno',
    word: 'sueño',
    wordAr: 'نعسان',
    emoji: '😴',
    sentenceEs: 'Tengo sueño',
    sentenceAr: 'أنا نعسان',
    sentenceWords: ['Tengo', 'sueño'],
    category: 'Sintoma',
    categoryAr: 'الأعراض',
    grammarHint: {
      pattern: 'Tengo + إحساس',
      rule: 'sueño = النعاس (ñ بينطق "ني")',
    },
    note: 'ñ بينطق "ني"',
    color: '#6366F1',
    gradient: ['#818CF8', '#4338CA'],
  },

  // ═══════════ Group 2: En el Hospital (في المستشفى) ═══════════
  {
    id: 'medico',
    word: 'el médico',
    wordAr: 'الدكتور',
    emoji: '👨‍⚕️',
    sentenceEs: 'Voy al médico',
    sentenceAr: 'رايح للدكتور',
    sentenceWords: ['Voy', 'al', 'médico'],
    category: 'Hospital',
    categoryAr: 'في المستشفى',
    grammarHint: {
      pattern: 'Voy al + مكان/شخص',
      rule: 'al = a + el (اختصار مع المذكر)',
    },
    note: 'médico بفتحة على الـ é',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'medicina',
    word: 'la medicina',
    wordAr: 'الدواء',
    emoji: '💊',
    sentenceEs: 'Necesito medicina',
    sentenceAr: 'محتاج دواء',
    sentenceWords: ['Necesito', 'medicina'],
    category: 'Hospital',
    categoryAr: 'في المستشفى',
    grammarHint: {
      pattern: 'Necesito + اسم',
      rule: 'Necesito معناها "محتاج/أحتاج"',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'enfermera',
    word: 'la enfermera',
    wordAr: 'الممرضة',
    emoji: '👩‍⚕️',
    sentenceEs: 'La enfermera ayuda',
    sentenceAr: 'الممرضة بتساعد',
    sentenceWords: ['La', 'enfermera', 'ayuda'],
    category: 'Hospital',
    categoryAr: 'في المستشفى',
    grammarHint: {
      pattern: 'La + شخص + فعل',
      rule: 'للراجل: el enfermero',
    },
    note: 'للراجل: el enfermero',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    id: 'hospital',
    word: 'el hospital',
    wordAr: 'المستشفى',
    emoji: '🏥',
    sentenceEs: 'Voy al hospital',
    sentenceAr: 'رايح المستشفى',
    sentenceWords: ['Voy', 'al', 'hospital'],
    category: 'Hospital',
    categoryAr: 'في المستشفى',
    grammarHint: {
      pattern: 'Voy al + مكان',
      rule: 'hospital زي الإنجليزي بس بنطق مختلف',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'cita',
    word: 'la cita',
    wordAr: 'الميعاد',
    emoji: '📅',
    sentenceEs: 'Tengo una cita',
    sentenceAr: 'عندي ميعاد',
    sentenceWords: ['Tengo', 'una', 'cita'],
    category: 'Hospital',
    categoryAr: 'في المستشفى',
    grammarHint: {
      pattern: 'Tengo + una + مؤنث',
      rule: 'cita مؤنثة → una cita',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },

  // ═══════════ Group 3: Estar Sano (كن بصحة جيدة) ═══════════
  {
    id: 'sano',
    word: 'sano',
    wordAr: 'بصحة جيدة',
    emoji: '💪',
    sentenceEs: 'Estoy sano',
    sentenceAr: 'أنا بصحة جيدة',
    sentenceWords: ['Estoy', 'sano'],
    category: 'Salud',
    categoryAr: 'الصحة',
    grammarHint: {
      pattern: 'Estoy + صفة صحية',
      rule: 'للبنت: sana',
    },
    note: 'للبنت: sana',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'enfermo',
    word: 'enfermo',
    wordAr: 'مريض',
    emoji: '🤒',
    sentenceEs: 'Estoy enfermo',
    sentenceAr: 'أنا مريض',
    sentenceWords: ['Estoy', 'enfermo'],
    category: 'Salud',
    categoryAr: 'الصحة',
    grammarHint: {
      pattern: 'Estoy + صفة صحية',
      rule: 'للبنت: enferma',
    },
    note: 'للبنت: enferma',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'mejor',
    word: 'mejor',
    wordAr: 'أحسن',
    emoji: '😊',
    sentenceEs: 'Estoy mejor',
    sentenceAr: 'أنا بقيت أحسن',
    sentenceWords: ['Estoy', 'mejor'],
    category: 'Salud',
    categoryAr: 'الصحة',
    grammarHint: {
      pattern: 'Estoy + مقارنة',
      rule: 'mejor = أحسن (بيتغيرش مع الجنس)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'agua',
    word: 'agua',
    wordAr: 'ماء',
    emoji: '💧',
    sentenceEs: 'Bebo agua',
    sentenceAr: 'أشرب ماء',
    sentenceWords: ['Bebo', 'agua'],
    category: 'Salud',
    categoryAr: 'الصحة',
    grammarHint: {
      pattern: 'Bebo + مشروب',
      rule: 'Bebo معناها "أشرب" من فعل beber',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'dormir',
    word: 'dormir',
    wordAr: 'أنام',
    emoji: '🛏️',
    sentenceEs: 'Necesito dormir',
    sentenceAr: 'محتاج أنام',
    sentenceWords: ['Necesito', 'dormir'],
    category: 'Salud',
    categoryAr: 'الصحة',
    grammarHint: {
      pattern: 'Necesito + فعل',
      rule: 'بعد Necesito ممكن تيجي فعل بصيغة المصدر',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishHealthGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishHealthItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_HEALTH_GROUPS: SpanishHealthGroup[] = [
  {
    id: 'group-sintomas',
    titleEs: 'Síntomas',
    titleAr: 'الأعراض',
    emoji: '🤒',
    items: SPANISH_HEALTH_ITEMS.filter(i => i.category === 'Sintoma'),
    grammarFocus: {
      pattern: 'Tengo + عرض',
      description: 'مع الأعراض والإحساس (برد، جوع، عطش) نستخدم Tengo',
    },
  },
  {
    id: 'group-hospital',
    titleEs: 'En el Hospital',
    titleAr: 'في المستشفى',
    emoji: '🏥',
    items: SPANISH_HEALTH_ITEMS.filter(i => i.category === 'Hospital'),
    grammarFocus: {
      pattern: 'Voy al / Necesito / Tengo',
      description: '3 أفعال مهمة في المستشفى',
    },
  },
  {
    id: 'group-salud',
    titleEs: 'Estar Sano',
    titleAr: 'كن بصحة جيدة',
    emoji: '💪',
    items: SPANISH_HEALTH_ITEMS.filter(i => i.category === 'Salud'),
    grammarFocus: {
      pattern: 'Estoy + صفة / Bebo / Necesito',
      description: 'نصائح للصحة والعناية بالنفس',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateSpanishHealthChoices(
  correctWord: string,
  count: number = 3
): SpanishHealthItem[] {
  const correct = SPANISH_HEALTH_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_HEALTH_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateHealthSentenceWordPool(
  item: SpanishHealthItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_HEALTH_ITEMS.filter(i => i.id !== item.id);
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

export function checkHealthSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
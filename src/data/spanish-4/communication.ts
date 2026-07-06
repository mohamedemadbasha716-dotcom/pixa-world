// ═══════════════════════════════════════════════════════════
// 📮 Spanish Communication Lesson Data
// 🏛️ Real Casa de Correos - Map 4, Lesson 6
// ═══════════════════════════════════════════════════════════

export interface SpanishCommunicationItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: 'Carta' | 'Telefono' | 'Conversacion';
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

export const SPANISH_COMMUNICATION_ITEMS: SpanishCommunicationItem[] = [
  // ═══════════ Group 1: Cartas y Correo (الرسائل والبريد) ═══════════
  {
    id: 'carta',
    word: 'la carta',
    wordAr: 'الرسالة',
    emoji: '✉️',
    sentenceEs: 'Escribo una carta',
    sentenceAr: 'باكتب رسالة',
    sentenceWords: ['Escribo', 'una', 'carta'],
    category: 'Carta',
    categoryAr: 'رسائل',
    grammarHint: {
      pattern: 'Escribo + una + مؤنث',
      rule: 'Escribo = باكتب - من فعل escribir',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'sobre',
    word: 'el sobre',
    wordAr: 'الظرف',
    emoji: '📩',
    sentenceEs: 'Uso un sobre',
    sentenceAr: 'باستخدم ظرف',
    sentenceWords: ['Uso', 'un', 'sobre'],
    category: 'Carta',
    categoryAr: 'رسائل',
    grammarHint: {
      pattern: 'Uso + un + مذكر',
      rule: 'sobre = ظرف الرسالة',
    },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'sello',
    word: 'el sello',
    wordAr: 'الطابع',
    emoji: '🏷️',
    sentenceEs: 'Necesito un sello',
    sentenceAr: 'محتاج طابع',
    sentenceWords: ['Necesito', 'un', 'sello'],
    category: 'Carta',
    categoryAr: 'رسائل',
    grammarHint: {
      pattern: 'Necesito + un + مذكر',
      rule: 'sello = طابع البريد',
    },
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'direccion',
    word: 'la dirección',
    wordAr: 'العنوان',
    emoji: '📍',
    sentenceEs: 'Escribo la dirección',
    sentenceAr: 'باكتب العنوان',
    sentenceWords: ['Escribo', 'la', 'dirección'],
    category: 'Carta',
    categoryAr: 'رسائل',
    grammarHint: {
      pattern: 'Escribo + la + مؤنث',
      rule: 'dirección بفتحة على الـ ó',
    },
    note: 'dirección بفتحة على الـ ó',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    id: 'buzon',
    word: 'el buzón',
    wordAr: 'صندوق البريد',
    emoji: '📮',
    sentenceEs: 'Uso el buzón',
    sentenceAr: 'باستخدم صندوق البريد',
    sentenceWords: ['Uso', 'el', 'buzón'],
    category: 'Carta',
    categoryAr: 'رسائل',
    grammarHint: {
      pattern: 'Uso + el + مذكر',
      rule: 'buzón بفتحة على الـ ó',
    },
    note: 'buzón بفتحة على الـ ó',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },

  // ═══════════ Group 2: Teléfono e Internet (الموبايل والنت) ═══════════
  {
    id: 'telefono',
    word: 'el teléfono',
    wordAr: 'الموبايل',
    emoji: '📱',
    sentenceEs: 'Uso el teléfono',
    sentenceAr: 'باستخدم الموبايل',
    sentenceWords: ['Uso', 'el', 'teléfono'],
    category: 'Telefono',
    categoryAr: 'موبايل ونت',
    grammarHint: {
      pattern: 'Uso + el + مذكر',
      rule: 'teléfono بفتحة على الـ é',
    },
    note: 'teléfono بفتحة على الـ é',
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'llamar',
    word: 'llamar',
    wordAr: 'يتصل',
    emoji: '📞',
    sentenceEs: 'Voy a llamar',
    sentenceAr: 'هتصل',
    sentenceWords: ['Voy', 'a', 'llamar'],
    category: 'Telefono',
    categoryAr: 'موبايل ونت',
    grammarHint: {
      pattern: 'Voy a + فعل',
      rule: 'llamar = يتصل (المصدر)',
    },
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'mensaje',
    word: 'el mensaje',
    wordAr: 'الرسالة النصية',
    emoji: '💬',
    sentenceEs: 'Envío un mensaje',
    sentenceAr: 'باعت رسالة',
    sentenceWords: ['Envío', 'un', 'mensaje'],
    category: 'Telefono',
    categoryAr: 'موبايل ونت',
    grammarHint: {
      pattern: 'Envío + un + مذكر',
      rule: 'Envío = باعت - من فعل enviar',
    },
    note: 'Envío بفتحة على الـ í',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'correo',
    word: 'el correo',
    wordAr: 'الإيميل',
    emoji: '📧',
    sentenceEs: 'Leo el correo',
    sentenceAr: 'باقرا الإيميل',
    sentenceWords: ['Leo', 'el', 'correo'],
    category: 'Telefono',
    categoryAr: 'موبايل ونت',
    grammarHint: {
      pattern: 'Leo + el + مذكر',
      rule: 'Leo = باقرا - من فعل leer',
    },
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    id: 'internet',
    word: 'internet',
    wordAr: 'الإنترنت',
    emoji: '🌐',
    sentenceEs: 'Uso internet',
    sentenceAr: 'باستخدم الإنترنت',
    sentenceWords: ['Uso', 'internet'],
    category: 'Telefono',
    categoryAr: 'موبايل ونت',
    grammarHint: {
      pattern: 'Uso + اسم',
      rule: 'internet بدون أداة تعريف',
    },
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },

  // ═══════════ Group 3: Conversación (المحادثة) ═══════════
  {
    id: 'hablar',
    word: 'hablar',
    wordAr: 'يتكلم',
    emoji: '🗣️',
    sentenceEs: 'Me gusta hablar',
    sentenceAr: 'بحب أتكلم',
    sentenceWords: ['Me', 'gusta', 'hablar'],
    category: 'Conversacion',
    categoryAr: 'محادثة',
    grammarHint: {
      pattern: 'Me gusta + فعل',
      rule: 'hablar = يتكلم (المصدر)',
    },
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    id: 'escuchar',
    word: 'escuchar',
    wordAr: 'يسمع',
    emoji: '👂',
    sentenceEs: 'Escucho a mi amigo',
    sentenceAr: 'باسمع صاحبي',
    sentenceWords: ['Escucho', 'a', 'mi', 'amigo'],
    category: 'Conversacion',
    categoryAr: 'محادثة',
    grammarHint: {
      pattern: 'Escucho + a + شخص',
      rule: 'مع الأشخاص بنضيف "a" قبلهم',
    },
    note: 'مع الأشخاص: نضيف "a"',
    color: '#22C55E',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    id: 'responder',
    word: 'responder',
    wordAr: 'يرد',
    emoji: '💭',
    sentenceEs: 'Voy a responder',
    sentenceAr: 'هرد',
    sentenceWords: ['Voy', 'a', 'responder'],
    category: 'Conversacion',
    categoryAr: 'محادثة',
    grammarHint: {
      pattern: 'Voy a + فعل',
      rule: 'responder = يرد (المصدر)',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'amigo',
    word: 'el amigo',
    wordAr: 'الصديق',
    emoji: '👦',
    sentenceEs: 'Mi amigo es bueno',
    sentenceAr: 'صاحبي كويس',
    sentenceWords: ['Mi', 'amigo', 'es', 'bueno'],
    category: 'Conversacion',
    categoryAr: 'محادثة',
    grammarHint: {
      pattern: 'Mi + شخص + es + صفة',
      rule: 'للبنت: mi amiga es buena',
    },
    note: 'للبنت: mi amiga es buena',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'familia',
    word: 'la familia',
    wordAr: 'العائلة',
    emoji: '👨‍👩‍👧',
    sentenceEs: 'Amo a mi familia',
    sentenceAr: 'بحب عيلتي',
    sentenceWords: ['Amo', 'a', 'mi', 'familia'],
    category: 'Conversacion',
    categoryAr: 'محادثة',
    grammarHint: {
      pattern: 'Amo + a + شخص',
      rule: 'Amo = بحب (بشدة) - من فعل amar',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات
// ═══════════════════════════════════════════════════════════

export interface SpanishCommunicationGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishCommunicationItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_COMMUNICATION_GROUPS: SpanishCommunicationGroup[] = [
  {
    id: 'group-carta',
    titleEs: 'Cartas y Correo',
    titleAr: 'الرسائل والبريد',
    emoji: '✉️',
    items: SPANISH_COMMUNICATION_ITEMS.filter(i => i.category === 'Carta'),
    grammarFocus: {
      pattern: 'Escribo / Uso / Necesito + un/una + اسم',
      description: 'أفعال كتابة وإرسال الرسائل',
    },
  },
  {
    id: 'group-telefono',
    titleEs: 'Teléfono e Internet',
    titleAr: 'الموبايل والنت',
    emoji: '📱',
    items: SPANISH_COMMUNICATION_ITEMS.filter(i => i.category === 'Telefono'),
    grammarFocus: {
      pattern: 'Uso / Envío / Leo + اسم',
      description: 'أفعال التواصل الحديث',
    },
  },
  {
    id: 'group-conversacion',
    titleEs: 'Conversación',
    titleAr: 'المحادثة',
    emoji: '💬',
    items: SPANISH_COMMUNICATION_ITEMS.filter(i => i.category === 'Conversacion'),
    grammarFocus: {
      pattern: 'مع الأشخاص: نضيف "a"',
      description: 'Escucho a mi amigo / Amo a mi familia',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════════════════════════

export function generateSpanishCommunicationChoices(
  correctWord: string,
  count: number = 3
): SpanishCommunicationItem[] {
  const correct = SPANISH_COMMUNICATION_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_COMMUNICATION_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const allChoices = [...wrongChoices, correct];

  return allChoices.sort(() => Math.random() - 0.5);
}

export function generateCommunicationSentenceWordPool(
  item: SpanishCommunicationItem
): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_COMMUNICATION_ITEMS.filter(i => i.id !== item.id);
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

export function checkCommunicationSentenceOrder(
  selectedWords: string[],
  correctWords: string[]
): boolean {
  if (selectedWords.length !== correctWords.length) return false;

  return selectedWords.every((word, idx) =>
    word.toLowerCase() === correctWords[idx].toLowerCase()
  );
}
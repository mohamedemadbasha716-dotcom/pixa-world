// ═══════════════════════════════════════════════════════════
// 🌿 Spanish Nature Lesson Data
// 🏞️ Parque Nacional de Doñana - Map 4, Lesson 3
// ═══════════════════════════════════════════════════════════

export type NatureCategory = 'Paisaje' | 'Cielo' | 'Animales';

export interface SpanishNatureItem {
  id: string;

  word: string;
  wordAr: string;
  emoji: string;

  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];

  category: NatureCategory;
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

export const SPANISH_NATURE_ITEMS: SpanishNatureItem[] = [

  // ═══════════ Group 1: El Paisaje (التضاريس) ═══════════
  {
    id: 'arbol',
    word: 'el árbol',
    wordAr: 'الشجرة',
    emoji: '🌳',
    sentenceEs: 'Yo veo un árbol',
    sentenceAr: 'أنا بشوف شجرة',
    sentenceWords: ['Yo', 'veo', 'un', 'árbol'],
    category: 'Paisaje',
    categoryAr: 'التضاريس',
    grammarHint: {
      pattern: 'un + مذكر',
      rule: 'árbol مذكر، بياخد un للمفرد النكرة',
    },
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },
  {
    id: 'flor',
    word: 'la flor',
    wordAr: 'الوردة',
    emoji: '🌸',
    sentenceEs: 'La flor es bonita',
    sentenceAr: 'الوردة شكلها حلو',
    sentenceWords: ['La', 'flor', 'es', 'bonita'],
    category: 'Paisaje',
    categoryAr: 'التضاريس',
    grammarHint: {
      pattern: 'la + مؤنث + bonita',
      rule: 'bonita (حلوة) صفة مؤنثة عشان flor مؤنث',
    },
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    id: 'rio',
    word: 'el río',
    wordAr: 'النهر',
    emoji: '🏞️',
    sentenceEs: 'El río es grande',
    sentenceAr: 'النهر كبير',
    sentenceWords: ['El', 'río', 'es', 'grande'],
    category: 'Paisaje',
    categoryAr: 'التضاريس',
    grammarHint: {
      pattern: 'el + مذكر + grande',
      rule: 'grande (كبير) بتنفع مذكر ومؤنث',
    },
    color: '#0EA5E9',
    gradient: ['#38BDF8', '#0369A1'],
  },
  {
    id: 'montana',
    word: 'la montaña',
    wordAr: 'الجبل',
    emoji: '⛰️',
    sentenceEs: 'La montaña es alta',
    sentenceAr: 'الجبل عالي',
    sentenceWords: ['La', 'montaña', 'es', 'alta'],
    category: 'Paisaje',
    categoryAr: 'التضاريس',
    grammarHint: {
      pattern: 'la + مؤنث + alta',
      rule: 'alta (عالية) صفة مؤنثة عشان montaña',
    },
    color: '#71717A',
    gradient: ['#9CA3AF', '#3F3F46'],
  },
  {
    id: 'piedra',
    word: 'la piedra',
    wordAr: 'الحجر',
    emoji: '🪨',
    sentenceEs: 'La piedra es dura',
    sentenceAr: 'الحجر صلب',
    sentenceWords: ['La', 'piedra', 'es', 'dura'],
    category: 'Paisaje',
    categoryAr: 'التضاريس',
    grammarHint: {
      pattern: 'la + مؤنث + dura',
      rule: 'dura (صلبة) صفة مؤنثة',
    },
    color: '#A1A1AA',
    gradient: ['#D4D4D8', '#52525B'],
  },

  // ═══════════ Group 2: El Cielo (السماء) ═══════════
  {
    id: 'sol',
    word: 'el sol',
    wordAr: 'الشمس',
    emoji: '☀️',
    sentenceEs: 'El sol brilla hoy',
    sentenceAr: 'الشمس بتلمع النهاردة',
    sentenceWords: ['El', 'sol', 'brilla', 'hoy'],
    category: 'Cielo',
    categoryAr: 'السماء',
    grammarHint: {
      pattern: 'el sol (مذكر)',
      rule: 'كلمة شمس في الإسباني مذكر (el sol)',
    },
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    id: 'luna',
    word: 'la luna',
    wordAr: 'القمر',
    emoji: '🌙',
    sentenceEs: 'La luna es blanca',
    sentenceAr: 'القمر لونه أبيض',
    sentenceWords: ['La', 'luna', 'es', 'blanca'],
    category: 'Cielo',
    categoryAr: 'السماء',
    grammarHint: {
      pattern: 'la + مؤنث + blanca',
      rule: 'قمر (luna) مؤنث بياخد صفة blanca (بيضاء)',
    },
    color: '#F1F5F9',
    gradient: ['#F8FAFC', '#94A3B8'],
  },
  {
    id: 'estrella',
    word: 'la estrella',
    wordAr: 'النجمة',
    emoji: '⭐',
    sentenceEs: 'Yo veo una estrella',
    sentenceAr: 'أنا بشوف نجمة',
    sentenceWords: ['Yo', 'veo', 'una', 'estrella'],
    category: 'Cielo',
    categoryAr: 'السماء',
    grammarHint: {
      pattern: 'una + مؤنث',
      rule: 'estrella مؤنث، بتاخد una',
    },
    color: '#FDE047',
    gradient: ['#FEF08A', '#CA8A04'],
  },
  {
    id: 'cielo',
    word: 'el cielo',
    wordAr: 'السماء',
    emoji: '🌌',
    sentenceEs: 'El cielo es azul',
    sentenceAr: 'السما لونها أزرق',
    sentenceWords: ['El', 'cielo', 'es', 'azul'],
    category: 'Cielo',
    categoryAr: 'السماء',
    grammarHint: {
      pattern: 'el + مذكر + azul',
      rule: 'azul (أزرق) لون بينفع مذكر ومؤنث',
    },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1D4ED8'],
  },
  {
    id: 'nube',
    word: 'la nube',
    wordAr: 'السحابة',
    emoji: '☁️',
    sentenceEs: 'La nube es gris',
    sentenceAr: 'السحابة لونها رمادي',
    sentenceWords: ['La', 'nube', 'es', 'gris'],
    category: 'Cielo',
    categoryAr: 'السماء',
    grammarHint: {
      pattern: 'la + مؤنث + gris',
      rule: 'gris (رمادي) لون بينفع مذكر ومؤنث',
    },
    color: '#94A3B8',
    gradient: ['#CBD5E1', '#475569'],
  },

  // ═══════════ Group 3: Animales (الحيوانات) ═══════════
  {
    id: 'pajaro',
    word: 'el pájaro',
    wordAr: 'العصفور',
    emoji: '🐦',
    sentenceEs: 'El pájaro canta mucho',
    sentenceAr: 'العصفور بيغني كتير',
    sentenceWords: ['El', 'pájaro', 'canta', 'mucho'],
    category: 'Animales',
    categoryAr: 'الحيوانات',
    grammarHint: {
      pattern: 'El + pájaro',
      rule: 'pájaro مذكر وفيه á بفتحة',
    },
    color: '#EF4444',
    gradient: ['#FCA5A5', '#B91C1C'],
  },
  {
    id: 'ciervo',
    word: 'el ciervo',
    wordAr: 'الغزال',
    emoji: '🦌',
    sentenceEs: 'El ciervo come hierba',
    sentenceAr: 'الغزال بياكل عشب',
    sentenceWords: ['El', 'ciervo', 'come', 'hierba'],
    category: 'Animales',
    categoryAr: 'الحيوانات',
    grammarHint: {
      pattern: 'come (هو بياكل)',
      rule: 'فعل comer مع ciervo بيكون come',
    },
    color: '#D97706',
    gradient: ['#FBBF24', '#92400E'],
  },
  {
    id: 'caballo',
    word: 'el caballo',
    wordAr: 'الحصان',
    emoji: '🐎',
    sentenceEs: 'El caballo es fuerte',
    sentenceAr: 'الحصان قوي',
    sentenceWords: ['El', 'caballo', 'es', 'fuerte'],
    category: 'Animales',
    categoryAr: 'الحيوانات',
    grammarHint: {
      pattern: 'fuerte',
      rule: 'fuerte (قوي) صفة بتنفع مذكر ومؤنث',
    },
    color: '#8B5CF6',
    gradient: ['#C4B5FD', '#4C1D95'],
  },
  {
    id: 'lince',
    word: 'el lince',
    wordAr: 'الفهد',
    emoji: '🐆',
    sentenceEs: 'El lince corre rápido',
    sentenceAr: 'الفهد بيجري بسرعة',
    sentenceWords: ['El', 'lince', 'corre', 'rápido'],
    category: 'Animales',
    categoryAr: 'الحيوانات',
    grammarHint: {
      pattern: 'rápido',
      rule: 'rápido هنا معناها "بسرعة"',
    },
    color: '#F97316',
    gradient: ['#FDBA74', '#9A3412'],
  },
  {
    id: 'pez',
    word: 'el pez',
    wordAr: 'السمكة',
    emoji: '🐟',
    sentenceEs: 'El pez nada bien',
    sentenceAr: 'السمكة بتعوم كويس',
    sentenceWords: ['El', 'pez', 'nada', 'bien'],
    category: 'Animales',
    categoryAr: 'الحيوانات',
    grammarHint: {
      pattern: 'el pez (مذكر)',
      rule: 'كلمة سمكة حيّة في المية مذكر (pez)',
    },
    color: '#06B6D4',
    gradient: ['#67E8F9', '#0E7490'],
  },
];

// ═══════════════════════════════════════════════════════════
// 🗂️ المجموعات (3 مجموعات × 5)
// ═══════════════════════════════════════════════════════════

export interface SpanishNatureGroup {
  id: string;
  titleEs: string;
  titleAr: string;
  emoji: string;
  items: SpanishNatureItem[];
  grammarFocus: {
    pattern: string;
    description: string;
  };
}

export const SPANISH_NATURE_GROUPS: SpanishNatureGroup[] = [
  {
    id: 'group-paisaje',
    titleEs: 'El Paisaje',
    titleAr: 'التضاريس',
    emoji: '🏞️',
    items: SPANISH_NATURE_ITEMS.filter(i => i.category === 'Paisaje'),
    grammarFocus: {
      pattern: 'المذكر والمؤنث',
      description: 'الصفة بتتبع الاسم! لو الاسم مؤنث (la flor) الصفة تبقى مؤنثة (bonita).',
    },
  },
  {
    id: 'group-cielo',
    titleEs: 'El Cielo',
    titleAr: 'السماء',
    emoji: '☀️',
    items: SPANISH_NATURE_ITEMS.filter(i => i.category === 'Cielo'),
    grammarFocus: {
      pattern: 'El Sol / La Luna',
      description: 'الشمس في الإسباني مذكر (el sol) والقمر مؤنث (la luna)!',
    },
  },
  {
    id: 'group-animales',
    titleEs: 'Animales de Doñana',
    titleAr: 'حيوانات دونيانا',
    emoji: '🦌',
    items: SPANISH_NATURE_ITEMS.filter(i => i.category === 'Animales'),
    grammarFocus: {
      pattern: 'الأفعال مع الحيوانات',
      description: 'لما نتكلم عن حيوان بنستخدم تصريف "هو/هي" (canta, come, corre).',
    },
  },
];

// ═══════════════════════════════════════════════════════════
// 🎨 ألوان الفئات
// ═══════════════════════════════════════════════════════════

export const NATURE_CATEGORY_STYLES = {
  Paisaje: {
    bg: 'rgba(22,163,74,0.7)',
    border: '#16A34A',
    label: 'التضاريس',
    badgeGradient: 'linear-gradient(135deg, #4ADE80, #15803D)',
    icon: '🍃',
  },
  Cielo: {
    bg: 'rgba(14,165,233,0.7)',
    border: '#0EA5E9',
    label: 'السماء',
    badgeGradient: 'linear-gradient(135deg, #7DD3FC, #0369A1)',
    icon: '☁️',
  },
  Animales: {
    bg: 'rgba(217,119,6,0.7)',
    border: '#D97706',
    label: 'الحيوانات',
    badgeGradient: 'linear-gradient(135deg, #FCD34D, #92400E)',
    icon: '🐾',
  },
};

// ═══════════════════════════════════════════════════════════
// 🎲 اختيارات عشوائية - Listen Phase
// ═══════════════════════════════════════════════════════════

export function generateNatureChoices(correctWord: string, count: number = 3): SpanishNatureItem[] {
  const correct = SPANISH_NATURE_ITEMS.find(i => i.word === correctWord);
  if (!correct) return [];

  const others = SPANISH_NATURE_ITEMS.filter(i => i.word !== correctWord);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);

  return [...wrongChoices, correct].sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// 🎲 توليد كلمات الجملة - Build Phase
// ═══════════════════════════════════════════════════════════

export function generateNatureSentenceWordPool(item: SpanishNatureItem): string[] {
  const correctWords = [...item.sentenceWords];
  const distractors: string[] = [];

  const otherItems = SPANISH_NATURE_ITEMS.filter(i => i.id !== item.id);
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

export function checkNatureSentenceOrder(selectedWords: string[], correctWords: string[]): boolean {
  if (selectedWords.length !== correctWords.length) return false;
  return selectedWords.every((word, idx) => word.toLowerCase() === correctWords[idx].toLowerCase());
}
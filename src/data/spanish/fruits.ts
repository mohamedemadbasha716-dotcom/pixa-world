// src/data/spanish/fruits.ts

// ═══════════════════════════════════════
// 🇪🇸 الفواكه والخضروات الإسبانية - Mercado de la Ribera
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1 → A1.1
// المرجع: Plan Curricular - Nociones específicas 6.1 (Alimentación)
// 15 صنف = 3 مجموعات × 5 أصناف
// مناسب للأطفال 6-7 سنوات
// الدرس: es-ribera-fruits
// ═══════════════════════════════════════

export interface SpanishFruit {
  word: string;          // Manzana
  wordAr: string;        // تفاحة
  emoji: string;         // 🍎
  imageName: string;     // manzana
  type: 'Fruta' | 'Verdura';
  typeAr: 'فاكهة' | 'خضار';
  exampleEs: string;     // Me gusta la manzana
  exampleAr: string;     // بحب التفاحة
  article: 'la' | 'el';  // أداة التعريف (المؤنث/المذكر)
  color: string;
  gradient: [string, string];
}

export interface SpanishFruitGroup {
  fruits: SpanishFruit[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_FRUITS: SpanishFruit[] = [
  // ═══════════════════════════════════════
  // 🍓 المجموعة الأولى: الفواكه الشائعة (Frutas Comunes)
  // ═══════════════════════════════════════
  {
    word: 'Manzana',
    wordAr: 'تفاحة',
    emoji: '🍎',
    imageName: 'manzana',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'Me gusta la manzana',
    exampleAr: 'بحب التفاحة',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    word: 'Plátano',
    wordAr: 'موز',
    emoji: '🍌',
    imageName: 'platano',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'el',
    exampleEs: 'Como el plátano',
    exampleAr: 'باكل الموز',
    color: '#FCD34D',
    gradient: ['#FDE047', '#CA8A04'],
  },
  {
    word: 'Naranja',
    wordAr: 'برتقالة',
    emoji: '🍊',
    imageName: 'naranja',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'La naranja es dulce',
    exampleAr: 'البرتقالة حلوة',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    word: 'Fresa',
    wordAr: 'فراولة',
    emoji: '🍓',
    imageName: 'fresa',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'Quiero una fresa',
    exampleAr: 'عايز فراولة',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    word: 'Uva',
    wordAr: 'عنب',
    emoji: '🍇',
    imageName: 'uva',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'La uva es pequeña',
    exampleAr: 'العنب صغير',
    color: '#9333EA',
    gradient: ['#A855F7', '#6B21A8'],
  },

  // ═══════════════════════════════════════
  // 🥭 المجموعة الثانية: فواكه أخرى (Otras Frutas)
  // ═══════════════════════════════════════
  {
    word: 'Sandía',
    wordAr: 'بطيخ',
    emoji: '🍉',
    imageName: 'sandia',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'La sandía es grande',
    exampleAr: 'البطيخ كبير',
    color: '#10B981',
    gradient: ['#34D399', '#047857'],
  },
  {
    word: 'Piña',
    wordAr: 'أناناس',
    emoji: '🍍',
    imageName: 'pina',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'Me gusta la piña',
    exampleAr: 'بحب الأناناس',
    color: '#EAB308',
    gradient: ['#FACC15', '#A16207'],
  },
  {
    word: 'Limón',
    wordAr: 'ليمون',
    emoji: '🍋',
    imageName: 'limon',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'el',
    exampleEs: 'El limón es ácido',
    exampleAr: 'الليمون حامض',
    color: '#FDE047',
    gradient: ['#FEF08A', '#CA8A04'],
  },
  {
    word: 'Pera',
    wordAr: 'كمثرى',
    emoji: '🍐',
    imageName: 'pera',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'la',
    exampleEs: 'La pera es dulce',
    exampleAr: 'الكمثرى حلوة',
    color: '#84CC16',
    gradient: ['#A3E635', '#4D7C0F'],
  },
  {
    word: 'Mango',
    wordAr: 'مانجو',
    emoji: '🥭',
    imageName: 'mango',
    type: 'Fruta',
    typeAr: 'فاكهة',
    article: 'el',
    exampleEs: 'El mango es tropical',
    exampleAr: 'المانجو استوائي',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },

  // ═══════════════════════════════════════
  // 🥬 المجموعة الثالثة: الخضروات (Verduras)
  // ═══════════════════════════════════════
  {
    word: 'Tomate',
    wordAr: 'طماطم',
    emoji: '🍅',
    imageName: 'tomate',
    type: 'Verdura',
    typeAr: 'خضار',
    article: 'el',
    exampleEs: 'El tomate es rojo',
    exampleAr: 'الطماطم حمرا',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    word: 'Zanahoria',
    wordAr: 'جزر',
    emoji: '🥕',
    imageName: 'zanahoria',
    type: 'Verdura',
    typeAr: 'خضار',
    article: 'la',
    exampleEs: 'La zanahoria es naranja',
    exampleAr: 'الجزر برتقالي',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
  {
    word: 'Patata',
    wordAr: 'بطاطس',
    emoji: '🥔',
    imageName: 'patata',
    type: 'Verdura',
    typeAr: 'خضار',
    article: 'la',
    exampleEs: 'La patata es marrón',
    exampleAr: 'البطاطس بنية',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    word: 'Lechuga',
    wordAr: 'خس',
    emoji: '🥬',
    imageName: 'lechuga',
    type: 'Verdura',
    typeAr: 'خضار',
    article: 'la',
    exampleEs: 'La lechuga es verde',
    exampleAr: 'الخس أخضر',
    color: '#16A34A',
    gradient: ['#4ADE80', '#15803D'],
  },
  {
    word: 'Cebolla',
    wordAr: 'بصل',
    emoji: '🧅',
    imageName: 'cebolla',
    type: 'Verdura',
    typeAr: 'خضار',
    article: 'la',
    exampleEs: 'La cebolla es fuerte',
    exampleAr: 'البصل قوي',
    color: '#D6D3D1',
    gradient: ['#E7E5E4', '#78716C'],
  },
];

export const SPANISH_FRUIT_GROUPS: SpanishFruitGroup[] = [
  {
    fruits: SPANISH_FRUITS.slice(0, 5),
    title: 'الفواكه الشائعة',
    titleEs: 'Grupo 1: Frutas Comunes',
    groupId: 0,
  },
  {
    fruits: SPANISH_FRUITS.slice(5, 10),
    title: 'فواكه أخرى',
    titleEs: 'Grupo 2: Otras Frutas',
    groupId: 1,
  },
  {
    fruits: SPANISH_FRUITS.slice(10, 15),
    title: 'الخضروات',
    titleEs: 'Grupo 3: Verduras',
    groupId: 2,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة
// ═══════════════════════════════════════
export const DARK_SPANISH_FRUIT_COLORS: Record<string, string> = {
  '#DC2626': '#7F1D1D',
  '#FCD34D': '#78350F',
  '#F97316': '#7C2D12',
  '#EC4899': '#831843',
  '#9333EA': '#581C87',
  '#10B981': '#064E3B',
  '#EAB308': '#713F12',
  '#FDE047': '#713F12',
  '#84CC16': '#365314',
  '#F59E0B': '#78350F',
  '#A16207': '#451A03',
  '#16A34A': '#14532D',
  '#D6D3D1': '#44403C',
};

export function getDarkSpanishFruitColor(originalColor: string): string {
  return DARK_SPANISH_FRUIT_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function getSpanishFruitByWord(word: string): SpanishFruit | undefined {
  return SPANISH_FRUITS.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية للفواكه (للمرحلة الأولى Listen)
 */
export function generateSpanishFruitChoices(
  correctWord: string,
  count: number = 3
): SpanishFruit[] {
  const correctFruit = getSpanishFruitByWord(correctWord);
  if (!correctFruit) return [];

  const allFruits = SPANISH_FRUITS.filter((f) => f.word !== correctWord);
  const shuffled = allFruits.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctFruit];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * مقارنة كلمتين مع تجاهل الحروف الكبيرة/الصغيرة والمسافات
 */
export function compareSpanishFruitWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');

  return normalize(input) === normalize(target);
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_FRUITS = SPANISH_FRUITS.length; // 15
export const TOTAL_SPANISH_FRUIT_GROUPS = SPANISH_FRUIT_GROUPS.length; // 3
export const PHASES_PER_SPANISH_FRUIT = 3; // listen + write + speak
export const TOTAL_ANSWERS_PER_SPANISH_FRUITS_LESSON =
  TOTAL_SPANISH_FRUITS * PHASES_PER_SPANISH_FRUIT; // 45
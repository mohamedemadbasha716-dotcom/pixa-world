// src/data/spanish/colors.ts

// ═══════════════════════════════════════
// 🇪🇸 الألوان الإسبانية - Playa de las Catedrales
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1
// المرجع: Plan Curricular - Nociones específicas
// 8 ألوان أساسية للأطفال 6-7 سنوات
// 2 مجموعات × 4 ألوان = 8 ألوان
// نوع الدرس: Vocabulary (كلمات)
// الفلو: 3 مراحل (Listen → Write → Speak)
// الدرس: es-catedrales-colors
// ═══════════════════════════════════════

export interface SpanishColor {
  word: string;          // Rojo
  wordAr: string;        // أحمر
  emoji: string;         // 🔴
  imageName: string;     // rojo
  colorHex: string;      // اللون الحقيقي للعرض البصري
  exampleEs: string;     // Color rojo
  exampleAr: string;     // لون أحمر
  color: string;         // لون الكارت
  gradient: [string, string];
}

export interface SpanishColorGroup {
  colors: SpanishColor[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_COLORS: SpanishColor[] = [
  // ═══════════════════════════════════════
  // 🌈 المجموعة الأولى: الألوان الأساسية (4)
  // الأحمر، الأزرق، الأصفر، الأخضر
  // ═══════════════════════════════════════
  {
    word: 'Rojo',
    wordAr: 'أحمر',
    emoji: '🔴',
    imageName: 'rojo',
    colorHex: '#DC2626',
    exampleEs: 'Color rojo',
    exampleAr: 'لون أحمر',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },
  {
    word: 'Azul',
    wordAr: 'أزرق',
    emoji: '🔵',
    imageName: 'azul',
    colorHex: '#2563EB',
    exampleEs: 'Color azul',
    exampleAr: 'لون أزرق',
    color: '#2563EB',
    gradient: ['#3B82F6', '#1E40AF'],
  },
  {
    word: 'Amarillo',
    wordAr: 'أصفر',
    emoji: '🟡',
    imageName: 'amarillo',
    colorHex: '#FACC15',
    exampleEs: 'Color amarillo',
    exampleAr: 'لون أصفر',
    color: '#EAB308',
    gradient: ['#FDE047', '#A16207'],
  },
  {
    word: 'Verde',
    wordAr: 'أخضر',
    emoji: '🟢',
    imageName: 'verde',
    colorHex: '#16A34A',
    exampleEs: 'Color verde',
    exampleAr: 'لون أخضر',
    color: '#16A34A',
    gradient: ['#22C55E', '#15803D'],
  },

  // ═══════════════════════════════════════
  // 🎨 المجموعة الثانية: ألوان إضافية (4)
  // الأبيض، الأسود، الوردي، البرتقالي
  // ═══════════════════════════════════════
  {
    word: 'Blanco',
    wordAr: 'أبيض',
    emoji: '⚪',
    imageName: 'blanco',
    colorHex: '#F3F4F6',
    exampleEs: 'Color blanco',
    exampleAr: 'لون أبيض',
    color: '#94A3B8',
    gradient: ['#E5E7EB', '#94A3B8'],
  },
  {
    word: 'Negro',
    wordAr: 'أسود',
    emoji: '⚫',
    imageName: 'negro',
    colorHex: '#171717',
    exampleEs: 'Color negro',
    exampleAr: 'لون أسود',
    color: '#404040',
    gradient: ['#525252', '#171717'],
  },
  {
    word: 'Rosa',
    wordAr: 'وردي',
    emoji: '🌸',
    imageName: 'rosa',
    colorHex: '#EC4899',
    exampleEs: 'Color rosa',
    exampleAr: 'لون وردي',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    word: 'Naranja',
    wordAr: 'برتقالي',
    emoji: '🟠',
    imageName: 'naranja',
    colorHex: '#F97316',
    exampleEs: 'Color naranja',
    exampleAr: 'لون برتقالي',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
  },
];

export const SPANISH_COLOR_GROUPS: SpanishColorGroup[] = [
  {
    colors: SPANISH_COLORS.slice(0, 4),
    title: 'الألوان الأساسية',
    titleEs: 'Grupo 1: Colores Básicos',
    groupId: 0,
  },
  {
    colors: SPANISH_COLORS.slice(4, 8),
    title: 'ألوان إضافية',
    titleEs: 'Grupo 2: Más Colores',
    groupId: 1,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للنصوص (للموبايل)
// ═══════════════════════════════════════
export const DARK_SPANISH_COLOR_COLORS: Record<string, string> = {
  '#DC2626': '#7F1D1D',
  '#2563EB': '#1E3A8A',
  '#EAB308': '#713F12',
  '#16A34A': '#14532D',
  '#94A3B8': '#334155',
  '#404040': '#171717',
  '#EC4899': '#831843',
  '#F97316': '#7C2D12',
};

export function getDarkSpanishColorColor(originalColor: string): string {
  return DARK_SPANISH_COLOR_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

/**
 * جلب لون بالاسم
 */
export function getSpanishColorByWord(word: string): SpanishColor | undefined {
  return SPANISH_COLORS.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية للألوان (للمرحلة الأولى Listen)
 * هنعرض دائرة لون + اسم والطفل يختار الصحيح
 */
export function generateSpanishColorChoices(
  correctWord: string,
  count: number = 3
): SpanishColor[] {
  const correctColor = getSpanishColorByWord(correctWord);
  if (!correctColor) return [];

  const allColors = SPANISH_COLORS.filter((c) => c.word !== correctWord);
  const shuffled = allColors.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctColor];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * مقارنة كلمتين مع تجاهل:
 * - الحروف الكبيرة/الصغيرة
 * - المسافات الزائدة
 * - حساس للحروف الخاصة (ñ, á, é, í, ó, ú)
 */
export function compareSpanishColorWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');

  return normalize(input) === normalize(target);
}

/**
 * ترتيب حروف الكلمة عشوائياً (للعبة ترتيب الحروف على الموبايل)
 */
export function shuffleSpanishColorLetters(word: string): string[] {
  const letters = word.split('');
  let shuffled = [...letters];
  let attempts = 0;
  while (shuffled.join('') === word && attempts < 10) {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled;
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_COLORS = SPANISH_COLORS.length; // 8
export const TOTAL_SPANISH_COLOR_GROUPS = SPANISH_COLOR_GROUPS.length; // 2
export const PHASES_PER_SPANISH_COLOR = 3; // listen + write + speak
export const TOTAL_ANSWERS_PER_SPANISH_COLOR_LESSON =
  TOTAL_SPANISH_COLORS * PHASES_PER_SPANISH_COLOR; // 24/ 24
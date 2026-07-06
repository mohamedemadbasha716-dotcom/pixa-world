// src/data/spanish/family.ts

// ═══════════════════════════════════════
// 🇪🇸 العائلة الإسبانية - Hórreo Gallego
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1 → A1.1
// المرجع: Plan Curricular - Nociones específicas 8.1
// 15 فرد عائلة = 3 مجموعات × 5 أفراد
// مناسب للأطفال 6-7 سنوات
// الدرس: es-horreo-family
// ═══════════════════════════════════════

export interface SpanishFamilyMember {
  word: string;          // Papá
  wordAr: string;        // بابا
  emoji: string;         // 👨
  imageName: string;     // papa (لاسم الصورة)
  exampleEs: string;     // Mi papá es alto
  exampleAr: string;     // بابايا طويل
  gender: 'M' | 'F' | 'N'; // مذكر / مؤنث / محايد
  color: string;
  gradient: [string, string];
}

export interface SpanishFamilyGroup {
  members: SpanishFamilyMember[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_FAMILY: SpanishFamilyMember[] = [
  // ═══════════════════════════════════════
  // 🏠 المجموعة الأولى: العائلة النووية (Familia Nuclear)
  // ═══════════════════════════════════════
  {
    word: 'Papá',
    wordAr: 'بابا',
    emoji: '👨',
    imageName: 'papa',
    exampleEs: 'Mi papá es alto',
    exampleAr: 'بابايا طويل',
    gender: 'M',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1E40AF'],
  },
  {
    word: 'Mamá',
    wordAr: 'ماما',
    emoji: '👩',
    imageName: 'mama',
    exampleEs: 'Mi mamá es linda',
    exampleAr: 'ماما جميلة',
    gender: 'F',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    word: 'Hijo',
    wordAr: 'ابن',
    emoji: '👦',
    imageName: 'hijo',
    exampleEs: 'Mi hijo juega',
    exampleAr: 'ابني يلعب',
    gender: 'M',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    word: 'Hija',
    wordAr: 'بنت',
    emoji: '👧',
    imageName: 'hija',
    exampleEs: 'Mi hija canta',
    exampleAr: 'بنتي تغني',
    gender: 'F',
    color: '#F472B6',
    gradient: ['#FBA4D4', '#DB2777'],
  },
  {
    word: 'Bebé',
    wordAr: 'رضيع',
    emoji: '👶',
    imageName: 'bebe',
    exampleEs: 'El bebé duerme',
    exampleAr: 'الرضيع نائم',
    gender: 'N',
    color: '#FCD34D',
    gradient: ['#FDE68A', '#D97706'],
  },

  // ═══════════════════════════════════════
  // 👴 المجموعة الثانية: الأجداد والأشقاء (Abuelos y Hermanos)
  // ═══════════════════════════════════════
  {
    word: 'Abuelo',
    wordAr: 'جدي',
    emoji: '👴',
    imageName: 'abuelo',
    exampleEs: 'Mi abuelo es sabio',
    exampleAr: 'جدي حكيم',
    gender: 'M',
    color: '#78716C',
    gradient: ['#A8A29E', '#44403C'],
  },
  {
    word: 'Abuela',
    wordAr: 'جدتي',
    emoji: '👵',
    imageName: 'abuela',
    exampleEs: 'Mi abuela cocina',
    exampleAr: 'جدتي تطبخ',
    gender: 'F',
    color: '#A855F7',
    gradient: ['#C084FC', '#7E22CE'],
  },
  {
    word: 'Hermano',
    wordAr: 'أخ',
    emoji: '🧑',
    imageName: 'hermano',
    exampleEs: 'Mi hermano corre',
    exampleAr: 'أخويا يجري',
    gender: 'M',
    color: '#10B981',
    gradient: ['#34D399', '#047857'],
  },
  {
    word: 'Hermana',
    wordAr: 'أخت',
    emoji: '👱‍♀️',
    imageName: 'hermana',
    exampleEs: 'Mi hermana lee',
    exampleAr: 'أختي تقرأ',
    gender: 'F',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    word: 'Familia',
    wordAr: 'عائلة',
    emoji: '👨‍👩‍👧‍👦',
    imageName: 'familia',
    exampleEs: 'Mi familia es feliz',
    exampleAr: 'عائلتي سعيدة',
    gender: 'F',
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
  },

  // ═══════════════════════════════════════
  // 👨‍👦 المجموعة الثالثة: العائلة الممتدة (Familia Extendida)
  // ═══════════════════════════════════════
  {
    word: 'Tío',
    wordAr: 'عمي/خالي',
    emoji: '🧔',
    imageName: 'tio',
    exampleEs: 'Mi tío trabaja',
    exampleAr: 'عمي يعمل',
    gender: 'M',
    color: '#0891B2',
    gradient: ['#06B6D4', '#155E75'],
  },
  {
    word: 'Tía',
    wordAr: 'عمتي/خالتي',
    emoji: '👩‍🦰',
    imageName: 'tia',
    exampleEs: 'Mi tía baila',
    exampleAr: 'عمتي ترقص',
    gender: 'F',
    color: '#DB2777',
    gradient: ['#EC4899', '#9F1239'],
  },
  {
    word: 'Primo',
    wordAr: 'ابن عمي',
    emoji: '🧑‍🦱',
    imageName: 'primo',
    exampleEs: 'Mi primo es divertido',
    exampleAr: 'ابن عمي مرح',
    gender: 'M',
    color: '#7C3AED',
    gradient: ['#A78BFA', '#5B21B6'],
  },
  {
    word: 'Prima',
    wordAr: 'بنت عمي',
    emoji: '👩‍🦱',
    imageName: 'prima',
    exampleEs: 'Mi prima pinta',
    exampleAr: 'بنت عمي ترسم',
    gender: 'F',
    color: '#E11D48',
    gradient: ['#FB7185', '#9F1239'],
  },
  {
    word: 'Nieto',
    wordAr: 'حفيد',
    emoji: '🧒',
    imageName: 'nieto',
    exampleEs: 'El nieto sonríe',
    exampleAr: 'الحفيد يبتسم',
    gender: 'M',
    color: '#16A34A',
    gradient: ['#4ADE80', '#15803D'],
  },
];

export const SPANISH_FAMILY_GROUPS: SpanishFamilyGroup[] = [
  {
    members: SPANISH_FAMILY.slice(0, 5),
    title: 'العائلة النووية',
    titleEs: 'Grupo 1: Familia Nuclear',
    groupId: 0,
  },
  {
    members: SPANISH_FAMILY.slice(5, 10),
    title: 'الأجداد والأشقاء',
    titleEs: 'Grupo 2: Abuelos y Hermanos',
    groupId: 1,
  },
  {
    members: SPANISH_FAMILY.slice(10, 15),
    title: 'العائلة الممتدة',
    titleEs: 'Grupo 3: Familia Extendida',
    groupId: 2,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للنصوص
// ═══════════════════════════════════════
export const DARK_SPANISH_FAMILY_COLORS: Record<string, string> = {
  '#3B82F6': '#1E3A8A',
  '#EC4899': '#831843',
  '#06B6D4': '#164E63',
  '#F472B6': '#9F1239',
  '#FCD34D': '#78350F',
  '#78716C': '#292524',
  '#A855F7': '#581C87',
  '#10B981': '#064E3B',
  '#F59E0B': '#78350F',
  '#DC2626': '#7F1D1D',
  '#0891B2': '#164E63',
  '#DB2777': '#831843',
  '#7C3AED': '#4C1D95',
  '#E11D48': '#881337',
  '#16A34A': '#14532D',
};

export function getDarkSpanishFamilyColor(originalColor: string): string {
  return DARK_SPANISH_FAMILY_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function getSpanishFamilyByWord(word: string): SpanishFamilyMember | undefined {
  return SPANISH_FAMILY.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية لأفراد العائلة (للمرحلة الأولى Listen)
 * هنعرض إيموجي + اسم والطفل يختار الصحيح
 */
export function generateSpanishFamilyChoices(
  correctWord: string,
  count: number = 3
): SpanishFamilyMember[] {
  const correctMember = getSpanishFamilyByWord(correctWord);
  if (!correctMember) return [];

  const allMembers = SPANISH_FAMILY.filter((m) => m.word !== correctWord);
  const shuffled = allMembers.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctMember];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * مقارنة كلمتين مع تجاهل:
 * - الحروف الكبيرة/الصغيرة
 * - المسافات الزائدة
 * - حساس للحروف الخاصة (ñ, á, é, í, ó, ú)
 */
export function compareSpanishFamilyWords(input: string, target: string): boolean {
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
export const TOTAL_SPANISH_FAMILY = SPANISH_FAMILY.length; // 15
export const TOTAL_SPANISH_FAMILY_GROUPS = SPANISH_FAMILY_GROUPS.length; // 3
export const PHASES_PER_SPANISH_FAMILY = 3; // listen + write + speak
export const TOTAL_ANSWERS_PER_SPANISH_FAMILY_LESSON =
  TOTAL_SPANISH_FAMILY * PHASES_PER_SPANISH_FAMILY; // 45
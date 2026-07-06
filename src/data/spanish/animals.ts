// src/data/spanish/animals.ts

// ═══════════════════════════════════════
// 🇪🇸 الحيوانات الإسبانية - Hórreos de Asturias
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1
// المرجع: Plan Curricular - Nociones específicas
// 10 حيوانات مألوفة للأطفال 6-7 سنوات
// 2 مجموعات × 5 حيوانات = 10 حيوانات
// نوع الدرس: Vocabulary (كلمات)
// الفلو: 3 مراحل (Listen → Write → Speak)
// الدرس: es-horreos-animals
// ═══════════════════════════════════════

export interface SpanishAnimal {
  word: string;          // Perro
  wordAr: string;        // كلب
  emoji: string;         // 🐶
  imageName: string;     // perro
  exampleEs: string;     // Un perro
  exampleAr: string;     // كلب
  color: string;         // لون الكارت
  gradient: [string, string];
}

export interface SpanishAnimalGroup {
  animals: SpanishAnimal[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_ANIMALS: SpanishAnimal[] = [
  // ═══════════════════════════════════════
  // 🏠 المجموعة الأولى: حيوانات البيت والمزرعة (5)
  // ═══════════════════════════════════════
  {
    word: 'Perro',
    wordAr: 'كلب',
    emoji: '🐶',
    imageName: 'perro',
    exampleEs: 'Un perro',
    exampleAr: 'كلب',
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#6D28D9'],
  },
  {
    word: 'Gato',
    wordAr: 'قط',
    emoji: '🐱',
    imageName: 'gato',
    exampleEs: 'Un gato',
    exampleAr: 'قط',
    color: '#F59E0B',
    gradient: ['#FBBF24', '#B45309'],
  },
  {
    word: 'Pájaro',
    wordAr: 'عصفور',
    emoji: '🐦',
    imageName: 'pajaro',
    exampleEs: 'Un pájaro',
    exampleAr: 'عصفور',
    color: '#06B6D4',
    gradient: ['#22D3EE', '#0E7490'],
  },
  {
    word: 'Pez',
    wordAr: 'سمكة',
    emoji: '🐠',
    imageName: 'pez',
    exampleEs: 'Un pez',
    exampleAr: 'سمكة',
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1E40AF'],
  },
  {
    word: 'Caballo',
    wordAr: 'حصان',
    emoji: '🐴',
    imageName: 'caballo',
    exampleEs: 'Un caballo',
    exampleAr: 'حصان',
    color: '#92400E',
    gradient: ['#D97706', '#78350F'],
  },

  // ═══════════════════════════════════════
  // 🦁 المجموعة الثانية: حيوانات الغابة (5)
  // ═══════════════════════════════════════
  {
    word: 'León',
    wordAr: 'أسد',
    emoji: '🦁',
    imageName: 'leon',
    exampleEs: 'Un león',
    exampleAr: 'أسد',
    color: '#EAB308',
    gradient: ['#FACC15', '#A16207'],
  },
  {
    word: 'Elefante',
    wordAr: 'فيل',
    emoji: '🐘',
    imageName: 'elefante',
    exampleEs: 'Un elefante',
    exampleAr: 'فيل',
    color: '#94A3B8',
    gradient: ['#CBD5E1', '#475569'],
  },
  {
    word: 'Mono',
    wordAr: 'قرد',
    emoji: '🐵',
    imageName: 'mono',
    exampleEs: 'Un mono',
    exampleAr: 'قرد',
    color: '#A16207',
    gradient: ['#CA8A04', '#713F12'],
  },
  {
    word: 'Conejo',
    wordAr: 'أرنب',
    emoji: '🐰',
    imageName: 'conejo',
    exampleEs: 'Un conejo',
    exampleAr: 'أرنب',
    color: '#EC4899',
    gradient: ['#F472B6', '#BE185D'],
  },
  {
    word: 'Oso',
    wordAr: 'دب',
    emoji: '🐻',
    imageName: 'oso',
    exampleEs: 'Un oso',
    exampleAr: 'دب',
    color: '#78350F',
    gradient: ['#B45309', '#451A03'],
  },
];

export const SPANISH_ANIMAL_GROUPS: SpanishAnimalGroup[] = [
  {
    animals: SPANISH_ANIMALS.slice(0, 5),
    title: 'حيوانات البيت والمزرعة',
    titleEs: 'Grupo 1: Animales de Casa',
    groupId: 0,
  },
  {
    animals: SPANISH_ANIMALS.slice(5, 10),
    title: 'حيوانات الغابة',
    titleEs: 'Grupo 2: Animales del Bosque',
    groupId: 1,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للنصوص (للموبايل)
// ═══════════════════════════════════════
export const DARK_SPANISH_ANIMAL_COLORS: Record<string, string> = {
  '#8B5CF6': '#4C1D95',
  '#F59E0B': '#78350F',
  '#06B6D4': '#164E63',
  '#3B82F6': '#1E3A8A',
  '#92400E': '#451A03',
  '#EAB308': '#713F12',
  '#94A3B8': '#334155',
  '#A16207': '#451A03',
  '#EC4899': '#831843',
  '#78350F': '#451A03',
};

export function getDarkSpanishAnimalColor(originalColor: string): string {
  return DARK_SPANISH_ANIMAL_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

/**
 * جلب حيوان بالاسم
 */
export function getSpanishAnimalByWord(word: string): SpanishAnimal | undefined {
  return SPANISH_ANIMALS.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية للحيوانات (للمرحلة الأولى Listen)
 */
export function generateSpanishAnimalChoices(
  correctWord: string,
  count: number = 3
): SpanishAnimal[] {
  const correctAnimal = getSpanishAnimalByWord(correctWord);
  if (!correctAnimal) return [];

  const allAnimals = SPANISH_ANIMALS.filter((a) => a.word !== correctWord);
  const shuffled = allAnimals.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctAnimal];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * مقارنة كلمتين مع تجاهل:
 * - الحروف الكبيرة/الصغيرة
 * - المسافات الزائدة
 * - حساس للحروف الخاصة (ñ, á, é, í, ó, ú)
 */
export function compareSpanishAnimalWords(input: string, target: string): boolean {
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
export function shuffleSpanishAnimalLetters(word: string): string[] {
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
export const TOTAL_SPANISH_ANIMALS = SPANISH_ANIMALS.length; // 10
export const TOTAL_SPANISH_ANIMAL_GROUPS = SPANISH_ANIMAL_GROUPS.length; // 2
export const PHASES_PER_SPANISH_ANIMAL = 3; // listen + write + speak
export const TOTAL_ANSWERS_PER_SPANISH_ANIMAL_LESSON =
  TOTAL_SPANISH_ANIMALS * PHASES_PER_SPANISH_ANIMAL; // 30
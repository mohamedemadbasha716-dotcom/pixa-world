// src/data/spanish/numbers.ts

// ═══════════════════════════════════════
// 🇪🇸 الأرقام الإسبانية - Lagos de Covadonga
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1
// 15 رقم = 3 مجموعات × 5 أرقام
// مناسب للأطفال 6-7 سنوات
// الدرس: es-covadonga-numbers
// ═══════════════════════════════════════

export interface SpanishNumber {
  value: number;
  digit: string;
  word: string;
  wordAr: string;
  emoji: string;
  imageName: string;
  color: string;
  gradient: [string, string];
}

export interface SpanishNumberGroup {
  numbers: SpanishNumber[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_NUMBERS: SpanishNumber[] = [
  // ═══════════════════════════════════════
  // 🏞️ المجموعة الأولى: 1 → 5
  // ═══════════════════════════════════════
  {
    value: 1,
    digit: '1',
    word: 'Uno',
    wordAr: 'واحد',
    emoji: '1️⃣',
    imageName: 'uno',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#3BA8D0'],
  },
  {
    value: 2,
    digit: '2',
    word: 'Dos',
    wordAr: 'اثنان',
    emoji: '2️⃣',
    imageName: 'dos',
    color: '#06D6A0',
    gradient: ['#06D6A0', '#05B588'],
  },
  {
    value: 3,
    digit: '3',
    word: 'Tres',
    wordAr: 'ثلاثة',
    emoji: '3️⃣',
    imageName: 'tres',
    color: '#F72585',
    gradient: ['#F72585', '#D01E70'],
  },
  {
    value: 4,
    digit: '4',
    word: 'Cuatro',
    wordAr: 'أربعة',
    emoji: '4️⃣',
    imageName: 'cuatro',
    color: '#7209B7',
    gradient: ['#7209B7', '#5E079A'],
  },
  {
    value: 5,
    digit: '5',
    word: 'Cinco',
    wordAr: 'خمسة',
    emoji: '5️⃣',
    imageName: 'cinco',
    color: '#FFD700',
    gradient: ['#FFD700', '#E6C200'],
  },

  // ═══════════════════════════════════════
  // 🌊 المجموعة الثانية: 6 → 10
  // ═══════════════════════════════════════
  {
    value: 6,
    digit: '6',
    word: 'Seis',
    wordAr: 'ستة',
    emoji: '6️⃣',
    imageName: 'seis',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#E05555'],
  },
  {
    value: 7,
    digit: '7',
    word: 'Siete',
    wordAr: 'سبعة',
    emoji: '7️⃣',
    imageName: 'siete',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#8B6FE0'],
  },
  {
    value: 8,
    digit: '8',
    word: 'Ocho',
    wordAr: 'ثمانية',
    emoji: '8️⃣',
    imageName: 'ocho',
    color: '#FB923C',
    gradient: ['#FB923C', '#E07A2A'],
  },
  {
    value: 9,
    digit: '9',
    word: 'Nueve',
    wordAr: 'تسعة',
    emoji: '9️⃣',
    imageName: 'nueve',
    color: '#38BDF8',
    gradient: ['#38BDF8', '#2AA3D8'],
  },
  {
    value: 10,
    digit: '10',
    word: 'Diez',
    wordAr: 'عشرة',
    emoji: '🔟',
    imageName: 'diez',
    color: '#34D399',
    gradient: ['#34D399', '#2AB882'],
  },

  // ═══════════════════════════════════════
  // 🌈 المجموعة الثالثة: 11 → 15
  // ═══════════════════════════════════════
  {
    value: 11,
    digit: '11',
    word: 'Once',
    wordAr: 'أحد عشر',
    emoji: '1️⃣1️⃣',
    imageName: 'once',
    color: '#818CF8',
    gradient: ['#818CF8', '#6B72E0'],
  },
  {
    value: 12,
    digit: '12',
    word: 'Doce',
    wordAr: 'اثنا عشر',
    emoji: '1️⃣2️⃣',
    imageName: 'doce',
    color: '#C084FC',
    gradient: ['#C084FC', '#A06EE0'],
  },
  {
    value: 13,
    digit: '13',
    word: 'Trece',
    wordAr: 'ثلاثة عشر',
    emoji: '1️⃣3️⃣',
    imageName: 'trece',
    color: '#F472B6',
    gradient: ['#F472B6', '#D85A9E'],
  },
  {
    value: 14,
    digit: '14',
    word: 'Catorce',
    wordAr: 'أربعة عشر',
    emoji: '1️⃣4️⃣',
    imageName: 'catorce',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#4A8DE0'],
  },
  {
    value: 15,
    digit: '15',
    word: 'Quince',
    wordAr: 'خمسة عشر',
    emoji: '1️⃣5️⃣',
    imageName: 'quince',
    color: '#DC2626',
    gradient: ['#DC2626', '#B91C1C'],
  },
];

export const SPANISH_NUMBER_GROUPS: SpanishNumberGroup[] = [
  {
    numbers: SPANISH_NUMBERS.slice(0, 5),
    title: 'المجموعة الأولى',
    titleEs: 'Grupo 1: 1 - 5',
    groupId: 0,
  },
  {
    numbers: SPANISH_NUMBERS.slice(5, 10),
    title: 'المجموعة الثانية',
    titleEs: 'Grupo 2: 6 - 10',
    groupId: 1,
  },
  {
    numbers: SPANISH_NUMBERS.slice(10, 15),
    title: 'المجموعة الثالثة',
    titleEs: 'Grupo 3: 11 - 15',
    groupId: 2,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للأرقام
// ═══════════════════════════════════════
export const DARK_SPANISH_NUMBER_COLORS: Record<string, string> = {
  '#4CC9F0': '#0F4C5C',
  '#06D6A0': '#034D3A',
  '#F72585': '#6B0F3A',
  '#7209B7': '#2E0449',
  '#FFD700': '#7D6608',
  '#FF6B6B': '#8B0000',
  '#A78BFA': '#3B2B6B',
  '#FB923C': '#6E3A12',
  '#38BDF8': '#124A6B',
  '#34D399': '#0E5147',
  '#818CF8': '#2B3270',
  '#C084FC': '#4A1E6B',
  '#F472B6': '#6B1E4A',
  '#60A5FA': '#1A3E6B',
  '#DC2626': '#6B0F0F',
};

export function getDarkSpanishNumberColor(originalColor: string): string {
  return DARK_SPANISH_NUMBER_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

export function getSpanishNumberByDigit(digit: string): SpanishNumber | undefined {
  return SPANISH_NUMBERS.find((item) => item.digit === digit);
}

export function getSpanishNumberByValue(value: number): SpanishNumber | undefined {
  return SPANISH_NUMBERS.find((item) => item.value === value);
}

export function getSpanishNumberByWord(word: string): SpanishNumber | undefined {
  return SPANISH_NUMBERS.find(
    (item) => item.word.toLowerCase() === word.trim().toLowerCase()
  );
}

/**
 * توليد اختيارات عشوائية للأرقام بالـ digit
 * مثال: الصحيح "7" والاختيارات ["3", "7", "9"]
 */
export function generateSpanishDigitChoices(
  correctDigit: string,
  count: number = 3
): string[] {
  const allDigits = SPANISH_NUMBERS
    .map((item) => item.digit)
    .filter((digit) => digit !== correctDigit);

  const shuffled = allDigits.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctDigit];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * توليد اختيارات عشوائية للكلمات
 * مثال: الصحيح "Siete" والاختيارات ["Cinco", "Siete", "Uno", "Nueve"]
 */
export function generateSpanishNumberWordChoices(
  correctWord: string,
  count: number = 4
): string[] {
  const allWords = SPANISH_NUMBERS
    .map((item) => item.word)
    .filter((word) => word !== correctWord);

  const shuffled = allWords.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctWord];

  return choices.sort(() => Math.random() - 0.5);
}

/**
 * ترتيب حروف الكلمة عشوائياً
 */
export function shuffleSpanishNumberLetters(word: string): string[] {
  const letters = word.split('');
  let shuffled = [...letters];
  let attempts = 0;

  while (shuffled.join('') === word && attempts < 10) {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
    attempts++;
  }

  return shuffled;
}

/**
 * مقارنة كلمتين مع تجاهل:
 * - الحروف الكبيرة/الصغيرة
 * - المسافات الزائدة
 */
export function compareSpanishNumberWords(input: string, target: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');

  return normalize(input) === normalize(target);
}

/**
 * جلب عناصر عشوائية للـ Match/Test
 */
export function getRandomSpanishNumbers(count: number = 5): SpanishNumber[] {
  return [...SPANISH_NUMBERS]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_NUMBERS = SPANISH_NUMBERS.length; // 15
export const TOTAL_SPANISH_NUMBER_GROUPS = SPANISH_NUMBER_GROUPS.length; // 3
export const PHASES_PER_SPANISH_NUMBER = 4; // listen + write + speak + test
export const TOTAL_ANSWERS_PER_SPANISH_NUMBERS_LESSON =
  TOTAL_SPANISH_NUMBERS * PHASES_PER_SPANISH_NUMBER; // 60
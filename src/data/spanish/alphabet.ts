// src/data/spanish/alphabet.ts

// ═══════════════════════════════════════
// 🇪🇸 الأبجدية الإسبانية - Bosque de Muniellos
// ═══════════════════════════════════════
// المنهج: Instituto Cervantes / MCER Pre-A1
// 27 حرف (A-Z + Ñ)
// 3 مجموعات × 9 حروف = 27 حرف
// كل كلمة مناسبة للأطفال 6-7 سنة
// ═══════════════════════════════════════

export interface SpanishLetter {
  letter: string;
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
}

export interface SpanishLetterGroup {
  letters: SpanishLetter[];
  title: string;
  titleEs: string;
  groupId: number;
}

export const SPANISH_LETTERS: SpanishLetter[] = [
  // ═══════════════════════════════════════
  // 🌲 المجموعة الأولى: A → I (9 حروف)
  // ═══════════════════════════════════════
  { letter: 'A', word: 'Árbol',       wordAr: 'شجرة',          emoji: '🌳', color: '#4CC9F0', gradient: ['#4CC9F0', '#3BA8D0'] },
  { letter: 'B', word: 'Barco',       wordAr: 'سفينة',         emoji: '⛵', color: '#06D6A0', gradient: ['#06D6A0', '#05B588'] },
  { letter: 'C', word: 'Casa',        wordAr: 'بيت',           emoji: '🏠', color: '#F72585', gradient: ['#F72585', '#D01E70'] },
  { letter: 'D', word: 'Delfín',      wordAr: 'دولفين',        emoji: '🐬', color: '#7209B7', gradient: ['#7209B7', '#5E079A'] },
  { letter: 'E', word: 'Estrella',    wordAr: 'نجمة',          emoji: '⭐', color: '#FFD700', gradient: ['#FFD700', '#E6C200'] },
  { letter: 'F', word: 'Flor',        wordAr: 'وردة',          emoji: '🌸', color: '#FF6B6B', gradient: ['#FF6B6B', '#E05555'] },
  { letter: 'G', word: 'Gato',        wordAr: 'قطة',           emoji: '🐱', color: '#A78BFA', gradient: ['#A78BFA', '#8B6FE0'] },
  { letter: 'H', word: 'Helado',      wordAr: 'آيس كريم',      emoji: '🍦', color: '#FB923C', gradient: ['#FB923C', '#E07A2A'] },
  { letter: 'I', word: 'Isla',        wordAr: 'جزيرة',         emoji: '🏝️', color: '#38BDF8', gradient: ['#38BDF8', '#2AA3D8'] },

  // ═══════════════════════════════════════
  // 🦋 المجموعة الثانية: J → R (9 حروف - تشمل Ñ)
  // ═══════════════════════════════════════
  { letter: 'J', word: 'Jardín',      wordAr: 'حديقة',         emoji: '🌺', color: '#34D399', gradient: ['#34D399', '#2AB882'] },
  { letter: 'K', word: 'Koala',       wordAr: 'كوالا',         emoji: '🐨', color: '#818CF8', gradient: ['#818CF8', '#6B72E0'] },
  { letter: 'L', word: 'Luna',        wordAr: 'قمر',           emoji: '🌙', color: '#C084FC', gradient: ['#C084FC', '#A06EE0'] },
  { letter: 'M', word: 'Mariposa',    wordAr: 'فراشة',         emoji: '🦋', color: '#F472B6', gradient: ['#F472B6', '#D85A9E'] },
  { letter: 'N', word: 'Nube',        wordAr: 'سحابة',         emoji: '☁️', color: '#60A5FA', gradient: ['#60A5FA', '#4A8DE0'] },
  { letter: 'Ñ', word: 'Niño',        wordAr: 'طفل',           emoji: '👦', color: '#DC2626', gradient: ['#DC2626', '#B91C1C'] },
  { letter: 'O', word: 'Oso',         wordAr: 'دب',            emoji: '🐻', color: '#A3752E', gradient: ['#A3752E', '#8B6425'] },
  { letter: 'P', word: 'Pájaro',      wordAr: 'عصفور',         emoji: '🐦', color: '#2DD4BF', gradient: ['#2DD4BF', '#20B8A5'] },
  { letter: 'Q', word: 'Queso',       wordAr: 'جبنة',          emoji: '🧀', color: '#FACC15', gradient: ['#FACC15', '#E0B50E'] },

  // ═══════════════════════════════════════
  // 🌊 المجموعة الثالثة: R → Z (9 حروف)
  // ═══════════════════════════════════════
  { letter: 'R', word: 'Rana',        wordAr: 'ضفدع',          emoji: '🐸', color: '#4ADE80', gradient: ['#4ADE80', '#38C46A'] },
  { letter: 'S', word: 'Sol',         wordAr: 'شمس',           emoji: '☀️', color: '#FCA311', gradient: ['#FCA311', '#E08E0A'] },
  { letter: 'T', word: 'Tortuga',     wordAr: 'سلحفاة',        emoji: '🐢', color: '#14B8A6', gradient: ['#14B8A6', '#0E9A8C'] },
  { letter: 'U', word: 'Uva',         wordAr: 'عنب',           emoji: '🍇', color: '#8B5CF6', gradient: ['#8B5CF6', '#7443E0'] },
  { letter: 'V', word: 'Vaca',        wordAr: 'بقرة',          emoji: '🐄', color: '#EC4899', gradient: ['#EC4899', '#D03A82'] },
  { letter: 'W', word: 'Wifi',        wordAr: 'واي فاي',       emoji: '📶', color: '#3B82F6', gradient: ['#3B82F6', '#2A6DD8'] },
  { letter: 'X', word: 'Xilófono',    wordAr: 'إكسيلوفون',     emoji: '🎵', color: '#F43F5E', gradient: ['#F43F5E', '#D8324E'] },
  { letter: 'Y', word: 'Yogur',       wordAr: 'زبادي',         emoji: '🥛', color: '#E879F9', gradient: ['#E879F9', '#D060E0'] },
  { letter: 'Z', word: 'Zapato',      wordAr: 'حذاء',          emoji: '👟', color: '#EF4444', gradient: ['#EF4444', '#D83636'] },
];

export const SPANISH_LETTER_GROUPS: SpanishLetterGroup[] = [
  {
    letters: SPANISH_LETTERS.slice(0, 9),
    title: 'المجموعة الأولى',
    titleEs: 'Grupo 1: A - I',
    groupId: 0,
  },
  {
    letters: SPANISH_LETTERS.slice(9, 18),
    title: 'المجموعة الثانية',
    titleEs: 'Grupo 2: J - Q',
    groupId: 1,
  },
  {
    letters: SPANISH_LETTERS.slice(18, 27),
    title: 'المجموعة الثالثة',
    titleEs: 'Grupo 3: R - Z',
    groupId: 2,
  },
];

// ═══════════════════════════════════════
// 🎨 ألوان غامقة للحروف (للاختيارات على الموبايل)
// ═══════════════════════════════════════
export const DARK_SPANISH_LETTER_COLORS: Record<string, string> = {
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
  '#A3752E': '#4A3514',
  '#2DD4BF': '#0E5147',
  '#FACC15': '#6B5508',
  '#4ADE80': '#1A5C30',
  '#FCA311': '#6E4406',
  '#14B8A6': '#064D44',
  '#8B5CF6': '#351E6B',
  '#EC4899': '#6B1A3E',
  '#3B82F6': '#142E6B',
  '#F43F5E': '#6B1422',
  '#E879F9': '#5C1E6B',
  '#EF4444': '#6B1414',
};

export function getDarkSpanishColor(originalColor: string): string {
  return DARK_SPANISH_LETTER_COLORS[originalColor] || originalColor;
}

// ═══════════════════════════════════════
// 🔧 Helper functions
// ═══════════════════════════════════════

/**
 * توليد اختيارات عشوائية للحرف (للموبايل)
 */
export function generateSpanishLetterChoices(
  correctLetter: string,
  count: number = 3
): string[] {
  const allLetters = SPANISH_LETTERS
    .map(l => l.letter)
    .filter(l => l !== correctLetter);
  const shuffled = allLetters.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctLetter];
  return choices.sort(() => Math.random() - 0.5);
}

/**
 * ترتيب حروف الكلمة عشوائياً (للعبة ترتيب الحروف)
 */
export function shuffleSpanishWordLetters(word: string): string[] {
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
 * مقارنة كلمتين (مع تجاهل الحالة)
 */
export function compareSpanishWords(input: string, target: string): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  return normalize(input) === normalize(target);
}

// ═══════════════════════════════════════
// 📊 ثوابت الدرس
// ═══════════════════════════════════════
export const TOTAL_SPANISH_LETTERS = SPANISH_LETTERS.length; // 27
export const TOTAL_SPANISH_GROUPS = SPANISH_LETTER_GROUPS.length; // 3
export const PHASES_PER_LETTER = 4; // listen + write + speak + test
export const TOTAL_ANSWERS_PER_SPANISH_LESSON = TOTAL_SPANISH_LETTERS * PHASES_PER_LETTER; // 108
// src/data/german/time.ts

export interface TimeItem {
  id: string;
  de: string;
  ar: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  article?: string;
}

export interface TimeGroup {
  id: number;
  title: string;
  titleDe: string;
  items: TimeItem[];
}

// ═══════════════════════════════════════
// 1️⃣ المجموعة 1: أرقام 11-15
// ═══════════════════════════════════════
const TIME_GROUP_1: TimeItem[] = [
  {
    id: 'elf',
    de: 'elf',
    ar: 'أحد عشر (11)',
    emoji: '1️⃣1️⃣',
    color: '#3498DB',
    gradient: ['#5DADE2', '#2980B9'],
  },
  {
    id: 'zwoelf',
    de: 'zwölf',
    ar: 'اثنا عشر (12)',
    emoji: '1️⃣2️⃣',
    color: '#9B59B6',
    gradient: ['#BB8FCE', '#7D3C98'],
  },
  {
    id: 'dreizehn',
    de: 'dreizehn',
    ar: 'ثلاثة عشر (13)',
    emoji: '1️⃣3️⃣',
    color: '#1ABC9C',
    gradient: ['#48C9B0', '#138D75'],
  },
  {
    id: 'vierzehn',
    de: 'vierzehn',
    ar: 'أربعة عشر (14)',
    emoji: '1️⃣4️⃣',
    color: '#E67E22',
    gradient: ['#F39C12', '#BA4A00'],
  },
  {
    id: 'fuenfzehn',
    de: 'fünfzehn',
    ar: 'خمسة عشر (15)',
    emoji: '1️⃣5️⃣',
    color: '#E74C3C',
    gradient: ['#EC7063', '#A93226'],
  },
];

// ═══════════════════════════════════════
// 🔢 المجموعة 2: أرقام كبيرة
// ═══════════════════════════════════════
const TIME_GROUP_2: TimeItem[] = [
  {
    id: 'zwanzig',
    de: 'zwanzig',
    ar: 'عشرون (20)',
    emoji: '2️⃣0️⃣',
    color: '#16A085',
    gradient: ['#48C9B0', '#0E6655'],
  },
  {
    id: 'dreissig',
    de: 'dreißig',
    ar: 'ثلاثون (30)',
    emoji: '3️⃣0️⃣',
    color: '#2980B9',
    gradient: ['#5DADE2', '#1B4F72'],
  },
  {
    id: 'fuenfzig',
    de: 'fünfzig',
    ar: 'خمسون (50)',
    emoji: '5️⃣0️⃣',
    color: '#8E44AD',
    gradient: ['#BB8FCE', '#5B2C6F'],
  },
  {
    id: 'hundert',
    de: 'hundert',
    ar: 'مائة (100)',
    emoji: '💯',
    color: '#F39C12',
    gradient: ['#F7DC6F', '#9A7D0A'],
  },
  {
    id: 'tausend',
    de: 'tausend',
    ar: 'ألف (1000)',
    emoji: '🔢',
    color: '#C0392B',
    gradient: ['#E74C3C', '#7B241C'],
  },
];

// ═══════════════════════════════════════
// ⏰ المجموعة 3: الوقت
// ═══════════════════════════════════════
const TIME_GROUP_3: TimeItem[] = [
  {
    id: 'uhr',
    de: 'Uhr',
    ar: 'ساعة',
    emoji: '⏰',
    color: '#5DADE2',
    gradient: ['#85C1E9', '#21618C'],
    article: 'die',
  },
  {
    id: 'minute',
    de: 'Minute',
    ar: 'دقيقة',
    emoji: '⏱️',
    color: '#48C9B0',
    gradient: ['#76D7C4', '#117864'],
    article: 'die',
  },
  {
    id: 'stunde',
    de: 'Stunde',
    ar: 'ساعة زمنية',
    emoji: '🕐',
    color: '#AF7AC5',
    gradient: ['#D2B4DE', '#6C3483'],
    article: 'die',
  },
  {
    id: 'morgen',
    de: 'Morgen',
    ar: 'صباح',
    emoji: '🌅',
    color: '#F8C471',
    gradient: ['#FAD7A0', '#B9770E'],
    article: 'der',
  },
  {
    id: 'abend',
    de: 'Abend',
    ar: 'مساء',
    emoji: '🌆',
    color: '#5B6F8E',
    gradient: ['#85929E', '#2C3E50'],
    article: 'der',
  },
];

// ═══════════════════════════════════════
// 📦 التصدير
// ═══════════════════════════════════════
export const TIME_ITEMS_ALL: TimeItem[] = [
  ...TIME_GROUP_1,
  ...TIME_GROUP_2,
  ...TIME_GROUP_3,
];

export const TIME_GROUPS: TimeGroup[] = [
  {
    id: 1,
    title: 'أرقام 11-15 🔢',
    titleDe: 'Zahlen 11-15',
    items: TIME_GROUP_1,
  },
  {
    id: 2,
    title: 'أرقام كبيرة 💯',
    titleDe: 'Große Zahlen',
    items: TIME_GROUP_2,
  },
  {
    id: 3,
    title: 'الوقت ⏰',
    titleDe: 'die Zeit',
    items: TIME_GROUP_3,
  },
];

// صور الكروت (لو عندك صور مخصصة)
export const TIME_IMAGES: Record<string, string> = {};

// صور الكلمات (لو عندك)
export const TIME_WORD_IMAGES: Record<string, string> = {};
// ═══════════════════════════════════════
// 🧸 بيانات درس جزيرة الألعاب
// ═══════════════════════════════════════

export type ToyItem = {
  id: string;
  de: string;
  ar: string;
  emoji: string;
  article?: string;
  color: string;
  gradient: [string, string];
};

export type ToyGroup = {
  id: string;
  title: string;
  titleDe: string;
  emoji: string;
  items: ToyItem[];
};

// ═══════════════════════════════════════
// 🧸 المجموعة 1: الألعاب
// ═══════════════════════════════════════
const TOYS_ITEMS: ToyItem[] = [
  {
    id: 'ball',
    de: 'Ball',
    ar: 'كرة',
    emoji: '⚽',
    article: 'der',
    color: '#FF6B6B',
    gradient: ['#FF8E8E', '#E94560'],
  },
  {
    id: 'puppe',
    de: 'Puppe',
    ar: 'عروسة',
    emoji: '🪆',
    article: 'die',
    color: '#F72585',
    gradient: ['#FA5BA8', '#C70063'],
  },
  {
    id: 'auto',
    de: 'Auto',
    ar: 'عربية لعبة',
    emoji: '🚗',
    article: 'das',
    color: '#4CC9F0',
    gradient: ['#7DD9F5', '#2BA5D1'],
  },
  {
    id: 'zug',
    de: 'Zug',
    ar: 'قطار',
    emoji: '🚂',
    article: 'der',
    color: '#7209B7',
    gradient: ['#9A2BD8', '#560792'],
  },
  {
    id: 'teddy',
    de: 'Teddy',
    ar: 'دبدوب',
    emoji: '🧸',
    article: 'der',
    color: '#F8B739',
    gradient: ['#FAD06F', '#D49520'],
  },
];

// ═══════════════════════════════════════
// 🎨 المجموعة 2: الهوايات
// ═══════════════════════════════════════
const HOBBIES_ITEMS: ToyItem[] = [
  {
    id: 'musik',
    de: 'Musik',
    ar: 'موسيقى',
    emoji: '🎵',
    article: 'die',
    color: '#9D4EDD',
    gradient: ['#B57BE5', '#7B2CBF'],
  },
  {
    id: 'malen',
    de: 'Malen',
    ar: 'رسم',
    emoji: '🎨',
    article: 'das',
    color: '#FFA07A',
    gradient: ['#FFB89E', '#E07F58'],
  },
  {
    id: 'tanzen',
    de: 'Tanzen',
    ar: 'رقص',
    emoji: '💃',
    article: 'das',
    color: '#FFD700',
    gradient: ['#FFE350', '#D4B100'],
  },
  {
    id: 'singen',
    de: 'Singen',
    ar: 'غناء',
    emoji: '🎤',
    article: 'das',
    color: '#BB8FCE',
    gradient: ['#D0AEE0', '#9B6BB5'],
  },
  {
    id: 'lesen',
    de: 'Lesen',
    ar: 'قراءة',
    emoji: '📖',
    article: 'das',
    color: '#06D6A0',
    gradient: ['#3FE5BA', '#02A578'],
  },
];

// ═══════════════════════════════════════
// ⚽ المجموعة 3: الرياضة
// ═══════════════════════════════════════
const SPORTS_ITEMS: ToyItem[] = [
  {
    id: 'fussball',
    de: 'Fußball',
    ar: 'كرة قدم',
    emoji: '⚽',
    article: 'der',
    color: '#52BE80',
    gradient: ['#7AD0A0', '#2F9758'],
  },
  {
    id: 'schwimmen',
    de: 'Schwimmen',
    ar: 'سباحة',
    emoji: '🏊',
    article: 'das',
    color: '#45B7D1',
    gradient: ['#67CFE6', '#2B95B5'],
  },
  {
    id: 'laufen',
    de: 'Laufen',
    ar: 'جري',
    emoji: '🏃',
    article: 'das',
    color: '#F7DC6F',
    gradient: ['#FAE89E', '#D4B83F'],
  },
  {
    id: 'tennis',
    de: 'Tennis',
    ar: 'تنس',
    emoji: '🎾',
    article: 'das',
    color: '#98D8C8',
    gradient: ['#B5E5D8', '#6FB8A8'],
  },
  {
    id: 'springen',
    de: 'Springen',
    ar: 'قفز',
    emoji: '🤸',
    article: 'das',
    color: '#58CC02',
    gradient: ['#7AE03E', '#3A9A02'],
  },
];

// ═══════════════════════════════════════
// 📦 تجميع المجموعات
// ═══════════════════════════════════════
export const TOYS_GROUPS: ToyGroup[] = [
  {
    id: 'toys',
    title: 'الألعاب',
    titleDe: 'Spielzeug',
    emoji: '🧸',
    items: TOYS_ITEMS,
  },
  {
    id: 'hobbies',
    title: 'الهوايات',
    titleDe: 'Hobbys',
    emoji: '🎨',
    items: HOBBIES_ITEMS,
  },
  {
    id: 'sports',
    title: 'الرياضة',
    titleDe: 'Sport',
    emoji: '⚽',
    items: SPORTS_ITEMS,
  },
];

// ═══════════════════════════════════════
// 📚 تجميع كل الكلمات في array واحد
// ═══════════════════════════════════════
export const TOYS_ITEMS_ALL: ToyItem[] = TOYS_GROUPS.flatMap(g => g.items);

// ═══════════════════════════════════════
// 🖼️ خرائط الصور (مؤقتاً فارغة - تتملا لما الصور تجهز)
// ═══════════════════════════════════════
export const TOYS_IMAGES: Record<string, string> = {
  // 'ball': '/card-image/toys/ball.webp',
  // ... إلخ
};

export const TOYS_WORD_IMAGES: Record<string, string> = {
  // 'Ball': '/card-image/toys/ball-word.webp',
  // ... إلخ
};
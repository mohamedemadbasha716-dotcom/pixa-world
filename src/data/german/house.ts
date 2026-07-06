// ═══════════════════════════════════════
// 🏘️ بيانات درس قرية روتنبورغ (البيت والعيلة)
// ═══════════════════════════════════════

export type HouseItem = {
  id: string;
  de: string;
  ar: string;
  emoji: string;
  article?: string;
  color: string;
  gradient: [string, string];
};

export type HouseGroup = {
  id: string;
  title: string;
  titleDe: string;
  emoji: string;
  items: HouseItem[];
};

// ═══════════════════════════════════════
// 🏠 المجموعة 1: غرف البيت
// ═══════════════════════════════════════
const ROOMS_ITEMS: HouseItem[] = [
  {
    id: 'haus',
    de: 'Haus',
    ar: 'بيت',
    emoji: '🏠',
    article: 'das',
    color: '#FF6B6B',
    gradient: ['#FF8E8E', '#E94560'],
  },
  {
    id: 'kueche',
    de: 'Küche',
    ar: 'مطبخ',
    emoji: '🍳',
    article: 'die',
    color: '#FFA07A',
    gradient: ['#FFB89E', '#E07F58'],
  },
  {
    id: 'schlafzimmer',
    de: 'Schlafzimmer',
    ar: 'غرفة نوم',
    emoji: '🛏️',
    article: 'das',
    color: '#9D4EDD',
    gradient: ['#B57BE5', '#7B2CBF'],
  },
  {
    id: 'badezimmer',
    de: 'Badezimmer',
    ar: 'حمام',
    emoji: '🛁',
    article: 'das',
    color: '#4CC9F0',
    gradient: ['#7DD9F5', '#2BA5D1'],
  },
  {
    id: 'wohnzimmer',
    de: 'Wohnzimmer',
    ar: 'غرفة معيشة',
    emoji: '🛋️',
    article: 'das',
    color: '#52BE80',
    gradient: ['#7AD0A0', '#2F9758'],
  },
];

// ═══════════════════════════════════════
// 🛋️ المجموعة 2: الأثاث
// ═══════════════════════════════════════
const FURNITURE_ITEMS: HouseItem[] = [
  {
    id: 'bett',
    de: 'Bett',
    ar: 'سرير',
    emoji: '🛏️',
    article: 'das',
    color: '#BB8FCE',
    gradient: ['#D0AEE0', '#9B6BB5'],
  },
  {
    id: 'sofa',
    de: 'Sofa',
    ar: 'كنبة',
    emoji: '🛋️',
    article: 'das',
    color: '#F8B739',
    gradient: ['#FAD06F', '#D49520'],
  },
  {
    id: 'lampe',
    de: 'Lampe',
    ar: 'لمبة',
    emoji: '💡',
    article: 'die',
    color: '#F7DC6F',
    gradient: ['#FAE89E', '#D4B83F'],
  },
  {
    id: 'fernseher',
    de: 'Fernseher',
    ar: 'تليفزيون',
    emoji: '📺',
    article: 'der',
    color: '#85C1E2',
    gradient: ['#A3D4ED', '#5A9FC4'],
  },
  {
    id: 'kuehlschrank',
    de: 'Kühlschrank',
    ar: 'تلاجة',
    emoji: '🧊',
    article: 'der',
    color: '#06D6A0',
    gradient: ['#3FE5BA', '#02A578'],
  },
];

// ═══════════════════════════════════════
// 👨‍👩‍👧‍👦 المجموعة 3: العيلة الموسعة
// ═══════════════════════════════════════
const FAMILY_ITEMS: HouseItem[] = [
  {
    id: 'opa',
    de: 'Opa',
    ar: 'جدّ',
    emoji: '👴',
    article: 'der',
    color: '#7209B7',
    gradient: ['#9A2BD8', '#560792'],
  },
  {
    id: 'oma',
    de: 'Oma',
    ar: 'جدّة',
    emoji: '👵',
    article: 'die',
    color: '#F72585',
    gradient: ['#FA5BA8', '#C70063'],
  },
  {
    id: 'onkel',
    de: 'Onkel',
    ar: 'عم/خال',
    emoji: '👨',
    article: 'der',
    color: '#4CC9F0',
    gradient: ['#7DD9F5', '#2BA5D1'],
  },
  {
    id: 'tante',
    de: 'Tante',
    ar: 'عمة/خالة',
    emoji: '👩',
    article: 'die',
    color: '#FFD700',
    gradient: ['#FFE350', '#D4B100'],
  },
  {
    id: 'cousin',
    de: 'Cousin',
    ar: 'ابن عم/خال',
    emoji: '👦',
    article: 'der',
    color: '#58CC02',
    gradient: ['#7AE03E', '#3A9A02'],
  },
];

// ═══════════════════════════════════════
// 📦 تجميع المجموعات
// ═══════════════════════════════════════
export const HOUSE_GROUPS: HouseGroup[] = [
  {
    id: 'rooms',
    title: 'غرف البيت',
    titleDe: 'Zimmer im Haus',
    emoji: '🏠',
    items: ROOMS_ITEMS,
  },
  {
    id: 'furniture',
    title: 'الأثاث',
    titleDe: 'Möbel',
    emoji: '🛋️',
    items: FURNITURE_ITEMS,
  },
  {
    id: 'family',
    title: 'العيلة الموسعة',
    titleDe: 'Erweiterte Familie',
    emoji: '👨‍👩‍👧‍👦',
    items: FAMILY_ITEMS,
  },
];

// ═══════════════════════════════════════
// 📚 تجميع كل الكلمات في array واحد
// ═══════════════════════════════════════
export const HOUSE_ITEMS: HouseItem[] = HOUSE_GROUPS.flatMap(g => g.items);

// ═══════════════════════════════════════
// 🖼️ خرائط الصور (مؤقتاً فارغة - تتملا لما الصور تجهز)
// ═══════════════════════════════════════
export const HOUSE_IMAGES: Record<string, string> = {
  // 'haus': '/card-image/house/haus.webp',
  // 'kueche': '/card-image/house/kueche.webp',
  // ... إلخ
};

export const HOUSE_WORD_IMAGES: Record<string, string> = {
  // 'Haus': '/card-image/house/haus-word.webp',
  // 'Küche': '/card-image/house/kueche-word.webp',
  // ... إلخ
};
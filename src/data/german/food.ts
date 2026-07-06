// data/german/food.ts

export interface FoodItem {
  id: string;
  de: string;
  ar: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  article?: string;
}

export interface FoodGroup {
  id: number;
  title: string;
  titleDe: string;
  items: FoodItem[];
}

// ═══════════════════════════════════════
// 🍽️ المجموعة 1: الأكل
// ═══════════════════════════════════════
const FOOD_GROUP_1: FoodItem[] = [
  {
    id: 'brot',
    de: 'Brot',
    ar: 'خبز',
    emoji: '🍞',
    color: '#D4A574',
    gradient: ['#E8C99B', '#C4956A'],
    article: 'das',
  },
  {
    id: 'apfel',
    de: 'Apfel',
    ar: 'تفاحة',
    emoji: '🍎',
    color: '#E74C3C',
    gradient: ['#FF6B6B', '#C0392B'],
    article: 'der',
  },
  {
    id: 'kaese',
    de: 'Käse',
    ar: 'جبنة',
    emoji: '🧀',
    color: '#F4D03F',
    gradient: ['#F7DC6F', '#D4AC0D'],
    article: 'der',
  },
  {
    id: 'ei',
    de: 'Ei',
    ar: 'بيضة',
    emoji: '🥚',
    color: '#F5E6D3',
    gradient: ['#FDF2E9', '#E8D4C4'],
    article: 'das',
  },
  {
    id: 'kuchen',
    de: 'Kuchen',
    ar: 'كعكة',
    emoji: '🍰',
    color: '#E91E63',
    gradient: ['#F48FB1', '#C2185B'],
    article: 'der',
  },
];

// ═══════════════════════════════════════
// 🥤 المجموعة 2: الشرب
// ═══════════════════════════════════════
const FOOD_GROUP_2: FoodItem[] = [
  {
    id: 'wasser',
    de: 'Wasser',
    ar: 'ماء',
    emoji: '💧',
    color: '#3498DB',
    gradient: ['#5DADE2', '#2980B9'],
    article: 'das',
  },
  {
    id: 'milch',
    de: 'Milch',
    ar: 'حليب',
    emoji: '🥛',
    color: '#ECF0F1',
    gradient: ['#FFFFFF', '#D5DBDB'],
    article: 'die',
  },
  {
    id: 'saft',
    de: 'Saft',
    ar: 'عصير',
    emoji: '🧃',
    color: '#FF9800',
    gradient: ['#FFB74D', '#F57C00'],
    article: 'der',
  },
  {
    id: 'tee',
    de: 'Tee',
    ar: 'شاي',
    emoji: '🍵',
    color: '#8D6E63',
    gradient: ['#A1887F', '#6D4C41'],
    article: 'der',
  },
  {
    id: 'kakao',
    de: 'Kakao',
    ar: 'كاكاو',
    emoji: '☕',
    color: '#5D4037',
    gradient: ['#795548', '#3E2723'],
    article: 'der',
  },
];

// ═══════════════════════════════════════
// 🛒 المجموعة 3: التسوق
// ═══════════════════════════════════════
const FOOD_GROUP_3: FoodItem[] = [
  {
    id: 'markt',
    de: 'Markt',
    ar: 'سوق',
    emoji: '🏪',
    color: '#9C27B0',
    gradient: ['#BA68C8', '#7B1FA2'],
    article: 'der',
  },
  {
    id: 'geld',
    de: 'Geld',
    ar: 'فلوس',
    emoji: '💰',
    color: '#4CAF50',
    gradient: ['#81C784', '#388E3C'],
    article: 'das',
  },
  {
    id: 'tasche',
    de: 'Tasche',
    ar: 'شنطة',
    emoji: '👜',
    color: '#FF5722',
    gradient: ['#FF8A65', '#E64A19'],
    article: 'die',
  },
  {
    id: 'preis',
    de: 'Preis',
    ar: 'سعر',
    emoji: '🏷️',
    color: '#607D8B',
    gradient: ['#90A4AE', '#455A64'],
    article: 'der',
  },
  {
    id: 'danke',
    de: 'Danke',
    ar: 'شكراً',
    emoji: '🙏',
    color: '#E91E63',
    gradient: ['#F06292', '#C2185B'],
  },
];

// ═══════════════════════════════════════
// 📦 التصدير
// ═══════════════════════════════════════
export const FOOD_ITEMS_ALL: FoodItem[] = [
  ...FOOD_GROUP_1,
  ...FOOD_GROUP_2,
  ...FOOD_GROUP_3,
];

export const FOOD_GROUPS: FoodGroup[] = [
  {
    id: 1,
    title: 'الأكل 🍽️',
    titleDe: 'das Essen',
    items: FOOD_GROUP_1,
  },
  {
    id: 2,
    title: 'الشرب 🥤',
    titleDe: 'das Trinken',
    items: FOOD_GROUP_2,
  },
  {
    id: 3,
    title: 'التسوق 🛒',
    titleDe: 'der Einkauf',
    items: FOOD_GROUP_3,
  },
];

// صور الكروت (لو عندك صور مخصصة)
export const FOOD_IMAGES: Record<string, string> = {
  // 'brot': '/card-image/food/brot.webp',
  // 'apfel': '/card-image/food/apfel.webp',
  // ... إلخ
};

// صور الكلمات (لو عندك)
export const FOOD_WORD_IMAGES: Record<string, string> = {
  // 'Brot': '/card-image/food/brot-word.webp',
  // ... إلخ
};
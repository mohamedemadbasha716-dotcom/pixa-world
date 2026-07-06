// ═══════════════════════════════════════
// 🏫 بيانات درس المدرسة (Heidelberg School)
// ═══════════════════════════════════════

export type SchoolItem = {
  id: string;           // معرف فريد
  de: string;           // الكلمة بالألماني
  ar: string;           // الترجمة العربية
  emoji: string;        // إيموجي مؤقت (لحد ما الصور تجهز)
  article?: string;     // أداة التعريف (der/die/das) لو الكلمة اسم
  color: string;        // لون رئيسي
  gradient: [string, string]; // تدرّج لوني
};

export type SchoolGroup = {
  id: string;
  title: string;      // العنوان بالعربي
  titleDe: string;    // العنوان بالألماني
  emoji: string;
  items: SchoolItem[];
};

// ═══════════════════════════════════════
// 📚 المجموعة 1: داخل الفصل
// ═══════════════════════════════════════
const CLASSROOM_ITEMS: SchoolItem[] = [
  {
    id: 'stuhl',
    de: 'Stuhl',
    ar: 'كرسي',
    emoji: '🪑',
    article: 'der',
    color: '#FF6B6B',
    gradient: ['#FF8E8E', '#E94560'],
  },
  {
    id: 'tisch',
    de: 'Tisch',
    ar: 'مكتب',
    emoji: '🪟',
    article: 'der',
    color: '#4ECDC4',
    gradient: ['#6FE5DC', '#2BB5AB'],
  },
  {
    id: 'tafel',
    de: 'Tafel',
    ar: 'سبورة',
    emoji: '📋',
    article: 'die',
    color: '#45B7D1',
    gradient: ['#67CFE6', '#2B95B5'],
  },
  {
    id: 'fenster',
    de: 'Fenster',
    ar: 'شباك',
    emoji: '🪟',
    article: 'das',
    color: '#FFA07A',
    gradient: ['#FFB89E', '#E07F58'],
  },
  {
    id: 'tuer',
    de: 'Tür',
    ar: 'باب',
    emoji: '🚪',
    article: 'die',
    color: '#98D8C8',
    gradient: ['#B5E5D8', '#6FB8A8'],
  },
];

// ═══════════════════════════════════════
// ✏️ المجموعة 2: الأدوات المدرسية
// ═══════════════════════════════════════
const SUPPLIES_ITEMS: SchoolItem[] = [
  {
    id: 'buch',
    de: 'Buch',
    ar: 'كتاب',
    emoji: '📕',
    article: 'das',
    color: '#F7DC6F',
    gradient: ['#FAE89E', '#D4B83F'],
  },
  {
    id: 'stift',
    de: 'Stift',
    ar: 'قلم',
    emoji: '✏️',
    article: 'der',
    color: '#BB8FCE',
    gradient: ['#D0AEE0', '#9B6BB5'],
  },
  {
    id: 'heft',
    de: 'Heft',
    ar: 'كراسة',
    emoji: '📓',
    article: 'das',
    color: '#85C1E2',
    gradient: ['#A3D4ED', '#5A9FC4'],
  },
  {
    id: 'schultasche',
    de: 'Schultasche',
    ar: 'شنطة',
    emoji: '🎒',
    article: 'die',
    color: '#F8B739',
    gradient: ['#FAD06F', '#D49520'],
  },
  {
    id: 'lineal',
    de: 'Lineal',
    ar: 'مسطرة',
    emoji: '📏',
    article: 'das',
    color: '#52BE80',
    gradient: ['#7AD0A0', '#2F9758'],
  },
];

// ═══════════════════════════════════════
// 👨‍🏫 المجموعة 3: الأشخاص في المدرسة
// ═══════════════════════════════════════
const PEOPLE_ITEMS: SchoolItem[] = [
  {
    id: 'lehrer',
    de: 'Lehrer',
    ar: 'معلّم',
    emoji: '👨‍🏫',
    article: 'der',
    color: '#4CC9F0',
    gradient: ['#7DD9F5', '#2BA5D1'],
  },
  {
    id: 'lehrerin',
    de: 'Lehrerin',
    ar: 'معلّمة',
    emoji: '👩‍🏫',
    article: 'die',
    color: '#F72585',
    gradient: ['#FA5BA8', '#C70063'],
  },
  {
    id: 'schueler',
    de: 'Schüler',
    ar: 'تلميذ',
    emoji: '👦',
    article: 'der',
    color: '#7209B7',
    gradient: ['#9A2BD8', '#560792'],
  },
  {
    id: 'schuelerin',
    de: 'Schülerin',
    ar: 'تلميذة',
    emoji: '👧',
    article: 'die',
    color: '#FFD700',
    gradient: ['#FFE350', '#D4B100'],
  },
  {
    id: 'freund',
    de: 'Freund',
    ar: 'صديق',
    emoji: '🤝',
    article: 'der',
    color: '#06D6A0',
    gradient: ['#3FE5BA', '#02A578'],
  },
];

// ═══════════════════════════════════════
// 📦 تجميع المجموعات
// ═══════════════════════════════════════
export const SCHOOL_GROUPS: SchoolGroup[] = [
  {
    id: 'classroom',
    title: 'داخل الفصل',
    titleDe: 'Im Klassenzimmer',
    emoji: '📚',
    items: CLASSROOM_ITEMS,
  },
  {
    id: 'supplies',
    title: 'الأدوات المدرسية',
    titleDe: 'Schulsachen',
    emoji: '✏️',
    items: SUPPLIES_ITEMS,
  },
  {
    id: 'people',
    title: 'أشخاص المدرسة',
    titleDe: 'Personen in der Schule',
    emoji: '👨‍🏫',
    items: PEOPLE_ITEMS,
  },
];

// ═══════════════════════════════════════
// 📚 تجميع كل الكلمات في array واحد
// ═══════════════════════════════════════
export const SCHOOL_ITEMS: SchoolItem[] = SCHOOL_GROUPS.flatMap(g => g.items);

// ═══════════════════════════════════════
// 🖼️ خرائط الصور (مؤقتاً فارغة - تتملا لما الصور تجهز)
// ═══════════════════════════════════════
export const SCHOOL_IMAGES: Record<string, string> = {
  // 'stuhl': '/card-image/school/stuhl.webp',
  // 'tisch': '/card-image/school/tisch.webp',
  // ... إلخ
};

export const SCHOOL_WORD_IMAGES: Record<string, string> = {
  // 'Stuhl': '/card-image/school/stuhl-word.webp',
  // 'Tisch': '/card-image/school/tisch-word.webp',
  // ... إلخ
};
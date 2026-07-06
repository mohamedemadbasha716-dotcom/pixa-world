// 👕 دروس الملابس - شارع زيل (Die Zeil) في فرانكفورت
// المستوى: A1.2 | 15 كلمة موزعة على 3 مجموعات

export interface ClothesItem {
  id: string;
  de: string;          // الكلمة بالألماني (مع الـ Artikel)
  deBase: string;      // الكلمة بدون artikel (للكتابة)
  ar: string;          // الترجمة العربية
  artikel: 'der' | 'die' | 'das';  // جنس الكلمة
  plural: string;      // الجمع
  emoji: string;       // الإيموجي
  objAr: string;       // وصف عربي إضافي
  color: string;
  gradient: string[];
  exampleDe?: string;  // جملة تطبيقية
  exampleAr?: string;
}

export interface ClothesGroup {
  numbers: ClothesItem[];  // اسمها numbers عشان تتوافق مع الـ template
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 👕 المجموعة الأولى: الملابس العلوية
// ═══════════════════════════════════════
const GROUP_1_OBERTEILE: ClothesItem[] = [
  {
    id: 'cloth-1',
    de: 'Das T-Shirt',
    deBase: 'T-Shirt',
    ar: 'تي شيرت',
    artikel: 'das',
    plural: 'die T-Shirts',
    emoji: '👕',
    objAr: 'تي شيرت قطن',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#C92A2A'],
    exampleDe: 'Ich trage ein T-Shirt.',
    exampleAr: 'أنا ألبس تي شيرت.',
  },
  {
    id: 'cloth-2',
    de: 'Das Hemd',
    deBase: 'Hemd',
    ar: 'قميص',
    artikel: 'das',
    plural: 'die Hemden',
    emoji: '👔',
    objAr: 'قميص رسمي',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#0E7C7B'],
    exampleDe: 'Das Hemd ist weiß.',
    exampleAr: 'القميص أبيض.',
  },
  {
    id: 'cloth-3',
    de: 'Die Bluse',
    deBase: 'Bluse',
    ar: 'بلوزة',
    artikel: 'die',
    plural: 'die Blusen',
    emoji: '👚',
    objAr: 'بلوزة نسائية',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Die Bluse ist rosa.',
    exampleAr: 'البلوزة وردية.',
  },
  {
    id: 'cloth-4',
    de: 'Die Jacke',
    deBase: 'Jacke',
    ar: 'جاكيت',
    artikel: 'die',
    plural: 'die Jacken',
    emoji: '🧥',
    objAr: 'جاكيت شتوي',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Ich brauche eine Jacke.',
    exampleAr: 'أنا محتاج جاكيت.',
  },
  {
    id: 'cloth-5',
    de: 'Der Pullover',
    deBase: 'Pullover',
    ar: 'بلوفر',
    artikel: 'der',
    plural: 'die Pullover',
    emoji: '🧶',
    objAr: 'بلوفر صوف',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Der Pullover ist warm.',
    exampleAr: 'البلوفر دافي.',
  },
];

// ═══════════════════════════════════════
// 👖 المجموعة الثانية: الملابس السفلية والأحذية
// ═══════════════════════════════════════
const GROUP_2_UNTERTEILE: ClothesItem[] = [
  {
    id: 'cloth-6',
    de: 'Die Hose',
    deBase: 'Hose',
    ar: 'بنطلون',
    artikel: 'die',
    plural: 'die Hosen',
    emoji: '👖',
    objAr: 'بنطلون عادي',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#2563EB'],
    exampleDe: 'Die Hose ist neu.',
    exampleAr: 'البنطلون جديد.',
  },
  {
    id: 'cloth-7',
    de: 'Die Jeans',
    deBase: 'Jeans',
    ar: 'جينز',
    artikel: 'die',
    plural: 'die Jeans',
    emoji: '👖',
    objAr: 'جينز أزرق',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Meine Jeans ist blau.',
    exampleAr: 'الجينز بتاعي أزرق.',
  },
  {
    id: 'cloth-8',
    de: 'Der Rock',
    deBase: 'Rock',
    ar: 'تنورة',
    artikel: 'der',
    plural: 'die Röcke',
    emoji: '👗',
    objAr: 'تنورة قصيرة',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Der Rock ist lang.',
    exampleAr: 'التنورة طويلة.',
  },
  {
    id: 'cloth-9',
    de: 'Das Kleid',
    deBase: 'Kleid',
    ar: 'فستان',
    artikel: 'das',
    plural: 'die Kleider',
    emoji: '👗',
    objAr: 'فستان جميل',
    color: '#F87171',
    gradient: ['#F87171', '#DC2626'],
    exampleDe: 'Das Kleid ist schön.',
    exampleAr: 'الفستان حلو.',
  },
  {
    id: 'cloth-10',
    de: 'Die Schuhe',
    deBase: 'Schuhe',
    ar: 'حذاء',
    artikel: 'die',
    plural: 'die Schuhe',
    emoji: '👟',
    objAr: 'حذاء رياضي',
    color: '#34D399',
    gradient: ['#34D399', '#059669'],
    exampleDe: 'Meine Schuhe sind neu.',
    exampleAr: 'الجزمة بتاعتي جديدة.',
  },
];

// ═══════════════════════════════════════
// 🧣 المجموعة الثالثة: الإكسسوارات
// ═══════════════════════════════════════
const GROUP_3_ACCESSOIRES: ClothesItem[] = [
  {
    id: 'cloth-11',
    de: 'Der Hut',
    deBase: 'Hut',
    ar: 'قبعة',
    artikel: 'der',
    plural: 'die Hüte',
    emoji: '🎩',
    objAr: 'قبعة أنيقة',
    color: '#92400E',
    gradient: ['#D97706', '#92400E'],
    exampleDe: 'Der Hut ist groß.',
    exampleAr: 'القبعة كبيرة.',
  },
  {
    id: 'cloth-12',
    de: 'Die Mütze',
    deBase: 'Mütze',
    ar: 'طاقية',
    artikel: 'die',
    plural: 'die Mützen',
    emoji: '🧢',
    objAr: 'طاقية شتوية',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Die Mütze ist warm.',
    exampleAr: 'الطاقية دافية.',
  },
  {
    id: 'cloth-13',
    de: 'Der Schal',
    deBase: 'Schal',
    ar: 'كوفية',
    artikel: 'der',
    plural: 'die Schals',
    emoji: '🧣',
    objAr: 'كوفية صوف',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Der Schal ist rot.',
    exampleAr: 'الكوفية حمرا.',
  },
  {
    id: 'cloth-14',
    de: 'Die Socken',
    deBase: 'Socken',
    ar: 'شراب',
    artikel: 'die',
    plural: 'die Socken',
    emoji: '🧦',
    objAr: 'شراب قطن',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Die Socken sind bunt.',
    exampleAr: 'الشراب ملون.',
  },
  {
    id: 'cloth-15',
    de: 'Die Handschuhe',
    deBase: 'Handschuhe',
    ar: 'قفازات',
    artikel: 'die',
    plural: 'die Handschuhe',
    emoji: '🧤',
    objAr: 'قفازات شتوية',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Die Handschuhe sind warm.',
    exampleAr: 'القفازات دافية.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const CLOTHES: ClothesItem[] = [
  ...GROUP_1_OBERTEILE,
  ...GROUP_2_UNTERTEILE,
  ...GROUP_3_ACCESSOIRES,
];

export const CLOTHES_GROUPS: ClothesGroup[] = [
  {
    numbers: GROUP_1_OBERTEILE,
    title: 'الملابس العلوية',
    titleDe: 'Oberteile',
    description: 'الحاجات اللي بنلبسها فوق',
  },
  {
    numbers: GROUP_2_UNTERTEILE,
    title: 'الملابس السفلية والأحذية',
    titleDe: 'Unterteile & Schuhe',
    description: 'الحاجات اللي بنلبسها تحت',
  },
  {
    numbers: GROUP_3_ACCESSOIRES,
    title: 'الإكسسوارات',
    titleDe: 'Accessoires',
    description: 'الحاجات الإضافية',
  },
];
// 🏛️ دروس الأماكن - بوابة براندنبورغ (Brandenburger Tor)
// المستوى: A2.1 | 15 كلمة موزعة على 3 مجموعات

export interface PlaceItem {
  id: string;
  de: string;          // الكلمة بالألماني (مع الـ Artikel)
  deBase: string;      // الكلمة بدون artikel (للكتابة)
  ar: string;          // الترجمة العربية
  artikel: 'der' | 'die' | 'das';
  plural: string;      // الجمع
  emoji: string;
  objAr: string;       // وصف عربي إضافي
  color: string;
  gradient: string[];
  exampleDe?: string;  // جملة تطبيقية
  exampleAr?: string;
}

export interface PlaceGroup {
  numbers: PlaceItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🎨 المجموعة الأولى: الأماكن العامة والثقافية
// ═══════════════════════════════════════
const GROUP_1_KULTUR: PlaceItem[] = [
  {
    id: 'place-1',
    de: 'Das Museum',
    deBase: 'Museum',
    ar: 'متحف',
    artikel: 'das',
    plural: 'die Museen',
    emoji: '🏛️',
    objAr: 'متحف فني',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#5B21B6'],
    exampleDe: 'Das Museum ist groß.',
    exampleAr: 'المتحف كبير.',
  },
  {
    id: 'place-2',
    de: 'Das Theater',
    deBase: 'Theater',
    ar: 'مسرح',
    artikel: 'das',
    plural: 'die Theater',
    emoji: '🎭',
    objAr: 'مسرح للعروض',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Ich gehe ins Theater.',
    exampleAr: 'أنا رايح المسرح.',
  },
  {
    id: 'place-3',
    de: 'Das Kino',
    deBase: 'Kino',
    ar: 'سينما',
    artikel: 'das',
    plural: 'die Kinos',
    emoji: '🎬',
    objAr: 'دار العرض',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Das Kino ist neu.',
    exampleAr: 'السينما جديدة.',
  },
  {
    id: 'place-4',
    de: 'Die Bibliothek',
    deBase: 'Bibliothek',
    ar: 'مكتبة',
    artikel: 'die',
    plural: 'die Bibliotheken',
    emoji: '📚',
    objAr: 'مكتبة عامة',
    color: '#92400E',
    gradient: ['#D97706', '#92400E'],
    exampleDe: 'Die Bibliothek ist ruhig.',
    exampleAr: 'المكتبة هادية.',
  },
  {
    id: 'place-5',
    de: 'Das Restaurant',
    deBase: 'Restaurant',
    ar: 'مطعم',
    artikel: 'das',
    plural: 'die Restaurants',
    emoji: '🍽️',
    objAr: 'مطعم أكل',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#B45309'],
    exampleDe: 'Das Restaurant ist gut.',
    exampleAr: 'المطعم كويس.',
  },
];

// ═══════════════════════════════════════
// 🏢 المجموعة الثانية: المباني الحكومية والخدمية
// ═══════════════════════════════════════
const GROUP_2_DIENST: PlaceItem[] = [
  {
    id: 'place-6',
    de: 'Die Bank',
    deBase: 'Bank',
    ar: 'بنك',
    artikel: 'die',
    plural: 'die Banken',
    emoji: '🏦',
    objAr: 'بنك للأموال',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Die Bank ist offen.',
    exampleAr: 'البنك مفتوح.',
  },
  {
    id: 'place-7',
    de: 'Die Post',
    deBase: 'Post',
    ar: 'مكتب بريد',
    artikel: 'die',
    plural: 'die Posten',
    emoji: '📮',
    objAr: 'مكتب البريد',
    color: '#EAB308',
    gradient: ['#FBBF24', '#A16207'],
    exampleDe: 'Wo ist die Post?',
    exampleAr: 'فين مكتب البريد؟',
  },
  {
    id: 'place-8',
    de: 'Das Krankenhaus',
    deBase: 'Krankenhaus',
    ar: 'مستشفى',
    artikel: 'das',
    plural: 'die Krankenhäuser',
    emoji: '🏥',
    objAr: 'مستشفى كبير',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Das Krankenhaus ist groß.',
    exampleAr: 'المستشفى كبير.',
  },
  {
    id: 'place-9',
    de: 'Die Apotheke',
    deBase: 'Apotheke',
    ar: 'صيدلية',
    artikel: 'die',
    plural: 'die Apotheken',
    emoji: '💊',
    objAr: 'صيدلية للدواء',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Die Apotheke ist nah.',
    exampleAr: 'الصيدلية قريبة.',
  },
  {
    id: 'place-10',
    de: 'Die Polizei',
    deBase: 'Polizei',
    ar: 'قسم شرطة',
    artikel: 'die',
    plural: 'die Polizei',
    emoji: '👮',
    objAr: 'قسم الشرطة',
    color: '#1E40AF',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Die Polizei hilft uns.',
    exampleAr: 'الشرطة بتساعدنا.',
  },
];

// ═══════════════════════════════════════
// 🌳 المجموعة الثالثة: الأماكن الترفيهية والطبيعية
// ═══════════════════════════════════════
const GROUP_3_NATUR: PlaceItem[] = [
  {
    id: 'place-11',
    de: 'Der Park',
    deBase: 'Park',
    ar: 'حديقة',
    artikel: 'der',
    plural: 'die Parks',
    emoji: '🌳',
    objAr: 'حديقة عامة',
    color: '#84CC16',
    gradient: ['#84CC16', '#4D7C0F'],
    exampleDe: 'Der Park ist schön.',
    exampleAr: 'الحديقة جميلة.',
  },
  {
    id: 'place-12',
    de: 'Der Zoo',
    deBase: 'Zoo',
    ar: 'حديقة حيوان',
    artikel: 'der',
    plural: 'die Zoos',
    emoji: '🦁',
    objAr: 'حديقة الحيوان',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    exampleDe: 'Wir gehen in den Zoo.',
    exampleAr: 'إحنا رايحين حديقة الحيوان.',
  },
  {
    id: 'place-13',
    de: 'Der Strand',
    deBase: 'Strand',
    ar: 'شاطئ',
    artikel: 'der',
    plural: 'die Strände',
    emoji: '🏖️',
    objAr: 'شاطئ البحر',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Der Strand ist warm.',
    exampleAr: 'الشاطئ دافي.',
  },
  {
    id: 'place-14',
    de: 'Das Schwimmbad',
    deBase: 'Schwimmbad',
    ar: 'حمام سباحة',
    artikel: 'das',
    plural: 'die Schwimmbäder',
    emoji: '🏊',
    objAr: 'حمام سباحة',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Das Schwimmbad ist groß.',
    exampleAr: 'حمام السباحة كبير.',
  },
  {
    id: 'place-15',
    de: 'Die Kirche',
    deBase: 'Kirche',
    ar: 'كنيسة',
    artikel: 'die',
    plural: 'die Kirchen',
    emoji: '⛪',
    objAr: 'كنيسة',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Die Kirche ist alt.',
    exampleAr: 'الكنيسة قديمة.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const PLACES: PlaceItem[] = [
  ...GROUP_1_KULTUR,
  ...GROUP_2_DIENST,
  ...GROUP_3_NATUR,
];

export const PLACES_GROUPS: PlaceGroup[] = [
  {
    numbers: GROUP_1_KULTUR,
    title: 'الأماكن الثقافية',
    titleDe: 'Kulturelle Orte',
    description: 'أماكن الترفيه والثقافة',
  },
  {
    numbers: GROUP_2_DIENST,
    title: 'المباني الخدمية',
    titleDe: 'Dienstleistungen',
    description: 'أماكن الخدمات اليومية',
  },
  {
    numbers: GROUP_3_NATUR,
    title: 'الأماكن الترفيهية',
    titleDe: 'Freizeit & Natur',
    description: 'أماكن الترفيه والطبيعة',
  },
];
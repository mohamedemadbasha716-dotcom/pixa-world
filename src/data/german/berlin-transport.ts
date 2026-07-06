// 🚆 دروس المواصلات - محطة برلين المركزية (Berlin Hauptbahnhof)
// المستوى: A2.1 | 15 كلمة موزعة على 3 مجموعات

export interface TransportItem {
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

export interface TransportGroup {
  numbers: TransportItem[];  // اسمها numbers عشان تتوافق مع الـ template
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🚆 المجموعة الأولى: المواصلات العامة
// ═══════════════════════════════════════
const GROUP_1_OEFFENTLICH: TransportItem[] = [
  {
    id: 'transport-1',
    de: 'Der Zug',
    deBase: 'Zug',
    ar: 'قطار',
    artikel: 'der',
    plural: 'die Züge',
    emoji: '🚆',
    objAr: 'قطار سريع',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Der Zug ist schnell.',
    exampleAr: 'القطار سريع.',
  },
  {
    id: 'transport-2',
    de: 'Der Bus',
    deBase: 'Bus',
    ar: 'أوتوبيس',
    artikel: 'der',
    plural: 'die Busse',
    emoji: '🚌',
    objAr: 'أوتوبيس المدينة',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Ich fahre mit dem Bus.',
    exampleAr: 'أنا براكب الأوتوبيس.',
  },
  {
    id: 'transport-3',
    de: 'Die U-Bahn',
    deBase: 'U-Bahn',
    ar: 'مترو الأنفاق',
    artikel: 'die',
    plural: 'die U-Bahnen',
    emoji: '🚇',
    objAr: 'مترو تحت الأرض',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Die U-Bahn ist schnell.',
    exampleAr: 'المترو سريع.',
  },
  {
    id: 'transport-4',
    de: 'Die S-Bahn',
    deBase: 'S-Bahn',
    ar: 'قطار خفيف',
    artikel: 'die',
    plural: 'die S-Bahnen',
    emoji: '🚊',
    objAr: 'قطار المدينة الخفيف',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Die S-Bahn fährt jede Stunde.',
    exampleAr: 'القطار الخفيف بيمشي كل ساعة.',
  },
  {
    id: 'transport-5',
    de: 'Das Taxi',
    deBase: 'Taxi',
    ar: 'تاكسي',
    artikel: 'das',
    plural: 'die Taxis',
    emoji: '🚕',
    objAr: 'تاكسي أصفر',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#B45309'],
    exampleDe: 'Wir nehmen ein Taxi.',
    exampleAr: 'إحنا هناخد تاكسي.',
  },
];

// ═══════════════════════════════════════
// 🚲 المجموعة الثانية: المواصلات الخاصة
// ═══════════════════════════════════════
const GROUP_2_PRIVAT: TransportItem[] = [
  {
    id: 'transport-6',
    de: 'Das Auto',
    deBase: 'Auto',
    ar: 'عربية',
    artikel: 'das',
    plural: 'die Autos',
    emoji: '🚗',
    objAr: 'عربية ملاكي',
    color: '#EF4444',
    gradient: ['#EF4444', '#991B1B'],
    exampleDe: 'Mein Auto ist rot.',
    exampleAr: 'عربيتي حمرا.',
  },
  {
    id: 'transport-7',
    de: 'Das Fahrrad',
    deBase: 'Fahrrad',
    ar: 'دراجة',
    artikel: 'das',
    plural: 'die Fahrräder',
    emoji: '🚲',
    objAr: 'دراجة هوائية',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Ich fahre Fahrrad.',
    exampleAr: 'أنا براكب الدراجة.',
  },
  {
    id: 'transport-8',
    de: 'Das Motorrad',
    deBase: 'Motorrad',
    ar: 'موتوسيكل',
    artikel: 'das',
    plural: 'die Motorräder',
    emoji: '🏍️',
    objAr: 'موتوسيكل كبير',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#5B21B6'],
    exampleDe: 'Das Motorrad ist laut.',
    exampleAr: 'الموتوسيكل صوته عالي.',
  },
  {
    id: 'transport-9',
    de: 'Das Flugzeug',
    deBase: 'Flugzeug',
    ar: 'طيارة',
    artikel: 'das',
    plural: 'die Flugzeuge',
    emoji: '✈️',
    objAr: 'طيارة كبيرة',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Das Flugzeug fliegt hoch.',
    exampleAr: 'الطيارة بتطير عالي.',
  },
  {
    id: 'transport-10',
    de: 'Das Schiff',
    deBase: 'Schiff',
    ar: 'مركب',
    artikel: 'das',
    plural: 'die Schiffe',
    emoji: '🚢',
    objAr: 'مركب كبير',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Das Schiff ist groß.',
    exampleAr: 'المركب كبير.',
  },
];

// ═══════════════════════════════════════
// 🎫 المجموعة الثالثة: محطات وتذاكر
// ═══════════════════════════════════════
const GROUP_3_BAHNHOF: TransportItem[] = [
  {
    id: 'transport-11',
    de: 'Der Bahnhof',
    deBase: 'Bahnhof',
    ar: 'محطة قطار',
    artikel: 'der',
    plural: 'die Bahnhöfe',
    emoji: '🚉',
    objAr: 'محطة القطارات',
    color: '#92400E',
    gradient: ['#D97706', '#92400E'],
    exampleDe: 'Der Bahnhof ist groß.',
    exampleAr: 'المحطة كبيرة.',
  },
  {
    id: 'transport-12',
    de: 'Die Haltestelle',
    deBase: 'Haltestelle',
    ar: 'موقف أوتوبيس',
    artikel: 'die',
    plural: 'die Haltestellen',
    emoji: '🚏',
    objAr: 'موقف الأوتوبيس',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    exampleDe: 'Wo ist die Haltestelle?',
    exampleAr: 'فين الموقف؟',
  },
  {
    id: 'transport-13',
    de: 'Das Ticket',
    deBase: 'Ticket',
    ar: 'تذكرة',
    artikel: 'das',
    plural: 'die Tickets',
    emoji: '🎫',
    objAr: 'تذكرة سفر',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Ich kaufe ein Ticket.',
    exampleAr: 'أنا بشتري تذكرة.',
  },
  {
    id: 'transport-14',
    de: 'Der Fahrplan',
    deBase: 'Fahrplan',
    ar: 'جدول مواعيد',
    artikel: 'der',
    plural: 'die Fahrpläne',
    emoji: '📋',
    objAr: 'جدول مواعيد المواصلات',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Der Fahrplan ist hier.',
    exampleAr: 'جدول المواعيد هنا.',
  },
  {
    id: 'transport-15',
    de: 'Die Reise',
    deBase: 'Reise',
    ar: 'رحلة',
    artikel: 'die',
    plural: 'die Reisen',
    emoji: '🧳',
    objAr: 'رحلة سفر',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Gute Reise!',
    exampleAr: 'رحلة سعيدة!',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const TRANSPORTS: TransportItem[] = [
  ...GROUP_1_OEFFENTLICH,
  ...GROUP_2_PRIVAT,
  ...GROUP_3_BAHNHOF,
];

export const TRANSPORTS_GROUPS: TransportGroup[] = [
  {
    numbers: GROUP_1_OEFFENTLICH,
    title: 'المواصلات العامة',
    titleDe: 'Öffentliche Verkehrsmittel',
    description: 'وسائل النقل اللي بنركبها مع الناس',
  },
  {
    numbers: GROUP_2_PRIVAT,
    title: 'المواصلات الخاصة',
    titleDe: 'Private Verkehrsmittel',
    description: 'وسائل النقل الشخصية',
  },
  {
    numbers: GROUP_3_BAHNHOF,
    title: 'المحطات والتذاكر',
    titleDe: 'Bahnhof und Tickets',
    description: 'كل اللي بتحتاجه في رحلتك',
  },
];
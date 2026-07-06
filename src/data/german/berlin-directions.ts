// 🧭 دروس الاتجاهات - جزيرة المتاحف (Museumsinsel)
// المستوى: A2.1 | 15 كلمة/عبارة موزعة على 3 مجموعات

export interface DirectionItem {
  id: string;
  de: string;
  deBase: string;
  ar: string;
  artikel?: 'der' | 'die' | 'das';
  plural?: string;
  emoji: string;
  objAr: string;
  color: string;
  gradient: string[];
  exampleDe?: string;
  exampleAr?: string;
  acceptedAnswers?: string[];
}

export interface DirectionGroup {
  numbers: DirectionItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🧭 المجموعة الأولى: الاتجاهات الأساسية
// ═══════════════════════════════════════
const GROUP_1_BASIC: DirectionItem[] = [
  {
    id: 'dir-1',
    de: 'links',
    deBase: 'links',
    ar: 'يسار',
    emoji: '⬅️',
    objAr: 'اتجاه اليسار',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#0077B6'],
    exampleDe: 'Geh links!',
    exampleAr: 'روح يسار!',
    acceptedAnswers: ['links', 'nach links'],
  },
  {
    id: 'dir-2',
    de: 'rechts',
    deBase: 'rechts',
    ar: 'يمين',
    emoji: '➡️',
    objAr: 'اتجاه اليمين',
    color: '#F72585',
    gradient: ['#F72585', '#B5179E'],
    exampleDe: 'Bieg rechts ab!',
    exampleAr: 'اعطف يمين!',
    acceptedAnswers: ['rechts', 'nach rechts'],
  },
  {
    id: 'dir-3',
    de: 'geradeaus',
    deBase: 'geradeaus',
    ar: 'تودتودت',
    emoji: '⬆️',
    objAr: 'تودتودت مباشرة',
    color: '#7209B7',
    gradient: ['#7209B7', '#560BAD'],
    exampleDe: 'Geh geradeaus!',
    exampleAr: 'روح تودتودت!',
    acceptedAnswers: ['geradeaus'],
  },
  {
    id: 'dir-4',
    de: 'zurück',
    deBase: 'zurück',
    ar: 'للخلف',
    emoji: '🔙',
    objAr: 'الرجوع للخلف',
    color: '#F77F00',
    gradient: ['#F77F00', '#D62828'],
    exampleDe: 'Geh zurück!',
    exampleAr: 'ارجع للخلف!',
    acceptedAnswers: ['zurück', 'nach hinten'],
  },
  {
    id: 'dir-5',
    de: 'hier',
    deBase: 'hier',
    ar: 'هنا',
    emoji: '📍',
    objAr: 'هذا المكان',
    color: '#06D6A0',
    gradient: ['#06D6A0', '#028A5B'],
    exampleDe: 'Ich bin hier.',
    exampleAr: 'أنا هنا.',
    acceptedAnswers: ['hier'],
  },
];

// ═══════════════════════════════════════
// 🗺️ المجموعة الثانية: الأماكن والمواقع
// ═══════════════════════════════════════
const GROUP_2_PLACES: DirectionItem[] = [
  {
    id: 'dir-6',
    de: 'Die Straße',
    deBase: 'Straße',
    ar: 'شارع',
    artikel: 'die',
    plural: 'die Straßen',
    emoji: '🛣️',
    objAr: 'الشارع الرئيسي',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Die Straße ist lang.',
    exampleAr: 'الشارع طويل.',
    acceptedAnswers: ['Straße', 'straße'],
  },
  {
    id: 'dir-7',
    de: 'Die Brücke',
    deBase: 'Brücke',
    ar: 'كوبري',
    artikel: 'die',
    plural: 'die Brücken',
    emoji: '🌉',
    objAr: 'الكوبري فوق النهر',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Geh über die Brücke!',
    exampleAr: 'عدي على الكوبري!',
    acceptedAnswers: ['Brücke', 'brücke'],
  },
  {
    id: 'dir-8',
    de: 'Der Platz',
    deBase: 'Platz',
    ar: 'ميدان',
    artikel: 'der',
    plural: 'die Plätze',
    emoji: '🏛️',
    objAr: 'الميدان المركزي',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Der Platz ist groß.',
    exampleAr: 'الميدان كبير.',
    acceptedAnswers: ['Platz'],
  },
  {
    id: 'dir-9',
    de: 'Die Ecke',
    deBase: 'Ecke',
    ar: 'ركن / زاوية',
    artikel: 'die',
    plural: 'die Ecken',
    emoji: '🔄',
    objAr: 'ركن الشارع',
    color: '#34D399',
    gradient: ['#34D399', '#059669'],
    exampleDe: 'An der Ecke links!',
    exampleAr: 'عند الركن يسار!',
    acceptedAnswers: ['Ecke', 'ecke'],
  },
  {
    id: 'dir-10',
    de: 'Die Ampel',
    deBase: 'Ampel',
    ar: 'إشارة المرور',
    artikel: 'die',
    plural: 'die Ampeln',
    emoji: '🚦',
    objAr: 'إشارة المرور الحمراء',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    exampleDe: 'Bei der Ampel rechts!',
    exampleAr: 'عند الإشارة يمين!',
    acceptedAnswers: ['Ampel', 'ampel'],
  },
];

// ═══════════════════════════════════════
// 🗣️ المجموعة الثالثة: جمل الاستفسار
// ═══════════════════════════════════════
const GROUP_3_PHRASES: DirectionItem[] = [
  {
    id: 'dir-11',
    de: 'Wo ist das?',
    deBase: 'Wo ist das',
    ar: 'فين ده؟',
    emoji: '❓',
    objAr: 'سؤال عن مكان',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#2563EB'],
    exampleDe: 'Entschuldigung, wo ist das?',
    exampleAr: 'معلش، فين ده؟',
    acceptedAnswers: ['Wo ist das', 'wo ist das', 'Wo ist das?'],
  },
  {
    id: 'dir-12',
    de: 'Wie weit ist es?',
    deBase: 'Wie weit ist es',
    ar: 'بعيد قد إيه؟',
    emoji: '📏',
    objAr: 'سؤال عن المسافة',
    color: '#FB923C',
    gradient: ['#FB923C', '#EA580C'],
    exampleDe: 'Wie weit ist es zum Bahnhof?',
    exampleAr: 'المحطة بعيدة قد إيه؟',
    acceptedAnswers: ['Wie weit ist es', 'wie weit ist es'],
  },
  {
    id: 'dir-13',
    de: 'nah',
    deBase: 'nah',
    ar: 'قريب',
    emoji: '🎯',
    objAr: 'المكان القريب',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Es ist nah.',
    exampleAr: 'ده قريب.',
    acceptedAnswers: ['nah', 'nahe'],
  },
  {
    id: 'dir-14',
    de: 'weit',
    deBase: 'weit',
    ar: 'بعيد',
    emoji: '🌄',
    objAr: 'المكان البعيد',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Es ist weit.',
    exampleAr: 'ده بعيد.',
    acceptedAnswers: ['weit'],
  },
  {
    id: 'dir-15',
    de: 'geradeaus gehen',
    deBase: 'geradeaus gehen',
    ar: 'يمشي تودتودت',
    emoji: '🚶',
    objAr: 'المشي للأمام',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Sie müssen geradeaus gehen.',
    exampleAr: 'لازم تمشي تودتودت.',
    acceptedAnswers: ['geradeaus gehen', 'Geradeaus gehen'],
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const DIRECTIONS: DirectionItem[] = [
  ...GROUP_1_BASIC,
  ...GROUP_2_PLACES,
  ...GROUP_3_PHRASES,
];

export const DIRECTION_GROUPS: DirectionGroup[] = [
  {
    numbers: GROUP_1_BASIC,
    title: 'الاتجاهات الأساسية',
    titleDe: 'Grundrichtungen',
    description: 'يمين، يسار، تودتودت',
  },
  {
    numbers: GROUP_2_PLACES,
    title: 'الأماكن والطرق',
    titleDe: 'Orte und Wege',
    description: 'الشارع، الكوبري، الميدان',
  },
  {
    numbers: GROUP_3_PHRASES,
    title: 'جمل الاستفسار',
    titleDe: 'Fragen und Antworten',
    description: 'كيف تسأل عن الطريق',
  },
];
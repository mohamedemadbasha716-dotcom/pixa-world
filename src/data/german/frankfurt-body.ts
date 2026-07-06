// 🦴 دروس أجزاء الجسم - متحف زنكنبرغ (Senckenberg Museum) في فرانكفورت
// المستوى: A1.2 | 15 كلمة موزعة على 3 مجموعات

export interface BodyItem {
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

export interface BodyGroup {
  numbers: BodyItem[];  // اسمها numbers عشان تتوافق مع الـ template
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🙂 المجموعة الأولى: الرأس والوجه
// ═══════════════════════════════════════
const GROUP_1_KOPF: BodyItem[] = [
  {
    id: 'body-1',
    de: 'Der Kopf',
    deBase: 'Kopf',
    ar: 'رأس',
    artikel: 'der',
    plural: 'die Köpfe',
    emoji: '🗣️',
    objAr: 'الرأس',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#C92A2A'],
    exampleDe: 'Mein Kopf ist groß.',
    exampleAr: 'راسي كبيرة.',
  },
  {
    id: 'body-2',
    de: 'Das Auge',
    deBase: 'Auge',
    ar: 'عين',
    artikel: 'das',
    plural: 'die Augen',
    emoji: '👁️',
    objAr: 'العين',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#0E7C7B'],
    exampleDe: 'Mein Auge ist blau.',
    exampleAr: 'عيني زرقا.',
  },
  {
    id: 'body-3',
    de: 'Das Ohr',
    deBase: 'Ohr',
    ar: 'أذن',
    artikel: 'das',
    plural: 'die Ohren',
    emoji: '👂',
    objAr: 'الأذن',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Ich höre mit dem Ohr.',
    exampleAr: 'أنا بسمع بالأذن.',
  },
  {
    id: 'body-4',
    de: 'Die Nase',
    deBase: 'Nase',
    ar: 'أنف',
    artikel: 'die',
    plural: 'die Nasen',
    emoji: '👃',
    objAr: 'الأنف',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Die Nase ist klein.',
    exampleAr: 'الأنف صغير.',
  },
  {
    id: 'body-5',
    de: 'Der Mund',
    deBase: 'Mund',
    ar: 'فم',
    artikel: 'der',
    plural: 'die Münder',
    emoji: '👄',
    objAr: 'الفم',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Öffne den Mund!',
    exampleAr: 'افتح فمك!',
  },
];

// ═══════════════════════════════════════
// 💪 المجموعة الثانية: الجزء العلوي
// ═══════════════════════════════════════
const GROUP_2_OBERKOERPER: BodyItem[] = [
  {
    id: 'body-6',
    de: 'Der Zahn',
    deBase: 'Zahn',
    ar: 'سن',
    artikel: 'der',
    plural: 'die Zähne',
    emoji: '🦷',
    objAr: 'السن',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#2563EB'],
    exampleDe: 'Der Zahn ist weiß.',
    exampleAr: 'السن أبيض.',
  },
  {
    id: 'body-7',
    de: 'Der Hals',
    deBase: 'Hals',
    ar: 'رقبة',
    artikel: 'der',
    plural: 'die Hälse',
    emoji: '🦒',
    objAr: 'الرقبة',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Mein Hals tut weh.',
    exampleAr: 'رقبتي بتوجعني.',
  },
  {
    id: 'body-8',
    de: 'Die Schulter',
    deBase: 'Schulter',
    ar: 'كتف',
    artikel: 'die',
    plural: 'die Schultern',
    emoji: '🤷',
    objAr: 'الكتف',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Meine Schulter ist stark.',
    exampleAr: 'كتفي قوية.',
  },
  {
    id: 'body-9',
    de: 'Der Arm',
    deBase: 'Arm',
    ar: 'ذراع',
    artikel: 'der',
    plural: 'die Arme',
    emoji: '💪',
    objAr: 'الذراع',
    color: '#F87171',
    gradient: ['#F87171', '#DC2626'],
    exampleDe: 'Der Arm ist lang.',
    exampleAr: 'الذراع طويل.',
  },
  {
    id: 'body-10',
    de: 'Die Hand',
    deBase: 'Hand',
    ar: 'يد',
    artikel: 'die',
    plural: 'die Hände',
    emoji: '✋',
    objAr: 'اليد',
    color: '#34D399',
    gradient: ['#34D399', '#059669'],
    exampleDe: 'Ich wasche meine Hand.',
    exampleAr: 'أنا بغسل إيدي.',
  },
];

// ═══════════════════════════════════════
// 🦵 المجموعة الثالثة: الجزء السفلي
// ═══════════════════════════════════════
const GROUP_3_UNTERKOERPER: BodyItem[] = [
  {
    id: 'body-11',
    de: 'Der Finger',
    deBase: 'Finger',
    ar: 'إصبع',
    artikel: 'der',
    plural: 'die Finger',
    emoji: '☝️',
    objAr: 'الإصبع',
    color: '#92400E',
    gradient: ['#D97706', '#92400E'],
    exampleDe: 'Ich habe zehn Finger.',
    exampleAr: 'أنا عندي عشر صوابع.',
  },
  {
    id: 'body-12',
    de: 'Der Bauch',
    deBase: 'Bauch',
    ar: 'بطن',
    artikel: 'der',
    plural: 'die Bäuche',
    emoji: '🤰',
    objAr: 'البطن',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Mein Bauch ist voll.',
    exampleAr: 'بطني مليان.',
  },
  {
    id: 'body-13',
    de: 'Das Bein',
    deBase: 'Bein',
    ar: 'ساق',
    artikel: 'das',
    plural: 'die Beine',
    emoji: '🦵',
    objAr: 'الساق',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Das Bein ist stark.',
    exampleAr: 'الساق قوية.',
  },
  {
    id: 'body-14',
    de: 'Das Knie',
    deBase: 'Knie',
    ar: 'ركبة',
    artikel: 'das',
    plural: 'die Knie',
    emoji: '🦿',
    objAr: 'الركبة',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Mein Knie tut weh.',
    exampleAr: 'ركبتي بتوجعني.',
  },
  {
    id: 'body-15',
    de: 'Der Fuß',
    deBase: 'Fuß',
    ar: 'قدم',
    artikel: 'der',
    plural: 'die Füße',
    emoji: '🦶',
    objAr: 'القدم',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Der Fuß ist groß.',
    exampleAr: 'القدم كبيرة.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const BODY_PARTS: BodyItem[] = [
  ...GROUP_1_KOPF,
  ...GROUP_2_OBERKOERPER,
  ...GROUP_3_UNTERKOERPER,
];

export const BODY_GROUPS: BodyGroup[] = [
  {
    numbers: GROUP_1_KOPF,
    title: 'الرأس والوجه',
    titleDe: 'Kopf und Gesicht',
    description: 'أجزاء الرأس والوجه',
  },
  {
    numbers: GROUP_2_OBERKOERPER,
    title: 'الجزء العلوي',
    titleDe: 'Oberkörper',
    description: 'أجزاء الجسم العلوية',
  },
  {
    numbers: GROUP_3_UNTERKOERPER,
    title: 'الجزء السفلي',
    titleDe: 'Unterkörper',
    description: 'أجزاء الجسم السفلية',
  },
];
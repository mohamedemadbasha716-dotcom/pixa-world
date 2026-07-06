// 🌍 دروس الدول والجنسيات - حي السفارات (Botschaftsviertel)
// المستوى: A2.1 | 15 كلمة موزعة على 3 مجموعات

export interface CountryItem {
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

export interface CountryGroup {
  numbers: CountryItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🌍 المجموعة الأولى: الدول الأوروبية
// ═══════════════════════════════════════
const GROUP_1_EUROPA: CountryItem[] = [
  {
    id: 'country-1',
    de: 'Deutschland',
    deBase: 'Deutschland',
    ar: 'ألمانيا',
    emoji: '🇩🇪',
    objAr: 'دولة ألمانيا',
    color: '#FFD700',
    gradient: ['#FFD700', '#B8860B'],
    exampleDe: 'Ich wohne in Deutschland.',
    exampleAr: 'أنا ساكن في ألمانيا.',
    acceptedAnswers: ['Deutschland'],
  },
  {
    id: 'country-2',
    de: 'Frankreich',
    deBase: 'Frankreich',
    ar: 'فرنسا',
    emoji: '🇫🇷',
    objAr: 'دولة فرنسا',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Frankreich ist schön.',
    exampleAr: 'فرنسا جميلة.',
    acceptedAnswers: ['Frankreich'],
  },
  {
    id: 'country-3',
    de: 'Spanien',
    deBase: 'Spanien',
    ar: 'إسبانيا',
    emoji: '🇪🇸',
    objAr: 'دولة إسبانيا',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    exampleDe: 'Spanien ist warm.',
    exampleAr: 'إسبانيا حارة.',
    acceptedAnswers: ['Spanien'],
  },
  {
    id: 'country-4',
    de: 'Italien',
    deBase: 'Italien',
    ar: 'إيطاليا',
    emoji: '🇮🇹',
    objAr: 'دولة إيطاليا',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Italien hat gutes Essen.',
    exampleAr: 'إيطاليا أكلها حلو.',
    acceptedAnswers: ['Italien'],
  },
  {
    id: 'country-5',
    de: 'England',
    deBase: 'England',
    ar: 'إنجلترا',
    emoji: '🇬🇧',
    objAr: 'دولة إنجلترا',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'England ist eine Insel.',
    exampleAr: 'إنجلترا جزيرة.',
    acceptedAnswers: ['England'],
  },
];

// ═══════════════════════════════════════
// 🌎 المجموعة الثانية: دول العالم
// ═══════════════════════════════════════
const GROUP_2_WELT: CountryItem[] = [
  {
    id: 'country-6',
    de: 'Ägypten',
    deBase: 'Ägypten',
    ar: 'مصر',
    emoji: '🇪🇬',
    objAr: 'دولة مصر',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#B45309'],
    exampleDe: 'Ägypten hat Pyramiden.',
    exampleAr: 'مصر فيها أهرامات.',
    acceptedAnswers: ['Ägypten', 'Aegypten'],
  },
  {
    id: 'country-7',
    de: 'die Türkei',
    deBase: 'Türkei',
    ar: 'تركيا',
    artikel: 'die',
    emoji: '🇹🇷',
    objAr: 'دولة تركيا',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    exampleDe: 'Die Türkei ist groß.',
    exampleAr: 'تركيا كبيرة.',
    acceptedAnswers: ['Türkei', 'Tuerkei', 'die Türkei'],
  },
  {
    id: 'country-8',
    de: 'die USA',
    deBase: 'USA',
    ar: 'أمريكا',
    artikel: 'die',
    emoji: '🇺🇸',
    objAr: 'الولايات المتحدة',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E3A8A'],
    exampleDe: 'Die USA sind weit.',
    exampleAr: 'أمريكا بعيدة.',
    acceptedAnswers: ['USA', 'die USA'],
  },
  {
    id: 'country-9',
    de: 'China',
    deBase: 'China',
    ar: 'الصين',
    emoji: '🇨🇳',
    objAr: 'دولة الصين',
    color: '#DC2626',
    gradient: ['#DC2626', '#7F1D1D'],
    exampleDe: 'China ist sehr groß.',
    exampleAr: 'الصين كبيرة جداً.',
    acceptedAnswers: ['China'],
  },
  {
    id: 'country-10',
    de: 'Japan',
    deBase: 'Japan',
    ar: 'اليابان',
    emoji: '🇯🇵',
    objAr: 'دولة اليابان',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Japan hat viele Inseln.',
    exampleAr: 'اليابان فيها جزر كتير.',
    acceptedAnswers: ['Japan'],
  },
];

// ═══════════════════════════════════════
// 🗣️ المجموعة الثالثة: الجنسيات والعبارات
// ═══════════════════════════════════════
const GROUP_3_NATIONALITAET: CountryItem[] = [
  {
    id: 'country-11',
    de: 'Ich komme aus ...',
    deBase: 'Ich komme aus',
    ar: 'أنا من ...',
    emoji: '🗣️',
    objAr: 'جملة التعريف بالبلد',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Ich komme aus Ägypten.',
    exampleAr: 'أنا من مصر.',
    acceptedAnswers: ['Ich komme aus', 'ich komme aus'],
  },
  {
    id: 'country-12',
    de: 'Woher kommst du?',
    deBase: 'Woher kommst du',
    ar: 'أنت منين؟',
    emoji: '❓',
    objAr: 'سؤال عن البلد',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Woher kommst du? — Aus Deutschland.',
    exampleAr: 'أنت منين؟ — من ألمانيا.',
    acceptedAnswers: ['Woher kommst du', 'woher kommst du'],
  },
  {
    id: 'country-13',
    de: 'die Sprache',
    deBase: 'Sprache',
    ar: 'لغة',
    artikel: 'die',
    plural: 'die Sprachen',
    emoji: '💬',
    objAr: 'اللغة المنطوقة',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Ich lerne eine neue Sprache.',
    exampleAr: 'أنا بتعلم لغة جديدة.',
    acceptedAnswers: ['Sprache'],
  },
  {
    id: 'country-14',
    de: 'Ich spreche Deutsch.',
    deBase: 'Ich spreche Deutsch',
    ar: 'أنا بتكلم ألماني.',
    emoji: '🇩🇪',
    objAr: 'التحدث بالألمانية',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Ich spreche Deutsch und Arabisch.',
    exampleAr: 'أنا بتكلم ألماني وعربي.',
    acceptedAnswers: ['Ich spreche Deutsch', 'ich spreche Deutsch', 'ich spreche deutsch'],
  },
  {
    id: 'country-15',
    de: 'die Welt',
    deBase: 'Welt',
    ar: 'العالم',
    artikel: 'die',
    emoji: '🌍',
    objAr: 'العالم كله',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Die Welt ist schön.',
    exampleAr: 'العالم جميل.',
    acceptedAnswers: ['Welt'],
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const COUNTRIES: CountryItem[] = [
  ...GROUP_1_EUROPA,
  ...GROUP_2_WELT,
  ...GROUP_3_NATIONALITAET,
];

export const COUNTRY_GROUPS: CountryGroup[] = [
  {
    numbers: GROUP_1_EUROPA,
    title: 'دول أوروبا',
    titleDe: 'Europäische Länder',
    description: 'ألمانيا وجيرانها في أوروبا',
  },
  {
    numbers: GROUP_2_WELT,
    title: 'دول العالم',
    titleDe: 'Länder der Welt',
    description: 'دول مهمة حول العالم',
  },
  {
    numbers: GROUP_3_NATIONALITAET,
    title: 'الجنسيات والعبارات',
    titleDe: 'Nationalität und Sätze',
    description: 'إزاي تعرّف عن نفسك',
  },
];
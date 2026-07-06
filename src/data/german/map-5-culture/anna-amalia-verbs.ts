// 📚 دروس تصريف الأفعال - مكتبة آنا أماليا (Anna Amalia Bibliothek)
// المستوى: A2.1 | 15 فعل موزعة على 3 مجموعات

export interface VerbItem {
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
  conjugation?: {
    ich: string;
    du: string;
    er_sie_es: string;
  };
}

export interface VerbGroup {
  numbers: VerbItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// ⭐ المجموعة الأولى: الأفعال الأساسية
// ═══════════════════════════════════════
const GROUP_1_BASIC: VerbItem[] = [
  {
    id: 'verb-1',
    de: 'sein',
    deBase: 'sein',
    ar: 'يكون',
    emoji: '👤',
    objAr: 'فعل الكينونة',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#0077B6'],
    exampleDe: 'Ich bin Schüler.',
    exampleAr: 'أنا طالب.',
    acceptedAnswers: ['sein'],
    conjugation: { ich: 'bin', du: 'bist', er_sie_es: 'ist' },
  },
  {
    id: 'verb-2',
    de: 'haben',
    deBase: 'haben',
    ar: 'يملك',
    emoji: '🎁',
    objAr: 'فعل الملكية',
    color: '#F72585',
    gradient: ['#F72585', '#B5179E'],
    exampleDe: 'Ich habe ein Buch.',
    exampleAr: 'أنا عندي كتاب.',
    acceptedAnswers: ['haben'],
    conjugation: { ich: 'habe', du: 'hast', er_sie_es: 'hat' },
  },
  {
    id: 'verb-3',
    de: 'machen',
    deBase: 'machen',
    ar: 'يفعل / يعمل',
    emoji: '🛠️',
    objAr: 'فعل العمل',
    color: '#7209B7',
    gradient: ['#7209B7', '#4C1D95'],
    exampleDe: 'Was machst du?',
    exampleAr: 'بتعمل إيه؟',
    acceptedAnswers: ['machen'],
    conjugation: { ich: 'mache', du: 'machst', er_sie_es: 'macht' },
  },
  {
    id: 'verb-4',
    de: 'gehen',
    deBase: 'gehen',
    ar: 'يذهب',
    emoji: '🚶',
    objAr: 'فعل المشي',
    color: '#06D6A0',
    gradient: ['#06D6A0', '#028A5B'],
    exampleDe: 'Ich gehe zur Schule.',
    exampleAr: 'أنا برووح للمدرسة.',
    acceptedAnswers: ['gehen'],
    conjugation: { ich: 'gehe', du: 'gehst', er_sie_es: 'geht' },
  },
  {
    id: 'verb-5',
    de: 'kommen',
    deBase: 'kommen',
    ar: 'يأتي',
    emoji: '👋',
    objAr: 'فعل المجيء',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Ich komme aus Ägypten.',
    exampleAr: 'أنا جاي من مصر.',
    acceptedAnswers: ['kommen'],
    conjugation: { ich: 'komme', du: 'kommst', er_sie_es: 'kommt' },
  },
];

// ═══════════════════════════════════════
// 🌞 المجموعة الثانية: الأفعال اليومية
// ═══════════════════════════════════════
const GROUP_2_DAILY: VerbItem[] = [
  {
    id: 'verb-6',
    de: 'lernen',
    deBase: 'lernen',
    ar: 'يتعلم',
    emoji: '📚',
    objAr: 'فعل التعلم',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Ich lerne Deutsch.',
    exampleAr: 'أنا بتعلم ألماني.',
    acceptedAnswers: ['lernen'],
    conjugation: { ich: 'lerne', du: 'lernst', er_sie_es: 'lernt' },
  },
  {
    id: 'verb-7',
    de: 'spielen',
    deBase: 'spielen',
    ar: 'يلعب',
    emoji: '⚽',
    objAr: 'فعل اللعب',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Wir spielen Fußball.',
    exampleAr: 'إحنا بنلعب كرة قدم.',
    acceptedAnswers: ['spielen'],
    conjugation: { ich: 'spiele', du: 'spielst', er_sie_es: 'spielt' },
  },
  {
    id: 'verb-8',
    de: 'arbeiten',
    deBase: 'arbeiten',
    ar: 'يعمل',
    emoji: '💼',
    objAr: 'فعل الشغل',
    color: '#F77F00',
    gradient: ['#F77F00', '#D62828'],
    exampleDe: 'Mein Vater arbeitet viel.',
    exampleAr: 'أبويا بيشتغل كتير.',
    acceptedAnswers: ['arbeiten'],
    conjugation: { ich: 'arbeite', du: 'arbeitest', er_sie_es: 'arbeitet' },
  },
  {
    id: 'verb-9',
    de: 'wohnen',
    deBase: 'wohnen',
    ar: 'يسكن',
    emoji: '🏡',
    objAr: 'فعل السكن',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Ich wohne in Berlin.',
    exampleAr: 'أنا ساكن في برلين.',
    acceptedAnswers: ['wohnen'],
    conjugation: { ich: 'wohne', du: 'wohnst', er_sie_es: 'wohnt' },
  },
  {
    id: 'verb-10',
    de: 'sprechen',
    deBase: 'sprechen',
    ar: 'يتكلم',
    emoji: '🗣️',
    objAr: 'فعل الكلام',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Ich spreche Deutsch.',
    exampleAr: 'أنا بتكلم ألماني.',
    acceptedAnswers: ['sprechen'],
    conjugation: { ich: 'spreche', du: 'sprichst', er_sie_es: 'spricht' },
  },
];

// ═══════════════════════════════════════
// 🎯 المجموعة الثالثة: الأفعال المتقدمة
// ═══════════════════════════════════════
const GROUP_3_ADVANCED: VerbItem[] = [
  {
    id: 'verb-11',
    de: 'lesen',
    deBase: 'lesen',
    ar: 'يقرأ',
    emoji: '📖',
    objAr: 'فعل القراءة',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Ich lese ein Buch.',
    exampleAr: 'أنا بقرا كتاب.',
    acceptedAnswers: ['lesen'],
    conjugation: { ich: 'lese', du: 'liest', er_sie_es: 'liest' },
  },
  {
    id: 'verb-12',
    de: 'schreiben',
    deBase: 'schreiben',
    ar: 'يكتب',
    emoji: '✍️',
    objAr: 'فعل الكتابة',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Du schreibst gut.',
    exampleAr: 'أنت بتكتب كويس.',
    acceptedAnswers: ['schreiben'],
    conjugation: { ich: 'schreibe', du: 'schreibst', er_sie_es: 'schreibt' },
  },
  {
    id: 'verb-13',
    de: 'essen',
    deBase: 'essen',
    ar: 'يأكل',
    emoji: '🍎',
    objAr: 'فعل الأكل',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    exampleDe: 'Wir essen Pizza.',
    exampleAr: 'إحنا بناكل بيتزا.',
    acceptedAnswers: ['essen'],
    conjugation: { ich: 'esse', du: 'isst', er_sie_es: 'isst' },
  },
  {
    id: 'verb-14',
    de: 'trinken',
    deBase: 'trinken',
    ar: 'يشرب',
    emoji: '🥤',
    objAr: 'فعل الشرب',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Ich trinke Wasser.',
    exampleAr: 'أنا بشرب مية.',
    acceptedAnswers: ['trinken'],
    conjugation: { ich: 'trinke', du: 'trinkst', er_sie_es: 'trinkt' },
  },
  {
    id: 'verb-15',
    de: 'schlafen',
    deBase: 'schlafen',
    ar: 'ينام',
    emoji: '😴',
    objAr: 'فعل النوم',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Das Kind schläft.',
    exampleAr: 'الولد بينام.',
    acceptedAnswers: ['schlafen'],
    conjugation: { ich: 'schlafe', du: 'schläfst', er_sie_es: 'schläft' },
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const VERBS: VerbItem[] = [
  ...GROUP_1_BASIC,
  ...GROUP_2_DAILY,
  ...GROUP_3_ADVANCED,
];

export const VERB_GROUPS: VerbGroup[] = [
  {
    numbers: GROUP_1_BASIC,
    title: 'الأفعال الأساسية',
    titleDe: 'Grundverben',
    description: 'الأفعال الأساسية اللي بتستخدمها كل يوم',
  },
  {
    numbers: GROUP_2_DAILY,
    title: 'أفعال الحياة اليومية',
    titleDe: 'Alltagsverben',
    description: 'أفعال بتستخدمها في حياتك اليومية',
  },
  {
    numbers: GROUP_3_ADVANCED,
    title: 'الأفعال المتقدمة',
    titleDe: 'Fortgeschrittene Verben',
    description: 'أفعال للقراءة، الكتابة، الأكل والنوم',
  },
];
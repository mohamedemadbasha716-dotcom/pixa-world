// ❓ دروس كلمات السؤال - بيت جوته (Goethes Wohnhaus)
// المستوى: A2.1 | 15 كلمة سؤال موزعة على 3 مجموعات

export interface QuestionItem {
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
  answer?: {
    de: string;
    ar: string;
  };
}

export interface QuestionGroup {
  numbers: QuestionItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// ❓ المجموعة الأولى: الأسئلة الأساسية
// ═══════════════════════════════════════
const GROUP_1_BASIC: QuestionItem[] = [
  {
    id: 'q-1',
    de: 'Wer?',
    deBase: 'Wer',
    ar: 'مين؟',
    emoji: '🙋',
    objAr: 'سؤال عن الشخص',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#0077B6'],
    exampleDe: 'Wer ist das?',
    exampleAr: 'مين ده؟',
    acceptedAnswers: ['Wer', 'wer', 'Wer?'],
    answer: { de: 'Das ist Karl.', ar: 'ده كارل.' },
  },
  {
    id: 'q-2',
    de: 'Was?',
    deBase: 'Was',
    ar: 'إيه؟',
    emoji: '❓',
    objAr: 'سؤال عن الشيء',
    color: '#F72585',
    gradient: ['#F72585', '#B5179E'],
    exampleDe: 'Was ist das?',
    exampleAr: 'ده إيه؟',
    acceptedAnswers: ['Was', 'was', 'Was?'],
    answer: { de: 'Das ist ein Buch.', ar: 'ده كتاب.' },
  },
  {
    id: 'q-3',
    de: 'Wo?',
    deBase: 'Wo',
    ar: 'فين؟',
    emoji: '📍',
    objAr: 'سؤال عن المكان',
    color: '#7209B7',
    gradient: ['#7209B7', '#4C1D95'],
    exampleDe: 'Wo wohnst du?',
    exampleAr: 'ساكن فين؟',
    acceptedAnswers: ['Wo', 'wo', 'Wo?'],
    answer: { de: 'Ich wohne in Berlin.', ar: 'أنا ساكن في برلين.' },
  },
  {
    id: 'q-4',
    de: 'Wann?',
    deBase: 'Wann',
    ar: 'إمتى؟',
    emoji: '⏰',
    objAr: 'سؤال عن الوقت',
    color: '#06D6A0',
    gradient: ['#06D6A0', '#028A5B'],
    exampleDe: 'Wann kommst du?',
    exampleAr: 'هتيجي إمتى؟',
    acceptedAnswers: ['Wann', 'wann', 'Wann?'],
    answer: { de: 'Ich komme morgen.', ar: 'هاجي بكرة.' },
  },
  {
    id: 'q-5',
    de: 'Wie?',
    deBase: 'Wie',
    ar: 'إزاي؟',
    emoji: '🤔',
    objAr: 'سؤال عن الطريقة',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Wie geht es dir?',
    exampleAr: 'إزيك؟',
    acceptedAnswers: ['Wie', 'wie', 'Wie?'],
    answer: { de: 'Mir geht es gut.', ar: 'أنا كويس.' },
  },
];

// ═══════════════════════════════════════
// 🎯 المجموعة الثانية: الأسئلة المتقدمة
// ═══════════════════════════════════════
const GROUP_2_ADVANCED: QuestionItem[] = [
  {
    id: 'q-6',
    de: 'Warum?',
    deBase: 'Warum',
    ar: 'ليه؟',
    emoji: '🧐',
    objAr: 'سؤال عن السبب',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Warum lernst du Deutsch?',
    exampleAr: 'ليه بتتعلم ألماني؟',
    acceptedAnswers: ['Warum', 'warum', 'Warum?'],
    answer: { de: 'Weil ich es liebe.', ar: 'لأني بحبها.' },
  },
  {
    id: 'q-7',
    de: 'Woher?',
    deBase: 'Woher',
    ar: 'منين؟',
    emoji: '🌍',
    objAr: 'سؤال عن الأصل',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Woher kommst du?',
    exampleAr: 'إنت منين؟',
    acceptedAnswers: ['Woher', 'woher', 'Woher?'],
    answer: { de: 'Ich komme aus Ägypten.', ar: 'أنا من مصر.' },
  },
  {
    id: 'q-8',
    de: 'Wohin?',
    deBase: 'Wohin',
    ar: 'لفين؟',
    emoji: '🎯',
    objAr: 'سؤال عن الوجهة',
    color: '#F77F00',
    gradient: ['#F77F00', '#D62828'],
    exampleDe: 'Wohin gehst du?',
    exampleAr: 'رايح فين؟',
    acceptedAnswers: ['Wohin', 'wohin', 'Wohin?'],
    answer: { de: 'Ich gehe zur Schule.', ar: 'رايح المدرسة.' },
  },
  {
    id: 'q-9',
    de: 'Welcher?',
    deBase: 'Welcher',
    ar: 'أنهي؟',
    emoji: '👉',
    objAr: 'سؤال عن الاختيار',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Welcher Tag ist heute?',
    exampleAr: 'النهارده أنهي يوم؟',
    acceptedAnswers: ['Welcher', 'welcher', 'Welcher?'],
    answer: { de: 'Heute ist Montag.', ar: 'النهارده الإتنين.' },
  },
  {
    id: 'q-10',
    de: 'Wie viel?',
    deBase: 'Wie viel',
    ar: 'كام؟',
    emoji: '🔢',
    objAr: 'سؤال عن العدد',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Wie viel kostet das?',
    exampleAr: 'بكام ده؟',
    acceptedAnswers: ['Wie viel', 'wie viel', 'Wieviel', 'Wie viel?'],
    answer: { de: 'Das kostet 5 Euro.', ar: 'ده بـ 5 يورو.' },
  },
];

// ═══════════════════════════════════════
// 💬 المجموعة الثالثة: جمل سؤال كاملة
// ═══════════════════════════════════════
const GROUP_3_FULL: QuestionItem[] = [
  {
    id: 'q-11',
    de: 'Wie heißt du?',
    deBase: 'Wie heißt du',
    ar: 'اسمك إيه؟',
    emoji: '🪪',
    objAr: 'سؤال عن الاسم',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Hallo! Wie heißt du?',
    exampleAr: 'أهلاً! اسمك إيه؟',
    acceptedAnswers: ['Wie heißt du', 'wie heißt du', 'Wie heisst du', 'Wie heißt du?'],
    answer: { de: 'Ich heiße Karl.', ar: 'اسمي كارل.' },
  },
  {
    id: 'q-12',
    de: 'Wo wohnst du?',
    deBase: 'Wo wohnst du',
    ar: 'ساكن فين؟',
    emoji: '🏠',
    objAr: 'سؤال عن السكن',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Wo wohnst du, Freund?',
    exampleAr: 'ساكن فين يا صديقي؟',
    acceptedAnswers: ['Wo wohnst du', 'wo wohnst du', 'Wo wohnst du?'],
    answer: { de: 'Ich wohne in Berlin.', ar: 'أنا ساكن في برلين.' },
  },
  {
    id: 'q-13',
    de: 'Was machst du?',
    deBase: 'Was machst du',
    ar: 'بتعمل إيه؟',
    emoji: '🛠️',
    objAr: 'سؤال عن النشاط',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    exampleDe: 'Hey! Was machst du?',
    exampleAr: 'إيه يا صاحبي! بتعمل إيه؟',
    acceptedAnswers: ['Was machst du', 'was machst du', 'Was machst du?'],
    answer: { de: 'Ich lerne Deutsch.', ar: 'بتعلم ألماني.' },
  },
  {
    id: 'q-14',
    de: 'Wann kommst du?',
    deBase: 'Wann kommst du',
    ar: 'هتيجي إمتى؟',
    emoji: '📅',
    objAr: 'سؤال عن موعد الوصول',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Wann kommst du nach Hause?',
    exampleAr: 'هتيجي البيت إمتى؟',
    acceptedAnswers: ['Wann kommst du', 'wann kommst du', 'Wann kommst du?'],
    answer: { de: 'Ich komme um 5 Uhr.', ar: 'هاجي الساعة 5.' },
  },
  {
    id: 'q-15',
    de: 'Warum lernst du Deutsch?',
    deBase: 'Warum lernst du Deutsch',
    ar: 'ليه بتتعلم ألماني؟',
    emoji: '🇩🇪',
    objAr: 'سؤال عن سبب التعلم',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Warum lernst du Deutsch so schnell?',
    exampleAr: 'ليه بتتعلم ألماني بسرعة كده؟',
    acceptedAnswers: ['Warum lernst du Deutsch', 'warum lernst du Deutsch', 'Warum lernst du Deutsch?'],
    answer: { de: 'Weil ich nach Deutschland reisen will.', ar: 'لأني عايز أسافر ألمانيا.' },
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const QUESTIONS: QuestionItem[] = [
  ...GROUP_1_BASIC,
  ...GROUP_2_ADVANCED,
  ...GROUP_3_FULL,
];

export const QUESTION_GROUPS: QuestionGroup[] = [
  {
    numbers: GROUP_1_BASIC,
    title: 'الأسئلة الأساسية',
    titleDe: 'Grundfragen',
    description: 'مين، إيه، فين، إمتى، إزاي',
  },
  {
    numbers: GROUP_2_ADVANCED,
    title: 'الأسئلة المتقدمة',
    titleDe: 'Fortgeschrittene Fragen',
    description: 'ليه، منين، لفين، أنهي، كام',
  },
  {
    numbers: GROUP_3_FULL,
    title: 'جمل سؤال كاملة',
    titleDe: 'Vollständige Fragesätze',
    description: 'أسئلة كاملة بتستخدمها كل يوم',
  },
];
// 🎓 دروس الضمائر - جامعة هايدلبرغ (Universität Heidelberg)
// المستوى: A2.1 | 15 ضمير/جملة موزعة على 3 مجموعات

export interface PronounItem {
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

export interface PronounGroup {
  numbers: PronounItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 👤 المجموعة الأولى: ضمائر المفرد
// ═══════════════════════════════════════
const GROUP_1_SINGULAR: PronounItem[] = [
  {
    id: 'pron-1',
    de: 'ich',
    deBase: 'ich',
    ar: 'أنا',
    emoji: '🙋',
    objAr: 'أنا الشخص المتكلم',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#0077B6'],
    exampleDe: 'Ich bin Schüler.',
    exampleAr: 'أنا طالب.',
    acceptedAnswers: ['ich', 'Ich'],
  },
  {
    id: 'pron-2',
    de: 'du',
    deBase: 'du',
    ar: 'أنت / إنتي',
    emoji: '👉',
    objAr: 'أنت الشخص المخاطب',
    color: '#F72585',
    gradient: ['#F72585', '#B5179E'],
    exampleDe: 'Du bist nett.',
    exampleAr: 'أنت لطيف.',
    acceptedAnswers: ['du', 'Du'],
  },
  {
    id: 'pron-3',
    de: 'er',
    deBase: 'er',
    ar: 'هو',
    emoji: '👨',
    objAr: 'هو الشخص الغائب المذكر',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Er ist mein Freund.',
    exampleAr: 'هو صديقي.',
    acceptedAnswers: ['er', 'Er'],
  },
  {
    id: 'pron-4',
    de: 'sie',
    deBase: 'sie',
    ar: 'هي',
    emoji: '👩',
    objAr: 'هي الشخصة الغائبة المؤنثة',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Sie ist meine Lehrerin.',
    exampleAr: 'هي مدرستي.',
    acceptedAnswers: ['sie', 'Sie'],
  },
  {
    id: 'pron-5',
    de: 'es',
    deBase: 'es',
    ar: 'هو/هي (محايد)',
    emoji: '🐱',
    objAr: 'للمحايد زي الحيوانات والأشياء',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Es ist eine Katze.',
    exampleAr: 'هي قطة.',
    acceptedAnswers: ['es', 'Es'],
  },
];

// ═══════════════════════════════════════
// 👥 المجموعة الثانية: ضمائر الجمع
// ═══════════════════════════════════════
const GROUP_2_PLURAL: PronounItem[] = [
  {
    id: 'pron-6',
    de: 'wir',
    deBase: 'wir',
    ar: 'نحن / إحنا',
    emoji: '👨‍👩‍👧',
    objAr: 'نحن مجموعة المتكلمين',
    color: '#7209B7',
    gradient: ['#7209B7', '#4C1D95'],
    exampleDe: 'Wir lernen Deutsch.',
    exampleAr: 'إحنا بنتعلم ألماني.',
    acceptedAnswers: ['wir', 'Wir'],
  },
  {
    id: 'pron-7',
    de: 'ihr',
    deBase: 'ihr',
    ar: 'أنتم / إنتوا',
    emoji: '👫',
    objAr: 'أنتم مجموعة المخاطبين',
    color: '#F77F00',
    gradient: ['#F77F00', '#D62828'],
    exampleDe: 'Ihr seid Kinder.',
    exampleAr: 'إنتوا أطفال.',
    acceptedAnswers: ['ihr', 'Ihr'],
  },
  {
    id: 'pron-8',
    de: 'sie',
    deBase: 'sie',
    ar: 'هم',
    emoji: '👥',
    objAr: 'هم الأشخاص الغائبين',
    color: '#06D6A0',
    gradient: ['#06D6A0', '#028A5B'],
    exampleDe: 'Sie sind aus Berlin.',
    exampleAr: 'هم من برلين.',
    acceptedAnswers: ['sie', 'Sie'],
  },
  {
    id: 'pron-9',
    de: 'Sie',
    deBase: 'Sie',
    ar: 'حضرتك (رسمي)',
    emoji: '🎩',
    objAr: 'ضمير الاحترام الرسمي',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Sie sind sehr nett.',
    exampleAr: 'حضرتك لطيف جداً.',
    acceptedAnswers: ['Sie'],
  },
  {
    id: 'pron-10',
    de: 'man',
    deBase: 'man',
    ar: 'الواحد (عام)',
    emoji: '🤷',
    objAr: 'ضمير غير شخصي',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Man lernt viel.',
    exampleAr: 'الواحد بيتعلم كتير.',
    acceptedAnswers: ['man', 'Man'],
  },
];

// ═══════════════════════════════════════
// 💬 المجموعة الثالثة: جمل كاملة بالضمائر
// ═══════════════════════════════════════
const GROUP_3_SENTENCES: PronounItem[] = [
  {
    id: 'pron-11',
    de: 'Ich bin Schüler',
    deBase: 'Ich bin Schüler',
    ar: 'أنا طالب',
    emoji: '🎒',
    objAr: 'تعريف بنفسك كطالب',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Ich bin Schüler in Berlin.',
    exampleAr: 'أنا طالب في برلين.',
    acceptedAnswers: ['Ich bin Schüler', 'ich bin schüler', 'ich bin Schüler'],
  },
  {
    id: 'pron-12',
    de: 'Du bist nett',
    deBase: 'Du bist nett',
    ar: 'أنت لطيف',
    emoji: '😊',
    objAr: 'مجاملة لشخص',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Du bist nett und freundlich.',
    exampleAr: 'أنت لطيف وودود.',
    acceptedAnswers: ['Du bist nett', 'du bist nett'],
  },
  {
    id: 'pron-13',
    de: 'Er ist mein Freund',
    deBase: 'Er ist mein Freund',
    ar: 'هو صديقي',
    emoji: '🤝',
    objAr: 'تعريف الصديق',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Er ist mein bester Freund.',
    exampleAr: 'هو أحسن صديق ليا.',
    acceptedAnswers: ['Er ist mein Freund', 'er ist mein Freund'],
  },
  {
    id: 'pron-14',
    de: 'Wir lernen Deutsch',
    deBase: 'Wir lernen Deutsch',
    ar: 'إحنا بنتعلم ألماني',
    emoji: '📖',
    objAr: 'تعلم اللغة الألمانية',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Wir lernen jeden Tag Deutsch.',
    exampleAr: 'إحنا بنتعلم ألماني كل يوم.',
    acceptedAnswers: ['Wir lernen Deutsch', 'wir lernen Deutsch', 'wir lernen deutsch'],
  },
  {
    id: 'pron-15',
    de: 'Sie sind aus Berlin',
    deBase: 'Sie sind aus Berlin',
    ar: 'هم من برلين',
    emoji: '🏙️',
    objAr: 'تعريف بلدهم',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    exampleDe: 'Sie sind aus Berlin, Deutschland.',
    exampleAr: 'هم من برلين، ألمانيا.',
    acceptedAnswers: ['Sie sind aus Berlin', 'sie sind aus Berlin'],
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const PRONOUNS: PronounItem[] = [
  ...GROUP_1_SINGULAR,
  ...GROUP_2_PLURAL,
  ...GROUP_3_SENTENCES,
];

export const PRONOUN_GROUPS: PronounGroup[] = [
  {
    numbers: GROUP_1_SINGULAR,
    title: 'ضمائر المفرد',
    titleDe: 'Singular Pronomen',
    description: 'أنا، أنت، هو، هي، هو/هي',
  },
  {
    numbers: GROUP_2_PLURAL,
    title: 'ضمائر الجمع',
    titleDe: 'Plural Pronomen',
    description: 'إحنا، إنتوا، هم، حضرتك، الواحد',
  },
  {
    numbers: GROUP_3_SENTENCES,
    title: 'جمل بالضمائر',
    titleDe: 'Sätze mit Pronomen',
    description: 'كيف تستخدم الضمائر في جمل كاملة',
  },
];
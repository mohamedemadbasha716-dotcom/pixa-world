// src/data/german/dresden-conversation.ts

export interface ConversationItem {
  id: string;
  deBase: string;
  de: string;
  ar: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  acceptedAnswers?: string[];
  exampleDe?: string;
  exampleAr?: string;
}

export const CONVERSATIONS: ConversationItem[] = [
  // 🟢 المجموعة الأولى: التحيات اليومية (5 عبارات)
  {
    id: 'hallo',
    deBase: 'Hallo',
    de: 'Hallo',
    ar: 'مرحباً',
    emoji: '👋',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#028090'],
    acceptedAnswers: ['hallo', 'hallo!'],
    exampleDe: 'Hallo, wie geht es dir?',
    exampleAr: 'مرحباً، كيف حالك؟',
  },
  {
    id: 'morgen',
    deBase: 'Morgen',
    de: 'Guten Morgen',
    ar: 'صباح الخير',
    emoji: '🌅',
    color: '#FFD700',
    gradient: ['#FFD700', '#FF8C00'],
    acceptedAnswers: ['guten morgen', 'morgen'],
    exampleDe: 'Guten Morgen, Mama!',
    exampleAr: 'صباح الخير يا أمي!',
  },
  {
    id: 'tag',
    deBase: 'Tag',
    de: 'Guten Tag',
    ar: 'طاب يومك (نهارك سعيد)',
    emoji: '☀️',
    color: '#F77F00',
    gradient: ['#F77F00', '#D62828'],
    acceptedAnswers: ['guten tag', 'tag'],
    exampleDe: 'Guten Tag, Herr Müller!',
    exampleAr: 'طاب يومك يا سيد مولر!',
  },
  {
    id: 'abend',
    deBase: 'Abend',
    de: 'Guten Abend',
    ar: 'مساء الخير',
    emoji: '🌇',
    color: '#7209B7',
    gradient: ['#7209B7', '#3A0CA3'],
    acceptedAnswers: ['guten abend', 'abend'],
    exampleDe: 'Guten Abend zusammen!',
    exampleAr: 'مساء الخير جميعاً!',
  },
  {
    id: 'nacht',
    deBase: 'Nacht',
    de: 'Gute Nacht',
    ar: 'تصبح على خير',
    emoji: '🌙',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E3A8A'],
    acceptedAnswers: ['gute nacht', 'nacht'],
    exampleDe: 'Gute Nacht, schlaf gut!',
    exampleAr: 'تصبح على خير، نم جيداً!',
  },

  // 🟡 المجموعة الثانية: الذوقيات والوداع (5 عبارات)
  {
    id: 'danke',
    deBase: 'Danke',
    de: 'Danke',
    ar: 'شكراً',
    emoji: '🙏',
    color: '#06D6A0',
    gradient: ['#06D6A0', '#02C39A'],
    acceptedAnswers: ['danke', 'dankeschön', 'danke schön'],
    exampleDe: 'Danke für das Geschenk.',
    exampleAr: 'شكراً على الهدية.',
  },
  {
    id: 'bitte',
    deBase: 'Bitte',
    de: 'Bitte',
    ar: 'عفواً / من فضلك',
    emoji: '🤲',
    color: '#F72585',
    gradient: ['#F72585', '#B5179E'],
    acceptedAnswers: ['bitte', 'bitteschön', 'bitte schön'],
    exampleDe: 'Kannst du mir bitte helfen?',
    exampleAr: 'هل يمكنك مساعدتي من فضلك؟',
  },
  {
    id: 'entschuldigung',
    deBase: 'Sorry', // خلينا deBase كلمة قصيرة عشان اللعبة متضربش فالموبايل
    de: 'Entschuldigung',
    ar: 'معذرة / آسف',
    emoji: '🙇‍♂️',
    color: '#9D4EDD',
    gradient: ['#9D4EDD', '#5A189A'],
    acceptedAnswers: ['entschuldigung', 'sorry', 'tut mir leid'],
    exampleDe: 'Entschuldigung, wo ist der Bahnhof?',
    exampleAr: 'معذرة، أين محطة القطار؟',
  },
  {
    id: 'willkommen',
    deBase: 'Willkommen',
    de: 'Herzlich Willkommen',
    ar: 'مرحباً بك (أهلاً وسهلاً)',
    emoji: '💐',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    acceptedAnswers: ['willkommen', 'herzlich willkommen'],
    exampleDe: 'Herzlich Willkommen in Deutschland!',
    exampleAr: 'أهلاً بك في ألمانيا!',
  },
  {
    id: 'tschuss',
    deBase: 'Tschüss',
    de: 'Tschüss',
    ar: 'وداعاً / باي',
    emoji: '🚶‍♂️',
    color: '#EF4444',
    gradient: ['#EF4444', '#B91C1C'],
    acceptedAnswers: ['tschuss', 'tschüss', 'tschues'],
    exampleDe: 'Tschüss, bis morgen!',
    exampleAr: 'وداعاً، أراك غداً!',
  },

  // 🟣 المجموعة الثالثة: ردود وكلمات يومية (5 عبارات)
  {
    id: 'ja',
    deBase: 'Ja',
    de: 'Ja',
    ar: 'نعم',
    emoji: '👍',
    color: '#58CC02',
    gradient: ['#58CC02', '#4AA802'],
    acceptedAnswers: ['ja'],
    exampleDe: 'Ja, ich komme mit.',
    exampleAr: 'نعم، أنا قادم معك.',
  },
  {
    id: 'nein',
    deBase: 'Nein',
    de: 'Nein',
    ar: 'لا',
    emoji: '👎',
    color: '#FF4D6D',
    gradient: ['#FF4D6D', '#C9184A'],
    acceptedAnswers: ['nein'],
    exampleDe: 'Nein, danke.',
    exampleAr: 'لا، شكراً.',
  },
  {
    id: 'super',
    deBase: 'Super',
    de: 'Super',
    ar: 'رائع / ممتاز',
    emoji: '🌟',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    acceptedAnswers: ['super', 'toll', 'sehr gut'],
    exampleDe: 'Das ist eine super Idee!',
    exampleAr: 'هذه فكرة رائعة!',
  },
  {
    id: 'genau',
    deBase: 'Genau',
    de: 'Genau',
    ar: 'بالضبط',
    emoji: '🎯',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#0369A1'],
    acceptedAnswers: ['genau', 'richtig'],
    exampleDe: 'Genau, das stimmt.',
    exampleAr: 'بالضبط، هذا صحيح.',
  },
  {
    id: 'hilfe',
    deBase: 'Hilfe',
    de: 'Hilfe',
    ar: 'مساعدة / النجدة',
    emoji: '🆘',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#B45309'],
    acceptedAnswers: ['hilfe', 'helfen'],
    exampleDe: 'Ich brauche Hilfe.',
    exampleAr: 'أنا بحاجة إلى مساعدة.',
  },
];

export const CONVERSATION_GROUPS = [
  {
    id: 'group-1',
    title: 'التحيات اليومية',
    numbers: CONVERSATIONS.slice(0, 5),
  },
  {
    id: 'group-2',
    title: 'الذوقيات والوداع',
    numbers: CONVERSATIONS.slice(5, 10),
  },
  {
    id: 'group-3',
    title: 'ردود يومية سريعة',
    numbers: CONVERSATIONS.slice(10, 15),
  },
];
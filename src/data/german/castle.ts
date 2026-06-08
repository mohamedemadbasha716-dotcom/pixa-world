export interface Sentence {
  de: (name: string) => string;
  ar: (name: string) => string;
  emoji: string;
  color: string;
  gradient: string[];
  words: (name: string) => string[];
}

export interface CastleGroup {
  sentences: Sentence[];
  title: string;
  icon: string;
  accentColor: string;
}

const GROUP_1_INTRO: Sentence[] = [
  {
    de: (n) => `Ich heiße ${n}`,
    ar: (n) => `اسمي ${n}`,
    emoji: '😊',
    color: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    words: (n) => ['Ich', 'heiße', n],
  },
  {
    de: () => `Ich bin acht Jahre alt`,
    ar: () => `عمري ثماني سنوات`,
    emoji: '🎂',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E53'],
    words: () => ['Ich', 'bin', 'acht', 'Jahre', 'alt'],
  },
  {
    de: () => `Ich komme aus Ägypten`,
    ar: () => `أنا من مصر`,
    emoji: '🇪🇬',
    color: '#4CC9F0',
    gradient: ['#4CC9F0', '#0984E3'],
    words: () => ['Ich', 'komme', 'aus', 'Ägypten'],
  },
  {
    de: () => `Ich liebe Deutsch`,
    ar: () => `أنا أحب الألمانية`,
    emoji: '❤️',
    color: '#F72585',
    gradient: ['#F72585', '#B5179E'],
    words: () => ['Ich', 'liebe', 'Deutsch'],
  },
];

const GROUP_2_THINGS: Sentence[] = [
  {
    de: () => `Das ist meine Mutter`,
    ar: () => `هذه أمي`,
    emoji: '👩',
    color: '#00CEC9',
    gradient: ['#00CEC9', '#00B0AF'],
    words: () => ['Das', 'ist', 'meine', 'Mutter'],
  },
  {
    de: (n) => `${n} isst einen Apfel`,
    ar: (n) => `${n} يأكل تفاحة`,
    emoji: '🍎',
    color: '#FF4D6D',
    gradient: ['#FF4D6D', '#C70039'],
    words: (n) => [n, 'isst', 'einen', 'Apfel'],
  },
  {
    de: () => `Der Hund ist braun`,
    ar: () => `الكلب بني`,
    emoji: '🐕',
    color: '#A0522D',
    gradient: ['#A0522D', '#6B3410'],
    words: () => ['Der', 'Hund', 'ist', 'braun'],
  },
  {
    de: () => `Die Sonne ist gelb`,
    ar: () => `الشمس صفراء`,
    emoji: '☀️',
    color: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    words: () => ['Die', 'Sonne', 'ist', 'gelb'],
  },
];

const GROUP_3_CONVERSATION: Sentence[] = [
  {
    de: (n) => `Hallo ${n}, wie geht es dir?`,
    ar: (n) => `أهلاً ${n}، كيف حالك؟`,
    emoji: '👋',
    color: '#9D4EDD',
    gradient: ['#9D4EDD', '#7209B7'],
    words: (n) => ['Hallo', n, 'wie', 'geht', 'es', 'dir'],
  },
  {
    de: () => `Mir geht es gut, danke`,
    ar: () => `أنا بخير، شكراً`,
    emoji: '😄',
    color: '#58CC02',
    gradient: ['#58CC02', '#3A8C00'],
    words: () => ['Mir', 'geht', 'es', 'gut', 'danke'],
  },
  {
    de: () => `Danke schön`,
    ar: () => `شكراً جزيلاً`,
    emoji: '🙏',
    color: '#FFD700',
    gradient: ['#FFD700', '#FFA500'],
    words: () => ['Danke', 'schön'],
  },
  {
    de: (n) => `Auf Wiedersehen, ${n}!`,
    ar: (n) => `مع السلامة ${n}!`,
    emoji: '👋',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E53'],
    words: (n) => ['Auf', 'Wiedersehen', n],
  },
];

export const CASTLE_GROUPS: CastleGroup[] = [
  { sentences: GROUP_1_INTRO,        title: 'عرّف بنفسك',         icon: '😊', accentColor: '#FFD700' },
  { sentences: GROUP_2_THINGS,       title: 'تكلم عن الأشياء',    icon: '🍎', accentColor: '#FF4D6D' },
  { sentences: GROUP_3_CONVERSATION, title: 'محادثات يومية',       icon: '💬', accentColor: '#9D4EDD' },
];
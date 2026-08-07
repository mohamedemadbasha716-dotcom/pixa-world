// src/data/german/forest.ts

export interface GrammarChoice {
  de: string;
  ar: string;
  emoji: string;
}

export interface GrammarItem {
  promptAr: string;
  promptDe: string;
  choices: GrammarChoice[];
  correctIndex: number;
  patternAr: string;
}

export interface ForestWord {
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
  article?: 'der' | 'die' | 'das';
}

export interface ForestSection {
  id: string;
  title: string;
  titleDe: string;
  emoji: string;
  accentColor: string;
  gradient: string[];
  bgColors: string[];
  particleEmoji: string;
  words: ForestWord[];
  grammarItems: GrammarItem[];
}

export const FOREST_SECTIONS: ForestSection[] = [
  // ════════════════════════════════════
  // Section 1: الفواكه (7 كلمات - كلها مؤنث die)
  // ════════════════════════════════════
  {
    id: 'fruits',
    title: 'الفواكه',
    titleDe: 'Früchte',
    emoji: '🍓',
    accentColor: '#FF4D6D',
    gradient: ['#FF4D6D', '#C70039'],
    bgColors: ['#0a1408', '#0f2010', '#0a1408'],
    particleEmoji: '🍃',
    words: [
      { article: 'die', word: 'Banane',   wordAr: 'الموزة',    emoji: '🍌', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { article: 'die', word: 'Traube',   wordAr: 'العنبة',    emoji: '🍇', color: '#7B2FBE', gradient: ['#7B2FBE', '#5A1F8E'] },
      { article: 'die', word: 'Birne',    wordAr: 'الكمثرى',   emoji: '🍐', color: '#A8D5A2', gradient: ['#A8D5A2', '#6FAE6A'] },
      { article: 'die', word: 'Kirsche',  wordAr: 'الكرزة',    emoji: '🍒', color: '#C0392B', gradient: ['#C0392B', '#8B0000'] },
      { article: 'die', word: 'Orange',   wordAr: 'البرتقالة', emoji: '🍊', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { article: 'die', word: 'Zitrone',  wordAr: 'الليمونة',  emoji: '🍋', color: '#FFF44F', gradient: ['#FFF44F', '#E6D900'] },
      { article: 'die', word: 'Erdbeere', wordAr: 'الفراولة',  emoji: '🍓', color: '#FF4D6D', gradient: ['#FF4D6D', '#D63031'] },
    ],
    grammarItems: [
      {
        promptAr: 'ما لون الموزة؟',
        promptDe: 'Die Banane ist...?',
        patternAr: 'die Banane = الموزة (مؤنث)',
        choices: [
          { de: 'Die Banane ist gelb', ar: 'الموزة صفراء', emoji: '🍌' },
          { de: 'Die Banane ist rot', ar: 'الموزة حمراء', emoji: '🍌' },
          { de: 'Die Banane ist blau', ar: 'الموزة زرقاء', emoji: '🍌' },
          { de: 'Die Banane ist grün', ar: 'الموزة خضراء', emoji: '🍌' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'ما لون العنبة؟',
        promptDe: 'Die Traube ist...?',
        patternAr: 'die Traube = العنبة (مؤنث)',
        choices: [
          { de: 'Die Traube ist rot', ar: 'العنبة حمراء', emoji: '🍇' },
          { de: 'Die Traube ist lila', ar: 'العنبة بنفسجية', emoji: '🍇' },
          { de: 'Die Traube ist gelb', ar: 'العنبة صفراء', emoji: '🍇' },
          { de: 'Die Traube ist blau', ar: 'العنبة زرقاء', emoji: '🍇' },
        ],
        correctIndex: 1,
      },
      {
        promptAr: 'ما لون الكرزة؟',
        promptDe: 'Die Kirsche ist...?',
        patternAr: 'die Kirsche = الكرزة (مؤنث)',
        choices: [
          { de: 'Die Kirsche ist blau', ar: 'الكرزة زرقاء', emoji: '🍒' },
          { de: 'Die Kirsche ist grün', ar: 'الكرزة خضراء', emoji: '🍒' },
          { de: 'Die Kirsche ist gelb', ar: 'الكرزة صفراء', emoji: '🍒' },
          { de: 'Die Kirsche ist rot', ar: 'الكرزة حمراء', emoji: '🍒' },
        ],
        correctIndex: 3,
      },
    ],
  },

  // ════════════════════════════════════
  // Section 2: الخضروات (6 كلمات)
  // ════════════════════════════════════
  {
    id: 'vegetables',
    title: 'الخضروات',
    titleDe: 'Gemüse',
    emoji: '🥕',
    accentColor: '#FF9500',
    gradient: ['#FF9500', '#D17F00'],
    bgColors: ['#0d1008', '#162010', '#0d1008'],
    particleEmoji: '🍂',
    words: [
      { article: 'die', word: 'Karotte', wordAr: 'الجزرة',    emoji: '🥕', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { article: 'die', word: 'Tomate',  wordAr: 'الطماطمة',  emoji: '🍅', color: '#FF4D6D', gradient: ['#FF4D6D', '#C0392B'] },
      { article: 'der', word: 'Kürbis',  wordAr: 'اليقطين',   emoji: '🎃', color: '#FF7A00', gradient: ['#FF7A00', '#D65A00'] },
      { article: 'der', word: 'Pilz',    wordAr: 'الفطر',     emoji: '🍄', color: '#C0392B', gradient: ['#C0392B', '#8B0000'] },
      { article: 'die', word: 'Paprika', wordAr: 'الفلفلة',   emoji: '🫑', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
      { article: 'die', word: 'Gurke',   wordAr: 'الخيارة',   emoji: '🥒', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
    ],
    grammarItems: [
      {
        promptAr: 'ما لون الجزرة؟',
        promptDe: 'Die Karotte ist...?',
        patternAr: 'die Karotte = الجزرة (مؤنث)',
        choices: [
          { de: 'Die Karotte ist orange', ar: 'الجزرة برتقالية', emoji: '🥕' },
          { de: 'Die Karotte ist rot', ar: 'الجزرة حمراء', emoji: '🥕' },
          { de: 'Die Karotte ist grün', ar: 'الجزرة خضراء', emoji: '🥕' },
          { de: 'Die Karotte ist blau', ar: 'الجزرة زرقاء', emoji: '🥕' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'ما لون الفطر؟',
        promptDe: 'Der Pilz ist...?',
        patternAr: 'der Pilz = الفطر (مذكر)',
        choices: [
          { de: 'Der Pilz ist grün', ar: 'الفطر أخضر', emoji: '🍄' },
          { de: 'Der Pilz ist gelb', ar: 'الفطر أصفر', emoji: '🍄' },
          { de: 'Der Pilz ist rot', ar: 'الفطر أحمر', emoji: '🍄' },
          { de: 'Der Pilz ist blau', ar: 'الفطر أزرق', emoji: '🍄' },
        ],
        correctIndex: 2,
      },
      {
        promptAr: 'ما لون الخيارة؟',
        promptDe: 'Die Gurke ist...?',
        patternAr: 'die Gurke = الخيارة (مؤنث)',
        choices: [
          { de: 'Die Gurke ist rot', ar: 'الخيارة حمراء', emoji: '🥒' },
          { de: 'Die Gurke ist gelb', ar: 'الخيارة صفراء', emoji: '🥒' },
          { de: 'Die Gurke ist blau', ar: 'الخيارة زرقاء', emoji: '🥒' },
          { de: 'Die Gurke ist grün', ar: 'الخيارة خضراء', emoji: '🥒' },
        ],
        correctIndex: 3,
      },
    ],
  },

  // ════════════════════════════════════
  // Section 3: الحيوانات (7 كلمات)
  // ════════════════════════════════════
  {
    id: 'animals',
    title: 'الحيوانات',
    titleDe: 'Tiere',
    emoji: '🦊',
    accentColor: '#FF9500',
    gradient: ['#FF9500', '#8B4513'],
    bgColors: ['#0e0a06', '#1a1008', '#0e0a06'],
    particleEmoji: '✨',
    words: [
      { article: 'der', word: 'Fuchs',  wordAr: 'الثعلب', emoji: '🦊', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { article: 'der', word: 'Wolf',   wordAr: 'الذئب',  emoji: '🐺', color: '#9B9B9B', gradient: ['#9B9B9B', '#6B6B6B'] },
      { article: 'der', word: 'Igel',   wordAr: 'القنفذ', emoji: '🦔', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { article: 'der', word: 'Hase',   wordAr: 'الأرنب', emoji: '🐇', color: '#F0F0F0', gradient: ['#F0F0F0', '#C0C0C0'] },
      { article: 'der', word: 'Frosch', wordAr: 'الضفدع', emoji: '🐸', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { article: 'das', word: 'Reh',    wordAr: 'الغزال', emoji: '🦌', color: '#C8A96E', gradient: ['#C8A96E', '#8B6B3D'] },
      { article: 'die', word: 'Eule',   wordAr: 'البومة', emoji: '🦉', color: '#8B4513', gradient: ['#8B4513', '#5C2F0D'] },
    ],
    grammarItems: [
      {
        promptAr: 'ما لون الثعلب؟',
        promptDe: 'Der Fuchs ist...?',
        patternAr: 'der Fuchs = الثعلب (مذكر)',
        choices: [
          { de: 'Der Fuchs ist orange', ar: 'الثعلب برتقالي', emoji: '🦊' },
          { de: 'Der Fuchs ist blau', ar: 'الثعلب أزرق', emoji: '🦊' },
          { de: 'Der Fuchs ist grün', ar: 'الثعلب أخضر', emoji: '🦊' },
          { de: 'Der Fuchs ist lila', ar: 'الثعلب بنفسجي', emoji: '🦊' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'ما لون الضفدع؟',
        promptDe: 'Der Frosch ist...?',
        patternAr: 'der Frosch = الضفدع (مذكر)',
        choices: [
          { de: 'Der Frosch ist rot', ar: 'الضفدع أحمر', emoji: '🐸' },
          { de: 'Der Frosch ist gelb', ar: 'الضفدع أصفر', emoji: '🐸' },
          { de: 'Der Frosch ist grün', ar: 'الضفدع أخضر', emoji: '🐸' },
          { de: 'Der Frosch ist blau', ar: 'الضفدع أزرق', emoji: '🐸' },
        ],
        correctIndex: 2,
      },
      {
        promptAr: 'ما لون البومة؟',
        promptDe: 'Die Eule ist...?',
        patternAr: 'die Eule = البومة (مؤنث)',
        choices: [
          { de: 'Die Eule ist grün', ar: 'البومة خضراء', emoji: '🦉' },
          { de: 'Die Eule ist braun', ar: 'البومة بنية', emoji: '🦉' },
          { de: 'Die Eule ist blau', ar: 'البومة زرقاء', emoji: '🦉' },
          { de: 'Die Eule ist rot', ar: 'البومة حمراء', emoji: '🦉' },
        ],
        correctIndex: 1,
      },
    ],
  },

  // ════════════════════════════════════
  // Section 4: الألوان (9 كلمات - أضفنا Grau)
  // ════════════════════════════════════
  {
    id: 'colors',
    title: 'الألوان',
    titleDe: 'Farben',
    emoji: '🎨',
    accentColor: '#C77DFF',
    gradient: ['#C77DFF', '#7209B7'],
    bgColors: ['#0a0a1a', '#12082a', '#0a0a1a'],
    particleEmoji: '🌈',
    words: [
      { word: 'Rot',    wordAr: 'أحمر',    emoji: '🔴', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
      { word: 'Gelb',   wordAr: 'أصفر',    emoji: '🟡', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Grün',   wordAr: 'أخضر',    emoji: '🟢', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Blau',   wordAr: 'أزرق',    emoji: '🔵', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
      { word: 'Lila',   wordAr: 'بنفسجي',  emoji: '🟣', color: '#C77DFF', gradient: ['#C77DFF', '#7209B7'] },
      { word: 'Orange', wordAr: 'برتقالي', emoji: '🟠', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Braun',  wordAr: 'بني',     emoji: '🟤', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { word: 'Weiß',   wordAr: 'أبيض',    emoji: '⚪', color: '#F0F0F0', gradient: ['#F0F0F0', '#A0A0A0'] },
      { word: 'Grau',   wordAr: 'رمادي',   emoji: '🩶', color: '#808080', gradient: ['#808080', '#505050'] },
    ],
    grammarItems: [
      {
        promptAr: 'ما لون السما؟',
        promptDe: 'Der Himmel ist...?',
        patternAr: 'der Himmel = السما (مذكر)',
        choices: [
          { de: 'Der Himmel ist grün', ar: 'السما خضراء', emoji: '🌤️' },
          { de: 'Der Himmel ist blau', ar: 'السما زرقاء', emoji: '🌤️' },
          { de: 'Der Himmel ist rot', ar: 'السما حمراء', emoji: '🌤️' },
          { de: 'Der Himmel ist gelb', ar: 'السما صفراء', emoji: '🌤️' },
        ],
        correctIndex: 1,
      },
      {
        promptAr: 'ما لون العشب؟',
        promptDe: 'Das Gras ist...?',
        patternAr: 'das Gras = العشب (محايد)',
        choices: [
          { de: 'Das Gras ist blau', ar: 'العشب أزرق', emoji: '🌱' },
          { de: 'Das Gras ist rot', ar: 'العشب أحمر', emoji: '🌱' },
          { de: 'Das Gras ist grün', ar: 'العشب أخضر', emoji: '🌱' },
          { de: 'Das Gras ist lila', ar: 'العشب بنفسجي', emoji: '🌱' },
        ],
        correctIndex: 2,
      },
      {
        promptAr: 'ما لون الشمس؟',
        promptDe: 'Die Sonne ist...?',
        patternAr: 'die Sonne = الشمس (مؤنث)',
        choices: [
          { de: 'Die Sonne ist blau', ar: 'الشمس زرقاء', emoji: '☀️' },
          { de: 'Die Sonne ist grün', ar: 'الشمس خضراء', emoji: '☀️' },
          { de: 'Die Sonne ist gelb', ar: 'الشمس صفراء', emoji: '☀️' },
          { de: 'Die Sonne ist braun', ar: 'الشمس بنية', emoji: '☀️' },
        ],
        correctIndex: 2,
      },
    ],
  },
];
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
  patternAr: string; // شرح بسيط للـ pattern
}

export interface ForestWord {
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
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
  grammarItems: GrammarItem[]; // ← جديد
}

export const FOREST_SECTIONS: ForestSection[] = [
  // ════════════════════════════════════
  // Section 1: الفواكه
  // Grammar: Das ist ein/eine ___
  // ════════════════════════════════════
  {
    id: 'fruits',
    title: 'الفواكه',
    titleDe: 'Früchte',
    emoji: '🍎',
    accentColor: '#58CC02',
    gradient: ['#58CC02', '#3A8C00'],
    bgColors: ['#0a1408', '#0f2010', '#0a1408'],
    particleEmoji: '🍃',
    words: [
      { word: 'Apfel',    wordAr: 'تفاحة',   emoji: '🍎', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
      { word: 'Traube',   wordAr: 'عنب',     emoji: '🍇', color: '#7B2FBE', gradient: ['#7B2FBE', '#5A1F8E'] },
      { word: 'Banane',   wordAr: 'موزة',    emoji: '🍌', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Birne',    wordAr: 'كمثرى',   emoji: '🍐', color: '#A8D5A2', gradient: ['#A8D5A2', '#6FAE6A'] },
      { word: 'Kirsche',  wordAr: 'كرز',     emoji: '🍒', color: '#C0392B', gradient: ['#C0392B', '#8B0000'] },
      { word: 'Orange',   wordAr: 'برتقالة', emoji: '🍊', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Zitrone',  wordAr: 'ليمونة',  emoji: '🍋', color: '#FFF44F', gradient: ['#FFF44F', '#E6D900'] },
      { word: 'Erdbeere', wordAr: 'فراولة',  emoji: '🍓', color: '#FF4D6D', gradient: ['#FF4D6D', '#D63031'] },
    ],
    grammarItems: [
      {
        promptAr: 'التفاحة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist ein/eine = ده/دي',
        choices: [
          { de: 'Das ist ein Apfel', ar: 'ده تفاحة', emoji: '🍎' },
          { de: 'Das ist ein Banane', ar: 'ده موزة', emoji: '🍌' },
          { de: 'Das ist ein Kirsche', ar: 'ده كرز', emoji: '🍒' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'الموزة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist eine = دي (مؤنث)',
        choices: [
          { de: 'Das ist ein Apfel', ar: 'ده تفاحة', emoji: '🍎' },
          { de: 'Das ist eine Banane', ar: 'دي موزة', emoji: '🍌' },
          { de: 'Das ist eine Zitrone', ar: 'دي ليمونة', emoji: '🍋' },
        ],
        correctIndex: 1,
      },
      {
        promptAr: 'الفراولة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist eine = دي (مؤنث)',
        choices: [
          { de: 'Das ist eine Traube', ar: 'دي عنب', emoji: '🍇' },
          { de: 'Das ist ein Birne', ar: 'ده كمثرى', emoji: '🍐' },
          { de: 'Das ist eine Erdbeere', ar: 'دي فراولة', emoji: '🍓' },
        ],
        correctIndex: 2,
      },
    ],
  },

  // ════════════════════════════════════
  // Section 2: الخضروات
  // Grammar: Das ist ein/eine ___
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
      { word: 'Karotte',   wordAr: 'جزرة',    emoji: '🥕', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Tomate',    wordAr: 'طماطمة',  emoji: '🍅', color: '#FF4D6D', gradient: ['#FF4D6D', '#C0392B'] },
      { word: 'Kuerbis',   wordAr: 'يقطينة',  emoji: '🎃', color: '#FF7A00', gradient: ['#FF7A00', '#D65A00'] },
      { word: 'Aubergine', wordAr: 'باذنجان', emoji: '🍆', color: '#6B21A8', gradient: ['#6B21A8', '#4A1670'] },
      { word: 'Mais',      wordAr: 'ذرة',     emoji: '🌽', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Zucchini',  wordAr: 'كوسة',    emoji: '🥒', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Pilz',      wordAr: 'فطر',     emoji: '🍄', color: '#C77DFF', gradient: ['#C77DFF', '#9D4EDD'] },
      { word: 'Paprika',   wordAr: 'فلفل',    emoji: '🫑', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
    ],
    grammarItems: [
      {
        promptAr: 'الجزرة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist eine = دي (مؤنث)',
        choices: [
          { de: 'Das ist eine Karotte', ar: 'دي جزرة', emoji: '🥕' },
          { de: 'Das ist ein Mais', ar: 'ده ذرة', emoji: '🌽' },
          { de: 'Das ist ein Pilz', ar: 'ده فطر', emoji: '🍄' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'الذرة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist ein = ده (مذكر/محايد)',
        choices: [
          { de: 'Das ist eine Tomate', ar: 'دي طماطمة', emoji: '🍅' },
          { de: 'Das ist ein Mais', ar: 'ده ذرة', emoji: '🌽' },
          { de: 'Das ist eine Zucchini', ar: 'دي كوسة', emoji: '🥒' },
        ],
        correctIndex: 1,
      },
      {
        promptAr: 'الطماطمة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist eine = دي (مؤنث)',
        choices: [
          { de: 'Das ist ein Kuerbis', ar: 'ده يقطين', emoji: '🎃' },
          { de: 'Das ist eine Aubergine', ar: 'دي باذنجانة', emoji: '🍆' },
          { de: 'Das ist eine Tomate', ar: 'دي طماطمة', emoji: '🍅' },
        ],
        correctIndex: 2,
      },
    ],
  },

  // ════════════════════════════════════
  // Section 3: الحيوانات
  // Grammar: Das ist ein/eine ___
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
      { word: 'Fuchs',         wordAr: 'ثعلب',  emoji: '🦊', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Igel',          wordAr: 'قنفذ',  emoji: '🦔', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { word: 'Eule',          wordAr: 'بومة',  emoji: '🦉', color: '#C8A96E', gradient: ['#C8A96E', '#8B7355'] },
      { word: 'Reh',           wordAr: 'غزال',  emoji: '🦌', color: '#C8A96E', gradient: ['#C8A96E', '#8B6B3D'] },
      { word: 'Wolf',          wordAr: 'ذئب',   emoji: '🐺', color: '#9B9B9B', gradient: ['#9B9B9B', '#6B6B6B'] },
      { word: 'Hase',          wordAr: 'أرنب',  emoji: '🐇', color: '#F0F0F0', gradient: ['#F0F0F0', '#C0C0C0'] },
      { word: 'Frosch',        wordAr: 'ضفدع',  emoji: '🐸', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Schmetterling', wordAr: 'فراشة', emoji: '🦋', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
    ],
    grammarItems: [
      {
        promptAr: 'الثعلب بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist ein = ده (مذكر)',
        choices: [
          { de: 'Das ist ein Fuchs', ar: 'ده ثعلب', emoji: '🦊' },
          { de: 'Das ist eine Eule', ar: 'دي بومة', emoji: '🦉' },
          { de: 'Das ist ein Wolf', ar: 'ده ذئب', emoji: '🐺' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'البومة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist eine = دي (مؤنث)',
        choices: [
          { de: 'Das ist ein Igel', ar: 'ده قنفذ', emoji: '🦔' },
          { de: 'Das ist eine Eule', ar: 'دي بومة', emoji: '🦉' },
          { de: 'Das ist ein Frosch', ar: 'ده ضفدع', emoji: '🐸' },
        ],
        correctIndex: 1,
      },
      {
        promptAr: 'الفراشة بالألماني؟',
        promptDe: 'Das ist...',
        patternAr: 'Das ist eine = دي (مؤنث)',
        choices: [
          { de: 'Das ist ein Reh', ar: 'ده غزال', emoji: '🦌' },
          { de: 'Das ist ein Hase', ar: 'ده أرنب', emoji: '🐇' },
          { de: 'Das ist eine Schmetterling', ar: 'دي فراشة', emoji: '🦋' },
        ],
        correctIndex: 2,
      },
    ],
  },

  // ════════════════════════════════════
  // Section 4: الألوان
  // Grammar: Es ist ___ (أبسط - مفيش ein/eine)
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
      { word: 'Gruen',  wordAr: 'أخضر',    emoji: '🟢', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Blau',   wordAr: 'أزرق',    emoji: '🔵', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
      { word: 'Lila',   wordAr: 'بنفسجي',  emoji: '🟣', color: '#C77DFF', gradient: ['#C77DFF', '#7209B7'] },
      { word: 'Orange', wordAr: 'برتقالي', emoji: '🟠', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Braun',  wordAr: 'بني',     emoji: '🟤', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { word: 'Weiss',  wordAr: 'أبيض',    emoji: '⚪', color: '#F0F0F0', gradient: ['#F0F0F0', '#A0A0A0'] },
    ],
    grammarItems: [
      {
        promptAr: 'التفاحة لونها إيه؟',
        promptDe: 'Der Apfel ist...',
        patternAr: 'ist = اللون بعد الاسم',
        choices: [
          { de: 'Der Apfel ist rot', ar: 'التفاحة حمراء', emoji: '🍎' },
          { de: 'Der Apfel ist blau', ar: 'التفاحة زرقاء', emoji: '🍎' },
          { de: 'Der Apfel ist gelb', ar: 'التفاحة صفراء', emoji: '🍎' },
        ],
        correctIndex: 0,
      },
      {
        promptAr: 'الموزة لونها إيه؟',
        promptDe: 'Die Banane ist...',
        patternAr: 'ist = اللون بعد الاسم',
        choices: [
          { de: 'Die Banane ist rot', ar: 'الموزة حمراء', emoji: '🍌' },
          { de: 'Die Banane ist gelb', ar: 'الموزة صفراء', emoji: '🍌' },
          { de: 'Die Banane ist grün', ar: 'الموزة خضراء', emoji: '🍌' },
        ],
        correctIndex: 1,
      },
      {
        promptAr: 'السما لونها إيه؟',
        promptDe: 'Der Himmel ist...',
        patternAr: 'ist = اللون بعد الاسم',
        choices: [
          { de: 'Der Himmel ist grün', ar: 'السما خضراء', emoji: '🌤️' },
          { de: 'Der Himmel ist rot', ar: 'السما حمراء', emoji: '🌤️' },
          { de: 'Der Himmel ist blau', ar: 'السما زرقاء', emoji: '🌤️' },
        ],
        correctIndex: 2,
      },
    ],
  },
];
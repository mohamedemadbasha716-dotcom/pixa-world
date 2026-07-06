// src/data/german/family.ts

export interface FamilyWord {
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
}

// 🆕 Grammar Item Type
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

// 🆕 Dialogue Types
export interface DialogueTurn {
  speaker: 'karl' | 'child';
  textDe: string;
  textAr: string;
  choices?: GrammarChoice[];
  correctIndex?: number;
}

export interface DialogueItem {
  type: 'dialogue';
  titleAr: string;
  scenario: string;
  turns: DialogueTurn[];
}

// 🆕 Updated Group
export interface FamilyGroup {
  items: FamilyWord[];
  title: string;
  groupId: number;
  icon: string;
  // ⬇️ للـ Grammar Phase (جديد)
  accentColor: string;
  gradient: string[];
  grammarItems?: GrammarItem[];
  dialogueItems?: DialogueItem[];
}

// ════════════════════════════════════════
// 👋 Group 1: التحيات
// Grammar: متى تستخدم كل تحية؟
// ════════════════════════════════════════
export const GREETINGS: FamilyWord[] = [
  { word: 'Hallo',           wordAr: 'مرحباً',             emoji: '👋', color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E53'] },
  { word: 'Guten Morgen',    wordAr: 'صباح الخير',         emoji: '🌅', color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'] },
  { word: 'Guten Tag',       wordAr: 'نهارك سعيد',         emoji: '☀️', color: '#45B7D1', gradient: ['#45B7D1', '#2980B9'] },
  { word: 'Gute Nacht',      wordAr: 'تصبح على خير',       emoji: '🌙', color: '#96CEB4', gradient: ['#96CEB4', '#5FB385'] },
  { word: 'Tschüss',         wordAr: 'مع السلامة',         emoji: '👋', color: '#FFEAA7', gradient: ['#FFEAA7', '#FDCB6E'] },
  { word: 'Auf Wiedersehen', wordAr: 'إلى اللقاء',         emoji: '🤝', color: '#DDA0DD', gradient: ['#DDA0DD', '#B97FBA'] },
];

const GREETINGS_GRAMMAR: GrammarItem[] = [
  {
    promptAr: 'الصبح بتقول إيه؟',
    promptDe: 'Es ist Morgen 🌅',
    patternAr: 'Guten Morgen = صباح الخير',
    choices: [
      { de: 'Guten Morgen', ar: 'صباح الخير', emoji: '🌅' },
      { de: 'Gute Nacht', ar: 'تصبح على خير', emoji: '🌙' },
      { de: 'Auf Wiedersehen', ar: 'إلى اللقاء', emoji: '🤝' },
    ],
    correctIndex: 0,
  },
  {
    promptAr: 'بالليل قبل النوم بتقول إيه؟',
    promptDe: 'Es ist Nacht 🌙',
    patternAr: 'Gute Nacht = تصبح على خير',
    choices: [
      { de: 'Guten Tag', ar: 'نهارك سعيد', emoji: '☀️' },
      { de: 'Gute Nacht', ar: 'تصبح على خير', emoji: '🌙' },
      { de: 'Hallo', ar: 'مرحباً', emoji: '👋' },
    ],
    correctIndex: 1,
  },
  {
    promptAr: 'لما تقابل صاحبك في النهار بتقول؟',
    promptDe: 'Es ist Tag ☀️',
    patternAr: 'Guten Tag = نهارك سعيد',
    choices: [
      { de: 'Tschüss', ar: 'مع السلامة', emoji: '👋' },
      { de: 'Gute Nacht', ar: 'تصبح على خير', emoji: '🌙' },
      { de: 'Guten Tag', ar: 'نهارك سعيد', emoji: '☀️' },
    ],
    correctIndex: 2,
  },
  {
    promptAr: 'لما تمشي من المكان بتقول إيه؟',
    promptDe: 'Du gehst nach Hause 🏠',
    patternAr: 'Tschüss = مع السلامة',
    choices: [
      { de: 'Hallo', ar: 'مرحباً', emoji: '👋' },
      { de: 'Tschüss', ar: 'مع السلامة', emoji: '👋' },
      { de: 'Guten Morgen', ar: 'صباح الخير', emoji: '🌅' },
    ],
    correctIndex: 1,
  },
];

// ════════════════════════════════════════
// 😊 Group 2: التعارف
// Dialogue: Karl يسأل والطفل يرد
// ════════════════════════════════════════
export const INTRODUCTIONS: FamilyWord[] = [
  { word: 'Ich bin Ali',           wordAr: 'أنا اسمي علي',          emoji: '😊', color: '#F0A500', gradient: ['#F0A500', '#D17F00'] },
  { word: 'Wie heißt du',          wordAr: 'ما اسمك',               emoji: '❓', color: '#FF7675', gradient: ['#FF7675', '#E84545'] },
  { word: 'Woher kommst du',       wordAr: 'من أين أنت',            emoji: '🌍', color: '#A29BFE', gradient: ['#A29BFE', '#6C5CE7'] },
  { word: 'Ich komme aus Ägypten', wordAr: 'أنا من مصر',            emoji: '🇪🇬', color: '#FD79A8', gradient: ['#FD79A8', '#E84393'] },
  { word: 'Wie geht es dir',       wordAr: 'كيف حالك',              emoji: '💬', color: '#55EFC4', gradient: ['#55EFC4', '#00B894'] },
  { word: 'Mir geht es gut',       wordAr: 'أنا بخير',              emoji: '😄', color: '#FDCB6E', gradient: ['#FDCB6E', '#E17055'] },
];

const INTRODUCTIONS_DIALOGUES: DialogueItem[] = [
  {
    type: 'dialogue',
    titleAr: 'التعارف مع صديق جديد',
    scenario: 'قابلت Karl لأول مرة في المدرسة. هو هيسلم عليك ويسألك أسئلة.',
    turns: [
      {
        speaker: 'karl',
        textDe: 'Hallo! Wie heißt du?',
        textAr: 'مرحباً! ما اسمك؟',
      },
      {
        speaker: 'child',
        textDe: '',
        textAr: '',
        choices: [
          { de: 'Ich bin Ali', ar: 'أنا اسمي علي', emoji: '😊' },
          { de: 'Gute Nacht', ar: 'تصبح على خير', emoji: '🌙' },
          { de: 'Tschüss', ar: 'مع السلامة', emoji: '👋' },
        ],
        correctIndex: 0,
      },
      {
        speaker: 'karl',
        textDe: 'Schön! Woher kommst du?',
        textAr: 'جميل! من أين أنت؟',
      },
      {
        speaker: 'child',
        textDe: '',
        textAr: '',
        choices: [
          { de: 'Wie heißt du?', ar: 'ما اسمك؟', emoji: '❓' },
          { de: 'Ich komme aus Ägypten', ar: 'أنا من مصر', emoji: '🇪🇬' },
          { de: 'Guten Morgen', ar: 'صباح الخير', emoji: '🌅' },
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    type: 'dialogue',
    titleAr: 'السؤال عن الحال',
    scenario: 'Karl قابلك في الشارع وحب يطمن عليك.',
    turns: [
      {
        speaker: 'karl',
        textDe: 'Hallo Ali! Wie geht es dir?',
        textAr: 'مرحباً علي! كيف حالك؟',
      },
      {
        speaker: 'child',
        textDe: '',
        textAr: '',
        choices: [
          { de: 'Mir geht es gut', ar: 'أنا بخير', emoji: '😄' },
          { de: 'Wie heißt du?', ar: 'ما اسمك؟', emoji: '❓' },
          { de: 'Auf Wiedersehen', ar: 'إلى اللقاء', emoji: '🤝' },
        ],
        correctIndex: 0,
      },
      {
        speaker: 'karl',
        textDe: 'Das freut mich! Tschüss!',
        textAr: 'ده يسعدني! مع السلامة!',
      },
      {
        speaker: 'child',
        textDe: '',
        textAr: '',
        choices: [
          { de: 'Guten Morgen', ar: 'صباح الخير', emoji: '🌅' },
          { de: 'Wie heißt du?', ar: 'ما اسمك؟', emoji: '❓' },
          { de: 'Tschüss!', ar: 'مع السلامة!', emoji: '👋' },
        ],
        correctIndex: 2,
      },
    ],
  },
];

// ════════════════════════════════════════
// 👨‍👩‍👧 Group 3: العائلة
// Grammar: Das ist mein/meine ___
// ════════════════════════════════════════
export const FAMILY: FamilyWord[] = [
  { word: 'die Familie',     wordAr: 'العائلة',            emoji: '👨‍👩‍👧‍👦', color: '#74B9FF', gradient: ['#74B9FF', '#0984E3'] },
  { word: 'der Vater',       wordAr: 'الأب',               emoji: '👨', color: '#FF9FF3', gradient: ['#FF9FF3', '#F368E0'] },
  { word: 'die Mutter',      wordAr: 'الأم',               emoji: '👩', color: '#00CEC9', gradient: ['#00CEC9', '#00B0AF'] },
  { word: 'der Bruder',      wordAr: 'الأخ',               emoji: '👦', color: '#6C5CE7', gradient: ['#6C5CE7', '#4834D4'] },
  { word: 'die Schwester',   wordAr: 'الأخت',              emoji: '👧', color: '#E17055', gradient: ['#E17055', '#D63031'] },
  { word: 'das Baby',        wordAr: 'الطفل الصغير',       emoji: '👶', color: '#0984E3', gradient: ['#0984E3', '#0652DD'] },
  { word: 'die Großmutter',  wordAr: 'الجدة',              emoji: '👵', color: '#A29BFE', gradient: ['#A29BFE', '#5F27CD'] },
  { word: 'der Großvater',   wordAr: 'الجد',               emoji: '👴', color: '#55EFC4', gradient: ['#55EFC4', '#10AC84'] },
];

const FAMILY_GRAMMAR: GrammarItem[] = [
  {
    promptAr: 'كيف تقول "ده أبويا"؟',
    promptDe: 'Das ist...',
    patternAr: 'mein = ملكي (مذكر) → der Vater',
    choices: [
      { de: 'Das ist meine Vater', ar: 'ده أبويا (غلط)', emoji: '👨' },
      { de: 'Das ist mein Vater', ar: 'ده أبويا', emoji: '👨' },
      { de: 'Das ist mein Mutter', ar: 'دي أمي (غلط)', emoji: '👩' },
    ],
    correctIndex: 1,
  },
  {
    promptAr: 'كيف تقول "دي أمي"؟',
    promptDe: 'Das ist...',
    patternAr: 'meine = ملكي (مؤنث) → die Mutter',
    choices: [
      { de: 'Das ist mein Mutter', ar: 'دي أمي (غلط)', emoji: '👩' },
      { de: 'Das ist meine Vater', ar: 'ده أبويا (غلط)', emoji: '👨' },
      { de: 'Das ist meine Mutter', ar: 'دي أمي', emoji: '👩' },
    ],
    correctIndex: 2,
  },
  {
    promptAr: 'كيف تقول "ده أخويا"؟',
    promptDe: 'Das ist...',
    patternAr: 'mein = ملكي (مذكر) → der Bruder',
    choices: [
      { de: 'Das ist mein Bruder', ar: 'ده أخويا', emoji: '👦' },
      { de: 'Das ist meine Bruder', ar: 'ده أخويا (غلط)', emoji: '👦' },
      { de: 'Das ist mein Schwester', ar: 'دي أختي (غلط)', emoji: '👧' },
    ],
    correctIndex: 0,
  },
  {
    promptAr: 'كيف تقول "دي أختي"؟',
    promptDe: 'Das ist...',
    patternAr: 'meine = ملكي (مؤنث) → die Schwester',
    choices: [
      { de: 'Das ist mein Schwester', ar: 'دي أختي (غلط)', emoji: '👧' },
      { de: 'Das ist meine Schwester', ar: 'دي أختي', emoji: '👧' },
      { de: 'Das ist meine Bruder', ar: 'ده أخويا (غلط)', emoji: '👦' },
    ],
    correctIndex: 1,
  },
];

// ════════════════════════════════════════
// 📦 Family Groups Export (محدّث)
// ════════════════════════════════════════
export const FAMILY_GROUPS: FamilyGroup[] = [
  { 
    items: GREETINGS,     
    title: 'التحيات',     
    groupId: 0, 
    icon: '👋',
    accentColor: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E53'],
    grammarItems: GREETINGS_GRAMMAR,
  },
  { 
    items: INTRODUCTIONS, 
    title: 'عرّف بنفسك',  
    groupId: 1, 
    icon: '😊',
    accentColor: '#F0A500',
    gradient: ['#F0A500', '#D17F00'],
    dialogueItems: INTRODUCTIONS_DIALOGUES,
  },
  { 
    items: FAMILY,        
    title: 'العائلة',     
    groupId: 2, 
    icon: '👨‍👩‍👧',
    accentColor: '#74B9FF',
    gradient: ['#74B9FF', '#0984E3'],
    grammarItems: FAMILY_GRAMMAR,
  },
];
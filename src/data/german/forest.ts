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
}

export const FOREST_SECTIONS: ForestSection[] = [
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
  },
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
  },
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
  },
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
      { word: 'Rot',     wordAr: 'أحمر',    emoji: '🔴', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
      { word: 'Gelb',    wordAr: 'أصفر',    emoji: '🟡', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Gruen',   wordAr: 'أخضر',    emoji: '🟢', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Blau',    wordAr: 'أزرق',    emoji: '🔵', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
      { word: 'Lila',    wordAr: 'بنفسجي',  emoji: '🟣', color: '#C77DFF', gradient: ['#C77DFF', '#7209B7'] },
      { word: 'Orange',  wordAr: 'برتقالي', emoji: '🟠', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Braun',   wordAr: 'بني',     emoji: '🟤', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { word: 'Weiss',   wordAr: 'أبيض',    emoji: '⚪', color: '#F0F0F0', gradient: ['#F0F0F0', '#A0A0A0'] },
    ],
  },
];
export type EnglishLetter = {
  letter: string;
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  sound: string;
};

export const ENGLISH_LETTERS: EnglishLetter[] = [
  { letter: 'A', word: 'Apple',  wordAr: 'تفاحة',   emoji: '🍎', color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E8E'], sound: '/a/' },
  { letter: 'B', word: 'Ball',   wordAr: 'كرة',     emoji: '⚽', color: '#4CC9F0', gradient: ['#4CC9F0', '#7AD7F5'], sound: '/b/' },
  { letter: 'C', word: 'Cat',    wordAr: 'قطة',     emoji: '🐱', color: '#FFD700', gradient: ['#FFD700', '#FFE566'], sound: '/k/' },
  { letter: 'D', word: 'Dog',    wordAr: 'كلب',     emoji: '🐶', color: '#F72585', gradient: ['#F72585', '#FF5AA8'], sound: '/d/' },
  { letter: 'E', word: 'Egg',    wordAr: 'بيضة',    emoji: '🥚', color: '#06D6A0', gradient: ['#06D6A0', '#4AE5BC'], sound: '/e/' },
  { letter: 'F', word: 'Fish',   wordAr: 'سمكة',    emoji: '🐟', color: '#7209B7', gradient: ['#7209B7', '#9B4DE0'], sound: '/f/' },
  { letter: 'G', word: 'Goat',   wordAr: 'ماعز',    emoji: '🐐', color: '#FF8C00', gradient: ['#FF8C00', '#FFB347'], sound: '/g/' },
  { letter: 'H', word: 'Hat',    wordAr: 'قبعة',    emoji: '🎩', color: '#4CC9F0', gradient: ['#4CC9F0', '#7AD7F5'], sound: '/h/' },
  { letter: 'I', word: 'Ice',    wordAr: 'ثلج',     emoji: '🧊', color: '#00B4D8', gradient: ['#00B4D8', '#48CAE4'], sound: '/i/' },
  { letter: 'J', word: 'Jam',    wordAr: 'مربى',    emoji: '🍯', color: '#F72585', gradient: ['#F72585', '#FF5AA8'], sound: '/j/' },
  { letter: 'K', word: 'Kite',   wordAr: 'طائرة ورقية', emoji: '🪁', color: '#58CC02', gradient: ['#58CC02', '#7FE02A'], sound: '/k/' },
  { letter: 'L', word: 'Lion',   wordAr: 'أسد',     emoji: '🦁', color: '#FFD700', gradient: ['#FFD700', '#FFE566'], sound: '/l/' },
  { letter: 'M', word: 'Moon',   wordAr: 'قمر',     emoji: '🌙', color: '#7209B7', gradient: ['#7209B7', '#9B4DE0'], sound: '/m/' },
  { letter: 'N', word: 'Nest',   wordAr: 'عش',      emoji: '🪺', color: '#06D6A0', gradient: ['#06D6A0', '#4AE5BC'], sound: '/n/' },
  { letter: 'O', word: 'Orange', wordAr: 'برتقالة', emoji: '🍊', color: '#FF8C00', gradient: ['#FF8C00', '#FFB347'], sound: '/o/' },
  { letter: 'P', word: 'Pig',    wordAr: 'خنزير',   emoji: '🐷', color: '#F72585', gradient: ['#F72585', '#FF5AA8'], sound: '/p/' },
  { letter: 'Q', word: 'Queen',  wordAr: 'ملكة',    emoji: '👸', color: '#9D4EDD', gradient: ['#9D4EDD', '#C77DFF'], sound: '/kw/' },
  { letter: 'R', word: 'Rose',   wordAr: 'وردة',    emoji: '🌹', color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E8E'], sound: '/r/' },
  { letter: 'S', word: 'Sun',    wordAr: 'شمس',     emoji: '☀️', color: '#FFD700', gradient: ['#FFD700', '#FFE566'], sound: '/s/' },
  { letter: 'T', word: 'Tree',   wordAr: 'شجرة',    emoji: '🌳', color: '#58CC02', gradient: ['#58CC02', '#7FE02A'], sound: '/t/' },
  { letter: 'U', word: 'Umbrella', wordAr: 'شمسية', emoji: '☂️', color: '#4CC9F0', gradient: ['#4CC9F0', '#7AD7F5'], sound: '/u/' },
  { letter: 'V', word: 'Van',    wordAr: 'فان',     emoji: '🚐', color: '#7209B7', gradient: ['#7209B7', '#9B4DE0'], sound: '/v/' },
  { letter: 'W', word: 'Water',  wordAr: 'ماء',     emoji: '💧', color: '#00B4D8', gradient: ['#00B4D8', '#48CAE4'], sound: '/w/' },
  { letter: 'X', word: 'Box',    wordAr: 'صندوق',   emoji: '📦', color: '#FF8C00', gradient: ['#FF8C00', '#FFB347'], sound: '/ks/' },
  { letter: 'Y', word: 'Yellow', wordAr: 'أصفر',    emoji: '🟡', color: '#FFD700', gradient: ['#FFD700', '#FFE566'], sound: '/y/' },
  { letter: 'Z', word: 'Zebra',  wordAr: 'حمار وحشي', emoji: '🦓', color: '#F72585', gradient: ['#F72585', '#FF5AA8'], sound: '/z/' },
];

export const TOTAL_ENGLISH_LETTERS = ENGLISH_LETTERS.length;
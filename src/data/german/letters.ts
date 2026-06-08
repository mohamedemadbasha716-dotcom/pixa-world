export interface Letter {
  letter: string;
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
}

export interface LetterGroup {
  letters: Letter[];
  title: string;
  groupId: number;
}

export const LETTERS: Letter[] = [
  { letter: 'A', word: 'Anker',        wordAr: 'مرساة',         emoji: '⚓', color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E53'] },
  { letter: 'B', word: 'Boot',         wordAr: 'قارب',          emoji: '⛵', color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'] },
  { letter: 'C', word: 'Container',    wordAr: 'حاوية شحن',     emoji: '📦', color: '#45B7D1', gradient: ['#45B7D1', '#2980B9'] },
  { letter: 'D', word: 'Delphin',      wordAr: 'دولفين',        emoji: '🐬', color: '#96CEB4', gradient: ['#96CEB4', '#5FB385'] },
  { letter: 'E', word: 'Eimer',        wordAr: 'جردل',          emoji: '🪣', color: '#FFEAA7', gradient: ['#FFEAA7', '#FDCB6E'] },
  { letter: 'F', word: 'Fisch',        wordAr: 'سمكة',          emoji: '🐟', color: '#DDA0DD', gradient: ['#DDA0DD', '#B97FBA'] },
  { letter: 'G', word: 'Gabelstapler', wordAr: 'رافعة شوكية',   emoji: '🚜', color: '#F0A500', gradient: ['#F0A500', '#D17F00'] },
  { letter: 'H', word: 'Haken',        wordAr: 'خطاف',          emoji: '🪝', color: '#FF7675', gradient: ['#FF7675', '#E84545'] },
  { letter: 'I', word: 'Insel',        wordAr: 'جزيرة',         emoji: '🏝️', color: '#A29BFE', gradient: ['#A29BFE', '#6C5CE7'] },
  { letter: 'J', word: 'Jacke',        wordAr: 'جاكيت',         emoji: '🧥', color: '#FD79A8', gradient: ['#FD79A8', '#E84393'] },
  { letter: 'K', word: 'Kran',         wordAr: 'رافعة',         emoji: '🏗️', color: '#55EFC4', gradient: ['#55EFC4', '#00B894'] },
  { letter: 'L', word: 'Leuchtturm',   wordAr: 'منارة',         emoji: '🗼', color: '#FDCB6E', gradient: ['#FDCB6E', '#E17055'] },
  { letter: 'M', word: 'Möwe',         wordAr: 'نورس',          emoji: '🕊️', color: '#74B9FF', gradient: ['#74B9FF', '#0984E3'] },
  { letter: 'N', word: 'Netz',         wordAr: 'شبكة صيد',      emoji: '🕸️', color: '#FF9FF3', gradient: ['#FF9FF3', '#F368E0'] },
  { letter: 'O', word: 'Otter',        wordAr: 'قضاعة',         emoji: '🦦', color: '#00CEC9', gradient: ['#00CEC9', '#00B0AF'] },
  { letter: 'P', word: 'Pinguin',      wordAr: 'بطريق',         emoji: '🐧', color: '#6C5CE7', gradient: ['#6C5CE7', '#4834D4'] },
  { letter: 'Q', word: 'Qualle',       wordAr: 'قنديل البحر',   emoji: '🪼', color: '#E17055', gradient: ['#E17055', '#D63031'] },
  { letter: 'R', word: 'Ruder',        wordAr: 'مجداف',         emoji: '🚣', color: '#0984E3', gradient: ['#0984E3', '#0652DD'] },
  { letter: 'S', word: 'Schiff',       wordAr: 'سفينة',         emoji: '🚢', color: '#FDCB6E', gradient: ['#FDCB6E', '#F39C12'] },
  { letter: 'T', word: 'Tau',          wordAr: 'حبل',           emoji: '🪢', color: '#E17055', gradient: ['#E17055', '#C0392B'] },
  { letter: 'U', word: 'Uhr',          wordAr: 'ساعة',          emoji: '⏰', color: '#A29BFE', gradient: ['#A29BFE', '#5F27CD'] },
  { letter: 'V', word: 'Vogel',        wordAr: 'طائر',          emoji: '🐦', color: '#55EFC4', gradient: ['#55EFC4', '#10AC84'] },
  { letter: 'W', word: 'Welle',        wordAr: 'موجة',          emoji: '🌊', color: '#74B9FF', gradient: ['#74B9FF', '#2E86DE'] },
  { letter: 'X', word: 'Xylofon',      wordAr: 'إكسيلوفون',    emoji: '🎵', color: '#FD79A8', gradient: ['#FD79A8', '#EE5A6F'] },
  { letter: 'Y', word: 'Yacht',        wordAr: 'يخت',           emoji: '⛵', color: '#FFEAA7', gradient: ['#FFEAA7', '#F8B500'] },
  { letter: 'Z', word: 'Zug',          wordAr: 'قطار',          emoji: '🚂', color: '#DDA0DD', gradient: ['#DDA0DD', '#A55EEA'] },
];

export const LETTER_GROUPS: LetterGroup[] = [
  { letters: LETTERS.slice(0, 6),   title: 'المجموعة الأولى',   groupId: 0 },
  { letters: LETTERS.slice(6, 12),  title: 'المجموعة الثانية',  groupId: 1 },
  { letters: LETTERS.slice(12, 18), title: 'المجموعة الثالثة',  groupId: 2 },
  { letters: LETTERS.slice(18, 24), title: 'المجموعة الرابعة',  groupId: 3 },
  { letters: LETTERS.slice(24, 26), title: 'المجموعة الخامسة',  groupId: 4 },
];
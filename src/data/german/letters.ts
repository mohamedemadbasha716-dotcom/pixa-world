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
  // 🌊 المجموعة 1
  { letter: 'A', word: 'Ast',     wordAr: 'فرع شجرة',    emoji: '🌿', color: '#8B4513', gradient: ['#A0522D', '#6B3410'] },
  { letter: 'B', word: 'Boot',    wordAr: 'قارب',        emoji: '⛵', color: '#DC143C', gradient: ['#FF6B6B', '#DC143C'] },
  { letter: 'C', word: 'Chef',    wordAr: 'كابتن',       emoji: '👨‍✈️', color: '#4169E1', gradient: ['#5B8DEE', '#3B5FCC'] },
  { letter: 'D', word: 'Dose',    wordAr: 'علبة',        emoji: '🥫', color: '#FF6347', gradient: ['#FF7F50', '#E5533D'] },
  { letter: 'E', word: 'Ente',    wordAr: 'بطة',         emoji: '🦆', color: '#FFD700', gradient: ['#FFE55C', '#F5C842'] },
  { letter: 'Ä', word: 'Äpfel',   wordAr: 'تفاح',        emoji: '🍎', color: '#DC143C', gradient: ['#FF4444', '#B22222'] },

  // 🐟 المجموعة 2
  { letter: 'F', word: 'Fisch',   wordAr: 'سمكة',        emoji: '🐟', color: '#00BFFF', gradient: ['#4CC9F0', '#0F91CD'] },
  { letter: 'G', word: 'Gans',    wordAr: 'إوزة',        emoji: '🪿', color: '#B0B0B0', gradient: ['#E0E0E0', '#909090'] },
  { letter: 'H', word: 'Hut',     wordAr: 'قبعة',        emoji: '🎩', color: '#4682B4', gradient: ['#5B9AD8', '#2E5C8A'] },
  { letter: 'I', word: 'Igel',    wordAr: 'قنفذ',        emoji: '🦔', color: '#8B4513', gradient: ['#A0522D', '#6B3410'] },
  { letter: 'J', word: 'Jacke',   wordAr: 'جاكيت',       emoji: '🧥', color: '#FFD700', gradient: ['#FFE55C', '#F5C842'] },
  { letter: 'Ö', word: 'Öl',      wordAr: 'زيت',         emoji: '🛢️', color: '#2F4F4F', gradient: ['#4A6A6A', '#1C3030'] },

  // 🏖️ المجموعة 3
  { letter: 'K', word: 'Krebs',   wordAr: 'كابوريا',     emoji: '🦀', color: '#FF4500', gradient: ['#FF6347', '#CC3700'] },
  { letter: 'L', word: 'Lampe',   wordAr: 'لمبة',        emoji: '💡', color: '#FFA500', gradient: ['#FFC947', '#E59400'] },
  { letter: 'M', word: 'Maus',    wordAr: 'فأر',         emoji: '🐭', color: '#808080', gradient: ['#A9A9A9', '#606060'] },
  { letter: 'N', word: 'Nest',    wordAr: 'عش',          emoji: '🪺', color: '#8B4513', gradient: ['#A0522D', '#6B3410'] },
  { letter: 'O', word: 'Obst',    wordAr: 'فاكهة',       emoji: '🍎', color: '#FF6347', gradient: ['#FF8367', '#E5533D'] },
  { letter: 'Ü', word: 'Tür',     wordAr: 'باب',         emoji: '🚪', color: '#8B4513', gradient: ['#A0522D', '#6B3410'] },

  // 🌴 المجموعة 4
  { letter: 'P', word: 'Palme',   wordAr: 'نخلة',        emoji: '🌴', color: '#228B22', gradient: ['#3CB371', '#1F6B1F'] },
  { letter: 'Q', word: 'Qualle',  wordAr: 'قنديل بحر',   emoji: '🪼', color: '#DA70D6', gradient: ['#EE82EE', '#B857B2'] },
  { letter: 'R', word: 'Rose',    wordAr: 'وردة',        emoji: '🌹', color: '#DC143C', gradient: ['#FF4569', '#B22222'] },
  { letter: 'S', word: 'Sonne',   wordAr: 'شمس',         emoji: '☀️', color: '#FFD700', gradient: ['#FFE55C', '#F5B800'] },
  { letter: 'T', word: 'Tau',     wordAr: 'حبل',         emoji: '🪢', color: '#8B7355', gradient: ['#A0826D', '#6B5643'] },
  { letter: 'ß', word: 'Fuß',     wordAr: 'قدم',         emoji: '🦶', color: '#DEB887', gradient: ['#F0C896', '#B8945F'] },

  // 🌟 المجموعة 5
  { letter: 'U', word: 'Uhr',     wordAr: 'ساعة',        emoji: '⏰', color: '#B8860B', gradient: ['#DAA520', '#8B6508'] },
  { letter: 'V', word: 'Vogel',   wordAr: 'عصفور',       emoji: '🐦', color: '#8B4513', gradient: ['#A0522D', '#6B3410'] },
  { letter: 'W', word: 'Wal',     wordAr: 'حوت',         emoji: '🐋', color: '#4682B4', gradient: ['#5B9AD8', '#2E5C8A'] },
  { letter: 'X', word: 'Xylofon', wordAr: 'إكسيلوفون',  emoji: '🎵', color: '#FF1493', gradient: ['#FF69B4', '#C71585'] },
  { letter: 'Y', word: 'Yacht',   wordAr: 'يخت',         emoji: '🛥️', color: '#F5F5F5', gradient: ['#FFFFFF', '#D3D3D3'] },
  { letter: 'Z', word: 'Zug',     wordAr: 'قطار',        emoji: '🚂', color: '#DC143C', gradient: ['#FF4444', '#B22222'] },
];

export const LETTER_GROUPS: LetterGroup[] = [
  { letters: LETTERS.slice(0, 6),   title: 'المجموعة الأولى',   groupId: 0 },
  { letters: LETTERS.slice(6, 12),  title: 'المجموعة الثانية',  groupId: 1 },
  { letters: LETTERS.slice(12, 18), title: 'المجموعة الثالثة',  groupId: 2 },
  { letters: LETTERS.slice(18, 24), title: 'المجموعة الرابعة',  groupId: 3 },
  { letters: LETTERS.slice(24, 30), title: 'المجموعة الخامسة',  groupId: 4 },
];
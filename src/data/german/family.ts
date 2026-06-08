export interface FamilyWord {
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
}

export interface FamilyGroup {
  items: FamilyWord[];
  title: string;
  groupId: number;
  icon: string;
}

export const GREETINGS: FamilyWord[] = [
  { word: 'Hallo',           wordAr: 'مرحباً',             emoji: '👋', color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E53'] },
  { word: 'Guten Morgen',    wordAr: 'صباح الخير',         emoji: '🌅', color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'] },
  { word: 'Guten Tag',       wordAr: 'نهارك سعيد',         emoji: '☀️', color: '#45B7D1', gradient: ['#45B7D1', '#2980B9'] },
  { word: 'Gute Nacht',      wordAr: 'تصبح على خير',       emoji: '🌙', color: '#96CEB4', gradient: ['#96CEB4', '#5FB385'] },
  { word: 'Tschüss',         wordAr: 'مع السلامة',         emoji: '👋', color: '#FFEAA7', gradient: ['#FFEAA7', '#FDCB6E'] },
  { word: 'Auf Wiedersehen', wordAr: 'إلى اللقاء',         emoji: '🤝', color: '#DDA0DD', gradient: ['#DDA0DD', '#B97FBA'] },
];

export const INTRODUCTIONS: FamilyWord[] = [
  { word: 'Ich bin Ali',           wordAr: 'أنا اسمي علي',          emoji: '😊', color: '#F0A500', gradient: ['#F0A500', '#D17F00'] },
  { word: 'Wie heißt du',          wordAr: 'ما اسمك',               emoji: '❓', color: '#FF7675', gradient: ['#FF7675', '#E84545'] },
  { word: 'Woher kommst du',       wordAr: 'من أين أنت',            emoji: '🌍', color: '#A29BFE', gradient: ['#A29BFE', '#6C5CE7'] },
  { word: 'Ich komme aus Ägypten', wordAr: 'أنا من مصر',            emoji: '🇪🇬', color: '#FD79A8', gradient: ['#FD79A8', '#E84393'] },
  { word: 'Wie geht es dir',       wordAr: 'كيف حالك',              emoji: '💬', color: '#55EFC4', gradient: ['#55EFC4', '#00B894'] },
  { word: 'Mir geht es gut',       wordAr: 'أنا بخير',              emoji: '😄', color: '#FDCB6E', gradient: ['#FDCB6E', '#E17055'] },
];

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

export const FAMILY_GROUPS: FamilyGroup[] = [
  { items: GREETINGS,     title: 'التحيات',     groupId: 0, icon: '👋' },
  { items: INTRODUCTIONS, title: 'عرّف بنفسك',  groupId: 1, icon: '😊' },
  { items: FAMILY,        title: 'العائلة',     groupId: 2, icon: '👨‍👩‍👧' },
];
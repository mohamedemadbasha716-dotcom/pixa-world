export interface LakeWord {
  word: string;
  wordAr: string;
  emoji: string;
  color: string;
  gradient: string[];
}

export interface WeekDay extends LakeWord {
  dayNum: number;
}

export type TestType = 'quiz' | 'order' | 'match';

export interface LakeGroup {
  items: LakeWord[];
  title: string;
  titleDe: string;
  groupId: number;
  icon: string;
  testType: TestType;
}

export const WEATHER: LakeWord[] = [
  { word: 'die Sonne',     wordAr: 'الشمس',      emoji: '☀️', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
  { word: 'der Regen',     wordAr: 'المطر',      emoji: '🌧️', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
  { word: 'der Schnee',    wordAr: 'الثلج',      emoji: '❄️', color: '#B5EAEA', gradient: ['#B5EAEA', '#74B9FF'] },
  { word: 'der Wind',      wordAr: 'الرياح',     emoji: '💨', color: '#A8E6CF', gradient: ['#A8E6CF', '#56C596'] },
  { word: 'die Wolke',     wordAr: 'السحابة',    emoji: '☁️', color: '#CFD8DC', gradient: ['#CFD8DC', '#90A4AE'] },
  { word: 'der Donner',    wordAr: 'الرعد',      emoji: '⚡', color: '#FFB74D', gradient: ['#FFB74D', '#FF8F00'] },
  { word: 'der Regenbogen',wordAr: 'قوس قزح',    emoji: '🌈', color: '#FF6B9D', gradient: ['#FF6B9D', '#C44569'] },
  { word: 'Es ist heiß',   wordAr: 'الجو حار',   emoji: '🥵', color: '#FF6B6B', gradient: ['#FF6B6B', '#E84545'] },
  { word: 'Es ist kalt',   wordAr: 'الجو بارد',  emoji: '🥶', color: '#4FC3F7', gradient: ['#4FC3F7', '#0288D1'] },
];

export const WEEKDAYS: WeekDay[] = [
  { word: 'Montag',     wordAr: 'الاثنين',  emoji: '1️⃣', color: '#FF6B6B', gradient: ['#FF6B6B', '#E84545'], dayNum: 1 },
  { word: 'Dienstag',   wordAr: 'الثلاثاء', emoji: '2️⃣', color: '#FFA94D', gradient: ['#FFA94D', '#E67E00'], dayNum: 2 },
  { word: 'Mittwoch',   wordAr: 'الأربعاء', emoji: '3️⃣', color: '#FFD93D', gradient: ['#FFD93D', '#F1B400'], dayNum: 3 },
  { word: 'Donnerstag', wordAr: 'الخميس',   emoji: '4️⃣', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'], dayNum: 4 },
  { word: 'Freitag',    wordAr: 'الجمعة',   emoji: '5️⃣', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'], dayNum: 5 },
  { word: 'Samstag',    wordAr: 'السبت',    emoji: '6️⃣', color: '#845EC2', gradient: ['#845EC2', '#5F3DC4'], dayNum: 6 },
  { word: 'Sonntag',    wordAr: 'الأحد',    emoji: '7️⃣', color: '#F72585', gradient: ['#F72585', '#C2185B'], dayNum: 7 },
];

export const NATURE: LakeWord[] = [
  { word: 'der Berg',    wordAr: 'الجبل',    emoji: '⛰️', color: '#8D6E63', gradient: ['#8D6E63', '#5D4037'] },
  { word: 'der See',     wordAr: 'البحيرة',  emoji: '🏞️', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
  { word: 'der Baum',    wordAr: 'الشجرة',   emoji: '🌳', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
  { word: 'die Blume',   wordAr: 'الوردة',   emoji: '🌸', color: '#FF6B9D', gradient: ['#FF6B9D', '#C44569'] },
  { word: 'der Fluss',   wordAr: 'النهر',    emoji: '🌊', color: '#4FC3F7', gradient: ['#4FC3F7', '#0288D1'] },
  { word: 'der Wald',    wordAr: 'الغابة',   emoji: '🌲', color: '#2D6A4F', gradient: ['#2D6A4F', '#1B4332'] },
  { word: 'der Himmel',  wordAr: 'السماء',   emoji: '🌌', color: '#6C5CE7', gradient: ['#6C5CE7', '#4834D4'] },
  { word: 'der Stern',   wordAr: 'النجمة',   emoji: '⭐', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
];

export const LAKE_GROUPS: LakeGroup[] = [
  { items: WEATHER,  title: 'الطقس',          titleDe: 'Wetter',      groupId: 0, icon: '🌤️', testType: 'quiz'  },
  { items: WEEKDAYS, title: 'أيام الأسبوع',   titleDe: 'Wochentage',  groupId: 1, icon: '📅', testType: 'order' },
  { items: NATURE,   title: 'الطبيعة',        titleDe: 'Natur',       groupId: 2, icon: '🏔️', testType: 'match' },
];
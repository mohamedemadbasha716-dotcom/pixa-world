export interface EnglishNumberItem {
  num: number;
  en: string; // الاسم بالإنجليزية (e.g. "One")
  ar: string; // الترجمة بالعربية (e.g. "واحد")
  emoji: string;
  color: string;
  gradient: [string, string];
}

export interface EnglishNumberGroup {
  id: number;
  title: string;
  titleAr: string;
  numbers: EnglishNumberItem[];
}

export const ENGLISH_NUMBERS: EnglishNumberItem[] = [
  { num: 1, en: 'One', ar: 'واحد', emoji: '🕰️', color: '#4CC9F0', gradient: ['#4CC9F0', '#4895EF'] },
  { num: 2, en: 'Two', ar: 'اثنان', emoji: '🎡', color: '#F72585', gradient: ['#F72585', '#B5179E'] },
  { num: 3, en: 'Three', ar: 'ثلاثة', emoji: '🌉', color: '#7209B7', gradient: ['#7209B7', '#560BAD'] },
  { num: 4, en: 'Four', ar: 'أربعة', emoji: '👑', color: '#FFD700', gradient: ['#FFD700', '#FF8C00'] },
  { num: 5, en: 'Five', ar: 'خمسة', emoji: '🌳', color: '#06D6A0', gradient: ['#06D6A0', '#11998E'] },
  { num: 6, en: 'Six', ar: 'ستة', emoji: '🦁', color: '#58CC02', gradient: ['#58CC02', '#2B9348'] },
  { num: 7, en: 'Seven', ar: 'سبعة', emoji: '🚌', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
  { num: 8, en: 'Eight', ar: 'ثمانية', emoji: '☕', color: '#FFB703', gradient: ['#FFB703', '#FB8500'] },
  { num: 9, en: 'Nine', ar: 'تسعة', emoji: '🎸', color: '#8338EC', gradient: ['#8338EC', '#3A0CA3'] },
  { num: 10, en: 'Ten', ar: 'عشرة', emoji: '🚀', color: '#3A86C8', gradient: ['#3A86C8', '#00C9FF'] },
];

export const ENGLISH_NUMBER_GROUPS: EnglishNumberGroup[] = [
  {
    id: 1,
    title: "Group 1: Numbers 1 - 5",
    titleAr: "المجموعة الأولى: الأرقام من 1 إلى 5",
    numbers: ENGLISH_NUMBERS.slice(0, 5),
  },
  {
    id: 2,
    title: "Group 2: Numbers 6 - 10",
    titleAr: "المجموعة الثانية: الأرقام من 6 إلى 10",
    numbers: ENGLISH_NUMBERS.slice(5, 10),
  }
];
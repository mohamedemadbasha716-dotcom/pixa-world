export interface NumberItem {
  num: number;
  de: string;
  ar: string;
  emoji: string;
  objAr: string;
  color: string;
  gradient: string[];
}

export interface NumberGroup {
  numbers: NumberItem[];
  title: string;
}

export const NUMBERS: NumberItem[] = [
  { num: 1,  de: 'eins',   ar: 'واحد',   emoji: '⛪', objAr: 'كاتدرائية',  color: '#A78BFA', gradient: ['#A78BFA', '#7C3AED'] },
  { num: 2,  de: 'zwei',   ar: 'اثنان',  emoji: '🚗', objAr: 'سيارة',      color: '#F87171', gradient: ['#F87171', '#DC2626'] },
  { num: 3,  de: 'drei',   ar: 'ثلاثة',  emoji: '🐦', objAr: 'حمامة',      color: '#60A5FA', gradient: ['#60A5FA', '#2563EB'] },
  { num: 4,  de: 'vier',   ar: 'أربعة',  emoji: '💡', objAr: 'عمود إضاءة', color: '#FBBF24', gradient: ['#FBBF24', '#D97706'] },
  { num: 5,  de: 'fünf',   ar: 'خمسة',   emoji: '🎈', objAr: 'بالونة',     color: '#F472B6', gradient: ['#F472B6', '#DB2777'] },
  { num: 6,  de: 'sechs',  ar: 'ستة',    emoji: '🪑', objAr: 'كرسي',       color: '#34D399', gradient: ['#34D399', '#059669'] },
  { num: 7,  de: 'sieben', ar: 'سبعة',   emoji: '⭐', objAr: 'نجمة',       color: '#FFD700', gradient: ['#FFD700', '#F59E0B'] },
  { num: 8,  de: 'acht',   ar: 'ثمانية', emoji: '🍾', objAr: 'زجاجة',      color: '#2DD4BF', gradient: ['#2DD4BF', '#0D9488'] },
  { num: 9,  de: 'neun',   ar: 'تسعة',   emoji: '🌸', objAr: 'زهرة',       color: '#FB7185', gradient: ['#FB7185', '#E11D48'] },
  { num: 10, de: 'zehn',   ar: 'عشرة',   emoji: '🐤', objAr: 'طائر',       color: '#93C5FD', gradient: ['#93C5FD', '#3B82F6'] },
];

export const NUMBER_GROUPS: NumberGroup[] = [
  { numbers: NUMBERS.slice(0, 5),  title: 'المجموعة الأولى' },
  { numbers: NUMBERS.slice(5, 10), title: 'المجموعة الثانية' },
];
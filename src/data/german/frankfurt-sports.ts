// ⚽ دروس الرياضة - أليانز أرينا (Allianz Arena) في فرانكفورت
// المستوى: A1.2 | 15 كلمة موزعة على 3 مجموعات

export interface SportItem {
  id: string;
  de: string;
  deBase: string;
  ar: string;
  artikel: 'der' | 'die' | 'das';
  plural: string;
  emoji: string;
  objAr: string;
  color: string;
  gradient: string[];
  exampleDe?: string;
  exampleAr?: string;
}

export interface SportGroup {
  numbers: SportItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🏃 المجموعة الأولى: الرياضات الأساسية
// ═══════════════════════════════════════
const GROUP_1_SPORTARTEN: SportItem[] = [
  {
    id: 'sport-1',
    de: 'Der Fußball',
    deBase: 'Fußball',
    ar: 'كرة قدم',
    artikel: 'der',
    plural: 'die Fußbälle',
    emoji: '⚽',
    objAr: 'كرة القدم',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Ich spiele Fußball.',
    exampleAr: 'أنا بلعب كورة.',
  },
  {
    id: 'sport-2',
    de: 'Der Basketball',
    deBase: 'Basketball',
    ar: 'كرة سلة',
    artikel: 'der',
    plural: 'die Basketbälle',
    emoji: '🏀',
    objAr: 'كرة السلة',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    exampleDe: 'Basketball ist toll.',
    exampleAr: 'كرة السلة حلوة.',
  },
  {
    id: 'sport-3',
    de: 'Das Tennis',
    deBase: 'Tennis',
    ar: 'تنس',
    artikel: 'das',
    plural: '—',
    emoji: '🎾',
    objAr: 'لعبة التنس',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Ich mag Tennis.',
    exampleAr: 'أنا بحب التنس.',
  },
  {
    id: 'sport-4',
    de: 'Das Schwimmen',
    deBase: 'Schwimmen',
    ar: 'سباحة',
    artikel: 'das',
    plural: '—',
    emoji: '🏊',
    objAr: 'السباحة',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Schwimmen ist gesund.',
    exampleAr: 'السباحة مفيدة.',
  },
  {
    id: 'sport-5',
    de: 'Der Lauf',
    deBase: 'Lauf',
    ar: 'جري',
    artikel: 'der',
    plural: 'die Läufe',
    emoji: '🏃',
    objAr: 'الجري',
    color: '#EF4444',
    gradient: ['#EF4444', '#991B1B'],
    exampleDe: 'Ich liebe den Lauf.',
    exampleAr: 'أنا بحب الجري.',
  },
];

// ═══════════════════════════════════════
// 🏋️ المجموعة الثانية: الأدوات الرياضية
// ═══════════════════════════════════════
const GROUP_2_AUSRUESTUNG: SportItem[] = [
  {
    id: 'sport-6',
    de: 'Der Ball',
    deBase: 'Ball',
    ar: 'كرة',
    artikel: 'der',
    plural: 'die Bälle',
    emoji: '🥎',
    objAr: 'الكرة',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#C92A2A'],
    exampleDe: 'Wo ist der Ball?',
    exampleAr: 'فين الكرة؟',
  },
  {
    id: 'sport-7',
    de: 'Das Fahrrad',
    deBase: 'Fahrrad',
    ar: 'دراجة',
    artikel: 'das',
    plural: 'die Fahrräder',
    emoji: '🚴',
    objAr: 'دراجة هوائية',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Mein Fahrrad ist neu.',
    exampleAr: 'دراجتي جديدة.',
  },
  {
    id: 'sport-8',
    de: 'Die Brille',
    deBase: 'Brille',
    ar: 'نظارة',
    artikel: 'die',
    plural: 'die Brillen',
    emoji: '🥽',
    objAr: 'نظارة سباحة',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Die Brille ist blau.',
    exampleAr: 'النظارة زرقا.',
  },
  {
    id: 'sport-9',
    de: 'Der Schuh',
    deBase: 'Schuh',
    ar: 'حذاء',
    artikel: 'der',
    plural: 'die Schuhe',
    emoji: '👟',
    objAr: 'حذاء رياضي',
    color: '#34D399',
    gradient: ['#34D399', '#059669'],
    exampleDe: 'Der Schuh ist klein.',
    exampleAr: 'الجزمة صغيرة.',
  },
  {
    id: 'sport-10',
    de: 'Das Trikot',
    deBase: 'Trikot',
    ar: 'قميص رياضي',
    artikel: 'das',
    plural: 'die Trikots',
    emoji: '👕',
    objAr: 'قميص الفريق',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Das Trikot ist rot.',
    exampleAr: 'القميص أحمر.',
  },
];

// ═══════════════════════════════════════
// 🏆 المجموعة الثالثة: المباراة والملعب
// ═══════════════════════════════════════
const GROUP_3_SPIEL: SportItem[] = [
  {
    id: 'sport-11',
    de: 'Das Spiel',
    deBase: 'Spiel',
    ar: 'مباراة',
    artikel: 'das',
    plural: 'die Spiele',
    emoji: '🎮',
    objAr: 'مباراة كورة',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Das Spiel beginnt jetzt.',
    exampleAr: 'الماتش بيبدأ دلوقتي.',
  },
  {
    id: 'sport-12',
    de: 'Das Tor',
    deBase: 'Tor',
    ar: 'هدف',
    artikel: 'das',
    plural: 'die Tore',
    emoji: '🥅',
    objAr: 'هدف في الكورة',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#2563EB'],
    exampleDe: 'Tor! Wir haben gewonnen!',
    exampleAr: 'جوووول! إحنا كسبنا!',
  },
  {
    id: 'sport-13',
    de: 'Der Spieler',
    deBase: 'Spieler',
    ar: 'لاعب',
    artikel: 'der',
    plural: 'die Spieler',
    emoji: '👨',
    objAr: 'لاعب كورة',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Der Spieler ist stark.',
    exampleAr: 'اللاعب قوي.',
  },
  {
    id: 'sport-14',
    de: 'Das Stadion',
    deBase: 'Stadion',
    ar: 'ملعب',
    artikel: 'das',
    plural: 'die Stadien',
    emoji: '🏟️',
    objAr: 'ملعب كبير',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Das Stadion ist groß.',
    exampleAr: 'الملعب كبير.',
  },
  {
    id: 'sport-15',
    de: 'Der Sieg',
    deBase: 'Sieg',
    ar: 'فوز',
    artikel: 'der',
    plural: 'die Siege',
    emoji: '🏆',
    objAr: 'الفوز في المباراة',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Der Sieg ist süß.',
    exampleAr: 'الفوز حلو.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const SPORTS: SportItem[] = [
  ...GROUP_1_SPORTARTEN,
  ...GROUP_2_AUSRUESTUNG,
  ...GROUP_3_SPIEL,
];

export const SPORTS_GROUPS: SportGroup[] = [
  {
    numbers: GROUP_1_SPORTARTEN,
    title: 'الرياضات الأساسية',
    titleDe: 'Sportarten',
    description: 'أنواع الرياضات المختلفة',
  },
  {
    numbers: GROUP_2_AUSRUESTUNG,
    title: 'الأدوات الرياضية',
    titleDe: 'Ausrüstung',
    description: 'الحاجات اللي بنستخدمها في الرياضة',
  },
  {
    numbers: GROUP_3_SPIEL,
    title: 'المباراة والملعب',
    titleDe: 'Spiel und Stadion',
    description: 'كل حاجة عن الماتش والملعب',
  },
];
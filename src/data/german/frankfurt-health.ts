// 💊 دروس الصحة - مستشفى شاريتيه (Charité) في فرانكفورت
// المستوى: A1.2 | 15 كلمة موزعة على 3 مجموعات

export interface HealthItem {
  id: string;
  de: string;          // الكلمة بالألماني (مع الـ Artikel)
  deBase: string;      // الكلمة بدون artikel (للكتابة)
  ar: string;          // الترجمة العربية
  artikel: 'der' | 'die' | 'das';  // جنس الكلمة
  plural: string;      // الجمع
  emoji: string;       // الإيموجي
  objAr: string;       // وصف عربي إضافي
  color: string;
  gradient: string[];
  exampleDe?: string;  // جملة تطبيقية
  exampleAr?: string;
}

export interface HealthGroup {
  numbers: HealthItem[];  // اسمها numbers عشان تتوافق مع الـ template
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🤒 المجموعة الأولى: الأعراض والألم
// ═══════════════════════════════════════
const GROUP_1_SYMPTOME: HealthItem[] = [
  {
    id: 'health-1',
    de: 'Der Schmerz',
    deBase: 'Schmerz',
    ar: 'ألم',
    artikel: 'der',
    plural: 'die Schmerzen',
    emoji: '😣',
    objAr: 'ألم في الجسم',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#C92A2A'],
    exampleDe: 'Ich habe Schmerzen.',
    exampleAr: 'أنا عندي ألم.',
  },
  {
    id: 'health-2',
    de: 'Der Husten',
    deBase: 'Husten',
    ar: 'كحة',
    artikel: 'der',
    plural: 'die Husten',
    emoji: '😷',
    objAr: 'كحة شديدة',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#0E7C7B'],
    exampleDe: 'Ich habe Husten.',
    exampleAr: 'أنا عندي كحة.',
  },
  {
    id: 'health-3',
    de: 'Der Schnupfen',
    deBase: 'Schnupfen',
    ar: 'رشح',
    artikel: 'der',
    plural: 'die Schnupfen',
    emoji: '🤧',
    objAr: 'رشح في الأنف',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#2563EB'],
    exampleDe: 'Ich habe Schnupfen.',
    exampleAr: 'أنا عندي رشح.',
  },
  {
    id: 'health-4',
    de: 'Das Fieber',
    deBase: 'Fieber',
    ar: 'حرارة',
    artikel: 'das',
    plural: 'die Fieber',
    emoji: '🌡️',
    objAr: 'حرارة عالية',
    color: '#F87171',
    gradient: ['#F87171', '#DC2626'],
    exampleDe: 'Ich habe Fieber.',
    exampleAr: 'أنا عندي حرارة.',
  },
  {
    id: 'health-5',
    de: 'Die Wunde',
    deBase: 'Wunde',
    ar: 'جرح',
    artikel: 'die',
    plural: 'die Wunden',
    emoji: '🩹',
    objAr: 'جرح صغير',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Die Wunde tut weh.',
    exampleAr: 'الجرح بيوجع.',
  },
];

// ═══════════════════════════════════════
// 🏥 المجموعة الثانية: العلاج والمستشفى
// ═══════════════════════════════════════
const GROUP_2_BEHANDLUNG: HealthItem[] = [
  {
    id: 'health-6',
    de: 'Die Medizin',
    deBase: 'Medizin',
    ar: 'دواء',
    artikel: 'die',
    plural: 'die Medizinen',
    emoji: '💊',
    objAr: 'دواء للعلاج',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Ich nehme Medizin.',
    exampleAr: 'أنا باخد دواء.',
  },
  {
    id: 'health-7',
    de: 'Die Tablette',
    deBase: 'Tablette',
    ar: 'قرص',
    artikel: 'die',
    plural: 'die Tabletten',
    emoji: '💊',
    objAr: 'قرص دواء',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Nimm eine Tablette.',
    exampleAr: 'خد قرص واحد.',
  },
  {
    id: 'health-8',
    de: 'Der Arzt',
    deBase: 'Arzt',
    ar: 'دكتور',
    artikel: 'der',
    plural: 'die Ärzte',
    emoji: '👨‍⚕️',
    objAr: 'دكتور رجل',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Der Arzt ist nett.',
    exampleAr: 'الدكتور لطيف.',
  },
  {
    id: 'health-9',
    de: 'Die Ärztin',
    deBase: 'Ärztin',
    ar: 'دكتورة',
    artikel: 'die',
    plural: 'die Ärztinnen',
    emoji: '👩‍⚕️',
    objAr: 'دكتورة ست',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Die Ärztin hilft mir.',
    exampleAr: 'الدكتورة بتساعدني.',
  },
  {
    id: 'health-10',
    de: 'Das Krankenhaus',
    deBase: 'Krankenhaus',
    ar: 'مستشفى',
    artikel: 'das',
    plural: 'die Krankenhäuser',
    emoji: '🏥',
    objAr: 'مستشفى كبير',
    color: '#34D399',
    gradient: ['#34D399', '#059669'],
    exampleDe: 'Ich gehe ins Krankenhaus.',
    exampleAr: 'أنا رايح المستشفى.',
  },
];

// ═══════════════════════════════════════
// 😊 المجموعة الثالثة: الحالة الصحية
// ═══════════════════════════════════════
const GROUP_3_ZUSTAND: HealthItem[] = [
  {
    id: 'health-11',
    de: 'krank',
    deBase: 'krank',
    ar: 'مريض',
    artikel: 'der',
    plural: '—',
    emoji: '🤒',
    objAr: 'شخص مريض',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Ich bin krank.',
    exampleAr: 'أنا مريض.',
  },
  {
    id: 'health-12',
    de: 'gesund',
    deBase: 'gesund',
    ar: 'سليم',
    artikel: 'der',
    plural: '—',
    emoji: '😊',
    objAr: 'شخص في صحة',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Ich bin gesund.',
    exampleAr: 'أنا سليم.',
  },
  {
    id: 'health-13',
    de: 'müde',
    deBase: 'müde',
    ar: 'تعبان',
    artikel: 'der',
    plural: '—',
    emoji: '😴',
    objAr: 'شخص تعبان',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Ich bin müde.',
    exampleAr: 'أنا تعبان.',
  },
  {
    id: 'health-14',
    de: 'Der Kopfschmerz',
    deBase: 'Kopfschmerz',
    ar: 'صداع',
    artikel: 'der',
    plural: 'die Kopfschmerzen',
    emoji: '🤕',
    objAr: 'ألم في الرأس',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Ich habe Kopfschmerzen.',
    exampleAr: 'أنا عندي صداع.',
  },
  {
    id: 'health-15',
    de: 'Der Bauchschmerz',
    deBase: 'Bauchschmerz',
    ar: 'ألم بطن',
    artikel: 'der',
    plural: 'die Bauchschmerzen',
    emoji: '🤢',
    objAr: 'ألم في البطن',
    color: '#92400E',
    gradient: ['#D97706', '#92400E'],
    exampleDe: 'Ich habe Bauchschmerzen.',
    exampleAr: 'أنا عندي ألم في البطن.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const HEALTH: HealthItem[] = [
  ...GROUP_1_SYMPTOME,
  ...GROUP_2_BEHANDLUNG,
  ...GROUP_3_ZUSTAND,
];

export const HEALTH_GROUPS: HealthGroup[] = [
  {
    numbers: GROUP_1_SYMPTOME,
    title: 'الأعراض والألم',
    titleDe: 'Symptome',
    description: 'الحاجات اللي بنحس بيها لما نتعب',
  },
  {
    numbers: GROUP_2_BEHANDLUNG,
    title: 'العلاج والمستشفى',
    titleDe: 'Behandlung',
    description: 'إزاي بنتعالج ومين بيساعدنا',
  },
  {
    numbers: GROUP_3_ZUSTAND,
    title: 'الحالة الصحية',
    titleDe: 'Gesundheitszustand',
    description: 'إزاي بنوصف حالتنا الصحية',
  },
];
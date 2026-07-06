// 🎭 دروس المشاعر - حدائق بالمنغارتن (Palmengarten) في فرانكفورت
// المستوى: A1.2 | 15 كلمة موزعة على 3 مجموعات

export interface FeelingItem {
  id: string;
  de: string;          // الكلمة بالألماني
  deBase: string;      // الكلمة بدون artikel (للكتابة)
  ar: string;          // الترجمة العربية
  artikel: 'der' | 'die' | 'das';  // جنس الكلمة (للصفات نستخدم der افتراضياً)
  plural: string;      // الجمع
  emoji: string;       // الإيموجي
  objAr: string;       // وصف عربي إضافي
  color: string;
  gradient: string[];
  exampleDe?: string;  // جملة تطبيقية
  exampleAr?: string;
}

export interface FeelingGroup {
  numbers: FeelingItem[];  // اسمها numbers عشان تتوافق مع الـ template
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 😊 المجموعة الأولى: المشاعر الإيجابية
// ═══════════════════════════════════════
const GROUP_1_POSITIV: FeelingItem[] = [
  {
    id: 'feeling-1',
    de: 'glücklich',
    deBase: 'glücklich',
    ar: 'سعيد',
    artikel: 'der',
    plural: '—',
    emoji: '😊',
    objAr: 'شخص سعيد',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Ich bin glücklich.',
    exampleAr: 'أنا سعيد.',
  },
  {
    id: 'feeling-2',
    de: 'froh',
    deBase: 'froh',
    ar: 'مبسوط',
    artikel: 'der',
    plural: '—',
    emoji: '😄',
    objAr: 'شخص مبسوط',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#C92A2A'],
    exampleDe: 'Ich bin froh.',
    exampleAr: 'أنا مبسوط.',
  },
  {
    id: 'feeling-3',
    de: 'zufrieden',
    deBase: 'zufrieden',
    ar: 'راضي',
    artikel: 'der',
    plural: '—',
    emoji: '😌',
    objAr: 'شخص راضي',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Ich bin zufrieden.',
    exampleAr: 'أنا راضي.',
  },
  {
    id: 'feeling-4',
    de: 'stolz',
    deBase: 'stolz',
    ar: 'فخور',
    artikel: 'der',
    plural: '—',
    emoji: '🤴',
    objAr: 'شخص فخور',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Ich bin stolz auf dich.',
    exampleAr: 'أنا فخور بيك.',
  },
  {
    id: 'feeling-5',
    de: 'lieb',
    deBase: 'lieb',
    ar: 'حنون',
    artikel: 'der',
    plural: '—',
    emoji: '🥰',
    objAr: 'شخص حنون',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Du bist lieb.',
    exampleAr: 'إنت حنون.',
  },
];

// ═══════════════════════════════════════
// 😢 المجموعة الثانية: المشاعر السلبية
// ═══════════════════════════════════════
const GROUP_2_NEGATIV: FeelingItem[] = [
  {
    id: 'feeling-6',
    de: 'traurig',
    deBase: 'traurig',
    ar: 'حزين',
    artikel: 'der',
    plural: '—',
    emoji: '😢',
    objAr: 'شخص حزين',
    color: '#60A5FA',
    gradient: ['#60A5FA', '#2563EB'],
    exampleDe: 'Ich bin traurig.',
    exampleAr: 'أنا حزين.',
  },
  {
    id: 'feeling-7',
    de: 'wütend',
    deBase: 'wütend',
    ar: 'غضبان',
    artikel: 'der',
    plural: '—',
    emoji: '😠',
    objAr: 'شخص غضبان',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Ich bin wütend.',
    exampleAr: 'أنا غضبان.',
  },
  {
    id: 'feeling-8',
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
    id: 'feeling-9',
    de: 'ängstlich',
    deBase: 'ängstlich',
    ar: 'خايف',
    artikel: 'der',
    plural: '—',
    emoji: '😨',
    objAr: 'شخص خايف',
    color: '#6B7280',
    gradient: ['#6B7280', '#1F2937'],
    exampleDe: 'Ich bin ängstlich.',
    exampleAr: 'أنا خايف.',
  },
  {
    id: 'feeling-10',
    de: 'einsam',
    deBase: 'einsam',
    ar: 'وحيد',
    artikel: 'der',
    plural: '—',
    emoji: '😔',
    objAr: 'شخص وحيد',
    color: '#4B5563',
    gradient: ['#4B5563', '#1F2937'],
    exampleDe: 'Ich bin einsam.',
    exampleAr: 'أنا وحيد.',
  },
];

// ═══════════════════════════════════════
// 😲 المجموعة الثالثة: المشاعر المختلطة
// ═══════════════════════════════════════
const GROUP_3_GEMISCHT: FeelingItem[] = [
  {
    id: 'feeling-11',
    de: 'überrascht',
    deBase: 'überrascht',
    ar: 'متفاجئ',
    artikel: 'der',
    plural: '—',
    emoji: '😲',
    objAr: 'شخص متفاجئ',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    exampleDe: 'Ich bin überrascht!',
    exampleAr: 'أنا متفاجئ!',
  },
  {
    id: 'feeling-12',
    de: 'verwirrt',
    deBase: 'verwirrt',
    ar: 'محتار',
    artikel: 'der',
    plural: '—',
    emoji: '😕',
    objAr: 'شخص محتار',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Ich bin verwirrt.',
    exampleAr: 'أنا محتار.',
  },
  {
    id: 'feeling-13',
    de: 'gelangweilt',
    deBase: 'gelangweilt',
    ar: 'زهقان',
    artikel: 'der',
    plural: '—',
    emoji: '😒',
    objAr: 'شخص زهقان',
    color: '#92400E',
    gradient: ['#D97706', '#92400E'],
    exampleDe: 'Ich bin gelangweilt.',
    exampleAr: 'أنا زهقان.',
  },
  {
    id: 'feeling-14',
    de: 'aufgeregt',
    deBase: 'aufgeregt',
    ar: 'متحمس',
    artikel: 'der',
    plural: '—',
    emoji: '🤩',
    objAr: 'شخص متحمس',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Ich bin aufgeregt!',
    exampleAr: 'أنا متحمس!',
  },
  {
    id: 'feeling-15',
    de: 'nervös',
    deBase: 'nervös',
    ar: 'متوتر',
    artikel: 'der',
    plural: '—',
    emoji: '😬',
    objAr: 'شخص متوتر',
    color: '#34D399',
    gradient: ['#34D399', '#059669'],
    exampleDe: 'Ich bin nervös.',
    exampleAr: 'أنا متوتر.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const FEELINGS: FeelingItem[] = [
  ...GROUP_1_POSITIV,
  ...GROUP_2_NEGATIV,
  ...GROUP_3_GEMISCHT,
];

export const FEELINGS_GROUPS: FeelingGroup[] = [
  {
    numbers: GROUP_1_POSITIV,
    title: 'المشاعر الإيجابية',
    titleDe: 'Positive Gefühle',
    description: 'المشاعر اللي بتخلينا مبسوطين',
  },
  {
    numbers: GROUP_2_NEGATIV,
    title: 'المشاعر السلبية',
    titleDe: 'Negative Gefühle',
    description: 'المشاعر اللي بتخلينا مش كويسين',
  },
  {
    numbers: GROUP_3_GEMISCHT,
    title: 'المشاعر المختلطة',
    titleDe: 'Gemischte Gefühle',
    description: 'مشاعر مختلفة وحالات نفسية',
  },
];
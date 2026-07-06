// 🛍️ دروس التسوق - شارع كوردام (Kurfürstendamm)
// المستوى: A2.1 | 15 كلمة موزعة على 3 مجموعات

export interface ShoppingItem {
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

export interface ShoppingGroup {
  numbers: ShoppingItem[];
  title: string;
  titleDe: string;
  description: string;
}

// ═══════════════════════════════════════
// 🏪 المجموعة الأولى: المتاجر والمحلات
// ═══════════════════════════════════════
const GROUP_1_GESCHAEFTE: ShoppingItem[] = [
  {
    id: 'shop-1',
    de: 'Der Supermarkt',
    deBase: 'Supermarkt',
    ar: 'سوبر ماركت',
    artikel: 'der',
    plural: 'die Supermärkte',
    emoji: '🏪',
    objAr: 'سوبر ماركت كبير',
    color: '#10B981',
    gradient: ['#10B981', '#047857'],
    exampleDe: 'Der Supermarkt ist groß.',
    exampleAr: 'السوبر ماركت كبير.',
  },
  {
    id: 'shop-2',
    de: 'Die Bäckerei',
    deBase: 'Bäckerei',
    ar: 'مخبز',
    artikel: 'die',
    plural: 'die Bäckereien',
    emoji: '🥖',
    objAr: 'مخبز فرنسي',
    color: '#F59E0B',
    gradient: ['#F59E0B', '#B45309'],
    exampleDe: 'Die Bäckerei riecht gut.',
    exampleAr: 'المخبز ريحته حلوة.',
  },
  {
    id: 'shop-3',
    de: 'Die Buchhandlung',
    deBase: 'Buchhandlung',
    ar: 'مكتبة',
    artikel: 'die',
    plural: 'die Buchhandlungen',
    emoji: '📚',
    objAr: 'مكتبة بيع كتب',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#5B21B6'],
    exampleDe: 'Ich kaufe Bücher in der Buchhandlung.',
    exampleAr: 'أنا بشتري كتب من المكتبة.',
  },
  {
    id: 'shop-4',
    de: 'Das Geschäft',
    deBase: 'Geschäft',
    ar: 'محل',
    artikel: 'das',
    plural: 'die Geschäfte',
    emoji: '🏬',
    objAr: 'محل تجاري',
    color: '#3B82F6',
    gradient: ['#3B82F6', '#1E40AF'],
    exampleDe: 'Das Geschäft ist offen.',
    exampleAr: 'المحل مفتوح.',
  },
  {
    id: 'shop-5',
    de: 'Das Einkaufszentrum',
    deBase: 'Einkaufszentrum',
    ar: 'مول',
    artikel: 'das',
    plural: 'die Einkaufszentren',
    emoji: '🏢',
    objAr: 'مركز تسوق كبير',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Das Einkaufszentrum ist neu.',
    exampleAr: 'المول جديد.',
  },
];

// ═══════════════════════════════════════
// 💰 المجموعة الثانية: الفلوس والشراء
// ═══════════════════════════════════════
const GROUP_2_GELD: ShoppingItem[] = [
  {
    id: 'shop-6',
    de: 'Das Geld',
    deBase: 'Geld',
    ar: 'فلوس',
    artikel: 'das',
    plural: 'die Gelder',
    emoji: '💵',
    objAr: 'فلوس نقدية',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    exampleDe: 'Ich habe kein Geld.',
    exampleAr: 'أنا معنديش فلوس.',
  },
  {
    id: 'shop-7',
    de: 'Der Euro',
    deBase: 'Euro',
    ar: 'يورو',
    artikel: 'der',
    plural: 'die Euros',
    emoji: '💶',
    objAr: 'عملة اليورو',
    color: '#0EA5E9',
    gradient: ['#0EA5E9', '#075985'],
    exampleDe: 'Das kostet zehn Euro.',
    exampleAr: 'ده بعشرة يورو.',
  },
  {
    id: 'shop-8',
    de: 'Der Preis',
    deBase: 'Preis',
    ar: 'سعر',
    artikel: 'der',
    plural: 'die Preise',
    emoji: '🏷️',
    objAr: 'سعر المنتج',
    color: '#F97316',
    gradient: ['#FB923C', '#C2410C'],
    exampleDe: 'Wie ist der Preis?',
    exampleAr: 'إيه السعر؟',
  },
  {
    id: 'shop-9',
    de: 'Die Rechnung',
    deBase: 'Rechnung',
    ar: 'فاتورة',
    artikel: 'die',
    plural: 'die Rechnungen',
    emoji: '🧾',
    objAr: 'فاتورة الحساب',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    exampleDe: 'Die Rechnung, bitte!',
    exampleAr: 'الفاتورة من فضلك!',
  },
  {
    id: 'shop-10',
    de: 'Der Rabatt',
    deBase: 'Rabatt',
    ar: 'خصم',
    artikel: 'der',
    plural: 'die Rabatte',
    emoji: '🎁',
    objAr: 'خصم على السعر',
    color: '#DC2626',
    gradient: ['#DC2626', '#991B1B'],
    exampleDe: 'Es gibt einen Rabatt.',
    exampleAr: 'فيه خصم.',
  },
];

// ═══════════════════════════════════════
// 🛒 المجموعة الثالثة: التسوق والأشخاص
// ═══════════════════════════════════════
const GROUP_3_KUNDEN: ShoppingItem[] = [
  {
    id: 'shop-11',
    de: 'Der Kunde',
    deBase: 'Kunde',
    ar: 'عميل',
    artikel: 'der',
    plural: 'die Kunden',
    emoji: '🧑',
    objAr: 'زبون المحل',
    color: '#06B6D4',
    gradient: ['#06B6D4', '#0E7490'],
    exampleDe: 'Der Kunde ist nett.',
    exampleAr: 'العميل لطيف.',
  },
  {
    id: 'shop-12',
    de: 'Der Verkäufer',
    deBase: 'Verkäufer',
    ar: 'بائع',
    artikel: 'der',
    plural: 'die Verkäufer',
    emoji: '👨‍💼',
    objAr: 'بائع في المحل',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#6D28D9'],
    exampleDe: 'Der Verkäufer hilft mir.',
    exampleAr: 'البائع بيساعدني.',
  },
  {
    id: 'shop-13',
    de: 'Die Tasche',
    deBase: 'Tasche',
    ar: 'شنطة',
    artikel: 'die',
    plural: 'die Taschen',
    emoji: '👜',
    objAr: 'شنطة تسوق',
    color: '#EC4899',
    gradient: ['#EC4899', '#BE185D'],
    exampleDe: 'Die Tasche ist schwer.',
    exampleAr: 'الشنطة تقيلة.',
  },
  {
    id: 'shop-14',
    de: 'Die Kasse',
    deBase: 'Kasse',
    ar: 'كاشير',
    artikel: 'die',
    plural: 'die Kassen',
    emoji: '🛒',
    objAr: 'مكان الدفع',
    color: '#FBBF24',
    gradient: ['#FBBF24', '#D97706'],
    exampleDe: 'Wo ist die Kasse?',
    exampleAr: 'فين الكاشير؟',
  },
  {
    id: 'shop-15',
    de: 'Der Einkauf',
    deBase: 'Einkauf',
    ar: 'تسوق',
    artikel: 'der',
    plural: 'die Einkäufe',
    emoji: '🛍️',
    objAr: 'عملية التسوق',
    color: '#F472B6',
    gradient: ['#F472B6', '#DB2777'],
    exampleDe: 'Der Einkauf war gut.',
    exampleAr: 'التسوق كان كويس.',
  },
];

// ═══════════════════════════════════════
// 📦 Export الكل
// ═══════════════════════════════════════
export const SHOPPING: ShoppingItem[] = [
  ...GROUP_1_GESCHAEFTE,
  ...GROUP_2_GELD,
  ...GROUP_3_KUNDEN,
];

export const SHOPPING_GROUPS: ShoppingGroup[] = [
  {
    numbers: GROUP_1_GESCHAEFTE,
    title: 'المتاجر والمحلات',
    titleDe: 'Geschäfte',
    description: 'أنواع المتاجر المختلفة',
  },
  {
    numbers: GROUP_2_GELD,
    title: 'الفلوس والأسعار',
    titleDe: 'Geld und Preise',
    description: 'كل حاجة عن الفلوس',
  },
  {
    numbers: GROUP_3_KUNDEN,
    title: 'الناس والتسوق',
    titleDe: 'Kunden und Einkauf',
    description: 'الأشخاص في رحلة التسوق',
  },
];
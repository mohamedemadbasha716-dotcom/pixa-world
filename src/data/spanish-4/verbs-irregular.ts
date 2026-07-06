// ═══════════════════════════════════════════════════════════
// 🎭 Spanish Irregular Verbs Lesson Data
// 🏛️ Teatro Romano de Mérida - Map 4, Lesson 2
// ═══════════════════════════════════════════════════════════

export interface SpanishVerbsIrregularItem {
  id: string;
  word: string;       // المصدر
  wordAr: string;     // الترجمة
  conjugated: string; // تصريف Yo
  emoji: string;
  sentenceEs: string;
  sentenceAr: string;
  sentenceWords: string[];
  category: 'GO' | 'STEM' | 'TOTAL'; // عصابة الـ GO / المتحولين / المتمردين
  categoryAr: string;
  grammarHint: {
    pattern: string;
    rule: string;
  };
  color: string;
  gradient: [string, string];
}

export const SPANISH_VERBS_IRREGULAR_ITEMS: SpanishVerbsIrregularItem[] = [
  // 🎭 Group 1: Los del -GO (عصابة الـ GO)
  {
    id: 'tener',
    word: 'tener',
    wordAr: 'عنده',
    conjugated: 'tengo',
    emoji: '💎',
    sentenceEs: 'Yo tengo un perro',
    sentenceAr: 'أنا عندي كلب',
    sentenceWords: ['Yo', 'tengo', 'un', 'perro'],
    category: 'GO',
    categoryAr: 'أفعال الـ GO',
    grammarHint: { pattern: 'tener → tengo', rule: 'بنزود G قبل الـ O' },
    color: '#EF4444',
    gradient: ['#FCA5A5', '#B91C1C'],
  },
  {
    id: 'hacer',
    word: 'hacer',
    wordAr: 'يعمل',
    conjugated: 'hago',
    emoji: '🛠️',
    sentenceEs: 'Yo hago la tarea',
    sentenceAr: 'أنا بعمل الواجب',
    sentenceWords: ['Yo', 'hago', 'la', 'tarea'],
    category: 'GO',
    categoryAr: 'أفعال الـ GO',
    grammarHint: { pattern: 'hacer → hago', rule: 'الـ C بتتحول لـ G' },
    color: '#F59E0B',
    gradient: ['#FCD34D', '#B45309'],
  },
  {
    id: 'poner',
    word: 'poner',
    wordAr: 'يحط',
    conjugated: 'pongo',
    emoji: '🍽️',
    sentenceEs: 'Yo pongo la mesa',
    sentenceAr: 'أنا بجهز الترابيزة',
    sentenceWords: ['Yo', 'pongo', 'la', 'mesa'],
    category: 'GO',
    categoryAr: 'أفعال الـ GO',
    grammarHint: { pattern: 'poner → pongo', rule: 'بنزود G قبل الـ O' },
    color: '#10B981',
    gradient: ['#34D399', '#064E3B'],
  },
  {
    id: 'salir',
    word: 'salir',
    wordAr: 'يخرج',
    conjugated: 'salgo',
    emoji: '🚪',
    sentenceEs: 'Yo salgo con amigos',
    sentenceAr: 'أنا بخرج مع أصحابي',
    sentenceWords: ['Yo', 'salgo', 'con', 'amigos'],
    category: 'GO',
    categoryAr: 'أفعال الـ GO',
    grammarHint: { pattern: 'salir → salgo', rule: 'بنزود G قبل الـ O' },
    color: '#3B82F6',
    gradient: ['#60A5FA', '#1E3A8A'],
  },
  {
    id: 'traer',
    word: 'traer',
    wordAr: 'يجيب',
    conjugated: 'traigo',
    emoji: '🎁',
    sentenceEs: 'Yo traigo un regalo',
    sentenceAr: 'أنا جايب هدية',
    sentenceWords: ['Yo', 'traigo', 'un', 'regalo'],
    category: 'GO',
    categoryAr: 'أفعال الـ GO',
    grammarHint: { pattern: 'traer → traigo', rule: 'بنزود IG قبل الـ O' },
    color: '#EC4899',
    gradient: ['#F472B6', '#831843'],
  },

  // 🔄 Group 2: Los Cambiantes (المتحولين - Stem Changers)
  {
    id: 'jugar',
    word: 'jugar',
    wordAr: 'يلعب',
    conjugated: 'juego',
    emoji: '🎮',
    sentenceEs: 'Yo juego al fútbol',
    sentenceAr: 'أنا بلعب كورة',
    sentenceWords: ['Yo', 'juego', 'al', 'fútbol'],
    category: 'STEM',
    categoryAr: 'المتحولين',
    grammarHint: { pattern: 'u → ue', rule: 'الـ U بتتحول لـ UE' },
    color: '#8B5CF6',
    gradient: ['#C4B5FD', '#4C1D95'],
  },
  {
    id: 'dormir',
    word: 'dormir',
    wordAr: 'ينام',
    conjugated: 'duermo',
    emoji: '😴',
    sentenceEs: 'Yo duermo mucho',
    sentenceAr: 'أنا بنام كتير',
    sentenceWords: ['Yo', 'duermo', 'mucho'],
    category: 'STEM',
    categoryAr: 'المتحولين',
    grammarHint: { pattern: 'o → ue', rule: 'الـ O بتتحول لـ UE' },
    color: '#6366F1',
    gradient: ['#818CF8', '#312E81'],
  },
  {
    id: 'querer',
    word: 'querer',
    wordAr: 'عايز',
    conjugated: 'quiero',
    emoji: '🍦',
    sentenceEs: 'Yo quiero un helado',
    sentenceAr: 'أنا عايز آيس كريم',
    sentenceWords: ['Yo', 'quiero', 'un', 'helado'],
    category: 'STEM',
    categoryAr: 'المتحولين',
    grammarHint: { pattern: 'e → ie', rule: 'الـ E بتتحول لـ IE' },
    color: '#F43F5E',
    gradient: ['#FB7185', '#9F1239'],
  },
  {
    id: 'pensar',
    word: 'pensar',
    wordAr: 'يفكر',
    conjugated: 'pienso',
    emoji: '🤔',
    sentenceEs: 'Yo pienso mucho',
    sentenceAr: 'أنا بفكر كتير',
    sentenceWords: ['Yo', 'pienso', 'mucho'],
    category: 'STEM',
    categoryAr: 'المتحولين',
    grammarHint: { pattern: 'e → ie', rule: 'الـ E بتتحول لـ IE' },
    color: '#06B6D4',
    gradient: ['#67E8F9', '#164E63'],
  },
  {
    id: 'poder',
    word: 'poder',
    wordAr: 'يقدر',
    conjugated: 'puedo',
    emoji: '💪',
    sentenceEs: 'Yo puedo saltar',
    sentenceAr: 'أنا أقدر أنط',
    sentenceWords: ['Yo', 'puedo', 'saltar'],
    category: 'STEM',
    categoryAr: 'المتحولين',
    grammarHint: { pattern: 'o → ue', rule: 'الـ O بتتحول لـ UE' },
    color: '#10B981',
    gradient: ['#34D399', '#064E3B'],
  },

  // 👽 Group 3: Los Rebeldes (المتمردين - Totally Irregular)
  {
    id: 'ser',
    word: 'ser',
    wordAr: 'يكون',
    conjugated: 'soy',
    emoji: '👑',
    sentenceEs: 'Yo soy feliz',
    sentenceAr: 'أنا مبسوط',
    sentenceWords: ['Yo', 'soy', 'feliz'],
    category: 'TOTAL',
    categoryAr: 'المتمردين',
    grammarHint: { pattern: 'ser → soy', rule: 'فعل متمرد تماماً!' },
    color: '#EAB308',
    gradient: ['#FDE047', '#854D0E'],
  },
  {
    id: 'estar',
    word: 'estar',
    wordAr: 'يكون (مكان)',
    conjugated: 'estoy',
    emoji: '📍',
    sentenceEs: 'Yo estoy en casa',
    sentenceAr: 'أنا في البيت',
    sentenceWords: ['Yo', 'estoy', 'en', 'casa'],
    category: 'TOTAL',
    categoryAr: 'المتمردين',
    grammarHint: { pattern: 'estar → estoy', rule: 'بنزود Y في الآخر' },
    color: '#F97316',
    gradient: ['#FB923C', '#7C2D12'],
  },
  {
    id: 'ir',
    word: 'ir',
    wordAr: 'يروح',
    conjugated: 'voy',
    emoji: '🚀',
    sentenceEs: 'Yo voy al parque',
    sentenceAr: 'أنا رايح الحديقة',
    sentenceWords: ['Yo', 'voy', 'al', 'parque'],
    category: 'TOTAL',
    categoryAr: 'المتمردين',
    grammarHint: { pattern: 'ir → voy', rule: 'الفعل كله بيتغير لـ VOY' },
    color: '#8B5CF6',
    gradient: ['#A78BFA', '#4C1D95'],
  },
  {
    id: 'dar',
    word: 'dar',
    wordAr: 'يدي',
    conjugated: 'doy',
    emoji: '🤝',
    sentenceEs: 'Yo doy las gracias',
    sentenceAr: 'أنا بقول شكراً',
    sentenceWords: ['Yo', 'doy', 'las', 'gracias'],
    category: 'TOTAL',
    categoryAr: 'المتمردين',
    grammarHint: { pattern: 'dar → doy', rule: 'بنزود Y في الآخر' },
    color: '#D946EF',
    gradient: ['#F5D0FE', '#701A75'],
  },
  {
    id: 'ver',
    word: 'ver',
    wordAr: 'يشوف',
    conjugated: 'veo',
    emoji: '📺',
    sentenceEs: 'Yo veo la tele',
    sentenceAr: 'أنا بشوف التلفزيون',
    sentenceWords: ['Yo', 'veo', 'la', 'tele'],
    category: 'TOTAL',
    categoryAr: 'المتمردين',
    grammarHint: { pattern: 'ver → veo', rule: 'بنزود E قبل الـ O' },
    color: '#0EA5E9',
    gradient: ['#7DD3FC', '#0C4A6E'],
  },
];

export const SPANISH_VERBS_IRREGULAR_GROUPS = [
  { id: 'group-go', titleAr: 'عصابة الـ GO', titleEs: 'Los verbos -GO', items: SPANISH_VERBS_IRREGULAR_ITEMS.slice(0, 5), emoji: '🎭' },
  { id: 'group-stem', titleAr: 'المتحولون', titleEs: 'Los Cambiantes', items: SPANISH_VERBS_IRREGULAR_ITEMS.slice(5, 10), emoji: '🔄' },
  { id: 'group-total', titleAr: 'المتمردون', titleEs: 'Los Rebeldes', items: SPANISH_VERBS_IRREGULAR_ITEMS.slice(10, 15), emoji: '👽' },
];

export function generateIrregularChoices(correctWord: string) {
  const correct = SPANISH_VERBS_IRREGULAR_ITEMS.find(i => i.word === correctWord)!;
  const others = SPANISH_VERBS_IRREGULAR_ITEMS.filter(i => i.word !== correctWord).sort(() => 0.5 - Math.random());
  return [correct, ...others.slice(0, 2)].sort(() => 0.5 - Math.random());
}

export function generateIrregularPool(item: SpanishVerbsIrregularItem) {
  const correct = item.sentenceWords;
  const distractors = ['tú', 'ella', 'es', 'son', 'comer'].filter(w => !correct.includes(w));
  return [...correct, ...distractors.slice(0, 2)].sort(() => 0.5 - Math.random());
}
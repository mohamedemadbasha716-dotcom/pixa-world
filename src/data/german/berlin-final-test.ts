// 🏆 الاختبار النهائي - برج التلفزيون (Fernsehturm) - شهادة A2 برلين
// مراجعة شاملة لكل دروس برلين

export type QuestionType = 'multiple-choice' | 'listening' | 'writing' | 'matching';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  category: 'transport' | 'places' | 'shopping' | 'directions' | 'countries';
  question: string;
  questionDe?: string;
  correctAnswer: string;
  options?: string[];
  imageId?: string;
  emoji?: string;
  ar: string;
  hint?: string;
  points: number;
  matchingPairs?: { de: string; ar: string; emoji: string }[];
  acceptedAnswers?: string[];
}

export const FINAL_TEST_QUESTIONS: TestQuestion[] = [
  // ═══════════════════════════════════════
  // 🎯 المجموعة 1: Multiple Choice (5 أسئلة)
  // ═══════════════════════════════════════
  {
    id: 'q1',
    type: 'multiple-choice',
    category: 'transport',
    question: 'ما الكلمة الصحيحة للصورة؟',
    correctAnswer: 'Der Zug',
    options: ['Der Zug', 'Das Auto', 'Das Fahrrad'],
    emoji: '🚆',
    ar: 'قطار',
    points: 10,
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    category: 'places',
    question: 'أين تشتري الكتب؟',
    correctAnswer: 'Die Buchhandlung',
    options: ['Die Apotheke', 'Die Buchhandlung', 'Die Bank'],
    emoji: '📚',
    ar: 'مكتبة',
    points: 10,
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    category: 'shopping',
    question: 'فين بتدفع في المحل؟',
    correctAnswer: 'Die Kasse',
    options: ['Die Tasche', 'Die Kasse', 'Der Preis'],
    emoji: '🛒',
    ar: 'كاشير',
    points: 10,
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    category: 'directions',
    question: 'إذا قال "geradeaus"، يعني:',
    correctAnswer: 'تودتودت',
    options: ['يمين', 'يسار', 'تودتودت'],
    emoji: '⬆️',
    ar: 'تودتودت',
    points: 10,
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    category: 'countries',
    question: 'عاصمة أي بلد هي برلين؟',
    correctAnswer: 'Deutschland',
    options: ['Frankreich', 'Deutschland', 'Spanien'],
    emoji: '🇩🇪',
    ar: 'ألمانيا',
    points: 10,
  },

  // ═══════════════════════════════════════
  // 🎧 المجموعة 2: Listening (3 أسئلة)
  // ═══════════════════════════════════════
  {
    id: 'q6',
    type: 'listening',
    category: 'transport',
    question: 'اضغط على السماعة واختر الكلمة الصحيحة',
    questionDe: 'Der Bus',
    correctAnswer: 'Der Bus',
    options: ['Das Taxi', 'Der Bus', 'Die U-Bahn'],
    emoji: '🚌',
    ar: 'أوتوبيس',
    points: 10,
  },
  {
    id: 'q7',
    type: 'listening',
    category: 'directions',
    question: 'استمع جيداً واختر',
    questionDe: 'rechts',
    correctAnswer: 'rechts',
    options: ['links', 'rechts', 'zurück'],
    emoji: '➡️',
    ar: 'يمين',
    points: 10,
  },
  {
    id: 'q8',
    type: 'listening',
    category: 'countries',
    question: 'ما الذي تسمعه؟',
    questionDe: 'Ägypten',
    correctAnswer: 'Ägypten',
    options: ['Ägypten', 'Frankreich', 'Italien'],
    emoji: '🇪🇬',
    ar: 'مصر',
    points: 10,
  },

  // ═══════════════════════════════════════
  // ✍️ المجموعة 3: Writing (3 أسئلة)
  // ═══════════════════════════════════════
  {
    id: 'q9',
    type: 'writing',
    category: 'shopping',
    question: 'اكتب الكلمة بالألماني (بدون Artikel)',
    correctAnswer: 'Geld',
    emoji: '💵',
    ar: 'فلوس',
    hint: 'G _ _ _',
    points: 10,
  },
  {
    id: 'q10',
    type: 'writing',
    category: 'directions',
    question: 'اكتب: "يسار" بالألماني',
    correctAnswer: 'links',
    emoji: '⬅️',
    ar: 'يسار',
    hint: 'l _ _ _ s',
    points: 10,
  },
  {
    id: 'q11',
    type: 'writing',
    category: 'places',
    question: 'اكتب: "شارع" بالألماني (بدون Artikel)',
    correctAnswer: 'Straße',
    emoji: '🛣️',
    ar: 'شارع',
    hint: 'S t r _ _ _ e',
    points: 10,
    acceptedAnswers: ['Straße', 'Strasse', 'straße', 'strasse'],
  },

  // ═══════════════════════════════════════
  // 🎯 المجموعة 4: Matching (سؤالين كبيرين)
  // ═══════════════════════════════════════
  {
    id: 'q12',
    type: 'matching',
    category: 'transport',
    question: 'طابق كل وسيلة مواصلات بصورتها',
    correctAnswer: '',
    matchingPairs: [
      { de: 'Zug', ar: 'قطار', emoji: '🚆' },
      { de: 'Auto', ar: 'عربية', emoji: '🚗' },
      { de: 'Fahrrad', ar: 'عجلة', emoji: '🚲' },
      { de: 'Flugzeug', ar: 'طيارة', emoji: '✈️' },
    ],
    ar: 'مطابقة المواصلات',
    points: 10,
  },
  {
    id: 'q13',
    type: 'matching',
    category: 'countries',
    question: 'طابق كل دولة بعلمها',
    correctAnswer: '',
    matchingPairs: [
      { de: 'Deutschland', ar: 'ألمانيا', emoji: '🇩🇪' },
      { de: 'Frankreich', ar: 'فرنسا', emoji: '🇫🇷' },
      { de: 'Spanien', ar: 'إسبانيا', emoji: '🇪🇸' },
      { de: 'Italien', ar: 'إيطاليا', emoji: '🇮🇹' },
    ],
    ar: 'مطابقة الدول',
    points: 10,
  },
];

export const TOTAL_TEST_POINTS = FINAL_TEST_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
export const PASSING_SCORE = 60; // 60% للنجاح (Goethe Standard)

export const CATEGORY_LABELS = {
  transport: { ar: 'المواصلات', de: 'Verkehr', emoji: '🚆' },
  places: { ar: 'الأماكن', de: 'Orte', emoji: '🏛️' },
  shopping: { ar: 'التسوق', de: 'Einkauf', emoji: '🛍️' },
  directions: { ar: 'الاتجاهات', de: 'Richtungen', emoji: '🧭' },
  countries: { ar: 'الدول', de: 'Länder', emoji: '🌍' },
};
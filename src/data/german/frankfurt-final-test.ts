// 🏆 الاختبار النهائي - برج ماين (Main Tower) - شهادة A1
// مراجعة شاملة لكل دروس فرانكفورت

export type QuestionType = 'multiple-choice' | 'listening' | 'writing' | 'matching';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  category: 'clothes' | 'body' | 'health' | 'sports' | 'feelings';
  question: string;        // السؤال بالعربي
  questionDe?: string;     // السؤال بالألماني (للاستماع)
  correctAnswer: string;   // الإجابة الصحيحة
  options?: string[];      // خيارات (للـ Multiple Choice)
  imageId?: string;        // للصور
  emoji?: string;          // إيموجي بديل
  ar: string;              // الترجمة العربية للإجابة
  hint?: string;           // تلميح
  points: number;          // نقاط السؤال
  matchingPairs?: { de: string; ar: string; emoji: string }[]; // للمطابقة
}

export const FINAL_TEST_QUESTIONS: TestQuestion[] = [
  // ═══════════════════════════════════════
  // 🎯 المجموعة 1: Multiple Choice (4 أسئلة)
  // ═══════════════════════════════════════
  {
    id: 'q1',
    type: 'multiple-choice',
    category: 'clothes',
    question: 'ما الكلمة الصحيحة للصورة؟',
    correctAnswer: 'Das T-Shirt',
    options: ['Das T-Shirt', 'Die Hose', 'Der Hut'],
    emoji: '👕',
    ar: 'تي شيرت',
    points: 10,
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    category: 'body',
    question: 'أي كلمة تعني "يد" بالألماني؟',
    correctAnswer: 'Die Hand',
    options: ['Der Fuß', 'Die Hand', 'Das Auge'],
    emoji: '✋',
    ar: 'يد',
    points: 10,
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    category: 'health',
    question: 'إذا كان عندي حرارة، أقول:',
    correctAnswer: 'Ich habe Fieber',
    options: ['Ich bin müde', 'Ich habe Fieber', 'Ich bin glücklich'],
    emoji: '🌡️',
    ar: 'عندي حرارة',
    points: 10,
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    category: 'sports',
    question: 'ما هي الرياضة الموضحة؟',
    correctAnswer: 'Der Fußball',
    options: ['Das Tennis', 'Der Fußball', 'Der Basketball'],
    emoji: '⚽',
    ar: 'كرة قدم',
    points: 10,
  },

  // ═══════════════════════════════════════
  // 🎧 المجموعة 2: Listening (3 أسئلة)
  // ═══════════════════════════════════════
  {
    id: 'q5',
    type: 'listening',
    category: 'feelings',
    question: 'اضغط على السماعة واختر الكلمة الصحيحة',
    questionDe: 'glücklich',
    correctAnswer: 'glücklich',
    options: ['traurig', 'glücklich', 'müde'],
    emoji: '😊',
    ar: 'سعيد',
    points: 10,
  },
  {
    id: 'q6',
    type: 'listening',
    category: 'body',
    question: 'استمع جيداً واختر',
    questionDe: 'Das Auge',
    correctAnswer: 'Das Auge',
    options: ['Das Auge', 'Das Ohr', 'Die Nase'],
    emoji: '👁️',
    ar: 'عين',
    points: 10,
  },
  {
    id: 'q7',
    type: 'listening',
    category: 'clothes',
    question: 'ما الذي تسمعه؟',
    questionDe: 'Die Jacke',
    correctAnswer: 'Die Jacke',
    options: ['Die Hose', 'Die Jacke', 'Das Kleid'],
    emoji: '🧥',
    ar: 'جاكيت',
    points: 10,
  },

  // ═══════════════════════════════════════
  // ✍️ المجموعة 3: Writing (3 أسئلة)
  // ═══════════════════════════════════════
  {
    id: 'q8',
    type: 'writing',
    category: 'body',
    question: 'اكتب الكلمة بالألماني (بدون Artikel)',
    correctAnswer: 'Kopf',
    emoji: '🗣️',
    ar: 'رأس',
    hint: 'K _ _ _',
    points: 10,
  },
  {
    id: 'q9',
    type: 'writing',
    category: 'health',
    question: 'اكتب: "دكتور" بالألماني',
    correctAnswer: 'Arzt',
    emoji: '👨‍⚕️',
    ar: 'دكتور',
    hint: 'A _ _ _',
    points: 10,
  },
  {
    id: 'q10',
    type: 'writing',
    category: 'feelings',
    question: 'اكتب: "تعبان" بالألماني',
    correctAnswer: 'müde',
    emoji: '😴',
    ar: 'تعبان',
    hint: 'm _ _ _',
    points: 10,
  },

  // ═══════════════════════════════════════
  // 🎯 المجموعة 4: Matching (سؤالين كبيرين)
  // ═══════════════════════════════════════
  {
    id: 'q11',
    type: 'matching',
    category: 'clothes',
    question: 'طابق كل كلمة بمعناها',
    correctAnswer: '',
    matchingPairs: [
      { de: 'Hose', ar: 'بنطلون', emoji: '👖' },
      { de: 'Schuhe', ar: 'حذاء', emoji: '👟' },
      { de: 'Hut', ar: 'قبعة', emoji: '🎩' },
      { de: 'Socken', ar: 'شراب', emoji: '🧦' },
    ],
    ar: 'مطابقة الملابس',
    points: 10,
  },
  {
    id: 'q12',
    type: 'matching',
    category: 'sports',
    question: 'طابق كل رياضة بصورتها',
    correctAnswer: '',
    matchingPairs: [
      { de: 'Basketball', ar: 'كرة سلة', emoji: '🏀' },
      { de: 'Tennis', ar: 'تنس', emoji: '🎾' },
      { de: 'Schwimmen', ar: 'سباحة', emoji: '🏊' },
      { de: 'Stadion', ar: 'ملعب', emoji: '🏟️' },
    ],
    ar: 'مطابقة الرياضة',
    points: 10,
  },
];

export const TOTAL_TEST_POINTS = FINAL_TEST_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
export const PASSING_SCORE = 60; // 60% للنجاح (Goethe Standard)

export const CATEGORY_LABELS = {
  clothes: { ar: 'الملابس', de: 'Kleidung', emoji: '👕' },
  body: { ar: 'الجسم', de: 'Körper', emoji: '🦴' },
  health: { ar: 'الصحة', de: 'Gesundheit', emoji: '💊' },
  sports: { ar: 'الرياضة', de: 'Sport', emoji: '⚽' },
  feelings: { ar: 'المشاعر', de: 'Gefühle', emoji: '🎭' },
};
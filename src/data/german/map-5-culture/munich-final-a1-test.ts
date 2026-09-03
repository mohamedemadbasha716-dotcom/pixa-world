// src/data/german/munich-final-a1-test.ts

export interface A1TestQuestion {
  id: string;
  type: 'mcq' | 'write' | 'speak' | 'match';
  category: 'pronouns' | 'verbs' | 'questions' | 'conversation' | 'holidays';
  questionDe: string;
  questionAr: string;
  options?: string[];
  correctAnswer?: string;
  expectedWord?: string;
  matchPairs?: { id: string; de: string; ar: string; emoji: string; color: string }[];
  explanation: string;
  emoji: string;
  color: string;
  gradient: [string, string];
}

export const A1_TEST_QUESTIONS: A1TestQuestion[] = [
  // 🟣 قسم 1: الضمائر (3 أسئلة)
  {
    id: 'q1', type: 'mcq', category: 'pronouns',
    questionDe: '___ heiße Karl.', questionAr: 'اختر الضمير: "أنا اسمي كارل"',
    options: ['Ich', 'Du', 'Er', 'Wir'], correctAnswer: 'Ich',
    explanation: 'Ich = أنا (المتكلم المفرد)',
    emoji: '👤', color: '#9D4EDD', gradient: ['#9D4EDD', '#5A189A'],
  },
  {
    id: 'q2', type: 'write', category: 'pronouns',
    questionDe: 'Wir', questionAr: 'اكتب ضمير "نحن" بالألمانية',
    expectedWord: 'Wir',
    explanation: 'Wir = نحن (جمع المتكلم)',
    emoji: '👨‍👩‍👧‍👦', color: '#06D6A0', gradient: ['#06D6A0', '#02C39A'],
  },
  {
    id: 'q3', type: 'mcq', category: 'pronouns',
    questionDe: '___ ist mein Vater.', questionAr: 'اختر الضمير: "هو والدي"',
    options: ['Sie', 'Er', 'Es', 'Wir'], correctAnswer: 'Er',
    explanation: 'Er = هو (للمذكر)',
    emoji: '👨', color: '#3B82F6', gradient: ['#3B82F6', '#1E3A8A'],
  },

  // 🟢 قسم 2: الأفعال (3 أسئلة)
  {
    id: 'q4', type: 'speak', category: 'verbs',
    questionDe: 'spielen', questionAr: 'انطق فعل "يلعب" بوضوح',
    expectedWord: 'spielen',
    explanation: 'spielen = يلعب',
    emoji: '⚽', color: '#58CC02', gradient: ['#58CC02', '#4AA802'],
  },
  {
    id: 'q5', type: 'mcq', category: 'verbs',
    questionDe: 'Du ___ Wasser.', questionAr: 'اختر تصريف "يشرب"',
    options: ['trinke', 'trinkst', 'trinkt', 'trinken'], correctAnswer: 'trinkst',
    explanation: 'مع Du: trink + st = trinkst',
    emoji: '💧', color: '#4CC9F0', gradient: ['#4CC9F0', '#028090'],
  },
  {
    id: 'q6', type: 'write', category: 'verbs',
    questionDe: 'essen', questionAr: 'اكتب فعل "يأكل" بالألمانية',
    expectedWord: 'essen',
    explanation: 'essen = يأكل',
    emoji: '🍽️', color: '#F77F00', gradient: ['#F77F00', '#D62828'],
  },

  // 🔵 قسم 3: كلمات السؤال (3 أسئلة)
  {
    id: 'q7', type: 'mcq', category: 'questions',
    questionDe: '___ heißt du?', questionAr: 'اختر كلمة السؤال: "ما اسمك؟"',
    options: ['Wer', 'Wie', 'Was', 'Wo'], correctAnswer: 'Wie',
    explanation: 'Wie heißt du? = ما اسمك؟',
    emoji: '❓', color: '#0EA5E9', gradient: ['#0EA5E9', '#075985'],
  },
  {
    id: 'q8', type: 'write', category: 'questions',
    questionDe: 'Wo', questionAr: 'اكتب كلمة "أين" بالألمانية',
    expectedWord: 'Wo',
    explanation: 'Wo = أين',
    emoji: '📍', color: '#EF4444', gradient: ['#EF4444', '#991B1B'],
  },
  {
    id: 'q9', type: 'mcq', category: 'questions',
    questionDe: '___ kommst du? — Um 8 Uhr.', questionAr: 'اختر كلمة السؤال: "متى تأتي؟"',
    options: ['Wo', 'Wann', 'Wie', 'Warum'], correctAnswer: 'Wann',
    explanation: 'Wann = متى',
    emoji: '⏰', color: '#8B5CF6', gradient: ['#8B5CF6', '#4C1D95'],
  },

  // 🟡 قسم 4: المحادثة (3 أسئلة)
  {
    id: 'q10', type: 'speak', category: 'conversation',
    questionDe: 'Guten Morgen', questionAr: 'انطق "صباح الخير" بوضوح',
    expectedWord: 'Guten Morgen',
    explanation: 'Guten Morgen = صباح الخير',
    emoji: '🌅', color: '#FFD700', gradient: ['#FFD700', '#FF8C00'],
  },
  {
    id: 'q11', type: 'match', category: 'conversation',
    questionDe: 'طابق التحيات مع رموزها',
    questionAr: 'اسحب كل كلمة إلى الرمز المناسب',
    matchPairs: [
      { id: 'm1', de: 'Hallo', ar: 'مرحباً', emoji: '👋', color: '#4CC9F0' },
      { id: 'm2', de: 'Danke', ar: 'شكراً', emoji: '🙏', color: '#06D6A0' },
      { id: 'm3', de: 'Tschüss', ar: 'وداعاً', emoji: '🚶‍♂️', color: '#EF4444' },
      { id: 'm4', de: 'Bitte', ar: 'من فضلك', emoji: '🤲', color: '#F72585' },
    ],
    explanation: 'أحسنت في مطابقة التحيات!',
    emoji: '💬', color: '#EC4899', gradient: ['#EC4899', '#BE185D'],
  },
  {
    id: 'q12', type: 'mcq', category: 'conversation',
    questionDe: 'كيف تسأل عن حال شخص؟', questionAr: 'اختر السؤال الصحيح',
    options: ['Wie heißt du?', 'Wie geht es dir?', 'Wo wohnst du?', 'Was ist das?'],
    correctAnswer: 'Wie geht es dir?',
    explanation: 'Wie geht es dir? = كيف حالك؟',
    emoji: '🤝', color: '#A78BFA', gradient: ['#A78BFA', '#5B21B6'],
  },

  // 🔴 قسم 5: الأعياد (3 أسئلة)
  {
    id: 'q13', type: 'mcq', category: 'holidays',
    questionDe: 'ما اسم عيد الميلاد المسيحي؟', questionAr: 'اختر الإجابة الصحيحة',
    options: ['Ostern', 'Weihnachten', 'Silvester', 'Karneval'], correctAnswer: 'Weihnachten',
    explanation: 'Weihnachten = عيد الميلاد المجيد',
    emoji: '🎄', color: '#DC2626', gradient: ['#DC2626', '#7F1D1D'],
  },
  {
    id: 'q14', type: 'write', category: 'holidays',
    questionDe: 'Geschenk', questionAr: 'اكتب كلمة "هدية" بالألمانية',
    expectedWord: 'Geschenk',
    explanation: 'Geschenk = الهدية',
    emoji: '🎁', color: '#F77F00', gradient: ['#F77F00', '#D62828'],
  },
  {
    id: 'q15', type: 'mcq', category: 'holidays',
    questionDe: 'أشهر مهرجان في ميونخ اسمه...', questionAr: 'اختر الإجابة الصحيحة',
    options: ['Karneval', 'Oktoberfest', 'Weihnachten', 'Ostern'], correctAnswer: 'Oktoberfest',
    explanation: 'Oktoberfest = مهرجان أكتوبر (يقام في ميونخ)',
    emoji: '🍺', color: '#F59E0B', gradient: ['#F59E0B', '#78350F'],
  },
];

export const TEST_SECTIONS = [
  { id: 'section-1', title: 'الضمائر الشخصية', titleDe: 'Personalpronomen', icon: '👤', color: '#9D4EDD', questionsCount: 3 },
  { id: 'section-2', title: 'تصريف الأفعال', titleDe: 'Verben', icon: '🎯', color: '#58CC02', questionsCount: 3 },
  { id: 'section-3', title: 'كلمات السؤال', titleDe: 'Fragewörter', icon: '❓', color: '#0EA5E9', questionsCount: 3 },
  { id: 'section-4', title: 'المحادثة اليومية', titleDe: 'Konversation', icon: '💬', color: '#FFD700', questionsCount: 3 },
  { id: 'section-5', title: 'الأعياد والمناسبات', titleDe: 'Feiertage', icon: '🎉', color: '#EF4444', questionsCount: 3 },
];

export const TOTAL_QUESTIONS = A1_TEST_QUESTIONS.length;
export const PASS_SCORE = 10; // 10 من 15 (66%) للنجاح
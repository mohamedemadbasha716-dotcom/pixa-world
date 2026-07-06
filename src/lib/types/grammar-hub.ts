// src/lib/types/grammar-hub.ts

// ═══════════════════════════════════════
// 🎓 أنواع البيانات لـ Grammar Hub
// ═══════════════════════════════════════
// Component موحد لكل دروس الجرامر في كل الخرايط
// متوافق مع CEFR (A1.1 → A2.2)
// ═══════════════════════════════════════

// 🎯 خطوات Grammar Hub الـ 6
export type GrammarStep = 
  | 'concept'    // 1. شرح القاعدة بصرياً
  | 'pattern'    // 2. عرض النمط (X + Y + Z)
  | 'build'      // 3. كوّن الجملة (Tap to Select)
  | 'listen'     // 4. اسمع الجملة كاملة
  | 'write'      // 5. اكتب الجملة كاملة
  | 'speak';     // 6. انطق الجملة كاملة

// 🧱 قطعة من النمط (مثل: Tengo + número + parte)
export interface PatternBlock {
  label: string;        // "Tengo"
  labelAr: string;      // "عندي"
  type: 'verb' | 'number' | 'noun' | 'adjective' | 'pronoun' | 'article';
  color: string;        // #DC2626
  example?: string;     // "Tengo"
  exampleAr?: string;   // "عندي"
}

// 📝 جملة كاملة للتدريب
export interface GrammarSentence {
  fullEs: string;              // "Tengo dos ojos"
  fullAr: string;              // "عندي عينين"
  words: string[];             // ["Tengo", "dos", "ojos"]
  wordsAr: string[];           // ["عندي", "اتنين", "عيون"]
  distractors: string[];       // كلمات مشتتة للـ Tap to Select: ["perro", "tres", "casa"]
  emoji?: string;              // 👀
  imageHint?: string;          // اسم الصورة لو فيه
}

// 🎓 Grammar Hub كامل
export interface GrammarHub {
  hubId: number;                    // 0, 1, 2
  hubNumber: number;                // 1, 2, 3 (للعرض)
  
  // العنوان
  titleEs: string;                  // "Tengo + número + parte"
  titleAr: string;                  // "عندي + عدد + جزء"
  
  // الـ Concept (الخطوة 1)
  conceptTitle: string;             // "تعلم: Tengo"
  conceptTitleEs: string;           // "Aprende: Tengo"
  conceptExplanation: string;       // "Tengo معناها 'أنا عندي'..."
  conceptVisual: {
    icon: string;                   // 👤
    formula: string;                // "Yo + Tengo"
    formulaAr: string;              // "أنا + عندي"
  };
  
  // الـ Pattern (الخطوة 2)
  patternBlocks: PatternBlock[];    // [Tengo, número, parte]
  patternExample: GrammarSentence;  // مثال تطبيقي للنمط
  
  // الـ Sentences للتدريب (الخطوات 3-6)
  sentences: GrammarSentence[];     // 3 جمل للتدريب
  
  // التصميم
  color: string;
  gradient: [string, string];
  icon: string;                     // 🆕 أو 🎓 أو 📚
}

// 🏆 ثوابت
export const GRAMMAR_HUB_STEPS: GrammarStep[] = [
  'concept',
  'pattern',
  'build',
  'listen',
  'write',
  'speak',
];

export const TOTAL_GRAMMAR_STEPS = GRAMMAR_HUB_STEPS.length; // 6

// 🎨 ألوان الـ Pattern Blocks حسب النوع
export const PATTERN_BLOCK_COLORS: Record<PatternBlock['type'], string> = {
  verb: '#DC2626',       // أحمر (الفعل)
  number: '#F59E0B',     // برتقالي (الأرقام)
  noun: '#3B82F6',       // أزرق (الاسم)
  adjective: '#10B981',  // أخضر (الصفة)
  pronoun: '#A855F7',    // بنفسجي (الضمير)
  article: '#EC4899',    // وردي (أداة التعريف)
};

// 🎨 ألوان الـ Pattern Blocks بالعربي (للعرض)
export const PATTERN_BLOCK_LABELS_AR: Record<PatternBlock['type'], string> = {
  verb: 'فعل',
  number: 'عدد',
  noun: 'اسم',
  adjective: 'صفة',
  pronoun: 'ضمير',
  article: 'أداة',
};
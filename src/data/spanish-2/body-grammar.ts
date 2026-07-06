// src/data/spanish-2/body-grammar.ts

// ═══════════════════════════════════════
// 🎓 Grammar Hubs لدرس أجزاء الجسم
// ═══════════════════════════════════════
// الدرس: es-segovia-body
// المستوى: A1.1 | السن: 7-8 سنوات
// 3 Grammar Hubs (واحد بعد كل مجموعة من 5 أجزاء)
// 
// 📚 المنهج الأكاديمي:
// Hub 1: Tengo + número + parte         → "Tengo dos ojos"
// Hub 2: Tengo + parte + adjetivo       → "Tengo manos pequeñas"  
// Hub 3: Soy + Tengo (وصف كامل)         → "Soy niño. Tengo dos piernas"
// ═══════════════════════════════════════

import type { GrammarHub } from '@/lib/types/grammar-hub';

export const BODY_GRAMMAR_HUBS: GrammarHub[] = [
  // ═══════════════════════════════════════
  // 🎓 Hub #1: Tengo + número + parte
  // (بعد المجموعة 1: الرأس والوجه)
  // ═══════════════════════════════════════
  {
    hubId: 0,
    hubNumber: 1,
    
    titleEs: 'Tengo + número + parte',
    titleAr: 'عندي + عدد + جزء',
    
    // ─── Concept ───
    conceptTitle: 'تعلم كلمة جديدة: Tengo',
    conceptTitleEs: 'Aprende: Tengo',
    conceptExplanation: 'كلمة "Tengo" بالإسباني معناها "أنا عندي". لما عايز تقول عندك حاجة في جسمك، تستخدم "Tengo" وبعدها العدد ثم اسم الجزء.',
    conceptVisual: {
      icon: '👤',
      formula: 'Yo → Tengo',
      formulaAr: 'أنا → عندي',
    },
    
    // ─── Pattern ───
    patternBlocks: [
      {
        label: 'Tengo',
        labelAr: 'عندي',
        type: 'verb',
        color: '#DC2626',
        example: 'Tengo',
        exampleAr: 'عندي',
      },
      {
        label: 'número',
        labelAr: 'عدد',
        type: 'number',
        color: '#F59E0B',
        example: 'dos',
        exampleAr: 'اتنين',
      },
      {
        label: 'parte',
        labelAr: 'جزء',
        type: 'noun',
        color: '#3B82F6',
        example: 'ojos',
        exampleAr: 'عيون',
      },
    ],
    
    patternExample: {
      fullEs: 'Tengo dos ojos',
      fullAr: 'عندي عينين',
      words: ['Tengo', 'dos', 'ojos'],
      wordsAr: ['عندي', 'اتنين', 'عيون'],
      distractors: ['perro', 'tres', 'casa'],
      emoji: '👀',
    },
    
    // ─── 3 جمل للتدريب ───
    sentences: [
      {
        fullEs: 'Tengo dos ojos',
        fullAr: 'عندي عينين',
        words: ['Tengo', 'dos', 'ojos'],
        wordsAr: ['عندي', 'اتنين', 'عيون'],
        distractors: ['perro', 'tres', 'casa'],
        emoji: '👀',
      },
      {
        fullEs: 'Tengo una boca',
        fullAr: 'عندي فم',
        words: ['Tengo', 'una', 'boca'],
        wordsAr: ['عندي', 'واحد', 'فم'],
        distractors: ['dos', 'gato', 'mesa'],
        emoji: '👄',
      },
      {
        fullEs: 'Tengo dos orejas',
        fullAr: 'عندي أذنين',
        words: ['Tengo', 'dos', 'orejas'],
        wordsAr: ['عندي', 'اتنين', 'أذنين'],
        distractors: ['tres', 'libro', 'sol'],
        emoji: '👂',
      },
    ],
    
    color: '#DC2626',
    gradient: ['#EF4444', '#991B1B'],
    icon: '🆕',
  },
  
  // ═══════════════════════════════════════
  // 🎓 Hub #2: Tengo + parte + adjetivo
  // (بعد المجموعة 2: الجذع والذراعين)
  // ═══════════════════════════════════════
  {
    hubId: 1,
    hubNumber: 2,
    
    titleEs: 'Tengo + parte + adjetivo',
    titleAr: 'عندي + جزء + صفة',
    
    // ─── Concept ───
    conceptTitle: 'تعلم: وصف أجزاء الجسم بالصفات',
    conceptTitleEs: 'Aprende: Describir partes del cuerpo',
    conceptExplanation: 'دلوقتي هنتعلم نوصف أجزاء جسمنا بصفات بسيطة. زي كبير (grande)، صغير (pequeño)، قوي (fuerte). الصفة بتيجي بعد الاسم في الإسباني.',
    conceptVisual: {
      icon: '💪',
      formula: 'Tengo + parte + adjetivo',
      formulaAr: 'عندي + جزء + صفة',
    },
    
    // ─── Pattern ───
    patternBlocks: [
      {
        label: 'Tengo',
        labelAr: 'عندي',
        type: 'verb',
        color: '#DC2626',
        example: 'Tengo',
        exampleAr: 'عندي',
      },
      {
        label: 'parte',
        labelAr: 'جزء',
        type: 'noun',
        color: '#3B82F6',
        example: 'manos',
        exampleAr: 'يدين',
      },
      {
        label: 'adjetivo',
        labelAr: 'صفة',
        type: 'adjective',
        color: '#10B981',
        example: 'pequeñas',
        exampleAr: 'صغيرة',
      },
    ],
    
    patternExample: {
      fullEs: 'Tengo manos pequeñas',
      fullAr: 'عندي يدين صغيرة',
      words: ['Tengo', 'manos', 'pequeñas'],
      wordsAr: ['عندي', 'يدين', 'صغيرة'],
      distractors: ['perro', 'casa', 'sol'],
      emoji: '🙌',
    },
    
    // ─── 3 جمل للتدريب ───
    sentences: [
      {
        fullEs: 'Tengo manos pequeñas',
        fullAr: 'عندي يدين صغيرة',
        words: ['Tengo', 'manos', 'pequeñas'],
        wordsAr: ['عندي', 'يدين', 'صغيرة'],
        distractors: ['gato', 'libro', 'grandes'],
        emoji: '🙌',
      },
      {
        fullEs: 'Tengo brazos fuertes',
        fullAr: 'عندي ذراعين قوية',
        words: ['Tengo', 'brazos', 'fuertes'],
        wordsAr: ['عندي', 'ذراعين', 'قوية'],
        distractors: ['mesa', 'pequeños', 'casa'],
        emoji: '🦾',
      },
      {
        fullEs: 'Tengo dedos largos',
        fullAr: 'عندي أصابع طويلة',
        words: ['Tengo', 'dedos', 'largos'],
        wordsAr: ['عندي', 'أصابع', 'طويلة'],
        distractors: ['sol', 'cortos', 'perro'],
        emoji: '✋',
      },
    ],
    
    color: '#10B981',
    gradient: ['#34D399', '#047857'],
    icon: '🎓',
  },
  
  // ═══════════════════════════════════════
  // 🎓 Hub #3: Soy + Tengo (وصف كامل)
  // (بعد المجموعة 3: الأطراف السفلية)
  // ═══════════════════════════════════════
  {
    hubId: 2,
    hubNumber: 3,
    
    titleEs: 'Soy + Tengo (descripción completa)',
    titleAr: 'أنا + عندي (وصف كامل)',
    
    // ─── Concept ───
    conceptTitle: 'تعلم: وصف نفسك بالكامل',
    conceptTitleEs: 'Aprende: Describirte completamente',
    conceptExplanation: 'دلوقتي هنجمع كل اللي اتعلمناه! "Soy" معناها "أنا" + (ولد/بنت)، و "Tengo" معناها "عندي". نقدر نوصف نفسنا كاملاً!',
    conceptVisual: {
      icon: '🧍',
      formula: 'Soy + Tengo',
      formulaAr: 'أنا + عندي',
    },
    
    // ─── Pattern ───
    patternBlocks: [
      {
        label: 'Soy',
        labelAr: 'أنا',
        type: 'verb',
        color: '#A855F7',
        example: 'Soy',
        exampleAr: 'أنا',
      },
      {
        label: 'niño/niña',
        labelAr: 'ولد/بنت',
        type: 'noun',
        color: '#EC4899',
        example: 'niño',
        exampleAr: 'ولد',
      },
      {
        label: 'Tengo',
        labelAr: 'عندي',
        type: 'verb',
        color: '#DC2626',
        example: 'Tengo',
        exampleAr: 'عندي',
      },
      {
        label: 'parte',
        labelAr: 'جزء',
        type: 'noun',
        color: '#3B82F6',
        example: 'piernas',
        exampleAr: 'ساقين',
      },
    ],
    
    patternExample: {
      fullEs: 'Soy niño Tengo dos piernas',
      fullAr: 'أنا ولد عندي ساقين',
      words: ['Soy', 'niño', 'Tengo', 'dos', 'piernas'],
      wordsAr: ['أنا', 'ولد', 'عندي', 'اتنين', 'ساقين'],
      distractors: ['perro', 'casa', 'sol'],
      emoji: '🧒',
    },
    
    // ─── 3 جمل للتدريب ───
    sentences: [
      {
        fullEs: 'Soy niño Tengo dos pies',
        fullAr: 'أنا ولد عندي قدمين',
        words: ['Soy', 'niño', 'Tengo', 'dos', 'pies'],
        wordsAr: ['أنا', 'ولد', 'عندي', 'اتنين', 'قدمين'],
        distractors: ['gato', 'tres', 'mesa'],
        emoji: '🦶',
      },
      {
        fullEs: 'Soy niña Tengo dos rodillas',
        fullAr: 'أنا بنت عندي ركبتين',
        words: ['Soy', 'niña', 'Tengo', 'dos', 'rodillas'],
        wordsAr: ['أنا', 'بنت', 'عندي', 'اتنين', 'ركبتين'],
        distractors: ['libro', 'una', 'sol'],
        emoji: '🦴',
      },
      {
        fullEs: 'Tengo un cuerpo fuerte',
        fullAr: 'عندي جسم قوي',
        words: ['Tengo', 'un', 'cuerpo', 'fuerte'],
        wordsAr: ['عندي', 'واحد', 'جسم', 'قوي'],
        distractors: ['dos', 'casa', 'débil'],
        emoji: '🧍',
      },
    ],
    
    color: '#A855F7',
    gradient: ['#C084FC', '#7E22CE'],
    icon: '📚',
  },
];

// ═══════════════════════════════════════
// 🔧 Helpers
// ═══════════════════════════════════════

/**
 * جلب Grammar Hub معين بالـ ID
 */
export function getBodyGrammarHub(hubId: number) {
  return BODY_GRAMMAR_HUBS.find(h => h.hubId === hubId);
}

/**
 * عدد الـ Grammar Hubs الإجمالي
 */
export const TOTAL_BODY_GRAMMAR_HUBS = BODY_GRAMMAR_HUBS.length; // 3

/**
 * عدد الجمل في كل Hub
 */
export const SENTENCES_PER_HUB = 3;
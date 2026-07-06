// ═══════════════════════════════════════
// 🐂 أنواع البيانات للماسكوت Toro the Bull
// ═══════════════════════════════════════

export type ToroMood = 'idle' | 'happy' | 'sad' | 'celebrate';

export type ToroMessage = {
  es: string;  // الأسبانية
  ar: string;  // العربية
};

// ═══════════════════════════════════════
// 🎉 رسائل التشجيع (Encouragements)
// ═══════════════════════════════════════
export const SPANISH_ENCOURAGEMENTS: ToroMessage[] = [
  { es: '¡Muy bien!', ar: 'ممتاز!' },
  { es: '¡Olé!', ar: 'برافو!' },
  { es: '¡Fantástico!', ar: 'خيالي!' },
  { es: '¡Perfecto!', ar: 'مثالي!' },
  { es: '¡Genial!', ar: 'عبقري!' },
  { es: '¡Excelente!', ar: 'تحفة!' },
  { es: '¡Increíble!', ar: 'لا يصدق!' },
  { es: '¡Bravo!', ar: 'برافو!' },
  { es: '¡Eres un campeón!', ar: 'أنت بطل!' },
  { es: '¡Maravilloso!', ar: 'رائع!' },
];

// ═══════════════════════════════════════
// 😔 رسائل التشجيع عند الخطأ (Sad Messages)
// ═══════════════════════════════════════
export const SPANISH_SAD_MESSAGES: ToroMessage[] = [
  { es: '¡Inténtalo otra vez!', ar: 'جرب تاني!' },
  { es: '¡Tú puedes!', ar: 'تقدر تعملها!' },
  { es: '¡No te preocupes!', ar: 'متقلقش!' },
  { es: '¡Sigue intentando!', ar: 'كمل محاولة!' },
  { es: '¡Casi lo logras!', ar: 'قربت توصلها!' },
];

// ═══════════════════════════════════════
// 🎊 رسائل الاحتفال (Celebration Messages)
// ═══════════════════════════════════════
export const SPANISH_CELEBRATIONS: ToroMessage[] = [
  { es: '¡Lo lograste!', ar: 'نجحت!' },
  { es: '¡Eres asombroso!', ar: 'أنت مذهل!' },
  { es: '¡Qué crack!', ar: 'يا عبقري!' },
  { es: '¡Felicidades!', ar: 'مبروك!' },
];

// ═══════════════════════════════════════
// 🎲 Helpers
// ═══════════════════════════════════════
export function getRandomSpanishEncouragement(): ToroMessage {
  return SPANISH_ENCOURAGEMENTS[Math.floor(Math.random() * SPANISH_ENCOURAGEMENTS.length)];
}

export function getRandomSpanishSadMessage(): ToroMessage {
  return SPANISH_SAD_MESSAGES[Math.floor(Math.random() * SPANISH_SAD_MESSAGES.length)];
}

export function getRandomSpanishCelebration(): ToroMessage {
  return SPANISH_CELEBRATIONS[Math.floor(Math.random() * SPANISH_CELEBRATIONS.length)];
}
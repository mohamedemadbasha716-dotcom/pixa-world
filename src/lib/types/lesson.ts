export type KarlMood = 'idle' | 'happy' | 'sad' | 'celebrate';

export type KarlMessage = {
  de: string;
  ar: string;
};

export const ENCOURAGEMENTS: KarlMessage[] = [
  { de: 'Super!', ar: 'ممتاز!' },
  { de: 'Toll!', ar: 'رائع!' },
  { de: 'Wunderbar!', ar: 'مدهش!' },
  { de: 'Klasse!', ar: 'تحفة!' },
  { de: 'Bravo!', ar: 'برافو!' },
  { de: 'Sehr gut!', ar: 'ممتاز جداً!' },
  { de: 'Genial!', ar: 'عبقري!' },
  { de: 'Fantastisch!', ar: 'خيالي!' },
  { de: 'Perfekt!', ar: 'مثالي!' },
];

export const SAD_MESSAGES: KarlMessage[] = [
  { de: 'Versuch nochmal!', ar: 'جرب تاني!' },
  { de: 'Du schaffst das!', ar: 'تقدر تعملها!' },
  { de: 'Keine Sorge!', ar: 'متقلقش!' },
];

export function getRandomEncouragement(): KarlMessage {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

export function getRandomSadMessage(): KarlMessage {
  return SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)];
}
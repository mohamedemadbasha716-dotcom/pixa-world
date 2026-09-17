// src/lib/englishPlayerData.ts

export const TOTAL_ENGLISH_MAPS = 5;

// المعالم لكل خريطة إنجليزية
export const ENGLISH_MAP_1_LESSONS = [
  'big-ben', 'london-eye', 'london-bridge', 'buckingham-palace', 'hyde-park', 'london-zoo'
];
export const ENGLISH_MAP_2_LESSONS = [
  'oxford-school', 'leo-cozy-home', 'toy-shop', 'borough-market', 'greenwich-clock', 'royal-castle'
];
export const ENGLISH_MAP_3_LESSONS = [
  'animal-kingdom', 'body-parts', 'feelings-cave', 'weather-mountain', 'seasons-forest', 'robin-hood-test'
];
export const ENGLISH_MAP_4_LESSONS = [
  'oxford-street', 'red-bus', 'harrods-shopping', 'weekly-calendar', 'action-park', 'thames-test'
];
export const ENGLISH_MAP_5_LESSONS = [
  'jobs-tower', 'world-map', 'question-palace', 'conversation-hall', 'present-continuous', 'a1-certificate'
];

export const ENGLISH_LESSON_ORDER = [
  ...ENGLISH_MAP_1_LESSONS,
  ...ENGLISH_MAP_2_LESSONS,
  ...ENGLISH_MAP_3_LESSONS,
  ...ENGLISH_MAP_4_LESSONS,
  ...ENGLISH_MAP_5_LESSONS,
];

export type EnglishLessonProgress = {
  lesson_id: string;
  completed: boolean;
  stars: number;
  score: number;
};

// دوال وهمية مؤقتة (Mock Functions) عشان نشغل الصفحة لحد ما نربطها بـ Supabase
export async function getEnglishPlayer() {
  if (typeof window !== 'undefined') {
    const name = localStorage.getItem('englishHeroName');
    const type = localStorage.getItem('englishHeroType');
    if (name && type) return { hero_name: name, hero_type: type };
  }
  return null;
}

export async function saveEnglishPlayer(name: string, type: string) {
  localStorage.setItem('englishHeroName', name);
  localStorage.setItem('englishHeroType', type);
  return { hero_name: name, hero_type: type };
}

export async function getAllEnglishProgress(): Promise<EnglishLessonProgress[]> {
  // حالياً هنرجع تقدم فاضي لحد ما تربط الداتابيز
  return [];
}

export async function isEnglishMapCompleted(mapNumber: number) {
  return false;
}

export async function getUserPlanStatus() {
  return { isPremium: true, isSuperAdmin: true, isLoggedIn: true }; // كله مفتوح للتجربة
}
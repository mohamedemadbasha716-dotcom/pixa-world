// src/data/german/final-test.ts

// 🎯 تجميع كل كلمات الخريطة 2 للاختبار النهائي

import { SCHOOL_ITEMS } from './school';
import { HOUSE_ITEMS } from './house';
import { TOYS_ITEMS_ALL } from './toys';
import { FOOD_ITEMS_ALL } from './food';
import { TIME_ITEMS_ALL } from './time';

export interface FinalTestItem {
  id: string;
  de: string;
  ar: string;
  emoji: string;
  color: string;
  gradient: [string, string];
  article?: string;
  sourceLesson: string;
}

// ═══════════════════════════════════════
// 📦 تجميع كل الكلمات من 5 دروس
// ═══════════════════════════════════════
function tagWithSource(items: any[], source: string): FinalTestItem[] {
  return items.map(item => ({
    id: item.id,
    de: item.de,
    ar: item.ar,
    emoji: item.emoji,
    color: item.color,
    gradient: item.gradient,
    article: item.article,
    sourceLesson: source,
  }));
}

export const ALL_MAP2_WORDS: FinalTestItem[] = [
  ...tagWithSource(SCHOOL_ITEMS, 'school'),
  ...tagWithSource(HOUSE_ITEMS, 'house'),
  ...tagWithSource(TOYS_ITEMS_ALL, 'toys'),
  ...tagWithSource(FOOD_ITEMS_ALL, 'food'),
  ...tagWithSource(TIME_ITEMS_ALL, 'time'),
];

export const TOTAL_WORDS_MAP2 = ALL_MAP2_WORDS.length;

// ═══════════════════════════════════════
// 🎲 دوال مساعدة
// ═══════════════════════════════════════

// اختيار N كلمة عشوائية
export function getRandomWords(count: number): FinalTestItem[] {
  const shuffled = [...ALL_MAP2_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// اختيار 3 خيارات (1 صح + 2 غلط)
export function getRandomChoices(correctWord: FinalTestItem, count: number = 3): FinalTestItem[] {
  const others = ALL_MAP2_WORDS.filter(w => w.id !== correctWord.id);
  const shuffled = others.sort(() => Math.random() - 0.5);
  const wrong = shuffled.slice(0, count - 1);
  return [...wrong, correctWord].sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════
// 🏆 معلومات الاختبار النهائي
// ═══════════════════════════════════════
export const FINAL_TEST_INFO = {
  lessonId: 'adventurer-castle',
  title: 'قلعة المغامر',
  titleDe: 'Burg des Abenteurers',
  emoji: '🏰',
  totalQuestions: {
    listen: 10,
    write: 10,
    match: 12,
  },
  passingScore: {
    listen: 7,
    write: 7,
    match: 12,
  },
  certificate: {
    title: 'PIXA WORLD',
    subtitle: 'شهادة إتمام المستوى الثاني',
    subtitleDe: 'Zertifikat A1 - Stufe 2',
    level: 'A1 — Level 2',
    skills: [
      'المدرسة والأدوات',
      'البيت والعائلة الموسعة',
      'الألعاب والهوايات',
      'الأكل والشرب والتسوق',
      'الوقت والأرقام الكبيرة',
    ],
  },
};
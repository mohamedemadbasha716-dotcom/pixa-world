'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Star, ChevronRight, X, Trophy, Map as MapIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  savePlayer, 
  getPlayer, 
  getAllProgress, 
  getCurrentMap,
  isMapCompleted,
  isMapUnlocked,
  getMapStars,
  MAP_1_LESSONS,
  MAP_2_LESSONS,
  MAP_3_LESSONS,
  LESSON_ORDER,
  TOTAL_MAPS,
  type LessonProgress 
} from '@/lib/playerData';

// ═══════════════════════════════════════
// 🎨 بيانات الخريطة 1 (الأساسيات)
// ═══════════════════════════════════════
const LANDMARKS_MAP_1 = [
  {
    id: 'hamburg',
    nameAr: 'ميناء هامبورغ',
    nameDe: 'Hamburger Hafen',
    emoji: '⚓',
    lesson: 1,
    description: 'أكبر ميناء في ألمانيا! هنا هتتعلم الحروف الألمانية.',
    color: '#4CC9F0',
    route: '/german-letter-lesson',
  },
  {
    id: 'cologne',
    nameAr: 'كاتدرائية كولونيا',
    nameDe: 'Kölner Dom',
    emoji: '⛪',
    lesson: 2,
    description: 'أشهر كنيسة في ألمانيا! هنا هتتعلم الأرقام.',
    color: '#F72585',
    route: '/german-number-lesson',
  },
  {
    id: 'center',
    nameAr: 'قرية الغابة',
    nameDe: 'Walddorf',
    emoji: '🏠',
    lesson: 3,
    description: 'قرية سحرية في قلب ألمانيا! هنا هتتعلم الألوان والفواكه والخضروات والحيوانات.',
    color: '#7209B7',
    route: '/german-forest',
  },
  {
    id: 'berlin',
    nameAr: 'بوابة براندنبورغ',
    nameDe: 'Brandenburger Tor',
    emoji: '🏛️',
    lesson: 4,
    description: 'قلب برلين وعاصمة ألمانيا! هنا هتتعلم التحيات والتعارف والعائلة.',
    color: '#FFD700',
    route: '/german-family',
  },
  {
    id: 'lake',
    nameAr: 'بحيرة الملوك',
    nameDe: 'Königssee',
    emoji: '🏞️',
    lesson: 5,
    description: 'أجمل بحيرة في ألمانيا بين جبال الألب! هنا هتتعلم الطقس وأيام الأسبوع والطبيعة.',
    color: '#06D6A0',
    route: '/german-lake-lesson',
  },
  {
    id: 'neuschwanstein',
    nameAr: 'قلعة نويشفانشتاين',
    nameDe: 'Schloss Neuschwanstein',
    emoji: '🏰',
    lesson: 6,
    description: 'أجمل قلعة في العالم! هنا هتتعلم الجمل الكاملة.',
    color: '#58CC02',
    route: '/german-castle-lesson',
  },
];

// ═══════════════════════════════════════
// 🎨 بيانات الخريطة 2 (الحياة اليومية)
// ═══════════════════════════════════════
const LANDMARKS_MAP_2 = [
  {
    id: 'heidelberg-school',
    nameAr: 'مدرسة هايدلبرغ',
    nameDe: 'Heidelberger Schule',
    emoji: '🏫',
    lesson: 1,
    description: 'مدرسة قديمة وعريقة! هنا هتتعلم كلمات المدرسة والأدوات.',
    color: '#4CC9F0',
    route: '/german-school',
  },
  {
    id: 'karl-house',
    nameAr: 'منزل كارل',
    nameDe: 'Karls Haus',
    emoji: '🏡',
    lesson: 2,
    description: 'بيت كارل النسر الجميل! هنا هتتعلم البيت والغرف والعيلة الموسعة.',
    color: '#F72585',
    route: '/german-house',
  },
  {
    id: 'toys-island',
    nameAr: 'جزيرة الألعاب',
    nameDe: 'Spielzeuginsel',
    emoji: '🧸',
    lesson: 3,
    description: 'جزيرة سحرية مليانة ألعاب! هنا هتتعلم الألعاب والهوايات والرياضة.',
    color: '#7209B7',
    route: '/german-toys',
  },
  {
    id: 'munich-market',
    nameAr: 'سوق ميونخ',
    nameDe: 'Münchner Markt',
    emoji: '🍎',
    lesson: 4,
    description: 'سوق ميونخ الشهير! هنا هتتعلم الأكل والشرب والتسوق.',
    color: '#FFD700',
    route: '/german-food',
  },
  {
    id: 'clock-tower',
    nameAr: 'برج الساعة',
    nameDe: 'Uhrturm',
    emoji: '🕰️',
    lesson: 5,
    description: 'برج ساعة ضخم بتروس ذهبية! هنا هتتعلم الوقت والساعة والأرقام الكبيرة.',
    color: '#06D6A0',
    route: '/german-time',
  },
  {
    id: 'adventurer-castle',
    nameAr: 'قلعة المغامر الصغير',
    nameDe: 'Abenteurerschloss',
    emoji: '🏰',
    lesson: 6,
    description: 'قلعة المغامرين الأخيرة! هنا هتعمل اختبار نهائي وتاخد شهادة الإنجاز.',
    color: '#58CC02',
    route: '/german-final-test',
  },
];

// ═══════════════════════════════════════
// 🎨 بيانات الخريطة 3 (فرانكفورت)
// ═══════════════════════════════════════
const LANDMARKS_MAP_3 = [
  {
    id: 'zeil-street',
    nameAr: 'شارع زيل',
    nameDe: 'Die Zeil',
    emoji: '👕',
    lesson: 1,
    description: 'أشهر شارع تسوق في فرانكفورت! هنا هتتعلم الملابس بكل أنواعها.',
    color: '#FF6B6B',
    route: '/german-frankfurt-lesson',
  },
  {
    id: 'senckenberg-museum',
    nameAr: 'متحف زنكنبرغ',
    nameDe: 'Senckenberg Museum',
    emoji: '🦴',
    lesson: 2,
    description: 'متحف الديناصورات الشهير! هنا هتتعلم أجزاء الجسم.',
    color: '#85C1E2',
    route: '/german-body-lesson',
  },
  {
    id: 'charite-hospital',
    nameAr: 'مستشفى شاريتيه',
    nameDe: 'Charité Krankenhaus',
    emoji: '🏥',
    lesson: 3,
    description: 'أكبر مستشفى في أوروبا! هنا هتتعلم الصحة والطبيب.',
    color: '#52BE80',
    route: '/german-health-lesson',
  },
  {
    id: 'allianz-arena',
    nameAr: 'أليانز أرينا',
    nameDe: 'Allianz Arena',
    emoji: '⚽',
    lesson: 4,
    description: 'أشهر ملعب كرة قدم في ألمانيا! هنا هتتعلم الرياضة.',
    color: '#F72585',
    route: '/german-sports-lesson',
  },
  {
    id: 'palmengarten',
    nameAr: 'حدائق بالمنغارتن',
    nameDe: 'Palmengarten',
    emoji: '🌳',
    lesson: 5,
    description: 'أجمل حديقة نباتية في فرانكفورت! هنا هتتعلم المشاعر والطبيعة.',
    color: '#FFD700',
    route: '/german-feelings-lesson',
  },
  {
    id: 'main-tower',
    nameAr: 'برج ماين',
    nameDe: 'Main Tower',
    emoji: '🏆',
    lesson: 6,
    description: 'أعلى برج في فرانكفورت! هنا هتعمل اختبار نهائي وتاخد شهادة A1.',
    color: '#58CC02',
    route: '/german-frank-test',
  },
];

// ═══════════════════════════════════════
// 🎨 بيانات الخريطة 4 (برلين)
// ═══════════════════════════════════════
const LANDMARKS_MAP_4 = [
  {
    id: 'berlin-hauptbahnhof',
    nameAr: 'محطة برلين المركزية',
    nameDe: 'Berlin Hauptbahnhof',
    emoji: '🚆',
    lesson: 1,
    description: 'أكبر محطة قطارات في أوروبا! هنا هتتعلم وسائل المواصلات.',
    color: '#4CC9F0',
    route: '/german-transport-lesson',
  },
  {
    id: 'brandenburg-gate-2',
    nameAr: 'بوابة براندنبورغ',
    nameDe: 'Brandenburger Tor',
    emoji: '🏛️',
    lesson: 2,
    description: 'أيقونة برلين الشهيرة! هنا هتتعلم الأماكن والمعالم.',
    color: '#FFD700',
    route: '/german-places-lesson',
  },
  {
    id: 'kudamm-street',
    nameAr: 'شارع كوردام',
    nameDe: 'Kurfürstendamm',
    emoji: '🛍️',
    lesson: 3,
    description: 'أشهر شارع تسوق في برلين! هنا هتتعلم المتاجر والشوبينج.',
    color: '#F72585',
    route: '/german-shopping-lesson',
  },
  {
    id: 'museum-island',
    nameAr: 'جزيرة المتاحف',
    nameDe: 'Museumsinsel',
    emoji: '🏛️',
    lesson: 4,
    description: 'موقع تراث عالمي! هنا هتتعلم الاتجاهات والأماكن في المدينة.',
    color: '#7209B7',
    route: '/german-directions-lesson',
  },
  {
    id: 'embassy-district',
    nameAr: 'حي السفارات',
    nameDe: 'Botschaftsviertel',
    emoji: '🌍',
    lesson: 5,
    description: 'حي دبلوماسي عالمي! هنا هتتعلم الدول والجنسيات.',
    color: '#06D6A0',
    route: '/german-countries-lesson',
  },
  {
    id: 'fernsehturm',
    nameAr: 'برج التلفزيون',
    nameDe: 'Fernsehturm',
    emoji: '📺',
    lesson: 6,
    description: 'أعلى مبنى في ألمانيا! هنا هتعمل اختبار برلين النهائي.',
    color: '#58CC02',
    route: '/german-berlin-test',
  },
];

// ═══════════════════════════════════════
// 🎨 بيانات الخريطة 5 (مدن الثقافة) 🆕
// ═══════════════════════════════════════
const LANDMARKS_MAP_5 = [
  {
    id: 'heidelberg-uni',
    nameAr: 'جامعة هايدلبرغ',
    nameDe: 'Universität Heidelberg',
    emoji: '🎓',
    lesson: 1,
    description: 'أقدم جامعة في ألمانيا! هنا هتتعلم الضمائر الشخصية.',
    color: '#9D4EDD',
    route: '/german-pronouns-lesson',
  },
  {
    id: 'anna-amalia-library',
    nameAr: 'مكتبة آنا أماليا',
    nameDe: 'Anna Amalia Bibliothek',
    emoji: '📚',
    lesson: 2,
    description: 'مكتبة تاريخية شهيرة في فايمار! هنا هتتعلم تصريف الأفعال.',
    color: '#06D6A0',
    route: '/german-verbs-lesson',
  },
  {
    id: 'goethe-house',
    nameAr: 'بيت جوته',
    nameDe: 'Goethes Wohnhaus',
    emoji: '🏠',
    lesson: 3,
    description: 'بيت أعظم شاعر ألماني! هنا هتتعلم كلمات السؤال.',
    color: '#F77F00',
    route: '/german-questions-lesson',
  },
  {
    id: 'semperoper',
    nameAr: 'دار أوبرا سيمبر',
    nameDe: 'Semperoper Dresden',
    emoji: '🎭',
    lesson: 4,
    description: 'أشهر دار أوبرا في ألمانيا! هنا هتتعلم جمل المحادثة اليومية.',
    color: '#EC4899',
    route: '/german-conversation-lesson',
  },
  {
    id: 'christmas-market',
    nameAr: 'سوق الكريسماس',
    nameDe: 'Weihnachtsmarkt Nürnberg',
    emoji: '🎄',
    lesson: 5,
    description: 'أشهر سوق كريسماس في العالم! هنا هتتعلم الأعياد والمناسبات.',
    color: '#EF4444',
    route: '/german-holidays-lesson',
  },
  {
    id: 'goethe-institut',
    nameAr: 'معهد جوته',
    nameDe: 'Goethe-Institut München',
    emoji: '🏛️',
    lesson: 6,
    description: 'المعهد الرسمي لتعليم الألماني! هنا هتاخد شهادة A1 النهائية.',
    color: '#FFD700',
    route: '/german-final-a1-test',
  },
];

// ═══════════════════════════════════════
// 🎯 نوع الـ Polygon
// ═══════════════════════════════════════
type MapPolygon = number[];

type LandmarkCoords = {
  centerX: number;
  centerY: number;
  clickArea: { x: number; y: number; w: number; h: number };
  polygon?: MapPolygon;
};

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 1
// ═══════════════════════════════════════
const COORDS_DESKTOP_MAP_1: Record<string, LandmarkCoords> = {
  hamburg        : { centerX: 40.5, centerY: 12.5, clickArea: { x: 39.4, y: 6,    w: 9.2,  h: 13.7 } },
  cologne        : { centerX: 25.5, centerY: 30.9, clickArea: { x: 18.7, y: 24.4, w: 13.1, h: 27.8 } },
  center         : { centerX: 47.7, centerY: 34,   clickArea: { x: 45.3, y: 33.6, w: 12,   h: 20.5 } },
  berlin         : { centerX: 77.2, centerY: 18,   clickArea: { x: 61.2, y: 9.2,  w: 17.2, h: 22.5 } },
  lake           : { centerX: 85.6, centerY: 49.2, clickArea: { x: 77,   y: 51.2, w: 6.6,  h: 6.2  } },
  neuschwanstein : { centerX: 52.6, centerY: 65.4, clickArea: { x: 48.3, y: 59.1, w: 14.5, h: 28.1 } },
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 1
// ═══════════════════════════════════════
const COORDS_MOBILE_MAP_1: Record<string, LandmarkCoords> = {
  hamburg        : { centerX: 36.6, centerY: 13.7, clickArea: { x: 40.6, y: 4.7,  w: 40,   h: 13.4 } },
  cologne        : { centerX: 18.5, centerY: 24.9, clickArea: { x: 6.8,  y: 20.4, w: 25.8, h: 18.9 } },
  center         : { centerX: 42.9, centerY: 40.4, clickArea: { x: 25.7, y: 38.6, w: 42.3, h: 17.6 } },
  berlin         : { centerX: 78.7, centerY: 17.6, clickArea: { x: 60.3, y: 20,   w: 34.5, h: 14.5 } },
  lake           : { centerX: 73.2, centerY: 88.7, clickArea: { x: 50.5, y: 84.6, w: 38.4, h: 9.2  } },
  neuschwanstein : { centerX: 59.4, centerY: 55.5, clickArea: { x: 46.5, y: 56.9, w: 32.5, h: 19.6 } },
};

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 2
// ═══════════════════════════════════════
const COORDS_DESKTOP_MAP_2: Record<string, LandmarkCoords> = {
  'heidelberg-school' : { centerX: 18,   centerY: 18,   clickArea: { x: 8,    y: 6,   w: 22,  h: 26 } },
  'karl-house'        : { centerX: 47,   centerY: 17,   clickArea: { x: 36,   y: 7,   w: 22,  h: 24 } },
  'toys-island'       : { centerX: 81,   centerY: 21,   clickArea: { x: 68,   y: 10,  w: 26,  h: 26 } },
  'munich-market'     : { centerX: 19,   centerY: 70,   clickArea: { x: 5,    y: 56,  w: 30,  h: 30 } },
  'clock-tower'       : { centerX: 51,   centerY: 68,   clickArea: { x: 40,   y: 53,  w: 22,  h: 30 } },
  'adventurer-castle' : { centerX: 84,   centerY: 70,   clickArea: { x: 70,   y: 53,  w: 26,  h: 32 } },
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 2
// ═══════════════════════════════════════
const COORDS_MOBILE_MAP_2: Record<string, LandmarkCoords> = {
  'heidelberg-school' : { centerX: 35,   centerY: 11,   clickArea: { x: 18,  y: 4,   w: 38, h: 14 } },
  'karl-house'        : { centerX: 60,   centerY: 30,   clickArea: { x: 42,  y: 22,  w: 40, h: 16 } },
  'toys-island'       : { centerX: 25,   centerY: 45,   clickArea: { x: 4,   y: 38,  w: 42, h: 16 } },
  'munich-market'     : { centerX: 65,   centerY: 60,   clickArea: { x: 45,  y: 53,  w: 45, h: 16 } },
  'clock-tower'       : { centerX: 20,   centerY: 75,   clickArea: { x: 2,   y: 68,  w: 32, h: 16 } },
  'adventurer-castle' : { centerX: 60,   centerY: 90,   clickArea: { x: 42,  y: 83,  w: 42, h: 14 } },
};

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 3 (فرانكفورت)
// ═══════════════════════════════════════
const COORDS_DESKTOP_MAP_3: Record<string, LandmarkCoords> = {
  'zeil-street'        : { centerX: 22,   centerY: 32,   clickArea: { x: 12,   y: 18,  w: 22,  h: 26 } },
  'senckenberg-museum' : { centerX: 48,   centerY: 38,   clickArea: { x: 38,   y: 26,  w: 22,  h: 22 } },
  'charite-hospital'   : { centerX: 82,   centerY: 34,   clickArea: { x: 73,   y: 22,  w: 18,  h: 22 } },
  'allianz-arena'      : { centerX: 80,   centerY: 70,   clickArea: { x: 70,   y: 58,  w: 22,  h: 26 } },
  'palmengarten'       : { centerX: 48,   centerY: 78,   clickArea: { x: 38,   y: 68,  w: 22,  h: 22 } },
  'main-tower'         : { centerX: 18,   centerY: 70,   clickArea: { x: 8,    y: 55,  w: 18,  h: 30 } },
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 3 (فرانكفورت)
// ═══════════════════════════════════════
const COORDS_MOBILE_MAP_3: Record<string, LandmarkCoords> = {
  'zeil-street'        : { centerX: 30,   centerY: 15,   clickArea: { x: 10,  y: 8,   w: 40, h: 14 } },
  'senckenberg-museum' : { centerX: 65,   centerY: 28,   clickArea: { x: 45,  y: 22,  w: 42, h: 14 } },
  'charite-hospital'   : { centerX: 25,   centerY: 45,   clickArea: { x: 5,   y: 38,  w: 42, h: 14 } },
  'allianz-arena'      : { centerX: 70,   centerY: 58,   clickArea: { x: 48,  y: 51,  w: 42, h: 14 } },
  'palmengarten'       : { centerX: 30,   centerY: 75,   clickArea: { x: 10,  y: 68,  w: 42, h: 14 } },
  'main-tower'         : { centerX: 65,   centerY: 90,   clickArea: { x: 45,  y: 83,  w: 42, h: 14 } },
};

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 4 (برلين)
// ═══════════════════════════════════════
const COORDS_DESKTOP_MAP_4: Record<string, LandmarkCoords> = {
  'berlin-hauptbahnhof' : { centerX: 18,   centerY: 25,   clickArea: { x: 8,    y: 12,  w: 22,  h: 26 } },
  'brandenburg-gate-2'  : { centerX: 50,   centerY: 22,   clickArea: { x: 39,   y: 10,  w: 22,  h: 24 } },
  'kudamm-street'       : { centerX: 82,   centerY: 25,   clickArea: { x: 70,   y: 12,  w: 24,  h: 26 } },
  'museum-island'       : { centerX: 18,   centerY: 72,   clickArea: { x: 7,    y: 58,  w: 24,  h: 30 } },
  'embassy-district'    : { centerX: 50,   centerY: 75,   clickArea: { x: 38,   y: 62,  w: 24,  h: 28 } },
  'fernsehturm'         : { centerX: 82,   centerY: 72,   clickArea: { x: 70,   y: 55,  w: 24,  h: 32 } },
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 4 (برلين)
// ═══════════════════════════════════════
const COORDS_MOBILE_MAP_4: Record<string, LandmarkCoords> = {
  'berlin-hauptbahnhof' : { centerX: 50,   centerY: 10,   clickArea: { x: 25,  y: 4,   w: 50, h: 14 } },
  'brandenburg-gate-2'  : { centerX: 28,   centerY: 25,   clickArea: { x: 8,   y: 19,  w: 42, h: 14 } },
  'kudamm-street'       : { centerX: 72,   centerY: 42,   clickArea: { x: 50,  y: 36,  w: 42, h: 14 } },
  'museum-island'       : { centerX: 28,   centerY: 58,   clickArea: { x: 8,   y: 52,  w: 42, h: 14 } },
  'embassy-district'    : { centerX: 72,   centerY: 75,   clickArea: { x: 50,  y: 68,  w: 42, h: 14 } },
  'fernsehturm'         : { centerX: 50,   centerY: 90,   clickArea: { x: 25,  y: 84,  w: 50, h: 14 } },
};

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 5 (مدن الثقافة) 🆕
// ═══════════════════════════════════════
const COORDS_DESKTOP_MAP_5: Record<string, LandmarkCoords> = {
  'heidelberg-uni'       : { centerX: 18,   centerY: 25,   clickArea: { x: 8,    y: 12,  w: 22,  h: 26 } },
  'anna-amalia-library'  : { centerX: 50,   centerY: 22,   clickArea: { x: 39,   y: 10,  w: 22,  h: 24 } },
  'goethe-house'         : { centerX: 82,   centerY: 25,   clickArea: { x: 70,   y: 12,  w: 24,  h: 26 } },
  'semperoper'           : { centerX: 18,   centerY: 72,   clickArea: { x: 7,    y: 58,  w: 24,  h: 30 } },
  'christmas-market'     : { centerX: 50,   centerY: 75,   clickArea: { x: 38,   y: 62,  w: 24,  h: 28 } },
  'goethe-institut'      : { centerX: 82,   centerY: 72,   clickArea: { x: 70,   y: 55,  w: 24,  h: 32 } },
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 5 (مدن الثقافة) 🆕
// ═══════════════════════════════════════
const COORDS_MOBILE_MAP_5: Record<string, LandmarkCoords> = {
  'heidelberg-uni'       : { centerX: 50,   centerY: 10,   clickArea: { x: 25,  y: 4,   w: 50, h: 14 } },
  'anna-amalia-library'  : { centerX: 28,   centerY: 25,   clickArea: { x: 8,   y: 19,  w: 42, h: 14 } },
  'goethe-house'         : { centerX: 72,   centerY: 42,   clickArea: { x: 50,  y: 36,  w: 42, h: 14 } },
  'semperoper'           : { centerX: 28,   centerY: 58,   clickArea: { x: 8,   y: 52,  w: 42, h: 14 } },
  'christmas-market'     : { centerX: 72,   centerY: 75,   clickArea: { x: 50,  y: 68,  w: 42, h: 14 } },
  'goethe-institut'      : { centerX: 50,   centerY: 90,   clickArea: { x: 25,  y: 84,  w: 50, h: 14 } },
};// ═══════════════════════════════════════
// 🗺️ تجميع بيانات الخرايط في object واحد
// ═══════════════════════════════════════
const MAPS_DATA = {
  1: {
    landmarks: LANDMARKS_MAP_1,
    coordsDesktop: COORDS_DESKTOP_MAP_1,
    coordsMobile: COORDS_MOBILE_MAP_1,
    imageDesktop: '/maps/german-map.webp',
    imageMobile: '/maps/map-mobile.webp',
    titleAr: 'ألمانيا — الأساسيات',
    titleDe: 'Deutschland — Grundlagen',
    description: 'المرحلة الأولى: الحروف، الأرقام، الألوان والأساسيات',
  },
  2: {
    landmarks: LANDMARKS_MAP_2,
    coordsDesktop: COORDS_DESKTOP_MAP_2,
    coordsMobile: COORDS_MOBILE_MAP_2,
    imageDesktop: '/maps/german-map-2.webp',
    imageMobile: '/maps/map-mobile-2.webp',
    titleAr: 'ألمانيا — الحياة اليومية',
    titleDe: 'Deutschland — Alltag',
    description: 'المرحلة الثانية: المدرسة، البيت، الأكل والوقت',
  },
  3: {
    landmarks: LANDMARKS_MAP_3,
    coordsDesktop: COORDS_DESKTOP_MAP_3,
    coordsMobile: COORDS_MOBILE_MAP_3,
    imageDesktop: '/maps/map-pc-3.webp',
    imageMobile: '/maps/map-mob-3.webp',
    titleAr: 'فرانكفورت — مدن الثقافة',
    titleDe: 'Frankfurt — Kulturstädte',
    description: 'المرحلة الثالثة: الملابس، أجزاء الجسم، الصحة والرياضة',
  },
  4: {
    landmarks: LANDMARKS_MAP_4,
    coordsDesktop: COORDS_DESKTOP_MAP_4,
    coordsMobile: COORDS_MOBILE_MAP_4,
    imageDesktop: '/maps/map-pc-4.webp',
    imageMobile: '/maps/map-mob-4.webp',
    titleAr: 'برلين — الحياة المتقدمة',
    titleDe: 'Berlin — Fortgeschritten',
    description: 'المرحلة الرابعة: المواصلات، الأماكن، التسوق والاتجاهات',
  },
  5: {
    landmarks: LANDMARKS_MAP_5,
    coordsDesktop: COORDS_DESKTOP_MAP_5,
    coordsMobile: COORDS_MOBILE_MAP_5,
    imageDesktop: '/maps/map-pc-5.webp',
    imageMobile: '/maps/map-mob-5.webp',
    titleAr: 'مدن الثقافة الألمانية',
    titleDe: 'Deutsche Kulturstädte',
    description: 'المرحلة الخامسة والأخيرة: الضمائر، الأفعال، المحادثة وشهادة A1',
  },
};

type MapNumber = 1 | 2 | 3 | 4 | 5;
const TOTAL_MAPS_COUNT = 5;

// ═══════════════════════════════════════
// 🎯 Helper Functions
// ═══════════════════════════════════════
function isPointInMapPolygon(px: number, py: number, polygon: MapPolygon): boolean {
  let inside = false;
  const len = polygon.length;
  for (let i = 0, j = len - 2; i < len; j = i, i += 2) {
    const xi = polygon[i], yi = polygon[i + 1];
    const xj = polygon[j], yj = polygon[j + 1];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function polygonToSvgPoints(polygon: MapPolygon): string {
  const points: string[] = [];
  for (let i = 0; i < polygon.length; i += 2) {
    points.push(`${polygon[i]},${polygon[i + 1]}`);
  }
  return points.join(' ');
}

// ═══════════════════════════════════════
// 🔊 أصوات
// ═══════════════════════════════════════
function playClickSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

function playLockedSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

function playSuccessSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.4);
    });
  } catch {}
}

// ═══════════════════════════════════════
// 🎨 أداة الفرشاة (Map Brush Tool)
// ═══════════════════════════════════════
type BrushPoint = { x: number; y: number };
type LandmarkData = {
  centerX: number;
  centerY: number;
  brushPoints: BrushPoint[];
  clickArea: { x: number; y: number; w: number; h: number };
};
type BrushMode = 'brush' | 'center' | 'erase';

function MapBrushTool({ 
  isMobileView: initialMobile, 
  landmarks,
  mapNumber,
  mapImage,
}: { 
  isMobileView: boolean; 
  landmarks: typeof LANDMARKS_MAP_1;
  mapNumber: MapNumber;
  mapImage: { desktop: string; mobile: string };
}) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(initialMobile ? 'mobile' : 'desktop');
  const [selectedLandmark, setSelectedLandmark] = useState<string>(landmarks[0]?.id || '');
  const [mode, setMode] = useState<BrushMode>('brush');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [copiedMsg, setCopiedMsg] = useState('');
  const [dataDesktop, setDataDesktop] = useState<Record<string, LandmarkData>>({});
  const [dataMobile, setDataMobile] = useState<Record<string, LandmarkData>>({});
  const mapRef = useRef<HTMLDivElement>(null);

  const currentData = viewMode === 'desktop' ? dataDesktop : dataMobile;
  const setCurrentData = viewMode === 'desktop' ? setDataDesktop : setDataMobile;
  const currentImage = viewMode === 'desktop' ? mapImage.desktop : mapImage.mobile;

  const storageKeyDesktop = `brushTool_map${mapNumber}_desktop_v1`;
  const storageKeyMobile = `brushTool_map${mapNumber}_mobile_v1`;

  useEffect(() => {
    try {
      const d = localStorage.getItem(storageKeyDesktop);
      const m = localStorage.getItem(storageKeyMobile);
      if (d) setDataDesktop(JSON.parse(d));
      if (m) setDataMobile(JSON.parse(m));
    } catch {}
  }, [mapNumber]);

  useEffect(() => {
    localStorage.setItem(storageKeyDesktop, JSON.stringify(dataDesktop));
  }, [dataDesktop, storageKeyDesktop]);
  useEffect(() => {
    localStorage.setItem(storageKeyMobile, JSON.stringify(dataMobile));
  }, [dataMobile, storageKeyMobile]);

  const getMapCoords = (e: React.MouseEvent): { x: number; y: number } | null => {
    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const updateLandmarkData = (updater: (prev: LandmarkData) => LandmarkData) => {
    setCurrentData(prev => {
      const existing: LandmarkData = prev[selectedLandmark] || {
        centerX: 50, centerY: 50, brushPoints: [],
        clickArea: { x: 45, y: 45, w: 10, h: 10 },
      };
      const updated = updater(existing);
      if (updated.brushPoints.length > 0) {
        const xs = updated.brushPoints.map(p => p.x);
        const ys = updated.brushPoints.map(p => p.y);
        const minX = Math.min(...xs) - brushSize / 2;
        const maxX = Math.max(...xs) + brushSize / 2;
        const minY = Math.min(...ys) - brushSize / 2;
        const maxY = Math.max(...ys) + brushSize / 2;
        updated.clickArea = {
          x: parseFloat(Math.max(0, minX).toFixed(1)),
          y: parseFloat(Math.max(0, minY).toFixed(1)),
          w: parseFloat(Math.min(100 - minX, maxX - minX).toFixed(1)),
          h: parseFloat(Math.min(100 - minY, maxY - minY).toFixed(1)),
        };
      }
      return { ...prev, [selectedLandmark]: updated };
    });
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    const coords = getMapCoords(e);
    if (!coords) return;
    if (mode === 'center') {
      updateLandmarkData(prev => ({
        ...prev,
        centerX: parseFloat(coords.x.toFixed(1)),
        centerY: parseFloat(coords.y.toFixed(1)),
      }));
      return;
    }
    setIsDrawing(true);
    if (mode === 'brush') {
      updateLandmarkData(prev => ({ ...prev, brushPoints: [...prev.brushPoints, coords] }));
    } else if (mode === 'erase') {
      updateLandmarkData(prev => ({
        ...prev,
        brushPoints: prev.brushPoints.filter(p => {
          const dx = p.x - coords.x, dy = p.y - coords.y;
          return Math.sqrt(dx * dx + dy * dy) > brushSize;
        }),
      }));
    }
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const coords = getMapCoords(e);
    if (!coords) return;
    if (mode === 'brush') {
      updateLandmarkData(prev => {
        const last = prev.brushPoints[prev.brushPoints.length - 1];
        if (last) {
          const dx = last.x - coords.x, dy = last.y - coords.y;
          if (Math.sqrt(dx * dx + dy * dy) < brushSize * 0.3) return prev;
        }
        return { ...prev, brushPoints: [...prev.brushPoints, coords] };
      });
    } else if (mode === 'erase') {
      updateLandmarkData(prev => ({
        ...prev,
        brushPoints: prev.brushPoints.filter(p => {
          const dx = p.x - coords.x, dy = p.y - coords.y;
          return Math.sqrt(dx * dx + dy * dy) > brushSize;
        }),
      }));
    }
  };

  const handlePointerUp = () => setIsDrawing(false);

  const clearCurrent = () => {
    if (!confirm(`مسح بيانات ${landmarks.find(l => l.id === selectedLandmark)?.nameAr}؟`)) return;
    setCurrentData(prev => {
      const next = { ...prev };
      delete next[selectedLandmark];
      return next;
    });
  };

  const generateCode = (data: Record<string, LandmarkData>, label: string) => {
    let code = `const COORDS_${label}_MAP_${mapNumber}: Record<string, LandmarkCoords> = {\n`;
    landmarks.forEach(l => {
      const d = data[l.id];
      if (d) {
        code += `  '${l.id}': { centerX: ${d.centerX}, centerY: ${d.centerY}, clickArea: { x: ${d.clickArea.x}, y: ${d.clickArea.y}, w: ${d.clickArea.w}, h: ${d.clickArea.h} } },\n`;
      } else {
        code += `  // ${l.id} - لم يحدد\n`;
      }
    });
    return code + `};`;
  };

  const copyCode = (label: 'DESKTOP' | 'MOBILE') => {
    const data = label === 'DESKTOP' ? dataDesktop : dataMobile;
    navigator.clipboard.writeText(generateCode(data, label));
    setCopiedMsg(`تم نسخ كود ${label} (خريطة ${mapNumber}) ✅`);
    setTimeout(() => setCopiedMsg(''), 2000);
  };

  const selectedData = currentData[selectedLandmark];
  const selectedInfo = landmarks.find(l => l.id === selectedLandmark)!;

  if (!selectedInfo) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="font-bold">لا توجد معالم في هذه الخريطة</p>
          <button onClick={() => window.location.href = '/character-and-map'}
            className="mt-4 px-6 py-2 bg-white/10 rounded-lg font-bold">
            رجوع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-black text-lg">🎨 أداة الفرشاة — الخريطة {mapNumber}</h1>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('desktop')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'desktop' ? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>🖥️ Desktop</button>
          <button onClick={() => setViewMode('mobile')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'mobile' ? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>📱 Mobile</button>
          <button onClick={() => window.location.href = '/character-and-map'} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/30 hover:bg-red-500/50">✕ خروج</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 bg-[#131722] border-l border-white/10 p-4 overflow-y-auto flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-black text-white/60 mb-2">🎯 المعلم</h3>
            <div className="space-y-1">
              {landmarks.map(l => {
                const hasData = !!currentData[l.id];
                return (
                  <button key={l.id} onClick={() => setSelectedLandmark(l.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-bold ${selectedLandmark === l.id ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10'}`}
                    style={selectedLandmark === l.id ? { borderRight: `4px solid ${l.color}` } : {}}>
                    <span>{l.emoji} {l.nameAr}</span>
                    {hasData && <span className="text-green-500">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-white/60 mb-2">🛠️ الأداة</h3>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => setMode('brush')} className={`py-2 rounded-lg text-[10px] font-bold ${mode === 'brush' ? 'bg-yellow-400 text-black' : 'bg-white/5'}`}>🖌️ فرشاة</button>
              <button onClick={() => setMode('erase')} className={`py-2 rounded-lg text-[10px] font-bold ${mode === 'erase' ? 'bg-red-500' : 'bg-white/5'}`}>🧹 ممحاة</button>
              <button onClick={() => setMode('center')} className={`py-2 rounded-lg text-[10px] font-bold ${mode === 'center' ? 'bg-blue-500' : 'bg-white/5'}`}>📍 مركز</button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-white/60 mb-2">📏 حجم الفرشاة: {brushSize}%</h3>
            <input type="range" min="1" max="10" step="0.5" value={brushSize} onChange={(e) => setBrushSize(parseFloat(e.target.value))} className="w-full" />
          </div>

          <button onClick={() => setShowAll(!showAll)} className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold">
            {showAll ? '👁️ إخفاء الباقي' : '👁️ إظهار الكل'}
          </button>

          {selectedData && (
            <div className="bg-black/40 rounded-lg p-3 text-xs space-y-1">
              <div className="font-black text-yellow-400">📊 {selectedInfo.nameAr}</div>
              <div>المركز: <span className="text-green-400">({selectedData.centerX}, {selectedData.centerY})</span></div>
              <div className="text-[10px]">المنطقة: <span className="text-blue-400">x:{selectedData.clickArea.x} y:{selectedData.clickArea.y} w:{selectedData.clickArea.w} h:{selectedData.clickArea.h}</span></div>
              <div>النقاط: <span className="text-purple-400">{selectedData.brushPoints.length}</span></div>
            </div>
          )}

          <button onClick={clearCurrent} className="w-full py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs">🗑️ مسح المعلم الحالي</button>

          <div className="border-t border-white/10 pt-3 space-y-2">
            <button onClick={() => copyCode('DESKTOP')} className="w-full py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-bold text-xs">📋 نسخ كود DESKTOP</button>
            <button onClick={() => copyCode('MOBILE')} className="w-full py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 font-bold text-xs">📋 نسخ كود MOBILE</button>
            {copiedMsg && <div className="text-center text-xs font-bold text-green-400">{copiedMsg}</div>}
          </div>

          <div className="text-[10px] text-white/40 bg-white/5 rounded-lg p-2 leading-relaxed">
            💡 1) اختر معلم  2) ارسم بالفرشاة  3) حدد المركز  4) انسخ الكود
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-[#07090D]">
          <div ref={mapRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            className="relative select-none"
            style={{
              width: viewMode === 'desktop' ? 'min(100%, calc((100vh - 140px) * 16/9))' : 'min(100%, calc((100vh - 140px) * 9/16))',
              aspectRatio: viewMode === 'desktop' ? '16 / 9' : '9 / 16',
              cursor: mode === 'brush' ? 'crosshair' : mode === 'erase' ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            }}>
            <img src={currentImage} alt="map" className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ objectFit: viewMode === 'mobile' ? 'cover' : 'contain' }} draggable={false} />

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {landmarks.map(l => {
                const data = currentData[l.id];
                if (!data) return null;
                const isSelected = l.id === selectedLandmark;
                if (!showAll && !isSelected) return null;
                return (
                  <g key={l.id} opacity={isSelected ? 1 : 0.35}>
                    {data.brushPoints.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r={brushSize / 2} fill={l.color} opacity={0.5} />
                    ))}
                    <rect x={data.clickArea.x} y={data.clickArea.y} width={data.clickArea.w} height={data.clickArea.h}
                      fill="none" stroke={l.color} strokeWidth="0.3" strokeDasharray="1,0.5" />
                    <circle cx={data.centerX} cy={data.centerY} r="0.8" fill="white" stroke={l.color} strokeWidth="0.3" />
                    <text x={data.clickArea.x + data.clickArea.w / 2} y={data.clickArea.y - 0.5}
                      fill={l.color} fontSize="1.5" fontWeight="bold" textAnchor="middle"
                      style={{ paintOrder: 'stroke', stroke: 'black', strokeWidth: '0.3' }}>{l.emoji}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-black/60 px-4 py-2 text-xs text-white/60 flex justify-between">
        <span>الخريطة: <strong className="text-yellow-400">{mapNumber}</strong> • الوضع: <strong className="text-yellow-400">{viewMode === 'desktop' ? '🖥️' : '📱'}</strong> • المعلم: <strong style={{ color: selectedInfo.color }}>{selectedInfo.emoji} {selectedInfo.nameAr}</strong> • الأداة: <strong className="text-green-400">{mode}</strong></span>
        <span className="text-white/40">💾 حفظ تلقائي</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════
export default function CharacterAndMapPage() {
  const router = useRouter();

  const [step, setStep] = useState<'setup' | 'video' | 'map'>('setup');
  const [heroName, setHeroName] = useState('');
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [brushMode, setBrushMode] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ x: number; y: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isMobileView, setIsMobileView] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🆕 نظام الخرايط المتعددة (مع خريطة 5)
  const getInitialMap = (): MapNumber => {
    if (typeof window === 'undefined') return 1;
    const param = new URLSearchParams(window.location.search).get('map');
    if (param === '2') return 2;
    if (param === '3') return 3;
    if (param === '4') return 4;
    if (param === '5') return 5;
    return 1;
  };

  const [currentMap, setCurrentMap] = useState<MapNumber>(getInitialMap);
  const [showMapTransition, setShowMapTransition] = useState(false);
  const [mapCompletedFlag, setMapCompletedFlag] = useState<number | null>(null);
  
  const [mapScale, setMapScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasDragged = useRef(false);
  
  const mapRef = useRef<HTMLDivElement>(null);

  const currentMapData = MAPS_DATA[currentMap];
  const LANDMARKS = currentMapData.landmarks.map(landmark => {
    const coords = isMobileView 
      ? currentMapData.coordsMobile[landmark.id] 
      : currentMapData.coordsDesktop[landmark.id];
    return { ...landmark, ...coords };
  });

  const mapImage = isMobileView ? currentMapData.imageMobile : currentMapData.imageDesktop;  useEffect(() => {
    setMounted(true);
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsMobileView(isMobile && isPortrait);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  useEffect(() => {
    const loadPlayer = async () => {
      const player = await getPlayer();
      if (player) {
        setHeroName(player.hero_name);
        setSelectedHero(player.hero_type);
        console.log('✅ تم تحميل اللاعب من Supabase:', player);
      } else {
        const savedName = localStorage.getItem('heroName');
        const savedHero = localStorage.getItem('heroType');
        if (savedName) setHeroName(savedName);
        if (savedHero) setSelectedHero(savedHero);
      }
    };
    
    loadPlayer();

    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'lesson') {
      setStep('map');
    }
    if (params.get('debug') === '1') {
      setDebugMode(true);
    }
    if (params.get('brush') === '1') {
      setBrushMode(true);
    }
  }, []);

  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
  const [unlockedLessonInMap, setUnlockedLessonInMap] = useState(1);
  const [map1Complete, setMap1Complete] = useState(false);
  const [map2Complete, setMap2Complete] = useState(false);
  const [map3Complete, setMap3Complete] = useState(false);
  const [map4Complete, setMap4Complete] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      const allProgress = await getAllProgress();
      
      const map: Record<string, LessonProgress> = {};
      allProgress.forEach(p => {
        map[p.lesson_id] = p;
      });
      setProgressMap(map);

      const m1Done = await isMapCompleted(1);
      const m2Done = await isMapCompleted(2);
      const m3Done = await isMapCompleted(3);
      setMap1Complete(m1Done);
      setMap2Complete(m2Done);
      setMap3Complete(m3Done);

      let currentMapLessons: string[];
      if (currentMap === 1) currentMapLessons = MAP_1_LESSONS;
      else if (currentMap === 2) currentMapLessons = MAP_2_LESSONS;
      else if (currentMap === 3) currentMapLessons = MAP_3_LESSONS;
      else if (currentMap === 4) {
        currentMapLessons = LANDMARKS_MAP_4.map(l => l.id);
      } else {
        // 🆕 خريطة 5: كل المعالم مفتوحة
        currentMapLessons = LANDMARKS_MAP_5.map(l => l.id);
      }

      let lastUnlocked = 1;
      for (let i = 0; i < currentMapLessons.length; i++) {
        const lessonId = currentMapLessons[i];
        const progress = map[lessonId];
        
        if (progress?.completed) {
          lastUnlocked = i + 2;
        } else {
          break;
        }
      }
      
      // 🆕 خريطة 4 و 5: كل المعالم مفتوحة
      if (currentMap === 4 || currentMap === 5) {
        setUnlockedLessonInMap(99);
      } else {
        setUnlockedLessonInMap(Math.min(lastUnlocked, currentMapLessons.length));
      }
      
      console.log('🗺️ التقدم المحمّل:', map);
      console.log('🔓 آخر درس مفتوح في الخريطة', currentMap, ':', lastUnlocked);
      console.log('✅ Map 1:', m1Done, '| Map 2:', m2Done, '| Map 3:', m3Done);

      const params = new URLSearchParams(window.location.search);
      if (params.get('from') === 'lesson') {
        const seenTransition1 = localStorage.getItem('seen_map_transition_1');
        const seenTransition2 = localStorage.getItem('seen_map_transition_2');
        const seenTransition3 = localStorage.getItem('seen_map_transition_3');
        const seenTransition4 = localStorage.getItem('seen_map_transition_4');
        
        if (m1Done && !seenTransition1 && currentMap === 1) {
          setMapCompletedFlag(1);
          setTimeout(() => setShowMapTransition(true), 500);
        } else if (m2Done && !seenTransition2 && currentMap === 2) {
          setMapCompletedFlag(2);
          setTimeout(() => setShowMapTransition(true), 500);
        } else if (m3Done && !seenTransition3 && currentMap === 3) {
          setMapCompletedFlag(3);
          setTimeout(() => setShowMapTransition(true), 500);
        } else if (!seenTransition4 && currentMap === 4) {
          // 🆕 شيك على خريطة 4 - بنفس منطق الخرايط التانية
          setMapCompletedFlag(4);
          setTimeout(() => setShowMapTransition(true), 500);
        }
      }
    };
    
    loadProgress();
  }, [currentMap]);

  const [videoStarted, setVideoStarted] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [eaglePos, setEaglePos] = useState({ x: 49, y: 46 });
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroes = [
    { id: 'boy', name: 'البطل الشجاع', color: '#4CC9F0', img: '/characters/boy-3d.webp' },
    { id: 'girl', name: 'البطلة العبقرية', color: '#F72585', img: '/characters/girl-3d.webp' },
  ];

  useEffect(() => {
    const current = LANDMARKS.find(l => l.lesson === unlockedLessonInMap);
    if (current) {
      setEaglePos({ x: current.centerX, y: current.centerY });
    } else if (currentMap === 4 || currentMap === 5) {
      const first = LANDMARKS[0];
      if (first) setEaglePos({ x: first.centerX, y: first.centerY });
    }
  }, [unlockedLessonInMap, isMobileView, currentMap]);

  useEffect(() => {
    setMapScale(1);
    setMapPosition({ x: 0, y: 0 });
  }, [isMobileView, step, currentMap]);

  const isLocked = (lesson: number) => {
    if (currentMap === 4 || currentMap === 5) return false; // 🔓 خريطة 4 و 5 مفتوحتين
    return lesson > unlockedLessonInMap;
  };
  
  const isCurrent = (lesson: number) => lesson === unlockedLessonInMap;
  const getStars = (id: string) => progressMap[id]?.stars ?? 0;

  const handleStartJourney = async () => {
    if (heroName && selectedHero) {
      setIsSaving(true);
      const player = await savePlayer(heroName, selectedHero);
      if (player) {
        localStorage.setItem('heroName', heroName);
        localStorage.setItem('heroType', selectedHero);
        setIsSaving(false);
        setStep('video');
      } else {
        setIsSaving(false);
        alert('حصلت مشكلة في حفظ البيانات، حاول تاني!');
      }
    }
  };

  const handleVideoEnd = () => setStep('map');

  const handleTapToPlay = () => {
    setVideoStarted(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  const handleLandmarkClick = (landmark: typeof LANDMARKS[0]) => {
    if (debugMode || brushMode) return;
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    if (isLocked(landmark.lesson)) {
      playLockedSound();
      return;
    }
    playClickSound();
    setEaglePos({ x: landmark.centerX, y: landmark.centerY });
    setTimeout(() => setSelectedLandmark(landmark), 300);
  };

  const handleLandmarkStart = () => {
    if (!selectedLandmark) return;
    router.push(selectedLandmark.route);
  };

  const handleGoToNextMap = () => {
    playSuccessSound();
    localStorage.setItem(`seen_map_transition_${currentMap}`, '1');
    setShowMapTransition(false);
    setMapCompletedFlag(null);
    setCurrentMap(prev => {
      const next = prev + 1;
      if (next > TOTAL_MAPS_COUNT) return prev;
      return next as MapNumber;
    });
  };

  const handleGoToPreviousMap = () => {
    if (currentMap > 1) {
      playClickSound();
      setCurrentMap(prev => (prev - 1) as MapNumber);
    }
  };

  const handleShowMapTransition = () => {
    setMapCompletedFlag(currentMap);
    setShowMapTransition(true);
  };

  const handleMapClickForDebug = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!debugMode || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickedCoords({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) });
    console.log(`📍 [${isMobileView ? '📱 MOBILE' : '🖥️ DESKTOP'}] [MAP ${currentMap}] Clicked at: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (debugMode || e.button !== 0 || isMobileView) return;
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: mapPosition.x,
      posY: mapPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || debugMode || isMobileView) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDragged.current = true;
    }
    setMapPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (debugMode || isMobileView) return;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setMapScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const resetMapView = () => {
    setMapScale(1);
    setMapPosition({ x: 0, y: 0 });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  if (brushMode) {
    return (
      <MapBrushTool 
        isMobileView={isMobileView} 
        landmarks={currentMapData.landmarks}
        mapNumber={currentMap}
        mapImage={{ desktop: currentMapData.imageDesktop, mobile: currentMapData.imageMobile }}
      />
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#07090D] text-white pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#7209B7]/15 to-transparent blur-[140px] pointer-events-none" />

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-6 relative z-10 mt-4 space-y-16">
          <header className="flex justify-between items-center py-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <ArrowLeft size={14} /> العودة للرئيسية
            </button>
          </header>

          <input
            type="text"
            value={heroName}
            onChange={e => setHeroName(e.target.value)}
            placeholder="...اكتب اسمك الشجاع هنا"
            className="w-full max-w-lg mx-auto block bg-transparent border-b-2 border-white/20 focus:border-[#4CC9F0] text-center font-black text-2xl py-4 outline-none transition-all placeholder:text-white/20"
          />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {heroes.map(hero => (
              <div key={hero.id} className="flex flex-col items-center group">
                <motion.div onClick={() => setSelectedHero(hero.id)} whileHover={{ y: -10 }} className="relative cursor-pointer flex flex-col items-center">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity rounded-full blur-2xl" style={{ backgroundColor: hero.color }} />
                  <img src={hero.img} alt={hero.name} className="w-48 h-56 object-contain relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
                </motion.div>
                <h3 className="text-xl font-black mt-6 mb-4">{hero.name}</h3>
                <button onClick={() => setSelectedHero(hero.id)}
                  className={`px-8 py-3 rounded-full font-black border-2 transition-all ${selectedHero === hero.id ? 'bg-white text-black' : 'border-white/20 hover:border-white'}`}>
                  اختار بطلك
                </button>
              </div>
            ))}
          </section>

          <div className="flex justify-center pt-10 pb-20">
            <motion.button onClick={handleStartJourney} disabled={!heroName || !selectedHero || isSaving} whileHover={{ scale: isSaving ? 1 : 1.05 }}
              className="group relative px-12 py-5 bg-gradient-to-r from-[#F72585] to-[#7209B7] rounded-full font-black text-2xl flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              {isSaving ? 'جاري الحفظ...' : 'ابدأ رحلتك'}
              {!isSaving && <Sparkles className="text-white group-hover:rotate-12 transition-transform" />}
            </motion.button>
          </div>
        </motion.main>
      </div>
    );
  }

  if (step === 'video') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
        onClick={!videoStarted ? handleTapToPlay : undefined}>
        <video ref={videoRef} src="/videos/karl-intro.mp4" className="w-full h-full object-cover" playsInline muted onEnded={handleVideoEnd} />

        <AnimatePresence>
          {!videoStarted && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
              <motion.img src="/characters/karl-3d.webp" alt="كارل النسر" className="w-40 h-40 object-contain drop-shadow-2xl"
                animate={{ y: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="flex flex-col items-center gap-3" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <div className="w-16 h-16 rounded-full border-4 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  <div className="w-0 h-0" style={{ borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid white', marginLeft: '4px' }} />
                </div>
                <p className="text-white font-black text-xl">اضغط لتبدأ المغامرة</p>
                <p className="text-white/50 text-sm font-bold">كارل النسر في انتظارك! 🦅</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {videoStarted && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} onClick={handleVideoEnd}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-black text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/50 transition-all backdrop-blur-sm bg-black/30">
              تخطي ←
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>

      {debugMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 flex items-center justify-between text-xs font-black">
          <span>🐛 [{isMobileView ? '📱 MOBILE' : '🖥️ DESKTOP'}] [MAP {currentMap}] اضغط على الخريطة لمعرفة الإحداثيات</span>
          {clickedCoords && (
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-lg font-mono">
              X: {clickedCoords.x}% | Y: {clickedCoords.y}%
            </span>
          )}
        </div>
      )}

      <div className="fixed left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(7,9,13,0.95), transparent)', 
          top: debugMode ? '32px' : '0' 
        }}>
        <div className="flex items-center gap-2">
          <button onClick={() => setStep('setup')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-3 py-2 text-xs md:text-sm font-bold text-white transition-all">
            ← تعديل
          </button>

          {currentMap > 1 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleGoToPreviousMap}
              className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 rounded-2xl px-3 py-2 text-xs md:text-sm font-bold text-purple-300 transition-all"
              title="الخريطة السابقة">
              <MapIcon size={14} /> سابقة
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMobileView && (
            <AnimatePresence>
              {(mapPosition.x !== 0 || mapPosition.y !== 0 || mapScale !== 1) && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={resetMapView}
                  className="flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-2xl px-3 py-2 text-xs font-bold text-yellow-400 transition-all"
                  title="إعادة ضبط العرض">
                  🔄
                </motion.button>
              )}
            </AnimatePresence>
          )}

          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-3 py-2">
            <div className="text-xs md:text-sm font-black text-white">👋 {heroName}</div>
          </div>

          <motion.div 
            key={currentMap}
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/40 rounded-2xl px-3 py-2">
            <MapIcon size={14} className="text-purple-300" />
            <span className="text-xs font-black text-white">المرحلة {currentMap}/{TOTAL_MAPS_COUNT}</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-3 py-2">
          <div className="text-right">
            <div className="text-[10px] md:text-xs text-white/50 font-bold">تقدمك</div>
            <div className="text-xs md:text-sm font-black text-[#58CC02]">
              {(currentMap === 4 || currentMap === 5)
                ? `${LANDMARKS.length} / ${LANDMARKS.length}` 
                : `${LANDMARKS.filter(l => l.lesson < unlockedLessonInMap).length} / ${LANDMARKS.length}`}
            </div>
          </div>
          <div className="text-lg md:text-xl">🗺️</div>
        </div>
      </div>



      <div 
        className="w-full min-h-screen flex items-center justify-center bg-[#07090D] overflow-hidden" 
        style={{ paddingTop: debugMode ? '96px' : '64px' }}
      >
        <div 
          ref={mapRef}
          onClick={handleMapClickForDebug}
          onMouseDown={!isMobileView ? handleMouseDown : undefined}
          onMouseMove={!isMobileView ? handleMouseMove : undefined}
          onMouseUp={!isMobileView ? handleMouseUp : undefined}
          onMouseLeave={!isMobileView ? handleMouseUp : undefined}
          onWheel={!isMobileView ? handleWheel : undefined}
          className="relative"
          style={{
            width: '100%',
            maxWidth: isMobileView ? '100vw' : '100%',
            height: isMobileView ? 'calc(100vh - 64px)' : 'auto',
            aspectRatio: isMobileView ? 'auto' : '16 / 9',
            cursor: isMobileView ? 'default' : (debugMode ? 'crosshair' : (isDragging ? 'grabbing' : 'grab')),
            transform: isMobileView ? 'none' : `scale(${mapScale}) translate(${mapPosition.x / mapScale}px, ${mapPosition.y / mapScale}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={`map-${currentMap}`}
              src={mapImage}
              alt={`خريطة ${currentMap}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ objectFit: isMobileView ? 'cover' : 'contain', display: 'block' }}
              draggable={false} 
            />
          </AnimatePresence>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ zIndex: 5 }}
          >
            <defs>
              {LANDMARKS.map(l => (
                <radialGradient key={`grad-${l.id}`} id={`glow-${l.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={l.color} stopOpacity="0.55" />
                  <stop offset="50%" stopColor={l.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={l.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {LANDMARKS.map(l => {
              const showGlow = hoveredLandmark?.id === l.id || isCurrent(l.lesson);
              if (isLocked(l.lesson) && !isCurrent(l.lesson)) return null;
              if (!l.clickArea) return null;
              const cx = l.clickArea.x + l.clickArea.w / 2;
              const cy = l.clickArea.y + l.clickArea.h / 2;
              const rx = l.clickArea.w * 0.6;
              const ry = l.clickArea.h * 0.6;
              return (
                <motion.ellipse
                  key={`hover-${l.id}`}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill={`url(#glow-${l.id})`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: showGlow ? (isCurrent(l.lesson) ? [0.7, 1, 0.7] : 1) : 0,
                  }}
                  transition={isCurrent(l.lesson)
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.3 }
                  }
                  style={{
                    filter: `blur(${isCurrent(l.lesson) ? '2px' : '1px'})`,
                    mixBlendMode: 'screen',
                  }}
                />
              );
            })}
          </svg>

          {debugMode && LANDMARKS.map(l => {
            if (!l.clickArea) return null;
            return (
              <div key={`debug-${l.id}`} className="absolute pointer-events-none border-2 border-dashed flex items-center justify-center"
                style={{
                  left: `${l.clickArea.x}%`,
                  top: `${l.clickArea.y}%`,
                  width: `${l.clickArea.w}%`,
                  height: `${l.clickArea.h}%`,
                  borderColor: l.color,
                  background: `${l.color}20`,
                  zIndex: 18,
                }}>
                <span className="bg-black/80 text-white text-xs font-black px-2 py-0.5 rounded">
                  {l.emoji} {l.nameAr}
                </span>
              </div>
            );
          })}

          {LANDMARKS.map((landmark, index) => {
            if (!landmark.clickArea) return null;
            const locked = isLocked(landmark.lesson);
            const stars = getStars(landmark.id);

            return (
              <div key={landmark.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  onClick={() => handleLandmarkClick(landmark)}
                  onMouseEnter={() => setHoveredLandmark(landmark)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                  className="absolute"
                  style={{
                    left: `${landmark.clickArea.x}%`,
                    top: `${landmark.clickArea.y}%`,
                    width: `${landmark.clickArea.w}%`,
                    height: `${landmark.clickArea.h}%`,
                    cursor: locked ? 'not-allowed' : 'pointer',
                    zIndex: 15,
                  }}
                />

                {!locked && stars > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    className="absolute pointer-events-none flex gap-0.5"
                    style={{
                      left: `${landmark.centerX}%`,
                      top: `${landmark.clickArea.y - 4}%`,
                      transform: 'translate(-50%, -100%)',
                      zIndex: 16,
                    }}
                  >
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        size={isMobileView ? 12 : 16}
                        fill={s <= stars ? '#FFD700' : 'transparent'}
                        color={s <= stars ? '#FFD700' : 'rgba(255,255,255,0.3)'}
                        strokeWidth={2}
                        style={{
                          filter: s <= stars ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' : 'none',
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {locked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      y: [0, -3, 0],
                    }}
                    transition={{ 
                      scale: { delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 },
                      opacity: { delay: 0.5 + index * 0.1 },
                      y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }
                    }}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${landmark.centerX}%`,
                      top: `${landmark.centerY}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 14,
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,180,50,0.4), transparent 70%)',
                        filter: 'blur(8px)',
                        transform: 'scale(2)',
                      }}
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div
                      className="relative rounded-full flex items-center justify-center"
                      style={{
                        width: 'clamp(28px, 2.8vw, 38px)',
                        height: 'clamp(28px, 2.8vw, 38px)',
                        background: 'linear-gradient(135deg, #8B6914 0%, #4A3508 100%)',
                        border: '2px solid #D4AF37',
                        boxShadow: `
                          0 0 15px rgba(212,175,55,0.5),
                          inset 0 2px 4px rgba(255,215,0,0.4),
                          inset 0 -2px 4px rgba(0,0,0,0.4),
                          0 3px 6px rgba(0,0,0,0.5)
                        `,
                      }}
                    >
                      <Lock 
                        size={16} 
                        className="relative" 
                        strokeWidth={2.5}
                        style={{ 
                          color: '#FFD700',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))',
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {hoveredLandmark?.id === landmark.id && !locked && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${landmark.centerX}%`,
                        top: `${landmark.clickArea.y - 8}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 20,
                      }}
                    >
                      <div
                        className="px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-2xl border whitespace-nowrap"
                        style={{
                          background: `${landmark.color}ee`,
                          borderColor: 'rgba(255,255,255,0.3)',
                          boxShadow: `0 4px 20px ${landmark.color}88`,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{landmark.emoji}</span>
                          <span>{landmark.nameAr}</span>
                        </div>
                        <div className="text-white/85 text-[10px] font-bold text-center mt-0.5">{landmark.nameDe}</div>
                      </div>
                      <div
                        className="w-0 h-0 mx-auto"
                        style={{
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: `5px solid ${landmark.color}ee`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <motion.div
            className="absolute pointer-events-none"
            style={{ zIndex: 25 }}
            animate={{
              left: `${eaglePos.x}%`,
              top: `${eaglePos.y - 6}%`,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 14, duration: 2 }}
          >
            <motion.div
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/characters/karl-3d.webp"
                alt="كارل النسر"
                style={{
                  width: 'clamp(35px, 3.5vw, 55px)',
                  height: 'clamp(35px, 3.5vw, 55px)',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(76,201,240,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedLandmark && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedLandmark(null)}>
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#131722', border: `2px solid ${selectedLandmark.color}` }}>
              <div className="p-6 text-center relative" style={{ background: `${selectedLandmark.color}22` }}>
                <button onClick={() => setSelectedLandmark(null)} className="absolute top-4 left-4 text-white/40 hover:text-white">
                  <X size={20} />
                </button>
                <div className="text-6xl mb-3">{selectedLandmark.emoji}</div>
                <h2 className="text-2xl font-black text-white mb-1">{selectedLandmark.nameAr}</h2>
                <p className="text-sm font-bold" style={{ color: selectedLandmark.color }}>{selectedLandmark.nameDe}</p>
              </div>
              <div className="p-6">
                <div className="flex gap-3 bg-white/5 rounded-2xl p-4 mb-5">
                  <img src="/characters/karl-3d.webp" alt="كارل" className="w-10 h-10 object-contain flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white/50 mb-1">كارل النسر يقول:</div>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">&quot;{selectedLandmark.description}&quot;</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3].map(s => (
                    <Star key={s} size={28} fill={s <= getStars(selectedLandmark.id) ? '#FFD700' : 'transparent'} color={s <= getStars(selectedLandmark.id) ? '#FFD700' : '#333'} />
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleLandmarkStart}
                  className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${selectedLandmark.color}, ${selectedLandmark.color}99)`, borderBottom: `4px solid ${selectedLandmark.color}66` }}>
                  {(() => {
                    const lessonData = progressMap[selectedLandmark.id];
                    if (!lessonData) return 'ابدأ المغامرة! 🚀';
                    if (lessonData.completed) return 'العب تاني 🔄';
                    return 'أكمل تقدمك ▶️';
                  })()}
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapTransition && mapCompletedFlag !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(124,58,237,0.3), rgba(7,9,13,0.95))', 
              backdropFilter: 'blur(20px)' 
            }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={`bg-star-${i}`}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles 
                  size={8 + Math.random() * 12} 
                  className="text-yellow-300" 
                  fill="#FFD700"
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="relative w-full max-w-lg rounded-[2rem] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(20,15,55,0.95), rgba(15,10,45,0.98))',
                border: '3px solid #FFD700',
                boxShadow: '0 20px 80px rgba(255,215,0,0.4), 0 0 100px rgba(124,58,237,0.5)',
              }}
            >
              <div className="relative pt-8 pb-4 text-center overflow-hidden"
                style={{ background: 'linear-gradient(180deg, rgba(255,215,0,0.2), transparent)' }}>
                
                <motion.div
                  initial={{ scale: 0, rotate: -180, y: -100 }}
                  animate={{ scale: 1, rotate: 0, y: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.3 }}
                  className="inline-block relative"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
                      boxShadow: '0 0 40px rgba(255,215,0,0.8), inset 0 4px 12px rgba(255,255,255,0.4), inset 0 -4px 12px rgba(0,0,0,0.3)',
                      border: '4px solid #FFE55C',
                    }}
                  >
                    <Trophy size={60} className="text-white" strokeWidth={2.5}
                      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }} />
                  </motion.div>

                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.div
                      key={angle}
                      className="absolute top-1/2 left-1/2"
                      style={{ 
                        transformOrigin: 'center',
                        transform: `rotate(${angle}deg) translateY(-80px)`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Star size={20} fill="#FFD700" color="#FFD700" 
                        style={{ filter: 'drop-shadow(0 0 6px #FFD700)' }} />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4"
                >
                  <h2 className="text-3xl font-black text-white mb-1"
                    style={{ 
                      background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    مبروك يا بطل! 🎉
                  </h2>
                  <p className="text-sm text-white/70 font-bold">
                    خلّصت المرحلة {mapCompletedFlag} بنجاح!
                  </p>
                </motion.div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-3 bg-white/5 rounded-2xl p-4 mb-5 border border-white/10"
                >
                  <motion.img 
                    src="/characters/karl-3d.webp" 
                    alt="كارل" 
                    className="w-14 h-14 object-contain flex-shrink-0"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div>
                    <div className="text-xs font-bold text-yellow-400 mb-1">كارل النسر يقول:</div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      {mapCompletedFlag === 1 
                        ? '"يا سلام عليك! خلّصنا الأساسيات. يلا نطير لمرحلة جديدة في ألمانيا الجنوبية! 🦅"'
                        : mapCompletedFlag === 2
                        ? '"عاش! خلّصنا الحياة اليومية. يلا نطير لفرانكفورت عاصمة الثقافة! 🏙️"'
                        : mapCompletedFlag === 3
                        ? '"إنجاز رائع! يلا نطير لبرلين عاصمة ألمانيا الكبيرة! 🏙️"'
                        : mapCompletedFlag === 4
                        ? '"خلصنا برلين! يلا نطير لمدن الثقافة الألمانية والمرحلة الأخيرة! 🎓"'
                        : '"إنجاز خرافي! أنت أصبحت متحدث ألماني محترف الآن وحاصل على شهادة A1! 🎓"'
                      }
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="grid grid-cols-2 gap-3 mb-5"
                >
                  <div className="rounded-2xl p-4 text-center border border-yellow-500/30"
                    style={{ background: 'rgba(255,215,0,0.1)' }}>
                    <Star size={28} fill="#FFD700" color="#FFD700" className="mx-auto mb-2" />
                    <div className="text-2xl font-black text-yellow-400">
                      {(() => {
                        const lessons = mapCompletedFlag === 1 ? MAP_1_LESSONS 
                          : mapCompletedFlag === 2 ? MAP_2_LESSONS 
                          : mapCompletedFlag === 3 ? MAP_3_LESSONS
                          : mapCompletedFlag === 4 ? LANDMARKS_MAP_4.map(l => l.id)
                          : LANDMARKS_MAP_5.map(l => l.id);
                        return lessons.reduce((sum, id) => sum + (progressMap[id]?.stars || 0), 0);
                      })()}
                    </div>
                    <div className="text-[10px] font-bold text-white/60">نجوم</div>
                  </div>

                  <div className="rounded-2xl p-4 text-center border border-green-500/30"
                    style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <Trophy size={28} className="text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-black text-green-400">
                      {mapCompletedFlag === 1 ? MAP_1_LESSONS.length 
                        : mapCompletedFlag === 2 ? MAP_2_LESSONS.length 
                        : mapCompletedFlag === 3 ? MAP_3_LESSONS.length
                        : mapCompletedFlag === 4 ? LANDMARKS_MAP_4.length
                        : LANDMARKS_MAP_5.length}
                    </div>
                    <div className="text-[10px] font-bold text-white/60">معالم</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="space-y-3"
                >
                  {currentMap < TOTAL_MAPS_COUNT ? (
                    <motion.button 
                      whileHover={{ scale: 1.03 }} 
                      whileTap={{ scale: 0.97 }} 
                      onClick={handleGoToNextMap}
                      className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 shadow-lg"
                      style={{ 
                        background: 'linear-gradient(135deg, #FFD700, #FF8C00)', 
                        borderBottom: '4px solid #B8860B',
                        boxShadow: '0 8px 30px rgba(255,215,0,0.5)',
                      }}
                    >
                      <span>ابدأ المرحلة {currentMap + 1} 🚀</span>
                      <ChevronRight size={20} />
                    </motion.button>
                  ) : (
                    <div className="w-full py-4 rounded-2xl font-black text-lg text-white text-center"
                      style={{ background: 'linear-gradient(135deg, #58CC02, #2A6A02)' }}>
                      🏆 أنهيت كل المراحل!
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      setShowMapTransition(false);
                      setMapCompletedFlag(null);
                      if (mapCompletedFlag) {
                        localStorage.setItem(`seen_map_transition_${mapCompletedFlag}`, '1');
                      }
                    }}
                    className="w-full py-2.5 rounded-2xl font-bold text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all"
                  >
                    لاحقاً
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && !debugMode && !showMapTransition && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ delay: 0.5 }}
            className="fixed bottom-4 right-4 z-40 max-w-[260px]">
            <div className="rounded-2xl p-3 shadow-2xl border border-white/10 relative" style={{ background: 'rgba(19,23,34,0.97)' }}>
              <button
                onClick={() => setShowIntro(false)}
                className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 z-10"
              >
                <X size={12} />
              </button>
              <div className="flex gap-2 items-center pr-5">
                <motion.img src="/characters/karl-3d.webp" alt="كارل" className="w-9 h-9 object-contain flex-shrink-0"
                  animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1, repeat: 2 }} />
                <div className="flex-1 text-right">
                  <div className="text-[10px] font-bold text-[#4CC9F0]">كارل النسر</div>
                  <p className="text-[11px] text-white/80 leading-tight font-medium">
                    أهلاً <strong className="text-white">{heroName}</strong>! {isMobileView ? 'اضغط على المعالم لتبدأ' : 'اسحب الخريطة وكبّر بالعجلة 🖱️'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowIntro(false)}
                className="w-full mt-2 py-1.5 rounded-lg font-black text-[11px] text-white"
                style={{ background: 'linear-gradient(135deg, #4CC9F0, #7209B7)' }}>
                فاهم! 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
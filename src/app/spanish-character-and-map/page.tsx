'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Star, ChevronRight, X, Trophy, Map as MapIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  savePlayer, 
  getPlayer, 
  getUserPlanStatus,
  type LessonProgress 
} from '@/lib/playerData';
import {
  getAllSpanishProgress,
  isSpanishMapCompleted,
  ES_MAP_1_LESSONS,
  ES_MAP_2_LESSONS,
  ES_MAP_3_LESSONS,
  ES_MAP_4_LESSONS,
  ES_MAP_5_LESSONS,
  ES_TOTAL_MAPS,
} from '@/lib/spanishPlayerData';

// ═══════════════════════════════════════
// 🌲 الخريطة 1: غابات الشمال (Los Bosques del Norte)
// ═══════════════════════════════════════
const LANDMARKS_MAP_1 = [
  {
    id: 'es-muniellos-alphabet',
    nameAr: 'غابة مونييلوس',
    nameEs: 'Bosque de Muniellos',
    emoji: '🌳',
    lesson: 1,
    description: 'أكبر غابة بلوط في أسبانيا! هنا هتتعلم الأبجدية الأسبانية كاملة.',
    color: '#4CC9F0',
    route: '/spanish-alphabet-lesson',
  },
  {
    id: 'es-covadonga-numbers',
    nameAr: 'بحيرات كوفادونغا',
    nameEs: 'Lagos de Covadonga',
    emoji: '🏞️',
    lesson: 2,
    description: 'بحيرتين سحريتين بين الجبال! هنا هتتعلم الأرقام من 0 لـ 20.',
    color: '#06D6A0',
    route: '/spanish-numbers-lesson',
  },
  {
    id: 'es-catedrales-colors',
    nameAr: 'شاطئ الكاتدرائيات',
    nameEs: 'Playa de las Catedrales',
    emoji: '🌈',
    lesson: 3,
    description: 'شاطئ خرافي بأقواس صخرية طبيعية! هنا هتتعلم الألوان.',
    color: '#F72585',
    route: '/spanish-colors-lesson',
  },
  {
    id: 'es-horreo-family',
    nameAr: 'مخزن جاليسيا',
    nameEs: 'Hórreo Gallego',
    emoji: '🏡',
    lesson: 4,
    description: 'مخزن تقليدي شهير في غاليسيا! هنا هتتعلم عن العائلة والتعارف.',
    color: '#FFD700',
    route: '/spanish-family-lesson',
  },
  {
    id: 'es-ribera-fruits',
    nameAr: 'سوق ريبيرا',
    nameEs: 'Mercado de la Ribera',
    emoji: '🛒',
    lesson: 5,
    description: 'أشهر سوق في بلباو! هنا هتتعلم الفواكه والخضروات.',
    color: '#FF6B6B',
    route: '/spanish-fruits-lesson',
  },
  {
    id: 'es-somiedo-animals',
    nameAr: 'محمية سوميدو',
    nameEs: 'Parque de Somiedo',
    emoji: '🐻',
    lesson: 6,
    description: 'محمية الدببة في أستورياس! هنا هتتعلم الحيوانات.',
    color: '#A78BFA',
    route: '/spanish-animals-lesson',
  },
  {
    id: 'es-guggenheim-greetings',
    nameAr: 'متحف غوغنهايم',
    nameEs: 'Museo Guggenheim Bilbao',
    emoji: '🏛️',
    lesson: 7,
    description: 'متحف فني عالمي بمعمار خيالي! هنا هتتعلم التحيات والمحادثات.',
    color: '#7209B7',
    route: '/spanish-greetings-lesson',
  },
  {
    id: 'es-faro-test',
    nameAr: 'منارة جزيرة بانتشا',
    nameEs: 'Faro de la Isla Pancha',
    emoji: '🚨',
    lesson: 8,
    description: 'منارة شهيرة على جزيرة صغيرة! هنا هتعمل اختبار الشمال النهائي.',
    color: '#DC2626',
    route: '/spanish-faro-test',
  },
];

// ═══════════════════════════════════════
// 🏰 الخريطة 2: قلاع قشتالة (Castillos de Castilla)
// ═══════════════════════════════════════
const LANDMARKS_MAP_2 = [
  {
    id: 'es-segovia-body',
    nameAr: 'قلعة سيغوفيا',
    nameEs: 'Castillo de Segovia',
    emoji: '🏰',
    lesson: 1,
    description: 'قلعة سحرية ألهمت ديزني! هنا هتتعلم أعضاء الجسم.',
    color: '#3B82F6',
    route: '/spanish-body-lesson',
  },
  {
    id: 'es-traje-clothes',
    nameAr: 'متحف الأزياء',
    nameEs: 'Museo del Traje',
    emoji: '👗',
    lesson: 2,
    description: 'متحف الأزياء التقليدية في مدريد! هنا هتتعلم الملابس.',
    color: '#EC4899',
    route: '/spanish-clothes-lesson',
  },
  {
    id: 'es-candido-food',
    nameAr: 'مطعم كانديدو',
    nameEs: 'Mesón de Cándido',
    emoji: '🍖',
    lesson: 3,
    description: 'أشهر مطعم في سيغوفيا! هنا هتتعلم الطعام والشراب.',
    color: '#F97316',
    route: '/spanish-food-lesson',
  },
  {
    id: 'es-cuenca-house',
    nameAr: 'البيوت المعلقة',
    nameEs: 'Casas Colgadas',
    emoji: '🏚️',
    lesson: 4,
    description: 'بيوت معلقة على حافة الجبل في كوينكا! هنا هتتعلم المنزل والغرف.',
    color: '#A16207',
    route: '/spanish-house-lesson',
  },
  {
    id: 'es-salamanca-school',
    nameAr: 'جامعة سالامانكا',
    nameEs: 'Universidad de Salamanca',
    emoji: '🏛️',
    lesson: 5,
    description: 'أقدم جامعة في إسبانيا! هنا هتتعلم كلمات المدرسة.',
    color: '#7C3AED',
    route: '/spanish-school-lesson',
  },
  {
    id: 'es-greco-feelings',
    nameAr: 'متحف إل غريكو',
    nameEs: 'Museo del Greco',
    emoji: '🎨',
    lesson: 6,
    description: 'متحف الفنان العظيم إل غريكو في طليطلة! هنا هتتعلم المشاعر.',
    color: '#DB2777',
    route: '/spanish-feelings-lesson',
  },
  {
    id: 'es-mayor-games',
    nameAr: 'الساحة الكبرى',
    nameEs: 'Plaza Mayor Salamanca',
    emoji: '⛲',
    lesson: 7,
    description: 'أجمل ساحة في إسبانيا! هنا هتتعلم الألعاب والهوايات.',
    color: '#EAB308',
    route: '/spanish-games-lesson',
  },
  {
    id: 'es-consuegra-test',
    nameAr: 'طواحين دون كيخوتي',
    nameEs: 'Molinos de Don Quijote',
    emoji: '🌬️',
    lesson: 8,
    description: 'طواحين الهواء الشهيرة من رواية دون كيخوتي! اختبار قشتالة النهائي.',
    color: '#16A34A',
    route: '/spanish-consuegra-test',
  },
];

// ═══════════════════════════════════════
// 🌊 الخريطة 3: سواحل المتوسط (Costas del Mediterráneo)
// ═══════════════════════════════════════
const LANDMARKS_MAP_3 = [
  {
    id: 'es-portvell-time',
    nameAr: 'برج ساعة بورت فيل',
    nameEs: 'Torre del Reloj Port Vell',
    emoji: '🕐',
    lesson: 1,
    description: 'برج ساعة تاريخي في ميناء برشلونة! هنا هتتعلم الوقت والساعات.',
    color: '#0EA5E9',
    route: '/spanish-time-lesson',
  },
  {
    id: 'es-santpau-health',
    nameAr: 'مستشفى سانت باو',
    nameEs: 'Hospital Sant Pau',
    emoji: '🏥',
    lesson: 2,
    description: 'أجمل مستشفى في العالم بتصميم كاتالاني! هنا هتتعلم الصحة والجسم.',
    color: '#22C55E',
    route: '/spanish-health-lesson',
  },
  {
    id: 'es-campnou-sports',
    nameAr: 'كامب نو',
    nameEs: 'Camp Nou',
    emoji: '⚽',
    lesson: 3,
    description: 'ملعب برشلونة الأسطوري! هنا هتتعلم الرياضة والهوايات.',
    color: '#DC2626',
    route: '/spanish-sports-lesson',
  },
  {
    id: 'es-boqueria-shopping',
    nameAr: 'سوق البوكيريا',
    nameEs: 'Mercado de La Boquería',
    emoji: '🛒',
    lesson: 4,
    description: 'أشهر سوق طعام في برشلونة! هنا هتتعلم التسوق والأسعار.',
    color: '#F97316',
    route: '/spanish-shopping-lesson',
  },
  {
    id: 'es-metrovalencia-transport',
    nameAr: 'مترو فالنسيا',
    nameEs: 'Metro de Valencia',
    emoji: '🚇',
    lesson: 5,
    description: 'شبكة مترو حديثة في فالنسيا! هنا هتتعلم المواصلات.',
    color: '#7C3AED',
    route: '/spanish-transport-lesson',
  },
  {
    id: 'es-ciencias-countries',
    nameAr: 'مدينة الفنون والعلوم',
    nameEs: 'Ciudad de las Artes',
    emoji: '🏛️',
    lesson: 6,
    description: 'مجمع علمي مستقبلي في فالنسيا! هنا هتتعلم الدول والجنسيات.',
    color: '#06B6D4',
    route: '/spanish-countries-lesson',
  },
  {
    id: 'es-dali-art',
    nameAr: 'متحف دالي',
    nameEs: 'Museo Dalí',
    emoji: '🎨',
    lesson: 7,
    description: 'متحف الفنان السريالي سلفادور دالي! هنا هتتعلم الفن والألوان.',
    color: '#EC4899',
    route: '/spanish-art-lesson',
  },
  {
    id: 'es-sagrada-test',
    nameAr: 'ساغرادا فاميليا',
    nameEs: 'Sagrada Familia',
    emoji: '⛪',
    lesson: 8,
    description: 'كاتدرائية غاودي الأسطورية! هنا هتعمل اختبار المتوسط النهائي.',
    color: '#FCD34D',
    route: '/spanish-sagrada-test',
  },
];

// ═══════════════════════════════════════
// 🌅 الخريطة 4: أراضي الجنوب (Tierras del Sur)
// ═══════════════════════════════════════
const LANDMARKS_MAP_4 = [
  {
    id: 'es-sevilla-verbs-regular',
    nameAr: 'قصر إشبيلية الملكي',
    nameEs: 'Real Alcázar de Sevilla',
    emoji: '🏛️',
    lesson: 1,
    description: 'قصر ملكي مغربي فاخر في إشبيلية! هنا هتتعلم الأفعال المنتظمة.',
    color: '#DC2626',
    route: '/spanish-verbs-regular-lesson',
  },
  {
    id: 'es-merida-verbs-irregular',
    nameAr: 'المسرح الروماني في ميريدا',
    nameEs: 'Teatro Romano de Mérida',
    emoji: '🎭',
    lesson: 2,
    description: 'مسرح روماني قديم من ألفين سنة! هنا هتتعلم الأفعال الشاذة.',
    color: '#A16207',
    route: '/spanish-verbs-irregular-lesson',
  },
  {
    id: 'es-donana-nature',
    nameAr: 'محمية دونانا الطبيعية',
    nameEs: 'Parque Nacional de Doñana',
    emoji: '🦩',
    lesson: 3,
    description: 'محمية طبيعية فيها الفلامنجو الوردي! هنا هتتعلم الطبيعة والحيوانات.',
    color: '#EC4899',
    route: '/spanish-nature-lesson',
  },
  {
    id: 'es-malaga-entertainment',
    nameAr: 'مهرجان مالقة السينمائي',
    nameEs: 'Festival de Cine de Málaga',
    emoji: '🎬',
    lesson: 4,
    description: 'أشهر مهرجان سينمائي في إسبانيا! هنا هتتعلم الترفيه والأفلام.',
    color: '#FCD34D',
    route: '/spanish-entertainment-lesson',
  },
  {
    id: 'es-triana-recipes',
    nameAr: 'حانة تريانا',
    nameEs: 'Taberna Triana',
    emoji: '🍳',
    lesson: 5,
    description: 'مطعم أندلسي أصيل في إشبيلية! هنا هتتعلم الوصفات والطبخ.',
    color: '#F97316',
    route: '/spanish-recipes-lesson',
  },
  {
    id: 'es-correos-communication',
    nameAr: 'قصر البريد الملكي',
    nameEs: 'Real Casa de Correos',
    emoji: '📮',
    lesson: 6,
    description: 'مبنى البريد التاريخي في مدريد! هنا هتتعلم التواصل والرسائل.',
    color: '#3B82F6',
    route: '/spanish-communication-lesson',
  },
  {
    id: 'es-mezquita-places',
    nameAr: 'مسجد قرطبة',
    nameEs: 'Mezquita de Córdoba',
    emoji: '🕌',
    lesson: 7,
    description: 'أعظم مسجد أندلسي بأقواسه الحمراء الشهيرة! هنا هتتعلم وصف الأماكن.',
    color: '#B91C1C',
    route: '/spanish-places-lesson',
  },
  {
    id: 'es-alhambra-test',
    nameAr: 'قصر الحمراء',
    nameEs: 'La Alhambra de Granada',
    emoji: '🏰',
    lesson: 8,
    description: 'جوهرة العمارة الأندلسية في غرناطة! هنا هتعمل اختبار الجنوب النهائي.',
    color: '#EAB308',
    route: '/spanish-alhambra-test',
  },
];

// ═══════════════════════════════════════
// ✈️ الخريطة 5: الجزر والعاصمة (Islas y Capital)
// ═══════════════════════════════════════
const LANDMARKS_MAP_5 = [
  {
    id: 'es-puertasol-fiestas',
    nameAr: 'بوابة الشمس',
    nameEs: 'Puerta del Sol',
    emoji: '🕛',
    lesson: 1,
    description: 'ساحة مدريد الشهيرة حيث يحتفل الأسبان برأس السنة! هنا هتتعلم الأعياد والاحتفالات.',
    color: '#DC2626',
    route: '/spanish-fiestas-lesson',
  },
  {
    id: 'es-palma-vacaciones',
    nameAr: 'شاطئ بالما',
    nameEs: 'Playa de Palma',
    emoji: '🏖️',
    lesson: 2,
    description: 'شاطئ خيالي في جزيرة مايوركا! هنا هتتعلم الإجازات والسفر.',
    color: '#0EA5E9',
    route: '/spanish-vacaciones-lesson',
  },
  {
    id: 'es-prado-arte',
    nameAr: 'متحف برادو',
    nameEs: 'Museo del Prado',
    emoji: '🖼️',
    lesson: 3,
    description: 'أشهر متحف فني في إسبانيا! هنا هتتعلم الفن والثقافة.',
    color: '#7C3AED',
    route: '/spanish-arte-lesson',
  },
  {
    id: 'es-bernabeu-deporte',
    nameAr: 'استاد بيرنابيو',
    nameEs: 'Estadio Bernabéu',
    emoji: '⚽',
    lesson: 4,
    description: 'ملعب ريال مدريد الأسطوري! هنا هتتعلم الرياضة المحترفة.',
    color: '#EAB308',
    route: '/spanish-deporte-lesson',
  },
  {
    id: 'es-teide-medioambiente',
    nameAr: 'بركان تيدي',
    nameEs: 'Teide Tenerife',
    emoji: '🌋',
    lesson: 5,
    description: 'أعلى قمة في إسبانيا في جزر الكناري! هنا هتتعلم البيئة والطبيعة.',
    color: '#F97316',
    route: '/spanish-medioambiente-lesson',
  },
  {
    id: 'es-america-hispano',
    nameAr: 'قصر أمريكا',
    nameEs: 'Casa de América',
    emoji: '🌍',
    lesson: 6,
    description: 'قصر رمز للثقافة اللاتينية في مدريد! هنا هتتعلم العالم الناطق بالأسبانية.',
    color: '#EC4899',
    route: '/spanish-hispano-lesson',
  },
  {
    id: 'es-biblioteca-lectura',
    nameAr: 'المكتبة الوطنية',
    nameEs: 'Biblioteca Nacional',
    emoji: '📚',
    lesson: 7,
    description: 'أكبر مكتبة في إسبانيا! هنا هتتعلم القراءة والكتابة.',
    color: '#A16207',
    route: '/spanish-lectura-lesson',
  },
  {
    id: 'es-palacio-final-test',
    nameAr: 'القصر الملكي',
    nameEs: 'Palacio Real de Madrid',
    emoji: '👑',
    lesson: 8,
    description: 'القصر الملكي في مدريد! هنا هتعمل الاختبار النهائي الكبير وتحصل على شهادة A2!',
    color: '#FCD34D',
    route: '/spanish-palacio-final-test',
  },
];

type LandmarkCoords = {
  centerX: number;
  centerY: number;
  clickArea: { x: number; y: number; w: number; h: number };
};

// 🖥️ إحداثيات الديسكتوب — الخريطة 1
const COORDS_DESKTOP_MAP_1: Record<string, LandmarkCoords> = {
  'es-muniellos-alphabet'   : { centerX: 27,   centerY: 22,   clickArea: { x: 18,  y: 10,  w: 20,  h: 25 } },
  'es-covadonga-numbers'    : { centerX: 55,   centerY: 22,   clickArea: { x: 46,  y: 12,  w: 20,  h: 22 } },
  'es-catedrales-colors'    : { centerX: 82,   centerY: 22,   clickArea: { x: 72,  y: 12,  w: 20,  h: 22 } },
  'es-horreo-family'        : { centerX: 30,   centerY: 50,   clickArea: { x: 20,  y: 40,  w: 20,  h: 22 } },
  'es-ribera-fruits'        : { centerX: 55,   centerY: 50,   clickArea: { x: 46,  y: 40,  w: 20,  h: 22 } },
  'es-somiedo-animals'      : { centerX: 82,   centerY: 52,   clickArea: { x: 72,  y: 42,  w: 20,  h: 22 } },
  'es-guggenheim-greetings' : { centerX: 30,   centerY: 80,   clickArea: { x: 18,  y: 70,  w: 24,  h: 22 } },
  'es-faro-test'            : { centerX: 88,   centerY: 80,   clickArea: { x: 78,  y: 68,  w: 18,  h: 28 } },
};

// 📱 إحداثيات الموبايل — الخريطة 1
const COORDS_MOBILE_MAP_1: Record<string, LandmarkCoords> = {
  'es-muniellos-alphabet'   : { centerX: 25,  centerY: 8,   clickArea: { x: 8,   y: 3,   w: 35,  h: 11 } },
  'es-covadonga-numbers'    : { centerX: 72,  centerY: 18,  clickArea: { x: 55,  y: 13,  w: 38,  h: 11 } },
  'es-catedrales-colors'    : { centerX: 28,  centerY: 30,  clickArea: { x: 10,  y: 25,  w: 38,  h: 11 } },
  'es-horreo-family'        : { centerX: 72,  centerY: 42,  clickArea: { x: 55,  y: 37,  w: 38,  h: 11 } },
  'es-ribera-fruits'        : { centerX: 28,  centerY: 55,  clickArea: { x: 10,  y: 50,  w: 38,  h: 11 } },
  'es-somiedo-animals'      : { centerX: 72,  centerY: 68,  clickArea: { x: 55,  y: 63,  w: 38,  h: 11 } },
  'es-guggenheim-greetings' : { centerX: 28,  centerY: 80,  clickArea: { x: 10,  y: 75,  w: 38,  h: 11 } },
  'es-faro-test'            : { centerX: 72,  centerY: 92,  clickArea: { x: 55,  y: 87,  w: 38,  h: 11 } },
};

// 🖥️ إحداثيات الديسكتوب — الخريطة 2
const COORDS_DESKTOP_MAP_2: Record<string, LandmarkCoords> = {
  'es-segovia-body'      : { centerX: 18,   centerY: 28,   clickArea: { x: 8,   y: 15,  w: 22,  h: 30 } },
  'es-traje-clothes'     : { centerX: 18,   centerY: 70,   clickArea: { x: 8,   y: 58,  w: 22,  h: 25 } },
  'es-candido-food'      : { centerX: 42,   centerY: 28,   clickArea: { x: 32,  y: 18,  w: 22,  h: 22 } },
  'es-cuenca-house'      : { centerX: 60,   centerY: 28,   clickArea: { x: 50,  y: 18,  w: 22,  h: 22 } },
  'es-salamanca-school'  : { centerX: 50,   centerY: 70,   clickArea: { x: 40,  y: 58,  w: 22,  h: 25 } },
  'es-greco-feelings'    : { centerX: 78,   centerY: 32,   clickArea: { x: 70,  y: 22,  w: 22,  h: 22 } },
  'es-mayor-games'       : { centerX: 85,   centerY: 50,   clickArea: { x: 75,  y: 42,  w: 22,  h: 20 } },
  'es-consuegra-test'    : { centerX: 90,   centerY: 78,   clickArea: { x: 80,  y: 65,  w: 18,  h: 30 } },
};

// 📱 إحداثيات الموبايل — الخريطة 2
const COORDS_MOBILE_MAP_2: Record<string, LandmarkCoords> = {
  'es-segovia-body'      : { centerX: 25,  centerY: 8,    clickArea: { x: 10,  y: 3,   w: 35,  h: 12 } },
  'es-traje-clothes'     : { centerX: 50,  centerY: 22,   clickArea: { x: 30,  y: 17,  w: 40,  h: 12 } },
  'es-candido-food'      : { centerX: 72,  centerY: 30,   clickArea: { x: 55,  y: 25,  w: 38,  h: 11 } },
  'es-cuenca-house'      : { centerX: 28,  centerY: 42,   clickArea: { x: 10,  y: 37,  w: 38,  h: 11 } },
  'es-salamanca-school'  : { centerX: 60,  centerY: 52,   clickArea: { x: 42,  y: 47,  w: 40,  h: 12 } },
  'es-greco-feelings'    : { centerX: 75,  centerY: 65,   clickArea: { x: 55,  y: 60,  w: 40,  h: 12 } },
  'es-mayor-games'       : { centerX: 30,  centerY: 78,   clickArea: { x: 10,  y: 73,  w: 40,  h: 12 } },
  'es-consuegra-test'    : { centerX: 60,  centerY: 92,   clickArea: { x: 40,  y: 87,  w: 45,  h: 11 } },
};

// 🖥️ إحداثيات الديسكتوب — الخريطة 3
const COORDS_DESKTOP_MAP_3: Record<string, LandmarkCoords> = {
  'es-portvell-time'           : { centerX: 18,  centerY: 22,  clickArea: { x: 8,   y: 10,  w: 20,  h: 28 } },
  'es-santpau-health'          : { centerX: 48,  centerY: 20,  clickArea: { x: 38,  y: 10,  w: 22,  h: 24 } },
  'es-campnou-sports'          : { centerX: 82,  centerY: 22,  clickArea: { x: 70,  y: 12,  w: 22,  h: 24 } },
  'es-boqueria-shopping'       : { centerX: 25,  centerY: 55,  clickArea: { x: 13,  y: 42,  w: 24,  h: 28 } },
  'es-metrovalencia-transport' : { centerX: 52,  centerY: 52,  clickArea: { x: 42,  y: 42,  w: 20,  h: 22 } },
  'es-ciencias-countries'      : { centerX: 80,  centerY: 55,  clickArea: { x: 68,  y: 42,  w: 24,  h: 28 } },
  'es-dali-art'                : { centerX: 22,  centerY: 82,  clickArea: { x: 8,   y: 68,  w: 28,  h: 28 } },
  'es-sagrada-test'            : { centerX: 58,  centerY: 82,  clickArea: { x: 44,  y: 62,  w: 26,  h: 35 } },
};

// 📱 إحداثيات الموبايل — الخريطة 3
const COORDS_MOBILE_MAP_3: Record<string, LandmarkCoords> = {
  'es-portvell-time'           : { centerX: 25,  centerY: 9,   clickArea: { x: 10,  y: 3,   w: 32,  h: 12 } },
  'es-santpau-health'          : { centerX: 68,  centerY: 13,  clickArea: { x: 48,  y: 8,   w: 42,  h: 12 } },
  'es-campnou-sports'          : { centerX: 28,  centerY: 25,  clickArea: { x: 8,   y: 20,  w: 42,  h: 12 } },
  'es-boqueria-shopping'       : { centerX: 65,  centerY: 36,  clickArea: { x: 45,  y: 30,  w: 42,  h: 14 } },
  'es-metrovalencia-transport' : { centerX: 25,  centerY: 47,  clickArea: { x: 8,   y: 42,  w: 42,  h: 12 } },
  'es-ciencias-countries'      : { centerX: 65,  centerY: 58,  clickArea: { x: 45,  y: 52,  w: 42,  h: 14 } },
  'es-dali-art'                : { centerX: 26,  centerY: 68,  clickArea: { x: 8,   y: 62,  w: 42,  h: 14 } },
  'es-sagrada-test'            : { centerX: 52,  centerY: 86,  clickArea: { x: 30,  y: 76,  w: 45,  h: 22 } },
};

// 🖥️ إحداثيات الديسكتوب — الخريطة 4
const COORDS_DESKTOP_MAP_4: Record<string, LandmarkCoords> = {
  'es-sevilla-verbs-regular'    : { centerX: 15,  centerY: 22,  clickArea: { x: 5,   y: 10,  w: 22,  h: 28 } },
  'es-merida-verbs-irregular'   : { centerX: 45,  centerY: 22,  clickArea: { x: 32,  y: 12,  w: 25,  h: 24 } },
  'es-donana-nature'            : { centerX: 82,  centerY: 22,  clickArea: { x: 72,  y: 12,  w: 22,  h: 24 } },
  'es-malaga-entertainment'     : { centerX: 15,  centerY: 78,  clickArea: { x: 5,   y: 65,  w: 22,  h: 28 } },
  'es-triana-recipes'           : { centerX: 30,  centerY: 52,  clickArea: { x: 18,  y: 42,  w: 24,  h: 22 } },
  'es-correos-communication'    : { centerX: 50,  centerY: 55,  clickArea: { x: 40,  y: 45,  w: 20,  h: 22 } },
  'es-mezquita-places'          : { centerX: 75,  centerY: 52,  clickArea: { x: 63,  y: 42,  w: 24,  h: 24 } },
  'es-alhambra-test'            : { centerX: 55,  centerY: 82,  clickArea: { x: 38,  y: 68,  w: 40,  h: 30 } },
};

// 📱 إحداثيات الموبايل — الخريطة 4
const COORDS_MOBILE_MAP_4: Record<string, LandmarkCoords> = {
  'es-sevilla-verbs-regular'    : { centerX: 28,  centerY: 8,   clickArea: { x: 10,  y: 3,   w: 38,  h: 12 } },
  'es-merida-verbs-irregular'   : { centerX: 70,  centerY: 18,  clickArea: { x: 50,  y: 13,  w: 45,  h: 12 } },
  'es-donana-nature'            : { centerX: 25,  centerY: 30,  clickArea: { x: 8,   y: 25,  w: 40,  h: 12 } },
  'es-malaga-entertainment'     : { centerX: 22,  centerY: 62,  clickArea: { x: 5,   y: 56,  w: 40,  h: 12 } },
  'es-triana-recipes'           : { centerX: 30,  centerY: 44,  clickArea: { x: 12,  y: 39,  w: 40,  h: 11 } },
  'es-correos-communication'    : { centerX: 72,  centerY: 44,  clickArea: { x: 55,  y: 39,  w: 40,  h: 11 } },
  'es-mezquita-places'          : { centerX: 70,  centerY: 58,  clickArea: { x: 52,  y: 52,  w: 42,  h: 13 } },
  'es-alhambra-test'            : { centerX: 55,  centerY: 88,  clickArea: { x: 30,  y: 76,  w: 55,  h: 22 } },
};

// 🖥️ إحداثيات الديسكتوب — الخريطة 5
const COORDS_DESKTOP_MAP_5: Record<string, LandmarkCoords> = {
  'es-puertasol-fiestas'      : { centerX: 15,  centerY: 22,  clickArea: { x: 5,   y: 8,   w: 22,  h: 30 } },
  'es-palma-vacaciones'       : { centerX: 45,  centerY: 20,  clickArea: { x: 32,  y: 10,  w: 26,  h: 25 } },
  'es-prado-arte'             : { centerX: 85,  centerY: 20,  clickArea: { x: 74,  y: 10,  w: 22,  h: 24 } },
  'es-bernabeu-deporte'       : { centerX: 15,  centerY: 55,  clickArea: { x: 3,   y: 42,  w: 26,  h: 26 } },
  'es-teide-medioambiente'    : { centerX: 48,  centerY: 52,  clickArea: { x: 32,  y: 40,  w: 30,  h: 28 } },
  'es-america-hispano'        : { centerX: 82,  centerY: 55,  clickArea: { x: 70,  y: 42,  w: 22,  h: 26 } },
  'es-biblioteca-lectura'     : { centerX: 22,  centerY: 82,  clickArea: { x: 8,   y: 68,  w: 26,  h: 28 } },
  'es-palacio-final-test'     : { centerX: 65,  centerY: 82,  clickArea: { x: 42,  y: 65,  w: 45,  h: 32 } },
};

// 📱 إحداثيات الموبايل — الخريطة 5
const COORDS_MOBILE_MAP_5: Record<string, LandmarkCoords> = {
  'es-puertasol-fiestas'      : { centerX: 28,  centerY: 8,   clickArea: { x: 10,  y: 2,   w: 38,  h: 14 } },
  'es-palma-vacaciones'       : { centerX: 68,  centerY: 15,  clickArea: { x: 45,  y: 10,  w: 48,  h: 14 } },
  'es-prado-arte'             : { centerX: 25,  centerY: 30,  clickArea: { x: 8,   y: 25,  w: 42,  h: 12 } },
  'es-bernabeu-deporte'       : { centerX: 70,  centerY: 42,  clickArea: { x: 50,  y: 37,  w: 42,  h: 13 } },
  'es-teide-medioambiente'    : { centerX: 25,  centerY: 52,  clickArea: { x: 8,   y: 47,  w: 12,  h: 12 } },
  'es-america-hispano'        : { centerX: 70,  centerY: 62,  clickArea: { x: 48,  y: 56,  w: 46,  h: 14 } },
  'es-biblioteca-lectura'     : { centerX: 25,  centerY: 76,  clickArea: { x: 8,   y: 70,  w: 42,  h: 13 } },
  'es-palacio-final-test'     : { centerX: 55,  centerY: 92,  clickArea: { x: 25,  y: 82,  w: 62,  h: 16 } },
};

// 🗺️ تجميع بيانات الخرايط
const MAPS_DATA = {
  1: {
    landmarks: LANDMARKS_MAP_1,
    coordsDesktop: COORDS_DESKTOP_MAP_1,
    coordsMobile: COORDS_MOBILE_MAP_1,
    imageDesktop: '/spanish/maps/spanish-map-1-pc.webp',
    imageMobile: '/spanish/maps/spanish-map-1-mob.webp',
    titleAr: 'غابات الشمال',
    titleEs: 'Los Bosques del Norte',
    description: 'المرحلة الأولى: الأبجدية، الأرقام، الألوان والأساسيات',
  },
  2: {
    landmarks: LANDMARKS_MAP_2,
    coordsDesktop: COORDS_DESKTOP_MAP_2,
    coordsMobile: COORDS_MOBILE_MAP_2,
    imageDesktop: '/spanish/maps/spanish-map-2-pc.webp',
    imageMobile: '/spanish/maps/spanish-map-2-mob.webp',
    titleAr: 'قلاع قشتالة',
    titleEs: 'Castillos de Castilla',
    description: 'المرحلة الثانية: الجسم، الملابس، الطعام والمنزل',
  },
  3: {
    landmarks: LANDMARKS_MAP_3,
    coordsDesktop: COORDS_DESKTOP_MAP_3,
    coordsMobile: COORDS_MOBILE_MAP_3,
    imageDesktop: '/maps/spanish-map-3-pc.webp',
    imageMobile: '/maps/spanish-map-3-mob.webp',
    titleAr: 'سواحل المتوسط',
    titleEs: 'Costas del Mediterráneo',
    description: 'المرحلة الثالثة: الوقت، الصحة، التسوق والمواصلات',
  },
  4: {
    landmarks: LANDMARKS_MAP_4,
    coordsDesktop: COORDS_DESKTOP_MAP_4,
    coordsMobile: COORDS_MOBILE_MAP_4,
    imageDesktop: '/maps/spanish-map-4-pc.webp',
    imageMobile: '/maps/spanish-map-4-mob.webp',
    titleAr: 'أراضي الجنوب',
    titleEs: 'Tierras del Sur',
    description: 'المرحلة الرابعة: الأفعال، الطبيعة والتواصل',
  },
  5: {
    landmarks: LANDMARKS_MAP_5,
    coordsDesktop: COORDS_DESKTOP_MAP_5,
    coordsMobile: COORDS_MOBILE_MAP_5,
    imageDesktop: '/maps/spanish-map-5-pc.webp',
    imageMobile: '/maps/spanish-map-5-mob.webp',
    titleAr: 'الجزر والعاصمة',
    titleEs: 'Islas y Capital',
    description: 'المرحلة الخامسة الأخيرة: الأعياد، الثقافة وشهادة A2',
  },
};

type MapNumber = 1 | 2 | 3 | 4 | 5;
const TOTAL_MAPS_COUNT = 5;
const CURRENT_MAP_STORAGE_KEY = 'es_current_map';

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

export default function SpanishCharacterAndMapPage() {
  const router = useRouter();

  const [step, setStep] = useState<'setup' | 'map'>('setup');
  const [heroName, setHeroName] = useState('');
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [brushMode, setBrushMode] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ x: number; y: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isMobileView, setIsMobileView] = useState(false);
  const [mounted, setMounted] = useState(false);

  const getInitialMap = (): MapNumber => {
    if (typeof window === 'undefined') return 1;
    const param = new URLSearchParams(window.location.search).get('map');
    if (param) {
      const num = parseInt(param);
      if (num >= 1 && num <= 5) return num as MapNumber;
    }
    try {
      const saved = localStorage.getItem(CURRENT_MAP_STORAGE_KEY);
      if (saved) {
        const num = parseInt(saved);
        if (num >= 1 && num <= 5) return num as MapNumber;
      }
    } catch {}
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

  const mapImage = isMobileView ? currentMapData.imageMobile : currentMapData.imageDesktop;

  // 👑 حالة اشتراك المستخدم
  const [userStatus, setUserStatus] = useState({ 
    isPremium: false, 
    isSuperAdmin: false, 
    isLoggedIn: false,
    loaded: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_MAP_STORAGE_KEY, String(currentMap));
    }
  }, [currentMap]);

  useEffect(() => {
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
        setStep('map'); // 🚀 فك اللوب: توجيه مباشر للخريطة إذا كان البطل مسجلاً سابقاً
      } else {
        const savedName = localStorage.getItem('heroName');
        const savedHero = localStorage.getItem('heroType');
        if (savedName && savedHero) {
          setHeroName(savedName);
          setSelectedHero(savedHero);
          setStep('map');
        }
      }
    };

    const loadUserStatus = async () => {
      const status = await getUserPlanStatus();
      setUserStatus({ ...status, loaded: true });
    };
    
    loadPlayer();
    loadUserStatus();

    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'lesson') {
      setStep('map');
    }
    if (params.get('debug') === '1') {
      setDebugMode(true);
    }
  }, []);

  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
  const [unlockedLessonInMap, setUnlockedLessonInMap] = useState(1);

  useEffect(() => {
    const loadProgress = async () => {
      const allProgress = await getAllSpanishProgress();
      
      const map: Record<string, LessonProgress> = {};
      allProgress.forEach(p => {
        map[p.lesson_id] = p as LessonProgress;
      });
      setProgressMap(map);

      let currentMapLessons: string[];
      if (currentMap === 1) currentMapLessons = ES_MAP_1_LESSONS;
      else if (currentMap === 2) currentMapLessons = ES_MAP_2_LESSONS;
      else if (currentMap === 3) currentMapLessons = ES_MAP_3_LESSONS;
      else if (currentMap === 4) currentMapLessons = ES_MAP_4_LESSONS;
      else currentMapLessons = ES_MAP_5_LESSONS;

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
      
      setUnlockedLessonInMap(Math.min(lastUnlocked, currentMapLessons.length));

      const params = new URLSearchParams(window.location.search);
      if (params.get('from') === 'lesson') {
        const isDone = await isSpanishMapCompleted(currentMap);
        const seenTransition = localStorage.getItem(`es_seen_map_transition_${currentMap}`);
        
        if (isDone && !seenTransition && currentMap < TOTAL_MAPS_COUNT) {
          setMapCompletedFlag(currentMap);
          setTimeout(() => setShowMapTransition(true), 500);
        }
      }
    };
    
    loadProgress();
  }, [currentMap]);

  const [selectedLandmark, setSelectedLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [toroPos, setToroPos] = useState({ x: 49, y: 46 });
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const current = LANDMARKS.find(l => l.lesson === unlockedLessonInMap);
    if (current) {
      setToroPos({ x: current.centerX, y: current.centerY });
    } else if (LANDMARKS.length > 0) {
      const first = LANDMARKS[0];
      if (first) setToroPos({ x: first.centerX, y: first.centerY });
    }
  }, [unlockedLessonInMap, isMobileView, currentMap]);

  useEffect(() => {
    setMapScale(1);
    setMapPosition({ x: 0, y: 0 });
  }, [isMobileView, step, currentMap]);

  const isLocked = (lesson: number) => {
    if (!userStatus.loaded) return lesson !== 1;
    if (userStatus.isSuperAdmin) return false;

    if (userStatus.isPremium) {
      return lesson > unlockedLessonInMap;
    }

    // 🎁 حساب مجاني: أول درس فقط في أول خريطة
    if (currentMap === 1 && lesson === 1) return false;
    return true;
  };

  // 🔒 التحقق إذا كان الدرس مكتمل وعايز يفتح درس تاني بحساب مجاني
  const shouldRedirectToPlans = (landmark: typeof LANDMARKS[0]) => {
    if (userStatus.isSuperAdmin) return false;
    if (userStatus.isPremium) return false;
    if (!userStatus.loaded) return false;
    
    // لو مش أول درس في أول خريطة → حوله للدفع
    if (currentMap !== 1 || landmark.lesson !== 1) return true;
    return false;
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
        setStep('map');
      } else {
        setIsSaving(false);
        alert('حصلت مشكلة في حفظ البيانات، حاول تاني!');
      }
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
      if (shouldRedirectToPlans(landmark)) {
        setTimeout(() => router.push('/plans'), 200);
      }
      return;
    }
    // 🎁 لو حساب مجاني وخلص الدرس الأول وبيحاول يفتح أي درس تاني
    if (shouldRedirectToPlans(landmark)) {
      playLockedSound();
      setTimeout(() => router.push('/plans'), 200);
      return;
    }
    playClickSound();
    setToroPos({ x: landmark.centerX, y: landmark.centerY });
    setTimeout(() => setSelectedLandmark(landmark), 300);
  };
  const handleLandmarkStart = () => {
    if (!selectedLandmark) return;
    try {
      localStorage.setItem(CURRENT_MAP_STORAGE_KEY, String(currentMap));
    } catch {}
    router.push(selectedLandmark.route);
  };

  const handleGoToNextMap = () => {
    playSuccessSound();
    localStorage.setItem(`es_seen_map_transition_${currentMap}`, '1');
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

  const heroes = [
    { id: 'boy', name: 'البطل الشجاع', color: '#4CC9F0', img: '/characters/boy-3d.webp' },
    { id: 'girl', name: 'البطلة العبقرية', color: '#F72585', img: '/characters/girl-3d.webp' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#07090D] text-white pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#DC2626]/15 to-transparent blur-[140px] pointer-events-none" />

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-6 relative z-10 mt-4 space-y-16">
          <header className="flex justify-between items-center py-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <ArrowLeft size={14} /> العودة للرئيسية
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-yellow-500/30 rounded-full">
              <span className="text-lg">🇪🇸</span>
              <span className="text-xs font-black text-yellow-300">اللغة الإسبانية</span>
            </div>
          </header>

          <input
            type="text"
            value={heroName}
            onChange={e => setHeroName(e.target.value)}
            placeholder="...اكتب اسمك الشجاع هنا"
            className="w-full max-w-lg mx-auto block bg-transparent border-b-2 border-white/20 focus:border-[#DC2626] text-center font-black text-2xl py-4 outline-none transition-all placeholder:text-white/20"
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
              className="group relative px-12 py-5 bg-gradient-to-r from-[#DC2626] to-[#FFD700] rounded-full font-black text-2xl flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              {isSaving ? 'جاري الحفظ...' : '¡Vamos! ابدأ رحلتك'}
              {!isSaving && <Sparkles className="text-white group-hover:rotate-12 transition-transform" />}
            </motion.button>
          </div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>

      {debugMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 flex items-center justify-between text-xs font-black">
          <span>🐛 [{isMobileView ? '📱 MOBILE' : '🖥️ DESKTOP'}] [ES MAP {currentMap}] اضغط على الخريطة لمعرفة الإحداثيات</span>
          {clickedCoords && (
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-lg font-mono">
              X: {clickedCoords.x}% | Y: {clickedCoords.y}%
            </span>
          )}
        </div>
      )}

      <div 
        className="fixed left-0 right-0 z-30 flex items-center justify-between"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(7,9,13,0.95), transparent)', 
          top: debugMode ? '32px' : '0',
          padding: 'clamp(8px, 1.5vw, 16px) clamp(10px, 2vw, 20px)',
          gap: 'clamp(6px, 1vw, 12px)',
        }}>
        {/* 👋 الجهة اليمين: اسم البطل */}
        <div className="flex items-center" style={{ gap: 'clamp(4px, 0.8vw, 8px)' }}>
          <div 
            className="flex items-center bg-black/40 border border-white/10 rounded-2xl"
            style={{
              gap: 'clamp(4px, 0.6vw, 8px)',
              padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)',
            }}
          >
            <span className="text-sm">🇪🇸</span>
            <div 
              className="font-black text-white whitespace-nowrap"
              style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}
            >
              👋 {heroName}
            </div>
          </div>
        </div>

        {/* 🎯 الوسط: سهمين للتنقل بين الخرايط + مؤشر المرحلة */}
        <div className="flex items-center" style={{ gap: 'clamp(4px, 0.8vw, 8px)' }}>
          {/* ⬅️ سهم شمال (المرحلة السابقة) */}
          <motion.button
            whileHover={{ scale: currentMap > 1 ? 1.1 : 1 }}
            whileTap={{ scale: currentMap > 1 ? 0.9 : 1 }}
            onClick={handleGoToPreviousMap}
            disabled={currentMap <= 1}
            className={`flex items-center justify-center rounded-2xl border-2 transition-all ${
              currentMap > 1
                ? 'bg-red-500/20 hover:bg-red-500/40 border-red-400/50 text-red-200 cursor-pointer shadow-lg shadow-red-500/20'
                : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
            }`}
            style={{
              width: 'clamp(32px, 4.5vw, 48px)',
              height: 'clamp(32px, 4.5vw, 48px)',
            }}
            title="المرحلة السابقة">
            <ChevronRight 
              strokeWidth={3} 
              style={{ width: 'clamp(14px, 1.8vw, 20px)', height: 'clamp(14px, 1.8vw, 20px)' }} 
            />
          </motion.button>

          {/* 🗺️ مؤشر رقم المرحلة */}
          <motion.div 
            key={currentMap}
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center bg-gradient-to-r from-red-500/30 to-yellow-500/30 border border-yellow-400/40 rounded-2xl"
            style={{
              gap: 'clamp(4px, 0.6vw, 8px)',
              padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)',
              height: 'clamp(32px, 4.5vw, 48px)',
            }}
          >
            <MapIcon 
              className="text-yellow-300" 
              style={{ width: 'clamp(12px, 1.4vw, 16px)', height: 'clamp(12px, 1.4vw, 16px)' }}
            />
            <span 
              className="font-black text-white whitespace-nowrap"
              style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}
            >
              {currentMap}/{TOTAL_MAPS_COUNT}
            </span>
          </motion.div>

          {/* ➡️ سهم يمين (المرحلة التالية) */}
          <motion.button
            whileHover={{ scale: currentMap < TOTAL_MAPS_COUNT ? 1.1 : 1 }}
            whileTap={{ scale: currentMap < TOTAL_MAPS_COUNT ? 0.9 : 1 }}
            onClick={() => {
              if (currentMap < TOTAL_MAPS_COUNT) {
                playClickSound();
                setCurrentMap(prev => (prev + 1) as MapNumber);
              }
            }}
            disabled={currentMap >= TOTAL_MAPS_COUNT}
            className={`flex items-center justify-center rounded-2xl border-2 transition-all ${
              currentMap < TOTAL_MAPS_COUNT
                ? 'bg-red-500/20 hover:bg-red-500/40 border-red-400/50 text-red-200 cursor-pointer shadow-lg shadow-red-500/20'
                : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
            }`}
            style={{
              width: 'clamp(32px, 4.5vw, 48px)',
              height: 'clamp(32px, 4.5vw, 48px)',
            }}
            title="المرحلة التالية">
            <ChevronRight 
              strokeWidth={3} 
              style={{ 
                width: 'clamp(14px, 1.8vw, 20px)', 
                height: 'clamp(14px, 1.8vw, 20px)',
                transform: 'rotate(180deg)' 
              }} 
            />
          </motion.button>
        </div>

        {/* 📊 الجهة الشمال: زرار الريست + التقدم */}
        <div className="flex items-center" style={{ gap: 'clamp(4px, 0.8vw, 8px)' }}>
          {!isMobileView && (
            <AnimatePresence>
              {(mapPosition.x !== 0 || mapPosition.y !== 0 || mapScale !== 1) && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={resetMapView}
                  className="flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-2xl font-bold text-yellow-400 transition-all"
                  style={{
                    fontSize: 'clamp(10px, 1.1vw, 12px)',
                    padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)',
                  }}
                  title="إعادة ضبط العرض">
                  🔄
                </motion.button>
              )}
            </AnimatePresence>
          )}

          <div 
            className="flex items-center bg-black/40 border border-white/10 rounded-2xl"
            style={{
              gap: 'clamp(4px, 0.6vw, 8px)',
              padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)',
            }}
          >
            <div className="text-right">
              <div 
                className="text-white/50 font-bold"
                style={{ fontSize: 'clamp(8px, 0.9vw, 11px)' }}
              >
                تقدمك
              </div>
              <div 
                className="font-black text-[#FFD700] whitespace-nowrap"
                style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}
              >
                {LANDMARKS.length > 0 
                  ? `${LANDMARKS.filter(l => l.lesson < unlockedLessonInMap).length} / ${LANDMARKS.length}`
                  : '0 / 0'}
              </div>
            </div>
            <div style={{ fontSize: 'clamp(14px, 1.6vw, 20px)' }}>🗺️</div>
          </div>
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
                        <div className="text-white/85 text-[10px] font-bold text-center mt-0.5">{landmark.nameEs}</div>
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

          {LANDMARKS.length > 0 && (
            <motion.div
              className="absolute pointer-events-none"
              style={{ zIndex: 25 }}
              animate={{
                left: `${toroPos.x}%`,
                top: `${toroPos.y - 6}%`,
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 14, duration: 2 }}
            >
              <motion.div
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src="/spanish/characters/toro.webp"
                  alt="Toro the Bull"
                  style={{
                    width: 'clamp(35px, 3.5vw, 55px)',
                    height: 'clamp(35px, 3.5vw, 55px)',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 10px rgba(220,38,38,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  }}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          )}
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
                <p className="text-sm font-bold" style={{ color: selectedLandmark.color, direction: 'ltr' }}>{selectedLandmark.nameEs}</p>
              </div>
              <div className="p-6">
                <div className="flex gap-3 bg-white/5 rounded-2xl p-4 mb-5">
                  <img src="/spanish/characters/toro.webp" alt="Toro" className="w-10 h-10 object-contain flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white/50 mb-1">Toro الثور يقول:</div>
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
                    if (!lessonData) return '¡Vamos! ابدأ المغامرة 🚀';
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
        {showMapTransition && currentMap < TOTAL_MAPS_COUNT && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: '110%',
                    opacity: 0,
                  }}
                  animate={{ 
                    y: '-10%',
                    opacity: [0, 1, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: 'linear',
                  }}
                >
                  {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ 
                background: 'linear-gradient(180deg, #1a0a2e 0%, #0a0510 100%)', 
                border: '3px solid #FFD700',
                boxShadow: '0 0 60px rgba(255,215,0,0.4), 0 20px 60px rgba(0,0,0,0.8)',
              }}
            >
              <div className="relative pt-8 pb-6 text-center overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,215,0,0.2) 0%, transparent 100%)',
                }}>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-block relative"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{ background: 'radial-gradient(circle, #FFD700, transparent 70%)' }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div 
                    className="relative w-28 h-28 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
                      boxShadow: '0 10px 30px rgba(255,215,0,0.5), inset 0 4px 0 rgba(255,255,255,0.3)',
                    }}
                  >
                    <Trophy size={56} className="text-white" strokeWidth={2.5} 
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4"
                >
                  <h2 className="text-3xl font-black text-white mb-1">¡Felicidades!</h2>
                  <p className="text-lg font-black text-yellow-300">🎉 مبروك يا بطل! 🎉</p>
                  <p className="text-sm font-bold text-white/70 mt-2">
                    خلّصت {currentMapData.titleAr} بنجاح!
                  </p>
                </motion.div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-3 bg-white/5 rounded-2xl p-3 border border-white/10"
                >
                  <img 
                    src="/spanish/characters/toro.webp" 
                    alt="Toro" 
                    className="w-12 h-12 object-contain flex-shrink-0" 
                  />
                  <div>
                    <div className="text-xs font-bold text-[#DC2626] mb-1">Toro الثور يقول:</div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      &quot;¡Vamos a la siguiente aventura! يلا نخش على {MAPS_DATA[(currentMap + 1) as MapNumber]?.titleAr}! 🚀&quot;
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="bg-white/5 rounded-2xl p-4 text-center border border-yellow-400/30">
                    <Trophy size={28} className="text-yellow-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-white">
                      {LANDMARKS.filter(l => progressMap[l.id]?.completed).length}
                    </div>
                    <div className="text-[10px] text-white/60 font-bold">معالم</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center border border-yellow-400/30">
                    <Star size={28} className="text-yellow-400 mx-auto mb-1" fill="#FFD700" />
                    <div className="text-2xl font-black text-white">
                      {LANDMARKS.reduce((sum, l) => sum + (progressMap[l.id]?.stars ?? 0), 0)}
                    </div>
                    <div className="text-[10px] text-white/60 font-bold">نجوم</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2 pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGoToNextMap}
                    className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #DC2626, #FFD700)', 
                      boxShadow: '0 8px 25px rgba(220,38,38,0.5)',
                      borderBottom: '4px solid #991B1B',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="relative">
                      ابدأ المرحلة {currentMap + 1} 🚀
                    </span>
                    <ChevronRight size={20} className="relative" />
                  </motion.button>

                  <button
                    onClick={() => setShowMapTransition(false)}
                    className="w-full py-3 rounded-2xl font-bold text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
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
                <motion.img src="/spanish/characters/toro.webp" alt="Toro" className="w-9 h-9 object-contain flex-shrink-0"
                  animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1, repeat: 2 }} />
                <div className="flex-1 text-right">
                  <div className="text-[10px] font-bold text-[#DC2626]">Toro الثور</div>
                  <p className="text-[11px] text-white/80 leading-tight font-medium">
                    ¡Hola <strong className="text-white">{heroName}</strong>! {isMobileView ? 'اضغط على المعالم لتبدأ' : 'اسحب الخريطة وكبّر بالعجلة 🖱️'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowIntro(false)}
                className="w-full mt-2 py-1.5 rounded-lg font-black text-[11px] text-white"
                style={{ background: 'linear-gradient(135deg, #DC2626, #FFD700)' }}>
                ¡Entendido! 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
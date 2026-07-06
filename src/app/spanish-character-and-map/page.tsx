'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Star, ChevronRight, X, Trophy, Map as MapIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  savePlayer, 
  getPlayer, 
  type LessonProgress 
} from '@/lib/playerData';
import {
  getAllSpanishProgress,
  isSpanishMapCompleted,
  ES_MAP_1_LESSONS,
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

// ═══════════════════════════════════════
// 🎯 نوع الإحداثيات
// ═══════════════════════════════════════
type LandmarkCoords = {
  centerX: number;
  centerY: number;
  clickArea: { x: number; y: number; w: number; h: number };
};

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 1
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 1
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 2
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 2
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 3
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 3
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 4
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 4
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب — الخريطة 5 (Islas y Capital)
// (بناءً على الصورة - عدلها بأداة الفرشاة ?brush=1 لدقة أكتر)
// ═══════════════════════════════════════
const COORDS_DESKTOP_MAP_5: Record<string, LandmarkCoords> = {
  'es-puertasol-fiestas'      : { centerX: 15,  centerY: 22,  clickArea: { x: 5,   y: 8,   w: 22,  h: 30 } },  // 🕛 برج الساعة - يسار فوق
  'es-palma-vacaciones'       : { centerX: 45,  centerY: 20,  clickArea: { x: 32,  y: 10,  w: 26,  h: 25 } },  // 🏖️ الشاطئ - وسط فوق
  'es-prado-arte'             : { centerX: 85,  centerY: 20,  clickArea: { x: 74,  y: 10,  w: 22,  h: 24 } },  // 🖼️ متحف برادو - يمين فوق
  'es-bernabeu-deporte'       : { centerX: 15,  centerY: 55,  clickArea: { x: 3,   y: 42,  w: 26,  h: 26 } },  // ⚽ الاستاد - يسار وسط
  'es-teide-medioambiente'    : { centerX: 48,  centerY: 52,  clickArea: { x: 32,  y: 40,  w: 30,  h: 28 } },  // 🌋 البركان - وسط
  'es-america-hispano'        : { centerX: 82,  centerY: 55,  clickArea: { x: 70,  y: 42,  w: 22,  h: 26 } },  // 🌍 قصر أمريكا - يمين وسط
  'es-biblioteca-lectura'     : { centerX: 22,  centerY: 82,  clickArea: { x: 8,   y: 68,  w: 26,  h: 28 } },  // 📚 المكتبة - يسار تحت
  'es-palacio-final-test'     : { centerX: 65,  centerY: 82,  clickArea: { x: 42,  y: 65,  w: 45,  h: 32 } },  // 👑 القصر الملكي - وسط تحت (الأكبر)
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل — الخريطة 5 (Islas y Capital)
// (بناءً على الصورة - عدلها بأداة الفرشاة ?brush=1 لدقة أكتر)
// ═══════════════════════════════════════
const COORDS_MOBILE_MAP_5: Record<string, LandmarkCoords> = {
  'es-puertasol-fiestas'      : { centerX: 28,  centerY: 8,   clickArea: { x: 10,  y: 2,   w: 38,  h: 14 } },  // 🕛 فوق يسار
  'es-palma-vacaciones'       : { centerX: 68,  centerY: 15,  clickArea: { x: 45,  y: 10,  w: 48,  h: 14 } },  // 🏖️ فوق يمين
  'es-prado-arte'             : { centerX: 25,  centerY: 30,  clickArea: { x: 8,   y: 25,  w: 42,  h: 12 } },  // 🖼️ يسار
  'es-bernabeu-deporte'       : { centerX: 70,  centerY: 42,  clickArea: { x: 50,  y: 37,  w: 42,  h: 13 } },  // ⚽ يمين
  'es-teide-medioambiente'    : { centerX: 25,  centerY: 52,  clickArea: { x: 8,   y: 47,  w: 42,  h: 12 } },  // 🌋 يسار
  'es-america-hispano'        : { centerX: 70,  centerY: 62,  clickArea: { x: 48,  y: 56,  w: 46,  h: 14 } },  // 🌍 يمين
  'es-biblioteca-lectura'     : { centerX: 25,  centerY: 76,  clickArea: { x: 8,   y: 70,  w: 42,  h: 13 } },  // 📚 يسار
  'es-palacio-final-test'     : { centerX: 55,  centerY: 92,  clickArea: { x: 25,  y: 82,  w: 62,  h: 16 } },  // 👑 تحت وسط (الأكبر)
};

// ═══════════════════════════════════════
// 🎨 placeholders (لو محتجناها لاحقاً)
// ═══════════════════════════════════════
const COORDS_DESKTOP_EMPTY: Record<string, LandmarkCoords> = {};
const COORDS_MOBILE_EMPTY: Record<string, LandmarkCoords> = {};

// ═══════════════════════════════════════
// 🗺️ تجميع بيانات الخرايط
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🆕 مفتاح الـ localStorage لحفظ الخريطة الحالية
// ═══════════════════════════════════════
const CURRENT_MAP_STORAGE_KEY = 'es_current_map';

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

  const storageKeyDesktop = `spanishBrushTool_map${mapNumber}_desktop_v1`;
  const storageKeyMobile = `spanishBrushTool_map${mapNumber}_mobile_v1`;

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
          <button onClick={() => window.location.href = '/spanish-character-and-map'}
            className="mt-4 px-6 py-2 bg-white/10 rounded-lg font-bold">
            رجوع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <div className="bg-gradient-to-r from-red-900 to-yellow-900 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-black text-lg">🎨 أداة الفرشاة الأسبانية — الخريطة {mapNumber}</h1>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('desktop')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'desktop' ? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>🖥️ Desktop</button>
          <button onClick={() => setViewMode('mobile')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'mobile' ? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>📱 Mobile</button>
          <button onClick={() => window.location.href = `/spanish-character-and-map?map=${mapNumber}`} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/30 hover:bg-red-500/50">✕ خروج</button>
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
export default function SpanishCharacterAndMapPage() {
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

  const getInitialMap = (): MapNumber => {
    if (typeof window === 'undefined') return 1;
    
    const param = new URLSearchParams(window.location.search).get('map');
    if (param === '1') return 1;
    if (param === '2') return 2;
    if (param === '3') return 3;
    if (param === '4') return 4;
    if (param === '5') return 5;
    
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CURRENT_MAP_STORAGE_KEY, String(currentMap));
        console.log(`💾 [ES] تم حفظ الخريطة الحالية: ${currentMap}`);
      } catch {}
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
      else {
        currentMapLessons = MAPS_DATA[currentMap].landmarks.map(l => l.id);
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
      
      setUnlockedLessonInMap(Math.min(lastUnlocked, currentMapLessons.length));
      
      console.log('🗺️ [ES] التقدم المحمّل:', map);
      console.log('🔓 [ES] آخر درس مفتوح في الخريطة', currentMap, ':', lastUnlocked);

      const params = new URLSearchParams(window.location.search);
      if (params.get('from') === 'lesson') {
        const isDone = await isSpanishMapCompleted(currentMap);
        const seenTransition = localStorage.getItem(`es_seen_map_transition_${currentMap}`);
        
        if (isDone && !seenTransition && currentMap < TOTAL_MAPS_COUNT) {
          console.log(`🎉 [ES] الخريطة ${currentMap} مكتملة! هيظهر modal الانتقال للخريطة ${currentMap + 1}`);
          setMapCompletedFlag(currentMap);
          setTimeout(() => setShowMapTransition(true), 500);
        }
      }
    };
    
    loadProgress();
  }, [currentMap]);

  const [videoStarted, setVideoStarted] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [toroPos, setToroPos] = useState({ x: 49, y: 46 });
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const heroes = [
    { id: 'boy', name: 'البطل الشجاع', color: '#4CC9F0', img: '/characters/boy-3d.png' },
    { id: 'girl', name: 'البطلة العبقرية', color: '#F72585', img: '/characters/girl-3d.png' },
  ];

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

  const isLocked = (lesson: number) => false;
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
    console.log(`📍 [${isMobileView ? '📱 MOBILE' : '🖥️ DESKTOP'}] [ES MAP ${currentMap}] Clicked at: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`);
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

  if (step === 'video') {
    handleVideoEnd();
    return null;
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
              className="flex items-center gap-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/40 rounded-2xl px-3 py-2 text-xs md:text-sm font-bold text-yellow-300 transition-all"
              title="الخريطة السابقة">
              <MapIcon size={14} /> سابقة
            </motion.button>
          )}

          {currentMap < TOTAL_MAPS_COUNT && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowMapTransition}
              className="flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs md:text-sm font-bold text-white transition-all relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #DC2626, #FFD700)',
                boxShadow: '0 4px 15px rgba(220,38,38,0.4)',
                border: '1px solid rgba(255,215,0,0.5)',
              }}
              title={`الانتقال للمرحلة ${currentMap + 1}`}>
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative">المرحلة {currentMap + 1}</span>
              <MapIcon size={14} className="relative" />
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
            <span className="text-sm">🇪🇸</span>
            <div className="text-xs md:text-sm font-black text-white">👋 {heroName}</div>
          </div>

          <motion.div 
            key={currentMap}
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-red-500/30 to-yellow-500/30 border border-yellow-400/40 rounded-2xl px-3 py-2">
            <MapIcon size={14} className="text-yellow-300" />
            <span className="text-xs font-black text-white">المرحلة {currentMap}/{TOTAL_MAPS_COUNT}</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-3 py-2">
          <div className="text-right">
            <div className="text-[10px] md:text-xs text-white/50 font-bold">تقدمك</div>
            <div className="text-xs md:text-sm font-black text-[#FFD700]">
              {LANDMARKS.length > 0 
                ? `${LANDMARKS.filter(l => l.lesson < unlockedLessonInMap).length} / ${LANDMARKS.length}`
                : '0 / 0'}
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

          {LANDMARKS.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center text-white px-6 max-w-md">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-black mb-2">قريباً جداً!</h3>
                <p className="text-white/70 text-sm font-bold mb-6">
                  المرحلة {currentMap} ({currentMapData.titleAr}) قيد التطوير
                </p>
                {currentMap > 1 && (
                  <button onClick={handleGoToPreviousMap}
                    className="px-6 py-3 bg-yellow-500 text-black rounded-2xl font-black">
                    ← العودة للمرحلة السابقة
                  </button>
                )}
              </div>
            </div>
          )}

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
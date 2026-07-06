import { supabase } from './supabase';
import { getDeviceId } from './playerData';

// ═══════════════════════════════════════
// 📝 نوع تقدم الدرس الأسباني
// ═══════════════════════════════════════
export interface SpanishLessonProgress {
  id?: string;
  device_id: string;
  lesson_id: string;
  stars: number;
  completed: boolean;
  completed_at?: string;
  updated_at?: string;
  current_group?: number;
  current_letter?: number;
  current_phase?: string;
}

// ═══════════════════════════════════════
// 🗺️ نظام الخرايط الأسبانية
// ═══════════════════════════════════════

// 🌲 الخريطة 1: غابات الشمال الأسباني (Los Bosques del Norte)
// المنطقة: Galicia, Asturias, Cantabria, País Vasco
// المستوى CEFR: Pre-A1
export const ES_MAP_1_LESSONS = [
  'es-muniellos-alphabet',      // 1️⃣ الأبجدية - Bosque de Muniellos
  'es-covadonga-numbers',       // 2️⃣ الأرقام - Lagos de Covadonga
  'es-catedrales-colors',       // 3️⃣ الألوان - Playa de las Catedrales
  'es-horreo-family',           // 4️⃣ العائلة - Hórreo Gallego
  'es-ribera-fruits',           // 5️⃣ الفواكه والخضروات - Mercado de la Ribera
  'es-somiedo-animals',         // 6️⃣ الحيوانات - Parque de Somiedo
  'es-guggenheim-greetings',    // 7️⃣ التحيات - Museo Guggenheim Bilbao
  'es-faro-test',               // 8️⃣ اختبار الشمال - Faro de la Isla Pancha
];

// 🏰 الخريطة 2: قلاع قشتالة (Castillos de Castilla)
// المنطقة: Castilla y León, Castilla-La Mancha
// المستوى CEFR: A1.1
export const ES_MAP_2_LESSONS = [
  'es-segovia-body',            // 1️⃣ الجسم - Castillo de Segovia
  'es-traje-clothes',           // 2️⃣ الملابس - Museo del Traje
  'es-candido-food',            // 3️⃣ الطعام - Mesón de Cándido
  'es-salamanca-school',        // 4️⃣ المدرسة - Universidad de Salamanca
  'es-cuenca-house',            // 5️⃣ المنزل - Casas Colgadas
  'es-greco-feelings',          // 6️⃣ المشاعر - Museo del Greco
  'es-mayor-games',             // 7️⃣ الألعاب والوقت - Plaza Mayor Salamanca
  'es-consuegra-test',          // 8️⃣ اختبار قشتالة - Molinos de Don Quijote
];

// 🌊 الخريطة 3: سواحل المتوسط (Costas del Mediterráneo)
// المنطقة: Cataluña, Valencia, Murcia
// المستوى CEFR: A1.2
export const ES_MAP_3_LESSONS = [
  'es-portvell-time',           // 1️⃣ الوقت - Torre del Reloj Port Vell
  'es-santpau-health',          // 2️⃣ الصحة - Hospital Sant Pau
  'es-campnou-sports',          // 3️⃣ الرياضة - Camp Nou
  'es-boqueria-shopping',       // 4️⃣ التسوق - Mercado de La Boquería
  'es-metrovalencia-transport', // 5️⃣ المواصلات - Metro de Valencia
  'es-ciencias-countries',      // 6️⃣ الدول والجنسيات - Ciudad de las Artes
  'es-dali-art',                // 7️⃣ الفن - Museo Dalí
  'es-sagrada-test',            // 8️⃣ اختبار المتوسط - Sagrada Familia
];

// 🌅 الخريطة 4: أراضي الجنوب (Tierras del Sur)
// المنطقة: Andalucía, Extremadura
// المستوى CEFR: A2.1
export const ES_MAP_4_LESSONS = [
  'es-sevilla-verbs-regular',   // 1️⃣ الأفعال المنتظمة - Universidad de Sevilla
  'es-merida-verbs-irregular',  // 2️⃣ الأفعال الشاذة - Teatro Romano de Mérida
  'es-donana-nature',           // 3️⃣ الطبيعة - Parque Nacional de Doñana
  'es-malaga-entertainment',    // 4️⃣ الترفيه - Festival de Cine de Málaga
  'es-triana-recipes',          // 5️⃣ الوصفات - Triana
  'es-correos-communication',   // 6️⃣ التواصل - Real Casa de Correos
  'es-mezquita-places',         // 7️⃣ وصف الأماكن - Mezquita de Córdoba
  'es-alhambra-test',           // 8️⃣ اختبار الجنوب - La Alhambra
];

// ✈️ الخريطة 5: الجزر والعاصمة (Islas y Capital)
// المنطقة: Madrid, Baleares, Canarias
// المستوى CEFR: A2.2
export const ES_MAP_5_LESSONS = [
  'es-puertasol-fiestas',       // 1️⃣ الأعياد - Puerta del Sol
  'es-palma-vacaciones',        // 2️⃣ الإجازات - Playa de Palma
  'es-prado-arte',              // 3️⃣ الفن والثقافة - Museo del Prado
  'es-bernabeu-deporte',        // 4️⃣ الرياضة المحترفة - Estadio Bernabéu
  'es-teide-medioambiente',     // 5️⃣ البيئة - Teide Tenerife
  'es-america-hispano',         // 6️⃣ العالم الناطق بالأسبانية - Casa de América
  'es-biblioteca-lectura',      // 7️⃣ القراءة والكتابة - Biblioteca Nacional
  'es-palacio-final-test',      // 8️⃣ الاختبار النهائي - Palacio Real
];

// 🗺️ كل الدروس الأسبانية مرتبة
export const ES_LESSON_ORDER = [
  ...ES_MAP_1_LESSONS,
  ...ES_MAP_2_LESSONS,
  ...ES_MAP_3_LESSONS,
  ...ES_MAP_4_LESSONS,
  ...ES_MAP_5_LESSONS,
];

// 🗺️ عدد الخرايط الأسبانية
export const ES_TOTAL_MAPS = 5;

// 🗺️ Helper: جلب دروس خريطة أسبانية معينة
export function getSpanishMapLessons(mapNumber: number): string[] {
  switch (mapNumber) {
    case 1: return ES_MAP_1_LESSONS;
    case 2: return ES_MAP_2_LESSONS;
    case 3: return ES_MAP_3_LESSONS;
    case 4: return ES_MAP_4_LESSONS;
    case 5: return ES_MAP_5_LESSONS;
    default: return [];
  }
}

// ═══════════════════════════════════════
// 🆕 حفظ تقدم درس أسباني
// ═══════════════════════════════════════
export async function saveSpanishLessonProgress(
  lessonId: string,
  stars: number,
  completed: boolean = true,
  position?: {
    current_group?: number;
    current_letter?: number;
    current_phase?: string;
  }
): Promise<SpanishLessonProgress | null> {
  const deviceId = getDeviceId();

  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('device_id', deviceId)
    .eq('lesson_id', lessonId)
    .single();

  if (existing) {
    const newStars = Math.max(existing.stars, stars);
    
    const updateData: any = {
      stars: newStars,
      completed: completed || existing.completed,
      completed_at: completed ? new Date().toISOString() : existing.completed_at,
      updated_at: new Date().toISOString(),
    };

    if (position) {
      if (position.current_group !== undefined) updateData.current_group = position.current_group;
      if (position.current_letter !== undefined) updateData.current_letter = position.current_letter;
      if (position.current_phase !== undefined) updateData.current_phase = position.current_phase;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .update(updateData)
      .eq('device_id', deviceId)
      .eq('lesson_id', lessonId)
      .select()
      .single();

    if (error) {
      console.error('❌ خطأ في تحديث تقدم الدرس الأسباني:', error);
      return null;
    }
    console.log(`✅ [ES] تم تحديث تقدم ${lessonId}:`, data);
    return data;
  }

  const insertData: any = {
    device_id: deviceId,
    lesson_id: lessonId,
    stars,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  };

  if (position) {
    if (position.current_group !== undefined) insertData.current_group = position.current_group;
    if (position.current_letter !== undefined) insertData.current_letter = position.current_letter;
    if (position.current_phase !== undefined) insertData.current_phase = position.current_phase;
  }

  const { data, error } = await supabase
    .from('lesson_progress')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('❌ خطأ في حفظ تقدم الدرس الأسباني:', error);
    return null;
  }
  console.log(`✅ [ES] تم حفظ تقدم ${lessonId}:`, data);
  return data;
}

// ═══════════════════════════════════════
// 📥 جلب تقدم درس أسباني واحد
// ═══════════════════════════════════════
export async function getSpanishLessonProgress(lessonId: string): Promise<SpanishLessonProgress | null> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('device_id', deviceId)
    .eq('lesson_id', lessonId)
    .single();

  if (error) return null;
  return data;
}

// ═══════════════════════════════════════
// 📥 جلب كل تقدم اللاعب في الأسباني
// ═══════════════════════════════════════
export async function getAllSpanishProgress(): Promise<SpanishLessonProgress[]> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('device_id', deviceId)
    .like('lesson_id', 'es-%'); // 🔑 فلتر للأسباني فقط!

  if (error) {
    console.error('❌ خطأ في جلب تقدم الأسباني:', error);
    return [];
  }

  return data || [];
}

// ═══════════════════════════════════════
// 🔒 التحقق إذا كان درس أسباني مفتوح
// ═══════════════════════════════════════
export async function isSpanishLessonUnlocked(lessonId: string): Promise<boolean> {
  const lessonIndex = ES_LESSON_ORDER.indexOf(lessonId);
  if (lessonIndex === 0) return true;
  if (lessonIndex === -1) return false;

  const previousLesson = ES_LESSON_ORDER[lessonIndex - 1];
  const previousProgress = await getSpanishLessonProgress(previousLesson);
  
  return previousProgress?.completed === true;
}

// ═══════════════════════════════════════
// 🗺️ التحقق إذا كانت خريطة أسبانية مكتملة
// ═══════════════════════════════════════
export async function isSpanishMapCompleted(mapNumber: number): Promise<boolean> {
  const mapLessons = getSpanishMapLessons(mapNumber);
  if (mapLessons.length === 0) return false;

  const allProgress = await getAllSpanishProgress();
  const completedSet = new Set(
    allProgress.filter(p => p.completed).map(p => p.lesson_id)
  );

  return mapLessons.every(lessonId => completedSet.has(lessonId));
}

// ═══════════════════════════════════════
// 🗺️ معرفة الخريطة الأسبانية الحالية
// ═══════════════════════════════════════
export async function getCurrentSpanishMap(): Promise<number> {
  const allProgress = await getAllSpanishProgress();
  const completedSet = new Set(
    allProgress.filter(p => p.completed).map(p => p.lesson_id)
  );

  for (let mapNum = 1; mapNum <= ES_TOTAL_MAPS; mapNum++) {
    const mapLessons = getSpanishMapLessons(mapNum);
    const allMapCompleted = mapLessons.every(id => completedSet.has(id));
    
    if (!allMapCompleted) return mapNum;
  }

  return ES_TOTAL_MAPS;
}

// ═══════════════════════════════════════
// 🗺️ حساب نجوم خريطة أسبانية
// ═══════════════════════════════════════
export async function getSpanishMapStars(mapNumber: number): Promise<{ earned: number; total: number }> {
  const mapLessons = getSpanishMapLessons(mapNumber);
  const allProgress = await getAllSpanishProgress();
  
  let earned = 0;
  const total = mapLessons.length * 3;

  for (const lessonId of mapLessons) {
    const progress = allProgress.find(p => p.lesson_id === lessonId);
    if (progress) earned += progress.stars;
  }

  return { earned, total };
}

// ═══════════════════════════════════════
// 🗺️ التحقق إذا كانت خريطة أسبانية مفتوحة
// ═══════════════════════════════════════
export async function isSpanishMapUnlocked(mapNumber: number): Promise<boolean> {
  if (mapNumber === 1) return true;
  return await isSpanishMapCompleted(mapNumber - 1);
}
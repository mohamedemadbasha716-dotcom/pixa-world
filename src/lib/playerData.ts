import { supabase } from './supabase';

// 🔑 توليد device_id فريد للجهاز
export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

// 📝 نوع بيانات اللاعب
export interface Player {
  id?: string;
  hero_name: string;
  hero_type: string;
  current_lesson?: number;
  total_stars?: number;
  xp?: number;
  device_id: string;
}

// 📝 نوع تقدم الدرس
export interface LessonProgress {
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

// 🗺️ ترتيب المعالم (للقفل التلقائي)
export const LESSON_ORDER = [
  'hamburg',        // 1️⃣ الحروف
  'cologne',        // 2️⃣ الأرقام
  'center',         // 3️⃣ الغابة
  'berlin',         // 4️⃣ العائلة
  'lake',           // 5️⃣ البحيرة
  'neuschwanstein', // 6️⃣ القلعة
];

// ═══════════════════════════════════════
// 💾 حفظ أو تحديث بيانات اللاعب
// ═══════════════════════════════════════
export async function savePlayer(heroName: string, heroType: string): Promise<Player | null> {
  const deviceId = getDeviceId();
  
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (existingPlayer) {
    const { data, error } = await supabase
      .from('players')
      .update({ hero_name: heroName, hero_type: heroType })
      .eq('device_id', deviceId)
      .select()
      .single();
    
    if (error) {
      console.error('❌ خطأ في تحديث اللاعب:', error);
      return null;
    }
    console.log('✅ تم تحديث اللاعب:', data);
    return data;
  } else {
    const { data, error } = await supabase
      .from('players')
      .insert({
        hero_name: heroName,
        hero_type: heroType,
        device_id: deviceId,
        current_lesson: 1,
        total_stars: 0,
        xp: 0,
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ خطأ في إضافة اللاعب:', error);
      return null;
    }
    console.log('✅ تم إضافة لاعب جديد:', data);
    return data;
  }
}

// ═══════════════════════════════════════
// 📥 جلب بيانات اللاعب
// ═══════════════════════════════════════
export async function getPlayer(): Promise<Player | null> {
  const deviceId = getDeviceId();
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('device_id', deviceId)
    .single();
  
  if (error) {
    console.log('⚠️ لا يوجد لاعب محفوظ:', error.message);
    return null;
  }
  
  return data;
}

// ═══════════════════════════════════════
// 🔄 تحديث تقدم اللاعب (إجمالي)
// ═══════════════════════════════════════
export async function updatePlayerProgress(
  currentLesson?: number,
  totalStars?: number,
  xp?: number
): Promise<Player | null> {
  const deviceId = getDeviceId();
  const updates: any = {};
  
  if (currentLesson !== undefined) updates.current_lesson = currentLesson;
  if (totalStars !== undefined) updates.total_stars = totalStars;
  if (xp !== undefined) updates.xp = xp;
  
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('device_id', deviceId)
    .select()
    .single();
  
  if (error) {
    console.error('❌ خطأ في تحديث التقدم:', error);
    return null;
  }
  
  return data;
}

// ═══════════════════════════════════════
// 🆕 حفظ تقدم درس معين
// ═══════════════════════════════════════
export async function saveLessonProgress(
  lessonId: string,
  stars: number,
  completed: boolean = true,
  position?: {
    current_group?: number;
    current_letter?: number;
    current_phase?: string;
  }
): Promise<LessonProgress | null> {
  const deviceId = getDeviceId();

  // نشوف لو الدرس متحفظ قبل كده
  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('device_id', deviceId)
    .eq('lesson_id', lessonId)
    .single();

  // لو موجود، نحدث (بس لو النجوم أعلى من اللي قبل)
  if (existing) {
    const newStars = Math.max(existing.stars, stars);
    
    // 🆕 بيانات التحديث الأساسية
    const updateData: any = {
      stars: newStars,
      completed: completed || existing.completed,
      completed_at: completed ? new Date().toISOString() : existing.completed_at,
      updated_at: new Date().toISOString(),
    };

    // 🆕 إضافة بيانات المكان لو متوفرة
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
      console.error('❌ خطأ في تحديث تقدم الدرس:', error);
      return null;
    }
    console.log(`✅ تم تحديث تقدم ${lessonId}:`, data);
    return data;
  }

  // لو مش موجود، نضيفه
  const insertData: any = {
    device_id: deviceId,
    lesson_id: lessonId,
    stars,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  };

  // 🆕 إضافة بيانات المكان لو متوفرة
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
    console.error('❌ خطأ في حفظ تقدم الدرس:', error);
    return null;
  }
  console.log(`✅ تم حفظ تقدم ${lessonId}:`, data);
  return data;
}
// ═══════════════════════════════════════
// 📥 جلب تقدم درس واحد
// ═══════════════════════════════════════
export async function getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('device_id', deviceId)
    .eq('lesson_id', lessonId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ═══════════════════════════════════════
// 📥 جلب كل تقدم اللاعب
// ═══════════════════════════════════════
export async function getAllProgress(): Promise<LessonProgress[]> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('device_id', deviceId);

  if (error) {
    console.error('❌ خطأ في جلب التقدم:', error);
    return [];
  }

  return data || [];
}

// ═══════════════════════════════════════
// 🔒 التحقق إذا كان الدرس مفتوح
// ═══════════════════════════════════════
export async function isLessonUnlocked(lessonId: string): Promise<boolean> {
  // أول درس دايماً مفتوح
  const lessonIndex = LESSON_ORDER.indexOf(lessonId);
  if (lessonIndex === 0) return true;
  if (lessonIndex === -1) return false;

  // باقي الدروس: لازم اللي قبلها يكون متكمل
  const previousLesson = LESSON_ORDER[lessonIndex - 1];
  const previousProgress = await getLessonProgress(previousLesson);
  
  return previousProgress?.completed === true;
}

// ═══════════════════════════════════════
// 🎯 جلب رقم الدرس الحالي (أول درس مش متكمل)
// ═══════════════════════════════════════
export async function getCurrentLessonId(): Promise<string> {
  const allProgress = await getAllProgress();
  const completedLessons = new Set(
    allProgress.filter(p => p.completed).map(p => p.lesson_id)
  );

  // ندور على أول درس مش متكمل
  for (const lessonId of LESSON_ORDER) {
    if (!completedLessons.has(lessonId)) {
      return lessonId;
    }
  }

  // لو كل الدروس متكملة، نرجع آخر واحد
  return LESSON_ORDER[LESSON_ORDER.length - 1];
}

// ═══════════════════════════════════════
// ⭐ حساب إجمالي النجوم
// ═══════════════════════════════════════
export async function getTotalStarsFromLessons(): Promise<number> {
  const allProgress = await getAllProgress();
  return allProgress.reduce((sum, p) => sum + p.stars, 0);
}
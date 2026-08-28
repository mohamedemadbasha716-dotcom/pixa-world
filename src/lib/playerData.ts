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

// ═══════════════════════════════════════
// 🗺️ نظام الخرايط المتعددة (الألماني)
// ═══════════════════════════════════════

// 🗺️ الخريطة 1: ألمانيا — الأساسيات
export const MAP_1_LESSONS = [
  'hamburg',        // 1️⃣ الحروف
  'cologne',        // 2️⃣ الأرقام
  'center',         // 3️⃣ الغابة
  'berlin',         // 4️⃣ العائلة
  'lake',           // 5️⃣ البحيرة
  'neuschwanstein', // 6️⃣ القلعة
];

// 🗺️ الخريطة 2: ألمانيا — الحياة اليومية
export const MAP_2_LESSONS = [
  'heidelberg-school',
  'karl-house',
  'toys-island',
  'munich-market',
  'clock-tower',
  'adventurer-castle',
];

// 🗺️ الخريطة 3: فرانكفورت — مدن الثقافة
export const MAP_3_LESSONS = [
  'zeil-street',
  'senckenberg-museum',
  'charite-hospital',
  'allianz-arena',
  'palmengarten',
  'main-tower',
];

// 🗺️ الخريطة 4: برلين
export const MAP_4_LESSONS = [
  'berlin-hauptbahnhof',
  'brandenburg-gate-2',
  'kudamm-street',
  'museum-island',
  'embassy-district',
  'fernsehturm',
];

// 🗺️ الخريطة 5: مدن الثقافة الألمانية
export const MAP_5_LESSONS = [
  'heidelberg-uni',
  'anna-amalia-library',
  'goethe-house',
  'semperoper',
  'christmas-market',
  'goethe-institut',
];

// 🗺️ كل الدروس مرتبة (للقفل التلقائي عبر الخرايط)
export const LESSON_ORDER = [
  ...MAP_1_LESSONS,
  ...MAP_2_LESSONS,
  ...MAP_3_LESSONS,
  ...MAP_4_LESSONS,
  ...MAP_5_LESSONS,
];

// 🗺️ عدد الخرايط الكلي
export const TOTAL_MAPS = 5;

// 🗺️ Helper: جلب دروس خريطة معينة
export function getMapLessons(mapNumber: number): string[] {
  switch (mapNumber) {
    case 1: return MAP_1_LESSONS;
    case 2: return MAP_2_LESSONS;
    case 3: return MAP_3_LESSONS;
    case 4: return MAP_4_LESSONS;
    case 5: return MAP_5_LESSONS;
    default: return [];
  }
}

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
      console.error('❌ خطأ في تحديث تقدم الدرس:', error);
      return null;
    }
    console.log(`✅ تم تحديث تقدم ${lessonId}:`, data);
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
// 🔒 التحقق إذا كان الدرس مفتوح (بالتسلسل)
// ═══════════════════════════════════════
export async function isLessonUnlocked(lessonId: string): Promise<boolean> {
  const lessonIndex = LESSON_ORDER.indexOf(lessonId);
  if (lessonIndex === 0) return true;
  if (lessonIndex === -1) return false;

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

  for (const lessonId of LESSON_ORDER) {
    if (!completedLessons.has(lessonId)) {
      return lessonId;
    }
  }

  return LESSON_ORDER[LESSON_ORDER.length - 1];
}

// ═══════════════════════════════════════
// ⭐ حساب إجمالي النجوم
// ═══════════════════════════════════════
export async function getTotalStarsFromLessons(): Promise<number> {
  const allProgress = await getAllProgress();
  return allProgress.reduce((sum, p) => sum + p.stars, 0);
}

// ═══════════════════════════════════════
// 🗺️ التحقق إذا كانت خريطة معينة مكتملة (كل دروسها)
// ═══════════════════════════════════════
export async function isMapCompleted(mapNumber: number): Promise<boolean> {
  const mapLessons = getMapLessons(mapNumber);
  if (mapLessons.length === 0) return false;

  const allProgress = await getAllProgress();
  const completedSet = new Set(
    allProgress.filter(p => p.completed).map(p => p.lesson_id)
  );

  return mapLessons.every(lessonId => completedSet.has(lessonId));
}

// ═══════════════════════════════════════
// 🗺️ معرفة الخريطة الحالية اللي اللاعب فيها
// (أول خريطة فيها درس مش مكتمل)
// ═══════════════════════════════════════
export async function getCurrentMap(): Promise<number> {
  const allProgress = await getAllProgress();
  const completedSet = new Set(
    allProgress.filter(p => p.completed).map(p => p.lesson_id)
  );

  // نشيك على كل خريطة بالترتيب
  for (let mapNum = 1; mapNum <= TOTAL_MAPS; mapNum++) {
    const mapLessons = getMapLessons(mapNum);
    const allMapCompleted = mapLessons.every(id => completedSet.has(id));
    
    if (!allMapCompleted) {
      return mapNum; // أول خريطة مش مكتملة
    }
  }

  // لو كل الخرايط مكتملة، يرجع آخر خريطة
  return TOTAL_MAPS;
}

// ═══════════════════════════════════════
// 🗺️ حساب نجوم خريطة معينة
// ═══════════════════════════════════════
export async function getMapStars(mapNumber: number): Promise<{ earned: number; total: number }> {
  const mapLessons = getMapLessons(mapNumber);
  const allProgress = await getAllProgress();
  
  let earned = 0;
  const total = mapLessons.length * 3;

  for (const lessonId of mapLessons) {
    const progress = allProgress.find(p => p.lesson_id === lessonId);
    if (progress) earned += progress.stars;
  }

  return { earned, total };
}

// ═══════════════════════════════════════
// 🗺️ هل خريطة معينة مفتوحة للّعب؟
// (لازم اللي قبلها تكون مكتملة)
// ═══════════════════════════════════════
export async function isMapUnlocked(mapNumber: number): Promise<boolean> {
  if (mapNumber === 1) return true;
  return await isMapCompleted(mapNumber - 1);
}// ═══════════════════════════════════════
// 👑 التحقق من نوع اشتراك المستخدم
// ═══════════════════════════════════════
export async function getUserPlanStatus(): Promise<{ 
  isPremium: boolean; 
  isSuperAdmin: boolean;
  isLoggedIn: boolean;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isPremium: false, isSuperAdmin: false, isLoggedIn: false };
    }

    // 👑 حسابك الشخصي - مفتوح له كل شيء
    if (user.email?.trim().toLowerCase() === 'mohamedemadbasha716@gmail.com') {
      return { isPremium: true, isSuperAdmin: true, isLoggedIn: true };
    }

    // ⭐ التحقق من وجود اشتراك فعال
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .limit(1);

    const hasActiveSubscription = !!subData && subData.length > 0;

    return { 
      isPremium: hasActiveSubscription, 
      isSuperAdmin: false,
      isLoggedIn: true,
    };
  } catch (error) {
    console.error('❌ خطأ في جلب حالة الاشتراك:', error);
    return { isPremium: false, isSuperAdmin: false, isLoggedIn: false };
  }
}
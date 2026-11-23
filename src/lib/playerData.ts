import { currentAccountId, isPlatformOwner, activeSubscription } from './accountAccess';
import { supabase } from './supabase';
import { canonicalLessonId, equivalentLessonIds, normalizeProgressRows } from './lessonAliases';

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

export const MAP_1_LESSONS = [
  'hamburg',
  'cologne',
  'center',
  'berlin',
  'lake',
  'neuschwanstein',
];

export const MAP_2_LESSONS = [
  'heidelberg-school',
  'karl-house',
  'toys-island',
  'munich-market',
  'clock-tower',
  'adventurer-castle',
];

export const MAP_3_LESSONS = [
  'zeil-street',
  'senckenberg-museum',
  'charite-hospital',
  'allianz-arena',
  'palmengarten',
  'main-tower',
];

export const MAP_4_LESSONS = [
  'berlin-hauptbahnhof',
  'brandenburg-gate-2',
  'kudamm-street',
  'museum-island',
  'embassy-district',
  'fernsehturm',
];

export const MAP_5_LESSONS = [
  'heidelberg-uni',
  'anna-amalia-library',
  'goethe-house',
  'semperoper',
  'christmas-market',
  'goethe-institut',
];

export const LESSON_ORDER = [
  ...MAP_1_LESSONS,
  ...MAP_2_LESSONS,
  ...MAP_3_LESSONS,
  ...MAP_4_LESSONS,
  ...MAP_5_LESSONS,
];

export const TOTAL_MAPS = 5;

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
  const userId = await currentAccountId();
  if (!userId) return null;
  const deviceId = 'account_' + userId;
  
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  if (existingPlayer) {
    const { data, error } = await supabase
      .from('players')
      .update({ hero_name: heroName, hero_type: heroType })
      .eq('id', existingPlayer.id).eq('user_id', userId)
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
        user_id: userId,
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
  const userId = await currentAccountId();
  if (!userId) return null;
  const deviceId = 'account_' + userId;
  
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  
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
  const userId = await currentAccountId();
  if (!userId) return null;
  const player = await getPlayer();
  if (!player?.id) return null;
  const updates: any = {};
  
  if (currentLesson !== undefined) updates.current_lesson = currentLesson;
  if (totalStars !== undefined) updates.total_stars = totalStars;
  if (xp !== undefined) updates.xp = xp;
  
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', player.id).eq('user_id', userId)
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
  const userId = await currentAccountId();
  if (!userId) return null;
  const deviceId = 'account_' + userId;
  // 🔑 نحفظ دائمًا بالمعرف القانوني حتى لو الدرس مرّر معرفًا قديمًا
  lessonId = canonicalLessonId(lessonId);

  const { data: existing } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

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
      .eq('id', existing.id).eq('user_id', userId)
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
        user_id: userId,
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
  const userId = await currentAccountId();
  if (!userId) return null;
  const deviceId = 'account_' + userId;

  // نقرأ كل المعرفات المكافئة (القانوني + القديمة) وندمجها
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .in('lesson_id', equivalentLessonIds(lessonId));

  if (error || !data || data.length === 0) {
    return null;
  }

  return normalizeProgressRows(data)[0];
}

// ═══════════════════════════════════════
// 📥 جلب كل تقدم اللاعب
// ═══════════════════════════════════════
export async function getAllProgress(): Promise<LessonProgress[]> {
  const userId = await currentAccountId();
  if (!userId) return [];
  const deviceId = 'account_' + userId;

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('❌ خطأ في جلب التقدم:', error);
    return [];
  }

  return normalizeProgressRows(data || []);
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
// 🎯 جلب رقم الدرس الحالي
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
// 🗺️ التحقق إذا كانت خريطة معينة مكتملة
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
// 🗺️ معرفة الخريطة الحالية
// ═══════════════════════════════════════
export async function getCurrentMap(): Promise<number> {
  const allProgress = await getAllProgress();
  const completedSet = new Set(
    allProgress.filter(p => p.completed).map(p => p.lesson_id)
  );

  for (let mapNum = 1; mapNum <= TOTAL_MAPS; mapNum++) {
    const mapLessons = getMapLessons(mapNum);
    const allMapCompleted = mapLessons.every(id => completedSet.has(id));
    
    if (!allMapCompleted) {
      return mapNum;
    }
  }

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
// ═══════════════════════════════════════
export async function isMapUnlocked(mapNumber: number): Promise<boolean> {
  if (mapNumber === 1) return true;
  return await isMapCompleted(mapNumber - 1);
}

// ═══════════════════════════════════════
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

    if (await isPlatformOwner()) return { isPremium: true, isSuperAdmin: true, isLoggedIn: true };
    const { data: subscriptions } = await supabase.from('subscriptions').select('*').eq('user_id', user.id);
    return { isPremium: (subscriptions || []).some(s => activeSubscription(s)), isSuperAdmin: false, isLoggedIn: true };
  } catch (error) {
    console.error('❌ خطأ في جلب حالة الاشتراك:', error);
    return { isPremium: false, isSuperAdmin: false, isLoggedIn: false };
  }
  }

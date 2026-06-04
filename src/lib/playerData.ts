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

// 💾 حفظ أو تحديث بيانات اللاعب
export async function savePlayer(heroName: string, heroType: string): Promise<Player | null> {
  const deviceId = getDeviceId();
  
  // نشوف أولاً إذا كان اللاعب موجود
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (existingPlayer) {
    // 🔄 تحديث اللاعب الموجود
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
    // ➕ إضافة لاعب جديد
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

// 📥 جلب بيانات اللاعب
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

// 🔄 تحديث تقدم اللاعب
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
import { supabase } from './supabase';
import { getDeviceId } from './playerData';

// ═══════════════════════════════════════════════════════
// 📝 أنواع البيانات
// ═══════════════════════════════════════════════════════

export type PlanType = 'free' | 'monthly' | 'quarterly' | 'yearly';

export interface Subscription {
  id?: string;
  device_id: string;
  plan_type: PlanType;
  is_active: boolean;
  started_at?: string;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ═══════════════════════════════════════════════════════
// 🎁 قائمة الدروس المجانية (متاحة للكل)
// ═══════════════════════════════════════════════════════

export const FREE_LESSONS = [
  'hamburg',  // أول درس فقط في الألماني - الحروف
];

// ═══════════════════════════════════════════════════════
// 👑 نظام الأدمن (المطور)
// ═══════════════════════════════════════════════════════

const ADMIN_STORAGE_KEY = 'pixa_admin_mode';
const ADMIN_SECRET = 'PIXA_ADMIN_2025'; // 🔑 كلمة سر الأدمن

/**
 * 🔒 التحقق إذا الجهاز الحالي أدمن
 */
export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_STORAGE_KEY) === ADMIN_SECRET;
}

/**
 * 👑 تفعيل وضع الأدمن (يشتغل من الـ Console)
 */
export function enableAdminMode(secret: string): boolean {
  if (typeof window === 'undefined') return false;
  
  if (secret !== ADMIN_SECRET) {
    console.error('❌ كلمة سر خاطئة!');
    return false;
  }

  localStorage.setItem(ADMIN_STORAGE_KEY, ADMIN_SECRET);
  console.log('👑 تم تفعيل وضع الأدمن! كل الدروس مفتوحة 🔓');
  console.log('🔄 اعمل Refresh للصفحة');
  return true;
}

/**
 * 🚫 إلغاء وضع الأدمن
 */
export function disableAdminMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  console.log('🚫 تم إلغاء وضع الأدمن');
  console.log('🔄 اعمل Refresh للصفحة');
}

// 🌍 خلي الدوال متاحة في الـ Console عالمياً
if (typeof window !== 'undefined') {
  (window as any).enableAdmin = enableAdminMode;
  (window as any).disableAdmin = disableAdminMode;
  (window as any).checkAdmin = () => {
    const status = isAdmin();
    console.log(status ? '👑 أنت أدمن' : '👤 مستخدم عادي');
    return status;
  };
}

// ═══════════════════════════════════════════════════════
// 📥 جلب اشتراك المستخدم الحالي
// ═══════════════════════════════════════════════════════

export async function getUserSubscription(): Promise<Subscription | null> {
  const deviceId = getDeviceId();
  if (!deviceId) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('device_id', deviceId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ═══════════════════════════════════════════════════════
// ✅ التحقق إذا المستخدم مشترك (أي خطة مدفوعة)
// ═══════════════════════════════════════════════════════

export async function isUserSubscribed(): Promise<boolean> {
  // 👑 الأدمن مشترك تلقائياً
  if (isAdmin()) return true;

  const subscription = await getUserSubscription();
  
  if (!subscription) return false;
  if (!subscription.is_active) return false;
  if (subscription.plan_type === 'free') return false;

  if (subscription.expires_at) {
    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();
    if (expiresAt < now) return false;
  }

  return true;
}

// ═══════════════════════════════════════════════════════
// 🔓 التحقق إذا الدرس ده مسموح للمستخدم
// ═══════════════════════════════════════════════════════

export async function canAccessLesson(lessonId: string): Promise<{
  canAccess: boolean;
  reason: 'admin' | 'free_lesson' | 'subscribed' | 'not_subscribed';
}> {
  // 👑 الأدمن ياخد كل حاجة
  if (isAdmin()) {
    return { canAccess: true, reason: 'admin' };
  }

  // 🎁 الدرس المجاني متاح للكل
  if (FREE_LESSONS.includes(lessonId)) {
    return { canAccess: true, reason: 'free_lesson' };
  }

  // 💎 شيك على الاشتراك
  const subscribed = await isUserSubscribed();
  
  if (subscribed) {
    return { canAccess: true, reason: 'subscribed' };
  }

  return { canAccess: false, reason: 'not_subscribed' };
}

// ═══════════════════════════════════════════════════════
// 🎁 إنشاء اشتراك مجاني افتراضي للمستخدم الجديد
// ═══════════════════════════════════════════════════════

export async function createFreeSubscription(): Promise<Subscription | null> {
  const deviceId = getDeviceId();
  if (!deviceId) return null;

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('device_id', deviceId)
    .eq('plan_type', 'free')
    .single();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      device_id: deviceId,
      plan_type: 'free',
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ خطأ في إنشاء الاشتراك المجاني:', error);
    return null;
  }

  console.log('✅ تم إنشاء اشتراك مجاني:', data);
  return data;
}

// ═══════════════════════════════════════════════════════
// 💎 ترقية المستخدم لاشتراك مدفوع
// ═══════════════════════════════════════════════════════

export async function upgradeSubscription(
  planType: 'monthly' | 'quarterly' | 'yearly'
): Promise<Subscription | null> {
  const deviceId = getDeviceId();
  if (!deviceId) return null;

  const now = new Date();
  const expiresAt = new Date();
  
  switch (planType) {
    case 'monthly':
      expiresAt.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      expiresAt.setMonth(now.getMonth() + 3);
      break;
    case 'yearly':
      expiresAt.setFullYear(now.getFullYear() + 1);
      break;
  }

  await supabase
    .from('subscriptions')
    .update({ is_active: false })
    .eq('device_id', deviceId);

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      device_id: deviceId,
      plan_type: planType,
      is_active: true,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('❌ خطأ في الترقية:', error);
    return null;
  }

  console.log('✅ تم ترقية الاشتراك:', data);
  return data;
}

// ═══════════════════════════════════════════════════════
// 📊 جلب معلومات مبسطة عن حالة الاشتراك
// ═══════════════════════════════════════════════════════

export async function getSubscriptionStatus(): Promise<{
  isSubscribed: boolean;
  isAdmin: boolean;
  planType: PlanType;
  expiresAt: string | null;
  daysRemaining: number | null;
}> {
  const adminMode = isAdmin();

  // 👑 لو أدمن
  if (adminMode) {
    return {
      isSubscribed: true,
      isAdmin: true,
      planType: 'yearly',
      expiresAt: null,
      daysRemaining: null,
    };
  }

  const subscription = await getUserSubscription();

  if (!subscription) {
    return {
      isSubscribed: false,
      isAdmin: false,
      planType: 'free',
      expiresAt: null,
      daysRemaining: null,
    };
  }

  const isSubscribed = subscription.plan_type !== 'free' && subscription.is_active;
  
  let daysRemaining: number | null = null;
  if (subscription.expires_at) {
    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return {
    isSubscribed,
    isAdmin: false,
    planType: subscription.plan_type,
    expiresAt: subscription.expires_at || null,
    daysRemaining,
  };
}
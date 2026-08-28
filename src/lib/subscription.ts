import { supabase } from './supabase';
import { getDeviceId, isLessonUnlocked } from './playerData';
import { isSpanishLessonUnlocked } from './spanishPlayerData';
import { getCurrentUser } from './auth';

export type PlanType = 'free' | 'monthly' | 'quarterly' | 'yearly';
export type LanguageCode = 'de' | 'es' | 'ru' | 'ja' | 'zh';

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

// 🎁 قائمة الدروس المجانية لكل اللغات (تفتح بدون قفل أو تسلسل)
export const FREE_LESSONS = [
  'hamburg',               // الدرس الأول بالألماني
  'es-muniellos-alphabet'  // الدرس الأول بالأسباني
];

// 🇪🇸 الدروس المجانية للأسباني (أول درس فقط في أول خريطة)
export const ES_FREE_LESSONS = [
  'es-muniellos-alphabet'
];

export const FULL_ACCESS_EMAILS = [
  'mohamedemadbasha716@gmail.com',
];

const ADMIN_STORAGE_KEY = 'pixa_admin_mode';
const ADMIN_SECRET = 'PIXA_ADMIN_2025';

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_STORAGE_KEY) === ADMIN_SECRET;
}

export function enableAdminMode(secret: string): boolean {
  if (typeof window === 'undefined') return false;
  if (secret !== ADMIN_SECRET) {
    console.error('❌ كلمة سر خاطئة!');
    return false;
  }
  localStorage.setItem(ADMIN_STORAGE_KEY, ADMIN_SECRET);
  return true;
}

export function disableAdminMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export async function hasFullAccess(): Promise<boolean> {
  if (isAdmin()) return true;
  try {
    const user = await getCurrentUser();
    const email = user?.email?.toLowerCase()?.trim();
    if (email && FULL_ACCESS_EMAILS.map(e => e.toLowerCase()).includes(email)) {
      return true;
    }
  } catch {}
  return false;
}

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

  if (error) return null;
  return data;
}

export async function isUserSubscribed(): Promise<boolean> {
  if (await hasFullAccess()) return true;

  const subscription = await getUserSubscription();
  if (!subscription) return false;
  if (!subscription.is_active) return false;
  if (subscription.plan_type === 'free') return false;

  if (subscription.expires_at) {
    const expiresAt = new Date(subscription.expires_at);
    if (expiresAt < new Date()) return false;
  }
  return true;
}

// 🔓 دالة التحقق الذكية والديناميكية (تفصل الألماني عن الأسباني)
export async function canAccessLesson(lessonId: string): Promise<{
  canAccess: boolean;
  reason: 'full_access' | 'free_lesson' | 'subscribed' | 'not_subscribed' | 'locked_sequence';
  redirectTo?: string;
}> {
  if (await hasFullAccess()) {
    return { canAccess: true, reason: 'full_access' };
  }

  if (FREE_LESSONS.includes(lessonId)) {
    return { canAccess: true, reason: 'free_lesson' };
  }

  const subscribed = await isUserSubscribed();
  if (!subscribed) {
    return { canAccess: false, reason: 'not_subscribed', redirectTo: '/plans' };
  }

  // فرز التحقق ديناميكياً حسب كود المعلم (أسباني أو ألماني)
  const isSpanish = lessonId.startsWith('es-');
  const unlocked = isSpanish 
    ? await isSpanishLessonUnlocked(lessonId) 
    : await isLessonUnlocked(lessonId);

  if (!unlocked) {
    return { canAccess: false, reason: 'locked_sequence' };
  }

  return { canAccess: true, reason: 'subscribed' };
}

export async function createFreeSubscription(): Promise<Subscription | null> {
  const deviceId = getDeviceId();
  if (!deviceId) return null;

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('device_id', deviceId)
    .eq('plan_type', 'free')
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      device_id: deviceId,
      plan_type: 'free',
      is_active: true,
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

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

  if (error) return null;
  return data;
}

export async function getSubscriptionStatus() {
  const adminMode = isAdmin();
  const fullAccess = await hasFullAccess();

  if (fullAccess) {
    return {
      isSubscribed: true,
      isAdmin: adminMode,
      hasFullAccess: true,
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
      hasFullAccess: false,
      planType: 'free',
      expiresAt: null,
      daysRemaining: null,
    };
  }

  const isSubscribed = subscription.plan_type !== 'free' && subscription.is_active;
  let daysRemaining: number | null = null;
  if (subscription.expires_at) {
    const expiresAt = new Date(subscription.expires_at);
    const diff = expiresAt.getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return {
    isSubscribed,
    isAdmin: false,
    hasFullAccess: false,
    planType: subscription.plan_type,
    expiresAt: subscription.expires_at || null,
    daysRemaining,
  };
}
import { supabase } from './supabase';
import { getDeviceId } from './playerData';

// ═══════════════════════════════════════════════════════
// 📝 أنواع البيانات
// ═══════════════════════════════════════════════════════

export interface UserProfile {
  id: string;
  full_name: string;
  country_code: string;
  email?: string;
  device_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SignUpData {
  fullName: string;
  countryCode: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// ═══════════════════════════════════════════════════════
// 🎯 إنشاء حساب جديد
// ═══════════════════════════════════════════════════════

export async function signUp(data: SignUpData): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
}> {
  try {
    // 1️⃣ إنشاء المستخدم في Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return { success: false, error: getArabicError(authError.message) };
    }

    if (!authData.user) {
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }

    // 2️⃣ إنشاء الـ profile في جدول profiles
    const deviceId = getDeviceId();

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: data.fullName,
        country_code: data.countryCode,
        email: data.email,
        device_id: deviceId,
      });

    if (profileError) {
      console.error('❌ خطأ في إنشاء الـ profile:', profileError);
      return { success: false, error: 'حدث خطأ في حفظ بياناتك' };
    }

    // 3️⃣ ربط الـ device_id بالحساب الجديد (لو فيه بيانات قديمة)
    await linkDeviceToUser(authData.user.id, deviceId);

    console.log('✅ تم إنشاء الحساب بنجاح:', authData.user.email);
    return { success: true, userId: authData.user.id };
  } catch (err: any) {
    console.error('❌ خطأ في التسجيل:', err);
    return { success: false, error: 'حدث خطأ غير متوقع، حاولي تاني' };
  }
}

// ═══════════════════════════════════════════════════════
// 🔐 تسجيل الدخول
// ═══════════════════════════════════════════════════════

export async function signIn(data: SignInData): Promise<{
  success: boolean;
  error?: string;
  userId?: string;
}> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, error: getArabicError(error.message) };
    }

    if (!authData.user) {
      return { success: false, error: 'حدث خطأ غير متوقع' };
    }

    // ربط الـ device_id بالحساب (لو دخل من جهاز جديد)
    const deviceId = getDeviceId();
    await linkDeviceToUser(authData.user.id, deviceId);

    console.log('✅ تم تسجيل الدخول:', authData.user.email);
    return { success: true, userId: authData.user.id };
  } catch (err: any) {
    console.error('❌ خطأ في الدخول:', err);
    return { success: false, error: 'حدث خطأ غير متوقع، حاولي تاني' };
  }
}

// ═══════════════════════════════════════════════════════
// 🚪 تسجيل الخروج
// ═══════════════════════════════════════════════════════

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    console.log('✅ تم تسجيل الخروج');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'حدث خطأ في تسجيل الخروج' };
  }
}

// ═══════════════════════════════════════════════════════
// 👤 جلب المستخدم الحالي
// ═══════════════════════════════════════════════════════

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ═══════════════════════════════════════════════════════
// 📄 جلب الـ profile الكامل للمستخدم
// ═══════════════════════════════════════════════════════

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('❌ خطأ في جلب الـ profile:', error);
    return null;
  }

  return data;
}

// ═══════════════════════════════════════════════════════
// 🔗 ربط الـ device_id بالحساب
// ═══════════════════════════════════════════════════════

async function linkDeviceToUser(userId: string, deviceId: string): Promise<void> {
  if (!deviceId) return;

  try {
    // ربط الـ players القديمة بالحساب
    await supabase
      .from('players')
      .update({ user_id: userId })
      .eq('device_id', deviceId)
      .is('user_id', null);

    // ربط الـ lesson_progress القديمة بالحساب
    await supabase
      .from('lesson_progress')
      .update({ user_id: userId })
      .eq('device_id', deviceId)
      .is('user_id', null);

    // ربط الـ subscriptions القديمة بالحساب
    await supabase
      .from('subscriptions')
      .update({ user_id: userId })
      .eq('device_id', deviceId)
      .is('user_id', null);

    console.log('✅ تم ربط الجهاز بالحساب');
  } catch (err) {
    console.error('⚠️ خطأ في ربط الجهاز بالحساب:', err);
  }
}

// ═══════════════════════════════════════════════════════
// 🔍 التحقق إذا كان المستخدم مسجل دخول
// ═══════════════════════════════════════════════════════

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// ═══════════════════════════════════════════════════════
// 🌍 قائمة الدول المدعومة
// ═══════════════════════════════════════════════════════

export const SUPPORTED_COUNTRIES = [
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'عُمان', flag: '🇴🇲' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'PS', name: 'فلسطين', flag: '🇵🇸' },
  { code: 'SD', name: 'السودان', flag: '🇸🇩' },
  { code: 'OTHER', name: 'دولة أخرى', flag: '🌍' },
];

// ═══════════════════════════════════════════════════════
// 🌐 ترجمة رسائل الخطأ للعربي
// ═══════════════════════════════════════════════════════

function getArabicError(message: string): string {
  const errors: Record<string, string> = {
    'Invalid login credentials': 'الايميل أو كلمة السر غلط',
    'User already registered': 'الايميل ده مسجل قبل كده، سجلي دخول',
    'Password should be at least 6 characters': 'كلمة السر لازم تكون 6 أحرف على الأقل',
    'Unable to validate email address: invalid format': 'الايميل مش صح',
    'Email not confirmed': 'محتاجة تأكدي الايميل الأول',
    'User not found': 'مفيش حساب بالايميل ده',
  };

  for (const key in errors) {
    if (message.includes(key)) return errors[key];
  }

  return message;
}
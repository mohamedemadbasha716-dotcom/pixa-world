'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, CheckCircle2, UserPlus, 
  CalendarClock, Zap, Lock, AlertCircle, ArrowLeft,
  Crown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { isPlatformOwner } from '@/lib/accountAccess';
import { useRouter } from 'next/navigation';

export default function AdminPanelPage() {
  const router = useRouter();
  
  // 🔒 حالات الحماية
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  useEffect(() => {
    let alive = true;
    const check = async () => { const owner = await isPlatformOwner(); if (alive) { setIsAuthenticated(owner); setCheckingAccess(false); } };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { setIsAuthenticated(false); setTimeout(check, 0); });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  // 📝 حالات البحث وتفعيل الاشتراك
  const [emailInput, setEmailInput] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [monthsToAdd, setMonthsToAdd] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 📊 حالة جلب بيانات المستخدم
  const [foundUser, setFoundUser] = useState<any>(null);

  // -------------------------------------------------------------
  // 1. تسجيل دخول الأدمن
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 2. البحث عن المستخدم بالإيميل
  // -------------------------------------------------------------
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setFoundUser(null);

    if (!emailInput.trim()) {
      setErrorMsg('اكتب الإيميل الأول يا بطل!');
      setIsLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase.rpc('pixa_admin_find_account', { p_email: emailInput.trim() });
      if (profileError || !profileData) throw new Error('Account not found');
      const subData = profileData.subscription;
      setFoundUser({
        ...profileData,
        subscription: subData || null
      });

    } catch (err) {
      setErrorMsg('حصلت مشكلة في البحث، جرب تاني.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 3. تفعيل أو تجديد الاشتراك
  // -------------------------------------------------------------
  const handleActivateSubscription = async () => {
    if (!foundUser) return;
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error: insertError } = await supabase.rpc('pixa_admin_extend_subscription', {
        p_user: foundUser.id, p_plan: selectedPlan,
      });
      if (insertError) throw insertError;
      setSuccessMsg('✅ تم تفعيل الاشتراك بنجاااح! الدروس اتفتحت.');
      
      // تحديث البيانات في الشاشة فوراً
      handleSearchUser({ preventDefault: () => {} } as any);

    } catch (err) {
      setErrorMsg('❌ حصلت مشكلة في التفعيل، راجع الداتابيز.');
    } finally {
      setIsLoading(false);
    }
  };


  // ==============================================================
  // 🔒 شاشة تسجيل الدخول
  // ==============================================================
  if (!isAuthenticated) {
    return <main className="min-h-screen bg-[#07090D] text-white flex items-center justify-center p-6" dir="rtl"><section className="max-w-md text-center space-y-5"><ShieldCheck size={48} className="mx-auto" /><h1 className="text-2xl font-bold">إدارة الحسابات</h1><p>{checkingAccess ? 'جاري التحقق من صلاحية الحساب...' : 'هذه الصفحة متاحة لحساب مدير المنصة فقط. سجل الدخول بحسابك المعتمد.'}</p><button className="rounded-xl bg-blue-600 px-6 py-3" onClick={() => router.push('/login')}>تسجيل الدخول</button></section></main>;
  }

  // ==============================================================
  // 🛠️ لوحة الأدمن الرئيسية
  // ==============================================================
  return (
    <div className="min-h-screen bg-[#07090D] text-white font-sans" dir="rtl">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#07090D]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight">لوحة تحكم الأدمن</h1>
              <p className="text-[10px] text-blue-400 font-bold">تفعيل الاشتراكات اليدوي</p>
            </div>
          </div>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={14} /> الرئيسية
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* 1. قسم البحث */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-blue-400">
            <Search size={20} /> البحث عن حساب
          </h2>
          <form onSubmit={handleSearchUser} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value.toLowerCase())}
              placeholder="اكتب إيميل ولي الأمر هنا..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 transition-colors"
              dir="ltr"
            />
            <button type="submit" disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-colors whitespace-nowrap">
              {isLoading ? 'جاري البحث...' : 'ابحث 🔍'}
            </button>
          </form>
          
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
              className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
              <AlertCircle size={16} /> {errorMsg}
            </motion.div>
          )}
        </section>

        {/* 2. بيانات المستخدم والاشتراك */}
        <AnimatePresence>
          {foundUser && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
              
              <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <UserPlus size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">{foundUser.full_name}</h3>
                  <p className="text-sm text-gray-400 font-medium" dir="ltr">{foundUser.email}</p>
                </div>
                
                {/* حالة الاشتراك الحالية */}
                <div className="mr-auto text-center">
                  {foundUser.subscription?.is_active && foundUser.subscription?.plan_type !== 'free' ? (
                    <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
                      <div className="text-xs font-bold text-green-400 mb-1 flex items-center justify-center gap-1">
                        <CheckCircle2 size={12} /> اشتراك نشط
                      </div>
                      <div className="text-[10px] text-gray-400">
                        ينتهي في: {new Date(foundUser.subscription.expires_at).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
                      <div className="text-xs font-bold text-orange-400 flex items-center justify-center gap-1">
                        <Lock size={12} /> حساب مجاني
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. لوحة التفعيل */}
              <div>
                <h3 className="text-base font-black mb-4 flex items-center gap-2 text-purple-400">
                  <Crown size={18} /> تفعيل خطة جديدة
                </h3>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: 'monthly', name: 'شهري', months: 1, icon: Zap },
                    { id: 'quarterly', name: '3 شهور', months: 3, icon: CalendarClock },
                    { id: 'yearly', name: 'سنوي', months: 12, icon: Crown },
                  ].map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan.id as any);
                        setMonthsToAdd(plan.months);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        selectedPlan === plan.id 
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                          : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <plan.icon size={24} />
                      <span className="font-black text-sm">{plan.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleActivateSubscription}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'جاري التفعيل...' : 'تفعيل الاشتراك فوراً 🚀'}
                </button>

                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                    className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-black text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} /> {successMsg}
                  </motion.div>
                )}
              </div>

            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Crown, ArrowRight, Sparkle, CheckCircle2, Star, 
  Gift, X, LogIn, UserPlus, Globe2, Zap 
} from 'lucide-react';
import { getPlayer } from '@/lib/playerData';

export default function PlansPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [showLangChoice, setShowLangChoice] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCharacter, setHasCharacter] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const player = await getPlayer();
      const heroName = localStorage.getItem('heroName');
      const heroType = localStorage.getItem('heroType');
      if (player || (heroName && heroType)) {
        setIsLoggedIn(true);
        if (heroName && heroType) {
          setHasCharacter(true);
        }
      }
    } catch {}
  };

  const handleSelectPlan = (plan: 'monthly' | 'quarterly' | 'yearly') => {
    setLoadingPlan(plan);
    router.push(`/checkout?plan=${plan}&country=eg`);
  };

  const handleFreeTrialClick = async () => {
    setCheckingAuth(true);
    try {
      const player = await getPlayer();
      const heroName = localStorage.getItem('heroName');
      const heroType = localStorage.getItem('heroType');
      const loggedIn = !!(player || (heroName && heroType));
      const hasChar = !!(heroName && heroType);
      
      setIsLoggedIn(loggedIn);
      setHasCharacter(hasChar);
      
      if (!loggedIn) {
        setShowAuthChoice(true);
      } else {
        setShowLangChoice(true);
      }
    } catch {
      setShowAuthChoice(true);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLangSelect = (lang: 'de' | 'es') => {
    localStorage.setItem('freeTrialMode', 'true');
    localStorage.setItem('freeTrialLanguage', lang);
    localStorage.setItem('firstLessonOnly', 'true');
    setShowLangChoice(false);

    // ✅ تم إصلاح مسار الإسباني وتوحيد الـ Routes
    const spanishRoute = '/spanish-character-and-map'; 
    const germanRoute = '/character-and-map';

    if (hasCharacter) {
      if (lang === 'de') {
        router.push(`${germanRoute}?freeTrial=de&map=1&firstLessonOnly=true&from=freeTrial`);
      } else {
        router.push(`${spanishRoute}?freeTrial=es&map=1&firstLessonOnly=true&from=freeTrial`);
      }
    } else {
      if (lang === 'de') {
        router.push(`${germanRoute}?freeTrial=de&firstLessonOnly=true&setup=true`);
      } else {
        router.push(`${spanishRoute}?freeTrial=es&firstLessonOnly=true&setup=true`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-white font-sans overflow-x-hidden relative" dir="rtl">
      {/* 🌌 خلفية احترافية */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF4D6D] rounded-full mix-blend-screen filter blur-[120px] opacity-10" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#4CC9F0] rounded-full mix-blend-screen filter blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#9D4EDD] rounded-full mix-blend-screen filter blur-[150px] opacity-15" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      {/* 👑 الهيدر */}
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="relative z-50 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md bg-[#0A0A1A]/60 border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.02 }} onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4CC9F0] to-[#9D4EDD] flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(76,201,240,0.3)] text-white">P</div>
            <span className="text-xl md:text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">PIXA</span>
          </motion.div>
          <button onClick={() => router.push('/')} className="text-sm font-bold text-white/50 hover:text-white transition-colors">
            العودة للرئيسية ←
          </button>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* 🚀 قسم العنوان والتجربة المجانية */}
        <div className="text-center mb-16 space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-cyan-300">
            <Sparkle size={16} className="text-yellow-400" /> استثمر في مستقبل طفلك
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black leading-tight">
            اختر الخطة المناسبة لبطل <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4CC9F0] via-[#9D4EDD] to-[#FF4D6D]">
              رحلة التعلم الممتعة
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
            3 خطط مرنة بأسعار ممتازة تناسب ميزانيتك. ابدأ الآن وافتح أبواب اللغات لطفلك!
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-6">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(6, 214, 160, 0.4)' }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleFreeTrialClick} 
              disabled={checkingAuth}
              className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg bg-gradient-to-r from-[#06D6A0] to-[#04aa7d] text-white shadow-xl border border-[#06D6A0]/50 overflow-hidden"
            >
              <Gift size={22} className="relative z-10" />
              <span className="relative z-10">{checkingAuth ? 'جاري التحضير...' : 'جرب أول درس مجاناً'}</span>
              <ArrowRight size={18} className="rotate-180 relative z-10" />
            </motion.button>
            <p className="text-white/40 text-xs mt-3 font-bold">بدون بطاقة ائتمانية • دخول فوري</p>
          </motion.div>
        </div>

        {/* 💳 كروت الاشتراكات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
          
          {/* 🥉 الخطة الشهرية */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} 
            className="relative rounded-3xl p-8 bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#4CC9F0]/50 transition-colors group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4CC9F0]/10 rounded-full blur-3xl group-hover:bg-[#4CC9F0]/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#4CC9F0]/20 flex items-center justify-center mb-6">
                <Zap className="text-[#4CC9F0]" size={24} />
              </div>
              <h3 className="text-2xl font-black mb-2">الشهرية</h3>
              <p className="text-white/50 text-sm font-bold mb-6">لغة واحدة من اختيارك</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-white">200</span>
                <span className="text-white/40 font-bold">ج.م/شهر</span>
                <span className="text-white/30 text-sm line-through ml-2">400</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['لغة واحدة (ألماني أو إسباني)','الوصول لكل الدروس والألعاب','نطق صوتي أصلي'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 text-sm font-bold">
                    <CheckCircle2 size={18} className="text-[#4CC9F0]" /> {item}
                  </li>
                ))}
              </ul>
              <motion.button onClick={() => handleSelectPlan('monthly')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-white/10 hover:bg-[#4CC9F0] text-white transition-colors border border-white/10 hover:border-transparent">
                اشترك الآن
              </motion.button>
            </div>
          </motion.div>

          {/* 🥇 الخطة الربع سنوية (الأساسية) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} 
            className="relative rounded-3xl p-8 bg-gradient-to-b from-[#9D4EDD]/20 to-[#1a0b2e] border-2 border-[#9D4EDD] shadow-[0_0_40px_rgba(157,78,221,0.2)] transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
              <div className="bg-gradient-to-r from-[#FF4D6D] to-[#9D4EDD] px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                <Star size={12} className="fill-white" /> الأكثر توفيراً وطلباً
              </div>
            </div>
            <div className="absolute top-0 right-0 w-full h-40 bg-[#9D4EDD]/20 rounded-full blur-[80px]" />
            
            <div className="relative z-10 pt-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9D4EDD] to-[#FF4D6D] flex items-center justify-center mb-6 shadow-lg shadow-[#9D4EDD]/30">
                <Globe2 className="text-white" size={28} />
              </div>
              <h3 className="text-3xl font-black mb-2">الربع سنوية</h3>
              <p className="text-[#F72585] text-sm font-black mb-6">3 شهور — كل اللغات الحالية</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black text-white">350</span>
                <span className="text-white/40 font-bold">ج.م</span>
                <span className="text-white/30 text-sm line-through ml-2">700</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['الألمانية كاملة','الإسبانية كاملة','لغة ثالثة مجاناً (قريباً)','شهادات تقدير للطفل'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-sm font-bold">
                    <CheckCircle2 size={20} className="text-[#F72585]" /> {item}
                  </li>
                ))}
              </ul>
              <motion.button onClick={() => handleSelectPlan('quarterly')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-black text-base bg-gradient-to-r from-[#9D4EDD] to-[#F72585] text-white shadow-lg shadow-[#9D4EDD]/25">
                اشترك ووفر 50%
              </motion.button>
            </div>
          </motion.div>

          {/* 👑 الخطة السنوية */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} 
            className="relative rounded-3xl p-8 bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 hover:border-[#FFD700]/50 transition-colors group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl group-hover:bg-[#FFD700]/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 flex items-center justify-center mb-6">
                <Crown className="text-[#FFD700]" size={24} />
              </div>
              <h3 className="text-2xl font-black mb-2">السنوية</h3>
              <p className="text-white/50 text-sm font-bold mb-6">شاملة ومستمرة</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black text-white">500</span>
                <span className="text-white/40 font-bold">ج.م/سنة</span>
                <span className="text-white/30 text-sm line-through ml-2">1000</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['وصول مفتوح لكل اللغات','تحديثات اللغات الجديدة مجاناً','أولوية الدعم الفني'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 text-sm font-bold">
                    <CheckCircle2 size={18} className="text-[#FFD700]" /> {item}
                  </li>
                ))}
              </ul>
              <motion.button onClick={() => handleSelectPlan('yearly')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-black text-sm bg-white/10 hover:bg-[#FFD700] hover:text-black text-white transition-colors border border-white/10 hover:border-transparent">
                اشترك سنوياً
              </motion.button>
            </div>
          </motion.div>

        </div>
      </main>

      {/* 🔐 مودال تسجيل الدخول للتجربة */}
      <AnimatePresence>
        {showAuthChoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthChoice(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-[#13132B] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#4CC9F0] to-[#9D4EDD]" />
              <button onClick={() => setShowAuthChoice(false)} className="absolute top-6 left-6 text-white/40 hover:text-white"><X size={20} /></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10"><Gift size={32} className="text-[#4CC9F0]" /></div>
                <h3 className="text-2xl font-black text-white mb-2">خطوة واحدة للبدء</h3>
                <p className="text-white/60 text-sm font-medium">سجل دخول لحفظ تقدم طفلك في التجربة المجانية</p>
              </div>

              <div className="space-y-4">
                <button onClick={() => router.push('/login?redirect=/plans&freeTrial=true')} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 transition-colors">
                  <LogIn size={18} /> لدي حساب بالفعل
                </button>
                <button onClick={() => router.push('/signup?redirect=/plans&freeTrial=true')} className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 bg-[#1A1A3A] border border-white/10 hover:bg-[#25254A] text-white transition-colors">
                  <UserPlus size={18} /> إنشاء حساب جديد
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌍 مودال اختيار لغة التجربة المجانية */}
      <AnimatePresence>
        {showLangChoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowLangChoice(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-3xl bg-[#13132B] border border-[#06D6A0]/30 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#06D6A0] to-[#4CC9F0]" />
              <button onClick={() => setShowLangChoice(false)} className="absolute top-6 left-6 text-white/40 hover:text-white"><X size={20} /></button>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2">اختر لغتك المفضلة 🚀</h3>
                <p className="text-white/60 text-sm font-medium">ابدأ الآن أول درس مجاناً، وتقدر تغير اللغة بعدين.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => handleLangSelect('de')} className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-right hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition-all text-right">
                  <div className="text-5xl mb-4">🇩🇪</div>
                  <h4 className="font-black text-xl text-white mb-1">اللغة الألمانية</h4>
                  <p className="text-xs text-white/50 font-bold mb-4">الدرس الأول: الحروف والميناء</p>
                  <div className="flex items-center gap-2 text-sm font-black text-[#FFD700] group-hover:translate-x-[-5px] transition-transform">
                    <span>جرب الآن</span><ArrowRight size={16} className="rotate-180" />
                  </div>
                </button>

                <button onClick={() => handleLangSelect('es')} className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-right hover:border-[#F72585] hover:bg-[#F72585]/5 transition-all text-right">
                  <div className="text-5xl mb-4">🇪🇸</div>
                  <h4 className="font-black text-xl text-white mb-1">اللغة الإسبانية</h4>
                  <p className="text-xs text-white/50 font-bold mb-4">الدرس الأول: غابات الشمال</p>
                  <div className="flex items-center gap-2 text-sm font-black text-[#F72585] group-hover:translate-x-[-5px] transition-transform">
                    <span>جرب الآن</span><ArrowRight size={16} className="rotate-180" />
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
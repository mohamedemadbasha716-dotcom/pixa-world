'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Crown, ArrowRight, Sparkle, CheckCircle, Shield, Star, Zap, Trophy } from 'lucide-react';

export default function PlansPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = (plan: 'monthly' | 'quarterly' | 'yearly') => {
    setLoadingPlan(plan);
    router.push(`/checkout?plan=${plan}&country=eg`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans overflow-x-hidden relative" dir="rtl">
      {/* خلفية */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 77, 109, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(6, 214, 160, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(157, 78, 221, 0.18) 0%, transparent 50%)
          `,
        }} />
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div key={i} className="absolute"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ scale: [0,1.5,0], opacity: [0,1,0], rotate: [0,180] }}
            transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 3 }}
          >
            <Sparkle size={10} className="text-yellow-200" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }}
        className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-[#1a1a3e]/50 sticky top-0 z-50"
      >
        <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/')}
        >
          <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-200">
            PIXA WORLD
          </span>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#9D4EDD] flex items-center justify-center font-black text-lg shadow-lg shadow-[#FF4D6D]/40">
            P
          </div>
        </motion.div>
      </motion.header>

      {/* المحتوى */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* العنوان */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D]/20 to-[#9D4EDD]/20 border border-[#FF4D6D]/30 px-5 py-2 rounded-full text-xs font-bold text-white backdrop-blur-sm"
          >
            <Sparkle size={14} className="text-yellow-300" />
            <span>اختار الخطة المناسبة لطفلك</span>
            <span className="text-lg">✨</span>
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-black flex items-center justify-center gap-3 flex-wrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
              ابدأ رحلة طفلك اليوم
            </span>
            <motion.span
              className="inline-block"
              animate={{ y: [0, -8, 0], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                WebkitTextFillColor: 'initial',
                filter: 'drop-shadow(0 4px 12px rgba(255,77,109,0.5))'
              }}
            >
              🚀
            </motion.span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto font-medium">
            3 خطط مرنة تناسب كل احتياجاتك — من لغة واحدة لجميع اللغات المتاحة والقادمة
          </p>
        </motion.div>

        {/* الخطط الثلاثة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 max-w-6xl mx-auto">

          {/* 1️⃣ الخطة الشهرية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative rounded-[28px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-[#4CC9F0]/10 to-[#4CC9F0]/5 border-2 border-[#4CC9F0]/40 shadow-2xl shadow-[#4CC9F0]/20 cursor-pointer group"
            onClick={() => handleSelectPlan('monthly')}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-[80px] bg-[#4CC9F0] opacity-20" />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#4CC9F0]/20 border border-[#4CC9F0]/40 text-[10px] font-black text-[#4CC9F0]">
              ⚡ الأنسب للتجربة
            </div>

            <div className="relative z-10 p-6 md:p-8 space-y-5">
              <div className="text-center space-y-3">
                <motion.div
                  animate={{ rotate: [0,10,-10,0], scale: [1,1.1,1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-5xl"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(76,201,240,0.5))' }}
                >⚡</motion.div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-white">الخطة الشهرية</h2>
                  <p className="text-[#4CC9F0] font-black text-xs">لغة واحدة من اختيارك</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-gray-500 text-lg font-bold line-through">400</span>
                    <span className="text-4xl font-black text-[#4CC9F0]">
                      200
                    </span>
                    <span className="text-gray-300 text-xs font-bold">جنيه / شهر</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-[#4CC9F0]/20 border border-[#4CC9F0]/40">
                    <span className="text-[10px] font-black text-[#4CC9F0]">🎁 وفر 50%</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#4CC9F0]/40 to-transparent" />

              <div className="space-y-2.5">
                {[
                  'لغة واحدة من اختيارك (ألماني أو إسباني)',
                  'أو أي لغة جديدة عند إضافتها',
                  'وصول كامل لكل دروس اللغة',
                  'نطق ناطقين أصليين',
                  'شهادات وأوسمة رقمية',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#4CC9F0]/25 flex-shrink-0">
                      <CheckCircle size={12} className="text-[#4CC9F0]" />
                    </div>
                    <span className="text-[12px] text-gray-200 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(76,201,240,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); handleSelectPlan('monthly'); }}
                disabled={loadingPlan === 'monthly'}
                className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#4CC9F0] to-[#4361EE] text-white shadow-lg shadow-[#4CC9F0]/40 disabled:opacity-70"
              >
                {loadingPlan === 'monthly' ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>جاري التحويل...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>اشترك شهرياً</span>
                    <ArrowRight size={14} className="rotate-180" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-[10px] text-gray-400 font-bold">💡 مرن — الغِ أي وقت</p>
            </div>
          </motion.div>

          {/* 2️⃣ الخطة الربع سنوية - الأكثر شعبية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative rounded-[28px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-[#9D4EDD]/15 to-[#F72585]/5 border-2 border-[#9D4EDD]/50 shadow-2xl shadow-[#9D4EDD]/30 cursor-pointer group md:scale-105"
            onClick={() => handleSelectPlan('quarterly')}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-[80px] bg-[#9D4EDD] opacity-30" />
            <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-black text-white z-10"
              style={{ background: 'linear-gradient(135deg, #9D4EDD, #F72585)', boxShadow: '0 4px 15px rgba(157,78,221,0.5)' }}
            >
              <div className="flex items-center justify-center gap-2">
                <Star size={14} fill="white" /><span>الأكثر شعبية 🔥</span><Star size={14} fill="white" />
              </div>
            </div>

            <div className="relative z-10 p-6 md:p-8 pt-12 space-y-5">
              <div className="text-center space-y-3">
                <motion.div
                  animate={{ y: [0,-8,0], rotate: [0,5,-5,0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-block text-5xl"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(157,78,221,0.5))' }}
                >🎯</motion.div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-white">الخطة الربع سنوية</h2>
                  <p className="text-[#F72585] font-black text-xs">3 أشهر — 3 لغات</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-gray-500 text-lg font-bold line-through">700</span>
                    <span className="text-4xl font-black"
                      style={{ backgroundImage: 'linear-gradient(135deg, #9D4EDD, #F72585)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      350
                    </span>
                    <span className="text-gray-300 text-xs font-bold">جنيه</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-[#F72585]/20 border border-[#F72585]/40">
                    <span className="text-[10px] font-black text-[#F72585]">🎁 وفر 50%</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#9D4EDD]/40 to-transparent" />

              <div className="space-y-2.5">
                {[
                  { text: '✅ اللغة الألمانية كاملة', highlight: false },
                  { text: '✅ اللغة الإسبانية كاملة', highlight: false },
                  { text: '🎁 لغة ثالثة مجاناً عند إضافتها', highlight: true },
                  { text: 'نطق ناطقين أصليين', highlight: false },
                  { text: 'شهادات وأوسمة رقمية', highlight: false },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#F72585]/25 flex-shrink-0">
                      <CheckCircle size={12} className="text-[#F72585]" />
                    </div>
                    <span className={`text-[12px] font-medium ${feature.highlight ? 'text-[#F72585] font-black' : 'text-gray-200'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(157,78,221,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); handleSelectPlan('quarterly'); }}
                disabled={loadingPlan === 'quarterly'}
                className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-lg shadow-[#9D4EDD]/40 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #9D4EDD, #F72585)' }}
              >
                {loadingPlan === 'quarterly' ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>جاري التحويل...</span>
                  </>
                ) : (
                  <>
                    <Star size={16} fill="white" />
                    <span>اشترك ربع سنوي</span>
                    <ArrowRight size={14} className="rotate-180" />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Shield size={12} />
                <span className="text-[10px] font-bold">آمن 100% | تفعيل فوري</span>
              </div>
            </div>
          </motion.div>

          {/* 3️⃣ الخطة السنوية - الأفضل قيمة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative rounded-[28px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-[#FFD700]/10 to-[#FF6B35]/5 border-2 border-[#FFD700]/40 shadow-2xl shadow-[#FFD700]/20 cursor-pointer group"
            onClick={() => handleSelectPlan('yearly')}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-[80px] bg-[#FFD700] opacity-20" />
            <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-black text-white z-10"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)', boxShadow: '0 4px 15px rgba(255,215,0,0.5)' }}
            >
              <div className="flex items-center justify-center gap-2">
                <Crown size={14} /><span>الأفضل قيمة 👑</span><Crown size={14} />
              </div>
            </div>

            <div className="relative z-10 p-6 md:p-8 pt-12 space-y-5">
              <div className="text-center space-y-3">
                <motion.div
                  animate={{ y: [0,-8,0], rotate: [0,5,-5,0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-block text-5xl"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(255,215,0,0.5))' }}
                >👑</motion.div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black text-white">الخطة السنوية</h2>
                  <p className="text-[#FFD700] font-black text-xs">شامل كل اللغات — دلوقتي والمستقبل</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-gray-500 text-lg font-bold line-through">1000</span>
                    <span className="text-4xl font-black"
                      style={{ backgroundImage: 'linear-gradient(135deg, #FFD700, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                    >
                      500
                    </span>
                    <span className="text-gray-300 text-xs font-bold">جنيه</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40">
                    <span className="text-[10px] font-black text-[#FFD700]">🎁 وفر 50%</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />

              <div className="space-y-2.5">
                {[
                  { text: '🏆 اللغات المتاحة حالياً: 🇩🇪 الألماني + 🇪🇸 الإسباني', highlight: true },
                  { text: '🎁 كل اللغات القادمة مجاناً مدى الحياة:', highlight: true },
                  { text: '(🇬🇧 إنجليزي، 🇫🇷 فرنساوي، 🇮🇹 إيطالي، 🇷🇺 روسي، 🇯🇵 ياباني، 🇨🇳 صيني، 🇹🇷 تركي، 🇰🇷 كوري)', highlight: false },
                  { text: '✨ شهادات وأوسمة رقمية لكل لغة عند الإنجاز', highlight: false },
                  { text: '👑 أولوية الدعم الفني والمساعدة للأبطال', highlight: false },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#FFD700]/25 flex-shrink-0">
                      <CheckCircle size={12} className="text-[#FFD700]" />
                    </div>
                    <span className={`text-[12px] font-medium ${feature.highlight ? 'text-[#FFD700] font-black' : 'text-gray-200'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); handleSelectPlan('yearly'); }}
                disabled={loadingPlan === 'yearly'}
                className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-lg shadow-[#FFD700]/40 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B35)' }}
              >
                {loadingPlan === 'yearly' ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>جاري التحويل...</span>
                  </>
                ) : (
                  <>
                    <Trophy size={16} />
                    <span>اشترك سنوياً</span>
                    <ArrowRight size={14} className="rotate-180" />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Shield size={12} />
                <span className="text-[10px] font-bold">آمن 100% | تفعيل فوري</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* رجوع */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="text-center mt-10"
        >
          <button onClick={() => router.push('/')}
            className="text-gray-400 text-sm font-bold hover:text-white transition-colors"
          >
            ← الرجوع للصفحة الرئيسية
          </button>
        </motion.div>
      </main>
    </div>
  );
}
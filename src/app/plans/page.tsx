'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Gift, Crown, ArrowRight, Sparkle, CheckCircle,
  Shield
} from 'lucide-react';

export default function PlansPage() {
  const router = useRouter();
  const [loadingPaid, setLoadingPaid] = useState(false);

  const handleFreePlan = () => {
    router.push('/character-and-map');
  };

  const handlePaidPlan = async () => {
    setLoadingPaid(true);
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      router.push(data.redirectPath || '/pricing/eg');
    } catch {
      router.push('/pricing/eg');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans overflow-x-hidden relative"
      dir="rtl"
    >
      {/* خلفية زخرفية */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 77, 109, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 30%, rgba(6, 214, 160, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(157, 78, 221, 0.18) 0%, transparent 50%)
            `,
          }}
        />
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Sparkle size={10} className="text-yellow-200" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-[#1a1a3e]/50 sticky top-0 z-50"
      >
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
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
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D]/20 to-[#9D4EDD]/20 border border-[#FF4D6D]/30 px-5 py-2 rounded-full text-xs font-bold text-white backdrop-blur-sm"
          >
            <Sparkle size={14} className="text-yellow-300" />
            <span>اختاري الخطة المناسبة لطفلك</span>
            <span className="text-lg">✨</span>
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            ابدئي رحلة طفلك اليوم 🚀
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto font-medium">
            جربي مجاناً أو ابدئي بخطة مدفوعة للاستفادة الكاملة من كل مميزات المنصة
          </p>
        </motion.div>

        {/* الخطتين */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* ═══ خطة مجانية ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative rounded-[28px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-[#06D6A0]/10 to-[#06D6A0]/5 border-2 border-[#06D6A0]/40 shadow-2xl shadow-[#06D6A0]/20 cursor-pointer group"
            onClick={handleFreePlan}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-[80px] bg-[#06D6A0] opacity-20" />

            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#06D6A0]/20 border border-[#06D6A0]/40 text-[10px] font-black text-[#06D6A0]">
              🎁 متاح فوراً
            </div>

            <div className="relative z-10 p-8 md:p-10 space-y-6">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-6xl"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(6,214,160,0.5))' }}
                >
                  🎁
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    خطة مجانية
                  </h2>
                  <p className="text-[#06D6A0] font-black text-sm">
                    جربي قبل ما تشتركي
                  </p>
                </div>

                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black text-[#06D6A0]">0</span>
                  <span className="text-gray-300 text-sm font-bold">مجاناً</span>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#06D6A0]/40 to-transparent" />

              <div className="space-y-3">
                {[
                  'أول درس كامل في الألمانية',
                  'ألعاب تفاعلية مجانية',
                  'نطق بصوت ناطقين أصليين',
                  'بدون بطاقة ائتمان',
                  'ابدأ فوراً في دقايق',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#06D6A0]/25 flex-shrink-0">
                      <CheckCircle size={12} className="text-[#06D6A0]" />
                    </div>
                    <span className="text-[13px] text-gray-200 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(6,214,160,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFreePlan}
                className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#06D6A0] to-[#4CC9F0] text-white shadow-lg shadow-[#06D6A0]/40"
              >
                <Gift size={18} />
                <span>ابدأ التجربة المجانية</span>
                <ArrowRight size={16} className="rotate-180" />
              </motion.button>

              <p className="text-center text-[11px] text-gray-400 font-bold">
                ⏱️ 5-10 دقائق فقط
              </p>
            </div>
          </motion.div>

          {/* ═══ خطة مدفوعة ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative rounded-[28px] overflow-hidden backdrop-blur-md bg-gradient-to-b from-[#FFD700]/10 to-[#FF6B35]/5 border-2 border-[#FFD700]/40 shadow-2xl shadow-[#FFD700]/20 cursor-pointer group"
            onClick={handlePaidPlan}
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-[80px] bg-[#FFD700] opacity-20" />

            <div
              className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-black text-white z-10"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
                boxShadow: '0 4px 15px rgba(255,215,0,0.5)',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Crown size={14} />
                <span>الأكثر شعبية</span>
                <Crown size={14} />
              </div>
            </div>

            <div className="relative z-10 p-8 md:p-10 pt-14 space-y-6">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-block text-6xl"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(255,215,0,0.5))' }}
                >
                  👑
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    خطة مدفوعة
                  </h2>
                  <p className="text-[#FFD700] font-black text-sm">
                    الاستفادة الكاملة من المنصة
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-gray-400 text-xs font-bold">اختاري الخطة الأنسب</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span
                      className="text-3xl font-black"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #FFD700, #FF6B35)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      شهري / ربع سنوي / سنوي
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />

              <div className="space-y-3">
                {[
                  { text: 'كل الدروس والألعاب', highlight: false },
                  { text: 'نطق ناطقين أصليين', highlight: false },
                  { text: 'شهادات وأوسمة رقمية', highlight: false },
                  { text: '🎁 لغات جديدة مجاناً (سنوي)', highlight: true },
                  { text: 'أولوية الدعم الفني', highlight: false },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#FFD700]/25 flex-shrink-0">
                      <CheckCircle size={12} className="text-[#FFD700]" />
                    </div>
                    <span
                      className={`text-[13px] font-medium ${
                        feature.highlight ? 'text-[#FFD700] font-black' : 'text-gray-200'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePaidPlan}
                disabled={loadingPaid}
                className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 text-white shadow-lg shadow-[#FFD700]/40 disabled:opacity-70"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
                }}
              >
                {loadingPaid ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>جاري التحويل...</span>
                  </>
                ) : (
                  <>
                    <Crown size={18} />
                    <span>شاهدي الأسعار</span>
                    <ArrowRight size={16} className="rotate-180" />
                  </>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Shield size={12} />
                <span className="text-[10px] font-bold">
                  ضمان استرجاع خلال 14 يوم
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* رجوع */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 text-sm font-bold hover:text-white transition-colors"
          >
            ← الرجوع للصفحة الرئيسية
          </button>
        </motion.div>
      </main>
    </div>
  );
}
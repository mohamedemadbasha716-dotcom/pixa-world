'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Bell, Sparkles, Star } from 'lucide-react';

// ⚠️ مهم: تعطيل الـ Static Generation للصفحة دي
export const dynamic = 'force-dynamic';

const LANGUAGES_INFO: Record<string, { 
  name: string; 
  nameEn: string; 
  flag: string; 
  color: string; 
  emoji: string;
  bgGradient: string;
}> = {
  spanish: { 
    name: 'الإسبانية', 
    nameEn: 'Spanish', 
    flag: '🇪🇸', 
    color: '#FF6B35',
    emoji: '💃',
    bgGradient: 'from-orange-900 via-red-900 to-yellow-900'
  },
  russian: { 
    name: 'الروسية', 
    nameEn: 'Russian', 
    flag: '🇷🇺', 
    color: '#9D4EDD',
    emoji: '🪆',
    bgGradient: 'from-purple-900 via-indigo-900 to-blue-900'
  },
  japanese: { 
    name: 'اليابانية', 
    nameEn: 'Japanese', 
    flag: '🇯🇵', 
    color: '#FF4D6D',
    emoji: '🌸',
    bgGradient: 'from-pink-900 via-red-900 to-rose-900'
  },
  chinese: { 
    name: 'الصينية', 
    nameEn: 'Chinese', 
    flag: '🇨🇳', 
    color: '#4CC9F0',
    emoji: '🐉',
    bgGradient: 'from-cyan-900 via-blue-900 to-teal-900'
  },
};

function ComingSoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || 'spanish';
  const langInfo = LANGUAGES_INFO[lang] || LANGUAGES_INFO.spanish;

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // TODO: هنا هنحفظ الإيميل في Supabase بعدين
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${langInfo.bgGradient} text-white flex flex-col items-center justify-center p-6 relative overflow-hidden`}
      style={{ fontFamily: "'Tajawal', sans-serif" }}
      dir="rtl"
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${(i * 5.3) % 100}%`,
              top: `${(i * 7.7) % 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 10 + (i % 5),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {langInfo.emoji}
          </motion.div>
        ))}
      </div>

      {/* زرار الرجوع */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/')}
        className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-5 py-3 text-sm font-bold text-white transition-all backdrop-blur-md z-20"
      >
        <ArrowLeft size={16} />
        العودة للرئيسية
      </motion.button>

      {/* المحتوى الرئيسي */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl w-full text-center space-y-8"
      >
        {/* الإيموجي الكبير */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-9xl mb-4"
        >
          🚧
        </motion.div>

        {/* العلم واسم اللغة */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-7xl"
          >
            {langInfo.flag}
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              منهج اللغة {langInfo.name}
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md border-2"
            style={{
              background: `${langInfo.color}33`,
              borderColor: langInfo.color,
            }}
          >
            <Sparkles size={20} style={{ color: langInfo.color }} />
            <span className="font-black text-lg">قريباً جداً!</span>
            <Sparkles size={20} style={{ color: langInfo.color }} />
          </motion.div>
        </div>

        {/* الوصف */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mx-auto font-medium"
        >
          إحنا بنحضرلك أحلى منهج لتعليم اللغة {langInfo.name} للأطفال! 
          <br />
          مغامرات مثيرة وألعاب تفاعلية في طريقها إليك 🎮✨
        </motion.p>

        {/* تسجيل الإيميل */}
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="max-w-md mx-auto space-y-4 pt-4"
          >
            <div className="flex items-center gap-2 text-white/90 font-bold text-sm justify-center mb-3">
              <Bell size={18} />
              <span>سجل إيميلك لتكون أول من يعرف!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="إيميلك هنا..."
                required
                className="flex-1 bg-white/10 border-2 border-white/20 focus:border-white rounded-2xl px-5 py-4 text-white placeholder:text-white/40 font-bold outline-none transition-all backdrop-blur-md"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 rounded-2xl font-black text-white shadow-lg disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${langInfo.color}, ${langInfo.color}cc)`,
                  boxShadow: `0 8px 25px ${langInfo.color}66`,
                }}
              >
                {isSubmitting ? '...جاري' : 'سجلني! 🔔'}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto p-6 rounded-2xl bg-white/15 border-2 border-white/30 backdrop-blur-md"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-black mb-2">تم التسجيل بنجاح!</h3>
            <p className="text-white/80 text-sm font-medium">
              هنبعتلك إيميل أول ما المنهج يكون جاهز 💌
            </p>
          </motion.div>
        )}

        {/* مميزات قادمة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8"
        >
          {[
            { icon: '🗺️', title: 'خريطة تفاعلية', desc: 'استكشف معالم البلد' },
            { icon: '🎮', title: 'ألعاب ممتعة', desc: 'تعلم وأنت تلعب' },
            { icon: '🏆', title: 'مكافآت وجوائز', desc: 'نقاط وشهادات' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.05 }}
              className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md"
            >
              <div className="text-4xl mb-2">{feature.icon}</div>
              <div className="font-black text-sm mb-1">{feature.title}</div>
              <div className="text-xs text-white/70 font-medium">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA للألماني */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="pt-6"
        >
          <p className="text-white/70 text-sm mb-4 font-medium">
            في الوقت ده، جرب منهج الألمانية المتاح حالياً! 🇩🇪
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/character-and-map')}
            className="px-8 py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-2xl shadow-yellow-500/30 flex items-center gap-2 mx-auto"
          >
            <Star size={20} fill="white" />
            ابدأ تعلم الألمانية الآن
            <Star size={20} fill="white" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-8xl animate-bounce">🚧</div>
        <div className="text-white text-2xl font-black">جاري التحميل...</div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ComingSoonContent />
    </Suspense>
  );
}
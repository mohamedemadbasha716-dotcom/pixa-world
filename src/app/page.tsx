'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, ArrowRight, Sparkle, Globe, Target,
  Star, Zap, BookOpen, Users, Trophy, Heart,
  ChevronLeft, ChevronRight, Play, Shield, Rocket,
  Brain, Gamepad2, GraduationCap, Languages
} from 'lucide-react';

const BOOKS_DATA = [
  { 
    id: 1, 
    title: 'اللغة الألمانية', 
    color: '#FFD700', 
    img: '/books/german.png', 
    students: '2,340', 
    flag: '🇩🇪', 
    desc: 'لغة الهندسة والابتكار',
    route: '/character-and-map',
    available: true,
    langCode: 'de'
  },
  { 
    id: 2, 
    title: 'اللغة الإسبانية', 
    color: '#FF6B35', 
    img: '/books/spain.png', 
    students: '3,120', 
    flag: '🇪🇸', 
    desc: 'لغة نصف العالم الغربي',
    route: '/coming-soon?lang=spanish',
    available: false,
    langCode: 'es'
  },
  { 
    id: 3, 
    title: 'اللغة الروسية', 
    color: '#9D4EDD', 
    img: '/books/russian.png', 
    students: '1,890', 
    flag: '🇷🇺', 
    desc: 'لغة الفضاء والعلوم',
    route: '/coming-soon?lang=russian',
    available: false,
    langCode: 'ru'
  },
  { 
    id: 4, 
    title: 'اللغة اليابانية', 
    color: '#FF4D6D', 
    img: '/books/japanese.png', 
    students: '2,750', 
    flag: '🇯🇵', 
    desc: 'لغة التكنولوجيا والأنمي',
    route: '/coming-soon?lang=japanese',
    available: false,
    langCode: 'ja'
  },
  { 
    id: 5, 
    title: 'اللغة الصينية', 
    color: '#4CC9F0', 
    img: '/books/chinees.png', 
    students: '4,100', 
    flag: '🇨🇳', 
    desc: 'لغة اقتصاد المستقبل',
    route: '/coming-soon?lang=chinese',
    available: false,
    langCode: 'zh'
  },
];

const MARKETING_MESSAGES = [
  {
    icon: Brain,
    color: '#FF4D6D',
    title: 'التأسيس في سن الذهب (6-11 سنة)',
    desc: 'العقل في السن ده بيمتص اللغات كالإسفنج. منهجنا موجه وبيقدم عمق علمي حقيقي لجيل الشاشات بأسلوب ألعاب تفاعلي يخليه عايز يكمل.',
    stat: '95%',
    statLabel: 'نسبة الاستيعاب'
  },
  {
    icon: Globe,
    color: '#4CC9F0',
    title: 'لغات المستقبل النادرة وأهميتها',
    desc: 'تأسيس طفلك في اليابانية والصينية والروسية بيدي له ميزة تنافسية خارقة عالمياً، وبيوسع مداركه العقلية من صغره ليتحدث لغات اقتصاد المستقبل.',
    stat: '5',
    statLabel: 'لغات متاحة'
  },
  {
    icon: Gamepad2,
    color: '#9D4EDD',
    title: 'التعلم عن طريق اللعب والمغامرة',
    desc: 'كل درس هو مغامرة مثيرة! طفلك يجمع نقاط ويفتح عوالم جديدة ويتنافس مع أصحابه. التعلم عندنا مش واجب، ده لعبة مفضلة!',
    stat: '50+',
    statLabel: 'لعبة تعليمية'
  },
  {
    icon: Shield,
    color: '#06D6A0',
    title: 'بيئة آمنة 100% للأطفال',
    desc: 'المنصة مصممة خصيصاً للأطفال بدون إعلانات أو محتوى غير مناسب. الأهل يقدروا يتابعوا تقدم أطفالهم بتقارير أسبوعية مفصلة.',
    stat: '100%',
    statLabel: 'بيئة آمنة'
  },
  {
    icon: Trophy,
    color: '#FFD700',
    title: 'نظام مكافآت يحفز الاستمرار',
    desc: 'شهادات رقمية، أوسمة بطل اللغات، وترتيب أبطال أسبوعي. طفلك هيحس بالإنجاز في كل خطوة وهيحب يتعلم أكتر وأكتر!',
    stat: '10K+',
    statLabel: 'بطل مسجل'
  },
  {
    icon: Rocket,
    color: '#FF6B35',
    title: 'منهج علمي معتمد ومُجرّب',
    desc: 'المنهج مبني على أبحاث علمية في تعليم اللغات للأطفال ومراجع من خبراء لغويين عالميين. كل مرحلة مصممة بعناية لتحقيق أقصى استفادة.',
    stat: '12',
    statLabel: 'مرحلة تعليمية'
  },
];

const FLOATING_EMOJIS = ['🌟', '🎮', '🚀', '🎯', '✨', '🏆', '💡', '🎪'];

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 77, 109, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 30%, rgba(76, 201, 240, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(157, 78, 221, 0.18) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 10% 90%, rgba(255, 107, 53, 0.12) 0%, transparent 50%)
        `
      }} />

      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            width: 200 + Math.random() * 200,
            height: 200 + Math.random() * 200,
            background: `radial-gradient(circle, ${['#FF4D6D', '#4CC9F0', '#9D4EDD', '#FFD700', '#FF6B35', '#06D6A0'][i]}20 0%, transparent 70%)`,
            left: `${(i * 18) % 100}%`,
            top: `${(i * 25) % 100}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            background: ['#FF4D6D', '#4CC9F0', '#9D4EDD', '#FFD700', '#FF6B35', '#06D6A0', '#ffffff'][Math.floor(Math.random() * 7)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute rounded-full border-2 hidden md:block"
          style={{
            width: 60 + Math.random() * 80,
            height: 60 + Math.random() * 80,
            borderColor: ['#FF4D6D', '#4CC9F0', '#9D4EDD', '#FFD700'][i % 4] + '30',
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            rotate: { duration: 20 + i * 3, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}

      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
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
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        >
          <Sparkle size={12} className="text-yellow-200" style={{ filter: 'drop-shadow(0 0 8px gold)' }} />
        </motion.div>
      ))}
    </div>
  );
}

export default function PixiHomePage() {
  const [activeBook, setActiveBook] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((p) => (p + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const enableSound = () => {
      if (videoRef.current && !soundEnabled) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1;
        setSoundEnabled(true);
      }
    };

    const events = ['click', 'scroll', 'mousemove', 'touchstart', 'keydown'];
    events.forEach(e => window.addEventListener(e, enableSound, { once: true }));

    return () => {
      events.forEach(e => window.removeEventListener(e, enableSound));
    };
  }, [soundEnabled]);

  const testimonials = [
    { name: 'سارة أحمد', role: 'أم لطفلين', text: 'أطفالي بقوا يحبوا يتعلموا لغات! المنصة حولت التعلم للعبة مسلية 🎮', avatar: '👩' },
    { name: 'محمد علي', role: 'أب لثلاثة أطفال', text: 'ابني بقى يتكلم يابانى بعد 3 شهور بس! مش مصدق النتيجة 🇯🇵', avatar: '👨' },
    { name: 'نورا خالد', role: 'معلمة لغات', text: 'كمعلمة لغات، المنهج ده من أفضل المناهج اللي شفتها للأطفال 📚', avatar: '👩‍🏫' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans overflow-x-hidden selection:bg-[#FF4D6D] selection:text-white relative" dir="rtl">
      <FloatingParticles />

      {/* 1. الهيدر */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-[#1a1a3e]/50 sticky top-0 z-50"
      >
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10">
            <span>تسجيل دخول الأبطال</span>
            <span className="text-lg">👋</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,77,109,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#FF4D6D] to-[#F72585] text-white px-7 py-3 rounded-2xl font-black text-sm shadow-lg shadow-[#FF4D6D]/30 flex items-center gap-2"
          >
            <Rocket size={16} />
            ابدأ المغامرة مجاناً
          </motion.button>
        </div>
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-200">
            PIXA WORLD
          </span>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] via-[#F72585] to-[#9D4EDD] flex items-center justify-center font-black text-xl shadow-lg shadow-[#FF4D6D]/40"
          >
            P
          </motion.div>
        </motion.div>
      </motion.header>

      {/* 2. الهيرو - النسخة المحسّنة */}
      <section className="relative w-full max-w-5xl mx-auto text-center px-6 pt-20 pb-12 space-y-8 z-10">
        {/* الإيموجي على الجوانب فقط */}
        {FLOATING_EMOJIS.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-xl opacity-20 pointer-events-none hidden lg:block"
            style={{
              left: i < 4 ? `${2 + (i * 4)}%` : `${82 + ((i - 4) * 4)}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.span>
        ))}

        {/* الشارة العلوية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D]/20 to-[#9D4EDD]/20 border border-[#FF4D6D]/30 px-5 py-2 rounded-full text-xs font-bold text-white mx-auto backdrop-blur-sm shadow-lg shadow-[#FF4D6D]/10"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Sparkle size={14} className="text-yellow-300" />
          </motion.div>
          <span>عالم ألعاب تعليمي متكامل للأطفال من 6-11 سنة</span>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            ✨
          </motion.div>
        </motion.div>

        {/* 🎯 العنوان الرئيسي - النسخة المتنسقة */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-black leading-[1.3] space-y-3"
        >
          <div className="text-2xl md:text-4xl text-white drop-shadow-2xl">
            خلي طفلك يتكلم
          </div>
          <div className="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D6D] via-[#F72585] to-[#9D4EDD] drop-shadow-[0_0_30px_rgba(247,37,133,0.5)]">
            5 لغات نادرة
          </div>
          <div className="text-2xl md:text-4xl text-white drop-shadow-2xl flex items-center justify-center gap-3">
            <span>قبل ما يدخل إعدادي</span>
            <motion.span
              animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀
            </motion.span>
          </div>
        </motion.h1>

        {/* 🌍 الرسالة الذهبية - النسخة المحسّنة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative max-w-3xl mx-auto px-6 py-4 rounded-2xl border-2 backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.10))',
            borderColor: 'rgba(255,215,0,0.4)',
            boxShadow: '0 0 40px rgba(255,215,0,0.2)',
          }}
        >
          <p className="text-lg md:text-2xl font-black text-center"
            style={{
              color: '#FFD700',
              textShadow: '0 0 15px rgba(255,215,0,0.6), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            🌍 اللي مش بيتعلموه في المدرسة... طفلك هيتعلمه عندنا
          </p>
        </motion.div>

        {/* 📝 الوصف المحسّن */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
        >
          المنصة العربية الوحيدة اللي بتأسس طفلك في <span className="text-[#FFD700] font-black">5 لغات عالمية نادرة</span> من الصفر للاحتراف، بنظام مستويات تدريجي وأسلوب ألعاب يحبه الأطفال 🎮
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 pt-4"
        >
          {[
            { icon: Users, value: '10,000+', label: 'طالب نشط', color: '#FF4D6D' },
            { icon: Languages, value: '5', label: 'لغات عالمية', color: '#4CC9F0' },
            { icon: Gamepad2, value: '50+', label: 'لعبة تعليمية', color: '#9D4EDD' },
            { icon: Star, value: '4.9', label: 'تقييم الأهل', color: '#FFD700' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-3 bg-white/[0.08] border border-white/15 px-5 py-3 rounded-2xl backdrop-blur-md cursor-default shadow-lg"
            >
              <stat.icon size={20} style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color}80)` }} />
              <div className="text-right">
                <div className="text-lg font-black" style={{ color: stat.color, textShadow: `0 0 15px ${stat.color}60` }}>{stat.value}</div>
                <div className="text-[10px] text-gray-300 font-bold">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. كوفر فيديو */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-20 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative rounded-[32px] border-2 border-white/15 overflow-hidden shadow-2xl shadow-[#FF4D6D]/20 group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF4D6D]/15 via-transparent to-[#4361EE]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />

          <video
            ref={videoRef}
            src="/videos/cover-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />

          <AnimatePresence>
            {!soundEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-white shadow-lg"
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  🔇
                </motion.span>
                <span>اضغط أو حرك الماوس لتشغيل الصوت</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a3e] to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* 4. الرسائل التسويقية */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-24 space-y-12 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#9D4EDD]/20 border border-[#9D4EDD]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#c084fc] backdrop-blur-sm">
            <Sparkles size={14} />
            مميزات حصرية
          </div>
          <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            ليه بيكسا وورلد؟
          </h2>
          <p className="text-gray-300 text-sm max-w-lg mx-auto">
            اكتشف كل المميزات اللي بتخلي أطفالك يحبوا تعلم اللغات
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETING_MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative p-7 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] hover:border-white/25 transition-all duration-500 group cursor-default overflow-hidden backdrop-blur-sm shadow-xl"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ backgroundColor: msg.color }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: msg.color + '20',
                      border: `1px solid ${msg.color}40`,
                      boxShadow: `0 0 20px ${msg.color}20`
                    }}
                  >
                    <msg.icon size={26} style={{ color: msg.color, filter: `drop-shadow(0 0 8px ${msg.color}80)` }} />
                  </motion.div>
                  <div className="text-left">
                    <div className="text-2xl font-black" style={{ color: msg.color, textShadow: `0 0 15px ${msg.color}60` }}>{msg.stat}</div>
                    <div className="text-[9px] text-gray-400 font-bold">{msg.statLabel}</div>
                  </div>
                </div>

                <h3 className="text-base font-black mb-3 text-white/95 leading-relaxed">{msg.title}</h3>
                <p className="text-gray-300 font-medium text-[13px] leading-[1.8]">{msg.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. عرض الكتب */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-28 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#4CC9F0]/20 border border-[#4CC9F0]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#7dd3fc] backdrop-blur-sm">
            <BookOpen size={14} />
            اختار لغتك
          </div>
          <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            5 لغات عالمية في انتظارك
          </h2>
          <p className="text-gray-300 text-sm">اضغط على أي كتاب وابدأ رحلتك التعليمية</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6 pt-10">
          {BOOKS_DATA.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="relative group cursor-pointer flex flex-col items-center"
              onHoverStart={() => setActiveBook(book.id)}
              onHoverEnd={() => setActiveBook(null)}
              onClick={() => window.location.href = book.route}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  backgroundColor: book.color,
                  width: '180px',
                  height: '220px',
                  filter: 'blur(60px)',
                }}
                animate={{
                  opacity: activeBook === book.id ? 0.55 : 0,
                  scale: activeBook === book.id ? 1.3 : 0.6,
                }}
                transition={{ duration: 0.5 }}
              />

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] rounded-full pointer-events-none"
                style={{
                  backgroundColor: book.color,
                  width: '120px',
                  height: '160px',
                  filter: 'blur(35px)',
                }}
                animate={{
                  opacity: activeBook === book.id ? 0.75 : 0,
                  scale: activeBook === book.id ? 1.1 : 0.5,
                }}
                transition={{ duration: 0.4 }}
              />

              <AnimatePresence>
                {activeBook === book.id && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                        style={{ backgroundColor: book.color, boxShadow: `0 0 10px ${book.color}` }}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                          x: Math.cos((i * Math.PI) / 4) * 80,
                          y: Math.sin((i * Math.PI) / 4) * 80,
                          opacity: [0, 1, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              <motion.div
                className="relative w-full h-56 flex items-center justify-center mb-5 z-10"
                animate={{
                  y: activeBook === book.id ? -15 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.img
                  src={book.img}
                  alt={book.title}
                  className="max-w-[150px] max-h-full object-contain"
                  style={{
                    filter: activeBook === book.id
                      ? `drop-shadow(0 0 25px ${book.color}) drop-shadow(0 15px 30px rgba(0,0,0,0.6))`
                      : 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
                    opacity: book.available ? 1 : 0.85,
                  }}
                  animate={{
                    rotate: activeBook === book.id ? [0, -4, 4, -2, 0] : 0,
                    scale: activeBook === book.id ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.6 }}
                />

                <motion.div
                  className="absolute -top-2 right-1/2 translate-x-1/2 z-20"
                  animate={{
                    opacity: activeBook === book.id ? 1 : 0,
                    y: activeBook === book.id ? 0 : -10,
                  }}
                >
                  <div
                    className="px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: book.color + '30',
                      borderColor: book.color + '60',
                    }}
                  >
                    <Users size={10} style={{ color: book.color }} />
                    <span className="text-[10px] font-black" style={{ color: book.color }}>
                      {book.students}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="text-center space-y-2 relative z-10"
                animate={{
                  y: activeBook === book.id ? -10 : 0,
                }}
              >
                <motion.div
                  className="text-3xl mb-1"
                  animate={{
                    scale: activeBook === book.id ? 1.3 : 1,
                    rotate: activeBook === book.id ? [0, 15, -15, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {book.flag}
                </motion.div>

                <motion.h3
                  className="text-sm font-black transition-colors duration-300"
                  style={{
                    color: activeBook === book.id ? book.color : '#ffffff',
                    textShadow: activeBook === book.id ? `0 0 20px ${book.color}80` : 'none',
                  }}
                >
                  {book.title}
                </motion.h3>

                <motion.p
                  className="text-[10px] text-gray-300 font-medium px-2"
                  animate={{
                    opacity: activeBook === book.id ? 1 : 0.7,
                  }}
                >
                  {book.desc}
                </motion.p>

                <motion.div
                  className="overflow-hidden pt-2"
                  animate={{
                    height: activeBook === book.id ? 40 : 0,
                    opacity: activeBook === book.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 mx-auto"
                    style={{
                      background: book.available 
                        ? `linear-gradient(135deg, ${book.color}, ${book.color}dd)`
                        : 'linear-gradient(135deg, #6b7280, #4b5563)',
                      color: '#fff',
                      boxShadow: book.available 
                        ? `0 8px 20px ${book.color}50`
                        : '0 8px 20px rgba(107, 114, 128, 0.4)',
                    }}
                  >
                    {book.available ? (
                      <>
                        <Sparkles size={12} />
                        ابدأ التعلم
                      </>
                    ) : (
                      <>
                        <span>🔔</span>
                        اعرف موعد النزول
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. آراء الأهالي */}
      <section className="w-full max-w-4xl mx-auto px-6 mb-24 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 border border-[#FFD700]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#fde047] backdrop-blur-sm">
            <Heart size={14} />
            آراء الأهالي
          </div>
          <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            ايه رأي أهالي الأبطال؟
          </h2>
        </motion.div>

        <div className="relative h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.15] text-center space-y-4 backdrop-blur-md shadow-2xl">
                <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
                <p className="text-white/90 text-base font-medium leading-relaxed">
                  &quot;{testimonials[currentTestimonial].text}&quot;
                </p>
                <div>
                  <div className="font-black text-sm text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-[11px] text-gray-300">{testimonials[currentTestimonial].role}</div>
                </div>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="#FFD700" className="text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 4px gold)' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTestimonial(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentTestimonial
                  ? 'bg-[#FF4D6D] w-8 shadow-lg shadow-[#FF4D6D]/50'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="w-full max-w-4xl mx-auto px-6 mb-24 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-[#FF4D6D]/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D6D] via-[#F72585] to-[#9D4EDD]" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />

          <div className="relative p-10 md:p-16 text-center space-y-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              جاهز تبدأ المغامرة؟
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-md mx-auto font-medium">
              سجل مجاناً دلوقتي وخلي طفلك يبدأ رحلة تعلم اللغات بأسلوب ممتع ومختلف!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/character-and-map'}
                className="bg-white text-[#F72585] px-10 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center gap-3"
              >
                <GraduationCap size={20} />
                ابدأ مجاناً الآن
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/15 border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2"
              >
                <Play size={16} />
                شاهد الفيديو التعريفي
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 8. الفوتر */}
      <footer className="w-full bg-[#0f0a24]/80 backdrop-blur-xl border-t border-white/10 z-10 relative">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#9D4EDD] flex items-center justify-center font-black text-lg shadow-lg shadow-[#FF4D6D]/30">P</div>
                <span className="text-xl font-black">PIXA WORLD</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                منصة تعليمية تفاعلية تحول تعلم اللغات لمغامرة مثيرة للأطفال من 6-11 سنة. 5 لغات عالمية بأسلوب ألعاب مبتكر.
              </p>
              <div className="flex gap-3">
                {['🐦', '📘', '📸', '🎵'].map((icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, y: -3 }}
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm text-white">روابط سريعة</h4>
              {['عن بيكسا وورلد', 'المنهج التعليمي', 'الأسعار', 'تواصل معنا'].map((link, i) => (
                <a key={i} href="#" className="block text-gray-300 text-sm hover:text-[#4CC9F0] transition-colors font-medium">
                  {link}
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-sm text-white">اللغات المتاحة</h4>
              {BOOKS_DATA.map((book) => (
                <a 
                  key={book.id} 
                  href={book.route} 
                  className="block text-gray-300 text-sm hover:text-[#FF4D6D] transition-colors font-medium"
                >
                  {book.flag} {book.title}
                  {!book.available && <span className="text-[9px] text-yellow-400 mr-2">(قريباً)</span>}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-gray-400 font-bold">
              © {new Date().getFullYear()} بيكسا وورلد. جميع الحقوق محفوظة 🎮✨
            </p>
            <div className="flex gap-6 text-[11px] text-gray-400 font-bold">
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
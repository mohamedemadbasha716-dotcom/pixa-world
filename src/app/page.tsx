'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, ArrowRight, Sparkle, Globe, Target,
  Star, Zap, BookOpen, Users, Trophy, Heart,
  ChevronLeft, ChevronRight, Play, Shield, Rocket,
  Brain, Gamepad2, GraduationCap, Languages, CheckCircle,
  Clock, Award, Volume2
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
    title: 'السن الذهبي للتعلم (6-11 سنة)',
    desc: 'في السن ده، عقل طفلك بيمتص اللغات زي الإسفنج. منهجنا مصمم يستغل الفترة دي بأسلوب ألعاب تفاعلي يخلي طفلك يتعلم وهو مستمتع — مش مجبر.',
    stat: '95%',
    statLabel: 'نسبة الاستيعاب'
  },
  {
    icon: Globe,
    color: '#4CC9F0',
    title: 'لغات المستقبل اللي مش في المدارس',
    desc: 'تأسيس طفلك في الألمانية والصينية واليابانية بيديله ميزة تنافسية عالمية، وبيوسع مداركه العقلية من صغره في لغات اقتصاد المستقبل.',
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

const HOW_IT_WORKS_STEPS = [
  {
    icon: GraduationCap,
    color: '#FF4D6D',
    title: 'سجّلي طفلك',
    desc: 'أنشئي حساب مجاني في أقل من دقيقة وحددي عمر طفلك ومستواه',
    emoji: '📝',
    step: 1
  },
  {
    icon: Languages,
    color: '#4CC9F0',
    title: 'اختاري اللغة',
    desc: 'اختاري من 5 لغات عالمية نادرة اللغة اللي عايزة تأسسي فيها طفلك',
    emoji: '🌍',
    step: 2
  },
  {
    icon: Gamepad2,
    color: '#9D4EDD',
    title: 'يبدأ المغامرة',
    desc: 'طفلك يدخل عالم ألعاب تفاعلي ويبدأ يتعلم بالصوت والصورة والتفاعل',
    emoji: '🎮',
    step: 3
  },
  {
    icon: Trophy,
    color: '#FFD700',
    title: 'يتقدم ويتفوق',
    desc: 'يجمع نقاط ويفتح مستويات جديدة ويحصل على شهادات وأوسمة تحفزه يكمل',
    emoji: '🏆',
    step: 4
  },
];

const FLOATING_EMOJIS = ['🌟', '🎮', '🚀', '🎯', '✨', '🏆'];

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

      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
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

      {Array.from({ length: 6 }).map((_, i) => (
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

      {Array.from({ length: 10 }).map((_, i) => (
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
    { name: 'سارة أحمد', role: 'أم لطفلين', text: 'أطفالي بقوا يحبوا يتعلموا لغات! المنصة حولت التعلم للعبة مسلية وبقوا يطلبوا يفتحوها كل يوم', avatar: '👩', rating: 5 },
    { name: 'محمد علي', role: 'أب لثلاثة أطفال', text: 'ابني بقى ينطق كلمات يابانية صح بعد 3 شهور بس! المنهج فعلاً مختلف ومبني صح', avatar: '👨', rating: 5 },
    { name: 'نورا خالد', role: 'معلمة لغات', text: 'كمعلمة لغات بشهد إن المنهج ده من أفضل اللي شفتها للأطفال. التدرج والتفاعل فيه ممتاز', avatar: '👩‍🏫', rating: 5 },
    { name: 'أحمد حسن', role: 'أب لطفلة', text: 'بنتي عمرها 7 سنين وبقت تقول كلمات ألمانية! الموضوع بالنسبالها لعبة مش درس', avatar: '👨', rating: 5 },
    { name: 'منى سعيد', role: 'أم لثلاث بنات', text: 'أخيراً لقيت حاجة تعليمية آمنة ومفيدة لبناتي. البيئة نضيفة والمحتوى ممتاز', avatar: '👩', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans overflow-x-hidden selection:bg-[#FF4D6D] selection:text-white relative" dir="rtl">
      <FloatingParticles />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 1. الهيدر */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4 flex justify-between items-center gap-2 border-b border-white/10 backdrop-blur-xl bg-[#1a1a3e]/50 sticky top-0 z-50"
      >
        <div className="flex items-center gap-2 md:gap-3 order-2">
          <button className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white/10">
            <span>تسجيل دخول الأبطال</span>
            <span className="text-lg">👋</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,77,109,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/character-and-map'}
            className="bg-gradient-to-r from-[#FF4D6D] to-[#F72585] text-white px-3 md:px-7 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm shadow-lg shadow-[#FF4D6D]/30 flex items-center gap-1.5 md:gap-2 whitespace-nowrap"
          >
            <Rocket size={14} className="md:w-4 md:h-4" />
            <span>ابدأ المغامرة</span>
            <span className="hidden md:inline">مجاناً</span>
          </motion.button>
        </div>

        <motion.div
          className="flex items-center gap-2 md:gap-3 cursor-pointer order-1 flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.location.href = '/'}
        >
          <span className="text-base md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-200 whitespace-nowrap">
            PIXA WORLD
          </span>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#FF4D6D] via-[#F72585] to-[#9D4EDD] flex items-center justify-center font-black text-base md:text-xl shadow-lg shadow-[#FF4D6D]/40 flex-shrink-0"
          >
            P
          </motion.div>
        </motion.div>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 2. الهيرو - النسخة الاحترافية الجديدة */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full max-w-5xl mx-auto text-center px-6 pt-16 md:pt-24 pb-12 space-y-8 z-10">

        {FLOATING_EMOJIS.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-xl opacity-15 pointer-events-none hidden lg:block"
            style={{
              left: i < 3 ? `${2 + (i * 5)}%` : `${82 + ((i - 3) * 5)}%`,
              top: `${20 + (i % 3) * 25}%`,
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

        {/* Badge علوي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D]/20 to-[#9D4EDD]/20 border border-[#FF4D6D]/30 px-5 py-2 rounded-full text-xs font-bold text-white mx-auto backdrop-blur-sm shadow-lg shadow-[#FF4D6D]/10"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Sparkle size={14} className="text-yellow-300" />
          </motion.div>
          <span>أول منصة عربية لتأسيس الأطفال في لغات المستقبل</span>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            🌍
          </motion.div>
        </motion.div>

        {/* العنوان الرئيسي */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-5 py-4"
        >
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-4xl font-black text-white/90"
            style={{ textShadow: '0 2px 20px rgba(255,255,255,0.15)' }}
          >
            ابنك ممكن يتكلم ألماني وصيني
          </motion.h2>

         <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
  className="relative inline-flex items-center justify-center gap-4 flex-wrap"
>
<h1
  className="relative text-5xl md:text-8xl bg-clip-text text-transparent px-2"
  style={{
    backgroundImage: 'linear-gradient(135deg, #FF4D6D, #F72585, #9D4EDD)',
    WebkitTextFillColor: 'transparent',
    fontFamily: "'Baloo Bhaijaan 2', sans-serif",
    fontWeight: 800,
    lineHeight: '1.4',
    paddingBottom: '0.2em',
  }}
>
  وهو بيلعب!
</h1>

  <motion.span
    className="text-5xl md:text-7xl inline-block"
    animate={{
      rotate: [0, -10, 10, -5, 0],
      y: [0, -8, 0],
    }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
  >
    🎮
  </motion.span>
</motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <h2
              className="text-xl md:text-3xl font-bold text-white/80"
              style={{ textShadow: '0 2px 15px rgba(255,255,255,0.1)' }}
            >
              تأسيس حقيقي من سن 6 لـ 11 سنة
            </h2>
            <motion.span
              className="text-3xl md:text-4xl inline-block"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ filter: 'drop-shadow(0 0 15px rgba(255,77,109,0.6))' }}
            >
              🚀
            </motion.span>
          </motion.div>
        </motion.div>

        {/* البوكس الذهبي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative max-w-3xl mx-auto px-6 py-5 rounded-2xl border-2 backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,107,53,0.08))',
            borderColor: 'rgba(255,215,0,0.35)',
            boxShadow: '0 0 40px rgba(255,215,0,0.15)',
          }}
        >
          <p
            className="text-base md:text-xl font-black text-center leading-relaxed"
            style={{
              color: '#FFD700',
              textShadow: '0 0 15px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            مش دروس تقليدية ولا كتب مملة… دي مغامرة تعليمية بصوت وصورة وتفاعل
            <br />
            في لغات مش هتلاقيها في أي مدرسة 🌍
          </p>
        </motion.div>

        {/* الوصف */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium"
        >
          مع <span className="text-[#FF4D6D] font-black" dir="ltr">PIXA WORLD</span> طفلك هيتأسس في{' '}
          <span className="text-[#FFD700] font-black">الألماني، الصيني، الياباني، الإسباني، والروسي</span>{' '}
          بنظام مستويات تدريجي وأسلوب ألعاب يخليه عايز يكمل كل يوم
        </motion.p>

        {/* أزرار CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,77,109,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/character-and-map'}
            className="bg-gradient-to-r from-[#FF4D6D] to-[#F72585] text-white px-10 py-4 rounded-2xl font-black text-base shadow-2xl shadow-[#FF4D6D]/30 flex items-center gap-3"
          >
            <Rocket size={20} />
            ابدئي رحلة طفلك الآن
            <ArrowRight size={18} className="rotate-180" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-white/15 transition-colors"
          >
            <Play size={16} />
            شاهدي كيف يتعلم
          </motion.button>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 pt-6"
        >
          {[
            { icon: Languages, value: '5 لغات', label: 'عالمية نادرة', color: '#4CC9F0' },
            { icon: Gamepad2, value: '50+', label: 'لعبة تعليمية', color: '#9D4EDD' },
            { icon: Shield, value: '100%', label: 'بيئة آمنة', color: '#06D6A0' },
            { icon: Star, value: '4.9 ⭐', label: 'تقييم الأهل', color: '#FFD700' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, y: -3 }}
              className="flex items-center gap-2.5 bg-white/[0.06] border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md cursor-default"
            >
              <stat.icon size={18} style={{ color: stat.color, filter: `drop-shadow(0 0 6px ${stat.color}80)` }} />
              <div className="text-right">
                <div className="text-sm font-black" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}50` }}>
                  {stat.value}
                </div>
                <div className="text-[9px] text-gray-400 font-bold">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* شريط الأعلام */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex justify-center gap-4 pt-4"
        >
          {BOOKS_DATA.map((book, i) => (
            <motion.div
              key={book.id}
              className="flex flex-col items-center gap-1 cursor-pointer group"
              whileHover={{ scale: 1.2, y: -5 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ y: { duration: 2, repeat: Infinity, delay: i * 0.3 } }}
              onClick={() => window.location.href = book.route}
            >
              <span className="text-2xl md:text-3xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}>
                {book.flag}
              </span>
              <span className="text-[8px] text-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {book.title.replace('اللغة ', '')}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. فيديو تعريفي */}
      {/* ═══════════════════════════════════════════════════════════ */}
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
                <span>اضغط لتشغيل الصوت</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a3e] to-transparent pointer-events-none" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. إزاي بتشتغل المنصة - HOW IT WORKS (قسم جديد) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-24 space-y-12 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#06D6A0]/20 border border-[#06D6A0]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#6ee7b7] backdrop-blur-sm">
            <Target size={14} />
            في 4 خطوات بس
          </div>
          <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            إزاي طفلك يبدأ؟
          </h2>
          <p className="text-gray-300 text-sm max-w-lg mx-auto">
            العملية سهلة وبسيطة — في دقائق طفلك هيبدأ مغامرته التعليمية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="relative p-7 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] hover:border-white/25 transition-all duration-500 group cursor-default overflow-hidden backdrop-blur-sm shadow-xl text-center"
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                style={{ backgroundColor: step.color }}
              />

              <div className="relative z-10 space-y-4">
                {/* رقم الخطوة */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto font-black text-lg"
                  style={{
                    backgroundColor: step.color + '25',
                    border: `2px solid ${step.color}50`,
                    color: step.color,
                    boxShadow: `0 0 15px ${step.color}30`,
                  }}
                >
                  {step.step}
                </div>

                <motion.div
                  className="text-4xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {step.emoji}
                </motion.div>

                <h3 className="text-base font-black text-white/95">{step.title}</h3>
                <p className="text-gray-300 font-medium text-[12px] leading-[1.8]">{step.desc}</p>
              </div>

              {/* السهم بين الخطوات - يظهر بس في الديسكتوب */}
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 z-20">
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronLeft size={20} className="text-white/30" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 5. ليه تختار PIXA WORLD - المميزات */}
      {/* ═══════════════════════════════════════════════════════════ */}
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
          <h2 className="text-3xl md:text-5xl font-black flex items-center justify-center gap-3 flex-wrap">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
              ليه تختار
            </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #FF4D6D, #F72585, #9D4EDD)',
                filter: 'drop-shadow(0 0 20px rgba(247,37,133,0.4))',
              }}
              dir="ltr"
            >
              PIXA WORLD
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
              ؟
            </span>
          </h2>
          <p className="text-gray-300 text-sm max-w-lg mx-auto">
            اكتشفي كل المميزات اللي بتخلي أطفالك يحبوا تعلم اللغات
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. عرض الكتب - اللغات المتاحة */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-28 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#4CC9F0]/20 border border-[#4CC9F0]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#7dd3fc] backdrop-blur-sm">
            <BookOpen size={14} />
            اختاري لغة طفلك
          </div>
          <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            5 لغات عالمية في انتظار طفلك
          </h2>
          <p className="text-gray-300 text-sm">اضغطي على أي كتاب وابدئي رحلة طفلك التعليمية</p>
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
                animate={{ y: activeBook === book.id ? -15 : 0 }}
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
                animate={{ y: activeBook === book.id ? -10 : 0 }}
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
                  animate={{ opacity: activeBook === book.id ? 1 : 0.7 }}
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 7. آراء الأهالي - محسّن */}
      {/* ═══════════════════════════════════════════════════════════ */}
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
            إيه رأي أهالي الأبطال؟
          </h2>
          <p className="text-gray-300 text-sm">
            أكتر من <span className="text-[#FFD700] font-black">10,000 أم وأب</span> وثقوا في PIXA WORLD
          </p>
        </motion.div>

        <div className="relative h-[220px]">
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 8. CTA Section - محسّن */}
      {/* ═══════════════════════════════════════════════════════════ */}
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
              مستقبل طفلك يبدأ من هنا
            </h2>

            <p className="text-white/90 text-sm md:text-base max-w-md mx-auto font-medium leading-relaxed">
              سجلي مجاناً دلوقتي وخلي طفلك يبدأ رحلة تعلم اللغات بأسلوب ممتع ومختلف — مش هيحس إنه بيذاكر!
            </p>

            {/* نقاط سريعة */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-white/90">
              {[
                '✅ مجاني تماماً للبداية',
                '✅ بدون بطاقة ائتمان',
                '✅ نتائج من أول أسبوع',
              ].map((point, i) => (
                <span key={i} className="bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm">
                  {point}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/character-and-map'}
                className="bg-white text-[#F72585] px-10 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center gap-3"
              >
                <GraduationCap size={20} />
                ابدئي رحلة طفلك مجاناً
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/15 border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2"
              >
                <Play size={16} />
                شاهدي الفيديو التعريفي
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 9. FAQ - أسئلة شائعة (قسم جديد) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-3xl mx-auto px-6 mb-24 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#fb923c] backdrop-blur-sm">
            <Zap size={14} />
            أسئلة شائعة
          </div>
          <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            عندك سؤال؟ الإجابة هنا
          </h2>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              q: 'المنصة مناسبة لأي عمر؟',
              a: 'المنصة مصممة للأطفال من سن 6 لـ 11 سنة — السن الذهبي لتعلم اللغات. المنهج متدرج ويتناسب مع كل فئة عمرية.',
              color: '#FF4D6D'
            },
            {
              q: 'هل المنصة مجانية؟',
              a: 'أيوا! تقدري تبدئي مجاناً تماماً وطفلك يجرب المحتوى. فيه خطط مدفوعة للمميزات المتقدمة بأسعار مناسبة جداً.',
              color: '#4CC9F0'
            },
            {
              q: 'إزاي طفلي هيتعلم نطق صح؟',
              a: 'كل كلمة وجملة في المنصة مسجلة بصوت ناطقين أصليين. طفلك يسمع النطق الصحيح ويقدر يكرره ويتدرب عليه.',
              color: '#9D4EDD'
            },
            {
              q: 'المنصة آمنة لأطفالي؟',
              a: 'طبعاً! المنصة مصممة 100% للأطفال بدون أي إعلانات أو محتوى غير مناسب. وتقدري تتابعي تقدم طفلك بتقارير مفصلة.',
              color: '#06D6A0'
            },
            {
              q: 'لغات نادرة ليه مش إنجليزي؟',
              a: 'الإنجليزي متوفر في كل مكان. إحنا بنأسس طفلك في لغات المستقبل اللي هتديله ميزة تنافسية حقيقية زي الألماني والصيني والياباني.',
              color: '#FFD700'
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.10] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: faq.color + '20',
                    border: `1px solid ${faq.color}40`,
                  }}
                >
                  <span className="text-sm font-black" style={{ color: faq.color }}>؟</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-sm text-white/95">{faq.q}</h3>
                  <p className="text-gray-300 text-[13px] leading-[1.8] font-medium">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 10. الفوتر */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-[#0f0a24]/80 backdrop-blur-xl border-t border-white/10 z-10 relative">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#9D4EDD] flex items-center justify-center font-black text-lg shadow-lg shadow-[#FF4D6D]/30">P</div>
                <span className="text-xl font-black" dir="ltr">PIXA WORLD</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                أول منصة عربية تفاعلية لتأسيس الأطفال من 6–11 سنة في لغات المستقبل النادرة. 5 لغات عالمية بأسلوب ألعاب مبتكر يحببهم في التعلم.
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
              {[
                { label: 'عن المنصة' },
                { label: 'المنهج التعليمي' },
                { label: 'الأسعار والاشتراكات' },
                { label: 'الأسئلة الشائعة' },
                { label: 'تواصل معنا' },
              ].map((link, i) => (
                <a key={i} href="#" className="block text-gray-300 text-sm hover:text-[#4CC9F0] transition-colors font-medium">
                  {link.label}
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
              © {new Date().getFullYear()} <span dir="ltr" className="inline-block mx-1">PIXA WORLD</span>. جميع الحقوق محفوظة 🎮✨
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
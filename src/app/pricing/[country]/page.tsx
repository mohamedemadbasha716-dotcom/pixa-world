'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Sparkles, ArrowRight, Globe, Star, Zap, BookOpen,
  Trophy, Heart, Shield, Rocket, Brain, Gamepad2,
  GraduationCap, Languages, CheckCircle, Crown,
  Users, Gift, Clock, Sparkle, ChevronDown,
  MapPin, CreditCard, Lock, BadgeCheck, Gem,
  PartyPopper, Target, Award, Play, Zap as Lightning
} from 'lucide-react';

type CountryCode = 'eg' | 'sa' | 'ae';

interface CountryConfig {
  code: CountryCode;
  name: string;
  nameEn: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  plans: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  popularLabel: string;
  heroSubtitle: string;
  comparisonText: string;
  paymentMethods: string;
  color: string;
  ctaText: string;
  trustText: string;
}

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
  bonus?: boolean;
}

const COUNTRIES: Record<CountryCode, CountryConfig> = {
  eg: {
    code: 'eg',
    name: 'مصر',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    currency: 'جنيه مصري',
    currencySymbol: 'ج.م',
    plans: { monthly: 199, quarterly: 449, yearly: 999 },
    popularLabel: '🏆 الأكثر توفيراً',
    heroSubtitle: 'أسعار مصرية مناسبة لكل الأسر',
    comparisonText: 'حصة خصوصية لغة = 300-500 ج.م للحصة الواحدة',
    paymentMethods: 'فيزا، ماستر كارد، فوري، فودافون كاش، إنستاباي',
    color: '#FFD700',
    ctaText: 'ابدأ رحلة طفلك دلوقتي',
    trustText: 'أكتر من 5,000 أسرة مصرية وثقوا فينا',
  },
  sa: {
    code: 'sa',
    name: 'السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'ريال سعودي',
    currencySymbol: 'ر.س',
    plans: { monthly: 49, quarterly: 119, yearly: 349 },
    popularLabel: '🏆 الأكثر طلباً',
    heroSubtitle: 'أسعار مميزة للأسر السعودية',
    comparisonText: 'كورس لغة للأطفال = 200-400 ر.س شهرياً',
    paymentMethods: 'فيزا، ماستر كارد، مدى، أبل باي، STC Pay',
    color: '#06D6A0',
    ctaText: 'سجّل طفلك الحين',
    trustText: 'أكثر من 3,000 أسرة سعودية معانا',
  },
  ae: {
    code: 'ae',
    name: 'الإمارات',
    nameEn: 'UAE',
    flag: '🇦🇪',
    currency: 'درهم إماراتي',
    currencySymbol: 'د.إ',
    plans: { monthly: 49, quarterly: 129, yearly: 379 },
    popularLabel: '🏆 الأفضل قيمة',
    heroSubtitle: 'أسعار تنافسية للأسر في الإمارات',
    comparisonText: 'معهد لغات للأطفال = 300-500 د.إ شهرياً',
    paymentMethods: 'فيزا، ماستر كارد، أبل باي، Samsung Pay',
    color: '#4CC9F0',
    ctaText: 'سجّل طفلك الحين',
    trustText: 'أكثر من 2,000 أسرة في الإمارات معانا',
  },
};

const VALID_COUNTRIES: CountryCode[] = ['eg', 'sa', 'ae'];

const AVAILABLE_LANGUAGES = [
  { name: 'الألمانية', flag: '🇩🇪', color: '#FFD700', available: true, comingSoon: null },
  { name: 'الإسبانية', flag: '🇪🇸', color: '#FF6B35', available: false, comingSoon: 'قريباً جداً' },
  { name: 'الروسية', flag: '🇷🇺', color: '#9D4EDD', available: false, comingSoon: 'قريباً' },
  { name: 'اليابانية', flag: '🇯🇵', color: '#FF4D6D', available: false, comingSoon: 'قريباً' },
  { name: 'الصينية', flag: '🇨🇳', color: '#4CC9F0', available: false, comingSoon: 'قريباً' },
];

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 77, 109, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 30%, rgba(76, 201, 240, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(157, 78, 221, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
        `,
      }} />
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={`bubble-${i}`} className="absolute rounded-full"
          style={{
            width: 180 + Math.random() * 180,
            height: 180 + Math.random() * 180,
            background: `radial-gradient(circle, ${['#FF4D6D','#4CC9F0','#9D4EDD','#FFD700','#06D6A0'][i]}18 0%, transparent 70%)`,
            left: `${(i * 20) % 100}%`,
            top: `${(i * 22) % 100}%`,
            filter: 'blur(40px)',
          }}
          animate={{ x: [0,40,-25,0], y: [0,-35,25,0], scale: [1,1.15,0.9,1] }}
          transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={`particle-${i}`} className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1.5,
            height: Math.random() * 3 + 1.5,
            background: ['#FF4D6D','#4CC9F0','#9D4EDD','#FFD700','#06D6A0','#fff'][Math.floor(Math.random() * 6)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0,-30,0], opacity: [0.15,0.6,0.15], scale: [1,1.5,1] }}
          transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={`sparkle-${i}`} className="absolute"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ scale: [0,1.5,0], opacity: [0,1,0], rotate: [0,180] }}
          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
        >
          <Sparkle size={10} className="text-yellow-200" style={{ filter: 'drop-shadow(0 0 6px gold)' }} />
        </motion.div>
      ))}
    </div>
  );
}

function FreeTrialBanner({ onTryFree }: { onTryFree: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
      className="relative w-full max-w-3xl mx-auto mb-8"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl blur-2xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ background: 'linear-gradient(135deg, #06D6A0, #4CC9F0)' }}
      />
      <div className="relative rounded-3xl overflow-hidden border-2 backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(6,214,160,0.15), rgba(76,201,240,0.15))',
          borderColor: 'rgba(6,214,160,0.4)',
          boxShadow: '0 0 40px rgba(6,214,160,0.25)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-full pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={i} className="absolute"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ scale: [0,1,0], opacity: [0,1,0], rotate: [0,180] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
            >
              <Sparkle size={12} className="text-[#06D6A0]" />
            </motion.div>
          ))}
        </div>

        <div className="relative p-6 md:p-8 text-center space-y-4">
          <motion.div
            animate={{ rotate: [0,10,-10,0], scale: [1,1.1,1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block text-5xl md:text-6xl"
            style={{ filter: 'drop-shadow(0 4px 15px rgba(6,214,160,0.5))' }}
          >🎁</motion.div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-white">
              مش متأكد/ة؟ جرّب قبل ما تشترك!
            </h2>
            <p className="text-sm md:text-base text-white/80 font-medium">
              خلي طفلك يجرّب{' '}
              <span className="text-[#06D6A0] font-black">أول درس كامل مجاناً</span>{' '}
              في اللغة الألمانية
              <br />
              <span className="text-white/60 text-xs">
                بدون بطاقة ائتمان • بدون تسجيل • ابدأ فوراً
              </span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
            {['🎮 ألعاب تفاعلية', '🎧 نطق حقيقي', '⭐ نظام نقاط'].map((item, i) => (
              <span key={i} className="bg-white/10 px-3 py-1.5 rounded-full text-white/90">{item}</span>
            ))}
          </div>

          <motion.button
            onClick={onTryFree}
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(6,214,160,0.7)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ['0 8px 30px rgba(6,214,160,0.4)','0 12px 40px rgba(6,214,160,0.6)','0 8px 30px rgba(6,214,160,0.4)'] }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-base md:text-lg border-2 border-white/30"
            style={{ background: 'linear-gradient(135deg, #06D6A0, #4CC9F0)' }}
          >
            <Gift size={20} />
            <span>جرّب أول درس مجاناً الآن</span>
            <ArrowRight size={18} className="rotate-180" />
          </motion.button>

          <p className="text-[11px] text-white/50 font-medium">
            ⏱️ الدرس بيستغرق 5-10 دقايق فقط
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function LanguagesStatusSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-4xl mx-auto px-6 mb-16"
    >
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 border border-[#FFD700]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#fde047] backdrop-blur-sm">
          <Globe size={14} />
          حالة اللغات
        </div>
        <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
          إيه المتاح دلوقتي؟ وإيه الجاي؟
        </h2>
        <p className="text-gray-300 text-sm max-w-lg mx-auto">
          نتحدث معكم بشفافية كاملة عن اللغات المتاحة والقادمة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_LANGUAGES.map((lang, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-5 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 ${
              lang.available
                ? 'bg-[#06D6A0]/10 border-[#06D6A0]/40'
                : 'bg-white/[0.04] border-white/[0.1]'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.span className="text-4xl"
                  animate={lang.available ? { y: [0,-3,0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {lang.flag}
                </motion.span>
                <div>
                  <h3 className="text-base font-black text-white">{lang.name}</h3>
                  {lang.available ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#06D6A0] animate-pulse" />
                      <span className="text-xs font-bold text-[#06D6A0]">متاحة الآن</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={12} className="text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-400">{lang.comingSoon}</span>
                    </div>
                  )}
                </div>
              </div>
              {!lang.available && (
                <motion.div
                  animate={{ scale: [1,1.05,1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B35]/20 border border-[#FFD700]/40"
                >
                  <span className="text-[10px] font-black text-[#FFD700] flex items-center gap-1">
                    <Gift size={10} />
                    مجاناً للسنوي
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#FFD700]/10 to-[#FF6B35]/10 border-2 border-[#FFD700]/30 backdrop-blur-md"
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">💡</div>
          <div className="space-y-1.5">
            <h4 className="font-black text-[#FFD700] text-sm">مكافأة الوصول المبكر (Early Access)</h4>
            <p className="text-white/80 text-[13px] leading-relaxed font-medium">
              اشتركوا في{' '}
              <span className="text-[#FFD700] font-black">الخطة السنوية</span> الآن،
              وأي لغة جديدة هتنزل خلال سنة اشتراككم{' '}
              <span className="text-[#06D6A0] font-black">هتفتحلكم تلقائياً مجاناً!</span>
              <br />
              <span className="text-white/60 text-xs">
                يعني لو نزلت الإسبانية بعد شهرين، هتلاقوها مفتوحة في حسابكم بدون أي تكلفة إضافية 🎁
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PricingCard({
  plan, price, originalPrice, period, perMonth, features,
  isPopular, popularLabel, icon: Icon, color, currencySymbol,
  delay, savings, badge,
}: {
  plan: string; price: number; originalPrice?: number; period: string;
  perMonth?: number; features: PlanFeature[]; isPopular: boolean;
  popularLabel: string; icon: React.ElementType; color: string;
  currencySymbol: string; delay: number; savings?: string; badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative rounded-[28px] overflow-hidden backdrop-blur-md transition-all duration-500 group cursor-default ${
        isPopular
          ? 'bg-gradient-to-b from-white/[0.14] to-white/[0.06] border-2 shadow-2xl'
          : 'bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] shadow-xl'
      }`}
      style={isPopular ? { borderColor: color + '50', boxShadow: `0 0 50px ${color}20, 0 20px 40px rgba(0,0,0,0.3)` } : {}}
    >
      {isPopular && (
        <>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-[80px]"
            style={{ backgroundColor: color, opacity: 0.2 }} />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-[60px]"
            style={{ backgroundColor: color, opacity: 0.1 }} />
        </>
      )}

      {isPopular && (
        <div className="absolute top-0 left-0 right-0 py-2.5 text-center text-xs font-black text-white z-10"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 15px ${color}50` }}
        >
          <div className="flex items-center justify-center gap-2">
            <Crown size={14} /><span>{popularLabel}</span><Crown size={14} />
          </div>
        </div>
      )}

      <div className={`relative z-10 p-8 ${isPopular ? 'pt-14' : 'pt-8'} space-y-6`}>
        <div className="text-center space-y-3">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
            style={{ backgroundColor: color + '20', border: `2px solid ${color}40`, boxShadow: `0 0 25px ${color}25` }}
          >
            <Icon size={30} style={{ color, filter: `drop-shadow(0 0 8px ${color}80)` }} />
          </motion.div>
          <h3 className="text-xl font-black text-white/95">{plan}</h3>
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black"
              style={{ backgroundColor: color + '20', color, border: `1px solid ${color}40` }}
            >{badge}</span>
          )}
        </div>

        <div className="text-center space-y-1">
          {originalPrice && (
            <div className="text-gray-400 text-sm line-through font-bold">
              {originalPrice} {currencySymbol}
            </div>
          )}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black" style={{ color, textShadow: `0 0 20px ${color}50` }}>
              {price}
            </span>
            <span className="text-gray-300 text-sm font-bold">{currencySymbol}</span>
          </div>
          <div className="text-gray-400 text-xs font-bold">{period}</div>

          {perMonth !== undefined && (
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: [0.9,1.05,1] }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-2"
              style={{ backgroundColor: color + '15', border: `1px solid ${color}30` }}
            >
              <span className="text-[11px] font-black" style={{ color }}>
                = {perMonth} {currencySymbol} / الشهر
              </span>
            </motion.div>
          )}

          {savings && (
            <motion.div
              animate={{ scale: [1,1.05,1] }} transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-2"
              style={{ backgroundColor: '#06D6A020', border: '1px solid #06D6A040' }}
            >
              <Gift size={12} className="text-[#06D6A0]" />
              <span className="text-[11px] font-black text-[#06D6A0]">وفّر {savings}</span>
            </motion.div>
          )}
        </div>

        <div className="w-full h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

        <div className="space-y-3">
          {features.map((feature, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: delay + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: feature.bonus ? '#FFD70025' : feature.included ? color + '25' : '#ffffff10' }}
              >
                {feature.included ? (
                  feature.bonus
                    ? <Gift size={12} style={{ color: '#FFD700' }} />
                    : <CheckCircle size={12} style={{ color }} />
                ) : (
                  <Lock size={10} className="text-gray-500" />
                )}
              </div>
              <span className={`text-[13px] font-medium ${
                feature.included
                  ? feature.bonus
                    ? 'text-[#FFD700] font-black'
                    : feature.highlight ? 'font-black' : 'text-gray-200'
                  : 'text-gray-500 line-through'
              }`} style={feature.highlight && !feature.bonus ? { color } : {}}>
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: isPopular ? `0 0 40px ${color}50` : `0 0 25px ${color}30` }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-all duration-300"
          style={isPopular
            ? { background: `linear-gradient(135deg, ${color}, ${color}dd)`, color: '#fff', boxShadow: `0 8px 25px ${color}40` }
            : { background: `${color}15`, color, border: `2px solid ${color}40` }
          }
        >
          <Rocket size={18} />
          <span>اشترك الآن</span>
          <ArrowRight size={16} className="rotate-180" />
        </motion.button>

        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Shield size={12} />
          <span className="text-[10px] font-bold">ضمان استرجاع خلال 14 يوم</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function CountryPricingPage() {
  const params = useParams();
  const router = useRouter();
  const countryParam = params.country as string;
  const isValidCountry = VALID_COUNTRIES.includes(countryParam as CountryCode);

  useEffect(() => {
    if (!isValidCountry) router.replace('/pricing/eg');
  }, [isValidCountry, router]);

  if (!isValidCountry) {
    return (
      <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const country = COUNTRIES[countryParam as CountryCode];
  const handleTryFree = () => router.push('/character-and-map');

  const monthlyTotal12 = country.plans.monthly * 12;
  const monthlyTotal3 = country.plans.monthly * 3;
  const quarterlySaving = Math.round(((monthlyTotal3 - country.plans.quarterly) / monthlyTotal3) * 100);
  const yearlySaving = Math.round(((monthlyTotal12 - country.plans.yearly) / monthlyTotal12) * 100);
  const yearlyPerMonth = Math.round(country.plans.yearly / 12);
  const quarterlyPerMonth = Math.round(country.plans.quarterly / 3);

  const monthlyFeatures: PlanFeature[] = [
    { text: 'اللغة الألمانية كاملة', included: true, highlight: true },
    { text: 'كل الدروس والألعاب التفاعلية', included: true },
    { text: 'نطق بصوت ناطقين أصليين', included: true },
    { text: 'تقارير تقدم أساسية', included: true },
    { text: 'شهادات وأوسمة رقمية', included: false },
    { text: 'الوصول المبكر للغات الجديدة', included: false },
    { text: 'محتوى حصري ومتقدم', included: false },
    { text: 'أولوية الدعم الفني', included: false },
  ];

  const quarterlyFeatures: PlanFeature[] = [
    { text: 'اللغة الألمانية كاملة', included: true, highlight: true },
    { text: 'كل الدروس والألعاب التفاعلية', included: true },
    { text: 'نطق بصوت ناطقين أصليين', included: true },
    { text: 'تقارير تقدم أسبوعية', included: true },
    { text: 'شهادات إنجاز رقمية', included: true },
    { text: 'الوصول المبكر للغات الجديدة', included: false },
    { text: 'محتوى حصري ومتقدم', included: false },
    { text: 'أولوية الدعم الفني', included: false },
  ];

  const yearlyFeatures: PlanFeature[] = [
    { text: 'اللغة الألمانية كاملة لسنة', included: true, highlight: true },
    { text: 'كل الدروس والألعاب التفاعلية', included: true },
    { text: 'نطق بصوت ناطقين أصليين', included: true },
    { text: 'تقارير تقدم تفصيلية', included: true },
    { text: 'شهادات وأوسمة رقمية', included: true },
    { text: '🎁 كل لغة جديدة تنزل = مجاناً', included: true, bonus: true },
    { text: 'محتوى حصري ومتقدم', included: true },
    { text: 'أولوية الدعم الفني', included: true, highlight: true },
  ];

  const countryFAQ = [
    {
      q: 'هل فيه فترة تجربة مجانية؟',
      a: 'أيوا! تقدروا تجربوا أول درس كامل في اللغة الألمانية مجاناً تماماً بدون بطاقة ائتمان. اضغطوا على زر "جرّب أول درس مجاناً" في الأعلى.',
      color: '#06D6A0',
    },
    {
      q: 'إيه هي مكافأة الوصول المبكر (Early Access)؟',
      a: 'دي مكافأة حصرية لمشتركي الخطة السنوية! لو اشتركتوا في الألمانية النهارده، وبعد شهر نزلت الإسبانية، هتلاقوها مفتوحة في حسابكم مجاناً! نفس الحال مع أي لغة جديدة تنزل خلال سنة اشتراككم.',
      color: '#FFD700',
    },
    {
      q: 'ليه اللغات التانية مش متاحة دلوقتي؟',
      a: 'إحنا حريصين نقدم محتوى بأعلى جودة ممكنة. الألمانية جاهزة 100% دلوقتي، والإسبانية قريباً جداً، وباقي اللغات في مراحل الإنتاج النهائية. مع الخطة السنوية، هتحصلوا عليها كلها مجاناً بمجرد نزولها!',
      color: '#4CC9F0',
    },
    {
      q: 'أقدر أغيّر الخطة بعد الاشتراك؟',
      a: 'طبعاً! تقدروا تترقوا من الشهري للسنوي في أي وقت وهنحسبلكم الفرق. أو تلغوا الاشتراك في أي وقت.',
      color: '#9D4EDD',
    },
    {
      q: 'لو مش عاجبنا، نقدر نرجّع فلوسنا؟',
      a: 'أكيد! عندنا ضمان استرجاع كامل خلال 14 يوم من أول اشتراك. لو مش مناسب، فلوسكم بترجعلكم بالكامل.',
      color: '#F72585',
    },
    {
      q: 'إيه طرق الدفع المتاحة؟',
      a: `بنقبل: ${country.paymentMethods}`,
      color: '#FF4D6D',
    },
    {
      q: 'الاشتراك ده لطفل واحد ولا أكتر؟',
      a: 'الاشتراك لحساب طفل واحد. لو عندكم أكتر من طفل، تواصلوا معانا للحصول على خصم عائلي مميز.',
      color: '#FF6B35',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans overflow-x-hidden selection:bg-[#FF4D6D] selection:text-white relative" dir="rtl">
      <FloatingParticles />

      {/* الهيدر */}
      <motion.header
        initial={{ y: -100 }} animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4 flex justify-between items-center gap-2 border-b border-white/10 backdrop-blur-xl bg-[#1a1a3e]/50 sticky top-0 z-50"
      >
        <div className="flex items-center gap-2 md:gap-3 order-2">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6,214,160,0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTryFree}
            className="bg-gradient-to-r from-[#06D6A0] to-[#4CC9F0] text-white px-3 md:px-7 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm shadow-lg shadow-[#06D6A0]/30 flex items-center gap-1.5 md:gap-2 whitespace-nowrap"
          >
            <Gift size={14} className="md:w-4 md:h-4" />
            <span>جرّب مجاناً</span>
          </motion.button>
        </div>

        <motion.div className="flex items-center gap-2 md:gap-3 cursor-pointer order-1 flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.location.href = '/'}
        >
          <span className="text-base md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-200 whitespace-nowrap">
            PIXA WORLD
          </span>
          <motion.div animate={{ rotate: [0,5,-5,0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#FF4D6D] via-[#F72585] to-[#9D4EDD] flex items-center justify-center font-black text-base md:text-xl shadow-lg shadow-[#FF4D6D]/40 flex-shrink-0"
          >P</motion.div>
        </motion.div>
      </motion.header>

      {/* الهيرو */}
      <section className="relative w-full max-w-5xl mx-auto text-center px-6 pt-12 md:pt-16 pb-4 space-y-6 z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B35]/20 border border-[#FFD700]/30 px-5 py-2.5 rounded-full text-xs font-bold text-white mx-auto backdrop-blur-sm shadow-lg"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Gem size={14} className="text-yellow-300" />
          </motion.div>
          <span>{country.heroSubtitle}</span>
          <motion.span className="text-lg" animate={{ scale: [1,1.2,1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            {country.flag}
          </motion.span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            استثمروا في مستقبل طفلكم
          </h1>
          <h2 className="text-2xl md:text-4xl font-black"
            style={{ backgroundImage: 'linear-gradient(135deg, #FFD700, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            بأقل من تمن وجبة! 🍔
          </h2>
        </motion.div>
      </section>

      {/* بانر التجربة المجانية */}
      <div className="px-6 relative z-10">
        <FreeTrialBanner onTryFree={handleTryFree} />
      </div>

      {/* المقارنة */}
      <section className="w-full max-w-5xl mx-auto text-center px-6 space-y-6 z-10 relative mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="relative max-w-2xl mx-auto px-6 py-4 rounded-2xl border backdrop-blur-md"
          style={{ background: 'linear-gradient(135deg, rgba(255,77,109,0.08), rgba(157,78,221,0.08))', borderColor: 'rgba(255,255,255,0.12)' }}
        >
          <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed">
            <span className="text-[#FF4D6D] font-black line-through">{country.comparisonText}</span>
            <br />
            منصة كاملة بألعاب تفاعلية ={' '}
            <span className="text-[#06D6A0] font-black">
              بداية من {country.plans.monthly} {country.currencySymbol} / شهر فقط!
            </span>
          </p>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-gray-400 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Users size={14} className="text-[#06D6A0]" />
          {country.trustText}
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }} className="pt-2"
        >
          <motion.span className="text-5xl md:text-6xl inline-block"
            animate={{ y: [0,-8,0] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))' }}
          >
            {country.flag}
          </motion.span>
          <p className="text-white/80 text-sm font-black mt-2">الأسعار بـ{country.currency}</p>
        </motion.div>
      </section>

      {/* بطاقات الأسعار */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-16 pt-4 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          <PricingCard
            plan="الاشتراك الشهري" price={country.plans.monthly} period="/ شهر"
            features={monthlyFeatures} isPopular={false} popularLabel=""
            icon={Zap} color="#4CC9F0" currencySymbol={country.currencySymbol}
            delay={0.1} badge="مثالي للتجربة"
          />
          <div className="md:-mt-6">
            <PricingCard
              plan="الاشتراك السنوي" price={country.plans.yearly}
              originalPrice={monthlyTotal12} period="/ سنة كاملة" perMonth={yearlyPerMonth}
              features={yearlyFeatures} isPopular={true} popularLabel={country.popularLabel}
              icon={Crown} color="#FFD700" currencySymbol={country.currencySymbol}
              delay={0.2} savings={`${yearlySaving}%`} badge="🎁 وصول مبكر مجاني"
            />
          </div>
          <PricingCard
            plan="ربع سنوي" price={country.plans.quarterly}
            originalPrice={monthlyTotal3} period="/ 3 شهور" perMonth={quarterlyPerMonth}
            features={quarterlyFeatures} isPopular={false} popularLabel=""
            icon={Star} color="#9D4EDD" currencySymbol={country.currencySymbol}
            delay={0.3} savings={`${quarterlySaving}%`} badge="الأكثر مرونة"
          />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs font-bold text-gray-400">
            {[
              { icon: Shield, text: 'ضمان استرجاع 14 يوم' },
              { icon: Lock, text: 'دفع آمن ومشفر' },
              { icon: CreditCard, text: country.paymentMethods.split('،').slice(0,3).join(' • ') },
              { icon: BadgeCheck, text: 'إلغاء في أي وقت' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-2 rounded-xl border border-white/[0.08]">
                <item.icon size={12} className="text-[#06D6A0]" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* قسم اللغات */}
      <LanguagesStatusSection />

      {/* جدول المقارنة */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24 z-10 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center space-y-4 mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#fb923c] backdrop-blur-sm">
            <Target size={14} />
            مقارنة مفصّلة
          </div>
          <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            قارن بين الخطط واختار الأنسب
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden border border-white/[0.12] backdrop-blur-md bg-white/[0.04]"
        >
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right p-5 font-black text-white/80 w-1/3">الميزة</th>
                  <th className="p-5 text-center w-1/5">
                    <div className="space-y-1">
                      <Zap size={18} className="mx-auto text-[#4CC9F0]" />
                      <div className="font-black text-[#4CC9F0]">شهري</div>
                      <div className="text-xs text-gray-400">{country.plans.monthly} {country.currencySymbol}</div>
                    </div>
                  </th>
                  <th className="p-5 text-center w-1/5">
                    <div className="space-y-1">
                      <Star size={18} className="mx-auto text-[#9D4EDD]" />
                      <div className="font-black text-[#9D4EDD]">ربع سنوي</div>
                      <div className="text-xs text-gray-400">{country.plans.quarterly} {country.currencySymbol}</div>
                    </div>
                  </th>
                  <th className="p-5 text-center w-1/5 relative">
                    <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(180deg, #FFD700, transparent)' }} />
                    <div className="relative space-y-1">
                      <Crown size={18} className="mx-auto text-[#FFD700]" />
                      <div className="font-black text-[#FFD700]">سنوي</div>
                      <div className="text-xs text-gray-400">{country.plans.yearly} {country.currencySymbol}</div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
                        ⭐ الأفضل
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'اللغة الألمانية', monthly: '✅', quarterly: '✅', yearly: '✅', yh: false },
                  { feature: 'الدروس التفاعلية', monthly: '✅', quarterly: '✅', yearly: '✅', yh: false },
                  { feature: 'الألعاب التعليمية', monthly: '✅', quarterly: '✅', yearly: '✅', yh: false },
                  { feature: 'نطق ناطقين أصليين', monthly: '✅', quarterly: '✅', yearly: '✅', yh: false },
                  { feature: 'تقارير التقدم', monthly: 'أساسية', quarterly: 'أسبوعية', yearly: 'تفصيلية ✨', yh: true },
                  { feature: 'شهادات وأوسمة', monthly: '❌', quarterly: '✅', yearly: '✅', yh: false },
                  { feature: '🎁 لغات جديدة مجاناً', monthly: '❌', quarterly: '❌', yearly: '✅ حصري', yh: true },
                  { feature: 'محتوى حصري', monthly: '❌', quarterly: '❌', yearly: '✅', yh: true },
                  { feature: 'أولوية الدعم', monthly: '❌', quarterly: '❌', yearly: '✅', yh: true },
                  { feature: 'السعر الشهري الفعلي', monthly: `${country.plans.monthly} ${country.currencySymbol}`, quarterly: `${quarterlyPerMonth} ${country.currencySymbol}`, yearly: `${yearlyPerMonth} ${country.currencySymbol} 🔥`, yh: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 font-bold text-gray-200 text-[13px]">{row.feature}</td>
                    <td className="p-4 text-center text-[13px] text-gray-300">{row.monthly}</td>
                    <td className="p-4 text-center text-[13px] text-gray-300">{row.quarterly}</td>
                    <td className={`p-4 text-center text-[13px] relative ${row.yh ? 'font-black text-[#FFD700]' : 'text-gray-300'}`}>
                      <div className="absolute inset-0 opacity-5 bg-[#FFD700]" />
                      <span className="relative">{row.yearly}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-6 space-y-4">
            {[
              { feature: 'اللغة الألمانية', monthly: '✅', quarterly: '✅', yearly: '✅' },
              { feature: 'الدروس والألعاب', monthly: '✅', quarterly: '✅', yearly: '✅' },
              { feature: 'تقارير التقدم', monthly: 'أساسية', quarterly: 'أسبوعية', yearly: 'تفصيلية' },
              { feature: 'شهادات وأوسمة', monthly: '❌', quarterly: '✅', yearly: '✅' },
              { feature: '🎁 لغات جديدة مجاناً', monthly: '❌', quarterly: '❌', yearly: '✅ حصري' },
              { feature: 'السعر/شهر', monthly: `${country.plans.monthly}`, quarterly: `${quarterlyPerMonth}`, yearly: `${yearlyPerMonth} 🔥` },
            ].map((row, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-3">
                <h4 className="font-black text-sm text-white/90">{row.feature}</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="space-y-1">
                    <div className="text-[#4CC9F0] font-bold text-[10px]">شهري</div>
                    <div className="text-gray-300">{row.monthly}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[#9D4EDD] font-bold text-[10px]">ربع سنوي</div>
                    <div className="text-gray-300">{row.quarterly}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[#FFD700] font-bold text-[10px]">سنوي ⭐</div>
                    <div className="text-gray-300 font-bold">{row.yearly}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl mx-auto px-6 pb-24 z-10 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center space-y-4 mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
            أسئلة عن الأسعار والاشتراك
          </h2>
        </motion.div>

        <div className="space-y-4">
          {countryFAQ.map((faq, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.10] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: faq.color + '20', border: `1px solid ${faq.color}40` }}
                >
                  <span className="text-xs font-black" style={{ color: faq.color }}>؟</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-black text-sm text-white/95">{faq.q}</h3>
                  <p className="text-gray-300 text-[12px] leading-[1.8] font-medium">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA نهائي */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24 z-10 relative">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-[#06D6A0]/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#06D6A0] via-[#4CC9F0] to-[#9D4EDD]" />
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }}
          />
          <div className="relative p-10 md:p-16 text-center space-y-6">
            <motion.div animate={{ y: [0,-10,0], rotate: [0,5,-5,0] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl">
              🎁
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              لسه مش متأكدين؟ جربوا مجاناً!
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-md mx-auto font-medium leading-relaxed">
              خلوا طفلكم يجرب أول درس كامل في اللغة الألمانية مجاناً.
              لو حبها — وهيحبها 😍 — اختاروا الخطة المناسبة ليكم
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-bold text-white/90">
              {['✅ درس كامل مجاناً', '✅ بدون بطاقة ائتمان', '✅ ابدأ فوراً'].map((point, i) => (
                <span key={i} className="bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm">{point}</span>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTryFree}
              className="bg-white text-[#06D6A0] px-10 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center gap-3 mx-auto"
            >
              <Gift size={20} />
              جرّب أول درس مجاناً الآن
              <PartyPopper size={18} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* الفوتر */}
      <footer className="w-full bg-[#0f0a24]/80 backdrop-blur-xl border-t border-white/10 z-10 relative">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4D6D] to-[#9D4EDD] flex items-center justify-center font-black text-lg shadow-lg shadow-[#FF4D6D]/30">P</div>
              <span className="text-xl font-black" dir="ltr">PIXA WORLD</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-400 font-bold">
              <a href="/" className="hover:text-white transition-colors">الصفحة الرئيسية</a>
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
              <a href="#" className="hover:text-white transition-colors">تواصل معنا</a>
            </div>
            <p className="text-[11px] text-gray-500 font-bold">
              © {new Date().getFullYear()}{' '}
              <span dir="ltr" className="inline-block mx-1">PIXA WORLD</span>. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
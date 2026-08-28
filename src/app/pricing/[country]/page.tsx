'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
    plans: { monthly: 200, quarterly: 350, yearly: 500 },
    popularLabel: '🏆 الأكثر توفيراً',
    heroSubtitle: 'أسعار مصرية مناسبة لكل الأسر',
    comparisonText: 'حصة خصوصية لغة = 300-500 ج.م للحصة الواحدة',
    paymentMethods: 'فودافون كاش، اتصالات كاش، إنستاباي، محافظ إلكترونية',
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
        <div className="relative p-6 md:p-8 text-center space-y-4">
          <motion.div
            animate={{ rotate: [0,10,-10,0], scale: [1,1.1,1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block text-5xl md:text-6xl"
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

          <motion.button
            onClick={onTryFree}
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(6,214,160,0.7)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-base md:text-lg border-2 border-white/30"
            style={{ background: 'linear-gradient(135deg, #06D6A0, #4CC9F0)' }}
          >
            <Gift size={20} />
            <span>جرّب أول درس مجاناً الآن</span>
            <ArrowRight size={18} className="rotate-180" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PricingCard({
  plan, price, originalPrice, period, perMonth, features,
  isPopular, popularLabel, icon: Icon, color, currencySymbol,
  delay, savings, badge, onClick
}: {
  plan: string; price: number; originalPrice?: number; period: string;
  perMonth?: number; features: PlanFeature[]; isPopular: boolean;
  popularLabel: string; icon: React.ElementType; color: string;
  currencySymbol: string; delay: number; savings?: string; badge?: string;
  onClick: () => void;
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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
            style={{ backgroundColor: color + '20', border: `2px solid ${color}40`, boxShadow: `0 0 25px ${color}25` }}
          >
            <Icon size={30} style={{ color }} />
          </div>
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
            <span className="text-5xl font-black" style={{ color }}>
              {price}
            </span>
            <span className="text-gray-300 text-sm font-bold">{currencySymbol}</span>
          </div>
          <div className="text-gray-400 text-xs font-bold">{period}</div>

          {perMonth !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-2"
              style={{ backgroundColor: color + '15', border: `1px solid ${color}30` }}
            >
              <span className="text-[11px] font-black" style={{ color }}>
                = {perMonth} {currencySymbol} / الشهر
              </span>
            </div>
          )}

          {savings && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full mt-2"
              style={{ backgroundColor: '#06D6A020', border: '1px solid #06D6A040' }}
            >
              <span className="text-[11px] font-black text-[#06D6A0]">وفّر {savings}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: feature.bonus ? '#FFD70025' : feature.included ? color + '25' : '#ffffff10' }}
              >
                {feature.included ? <CheckCircle size={12} style={{ color }} /> : <Lock size={10} className="text-gray-500" />}
              </div>
              <span className={`text-[13px] font-medium ${feature.included ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
          style={isPopular
            ? { background: `linear-gradient(135deg, ${color}, ${color}dd)`, color: '#fff' }
            : { background: `${color}15`, color, border: `2px solid ${color}40` }
          }
        >
          <Rocket size={18} />
          <span>اشترك الآن</span>
          <ArrowRight size={16} className="rotate-180" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function PricingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryParam = params.country as string;
  const isValidCountry = VALID_COUNTRIES.includes(countryParam as CountryCode);

  const hideFreeBanner = searchParams.get('mode') === 'paid';

  useEffect(() => {
    if (!isValidCountry) router.replace('/pricing/eg');
  }, [isValidCountry, router]);

  if (!isValidCountry) {
    return (
      <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const country = COUNTRIES[countryParam as CountryCode];
  const handleTryFree = () => router.push('/character-and-map');

  const handleCheckoutRedirect = (planType: 'monthly' | 'quarterly' | 'yearly') => {
    router.push(`/checkout?country=${country.code}&plan=${planType}`);
  };

  // أسعار الخصم في مصر للواجهة الأصلية
  const egyptOriginalPrices = { monthly: 400, quarterly: 700, yearly: 1000 };

  const yearlyPerMonth = Math.round(country.plans.yearly / 12);
  const quarterlyPerMonth = Math.round(country.plans.quarterly / 3);

  const monthlyFeatures: PlanFeature[] = [
    { text: 'اللغة الألمانية كاملة', included: true, highlight: true },
    { text: 'كل الدروس والألعاب التفاعلية', included: true },
    { text: 'نطق بصوت ناطقين أصليين', included: true },
    { text: 'تقارير تقدم أساسية', included: true },
    { text: 'شهادات وأوسمة رقمية', included: false },
  ];

  const quarterlyFeatures: PlanFeature[] = [
    { text: 'اللغة الألمانية كاملة', included: true, highlight: true },
    { text: 'كل الدروس والألعاب التفاعلية', included: true },
    { text: 'نطق بصوت ناطقين أصليين', included: true },
    { text: 'تقارير تقدم أسبوعية', included: true },
    { text: 'شهادات إنجاز رقمية', included: true },
  ];

  const yearlyFeatures: PlanFeature[] = [
    { text: 'اللغة الألمانية كاملة لسنة', included: true, highlight: true },
    { text: 'كل الدروس والألعاب التفاعلية', included: true },
    { text: 'نطق بصوت ناطقين أصليين', included: true },
    { text: 'تقارير تقدم تفصيلية', included: true },
    { text: '🎁 كل لغة جديدة تنزل = مجاناً', included: true, bonus: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans overflow-x-hidden relative" dir="rtl">
      <FloatingParticles />

      {/* الهيدر */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 backdrop-blur-xl bg-[#1a1a3e]/50 sticky top-0 z-50">
        <button onClick={handleTryFree} className="bg-gradient-to-r from-[#06D6A0] to-[#4CC9F0] text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg flex items-center gap-2">
          <Gift size={16} />
          <span>جرّب مجاناً</span>
        </button>
        <span className="text-xl font-black tracking-tight cursor-pointer" onClick={() => router.push('/')}>PIXA WORLD</span>
      </header>

      {/* الهيرو */}
      <section className="relative w-full max-w-5xl mx-auto text-center px-6 pt-12 pb-4 space-y-6 z-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FF6B35]/20 border border-[#FFD700]/30 px-5 py-2.5 rounded-full text-xs font-bold text-white mx-auto">
          <span>{country.heroSubtitle}</span>
          <span className="text-lg">{country.flag}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black">استثمروا في مستقبل طفلكم</h1>
        <h2 className="text-2xl md:text-3xl font-black text-yellow-400">بأقل من ثمن وجبة! 🍔</h2>
      </section>

      {/* إخفاء أو إظهار البانر ديناميكياً */}
      {!hideFreeBanner && (
        <div className="px-6 relative z-10">
          <FreeTrialBanner onTryFree={handleTryFree} />
        </div>
      )}

      {/* بطاقات الأسعار */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24 pt-4 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <PricingCard
            plan="الاشتراك الشهري"
            price={country.plans.monthly}
            originalPrice={country.code === 'eg' ? egyptOriginalPrices.monthly : undefined}
            period="/ شهر"
            features={monthlyFeatures}
            isPopular={false}
            popularLabel=""
            icon={Zap}
            color="#4CC9F0"
            currencySymbol={country.currencySymbol}
            delay={0.1}
            badge="مثالي للتجربة"
            onClick={() => handleCheckoutRedirect('monthly')}
          />
          <div className="md:-mt-6">
            <PricingCard
              plan="الاشتراك السنوي"
              price={country.plans.yearly}
              originalPrice={country.code === 'eg' ? egyptOriginalPrices.yearly : (country.plans.monthly * 12)}
              period="/ سنة كاملة"
              perMonth={yearlyPerMonth}
              features={yearlyFeatures}
              isPopular={true}
              popularLabel={country.popularLabel}
              icon={Crown}
              color="#FFD700"
              currencySymbol={country.currencySymbol}
              delay={0.2}
              savings={country.code === 'eg' ? '50%' : '35%'}
              badge="🎁 وصول مبكر مجاني"
              onClick={() => handleCheckoutRedirect('yearly')}
            />
          </div>
          <PricingCard
            plan="ربع سنوي"
            price={country.plans.quarterly}
            originalPrice={country.code === 'eg' ? egyptOriginalPrices.quarterly : (country.plans.monthly * 3)}
            period="/ 3 شهور"
            perMonth={quarterlyPerMonth}
            features={quarterlyFeatures}
            isPopular={false}
            popularLabel=""
            icon={Star}
            color="#9D4EDD"
            currencySymbol={country.currencySymbol}
            delay={0.3}
            savings="خصم مميز"
            badge="الأكثر مرونة"
            onClick={() => handleCheckoutRedirect('quarterly')}
          />
        </div>
      </section>
    </div>
  );
}

export default function CountryPricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Suspense fallback={null}>
        <PricingContent />
      </Suspense>
    </Suspense>
  );
}
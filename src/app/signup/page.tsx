'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User, Mail, Lock, Globe, ArrowRight, Sparkle,
  Eye, EyeOff, Loader2, CheckCircle
} from 'lucide-react';
import { signUp, SUPPORTED_COUNTRIES } from '@/lib/auth';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') || 'free';

  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('EG');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('/api/geo');
        const data = await res.json();
        if (data.country && SUPPORTED_COUNTRIES.find(c => c.code === data.country)) {
          setCountryCode(data.country);
        }
      } catch {
        // fallback على مصر
      }
    }
    detectCountry();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('من فضلك اكتب اسمك كامل');
      return;
    }
    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError('الايميل مش صح، اكتبه بالشكل ده: name@gmail.com');
      return;
    }
    if (password.length < 6) {
      setError('كلمة السر لازم تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    const result = await signUp({
      fullName: fullName.trim(),
      countryCode,
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || 'حدث خطأ، حاول تاني');
      return;
    }

    if (planType === 'paid') {
      router.push('/pricing');
    } else {
      router.push('/character-and-map');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans relative overflow-hidden"
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
        {Array.from({ length: 10 }).map((_, i) => (
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
      <main className="relative z-10 max-w-md mx-auto px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF4D6D]/20 to-[#9D4EDD]/20 border border-[#FF4D6D]/30 px-4 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm">
              <Sparkle size={12} className="text-yellow-300" />
              <span>خطوة واحدة وتبدأ رحلة طفلك</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black flex items-center justify-center gap-3 flex-wrap">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
                أهلاً بيك في عائلتنا
              </span>
              <motion.span
                className="inline-block"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  WebkitTextFillColor: 'initial',
                  filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.5))'
                }}
              >
                🎉
              </motion.span>
            </h1>
            <p className="text-gray-300 text-sm font-medium">
              أنشئ حسابك في أقل من دقيقة
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* الاسم */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white/80 flex items-center gap-2">
                <User size={14} className="text-[#FF4D6D]" />
                اسمك
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثلاً: محمد أحمد"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-white/30 font-bold outline-none focus:border-[#FF4D6D] transition-all"
                disabled={loading}
                required
              />
            </div>

            {/* الدولة */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white/80 flex items-center gap-2">
                <Globe size={14} className="text-[#4CC9F0]" />
                دولتك
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border-2 border-white/10 text-white font-bold outline-none focus:border-[#4CC9F0] transition-all cursor-pointer"
                disabled={loading}
                required
              >
                {SUPPORTED_COUNTRIES.map((country) => (
                  <option
                    key={country.code}
                    value={country.code}
                    className="bg-[#1a1a3e] text-white"
                  >
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* الايميل */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white/80 flex items-center gap-2">
                <Mail size={14} className="text-[#9D4EDD]" />
                الايميل
              </label>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-white/30 font-bold outline-none focus:border-[#9D4EDD] transition-all"
                dir="ltr"
                disabled={loading}
                required
              />
            </div>

            {/* كلمة السر */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white/80 flex items-center gap-2">
                <Lock size={14} className="text-[#FFD700]" />
                كلمة السر
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 أحرف على الأقل"
                  className="w-full px-4 py-3 pl-12 rounded-2xl bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-white/30 font-bold outline-none focus:border-[#FFD700] transition-all"
                  dir="ltr"
                  disabled={loading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-sm font-bold text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* زر التسجيل */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-base text-white shadow-2xl shadow-[#FF4D6D]/30 flex items-center justify-center gap-3 disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #FF4D6D, #F72585, #9D4EDD)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري إنشاء حسابك...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>إنشاء الحساب</span>
                  <ArrowRight size={18} className="rotate-180" />
                </>
              )}
            </motion.button>
          </form>

          {/* رابط الدخول */}
          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm font-bold">
              عندك حساب بالفعل؟{' '}
              <button
                onClick={() => router.push(`/login?plan=${planType}`)}
                className="text-[#FF4D6D] font-black hover:underline"
              >
                سجّل دخول
              </button>
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-white/40 pt-4">
            <span>🔒 بياناتك محفوظة</span>
            <span>•</span>
            <span>✅ بدون تأكيد ايميل</span>
            <span>•</span>
            <span>🎁 ابدأ فوراً</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
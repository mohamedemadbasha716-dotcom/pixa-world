'use client';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { signIn } from '@/lib/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') || 'free';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) { setError('الايميل مش صح'); return; }
    if (password.length < 6) { setError('كلمة السر لازم تكون 6 أحرف على الأقل'); return; }

    setLoading(true);
    const result = await signIn({ email: email.trim().toLowerCase(), password });
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans relative overflow-hidden" dir="rtl">
      {/* خلفية */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 77, 109, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, rgba(6, 214, 160, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(157, 78, 221, 0.18) 0%, transparent 50%)
          `,
        }} />
        {Array.from({ length: 10 }).map((_, i) => (
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
      <main className="relative z-10 max-w-md mx-auto px-6 py-8 md:py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4CC9F0]/20 to-[#9D4EDD]/20 border border-[#4CC9F0]/30 px-4 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm">
              <Sparkle size={12} className="text-yellow-300" />
              <span>ارجع لمغامرة طفلك</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-100">
              أهلاً بيك تاني 👋
            </h1>
            <p className="text-gray-300 text-sm font-medium">
              سجّل دخولك عشان تكمل
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-white/80 flex items-center gap-2">
                <Mail size={14} className="text-[#9D4EDD]" />
                الايميل
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-white/30 font-bold outline-none focus:border-[#9D4EDD] transition-all"
                dir="ltr" disabled={loading} required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white/80 flex items-center gap-2">
                <Lock size={14} className="text-[#FFD700]" />
                كلمة السر
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-4 py-3 pl-12 rounded-2xl bg-white/[0.06] border-2 border-white/10 text-white placeholder:text-white/30 font-bold outline-none focus:border-[#FFD700] transition-all"
                  dir="ltr" disabled={loading} required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-sm font-bold text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-base text-white shadow-2xl shadow-[#4CC9F0]/30 flex items-center justify-center gap-3 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #4CC9F0, #9D4EDD)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>تسجيل دخول</span>
                  <ArrowRight size={18} className="rotate-180" />
                </>
              )}
            </motion.button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-white/60 text-sm font-bold">
              معندكش حساب؟{' '}
              <button onClick={() => router.push(`/signup?plan=${planType}`)}
                className="text-[#FF4D6D] font-black hover:underline"
              >
                أنشئ حساب
              </button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
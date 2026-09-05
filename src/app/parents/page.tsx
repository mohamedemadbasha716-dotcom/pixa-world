'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Flame, Trophy, BookOpen, TrendingUp,
  Calendar, Crown, Clock, Zap, Ear, Mic, PenTool,
  ShieldCheck, Lock, LogIn, LogOut, Sparkles, Rocket
} from 'lucide-react';
import { getParentDashboardData, type ParentDashboardData } from '@/lib/parentsDashboard';
import { supabase } from '@/lib/supabase';

export default function ParentsDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<ParentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getParentDashboardData();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="text-[#FF4D6D]" size={48} />
        </motion.div>
      </div>
    );
  }

  // 🔒 إذا كان الأب غير مسجل الدخول -> تظهر شاشة الحماية لمنع الأطـفال
  if (!data?.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white font-sans flex items-center justify-center p-6" dir="rtl">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9D4EDD]/10 rounded-full blur-[120px]" />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center shadow-2xl">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#9D4EDD] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FF4D6D]/30">
            <Lock size={32} className="text-white" />
          </div>

          <h1 className="text-2xl font-black mb-3">منطقة أولياء الأمور فقط</h1>
          <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
            هذه الصفحة محمية وخاصة بأولياء الأمور لمتابعة تقدم أطفالهم من أي مكان في العالم. يرجى تسجيل الدخول للوصول للتقرير.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#FF4D6D] to-[#F72585] shadow-lg shadow-[#FF4D6D]/30 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              تسجيل دخول ولي الأمر
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-2xl font-bold text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const getPlanNameAr = (plan: string) => {
    switch (plan) {
      case 'monthly': return 'شهري';
      case 'quarterly': return '3 شهور';
      case 'yearly': return 'سنوي';
      default: return 'مجاني';
    }
  };

  const maxWeekly = Math.max(...data.weeklyActivity.map(d => d.lessons), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1420] to-[#0a0e1a] text-white font-sans" dir="rtl">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4CC9F0]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF4D6D]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* الهيدر مع زر الخروج لحماية الخصوصية */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
          className="flex items-center justify-between mb-8">
          <button onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <ArrowLeft size={16} /> الرئيسية
          </button>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-white/80 bg-gradient-to-r from-[#06D6A0]/20 to-[#4CC9F0]/20 border border-[#06D6A0]/30 px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-[#06D6A0]" />
              <span>حساب ولي الأمر ({data.parentEmail})</span>
            </div>

            <button onClick={handleLogout} title="تسجيل خروج ولي الأمر"
              className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-xl transition-colors">
              <LogOut size={14} />
              <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </motion.header>

        {/* الترحيب */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-10">
          <h1 className="text-2xl md:text-4xl font-black mb-2">
            تقرير متابعة <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D6D] to-[#9D4EDD]">{data.playerName}</span> 🌟
          </h1>
          <p className="text-gray-400 font-medium text-sm">مربوط بحسابك كولي أمر ومحدث مباشرة من السيرفر.</p>
        </motion.div>

        {/* الإحصائيات الرئيسية */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          
          {[
            { icon: Star, label: 'نجوم', value: data.totalStars, color: '#FFD700' },
            { icon: Trophy, label: 'دروس مكتملة', value: data.totalCompletedLessons, color: '#06D6A0' },
            { icon: Flame, label: 'أيام متتالية', value: data.streakDays, color: '#FF6B35' },
            { icon: Zap, label: 'نقاط', value: data.totalPoints, color: '#9D4EDD' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }}
              className="p-5 rounded-3xl border backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                borderColor: `${stat.color}30`,
              }}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={22} style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color}80)` }} />
                <div className="text-[10px] font-bold text-gray-400">{stat.label}</div>
              </div>
              <div className="text-3xl font-black" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* التقدم في اللغات */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-10">
          <h2 className="text-lg font-black mb-5 flex items-center gap-2">
            <BookOpen size={20} className="text-[#4CC9F0]" />
            التقدم في اللغات
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.languages.map((lang, i) => (
              <motion.div key={lang.langCode} whileHover={{ scale: 1.01 }}
                className="p-6 rounded-3xl border backdrop-blur-md relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${lang.langColor}12, ${lang.langColor}02)`,
                  borderColor: `${lang.langColor}30`,
                }}>
                
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20"
                  style={{ backgroundColor: lang.langColor }} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{lang.langFlag}</div>
                      <div>
                        <h3 className="font-black text-lg">اللغة {lang.langNameAr}</h3>
                        <p className="text-xs text-gray-400 font-bold">
                          {lang.completedLessons} من {lang.totalLessons} درس
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl font-black" style={{ color: lang.langColor }}>
                      {lang.progressPercent}%
                    </div>
                  </div>

                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.progressPercent}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                      className="h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${lang.langColor}, ${lang.langColor}aa)`,
                        boxShadow: `0 0 15px ${lang.langColor}80`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Star size={12} className="text-yellow-400" fill="#FFD700" />
                      <span className="font-bold text-white/80">
                        {lang.earnedStars} / {lang.totalStars} نجمة
                      </span>
                    </div>
                    {lang.lastActivity && (
                      <div className="text-gray-400 font-medium">
                        آخر نشاط: {new Date(lang.lastActivity).toLocaleDateString('ar-EG')}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* المهارات ونقاط القوة */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mb-10">
          <h2 className="text-lg font-black mb-5 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#06D6A0]" />
            نقاط قوة طفلك
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Ear, label: 'الاستماع', value: data.strengths.listening, color: '#4CC9F0', desc: 'يفهم الكلمات بوضوح' },
              { icon: Mic, label: 'النطق', value: data.strengths.speaking, color: '#FF6B35', desc: 'ينطق بلغة صحيحة' },
              { icon: PenTool, label: 'الكتابة', value: data.strengths.writing, color: '#9D4EDD', desc: 'يكتب الكلمات بدقة' },
            ].map((skill, i) => (
              <motion.div key={i} whileHover={{ y: -3 }}
                className="p-5 rounded-3xl border backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${skill.color}12, ${skill.color}02)`,
                  borderColor: `${skill.color}30`,
                }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${skill.color}25`, border: `1px solid ${skill.color}50` }}>
                    <skill.icon size={18} style={{ color: skill.color }} />
                  </div>
                  <div>
                    <div className="font-black text-sm">{skill.label}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{skill.desc}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.15 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color, boxShadow: `0 0 10px ${skill.color}80` }}
                    />
                  </div>
                  <span className="font-black text-sm" style={{ color: skill.color }}>{skill.value}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* النشاط الأسبوعي */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mb-10">
          <h2 className="text-lg font-black mb-5 flex items-center gap-2">
            <Calendar size={20} className="text-[#FFD700]" />
            نشاط الأسبوع الحالي
          </h2>
          
          <div className="p-6 rounded-3xl bg-white/[0.05] border border-white/[0.10] backdrop-blur-md">
            <div className="flex items-end justify-between gap-2 h-40">
              {data.weeklyActivity.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="flex-1 w-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.lessons / maxWeekly) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + i * 0.1, type: 'spring' }}
                      className="w-full rounded-t-lg relative group cursor-pointer"
                      style={{
                        background: day.lessons > 0 
                          ? 'linear-gradient(180deg, #FF4D6D, #9D4EDD)' 
                          : 'rgba(255,255,255,0.05)',
                        minHeight: day.lessons > 0 ? '10px' : '4px',
                        boxShadow: day.lessons > 0 ? '0 0 15px rgba(255,77,109,0.4)' : 'none',
                      }}
                    >
                      {day.lessons > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-black text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.lessons}
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-[10px] font-bold text-gray-400">{day.day}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* الاشتراك */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-lg font-black mb-5 flex items-center gap-2">
            <Crown size={20} className="text-[#FFD700]" />
            حالة الاشتراك
          </h2>
          
          <div className="p-6 rounded-3xl border backdrop-blur-md relative overflow-hidden"
            style={{
              background: data.subscription.planType === 'free'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                : 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.08))',
              borderColor: data.subscription.planType === 'free' ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.3)',
            }}>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {data.subscription.planType !== 'free' && <Crown className="text-[#FFD700]" size={20} />}
                  <span className="font-black text-lg">
                    الخطة الحالية: {getPlanNameAr(data.subscription.planType)}
                  </span>
                </div>
                {data.subscription.daysRemaining !== null && data.subscription.daysRemaining > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock size={14} />
                    <span>متبقي {data.subscription.daysRemaining} يوم على انتهاء الاشتراك</span>
                  </div>
                )}
                {data.subscription.planType === 'free' && (
                  <p className="text-sm text-gray-400 font-medium">
                    اشترك الآن لفتح كل الدروس لجميع أطفالك!
                  </p>
                )}
              </div>
              
              {data.subscription.planType === 'free' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/plans')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #FF4D6D, #F72585)',
                    boxShadow: '0 8px 25px rgba(220,38,38,0.4)',
                  }}>
                  <Rocket size={16} />
                  ترقية الاشتراك
                </motion.button>
              )}
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
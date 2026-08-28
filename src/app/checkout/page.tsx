'use client';
import { motion } from 'framer-motion';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowRight, User, Mail, Phone, Lock, CreditCard, Send, CheckCircle
} from 'lucide-react';

interface PlanDetails {
  name: string;
  price: number;
  currency: string;
}

// ✨ تفعيل الـ 3 خطط لجميع الدول بخصم 50%
const PLANS_DATA: Record<string, Record<string, PlanDetails>> = {
  eg: {
    monthly: { name: 'الاشتراك الشهري المميز ⚡', price: 200, currency: 'جنيه مصري' },
    quarterly: { name: 'الاشتراك الربع سنوي المميز 🎯', price: 350, currency: 'جنيه مصري' },
    yearly: { name: 'الاشتراك السنوي المميز 🏆', price: 500, currency: 'جنيه مصري' },
  },
  sa: {
    monthly: { name: 'الاشتراك الشهري المميز ⚡', price: 99, currency: 'ريال سعودي' },
    quarterly: { name: 'الاشتراك الربع سنوي المميز 🎯', price: 199, currency: 'ريال سعودي' },
    yearly: { name: 'الاشتراك السنوي المميز 🏆', price: 349, currency: 'ريال سعودي' },
  },
  ae: {
    monthly: { name: 'الاشتراك الشهري المميز ⚡', price: 109, currency: 'درهم إماراتي' },
    quarterly: { name: 'الاشتراك الربع سنوي المميز 🎯', price: 219, currency: 'درهم إماراتي' },
    yearly: { name: 'الاشتراك السنوي المميز 🏆', price: 379, currency: 'درهم إماراتي' },
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const country = searchParams.get('country') || 'eg';
  // 🚀 قراءة الخطة المختارة من الرابط بشكل ديناميكي
  const plan = searchParams.get('plan') || 'yearly';

  const selectedCountryPlans = PLANS_DATA[country] || PLANS_DATA['eg'];
  const planInfo = selectedCountryPlans[plan] || selectedCountryPlans['yearly'];

  const [childName, setChildName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [formError, setFormError] = useState('');

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!childName || !parentPhone || !parentEmail) {
      setFormError('⚠️ نرجو ملء جميع البيانات لإنشاء الحساب بنجاح.');
      return;
    }

    const message = `مرحباً بأبطال PIXA WORLD 👋

لقد قمت بتحويل قيمة الاشتراك وأود تفعيل حساب طفلي.

📋 تفاصيل الطلب:
- اسم الباقة: ${planInfo.name}
- قيمة الاشتراك: ${planInfo.price} ${planInfo.currency}

👤 بيانات الحساب:
- اسم الطفل: ${childName}
- هاتف ولي الأمر: ${parentPhone}
- البريد الإلكتروني: ${parentEmail}

✨ مرفق لقطة الشاشة (سكرين شوت) لتأكيد عملية التحويل وتفعيل الحساب فوراً!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '201515023109';

    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1a1a3e] via-[#2d1b4e] to-[#1e1b4b] text-white font-sans py-12 px-4 relative"
      dir="rtl"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-[#FF4D6D]/15 blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-[#9D4EDD]/15 blur-[80px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 cursor-pointer"
          >
            <ArrowRight size={16} />
            <span>رجوع للأسعار</span>
          </button>
          <span
            className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-purple-200 cursor-pointer"
            onClick={() => router.push('/')}
          >
            PIXA WORLD
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white">
            خطوة واحدة وتستمتع بمغامرة طفلك 🚀
          </h1>
          <p className="text-gray-400 text-sm">
            اتبع خطوات الدفع البسيطة أدناه لتأكيد الحساب
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            {/* خطوات التحويل */}
            <div className="bg-white/[0.06] border border-white/12 rounded-3xl p-6 space-y-6 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#06D6A0]/20 flex items-center justify-center text-[#06D6A0]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="font-black text-base text-white">خطوات تحويل المبلغ</h2>
                  <p className="text-[11px] text-gray-400">طريقة الدفع الفورية والمباشرة</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#010103]/40 border border-white/5 space-y-3">
                  <p className="text-xs text-gray-400 font-bold">
                    حول مبلغ الاشتراك على المحفظة التالية:
                  </p>
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-lg font-black tracking-widest text-[#06D6A0]" dir="ltr">
                      01515023109
                    </span>
                    <span className="text-[10px] bg-[#06D6A0]/20 text-[#06D6A0] px-2.5 py-1 rounded-full font-black">
                      نشط ومؤكد ✅
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                    * نقبل التحويل من أي محفظة إلكترونية (فودافون كاش، اتصالات كاش، أورنج كاش) أو تطبيق إنستاباي (InstaPay).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">
                  <span className="text-xl">📸</span>
                  <p className="text-xs font-bold leading-relaxed">
                    هام جداً: بعد إتمام عملية التحويل، يرجى أخذ لقطة شاشة (Screenshot) لرسالة التأكيد لحفظها وإرسالها لنا.
                  </p>
                </div>
              </div>
            </div>

            {/* فورم البيانات */}
            <form
              onSubmit={handleCompletePayment}
              className="bg-white/[0.06] border border-white/12 rounded-3xl p-6 space-y-5 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#9D4EDD]/20 flex items-center justify-center text-[#9D4EDD]">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="font-black text-base text-white">بيانات حساب البطل الجديد</h2>
                  <p className="text-[11px] text-gray-400">لتجهيز خريطة المغامرة الخاصة بالطفل</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">اسم الطفل البطل</label>
                  <div className="relative">
                    <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="اكتب اسم طفلك هنا"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] outline-none rounded-xl py-3.5 pr-11 pl-4 text-sm font-bold text-white transition-all placeholder:text-gray-600 placeholder:font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">رقم واتساب ولي الأمر</label>
                  <div className="relative">
                    <Phone size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="مثال: 01012345678"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] outline-none rounded-xl py-3.5 pr-11 pl-4 text-sm font-bold text-white transition-all placeholder:text-gray-600 placeholder:font-bold text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">بريد إلكتروني فعال لولي الأمر</label>
                  <div className="relative">
                    <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] outline-none rounded-xl py-3.5 pr-11 pl-4 text-sm font-bold text-white transition-all placeholder:text-gray-600 placeholder:font-bold text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold text-center">
                  {formError}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-3 shadow-2xl shadow-[#06D6A0]/20 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #06D6A0, #4CC9F0)' }}
              >
                <Send size={18} />
                <span>إتمام الدفع وتأكيد الاشتراك</span>
                <ArrowRight size={16} className="rotate-180" />
              </motion.button>

              <div className="text-center">
                <span className="text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1.5">
                  <Lock size={10} className="text-[#06D6A0]" />
                  بيانات طفلك مشفرة وآمنة تماماً بالكامل
                </span>
              </div>
            </form>
          </div>

          {/* ملخص الباقة */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/12 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6">
              <h3 className="font-black text-sm text-gray-300 border-b border-white/10 pb-3">
                الباقة المختارة
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[13px] text-[#FFD700]">{planInfo.name}</span>
                  <span className="text-[10px] bg-[#FFD700]/20 text-[#FFD700] px-2.5 py-1 rounded-full font-black whitespace-nowrap">
                    {plan === 'yearly' ? 'سنة كاملة 🏆' : plan === 'quarterly' ? '3 أشهر 🎯' : 'شهر كامل ⚡'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-1 text-center">
                  <span className="text-[11px] text-gray-400 font-bold block">مجموع المستحق دفعه:</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-black text-white">{planInfo.price}</span>
                    <span className="text-xs text-gray-300 font-bold">{planInfo.currency}</span>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/10" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle size={14} className="text-[#06D6A0]" />
                    <span>تفعيل فوري آمن ومباشر</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle size={14} className="text-[#06D6A0]" />
                    <span>
                      {plan === 'yearly' 
                        ? 'منهج الألماني والإسباني وكل اللغات القادمة' 
                        : plan === 'quarterly' 
                        ? 'منهج الألماني والإسباني + لغة ثالثة قادمة' 
                        : 'لغة واحدة من اختيارك بالكامل'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle size={14} className="text-[#06D6A0]" />
                    <span>ألعاب تفاعلية ونطق الناطقين الأصليين</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-300">
                    <CheckCircle size={14} className="text-[#06D6A0]" />
                    <span>لوحات تحكم ذكية لولي الأمر للتقييم</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-center space-y-2">
              <span className="text-2xl">💁‍♂️</span>
              <h4 className="text-xs font-black text-white">هل تواجه مشكلة؟</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                يسعدنا مساعدتك في أي وقت لحل مشاكلك وتفعيل حسابك فوراً. تواصل معنا على الواتساب مباشرة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a3e] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
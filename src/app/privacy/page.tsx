'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, UserCheck, Mic, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07090D] text-white font-sans selection:bg-[#FF4D6D] selection:text-white" dir="rtl">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4CC9F0]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FF4D6D]/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 mb-8 w-fit"
        >
          <ArrowLeft size={16} /> العودة للرئيسية
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#06D6A0]/20 border border-[#06D6A0]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#6ee7b7] mb-4">
            <ShieldCheck size={16} /> متوافق مع معايير حماية الطفل الدولية (COPPA)
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-gray-400 font-medium">نحن نضع أمان طفلك الرقمي في قمة أولوياتنا.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#FF4D6D] mb-4">
              <EyeOff size={24} /> 1. بيئة خالية من الإعلانات تماماً
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              نلتزم في <span dir="ltr" className="text-white font-bold">PIXA WORLD</span> بتقديم بيئة تعليمية نقية بنسبة 100%. لا تحتوي منصتنا على أي إعلانات تجارية، ولا نقوم بتتبع سلوك الأطفال لأغراض تسويقية، ولا نسمح لأي أطراف خارجية (Third-Parties) بجمع بيانات أطفالكم.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#4CC9F0] mb-4">
              <UserCheck size={24} /> 2. المعلومات التي نجمعها وكيفية استخدامها
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium mb-4">نجمع الحد الأدنى من البيانات اللازمة لتشغيل المنصة، وتشمل:</p>
            <ul className="space-y-3 text-gray-300 leading-relaxed font-medium list-disc list-inside px-4">
              <li><strong className="text-white">بيانات ولي الأمر:</strong> البريد الإلكتروني (لإنشاء الحساب، وتفعيل الاشتراك، وإرسال تقارير مستوى الطفل).</li>
              <li><strong className="text-white">بيانات الطفل:</strong> الاسم الأول (أو اسم مستعار) والعمر، وذلك لتخصيص التجربة التعليمية.</li>
              <li><strong className="text-white">بيانات التقدم (Progress Data):</strong> الدروس المكتملة، النقاط، الأوسمة، والنجوم المحققة، لضمان استمرارية تجربة التعلم.</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm border-l-4 border-l-[#9D4EDD]">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#9D4EDD] mb-4">
              <Mic size={24} /> 3. خصوصية الميكروفون والتعرف على الصوت
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              تستخدم منصتنا تقنية التعرف على الصوت (Speech Recognition) لتدريب الطفل على النطق الصحيح. <strong>نحن لا نقوم بتسجيل أو تخزين أو الاحتفاظ بأي مقاطع صوتية لطفلك.</strong> تتم معالجة الصوت لحظياً داخل متصفحك فقط لتقييم النطق، ثم يتم التخلص منه فوراً.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#FFD700] mb-4">
              <Lock size={24} /> 4. أمن البيانات وحمايتها
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              تُحفظ جميع بيانات الحسابات والتقدم التعليمي في قواعد بيانات مشفرة ومؤمنة بأحدث تقنيات التشفير السحابي (Supabase). لا يمتلك أي شخص حق الوصول لهذه البيانات سوى ولي الأمر وفريق الدعم الفني المختص عند الحاجة فقط.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#06D6A0] mb-4">
              <Database size={24} /> 5. حقوق ولي الأمر
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              بصفتك ولي الأمر، تمتلك الحق الكامل في مراجعة بيانات طفلك، تعديلها، أو طلب حذف الحساب نهائياً من خوادمنا. لحذف البيانات أو الاستفسار، يمكنك التواصل معنا في أي وقت عبر قنوات الاتصال الرسمية للمنصة، وسنقوم بمعالجة طلبك خلال 24 ساعة.
            </p>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
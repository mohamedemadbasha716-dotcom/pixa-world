'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, Scale, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsOfUsePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07090D] text-white font-sans selection:bg-[#9D4EDD] selection:text-white" dir="rtl">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#9D4EDD]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 mb-8 w-fit"
        >
          <ArrowLeft size={16} /> العودة للرئيسية
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#9D4EDD]/20 border border-[#9D4EDD]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[#d8b4fe] mb-4">
            <FileText size={16} /> الاتفاقية القانونية وحقوق الاستخدام
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
            شروط الاستخدام
          </h1>
          <p className="text-gray-400 font-medium">تُنظم هذه الشروط علاقتك بمنصة PIXA WORLD التعليمية.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#9D4EDD] mb-4">
              <CheckCircle2 size={24} /> 1. الموافقة والمسؤولية القانونية
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              باستخدامك لمنصة <span dir="ltr">PIXA WORLD</span>، فإنك تقر بأنك ولي الأمر أو الوصي القانوني للطفل المستخدم للمنصة. أنت توافق بالنيابة عنك وعن طفلك على الالتزام بكافة هذه الشروط. تقع مسؤولية الحفاظ على سرية بيانات تسجيل الدخول على عاتق ولي الأمر بالكامل.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#FFD700] mb-4">
              <CreditCard size={24} /> 2. الحسابات والاشتراكات
            </h2>
            <ul className="space-y-3 text-gray-300 leading-relaxed font-medium list-disc list-inside px-4">
              <li>توفر المنصة تجربة مجانية مبدئية، وبعدها يتطلب إكمال الدروس اشتراكاً مدفوعاً (شهري أو سنوي).</li>
              <li>الاشتراك يمنح حق الوصول للمحتوى لحساب طفل واحد فقط (أو الاستخدام العائلي الداخلي).</li>
              <li><strong className="text-white">يُمنع منعاً باتاً:</strong> مشاركة بيانات الحساب مع أفراد خارج العائلة، أو بيع الحساب، أو استخدامه لأغراض تجارية (مثل تشغيله في مراكز تعليمية أو دور حضانة دون تصريح رسمي من إدارة المنصة). سيؤدي ذلك إلى الحظر الفوري للحساب دون تعويض.</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm border-l-4 border-l-[#4CC9F0]">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#4CC9F0] mb-4">
              <Scale size={24} /> 3. حقوق الملكية الفكرية
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium">
              جميع حقوق الطبع والنشر، العلامات التجارية، والملكية الفكرية المتعلقة بالمنصة (بما في ذلك وليس حصراً: المنهج التعليمي، الخرائط، الأكواد البرمجية، الرسوميات، والشخصيات مثل "كارل النسر" و"تورو الثور") هي ملكية حصرية لـ <span dir="ltr">PIXA WORLD</span>. لا يُسمح بنسخ أو تعديل أو إعادة إنتاج أي جزء من المنصة.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="flex items-center gap-3 text-xl font-black text-[#FF6B35] mb-4">
              <AlertTriangle size={24} /> 4. إخلاء المسؤولية والتحديثات
            </h2>
            <p className="text-gray-300 leading-relaxed font-medium mb-4">
              نحن نعمل بجهد لضمان استمرارية عمل المنصة بأعلى كفاءة، ومع ذلك:
            </p>
            <ul className="space-y-3 text-gray-300 leading-relaxed font-medium list-disc list-inside px-4">
              <li>نحتفظ بالحق في تحديث وتعديل المناهج وإضافة أو إزالة بعض الخصائص لتحسين التجربة التعليمية.</li>
              <li>قد تتوقف المنصة لفترات قصيرة ومؤقتة لأغراض الصيانة التقنية.</li>
              <li>نحتفظ بالحق في تعديل "شروط الاستخدام" في أي وقت، وسيتم إشعار المستخدمين بأي تغييرات جوهرية.</li>
            </ul>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
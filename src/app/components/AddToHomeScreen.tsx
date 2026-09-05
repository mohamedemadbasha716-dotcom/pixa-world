'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, Plus, Download, Smartphone, Monitor } from 'lucide-react';

const STORAGE_KEY = 'pixa_a2hs_done';
const DISMISS_KEY = 'pixa_a2hs_dismissed_at';
const DISMISS_DAYS = 7;

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if ((window.navigator as any).standalone === true) return true;
  return false;
}

function getPlatform(): 'ios' | 'android' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  return 'desktop';
}

export default function AddToHomeScreen() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [step, setStep] = useState<'main' | 'guide'>('main');

  useEffect(() => {
    if (isStandalone()) {
      localStorage.setItem(STORAGE_KEY, '1');
      return;
    }

    if (localStorage.getItem(STORAGE_KEY) === '1') return;

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const days = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (days < DISMISS_DAYS) return;
    }

    setPlatform(getPlatform());

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    const t = setTimeout(() => setShow(true), 2000);

    return () => {
      clearTimeout(t);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const markDone = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    localStorage.removeItem(DISMISS_KEY);
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (outcome === 'accepted') {
        markDone();
        return;
      }
      setStep('guide');
      return;
    }
    setStep('guide');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #1a1435 0%, #0f0a1f 100%)',
              border: '2px solid rgba(255,215,0,0.35)',
              fontFamily: "'Tajawal', sans-serif",
            }}
            dir="rtl"
          >
            {/* Header */}
            <div
              className="relative p-5 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(114,9,183,0.2))',
              }}
            >
              <button
                onClick={dismiss}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
              >
                <X size={16} />
              </button>

              {/* 🆕 أيقونة المنصة الجديدة المظبوطة */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-3 w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-400/50 shadow-lg"
                style={{ boxShadow: '0 0 20px rgba(255,215,0,0.4)' }}
              >
                <img
                  src="/icons/icon-192.png"
                  alt="Pixa World"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <h2 className="text-xl font-black text-white mb-1">
                ثبّت بيكسا وورلد على جهازك!
              </h2>
              <p className="text-sm text-white/70 font-bold leading-relaxed">
                هتفتحها بضغطة واحدة زي أي تطبيق 🚀
              </p>
            </div>

            <div className="p-5 space-y-4">
              {step === 'main' ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: '⚡', t: 'فتح فوري' },
                      { icon: '📶', t: 'بدون لينك' },
                      { icon: '🏠', t: 'من الشاشة' },
                    ].map((f) => (
                      <div
                        key={f.t}
                        className="rounded-xl p-3 text-center"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        <div className="text-2xl mb-1">{f.icon}</div>
                        <div className="text-[11px] font-black text-white/80">
                          {f.t}
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleInstallClick}
                    className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                      borderBottom: '4px solid #B8860B',
                      boxShadow: '0 8px 30px rgba(255,215,0,0.35)',
                    }}
                  >
                    <Download size={20} />
                    {deferredPrompt ? 'تثبيت الآن ✨' : 'كيف تثبّته؟ 📲'}
                  </motion.button>

                  <button
                    onClick={dismiss}
                    className="w-full py-2.5 rounded-xl font-bold text-sm text-white/50 hover:text-white/80 transition-colors"
                  >
                    لاحقاً
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center mb-1">
                    {platform === 'ios' ? (
                      <Smartphone size={18} className="text-blue-300" />
                    ) : platform === 'android' ? (
                      <Smartphone size={18} className="text-green-300" />
                    ) : (
                      <Monitor size={18} className="text-purple-300" />
                    )}
                    <span className="font-black text-white text-sm">
                      {platform === 'ios'
                        ? 'آيفون / آيباد'
                        : platform === 'android'
                        ? 'أندرويد'
                        : 'كمبيوتر'}
                    </span>
                  </div>

                  {platform === 'ios' && (
                    <div className="space-y-3">
                      {[
                        {
                          n: '1',
                          text: 'اضغط زر المشاركة',
                          icon: <Share size={16} className="text-blue-400" />,
                          hint: 'في أسفل أو أعلى المتصفح ⬆',
                        },
                        {
                          n: '2',
                          text: 'اختر "إضافة إلى الشاشة الرئيسية"',
                          icon: <Plus size={16} className="text-green-400" />,
                          hint: 'Add to Home Screen',
                        },
                        {
                          n: '3',
                          text: 'اضغط "إضافة"',
                          icon: <Download size={16} className="text-yellow-400" />,
                          hint: 'هتظهر أيقونة بيكسا وورلد 🏠',
                        },
                      ].map((s) => (
                        <div
                          key={s.n}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-black text-xs text-black flex-shrink-0">
                            {s.n}
                          </div>
                          <div className="flex-1 text-right">
                            <div className="flex items-center gap-1.5 justify-end font-black text-white text-sm">
                              {s.icon} {s.text}
                            </div>
                            <div className="text-[11px] text-white/50 font-bold mt-0.5">
                              {s.hint}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {platform === 'android' && (
                    <div className="space-y-3">
                      {[
                        {
                          n: '1',
                          text: 'اضغط قائمة ⋮ أعلى المتصفح',
                          hint: 'التلت نقط في كروم',
                        },
                        {
                          n: '2',
                          text: 'اختر "إضافة إلى الشاشة الرئيسية"',
                          hint: 'Add to Home screen / Install app',
                        },
                        {
                          n: '3',
                          text: 'اضغط "تثبيت" أو "إضافة"',
                          hint: 'هتظهر أيقونة بيكسا وورلد 🏠',
                        },
                      ].map((s) => (
                        <div
                          key={s.n}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-black text-xs text-black flex-shrink-0">
                            {s.n}
                          </div>
                          <div className="flex-1 text-right">
                            <div className="font-black text-white text-sm">
                              {s.text}
                            </div>
                            <div className="text-[11px] text-white/50 font-bold mt-0.5">
                              {s.hint}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {platform === 'desktop' && (
                    <div className="space-y-3">
                      {[
                        {
                          n: '1',
                          text: 'في كروم: أيقونة التثبيت ⊕ في شريط العنوان',
                          hint: 'يمين شريط اللينك',
                        },
                        {
                          n: '2',
                          text: 'أو من القائمة ⋮ ← "تثبيت بيكسا وورلد..."',
                          hint: 'Install Pixa World',
                        },
                        {
                          n: '3',
                          text: 'هتفتح كنافذة مستقلة زي البرنامج',
                          hint: 'من سطح المكتب أو قائمة ابدأ',
                        },
                      ].map((s) => (
                        <div
                          key={s.n}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center font-black text-xs text-white flex-shrink-0">
                            {s.n}
                          </div>
                          <div className="flex-1 text-right">
                            <div className="font-black text-white text-sm">
                              {s.text}
                            </div>
                            <div className="text-[11px] text-white/50 font-bold mt-0.5">
                              {s.hint}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={markDone}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white"
                    style={{
                      background: 'linear-gradient(135deg, #58CC02, #3A8A01)',
                    }}
                  >
                    تمام، ثبّتته! ✅
                  </motion.button>

                  <button
                    onClick={() => setStep('main')}
                    className="w-full py-2 font-bold text-xs text-white/50 hover:text-white/80"
                  >
                    ← رجوع
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
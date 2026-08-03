'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { KarlMood, KarlMessage } from '@/lib/types/lesson';

interface KarlEagleProps {
  mood: KarlMood;
  message: KarlMessage | null;
  idleGlowColor?: string;
}

export default function KarlEagle({
  mood,
  message,
  idleGlowColor = '#4CC9F0',
}: KarlEagleProps) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>('desktop');
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const isMobile = screenSize === 'mobile';

  // 📱 كشف حجم الشاشة
  useEffect(() => {
    const checkSize = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w < 640) setScreenSize('mobile');
      else if (w < 1024) setScreenSize('tablet');
      else if (w < 1440) setScreenSize('laptop');
      else setScreenSize('desktop');
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // ⌨️ كشف فتح الكيبورد على الموبايل
  useEffect(() => {
    if (!isMobile || typeof window === 'undefined') return;

    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;
      setKeyboardOpen(heightDiff > 150);
    };

    window.addEventListener('resize', handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isMobile]);

  // 🎯 حجم النسر
  const eagleSize =
    screenSize === 'mobile' ? (keyboardOpen ? 32 : 42) :
    screenSize === 'tablet' ? 55 :
    screenSize === 'laptop' ? 70 :
    85;

  // 🎯 التموضع: يمين الشاشة على المنتصف عمودياً
  const positionStyle =
    screenSize === 'mobile' ? {
      top: keyboardOpen ? 60 : 90,
      right: 6,
    } :
    screenSize === 'tablet' ? {
      top: '35%',
      right: 15,
    } :
    {
      top: '30%',
      right: 25,
    };

  return (
    <div
      className="fixed pointer-events-none transition-all duration-300"
      style={{ zIndex: 50, ...positionStyle }}
    >
      {/* 🦅 النسر + الرسالة فوقه */}
      <div className="relative">

        {/* 💬 الرسالة الصغيرة فوق النسر مباشرة */}
        <AnimatePresence>
          {message && !keyboardOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                y: 5,
                transition: { duration: 0.15 }
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 20,
              }}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                bottom: '100%',
                marginBottom: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {/* البلون الصغير */}
              <div
                className="relative px-3 py-1.5 rounded-2xl shadow-xl border backdrop-blur-md"
                style={{
                  background:
                    mood === 'celebrate'
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.98), rgba(255,140,0,0.98))'
                      : mood === 'happy'
                      ? 'linear-gradient(135deg, rgba(88,204,2,0.98), rgba(76,201,240,0.98))'
                      : 'linear-gradient(135deg, rgba(255,107,107,0.98), rgba(247,37,133,0.98))',
                  borderColor: 'rgba(255,255,255,0.5)',
                  boxShadow:
                    mood === 'celebrate'
                      ? '0 6px 20px rgba(255,215,0,0.5)'
                      : mood === 'happy'
                      ? '0 6px 20px rgba(88,204,2,0.4)'
                      : '0 6px 20px rgba(255,107,107,0.4)',
                }}
              >
                {/* النص الألماني */}
                <div
                  className="text-xs font-black text-white text-center leading-tight"
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }}
                >
                  {message.de}
                </div>

                {/* النص العربي */}
                <div
                  className="text-[9px] font-bold text-white/95 text-center leading-tight"
                  style={{
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {message.ar}
                </div>

                {/* السهم لأسفل بيشاور على النسر */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    bottom: '-6px',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${
                      mood === 'celebrate'
                        ? 'rgba(255,140,0,0.98)'
                        : mood === 'happy'
                        ? 'rgba(76,201,240,0.98)'
                        : 'rgba(247,37,133,0.98)'
                    }`,
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🦅 النسر */}
        <motion.div
          animate={
            mood === 'celebrate'
              ? { y: [-12, 0, -12], rotate: [-15, 15, -15], scale: [1, 1.15, 1] }
              : mood === 'happy'
              ? { y: [-8, 0, -8], rotate: [-8, 8, -8] }
              : mood === 'sad'
              ? { y: [0, -3, 0], rotate: [-3, 3, -3] }
              : { y: [-4, 4, -4] }
          }
          transition={{
            duration: mood === 'celebrate' ? 0.5 : mood === 'happy' ? 0.8 : 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          {/* توهج خلف النسر */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                mood === 'celebrate'
                  ? 'radial-gradient(circle, #FFD70066, transparent 70%)'
                  : mood === 'happy'
                  ? 'radial-gradient(circle, #58CC0266, transparent 70%)'
                  : mood === 'sad'
                  ? 'radial-gradient(circle, #FF6B6B44, transparent 70%)'
                  : `radial-gradient(circle, ${idleGlowColor}44, transparent 70%)`,
              filter: 'blur(15px)',
              transform: 'scale(1.5)',
            }}
            animate={{ scale: [1.4, 1.7, 1.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <img
            src="/characters/karl-3d.webp"
            alt="كارل النسر"
            style={{
              width: `${eagleSize}px`,
              height: `${eagleSize}px`,
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter:
                mood === 'celebrate'
                  ? 'drop-shadow(0 8px 20px rgba(255,215,0,0.8))'
                  : mood === 'happy'
                  ? 'drop-shadow(0 6px 16px rgba(88,204,2,0.7))'
                  : mood === 'sad'
                  ? 'drop-shadow(0 4px 12px rgba(255,107,107,0.5)) saturate(0.6)'
                  : `drop-shadow(0 6px 14px ${idleGlowColor}80)`,
              transition: 'all 0.3s ease',
            }}
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  );
}
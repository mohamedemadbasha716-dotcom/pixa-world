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

  // 🎯 التموضع الجديد: يمين الشاشة على المنتصف عمودياً
  // بعيد عن الـ HUD العلوي والسفلي والكروت في النص
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
      {/* 🎯 حاوية أساسية: النسر + الرسالة جنبه على الشمال */}
      <div className="flex items-center gap-2 flex-row-reverse">
        
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
          className="relative flex-shrink-0"
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

        {/* 💬 الرسالة على شمال النسر */}
        <AnimatePresence>
          {message && !keyboardOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.6, x: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative flex items-center"
              style={{
                maxWidth: isMobile ? '150px' : '220px',
              }}
            >
              {/* السهم اللي بيشاور على النسر */}
              <div
                className="w-0 h-0 flex-shrink-0"
                style={{
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderLeft: `8px solid ${
                    mood === 'celebrate' || mood === 'happy'
                      ? 'rgba(88,204,2,0.95)'
                      : 'rgba(255,107,107,0.95)'
                  }`,
                  marginRight: '-1px',
                }}
              />
              
              {/* البلون */}
              <div
                className={`${isMobile ? 'px-2.5 py-1.5' : 'px-4 py-2.5'} rounded-2xl shadow-2xl border-2 backdrop-blur-md`}
                style={{
                  background:
                    mood === 'celebrate' || mood === 'happy'
                      ? 'linear-gradient(135deg, rgba(88,204,2,0.95), rgba(76,201,240,0.95))'
                      : 'linear-gradient(135deg, rgba(255,107,107,0.95), rgba(247,37,133,0.95))',
                  borderColor: 'rgba(255,255,255,0.4)',
                }}
              >
                <div className={`${isMobile ? 'text-xs' : 'text-base'} font-black text-white text-center leading-tight`}>
                  {message.de}
                </div>
                <div className={`${isMobile ? 'text-[9px]' : 'text-xs'} font-bold text-white/90 text-center mt-0.5`}>
                  {message.ar}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
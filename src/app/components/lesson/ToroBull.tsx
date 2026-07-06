'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToroMood, ToroMessage } from '@/lib/types/spanish-lesson';

interface ToroBullProps {
  mood: ToroMood;
  message: ToroMessage | null;
  idleGlowColor?: string;
}

export default function ToroBull({
  mood,
  message,
  idleGlowColor = '#DC2626', // اللون الأحمر الإسباني الافتراضي
}: ToroBullProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // 📱 كشف الموبايل
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ⌨️ كشف فتح الكيبورد على الموبايل (لتصغير حجم Toro)
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

  // 🎯 تحديد الحجم والموقع حسب الجهاز والحالة
  const toroSize = isMobile 
    ? (keyboardOpen ? 45 : 65) 
    : 130; 

  const positionStyle = isMobile
    ? { bottom: keyboardOpen ? 8 : 12, right: 8 }
    : { bottom: 20, right: 20 };

  return (
    <div 
      className="fixed pointer-events-none transition-all duration-300" 
      style={{ zIndex: 50, ...positionStyle }}
    >
      <motion.div
        animate={
          mood === 'celebrate'
            ? { y: [-15, 0, -15], rotate: [-10, 10, -10], scale: [1, 1.2, 1] }
            : mood === 'happy'
            ? { y: [-10, 0, -10], rotate: [-5, 5, -5] }
            : mood === 'sad'
            ? { x: [-3, 3, -3], rotate: [-2, 2, -2] }
            : { y: [-4, 4, -4] }
        }
        transition={{
          duration: mood === 'celebrate' ? 0.4 : mood === 'happy' ? 0.6 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          {/* 🔥 وهج خلف Toro حسب المود */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                mood === 'celebrate'
                  ? 'radial-gradient(circle, #FFD70077, transparent 70%)'
                  : mood === 'happy'
                  ? 'radial-gradient(circle, #22C55E77, transparent 70%)'
                  : mood === 'sad'
                  ? 'radial-gradient(circle, #EF444455, transparent 70%)'
                  : `radial-gradient(circle, ${idleGlowColor}44, transparent 70%)`,
              filter: 'blur(15px)',
              transform: 'scale(1.5)',
            }}
            animate={{ scale: [1.4, 1.8, 1.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* 🐂 صورة Toro (من الفولدر المخصص) */}
          <img
            src="/spanish/characters/toro.webp"
            alt="Toro the Bull"
            style={{
              width: `${toroSize}px`,
              height: `${toroSize}px`,
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter:
                mood === 'celebrate'
                  ? 'drop-shadow(0 8px 25px rgba(255,215,0,0.8))'
                  : mood === 'happy'
                  ? 'drop-shadow(0 6px 16px rgba(34,197,94,0.7))'
                  : mood === 'sad'
                  ? 'drop-shadow(0 4px 12px rgba(239,68,68,0.5)) saturate(0.6)'
                  : `drop-shadow(0 6px 14px ${idleGlowColor}80)`,
              transition: 'all 0.3s ease',
            }}
            draggable={false}
          />

          {/* 💬 فقرة الكلام (Speech Bubble) */}
          <AnimatePresence>
            {message && !keyboardOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 10, x: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 10 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="absolute whitespace-nowrap"
                style={{
                  bottom: '100%',
                  right: '50%',
                  transform: 'translateX(50%)',
                  marginBottom: 12,
                }}
              >
                <div
                  className="px-4 py-2.5 rounded-2xl shadow-2xl border-2 backdrop-blur-md"
                  style={{
                    background:
                      mood === 'celebrate' || mood === 'happy'
                        ? 'linear-gradient(135deg, rgba(34,197,94,0.95), rgba(220,38,38,0.95))'
                        : 'linear-gradient(135deg, rgba(220,38,38,0.95), rgba(153,27,27,0.95))',
                    borderColor: 'rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="text-base font-black text-white text-center leading-tight">
                    {message.es}
                  </div>
                  <div className="text-xs font-bold text-white/90 text-center mt-0.5">
                    {message.ar}
                  </div>
                </div>
                {/* السهم الصغير في الفقاعة */}
                <div
                  className="w-0 h-0 mx-auto"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${
                      mood === 'celebrate' || mood === 'happy'
                        ? 'rgba(34,197,94,0.95)'
                        : 'rgba(220,38,38,0.95)'
                    }`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
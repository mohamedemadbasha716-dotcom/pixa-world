'use client';
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
  return (
    <div className="fixed pointer-events-none" style={{ zIndex: 50, bottom: 20, right: 20 }}>
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
      >
        <div className="relative">
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
            src="/characters/karl-3d.png"
            alt="كارل النسر"
            style={{
              width: 'clamp(85px, 9vw, 130px)',
              height: 'clamp(85px, 9vw, 130px)',
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
              transition: 'filter 0.4s ease',
            }}
            draggable={false}
          />

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
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
                        ? 'linear-gradient(135deg, rgba(88,204,2,0.95), rgba(76,201,240,0.95))'
                        : 'linear-gradient(135deg, rgba(255,107,107,0.95), rgba(247,37,133,0.95))',
                    borderColor: 'rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="text-base font-black text-white text-center leading-tight">
                    {message.de}
                  </div>
                  <div className="text-xs font-bold text-white/90 text-center mt-0.5">
                    {message.ar}
                  </div>
                </div>
                <div
                  className="w-0 h-0 mx-auto"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${
                      mood === 'celebrate' || mood === 'happy'
                        ? 'rgba(88,204,2,0.95)'
                        : 'rgba(255,107,107,0.95)'
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
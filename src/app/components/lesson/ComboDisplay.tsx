'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface ComboDisplayProps {
  combo: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function ComboDisplay({ combo, position = 'top-right' }: ComboDisplayProps) {
  if (combo < 3) return null;

  const isOnFire = combo >= 5;
  const isLegendary = combo >= 7;

  // 📍 تحديد المكان حسب الـ position
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '6rem', right: '1rem' },
    'top-left': { top: '6rem', left: '1rem' },
    'bottom-right': { bottom: '6rem', right: '1rem' },
    'bottom-left': { bottom: '6rem', left: '1rem' },
  };

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="fixed z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 backdrop-blur-md shadow-2xl"
        style={{
          ...positionStyles[position],
          background: isLegendary
            ? 'linear-gradient(135deg, rgba(255,107,107,0.25), rgba(255,165,0,0.15))'
            : isOnFire
            ? 'rgba(255,107,107,0.18)'
            : 'rgba(255,165,0,0.15)',
          borderColor: isLegendary
            ? 'rgba(255,107,107,0.6)'
            : isOnFire
            ? 'rgba(255,107,107,0.5)'
            : 'rgba(255,165,0,0.4)',
          boxShadow: isLegendary
            ? '0 0 30px rgba(255,107,107,0.5), 0 0 60px rgba(255,165,0,0.3)'
            : isOnFire
            ? '0 0 20px rgba(255,107,107,0.4)'
            : '0 0 15px rgba(255,165,0,0.3)',
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <Flame
            size={isLegendary ? 22 : 18}
            fill={isLegendary ? '#FF4444' : isOnFire ? '#FF6B6B' : '#FF9500'}
            color={isLegendary ? '#FF4444' : isOnFire ? '#FF6B6B' : '#FF9500'}
          />
        </motion.div>

        <span
          className="font-black text-lg"
          style={{
            color: isLegendary ? '#FF4444' : isOnFire ? '#FF6B6B' : '#FF9500',
            textShadow: isLegendary
              ? '0 0 10px rgba(255,68,68,0.8)'
              : isOnFire
              ? '0 0 8px rgba(255,107,107,0.6)'
              : '0 0 6px rgba(255,149,0,0.5)',
          }}
        >
          x{combo}
        </span>

        {isLegendary && (
          <motion.span
            animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl"
          >
            🔥
          </motion.span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
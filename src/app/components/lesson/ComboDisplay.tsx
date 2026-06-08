'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface SoundButtonProps {
  onClick: () => void;
  color: string;
  label: string;
}

export default function SoundButton({ onClick, color, label }: SoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    setIsPlaying(true);
    onClick();
    setTimeout(() => setIsPlaying(false), 1500);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
      className="relative flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-base border-2 transition-all overflow-hidden"
      style={{
        color: 'white',
        borderColor: color,
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        boxShadow: `0 4px 20px ${color}44, inset 0 1px 0 ${color}66`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {isPlaying && (
        <>
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
              style={{ borderColor: color }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 1, delay, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      <motion.div
        animate={isPlaying ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.4, repeat: 3 }}
      >
        <Volume2 size={20} />
      </motion.div>

      {isPlaying && (
        <div className="flex items-center gap-0.5">
          {[0, 0.1, 0.2, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full"
              style={{ background: 'white' }}
              animate={{ height: [4, 16, 4] }}
              transition={{ duration: 0.5, repeat: Infinity, delay }}
            />
          ))}
        </div>
      )}

      {label}
    </motion.button>
  );
}
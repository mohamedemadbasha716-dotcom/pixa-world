'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, RotateCcw, Star, Sparkles, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════
// البيانات
// ═══════════════════════════════════════
const NUMBERS = [
  { num: 1,  de: 'eins',   ar: 'واحد',   emoji: '⛪', objAr: 'كاتدرائية',  color: '#A78BFA', gradient: ['#A78BFA', '#7C3AED'] },
  { num: 2,  de: 'zwei',   ar: 'اثنان',  emoji: '🚗', objAr: 'سيارة',      color: '#F87171', gradient: ['#F87171', '#DC2626'] },
  { num: 3,  de: 'drei',   ar: 'ثلاثة',  emoji: '🐦', objAr: 'حمامة',      color: '#60A5FA', gradient: ['#60A5FA', '#2563EB'] },
  { num: 4,  de: 'vier',   ar: 'أربعة',  emoji: '💡', objAr: 'عمود إضاءة', color: '#FBBF24', gradient: ['#FBBF24', '#D97706'] },
  { num: 5,  de: 'fünf',   ar: 'خمسة',   emoji: '🎈', objAr: 'بالونة',     color: '#F472B6', gradient: ['#F472B6', '#DB2777'] },
  { num: 6,  de: 'sechs',  ar: 'ستة',    emoji: '🪑', objAr: 'كرسي',       color: '#34D399', gradient: ['#34D399', '#059669'] },
  { num: 7,  de: 'sieben', ar: 'سبعة',   emoji: '⭐', objAr: 'نجمة',       color: '#FFD700', gradient: ['#FFD700', '#F59E0B'] },
  { num: 8,  de: 'acht',   ar: 'ثمانية', emoji: '🍾', objAr: 'زجاجة',      color: '#2DD4BF', gradient: ['#2DD4BF', '#0D9488'] },
  { num: 9,  de: 'neun',   ar: 'تسعة',   emoji: '🌸', objAr: 'زهرة',       color: '#FB7185', gradient: ['#FB7185', '#E11D48'] },
  { num: 10, de: 'zehn',   ar: 'عشرة',   emoji: '🐤', objAr: 'طائر',       color: '#93C5FD', gradient: ['#93C5FD', '#3B82F6'] },
];

const GROUPS = [
  { numbers: NUMBERS.slice(0, 5),  title: 'المجموعة الأولى' },
  { numbers: NUMBERS.slice(5, 10), title: 'المجموعة الثانية' },
];

const ALL_SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

function getRequiredSpecialChars(word: string): string[] {
  const found = new Set<string>();
  for (const char of word) {
    if (ALL_SPECIAL_CHARS.includes(char)) {
      found.add(char.toLowerCase());
      const upper = char.toUpperCase();
      if (upper !== char.toLowerCase()) found.add(upper);
    }
  }
  return Array.from(found);
}

type Phase = 'listen' | 'write' | 'test';
type FlyingStar = { id: number; x: number; y: number };
type KarlMood = 'idle' | 'happy' | 'sad' | 'celebrate';

// ═══════════════════════════════════════
// أصوات
// ═══════════════════════════════════════
function speak(text: string, rate = 0.65) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE'; u.rate = rate; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

function playCoinSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [0, 0.1, 0.2].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880 + i * 220, ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(1760 + i * 220, ctx.currentTime + t + 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.2);
    });
  } catch {}
}

function playErrorSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

function playComboSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
      osc.start(ctx.currentTime + i * 0.08); osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch {}
}

// ═══════════════════════════════════════
// خلفية احترافية للأرقام (Cathedral theme)
// ═══════════════════════════════════════
function PremiumCathedralBackground({ activeColor }: { activeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 2 + Math.random() * 8,
      duration: 12 + Math.random() * 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a0f3a 0%, #0a0820 50%, #050310 100%)',
      }} />

      {/* Aurora effect */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}44, transparent 70%)`,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 20% 80%, ${activeColor}33, transparent 60%)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Floating sparkle particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${activeColor}aa, transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}66`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Stars */}
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            width: 1.5 + Math.random() * 1.5,
            height: 1.5 + Math.random() * 1.5,
            background: 'white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 5,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(${activeColor} 1px, transparent 1px), linear-gradient(90deg, ${activeColor} 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════
// Confetti System
// ═══════════════════════════════════════
function ConfettiBurst({ trigger, x, y, colors }: { trigger: number; x: number; y: number; colors: string[] }) {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number; color: string; size: number; rotation: number }>>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      angle: (Math.PI * 2 * i) / 30 + Math.random() * 0.3,
      distance: 80 + Math.random() * 120,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 720,
    }));
    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="fixed pointer-events-none" style={{ left: x, top: y, zIndex: 9998 }}>
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              scale: 0,
              opacity: 0,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.4, 1] }}
            className="absolute"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              boxShadow: `0 0 ${p.size}px ${p.color}99`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// كارل النسر — Premium
// ═══════════════════════════════════════
const ENCOURAGEMENTS = [
  { de: 'Super!', ar: 'ممتاز!' }, { de: 'Toll!', ar: 'رائع!' },
  { de: 'Wunderbar!', ar: 'مدهش!' }, { de: 'Klasse!', ar: 'تحفة!' },
  { de: 'Bravo!', ar: 'برافو!' }, { de: 'Sehr gut!', ar: 'ممتاز جداً!' },
  { de: 'Genial!', ar: 'عبقري!' }, { de: 'Fantastisch!', ar: 'خيالي!' },
];

const SAD_MESSAGES = [
  { de: 'Versuch nochmal!', ar: 'جرب تاني!' },
  { de: 'Du schaffst das!', ar: 'تقدر تعملها!' },
  { de: 'Keine Sorge!', ar: 'متقلقش!' },
];

function KarlEagle({ mood, message }: { mood: KarlMood; message: { de: string; ar: string } | null }) {
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
        transition={{ duration: mood === 'celebrate' ? 0.5 : mood === 'happy' ? 0.8 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: mood === 'celebrate' ? 'radial-gradient(circle, #FFD70066, transparent 70%)'
                : mood === 'happy' ? 'radial-gradient(circle, #58CC0266, transparent 70%)'
                : mood === 'sad' ? 'radial-gradient(circle, #FF6B6B44, transparent 70%)'
                : 'radial-gradient(circle, #A78BFA44, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(1.5)',
            }}
            animate={{ scale: [1.4, 1.7, 1.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <img
            src="/characters/karl-3d.png"
            alt="كارل"
            style={{
              width: 'clamp(85px, 9vw, 130px)',
              height: 'clamp(85px, 9vw, 130px)',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter: mood === 'celebrate'
                ? 'drop-shadow(0 8px 20px rgba(255,215,0,0.8))'
                : mood === 'happy'
                ? 'drop-shadow(0 6px 16px rgba(88,204,2,0.7))'
                : mood === 'sad'
                ? 'drop-shadow(0 4px 12px rgba(255,107,107,0.5)) saturate(0.6)'
                : 'drop-shadow(0 6px 14px rgba(167,139,250,0.5))',
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
                style={{ bottom: '100%', right: '50%', transform: 'translateX(50%)', marginBottom: 12 }}
              >
                <div className="px-4 py-2.5 rounded-2xl shadow-2xl border-2 backdrop-blur-md"
                  style={{
                    background: mood === 'celebrate' || mood === 'happy'
                      ? 'linear-gradient(135deg, rgba(88,204,2,0.95), rgba(76,201,240,0.95))'
                      : 'linear-gradient(135deg, rgba(255,107,107,0.95), rgba(247,37,133,0.95))',
                    borderColor: 'rgba(255,255,255,0.4)',
                  }}>
                  <div className="text-base font-black text-white text-center leading-tight">{message.de}</div>
                  <div className="text-xs font-bold text-white/90 text-center mt-0.5">{message.ar}</div>
                </div>
                <div className="w-0 h-0 mx-auto" style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid ${mood === 'celebrate' || mood === 'happy' ? 'rgba(88,204,2,0.95)' : 'rgba(255,107,107,0.95)'}`,
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════
// Combo Display
// ═══════════════════════════════════════
function ComboDisplay({ combo }: { combo: number }) {
  if (combo < 2) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        initial={{ scale: 0, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="fixed top-32 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md border-2 shadow-2xl"
          style={{
            background: combo >= 5 ? 'linear-gradient(135deg, rgba(255,107,107,0.95), rgba(255,165,0,0.95))'
              : 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,165,0,0.95))',
            borderColor: 'rgba(255,255,255,0.4)',
            boxShadow: '0 8px 32px rgba(255,165,0,0.5)',
          }}
        >
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
            <Flame size={20} className="text-white" fill="white" />
          </motion.div>
          <span className="font-black text-white text-base">
            {combo >= 5 ? `🔥 On Fire! x${combo}` : `Combo x${combo}!`}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════
// Sound Wave Button
// ═══════════════════════════════════════
function SoundButton({ onClick, color, label }: { onClick: () => void; color: string; label: string }) {
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

      <motion.div animate={isPlaying ? { rotate: [0, -10, 10, 0] } : {}} transition={{ duration: 0.4, repeat: 3 }}>
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

// ═══════════════════════════════════════
// Hero Number Display
// ═══════════════════════════════════════
function HeroNumberDisplay({ numData }: { numData: typeof NUMBERS[0] }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      {/* Orbital rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${numData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-3 h-3 rounded-full" style={{
          background: numData.color,
          top: -6, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 15px ${numData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${numData.color}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: numData.gradient[1],
          bottom: -4, right: '30%',
          boxShadow: `0 0 10px ${numData.gradient[1]}`,
        }} />
      </motion.div>

      {/* Glow background */}
      <motion.div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${numData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main number container */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] flex flex-col items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${numData.gradient[0]}22, ${numData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${numData.color}44`,
          boxShadow: `
            0 20px 60px ${numData.color}33,
            inset 0 1px 0 ${numData.color}55,
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <span
          className="font-black relative z-10 tabular-nums"
          style={{
            fontSize: '10rem',
            background: `linear-gradient(180deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 4px 20px ${numData.color}88)`,
            textShadow: `0 0 60px ${numData.color}`,
            lineHeight: 1,
          }}
        >
          {numData.num}
        </span>

        <div className="relative z-10 text-center -mt-2">
          <div className="font-black text-2xl" style={{ color: numData.color, textShadow: `0 0 20px ${numData.color}` }}>
            {numData.de}
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full opacity-60" style={{
          background: `radial-gradient(ellipse, ${numData.color}88, transparent)`,
          filter: 'blur(2px)',
        }} />
      </motion.div>

      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          <Sparkles size={12} style={{ color: numData.color }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Premium EmojiCount
// ═══════════════════════════════════════
function EmojiCount({ emoji, count, color }: { emoji: string; count: number; color: string }) {
  const rows: number[] = count <= 5 ? [count] : [5, count - 5];
  return (
    <div className="flex flex-col items-center gap-2.5">
      {rows.map((n, ri) => (
        <div key={ri} className="flex flex-wrap justify-center gap-2.5">
          {Array.from({ length: n }).map((_, i) => (
            <motion.span key={i}
              initial={{ scale: 0, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 + ri * 0.2, type: 'spring', stiffness: 400 }}
              className="text-4xl select-none"
              style={{ filter: `drop-shadow(0 4px 12px ${color}99)` }}>
              {emoji}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Special Chars Keyboard
// ═══════════════════════════════════════
function SpecialCharsKeyboard({ chars, onChar, color }: { chars: string[]; onChar: (c: string) => void; color: string }) {
  if (chars.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-center flex-wrap">
      {chars.map(c => (
        <motion.button
          key={c}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08, y: -2 }}
          onMouseDown={e => { e.preventDefault(); onChar(c); }}
          className="w-12 h-12 rounded-2xl font-black text-2xl border-2 transition-all select-none"
          style={{
            borderColor: color,
            background: `linear-gradient(135deg, ${color}33, ${color}11)`,
            color: 'white',
            boxShadow: `0 4px 16px ${color}55, inset 0 1px 0 ${color}66`,
            textShadow: `0 0 12px ${color}aa`,
            backdropFilter: 'blur(10px)',
          }}
        >
          {c}
        </motion.button>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Match Game (محسّن)
// ═══════════════════════════════════════
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MatchGame({
  group, groupTitle, onComplete, onStar, onKarlReact, onCombo,
}: {
  group: typeof NUMBERS;
  groupTitle: string;
  onComplete: () => void;
  onStar: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [deOrder, setDeOrder] = useState<typeof NUMBERS>(() => shuffle(group));
  const [dragging, setDragging] = useState<number | null>(null);
  const [overTarget, setOverTarget] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<{ num: number; de: number } | null>(null);
  const [successPair, setSuccessPair] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const touchDragging = useRef<number | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setDeOrder(shuffle(group));
    setMatched(new Set());
    setErrors(0);
  }, [group]);

  useEffect(() => {
    if (matched.size === group.length) {
      onKarlReact('celebrate');
      setTimeout(onComplete, 800);
    }
  }, [matched]);

  const doMatch = (fromNum: number, toNum: number, cx: number, cy: number) => {
    if (fromNum === toNum) {
      const n = group.find(x => x.num === fromNum)!;
      speak(n.de);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      onStar(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      setSuccessPair(fromNum);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, fromNum]));
    } else {
      playErrorSound();
      onKarlReact('sad');
      setErrors(e => e + 1);
      setWrongPair({ num: fromNum, de: toNum });
      setTimeout(() => setWrongPair(null), 500);
    }
  };

  const handleDragStart = (num: number) => setDragging(num);
  const handleDragEnd = () => { setDragging(null); setOverTarget(null); };
  const handleDragOver = (e: React.DragEvent, num: number) => {
    e.preventDefault(); setOverTarget(num);
  };
  const handleDrop = (e: React.DragEvent, toNum: number) => {
    e.preventDefault();
    setOverTarget(null);
    if (dragging !== null) doMatch(dragging, toNum, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, num: number) => {
    if (matched.has(num)) return;
    touchDragging.current = num;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `
      position:fixed;left:${rect.left}px;top:${rect.top}px;
      width:${rect.width}px;height:${rect.height}px;
      opacity:.88;pointer-events:none;z-index:9998;
      border-radius:20px;transition:none;
    `;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current) return;
    const x = e.touches[0].clientX - touchOffRef.current.x;
    const y = e.touches[0].clientY - touchOffRef.current.y;
    touchCloneRef.current.style.left = x + 'px';
    touchCloneRef.current.style.top = y + 'px';
    const ex = e.touches[0].clientX, ey = e.touches[0].clientY;
    let found: number | null = null;
    document.querySelectorAll('[data-de-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        found = parseInt((el as HTMLElement).dataset.deTarget!);
      }
    });
    setOverTarget(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    let dropped: number | null = null;
    document.querySelectorAll('[data-de-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        dropped = parseInt((el as HTMLElement).dataset.deTarget!);
      }
    });
    if (dropped !== null && touchDragging.current !== null) {
      doMatch(touchDragging.current, dropped, ex, ey);
    }
    setOverTarget(null);
    touchDragging.current = null;
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#A78BFA', '#F472B6', '#FFFFFF']} />
      <motion.div
        key="match-game"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full flex flex-col items-center gap-5 max-w-2xl mx-auto"
      >
        {/* header */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse bg-purple-400" />
            <span className="text-white/40 text-xs tracking-widest uppercase font-bold">
              {groupTitle} — طابق الأرقام
            </span>
          </div>
          <p className="text-white/30 text-sm">اسحب كل رقم وضعه على ترجمته بالألمانية</p>
        </div>

        {/* progress dots */}
        <div className="flex gap-2.5">
          {group.map(n => (
            <motion.div
              key={n.num}
              animate={matched.has(n.num) ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: matched.has(n.num) ? `linear-gradient(135deg, ${n.gradient[0]}, ${n.gradient[1]})` : 'rgba(255,255,255,0.15)',
                boxShadow: matched.has(n.num) ? `0 0 12px ${n.color}99` : 'none',
              }}
            />
          ))}
        </div>

        {/* errors */}
        {errors > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
          >
            {Array.from({ length: Math.min(errors, 5) }).map((_, i) => (
              <span key={i} style={{ fontSize: 10 }}>❌</span>
            ))}
            <span className="mr-1">{errors} خطأ</span>
          </motion.div>
        )}

        {/* GAME BOARD */}
        <div className="w-full max-w-xl" dir="rtl">
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 32px 1fr' }}>
            <div className="text-center text-xs text-white/30 tracking-widest uppercase pb-2 font-bold">الأرقام</div>
            <div />
            <div className="text-center text-xs text-white/30 tracking-widest uppercase pb-2 font-bold">بالألمانية</div>

            {group.map((n, i) => {
              const deItem = deOrder[i];
              const numMatched = matched.has(n.num);
              const deMatched = matched.has(deItem.num);
              const isWrongNum = wrongPair?.num === n.num;
              const isWrongDe = wrongPair?.de === deItem.num;
              const isSuccessNum = successPair === n.num;
              const isSuccessDe = successPair === deItem.num;
              const isOver = overTarget === deItem.num && !deMatched;

              return (
                <div key={`row-${i}`} className="contents">
                  {/* Number card */}
                  <motion.div
                    draggable={!numMatched}
                    onDragStart={() => handleDragStart(n.num)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={e => onTouchStart(e, n.num)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={() => speak(n.de)}
                    animate={
                      isWrongNum ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : isSuccessNum ? { scale: [1, 1.1, 1] }
                      : {}
                    }
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center justify-center gap-2 rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                    style={{
                      cursor: numMatched ? 'default' : 'grab',
                      background: numMatched
                        ? `linear-gradient(135deg, ${n.gradient[0]}33, ${n.gradient[1]}15)`
                        : dragging === n.num
                        ? `linear-gradient(135deg, ${n.gradient[0]}44, ${n.gradient[1]}22)`
                        : `linear-gradient(135deg, ${n.color}11, rgba(255,255,255,0.03))`,
                      border: `2px solid ${
                        numMatched ? n.color + '88'
                        : isWrongNum ? '#ef4444'
                        : isSuccessNum ? '#22c55e'
                        : n.color + '44'
                      }`,
                      boxShadow: numMatched
                        ? `0 0 25px ${n.color}44, inset 0 1px 0 ${n.color}66`
                        : dragging === n.num
                        ? `0 10px 40px ${n.color}55, inset 0 1px 0 ${n.color}88`
                        : `inset 0 1px 0 ${n.color}22`,
                      opacity: dragging !== null && dragging !== n.num && !numMatched ? 0.4 : 1,
                      transition: 'opacity .2s, background .2s, border-color .2s, box-shadow .2s',
                    }}
                  >
                    <span className="text-xl select-none">{n.emoji}</span>
                    <span
                      className="text-2xl font-black tabular-nums"
                      style={{
                        color: 'white',
                        textShadow: `0 0 20px ${n.color}aa`,
                      }}
                    >
                      {n.num}
                    </span>

                    {numMatched && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold"
                        style={{ color: n.color }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>

                  {/* divider */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                      animate={(numMatched && deMatched) ? { scale: [1, 1.5, 1] } : {}}
                    />
                  </div>

                  {/* German card */}
                  <motion.div
                    data-de-target={deItem.num}
                    onDragOver={e => !deMatched && handleDragOver(e, deItem.num)}
                    onDragLeave={() => setOverTarget(null)}
                    onDrop={e => !deMatched && handleDrop(e, deItem.num)}
                    onClick={() => speak(deItem.de)}
                    animate={
                      isWrongDe ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : isSuccessDe ? { scale: [1, 1.1, 1] }
                      : {}
                    }
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center justify-center gap-2 rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                    style={{
                      cursor: deMatched ? 'default' : 'pointer',
                      background: deMatched
                        ? `linear-gradient(135deg, ${deItem.gradient[0]}33, ${deItem.gradient[1]}15)`
                        : isOver
                        ? `linear-gradient(135deg, ${deItem.gradient[0]}44, ${deItem.gradient[1]}22)`
                        : 'rgba(255,255,255,0.04)',
                      border: `2px ${deMatched ? 'solid' : 'dashed'} ${
                        deMatched ? deItem.color + '88'
                        : isOver ? deItem.color
                        : isWrongDe ? '#ef4444'
                        : 'rgba(255,255,255,0.18)'
                      }`,
                      boxShadow: isOver
                        ? `0 0 30px ${deItem.color}66, inset 0 0 25px ${deItem.color}22`
                        : deMatched
                        ? `0 0 25px ${deItem.color}44, inset 0 1px 0 ${deItem.color}66`
                        : 'none',
                      transition: 'all .2s',
                    }}
                  >
                    {deMatched && (
                      <span
                        className="text-xl font-black tabular-nums"
                        style={{ color: 'white', textShadow: `0 0 15px ${deItem.color}` }}
                      >
                        {deItem.num}
                      </span>
                    )}
                    <div className="flex flex-col items-center leading-tight">
                      <span
                        className="font-black tracking-wide"
                        style={{
                          fontSize: 18,
                          direction: 'ltr',
                          color: deMatched ? 'white' : 'rgba(255,255,255,0.9)',
                          textShadow: deMatched ? `0 0 15px ${deItem.color}cc` : 'none',
                        }}
                      >
                        {deItem.de}
                      </span>
                      <span className="text-xs text-white/40">{deItem.ar}</span>
                    </div>
                    {deMatched && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold"
                        style={{ color: deItem.color }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-white/25 text-xs text-center">💡 اضغط على أي بطاقة لتسمع النطق</p>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// PHASE 1 — استمع واكتب الرقم
// ═══════════════════════════════════════
function ListenPhase({ numData, groupTitle, onDone, onKarlReact, onCombo }: {
  numData: typeof NUMBERS[0];
  groupTitle: string;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput('');
    setStatus('idle');
    const t = setTimeout(() => { speak(numData.de, 0.6); inputRef.current?.focus(); }, 500);
    return () => clearTimeout(t);
  }, [numData.num]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim() === String(numData.num)) {
      setStatus('correct');
      speak(numData.de, 0.6);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1000);
    } else {
      setStatus('wrong');
      playErrorSound();
      onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={numData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`listen-${numData.num}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left: Hero Number */}
          <div className="lg:col-span-3 flex flex-col items-center gap-4">
            <HeroNumberDisplay numData={numData} />
            <SoundButton onClick={() => speak(numData.de, 0.6)} color={numData.color} label="استمع للرقم" />
          </div>

          {/* Right: Input */}
          <div className="lg:col-span-2 space-y-5">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${numData.color}aa` }}>
                Zahl · {groupTitle}
              </div>
              <div className="text-2xl font-black text-white">اكتب الرقم</div>
              <div className="text-sm font-bold text-white/40 mt-1">بالأرقام (1, 2, 3...)</div>
            </div>

            <div className="relative">
              <span
                className="absolute inset-0 flex items-center justify-center font-black pointer-events-none select-none tabular-nums"
                style={{ fontSize: '4rem', color: `${numData.color}15` }}
              >
                {numData.num}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value.replace(/\D/g, '')); setStatus('idle'); }}
                onKeyDown={e => e.key === 'Enter' && input && handleCheck()}
                maxLength={2}
                inputMode="numeric"
                autoFocus
                className="w-full text-center font-black py-6 rounded-2xl border-2 outline-none transition-all text-white tabular-nums"
                style={{
                  fontSize: '4rem',
                  direction: 'ltr',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  borderColor: status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : `${numData.color}55`,
                  boxShadow: status === 'correct' ? '0 0 30px #22c55e66'
                    : status === 'wrong' ? '0 0 30px #ef444466'
                    : `inset 0 1px 0 ${numData.color}33, 0 8px 30px ${numData.color}22`,
                }}
              />
            </div>

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                  style={{
                    background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    color: status === 'correct' ? '#22c55e' : '#ef4444',
                    border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
                  }}>
                  {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
              style={{
                background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                boxShadow: `0 8px 30px ${numData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${numData.color}77`,
              }}
            >
              تحقق ✓
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// PHASE 2 — اكتب بالألمانية
// ═══════════════════════════════════════
function WritePhase({ numData, groupTitle, onDone, onKarlReact, onCombo }: {
  numData: typeof NUMBERS[0];
  groupTitle: string;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(numData.de);

  useEffect(() => {
    setInput('');
    setStatus('idle');
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [numData.num]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim().toLowerCase() === numData.de.toLowerCase()) {
      setStatus('correct');
      speak(numData.de, 0.6);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1000);
    } else {
      setStatus('wrong');
      playErrorSound();
      onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleSpecialChar = (c: string) => {
    setInput(prev => prev + c);
    setStatus('idle');
    inputRef.current?.focus();
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={numData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`write-${numData.num}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Left: Visual */}
          <div className="lg:col-span-3 flex flex-col items-center gap-5">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[3rem] blur-3xl" style={{
                background: `radial-gradient(circle, ${numData.color}66, transparent)`,
                transform: 'scale(1.3)',
              }} />

              <div className="relative rounded-[3rem] flex flex-col items-center justify-center gap-3 p-8"
                style={{
                  background: `linear-gradient(145deg, ${numData.gradient[0]}22, ${numData.gradient[1]}11)`,
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${numData.color}55`,
                  boxShadow: `0 20px 60px ${numData.color}44, inset 0 1px 0 ${numData.color}66`,
                  minWidth: 280,
                }}>
                <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[3rem]" style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)',
                }} />

                <div className="text-center relative z-10">
                  <span className="text-white/60 text-sm font-bold">عدد </span>
                  <span className="font-black text-3xl tabular-nums" style={{ color: numData.color, textShadow: `0 0 20px ${numData.color}` }}>
                    {numData.num}
                  </span>
                  <span className="text-white font-bold text-lg mr-2">{numData.objAr}</span>
                </div>

                <div className="relative z-10">
                  <EmojiCount emoji={numData.emoji} count={numData.num} color={numData.color} />
                </div>
              </div>

              {/* Number badge */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-2xl tabular-nums"
                style={{
                  background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                  boxShadow: `0 8px 24px ${numData.color}88`,
                }}
              >
                {numData.num}
              </motion.div>
            </motion.div>

            <SoundButton onClick={() => speak(numData.de, 0.6)} color={numData.color} label="استمع للكلمة" />
          </div>

          {/* Right: Input */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${numData.color}aa` }}>
                Wort · بالألمانية
              </div>
              <div className="text-2xl font-black text-white">اكتب الكلمة</div>
              <div className="text-sm font-bold text-white/40 mt-1">{numData.ar}</div>
            </div>

            <div className="relative">
              <span
                className="absolute inset-0 flex items-center justify-center font-black tracking-wider pointer-events-none select-none"
                style={{ fontSize: '1.8rem', color: `${numData.color}15`, fontFamily: 'monospace' }}
              >
                {numData.de}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setStatus('idle'); }}
                onKeyDown={e => e.key === 'Enter' && input && handleCheck()}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full text-center font-black py-5 rounded-2xl border-2 outline-none transition-all text-white"
                style={{
                  fontSize: '1.8rem',
                  direction: 'ltr',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  borderColor: status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : `${numData.color}55`,
                  boxShadow: status === 'correct' ? '0 0 30px #22c55e66'
                    : status === 'wrong' ? '0 0 30px #ef444466'
                    : `inset 0 1px 0 ${numData.color}33, 0 8px 30px ${numData.color}22`,
                }}
              />
            </div>

            {requiredChars.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">
                  💡 الحروف الخاصة
                </p>
                <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={numData.color} />
              </div>
            )}

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                  style={{
                    background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    color: status === 'correct' ? '#22c55e' : '#ef4444',
                    border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
                  }}>
                  {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
              style={{
                background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                boxShadow: `0 8px 30px ${numData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${numData.color}77`,
              }}
            >
              تحقق ✓
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanNumberLesson() {
  const router = useRouter();
  const [groupIdx, setGroupIdx] = useState(0);
  const [numIdx, setNumIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [totalStars, setTotalStars] = useState(0);
  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [completedNums, setCompletedNums] = useState<Set<number>>(new Set());
  const [testSuccess, setTestSuccess] = useState(false);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const currentGroup = GROUPS[groupIdx];
  const currentNum = currentGroup.numbers[numIdx];

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    if (mood === 'happy' || mood === 'celebrate') {
      setKarlMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    } else if (mood === 'sad') {
      setKarlMessage(SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)]);
    }
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  const handleCombo = () => {
    setCombo(c => {
      const next = c + 1;
      if (next === 3 || next === 5 || next === 7) playComboSound();
      return next;
    });
  };

  const resetCombo = () => setCombo(0);

  const spawnStar = useCallback((clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setFlyingStars(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 1200);
    setTotalStars(p => p + 1);
  }, []);

  const handleListenDone = () => setPhase('write');
  const handleWriteDone = () => {
    setCompletedNums(prev => new Set([...prev, currentNum.num]));
    if (numIdx < currentGroup.numbers.length - 1) {
      setNumIdx(p => p + 1);
      setPhase('listen');
    } else {
      setPhase('test');
    }
  };
  const handleTestComplete = () => setTestSuccess(true);

  const nextGroup = () => {
    if (groupIdx < GROUPS.length - 1) {
      setGroupIdx(p => p + 1);
      setNumIdx(0);
      setPhase('listen');
      setTestSuccess(false);
      setCompletedNums(new Set());
    } else {
      router.push('/character-and-map');
    }
  };

  const progress = Math.round(
    ((groupIdx * 5 + (testSuccess ? currentGroup.numbers.length : numIdx)) / 10) * 100
  );

  const activeColor = currentNum?.color ?? '#A78BFA';
  const isTestPhase = phase === 'test';

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <PremiumCathedralBackground activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} />
      <ComboDisplay combo={combo} />

      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {flyingStars.map(star => (
            <motion.div key={star.id}
              initial={{ x: star.x - 20, y: star.y - 20, scale: 1.4, opacity: 1 }}
              animate={{ x: star.x - 20, y: star.y - 150, scale: 0.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.2, 0.8, 0.4, 1] }}
              style={{ position: 'absolute', top: 0, left: 0 }}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5"
                  fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Premium Header */}
      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(5,3,16,0.95) 70%, transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.push('/character-and-map')}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
                <span className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>⛪</span>
                  {currentGroup.title} — {phase === 'listen' ? 'استمع' : phase === 'write' ? 'اكتب' : 'اختبار'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #EC4899)`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)',
                  }} />
                </motion.div>
              </div>
            </div>
            <motion.div key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.35 }}
              className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl border border-yellow-400/30"
              style={{ background: 'rgba(255,215,0,0.1)', backdropFilter: 'blur(10px)' }}>
              <svg width="18" height="18" viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5"
                  fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
              <span className="font-black text-sm text-yellow-400">{totalStars}</span>
            </motion.div>
          </div>

          {/* Numbers mini-map */}
          {!isTestPhase && !testSuccess && (
            <div className="flex gap-1.5 justify-center">
              {currentGroup.numbers.map((n, i) => {
                const isDone = completedNums.has(n.num);
                const isCurrent = i === numIdx;
                return (
                  <motion.div key={n.num}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all backdrop-blur-md tabular-nums"
                    style={{
                      background: isDone ? `linear-gradient(135deg, ${n.gradient[0]}55, ${n.gradient[1]}33)`
                        : isCurrent ? `linear-gradient(135deg, ${n.gradient[0]}33, ${n.gradient[1]}11)`
                        : 'rgba(255,255,255,0.03)',
                      borderColor: isDone ? n.color : isCurrent ? `${n.color}88` : 'rgba(255,255,255,0.08)',
                      color: isDone ? 'white' : isCurrent ? 'white' : 'rgba(255,255,255,0.2)',
                      boxShadow: isCurrent && !isDone ? `0 0 20px ${n.color}66, inset 0 1px 0 ${n.color}44` : 'none',
                    }}>
                    {isDone ? '✓' : n.num}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-36 pb-32 px-6 min-h-screen flex flex-col justify-center relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {phase === 'listen' && (
            <ListenPhase
              key={`listen-${groupIdx}-${numIdx}`}
              numData={currentNum}
              groupTitle={currentGroup.title}
              onDone={handleListenDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
            />
          )}
          {phase === 'write' && (
            <WritePhase
              key={`write-${groupIdx}-${numIdx}`}
              numData={currentNum}
              groupTitle={currentGroup.title}
              onDone={handleWriteDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
            />
          )}
          {phase === 'test' && !testSuccess && (
            <MatchGame
              key={`match-${groupIdx}`}
              group={currentGroup.numbers}
              groupTitle={currentGroup.title}
              onComplete={handleTestComplete}
              onStar={spawnStar}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
            />
          )}
          {testSuccess && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center px-6 max-w-md mx-auto"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], y: [0, -10, 0] }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-9xl">🏆</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أحسنت! 🎉</h2>
                <p className="text-white/50 text-lg">أنهيت {currentGroup.title} بنجاح</p>
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 400 }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="#FFD700"
                      style={{ filter: 'drop-shadow(0 0 12px #FFD700)' }}>
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-md border border-yellow-400/30"
                style={{ background: 'rgba(255,215,0,0.1)' }}>
                <Star size={28} fill="#FFD700" color="#FFD700" />
                <span className="font-black text-3xl text-yellow-400">{totalStars}</span>
                <span className="font-bold text-white/40 text-base">نجمة!</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={nextGroup}
                className="font-black px-12 py-5 rounded-2xl text-lg text-white shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  boxShadow: '0 10px 40px rgba(124,58,237,0.5)',
                }}>
                {groupIdx < GROUPS.length - 1 ? 'المجموعة التالية ←' : '🗺️ رجوع للخريطة'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
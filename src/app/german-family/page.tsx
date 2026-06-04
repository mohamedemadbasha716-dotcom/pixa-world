'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Check, X, Trophy, RotateCcw, Sparkles, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════
// البيانات - 3 مجموعات
// ═══════════════════════════════════════
const GREETINGS = [
  { word: 'Hallo',           wordAr: 'مرحباً',             emoji: '👋', color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E53'] },
  { word: 'Guten Morgen',    wordAr: 'صباح الخير',         emoji: '🌅', color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'] },
  { word: 'Guten Tag',       wordAr: 'نهارك سعيد',         emoji: '☀️', color: '#45B7D1', gradient: ['#45B7D1', '#2980B9'] },
  { word: 'Gute Nacht',      wordAr: 'تصبح على خير',       emoji: '🌙', color: '#96CEB4', gradient: ['#96CEB4', '#5FB385'] },
  { word: 'Tschüss',         wordAr: 'مع السلامة',         emoji: '👋', color: '#FFEAA7', gradient: ['#FFEAA7', '#FDCB6E'] },
  { word: 'Auf Wiedersehen', wordAr: 'إلى اللقاء',         emoji: '🤝', color: '#DDA0DD', gradient: ['#DDA0DD', '#B97FBA'] },
];

const INTRODUCTIONS = [
  { word: 'Ich bin Ali',           wordAr: 'أنا اسمي علي',          emoji: '😊', color: '#F0A500', gradient: ['#F0A500', '#D17F00'] },
  { word: 'Wie heißt du',          wordAr: 'ما اسمك',               emoji: '❓', color: '#FF7675', gradient: ['#FF7675', '#E84545'] },
  { word: 'Woher kommst du',       wordAr: 'من أين أنت',            emoji: '🌍', color: '#A29BFE', gradient: ['#A29BFE', '#6C5CE7'] },
  { word: 'Ich komme aus Ägypten', wordAr: 'أنا من مصر',            emoji: '🇪🇬', color: '#FD79A8', gradient: ['#FD79A8', '#E84393'] },
  { word: 'Wie geht es dir',       wordAr: 'كيف حالك',              emoji: '💬', color: '#55EFC4', gradient: ['#55EFC4', '#00B894'] },
  { word: 'Mir geht es gut',       wordAr: 'أنا بخير',              emoji: '😄', color: '#FDCB6E', gradient: ['#FDCB6E', '#E17055'] },
];

const FAMILY = [
  { word: 'die Familie',     wordAr: 'العائلة',            emoji: '👨‍👩‍👧‍👦', color: '#74B9FF', gradient: ['#74B9FF', '#0984E3'] },
  { word: 'der Vater',       wordAr: 'الأب',               emoji: '👨', color: '#FF9FF3', gradient: ['#FF9FF3', '#F368E0'] },
  { word: 'die Mutter',      wordAr: 'الأم',               emoji: '👩', color: '#00CEC9', gradient: ['#00CEC9', '#00B0AF'] },
  { word: 'der Bruder',      wordAr: 'الأخ',               emoji: '👦', color: '#6C5CE7', gradient: ['#6C5CE7', '#4834D4'] },
  { word: 'die Schwester',   wordAr: 'الأخت',              emoji: '👧', color: '#E17055', gradient: ['#E17055', '#D63031'] },
  { word: 'das Baby',        wordAr: 'الطفل الصغير',       emoji: '👶', color: '#0984E3', gradient: ['#0984E3', '#0652DD'] },
  { word: 'die Großmutter',  wordAr: 'الجدة',              emoji: '👵', color: '#A29BFE', gradient: ['#A29BFE', '#5F27CD'] },
  { word: 'der Großvater',   wordAr: 'الجد',               emoji: '👴', color: '#55EFC4', gradient: ['#55EFC4', '#10AC84'] },
];

const GROUPS = [
  { items: GREETINGS,     title: 'التحيات',     groupId: 0, icon: '👋' },
  { items: INTRODUCTIONS, title: 'عرّف بنفسك',  groupId: 1, icon: '😊' },
  { items: FAMILY,        title: 'العائلة',     groupId: 2, icon: '👨‍👩‍👧' },
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

function compareWords(input: string, target: string): boolean {
  return input.trim().toLowerCase() === target.toLowerCase();
}

// ═══════════════════════════════════════
// أصوات
// ═══════════════════════════════════════
function speakWord(word: string) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'de-DE'; u.rate = 0.7; u.pitch = 1.1;
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

function playBuzzSound() {
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
// خلفية بوابة براندنبورغ الليلية ✅ (مع حل Hydration)
// ═══════════════════════════════════════
function BrandenburgBackground({ activeColor }: { activeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number; xOffset: number }>>([]);
  const [stars, setStars] = useState<Array<{ left: number; top: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 2 + Math.random() * 8,
      duration: 10 + Math.random() * 10,
      xOffset: Math.random() * 50 - 25,
    }));
    setParticles(p);

    const s = Array.from({ length: 40 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 50,
      size: 1.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
    setStars(s);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 20%, #1a0a3e 0%, #0d0620 50%, #050210 100%)',
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)`,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 opacity-30"
        style={{
          background: `linear-gradient(to top, ${activeColor}22, transparent)`,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

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
            x: [0, p.xOffset, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: 'white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(${activeColor} 1px, transparent 1px), linear-gradient(90deg, ${activeColor} 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════
// Confetti
// ═══════════════════════════════════════
function ConfettiBurst({ trigger, x, y, colors }: { trigger: number; x: number; y: number; colors: string[] }) {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number; color: string; size: number; rotation: number; isCircle: boolean }>>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      angle: (Math.PI * 2 * i) / 30 + Math.random() * 0.3,
      distance: 80 + Math.random() * 120,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 720,
      isCircle: Math.random() > 0.5,
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
              borderRadius: p.isCircle ? '50%' : '2px',
              boxShadow: `0 0 ${p.size}px ${p.color}99`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// كارل النسر
// ═══════════════════════════════════════
type KarlMood = 'idle' | 'happy' | 'sad' | 'celebrate';

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
                : 'radial-gradient(circle, #4CC9F044, transparent 70%)',
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
                : 'drop-shadow(0 6px 14px rgba(76,201,240,0.5))',
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
// Hero Word Display ✅ (مع حل Hydration)
// ═══════════════════════════════════════
function HeroWordDisplay({ itemData }: { itemData: typeof GREETINGS[0] }) {
  const [sparkles, setSparkles] = useState<Array<{ top: number; left: number; delay: number }>>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 6 }, (_, i) => ({
        top: 20 + Math.random() * 60,
        left: 10 + Math.random() * 80,
        delay: i * 0.4,
      }))
    );
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${itemData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-3 h-3 rounded-full" style={{
          background: itemData.color,
          top: -6, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 15px ${itemData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${itemData.color}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: itemData.gradient[1],
          bottom: -4, right: '30%',
          boxShadow: `0 0 10px ${itemData.gradient[1]}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${itemData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] flex items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${itemData.gradient[0]}22, ${itemData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${itemData.color}44`,
          boxShadow: `0 20px 60px ${itemData.color}33, inset 0 1px 0 ${itemData.color}55, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <span style={{ fontSize: '7rem', filter: `drop-shadow(0 6px 20px ${itemData.color}aa)` }}>
          {itemData.emoji}
        </span>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full opacity-60" style={{
          background: `radial-gradient(ellipse, ${itemData.color}88, transparent)`,
          filter: 'blur(2px)',
        }} />
      </motion.div>

      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: s.delay,
          }}
        >
          <Sparkles size={12} style={{ color: itemData.color }} />
        </motion.div>
      ))}
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
// Sound Button
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
}// ═══════════════════════════════════════
// PHASE 1 — تعلم الكلمة
// ═══════════════════════════════════════
function LearnWordPhase({ itemData, onDone, onKarlReact, onCombo, combo }: {
  itemData: typeof GREETINGS[0];
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  combo: number;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(itemData.word);

  useEffect(() => {
    const t = setTimeout(() => speakWord(itemData.word), 400);
    return () => clearTimeout(t);
  }, [itemData.word]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, itemData.word)) {
      setStatus('correct');
      speakWord(itemData.word);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) {
        setConfettiPos({ x: e.clientX, y: e.clientY });
      } else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1100);
    } else {
      setStatus('wrong');
      playBuzzSound();
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
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={itemData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-word-${itemData.word}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 flex flex-col items-center gap-5">
            <HeroWordDisplay itemData={itemData} />

            <div className="text-center">
              <div className="font-black text-3xl md:text-4xl text-white mb-1" style={{
                textShadow: `0 0 40px ${itemData.color}88, 0 2px 10px rgba(0,0,0,0.5)`,
                background: `linear-gradient(180deg, white, ${itemData.color}cc)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {itemData.word}
              </div>
              <div className="font-bold text-lg" style={{ color: itemData.color }}>{itemData.wordAr}</div>
            </div>

            <SoundButton onClick={() => speakWord(itemData.word)} color={itemData.color} label="استمع للكلمة" />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${itemData.color}aa` }}>
                Wort · الكلمة
              </div>
              <div className="text-2xl font-black text-white">اكتب الكلمة</div>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setStatus('idle'); }}
              onKeyDown={e => e.key === 'Enter' && input && handleCheck()}
              placeholder={itemData.word}
              autoFocus
              className="w-full text-center font-black py-4 rounded-2xl border-2 outline-none transition-all text-white placeholder:text-white/15"
              style={{
                fontSize: '1.4rem',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: status === 'correct' ? '#58CC02' : status === 'wrong' ? '#FF4444' : `${itemData.color}55`,
                boxShadow: status === 'correct' ? '0 0 30px #58CC0266'
                  : status === 'wrong' ? '0 0 30px #FF444466'
                  : `inset 0 1px 0 ${itemData.color}33, 0 8px 30px ${itemData.color}22`,
              }}
            />

            {requiredChars.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">
                  💡 الحروف الخاصة
                </p>
                <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={itemData.color} />
              </div>
            )}

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                  style={{
                    background: status === 'correct' ? 'rgba(88,204,2,0.18)' : 'rgba(255,68,68,0.18)',
                    color: status === 'correct' ? '#58CC02' : '#FF6B6B',
                    border: `1px solid ${status === 'correct' ? '#58CC0244' : '#FF444444'}`,
                  }}>
                  {status === 'correct' ? <><Check size={16} /> ممتاز!</> : <><X size={16} /> جرب تاني</>}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${itemData.gradient[0]}, ${itemData.gradient[1]})`,
                boxShadow: `0 8px 30px ${itemData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${itemData.color}77`,
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
// QUIZ Phase — اختيار من متعدد
// ═══════════════════════════════════════
interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  emoji: string;
  color: string;
  gradient: string[];
}

function generateQuizQuestions(items: typeof GREETINGS): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const item of items) {
    const wrongOptions = items
      .filter(i => i.word !== item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => i.wordAr);

    const allOptions = [...wrongOptions, item.wordAr].sort(() => Math.random() - 0.5);

    questions.push({
      question: item.word,
      correctAnswer: item.wordAr,
      options: allOptions,
      emoji: item.emoji,
      color: item.color,
      gradient: item.gradient,
    });
  }

  return questions.sort(() => Math.random() - 0.5).slice(0, 5);
}

function QuizPhase({ items, totalStars, onPass, onFail, onStarEarned, onKarlReact, onCombo }: {
  items: typeof GREETINGS;
  totalStars: number;
  onPass: () => void;
  onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [questions] = useState(() => generateQuizQuestions(items));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const currentQuestion = questions[currentIdx];

  const handleSelect = (option: string, e: React.MouseEvent) => {
    if (showFeedback || finished) return;
    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      setShowFeedback('correct');
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      setConfettiPos({ x: e.clientX, y: e.clientY });
      setConfettiTrigger(t => t + 1);
      onStarEarned(e.clientX, e.clientY);

      setTimeout(() => {
        setShowFeedback(null);
        setSelectedOption(null);
        if (currentIdx + 1 >= questions.length) {
          setFinished(true);
          onKarlReact('celebrate');
          setTimeout(onPass, 1800);
        } else {
          setCurrentIdx(i => i + 1);
        }
      }, 1200);
    } else {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      setShowFeedback('wrong');
      playBuzzSound();
      onKarlReact('sad');

      setTimeout(() => {
        setShowFeedback(null);
        setSelectedOption(null);
        if (newWrong >= 3) onFail();
      }, 900);
    }
  };

  if (!currentQuestion) return null;

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#FFFFFF']} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(totalStars, 8) }).map((_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: i * 0.05 }}>
                <Star size={16} fill="#FFD700" color="#FFD700" />
              </motion.div>
            ))}
            {totalStars > 8 && <span className="text-xs font-black text-yellow-400">+{totalStars - 8}</span>}
          </div>
          <span className="text-xs font-bold" style={{ color: wrong >= 2 ? '#FF6B6B' : 'rgba(255,255,255,0.25)' }}>
            {wrong > 0 && '❌'.repeat(Math.min(wrong, 3))} {wrong}/3
          </span>
        </div>

        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="rounded-3xl border-2 overflow-hidden backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, ${currentQuestion.color}22, ${currentQuestion.color}08)`,
            borderColor: `${currentQuestion.color}55`,
            boxShadow: `0 8px 30px ${currentQuestion.color}33`,
          }}
        >
          <div className="p-8 text-center">
            <div className="text-xs font-black uppercase tracking-widest mb-3 text-white/40">
              Frage {currentIdx + 1} / {questions.length} · السؤال
            </div>

            <div className="text-6xl mb-4">{currentQuestion.emoji}</div>

            <div className="font-black text-2xl md:text-3xl text-white mb-3" style={{
              textShadow: `0 0 30px ${currentQuestion.color}aa`,
            }}>
              {currentQuestion.question}
            </div>

            <button
              onClick={() => speakWord(currentQuestion.question)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all text-sm font-bold"
            >
              <Volume2 size={14} /> استمع
            </button>

            <p className="mt-4 text-sm font-bold text-white/60">ما معنى هذه الكلمة؟</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6 pt-0">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrect = showFeedback === 'correct' && isCorrect;
              const showWrong = showFeedback === 'wrong' && isSelected && !isCorrect;
              const showRightAnswer = showFeedback === 'wrong' && isCorrect;

              return (
                <motion.button
                  key={idx}
                  whileHover={!showFeedback ? { scale: 1.03, y: -2 } : {}}
                  whileTap={!showFeedback ? { scale: 0.97 } : {}}
                  onClick={(e) => handleSelect(option, e)}
                  disabled={!!showFeedback}
                  className="relative py-4 px-6 rounded-2xl font-black text-base md:text-lg border-2 transition-all text-white"
                  style={{
                    background: showCorrect || showRightAnswer
                      ? 'linear-gradient(135deg, rgba(88,204,2,0.3), rgba(88,204,2,0.1))'
                      : showWrong
                      ? 'linear-gradient(135deg, rgba(255,68,68,0.3), rgba(255,68,68,0.1))'
                      : isSelected
                      ? `linear-gradient(135deg, ${currentQuestion.color}33, ${currentQuestion.color}11)`
                      : 'rgba(255,255,255,0.05)',
                    borderColor: showCorrect || showRightAnswer
                      ? '#58CC02'
                      : showWrong
                      ? '#FF4444'
                      : isSelected
                      ? currentQuestion.color
                      : 'rgba(255,255,255,0.15)',
                    boxShadow: showCorrect || showRightAnswer
                      ? '0 0 30px rgba(88,204,2,0.4)'
                      : showWrong
                      ? '0 0 30px rgba(255,68,68,0.4)'
                      : 'none',
                  }}
                >
                  {option}

                  {(showCorrect || showRightAnswer) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 left-2"
                    >
                      <Check size={20} className="text-[#58CC02]" />
                    </motion.div>
                  )}
                  {showWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 left-2"
                    >
                      <X size={20} className="text-[#FF4444]" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="flex gap-2 justify-center">
          {questions.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === currentIdx ? 32 : 12,
                background: i < currentIdx
                  ? '#58CC02'
                  : i === currentIdx
                  ? currentQuestion.color
                  : 'rgba(255,255,255,0.15)',
                boxShadow: i === currentIdx ? `0 0 10px ${currentQuestion.color}` : 'none',
              }}
            />
          ))}
        </div>

        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
            style={{ background: 'rgba(0,10,20,0.9)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8 }}
              className="text-7xl"
            >
              🎉
            </motion.div>
            <p className="font-black text-white text-3xl">أنهيت الاختبار!</p>
            <div className="flex gap-1">
              {items.map((_, i) => (
                <Star key={i} size={24} fill="#FFD700" color="#FFD700" />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// شاشات نجاح وفشل
// ═══════════════════════════════════════
function SuccessScreen({ groupTitle, onNext }: { groupTitle: string; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8">
      <motion.div animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 1, delay: 0.2 }} className="text-9xl">🏆</motion.div>
      <div>
        <h2 className="text-4xl font-black text-white mb-2">أنهيت {groupTitle}!</h2>
        <p className="font-bold text-lg text-[#4CC9F0]">كمّل على المجموعة الجاية 💪</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 400 }}>
            <Star size={52} fill="#FFD700" color="#FFD700" />
          </motion.div>
        ))}
      </div>
      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onNext}
        className="px-12 py-5 rounded-2xl font-black text-xl text-white"
        style={{
          background: 'linear-gradient(135deg, #4CC9F0, #7209B7)',
          boxShadow: '0 10px 40px rgba(76,201,240,0.4)',
        }}>
        المجموعة الجاية 🚀
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8">
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.5, repeat: 3 }} className="text-8xl">😅</motion.div>
      <div>
        <h2 className="text-3xl font-black text-white mb-2">حاول تاني!</h2>
        <p className="font-bold text-white/40">راجع الكلمات كويس وبعدين اعمل الاختبار</p>
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onRetry}
        className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #F72585, #7209B7)' }}>
        <RotateCcw size={20} /> أعد المجموعة
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// الصفحة الرئيسية
// ═══════════════════════════════════════
type Phase = 'learn-word' | 'quiz' | 'group-success' | 'group-fail' | 'all-done';

interface FlyingStar { id: number; x: number; y: number; }

export default function GermanFamilyPage() {
  const router = useRouter();
  const [groupIdx, setGroupIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn-word');
  const [totalStars, setTotalStars] = useState(0);
  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const group = GROUPS[groupIdx];
  const itemData = group?.items[itemIdx];
  const totalItemsLearned = GROUPS.slice(0, groupIdx).reduce((sum, g) => sum + g.items.length, 0) + itemIdx;
  const totalItems = GROUPS.reduce((sum, g) => sum + g.items.length, 0);

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

  const handleWordDone = () => {
    const nextIdx = itemIdx + 1;
    if (nextIdx < group.items.length) {
      setItemIdx(nextIdx);
      setPhase('learn-word');
    } else {
      setPhase('quiz');
    }
  };

  const handleQuizPass = () => setPhase('group-success');
  const handleQuizFail = () => { resetCombo(); setPhase('group-fail'); };

  const handleGroupNext = () => {
    if (groupIdx + 1 < GROUPS.length) {
      setGroupIdx(i => i + 1);
      setItemIdx(0);
      setPhase('learn-word');
    } else {
      setPhase('all-done');
    }
  };

  const handleRetry = () => {
    setItemIdx(0);
    setPhase('learn-word');
  };

  const handleStarEarned = (clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setTotalStars(s => s + 1);
    setFlyingStars(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 1000);
  };

  if (!group || !itemData) return null;

  const phaseLabel: Record<Phase, string> = {
    'learn-word': 'تعلم', 'quiz': 'اختبار',
    'group-success': '🎉', 'group-fail': '😅', 'all-done': '🎓',
  };

  const activeColor = itemData?.color ?? '#FFD700';

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <BrandenburgBackground activeColor={activeColor} />
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

      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(2,5,15,0.95) 70%, transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.back()}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
                <span className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>{group.icon}</span>
                  {group.title} — {phaseLabel[phase]}
                </span>
                <span>{Math.min(totalItemsLearned + 1, totalItems)} / {totalItems}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #7209B7)`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${(totalItemsLearned / totalItems) * 100}%` }}
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

          <div className="flex gap-1.5 justify-center flex-wrap">
            {group.items.map((item, i) => {
              const isDone = phase === 'quiz' || phase === 'group-success' || i < itemIdx;
              const isCurrent = i === itemIdx;
              return (
                <motion.div key={item.word + i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all backdrop-blur-md"
                  style={{
                    background: isDone
                      ? `linear-gradient(135deg, ${item.gradient[0]}55, ${item.gradient[1]}33)`
                      : isCurrent
                      ? `linear-gradient(135deg, ${item.gradient[0]}33, ${item.gradient[1]}11)`
                      : 'rgba(255,255,255,0.03)',
                    borderColor: isDone ? item.color : isCurrent ? `${item.color}88` : 'rgba(255,255,255,0.08)',
                    color: isDone ? 'white' : isCurrent ? 'white' : 'rgba(255,255,255,0.2)',
                    boxShadow: isCurrent && !isDone ? `0 0 20px ${item.color}66, inset 0 1px 0 ${item.color}44` : 'none',
                  }}>
                  {isDone ? '✓' : item.emoji}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-36 pb-32 px-6 min-h-screen flex flex-col justify-center relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {phase === 'learn-word' && (
            <LearnWordPhase
              key={`lw-${groupIdx}-${itemIdx}`}
              itemData={itemData}
              onDone={handleWordDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              combo={combo}
            />
          )}
          {phase === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-3xl font-black text-white">اختر الإجابة الصحيحة! 🎯</h2>
              </div>
              <QuizPhase
                items={group.items}
                totalStars={totalStars}
                onPass={handleQuizPass}
                onFail={handleQuizFail}
                onStarEarned={handleStarEarned}
                onKarlReact={handleKarlReact}
                onCombo={handleCombo}
              />
            </motion.div>
          )}
          {phase === 'group-success' && (
            <SuccessScreen key="success" groupTitle={group.title} onNext={handleGroupNext} />
          )}
          {phase === 'group-fail' && (
            <FailScreen key="fail" onRetry={handleRetry} />
          )}
          {phase === 'all-done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1.2, delay: 0.3 }} className="text-9xl">🏛️</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أنهيت بوابة براندنبورغ!</h2>
                <p className="font-bold text-lg text-[#FFD700]">تعلمت التحيات والتعارف والعائلة 🎉</p>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-md border border-yellow-400/30"
                style={{ background: 'rgba(255,215,0,0.1)' }}>
                <Star size={32} fill="#FFD700" color="#FFD700" />
                <span className="font-black text-4xl text-yellow-400">{totalStars}</span>
                <span className="font-bold text-white/40 text-lg">نجمة!</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + s * 0.15, type: 'spring' }}>
                    <Star size={56} fill="#FFD700" color="#FFD700" />
                  </motion.div>
                ))}
              </div>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => router.push('/character-and-map')}
                className="flex items-center gap-2 px-12 py-5 rounded-2xl font-black text-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #58CC02, #096A02)',
                  boxShadow: '0 10px 40px rgba(88,204,2,0.4)',
                }}>
                <Trophy size={24} /> الخريطة
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
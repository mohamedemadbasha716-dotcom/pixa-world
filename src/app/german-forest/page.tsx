'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Check, X, Trophy, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Flame } from 'lucide-react';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';

// 🎯 المكونات المشتركة
import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import FlyingStars, { type FlyingStar } from '@/app/components/lesson/FlyingStars';
import SoundButton from '@/app/components/lesson/SoundButton';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';

// 🎯 الأنواع والرسائل المشتركة
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

// 🎯 الأصوات والنطق المشتركة
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakWord } from '@/lib/audio/speech';

// 📦 البيانات من الملفات المنفصلة
import { FOREST_SECTIONS, type ForestSection, type ForestWord } from '@/data/german/forest';

type Box = { x: number; y: number; w: number; h: number };

const FOREST_OBJECTS: Record<string, Box[]> = {
  Eule:           [{ x: 2.0,  y: 6.0,  w: 12.0, h: 22.0 }],
  Reh:            [{ x: 10.0, y: 35.0, w: 16.0, h: 32.0 }],
  Wolf:           [{ x: 37.0, y: 40.0, w: 12.0, h: 24.0 }],
  Fuchs:          [{ x: 6.0,  y: 65.0, w: 20.0, h: 24.0 }],
  Igel:           [{ x: 37.0, y: 76.0, w: 9.0,  h: 12.0 }],
  Schmetterling:  [{ x: 47.0, y: 56.0, w: 9.0,  h: 14.0 }],
  Frosch:         [{ x: 54.0, y: 80.0, w: 11.0, h: 14.0 }],
  Hase:           [{ x: 59.0, y: 60.0, w: 10.0, h: 16.0 }],
  Apfel:          [{ x: 14.0, y: 1.0,  w: 11.0, h: 20.0 }],
  Traube:         [{ x: 25.0, y: 1.0,  w: 10.0, h: 18.0 }],
  Kirsche:        [{ x: 36.0, y: 1.0,  w: 8.0,  h: 14.0 }],
  Banane:         [{ x: 47.0, y: 0.0,  w: 11.0, h: 20.0 }],
  Birne:          [{ x: 59.0, y: 1.0,  w: 9.0,  h: 18.0 }],
  Zitrone:        [{ x: 69.0, y: 1.0,  w: 8.0,  h: 16.0 }],
  Orange:         [{ x: 78.0, y: 1.0,  w: 10.0, h: 18.0 }],
  Erdbeere:       [{ x: 8.0,  y: 86.0, w: 16.0, h: 12.0 }],
  Karotte:        [{ x: 65.0, y: 60.0, w: 20.0, h: 14.0 }],
  Tomate:         [{ x: 69.0, y: 70.0, w: 8.0,  h: 12.0 }],
  Kuerbis:        [{ x: 75.0, y: 70.0, w: 14.0, h: 20.0 }],
  Aubergine:      [{ x: 85.0, y: 68.0, w: 9.0,  h: 22.0 }],
  Mais:           [{ x: 91.0, y: 40.0, w: 9.0,  h: 38.0 }],
  Zucchini:       [{ x: 83.0, y: 80.0, w: 13.0, h: 12.0 }],
  Pilz:           [{ x: 0.0,  y: 80.0, w: 14.0, h: 20.0 }],
  Paprika:        [{ x: 91.0, y: 80.0, w: 9.0,  h: 18.0 }],
};

const COLOR_OBJECTS: Record<string, Box[]> = {
  Rot: [
    { x: 14.0, y: 1.0,  w: 11.0, h: 20.0 },
    { x: 36.0, y: 1.0,  w: 8.0,  h: 14.0 },
    { x: 8.0,  y: 86.0, w: 16.0, h: 12.0 },
    { x: 69.0, y: 70.0, w: 8.0,  h: 12.0 },
    { x: 91.0, y: 80.0, w: 9.0,  h: 18.0 },
    { x: 29.5, y: 56.0, w: 6.0,  h: 5.0  },
  ],
  Gelb: [
    { x: 86.0, y: 6.0,  w: 14.0, h: 28.0 },
    { x: 47.0, y: 0.0,  w: 11.0, h: 20.0 },
    { x: 69.0, y: 1.0,  w: 8.0,  h: 16.0 },
    { x: 91.0, y: 40.0, w: 9.0,  h: 38.0 },
    { x: 47.0, y: 47.0, w: 5.0,  h: 6.0  },
    { x: 55.0, y: 47.0, w: 5.0,  h: 6.0  },
  ],
  Gruen: [
    { x: 54.0, y: 80.0, w: 11.0, h: 14.0 },
    { x: 83.0, y: 80.0, w: 13.0, h: 12.0 },
    { x: 59.0, y: 1.0,  w: 9.0,  h: 18.0 },
    { x: 65.0, y: 56.0, w: 20.0, h: 6.0  },
    { x: 6.0,  y: 55.0, w: 20.0, h: 12.0 },
    { x: 37.0, y: 55.0, w: 15.0, h: 22.0 },
    { x: 58.0, y: 75.0, w: 25.0, h: 25.0 },
  ],
  Blau: [
    { x: 47.0, y: 56.0, w: 9.0,  h: 14.0 },
    { x: 44.0, y: 60.0, w: 28.0, h: 40.0 },
    { x: 27.0, y: 55.0, w: 11.0, h: 25.0 },
    { x: 81.0, y: 51.0, w: 8.0,  h: 8.0  },
  ],
  Lila: [
    { x: 25.0, y: 1.0,  w: 10.0, h: 18.0 },
    { x: 85.0, y: 68.0, w: 9.0,  h: 22.0 },
    { x: 0.0,  y: 80.0, w: 14.0, h: 20.0 },
    { x: 80.0, y: 50.0, w: 6.0,  h: 6.0  },
  ],
  Orange: [
    { x: 78.0, y: 1.0,  w: 10.0, h: 18.0 },
    { x: 75.0, y: 70.0, w: 14.0, h: 20.0 },
    { x: 65.0, y: 60.0, w: 20.0, h: 14.0 },
    { x: 6.0,  y: 65.0, w: 20.0, h: 24.0 },
  ],
  Braun: [
    { x: 37.0, y: 76.0, w: 9.0,  h: 12.0 },
    { x: 2.0,  y: 6.0,  w: 12.0, h: 22.0 },
    { x: 10.0, y: 35.0, w: 16.0, h: 32.0 },
    { x: 27.0, y: 40.0, w: 9.0,  h: 12.0 },
    { x: 0.0,  y: 0.0,  w: 18.0, h: 100.0 },
    { x: 78.0, y: 0.0,  w: 14.0, h: 65.0  },
    { x: 38.0, y: 28.0, w: 26.0, h: 28.0 },
  ],
  Weiss: [
    { x: 59.0, y: 60.0, w: 10.0, h: 16.0 },
    { x: 4.0,  y: 10.0, w: 7.0,  h: 12.0 },
    { x: 12.0, y: 63.0, w: 6.0,  h: 6.0  },
    { x: 1.0,  y: 83.0, w: 4.0,  h: 4.0  },
  ],
};

function getBoxesForWord(word: string, sectionId: string): Box[] {
  if (sectionId === 'colors') {
    return COLOR_OBJECTS[word] ?? [];
  }
  return FOREST_OBJECTS[word] ?? [];
}

const NAT_W = 1920;
const NAT_H = 1080;

function normalizeGerman(s: string): string {
  return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

function compareWords(input: string, target: string): boolean {
  return normalizeGerman(input.trim()) === normalizeGerman(target);
}

type Phase = 'learn' | 'test' | 'section-success' | 'section-fail' | 'all-done';

// ═══════════════════════════════════════
// خلفية الغابة
// ═══════════════════════════════════════
function PremiumForestBackground({ section, activeColor }: { section: ForestSection; activeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number; rotation: number; xOffset1: number; xOffset2: number }>>([]);
  const [stars, setStars] = useState<Array<{ left: number; top: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 16 + Math.random() * 12,
      duration: 12 + Math.random() * 10,
      rotation: Math.random() * 360,
      xOffset1: Math.random() * 100 - 50,
      xOffset2: Math.random() * 100 - 50,
    }));
    setParticles(p);

    const s = Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 60,
      size: 1.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
    setStars(s);
  }, [section.id]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 0%, ${section.bgColors[1]} 0%, ${section.bgColors[0]} 100%)`,
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}44, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse 60% 40% at 20% 80%, ${section.accentColor}33, transparent 60%)` }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {particles.map(p => (
        <motion.div
          key={`${section.id}-${p.id}`}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: -30,
            fontSize: p.size,
            filter: `drop-shadow(0 0 8px ${activeColor}66)`,
          }}
          animate={{
            y: [(typeof window !== 'undefined' ? window.innerHeight : 800) + 50],
            x: [0, p.xOffset1, p.xOffset2, 0],
            rotate: [p.rotation, p.rotation + 360],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {section.particleEmoji}
        </motion.div>
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
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
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
// Combo Badge
// ═══════════════════════════════════════
function ComboBadge({ combo }: { combo: number }) {
  if (combo < 3) return null;
  const isOnFire = combo >= 5;
  return (
    <motion.div
      key={combo}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border backdrop-blur-md"
      style={{
        background: isOnFire ? 'rgba(255,107,107,0.18)' : 'rgba(255,165,0,0.15)',
        borderColor: isOnFire ? 'rgba(255,107,107,0.5)' : 'rgba(255,165,0,0.4)',
        boxShadow: isOnFire ? '0 0 15px rgba(255,107,107,0.3)' : '0 0 12px rgba(255,165,0,0.25)',
      }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      >
        <Flame size={12} fill={isOnFire ? '#FF6B6B' : '#FF9500'} color={isOnFire ? '#FF6B6B' : '#FF9500'} />
      </motion.div>
      <span className="font-black text-xs" style={{ color: isOnFire ? '#FF6B6B' : '#FF9500' }}>
        x{combo}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Streak Badge
// ═══════════════════════════════════════
function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border backdrop-blur-md"
      style={{
        background: streak >= 5 ? 'rgba(255,107,107,0.15)' : 'rgba(255,215,0,0.1)',
        borderColor: streak >= 5 ? 'rgba(255,107,107,0.4)' : 'rgba(255,215,0,0.3)',
      }}
    >
      <Zap size={12} fill={streak >= 5 ? '#FF6B6B' : '#FFD700'} color={streak >= 5 ? '#FF6B6B' : '#FFD700'} />
      <span className="font-black text-xs" style={{ color: streak >= 5 ? '#FF6B6B' : '#FFD700' }}>
        {streak}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Hero Word Display
// ═══════════════════════════════════════
function HeroWordDisplay({ wordData }: { wordData: ForestWord }) {
  const [sparkles, setSparkles] = useState<Array<{ top: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 6 }, (_, i) => ({
        top: 20 + Math.random() * 60,
        left: 10 + Math.random() * 80,
        delay: i * 0.4,
        duration: 2 + Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${wordData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-3 h-3 rounded-full" style={{
          background: wordData.color,
          top: -6, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 15px ${wordData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${wordData.color}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: wordData.gradient[1],
          bottom: -4, right: '30%',
          boxShadow: `0 0 10px ${wordData.gradient[1]}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${wordData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] flex flex-col items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${wordData.gradient[0]}22, ${wordData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${wordData.color}44`,
          boxShadow: `0 20px 60px ${wordData.color}33, inset 0 1px 0 ${wordData.color}55, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: '8rem',
            filter: `drop-shadow(0 8px 24px ${wordData.color}aa)`,
            lineHeight: 1,
          }}
        >
          {wordData.emoji}
        </motion.div>

        <div className="relative z-10 text-center mt-2 px-4">
          <div className="font-black text-2xl mb-0.5" style={{
            color: 'white',
            textShadow: `0 0 25px ${wordData.color}, 0 2px 8px rgba(0,0,0,0.5)`,
          }}>
            {wordData.word}
          </div>
          <div className="font-bold text-sm" style={{ color: wordData.color }}>
            {wordData.wordAr}
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full opacity-60" style={{
          background: `radial-gradient(ellipse, ${wordData.color}88, transparent)`,
          filter: 'blur(2px)',
        }} />
      </motion.div>

      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
        >
          <Sparkles size={12} style={{ color: wordData.color }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Phase 1 — تعلم الكلمة
// ═══════════════════════════════════════
function LearnCardPhase({ wordData, sectionTitle, onDone, onKarlReact, onCombo, onStreak, onStarEarned }: {
  wordData: ForestWord;
  sectionTitle: string;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  onStreak: (success: boolean) => void;
  onStarEarned: (x: number, y: number) => void;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(wordData.word);

  useEffect(() => {
    setInput('');
    setStatus('idle');
    const t = setTimeout(() => speakWord(wordData.word), 500);
    return () => clearTimeout(t);
  }, [wordData.word]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, wordData.word)) {
      setStatus('correct');
      speakWord(wordData.word);
      playCoinSound();
      onCombo();
      onStreak(true);
      onKarlReact('happy');

      let starX = 0, starY = 0;
      if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        starX = r.left + r.width / 2;
        starY = r.top + r.height / 2;
      } else if (e) {
        starX = e.clientX;
        starY = e.clientY;
      }
      onStarEarned(starX, starY);
      setConfettiPos({ x: starX, y: starY });
      setConfettiTrigger(t => t + 1);

      setTimeout(onDone, 1000);
    } else {
      setStatus('wrong');
      playBuzzSound();
      onStreak(false);
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
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={wordData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-${wordData.word}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 flex flex-col items-center gap-4">
            <motion.div
              onClick={() => speakWord(wordData.word)}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer"
            >
              <HeroWordDisplay wordData={wordData} />
            </motion.div>
            <SoundButton onClick={() => speakWord(wordData.word)} color={wordData.color} label="استمع للكلمة" />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${wordData.color}aa` }}>
                Wort · {sectionTitle}
              </div>
              <div className="text-2xl font-black text-white">اكتب الكلمة</div>
              <div className="text-sm font-bold text-white/40 mt-1">بالألمانية</div>
            </div>

            <GhostInput
              ref={inputRef}
              value={input}
              onChange={v => { setInput(v); setStatus('idle'); }}
              onEnter={handleCheck}
              ghostText={wordData.word}
              color={wordData.color}
              status={status}
              fontSize="1.8rem"
            />

            {requiredChars.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">
                  💡 الحروف الخاصة
                </p>
                <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={wordData.color} />
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
                  {status === 'correct' ? <><Check size={16} /> ممتاز!</> : <><X size={16} /> جرب تاني</>}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
              style={{
                background: `linear-gradient(135deg, ${wordData.gradient[0]}, ${wordData.gradient[1]})`,
                boxShadow: `0 8px 30px ${wordData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${wordData.color}77`,
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
// Phase 2 — اختبار الغابة
// ═══════════════════════════════════════
function ForestTest({
  sectionWords,
  sectionId,
  onPass,
  onFail,
  onStarEarned,
  onKarlReact,
  onCombo,
  onStreak,
}: {
  sectionWords: ForestWord[];
  sectionId: string;
  onPass: () => void;
  onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  onStreak: (success: boolean) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; correct: boolean } | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = sectionWords[currentIdx];
  const isColors = sectionId === 'colors';
  const boxes = currentWord ? getBoxesForWord(currentWord.word, sectionId) : [];

  useEffect(() => {
    setShowHint(false);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    if (!finished) {
      hintTimerRef.current = setTimeout(() => setShowHint(true), 10000);
    }
    return () => { if (hintTimerRef.current) clearTimeout(hintTimerRef.current); };
  }, [currentIdx, finished]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showFeedback || finished || boxes.length === 0 || !currentWord) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width;
    const containerH = rect.height;

    const scale = Math.min(containerW / NAT_W, containerH / NAT_H);
    const renderedW = NAT_W * scale;
    const renderedH = NAT_H * scale;
    const offsetX = (containerW - renderedW) / 2;
    const offsetY = (containerH - renderedH) / 2;

    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;

    if (clickX < 0 || clickY < 0 || clickX > renderedW || clickY > renderedH) return;

    const pctX = (clickX / renderedW) * 100;
    const pctY = (clickY / renderedH) * 100;

    const hit = boxes.some(b => pctX >= b.x && pctX <= b.x + b.w && pctY >= b.y && pctY <= b.y + b.h);

    const relX = ((clickX + offsetX) / containerW) * 100;
    const relY = ((clickY + offsetY) / containerH) * 100;
    setClickEffect({ x: relX, y: relY, correct: hit });
    setTimeout(() => setClickEffect(null), 600);

    if (hit) {
      speakWord(currentWord.word);
      playCoinSound();
      onCombo();
      onStreak(true);
      onKarlReact('happy');
      setFoundWords(prev => [...prev, currentWord.word]);
      onStarEarned(e.clientX, e.clientY);
      setConfettiPos({ x: e.clientX, y: e.clientY });
      setConfettiTrigger(t => t + 1);
      setShowHint(false);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      setShowFeedback('correct');
      setTimeout(() => {
        setShowFeedback(null);
        if (currentIdx + 1 >= sectionWords.length) {
          setFinished(true);
          onKarlReact('celebrate');
          setTimeout(onPass, 1800);
        } else setCurrentIdx(i => i + 1);
      }, 1200);
    } else {
      playBuzzSound();
      onStreak(false);
      onKarlReact('sad');
      const newWrong = wrong + 1;
      setWrong(newWrong);
      setShowFeedback('wrong');
      setTimeout(() => { setShowFeedback(null); if (newWrong >= 5) onFail(); }, 600);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={currentWord ? currentWord.gradient.concat(['#FFD700', '#FFFFFF']) : ['#FFD700']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-4 w-full items-start max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!finished && currentWord && (
            <motion.div key={currentWord.word}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="w-full lg:w-80 flex-shrink-0 rounded-2xl border-2 overflow-hidden backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${currentWord.color}22, ${currentWord.color}08)`,
                borderColor: `${currentWord.color}55`,
                boxShadow: `0 8px 30px ${currentWord.color}33`,
              }}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border-2 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentWord.gradient[0]}, ${currentWord.gradient[1]})`,
                    borderColor: 'rgba(255,255,255,0.3)',
                    boxShadow: `0 6px 20px ${currentWord.color}66`,
                  }}>
                  {currentWord.emoji}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-white/50 text-xs font-bold mb-0.5">
                    {isColors ? 'ابحث عن أي حاجة باللون:' : 'ابحث في الصورة عن:'}
                  </p>
                  <p className="font-black text-white text-xl leading-tight">{currentWord.word}</p>
                  <p className="font-bold text-sm" style={{ color: currentWord.color }}>{currentWord.wordAr}</p>
                </div>
                <button onClick={() => speakWord(currentWord.word)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90"
                  style={{
                    borderColor: `${currentWord.color}66`,
                    background: `${currentWord.color}22`,
                    color: 'white',
                  }}>
                  <Volume2 size={18} />
                </button>
              </div>
              <div className="flex gap-1 px-4 pb-3">
                {sectionWords.map((w, i) => (
                  <div key={w.word} className="flex-1 h-2 rounded-full transition-all"
                    style={{
                      background: foundWords.includes(w.word) ? `linear-gradient(90deg, ${w.gradient[0]}, ${w.gradient[1]})` : i === currentIdx ? `${w.color}55` : 'rgba(255,255,255,0.08)',
                    }} />
                ))}
              </div>
              {isColors && (
                <div className="px-4 pb-3 text-[11px] font-bold text-white/60 text-center">
                  💡 أي عنصر <span style={{ color: currentWord.color }}>{currentWord.wordAr}</span> في الصورة = صح!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl select-none"
          style={{
            aspectRatio: `${NAT_W}/${NAT_H}`,
            cursor: finished ? 'default' : 'pointer',
            background: '#0a1a0a',
          }}
          onClick={handleImageClick}
        >
          <img
            src="/images/forest-scene.png"
            alt="غابة سحرية"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { const t = e.target as HTMLImageElement; if (!t.src.includes('?v2')) t.src = '/forest-scene.png?v2'; }}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center',
              pointerEvents: 'none', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease',
            }}
            draggable={false}
          />

          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0a1a0a' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="text-4xl">🌲</motion.div>
            </div>
          )}

          <AnimatePresence>
            {showHint && boxes.length > 0 && currentWord && boxes.map((b, idx) => (
              <div key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="absolute rounded-2xl pointer-events-none"
                  style={{
                    left: `${b.x - 1}%`, top: `${b.y - 1}%`, width: `${b.w + 2}%`, height: `${b.h + 2}%`,
                    background: `radial-gradient(ellipse at center, ${currentWord.color}66, ${currentWord.color}11 60%, transparent 80%)`,
                    filter: 'blur(8px)',
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6], boxShadow: [`0 0 20px ${currentWord.color}aa, inset 0 0 15px ${currentWord.color}55`, `0 0 50px ${currentWord.color}, inset 0 0 30px ${currentWord.color}88`, `0 0 20px ${currentWord.color}aa, inset 0 0 15px ${currentWord.color}55`] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="absolute rounded-xl pointer-events-none"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, border: `3px solid ${currentWord.color}`, background: `${currentWord.color}25` }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{ opacity: { duration: 0.3 }, y: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none text-3xl"
                  style={{ left: `${b.x + b.w / 2}%`, top: `${Math.max(b.y - 6, 0)}%`, transform: 'translateX(-50%)', filter: `drop-shadow(0 0 8px ${currentWord.color})` }}
                >👇</motion.div>
              </div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {clickEffect && (
              <motion.div
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute pointer-events-none rounded-full"
                style={{ left: `${clickEffect.x}%`, top: `${clickEffect.y}%`, transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: clickEffect.correct ? 'rgba(88,204,2,0.65)' : 'rgba(255,68,68,0.65)' }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFeedback === 'correct' && currentWord && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(88,204,2,0.3), transparent)' }}>
                <motion.div initial={{ y: 20, scale: 0.8 }} animate={{ y: 0, scale: 1 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-xl"
                  style={{ background: 'rgba(88,204,2,0.92)', boxShadow: '0 4px 30px rgba(88,204,2,0.5)' }}>
                  ✓ {currentWord.word}!
                </motion.div>
              </motion.div>
            )}
            {showFeedback === 'wrong' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.18 }} exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none" style={{ background: '#FF4444' }} />
            )}
          </AnimatePresence>

          {finished && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(0,8,0,0.85)', backdropFilter: 'blur(8px)' }}>
              <motion.div animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.8 }} className="text-7xl">🎉</motion.div>
              <p className="font-black text-white text-3xl">وجدت كل الحاجات!</p>
              <div className="flex gap-1.5">{sectionWords.map(w => <Star key={w.word} size={22} fill="#FFD700" color="#FFD700" />)}</div>
            </motion.div>
          )}
        </div>

        <div className="w-full flex items-center justify-between px-1 lg:hidden">
          <button
            onClick={() => setShowHint(v => !v)}
            className="text-xs font-bold transition-all px-3 py-1.5 rounded-xl border backdrop-blur-sm"
            style={{
              color: showHint ? (currentWord?.color ?? '#fff') : 'rgba(255,255,255,0.4)',
              borderColor: showHint ? `${currentWord?.color ?? '#fff'}66` : 'rgba(255,255,255,0.1)',
              background: showHint ? `${currentWord?.color ?? '#fff'}18` : 'rgba(255,255,255,0.03)',
            }}
          >💡 {showHint ? 'إخفاء التلميح' : 'مش لاقيه؟'}</button>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white/30">{foundWords.length} / {sectionWords.length}</span>
            <span className="text-xs font-bold" style={{ color: wrong >= 3 ? '#FF6B6B' : 'rgba(255,255,255,0.2)' }}>{wrong > 0 && '❌'.repeat(Math.min(wrong, 5))}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// شاشات نجاح وفشل
// ═══════════════════════════════════════
function SectionSuccess({ section, onNext, isLast }: { section: ForestSection; onNext: () => void; isLast: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
      <motion.div animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 1, delay: 0.2 }} className="text-9xl">{section.emoji}</motion.div>
      <div>
        <h2 className="text-4xl font-black text-white mb-2">أنهيت {section.title}! 🎉</h2>
        <p className="font-bold text-lg" style={{ color: section.accentColor }}>{isLast ? 'أنهيت كل دروس الغابة! 🌳' : 'كمّل على القسم الجاي 💪'}</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 400 }}>
            <Star size={52} fill="#FFD700" color="#FFD700" />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onNext}
        className="px-12 py-5 rounded-2xl font-black text-xl text-white"
        style={{
          background: isLast ? 'linear-gradient(135deg, #58CC02, #096A02)' : `linear-gradient(135deg, ${section.gradient[0]}, ${section.gradient[1]})`,
          boxShadow: `0 10px 40px ${section.accentColor}55`,
        }}>
        {isLast ? '🏆 العودة للخريطة' : `${FOREST_SECTIONS[FOREST_SECTIONS.indexOf(section) + 1]?.emoji} القسم الجاي`}
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.5, repeat: 3 }} className="text-8xl">😅</motion.div>
      <div>
        <h2 className="text-3xl font-black text-white mb-2">حاول تاني!</h2>
        <p className="font-bold text-white/40">راجع الكلمات كويس وبعدين اعمل الاختبار</p>
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onRetry}
        className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #F72585, #7209B7)' }}>
        <RotateCcw size={20} /> أعد القسم
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanForestPage() {
  const router = useRouter();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const LESSON_ID = 'center';

  const totalWordsAll = FOREST_SECTIONS.reduce((a, s) => a + s.words.length, 0);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        
        if (!progress.completed) {
          if (progress.current_group !== undefined && progress.current_group !== null) {
            setSectionIdx(progress.current_group);
          }
          if (progress.current_letter !== undefined && progress.current_letter !== null) {
            setWordIdx(progress.current_letter);
          }
          if (progress.current_phase) {
            setPhase(progress.current_phase as Phase);
          }
          console.log(`📍 الرجوع لمكانك: قسم ${progress.current_group}, كلمة ${progress.current_letter}, مرحلة ${progress.current_phase}`);
        }
        
        console.log('✅ تم تحميل التقدم:', progress);
      }
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const starBarRef = useRef<HTMLDivElement>(null);

  const section = FOREST_SECTIONS[sectionIdx];
  const wordData = section?.words[wordIdx];
  const totalWords = totalWordsAll;
  const learnedWords = FOREST_SECTIONS.slice(0, sectionIdx).reduce((a, s) => a + s.words.length, 0) + wordIdx;

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

  const handleStreak = (success: boolean) => {
    if (success) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = totalWordsAll * 2;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newSection: number, newWord: number, newPhase: Phase, starsToSave?: number) => {
    const stars = starsToSave !== undefined ? starsToSave : totalStars;
    const rating = calculateRating(stars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newSection,
      current_letter: newWord,
      current_phase: newPhase,
    }).then(() => {
      console.log(`📍 تم حفظ المكان: S${newSection} W${newWord} ${newPhase} | نجوم: ${stars} → تقييم: ${rating}/3`);
    });
  };

  const handleWordDone = () => {
    const nextIdx = wordIdx + 1;
    if (nextIdx < section.words.length) {
      setWordIdx(nextIdx);
      savePosition(sectionIdx, nextIdx, 'learn');
    } else {
      setPhase('test');
      savePosition(sectionIdx, wordIdx, 'test');
    }
  };

  const handleTestPass = () => {
    setPhase('section-success');
    savePosition(sectionIdx, wordIdx, 'section-success');
  };
  
  const handleTestFail = () => {
    setCombo(0);
    setStreak(0);
    setPhase('section-fail');
  };

  const handleSectionNext = () => {
    if (sectionIdx + 1 < FOREST_SECTIONS.length) {
      const newSectionIdx = sectionIdx + 1;
      setSectionIdx(newSectionIdx);
      setWordIdx(0);
      setPhase('learn');
      savePosition(newSectionIdx, 0, 'learn');
    } else {
      setPhase('all-done');
    }
  };

  const handleRetry = () => {
    setWordIdx(0);
    setPhase('learn');
    savePosition(sectionIdx, 0, 'learn');
  };

  const handleStarEarned = useCallback((x: number, y: number) => {
    setTotalStars(s => {
      const newCount = s + 1;
      const rating = calculateRating(newCount);
      saveLessonProgress(LESSON_ID, rating, false, {
        current_group: sectionIdx,
        current_letter: wordIdx,
        current_phase: phase,
      }).then(() => {
        console.log(`⭐ تقدمك: ${newCount}/${totalWordsAll * 2} → تقييم: ${rating}/3`);
      });
      return newCount;
    });
    const id = Date.now() + Math.random();
    setFlyingStars(prev => [...prev, { id, x, y }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 900);
  }, [sectionIdx, wordIdx, phase, totalWordsAll]);

  const phaseLabel: Record<Phase, string> = {
    learn: 'تعلم', test: 'اختبار', 'section-success': '🎉', 'section-fail': '😅', 'all-done': '🌳',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b07]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🌲</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!section) return null;

  const activeColor = wordData?.color ?? section.accentColor;

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <PremiumForestBackground section={section} activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor={section.accentColor} />
      <FlyingStars stars={flyingStars} targetRef={starBarRef} />

      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3" style={{ background: 'linear-gradient(to bottom, rgba(7,11,7,0.97) 80%, transparent)' }}>
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="ارجع للخريطة (تقدمك محفوظ)">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
                <span className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>🌳</span>
                  {section.emoji} {section.title} — {phaseLabel[phase]}
                </span>
                <span>{Math.min(learnedWords + 1, totalWords)} / {totalWords}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, ${section.accentColor})`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${(learnedWords / totalWords) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)',
                  }} />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              <ComboBadge combo={combo} />
            </AnimatePresence>
            <StreakBadge streak={streak} />

            <motion.div ref={starBarRef} key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl border border-yellow-400/30"
              style={{ background: 'rgba(255,215,0,0.1)', backdropFilter: 'blur(10px)' }}>
              <svg width="18" height="18" viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
              <span className="font-black text-sm text-yellow-400">{totalStars}</span>
            </motion.div>
          </div>

          <div className="flex gap-1.5 justify-center">
            {FOREST_SECTIONS.map((s, i) => {
              const done = i < sectionIdx || (i === sectionIdx && (phase === 'section-success' || phase === 'all-done'));
              const current = i === sectionIdx;
              return (
                <motion.div key={s.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex-1 h-10 rounded-xl flex items-center justify-center text-base font-black border-2 transition-all backdrop-blur-md"
                  style={{
                    background: done ? `linear-gradient(135deg, ${s.gradient[0]}33, ${s.gradient[1]}15)`
                      : current ? `linear-gradient(135deg, ${s.gradient[0]}18, ${s.gradient[1]}08)`
                      : 'rgba(255,255,255,0.03)',
                    borderColor: done ? s.accentColor : current ? `${s.accentColor}77` : 'rgba(255,255,255,0.08)',
                    color: done ? 'white' : current ? 'white' : 'rgba(255,255,255,0.2)',
                    boxShadow: current && !done ? `0 0 20px ${s.accentColor}55` : 'none',
                  }}>
                  {done ? '✓' : s.emoji}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-36 pb-32 px-6 min-h-screen flex flex-col justify-center relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {phase === 'learn' && wordData && (
            <LearnCardPhase
              key={`learn-${sectionIdx}-${wordIdx}`}
              wordData={wordData}
              sectionTitle={section.title}
              onDone={handleWordDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              onStreak={handleStreak}
              onStarEarned={handleStarEarned}
            />
          )}

          {phase === 'test' && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">اختبار الغابة</div>
                <h2 className="text-3xl font-black text-white">ابحث في الغابة! 🌳</h2>
              </div>
              <ForestTest
                sectionWords={section.words}
                sectionId={section.id}
                onPass={handleTestPass}
                onFail={handleTestFail}
                onStarEarned={handleStarEarned}
                onKarlReact={handleKarlReact}
                onCombo={handleCombo}
                onStreak={handleStreak}
              />
            </motion.div>
          )}

          {phase === 'section-success' && (
            <SectionSuccess key="section-success" section={section} onNext={handleSectionNext} isLast={sectionIdx === FOREST_SECTIONS.length - 1} />
          )}

          {phase === 'section-fail' && (
            <FailScreen key="fail" onRetry={handleRetry} />
          )}

          {phase === 'all-done' && (
            <motion.div key="all-done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }} className="text-9xl">🌳</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أنهيت دروس الغابة!</h2>
                <p className="font-bold text-lg text-[#58CC02]">بوابة براندنبورغ اتفتحت لك! 🇩🇪</p>
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
              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} 
                onClick={async () => {
                  await saveLessonProgress(LESSON_ID, 3, true);
                  router.push('/character-and-map?from=lesson');
                }}
                className="flex items-center gap-2 px-12 py-5 rounded-2xl font-black text-lg text-white"
                style={{ background: 'linear-gradient(135deg, #58CC02, #096A02)', boxShadow: '0 10px 40px rgba(88,204,2,0.4)' }}>
                <Trophy size={24} /> العودة للخريطة
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Check, X, Trophy, RotateCcw, Sparkles, Flame, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════
// البيانات
// ═══════════════════════════════════════
const SECTIONS = [
  {
    id: 'fruits',
    title: 'الفواكه',
    titleDe: 'Früchte',
    emoji: '🍎',
    accentColor: '#58CC02',
    gradient: ['#58CC02', '#3A8C00'],
    bgColors: ['#0a1408', '#0f2010', '#0a1408'],
    particleEmoji: '🍃',
    words: [
      { word: 'Apfel',    wordAr: 'تفاحة',   emoji: '🍎', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
      { word: 'Traube',   wordAr: 'عنب',     emoji: '🍇', color: '#7B2FBE', gradient: ['#7B2FBE', '#5A1F8E'] },
      { word: 'Banane',   wordAr: 'موزة',    emoji: '🍌', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Birne',    wordAr: 'كمثرى',   emoji: '🍐', color: '#A8D5A2', gradient: ['#A8D5A2', '#6FAE6A'] },
      { word: 'Kirsche',  wordAr: 'كرز',     emoji: '🍒', color: '#C0392B', gradient: ['#C0392B', '#8B0000'] },
      { word: 'Orange',   wordAr: 'برتقالة', emoji: '🍊', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Zitrone',  wordAr: 'ليمونة',  emoji: '🍋', color: '#FFF44F', gradient: ['#FFF44F', '#E6D900'] },
      { word: 'Erdbeere', wordAr: 'فراولة',  emoji: '🍓', color: '#FF4D6D', gradient: ['#FF4D6D', '#D63031'] },
    ],
  },
  {
    id: 'vegetables',
    title: 'الخضروات',
    titleDe: 'Gemüse',
    emoji: '🥕',
    accentColor: '#FF9500',
    gradient: ['#FF9500', '#D17F00'],
    bgColors: ['#0d1008', '#162010', '#0d1008'],
    particleEmoji: '🍂',
    words: [
      { word: 'Karotte',   wordAr: 'جزرة',    emoji: '🥕', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Tomate',    wordAr: 'طماطمة',  emoji: '🍅', color: '#FF4D6D', gradient: ['#FF4D6D', '#C0392B'] },
      { word: 'Kuerbis',   wordAr: 'يقطينة',  emoji: '🎃', color: '#FF7A00', gradient: ['#FF7A00', '#D65A00'] },
      { word: 'Aubergine', wordAr: 'باذنجان', emoji: '🍆', color: '#6B21A8', gradient: ['#6B21A8', '#4A1670'] },
      { word: 'Mais',      wordAr: 'ذرة',     emoji: '🌽', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Zucchini',  wordAr: 'كوسة',    emoji: '🥒', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Pilz',      wordAr: 'فطر',     emoji: '🍄', color: '#C77DFF', gradient: ['#C77DFF', '#9D4EDD'] },
      { word: 'Paprika',   wordAr: 'فلفل',    emoji: '🫑', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
    ],
  },
  {
    id: 'animals',
    title: 'الحيوانات',
    titleDe: 'Tiere',
    emoji: '🦊',
    accentColor: '#FF9500',
    gradient: ['#FF9500', '#8B4513'],
    bgColors: ['#0e0a06', '#1a1008', '#0e0a06'],
    particleEmoji: '✨',
    words: [
      { word: 'Fuchs',         wordAr: 'ثعلب',  emoji: '🦊', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Igel',          wordAr: 'قنفذ',  emoji: '🦔', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { word: 'Eule',          wordAr: 'بومة',  emoji: '🦉', color: '#C8A96E', gradient: ['#C8A96E', '#8B7355'] },
      { word: 'Reh',           wordAr: 'غزال',  emoji: '🦌', color: '#C8A96E', gradient: ['#C8A96E', '#8B6B3D'] },
      { word: 'Wolf',          wordAr: 'ذئب',   emoji: '🐺', color: '#9B9B9B', gradient: ['#9B9B9B', '#6B6B6B'] },
      { word: 'Hase',          wordAr: 'أرنب',  emoji: '🐇', color: '#F0F0F0', gradient: ['#F0F0F0', '#C0C0C0'] },
      { word: 'Frosch',        wordAr: 'ضفدع',  emoji: '🐸', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Schmetterling', wordAr: 'فراشة', emoji: '🦋', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
    ],
  },
  {
    id: 'colors',
    title: 'الألوان',
    titleDe: 'Farben',
    emoji: '🎨',
    accentColor: '#C77DFF',
    gradient: ['#C77DFF', '#7209B7'],
    bgColors: ['#0a0a1a', '#12082a', '#0a0a1a'],
    particleEmoji: '🌈',
    words: [
      { word: 'Rot',     wordAr: 'أحمر',    emoji: '🔴', color: '#FF4D6D', gradient: ['#FF4D6D', '#C70039'] },
      { word: 'Gelb',    wordAr: 'أصفر',    emoji: '🟡', color: '#FFD700', gradient: ['#FFD700', '#FFA500'] },
      { word: 'Gruen',   wordAr: 'أخضر',    emoji: '🟢', color: '#58CC02', gradient: ['#58CC02', '#3A8C00'] },
      { word: 'Blau',    wordAr: 'أزرق',    emoji: '🔵', color: '#4CC9F0', gradient: ['#4CC9F0', '#0984E3'] },
      { word: 'Lila',    wordAr: 'بنفسجي',  emoji: '🟣', color: '#C77DFF', gradient: ['#C77DFF', '#7209B7'] },
      { word: 'Orange',  wordAr: 'برتقالي', emoji: '🟠', color: '#FF9500', gradient: ['#FF9500', '#E67E00'] },
      { word: 'Braun',   wordAr: 'بني',     emoji: '🟤', color: '#A0522D', gradient: ['#A0522D', '#6B3410'] },
      { word: 'Weiss',   wordAr: 'أبيض',    emoji: '⚪', color: '#F0F0F0', gradient: ['#F0F0F0', '#A0A0A0'] },
    ],
  },
];

type Box = { x: number; y: number; w: number; h: number };

// ═══════════════════════════════════════
// FOREST_OBJECTS - بدون تكرار
// ═══════════════════════════════════════
const FOREST_OBJECTS: Record<string, Box[]> = {
  // الحيوانات
  Eule:           [{ x: 2.0,  y: 6.0,  w: 12.0, h: 22.0 }],
  Reh:            [{ x: 10.0, y: 35.0, w: 16.0, h: 32.0 }],
  Wolf:           [{ x: 37.0, y: 40.0, w: 12.0, h: 24.0 }],
  Fuchs:          [{ x: 6.0,  y: 65.0, w: 20.0, h: 24.0 }],
  Igel:           [{ x: 37.0, y: 76.0, w: 9.0,  h: 12.0 }],
  Schmetterling:  [{ x: 47.0, y: 56.0, w: 9.0,  h: 14.0 }],
  Frosch:         [{ x: 54.0, y: 80.0, w: 11.0, h: 14.0 }],
  Hase:           [{ x: 59.0, y: 60.0, w: 10.0, h: 16.0 }],
  // الفواكه
  Apfel:          [{ x: 14.0, y: 1.0,  w: 11.0, h: 20.0 }],
  Traube:         [{ x: 25.0, y: 1.0,  w: 10.0, h: 18.0 }],
  Kirsche:        [{ x: 36.0, y: 1.0,  w: 8.0,  h: 14.0 }],
  Banane:         [{ x: 47.0, y: 0.0,  w: 11.0, h: 20.0 }],
  Birne:          [{ x: 59.0, y: 1.0,  w: 9.0,  h: 18.0 }],
  Zitrone:        [{ x: 69.0, y: 1.0,  w: 8.0,  h: 16.0 }],
  Orange:         [{ x: 78.0, y: 1.0,  w: 10.0, h: 18.0 }],
  Erdbeere:       [{ x: 8.0,  y: 86.0, w: 16.0, h: 12.0 }],
  // الخضروات
  Karotte:        [{ x: 65.0, y: 60.0, w: 20.0, h: 14.0 }],
  Tomate:         [{ x: 69.0, y: 70.0, w: 8.0,  h: 12.0 }],
  Kuerbis:        [{ x: 75.0, y: 70.0, w: 14.0, h: 20.0 }],
  Aubergine:      [{ x: 85.0, y: 68.0, w: 9.0,  h: 22.0 }],
  Mais:           [{ x: 91.0, y: 40.0, w: 9.0,  h: 38.0 }],
  Zucchini:       [{ x: 83.0, y: 80.0, w: 13.0, h: 12.0 }],
  Pilz:           [{ x: 0.0,  y: 80.0, w: 14.0, h: 20.0 }],
  Paprika:        [{ x: 91.0, y: 80.0, w: 9.0,  h: 18.0 }],
};

// ═══════════════════════════════════════
// COLOR_OBJECTS - منفصلة عن الكلمات (عشان نتجنب التكرار)
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// Helper function - يجيب الـ boxes الصح حسب القسم
// ═══════════════════════════════════════
function getBoxesForWord(word: string, sectionId: string): Box[] {
  if (sectionId === 'colors') {
    return COLOR_OBJECTS[word] ?? [];
  }
  return FOREST_OBJECTS[word] ?? [];
}

const NAT_W = 1920;
const NAT_H = 1080;
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

function normalizeGerman(s: string): string {
  return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

function compareWords(input: string, target: string): boolean {
  return normalizeGerman(input.trim()) === normalizeGerman(target);
}

type KarlMood = 'idle' | 'happy' | 'sad' | 'celebrate';
type Phase = 'learn' | 'test' | 'section-success' | 'section-fail' | 'all-done';

// ═══════════════════════════════════════
// أصوات
// ═══════════════════════════════════════
function speak(text: string) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE'; u.rate = 0.75; u.pitch = 1.1;
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
// خلفية الغابة المتغيرة حسب القسم
// ═══════════════════════════════════════
function PremiumForestBackground({ section, activeColor }: { section: typeof SECTIONS[0]; activeColor: string }) {
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
              scale: 0, opacity: 0, rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.4, 1] }}
            className="absolute"
            style={{
              width: p.size, height: p.size,
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
          mood === 'celebrate' ? { y: [-12, 0, -12], rotate: [-15, 15, -15], scale: [1, 1.15, 1] }
          : mood === 'happy' ? { y: [-8, 0, -8], rotate: [-8, 8, -8] }
          : mood === 'sad' ? { y: [0, -3, 0], rotate: [-3, 3, -3] }
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
                : 'radial-gradient(circle, #58CC0244, transparent 70%)',
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
              filter: mood === 'celebrate' ? 'drop-shadow(0 8px 20px rgba(255,215,0,0.8))'
                : mood === 'happy' ? 'drop-shadow(0 6px 16px rgba(88,204,2,0.7))'
                : mood === 'sad' ? 'drop-shadow(0 4px 12px rgba(255,107,107,0.5)) saturate(0.6)'
                : 'drop-shadow(0 6px 14px rgba(88,204,2,0.5))',
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
}

// ═══════════════════════════════════════
// Hero Word Display
// ═══════════════════════════════════════
function HeroWordDisplay({ wordData }: { wordData: typeof SECTIONS[0]['words'][0] }) {
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
// Phase 1 — تعلم الكلمة
// ═══════════════════════════════════════
function LearnCardPhase({ wordData, sectionTitle, onDone, onKarlReact, onCombo, onStreak, onStarEarned }: {
  wordData: typeof SECTIONS[0]['words'][0];
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
    const t = setTimeout(() => speak(wordData.word), 500);
    return () => clearTimeout(t);
  }, [wordData.word]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, wordData.word)) {
      setStatus('correct');
      speak(wordData.word);
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
              onClick={() => speak(wordData.word)}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer"
            >
              <HeroWordDisplay wordData={wordData} />
            </motion.div>
            <SoundButton onClick={() => speak(wordData.word)} color={wordData.color} label="استمع للكلمة" />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${wordData.color}aa` }}>
                Wort · {sectionTitle}
              </div>
              <div className="text-2xl font-black text-white">اكتب الكلمة</div>
              <div className="text-sm font-bold text-white/40 mt-1">بالألمانية</div>
            </div>

            <div className="relative">
              {!input && (
                <span
                  className="absolute inset-0 flex items-center justify-center font-black tracking-wider pointer-events-none select-none"
                  style={{
                    fontSize: '1.8rem',
                    color: `${wordData.color}55`,
                    fontFamily: 'monospace',
                    direction: 'ltr',
                    letterSpacing: '0.1em',
                    zIndex: 1,
                    textShadow: `0 0 12px ${wordData.color}33`,
                  }}
                >
                  {wordData.word}
                </span>
              )}
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
                className="relative w-full text-center font-black py-5 rounded-2xl border-2 outline-none transition-all text-white"
                style={{
                  fontSize: '1.8rem',
                  direction: 'ltr',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  borderColor: status === 'correct' ? '#22c55e' : status === 'wrong' ? '#ef4444' : `${wordData.color}55`,
                  boxShadow: status === 'correct' ? '0 0 30px #22c55e66'
                    : status === 'wrong' ? '0 0 30px #ef444466'
                    : `inset 0 1px 0 ${wordData.color}33, 0 8px 30px ${wordData.color}22`,
                  zIndex: 2,
                }}
              />
            </div>

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
  sectionWords: typeof SECTIONS[0]['words'];
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
  // ✅ استخدام الـ helper function الجديدة
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
      speak(currentWord.word);
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
                <button onClick={() => speak(currentWord.word)}
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
function SectionSuccess({ section, onNext, isLast }: { section: typeof SECTIONS[0]; onNext: () => void; isLast: boolean }) {
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
        {isLast ? '🏆 العودة للخريطة' : `${SECTIONS[SECTIONS.indexOf(section) + 1]?.emoji} القسم الجاي`}
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
  const [flyingStars, setFlyingStars] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const [streak, setStreak] = useState(0);
  const starBarRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS[sectionIdx];
  const wordData = section?.words[wordIdx];
  const totalWords = SECTIONS.reduce((a, s) => a + s.words.length, 0);
  const learnedWords = SECTIONS.slice(0, sectionIdx).reduce((a, s) => a + s.words.length, 0) + wordIdx;

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

  const handleWordDone = () => {
    const nextIdx = wordIdx + 1;
    if (nextIdx < section.words.length) setWordIdx(nextIdx);
    else setPhase('test');
  };

  const handleTestPass = () => setPhase('section-success');
  const handleTestFail = () => { setCombo(0); setStreak(0); setPhase('section-fail'); };

  const handleSectionNext = () => {
    if (sectionIdx + 1 < SECTIONS.length) {
      setSectionIdx(i => i + 1); setWordIdx(0); setPhase('learn');
    } else setPhase('all-done');
  };

  const handleRetry = () => { setWordIdx(0); setPhase('learn'); };

  const handleStarEarned = useCallback((x: number, y: number) => {
    setTotalStars(s => s + 1);
    const id = Date.now() + Math.random();
    setFlyingStars(prev => [...prev, { id, startX: x, startY: y }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 900);
  }, []);

  const phaseLabel: Record<Phase, string> = {
    learn: 'تعلم', test: 'اختبار', 'section-success': '🎉', 'section-fail': '😅', 'all-done': '🌳',
  };

  if (!section) return null;

  const activeColor = wordData?.color ?? section.accentColor;

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <PremiumForestBackground section={section} activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} />

      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {flyingStars.map(star => {
            const target = starBarRef.current?.getBoundingClientRect();
            const endX = target ? target.left + target.width / 2 : (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
            const endY = target ? target.top + target.height / 2 : 60;
            return (
              <motion.div
                key={star.id}
                initial={{ x: star.startX - 20, y: star.startY - 20, scale: 1.8, opacity: 1 }}
                animate={{ x: endX - 20, y: endY - 20, scale: 0.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.3, 0.7, 0.4, 1] }}
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
                </svg>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3" style={{ background: 'linear-gradient(to bottom, rgba(7,11,7,0.97) 80%, transparent)' }}>
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
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
            {SECTIONS.map((s, i) => {
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
            <SectionSuccess key="section-success" section={section} onNext={handleSectionNext} isLast={sectionIdx === SECTIONS.length - 1} />
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
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => router.push('/character-and-map?from=lesson')}
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
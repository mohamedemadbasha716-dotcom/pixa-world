'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Sparkles, Volume2, Home, Flame, Gem, RotateCcw, Trophy, Check, X,
  Mic, SkipForward
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';

import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';

import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakWord } from '@/lib/audio/speech';

import { 
  TIME_ITEMS_ALL, 
  TIME_GROUPS, 
  TIME_IMAGES,
  TIME_WORD_IMAGES,
  type TimeItem 
} from '@/data/german/time';

type Phase = 'listen' | 'write' | 'speak' | 'test';
type FlyingItem = { 
  id: number; startX: number; startY: number; endX: number; endY: number;
  type: 'star' | 'energy' | 'gem';
};

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: { transcript: string; confidence: number };
      isFinal: boolean;
    };
    length: number;
  };
}

const TOTAL_ITEMS = TIME_ITEMS_ALL.length;
const TOTAL_ANSWERS_PER_LESSON = TOTAL_ITEMS * 3;

const DARK_COLORS: Record<string, string> = {
  '#FF6B6B': '#8B0000', '#4ECDC4': '#0D5C5A', '#45B7D1': '#0F4C5C',
  '#3498DB': '#1A5276', '#9B59B6': '#4A235A', '#1ABC9C': '#0E6251',
  '#E67E22': '#7E5109', '#E74C3C': '#7B241C', '#16A085': '#0E6251',
  '#2980B9': '#1B4F72', '#8E44AD': '#4A235A', '#F39C12': '#7D6608',
  '#C0392B': '#7B241C', '#5DADE2': '#1A5276', '#48C9B0': '#117864',
  '#AF7AC5': '#6C3483', '#F8C471': '#9C6B0E', '#5B6F8E': '#2C3E50',
};

function getDarkColor(originalColor: string): string {
  if (DARK_COLORS[originalColor]) return DARK_COLORS[originalColor];
  return darkenColor(originalColor, 0.5);
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string): number {
  const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:'"]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').trim();
  const normalA = normalize(a);
  const normalB = normalize(b);
  if (normalB.split(/\s+/).length === 1) {
    if (normalA === normalB) return 1.0;
    if (normalA.includes(normalB) || normalB.includes(normalA)) return 0.8;
    const distance = levenshteinDistance(normalA, normalB);
    const maxLen = Math.max(normalA.length, normalB.length);
    return 1 - (distance / maxLen);
  }
  const wordsA = normalA.split(/\s+/);
  const wordsB = normalB.split(/\s+/);
  const setB = new Set(wordsB);
  let matches = 0;
  for (const word of wordsA) if (setB.has(word)) matches++;
  return matches / Math.max(wordsA.length, wordsB.length);
}

// ═══════════════════════════════════════
// ⏱️ مكون الساعة الديناميكية - بشكل ساعة حائط واقعية جداً
// ═══════════════════════════════════════
function parseTimeFromItem(item: TimeItem) {
  let strToParse = `${item.id} ${item.de}`;
  let matches = strToParse.match(/\d+/g);
  
  if (matches && matches.length >= 1) {
    let h = parseInt(matches[0], 10);
    let m = matches.length >= 2 ? parseInt(matches[1], 10) : 0;
    
    if (strToParse.includes('halb')) {
      m = 30; h -= 1; if(h < 1) h = 12; 
    }
    if (strToParse.includes('viertel nach')) m = 15;
    if (strToParse.includes('viertel vor')) { m = 45; h -= 1; if(h < 1) h = 12; }
    
    return { h, m };
  }
  return null; 
}

function DynamicClock({ item, size }: { item: TimeItem; size: number }) {
  const time = parseTimeFromItem(item);

  if (!time) {
    return <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{item.emoji}</span>;
  }

  const minuteDegrees = time.m * 6;
  const hourDegrees = ((time.h % 12) * 30) + (time.m * 0.5); 
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div style={{ 
      width: size, 
      height: size, 
      filter: `drop-shadow(0 12px 24px ${item.color}77)`,
      position: 'relative'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          {/* تدرج لون إطار الساعة 3D */}
          <linearGradient id={`frame-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* تدرج زجاج الساعة اللامع */}
          <linearGradient id={`glass-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* ظل داخلي للعمق */}
          <filter id={`innerShadow-${item.id}`}>
            <feOffset dx="0" dy="1.5"/>
            <feGaussianBlur stdDeviation="2" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.2" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
        </defs>

        {/* الإطار الخارجي للساعة */}
        <circle cx="50" cy="50" r="48" fill={`url(#frame-${item.id})`} stroke="#64748b" strokeWidth="0.5" />
        
        {/* حلقة لونية تعبر عن الكارت لمسة جمالية */}
        <circle cx="50" cy="50" r="44" fill="none" stroke={item.color} strokeWidth="3" opacity="0.8" />
        
        {/* خلفية الساعة البيضاء مع الظل الداخلي */}
        <circle cx="50" cy="50" r="42" fill="#ffffff" filter={`url(#innerShadow-${item.id})`} />

        {/* نقاط الدقائق */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null; // تخطي مكان أرقام الساعات
          return (
            <line 
              key={`tick-${i}`}
              x1="50" y1="11" x2="50" y2="12.5" 
              stroke="#cbd5e1" strokeWidth="0.8"
              transform={`rotate(${i * 6} 50 50)`} 
            />
          )
        })}

        {/* أرقام الساعة (1 - 12) */}
        {numbers.map((num) => {
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const radius = 33; 
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle) + 3; // +3 لتوسيط النص رأسياً
          return (
            <text 
              key={`num-${num}`} 
              x={x} y={y} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill="#1e293b"
              fontSize="10px"
              fontFamily="Arial Rounded MT Bold, Nunito, sans-serif"
              fontWeight="900"
            >
              {num}
            </text>
          );
        })}

        {/* عقرب الساعات */}
        <g transform={`rotate(${hourDegrees} 50 50)`} style={{ transition: 'transform 1s cubic-bezier(0.4, 2.5, 0.55, 0.9)' }}>
          {/* ظل العقرب */}
          <line x1="49.5" y1="51.5" x2="49.5" y2="28" stroke="rgba(0,0,0,0.15)" strokeWidth="5" strokeLinecap="round" />
          {/* العقرب نفسه */}
          <line x1="50" y1="56" x2="50" y2="27" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* عقرب الدقائق */}
        <g transform={`rotate(${minuteDegrees} 50 50)`} style={{ transition: 'transform 1s cubic-bezier(0.4, 2.5, 0.55, 0.9)' }}>
          {/* ظل العقرب */}
          <line x1="49.5" y1="51.5" x2="49.5" y2="15" stroke="rgba(0,0,0,0.15)" strokeWidth="3" strokeLinecap="round" />
          {/* العقرب نفسه */}
          <line x1="50" y1="58" x2="50" y2="14" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* عقرب الثواني الأحمر الكلاسيكي */}
        <g transform="rotate(0 50 50)">
          <line x1="50" y1="62" x2="50" y2="12" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="3.5" fill="#ef4444" />
          <circle cx="50" cy="50" r="1.5" fill="#ffffff" />
        </g>
        
        {/* النقطة المركزية النهائية */}
        <circle cx="50" cy="50" r="5" fill="none" stroke="#0f172a" strokeWidth="1" />

        {/* تأثير انعكاس الزجاج على الساعة */}
        <path 
          d="M 12 50 A 38 38 0 0 1 88 50 C 88 25 70 12 50 12 C 30 12 12 25 12 50 Z" 
          fill={`url(#glass-${item.id})`}
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}
// ═══════════════════════════════════════

function useIsMobile(breakpoint: number = 1024): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

function useKeyboardOpen(): boolean {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const initialHeight = window.visualViewport.height;
    const threshold = 150;
    const handleResize = () => {
      if (!window.visualViewport) return;
      setIsOpen(initialHeight - window.visualViewport.height > threshold);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);
  return isOpen;
}

type GameStats = {
  points: number; streak: number; gems: number; level: number;
  energy: number; hints: number; levelProgress: number;
};

function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    points: 1250, streak: 7, gems: 35, level: 4, energy: 5, hints: 3, levelProgress: 0,
  });
  const addPoints = (n: number) => setStats(s => ({ ...s, points: s.points + n }));
  const incStreak = () => setStats(s => ({ ...s, streak: s.streak + 1 }));
  const resetStreak = () => setStats(s => ({ ...s, streak: 0 }));
  const addGems = (n: number) => setStats(s => ({ ...s, gems: s.gems + n }));
  const useHint = () => setStats(s => ({ ...s, hints: Math.max(0, s.hints - 1) }));
  const addStar = () => setStats(s => ({ ...s, points: s.points + 10 }));
  const addLevelProgress = () => setStats(s => {
    const increment = 100 / TOTAL_ANSWERS_PER_LESSON;
    return { ...s, levelProgress: Math.min(100, s.levelProgress + increment) };
  });
  return { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress };
}

function generateItemChoices(correctId: string, allItems: TimeItem[], count: number = 3): TimeItem[] {
  const correct = allItems.find(i => i.id === correctId)!;
  const others = allItems.filter(i => i.id !== correctId);
  const shuffled = others.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correct];
  return choices.sort(() => Math.random() - 0.5);
}

function shuffleWordLetters(word: string): string[] {
  const letters = word.split('');
  let shuffled = [...letters];
  let attempts = 0;
  while (shuffled.join('') === word && attempts < 10) {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGroupBackground(groupIdx: number, isMobile: boolean): string {
  const suffix = isMobile ? 'mob' : 'pc';
  const groupNum = Math.min(groupIdx + 1, 3);
  return `/card-image/numbers-group${groupNum}-${suffix}.webp`;
}

function ScreenBackground({ groupIdx, isMobile, activeColor }: { 
  groupIdx: number; isMobile: boolean; activeColor: string;
}) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    if (isMobile) return;
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 10,
      size: 2 + Math.random() * 8, duration: 12 + Math.random() * 10,
    }));
    setParticles(p);
  }, [isMobile, groupIdx]);

  const bgImage = getGroupBackground(groupIdx, isMobile);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'saturate(1.1)' }} />
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, rgba(15,52,96,0.35) 0%, rgba(30,100,180,0.2) 40%, rgba(83,52,131,0.2) 60%, rgba(15,52,96,0.35) 100%)`,
      }} />
      <motion.div className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      {!isMobile && particles.map(p => (
        <motion.div key={`${groupIdx}-${p.id}`} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: -20, width: p.size, height: p.size,
            background: `radial-gradient(circle, ${activeColor}cc, transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}88`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }} />
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div key={`star-${groupIdx}-${i}`} className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`,
            width: 1.5 + Math.random() * 1.5, height: 1.5 + Math.random() * 1.5,
            background: 'white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity }} />
      ))}
    </div>
  );
}

function Stepper({ currentStep, totalSteps, isMobile }: {
  currentStep: number; totalSteps: number; isMobile: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const isLocked = i > currentStep;
        const stepNum = i + 1;
        return (
          <div key={i} className="flex items-center">
            <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                height: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                background: isActive ? 'linear-gradient(135deg, #3498DB, #1A5276)'
                  : isDone ? 'linear-gradient(135deg, #58CC02, #4AA802)' : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#3498DB' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(52,152,219,0.6)' : isDone ? '0 0 6px rgba(88,204,2,0.4)' : 'none',
              }}>
              {isLocked ? '🔒' : isDone ? '✓' : stepNum}
            </motion.div>
            {i < totalSteps - 1 && (
              <div className={`${isMobile ? 'w-1' : 'w-3 md:w-4'} h-0.5`} style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TopHUD({ stats, level, currentStep, totalSteps, onHome, isMobile }: {
  stats: GameStats; level: number; currentStep: number; totalSteps: number;
  onHome: () => void; isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-30 px-2" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2px)' }}>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.1 }} className="relative w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: '#3498DB', boxShadow: '0 0 10px rgba(52,152,219,0.5)', background: 'linear-gradient(135deg, #3498DB, #1A5276)' }}>
              <img src="/characters/karl-3d.webp" alt="character" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #3498DB, #1A5276)' }}
                    animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
            <motion.div key={`points-${stats.points}`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,215,0,0.35)' }}>
              <img id="star-target" src="/treasuer/star.webp" alt="star" className="w-3 h-3 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.points}</span>
            </motion.div>
            <motion.div key={`streak-${stats.streak}`} animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,77,109,0.35)' }}>
              <Flame size={12} className="text-orange-400 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.streak}</span>
            </motion.div>
            <motion.div key={`gems-${stats.gems}`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(157,78,221,0.35)' }}>
              <Gem id="gem-target" size={12} className="text-purple-300 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.gems}</span>
            </motion.div>
          </div>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Home size={14} className="text-white" />
          </motion.button>
        </div>
        <div className="flex justify-center" style={{ marginTop: '2.5px' }}>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
            style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6 pt-3 md:pt-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1 }} className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: '#3498DB', boxShadow: '0 0 15px rgba(52,152,219,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', background: 'linear-gradient(135deg, #3498DB, #1A5276)' }}>
            <img src="/characters/karl-3d.webp" alt="character" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] md:text-[10px] font-bold text-white/80 mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm md:text-base text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{level}</span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right, #3498DB, #1A5276)' }}
                  animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={false} />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div key={`gems-${stats.gems}`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(157,78,221,0.35)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{stats.gems}</span>
            <Gem id="gem-target" size={18} className="text-purple-300" style={{ filter: 'drop-shadow(0 0 6px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
          </motion.div>
          <motion.div key={`streak-${stats.streak}`} animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255,77,109,0.35)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <div className="flex flex-col leading-none items-center">
              <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{stats.streak}</span>
              <span className="text-[7px] md:text-[8px] text-orange-200/90 font-bold mt-0.5">سلسلة</span>
            </div>
            <Flame size={18} className="text-orange-400" style={{ filter: 'drop-shadow(0 0 6px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
          </motion.div>
          <motion.div key={stats.points} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255,215,0,0.35)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{stats.points}</span>
            <img id="star-target" src="/treasuer/star.webp" alt="star" className="w-5 h-5 md:w-6 md:h-6" style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
          </motion.div>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <Home size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function FlyingItems({ items }: { items: FlyingItem[] }) {
  return (
    <>
      {items.map(item => {
        const dx = item.endX - item.startX;
        const dy = item.endY - item.startY;
        const midX1 = dx * 0.2, midY1 = dy * 0.3 - 150;
        const midX2 = dx * 0.7, midY2 = dy * 0.6 - 80;
        const color = item.type === 'star' ? '#FFD700' : item.type === 'energy' ? '#3498DB' : '#9D4EDD';
        return (
          <div key={item.id} className="fixed pointer-events-none z-[60]" style={{ left: item.startX, top: item.startY }}>
            {[0, 1, 2, 3].map(i => (
              <motion.div key={`trail-${i}`} className="absolute rounded-full"
                style={{ width: 6, height: 6, background: color, boxShadow: `0 0 12px ${color}`, top: 0, left: 0 }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0], opacity: [0, 0.8, 0],
                  x: [0, midX1 + (i * 5), midX2 + (i * 8), dx],
                  y: [0, midY1 + (i * 8), midY2 + (i * 5), dy],
                }}
                transition={{ duration: 1.4, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }} />
            ))}
            <motion.div className="absolute rounded-full pointer-events-none"
              style={{ width: 60, height: 60, background: `radial-gradient(circle, ${color}88, transparent 70%)`, top: -25, left: -25 }}
              initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 2, 3], opacity: [1, 0.6, 0] }}
              transition={{ duration: 0.5, ease: 'easeOut' }} />
            <motion.div initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.8, 1.5, 1.2, 1.0, 1.6, 0],
                opacity: [0, 1, 1, 1, 1, 1, 0],
                x: [0, 0, midX1, midX2, dx, dx, dx],
                y: [0, -20, midY1, midY2, dy, dy, dy],
                rotate: [0, -15, 180, 360, 540, 720, 720],
              }}
              transition={{ duration: 1.4, times: [0, 0.1, 0.25, 0.55, 0.85, 0.95, 1], ease: [0.25, 0.46, 0.45, 0.94] }}>
              <div className="relative" style={{ width: 40, height: 40, marginTop: -20, marginLeft: -20 }}>
                <div className="absolute inset-0 rounded-full blur-xl" style={{ background: color, opacity: 0.8, transform: 'scale(2.5)' }} />
                <div className="relative flex items-center justify-center w-full h-full">
                  {item.type === 'star' && (<img src="/treasuer/star.webp" alt="star" className="w-10 h-10" style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />)}
                  {item.type === 'energy' && (<img src="/treasuer/energy.webp" alt="energy" className="w-10 h-10" style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />)}
                  {item.type === 'gem' && (<Gem size={36} className="text-purple-200" fill="#9D4EDD" style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />)}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </>
  );
}

function FloatingIconButton({ label, color, isMobile, onClick, badge, disabled, iconSrc, iconAlt }: {
  label: string; color: string; isMobile: boolean;
  onClick?: () => void; badge?: number; disabled?: boolean;
  iconSrc: string; iconAlt: string;
}) {
  return (
    <motion.button whileHover={!disabled ? { scale: 1.1, y: -2 } : {}} whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick} disabled={disabled} className="flex flex-col items-center gap-0.5 disabled:opacity-70">
      <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
        <img src={iconSrc} alt={iconAlt} className="w-full h-full object-contain" style={{ filter: `drop-shadow(0 2px 8px ${color}aa) drop-shadow(0 0 4px ${color}66)` }} />
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black text-white border"
            style={{ background: '#FF4D6D', borderColor: 'rgba(15,10,45,0.95)', boxShadow: '0 2px 6px rgba(255,77,109,0.6)' }}>
            {badge}
          </div>
        )}
      </div>
      <span className="text-[7px] md:text-[9px] font-black leading-none" style={{ color: color, textShadow: `0 1px 3px rgba(0,0,0,0.8)` }}>{label}</span>
    </motion.button>
  );
}

function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  const treasureImg = `/treasuer/${treasureState}.webp`;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1 md:pb-1.5 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'w-full max-w-[1400px]'}`}>
        <div className="relative rounded-xl px-3 md:px-6 py-1 md:py-1.5"
          style={{
            background: 'linear-gradient(135deg, rgba(20,15,55,0.85) 0%, rgba(15,10,45,0.9) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(52,152,219,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}>
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-cyan-300" />
            <span className="text-[8px] md:text-[9px] font-black text-cyan-200 tracking-wider uppercase">مكافآت الإنجاز</span>
            <Sparkles size={8} className="text-cyan-300" />
          </div>
          <div className="flex items-end justify-around gap-2 md:gap-3">
            <FloatingIconButton onClick={onMap} label="خريطة" color="#3498DB" isMobile={isMobile} iconSrc="/treasuer/map-icon.webp" iconAlt="map" />
            <FloatingIconButton label="نجوم" color="#FFD700" isMobile={isMobile} disabled iconSrc="/treasuer/star.webp" iconAlt="star" />
            <motion.div id="treasure-box" whileHover={{ scale: 1.08, y: -2 }}
              animate={treasureState === 'opend' ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
              className="flex flex-col items-center gap-0.5 cursor-pointer">
              <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center relative">
                <img src={treasureImg} alt="treasure" className="w-full h-full object-contain"
                  style={{ filter: treasureState === 'opend' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
                {treasureState === 'opend' && (
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.5), transparent 70%)' }} />
                )}
              </div>
              <span className="text-[7px] md:text-[9px] font-black text-yellow-400 leading-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>صندوق</span>
            </motion.div>
            <FloatingIconButton label="طاقة" color="#3498DB" isMobile={isMobile} disabled iconSrc="/treasuer/energy.webp" iconAlt="energy" />
            <FloatingIconButton onClick={onHint} label="تلميح" color="#FFD700" isMobile={isMobile} badge={stats.hints} disabled={stats.hints === 0} iconSrc="/treasuer/HINT.svg" iconAlt="hint" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SoundButton({ onClick, color, label, size = 40 }: { 
  onClick: () => void; color: string; label?: string; size?: number; 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = () => {
    setIsPlaying(true); onClick();
    setTimeout(() => setIsPlaying(false), 1500);
  };
  if (label) {
    return (
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white"
        style={{ background: `linear-gradient(135deg, ${color}cc, ${color}88)`, boxShadow: `0 4px 15px ${color}66`, border: `1px solid ${color}` }}>
        <Volume2 size={16} /><span>{label}</span>
      </motion.button>
    );
  }
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClick}
      className="rounded-full flex items-center justify-center border-2 relative flex-shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, #3498DB, #1A5276)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(52,152,219,0.6), 0 0 25px rgba(52,152,219,0.4)`,
      }}>
      {isPlaying && [0, 0.2, 0.4].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: '#3498DB' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }} />
      ))}
      <Volume2 size={size * 0.4} className="text-white" />
    </motion.button>
  );
}

// ═══════════════════════════════════════
// HeroItemDisplay - عرض الساعة الديناميكية 3D
// ═══════════════════════════════════════
function HeroItemDisplay({ item, isMobile, showWord = false }: { 
  item: TimeItem; isMobile?: boolean; showWord?: boolean;
}) {
  const size = isMobile ? 180 : 280;
  const imgSrc = showWord ? TIME_WORD_IMAGES[item.de] : TIME_IMAGES[item.id];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-8 rounded-3xl blur-3xl"
        style={{ background: `radial-gradient(circle, ${item.color}66, transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full select-none flex flex-col items-center justify-center"
        style={{ filter: `drop-shadow(0 10px 25px ${item.color}99) drop-shadow(0 0 30px ${item.color}66)` }}>
        
        {imgSrc ? (
          <img src={imgSrc} alt={item.de} className="w-full h-full object-contain" draggable={false} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl p-4"
            style={{
              background: `linear-gradient(180deg, ${item.gradient[0]}, ${item.gradient[1]})`,
              border: `3px solid ${item.color}`,
              boxShadow: `inset 0 2px 10px rgba(255,255,255,0.2)`,
            }}>
            {/* 🆕 استخدام الساعة الديناميكية الواقعية */}
            <DynamicClock item={item} size={isMobile ? 110 : 180} />

            {showWord && (
              <>
                <div className={`font-black text-white mt-4 ${isMobile ? 'text-lg' : 'text-3xl'} text-center`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                  {item.article && <span className="text-white/70 text-sm mr-1">{item.article}</span>}
                  {item.de}
                </div>
                <div className={`font-bold text-white/85 mt-1 ${isMobile ? 'text-sm' : 'text-base'}`}>{item.ar}</div>
              </>
            )}
          </div>
        )}
      </motion.div>
      {[
        { x: '0%', y: '5%', delay: 0, size: 14 },
        { x: '95%', y: '10%', delay: 0.5, size: 12 },
        { x: '-2%', y: '85%', delay: 1, size: 13 },
        { x: '97%', y: '88%', delay: 1.5, size: 11 },
      ].map((star, i) => (
        <motion.div key={i} className="absolute pointer-events-none z-20" style={{ left: star.x, top: star.y }}
          initial={{ scale: 0 }} animate={{ scale: [0, 1, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}>
          <Sparkles size={star.size} style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color})` }} />
        </motion.div>
      ))}
    </div>
  );
}

function ItemChoiceMobile({ item, allItems, onCorrect, onWrong }: {
  item: TimeItem; allItems: TimeItem[];
  onCorrect: (clientX: number, clientY: number) => void;
  onWrong: () => void;
}) {
  const [choices, setChoices] = useState<TimeItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');
  const choiceRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setChoices(generateItemChoices(item.id, allItems, 3));
    setHiddenIds(new Set()); setWrongId(null); setStatus('idle');
  }, [item.id, allItems]);

  const handleChoice = (choice: TimeItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenIds.has(choice.id)) return;
    if (choice.id === item.id) {
      setHiddenIds(prev => new Set(prev).add(choice.id));
      setStatus('correct');
      onCorrect(e.clientX, e.clientY);
    } else {
      setWrongId(choice.id);
      playBuzzSound(); onWrong();
      setTimeout(() => setWrongId(null), 600);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-3 rounded-[1.5rem] relative overflow-hidden"
      style={{
        background: 'rgba(20,15,55,0.55)',
        backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${item.color}33`,
      }}>
      <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}33, transparent 60%)` }} />
      <div className="relative z-10 flex flex-col items-center gap-2.5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', border: `2px solid ${item.color}66`, boxShadow: `0 4px 15px ${item.color}44` }}>
          <span className="font-black text-xs text-gray-800">استمع جيداً واختر الساعة</span>
        </motion.div>
        
        <div className="bg-white/10 px-4 py-1 rounded-xl border border-white/20">
          <span className="font-black text-cyan-300 text-base">{item.ar}</span>
        </div>

        <HeroItemDisplay item={item} isMobile showWord />
        <SoundButton onClick={() => speakWord(item.de)} color={item.color} size={45} />
        <div className="flex items-center gap-1.5">
          <span className="font-black text-white text-xs">اختر الساعة الصحيحة</span>
          <span className="text-sm">👇</span>
        </div>
        <div className="flex items-center justify-center gap-2.5 w-full" dir="ltr">
          {choices.map((choice, idx) => {
            const isHidden = hiddenIds.has(choice.id);
            const isWrong = wrongId === choice.id;
            return (
              <AnimatePresence key={`${item.id}-${choice.id}-${idx}`} mode="wait">
                {!isHidden && (
                  <motion.button ref={el => { choiceRefs.current[choice.id] = el; }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleChoice(choice, e)}
                    disabled={status === 'correct' || isWrong}
                    className="relative rounded-xl flex flex-col items-center justify-center flex-shrink-0 overflow-hidden border-2 p-1"
                    style={{
                      width: 90, height: 110,
                      background: isWrong ? 'linear-gradient(145deg, #FF4444, #CC0000)' : `linear-gradient(145deg, ${choice.gradient[0]}, ${choice.gradient[1]})`,
                      borderColor: isWrong ? '#FF4444' : `${choice.color}`,
                      boxShadow: isWrong ? '0 5px 18px rgba(255,68,68,0.6)' : `0 5px 18px ${choice.color}55`,
                    }}>
                    <DynamicClock item={choice} size={55} />
                    
                    <span className="text-[10px] font-black text-white mt-2 leading-tight text-center">
                      {choice.de}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>
        <AnimatePresence>
          {status === 'correct' && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 font-black text-xs py-1 px-3 rounded-xl"
              style={{ background: 'rgba(88,204,2,0.3)', color: '#58CC02', border: '1.5px solid #58CC0288' }}>
              <Check size={12} /> ممتاز!
            </motion.div>
          )}
          {wrongId !== null && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 font-black text-xs py-1 px-3 rounded-xl"
              style={{ background: 'rgba(255,68,68,0.3)', color: '#FF6B6B', border: '1.5px solid #FF444488' }}>
              <X size={12} /> جرب تاني
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function WordBuilderMobile({ item, onComplete, onWrong }: {
  item: TimeItem; onComplete: (clientX: number, clientY: number) => void; onWrong: () => void;
}) {
  const word = item.de;
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const darkColor = useMemo(() => getDarkColor(item.color), [item.color]);

  useEffect(() => {
    setShuffledLetters(shuffleWordLetters(word));
    setPlacedIndices([]); setWrongShake(null); setIsComplete(false);
  }, [word]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete || placedIndices.includes(idx)) return;
    const nextExpectedLetter = word[placedIndices.length];
    if (letter.toLowerCase() === nextExpectedLetter.toLowerCase()) {
      setPlacedIndices(prev => [...prev, idx]);
      playCoinSound();
      if (placedIndices.length + 1 === word.length) {
        setIsComplete(true);
        speakWord(word);
        setTimeout(() => { onComplete(e.clientX, e.clientY); }, 600);
      }
    } else {
      setWrongShake(idx); playBuzzSound(); onWrong();
      setTimeout(() => setWrongShake(null), 600);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-3 rounded-[1.5rem] relative overflow-hidden"
      style={{
        background: 'rgba(20,15,55,0.45)',
        backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${item.color}33`,
      }}>
      <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}33, transparent 60%)` }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="px-3 py-1.5 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', border: `2px solid ${item.color}66`, boxShadow: `0 4px 15px ${item.color}44` }}>
          <span className="font-black text-xs text-gray-800">رتّب الحروف لتكوّن الكلمة</span>
        </motion.div>
        
        <HeroItemDisplay item={item} isMobile showWord={false} />
        
        <div className="text-center mt-1 px-4 py-1 rounded-xl bg-white/10 border border-white/20">
          <div className="font-black text-base text-cyan-300">{item.ar}</div>
        </div>

        <SoundButton onClick={() => speakWord(word)} color={item.color} size={38} />
        
        <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
          {word.split('').map((letter, idx) => {
            const isFilled = idx < placedIndices.length;
            return (
              <motion.div key={`slot-${idx}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isFilled ? [0.8, 1.15, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden"
                style={{
                  width: 30, height: 38,
                  background: isFilled ? `linear-gradient(145deg, ${item.gradient[0]}, ${item.gradient[1]})` : 'rgba(255,255,255,0.05)',
                  borderColor: isFilled ? item.color : `${item.color}55`,
                  borderStyle: isFilled ? 'solid' : 'dashed',
                  boxShadow: isFilled ? `0 4px 12px ${item.color}aa` : 'none',
                }}>
                {!isFilled && (
                  <span className="font-black absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ fontSize: '1.1rem', lineHeight: 1, color: item.color, opacity: 0.25 }}>{letter}</span>
                )}
                {isFilled && (
                  <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    className="font-black text-white relative z-10"
                    style={{ fontSize: '1.2rem', lineHeight: 1, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>{letter}</motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
          {shuffledLetters.map((letter, idx) => {
            const isPlaced = placedIndices.includes(idx);
            const isShaking = wrongShake === idx;
            return (
              <AnimatePresence key={`shuffled-${idx}`} mode="wait">
                {!isPlaced && (
                  <motion.button initial={{ scale: 0, opacity: 0 }}
                    animate={isShaking ? { x: [-6, 6, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={isShaking ? { duration: 0.4 } : { delay: idx * 0.05, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleLetterClick(letter, idx, e)} disabled={isComplete}
                    className="rounded-lg flex items-center justify-center flex-shrink-0 border-2"
                    style={{
                      width: 36, height: 36,
                      background: isShaking ? 'linear-gradient(145deg, #FF4444, #CC0000)' : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.95))',
                      borderColor: isShaking ? '#FF4444' : `${item.color}aa`,
                      boxShadow: isShaking ? '0 4px 15px rgba(255,68,68,0.6)' : `0 4px 14px ${item.color}55`,
                    }}>
                    <span className="font-black"
                      style={{
                        fontSize: '1.2rem', lineHeight: 1,
                        color: isShaking ? 'white' : darkColor,
                        textShadow: isShaking ? '0 2px 6px rgba(0,0,0,0.4)' : 'none',
                      }}>{letter}</span>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>
        <AnimatePresence>
          {isComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 font-black text-sm py-1.5 px-4 rounded-xl mt-1"
              style={{ background: 'rgba(88,204,2,0.3)', color: '#58CC02', border: '2px solid #58CC0288' }}>
              <Check size={14} /> ممتاز! 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ListenPhase({ item, allItems, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  item: TimeItem; allItems: TimeItem[]; onDone: () => void;
  onKarlReact: (mood: KarlMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void; isMobile: boolean;
}) {
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [choices, setChoices] = useState<TimeItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');

  useEffect(() => {
    setChoices(generateItemChoices(item.id, allItems, 3));
    setHiddenIds(new Set()); setWrongId(null); setStatus('idle');
    const t = setTimeout(() => { speakWord(item.de); }, 500);
    return () => clearTimeout(t);
  }, [item.id, allItems]);

  const handleMobileCorrect = (cx: number, cy: number) => {
    speakWord(item.de);
    playCoinSound(); onCombo(); onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy); setTimeout(onDone, 1400);
  };

  const handleMobileWrong = () => { onKarlReact('sad'); };

  const handleDesktopChoice = (choice: TimeItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenIds.has(choice.id)) return;
    if (choice.id === item.id) {
      setHiddenIds(prev => new Set(prev).add(choice.id));
      setStatus('correct');
      speakWord(item.de);
      playCoinSound(); onCombo(); onKarlReact('happy');
      setConfettiPos({ x: e.clientX, y: e.clientY }); setConfettiTrigger(t => t + 1);
      onCorrect(e.clientX, e.clientY); setTimeout(onDone, 1400);
    } else {
      setWrongId(choice.id); playBuzzSound(); onKarlReact('sad');
      setTimeout(() => setWrongId(null), 600);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={item.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`listen-${item.id}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto">
        {isMobile ? (
          <ItemChoiceMobile item={item} allItems={allItems} onCorrect={handleMobileCorrect} onWrong={handleMobileWrong} />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <HeroItemDisplay item={item} showWord />
              <SoundButton onClick={() => speakWord(item.de)} color={item.color} label="استمع للكلمة" />
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${item.color}aa` }}>Hören · استماع</div>
                
                <div className="text-2xl font-black text-cyan-300 bg-white/5 inline-block px-4 py-1 rounded-xl mb-2">
                  {item.ar}
                </div>
                
                <div className="text-sm font-bold text-white/60">اختر الصورة الصحيحة</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {choices.map((choice, idx) => {
                  const isHidden = hiddenIds.has(choice.id);
                  const isWrong = wrongId === choice.id;
                  return (
                    <AnimatePresence key={`${item.id}-${choice.id}-${idx}`} mode="wait">
                      {!isHidden && (
                        <motion.button initial={{ scale: 0, opacity: 0 }}
                          animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                          whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleDesktopChoice(choice, e)}
                          disabled={status === 'correct' || isWrong}
                          className="relative rounded-2xl flex flex-col items-center justify-center min-h-[160px] overflow-hidden border-2 p-2"
                          style={{
                            background: isWrong ? 'linear-gradient(145deg, #FF4444, #CC0000)' : `linear-gradient(145deg, ${choice.gradient[0]}, ${choice.gradient[1]})`,
                            borderColor: isWrong ? '#FF4444' : choice.color,
                            boxShadow: isWrong ? '0 5px 18px rgba(255,68,68,0.6)' : `0 8px 24px ${choice.color}66`,
                          }}>
                          
                          <DynamicClock item={choice} size={75} />
                          
                          <span className="font-black text-white text-sm mt-4 text-center leading-tight">
                            {choice.de}
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>
              <AnimatePresence>
                {status === 'correct' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                    style={{ background: 'rgba(34,197,94,0.18)', color: '#22c55e', border: '1px solid #22c55e44' }}>
                    ✅ ممتاز!
                  </motion.div>
                )}
                {wrongId !== null && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                    style={{ background: 'rgba(239,68,68,0.18)', color: '#ef4444', border: '1px solid #ef444444' }}>
                    ❌ جرب تاني
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

function WritePhase({ item, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  item: TimeItem; onDone: () => void;
  onKarlReact: (mood: KarlMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(item.de);

  useEffect(() => { setInput(''); setStatus('idle'); }, [item.id]);

  const handleMobileComplete = (cx: number, cy: number) => {
    playCoinSound(); onCombo(); onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy); setTimeout(onDone, 1400);
  };

  const handleMobileWrong = () => { onKarlReact('sad'); };

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim().toLowerCase() === item.de.toLowerCase()) {
      setStatus('correct'); speakWord(item.de);
      playCoinSound(); onCombo(); onKarlReact('happy');
      let cx = 0, cy = 0;
      if (e) { cx = e.clientX; cy = e.clientY; }
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      }
      setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
      onCorrect(cx, cy); setTimeout(onDone, 1000);
    } else {
      setStatus('wrong'); playBuzzSound(); onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleSpecialChar = (c: string) => {
    setInput(prev => prev + c); setStatus('idle'); inputRef.current?.focus();
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={item.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`write-${item.id}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto">
        {isMobile ? (
          <WordBuilderMobile item={item} onComplete={handleMobileComplete} onWrong={handleMobileWrong} />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <HeroItemDisplay item={item} showWord />
              <SoundButton onClick={() => speakWord(item.de)} color={item.color} label="استمع للكلمة" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${item.color}aa` }}>Wort · بالألمانية</div>
                <div className="text-2xl font-black text-white">اكتب الكلمة</div>
                <div className="text-xl font-bold text-cyan-300 mt-2 bg-white/5 inline-block px-4 py-1 rounded-xl border border-white/10">{item.ar}</div>
              </div>
              <GhostInput ref={inputRef} value={input}
                onChange={v => { setInput(v); setStatus('idle'); }} onEnter={handleCheck}
                ghostText={item.de} color={item.color} status={status} fontSize="1.8rem" />
              {requiredChars.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">💡 الحروف الخاصة</p>
                  <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={item.color} />
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
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                  boxShadow: `0 8px 30px ${item.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  borderBottom: `4px solid ${item.color}77`,
                }}>
                تحقق ✓
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

function SpeakingPractice({ item, isMobile, onSuccess, onSkip }: {
  item: TimeItem; isMobile: boolean;
  onSuccess: (clientX: number, clientY: number) => void; onSkip: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'try-again' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const targetWord = item.de;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results[0];
      let bestMatch = ''; let bestScore = 0;
      for (let i = 0; i < (results as any).length; i++) {
        const text = (results as any)[i].transcript.toLowerCase().trim();
        const score = similarityScore(text, targetWord.toLowerCase());
        if (score > bestScore) { bestScore = score; bestMatch = text; }
      }
      setTranscript(bestMatch); setIsListening(false);
      if (bestScore >= 0.65) {
        setStatus('success'); playCoinSound();
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        if (micButtonRef.current) {
          const rect = micButtonRef.current.getBoundingClientRect();
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
        setTimeout(() => onSuccess(cx, cy), 1500);
      } else {
        setStatus('try-again'); playBuzzSound(); setAttempts(a => a + 1);
      }
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') setStatus('error');
      else if (event.error !== 'no-speech') { setStatus('try-again'); setAttempts(a => a + 1); }
      else setStatus('idle');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [targetWord, onSuccess]);

  const handleStart = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript(''); setStatus('listening'); setIsListening(true);
    try { recognitionRef.current.start(); }
    catch { setIsListening(false); setStatus('error'); }
  };

  if (!supported) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto p-6 rounded-3xl border-2 text-center"
        style={{ background: 'rgba(255,107,107,0.1)', borderColor: 'rgba(255,107,107,0.3)' }}>
        <div className="text-5xl mb-3">😅</div>
        <h3 className="text-xl font-black text-white mb-2">المتصفح بتاعك مش بيدعم النطق</h3>
        <p className="text-white/60 text-sm mb-4">جرب تستخدم Chrome أو Edge</p>
        <button onClick={onSkip} className="px-8 py-3 rounded-2xl font-black text-white"
          style={{ background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` }}>
          تخطي ⏭️
        </button>
      </motion.div>
    );
  }

  if (isMobile) {
    return (
      <motion.div key={`speak-${item.id}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-2xl mx-auto">
        <div className="mx-auto rounded-[1.5rem] relative overflow-hidden p-3 max-w-md"
          style={{
            background: 'rgba(20,15,55,0.55)',
            backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${item.color}33`,
          }}>
          <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}33, transparent 60%)` }} />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="text-center">
              <h3 className="font-black text-white text-base flex items-center justify-center gap-1.5">
                <span>انطق الكلمة</span>
                <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-xl">🎤</motion.span>
              </h3>
              <p className="text-white/60 font-bold text-[10px] mt-0.5">اضغط على المايك واتكلم بوضوح</p>
            </div>
            <HeroItemDisplay item={item} isMobile showWord />
            <button onClick={() => speakWord(targetWord)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-all font-bold px-4 py-1.5 text-xs">
              <Volume2 size={12} /> اسمع النطق الصح
            </button>
            <motion.button ref={micButtonRef}
              whileHover={!isListening ? { scale: 1.05 } : {}} whileTap={!isListening ? { scale: 0.95 } : {}}
              onClick={handleStart} disabled={isListening || status === 'success'}
              className="relative rounded-full flex items-center justify-center transition-all flex-shrink-0 w-16 h-16"
              style={{
                background: status === 'success' ? 'linear-gradient(135deg, #58CC02, #096A02)'
                  : isListening ? 'linear-gradient(135deg, #FF4444, #C70039)'
                  : `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                boxShadow: isListening ? '0 0 60px rgba(255,68,68,0.6)' : `0 10px 40px ${item.color}66`,
              }}>
              {isListening && [0, 0.3, 0.6].map((delay, i) => (
                <motion.div key={i} className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#FF4444' }}
                  initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, delay, repeat: Infinity, ease: 'easeOut' }} />
              ))}
              {status === 'success' ? <Check size={30} className="text-white" strokeWidth={3} /> : <Mic size={30} className="text-white" />}
            </motion.button>
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.div key="transcript" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                  <p className="text-white/40 font-bold mb-0.5 text-[10px]">سمعتك بتقول:</p>
                  <p className="font-black text-white text-sm" style={{ direction: 'ltr' }}>"{transcript}"</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {status === 'listening' && <motion.p key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-black text-red-400 text-xs">🎙️ بسمعك دلوقتي...</motion.p>}
              {status === 'success' && <motion.p key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="font-black text-green-400 text-base">✅ نطق ممتاز! 🌟</motion.p>}
              {status === 'try-again' && <motion.p key="try-again" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-yellow-400 text-xs">😊 قريب! حاول تاني بصوت أوضح</motion.p>}
              {status === 'error' && <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-red-400 text-xs">❌ لازم تسمح للموقع باستخدام المايك</motion.p>}
              {status === 'idle' && <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-white/40 text-[10px]">اضغط على المايك وابدأ تتكلم</motion.p>}
            </AnimatePresence>
            {(attempts >= 2 || status === 'error') && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                <button onClick={onSkip}
                  className="flex items-center gap-2 rounded-2xl font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all px-4 py-2 text-xs">
                  <SkipForward size={14} /> تخطي وكمل
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key={`speak-${item.id}`}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3 flex flex-col items-center gap-4">
          <HeroItemDisplay item={item} showWord />
        </div>
        <div className="lg:col-span-2">
          <div className="relative rounded-[1.8rem] p-6 overflow-hidden"
            style={{
              background: 'rgba(20,15,55,0.55)',
              backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${item.color}33`,
            }}>
            <div className="absolute inset-0 pointer-events-none rounded-[1.8rem]"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}33, transparent 60%)` }} />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="text-center w-full">
                <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: `${item.color}cc` }}>Sprechen · النطق</div>
                <div className="text-2xl font-black text-white flex items-center gap-2 justify-center">
                  <span>انطق الكلمة</span>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-2xl">🎤</motion.span>
                </div>
                <div className="text-xs font-bold text-white/50 mt-1">اضغط على المايك واتكلم بوضوح</div>
              </div>
              <button onClick={() => speakWord(targetWord)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-all font-bold px-4 py-2 text-xs">
                <Volume2 size={14} /> اسمع النطق الصح
              </button>
              <motion.button ref={micButtonRef}
                whileHover={!isListening ? { scale: 1.05 } : {}} whileTap={!isListening ? { scale: 0.95 } : {}}
                onClick={handleStart} disabled={isListening || status === 'success'}
                className="relative rounded-full flex items-center justify-center transition-all flex-shrink-0 w-24 h-24"
                style={{
                  background: status === 'success' ? 'linear-gradient(135deg, #58CC02, #096A02)'
                    : isListening ? 'linear-gradient(135deg, #FF4444, #C70039)'
                    : `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                  boxShadow: isListening ? '0 0 60px rgba(255,68,68,0.6)' : `0 10px 40px ${item.color}66`,
                }}>
                {isListening && [0, 0.3, 0.6].map((delay, i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#FF4444' }}
                    initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.5, delay, repeat: Infinity, ease: 'easeOut' }} />
                ))}
                {status === 'success' ? <Check size={42} className="text-white" strokeWidth={3} /> : <Mic size={42} className="text-white" />}
              </motion.button>
              <AnimatePresence mode="wait">
                {transcript && (
                  <motion.div key="transcript" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-center py-2 px-3 rounded-xl w-full"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-white/40 font-bold mb-1 text-[11px]">سمعتك بتقول:</p>
                    <p className="font-black text-white text-base" style={{ direction: 'ltr' }}>"{transcript}"</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-sm py-2.5 px-3 rounded-xl w-full"
                    style={{
                      background: status === 'success' ? 'rgba(34,197,94,0.18)' : status === 'listening' ? 'rgba(239,68,68,0.18)' : status === 'try-again' ? 'rgba(250,204,21,0.18)' : 'rgba(239,68,68,0.18)',
                      color: status === 'success' ? '#22c55e' : status === 'listening' ? '#ef4444' : status === 'try-again' ? '#facc15' : '#ef4444',
                      border: `1px solid ${status === 'success' ? '#22c55e44' : status === 'listening' ? '#ef444444' : status === 'try-again' ? '#facc1544' : '#ef444444'}`,
                    }}>
                    {status === 'listening' && '🎙️ بسمعك دلوقتي...'}
                    {status === 'success' && '✅ نطق ممتاز! 🌟'}
                    {status === 'try-again' && '😊 قريب! حاول تاني بصوت أوضح'}
                    {status === 'error' && '❌ لازم تسمح للموقع باستخدام المايك'}
                  </motion.div>
                )}
              </AnimatePresence>
              {(attempts >= 2 || status === 'error') && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button onClick={onSkip}
                    className="flex items-center gap-2 rounded-2xl font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all px-5 py-2 text-xs">
                    <SkipForward size={14} /> تخطي وكمل
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type DragSource = { id: string; side: 'emoji' | 'word' };

function MatchGame({ group, onComplete, onCorrect, onKarlReact, onCombo }: {
  group: TimeItem[]; onComplete: () => void;
  onCorrect: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void; onCombo: () => void;
}) {
  const isMobile = useIsMobile();
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<TimeItem[]>(() => shuffle(group));
  const [dragging, setDragging] = useState<DragSource | null>(null);
  const [overTarget, setOverTarget] = useState<DragSource | null>(null);
  const [wrongPair, setWrongPair] = useState<{ emoji: string; word: string } | null>(null);
  const [successPair, setSuccessPair] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const touchDragging = useRef<DragSource | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setShuffledWords(shuffle(group));
    setMatched(new Set()); setErrors(0);
  }, [group]);

  useEffect(() => {
    if (matched.size === group.length) {
      onKarlReact('celebrate');
      setTimeout(onComplete, 800);
    }
  }, [matched]);

  const tryMatch = (source: DragSource, target: DragSource, cx: number, cy: number) => {
    if (source.side === target.side) return;
    if (source.id === target.id) {
      const n = group.find(x => x.id === source.id)!;
      speakWord(n.de);
      playCoinSound(); onCombo(); onKarlReact('happy');
      onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
      setSuccessPair(source.id);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, source.id]));
    } else {
      playBuzzSound(); onKarlReact('sad'); setErrors(e => e + 1);
      setWrongPair({ emoji: target.id, word: source.id });
      setTimeout(() => setWrongPair(null), 500);
    }
  };

  const handleDragStart = (src: DragSource) => setDragging(src);
  const handleDragEnd = () => { setDragging(null); setOverTarget(null); };
  const handleDragOver = (e: React.DragEvent, tgt: DragSource) => {
    e.preventDefault();
    if (dragging && dragging.side !== tgt.side) setOverTarget(tgt);
  };
  const handleDrop = (e: React.DragEvent, tgt: DragSource) => {
    e.preventDefault(); setOverTarget(null);
    if (dragging) tryMatch(dragging, tgt, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, src: DragSource) => {
    if (matched.has(src.id)) return;
    touchDragging.current = src;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.92;pointer-events:none;z-index:9998;border-radius:16px;transition:none;transform:scale(1.08);`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current || !touchDragging.current) return;
    const x = e.touches[0].clientX - touchOffRef.current.x;
    const y = e.touches[0].clientY - touchOffRef.current.y;
    touchCloneRef.current.style.left = x + 'px';
    touchCloneRef.current.style.top = y + 'px';
    const ex = e.touches[0].clientX, ey = e.touches[0].clientY;
    const oppositeSide = touchDragging.current.side === 'emoji' ? 'word' : 'emoji';
    let found: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${oppositeSide}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        found = { id: (el as HTMLElement).dataset.matchTarget!, side: oppositeSide as 'emoji' | 'word' };
      }
    });
    setOverTarget(found);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove();
    touchCloneRef.current = null;
    if (!touchDragging.current) { setOverTarget(null); return; }
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    const oppositeSide = touchDragging.current.side === 'emoji' ? 'word' : 'emoji';
    let dropped: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${oppositeSide}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        dropped = { id: (el as HTMLElement).dataset.matchTarget!, side: oppositeSide as 'emoji' | 'word' };
      }
    });
    if (dropped) tryMatch(touchDragging.current, dropped, ex, ey);
    setOverTarget(null);
    touchDragging.current = null;
  };

  const progress = (matched.size / group.length) * 100;
  const cardWidth = isMobile ? 70 : 100;
  const cardHeight = isMobile ? 95 : 125;

  const renderCard = (it: TimeItem, side: 'emoji' | 'word') => {
    const isMatched = matched.has(it.id);
    const isWrong = side === 'emoji' ? wrongPair?.emoji === it.id : wrongPair?.word === it.id;
    const isSuccess = successPair === it.id;
    const isDraggingThis = dragging?.id === it.id && dragging?.side === side;
    const isOver = overTarget?.id === it.id && overTarget?.side === side && !isMatched;

    if (isMatched) {
      return (
        <div key={`${side}-${it.id}`} style={{ width: cardWidth, height: cardHeight, opacity: 0.2 }}
          className="rounded-xl border-2 border-dashed border-green-500/40 flex items-center justify-center">
          <Check size={20} className="text-green-500/50" strokeWidth={2.5} />
        </div>
      );
    }

    return (
      <motion.div key={`${side}-${it.id}`}
        data-match-target={it.id} data-side={side} draggable
        onDragStart={() => handleDragStart({ id: it.id, side })} onDragEnd={handleDragEnd}
        onDragOver={e => handleDragOver(e, { id: it.id, side })} onDragLeave={() => setOverTarget(null)}
        onDrop={e => handleDrop(e, { id: it.id, side })}
        onTouchStart={e => onTouchStart(e, { id: it.id, side })}
        onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onClick={() => speakWord(it.de)}
        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
        animate={
          isWrong ? { x: [-4, 4, -3, 3, 0] }
          : isSuccess ? { scale: [1, 1.12, 1] }
          : isOver ? { scale: 1.05 } : {}
        }
        transition={{ duration: 0.35 }}
        className="relative select-none rounded-xl overflow-hidden border-2 flex flex-col items-center justify-center p-1"
        style={{
          width: cardWidth, height: cardHeight, cursor: 'grab',
          background: `linear-gradient(180deg, ${it.gradient[0]}, ${it.gradient[1]})`,
          borderColor: isOver ? it.color : isWrong ? '#ef4444' : `${it.color}aa`,
          boxShadow: isDraggingThis ? `0 10px 30px ${it.color}cc, 0 0 35px ${it.color}99`
            : isOver ? `0 0 20px ${it.color}cc, 0 4px 14px ${it.color}77`
            : isWrong ? '0 4px 12px rgba(239,68,68,0.7)' : `0 3px 10px ${it.color}66`,
        }}>
        {side === 'emoji' ? (
          <>
            <DynamicClock item={it} size={isMobile ? 50 : 75} />
            <span className="text-[9px] md:text-xs font-black text-white mt-2 leading-tight text-center">
              {it.de}
            </span>
          </>
        ) : (
          <div className="text-center px-1">
            <div className="font-black text-white" style={{ fontSize: isMobile ? '0.8rem' : '1rem', lineHeight: 1.1, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>{it.de}</div>
            <div className="font-bold text-yellow-300 text-[9px] md:text-xs mt-1">{it.ar}</div>
          </div>
        )}
        {isOver && (
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ background: `radial-gradient(circle at center, ${it.color}44, transparent)`, boxShadow: `inset 0 0 25px ${it.color}aa` }} />
        )}
      </motion.div>
    );
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#3498DB', '#9B59B6', '#FFFFFF']} />
      <motion.div key="match-game"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2 md:gap-3">
        <div className="flex items-center gap-3 w-full max-w-md px-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(52,152,219,0.4), rgba(155,89,182,0.4))',
              backdropFilter: 'blur(20px)', border: '1.5px solid rgba(52,152,219,0.5)',
            }}>
            <Sparkles size={11} className="text-cyan-300" />
            <span className="text-[10px] md:text-xs font-black text-white">طابق الكلمات</span>
          </motion.div>
          <div className="flex-1 flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #3498DB, #9B59B6, #1ABC9C)', boxShadow: '0 0 10px rgba(52,152,219,0.7)' }}
                animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
            <span className="text-[10px] font-black text-white/90 tabular-nums">{matched.size}/{group.length}</span>
          </div>
          {errors > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}>
              <X size={9} /> {errors}
            </motion.div>
          )}
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-[9px] md:text-[10px] text-cyan-300/80 font-black tracking-widest uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px #3498DB' }} />
            الصور (بالألمانية)
          </span>
          <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap" dir="ltr">
            {group.map((it) => renderCard(it, 'emoji'))}
          </div>
        </div>
        <div className="w-full max-w-xs flex items-center gap-2 my-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Sparkles size={10} className="text-white/30" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-[9px] md:text-[10px] text-purple-300/80 font-black tracking-widest uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ boxShadow: '0 0 6px #9B59B6' }} />
            بالألمانية — اسحب لأي اتجاه
          </span>
          <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap" dir="ltr">
            {shuffledWords.map((w) => renderCard(w, 'word'))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function GermanTimeLessonInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useKeyboardOpen();
  const [groupIdx, setGroupIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctInGroup, setCorrectInGroup] = useState(0);
  const LESSON_ID = 'clock-tower';

  const { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress } = useGameStats();

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        if (!progress.completed) {
          if (progress.current_group != null) setGroupIdx(progress.current_group);
          if (progress.current_letter != null) setItemIdx(progress.current_letter);
          if (progress.current_phase) setPhase(progress.current_phase as Phase);
        }
      }
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [testSuccess, setTestSuccess] = useState(false);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const currentGroup = TIME_GROUPS[groupIdx];
  const currentItem = currentGroup?.items[itemIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 2 ? 'closed' : correctInGroup < 5 ? 'half' : 'opend';

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

  const handleCorrect = useCallback((clientX: number, clientY: number) => {
    addPoints(10); incStreak();
    setCorrectInGroup(prev => {
      const newCorrect = prev + 1;
      setTimeout(() => {
        const starTarget = document.getElementById('star-target');
        if (starTarget) {
          const rect = starTarget.getBoundingClientRect();
          const endX = rect.left + rect.width / 2;
          const endY = rect.top + rect.height / 2;
          const starId = Date.now() + Math.random();
          setFlyingItems(prev => [...prev, { id: starId, startX: clientX, startY: clientY, endX, endY, type: 'star' }]);
          setTimeout(() => {
            setFlyingItems(prev => prev.filter(s => s.id !== starId));
            addStar();
          }, 1100);
        }
      }, 100);
      setTimeout(() => {
        const levelBar = document.getElementById('level-bar-target');
        if (levelBar) {
          const rect = levelBar.getBoundingClientRect();
          const endX = rect.left + rect.width / 2;
          const endY = rect.top + rect.height / 2;
          const energyId = Date.now() + Math.random();
          setFlyingItems(prev => [...prev, { id: energyId, startX: clientX, startY: clientY, endX, endY, type: 'energy' }]);
          setTimeout(() => {
            setFlyingItems(prev => prev.filter(s => s.id !== energyId));
            addLevelProgress();
          }, 1100);
        }
      }, 400);
      if (newCorrect === 5) {
        setTimeout(() => {
          const treasureEl = document.getElementById('treasure-box');
          const gemTarget = document.getElementById('gem-target');
          if (treasureEl && gemTarget) {
            const tRect = treasureEl.getBoundingClientRect();
            const gRect = gemTarget.getBoundingClientRect();
            const startX = tRect.left + tRect.width / 2;
            const startY = tRect.top + tRect.height / 2;
            const endX = gRect.left + gRect.width / 2;
            const endY = gRect.top + gRect.height / 2;
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const gemId = Date.now() + Math.random() + i;
                setFlyingItems(prev => [...prev, { id: gemId, startX: startX + (Math.random() - 0.5) * 40, startY, endX, endY, type: 'gem' }]);
                setTimeout(() => {
                  setFlyingItems(prev => prev.filter(s => s.id !== gemId));
                  addGems(1);
                }, 1100);
              }, i * 150);
            }
          }
        }, 700);
      }
      return newCorrect;
    });
    setTotalStars(t => t + 1);
  }, [addPoints, incStreak, addStar, addLevelProgress, addGems]);

  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = TIME_ITEMS_ALL.length * 3;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newGroup: number, newItem: number, newPhase: Phase) => {
    saveLessonProgress(LESSON_ID, calculateRating(totalStars), false, {
      current_group: newGroup, current_letter: newItem, current_phase: newPhase,
    });
  };

  const handleListenDone = () => { setPhase('write'); savePosition(groupIdx, itemIdx, 'write'); };
  const handleWriteDone = () => { setPhase('speak'); savePosition(groupIdx, itemIdx, 'speak'); };
  const handleSpeakDone = () => {
    if (itemIdx < currentGroup.items.length - 1) {
      const newItemIdx = itemIdx + 1;
      setItemIdx(newItemIdx); setPhase('listen');
      savePosition(groupIdx, newItemIdx, 'listen');
    } else {
      setPhase('test'); savePosition(groupIdx, itemIdx, 'test');
    }
  };
  const handleTestComplete = () => setTestSuccess(true);

  const nextGroup = async () => {
    if (groupIdx < TIME_GROUPS.length - 1) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx); setItemIdx(0); setPhase('listen');
      setTestSuccess(false); setCorrectInGroup(0);
      savePosition(newGroupIdx, 0, 'listen');
    } else {
      await saveLessonProgress(LESSON_ID, 3, true);
      router.push('/character-and-map?map=2&from=lesson');
    }
  };

  const handleHomeClick = () => router.push('/character-and-map?map=2&from=lesson');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🕰️</div>
          <p className="text-white font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup || !currentItem) return null;

  const totalStepsInGroup = currentGroup.items.length;
  const activeColor = currentItem?.color ?? '#3498DB';
  const desktopPaddingTop = '130px';
  const desktopPaddingBottom = '120px';

  return (
    <div className="text-white relative" style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh' }} dir="rtl">
      <ScreenBackground groupIdx={groupIdx} isMobile={isMobile} activeColor={activeColor} />
      {!(isMobile && isKeyboardOpen) && (
        <div style={{
          transform: isMobile ? 'scale(0.4)' : 'scale(0.55)',
          transformOrigin: 'bottom right',
          position: 'fixed', bottom: isMobile ? 90 : 110, right: isMobile ? -10 : 20, zIndex: 25, pointerEvents: 'none'
        }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#3498DB" />
        </div>
      )}
      <FlyingItems items={flyingItems} />
      <TopHUD stats={stats} level={stats.level}
        currentStep={itemIdx} totalSteps={totalStepsInGroup}
        onHome={handleHomeClick} isMobile={isMobile} />
      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{
          zIndex: 10, minHeight: '100vh', maxWidth: '1400px',
          paddingTop: isMobile ? '110px' : desktopPaddingTop,
          paddingBottom: isMobile ? '95px' : desktopPaddingBottom,
        }}>
        <AnimatePresence mode="wait">
          {phase === 'listen' && (
            <ListenPhase key={`listen-${groupIdx}-${itemIdx}`}
              item={currentItem} allItems={TIME_ITEMS_ALL}
              onDone={handleListenDone} onKarlReact={handleKarlReact}
              onCombo={handleCombo} onCorrect={handleCorrect}
              isMobile={isMobile} />
          )}
          {phase === 'write' && (
            <WritePhase key={`write-${groupIdx}-${itemIdx}`}
              item={currentItem} onDone={handleWriteDone}
              onKarlReact={handleKarlReact} onCombo={handleCombo}
              onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'speak' && (
            <SpeakingPractice key={`speak-${groupIdx}-${itemIdx}`}
              item={currentItem} isMobile={isMobile}
              onSuccess={(cx, cy) => {
                handleCorrect(cx, cy);
                handleKarlReact('celebrate');
                setTimeout(handleSpeakDone, 800);
              }}
              onSkip={handleSpeakDone} />
          )}
          {phase === 'test' && !testSuccess && (
            <MatchGame key={`match-${groupIdx}`}
              group={currentGroup.items} onComplete={handleTestComplete}
              onCorrect={handleCorrect} onKarlReact={handleKarlReact}
              onCombo={handleCombo} />
          )}
          {testSuccess && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center px-6 max-w-md mx-auto">
              <div className="text-9xl">🏆</div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أحسنت! 🎉</h2>
                <p className="text-white/50 text-lg">أنهيت {currentGroup.title} بنجاح</p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={nextGroup}
                className="font-black px-12 py-5 rounded-2xl text-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #3498DB, #1A5276)',
                  boxShadow: '0 10px 40px rgba(52,152,219,0.5)',
                }}>
                {groupIdx < TIME_GROUPS.length - 1 ? 'المجموعة التالية ←' : '🗺️ رجوع للخريطة'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!testSuccess && (
        <BottomHUD stats={stats} treasureState={treasureState}
          onHint={useHint} onMap={handleHomeClick} isMobile={isMobile} />
      )}
    </div>
  );
}

export default function GermanTimeLesson() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🕰️</div>
          <p className="text-white font-bold">جاري التحميل...</p>
        </div>
      </div>
    }>
      <GermanTimeLessonInner />
    </Suspense>
  );
}
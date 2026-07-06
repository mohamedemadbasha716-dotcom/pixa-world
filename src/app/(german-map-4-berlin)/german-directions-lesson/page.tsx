'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Sparkles, Volume2, Home, Flame, Gem, Trophy, Check, X,
  Mic, SkipForward,
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
import { speakNumber as speakGerman } from '@/lib/audio/speech';

import { DIRECTIONS, DIRECTION_GROUPS, type DirectionItem } from '@/data/german/berlin-directions';

// ═══════════════════════════════════════
// 🔧 Types
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🔧 Constants
// ═══════════════════════════════════════
const TOTAL_DIRECTIONS = DIRECTIONS.length;
const TOTAL_ANSWERS_PER_LESSON = TOTAL_DIRECTIONS * 3;
const LESSON_ID = 'berlin-directions';

const ARTIKEL_COLORS = {
  der: '#3B82F6',
  die: '#EC4899',
  das: '#10B981',
};

const DARK_COLORS: Record<string, string> = {
  '#4CC9F0': '#075985', '#F72585': '#831843', '#7209B7': '#4C1D95',
  '#F77F00': '#9A3412', '#06D6A0': '#064E3B', '#FBBF24': '#7D5310',
  '#A78BFA': '#5B21B6', '#F472B6': '#9D174D', '#34D399': '#064E3B',
  '#EF4444': '#7F1D1D', '#60A5FA': '#1E3A8A', '#FB923C': '#9A3412',
  '#10B981': '#064E3B', '#8B5CF6': '#4C1D95', '#EC4899': '#831843',
};

function getDarkColor(c: string): string {
  if (DARK_COLORS[c]) return DARK_COLORS[c];
  return darkenColor(c, 0.5);
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0xff) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ═══════════════════════════════════════
// 🖼️ صور الاتجاهات
// ═══════════════════════════════════════
const DIRECTION_IMAGES: Record<string, string> = {
  'dir-1':  '/card-image/directions/links.webp',
  'dir-2':  '/card-image/directions/rechts.webp',
  'dir-3':  '/card-image/directions/geradeaus.webp',
  'dir-4':  '/card-image/directions/zurueck.webp',
  'dir-5':  '/card-image/directions/hier.webp',
  'dir-6':  '/card-image/directions/strasse.webp',
  'dir-7':  '/card-image/directions/bruecke.webp',
  'dir-8':  '/card-image/directions/platz.webp',
  'dir-9':  '/card-image/directions/ecke.webp',
  'dir-10': '/card-image/directions/ampel.webp',
  'dir-11': '/card-image/directions/wo-ist-das.webp',
  'dir-12': '/card-image/directions/wie-weit.webp',
  'dir-13': '/card-image/directions/nah.webp',
  'dir-14': '/card-image/directions/weit.webp',
  'dir-15': '/card-image/directions/geradeaus-gehen.webp',
};

// ═══════════════════════════════════════
// 🔧 Utility Functions
// ═══════════════════════════════════════
function normalizeGerman(s: string): string {
  return s.toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
    }
  }
  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string): number {
  const norm = (s: string) => s.toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .trim();
  const na = norm(a), nb = norm(b);
  if (na === nb) return 1.0;
  if (na.includes(nb) || nb.includes(na)) return 0.8;
  const dist = levenshteinDistance(na, nb);
  return 1 - dist / Math.max(na.length, nb.length);
}

// ✅ تحقق يدعم acceptedAnswers
function checkDirectionAnswer(input: string, item: DirectionItem): boolean {
  const accepted = [item.deBase, ...(item.acceptedAnswers || [])];
  return accepted.some(ans => normalizeGerman(input) === normalizeGerman(ans));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDirectionChoices(correctId: string, all: DirectionItem[], count = 3): DirectionItem[] {
  const others = all.filter(c => c.id !== correctId);
  const wrong = shuffle(others).slice(0, count - 1);
  const correct = all.find(c => c.id === correctId)!;
  return shuffle([...wrong, correct]);
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

function getGroupBackground(groupIdx: number, isMobile: boolean): string {
  const suffix = isMobile ? 'mob' : 'pc';
  const num = Math.min(groupIdx + 1, 3);
  return `/card-image/directions/bg-group${num}-${suffix}.webp`;
}

// ═══════════════════════════════════════
// 🔧 Hooks
// ═══════════════════════════════════════
function useIsMobile(breakpoint = 1024): boolean {
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
    if (!window.visualViewport) return;
    const h = window.visualViewport.height;
    const handler = () => {
      if (!window.visualViewport) return;
      setIsOpen(h - window.visualViewport.height > 150);
    };
    window.visualViewport.addEventListener('resize', handler);
    return () => window.visualViewport?.removeEventListener('resize', handler);
  }, []);
  return isOpen;
}

type GameStats = {
  points: number; streak: number; gems: number; level: number;
  energy: number; hints: number; levelProgress: number;
};

function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    points: 1650, streak: 14, gems: 60, level: 6, energy: 5, hints: 3, levelProgress: 0,
  });
  const addPoints = (n: number) => setStats(s => ({ ...s, points: s.points + n }));
  const incStreak = () => setStats(s => ({ ...s, streak: s.streak + 1 }));
  const resetStreak = () => setStats(s => ({ ...s, streak: 0 }));
  const addGems = (n: number) => setStats(s => ({ ...s, gems: s.gems + n }));
  const useHint = () => setStats(s => ({ ...s, hints: Math.max(0, s.hints - 1) }));
  const addStar = () => setStats(s => ({ ...s, points: s.points + 10 }));
  const addLevelProgress = () => setStats(s => ({
    ...s, levelProgress: Math.min(100, s.levelProgress + 100 / TOTAL_ANSWERS_PER_LESSON),
  }));
  return { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress };
}

// ═══════════════════════════════════════
// 🎨 ScreenBackground
// ═══════════════════════════════════════
function ScreenBackground({ groupIdx, isMobile, activeColor }: {
  groupIdx: number; isMobile: boolean; activeColor: string;
}) {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; delay: number; size: number; duration: number;
  }>>([]);

  useEffect(() => {
    if (isMobile) return;
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 10,
      size: 2 + Math.random() * 8, duration: 12 + Math.random() * 10,
    })));
  }, [isMobile, groupIdx]);

  const bgImage = getGroupBackground(groupIdx, isMobile);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(1.1)' }}
        onError={e => { (e.target as HTMLImageElement).style.background = 'linear-gradient(180deg,#1a1033,#0a0520)'; }}
      />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,rgba(10,5,30,.5) 0%,rgba(10,5,30,.3) 40%,rgba(10,5,30,.3) 60%,rgba(10,5,30,.5) 100%)' }} />
      <motion.div className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%,${activeColor}33,transparent 70%)` }}
        animate={{ opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 4, repeat: Infinity }} />
      {!isMobile && particles.map(p => (
        <motion.div key={`${groupIdx}-${p.id}`} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: -20, width: p.size, height: p.size,
            background: `radial-gradient(circle,${activeColor}cc,transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}88`,
          }}
          animate={{ y: [0, -(window.innerHeight || 800) - 100], opacity: [0, .9, .9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div key={`star-${groupIdx}-${i}`} className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`,
            width: 1.5 + Math.random() * 1.5, height: 1.5 + Math.random() * 1.5, background: 'white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🔢 Stepper
// ═══════════════════════════════════════
function Stepper({ currentStep, totalSteps, isMobile }: {
  currentStep: number; totalSteps: number; isMobile: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const isLocked = i > currentStep;
        return (
          <div key={i} className="flex items-center">
            <motion.div
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                height: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                background: isActive ? 'linear-gradient(135deg,#9D4EDD,#7209B7)'
                  : isDone ? 'linear-gradient(135deg,#58CC02,#4AA802)'
                  : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#9D4EDD' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(157,78,221,0.6)' : isDone ? '0 0 6px rgba(88,204,2,0.4)' : 'none',
              }}
            >
              {isLocked ? '🔒' : isDone ? '✓' : i + 1}
            </motion.div>
            {i < totalSteps - 1 && (
              <div className={`${isMobile ? 'w-1' : 'w-3 md:w-4'} h-0.5`}
                style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 TopHUD
// ═══════════════════════════════════════
function TopHUD({ stats, level, currentStep, totalSteps, onHome, isMobile }: {
  stats: GameStats; level: number; currentStep: number; totalSteps: number;
  onHome: () => void; isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-30 px-2"
        style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 2px)' }}>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.1 }}
              className="relative w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: '#FFD700', boxShadow: '0 0 10px rgba(255,215,0,0.5)', background: 'linear-gradient(135deg,#4CC9F0,#7209B7)' }}>
              <img src="/characters/karl-3d.png" alt="character" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right,#4CC9F0,#7209B7)' }}
                    animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
            {[
              { id: 'star-target', src: '/treasuer/star.png', val: stats.points, border: 'rgba(255,215,0,0.35)', isImg: true },
              { icon: <Flame size={12} className="text-orange-400 flex-shrink-0" style={{ fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />, val: stats.streak, border: 'rgba(255,77,109,0.35)', isImg: false },
              { icon: <Gem id="gem-target" size={12} className="text-purple-300 flex-shrink-0" style={{ fill: '#9D4EDD' }} />, val: stats.gems, border: 'rgba(157,78,221,0.35)', isImg: false },
            ].map((item, i) => (
              <motion.div key={i}
                className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
                style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${item.border}` }}>
                {item.isImg
                  ? <img id={item.id} src={item.src} alt="" className="w-3 h-3 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
                  : item.icon}
                <span className="font-black text-[10px] text-white truncate">{item.val}</span>
              </motion.div>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Home size={14} className="text-white" />
          </motion.button>
        </div>
        <div className="flex justify-center" style={{ marginTop: '2.5px' }}>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
            style={{ background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6"
      style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 10px)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: '#FFD700', boxShadow: '0 0 15px rgba(255,215,0,0.5)', background: 'linear-gradient(135deg,#4CC9F0,#7209B7)' }}>
            <img src="/characters/karl-3d.png" alt="character" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/80 mb-0.5">المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">{level}</span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right,#4CC9F0,#7209B7)' }}
                  animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={false} />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {[
            { key: stats.gems, label: stats.gems, icon: <Gem id="gem-target" size={18} className="text-purple-300" style={{ fill: '#9D4EDD' }} />, border: 'rgba(157,78,221,0.35)' },
            { key: stats.streak, label: stats.streak, icon: <Flame size={18} className="text-orange-400" style={{ fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />, border: 'rgba(255,77,109,0.35)', sub: 'سلسلة' },
          ].map((item, i) => (
            <motion.div key={i}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
              style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px)', border: `2px solid ${item.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              {item.sub
                ? <div className="flex flex-col leading-none items-center">
                    <span className="font-black text-sm text-white">{item.label}</span>
                    <span className="text-[7px] text-orange-200/90 font-bold mt-0.5">{item.sub}</span>
                  </div>
                : <span className="font-black text-sm text-white">{item.label}</span>}
              {item.icon}
            </motion.div>
          ))}

          <motion.div key={stats.points}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,215,0,0.35)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <span className="font-black text-sm text-white">{stats.points}</span>
            <img id="star-target" src="/treasuer/star.png" alt="star" className="w-5 h-5 md:w-6 md:h-6"
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
          </motion.div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            <Home size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 FlyingItems
// ═══════════════════════════════════════
function FlyingItems({ items }: { items: FlyingItem[] }) {
  return (
    <>
      {items.map(item => {
        const dx = item.endX - item.startX;
        const dy = item.endY - item.startY;
        const color = item.type === 'star' ? '#FFD700' : item.type === 'energy' ? '#4CC9F0' : '#9D4EDD';
        return (
          <div key={item.id} className="fixed pointer-events-none z-[60]" style={{ left: item.startX, top: item.startY }}>
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.8, 1.5, 1.2, 1.0, 1.6, 0],
                opacity: [0, 1, 1, 1, 1, 1, 0],
                x: [0, 0, dx * 0.25, dx * 0.7, dx, dx, dx],
                y: [0, -20, dy * 0.3 - 150, dy * 0.6 - 80, dy, dy, dy],
                rotate: [0, -15, 180, 360, 540, 720, 720],
              }}
              transition={{ duration: 1.4, times: [0, 0.1, 0.25, 0.55, 0.85, 0.95, 1] }}>
              <div className="relative" style={{ width: 40, height: 40, marginTop: -20, marginLeft: -20 }}>
                <div className="absolute inset-0 rounded-full blur-xl" style={{ background: color, opacity: 0.8, transform: 'scale(2.5)' }} />
                <div className="relative flex items-center justify-center w-full h-full">
                  {item.type === 'star' && <img src="/treasuer/star.png" alt="" className="w-10 h-10" style={{ filter: `drop-shadow(0 0 15px ${color})` }} />}
                  {item.type === 'energy' && <img src="/treasuer/energy.png" alt="" className="w-10 h-10" style={{ filter: `drop-shadow(0 0 15px ${color})` }} />}
                  {item.type === 'gem' && <Gem size={36} className="text-purple-200" fill="#9D4EDD" style={{ filter: `drop-shadow(0 0 15px ${color})` }} />}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════
// 🎯 BottomHUD
// ═══════════════════════════════════════
function FloatingIconButton({ label, color, onClick, badge, disabled, iconSrc, iconAlt }: {
  label: string; color: string; onClick?: () => void;
  badge?: number; disabled?: boolean; iconSrc: string; iconAlt: string;
}) {
  return (
    <motion.button whileHover={!disabled ? { scale: 1.1, y: -2 } : {}} whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick} disabled={disabled}
      className="flex flex-col items-center gap-0.5 disabled:opacity-70">
      <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
        <img src={iconSrc} alt={iconAlt} className="w-full h-full object-contain"
          style={{ filter: `drop-shadow(0 2px 8px ${color}aa)` }} />
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white border"
            style={{ background: '#FF4D6D', borderColor: 'rgba(15,10,45,0.95)' }}>
            {badge}
          </div>
        )}
      </div>
      <span className="text-[7px] md:text-[9px] font-black leading-none" style={{ color, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {label}
      </span>
    </motion.button>
  );
}

function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 4px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'w-full max-w-[1400px]'}`}>
        <div className="relative rounded-xl px-3 md:px-6 py-1 md:py-1.5"
          style={{
            background: 'linear-gradient(135deg,rgba(20,15,55,0.85) 0%,rgba(15,10,45,0.9) 100%)',
            backdropFilter: 'blur(30px)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}>
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-yellow-300" />
            <span className="text-[8px] md:text-[9px] font-black text-yellow-200 tracking-wider uppercase">مكافآت الإنجاز</span>
            <Sparkles size={8} className="text-yellow-300" />
          </div>
          <div className="flex items-end justify-around gap-2 md:gap-3">
            <FloatingIconButton onClick={onMap} label="خريطة" color="#4CC9F0" iconSrc="/treasuer/map-icon.png" iconAlt="map" />
            <FloatingIconButton label="نجوم" color="#FFD700" disabled iconSrc="/treasuer/star.png" iconAlt="star" />
            <motion.div id="treasure-box"
              animate={treasureState === 'opend' ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
              className="flex flex-col items-center gap-0.5">
              <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
                <img src={`/treasuer/${treasureState}.png`} alt="treasure" className="w-full h-full object-contain"
                  style={{ filter: treasureState === 'opend' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'none' }} />
              </div>
              <span className="text-[7px] md:text-[9px] font-black text-yellow-400 leading-none">صندوق</span>
            </motion.div>
            <FloatingIconButton label="طاقة" color="#4CC9F0" disabled iconSrc="/treasuer/energy.png" iconAlt="energy" />
            <FloatingIconButton onClick={onHint} label="تلميح" color="#FFD700" badge={stats.hints} disabled={stats.hints === 0} iconSrc="/treasuer/HINT.svg" iconAlt="hint" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🔊 SoundButton
// ═══════════════════════════════════════
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
        style={{ background: `linear-gradient(135deg,${color}cc,${color}88)`, boxShadow: `0 4px 15px ${color}66`, border: `1px solid ${color}` }}>
        <Volume2 size={16} /><span>{label}</span>
      </motion.button>
    );
  }
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClick}
      className="rounded-full flex items-center justify-center border-2 relative flex-shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#9D4EDD,#7209B7)', borderColor: 'rgba(255,255,255,0.4)', boxShadow: '0 6px 20px rgba(157,78,221,0.6)' }}>
      {isPlaying && [0, 0.2, 0.4].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: '#9D4EDD' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay }} />
      ))}
      <Volume2 size={size * 0.4} className="text-white" />
    </motion.button>
  );
}

// ═══════════════════════════════════════
// 🏷️ ArtikelBadge — مع دعم undefined
// ═══════════════════════════════════════
function ArtikelBadge({ artikel, size = 'md' }: {
  artikel?: 'der' | 'die' | 'das'; size?: 'sm' | 'md' | 'lg';
}) {
  if (!artikel) return null;
  const color = ARTIKEL_COLORS[artikel];
  const sizeClasses = { sm: 'text-[10px] px-1.5 py-0.5', md: 'text-xs px-2 py-1', lg: 'text-sm px-3 py-1.5' };
  const labels = { der: 'مذكر', die: 'مؤنث', das: 'محايد' };
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
      className={`inline-flex items-center gap-1 rounded-lg font-black ${sizeClasses[size]}`}
      style={{ background: `linear-gradient(135deg,${color},${color}cc)`, color: 'white', boxShadow: `0 2px 8px ${color}aa`, border: `1px solid ${color}` }}>
      <span className="uppercase tracking-wide">{artikel}</span>
      <span className="opacity-70 text-[8px]">({labels[artikel]})</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🖼️ HeroDirectionDisplay
// ═══════════════════════════════════════
function HeroDirectionDisplay({ item, isMobile, showWord = false }: {
  item: DirectionItem; isMobile?: boolean; showWord?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const size = isMobile ? 200 : 320;
  const imgSrc = DIRECTION_IMAGES[item.id];

  useEffect(() => { setImgError(false); }, [item.id]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-8 rounded-3xl blur-3xl"
        style={{ background: `radial-gradient(circle,${item.color}66,transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }} />

      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="relative w-full h-full select-none flex items-center justify-center"
        style={{ filter: `drop-shadow(0 10px 25px ${item.color}99)` }}>
        {imgSrc && !imgError ? (
          <img src={imgSrc} alt={item.de} className="w-full h-full object-contain" draggable={false}
            onError={() => setImgError(true)} />
        ) : (
          <div className="text-center" style={{ fontSize: isMobile ? '8rem' : '12rem', lineHeight: 1 }}>
            {item.emoji}
          </div>
        )}
      </motion.div>

      {showWord && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl whitespace-nowrap z-10"
          style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid rgba(255,255,255,0.4)', boxShadow: `0 4px 15px ${item.color}88` }}>
          <span className="font-black text-white text-sm md:text-base">{item.de}</span>
        </motion.div>
      )}

      {[{ x: '0%', y: '5%', delay: 0, size: 14 }, { x: '95%', y: '10%', delay: 0.5, size: 12 },
        { x: '-2%', y: '85%', delay: 1, size: 13 }, { x: '97%', y: '88%', delay: 1.5, size: 11 }
      ].map((star, i) => (
        <motion.div key={i} className="absolute pointer-events-none z-20"
          style={{ left: star.x, top: star.y }}
          animate={{ scale: [0, 1, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: star.delay }}>
          <Sparkles size={star.size} style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color})` }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🃏 DirectionChoiceCard (Listen Phase)
// ═══════════════════════════════════════
function DirectionChoiceCard({ item, allItems, isMobile, onCorrect, onWrong }: {
  item: DirectionItem; allItems: DirectionItem[]; isMobile: boolean;
  onCorrect: (cx: number, cy: number) => void; onWrong: () => void;
}) {
  const [choices, setChoices] = useState<DirectionItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChoices(generateDirectionChoices(item.id, allItems, 3));
    setHiddenIds(new Set());
    setWrongId(null);
    setStatus('idle');
    setImgErrors({});
  }, [item.id]);

  const handleChoice = (choice: DirectionItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenIds.has(choice.id)) return;
    if (choice.id === item.id) {
      setHiddenIds(prev => new Set(prev).add(choice.id));
      setStatus('correct');
      onCorrect(e.clientX, e.clientY);
    } else {
      setWrongId(choice.id);
      playBuzzSound();
      onWrong();
      setTimeout(() => setWrongId(null), 600);
    }
  };

  const cardSize = isMobile ? 75 : 130;

  return (
    <div className={`w-full ${isMobile ? 'max-w-md' : 'max-w-3xl'} mx-auto ${isMobile ? 'p-3' : 'p-6'} rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden`}
      style={{ background: 'rgba(20,15,55,0.55)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: `0 20px 60px rgba(0,0,0,0.5),0 0 50px ${item.color}33` }}>
      <div className="absolute inset-0 pointer-events-none rounded-[1.5rem] md:rounded-[2rem]"
        style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />

      <div className={`relative z-10 flex flex-col items-center ${isMobile ? 'gap-2.5' : 'gap-4'}`}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`${isMobile ? 'px-4 py-1.5' : 'px-6 py-2.5'} rounded-2xl`}
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,245,255,0.9))', border: `2px solid ${item.color}66`, boxShadow: `0 4px 15px ${item.color}44` }}>
          <span className={`font-black ${isMobile ? 'text-xs' : 'text-base'} text-gray-800`}>
            استمع جيداً واختر الصورة الصحيحة
          </span>
        </motion.div>

        <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
          {item.artikel && <ArtikelBadge artikel={item.artikel} size={isMobile ? 'sm' : 'md'} />}
          <motion.span className="font-black text-white"
            style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', textShadow: `0 4px 15px ${item.color}`, direction: 'ltr' }}
            animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            {item.deBase}
          </motion.span>
        </div>

        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`px-3 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-base'} font-black`}
          style={{ background: `linear-gradient(135deg,${item.color}33,${item.color}22)`, border: `1.5px solid ${item.color}66`, color: 'white' }}>
          {item.ar}
        </motion.div>

        <SoundButton onClick={() => speakGerman(item.de)} color={item.color} size={isMobile ? 45 : 55} />

        <div className={`flex items-center gap-1.5 ${isMobile ? 'mt-1' : 'mt-2'}`}>
          <span className={`font-black text-white ${isMobile ? 'text-xs' : 'text-base'}`}>اضغط على الصورة الصحيحة</span>
          <span className={isMobile ? 'text-sm' : 'text-lg'}>👇</span>
        </div>

        <div className={`flex items-center justify-center ${isMobile ? 'gap-2.5' : 'gap-5'} w-full`} dir="ltr">
          {choices.map((choice, idx) => {
            const isHidden = hiddenIds.has(choice.id);
            const isWrong = wrongId === choice.id;
            const choiceImg = DIRECTION_IMAGES[choice.id];
            const hasImgError = imgErrors[choice.id];
            return (
              <AnimatePresence key={`${item.id}-${choice.id}-${idx}`} mode="wait">
                {!isHidden && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}
                    onClick={e => handleChoice(choice, e)}
                    disabled={status === 'correct' || isWrong}
                    className="relative rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2"
                    style={{
                      width: cardSize, height: cardSize,
                      background: isWrong ? 'linear-gradient(145deg,#FF4444,#CC0000)' : 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,245,255,0.95))',
                      borderColor: isWrong ? '#FF4444' : `${choice.color}aa`,
                      boxShadow: isWrong ? '0 8px 25px rgba(255,68,68,0.6)' : `0 8px 25px ${choice.color}66`,
                    }}>
                    {choiceImg && !hasImgError
                      ? <img src={choiceImg} alt={choice.de} className="w-full h-full object-contain p-2"
                          onError={() => setImgErrors(prev => ({ ...prev, [choice.id]: true }))} />
                      : <span style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', lineHeight: 1 }}>{choice.emoji}</span>
                    }
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        <AnimatePresence>
          {status === 'correct' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className={`flex items-center justify-center gap-2 font-black ${isMobile ? 'text-xs py-1 px-3' : 'text-sm py-2 px-5'} rounded-xl`}
              style={{ background: 'rgba(88,204,2,0.3)', color: '#58CC02', border: '1.5px solid #58CC0288' }}>
              <Check size={isMobile ? 12 : 16} /> ممتاز! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status === 'correct' && item.exampleDe && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className={`text-center ${isMobile ? 'px-3 py-1.5' : 'px-5 py-3'} rounded-xl bg-white/5 border border-white/10`}>
              <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-white/90`} dir="ltr">{item.exampleDe}</div>
              <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/60 mt-0.5`}>{item.exampleAr}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ✏️ WordBuilderMobile
// ═══════════════════════════════════════
function WordBuilderMobile({ item, onComplete, onWrong }: {
  item: DirectionItem;
  onComplete: (cx: number, cy: number) => void;
  onWrong: () => void;
}) {
  const word = item.deBase;
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [flyingLetter, setFlyingLetter] = useState<{
    letter: string; fromRect: DOMRect; toRect: DOMRect; targetIdx: number;
  } | null>(null);

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const darkColor = useMemo(() => getDarkColor(item.color), [item.color]);

  useEffect(() => {
    setShuffledLetters(shuffleWordLetters(word));
    setPlacedIndices([]);
    setWrongShake(null);
    setIsComplete(false);
    setFlyingLetter(null);
  }, [word]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete || placedIndices.includes(idx) || flyingLetter !== null) return;
    const nextExpected = word[placedIndices.length];
    if (letter.toLowerCase() === nextExpected.toLowerCase()) {
      const targetIdx = placedIndices.length;
      const buttonEl = letterRefs.current[idx];
      const slotEl = slotRefs.current[targetIdx];
      if (buttonEl && slotEl) {
        const fromRect = buttonEl.getBoundingClientRect();
        const toRect = slotEl.getBoundingClientRect();
        setFlyingLetter({ letter, fromRect, toRect, targetIdx });
        setTimeout(() => {
          setPlacedIndices(prev => [...prev, idx]);
          setFlyingLetter(null);
          playCoinSound();
          if (placedIndices.length + 1 === word.length) {
            setIsComplete(true);
            speakGerman(item.de);
            setTimeout(() => onComplete(e.clientX, e.clientY), 600);
          }
        }, 600);
      }
    } else {
      setWrongShake(idx);
      playBuzzSound();
      onWrong();
      setTimeout(() => setWrongShake(null), 600);
    }
  };

  return (
    <>
      <AnimatePresence>
        {flyingLetter && (
          <motion.div className="fixed pointer-events-none z-[100] flex items-center justify-center rounded-lg"
            initial={{ left: flyingLetter.fromRect.left, top: flyingLetter.fromRect.top, width: flyingLetter.fromRect.width, height: flyingLetter.fromRect.height, scale: 1 }}
            animate={{ left: flyingLetter.toRect.left, top: flyingLetter.toRect.top, width: flyingLetter.toRect.width, height: flyingLetter.toRect.height, scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ background: `linear-gradient(145deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid rgba(255,255,255,0.6)', boxShadow: `0 6px 25px ${item.color}cc` }}>
            <span className="font-black text-white" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{flyingLetter.letter}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md mx-auto p-3 rounded-[1.5rem] relative overflow-hidden"
        style={{ background: 'rgba(20,15,55,0.45)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: `0 20px 60px rgba(0,0,0,0.5),0 0 50px ${item.color}33` }}>
        <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
          style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-2xl"
            style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,245,255,0.9))', border: `2px solid ${item.color}66` }}>
            <span className="font-black text-xs text-gray-800">استمع ورتب الحروف</span>
          </motion.div>

          <HeroDirectionDisplay item={item} isMobile showWord />

          <div className="text-center flex items-center gap-2">
            {item.artikel && <ArtikelBadge artikel={item.artikel} size="sm" />}
            <div className="font-bold text-xs" style={{ color: item.color }}>{item.ar}</div>
          </div>

          <SoundButton onClick={() => speakGerman(item.de)} color={item.color} size={38} />

          {/* Slots */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {word.split('').map((letter, idx) => {
              const isFilled = idx < placedIndices.length;
              return (
                <motion.div ref={el => { slotRefs.current[idx] = el; }} key={`slot-${idx}`}
                  animate={{ scale: isFilled ? [0.8, 1.15, 1] : 1 }} transition={{ duration: 0.3 }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden"
                  style={{
                    width: 34, height: 42,
                    background: isFilled ? `linear-gradient(145deg,${item.gradient[0]},${item.gradient[1]})` : 'rgba(255,255,255,0.05)',
                    borderColor: isFilled ? item.color : `${item.color}55`,
                    borderStyle: isFilled ? 'solid' : 'dashed',
                    boxShadow: isFilled ? `0 4px 12px ${item.color}aa` : 'none',
                  }}>
                  {!isFilled && (
                    <span className="font-black absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ fontSize: '1.3rem', lineHeight: 1, color: item.color, opacity: 0.25 }}>{letter}</span>
                  )}
                  {isFilled && (
                    <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                      className="font-black text-white relative z-10"
                      style={{ fontSize: '1.4rem', lineHeight: 1 }}>{letter}</motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Letters */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {shuffledLetters.map((letter, idx) => {
              const isPlaced = placedIndices.includes(idx);
              const isShaking = wrongShake === idx;
              return (
                <AnimatePresence key={`shuffled-${idx}`} mode="wait">
                  {!isPlaced && (
                    <motion.button ref={el => { letterRefs.current[idx] = el; }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isShaking ? { x: [-6, 6, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={isShaking ? { duration: 0.4 } : { delay: idx * 0.05, type: 'spring', stiffness: 300 }}
                      whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                      onClick={e => handleLetterClick(letter, idx, e)}
                      disabled={isComplete || flyingLetter !== null}
                      className="rounded-lg flex items-center justify-center flex-shrink-0 border-2"
                      style={{
                        width: 40, height: 40,
                        background: isShaking ? 'linear-gradient(145deg,#FF4444,#CC0000)' : 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,245,255,0.95))',
                        borderColor: isShaking ? '#FF4444' : `${item.color}aa`,
                        boxShadow: isShaking ? '0 4px 15px rgba(255,68,68,0.6)' : `0 4px 14px ${item.color}55`,
                      }}>
                      <span className="font-black" style={{ fontSize: '1.4rem', lineHeight: 1, color: isShaking ? 'white' : darkColor }}>
                        {letter}
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              );
            })}
          </div>

          <AnimatePresence>
            {isComplete && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 font-black text-sm py-1.5 px-4 rounded-xl"
                style={{ background: 'rgba(88,204,2,0.3)', color: '#58CC02', border: '2px solid #58CC0288' }}>
                <Check size={14} /> ممتاز! 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// 📝 ListenPhase
// ═══════════════════════════════════════
function ListenPhase({ item, allItems, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  item: DirectionItem; allItems: DirectionItem[]; onDone: () => void;
  onKarlReact: (m: KarlMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void; isMobile: boolean;
}) {
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  useEffect(() => { setTimeout(() => speakGerman(item.de), 500); }, [item.id]);

  const handleCorrect = (cx: number, cy: number) => {
    speakGerman(item.de);
    playCoinSound();
    onCombo();
    onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy);
    setTimeout(onDone, 1400);
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y}
        colors={item.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`listen-${item.id}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto">
        <DirectionChoiceCard item={item} allItems={allItems} isMobile={isMobile}
          onCorrect={handleCorrect} onWrong={() => onKarlReact('sad')} />
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// ✏️ WritePhase
// ═══════════════════════════════════════
function WritePhase({ item, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  item: DirectionItem; onDone: () => void;
  onKarlReact: (m: KarlMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(item.deBase);

  useEffect(() => { setInput(''); setStatus('idle'); }, [item.id]);

  const handleMobileComplete = (cx: number, cy: number) => {
    playCoinSound(); onCombo(); onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy);
    setTimeout(onDone, 1400);
  };

  const handleCheck = (e?: React.MouseEvent) => {
    if (checkDirectionAnswer(input, item)) {
      setStatus('correct');
      speakGerman(item.de);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      let cx = 0, cy = 0;
      if (e) { cx = e.clientX; cy = e.clientY; }
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      }
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      onCorrect(cx, cy);
      setTimeout(onDone, 1000);
    } else {
      setStatus('wrong');
      playBuzzSound();
      onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y}
        colors={item.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`write-${item.id}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto">
        {isMobile ? (
          <WordBuilderMobile item={item} onComplete={handleMobileComplete} onWrong={() => onKarlReact('sad')} />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <HeroDirectionDisplay item={item} showWord />
              <div className="flex items-center gap-3">
                {item.artikel && <ArtikelBadge artikel={item.artikel} size="md" />}
                <SoundButton onClick={() => speakGerman(item.de)} color={item.color} label="استمع للكلمة" />
              </div>
              {item.plural && (
                <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/60">جمع:</div>
                  <div className="font-bold text-sm text-white/90" dir="ltr">{item.plural}</div>
                </div>
              )}
              {item.acceptedAnswers && item.acceptedAnswers.length > 1 && (
                <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/60 mb-1">إجابات مقبولة:</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {item.acceptedAnswers.map((ans, i) => (
                      <span key={i} className="text-xs font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full" dir="ltr">
                        {ans}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${item.color}aa` }}>
                  Schreiben · بالألمانية
                </div>
                <div className="text-2xl font-black text-white">اكتب الكلمة</div>
                <div className="text-sm font-bold text-white/40 mt-1">{item.ar}</div>
              </div>
              <GhostInput ref={inputRef} value={input}
                onChange={v => { setInput(v); setStatus('idle'); }} onEnter={handleCheck}
                ghostText={item.deBase} color={item.color} status={status} fontSize="1.8rem" />
              {requiredChars.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">💡 الحروف الخاصة</p>
                  <SpecialCharsKeyboard chars={requiredChars} onChar={c => { setInput(p => p + c); setStatus('idle'); inputRef.current?.focus(); }} color={item.color} />
                </div>
              )}
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl"
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
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25"
                style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, boxShadow: `0 8px 30px ${item.color}55`, borderBottom: `4px solid ${item.color}77` }}>
                تحقق ✓
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// 🎤 SpeakPhase
// ═══════════════════════════════════════
function SpeakPhase({ item, isMobile, onSuccess, onSkip }: {
  item: DirectionItem; isMobile: boolean;
  onSuccess: (cx: number, cy: number) => void; onSkip: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'try-again' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }

    const rec = new SpeechRecognition();
    rec.lang = 'de-DE';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results[0];
      let bestMatch = '', bestScore = 0;
      for (let i = 0; i < (results as any).length; i++) {
        const text = (results as any)[i].transcript.toLowerCase().trim();
        const score = similarityScore(text, item.deBase.toLowerCase());
        if (score > bestScore) { bestScore = score; bestMatch = text; }
      }
      setTranscript(bestMatch);
      setIsListening(false);
      if (bestScore >= 0.65) {
        setStatus('success');
        playCoinSound();
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        if (micButtonRef.current) {
          const r = micButtonRef.current.getBoundingClientRect();
          cx = r.left + r.width / 2; cy = r.top + r.height / 2;
        }
        setTimeout(() => onSuccess(cx, cy), 1500);
      } else {
        setStatus('try-again');
        playBuzzSound();
        setAttempts(a => a + 1);
      }
    };
    rec.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') setStatus('error');
      else if (event.error !== 'no-speech') { setStatus('try-again'); setAttempts(a => a + 1); }
      else setStatus('idle');
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, [item.deBase, onSuccess]);

  const handleStart = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript(''); setStatus('listening'); setIsListening(true);
    try { recognitionRef.current.start(); } catch { setIsListening(false); setStatus('error'); }
  };

  if (!supported) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-3xl border-2 text-center"
        style={{ background: 'rgba(255,107,107,0.1)', borderColor: 'rgba(255,107,107,0.3)' }}>
        <div className="text-5xl mb-3">😅</div>
        <h3 className="text-xl font-black text-white mb-2">المتصفح مش بيدعم النطق</h3>
        <button onClick={onSkip} className="px-8 py-3 rounded-2xl font-black text-white"
          style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})` }}>
          تخطي ⏭️
        </button>
      </div>
    );
  }

  const micSize = isMobile ? 64 : 96;

  return (
    <motion.div key={`speak-${item.id}`}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="w-full max-w-5xl mx-auto">
      <div className={isMobile ? 'mx-auto rounded-[1.5rem] relative overflow-hidden p-3 max-w-md' : 'grid lg:grid-cols-5 gap-8 items-center'}
        style={isMobile ? { background: 'rgba(20,15,55,0.55)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: `0 20px 60px rgba(0,0,0,0.5),0 0 50px ${item.color}33` } : {}}>

        {!isMobile && (
          <div className="lg:col-span-3 flex flex-col items-center gap-4">
            <HeroDirectionDisplay item={item} showWord />
          </div>
        )}

        <div className={isMobile ? 'relative z-10 flex flex-col items-center gap-2' : 'lg:col-span-2'}>
          {isMobile && (
            <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
              style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />
          )}

          <div className={isMobile ? 'relative z-10 flex flex-col items-center gap-2 w-full' : 'relative rounded-[1.8rem] p-6 overflow-hidden'
          } style={!isMobile ? { background: 'rgba(20,15,55,0.55)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: `0 20px 60px rgba(0,0,0,0.5),0 0 50px ${item.color}33` } : {}}>

            {!isMobile && <div className="absolute inset-0 pointer-events-none rounded-[1.8rem]"
              style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />}

            <div className={`${!isMobile ? 'relative z-10 ' : ''}flex flex-col items-center gap-${isMobile ? '2' : '4'} w-full`}>
              {isMobile && <HeroDirectionDisplay item={item} isMobile showWord />}

              <div className="text-center">
                <h3 className={`font-black text-white flex items-center justify-center gap-1.5 ${isMobile ? 'text-base' : 'text-2xl'}`}>
                  <span>انطق الكلمة</span>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🎤</motion.span>
                </h3>
                <p className={`text-white/60 font-bold ${isMobile ? 'text-[10px]' : 'text-xs'} mt-0.5`}>اضغط على المايك واتكلم بوضوح</p>
              </div>

              <div className="flex items-center gap-2 mt-1">
                {item.artikel && <ArtikelBadge artikel={item.artikel} size={isMobile ? 'sm' : 'md'} />}
                <button onClick={() => speakGerman(item.de)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-all font-bold px-3 py-1 text-xs">
                  <Volume2 size={12} /> اسمع
                </button>
              </div>

              <motion.button ref={micButtonRef}
                whileHover={!isListening ? { scale: 1.05 } : {}} whileTap={!isListening ? { scale: 0.95 } : {}}
                onClick={handleStart} disabled={isListening || status === 'success'}
                className="relative rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  width: micSize, height: micSize,
                  background: status === 'success' ? 'linear-gradient(135deg,#58CC02,#096A02)'
                    : isListening ? 'linear-gradient(135deg,#FF4444,#C70039)'
                    : `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`,
                  boxShadow: isListening ? '0 0 60px rgba(255,68,68,0.6)' : `0 10px 40px ${item.color}66`,
                }}>
                {isListening && [0, 0.3, 0.6].map((delay, i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-4"
                    style={{ borderColor: '#FF4444' }}
                    initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.5, delay, repeat: Infinity }} />
                ))}
                {status === 'success' ? <Check size={isMobile ? 30 : 42} className="text-white" strokeWidth={3} /> : <Mic size={isMobile ? 30 : 42} className="text-white" />}
              </motion.button>

              <AnimatePresence mode="wait">
                {transcript && (
                  <motion.div key="t" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                    <p className={`text-white/40 font-bold ${isMobile ? 'text-[10px]' : 'text-[11px]'} mb-0.5`}>سمعتك بتقول:</p>
                    <p className="font-black text-white text-sm" dir="ltr">&ldquo;{transcript}&rdquo;</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`flex items-center justify-center gap-2 font-black text-sm py-2.5 px-3 rounded-xl w-full ${isMobile ? 'text-xs' : ''}`}
                    style={{
                      background: status === 'success' ? 'rgba(34,197,94,0.18)' : status === 'listening' ? 'rgba(239,68,68,0.18)' : status === 'try-again' ? 'rgba(250,204,21,0.18)' : 'rgba(239,68,68,0.18)',
                      color: status === 'success' ? '#22c55e' : status === 'listening' ? '#ef4444' : status === 'try-again' ? '#facc15' : '#ef4444',
                    }}>
                    {status === 'listening' && '🎙️ بسمعك دلوقتي...'}
                    {status === 'success' && '✅ نطق ممتاز! 🌟'}
                    {status === 'try-again' && '😊 قريب! حاول تاني'}
                    {status === 'error' && '❌ لازم تسمح للمايك'}
                  </motion.div>
                )}
              </AnimatePresence>

              {(attempts >= 2 || status === 'error') && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button onClick={onSkip}
                    className="flex items-center gap-2 rounded-2xl font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 px-4 py-2 text-xs">
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

// ═══════════════════════════════════════
// 🎮 MatchGame
// ═══════════════════════════════════════
type DragSource = { id: string; side: 'image' | 'word' };

function MatchGame({ group, onComplete, onCorrect, onKarlReact, onCombo }: {
  group: DirectionItem[]; onComplete: () => void;
  onCorrect: (x: number, y: number) => void;
  onKarlReact: (m: KarlMood) => void; onCombo: () => void;
}) {
  const isMobile = useIsMobile();
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<DirectionItem[]>(() => shuffle(group));
  const [dragging, setDragging] = useState<DragSource | null>(null);
  const [overTarget, setOverTarget] = useState<DragSource | null>(null);
  const [wrongPair, setWrongPair] = useState<{ id: string; otherId: string } | null>(null);
  const [successPair, setSuccessPair] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const touchDragging = useRef<DragSource | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setShuffledWords(shuffle(group));
    setMatched(new Set());
    setErrors(0);
    setImgErrors({});
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
      const it = group.find(x => x.id === source.id)!;
      speakGerman(it.de);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      setSuccessPair(source.id);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, source.id]));
    } else {
      playBuzzSound();
      onKarlReact('sad');
      setErrors(e => e + 1);
      setWrongPair({ id: target.id, otherId: source.id });
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
    e.preventDefault();
    setOverTarget(null);
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
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.92;pointer-events:none;z-index:9998;border-radius:16px;transform:scale(1.08);`;
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
    const oppSide = touchDragging.current.side === 'image' ? 'word' : 'image';
    let found: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${oppSide}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom)
        found = { id: (el as HTMLElement).dataset.matchTarget!, side: oppSide as 'image' | 'word' };
    });
    setOverTarget(found);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove();
    touchCloneRef.current = null;
    if (!touchDragging.current) { setOverTarget(null); return; }
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    const oppSide = touchDragging.current.side === 'image' ? 'word' : 'image';
    let dropped: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${oppSide}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom)
        dropped = { id: (el as HTMLElement).dataset.matchTarget!, side: oppSide as 'image' | 'word' };
    });
    if (dropped) tryMatch(touchDragging.current, dropped, ex, ey);
    setOverTarget(null);
    touchDragging.current = null;
  };

  const progress = (matched.size / group.length) * 100;
  const cardW = isMobile ? 62 : 95;
  const cardH = isMobile ? 78 : 115;

  const renderCard = (item: DirectionItem, side: 'image' | 'word') => {
    const isMatched = matched.has(item.id);
    const isWrong = wrongPair?.id === item.id || wrongPair?.otherId === item.id;
    const isSuccess = successPair === item.id;
    const isDraggingThis = dragging?.id === item.id && dragging?.side === side;
    const isOver = overTarget?.id === item.id && overTarget?.side === side && !isMatched;
    const imgSrc = DIRECTION_IMAGES[item.id];
    const hasImgError = imgErrors[item.id];

    if (isMatched) {
      return (
        <div key={`${side}-${item.id}`}
          style={{ width: cardW, height: cardH, opacity: 0.2 }}
          className="rounded-xl border-2 border-dashed border-green-500/40 flex items-center justify-center">
          <Check size={20} className="text-green-500/50" strokeWidth={2.5} />
        </div>
      );
    }

    return (
      <motion.div key={`${side}-${item.id}`}
        data-match-target={item.id} data-side={side}
        draggable
        onDragStart={() => handleDragStart({ id: item.id, side })}
        onDragEnd={handleDragEnd}
        onDragOver={e => handleDragOver(e, { id: item.id, side })}
        onDragLeave={() => setOverTarget(null)}
        onDrop={e => handleDrop(e, { id: item.id, side })}
        onTouchStart={e => onTouchStart(e, { id: item.id, side })}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => speakGerman(item.de)}
        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
        animate={isWrong ? { x: [-4, 4, -3, 3, 0] } : isSuccess ? { scale: [1, 1.12, 1] } : isOver ? { scale: 1.05 } : {}}
        transition={{ duration: 0.35 }}
        className="relative select-none rounded-xl overflow-hidden border-2"
        style={{
          width: cardW, height: cardH, cursor: 'grab',
          borderColor: isOver ? item.color : isWrong ? '#ef4444' : `${item.color}aa`,
          boxShadow: isDraggingThis ? `0 10px 30px ${item.color}cc` : isOver ? `0 0 20px ${item.color}cc` : isWrong ? '0 4px 12px rgba(239,68,68,0.7)' : `0 3px 10px ${item.color}66`,
          opacity: dragging !== null && !(dragging.id === item.id && dragging.side === side) && dragging.side === side ? 0.5 : 1,
          background: `linear-gradient(180deg,${item.gradient[0]},${item.gradient[1]})`,
        }}>
        {side === 'image' ? (
          imgSrc && !hasImgError
            ? <img src={imgSrc} alt={item.de} className="w-full h-full object-contain p-1" draggable={false}
                onError={() => setImgErrors(prev => ({ ...prev, [item.id]: true }))} />
            : <div className="w-full h-full flex items-center justify-center" style={{ fontSize: isMobile ? '2rem' : '3rem' }}>{item.emoji}</div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center px-1">
            {item.artikel && <div className="text-[8px] md:text-[10px] font-black uppercase opacity-80 text-white">{item.artikel}</div>}
            <span className="font-black text-white block text-center" style={{ fontSize: isMobile ? '0.85rem' : '1.1rem', lineHeight: 1.1 }}>
              {item.deBase}
            </span>
            <span className="font-bold text-white/80 text-[8px] md:text-[10px] mt-0.5">{item.ar}</span>
          </div>
        )}
        {isOver && (
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ background: `radial-gradient(circle at center,${item.color}44,transparent)`, boxShadow: `inset 0 0 25px ${item.color}aa` }} />
        )}
      </motion.div>
    );
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y}
        colors={['#FFD700', '#A78BFA', '#4CC9F0', '#FFFFFF']} />
      <motion.div key="match-game"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2 md:gap-3">

        <div className="flex items-center gap-3 w-full max-w-md px-2">
          <div className="px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(236,72,153,0.4))', border: '1.5px solid rgba(167,139,250,0.5)' }}>
            <Sparkles size={11} className="text-yellow-300" />
            <span className="text-[10px] md:text-xs font-black text-white">طابق الصور بالكلمات</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right,#58CC02,#A78BFA,#EC4899)' }}
                animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
            <span className="text-[10px] font-black text-white/90">{matched.size}/{group.length}</span>
          </div>
          {errors > 0 && (
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}>
              <X size={9} /> {errors}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-[9px] text-cyan-300/80 font-black tracking-widest uppercase">الصور</span>
          <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap" dir="ltr">
            {group.map(c => renderCard(c, 'image'))}
          </div>
        </div>

        <div className="w-full max-w-xs flex items-center gap-2 my-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Sparkles size={10} className="text-white/30" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-[9px] text-pink-300/80 font-black tracking-widest uppercase">بالألمانية — اسحب</span>
          <div className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap" dir="ltr">
            {shuffledWords.map(w => renderCard(w, 'word'))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// 🏠 Main Component
// ═══════════════════════════════════════
function GermanDirectionsLessonInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useKeyboardOpen();

  const [groupIdx, setGroupIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctInGroup, setCorrectInGroup] = useState(0);

  const { stats, addPoints, incStreak, addGems, useHint, addStar, addLevelProgress } = useGameStats();
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [testSuccess, setTestSuccess] = useState(false);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const currentGroup = DIRECTION_GROUPS[groupIdx];
  const currentItem = currentGroup?.numbers[itemIdx];

  const treasureState: 'closed' | 'half' | 'opend' =
    correctInGroup < 2 ? 'closed' : correctInGroup < 5 ? 'half' : 'opend';

  // Load progress
  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    const msg = mood === 'sad'
      ? SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)]
      : ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setKarlMessage(msg);
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  const handleCombo = () => {
    setCombo(c => {
      const next = c + 1;
      if (next === 3 || next === 5 || next === 7) playComboSound();
      return next;
    });
  };

  const calculateRating = (stars: number) => {
    const ratio = stars / (DIRECTIONS.length * 3);
    if (ratio >= 0.67) return 3;
    if (ratio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (g: number, i: number, p: Phase) => {
    saveLessonProgress(LESSON_ID, calculateRating(totalStars), false, {
      current_group: g, current_letter: i, current_phase: p,
    });
  };

  const handleCorrect = useCallback((clientX: number, clientY: number) => {
    addPoints(10);
    incStreak();
    setCorrectInGroup(prev => {
      const next = prev + 1;

      // Flying star
      setTimeout(() => {
        const starTarget = document.getElementById('star-target');
        if (starTarget) {
          const rect = starTarget.getBoundingClientRect();
          const endX = rect.left + rect.width / 2;
          const endY = rect.top + rect.height / 2;
          const id = Date.now() + Math.random();
          setFlyingItems(p => [...p, { id, startX: clientX, startY: clientY, endX, endY, type: 'star' }]);
          setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addStar(); }, 1100);
        }
      }, 100);

      // Flying energy
      setTimeout(() => {
        const bar = document.getElementById('level-bar-target');
        if (bar) {
          const rect = bar.getBoundingClientRect();
          const id = Date.now() + Math.random();
          setFlyingItems(p => [...p, { id, startX: clientX, startY: clientY, endX: rect.left + rect.width / 2, endY: rect.top + rect.height / 2, type: 'energy' }]);
          setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addLevelProgress(); }, 1100);
        }
      }, 400);

      // Flying gems at 5 corrects
      if (next === 5) {
        setTimeout(() => {
          const treasureEl = document.getElementById('treasure-box');
          const gemTarget = document.getElementById('gem-target');
          if (treasureEl && gemTarget) {
            const tRect = treasureEl.getBoundingClientRect();
            const gRect = gemTarget.getBoundingClientRect();
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const id = Date.now() + Math.random() + i;
                setFlyingItems(p => [...p, { id, startX: tRect.left + tRect.width / 2, startY: tRect.top + tRect.height / 2, endX: gRect.left + gRect.width / 2, endY: gRect.top + gRect.height / 2, type: 'gem' }]);
                setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addGems(1); }, 1100);
              }, i * 150);
            }
          }
        }, 700);
      }

      return next;
    });
    setTotalStars(t => t + 1);
  }, [addPoints, incStreak, addStar, addLevelProgress, addGems]);

  // Phase transitions
  const handleListenDone = () => { setPhase('write'); savePosition(groupIdx, itemIdx, 'write'); };
  const handleWriteDone = () => { setPhase('speak'); savePosition(groupIdx, itemIdx, 'speak'); };
  const handleSpeakDone = () => {
    if (itemIdx < currentGroup.numbers.length - 1) {
      const next = itemIdx + 1;
      setItemIdx(next); setPhase('listen');
      savePosition(groupIdx, next, 'listen');
    } else {
      setPhase('test'); savePosition(groupIdx, itemIdx, 'test');
    }
  };

  const handleTestComplete = () => setTestSuccess(true);

  const nextGroup = async () => {
    if (groupIdx < DIRECTION_GROUPS.length - 1) {
      const next = groupIdx + 1;
      setGroupIdx(next); setItemIdx(0); setPhase('listen');
      setTestSuccess(false); setCorrectInGroup(0);
      savePosition(next, 0, 'listen');
    } else {
      await saveLessonProgress(LESSON_ID, 3, true);
      router.push('/character-and-map?from=lesson&map=4');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧭</div>
          <p className="text-white font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup || !currentItem) return null;

  const activeColor = currentItem?.color ?? '#4CC9F0';

  return (
    <div className="text-white relative" style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh' }} dir="rtl">
      <ScreenBackground groupIdx={groupIdx} isMobile={isMobile} activeColor={activeColor} />

      {!(isMobile && isKeyboardOpen) && (
        <div style={{ transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', transformOrigin: 'bottom right', position: 'fixed', bottom: isMobile ? 110 : 130, right: 0, zIndex: 25, pointerEvents: 'none' }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#4CC9F0" />
        </div>
      )}

      <FlyingItems items={flyingItems} />

      <TopHUD
        stats={stats} level={stats.level}
        currentStep={itemIdx} totalSteps={currentGroup.numbers.length}
        onHome={() => router.push('/character-and-map?from=lesson&map=4')}
        isMobile={isMobile}
      />

      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{ zIndex: 10, minHeight: '100vh', maxWidth: '1400px', paddingTop: isMobile ? '110px' : '130px', paddingBottom: isMobile ? '95px' : '120px' }}>
        <AnimatePresence mode="wait">
          {phase === 'listen' && (
            <ListenPhase key={`listen-${groupIdx}-${itemIdx}`}
              item={currentItem} allItems={DIRECTIONS}
              onDone={handleListenDone} onKarlReact={handleKarlReact}
              onCombo={handleCombo} onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'write' && (
            <WritePhase key={`write-${groupIdx}-${itemIdx}`}
              item={currentItem} onDone={handleWriteDone}
              onKarlReact={handleKarlReact} onCombo={handleCombo}
              onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'speak' && (
            <SpeakPhase key={`speak-${groupIdx}-${itemIdx}`}
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
              group={currentGroup.numbers}
              onComplete={handleTestComplete} onCorrect={handleCorrect}
              onKarlReact={handleKarlReact} onCombo={handleCombo} />
          )}
          {testSuccess && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center px-6 max-w-md mx-auto">
              <div className="text-9xl">🧭</div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أحسنت! 🎉</h2>
                <p className="text-white/50 text-lg">أنهيت {currentGroup.title} بنجاح</p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={nextGroup}
                className="font-black px-12 py-5 rounded-2xl text-lg text-white"
                style={{ background: 'linear-gradient(135deg,#7209B7,#4CC9F0)', boxShadow: '0 10px 40px rgba(114,9,183,0.5)' }}>
                {groupIdx < DIRECTION_GROUPS.length - 1 ? 'المجموعة التالية ←' : '🗺️ رجوع للخريطة'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!testSuccess && (
        <BottomHUD stats={stats} treasureState={treasureState}
          onHint={useHint} onMap={() => router.push('/character-and-map?from=lesson&map=4')}
          isMobile={isMobile} />
      )}
    </div>
  );
}

export default function GermanDirectionsLesson() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-6xl mb-4 animate-pulse">🧭</div>
      </div>
    }>
      <GermanDirectionsLessonInner />
    </Suspense>
  );
}
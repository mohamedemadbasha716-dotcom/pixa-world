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

import { CONVERSATIONS, CONVERSATION_GROUPS, type ConversationItem } from '@/data/german/dresden-conversation';

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

const TOTAL_ITEMS = CONVERSATIONS.length;
const TOTAL_ANSWERS_PER_LESSON = TOTAL_ITEMS * 3;
const LESSON_ID = 'semperoper';

const DARK_COLORS: Record<string, string> = {
  '#4CC9F0': '#075985', '#F72585': '#831843', '#3B82F6': '#1E3A8A',
  '#EC4899': '#831843', '#10B981': '#064E3B', '#7209B7': '#4C1D95',
  '#F77F00': '#9A3412', '#06D6A0': '#064E3B', '#FBBF24': '#7D5310',
  '#A78BFA': '#5B21B6', '#0EA5E9': '#075985', '#F472B6': '#9D174D',
  '#8B5CF6': '#4C1D95', '#22C55E': '#15803D', '#EF4444': '#7F1D1D',
  '#FFD700': '#B45309', '#F59E0B': '#78350F', '#FF4D6D': '#9F1239',
  '#58CC02': '#166534',
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
  const na = normalizeGerman(a), nb = normalizeGerman(b);
  if (na === nb) return 1.0;
  if (na.includes(nb) || nb.includes(na)) return 0.8;
  return 1 - levenshteinDistance(na, nb) / Math.max(na.length, nb.length);
}

function checkAnswer(input: string, item: ConversationItem): boolean {
  const accepted = [item.deBase, item.de, ...(item.acceptedAnswers || [])];
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

function generateChoices(correctId: string, all: ConversationItem[], count = 3): ConversationItem[] {
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
  return `/card-image/lake-group1-${suffix}.webp`;
}

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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img src={getGroupBackground(groupIdx, isMobile)} alt="bg" className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(1.1)' }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,rgba(10,5,25,.75) 0%,rgba(10,5,25,.4) 40%,rgba(10,5,25,.4) 60%,rgba(10,5,25,.75) 100%)' }} />
      <motion.div className="absolute inset-0 opacity-50"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%,${activeColor}44,transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
      {!isMobile && particles.map(p => (
        <motion.div key={`${groupIdx}-${p.id}`} className="absolute rounded-full"
          style={{ left: `${p.x}%`, bottom: -20, width: p.size, height: p.size, background: `radial-gradient(circle,${activeColor}cc,transparent)`, boxShadow: `0 0 ${p.size * 2}px ${activeColor}88` }}
          animate={{ y: [0, -(window.innerHeight || 800) - 100], opacity: [0, .9, .9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }} />
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div key={`star-${groupIdx}-${i}`} className="absolute rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, width: 1.5 + Math.random() * 1.5, height: 1.5 + Math.random() * 1.5, background: 'white' }}
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
            <motion.div animate={isActive ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 18 : 32) : (isMobile ? 14 : 26),
                height: isActive ? (isMobile ? 18 : 32) : (isMobile ? 14 : 26),
                background: isActive ? 'linear-gradient(135deg,#9D4EDD,#7209B7)' : isDone ? 'linear-gradient(135deg,#58CC02,#4AA802)' : 'rgba(255,255,255,0.15)',
                borderColor: isActive ? '#E0AAFF' : isDone ? '#86EFAC' : 'rgba(255,255,255,0.3)',
                borderWidth: isMobile ? '1.5px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.6)' : 'white',
                fontSize: isMobile ? '7px' : '12px',
                boxShadow: isActive ? '0 0 10px rgba(157,78,221,0.8)' : isDone ? '0 0 8px rgba(88,204,2,0.6)' : 'none',
              }}>
              {isLocked ? '🔒' : isDone ? '✓' : i + 1}
            </motion.div>
            {i < totalSteps - 1 && <div className={`${isMobile ? 'w-1.5' : 'w-4 md:w-5'} h-1 rounded-full`} style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />}
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
      <div className="fixed top-0 left-0 right-0 z-30 px-2" style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 4px)' }}>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: '#FFD700', boxShadow: '0 0 12px rgba(255,215,0,0.6)', background: 'linear-gradient(135deg,#4CC9F0,#7209B7)' }}>
              <img src="/characters/karl-3d.webp" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[8px] font-black text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[12px] text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{level}</span>
                <div id="level-bar-target" className="relative w-12 h-2 bg-black/50 rounded-full overflow-hidden border border-white/30">
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#4CC9F0,#7209B7)' }}
                    animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-1 justify-center max-w-[210px]">
            <motion.div className="flex items-center gap-1 px-2 py-1 rounded-xl flex-1 justify-center shadow-lg"
              style={{ background: 'rgba(10,5,25,0.9)', border: '1.5px solid rgba(255,215,0,0.6)' }}>
              <img id="star-target" src="/treasuer/star.webp" alt="" className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-black text-[11px] text-white truncate">{stats.points}</span>
            </motion.div>
            <motion.div className="flex items-center gap-1 px-2 py-1 rounded-xl flex-1 justify-center shadow-lg"
              style={{ background: 'rgba(10,5,25,0.9)', border: '1.5px solid rgba(255,77,109,0.6)' }}>
              <Flame size={14} className="text-orange-400 flex-shrink-0" style={{ fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
              <span className="font-black text-[11px] text-white truncate">{stats.streak}</span>
            </motion.div>
            <motion.div className="flex items-center gap-1 px-2 py-1 rounded-xl flex-1 justify-center shadow-lg"
              style={{ background: 'rgba(10,5,25,0.9)', border: '1.5px solid rgba(157,78,221,0.6)' }}>
              <Gem id="gem-target" size={14} className="text-purple-300 flex-shrink-0" style={{ fill: '#9D4EDD' }} />
              <span className="font-black text-[11px] text-white truncate">{stats.gems}</span>
            </motion.div>
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: 'rgba(10,5,25,0.9)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
            <Home size={16} className="text-white" />
          </motion.button>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl shadow-lg"
            style={{ background: 'rgba(10,5,25,0.9)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6" style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 12px)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-[3px]"
            style={{ borderColor: '#FFD700', background: 'linear-gradient(135deg,#4CC9F0,#7209B7)', boxShadow: '0 0 15px rgba(255,215,0,0.5)' }}>
            <img src="/characters/karl-3d.webp" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{level}</span>
              <div id="level-bar-target" className="relative w-24 h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/30">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#4CC9F0,#7209B7)' }}
                  animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-5 py-2.5 rounded-2xl shadow-xl"
            style={{ background: 'rgba(10,5,25,0.85)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={false} />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-lg"
            style={{ background: 'rgba(10,5,25,0.85)', border: '2px solid rgba(157,78,221,0.6)' }}>
            <span className="font-black text-base text-white">{stats.gems}</span>
            <Gem id="gem-target" size={20} className="text-purple-300" style={{ fill: '#9D4EDD' }} />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-lg"
            style={{ background: 'rgba(10,5,25,0.85)', border: '2px solid rgba(255,77,109,0.6)' }}>
            <span className="font-black text-base text-white">{stats.streak}</span>
            <Flame size={20} className="text-orange-400" style={{ fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl shadow-lg"
            style={{ background: 'rgba(10,5,25,0.85)', border: '2px solid rgba(255,215,0,0.6)' }}>
            <span className="font-black text-base text-white">{stats.points}</span>
            <img id="star-target" src="/treasuer/star.webp" alt="" className="w-6 h-6" />
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'rgba(10,5,25,0.85)', border: '2px solid rgba(255,255,255,0.3)' }}>
            <Home size={22} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ✈️ FlyingItems
// ═══════════════════════════════════════
function FlyingItems({ items }: { items: FlyingItem[] }) {
  return <>
    {items.map(item => {
      const dx = item.endX - item.startX, dy = item.endY - item.startY;
      const color = item.type === 'star' ? '#FFD700' : item.type === 'energy' ? '#4CC9F0' : '#9D4EDD';
      return (
        <div key={item.id} className="fixed pointer-events-none z-[60]" style={{ left: item.startX, top: item.startY }}>
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.8, 1.5, 1.2, 1, 1.6, 0], opacity: [0, 1, 1, 1, 1, 1, 0],
              x: [0, 0, dx * .25, dx * .7, dx, dx, dx],
              y: [0, -20, dy * .3 - 150, dy * .6 - 80, dy, dy, dy],
              rotate: [0, -15, 180, 360, 540, 720, 720],
            }}
            transition={{ duration: 1.4, times: [0, .1, .25, .55, .85, .95, 1] }}>
            <div className="relative" style={{ width: 40, height: 40, marginTop: -20, marginLeft: -20 }}>
              <div className="absolute inset-0 rounded-full blur-xl" style={{ background: color, opacity: 0.8, transform: 'scale(2.5)' }} />
              <div className="relative flex items-center justify-center w-full h-full">
                {item.type === 'star' && <img src="/treasuer/star.webp" alt="" className="w-10 h-10" />}
                {item.type === 'energy' && <img src="/treasuer/energy.webp" alt="" className="w-10 h-10" />}
                {item.type === 'gem' && <Gem size={36} fill="#9D4EDD" className="text-purple-200" />}
              </div>
            </div>
          </motion.div>
        </div>
      );
    })}
  </>;
}

// ═══════════════════════════════════════
// 🔽 BottomHUD
// ═══════════════════════════════════════
function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  const Btn = ({ label, color, onClick, badge, disabled, iconSrc }: any) => (
    <motion.button whileHover={!disabled ? { scale: 1.1 } : {}} whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick} disabled={disabled} className="flex flex-col items-center gap-0.5 disabled:opacity-70">
      <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
        <img src={iconSrc} alt="" className="w-full h-full object-contain" style={{ filter: `drop-shadow(0 2px 8px ${color}aa)` }} />
        {badge > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: '#FF4D6D' }}>{badge}</div>}
      </div>
      <span className="text-[8px] md:text-[10px] font-black" style={{ color, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{label}</span>
    </motion.button>
  );
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 6px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'max-w-[1400px]'}`}>
        <div className="rounded-2xl px-3 md:px-6 py-1.5 md:py-2 shadow-2xl"
          style={{ background: 'linear-gradient(135deg,rgba(20,15,55,0.9),rgba(15,10,45,0.95))', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.25)' }}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Sparkles size={9} className="text-yellow-300" />
            <span className="text-[9px] font-black text-yellow-200 tracking-widest uppercase" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>مكافآت الإنجاز</span>
            <Sparkles size={9} className="text-yellow-300" />
          </div>
          <div className="flex items-end justify-around gap-2">
            <Btn onClick={onMap} label="خريطة" color="#7DD3FC" iconSrc="/treasuer/map-icon.webp" />
            <Btn label="نجوم" color="#FDE047" disabled iconSrc="/treasuer/star.webp" />
            <div id="treasure-box" className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img src={`/treasuer/${treasureState}.webp`} alt="" className="w-full h-full object-contain drop-shadow-xl" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black" style={{ color: '#FDE047', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>صندوق</span>
            </div>
            <Btn label="طاقة" color="#7DD3FC" disabled iconSrc="/treasuer/energy.webp" />
            <Btn onClick={onHint} label="تلميح" color="#FDE047" badge={stats.hints} disabled={stats.hints === 0} iconSrc="/treasuer/HINT.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🔊 SoundButton
// ═══════════════════════════════════════
function SoundButton({ onClick, color, label, size = 40 }: { onClick: () => void; color: string; label?: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  const go = () => { setPlaying(true); onClick(); setTimeout(() => setPlaying(false), 1500); };
  if (label) return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={go}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm text-white shadow-xl"
      style={{ background: `linear-gradient(135deg,${color}dd,${color}99)`, border: `2px solid ${color}`, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
      <Volume2 size={18} /><span>{label}</span>
    </motion.button>
  );
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={go}
      className="rounded-full flex items-center justify-center border-[3px] relative flex-shrink-0 shadow-2xl"
      style={{ width: size, height: size, background: `linear-gradient(135deg,${color},${getDarkColor(color)})`, borderColor: 'rgba(255,255,255,0.5)' }}>
      {playing && [0, .2, .4].map((d, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none" style={{ borderColor: color }}
          initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 1, delay: d }} />
      ))}
      <Volume2 size={size * .45} className="text-white drop-shadow-md" />
    </motion.button>
  );
}

// ═══════════════════════════════════════
// 🖼️ HeroDisplay
// ═══════════════════════════════════════
function HeroDisplay({ item, isMobile, showWord = false }: { item: ConversationItem; isMobile?: boolean; showWord?: boolean }) {
  const size = isMobile ? 180 : 300;
  // ✅ الكلمات الطويلة تصغر تلقائياً
  const wordLen = item.de.length;
  const wordFontSize = isMobile 
    ? (wordLen > 14 ? '0.9rem' : wordLen > 10 ? '1rem' : '1.15rem')
    : (wordLen > 14 ? '1.3rem' : wordLen > 10 ? '1.5rem' : '1.75rem');

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-6 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle,${item.color}88,transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], opacity: [.5, .8, .5] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="relative w-full h-full select-none flex items-center justify-center"
        style={{ filter: `drop-shadow(0 15px 30px ${item.color}aa)` }}>
        <div className="text-center" style={{ fontSize: isMobile ? '6.5rem' : '10rem', lineHeight: 1 }}>{item.emoji}</div>
      </motion.div>
      {showWord && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl whitespace-nowrap z-10 shadow-2xl max-w-[90%]"
          style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid rgba(255,255,255,0.6)' }}>
          <span className="font-black text-white text-center block" style={{ fontSize: wordFontSize, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>{item.de}</span>
        </motion.div>
      )}
      {[{ x: '5%', y: '10%', d: 0, s: 16 }, { x: '90%', y: '15%', d: .5, s: 14 }, { x: '0%', y: '80%', d: 1, s: 15 }, { x: '95%', y: '85%', d: 1.5, s: 12 }
      ].map((star, i) => (
        <motion.div key={i} className="absolute pointer-events-none z-20" style={{ left: star.x, top: star.y }}
          animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: star.d }}>
          <Sparkles size={star.s} style={{ color: item.color, filter: 'drop-shadow(0 0 5px white)' }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🃏 ChoiceCard (Listen)
// ═══════════════════════════════════════
function ChoiceCard({ item, allItems, isMobile, onCorrect, onWrong }: {
  item: ConversationItem; allItems: ConversationItem[]; isMobile: boolean;
  onCorrect: (cx: number, cy: number) => void; onWrong: () => void;
}) {
  const [choices, setChoices] = useState<ConversationItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');

  useEffect(() => {
    setChoices(generateChoices(item.id, allItems, 3));
    setHiddenIds(new Set()); setWrongId(null); setStatus('idle');
  }, [item.id]);

  const handleChoice = (c: ConversationItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenIds.has(c.id)) return;
    if (c.id === item.id) {
      setHiddenIds(p => new Set(p).add(c.id)); setStatus('correct');
      onCorrect(e.clientX, e.clientY);
    } else {
      setWrongId(c.id); playBuzzSound(); onWrong();
      setTimeout(() => setWrongId(null), 600);
    }
  };

  const cardSize = isMobile ? 82 : 140;
  // ✅ حجم الجملة الألمانية بيتكيف
  const mainTextLen = item.de.length;
  const mainFontSize = isMobile
    ? (mainTextLen > 14 ? '1.3rem' : mainTextLen > 10 ? '1.5rem' : '1.8rem')
    : (mainTextLen > 14 ? '2rem' : mainTextLen > 10 ? '2.4rem' : '2.8rem');

  return (
    <div className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-3xl'} mx-auto ${isMobile ? 'p-4' : 'p-8'} rounded-[2rem] relative overflow-hidden shadow-2xl`}
      style={{ background: 'rgba(15,10,35,0.88)', backdropFilter: 'blur(40px)', border: '2px solid rgba(255,255,255,0.25)', boxShadow: `0 25px 70px rgba(0,0,0,0.6), inset 0 0 30px ${item.color}22` }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -20%,${item.color}44,transparent 60%)` }} />
      <div className={`relative z-10 flex flex-col items-center ${isMobile ? 'gap-3.5' : 'gap-5'}`}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`${isMobile ? 'px-5 py-2' : 'px-8 py-3'} rounded-2xl shadow-lg`}
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,240,250,0.95))', border: `2px solid ${item.color}88` }}>
          <span className={`font-black ${isMobile ? 'text-xs' : 'text-base'} text-gray-900`}>استمع جيداً واختر الرد الصحيح</span>
        </motion.div>
        
        <motion.span className="font-black text-white text-center px-2" style={{ fontSize: mainFontSize, textShadow: `0 4px 20px ${item.color}, 0 2px 6px rgba(0,0,0,0.9)`, direction: 'ltr', lineHeight: 1.2 }}
          animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          {item.de}
        </motion.span>
        
        <div className={`px-4 py-1.5 rounded-full ${isMobile ? 'text-sm' : 'text-lg'} font-black shadow-md`}
          style={{ background: `${item.color}55`, border: `2px solid ${item.color}`, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
          {item.ar}
        </div>
        
        <SoundButton onClick={() => speakGerman(item.de)} color={item.color} size={isMobile ? 50 : 60} />
        <span className={`font-black text-white ${isMobile ? 'text-xs' : 'text-base'} mt-1`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>اضغط على الرمز الصحيح 👇</span>
        
        <div className={`flex items-center justify-center ${isMobile ? 'gap-3' : 'gap-6'} w-full`} dir="ltr">
          {choices.map((c, idx) => {
            const isHidden = hiddenIds.has(c.id);
            const isWrong = wrongId === c.id;
            return (
              <AnimatePresence key={`${item.id}-${c.id}-${idx}`} mode="wait">
                {!isHidden && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={isWrong ? { duration: .4 } : { delay: idx * .1, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: .95 }}
                    onClick={e => handleChoice(c, e)} disabled={status === 'correct' || isWrong}
                    className="relative rounded-[1.5rem] flex items-center justify-center flex-shrink-0 overflow-hidden border-[3px]"
                    style={{
                      width: cardSize, height: cardSize,
                      background: isWrong ? 'linear-gradient(145deg,#EF4444,#991B1B)' : 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(235,235,245,0.95))',
                      borderColor: isWrong ? '#FCA5A5' : `${c.color}bb`,
                      boxShadow: isWrong ? '0 10px 25px rgba(239,68,68,0.6)' : `0 10px 25px ${c.color}55`,
                    }}>
                    <span style={{ fontSize: isMobile ? '3.5rem' : '5.5rem', lineHeight: 1, filter: isWrong ? 'grayscale(100%) brightness(50%)' : 'none' }}>{c.emoji}</span>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>
        <AnimatePresence>
          {status === 'correct' && (
            <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 font-black ${isMobile ? 'text-sm py-1.5 px-4' : 'text-lg py-2.5 px-6'} rounded-xl shadow-lg`}
              style={{ background: 'linear-gradient(135deg,#58CC02,#3A8A01)', color: 'white', border: '2px solid #86EFAC' }}>
              <Check size={isMobile ? 16 : 20} strokeWidth={3} /> ممتاز! 🎉
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {status === 'correct' && item.exampleDe && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
              className={`text-center ${isMobile ? 'px-3 py-2' : 'px-5 py-3'} rounded-xl shadow-inner w-full max-w-md`}
              style={{ background: 'rgba(0,0,0,0.4)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
              <div className={`font-black ${isMobile ? 'text-xs' : 'text-sm'} text-cyan-200`} dir="ltr" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{item.exampleDe}</div>
              <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-yellow-200 mt-1 font-bold`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{item.exampleAr}</div>
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
  item: ConversationItem; onComplete: (cx: number, cy: number) => void; onWrong: () => void;
}) {
  const word = item.deBase.split(' ')[0]; // ✅ نستخدم الكلمة الأساسية القصيرة
  const wordLen = word.length;
  // ✅ الأحجام بتتكيف حسب طول الكلمة
  const slotW = wordLen > 10 ? 26 : wordLen > 7 ? 32 : 38;
  const slotH = wordLen > 10 ? 34 : wordLen > 7 ? 40 : 46;
  const letterSize = wordLen > 10 ? '1rem' : wordLen > 7 ? '1.15rem' : '1.3rem';

  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [flyingLetter, setFlyingLetter] = useState<any>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const darkColor = useMemo(() => getDarkColor(item.color), [item.color]);

  useEffect(() => {
    setShuffledLetters(shuffleWordLetters(word));
    setPlacedIndices([]); setWrongShake(null); setIsComplete(false); setFlyingLetter(null);
  }, [word]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete || placedIndices.includes(idx) || flyingLetter) return;
    const next = word[placedIndices.length];
    if (letter.toLowerCase() === next.toLowerCase()) {
      const targetIdx = placedIndices.length;
      const btn = letterRefs.current[idx], slot = slotRefs.current[targetIdx];
      if (btn && slot) {
        setFlyingLetter({ letter, fromRect: btn.getBoundingClientRect(), toRect: slot.getBoundingClientRect(), targetIdx });
        setTimeout(() => {
          setPlacedIndices(p => [...p, idx]); setFlyingLetter(null); playCoinSound();
          if (placedIndices.length + 1 === word.length) {
            setIsComplete(true); speakGerman(item.de);
            setTimeout(() => onComplete(e.clientX, e.clientY), 800);
          }
        }, 500);
      }
    } else {
      setWrongShake(idx); playBuzzSound(); onWrong();
      setTimeout(() => setWrongShake(null), 500);
    }
  };

  return (
    <>
      <AnimatePresence>
        {flyingLetter && (
          <motion.div className="fixed pointer-events-none z-[100] flex items-center justify-center rounded-lg shadow-2xl"
            initial={{ left: flyingLetter.fromRect.left, top: flyingLetter.fromRect.top, width: flyingLetter.fromRect.width, height: flyingLetter.fromRect.height }}
            animate={{ left: flyingLetter.toRect.left, top: flyingLetter.toRect.top, width: flyingLetter.toRect.width, height: flyingLetter.toRect.height, scale: [1, 1.2, 1] }}
            transition={{ duration: .5 }}
            style={{ background: `linear-gradient(145deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid white' }}>
            <span className="font-black text-white" style={{ fontSize: letterSize, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{flyingLetter.letter}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="w-full max-w-[95%] mx-auto p-4 rounded-[2rem] relative overflow-hidden shadow-2xl"
        style={{ background: 'rgba(15,10,35,0.88)', backdropFilter: 'blur(40px)', border: '2px solid rgba(255,255,255,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="px-4 py-1.5 rounded-2xl shadow-md" style={{ background: 'rgba(255,255,255,0.98)', border: `2px solid ${item.color}88` }}>
            <span className="font-black text-xs text-gray-900">استمع ورتب الحروف</span>
          </div>
          
          <HeroDisplay item={item} isMobile showWord />
          
          <div className="flex flex-col items-center gap-1 -mt-1">
            <span className="font-black text-sm" style={{ color: '#FFFFFF', textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 10px ${item.color}` }}>{item.ar}</span>
          </div>
          
          <SoundButton onClick={() => speakGerman(item.de)} color={item.color} size={44} />
          
          <div className="flex justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {word.split('').map((l, idx) => {
              const isFilled = idx < placedIndices.length;
              return (
                <motion.div ref={el => { slotRefs.current[idx] = el; }} key={`slot-${idx}`}
                  animate={{ scale: isFilled ? [.8, 1.15, 1] : 1 }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden shadow-inner"
                  style={{
                    width: slotW, height: slotH,
                    background: isFilled ? `linear-gradient(145deg,${item.gradient[0]},${item.gradient[1]})` : 'rgba(0,0,0,0.4)',
                    borderColor: isFilled ? 'white' : `${item.color}66`, borderStyle: isFilled ? 'solid' : 'dashed',
                  }}>
                  {!isFilled && <span className="absolute inset-0 flex items-center justify-center pointer-events-none font-black" style={{ fontSize: letterSize, color: item.color, opacity: .35 }}>{l}</span>}
                  {isFilled && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-black text-white" style={{ fontSize: letterSize, textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>{l}</motion.span>}
                </motion.div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-2 max-w-full" dir="ltr">
            {shuffledLetters.map((l, idx) => {
              const placed = placedIndices.includes(idx);
              const shaking = wrongShake === idx;
              return (
                <AnimatePresence key={idx} mode="wait">
                  {!placed && (
                    <motion.button ref={el => { letterRefs.current[idx] = el; }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={shaking ? { x: [-6, 6, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: .95 }}
                      onClick={e => handleLetterClick(l, idx, e)}
                      disabled={isComplete || !!flyingLetter}
                      className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 shadow-lg"
                      style={{
                        width: slotW + 4, height: slotH + 4,
                        background: shaking ? 'linear-gradient(145deg,#EF4444,#991B1B)' : 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(235,235,245,0.95))',
                        borderColor: shaking ? '#FCA5A5' : `${item.color}bb`,
                      }}>
                      <span className="font-black" style={{ fontSize: letterSize, color: shaking ? 'white' : darkColor }}>{l}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
          
          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 font-black text-sm py-2 px-5 rounded-xl mt-2 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#58CC02,#3A8A01)', color: 'white', border: '2px solid #86EFAC' }}>
              <Check size={16} strokeWidth={3} /> ممتاز! 🎉
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// 📝 Phases
// ═══════════════════════════════════════
function ListenPhase({ item, allItems, onDone, onKarlReact, onCombo, onCorrect, isMobile }: any) {
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  useEffect(() => { setTimeout(() => speakGerman(item.de), 500); }, [item.id]);
  const handleCorrect = (cx: number, cy: number) => {
    speakGerman(item.de); playCoinSound(); onCombo(); onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy); setTimeout(onDone, 1400);
  };
  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={item.gradient.concat(['#FFD700', '#FFF'])} />
      <motion.div key={`listen-${item.id}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        className="w-full max-w-5xl mx-auto">
        <ChoiceCard item={item} allItems={allItems} isMobile={isMobile} onCorrect={handleCorrect} onWrong={() => onKarlReact('sad')} />
      </motion.div>
    </>
  );
}

function WritePhase({ item, onDone, onKarlReact, onCombo, onCorrect, isMobile }: any) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(item.deBase);
  useEffect(() => { setInput(''); setStatus('idle'); }, [item.id]);

  const handleMobileComplete = (cx: number, cy: number) => {
    playCoinSound(); onCombo(); onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy); setTimeout(onDone, 1400);
  };

  const handleCheck = (e?: React.MouseEvent) => {
    if (checkAnswer(input, item)) {
      setStatus('correct'); speakGerman(item.de); playCoinSound(); onCombo(); onKarlReact('happy');
      let cx = 0, cy = 0;
      if (e) { cx = e.clientX; cy = e.clientY; }
      else if (inputRef.current) { const r = inputRef.current.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
      setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
      onCorrect(cx, cy); setTimeout(onDone, 1000);
    } else {
      setStatus('wrong'); playBuzzSound(); onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={item.gradient.concat(['#FFD700', '#FFF'])} />
      <motion.div key={`write-${item.id}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        className="w-full max-w-5xl mx-auto">
        {isMobile ? (
          <WordBuilderMobile item={item} onComplete={handleMobileComplete} onWrong={() => onKarlReact('sad')} />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center rounded-[2rem] p-8 shadow-2xl"
            style={{ background: 'rgba(15,10,35,0.85)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <div className="lg:col-span-3 flex flex-col items-center gap-6">
              <HeroDisplay item={item} showWord />
              <SoundButton onClick={() => speakGerman(item.de)} color={item.color} label="استمع للعبارة" />
              {item.acceptedAnswers && item.acceptedAnswers.length > 1 && (
                <div className="text-center px-4 py-2 rounded-xl shadow-inner" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="text-xs mb-1.5 font-bold" style={{ color: '#FDE047', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>إجابات مقبولة أيضاً:</div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {item.acceptedAnswers.map((a: string, i: number) => (
                      <span key={i} className="text-xs font-black text-white bg-white/15 px-2.5 py-1 rounded-full border border-white/20" dir="ltr">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="text-center lg:text-right">
                <div className="text-sm font-black uppercase tracking-widest mb-2 flex items-center justify-center lg:justify-end gap-2" style={{ color: item.color, textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  <Sparkles size={14} /> Schreiben · بالألمانية
                </div>
                <div className="text-3xl font-black text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>اكتب العبارة</div>
                <div className="text-base font-bold mt-2" style={{ color: '#FDE047', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{item.ar}</div>
              </div>
              <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck} ghostText={item.deBase} color={item.color} status={status} fontSize="1.8rem" />
              {requiredChars.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[11px] font-black uppercase tracking-widest" style={{ color: '#7DD3FC', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>💡 الحروف الألمانية الخاصة</p>
                  <SpecialCharsKeyboard chars={requiredChars} onChar={c => { setInput(p => p + c); setStatus('idle'); inputRef.current?.focus(); }} color={item.color} />
                </div>
              )}
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-base py-3 rounded-xl shadow-lg"
                  style={{
                    background: status === 'correct' ? 'linear-gradient(135deg,#58CC02,#3A8A01)' : 'linear-gradient(135deg,#EF4444,#991B1B)',
                    color: 'white',
                    border: `2px solid ${status === 'correct' ? '#86EFAC' : '#FCA5A5'}`,
                  }}>
                  {status === 'correct' ? '✅ ممتاز!' : '❌ حاول مرة أخرى'}
                </motion.div>
              )}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .96 }}
                onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, borderBottom: `4px solid ${item.color}77`, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                تحقق ✓
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

function SpeakPhase({ item, isMobile, onSuccess, onSkip }: any) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'try-again' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const micRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.lang = 'de-DE'; rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 3;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const res = e.results[0]; let best = '', bestS = 0;
      for (let i = 0; i < (res as any).length; i++) {
        const t = (res as any)[i].transcript.toLowerCase().trim();
        const s = similarityScore(t, item.deBase.toLowerCase());
        if (s > bestS) { bestS = s; best = t; }
      }
      setTranscript(best); setIsListening(false);
      if (bestS >= .65) {
        setStatus('success'); playCoinSound();
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        if (micRef.current) { const r = micRef.current.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
        setTimeout(() => onSuccess(cx, cy), 1500);
      } else { setStatus('try-again'); playBuzzSound(); setAttempts(a => a + 1); }
    };
    rec.onerror = (e: any) => { setIsListening(false); if (e.error === 'not-allowed') setStatus('error'); else if (e.error !== 'no-speech') { setStatus('try-again'); setAttempts(a => a + 1); } else setStatus('idle'); };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, [item.deBase, onSuccess]);

  const handleStart = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript(''); setStatus('listening'); setIsListening(true);
    try { recognitionRef.current.start(); } catch { setIsListening(false); setStatus('error'); }
  };

  if (!supported) return (
    <div className="w-full max-w-md mx-auto p-8 rounded-[2rem] border-2 text-center shadow-2xl"
      style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)', backdropFilter: 'blur(20px)' }}>
      <div className="text-6xl mb-4">😅</div>
      <h3 className="text-2xl font-black text-white mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>المتصفح مش بيدعم النطق</h3>
      <button onClick={onSkip} className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg"
        style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})` }}>تخطي ⏭️</button>
    </div>
  );

  const micSize = isMobile ? 75 : 100;

  return (
    <motion.div key={`speak-${item.id}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-5xl mx-auto">
      <div className={isMobile ? 'mx-auto rounded-[2rem] relative overflow-hidden p-4 max-w-[95%] shadow-2xl' : 'grid lg:grid-cols-5 gap-8 items-center rounded-[2rem] p-8 shadow-2xl'}
        style={isMobile 
          ? { background: 'rgba(15,10,35,0.88)', backdropFilter: 'blur(40px)', border: '2px solid rgba(255,255,255,0.25)' }
          : { background: 'rgba(15,10,35,0.85)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)' }}>
        {!isMobile && <div className="lg:col-span-3 flex flex-col items-center gap-6"><HeroDisplay item={item} showWord /></div>}
        <div className={isMobile ? '' : 'lg:col-span-2'}>
          <div className={`${isMobile ? '' : 'relative rounded-[1.8rem] p-6 overflow-hidden shadow-inner'}`}
            style={!isMobile ? { background: 'rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.15)' } : {}}>
            <div className={`flex flex-col items-center gap-${isMobile ? '3' : '5'} w-full ${isMobile ? '' : 'relative z-10'}`}>
              {isMobile && <HeroDisplay item={item} isMobile showWord />}
              <div className="text-center">
                <h3 className={`font-black text-white flex items-center justify-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                  انطق العبارة <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🎤</motion.span>
                </h3>
              </div>
              <button onClick={() => speakGerman(item.de)}
                className="inline-flex items-center gap-2 rounded-full border-2 font-black px-4 py-1.5 text-xs shadow-lg transition-colors"
                style={{ borderColor: '#7DD3FC', background: 'rgba(6,182,212,0.25)', color: '#E0F2FE', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
                <Volume2 size={14} /> اسمع النطق
              </button>
              <motion.button ref={micRef} onClick={handleStart} disabled={isListening || status === 'success'}
                className="relative rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl mt-1"
                style={{
                  width: micSize, height: micSize,
                  background: status === 'success' ? 'linear-gradient(135deg,#58CC02,#2A6A02)' : isListening ? 'linear-gradient(135deg,#EF4444,#991B1B)' : `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`,
                  border: `4px solid ${status === 'success' ? '#86EFAC' : isListening ? '#FCA5A5' : 'rgba(255,255,255,0.5)'}`
                }}>
                {isListening && [0, .3, .6].map((d, i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#EF4444' }}
                    initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 1.5, delay: d, repeat: Infinity }} />
                ))}
                {status === 'success' ? <Check size={isMobile ? 34 : 44} className="text-white drop-shadow-md" strokeWidth={3} /> : <Mic size={isMobile ? 34 : 44} className="text-white drop-shadow-md" />}
              </motion.button>
              <div className="min-h-[3rem] flex items-center justify-center">
                {transcript && <p className="font-black text-white text-sm text-center bg-black/50 px-3 py-1 rounded-lg" dir="ltr" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>&ldquo;{transcript}&rdquo;</p>}
                {status === 'listening' && !transcript && <p className="font-black text-red-300 text-sm animate-pulse" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>🎙️ بسمعك...</p>}
                {status === 'success' && !transcript && <p className="font-black text-green-300 text-base" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>✅ نطق ممتاز!</p>}
                {status === 'try-again' && !transcript && <p className="font-black text-yellow-300 text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>😊 قريب! حاول تاني</p>}
                {status === 'error' && !transcript && <p className="font-black text-red-300 text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>❌ لازم تسمح للمايك</p>}
              </div>
              {(attempts >= 2 || status === 'error') && (
                <button onClick={onSkip}
                  className="flex items-center gap-2 rounded-2xl font-black text-white border border-white/30 bg-white/10 px-5 py-2.5 text-xs shadow-lg hover:bg-white/20 transition-colors">
                  <SkipForward size={14} /> تخطي
                </button>
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

function MatchGame({ group, onComplete, onCorrect, onKarlReact, onCombo }: any) {
  const isMobile = useIsMobile();
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<ConversationItem[]>(() => shuffle(group));
  const [dragging, setDragging] = useState<DragSource | null>(null);
  const [overTarget, setOverTarget] = useState<DragSource | null>(null);
  const [wrongPair, setWrongPair] = useState<{ id: string; otherId: string } | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const touchDragging = useRef<DragSource | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => { setShuffledWords(shuffle(group)); setMatched(new Set()); setErrors(0); }, [group]);
  useEffect(() => { if (matched.size === group.length) { onKarlReact('celebrate'); setTimeout(onComplete, 1000); } }, [matched]);

  const tryMatch = (src: DragSource, tgt: DragSource, cx: number, cy: number) => {
    if (src.side === tgt.side) return;
    if (src.id === tgt.id) {
      const it = group.find((x: ConversationItem) => x.id === src.id)!;
      speakGerman(it.de); playCoinSound(); onCombo(); onKarlReact('happy'); onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
      setMatched(p => new Set([...p, src.id]));
    } else {
      playBuzzSound(); onKarlReact('sad'); setErrors(e => e + 1);
      setWrongPair({ id: tgt.id, otherId: src.id }); setTimeout(() => setWrongPair(null), 600);
    }
  };

  const onTouchStart = (e: React.TouchEvent, src: DragSource) => {
    if (matched.has(src.id)) return;
    touchDragging.current = src;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.95;pointer-events:none;z-index:9998;border-radius:16px;transform:scale(1.1);box-shadow:0 15px 30px rgba(0,0,0,0.5);`;
    document.body.appendChild(clone); touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current || !touchDragging.current) return;
    touchCloneRef.current.style.left = (e.touches[0].clientX - touchOffRef.current.x) + 'px';
    touchCloneRef.current.style.top = (e.touches[0].clientY - touchOffRef.current.y) + 'px';
    const opp = touchDragging.current.side === 'image' ? 'word' : 'image';
    let found: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${opp}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.touches[0].clientX >= r.left && e.touches[0].clientX <= r.right && e.touches[0].clientY >= r.top && e.touches[0].clientY <= r.bottom)
        found = { id: (el as HTMLElement).dataset.matchTarget!, side: opp as any };
    });
    setOverTarget(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    if (!touchDragging.current) { setOverTarget(null); return; }
    const opp = touchDragging.current.side === 'image' ? 'word' : 'image';
    let dropped: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${opp}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.changedTouches[0].clientX >= r.left && e.changedTouches[0].clientX <= r.right && e.changedTouches[0].clientY >= r.top && e.changedTouches[0].clientY <= r.bottom)
        dropped = { id: (el as HTMLElement).dataset.matchTarget!, side: opp as any };
    });
    if (dropped) tryMatch(touchDragging.current, dropped, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    setOverTarget(null); touchDragging.current = null;
  };

  const cardW = isMobile ? 65 : 105, cardH = isMobile ? 82 : 128;

  const renderCard = (item: ConversationItem, side: 'image' | 'word') => {
    const isMatched = matched.has(item.id);
    const isWrong = wrongPair?.id === item.id || wrongPair?.otherId === item.id;
    const isOver = overTarget?.id === item.id && overTarget?.side === side && !isMatched;
    
    // ✅ حجم الخط بيتكيف
    const deLen = item.deBase.length;
    const deFontSize = isMobile 
      ? (deLen > 10 ? '.65rem' : deLen > 7 ? '.75rem' : '.85rem')
      : (deLen > 10 ? '.9rem' : deLen > 7 ? '1rem' : '1.15rem');

    if (isMatched) return (
      <div key={`${side}-${item.id}`} style={{ width: cardW, height: cardH, opacity: .3 }}
        className="rounded-2xl border-2 border-dashed border-green-500/50 flex items-center justify-center bg-green-900/20">
        <Check size={24} className="text-green-400" />
      </div>
    );
    return (
      <motion.div key={`${side}-${item.id}`} data-match-target={item.id} data-side={side}
        draggable
        onDragStart={() => setDragging({ id: item.id, side })}
        onDragEnd={() => { setDragging(null); setOverTarget(null); }}
        onDragOver={e => { e.preventDefault(); if (dragging && dragging.side !== side) setOverTarget({ id: item.id, side }); }}
        onDragLeave={() => setOverTarget(null)}
        onDrop={e => { e.preventDefault(); setOverTarget(null); if (dragging) tryMatch(dragging, { id: item.id, side }, e.clientX, e.clientY); setDragging(null); }}
        onTouchStart={e => onTouchStart(e, { id: item.id, side })} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onClick={() => speakGerman(item.de)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }}
        animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : isOver ? { scale: 1.08 } : {}}
        className="relative select-none rounded-2xl overflow-hidden shadow-xl"
        style={{
          width: cardW, height: cardH, cursor: 'grab',
          border: `2px solid ${isOver ? 'white' : isWrong ? '#FCA5A5' : 'rgba(255,255,255,0.35)'}`,
          background: isWrong ? 'linear-gradient(180deg,#EF4444,#991B1B)' : `linear-gradient(180deg,${item.gradient[0]},${item.gradient[1]})`,
        }}>
        {side === 'image'
          ? <div className="w-full h-full flex items-center justify-center" style={{ fontSize: isMobile ? '2.8rem' : '4rem', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.5))' }}>{item.emoji}</div>
          : <div className="w-full h-full flex flex-col items-center justify-center px-1.5 gap-1 bg-black/20">
              <span className="font-black text-white text-center" style={{ fontSize: deFontSize, lineHeight: 1.15, textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>{item.deBase}</span>
              <span className="font-black text-center bg-black/50 px-2 py-0.5 rounded-md" style={{ fontSize: isMobile ? '8px' : '11px', color: '#FDE047', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{item.ar}</span>
            </div>}
        {isOver && <motion.div className="absolute inset-0 pointer-events-none border-4 border-white rounded-2xl" animate={{ opacity: [.4, 1, .4] }} transition={{ duration: 1, repeat: Infinity }} />}
      </motion.div>
    );
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#A78BFA', '#9D4EDD', '#FFF']} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto flex flex-col items-center gap-3 p-4 md:p-8 rounded-[2.5rem] shadow-2xl"
        style={{ background: 'rgba(15,10,35,0.75)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)' }}>
        <div className="flex items-center gap-3 w-full max-w-2xl px-3 py-2 rounded-2xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
          <div className="px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(236,72,153,0.5))', border: '1.5px solid rgba(167,139,250,0.6)' }}>
            <Sparkles size={12} className="text-yellow-300" />
            <span className="text-[10px] md:text-xs font-black text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>طابق العبارة</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/20">
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#58CC02,#A78BFA,#EC4899)' }}
                animate={{ width: `${(matched.size / group.length) * 100}%` }} />
            </div>
            <span className="text-xs font-black text-white bg-white/15 px-2 py-0.5 rounded-lg">{matched.size}/{group.length}</span>
          </div>
          {errors > 0 && <div className="px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1" style={{ background: 'rgba(239,68,68,0.3)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.5)' }}><X size={10} /> {errors}</div>}
        </div>
        <div className="w-full flex flex-col items-center gap-2 mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#7DD3FC', background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>الرموز</span>
          <div className="flex items-center justify-center gap-2 flex-wrap" dir="ltr">{group.map((c: ConversationItem) => renderCard(c, 'image'))}</div>
        </div>
        <div className="w-full max-w-xs flex items-center gap-2 my-1 opacity-60">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <Sparkles size={12} className="text-white/50" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="w-full flex flex-col items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#F9A8D4', background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>العبارات — اسحب</span>
          <div className="flex items-center justify-center gap-2 flex-wrap" dir="ltr">{shuffledWords.map(w => renderCard(w, 'word'))}</div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// 🏠 Main
// ═══════════════════════════════════════
function GermanConversationLessonInner() {
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

  const currentGroup = CONVERSATION_GROUPS[groupIdx];
  const currentItem = currentGroup?.numbers[itemIdx];
  const treasureState: 'closed' | 'half' | 'opend' = correctInGroup < 2 ? 'closed' : correctInGroup < 5 ? 'half' : 'opend';

  useEffect(() => {
    const load = async () => {
      const p = await getLessonProgress(LESSON_ID);
      if (p) {
        setTotalStars(p.stars);
        if (!p.completed) {
          if (p.current_group != null) setGroupIdx(p.current_group);
          if (p.current_letter != null) setItemIdx(p.current_letter);
          if (p.current_phase) setPhase(p.current_phase as Phase);
        }
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    const msg = mood === 'sad' ? SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)] : ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setKarlMessage(msg);
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  const handleCombo = () => { };

  const calcRating = (s: number) => { const r = s / (CONVERSATIONS.length * 3); return r >= .67 ? 3 : r >= .34 ? 2 : 1; };
  const savePos = (g: number, i: number, p: Phase) => saveLessonProgress(LESSON_ID, calcRating(totalStars), false, { current_group: g, current_letter: i, current_phase: p });

  const handleCorrect = useCallback((cx: number, cy: number) => {
    addPoints(10); incStreak();
    setCorrectInGroup(prev => {
      const next = prev + 1;
      setTimeout(() => {
        const el = document.getElementById('star-target');
        if (el) { const r = el.getBoundingClientRect(); const id = Date.now() + Math.random(); setFlyingItems(p => [...p, { id, startX: cx, startY: cy, endX: r.left + r.width / 2, endY: r.top + r.height / 2, type: 'star' }]); setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addStar(); }, 1100); }
      }, 100);
      setTimeout(() => {
        const el = document.getElementById('level-bar-target');
        if (el) { const r = el.getBoundingClientRect(); const id = Date.now() + Math.random(); setFlyingItems(p => [...p, { id, startX: cx, startY: cy, endX: r.left + r.width / 2, endY: r.top + r.height / 2, type: 'energy' }]); setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addLevelProgress(); }, 1100); }
      }, 400);
      if (next === 5) {
        setTimeout(() => {
          const t = document.getElementById('treasure-box'), g = document.getElementById('gem-target');
          if (t && g) { const tr = t.getBoundingClientRect(), gr = g.getBoundingClientRect(); for (let i = 0; i < 5; i++) setTimeout(() => { const id = Date.now() + Math.random() + i; setFlyingItems(p => [...p, { id, startX: tr.left + tr.width / 2, startY: tr.top + tr.height / 2, endX: gr.left + gr.width / 2, endY: gr.top + gr.height / 2, type: 'gem' }]); setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addGems(1); }, 1100); }, i * 150); }
        }, 700);
      }
      return next;
    });
    setTotalStars(t => t + 1);
  }, [addPoints, incStreak, addStar, addLevelProgress, addGems]);

  const handleListenDone = () => { setPhase('write'); savePos(groupIdx, itemIdx, 'write'); };
  const handleWriteDone = () => { setPhase('speak'); savePos(groupIdx, itemIdx, 'speak'); };
  const handleSpeakDone = () => {
    if (itemIdx < currentGroup.numbers.length - 1) { const n = itemIdx + 1; setItemIdx(n); setPhase('listen'); savePos(groupIdx, n, 'listen'); }
    else { setPhase('test'); savePos(groupIdx, itemIdx, 'test'); }
  };

  const nextGroup = async () => {
    if (groupIdx < CONVERSATION_GROUPS.length - 1) {
      const n = groupIdx + 1; setGroupIdx(n); setItemIdx(0); setPhase('listen');
      setTestSuccess(false); setCorrectInGroup(0); savePos(n, 0, 'listen');
    } else {
      await saveLessonProgress(LESSON_ID, 3, true);
      router.push('/character-and-map?from=lesson&map=5');
    }
  };

  const goHome = () => router.push('/character-and-map?from=lesson&map=5');

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
      <div className="flex flex-col items-center gap-4">
        <div className="text-7xl animate-bounce">💬</div>
        <p className="text-white font-black text-lg tracking-widest animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );

  if (!currentGroup || !currentItem) return null;

  return (
    <div className="text-white relative" style={{ fontFamily: "'Tajawal',sans-serif", minHeight: '100vh', overflowX: 'hidden' }} dir="rtl">
      <ScreenBackground groupIdx={groupIdx} isMobile={isMobile} activeColor={currentItem.color} />
      {!(isMobile && isKeyboardOpen) && (
        <div style={{ transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', transformOrigin: 'bottom right', position: 'fixed', bottom: isMobile ? 110 : 130, right: 0, zIndex: 25, pointerEvents: 'none' }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#9D4EDD" />
        </div>
      )}
      <FlyingItems items={flyingItems} />
      <TopHUD stats={stats} level={stats.level} currentStep={itemIdx} totalSteps={currentGroup.numbers.length} onHome={goHome} isMobile={isMobile} />
      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{ zIndex: 10, minHeight: '100vh', maxWidth: '1400px', paddingTop: isMobile ? '110px' : '130px', paddingBottom: isMobile ? '95px' : '120px' }}>
        <AnimatePresence mode="wait">
          {phase === 'listen' && <ListenPhase key={`l-${groupIdx}-${itemIdx}`} item={currentItem} allItems={CONVERSATIONS} onDone={handleListenDone} onKarlReact={handleKarlReact} onCombo={handleCombo} onCorrect={handleCorrect} isMobile={isMobile} />}
          {phase === 'write' && <WritePhase key={`w-${groupIdx}-${itemIdx}`} item={currentItem} onDone={handleWriteDone} onKarlReact={handleKarlReact} onCombo={handleCombo} onCorrect={handleCorrect} isMobile={isMobile} />}
          {phase === 'speak' && <SpeakPhase key={`s-${groupIdx}-${itemIdx}`} item={currentItem} isMobile={isMobile} onSuccess={(cx: number, cy: number) => { handleCorrect(cx, cy); handleKarlReact('celebrate'); setTimeout(handleSpeakDone, 800); }} onSkip={handleSpeakDone} />}
          {phase === 'test' && !testSuccess && <MatchGame key={`m-${groupIdx}`} group={currentGroup.numbers} onComplete={() => setTestSuccess(true)} onCorrect={handleCorrect} onKarlReact={handleKarlReact} onCombo={handleCombo} />}
          {testSuccess && (
            <motion.div key="success" initial={{ opacity: 0, scale: .85, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-6 text-center px-8 py-10 max-w-md mx-auto rounded-[3rem] shadow-[0_0_100px_rgba(157,78,221,0.4)]"
              style={{ background: 'rgba(15,10,35,0.9)', border: '2px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(30px)' }}>
              <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }} className="text-[8rem] drop-shadow-2xl">🏆</motion.div>
              <div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-2" style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.3)' }}>أداء أسطوري! 🎉</h2>
                <p className="text-white text-lg font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>أنهيت قسم "{currentGroup.title}" بنجاح</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: .95 }} onClick={nextGroup}
                className="font-black px-12 py-5 rounded-3xl text-lg text-white w-full border border-white/30 shadow-xl"
                style={{ background: 'linear-gradient(135deg,#9D4EDD,#5A189A)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {groupIdx < CONVERSATION_GROUPS.length - 1 ? 'المجموعة التالية 🚀' : '🗺️ رجوع للخريطة'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!testSuccess && <BottomHUD stats={stats} treasureState={treasureState} onHint={useHint} onMap={goHome} isMobile={isMobile} />}
    </div>
  );
}

export default function GermanConversationLesson() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#07090D]"><div className="text-6xl animate-bounce">💬</div></div>}>
      <GermanConversationLessonInner />
    </Suspense>
  );
}
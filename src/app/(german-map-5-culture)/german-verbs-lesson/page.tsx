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

import { VERBS, VERB_GROUPS, type VerbItem } from '@/data/german/map-5-culture/anna-amalia-verbs';

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

const TOTAL_VERBS = VERBS.length;
const TOTAL_ANSWERS_PER_LESSON = TOTAL_VERBS * 3;
const LESSON_ID = 'anna-amalia-library';
const VERB_IMAGES: Record<string, string> = {};

const ARTIKEL_COLORS = {
  der: '#3B82F6',
  die: '#EC4899',
  das: '#10B981',
};

const DARK_COLORS: Record<string, string> = {
  '#4CC9F0': '#075985', '#F72585': '#831843', '#7209B7': '#4C1D95',
  '#06D6A0': '#064E3B', '#FBBF24': '#7D5310', '#3B82F6': '#1E3A8A',
  '#EC4899': '#831843', '#F77F00': '#9A3412', '#10B981': '#064E3B',
  '#A78BFA': '#5B21B6', '#0EA5E9': '#075985', '#F472B6': '#9D174D',
  '#EF4444': '#7F1D1D', '#22C55E': '#15803D', '#8B5CF6': '#4C1D95',
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

function checkAnswer(input: string, item: VerbItem): boolean {
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

function generateChoices(correctId: string, all: VerbItem[], count = 3): VerbItem[] {
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
  return `/card-image/verbs/bg-group${Math.min(groupIdx + 1, 3)}-${suffix}.webp`;
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
        style={{ background: 'linear-gradient(180deg,rgba(10,5,30,.6) 0%,rgba(10,5,30,.3) 40%,rgba(10,5,30,.3) 60%,rgba(10,5,30,.6) 100%)' }} />
      <motion.div className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%,${activeColor}33,transparent 70%)` }}
        animate={{ opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 4, repeat: Infinity }} />
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
            <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                height: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                background: isActive ? 'linear-gradient(135deg,#9D4EDD,#7209B7)' : isDone ? 'linear-gradient(135deg,#58CC02,#4AA802)' : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#9D4EDD' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(157,78,221,0.6)' : isDone ? '0 0 6px rgba(88,204,2,0.4)' : 'none',
              }}>
              {isLocked ? '🔒' : isDone ? '✓' : i + 1}
            </motion.div>
            {i < totalSteps - 1 && <div className={`${isMobile ? 'w-1' : 'w-3 md:w-4'} h-0.5`} style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />}
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
      <div className="fixed top-0 left-0 right-0 z-30 px-2" style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 2px)' }}>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: '#FFD700', boxShadow: '0 0 10px rgba(255,215,0,0.5)', background: 'linear-gradient(135deg,#4CC9F0,#7209B7)' }}>
              <img src="/characters/karl-3d.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#4CC9F0,#7209B7)' }}
                    animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
            <motion.div className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{ background: 'rgba(15,10,45,0.7)', border: '1px solid rgba(255,215,0,0.35)' }}>
              <img id="star-target" src="/treasuer/star.png" alt="" className="w-3 h-3 flex-shrink-0" />
              <span className="font-black text-[10px] text-white truncate">{stats.points}</span>
            </motion.div>
            <motion.div className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{ background: 'rgba(15,10,45,0.7)', border: '1px solid rgba(255,77,109,0.35)' }}>
              <Flame size={12} className="text-orange-400 flex-shrink-0" style={{ fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.streak}</span>
            </motion.div>
            <motion.div className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{ background: 'rgba(15,10,45,0.7)', border: '1px solid rgba(157,78,221,0.35)' }}>
              <Gem id="gem-target" size={12} className="text-purple-300 flex-shrink-0" style={{ fill: '#9D4EDD' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.gems}</span>
            </motion.div>
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(15,10,45,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Home size={14} className="text-white" />
          </motion.button>
        </div>
        <div className="flex justify-center" style={{ marginTop: '2.5px' }}>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
            style={{ background: 'rgba(15,10,45,0.7)', border: '1px solid rgba(255,255,255,0.18)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6" style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 10px)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2"
            style={{ borderColor: '#FFD700', background: 'linear-gradient(135deg,#4CC9F0,#7209B7)' }}>
            <img src="/characters/karl-3d.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/80 mb-0.5">المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white">{level}</span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#4CC9F0,#7209B7)' }}
                  animate={{ width: `${stats.levelProgress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.18)' }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={false} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', border: '2px solid rgba(157,78,221,0.35)' }}>
            <span className="font-black text-sm text-white">{stats.gems}</span>
            <Gem id="gem-target" size={18} className="text-purple-300" style={{ fill: '#9D4EDD' }} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', border: '2px solid rgba(255,77,109,0.35)' }}>
            <span className="font-black text-sm text-white">{stats.streak}</span>
            <Flame size={18} className="text-orange-400" style={{ fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
            style={{ background: 'rgba(15,10,45,0.65)', border: '2px solid rgba(255,215,0,0.35)' }}>
            <span className="font-black text-sm text-white">{stats.points}</span>
            <img id="star-target" src="/treasuer/star.png" alt="" className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(15,10,45,0.65)', border: '2px solid rgba(255,255,255,0.18)' }}>
            <Home size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

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
                {item.type === 'star' && <img src="/treasuer/star.png" alt="" className="w-10 h-10" />}
                {item.type === 'energy' && <img src="/treasuer/energy.png" alt="" className="w-10 h-10" />}
                {item.type === 'gem' && <Gem size={36} fill="#9D4EDD" className="text-purple-200" />}
              </div>
            </div>
          </motion.div>
        </div>
      );
    })}
  </>;
}

function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  const Btn = ({ label, color, onClick, badge, disabled, iconSrc }: any) => (
    <motion.button whileHover={!disabled ? { scale: 1.1 } : {}} whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick} disabled={disabled} className="flex flex-col items-center gap-0.5 disabled:opacity-70">
      <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
        <img src={iconSrc} alt="" className="w-full h-full object-contain" style={{ filter: `drop-shadow(0 2px 8px ${color}aa)` }} />
        {badge > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: '#FF4D6D' }}>{badge}</div>}
      </div>
      <span className="text-[7px] md:text-[9px] font-black" style={{ color }}>{label}</span>
    </motion.button>
  );
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 4px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'max-w-[1400px]'}`}>
        <div className="rounded-xl px-3 md:px-6 py-1 md:py-1.5"
          style={{ background: 'linear-gradient(135deg,rgba(20,15,55,0.85),rgba(15,10,45,0.9))', backdropFilter: 'blur(30px)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-yellow-300" />
            <span className="text-[8px] font-black text-yellow-200 tracking-wider uppercase">مكافآت الإنجاز</span>
            <Sparkles size={8} className="text-yellow-300" />
          </div>
          <div className="flex items-end justify-around gap-2">
            <Btn onClick={onMap} label="خريطة" color="#4CC9F0" iconSrc="/treasuer/map-icon.png" />
            <Btn label="نجوم" color="#FFD700" disabled iconSrc="/treasuer/star.png" />
            <div id="treasure-box" className="flex flex-col items-center gap-0.5">
              <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
                <img src={`/treasuer/${treasureState}.png`} alt="" className="w-full h-full object-contain" />
              </div>
              <span className="text-[7px] font-black text-yellow-400">صندوق</span>
            </div>
            <Btn label="طاقة" color="#4CC9F0" disabled iconSrc="/treasuer/energy.png" />
            <Btn onClick={onHint} label="تلميح" color="#FFD700" badge={stats.hints} disabled={stats.hints === 0} iconSrc="/treasuer/HINT.svg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SoundButton({ onClick, color, label, size = 40 }: { onClick: () => void; color: string; label?: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  const go = () => { setPlaying(true); onClick(); setTimeout(() => setPlaying(false), 1500); };
  if (label) return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={go}
      className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white"
      style={{ background: `linear-gradient(135deg,${color}cc,${color}88)`, border: `1px solid ${color}` }}>
      <Volume2 size={16} /><span>{label}</span>
    </motion.button>
  );
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={go}
      className="rounded-full flex items-center justify-center border-2 relative flex-shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#9D4EDD,#7209B7)', borderColor: 'rgba(255,255,255,0.4)' }}>
      {playing && [0, .2, .4].map((d, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none" style={{ borderColor: '#9D4EDD' }}
          initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 1, delay: d }} />
      ))}
      <Volume2 size={size * .4} className="text-white" />
    </motion.button>
  );
}

function ArtikelBadge({ artikel, size = 'md' }: { artikel?: 'der' | 'die' | 'das'; size?: 'sm' | 'md' }) {
  if (!artikel) return null;
  const color = ARTIKEL_COLORS[artikel];
  const cls = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
      className={`inline-flex items-center gap-1 rounded-lg font-black ${cls}`}
      style={{ background: `linear-gradient(135deg,${color},${color}cc)`, color: 'white', border: `1px solid ${color}` }}>
      <span className="uppercase tracking-wide">{artikel}</span>
    </motion.div>
  );
}

// 🆕 Conjugation Table - مميز للأفعال
function ConjugationTable({ item, isMobile }: { item: VerbItem; isMobile?: boolean }) {
  if (!item.conjugation) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${isMobile ? 'p-2' : 'p-3'} rounded-2xl border-2`}
      style={{
        background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`,
        borderColor: `${item.color}66`,
      }}
    >
      <div className={`text-center font-black ${isMobile ? 'text-[10px]' : 'text-xs'} mb-2`} style={{ color: item.color }}>
        تصريف الفعل
      </div>
      <div className={`grid grid-cols-3 gap-2 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
        {[
          { pron: 'ich', val: item.conjugation.ich },
          { pron: 'du', val: item.conjugation.du },
          { pron: 'er/sie', val: item.conjugation.er_sie_es },
        ].map((c, i) => (
          <div key={i} className="text-center">
            <div className="font-bold text-white/60 mb-0.5">{c.pron}</div>
            <div className="font-black text-white" dir="ltr" style={{ textShadow: `0 1px 4px ${item.color}` }}>
              {c.val}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HeroDisplay({ item, isMobile, showWord = false }: { item: VerbItem; isMobile?: boolean; showWord?: boolean }) {
  const size = isMobile ? 200 : 320;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-8 rounded-3xl blur-3xl"
        style={{ background: `radial-gradient(circle,${item.color}66,transparent 70%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [.4, .7, .4] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
        className="relative w-full h-full select-none flex items-center justify-center"
        style={{ filter: `drop-shadow(0 10px 25px ${item.color}99)` }}>
        <div className="text-center" style={{ fontSize: isMobile ? '8rem' : '12rem', lineHeight: 1 }}>{item.emoji}</div>
      </motion.div>
      {showWord && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl whitespace-nowrap z-10"
          style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid rgba(255,255,255,0.4)' }}>
          <span className="font-black text-white text-sm md:text-base">{item.de}</span>
        </motion.div>
      )}
      {[{ x: '0%', y: '5%', d: 0, s: 14 }, { x: '95%', y: '10%', d: .5, s: 12 }, { x: '-2%', y: '85%', d: 1, s: 13 }, { x: '97%', y: '88%', d: 1.5, s: 11 }
      ].map((star, i) => (
        <motion.div key={i} className="absolute pointer-events-none z-20" style={{ left: star.x, top: star.y }}
          animate={{ scale: [0, 1, 0], rotate: [0, 180, 360], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: star.d }}>
          <Sparkles size={star.s} style={{ color: item.color }} />
        </motion.div>
      ))}
    </div>
  );
}

function ChoiceCard({ item, allItems, isMobile, onCorrect, onWrong }: {
  item: VerbItem; allItems: VerbItem[]; isMobile: boolean;
  onCorrect: (cx: number, cy: number) => void; onWrong: () => void;
}) {
  const [choices, setChoices] = useState<VerbItem[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');

  useEffect(() => {
    setChoices(generateChoices(item.id, allItems, 3));
    setHiddenIds(new Set()); setWrongId(null); setStatus('idle');
  }, [item.id]);

  const handleChoice = (c: VerbItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenIds.has(c.id)) return;
    if (c.id === item.id) {
      setHiddenIds(p => new Set(p).add(c.id)); setStatus('correct');
      onCorrect(e.clientX, e.clientY);
    } else {
      setWrongId(c.id); playBuzzSound(); onWrong();
      setTimeout(() => setWrongId(null), 600);
    }
  };

  const cardSize = isMobile ? 75 : 130;

  return (
    <div className={`w-full ${isMobile ? 'max-w-md' : 'max-w-3xl'} mx-auto ${isMobile ? 'p-3' : 'p-6'} rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden`}
      style={{ background: 'rgba(20,15,55,0.55)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)', boxShadow: `0 20px 60px rgba(0,0,0,0.5),0 0 50px ${item.color}33` }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />
      <div className={`relative z-10 flex flex-col items-center ${isMobile ? 'gap-2.5' : 'gap-4'}`}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`${isMobile ? 'px-4 py-1.5' : 'px-6 py-2.5'} rounded-2xl`}
          style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,245,255,0.9))', border: `2px solid ${item.color}66` }}>
          <span className={`font-black ${isMobile ? 'text-xs' : 'text-base'} text-gray-800`}>استمع جيداً واختر الفعل الصحيح</span>
        </motion.div>
        <motion.span className="font-black text-white" style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', textShadow: `0 4px 15px ${item.color}`, direction: 'ltr' }}
          animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          {item.deBase}
        </motion.span>
        <div className={`px-3 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-base'} font-black`}
          style={{ background: `${item.color}33`, border: `1.5px solid ${item.color}66`, color: 'white' }}>
          {item.ar}
        </div>
        <SoundButton onClick={() => speakGerman(item.de)} color={item.color} size={isMobile ? 45 : 55} />
        <span className={`font-black text-white ${isMobile ? 'text-xs' : 'text-base'}`}>اضغط على الرمز الصحيح 👇</span>
        <div className={`flex items-center justify-center ${isMobile ? 'gap-2.5' : 'gap-5'} w-full`} dir="ltr">
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
                    className="relative rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2"
                    style={{
                      width: cardSize, height: cardSize,
                      background: isWrong ? 'linear-gradient(145deg,#FF4444,#CC0000)' : 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,245,255,0.95))',
                      borderColor: isWrong ? '#FF4444' : `${c.color}aa`,
                      boxShadow: isWrong ? '0 8px 25px rgba(255,68,68,0.6)' : `0 8px 25px ${c.color}66`,
                    }}>
                    <span style={{ fontSize: isMobile ? '3rem' : '5rem', lineHeight: 1 }}>{c.emoji}</span>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>
        <AnimatePresence>
          {status === 'correct' && (
            <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 font-black ${isMobile ? 'text-xs py-1 px-3' : 'text-sm py-2 px-5'} rounded-xl`}
              style={{ background: 'rgba(88,204,2,0.3)', color: '#58CC02', border: '1.5px solid #58CC0288' }}>
              <Check size={isMobile ? 12 : 16} /> ممتاز! 🎉
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {status === 'correct' && item.conjugation && (
            <ConjugationTable item={item} isMobile={isMobile} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {status === 'correct' && item.exampleDe && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}
              className={`text-center ${isMobile ? 'px-3 py-1.5' : 'px-5 py-3'} rounded-xl bg-white/5 border border-white/10`}>
              <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-white/90`} dir="ltr">{item.exampleDe}</div>
              <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/60 mt-0.5`}>{item.exampleAr}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}function WordBuilderMobile({ item, onComplete, onWrong }: {
  item: VerbItem; onComplete: (cx: number, cy: number) => void; onWrong: () => void;
}) {
  const word = item.deBase.split(' ')[0];
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
            setTimeout(() => onComplete(e.clientX, e.clientY), 600);
          }
        }, 600);
      }
    } else {
      setWrongShake(idx); playBuzzSound(); onWrong();
      setTimeout(() => setWrongShake(null), 600);
    }
  };

  return (
    <>
      <AnimatePresence>
        {flyingLetter && (
          <motion.div className="fixed pointer-events-none z-[100] flex items-center justify-center rounded-lg"
            initial={{ left: flyingLetter.fromRect.left, top: flyingLetter.fromRect.top, width: flyingLetter.fromRect.width, height: flyingLetter.fromRect.height }}
            animate={{ left: flyingLetter.toRect.left, top: flyingLetter.toRect.top, width: flyingLetter.toRect.width, height: flyingLetter.toRect.height, scale: [1, 1.2, 1] }}
            transition={{ duration: .6 }}
            style={{ background: `linear-gradient(145deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid rgba(255,255,255,0.6)' }}>
            <span className="font-black text-white text-2xl">{flyingLetter.letter}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-md mx-auto p-3 rounded-[1.5rem] relative overflow-hidden"
        style={{ background: 'rgba(20,15,55,0.45)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%,${item.color}33,transparent 60%)` }} />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.95)', border: `2px solid ${item.color}66` }}>
            <span className="font-black text-xs text-gray-800">استمع ورتب الحروف</span>
          </div>
          <HeroDisplay item={item} isMobile showWord />
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs" style={{ color: item.color }}>{item.ar}</span>
          </div>
          <SoundButton onClick={() => speakGerman(item.de)} color={item.color} size={38} />
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {word.split('').map((l, idx) => {
              const isFilled = idx < placedIndices.length;
              return (
                <motion.div ref={el => { slotRefs.current[idx] = el; }} key={`slot-${idx}`}
                  animate={{ scale: isFilled ? [.8, 1.15, 1] : 1 }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden"
                  style={{
                    width: 34, height: 42,
                    background: isFilled ? `linear-gradient(145deg,${item.gradient[0]},${item.gradient[1]})` : 'rgba(255,255,255,0.05)',
                    borderColor: isFilled ? item.color : `${item.color}55`, borderStyle: isFilled ? 'solid' : 'dashed',
                  }}>
                  {!isFilled && <span className="absolute inset-0 flex items-center justify-center pointer-events-none font-black text-xl" style={{ color: item.color, opacity: .25 }}>{l}</span>}
                  {isFilled && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-black text-white text-xl">{l}</motion.span>}
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {shuffledLetters.map((l, idx) => {
              const placed = placedIndices.includes(idx);
              const shaking = wrongShake === idx;
              return (
                <AnimatePresence key={idx} mode="wait">
                  {!placed && (
                    <motion.button ref={el => { letterRefs.current[idx] = el; }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={shaking ? { x: [-6, 6, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: .95 }}
                      onClick={e => handleLetterClick(l, idx, e)}
                      disabled={isComplete || !!flyingLetter}
                      className="rounded-lg flex items-center justify-center flex-shrink-0 border-2"
                      style={{
                        width: 40, height: 40,
                        background: shaking ? 'linear-gradient(145deg,#FF4444,#CC0000)' : 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,245,255,0.95))',
                        borderColor: shaking ? '#FF4444' : `${item.color}aa`,
                      }}>
                      <span className="font-black text-xl" style={{ color: shaking ? 'white' : darkColor }}>{l}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
          {isComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 font-black text-sm py-1.5 px-4 rounded-xl"
              style={{ background: 'rgba(88,204,2,0.3)', color: '#58CC02' }}>
              <Check size={14} /> ممتاز! 🎉
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

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
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <HeroDisplay item={item} showWord />
              <SoundButton onClick={() => speakGerman(item.de)} color={item.color} label="استمع للكلمة" />
              {item.conjugation && <ConjugationTable item={item} />}
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${item.color}aa` }}>Schreiben · بالألمانية</div>
                <div className="text-2xl font-black text-white">اكتب الفعل</div>
                <div className="text-sm font-bold text-white/40 mt-1">{item.ar}</div>
              </div>
              <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck} ghostText={item.deBase} color={item.color} status={status} fontSize="1.8rem" />
              {requiredChars.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[10px] font-black text-white/40 uppercase">💡 الحروف الخاصة</p>
                  <SpecialCharsKeyboard chars={requiredChars} onChar={c => { setInput(p => p + c); setStatus('idle'); inputRef.current?.focus(); }} color={item.color} />
                </div>
              )}
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl"
                  style={{
                    background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    color: status === 'correct' ? '#22c55e' : '#ef4444',
                  }}>
                  {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                </motion.div>
              )}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .96 }}
                onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25"
                style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, borderBottom: `4px solid ${item.color}77` }}>
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
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl border-2 text-center" style={{ background: 'rgba(255,107,107,0.1)', borderColor: 'rgba(255,107,107,0.3)' }}>
      <div className="text-5xl mb-3">😅</div>
      <h3 className="text-xl font-black text-white mb-2">المتصفح مش بيدعم النطق</h3>
      <button onClick={onSkip} className="px-8 py-3 rounded-2xl font-black text-white"
        style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})` }}>تخطي ⏭️</button>
    </div>
  );

  const micSize = isMobile ? 64 : 96;

  return (
    <motion.div key={`speak-${item.id}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-5xl mx-auto">
      <div className={isMobile ? 'mx-auto rounded-[1.5rem] relative overflow-hidden p-3 max-w-md' : 'grid lg:grid-cols-5 gap-8 items-center'}
        style={isMobile ? { background: 'rgba(20,15,55,0.55)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)' } : {}}>
        {!isMobile && <div className="lg:col-span-3 flex flex-col items-center gap-4"><HeroDisplay item={item} showWord /></div>}
        <div className={isMobile ? '' : 'lg:col-span-2'}>
          <div className={`${isMobile ? '' : 'relative rounded-[1.8rem] p-6 overflow-hidden'}`}
            style={!isMobile ? { background: 'rgba(20,15,55,0.55)', backdropFilter: 'blur(30px)', border: '2px solid rgba(255,255,255,0.2)' } : {}}>
            <div className={`flex flex-col items-center gap-${isMobile ? '2' : '4'} w-full ${isMobile ? '' : 'relative z-10'}`}>
              {isMobile && <HeroDisplay item={item} isMobile showWord />}
              <div className="text-center">
                <h3 className={`font-black text-white flex items-center justify-center gap-1.5 ${isMobile ? 'text-base' : 'text-2xl'}`}>
                  انطق الفعل <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🎤</motion.span>
                </h3>
              </div>
              <button onClick={() => speakGerman(item.de)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 text-white/80 font-bold px-3 py-1 text-xs">
                <Volume2 size={12} /> اسمع
              </button>
              <motion.button ref={micRef} onClick={handleStart} disabled={isListening || status === 'success'}
                className="relative rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  width: micSize, height: micSize,
                  background: status === 'success' ? 'linear-gradient(135deg,#58CC02,#096A02)' : isListening ? 'linear-gradient(135deg,#FF4444,#C70039)' : `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`,
                }}>
                {isListening && [0, .3, .6].map((d, i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#FF4444' }}
                    initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1.5, delay: d, repeat: Infinity }} />
                ))}
                {status === 'success' ? <Check size={isMobile ? 30 : 42} className="text-white" strokeWidth={3} /> : <Mic size={isMobile ? 30 : 42} className="text-white" />}
              </motion.button>
              {transcript && <p className="font-black text-white text-sm text-center" dir="ltr">&ldquo;{transcript}&rdquo;</p>}
              {status === 'listening' && <p className="font-black text-red-400 text-xs">🎙️ بسمعك...</p>}
              {status === 'success' && <p className="font-black text-green-400 text-base">✅ نطق ممتاز!</p>}
              {status === 'try-again' && <p className="font-black text-yellow-400 text-xs">😊 قريب! حاول تاني</p>}
              {status === 'error' && <p className="font-black text-red-400 text-xs">❌ لازم تسمح للمايك</p>}
              {(attempts >= 2 || status === 'error') && (
                <button onClick={onSkip}
                  className="flex items-center gap-2 rounded-2xl font-bold text-white/70 border border-white/15 bg-white/5 px-4 py-2 text-xs">
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

type DragSource = { id: string; side: 'image' | 'word' };

function MatchGame({ group, onComplete, onCorrect, onKarlReact, onCombo }: any) {
  const isMobile = useIsMobile();
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<VerbItem[]>(() => shuffle(group));
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
  useEffect(() => { if (matched.size === group.length) { onKarlReact('celebrate'); setTimeout(onComplete, 800); } }, [matched]);

  const tryMatch = (src: DragSource, tgt: DragSource, cx: number, cy: number) => {
    if (src.side === tgt.side) return;
    if (src.id === tgt.id) {
      const it = group.find((x: VerbItem) => x.id === src.id)!;
      speakGerman(it.de); playCoinSound(); onCombo(); onKarlReact('happy'); onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy }); setConfettiTrigger(t => t + 1);
      setMatched(p => new Set([...p, src.id]));
    } else {
      playBuzzSound(); onKarlReact('sad'); setErrors(e => e + 1);
      setWrongPair({ id: tgt.id, otherId: src.id }); setTimeout(() => setWrongPair(null), 500);
    }
  };

  const onTouchStart = (e: React.TouchEvent, src: DragSource) => {
    if (matched.has(src.id)) return;
    touchDragging.current = src;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.92;pointer-events:none;z-index:9998;border-radius:16px;transform:scale(1.08);`;
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

  const cardW = isMobile ? 62 : 95, cardH = isMobile ? 78 : 115;

  const renderCard = (item: VerbItem, side: 'image' | 'word') => {
    const isMatched = matched.has(item.id);
    const isWrong = wrongPair?.id === item.id || wrongPair?.otherId === item.id;
    const isOver = overTarget?.id === item.id && overTarget?.side === side && !isMatched;

    if (isMatched) return (
      <div key={`${side}-${item.id}`} style={{ width: cardW, height: cardH, opacity: .2 }}
        className="rounded-xl border-2 border-dashed border-green-500/40 flex items-center justify-center">
        <Check size={20} className="text-green-500/50" />
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
        animate={isWrong ? { x: [-4, 4, -3, 3, 0] } : isOver ? { scale: 1.05 } : {}}
        className="relative select-none rounded-xl overflow-hidden border-2"
        style={{
          width: cardW, height: cardH, cursor: 'grab',
          borderColor: isOver ? item.color : isWrong ? '#ef4444' : `${item.color}aa`,
          background: `linear-gradient(180deg,${item.gradient[0]},${item.gradient[1]})`,
        }}>
        {side === 'image'
          ? <div className="w-full h-full flex items-center justify-center" style={{ fontSize: isMobile ? '2.5rem' : '3.5rem' }}>{item.emoji}</div>
          : <div className="w-full h-full flex flex-col items-center justify-center px-1">
              <span className="font-black text-white text-center" style={{ fontSize: isMobile ? '.85rem' : '1.1rem', lineHeight: 1.1 }}>{item.deBase}</span>
              <span className="font-bold text-white/80 text-[8px] mt-0.5">{item.ar}</span>
            </div>}
        {isOver && <motion.div className="absolute inset-0 pointer-events-none" animate={{ opacity: [.3, .6, .3] }} transition={{ duration: 1, repeat: Infinity }}
          style={{ background: `radial-gradient(circle,${item.color}44,transparent)` }} />}
      </motion.div>
    );
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#06D6A0', '#A78BFA', '#FFF']} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full max-w-md px-2">
          <div className="px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg,rgba(6,214,160,0.4),rgba(236,72,153,0.4))', border: '1.5px solid rgba(6,214,160,0.5)' }}>
            <Sparkles size={11} className="text-yellow-300" />
            <span className="text-[10px] font-black text-white">طابق الفعل بالرمز</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#58CC02,#06D6A0,#A78BFA)' }}
                animate={{ width: `${(matched.size / group.length) * 100}%` }} />
            </div>
            <span className="text-[10px] font-black text-white/90">{matched.size}/{group.length}</span>
          </div>
          {errors > 0 && <div className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}><X size={9} /> {errors}</div>}
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-[9px] text-cyan-300/80 font-black uppercase">الرموز</span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap" dir="ltr">{group.map((c: VerbItem) => renderCard(c, 'image'))}</div>
        </div>
        <div className="w-full max-w-xs flex items-center gap-2 my-0.5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Sparkles size={10} className="text-white/30" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <span className="text-[9px] text-pink-300/80 font-black uppercase">الأفعال — اسحب</span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap" dir="ltr">{shuffledWords.map(w => renderCard(w, 'word'))}</div>
        </div>
      </motion.div>
    </>
  );
}

function GermanVerbsLessonInner() {
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

  const currentGroup = VERB_GROUPS[groupIdx];
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

  const calcRating = (s: number) => { const r = s / (VERBS.length * 3); return r >= .67 ? 3 : r >= .34 ? 2 : 1; };
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
    if (groupIdx < VERB_GROUPS.length - 1) {
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
      <div className="text-6xl mb-4 animate-pulse">📚</div>
      <p className="text-white font-bold">جاري التحميل...</p>
    </div>
  );

  if (!currentGroup || !currentItem) return null;

  return (
    <div className="text-white relative" style={{ fontFamily: "'Tajawal',sans-serif", minHeight: '100vh' }} dir="rtl">
      <ScreenBackground groupIdx={groupIdx} isMobile={isMobile} activeColor={currentItem.color} />
      {!(isMobile && isKeyboardOpen) && (
        <div style={{ transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', transformOrigin: 'bottom right', position: 'fixed', bottom: isMobile ? 110 : 130, right: 0, zIndex: 25, pointerEvents: 'none' }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#06D6A0" />
        </div>
      )}
      <FlyingItems items={flyingItems} />
      <TopHUD stats={stats} level={stats.level} currentStep={itemIdx} totalSteps={currentGroup.numbers.length} onHome={goHome} isMobile={isMobile} />
      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{ zIndex: 10, minHeight: '100vh', maxWidth: '1400px', paddingTop: isMobile ? '110px' : '130px', paddingBottom: isMobile ? '95px' : '120px' }}>
        <AnimatePresence mode="wait">
          {phase === 'listen' && <ListenPhase key={`l-${groupIdx}-${itemIdx}`} item={currentItem} allItems={VERBS} onDone={handleListenDone} onKarlReact={handleKarlReact} onCombo={handleCombo} onCorrect={handleCorrect} isMobile={isMobile} />}
          {phase === 'write' && <WritePhase key={`w-${groupIdx}-${itemIdx}`} item={currentItem} onDone={handleWriteDone} onKarlReact={handleKarlReact} onCombo={handleCombo} onCorrect={handleCorrect} isMobile={isMobile} />}
          {phase === 'speak' && <SpeakPhase key={`s-${groupIdx}-${itemIdx}`} item={currentItem} isMobile={isMobile} onSuccess={(cx: number, cy: number) => { handleCorrect(cx, cy); handleKarlReact('celebrate'); setTimeout(handleSpeakDone, 800); }} onSkip={handleSpeakDone} />}
          {phase === 'test' && !testSuccess && <MatchGame key={`m-${groupIdx}`} group={currentGroup.numbers} onComplete={() => setTestSuccess(true)} onCorrect={handleCorrect} onKarlReact={handleKarlReact} onCombo={handleCombo} />}
          {testSuccess && (
            <motion.div key="success" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center px-6 max-w-md mx-auto">
              <div className="text-9xl">📚</div>
              <h2 className="text-4xl font-black text-white mb-2">أحسنت! 🎉</h2>
              <p className="text-white/50 text-lg">أنهيت {currentGroup.title} بنجاح</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} onClick={nextGroup}
                className="font-black px-12 py-5 rounded-2xl text-lg text-white"
                style={{ background: 'linear-gradient(135deg,#06D6A0,#0077B6)', boxShadow: '0 10px 40px rgba(6,214,160,0.5)' }}>
                {groupIdx < VERB_GROUPS.length - 1 ? 'المجموعة التالية ←' : '🗺️ رجوع للخريطة'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!testSuccess && <BottomHUD stats={stats} treasureState={treasureState} onHint={useHint} onMap={goHome} isMobile={isMobile} />}
    </div>
  );
}

export default function GermanVerbsLesson() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#07090D]"><div className="text-6xl animate-pulse">📚</div></div>}>
      <GermanVerbsLessonInner />
    </Suspense>
  );
}
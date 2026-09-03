'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Sparkles, Volume2, Home, Flame, Gem, Trophy, Check, X,
  Award, Clock, Target, TrendingUp, RefreshCw, Download, Mic, SkipForward,
  ChevronRight, Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress, getPlayer } from '@/lib/playerData';

import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';

import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakNumber as speakGerman } from '@/lib/audio/speech';

import { A1_TEST_QUESTIONS, TEST_SECTIONS, TOTAL_QUESTIONS, PASS_SCORE, type A1TestQuestion } from '@/data/german/map-5-culture/munich-final-a1-test';

const LESSON_ID = 'goethe-institut';
const TIME_PER_QUESTION = 60;

type TestPhase = 'intro' | 'testing' | 'results' | 'certificate';
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

const DARK_COLORS: Record<string, string> = {
  '#4CC9F0': '#075985', '#F72585': '#831843', '#3B82F6': '#1E3A8A',
  '#EC4899': '#831843', '#10B981': '#064E3B', '#7209B7': '#4C1D95',
  '#F77F00': '#9A3412', '#06D6A0': '#064E3B', '#FBBF24': '#7D5310',
  '#A78BFA': '#5B21B6', '#0EA5E9': '#075985', '#F472B6': '#9D174D',
  '#8B5CF6': '#4C1D95', '#22C55E': '#15803D', '#EF4444': '#7F1D1D',
  '#FFD700': '#B45309', '#F59E0B': '#78350F', '#FF4D6D': '#9F1239',
  '#58CC02': '#166534', '#DC2626': '#7F1D1D', '#9D4EDD': '#5A189A',
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
    points: 1800, streak: 20, gems: 75, level: 8, energy: 5, hints: 3, levelProgress: 0,
  });
  const addPoints = (n: number) => setStats(s => ({ ...s, points: s.points + n }));
  const incStreak = () => setStats(s => ({ ...s, streak: s.streak + 1 }));
  const addGems = (n: number) => setStats(s => ({ ...s, gems: s.gems + n }));
  const useHint = () => setStats(s => ({ ...s, hints: Math.max(0, s.hints - 1) }));
  const addStar = () => setStats(s => ({ ...s, points: s.points + 10 }));
  const addLevelProgress = () => setStats(s => ({
    ...s, levelProgress: Math.min(100, s.levelProgress + 100 / TOTAL_QUESTIONS),
  }));
  return { stats, addPoints, incStreak, addGems, useHint, addStar, addLevelProgress };
}

// ═══════════════════════════════════════
// 🎨 ScreenBackground
// ═══════════════════════════════════════
function ScreenBackground({ activeColor, isMobile }: { activeColor: string; isMobile: boolean }) {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; delay: number; size: number; duration: number;
  }>>([]);

  useEffect(() => {
    if (isMobile) return;
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 10,
      size: 2 + Math.random() * 10, duration: 12 + Math.random() * 10,
    })));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ 
        background: 'linear-gradient(135deg, #0A0F24 0%, #150A21 50%, #0A0F24 100%)',
      }} />
      <motion.div className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${activeColor}55, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
      
      {!isMobile && particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, bottom: -20, width: p.size, height: p.size, background: `radial-gradient(circle,${activeColor}cc,transparent)`, boxShadow: `0 0 ${p.size * 2}px ${activeColor}88` }}
          animate={{ y: [0, -(window.innerHeight || 800) - 100], opacity: [0, .9, .9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }} />
      ))}
      
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={`star-${i}`} className="absolute rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 70}%`, width: 2, height: 2, background: 'white' }}
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
                width: isActive ? (isMobile ? 14 : 26) : (isMobile ? 10 : 20),
                height: isActive ? (isMobile ? 14 : 26) : (isMobile ? 10 : 20),
                background: isActive ? 'linear-gradient(135deg,#FFD700,#FF8C00)' : isDone ? 'linear-gradient(135deg,#58CC02,#4AA802)' : 'rgba(255,255,255,0.15)',
                borderColor: isActive ? '#FDE047' : isDone ? '#86EFAC' : 'rgba(255,255,255,0.3)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.6)' : 'white',
                fontSize: isMobile ? '5px' : '9px',
                boxShadow: isActive ? '0 0 10px rgba(255,215,0,0.8)' : isDone ? '0 0 8px rgba(88,204,2,0.6)' : 'none',
              }}>
              {isLocked ? '🔒' : isDone ? '✓' : i + 1}
            </motion.div>
            {i < totalSteps - 1 && <div className={`${isMobile ? 'w-0.5' : 'w-2 md:w-3'} h-0.5 rounded-full`} style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />}
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
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFD700,#FF8C00)' }}
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
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#FFD700,#FF8C00)' }}
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
            <span className="text-[9px] font-black text-yellow-200 tracking-widest uppercase" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>الاختبار النهائي - جوته</span>
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
function HeroDisplay({ item, isMobile, showWord = false }: { item: A1TestQuestion; isMobile?: boolean; showWord?: boolean }) {
  const size = isMobile ? 160 : 260;
  const wordLen = (item.expectedWord || item.questionDe).length;
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
        <div className="text-center" style={{ fontSize: isMobile ? '5.5rem' : '8.5rem', lineHeight: 1 }}>{item.emoji}</div>
      </motion.div>
      {showWord && item.expectedWord && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl whitespace-nowrap z-10 shadow-2xl max-w-[90%]"
          style={{ background: `linear-gradient(135deg,${item.gradient[0]},${item.gradient[1]})`, border: '2px solid rgba(255,255,255,0.6)' }}>
          <span className="font-black text-white text-center block" style={{ fontSize: wordFontSize, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>{item.expectedWord}</span>
        </motion.div>
      )}
      {[{ x: '5%', y: '10%', d: 0, s: 14 }, { x: '90%', y: '15%', d: .5, s: 12 }, { x: '0%', y: '80%', d: 1, s: 13 }, { x: '95%', y: '85%', d: 1.5, s: 11 }
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
// 🎬 IntroScreen
// ═══════════════════════════════════════
function IntroScreen({ onStart, isMobile, heroName }: { onStart: () => void; isMobile: boolean; heroName: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className={`w-full max-w-2xl mx-auto ${isMobile ? 'p-5' : 'p-10'} rounded-[2.5rem] shadow-2xl relative overflow-hidden`}
      style={{ background: 'rgba(15,10,35,0.9)', backdropFilter: 'blur(40px)', border: '2px solid rgba(255,215,0,0.5)', boxShadow: '0 0 80px rgba(255,215,0,0.2)' }}>
      
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at top, rgba(255,215,0,0.15), transparent 60%)' }} />
      
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <motion.div animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
          className={`${isMobile ? 'text-7xl' : 'text-9xl'} drop-shadow-2xl`}>
          🏛️
        </motion.div>
        
        <div>
          <h1 className={`font-black ${isMobile ? 'text-xl' : 'text-4xl'} text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 mb-2`}
            style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.3)' }}>
            معهد جوته - اختبار A1
          </h1>
          <p className={`font-black ${isMobile ? 'text-sm' : 'text-lg'} text-white mb-1`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
            Goethe-Institut · Abschlussprüfung
          </p>
          <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-yellow-200`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            الاختبار النهائي والحصول على شهادة A1 معتمدة
          </p>
        </div>

        <div className={`w-full ${isMobile ? 'p-3' : 'p-5'} rounded-2xl border-2`} 
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.15))', borderColor: 'rgba(255,215,0,0.5)' }}>
          <div className={`font-black text-yellow-300 ${isMobile ? 'text-sm' : 'text-xl'} mb-2`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
            👋 مرحباً {heroName}!
          </div>
          <p className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-bold leading-relaxed`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            هذا هو الاختبار النهائي الشامل لمستوى A1.
            <br />
            سيقيس مهاراتك في: الاستماع، الكتابة، النطق، والقواعد.
            <br />
            بعد النجاح، ستحصل على شهادة رسمية معتمدة! 🎓
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full">
          {[
            { icon: <Target size={isMobile ? 16 : 22} />, label: 'الأسئلة', value: TOTAL_QUESTIONS.toString(), color: '#4CC9F0' },
            { icon: <Clock size={isMobile ? 16 : 22} />, label: 'الوقت', value: '60 ث/سؤال', color: '#F72585' },
            { icon: <TrendingUp size={isMobile ? 16 : 22} />, label: 'للنجاح', value: `${Math.round((PASS_SCORE/TOTAL_QUESTIONS)*100)}%`, color: '#58CC02' },
            { icon: <Award size={isMobile ? 16 : 22} />, label: 'الشهادة', value: 'A1', color: '#FFD700' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className={`flex flex-col items-center gap-1 ${isMobile ? 'p-2' : 'p-3'} rounded-xl shadow-inner`}
              style={{ background: 'rgba(0,0,0,0.4)', border: `2px solid ${stat.color}66` }}>
              <div style={{ color: stat.color }}>{stat.icon}</div>
              <div className="text-[9px] font-bold text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{stat.label}</div>
              <div className={`font-black text-white ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="w-full space-y-2">
          <div className={`font-black text-white ${isMobile ? 'text-xs' : 'text-sm'} text-right`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            📚 أقسام الاختبار الشامل:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TEST_SECTIONS.map((section, i) => (
              <motion.div key={section.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-xl border"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: `${section.color}55` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${section.color}33`, border: `1.5px solid ${section.color}` }}>
                  {section.icon}
                </div>
                <div className="flex-1 text-right">
                  <div className={`font-black text-white ${isMobile ? 'text-[10px]' : 'text-sm'}`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{section.title}</div>
                  <div className="text-[9px] font-bold" style={{ color: section.color, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{section.titleDe}</div>
                </div>
                <div className="text-[9px] font-black text-white bg-white/15 px-1.5 py-0.5 rounded-full">{section.questionsCount}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full p-3 rounded-2xl bg-blue-900/30 border-2 border-blue-500/40 space-y-1">
          <div className={`font-black text-blue-300 ${isMobile ? 'text-xs' : 'text-sm'} text-right flex items-center gap-2`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            <Zap size={16} /> 🎯 أنواع الأسئلة:
          </div>
          <div className={`grid grid-cols-2 gap-1.5 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            <div className="flex items-center gap-1.5 text-white font-bold"><span className="text-lg">📝</span> اختيار من متعدد</div>
            <div className="flex items-center gap-1.5 text-white font-bold"><span className="text-lg">⌨️</span> كتابة بالكيبورد</div>
            <div className="flex items-center gap-1.5 text-white font-bold"><span className="text-lg">🎤</span> نطق بالمايكروفون</div>
            <div className="flex items-center gap-1.5 text-white font-bold"><span className="text-lg">🎯</span> سحب وإفلات</div>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onStart}
          className={`w-full ${isMobile ? 'py-4 text-base' : 'py-5 text-xl'} rounded-2xl font-black text-white shadow-2xl border-2 border-yellow-300`}
          style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00, #EF4444)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
          🚀 ابدأ الاختبار النهائي
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 📝 MCQQuestion (Multiple Choice)
// ═══════════════════════════════════════
function MCQQuestion({ question, onAnswer, isMobile }: {
  question: A1TestQuestion; onAnswer: (isCorrect: boolean, cx: number, cy: number) => void; isMobile: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  useEffect(() => { 
    setShuffledOptions(shuffle(question.options || [])); 
    setSelected(null);
    setIsLocked(false);
  }, [question.id]);

  const handleSelect = (option: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelected(option);
    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      playCoinSound();
    } else {
      playBuzzSound();
    }
    setTimeout(() => onAnswer(isCorrect, e.clientX, e.clientY), 2200);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <HeroDisplay item={question} isMobile />
      
      <div className={`w-full text-center bg-black/40 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border-2 border-white/15 shadow-inner`}>
        <h2 className={`font-black text-white mb-2 ${isMobile ? 'text-xl' : 'text-3xl'}`} style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)', direction: 'ltr' }}>{question.questionDe}</h2>
        <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: '#FDE047', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{question.questionAr}</p>
      </div>
      
      <div className={`grid grid-cols-2 gap-3 w-full`}>
        {shuffledOptions.map((option, idx) => {
          const isSelected = selected === option;
          const isCorrectOption = option === question.correctAnswer;
          const showResult = isLocked && isSelected;
          const highlightCorrect = isLocked && isCorrectOption;

          let bgColor = 'linear-gradient(145deg,rgba(255,255,255,0.98),rgba(235,235,245,0.95))';
          let borderColor = `${question.color}bb`;
          let textColor = '#1F2937';

          if (showResult) {
            if (isCorrectOption) {
              bgColor = 'linear-gradient(145deg,#58CC02,#3A8A01)'; borderColor = '#86EFAC'; textColor = 'white';
            } else {
              bgColor = 'linear-gradient(145deg,#EF4444,#991B1B)'; borderColor = '#FCA5A5'; textColor = 'white';
            }
          } else if (highlightCorrect) {
            bgColor = 'linear-gradient(145deg,#58CC02,#3A8A01)'; borderColor = '#86EFAC'; textColor = 'white';
          }

          return (
            <motion.button key={`${question.id}-${option}-${idx}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
              whileHover={!isLocked ? { scale: 1.05, y: -3 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
              onClick={e => handleSelect(option, e)} disabled={isLocked}
              className={`relative rounded-2xl ${isMobile ? 'p-3 min-h-[3.5rem]' : 'p-5 min-h-[4.5rem]'} flex items-center justify-center border-[3px] shadow-xl disabled:cursor-not-allowed`}
              style={{ background: bgColor, borderColor, boxShadow: `0 8px 20px ${question.color}44` }}>
              <span className={`font-black text-center ${isMobile ? 'text-sm' : 'text-lg'}`}
                style={{ color: textColor, textShadow: (showResult || highlightCorrect) ? '0 1px 3px rgba(0,0,0,0.5)' : 'none', direction: 'ltr' }}>
                {option}
              </span>
              {showResult && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                  {isCorrectOption ? <Check size={18} className="text-green-600" strokeWidth={4} /> : <X size={18} className="text-red-600" strokeWidth={4} />}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isLocked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`w-full ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-inner border-2 text-center`}
            style={{ 
              background: selected === question.correctAnswer 
                ? 'linear-gradient(135deg, rgba(88,204,2,0.3), rgba(58,138,1,0.3))' 
                : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(153,27,27,0.25))',
              borderColor: selected === question.correctAnswer ? '#86EFAC' : '#FCA5A5',
            }}>
            <div className={`flex items-start gap-2 justify-center`}>
              <span className="text-2xl">{selected === question.correctAnswer ? '✅' : '💡'}</span>
              <div className="flex-1 text-right">
                <div className={`font-black ${isMobile ? 'text-xs' : 'text-sm'} ${selected === question.correctAnswer ? 'text-green-300' : 'text-red-300'}`}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  {selected === question.correctAnswer ? 'إجابة صحيحة!' : `الإجابة الصحيحة: ${question.correctAnswer}`}
                </div>
                <div className={`text-white ${isMobile ? 'text-[11px]' : 'text-xs'} font-bold mt-1`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
                  {question.explanation}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// ✏️ WriteQuestion
// ═══════════════════════════════════════
function WriteQuestion({ question, onAnswer, isMobile }: {
  question: A1TestQuestion; onAnswer: (isCorrect: boolean, cx: number, cy: number) => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isLocked, setIsLocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(question.expectedWord || '');

  useEffect(() => {
    setInput('');
    setStatus('idle');
    setIsLocked(false);
  }, [question.id]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (isLocked || !input) return;
    const isCorrect = normalizeGerman(input) === normalizeGerman(question.expectedWord || '');
    setIsLocked(true);
    setStatus(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      speakGerman(question.expectedWord || '');
      playCoinSound();
    } else {
      playBuzzSound();
    }
    
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    if (e) { cx = e.clientX; cy = e.clientY; }
    else if (inputRef.current) { const r = inputRef.current.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; }

    setTimeout(() => onAnswer(isCorrect, cx, cy), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <HeroDisplay item={question} isMobile showWord={false} />
      
      <div className={`w-full text-center bg-black/40 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border-2 border-white/15 shadow-inner`}>
        <div className={`font-black text-yellow-300 mb-1 text-xs uppercase tracking-widest flex items-center justify-center gap-2`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
          <Sparkles size={14} /> Schreiben · بالكيبورد
        </div>
        <h2 className={`font-black text-white ${isMobile ? 'text-xl' : 'text-3xl'} mb-1`} style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{question.questionAr}</h2>
        <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-cyan-200`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>اكتب الكلمة الصحيحة في المربع أسفل</p>
      </div>

      <SoundButton onClick={() => speakGerman(question.expectedWord || '')} color={question.color} label="اسمع النطق أولاً" />
      
      <div className="w-full max-w-md p-2 bg-white/5 rounded-2xl border border-white/20 shadow-inner">
        <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }}
          onEnter={handleCheck} ghostText={question.expectedWord || ''} color={question.color} status={status} fontSize={isMobile ? '1.5rem' : '2rem'} />
      </div>

      {requiredChars.length > 0 && !isLocked && (
        <div className="space-y-2 pt-1 w-full max-w-md">
          <p className={`text-center text-[11px] font-black uppercase tracking-widest`} style={{ color: '#7DD3FC', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>💡 الحروف الألمانية الخاصة</p>
          <SpecialCharsKeyboard chars={requiredChars} onChar={c => { setInput(p => p + c); setStatus('idle'); inputRef.current?.focus(); }} color={question.color} />
        </div>
      )}
      
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: .96 }}
        onClick={handleCheck} disabled={!input || isLocked}
        className={`w-full max-w-md ${isMobile ? 'py-3.5 text-base' : 'py-4 text-lg'} rounded-2xl font-black text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed`}
        style={{ background: `linear-gradient(135deg,${question.gradient[0]},${question.gradient[1]})`, borderBottom: `4px solid ${question.color}77`, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        تحقق من الإجابة ✓
      </motion.button>

      <AnimatePresence>
        {isLocked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`w-full max-w-md ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-inner border-2 text-center`}
            style={{ 
              background: status === 'correct' 
                ? 'linear-gradient(135deg, rgba(88,204,2,0.3), rgba(58,138,1,0.3))' 
                : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(153,27,27,0.25))',
              borderColor: status === 'correct' ? '#86EFAC' : '#FCA5A5',
            }}>
            <div className={`font-black text-white ${isMobile ? 'text-sm' : 'text-base'} mb-1`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              {status === 'correct' ? '✅ كتابة ممتازة!' : `❌ الإجابة الصحيحة: ${question.expectedWord}`}
            </div>
            <div className={`text-white/90 text-xs font-bold`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
              {question.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎤 SpeakQuestion (Microphone)
// ═══════════════════════════════════════
function SpeakQuestion({ question, onAnswer, isMobile }: {
  question: A1TestQuestion; onAnswer: (isCorrect: boolean, cx: number, cy: number) => void; isMobile: boolean;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'try-again' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [supported, setSupported] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const recognitionRef = useRef<any>(null);
  const micRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsLocked(false);
    setTranscript('');
    setStatus('idle');
    setAttempts(0);
  }, [question.id]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.lang = 'de-DE'; rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 3;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const res = e.results[0]; let best = '', bestS = 0;
      for (let i = 0; i < (res as any).length; i++) {
        const t = (res as any)[i].transcript.toLowerCase().trim();
        const s = similarityScore(t, (question.expectedWord || '').toLowerCase());
        if (s > bestS) { bestS = s; best = t; }
      }
      setTranscript(best); setIsListening(false);
      if (bestS >= 0.6) {
        setStatus('success'); setIsLocked(true); playCoinSound();
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        if (micRef.current) { const r = micRef.current.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
        setTimeout(() => onAnswer(true, cx, cy), 1800);
      } else { 
        setStatus('try-again'); playBuzzSound(); setAttempts(a => a + 1); 
      }
    };
    rec.onerror = (e: any) => { 
      setIsListening(false); 
      if (e.error === 'not-allowed') setStatus('error'); 
      else if (e.error !== 'no-speech') { setStatus('try-again'); setAttempts(a => a + 1); } 
      else setStatus('idle'); 
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, [question.id, question.expectedWord, onAnswer]);

  const handleStart = () => {
    if (!recognitionRef.current || isListening || isLocked) return;
    setTranscript(''); setStatus('listening'); setIsListening(true);
    try { recognitionRef.current.start(); } catch { setIsListening(false); setStatus('error'); }
  };

  const handleSkip = () => {
    setIsLocked(true);
    setTimeout(() => onAnswer(false, window.innerWidth / 2, window.innerHeight / 2), 500);
  };

  if (!supported) return (
    <div className={`w-full max-w-md mx-auto ${isMobile ? 'p-5' : 'p-8'} rounded-[2rem] border-2 text-center shadow-2xl`}
      style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)', backdropFilter: 'blur(20px)' }}>
      <div className="text-5xl mb-3">😅</div>
      <h3 className={`font-black text-white ${isMobile ? 'text-lg' : 'text-xl'} mb-2`} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>المتصفح لا يدعم النطق</h3>
      <button onClick={handleSkip} className={`w-full ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} rounded-2xl font-black text-white shadow-lg mt-4`}
        style={{ background: `linear-gradient(135deg,${question.gradient[0]},${question.gradient[1]})` }}>تخطي ⏭️</button>
    </div>
  );

  const micSize = isMobile ? 90 : 130;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <HeroDisplay item={question} isMobile showWord />
      
      <div className={`w-full text-center bg-black/40 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border-2 border-white/15 shadow-inner`}>
        <div className={`font-black text-cyan-300 mb-1 text-xs uppercase tracking-widest flex items-center justify-center gap-2`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
          <Mic size={14} /> Sprechen · بالمايكروفون
        </div>
        <h2 className={`font-black text-white ${isMobile ? 'text-xl' : 'text-3xl'} mb-1`} style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{question.questionAr}</h2>
        <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-yellow-200`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>اضغط على الميكروفون وانطق بوضوح</p>
      </div>

      <button onClick={() => speakGerman(question.expectedWord || '')}
        className={`inline-flex items-center gap-2 rounded-full border-2 font-black px-5 py-2.5 shadow-lg transition-colors`}
        style={{ borderColor: '#7DD3FC', background: 'rgba(6,182,212,0.25)', color: '#E0F2FE', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
        <Volume2 size={16} /> اسمع النطق الصحيح أولاً
      </button>

      <motion.button ref={micRef} onClick={handleStart} disabled={isListening || isLocked}
        whileHover={!isListening && !isLocked ? { scale: 1.05 } : {}}
        whileTap={!isListening && !isLocked ? { scale: 0.95 } : {}}
        className="relative rounded-full flex items-center justify-center flex-shrink-0 shadow-2xl mt-2"
        style={{
          width: micSize, height: micSize,
          background: status === 'success' ? 'linear-gradient(135deg,#58CC02,#2A6A02)' : isListening ? 'linear-gradient(135deg,#EF4444,#991B1B)' : `linear-gradient(135deg,${question.gradient[0]},${question.gradient[1]})`,
          border: `4px solid ${status === 'success' ? '#86EFAC' : isListening ? '#FCA5A5' : 'rgba(255,255,255,0.5)'}`,
          boxShadow: `0 0 40px ${status === 'success' ? 'rgba(88,204,2,0.5)' : isListening ? 'rgba(239,68,68,0.6)' : `${question.color}66`}`,
        }}>
        {isListening && [0, .3, .6].map((d, i) => (
          <motion.div key={i} className="absolute inset-0 rounded-full border-4" style={{ borderColor: '#EF4444' }}
            initial={{ scale: 1, opacity: .8 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 1.5, delay: d, repeat: Infinity }} />
        ))}
        {status === 'success' ? <Check size={isMobile ? 40 : 55} className="text-white drop-shadow-md" strokeWidth={3} /> : <Mic size={isMobile ? 40 : 55} className="text-white drop-shadow-md" />}
      </motion.button>

      <div className="min-h-[3.5rem] flex items-center justify-center w-full">
        {transcript && <p className={`font-black text-white ${isMobile ? 'text-sm' : 'text-base'} text-center bg-black/50 px-4 py-2 rounded-xl border border-white/20`} dir="ltr" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>&ldquo;{transcript}&rdquo;</p>}
        {status === 'listening' && !transcript && <p className={`font-black text-red-300 ${isMobile ? 'text-sm' : 'text-base'} animate-pulse`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>🎙️ بسمعك...</p>}
        {status === 'success' && !transcript && <p className={`font-black text-green-300 ${isMobile ? 'text-base' : 'text-lg'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>✅ نطق ممتاز!</p>}
        {status === 'try-again' && !transcript && <p className={`font-black text-yellow-300 ${isMobile ? 'text-sm' : 'text-base'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>😊 قريب! حاول مرة أخرى</p>}
        {status === 'error' && !transcript && <p className={`font-black text-red-300 ${isMobile ? 'text-sm' : 'text-base'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>❌ يرجى السماح للمايكروفون</p>}
      </div>

      {(attempts >= 2 || status === 'error') && !isLocked && (
        <button onClick={handleSkip}
          className={`flex items-center gap-2 rounded-2xl font-black text-white border-2 border-white/30 bg-white/10 px-6 py-3 ${isMobile ? 'text-xs' : 'text-sm'} shadow-lg hover:bg-white/20 transition-colors`}>
          <SkipForward size={16} /> تخطي هذا السؤال
        </button>
      )}

      <AnimatePresence>
        {isLocked && status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-inner border-2 text-center`}
            style={{ background: 'linear-gradient(135deg, rgba(88,204,2,0.3), rgba(58,138,1,0.3))', borderColor: '#86EFAC' }}>
            <div className={`font-black text-green-300 ${isMobile ? 'text-sm' : 'text-base'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              ✅ {question.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 MatchQuestion (Drag & Drop)
// ═══════════════════════════════════════
type DragSource = { id: string; side: 'image' | 'word' };

function MatchQuestion({ question, onAnswer, isMobile }: {
  question: A1TestQuestion; onAnswer: (isCorrect: boolean, cx: number, cy: number) => void; isMobile: boolean;
}) {
  const pairs = question.matchPairs || [];
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState(() => shuffle([...pairs]));
  const [dragging, setDragging] = useState<DragSource | null>(null);
  const [overTarget, setOverTarget] = useState<DragSource | null>(null);
  const [wrongPair, setWrongPair] = useState<{ id: string; otherId: string } | null>(null);
  const [errors, setErrors] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const touchDragging = useRef<DragSource | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setShuffledWords(shuffle([...pairs]));
    setMatched(new Set());
    setErrors(0);
    setIsLocked(false);
  }, [question.id]);

  useEffect(() => {
    if (matched.size === pairs.length && pairs.length > 0 && !isLocked) {
      setIsLocked(true);
      playCoinSound();
      setTimeout(() => onAnswer(true, window.innerWidth / 2, window.innerHeight / 2), 1500);
    }
  }, [matched, isLocked, pairs.length, onAnswer]);

  const tryMatch = (src: DragSource, tgt: DragSource, cx: number, cy: number) => {
    if (src.side === tgt.side) return;
    if (src.id === tgt.id) {
      const p = pairs.find(x => x.id === src.id);
      if (p) speakGerman(p.de);
      playCoinSound();
      setMatched(prev => new Set([...prev, src.id]));
    } else {
      playBuzzSound();
      setErrors(e => e + 1);
      setWrongPair({ id: tgt.id, otherId: src.id });
      setTimeout(() => setWrongPair(null), 600);
    }
  };

  const onTouchStart = (e: React.TouchEvent, src: DragSource) => {
    if (matched.has(src.id) || isLocked) return;
    touchDragging.current = src;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.95;pointer-events:none;z-index:9998;border-radius:16px;transform:scale(1.1);box-shadow:0 15px 30px rgba(0,0,0,0.5);`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
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
    touchCloneRef.current?.remove();
    touchCloneRef.current = null;
    if (!touchDragging.current) { setOverTarget(null); return; }
    const opp = touchDragging.current.side === 'image' ? 'word' : 'image';
    let dropped: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${opp}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.changedTouches[0].clientX >= r.left && e.changedTouches[0].clientX <= r.right && e.changedTouches[0].clientY >= r.top && e.changedTouches[0].clientY <= r.bottom)
        dropped = { id: (el as HTMLElement).dataset.matchTarget!, side: opp as any };
    });
    if (dropped) tryMatch(touchDragging.current, dropped, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    setOverTarget(null);
    touchDragging.current = null;
  };

  const cardW = isMobile ? 70 : 100;
  const cardH = isMobile ? 85 : 125;

  const renderCard = (item: any, side: 'image' | 'word') => {
    const isMatched = matched.has(item.id);
    const isWrong = wrongPair?.id === item.id || wrongPair?.otherId === item.id;
    const isOver = overTarget?.id === item.id && overTarget?.side === side && !isMatched;

    if (isMatched) return (
      <div key={`${side}-${item.id}`} style={{ width: cardW, height: cardH, opacity: .3 }}
        className="rounded-2xl border-2 border-dashed border-green-500/50 flex items-center justify-center bg-green-900/20">
        <Check size={24} className="text-green-400" />
      </div>
    );

    return (
      <motion.div key={`${side}-${item.id}`} data-match-target={item.id} data-side={side}
        draggable={!isLocked}
        onDragStart={() => !isLocked && setDragging({ id: item.id, side })}
        onDragEnd={() => { setDragging(null); setOverTarget(null); }}
        onDragOver={e => { e.preventDefault(); if (dragging && dragging.side !== side && !isLocked) setOverTarget({ id: item.id, side }); }}
        onDragLeave={() => setOverTarget(null)}
        onDrop={e => { e.preventDefault(); setOverTarget(null); if (dragging && !isLocked) tryMatch(dragging, { id: item.id, side }, e.clientX, e.clientY); setDragging(null); }}
        onTouchStart={e => onTouchStart(e, { id: item.id, side })}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => speakGerman(item.de)}
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: .95 } : {}}
        animate={isWrong ? { x: [-5, 5, -4, 4, 0] } : isOver ? { scale: 1.08 } : {}}
        className="relative select-none rounded-2xl overflow-hidden shadow-xl"
        style={{
          width: cardW, height: cardH, cursor: isLocked ? 'default' : 'grab',
          border: `2px solid ${isOver ? 'white' : isWrong ? '#FCA5A5' : 'rgba(255,255,255,0.35)'}`,
          background: isWrong ? 'linear-gradient(180deg,#EF4444,#991B1B)' : `linear-gradient(180deg,${item.color},${getDarkColor(item.color)})`,
        }}>
        {side === 'image'
          ? <div className="w-full h-full flex items-center justify-center" style={{ fontSize: isMobile ? '3rem' : '4rem', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.5))' }}>{item.emoji}</div>
          : <div className="w-full h-full flex flex-col items-center justify-center px-1.5 gap-1 bg-black/20">
              <span className="font-black text-white text-center" style={{ fontSize: isMobile ? '.85rem' : '1.1rem', lineHeight: 1.15, textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>{item.de}</span>
              <span className="font-black text-center bg-black/50 px-2 py-0.5 rounded-md" style={{ fontSize: isMobile ? '9px' : '11px', color: '#FDE047', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{item.ar}</span>
            </div>}
        {isOver && <motion.div className="absolute inset-0 pointer-events-none border-4 border-white rounded-2xl" animate={{ opacity: [.4, 1, .4] }} transition={{ duration: 1, repeat: Infinity }} />}
      </motion.div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className={`w-full text-center bg-black/40 ${isMobile ? 'p-4' : 'p-5'} rounded-2xl border-2 border-white/15 shadow-inner`}>
        <div className={`font-black text-pink-300 mb-1 text-xs uppercase tracking-widest flex items-center justify-center gap-2`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
          <Sparkles size={14} /> Zuordnen · طابق واسحب
        </div>
        <h2 className={`font-black text-white ${isMobile ? 'text-lg' : 'text-2xl'} mb-1`} style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{question.questionDe}</h2>
        <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-yellow-200`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{question.questionAr}</p>
      </div>

      <div className="flex items-center gap-3 w-full max-w-2xl px-3 py-2 rounded-2xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/20">
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(to right,#58CC02,#FFD700,#EF4444)' }}
              animate={{ width: `${(matched.size / pairs.length) * 100}%` }} />
          </div>
          <span className="text-xs font-black text-white bg-white/15 px-2 py-0.5 rounded-lg">{matched.size}/{pairs.length}</span>
        </div>
        {errors > 0 && <div className="px-2 py-1 rounded-full text-[10px] font-black flex items-center gap-1" style={{ background: 'rgba(239,68,68,0.3)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.5)' }}><X size={10} /> {errors}</div>}
      </div>

      <div className="w-full flex flex-col items-center gap-2 mt-2">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#7DD3FC', background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>الرموز</span>
        <div className="flex items-center justify-center gap-2 flex-wrap" dir="ltr">{pairs.map((c: any) => renderCard(c, 'image'))}</div>
      </div>

      <div className="w-full max-w-xs flex items-center gap-2 my-1 opacity-60">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <Sparkles size={12} className="text-white/50" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="w-full flex flex-col items-center gap-2 mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#F9A8D4', background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>الكلمات — اسحب</span>
        <div className="flex items-center justify-center gap-2 flex-wrap" dir="ltr">{shuffledWords.map((w: any) => renderCard(w, 'word'))}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ❓ Master Question Card
// ═══════════════════════════════════════
function MasterQuestionCard({ question, questionIdx, totalQuestions, onAnswer, isMobile, timeLeft, score }: {
  question: A1TestQuestion; questionIdx: number; totalQuestions: number;
  onAnswer: (isCorrect: boolean, cx: number, cy: number) => void; isMobile: boolean; timeLeft: number; score: number;
}) {
  const timePercent = (timeLeft / TIME_PER_QUESTION) * 100;
  const timeColor = timeLeft > 30 ? '#58CC02' : timeLeft > 15 ? '#FFD700' : '#EF4444';

  return (
    <motion.div key={question.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-4xl'} mx-auto ${isMobile ? 'p-4' : 'p-8'} rounded-[2.5rem] relative overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.7)]`}
      style={{ background: 'rgba(15,10,35,0.92)', backdropFilter: 'blur(50px)', border: '2px solid rgba(255,255,255,0.2)' }}>
      
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -20%, ${question.color}44, transparent 60%)` }} />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-xl font-black shadow-md flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ background: `${question.color}55`, border: `2px solid ${question.color}`, color: '#FFF', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              <span className="text-base">{question.emoji}</span>
              <span>سؤال {questionIdx + 1}/{totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-md"
            style={{ background: `${timeColor}33`, border: `2px solid ${timeColor}` }}>
            <Clock size={isMobile ? 14 : 18} style={{ color: timeColor }} />
            <span className={`font-black ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: timeColor, textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>{timeLeft} ثانية</span>
          </div>
        </div>

        <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/20 shadow-inner">
          <motion.div className="h-full rounded-full transition-all duration-1000"
            style={{ background: `linear-gradient(to right, ${timeColor}, ${timeColor}88)`, width: `${timePercent}%` }} />
        </div>

        <div className="w-full flex items-center justify-center min-h-[300px]">
          {question.type === 'mcq' && <MCQQuestion question={question} onAnswer={onAnswer} isMobile={isMobile} />}
          {question.type === 'write' && <WriteQuestion question={question} onAnswer={onAnswer} isMobile={isMobile} />}
          {question.type === 'speak' && <SpeakQuestion question={question} onAnswer={onAnswer} isMobile={isMobile} />}
          {question.type === 'match' && <MatchQuestion question={question} onAnswer={onAnswer} isMobile={isMobile} />}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🏆 ResultsScreen
// ═══════════════════════════════════════
function ResultsScreen({ score, total, sectionResults, onGetCertificate, onRetry, isMobile }: {
  score: number; total: number; sectionResults: Record<string, { correct: number; total: number }>;
  onGetCertificate: () => void; onRetry: () => void; isMobile: boolean;
}) {
  const percentage = Math.round((score / total) * 100);
  const passed = score >= PASS_SCORE;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-2xl'} mx-auto ${isMobile ? 'p-5' : 'p-8'} rounded-[2.5rem] shadow-2xl`}
      style={{ background: 'rgba(15,10,35,0.92)', backdropFilter: 'blur(40px)', border: `3px solid ${passed ? '#FFD700' : '#F72585'}`, boxShadow: `0 0 100px ${passed ? 'rgba(255,215,0,0.4)' : 'rgba(247,37,133,0.4)'}` }}>
      
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className={`${isMobile ? 'text-7xl' : 'text-9xl'} drop-shadow-2xl`}>
          {passed ? '🏆' : '💪'}
        </motion.div>

        <h2 className={`font-black ${isMobile ? 'text-2xl' : 'text-4xl'} text-transparent bg-clip-text mb-1`}
          style={{ 
            backgroundImage: passed ? 'linear-gradient(to right, #FFD700, #FF8C00)' : 'linear-gradient(to right, #F72585, #B5179E)',
            WebkitTextStroke: '0.5px rgba(0,0,0,0.3)',
          }}>
          {passed ? 'مبروك! نجحت! 🎉' : 'كدة قريب من النجاح!'}
        </h2>

        <p className={`text-white font-bold ${isMobile ? 'text-sm' : 'text-lg'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
          {passed ? 'استحقيت شهادة A1 بجدارة! 🎓' : `تحتاج ${PASS_SCORE - score} إجابة صحيحة إضافية للنجاح`}
        </p>

        <div className={`w-full ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border-2 shadow-inner`}
          style={{ background: 'rgba(0,0,0,0.4)', borderColor: passed ? 'rgba(255,215,0,0.5)' : 'rgba(247,37,133,0.5)' }}>
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <div className={`font-black ${isMobile ? 'text-3xl' : 'text-5xl'}`} style={{ color: passed ? '#FFD700' : '#F72585', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{score}</div>
              <div className="text-white/80 font-bold text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>صحيحة</div>
            </div>
            <div className="text-3xl font-black text-white/40">/</div>
            <div className="flex flex-col items-center">
              <div className={`font-black ${isMobile ? 'text-3xl' : 'text-5xl'} text-white/80`} style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{total}</div>
              <div className="text-white/80 font-bold text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>سؤال</div>
            </div>
            <div className="text-3xl font-black text-white/40">=</div>
            <div className="flex flex-col items-center">
              <div className={`font-black ${isMobile ? 'text-3xl' : 'text-5xl'}`} style={{ color: passed ? '#58CC02' : '#EF4444', textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>{percentage}%</div>
              <div className="text-white/80 font-bold text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>النسبة</div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-2">
          <div className={`font-black text-white ${isMobile ? 'text-sm' : 'text-base'} text-right`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            📊 نتائج كل قسم:
          </div>
          {TEST_SECTIONS.map(section => {
            const result = sectionResults[section.id] || { correct: 0, total: section.questionsCount };
            const secPercent = Math.round((result.correct / result.total) * 100) || 0;
            const secColor = secPercent >= 80 ? '#58CC02' : secPercent >= 60 ? '#FFD700' : '#EF4444';
            return (
              <div key={section.id} className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1.5px solid ${section.color}44` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${section.color}33`, border: `1.5px solid ${section.color}` }}>
                  {section.icon}
                </div>
                <div className="flex-1 text-right">
                  <div className={`font-black text-white ${isMobile ? 'text-[11px]' : 'text-sm'}`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{section.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" 
                        style={{ background: secColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${secPercent}%` }}
                        transition={{ duration: 1, delay: 0.3 }} />
                    </div>
                    <div className="text-[10px] font-black" style={{ color: secColor, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
                      {result.correct}/{result.total}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full flex flex-col gap-3">
          {passed ? (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onGetCertificate}
              className={`w-full ${isMobile ? 'py-4 text-base' : 'py-5 text-xl'} rounded-2xl font-black text-white shadow-2xl border-2 border-yellow-300 flex items-center justify-center gap-2`}
              style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00, #EF4444)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
              <Award size={isMobile ? 20 : 24} />
              🎓 احصل على شهادة A1
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRetry}
              className={`w-full ${isMobile ? 'py-4 text-base' : 'py-5 text-xl'} rounded-2xl font-black text-white shadow-2xl border-2 border-pink-300 flex items-center justify-center gap-2`}
              style={{ background: 'linear-gradient(135deg, #F72585, #B5179E)', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
              <RefreshCw size={isMobile ? 20 : 24} />
              حاول مرة أخرى
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎓 CertificateScreen
// ═══════════════════════════════════════
function CertificateScreen({ heroName, score, total, onBackToMap, isMobile }: {
  heroName: string; score: number; total: number; onBackToMap: () => void; isMobile: boolean;
}) {
  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 66 ? 'B' : 'C';
  const gradeColor = percentage >= 90 ? '#58CC02' : percentage >= 80 ? '#4CC9F0' : percentage >= 66 ? '#FFD700' : '#F72585';
  const dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, rotateY: -20 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      className={`w-full ${isMobile ? 'max-w-[95%]' : 'max-w-3xl'} mx-auto`}>
      
      <div className={`relative ${isMobile ? 'p-5' : 'p-10'} rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:border-4`}
        style={{ 
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFFBEB 100%)',
          border: '8px double #B45309',
          boxShadow: '0 0 100px rgba(255,215,0,0.5), inset 0 0 60px rgba(255,215,0,0.1)',
        }}>
        
        <div className="absolute top-4 left-4 text-6xl opacity-10">🏛️</div>
        <div className="absolute bottom-4 right-4 text-6xl opacity-10">🎓</div>
        <div className="absolute top-4 right-4 text-4xl opacity-20">⭐</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">⭐</div>

        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className={`${isMobile ? 'text-6xl' : 'text-8xl'}`}>🏛️</div>
          
          <div>
            <h1 className={`font-black ${isMobile ? 'text-xl' : 'text-3xl'} text-amber-900`}>
              Goethe-Institut
            </h1>
            <p className={`font-bold ${isMobile ? 'text-sm' : 'text-base'} text-amber-700 mt-1`}>
              معهد جوته الألماني
            </p>
          </div>

          <div className={`w-full h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent my-1`}></div>

          <div>
            <div className={`font-black ${isMobile ? 'text-xs' : 'text-sm'} text-amber-800 tracking-widest uppercase mb-1`}>
              Zertifikat · شهادة
            </div>
            <h2 className={`font-black ${isMobile ? 'text-2xl' : 'text-4xl'} text-amber-900`}>
              A1 Deutsch
            </h2>
            <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-amber-700 mt-1`}>
              اللغة الألمانية - المستوى A1
            </p>
          </div>

          <div className={`w-full ${isMobile ? 'p-3' : 'p-4'} bg-white/60 rounded-xl border-2 border-amber-300`}>
            <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-amber-800 mb-1`}>
              تُمنح هذه الشهادة إلى:
            </div>
            <div className={`font-black ${isMobile ? 'text-xl' : 'text-3xl'} text-amber-900 my-2`} style={{ fontFamily: 'serif' }}>
              {heroName || 'البطل الشجاع'}
            </div>
            <div className={`font-bold ${isMobile ? 'text-[10px]' : 'text-xs'} text-amber-700`}>
              لاجتيازه اختبار A1 في اللغة الألمانية بنجاح
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            <div className={`${isMobile ? 'p-2' : 'p-3'} bg-amber-100 rounded-xl border-2 border-amber-300`}>
              <div className={`font-bold ${isMobile ? 'text-[9px]' : 'text-xs'} text-amber-800 mb-1`}>النتيجة</div>
              <div className={`font-black ${isMobile ? 'text-lg' : 'text-2xl'} text-amber-900`}>{score}/{total}</div>
            </div>
            <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-xl border-2`} style={{ background: `${gradeColor}22`, borderColor: gradeColor }}>
              <div className={`font-bold ${isMobile ? 'text-[9px]' : 'text-xs'} mb-1`} style={{ color: gradeColor }}>التقدير</div>
              <div className={`font-black ${isMobile ? 'text-xl' : 'text-3xl'}`} style={{ color: gradeColor }}>{grade}</div>
            </div>
            <div className={`${isMobile ? 'p-2' : 'p-3'} bg-amber-100 rounded-xl border-2 border-amber-300`}>
              <div className={`font-bold ${isMobile ? 'text-[9px]' : 'text-xs'} text-amber-800 mb-1`}>النسبة</div>
              <div className={`font-black ${isMobile ? 'text-lg' : 'text-2xl'} text-amber-900`}>{percentage}%</div>
            </div>
          </div>

          <div className={`w-full flex justify-between items-end ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold text-amber-800 pt-4 border-t-2 border-amber-300`}>
            <div className="text-right">
              <div>التاريخ:</div>
              <div className="text-amber-900 font-black">{dateStr}</div>
            </div>
            <div className={`${isMobile ? 'text-3xl' : 'text-5xl'}`}>🎖️</div>
            <div className="text-left">
              <div>التوقيع:</div>
              <div className="text-amber-900 font-black" style={{ fontFamily: 'cursive' }}>Karl Adler</div>
            </div>
          </div>

          <div className={`w-full ${isMobile ? 'text-[8px]' : 'text-[10px]'} text-amber-600 font-bold border-t border-amber-300 pt-2 text-center`}>
            🌟 Herzlichen Glückwunsch! 🌟 · تهانينا الحارة على إتقانك للمستوى الأول!
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-6 print:hidden">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.print()}
          className={`flex-1 ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-2`}
          style={{ background: 'linear-gradient(135deg, #4CC9F0, #028090)', border: '2px solid #7DD3FC', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
          <Download size={isMobile ? 16 : 20} />
          طباعة الشهادة
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBackToMap}
          className={`flex-1 ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-2`}
          style={{ background: 'linear-gradient(135deg, #58CC02, #2A6A02)', border: '2px solid #86EFAC', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
          🗺️ رجوع للخريطة
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🏠 Main
// ═══════════════════════════════════════
function GermanFinalA1TestInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useKeyboardOpen();
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [isLoading, setIsLoading] = useState(true);
  const [heroName, setHeroName] = useState('البطل');

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sectionResults, setSectionResults] = useState<Record<string, { correct: number; total: number }>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [correctInSection, setCorrectInSection] = useState(0);

  const { stats, addPoints, incStreak, addGems, useHint, addStar, addLevelProgress } = useGameStats();
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);

  const currentQuestion = A1_TEST_QUESTIONS[currentQuestionIdx];
  const treasureState: 'closed' | 'half' | 'opend' = correctInSection < 2 ? 'closed' : correctInSection < 5 ? 'half' : 'opend';

  useEffect(() => {
    const load = async () => {
      const player = await getPlayer();
      if (player) setHeroName(player.hero_name);
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (phase !== 'testing') return;
    if (timeLeft <= 0) {
      handleAnswer(false, window.innerWidth / 2, window.innerHeight / 2);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, phase]);

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    const msg = mood === 'sad' ? SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)] : ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setKarlMessage(msg);
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  const handleStart = () => {
    setPhase('testing');
    setCurrentQuestionIdx(0);
    setScore(0);
    setSectionResults({});
    setTimeLeft(TIME_PER_QUESTION);
    setCorrectInSection(0);
  };

  const handleAnswer = useCallback((isCorrect: boolean, cx: number, cy: number) => {
    if (isCorrect) {
      setScore(s => s + 1);
      addPoints(10); incStreak();
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      handleKarlReact('happy');
      setCorrectInSection(prev => {
        const next = prev + 1;
        setTimeout(() => {
          const el = document.getElementById('star-target');
          if (el) { 
            const r = el.getBoundingClientRect(); 
            const id = Date.now() + Math.random();
            setFlyingItems(p => [...p, { id, startX: cx, startY: cy, endX: r.left + r.width / 2, endY: r.top + r.height / 2, type: 'star' }]);
            setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addStar(); }, 1100);
          }
        }, 100);
        setTimeout(() => {
          const el = document.getElementById('level-bar-target');
          if (el) { 
            const r = el.getBoundingClientRect(); 
            const id = Date.now() + Math.random();
            setFlyingItems(p => [...p, { id, startX: cx, startY: cy, endX: r.left + r.width / 2, endY: r.top + r.height / 2, type: 'energy' }]);
            setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addLevelProgress(); }, 1100);
          }
        }, 400);
        if (next === 5) {
          setTimeout(() => {
            const t = document.getElementById('treasure-box'), g = document.getElementById('gem-target');
            if (t && g) { 
              const tr = t.getBoundingClientRect(), gr = g.getBoundingClientRect();
              for (let i = 0; i < 5; i++) setTimeout(() => { 
                const id = Date.now() + Math.random() + i;
                setFlyingItems(p => [...p, { id, startX: tr.left + tr.width / 2, startY: tr.top + tr.height / 2, endX: gr.left + gr.width / 2, endY: gr.top + gr.height / 2, type: 'gem' }]);
                setTimeout(() => { setFlyingItems(p => p.filter(s => s.id !== id)); addGems(1); }, 1100);
              }, i * 150);
            }
          }, 700);
          return 0;
        }
        return next;
      });
    } else {
      handleKarlReact('sad');
    }

    const section = TEST_SECTIONS.find((_, i) => {
      const start = TEST_SECTIONS.slice(0, i).reduce((sum, s) => sum + s.questionsCount, 0);
      return currentQuestionIdx >= start && currentQuestionIdx < start + TEST_SECTIONS[i].questionsCount;
    });
    if (section) {
      setSectionResults(prev => ({
        ...prev,
        [section.id]: {
          correct: (prev[section.id]?.correct || 0) + (isCorrect ? 1 : 0),
          total: section.questionsCount,
        },
      }));
    }

    setTimeout(() => {
      if (currentQuestionIdx < TOTAL_QUESTIONS - 1) {
        setCurrentQuestionIdx(i => i + 1);
        setTimeLeft(TIME_PER_QUESTION);
      } else {
        setPhase('results');
      }
    }, 1200);
  }, [currentQuestionIdx, addPoints, incStreak, addStar, addLevelProgress, addGems]);

  const handleGetCertificate = async () => {
    await saveLessonProgress(LESSON_ID, 3, true);
    setPhase('certificate');
  };

  const handleRetry = () => {
    setPhase('intro');
    setCurrentQuestionIdx(0);
    setScore(0);
    setSectionResults({});
    setCorrectInSection(0);
  };

  const goHome = () => router.push('/character-and-map?from=lesson&map=5');

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F24]">
      <div className="flex flex-col items-center gap-4">
        <div className="text-7xl animate-bounce">🏛️</div>
        <p className="text-white font-black text-lg tracking-widest animate-pulse">جاري تحميل الاختبار النهائي...</p>
      </div>
    </div>
  );

  const activeColor = phase === 'testing' && currentQuestion ? currentQuestion.color : '#FFD700';

  return (
    <div className="text-white relative" style={{ fontFamily: "'Tajawal',sans-serif", minHeight: '100vh', overflowX: 'hidden' }} dir="rtl">
      <ScreenBackground activeColor={activeColor} isMobile={isMobile} />
      
      {phase !== 'certificate' && !(isMobile && isKeyboardOpen) && (
        <div style={{ transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', transformOrigin: 'bottom right', position: 'fixed', bottom: isMobile ? 110 : 130, right: 0, zIndex: 25, pointerEvents: 'none' }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#FFD700" />
        </div>
      )}

      <FlyingItems items={flyingItems} />
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#FF8C00', '#EF4444', '#FFF']} />

      {phase === 'testing' && (
        <TopHUD stats={stats} level={stats.level} currentStep={currentQuestionIdx} totalSteps={TOTAL_QUESTIONS} onHome={goHome} isMobile={isMobile} />
      )}

      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{ 
          zIndex: 10, 
          minHeight: '100vh', 
          maxWidth: '1400px', 
          paddingTop: phase === 'testing' ? (isMobile ? '110px' : '130px') : '30px', 
          paddingBottom: phase === 'testing' ? (isMobile ? '95px' : '120px') : '30px' 
        }}>
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <IntroScreen key="intro" onStart={handleStart} isMobile={isMobile} heroName={heroName} />
          )}
          {phase === 'testing' && currentQuestion && (
            <MasterQuestionCard key={currentQuestion.id}
              question={currentQuestion}
              questionIdx={currentQuestionIdx}
              totalQuestions={TOTAL_QUESTIONS}
              onAnswer={handleAnswer}
              isMobile={isMobile}
              timeLeft={timeLeft}
              score={score} />
          )}
          {phase === 'results' && (
            <ResultsScreen key="results"
              score={score}
              total={TOTAL_QUESTIONS}
              sectionResults={sectionResults}
              onGetCertificate={handleGetCertificate}
              onRetry={handleRetry}
              isMobile={isMobile} />
          )}
          {phase === 'certificate' && (
            <CertificateScreen key="certificate"
              heroName={heroName}
              score={score}
              total={TOTAL_QUESTIONS}
              onBackToMap={goHome}
              isMobile={isMobile} />
          )}
        </AnimatePresence>
      </div>

      {phase === 'testing' && (
        <BottomHUD stats={stats} treasureState={treasureState} onHint={useHint} onMap={goHome} isMobile={isMobile} />
      )}
    </div>
  );
}

export default function GermanFinalA1Test() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A0F24]"><div className="text-6xl animate-bounce">🏛️</div></div>}>
      <GermanFinalA1TestInner />
    </Suspense>
  );
}
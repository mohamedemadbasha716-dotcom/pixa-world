'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Star, Check, X, Trophy, RotateCcw, 
  Sparkles, Home, Flame, Gem, Mic, SkipForward
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';

// 🎯 المكونات المشتركة
import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';

// 🎯 الأنواع والرسائل المشتركة
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

// 🎯 الأصوات والنطق المشتركة
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakWord } from '@/lib/audio/speech';

// 📦 البيانات
import { LAKE_GROUPS, type LakeWord, type WeekDay, type LakeGroup } from '@/data/german/lake';

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════
type Phase = 'learn-word' | 'speak' | 'test' | 'group-success' | 'group-fail' | 'all-done';
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

const TOTAL_ANSWERS_PER_LESSON = LAKE_GROUPS.reduce((a, g) => a + g.items.length, 0) * 3;

// 🆕 خريطة صور أيام الأسبوع
const DAY_IMAGES: Record<string, string> = {
  'Montag':     '/card-image/montag.webp',
  'Dienstag':   '/card-image/dienstag.webp',
  'Mittwoch':   '/card-image/mittwoch.webp',
  'Donnerstag': '/card-image/donnerstag.webp',
  'Freitag':    '/card-image/freitag.webp',
  'Samstag':    '/card-image/samstag.webp',
  'Sonntag':    '/card-image/sonntag.webp',
};

// ═══════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════
function normalizeGerman(s: string): string {
  return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/\s+/g, ' ').trim();
}

function compareWords(input: string, target: string): boolean {
  return normalizeGerman(input) === normalizeGerman(target);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function getDarkColor(originalColor: string): string {
  return darkenColor(originalColor, 0.5);
}

// 🎤 Similarity Functions للنطق
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string): number {
  const normalize = (s: string) => s
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/^(der|die|das)\s+/i, '')
    .trim();

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
  for (const word of wordsA) {
    if (setB.has(word)) matches++;
  }
  return matches / Math.max(wordsA.length, wordsB.length);
}

// ═══════════════════════════════════════
// Hooks
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
    points: 1250, streak: 7, gems: 35, level: 5, energy: 5, hints: 3, levelProgress: 0,
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

// ═══════════════════════════════════════
// 🏞️ LakeBackground - خلفية صور البحيرة
// ═══════════════════════════════════════
function getGroupBackground(groupId: number, isMobile: boolean): string {
  const suffix = isMobile ? 'mob' : 'pc';
  const num = groupId + 1;
  return `/card-image/lake-group${num}-${suffix}.webp`;
}

function LakeBackground({ group, activeColor, isMobile, phase }: { 
  group: LakeGroup; 
  activeColor: string; 
  isMobile: boolean;
  phase?: Phase;
}) {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number; xOffset: number }>>([]);

  useEffect(() => {
    if (isMobile) return;
    const b = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 3 + Math.random() * 8,
      duration: 12 + Math.random() * 10,
      xOffset: Math.random() * 40 - 20,
    }));
    setBubbles(b);
  }, [isMobile, group.groupId]);

  const overlayOpacity = phase === 'test' ? 0.55 : 0.4;
  const bgImage = getGroupBackground(group.groupId, isMobile);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img 
        src={bgImage} 
        alt="bg" 
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(1.1)' }}
      />
      
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg, 
          rgba(2,8,20,${overlayOpacity}) 0%, 
          rgba(2,8,20,${overlayOpacity * 0.5}) 40%, 
          rgba(2,8,20,${overlayOpacity * 0.5}) 60%, 
          rgba(2,8,20,${overlayOpacity}) 100%)`,
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {!isMobile && bubbles.map(b => (
        <motion.div 
          key={`${group.groupId}-${b.id}`} 
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`, bottom: -20, width: b.size, height: b.size,
            background: `radial-gradient(circle, ${activeColor}cc, transparent)`,
            boxShadow: `0 0 ${b.size * 2}px ${activeColor}88`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.9, 0.9, 0],
            x: [0, b.xOffset, 0],
          }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Stepper
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
        const stepNum = i + 1;
        return (
          <div key={i} className="flex items-center">
            <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                height: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                background: isActive 
                  ? 'linear-gradient(135deg, #06D6A0, #0984E3)'
                  : isDone 
                    ? 'linear-gradient(135deg, #06D6A0, #0984E3)'
                    : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#06D6A0' : isDone ? '#06D6A0' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(6,214,160,0.6)' : isDone ? '0 0 6px rgba(6,214,160,0.4)' : 'none',
              }}>
              {isLocked ? '🔒' : isDone ? '✓' : stepNum}
            </motion.div>
            {i < totalSteps - 1 && (
              <div className={`${isMobile ? 'w-1' : 'w-3 md:w-4'} h-0.5`} 
                style={{ background: isDone ? '#06D6A0' : 'rgba(255,255,255,0.2)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// TopHUD
// ═══════════════════════════════════════
function TopHUD({ stats, level, currentStep, totalSteps, onHome, isMobile }: {
  stats: GameStats; level: number; currentStep: number; totalSteps: number;
  onHome: () => void; isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-30 px-2" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2px)' }}>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.1 }}
              className="relative w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{
                borderColor: '#FFD700',
                boxShadow: '0 0 10px rgba(255,215,0,0.5)',
                background: 'linear-gradient(135deg, #06D6A0, #0984E3)',
              }}>
              <img src="/characters/karl-3d.png" alt="character" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #06D6A0, #0984E3)' }}
                    animate={{ width: `${stats.levelProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
            <motion.div key={`points-${stats.points}`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,215,0,0.35)',
              }}>
              <img id="star-target" src="/treasuer/star.png" alt="star" className="w-3 h-3 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.points}</span>
            </motion.div>

            <motion.div key={`streak-${stats.streak}`} animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,77,109,0.35)',
              }}>
              <Flame size={12} className="text-orange-400 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.streak}</span>
            </motion.div>

            <motion.div key={`gems-${stats.gems}`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(157,78,221,0.35)',
              }}>
              <Gem id="gem-target" size={12} className="text-purple-300 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.gems}</span>
            </motion.div>
          </div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)',
            }}>
            <Home size={14} className="text-white" />
          </motion.button>
        </div>

        <div className="flex justify-center" style={{ marginTop: '2.5px' }}>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
            style={{
              background: 'rgba(15,10,45,0.7)', backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)',
            }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 md:px-6 pt-3 md:pt-4" 
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{
              borderColor: '#FFD700',
              boxShadow: '0 0 15px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, #06D6A0, #0984E3)',
            }}>
            <img src="/characters/karl-3d.png" alt="character" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] md:text-[10px] font-bold text-white/80 mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm md:text-base text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{level}</span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #06D6A0, #0984E3)' }}
                  animate={{ width: `${stats.levelProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={false} />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div key={`gems-${stats.gems}`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(157,78,221,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{stats.gems}</span>
            <Gem id="gem-target" size={18} className="text-purple-300" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
          </motion.div>

          <motion.div key={`streak-${stats.streak}`} animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,77,109,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <div className="flex flex-col leading-none items-center">
              <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{stats.streak}</span>
              <span className="text-[7px] md:text-[8px] text-orange-200/90 font-bold mt-0.5">سلسلة</span>
            </div>
            <Flame size={18} className="text-orange-400" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
          </motion.div>

          <motion.div key={stats.points} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,215,0,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{stats.points}</span>
            <img id="star-target" src="/treasuer/star.png" alt="star" className="w-5 h-5 md:w-6 md:h-6" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
          </motion.div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}>
            <Home size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// FlyingItems
// ═══════════════════════════════════════
function FlyingItems({ items }: { items: FlyingItem[] }) {
  return (
    <>
      {items.map(item => {
        const dx = item.endX - item.startX;
        const dy = item.endY - item.startY;
        const midX1 = dx * 0.2;
        const midY1 = dy * 0.3 - 150;
        const midX2 = dx * 0.7;
        const midY2 = dy * 0.6 - 80;
        const color = item.type === 'star' ? '#FFD700' : item.type === 'energy' ? '#4CC9F0' : '#9D4EDD';
        
        return (
          <div key={item.id} className="fixed pointer-events-none z-[60]"
            style={{ left: item.startX, top: item.startY }}>
            {[0, 1, 2, 3].map(i => (
              <motion.div key={`trail-${i}`} className="absolute rounded-full"
                style={{
                  width: 6, height: 6, background: color,
                  boxShadow: `0 0 12px ${color}`, top: 0, left: 0,
                }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0], opacity: [0, 0.8, 0],
                  x: [0, midX1 + (i * 5), midX2 + (i * 8), dx],
                  y: [0, midY1 + (i * 8), midY2 + (i * 5), dy],
                }}
                transition={{ duration: 1.4, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            ))}

            <motion.div className="absolute rounded-full pointer-events-none"
              style={{
                width: 60, height: 60,
                background: `radial-gradient(circle, ${color}88, transparent 70%)`,
                top: -25, left: -25,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 2, 3], opacity: [1, 0.6, 0] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            <motion.div
              initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.8, 1.5, 1.2, 1.0, 1.6, 0],
                opacity: [0, 1, 1, 1, 1, 1, 0],
                x: [0, 0, midX1, midX2, dx, dx, dx],
                y: [0, -20, midY1, midY2, dy, dy, dy],
                rotate: [0, -15, 180, 360, 540, 720, 720],
              }}
              transition={{
                duration: 1.4,
                times: [0, 0.1, 0.25, 0.55, 0.85, 0.95, 1],
                ease: [0.25, 0.46, 0.45, 0.94],
              }}>
              <div className="relative" style={{ width: 40, height: 40, marginTop: -20, marginLeft: -20 }}>
                <div className="absolute inset-0 rounded-full blur-xl" 
                  style={{ background: color, opacity: 0.8, transform: 'scale(2.5)' }} />
                <div className="relative flex items-center justify-center w-full h-full">
                  {item.type === 'star' && (
                    <img src="/treasuer/star.png" alt="star" className="w-10 h-10"
                      style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />
                  )}
                  {item.type === 'energy' && (
                    <img src="/treasuer/energy.png" alt="energy" className="w-10 h-10"
                      style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />
                  )}
                  {item.type === 'gem' && (
                    <Gem size={36} className="text-purple-200" fill="#9D4EDD"
                      style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />
                  )}
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
// BottomHUD
// ═══════════════════════════════════════
function FloatingIconButton({ label, color, isMobile, onClick, badge, disabled, iconSrc, iconAlt }: {
  label: string; color: string; isMobile: boolean;
  onClick?: () => void; badge?: number; disabled?: boolean;
  iconSrc: string; iconAlt: string;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-0.5 disabled:opacity-70">
      <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
        <img src={iconSrc} alt={iconAlt} className="w-full h-full object-contain"
          style={{ filter: `drop-shadow(0 2px 8px ${color}aa) drop-shadow(0 0 4px ${color}66)` }} />
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black text-white border"
            style={{ background: '#FF4D6D', borderColor: 'rgba(15,10,45,0.95)', boxShadow: '0 2px 6px rgba(255,77,109,0.6)' }}>
            {badge}
          </div>
        )}
      </div>
      <span className="text-[7px] md:text-[9px] font-black leading-none" 
        style={{ color: color, textShadow: `0 1px 3px rgba(0,0,0,0.8)` }}>
        {label}
      </span>
    </motion.button>
  );
}

function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  const treasureImg = `/treasuer/${treasureState}.png`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1 md:pb-1.5 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'w-full max-w-[1400px]'}`}>
        <div className="relative rounded-xl px-3 md:px-6 py-1 md:py-1.5"
          style={{
            background: 'linear-gradient(135deg, rgba(20,15,55,0.85) 0%, rgba(15,10,45,0.9) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(6,214,160,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}>
          
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-yellow-300" />
            <span className="text-[8px] md:text-[9px] font-black text-yellow-200 tracking-wider uppercase">
              مكافآت الإنجاز
            </span>
            <Sparkles size={8} className="text-yellow-300" />
          </div>

          <div className="flex items-end justify-around gap-2 md:gap-3">
            <FloatingIconButton onClick={onMap} label="خريطة" color="#4CC9F0" isMobile={isMobile}
              iconSrc="/treasuer/map-icon.png" iconAlt="map" />
            <FloatingIconButton label="نجوم" color="#FFD700" isMobile={isMobile} disabled
              iconSrc="/treasuer/star.png" iconAlt="star" />

            <motion.div id="treasure-box" whileHover={{ scale: 1.08, y: -2 }}
              animate={treasureState === 'opend' ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
              className="flex flex-col items-center gap-0.5 cursor-pointer">
              <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center relative">
                <img src={treasureImg} alt="treasure" className="w-full h-full object-contain"
                  style={{ filter: treasureState === 'opend' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
                {treasureState === 'opend' && (
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.5), transparent 70%)' }} />
                )}
              </div>
              <span className="text-[7px] md:text-[9px] font-black text-yellow-400 leading-none"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>صندوق</span>
            </motion.div>

            <FloatingIconButton label="طاقة" color="#4CC9F0" isMobile={isMobile} disabled
              iconSrc="/treasuer/energy.png" iconAlt="energy" />
            <FloatingIconButton onClick={onHint} label="تلميح" color="#FFD700" isMobile={isMobile}
              badge={stats.hints} disabled={stats.hints === 0}
              iconSrc="/treasuer/HINT.svg" iconAlt="hint" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// SoundButton & GlassCard
// ═══════════════════════════════════════
function SoundButton({ onClick, color, label, size = 48 }: { 
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
        style={{
          background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
          boxShadow: `0 4px 15px ${color}66`,
          border: `1px solid ${color}`,
        }}>
        <Volume2 size={16} />
        <span>{label}</span>
      </motion.button>
    );
  }

  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClick}
      className="rounded-full flex items-center justify-center border-2 relative flex-shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, #06D6A0, #0984E3)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(6,214,160,0.6), 0 0 25px rgba(6,214,160,0.4)`,
      }}>
      {isPlaying && [0, 0.2, 0.4].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: '#06D6A0' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }} />
      ))}
      <Volume2 size={size * 0.4} className="text-white" />
    </motion.button>
  );
}

function GlassCard({ children, className = '', accentColor = '#06D6A0' }: {
  children: React.ReactNode; className?: string; accentColor?: string;
}) {
  return (
    <div className={`relative rounded-[1.5rem] overflow-hidden ${className}`}
      style={{
        background: 'rgba(20,15,55,0.55)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${accentColor}33, inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}>
      <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}33, transparent 60%)` }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}// ═══════════════════════════════════════
// 🌊 HeroWordDisplay (للديسكتوب) - الصورة نظيفة بدون زخارف
// ═══════════════════════════════════════
function HeroWordDisplay({ wordData }: { wordData: LakeWord }) {
  const [sparkles, setSparkles] = useState<Array<{ top: number; left: number; delay: number; duration: number }>>([]);
  
  const dayImg = DAY_IMAGES[wordData.word];

  useEffect(() => {
    setSparkles(
      Array.from({ length: 6 }, (_, i) => ({
        top: 20 + Math.random() * 60,
        left: 10 + Math.random() * 80,
        delay: i * 0.4,
        duration: 2 + Math.random() * 2,
      }))
    );
  }, [wordData.word]);

  // 🆕 لو يوم من أيام الأسبوع → الصورة لوحدها بدون زخارف
  if (dayImg) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: 280, height: 320 }}>
        {/* Glow خفيف خلف الصورة */}
        <motion.div
          className="absolute inset-0 blur-3xl"
          style={{ background: `radial-gradient(circle at 50% 50%, ${wordData.color}55, transparent 70%)` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* الصورة لوحدها بطبيعتها */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative select-none"
          style={{
            width: '100%',
            height: '100%',
            filter: `drop-shadow(0 15px 35px ${wordData.color}aa) drop-shadow(0 8px 20px rgba(0,0,0,0.4))`,
          }}
        >
          <img 
            src={dayImg} 
            alt={wordData.wordAr} 
            className="w-full h-full object-contain"
            draggable={false}
          />
        </motion.div>

        {/* النجوم المتطايرة */}
        {sparkles.map((s, i) => (
          <motion.div key={i} className="absolute pointer-events-none"
            style={{ top: `${s.top}%`, left: `${s.left}%`, zIndex: 5 }}
            animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}>
            <Sparkles size={14} style={{ color: wordData.color, filter: `drop-shadow(0 0 5px ${wordData.color})` }} />
          </motion.div>
        ))}
      </div>
    );
  }

  // 🌟 الشكل الأصلي للكلمات اللي ملهاش صور (الطقس، الطبيعة)
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
          boxShadow: `0 20px 60px ${wordData.color}33, inset 0 1px 0 ${wordData.color}55`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: '7rem',
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
      </motion.div>

      {sparkles.map((s, i) => (
        <motion.div key={i} className="absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}>
          <Sparkles size={12} style={{ color: wordData.color }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🌊 WordBuilderMobile - ترتيب حروف الكلمة (موبايل)
// ✅ يدعم الكلمات بمسافات (der Regen, die Sonne)
// ═══════════════════════════════════════
function WordBuilderMobile({ wordData, onComplete, onWrong }: {
  wordData: LakeWord;
  onComplete: (clientX: number, clientY: number) => void;
  onWrong: () => void;
}) {
  const word = wordData.word;
  const lettersOnly = useMemo(() => word.split('').filter(c => c !== ' '), [word]);
  const letterToWordIndex = useMemo(() => {
    const map: number[] = [];
    word.split('').forEach((c, i) => {
      if (c !== ' ') map.push(i);
    });
    return map;
  }, [word]);

  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedCount, setPlacedCount] = useState(0);
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [flyingLetter, setFlyingLetter] = useState<{
    letter: string;
    fromRect: DOMRect;
    toRect: DOMRect;
  } | null>(null);
  
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const darkColor = useMemo(() => getDarkColor(wordData.color), [wordData.color]);

  useEffect(() => {
    setShuffledLetters(shuffleWordLetters(lettersOnly.join('')));
    setPlacedCount(0);
    setPlacedIndices([]);
    setWrongShake(null);
    setIsComplete(false);
    setFlyingLetter(null);
  }, [word, lettersOnly]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete || placedIndices.includes(idx) || flyingLetter !== null) return;

    const nextExpectedLetter = lettersOnly[placedCount];
    
    if (letter.toLowerCase() === nextExpectedLetter.toLowerCase()) {
      const targetSlotIdx = letterToWordIndex[placedCount];
      const buttonEl = letterRefs.current[idx];
      const slotEl = slotRefs.current[targetSlotIdx];

      if (buttonEl && slotEl) {
        const fromRect = buttonEl.getBoundingClientRect();
        const toRect = slotEl.getBoundingClientRect();

        setFlyingLetter({ letter, fromRect, toRect });

        setTimeout(() => {
          setPlacedIndices(prev => [...prev, idx]);
          setPlacedCount(prev => prev + 1);
          setFlyingLetter(null);
          playCoinSound();

          if (placedCount + 1 === lettersOnly.length) {
            setIsComplete(true);
            speakWord(word);
            setTimeout(() => {
              onComplete(e.clientX, e.clientY);
            }, 600);
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

  const wordLength = lettersOnly.length;
  const slotWidth = wordLength <= 4 ? 38 : wordLength <= 6 ? 32 : wordLength <= 8 ? 28 : 24;
  const slotHeight = wordLength <= 4 ? 46 : wordLength <= 6 ? 40 : wordLength <= 8 ? 36 : 32;
  const slotFontSize = wordLength <= 4 ? '1.5rem' : wordLength <= 6 ? '1.3rem' : wordLength <= 8 ? '1.1rem' : '1rem';
  const slotGap = wordLength <= 6 ? 'gap-1.5' : 'gap-1';
  
  const btnWidth = wordLength <= 4 ? 42 : wordLength <= 6 ? 38 : wordLength <= 8 ? 34 : 30;
  const btnHeight = btnWidth;
  const btnFontSize = wordLength <= 4 ? '1.5rem' : wordLength <= 6 ? '1.3rem' : wordLength <= 8 ? '1.1rem' : '1rem';

  const isSlotFilled = (wordIdx: number): boolean => {
    const letterIdx = letterToWordIndex.indexOf(wordIdx);
    return letterIdx !== -1 && letterIdx < placedCount;
  };

  return (
    <>
      <AnimatePresence>
        {flyingLetter && (
          <motion.div
            className="fixed pointer-events-none z-[100] flex items-center justify-center rounded-lg"
            initial={{
              left: flyingLetter.fromRect.left,
              top: flyingLetter.fromRect.top,
              width: flyingLetter.fromRect.width,
              height: flyingLetter.fromRect.height,
              scale: 1,
            }}
            animate={{
              left: flyingLetter.toRect.left,
              top: flyingLetter.toRect.top,
              width: flyingLetter.toRect.width,
              height: flyingLetter.toRect.height,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { times: [0, 0.5, 1] },
            }}
            style={{
              background: `linear-gradient(145deg, ${wordData.gradient[0]}, ${wordData.gradient[1]})`,
              border: `2px solid rgba(255,255,255,0.6)`,
              boxShadow: `0 6px 25px ${wordData.color}cc`,
            }}
          >
            <span className="font-black text-white"
              style={{
                fontSize: '1.5rem',
                lineHeight: 1,
                textShadow: `0 2px 6px rgba(0,0,0,0.5)`,
              }}>
              {flyingLetter.letter}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="w-full max-w-md mx-auto p-3" accentColor={wordData.color}>
        <div className="flex flex-col items-center gap-2">
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
              border: `2px solid ${wordData.color}66`, 
              boxShadow: `0 4px 15px ${wordData.color}44` 
            }}>
            <span className="font-black text-xs text-gray-800">استمع للكلمة ورتب الحروف</span>
          </motion.div>

          {DAY_IMAGES[wordData.word] ? (
            // 🆕 لو يوم من أيام الأسبوع → الصورة بحجم كبير بدون بوردر
            <motion.div 
              animate={{ y: [0, -4, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex-shrink-0 relative select-none"
              style={{ 
                width: 130,
                height: 160,
                filter: `drop-shadow(0 8px 20px ${wordData.color}aa) drop-shadow(0 4px 10px rgba(0,0,0,0.4))`,
              }}>
              <img 
                src={DAY_IMAGES[wordData.word]} 
                alt={wordData.wordAr} 
                className="w-full h-full object-contain"
                draggable={false}
              />
            </motion.div>
          ) : (
            // الشكل القديم للكلمات اللي ملهاش صور
            <>
              <motion.div 
                animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }} 
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-2xl flex items-center justify-center border-2 flex-shrink-0 relative overflow-hidden"
                style={{ 
                  width: 80, height: 80,
                  background: `linear-gradient(145deg, ${wordData.gradient[0]}44, ${wordData.gradient[1]}33)`, 
                  borderColor: `${wordData.color}88`, 
                  boxShadow: `0 6px 20px ${wordData.color}77` 
                }}>
                <span style={{ 
                  fontSize: '3rem',
                  filter: `drop-shadow(0 4px 10px ${wordData.color}aa)`,
                  lineHeight: 1,
                }}>
                  {wordData.emoji}
                </span>
              </motion.div>

              <div className="text-center">
                <div className="font-bold text-sm" 
                  style={{ color: wordData.color, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {wordData.wordAr}
                </div>
              </div>
            </>
          )}

          <SoundButton onClick={() => speakWord(word)} color={wordData.color} size={38} />

          <div className={`flex items-center justify-center ${slotGap} flex-wrap mt-1`} dir="ltr">
            {word.split('').map((letter, idx) => {
              const isSpace = letter === ' ';
              const filled = isSlotFilled(idx);

              if (isSpace) {
                return (
                  <div key={`slot-${idx}`} style={{ width: slotWidth * 0.4, height: slotHeight }} />
                );
              }

              return (
                <motion.div
                  ref={el => { slotRefs.current[idx] = el; }}
                  key={`slot-${idx}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: filled ? [0.8, 1.15, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden"
                  style={{
                    width: slotWidth,
                    height: slotHeight,
                    background: filled 
                      ? `linear-gradient(145deg, ${wordData.gradient[0]}, ${wordData.gradient[1]})` 
                      : 'rgba(255,255,255,0.05)',
                    borderColor: filled ? wordData.color : `${wordData.color}55`,
                    borderStyle: filled ? 'solid' : 'dashed',
                    boxShadow: filled ? `0 4px 12px ${wordData.color}aa` : 'none',
                  }}
                >
                  {!filled && (
                    <span className="font-black absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{
                        fontSize: slotFontSize,
                        lineHeight: 1,
                        color: wordData.color,
                        opacity: 0.25,
                      }}
                    >
                      {letter}
                    </span>
                  )}
                  
                  {filled && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="font-black text-white relative z-10"
                      style={{
                        fontSize: slotFontSize,
                        lineHeight: 1,
                        textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                      }}
                    >
                      {letter}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {shuffledLetters.map((letter, idx) => {
              const isPlaced = placedIndices.includes(idx);
              const isShaking = wrongShake === idx;
              const isFlying = flyingLetter && flyingLetter.letter === letter && !placedIndices.includes(idx);

              return (
                <AnimatePresence key={`shuffled-${idx}`} mode="wait">
                  {!isPlaced && !isFlying && (
                    <motion.button
                      ref={el => { letterRefs.current[idx] = el; }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isShaking ? {
                        x: [-6, 6, -6, 6, 0],
                        scale: 1, opacity: 1,
                        background: 'linear-gradient(145deg, #FF4444, #CC0000)',
                      } : { scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={isShaking 
                        ? { duration: 0.4 }
                        : { delay: idx * 0.05, type: 'spring', stiffness: 300 }
                      }
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleLetterClick(letter, idx, e)}
                      disabled={isComplete || flyingLetter !== null}
                      className="rounded-lg flex items-center justify-center flex-shrink-0 border-2"
                      style={{
                        width: btnWidth, height: btnHeight,
                        background: isShaking 
                          ? 'linear-gradient(145deg, #FF4444, #CC0000)' 
                          : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.95))',
                        borderColor: isShaking ? '#FF4444' : `${wordData.color}aa`,
                        boxShadow: isShaking 
                          ? '0 4px 15px rgba(255,68,68,0.6)' 
                          : `0 4px 14px ${wordData.color}55`,
                      }}
                    >
                      <span className="font-black"
                        style={{
                          fontSize: btnFontSize,
                          lineHeight: 1,
                          color: isShaking ? 'white' : darkColor,
                          textShadow: isShaking ? '0 2px 6px rgba(0,0,0,0.4)' : 'none',
                        }}
                      >
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
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 font-black text-sm py-1.5 px-4 rounded-xl mt-1"
                style={{ 
                  background: 'rgba(88,204,2,0.3)', 
                  color: '#58CC02', 
                  border: '2px solid #58CC0288' 
                }}>
                <Check size={14} /> ممتاز! 🎉
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </>
  );
}

// ═══════════════════════════════════════
// 🌊 LearnWordPhase - مرحلة تعلم الكلمة
// ═══════════════════════════════════════
function LearnWordPhase({ itemData, groupTitle, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  itemData: LakeWord;
  groupTitle: string;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  onCorrect: (clientX: number, clientY: number) => void;
  isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(itemData.word);

  useEffect(() => {
    setInput('');
    setStatus('idle');
    const t = setTimeout(() => { speakWord(itemData.word); inputRef.current?.focus(); }, 400);
    return () => clearTimeout(t);
  }, [itemData.word]);

  const handleMobileComplete = (cx: number, cy: number) => {
    playCoinSound();
    onCombo();
    onKarlReact('happy');
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy);
    setTimeout(onDone, 1400);
  };

  const handleMobileWrong = () => {
    onKarlReact('sad');
  };

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, itemData.word)) {
      setStatus('correct');
      speakWord(itemData.word);
      playCoinSound();
      onCombo();
      onKarlReact('happy');

      let cx = 0, cy = 0;
      if (e) { cx = e.clientX; cy = e.clientY; }
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top + r.height / 2;
      }
      onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);

      setTimeout(onDone, 1000);
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
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={itemData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      
      <motion.div
        key={`learn-${itemData.word}`}
        initial={{ opacity: 0, x: 60 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        {isMobile ? (
          <WordBuilderMobile
            wordData={itemData}
            onComplete={handleMobileComplete}
            onWrong={handleMobileWrong}
          />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <motion.div
                onClick={() => speakWord(itemData.word)}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer"
              >
                <HeroWordDisplay wordData={itemData} />
              </motion.div>
              <SoundButton onClick={() => speakWord(itemData.word)} color={itemData.color} label="استمع للكلمة" />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${itemData.color}aa` }}>
                  Wort · {groupTitle}
                </div>
                <div className="text-2xl font-black text-white">اكتب الكلمة</div>
              </div>

              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={itemData.word}
                color={itemData.color}
                status={status}
                fontSize="1.4rem"
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
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
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
        )}
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// 🎤 SpeakingPractice - مرحلة نطق الكلمة (مُحسّن للكمبيوتر)
// ═══════════════════════════════════════
function SpeakingPractice({ wordData, isMobile, onSuccess, onSkip }: {
  wordData: LakeWord;
  isMobile: boolean;
  onSuccess: (clientX: number, clientY: number) => void;
  onSkip: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'try-again' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  const targetWord = wordData.word;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results[0];
      let bestMatch = '';
      let bestScore = 0;

      for (let i = 0; i < (results as any).length; i++) {
        const text = (results as any)[i].transcript.toLowerCase().trim();
        const score = similarityScore(text, targetWord.toLowerCase());
        if (score > bestScore) {
          bestScore = score;
          bestMatch = text;
        }
      }

      setTranscript(bestMatch);
      setIsListening(false);

      if (bestScore >= 0.65) {
        setStatus('success');
        playCoinSound();
        
        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;
        if (micButtonRef.current) {
          const rect = micButtonRef.current.getBoundingClientRect();
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
        
        setTimeout(() => onSuccess(cx, cy), 1500);
      } else {
        setStatus('try-again');
        playBuzzSound();
        setAttempts(a => a + 1);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setStatus('error');
      } else if (event.error !== 'no-speech') {
        setStatus('try-again');
        setAttempts(a => a + 1);
      } else {
        setStatus('idle');
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [targetWord, onSuccess]);

  const handleStart = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    setStatus('listening');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      setIsListening(false);
      setStatus('error');
    }
  };

  if (!supported) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <GlassCard className="p-6 text-center" accentColor={wordData.color}>
          <div className="text-5xl mb-3">😅</div>
          <h3 className="text-lg font-black text-white mb-2">المتصفح بتاعك مش بيدعم النطق</h3>
          <p className="text-white/60 text-sm mb-4">جرب تستخدم Chrome أو Edge</p>
          <button onClick={onSkip}
            className="px-8 py-3 rounded-2xl font-black text-white"
            style={{ background: `linear-gradient(135deg, ${wordData.gradient[0]}, ${wordData.gradient[1]})` }}>
            تخطي ⏭️
          </button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key={`speak-${wordData.word}`}
      initial={{ opacity: 0, x: 60 }} 
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="w-full max-w-2xl mx-auto"
    >
      <GlassCard className={`mx-auto ${isMobile ? 'p-3 max-w-md' : 'p-4 max-w-md'}`} accentColor={wordData.color}>
        <div className={`flex flex-col items-center ${isMobile ? 'gap-2' : 'gap-2.5'}`}>
          
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: [0, 1.2, 1] }} 
            transition={{ duration: 0.5 }}
            className="text-3xl">
            🎤
          </motion.div>

          <div className="text-center">
            <h3 className={`font-black text-white ${isMobile ? 'text-base' : 'text-lg'}`}>
              كرر الكلمة بصوتك
            </h3>
            <p className={`text-white/60 font-bold ${isMobile ? 'text-[10px] mt-0.5' : 'text-xs mt-1'}`}>
              اضغط على المايك واتكلم بوضوح
            </p>
          </div>

          <div className={`w-full rounded-2xl border-2 text-center backdrop-blur-md ${isMobile ? 'p-2' : 'p-3'}`}
            style={{
              background: `linear-gradient(135deg, ${wordData.color}22, ${wordData.color}08)`,
              borderColor: `${wordData.color}55`,
            }}>
            
            <div className="flex items-center justify-center gap-2 mb-1">
              {DAY_IMAGES[wordData.word] ? (
                <img 
                  src={DAY_IMAGES[wordData.word]} 
                  alt={wordData.wordAr}
                  className="w-10 h-10 rounded-lg object-cover border-2"
                  style={{ borderColor: wordData.color }}
                />
              ) : (
                <span className="text-2xl">
                  {wordData.emoji}
                </span>
              )}
              <p className={`font-black text-white ${isMobile ? 'text-lg' : 'text-xl'}`}
                style={{ textShadow: `0 0 20px ${wordData.color}88`, direction: 'ltr' }}>
                {targetWord}
              </p>
            </div>
            <p className="font-bold text-xs"
              style={{ color: wordData.color }}>
              {wordData.wordAr}
            </p>
            
            <button onClick={() => speakWord(targetWord)}
              className="inline-flex items-center gap-1.5 mt-1.5 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all font-bold px-3 py-1 text-[10px]">
              <Volume2 size={11} /> اسمع النطق الصح
            </button>
          </div>

          <motion.button
            ref={micButtonRef}
            whileHover={!isListening ? { scale: 1.05 } : {}}
            whileTap={!isListening ? { scale: 0.95 } : {}}
            onClick={handleStart}
            disabled={isListening || status === 'success'}
            className={`relative rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}
            style={{
              background: status === 'success'
                ? 'linear-gradient(135deg, #58CC02, #096A02)'
                : isListening
                ? 'linear-gradient(135deg, #FF4444, #C70039)'
                : `linear-gradient(135deg, ${wordData.gradient[0]}, ${wordData.gradient[1]})`,
              boxShadow: isListening
                ? '0 0 60px rgba(255,68,68,0.6)'
                : `0 10px 40px ${wordData.color}66`,
            }}
          >
            {isListening && (
              <>
                {[0, 0.3, 0.6].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-4"
                    style={{ borderColor: '#FF4444' }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.5, delay, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
              </>
            )}

            {status === 'success' ? (
              <Check size={isMobile ? 30 : 36} className="text-white" strokeWidth={3} />
            ) : (
              <Mic size={isMobile ? 30 : 36} className="text-white" />
            )}
          </motion.button>

          <AnimatePresence mode="wait">
            {transcript && (
              <motion.div 
                key="transcript"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="text-center">
                <p className="text-white/40 font-bold mb-0.5 text-[10px]">
                  سمعتك بتقول:
                </p>
                <p className="font-black text-white text-sm" 
                  style={{ direction: 'ltr' }}>
                  "{transcript}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {status === 'listening' && (
              <motion.p 
                key="listening"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className={`font-black text-red-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                🎙️ بسمعك دلوقتي...
              </motion.p>
            )}
            {status === 'success' && (
              <motion.p 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="font-black text-green-400 text-base">
                ✅ نطق ممتاز! 🌟
              </motion.p>
            )}
            {status === 'try-again' && (
              <motion.p 
                key="try-again"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`font-black text-yellow-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                😊 قريب! حاول تاني بصوت أوضح
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p 
                key="error"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`font-black text-red-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                ❌ لازم تسمح للموقع باستخدام المايك
              </motion.p>
            )}
            {status === 'idle' && (
              <motion.p 
                key="idle"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`font-bold text-white/40 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                اضغط على المايك وابدأ تتكلم
              </motion.p>
            )}
          </AnimatePresence>

          {(attempts >= 2 || status === 'error') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex justify-center">
              <button onClick={onSkip}
                className={`flex items-center gap-2 rounded-2xl font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all ${isMobile ? 'px-4 py-2 text-xs' : 'px-5 py-2 text-xs'}`}>
                <SkipForward size={14} /> تخطي وكمل
              </button>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// TEST 1 — Quiz
// ═══════════════════════════════════════
interface QuizQuestion {
  word: string; wordAr: string; emoji: string; color: string; gradient: string[];
  options: string[]; correctAnswer: string;
}

function generateQuiz(items: LakeWord[]): QuizQuestion[] {
  return items.map(item => {
    const wrong = items
      .filter(i => i.word !== item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => i.wordAr);
    return {
      word: item.word, wordAr: item.wordAr, emoji: item.emoji,
      color: item.color, gradient: item.gradient,
      correctAnswer: item.wordAr,
      options: [...wrong, item.wordAr].sort(() => Math.random() - 0.5),
    };
  }).sort(() => Math.random() - 0.5).slice(0, 6);
}

function QuizTest({ items, onPass, onFail, onCorrect, onKarlReact, onCombo }: {
  items: LakeWord[];
  onPass: () => void; onFail: () => void;
  onCorrect: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [questions] = useState(() => generateQuiz(items));
  const [idx, setIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const q = questions[idx];
  if (!q) return null;

  const handleSelect = (option: string, e: React.MouseEvent) => {
    if (feedback) return;
    setSelected(option);
    if (option === q.correctAnswer) {
      setFeedback('correct');
      playCoinSound(); onCombo(); onKarlReact('happy');
      setConfettiPos({ x: e.clientX, y: e.clientY });
      setConfettiTrigger(t => t + 1);
      onCorrect(e.clientX, e.clientY);
      setTimeout(() => {
        setFeedback(null); setSelected(null);
        if (idx + 1 >= questions.length) { onKarlReact('celebrate'); setTimeout(onPass, 800); }
        else setIdx(i => i + 1);
      }, 1100);
    } else {
      const nw = wrong + 1;
      setWrong(nw);
      setFeedback('wrong');
      playBuzzSound(); onKarlReact('sad');
      setTimeout(() => { setFeedback(null); setSelected(null); if (nw >= 3) onFail(); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#4CC9F0', '#FF6B6B', '#FFFFFF']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-white/40">
            {idx + 1} / {questions.length}
          </span>
          <span className="text-xs font-bold" style={{ color: wrong >= 2 ? '#FF6B6B' : 'rgba(255,255,255,0.3)' }}>
            {wrong > 0 && '❌'.repeat(Math.min(wrong, 3))}
          </span>
        </div>

        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full transition-all duration-300"
              style={{ background: i < idx ? '#58CC02' : i === idx ? q.color : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            className="rounded-3xl border-2 overflow-hidden backdrop-blur-md p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${q.color}33, ${q.color}11)`,
              borderColor: `${q.color}66`,
              boxShadow: `0 8px 30px ${q.color}44`,
            }}
          >
            {DAY_IMAGES[q.word] ? (
              <img 
                src={DAY_IMAGES[q.word]} 
                alt={q.wordAr}
                className="w-24 h-24 mx-auto mb-3 rounded-2xl object-cover border-2"
                style={{ borderColor: q.color, boxShadow: `0 6px 20px ${q.color}66` }}
              />
            ) : (
              <div className="text-5xl mb-3">{q.emoji}</div>
            )}
            <div className="font-black text-2xl md:text-3xl text-white mb-2" style={{ textShadow: `0 0 30px ${q.color}aa` }}>
              {q.word}
            </div>
            <button onClick={() => speakWord(q.word)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all text-sm font-bold mb-3">
              <Volume2 size={14} /> استمع
            </button>
            <p className="text-sm font-bold text-white/60">ما معنى هذه الكلمة؟</p>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === q.correctAnswer;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected && !isCorrect;
            return (
              <motion.button
                key={i}
                whileHover={!feedback ? { scale: 1.03, y: -2 } : {}}
                whileTap={!feedback ? { scale: 0.97 } : {}}
                onClick={e => handleSelect(opt, e)}
                disabled={!!feedback}
                className="relative py-4 px-5 rounded-2xl font-black text-base border-2 transition-all text-white backdrop-blur-md"
                style={{
                  background: showCorrect ? 'rgba(88,204,2,0.35)' : showWrong ? 'rgba(255,68,68,0.35)' : isSelected ? `${q.color}33` : 'rgba(255,255,255,0.08)',
                  borderColor: showCorrect ? '#58CC02' : showWrong ? '#FF4444' : isSelected ? q.color : 'rgba(255,255,255,0.2)',
                  boxShadow: showCorrect ? '0 0 25px rgba(88,204,2,0.4)' : showWrong ? '0 0 25px rgba(255,68,68,0.4)' : 'none',
                }}
              >
                {showCorrect && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2"><Check size={16} className="text-[#58CC02]" /></motion.span>}
                {showWrong && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2"><X size={16} className="text-[#FF4444]" /></motion.span>}
                {opt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}// ═══════════════════════════════════════
// TEST 2 — Order Days (مع صور الأيام الجديدة)
// ═══════════════════════════════════════
function OrderTest({ items, onPass, onFail, onCorrect, onKarlReact, onCombo }: {
  items: WeekDay[];
  onPass: () => void; onFail: () => void;
  onCorrect: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [shuffled] = useState(() => shuffle(items));
  const [placed, setPlaced] = useState<(WeekDay | null)[]>(Array(items.length).fill(null));
  const [dragging, setDragging] = useState<number | null>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const [wrongs, setWrongs] = useState(0);
  const [correct, setCorrect] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [done, setDone] = useState(false);

  const touchDragging = useRef<number | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  const available = shuffled.filter(item => !placed.some(p => p?.word === item.word));

  const doPlace = (dayItem: WeekDay, slotIdx: number, cx: number, cy: number) => {
    if (correct.has(slotIdx)) return;
    const expected = items[slotIdx];
    if (dayItem.word === expected.word) {
      const newPlaced = [...placed];
      newPlaced[slotIdx] = dayItem;
      setPlaced(newPlaced);
      const newCorrect = new Set([...correct, slotIdx]);
      setCorrect(newCorrect);
      speakWord(dayItem.word);
      playCoinSound(); onCombo(); onKarlReact('happy');
      onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      if (newCorrect.size === items.length) {
        setDone(true);
        onKarlReact('celebrate');
        setTimeout(onPass, 1800);
      }
    } else {
      const nw = wrongs + 1;
      setWrongs(nw);
      setWrongFlash(slotIdx);
      playBuzzSound(); onKarlReact('sad');
      setTimeout(() => setWrongFlash(null), 600);
      if (nw >= 4) setTimeout(onFail, 700);
    }
  };

  const handleDragStart = (idx: number) => setDragging(idx);
  const handleDragEnd = () => { setDragging(null); setOverSlot(null); };
  const handleDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault(); setOverSlot(null);
    if (dragging !== null) doPlace(available[dragging], slotIdx, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, idx: number) => {
    touchDragging.current = idx;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.88;pointer-events:none;z-index:9998;border-radius:16px;`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current) return;
    touchCloneRef.current.style.left = (e.touches[0].clientX - touchOffRef.current.x) + 'px';
    touchCloneRef.current.style.top = (e.touches[0].clientY - touchOffRef.current.y) + 'px';
    let found: number | null = null;
    document.querySelectorAll('[data-slot]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.touches[0].clientX >= r.left && e.touches[0].clientX <= r.right && e.touches[0].clientY >= r.top && e.touches[0].clientY <= r.bottom)
        found = parseInt((el as HTMLElement).dataset.slot!);
    });
    setOverSlot(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    let dropped: number | null = null;
    document.querySelectorAll('[data-slot]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom)
        dropped = parseInt((el as HTMLElement).dataset.slot!);
    });
    if (dropped !== null && touchDragging.current !== null)
      doPlace(available[touchDragging.current], dropped, ex, ey);
    setOverSlot(null);
    touchDragging.current = null;
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#FF6B6B', '#4CC9F0', '#FFFFFF']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">رتّب الأيام بالترتيب الصح</div>
          <p className="text-white/60 text-sm font-bold">من الاثنين للأحد — اسحب وضع كل يوم في مكانه</p>
          {wrongs > 0 && (
            <p className="text-xs font-bold mt-1" style={{ color: '#FF6B6B' }}>
              {'❌'.repeat(Math.min(wrongs, 4))} {wrongs}/4
            </p>
          )}
        </div>

        {/* 🆕 السلوتات: 7 خانات بصور */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {items.map((day, slotIdx) => {
            const isCorrect = correct.has(slotIdx);
            const isOver = overSlot === slotIdx && !isCorrect;
            const isWrong = wrongFlash === slotIdx;
            const dayImg = DAY_IMAGES[day.word];
            
            return (
              <motion.div
                key={slotIdx}
                data-slot={slotIdx}
                animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : isCorrect ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.35 }}
                onDragOver={e => { e.preventDefault(); if (!isCorrect) setOverSlot(slotIdx); }}
                onDragLeave={() => setOverSlot(null)}
                onDrop={e => handleDrop(e, slotIdx)}
                className="relative aspect-[3/4] rounded-2xl border-2 transition-all select-none overflow-hidden"
                style={{
                  background: isCorrect 
                    ? 'transparent'
                    : isOver ? 'rgba(255,255,255,0.15)'
                    : isWrong ? 'rgba(255,68,68,0.25)'
                    : 'rgba(255,255,255,0.06)',
                  borderColor: isCorrect ? day.color
                    : isOver ? 'rgba(255,255,255,0.6)'
                    : isWrong ? '#FF4444'
                    : 'rgba(255,255,255,0.2)',
                  borderStyle: isCorrect ? 'solid' : 'dashed',
                  boxShadow: isCorrect ? `0 0 25px ${day.color}aa` : isOver ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
                  backdropFilter: !isCorrect ? 'blur(8px)' : 'none',
                }}
              >
                {isCorrect && dayImg ? (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src={dayImg} 
                      alt={day.wordAr} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white"
                      style={{
                        background: `linear-gradient(135deg, ${day.color}, ${day.gradient[1]})`,
                        boxShadow: `0 2px 8px ${day.color}aa`,
                        border: '1.5px solid white',
                      }}>
                      {slotIdx + 1}
                    </div>
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center bg-green-500 border-2 border-white">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
                    <span className="text-white/40 font-black text-lg md:text-xl">{slotIdx + 1}</span>
                    <span className="text-white/30 text-[8px] md:text-[10px] font-bold text-center leading-tight">{day.wordAr}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 🆕 البطاقات المتاحة: مع الصور */}
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center pt-3">
          {available.map((day, idx) => {
            const dayImg = DAY_IMAGES[day.word];
            return (
              <motion.div
                key={day.word}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnd={handleDragEnd}
                onTouchStart={e => onTouchStart(e, idx)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={() => speakWord(day.word)}
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl border-2 cursor-grab select-none overflow-hidden flex-shrink-0"
                style={{
                  width: 75,
                  height: 100,
                  borderColor: `${day.color}aa`,
                  boxShadow: `0 6px 20px ${day.color}66`,
                  opacity: dragging === idx ? 0.4 : 1,
                }}
              >
                {dayImg ? (
                  <>
                    <img 
                      src={dayImg} 
                      alt={day.wordAr} 
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-1 py-1"
                      style={{
                        background: `linear-gradient(to top, ${day.color}ee, transparent)`,
                      }}>
                      <p className="font-black text-white text-[10px] text-center leading-tight" 
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                        {day.word}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-2"
                    style={{
                      background: `linear-gradient(135deg, ${day.gradient[0]}, ${day.gradient[1]})`,
                    }}>
                    <span style={{ fontSize: 24 }}>{day.emoji}</span>
                    <span className="font-black text-white text-xs">{day.word}</span>
                    <span className="font-bold text-[9px] text-white/80">{day.wordAr}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
            style={{ background: 'rgba(0,10,20,0.92)', backdropFilter: 'blur(10px)' }}>
            <motion.div 
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }} 
              transition={{ duration: 0.8 }} 
              className="text-7xl">📅</motion.div>
            <p className="font-black text-white text-3xl">رتبت الأيام صح!</p>
            <div className="flex gap-1">
              {items.map((d, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <img src="/treasuer/star.png" alt="star" className="w-7 h-7" 
                    style={{ filter: 'drop-shadow(0 0 10px #FFD700)' }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <p className="text-white/40 text-xs text-center">💡 اضغط على أي بطاقة لتسمع النطق</p>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// TEST 3 — Match
// ═══════════════════════════════════════
function MatchTest({ items, onPass, onFail, onCorrect, onKarlReact, onCombo }: {
  items: LakeWord[];
  onPass: () => void; onFail: () => void;
  onCorrect: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [emojiOrder] = useState(() => shuffle(items));
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<string | null>(null);
  const [overTarget, setOverTarget] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [successPair, setSuccessPair] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const touchDragging = useRef<string | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (matched.size === items.length) {
      onKarlReact('celebrate');
      setTimeout(onPass, 800);
    }
  }, [matched]);

  const doMatch = (fromWord: string, toWord: string, cx: number, cy: number) => {
    if (fromWord === toWord) {
      const item = items.find(i => i.word === fromWord)!;
      speakWord(item.word);
      playCoinSound(); onCombo(); onKarlReact('happy');
      onCorrect(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      setSuccessPair(fromWord);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, fromWord]));
    } else {
      playBuzzSound(); onKarlReact('sad');
      setErrors(e => e + 1);
      setWrongPair(fromWord);
      setTimeout(() => setWrongPair(null), 500);
      if (errors + 1 >= 5) setTimeout(onFail, 600);
    }
  };

  const handleDragStart = (word: string) => setDragging(word);
  const handleDragEnd = () => { setDragging(null); setOverTarget(null); };
  const handleDrop = (e: React.DragEvent, toWord: string) => {
    e.preventDefault(); setOverTarget(null);
    if (dragging) doMatch(dragging, toWord, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, word: string) => {
    if (matched.has(word)) return;
    touchDragging.current = word;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.88;pointer-events:none;z-index:9998;border-radius:16px;`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current) return;
    touchCloneRef.current.style.left = (e.touches[0].clientX - touchOffRef.current.x) + 'px';
    touchCloneRef.current.style.top = (e.touches[0].clientY - touchOffRef.current.y) + 'px';
    let found: string | null = null;
    document.querySelectorAll('[data-match-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.touches[0].clientX >= r.left && e.touches[0].clientX <= r.right && e.touches[0].clientY >= r.top && e.touches[0].clientY <= r.bottom)
        found = (el as HTMLElement).dataset.matchTarget!;
    });
    setOverTarget(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    let dropped: string | null = null;
    document.querySelectorAll('[data-match-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom)
        dropped = (el as HTMLElement).dataset.matchTarget!;
    });
    if (dropped && touchDragging.current) doMatch(touchDragging.current, dropped, ex, ey);
    setOverTarget(null);
    touchDragging.current = null;
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#58CC02', '#4CC9F0', '#FFFFFF']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">طابق الكلمة بالإيموجي</div>
          <p className="text-white/60 text-sm font-bold">اسحب الكلمة العربية وضعها على الإيموجي الصح</p>
          {errors > 0 && (
            <p className="text-xs font-bold mt-1" style={{ color: '#FF6B6B' }}>
              {'❌'.repeat(Math.min(errors, 5))} {errors}/5
            </p>
          )}
        </div>

        <div className="flex gap-1.5 justify-center">
          {items.map(item => (
            <motion.div key={item.word}
              animate={matched.has(item.word) ? { scale: [1, 1.5, 1] } : {}}
              className="w-3 h-3 rounded-full transition-all"
              style={{ background: matched.has(item.word) ? `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` : 'rgba(255,255,255,0.2)', boxShadow: matched.has(item.word) ? `0 0 10px ${item.color}88` : 'none' }}
            />
          ))}
        </div>

        <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 40px 1fr' }} dir="rtl">
          <div className="text-center text-xs font-black text-white/40 tracking-widest uppercase pb-1">الكلمة</div>
          <div />
          <div className="text-center text-xs font-black text-white/40 tracking-widest uppercase pb-1">الإيموجي</div>

          {items.map((item, i) => {
            const emojiItem = emojiOrder[i];
            const isWordMatched = matched.has(item.word);
            const isEmojiMatched = matched.has(emojiItem.word);
            const isWrong = wrongPair === item.word;
            const isSuccess = successPair === item.word;
            const isOver = overTarget === emojiItem.word && !isEmojiMatched;

            return (
              <div key={`row-${i}`} className="contents">
                <motion.div
                  draggable={!isWordMatched}
                  onDragStart={() => handleDragStart(item.word)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={e => onTouchStart(e, item.word)}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onClick={() => speakWord(item.word)}
                  animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : isSuccess ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.35 }}
                  className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                  style={{
                    cursor: isWordMatched ? 'default' : 'grab',
                    background: isWordMatched ? `linear-gradient(135deg, ${item.gradient[0]}44, ${item.gradient[1]}22)` : `${item.color}22`,
                    border: `2px solid ${isWordMatched ? item.color + 'aa' : isWrong ? '#ef4444' : isSuccess ? '#22c55e' : item.color + '55'}`,
                    boxShadow: isWordMatched ? `0 0 20px ${item.color}55` : dragging === item.word ? `0 8px 30px ${item.color}66` : 'none',
                    opacity: dragging && dragging !== item.word && !isWordMatched ? 0.4 : 1,
                  }}
                >
                  <span className="font-black text-white text-sm text-center leading-snug">{item.wordAr}</span>
                  {isWordMatched && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs" style={{ color: item.color }}>✓</motion.span>}
                </motion.div>

                <div className="flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                </div>

                <motion.div
                  data-match-target={emojiItem.word}
                  onDragOver={e => { e.preventDefault(); if (!isEmojiMatched) setOverTarget(emojiItem.word); }}
                  onDragLeave={() => setOverTarget(null)}
                  onDrop={e => !isEmojiMatched && handleDrop(e, emojiItem.word)}
                  onClick={() => speakWord(emojiItem.word)}
                  className="flex items-center justify-center rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                  style={{
                    cursor: 'pointer',
                    background: isEmojiMatched ? `linear-gradient(135deg, ${emojiItem.gradient[0]}44, ${emojiItem.gradient[1]}22)` : isOver ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                    border: `2px ${isEmojiMatched ? 'solid' : 'dashed'} ${isEmojiMatched ? emojiItem.color + 'aa' : isOver ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.22)'}`,
                    boxShadow: isOver ? '0 0 25px rgba(255,255,255,0.2)' : isEmojiMatched ? `0 0 20px ${emojiItem.color}55` : 'none',
                  }}
                >
                  <span style={{ fontSize: 28, filter: isEmojiMatched ? `drop-shadow(0 0 12px ${emojiItem.color})` : 'none' }}>
                    {emojiItem.emoji}
                  </span>
                  {isEmojiMatched && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs ml-1" style={{ color: emojiItem.color }}>✓</motion.span>}
                </motion.div>
              </div>
            );
          })}
        </div>
        <p className="text-white/30 text-xs text-center">💡 اضغط على أي بطاقة لتسمع النطق</p>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// شاشات نجاح وفشل
// ═══════════════════════════════════════
function SuccessScreen({ group, onNext, isLast }: { group: LakeGroup; onNext: () => void; isLast: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto px-4">
      <motion.div animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 1, delay: 0.2 }} className="text-7xl md:text-9xl">{group.icon}</motion.div>
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          أنهيت {group.title}! 🎉
        </h2>
        <p className="font-bold text-base md:text-lg" style={{ color: '#06D6A0', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          {isLast ? 'أنهيت دروس البحيرة! 🏞️' : 'كمّل على المجموعة الجاية 💪'}
        </p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 400 }}>
            <img src="/treasuer/star.png" alt="star" className="w-10 h-10 md:w-12 md:h-12" style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onNext}
        className="px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-xl text-white"
        style={{ background: 'linear-gradient(135deg, #06D6A0, #0984E3)', boxShadow: '0 10px 40px rgba(6,214,160,0.4)' }}>
        {isLast ? '🏰 قلعة نويشفانشتاين' : 'المجموعة الجاية 🚀'}
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto px-4">
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.5, repeat: 3 }} className="text-7xl md:text-8xl">😅</motion.div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          حاول تاني!
        </h2>
        <p className="font-bold text-white/70 text-sm md:text-base" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          راجع الكلمات كويس وبعدين اعمل الاختبار
        </p>
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onRetry}
        className="flex items-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-2xl font-black text-base md:text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #F72585, #7209B7)', boxShadow: '0 10px 30px rgba(247,37,133,0.4)' }}>
        <RotateCcw size={20} /> أعد المجموعة
      </motion.button>
    </motion.div>
  );
}

function AllDoneScreen({ totalStars, onMap }: { totalStars: number; onMap: () => Promise<void> }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto px-4">
      <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl md:text-9xl">🏞️</motion.div>
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          أنهيت بحيرة الملوك!
        </h2>
        <p className="font-bold text-base md:text-lg text-[#06D6A0]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          قلعة نويشفانشتاين اتفتحت لك! 🏰
        </p>
      </div>
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-md border border-yellow-400/40"
        style={{ background: 'rgba(255,215,0,0.15)', boxShadow: '0 8px 30px rgba(255,215,0,0.3)' }}>
        <img src="/treasuer/star.png" alt="star" className="w-7 h-7 md:w-8 md:h-8" style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }} />
        <span className="font-black text-3xl md:text-4xl text-yellow-400">{totalStars}</span>
        <span className="font-bold text-white/80 text-base md:text-lg">نجمة!</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + s * 0.15, type: 'spring' }}>
            <img src="/treasuer/star.png" alt="star" className="w-12 h-12 md:w-14 md:h-14" style={{ filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onMap}
        className="flex items-center gap-2 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #06D6A0, #0984E3)', boxShadow: '0 10px 40px rgba(6,214,160,0.5)' }}>
        <Trophy size={24} /> العودة للخريطة
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanLakeLessonPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useKeyboardOpen();
  
  const [groupIdx, setGroupIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn-word');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctInGroup, setCorrectInGroup] = useState(0);
  const LESSON_ID = 'lake';

  const { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress } = useGameStats();

  const totalItemsAll = useMemo(() => 
    LAKE_GROUPS.reduce((s, g) => s + g.items.length, 0), 
  []);

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
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const group = LAKE_GROUPS[groupIdx];
  const itemData = group?.items[itemIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 2 ? 'closed' :
    correctInGroup < 5 ? 'half' : 'opend';

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
    addPoints(10);
    incStreak();
    setTotalStars(t => t + 1);
    setCorrectInGroup(prev => {
      const newCorrect = prev + 1;

      setTimeout(() => {
        const starTarget = document.getElementById('star-target');
        if (starTarget) {
          const rect = starTarget.getBoundingClientRect();
          const endX = rect.left + rect.width / 2;
          const endY = rect.top + rect.height / 2;
          const starId = Date.now() + Math.random();
          setFlyingItems(prev => [...prev, { 
            id: starId, startX: clientX, startY: clientY, endX, endY, type: 'star' 
          }]);
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
          setFlyingItems(prev => [...prev, { 
            id: energyId, startX: clientX, startY: clientY, endX, endY, type: 'energy' 
          }]);
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
                setFlyingItems(prev => [...prev, { 
                  id: gemId, 
                  startX: startX + (Math.random() - 0.5) * 40, 
                  startY, endX, endY, type: 'gem' 
                }]);
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
  }, [addPoints, incStreak, addStar, addLevelProgress, addGems]);

  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = totalItemsAll * 3;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newGroup: number, newItem: number, newPhase: Phase) => {
    const rating = calculateRating(totalStars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup,
      current_letter: newItem,
      current_phase: newPhase,
    });
  };

  const handleLearnDone = () => {
    setPhase('speak');
    savePosition(groupIdx, itemIdx, 'speak');
  };

  const handleSpeakDone = () => {
    const nextIdx = itemIdx + 1;
    if (nextIdx < group.items.length) {
      setItemIdx(nextIdx);
      setPhase('learn-word');
      savePosition(groupIdx, nextIdx, 'learn-word');
    } else {
      setPhase('test');
      savePosition(groupIdx, itemIdx, 'test');
    }
  };

  const handleTestPass = () => {
    setPhase('group-success');
    savePosition(groupIdx, itemIdx, 'group-success');
  };
  
  const handleTestFail = () => {
    setCombo(0);
    resetStreak();
    setPhase('group-fail');
  };

  const handleGroupNext = () => {
    if (groupIdx + 1 < LAKE_GROUPS.length) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx);
      setItemIdx(0);
      setPhase('learn-word');
      setCorrectInGroup(0);
      savePosition(newGroupIdx, 0, 'learn-word');
    } else {
      setPhase('all-done');
    }
  };

  const handleRetry = () => {
    setItemIdx(0);
    setPhase('learn-word');
    savePosition(groupIdx, 0, 'learn-word');
  };

  const handleHomeClick = () => router.push('/character-and-map?from=lesson');

  const handleAllDoneNext = async () => {
    await saveLessonProgress(LESSON_ID, 3, true);
    router.push('/character-and-map?from=lesson');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020812]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏞️</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!group) return null;

  const totalStepsInGroup = group.items.length;
  const activeColor = itemData?.color ?? '#06D6A0';
  
  const mobilePaddingTop = phase === 'test' ? '105px' : '110px';
  const mobilePaddingBottom = phase === 'test' ? '85px' : '95px';
  const desktopPaddingTop = '130px';
  const desktopPaddingBottom = '120px';

  return (
    <div className="text-white relative" 
      style={{ fontFamily: "'Tajawal', sans-serif", minHeight: '100vh' }} 
      dir="rtl">
      
      <LakeBackground group={group} activeColor={activeColor} isMobile={isMobile} phase={phase} />

      {!(isMobile && isKeyboardOpen) && (
        <div style={{ 
          transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', 
          transformOrigin: 'bottom right', 
          position: 'fixed', 
          bottom: isMobile ? 110 : 130, 
          right: 0, 
          zIndex: 25, 
          pointerEvents: 'none' 
        }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#06D6A0" />
        </div>
      )}

      <FlyingItems items={flyingItems} />

      {phase !== 'group-success' && phase !== 'group-fail' && phase !== 'all-done' && (
        <TopHUD 
          stats={stats} 
          level={stats.level} 
          currentStep={itemIdx} 
          totalSteps={totalStepsInGroup}
          onHome={handleHomeClick} 
          isMobile={isMobile}
        />
      )}

      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{ 
          zIndex: 10, 
          minHeight: '100vh',
          maxWidth: '1400px',
          paddingTop: phase === 'group-success' || phase === 'group-fail' || phase === 'all-done' 
            ? '20px' 
            : isMobile ? mobilePaddingTop : desktopPaddingTop,
          paddingBottom: phase === 'group-success' || phase === 'group-fail' || phase === 'all-done' 
            ? '20px' 
            : isMobile ? mobilePaddingBottom : desktopPaddingBottom,
        }}>
        <AnimatePresence mode="wait">
          {phase === 'learn-word' && itemData && (
            <LearnWordPhase
              key={`learn-${groupIdx}-${itemIdx}`}
              itemData={itemData}
              groupTitle={group.title}
              onDone={handleLearnDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              onCorrect={handleCorrect}
              isMobile={isMobile}
            />
          )}

          {phase === 'speak' && itemData && (
            <SpeakingPractice
              key={`speak-${groupIdx}-${itemIdx}`}
              wordData={itemData}
              isMobile={isMobile}
              onSuccess={(cx, cy) => {
                handleCorrect(cx, cy);
                handleKarlReact('celebrate');
                setTimeout(handleSpeakDone, 800);
              }}
              onSkip={handleSpeakDone}
            />
          )}

          {phase === 'test' && group.testType === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 w-full">
              <div className="text-center mb-1">
                <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-2xl md:text-3xl font-black text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  اختر الإجابة الصحيحة! 🎯
                </h2>
              </div>
              <QuizTest items={group.items} onPass={handleTestPass} onFail={handleTestFail}
                onCorrect={handleCorrect} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}

          {phase === 'test' && group.testType === 'order' && (
            <motion.div key="order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 w-full">
              <div className="text-center mb-1">
                <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-2xl md:text-3xl font-black text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  رتّب أيام الأسبوع! 📅
                </h2>
              </div>
              <OrderTest items={group.items as WeekDay[]} onPass={handleTestPass} onFail={handleTestFail}
                onCorrect={handleCorrect} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}

          {phase === 'test' && group.testType === 'match' && (
            <motion.div key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 w-full">
              <div className="text-center mb-1">
                <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-2xl md:text-3xl font-black text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  طابق الكلمة بالإيموجي! 🏔️
                </h2>
              </div>
              <MatchTest items={group.items} onPass={handleTestPass} onFail={handleTestFail}
                onCorrect={handleCorrect} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}

          {phase === 'group-success' && (
            <SuccessScreen key="success" group={group} onNext={handleGroupNext} isLast={groupIdx === LAKE_GROUPS.length - 1} />
          )}

          {phase === 'group-fail' && (
            <FailScreen key="fail" onRetry={handleRetry} />
          )}

          {phase === 'all-done' && (
            <AllDoneScreen key="all-done" totalStars={totalStars} onMap={handleAllDoneNext} />
          )}
        </AnimatePresence>
      </div>

      {phase !== 'group-success' && phase !== 'group-fail' && phase !== 'all-done' && (
        <BottomHUD 
          stats={stats} 
          treasureState={treasureState}
          onHint={useHint} 
          onMap={handleHomeClick} 
          isMobile={isMobile} 
        />
      )}
    </div>
  );
}
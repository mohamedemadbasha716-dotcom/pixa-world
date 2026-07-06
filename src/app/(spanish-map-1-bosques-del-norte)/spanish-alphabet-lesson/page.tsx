'use client';

import { useState, useEffect, useRef, useMemo, useCallback, RefObject } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Check, X, Volume2, Star, RotateCcw, Trophy, Sparkles, 
  Home, Flame, Gem, Mic, SkipForward
} from 'lucide-react';

import { 
  SPANISH_LETTERS, 
  SPANISH_LETTER_GROUPS, 
  getDarkSpanishColor,
  generateSpanishLetterChoices,
  shuffleSpanishWordLetters,
  compareSpanishWords,
  TOTAL_ANSWERS_PER_SPANISH_LESSON,
  type SpanishLetter
} from '@/data/spanish/alphabet';

import { speakSpanishLetter, speakSpanishWord } from '@/lib/audio/spanishSpeech';
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { getSpanishLessonProgress, saveSpanishLessonProgress } from '@/lib/spanishPlayerData';

import ToroBull from '@/app/components/lesson/ToroBull';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import GhostInput from '@/app/components/lesson/GhostInput';
import SpanishCharsKeyboard, { getRequiredSpanishSpecialChars } from '@/app/components/lesson/SpanishCharsKeyboard';

import type { ToroMood, ToroMessage } from '@/lib/types/spanish-lesson';
import { SPANISH_ENCOURAGEMENTS, SPANISH_SAD_MESSAGES } from '@/lib/types/spanish-lesson';

type FlyingItem = { 
  id: number; startX: number; startY: number; endX: number; endY: number;
  type: 'star' | 'energy' | 'gem';
};
type InputRefType = RefObject<HTMLInputElement | null>;

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: { transcript: string; confidence: number };
      isFinal: boolean;
    };
    length: number;
  };
}

const LESSON_ID = 'es-muniellos-alphabet';
type Phase = 'listen' | 'write' | 'speak' | 'test' | 'group-success' | 'group-fail' | 'all-done';

// 🎨 Component: صورة مع fallback للإيموجي
function EmojiOrIcon({ word, emoji, size, color }: {
  word: string; emoji: string; size: number; color: string;
}) {
  const [useIcon, setUseIcon] = useState(true);
  const [iconExt, setIconExt] = useState<'svg' | 'png' | 'webp'>('webp');

  if (!useIcon) {
    return (
      <span style={{ 
        fontSize: `${size * 0.75}px`,
        filter: `drop-shadow(0 4px 8px ${color}cc)`,
        lineHeight: 1,
      }}>
        {emoji}
      </span>
    );
  }

  return (
    <img 
      src={`/spanish/card-image/alphabet/${word.toLowerCase()}.${iconExt}`}
      alt={word}
      style={{
        width: size, height: size,
        objectFit: 'contain',
        filter: `drop-shadow(0 4px 8px ${color}aa)`,
      }}
      onError={() => {
        if (iconExt === 'webp') setIconExt('png');
        else if (iconExt === 'png') setIconExt('svg');
        else setUseIcon(false);
      }}
    />
  );
}

// 📱 Mobile Detection Hook
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

// 📊 Game Stats Hook
type GameStats = {
  points: number; streak: number; gems: number; level: number;
  energy: number; hints: number; levelProgress: number;
};

function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    points: 1250, streak: 7, gems: 35, level: 4, energy: 5, hints: 3,
    levelProgress: 0,
  });
  const addPoints = (n: number) => setStats(s => ({ ...s, points: s.points + n }));
  const incStreak = () => setStats(s => ({ ...s, streak: s.streak + 1 }));
  const resetStreak = () => setStats(s => ({ ...s, streak: 0 }));
  const addGems = (n: number) => setStats(s => ({ ...s, gems: s.gems + n }));
  const useHint = () => setStats(s => ({ ...s, hints: Math.max(0, s.hints - 1) }));
  const addStar = () => setStats(s => ({ ...s, points: s.points + 10 }));
  const addLevelProgress = () => setStats(s => {
    const increment = 100 / TOTAL_ANSWERS_PER_SPANISH_LESSON;
    return { ...s, levelProgress: Math.min(100, s.levelProgress + increment) };
  });
  return { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress };
}

// 🎤 Similarity للنطق
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
    }
  }
  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string): number {
  const normalize = (s: string) => s.toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n').trim();
  const nA = normalize(a), nB = normalize(b);
  if (nA === nB) return 1.0;
  if (nA.includes(nB) || nB.includes(nA)) return 0.8;
  const dist = levenshteinDistance(nA, nB);
  return 1 - (dist / Math.max(nA.length, nB.length));
}

// 🌅 Background Component
function ScreenBackground({ isMobile, activeColor, phase }: { 
  isMobile: boolean; activeColor: string; phase?: string 
}) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    if (isMobile) return;
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 10,
      size: 2 + Math.random() * 10, duration: 10 + Math.random() * 10,
    }));
    setParticles(p);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <img src="/spanish/maps/spanish-map-1-mob.webp" alt="bg" 
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ 
          background: 'linear-gradient(180deg, rgba(10,5,30,0.7) 0%, rgba(10,5,30,0.85) 100%)'
        }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img src="/spanish/maps/spanish-map-1-pc.webp" alt="bg" 
        className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 20%, rgba(70,20,20,0.85) 0%, rgba(40,10,15,0.92) 50%, rgba(20,5,10,0.95) 100%)',
      }} />
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: -20, width: p.size, height: p.size,
            background: `radial-gradient(circle, ${activeColor}aa, transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}66`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// 📊 Stepper
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
            <motion.div
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                height: isActive ? (isMobile ? 16 : 30) : (isMobile ? 13 : 25),
                background: isActive 
                  ? 'linear-gradient(135deg, #DC2626, #991B1B)'
                  : isDone 
                    ? 'linear-gradient(135deg, #58CC02, #4AA802)'
                    : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#DC2626' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(220,38,38,0.6)' : isDone ? '0 0 6px rgba(88,204,2,0.4)' : 'none',
              }}
            >
              {isLocked ? '🔒' : isDone ? '✓' : stepNum}
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

// 🎮 Top HUD
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
                background: 'linear-gradient(135deg, #DC2626, #FFD700)',
              }}>
              <img src="/spanish/characters/toro.webp" alt="toro" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #DC2626, #FFD700)' }}
                    animate={{ width: `${stats.levelProgress}%` }}
                    transition={{ duration: 0.8 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
            <motion.div key={`points-${stats.points}`} animate={{ scale: [1, 1.05, 1] }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(40,10,15,0.7)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,215,0,0.35)', minWidth: 0,
              }}>
              <img id="star-target" src="/treasuer/star.png" alt="star" className="w-3 h-3 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.points}</span>
            </motion.div>

            <motion.div key={`streak-${stats.streak}`} animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(40,10,15,0.7)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,77,109,0.35)', minWidth: 0,
              }}>
              <Flame size={12} className="text-orange-400 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,77,109,0.8))', 
                  fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.streak}</span>
            </motion.div>

            <motion.div key={`gems-${stats.gems}`} animate={{ scale: [1, 1.05, 1] }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(40,10,15,0.7)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(157,78,221,0.35)', minWidth: 0,
              }}>
              <Gem id="gem-target" size={12} className="text-purple-300 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.gems}</span>
            </motion.div>
          </div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(40,10,15,0.7)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
            <Home size={14} className="text-white" />
          </motion.button>
        </div>

        <div className="flex justify-center" style={{ marginTop: '2.5px' }}>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
            style={{
              background: 'rgba(40,10,15,0.7)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.18)',
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
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{
              borderColor: '#FFD700',
              boxShadow: '0 0 15px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, #DC2626, #FFD700)',
            }}>
            <img src="/spanish/characters/toro.webp" alt="toro" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] md:text-[10px] font-bold text-white/80 mb-0.5">المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm md:text-base text-white">{level}</span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #DC2626, #FFD700)' }}
                  animate={{ width: `${stats.levelProgress}%` }}
                  transition={{ duration: 0.8 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{
              background: 'rgba(40,10,15,0.65)', backdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={false} />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div key={`gems-${stats.gems}`} animate={{ scale: [1, 1.05, 1] }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(40,10,15,0.65)', backdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(157,78,221,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <span className="font-black text-xs md:text-sm text-white">{stats.gems}</span>
            <Gem id="gem-target" size={18} className="text-purple-300" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
          </motion.div>

          <motion.div key={`streak-${stats.streak}`} animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(40,10,15,0.65)', backdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,77,109,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <div className="flex flex-col leading-none items-center">
              <span className="font-black text-xs md:text-sm text-white">{stats.streak}</span>
              <span className="text-[7px] md:text-[8px] text-orange-200/90 font-bold mt-0.5">سلسلة</span>
            </div>
            <Flame size={18} className="text-orange-400" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,77,109,0.8))', 
                fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
          </motion.div>

          <motion.div key={stats.points} animate={{ scale: [1, 1.05, 1] }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(40,10,15,0.65)', backdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,215,0,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <span className="font-black text-xs md:text-sm text-white">{stats.points}</span>
            <img id="star-target" src="/treasuer/star.png" alt="star" className="w-5 h-5 md:w-6 md:h-6" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
          </motion.div>

          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={onHome}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(40,10,15,0.65)', backdropFilter: 'blur(20px) saturate(180%)',
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

// 🎁 Bottom HUD
function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  const treasureImg = `/treasuer/${treasureState}.png`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1 md:pb-1.5 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'w-full max-w-[1500px]'}`}>
        <div className="relative rounded-xl px-3 md:px-6 py-1 md:py-1.5"
          style={{
            background: 'linear-gradient(135deg, rgba(50,15,20,0.85) 0%, rgba(40,10,15,0.9) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
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
                  style={{ 
                    filter: treasureState === 'opend' 
                      ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' 
                      : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' 
                  }} />
                {treasureState === 'opend' && (
                  <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.5), transparent 70%)' }} />
                )}
              </div>
              <span className="text-[7px] md:text-[9px] font-black text-yellow-400 leading-none">صندوق</span>
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

function FloatingIconButton({ label, color, isMobile, onClick, badge, disabled, iconSrc, iconAlt }: {
  label: string; color: string; isMobile: boolean;
  onClick?: () => void; badge?: number; disabled?: boolean;
  iconSrc: string; iconAlt: string;
}) {
  return (
    <motion.button whileHover={!disabled ? { scale: 1.1, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick} disabled={disabled}
      className="flex flex-col items-center gap-0.5 disabled:opacity-70">
      <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
        <img src={iconSrc} alt={iconAlt} className="w-full h-full object-contain"
          style={{ filter: `drop-shadow(0 2px 8px ${color}aa) drop-shadow(0 0 4px ${color}66)` }} />
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black text-white border"
            style={{ background: '#FF4D6D', borderColor: 'rgba(40,10,15,0.95)' }}>
            {badge}
          </div>
        )}
      </div>
      <span className="text-[7px] md:text-[9px] font-black leading-none" 
        style={{ color, textShadow: `0 1px 3px rgba(0,0,0,0.8)` }}>
        {label}
      </span>
    </motion.button>
  );
}

// ✨ Flying Items
function FlyingItems({ items }: { items: FlyingItem[] }) {
  return (
    <>
      {items.map(item => {
        const dx = item.endX - item.startX;
        const dy = item.endY - item.startY;
        const color = item.type === 'star' ? '#FFD700' : item.type === 'energy' ? '#4CC9F0' : '#9D4EDD';
        
        return (
          <div key={item.id} className="fixed pointer-events-none z-[60]"
            style={{ left: item.startX, top: item.startY }}>
            <motion.div
              initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.8, 1.5, 1.2, 1.0, 1.6, 0],
                opacity: [0, 1, 1, 1, 1, 1, 0],
                x: [0, 0, dx * 0.3, dx * 0.7, dx, dx, dx],
                y: [0, -20, dy * 0.3 - 100, dy * 0.7 - 50, dy, dy, dy],
                rotate: [0, -15, 180, 360, 540, 720, 720],
              }}
              transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <div className="relative" style={{ width: 40, height: 40, marginTop: -20, marginLeft: -20 }}>
                <div className="absolute inset-0 rounded-full blur-xl" 
                  style={{ background: color, opacity: 0.8, transform: 'scale(2.5)' }} />
                <div className="relative flex items-center justify-center w-full h-full">
                  {item.type === 'star' && (
                    <img src="/treasuer/star.png" alt="star" className="w-10 h-10"
                      style={{ filter: `drop-shadow(0 0 15px ${color})` }} />
                  )}
                  {item.type === 'energy' && (
                    <img src="/treasuer/energy.png" alt="energy" className="w-10 h-10"
                      style={{ filter: `drop-shadow(0 0 15px ${color})` }} />
                  )}
                  {item.type === 'gem' && (
                    <Gem size={36} className="text-purple-200" fill="#9D4EDD"
                      style={{ filter: `drop-shadow(0 0 15px ${color})` }} />
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

// 🎴 Glass Card
function GlassCard({ children, className = '', accentColor = '#DC2626', isMobile = false, style, useBgImage = false }: {
  children: React.ReactNode; className?: string; accentColor?: string;
  isMobile?: boolean; style?: React.CSSProperties; useBgImage?: boolean;
}) {
  if (isMobile) {
    return (
      <div className={`relative rounded-[1.5rem] overflow-hidden ${className}`}
        style={{
          background: 'rgba(50,15,20,0.45)',
          backdropFilter: 'blur(30px) saturate(180%)',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${accentColor}33, inset 0 1px 0 rgba(255,255,255,0.25)`,
          ...(style || {}),
        }}>
        {useBgImage && (
          <>
            <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
              style={{
                backgroundImage: `url('/spanish/maps/spanish-map-1-mob.webp')`,
                backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4,
              }} />
            <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
              style={{ background: 'linear-gradient(180deg, rgba(50,15,20,0.7) 0%, rgba(40,10,15,0.8) 100%)' }} />
          </>
        )}
        <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}33, transparent 60%)` }} />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-[2rem] overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(70,20,25,0.95) 0%, rgba(50,15,20,0.98) 100%)',
        border: `2px solid ${accentColor}66`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
        ...(style || {}),
      }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}33, transparent 60%)` }} />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

// 🔤 Letter Box
function LetterBox({ letterData, size }: { letterData: SpanishLetter; size: number }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="relative rounded-[1.5rem] flex items-center justify-center select-none flex-shrink-0 overflow-hidden"
      style={{
        width: size, height: size,
        background: 'linear-gradient(145deg, rgba(70,20,25,0.9), rgba(50,15,20,0.95))',
        border: `2px solid ${letterData.color}99`,
        boxShadow: `0 10px 30px ${letterData.color}77, inset 0 1px 0 ${letterData.color}66`,
      }}>
      <span className="font-black relative z-10"
        style={{
          fontSize: size * 0.6,
          background: `linear-gradient(180deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: `drop-shadow(0 4px 15px ${letterData.color}cc)`, lineHeight: 1,
        }}>
        {letterData.letter}
      </span>
    </motion.div>
  );
}

// 🔊 Sound Button
function CircularSoundButton({ onClick, color, size = 48 }: { 
  onClick: () => void; color: string; size?: number; 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = () => {
    setIsPlaying(true); onClick();
    setTimeout(() => setIsPlaying(false), 1500);
  };
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClick}
      className="rounded-full flex items-center justify-center border-2 relative flex-shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, #DC2626, #991B1B)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(220,38,38,0.6), 0 0 25px rgba(220,38,38,0.4)`,
      }}>
      {isPlaying && [0, 0.2, 0.4].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: '#DC2626' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }} />
      ))}
      <Volume2 size={size * 0.4} className="text-white" />
    </motion.button>
  );
}// 📱 Mobile: Listen Phase (Choice)
function LetterChoiceMobile({ letterData, onCorrect, onWrong }: {
  letterData: SpanishLetter;
  onCorrect: (cx: number, cy: number) => void;
  onWrong: () => void;
}) {
  const [choices, setChoices] = useState<string[]>([]);
  const [hiddenLetters, setHiddenLetters] = useState<Set<string>>(new Set());
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');
  const darkColor = useMemo(() => getDarkSpanishColor(letterData.color), [letterData.color]);

  useEffect(() => {
    setChoices(generateSpanishLetterChoices(letterData.letter, 3));
    setHiddenLetters(new Set());
    setWrongLetter(null);
    setStatus('idle');
  }, [letterData.letter]);

  const handleChoice = (choice: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenLetters.has(choice)) return;
    if (choice === letterData.letter) {
      setStatus('correct');
      setTimeout(() => onCorrect(e.clientX, e.clientY), 600);
    } else {
      setWrongLetter(choice);
      playBuzzSound();
      onWrong();
      setTimeout(() => setWrongLetter(null), 600);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto p-3" accentColor={letterData.color} isMobile useBgImage>
      <div className="flex flex-col items-center gap-2.5">
        <div className="px-4 py-1.5 rounded-2xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
            border: `2px solid ${letterData.color}66`, 
            boxShadow: `0 4px 15px ${letterData.color}44` 
          }}>
          <span className="font-black text-xs text-gray-800">استمع جيداً واختر الحرف</span>
        </div>

        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity }}
          className="relative rounded-[1.2rem] flex items-center justify-center select-none overflow-hidden"
          style={{
            width: 85, height: 85,
            background: 'linear-gradient(145deg, rgba(70,20,25,0.9), rgba(50,15,20,0.95))',
            border: `2px solid ${letterData.color}99`,
            boxShadow: `0 8px 25px ${letterData.color}77`,
          }}>
          <span className="font-black relative z-10"
            style={{
              fontSize: '3.5rem',
              background: `linear-gradient(180deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: `drop-shadow(0 3px 12px ${letterData.color}cc)`, lineHeight: 1,
            }}>
            {letterData.letter}
          </span>
        </motion.div>

        <CircularSoundButton onClick={() => speakSpanishLetter(letterData.letter)} color={letterData.color} size={40} />

        <div className="flex items-center gap-1.5">
          <span className="font-black text-white text-xs">اختر الحرف الصحيح</span>
          <span className="text-sm">👇</span>
        </div>

        <div className="flex items-center justify-center gap-2.5 w-full" dir="ltr">
          {choices.map((choice, idx) => {
            const isHidden = hiddenLetters.has(choice);
            const isWrong = wrongLetter === choice;
            return (
              <AnimatePresence key={`${letterData.letter}-${choice}-${idx}`} mode="wait">
                {!isHidden && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleChoice(choice, e)}
                    disabled={status === 'correct' || isWrong}
                    className="relative rounded-xl flex items-center justify-center overflow-hidden border-2"
                    style={{
                      width: 55, height: 55,
                      background: isWrong 
                        ? 'linear-gradient(145deg, #FF4444, #CC0000)' 
                        : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.95))',
                      borderColor: isWrong ? '#FF4444' : `${letterData.color}aa`,
                      boxShadow: isWrong ? '0 5px 18px rgba(255,68,68,0.6)' : `0 5px 18px ${letterData.color}55`,
                    }}>
                    <span className="font-black"
                      style={{
                        fontSize: '2rem', lineHeight: 1,
                        color: isWrong ? 'white' : darkColor,
                      }}>
                      {choice}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

// 📱 Mobile: Word Builder
function WordBuilderMobile({ letterData, onComplete, onWrong }: {
  letterData: SpanishLetter;
  onComplete: (cx: number, cy: number) => void;
  onWrong: () => void;
}) {
  const word = letterData.word;
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const darkColor = useMemo(() => getDarkSpanishColor(letterData.color), [letterData.color]);

  useEffect(() => {
    setShuffledLetters(shuffleSpanishWordLetters(word));
    setPlacedIndices([]);
    setWrongShake(null);
    setIsComplete(false);
  }, [word]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete || placedIndices.includes(idx)) return;
    const nextExpected = word[placedIndices.length];
    if (letter === nextExpected) {
      setPlacedIndices(prev => [...prev, idx]);
      playCoinSound();
      if (placedIndices.length + 1 === word.length) {
        setIsComplete(true);
        speakSpanishWord(word);
        setTimeout(() => onComplete(e.clientX, e.clientY), 600);
      }
    } else {
      setWrongShake(idx);
      playBuzzSound();
      onWrong();
      setTimeout(() => setWrongShake(null), 600);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto p-3" accentColor={letterData.color} isMobile useBgImage>
      <div className="flex flex-col items-center gap-2">
        <div className="px-3 py-1.5 rounded-2xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
            border: `2px solid ${letterData.color}66`, 
            boxShadow: `0 4px 15px ${letterData.color}44` 
          }}>
          <span className="font-black text-xs text-gray-800">استمع للكلمة ورتب الحروف</span>
        </div>

        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity }}
          className="rounded-2xl flex items-center justify-center border-2 flex-shrink-0 relative overflow-hidden"
          style={{ 
            width: 70, height: 70,
            background: `linear-gradient(145deg, ${letterData.gradient[0]}44, ${letterData.gradient[1]}33)`, 
            borderColor: `${letterData.color}77`, 
            boxShadow: `0 6px 18px ${letterData.color}66` 
          }}>
          <EmojiOrIcon word={letterData.word} emoji={letterData.emoji} size={56} color={letterData.color} />
        </motion.div>

        <div className="text-center">
          <div className="font-bold text-xs" style={{ color: letterData.color }}>{letterData.wordAr}</div>
        </div>

        <CircularSoundButton onClick={() => speakSpanishWord(word)} color={letterData.color} size={38} />

        <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
          {word.split('').map((letter, idx) => {
            const isFilled = idx < placedIndices.length;
            return (
              <motion.div key={`slot-${idx}`} initial={{ scale: 0.8 }}
                animate={{ scale: isFilled ? [0.8, 1.15, 1] : 1 }}
                className="rounded-lg flex items-center justify-center border-2 relative overflow-hidden"
                style={{
                  width: 38, height: 44,
                  background: isFilled 
                    ? `linear-gradient(145deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})` 
                    : 'rgba(255,255,255,0.05)',
                  borderColor: isFilled ? letterData.color : `${letterData.color}55`,
                  borderStyle: isFilled ? 'solid' : 'dashed',
                }}>
                {!isFilled && (
                  <span className="font-black absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ fontSize: '1.4rem', color: letterData.color, opacity: 0.25 }}>
                    {letter}
                  </span>
                )}
                {isFilled && (
                  <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    className="font-black text-white relative z-10"
                    style={{ fontSize: '1.5rem' }}>
                    {letter}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap mt-1" dir="ltr">
          {shuffledLetters.map((letter, idx) => {
            const isPlaced = placedIndices.includes(idx);
            const isShaking = wrongShake === idx;
            return (
              <AnimatePresence key={`shuffled-${idx}`} mode="wait">
                {!isPlaced && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isShaking ? { x: [-6, 6, -6, 6, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={isShaking ? { duration: 0.4 } : { delay: idx * 0.05, type: 'spring' }}
                    whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleLetterClick(letter, idx, e)}
                    disabled={isComplete}
                    className="rounded-lg flex items-center justify-center border-2"
                    style={{
                      width: 42, height: 42,
                      background: isShaking 
                        ? 'linear-gradient(145deg, #FF4444, #CC0000)' 
                        : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.95))',
                      borderColor: isShaking ? '#FF4444' : `${letterData.color}aa`,
                    }}>
                    <span className="font-black"
                      style={{
                        fontSize: '1.5rem',
                        color: isShaking ? 'white' : darkColor,
                      }}>
                      {letter}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

// 🖥️ Desktop: Listen Phase (مع GhostInput)
function ListenPhaseDesktop({ letterData, input, status, onChange, onCheck, inputRef }: {
  letterData: SpanishLetter; input: string; status: 'idle' | 'correct' | 'wrong';
  onChange: (v: string) => void; onCheck: (e?: React.MouseEvent) => void; inputRef: InputRefType;
}) {
  return (
    <div className="flex items-stretch justify-center gap-5 w-full max-w-4xl mx-auto">
      <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
        <div className="flex flex-col items-center gap-3 h-full justify-center">
          <div className="px-5 py-2 rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
              border: `2px solid ${letterData.color}66`, 
              boxShadow: `0 4px 15px ${letterData.color}44` 
            }}>
            <span className="font-black text-sm text-gray-800">استمع جيداً واكتب الحرف</span>
          </div>
          <LetterBox letterData={letterData} size={140} />
          <CircularSoundButton onClick={() => speakSpanishLetter(letterData.letter)} color={letterData.color} size={48} />
        </div>
      </GlassCard>

      <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
        <div className="flex flex-col items-center gap-4 h-full justify-center">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-lg">اكتب الحرف</span>
            <span className="text-xl">✏️</span>
          </div>
          <div className="w-full max-w-[280px]">
            <GhostInput ref={inputRef} value={input} onChange={onChange} onEnter={onCheck}
              ghostText={letterData.letter} color={letterData.color} status={status} 
              fontSize="2.2rem" maxLength={1} uppercase />
          </div>
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 font-black text-xs py-1.5 px-4 rounded-xl"
                style={{ 
                  background: status === 'correct' ? 'rgba(88,204,2,0.3)' : 'rgba(255,68,68,0.3)', 
                  color: status === 'correct' ? '#58CC02' : '#FF6B6B', 
                  border: `1.5px solid ${status === 'correct' ? '#58CC0288' : '#FF444488'}` 
                }}>
                {status === 'correct' ? <><Check size={14} /> ممتاز!</> : <><X size={14} /> جرب تاني</>}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCheck} disabled={!input}
            className="w-full max-w-[280px] py-3 rounded-2xl font-black text-lg text-white disabled:opacity-30 flex items-center justify-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #58CC02, #4AA802)', 
              boxShadow: '0 6px 20px rgba(88,204,2,0.5)', 
              borderBottom: '4px solid #3A8602' 
            }}>
            تحقق <Check size={20} />
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );
}

// 🎯 Listen Phase Wrapper
function ListenPhase({ letterData, onDone, onToroReact, onCombo, onCorrect, isMobile }: {
  letterData: SpanishLetter; onDone: () => void; onToroReact: (mood: ToroMood) => void;
  onCombo: () => void; onCorrect: (cx: number, cy: number) => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => speakSpanishLetter(letterData.letter), 400);
    return () => clearTimeout(t);
  }, [letterData.letter]);

  const handleMobileCorrect = (cx: number, cy: number) => {
    speakSpanishLetter(letterData.letter);
    playCoinSound(); onCombo(); onToroReact('happy');
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy);
    setTimeout(onDone, 1400);
  };

  const handleMobileWrong = () => onToroReact('sad');

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim().toUpperCase() === letterData.letter.toUpperCase()) {
      setStatus('correct'); speakSpanishLetter(letterData.letter); playCoinSound();
      onCombo(); onToroReact('happy');
      let cx = 0, cy = 0;
      if (e) { cx = e.clientX; cy = e.clientY; }
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      }
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      onCorrect(cx, cy);
      setTimeout(onDone, 1100);
    } else {
      setStatus('wrong'); playBuzzSound(); onToroReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`listen-${letterData.letter}`}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="w-full">
        {isMobile ? (
          <LetterChoiceMobile letterData={letterData} onCorrect={handleMobileCorrect} onWrong={handleMobileWrong} />
        ) : (
          <ListenPhaseDesktop letterData={letterData} input={input} status={status}
            onChange={(v) => { setInput(v); setStatus('idle'); }} onCheck={handleCheck} inputRef={inputRef} />
        )}
      </motion.div>
    </>
  );
}

// ✍️ Write Phase
function WritePhase({ letterData, onDone, onToroReact, onCombo, onCorrect, isMobile }: {
  letterData: SpanishLetter; onDone: () => void; onToroReact: (mood: ToroMood) => void;
  onCombo: () => void; onCorrect: (cx: number, cy: number) => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpanishSpecialChars(letterData.word);

  useEffect(() => {
    const t = setTimeout(() => speakSpanishWord(letterData.word), 400);
    return () => clearTimeout(t);
  }, [letterData.word]);

  const handleMobileComplete = (cx: number, cy: number) => {
    playCoinSound(); onCombo(); onToroReact('happy');
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    onCorrect(cx, cy);
    setTimeout(onDone, 1400);
  };

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareSpanishWords(input, letterData.word)) {
      setStatus('correct'); speakSpanishWord(letterData.word); playCoinSound();
      onCombo(); onToroReact('happy');
      let cx = 0, cy = 0;
      if (e) { cx = e.clientX; cy = e.clientY; }
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      }
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      onCorrect(cx, cy);
      setTimeout(onDone, 1100);
    } else {
      setStatus('wrong'); playBuzzSound(); onToroReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`write-${letterData.letter}`}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="w-full">
        {isMobile ? (
          <WordBuilderMobile letterData={letterData} onComplete={handleMobileComplete} 
            onWrong={() => onToroReact('sad')} />
        ) : (
          <div className="flex items-stretch justify-center gap-5 w-full max-w-4xl mx-auto">
            <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
              <div className="flex flex-col items-center gap-3 h-full justify-center">
                <div className="px-5 py-2 rounded-2xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
                    border: `2px solid ${letterData.color}66` 
                  }}>
                  <span className="font-black text-sm text-gray-800">استمع للكلمة واكتبها</span>
                </div>
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="rounded-2xl flex items-center justify-center border-2"
                  style={{ 
                    width: 110, height: 110, 
                    background: `linear-gradient(145deg, ${letterData.gradient[0]}44, ${letterData.gradient[1]}33)`, 
                    borderColor: `${letterData.color}77`, 
                    boxShadow: `0 8px 20px ${letterData.color}66` 
                  }}>
                  <EmojiOrIcon word={letterData.word} emoji={letterData.emoji} size={85} color={letterData.color} />
                </motion.div>
                <div className="text-center">
                  <div className="font-black text-2xl text-white">{letterData.word}</div>
                  <div className="font-bold text-sm mt-0.5" style={{ color: letterData.color }}>{letterData.wordAr}</div>
                </div>
                <CircularSoundButton onClick={() => speakSpanishWord(letterData.word)} color={letterData.color} size={48} />
              </div>
            </GlassCard>

            <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
              <div className="flex flex-col items-center gap-3 h-full justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-lg">اكتب الكلمة</span>
                  <span className="text-xl">✏️</span>
                </div>
                <div className="w-full max-w-[280px] space-y-2">
                  <GhostInput ref={inputRef} value={input} 
                    onChange={(v) => { setInput(v); setStatus('idle'); }} onEnter={handleCheck}
                    ghostText={letterData.word} color={letterData.color} status={status} fontSize="1.3rem" />
                  {requiredChars.length > 0 && (
                    <SpanishCharsKeyboard chars={requiredChars} 
                      onChar={(c) => { setInput(prev => prev + c); inputRef.current?.focus(); }} 
                      color={letterData.color} />
                  )}
                </div>
                <AnimatePresence>
                  {status !== 'idle' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 font-black text-xs py-1.5 px-4 rounded-xl"
                      style={{ 
                        background: status === 'correct' ? 'rgba(88,204,2,0.3)' : 'rgba(255,68,68,0.3)', 
                        color: status === 'correct' ? '#58CC02' : '#FF6B6B' 
                      }}>
                      {status === 'correct' ? <><Check size={14} /> ممتاز!</> : <><X size={14} /> جرب تاني</>}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCheck} disabled={!input}
                  className="w-full max-w-[280px] py-3 rounded-2xl font-black text-lg text-white disabled:opacity-30 flex items-center justify-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #58CC02, #4AA802)', 
                    boxShadow: '0 6px 20px rgba(88,204,2,0.5)', 
                    borderBottom: '4px solid #3A8602' 
                  }}>
                  تحقق <Check size={20} />
                </motion.button>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    </>
  );
}

// 🎤 Speak Phase
function SpeakPhase({ letterData, isMobile, onSuccess, onSkip }: {
  letterData: SpanishLetter; isMobile: boolean;
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
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) { setSupported(false); return; }
    const recognition = new SpeechRec();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results[0];
      let bestMatch = '', bestScore = 0;
      for (let i = 0; i < (results as any).length; i++) {
        const text = (results as any)[i].transcript.toLowerCase().trim();
        const score = similarityScore(text, letterData.word.toLowerCase());
        if (score > bestScore) { bestScore = score; bestMatch = text; }
      }
      setTranscript(bestMatch);
      setIsListening(false);
      if (bestScore >= 0.65) {
        setStatus('success'); playCoinSound();
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        if (micButtonRef.current) {
          const rect = micButtonRef.current.getBoundingClientRect();
          cx = rect.left + rect.width / 2; cy = rect.top + rect.height / 2;
        }
        setTimeout(() => onSuccess(cx, cy), 1500);
      } else {
        setStatus('try-again'); playBuzzSound();
        setAttempts(a => a + 1);
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
  }, [letterData.word, onSuccess]);

  const handleStart = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript(''); setStatus('listening'); setIsListening(true);
    try { recognitionRef.current.start(); } catch { setIsListening(false); setStatus('error'); }
  };

  if (!supported) {
    return (
      <GlassCard className="p-6 text-center max-w-md mx-auto" accentColor={letterData.color} isMobile={isMobile}>
        <div className="text-5xl mb-3">😅</div>
        <h3 className="text-lg font-black text-white mb-2">المتصفح مش بيدعم النطق</h3>
        <button onClick={onSkip} className="px-8 py-3 rounded-2xl font-black text-white mt-3"
          style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})` }}>
          تخطي ⏭️
        </button>
      </GlassCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="w-full max-w-2xl mx-auto">
      <GlassCard className={`mx-auto ${isMobile ? 'p-3 max-w-md' : 'p-6 max-w-xl'}`} 
        accentColor={letterData.color} isMobile={isMobile} useBgImage={isMobile}>
        <div className={`flex flex-col items-center ${isMobile ? 'gap-2.5' : 'gap-4'}`}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
            className={isMobile ? 'text-4xl' : 'text-5xl'}>🎤</motion.div>

          <div className="text-center">
            <h3 className={`font-black text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
              انطق الكلمة بصوت واضح
            </h3>
            <p className={`text-white/60 font-bold ${isMobile ? 'text-[10px] mt-1' : 'text-sm mt-2'}`}>
              اضغط على المايك واتكلم بوضوح
            </p>
          </div>

          <div className={`w-full rounded-2xl border-2 text-center backdrop-blur-md ${isMobile ? 'p-2.5' : 'p-4'}`}
            style={{
              background: `linear-gradient(135deg, ${letterData.color}22, ${letterData.color}08)`,
              borderColor: `${letterData.color}55`,
            }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={isMobile ? 'text-2xl' : 'text-3xl'}>{letterData.emoji}</span>
              <p className={`font-black text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}
                style={{ textShadow: `0 0 20px ${letterData.color}88`, direction: 'ltr' }}>
                {letterData.word}
              </p>
            </div>
            <p className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: letterData.color }}>
              {letterData.wordAr}
            </p>
            <button onClick={() => speakSpanishWord(letterData.word)}
              className={`inline-flex items-center gap-1.5 mt-2 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 font-bold ${isMobile ? 'px-3 py-1 text-[10px]' : 'px-4 py-2 text-xs'}`}>
              <Volume2 size={isMobile ? 11 : 13} /> اسمع النطق الصح
            </button>
          </div>

          <motion.button ref={micButtonRef}
            whileHover={!isListening ? { scale: 1.05 } : {}}
            whileTap={!isListening ? { scale: 0.95 } : {}}
            onClick={handleStart}
            disabled={isListening || status === 'success'}
            className={`relative rounded-full flex items-center justify-center ${isMobile ? 'w-20 h-20' : 'w-28 h-28'}`}
            style={{
              background: status === 'success' ? 'linear-gradient(135deg, #58CC02, #096A02)'
                : isListening ? 'linear-gradient(135deg, #FF4444, #C70039)'
                : `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
              boxShadow: isListening ? '0 0 60px rgba(255,68,68,0.6)' : `0 10px 40px ${letterData.color}66`,
            }}>
            {isListening && [0, 0.3, 0.6].map((delay, i) => (
              <motion.div key={i} className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: '#FF4444' }}
                initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.5, delay, repeat: Infinity, ease: 'easeOut' }} />
            ))}
            {status === 'success' ? <Check size={isMobile ? 36 : 48} className="text-white" strokeWidth={3} />
              : <Mic size={isMobile ? 36 : 48} className="text-white" />}
          </motion.button>

          <AnimatePresence mode="wait">
            {transcript && (
              <motion.div key="transcript" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center">
                <p className={`text-white/40 font-bold mb-1 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>سمعتك بتقول:</p>
                <p className={`font-black text-white ${isMobile ? 'text-sm' : 'text-base'}`} style={{ direction: 'ltr' }}>
                  "{transcript}"
                </p>
              </motion.div>
            )}
            {status === 'listening' && <motion.p key="lst" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-black text-red-400 text-sm">🎙️ بسمعك دلوقتي...</motion.p>}
            {status === 'success' && <motion.p key="suc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-black text-green-400 text-base">✅ نطق ممتاز! 🌟</motion.p>}
            {status === 'try-again' && <motion.p key="try" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-black text-yellow-400 text-sm">😊 قريب! حاول تاني</motion.p>}
          </AnimatePresence>

          {(attempts >= 2 || status === 'error') && (
            <motion.button onClick={onSkip} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white/70 border border-white/15 bg-white/5 hover:bg-white/10">
              <SkipForward size={16} /> تخطي وكمل
            </motion.button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// 🎉 Group Success Screen
function GroupSuccessScreen({ groupTitle, onNext }: { groupTitle: string; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center gap-4 text-center py-6 px-4">
      <div className="text-6xl md:text-7xl">🏆</div>
      <div>
        <h2 className="text-xl md:text-3xl font-black text-white mb-2">أنهيت {groupTitle}!</h2>
        <p className="font-bold text-sm md:text-base text-[#DC2626]">كمّل على المجموعة الجاية 💪</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} 
            transition={{ delay: 0.3 + s * 0.15, type: 'spring' }}>
            <img src="/treasuer/star.png" alt="star" className="w-10 h-10 md:w-12 md:h-12" 
              style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button onClick={onNext} className="px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-base md:text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #DC2626, #FFD700)', boxShadow: '0 10px 30px rgba(220,38,38,0.4)' }}>
        المجموعة الجاية 🚀
      </motion.button>
    </motion.div>
  );
}

// 🏆 All Done Screen
function AllDoneScreen({ onMap }: { onMap: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-6 px-4">
      <Trophy size={120} className="text-yellow-400" 
        style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }} />
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">مبروك يا بطل! 🎉</h1>
        <p className="font-bold text-sm md:text-lg text-white/80">أنهيت أبجدية اللغة الإسبانية بنجاح!</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 360] }}
            transition={{ delay: 0.5 + s * 0.2, type: 'spring' }}>
            <img src="/treasuer/star.png" alt="star" className="w-16 h-16 md:w-20 md:h-20"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.9))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button onClick={onMap} className="px-10 py-4 rounded-2xl font-black text-xl text-white"
        style={{ 
          background: 'linear-gradient(135deg, #DC2626, #FFD700)', 
          boxShadow: '0 15px 40px rgba(220,38,38,0.5)', 
          borderBottom: '5px solid #991B1B' 
        }}>
        ارجع للخريطة 🗺️
      </motion.button>
    </motion.div>
  );
}

// 🎯 Main Component
function SpanishAlphabetLessonInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [groupIdx, setGroupIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctInGroup, setCorrectInGroup] = useState(0);

  const { stats, addPoints, incStreak, addGems, addStar, addLevelProgress } = useGameStats();
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [toroMood, setToroMood] = useState<ToroMood>('idle');
  const [toroMessage, setToroMessage] = useState<ToroMessage | null>(null);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    const load = async () => {
      const progress = await getSpanishLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        if (!progress.completed) {
          if (progress.current_group !== undefined && progress.current_group !== null) 
            setGroupIdx(progress.current_group);
          if (progress.current_letter !== undefined && progress.current_letter !== null) 
            setLetterIdx(progress.current_letter);
          if (progress.current_phase) setPhase(progress.current_phase as Phase);
        }
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const group = SPANISH_LETTER_GROUPS[groupIdx];
  const letterData = group?.letters[letterIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 3 ? 'closed' : correctInGroup < 6 ? 'half' : 'opend';

  const handleToroReact = (mood: ToroMood) => {
    setToroMood(mood);
    if (mood === 'happy' || mood === 'celebrate') {
      setToroMessage(SPANISH_ENCOURAGEMENTS[Math.floor(Math.random() * SPANISH_ENCOURAGEMENTS.length)]);
    } else if (mood === 'sad') {
      setToroMessage(SPANISH_SAD_MESSAGES[Math.floor(Math.random() * SPANISH_SAD_MESSAGES.length)]);
    }
    setTimeout(() => { setToroMood('idle'); setToroMessage(null); }, 2500);
  };

  const handleCombo = () => {
    setCombo(c => {
      const next = c + 1;
      if (next === 3 || next === 5 || next === 7) playComboSound();
      return next;
    });
  };

  const handleCorrect = (cx: number, cy: number) => {
    addPoints(10); incStreak();
    setCorrectInGroup(c => c + 1);
    setTotalStars(t => t + 1);

    setTimeout(() => {
      const starTarget = document.getElementById('star-target');
      if (starTarget) {
        const rect = starTarget.getBoundingClientRect();
        const id = Date.now() + Math.random();
        setFlyingItems(prev => [...prev, { 
          id, startX: cx, startY: cy, 
          endX: rect.left + rect.width / 2, endY: rect.top + rect.height / 2, 
          type: 'star' 
        }]);
        setTimeout(() => {
          setFlyingItems(prev => prev.filter(s => s.id !== id));
          addStar();
        }, 1100);
      }
    }, 100);

    setTimeout(() => {
      const lb = document.getElementById('level-bar-target');
      if (lb) {
        const rect = lb.getBoundingClientRect();
        const id = Date.now() + Math.random();
        setFlyingItems(prev => [...prev, { 
          id, startX: cx, startY: cy, 
          endX: rect.left + rect.width / 2, endY: rect.top + rect.height / 2, 
          type: 'energy' 
        }]);
        setTimeout(() => {
          setFlyingItems(prev => prev.filter(s => s.id !== id));
          addLevelProgress();
        }, 1100);
      }
    }, 400);
  };

  const calculateRating = (s: number): number => {
    const total = SPANISH_LETTERS.length * 3;
    const ratio = s / total;
    if (ratio >= 0.67) return 3;
    if (ratio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (g: number, l: number, p: Phase) => {
    const rating = calculateRating(totalStars);
    saveSpanishLessonProgress(LESSON_ID, rating, false, {
      current_group: g, current_letter: l, current_phase: p,
    });
  };

  const handleListenDone = () => { setPhase('write'); savePosition(groupIdx, letterIdx, 'write'); };
  const handleWriteDone = () => { setPhase('speak'); savePosition(groupIdx, letterIdx, 'speak'); };
  const handleSpeakDone = () => {
    const nextIdx = letterIdx + 1;
    if (nextIdx < group.letters.length) {
      setLetterIdx(nextIdx); setPhase('listen');
      savePosition(groupIdx, nextIdx, 'listen');
    } else {
      const nextGroup = groupIdx + 1;
      if (nextGroup < SPANISH_LETTER_GROUPS.length) {
        setPhase('group-success');
      } else {
        setPhase('all-done');
        saveSpanishLessonProgress(LESSON_ID, 3, true);
      }
    }
  };

  const handleNextGroup = () => {
    const nextGroup = groupIdx + 1;
    setGroupIdx(nextGroup); setLetterIdx(0); setPhase('listen');
    setCorrectInGroup(0);
    savePosition(nextGroup, 0, 'listen');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center">
        <div className="text-white text-xl font-bold">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>
      <ScreenBackground isMobile={isMobile} activeColor={letterData?.color || '#DC2626'} phase={phase} />

      <TopHUD stats={stats} level={stats.level} 
        currentStep={letterIdx} totalSteps={group?.letters.length || 9}
        onHome={() => router.push('/spanish-character-and-map')} isMobile={isMobile} />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-3 pt-20 md:pt-28 pb-24 md:pb-28">
        <AnimatePresence mode="wait">
          {phase === 'listen' && letterData && (
            <ListenPhase key={`listen-${groupIdx}-${letterIdx}`}
              letterData={letterData} onDone={handleListenDone}
              onToroReact={handleToroReact} onCombo={handleCombo} 
              onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'write' && letterData && (
            <WritePhase key={`write-${groupIdx}-${letterIdx}`}
              letterData={letterData} onDone={handleWriteDone}
              onToroReact={handleToroReact} onCombo={handleCombo} 
              onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'speak' && letterData && (
            <SpeakPhase key={`speak-${groupIdx}-${letterIdx}`}
              letterData={letterData} isMobile={isMobile}
              onSuccess={(cx, cy) => { handleCorrect(cx, cy); handleSpeakDone(); }}
              onSkip={handleSpeakDone} />
          )}
          {phase === 'group-success' && (
            <GroupSuccessScreen key="success" groupTitle={group.titleEs} onNext={handleNextGroup} />
          )}
          {phase === 'all-done' && (
            <AllDoneScreen key="done" onMap={() => router.push('/spanish-character-and-map')} />
          )}
        </AnimatePresence>
      </main>

      <BottomHUD stats={stats} treasureState={treasureState}
        onHint={() => {}} onMap={() => router.push('/spanish-character-and-map')} isMobile={isMobile} />

      <ToroBull mood={toroMood} message={toroMessage} idleGlowColor={letterData?.color || '#DC2626'} />
      
      <FlyingItems items={flyingItems} />
    </div>
  );
}

export default function SpanishAlphabetLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">جاري التحميل...</div>}>
      <SpanishAlphabetLessonInner />
    </Suspense>
  );
}
'use client';

import { useState, useEffect, useRef, useMemo, useCallback, RefObject } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Volume2, Star, RotateCcw, Trophy, Sparkles, Search, Copy, Trash2, Eraser, Plus, Home, Flame, Gem, Map, Zap, Lightbulb } from 'lucide-react';

// 📂 Data
import { LETTERS, LETTER_GROUPS, type Letter } from '@/data/german/letters';
import { 
  getHarborObjects, 
  getHarborImage, 
  hitTest, 
  isPointInPolygon, 
  polygonToSvgPoints,
  type Polygon,
  type Box,
} from '@/data/german/harbor-objects';

// 🔊 Audio
import { speakLetter, speakWord } from '@/lib/audio/speech';
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';

// 💾 Player Data
import { getLessonProgress, saveLessonProgress } from '@/lib/playerData';

// 🎨 Components
import KarlEagle from '@/app/components/lesson/KarlEagle';
import ComboDisplay from '@/app/components/lesson/ComboDisplay';
import FlyingStars from '@/app/components/lesson/FlyingStars';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import GhostInput from '@/app/components/lesson/GhostInput';
import SpecialCharsKeyboard from '@/app/components/lesson/SpecialCharsKeyboard';

// 🎯 Types
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

type FlyingStar = { id: number; x: number; y: number };
type InputRefType = RefObject<HTMLInputElement | null>;

// ═══════════════════════════════════════
// 🎮 Game Stats Hook
// ═══════════════════════════════════════
type GameStats = {
  points: number;
  streak: number;
  gems: number;
  level: number;
  energy: number;
  hints: number;
};

function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    points: 1250,
    streak: 7,
    gems: 35,
    level: 4,
    energy: 5,
    hints: 3,
  });

  const addPoints = (n: number) => setStats(s => {
    const newPoints = s.points + n;
    const newLevel = Math.floor(newPoints / 100) + 1;
    return { ...s, points: newPoints, level: newLevel };
  });

  const incStreak = () => setStats(s => ({ ...s, streak: s.streak + 1 }));
  const resetStreak = () => setStats(s => ({ ...s, streak: 0 }));
  const addGems = (n: number) => setStats(s => ({ ...s, gems: s.gems + n }));
  const useHint = () => setStats(s => ({ ...s, hints: Math.max(0, s.hints - 1) }));
  const addEnergy = (n: number) => setStats(s => ({ ...s, energy: s.energy + n }));

  return { stats, addPoints, incStreak, resetStreak, addGems, useHint, addEnergy };
}

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

function getRequiredSpecialChars(word: string): string[] {
  const found = new Set<string>();
  for (const char of word) {
    const lower = char.toLowerCase();
    if (['ä', 'ö', 'ü', 'ß'].includes(lower)) {
      if (char === char.toUpperCase() && char !== 'ß') {
        found.add(char);
      } else {
        found.add(lower);
      }
    }
  }
  return Array.from(found);
}

function compareWords(input: string, target: string): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  return normalize(input) === normalize(target);
}

// ═══════════════════════════════════════
// 🎨 خلفية الشاشة Full Screen
// ═══════════════════════════════════════
function ScreenBackground({ isMobile }: { isMobile: boolean }) {
  const bgImg = isMobile ? '/card-image/card-mob.png' : '/card-image/card-pc.png';
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img 
        src={bgImg} 
        alt="background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10,5,30,0.15) 0%, rgba(10,5,30,0.25) 100%)',
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 Top HUD (Compact)
// ═══════════════════════════════════════
function TopHUD({ stats, level, progress, currentStep, totalSteps, onHome, isMobile }: {
  stats: GameStats;
  level: number;
  progress: number;
  currentStep: number;
  totalSteps: number;
  onHome: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-3 md:px-4 pt-2 md:pt-2.5" 
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 md:gap-3">
        
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onHome}
          className="w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(15,10,45,0.65)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid rgba(255,255,255,0.18)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <Home size={isMobile ? 16 : 18} className="text-white" />
        </motion.button>

        <div className="flex items-center gap-1.5 md:gap-2">
          <motion.div
            key={stats.points}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,215,0,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <img src="/treasuer/star.png" alt="star" className="w-5 h-5 md:w-6 md:h-6" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {stats.points}
            </span>
          </motion.div>

          <motion.div
            key={`streak-${stats.streak}`}
            initial={{ scale: 1 }}
            animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,77,109,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <motion.div
              animate={{ rotate: stats.streak > 0 ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.5, repeat: stats.streak > 0 ? Infinity : 0, repeatDelay: 1 }}
            >
              <Flame size={isMobile ? 16 : 18} className="text-orange-400" 
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
            </motion.div>
            <div className="flex flex-col leading-none items-center">
              <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {stats.streak}
              </span>
              <span className="text-[7px] md:text-[8px] text-orange-200/90 font-bold mt-0.5">سلسلة</span>
            </div>
          </motion.div>

          <motion.div
            key={`gems-${stats.gems}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(157,78,221,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Gem size={isMobile ? 16 : 18} className="text-purple-300" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {stats.gems}
            </span>
          </motion.div>
        </div>

        {!isMobile && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl"
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
        )}

        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{
              borderColor: '#FFD700',
              boxShadow: '0 0 15px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, #4CC9F0, #7209B7)',
            }}
          >
            <img src="/characters/karl-3d.png" alt="character" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] md:text-[10px] font-bold text-white/80 mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>المستوى</span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm md:text-base text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {level}
              </span>
              <div className="w-12 md:w-16 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #4CC9F0, #7209B7)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
            <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={true} />
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({ currentStep, totalSteps, isMobile }: {
  currentStep: number;
  totalSteps: number;
  isMobile: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
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
              className="relative flex items-center justify-center rounded-full font-black border-2"
              style={{
                width: isActive ? (isMobile ? 26 : 30) : (isMobile ? 22 : 25),
                height: isActive ? (isMobile ? 26 : 30) : (isMobile ? 22 : 25),
                background: isActive 
                  ? 'linear-gradient(135deg, #9D4EDD, #7209B7)'
                  : isDone 
                    ? 'linear-gradient(135deg, #58CC02, #4AA802)'
                    : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#9D4EDD' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '9px' : '11px',
                boxShadow: isActive 
                  ? '0 0 12px rgba(157,78,221,0.6)' 
                  : isDone 
                    ? '0 0 8px rgba(88,204,2,0.4)' 
                    : 'none',
              }}
            >
              {isLocked ? '🔒' : isDone ? '✓' : stepNum}
            </motion.div>
            {i < totalSteps - 1 && (
              <div className="w-3 md:w-4 h-0.5"
                style={{
                  background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)',
                }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// 💎 Bottom HUD (Compact)
// ═══════════════════════════════════════
function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats;
  treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void;
  onMap: () => void;
  isMobile: boolean;
}) {
  const treasureImg = `/treasuer/${treasureState}.png`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-3 md:px-4 pb-2 md:pb-3 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'max-w-3xl'}`}>
        
        <div
          className="relative rounded-[1.75rem] px-3 md:px-5 py-2.5 md:py-3"
          style={{
            background: 'rgba(15,10,45,0.7)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: `
              0 20px 50px rgba(0,0,0,0.5),
              0 0 40px rgba(157,78,221,0.25),
              inset 0 1px 0 rgba(255,255,255,0.25),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `,
          }}
        >
          <div className="text-center mb-1.5 md:mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,165,0,0.15))',
                border: '1px solid rgba(255,215,0,0.4)',
                boxShadow: '0 2px 8px rgba(255,215,0,0.2)',
              }}>
              <Sparkles size={10} className="text-yellow-300" />
              <span className="text-[9px] md:text-[10px] font-black text-yellow-200 tracking-wider uppercase">
                مكافآت الإنجاز
              </span>
              <Sparkles size={10} className="text-yellow-300" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-1.5 md:gap-3">
            
            <RewardButton
              onClick={onMap}
              label="خريطة الرحلة"
              color="#4CC9F0"
              isMobile={isMobile}
            >
              <Map size={isMobile ? 18 : 22} className="text-cyan-300" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(76,201,240,0.8))' }} />
            </RewardButton>

            <RewardButton
              label="+5 نجوم"
              color="#FFD700"
              isMobile={isMobile}
              disabled
            >
              <img src="/treasuer/star.png" alt="star" className="w-7 h-7 md:w-9 md:h-9" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
            </RewardButton>

            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              animate={treasureState === 'opend' ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center relative">
                <img src={treasureImg} alt="treasure" className="w-full h-full object-contain"
                  style={{ 
                    filter: treasureState === 'opend' 
                      ? 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' 
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' 
                  }} />
                {treasureState === 'opend' && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.4), transparent 70%)' }}
                  />
                )}
              </div>
              <span className="text-[8px] md:text-[10px] font-black text-yellow-400">
                صندوق مفاجأة
              </span>
            </motion.div>

            <RewardButton
              label="+1 طاقة"
              color="#4CC9F0"
              isMobile={isMobile}
              disabled
            >
              <Zap size={isMobile ? 18 : 22} className="text-blue-300" fill="#4CC9F0"
                style={{ filter: 'drop-shadow(0 0 4px rgba(76,201,240,0.8))' }} />
            </RewardButton>

            <RewardButton
              onClick={onHint}
              label="تلميح"
              color="#FFD700"
              isMobile={isMobile}
              badge={stats.hints}
              disabled={stats.hints === 0}
            >
              <Lightbulb size={isMobile ? 18 : 22} className="text-yellow-300" fill="#FFD700"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
            </RewardButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function RewardButton({ children, label, color, isMobile, onClick, badge, disabled }: {
  children: React.ReactNode;
  label: string;
  color: string;
  isMobile: boolean;
  onClick?: () => void;
  badge?: number;
  disabled?: boolean;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-0.5 disabled:opacity-70"
    >
      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          border: `2px solid ${color}66`,
          boxShadow: `0 4px 12px ${color}33, inset 0 1px 0 ${color}44`,
        }}>
        {children}
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-black text-white border-2"
            style={{ 
              background: '#FF4D6D', 
              borderColor: 'rgba(15,10,45,0.95)',
              boxShadow: '0 2px 8px rgba(255,77,109,0.5)' 
            }}>
            {badge}
          </div>
        )}
      </div>
      <span className="text-[8px] md:text-[10px] font-black"
        style={{ color: color }}>
        {label}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════
// 🎨 Glass Card
// ═══════════════════════════════════════
function GlassCard({ children, className = '', accentColor = '#9D4EDD' }: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div 
      className={`relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden ${className}`}
      style={{
        background: 'rgba(20,15,55,0.45)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: `
          0 20px 60px rgba(0,0,0,0.5),
          0 0 50px ${accentColor}33,
          inset 0 1px 0 rgba(255,255,255,0.25),
          inset 0 -1px 0 rgba(0,0,0,0.2)
        `,
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none rounded-[1.5rem] md:rounded-[2rem]"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accentColor}33, transparent 60%)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🔠 Letter Box
// ═══════════════════════════════════════
function LetterBox({ letterData, size }: { letterData: Letter; size: number }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative rounded-[1.5rem] flex items-center justify-center select-none flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(145deg, rgba(35,25,85,0.9), rgba(20,15,55,0.95))',
        border: `2px solid ${letterData.color}99`,
        boxShadow: `0 10px 30px ${letterData.color}77, inset 0 1px 0 ${letterData.color}66`,
      }}
    >
      <span className="font-black"
        style={{
          fontSize: size * 0.6,
          background: `linear-gradient(180deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          backgroundClip: 'text',
          filter: `drop-shadow(0 4px 15px ${letterData.color}cc)`, 
          lineHeight: 1,
        }}>
        {letterData.letter}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🔊 Circular Sound Button
// ═══════════════════════════════════════
function CircularSoundButton({ onClick, color, size = 48 }: {
  onClick: () => void;
  color: string;
  size?: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleClick = () => {
    setIsPlaying(true);
    onClick();
    setTimeout(() => setIsPlaying(false), 1500);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="rounded-full flex items-center justify-center border-2 relative flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, #9D4EDD, #7209B7)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(157,78,221,0.6), 0 0 25px rgba(157,78,221,0.4)`,
      }}
    >
      {isPlaying && [0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: '#9D4EDD' }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      ))}
      <Volume2 size={size * 0.4} className="text-white" />
    </motion.button>
  );
}

// ═══════════════════════════════════════
// 📚 Learn Letter Mobile
// ═══════════════════════════════════════
function LearnLetterMobile({ letterData, input, status, onChange, onCheck, inputRef }: {
  letterData: Letter;
  input: string;
  status: 'idle' | 'correct' | 'wrong';
  onChange: (v: string) => void;
  onCheck: (e?: React.MouseEvent) => void;
  inputRef: InputRefType;
}) {
  return (
    <GlassCard className="w-full max-w-md mx-auto p-4" accentColor={letterData.color}>
      <div className="flex flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))',
            border: `2px solid ${letterData.color}66`,
            boxShadow: `0 4px 15px ${letterData.color}44`,
          }}
        >
          <span className="font-black text-xs text-gray-800">
            استمع جيداً وأكتب الحرف
          </span>
        </motion.div>

        <LetterBox letterData={letterData} size={110} />

        <CircularSoundButton 
          onClick={() => speakLetter(letterData.letter)} 
          color={letterData.color} 
          size={44}
        />

        <div className="flex items-center gap-1.5">
          <span className="font-black text-white text-sm">
            اكتب الحرف
          </span>
          <span className="text-base">✏️</span>
        </div>

        <div className="w-full max-w-[280px]">
          <GhostInput 
            ref={inputRef} 
            value={input} 
            onChange={v => onChange(v)} 
            onEnter={onCheck} 
            ghostText={letterData.letter} 
            color={letterData.color} 
            status={status} 
            fontSize="1.8rem"
            maxLength={1} 
            uppercase 
          />
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

        <motion.button 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }} 
          onClick={onCheck} 
          disabled={!input}
          className="w-full max-w-[280px] py-3 rounded-2xl font-black text-base text-white disabled:opacity-30 transition-all flex items-center justify-center gap-2"
          style={{ 
            background: 'linear-gradient(135deg, #58CC02, #4AA802)', 
            boxShadow: '0 6px 20px rgba(88,204,2,0.5)', 
            borderBottom: '4px solid #3A8602' 
          }}>
          تحقق <Check size={18} />
        </motion.button>
      </div>
    </GlassCard>
  );
}

// ═══════════════════════════════════════
// 📚 Learn Letter Desktop
// ═══════════════════════════════════════
function LearnLetterDesktop({ letterData, input, status, onChange, onCheck, inputRef }: {
  letterData: Letter;
  input: string;
  status: 'idle' | 'correct' | 'wrong';
  onChange: (v: string) => void;
  onCheck: (e?: React.MouseEvent) => void;
  inputRef: InputRefType;
}) {
  return (
    <div className="flex items-stretch justify-center gap-5 w-full max-w-4xl mx-auto">
      
      <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
        <div className="flex flex-col items-center gap-3 h-full justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 py-2 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))',
              border: `2px solid ${letterData.color}66`,
              boxShadow: `0 4px 15px ${letterData.color}44`,
            }}
          >
            <span className="font-black text-sm text-gray-800">
              استمع جيداً وأكتب الحرف
            </span>
          </motion.div>

          <LetterBox letterData={letterData} size={140} />

          <CircularSoundButton 
            onClick={() => speakLetter(letterData.letter)} 
            color={letterData.color} 
            size={48}
          />
        </div>
      </GlassCard>

      <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
        <div className="flex flex-col items-center gap-4 h-full justify-center">
          
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-lg">
              اكتب الحرف
            </span>
            <span className="text-xl">✏️</span>
          </div>

          <div className="w-full max-w-[280px]">
            <GhostInput 
              ref={inputRef} 
              value={input} 
              onChange={v => onChange(v)} 
              onEnter={onCheck} 
              ghostText={letterData.letter} 
              color={letterData.color} 
              status={status} 
              fontSize="2.2rem"
              maxLength={1} 
              uppercase 
            />
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

          <motion.button 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            onClick={onCheck} 
            disabled={!input}
            className="w-full max-w-[280px] py-3 rounded-2xl font-black text-lg text-white disabled:opacity-30 transition-all flex items-center justify-center gap-2"
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

// ═══════════════════════════════════════
// 📚 Learn Letter Wrapper
// ═══════════════════════════════════════
function LearnLetterPhase({ letterData, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  letterData: Letter; onDone: () => void; onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void; onCorrect: () => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => speakLetter(letterData.letter), 400);
    return () => clearTimeout(t);
  }, [letterData.letter]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim().toUpperCase() === letterData.letter.toUpperCase()) {
      setStatus('correct'); speakLetter(letterData.letter); playCoinSound();
      onCombo(); onKarlReact('happy'); onCorrect();
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1100);
    } else {
      setStatus('wrong'); playBuzzSound(); onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleChange = (v: string) => { setInput(v); setStatus('idle'); };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`learn-letter-${letterData.letter}`}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full">
        {isMobile ? (
          <LearnLetterMobile 
            letterData={letterData} 
            input={input} 
            status={status} 
            onChange={handleChange} 
            onCheck={handleCheck} 
            inputRef={inputRef}
          />
        ) : (
          <LearnLetterDesktop 
            letterData={letterData} 
            input={input} 
            status={status} 
            onChange={handleChange} 
            onCheck={handleCheck} 
            inputRef={inputRef}
          />
        )}
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// 📖 Learn Word Phase
// ═══════════════════════════════════════
function LearnWordPhase({ letterData, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  letterData: Letter; onDone: () => void; onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void; onCorrect: () => void; isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(letterData.word);

  useEffect(() => {
    const t = setTimeout(() => speakWord(letterData.word), 400);
    return () => clearTimeout(t);
  }, [letterData.word]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, letterData.word)) {
      setStatus('correct'); speakWord(letterData.word); playCoinSound();
      onCombo(); onKarlReact('happy'); onCorrect();
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1100);
    } else {
      setStatus('wrong'); playBuzzSound(); onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleSpecialChar = (c: string) => {
    setInput(prev => prev + c); setStatus('idle'); inputRef.current?.focus();
  };

  const handleChange = (v: string) => { setInput(v); setStatus('idle'); };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div key={`learn-word-${letterData.letter}`}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full">
        
        {isMobile ? (
          <GlassCard className="w-full max-w-md mx-auto p-4" accentColor={letterData.color}>
            <div className="flex flex-col items-center gap-2.5">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))',
                  border: `2px solid ${letterData.color}66`,
                  boxShadow: `0 4px 15px ${letterData.color}44`,
                }}
              >
                <span className="font-black text-xs text-gray-800">
                  استمع للكلمة واكتبها
                </span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -4, 0] }} 
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} 
                className="rounded-2xl flex items-center justify-center border-2 flex-shrink-0"
                style={{ 
                  width: 90, height: 90,
                  background: `linear-gradient(145deg, ${letterData.gradient[0]}44, ${letterData.gradient[1]}33)`, 
                  borderColor: `${letterData.color}77`, 
                  boxShadow: `0 8px 20px ${letterData.color}66` 
                }}>
                <span style={{ fontSize: '3.5rem', filter: `drop-shadow(0 4px 8px ${letterData.color}cc)` }}>
                  {letterData.emoji}
                </span>
              </motion.div>

              <div className="text-center">
                <div className="font-black text-xl text-white" 
                  style={{ textShadow: `0 0 20px ${letterData.color}aa, 0 2px 6px rgba(0,0,0,0.6)` }}>
                  {letterData.word}
                </div>
                <div className="font-bold text-xs mt-0.5" style={{ color: letterData.color, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {letterData.wordAr}
                </div>
              </div>

              <CircularSoundButton onClick={() => speakWord(letterData.word)} color={letterData.color} size={44} />

              <div className="w-full max-w-[280px] space-y-2">
                <GhostInput 
                  ref={inputRef} value={input} onChange={handleChange} onEnter={handleCheck} 
                  ghostText={letterData.word} color={letterData.color} status={status} fontSize="1.1rem"
                />
                {requiredChars.length > 0 && (
                  <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={letterData.color} />
                )}
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

              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} 
                onClick={handleCheck} disabled={!input}
                className="w-full max-w-[280px] py-3 rounded-2xl font-black text-base text-white disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #58CC02, #4AA802)', boxShadow: '0 6px 20px rgba(88,204,2,0.5)', borderBottom: '4px solid #3A8602' }}>
                تحقق <Check size={18} />
              </motion.button>
            </div>
          </GlassCard>
        ) : (
          <div className="flex items-stretch justify-center gap-5 w-full max-w-4xl mx-auto">
            
            <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
              <div className="flex flex-col items-center gap-3 h-full justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-5 py-2 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))',
                    border: `2px solid ${letterData.color}66`,
                    boxShadow: `0 4px 15px ${letterData.color}44`,
                  }}
                >
                  <span className="font-black text-sm text-gray-800">
                    استمع للكلمة واكتبها
                  </span>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -4, 0] }} 
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} 
                  className="rounded-2xl flex items-center justify-center border-2 flex-shrink-0"
                  style={{ 
                    width: 110, height: 110,
                    background: `linear-gradient(145deg, ${letterData.gradient[0]}44, ${letterData.gradient[1]}33)`, 
                    borderColor: `${letterData.color}77`, 
                    boxShadow: `0 8px 20px ${letterData.color}66` 
                  }}>
                  <span style={{ fontSize: '4rem', filter: `drop-shadow(0 4px 8px ${letterData.color}cc)` }}>
                    {letterData.emoji}
                  </span>
                </motion.div>

                <div className="text-center">
                  <div className="font-black text-2xl text-white" 
                    style={{ textShadow: `0 0 20px ${letterData.color}aa, 0 2px 6px rgba(0,0,0,0.6)` }}>
                    {letterData.word}
                  </div>
                  <div className="font-bold text-sm mt-0.5" style={{ color: letterData.color, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                    {letterData.wordAr}
                  </div>
                </div>
                <CircularSoundButton onClick={() => speakWord(letterData.word)} color={letterData.color} size={48} />
              </div>
            </GlassCard>

            <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color}>
              <div className="flex flex-col items-center gap-3 h-full justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-lg">اكتب الكلمة</span>
                  <span className="text-xl">✏️</span>
                </div>
                <div className="w-full max-w-[280px] space-y-2">
                  <GhostInput 
                    ref={inputRef} value={input} onChange={handleChange} onEnter={handleCheck} 
                    ghostText={letterData.word} color={letterData.color} status={status} fontSize="1.3rem"
                  />
                  {requiredChars.length > 0 && (
                    <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={letterData.color} />
                  )}
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
                <motion.button 
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} 
                  onClick={handleCheck} disabled={!input}
                  className="w-full max-w-[280px] py-3 rounded-2xl font-black text-lg text-white disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #58CC02, #4AA802)', boxShadow: '0 6px 20px rgba(88,204,2,0.5)', borderBottom: '4px solid #3A8602' }}>
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

// ═══════════════════════════════════════
// 🎨 DEBUG TOOL
// ═══════════════════════════════════════
type DebugLetterShapes = Record<string, Polygon[]>;

function DebugBrushTool({ isMobile }: { isMobile: boolean }) {
  const harborImage = useMemo(() => getHarborImage(isMobile), [isMobile]);
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [shapes, setShapes] = useState<DebugLetterShapes>({});
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [showAll, setShowAll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const existing = getHarborObjects(isMobile);
    const loaded: DebugLetterShapes = {};
    Object.entries(existing).forEach(([letter, arr]) => {
      const polygons: Polygon[] = [];
      arr.forEach((shape: any) => {
        if (Array.isArray(shape)) polygons.push(shape);
      });
      loaded[letter] = polygons;
    });
    setShapes(loaded);
  }, [isMobile]);

  const getPercentPos = (e: React.PointerEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const addBrushPoint = (x: number, y: number) => {
    const points: number[] = [];
    const segments = 8;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const px = x + Math.cos(angle) * brushSize;
      const py = y + Math.sin(angle) * brushSize * (harborImage.width / harborImage.height);
      points.push(px, py);
    }
    return points;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const pos = getPercentPos(e);
    setIsDrawing(true);
    lastPointRef.current = pos;
    setCurrentStroke(addBrushPoint(pos.x, pos.y));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPercentPos(e);
    const last = lastPointRef.current;
    if (!last) return;
    const dx = pos.x - last.x;
    const dy = pos.y - last.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.ceil(dist / (brushSize * 0.5)));
    const newPoints: number[] = [...currentStroke];
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const ix = last.x + dx * t;
      const iy = last.y + dy * t;
      newPoints.push(...addBrushPoint(ix, iy));
    }
    setCurrentStroke(newPoints);
    lastPointRef.current = pos;
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;
    if (currentStroke.length < 6) { setCurrentStroke([]); return; }
    const hull = computeConvexHull(currentStroke);
    const rounded = hull.map(n => parseFloat(n.toFixed(1)));
    setShapes(prev => ({ ...prev, [selectedLetter]: [...(prev[selectedLetter] || []), rounded] }));
    setCurrentStroke([]);
  };

  const computeConvexHull = (flatPoints: number[]): number[] => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < flatPoints.length; i += 2) pts.push({ x: flatPoints[i], y: flatPoints[i + 1] });
    if (pts.length < 3) return flatPoints;
    pts.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    const cross = (o: any, a: any, b: any) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower: any[] = [];
    for (const p of pts) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper: any[] = [];
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
    const result: number[] = [];
    hull.forEach(p => result.push(p.x, p.y));
    return result;
  };

  const undoLastShape = () => {
    setShapes(prev => {
      const arr = prev[selectedLetter] || [];
      if (arr.length === 0) return prev;
      return { ...prev, [selectedLetter]: arr.slice(0, -1) };
    });
  };

  const clearLetter = () => {
    if (confirm(`مسح كل أشكال حرف ${selectedLetter}؟`)) {
      setShapes(prev => ({ ...prev, [selectedLetter]: [] }));
    }
  };

  const exportCode = () => {
    let code = 'export const HARBOR_OBJECTS_MOBILE: Record<string, Polygon[]> = {\n';
    LETTERS.forEach(({ letter }) => {
      const arr = shapes[letter] || [];
      if (arr.length === 0) code += `  ${letter}: [],\n`;
      else {
        code += `  ${letter}: [\n`;
        arr.forEach(poly => { code += `    [${poly.join(', ')}],\n`; });
        code += `  ],\n`;
      }
    });
    code += '};\n';
    navigator.clipboard.writeText(code).then(() => alert('✅ الكود اتنسخ!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = code; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); alert('✅ اتنسخ!'); } catch { alert('⚠️ شوف الـ Console'); }
      document.body.removeChild(ta);
    });
  };

  const currentShapes = shapes[selectedLetter] || [];
  const currentLetterData = LETTERS.find(l => l.letter === selectedLetter);
  const totalShapes = Object.values(shapes).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-y-auto" style={{ touchAction: 'pan-y' }}>
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/95 to-black/80 p-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xs font-black text-yellow-400">🎨 Brush Tool</h1>
          <button onClick={() => window.location.href = window.location.pathname} className="text-xs bg-red-500/30 border border-red-500 px-3 py-1 rounded-lg font-bold">خروج ✕</button>
        </div>
        <div className="grid grid-cols-9 gap-1">
          {LETTERS.map(l => {
            const count = (shapes[l.letter] || []).length;
            const isActive = l.letter === selectedLetter;
            return (
              <button key={l.letter} onClick={() => setSelectedLetter(l.letter)}
                className="relative aspect-square rounded font-black text-xs border transition-all"
                style={{
                  background: isActive ? l.color : count > 0 ? `${l.color}55` : 'rgba(255,255,255,0.05)',
                  borderColor: isActive ? 'white' : count > 0 ? l.color : 'rgba(255,255,255,0.1)',
                  color: isActive || count > 0 ? 'white' : 'rgba(255,255,255,0.4)',
                }}>
                {l.letter}
                {count > 0 && <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{count}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: currentLetterData?.color }}>{selectedLetter}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate">{currentLetterData?.word}</div>
            <div className="text-[10px] text-white/60 truncate">{currentLetterData?.wordAr} • {currentShapes.length} شكل</div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={undoLastShape} disabled={currentShapes.length === 0} className="bg-yellow-500/30 border border-yellow-500 px-2 py-1 rounded text-[10px] font-bold disabled:opacity-30">↶</button>
            <button onClick={clearLetter} disabled={currentShapes.length === 0} className="bg-red-500/30 border border-red-500 px-2 py-1 rounded text-[10px] font-bold disabled:opacity-30"><Trash2 size={10} /></button>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
          <span className="text-[10px] font-bold text-white/70">حجم الفرشاة:</span>
          <input type="range" min="1.5" max="8" step="0.5" value={brushSize} onChange={e => setBrushSize(parseFloat(e.target.value))} className="flex-1" />
          <span className="text-[10px] font-black text-yellow-400 w-8 text-center">{brushSize}</span>
          <button onClick={() => setShowAll(s => !s)} className="bg-blue-500/30 border border-blue-500 px-2 py-1 rounded text-[10px] font-bold">{showAll ? '👁 الكل' : '👁 الحالي'}</button>
        </div>
        <div className="text-[10px] text-center bg-yellow-500/20 border border-yellow-500/40 rounded p-1.5 text-white/80">ⓘ ظلل العنصر بإصبعك على الصورة</div>
      </div>
      <div className="w-full" style={{ aspectRatio: `${harborImage.width} / ${harborImage.height}` }}>
        <div ref={containerRef} className="relative w-full h-full select-none"
          style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
          <img src={harborImage.src} alt="harbor" className="w-full h-full block pointer-events-none" style={{ objectFit: 'fill' }} draggable={false} />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Object.entries(shapes).flatMap(([letter, polys]) => {
              if (!showAll && letter !== selectedLetter) return [];
              const color = LETTERS.find(l => l.letter === letter)?.color || '#fff';
              const isCurrent = letter === selectedLetter;
              return polys.map((poly, idx) => (
                <g key={`${letter}-${idx}`}>
                  <polygon points={polygonToSvgPoints(poly)} fill={color} fillOpacity={isCurrent ? 0.45 : 0.2} stroke={color} strokeWidth={isCurrent ? 0.4 : 0.2} style={{ pointerEvents: 'none' }} />
                  <text x={poly[0]} y={poly[1] - 1} fontSize="2" fill="#fff" fontWeight="900" style={{ paintOrder: 'stroke', stroke: 'black', strokeWidth: 0.3 }}>{letter}</text>
                </g>
              ));
            })}
            {currentStroke.length >= 6 && (
              <polygon points={polygonToSvgPoints(currentStroke)} fill={currentLetterData?.color || '#FFD700'} fillOpacity={0.5} stroke="#FFD700" strokeWidth="0.3" />
            )}
          </svg>
        </div>
      </div>
      <div className="sticky bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent p-3 space-y-1">
        <button onClick={exportCode} className="w-full py-3 rounded-xl font-black text-sm bg-green-500 text-white flex items-center justify-center gap-2">
          <Copy size={16} /> نسخ الكود ({totalShapes} شكل)
        </button>
        <div className="text-[10px] text-white/50 text-center">{selectedLetter}: {currentShapes.length} • المجموع: {totalShapes}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🗺️ HarborTest
// ═══════════════════════════════════════
function HarborTest({ 
  groupLetters, onPass, onFail, onStarEarned, onKarlReact, onCombo, onCorrect, isMobile,
}: any) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; correct: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const harborImage = useMemo(() => getHarborImage(isMobile), [isMobile]);
  const harborObjects = useMemo(() => getHarborObjects(isMobile), [isMobile]);

  const currentLetter = groupLetters[currentIdx];
  const shapes = currentLetter ? (harborObjects[currentLetter.letter] ?? []) : [];

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (showFeedback || finished || shapes.length === 0 || !currentLetter) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (clickX < 0 || clickY < 0 || clickX > rect.width || clickY > rect.height) return;
    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;
    const hit = hitTest(pctX, pctY, shapes);
    setClickEffect({ x: pctX, y: pctY, correct: hit });
    setTimeout(() => setClickEffect(null), 700);
    if (hit) {
      setShowFeedback('correct');
      speakWord(currentLetter.word);
      playCoinSound(); onCombo(); onKarlReact('happy'); onCorrect();
      onStarEarned(e.clientX, e.clientY);
      setTimeout(() => {
        setShowFeedback(null); setShowHint(false);
        if (currentIdx + 1 >= groupLetters.length) {
          setFinished(true); onKarlReact('celebrate');
          setTimeout(onPass, 1800);
        } else setCurrentIdx(i => i + 1);
      }, 1200);
    } else {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      setShowFeedback('wrong');
      playBuzzSound(); onKarlReact('sad');
      setTimeout(() => {
        setShowFeedback(null);
        if (newWrong >= 5) onFail();
      }, 700);
    }
  }, [showFeedback, finished, shapes, currentLetter, currentIdx, groupLetters.length, wrong, onCombo, onKarlReact, onStarEarned, onPass, onFail, onCorrect]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl mx-auto px-2 md:px-4">
      <div className="space-y-2">
        {currentLetter && (
          <GlassCard className="p-2.5 md:p-3" accentColor={currentLetter.color}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-xl md:text-2xl border-2 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${currentLetter.gradient[0]}, ${currentLetter.gradient[1]})`,
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    boxShadow: `0 6px 15px ${currentLetter.color}66`,
                  }}
                >
                  {currentLetter.letter}
                </motion.div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-white/70">
                    <Search size={11} />
                    <span>ابحث عن</span>
                  </div>
                  <div className="font-black text-sm md:text-base text-white">{currentLetter.word}</div>
                  <div className="text-[10px] md:text-xs font-bold" style={{ color: currentLetter.color }}>{currentLetter.wordAr}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => speakWord(currentLetter.word)}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center border-2"
                  style={{
                    background: `${currentLetter.color}33`,
                    borderColor: `${currentLetter.color}66`,
                  }}
                >
                  <Volume2 size={isMobile ? 14 : 16} className="text-white" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHint(s => !s)}
                  className="px-2 py-1.5 rounded-xl text-xs font-black border-2"
                  style={{
                    color: showHint ? currentLetter.color : 'rgba(255,255,255,0.5)',
                    borderColor: showHint ? `${currentLetter.color}66` : 'rgba(255,255,255,0.15)',
                    background: showHint ? `${currentLetter.color}18` : 'rgba(255,255,255,0.03)',
                  }}
                >
                  💡
                </motion.button>
              </div>
            </div>
          </GlassCard>
        )}

        <div ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden border-2 border-white/15"
          style={{ 
            cursor: 'pointer', 
            background: '#0a1628',
            maxHeight: isMobile ? '60vh' : '52vh',
            aspectRatio: `${harborImage.width} / ${harborImage.height}`,
            boxShadow: '0 15px 50px rgba(0,0,0,0.5)',
          }}
          onClick={handleImageClick}>
          <img src={harborImage.src} alt="ميناء" className="w-full h-full" style={{ objectFit: 'fill', pointerEvents: 'none', display: 'block' }} draggable={false} />
          <AnimatePresence>
            {showHint && shapes.length > 0 && currentLetter && (
              <motion.svg key="hint-svg"
                initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.85, 0.4] }} exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100" preserveAspectRatio="none">
                {shapes.map((shape: any, idx: number) => {
                  if (Array.isArray(shape)) {
                    return <polygon key={idx} points={polygonToSvgPoints(shape)} fill={currentLetter.color} fillOpacity={0.35} stroke={currentLetter.color} strokeWidth={0.5} />;
                  } else {
                    return <rect key={idx} x={shape.x} y={shape.y} width={shape.w} height={shape.h} fill={currentLetter.color} fillOpacity={0.35} stroke={currentLetter.color} strokeWidth={0.5} rx={1} />;
                  }
                })}
              </motion.svg>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {clickEffect && (
              <motion.div initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.5 }}
                className="absolute pointer-events-none rounded-full"
                style={{ left: `${clickEffect.x}%`, top: `${clickEffect.y}%`, transform: 'translate(-50%, -50%)', width: '40px', height: '40px',
                  background: clickEffect.correct ? 'rgba(88,204,2,0.6)' : 'rgba(255,68,68,0.6)' }} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showFeedback === 'correct' && currentLetter && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(88,204,2,0.28), transparent)' }}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-white text-lg" style={{ background: 'rgba(88,204,2,0.92)' }}>
                  ✓ {currentLetter.word}!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {finished && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: 'rgba(0,10,20,0.85)' }}>
              <div className="text-6xl">🎉</div>
              <p className="font-black text-white text-2xl">ممتاز!</p>
              <div className="flex gap-1">
                {groupLetters.map((l: any) => <Star key={l.letter} size={20} fill="#FFD700" color="#FFD700" />)}
              </div>
            </motion.div>
          )}
        </div>

        {wrong > 0 && (
          <div className="text-center text-xs font-bold" style={{ color: wrong >= 3 ? '#FF6B6B' : 'rgba(255,255,255,0.5)', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
            {'❌'.repeat(Math.min(wrong, 5))} {wrong}/5
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎉 Success & Fail Screens
// ═══════════════════════════════════════
function SuccessScreen({ groupTitle, onNext }: { groupTitle: string; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center py-6 px-4">
      <div className="text-6xl md:text-7xl">🏆</div>
      <div>
        <h2 className="text-xl md:text-3xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>أنهيت {groupTitle}!</h2>
        <p className="font-bold text-sm md:text-base text-[#4CC9F0]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>كمّل على المجموعة الجاية 💪</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + s * 0.15, type: 'spring' }}>
            <img src="/treasuer/star.png" alt="star" className="w-10 h-10 md:w-12 md:h-12" style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button onClick={onNext} className="px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-base md:text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #4CC9F0, #7209B7)', boxShadow: '0 10px 30px rgba(76,201,240,0.4)' }}>
        المجموعة الجاية 🚀
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center py-6 px-4">
      <div className="text-5xl md:text-6xl">😅</div>
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>حاول تاني!</h2>
        <p className="font-bold text-sm text-white/80" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>راجع الحروف</p>
      </div>
      <motion.button onClick={onRetry} className="flex items-center gap-2 px-6 md:px-8 py-3 rounded-2xl font-black text-base text-white"
        style={{ background: 'linear-gradient(135deg, #F72585, #7209B7)' }}>
        <RotateCcw size={18} /> أعد المحاولة
      </motion.button>
    </motion.div>
  );
}

type Phase = 'learn-letter' | 'learn-word' | 'test' | 'group-success' | 'group-fail' | 'all-done';

// ═══════════════════════════════════════
// 🎮 MAIN COMPONENT
// ═══════════════════════════════════════
function GermanLetterLessonPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [groupIdx, setGroupIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn-letter');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctInGroup, setCorrectInGroup] = useState(0);
  const LESSON_ID = 'hamburg';

  const { stats, addPoints, incStreak, resetStreak, addGems, useHint } = useGameStats();

  const isDebugMode = searchParams.get('debug') === '1';

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        if (!progress.completed) {
          if (progress.current_group !== undefined && progress.current_group !== null) setGroupIdx(progress.current_group);
          if (progress.current_letter !== undefined && progress.current_letter !== null) setLetterIdx(progress.current_letter);
          if (progress.current_phase) setPhase(progress.current_phase as Phase);
        }
      }
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const group = LETTER_GROUPS[groupIdx];
  const letterData = group?.letters[letterIdx];
  const totalLettersLearned = groupIdx * 6 + letterIdx;
  const totalLetters = LETTERS.length;
  const progress = (totalLettersLearned / totalLetters) * 100;

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup === 0 ? 'closed' :
    correctInGroup < (group?.letters.length ?? 6) * 2 ? 'half' : 'opend';

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

  const handleCorrect = () => {
    addPoints(10);
    incStreak();
    setCorrectInGroup(c => c + 1);
  };

  const resetCombo = () => setCombo(0);

  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = LETTERS.length;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newGroup: number, newLetter: number, newPhase: Phase) => {
    const rating = calculateRating(totalStars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup, current_letter: newLetter, current_phase: newPhase,
    });
  };

  const handleLetterDone = () => { setPhase('learn-word'); savePosition(groupIdx, letterIdx, 'learn-word'); };
  const handleWordDone = () => {
    const nextIdx = letterIdx + 1;
    if (nextIdx < group.letters.length) {
      setLetterIdx(nextIdx); setPhase('learn-letter');
      savePosition(groupIdx, nextIdx, 'learn-letter');
    } else {
      setPhase('test'); savePosition(groupIdx, letterIdx, 'test');
    }
  };
  const handleTestPass = () => {
    setPhase('group-success');
    addGems(5);
  };
  const handleTestFail = () => { resetCombo(); resetStreak(); setPhase('group-fail'); };
  const handleGroupNext = () => {
    if (groupIdx + 1 < LETTER_GROUPS.length) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx); setLetterIdx(0); setPhase('learn-letter');
      setCorrectInGroup(0);
      savePosition(newGroupIdx, 0, 'learn-letter');
    } else { setPhase('all-done'); }
  };
  const handleRetry = () => { setLetterIdx(0); setPhase('learn-letter'); setCorrectInGroup(0); savePosition(groupIdx, 0, 'learn-letter'); };
  
  const handleStarEarned = (clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    const newStarsCount = totalStars + 1;
    setTotalStars(newStarsCount);
    setFlyingStars(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 1000);
    const rating = calculateRating(newStarsCount);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: groupIdx, current_letter: letterIdx, current_phase: phase,
    });
  };

  const handleHomeClick = () => router.push('/character-and-map?from=lesson');

  if (isDebugMode && !isLoading) {
    return <DebugBrushTool isMobile={isMobile} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⚓</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!group || !letterData) return null;

  const totalStepsInGroup = group.letters.length;

  return (
    <div 
      className="text-white relative overflow-hidden" 
      style={{ 
        fontFamily: "'Tajawal', sans-serif",
        height: '100vh',
        maxHeight: '100vh',
      }} 
      dir="rtl"
    >
      
      <ScreenBackground isMobile={isMobile} />

      <div style={{ 
        transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', 
        transformOrigin: 'bottom right', 
        position: 'fixed', 
        bottom: isMobile ? 110 : 130, 
        right: 0, 
        zIndex: 25, 
        pointerEvents: 'none' 
      }}>
        <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#4CC9F0" />
      </div>

      <ComboDisplay combo={combo} />
      <FlyingStars stars={flyingStars} />

      <TopHUD 
        stats={stats} 
        level={stats.level}
        progress={progress}
        currentStep={letterIdx}
        totalSteps={totalStepsInGroup}
        onHome={handleHomeClick}
        isMobile={isMobile}
      />

      <div 
        className="flex flex-col items-center justify-center relative px-3 md:px-6"
        style={{ 
          zIndex: 10,
          height: '100vh',
          paddingTop: isMobile ? '140px' : '80px',
          paddingBottom: isMobile ? '140px' : '150px',
        }}
      >
        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'learn-letter' && (
              <LearnLetterPhase 
                key={`ll-${groupIdx}-${letterIdx}`} 
                letterData={letterData} 
                onDone={handleLetterDone} 
                onKarlReact={handleKarlReact} 
                onCombo={handleCombo} 
                onCorrect={handleCorrect}
                isMobile={isMobile} 
              />
            )}
            {phase === 'learn-word' && (
              <LearnWordPhase 
                key={`lw-${groupIdx}-${letterIdx}`} 
                letterData={letterData} 
                onDone={handleWordDone} 
                onKarlReact={handleKarlReact} 
                onCombo={handleCombo}
                onCorrect={handleCorrect} 
                isMobile={isMobile} 
              />
            )}
            {phase === 'test' && (
              <HarborTest 
                groupLetters={group.letters} 
                onPass={handleTestPass}
                onFail={handleTestFail} 
                onStarEarned={handleStarEarned} 
                onKarlReact={handleKarlReact} 
                onCombo={handleCombo}
                onCorrect={handleCorrect}
                isMobile={isMobile}
              />
            )}
            {phase === 'group-success' && <SuccessScreen key="success" groupTitle={group.title} onNext={handleGroupNext} />}
            {phase === 'group-fail' && <FailScreen key="fail" onRetry={handleRetry} />}
            {phase === 'all-done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-center py-6 max-w-md mx-auto px-4">
                <div className="text-6xl md:text-7xl">🎓</div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>تعلمت كل الحروف!</h2>
                  <p className="font-bold text-sm md:text-base text-[#4CC9F0]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>ميناء هامبورغ فُتح 🇩🇪</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-yellow-400/30" style={{ background: 'rgba(255,215,0,0.1)' }}>
                  <img src="/treasuer/star.png" alt="star" className="w-7 h-7 md:w-8 md:h-8" />
                  <span className="font-black text-2xl md:text-3xl text-yellow-400">{totalStars}</span>
                  <span className="font-bold text-white/80">نجمة!</span>
                </div>
                <motion.button onClick={async () => {
                    await saveLessonProgress(LESSON_ID, 3, true);
                    router.push('/character-and-map?from=lesson');
                  }}
                  className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-base md:text-lg text-white"
                  style={{ background: 'linear-gradient(135deg, #58CC02, #096A02)', boxShadow: '0 10px 30px rgba(88,204,2,0.4)' }}>
                  <Trophy size={20} /> الخريطة
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

export default function GermanLetterLessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⚓</div>
          <p className="text-white font-bold">جاري التحميل...</p>
        </div>
      </div>
    }>
      <GermanLetterLessonPageInner />
    </Suspense>
  );
}
'use client';

import { useState, useEffect, useRef, useMemo, useCallback, RefObject } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Volume2, Star, RotateCcw, Trophy, Sparkles, Search, Copy, Trash2, Eraser, Plus, Home, Flame, Gem } from 'lucide-react';

import { LETTERS, LETTER_GROUPS, type Letter } from '@/data/german/letters';
import { 
  getHarborObjects, getHarborImage, hitTest, isPointInPolygon, polygonToSvgPoints,
  type Polygon, type Box,
} from '@/data/german/harbor-objects';

import { speakLetter, speakWord } from '@/lib/audio/speech';
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { getLessonProgress, saveLessonProgress } from '@/lib/playerData';

import KarlEagle from '@/app/components/lesson/KarlEagle';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import GhostInput from '@/app/components/lesson/GhostInput';
import SpecialCharsKeyboard from '@/app/components/lesson/SpecialCharsKeyboard';

import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

type FlyingItem = { 
  id: number; 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number;
  type: 'star' | 'energy' | 'gem';
};
type InputRefType = RefObject<HTMLInputElement | null>;

const TOTAL_LETTERS = LETTERS.length;
const TOTAL_ANSWERS_PER_LESSON = TOTAL_LETTERS * 3;

// 🎨 ألوان غامقة وواضحة للحروف
const DARK_LETTER_COLORS: Record<string, string> = {
  '#FF6B6B': '#8B0000',
  '#4ECDC4': '#0D5C5A',
  '#45B7D1': '#0F4C5C',
  '#FFA07A': '#8B3A1A',
  '#98D8C8': '#1F5F4D',
  '#F7DC6F': '#7D6608',
  '#BB8FCE': '#4A148C',
  '#85C1E2': '#1A5276',
  '#F8B739': '#7E5109',
  '#52BE80': '#0E4C2B',
  '#EC7063': '#641E16',
  '#5DADE2': '#1B4F72',
  '#48C9B0': '#0E5147',
  '#F4D03F': '#7D6608',
  '#A569BD': '#4A148C',
  '#5499C7': '#1A5276',
  '#E59866': '#6E2C00',
  '#58D68D': '#0E4C2B',
  '#AF7AC5': '#4A148C',
  '#76D7C4': '#0E5147',
  '#F1948A': '#641E16',
  '#85929E': '#1B2631',
  '#82E0AA': '#0E4C2B',
  '#F0B27A': '#7E5109',
  '#7FB3D5': '#1B4F72',
};

function getDarkColor(originalColor: string): string {
  if (DARK_LETTER_COLORS[originalColor]) {
    return DARK_LETTER_COLORS[originalColor];
  }
  return darkenColor(originalColor, 0.5);
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// 🆕 نظام fallback ذكي للأيقونات المخصصة
function getLessonIconPath(word: string, ext: string = 'svg'): string {
  return `/lesson-icon/${word.toLowerCase()}.${ext}`;
}

// 🆕 Component للإيموجي مع fallback لصورة مخصصة
function EmojiOrIcon({ word, emoji, size, color }: {
  word: string;
  emoji: string;
  size: number;
  color: string;
}) {
  const [useIcon, setUseIcon] = useState(true);
  const [iconExt, setIconExt] = useState<'svg' | 'png'>('svg');

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
      src={getLessonIconPath(word, iconExt)}
      alt={word}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: `drop-shadow(0 4px 8px ${color}aa)`,
      }}
      onError={() => {
        // لو SVG فشل، جرب PNG
        if (iconExt === 'svg') {
          setIconExt('png');
        } else {
          // لو الـ PNG كمان فشل، استخدم الإيموجي
          setUseIcon(false);
        }
      }}
    />
  );
}

type GameStats = {
  points: number;
  streak: number;
  gems: number;
  level: number;
  energy: number;
  hints: number;
  levelProgress: number;
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
    const increment = 100 / TOTAL_ANSWERS_PER_LESSON;
    const newProgress = Math.min(100, s.levelProgress + increment);
    return { ...s, levelProgress: newProgress };
  });

  return { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress };
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

function generateLetterChoices(correctLetter: string, count: number = 3): string[] {
  const allLetters = LETTERS.map(l => l.letter).filter(l => l !== correctLetter);
  const shuffled = allLetters.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  const choices = [...wrongChoices, correctLetter];
  return choices.sort(() => Math.random() - 0.5);
}

function shuffleWordLetters(word: string): string[] {
  const letters = word.split('');
  let shuffled = [...letters];
  let attempts = 0;
  while (shuffled.join('') === word && attempts < 10) {
    shuffled = letters.sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled;
}

function ScreenBackground({ isMobile, activeColor, phase }: { isMobile: boolean; activeColor: string; phase?: string }) {
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
    const bgImage = phase === 'test' ? '/images/Hamburg-mob.jpeg' : '/card-image/card-mob.png';
    const overlayOpacity = phase === 'test' 
      ? 'linear-gradient(180deg, rgba(10,5,30,0.35) 0%, rgba(10,5,30,0.55) 100%)'
      : 'linear-gradient(180deg, rgba(10,5,30,0.15) 0%, rgba(10,5,30,0.25) 100%)';
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <img src={bgImage} alt="bg" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: overlayOpacity }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <img src="/card-image/card-pc.png" alt="bg" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 20%, rgba(26,21,71,0.85) 0%, rgba(15,10,46,0.92) 50%, rgba(7,5,26,0.95) 100%)',
      }} />
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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

function TopHUD({ stats, level, currentStep, totalSteps, onHome, isMobile }: {
  stats: GameStats;
  level: number;
  currentStep: number;
  totalSteps: number;
  onHome: () => void;
  isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-30 px-2" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2px)' }}>
        
        <div className="flex items-center justify-between gap-1.5">
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{
                borderColor: '#FFD700',
                boxShadow: '0 0 10px rgba(255,215,0,0.5)',
                background: 'linear-gradient(135deg, #4CC9F0, #7209B7)',
              }}
            >
              <img src="/characters/karl-3d.png" alt="character" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #4CC9F0, #7209B7)' }}
                    animate={{ width: `${stats.levelProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
            <motion.div
              key={`points-${stats.points}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(15,10,45,0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,215,0,0.35)',
                minWidth: 0,
              }}
            >
              <img id="star-target" src="/treasuer/star.png" alt="star" className="w-3 h-3 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.points}</span>
            </motion.div>

            <motion.div
              key={`streak-${stats.streak}`}
              animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(15,10,45,0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,77,109,0.35)',
                minWidth: 0,
              }}
            >
              <Flame size={12} className="text-orange-400 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.streak}</span>
            </motion.div>

            <motion.div
              key={`gems-${stats.gems}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 justify-center"
              style={{
                background: 'rgba(15,10,45,0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(157,78,221,0.35)',
                minWidth: 0,
              }}
            >
              <Gem id="gem-target" size={12} className="text-purple-300 flex-shrink-0" 
                style={{ filter: 'drop-shadow(0 0 4px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
              <span className="font-black text-[10px] text-white truncate">{stats.gems}</span>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(15,10,45,0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Home size={14} className="text-white" />
          </motion.button>
        </div>

                <div className="flex justify-center" style={{ marginTop: '2.5px' }}>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
            style={{
              background: 'rgba(15,10,45,0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
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
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
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
            <div className="flex items-center gap-2">
              <span className="font-black text-sm md:text-base text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {level}
              </span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #4CC9F0, #7209B7)' }}
                  animate={{ width: `${stats.levelProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
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
          <motion.div
            key={`gems-${stats.gems}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(157,78,221,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {stats.gems}
            </span>
            <Gem id="gem-target" size={18} className="text-purple-300" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(157,78,221,0.8))', fill: '#9D4EDD' }} />
          </motion.div>

          <motion.div
            key={`streak-${stats.streak}`}
            animate={{ scale: stats.streak > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,77,109,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex flex-col leading-none items-center">
              <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                {stats.streak}
              </span>
              <span className="text-[7px] md:text-[8px] text-orange-200/90 font-bold mt-0.5">سلسلة</span>
            </div>
            <Flame size={18} className="text-orange-400" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,77,109,0.8))', fill: stats.streak > 0 ? '#FF4D6D' : 'transparent' }} />
          </motion.div>

          <motion.div
            key={stats.points}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-2 md:py-2.5 rounded-2xl"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,215,0,0.35)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <span className="font-black text-xs md:text-sm text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {stats.points}
            </span>
            <img id="star-target" src="/treasuer/star.png" alt="star" className="w-5 h-5 md:w-6 md:h-6" 
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }} />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onHome}
            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(15,10,45,0.65)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <Home size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function Stepper({ currentStep, totalSteps, isMobile }: {
  currentStep: number;
  totalSteps: number;
  isMobile: boolean;
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
                  ? 'linear-gradient(135deg, #9D4EDD, #7209B7)'
                  : isDone 
                    ? 'linear-gradient(135deg, #58CC02, #4AA802)'
                    : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#9D4EDD' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(157,78,221,0.6)' : isDone ? '0 0 6px rgba(88,204,2,0.4)' : 'none',
              }}
            >
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
              <motion.div
                key={`trail-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 6, height: 6,
                  background: color,
                  boxShadow: `0 0 12px ${color}`,
                  top: 0, left: 0,
                }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0],
                  x: [0, midX1 + (i * 5), midX2 + (i * 8), dx],
                  y: [0, midY1 + (i * 8), midY2 + (i * 5), dy],
                }}
                transition={{ 
                  duration: 1.4, 
                  delay: i * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}

            <motion.div
              className="absolute rounded-full pointer-events-none"
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
              }}
            >
              <div className="relative" style={{ width: 40, height: 40, marginTop: -20, marginLeft: -20 }}>
                <div 
                  className="absolute inset-0 rounded-full blur-xl" 
                  style={{ background: color, opacity: 0.8, transform: 'scale(2.5)' }} 
                />
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

            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 80, height: 80,
                background: `radial-gradient(circle, ${color}aa, transparent 60%)`,
                top: -40, left: -40,
              }}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 0, 0, 2.5, 0],
                opacity: [0, 0, 0, 1, 0],
                x: [0, 0, 0, dx, dx],
                y: [0, 0, 0, dy, dy],
              }}
              transition={{ duration: 1.5, times: [0, 0.7, 0.85, 0.92, 1], ease: 'easeOut' }}
            />

            {[0, 60, 120, 180, 240, 300].map(angle => (
              <motion.div
                key={`ray-${angle}`}
                className="absolute pointer-events-none"
                style={{
                  width: 30, height: 3,
                  background: `linear-gradient(90deg, ${color}, transparent)`,
                  top: 0, left: 0,
                  transformOrigin: '0% 50%',
                  transform: `rotate(${angle}deg)`,
                }}
                initial={{ scaleX: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  scaleX: [0, 0, 0, 1.5, 0],
                  opacity: [0, 0, 0, 1, 0],
                  x: [0, 0, 0, dx, dx],
                  y: [0, 0, 0, dy, dy],
                }}
                transition={{ duration: 1.5, times: [0, 0.7, 0.85, 0.92, 1], ease: 'easeOut' }}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}

// 🆕 BottomHUD - أيقونات بدون إطار، زي صندوق الكنز
function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats;
  treasureState: 'closed' | 'half' | 'opend';
  onHint: () => void;
  onMap: () => void;
  isMobile: boolean;
}) {
  const treasureImg = `/treasuer/${treasureState}.png`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1 md:pb-1.5 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
      <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'w-full max-w-[1500px]'}`}>
        <div className="relative rounded-xl px-3 md:px-6 py-1 md:py-1.5"
          style={{
            background: 'linear-gradient(135deg, rgba(20,15,55,0.85) 0%, rgba(15,10,45,0.9) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(157,78,221,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}>
          
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Sparkles size={8} className="text-yellow-300" />
            <span className="text-[8px] md:text-[9px] font-black text-yellow-200 tracking-wider uppercase">
              مكافآت الإنجاز
            </span>
            <Sparkles size={8} className="text-yellow-300" />
          </div>

          <div className="flex items-end justify-around gap-2 md:gap-3">
            {/* 🗺️ الخريطة */}
            <FloatingIconButton 
              onClick={onMap} 
              label="خريطة" 
              color="#4CC9F0" 
              isMobile={isMobile}
              iconSrc="/treasuer/map-icon.png"
              iconAlt="map"
            />

            {/* ⭐ النجوم */}
            <FloatingIconButton 
              label="نجوم" 
              color="#FFD700" 
              isMobile={isMobile} 
              disabled
              iconSrc="/treasuer/star.png"
              iconAlt="star"
            />

            {/* 📦 الصندوق */}
            <motion.div
              id="treasure-box"
              whileHover={{ scale: 1.08, y: -2 }}
              animate={treasureState === 'opend' ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
              className="flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center relative">
                <img src={treasureImg} alt="treasure" className="w-full h-full object-contain"
                  style={{ filter: treasureState === 'opend' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
                {treasureState === 'opend' && (
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.5), transparent 70%)' }}
                  />
                )}
              </div>
              <span className="text-[7px] md:text-[9px] font-black text-yellow-400 leading-none"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>صندوق</span>
            </motion.div>

            {/* ⚡ الطاقة */}
            <FloatingIconButton 
              label="طاقة" 
              color="#4CC9F0" 
              isMobile={isMobile} 
              disabled
              iconSrc="/treasuer/energy.png"
              iconAlt="energy"
            />

            {/* 💡 التلميح */}
            <FloatingIconButton 
              onClick={onHint} 
              label="تلميح" 
              color="#FFD700" 
              isMobile={isMobile} 
              badge={stats.hints} 
              disabled={stats.hints === 0}
              iconSrc="/treasuer/HINT.svg"
              iconAlt="hint"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 🆕 FloatingIconButton - زي صندوق الكنز (بدون إطار)
function FloatingIconButton({ label, color, isMobile, onClick, badge, disabled, iconSrc, iconAlt }: {
  label: string;
  color: string;
  isMobile: boolean;
  onClick?: () => void;
  badge?: number;
  disabled?: boolean;
  iconSrc: string;
  iconAlt: string;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.1, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.92 } : {}}
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-0.5 disabled:opacity-70"
    >
      <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center">
        <img src={iconSrc} alt={iconAlt} 
          className="w-full h-full object-contain"
          style={{ 
            filter: `drop-shadow(0 2px 8px ${color}aa) drop-shadow(0 0 4px ${color}66)`,
          }} />
        {badge !== undefined && badge > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black text-white border"
            style={{ 
              background: '#FF4D6D', 
              borderColor: 'rgba(15,10,45,0.95)', 
              boxShadow: '0 2px 6px rgba(255,77,109,0.6)' 
            }}>
            {badge}
          </div>
        )}
      </div>
      <span className="text-[7px] md:text-[9px] font-black leading-none" 
        style={{ 
          color: color,
          textShadow: `0 1px 3px rgba(0,0,0,0.8)`,
        }}>
        {label}
      </span>
    </motion.button>
  );
}

function GlassCard({ children, className = '', accentColor = '#9D4EDD', isMobile = false, style, useBgImage = false }: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  isMobile?: boolean;
  style?: React.CSSProperties;
  useBgImage?: boolean;
}) {
  if (isMobile) {
    return (
      <div className={`relative rounded-[1.5rem] overflow-hidden ${className}`}
        style={{
          background: 'rgba(20,15,55,0.45)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${accentColor}33, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)`,
          ...(style || {}),
        }}>
        {useBgImage && (
          <>
            <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
              style={{
                backgroundImage: `url('/card-image/card-mob.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5,
              }} />
            <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
              style={{
                background: `linear-gradient(180deg, rgba(20,15,55,0.65) 0%, rgba(15,10,45,0.75) 100%)`,
              }} />
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
        background: 'linear-gradient(180deg, rgba(30,20,80,0.95) 0%, rgba(20,15,60,0.98) 100%)',
        border: `2px solid ${accentColor}66`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}44, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)`,
        ...(style || {}),
      }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}33, transparent 60%)` }} />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

function LetterBox({ letterData, size, useBgImage = false }: { letterData: Letter; size: number; useBgImage?: boolean }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative rounded-[1.5rem] flex items-center justify-center select-none flex-shrink-0 overflow-hidden"
      style={{
        width: size, height: size,
        background: 'linear-gradient(145deg, rgba(35,25,85,0.9), rgba(20,15,55,0.95))',
        border: `2px solid ${letterData.color}99`,
        boxShadow: `0 10px 30px ${letterData.color}77, inset 0 1px 0 ${letterData.color}66`,
      }}>
      {useBgImage && (
        <>
          <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
            style={{
              backgroundImage: `url('/card-image/card-mob.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4,
            }} />
          <div className="absolute inset-0 pointer-events-none rounded-[1.5rem]"
            style={{
              background: `linear-gradient(135deg, ${letterData.gradient[0]}55, ${letterData.gradient[1]}66)`,
            }} />
        </>
      )}
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

function CircularSoundButton({ onClick, color, size = 48 }: { onClick: () => void; color: string; size?: number; }) {
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
        background: `linear-gradient(135deg, #9D4EDD, #7209B7)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(157,78,221,0.6), 0 0 25px rgba(157,78,221,0.4)`,
      }}>
      {isPlaying && [0, 0.2, 0.4].map((delay, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: '#9D4EDD' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }} />
      ))}
      <Volume2 size={size * 0.4} className="text-white" />
    </motion.button>
  );
}

function LetterChoiceMobile({ letterData, onCorrect, onWrong }: {
  letterData: Letter;
  onCorrect: (clientX: number, clientY: number) => void;
  onWrong: () => void;
}) {
  const [choices, setChoices] = useState<string[]>([]);
  const [hiddenLetters, setHiddenLetters] = useState<Set<string>>(new Set());
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct'>('idle');
  const [flyingLetter, setFlyingLetter] = useState<{
    letter: string;
    fromRect: DOMRect;
    toRect: DOMRect;
  } | null>(null);
  
  const targetBoxRef = useRef<HTMLDivElement>(null);
  const choiceRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const darkColor = useMemo(() => getDarkColor(letterData.color), [letterData.color]);

  useEffect(() => {
    setChoices(generateLetterChoices(letterData.letter, 3));
    setHiddenLetters(new Set());
    setWrongLetter(null);
    setStatus('idle');
    setFlyingLetter(null);
  }, [letterData.letter]);

  const handleChoice = (choice: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (status === 'correct' || hiddenLetters.has(choice)) return;

    if (choice === letterData.letter) {
      const buttonEl = choiceRefs.current[choice];
      const targetEl = targetBoxRef.current;
      
      if (buttonEl && targetEl) {
        const fromRect = buttonEl.getBoundingClientRect();
        const toRect = targetEl.getBoundingClientRect();
        
        setFlyingLetter({ letter: choice, fromRect, toRect });
        setHiddenLetters(prev => new Set(prev).add(choice));
        
        setTimeout(() => {
          setStatus('correct');
          onCorrect(e.clientX, e.clientY);
        }, 700);
      }
    } else {
      setWrongLetter(choice);
      playBuzzSound();
      onWrong();
      setTimeout(() => setWrongLetter(null), 600);
    }
  };

  return (
    <>
      <AnimatePresence>
        {flyingLetter && (
          <motion.div
            className="fixed pointer-events-none z-[100] flex items-center justify-center rounded-2xl"
            initial={{
              left: flyingLetter.fromRect.left,
              top: flyingLetter.fromRect.top,
              width: flyingLetter.fromRect.width,
              height: flyingLetter.fromRect.height,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              left: flyingLetter.toRect.left,
              top: flyingLetter.toRect.top,
              width: flyingLetter.toRect.width,
              height: flyingLetter.toRect.height,
              scale: [1, 1.3, 1],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { times: [0, 0.7, 1] },
              scale: { times: [0, 0.5, 1] },
            }}
            style={{
              background: `linear-gradient(145deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
              border: `2px solid rgba(255,255,255,0.6)`,
              boxShadow: `0 8px 30px ${letterData.color}cc, 0 0 40px ${letterData.color}88`,
            }}
          >
            <span className="font-black text-white"
              style={{
                fontSize: '2.5rem',
                lineHeight: 1,
                textShadow: `0 2px 8px rgba(0,0,0,0.5)`,
              }}>
              {flyingLetter.letter}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="w-full max-w-md mx-auto p-3" accentColor={letterData.color} isMobile={true} useBgImage={true}>
        <div className="flex flex-col items-center gap-2.5">
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
              border: `2px solid ${letterData.color}66`, 
              boxShadow: `0 4px 15px ${letterData.color}44` 
            }}>
            <span className="font-black text-xs text-gray-800">استمع جيداً واختر الحرف</span>
          </motion.div>

          <motion.div
            ref={targetBoxRef}
            animate={status === 'correct' ? {
              scale: [1, 1.2, 1.1],
            } : { scale: [1, 1.04, 1] }}
            transition={status === 'correct' ? {
              duration: 0.5,
              times: [0, 0.5, 1],
            } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-[1.2rem] flex items-center justify-center select-none flex-shrink-0 overflow-hidden"
            style={{
              width: 85, height: 85,
              background: 'linear-gradient(145deg, rgba(35,25,85,0.9), rgba(20,15,55,0.95))',
              border: `2px solid ${letterData.color}99`,
              boxShadow: status === 'correct' 
                ? `0 10px 35px ${letterData.color}, 0 0 50px ${letterData.color}aa, inset 0 1px 0 ${letterData.color}` 
                : `0 8px 25px ${letterData.color}77, inset 0 1px 0 ${letterData.color}66`,
            }}>
            <div className="absolute inset-0 pointer-events-none rounded-[1.2rem]"
              style={{
                backgroundImage: `url('/card-image/card-mob.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4,
              }} />
            <div className="absolute inset-0 pointer-events-none rounded-[1.2rem]"
              style={{
                background: `linear-gradient(135deg, ${letterData.gradient[0]}55, ${letterData.gradient[1]}66)`,
              }} />
            <span className="font-black relative z-10"
              style={{
                fontSize: '3.5rem',
                background: `linear-gradient(180deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: `drop-shadow(0 3px 12px ${letterData.color}cc)`, 
                lineHeight: 1,
              }}>
              {letterData.letter}
            </span>

            {status === 'correct' && (
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[0, 60, 120, 180, 240, 300].map(angle => (
                  <motion.div
                    key={angle}
                    className="absolute"
                    style={{
                      top: '50%', left: '50%',
                      width: 8, height: 8,
                      background: '#FFD700',
                      borderRadius: '50%',
                      boxShadow: '0 0 15px #FFD700',
                      transformOrigin: '0 0',
                    }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle * Math.PI / 180) * 60,
                      y: Math.sin(angle * Math.PI / 180) * 60,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.8 }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          <CircularSoundButton onClick={() => speakLetter(letterData.letter)} color={letterData.color} size={40} />

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
                      ref={el => { choiceRefs.current[choice] = el; }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isWrong ? { 
                        x: [-8, 8, -8, 8, 0],
                        scale: 1,
                        opacity: 1,
                      } : { 
                        scale: 1, 
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={isWrong 
                        ? { duration: 0.4 }
                        : { delay: idx * 0.1, type: 'spring', stiffness: 300 }
                      }
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleChoice(choice, e)}
                      disabled={status === 'correct' || isWrong || flyingLetter !== null}
                      className="relative rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2"
                      style={{
                        width: 55, height: 55,
                        background: isWrong 
                          ? 'linear-gradient(145deg, #FF4444, #CC0000)' 
                          : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.95))',
                        borderColor: isWrong ? '#FF4444' : `${letterData.color}aa`,
                        boxShadow: isWrong 
                          ? '0 5px 18px rgba(255,68,68,0.6)' 
                          : `0 5px 18px ${letterData.color}55`,
                      }}
                    >
                      <span className="font-black"
                        style={{
                          fontSize: '2rem',
                          lineHeight: 1,
                          color: isWrong ? 'white' : darkColor,
                          textShadow: isWrong ? '0 2px 6px rgba(0,0,0,0.4)' : 'none',
                        }}
                      >
                        {choice}
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
                style={{ 
                  background: 'rgba(88,204,2,0.3)', 
                  color: '#58CC02', 
                  border: '1.5px solid #58CC0288' 
                }}>
                <Check size={12} /> ممتاز!
              </motion.div>
            )}
            {wrongLetter && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 font-black text-xs py-1 px-3 rounded-xl"
                style={{ 
                  background: 'rgba(255,68,68,0.3)', 
                  color: '#FF6B6B', 
                  border: '1.5px solid #FF444488' 
                }}>
                <X size={12} /> جرب تاني
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </>
  );
}

function WordBuilderMobile({ letterData, onComplete, onWrong }: {
  letterData: Letter;
  onComplete: (clientX: number, clientY: number) => void;
  onWrong: () => void;
}) {
  const word = letterData.word;
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [flyingLetter, setFlyingLetter] = useState<{
    letter: string;
    fromRect: DOMRect;
    toRect: DOMRect;
    targetIdx: number;
  } | null>(null);
  
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const darkColor = useMemo(() => getDarkColor(letterData.color), [letterData.color]);

  useEffect(() => {
    setShuffledLetters(shuffleWordLetters(word));
    setPlacedIndices([]);
    setWrongShake(null);
    setIsComplete(false);
    setFlyingLetter(null);
  }, [word]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (isComplete || placedIndices.includes(idx) || flyingLetter !== null) return;

    const nextExpectedLetter = word[placedIndices.length];
    
    if (letter === nextExpectedLetter) {
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
              background: `linear-gradient(145deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
              border: `2px solid rgba(255,255,255,0.6)`,
              boxShadow: `0 6px 25px ${letterData.color}cc`,
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

      <GlassCard className="w-full max-w-md mx-auto p-3" accentColor={letterData.color} isMobile={true} useBgImage={true}>
        <div className="flex flex-col items-center gap-2">
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1.5 rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', 
              border: `2px solid ${letterData.color}66`, 
              boxShadow: `0 4px 15px ${letterData.color}44` 
            }}>
            <span className="font-black text-xs text-gray-800">استمع للكلمة ورتب الحروف</span>
          </motion.div>

          {/* 🆕 الإيموجي مع fallback لصورة مخصصة */}
          <motion.div 
            animate={{ y: [0, -3, 0] }} 
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-2xl flex items-center justify-center border-2 flex-shrink-0 relative overflow-hidden"
            style={{ 
              width: 70, height: 70,
              background: `linear-gradient(145deg, ${letterData.gradient[0]}44, ${letterData.gradient[1]}33)`, 
              borderColor: `${letterData.color}77`, 
              boxShadow: `0 6px 18px ${letterData.color}66` 
            }}>
            <EmojiOrIcon 
              word={letterData.word}
              emoji={letterData.emoji}
              size={56}
              color={letterData.color}
            />
          </motion.div>

          <div className="text-center">
            <div className="font-bold text-xs" 
              style={{ color: letterData.color, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
              {letterData.wordAr}
            </div>
          </div>

          <CircularSoundButton onClick={() => speakWord(word)} color={letterData.color} size={38} />

          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {word.split('').map((letter, idx) => {
              const isFilled = idx < placedIndices.length;
              return (
                <motion.div
                  ref={el => { slotRefs.current[idx] = el; }}
                  key={`slot-${idx}`}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isFilled ? [0.8, 1.15, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden"
                  style={{
                    width: 38, height: 44,
                    background: isFilled 
                      ? `linear-gradient(145deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})` 
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isFilled ? letterData.color : `${letterData.color}55`,
                    borderStyle: isFilled ? 'solid' : 'dashed',
                    boxShadow: isFilled ? `0 4px 12px ${letterData.color}aa` : 'none',
                  }}
                >
                  {!isFilled && (
                    <span className="font-black absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{
                        fontSize: '1.4rem',
                        lineHeight: 1,
                        color: letterData.color,
                        opacity: 0.25,
                        textShadow: 'none',
                      }}
                    >
                      {letter}
                    </span>
                  )}
                  
                  {isFilled && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="font-black text-white relative z-10"
                      style={{
                        fontSize: '1.5rem',
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

          <div className="flex items-center justify-center gap-2 flex-wrap mt-1" dir="ltr">
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
                        scale: 1,
                        opacity: 1,
                        background: 'linear-gradient(145deg, #FF4444, #CC0000)',
                      } : { 
                        scale: 1, 
                        opacity: 1,
                      }}
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
                        width: 42, height: 42,
                        background: isShaking 
                          ? 'linear-gradient(145deg, #FF4444, #CC0000)' 
                          : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.95))',
                        borderColor: isShaking ? '#FF4444' : `${letterData.color}aa`,
                        boxShadow: isShaking 
                          ? '0 4px 15px rgba(255,68,68,0.6)' 
                          : `0 4px 14px ${letterData.color}55`,
                      }}
                    >
                      <span className="font-black"
                        style={{
                          fontSize: '1.5rem',
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

function LearnLetterDesktop({ letterData, input, status, onChange, onCheck, inputRef }: {
  letterData: Letter; input: string; status: 'idle' | 'correct' | 'wrong';
  onChange: (v: string) => void; onCheck: (e?: React.MouseEvent) => void; inputRef: InputRefType;
}) {
  return (
    <div className="flex items-stretch justify-center gap-5 w-full max-w-4xl mx-auto">
      <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color} isMobile={false}>
        <div className="flex flex-col items-center gap-3 h-full justify-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="px-5 py-2 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', border: `2px solid ${letterData.color}66`, boxShadow: `0 4px 15px ${letterData.color}44` }}>
            <span className="font-black text-sm text-gray-800">استمع جيداً وأكتب الحرف</span>
          </motion.div>
          <LetterBox letterData={letterData} size={140} />
          <CircularSoundButton onClick={() => speakLetter(letterData.letter)} color={letterData.color} size={48} />
        </div>
      </GlassCard>

      <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color} isMobile={false}>
        <div className="flex flex-col items-center gap-4 h-full justify-center">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-lg">اكتب الحرف</span>
            <span className="text-xl">✏️</span>
          </div>
          <div className="w-full max-w-[280px]">
            <GhostInput ref={inputRef} value={input} onChange={v => onChange(v)} onEnter={onCheck}
              ghostText={letterData.letter} color={letterData.color} status={status} fontSize="2.2rem" maxLength={1} uppercase />
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
            className="w-full max-w-[280px] py-3 rounded-2xl font-black text-lg text-white disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #58CC02, #4AA802)', boxShadow: '0 6px 20px rgba(88,204,2,0.5)', borderBottom: '4px solid #3A8602' }}>
            تحقق <Check size={20} />
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );
}

function LearnLetterPhase({ letterData, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  letterData: Letter; onDone: () => void; onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void; onCorrect: (clientX: number, clientY: number) => void; isMobile: boolean;
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

  const handleMobileCorrect = (cx: number, cy: number) => {
    speakLetter(letterData.letter);
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
    if (input.trim().toUpperCase() === letterData.letter.toUpperCase()) {
      setStatus('correct'); speakLetter(letterData.letter); playCoinSound();
      onCombo(); onKarlReact('happy');
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
        transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="w-full">
        {isMobile ? (
          <LetterChoiceMobile 
            letterData={letterData} 
            onCorrect={handleMobileCorrect}
            onWrong={handleMobileWrong}
          />
        ) : (
          <LearnLetterDesktop letterData={letterData} input={input} status={status} onChange={handleChange} onCheck={handleCheck} inputRef={inputRef} />
        )}
      </motion.div>
    </>
  );
}

function LearnWordPhase({ letterData, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  letterData: Letter; onDone: () => void; onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void; onCorrect: (clientX: number, clientY: number) => void; isMobile: boolean;
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
    if (compareWords(input, letterData.word)) {
      setStatus('correct'); speakWord(letterData.word); playCoinSound();
      onCombo(); onKarlReact('happy');
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
        transition={{ type: 'spring', stiffness: 300, damping: 28 }} className="w-full">
        
        {isMobile ? (
          <WordBuilderMobile 
            letterData={letterData}
            onComplete={handleMobileComplete}
            onWrong={handleMobileWrong}
          />
        ) : (
          <div className="flex items-stretch justify-center gap-5 w-full max-w-4xl mx-auto">
            <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color} isMobile={false}>
              <div className="flex flex-col items-center gap-3 h-full justify-center">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="px-5 py-2 rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))', border: `2px solid ${letterData.color}66`, boxShadow: `0 4px 15px ${letterData.color}44` }}>
                  <span className="font-black text-sm text-gray-800">استمع للكلمة واكتبها</span>
                </motion.div>
                
                {/* 🆕 الإيموجي مع fallback للديسكتوب */}
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-2xl flex items-center justify-center border-2 flex-shrink-0"
                  style={{ width: 110, height: 110, background: `linear-gradient(145deg, ${letterData.gradient[0]}44, ${letterData.gradient[1]}33)`, borderColor: `${letterData.color}77`, boxShadow: `0 8px 20px ${letterData.color}66` }}>
                  <EmojiOrIcon 
                    word={letterData.word}
                    emoji={letterData.emoji}
                    size={85}
                    color={letterData.color}
                  />
                </motion.div>
                
                <div className="text-center">
                  <div className="font-black text-2xl text-white" style={{ textShadow: `0 0 20px ${letterData.color}aa, 0 2px 6px rgba(0,0,0,0.6)` }}>{letterData.word}</div>
                  <div className="font-bold text-sm mt-0.5" style={{ color: letterData.color, textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>{letterData.wordAr}</div>
                </div>
                <CircularSoundButton onClick={() => speakWord(letterData.word)} color={letterData.color} size={48} />
              </div>
            </GlassCard>

            <GlassCard className="flex-1 max-w-sm p-5" accentColor={letterData.color} isMobile={false}>
              <div className="flex flex-col items-center gap-3 h-full justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-lg">اكتب الكلمة</span>
                  <span className="text-xl">✏️</span>
                </div>
                <div className="w-full max-w-[280px] space-y-2">
                  <GhostInput ref={inputRef} value={input} onChange={handleChange} onEnter={handleCheck}
                    ghostText={letterData.word} color={letterData.color} status={status} fontSize="1.3rem" />
                  {requiredChars.length > 0 && (<SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={letterData.color} />)}
                </div>
                <AnimatePresence>
                  {status !== 'idle' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 font-black text-xs py-1.5 px-4 rounded-xl"
                      style={{ background: status === 'correct' ? 'rgba(88,204,2,0.3)' : 'rgba(255,68,68,0.3)', color: status === 'correct' ? '#58CC02' : '#FF6B6B', border: `1.5px solid ${status === 'correct' ? '#58CC0288' : '#FF444488'}` }}>
                      {status === 'correct' ? <><Check size={14} /> ممتاز!</> : <><X size={14} /> جرب تاني</>}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCheck} disabled={!input}
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

type DebugLetterShapes = Record<string, Polygon[]>;

function DebugBrushTool({ isMobile }: { isMobile: boolean }) {
  const harborImage = useMemo(() => getHarborImage(isMobile), [isMobile]);
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [shapes, setShapes] = useState<DebugLetterShapes>({});
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const existing = getHarborObjects(isMobile);
    const loaded: DebugLetterShapes = {};
    Object.entries(existing).forEach(([letter, arr]) => {
      const polygons: Polygon[] = [];
      arr.forEach((shape: any) => { if (Array.isArray(shape)) polygons.push(shape); });
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
    const aspectRatio = harborImage.width / harborImage.height;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const px = x + Math.cos(angle) * brushSize;
      const py = y + Math.sin(angle) * brushSize * aspectRatio;
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
    const steps = Math.max(1, Math.ceil(dist / (brushSize * 0.4)));
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
    const rounded = hull.map(n => parseFloat(n.toFixed(2)));
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
    const varName = isMobile ? 'HARBOR_OBJECTS_MOBILE' : 'HARBOR_OBJECTS_DESKTOP';
    let code = `export const ${varName}: Record<string, Polygon[]> = {\n`;
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
      try { document.execCommand('copy'); alert('✅ اتنسخ!'); } catch { alert('⚠️ شوف الـ Console'); console.log(code); }
      document.body.removeChild(ta);
    });
  };

  const currentShapes = shapes[selectedLetter] || [];
  const currentLetterData = LETTERS.find(l => l.letter === selectedLetter);
  const totalShapes = Object.values(shapes).reduce((sum, arr) => sum + arr.length, 0);

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[100] bg-black text-white overflow-y-auto" style={{ touchAction: 'pan-y' }}>
        <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/95 to-black/80 p-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xs font-black text-yellow-400">🎨 Brush - Mobile</h1>
            <button onClick={() => window.location.href = window.location.pathname} className="text-xs bg-red-500/30 border border-red-500 px-3 py-1 rounded-lg font-bold">خروج ✕</button>
          </div>
          <div className="grid grid-cols-9 gap-1">
            {LETTERS.map(l => {
              const count = (shapes[l.letter] || []).length;
              const isActive = l.letter === selectedLetter;
              return (
                <button key={l.letter} onClick={() => setSelectedLetter(l.letter)}
                  className="relative aspect-square rounded font-black text-xs border transition-all"
                  style={{ background: isActive ? l.color : count > 0 ? `${l.color}55` : 'rgba(255,255,255,0.05)', borderColor: isActive ? 'white' : count > 0 ? l.color : 'rgba(255,255,255,0.1)', color: isActive || count > 0 ? 'white' : 'rgba(255,255,255,0.4)' }}>
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
            <span className="text-[10px] font-bold text-white/70">حجم:</span>
            <input type="range" min="1" max="8" step="0.5" value={brushSize} onChange={e => setBrushSize(parseFloat(e.target.value))} className="flex-1" />
            <span className="text-[10px] font-black text-yellow-400 w-8 text-center">{brushSize}</span>
            <button onClick={() => setShowAll(s => !s)} className="bg-blue-500/30 border border-blue-500 px-2 py-1 rounded text-[10px] font-bold">{showAll ? '👁 الكل' : '👁 الحالي'}</button>
          </div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex" style={{ touchAction: 'none' }}>
      <div className="flex flex-col bg-zinc-900 border-r border-white/10" style={{ width: '280px', height: '100vh' }}>
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-sm font-black text-yellow-400">🎨 Brush - Desktop</h1>
          <button onClick={() => window.location.href = window.location.pathname} className="text-xs bg-red-500/30 border border-red-500 px-2 py-1 rounded font-bold">✕</button>
        </div>
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-2xl flex-shrink-0" style={{ background: currentLetterData?.color }}>
              {selectedLetter}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">{currentLetterData?.word}</div>
              <div className="text-xs text-white/60 truncate">{currentLetterData?.wordAr}</div>
              <div className="text-[10px] text-green-400 font-bold mt-0.5">{currentShapes.length} شكل</div>
            </div>
          </div>
        </div>
        <div className="p-3 border-b border-white/10 space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white/70">حجم الفرشاة</span>
              <span className="text-xs font-black text-yellow-400">{brushSize}</span>
            </div>
            <input type="range" min="1" max="10" step="0.5" value={brushSize} onChange={e => setBrushSize(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={undoLastShape} disabled={currentShapes.length === 0} className="bg-yellow-500/20 border border-yellow-500 px-2 py-1.5 rounded text-xs font-bold disabled:opacity-30 hover:bg-yellow-500/30">
              ↶ تراجع
            </button>
            <button onClick={clearLetter} disabled={currentShapes.length === 0} className="bg-red-500/20 border border-red-500 px-2 py-1.5 rounded text-xs font-bold disabled:opacity-30 hover:bg-red-500/30 flex items-center justify-center gap-1">
              <Trash2 size={11} /> مسح
            </button>
          </div>
          <button onClick={() => setShowAll(s => !s)} className="w-full bg-blue-500/20 border border-blue-500 px-2 py-1.5 rounded text-xs font-bold hover:bg-blue-500/30">
            {showAll ? '👁 إخفاء الباقي' : '👁 إظهار الكل'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] font-bold text-white/50 mb-2">اختر الحرف:</div>
          <div className="grid grid-cols-5 gap-1">
            {LETTERS.map(l => {
              const count = (shapes[l.letter] || []).length;
              const isActive = l.letter === selectedLetter;
              return (
                <button key={l.letter} onClick={() => setSelectedLetter(l.letter)}
                  className="relative aspect-square rounded font-black text-xs border transition-all hover:scale-105"
                  style={{ background: isActive ? l.color : count > 0 ? `${l.color}55` : 'rgba(255,255,255,0.05)', borderColor: isActive ? 'white' : count > 0 ? l.color : 'rgba(255,255,255,0.1)', color: isActive || count > 0 ? 'white' : 'rgba(255,255,255,0.4)' }}>
                  {l.letter}
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={exportCode} className="w-full py-2.5 rounded-lg font-black text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 transition-all">
            <Copy size={14} /> نسخ الكود
          </button>
          <div className="text-[10px] text-white/50 text-center">
            {selectedLetter}: {currentShapes.length} • المجموع: {totalShapes}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden" style={{ height: '100vh' }}>
        <div ref={containerRef} className="relative select-none"
          style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', maxWidth: '100%', maxHeight: '100%', aspectRatio: `${harborImage.width} / ${harborImage.height}`, width: 'auto', height: '100%', cursor: 'crosshair', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', borderRadius: '8px', overflow: 'hidden' }}
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
    </div>
  );
}

function HarborTest({ groupLetters, onPass, onFail, onKarlReact, onCombo, onCorrect, isMobile }: any) {
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
      playCoinSound(); onCombo(); onKarlReact('happy'); onCorrect(e.clientX, e.clientY);
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
      setTimeout(() => { setShowFeedback(null); if (newWrong >= 5) onFail(); }, 700);
    }
  }, [showFeedback, finished, shapes, currentLetter, currentIdx, groupLetters.length, wrong, onCombo, onKarlReact, onPass, onFail, onCorrect]);

  if (!currentLetter) return null;

  const InfoCardMobile = () => (
    <div className="w-full rounded-lg overflow-hidden relative flex-shrink-0"
      style={{
        background: 'rgba(15,10,45,0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${currentLetter.color}66`,
        boxShadow: `0 3px 12px rgba(0,0,0,0.5), 0 0 15px ${currentLetter.color}44`,
        marginTop: '-3px',
      }}>
      
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, ${currentLetter.color}33, transparent 70%)` }} />

      <div className="relative z-10 px-1.5 py-0.5">
        <div className="flex items-center justify-center gap-1 mb-0.5">
          <Search size={7} style={{ color: currentLetter.color, filter: `drop-shadow(0 0 2px ${currentLetter.color})` }} />
          <span className="font-black text-[8px] text-white" 
            style={{ textShadow: `0 0 4px ${currentLetter.color}, 0 1px 1px rgba(0,0,0,0.7)` }}>
            ابحث عن حرف {currentLetter.letter}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => speakWord(currentLetter.word)}
            className="relative rounded-full flex items-center justify-center border flex-shrink-0"
            style={{
              width: 24, height: 24,
              background: `linear-gradient(135deg, ${currentLetter.color}, ${currentLetter.gradient[1]})`,
              borderColor: 'rgba(255,255,255,0.5)',
              boxShadow: `0 2px 6px ${currentLetter.color}aa`,
            }}>
            <Volume2 size={10} className="text-white" />
          </motion.button>

          <div className="flex-1 text-center min-w-0">
            <div className="font-black text-[11px] text-white leading-tight truncate"
              style={{ textShadow: `0 0 6px ${currentLetter.color}cc, 0 1px 2px rgba(0,0,0,0.8)` }}>
              {currentLetter.word}
            </div>
            <div className="font-bold text-[7px] truncate leading-tight"
              style={{ color: currentLetter.color, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
              {currentLetter.wordAr}
            </div>
          </div>

          {/* 🆕 الإيموجي مع fallback في الـ InfoCard */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded flex items-center justify-center flex-shrink-0"
            style={{
              width: 26, height: 26,
              background: `linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
              border: `1px solid ${currentLetter.color}77`,
              boxShadow: `0 2px 5px ${currentLetter.color}44`,
            }}>
            <EmojiOrIcon 
              word={currentLetter.word}
              emoji={currentLetter.emoji}
              size={18}
              color={currentLetter.color}
            />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              width: 28, height: 28,
              background: `linear-gradient(145deg, ${currentLetter.gradient[0]}, ${currentLetter.gradient[1]})`,
              border: `1px solid rgba(255,255,255,0.5)`,
              boxShadow: `0 2px 8px ${currentLetter.color}aa, inset 0 1px 0 rgba(255,255,255,0.35)`,
            }}>
            <span className="font-black text-white"
              style={{
                fontSize: '1.15rem', lineHeight: 1,
                textShadow: `0 1px 4px rgba(0,0,0,0.5)`,
              }}>
              {currentLetter.letter}
            </span>
          </motion.div>
        </div>

        {wrong > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-1 mt-0.5 px-1.5 py-0 rounded-full mx-auto w-fit"
            style={{ 
              background: 'rgba(255,68,68,0.3)', 
              border: '1px solid rgba(255,68,68,0.5)',
            }}>
            <span className="text-[7px] font-black text-red-200">{wrong}/5 محاولات</span>
          </motion.div>
        )}
      </div>
    </div>
  );

  const InfoCardDesktop = () => (
    <GlassCard className="p-3 w-full h-full flex flex-col" accentColor={currentLetter.color} isMobile={false}>
      <div className="flex flex-col items-center justify-around h-full gap-2">
        
        <motion.div 
          initial={{ opacity: 0, y: -8 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full w-full"
          style={{
            background: `linear-gradient(135deg, ${currentLetter.color}44, ${currentLetter.color}11)`,
            border: `1.5px solid ${currentLetter.color}88`,
            boxShadow: `0 4px 15px ${currentLetter.color}55, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}>
          <Search size={13} style={{ color: currentLetter.color, filter: `drop-shadow(0 0 4px ${currentLetter.color})` }} />
          <span className="font-black text-xs text-white" 
            style={{ textShadow: `0 0 10px ${currentLetter.color}, 0 2px 4px rgba(0,0,0,0.5)` }}>
            ابحث عن حرف {currentLetter.letter}
          </span>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            width: 85, height: 85,
            background: `linear-gradient(145deg, ${currentLetter.gradient[0]}, ${currentLetter.gradient[1]})`,
            border: `2.5px solid rgba(255,255,255,0.45)`,
            boxShadow: `0 10px 30px ${currentLetter.color}99, 0 0 40px ${currentLetter.color}55, inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.25)`,
          }}>
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)`,
            }} />
          <span className="font-black text-white relative"
            style={{
              fontSize: '3.5rem', lineHeight: 1,
              textShadow: `0 4px 15px rgba(0,0,0,0.6), 0 0 25px rgba(255,255,255,0.3)`,
            }}>
            {currentLetter.letter}
          </span>
          <motion.div
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1.5 -right-1.5 text-yellow-300 text-base"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,1))' }}>
            ✨
          </motion.div>
        </motion.div>

        {/* 🆕 الإيموجي مع fallback */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            width: 62, height: 62,
            background: `linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))`,
            border: `2px solid ${currentLetter.color}77`,
            boxShadow: `0 6px 20px ${currentLetter.color}66, inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)`,
          }}>
          <EmojiOrIcon 
            word={currentLetter.word}
            emoji={currentLetter.emoji}
            size={48}
            color={currentLetter.color}
          />
        </motion.div>

        <div className="text-center px-1">
          <div className="font-black text-xl text-white leading-tight tracking-wide"
            style={{ textShadow: `0 0 18px ${currentLetter.color}dd, 0 2px 8px rgba(0,0,0,0.7)` }}>
            {currentLetter.word}
          </div>
          <div className="font-bold text-xs mt-0.5"
            style={{ color: currentLetter.color, textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
            {currentLetter.wordAr}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.12, rotate: 5 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => speakWord(currentLetter.word)}
          className="relative rounded-full flex items-center justify-center border-2 flex-shrink-0"
          style={{
            width: 48, height: 48,
            background: `linear-gradient(135deg, ${currentLetter.color}, ${currentLetter.gradient[1]})`,
            borderColor: 'rgba(255,255,255,0.55)',
            boxShadow: `0 6px 20px ${currentLetter.color}cc, 0 0 30px ${currentLetter.color}77, inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.2)`,
          }}>
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)`,
            }} />
          <Volume2 size={20} className="text-white relative" 
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </motion.button>

        {wrong > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,68,68,0.25), rgba(255,68,68,0.1))', 
              border: '1.5px solid rgba(255,68,68,0.5)',
              boxShadow: '0 3px 10px rgba(255,68,68,0.3)',
            }}>
            <span className="text-[10px] font-black text-red-300">{wrong}/5 محاولات</span>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );

  const ImageCard = () => (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        boxShadow: `0 4px 18px rgba(0,0,0,0.6)`,
        aspectRatio: `${harborImage.width} / ${harborImage.height}`,
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: '100%',
      }}
      onClick={handleImageClick}>
      
      <img src={harborImage.src} alt="ميناء"
        className="block"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'fill', 
          pointerEvents: 'none',
        }}
        draggable={false} />

      <AnimatePresence>
        {showHint && shapes.length > 0 && (
          <motion.svg key="hint-svg"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100" preserveAspectRatio="none">
            {shapes.map((shape: any, idx: number) => {
              if (Array.isArray(shape))
                return <polygon key={idx} points={polygonToSvgPoints(shape)} fill={currentLetter.color} fillOpacity={0.35} stroke={currentLetter.color} strokeWidth={0.5} />;
              else
                return <rect key={idx} x={shape.x} y={shape.y} width={shape.w} height={shape.h} fill={currentLetter.color} fillOpacity={0.35} stroke={currentLetter.color} strokeWidth={0.5} rx={1} />;
            })}
          </motion.svg>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {clickEffect && (
          <motion.div initial={{ scale: 0.4, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${clickEffect.x}%`, top: `${clickEffect.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '40px', height: '40px',
              background: clickEffect.correct ? 'rgba(88,204,2,0.6)' : 'rgba(255,68,68,0.6)'
            }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback === 'correct' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(88,204,2,0.28), transparent)' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-white text-lg"
              style={{ background: 'rgba(88,204,2,0.92)' }}>
              ✓ {currentLetter.word}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30"
          style={{ background: 'rgba(0,10,20,0.85)' }}>
          <div className="text-6xl">🎉</div>
          <p className="font-black text-white text-2xl">ممتاز!</p>
          <div className="flex gap-1">
            {groupLetters.map((l: any) => <Star key={l.letter} size={20} fill="#FFD700" color="#FFD700" />)}
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full"
      style={{ height: '100%', minHeight: 0 }}
    >
      {isMobile ? (
        <div 
          className="flex flex-col w-full"
          style={{ 
            height: '100%',
            padding: '0 5px',
          }}
        >
          <InfoCardMobile />
          <div style={{ height: '2px', flexShrink: 0 }} />
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <ImageCard />
          </div>
        </div>
      ) : (
        <div className="flex items-stretch justify-center gap-3 w-full max-w-[1500px] mx-auto px-3"
          style={{ height: 'calc(100vh - 175px)' }}>
          
          <div className="flex-shrink-0" style={{ width: '270px' }}>
            <InfoCardDesktop />
          </div>
          
          <div className="flex-1 flex items-center justify-center" style={{ minWidth: 0 }}>
            <ImageCard />
          </div>
        </div>
      )}
    </motion.div>
  );
}

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

  const { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress } = useGameStats();

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

  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const group = LETTER_GROUPS[groupIdx];
  const letterData = group?.letters[letterIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 2 ? 'closed' :
    correctInGroup < 4 ? 'half' :
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

  const handleCorrect = (clientX: number, clientY: number) => {
    addPoints(10);
    incStreak();
    const newCorrect = correctInGroup + 1;
    setCorrectInGroup(newCorrect);
    setTotalStars(t => t + 1);

    setTimeout(() => {
      const starTarget = document.getElementById('star-target');
      if (starTarget) {
        const rect = starTarget.getBoundingClientRect();
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;
        const starId = Date.now() + Math.random();
        setFlyingItems(prev => [...prev, { 
          id: starId, startX: clientX, startY: clientY, 
          endX, endY, type: 'star' 
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
          id: energyId, startX: clientX, startY: clientY, 
          endX, endY, type: 'energy' 
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
  const handleTestPass = () => setPhase('group-success');
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

  const handleHomeClick = () => router.push('/character-and-map?from=lesson');

  if (isDebugMode && !isLoading) return <DebugBrushTool isMobile={isMobile} />;

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
  const activeColor = letterData?.color ?? '#4CC9F0';
  
  const mobilePaddingTop = phase === 'test' ? '62px' : '110px';
  const mobilePaddingBottom = phase === 'test' ? '70px' : '95px';

  return (
    <div className="text-white relative overflow-hidden" 
      style={{ fontFamily: "'Tajawal', sans-serif", height: '100vh', maxHeight: '100vh' }} dir="rtl">
      
      <ScreenBackground isMobile={isMobile} activeColor={activeColor} phase={phase} />

      <div style={{ 
        transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', 
        transformOrigin: 'bottom right', 
        position: 'fixed', bottom: isMobile ? 110 : 130, right: 0, zIndex: 25, pointerEvents: 'none' 
      }}>
        <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#4CC9F0" />
      </div>

      <FlyingItems items={flyingItems} />

      <TopHUD 
        stats={stats} level={stats.level} 
        currentStep={letterIdx} totalSteps={totalStepsInGroup}
        onHome={handleHomeClick} isMobile={isMobile}
      />

      <div className="flex flex-col items-center justify-center relative px-3 md:px-6"
        style={{ 
          zIndex: 10, height: '100vh',
          paddingTop: isMobile ? mobilePaddingTop : '80px',
          paddingBottom: isMobile ? mobilePaddingBottom : '95px',
        }}>
        <div className="w-full flex items-center justify-center" style={{ height: '100%' }}>
          <AnimatePresence mode="wait">
            {phase === 'learn-letter' && (
              <LearnLetterPhase key={`ll-${groupIdx}-${letterIdx}`} letterData={letterData}
                onDone={handleLetterDone} onKarlReact={handleKarlReact} onCombo={handleCombo}
                onCorrect={handleCorrect} isMobile={isMobile} />
            )}
            {phase === 'learn-word' && (
              <LearnWordPhase key={`lw-${groupIdx}-${letterIdx}`} letterData={letterData}
                onDone={handleWordDone} onKarlReact={handleKarlReact} onCombo={handleCombo}
                onCorrect={handleCorrect} isMobile={isMobile} />
            )}
            {phase === 'test' && (
              <HarborTest groupLetters={group.letters} onPass={handleTestPass} onFail={handleTestFail}
                onKarlReact={handleKarlReact} onCombo={handleCombo}
                onCorrect={handleCorrect} isMobile={isMobile} />
            )}
            {phase === 'group-success' && <SuccessScreen key="success" groupTitle={group.title} onNext={handleGroupNext} />}
            {phase === 'group-fail' && <FailScreen key="fail" onRetry={handleRetry} />}
            {phase === 'all-done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-center py-6 max-w-md mx-auto px-4">
                <div className="text-6xl md:text-7xl">🎓</div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
                    خلصت ليفل 1 للبيجنرز في الألماني! 🇩🇪
                  </h2>
                  <p className="font-bold text-sm md:text-base text-[#4CC9F0]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                    تعلمت كل الحروف وفتحت ميناء هامبورغ ⚓
                  </p>
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
        <BottomHUD stats={stats} treasureState={treasureState}
          onHint={useHint} onMap={handleHomeClick} isMobile={isMobile} />
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
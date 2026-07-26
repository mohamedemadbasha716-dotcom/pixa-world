'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, Star, Check, X, Trophy, RotateCcw, 
  Sparkles, Home, Flame, Gem, Mic, SkipForward
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';

// 🎯 المكونات المشتركة
import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';
import GrammarMiniPhase from '@/app/components/lesson/GrammarMiniPhase';

// 🎯 الأنواع والرسائل المشتركة
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

// 🎯 الأصوات والنطق المشتركة
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakWord } from '@/lib/audio/speech';

// 📦 البيانات
import { FOREST_SECTIONS, type ForestSection, type ForestWord } from '@/data/german/forest';

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════
type Box = { x: number; y: number; w: number; h: number };
type Phase = 'learn' | 'speak' | 'test' | 'grammar' | 'section-success' | 'section-fail' | 'all-done';
type FlyingItem = { 
  id: number; startX: number; startY: number; endX: number; endY: number;
  type: 'star' | 'energy' | 'gem';
};

// 🎤 Speech Recognition Types
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
// 🎯 Boxes للبحث في الصورة
// ═══════════════════════════════════════
const FOREST_OBJECTS: Record<string, Box[]> = {
  Eule:           [{ x: 2.0,  y: 6.0,  w: 12.0, h: 22.0 }],
  Reh:            [{ x: 10.0, y: 35.0, w: 16.0, h: 32.0 }],
  Wolf:           [{ x: 37.0, y: 40.0, w: 12.0, h: 24.0 }],
  Fuchs:          [{ x: 6.0,  y: 65.0, w: 20.0, h: 24.0 }],
  Igel:           [{ x: 37.0, y: 76.0, w: 9.0,  h: 12.0 }],
  Schmetterling:  [{ x: 47.0, y: 56.0, w: 9.0,  h: 14.0 }],
  Frosch:         [{ x: 54.0, y: 80.0, w: 11.0, h: 14.0 }],
  Hase:           [{ x: 59.0, y: 60.0, w: 10.0, h: 16.0 }],
  Apfel:          [{ x: 14.0, y: 1.0,  w: 11.0, h: 20.0 }],
  Traube:         [{ x: 25.0, y: 1.0,  w: 10.0, h: 18.0 }],
  Kirsche:        [{ x: 36.0, y: 1.0,  w: 8.0,  h: 14.0 }],
  Banane:         [{ x: 47.0, y: 0.0,  w: 11.0, h: 20.0 }],
  Birne:          [{ x: 59.0, y: 1.0,  w: 9.0,  h: 18.0 }],
  Zitrone:        [{ x: 69.0, y: 1.0,  w: 8.0,  h: 16.0 }],
  Orange:         [{ x: 78.0, y: 1.0,  w: 10.0, h: 18.0 }],
  Erdbeere:       [{ x: 8.0,  y: 86.0, w: 16.0, h: 12.0 }],
  Karotte:        [{ x: 65.0, y: 60.0, w: 20.0, h: 14.0 }],
  Tomate:         [{ x: 69.0, y: 70.0, w: 8.0,  h: 12.0 }],
  Kuerbis:        [{ x: 75.0, y: 70.0, w: 14.0, h: 20.0 }],
  Aubergine:      [{ x: 85.0, y: 68.0, w: 9.0,  h: 22.0 }],
  Mais:           [{ x: 91.0, y: 40.0, w: 9.0,  h: 38.0 }],
  Zucchini:       [{ x: 83.0, y: 80.0, w: 13.0, h: 12.0 }],
  Pilz:           [{ x: 0.0,  y: 80.0, w: 14.0, h: 20.0 }],
  Paprika:        [{ x: 91.0, y: 80.0, w: 9.0,  h: 18.0 }],
};

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

function getBoxesForWord(word: string, sectionId: string): Box[] {
  if (sectionId === 'colors') return COLOR_OBJECTS[word] ?? [];
  return FOREST_OBJECTS[word] ?? [];
}

const NAT_W = 1920;
const NAT_H = 1080;
const TOTAL_ANSWERS_PER_LESSON = FOREST_SECTIONS.reduce((a, s) => 
  a + (s.words.length * 3) + (s.grammarItems?.length ?? 0), 0);

// ═══════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════
function normalizeGerman(s: string): string {
  return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

function compareWords(input: string, target: string): boolean {
  return normalizeGerman(input.trim()) === normalizeGerman(target);
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
}// ═══════════════════════════════════════
// 🌲 ScreenBackground
// ═══════════════════════════════════════
function getSectionBackground(sectionId: string, isMobile: boolean): string {
  const suffix = isMobile ? 'mob' : 'pc';
  if (sectionId === 'animals') return `/card-image/forest-animals-${suffix}.webp`;
  if (sectionId === 'colors') return `/card-image/forest-colors-${suffix}.webp`;
  return `/card-image/forest-food-${suffix}.webp`;
}

function ScreenBackground({ section, activeColor, isMobile, phase }: { 
  section: ForestSection; 
  activeColor: string; 
  isMobile: boolean;
  phase?: Phase;
}) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    if (isMobile) return;
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 10,
      size: 2 + Math.random() * 8, duration: 12 + Math.random() * 10,
    }));
    setParticles(p);
  }, [isMobile, section.id]);

  const overlayOpacity = phase === 'test' ? 0.55 : 0.35;
  const bgImage = getSectionBackground(section.id, isMobile);

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
          rgba(10,5,30,${overlayOpacity}) 0%, 
          rgba(10,5,30,${overlayOpacity * 0.6}) 40%, 
          rgba(10,5,30,${overlayOpacity * 0.6}) 60%, 
          rgba(10,5,30,${overlayOpacity}) 100%)`,
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {!isMobile && particles.map(p => (
        <motion.div 
          key={`${section.id}-${p.id}`} 
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: -20, width: p.size, height: p.size,
            background: `radial-gradient(circle, ${activeColor}cc, transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}88`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
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
                  ? 'linear-gradient(135deg, #58CC02, #4AA802)'
                  : isDone 
                    ? 'linear-gradient(135deg, #58CC02, #4AA802)'
                    : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#58CC02' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                borderWidth: isMobile ? '1px' : '2px',
                color: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                fontSize: isMobile ? '6px' : '11px',
                boxShadow: isActive ? '0 0 8px rgba(88,204,2,0.6)' : isDone ? '0 0 6px rgba(88,204,2,0.4)' : 'none',
              }}>
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
                background: 'linear-gradient(135deg, #4CC9F0, #7209B7)',
              }}>
              <img src="/characters/karl-3d.webp" alt="character" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[7px] font-bold text-white/80">المستوى</span>
              <div className="flex items-center gap-1">
                <span className="font-black text-[11px] text-white">{level}</span>
                <div id="level-bar-target" className="relative w-10 h-1.5 bg-white/15 rounded-full overflow-hidden border border-white/20">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(to right, #4CC9F0, #7209B7)' }}
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
              <img id="star-target" src="/treasuer/star.webp" alt="star" className="w-3 h-3 flex-shrink-0" 
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
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1 }}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{
              borderColor: '#FFD700',
              boxShadow: '0 0 15px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, #4CC9F0, #7209B7)',
            }}>
            <img src="/characters/karl-3d.webp" alt="character" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="text-[9px] md:text-[10px] font-bold text-white/80 mb-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>المستوى</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm md:text-base text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{level}</span>
              <div id="level-bar-target" className="relative w-14 md:w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #4CC9F0, #7209B7)' }}
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
            <img id="star-target" src="/treasuer/star.webp" alt="star" className="w-5 h-5 md:w-6 md:h-6" 
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
                    <img src="/treasuer/star.webp" alt="star" className="w-10 h-10"
                      style={{ filter: `drop-shadow(0 0 15px ${color}) drop-shadow(0 0 25px ${color})` }} />
                  )}
                  {item.type === 'energy' && (
                    <img src="/treasuer/energy.webp" alt="energy" className="w-10 h-10"
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
}// ═══════════════════════════════════════
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
  const treasureImg = `/treasuer/${treasureState}.webp`;

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
            <FloatingIconButton onClick={onMap} label="خريطة" color="#4CC9F0" isMobile={isMobile}
              iconSrc="/treasuer/map-icon.webp" iconAlt="map" />
            <FloatingIconButton label="نجوم" color="#FFD700" isMobile={isMobile} disabled
              iconSrc="/treasuer/star.webp" iconAlt="star" />

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
              iconSrc="/treasuer/energy.webp" iconAlt="energy" />
            <FloatingIconButton onClick={onHint} label="تلميح" color="#FFD700" isMobile={isMobile}
              badge={stats.hints} disabled={stats.hints === 0}
              iconSrc="/treasuer/HINT.webp" iconAlt="hint" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// SoundButton
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

// ═══════════════════════════════════════
// GlassCard
// ═══════════════════════════════════════
function GlassCard({ children, className = '', accentColor = '#9D4EDD' }: {
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
}

// ═══════════════════════════════════════
// 🌳 HeroWordDisplay (للديسكتوب)
// ═══════════════════════════════════════
function HeroWordDisplay({ wordData }: { wordData: ForestWord }) {
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
  }, [wordData.word]);

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
// 🌳 WordBuilderMobile
// ═══════════════════════════════════════
function WordBuilderMobile({ wordData, onComplete, onWrong }: {
  wordData: ForestWord;
  onComplete: (clientX: number, clientY: number) => void;
  onWrong: () => void;
}) {
  const word = wordData.word;
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

  const darkColor = useMemo(() => getDarkColor(wordData.color), [wordData.color]);

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
    
    if (letter.toLowerCase() === nextExpectedLetter.toLowerCase()) {
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

  const wordLength = word.length;
  const slotWidth = wordLength <= 4 ? 38 : wordLength <= 6 ? 32 : wordLength <= 8 ? 28 : 24;
  const slotHeight = wordLength <= 4 ? 46 : wordLength <= 6 ? 40 : wordLength <= 8 ? 36 : 32;
  const slotFontSize = wordLength <= 4 ? '1.5rem' : wordLength <= 6 ? '1.3rem' : wordLength <= 8 ? '1.1rem' : '1rem';
  const slotGap = wordLength <= 6 ? 'gap-1.5' : 'gap-1';
  
  const btnWidth = wordLength <= 4 ? 42 : wordLength <= 6 ? 38 : wordLength <= 8 ? 34 : 30;
  const btnHeight = btnWidth;
  const btnFontSize = wordLength <= 4 ? '1.5rem' : wordLength <= 6 ? '1.3rem' : wordLength <= 8 ? '1.1rem' : '1rem';

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

          <SoundButton onClick={() => speakWord(word)} color={wordData.color} size={38} />

          <div className={`flex items-center justify-center ${slotGap} flex-wrap mt-1`} dir="ltr">
            {word.split('').map((letter, idx) => {
              const isFilled = idx < placedIndices.length;
              return (
                <motion.div
                  ref={el => { slotRefs.current[idx] = el; }}
                  key={`slot-${idx}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isFilled ? [0.8, 1.15, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg flex items-center justify-center flex-shrink-0 border-2 relative overflow-hidden"
                  style={{
                    width: slotWidth, height: slotHeight,
                    background: isFilled 
                      ? `linear-gradient(145deg, ${wordData.gradient[0]}, ${wordData.gradient[1]})` 
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isFilled ? wordData.color : `${wordData.color}55`,
                    borderStyle: isFilled ? 'solid' : 'dashed',
                    boxShadow: isFilled ? `0 4px 12px ${wordData.color}aa` : 'none',
                  }}
                >
                  {!isFilled && (
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
                  
                  {isFilled && (
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
// 🌳 LearnPhase
// ═══════════════════════════════════════
function LearnPhase({ wordData, sectionTitle, onDone, onKarlReact, onCombo, onCorrect, isMobile }: {
  wordData: ForestWord;
  sectionTitle: string;
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
  const requiredChars = getRequiredSpecialChars(wordData.word);

  useEffect(() => {
    setInput('');
    setStatus('idle');
    const t = setTimeout(() => speakWord(wordData.word), 500);
    return () => clearTimeout(t);
  }, [wordData.word]);

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
    if (compareWords(input, wordData.word)) {
      setStatus('correct');
      speakWord(wordData.word);
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
        colors={wordData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      
      <motion.div
        key={`learn-${wordData.word}`}
        initial={{ opacity: 0, x: 60 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        {isMobile ? (
          <WordBuilderMobile
            wordData={wordData}
            onComplete={handleMobileComplete}
            onWrong={handleMobileWrong}
          />
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <motion.div
                onClick={() => speakWord(wordData.word)}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer"
              >
                <HeroWordDisplay wordData={wordData} />
              </motion.div>
              <SoundButton onClick={() => speakWord(wordData.word)} color={wordData.color} label="استمع للكلمة" />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${wordData.color}aa` }}>
                  Wort · {sectionTitle}
                </div>
                <div className="text-2xl font-black text-white">اكتب الكلمة</div>
                <div className="text-sm font-bold text-white/40 mt-1">بالألمانية</div>
              </div>

              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={wordData.word}
                color={wordData.color}
                status={status}
                fontSize="1.8rem"
              />

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
        )}
      </motion.div>
    </>
  );
}// ═══════════════════════════════════════
// 🎤 SpeakingPractice
// ═══════════════════════════════════════
function SpeakingPractice({ wordData, isMobile, onSuccess, onSkip }: {
  wordData: ForestWord;
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

      if (bestScore >= 0.7) {
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
        <div className={`flex flex-col items-center ${isMobile ? 'gap-2.5' : 'gap-2.5'}`}>
          
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: [0, 1.2, 1] }} 
            transition={{ duration: 0.5 }}
            className={isMobile ? 'text-4xl' : 'text-3xl'}>
            🎤
          </motion.div>

          <div className="text-center">
            <h3 className={`font-black text-white ${isMobile ? 'text-base' : 'text-lg'}`}>
              كرر الكلمة بصوتك
            </h3>
            <p className={`text-white/60 font-bold ${isMobile ? 'text-[10px] mt-1' : 'text-xs mt-1'}`}>
              اضغط على المايك واتكلم بوضوح
            </p>
          </div>

          <div className={`w-full rounded-2xl border-2 text-center backdrop-blur-md ${isMobile ? 'p-2.5' : 'p-2.5'}`}
            style={{
              background: `linear-gradient(135deg, ${wordData.color}22, ${wordData.color}08)`,
              borderColor: `${wordData.color}55`,
            }}>
            
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={isMobile ? 'text-2xl' : 'text-2xl'}>
                {wordData.emoji}
              </span>
              <p className={`font-black text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}
                style={{ textShadow: `0 0 20px ${wordData.color}88`, direction: 'ltr' }}>
                {targetWord}
              </p>
            </div>
            <p className={`font-bold ${isMobile ? 'text-xs' : 'text-xs'}`}
              style={{ color: wordData.color }}>
              {wordData.wordAr}
            </p>
            
            <button onClick={() => speakWord(targetWord)}
              className={`inline-flex items-center gap-1.5 mt-1.5 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all font-bold ${isMobile ? 'px-3 py-1 text-[10px]' : 'px-3 py-1 text-[10px]'}`}>
              <Volume2 size={isMobile ? 11 : 11} /> اسمع النطق الصح
            </button>
          </div>

          <motion.button
            ref={micButtonRef}
            whileHover={!isListening ? { scale: 1.05 } : {}}
            whileTap={!isListening ? { scale: 0.95 } : {}}
            onClick={handleStart}
            disabled={isListening || status === 'success'}
            className={`relative rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isMobile ? 'w-20 h-20' : 'w-16 h-16'}`}
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
              <Check size={isMobile ? 36 : 28} className="text-white" strokeWidth={3} />
            ) : (
              <Mic size={isMobile ? 36 : 28} className="text-white" />
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
                <p className={`text-white/40 font-bold mb-1 ${isMobile ? 'text-[10px]' : 'text-[10px]'}`}>
                  سمعتك بتقول:
                </p>
                <p className={`font-black text-white ${isMobile ? 'text-sm' : 'text-sm'}`} 
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
                className={`font-black text-red-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                🎙️ بسمعك دلوقتي...
              </motion.p>
            )}
            {status === 'success' && (
              <motion.p 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }}
                className={`font-black text-green-400 ${isMobile ? 'text-base' : 'text-base'}`}>
                ✅ نطق ممتاز! 🌟
              </motion.p>
            )}
            {status === 'try-again' && (
              <motion.p 
                key="try-again"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`font-black text-yellow-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                😊 قريب! حاول تاني بصوت أوضح
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p 
                key="error"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`font-black text-red-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                ❌ لازم تسمح للموقع باستخدام المايك
              </motion.p>
            )}
            {status === 'idle' && (
              <motion.p 
                key="idle"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className={`font-bold text-white/40 ${isMobile ? 'text-[10px]' : 'text-[10px]'}`}>
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
                className={`flex items-center gap-2 rounded-2xl font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all ${isMobile ? 'px-4 py-2 text-xs' : 'px-4 py-1.5 text-xs'}`}>
                <SkipForward size={isMobile ? 14 : 14} /> تخطي وكمل
              </button>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 ForestTest
// ═══════════════════════════════════════
function ForestTest({
  sectionWords, sectionId, onPass, onFail, 
  onCorrect, onKarlReact, onCombo, isMobile,
}: {
  sectionWords: ForestWord[];
  sectionId: string;
  onPass: () => void;
  onFail: () => void;
  onCorrect: (clientX: number, clientY: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  isMobile: boolean;
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
      speakWord(currentWord.word);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      setFoundWords(prev => [...prev, currentWord.word]);
      onCorrect(e.clientX, e.clientY);
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
      onKarlReact('sad');
      const newWrong = wrong + 1;
      setWrong(newWrong);
      setShowFeedback('wrong');
      setTimeout(() => { setShowFeedback(null); if (newWrong >= 5) onFail(); }, 600);
    }
  };

  if (!currentWord) return null;

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={currentWord.gradient.concat(['#FFD700', '#FFFFFF'])} />
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className={`flex w-full items-center max-w-7xl mx-auto ${isMobile ? 'flex-col-reverse gap-2' : 'flex-row gap-4'}`}
      >
        <AnimatePresence mode="wait">
          {!finished && (
            <motion.div 
              key={currentWord.word}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className={`flex-shrink-0 rounded-2xl border-2 overflow-hidden backdrop-blur-md ${isMobile ? 'w-full' : 'w-72'}`}
              style={{
                background: `linear-gradient(135deg, ${currentWord.color}33, ${currentWord.color}11)`,
                borderColor: `${currentWord.color}66`,
                boxShadow: `0 8px 30px ${currentWord.color}44, 0 0 40px ${currentWord.color}22`,
              }}
            >
              <div className={`flex items-center gap-3 ${isMobile ? 'p-2.5' : 'p-4'}`}>
                <div className={`rounded-2xl flex items-center justify-center flex-shrink-0 border-2 shadow-lg ${isMobile ? 'w-12 h-12 text-2xl' : 'w-16 h-16 text-3xl'}`}
                  style={{
                    background: `linear-gradient(135deg, ${currentWord.gradient[0]}, ${currentWord.gradient[1]})`,
                    borderColor: 'rgba(255,255,255,0.3)',
                    boxShadow: `0 6px 20px ${currentWord.color}77`,
                  }}>
                  {currentWord.emoji}
                </div>
                <div className="flex-1 text-right min-w-0">
                  <p className={`text-white/60 font-bold mb-0.5 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    {isColors ? 'ابحث عن أي حاجة باللون:' : 'ابحث في الصورة عن:'}
                  </p>
                  <p className={`font-black text-white leading-tight truncate ${isMobile ? 'text-base' : 'text-xl'}`}>
                    {currentWord.word}
                  </p>
                  <p className={`font-bold truncate ${isMobile ? 'text-xs' : 'text-sm'}`} 
                    style={{ color: currentWord.color }}>
                    {currentWord.wordAr}
                  </p>
                </div>
                <button onClick={() => speakWord(currentWord.word)}
                  className={`rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90 ${isMobile ? 'w-10 h-10' : 'w-11 h-11'}`}
                  style={{
                    borderColor: `${currentWord.color}77`,
                    background: `${currentWord.color}33`,
                    color: 'white',
                    boxShadow: `0 4px 12px ${currentWord.color}44`,
                  }}>
                  <Volume2 size={isMobile ? 16 : 18} />
                </button>
              </div>
              
              <div className={`flex gap-1 ${isMobile ? 'px-2.5 pb-2' : 'px-4 pb-3'}`}>
                {sectionWords.map((w, i) => (
                  <div key={w.word} className="flex-1 h-1.5 rounded-full transition-all"
                    style={{
                      background: foundWords.includes(w.word) 
                        ? `linear-gradient(90deg, ${w.gradient[0]}, ${w.gradient[1]})` 
                        : i === currentIdx ? `${w.color}55` : 'rgba(255,255,255,0.08)',
                    }} />
                ))}
              </div>

              {isColors && !isMobile && (
                <div className="px-4 pb-3 text-[11px] font-bold text-white/70 text-center">
                  💡 أي عنصر <span style={{ color: currentWord.color }}>{currentWord.wordAr}</span> = صح!
                </div>
              )}

              {wrong > 0 && (
                <div className={`${isMobile ? 'px-2.5 pb-2' : 'px-4 pb-3'}`}>
                  <div className="flex items-center justify-center gap-1 px-2 py-0.5 rounded-full mx-auto w-fit"
                    style={{ background: 'rgba(255,68,68,0.25)', border: '1px solid rgba(255,68,68,0.5)' }}>
                    <span className={`font-black text-red-200 ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
                      {wrong}/5 محاولات
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl select-none"
          style={{
            aspectRatio: isMobile ? '9/16' : `${NAT_W}/${NAT_H}`,
            cursor: finished ? 'default' : 'pointer',
            background: '#0a1a0a',
            maxHeight: isMobile ? '55vh' : 'calc(100vh - 240px)',
            maxWidth: isMobile ? '100%' : 'calc((100vh - 240px) * 1.777)',
            margin: '0 auto',
          }}
          onClick={handleImageClick}
        >
          <img
            src="/images/forest-scene.webp"
            alt="غابة سحرية"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { 
              const t = e.target as HTMLImageElement; 
              if (!t.src.includes('?v2')) t.src = '/images/forest-scene.webp?v2'; 
            }}
            style={{
              width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center',
              pointerEvents: 'none', display: 'block', 
              opacity: imgLoaded ? 1 : 0, 
              transition: 'opacity 0.3s ease',
            }}
            draggable={false}
          />

          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#0a1a0a' }}>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} 
                className="text-4xl">🌲</motion.div>
            </div>
          )}

          <AnimatePresence>
            {showHint && boxes.length > 0 && boxes.map((b, idx) => (
              <div key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="absolute rounded-2xl pointer-events-none"
                  style={{
                    left: `${b.x - 1}%`, top: `${b.y - 1}%`, 
                    width: `${b.w + 2}%`, height: `${b.h + 2}%`,
                    background: `radial-gradient(ellipse at center, ${currentWord.color}66, ${currentWord.color}11 60%, transparent 80%)`,
                    filter: 'blur(8px)',
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.6, 1, 0.6], 
                    boxShadow: [
                      `0 0 20px ${currentWord.color}aa, inset 0 0 15px ${currentWord.color}55`, 
                      `0 0 50px ${currentWord.color}, inset 0 0 30px ${currentWord.color}88`, 
                      `0 0 20px ${currentWord.color}aa, inset 0 0 15px ${currentWord.color}55`
                    ] 
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="absolute rounded-xl pointer-events-none"
                  style={{ 
                    left: `${b.x}%`, top: `${b.y}%`, 
                    width: `${b.w}%`, height: `${b.h}%`, 
                    border: `3px solid ${currentWord.color}`, 
                    background: `${currentWord.color}25` 
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{ 
                    opacity: { duration: 0.3 }, 
                    y: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } 
                  }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none text-3xl"
                  style={{ 
                    left: `${b.x + b.w / 2}%`, 
                    top: `${Math.max(b.y - 6, 0)}%`, 
                    transform: 'translateX(-50%)', 
                    filter: `drop-shadow(0 0 8px ${currentWord.color})` 
                  }}
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
                style={{ 
                  left: `${clickEffect.x}%`, top: `${clickEffect.y}%`, 
                  transform: 'translate(-50%, -50%)', 
                  width: '48px', height: '48px', 
                  background: clickEffect.correct ? 'rgba(88,204,2,0.65)' : 'rgba(255,68,68,0.65)' 
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFeedback === 'correct' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(88,204,2,0.3), transparent)' }}>
                <motion.div 
                  initial={{ y: 20, scale: 0.8 }} 
                  animate={{ y: 0, scale: 1 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-xl"
                  style={{ background: 'rgba(88,204,2,0.92)', boxShadow: '0 4px 30px rgba(88,204,2,0.5)' }}>
                  ✓ {currentWord.word}!
                </motion.div>
              </motion.div>
            )}
            {showFeedback === 'wrong' && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 0.18 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none" 
                style={{ background: '#FF4444' }} />
            )}
          </AnimatePresence>

          {finished && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(0,8,0,0.85)', backdropFilter: 'blur(8px)' }}>
              <motion.div 
                animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }} 
                transition={{ duration: 0.8 }} 
                className="text-7xl">🎉</motion.div>
              <p className="font-black text-white text-3xl">وجدت كل الحاجات!</p>
              <div className="flex gap-1.5">
                {sectionWords.map(w => (
                  <img key={w.word} src="/treasuer/star.webp" alt="star" 
                    className="w-6 h-6" 
                    style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// شاشات النجاح والفشل
// ═══════════════════════════════════════
function SectionSuccess({ section, onNext, isLast }: { 
  section: ForestSection; onNext: () => void; isLast: boolean 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto px-4">
      <motion.div 
        animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} 
        transition={{ duration: 1, delay: 0.2 }} 
        className="text-7xl md:text-9xl">{section.emoji}</motion.div>
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-2" 
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          أنهيت {section.title}! 🎉
        </h2>
        <p className="font-bold text-base md:text-lg" 
          style={{ color: section.accentColor, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          {isLast ? 'أنهيت كل دروس الغابة! 🌳' : 'كمّل على القسم الجاي 💪'}
        </p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div 
            key={s} 
            initial={{ scale: 0, rotate: -30 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 400 }}>
            <img src="/treasuer/star.webp" alt="star" 
              className="w-10 h-10 md:w-12 md:h-12" 
              style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.04 }} 
        whileTap={{ scale: 0.96 }} 
        onClick={onNext}
        className="px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-xl text-white"
        style={{
          background: isLast 
            ? 'linear-gradient(135deg, #58CC02, #096A02)' 
            : `linear-gradient(135deg, ${section.gradient[0]}, ${section.gradient[1]})`,
          boxShadow: `0 10px 40px ${section.accentColor}66`,
        }}>
        {isLast ? '🏆 العودة للخريطة' : `${FOREST_SECTIONS[FOREST_SECTIONS.indexOf(section) + 1]?.emoji} القسم الجاي`}
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto px-4">
      <motion.div 
        animate={{ rotate: [-5, 5, -5] }} 
        transition={{ duration: 0.5, repeat: 3 }} 
        className="text-7xl md:text-8xl">😅</motion.div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2" 
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          حاول تاني!
        </h2>
        <p className="font-bold text-white/70 text-sm md:text-base" 
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          راجع الكلمات كويس وبعدين اعمل الاختبار
        </p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.04 }} 
        whileTap={{ scale: 0.96 }} 
        onClick={onRetry}
        className="flex items-center gap-2 px-8 md:px-10 py-3 md:py-4 rounded-2xl font-black text-base md:text-lg text-white"
        style={{ 
          background: 'linear-gradient(135deg, #F72585, #7209B7)',
          boxShadow: '0 10px 30px rgba(247,37,133,0.4)',
        }}>
        <RotateCcw size={20} /> أعد القسم
      </motion.button>
    </motion.div>
  );
}

function AllDoneScreen({ totalStars, onMap }: { totalStars: number; onMap: () => Promise<void> }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto px-4">
      <motion.div 
        animate={{ rotate: [0, 360] }} 
        transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }} 
        className="text-7xl md:text-9xl">🌳</motion.div>
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-2" 
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
          أنهيت دروس الغابة!
        </h2>
        <p className="font-bold text-base md:text-lg text-[#58CC02]" 
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          بوابة براندنبورغ اتفتحت لك! 🇩🇪
        </p>
      </div>
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-md border border-yellow-400/40"
        style={{ background: 'rgba(255,215,0,0.15)', boxShadow: '0 8px 30px rgba(255,215,0,0.3)' }}>
        <img src="/treasuer/star.webp" alt="star" className="w-7 h-7 md:w-8 md:h-8" 
          style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }} />
        <span className="font-black text-3xl md:text-4xl text-yellow-400">{totalStars}</span>
        <span className="font-bold text-white/80 text-base md:text-lg">نجمة!</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div 
            key={s} 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.5 + s * 0.15, type: 'spring' }}>
            <img src="/treasuer/star.webp" alt="star" 
              className="w-12 h-12 md:w-14 md:h-14" 
              style={{ filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))' }} />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1.1 }}
        whileHover={{ scale: 1.04 }} 
        whileTap={{ scale: 0.96 }} 
        onClick={onMap}
        className="flex items-center gap-2 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg text-white"
        style={{ 
          background: 'linear-gradient(135deg, #58CC02, #096A02)', 
          boxShadow: '0 10px 40px rgba(88,204,2,0.5)' 
        }}>
        <Trophy size={24} /> العودة للخريطة
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanForestPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useKeyboardOpen();
  
  const [sectionIdx, setSectionIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [correctInSection, setCorrectInSection] = useState(0);
  const LESSON_ID = 'german-forest';

  const { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress } = useGameStats();

  const totalWordsAll = useMemo(() => 
    FOREST_SECTIONS.reduce((a, s) => a + s.words.length, 0), 
  []);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        if (!progress.completed) {
          if (progress.current_group != null) setSectionIdx(progress.current_group);
          if (progress.current_letter != null) setWordIdx(progress.current_letter);
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

  const section = FOREST_SECTIONS[sectionIdx];
  const wordData = section?.words[wordIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInSection < 2 ? 'closed' :
    correctInSection < 5 ? 'half' : 'opend';

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
    setCorrectInSection(prev => {
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
    const totalPossibleStars = totalWordsAll * 3;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newSection: number, newWord: number, newPhase: Phase) => {
    const rating = calculateRating(totalStars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newSection,
      current_letter: newWord,
      current_phase: newPhase,
    });
  };

  const handleLearnDone = () => {
    setPhase('speak');
    savePosition(sectionIdx, wordIdx, 'speak');
  };

  const handleSpeakDone = () => {
    const nextIdx = wordIdx + 1;
    if (nextIdx < section.words.length) {
      setWordIdx(nextIdx);
      setPhase('learn');
      savePosition(sectionIdx, nextIdx, 'learn');
    } else {
      setPhase('test');
      savePosition(sectionIdx, wordIdx, 'test');
    }
  };

  const handleTestPass = () => {
    // ✅ لو الـ section عنده grammarItems → روح grammar
    if (section.grammarItems && section.grammarItems.length > 0) {
      setPhase('grammar');
      savePosition(sectionIdx, wordIdx, 'grammar');
    } else {
      setPhase('section-success');
      savePosition(sectionIdx, wordIdx, 'section-success');
    }
  };

  // ✅ Handler جديد للـ Grammar phase
  const handleGrammarComplete = (correctCount: number) => {
    // bonus لو جاوب كل حاجة صح
    if (correctCount === section.grammarItems.length) {
      addPoints(20);
      handleKarlReact('celebrate');
    }
    setPhase('section-success');
    savePosition(sectionIdx, wordIdx, 'section-success');
  };
  
  const handleTestFail = () => {
    setCombo(0);
    resetStreak();
    setPhase('section-fail');
  };

  const handleSectionNext = () => {
    if (sectionIdx + 1 < FOREST_SECTIONS.length) {
      const newSectionIdx = sectionIdx + 1;
      setSectionIdx(newSectionIdx);
      setWordIdx(0);
      setPhase('learn');
      setCorrectInSection(0);
      savePosition(newSectionIdx, 0, 'learn');
    } else {
      setPhase('all-done');
    }
  };

  const handleRetry = () => {
    setWordIdx(0);
    setPhase('learn');
    savePosition(sectionIdx, 0, 'learn');
  };

  const handleHomeClick = () => router.push('/character-and-map?from=lesson');

  const handleAllDoneNext = async () => {
    await saveLessonProgress(LESSON_ID, 3, true);
    router.push('/character-and-map?from=lesson');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b07]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🌲</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!section) return null;

  const totalStepsInSection = section.words.length;
  const activeColor = wordData?.color ?? section.accentColor;
  
  const mobilePaddingTop = phase === 'test' ? '105px' : '110px';
  const mobilePaddingBottom = phase === 'test' ? '85px' : '95px';

  return (
    <div className="text-white relative overflow-hidden" 
      style={{ fontFamily: "'Tajawal', sans-serif", height: '100vh', maxHeight: '100vh' }} 
      dir="rtl">
      
      <ScreenBackground section={section} activeColor={activeColor} isMobile={isMobile} phase={phase} />

      {!(isMobile && isKeyboardOpen) && (
        <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor={section.accentColor} />
      )}

      <FlyingItems items={flyingItems} />

      {phase !== 'section-success' && phase !== 'section-fail' && phase !== 'all-done' && (
        <TopHUD 
          stats={stats} 
          level={stats.level} 
          currentStep={wordIdx} 
          totalSteps={totalStepsInSection}
          onHome={handleHomeClick} 
          isMobile={isMobile}
        />
      )}

      <div className="flex flex-col items-center justify-center relative px-3 md:px-6"
        style={{ 
          zIndex: 10, 
          height: '100vh',
          paddingTop: phase === 'section-success' || phase === 'section-fail' || phase === 'all-done' 
            ? '20px' 
            : isMobile ? mobilePaddingTop : '120px',
          paddingBottom: phase === 'section-success' || phase === 'section-fail' || phase === 'all-done' 
            ? '20px' 
            : isMobile ? mobilePaddingBottom : '120px',
          overflow: 'hidden',
        }}>
        <AnimatePresence mode="wait">
          {phase === 'learn' && wordData && (
            <LearnPhase
              key={`learn-${sectionIdx}-${wordIdx}`}
              wordData={wordData}
              sectionTitle={section.title}
              onDone={handleLearnDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              onCorrect={handleCorrect}
              isMobile={isMobile}
            />
          )}

          {phase === 'speak' && wordData && (
            <SpeakingPractice
              key={`speak-${sectionIdx}-${wordIdx}`}
              wordData={wordData}
              isMobile={isMobile}
              onSuccess={(cx, cy) => {
                handleCorrect(cx, cy);
                handleKarlReact('celebrate');
                setTimeout(handleSpeakDone, 800);
              }}
              onSkip={handleSpeakDone}
            />
          )}

          {phase === 'test' && (
            <ForestTest
              key={`test-${sectionIdx}`}
              sectionWords={section.words}
              sectionId={section.id}
              onPass={handleTestPass}
              onFail={handleTestFail}
              onCorrect={handleCorrect}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              isMobile={isMobile}
            />
          )}

          {/* ✅ Phase جديدة: Grammar */}
          {phase === 'grammar' && (
            <GrammarMiniPhase
              key={`grammar-${sectionIdx}`}
              section={section}
              isMobile={isMobile}
              onComplete={handleGrammarComplete}
              onCorrect={handleCorrect}
              onKarlReact={handleKarlReact}
            />
          )}

          {phase === 'section-success' && (
            <SectionSuccess 
              key="section-success" 
              section={section} 
              onNext={handleSectionNext} 
              isLast={sectionIdx === FOREST_SECTIONS.length - 1} 
            />
          )}

          {phase === 'section-fail' && (
            <FailScreen key="fail" onRetry={handleRetry} />
          )}

          {phase === 'all-done' && (
            <AllDoneScreen key="all-done" totalStars={totalStars} onMap={handleAllDoneNext} />
          )}
        </AnimatePresence>
      </div>

      {phase !== 'section-success' && phase !== 'section-fail' && phase !== 'all-done' && (
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
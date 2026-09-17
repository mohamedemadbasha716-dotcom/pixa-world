'use client';

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Sparkles, Volume2, Home, Flame, Gem, RotateCcw, Trophy, Check, X,
  Mic, SkipForward
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';

import LeoLion, { type LeoMood, type LeoMessage } from '@/app/components/lesson/LeoLion';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';

import { ENGLISH_NUMBERS, ENGLISH_NUMBER_GROUPS, type EnglishNumberItem } from '@/data/english/numbers';

// ═══════════════════════════════════════
// Types & Utility Functions
// ═══════════════════════════════════════
type Phase = 'listen' | 'write' | 'speak' | 'test' | 'group-success' | 'group-fail' | 'all-done';

type FlyingItem = { 
  id: number; startX: number; startY: number; endX: number; endY: number;
  type: 'star' | 'energy' | 'gem';
};

const LESSON_ID = 'london-numbers';

const NUMBER_IMAGES: Record<number, string> = {
  1: '/card-image/1.webp',
  2: '/card-image/2.webp',
  3: '/card-image/3.webp',
  4: '/card-image/4.webp',
  5: '/card-image/5.webp',
  6: '/card-image/6.webp',
  7: '/card-image/7.webp',
  8: '/card-image/8.webp',
  9: '/card-image/9.webp',
  10: '/card-image/10.webp',
};

function speakEnglishNumber(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.8;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
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
  const normA = a.toLowerCase().trim();
  const normB = b.toLowerCase().trim();
  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;
  const dist = levenshteinDistance(normA, normB);
  const maxLen = Math.max(normA.length, normB.length);
  return Math.max(0, 1 - dist / maxLen);
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

type GameStats = {
  points: number; streak: number; gems: number; level: number;
  energy: number; hints: number; levelProgress: number;
};

function useGameStats() {
  const [stats, setStats] = useState<GameStats>({
    points: 200, streak: 0, gems: 10, level: 1, energy: 5, hints: 3, levelProgress: 0,
  });
  const addPoints = (n: number) => setStats(s => ({ ...s, points: s.points + n }));
  const incStreak = () => setStats(s => ({ ...s, streak: s.streak + 1 }));
  const resetStreak = () => setStats(s => ({ ...s, streak: 0 }));
  const addGems = (n: number) => setStats(s => ({ ...s, gems: s.gems + n }));
  const useHint = () => setStats(s => ({ ...s, hints: Math.max(0, s.hints - 1) }));
  const addStar = () => setStats(s => ({ ...s, points: s.points + 10 }));
  const addLevelProgress = (totalSteps: number) => setStats(s => {
    const increment = 100 / (totalSteps * 3);
    return { ...s, levelProgress: Math.min(100, s.levelProgress + increment) };
  });
  return { stats, addPoints, incStreak, resetStreak, addGems, useHint, addStar, addLevelProgress };
}

function generateNumberChoices(correctNum: number, allNumbers: EnglishNumberItem[], count: number = 3): number[] {
  const others = allNumbers.filter(n => n.num !== correctNum).map(n => n.num);
  const shuffled = others.sort(() => Math.random() - 0.5);
  const wrongChoices = shuffled.slice(0, count - 1);
  return [...wrongChoices, correctNum].sort(() => Math.random() - 0.5);
}

function shuffleWordLetters(word: string): string[] {
  const letters = word.toUpperCase().split('');
  let shuffled = [...letters];
  let attempts = 0;
  while (shuffled.join('') === word.toUpperCase() && attempts < 10) {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled;
}

// ═══════════════════════════════════════
// 🎨 Animated Screen Background
// ═══════════════════════════════════════
function ScreenBackground({ activeColor }: { activeColor: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#07090D]" style={{ zIndex: 0 }}>
      {/* شبكة خفيفة في الخلفية */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* دوائر الإضاءة المتحركة بلون الرقم */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-40"
        style={{ background: activeColor }}
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, 50, 0], 
          y: [0, 30, 0] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-30"
        style={{ background: activeColor }}
        animate={{ 
          scale: [1, 1.5, 1], 
          x: [0, -50, 0], 
          y: [0, -30, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-20"
        style={{ background: activeColor, transform: 'translate(-50%, -50%)' }}
        animate={{ 
          scale: [1, 1.3, 1], 
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* جزيئات سحرية طايرة (Particles) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: activeColor,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: `0 0 10px ${activeColor}`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 Stepper & Top/Bottom HUD
// ═══════════════════════════════════════
function Stepper({ currentStep, totalSteps, isMobile }: { currentStep: number; totalSteps: number; isMobile: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const isLocked = i > currentStep;
        return (
          <div key={i} className="flex items-center">
            <motion.div animate={isActive ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative flex items-center justify-center rounded-full font-black border"
              style={{
                width: isActive ? (isMobile ? 18 : 28) : (isMobile ? 14 : 22),
                height: isActive ? (isMobile ? 18 : 28) : (isMobile ? 14 : 22),
                background: isActive ? 'linear-gradient(135deg, #FFB703, #FB8500)' : isDone ? '#58CC02' : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#FFB703' : isDone ? '#58CC02' : 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: isMobile ? '8px' : '11px',
              }}>
              {isLocked ? '🔒' : isDone ? '✓' : i + 1}
            </motion.div>
            {i < totalSteps - 1 && <div className={`${isMobile ? 'w-1.5' : 'w-3'} h-0.5`} style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />}
          </div>
        );
      })}
    </div>
  );
}

function TopHUD({ stats, level, currentStep, totalSteps, onHome, isMobile }: {
  stats: GameStats; level: number; currentStep: number; totalSteps: number; onHome: () => void; isMobile: boolean;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-3 py-2" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6px)' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 bg-amber-500 flex-shrink-0 shadow-lg">
            <img src="/english/characters/leo-lion-3d.webp" alt="Leo Mascot" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/70">المستوى</span>
            <span className="font-black text-xs text-white">{level}</span>
          </div>
        </div>

        <div className="flex items-center bg-black/50 border border-white/10 rounded-2xl px-3 py-1.5 backdrop-blur-md">
          <Stepper currentStep={currentStep} totalSteps={totalSteps} isMobile={isMobile} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/50 border border-white/10 px-2.5 py-1 rounded-xl">
            <img id="star-target" src="/treasuer/star.webp" alt="star" className="w-4 h-4" />
            <span className="font-black text-xs text-white">{stats.points}</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onHome} className="w-9 h-9 rounded-xl bg-black/50 border border-white/20 flex items-center justify-center">
            <Home size={18} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function BottomHUD({ stats, treasureState, onHint, onMap, isMobile }: {
  stats: GameStats; treasureState: 'closed' | 'half' | 'opend'; onHint: () => void; onMap: () => void; isMobile: boolean;
}) {
  const treasureImg = `/treasuer/${treasureState}.webp`;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-2 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/15 rounded-2xl p-2 flex items-center justify-around">
        <button onClick={onMap} className="flex flex-col items-center gap-0.5 text-cyan-400">
          <img src="/treasuer/map-icon.webp" alt="map" className="w-7 h-7" />
          <span className="text-[9px] font-black">الخريطة</span>
        </button>
        <div id="treasure-box" className="flex flex-col items-center gap-0.5">
          <img src={treasureImg} alt="treasure" className="w-8 h-8 object-contain" />
          <span className="text-[9px] font-black text-amber-400">الصندوق</span>
        </div>
        <button onClick={onHint} disabled={stats.hints === 0} className="flex flex-col items-center gap-0.5 text-amber-300 disabled:opacity-40">
          <img src="/treasuer/HINT.svg" alt="hint" className="w-7 h-7" />
          <span className="text-[9px] font-black">تلميح ({stats.hints})</span>
        </button>
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
        return (
          <motion.div
            key={item.id}
            className="fixed pointer-events-none z-[60]"
            style={{ left: item.startX, top: item.startY }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ x: dx, y: dy, scale: [1, 1.5, 0.8], opacity: [1, 1, 0] }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <img src="/treasuer/star.webp" alt="star" className="w-8 h-8 drop-shadow-[0_0_10px_#FFD700]" />
          </motion.div>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════
// 🖼️ Number Display (Floating & Glowing)
// ═══════════════════════════════════════
function HeroNumberDisplay({ numData, isMobile, overrideSize }: { numData: EnglishNumberItem; isMobile?: boolean; overrideSize?: number }) {
  const size = overrideSize || (isMobile ? 190 : 260);
  const imgSrc = NUMBER_IMAGES[numData.num];

  return (
    <div className="relative flex items-center justify-center mx-auto select-none my-2" style={{ width: size, height: size }}>
      {/* هالة النور الخلفية */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-[50px] z-0"
        style={{ background: numData.color }}
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} 
      />
      
      {/* الصورة الطايرة */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }} 
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} 
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={`Number ${numData.num}`} 
            className="w-full h-full object-contain" 
            style={{ filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.6)) drop-shadow(0 0 20px ${numData.color}66)` }}
          />
        ) : (
          <div className="w-[80%] h-[90%] flex flex-col items-center justify-center rounded-3xl border-4 shadow-2xl"
            style={{ background: `linear-gradient(180deg, ${numData.gradient[0]}, ${numData.gradient[1]})`, borderColor: numData.color }}>
            <span className="font-black text-white text-7xl">{numData.num}</span>
            <span className="font-bold text-white/90 text-xl mt-1">{numData.en}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎧 Phase 1: Listen & Select Number
// ═══════════════════════════════════════
function ListenPhase({ numData, allNumbers, onDone, onLeoReact, onCombo, onCorrect, isMobile }: {
  numData: EnglishNumberItem; allNumbers: EnglishNumberItem[]; onDone: () => void;
  onLeoReact: (mood: LeoMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void; isMobile: boolean;
}) {
  const [choices, setChoices] = useState<number[]>([]);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);

  useEffect(() => {
    setChoices(generateNumberChoices(numData.num, allNumbers, 3));
    const t = setTimeout(() => speakEnglishNumber(numData.en), 400);
    return () => clearTimeout(t);
  }, [numData, allNumbers]);

  const handleSelect = (choice: number, e: React.MouseEvent) => {
    if (choice === numData.num) {
      speakEnglishNumber(numData.en);
      playCoinSound(); onCombo(); onLeoReact('happy');
      onCorrect(e.clientX, e.clientY);
      setTimeout(onDone, 1200);
    } else {
      setWrongChoice(choice); playBuzzSound(); onLeoReact('sad');
      setTimeout(() => setWrongChoice(null), 600);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center w-full max-w-lg mx-auto gap-4 relative z-10"
    >
      {/* التوجيه */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-black/40 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-sm font-black text-white text-center shadow-lg"
      >
        Listen & select the correct number 🎧
      </motion.div>

      {/* الرقم وزرار الصوت */}
      <div className="relative">
        <HeroNumberDisplay numData={numData} isMobile={isMobile} />
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => speakEnglishNumber(numData.en)} 
          className="absolute -bottom-2 right-1/2 translate-x-1/2 p-3.5 bg-amber-500 hover:bg-amber-400 rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.5)] border-2 border-amber-200 z-20"
        >
          <Volume2 size={24} className="text-white" />
        </motion.button>
      </div>

      {/* الاختيارات الزجاجية */}
      <div className="flex justify-center gap-4 w-full mt-8" dir="ltr">
        {choices.map((choice, i) => (
          <motion.button
            key={`${choice}-${i}`}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={wrongChoice === choice 
              ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1, y: 0 } 
              : { scale: 1, opacity: 1, y: 0 }
            }
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}
            onClick={(e) => handleSelect(choice, e)}
            className="w-20 h-24 rounded-3xl bg-white/10 backdrop-blur-md border-b-4 font-black text-4xl text-white flex items-center justify-center transition-all"
            style={{ 
              borderColor: wrongChoice === choice ? '#EF4444' : `${numData.color}88`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.1), 0 0 20px ${numData.color}22`
            }}
          >
            {choice}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// ✏️ Phase 2: Word Builder (Spelling)
// ═══════════════════════════════════════
function WritePhase({ numData, onDone, onLeoReact, onCombo, onCorrect, isMobile }: {
  numData: EnglishNumberItem; onDone: () => void;
  onLeoReact: (mood: LeoMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void; isMobile: boolean;
}) {
  const word = numData.en.toUpperCase();
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [placedLetters, setPlacedLetters] = useState<string[]>([]);

  useEffect(() => {
    setShuffledLetters(shuffleWordLetters(word));
    setPlacedLetters([]);
    const t = setTimeout(() => speakEnglishNumber(numData.en), 400);
    return () => clearTimeout(t);
  }, [numData, word]);

  const handleLetterClick = (letter: string, idx: number, e: React.MouseEvent) => {
    const nextExpected = word[placedLetters.length];
    if (letter === nextExpected) {
      const nextPlaced = [...placedLetters, letter];
      setPlacedLetters(nextPlaced);
      setShuffledLetters(prev => prev.filter((_, i) => i !== idx));
      playCoinSound();

      if (nextPlaced.length === word.length) {
        speakEnglishNumber(numData.en);
        onCombo(); onLeoReact('happy');
        onCorrect(e.clientX, e.clientY);
        setTimeout(onDone, 1200);
      }
    } else {
      playBuzzSound(); onLeoReact('sad');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center w-full max-w-lg mx-auto gap-4 relative z-10"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-black/40 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-sm font-black text-white text-center shadow-lg mb-2"
      >
        Spell the number: <strong style={{ color: numData.color, textShadow: `0 0 10px ${numData.color}` }}>{numData.ar}</strong>
      </motion.div>

      {/* عرض صورة الرقم المصغرة بدلاً من الإيموجي */}
      <HeroNumberDisplay numData={numData} isMobile={isMobile} overrideSize={isMobile ? 120 : 160} />

      {/* أماكن الحروف (مع الحروف الشفافة كدليل) */}
      <div className="flex gap-2.5 justify-center min-h-[60px] mt-2" dir="ltr">
        {word.split('').map((expectedChar, i) => {
          const filled = placedLetters[i];
          return (
            <motion.div 
              key={i} 
              animate={filled ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="w-14 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center font-black text-3xl transition-all duration-300"
              style={{ 
                borderColor: filled ? numData.color : 'rgba(255,255,255,0.3)', 
                background: filled ? `${numData.color}33` : 'rgba(0,0,0,0.2)',
                boxShadow: filled ? `0 0 15px ${numData.color}55` : 'none',
                backdropFilter: 'blur(10px)'
              }}>
              {filled ? (
                <span className="text-white drop-shadow-md">{filled}</span>
              ) : (
                <span className="text-white/25">{expectedChar}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* الحروف المبعثرة */}
      <div className="flex gap-3 justify-center flex-wrap mt-4 min-h-[60px]" dir="ltr">
        <AnimatePresence>
          {shuffledLetters.map((char, idx) => (
            <motion.button 
              key={`${char}-${idx}`} 
              initial={{ scale: 0, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.9 }} 
              onClick={(e) => handleLetterClick(char, idx, e)}
              className="w-14 h-14 rounded-2xl bg-white/95 text-slate-900 font-black text-2xl shadow-[0_6px_0_#cbd5e1] border-2 border-white flex items-center justify-center hover:bg-white"
            >
              {char}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎤 Phase 3: Speaking Practice
// ═══════════════════════════════════════
function SpeakingPractice({ numData, onSuccess, onSkip, isMobile }: {
  numData: EnglishNumberItem; onSuccess: (cx: number, cy: number) => void; onSkip: () => void; isMobile: boolean;
}) {
  const [isListening, setIsListening] = useState(false);

  const handleStart = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      onSkip(); return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    setIsListening(true);

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript.toLowerCase();
      setIsListening(false);
      if (text.includes(numData.en.toLowerCase()) || text.includes(String(numData.num))) {
        onSuccess(window.innerWidth / 2, window.innerHeight / 2);
      } else {
        playBuzzSound();
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center w-full max-w-lg mx-auto gap-6 relative z-10 mb-12"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-black/40 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-sm font-black text-white text-center shadow-lg"
      >
        Speak the number out loud 🎤
      </motion.div>
      
      <HeroNumberDisplay numData={numData} isMobile={isMobile} />
      
      <motion.button 
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={handleStart} 
        className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all ${isListening ? 'bg-red-500 border-red-300 animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.6)]' : 'bg-blue-500 border-blue-300 hover:bg-blue-400'}`}
      >
        <Mic size={40} className="text-white" />
      </motion.button>
      
      <button onClick={onSkip} className="text-xs font-bold text-white/50 hover:text-white transition-colors bg-white/5 px-5 py-2.5 rounded-full mt-2 border border-white/10">
        تخطي الاختبار الصوتي ⏭️
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎡 Phase 4: London Eye Spinning Wheel Test!
// ═══════════════════════════════════════
function LondonEyeTest({ groupNumbers, onPass, onLeoReact, onCombo, onCorrect }: {
  groupNumbers: EnglishNumberItem[]; onPass: () => void;
  onLeoReact: (m: LeoMood) => void; onCombo: () => void;
  onCorrect: (x: number, y: number) => void;
}) {
  const [targetIdx, setTargetIdx] = useState(0);
  const targetNum = groupNumbers[targetIdx];

  useEffect(() => {
    if (targetNum) {
      speakEnglishNumber(`Find number ${targetNum.en}`);
    }
  }, [targetIdx, targetNum]);

  const handleCabinClick = (num: EnglishNumberItem, e: React.MouseEvent) => {
    if (num.num === targetNum.num) {
      playCoinSound(); onCombo(); onLeoReact('celebrate');
      onCorrect(e.clientX, e.clientY);

      if (targetIdx + 1 >= groupNumbers.length) {
        setTimeout(onPass, 1500);
      } else {
        setTargetIdx(prev => prev + 1);
      }
    } else {
      playBuzzSound(); onLeoReact('sad');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-2xl mx-auto py-2 relative z-10 mb-8">
      <div className="bg-black/60 backdrop-blur-md border border-amber-400/40 px-6 py-2 rounded-2xl text-center shadow-2xl z-20">
        <div className="text-xs font-bold text-amber-300">🎡 تحدي عين لندن — ابحث عن الكارت الصحيح!</div>
        <div className="text-2xl font-black text-white mt-1">
          ابحث عن الرقم: <span style={{ color: targetNum?.color, textShadow: `0 0 10px ${targetNum?.color}` }}>{targetNum?.en} ({targetNum?.num})</span>
        </div>
      </div>

      <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center my-auto">
        {/* عامود الساقية */}
        <div className="absolute bottom-0 w-24 h-48 border-l-4 border-r-4 border-slate-500/60 transform origin-bottom" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />

        {/* الدائرة الدوارة */}
        <motion.div 
          className="relative w-full h-full rounded-full border-4 border-cyan-400/50 flex items-center justify-center shadow-[0_0_50px_rgba(76,201,240,0.3)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {/* خطوط الساقية الداخلية */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute w-full h-0.5 bg-cyan-300/20" style={{ transform: `rotate(${i * 22.5}deg)` }} />
          ))}

          {/* الكبائن (كروت الأرقام) */}
          {groupNumbers.map((numItem, index) => {
            const angle = (index / groupNumbers.length) * (2 * Math.PI);
            const radius = 140; // نصف القطر
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const imgSrc = NUMBER_IMAGES[numItem.num];

            return (
              <div key={numItem.num} className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
                {/* المحافظة على الكروت معدولة أثناء الدوران */}
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}>
                  <motion.button
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleCabinClick(numItem, e)}
                    className="w-14 h-20 md:w-16 md:h-24 rounded-xl flex items-center justify-center shadow-2xl cursor-pointer bg-black/40 border border-white/20 p-1"
                    style={{
                      boxShadow: `0 0 20px ${numItem.color}88`,
                    }}
                  >
                    {imgSrc ? (
                      <img src={imgSrc} alt={`Number ${numItem.num}`} className="w-full h-full object-contain filter drop-shadow-md" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center rounded-lg" style={{ background: numItem.color }}>
                         <span className="text-white font-black text-xl">{numItem.num}</span>
                       </div>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🏁 Screens
// ═══════════════════════════════════════
function SuccessScreen({ groupTitle, onNext }: { groupTitle: string; onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto p-8 text-center flex flex-col items-center gap-4 relative z-10"
    >
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-8xl drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]"
      >
        🏆
      </motion.div>
      <h2 className="text-3xl font-black text-white drop-shadow-lg">أحسنت! أنهيت {groupTitle}</h2>
      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onNext} 
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-black text-lg text-white rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.5)] border-2 border-amber-300"
      >
        المجموعة التالية 🚀
      </motion.button>
    </motion.div>
  );
}

function FinalScreen({ onReturn }: { onReturn: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto p-8 text-center flex flex-col items-center gap-4 relative z-10"
    >
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl drop-shadow-[0_0_40px_rgba(255,215,0,0.6)]"
      >
        🎓
      </motion.div>
      <h2 className="text-3xl font-black text-white drop-shadow-lg">مبروك! أكملت درس الأرقام</h2>
      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onReturn} 
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-black text-lg text-white rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.5)] border-2 border-amber-300"
      >
        العودة لخريطة لندن 🗺️
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 Page Inner Component
// ═══════════════════════════════════════
function EnglishNumbersLessonPageInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [groupIdx, setGroupIdx] = useState(0);
  const [numIdx, setNumIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [leoMood, setLeoMood] = useState<LeoMood>('idle');
  const [leoMessage, setLeoMessage] = useState<LeoMessage | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const { stats, addPoints, incStreak, addStar, addLevelProgress } = useGameStats();

  const currentGroup = ENGLISH_NUMBER_GROUPS[groupIdx];
  const currentNum = currentGroup?.numbers[numIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    numIdx < 2 ? 'closed' : numIdx < 4 ? 'half' : 'opend';

  const handleLeoReact = (mood: LeoMood) => {
    setLeoMood(mood);
    setTimeout(() => setLeoMood('idle'), 2500);
  };

  const handleCorrect = (x: number, y: number) => {
    addPoints(10); incStreak(); addStar(); addLevelProgress(currentGroup.numbers.length);
    setConfettiPos({ x, y }); setConfettiTrigger(prev => prev + 1);
    setFlyingItems(prev => [...prev, { id: Date.now(), startX: x, startY: y, endX: window.innerWidth - 80, endY: 30, type: 'star' }]);
  };

  const handleNextStep = () => {
    if (phase === 'listen') setPhase('write');
    else if (phase === 'write') setPhase('speak');
    else if (phase === 'speak') {
      if (numIdx + 1 < currentGroup.numbers.length) {
        setNumIdx(prev => prev + 1); setPhase('listen');
      } else {
        setPhase('test');
      }
    }
  };

  const handlePassTest = () => {
    if (groupIdx + 1 < ENGLISH_NUMBER_GROUPS.length) {
      setPhase('group-success');
    } else {
      setPhase('all-done');
    }
  };

  const handleNextGroup = () => {
    setGroupIdx(prev => prev + 1);
    setNumIdx(0);
    setPhase('listen');
  };

  const handleHomeClick = () => router.push('/english-character-and-map?from=lesson&map=1');

  return (
    <div className="min-h-screen text-white relative overflow-hidden" dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <ScreenBackground activeColor={currentNum?.color || '#FFB703'} />
      <LeoLion mood={leoMood} message={leoMessage} />
      
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={currentNum?.gradient || ['#FFF', '#000']} />
      <FlyingItems items={flyingItems} />

      {phase !== 'group-success' && phase !== 'all-done' && (
        <TopHUD stats={stats} level={stats.level} currentStep={numIdx} totalSteps={currentGroup?.numbers.length || 5} onHome={handleHomeClick} isMobile={isMobile} />
      )}

      <div className="relative z-10 pt-20 pb-20 px-4 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {phase === 'listen' && (
            <ListenPhase key={`listen-${numIdx}-${groupIdx}`} numData={currentNum} allNumbers={ENGLISH_NUMBERS} onDone={handleNextStep} onLeoReact={handleLeoReact} onCombo={() => {}} onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'write' && (
            <WritePhase key={`write-${numIdx}-${groupIdx}`} numData={currentNum} onDone={handleNextStep} onLeoReact={handleLeoReact} onCombo={() => {}} onCorrect={handleCorrect} isMobile={isMobile} />
          )}
          {phase === 'speak' && (
            <SpeakingPractice key={`speak-${numIdx}-${groupIdx}`} numData={currentNum} onSuccess={(x, y) => { handleCorrect(x, y); handleLeoReact('celebrate'); setTimeout(handleNextStep, 800); }} onSkip={handleNextStep} isMobile={isMobile} />
          )}
          {phase === 'test' && (
            <LondonEyeTest key={`test-${groupIdx}`} groupNumbers={currentGroup.numbers} onPass={handlePassTest} onLeoReact={handleLeoReact} onCombo={() => {}} onCorrect={handleCorrect} />
          )}
          {phase === 'group-success' && (
            <SuccessScreen key="success" groupTitle={currentGroup.titleAr} onNext={handleNextGroup} />
          )}
          {phase === 'all-done' && (
            <FinalScreen key="final" onReturn={() => { saveLessonProgress(LESSON_ID, 3, true); handleHomeClick(); }} />
          )}
        </AnimatePresence>
      </div>

      {phase !== 'group-success' && phase !== 'all-done' && (
        <BottomHUD stats={stats} treasureState={treasureState} onHint={() => {}} onMap={handleHomeClick} isMobile={isMobile} />
      )}
    </div>
  );
}

export default function EnglishNumbersLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white font-black text-xl animate-pulse">جاري تحميل الرحلة...</div>}>
      <EnglishNumbersLessonPageInner />
    </Suspense>
  );
}
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Volume2, Trophy, Home, Flame, Gem, Mic, SkipForward, Sparkles, 
  X, BookOpen
} from 'lucide-react';

import { 
  SPANISH_SPORTS_ITEMS, 
  SPANISH_SPORTS_GROUPS, 
  generateSpanishSportsChoices,
  generateSportsSentenceWordPool,
  checkSportsSentenceOrder,
  type SpanishSportsItem
} from '@/data/spanish-3/sports';

import { speakSpanishWord, speakSpanishSentence } from '@/lib/audio/spanishSpeech';
import { playCoinSound, playBuzzSound } from '@/lib/audio/sounds';
import { getSpanishLessonProgress, saveSpanishLessonProgress } from '@/lib/spanishPlayerData';

import ToroBull from '@/app/components/lesson/ToroBull';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';

import type { ToroMood, ToroMessage } from '@/lib/types/spanish-lesson';
import { SPANISH_ENCOURAGEMENTS, SPANISH_SAD_MESSAGES } from '@/lib/types/spanish-lesson';

const LESSON_ID = 'es-campnou-sports';
type Phase = 'listen' | 'build' | 'speak' | 'group-success' | 'all-done';

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

// 🎨 Helper: لون شارة الفئة
function getCategoryStyle(category: 'Deporte' | 'Pasatiempo' | 'Estadio') {
  switch (category) {
    case 'Deporte':
      return { bg: 'rgba(220,38,38,0.7)', border: '#DC2626', icon: '⚽', label: 'رياضات' };
    case 'Pasatiempo':
      return { bg: 'rgba(236,72,153,0.7)', border: '#EC4899', icon: '🎨', label: 'هوايات' };
    case 'Estadio':
      return { bg: 'rgba(234,179,8,0.7)', border: '#EAB308', icon: '🏟️', label: 'ملعب' };
  }
}

// ═══════════════════════════════════════
// ⚽ Spinning Football - كرة قدم تدور
// ═══════════════════════════════════════
function SpinningFootball({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      animate={{ 
        rotate: 360,
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: 'linear' 
      }}
      className="absolute"
      style={{ 
        width: size, 
        height: size,
        fontSize: size,
        lineHeight: 1,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
      }}
    >
      ⚽
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🏆 Golden Trophy - كأس ذهبي متحرك
// ═══════════════════════════════════════
function GoldenTrophy({ size = 32 }: { size?: number }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -5, 0],
        rotate: [-5, 5, -5],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
      className="absolute"
      style={{ 
        width: size, 
        height: size,
        fontSize: size,
        lineHeight: 1,
        filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))',
      }}
    >
      🏆
    </motion.div>
  );
}

// ═══════════════════════════════════════
// ⚽ Sports Card - بطاقة رياضية
// ═══════════════════════════════════════
function SportsCard({ 
  item, 
  size = 280, 
  mode = 'word',
}: { 
  item: SpanishSportsItem; 
  size?: number; 
  mode?: 'word' | 'sentence';
}) {
  const catStyle = getCategoryStyle(item.category);
  
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, minHeight: mode === 'sentence' ? size * 1.4 : size * 1.2 }}
    >
      <div 
        className="absolute inset-0 blur-3xl opacity-60 rounded-full" 
        style={{ background: `radial-gradient(circle, ${item.color}aa, transparent 70%)` }} 
      />
      
      <div 
        className="relative w-full rounded-[2rem] overflow-hidden border-4 flex flex-col items-center"
        style={{
          background: `linear-gradient(180deg, ${item.gradient[0]}44, ${item.gradient[1]}77, #1a0505)`,
          borderColor: item.color,
          boxShadow: `0 20px 60px ${item.color}66, inset 0 2px 0 rgba(255,255,255,0.3)`,
        }}
      >
        {/* ديكور: كرة قدم تدور + كأس ذهبي */}
        <div className="absolute top-3 right-3 opacity-40">
          <SpinningFootball size={26} />
        </div>
        <div className="absolute bottom-16 left-3 opacity-50">
          <GoldenTrophy size={22} />
        </div>
        
        {/* خطوط ملعب في الخلفية */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49%, white 49%, white 51%, transparent 51%),
              radial-gradient(circle at 50% 50%, transparent 30px, white 30px, white 32px, transparent 32px)
            `,
            backgroundSize: '100% 100%',
          }}
        />
        
        {/* Header */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <div 
            className="px-5 py-1.5 rounded-2xl border-2 font-black text-white text-sm flex items-center gap-1.5"
            style={{ 
              background: 'linear-gradient(135deg, #DC2626, #991B1B)',
              borderColor: '#FFD700',
              boxShadow: '0 4px 12px rgba(220,38,38,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            <Trophy size={12} className="text-yellow-300" fill="#FFD700" /> الرياضة
          </div>
          
          <div 
            className="px-3 py-0.5 rounded-full border-2 font-bold text-white text-[10px] backdrop-blur-md flex items-center gap-1"
            style={{ 
              background: catStyle.bg,
              borderColor: 'rgba(255,255,255,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            {catStyle.icon} {item.category} • {catStyle.label}
          </div>
        </div>

        {/* الإيموجي الكبير */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pt-20 pb-2 gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10"
            style={{ 
              fontSize: size * 0.45,
              filter: `drop-shadow(0 10px 25px ${item.color}cc)`,
              lineHeight: 1,
            }}
          >
            {item.emoji}
          </motion.div>

          {/* شارة الملاحظة (لو موجودة) */}
          {item.note && (
            <div 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white backdrop-blur-md border flex items-center gap-1"
              style={{
                background: 'rgba(220,38,38,0.5)',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              ⚠️ {item.note}
            </div>
          )}
        </div>

        {/* المحتوى */}
        {mode === 'word' ? (
          <div className="px-3 pb-3 flex flex-col items-center gap-1.5 z-10">
            <div 
              className="px-4 py-1.5 rounded-xl border-2 font-black text-white text-base md:text-lg max-w-full text-center"
              style={{
                background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                borderColor: 'rgba(255,255,255,0.5)',
                boxShadow: `0 4px 15px ${item.color}88`,
                direction: 'ltr',
              }}
            >
              {item.word}
            </div>
            <div className="text-sm font-bold text-white/90">{item.wordAr}</div>
          </div>
        ) : (
          <div className="px-3 pb-3 flex flex-col items-center gap-2 z-10 w-full">
            {/* شارة الجرامر */}
            <div 
              className="px-3 py-1 rounded-full border flex items-center gap-1.5"
              style={{
                background: 'rgba(220,38,38,0.2)',
                borderColor: 'rgba(220,38,38,0.5)',
              }}
            >
              <BookOpen size={10} className="text-red-300" />
              <span className="text-[10px] font-black text-red-200" dir="ltr">
                {item.grammarHint.pattern}
              </span>
            </div>
            
            <div 
              className="px-4 py-2 rounded-xl border-2 font-black text-white text-base md:text-lg max-w-full text-center"
              style={{
                background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                borderColor: 'rgba(255,255,255,0.5)',
                boxShadow: `0 4px 15px ${item.color}88`,
                direction: 'ltr',
              }}
            >
              {item.sentenceEs}
            </div>
            <div className="text-sm font-bold text-white/90 text-center">{item.sentenceAr}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SoundButton({ onClick, color, size = 60 }: { onClick: () => void; color: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={() => { setPlaying(true); onClick(); setTimeout(() => setPlaying(false), 1500); }}
      className="relative rounded-full flex items-center justify-center border-2"
      style={{ 
        width: size, height: size,
        background: `linear-gradient(135deg, #DC2626, #991B1B)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(220,38,38,0.6)`,
      }}
    >
      {playing && [0, 0.2, 0.4].map((d, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#DC2626' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay: d, ease: 'easeOut' }} />
      ))}
      <Volume2 size={size * 0.45} className="text-white" />
    </motion.button>
  );
}

function Stepper({ currentStep, totalSteps, isMobile, color }: { 
  currentStep: number; totalSteps: number; isMobile: boolean; color: string;
}) {
  return (
    <div className="flex items-center gap-0.5 md:gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={i} className="flex items-center">
            <motion.div
              animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-full font-black flex items-center justify-center border"
              style={{
                width: isActive ? (isMobile ? 18 : 30) : (isMobile ? 14 : 24),
                height: isActive ? (isMobile ? 18 : 30) : (isMobile ? 14 : 24),
                background: isActive ? color : isDone ? '#58CC02' : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? color : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                color: 'white',
                fontSize: isMobile ? '8px' : '11px',
                boxShadow: isActive ? `0 0 10px ${color}99` : 'none',
              }}
            >
              {isDone ? '✓' : isActive ? '●' : '🔒'}
            </motion.div>
            {i < totalSteps - 1 && (
              <div className={`${isMobile ? 'w-1.5' : 'w-3'} h-0.5`} 
                style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SpanishSportsLessonInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  
  const [groupIdx, setGroupIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [toroMood, setToroMood] = useState<ToroMood>('idle');
  const [toroMessage, setToroMessage] = useState<ToroMessage | null>(null);
  const [itemChoices, setItemChoices] = useState<SpanishSportsItem[]>([]);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const [points, setPoints] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [gems, setGems] = useState(35);
  const [hints] = useState(3);
  const [correctInGroup, setCorrectInGroup] = useState(0);

  const group = SPANISH_SPORTS_GROUPS[groupIdx];
  const item = group?.items[itemIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 2 ? 'closed' : correctInGroup < 4 ? 'half' : 'opend';

  useEffect(() => {
    const load = async () => {
      const progress = await getSpanishLessonProgress(LESSON_ID);
      if (progress && !progress.completed) {
        setGroupIdx(progress.current_group || 0);
        setItemIdx(progress.current_letter || 0);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (item && phase === 'listen') {
      setItemChoices(generateSpanishSportsChoices(item.word, 3));
      setTimeout(() => speakSpanishWord(item.word), 500);
    }
  }, [itemIdx, groupIdx, phase]);

  useEffect(() => {
    if (item && phase === 'build') {
      setAvailableWords(generateSportsSentenceWordPool(item));
      setSelectedWords([]);
      setStatus('idle');
      setTimeout(() => speakSpanishSentence(item.sentenceEs), 500);
    }
  }, [itemIdx, groupIdx, phase]);

  useEffect(() => {
    if (item && phase === 'speak') {
      setTimeout(() => speakSpanishSentence(item.sentenceEs), 500);
    }
  }, [itemIdx, groupIdx, phase]);

  const handleToroReact = (mood: ToroMood) => {
    setToroMood(mood);
    const msg = mood === 'happy' ? SPANISH_ENCOURAGEMENTS : SPANISH_SAD_MESSAGES;
    setToroMessage(msg[Math.floor(Math.random() * msg.length)]);
    setTimeout(() => { setToroMood('idle'); setToroMessage(null); }, 2500);
  };

  const triggerCorrect = (cx: number, cy: number) => {
    playCoinSound();
    setPoints(p => p + (phase === 'listen' ? 10 : 15));
    setStreak(s => s + 1);
    setCorrectInGroup(c => c + 1);
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    handleToroReact('happy');
    
    setTimeout(() => {
      if (phase === 'listen') { 
        setPhase('build'); 
        setStatus('idle'); 
      }
      else if (phase === 'build') { 
        setPhase('speak'); 
        setStatus('idle'); 
      }
      else if (phase === 'speak') {
        if (itemIdx < group.items.length - 1) {
          setItemIdx(n => n + 1); 
          setPhase('listen');
        } else {
          setPhase('group-success');
        }
      }
    }, 1400);
  };

  const handleItemChoice = (choice: SpanishSportsItem, e: React.MouseEvent) => {
    if (status === 'correct') return;
    if (choice.word === item.word) {
      setStatus('correct');
      speakSpanishWord(item.word);
      triggerCorrect(e.clientX, e.clientY);
    } else {
      setWrongChoice(choice.word);
      playBuzzSound();
      handleToroReact('sad');
      setTimeout(() => setWrongChoice(null), 600);
    }
  };

  const handleSelectWord = (word: string, idx: number) => {
    if (status === 'correct') return;
    
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    setAvailableWords(availableWords.filter((_, i) => i !== idx));
    speakSpanishWord(word);

    if (newSelected.length === item.sentenceWords.length) {
      const isCorrect = checkSportsSentenceOrder(newSelected, item.sentenceWords);
      if (isCorrect) {
        setStatus('correct');
        setTimeout(() => {
          speakSpanishSentence(item.sentenceEs);
          triggerCorrect(window.innerWidth / 2, window.innerHeight / 2);
        }, 400);
      } else {
        setStatus('wrong');
        playBuzzSound();
        handleToroReact('sad');
        setTimeout(() => {
          setAvailableWords(generateSportsSentenceWordPool(item));
          setSelectedWords([]);
          setStatus('idle');
        }, 1200);
      }
    }
  };

  const handleRemoveSelected = (idx: number) => {
    if (status === 'correct') return;
    const word = selectedWords[idx];
    setSelectedWords(selectedWords.filter((_, i) => i !== idx));
    setAvailableWords([...availableWords, word]);
  };

  const handleSpeakDone = () => {
    triggerCorrect(window.innerWidth/2, window.innerHeight/2);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white font-black">جاري التحميل...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden" 
      style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>
      
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img 
          src={isMobile ? "/maps/spanish-map-3-mob.webp" : "/maps/spanish-map-3-pc.webp"} 
          alt="bg" className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0" style={{
          background: isMobile 
            ? 'linear-gradient(180deg, rgba(40,10,10,0.8) 0%, rgba(30,5,10,0.92) 100%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(90,15,25,0.9) 0%, rgba(60,10,20,0.94) 50%, rgba(30,5,10,0.98) 100%)',
        }} />
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${item?.color}33, transparent 70%)` }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 px-2 md:px-6" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
        
        {isMobile ? (
          <>
            <div className="flex items-center justify-between gap-1.5">
              <button onClick={() => router.push('/spanish-character-and-map?map=3')}
                className="w-9 h-9 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Home size={16} />
              </button>
              
              <div className="flex items-center gap-1 flex-1 justify-center max-w-[230px]">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-yellow-400/40 flex-1 justify-center">
                  <img src="/treasuer/star.webp" className="w-3 h-3" alt="" />
                  <span className="font-black text-[10px] text-white">{points}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-orange-400/40 flex-1 justify-center">
                  <Flame size={12} className="text-orange-400" fill={streak > 0 ? '#FF4D6D' : 'none'} />
                  <span className="font-black text-[10px] text-white">{streak}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-purple-400/40 flex-1 justify-center">
                  <Gem size={12} className="text-purple-300" fill="#9D4EDD" />
                  <span className="font-black text-[10px] text-white">{gems}</span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 flex-shrink-0">
                <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
              </div>
            </div>
            
            {phase !== 'group-success' && phase !== 'all-done' && (
              <div className="flex justify-center mt-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15">
                  <Stepper currentStep={itemIdx} totalSteps={group?.items.length || 5} isMobile color={item?.color || '#DC2626'} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/spanish-character-and-map?map=3')}
                className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-white hover:scale-105 transition">
                <Home size={20} />
              </button>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-yellow-400/40">
                <img src="/treasuer/star.webp" className="w-6 h-6" alt="" />
                <span className="font-black text-white">{points}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-orange-400/40">
                <Flame size={18} className="text-orange-400" fill={streak > 0 ? '#FF4D6D' : 'none'} />
                <span className="font-black text-white">{streak}</span>
                <span className="text-[10px] text-orange-200 font-bold">سلسلة</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-purple-400/40">
                <Gem size={18} className="text-purple-300" fill="#9D4EDD" />
                <span className="font-black text-white">{gems}</span>
              </div>
            </div>

            {phase !== 'group-success' && phase !== 'all-done' && (
              <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/15">
                <Stepper currentStep={itemIdx} totalSteps={group?.items.length || 5} isMobile={false} color={item?.color || '#DC2626'} />
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/80">المستوى A1.2</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                    <motion.div className="h-full rounded-full" 
                      style={{ background: 'linear-gradient(to right, #DC2626, #FFD700)' }}
                      animate={{ width: `${(itemIdx / (group?.items.length || 5)) * 100}%` }} />
                  </div>
                  <span className="font-black text-white">3</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-3 pt-24 md:pt-28 pb-28">
        <AnimatePresence mode="wait">
          
          {/* ═══ Phase 1: Listen ═══ */}
          {phase === 'listen' && item && (
            <motion.div key={`listen-${groupIdx}-${itemIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-5xl">
              
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <SportsCard item={item} size={isMobile ? 200 : 280} mode="word" />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                    style={{ 
                      background: 'rgba(255,255,255,0.1)',
                      borderColor: `${item.color}66`,
                    }}>
                    <span className="font-black text-white text-sm md:text-base">🎧 استمع واختر الرياضة الصحيحة</span>
                  </div>

                  <SoundButton 
                    onClick={() => speakSpanishWord(item.word)} 
                    color={item.color} 
                    size={isMobile ? 55 : 70}
                  />

                  <div className="flex flex-col gap-2 md:gap-3 w-full mt-2">
                    {itemChoices.map((choice, idx) => {
                      const isWrong = wrongChoice === choice.word;
                      const isCorrect = status === 'correct' && choice.word === item.word;
                      return (
                        <motion.button
                          key={`${item.word}-${choice.word}-${idx}`}
                          initial={{ scale: 0, opacity: 0, x: -50 }}
                          animate={
                            isWrong ? { x: [-8, 8, -8, 8, 0] } : 
                            isCorrect ? { scale: 1.05 } :
                            { scale: 1, opacity: 1, x: 0 }
                          }
                          transition={
                            isWrong 
                              ? { duration: 0.4 } 
                              : isCorrect 
                              ? { duration: 0.5, ease: 'easeInOut' }
                              : { delay: idx * 0.1, type: 'spring' }
                          }
                          whileHover={{ scale: 1.03, x: 5 }} whileTap={{ scale: 0.97 }}
                          onClick={(e) => handleItemChoice(choice, e)}
                          disabled={status === 'correct'}
                          className="relative rounded-2xl flex items-center gap-3 md:gap-4 p-3 md:p-4 border-2 overflow-hidden"
                          style={{
                            background: isWrong 
                              ? 'linear-gradient(135deg, #FF4444, #CC0000)' 
                              : isCorrect
                              ? `linear-gradient(135deg, ${choice.gradient[0]}, ${choice.gradient[1]})`
                              : 'rgba(255,255,255,0.08)',
                            borderColor: isWrong ? '#FF4444' : isCorrect ? choice.color : 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: isCorrect ? `0 0 30px ${choice.color}66` : 'none',
                          }}
                        >
                          <div 
                            className="rounded-2xl flex-shrink-0 border-2 border-white/40 flex items-center justify-center"
                            style={{
                              width: isMobile ? 44 : 56,
                              height: isMobile ? 44 : 56,
                              background: `linear-gradient(135deg, ${choice.gradient[0]}aa, ${choice.gradient[1]}aa)`,
                              boxShadow: `0 4px 15px ${choice.color}88`,
                              fontSize: isMobile ? '1.5rem' : '2rem',
                            }}
                          >
                            {choice.emoji}
                          </div>
                          
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <div className="text-left" dir="ltr">
                              <div className={`font-black text-white leading-tight ${isMobile ? 'text-sm' : 'text-base'}`}>
                                {choice.word}
                              </div>
                              <div className="text-[9px] text-white/50 font-bold mt-0.5">
                                {getCategoryStyle(choice.category).icon} {choice.category}
                              </div>
                            </div>
                            <div className="text-right" dir="rtl">
                              <div className={`font-bold text-white/70 leading-tight ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                {choice.wordAr}
                              </div>
                            </div>
                          </div>

                          {isCorrect && <Check size={isMobile ? 20 : 24} className="text-white flex-shrink-0" strokeWidth={3} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 2: Build Sentence ═══ */}
          {phase === 'build' && item && (
            <motion.div key={`build-${groupIdx}-${itemIdx}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-5xl">
              
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <SportsCard item={item} size={isMobile ? 220 : 280} mode="sentence" />
                
                <div className={`flex flex-col items-center gap-3 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ 
                      background: 'rgba(255,255,255,0.1)',
                      borderColor: `${item.color}66`,
                    }}>
                    <span className="font-black text-white text-sm md:text-base">🧱 كوّن الجملة بالترتيب الصحيح</span>
                    <div className="text-[10px] text-white/60 mt-0.5">دوس على الكلمات اللي تحت ⬇️</div>
                  </div>

                  <button 
                    onClick={() => speakSpanishSentence(item.sentenceEs)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20"
                  >
                    <Volume2 size={14} /> اسمع الجملة كاملة
                  </button>

                  <div className="px-3 py-1.5 rounded-xl border flex items-center gap-2 text-center"
                    style={{
                      background: 'rgba(220,38,38,0.15)',
                      borderColor: 'rgba(220,38,38,0.4)',
                    }}>
                    <BookOpen size={12} className="text-red-300 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-red-100">{item.grammarHint.rule}</span>
                  </div>

                  <div 
                    className="w-full min-h-[70px] md:min-h-[90px] rounded-2xl border-2 border-dashed p-3 flex flex-wrap items-center justify-center gap-2"
                    style={{
                      background: status === 'correct' ? 'rgba(88,204,2,0.2)' :
                                 status === 'wrong' ? 'rgba(255,68,68,0.2)' :
                                 'rgba(0,0,0,0.3)',
                      borderColor: status === 'correct' ? '#58CC02' :
                                  status === 'wrong' ? '#FF4444' :
                                  'rgba(255,255,255,0.3)',
                    }}
                  >
                    {selectedWords.length === 0 ? (
                      <span className="text-white/40 text-xs font-bold">جملتك هتظهر هنا...</span>
                    ) : (
                      selectedWords.map((word, i) => (
                        <motion.button
                          key={`sel-${word}-${i}`}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveSelected(i)}
                          disabled={status === 'correct'}
                          className="px-3 md:px-4 py-2 rounded-xl border-2 flex items-center gap-1.5 font-black text-white text-sm md:text-base"
                          style={{
                            background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                            borderColor: 'rgba(255,255,255,0.4)',
                            boxShadow: `0 4px 10px ${item.color}66`,
                          }}
                        >
                          <span dir="ltr">{word}</span>
                          {status !== 'correct' && <X size={12} className="text-white/70" />}
                        </motion.button>
                      ))
                    )}
                  </div>

                  <div className="w-full flex flex-wrap items-center justify-center gap-2">
                    {availableWords.map((word, i) => (
                      <motion.button
                        key={`avail-${word}-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.08, y: -3 }} 
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSelectWord(word, i)}
                        disabled={status === 'correct'}
                        className="px-3 md:px-4 py-2 md:py-2.5 rounded-xl border-2 font-black text-white text-sm md:text-base"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          borderColor: 'rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <span dir="ltr">{word}</span>
                      </motion.button>
                    ))}
                  </div>

                  {status === 'correct' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/30 border-2 border-green-400">
                      <Check size={20} className="text-green-300" strokeWidth={3} />
                      <span className="font-black text-white text-sm">¡Gol!</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 3: Speak Sentence ═══ */}
          {phase === 'speak' && item && (
            <motion.div key={`speak-${groupIdx}-${itemIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-5xl">
              
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <SportsCard item={item} size={isMobile ? 220 : 280} mode="sentence" />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ 
                      background: 'rgba(255,255,255,0.1)',
                      borderColor: `${item.color}66`,
                    }}>
                    <span className="font-black text-white text-sm md:text-base">🎤 انطق الجملة كاملة بصوت واضح</span>
                  </div>

                  <div className="w-full p-3 rounded-2xl border-2"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      borderColor: 'rgba(255,255,255,0.2)',
                    }}>
                    <div className="text-[10px] text-red-300 font-black mb-2 text-center">
                      🔊 اضغط على أي كلمة لتسمعها منفردة
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {item.sentenceWords.map((word, i) => (
                        <button
                          key={i}
                          onClick={() => speakSpanishWord(word)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white"
                          dir="ltr"
                        >
                          🔊 {word}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSpeakDone}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4"
                    style={{
                      background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                      borderColor: 'rgba(255,255,255,0.3)',
                      boxShadow: `0 0 50px ${item.color}66`,
                    }}
                  >
                    <Mic size={isMobile ? 40 : 50} className="text-white" />
                  </motion.button>

                  <button onClick={() => speakSpanishSentence(item.sentenceEs)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 text-sm font-bold">
                    <Volume2 size={14} /> اسمع الجملة كاملة
                  </button>

                  <button onClick={handleSpeakDone}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white text-sm font-bold">
                    <SkipForward size={14} /> تخطي
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Group Success ═══ */}
          {phase === 'group-success' && (
            <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 max-w-2xl">
              <Trophy size={isMobile ? 80 : 120} className="text-yellow-400 mx-auto" 
                style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }} />
              <h2 className="text-3xl md:text-5xl font-black text-white">¡Como un campeón!</h2>
              <p className="text-lg md:text-xl text-red-400 font-bold">أنهيت {group.titleEs}</p>
              
              <div className="px-5 py-3 rounded-2xl border-2 inline-block"
                style={{
                  background: `linear-gradient(135deg, ${group.items[0].gradient[0]}aa, ${group.items[0].gradient[1]}aa)`,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}>
                <div className="flex items-center gap-2 mb-1 justify-center">
                  <BookOpen size={14} className="text-yellow-300" />
                  <span className="text-xs font-black text-yellow-200">الجرامر اللي اتعلمته</span>
                </div>
                <div className="font-black text-white text-lg" dir="ltr">
                  {group.grammarFocus.pattern}
                </div>
                <div className="text-sm text-white/80 mt-1">
                  {group.grammarFocus.description}
                </div>
              </div>

              <button 
                onClick={() => {
                  if (groupIdx < SPANISH_SPORTS_GROUPS.length - 1) {
                    setGroupIdx(g => g + 1); 
                    setItemIdx(0); 
                    setPhase('listen');
                    setCorrectInGroup(0);
                  } else {
                    setPhase('all-done');
                  }
                }}
                className="px-8 md:px-12 py-3 md:py-4 rounded-2xl font-black text-lg md:text-xl text-white"
                style={{ background: 'linear-gradient(135deg, #DC2626, #FFD700)', boxShadow: '0 10px 30px rgba(220,38,38,0.4)' }}
              >
                المجموعة التالية 🚀
              </button>
            </motion.div>
          )}

          {/* ═══ All Done ═══ */}
          {phase === 'all-done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center space-y-6">
              
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-4">
                {SPANISH_SPORTS_ITEMS.map((s, i) => (
                  <motion.div key={s.word}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className="px-3 py-1.5 rounded-xl border-2 border-white/40 flex items-center gap-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})`,
                      boxShadow: `0 4px 15px ${s.color}88`,
                    }}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <span className="text-xs font-black text-white" dir="ltr">{s.word}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-7xl md:text-8xl">⚽</div>
              <h1 className="text-3xl md:text-5xl font-black text-white">¡Camp Nou completo!</h1>
              <p className="text-lg md:text-xl text-white/60 max-w-md mx-auto">تعلمت 15 كلمة عن الرياضة والهوايات + 15 جملة كاملة!</p>
              <p className="text-sm text-red-300/80 max-w-md mx-auto">
                دلوقتي تقدر تتكلم عن رياضتك المفضلة بالأسباني! ⚽🏆
              </p>
              <div className="flex justify-center gap-3">
                {[1,2,3].map(i => (
                  <motion.img key={i} src="/treasuer/star.webp" alt="star" 
                    className="w-12 h-12 md:w-16 md:h-16"
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
                    style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.9))' }} />
                ))}
              </div>
              <button 
                onClick={() => { 
                  saveSpanishLessonProgress(LESSON_ID, 3, true);
                  router.push('/spanish-character-and-map?map=3'); 
                }}
                className="px-10 py-4 rounded-2xl font-black text-xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #DC2626, #FFD700)', 
                  boxShadow: '0 15px 40px rgba(220,38,38,0.5)',
                  borderBottom: '5px solid #991B1B'
                }}
              >
                العودة للخريطة 🗺️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1.5 pointer-events-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
        <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'max-w-[1500px]'}`}>
          <div className="relative rounded-xl px-4 md:px-6 py-1.5 md:py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(90,15,25,0.85), rgba(60,10,20,0.9))',
              backdropFilter: 'blur(30px)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(220,38,38,0.2)`,
            }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles size={10} className="text-yellow-300" />
              <span className="text-[9px] md:text-[10px] font-black text-yellow-200 tracking-wider uppercase">مكافآت الإنجاز</span>
              <Sparkles size={10} className="text-yellow-300" />
            </div>
            
            <div className="flex items-end justify-around gap-2 md:gap-3">
              <button onClick={() => router.push('/spanish-character-and-map?map=3')}
                className="flex flex-col items-center gap-0.5">
                <img src="/treasuer/map-icon.webp" alt="map" className="w-9 h-9 md:w-11 md:h-11 object-contain" 
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(76,201,240,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black" style={{ color: '#4CC9F0' }}>خريطة</span>
              </button>

              <div className="flex flex-col items-center gap-0.5 opacity-70">
                <img src="/treasuer/star.webp" alt="star" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(255,215,0,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">نجوم</span>
              </div>

              <motion.div animate={treasureState === 'opend' ? { y: [0, -3, 0] } : { y: 0 }}
                transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-0.5">
                <img src={`/treasuer/${treasureState}.webp`} alt="treasure" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                  style={{ filter: treasureState === 'opend' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">صندوق</span>
              </motion.div>

              <div className="flex flex-col items-center gap-0.5 opacity-70">
                <img src="/treasuer/energy.webp" alt="energy" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(76,201,240,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black" style={{ color: '#4CC9F0' }}>طاقة</span>
              </div>

              <button className="flex flex-col items-center gap-0.5 relative" disabled={hints === 0}>
                <div className="relative">
                  <img src="/treasuer/HINT.svg" alt="hint" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                    style={{ filter: 'drop-shadow(0 2px 8px rgba(255,215,0,0.6))' }} />
                  {hints > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border border-black/95">
                      {hints}
                    </div>
                  )}
                </div>
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">تلميح</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToroBull mood={toroMood} message={toroMessage} idleGlowColor={item?.color || '#DC2626'} />
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={[item?.color || '#DC2626', '#FFD700', '#ffffff']} />
    </div>
  );
}

export default function SpanishSportsLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">Loading...</div>}>
      <SpanishSportsLessonInner />
    </Suspense>
  );
}
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Volume2, Trophy, Home, Flame, Gem, Mic, SkipForward, Sparkles
} from 'lucide-react';

import { 
  SPANISH_NUMBERS, 
  SPANISH_NUMBER_GROUPS, 
  getDarkSpanishNumberColor,
  generateSpanishDigitChoices,
  compareSpanishNumberWords,
  TOTAL_ANSWERS_PER_SPANISH_NUMBERS_LESSON,
  type SpanishNumber
} from '@/data/spanish/numbers';

import { speakSpanishNumber, speakSpanishWord } from '@/lib/audio/spanishSpeech';
import { playCoinSound, playBuzzSound } from '@/lib/audio/sounds';
import { getSpanishLessonProgress, saveSpanishLessonProgress } from '@/lib/spanishPlayerData';

import ToroBull from '@/app/components/lesson/ToroBull';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import GhostInput from '@/app/components/lesson/GhostInput';
import SpanishCharsKeyboard, { getRequiredSpanishSpecialChars } from '@/app/components/lesson/SpanishCharsKeyboard';

import type { ToroMood, ToroMessage } from '@/lib/types/spanish-lesson';
import { SPANISH_ENCOURAGEMENTS, SPANISH_SAD_MESSAGES } from '@/lib/types/spanish-lesson';

const LESSON_ID = 'es-covadonga-numbers';
type Phase = 'listen' | 'write' | 'speak' | 'group-success' | 'all-done';

// 📱 Mobile Hook
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

// 🎴 Number Card - البطاقة الفخمة (زي درس الأرقام الألماني)
function NumberCard({ numberData, size = 280 }: { numberData: SpanishNumber; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, height: size * 1.1 }}
    >
      {/* الوهج الخلفي */}
      <div 
        className="absolute inset-0 blur-3xl opacity-60 rounded-full" 
        style={{ background: `radial-gradient(circle, ${numberData.color}aa, transparent 70%)` }} 
      />
      
      {/* الكارت نفسه */}
      <div 
        className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 flex flex-col items-center"
        style={{
          background: `linear-gradient(180deg, ${numberData.gradient[0]}33, ${numberData.gradient[1]}66, #1a0a2e)`,
          borderColor: numberData.color,
          boxShadow: `0 20px 60px ${numberData.color}66, inset 0 2px 0 rgba(255,255,255,0.3)`,
        }}
      >
        {/* الـ Header (الأرقام) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <div 
            className="px-5 py-1.5 rounded-2xl border-2 font-black text-white text-sm"
            style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderColor: '#FFF',
              boxShadow: '0 4px 12px rgba(255,165,0,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            الأرقام
          </div>
          <div 
            className="px-3 py-0.5 rounded-xl border font-bold text-white text-xs backdrop-blur-md"
            style={{ 
              background: 'rgba(0,0,0,0.4)',
              borderColor: 'rgba(255,255,255,0.3)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            {numberData.wordAr}
          </div>
        </div>

        {/* صورة الرقم في النص */}
        <div className="flex-1 flex items-center justify-center w-full pt-16 pb-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative"
          >
            <img 
              src={`/spanish/card-image/numbers/${numberData.imageName}.webp`}
              alt={numberData.word}
              className="object-contain"
              style={{ 
                width: size * 0.7, 
                height: size * 0.7,
                filter: `drop-shadow(0 10px 25px ${numberData.color}aa)`,
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML += `<div style="font-size:${size*0.5}px;text-shadow:0 0 30px ${numberData.color};font-weight:900;color:white;">${numberData.digit}</div>`;
              }}
            />
          </motion.div>
        </div>

        {/* الرقم الصغير في الأسفل */}
        <div 
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg border-2"
          style={{
            background: `linear-gradient(135deg, ${numberData.gradient[0]}, ${numberData.gradient[1]})`,
            borderColor: 'rgba(255,255,255,0.5)',
            boxShadow: `0 4px 15px ${numberData.color}88`,
          }}
        >
          {numberData.digit}
        </div>
      </div>
    </motion.div>
  );
}

// 🔊 Sound Button دائري
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

// 📊 Stepper
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
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
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

// 🎯 Main Component
function SpanishNumbersLessonInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  
  const [groupIdx, setGroupIdx] = useState(0);
  const [numberIdx, setNumberIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [toroMood, setToroMood] = useState<ToroMood>('idle');
  const [toroMessage, setToroMessage] = useState<ToroMessage | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);

  // Stats
  const [points, setPoints] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [gems, setGems] = useState(35);
  const [hints] = useState(3);
  const [correctInGroup, setCorrectInGroup] = useState(0);

  const group = SPANISH_NUMBER_GROUPS[groupIdx];
  const numberData = group?.numbers[numberIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 2 ? 'closed' : correctInGroup < 4 ? 'half' : 'opend';

  useEffect(() => {
    const load = async () => {
      const progress = await getSpanishLessonProgress(LESSON_ID);
      if (progress && !progress.completed) {
        setGroupIdx(progress.current_group || 0);
        setNumberIdx(progress.current_letter || 0);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (numberData) {
      setChoices(generateSpanishDigitChoices(numberData.digit, 3));
      setTimeout(() => speakSpanishNumber(numberData.digit), 500);
    }
  }, [numberIdx, groupIdx, phase]);

  const handleToroReact = (mood: ToroMood) => {
    setToroMood(mood);
    const msg = mood === 'happy' ? SPANISH_ENCOURAGEMENTS : SPANISH_SAD_MESSAGES;
    setToroMessage(msg[Math.floor(Math.random() * msg.length)]);
    setTimeout(() => { setToroMood('idle'); setToroMessage(null); }, 2500);
  };

  const triggerCorrect = (cx: number, cy: number) => {
    playCoinSound();
    setPoints(p => p + 10);
    setStreak(s => s + 1);
    setCorrectInGroup(c => c + 1);
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    handleToroReact('happy');
    
    setTimeout(() => {
      if (phase === 'listen') { setPhase('write'); setInput(''); setStatus('idle'); }
      else if (phase === 'write') { setPhase('speak'); setInput(''); setStatus('idle'); }
      else if (phase === 'speak') {
        if (numberIdx < group.numbers.length - 1) {
          setNumberIdx(n => n + 1); setPhase('listen');
        } else {
          setPhase('group-success');
        }
      }
    }, 1400);
  };

  const handleChoiceClick = (choice: string, e: React.MouseEvent) => {
    if (status === 'correct') return;
    if (choice === numberData.digit) {
      setStatus('correct');
      speakSpanishNumber(numberData.digit);
      triggerCorrect(e.clientX, e.clientY);
    } else {
      setWrongChoice(choice);
      playBuzzSound();
      handleToroReact('sad');
      setTimeout(() => setWrongChoice(null), 600);
    }
  };

  const handleWriteCheck = (e?: any) => {
    if (compareSpanishNumberWords(input, numberData.word)) {
      setStatus('correct');
      speakSpanishWord(numberData.word);
      triggerCorrect(e?.clientX || window.innerWidth/2, e?.clientY || window.innerHeight/2);
    } else {
      setStatus('wrong'); playBuzzSound(); handleToroReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleSpeakDone = () => {
    triggerCorrect(window.innerWidth/2, window.innerHeight/2);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white font-black">جاري التحميل...</div>;
  }

  const darkColor = getDarkSpanishNumberColor(numberData?.color || '#DC2626');

  return (
    <div className="relative min-h-screen overflow-hidden" 
      style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img 
          src={isMobile ? "/spanish/maps/spanish-map-1-mob.webp" : "/spanish/maps/spanish-map-1-pc.webp"} 
          alt="bg" className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0" style={{
          background: isMobile 
            ? 'linear-gradient(180deg, rgba(10,5,30,0.7) 0%, rgba(10,5,30,0.85) 100%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(70,20,20,0.85) 0%, rgba(40,10,15,0.92) 50%, rgba(20,5,10,0.95) 100%)',
        }} />
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${numberData?.color}33, transparent 70%)` }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* ═══════ Top HUD ═══════ */}
      <div className="fixed top-0 left-0 right-0 z-30 px-2 md:px-6" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
        
        {isMobile ? (
          // Mobile HUD
          <>
            <div className="flex items-center justify-between gap-1.5">
              <button onClick={() => router.push('/spanish-character-and-map')}
                className="w-9 h-9 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Home size={16} />
              </button>
              
              <div className="flex items-center gap-1 flex-1 justify-center max-w-[230px]">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-yellow-400/40 flex-1 justify-center">
                  <img src="/treasuer/star.png" className="w-3 h-3" alt="" />
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
            
            <div className="flex justify-center mt-1.5">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15">
                <Stepper currentStep={numberIdx} totalSteps={group?.numbers.length || 5} isMobile color={numberData?.color || '#DC2626'} />
              </div>
            </div>
          </>
        ) : (
          // Desktop HUD
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/spanish-character-and-map')}
                className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-white hover:scale-105 transition">
                <Home size={20} />
              </button>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-yellow-400/40">
                <img src="/treasuer/star.png" className="w-6 h-6" alt="" />
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

            <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/15">
              <Stepper currentStep={numberIdx} totalSteps={group?.numbers.length || 5} isMobile={false} color={numberData?.color || '#DC2626'} />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/80">المستوى</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-white/15 rounded-full overflow-hidden border border-white/20">
                    <motion.div className="h-full rounded-full" 
                      style={{ background: 'linear-gradient(to right, #DC2626, #FFD700)' }}
                      animate={{ width: `${(numberIdx / 5) * 100}%` }} />
                  </div>
                  <span className="font-black text-white">4</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════ Main Content ═══════ */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-3 pt-24 md:pt-28 pb-28">
        <AnimatePresence mode="wait">
          
          {/* ════ Phase 1: Listen (مع الكارت الفخم + اختيارات) ════ */}
          {phase === 'listen' && numberData && (
            <motion.div key={`listen-${groupIdx}-${numberIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-5xl">
              
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6`}>
                
                {/* الكارت الفخم */}
                <NumberCard numberData={numberData} size={isMobile ? 200 : 280} />
                
                {/* الجزء التفاعلي */}
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  
                  {/* العنوان */}
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                    style={{ 
                      background: 'rgba(255,255,255,0.1)',
                      borderColor: `${numberData.color}66`,
                    }}>
                    <span className="font-black text-white text-sm md:text-base">استمع جيداً واختر الرقم</span>
                  </div>

                  {/* زر النطق */}
                  <SoundButton 
                    onClick={() => speakSpanishNumber(numberData.digit)} 
                    color={numberData.color} 
                    size={isMobile ? 55 : 70}
                  />

                  {/* النص العربي */}
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-black text-white">{numberData.wordAr}</div>
                  </div>

                  {/* الاختيارات */}
                  <div className="flex items-center gap-3 md:gap-4 justify-center mt-2" dir="ltr">
                    {choices.map((choice, idx) => {
                      const isWrong = wrongChoice === choice;
                      return (
                        <motion.button
                          key={`${numberData.digit}-${choice}-${idx}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
                          transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring' }}
                          whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleChoiceClick(choice, e)}
                          disabled={status === 'correct'}
                          className="relative rounded-2xl flex items-center justify-center border-2 font-black"
                          style={{
                            width: isMobile ? 70 : 90,
                            height: isMobile ? 70 : 90,
                            background: isWrong 
                              ? 'linear-gradient(145deg, #FF4444, #CC0000)' 
                              : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(245,245,255,0.92))',
                            borderColor: isWrong ? '#FF4444' : `${numberData.color}aa`,
                            color: isWrong ? 'white' : darkColor,
                            fontSize: isMobile ? '2rem' : '2.5rem',
                            boxShadow: `0 6px 20px ${numberData.color}55, inset 0 -3px 0 rgba(0,0,0,0.1)`,
                          }}
                        >
                          {choice}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ Phase 2: Write ════ */}
          {phase === 'write' && numberData && (
            <motion.div key={`write-${groupIdx}-${numberIdx}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-5xl">
              
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6`}>
                
                <NumberCard numberData={numberData} size={isMobile ? 200 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                    style={{ 
                      background: 'rgba(255,255,255,0.1)',
                      borderColor: `${numberData.color}66`,
                    }}>
                    <span className="font-black text-white text-sm md:text-base">اكتب اسم الرقم بالإسباني</span>
                  </div>

                  <SoundButton 
                    onClick={() => speakSpanishWord(numberData.word)} 
                    color={numberData.color} 
                    size={isMobile ? 50 : 60}
                  />

                  <div className="w-full space-y-3">
                    <GhostInput 
                      value={input} onChange={(v) => { setInput(v); setStatus('idle'); }} onEnter={handleWriteCheck}
                      ghostText={numberData.word} color={numberData.color} status={status}
                      fontSize={isMobile ? '1.5rem' : '1.8rem'}
                    />
                    
                    {getRequiredSpanishSpecialChars(numberData.word).length > 0 && (
                      <SpanishCharsKeyboard 
                        chars={getRequiredSpanishSpecialChars(numberData.word)}
                        onChar={(c) => setInput(prev => prev + c)} color={numberData.color} 
                      />
                    )}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleWriteCheck} disabled={!input}
                    className="w-full py-3.5 rounded-2xl font-black text-lg text-white disabled:opacity-30 flex items-center justify-center gap-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #58CC02, #4AA802)', 
                      boxShadow: '0 6px 0 #3A8602, 0 8px 20px rgba(88,204,2,0.4)',
                    }}
                  >
                    تحقق <Check size={22} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ Phase 3: Speak ════ */}
          {phase === 'speak' && numberData && (
            <motion.div key={`speak-${groupIdx}-${numberIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-2xl">
              
              <div className="rounded-[2rem] p-6 md:p-10 border-2 backdrop-blur-xl flex flex-col items-center gap-5"
                style={{
                  background: `linear-gradient(180deg, rgba(70,20,25,0.7) 0%, rgba(50,15,20,0.85) 100%)`,
                  borderColor: `${numberData.color}66`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${numberData.color}33`,
                }}>
                
                <div className="text-4xl md:text-5xl">🎤</div>
                
                <h3 className="text-xl md:text-2xl font-black text-white text-center">انطق الرقم بصوت واضح</h3>

                <NumberCard numberData={numberData} size={isMobile ? 160 : 200} />

                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSpeakDone}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4"
                  style={{
                    background: `linear-gradient(135deg, ${numberData.gradient[0]}, ${numberData.gradient[1]})`,
                    borderColor: 'rgba(255,255,255,0.3)',
                    boxShadow: `0 0 50px ${numberData.color}66`,
                  }}
                >
                  <Mic size={isMobile ? 40 : 50} className="text-white" />
                </motion.button>

                <button onClick={() => speakSpanishWord(numberData.word)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 text-sm font-bold">
                  <Volume2 size={14} /> اسمع النطق
                </button>

                <button onClick={handleSpeakDone}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white text-sm font-bold">
                  <SkipForward size={14} /> تخطي
                </button>
              </div>
            </motion.div>
          )}

          {/* ════ Group Success ════ */}
          {phase === 'group-success' && (
            <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6">
              <Trophy size={isMobile ? 80 : 120} className="text-yellow-400 mx-auto" 
                style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }} />
              <h2 className="text-3xl md:text-5xl font-black text-white">¡Excelente!</h2>
              <p className="text-lg md:text-xl text-red-400 font-bold">أنهيت {group.titleEs}</p>
              <button 
                onClick={() => {
                  if (groupIdx < SPANISH_NUMBER_GROUPS.length - 1) {
                    setGroupIdx(g => g + 1); setNumberIdx(0); setPhase('listen');
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

          {/* ════ All Done ════ */}
          {phase === 'all-done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center space-y-6">
              <div className="text-8xl">🏆</div>
              <h1 className="text-3xl md:text-5xl font-black text-white">¡Eres un crack!</h1>
              <p className="text-lg md:text-xl text-white/60 max-w-md mx-auto">تعلمت الأرقام الإسبانية من 1 إلى 15 بنجاح!</p>
              <div className="flex justify-center gap-3">
                {[1,2,3].map(i => (
                  <motion.img key={i} src="/treasuer/star.png" alt="star" 
                    className="w-12 h-12 md:w-16 md:h-16"
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
                    style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.9))' }} />
                ))}
              </div>
              <button 
                onClick={() => { 
                  saveSpanishLessonProgress(LESSON_ID, 3, true);
                  router.push('/spanish-character-and-map'); 
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

      {/* ═══════ Bottom HUD (مكافآت الإنجاز) ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1.5 pointer-events-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
        <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'max-w-[1500px]'}`}>
          <div className="relative rounded-xl px-4 md:px-6 py-1.5 md:py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(50,15,20,0.85), rgba(40,10,15,0.9))',
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
              {/* Map */}
              <button onClick={() => router.push('/spanish-character-and-map')}
                className="flex flex-col items-center gap-0.5">
                <img src="/treasuer/map-icon.png" alt="map" className="w-9 h-9 md:w-11 md:h-11 object-contain" 
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(76,201,240,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black" style={{ color: '#4CC9F0' }}>خريطة</span>
              </button>

              {/* Star */}
              <div className="flex flex-col items-center gap-0.5 opacity-70">
                <img src="/treasuer/star.png" alt="star" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(255,215,0,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">نجوم</span>
              </div>

              {/* Treasure */}
              <motion.div animate={treasureState === 'opend' ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
                className="flex flex-col items-center gap-0.5">
                <img src={`/treasuer/${treasureState}.png`} alt="treasure" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                  style={{ filter: treasureState === 'opend' ? 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">صندوق</span>
              </motion.div>

              {/* Energy */}
              <div className="flex flex-col items-center gap-0.5 opacity-70">
                <img src="/treasuer/energy.png" alt="energy" className="w-9 h-9 md:w-11 md:h-11 object-contain"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(76,201,240,0.6))' }} />
                <span className="text-[8px] md:text-[9px] font-black" style={{ color: '#4CC9F0' }}>طاقة</span>
              </div>

              {/* Hint */}
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

      <ToroBull mood={toroMood} message={toroMessage} idleGlowColor={numberData?.color || '#DC2626'} />
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={[numberData?.color || '#DC2626', '#FFD700', '#ffffff']} />
    </div>
  );
}

export default function SpanishNumbersLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">Loading...</div>}>
      <SpanishNumbersLessonInner />
    </Suspense>
  );
}
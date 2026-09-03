'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Volume2, Home, Flame, Mic, Sparkles, 
  Star, RotateCcw
} from 'lucide-react';

import { 
  SPANISH_TEST_QUESTIONS, 
  SPANISH_TEST_ROUNDS, 
  CATEGORY_COLORS,
  compareTestWords,
  calculateTestStars,
  getTestResultMessage,
  TOTAL_TEST_QUESTIONS,
  type SpanishTestQuestion,
} from '@/data/spanish-3/sagrada-test';

import { speakSpanishWord } from '@/lib/audio/spanishSpeech';
import { playCoinSound, playBuzzSound } from '@/lib/audio/sounds';
import { getSpanishLessonProgress, saveSpanishLessonProgress } from '@/lib/spanishPlayerData';

import ToroBull from '@/app/components/lesson/ToroBull';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import GhostInput from '@/app/components/lesson/GhostInput';
import SpanishCharsKeyboard, { getRequiredSpanishSpecialChars } from '@/app/components/lesson/SpanishCharsKeyboard';

import type { ToroMood, ToroMessage } from '@/lib/types/spanish-lesson';
import { SPANISH_ENCOURAGEMENTS, SPANISH_SAD_MESSAGES } from '@/lib/types/spanish-lesson';

const LESSON_ID = 'es-sagrada-test';

type Phase = 'intro' | 'round-intro' | 'question' | 'round-complete' | 'final-result';

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

// ⛪ Cathedral Component - كاتدرائية ساغرادا فاميليا متحركة
function AnimatedCathedral({ size = 200 }: { size?: number }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size * 1.4 }}
    >
      {/* هالة ذهبية متوهجة */}
      <motion.div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          width: size * 1.6,
          height: size * 1.2,
          background: 'radial-gradient(circle, rgba(252,211,77,0.7), transparent 70%)',
        }}
        animate={{ 
          opacity: [0.5, 0.9, 0.5],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* شعاع الضوء الذهبي من الأعلى */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '3px',
          height: size * 0.8,
          background: 'linear-gradient(to bottom, rgba(252,211,77,0.9), rgba(252,211,77,0.3), transparent)',
          filter: 'blur(2px)',
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
          scaleY: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* نجوم متلألئة حوالين الكاتدرائية */}
      {[
        { top: '15%', left: '20%', delay: 0 },
        { top: '25%', right: '15%', delay: 0.5 },
        { top: '40%', left: '10%', delay: 1 },
        { top: '35%', right: '10%', delay: 1.5 },
      ].map((star, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300"
          style={{ ...star, fontSize: '16px' }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          ✨
        </motion.div>
      ))}
      
      {/* الكاتدرائية الأساسية (Emoji كبير) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
        style={{ 
          fontSize: size * 0.95,
          filter: 'drop-shadow(0 15px 40px rgba(252,211,77,0.6))',
          lineHeight: 1,
        }}
      >
        ⛪
      </motion.div>

      {/* زخارف قوطية تحت */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 text-xl opacity-70"
      >
        <span>🕊️</span>
        <span>🌟</span>
        <span>🕊️</span>
      </motion.div>
    </motion.div>
  );
}

// 📊 Top Progress Bar
function TestProgressBar({ current, total, isMobile }: { current: number; total: number; isMobile: boolean }) {
  const percentage = ((current + 1) / total) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] md:text-xs font-black text-white/80">
          السؤال {current + 1} / {total}
        </span>
        <span className="text-[10px] md:text-xs font-black text-yellow-300">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full h-2.5 md:h-3 bg-black/40 rounded-full overflow-hidden border border-white/20">
        <motion.div 
          className="h-full rounded-full relative"
          style={{ background: 'linear-gradient(to right, #FCD34D, #F59E0B, #D97706)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

// 🎯 Question Card
function QuestionCard({ question, size = 200 }: { question: SpanishTestQuestion; size?: number }) {
  const catColor = CATEGORY_COLORS[question.category];
  
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, minHeight: size * 1.1 }}
    >
      <div 
        className="absolute inset-0 blur-3xl opacity-60 rounded-full" 
        style={{ background: `radial-gradient(circle, ${question.color}aa, transparent 70%)` }} 
      />
      
      <div 
        className="relative w-full rounded-[2rem] overflow-hidden border-4 flex flex-col items-center p-4"
        style={{
          background: `linear-gradient(180deg, ${question.gradient[0]}44, ${question.gradient[1]}77, #1a0a2e)`,
          borderColor: question.color,
          boxShadow: `0 20px 60px ${question.color}66, inset 0 2px 0 rgba(255,255,255,0.3)`,
        }}
      >
        <div 
          className="px-3 py-1 rounded-full border-2 font-bold text-white text-[10px] flex items-center gap-1 mb-2"
          style={{ 
            background: catColor.bg,
            borderColor: 'rgba(255,255,255,0.5)',
          }}
        >
          {question.categoryEmoji} {question.categoryAr}
        </div>

        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [-5, 5, -5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 my-2"
          style={{ 
            fontSize: size * 0.5,
            filter: `drop-shadow(0 10px 25px ${question.color}cc)`,
            lineHeight: 1,
          }}
        >
          {question.emoji}
        </motion.div>
      </div>
    </motion.div>
  );
}

// 🌟 Stars Display
function StarsDisplay({ stars, animated = true, size = 50 }: { stars: 0 | 1 | 2 | 3; animated?: boolean; size?: number }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          initial={animated ? { scale: 0, rotate: -180 } : false}
          animate={animated ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 200 }}
        >
          {i <= stars ? (
            <img 
              src="/treasuer/star.webp" 
              alt="star" 
              style={{ 
                width: size, 
                height: size,
                filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.9))' 
              }} 
            />
          ) : (
            <Star 
              size={size} 
              className="text-white/20" 
              fill="rgba(255,255,255,0.05)"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function SpanishSagradaTestInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [globalQuestionIdx, setGlobalQuestionIdx] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<SpanishTestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [toroMood, setToroMood] = useState<ToroMood>('idle');
  const [toroMessage, setToroMessage] = useState<ToroMessage | null>(null);

  const [points, setPoints] = useState(1250);
  const [streak, setStreak] = useState(7);

  const currentRound = SPANISH_TEST_ROUNDS[currentRoundIdx];
  const currentQuestion = currentRound?.questions[currentQuestionIdx];

  useEffect(() => {
    const load = async () => {
      await getSpanishLessonProgress(LESSON_ID);
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (currentQuestion && phase === 'question') {
      if (currentQuestion.round === 'recognize') {
        setTimeout(() => speakSpanishWord(currentQuestion.word), 500);
      }
    }
  }, [currentQuestionIdx, currentRoundIdx, phase]);

  const handleToroReact = (mood: ToroMood) => {
    setToroMood(mood);
    const msg = mood === 'happy' ? SPANISH_ENCOURAGEMENTS : SPANISH_SAD_MESSAGES;
    setToroMessage(msg[Math.floor(Math.random() * msg.length)]);
    setTimeout(() => { setToroMood('idle'); setToroMessage(null); }, 2500);
  };

  const goToNextQuestion = () => {
    const nextQuestionIdx = currentQuestionIdx + 1;
    const nextGlobalIdx = globalQuestionIdx + 1;
    
    setInput('');
    setStatus('idle');
    setWrongChoice(null);
    
    if (nextQuestionIdx < currentRound.questions.length) {
      setCurrentQuestionIdx(nextQuestionIdx);
      setGlobalQuestionIdx(nextGlobalIdx);
    } else {
      if (currentRoundIdx < SPANISH_TEST_ROUNDS.length - 1) {
        setGlobalQuestionIdx(nextGlobalIdx);
        setPhase('round-complete');
      } else {
        setPhase('final-result');
      }
    }
  };

  const handleCorrect = (cx: number, cy: number) => {
    playCoinSound();
    setCorrectAnswers(c => c + 1);
    setPoints(p => p + 20);
    setStreak(s => s + 1);
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    handleToroReact('happy');
    
    setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const handleWrong = () => {
    playBuzzSound();
    setStreak(0);
    if (currentQuestion) {
      setWrongAnswers(w => [...w, currentQuestion]);
    }
    handleToroReact('sad');
    setStatus('wrong');
    
    setTimeout(() => {
      goToNextQuestion();
    }, 2000);
  };

  const handleRecognizeChoice = (chosenWord: string, e: React.MouseEvent) => {
    if (status !== 'idle') return;
    
    if (chosenWord === currentQuestion.word) {
      setStatus('correct');
      speakSpanishWord(currentQuestion.word);
      handleCorrect(e.clientX, e.clientY);
    } else {
      setWrongChoice(chosenWord);
      handleWrong();
    }
  };

  const handleWriteCheck = (e?: any) => {
    if (status !== 'idle' || !input.trim()) return;
    
    if (compareTestWords(input, currentQuestion.word)) {
      setStatus('correct');
      speakSpanishWord(currentQuestion.word);
      handleCorrect(e?.clientX || window.innerWidth/2, e?.clientY || window.innerHeight/2);
    } else {
      handleWrong();
    }
  };

  const handleSpeakDone = () => {
    if (status !== 'idle') return;
    setStatus('correct');
    handleCorrect(window.innerWidth/2, window.innerHeight/2);
  };

  const restartTest = () => {
    setPhase('intro');
    setCurrentRoundIdx(0);
    setCurrentQuestionIdx(0);
    setGlobalQuestionIdx(0);
    setCorrectAnswers(0);
    setWrongAnswers([]);
    setInput('');
    setStatus('idle');
    setWrongChoice(null);
  };

  const startTest = () => setPhase('round-intro');
  const startRound = () => setPhase('question');

  const goToNextRound = () => {
    setCurrentRoundIdx(r => r + 1);
    setCurrentQuestionIdx(0);
    setPhase('round-intro');
  };

  const saveAndExit = () => {
    const finalStars = calculateTestStars(correctAnswers, TOTAL_TEST_QUESTIONS);
    saveSpanishLessonProgress(LESSON_ID, finalStars, finalStars > 0);
    router.push('/spanish-character-and-map?map=3');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white font-black">جاري التحميل...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden" 
      style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img 
          src={isMobile ? "/maps/spanish-map-3-mob.webp" : "/maps/spanish-map-3-pc.webp"} 
          alt="bg" className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0" style={{
          background: isMobile 
            ? 'linear-gradient(180deg, rgba(20,15,50,0.88) 0%, rgba(10,5,30,0.95) 100%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(40,25,80,0.9) 0%, rgba(25,15,60,0.94) 50%, rgba(10,5,30,0.98) 100%)',
        }} />
        {/* تأثير ذهبي فخم في الخلفية */}
        <motion.div
          className="absolute inset-0 opacity-25"
          style={{ background: `radial-gradient(ellipse 100% 60% at 50% 30%, rgba(252,211,77,0.5), transparent 70%)` }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Top HUD */}
      {phase === 'question' && (
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
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-green-400/40 flex-1 justify-center">
                    <Check size={12} className="text-green-400" />
                    <span className="font-black text-[10px] text-white">{correctAnswers}/{TOTAL_TEST_QUESTIONS}</span>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 flex-shrink-0">
                  <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
                </div>
              </div>
              
              <div className="mt-1.5 px-2">
                <TestProgressBar current={globalQuestionIdx} total={TOTAL_TEST_QUESTIONS} isMobile />
              </div>
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
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-green-400/40">
                  <Check size={18} className="text-green-400" />
                  <span className="font-black text-white">{correctAnswers}/{TOTAL_TEST_QUESTIONS}</span>
                  <span className="text-[10px] text-green-200 font-bold">صحيح</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-orange-400/40">
                  <Flame size={18} className="text-orange-400" fill={streak > 0 ? '#FF4D6D' : 'none'} />
                  <span className="font-black text-white">{streak}</span>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <TestProgressBar current={globalQuestionIdx} total={TOTAL_TEST_QUESTIONS} isMobile={false} />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                  <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-3 pt-24 md:pt-32 pb-10">
        <AnimatePresence mode="wait">
          
          {/* ═══════ Phase: Intro ═══════ */}
          {phase === 'intro' && (
            <motion.div key="intro"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-6 max-w-2xl">
              
              <AnimatedCathedral size={isMobile ? 150 : 200} />
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-white">
                  ¡Examen del Mediterráneo!
                </h1>
                <p className="text-xl md:text-2xl font-bold text-yellow-300">
                  ⛪ اختبار سواحل المتوسط ⛪
                </p>
              </div>

              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 md:p-6 border-2 border-yellow-400/30 space-y-3 text-right">
                <h3 className="text-base md:text-lg font-black text-yellow-300 text-center">📋 معلومات الاختبار</h3>
                <div className="grid grid-cols-2 gap-3 text-sm md:text-base">
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-2xl md:text-3xl font-black text-white">15</div>
                    <div className="text-[10px] md:text-xs text-white/60">سؤال</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-2xl md:text-3xl font-black text-white">3</div>
                    <div className="text-[10px] md:text-xs text-white/60">جولات</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-2xl md:text-3xl font-black text-white">7</div>
                    <div className="text-[10px] md:text-xs text-white/60">مواضيع</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-2xl md:text-3xl font-black text-white">⭐⭐⭐</div>
                    <div className="text-[10px] md:text-xs text-white/60">نجوم</div>
                  </div>
                </div>
              </div>

              <p className="text-sm md:text-base text-white/70 max-w-md mx-auto">
                🎨 الاختبار بيغطي كل اللي اتعلمته: الوقت، الصحة، الرياضة، التسوق، المواصلات، الدول، والفن!
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startTest}
                className="px-10 md:px-14 py-4 md:py-5 rounded-2xl font-black text-xl md:text-2xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #FCD34D, #D97706)', 
                  boxShadow: '0 15px 40px rgba(252,211,77,0.5)',
                  borderBottom: '6px solid #B45309'
                }}
              >
                ابدأ التحدي 🚀
              </motion.button>
            </motion.div>
          )}

          {/* ═══════ Phase: Round Intro ═══════ */}
          {phase === 'round-intro' && currentRound && (
            <motion.div key={`round-intro-${currentRoundIdx}`}
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -30 }}
              className="text-center space-y-6 max-w-xl">
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', duration: 1 }}
                className="text-7xl md:text-9xl"
              >
                {currentRound.emoji}
              </motion.div>
              
              <div className="space-y-2">
                <p className="text-yellow-300 font-black text-sm md:text-base">
                  Ronda {currentRoundIdx + 1} / {SPANISH_TEST_ROUNDS.length}
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-white">
                  {currentRound.titleEs}
                </h2>
                <p className="text-xl md:text-2xl font-bold text-yellow-200">
                  {currentRound.title}
                </p>
              </div>

              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 border-2 border-yellow-400/30">
                <p className="text-sm md:text-base text-white">
                  📝 {currentRound.description}
                </p>
                <p className="text-xs md:text-sm text-yellow-300 font-bold mt-2">
                  {currentRound.questions.length} أسئلة
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRound}
                className="px-10 py-4 rounded-2xl font-black text-xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #58CC02, #4AA802)', 
                  boxShadow: '0 10px 30px rgba(88,204,2,0.5)',
                  borderBottom: '5px solid #3A8602'
                }}
              >
                لنبدأ! 💪
              </motion.button>
            </motion.div>
          )}

          {/* ═══════ Phase: Question ═══════ */}
          {phase === 'question' && currentQuestion && (
            <motion.div key={`question-${currentRoundIdx}-${currentQuestionIdx}`}
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-5xl">
              
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                {currentQuestion.round !== 'recognize' && (
                  <QuestionCard question={currentQuestion} size={isMobile ? 200 : 260} />
                )}
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  
                  {/* Round 1: Recognize */}
                  {currentQuestion.round === 'recognize' && currentQuestion.choices && (
                    <>
                      <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                        style={{ 
                          background: 'rgba(255,255,255,0.1)',
                          borderColor: `${currentQuestion.color}66`,
                        }}>
                        <span className="font-black text-white text-sm md:text-base">🎧 استمع واختر الصورة الصحيحة</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => speakSpanishWord(currentQuestion.word)}
                        className="relative rounded-full flex items-center justify-center border-4"
                        style={{ 
                          width: isMobile ? 80 : 100, 
                          height: isMobile ? 80 : 100,
                          background: `linear-gradient(135deg, #DC2626, #991B1B)`,
                          borderColor: 'rgba(255,255,255,0.4)',
                          boxShadow: `0 8px 30px rgba(220,38,38,0.6)`,
                        }}
                      >
                        <Volume2 size={isMobile ? 40 : 50} className="text-white" />
                      </motion.button>

                      <p className="text-xs text-white/60 text-center">اضغط للسماع مرة أخرى</p>

                      <div className="grid grid-cols-3 gap-3 md:gap-4 w-full mt-2">
                        {currentQuestion.choices.map((choice, idx) => {
                          const isWrong = wrongChoice === choice.word;
                          const isCorrect = status === 'correct' && choice.word === currentQuestion.word;
                          return (
                            <motion.button
                              key={`${currentQuestion.id}-${choice.word}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={
                                isWrong ? { x: [-8, 8, -8, 8, 0] } : 
                                isCorrect ? { scale: [1, 1.1, 1] } :
                                { scale: 1, opacity: 1 }
                              }
                              transition={
                                isWrong 
                                  ? { duration: 0.4 } 
                                  : isCorrect 
                                  ? { duration: 0.5, ease: 'easeInOut' }
                                  : { delay: idx * 0.1, type: 'spring' }
                              }
                              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                              onClick={(e) => handleRecognizeChoice(choice.word, e)}
                              disabled={status !== 'idle'}
                              className="relative rounded-2xl flex flex-col items-center gap-1 p-3 md:p-4 border-2 overflow-hidden"
                              style={{
                                background: isWrong 
                                  ? 'linear-gradient(135deg, #FF4444, #CC0000)' 
                                  : isCorrect
                                  ? 'linear-gradient(135deg, #22C55E, #15803D)'
                                  : 'rgba(255,255,255,0.08)',
                                borderColor: isWrong ? '#FF4444' : isCorrect ? '#22C55E' : 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                aspectRatio: '1',
                              }}
                            >
                              <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', lineHeight: 1 }}>
                                {choice.emoji}
                              </div>
                              <div className="text-[10px] md:text-xs font-bold text-white text-center" dir="ltr">
                                {choice.word}
                              </div>
                              {isCorrect && <Check size={20} className="absolute top-1 right-1 text-white" strokeWidth={3} />}
                              {isWrong && <X size={20} className="absolute top-1 right-1 text-white" strokeWidth={3} />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Round 2: Write */}
                  {currentQuestion.round === 'write' && (
                    <>
                      <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                        style={{ 
                          background: 'rgba(255,255,255,0.1)',
                          borderColor: `${currentQuestion.color}66`,
                        }}>
                        <span className="font-black text-white text-sm md:text-base">✍️ اكتب الكلمة بالإسباني</span>
                      </div>

                      <div className="text-center">
                        <p className="text-xl md:text-2xl font-black text-white">
                          {currentQuestion.wordAr}
                        </p>
                        <p className="text-xs text-white/60 mt-1">{currentQuestion.categoryAr}</p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => speakSpanishWord(currentQuestion.word)}
                        className="rounded-full flex items-center justify-center border-2"
                        style={{ 
                          width: 50, height: 50,
                          background: `linear-gradient(135deg, #DC2626, #991B1B)`,
                          borderColor: 'rgba(255,255,255,0.4)',
                          boxShadow: `0 4px 15px rgba(220,38,38,0.5)`,
                        }}
                      >
                        <Volume2 size={22} className="text-white" />
                      </motion.button>

                      <div className="w-full space-y-3">
                        <GhostInput 
                          value={input} 
                          onChange={(v) => { setInput(v); setStatus('idle'); }} 
                          onEnter={handleWriteCheck}
                          ghostText={currentQuestion.word} 
                          color={currentQuestion.color} 
                          status={status}
                          fontSize={isMobile ? '1.5rem' : '1.8rem'}
                        />
                        
                        {getRequiredSpanishSpecialChars(currentQuestion.word).length > 0 && (
                          <SpanishCharsKeyboard 
                            chars={getRequiredSpanishSpecialChars(currentQuestion.word)}
                            onChar={(c) => setInput(prev => prev + c)} 
                            color={currentQuestion.color} 
                          />
                        )}
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={handleWriteCheck} 
                        disabled={!input || status !== 'idle'}
                        className="w-full py-3.5 rounded-2xl font-black text-lg text-white disabled:opacity-30 flex items-center justify-center gap-2"
                        style={{ 
                          background: 'linear-gradient(135deg, #58CC02, #4AA802)', 
                          boxShadow: '0 6px 0 #3A8602, 0 8px 20px rgba(88,204,2,0.4)',
                        }}
                      >
                        إجابة <Check size={22} />
                      </motion.button>
                    </>
                  )}

                  {/* Round 3: Speak */}
                  {currentQuestion.round === 'speak' && (
                    <>
                      <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                        style={{ 
                          background: 'rgba(255,255,255,0.1)',
                          borderColor: `${currentQuestion.color}66`,
                        }}>
                        <span className="font-black text-white text-sm md:text-base">🎤 انطق الكلمة بصوت واضح</span>
                      </div>

                      <div className="text-center space-y-2">
                        <p className="text-3xl md:text-4xl font-black text-white" dir="ltr">
                          {currentQuestion.word}
                        </p>
                        <p className="text-base md:text-lg font-bold text-white/70">
                          {currentQuestion.wordAr}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => speakSpanishWord(currentQuestion.word)}
                        className="px-5 py-2 rounded-xl border-2 flex items-center gap-2 text-white text-sm font-bold"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          borderColor: `${currentQuestion.color}44`,
                        }}
                      >
                        <Volume2 size={16} /> اسمع النطق الصحيح
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={handleSpeakDone}
                        disabled={status !== 'idle'}
                        className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-4 disabled:opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${currentQuestion.gradient[0]}, ${currentQuestion.gradient[1]})`,
                          borderColor: 'rgba(255,255,255,0.3)',
                          boxShadow: `0 0 50px ${currentQuestion.color}66`,
                        }}
                      >
                        <Mic size={isMobile ? 45 : 55} className="text-white" />
                      </motion.button>

                      <p className="text-[10px] text-white/50 text-center">اضغط بعد ما تنطق الكلمة</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════ Phase: Round Complete ═══════ */}
          {phase === 'round-complete' && (
            <motion.div key="round-complete"
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 max-w-xl">
              
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1 }}
                className="text-7xl md:text-9xl"
              >
                🎉
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white">
                ¡Ronda completa!
              </h2>
              <p className="text-lg md:text-xl text-yellow-300 font-bold">
                خلصت {SPANISH_TEST_ROUNDS[currentRoundIdx].title}!
              </p>
              
              <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 border-2 border-yellow-400/30">
                <p className="text-sm text-white/80">حصلت على</p>
                <p className="text-3xl md:text-4xl font-black text-green-400">
                  {correctAnswers} / {globalQuestionIdx + 1}
                </p>
                <p className="text-xs text-white/60 mt-1">إجابة صحيحة حتى الآن</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={goToNextRound}
                className="px-10 py-4 rounded-2xl font-black text-xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #FCD34D, #D97706)', 
                  boxShadow: '0 10px 30px rgba(252,211,77,0.4)'
                }}
              >
                الجولة التالية ⏭️
              </motion.button>
            </motion.div>
          )}

          {/* ═══════ Phase: Final Result ═══════ */}
          {phase === 'final-result' && (
            <motion.div key="final-result"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center space-y-6 max-w-2xl">
              
              {(() => {
                const finalStars = calculateTestStars(correctAnswers, TOTAL_TEST_QUESTIONS);
                const resultMsg = getTestResultMessage(finalStars);
                const isExcellent = finalStars === 3;
                
                return (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 1 }}
                    >
                      <AnimatedCathedral size={isMobile ? 130 : 180} />
                    </motion.div>
                    
                    <div className="space-y-2">
                      <h1 className="text-3xl md:text-5xl font-black text-white">
                        {resultMsg.titleEs}
                      </h1>
                      <p className="text-xl md:text-2xl font-bold text-yellow-300">
                        {resultMsg.titleAr}
                      </p>
                    </div>

                    <StarsDisplay stars={finalStars} size={isMobile ? 50 : 70} />

                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 md:p-6 border-2 border-yellow-400/40 space-y-3">
                      <h3 className="text-base md:text-lg font-black text-yellow-300">📊 النتيجة النهائية</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-2">
                          <div className="text-2xl md:text-3xl font-black text-green-400">{correctAnswers}</div>
                          <div className="text-[10px] md:text-xs text-white/70">صحيح ✅</div>
                        </div>
                        <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-2">
                          <div className="text-2xl md:text-3xl font-black text-red-400">{wrongAnswers.length}</div>
                          <div className="text-[10px] md:text-xs text-white/70">خطأ ❌</div>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-2">
                          <div className="text-2xl md:text-3xl font-black text-yellow-400">
                            {Math.round((correctAnswers / TOTAL_TEST_QUESTIONS) * 100)}%
                          </div>
                          <div className="text-[10px] md:text-xs text-white/70">النسبة</div>
                        </div>
                      </div>
                      
                      <p className="text-sm md:text-base text-white/80 pt-2 border-t border-white/10">
                        {resultMsg.messageAr}
                      </p>
                    </div>

                    {wrongAnswers.length > 0 && (
                      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-red-400/30 space-y-2">
                        <p className="text-xs md:text-sm font-black text-red-300">📚 راجع هذه الكلمات:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {wrongAnswers.slice(0, 8).map((q, i) => (
                            <div key={i} className="bg-white/5 rounded-lg px-2 py-1 flex items-center gap-1 border border-white/10">
                              <span className="text-base">{q.emoji}</span>
                              <span className="text-[10px] font-bold text-white" dir="ltr">{q.word}</span>
                              <span className="text-[9px] text-white/60">({q.wordAr})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isExcellent && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-md rounded-2xl p-4 border-2 border-yellow-400/50"
                      >
                        <p className="text-base md:text-lg font-black text-yellow-300 mb-1">
                          🏆 إنجاز أسطوري! 🏆
                        </p>
                        <p className="text-xs md:text-sm text-white">
                          أنهيت <span className="font-black text-yellow-300">سواحل المتوسط</span> بنجاح! جاهز لأراضي الجنوب 🌅🌄
                        </p>
                      </motion.div>
                    )}

                    <div className="flex flex-col md:flex-row gap-3 justify-center pt-2">
                      {finalStars < 3 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={restartTest}
                          className="px-6 py-3 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2"
                          style={{ 
                            background: 'linear-gradient(135deg, #6B7280, #374151)', 
                            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                          }}
                        >
                          <RotateCcw size={18} /> إعادة الاختبار
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={saveAndExit}
                        className="px-8 py-3 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2"
                        style={{ 
                          background: 'linear-gradient(135deg, #FCD34D, #D97706)', 
                          boxShadow: '0 10px 30px rgba(252,211,77,0.5)',
                          borderBottom: '5px solid #B45309'
                        }}
                      >
                        <Home size={18} /> العودة للخريطة 🗺️
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {phase === 'question' && (
        <ToroBull mood={toroMood} message={toroMessage} idleGlowColor={currentQuestion?.color || '#FCD34D'} />
      )}
      
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={['#FCD34D', '#F59E0B', '#FFD700', '#EC4899', '#ffffff']} />
    </div>
  );
}

export default function SpanishSagradaTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">Loading...</div>}>
      <SpanishSagradaTestInner />
    </Suspense>
  );
}
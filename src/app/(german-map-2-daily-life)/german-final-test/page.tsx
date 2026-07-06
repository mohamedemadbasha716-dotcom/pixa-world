'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Sparkles, Volume2, Home, Trophy, Check, X, 
  Award, Crown, Download, ArrowRight, Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';

import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';

import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakWord } from '@/lib/audio/speech';

import { 
  ALL_MAP2_WORDS,
  TOTAL_WORDS_MAP2,
  getRandomWords,
  getRandomChoices,
  FINAL_TEST_INFO,
  type FinalTestItem 
} from '@/data/german/final-test';

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════
type Phase = 'intro' | 'listen' | 'write' | 'match' | 'certificate';

interface PhaseResult {
  correct: number;
  total: number;
  passed: boolean;
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══════════════════════════════════════
// 🎨 خلفية القلعة الذهبية
// ═══════════════════════════════════════
function CastleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* تدرج ذهبي ملكي */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at top, rgba(255,215,0,0.15) 0%, transparent 50%),
          linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #4a2c5e 60%, #2d1b4e 100%)
        `,
      }} />

      {/* نجوم متلألئة */}
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div key={`star-${i}`} className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            background: Math.random() > 0.5 ? '#FFD700' : 'white',
            boxShadow: `0 0 ${4 + Math.random() * 8}px ${Math.random() > 0.5 ? '#FFD700' : 'white'}`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }} />
      ))}

      {/* شعاع ذهبي من الأعلى */}
      <motion.div className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,215,0,0.25), transparent 70%)`,
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

      {/* جسيمات ذهبية صاعدة */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div key={`particle-${i}`} className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: -20,
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: `radial-gradient(circle, #FFD700, transparent)`,
            borderRadius: '50%',
            boxShadow: `0 0 12px #FFD700`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.9, 0.9, 0],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            delay: Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🎬 المرحلة 0: مقدمة احتفالية
// ═══════════════════════════════════════
function IntroPhase({ onStart, isMobile, totalStars }: {
  onStart: () => void;
  isMobile: boolean;
  totalStars: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="w-full max-w-2xl mx-auto px-4 py-6">
      
      <div className="relative rounded-[2rem] overflow-hidden p-6 md:p-10 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(45,27,78,0.85), rgba(74,44,94,0.85))',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '3px solid #FFD700',
          boxShadow: '0 20px 80px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 100px rgba(255,215,0,0.2)',
        }}>
        
        {/* قلعة كبيرة */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="select-none mb-4"
          style={{ 
            fontSize: isMobile ? '6rem' : '9rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 10px 30px rgba(255,215,0,0.6))',
          }}>
          🏰
        </motion.div>

        {/* تاج فوق */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="inline-block mb-3">
          <Crown size={isMobile ? 36 : 48} className="text-yellow-400" 
            style={{ filter: 'drop-shadow(0 0 20px #FFD700)' }} />
        </motion.div>

        {/* العنوان */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-black text-yellow-300 mb-2"
          style={{ 
            fontSize: isMobile ? '1.5rem' : '2.5rem',
            textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.6)',
          }}>
          🎯 التحدي الأخير 🎯
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/90 font-bold mb-6"
          style={{ fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
          أنت وصلت لـ <span className="text-yellow-300">قلعة المغامر</span>!
          <br />
          اجتاز التحدي واحصل على شهادة A1 — المستوى 2
        </motion.p>

        {/* إحصائيات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
          <div className="rounded-2xl p-3 md:p-4"
            style={{ background: 'rgba(255,215,0,0.15)', border: '2px solid rgba(255,215,0,0.4)' }}>
            <div className="text-2xl md:text-3xl mb-1">📚</div>
            <div className="font-black text-yellow-300 text-xl md:text-2xl">{TOTAL_WORDS_MAP2}</div>
            <div className="text-white/70 text-[10px] md:text-xs font-bold">كلمة تعلمتها</div>
          </div>
          <div className="rounded-2xl p-3 md:p-4"
            style={{ background: 'rgba(255,215,0,0.15)', border: '2px solid rgba(255,215,0,0.4)' }}>
            <div className="text-2xl md:text-3xl mb-1">⭐</div>
            <div className="font-black text-yellow-300 text-xl md:text-2xl">{totalStars}</div>
            <div className="text-white/70 text-[10px] md:text-xs font-bold">نجمة جمعتها</div>
          </div>
          <div className="rounded-2xl p-3 md:p-4"
            style={{ background: 'rgba(255,215,0,0.15)', border: '2px solid rgba(255,215,0,0.4)' }}>
            <div className="text-2xl md:text-3xl mb-1">🎯</div>
            <div className="font-black text-yellow-300 text-xl md:text-2xl">3</div>
            <div className="text-white/70 text-[10px] md:text-xs font-bold">مراحل التحدي</div>
          </div>
        </motion.div>

        {/* مراحل الاختبار */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-2 mb-6 text-right">
          {[
            { icon: '🎧', text: 'اختبار الاستماع (10 أسئلة)', need: 'لازم 7 صح' },
            { icon: '✍️', text: 'اختبار الكتابة (10 أسئلة)', need: 'لازم 7 صح' },
            { icon: '🎯', text: 'لعبة المطابقة الكبيرة (12 كلمة)', need: 'كلها صح' },
          ].map((stage, i) => (
            <motion.div key={i}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 + i * 0.15 }}
              className="flex items-center gap-3 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
              <div className="text-2xl">{stage.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm md:text-base">{stage.text}</div>
                <div className="text-yellow-300/70 text-[10px] md:text-xs font-bold">{stage.need}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* زرار البدء */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full md:w-auto px-12 py-4 rounded-2xl font-black text-lg md:text-xl text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 10px 40px rgba(255,215,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
            border: '2px solid #FFF',
          }}>
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            }} />
          <span className="relative">🚀 ابدأ التحدي!</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎧 مرحلة الاستماع
// ═══════════════════════════════════════
function ListenTestPhase({ questions, onComplete, isMobile }: {
  questions: FinalTestItem[];
  onComplete: (result: PhaseResult) => void;
  isMobile: boolean;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [choices, setChoices] = useState<FinalTestItem[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const currentWord = questions[currentIdx];

  useEffect(() => {
    if (!currentWord) return;
    setChoices(getRandomChoices(currentWord, 3));
    setWrongId(null);
    setAnswered(false);
    const t = setTimeout(() => speakWord(currentWord.de), 500);
    return () => clearTimeout(t);
  }, [currentIdx, currentWord]);

  const handleChoice = (choice: FinalTestItem) => {
    if (answered) return;
    setAnswered(true);

    if (choice.id === currentWord.id) {
      setCorrect(c => c + 1);
      playCoinSound();
      speakWord(currentWord.de);
    } else {
      setWrongId(choice.id);
      playBuzzSound();
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        const passed = (correct + (choice.id === currentWord.id ? 1 : 0)) >= 7;
        onComplete({ 
          correct: correct + (choice.id === currentWord.id ? 1 : 0), 
          total: questions.length, 
          passed 
        });
      }
    }, 1500);
  };

  if (!currentWord) return null;

  return (
    <motion.div
      key={`listen-${currentIdx}`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto px-4">
      
      {/* Progress */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)' }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="font-black text-yellow-300 text-sm">{currentIdx + 1}/{questions.length}</span>
        <div className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid #22c55e44' }}>
          ✓ {correct}
        </div>
      </div>

      <div className="rounded-3xl p-5 md:p-8 text-center"
        style={{
          background: 'rgba(45,27,78,0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255,215,0,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
        
        <div className="inline-block px-4 py-1 rounded-full mb-4 font-black text-xs"
          style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700', border: '1px solid #FFD70066' }}>
          🎧 استمع جيداً
        </div>

        {/* زرار الصوت الكبير */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => speakWord(currentWord.de)}
          className="mb-6 rounded-full flex items-center justify-center mx-auto"
          style={{
            width: isMobile ? 80 : 120,
            height: isMobile ? 80 : 120,
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 10px 40px rgba(255,215,0,0.6), inset 0 2px 0 rgba(255,255,255,0.4)',
          }}>
          <Volume2 size={isMobile ? 36 : 48} className="text-white" />
        </motion.button>

        <p className="text-white/60 text-sm font-bold mb-6">اختر الصورة الصحيحة 👇</p>

        {/* الخيارات */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {choices.map((choice, idx) => {
            const isWrong = wrongId === choice.id;
            const isCorrect = answered && choice.id === currentWord.id;
            return (
              <motion.button
                key={`${currentIdx}-${choice.id}-${idx}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={isWrong ? { x: [-8, 8, -8, 8, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring' }}
                whileHover={!answered ? { scale: 1.05, y: -3 } : {}}
                whileTap={!answered ? { scale: 0.95 } : {}}
                onClick={() => handleChoice(choice)}
                disabled={answered}
                className="aspect-square rounded-2xl flex items-center justify-center border-2 overflow-hidden relative"
                style={{
                  background: isCorrect ? 'linear-gradient(145deg, #22c55e, #15803d)'
                    : isWrong ? 'linear-gradient(145deg, #FF4444, #CC0000)'
                    : `linear-gradient(145deg, ${choice.gradient[0]}, ${choice.gradient[1]})`,
                  borderColor: isCorrect ? '#22c55e' : isWrong ? '#FF4444' : choice.color,
                  boxShadow: isCorrect ? '0 0 30px rgba(34,197,94,0.6)' 
                    : isWrong ? '0 0 30px rgba(255,68,68,0.6)' 
                    : `0 8px 24px ${choice.color}66`,
                }}>
                <span style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', lineHeight: 1 }}>
                  {choice.emoji}
                </span>
                {isCorrect && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-green-500/30">
                    <Check size={48} className="text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// ✍️ مرحلة الكتابة
// ═══════════════════════════════════════
function WriteTestPhase({ questions, onComplete, isMobile }: {
  questions: FinalTestItem[];
  onComplete: (result: PhaseResult) => void;
  isMobile: boolean;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentWord = questions[currentIdx];
  const requiredChars = currentWord ? getRequiredSpecialChars(currentWord.de) : [];

  useEffect(() => {
    setInput('');
    setStatus('idle');
  }, [currentIdx]);

  const handleCheck = () => {
    if (status !== 'idle') return;
    const isCorrect = input.trim().toLowerCase() === currentWord.de.toLowerCase();
    
    if (isCorrect) {
      setStatus('correct');
      setCorrect(c => c + 1);
      playCoinSound();
      speakWord(currentWord.de);
    } else {
      setStatus('wrong');
      playBuzzSound();
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        onComplete({ correct: finalCorrect, total: questions.length, passed: finalCorrect >= 7 });
      }
    }, 1500);
  };

  const handleSpecialChar = (c: string) => {
    setInput(prev => prev + c);
    inputRef.current?.focus();
  };

  if (!currentWord) return null;

  return (
    <motion.div
      key={`write-${currentIdx}`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto px-4">
      
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)' }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="font-black text-yellow-300 text-sm">{currentIdx + 1}/{questions.length}</span>
        <div className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid #22c55e44' }}>
          ✓ {correct}
        </div>
      </div>

      <div className="rounded-3xl p-5 md:p-8 text-center"
        style={{
          background: 'rgba(45,27,78,0.7)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255,215,0,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
        
        <div className="inline-block px-4 py-1 rounded-full mb-4 font-black text-xs"
          style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700', border: '1px solid #FFD70066' }}>
          ✍️ اكتب الكلمة
        </div>

        {/* الصورة الكبيرة */}
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-3 select-none"
          style={{ 
            fontSize: isMobile ? '6rem' : '9rem', 
            lineHeight: 1,
            filter: `drop-shadow(0 10px 30px ${currentWord.color}aa)`,
          }}>
          {currentWord.emoji}
        </motion.div>

        <p className="text-white/70 font-bold mb-4 text-sm md:text-base">
          {currentWord.ar}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => speakWord(currentWord.de)}
          className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white"
          style={{
            background: `linear-gradient(135deg, ${currentWord.color}cc, ${currentWord.color}88)`,
            boxShadow: `0 4px 15px ${currentWord.color}66`,
          }}>
          <Volume2 size={16} /> اسمع الكلمة
        </motion.button>

        <GhostInput 
          ref={inputRef}
          value={input}
          onChange={v => { setInput(v); setStatus('idle'); }}
          onEnter={handleCheck}
          ghostText={currentWord.de}
          color="#FFD700"
          status={status}
          fontSize={isMobile ? "1.5rem" : "1.8rem"}
        />

        {requiredChars.length > 0 && (
          <div className="mt-3">
            <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color="#FFD700" />
          </div>
        )}

        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 py-2.5 rounded-xl font-black text-sm"
              style={{
                background: status === 'correct' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                color: status === 'correct' ? '#22c55e' : '#ef4444',
                border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
              }}>
              {status === 'correct' ? `✅ ممتاز!` : `❌ الإجابة الصحيحة: ${currentWord.de}`}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          disabled={!input || status !== 'idle'}
          className="w-full mt-4 py-3 rounded-2xl font-black text-base text-white disabled:opacity-30"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 8px 30px rgba(255,215,0,0.5)',
          }}>
          تحقق ✓
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 Match Game الكبير
// ═══════════════════════════════════════
type DragSource = { id: string; side: 'emoji' | 'word' };

function FinalMatchGame({ words, onComplete, isMobile }: {
  words: FinalTestItem[];
  onComplete: (result: PhaseResult) => void;
  isMobile: boolean;
}) {
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords] = useState(() => shuffle(words));
  const [dragging, setDragging] = useState<DragSource | null>(null);
  const [overTarget, setOverTarget] = useState<DragSource | null>(null);
  const [wrongPair, setWrongPair] = useState<{ emoji: string; word: string } | null>(null);
  const [successPair, setSuccessPair] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);

  const touchDragging = useRef<DragSource | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (matched.size === words.length) {
      setTimeout(() => {
        onComplete({ correct: words.length, total: words.length, passed: true });
      }, 1000);
    }
  }, [matched, words.length, onComplete]);

  const tryMatch = (source: DragSource, target: DragSource) => {
    if (source.side === target.side) return;
    if (source.id === target.id) {
      const n = words.find(x => x.id === source.id)!;
      speakWord(n.de);
      playCoinSound();
      setSuccessPair(source.id);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, source.id]));
    } else {
      playBuzzSound();
      setErrors(e => e + 1);
      setWrongPair({ emoji: target.id, word: source.id });
      setTimeout(() => setWrongPair(null), 500);
    }
  };

  const handleDragStart = (src: DragSource) => setDragging(src);
  const handleDragEnd = () => { setDragging(null); setOverTarget(null); };
  const handleDragOver = (e: React.DragEvent, tgt: DragSource) => {
    e.preventDefault();
    if (dragging && dragging.side !== tgt.side) setOverTarget(tgt);
  };
  const handleDrop = (e: React.DragEvent, tgt: DragSource) => {
    e.preventDefault(); setOverTarget(null);
    if (dragging) tryMatch(dragging, tgt);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, src: DragSource) => {
    if (matched.has(src.id)) return;
    touchDragging.current = src;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.92;pointer-events:none;z-index:9998;border-radius:12px;transition:none;transform:scale(1.08);`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current || !touchDragging.current) return;
    const x = e.touches[0].clientX - touchOffRef.current.x;
    const y = e.touches[0].clientY - touchOffRef.current.y;
    touchCloneRef.current.style.left = x + 'px';
    touchCloneRef.current.style.top = y + 'px';
    const ex = e.touches[0].clientX, ey = e.touches[0].clientY;
    const oppositeSide = touchDragging.current.side === 'emoji' ? 'word' : 'emoji';
    let found: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${oppositeSide}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        found = { id: (el as HTMLElement).dataset.matchTarget!, side: oppositeSide as 'emoji' | 'word' };
      }
    });
    setOverTarget(found);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove();
    touchCloneRef.current = null;
    if (!touchDragging.current) { setOverTarget(null); return; }
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    const oppositeSide = touchDragging.current.side === 'emoji' ? 'word' : 'emoji';
    let dropped: DragSource | null = null;
    document.querySelectorAll(`[data-match-target][data-side="${oppositeSide}"]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        dropped = { id: (el as HTMLElement).dataset.matchTarget!, side: oppositeSide as 'emoji' | 'word' };
      }
    });
    if (dropped) tryMatch(touchDragging.current, dropped);
    setOverTarget(null);
    touchDragging.current = null;
  };

  const progress = (matched.size / words.length) * 100;
  const cardW = isMobile ? 52 : 70;
  const cardH = isMobile ? 64 : 85;

  const renderCard = (it: FinalTestItem, side: 'emoji' | 'word') => {
    const isMatched = matched.has(it.id);
    const isWrong = side === 'emoji' ? wrongPair?.emoji === it.id : wrongPair?.word === it.id;
    const isSuccess = successPair === it.id;
    const isDraggingThis = dragging?.id === it.id && dragging?.side === side;
    const isOver = overTarget?.id === it.id && overTarget?.side === side && !isMatched;

    if (isMatched) {
      return (
        <div key={`${side}-${it.id}`} style={{ width: cardW, height: cardH, opacity: 0.2 }}
          className="rounded-lg border-2 border-dashed border-green-500/40 flex items-center justify-center">
          <Check size={16} className="text-green-500/50" strokeWidth={2.5} />
        </div>
      );
    }

    return (
      <motion.div key={`${side}-${it.id}`}
        data-match-target={it.id} data-side={side} draggable
        onDragStart={() => handleDragStart({ id: it.id, side })} onDragEnd={handleDragEnd}
        onDragOver={e => handleDragOver(e, { id: it.id, side })} onDragLeave={() => setOverTarget(null)}
        onDrop={e => handleDrop(e, { id: it.id, side })}
        onTouchStart={e => onTouchStart(e, { id: it.id, side })}
        onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onClick={() => speakWord(it.de)}
        whileHover={{ scale: 1.05, y: -2 }}
        animate={
          isWrong ? { x: [-3, 3, -3, 3, 0] }
          : isSuccess ? { scale: [1, 1.12, 1] }
          : isOver ? { scale: 1.05 } : {}
        }
        className="relative select-none rounded-lg overflow-hidden border-2 flex items-center justify-center"
        style={{
          width: cardW, height: cardH, cursor: 'grab',
          background: `linear-gradient(180deg, ${it.gradient[0]}, ${it.gradient[1]})`,
          borderColor: isOver ? '#FFD700' : isWrong ? '#ef4444' : `${it.color}aa`,
          boxShadow: isDraggingThis ? `0 10px 30px ${it.color}cc, 0 0 35px ${it.color}99`
            : isOver ? '0 0 20px #FFD700cc'
            : isWrong ? '0 4px 12px rgba(239,68,68,0.7)' : `0 3px 10px ${it.color}66`,
        }}>
        {side === 'emoji' ? (
          <span style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', lineHeight: 1 }}>{it.emoji}</span>
        ) : (
          <div className="text-center px-1">
            <div className="font-black text-white" style={{ fontSize: isMobile ? '0.65rem' : '0.85rem', lineHeight: 1.1, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
              {it.de}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-3">
      
      <div className="flex items-center gap-3 mb-4 max-w-md mx-auto">
        <div className="px-3 py-1 rounded-full flex items-center gap-1.5"
          style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid #FFD70066' }}>
          <Sparkles size={11} className="text-yellow-300" />
          <span className="text-xs font-black text-yellow-300">طابق الكل!</span>
        </div>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)' }}
            animate={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-black text-white">{matched.size}/{words.length}</span>
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <span className="text-[10px] text-yellow-300/80 font-black uppercase">📸 الصور</span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {words.map(it => renderCard(it, 'emoji'))}
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
          <Sparkles size={10} className="text-yellow-300/50" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        </div>

        <div className="text-center">
          <span className="text-[10px] text-orange-300/80 font-black uppercase">🔤 الكلمات</span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1" dir="ltr">
            {shuffledWords.map(w => renderCard(w, 'word'))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🏆 الشهادة
// ═══════════════════════════════════════
function CertificateScreen({ results, totalStars, onContinue, isMobile }: {
  results: { listen: PhaseResult; write: PhaseResult; match: PhaseResult };
  totalStars: number;
  onContinue: () => void;
  isMobile: boolean;
}) {
  const [showCert, setShowCert] = useState(false);
  const today = new Date().toLocaleDateString('ar-EG', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  const totalCorrect = results.listen.correct + results.write.correct + results.match.correct;
  const totalQuestions = results.listen.total + results.write.total + results.match.total;

  useEffect(() => {
    setTimeout(() => setShowCert(true), 800);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto px-4 py-6">
      
      {/* احتفال */}
      <motion.div 
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        className="text-center mb-6">
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block"
          style={{ fontSize: isMobile ? '5rem' : '7rem' }}>
          🏆
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-black text-yellow-300 mt-2"
          style={{ 
            fontSize: isMobile ? '2rem' : '3rem',
            textShadow: '0 4px 20px rgba(255,215,0,0.6)',
          }}>
          🎉 مبروك! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/80 font-bold text-base md:text-lg mt-2">
          أنت بطل! نجحت في كل التحديات!
        </motion.p>
      </motion.div>

      {/* الشهادة */}
      <AnimatePresence>
        {showCert && (
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 100 }}
            className="relative rounded-3xl overflow-hidden p-5 md:p-10 mb-6"
            style={{
              background: 'linear-gradient(135deg, #FFF9E6, #FFE4B5)',
              border: '8px double #B8860B',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 100px rgba(255,215,0,0.4)',
            }}>
            
            {/* زخارف الزوايا */}
            <div className="absolute top-2 left-2 text-3xl">🏵️</div>
            <div className="absolute top-2 right-2 text-3xl">🏵️</div>
            <div className="absolute bottom-2 left-2 text-3xl">🏵️</div>
            <div className="absolute bottom-2 right-2 text-3xl">🏵️</div>

            {/* الترويسة */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <Crown size={isMobile ? 24 : 32} className="text-yellow-600" />
                <div className="font-black text-amber-900" style={{ fontSize: isMobile ? '1rem' : '1.3rem' }}>
                  PIXA WORLD
                </div>
                <Crown size={isMobile ? 24 : 32} className="text-yellow-600" />
              </div>
              <div className="text-amber-700 font-bold text-xs md:text-sm">
                شهادة إتمام المستوى الثاني
              </div>
              <div className="text-amber-600 text-[10px] md:text-xs font-bold mt-1">
                Zertifikat A1 - Stufe 2
              </div>
            </div>

            {/* خط فاصل */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent my-4" />

            {/* المحتوى الأساسي */}
            <div className="text-center my-4 md:my-6">
              <p className="text-amber-800 font-bold text-xs md:text-sm mb-2">
                هذه الشهادة تثبت أن
              </p>
              <div className="font-black text-amber-900 my-3"
                style={{ 
                  fontSize: isMobile ? '1.8rem' : '2.5rem',
                  fontFamily: "'Tajawal', serif",
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                ⭐ المغامر الصغير ⭐
              </div>
              <p className="text-amber-800 font-bold text-xs md:text-sm leading-relaxed mt-3">
                قد أتم بنجاح المستوى الثاني من رحلة تعلم اللغة الألمانية،
                <br />
                وتعلّم <span className="text-amber-900 font-black">{TOTAL_WORDS_MAP2} كلمة</span> 
                {' '}في 5 موضوعات أساسية
              </p>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 my-4 md:my-6">
              <div className="text-center p-2 md:p-3 rounded-lg"
                style={{ background: 'rgba(184,134,11,0.1)', border: '1px solid #B8860B' }}>
                <div className="text-lg md:text-2xl mb-1">🎧</div>
                <div className="font-black text-amber-900 text-sm md:text-base">{results.listen.correct}/{results.listen.total}</div>
                <div className="text-amber-700 text-[9px] md:text-[10px] font-bold">استماع</div>
              </div>
              <div className="text-center p-2 md:p-3 rounded-lg"
                style={{ background: 'rgba(184,134,11,0.1)', border: '1px solid #B8860B' }}>
                <div className="text-lg md:text-2xl mb-1">✍️</div>
                <div className="font-black text-amber-900 text-sm md:text-base">{results.write.correct}/{results.write.total}</div>
                <div className="text-amber-700 text-[9px] md:text-[10px] font-bold">كتابة</div>
              </div>
              <div className="text-center p-2 md:p-3 rounded-lg"
                style={{ background: 'rgba(184,134,11,0.1)', border: '1px solid #B8860B' }}>
                <div className="text-lg md:text-2xl mb-1">🎯</div>
                <div className="font-black text-amber-900 text-sm md:text-base">{results.match.correct}/{results.match.total}</div>
                <div className="text-amber-700 text-[9px] md:text-[10px] font-bold">مطابقة</div>
              </div>
            </div>

            {/* المهارات */}
            <div className="my-4">
              <p className="text-amber-800 font-bold text-[10px] md:text-xs text-center mb-2">
                🎓 المهارات المكتسبة:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {FINAL_TEST_INFO.certificate.skills.map((skill, i) => (
                  <div key={i} className="px-2 py-1 rounded-full text-[10px] md:text-xs font-bold"
                    style={{ background: 'rgba(184,134,11,0.15)', color: '#78350F', border: '1px solid #B8860B66' }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* خط فاصل */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent my-4" />

            {/* التوقيع */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-1">🦅</div>
                <div className="text-[10px] md:text-xs font-bold text-amber-800">كارل النسر</div>
                <div className="text-[9px] md:text-[10px] text-amber-600">المرشد</div>
              </div>

              <div className="text-center">
                <div className="font-black text-amber-900 text-base md:text-xl">{FINAL_TEST_INFO.certificate.level}</div>
                <div className="text-[9px] md:text-[10px] text-amber-600 font-bold mt-1">المستوى المنجز</div>
              </div>

              <div className="text-center">
                <Award size={isMobile ? 32 : 40} className="text-yellow-600 mx-auto mb-1" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }} />
                <div className="text-[10px] md:text-xs font-bold text-amber-800">{today}</div>
                <div className="text-[9px] md:text-[10px] text-amber-600">التاريخ</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الأزرار */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col md:flex-row gap-3 justify-center">
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-white text-sm md:text-base"
          style={{
            background: 'linear-gradient(135deg, #3498DB, #1A5276)',
            boxShadow: '0 8px 30px rgba(52,152,219,0.5)',
          }}>
          <Download size={18} /> حفظ الشهادة
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-white text-sm md:text-base relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 8px 30px rgba(255,215,0,0.6)',
          }}>
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
          <span className="relative flex items-center gap-2">
            <Sparkles size={18} /> ادخل الخريطة الجديدة <ArrowRight size={18} />
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════
function GermanFinalTestInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>('intro');
  const [isLoading, setIsLoading] = useState(true);
  const [totalStars, setTotalStars] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');

  // الأسئلة
  const [listenQuestions] = useState(() => getRandomWords(10));
  const [writeQuestions] = useState(() => getRandomWords(10));
  const [matchWords] = useState(() => getRandomWords(12));

  // النتائج
  const [results, setResults] = useState({
    listen: { correct: 0, total: 10, passed: false },
    write: { correct: 0, total: 10, passed: false },
    match: { correct: 0, total: 12, passed: false },
  });

  const LESSON_ID = FINAL_TEST_INFO.lessonId;

  useEffect(() => {
    const load = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) setTotalStars(progress.stars);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleStart = () => {
    setPhase('listen');
    setKarlMood('happy');
  };

  const handleListenComplete = (result: PhaseResult) => {
    setResults(r => ({ ...r, listen: result }));
    setConfettiTrigger(t => t + 1);
    setKarlMood('celebrate');
    setTimeout(() => setPhase('write'), 1500);
  };

  const handleWriteComplete = (result: PhaseResult) => {
    setResults(r => ({ ...r, write: result }));
    setConfettiTrigger(t => t + 1);
    setKarlMood('celebrate');
    setTimeout(() => setPhase('match'), 1500);
  };

  const handleMatchComplete = async (result: PhaseResult) => {
    setResults(r => ({ ...r, match: result }));
    setConfettiTrigger(t => t + 1);
    setKarlMood('celebrate');
    
    // حفظ التقدم
    await saveLessonProgress(LESSON_ID, 3, true);
    
    setTimeout(() => setPhase('certificate'), 1500);
  };

  const handleContinue = () => {
    router.push('/character-and-map?map=3&from=lesson');
  };

  const handleHome = () => {
    router.push('/character-and-map?map=2&from=lesson');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0a2e]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏰</div>
          <p className="text-white font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white relative min-h-screen" 
      style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      
      <CastleBackground />

      <ConfettiBurst 
        trigger={confettiTrigger}
        x={typeof window !== 'undefined' ? window.innerWidth / 2 : 400}
        y={typeof window !== 'undefined' ? window.innerHeight / 2 : 300}
        colors={['#FFD700', '#FFA500', '#FF4500', '#FFFFFF', '#9D4EDD']}
      />

      {/* Karl */}
      {phase !== 'certificate' && (
        <div style={{ 
          transform: isMobile ? 'scale(0.35)' : 'scale(0.5)', 
          transformOrigin: 'bottom right', 
          position: 'fixed', bottom: 10, right: 0, zIndex: 25, pointerEvents: 'none' 
        }}>
          <KarlEagle mood={karlMood} message={null} idleGlowColor="#FFD700" />
        </div>
      )}

      {/* زرار الرجوع */}
      {phase !== 'certificate' && (
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={handleHome}
          className="fixed top-4 right-4 z-30 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(45,27,78,0.7)', 
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,215,0,0.4)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          }}>
          <Home size={20} className="text-white" />
        </motion.button>
      )}

      {/* المحتوى */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-6">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <IntroPhase 
              key="intro"
              onStart={handleStart} 
              isMobile={isMobile}
              totalStars={totalStars}
            />
          )}
          {phase === 'listen' && (
            <ListenTestPhase 
              key="listen"
              questions={listenQuestions}
              onComplete={handleListenComplete}
              isMobile={isMobile}
            />
          )}
          {phase === 'write' && (
            <WriteTestPhase 
              key="write"
              questions={writeQuestions}
              onComplete={handleWriteComplete}
              isMobile={isMobile}
            />
          )}
          {phase === 'match' && (
            <FinalMatchGame 
              key="match"
              words={matchWords}
              onComplete={handleMatchComplete}
              isMobile={isMobile}
            />
          )}
          {phase === 'certificate' && (
            <CertificateScreen 
              key="certificate"
              results={results}
              totalStars={totalStars}
              onContinue={handleContinue}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-print, .certificate-print * { visibility: visible; }
          .certificate-print { position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </div>
  );
}

export default function GermanFinalTest() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1a0a2e]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏰</div>
          <p className="text-white font-bold">جاري التحميل...</p>
        </div>
      </div>
    }>
      <GermanFinalTestInner />
    </Suspense>
  );
}
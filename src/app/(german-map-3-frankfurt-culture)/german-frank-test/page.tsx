'use client';
import { useState, useEffect, useRef } from 'react';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Sparkles, Volume2, Home, Check, X, Trophy, Award, 
  Download, Share2, ChevronRight, Clock, Target, Mic
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress, getPlayer } from '@/lib/playerData';

import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';

import type { KarlMood } from '@/lib/types/lesson';
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakNumber as speakGerman } from '@/lib/audio/speech';

import { 
  FINAL_TEST_QUESTIONS, 
  TOTAL_TEST_POINTS, 
  PASSING_SCORE,
  CATEGORY_LABELS,
  type TestQuestion 
} from '@/data/german/frankfurt-final-test';

const LESSON_ID = 'frankfurt-frank-test';

type TestPhase = 'intro' | 'testing' | 'results' | 'certificate';
type AnswerStatus = 'idle' | 'correct' | 'wrong';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// ═══════════════════════════════════════
// 🎬 شاشة المقدمة (Intro)
// ═══════════════════════════════════════
function IntroScreen({ onStart, heroName }: { onStart: () => void; heroName: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12"
        style={{
          background: 'linear-gradient(180deg, rgba(20,15,55,0.95), rgba(15,10,45,0.98))',
          border: '3px solid #FFD700',
          boxShadow: '0 20px 80px rgba(255,215,0,0.4), 0 0 100px rgba(124,58,237,0.5)',
        }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 50% 0%, #FFD700, transparent 70%)' }} />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 0 40px rgba(255,215,0,0.8)',
              }}
            >
              <Trophy size={64} className="text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-black text-white mb-3"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            الاختبار النهائي A1
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 text-lg font-bold mb-2"
          >
            مبروك يا <span className="text-yellow-400">{heroName}</span>!
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/50 text-sm mb-8"
          >
            وصلت لنهاية رحلة فرانكفورت. خد نفس عميق وابدأ! 🦅
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <Target size={24} className="text-cyan-400 mx-auto mb-1" />
              <div className="text-xl font-black text-white">{FINAL_TEST_QUESTIONS.length}</div>
              <div className="text-[10px] font-bold text-white/60">سؤال</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <Clock size={24} className="text-yellow-400 mx-auto mb-1" />
              <div className="text-xl font-black text-white">~10</div>
              <div className="text-[10px] font-bold text-white/60">دقايق</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <Star size={24} className="text-green-400 mx-auto mb-1" fill="#22c55e" />
              <div className="text-xl font-black text-white">{PASSING_SCORE}%</div>
              <div className="text-[10px] font-bold text-white/60">للنجاح</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6"
          >
            <p className="text-yellow-200 text-sm font-bold flex items-center justify-center gap-2">
              <Award size={18} />
              لو نجحت هتاخد شهادة A1 معتمدة! 🎓
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              boxShadow: '0 10px 40px rgba(255,215,0,0.5)',
            }}
          >
            <span>ابدأ الاختبار 🚀</span>
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 📊 شريط التقدم
// ═══════════════════════════════════════
function ProgressBar({ current, total, score }: { current: number; total: number; score: number }) {
  const percent = (current / total) * 100;
  return (
    <div className="fixed top-0 left-0 right-0 z-30 p-4 bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black text-white">سؤال {current} من {total}</span>
            <span className="text-xs font-black text-yellow-400">{score} نقطة ⭐</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full"
              style={{ background: 'linear-gradient(to right, #FFD700, #FF8C00)' }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}// ═══════════════════════════════════════
// 🎯 سؤال Multiple Choice
// ═══════════════════════════════════════
function MultipleChoiceQuestion({ question, onAnswer }: { 
  question: TestQuestion; 
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<AnswerStatus>('idle');

  const handleSelect = (option: string) => {
    if (status !== 'idle') return;
    setSelected(option);
    const correct = option === question.correctAnswer;
    setStatus(correct ? 'correct' : 'wrong');
    if (correct) playCoinSound();
    else playBuzzSound();
    setTimeout(() => onAnswer(correct), 1500);
  };

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 60 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-[2rem] p-6 md:p-8"
        style={{
          background: 'rgba(20,15,55,0.55)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="text-center mb-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-2">
            {CATEGORY_LABELS[question.category].emoji} {CATEGORY_LABELS[question.category].ar}
          </div>
          <h2 className="text-2xl font-black text-white mb-4">{question.question}</h2>
          
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl md:text-9xl my-6"
          >
            {question.emoji}
          </motion.div>

          <div className="text-sm font-bold text-white/50">{question.ar}</div>
        </div>

        <div className="grid gap-3">
          {question.options?.map((option, idx) => {
            const isSelected = selected === option;
            const isCorrect = option === question.correctAnswer;
            const showCorrect = status !== 'idle' && isCorrect;
            const showWrong = status === 'wrong' && isSelected;

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={status === 'idle' ? { scale: 1.02, y: -2 } : {}}
                whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option)}
                disabled={status !== 'idle'}
                className="relative w-full py-4 px-6 rounded-2xl font-black text-lg text-white border-2 transition-all"
                style={{
                  background: showCorrect 
                    ? 'linear-gradient(135deg, #22c55e, #15803d)'
                    : showWrong
                    ? 'linear-gradient(135deg, #ef4444, #991b1b)'
                    : isSelected
                    ? 'linear-gradient(135deg, #7c3aed, #5b21b6)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: showCorrect ? '#22c55e' : showWrong ? '#ef4444' : 'rgba(255,255,255,0.1)',
                  boxShadow: showCorrect ? '0 8px 30px rgba(34,197,94,0.5)' : showWrong ? '0 8px 30px rgba(239,68,68,0.5)' : 'none',
                }}
              >
                <div className="flex items-center justify-between" dir="ltr">
                  <span>{option}</span>
                  {showCorrect && <Check size={24} strokeWidth={3} />}
                  {showWrong && <X size={24} strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎧 سؤال Listening
// ═══════════════════════════════════════
function ListeningQuestion({ question, onAnswer }: { 
  question: TestQuestion; 
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<AnswerStatus>('idle');
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      speakGerman(question.questionDe || question.correctAnswer);
      setHasPlayed(true);
    }, 500);
  }, [question.id]);

  const handlePlayAgain = () => {
    speakGerman(question.questionDe || question.correctAnswer);
  };

  const handleSelect = (option: string) => {
    if (status !== 'idle') return;
    setSelected(option);
    const correct = option === question.correctAnswer;
    setStatus(correct ? 'correct' : 'wrong');
    if (correct) playCoinSound();
    else playBuzzSound();
    setTimeout(() => onAnswer(correct), 1500);
  };

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 60 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-[2rem] p-6 md:p-8"
        style={{
          background: 'rgba(20,15,55,0.55)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="text-center mb-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">
            🎧 Hörverstehen · استماع
          </div>
          <h2 className="text-2xl font-black text-white mb-6">{question.question}</h2>
          
          <motion.button
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={hasPlayed ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: hasPlayed ? 0 : Infinity }}
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 border-4"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0e7490)',
              borderColor: '#06b6d4',
              boxShadow: '0 0 40px rgba(6,182,212,0.6)',
            }}
          >
            <Volume2 size={40} className="text-white" />
          </motion.button>

          <p className="text-white/40 text-xs font-bold">اضغط لإعادة الاستماع</p>
        </div>

        <div className="grid gap-3">
          {question.options?.map((option, idx) => {
            const isSelected = selected === option;
            const isCorrect = option === question.correctAnswer;
            const showCorrect = status !== 'idle' && isCorrect;
            const showWrong = status === 'wrong' && isSelected;

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={status === 'idle' ? { scale: 1.02 } : {}}
                whileTap={status === 'idle' ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option)}
                disabled={status !== 'idle'}
                className="w-full py-4 px-6 rounded-2xl font-black text-lg text-white border-2"
                style={{
                  background: showCorrect 
                    ? 'linear-gradient(135deg, #22c55e, #15803d)'
                    : showWrong
                    ? 'linear-gradient(135deg, #ef4444, #991b1b)'
                    : isSelected
                    ? 'linear-gradient(135deg, #06b6d4, #0e7490)'
                    : 'rgba(255,255,255,0.05)',
                  borderColor: showCorrect ? '#22c55e' : showWrong ? '#ef4444' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between" dir="ltr">
                  <span>{option}</span>
                  {showCorrect && <Check size={24} strokeWidth={3} />}
                  {showWrong && <X size={24} strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// ✍️ سؤال Writing
// ═══════════════════════════════════════
function WritingQuestion({ question, onAnswer }: { 
  question: TestQuestion; 
  onAnswer: (correct: boolean) => void;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AnswerStatus>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput('');
    setStatus('idle');
  }, [question.id]);

  const handleCheck = () => {
    if (status !== 'idle' || !input.trim()) return;
    const correct = input.trim().toLowerCase() === question.correctAnswer.toLowerCase();
    setStatus(correct ? 'correct' : 'wrong');
    if (correct) playCoinSound();
    else playBuzzSound();
    setTimeout(() => onAnswer(correct), 1500);
  };

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 60 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-[2rem] p-6 md:p-8"
        style={{
          background: 'rgba(20,15,55,0.55)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="text-center mb-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-2">
            ✍️ Schreiben · كتابة
          </div>
          <h2 className="text-2xl font-black text-white mb-4">{question.question}</h2>
          
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl my-6"
          >
            {question.emoji}
          </motion.div>

          <div className="text-sm font-bold text-white/50">{question.ar}</div>
        </div>

        <div className="space-y-4">
          <GhostInput
            ref={inputRef}
            value={input}
            onChange={v => { setInput(v); if (status !== 'idle') setStatus('idle'); }}
            onEnter={handleCheck}
            ghostText={question.correctAnswer}
            color="#EC4899"
            status={status}
            fontSize="1.8rem"
          />

          {question.hint && status === 'idle' && (
            <div className="text-center">
              <p className="text-xs font-bold text-white/40">
                💡 تلميح: <span dir="ltr" className="text-yellow-400 font-mono">{question.hint}</span>
              </p>
            </div>
          )}

          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-3 rounded-xl font-black"
                style={{
                  background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                  color: status === 'correct' ? '#22c55e' : '#ef4444',
                }}
              >
                {status === 'correct' ? '✅ صحيح!' : `❌ الإجابة: ${question.correctAnswer}`}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={!input.trim() || status !== 'idle'}
            className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-30"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              boxShadow: '0 8px 30px rgba(236,72,153,0.4)',
            }}
          >
            تحقق ✓
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 سؤال Matching
// ═══════════════════════════════════════
function MatchingQuestion({ question, onAnswer }: { 
  question: TestQuestion; 
  onAnswer: (correct: boolean) => void;
}) {
  const pairs = question.matchingPairs || [];
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedDe, setSelectedDe] = useState<string | null>(null);
  const [shuffledAr] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  useEffect(() => {
    if (matched.size === pairs.length && pairs.length > 0) {
      setTimeout(() => onAnswer(true), 800);
    }
  }, [matched, pairs.length]);

  const handleArClick = (arWord: string) => {
    if (!selectedDe) return;
    const dePair = pairs.find(p => p.de === selectedDe);
    if (dePair?.ar === arWord) {
      setMatched(prev => new Set([...prev, selectedDe]));
      setSelectedDe(null);
      playCoinSound();
    } else {
      setWrongPair(arWord);
      playBuzzSound();
      setTimeout(() => { setWrongPair(null); setSelectedDe(null); }, 600);
    }
  };

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 60 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="rounded-[2rem] p-6 md:p-8"
        style={{
          background: 'rgba(20,15,55,0.55)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <div className="text-center mb-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">
            🎯 Zuordnen · مطابقة
          </div>
          <h2 className="text-xl font-black text-white">{question.question}</h2>
          <div className="text-xs font-bold text-white/40 mt-2">
            ({matched.size}/{pairs.length})
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-xs font-black text-cyan-400 text-center mb-2">🇩🇪 بالألماني</div>
            {pairs.map(pair => {
              const isMatched = matched.has(pair.de);
              const isSelected = selectedDe === pair.de;
              return (
                <motion.button
                  key={pair.de}
                  onClick={() => !isMatched && setSelectedDe(pair.de)}
                  disabled={isMatched}
                  whileHover={!isMatched ? { scale: 1.03 } : {}}
                  className="w-full py-3 px-3 rounded-xl font-black text-sm md:text-base border-2"
                  style={{
                    background: isMatched 
                      ? 'rgba(34,197,94,0.2)' 
                      : isSelected 
                      ? 'linear-gradient(135deg, #06b6d4, #0e7490)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isMatched ? '#22c55e' : isSelected ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                    color: isMatched ? '#22c55e' : 'white',
                    opacity: isMatched ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center justify-center gap-2" dir="ltr">
                    <span>{pair.emoji}</span>
                    <span>{pair.de}</span>
                    {isMatched && <Check size={16} />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black text-pink-400 text-center mb-2">🇪🇬 بالعربي</div>
            {shuffledAr.map(pair => {
              const isMatched = matched.has(pair.de);
              const isWrong = wrongPair === pair.ar;
              return (
                <motion.button
                  key={pair.ar}
                  onClick={() => handleArClick(pair.ar)}
                  disabled={isMatched}
                  whileHover={!isMatched && selectedDe ? { scale: 1.03 } : {}}
                  animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                  className="w-full py-3 px-3 rounded-xl font-black text-sm md:text-base border-2"
                  style={{
                    background: isMatched 
                      ? 'rgba(34,197,94,0.2)' 
                      : isWrong
                      ? 'linear-gradient(135deg, #ef4444, #991b1b)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isMatched ? '#22c55e' : isWrong ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    color: isMatched ? '#22c55e' : 'white',
                    opacity: isMatched ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{pair.ar}</span>
                    {isMatched && <Check size={16} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {selectedDe && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-yellow-400 text-sm font-bold"
          >
            👆 اختر المعنى الصحيح بالعربي
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}// ═══════════════════════════════════════
// 🏆 شاشة النتائج
// ═══════════════════════════════════════
function ResultsScreen({ score, total, onShowCertificate, onRetry, onHome }: {
  score: number;
  total: number;
  onShowCertificate: () => void;
  onRetry: () => void;
  onHome: () => void;
}) {
  const percent = Math.round((score / total) * 100);
  const passed = percent >= PASSING_SCORE;

  useEffect(() => {
    if (passed) playComboSound();
  }, [passed]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(20,15,55,0.95), rgba(15,10,45,0.98))',
          border: passed ? '3px solid #FFD700' : '3px solid #ef4444',
          boxShadow: passed 
            ? '0 20px 80px rgba(255,215,0,0.4)' 
            : '0 20px 80px rgba(239,68,68,0.3)',
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-9xl mb-4"
        >
          {passed ? '🏆' : '💪'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-black text-white mb-3"
        >
          {passed ? 'مبروك! 🎉' : 'حاول مرة تانية!'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-lg mb-8"
        >
          {passed 
            ? 'أنت رسمياً مستوى A1 في الألمانية! 🇩🇪' 
            : 'قريب جداً من النجاح. خد نفس وحاول تاني!'}
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.6 }}
          className="relative w-48 h-48 mx-auto mb-8"
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none"
              stroke={passed ? '#FFD700' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percent / 100 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              style={{ filter: `drop-shadow(0 0 10px ${passed ? '#FFD700' : '#ef4444'})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-5xl font-black"
              style={{ color: passed ? '#FFD700' : '#ef4444' }}
            >
              {percent}%
            </motion.div>
            <div className="text-xs font-bold text-white/60">{score}/{total} نقطة</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          {passed ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onShowCertificate}
              className="w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                boxShadow: '0 10px 40px rgba(255,215,0,0.5)',
              }}
            >
              <Award size={24} />
              <span>استلم شهادتك! 🎓</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetry}
              className="w-full py-5 rounded-2xl font-black text-xl text-white"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                boxShadow: '0 10px 40px rgba(124,58,237,0.5)',
              }}
            >
              🔄 حاول تاني
            </motion.button>
          )}

          <button
            onClick={onHome}
            className="w-full py-3 rounded-2xl font-bold text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all"
          >
            رجوع للخريطة
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎓 الشهادة الفاخرة (Goethe Style)
// ═══════════════════════════════════════
function CertificateScreen({ heroName, score, total, onHome }: {
  heroName: string;
  score: number;
  total: number;
  onHome: () => void;
}) {
  const percent = Math.round((score / total) * 100);
  const today = new Date().toLocaleDateString('ar-EG', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  const certId = `PW-A1-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = () => {
    alert('🎓 سيتم إضافة ميزة التحميل قريباً! اعمل Screenshot دلوقتي 📸');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'شهادة A1 - بيكسا وورلد',
          text: `حصلت على شهادة A1 في الألمانية من Pixa World! 🎓`,
        });
      } catch {}
    } else {
      alert('شارك إنجازك مع أصحابك! 🎉');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 80, delay: 0.3 }}
        className="relative aspect-[1.4/1] rounded-[2rem] overflow-hidden mb-6"
        style={{
          background: 'linear-gradient(135deg, #FFF8E1 0%, #FFE082 50%, #FFD54F 100%)',
          boxShadow: '0 30px 100px rgba(255,215,0,0.5), inset 0 0 50px rgba(255,255,255,0.5)',
          border: '6px solid #B8860B',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}>
              <Sparkles size={20 + Math.random() * 30} className="text-amber-700" />
            </div>
          ))}
        </div>

        <div className="absolute inset-4 border-4 border-amber-700 rounded-2xl" />
        <div className="absolute inset-6 border-2 border-amber-600 rounded-xl" />

        <div className="relative h-full flex flex-col items-center justify-between p-8 md:p-12 text-center">
          
          <div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="inline-block mb-2"
            >
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #8B4513, #654321)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                <Trophy size={32} className="text-yellow-300" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-amber-900 font-black text-xs md:text-sm tracking-widest mb-1"
            >
              PIXA WORLD ACADEMY
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="text-2xl md:text-4xl font-black text-amber-900 mb-1"
              style={{ fontFamily: 'serif' }}
            >
              Zertifikat
            </motion.div>
            <div className="text-xs md:text-sm font-bold text-amber-800">شهادة إتمام</div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-amber-800 text-xs md:text-sm mb-3"
            >
              يُمنح هذا الشهادة إلى
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="mb-3 px-6 py-2 inline-block"
              style={{
                borderTop: '2px solid #B8860B',
                borderBottom: '2px solid #B8860B',
              }}
            >
              <div className="text-3xl md:text-5xl font-black text-amber-950"
                style={{ fontFamily: 'serif' }}
              >
                {heroName}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="text-amber-800 text-xs md:text-sm leading-relaxed max-w-md mx-auto"
            >
              لإكماله بنجاح اختبار اللغة الألمانية - المستوى الأول
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9, type: 'spring' }}
              className="mt-2 inline-block px-6 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #8B4513)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              <div className="text-white font-black text-lg md:text-2xl">
                A1 · Anfänger
              </div>
            </motion.div>
          </div>

          <div className="w-full flex items-end justify-between text-amber-900 text-[10px] md:text-xs">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.1 }}
              className="text-right"
            >
              <div className="font-bold mb-1">📅 التاريخ</div>
              <div className="text-amber-800">{today}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.3, type: 'spring' }}
              className="relative"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4"
                style={{
                  background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                  borderColor: '#FFD700',
                  transform: 'rotate(-15deg)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                }}
              >
                <div className="text-center text-white">
                  <div className="text-[8px] font-black">APPROVED</div>
                  <div className="text-lg font-black">{percent}%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.1 }}
              className="text-left"
            >
              <div className="font-bold mb-1">🆔 رقم الشهادة</div>
              <div className="text-amber-800 font-mono text-[9px]">{certId}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        <button
          onClick={handleDownload}
          className="py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)' }}
        >
          <Download size={18} /> تحميل
        </button>
        <button
          onClick={handleShare}
          className="py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)' }}
        >
          <Share2 size={18} /> مشاركة
        </button>
        <button
          onClick={onHome}
          className="col-span-2 md:col-span-1 py-3 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #22c55e, #15803d)' }}
        >
          <Home size={18} /> الخريطة
        </button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════
function GermanFrankTestInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [heroName, setHeroName] = useState('البطل');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');

  useEffect(() => {
    getPlayer().then(p => {
      if (p?.hero_name) setHeroName(p.hero_name);
    });
  }, []);

  const handleAnswer = (correct: boolean) => {
    const question = FINAL_TEST_QUESTIONS[currentQuestion];
    if (correct) {
      setScore(s => s + question.points);
      setKarlMood('happy');
      setConfettiTrigger(t => t + 1);
    } else {
      setKarlMood('sad');
    }
    setTimeout(() => setKarlMood('idle'), 1500);

    setTimeout(() => {
      if (currentQuestion < FINAL_TEST_QUESTIONS.length - 1) {
        setCurrentQuestion(c => c + 1);
      } else {
        const finalScore = score + (correct ? question.points : 0);
        const percent = Math.round((finalScore / TOTAL_TEST_POINTS) * 100);
        const passed = percent >= PASSING_SCORE;
        saveLessonProgress(LESSON_ID, passed ? 3 : 1, passed);
        setPhase('results');
      }
    }, 1700);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setPhase('testing');
  };

  const handleShowCertificate = () => setPhase('certificate');
  const handleHome = () => router.push('/character-and-map?from=lesson&map=3');

  const question = FINAL_TEST_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen relative text-white" 
      style={{ fontFamily: "'Tajawal', sans-serif", background: '#07090D' }} 
      dir="rtl"
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,215,0,0.15), transparent 70%)' }} />
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2 + Math.random() * 2,
              height: 2 + Math.random() * 2,
              background: 'white',
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <ConfettiBurst trigger={confettiTrigger} 
        x={typeof window !== 'undefined' ? window.innerWidth / 2 : 0} 
        y={typeof window !== 'undefined' ? window.innerHeight / 2 : 0} 
        colors={['#FFD700', '#FF8C00', '#FFFFFF', '#22c55e']} 
      />

      {phase === 'testing' && (
        <ProgressBar 
          current={currentQuestion + 1} 
          total={FINAL_TEST_QUESTIONS.length} 
          score={score} 
        />
      )}

      <div className="flex items-center justify-center min-h-screen px-4 py-8"
        style={{ paddingTop: phase === 'testing' ? '90px' : '32px' }}
      >
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <IntroScreen 
              key="intro" 
              onStart={() => setPhase('testing')} 
              heroName={heroName} 
            />
          )}

          {phase === 'testing' && question && (
            <div key={`q-${currentQuestion}`} className="w-full">
              {question.type === 'multiple-choice' && (
                <MultipleChoiceQuestion question={question} onAnswer={handleAnswer} />
              )}
              {question.type === 'listening' && (
                <ListeningQuestion question={question} onAnswer={handleAnswer} />
              )}
              {question.type === 'writing' && (
                <WritingQuestion question={question} onAnswer={handleAnswer} />
              )}
              {question.type === 'matching' && (
                <MatchingQuestion question={question} onAnswer={handleAnswer} />
              )}
            </div>
          )}

          {phase === 'results' && (
            <ResultsScreen 
              key="results"
              score={score}
              total={TOTAL_TEST_POINTS}
              onShowCertificate={handleShowCertificate}
              onRetry={handleRetry}
              onHome={handleHome}
            />
          )}

          {phase === 'certificate' && (
            <CertificateScreen 
              key="certificate"
              heroName={heroName}
              score={score}
              total={TOTAL_TEST_POINTS}
              onHome={handleHome}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 right-6 pointer-events-none scale-50 origin-bottom-right">
        <KarlEagle mood={karlMood} message={null} idleGlowColor="#FFD700" />
      </div>
    </div>
  );
}

export default function GermanFrankTest() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏆</div>
          <p className="text-white font-bold">جاري التحضير...</p>
        </div>
      </div>
    }>
      <GermanFrankTestInner />
    </Suspense>
  );
}
'use client';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Sparkles, Volume2, Home, Trophy, Check, X,
  Award, Download, RotateCcw, ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress, getPlayer } from '@/lib/playerData';

import KarlEagle from '@/app/components/lesson/KarlEagle';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';

import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakNumber as speakGerman } from '@/lib/audio/speech';

import {
  FINAL_TEST_QUESTIONS,
  TOTAL_TEST_POINTS,
  PASSING_SCORE,
  CATEGORY_LABELS,
  type TestQuestion,
} from '@/data/german/berlin-final-test';

const LESSON_ID = 'berlin-test';

// ═══════════════════════════════════════
// 🔧 Hooks
// ═══════════════════════════════════════
function useIsMobile(bp = 1024) {
  const [isM, setIsM] = useState(false);
  useEffect(() => {
    const c = () => setIsM(window.innerWidth < bp);
    c();
    window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, [bp]);
  return isM;
}

function normalizeGerman(s: string): string {
  return s.toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .trim();
}

function checkAnswer(input: string, q: TestQuestion): boolean {
  const accepted = [q.correctAnswer, ...(q.acceptedAnswers || [])];
  return accepted.some(a => normalizeGerman(input) === normalizeGerman(a));
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
// 🎨 Background
// ═══════════════════════════════════════
function StarryBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width: 768px)" srcSet="/card-image/lake-group3-pc.webp" />
        <img src="/card-image/lake-group3-mob.webp" alt="bg" className="w-full h-full object-cover" />
      </picture>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(10,5,30,0.5) 0%, rgba(10,5,30,0.3) 50%, rgba(10,5,30,0.5) 100%)',
      }} />
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1.5 + Math.random() * 2,
            height: 1.5 + Math.random() * 2,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 Top Bar
// ═══════════════════════════════════════
function TopBar({ currentQ, totalQ, score, onHome, isMobile }: {
  currentQ: number; totalQ: number; score: number;
  onHome: () => void; isMobile: boolean;
}) {
  const progress = (currentQ / totalQ) * 100;
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-3 md:px-6 pt-3 md:pt-4"
      style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 10px)' }}>
      <div className="max-w-[1400px] mx-auto flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.92 }} onClick={onHome}
          className="w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(15,10,45,0.8)', border: '2px solid rgba(255,255,255,0.2)' }}>
          <Home size={isMobile ? 16 : 18} className="text-white" />
        </motion.button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] md:text-xs font-black text-white/80 flex-shrink-0">
            {currentQ}/{totalQ}
          </span>
          <div className="flex-1 h-3 md:h-4 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #FFD700, #FF8C00)', boxShadow: '0 0 15px rgba(255,215,0,0.6)' }}
              animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <motion.div key={score}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl flex-shrink-0"
          style={{ background: 'rgba(15,10,45,0.8)', border: '2px solid rgba(255,215,0,0.4)' }}>
          <Star size={isMobile ? 14 : 16} fill="#FFD700" className="text-yellow-400" />
          <span className="font-black text-sm text-white">{score}</span>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎯 Multiple Choice / Listening
// ═══════════════════════════════════════
function ChoiceQuestion({ question, onAnswer, isMobile }: {
  question: TestQuestion;
  onAnswer: (correct: boolean, cx: number, cy: number) => void;
  isMobile: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shuffledOptions] = useState(() => shuffle(question.options || []));
  const catLabel = CATEGORY_LABELS[question.category];

  useEffect(() => {
    if (question.type === 'listening' && question.questionDe) {
      setTimeout(() => speakGerman(question.questionDe!), 600);
    }
  }, [question.id]);

  const handleSelect = (opt: string, e: React.MouseEvent) => {
    if (selected !== null) return;
    setSelected(opt);
    setShowResult(true);
    const isCorrect = opt === question.correctAnswer;
    setTimeout(() => onAnswer(isCorrect, e.clientX, e.clientY), 1000);
  };

  return (
    <motion.div key={question.id}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto">
      <div className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden`}
        style={{
          background: 'rgba(20,15,55,0.6)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
        {/* Category Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-lg">{catLabel.emoji}</span>
          <span className="text-xs font-black text-white/70 uppercase tracking-wider">
            {catLabel.ar} · {catLabel.de}
          </span>
        </div>

        {/* Question Text */}
        <div className="text-center mb-4">
          <h2 className={`font-black text-white ${isMobile ? 'text-lg' : 'text-2xl'} mb-2`}>
            {question.question}
          </h2>
        </div>

        {/* Hero (Emoji or Listen Button) */}
        <div className="flex items-center justify-center mb-5">
          {question.type === 'listening' ? (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => speakGerman(question.questionDe!)}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #9D4EDD, #7209B7)',
                boxShadow: '0 10px 40px rgba(157,78,221,0.6)',
              }}>
              <Volume2 size={isMobile ? 38 : 46} className="text-white" />
            </motion.button>
          ) : (
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ fontSize: isMobile ? '6rem' : '8rem', lineHeight: 1, filter: 'drop-shadow(0 10px 25px rgba(255,215,0,0.4))' }}>
              {question.emoji}
            </motion.div>
          )}
        </div>

        {/* Options */}
        <div className={`grid ${shuffledOptions.length === 3 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
          {shuffledOptions.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === question.correctAnswer;
            const showRight = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={`${question.id}-${opt}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={!selected ? { scale: 1.03, y: -2 } : {}}
                whileTap={!selected ? { scale: 0.97 } : {}}
                onClick={(e) => handleSelect(opt, e)}
                disabled={selected !== null}
                className="relative py-4 px-4 rounded-2xl font-black text-base md:text-lg border-2 transition-all"
                style={{
                  background: showRight ? 'linear-gradient(135deg, #58CC02, #4AA802)'
                    : showWrong ? 'linear-gradient(135deg, #FF4444, #CC0000)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.9))',
                  borderColor: showRight ? '#58CC02' : showWrong ? '#FF4444' : 'rgba(255,255,255,0.4)',
                  color: showRight || showWrong ? 'white' : '#1a1033',
                  boxShadow: showRight ? '0 10px 30px rgba(88,204,2,0.5)'
                    : showWrong ? '0 10px 30px rgba(255,68,68,0.5)'
                    : '0 6px 20px rgba(0,0,0,0.3)',
                }}>
                <div className="flex items-center justify-center gap-2">
                  <span dir="ltr">{opt}</span>
                  {showRight && <Check size={20} strokeWidth={3} />}
                  {showWrong && <X size={20} strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Result Message */}
        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
              {selected === question.correctAnswer ? (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm"
                  style={{ background: 'rgba(88,204,2,0.2)', color: '#58CC02', border: '1.5px solid #58CC0288' }}>
                  <Check size={16} /> ممتاز! +{question.points} نقطة
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm"
                  style={{ background: 'rgba(255,68,68,0.2)', color: '#FF6B6B', border: '1.5px solid #FF444488' }}>
                  <X size={16} /> الإجابة: {question.correctAnswer}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// ✍️ Writing Question
// ═══════════════════════════════════════
function WritingQuestion({ question, onAnswer, isMobile }: {
  question: TestQuestion;
  onAnswer: (correct: boolean, cx: number, cy: number) => void;
  isMobile: boolean;
}) {
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const catLabel = CATEGORY_LABELS[question.category];

  useEffect(() => {
    setInput(''); setShowResult(false); setIsCorrect(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [question.id]);

  const handleCheck = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (!input.trim()) return;
    const correct = checkAnswer(input, question);
    setIsCorrect(correct);
    setShowResult(true);
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    if (e && 'clientX' in e) { cx = e.clientX; cy = e.clientY; }
    else if (inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
    }
    setTimeout(() => onAnswer(correct, cx, cy), 1500);
  };

  return (
    <motion.div key={question.id}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto">
      <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden"
        style={{
          background: 'rgba(20,15,55,0.6)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.15)',
        }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-lg">{catLabel.emoji}</span>
          <span className="text-xs font-black text-white/70 uppercase tracking-wider">{catLabel.ar}</span>
        </div>

        <h2 className={`text-center font-black text-white ${isMobile ? 'text-lg' : 'text-2xl'} mb-3`}>
          {question.question}
        </h2>

        <div className="flex items-center justify-center mb-4">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: isMobile ? '5rem' : '7rem', lineHeight: 1 }}>
            {question.emoji}
          </motion.div>
        </div>

        <div className="text-center text-white/70 font-bold mb-2">
          المعنى: <span className="text-white font-black">{question.ar}</span>
        </div>

        {question.hint && !showResult && (
          <div className="text-center mb-3">
            <span className="text-xs text-white/40 font-bold">💡 تلميح: </span>
            <span className="font-mono font-black text-yellow-400 text-lg" dir="ltr">{question.hint}</span>
          </div>
        )}

        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !showResult && handleCheck(e)}
            disabled={showResult}
            placeholder="اكتب هنا..."
            dir="ltr"
            className="w-full py-3 px-4 rounded-2xl text-center font-black text-xl outline-none transition-all"
            style={{
              background: showResult
                ? isCorrect ? 'rgba(88,204,2,0.15)' : 'rgba(255,68,68,0.15)'
                : 'rgba(255,255,255,0.05)',
              border: `2px solid ${showResult ? (isCorrect ? '#58CC02' : '#FF4444') : 'rgba(255,255,255,0.2)'}`,
              color: 'white',
            }}
          />

          <motion.button
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
            onClick={(e) => handleCheck(e)}
            disabled={!input.trim() || showResult}
            className="w-full py-3.5 rounded-2xl font-black text-base text-white disabled:opacity-25 transition-all"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
              boxShadow: '0 8px 25px rgba(255,140,0,0.4)',
              borderBottom: '4px solid #B8860B',
            }}>
            تحقق ✓
          </motion.button>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
              {isCorrect ? (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm"
                  style={{ background: 'rgba(88,204,2,0.2)', color: '#58CC02', border: '1.5px solid #58CC0288' }}>
                  <Check size={16} /> ممتاز! +{question.points} نقطة
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm"
                  style={{ background: 'rgba(255,68,68,0.2)', color: '#FF6B6B', border: '1.5px solid #FF444488' }}>
                  <X size={16} /> الإجابة: {question.correctAnswer}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎮 Matching Question
// ═══════════════════════════════════════
function MatchingQuestion({ question, onAnswer, isMobile }: {
  question: TestQuestion;
  onAnswer: (correct: boolean, cx: number, cy: number) => void;
  isMobile: boolean;
}) {
  const pairs = question.matchingPairs || [];
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shuffledWords] = useState(() => shuffle(pairs));
  const [shuffledEmojis] = useState(() => shuffle(pairs));
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ e: string; w: string } | null>(null);
  const catLabel = CATEGORY_LABELS[question.category];

  useEffect(() => {
    if (matched.size === pairs.length && pairs.length > 0) {
      setTimeout(() => {
        const x = window.innerWidth / 2, y = window.innerHeight / 2;
        onAnswer(true, x, y);
      }, 800);
    }
  }, [matched]);

  const tryMatch = (emoji: string, word: string) => {
    const pair = pairs.find(p => p.emoji === emoji);
    if (pair && pair.de === word) {
      speakGerman(word); playCoinSound();
      setMatched(prev => new Set(prev).add(emoji));
      setSelectedEmoji(null); setSelectedWord(null);
    } else {
      playBuzzSound();
      setWrongPair({ e: emoji, w: word });
      setTimeout(() => { setWrongPair(null); setSelectedEmoji(null); setSelectedWord(null); }, 600);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if (matched.has(emoji)) return;
    if (selectedWord) { tryMatch(emoji, selectedWord); }
    else setSelectedEmoji(prev => prev === emoji ? null : emoji);
  };

  const handleWordClick = (word: string) => {
    const pair = pairs.find(p => p.de === word);
    if (pair && matched.has(pair.emoji)) return;
    if (selectedEmoji) { tryMatch(selectedEmoji, word); }
    else setSelectedWord(prev => prev === word ? null : word);
  };

  const cardW = isMobile ? 64 : 90;
  const cardH = isMobile ? 64 : 80;
  const progress = (matched.size / pairs.length) * 100;

  return (
    <motion.div key={question.id}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="w-full max-w-2xl mx-auto">
      <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem]"
        style={{
          background: 'rgba(20,15,55,0.6)',
          backdropFilter: 'blur(30px)',
          border: '2px solid rgba(255,255,255,0.15)',
        }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">{catLabel.emoji}</span>
          <span className="text-xs font-black text-white/70 uppercase tracking-wider">{catLabel.ar}</span>
        </div>

        <h2 className={`text-center font-black text-white ${isMobile ? 'text-base' : 'text-xl'} mb-3`}>
          {question.question}
        </h2>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full"
              style={{ background: 'linear-gradient(to right, #58CC02, #A78BFA)' }}
              animate={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-black text-white/80">{matched.size}/{pairs.length}</span>
        </div>

        {/* Emojis */}
        <div className="mb-3">
          <p className="text-[10px] font-black text-cyan-300/70 mb-2 text-center uppercase">الصور</p>
          <div className="flex items-center justify-center gap-2 flex-wrap" dir="ltr">
            {shuffledEmojis.map(p => {
              const isMatched = matched.has(p.emoji);
              const isSelected = selectedEmoji === p.emoji;
              const isWrong = wrongPair?.e === p.emoji;
              if (isMatched) return (
                <div key={p.emoji} style={{ width: cardW, height: cardH, opacity: .25 }}
                  className="rounded-xl border-2 border-dashed border-green-500/40 flex items-center justify-center">
                  <Check size={20} className="text-green-500/50" />
                </div>
              );
              return (
                <motion.button key={p.emoji}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleEmojiClick(p.emoji)}
                  animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                  className="rounded-xl flex items-center justify-center border-2 flex-shrink-0"
                  style={{
                    width: cardW, height: cardH,
                    background: isWrong ? 'linear-gradient(145deg,#FF4444,#CC0000)'
                      : isSelected ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,245,255,0.85))',
                    borderColor: isSelected ? '#FFD700' : isWrong ? '#FF4444' : 'rgba(255,255,255,0.3)',
                    boxShadow: isSelected ? '0 8px 25px rgba(255,215,0,0.5)' : '0 4px 12px rgba(0,0,0,0.2)',
                    fontSize: isMobile ? '2rem' : '2.5rem',
                  }}>
                  {p.emoji}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Words */}
        <div>
          <p className="text-[10px] font-black text-pink-300/70 mb-2 text-center uppercase">الكلمات</p>
          <div className="flex items-center justify-center gap-2 flex-wrap" dir="ltr">
            {shuffledWords.map(p => {
              const isMatched = matched.has(p.emoji);
              const isSelected = selectedWord === p.de;
              const isWrong = wrongPair?.w === p.de;
              if (isMatched) return (
                <div key={p.de} style={{ width: cardW + 20, height: cardH, opacity: .25 }}
                  className="rounded-xl border-2 border-dashed border-green-500/40 flex items-center justify-center">
                  <Check size={20} className="text-green-500/50" />
                </div>
              );
              return (
                <motion.button key={p.de}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordClick(p.de)}
                  animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                  className="rounded-xl flex flex-col items-center justify-center border-2 px-2 flex-shrink-0"
                  style={{
                    width: cardW + 20, height: cardH,
                    background: isWrong ? 'linear-gradient(145deg,#FF4444,#CC0000)'
                      : isSelected ? 'linear-gradient(135deg, #EC4899, #BE185D)'
                      : 'linear-gradient(135deg, #7209B7, #4C1D95)',
                    borderColor: isSelected ? '#EC4899' : isWrong ? '#FF4444' : 'rgba(255,255,255,0.3)',
                    boxShadow: isSelected ? '0 8px 25px rgba(236,72,153,0.5)' : '0 4px 12px rgba(0,0,0,0.2)',
                  }}>
                  <span className="font-black text-white text-center"
                    style={{ fontSize: isMobile ? '.75rem' : '.95rem', lineHeight: 1.1 }} dir="ltr">{p.de}</span>
                  <span className="font-bold text-white/70 text-[8px] md:text-[10px] mt-0.5">{p.ar}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🏆 Certificate Screen
// ═══════════════════════════════════════
function CertificateScreen({ score, totalPossible, heroName, onRestart, onHome, isMobile }: {
  score: number; totalPossible: number; heroName: string;
  onRestart: () => void; onHome: () => void; isMobile: boolean;
}) {
  const percentage = Math.round((score / totalPossible) * 100);
  const passed = percentage >= PASSING_SCORE;
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D';
  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto px-4">
      {passed ? (
        <>
          {/* Certificate */}
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="relative p-6 md:p-8 rounded-[2rem] mb-5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF7E0 50%, #FFEEBC 100%)',
              border: '6px solid #FFD700',
              boxShadow: '0 25px 80px rgba(255,215,0,0.4), 0 0 60px rgba(124,58,237,0.3)',
            }}>
            {/* Decorative corners */}
            {[
              { top: '-20px', left: '-20px' },
              { top: '-20px', right: '-20px' },
              { bottom: '-20px', left: '-20px' },
              { bottom: '-20px', right: '-20px' },
            ].map((pos, i) => (
              <motion.div key={i} className="absolute w-16 h-16 rounded-full"
                style={{ ...pos, background: 'radial-gradient(circle, #FFD700, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
            ))}

            {/* Header */}
            <div className="text-center mb-4">
              <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-3"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                  boxShadow: '0 8px 30px rgba(255,140,0,0.5)',
                }}>
                <Trophy size={isMobile ? 40 : 50} className="text-white" strokeWidth={2.5} />
              </motion.div>

              <h1 className="font-black text-2xl md:text-3xl mb-1"
                style={{
                  background: 'linear-gradient(135deg, #7209B7, #4C1D95)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                شهادة إتقان اللغة الألمانية
              </h1>
              <p className="text-xs md:text-sm font-black text-gray-700">Zertifikat Deutsch A2</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={isMobile ? 14 : 16}
                    fill={s <= Math.ceil(percentage / 20) ? '#FFD700' : 'transparent'}
                    color={s <= Math.ceil(percentage / 20) ? '#FFD700' : '#D1D5DB'}
                    strokeWidth={2} />
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent my-3" />

            {/* Body */}
            <div className="text-center space-y-3">
              <div>
                <p className="text-xs text-gray-600 font-bold mb-1">تشهد منصة PIXA WORLD بأن:</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">{heroName}</h2>
                <p className="text-xs text-gray-600 font-bold mt-1">قد أتم بنجاح اختبار مرحلة برلين</p>
              </div>

              {/* Grade Box */}
              <div className="inline-block p-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.15))',
                  border: '2px solid #FFD70066',
                }}>
                <div className="text-5xl md:text-6xl font-black mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  {grade}
                </div>
                <div className="text-sm font-black text-gray-700">{percentage}% — {score}/{totalPossible} نقطة</div>
              </div>

              <div className="text-xs text-gray-600 font-bold pt-2">
                <p>📅 {today}</p>
                <p className="mt-1">🦅 موقّع: كارل النسر — مدرس الألماني</p>
              </div>
            </div>
          </motion.div>

          {/* Karl Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="flex items-center gap-3 p-4 rounded-2xl mb-4"
            style={{ background: 'rgba(20,15,55,0.7)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,215,0,0.3)' }}>
            <motion.img src="/characters/karl-3d.webp" alt="كارل" className="w-12 h-12 md:w-14 md:h-14 object-contain flex-shrink-0"
              animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} />
            <div>
              <div className="text-xs font-black text-yellow-400 mb-1">كارل النسر يقول:</div>
              <p className="text-sm text-white/90 font-bold leading-relaxed">
                &ldquo;مبروك يا بطل! 🎉 خلصت مرحلة برلين وأصبحت تتكلم ألماني محترف. يلا بينا لمدن الثقافة! 🏛️&rdquo;
              </p>
            </div>
          </motion.div>
        </>
      ) : (
        /* Failed Screen */
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="text-center p-6 rounded-[2rem]"
          style={{ background: 'rgba(20,15,55,0.7)', border: '2px solid rgba(255,255,255,0.15)' }}>
          <div className="text-8xl mb-4">📚</div>
          <h2 className="text-2xl font-black text-white mb-2">قريب! حاول تاني 💪</h2>
          <p className="text-white/70 font-bold mb-4">
            حصلت على <span className="text-yellow-400">{percentage}%</span> · لازم {PASSING_SCORE}% للنجاح
          </p>
          <div className="text-sm text-white/60">
            راجع الدروس وحاول مرة تانية، أنت قادر! 🌟
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
        className="grid grid-cols-2 gap-3">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onRestart}
          className="py-3.5 rounded-2xl font-black text-sm md:text-base text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7209B7, #4C1D95)', borderBottom: '4px solid #2E1065' }}>
          <RotateCcw size={18} /> أعد المحاولة
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onHome}
          className="py-3.5 rounded-2xl font-black text-sm md:text-base text-white flex items-center justify-center gap-2"
          style={{
            background: passed ? 'linear-gradient(135deg, #FFD700, #FF8C00)' : 'linear-gradient(135deg, #58CC02, #4AA802)',
            borderBottom: `4px solid ${passed ? '#B8860B' : '#2A6A02'}`,
          }}>
          {passed ? <>التالي <ChevronRight size={18} /></> : <><Home size={18} /> الخريطة</>}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🏠 Main
// ═══════════════════════════════════════
function BerlinTestInner() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [questions] = useState(() => FINAL_TEST_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [heroName, setHeroName] = useState('البطل');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const player = await getPlayer();
      if (player?.hero_name) setHeroName(player.hero_name);
      setIsLoading(false);
    };
    load();
  }, []);

  const currentQuestion = questions[currentIdx];

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    const msg = mood === 'sad'
      ? SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)]
      : ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setKarlMessage(msg);
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  const handleAnswer = useCallback((correct: boolean, cx: number, cy: number) => {
    if (correct) {
      setScore(s => s + currentQuestion.points);
      playCoinSound();
      handleKarlReact('happy');
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
    } else {
      playBuzzSound();
      handleKarlReact('sad');
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        setShowResults(true);
        const percentage = Math.round(((score + (correct ? currentQuestion.points : 0)) / TOTAL_TEST_POINTS) * 100);
        const passed = percentage >= PASSING_SCORE;
        if (passed) {
          playComboSound();
          saveLessonProgress(LESSON_ID, 3, true);
        } else {
          saveLessonProgress(LESSON_ID, percentage >= 40 ? 2 : 1, false);
        }
      }
    }, 500);
  }, [currentIdx, questions.length, currentQuestion, score]);

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResults(false);
  };

  const goHome = () => router.push('/character-and-map?from=lesson&map=4');

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
      <div className="text-6xl animate-pulse">📺</div>
    </div>
  );

  return (
    <div className="text-white relative" style={{ fontFamily: "'Tajawal',sans-serif", minHeight: '100vh' }} dir="rtl">
      <StarryBackground />

      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y}
        colors={['#FFD700', '#FF8C00', '#7209B7', '#EC4899', '#FFF']} />

      {!showResults && (
        <div style={{ transform: isMobile ? 'scale(0.4)' : 'scale(0.55)', transformOrigin: 'bottom right', position: 'fixed', bottom: isMobile ? 30 : 50, right: 0, zIndex: 25, pointerEvents: 'none' }}>
          <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#FFD700" />
        </div>
      )}

      {!showResults && (
        <TopBar currentQ={currentIdx + 1} totalQ={questions.length} score={score}
          onHome={goHome} isMobile={isMobile} />
      )}

      <div className="flex flex-col items-center justify-center relative px-3 md:px-6 mx-auto w-full"
        style={{
          zIndex: 10, minHeight: '100vh', maxWidth: '1400px',
          paddingTop: showResults ? '40px' : (isMobile ? '90px' : '110px'),
          paddingBottom: isMobile ? '40px' : '60px',
        }}>
        <AnimatePresence mode="wait">
          {!showResults && currentQuestion && (
            <>
              {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'listening') && (
                <ChoiceQuestion key={currentQuestion.id} question={currentQuestion}
                  onAnswer={handleAnswer} isMobile={isMobile} />
              )}
              {currentQuestion.type === 'writing' && (
                <WritingQuestion key={currentQuestion.id} question={currentQuestion}
                  onAnswer={handleAnswer} isMobile={isMobile} />
              )}
              {currentQuestion.type === 'matching' && (
                <MatchingQuestion key={currentQuestion.id} question={currentQuestion}
                  onAnswer={handleAnswer} isMobile={isMobile} />
              )}
            </>
          )}

          {showResults && (
            <CertificateScreen key="results" score={score} totalPossible={TOTAL_TEST_POINTS}
              heroName={heroName} onRestart={handleRestart} onHome={goHome} isMobile={isMobile} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BerlinFinalTest() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-6xl animate-pulse">📺</div>
      </div>
    }>
      <BerlinTestInner />
    </Suspense>
  );
}
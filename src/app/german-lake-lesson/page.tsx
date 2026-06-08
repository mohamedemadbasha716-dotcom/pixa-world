'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Check, X, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';

// 🎯 المكونات المشتركة
import KarlEagle from '@/app/components/lesson/KarlEagle';
import GhostInput from '@/app/components/lesson/GhostInput';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import ComboDisplay from '@/app/components/lesson/ComboDisplay';
import FlyingStars, { type FlyingStar } from '@/app/components/lesson/FlyingStars';
import SoundButton from '@/app/components/lesson/SoundButton';
import SpecialCharsKeyboard, { getRequiredSpecialChars } from '@/app/components/lesson/SpecialCharsKeyboard';

// 🎯 الأنواع والرسائل المشتركة
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

// 🎯 الأصوات والنطق المشتركة
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';
import { speakWord } from '@/lib/audio/speech';

// 📦 البيانات من الملفات المنفصلة
import { LAKE_GROUPS, type LakeWord, type WeekDay } from '@/data/german/lake';

function normalizeGerman(s: string): string {
  return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/\s+/g, ' ').trim();
}

function compareWords(input: string, target: string): boolean {
  return normalizeGerman(input) === normalizeGerman(target);
}

type Phase = 'learn-word' | 'test' | 'group-success' | 'group-fail' | 'all-done';

// ═══════════════════════════════════════
// خلفية البحيرة
// ═══════════════════════════════════════
function LakeBackground({ activeColor }: { activeColor: string }) {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number; xOffset: number }>>([]);
  const [stars, setStars] = useState<Array<{ left: number; top: number; size: number; duration: number; delay: number }>>([]);
  const [ripples, setRipples] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const b = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 3 + Math.random() * 8,
      duration: 12 + Math.random() * 10,
      xOffset: Math.random() * 40 - 20,
    }));
    setBubbles(b);

    const s = Array.from({ length: 35 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 50,
      size: 1.5 + Math.random() * 1.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
    setStars(s);

    const r = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: 15 + Math.random() * 70,
      top: 60 + Math.random() * 35,
      delay: i * 1.2,
      duration: 4 + Math.random() * 2,
    }));
    setRipples(r);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0a1f3a 0%, #051428 50%, #020812 100%)',
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 90% 50% at 50% 0%, ${activeColor}44, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/5 opacity-50"
        style={{ background: `linear-gradient(to top, ${activeColor}33, ${activeColor}11 50%, transparent)` }}
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '30%', opacity: 0.15 }}>
        <motion.path
          d="M0,100 C300,150 600,50 1200,100 L1200,200 L0,200 Z"
          fill={activeColor}
          animate={{
            d: [
              'M0,100 C300,150 600,50 1200,100 L1200,200 L0,200 Z',
              'M0,120 C300,80 600,130 1200,90 L1200,200 L0,200 Z',
              'M0,100 C300,150 600,50 1200,100 L1200,100 L0,200 Z',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {bubbles.map(b => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: -20,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${activeColor}aa, transparent)`,
            boxShadow: `0 0 ${b.size * 2}px ${activeColor}66`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, b.xOffset, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {ripples.map(r => (
        <motion.div
          key={r.id}
          className="absolute rounded-full border-2"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            borderColor: `${activeColor}55`,
            width: 20,
            height: 8,
          }}
          animate={{
            scale: [0.5, 3, 5],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: 'white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}

      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(${activeColor} 1px, transparent 1px), linear-gradient(90deg, ${activeColor} 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════
// Hero Word Display
// ═══════════════════════════════════════
function HeroWordDisplay({ itemData }: { itemData: LakeWord }) {
  const [sparkles, setSparkles] = useState<Array<{ top: number; left: number; delay: number }>>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 6 }, (_, i) => ({
        top: 20 + Math.random() * 60,
        left: 10 + Math.random() * 80,
        delay: i * 0.4,
      }))
    );
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${itemData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-3 h-3 rounded-full" style={{
          background: itemData.color,
          top: -6, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 15px ${itemData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${itemData.color}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: itemData.gradient[1],
          bottom: -4, right: '30%',
          boxShadow: `0 0 10px ${itemData.gradient[1]}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${itemData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] flex items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${itemData.gradient[0]}22, ${itemData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${itemData.color}44`,
          boxShadow: `0 20px 60px ${itemData.color}33, inset 0 1px 0 ${itemData.color}55, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <span style={{ fontSize: '7rem', filter: `drop-shadow(0 6px 20px ${itemData.color}aa)` }}>
          {itemData.emoji}
        </span>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full opacity-60" style={{
          background: `radial-gradient(ellipse, ${itemData.color}88, transparent)`,
          filter: 'blur(2px)',
        }} />
      </motion.div>

      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
        >
          <Sparkles size={12} style={{ color: itemData.color }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// PHASE 1 — تعلم الكلمة
// ═══════════════════════════════════════
function LearnWordPhase({ itemData, groupTitle, onDone, onKarlReact, onCombo, onStarEarned }: {
  itemData: LakeWord;
  groupTitle: string;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  onStarEarned: (x: number, y: number) => void;
}) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredChars = getRequiredSpecialChars(itemData.word);

  useEffect(() => {
    setInput('');
    setStatus('idle');
    const t = setTimeout(() => { speakWord(itemData.word); inputRef.current?.focus(); }, 400);
    return () => clearTimeout(t);
  }, [itemData.word]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, itemData.word)) {
      setStatus('correct');
      speakWord(itemData.word);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      let starX = 0, starY = 0;
      if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        starX = r.left + r.width / 2;
        starY = r.top + r.height / 2;
      } else if (e) { starX = e.clientX; starY = e.clientY; }
      onStarEarned(starX, starY);
      setConfettiPos({ x: starX, y: starY });
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1100);
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
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={itemData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-${itemData.word}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 flex flex-col items-center gap-5">
            <motion.div onClick={() => speakWord(itemData.word)} whileTap={{ scale: 0.97 }} className="cursor-pointer">
              <HeroWordDisplay itemData={itemData} />
            </motion.div>
            <div className="text-center">
              <div className="font-black text-3xl md:text-4xl text-white mb-1" style={{
                background: `linear-gradient(180deg, white, ${itemData.color}cc)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                textShadow: 'none',
              }}>
                {itemData.word}
              </div>
              <div className="font-bold text-lg" style={{ color: itemData.color }}>{itemData.wordAr}</div>
            </div>
            <SoundButton onClick={() => speakWord(itemData.word)} color={itemData.color} label="استمع للكلمة" />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${itemData.color}aa` }}>
                Wort · {groupTitle}
              </div>
              <div className="text-2xl font-black text-white">اكتب الكلمة</div>
            </div>

            <GhostInput
              ref={inputRef}
              value={input}
              onChange={v => { setInput(v); setStatus('idle'); }}
              onEnter={handleCheck}
              ghostText={itemData.word}
              color={itemData.color}
              status={status}
              fontSize="1.4rem"
            />

            {requiredChars.length > 0 && (
              <div className="space-y-2">
                <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">💡 الحروف الخاصة</p>
                <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={itemData.color} />
              </div>
            )}

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                  style={{
                    background: status === 'correct' ? 'rgba(88,204,2,0.18)' : 'rgba(255,68,68,0.18)',
                    color: status === 'correct' ? '#58CC02' : '#FF6B6B',
                    border: `1px solid ${status === 'correct' ? '#58CC0244' : '#FF444444'}`,
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
                background: `linear-gradient(135deg, ${itemData.gradient[0]}, ${itemData.gradient[1]})`,
                boxShadow: `0 8px 30px ${itemData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${itemData.color}77`,
              }}
            >
              تحقق ✓
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// TEST 1 — Quiz
// ═══════════════════════════════════════
interface QuizQuestion {
  word: string; wordAr: string; emoji: string; color: string; gradient: string[];
  options: string[]; correctAnswer: string;
}

function generateQuiz(items: LakeWord[]): QuizQuestion[] {
  return items.map(item => {
    const wrong = items
      .filter(i => i.word !== item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => i.wordAr);
    return {
      word: item.word, wordAr: item.wordAr, emoji: item.emoji,
      color: item.color, gradient: item.gradient,
      correctAnswer: item.wordAr,
      options: [...wrong, item.wordAr].sort(() => Math.random() - 0.5),
    };
  }).sort(() => Math.random() - 0.5).slice(0, 6);
}

function QuizTest({ items, onPass, onFail, onStarEarned, onKarlReact, onCombo }: {
  items: LakeWord[];
  onPass: () => void; onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [questions] = useState(() => generateQuiz(items));
  const [idx, setIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const q = questions[idx];
  if (!q) return null;

  const handleSelect = (option: string, e: React.MouseEvent) => {
    if (feedback) return;
    setSelected(option);
    if (option === q.correctAnswer) {
      setFeedback('correct');
      playCoinSound(); onCombo(); onKarlReact('happy');
      setConfettiPos({ x: e.clientX, y: e.clientY });
      setConfettiTrigger(t => t + 1);
      onStarEarned(e.clientX, e.clientY);
      setTimeout(() => {
        setFeedback(null); setSelected(null);
        if (idx + 1 >= questions.length) { onKarlReact('celebrate'); setTimeout(onPass, 800); }
        else setIdx(i => i + 1);
      }, 1100);
    } else {
      const nw = wrong + 1;
      setWrong(nw);
      setFeedback('wrong');
      playBuzzSound(); onKarlReact('sad');
      setTimeout(() => { setFeedback(null); setSelected(null); if (nw >= 3) onFail(); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#4CC9F0', '#FF6B6B', '#FFFFFF']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-white/30">
            {idx + 1} / {questions.length}
          </span>
          <span className="text-xs font-bold" style={{ color: wrong >= 2 ? '#FF6B6B' : 'rgba(255,255,255,0.2)' }}>
            {wrong > 0 && '❌'.repeat(Math.min(wrong, 3))}
          </span>
        </div>

        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full transition-all duration-300"
              style={{ background: i < idx ? '#58CC02' : i === idx ? q.color : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            className="rounded-3xl border-2 overflow-hidden backdrop-blur-md p-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${q.color}22, ${q.color}08)`,
              borderColor: `${q.color}55`,
              boxShadow: `0 8px 30px ${q.color}33`,
            }}
          >
            <div className="text-6xl mb-4">{q.emoji}</div>
            <div className="font-black text-2xl md:text-3xl text-white mb-2" style={{ textShadow: `0 0 30px ${q.color}aa` }}>
              {q.word}
            </div>
            <button onClick={() => speakWord(q.word)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all text-sm font-bold mb-4">
              <Volume2 size={14} /> استمع
            </button>
            <p className="text-sm font-bold text-white/50">ما معنى هذه الكلمة؟</p>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === q.correctAnswer;
            const showCorrect = feedback && isCorrect;
            const showWrong = feedback === 'wrong' && isSelected && !isCorrect;
            return (
              <motion.button
                key={i}
                whileHover={!feedback ? { scale: 1.03, y: -2 } : {}}
                whileTap={!feedback ? { scale: 0.97 } : {}}
                onClick={e => handleSelect(opt, e)}
                disabled={!!feedback}
                className="relative py-4 px-5 rounded-2xl font-black text-base border-2 transition-all text-white"
                style={{
                  background: showCorrect ? 'rgba(88,204,2,0.25)' : showWrong ? 'rgba(255,68,68,0.25)' : isSelected ? `${q.color}22` : 'rgba(255,255,255,0.05)',
                  borderColor: showCorrect ? '#58CC02' : showWrong ? '#FF4444' : isSelected ? q.color : 'rgba(255,255,255,0.15)',
                  boxShadow: showCorrect ? '0 0 25px rgba(88,204,2,0.4)' : showWrong ? '0 0 25px rgba(255,68,68,0.4)' : 'none',
                }}
              >
                {showCorrect && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2"><Check size={16} className="text-[#58CC02]" /></motion.span>}
                {showWrong && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2"><X size={16} className="text-[#FF4444]" /></motion.span>}
                {opt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// TEST 2 — Order Days
// ═══════════════════════════════════════
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function OrderTest({ items, onPass, onFail, onStarEarned, onKarlReact, onCombo }: {
  items: WeekDay[];
  onPass: () => void; onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [shuffled] = useState(() => shuffle(items));
  const [placed, setPlaced] = useState<(WeekDay | null)[]>(Array(items.length).fill(null));
  const [dragging, setDragging] = useState<number | null>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const [wrongs, setWrongs] = useState(0);
  const [correct, setCorrect] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [done, setDone] = useState(false);

  const touchDragging = useRef<number | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  const available = shuffled.filter(item => !placed.some(p => p?.word === item.word));

  const doPlace = (dayItem: WeekDay, slotIdx: number, cx: number, cy: number) => {
    if (correct.has(slotIdx)) return;
    const expected = items[slotIdx];
    if (dayItem.word === expected.word) {
      const newPlaced = [...placed];
      newPlaced[slotIdx] = dayItem;
      setPlaced(newPlaced);
      const newCorrect = new Set([...correct, slotIdx]);
      setCorrect(newCorrect);
      playCoinSound(); onCombo(); onKarlReact('happy');
      onStarEarned(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      if (newCorrect.size === items.length) {
        setDone(true);
        onKarlReact('celebrate');
        setTimeout(onPass, 1800);
      }
    } else {
      const nw = wrongs + 1;
      setWrongs(nw);
      setWrongFlash(slotIdx);
      playBuzzSound(); onKarlReact('sad');
      setTimeout(() => setWrongFlash(null), 600);
      if (nw >= 4) setTimeout(onFail, 700);
    }
  };

  const handleDragStart = (idx: number) => setDragging(idx);
  const handleDragEnd = () => { setDragging(null); setOverSlot(null); };
  const handleDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault(); setOverSlot(null);
    if (dragging !== null) doPlace(available[dragging], slotIdx, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, idx: number) => {
    touchDragging.current = idx;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.88;pointer-events:none;z-index:9998;border-radius:16px;`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current) return;
    touchCloneRef.current.style.left = (e.touches[0].clientX - touchOffRef.current.x) + 'px';
    touchCloneRef.current.style.top = (e.touches[0].clientY - touchOffRef.current.y) + 'px';
    let found: number | null = null;
    document.querySelectorAll('[data-slot]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.touches[0].clientX >= r.left && e.touches[0].clientX <= r.right && e.touches[0].clientY >= r.top && e.touches[0].clientY <= r.bottom)
        found = parseInt((el as HTMLElement).dataset.slot!);
    });
    setOverSlot(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    let dropped: number | null = null;
    document.querySelectorAll('[data-slot]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom)
        dropped = parseInt((el as HTMLElement).dataset.slot!);
    });
    if (dropped !== null && touchDragging.current !== null)
      doPlace(available[touchDragging.current], dropped, ex, ey);
    setOverSlot(null);
    touchDragging.current = null;
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#FF6B6B', '#4CC9F0', '#FFFFFF']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-1">رتّب الأيام بالترتيب الصح</div>
          <p className="text-white/50 text-sm font-bold">من الاثنين للأحد — اسحب وضع كل يوم في مكانه</p>
          {wrongs > 0 && (
            <p className="text-xs font-bold mt-1" style={{ color: '#FF6B6B' }}>
              {'❌'.repeat(Math.min(wrongs, 4))} {wrongs}/4
            </p>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {items.map((day, slotIdx) => {
            const isCorrect = correct.has(slotIdx);
            const isOver = overSlot === slotIdx && !isCorrect;
            const isWrong = wrongFlash === slotIdx;
            return (
              <motion.div
                key={slotIdx}
                data-slot={slotIdx}
                animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : isCorrect ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.35 }}
                onDragOver={e => { e.preventDefault(); if (!isCorrect) setOverSlot(slotIdx); }}
                onDragLeave={() => setOverSlot(null)}
                onDrop={e => handleDrop(e, slotIdx)}
                className="flex flex-col items-center justify-center rounded-2xl border-2 transition-all select-none"
                style={{
                  minHeight: 80,
                  background: isCorrect ? `linear-gradient(135deg, ${day.gradient[0]}44, ${day.gradient[1]}22)`
                    : isOver ? 'rgba(255,255,255,0.12)'
                    : isWrong ? 'rgba(255,68,68,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  borderColor: isCorrect ? day.color
                    : isOver ? 'rgba(255,255,255,0.5)'
                    : isWrong ? '#FF4444'
                    : 'rgba(255,255,255,0.15)',
                  borderStyle: isCorrect ? 'solid' : 'dashed',
                  boxShadow: isCorrect ? `0 0 20px ${day.color}55` : isOver ? '0 0 20px rgba(255,255,255,0.2)' : 'none',
                }}
              >
                {isCorrect ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-1 p-2">
                    <span style={{ fontSize: 22 }}>{day.emoji}</span>
                    <span className="font-black text-white text-[10px] text-center leading-tight">{day.word}</span>
                    <span className="font-bold text-[9px] text-center" style={{ color: day.color }}>{day.wordAr}</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-1 p-2">
                    <span className="text-white/20 font-black text-sm">{slotIdx + 1}</span>
                    <span className="text-white/15 text-[9px] font-bold">{day.wordAr}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center pt-2">
          {available.map((day, idx) => (
            <motion.div
              key={day.word}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnd={handleDragEnd}
              onTouchStart={e => onTouchStart(e, idx)}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={() => speakWord(day.word)}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 cursor-grab select-none backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${day.gradient[0]}22, ${day.gradient[1]}11)`,
                borderColor: `${day.color}66`,
                boxShadow: `0 4px 16px ${day.color}33`,
                opacity: dragging === idx ? 0.4 : 1,
              }}
            >
              <span style={{ fontSize: 24 }}>{day.emoji}</span>
              <span className="font-black text-white text-sm">{day.word}</span>
              <span className="font-bold text-xs" style={{ color: day.color }}>{day.wordAr}</span>
            </motion.div>
          ))}
        </div>

        {done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
            style={{ background: 'rgba(0,10,20,0.9)', backdropFilter: 'blur(8px)' }}>
            <motion.div animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.8 }} className="text-7xl">📅</motion.div>
            <p className="font-black text-white text-3xl">رتبت الأيام صح!</p>
            <div className="flex gap-1">{items.map((d, i) => <Star key={i} size={22} fill="#FFD700" color="#FFD700" />)}</div>
          </motion.div>
        )}
        <p className="text-white/20 text-xs text-center">💡 اضغط على أي بطاقة لتسمع النطق</p>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// TEST 3 — Match
// ═══════════════════════════════════════
function MatchTest({ items, onPass, onFail, onStarEarned, onKarlReact, onCombo }: {
  items: LakeWord[];
  onPass: () => void; onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [emojiOrder] = useState(() => shuffle(items));
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<string | null>(null);
  const [overTarget, setOverTarget] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [successPair, setSuccessPair] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const touchDragging = useRef<string | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (matched.size === items.length) {
      onKarlReact('celebrate');
      setTimeout(onPass, 800);
    }
  }, [matched]);

  const doMatch = (fromWord: string, toWord: string, cx: number, cy: number) => {
    if (fromWord === toWord) {
      const item = items.find(i => i.word === fromWord)!;
      speakWord(item.word);
      playCoinSound(); onCombo(); onKarlReact('happy');
      onStarEarned(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      setSuccessPair(fromWord);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, fromWord]));
    } else {
      playBuzzSound(); onKarlReact('sad');
      setErrors(e => e + 1);
      setWrongPair(fromWord);
      setTimeout(() => setWrongPair(null), 500);
      if (errors + 1 >= 5) setTimeout(onFail, 600);
    }
  };

  const handleDragStart = (word: string) => setDragging(word);
  const handleDragEnd = () => { setDragging(null); setOverTarget(null); };
  const handleDrop = (e: React.DragEvent, toWord: string) => {
    e.preventDefault(); setOverTarget(null);
    if (dragging) doMatch(dragging, toWord, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, word: string) => {
    if (matched.has(word)) return;
    touchDragging.current = word;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;opacity:.88;pointer-events:none;z-index:9998;border-radius:16px;`;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current) return;
    touchCloneRef.current.style.left = (e.touches[0].clientX - touchOffRef.current.x) + 'px';
    touchCloneRef.current.style.top = (e.touches[0].clientY - touchOffRef.current.y) + 'px';
    let found: string | null = null;
    document.querySelectorAll('[data-match-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.touches[0].clientX >= r.left && e.touches[0].clientX <= r.right && e.touches[0].clientY >= r.top && e.touches[0].clientY <= r.bottom)
        found = (el as HTMLElement).dataset.matchTarget!;
    });
    setOverTarget(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    let dropped: string | null = null;
    document.querySelectorAll('[data-match-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom)
        dropped = (el as HTMLElement).dataset.matchTarget!;
    });
    if (dropped && touchDragging.current) doMatch(touchDragging.current, dropped, ex, ey);
    setOverTarget(null);
    touchDragging.current = null;
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#58CC02', '#4CC9F0', '#FFFFFF']} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-1">طابق الكلمة بالإيموجي</div>
          <p className="text-white/50 text-sm font-bold">اسحب الكلمة العربية وضعها على الإيموجي الصح</p>
          {errors > 0 && (
            <p className="text-xs font-bold mt-1" style={{ color: '#FF6B6B' }}>
              {'❌'.repeat(Math.min(errors, 5))} {errors}/5
            </p>
          )}
        </div>

        <div className="flex gap-1.5 justify-center">
          {items.map(item => (
            <motion.div key={item.word}
              animate={matched.has(item.word) ? { scale: [1, 1.5, 1] } : {}}
              className="w-3 h-3 rounded-full transition-all"
              style={{ background: matched.has(item.word) ? `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})` : 'rgba(255,255,255,0.15)', boxShadow: matched.has(item.word) ? `0 0 10px ${item.color}88` : 'none' }}
            />
          ))}
        </div>

        <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 40px 1fr' }} dir="rtl">
          <div className="text-center text-xs font-black text-white/30 tracking-widest uppercase pb-1">الكلمة</div>
          <div />
          <div className="text-center text-xs font-black text-white/30 tracking-widest uppercase pb-1">الإيموجي</div>

          {items.map((item, i) => {
            const emojiItem = emojiOrder[i];
            const isWordMatched = matched.has(item.word);
            const isEmojiMatched = matched.has(emojiItem.word);
            const isWrong = wrongPair === item.word;
            const isSuccess = successPair === item.word;
            const isOver = overTarget === emojiItem.word && !isEmojiMatched;

            return (
              <div key={`row-${i}`} className="contents">
                <motion.div
                  draggable={!isWordMatched}
                  onDragStart={() => handleDragStart(item.word)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={e => onTouchStart(e, item.word)}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onClick={() => speakWord(item.word)}
                  animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : isSuccess ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.35 }}
                  className="flex items-center justify-center gap-2 rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                  style={{
                    cursor: isWordMatched ? 'default' : 'grab',
                    background: isWordMatched ? `linear-gradient(135deg, ${item.gradient[0]}33, ${item.gradient[1]}15)` : `${item.color}11`,
                    border: `2px solid ${isWordMatched ? item.color + '88' : isWrong ? '#ef4444' : isSuccess ? '#22c55e' : item.color + '44'}`,
                    boxShadow: isWordMatched ? `0 0 20px ${item.color}44` : dragging === item.word ? `0 8px 30px ${item.color}55` : 'none',
                    opacity: dragging && dragging !== item.word && !isWordMatched ? 0.4 : 1,
                  }}
                >
                  <span className="font-black text-white text-sm text-center leading-snug">{item.wordAr}</span>
                  {isWordMatched && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs" style={{ color: item.color }}>✓</motion.span>}
                </motion.div>

                <div className="flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                </div>

                <motion.div
                  data-match-target={emojiItem.word}
                  onDragOver={e => { e.preventDefault(); if (!isEmojiMatched) setOverTarget(emojiItem.word); }}
                  onDragLeave={() => setOverTarget(null)}
                  onDrop={e => !isEmojiMatched && handleDrop(e, emojiItem.word)}
                  onClick={() => speakWord(emojiItem.word)}
                  className="flex items-center justify-center rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                  style={{
                    cursor: 'pointer',
                    background: isEmojiMatched ? `linear-gradient(135deg, ${emojiItem.gradient[0]}33, ${emojiItem.gradient[1]}15)` : isOver ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `2px ${isEmojiMatched ? 'solid' : 'dashed'} ${isEmojiMatched ? emojiItem.color + '88' : isOver ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}`,
                    boxShadow: isOver ? '0 0 25px rgba(255,255,255,0.2)' : isEmojiMatched ? `0 0 20px ${emojiItem.color}44` : 'none',
                  }}
                >
                  <span style={{ fontSize: 28, filter: isEmojiMatched ? `drop-shadow(0 0 12px ${emojiItem.color})` : 'none' }}>
                    {emojiItem.emoji}
                  </span>
                  {isEmojiMatched && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs ml-1" style={{ color: emojiItem.color }}>✓</motion.span>}
                </motion.div>
              </div>
            );
          })}
        </div>
        <p className="text-white/20 text-xs text-center">💡 اضغط على أي بطاقة لتسمع النطق</p>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// شاشات نجاح وفشل
// ═══════════════════════════════════════
function SuccessScreen({ group, onNext, isLast }: { group: typeof LAKE_GROUPS[0]; onNext: () => void; isLast: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
      <motion.div animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 1, delay: 0.2 }} className="text-9xl">{group.icon}</motion.div>
      <div>
        <h2 className="text-4xl font-black text-white mb-2">أنهيت {group.title}! 🎉</h2>
        <p className="font-bold text-lg" style={{ color: '#06D6A0' }}>{isLast ? 'أنهيت دروس البحيرة! 🏞️' : 'كمّل على المجموعة الجاية 💪'}</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 400 }}>
            <Star size={52} fill="#FFD700" color="#FFD700" />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onNext}
        className="px-12 py-5 rounded-2xl font-black text-xl text-white"
        style={{ background: 'linear-gradient(135deg, #06D6A0, #0984E3)', boxShadow: '0 10px 40px rgba(6,214,160,0.4)' }}>
        {isLast ? '🏰 قلعة نويشفانشتاين' : 'المجموعة الجاية 🚀'}
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.5, repeat: 3 }} className="text-8xl">😅</motion.div>
      <div>
        <h2 className="text-3xl font-black text-white mb-2">حاول تاني!</h2>
        <p className="font-bold text-white/40">راجع الكلمات كويس وبعدين اعمل الاختبار</p>
      </div>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onRetry}
        className="flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-lg text-white"
        style={{ background: 'linear-gradient(135deg, #F72585, #7209B7)' }}>
        <RotateCcw size={20} /> أعد المجموعة
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanLakeLessonPage() {
  const router = useRouter();
  const [groupIdx, setGroupIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn-word');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const LESSON_ID = 'lake';

  // إجمالي العناصر (للـ calculateRating)
  const totalItemsAll = LAKE_GROUPS.reduce((s, g) => s + g.items.length, 0);

  // 📥 جلب التقدم + استرجاع المكان
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        
        if (!progress.completed) {
          if (progress.current_group !== undefined && progress.current_group !== null) {
            setGroupIdx(progress.current_group);
          }
          if (progress.current_letter !== undefined && progress.current_letter !== null) {
            setItemIdx(progress.current_letter);
          }
          if (progress.current_phase) {
            setPhase(progress.current_phase as Phase);
          }
          console.log(`📍 الرجوع لمكانك: مجموعة ${progress.current_group}, عنصر ${progress.current_letter}, مرحلة ${progress.current_phase}`);
        }
        
        console.log('✅ تم تحميل التقدم:', progress);
      }
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);
  const starBarRef = useRef<HTMLDivElement>(null);

  const group = LAKE_GROUPS[groupIdx];
  const itemData = group?.items[itemIdx];
  const totalItems = totalItemsAll;
  const learnedItems = LAKE_GROUPS.slice(0, groupIdx).reduce((s, g) => s + g.items.length, 0) + itemIdx;

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    if (mood === 'happy' || mood === 'celebrate')
      setKarlMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    else if (mood === 'sad')
      setKarlMessage(SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)]);
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  const handleCombo = () => {
    setCombo(c => {
      const next = c + 1;
      if (next === 3 || next === 5 || next === 7) playComboSound();
      return next;
    });
  };

  // 🎯 حساب التقييم من 3
  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = totalItemsAll * 2;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  // 💾 حفظ المكان
  const savePosition = (newGroup: number, newItem: number, newPhase: Phase, starsToSave?: number) => {
    const stars = starsToSave !== undefined ? starsToSave : totalStars;
    const rating = calculateRating(stars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup,
      current_letter: newItem,
      current_phase: newPhase,
    }).then(() => {
      console.log(`📍 تم حفظ المكان: G${newGroup} I${newItem} ${newPhase} | نجوم: ${stars} → تقييم: ${rating}/3`);
    });
  };

  const handleStarEarned = useCallback((x: number, y: number) => {
    setTotalStars(s => {
      const newCount = s + 1;
      const rating = calculateRating(newCount);
      saveLessonProgress(LESSON_ID, rating, false, {
        current_group: groupIdx,
        current_letter: itemIdx,
        current_phase: phase,
      }).then(() => {
        console.log(`⭐ تقدمك: ${newCount}/${totalItemsAll * 2} → تقييم: ${rating}/3`);
      });
      return newCount;
    });
    const id = Date.now() + Math.random();
    setFlyingStars(prev => [...prev, { id, x, y }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 900);
  }, [groupIdx, itemIdx, phase, totalItemsAll]);

  const handleWordDone = () => {
    const next = itemIdx + 1;
    if (next < group.items.length) {
      setItemIdx(next);
      setPhase('learn-word');
      savePosition(groupIdx, next, 'learn-word');
    } else {
      setPhase('test');
      savePosition(groupIdx, itemIdx, 'test');
    }
  };

  const handleTestPass = () => {
    setPhase('group-success');
    savePosition(groupIdx, itemIdx, 'group-success');
  };
  
  const handleTestFail = () => {
    setCombo(0);
    setPhase('group-fail');
  };

  const handleGroupNext = () => {
    if (groupIdx + 1 < LAKE_GROUPS.length) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx);
      setItemIdx(0);
      setPhase('learn-word');
      savePosition(newGroupIdx, 0, 'learn-word');
    } else {
      setPhase('all-done');
    }
  };

  const handleRetry = () => {
    setItemIdx(0);
    setPhase('learn-word');
    savePosition(groupIdx, 0, 'learn-word');
  };

  const phaseLabel: Record<Phase, string> = {
    'learn-word': 'تعلم', 'test': 'اختبار',
    'group-success': '🎉', 'group-fail': '😅', 'all-done': '🏆',
  };

  const activeColor = itemData?.color ?? '#06D6A0';

  // 🆕 شاشة تحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020812]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏞️</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <LakeBackground activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#06D6A0" />
      <ComboDisplay combo={combo} position="bottom-left" />
      <FlyingStars stars={flyingStars} targetRef={starBarRef} />

      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(2,8,20,0.97) 80%, transparent)' }}>
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 backdrop-blur-md hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="ارجع للخريطة (تقدمك محفوظ)">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
                <span className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>🏞️</span>
                  {group.icon} {group.title} — {phaseLabel[phase]}
                </span>
                <span>{Math.min(learnedItems + 1, totalItems)} / {totalItems}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #0984E3)`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${(learnedItems / totalItems) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }} />
                </motion.div>
              </div>
            </div>
            <motion.div ref={starBarRef} key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.35 }}
              className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl border border-yellow-400/30"
              style={{ background: 'rgba(255,215,0,0.1)', backdropFilter: 'blur(10px)' }}>
              <svg width="18" height="18" viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5" fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
              <span className="font-black text-sm text-yellow-400">{totalStars}</span>
            </motion.div>
          </div>

          <div className="flex gap-1.5 justify-center">
            {LAKE_GROUPS.map((g, i) => {
              const done = i < groupIdx || (i === groupIdx && (phase === 'group-success' || phase === 'all-done'));
              const current = i === groupIdx;
              return (
                <motion.div key={g.groupId} whileHover={{ scale: 1.05, y: -2 }}
                  className="flex-1 h-10 rounded-xl flex items-center justify-center text-base font-black border-2 transition-all backdrop-blur-md"
                  style={{
                    background: done ? 'linear-gradient(135deg, rgba(6,214,160,0.25), rgba(9,132,227,0.15))' : current ? 'linear-gradient(135deg, rgba(6,214,160,0.12), rgba(9,132,227,0.06))' : 'rgba(255,255,255,0.03)',
                    borderColor: done ? '#06D6A0' : current ? '#06D6A077' : 'rgba(255,255,255,0.08)',
                    boxShadow: current && !done ? '0 0 20px rgba(6,214,160,0.4)' : 'none',
                  }}>
                  {done ? '✓' : g.icon}
                </motion.div>
              );
            })}
          </div>

          {phase === 'learn-word' && itemData && (
            <div className="flex gap-1 justify-center flex-wrap">
              {group.items.map((item, i) => {
                const isDone = i < itemIdx;
                const isCurrent = i === itemIdx;
                return (
                  <motion.div key={item.word + i} whileHover={{ scale: 1.1, y: -2 }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all backdrop-blur-md"
                    style={{
                      background: isDone ? `linear-gradient(135deg, ${item.gradient[0]}55, ${item.gradient[1]}33)` : isCurrent ? `${item.color}22` : 'rgba(255,255,255,0.03)',
                      borderColor: isDone ? item.color : isCurrent ? `${item.color}88` : 'rgba(255,255,255,0.08)',
                      boxShadow: isCurrent && !isDone ? `0 0 15px ${item.color}55` : 'none',
                    }}>
                    {isDone ? '✓' : item.emoji}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="pt-40 pb-32 px-6 min-h-screen flex flex-col justify-center relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">

          {phase === 'learn-word' && itemData && (
            <LearnWordPhase
              key={`learn-${groupIdx}-${itemIdx}`}
              itemData={itemData}
              groupTitle={group.title}
              onDone={handleWordDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              onStarEarned={handleStarEarned}
            />
          )}

          {phase === 'test' && group.testType === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-3xl font-black text-white">اختر الإجابة الصحيحة! 🎯</h2>
              </div>
              <QuizTest items={group.items} onPass={handleTestPass} onFail={handleTestFail}
                onStarEarned={handleStarEarned} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}

          {phase === 'test' && group.testType === 'order' && (
            <motion.div key="order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-3xl font-black text-white">رتّب أيام الأسبوع! 📅</h2>
              </div>
              <OrderTest items={group.items as WeekDay[]} onPass={handleTestPass} onFail={handleTestFail}
                onStarEarned={handleStarEarned} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}

          {phase === 'test' && group.testType === 'match' && (
            <motion.div key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">اختبار {group.title}</div>
                <h2 className="text-3xl font-black text-white">طابق الكلمة بالإيموجي! 🏔️</h2>
              </div>
              <MatchTest items={group.items} onPass={handleTestPass} onFail={handleTestFail}
                onStarEarned={handleStarEarned} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}

          {phase === 'group-success' && (
            <SuccessScreen key="success" group={group} onNext={handleGroupNext} isLast={groupIdx === LAKE_GROUPS.length - 1} />
          )}

          {phase === 'group-fail' && (
            <FailScreen key="fail" onRetry={handleRetry} />
          )}

          {phase === 'all-done' && (
            <motion.div key="all-done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
              <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-9xl">🏞️</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أنهيت بحيرة الملوك!</h2>
                <p className="font-bold text-lg" style={{ color: '#06D6A0' }}>قلعة نويشفانشتاين اتفتحت لك! 🏰</p>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-md border border-yellow-400/30"
                style={{ background: 'rgba(255,215,0,0.1)' }}>
                <Star size={32} fill="#FFD700" color="#FFD700" />
                <span className="font-black text-4xl text-yellow-400">{totalStars}</span>
                <span className="font-bold text-white/40 text-lg">نجمة!</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + s * 0.15, type: 'spring' }}>
                    <Star size={56} fill="#FFD700" color="#FFD700" />
                  </motion.div>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={async () => {
                  // 🏆 الدرس مكتمل = 3 نجوم كاملة + completed
                  await saveLessonProgress(LESSON_ID, 3, true);
                  router.push('/character-and-map?from=lesson');
                }}
                className="flex items-center gap-2 px-12 py-5 rounded-2xl font-black text-lg text-white"
                style={{ background: 'linear-gradient(135deg, #06D6A0, #0984E3)', boxShadow: '0 10px 40px rgba(6,214,160,0.4)' }}>
                <Trophy size={24} /> العودة للخريطة
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
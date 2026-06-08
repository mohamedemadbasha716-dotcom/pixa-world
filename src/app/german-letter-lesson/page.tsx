'use client';
import { useState, useEffect, useRef } from 'react';
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
import { speakLetter, speakWord } from '@/lib/audio/speech';

// 📦 البيانات من الملفات المنفصلة
import { LETTERS, LETTER_GROUPS, type Letter } from '@/data/german/letters';
import { HARBOR_OBJECTS, HARBOR_IMAGE } from '@/data/german/harbor-objects';

function compareWords(input: string, target: string): boolean {
  return input.trim().toLowerCase() === target.toLowerCase();
}

// ═══════════════════════════════════════
// خلفية بحرية
// ═══════════════════════════════════════
function PremiumOceanBackground({ activeColor }: { activeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 2 + Math.random() * 10,
      duration: 10 + Math.random() * 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 20%, #0a1845 0%, #050a1f 50%, #02050f 100%)',
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse 60% 40% at 80% 30%, ${activeColor}22, transparent 60%)` }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '35%', opacity: 0.18 }}>
        <motion.path
          d="M0,100 C300,150 600,50 1200,100 L1200,200 L0,200 Z"
          fill={activeColor}
          animate={{
            d: [
              'M0,100 C300,150 600,50 1200,100 L1200,200 L0,200 Z',
              'M0,120 C300,80 600,130 1200,90 L1200,200 L0,200 Z',
              'M0,100 C300,150 600,50 1200,100 L1200,200 L0,200 Z',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${activeColor}aa, transparent)`,
            boxShadow: `0 0 ${p.size * 2}px ${activeColor}66`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 800) - 100],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            width: 1.5 + Math.random() * 1.5,
            height: 1.5 + Math.random() * 1.5,
            background: 'white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity }}
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
// Hero Letter Display
// ═══════════════════════════════════════
function HeroLetterDisplay({ letterData }: { letterData: Letter }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${letterData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-3 h-3 rounded-full" style={{
          background: letterData.color,
          top: -6, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 15px ${letterData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${letterData.color}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: letterData.gradient[1],
          bottom: -4, right: '30%',
          boxShadow: `0 0 10px ${letterData.gradient[1]}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${letterData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] flex items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${letterData.gradient[0]}22, ${letterData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${letterData.color}44`,
          boxShadow: `0 20px 60px ${letterData.color}33, inset 0 1px 0 ${letterData.color}55, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <span
          className="font-black relative z-10"
          style={{
            fontSize: '11rem',
            background: `linear-gradient(180deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 4px 20px ${letterData.color}88)`,
            textShadow: `0 0 60px ${letterData.color}`,
            lineHeight: 1,
          }}
        >
          {letterData.letter}
        </span>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full opacity-60" style={{
          background: `radial-gradient(ellipse, ${letterData.color}88, transparent)`,
          filter: 'blur(2px)',
        }} />
      </motion.div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.4 }}
        >
          <Sparkles size={12} style={{ color: letterData.color }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// PHASE 1 — تعلم الحرف
// ═══════════════════════════════════════
function LearnLetterPhase({ letterData, onDone, onKarlReact, onCombo }: {
  letterData: Letter;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
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

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim().toUpperCase() === letterData.letter.toUpperCase()) {
      setStatus('correct');
      speakLetter(letterData.letter);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) {
        setConfettiPos({ x: e.clientX, y: e.clientY });
      } else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1100);
    } else {
      setStatus('wrong');
      playBuzzSound();
      onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-letter-${letterData.letter}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 flex justify-center">
            <HeroLetterDisplay letterData={letterData} />
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${letterData.color}aa` }}>
                Buchstabe · الحرف
              </div>
              <div className="text-3xl font-black text-white">تعلم {letterData.letter}</div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <SoundButton onClick={() => speakLetter(letterData.letter)} color={letterData.color} label="استمع للحرف" />
            </div>

            <div className="space-y-3">
              <p className="text-center lg:text-right font-bold text-white/40 text-xs tracking-widest uppercase">اكتب الحرف</p>
              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={letterData.letter}
                color={letterData.color}
                status={status}
                fontSize="3rem"
                maxLength={1}
                uppercase
              />
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
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
                boxShadow: `0 8px 30px ${letterData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${letterData.color}77`,
              }}
            >
              <span className="relative z-10">تحقق ✓</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// PHASE 2 — تعلم الكلمة
// ═══════════════════════════════════════
function LearnWordPhase({ letterData, onDone, onKarlReact, onCombo }: {
  letterData: Letter;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
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

  const handleCheck = (e?: React.MouseEvent) => {
    if (compareWords(input, letterData.word)) {
      setStatus('correct');
      speakWord(letterData.word);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
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
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-word-${letterData.letter}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 flex flex-col items-center gap-5">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[3rem] blur-3xl" style={{
                background: `radial-gradient(circle, ${letterData.color}66, transparent)`,
                transform: 'scale(1.3)',
              }} />

              <div className="relative rounded-[3rem] flex items-center justify-center"
                style={{
                  width: 220, height: 220,
                  background: `linear-gradient(145deg, ${letterData.gradient[0]}22, ${letterData.gradient[1]}11)`,
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${letterData.color}55`,
                  boxShadow: `0 20px 60px ${letterData.color}44, inset 0 1px 0 ${letterData.color}66`,
                }}>
                <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[3rem]" style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)',
                }} />
                <span style={{ fontSize: '8rem', filter: `drop-shadow(0 6px 20px ${letterData.color}aa)` }}>
                  {letterData.emoji}
                </span>
              </div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                  boxShadow: `0 8px 24px ${letterData.color}88`,
                }}
              >
                {letterData.letter}
              </motion.div>
            </motion.div>

            <div className="text-center">
              <div className="font-black text-5xl text-white mb-1" style={{
                textShadow: `0 0 40px ${letterData.color}88, 0 2px 10px rgba(0,0,0,0.5)`,
                background: `linear-gradient(180deg, white, ${letterData.color}cc)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {letterData.word}
              </div>
              <div className="font-bold text-lg" style={{ color: letterData.color }}>{letterData.wordAr}</div>
            </div>

            <SoundButton onClick={() => speakWord(letterData.word)} color={letterData.color} label="استمع للكلمة" />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="text-center lg:text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${letterData.color}aa` }}>
                Wort · الكلمة
              </div>
              <div className="text-2xl font-black text-white">اكتب الكلمة</div>
            </div>

            <GhostInput
              ref={inputRef}
              value={input}
              onChange={v => { setInput(v); setStatus('idle'); }}
              onEnter={handleCheck}
              ghostText={letterData.word}
              color={letterData.color}
              status={status}
              fontSize="1.8rem"
            />

            {requiredChars.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">
                  💡 الحروف الخاصة
                </p>
                <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={letterData.color} />
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
                background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
                boxShadow: `0 8px 30px ${letterData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                borderBottom: `4px solid ${letterData.color}77`,
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
// اختبار الميناء
// ═══════════════════════════════════════
function HarborTest({ groupLetters, totalStars, onPass, onFail, onStarEarned, onKarlReact, onCombo }: {
  groupLetters: Letter[];
  totalStars: number;
  onPass: () => void;
  onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; correct: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLetter = groupLetters[currentIdx];
  const boxes = currentLetter ? (HARBOR_OBJECTS[currentLetter.letter] ?? []) : [];

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showFeedback || finished || boxes.length === 0 || !currentLetter) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width;
    const containerH = rect.height;
    const scale = Math.min(containerW / HARBOR_IMAGE.width, containerH / HARBOR_IMAGE.height);
    const renderedW = HARBOR_IMAGE.width * scale;
    const renderedH = HARBOR_IMAGE.height * scale;
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
    setTimeout(() => setClickEffect(null), 700);

    if (hit) {
      setShowFeedback('correct');
      speakWord(currentLetter.word);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      setFoundLetters(prev => [...prev, currentLetter.letter]);
      onStarEarned(e.clientX, e.clientY);
      setTimeout(() => {
        setShowFeedback(null);
        setShowHint(false);
        if (currentIdx + 1 >= groupLetters.length) {
          setFinished(true);
          onKarlReact('celebrate');
          setTimeout(onPass, 1800);
        } else setCurrentIdx(i => i + 1);
      }, 1200);
    } else {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      setShowFeedback('wrong');
      playBuzzSound();
      onKarlReact('sad');
      setTimeout(() => {
        setShowFeedback(null);
        if (newWrong >= 5) onFail();
      }, 700);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.min(totalStars, 8) }).map((_, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: i * 0.05 }}>
              <Star size={16} fill="#FFD700" color="#FFD700" />
            </motion.div>
          ))}
          {totalStars > 8 && <span className="text-xs font-black text-yellow-400">+{totalStars - 8}</span>}
        </div>
        <span className="text-xs font-bold" style={{ color: wrong >= 3 ? '#FF6B6B' : 'rgba(255,255,255,0.25)' }}>
          {wrong > 0 && '❌'.repeat(Math.min(wrong, 5))} {wrong}/5
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!finished && currentLetter && (
          <motion.div key={currentLetter.letter}
            initial={{ opacity: 0, y: -12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="rounded-2xl border-2 overflow-hidden backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${currentLetter.color}25, ${currentLetter.color}08)`,
              borderColor: `${currentLetter.color}55`,
              boxShadow: `0 8px 30px ${currentLetter.color}33`,
            }}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 border-2 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentLetter.gradient[0]}, ${currentLetter.gradient[1]})`,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  boxShadow: `0 6px 20px ${currentLetter.color}66`,
                }}>
                {currentLetter.letter}
              </div>
              <div className="flex-1 text-right">
                <p className="text-white/50 text-xs font-bold mb-0.5">
                  ابحث عن عنصر يبدأ بحرف {currentLetter.letter}
                  {boxes.length > 1 && <span className="text-yellow-400 mr-1">(في {boxes.length} أماكن)</span>}
                </p>
                <p className="font-black text-white text-xl leading-tight">{currentLetter.word}</p>
                <p className="font-bold text-sm" style={{ color: currentLetter.color }}>{currentLetter.wordAr} {currentLetter.emoji}</p>
              </div>
              <button onClick={() => speakWord(currentLetter.word)}
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90"
                style={{
                  borderColor: `${currentLetter.color}66`,
                  background: `${currentLetter.color}22`,
                  color: 'white',
                }}>
                <Volume2 size={18} />
              </button>
            </div>
            <div className="flex gap-1 px-4 pb-3">
              {groupLetters.map((l, i) => (
                <div key={l.letter} className="flex-1 h-2 rounded-full transition-all"
                  style={{ background: foundLetters.includes(l.letter) ? `linear-gradient(90deg, ${l.gradient[0]}, ${l.gradient[1]})` : i === currentIdx ? `${l.color}55` : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
  ref={containerRef}
  className="relative w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl select-none"
  style={{ 
    aspectRatio: `${HARBOR_IMAGE.width}/${HARBOR_IMAGE.height}`, 
    cursor: 'pointer', 
    background: '#0a1628',
    minHeight: 'min(60vh, 400px)',
  }}
  onClick={handleImageClick}
>
        <img src={HARBOR_IMAGE.src} alt="ميناء" className="w-full h-full"
          style={{ objectFit: 'contain', objectPosition: 'center', pointerEvents: 'none', display: 'block' }}
          draggable={false} />

        <AnimatePresence>
          {showHint && boxes.length > 0 && currentLetter && boxes.map((b, idx) => (
            <motion.div key={`hint-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              exit={{ opacity: 0 }}
              className="absolute rounded-xl pointer-events-none"
              style={{
                left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
                border: `3px solid ${currentLetter.color}`,
                background: `${currentLetter.color}28`,
                boxShadow: `0 0 24px ${currentLetter.color}88`,
              }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {clickEffect && (
            <motion.div
              initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${clickEffect.x}%`, top: `${clickEffect.y}%`,
                transform: 'translate(-50%, -50%)', width: '44px', height: '44px',
                background: clickEffect.correct ? 'rgba(88,204,2,0.6)' : 'rgba(255,68,68,0.6)',
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback === 'correct' && currentLetter && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(88,204,2,0.28), transparent)' }}>
              <motion.div initial={{ y: 20, scale: 0.8 }} animate={{ y: 0, scale: 1 }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-white text-xl"
                style={{ background: 'rgba(88,204,2,0.92)', boxShadow: '0 4px 30px rgba(88,204,2,0.5)' }}>
                ✓ {currentLetter.word}!
              </motion.div>
            </motion.div>
          )}
          {showFeedback === 'wrong' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(255,68,68,0.14)' }} />
          )}
        </AnimatePresence>

        {finished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(0,10,20,0.85)', backdropFilter: 'blur(8px)' }}>
            <motion.div animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.8 }} className="text-7xl">🎉</motion.div>
            <p className="font-black text-white text-3xl">وجدت كل الحاجات!</p>
            <div className="flex gap-1">
              {groupLetters.map(l => <Star key={l.letter} size={24} fill="#FFD700" color="#FFD700" />)}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between px-1">
        <button onClick={() => setShowHint(v => !v)}
          className="text-xs font-bold transition-colors px-4 py-2 rounded-xl border backdrop-blur-sm"
          style={{
            color: showHint ? (currentLetter?.color ?? 'white') : 'rgba(255,255,255,0.4)',
            borderColor: showHint ? `${currentLetter?.color ?? 'white'}66` : 'rgba(255,255,255,0.1)',
            background: showHint ? `${currentLetter?.color ?? 'white'}18` : 'rgba(255,255,255,0.03)',
          }}>
          💡 {showHint ? 'إخفاء التلميح' : 'مش لاقيه؟'}
        </button>
        <span className="text-xs font-bold text-white/30">{foundLetters.length} / {groupLetters.length}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// شاشات نجاح وفشل
// ═══════════════════════════════════════
function SuccessScreen({ groupTitle, onNext }: { groupTitle: string; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8">
      <motion.div animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 1, delay: 0.2 }} className="text-9xl">🏆</motion.div>
      <div>
        <h2 className="text-4xl font-black text-white mb-2">أنهيت {groupTitle}!</h2>
        <p className="font-bold text-lg text-[#4CC9F0]">كمّل على المجموعة الجاية 💪</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 400 }}>
            <Star size={52} fill="#FFD700" color="#FFD700" />
          </motion.div>
        ))}
      </div>
      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onNext}
        className="px-12 py-5 rounded-2xl font-black text-xl text-white"
        style={{
          background: 'linear-gradient(135deg, #4CC9F0, #7209B7)',
          boxShadow: '0 10px 40px rgba(76,201,240,0.4)',
        }}>
        المجموعة الجاية 🚀
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center py-8">
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.5, repeat: 3 }} className="text-8xl">😅</motion.div>
      <div>
        <h2 className="text-3xl font-black text-white mb-2">حاول تاني!</h2>
        <p className="font-bold text-white/40">راجع الحروف كويس وبعدين اعمل الاختبار</p>
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
type Phase = 'learn-letter' | 'learn-word' | 'test' | 'group-success' | 'group-fail' | 'all-done';

export default function GermanLetterLessonPage() {
  const router = useRouter();
  const [groupIdx, setGroupIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn-letter');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 🆕 حالة التحميل
  const LESSON_ID = 'hamburg';

  // 📥 جلب التقدم المحفوظ + استرجاع مكان الطالب
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        // استرجاع النجوم
        setTotalStars(progress.stars);
        
        // 🆕 استرجاع مكان الطالب (لو الدرس مش متكمل)
        if (!progress.completed) {
          if (progress.current_group !== undefined && progress.current_group !== null) {
            setGroupIdx(progress.current_group);
          }
          if (progress.current_letter !== undefined && progress.current_letter !== null) {
            setLetterIdx(progress.current_letter);
          }
          if (progress.current_phase) {
            setPhase(progress.current_phase as Phase);
          }
          console.log(`📍 الرجوع لمكانك: مجموعة ${progress.current_group}, حرف ${progress.current_letter}, مرحلة ${progress.current_phase}`);
        }
        
          console.log('✅ تم تحميل التقدم:', progress);
      }
      setIsLoading(false); // 🆕 خلصنا التحميل
    };
    loadProgress();
  }, []);

  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const group = LETTER_GROUPS[groupIdx];
  const letterData = group?.letters[letterIdx];
  const totalLettersLearned = groupIdx * 6 + letterIdx;
  const totalLetters = LETTERS.length;

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

  const resetCombo = () => setCombo(0);

  // 🎯 حساب التقييم من 3 (بناءً على نسبة الإنجاز)
  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = LETTERS.length;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  // 💾 حفظ المكان الحالي في Supabase
  const savePosition = (newGroup: number, newLetter: number, newPhase: Phase) => {
    const rating = calculateRating(totalStars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup,
      current_letter: newLetter,
      current_phase: newPhase,
    }).then(() => {
      console.log(`📍 تم حفظ المكان: G${newGroup} L${newLetter} ${newPhase}`);
    });
  };

  const handleLetterDone = () => {
    setPhase('learn-word');
    savePosition(groupIdx, letterIdx, 'learn-word');
  };

  const handleWordDone = () => {
    const nextIdx = letterIdx + 1;
    if (nextIdx < group.letters.length) {
      setLetterIdx(nextIdx);
      setPhase('learn-letter');
      savePosition(groupIdx, nextIdx, 'learn-letter');
    } else {
      setPhase('test');
      savePosition(groupIdx, letterIdx, 'test');
    }
  };

  const handleTestPass = () => setPhase('group-success');
  const handleTestFail = () => { resetCombo(); setPhase('group-fail'); };

  const handleGroupNext = () => {
    if (groupIdx + 1 < LETTER_GROUPS.length) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx);
      setLetterIdx(0);
      setPhase('learn-letter');
      savePosition(newGroupIdx, 0, 'learn-letter');
    } else {
      setPhase('all-done');
    }
  };

  const handleRetry = () => {
    setLetterIdx(0);
    setPhase('learn-letter');
    savePosition(groupIdx, 0, 'learn-letter');
  };

  const handleStarEarned = (clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    const newStarsCount = totalStars + 1;
    setTotalStars(newStarsCount);
    setFlyingStars(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 1000);
    
    // 🎯 احسب التقييم الجديد
    const rating = calculateRating(newStarsCount);
    
    // 💾 حفظ التقييم + المكان في Supabase
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: groupIdx,
      current_letter: letterIdx,
      current_phase: phase,
    }).then(() => {
      console.log(`⭐ تقدمك: ${newStarsCount}/${LETTERS.length} نجمة → التقييم: ${rating}/3 | المكان: G${groupIdx} L${letterIdx} ${phase}`);
    });
  };

  // 🆕 لو لسه بيحمّل البيانات، اعرض شاشة تحميل
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

  const phaseLabel: Record<Phase, string> = {
    'learn-letter': 'الحرف', 'learn-word': 'الكلمة', 'test': 'اختبار',
    'group-success': '🎉', 'group-fail': '😅', 'all-done': '🎓',
  };

  const activeColor = letterData?.color ?? '#4CC9F0';

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <PremiumOceanBackground activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#4CC9F0" />
      <ComboDisplay combo={combo} />
      <FlyingStars stars={flyingStars} />

      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(2,5,15,0.95) 70%, transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="ارجع للخريطة (تقدمك محفوظ)">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
                <span className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14 }}>⚓</span>
                  {group.title} — {phaseLabel[phase]}
                </span>
                <span>{Math.min(totalLettersLearned + 1, totalLetters)} / {totalLetters}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #7209B7)`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${(totalLettersLearned / totalLetters) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)',
                  }} />
                </motion.div>
              </div>
            </div>
            <motion.div key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.35 }}
              className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl border border-yellow-400/30"
              style={{ background: 'rgba(255,215,0,0.1)', backdropFilter: 'blur(10px)' }}>
              <svg width="18" height="18" viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5"
                  fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
              <span className="font-black text-sm text-yellow-400">{totalStars}</span>
            </motion.div>
          </div>

          <div className="flex gap-1.5 justify-center">
            {group.letters.map((l, i) => {
              const isDone = phase === 'test' || phase === 'group-success' || i < letterIdx || (i === letterIdx && phase === 'learn-word');
              const isCurrent = i === letterIdx;
              return (
                <motion.div key={l.letter}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all backdrop-blur-md"
                  style={{
                    background: isDone ? `linear-gradient(135deg, ${l.gradient[0]}55, ${l.gradient[1]}33)`
                      : isCurrent ? `linear-gradient(135deg, ${l.gradient[0]}33, ${l.gradient[1]}11)`
                      : 'rgba(255,255,255,0.03)',
                    borderColor: isDone ? l.color : isCurrent ? `${l.color}88` : 'rgba(255,255,255,0.08)',
                    color: isDone ? 'white' : isCurrent ? 'white' : 'rgba(255,255,255,0.2)',
                    boxShadow: isCurrent && !isDone ? `0 0 20px ${l.color}66, inset 0 1px 0 ${l.color}44` : 'none',
                  }}>
                  {isDone ? '✓' : l.letter}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-36 pb-32 px-6 min-h-screen flex flex-col justify-center relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {phase === 'learn-letter' && (
            <LearnLetterPhase key={`ll-${groupIdx}-${letterIdx}`} letterData={letterData} onDone={handleLetterDone} onKarlReact={handleKarlReact} onCombo={handleCombo} />
          )}
          {phase === 'learn-word' && (
            <LearnWordPhase key={`lw-${groupIdx}-${letterIdx}`} letterData={letterData} onDone={handleWordDone} onKarlReact={handleKarlReact} onCombo={handleCombo} />
          )}
          {phase === 'test' && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
              <div className="text-center mb-2">
                <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-1">اختبار الميناء</div>
                <h2 className="text-3xl font-black text-white">ابحث عن كل حاجة! 🔍</h2>
              </div>
              <HarborTest groupLetters={group.letters} totalStars={totalStars} onPass={handleTestPass}
                onFail={handleTestFail} onStarEarned={handleStarEarned} onKarlReact={handleKarlReact} onCombo={handleCombo} />
            </motion.div>
          )}
          {phase === 'group-success' && <SuccessScreen key="success" groupTitle={group.title} onNext={handleGroupNext} />}
          {phase === 'group-fail' && <FailScreen key="fail" onRetry={handleRetry} />}
          {phase === 'all-done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center py-8 max-w-md mx-auto">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1.2, delay: 0.3 }} className="text-9xl">🎓</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">تعلمت كل الحروف!</h2>
                <p className="font-bold text-lg text-[#4CC9F0]">ميناء هامبورغ فُتح بالكامل 🇩🇪</p>
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
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={async () => {
                  // 🏆 الدرس مكتمل = 3 نجوم كاملة + completed
                  await saveLessonProgress(LESSON_ID, 3, true);
                  router.push('/character-and-map?from=lesson');
                }}
                className="flex items-center gap-2 px-12 py-5 rounded-2xl font-black text-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #58CC02, #096A02)',
                  boxShadow: '0 10px 40px rgba(88,204,2,0.4)',
                }}>
                <Trophy size={24} /> الخريطة
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
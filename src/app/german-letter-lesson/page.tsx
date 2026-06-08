'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Volume2, Star, RotateCcw, Trophy, Sparkles, Search } from 'lucide-react';

// 📂 Data
import { LETTERS, LETTER_GROUPS, type Letter } from '@/data/german/letters';
import { getHarborObjects, getHarborImage } from '@/data/german/harbor-objects';

// 🔊 Audio
import { speakLetter, speakWord } from '@/lib/audio/speech';
import { playCoinSound, playBuzzSound, playComboSound } from '@/lib/audio/sounds';

// 💾 Player Data
import { getLessonProgress, saveLessonProgress } from '@/lib/playerData';

// 🎨 Components
import KarlEagle from '@/app/components/lesson/KarlEagle';
import ComboDisplay from '@/app/components/lesson/ComboDisplay';
import FlyingStars from '@/app/components/lesson/FlyingStars';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import SoundButton from '@/app/components/lesson/SoundButton';
import GhostInput from '@/app/components/lesson/GhostInput';
import SpecialCharsKeyboard from '@/app/components/lesson/SpecialCharsKeyboard';

// 🎯 Types
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

// ═══════════════════════════════════════
// 🛠️ Helper Functions
// ═══════════════════════════════════════
type FlyingStar = { id: number; x: number; y: number };

function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

function getRequiredSpecialChars(word: string): string[] {
  const found = new Set<string>();
  for (const char of word) {
    const lower = char.toLowerCase();
    if (['ä', 'ö', 'ü', 'ß'].includes(lower)) {
      if (char === char.toUpperCase() && char !== 'ß') {
        found.add(char);
      } else {
        found.add(lower);
      }
    }
  }
  return Array.from(found);
}

function compareWords(input: string, target: string): boolean {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  return normalize(input) === normalize(target);
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
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Hero Letter Display
// ═══════════════════════════════════════
function HeroLetterDisplay({ letterData, isMobile }: { letterData: Letter; isMobile: boolean }) {
  const size = isMobile ? 160 : 260;
  const fontSize = isMobile ? '6.5rem' : '11rem';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${letterData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: letterData.color,
          top: -4, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 12px ${letterData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-3 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${letterData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2rem] flex items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${letterData.gradient[0]}22, ${letterData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${letterData.color}44`,
          boxShadow: `0 20px 60px ${letterData.color}33, inset 0 1px 0 ${letterData.color}55`,
        }}
      >
        <span
          className="font-black relative z-10"
          style={{
            fontSize,
            background: `linear-gradient(180deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 4px 20px ${letterData.color}88)`,
            lineHeight: 1,
          }}
        >
          {letterData.letter}
        </span>
      </motion.div>

      {!isMobile && [...Array(6)].map((_, i) => (
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
function LearnLetterPhase({ letterData, onDone, onKarlReact, onCombo, isMobile }: {
  letterData: Letter;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  isMobile: boolean;
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

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-letter-${letterData.letter}`}
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        {isMobile ? (
          <div className="flex flex-col items-center gap-3 px-3">
            <HeroLetterDisplay letterData={letterData} isMobile={true} />
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: `${letterData.color}aa` }}>
                Buchstabe · الحرف
              </div>
              <div className="text-xl font-black text-white mt-0.5">تعلم {letterData.letter}</div>
            </div>
            <SoundButton onClick={() => speakLetter(letterData.letter)} color={letterData.color} label="استمع" />
            <div className="w-full space-y-2">
              <p className="text-center font-bold text-white/40 text-[10px] tracking-widest uppercase">اكتب الحرف</p>
              <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }} onEnter={handleCheck} ghostText={letterData.letter} color={letterData.color} status={status} fontSize="2.5rem" maxLength={1} uppercase />
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-xs py-2 rounded-xl"
                    style={{ background: status === 'correct' ? 'rgba(88,204,2,0.18)' : 'rgba(255,68,68,0.18)', color: status === 'correct' ? '#58CC02' : '#FF6B6B', border: `1px solid ${status === 'correct' ? '#58CC0244' : '#FF444444'}` }}>
                    {status === 'correct' ? <><Check size={14} /> ممتاز!</> : <><X size={14} /> جرب تاني</>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleCheck} disabled={!input}
              className="w-full py-3 rounded-2xl font-black text-base text-white disabled:opacity-25 transition-all"
              style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`, boxShadow: `0 6px 20px ${letterData.color}55`, borderBottom: `3px solid ${letterData.color}77` }}>
              تحقق ✓
            </motion.button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex justify-center">
              <HeroLetterDisplay letterData={letterData} isMobile={false} />
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${letterData.color}aa` }}>Buchstabe · الحرف</div>
                <div className="text-3xl font-black text-white">تعلم {letterData.letter}</div>
              </div>
              <div className="flex justify-center lg:justify-start">
                <SoundButton onClick={() => speakLetter(letterData.letter)} color={letterData.color} label="استمع للحرف" />
              </div>
              <div className="space-y-3">
                <p className="text-center lg:text-right font-bold text-white/40 text-xs tracking-widest uppercase">اكتب الحرف</p>
                <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }} onEnter={handleCheck} ghostText={letterData.letter} color={letterData.color} status={status} fontSize="3rem" maxLength={1} uppercase />
                <AnimatePresence>
                  {status !== 'idle' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                      style={{ background: status === 'correct' ? 'rgba(88,204,2,0.18)' : 'rgba(255,68,68,0.18)', color: status === 'correct' ? '#58CC02' : '#FF6B6B', border: `1px solid ${status === 'correct' ? '#58CC0244' : '#FF444444'}` }}>
                      {status === 'correct' ? <><Check size={16} /> ممتاز!</> : <><X size={16} /> جرب تاني</>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
                style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`, boxShadow: `0 8px 30px ${letterData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`, borderBottom: `4px solid ${letterData.color}77` }}>
                تحقق ✓
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// PHASE 2 — تعلم الكلمة
// ═══════════════════════════════════════
function LearnWordPhase({ letterData, onDone, onKarlReact, onCombo, isMobile }: {
  letterData: Letter;
  onDone: () => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  isMobile: boolean;
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

  const emojiSize = isMobile ? 130 : 220;
  const emojiFontSize = isMobile ? '4.5rem' : '8rem';

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={letterData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`learn-word-${letterData.letter}`}
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        {isMobile ? (
          <div className="flex flex-col items-center gap-3 px-3">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative">
              <div className="absolute inset-0 rounded-[2rem] blur-2xl" style={{ background: `radial-gradient(circle, ${letterData.color}66, transparent)`, transform: 'scale(1.2)' }} />
              <div className="relative rounded-[2rem] flex items-center justify-center" style={{ width: emojiSize, height: emojiSize, background: `linear-gradient(145deg, ${letterData.gradient[0]}22, ${letterData.gradient[1]}11)`, border: `2px solid ${letterData.color}55`, boxShadow: `0 15px 40px ${letterData.color}44` }}>
                <span style={{ fontSize: emojiFontSize, filter: `drop-shadow(0 4px 12px ${letterData.color}aa)` }}>{letterData.emoji}</span>
              </div>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 shadow-2xl" style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`, borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                {letterData.letter}
              </motion.div>
            </motion.div>
            <div className="text-center">
              <div className="font-black text-3xl text-white" style={{ textShadow: `0 0 30px ${letterData.color}88` }}>{letterData.word}</div>
              <div className="font-bold text-sm" style={{ color: letterData.color }}>{letterData.wordAr}</div>
            </div>
            <SoundButton onClick={() => speakWord(letterData.word)} color={letterData.color} label="استمع" />
            <div className="w-full space-y-2">
              <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }} onEnter={handleCheck} ghostText={letterData.word} color={letterData.color} status={status} fontSize="1.4rem" />
              {requiredChars.length > 0 && <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={letterData.color} />}
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 font-black text-xs py-2 rounded-xl"
                    style={{ background: status === 'correct' ? 'rgba(88,204,2,0.18)' : 'rgba(255,68,68,0.18)', color: status === 'correct' ? '#58CC02' : '#FF6B6B', border: `1px solid ${status === 'correct' ? '#58CC0244' : '#FF444444'}` }}>
                    {status === 'correct' ? <><Check size={14} /> ممتاز!</> : <><X size={14} /> جرب تاني</>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleCheck} disabled={!input}
              className="w-full py-3 rounded-2xl font-black text-base text-white disabled:opacity-25 transition-all"
              style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`, boxShadow: `0 6px 20px ${letterData.color}55`, borderBottom: `3px solid ${letterData.color}77` }}>
              تحقق ✓
            </motion.button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-5">
              <motion.div animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative">
                <div className="absolute inset-0 rounded-[3rem] blur-3xl" style={{ background: `radial-gradient(circle, ${letterData.color}66, transparent)`, transform: 'scale(1.3)' }} />
                <div className="relative rounded-[3rem] flex items-center justify-center" style={{ width: 220, height: 220, background: `linear-gradient(145deg, ${letterData.gradient[0]}22, ${letterData.gradient[1]}11)`, backdropFilter: 'blur(20px)', border: `2px solid ${letterData.color}55`, boxShadow: `0 20px 60px ${letterData.color}44` }}>
                  <span style={{ fontSize: '8rem', filter: `drop-shadow(0 6px 20px ${letterData.color}aa)` }}>{letterData.emoji}</span>
                </div>
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-2xl" style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`, borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
                  {letterData.letter}
                </motion.div>
              </motion.div>
              <div className="text-center">
                <div className="font-black text-5xl text-white mb-1" style={{ textShadow: `0 0 40px ${letterData.color}88` }}>{letterData.word}</div>
                <div className="font-bold text-lg" style={{ color: letterData.color }}>{letterData.wordAr}</div>
              </div>
              <SoundButton onClick={() => speakWord(letterData.word)} color={letterData.color} label="استمع للكلمة" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${letterData.color}aa` }}>Wort · الكلمة</div>
                <div className="text-2xl font-black text-white">اكتب الكلمة</div>
              </div>
              <GhostInput ref={inputRef} value={input} onChange={v => { setInput(v); setStatus('idle'); }} onEnter={handleCheck} ghostText={letterData.word} color={letterData.color} status={status} fontSize="1.8rem" />
              {requiredChars.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">💡 الحروف الخاصة</p>
                  <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={letterData.color} />
                </div>
              )}
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl"
                    style={{ background: status === 'correct' ? 'rgba(88,204,2,0.18)' : 'rgba(255,68,68,0.18)', color: status === 'correct' ? '#58CC02' : '#FF6B6B', border: `1px solid ${status === 'correct' ? '#58CC0244' : '#FF444444'}` }}>
                    {status === 'correct' ? <><Check size={16} /> ممتاز!</> : <><X size={16} /> جرب تاني</>}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
                style={{ background: `linear-gradient(135deg, ${letterData.gradient[0]}, ${letterData.gradient[1]})`, boxShadow: `0 8px 30px ${letterData.color}55`, borderBottom: `4px solid ${letterData.color}77` }}>
                تحقق ✓
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// 🎴 كارت الحرف الجانبي
// ═══════════════════════════════════════
function SideLetterCard({ currentLetter, boxes, isMobile, onSpeak }: {
  currentLetter: Letter;
  boxes: any[];
  isMobile: boolean;
  onSpeak: () => void;
}) {
  return (
    <motion.div 
      key={currentLetter.letter}
      initial={{ opacity: 0, scale: 0.95, x: -20 }} 
      animate={{ opacity: 1, scale: 1, x: 0 }} 
      exit={{ opacity: 0, scale: 0.95, x: 20 }}
      className="relative rounded-2xl overflow-hidden backdrop-blur-md flex flex-col items-center gap-3 p-4"
      style={{
        background: `linear-gradient(180deg, ${currentLetter.color}25, ${currentLetter.color}08)`,
        border: `1.5px solid ${currentLetter.color}50`,
        boxShadow: `0 8px 32px ${currentLetter.color}30`,
        width: isMobile ? '100%' : '200px',
      }}
    >
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: currentLetter.color }} />

      <div className="flex items-center gap-1.5 justify-center relative z-10">
        <Search size={14} style={{ color: currentLetter.color }} />
        <span className="text-xs font-bold" style={{ color: `${currentLetter.color}dd` }}>
          ابحث عن حرف {currentLetter.letter}
        </span>
        {boxes.length > 1 && (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black" style={{ background: `${currentLetter.color}33`, color: currentLetter.color }}>
            ×{boxes.length}
          </span>
        )}
      </div>

      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center font-black border-2"
        style={{
          background: `linear-gradient(135deg, ${currentLetter.gradient[0]}, ${currentLetter.gradient[1]})`,
          borderColor: 'rgba(255,255,255,0.3)',
          color: 'white',
          fontSize: '4rem',
          boxShadow: `0 10px 30px ${currentLetter.color}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
        }}
      >
        {currentLetter.letter}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="absolute -top-2 -right-2">
          <Sparkles size={20} style={{ color: '#FFD700' }} />
        </motion.div>
      </motion.div>

      <div className="font-black text-white text-lg text-center relative z-10" style={{ textShadow: `0 2px 8px ${currentLetter.color}66` }}>
        {currentLetter.wordAr}
      </div>

      <div className="flex items-center gap-2 justify-center relative z-10 px-3 py-2 rounded-xl" style={{ background: `${currentLetter.color}15`, border: `1px solid ${currentLetter.color}33` }}>
        <span className="text-2xl">{currentLetter.emoji}</span>
        <span className="font-black text-base" style={{ color: currentLetter.color }}>{currentLetter.word}</span>
      </div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSpeak}
        className="relative z-10 w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all"
        style={{
          borderColor: `${currentLetter.color}66`,
          background: `linear-gradient(135deg, ${currentLetter.color}33, ${currentLetter.color}11)`,
          color: 'white',
          boxShadow: `0 4px 12px ${currentLetter.color}33`,
        }}
      >
        <Volume2 size={16} />
        استمع
      </motion.button>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// اختبار الميناء - الصورة كبيرة + الكارت على اليمين
// ═══════════════════════════════════════
function HarborTest({ groupLetters, totalStars, onPass, onFail, onStarEarned, onKarlReact, onCombo, isMobile }: {
  groupLetters: Letter[];
  totalStars: number;
  onPass: () => void;
  onFail: () => void;
  onStarEarned: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
  isMobile: boolean;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [foundLetters, setFoundLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; correct: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const harborImage = useMemo(() => getHarborImage(isMobile), [isMobile]);
  const harborObjects = useMemo(() => getHarborObjects(isMobile), [isMobile]);

  const currentLetter = groupLetters[currentIdx];
  const boxes = currentLetter ? (harborObjects[currentLetter.letter] ?? []) : [];

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (showFeedback || finished || boxes.length === 0 || !currentLetter) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerW = rect.width;
    const containerH = rect.height;

    // ✅ نستخدم contain - الصورة كاملة من غير قص
const scale = Math.min(containerW / harborImage.width, containerH / harborImage.height);
const renderedW = harborImage.width * scale;
const renderedH = harborImage.height * scale;
const offsetX = (containerW - renderedW) / 2;
const offsetY = (containerH - renderedH) / 2;

    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;

    if (clickX < 0 || clickY < 0 || clickX > renderedW || clickY > renderedH) return;

    const pctX = (clickX / renderedW) * 100;
    const pctY = (clickY / renderedH) * 100;

    const hit = boxes.some(b =>
      pctX >= b.x && pctX <= b.x + b.w &&
      pctY >= b.y && pctY <= b.y + b.h
    );

    const relX = ((e.clientX - rect.left) / containerW) * 100;
    const relY = ((e.clientY - rect.top) / containerH) * 100;

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
        } else {
          setCurrentIdx(i => i + 1);
        }
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
  }, [showFeedback, finished, boxes, currentLetter, harborImage, currentIdx, groupLetters.length, wrong, onCombo, onKarlReact, onStarEarned, onPass, onFail]);

  // 🖼️ مكون الصورة - الصورة تملى الإطار كامل
  const ImageBox = (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white/10"
      style={{ 
        cursor: 'pointer', 
        background: '#0a1628',
      }}
      onClick={handleImageClick}
    >
      <img 
  src={harborImage.src} 
  alt="ميناء" 
  className="w-full h-full"
  style={{ 
    objectFit: 'contain',
    pointerEvents: 'none', 
    display: 'block',
  }}
  draggable={false} 
/>

      <AnimatePresence>
        {showHint && boxes.length > 0 && currentLetter && boxes.map((b, idx) => (
          <motion.div key={`hint-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            exit={{ opacity: 0 }}
            className="absolute rounded-xl pointer-events-none"
            style={{
              left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
              border: `3px solid ${currentLetter.color}`,
              background: `${currentLetter.color}28`,
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {clickEffect && (
          <motion.div
            initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${clickEffect.x}%`, top: `${clickEffect.y}%`,
              transform: 'translate(-50%, -50%)', width: '40px', height: '40px',
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-white text-lg"
              style={{ background: 'rgba(88,204,2,0.92)' }}>
              ✓ {currentLetter.word}!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(0,10,20,0.85)' }}>
          <div className="text-6xl">🎉</div>
          <p className="font-black text-white text-2xl">ممتاز!</p>
          <div className="flex gap-1">
            {groupLetters.map(l => <Star key={l.letter} size={20} fill="#FFD700" color="#FFD700" />)}
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-7xl mx-auto px-2"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalStars, isMobile ? 5 : 8) }).map((_, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: i * 0.05 }}>
              <Star size={isMobile ? 12 : 16} fill="#FFD700" color="#FFD700" />
            </motion.div>
          ))}
          {totalStars > (isMobile ? 5 : 8) && <span className="text-[10px] font-black text-yellow-400">+{totalStars - (isMobile ? 5 : 8)}</span>}
        </div>
        <span className="text-[10px] font-bold" style={{ color: wrong >= 3 ? '#FF6B6B' : 'rgba(255,255,255,0.25)' }}>
          {wrong > 0 && '❌'.repeat(Math.min(wrong, 5))} {wrong}/5
        </span>
      </div>

      {/* 📱 الموبايل: كارت فوق + صورة تحت */}
      {/* 🖥️ الديسكتوب: صورة شمال + كارت يمين */}
      {isMobile ? (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {!finished && currentLetter && (
              <SideLetterCard currentLetter={currentLetter} boxes={boxes} isMobile={true} onSpeak={() => speakWord(currentLetter.word)} />
            )}
          </AnimatePresence>
          <div style={{ height: '60vh' }}>{ImageBox}</div>
        </div>
    ) : (
        <div className="flex gap-4 items-stretch" style={{ height: '78vh' }}>
          {/* الكارت الجانبي - على اليمين */}
          <div className="flex-shrink-0 flex items-center">
            <AnimatePresence mode="wait">
              {!finished && currentLetter && (
                <SideLetterCard currentLetter={currentLetter} boxes={boxes} isMobile={false} onSpeak={() => speakWord(currentLetter.word)} />
              )}
            </AnimatePresence>
          </div>
          
          {/* الصورة - تاخد المساحة الأكبر */}
          <div className="flex-1 min-w-0">
            {ImageBox}
          </div>
        </div>
      )}

      {/* Progress dots */}
      {!finished && (
        <div className="flex gap-1 px-1 mt-3">
          {groupLetters.map((l, i) => (
            <div key={l.letter} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full" style={{ 
                background: foundLetters.includes(l.letter) ? `linear-gradient(90deg, ${l.gradient[0]}, ${l.gradient[1]})` : i === currentIdx ? `${l.color}88` : 'transparent',
                width: foundLetters.includes(l.letter) || i === currentIdx ? '100%' : '0%',
              }} />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-1 mt-2">
        <button onClick={() => setShowHint(v => !v)}
          className={`${isMobile ? 'text-[10px] px-3 py-1.5' : 'text-xs px-4 py-2'} font-bold rounded-xl border`}
          style={{
            color: showHint ? (currentLetter?.color ?? 'white') : 'rgba(255,255,255,0.4)',
            borderColor: showHint ? `${currentLetter?.color ?? 'white'}66` : 'rgba(255,255,255,0.1)',
            background: showHint ? `${currentLetter?.color ?? 'white'}18` : 'rgba(255,255,255,0.03)',
          }}>
          💡 {showHint ? 'إخفاء التلميح' : 'إظهار التلميح'}
        </button>
        <span className="text-[10px] font-bold text-white/30">{foundLetters.length} / {groupLetters.length}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// شاشات نجاح وفشل
// ═══════════════════════════════════════
function SuccessScreen({ groupTitle, onNext }: { groupTitle: string; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center py-6 px-4">
      <div className="text-7xl">🏆</div>
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-2">أنهيت {groupTitle}!</h2>
        <p className="font-bold text-sm md:text-lg text-[#4CC9F0]">كمّل على المجموعة الجاية 💪</p>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(s => (
          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + s * 0.15, type: 'spring' }}>
            <Star size={40} fill="#FFD700" color="#FFD700" />
          </motion.div>
        ))}
      </div>
      <motion.button onClick={onNext} className="px-8 py-4 rounded-2xl font-black text-base md:text-xl text-white"
        style={{ background: 'linear-gradient(135deg, #4CC9F0, #7209B7)', boxShadow: '0 10px 30px rgba(76,201,240,0.4)' }}>
        المجموعة الجاية 🚀
      </motion.button>
    </motion.div>
  );
}

function FailScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-center py-6 px-4">
      <div className="text-6xl">😅</div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">حاول تاني!</h2>
        <p className="font-bold text-sm text-white/40">راجع الحروف</p>
      </div>
      <motion.button onClick={onRetry} className="flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-base text-white"
        style={{ background: 'linear-gradient(135deg, #F72585, #7209B7)' }}>
        <RotateCcw size={18} /> أعد المحاولة
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
  const isMobile = useIsMobile();
  const [groupIdx, setGroupIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn-letter');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const LESSON_ID = 'hamburg';

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLessonProgress(LESSON_ID);
      if (progress) {
        setTotalStars(progress.stars);
        if (!progress.completed) {
          if (progress.current_group !== undefined && progress.current_group !== null) setGroupIdx(progress.current_group);
          if (progress.current_letter !== undefined && progress.current_letter !== null) setLetterIdx(progress.current_letter);
          if (progress.current_phase) setPhase(progress.current_phase as Phase);
        }
      }
      setIsLoading(false);
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

  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = LETTERS.length;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newGroup: number, newLetter: number, newPhase: Phase) => {
    const rating = calculateRating(totalStars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup,
      current_letter: newLetter,
      current_phase: newPhase,
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
    const rating = calculateRating(newStarsCount);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: groupIdx,
      current_letter: letterIdx,
      current_phase: phase,
    });
  };

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
    <div className="min-h-screen text-white relative overflow-hidden" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <PremiumOceanBackground activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#4CC9F0" />
      <ComboDisplay combo={combo} />
      <FlyingStars stars={flyingStars} />

      <div className="fixed top-0 left-0 right-0 z-30"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(2,5,15,0.98) 70%, transparent)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}>
        <div className={`max-w-6xl mx-auto ${isMobile ? 'px-2 py-2' : 'px-4 py-2'}`}>
          <div className={`flex items-center gap-2 ${isMobile ? 'mb-1.5' : 'mb-2'}`}>
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl border border-white/10 text-white flex-shrink-0 bg-white/5`}
              title="ارجع للخريطة">
              <ArrowLeft size={isMobile ? 16 : 18} />
            </button>
            <div className="flex-1 min-w-0">
              <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-1 text-white/40`}>
                <span className="flex items-center gap-1 truncate">
                  <span>⚓</span>
                  {isMobile ? group.title : `${group.title} — ${phaseLabel[phase]}`}
                </span>
                <span className="flex-shrink-0">{Math.min(totalLettersLearned + 1, totalLetters)}/{totalLetters}</span>
              </div>
              <div className={`w-full ${isMobile ? 'h-1.5' : 'h-2'} bg-white/5 rounded-full overflow-hidden border border-white/5`}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #7209B7)` }}
                  animate={{ width: `${(totalLettersLearned / totalLetters) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }} />
              </div>
            </div>
            <motion.div key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.35 }}
              className={`flex items-center gap-1 flex-shrink-0 ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-xl border border-yellow-400/30`}
              style={{ background: 'rgba(255,215,0,0.1)' }}>
              <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5"
                  fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
              <span className={`font-black ${isMobile ? 'text-xs' : 'text-sm'} text-yellow-400`}>{totalStars}</span>
            </motion.div>
          </div>

          <div className={`flex gap-1 justify-center ${isMobile ? 'flex-wrap' : ''}`}>
            {group.letters.map((l, i) => {
              const isDone = phase === 'test' || phase === 'group-success' || i < letterIdx || (i === letterIdx && phase === 'learn-word');
              const isCurrent = i === letterIdx;
              return (
                <div key={l.letter}
                  className={`${isMobile ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-sm'} rounded-lg flex items-center justify-center font-black border-2 flex-shrink-0`}
                  style={{
                    background: isDone ? `linear-gradient(135deg, ${l.gradient[0]}55, ${l.gradient[1]}33)`
                      : isCurrent ? `linear-gradient(135deg, ${l.gradient[0]}33, ${l.gradient[1]}11)`
                      : 'rgba(255,255,255,0.03)',
                    borderColor: isDone ? l.color : isCurrent ? `${l.color}88` : 'rgba(255,255,255,0.08)',
                    color: isDone ? 'white' : isCurrent ? 'white' : 'rgba(255,255,255,0.2)',
                    boxShadow: isCurrent && !isDone ? `0 0 12px ${l.color}66` : 'none',
                  }}>
                  {isDone ? '✓' : l.letter}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div 
  className={`${isMobile ? 'px-1' : 'px-3'} min-h-screen flex flex-col justify-start relative`}
  style={{ 
    zIndex: 10,
    paddingTop: isMobile ? '110px' : '95px',
    paddingBottom: '10px',
  }}>
        <AnimatePresence mode="wait">
          {phase === 'learn-letter' && (
            <LearnLetterPhase key={`ll-${groupIdx}-${letterIdx}`} letterData={letterData} onDone={handleLetterDone} onKarlReact={handleKarlReact} onCombo={handleCombo} isMobile={isMobile} />
          )}
          {phase === 'learn-word' && (
            <LearnWordPhase key={`lw-${groupIdx}-${letterIdx}`} letterData={letterData} onDone={handleWordDone} onKarlReact={handleKarlReact} onCombo={handleCombo} isMobile={isMobile} />
          )}
          {phase === 'test' && (
            <HarborTest groupLetters={group.letters} totalStars={totalStars} onPass={handleTestPass}
              onFail={handleTestFail} onStarEarned={handleStarEarned} onKarlReact={handleKarlReact} onCombo={handleCombo} isMobile={isMobile} />
          )}
          {phase === 'group-success' && <SuccessScreen key="success" groupTitle={group.title} onNext={handleGroupNext} />}
          {phase === 'group-fail' && <FailScreen key="fail" onRetry={handleRetry} />}
          {phase === 'all-done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 text-center py-6 max-w-md mx-auto px-4">
              <div className="text-7xl">🎓</div>
              <div>
                <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black text-white mb-2`}>تعلمت كل الحروف!</h2>
                <p className="font-bold text-sm md:text-lg text-[#4CC9F0]">ميناء هامبورغ فُتح 🇩🇪</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-yellow-400/30"
                style={{ background: 'rgba(255,215,0,0.1)' }}>
                <Star size={isMobile ? 24 : 32} fill="#FFD700" color="#FFD700" />
                <span className={`font-black ${isMobile ? 'text-2xl' : 'text-4xl'} text-yellow-400`}>{totalStars}</span>
                <span className="font-bold text-white/40">نجمة!</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + s * 0.15, type: 'spring' }}>
                    <Star size={isMobile ? 36 : 56} fill="#FFD700" color="#FFD700" />
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={async () => {
                  await saveLessonProgress(LESSON_ID, 3, true);
                  router.push('/character-and-map?from=lesson');
                }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base md:text-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #58CC02, #096A02)',
                  boxShadow: '0 10px 30px rgba(88,204,2,0.4)',
                }}>
                <Trophy size={20} /> الخريطة
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
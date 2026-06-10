'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Sparkles, Volume2 } from 'lucide-react';
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
import { speakNumber } from '@/lib/audio/speech';

// 📦 البيانات من الملفات المنفصلة
import { NUMBERS, NUMBER_GROUPS, type NumberItem } from '@/data/german/numbers';

type Phase = 'listen' | 'write' | 'test';

// ═══════════════════════════════════════
// 🆕 Hook للكشف عن الموبايل
// ═══════════════════════════════════════
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

// ═══════════════════════════════════════
// 🆕 Hook للكشف عن الكيبورد
// ═══════════════════════════════════════
function useKeyboardOpen(): boolean {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const initialHeight = window.visualViewport.height;
    let threshold = 150; // لو الفرق أكبر من 150px = الكيبورد مفتوح

    const handleResize = () => {
      if (!window.visualViewport) return;
      const currentHeight = window.visualViewport.height;
      const diff = initialHeight - currentHeight;
      setIsOpen(diff > threshold);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return isOpen;
}

// ═══════════════════════════════════════
// خلفية الكاتدرائية
// ═══════════════════════════════════════
function PremiumCathedralBackground({ activeColor }: { activeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 2 + Math.random() * 8,
      duration: 12 + Math.random() * 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a0f3a 0%, #0a0820 50%, #050310 100%)',
      }} />
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activeColor}44, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse 60% 40% at 20% 80%, ${activeColor}33, transparent 60%)` }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
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
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {Array.from({ length: 35 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
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
// 🆕 بطاقات الأرقام المتعلمة (للموبايل بس - تحت)
// ═══════════════════════════════════════
function LearnedNumbersCards({ completedNums, allNumbers, activeColor }: {
  completedNums: Set<number>;
  allNumbers: NumberItem[];
  activeColor: string;
}) {
  const learned = allNumbers.filter(n => completedNums.has(n.num));

  if (learned.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full px-4 pb-4"
      >
        <div className="rounded-2xl p-5 text-center backdrop-blur-md border"
          style={{
            background: `linear-gradient(135deg, ${activeColor}15, ${activeColor}05)`,
            borderColor: `${activeColor}33`,
          }}
        >
          <div className="text-4xl mb-2">📚</div>
          <div className="font-black text-white text-sm mb-1">ابدأ رحلتك!</div>
          <div className="text-white/50 text-xs">الأرقام اللي هتتعلمها هتظهر هنا</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full px-3 pb-4"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} style={{ color: activeColor }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: `${activeColor}cc` }}>
            اتعلمتها · {learned.length}
          </span>
        </div>
        <span className="text-[10px] text-white/30 font-bold">اضغط للسماع 🔊</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {learned.map((n, i) => (
          <motion.button
            key={n.num}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => speakNumber(n.de)}
            className="relative rounded-xl p-2.5 flex flex-col items-center gap-1 backdrop-blur-md border-2"
            style={{
              background: `linear-gradient(135deg, ${n.gradient[0]}25, ${n.gradient[1]}10)`,
              borderColor: `${n.color}55`,
              boxShadow: `0 4px 12px ${n.color}33, inset 0 1px 0 ${n.color}44`,
            }}
          >
            <div className="flex items-center gap-1 w-full justify-center">
              <span className="text-base">{n.emoji}</span>
              <span className="font-black text-xl tabular-nums"
                style={{
                  color: 'white',
                  textShadow: `0 0 10px ${n.color}aa`,
                }}>
                {n.num}
              </span>
            </div>
            <span className="font-black text-[11px] truncate w-full text-center" style={{
              color: n.color,
              direction: 'ltr',
              textShadow: `0 0 8px ${n.color}66`,
            }}>
              {n.de}
            </span>
            <Volume2 size={9} className="absolute top-1 left-1" style={{ color: `${n.color}aa` }} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// Hero Number Display
// ═══════════════════════════════════════
function HeroNumberDisplay({ numData, isMobile }: { numData: NumberItem; isMobile?: boolean }) {
  const size = isMobile ? 180 : 260;
  const fontSize = isMobile ? '6rem' : '10rem';
  const deFontSize = isMobile ? 'text-lg' : 'text-2xl';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: `${numData.color}33` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-3 h-3 rounded-full" style={{
          background: numData.color,
          top: -6, left: '50%', transform: 'translateX(-50%)',
          boxShadow: `0 0 15px ${numData.color}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-4 rounded-full border"
        style={{ borderColor: `${numData.color}22` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute w-2 h-2 rounded-full" style={{
          background: numData.gradient[1],
          bottom: -4, right: '30%',
          boxShadow: `0 0 10px ${numData.gradient[1]}`,
        }} />
      </motion.div>

      <motion.div
        className="absolute inset-8 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${numData.color}66, transparent)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [-1, 1, -1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[2.5rem] flex flex-col items-center justify-center select-none"
        style={{
          width: '78%', height: '78%',
          background: `linear-gradient(145deg, ${numData.gradient[0]}22, ${numData.gradient[1]}11)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${numData.color}44`,
          boxShadow: `0 20px 60px ${numData.color}33, inset 0 1px 0 ${numData.color}55, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[2.5rem]" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
        }} />

        <span
          className="font-black relative z-10 tabular-nums"
          style={{
            fontSize,
            background: `linear-gradient(180deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: `drop-shadow(0 4px 20px ${numData.color}88)`,
            textShadow: `0 0 60px ${numData.color}`,
            lineHeight: 1,
          }}
        >
          {numData.num}
        </span>

        <div className="relative z-10 text-center -mt-2">
          <div className={`font-black ${deFontSize}`} style={{ color: numData.color, textShadow: `0 0 20px ${numData.color}` }}>
            {numData.de}
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-1 rounded-full opacity-60" style={{
          background: `radial-gradient(ellipse, ${numData.color}88, transparent)`,
          filter: 'blur(2px)',
        }} />
      </motion.div>

      {!isMobile && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.4 }}
        >
          <Sparkles size={12} style={{ color: numData.color }} />
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// EmojiCount
// ═══════════════════════════════════════
function EmojiCount({ emoji, count, color, isMobile }: { emoji: string; count: number; color: string; isMobile?: boolean }) {
  const rows: number[] = count <= 5 ? [count] : [5, count - 5];
  const emojiSize = isMobile ? 'text-2xl' : 'text-4xl';
  const gap = isMobile ? 'gap-1.5' : 'gap-2.5';
  return (
    <div className={`flex flex-col items-center ${gap}`}>
      {rows.map((n, ri) => (
        <div key={ri} className={`flex flex-wrap justify-center ${gap}`}>
          {Array.from({ length: n }).map((_, i) => (
            <motion.span key={i}
              initial={{ scale: 0, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 + ri * 0.2, type: 'spring', stiffness: 400 }}
              className={`${emojiSize} select-none`}
              style={{ filter: `drop-shadow(0 4px 12px ${color}99)` }}>
              {emoji}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// Match Game
// ═══════════════════════════════════════
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MatchGame({
  group, groupTitle, onComplete, onStar, onKarlReact, onCombo,
}: {
  group: NumberItem[];
  groupTitle: string;
  onComplete: () => void;
  onStar: (x: number, y: number) => void;
  onKarlReact: (mood: KarlMood) => void;
  onCombo: () => void;
}) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [deOrder, setDeOrder] = useState<NumberItem[]>(() => shuffle(group));
  const [dragging, setDragging] = useState<number | null>(null);
  const [overTarget, setOverTarget] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<{ num: number; de: number } | null>(null);
  const [successPair, setSuccessPair] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });

  const touchDragging = useRef<number | null>(null);
  const touchCloneRef = useRef<HTMLElement | null>(null);
  const touchOffRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setDeOrder(shuffle(group));
    setMatched(new Set());
    setErrors(0);
  }, [group]);

  useEffect(() => {
    if (matched.size === group.length) {
      onKarlReact('celebrate');
      setTimeout(onComplete, 800);
    }
  }, [matched]);

  const doMatch = (fromNum: number, toNum: number, cx: number, cy: number) => {
    if (fromNum === toNum) {
      const n = group.find(x => x.num === fromNum)!;
      speakNumber(n.de);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      onStar(cx, cy);
      setConfettiPos({ x: cx, y: cy });
      setConfettiTrigger(t => t + 1);
      setSuccessPair(fromNum);
      setTimeout(() => setSuccessPair(null), 600);
      setMatched(prev => new Set([...prev, fromNum]));
    } else {
      playBuzzSound();
      onKarlReact('sad');
      setErrors(e => e + 1);
      setWrongPair({ num: fromNum, de: toNum });
      setTimeout(() => setWrongPair(null), 500);
    }
  };

  const handleDragStart = (num: number) => setDragging(num);
  const handleDragEnd = () => { setDragging(null); setOverTarget(null); };
  const handleDragOver = (e: React.DragEvent, num: number) => {
    e.preventDefault(); setOverTarget(num);
  };
  const handleDrop = (e: React.DragEvent, toNum: number) => {
    e.preventDefault();
    setOverTarget(null);
    if (dragging !== null) doMatch(dragging, toNum, e.clientX, e.clientY);
    setDragging(null);
  };

  const onTouchStart = (e: React.TouchEvent, num: number) => {
    if (matched.has(num)) return;
    touchDragging.current = num;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    touchOffRef.current = {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
    const clone = card.cloneNode(true) as HTMLElement;
    clone.style.cssText = `
      position:fixed;left:${rect.left}px;top:${rect.top}px;
      width:${rect.width}px;height:${rect.height}px;
      opacity:.88;pointer-events:none;z-index:9998;
      border-radius:20px;transition:none;
    `;
    document.body.appendChild(clone);
    touchCloneRef.current = clone;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchCloneRef.current) return;
    const x = e.touches[0].clientX - touchOffRef.current.x;
    const y = e.touches[0].clientY - touchOffRef.current.y;
    touchCloneRef.current.style.left = x + 'px';
    touchCloneRef.current.style.top = y + 'px';
    const ex = e.touches[0].clientX, ey = e.touches[0].clientY;
    let found: number | null = null;
    document.querySelectorAll('[data-de-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        found = parseInt((el as HTMLElement).dataset.deTarget!);
      }
    });
    setOverTarget(found);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchCloneRef.current?.remove(); touchCloneRef.current = null;
    const ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
    let dropped: number | null = null;
    document.querySelectorAll('[data-de-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (ex >= r.left && ex <= r.right && ey >= r.top && ey <= r.bottom) {
        dropped = parseInt((el as HTMLElement).dataset.deTarget!);
      }
    });
    if (dropped !== null && touchDragging.current !== null) {
      doMatch(touchDragging.current, dropped, ex, ey);
    }
    setOverTarget(null);
    touchDragging.current = null;
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#A78BFA', '#F472B6', '#FFFFFF']} />
      <motion.div
        key="match-game"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full flex flex-col items-center gap-5 max-w-2xl mx-auto"
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse bg-purple-400" />
            <span className="text-white/40 text-xs tracking-widest uppercase font-bold">
              {groupTitle} — طابق الأرقام
            </span>
          </div>
          <p className="text-white/30 text-sm">اسحب كل رقم وضعه على ترجمته بالألمانية</p>
        </div>

        <div className="flex gap-2.5">
          {group.map(n => (
            <motion.div
              key={n.num}
              animate={matched.has(n.num) ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: matched.has(n.num) ? `linear-gradient(135deg, ${n.gradient[0]}, ${n.gradient[1]})` : 'rgba(255,255,255,0.15)',
                boxShadow: matched.has(n.num) ? `0 0 12px ${n.color}99` : 'none',
              }}
            />
          ))}
        </div>

        {errors > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
          >
            {Array.from({ length: Math.min(errors, 5) }).map((_, i) => (
              <span key={i} style={{ fontSize: 10 }}>❌</span>
            ))}
            <span className="mr-1">{errors} خطأ</span>
          </motion.div>
        )}

        <div className="w-full max-w-xl" dir="rtl">
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 32px 1fr' }}>
            <div className="text-center text-xs text-white/30 tracking-widest uppercase pb-2 font-bold">الأرقام</div>
            <div />
            <div className="text-center text-xs text-white/30 tracking-widest uppercase pb-2 font-bold">بالألمانية</div>

            {group.map((n, i) => {
              const deItem = deOrder[i];
              const numMatched = matched.has(n.num);
              const deMatched = matched.has(deItem.num);
              const isWrongNum = wrongPair?.num === n.num;
              const isWrongDe = wrongPair?.de === deItem.num;
              const isSuccessNum = successPair === n.num;
              const isSuccessDe = successPair === deItem.num;
              const isOver = overTarget === deItem.num && !deMatched;

              return (
                <div key={`row-${i}`} className="contents">
                  <motion.div
                    draggable={!numMatched}
                    onDragStart={() => handleDragStart(n.num)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={e => onTouchStart(e, n.num)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={() => speakNumber(n.de)}
                    animate={
                      isWrongNum ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : isSuccessNum ? { scale: [1, 1.1, 1] }
                      : {}
                    }
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center justify-center gap-2 rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                    style={{
                      cursor: numMatched ? 'default' : 'grab',
                      background: numMatched
                        ? `linear-gradient(135deg, ${n.gradient[0]}33, ${n.gradient[1]}15)`
                        : dragging === n.num
                        ? `linear-gradient(135deg, ${n.gradient[0]}44, ${n.gradient[1]}22)`
                        : `linear-gradient(135deg, ${n.color}11, rgba(255,255,255,0.03))`,
                      border: `2px solid ${
                        numMatched ? n.color + '88'
                        : isWrongNum ? '#ef4444'
                        : isSuccessNum ? '#22c55e'
                        : n.color + '44'
                      }`,
                      boxShadow: numMatched
                        ? `0 0 25px ${n.color}44, inset 0 1px 0 ${n.color}66`
                        : dragging === n.num
                        ? `0 10px 40px ${n.color}55, inset 0 1px 0 ${n.color}88`
                        : `inset 0 1px 0 ${n.color}22`,
                      opacity: dragging !== null && dragging !== n.num && !numMatched ? 0.4 : 1,
                      transition: 'opacity .2s, background .2s, border-color .2s, box-shadow .2s',
                    }}
                  >
                    <span className="text-xl select-none">{n.emoji}</span>
                    <span
                      className="text-2xl font-black tabular-nums"
                      style={{
                        color: 'white',
                        textShadow: `0 0 20px ${n.color}aa`,
                      }}
                    >
                      {n.num}
                    </span>

                    {numMatched && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold"
                        style={{ color: n.color }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>

                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                      animate={(numMatched && deMatched) ? { scale: [1, 1.5, 1] } : {}}
                    />
                  </div>

                  <motion.div
                    data-de-target={deItem.num}
                    onDragOver={e => !deMatched && handleDragOver(e, deItem.num)}
                    onDragLeave={() => setOverTarget(null)}
                    onDrop={e => !deMatched && handleDrop(e, deItem.num)}
                    onClick={() => speakNumber(deItem.de)}
                    animate={
                      isWrongDe ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : isSuccessDe ? { scale: [1, 1.1, 1] }
                      : {}
                    }
                    transition={{ duration: 0.35 }}
                    className="relative flex items-center justify-center gap-2 rounded-2xl px-3 py-3.5 select-none backdrop-blur-md"
                    style={{
                      cursor: deMatched ? 'default' : 'pointer',
                      background: deMatched
                        ? `linear-gradient(135deg, ${deItem.gradient[0]}33, ${deItem.gradient[1]}15)`
                        : isOver
                        ? `linear-gradient(135deg, ${deItem.gradient[0]}44, ${deItem.gradient[1]}22)`
                        : 'rgba(255,255,255,0.04)',
                      border: `2px ${deMatched ? 'solid' : 'dashed'} ${
                        deMatched ? deItem.color + '88'
                        : isOver ? deItem.color
                        : isWrongDe ? '#ef4444'
                        : 'rgba(255,255,255,0.18)'
                      }`,
                      boxShadow: isOver
                        ? `0 0 30px ${deItem.color}66, inset 0 0 25px ${deItem.color}22`
                        : deMatched
                        ? `0 0 25px ${deItem.color}44, inset 0 1px 0 ${deItem.color}66`
                        : 'none',
                      transition: 'all .2s',
                    }}
                  >
                    {deMatched && (
                      <span
                        className="text-xl font-black tabular-nums"
                        style={{ color: 'white', textShadow: `0 0 15px ${deItem.color}` }}
                      >
                        {deItem.num}
                      </span>
                    )}
                    <div className="flex flex-col items-center leading-tight">
                      <span
                        className="font-black tracking-wide"
                        style={{
                          fontSize: 18,
                          direction: 'ltr',
                          color: deMatched ? 'white' : 'rgba(255,255,255,0.9)',
                          textShadow: deMatched ? `0 0 15px ${deItem.color}cc` : 'none',
                        }}
                      >
                        {deItem.de}
                      </span>
                      <span className="text-xs text-white/40">{deItem.ar}</span>
                    </div>
                    {deMatched && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-bold"
                        style={{ color: deItem.color }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-white/25 text-xs text-center">💡 اضغط على أي بطاقة لتسمع النطق</p>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════
// PHASE 1 — استمع واكتب الرقم (Mobile + Desktop)
// ═══════════════════════════════════════
function ListenPhase({ numData, groupTitle, onDone, onKarlReact, onCombo, isMobile }: {
  numData: NumberItem;
  groupTitle: string;
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
    setInput('');
    setStatus('idle');
    const t = setTimeout(() => { speakNumber(numData.de); }, 500);
    return () => clearTimeout(t);
  }, [numData.num]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim() === String(numData.num)) {
      setStatus('correct');
      speakNumber(numData.de);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1000);
    } else {
      setStatus('wrong');
      playBuzzSound();
      onKarlReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={numData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`listen-${numData.num}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        {isMobile ? (
          // 📱 Mobile Layout - مدمج وعموي
          <div className="flex flex-col items-center gap-3 px-3">
            <HeroNumberDisplay numData={numData} isMobile />
            <SoundButton onClick={() => speakNumber(numData.de)} color={numData.color} label="استمع" />
            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: `${numData.color}aa` }}>
                Zahl · {groupTitle}
              </div>
              <div className="text-base font-black text-white mt-0.5">اكتب الرقم (1, 2, 3...)</div>
            </div>
            <div className="w-full">
              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={String(numData.num)}
                color={numData.color}
                status={status}
                fontSize="2.8rem"
                maxLength={2}
                inputMode="numeric"
                numbersOnly
              />
            </div>
            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-xs py-2 px-4 rounded-xl"
                  style={{
                    background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    color: status === 'correct' ? '#22c55e' : '#ef4444',
                    border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
                  }}>
                  {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-3 rounded-2xl font-black text-base text-white disabled:opacity-25 transition-all"
              style={{
                background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                boxShadow: `0 6px 20px ${numData.color}55`,
                borderBottom: `3px solid ${numData.color}77`,
              }}
            >
              تحقق ✓
            </motion.button>
          </div>
        ) : (
          // 🖥️ Desktop Layout - الأصلي
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-4">
              <HeroNumberDisplay numData={numData} />
              <SoundButton onClick={() => speakNumber(numData.de)} color={numData.color} label="استمع للرقم" />
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${numData.color}aa` }}>
                  Zahl · {groupTitle}
                </div>
                <div className="text-2xl font-black text-white">اكتب الرقم</div>
                <div className="text-sm font-bold text-white/40 mt-1">بالأرقام (1, 2, 3...)</div>
              </div>
              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={String(numData.num)}
                color={numData.color}
                status={status}
                fontSize="4rem"
                maxLength={2}
                inputMode="numeric"
                numbersOnly
              />
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                    style={{
                      background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                      color: status === 'correct' ? '#22c55e' : '#ef4444',
                      border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
                    }}>
                    {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                  boxShadow: `0 8px 30px ${numData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  borderBottom: `4px solid ${numData.color}77`,
                }}
              >
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
// PHASE 2 — اكتب بالألمانية (Mobile + Desktop)
// ═══════════════════════════════════════
function WritePhase({ numData, groupTitle, onDone, onKarlReact, onCombo, isMobile }: {
  numData: NumberItem;
  groupTitle: string;
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
  const requiredChars = getRequiredSpecialChars(numData.de);

  useEffect(() => {
    setInput('');
    setStatus('idle');
  }, [numData.num]);

  const handleCheck = (e?: React.MouseEvent) => {
    if (input.trim().toLowerCase() === numData.de.toLowerCase()) {
      setStatus('correct');
      speakNumber(numData.de);
      playCoinSound();
      onCombo();
      onKarlReact('happy');
      if (e) setConfettiPos({ x: e.clientX, y: e.clientY });
      else if (inputRef.current) {
        const r = inputRef.current.getBoundingClientRect();
        setConfettiPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
      setConfettiTrigger(t => t + 1);
      setTimeout(onDone, 1000);
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
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={numData.gradient.concat(['#FFD700', '#FFFFFF'])} />
      <motion.div
        key={`write-${numData.num}`}
        initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl mx-auto"
      >
        {isMobile ? (
          // 📱 Mobile Layout
          <div className="flex flex-col items-center gap-3 px-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[2rem] blur-2xl" style={{
                background: `radial-gradient(circle, ${numData.color}66, transparent)`,
                transform: 'scale(1.2)',
              }} />
              <div className="relative rounded-[2rem] flex flex-col items-center justify-center gap-2 p-4"
                style={{
                  background: `linear-gradient(145deg, ${numData.gradient[0]}22, ${numData.gradient[1]}11)`,
                  border: `2px solid ${numData.color}55`,
                  boxShadow: `0 12px 30px ${numData.color}44`,
                  minWidth: 220,
                }}>
                <div className="text-center">
                  <span className="text-white/60 text-xs font-bold">عدد </span>
                  <span className="font-black text-xl tabular-nums" style={{ color: numData.color, textShadow: `0 0 15px ${numData.color}` }}>
                    {numData.num}
                  </span>
                  <span className="text-white font-bold text-sm mr-2">{numData.objAr}</span>
                </div>
                <EmojiCount emoji={numData.emoji} count={numData.num} color={numData.color} isMobile />
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 shadow-2xl tabular-nums"
                style={{
                  background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                }}
              >
                {numData.num}
              </motion.div>
            </motion.div>

            <SoundButton onClick={() => speakNumber(numData.de)} color={numData.color} label="استمع" />

            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: `${numData.color}aa` }}>
                Wort · بالألمانية
              </div>
              <div className="text-base font-black text-white mt-0.5">اكتب الكلمة</div>
              <div className="text-xs font-bold text-white/40">{numData.ar}</div>
            </div>

            <div className="w-full">
              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={numData.de}
                color={numData.color}
                status={status}
                fontSize="1.4rem"
              />
            </div>

            {requiredChars.length > 0 && (
              <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={numData.color} />
            )}

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 font-black text-xs py-2 px-4 rounded-xl"
                  style={{
                    background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                    color: status === 'correct' ? '#22c55e' : '#ef4444',
                    border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
                  }}>
                  {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={handleCheck} disabled={!input}
              className="w-full py-3 rounded-2xl font-black text-base text-white disabled:opacity-25 transition-all"
              style={{
                background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                boxShadow: `0 6px 20px ${numData.color}55`,
                borderBottom: `3px solid ${numData.color}77`,
              }}
            >
              تحقق ✓
            </motion.button>
          </div>
        ) : (
          // 🖥️ Desktop Layout - الأصلي
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 flex flex-col items-center gap-5">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-[3rem] blur-3xl" style={{
                  background: `radial-gradient(circle, ${numData.color}66, transparent)`,
                  transform: 'scale(1.3)',
                }} />
                <div className="relative rounded-[3rem] flex flex-col items-center justify-center gap-3 p-8"
                  style={{
                    background: `linear-gradient(145deg, ${numData.gradient[0]}22, ${numData.gradient[1]}11)`,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${numData.color}55`,
                    boxShadow: `0 20px 60px ${numData.color}44, inset 0 1px 0 ${numData.color}66`,
                    minWidth: 280,
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[3rem]" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15), transparent)',
                  }} />
                  <div className="text-center relative z-10">
                    <span className="text-white/60 text-sm font-bold">عدد </span>
                    <span className="font-black text-3xl tabular-nums" style={{ color: numData.color, textShadow: `0 0 20px ${numData.color}` }}>
                      {numData.num}
                    </span>
                    <span className="text-white font-bold text-lg mr-2">{numData.objAr}</span>
                  </div>
                  <div className="relative z-10">
                    <EmojiCount emoji={numData.emoji} count={numData.num} color={numData.color} />
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-2xl tabular-nums"
                  style={{
                    background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                    borderColor: 'rgba(255,255,255,0.4)',
                    color: 'white',
                    boxShadow: `0 8px 24px ${numData.color}88`,
                  }}
                >
                  {numData.num}
                </motion.div>
              </motion.div>
              <SoundButton onClick={() => speakNumber(numData.de)} color={numData.color} label="استمع للكلمة" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="text-center lg:text-right">
                <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: `${numData.color}aa` }}>
                  Wort · بالألمانية
                </div>
                <div className="text-2xl font-black text-white">اكتب الكلمة</div>
                <div className="text-sm font-bold text-white/40 mt-1">{numData.ar}</div>
              </div>
              <GhostInput
                ref={inputRef}
                value={input}
                onChange={v => { setInput(v); setStatus('idle'); }}
                onEnter={handleCheck}
                ghostText={numData.de}
                color={numData.color}
                status={status}
                fontSize="1.8rem"
              />
              {requiredChars.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-center text-[10px] font-black text-white/40 tracking-widest uppercase">
                    💡 الحروف الخاصة
                  </p>
                  <SpecialCharsKeyboard chars={requiredChars} onChar={handleSpecialChar} color={numData.color} />
                </div>
              )}
              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 font-black text-sm py-2.5 rounded-xl backdrop-blur-sm"
                    style={{
                      background: status === 'correct' ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                      color: status === 'correct' ? '#22c55e' : '#ef4444',
                      border: `1px solid ${status === 'correct' ? '#22c55e44' : '#ef444444'}`,
                    }}>
                    {status === 'correct' ? '✅ ممتاز!' : '❌ جرب تاني'}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                onClick={handleCheck} disabled={!input}
                className="w-full py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${numData.gradient[0]}, ${numData.gradient[1]})`,
                  boxShadow: `0 8px 30px ${numData.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  borderBottom: `4px solid ${numData.color}77`,
                }}
              >
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
// الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanNumberLesson() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const isKeyboardOpen = useKeyboardOpen();
  const [groupIdx, setGroupIdx] = useState(0);
  const [numIdx, setNumIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const LESSON_ID = 'cologne';

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
            setNumIdx(progress.current_letter);
          }
          if (progress.current_phase) {
            setPhase(progress.current_phase as Phase);
          }
        }
      }
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [completedNums, setCompletedNums] = useState<Set<number>>(new Set());
  const [testSuccess, setTestSuccess] = useState(false);
  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [combo, setCombo] = useState(0);

  const currentGroup = NUMBER_GROUPS[groupIdx];
  const currentNum = currentGroup?.numbers[numIdx];

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

  const calculateRating = (starsCount: number): number => {
    const totalPossibleStars = NUMBERS.length;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  const savePosition = (newGroup: number, newNum: number, newPhase: Phase) => {
    const rating = calculateRating(totalStars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup,
      current_letter: newNum,
      current_phase: newPhase,
    });
  };

  const spawnStar = useCallback((clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setFlyingStars(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => setFlyingStars(prev => prev.filter(s => s.id !== id)), 1200);
    setTotalStars(p => {
      const newCount = p + 1;
      const rating = calculateRating(newCount);
      saveLessonProgress(LESSON_ID, rating, false, {
        current_group: groupIdx,
        current_letter: numIdx,
        current_phase: phase,
      });
      return newCount;
    });
  }, [groupIdx, numIdx, phase]);

  const handleListenDone = () => {
    setPhase('write');
    savePosition(groupIdx, numIdx, 'write');
  };
  
  const handleWriteDone = () => {
    setCompletedNums(prev => new Set([...prev, currentNum.num]));
    if (numIdx < currentGroup.numbers.length - 1) {
      const newNumIdx = numIdx + 1;
      setNumIdx(newNumIdx);
      setPhase('listen');
      savePosition(groupIdx, newNumIdx, 'listen');
    } else {
      setPhase('test');
      savePosition(groupIdx, numIdx, 'test');
    }
  };
  
  const handleTestComplete = () => setTestSuccess(true);

  const nextGroup = async () => {
    if (groupIdx < NUMBER_GROUPS.length - 1) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx);
      setNumIdx(0);
      setPhase('listen');
      setTestSuccess(false);
      setCompletedNums(new Set());
      savePosition(newGroupIdx, 0, 'listen');
    } else {
      await saveLessonProgress(LESSON_ID, 3, true);
      router.push('/character-and-map?from=lesson');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⛪</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!currentGroup || !currentNum) return null;

  const progress = Math.round(
    ((groupIdx * 5 + (testSuccess ? currentGroup.numbers.length : numIdx)) / NUMBERS.length) * 100
  );

  const activeColor = currentNum?.color ?? '#A78BFA';
  const isTestPhase = phase === 'test';
  const isInputPhase = phase === 'listen' || phase === 'write';

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <PremiumCathedralBackground activeColor={activeColor} />
      
      {/* 🦅 كارل - يختفي في الموبايل لما الكيبورد يفتح */}
      {!(isMobile && isKeyboardOpen) && (
        <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#A78BFA" />
      )}
      
      <ComboDisplay combo={combo} />
      <FlyingStars stars={flyingStars} />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(5,3,16,0.95) 70%, transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md hover:bg-white/10`}
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="ارجع للخريطة">
              <ArrowLeft size={isMobile ? 16 : 20} />
            </button>
            <div className="flex-1">
              <div className={`flex justify-between ${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-1 text-white/40`}>
                <span className="flex items-center gap-1.5">
                  <span style={{ fontSize: isMobile ? 12 : 14 }}>⛪</span>
                  {currentGroup.title} — {phase === 'listen' ? 'استمع' : phase === 'write' ? 'اكتب' : 'اختبار'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className={`w-full ${isMobile ? 'h-1.5' : 'h-2.5'} bg-white/5 rounded-full overflow-hidden border border-white/5`}>
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #EC4899)`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)',
                  }} />
                </motion.div>
              </div>
            </div>
            <motion.div key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.35 }}
              className={`flex items-center gap-1 flex-shrink-0 ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-xl border border-yellow-400/30`}
              style={{ background: 'rgba(255,215,0,0.1)', backdropFilter: 'blur(10px)' }}>
              <svg width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} viewBox="0 0 40 40">
                <polygon points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5"
                  fill="#FFD700" stroke="#FFA500" strokeWidth="1" />
              </svg>
              <span className={`font-black ${isMobile ? 'text-xs' : 'text-sm'} text-yellow-400`}>{totalStars}</span>
            </motion.div>
          </div>

          {!isTestPhase && !testSuccess && (
            <div className="flex gap-1.5 justify-center">
              {currentGroup.numbers.map((n, i) => {
                const isDone = completedNums.has(n.num);
                const isCurrent = i === numIdx;
                return (
                  <motion.div key={n.num}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`${isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} rounded-xl flex items-center justify-center font-black border-2 transition-all backdrop-blur-md tabular-nums`}
                    style={{
                      background: isDone ? `linear-gradient(135deg, ${n.gradient[0]}55, ${n.gradient[1]}33)`
                        : isCurrent ? `linear-gradient(135deg, ${n.gradient[0]}33, ${n.gradient[1]}11)`
                        : 'rgba(255,255,255,0.03)',
                      borderColor: isDone ? n.color : isCurrent ? `${n.color}88` : 'rgba(255,255,255,0.08)',
                      color: isDone ? 'white' : isCurrent ? 'white' : 'rgba(255,255,255,0.2)',
                      boxShadow: isCurrent && !isDone ? `0 0 20px ${n.color}66, inset 0 1px 0 ${n.color}44` : 'none',
                    }}>
                    {isDone ? '✓' : n.num}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isMobile ? 'pt-28 pb-2 px-2' : 'pt-36 pb-32 px-6'} min-h-screen flex flex-col ${isMobile ? '' : 'justify-center'} relative`} style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {phase === 'listen' && (
            <ListenPhase
              key={`listen-${groupIdx}-${numIdx}`}
              numData={currentNum}
              groupTitle={currentGroup.title}
              onDone={handleListenDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              isMobile={isMobile}
            />
          )}
          {phase === 'write' && (
            <WritePhase
              key={`write-${groupIdx}-${numIdx}`}
              numData={currentNum}
              groupTitle={currentGroup.title}
              onDone={handleWriteDone}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
              isMobile={isMobile}
            />
          )}
          {phase === 'test' && !testSuccess && (
            <MatchGame
              key={`match-${groupIdx}`}
              group={currentGroup.numbers}
              groupTitle={currentGroup.title}
              onComplete={handleTestComplete}
              onStar={spawnStar}
              onKarlReact={handleKarlReact}
              onCombo={handleCombo}
            />
          )}
          {testSuccess && (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center px-6 max-w-md mx-auto"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0], y: [0, -10, 0] }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-9xl">🏆</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">أحسنت! 🎉</h2>
                <p className="text-white/50 text-lg">أنهيت {currentGroup.title} بنجاح</p>
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 400 }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="#FFD700"
                      style={{ filter: 'drop-shadow(0 0 12px #FFD700)' }}>
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-md border border-yellow-400/30"
                style={{ background: 'rgba(255,215,0,0.1)' }}>
                <Star size={28} fill="#FFD700" color="#FFD700" />
                <span className="font-black text-3xl text-yellow-400">{totalStars}</span>
                <span className="font-bold text-white/40 text-base">نجمة!</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={nextGroup}
                className="font-black px-12 py-5 rounded-2xl text-lg text-white shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  boxShadow: '0 10px 40px rgba(124,58,237,0.5)',
                }}>
                {groupIdx < NUMBER_GROUPS.length - 1 ? 'المجموعة التالية ←' : '🗺️ رجوع للخريطة'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🆕 بطاقات الأرقام المتعلمة - للموبايل بس + بس في مرحلة input + لما الكيبورد مقفول */}
        {isMobile && isInputPhase && !isKeyboardOpen && (
          <AnimatePresence>
            <LearnedNumbersCards
              completedNums={completedNums}
              allNumbers={NUMBERS}
              activeColor={activeColor}
            />
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
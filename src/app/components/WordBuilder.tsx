'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';

// 🔊 صوت click خفيف
function playClickSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

// 🔀 خلط الكلمات بشكل عشوائي
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface WordBuilderProps {
  /** الجملة المستهدفة الكاملة */
  targetSentence: string;
  /** اللون الأساسي */
  color: string;
  /** الـ gradient */
  gradient: string[];
  /** يحصل لما الطفل يخلص الجملة صح */
  onCorrect: () => void;
  /** يحصل لما الطفل يحاول والإجابة غلط */
  onWrong?: () => void;
  /** placeholder للبوكس لما يكون فاضي */
  placeholder?: string;
}

export default function WordBuilder({
  targetSentence,
  color,
  gradient,
  onCorrect,
  onWrong,
  placeholder = 'اضغط على الكلمات بالترتيب 👇',
}: WordBuilderProps) {
  // 🎯 الكلمات الصحيحة بترتيبها الأصلي
  const targetWords = useMemo(
    () => targetSentence.trim().split(/\s+/),
    [targetSentence]
  );

  // 🔀 الكلمات المبعثرة (مع IDs فريدة عشان لو فيه تكرار)
  const [availableWords, setAvailableWords] = useState<Array<{ id: number; word: string }>>([]);

  // ✅ الكلمات اللي اختارها الطفل
  const [selectedWords, setSelectedWords] = useState<Array<{ id: number; word: string }>>([]);

  // 🎨 حالة التحقق
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // 🔄 تهيئة الكلمات لما الجملة تتغير
  useEffect(() => {
    const wordsWithIds = targetWords.map((word, i) => ({ id: i, word }));
    setAvailableWords(shuffleArray(wordsWithIds));
    setSelectedWords([]);
    setStatus('idle');
  }, [targetSentence]);

  // 🎯 اختيار كلمة من الأسفل
  const handleSelectWord = (item: { id: number; word: string }) => {
    if (status !== 'idle') return;
    playClickSound();
    setSelectedWords(prev => [...prev, item]);
    setAvailableWords(prev => prev.filter(w => w.id !== item.id));
  };

  // ❌ إلغاء كلمة من الأعلى (ترجع تحت)
  const handleRemoveWord = (item: { id: number; word: string }) => {
    if (status !== 'idle') return;
    playClickSound();
    setSelectedWords(prev => prev.filter(w => w.id !== item.id));
    setAvailableWords(prev => [...prev, item]);
  };

  // 🔄 مسح الكل
  const handleClearAll = () => {
    if (status !== 'idle') return;
    playClickSound();
    const allWords = [...selectedWords, ...availableWords];
    const wordsWithIds = targetWords.map((word, i) => {
      const found = allWords.find(w => w.id === i);
      return found ?? { id: i, word };
    });
    setAvailableWords(shuffleArray(wordsWithIds));
    setSelectedWords([]);
  };

  // ✅ التحقق من الإجابة
  const handleCheck = () => {
    const userSentence = selectedWords.map(w => w.word).join(' ');
    const isCorrect = userSentence.trim().toLowerCase() === targetSentence.trim().toLowerCase();

    if (isCorrect) {
      setStatus('correct');
      setTimeout(() => {
        onCorrect();
      }, 800);
    } else {
      setStatus('wrong');
      onWrong?.();
      setTimeout(() => {
        setStatus('idle');
      }, 1200);
    }
  };

  const isComplete = availableWords.length === 0 && selectedWords.length > 0;
  const isEmpty = selectedWords.length === 0;

  return (
    <div className="w-full space-y-4">
      {/* 📦 البوكس - الكلمات المختارة */}
      <motion.div
        animate={status === 'wrong' ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full min-h-[100px] rounded-2xl border-2 p-4 transition-all"
        style={{
          background: status === 'correct'
            ? 'rgba(34,197,94,0.15)'
            : status === 'wrong'
            ? 'rgba(239,68,68,0.15)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(10px)',
          borderColor: status === 'correct'
            ? '#22c55e'
            : status === 'wrong'
            ? '#ef4444'
            : `${color}55`,
          boxShadow: status === 'correct'
            ? '0 0 30px #22c55e66'
            : status === 'wrong'
            ? '0 0 30px #ef444466'
            : `inset 0 1px 0 ${color}33, 0 8px 30px ${color}22`,
        }}
      >
        {/* Placeholder لو فاضي */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/30 text-sm font-bold text-center px-4">
              {placeholder}
            </p>
          </div>
        )}

        {/* الكلمات المختارة */}
        <div className="flex flex-wrap gap-2 items-center justify-center min-h-[60px]" style={{ direction: 'ltr' }}>
          <AnimatePresence mode="popLayout">
            {selectedWords.map((item) => (
              <motion.button
                key={`selected-${item.id}`}
                layout
                initial={{ scale: 0, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0, y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                whileHover={status === 'idle' ? { scale: 1.05, y: -2 } : {}}
                whileTap={status === 'idle' ? { scale: 0.95 } : {}}
                onClick={() => handleRemoveWord(item)}
                disabled={status !== 'idle'}
                className="px-4 py-2.5 rounded-xl font-black text-lg border-2 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  boxShadow: `0 4px 16px ${color}66`,
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  cursor: status === 'idle' ? 'pointer' : 'default',
                }}
              >
                {item.word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Icon التحقق */}
        <AnimatePresence>
          {status === 'correct' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-2 right-2"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={20} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>
          )}
          {status === 'wrong' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-2 right-2"
            >
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <X size={20} className="text-white" strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🔵 الكلمات المبعثرة تحت البوكس */}
      <div className="min-h-[80px]">
        <p className="text-center text-[11px] font-black text-white/40 tracking-widest uppercase mb-3">
          👇 اضغط على الكلمات
        </p>

        <div className="flex flex-wrap gap-2 items-center justify-center" style={{ direction: 'ltr' }}>
          <AnimatePresence mode="popLayout">
            {availableWords.map((item) => (
              <motion.button
                key={`available-${item.id}`}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                whileHover={status === 'idle' ? { scale: 1.08, y: -3 } : {}}
                whileTap={status === 'idle' ? { scale: 0.92 } : {}}
                onClick={() => handleSelectWord(item)}
                disabled={status !== 'idle'}
                className="px-4 py-2.5 rounded-xl font-black text-lg border-2 transition-all backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                  borderColor: `${color}66`,
                  color: 'white',
                  boxShadow: `0 4px 12px ${color}33, inset 0 1px 0 ${color}44`,
                  textShadow: `0 0 10px ${color}88`,
                  cursor: status === 'idle' ? 'pointer' : 'default',
                }}
              >
                {item.word}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* لو خلص كل الكلمات */}
          {availableWords.length === 0 && status === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/40 text-sm font-bold"
            >
              ✨ كل الكلمات اتختارت! اضغط تحقق
            </motion.p>
          )}
        </div>
      </div>

      {/* 🎮 الأزرار */}
      <div className="flex gap-3">
        {/* زرار مسح */}
        <motion.button
          whileHover={selectedWords.length > 0 && status === 'idle' ? { scale: 1.03 } : {}}
          whileTap={selectedWords.length > 0 && status === 'idle' ? { scale: 0.96 } : {}}
          onClick={handleClearAll}
          disabled={selectedWords.length === 0 || status !== 'idle'}
          className="px-5 py-4 rounded-2xl font-black text-base text-white border-2 disabled:opacity-25 transition-all flex items-center gap-2"
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.15)',
          }}
        >
          <RotateCcw size={18} />
          مسح
        </motion.button>

        {/* زرار تحقق */}
        <motion.button
          whileHover={isComplete && status === 'idle' ? { scale: 1.03 } : {}}
          whileTap={isComplete && status === 'idle' ? { scale: 0.96 } : {}}
          onClick={handleCheck}
          disabled={!isComplete || status !== 'idle'}
          className="flex-1 py-4 rounded-2xl font-black text-lg text-white disabled:opacity-25 transition-all"
          style={{
            background: isComplete
              ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
              : 'rgba(255,255,255,0.05)',
            boxShadow: isComplete ? `0 8px 30px ${color}55` : 'none',
            borderBottom: isComplete ? `4px solid ${color}77` : '4px solid rgba(255,255,255,0.1)',
          }}
        >
          تحقق ✓
        </motion.button>
      </div>
    </div>
  );
}
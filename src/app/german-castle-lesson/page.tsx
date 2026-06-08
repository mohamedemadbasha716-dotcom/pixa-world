'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Check, Trophy, Mic, SkipForward, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveLessonProgress, getLessonProgress } from '@/lib/playerData';
import WordBuilder from '../components/WordBuilder';

// 🎯 المكونات المشتركة
import KarlEagle from '@/app/components/lesson/KarlEagle';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';

// 🎯 الأنواع والرسائل المشتركة
import type { KarlMood } from '@/lib/types/lesson';
import { ENCOURAGEMENTS, SAD_MESSAGES } from '@/lib/types/lesson';

// 🎯 الأصوات والنطق المشتركة
import { playCoinSound, playBuzzSound, playRoyalSound } from '@/lib/audio/sounds';
import { speakSentence } from '@/lib/audio/speech';

// 📦 البيانات من الملفات المنفصلة
import { CASTLE_GROUPS, type Sentence } from '@/data/german/castle';

// ═══════════════════════════════════════
// 🎤 Speech Recognition Types
// ═══════════════════════════════════════
interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: { transcript: string; confidence: number };
      isFinal: boolean;
    };
    length: number;
  };
}

type Phase = 'learn' | 'speak' | 'group-success' | 'all-done';

// ═══════════════════════════════════════
// 🏰 خلفية القلعة الملكية
// ═══════════════════════════════════════
function RoyalCastleBackground({ activeColor }: { activeColor: string }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number; duration: number; xOffset: number }>>([]);
  const [stars, setStars] = useState<Array<{ left: number; top: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      size: 8 + Math.random() * 16,
      duration: 15 + Math.random() * 10,
      xOffset: Math.random() * 60 - 30,
    }));
    setParticles(p);

    const s = Array.from({ length: 40 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 70,
      size: 1.5 + Math.random() * 2,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
    setStars(s);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a0a3e 0%, #0d0820 50%, #050210 100%)',
      }} />

      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse 90% 60% at 50% 0%, ${activeColor}33, transparent 70%)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: -30,
            fontSize: p.size,
            filter: `drop-shadow(0 0 8px ${activeColor}66)`,
          }}
          animate={{
            y: [(typeof window !== 'undefined' ? window.innerHeight : 800) + 50],
            x: [0, p.xOffset, -p.xOffset, 0],
            rotate: [0, 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.id % 3 === 0 ? '👑' : p.id % 3 === 1 ? '❄️' : '✨'}
        </motion.div>
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
            boxShadow: '0 0 4px white',
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}

      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '30%', opacity: 0.3 }}>
        <path d="M0,150 L200,50 L400,120 L600,30 L800,100 L1000,40 L1200,130 L1200,200 L0,200 Z" fill="#1a0a3e" />
        <path d="M0,180 L150,100 L350,150 L550,80 L750,140 L950,70 L1200,160 L1200,200 L0,200 Z" fill="#0d0820" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════
// 🎤 مكون النطق بالصوت
// ═══════════════════════════════════════
function SpeakingPractice({ targetSentence, color, gradient, onSuccess, onSkip }: {
  targetSentence: string;
  color: string;
  gradient: string[];
  onSuccess: () => void;
  onSkip: () => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'success' | 'try-again' | 'error'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results[0];
      let bestMatch = '';
      let bestScore = 0;

      for (let i = 0; i < (results as any).length; i++) {
        const text = (results as any)[i].transcript.toLowerCase().trim();
        const score = similarityScore(text, targetSentence.toLowerCase());
        if (score > bestScore) {
          bestScore = score;
          bestMatch = text;
        }
      }

      setTranscript(bestMatch);
      setIsListening(false);

      if (bestScore >= 0.6) {
        setStatus('success');
        playCoinSound();
        setTimeout(onSuccess, 1500);
      } else {
        setStatus('try-again');
        playBuzzSound();
        setAttempts(a => a + 1);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setStatus('error');
      } else if (event.error !== 'no-speech') {
        setStatus('try-again');
        setAttempts(a => a + 1);
      } else {
        setStatus('idle');
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [targetSentence, onSuccess]);

  function similarityScore(a: string, b: string): number {
    const normalize = (s: string) => s
      .toLowerCase()
      .replace(/[.,!?;:'"]/g, '')
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .trim();

    const wordsA = normalize(a).split(/\s+/);
    const wordsB = normalize(b).split(/\s+/);
    const setB = new Set(wordsB);

    let matches = 0;
    for (const word of wordsA) {
      if (setB.has(word)) matches++;
    }

    return matches / Math.max(wordsA.length, wordsB.length);
  }

  const handleStart = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    setStatus('listening');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      setIsListening(false);
      setStatus('error');
    }
  };

  if (!supported) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto p-6 rounded-3xl border-2 text-center"
        style={{ background: 'rgba(255,107,107,0.1)', borderColor: 'rgba(255,107,107,0.3)' }}>
        <div className="text-5xl mb-3">😅</div>
        <h3 className="text-xl font-black text-white mb-2">المتصفح بتاعك مش بيدعم النطق</h3>
        <p className="text-white/60 text-sm mb-4">جرب تستخدم Chrome أو Edge</p>
        <button onClick={onSkip}
          className="px-8 py-3 rounded-2xl font-black text-white"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
          تخطي ⏭️
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto">

      <div className="text-center mb-6">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-3">
          🎤
        </motion.div>
        <h3 className="text-2xl font-black text-white mb-2">
          كرر الجملة بصوتك
        </h3>
        <p className="text-white/60 text-sm font-bold">
          اضغط على المايك واتكلم بوضوح
        </p>
      </div>

      <div className="mb-6 p-5 rounded-2xl border-2 text-center backdrop-blur-md"
        style={{
          background: `linear-gradient(135deg, ${color}22, ${color}08)`,
          borderColor: `${color}55`,
        }}>
        <p className="text-3xl font-black text-white mb-2" style={{ textShadow: `0 0 20px ${color}88`, direction: 'ltr' }}>
          {targetSentence}
        </p>
        <button onClick={() => speakSentence(targetSentence)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white/70 hover:bg-white/10 transition-all text-sm font-bold">
          <Volume2 size={14} /> اسمع النطق الصح
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <motion.button
          whileHover={!isListening ? { scale: 1.05 } : {}}
          whileTap={!isListening ? { scale: 0.95 } : {}}
          onClick={handleStart}
          disabled={isListening || status === 'success'}
          className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all"
          style={{
            background: status === 'success'
              ? 'linear-gradient(135deg, #58CC02, #096A02)'
              : isListening
              ? 'linear-gradient(135deg, #FF4444, #C70039)'
              : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            boxShadow: isListening
              ? '0 0 60px rgba(255,68,68,0.6)'
              : `0 10px 40px ${color}66`,
          }}
        >
          {isListening && (
            <>
              {[0, 0.3, 0.6].map((delay, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-4"
                  style={{ borderColor: '#FF4444' }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, delay, repeat: Infinity, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          {status === 'success' ? (
            <Check size={56} className="text-white" strokeWidth={3} />
          ) : (
            <Mic size={56} className="text-white" />
          )}
        </motion.button>

        <AnimatePresence>
          {transcript && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center">
              <p className="text-xs text-white/40 font-bold mb-1">سمعتك بتقول:</p>
              <p className="text-lg font-black text-white" style={{ direction: 'ltr' }}>
                "{transcript}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {status === 'listening' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-base font-black text-red-400">
              🎙️ بسمعك دلوقتي...
            </motion.p>
          )}
          {status === 'success' && (
            <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-xl font-black text-green-400">
              ✅ نطق ممتاز! 🌟
            </motion.p>
          )}
          {status === 'try-again' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-base font-black text-yellow-400">
              😊 قريب! حاول تاني بصوت أوضح
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-base font-black text-red-400">
              ❌ لازم تسمح للموقع باستخدام المايك
            </motion.p>
          )}
          {status === 'idle' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm font-bold text-white/40">
              اضغط على المايك وابدأ تتكلم
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {(attempts >= 2 || status === 'error') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <button onClick={onSkip}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white/70 hover:text-white border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all">
            <SkipForward size={16} /> تخطي وكمل
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 📝 مرحلة التعلم
// ═══════════════════════════════════════
function LearnSentencePhase({ sentence, heroName, onWriteDone }: {
  sentence: Sentence;
  heroName: string;
  onWriteDone: () => void;
}) {
  const targetDe = sentence.de(heroName);
  const targetAr = sentence.ar(heroName);

  useEffect(() => {
    const t = setTimeout(() => speakSentence(targetDe), 500);
    return () => clearTimeout(t);
  }, [targetDe]);

  const handleCorrect = () => {
    speakSentence(targetDe);
    playCoinSound();
    onWriteDone();
  };

  const handleWrong = () => {
    playBuzzSound();
  };

  return (
    <motion.div
      key={`learn-${targetDe}`}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block text-7xl mb-4"
          style={{ filter: `drop-shadow(0 8px 20px ${sentence.color}aa)` }}
        >
          {sentence.emoji}
        </motion.div>

        <div className="text-4xl font-black text-white mb-3" style={{
          textShadow: `0 0 30px ${sentence.color}aa, 0 2px 10px rgba(0,0,0,0.5)`,
          direction: 'ltr',
        }}>
          {targetDe}
        </div>

        <div className="text-xl font-bold mb-4" style={{ color: sentence.color }}>
          {targetAr}
        </div>

        <button onClick={() => speakSentence(targetDe)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all text-sm font-black"
          style={{
            color: 'white',
            borderColor: sentence.color,
            background: `linear-gradient(135deg, ${sentence.color}33, ${sentence.color}11)`,
            boxShadow: `0 4px 20px ${sentence.color}44`,
          }}>
          <Volume2 size={18} /> استمع للجملة
        </button>
      </div>

      <p className="text-center font-bold text-white/40 text-xs tracking-widest uppercase mb-4">
        🎯 رتّب الكلمات لتكوّن الجملة
      </p>

      <WordBuilder
        targetSentence={targetDe}
        color={sentence.color}
        gradient={sentence.gradient}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
        placeholder="اضغط على الكلمات بالترتيب الصحيح 👇"
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════
export default function GermanCastleLessonPage() {
  const router = useRouter();
  const [heroName, setHeroName] = useState('Held');
  const [groupIdx, setGroupIdx] = useState(0);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('learn');
  const [totalStars, setTotalStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const LESSON_ID = 'neuschwanstein';

  // إجمالي الجمل (نحسبه عشان calculateRating)
  const totalSentencesAll = CASTLE_GROUPS.reduce((a, g) => a + g.sentences.length, 0);

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
            setSentenceIdx(progress.current_letter);
          }
          if (progress.current_phase) {
            setPhase(progress.current_phase as Phase);
          }
          console.log(`📍 الرجوع لمكانك: مجموعة ${progress.current_group}, جملة ${progress.current_letter}, مرحلة ${progress.current_phase}`);
        }
        
        console.log('✅ تم تحميل التقدم:', progress);
      }
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('heroName');
    if (savedName) setHeroName(savedName);
  }, []);

  const [karlMood, setKarlMood] = useState<KarlMood>('idle');
  const [karlMessage, setKarlMessage] = useState<{ de: string; ar: string } | null>(null);
  const [confettiTrigger] = useState(0);
  const [confettiPos] = useState({ x: 0, y: 0 });

  const group = CASTLE_GROUPS[groupIdx];
  const sentence = group?.sentences[sentenceIdx];

  const totalSentences = totalSentencesAll;
  const learnedSentences = CASTLE_GROUPS.slice(0, groupIdx).reduce((a, g) => a + g.sentences.length, 0) + sentenceIdx;

  const handleKarlReact = (mood: KarlMood) => {
    setKarlMood(mood);
    if (mood === 'happy' || mood === 'celebrate') {
      setKarlMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    } else if (mood === 'sad') {
      setKarlMessage(SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)]);
    }
    setTimeout(() => { setKarlMood('idle'); setKarlMessage(null); }, 2500);
  };

  // 🎯 حساب التقييم من 3
  const calculateRating = (starsCount: number): number => {
    // كل جملة فيها نجمتين كحد أقصى (writing + speaking)
    const totalPossibleStars = totalSentencesAll * 2;
    const progressRatio = starsCount / totalPossibleStars;
    if (progressRatio >= 0.67) return 3;
    if (progressRatio >= 0.34) return 2;
    return 1;
  };

  // 💾 حفظ المكان الحالي
  const savePosition = (newGroup: number, newSentence: number, newPhase: Phase, starsToSave?: number) => {
    const stars = starsToSave !== undefined ? starsToSave : totalStars;
    const rating = calculateRating(stars);
    saveLessonProgress(LESSON_ID, rating, false, {
      current_group: newGroup,
      current_letter: newSentence,
      current_phase: newPhase,
    }).then(() => {
      console.log(`📍 تم حفظ المكان: G${newGroup} S${newSentence} ${newPhase} | نجوم: ${stars} → تقييم: ${rating}/3`);
    });
  };

  const handleWriteDone = () => {
    handleKarlReact('happy');
    const newStars = totalStars + 1;
    setTotalStars(newStars);
    setPhase('speak');
    savePosition(groupIdx, sentenceIdx, 'speak', newStars);
  };

  const handleSpeakDone = (gainedStar: boolean) => {
    let newStars = totalStars;
    if (gainedStar) {
      newStars = totalStars + 1;
      setTotalStars(newStars);
      handleKarlReact('celebrate');
    }

    setTimeout(() => {
      const nextIdx = sentenceIdx + 1;
      if (nextIdx < group.sentences.length) {
        setSentenceIdx(nextIdx);
        setPhase('learn');
        savePosition(groupIdx, nextIdx, 'learn', newStars);
      } else {
        setPhase('group-success');
        savePosition(groupIdx, sentenceIdx, 'group-success', newStars);
      }
    }, gainedStar ? 1000 : 300);
  };

  const handleGroupNext = () => {
    if (groupIdx + 1 < CASTLE_GROUPS.length) {
      const newGroupIdx = groupIdx + 1;
      setGroupIdx(newGroupIdx);
      setSentenceIdx(0);
      setPhase('learn');
      savePosition(newGroupIdx, 0, 'learn');
    } else {
      playRoyalSound();
      setPhase('all-done');
    }
  };

  // 🆕 شاشة تحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050210]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏰</div>
          <p className="text-white font-bold">جاري تحميل تقدمك...</p>
        </div>
      </div>
    );
  }

  if (!group || !sentence) return null;

  const activeColor = sentence?.color ?? group?.accentColor ?? '#FFD700';
  const phaseLabel: Record<Phase, string> = {
    'learn': 'تعلم', 'speak': '🎤 نطق', 'group-success': '🎉', 'all-done': '👑',
  };

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <RoyalCastleBackground activeColor={activeColor} />
      <KarlEagle mood={karlMood} message={karlMessage} idleGlowColor="#FFD700" />
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} colors={['#FFD700', '#FF6B6B', '#9D4EDD', '#FFFFFF']} />

      <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(5,2,16,0.97) 80%, transparent)' }}>
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/character-and-map?from=lesson')}
              className="p-2.5 rounded-xl border border-white/10 text-white flex-shrink-0 transition-all backdrop-blur-md hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="ارجع للخريطة (تقدمك محفوظ)">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
                <span className="flex items-center gap-1.5">
                  <Crown size={14} className="text-yellow-400" />
                  {group.title} — {phaseLabel[phase]}
                </span>
                <span>{Math.min(learnedSentences + 1, totalSentences)} / {totalSentences}</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(to right, ${activeColor}, #FFD700)`, boxShadow: `0 0 15px ${activeColor}66` }}
                  animate={{ width: `${(learnedSentences / totalSentences) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}>
                </motion.div>
              </div>
            </div>

            <motion.div key={totalStars} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl border border-yellow-400/30"
              style={{ background: 'rgba(255,215,0,0.1)', backdropFilter: 'blur(10px)' }}>
              <Star size={16} fill="#FFD700" color="#FFD700" />
              <span className="font-black text-sm text-yellow-400">{totalStars}</span>
            </motion.div>
          </div>

          <div className="flex gap-1.5 justify-center">
            {CASTLE_GROUPS.map((g, i) => {
              const done = i < groupIdx || (i === groupIdx && phase === 'all-done');
              const current = i === groupIdx;
              return (
                <motion.div key={g.title}
                  className="flex-1 h-10 rounded-xl flex items-center justify-center text-base font-black border-2 backdrop-blur-md"
                  style={{
                    background: done ? `linear-gradient(135deg, ${g.accentColor}33, ${g.accentColor}11)`
                      : current ? `linear-gradient(135deg, ${g.accentColor}18, ${g.accentColor}08)`
                      : 'rgba(255,255,255,0.03)',
                    borderColor: done ? g.accentColor : current ? `${g.accentColor}77` : 'rgba(255,255,255,0.08)',
                    color: done || current ? 'white' : 'rgba(255,255,255,0.2)',
                    boxShadow: current && !done ? `0 0 20px ${g.accentColor}55` : 'none',
                  }}>
                  {done ? '✓' : g.icon}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-36 pb-32 px-6 min-h-screen flex flex-col justify-center relative" style={{ zIndex: 10 }}>
        <AnimatePresence mode="wait">

          {phase === 'learn' && (
            <LearnSentencePhase
              key={`learn-${groupIdx}-${sentenceIdx}`}
              sentence={sentence}
              heroName={heroName}
              onWriteDone={handleWriteDone}
            />
          )}

          {phase === 'speak' && (
            <SpeakingPractice
              key={`speak-${groupIdx}-${sentenceIdx}`}
              targetSentence={sentence.de(heroName)}
              color={sentence.color}
              gradient={sentence.gradient}
              onSuccess={() => handleSpeakDone(true)}
              onSkip={() => handleSpeakDone(false)}
            />
          )}

          {phase === 'group-success' && (
            <motion.div key="group-success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
              <motion.div animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.3, 1] }} transition={{ duration: 1 }} className="text-9xl">{group.icon}</motion.div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">برافو {heroName}! 🎉</h2>
                <p className="font-bold text-lg" style={{ color: group.accentColor }}>أنهيت {group.title}</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                  <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + s * 0.15, type: 'spring' }}>
                    <Star size={48} fill="#FFD700" color="#FFD700" />
                  </motion.div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGroupNext}
                className="px-12 py-5 rounded-2xl font-black text-xl text-white"
                style={{
                  background: `linear-gradient(135deg, ${group.accentColor}, #FFD700)`,
                  boxShadow: `0 10px 40px ${group.accentColor}55`,
                }}>
                {groupIdx + 1 < CASTLE_GROUPS.length ? 'المجموعة التالية 🚀' : 'شوف شهادتك 👑'}
              </motion.button>
            </motion.div>
          )}

          {phase === 'all-done' && (
            <motion.div key="all-done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 text-center max-w-xl mx-auto">

              <motion.div
                animate={{ rotate: [0, 360], y: [0, -10, 0] }}
                transition={{ rotate: { duration: 2, ease: 'easeInOut' }, y: { duration: 1.5, repeat: Infinity } }}
                className="text-9xl"
                style={{ filter: 'drop-shadow(0 0 30px #FFD700)' }}
              >
                👑
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full p-8 rounded-3xl border-4 backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(157,78,221,0.15))',
                  borderColor: '#FFD700',
                  boxShadow: '0 0 60px rgba(255,215,0,0.3), inset 0 0 30px rgba(255,215,0,0.1)',
                }}
              >
                <div className="text-xs font-black text-yellow-400 tracking-[0.3em] mb-3">📜 شهادة تخرج</div>
                <div className="text-sm font-bold text-white/60 mb-2">تشهد منصة بيكسا وورلد</div>
                <div className="text-base font-bold text-white/80 mb-4">أن البطل / البطلة</div>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl font-black mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ⭐ {heroName} ⭐
                </motion.div>

                <div className="text-sm font-bold text-white/80 mb-2">قد أتم بنجاح دروس اللغة الألمانية</div>
                <div className="text-2xl mb-3">🇩🇪</div>

                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl mx-auto inline-flex"
                  style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
                  <Star size={20} fill="#FFD700" color="#FFD700" />
                  <span className="font-black text-2xl text-yellow-400">{totalStars}</span>
                  <span className="font-bold text-white/60 text-sm">نجمة!</span>
                </div>
              </motion.div>

              <h2 className="text-3xl font-black text-white">
                🏰 {heroName} ist jetzt ein deutscher König! 👑
              </h2>
              <p className="font-bold text-lg text-[#FFD700]">
                {heroName} بقى ملك ألماني!
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  // 🏆 الدرس مكتمل = 3 نجوم كاملة + completed
                  await saveLessonProgress(LESSON_ID, 3, true);
                  router.push('/character-and-map?from=lesson');
                }}
                className="flex items-center gap-2 px-12 py-5 rounded-2xl font-black text-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  boxShadow: '0 10px 40px rgba(255,215,0,0.5)',
                }}>
                <Trophy size={24} /> العودة للخريطة
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
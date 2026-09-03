'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Volume2, Trophy, Home, Flame, Gem, Mic, SkipForward, Sparkles, User, X
} from 'lucide-react';

import { 
  SPANISH_BODY, 
  SPANISH_BODY_GROUPS, 
  generateSpanishBodyChoices,
  generateArticleChoices,
  generateSentenceWordPool,
  checkSentenceOrder,
  compareSpanishWords,
  type SpanishBodyPart
} from '@/data/spanish-2/body';

import { speakSpanishWord, speakSpanishSentence } from '@/lib/audio/spanishSpeech';
import { playCoinSound, playBuzzSound } from '@/lib/audio/sounds';
import { getSpanishLessonProgress, saveSpanishLessonProgress } from '@/lib/spanishPlayerData';

import ToroBull from '@/app/components/lesson/ToroBull';
import ConfettiBurst from '@/app/components/lesson/ConfettiBurst';
import GhostInput from '@/app/components/lesson/GhostInput';

import type { ToroMood, ToroMessage } from '@/lib/types/spanish-lesson';
import { SPANISH_ENCOURAGEMENTS, SPANISH_SAD_MESSAGES } from '@/lib/types/spanish-lesson';

const LESSON_ID = 'es-segovia-body';

// 🎯 7 مراحل لكل كلمة
type Phase = 
  | 'listen-word'       // 1. اسمع الكلمة واختار
  | 'write-word'        // 2. اكتب الكلمة
  | 'speak-word'        // 3. انطق الكلمة
  | 'listen-article'    // 4. اسمع Este/Esta واختار
  | 'write-article'     // 5. اكتب Este/Esta
  | 'build-sentence'    // 6. كوّن الجملة
  | 'speak-sentence'    // 7. انطق الجملة
  | 'group-success' 
  | 'all-done';

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

// ═══════════════════════════════════════
// 💎 Word Card - كارت الكلمة (الجزء من الجسم)
// ═══════════════════════════════════════
function WordCard({ part, size = 280 }: { part: SpanishBodyPart; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, minHeight: size * 1.2 }}
    >
      <div 
        className="absolute inset-0 blur-3xl opacity-60 rounded-full" 
        style={{ background: `radial-gradient(circle, ${part.color}aa, transparent 70%)` }} 
      />
      
      <div 
        className="relative w-full rounded-[2rem] overflow-hidden border-4 flex flex-col items-center"
        style={{
          background: `linear-gradient(180deg, ${part.gradient[0]}44, ${part.gradient[1]}77, #1a0a2e)`,
          borderColor: part.color,
          boxShadow: `0 20px 60px ${part.color}66, inset 0 2px 0 rgba(255,255,255,0.3)`,
        }}
      >
        <div className="absolute top-2 right-2 text-2xl opacity-20 select-none pointer-events-none">🏰</div>
        
        {/* Header */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <div 
            className="px-5 py-1.5 rounded-2xl border-2 font-black text-white text-sm flex items-center gap-1.5"
            style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderColor: '#FFF',
              boxShadow: '0 4px 12px rgba(255,165,0,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            <User size={12} className="text-amber-800" /> أجزاء الجسم
          </div>
        </div>

        {/* الإيموجي الكبير */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pt-20 pb-2">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ 
              fontSize: size * 0.45,
              filter: `drop-shadow(0 10px 25px ${part.color}cc)`,
              lineHeight: 1,
            }}
          >
            {part.emoji}
          </motion.div>
        </div>

        {/* الكلمة */}
        <div className="px-3 pb-3 flex flex-col items-center gap-1.5 z-10">
          <div 
            className="px-4 py-1.5 rounded-xl border-2 font-black text-white text-base md:text-lg max-w-full text-center"
            style={{
              background: `linear-gradient(135deg, ${part.gradient[0]}, ${part.gradient[1]})`,
              borderColor: 'rgba(255,255,255,0.5)',
              boxShadow: `0 4px 15px ${part.color}88`,
              direction: 'ltr',
            }}
          >
            {part.word}
          </div>
          <div className="text-sm font-bold text-white/90">{part.wordAr}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🎓 Article Card - كارت أداة الإشارة (Este/Esta)
// ═══════════════════════════════════════
function ArticleCard({ 
  part, 
  size = 280,
}: { 
  part: SpanishBodyPart;
  size?: number;
}) {
  const articleColor = part.gender === 'M' ? '#3B82F6' : '#EC4899';
  const articleGradient: [string, string] = part.gender === 'M' 
    ? ['#60A5FA', '#1E40AF'] 
    : ['#F472B6', '#BE185D'];
  
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, minHeight: size * 1.2 }}
    >
      <div 
        className="absolute inset-0 blur-3xl opacity-60 rounded-full" 
        style={{ background: `radial-gradient(circle, ${articleColor}aa, transparent 70%)` }} 
      />
      
      <div 
        className="relative w-full rounded-[2rem] overflow-hidden border-4 flex flex-col items-center"
        style={{
          background: `linear-gradient(180deg, ${articleGradient[0]}44, ${articleGradient[1]}77, #1a0a2e)`,
          borderColor: articleColor,
          boxShadow: `0 20px 60px ${articleColor}66, inset 0 2px 0 rgba(255,255,255,0.3)`,
        }}
      >
        <div className="absolute top-2 right-2 text-2xl opacity-20 select-none pointer-events-none">📚</div>
        
        {/* Header */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <div 
            className="px-5 py-1.5 rounded-2xl border-2 font-black text-white text-sm flex items-center gap-1.5"
            style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderColor: '#FFF',
              boxShadow: '0 4px 12px rgba(255,165,0,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            ✨ أداة الإشارة
          </div>
          
          <div 
            className="px-3 py-0.5 rounded-full border-2 font-bold text-white text-[10px] backdrop-blur-md"
            style={{ 
              background: `${articleColor}cc`,
              borderColor: 'rgba(255,255,255,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            {part.gender === 'M' ? '♂ مذكر' : '♀ مؤنث'}
          </div>
        </div>

        {/* الأيقونة + الإيموجي الصغير */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pt-24 pb-2 gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ 
              fontSize: size * 0.35,
              filter: `drop-shadow(0 10px 25px ${articleColor}cc)`,
              lineHeight: 1,
            }}
          >
            👉
          </motion.div>
          
          {/* الكلمة المرتبطة (صغيرة) */}
          <div className="text-3xl md:text-4xl opacity-70">
            {part.emoji}
          </div>
        </div>

        {/* أداة الإشارة */}
        <div className="px-3 pb-3 flex flex-col items-center gap-1.5 z-10">
          <div 
            className="px-6 py-2 rounded-xl border-2 font-black text-white text-2xl md:text-3xl max-w-full text-center"
            style={{
              background: `linear-gradient(135deg, ${articleGradient[0]}, ${articleGradient[1]})`,
              borderColor: 'rgba(255,255,255,0.5)',
              boxShadow: `0 4px 15px ${articleColor}88`,
              direction: 'ltr',
            }}
          >
            {part.article}
          </div>
          <div className="text-base font-black text-white/90">{part.articleAr}</div>
          <div className="text-[10px] text-white/60 font-bold mt-1">
            تُستخدم مع {part.gender === 'M' ? 'الأسماء المذكرة' : 'الأسماء المؤنثة'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 💎 Sentence Card - كارت الجملة الكاملة
// ═══════════════════════════════════════
function SentenceCard({ part, size = 280 }: { part: SpanishBodyPart; size?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, minHeight: size * 1.3 }}
    >
      <div 
        className="absolute inset-0 blur-3xl opacity-60 rounded-full" 
        style={{ background: `radial-gradient(circle, ${part.color}aa, transparent 70%)` }} 
      />
      
      <div 
        className="relative w-full rounded-[2rem] overflow-hidden border-4 flex flex-col items-center"
        style={{
          background: `linear-gradient(180deg, ${part.gradient[0]}44, ${part.gradient[1]}77, #1a0a2e)`,
          borderColor: part.color,
          boxShadow: `0 20px 60px ${part.color}66, inset 0 2px 0 rgba(255,255,255,0.3)`,
        }}
      >
        <div className="absolute top-2 right-2 text-2xl opacity-20 select-none pointer-events-none">📖</div>
        
        {/* Header */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <div 
            className="px-5 py-1.5 rounded-2xl border-2 font-black text-white text-sm flex items-center gap-1.5"
            style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderColor: '#FFF',
              boxShadow: '0 4px 12px rgba(255,165,0,0.5)',
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            🎯 الجملة الكاملة
          </div>
        </div>

        {/* الإيموجي */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pt-20 pb-2">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ 
              fontSize: size * 0.4,
              filter: `drop-shadow(0 10px 25px ${part.color}cc)`,
              lineHeight: 1,
            }}
          >
            {part.emoji}
          </motion.div>
        </div>

        {/* الجملة */}
        <div className="px-3 pb-3 flex flex-col items-center gap-2 z-10 w-full">
          <div 
            className="px-4 py-2 rounded-xl border-2 font-black text-white text-base md:text-xl max-w-full text-center"
            style={{
              background: `linear-gradient(135deg, ${part.gradient[0]}, ${part.gradient[1]})`,
              borderColor: 'rgba(255,255,255,0.5)',
              boxShadow: `0 4px 15px ${part.color}88`,
              direction: 'ltr',
            }}
          >
            {part.sentenceEs}
          </div>
          <div className="text-sm font-bold text-white/90 text-center">{part.sentenceAr}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// 🔊 زر الصوت
// ═══════════════════════════════════════
function SoundButton({ onClick, color, size = 60 }: { onClick: () => void; color: string; size?: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={() => { setPlaying(true); onClick(); setTimeout(() => setPlaying(false), 1500); }}
      className="relative rounded-full flex items-center justify-center border-2"
      style={{ 
        width: size, height: size,
        background: `linear-gradient(135deg, #DC2626, #991B1B)`,
        borderColor: 'rgba(255,255,255,0.4)',
        boxShadow: `0 6px 20px rgba(220,38,38,0.6)`,
      }}
    >
      {playing && [0, 0.2, 0.4].map((d, i) => (
        <motion.div key={i} className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#DC2626' }}
          initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1, delay: d, ease: 'easeOut' }} />
      ))}
      <Volume2 size={size * 0.45} className="text-white" />
    </motion.button>
  );
}

// ═══════════════════════════════════════
// 📊 Mini Stepper - عرض الـ 7 مراحل
// ═══════════════════════════════════════
function PhaseStepper({ currentPhase, isMobile }: { currentPhase: Phase; isMobile: boolean }) {
  const phases: { id: Phase; label: string; icon: string }[] = [
    { id: 'listen-word', label: 'اسمع كلمة', icon: '🎧' },
    { id: 'write-word', label: 'اكتب كلمة', icon: '✍️' },
    { id: 'speak-word', label: 'انطق كلمة', icon: '🎤' },
    { id: 'listen-article', label: 'اسمع أداة', icon: '🎧' },
    { id: 'write-article', label: 'اكتب أداة', icon: '✍️' },
    { id: 'build-sentence', label: 'كوّن جملة', icon: '🧱' },
    { id: 'speak-sentence', label: 'انطق جملة', icon: '🎤' },
  ];
  
  const currentIdx = phases.findIndex(p => p.id === currentPhase);
  if (currentIdx === -1) return null;
  
  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {phases.map((p, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          <div key={p.id} className="flex items-center gap-1">
            <div
              className="rounded-full font-black flex items-center justify-center border transition-all"
              style={{
                width: isActive ? (isMobile ? 24 : 36) : (isMobile ? 16 : 24),
                height: isActive ? (isMobile ? 24 : 36) : (isMobile ? 16 : 24),
                background: isActive ? '#DC2626' : isDone ? '#58CC02' : 'rgba(255,255,255,0.1)',
                borderColor: isActive ? '#FFF' : isDone ? '#58CC02' : 'rgba(255,255,255,0.25)',
                fontSize: isMobile ? '10px' : '14px',
              }}
            >
              {isDone ? '✓' : isActive ? p.icon : ''}
            </div>
            {i < phases.length - 1 && (
              <div className={`${isMobile ? 'w-1' : 'w-2'} h-0.5`}
                style={{ background: isDone ? '#58CC02' : 'rgba(255,255,255,0.2)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// 🎓 Word Progress Indicator
// ═══════════════════════════════════════
function WordProgressIndicator({ currentWord, totalWords, isMobile, color }: {
  currentWord: number;
  totalWords: number;
  isMobile: boolean;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalWords }).map((_, i) => {
        const isActive = i === currentWord;
        const isDone = i < currentWord;
        return (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: isActive ? (isMobile ? 20 : 28) : 10,
              height: 10,
              background: isActive ? color : isDone ? '#58CC02' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? `0 0 10px ${color}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// 🚀 الكومبوننت الأساسي
// ═══════════════════════════════════════
function SpanishBodyLessonInner() {
  const router = useRouter();
  const isMobile = useIsMobile();
  
  const [groupIdx, setGroupIdx] = useState(0);
  const [partIdx, setPartIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('listen-word');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [input, setInput] = useState('');
  
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
  const [toroMood, setToroMood] = useState<ToroMood>('idle');
  const [toroMessage, setToroMessage] = useState<ToroMessage | null>(null);
  
  const [partChoices, setPartChoices] = useState<SpanishBodyPart[]>([]);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [articleChoices, setArticleChoices] = useState<string[]>([]);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const [points, setPoints] = useState(1250);
  const [streak, setStreak] = useState(7);
  const [gems, setGems] = useState(35);
  const [hints] = useState(3);
  const [correctInGroup, setCorrectInGroup] = useState(0);

  const group = SPANISH_BODY_GROUPS[groupIdx];
  const part = group?.parts[partIdx];

  const treasureState: 'closed' | 'half' | 'opend' = 
    correctInGroup < 2 ? 'closed' : correctInGroup < 4 ? 'half' : 'opend';

  useEffect(() => {
    const load = async () => {
      const progress = await getSpanishLessonProgress(LESSON_ID);
      if (progress && !progress.completed) {
        setGroupIdx(progress.current_group || 0);
        setPartIdx(progress.current_letter || 0);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  // 🎧 Listen Word
  useEffect(() => {
    if (part && phase === 'listen-word') {
      setPartChoices(generateSpanishBodyChoices(part.word, 3));
      setTimeout(() => speakSpanishWord(part.word), 500);
    }
  }, [partIdx, groupIdx, phase]);

  // ✍️ Write Word
  useEffect(() => {
    if (part && phase === 'write-word') {
      setInput('');
      setStatus('idle');
      setTimeout(() => speakSpanishWord(part.word), 300);
    }
  }, [partIdx, groupIdx, phase]);

  // 🎤 Speak Word
  useEffect(() => {
    if (part && phase === 'speak-word') {
      setTimeout(() => speakSpanishWord(part.word), 300);
    }
  }, [partIdx, groupIdx, phase]);

  // 🎧 Listen Article
  useEffect(() => {
    if (part && phase === 'listen-article') {
      setArticleChoices(generateArticleChoices(part.article));
      setTimeout(() => speakSpanishWord(part.article), 500);
    }
  }, [partIdx, groupIdx, phase]);

  // ✍️ Write Article
  useEffect(() => {
    if (part && phase === 'write-article') {
      setInput('');
      setStatus('idle');
      setTimeout(() => speakSpanishWord(part.article), 300);
    }
  }, [partIdx, groupIdx, phase]);

  // 🧱 Build Sentence
  useEffect(() => {
    if (part && phase === 'build-sentence') {
      setAvailableWords(generateSentenceWordPool(part));
      setSelectedWords([]);
      setStatus('idle');
      setTimeout(() => speakSpanishSentence(part.sentenceEs), 500);
    }
  }, [partIdx, groupIdx, phase]);

  // 🎤 Speak Sentence
  useEffect(() => {
    if (part && phase === 'speak-sentence') {
      setTimeout(() => speakSpanishSentence(part.sentenceEs), 300);
    }
  }, [partIdx, groupIdx, phase]);

  const handleToroReact = (mood: ToroMood) => {
    setToroMood(mood);
    const msg = mood === 'happy' ? SPANISH_ENCOURAGEMENTS : SPANISH_SAD_MESSAGES;
    setToroMessage(msg[Math.floor(Math.random() * msg.length)]);
    setTimeout(() => { setToroMood('idle'); setToroMessage(null); }, 2500);
  };

  const goToNextPhase = () => {
    const phaseOrder: Phase[] = [
      'listen-word', 'write-word', 'speak-word',
      'listen-article', 'write-article',
      'build-sentence', 'speak-sentence'
    ];
    
    const currentIdx = phaseOrder.indexOf(phase);
    
    if (currentIdx < phaseOrder.length - 1) {
      // فيه مرحلة جاية
      setPhase(phaseOrder[currentIdx + 1]);
      setStatus('idle');
      setInput('');
    } else {
      // خلصنا الـ 7 مراحل، ننتقل للكلمة الجاية
      if (partIdx < group.parts.length - 1) {
        setPartIdx(n => n + 1);
        setPhase('listen-word');
      } else {
        setPhase('group-success');
      }
    }
  };

  const triggerCorrect = (cx: number, cy: number) => {
    playCoinSound();
    setPoints(p => p + 10);
    setStreak(s => s + 1);
    setCorrectInGroup(c => c + 1);
    setConfettiPos({ x: cx, y: cy });
    setConfettiTrigger(t => t + 1);
    handleToroReact('happy');
    
    setTimeout(() => goToNextPhase(), 1400);
  };

  // ─── Handlers ───
  const handlePartChoice = (choice: SpanishBodyPart, e: React.MouseEvent) => {
    if (status === 'correct') return;
    if (choice.word === part.word) {
      setStatus('correct');
      speakSpanishWord(part.word);
      triggerCorrect(e.clientX, e.clientY);
    } else {
      setWrongChoice(choice.word);
      playBuzzSound();
      handleToroReact('sad');
      setTimeout(() => setWrongChoice(null), 600);
    }
  };

  const handleWriteWordCheck = () => {
    if (compareSpanishWords(input, part.word)) {
      setStatus('correct');
      speakSpanishWord(part.word);
      triggerCorrect(window.innerWidth/2, window.innerHeight/2);
    } else {
      setStatus('wrong');
      playBuzzSound();
      handleToroReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleArticleChoice = (choice: string, e: React.MouseEvent) => {
    if (status === 'correct') return;
    if (choice === part.article) {
      setStatus('correct');
      speakSpanishWord(part.article);
      triggerCorrect(e.clientX, e.clientY);
    } else {
      setWrongChoice(choice);
      playBuzzSound();
      handleToroReact('sad');
      setTimeout(() => setWrongChoice(null), 600);
    }
  };

  const handleWriteArticleCheck = () => {
    if (compareSpanishWords(input, part.article)) {
      setStatus('correct');
      speakSpanishWord(part.article);
      triggerCorrect(window.innerWidth/2, window.innerHeight/2);
    } else {
      setStatus('wrong');
      playBuzzSound();
      handleToroReact('sad');
      setTimeout(() => { setStatus('idle'); setInput(''); }, 900);
    }
  };

  const handleSelectWord = (word: string, idx: number) => {
    if (status === 'correct') return;
    
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    setAvailableWords(availableWords.filter((_, i) => i !== idx));
    speakSpanishWord(word);

    if (newSelected.length === part.sentenceWords.length) {
      const isCorrect = checkSentenceOrder(newSelected, part.sentenceWords);
      if (isCorrect) {
        setStatus('correct');
        setTimeout(() => {
          speakSpanishSentence(part.sentenceEs);
          triggerCorrect(window.innerWidth / 2, window.innerHeight / 2);
        }, 400);
      } else {
        setStatus('wrong');
        playBuzzSound();
        handleToroReact('sad');
        setTimeout(() => {
          setAvailableWords(generateSentenceWordPool(part));
          setSelectedWords([]);
          setStatus('idle');
        }, 1200);
      }
    }
  };

  const handleRemoveSelected = (idx: number) => {
    if (status === 'correct') return;
    const word = selectedWords[idx];
    setSelectedWords(selectedWords.filter((_, i) => i !== idx));
    setAvailableWords([...availableWords, word]);
  };

  const handleSpeakDone = () => {
    triggerCorrect(window.innerWidth/2, window.innerHeight/2);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white font-black">جاري التحميل...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden" 
      style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>
      
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img 
          src={isMobile ? "/spanish/maps/spanish-map-2-mob.webp" : "/spanish/maps/spanish-map-2-pc.webp"} 
          alt="bg" className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0" style={{
          background: isMobile 
            ? 'linear-gradient(180deg, rgba(30,15,5,0.7) 0%, rgba(30,15,5,0.85) 100%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(70,40,15,0.85) 0%, rgba(40,25,10,0.92) 50%, rgba(20,15,5,0.95) 100%)',
        }} />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 px-2 md:px-6" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
        
        {isMobile ? (
          <>
            <div className="flex items-center justify-between gap-1.5">
              <button onClick={() => router.push('/spanish-character-and-map')}
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
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-purple-400/40 flex-1 justify-center">
                  <Gem size={12} className="text-purple-300" fill="#9D4EDD" />
                  <span className="font-black text-[10px] text-white">{gems}</span>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 flex-shrink-0">
                <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
              </div>
            </div>
            
            {phase !== 'group-success' && phase !== 'all-done' && (
              <>
                <div className="flex justify-center mt-1.5">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15">
                    <WordProgressIndicator 
                      currentWord={partIdx} 
                      totalWords={group?.parts.length || 5} 
                      isMobile 
                      color={part?.color || '#DC2626'} 
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15">
                    <PhaseStepper currentPhase={phase} isMobile />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/spanish-character-and-map')}
                className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-white hover:scale-105 transition">
                <Home size={20} />
              </button>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-yellow-400/40">
                <img src="/treasuer/star.webp" className="w-6 h-6" alt="" />
                <span className="font-black text-white">{points}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-orange-400/40">
                <Flame size={18} className="text-orange-400" fill={streak > 0 ? '#FF4D6D' : 'none'} />
                <span className="font-black text-white">{streak}</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-purple-400/40">
                <Gem size={18} className="text-purple-300" fill="#9D4EDD" />
                <span className="font-black text-white">{gems}</span>
              </div>
            </div>

            {phase !== 'group-success' && phase !== 'all-done' && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/15">
                  <WordProgressIndicator 
                    currentWord={partIdx} 
                    totalWords={group?.parts.length || 5} 
                    isMobile={false} 
                    color={part?.color || '#DC2626'} 
                  />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border-2 border-white/15">
                  <PhaseStepper currentPhase={phase} isMobile={false} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/80">المستوى A1.1</span>
                <span className="font-black text-white text-sm">درس الجسم</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden bg-red-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                <img src="/spanish/characters/toro.webp" className="w-full h-full object-cover" alt="toro" />
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-3 pt-32 md:pt-36 pb-28">
        <AnimatePresence mode="wait">
          
          {/* ═══ Phase 1: Listen Word ═══ */}
          {phase === 'listen-word' && part && (
            <motion.div key={`listen-word-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <WordCard part={part} size={isMobile ? 200 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: `${part.color}66` }}>
                    <span className="font-black text-white text-sm md:text-base">🎧 استمع واختر الجزء الصحيح</span>
                  </div>

                  <SoundButton onClick={() => speakSpanishWord(part.word)} color={part.color} size={isMobile ? 55 : 70} />

                  <div className="flex flex-col gap-2 md:gap-3 w-full mt-2">
                    {partChoices.map((choice, idx) => {
                      const isWrong = wrongChoice === choice.word;
                      const isCorrect = status === 'correct' && choice.word === part.word;
                      return (
                        <motion.button
                          key={`${part.word}-${choice.word}-${idx}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : isCorrect ? { scale: 1.05 } : { scale: 1, opacity: 1 }}
                          transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring' }}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={(e) => handlePartChoice(choice, e)}
                          disabled={status === 'correct'}
                          className="relative rounded-2xl flex items-center gap-3 p-3 md:p-4 border-2"
                          style={{
                            background: isWrong ? 'linear-gradient(135deg, #FF4444, #CC0000)' :
                              isCorrect ? `linear-gradient(135deg, ${choice.gradient[0]}, ${choice.gradient[1]})` :
                              'rgba(255,255,255,0.08)',
                            borderColor: isWrong ? '#FF4444' : isCorrect ? choice.color : 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <div className="rounded-2xl flex-shrink-0 border-2 border-white/40 flex items-center justify-center"
                            style={{
                              width: isMobile ? 44 : 56, height: isMobile ? 44 : 56,
                              background: `linear-gradient(135deg, ${choice.gradient[0]}aa, ${choice.gradient[1]}aa)`,
                              fontSize: isMobile ? '1.5rem' : '2rem',
                            }}>
                            {choice.emoji}
                          </div>
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <div className="text-left" dir="ltr">
                              <div className={`font-black text-white ${isMobile ? 'text-sm' : 'text-base'}`}>{choice.word}</div>
                            </div>
                            <div className="text-right" dir="rtl">
                              <div className={`font-bold text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{choice.wordAr}</div>
                            </div>
                          </div>
                          {isCorrect && <Check size={isMobile ? 20 : 24} className="text-white" strokeWidth={3} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 2: Write Word ═══ */}
          {phase === 'write-word' && part && (
            <motion.div key={`write-word-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <WordCard part={part} size={isMobile ? 200 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: `${part.color}66` }}>
                    <span className="font-black text-white text-sm md:text-base">✍️ اكتب اسم الجزء بالإسبانية</span>
                  </div>

                  <SoundButton onClick={() => speakSpanishWord(part.word)} color={part.color} size={isMobile ? 50 : 60} />

                  <div className="w-full">
                    <GhostInput 
                      value={input} 
                      onChange={(v) => { setInput(v); setStatus('idle'); }} 
                      onEnter={handleWriteWordCheck}
                      ghostText={part.word} 
                      color={part.color} 
                      status={status}
                      fontSize={isMobile ? '1.3rem' : '1.5rem'}
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleWriteWordCheck} 
                    disabled={!input}
                    className="w-full py-3.5 rounded-2xl font-black text-lg text-white disabled:opacity-30 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #58CC02, #4AA802)', boxShadow: '0 6px 0 #3A8602' }}
                  >
                    تحقق <Check size={22} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 3: Speak Word ═══ */}
          {phase === 'speak-word' && part && (
            <motion.div key={`speak-word-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <WordCard part={part} size={isMobile ? 200 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: `${part.color}66` }}>
                    <span className="font-black text-white text-sm md:text-base">🎤 انطق الكلمة بصوت واضح</span>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSpeakDone}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4"
                    style={{
                      background: `linear-gradient(135deg, ${part.gradient[0]}, ${part.gradient[1]})`,
                      borderColor: 'rgba(255,255,255,0.3)',
                      boxShadow: `0 0 50px ${part.color}66`,
                    }}>
                    <Mic size={isMobile ? 40 : 50} className="text-white" />
                  </motion.button>

                  <button onClick={() => speakSpanishWord(part.word)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 text-sm font-bold">
                    <Volume2 size={14} /> اسمع النطق
                  </button>

                  <button onClick={handleSpeakDone}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white text-sm font-bold">
                    <SkipForward size={14} /> تخطي
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 4: Listen Article ═══ */}
          {phase === 'listen-article' && part && (
            <motion.div key={`listen-article-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <ArticleCard part={part} size={isMobile ? 200 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,215,0,0.5)' }}>
                    <span className="font-black text-white text-sm md:text-base">🎧 استمع واختر أداة الإشارة الصحيحة</span>
                    <div className="text-[10px] text-yellow-300 mt-0.5">{part.gender === 'M' ? 'كلمة مذكر' : 'كلمة مؤنث'}</div>
                  </div>

                  <SoundButton onClick={() => speakSpanishWord(part.article)} color="#FFD700" size={isMobile ? 55 : 70} />

                  <div className="flex flex-col gap-3 w-full mt-2">
                    {articleChoices.map((choice, idx) => {
                      const isWrong = wrongChoice === choice;
                      const isCorrect = status === 'correct' && choice === part.article;
                      const isMale = choice === 'Este';
                      const choiceColor = isMale ? '#3B82F6' : '#EC4899';
                      const choiceGradient: [string, string] = isMale ? ['#60A5FA', '#1E40AF'] : ['#F472B6', '#BE185D'];
                      
                      return (
                        <motion.button
                          key={`article-${choice}-${idx}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isWrong ? { x: [-8, 8, -8, 8, 0] } : isCorrect ? { scale: 1.05 } : { scale: 1, opacity: 1 }}
                          transition={isWrong ? { duration: 0.4 } : { delay: idx * 0.1, type: 'spring' }}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={(e) => handleArticleChoice(choice, e)}
                          disabled={status === 'correct'}
                          className="relative rounded-2xl flex items-center gap-3 p-4 border-2"
                          style={{
                            background: isWrong ? 'linear-gradient(135deg, #FF4444, #CC0000)' :
                              isCorrect ? `linear-gradient(135deg, ${choiceGradient[0]}, ${choiceGradient[1]})` :
                              'rgba(255,255,255,0.08)',
                            borderColor: isWrong ? '#FF4444' : isCorrect ? choiceColor : 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <div className="rounded-full flex-shrink-0 border-2 border-white/40 flex items-center justify-center text-2xl"
                            style={{
                              width: 56, height: 56,
                              background: `linear-gradient(135deg, ${choiceGradient[0]}aa, ${choiceGradient[1]}aa)`,
                            }}>
                            {isMale ? '♂' : '♀'}
                          </div>
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <div className="text-left" dir="ltr">
                              <div className="font-black text-white text-xl">{choice}</div>
                              <div className="text-[10px] text-white/60 font-bold">{isMale ? 'مذكر' : 'مؤنث'}</div>
                            </div>
                            <div className="text-right" dir="rtl">
                              <div className="font-bold text-white/80 text-base">{isMale ? 'هذا' : 'هذه'}</div>
                            </div>
                          </div>
                          {isCorrect && <Check size={24} className="text-white" strokeWidth={3} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 5: Write Article ═══ */}
          {phase === 'write-article' && part && (
            <motion.div key={`write-article-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <ArticleCard part={part} size={isMobile ? 200 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,215,0,0.5)' }}>
                    <span className="font-black text-white text-sm md:text-base">✍️ اكتب أداة الإشارة</span>
                    <div className="text-[10px] text-yellow-300 mt-0.5">المعنى: {part.articleAr}</div>
                  </div>

                  <SoundButton 
                    onClick={() => speakSpanishWord(part.article)} 
                    color={part.gender === 'M' ? '#3B82F6' : '#EC4899'} 
                    size={isMobile ? 50 : 60} 
                  />

                  <div className="w-full">
                    <GhostInput 
                      value={input} 
                      onChange={(v) => { setInput(v); setStatus('idle'); }} 
                      onEnter={handleWriteArticleCheck}
                      ghostText={part.article} 
                      color={part.gender === 'M' ? '#3B82F6' : '#EC4899'} 
                      status={status}
                      fontSize={isMobile ? '1.5rem' : '1.8rem'}
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleWriteArticleCheck} 
                    disabled={!input}
                    className="w-full py-3.5 rounded-2xl font-black text-lg text-white disabled:opacity-30 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #58CC02, #4AA802)', boxShadow: '0 6px 0 #3A8602' }}
                  >
                    تحقق <Check size={22} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 6: Build Sentence ═══ */}
          {phase === 'build-sentence' && part && (
            <motion.div key={`build-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <SentenceCard part={part} size={isMobile ? 220 : 280} />
                
                <div className={`flex flex-col items-center gap-3 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: `${part.color}66` }}>
                    <span className="font-black text-white text-sm md:text-base">🧱 كوّن الجملة بالترتيب</span>
                  </div>

                  <button 
                    onClick={() => speakSpanishSentence(part.sentenceEs)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20"
                  >
                    <Volume2 size={14} /> اسمع الجملة
                  </button>

                  <div 
                    className="w-full min-h-[70px] rounded-2xl border-2 border-dashed p-3 flex flex-wrap items-center justify-center gap-2"
                    style={{
                      background: status === 'correct' ? 'rgba(88,204,2,0.2)' :
                                 status === 'wrong' ? 'rgba(255,68,68,0.2)' :
                                 'rgba(0,0,0,0.3)',
                      borderColor: status === 'correct' ? '#58CC02' :
                                  status === 'wrong' ? '#FF4444' :
                                  'rgba(255,255,255,0.3)',
                    }}
                  >
                    {selectedWords.length === 0 ? (
                      <span className="text-white/40 text-xs font-bold">جملتك هتظهر هنا...</span>
                    ) : (
                      selectedWords.map((word, i) => (
                        <motion.button
                          key={`sel-${word}-${i}`}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveSelected(i)}
                          disabled={status === 'correct'}
                          className="px-3 py-2 rounded-xl border-2 flex items-center gap-1.5 font-black text-white text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${part.gradient[0]}, ${part.gradient[1]})`,
                            borderColor: 'rgba(255,255,255,0.4)',
                          }}
                        >
                          <span dir="ltr">{word}</span>
                          {status !== 'correct' && <X size={12} className="text-white/70" />}
                        </motion.button>
                      ))
                    )}
                  </div>

                  <div className="w-full flex flex-wrap items-center justify-center gap-2">
                    {availableWords.map((word, i) => (
                      <motion.button
                        key={`avail-${word}-${i}`}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.92 }}
                        onClick={() => handleSelectWord(word, i)}
                        disabled={status === 'correct'}
                        className="px-3 py-2 rounded-xl border-2 font-black text-white text-sm"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          borderColor: 'rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <span dir="ltr">{word}</span>
                      </motion.button>
                    ))}
                  </div>

                  {status === 'correct' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/30 border-2 border-green-400">
                      <Check size={20} className="text-green-300" strokeWidth={3} />
                      <span className="font-black text-white text-sm">¡Perfecto!</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Phase 7: Speak Sentence ═══ */}
          {phase === 'speak-sentence' && part && (
            <motion.div key={`speak-sentence-${groupIdx}-${partIdx}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-5xl">
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 md:gap-10`}>
                
                <SentenceCard part={part} size={isMobile ? 220 : 280} />
                
                <div className={`flex flex-col items-center gap-4 ${isMobile ? 'w-full max-w-sm' : 'flex-1 max-w-md'}`}>
                  <div className="px-5 py-2 rounded-2xl backdrop-blur-md border-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: `${part.color}66` }}>
                    <span className="font-black text-white text-sm md:text-base">🎤 انطق الجملة كاملة</span>
                  </div>

                  <div className="w-full p-3 rounded-2xl border-2"
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.2)' }}>
                    <div className="text-[10px] text-yellow-300 font-black mb-2 text-center">
                      🔊 اضغط على أي كلمة لتسمعها
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {part.sentenceWords.map((word, i) => (
                        <button key={i}
                          onClick={() => speakSpanishWord(word)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white"
                          dir="ltr">
                          🔊 {word}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSpeakDone}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4"
                    style={{
                      background: `linear-gradient(135deg, ${part.gradient[0]}, ${part.gradient[1]})`,
                      borderColor: 'rgba(255,255,255,0.3)',
                      boxShadow: `0 0 50px ${part.color}66`,
                    }}>
                    <Mic size={isMobile ? 40 : 50} className="text-white" />
                  </motion.button>

                  <button onClick={() => speakSpanishSentence(part.sentenceEs)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 text-sm font-bold">
                    <Volume2 size={14} /> اسمع الجملة
                  </button>

                  <button onClick={handleSpeakDone}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white text-sm font-bold">
                    <SkipForward size={14} /> تخطي
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Group Success ═══ */}
          {phase === 'group-success' && (
            <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 max-w-2xl">
              <Trophy size={isMobile ? 80 : 120} className="text-yellow-400 mx-auto" 
                style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' }} />
              <h2 className="text-3xl md:text-5xl font-black text-white">¡Excelente!</h2>
              <p className="text-lg md:text-xl text-red-400 font-bold">أنهيت {group.titleEs}</p>
              <p className="text-sm text-yellow-300/80">5 كلمات × 7 مراحل = إتقان كامل! 🎉</p>

              <button 
                onClick={() => {
                  if (groupIdx < SPANISH_BODY_GROUPS.length - 1) {
                    setGroupIdx(g => g + 1); 
                    setPartIdx(0); 
                    setPhase('listen-word');
                    setCorrectInGroup(0);
                  } else {
                    setPhase('all-done');
                  }
                }}
                className="px-8 md:px-12 py-3 md:py-4 rounded-2xl font-black text-lg md:text-xl text-white"
                style={{ background: 'linear-gradient(135deg, #DC2626, #FFD700)', boxShadow: '0 10px 30px rgba(220,38,38,0.4)' }}
              >
                المجموعة التالية 🚀
              </button>
            </motion.div>
          )}

          {/* ═══ All Done ═══ */}
          {phase === 'all-done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center space-y-6">
              
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-4">
                {SPANISH_BODY.map((p, i) => (
                  <motion.div key={p.word}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className="px-3 py-1.5 rounded-xl border-2 border-white/40 flex items-center gap-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                    }}>
                    <span className="text-lg">{p.emoji}</span>
                    <span className="text-xs font-black text-white" dir="ltr">{p.word}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-7xl md:text-8xl">🏰</div>
              <h1 className="text-3xl md:text-5xl font-black text-white">¡Cuerpo completo!</h1>
              <p className="text-lg md:text-xl text-white/60 max-w-md mx-auto">تعلمت 15 جزء من الجسم!</p>
              <p className="text-sm text-yellow-300/80 max-w-md mx-auto">
                دلوقتي تقدر تستخدم Este (هذا) و Esta (هذه) لتوصف أي جزء! 🎉
              </p>
              <div className="flex justify-center gap-3">
                {[1,2,3].map(i => (
                  <motion.img key={i} src="/treasuer/star.webp" alt="star" 
                    className="w-12 h-12 md:w-16 md:h-16"
                    initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
                    style={{ filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.9))' }} />
                ))}
              </div>
              <button 
                onClick={() => { 
                  saveSpanishLessonProgress(LESSON_ID, 3, true);
                  router.push('/spanish-character-and-map'); 
                }}
                className="px-10 py-4 rounded-2xl font-black text-xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #DC2626, #FFD700)', 
                  boxShadow: '0 15px 40px rgba(220,38,38,0.5)',
                }}>
                العودة للخريطة 🗺️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1.5 pointer-events-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}>
        <div className={`mx-auto pointer-events-auto ${isMobile ? 'max-w-md' : 'max-w-[1500px]'}`}>
          <div className="relative rounded-xl px-4 md:px-6 py-1.5 md:py-2"
            style={{
              background: 'linear-gradient(135deg, rgba(50,30,15,0.85), rgba(40,25,10,0.9))',
              backdropFilter: 'blur(30px)',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sparkles size={10} className="text-yellow-300" />
              <span className="text-[9px] md:text-[10px] font-black text-yellow-200 tracking-wider uppercase">مكافآت الإنجاز</span>
              <Sparkles size={10} className="text-yellow-300" />
            </div>
            
            <div className="flex items-end justify-around gap-2 md:gap-3">
              <button onClick={() => router.push('/spanish-character-and-map')}
                className="flex flex-col items-center gap-0.5">
                <img src="/treasuer/map-icon.webp" alt="map" className="w-9 h-9 md:w-11 md:h-11 object-contain" />
                <span className="text-[8px] md:text-[9px] font-black" style={{ color: '#4CC9F0' }}>خريطة</span>
              </button>

              <div className="flex flex-col items-center gap-0.5 opacity-70">
                <img src="/treasuer/star.webp" alt="star" className="w-9 h-9 md:w-11 md:h-11 object-contain" />
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">نجوم</span>
              </div>

              <motion.div animate={treasureState === 'opend' ? { y: [0, -3, 0] } : { y: 0 }}
                transition={{ duration: 1.5, repeat: treasureState === 'opend' ? Infinity : 0 }}
                className="flex flex-col items-center gap-0.5">
                <img src={`/treasuer/${treasureState}.webp`} alt="treasure" className="w-9 h-9 md:w-11 md:h-11 object-contain" />
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">صندوق</span>
              </motion.div>

              <div className="flex flex-col items-center gap-0.5 opacity-70">
                <img src="/treasuer/energy.webp" alt="energy" className="w-9 h-9 md:w-11 md:h-11 object-contain" />
                <span className="text-[8px] md:text-[9px] font-black" style={{ color: '#4CC9F0' }}>طاقة</span>
              </div>

              <button className="flex flex-col items-center gap-0.5 relative" disabled={hints === 0}>
                <div className="relative">
                  <img src="/treasuer/HINT.svg" alt="hint" className="w-9 h-9 md:w-11 md:h-11 object-contain" />
                  {hints > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border border-black/95">
                      {hints}
                    </div>
                  )}
                </div>
                <span className="text-[8px] md:text-[9px] font-black text-yellow-400">تلميح</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToroBull mood={toroMood} message={toroMessage} idleGlowColor={part?.color || '#DC2626'} />
      <ConfettiBurst trigger={confettiTrigger} x={confettiPos.x} y={confettiPos.y} 
        colors={[part?.color || '#DC2626', '#FFD700', '#ffffff']} />
    </div>
  );
}

export default function SpanishBodyLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">Loading...</div>}>
      <SpanishBodyLessonInner />
    </Suspense>
  );
}
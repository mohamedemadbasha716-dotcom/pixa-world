'use client';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Star, ArrowLeft, Volume2, ChevronRight, Check, X } from 'lucide-react';

// ===== أنواع =====
type DialogChar = 'karl' | 'guard' | 'narrator';
type StepType = 'dialog' | 'challenge' | 'reward';

interface DialogStep {
  type: 'dialog';
  char: DialogChar;
  text: string;
  textAr?: string;
  autoPlay?: boolean;
}

interface ChallengeOption { text: string; correct: boolean; emoji?: string }
interface ChallengeStep {
  type: 'challenge';
  question: string;
  hint?: string;
  options: ChallengeOption[];
  successText: string;
  failText: string;
}

interface RewardStep {
  type: 'reward';
  title: string;
  subtitle: string;
  xp: number;
  emoji: string;
}

type Step = DialogStep | ChallengeStep | RewardStep;

interface Scene {
  id: string;
  title: string;
  location: string;
  locationEmoji: string;
  bg: string;
  accent: string;
  steps: Step[];
}

// ===== بيانات المشاهد =====
const SCENES: Record<string, Scene[]> = {
  hamburg: [
    {
      id: 'gate',
      title: 'بوابة الميناء',
      location: 'هامبورغ',
      locationEmoji: '⚓',
      bg: 'from-[#0a1628] via-[#0d2137] to-[#0a1628]',
      accent: '#4CC9F0',
      steps: [
        {
          type: 'dialog', char: 'narrator',
          text: 'كارل وصل لبوابة ميناء هامبورغ...',
          textAr: 'بس الحارس بيتكلم ألماني بس! 😱',
        },
        {
          type: 'dialog', char: 'guard',
          text: 'Halt! Wer bist du?',
          textAr: '(وقف! مين أنت؟)',
          autoPlay: true,
        },
        {
          type: 'dialog', char: 'karl',
          text: 'أنا... أنا... يا ولد ساعدني! 😰',
        },
        {
          type: 'challenge',
          question: 'الحارس بيسأل "مين أنت؟" — ساعد كارل يرد!',
          hint: 'Ich heiße = اسمي',
          options: [
            { text: 'Ich heiße Karl! 🦅', correct: true, emoji: '✅' },
            { text: 'Guten Morgen!', correct: false },
            { text: 'Danke schön!', correct: false },
            { text: 'Auf Wiedersehen!', correct: false },
          ],
          successText: 'ممتاز! كارل عرّف بنفسه! 🎉',
          failText: 'دي تحية مش تعريف — جرب تاني!',
        },
        {
          type: 'dialog', char: 'guard',
          text: 'Ah, Karl! Wie alt bist du?',
          textAr: '(آه، كارل! كم عمرك؟)',
          autoPlay: true,
        },
        {
          type: 'challenge',
          question: 'الحارس بيسأل عن عمر كارل — كارل عنده 8 سنين!',
          hint: 'Ich bin = أنا / Jahre alt = سنة',
          options: [
            { text: 'Ich bin acht Jahre alt!', correct: true, emoji: '✅' },
            { text: 'Ich bin müde!', correct: false },
            { text: 'Ich heiße Karl!', correct: false },
            { text: 'Ich komme!', correct: false },
          ],
          successText: 'صح! كارل قال عمره بالظبط! 🌟',
          failText: 'مش دي — فكر في الأرقام!',
        },
        {
          type: 'dialog', char: 'guard',
          text: 'Willkommen in Hamburg, Karl! ⚓',
          textAr: '(أهلاً وسهلاً في هامبورغ، كارل!)',
          autoPlay: true,
        },
        {
          type: 'dialog', char: 'karl',
          text: 'يييه! شكراً يا صاحبي! 🦅🎉',
        },
        {
          type: 'reward',
          title: 'فتحت بوابة هامبورغ!',
          subtitle: 'تعلمت: التعريف بالنفس بالألماني',
          xp: 50,
          emoji: '⚓',
        },
      ],
    },
    {
      id: 'market',
      title: 'سوق الميناء',
      location: 'هامبورغ',
      locationEmoji: '🛒',
      bg: 'from-[#1a0a28] via-[#2d0a3d] to-[#1a0a28]',
      accent: '#4CC9F0',
      steps: [
        {
          type: 'dialog', char: 'narrator',
          text: 'كارل دخل السوق وشاف الألوان الجميلة...',
        },
        {
          type: 'dialog', char: 'karl',
          text: 'واو! الأكل كتير! بس مش عارف أطلب إيه! 🍎',
        },
        {
          type: 'dialog', char: 'guard',
          text: 'Was möchtest du? Apfel oder Brot?',
          textAr: '(عايز إيه؟ تفاحة ولا خبز؟)',
          autoPlay: true,
        },
        {
          type: 'challenge',
          question: 'البائع بيسأل عن التفاحة 🍎 — إيه اسمها بالألماني؟',
          options: [
            { text: 'Apfel 🍎', correct: true },
            { text: 'Brot 🍞', correct: false },
            { text: 'Milch 🥛', correct: false },
            { text: 'Wasser 💧', correct: false },
          ],
          successText: 'صح! Apfel = تفاحة! 🍎',
          failText: 'لأ — شوف الصورة كويس!',
        },
        {
          type: 'dialog', char: 'karl',
          text: 'Ich möchte einen Apfel, bitte! 🍎',
          textAr: '(عايز تفاحة من فضلك!)',
          autoPlay: true,
        },
        {
          type: 'challenge',
          question: 'البائع قالك "Das macht zwei Euro" — معناها إيه؟',
          hint: 'zwei = اثنان',
          options: [
            { text: 'ده بيكلف يورين', correct: true },
            { text: 'اتفضل خد', correct: false },
            { text: 'شكراً ليك', correct: false },
            { text: 'مش موجود', correct: false },
          ],
          successText: 'ممتاز! فهمت السعر! 💰',
          failText: 'فكر في كلمة "zwei"!',
        },
        {
          type: 'dialog', char: 'karl',
          text: 'Danke schön! 🙏',
          textAr: '(شكراً جزيلاً!)',
          autoPlay: true,
        },
        {
          type: 'reward',
          title: 'بطل السوق!',
          subtitle: 'تعلمت: الأكل والتسوق بالألماني',
          xp: 60,
          emoji: '🛒',
        },
      ],
    },
  ],
  cologne: [
    {
      id: 'cathedral',
      title: 'أمام الكاتدرائية',
      location: 'كولونيا',
      locationEmoji: '⛪',
      bg: 'from-[#1a0828] via-[#2d1040] to-[#1a0828]',
      accent: '#F72585',
      steps: [
        {
          type: 'dialog', char: 'narrator',
          text: 'كارل وصل لكولونيا وقابل طفلة اسمها لينا...',
        },
        {
          type: 'dialog', char: 'guard',
          text: 'Hallo! Ich heiße Lina. Wie heißt du?',
          textAr: '(أهلاً! أنا اسمي لينا. إيه اسمك؟)',
          autoPlay: true,
        },
        {
          type: 'challenge',
          question: 'لينا بتسألك إيه اسمك — رد عليها!',
          hint: 'Ich heiße = اسمي',
          options: [
            { text: 'Ich heiße Karl!', correct: true },
            { text: 'Guten Tag!', correct: false },
            { text: 'Wie geht es dir?', correct: false },
            { text: 'Tschüss!', correct: false },
          ],
          successText: 'ممتاز! عرّفت بنفسك صح! 😊',
          failText: 'دي تحية — لينا بتسأل عن اسمك!',
        },
        {
          type: 'dialog', char: 'guard',
          text: 'Schön! Wie geht es dir, Karl?',
          textAr: '(جميل! كيف حالك يا كارل؟)',
          autoPlay: true,
        },
        {
          type: 'challenge',
          question: 'لينا بتسألك "كيف حالك؟" — إيه الرد الصح؟',
          options: [
            { text: 'Mir geht es gut, danke! 😊', correct: true },
            { text: 'Ich bin Karl!', correct: false },
            { text: 'Auf Wiedersehen!', correct: false },
            { text: 'Guten Morgen!', correct: false },
          ],
          successText: 'برافو! ردك كان مثالي! 🌟',
          failText: 'فكر — إيه معنى "Mir geht es gut"؟',
        },
        {
          type: 'dialog', char: 'karl',
          text: 'يييه! عندي صاحبة جديدة في كولونيا! 🎉',
        },
        {
          type: 'reward',
          title: 'صداقة جديدة!',
          subtitle: 'تعلمت: التحيات والمحادثة الأولى',
          xp: 55,
          emoji: '⛪',
        },
      ],
    },
  ],
};

// ===== نطق ألماني =====
function speak(text: string) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE'; u.rate = 0.8; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

// ===== الشخصيات =====
const CHARS: Record<DialogChar, { name: string; emoji: string; color: string; side: 'right' | 'left' }> = {
  karl:     { name: 'كارل',    emoji: '🦅', color: '#4CC9F0', side: 'right' },
  guard:    { name: 'الحارس',  emoji: '💬', color: '#FFD700', side: 'left'  },
  narrator: { name: '',        emoji: '📜', color: '#aaa',    side: 'left'  },
};

// ===== مكون الحوار =====
function DialogBubble({ step, accent, onNext }: { step: DialogStep; accent: string; onNext: () => void }) {
  const char = CHARS[step.char];
  const isNarrator = step.char === 'narrator';
  const isRight = char.side === 'right';

  useEffect(() => {
    if (step.autoPlay) {
      const timer = setTimeout(() => speak(step.text), 400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-5 items-center w-full"
    >
      {isNarrator ? (
        <div className="bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-center max-w-sm">
          <p className="text-white/70 font-bold text-sm leading-relaxed">{step.text}</p>
          {step.textAr && <p className="text-white/40 text-xs mt-1">{step.textAr}</p>}
        </div>
      ) : (
        <div className={`flex items-end gap-3 w-full ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 border-2"
            style={{ background: `${char.color}22`, borderColor: `${char.color}66` }}>
            {char.emoji}
          </motion.div>
          <div className={`flex flex-col gap-1 max-w-[75%] ${isRight ? 'items-end' : 'items-start'}`}>
            <span className="text-xs font-black px-2" style={{ color: char.color }}>{char.name}</span>
            <div
              className="rounded-3xl px-5 py-4 border"
              style={{
                background: `${char.color}15`,
                borderColor: `${char.color}33`,
                borderBottomRightRadius: isRight ? 4 : undefined,
                borderBottomLeftRadius: !isRight ? 4 : undefined,
              }}>
              <p className="font-black text-lg text-white leading-snug">{step.text}</p>
              {step.textAr && (
                <p className="text-sm font-bold mt-1" style={{ color: `${char.color}99` }}>{step.textAr}</p>
              )}
            </div>
            {step.autoPlay && (
              <button onClick={() => speak(step.text)}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border transition-all"
                style={{ color: char.color, borderColor: `${char.color}44`, background: `${char.color}11` }}>
                <Volume2 size={12} /> استمع تاني
              </button>
            )}
          </div>
        </div>
      )}

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        onClick={onNext}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-white text-base"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, borderBottom: `3px solid ${accent}66` }}>
        كمّل <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
}

// ===== مكون التحدي =====
function ChallengeCard({ step, accent, onAnswer }: { step: ChallengeStep; accent: string; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState(false);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = step.options[i].correct;
    if (!correct) { setShake(true); setTimeout(() => setShake(false), 600); }
    setTimeout(() => onAnswer(correct), correct ? 1200 : 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-5 w-full"
    >
      <div className="bg-white/5 rounded-3xl p-5 text-center border border-white/10">
        <div className="text-3xl mb-2">🤔</div>
        <p className="font-black text-base text-white leading-relaxed">{step.question}</p>
        {step.hint && (
          <p className="text-xs font-bold mt-2 px-3 py-1 rounded-full inline-block"
            style={{ color: accent, background: `${accent}22` }}>
            💡 {step.hint}
          </p>
        )}
      </div>

      <motion.div animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}} className="grid grid-cols-2 gap-3">
        {step.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = opt.correct;
          let bg = 'rgba(255,255,255,0.05)';
          let border = 'rgba(255,255,255,0.1)';
          let textColor = 'white';

          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(88,204,2,0.2)'; border = '#58CC02'; textColor = '#58CC02'; }
            else if (isSelected) { bg = 'rgba(247,37,133,0.2)'; border = '#F72585'; textColor = '#F72585'; }
          }

          return (
            <motion.button
              key={i}
              whileTap={selected === null ? { scale: 0.96 } : {}}
              onClick={() => handleSelect(i)}
              className="p-4 rounded-2xl border-2 font-black text-sm transition-all text-center leading-snug"
              style={{ background: bg, borderColor: border, color: textColor, cursor: selected !== null ? 'default' : 'pointer' }}>
              {selected !== null && isCorrect && <Check size={14} className="inline ml-1" />}
              {selected !== null && isSelected && !isCorrect && <X size={14} className="inline ml-1" />}
              {opt.text}
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center font-black text-base rounded-2xl py-3 px-4"
            style={{
              background: step.options[selected]?.correct ? 'rgba(88,204,2,0.15)' : 'rgba(247,37,133,0.15)',
              color: step.options[selected]?.correct ? '#58CC02' : '#F72585',
            }}>
            {step.options[selected]?.correct ? step.successText : step.failText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== شاشة المكافأة =====
function RewardScreen({ step, accent, onNext }: { step: RewardStep; accent: string; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-8xl">{step.emoji}
      </motion.div>
      <div>
        <h2 className="text-3xl font-black text-white mb-2">{step.title}</h2>
        <p className="font-bold" style={{ color: accent }}>{step.subtitle}</p>
      </div>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        className="flex items-center gap-2 px-6 py-3 rounded-full border-2 font-black text-xl"
        style={{ color: '#FFD700', borderColor: '#FFD70066', background: '#FFD70011' }}>
        +{step.xp} <Star size={20} fill="#FFD700" /> XP
      </motion.div>
      <div className="flex gap-2 w-full max-w-xs">
        {[1,2,3].map(s => (
          <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3 + s * 0.15, type: 'spring' }} className="flex-1">
            <Star size={48} className="w-full" fill="#FFD700" color="#FFD700" />
          </motion.div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        onClick={onNext}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        className="px-10 py-4 rounded-2xl font-black text-lg text-white"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, borderBottom: `4px solid ${accent}66` }}>
        كمّل المغامرة 🗺️
      </motion.button>
    </motion.div>
  );
}

// ===== شريط التقدم العلوي =====
function TopBar({ scene, stepIndex, total, accent, onBack }: {
  scene: Scene; stepIndex: number; total: number; accent: string; onBack: () => void
}) {
  const progress = (stepIndex / total) * 100;
  return (
    <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
      style={{ background: 'linear-gradient(to bottom, rgba(7,9,13,0.95), transparent)' }}>
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <button onClick={onBack}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white flex-shrink-0">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold mb-1.5 text-white/40">
            <span>{scene.locationEmoji} {scene.title}</span>
            <span>{stepIndex}/{total}</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${accent}, ${accent}99)` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== اختيار المشهد =====
function SceneSelect({ scenes, accent, onSelect }: { scenes: Scene[]; accent: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-10 max-w-lg mx-auto" dir="rtl">
      <p className="text-white/50 font-bold text-sm text-center mb-2">اختار المهمة اللي عايز تلعبها 👇</p>
      {scenes.map((scene, i) => (
        <motion.button key={scene.id}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(scene.id)}
          className="flex items-center gap-4 p-5 rounded-3xl border-2 text-right"
          style={{ background: `${accent}0d`, borderColor: `${accent}33`, borderBottom: `4px solid ${accent}44` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: `${accent}22` }}>
            {scene.locationEmoji}
          </div>
          <div className="flex-1">
            <div className="font-black text-white text-base">{scene.title}</div>
            <div className="text-xs font-bold mt-0.5" style={{ color: accent }}>
              {scene.steps.filter(s => s.type === 'challenge').length} تحديات
            </div>
          </div>
          <ChevronRight size={20} className="text-white/30" />
        </motion.button>
      ))}
    </div>
  );
}

// ===== الصفحة الرئيسية =====
export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = params?.levelId as string;

  // ✅ كل الـ hooks هنا فوق أي return
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const scenes = SCENES[levelId];

  const scene = scenes ? (scenes.find(s => s.id === selectedSceneId) ?? null) : null;

  const handleNext = useCallback(() => {
    if (!scene) return;
    if (stepIndex + 1 >= scene.steps.length) {
      setStepIndex(scene.steps.length);
    } else {
      setStepIndex(i => i + 1);
    }
  }, [stepIndex, scene]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (!correct) { setWrongCount(c => c + 1); return; }
    handleNext();
  }, [handleNext]);

  // ✅ الـ returns المبكرة بعد كل الـ hooks
  if (!scenes) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="font-black text-xl">المنطقة دي جاية قريباً!</p>
          <button onClick={() => router.push('/character-and-map?from=lesson')}
  className="mt-4 px-6 py-3 bg-white/10 rounded-2xl font-bold">الخريطة</button>
        </div>
      </div>
    );
  }

  if (!selectedSceneId || !scene) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <div className="fixed top-0 left-0 right-0 z-30 px-4 pt-4 pb-3"
          style={{ background: 'linear-gradient(to bottom, rgba(7,9,13,1), transparent)' }}>
          <button onClick={() => router.push('/character-and-map?from=lesson')}
  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border bo border-white/10 text-white">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="pt-16">
          <div className="text-center pt-8 pb-4 px-4">
            <div className="text-5xl mb-2">{scenes[0]?.locationEmoji}</div>
            <h1 className="text-2xl font-black text-white">{scenes[0]?.location}</h1>
            <p className="text-white/40 text-sm font-bold mt-1">اختار مهمتك</p>
          </div>
          <SceneSelect scenes={scenes} accent={scenes[0]?.accent ?? '#4CC9F0'} onSelect={(id) => {
            setSelectedSceneId(id);
            setStepIndex(0);
            setWrongCount(0);
          }} />
        </div>
      </div>
    );
  }

  const currentStep = scene.steps[stepIndex];
  const isLast = stepIndex >= scene.steps.length;

  if (isLast) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${scene.bg} flex items-center justify-center px-6`}
        style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
        <RewardScreen
          step={scene.steps[scene.steps.length - 1] as RewardStep}
          accent={scene.accent}
          onNext={() => { setSelectedSceneId(null); setStepIndex(0); }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${scene.bg} text-white`}
      style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <TopBar
        scene={scene}
        stepIndex={stepIndex}
        total={scene.steps.length - 1}
        accent={scene.accent}
        onBack={() => setSelectedSceneId(null)}
      />
      <div className="pt-24 pb-10 px-4 max-w-lg mx-auto min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={stepIndex} className="flex flex-col gap-4 w-full">
            {currentStep.type === 'dialog' && (
              <DialogBubble step={currentStep} accent={scene.accent} onNext={handleNext} />
            )}
            {currentStep.type === 'challenge' && (
              <ChallengeCard step={currentStep} accent={scene.accent} onAnswer={handleAnswer} />
            )}
            {currentStep.type === 'reward' && (
              <RewardScreen step={currentStep} accent={scene.accent} onNext={() => setStepIndex(i => i + 1)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
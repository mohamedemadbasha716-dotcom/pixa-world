'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Star, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  savePlayer, 
  getPlayer, 
  getAllProgress, 
  LESSON_ORDER, 
  type LessonProgress 
} from '@/lib/playerData';
// ═══════════════════════════════════════
// المعالم - الإحداثيات المظبوطة بناءً على الصورة الفعلية
// ═══════════════════════════════════════
const LANDMARKS = [
  {
    id: 'hamburg',
    nameAr: 'ميناء هامبورغ',
    nameDe: 'Hamburger Hafen',
    emoji: '⚓',
    lesson: 1,
    description: 'أكبر ميناء في ألمانيا! هنا هتتعلم الحروف الألمانية.',
    color: '#4CC9F0',
    centerX: 41,
    centerY: 9,
    clickArea: { x: 35, y: 3, w: 13, h: 14 },
  },
  {
    id: 'cologne',
    nameAr: 'كاتدرائية كولونيا',
    nameDe: 'Kölner Dom',
    emoji: '⛪',
    lesson: 2,
    description: 'أشهر كنيسة في ألمانيا! هنا هتتعلم الأرقام.',
    color: '#F72585',
    centerX: 23,
    centerY: 41,
    clickArea: { x: 16, y: 25, w: 15, h: 33 },
  },
  {
    id: 'center',
    nameAr: 'قرية الغابة',
    nameDe: 'Walddorf',
    emoji: '🏠',
    lesson: 3,
    description: 'قرية سحرية في قلب ألمانيا! هنا هتتعلم الألوان والفواكه والخضروات والحيوانات.',
    color: '#7209B7',
    centerX: 49,
    centerY: 46,
    clickArea: { x: 43, y: 36, w: 13, h: 20 },
  },
  {
    id: 'berlin',
    nameAr: 'بوابة براندنبورغ',
    nameDe: 'Brandenburger Tor',
    emoji: '🏛️',
    lesson: 4,
    description: 'قلب برلين وعاصمة ألمانيا! هنا هتتعلم التحيات والتعارف والعائلة.',
    color: '#FFD700',
    centerX: 71,
    centerY: 21,
    clickArea: { x: 62, y: 8, w: 18, h: 28 },
  },
  {
    id: 'lake',
    nameAr: 'بحيرة الملوك',
    nameDe: 'Königssee',
    emoji: '🏞️',
    lesson: 5,
    description: 'أجمل بحيرة في ألمانيا بين جبال الألب! هنا هتتعلم الطقس وأيام الأسبوع والطبيعة.',
    color: '#06D6A0',
    centerX: 84,
    centerY: 51,
    clickArea: { x: 79, y: 44, w: 10, h: 14 },
  },
  {
    id: 'neuschwanstein',
    nameAr: 'قلعة نويشفانشتاين',
    nameDe: 'Schloss Neuschwanstein',
    emoji: '🏰',
    lesson: 6,
    description: 'أجمل قلعة في العالم! هنا هتتعلم الجمل الكاملة.',
    color: '#58CC02',
    centerX: 56,
    centerY: 74,
    clickArea: { x: 47, y: 58, w: 18, h: 30 },
  },
];

// ═══════════════════════════════════════
// أصوات
// ═══════════════════════════════════════
function playClickSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

function playLockedSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

export default function CharacterAndMapPage() {
  const router = useRouter();

  const [step, setStep] = useState<'setup' | 'video' | 'map'>('setup');
  const [heroName, setHeroName] = useState('');
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ x: number; y: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // ⭐ استرجاع الاسم والشخصية من Supabase + التحقق من الـ URL + Debug Mode
  useEffect(() => {
    const loadPlayer = async () => {
      // 📥 جلب بيانات اللاعب من Supabase
      const player = await getPlayer();
      if (player) {
        setHeroName(player.hero_name);
        setSelectedHero(player.hero_type);
        console.log('✅ تم تحميل اللاعب من Supabase:', player);
      } else {
        // لو مفيش بيانات في Supabase، نشوف localStorage
        const savedName = localStorage.getItem('heroName');
        const savedHero = localStorage.getItem('heroType');
        if (savedName) setHeroName(savedName);
        if (savedHero) setSelectedHero(savedHero);
      }
    };
    
    loadPlayer();

    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'lesson') {
      setStep('map');
    }
    if (params.get('debug') === '1') {
      setDebugMode(true);
    }
  }, []);

  const [videoStarted, setVideoStarted] = useState(false);

  const [selectedLandmark, setSelectedLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [eaglePos, setEaglePos] = useState({ x: 49, y: 46 });
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
const [unlockedLesson, setUnlockedLesson] = useState(1);
const [progressLoaded, setProgressLoaded] = useState(false);

  const heroes = [
    { id: 'boy', name: 'البطل الشجاع', color: '#4CC9F0', img: '/characters/boy-3d.png' },
    { id: 'girl', name: 'البطلة العبقرية', color: '#F72585', img: '/characters/girl-3d.png' },
  ];

  useEffect(() => {
    const current = LANDMARKS.find(l => l.lesson === unlockedLesson);
    if (current) {
      setEaglePos({ x: current.centerX, y: current.centerY });
    }
  }, []);
  // 📥 تحميل التقدم من Supabase + حساب آخر درس مفتوح
  useEffect(() => {
    const loadProgress = async () => {
      const allProgress = await getAllProgress();
      
      // تحويل المصفوفة لـ Map للسرعة
      const map: Record<string, LessonProgress> = {};
      allProgress.forEach(p => {
        map[p.lesson_id] = p;
      });
      setProgressMap(map);

      // حساب آخر درس مفتوح بناءً على الترتيب
      let lastUnlocked = 1;
      for (let i = 0; i < LESSON_ORDER.length; i++) {
        const lessonId = LESSON_ORDER[i];
        const progress = map[lessonId];
        
        if (progress?.completed) {
          // لو الدرس متكمل، الدرس اللي بعده يفتح
          lastUnlocked = i + 2;
        } else {
          break;
        }
      }
      
      // التأكد إنه مايعديش الحد الأقصى
      setUnlockedLesson(Math.min(lastUnlocked, LESSON_ORDER.length));
      setProgressLoaded(true);
      
      console.log('🗺️ التقدم المحمّل:', map);
      console.log('🔓 آخر درس مفتوح:', lastUnlocked);
    };
    
    loadProgress();
  }, []);

  const isLocked = (lesson: number) => lesson > unlockedLesson;
  const isCurrent = (lesson: number) => lesson === unlockedLesson;
  const getStars = (id: string) => progressMap[id]?.stars ?? 0;

  // 💾 حفظ في Supabase + Local Storage
  const handleStartJourney = async () => {
    if (heroName && selectedHero) {
      setIsSaving(true);
      
      // 💾 حفظ في Supabase
      const player = await savePlayer(heroName, selectedHero);
      
      if (player) {
        // برضو نحفظ في localStorage عشان السرعة
        localStorage.setItem('heroName', heroName);
        localStorage.setItem('heroType', selectedHero);
        setIsSaving(false);
        setStep('video');
      } else {
        setIsSaving(false);
        alert('حصلت مشكلة في حفظ البيانات، حاول تاني!');
      }
    }
  };

  const handleVideoEnd = () => setStep('map');

  const handleTapToPlay = () => {
    setVideoStarted(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  const handleLandmarkClick = (landmark: typeof LANDMARKS[0]) => {
    if (debugMode) return;
    if (isLocked(landmark.lesson)) {
      playLockedSound();
      return;
    }
    playClickSound();
    setEaglePos({ x: landmark.centerX, y: landmark.centerY });
    setTimeout(() => setSelectedLandmark(landmark), 300);
  };

  const handleLandmarkStart = () => {
    if (!selectedLandmark) return;
    const routes: Record<string, string> = {
      'hamburg': '/german-letter-lesson',
      'cologne': '/german-number-lesson',
      'center': '/german-forest',
      'berlin': '/german-family',
      'lake': '/german-lake-lesson',
      'neuschwanstein': '/german-castle-lesson',
    };
    const route = routes[selectedLandmark.id];
    if (route) router.push(route);
  };

  const handleMapClickForDebug = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!debugMode || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickedCoords({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) });
    console.log(`📍 Clicked at: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`);
  };

  // ═════ شاشة Setup ═════
  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#07090D] text-white pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#7209B7]/15 to-transparent blur-[140px] pointer-events-none" />

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-6 relative z-10 mt-4 space-y-16">
          <header className="flex justify-between items-center py-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <ArrowLeft size={14} /> العودة للرئيسية
            </button>
          </header>

          <input
            type="text"
            value={heroName}
            onChange={e => setHeroName(e.target.value)}
            placeholder="...اكتب اسمك الشجاع هنا"
            className="w-full max-w-lg mx-auto block bg-transparent border-b-2 border-white/20 focus:border-[#4CC9F0] text-center font-black text-2xl py-4 outline-none transition-all placeholder:text-white/20"
          />

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {heroes.map(hero => (
              <div key={hero.id} className="flex flex-col items-center group">
                <motion.div onClick={() => setSelectedHero(hero.id)} whileHover={{ y: -10 }} className="relative cursor-pointer flex flex-col items-center">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity rounded-full blur-2xl" style={{ backgroundColor: hero.color }} />
                  <img src={hero.img} alt={hero.name} className="w-48 h-56 object-contain relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
                </motion.div>
                <h3 className="text-xl font-black mt-6 mb-4">{hero.name}</h3>
                <button onClick={() => setSelectedHero(hero.id)}
                  className={`px-8 py-3 rounded-full font-black border-2 transition-all ${selectedHero === hero.id ? 'bg-white text-black' : 'border-white/20 hover:border-white'}`}>
                  اختار بطلك
                </button>
              </div>
            ))}
          </section>

          <div className="flex justify-center pt-10 pb-20">
            <motion.button onClick={handleStartJourney} disabled={!heroName || !selectedHero || isSaving} whileHover={{ scale: isSaving ? 1 : 1.05 }}
              className="group relative px-12 py-5 bg-gradient-to-r from-[#F72585] to-[#7209B7] rounded-full font-black text-2xl flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              {isSaving ? 'جاري الحفظ...' : 'ابدأ رحلتك'}
              {!isSaving && <Sparkles className="text-white group-hover:rotate-12 transition-transform" />}
            </motion.button>
          </div>
        </motion.main>
      </div>
    );
  }

  // ═════ شاشة الفيديو ═════
  if (step === 'video') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
        onClick={!videoStarted ? handleTapToPlay : undefined}>
        <video ref={videoRef} src="/videos/karl-intro.mp4" className="w-full h-full object-cover" playsInline muted onEnded={handleVideoEnd} />

        <AnimatePresence>
          {!videoStarted && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
              <motion.img src="/characters/karl-3d.png" alt="كارل النسر" className="w-40 h-40 object-contain drop-shadow-2xl"
                animate={{ y: [-8, 8, -8] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="flex flex-col items-center gap-3" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <div className="w-16 h-16 rounded-full border-4 border-white/80 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  <div className="w-0 h-0" style={{ borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid white', marginLeft: '4px' }} />
                </div>
                <p className="text-white font-black text-xl">اضغط لتبدأ المغامرة</p>
                <p className="text-white/50 text-sm font-bold">كارل النسر في انتظارك! 🦅</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {videoStarted && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} onClick={handleVideoEnd}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-black text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/50 transition-all backdrop-blur-sm bg-black/30">
              تخطي ←
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ═════ شاشة الخريطة ═════
  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>

      {debugMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 flex items-center justify-between text-xs font-black">
          <span>🐛 DEBUG MODE - اضغط في أي مكان على الخريطة لمعرفة الإحداثيات</span>
          {clickedCoords && (
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-lg font-mono">
              X: {clickedCoords.x}% | Y: {clickedCoords.y}%
            </span>
          )}
        </div>
      )}

      <div className="fixed left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(7,9,13,0.95), transparent)', 
          top: debugMode ? '32px' : '0' 
        }}>
        <button onClick={() => setStep('setup')}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-4 py-2 text-sm font-bold text-white transition-all">
          ← تعديل الاختيارات
        </button>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-4 py-2">
          <div className="text-sm font-black text-white">👋 {heroName}</div>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-4 py-2">
          <div className="text-right">
            <div className="text-xs text-white/50 font-bold">تقدمك</div>
            <div className="text-sm font-black text-[#58CC02]">
              {LANDMARKS.filter(l => l.lesson < unlockedLesson).length} / {LANDMARKS.length} معالم
            </div>
          </div>
          <div className="text-xl">🗺️</div>
        </div>
      </div>

      <div className="w-full min-h-screen flex items-center justify-center bg-[#07090D] pb-4 px-0 md:px-2" 
  style={{ paddingTop: debugMode ? '96px' : '64px' }}>
  <div 
    ref={mapRef}
    onClick={handleMapClickForDebug}
    className="relative w-full"
    style={{ 
      maxWidth: '100vw',
      width: '100%',
      aspectRatio: '16 / 9',
      cursor: debugMode ? 'crosshair' : 'default',
    }}
  >
          <img 
  src="/maps/german-map.png" 
  alt="خريطة ألمانيا" 
  className="absolute inset-0 w-full h-full pointer-events-none select-none" 
  style={{ objectFit: 'cover', display: 'block' }}
  draggable={false} 
/>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ zIndex: 5 }}
          >
            <defs>
              {LANDMARKS.map(l => (
                <radialGradient key={`grad-${l.id}`} id={`glow-${l.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={l.color} stopOpacity="0.55" />
                  <stop offset="50%" stopColor={l.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={l.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {LANDMARKS.map(l => {
              const showGlow = hoveredLandmark?.id === l.id || isCurrent(l.lesson);
              if (isLocked(l.lesson) && !isCurrent(l.lesson)) return null;
              const cx = l.clickArea.x + l.clickArea.w / 2;
              const cy = l.clickArea.y + l.clickArea.h / 2;
              const rx = l.clickArea.w * 0.6;
              const ry = l.clickArea.h * 0.6;
              return (
                <motion.ellipse
                  key={`hover-${l.id}`}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill={`url(#glow-${l.id})`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: showGlow ? (isCurrent(l.lesson) ? [0.7, 1, 0.7] : 1) : 0,
                  }}
                  transition={isCurrent(l.lesson)
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.3 }
                  }
                  style={{
                    filter: `blur(${isCurrent(l.lesson) ? '2px' : '1px'})`,
                    mixBlendMode: 'screen',
                  }}
                />
              );
            })}
          </svg>

          {debugMode && LANDMARKS.map(l => (
            <div key={`debug-${l.id}`} className="absolute pointer-events-none border-2 border-dashed flex items-center justify-center"
              style={{
                left: `${l.clickArea.x}%`,
                top: `${l.clickArea.y}%`,
                width: `${l.clickArea.w}%`,
                height: `${l.clickArea.h}%`,
                borderColor: l.color,
                background: `${l.color}20`,
                zIndex: 18,
              }}>
              <span className="bg-black/80 text-white text-xs font-black px-2 py-0.5 rounded">
                {l.emoji} {l.nameAr}
              </span>
            </div>
          ))}

          {LANDMARKS.map((landmark, index) => {
            const locked = isLocked(landmark.lesson);

            return (
              <div key={landmark.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  onClick={() => handleLandmarkClick(landmark)}
                  onMouseEnter={() => setHoveredLandmark(landmark)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                  className="absolute"
                  style={{
                    left: `${landmark.clickArea.x}%`,
                    top: `${landmark.clickArea.y}%`,
                    width: `${landmark.clickArea.w}%`,
                    height: `${landmark.clickArea.h}%`,
                    cursor: locked ? 'not-allowed' : 'pointer',
                    zIndex: 15,
                  }}
                />

                {locked && (
  <motion.div
    initial={{ scale: 0, opacity: 0, y: 10 }}
    animate={{ 
      scale: 1, 
      opacity: 1, 
      y: [0, -3, 0],
    }}
    transition={{ 
      scale: { delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 },
      opacity: { delay: 0.5 + index * 0.1 },
      y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }
    }}
    className="absolute pointer-events-none"
    style={{
      left: `${landmark.centerX}%`,
      top: `${landmark.centerY}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 14,
    }}
  >
    {/* 🌟 توهج خلفي */}
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255,180,50,0.4), transparent 70%)',
        filter: 'blur(8px)',
        transform: 'scale(2)',
      }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    />

    {/* 🔒 القفل نفسه */}
    <div
      className="relative rounded-full flex items-center justify-center"
      style={{
        width: 'clamp(28px, 2.8vw, 38px)',
        height: 'clamp(28px, 2.8vw, 38px)',
        background: 'linear-gradient(135deg, #8B6914 0%, #4A3508 100%)',
        border: '2px solid #D4AF37',
        boxShadow: `
          0 0 15px rgba(212,175,55,0.5),
          inset 0 2px 4px rgba(255,215,0,0.4),
          inset 0 -2px 4px rgba(0,0,0,0.4),
          0 3px 6px rgba(0,0,0,0.5)
        `,
      }}
    >
      <Lock 
        size={16} 
        className="relative" 
        strokeWidth={2.5}
        style={{ 
          color: '#FFD700',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))',
        }}
      />
    </div>
  </motion.div>
)}

                <AnimatePresence>
                  {hoveredLandmark?.id === landmark.id && !locked && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${landmark.centerX}%`,
                        top: `${landmark.clickArea.y - 2}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 20,
                      }}
                    >
                      <div
                        className="px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-2xl border whitespace-nowrap"
                        style={{
                          background: `${landmark.color}ee`,
                          borderColor: 'rgba(255,255,255,0.3)',
                          boxShadow: `0 4px 20px ${landmark.color}88`,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{landmark.emoji}</span>
                          <span>{landmark.nameAr}</span>
                        </div>
                        <div className="text-white/85 text-[10px] font-bold text-center mt-0.5">{landmark.nameDe}</div>
                      </div>
                      <div
                        className="w-0 h-0 mx-auto"
                        style={{
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: `5px solid ${landmark.color}ee`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <motion.div
            className="absolute pointer-events-none"
            style={{ zIndex: 25 }}
            animate={{
              left: `${eaglePos.x}%`,
              top: `${eaglePos.y - 6}%`,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 14, duration: 2 }}
          >
            <motion.div
              style={{ transform: 'translate(-50%, -50%)' }}
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src="/characters/karl-3d.png"
                alt="كارل النسر"
                style={{
                  width: 'clamp(35px, 3.5vw, 55px)',
                  height: 'clamp(35px, 3.5vw, 55px)',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(76,201,240,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedLandmark && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedLandmark(null)}>
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#131722', border: `2px solid ${selectedLandmark.color}` }}>
              <div className="p-6 text-center relative" style={{ background: `${selectedLandmark.color}22` }}>
                <button onClick={() => setSelectedLandmark(null)} className="absolute top-4 left-4 text-white/40 hover:text-white">
                  <X size={20} />
                </button>
                <div className="text-6xl mb-3">{selectedLandmark.emoji}</div>
                <h2 className="text-2xl font-black text-white mb-1">{selectedLandmark.nameAr}</h2>
                <p className="text-sm font-bold" style={{ color: selectedLandmark.color }}>{selectedLandmark.nameDe}</p>
              </div>
              <div className="p-6">
                <div className="flex gap-3 bg-white/5 rounded-2xl p-4 mb-5">
                  <img src="/characters/karl-3d.png" alt="كارل" className="w-10 h-10 object-contain flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white/50 mb-1">كارل النسر يقول:</div>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">"{selectedLandmark.description}"</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3].map(s => (
                    <Star key={s} size={28} fill={s <= getStars(selectedLandmark.id) ? '#FFD700' : 'transparent'} color={s <= getStars(selectedLandmark.id) ? '#FFD700' : '#333'} />
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleLandmarkStart}
                  className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${selectedLandmark.color}, ${selectedLandmark.color}99)`, borderBottom: `4px solid ${selectedLandmark.color}66` }}>
                  {(() => {
  const lessonData = progressMap[selectedLandmark.id];
  if (!lessonData) return 'ابدأ المغامرة! 🚀';
  if (lessonData.completed) return 'العب تاني 🔄';
  return 'أكمل تقدمك ▶️';
})()}
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && !debugMode && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ delay: 0.5 }}
            className="fixed bottom-4 right-4 z-40 max-w-[260px]">
            <div className="rounded-2xl p-3 shadow-2xl border border-white/10 relative" style={{ background: 'rgba(19,23,34,0.97)' }}>
              <button
                onClick={() => setShowIntro(false)}
                className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 z-10"
              >
                <X size={12} />
              </button>
              <div className="flex gap-2 items-center pr-5">
                <motion.img src="/characters/karl-3d.png" alt="كارل" className="w-9 h-9 object-contain flex-shrink-0"
                  animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1, repeat: 2 }} />
                <div className="flex-1 text-right">
                  <div className="text-[10px] font-bold text-[#4CC9F0]">كارل النسر</div>
                  <p className="text-[11px] text-white/80 leading-tight font-medium">
                    أهلاً <strong className="text-white">{heroName}</strong>! دوس على أي معلم
                  </p>
                </div>
              </div>
              <button onClick={() => setShowIntro(false)}
                className="w-full mt-2 py-1.5 rounded-lg font-black text-[11px] text-white"
                style={{ background: 'linear-gradient(135deg, #4CC9F0, #7209B7)' }}>
                فاهم! 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Star, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════
// المعالم
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
    centerY: 8,
    clickArea: { x: 36, y: 2, w: 12, h: 16 },
  },
  {
    id: 'cologne',
    nameAr: 'كاتدرائية كولونيا',
    nameDe: 'Kölner Dom',
    emoji: '⛪',
    lesson: 2,
    description: 'أشهر كنيسة في ألمانيا! هنا هتتعلم الأرقام.',
    color: '#F72585',
    centerX: 18,
    centerY: 38,
    clickArea: { x: 10, y: 22, w: 18, h: 32 },
  },
  {
    id: 'center',
    nameAr: 'قرية الغابة',
    nameDe: 'Walddorf',
    emoji: '🏠',
    lesson: 3,
    description: 'قرية سحرية في قلب ألمانيا! هنا هتتعلم الألوان والفواكه والخضروات والحيوانات.',
    color: '#7209B7',
    centerX: 44,
    centerY: 45,
    clickArea: { x: 38, y: 35, w: 13, h: 18 },
  },
  {
    id: 'berlin',
    nameAr: 'بوابة براندنبورغ',
    nameDe: 'Brandenburger Tor',
    emoji: '🏛️',
    lesson: 4,
    description: 'قلب برلين وعاصمة ألمانيا! هنا هتتعلم التحيات والتعارف والعائلة.',
    color: '#FFD700',
    centerX: 73,
    centerY: 20,
    clickArea: { x: 64, y: 6, w: 18, h: 26 },
  },
    {
    id: 'lake',
    nameAr: 'بحيرة الملوك',
    nameDe: 'Königssee',
    emoji: '🏞️',
    lesson: 5,
    description: 'أجمل بحيرة في ألمانيا بين جبال الألب! هنا هتتعلم الطقس وأيام الأسبوع والطبيعة.',
    color: '#06D6A0',
    centerX: 78,
    centerY: 53,
    clickArea: { x: 73, y: 43, w: 12, h: 22 },
  },
  {
    id: 'neuschwanstein',
    nameAr: 'قلعة نويشفانشتاين',
    nameDe: 'Schloss Neuschwanstein',
    emoji: '🏰',
    lesson: 6,
    description: 'أجمل قلعة في العالم! هنا هتتعلم الجمل الكاملة.',
    color: '#58CC02',
    centerX: 51,
    centerY: 72,
    clickArea: { x: 42, y: 55, w: 20, h: 26 },
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

  // ⭐ استرجاع الاسم والشخصية + التحقق من الـ URL
  useEffect(() => {
    const savedName = localStorage.getItem('heroName');
    const savedHero = localStorage.getItem('heroType');
    if (savedName) setHeroName(savedName);
    if (savedHero) setSelectedHero(savedHero);

    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'lesson') {
      setStep('map');
    }
  }, []);

  const [videoStarted, setVideoStarted] = useState(false);

  const [selectedLandmark, setSelectedLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [eaglePos, setEaglePos] = useState({ x: 44, y: 45 });
  const [showIntro, setShowIntro] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const unlockedLesson = 6;
  const starsMap: Record<string, number> = {};

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

  const isLocked = (lesson: number) => lesson > unlockedLesson;
  const isCurrent = (lesson: number) => lesson === unlockedLesson;
  const getStars = (id: string) => starsMap[id] ?? 0;

  const handleStartJourney = () => {
    if (heroName && selectedHero) {
      localStorage.setItem('heroName', heroName);
      localStorage.setItem('heroType', selectedHero);
      setStep('video');
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
            <motion.button onClick={handleStartJourney} disabled={!heroName || !selectedHero} whileHover={{ scale: 1.05 }}
              className="group relative px-12 py-5 bg-gradient-to-r from-[#F72585] to-[#7209B7] rounded-full font-black text-2xl flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              ابدأ رحلتك
              <Sparkles className="text-white group-hover:rotate-12 transition-transform" />
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

      {/* الهيدر */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(to bottom, rgba(7,9,13,0.95), transparent)' }}>
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

      {/* الخريطة - بـ aspect-ratio مظبوط */}
      <div className="w-full min-h-screen flex items-center justify-center bg-[#07090D] pt-16 pb-4 px-2">
        <div 
          className="relative w-full"
          style={{ 
            maxWidth: 'min(100vw, calc((100vh - 80px) * 1.78))',
            aspectRatio: '16 / 9',
          }}
        >
          {/* الصورة - بتملا الـ container بالظبط */}
          <img 
            src="/maps/german-map.png" 
            alt="خريطة ألمانيا" 
            className="absolute inset-0 w-full h-full pointer-events-none select-none" 
            style={{ objectFit: 'fill', display: 'block' }}
            draggable={false} 
          />

          {/* SVG: تأثير النيون */}
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

          {/* المناطق الـ Clickable - دلوقتي على المعلم نفسه فقط */}
          {LANDMARKS.map((landmark, index) => {
            const locked = isLocked(landmark.lesson);
            // تقليل الحجم: نأخذ 60% من الـ clickArea (تركيز على المعلم نفسه)
            const shrinkFactor = 0.6;
            const newW = landmark.clickArea.w * shrinkFactor;
            const newH = landmark.clickArea.h * shrinkFactor;
            const newX = landmark.clickArea.x + (landmark.clickArea.w - newW) / 2;
            const newY = landmark.clickArea.y + (landmark.clickArea.h - newH) / 2;

            return (
              <div key={landmark.id}>
                {/* منطقة الضغط الشفافة - أصغر ومركزة على المعلم */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  onClick={() => handleLandmarkClick(landmark)}
                  onMouseEnter={() => setHoveredLandmark(landmark)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                  className="absolute"
                  style={{
                    left: `${newX}%`,
                    top: `${newY}%`,
                    width: `${newW}%`,
                    height: `${newH}%`,
                    cursor: locked ? 'not-allowed' : 'pointer',
                    zIndex: 15,
                  }}
                />

                {/* قفل صغير تحت المعلم */}
                {locked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${landmark.centerX}%`,
                      top: `${landmark.clickArea.y + landmark.clickArea.h - 2}%`,
                      transform: 'translate(-50%, 0)',
                      zIndex: 12,
                    }}
                  >
                    <div
                      className="rounded-full p-1.5 shadow-lg border border-white/20"
                      style={{
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Lock size={12} className="text-white/80" strokeWidth={2.5} />
                    </div>
                  </motion.div>
                )}

                {/* اسم المعلم — يظهر عند الـ hover */}
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
                        top: `${newY - 1}%`,
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

          {/* النسر كارل 3D */}
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

      {/* Popup البدء */}
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
                  {getStars(selectedLandmark.id) > 0 ? 'العب تاني 🔄' : 'ابدأ المغامرة! 🚀'}
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intro النسر */}
      <AnimatePresence>
        {showIntro && (
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
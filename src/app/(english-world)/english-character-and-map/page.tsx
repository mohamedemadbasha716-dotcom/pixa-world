'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lock, Star, ChevronRight, X, Map as MapIcon, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  saveEnglishPlayer, 
  getEnglishPlayer, 
  getAllEnglishProgress, 
  getUserPlanStatus,
  ENGLISH_MAP_1_LESSONS,
  type EnglishLessonProgress 
} from '@/lib/englishPlayerData';

// ═══════════════════════════════════════
// 🎨 بيانات الخريطة 1 - لندن (الأساسيات)
// ═══════════════════════════════════════
const LANDMARKS_MAP_1 = [
  {
    id: 'big-ben',
    nameAr: 'برج بيغ بن',
    nameEn: 'Big Ben',
    emoji: '🕰️',
    lesson: 1,
    description: 'أشهر ساعة في العالم! هنا هنتعلم أصوات الحروف الإنجليزية (Phonics).',
    color: '#4CC9F0',
    route: '/english-phonics-lesson', // ✅ المجلد موجود لديك
  },
  {
    id: 'london-eye',
    nameAr: 'عين لندن',
    nameEn: 'London Eye',
    emoji: '🎡',
    lesson: 2,
    description: 'بتلف وتدور ونشوف منها لندن كلها! هنا هنتعلم الأرقام والألوان.',
    color: '#F72585',
    route: '/english-numbers-lesson', // ✅ المجلد موجود لديك
  },
  {
    id: 'london-bridge',
    nameAr: 'جسر البرج',
    nameEn: 'Tower Bridge',
    emoji: '🌉',
    lesson: 3,
    description: 'الجسر السحري اللي بيفتح! هنا هنتعلم كلمات بسيطة من 3 حروف.',
    color: '#7209B7',
    route: '/english-phonics-lesson', // 🛡️ تحويل مؤقت لحين إنشاء الدرس
  },
  {
    id: 'buckingham-palace',
    nameAr: 'قصر باكنغهام',
    nameEn: 'Buckingham Palace',
    emoji: '👑',
    lesson: 4,
    description: 'بيت الملك والملكة وحراس القصر! هنا هنتعلم التحيات والتعارف.',
    color: '#FFD700',
    route: '/english-numbers-lesson', // 🛡️ تحويل مؤقت لحين إنشاء الدرس
  },
  {
    id: 'hyde-park',
    nameAr: 'حديقة هايد بارك',
    nameEn: 'Hyde Park',
    emoji: '🌳',
    lesson: 5,
    description: 'أكبر حديقة سحرية في لندن! هنا هنتعلم الأشكال الهندسية.',
    color: '#06D6A0',
    route: '/english-phonics-lesson', // 🛡️ تحويل مؤقت لحين إنشاء الدرس
  },
  {
    id: 'london-zoo',
    nameAr: 'حديقة حيوان لندن',
    nameEn: 'London Zoo',
    emoji: '🦁',
    lesson: 6,
    description: 'قلعة الحيوانات السحرية! هنا هتعمل اختبارك الأول وتاخد وسام المستكشف الصغير.',
    color: '#58CC02',
    route: '/english-numbers-lesson', // 🛡️ تحويل مؤقت لحين إنشاء الدرس
  },
];

// ═══════════════════════════════════════
// 🎯 نوع الإحداثيات
// ═══════════════════════════════════════
type LandmarkCoords = {
  centerX: number;
  centerY: number;
  clickArea: { x: number; y: number; w: number; h: number };
};

// ═══════════════════════════════════════
// 🗺️ الإحداثيات المحدثة (Desktop & Mobile)
// ═══════════════════════════════════════
const INITIAL_DESKTOP_MAP_1: Record<string, LandmarkCoords> = {
  "big-ben": {
    "centerX": 15,
    "centerY": 20,
    "clickArea": {
      "x": 11.7,
      "y": 2.6,
      "w": 13.8,
      "h": 36.2
    }
  },
  "london-eye": {
    "centerX": 40,
    "centerY": 15,
    "clickArea": {
      "x": 39.7,
      "y": 1.6,
      "w": 17.3,
      "h": 33.8
    }
  },
  "london-bridge": {
    "centerX": 78,
    "centerY": 30,
    "clickArea": {
      "x": 68,
      "y": 12.1,
      "w": 23.9,
      "h": 38.3
    }
  },
  "buckingham-palace": {
    "centerX": 25,
    "centerY": 55,
    "clickArea": {
      "x": 14.3,
      "y": 41.3,
      "w": 29.7,
      "h": 27
    }
  },
  "hyde-park": {
    "centerX": 55,
    "centerY": 75,
    "clickArea": {
      "x": 32.4,
      "y": 72.2,
      "w": 20,
      "h": 20.3
    }
  },
  "london-zoo": {
    "centerX": 85,
    "centerY": 75,
    "clickArea": {
      "x": 74.2,
      "y": 56.7,
      "w": 23.7,
      "h": 38.5
    }
  }
};

const INITIAL_MOBILE_MAP_1: Record<string, LandmarkCoords> = {
  "big-ben": {
    "centerX": 30,
    "centerY": 10,
    "clickArea": {
      "x": 15,
      "y": 5,
      "w": 35,
      "h": 12
    }
  },
  "london-eye": {
    "centerX": 70,
    "centerY": 22,
    "clickArea": {
      "x": 50,
      "y": 17,
      "w": 40,
      "h": 12
    }
  },
  "london-bridge": {
    "centerX": 35,
    "centerY": 40,
    "clickArea": {
      "x": 15,
      "y": 34,
      "w": 40,
      "h": 14
    }
  },
  "buckingham-palace": {
    "centerX": 50,
    "centerY": 60,
    "clickArea": {
      "x": 25,
      "y": 54,
      "w": 45,
      "h": 14
    }
  },
  "hyde-park": {
    "centerX": 40,
    "centerY": 78,
    "clickArea": {
      "x": 20,
      "y": 72,
      "w": 40,
      "h": 12
    }
  },
  "london-zoo": {
    "centerX": 65,
    "centerY": 92,
    "clickArea": {
      "x": 45,
      "y": 86,
      "w": 45,
      "h": 12
    }
  }
};

const MAPS_DATA = {
  1: {
    landmarks: LANDMARKS_MAP_1,
    imageDesktop: '/english/maps/en-map1-pc.webp',
    imageMobile: '/english/maps/en-map1-mob.webp',
    titleAr: 'لندن — الأساسيات',
    titleEn: 'London — Basics',
    description: 'المرحلة الأولى: الحروف، الأرقام، الألوان والأساسيات',
  },
};

type MapNumber = 1;
const TOTAL_MAPS_COUNT = 1;

// ═══════════════════════════════════════
// 🔊 أصوات التفاعل
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

// ═══════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════
export default function EnglishCharacterAndMapPage() {
  const router = useRouter();

  const [step, setStep] = useState<'setup' | 'video' | 'map'>('setup');
  const [heroName, setHeroName] = useState('');
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // ⚙️ إعدادات المحرر وتحديد الإحداثيات
  const [debugMode, setDebugMode] = useState(false);
  const [editDesktopCoords, setEditDesktopCoords] = useState<Record<string, LandmarkCoords>>(INITIAL_DESKTOP_MAP_1);
  const [editMobileCoords, setEditMobileCoords] = useState<Record<string, LandmarkCoords>>(INITIAL_MOBILE_MAP_1);
  const [editorTarget, setEditorTarget] = useState<string>('big-ben');
  const [editorMode, setEditorMode] = useState<'center' | 'area'>('center');
  const [dragStartPercent, setDragStartPercent] = useState<{ x: number; y: number } | null>(null);
  const [isDrawingArea, setIsDrawingArea] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [isMobileView, setIsMobileView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentMap, setCurrentMap] = useState<MapNumber>(1);
  
  const [progressMap, setProgressMap] = useState<Record<string, EnglishLessonProgress>>({});
  const [unlockedLessonInMap, setUnlockedLessonInMap] = useState(1);
  const [selectedLandmark, setSelectedLandmark] = useState<any | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<any | null>(null);
  const [eaglePos, setEaglePos] = useState({ x: 15, y: 20 });
  const [showIntro, setShowIntro] = useState(true);
  
  const [mapScale, setMapScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasDragged = useRef(false);
  
  const [userStatus, setUserStatus] = useState({ 
    isPremium: false, 
    isSuperAdmin: false, 
    isLoggedIn: false,
    loaded: false,
  });
  
  const mapRef = useRef<HTMLDivElement>(null);

  const currentMapData = MAPS_DATA[currentMap];

  // اختيار مجموعة الإحداثيات المناسبة (تتغير مباشرة في المحرر)
  const activeCoords = isMobileView ? editMobileCoords : editDesktopCoords;

  const LANDMARKS = currentMapData.landmarks.map(landmark => {
    const coords = activeCoords[landmark.id] || { centerX: 50, centerY: 50, clickArea: { x: 45, y: 45, w: 10, h: 10 } };
    return { ...landmark, ...coords };
  });

  const mapImage = isMobileView ? currentMapData.imageMobile : currentMapData.imageDesktop;

  const heroes = [
    { id: 'boy', name: 'البطل الشجاع', color: '#4CC9F0', img: '/characters/boy-3d.webp' },
    { id: 'girl', name: 'البطلة العبقرية', color: '#F72585', img: '/characters/girl-3d.webp' },
  ];

  // ═══════════════════════════════════════
  // 🔧 التحقق من نوع الجهاز
  // ═══════════════════════════════════════
  useEffect(() => {
    setMounted(true);
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      if (!window.location.search.includes('debug=1')) {
        setIsMobileView(isMobile && isPortrait);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // ═══════════════════════════════════════
  // 📥 تحميل بيانات اللاعب والتحقق من الـ Debug
  // ═══════════════════════════════════════
  useEffect(() => {
    const loadPlayer = async () => {
      const player = await getEnglishPlayer();
      if (player) {
        setHeroName(player.hero_name);
        setSelectedHero(player.hero_type);
        setStep('map'); 
      }
    };
    
    const loadUserStatus = async () => {
      const status = await getUserPlanStatus();
      setUserStatus({ ...status, loaded: true });
    };
    
    loadPlayer();
    loadUserStatus();

    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1') {
      setDebugMode(true);
      setStep('map');
    }
    if (params.get('from') === 'lesson') setStep('map');
  }, []);

  // ═══════════════════════════════════════
  // 📊 تحميل التقدم
  // ═══════════════════════════════════════
  useEffect(() => {
    const loadProgress = async () => {
      const allProgress = await getAllEnglishProgress();
      const map: Record<string, EnglishLessonProgress> = {};
      allProgress.forEach(p => { map[p.lesson_id] = p; });
      setProgressMap(map);

      const currentMapLessons = ENGLISH_MAP_1_LESSONS;
      let lastUnlocked = 1;
      for (let i = 0; i < currentMapLessons.length; i++) {
        if (map[currentMapLessons[i]]?.completed) {
          lastUnlocked = i + 2;
        } else break;
      }
      setUnlockedLessonInMap(Math.min(lastUnlocked, currentMapLessons.length));
    };
    loadProgress();
  }, [currentMap]);

  // ═══════════════════════════════════════
  // 🦁 تحريك ليو الأسد لنقطة البداية
  // ═══════════════════════════════════════
  useEffect(() => {
    const current = LANDMARKS.find(l => l.lesson === unlockedLessonInMap);
    if (current) {
      setEaglePos({ x: current.centerX, y: current.centerY });
    }
  }, [unlockedLessonInMap, isMobileView, currentMap]);

  // ═══════════════════════════════════════
  // 🎬 دوال التحكم والمعالجة (Hoisted correctly to prevent ReferenceError)
  // ═══════════════════════════════════════
  async function handleStartJourney() {
    if (heroName && selectedHero) {
      setIsSaving(true);
      try {
        await saveEnglishPlayer(heroName, selectedHero);
        setStep('map');
      } catch (error) {
        console.error("Error saving character:", error);
      } finally {
        setIsSaving(false);
      }
    }
  }

  function isLocked(lesson: number) {
    if (debugMode) return false;
    if (!userStatus.loaded) return lesson !== 1;
    if (userStatus.isSuperAdmin) return false;
    if (userStatus.isPremium) return lesson > unlockedLessonInMap;
    if (currentMap === 1 && lesson === 1) return false;
    return true;
  }
  
  function getStars(id: string) {
    return progressMap[id]?.stars ?? 0;
  }

  function handleLandmarkClick(landmark: any) {
    if (debugMode) {
      setEditorTarget(landmark.id);
      return;
    }
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    if (isLocked(landmark.lesson)) {
      playLockedSound();
      if (userStatus.loaded && !userStatus.isSuperAdmin && !userStatus.isPremium) {
        setTimeout(() => router.push('/plans'), 200);
      }
      return;
    }
    playClickSound();
    setEaglePos({ x: landmark.centerX, y: landmark.centerY });
    setTimeout(() => setSelectedLandmark(landmark), 300);
  }

  function handleLandmarkStart() {
    if (!selectedLandmark) return;
    localStorage.setItem('lastEnglishMap', String(currentMap));
    router.push(`${selectedLandmark.route}?fromMap=${currentMap}`);
  }

  function handleMapMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!debugMode || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    const roundedX = Math.round(pctX * 10) / 10;
    const roundedY = Math.round(pctY * 10) / 10;

    if (editorMode === 'center') {
      updateActiveCoord({ centerX: roundedX, centerY: roundedY });
    } else if (editorMode === 'area') {
      setIsDrawingArea(true);
      setDragStartPercent({ x: roundedX, y: roundedY });
      updateActiveCoord({
        clickArea: { x: roundedX, y: roundedY, w: 1, h: 1 }
      });
    }
  }

  function handleMapMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!debugMode || !isDrawingArea || !dragStartPercent || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    const roundedX = Math.min(Math.max(0, Math.round(pctX * 10) / 10), 100);
    const roundedY = Math.min(Math.max(0, Math.round(pctY * 10) / 10), 100);

    const x = Math.min(dragStartPercent.x, roundedX);
    const y = Math.min(dragStartPercent.y, roundedY);
    const w = Math.max(0.5, Math.abs(dragStartPercent.x - roundedX));
    const h = Math.max(0.5, Math.abs(dragStartPercent.y - roundedY));

    updateActiveCoord({
      clickArea: { 
        x: Math.round(x * 10) / 10, 
        y: Math.round(y * 10) / 10, 
        w: Math.round(w * 10) / 10, 
        h: Math.round(h * 10) / 10 
      }
    });
  }

  function handleMapMouseUp() {
    if (isDrawingArea) {
      setIsDrawingArea(false);
      setDragStartPercent(null);
    }
  }

  function updateActiveCoord(newCoords: Partial<LandmarkCoords> | { clickArea: Partial<{ x: number, y: number, w: number, h: number }> }) {
    const setter = isMobileView ? setEditMobileCoords : setEditDesktopCoords;
    setter(prev => {
      const current = prev[editorTarget] || { centerX: 50, centerY: 50, clickArea: { x: 45, y: 45, w: 10, h: 10 } };
      
      let updated = { ...current };
      if ('clickArea' in newCoords && newCoords.clickArea) {
        updated.clickArea = { ...current.clickArea, ...newCoords.clickArea };
      } else {
        updated = { ...current, ...newCoords as any };
      }
      return { ...prev, [editorTarget]: updated };
    });
  }

  function generateExportCode() {
    const desktopStr = JSON.stringify(editDesktopCoords, null, 2);
    const mobileStr = JSON.stringify(editMobileCoords, null, 2);
    return `// 🖥️ إحداثيات الديسكتوب - الخريطة 1\nexport const COORDS_DESKTOP_MAP_1: Record<string, LandmarkCoords> = ${desktopStr};\n\n// 📱 إحداثيات الموبايل - الخريطة 1\nexport const COORDS_MOBILE_MAP_1: Record<string, LandmarkCoords> = ${mobileStr};`;
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generateExportCode());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (debugMode || e.button !== 0 || isMobileView) return;
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY, posX: mapPosition.x, posY: mapPosition.y };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || debugMode || isMobileView) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged.current = true;
    setMapPosition({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleWheel(e: React.WheelEvent) {
    if (debugMode || isMobileView) return;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setMapScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }

  function resetMapView() {
    setMapScale(1);
    setMapPosition({ x: 0, y: 0 });
  }

  // ═══════════════════════════════════════
  // ⏳ شاشة التحميل (تجنب مشاكل الهيدريشن)
  // ═══════════════════════════════════════
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090D]">
        <div className="text-white font-black animate-pulse">جاري تحميل خريطة لندن...</div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // 🎨 شاشة إعداد البطل
  // ═══════════════════════════════════════
  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#07090D] text-white pb-20 overflow-hidden" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-[#4CC9F0]/15 to-transparent blur-[140px] pointer-events-none" />

        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-6 relative z-10 mt-4 space-y-16">
          <header className="flex justify-between items-center py-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <ArrowLeft size={14} /> العودة للرئيسية
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-red-500/20 px-4 py-2 rounded-xl border border-white/10">
              <span className="text-2xl">🇬🇧</span>
              <span className="font-black text-sm">English Adventure</span>
            </div>
          </header>

          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-6xl mb-4">🦁</motion.div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">أهلاً بك في عالم الإنجليزية!</h1>
            <p className="text-white/60 font-bold">ليو الأسد في انتظارك عشان تبدأوا الرحلة سوا 🚀</p>
          </div>

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
              className="group relative px-12 py-5 bg-gradient-to-r from-[#4CC9F0] to-[#7209B7] rounded-full font-black text-2xl flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              {isSaving ? 'جاري الحفظ...' : 'ابدأ رحلتك مع ليو'}
              {!isSaving && <Sparkles className="text-white group-hover:rotate-12 transition-transform" />}
            </motion.button>
          </div>
        </motion.main>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // 🗺️ شاشة الخريطة والمحرر معاً
  // ═══════════════════════════════════════
  return (
    <div className={`relative w-full min-h-screen ${debugMode ? 'lg:flex' : ''}`} style={{ background: '#07090D', fontFamily: "'Tajawal', sans-serif" }}>

      {/* 🛠️ لوحة تحكم المحرر الجانبية (تظهر فقط في وضع debug) */}
      {debugMode && (
        <div className="w-full lg:w-[400px] bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800 p-6 flex flex-col gap-5 z-40 relative max-h-screen overflow-y-auto" dir="rtl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="text-3xl">🎨</span>
            <div>
              <h2 className="font-black text-lg text-white">رادار تعديل الخريطة</h2>
              <p className="text-xs text-slate-400">حدد المعلم، واضبط أبعاده ومساحة الضغط</p>
            </div>
          </div>

          {/* التبديل بين ديسكتوب وموبايل */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 block">شاشة العرض (المعاينة):</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl">
              <button 
                onClick={() => setIsMobileView(false)} 
                className={`py-2 text-xs font-black rounded-lg transition-all ${!isMobileView ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>
                🖥️ ديسكتوب (PC)
              </button>
              <button 
                onClick={() => setIsMobileView(true)} 
                className={`py-2 text-xs font-black rounded-lg transition-all ${isMobileView ? 'bg-pink-600 text-white shadow' : 'text-slate-400'}`}>
                📱 موبايل (Mobile)
              </button>
            </div>
          </div>

          {/* اختيار المعلم المراد تعديله */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 block">العنصر النشط للتعديل:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {LANDMARKS_MAP_1.map(l => (
                <button 
                  key={l.id} 
                  onClick={() => setEditorTarget(l.id)} 
                  className={`p-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${editorTarget === l.id ? 'bg-slate-800 border-white text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                  <span>{l.emoji}</span>
                  <span className="truncate">{l.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* نوع التعديل بالماوس */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 block">أداة الرسم التفاعلية بالماوس:</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl">
              <button 
                onClick={() => setEditorMode('center')} 
                className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${editorMode === 'center' ? 'bg-amber-600 text-white shadow' : 'text-slate-400'}`}>
                🎯 تحديد المركز
              </button>
              <button 
                onClick={() => setEditorMode('area')} 
                className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${editorMode === 'area' ? 'bg-purple-600 text-white shadow' : 'text-slate-400'}`}>
                🟩 رسم المساحة
              </button>
            </div>
            <p className="text-[10px] text-slate-400/80 leading-relaxed text-center mt-1">
              {editorMode === 'center' 
                ? '💡 اضغط بالماوس على الخريطة لتغيير نقطة المركز (البين)' 
                : '💡 اضغط واسحب بالماوس لتغطية مساحة الضغط المرغوبة'}
            </p>
          </div>

          {/* أشرطة التحكم الدقيقة بالتصميم */}
          <div className="space-y-4 border-t border-slate-800 pt-4">
            <h3 className="text-xs font-black text-slate-400">🎚️ التحكم الدقيق (Fine-tuning):</h3>
            
            {/* Center X */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">مركز البين X:</span>
                <span className="text-amber-400">{activeCoords[editorTarget]?.centerX}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="0.5" 
                value={activeCoords[editorTarget]?.centerX || 50} 
                onChange={e => updateActiveCoord({ centerX: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg"
              />
            </div>

            {/* Center Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">مركز البين Y:</span>
                <span className="text-amber-400">{activeCoords[editorTarget]?.centerY}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="0.5" 
                value={activeCoords[editorTarget]?.centerY || 50} 
                onChange={e => updateActiveCoord({ centerY: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg"
              />
            </div>

            {/* Area X */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">أفقياً (Box X):</span>
                <span className="text-purple-400">{activeCoords[editorTarget]?.clickArea?.x}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="0.5" 
                value={activeCoords[editorTarget]?.clickArea?.x || 45} 
                onChange={e => updateActiveCoord({ clickArea: { x: parseFloat(e.target.value) } })}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg"
              />
            </div>

            {/* Area Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">عمودياً (Box Y):</span>
                <span className="text-purple-400">{activeCoords[editorTarget]?.clickArea?.y}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="0.5" 
                value={activeCoords[editorTarget]?.clickArea?.y || 45} 
                onChange={e => updateActiveCoord({ clickArea: { y: parseFloat(e.target.value) } })}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg"
              />
            </div>

            {/* Area Width */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">العرض (Box Width):</span>
                <span className="text-purple-400">{activeCoords[editorTarget]?.clickArea?.w}%</span>
              </div>
              <input 
                type="range" min="0.5" max="100" step="0.5" 
                value={activeCoords[editorTarget]?.clickArea?.w || 10} 
                onChange={e => updateActiveCoord({ clickArea: { w: parseFloat(e.target.value) } })}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg"
              />
            </div>

            {/* Area Height */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">الارتفاع (Box Height):</span>
                <span className="text-purple-400">{activeCoords[editorTarget]?.clickArea?.h}%</span>
              </div>
              <input 
                type="range" min="0.5" max="100" step="0.5" 
                value={activeCoords[editorTarget]?.clickArea?.h || 10} 
                onChange={e => updateActiveCoord({ clickArea: { h: parseFloat(e.target.value) } })}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800">
            <button 
              onClick={() => setShowExportModal(true)} 
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-black rounded-xl shadow-lg flex items-center justify-center gap-2">
              📤 تصدير وحفظ الإحداثيات
            </button>
          </div>
        </div>
      )}

      {/* 🗺️ ساحة عرض الخريطة النشطة */}
      <div className="flex-1 relative overflow-hidden h-screen flex flex-col">
        
        {/* 🎯 شريط الهيدر العلوي */}
        <div 
          className="fixed left-0 right-0 z-30 flex items-center justify-between"
          style={{ 
            background: 'linear-gradient(to bottom, rgba(7,9,13,0.95), transparent)', 
            top: '0',
            padding: 'clamp(8px, 1.5vw, 16px) clamp(10px, 2vw, 20px)',
            gap: 'clamp(6px, 1vw, 12px)',
          }}
        >
          {/* اسم البطل */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl"
            style={{ gap: 'clamp(4px, 0.6vw, 8px)', padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)' }}>
            <div className="font-black text-white whitespace-nowrap" style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}>
              👋 {heroName || 'المستكشف الصغير'}
            </div>
          </div>

          {/* مؤشر الخريطة */}
          <div className="flex items-center bg-gradient-to-r from-blue-500/30 to-red-500/30 border border-blue-400/40 rounded-2xl"
            style={{ gap: 'clamp(4px, 0.6vw, 8px)', padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)' }}>
            <MapIcon className="text-blue-300" style={{ width: 'clamp(12px, 1.4vw, 16px)', height: 'clamp(12px, 1.4vw, 16px)' }} />
            <span className="font-black text-white whitespace-nowrap" style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}>
              المجموعة {currentMap}/{TOTAL_MAPS_COUNT} 🇬🇧
            </span>
          </div>

          {/* التقدم / الأزرار */}
          <div className="flex items-center gap-2">
            {!isMobileView && !debugMode && (mapPosition.x !== 0 || mapPosition.y !== 0 || mapScale !== 1) && (
              <button onClick={resetMapView} className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-2xl font-bold text-yellow-400"
                style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)' }}>
                🔄 إعادة تعيين العرض
              </button>
            )}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl"
              style={{ gap: 'clamp(4px, 0.6vw, 8px)', padding: 'clamp(6px, 1vw, 10px) clamp(8px, 1.4vw, 14px)' }}>
              <div className="text-right">
                <div className="text-white/50 font-bold" style={{ fontSize: 'clamp(8px, 0.9vw, 11px)' }}>تقدمك</div>
                <div className="font-black text-[#58CC02] whitespace-nowrap" style={{ fontSize: 'clamp(11px, 1.3vw, 14px)' }}>
                  {LANDMARKS.filter(l => l.lesson < unlockedLessonInMap).length} / {LANDMARKS.length}
                </div>
              </div>
              <div style={{ fontSize: 'clamp(14px, 1.6vw, 20px)' }}>🗺️</div>
            </div>
          </div>
        </div>

        {/* 🗺️ الخريطة التفاعلية */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
          <div 
            ref={mapRef}
            onMouseDown={debugMode ? handleMapMouseDown : (!isMobileView ? handleMouseDown : undefined)}
            onMouseMove={debugMode ? handleMapMouseMove : (!isMobileView ? handleMouseMove : undefined)}
            onMouseUp={debugMode ? handleMapMouseUp : (!isMobileView ? handleMouseUp : undefined)}
            onMouseLeave={!isMobileView ? handleMouseUp : undefined}
            onWheel={!isMobileView && !debugMode ? handleWheel : undefined}
            className="relative select-none"
            style={{
              width: '100%',
              maxWidth: isMobileView ? '450px' : '100%',
              height: isMobileView ? '100%' : 'auto',
              aspectRatio: isMobileView ? 'auto' : '16 / 9',
              cursor: debugMode ? 'crosshair' : (isMobileView ? 'default' : (isDragging ? 'grabbing' : 'grab')),
              transform: isMobileView || debugMode ? 'none' : `scale(${mapScale}) translate(${mapPosition.x / mapScale}px, ${mapPosition.y / mapScale}px)`,
              transformOrigin: 'center center',
              transition: isDragging || debugMode ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            <motion.img 
              key={`map-${currentMap}`}
              src={mapImage}
              alt={`Map ${currentMap}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ objectFit: isMobileView ? 'cover' : 'contain', display: 'block' }}
              draggable={false} 
            />

            {/* 📍 المعالم ومساحات الضغط التفاعلية */}
            {LANDMARKS.map((landmark, index) => {
              if (!landmark.clickArea) return null;
              const locked = isLocked(landmark.lesson);
              const stars = getStars(landmark.id);
              const isEditingThis = debugMode && editorTarget === landmark.id;

              return (
                <div key={landmark.id}>
                  {/* تظليل مساحة الضغط */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: debugMode ? 0.6 : 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLandmarkClick(landmark)}
                    onMouseEnter={() => setHoveredLandmark(landmark)}
                    onMouseLeave={() => setHoveredLandmark(null)}
                    className="absolute border border-dashed rounded-xl transition-all"
                    style={{
                      left: `${landmark.clickArea.x}%`,
                      top: `${landmark.clickArea.y}%`,
                      width: `${landmark.clickArea.w}%`,
                      height: `${landmark.clickArea.h}%`,
                      cursor: locked ? 'not-allowed' : 'pointer',
                      zIndex: isEditingThis ? 21 : 15,
                      borderColor: isEditingThis ? '#FFF' : (debugMode ? landmark.color : 'transparent'),
                      background: isEditingThis ? 'rgba(255,255,255,0.2)' : (debugMode ? `${landmark.color}25` : 'transparent'),
                    }}
                  />

                  {/* النجوم فوق المعلم */}
                  {!locked && stars > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                      className="absolute pointer-events-none flex gap-0.5"
                      style={{
                        left: `${landmark.centerX}%`,
                        top: `${landmark.clickArea.y - 4}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 16,
                      }}
                    >
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={14}
                          fill={s <= stars ? '#FFD700' : 'transparent'}
                          color={s <= stars ? '#FFD700' : 'rgba(255,255,255,0.3)'}
                          strokeWidth={2}
                          style={{ filter: s <= stars ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' : 'none' }}
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* أيقونة القفل */}
                  {locked && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -3, 0] }}
                      transition={{ 
                        scale: { delay: 0.2 + index * 0.05, type: 'spring', stiffness: 200 },
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
                      <div className="relative rounded-full flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-800 border-2 border-amber-400 shadow-lg">
                        <Lock size={12} className="text-white" strokeWidth={2.5} />
                      </div>
                    </motion.div>
                  )}

                  {/* Tooltip التوضيحي عند التحويم */}
                  <AnimatePresence>
                    {(hoveredLandmark?.id === landmark.id || isEditingThis) && !locked && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${landmark.centerX}%`,
                          top: `${landmark.clickArea.y - 8}%`,
                          transform: 'translate(-50%, -100%)',
                          zIndex: 20,
                        }}
                      >
                        <div className="px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-2xl border whitespace-nowrap"
                          style={{
                            background: `${landmark.color}ee`,
                            borderColor: 'rgba(255,255,255,0.3)',
                            boxShadow: `0 4px 20px ${landmark.color}88`,
                          }}>
                          <div className="flex items-center gap-1.5">
                            <span>{landmark.emoji}</span>
                            <span>{landmark.nameAr}</span>
                          </div>
                          <div className="text-white/85 text-[10px] font-bold text-center mt-0.5">{landmark.nameEn}</div>
                        </div>
                        <div className="w-0 h-0 mx-auto"
                          style={{
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: `5px solid ${landmark.color}ee`,
                          }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* 🦁 ليو الأسد القائد لرحلتنا */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ zIndex: 25 }}
              animate={{ left: `${eaglePos.x}%`, top: `${eaglePos.y - 6}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 14, duration: 2 }}
            >
              <motion.div
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src="/english/characters/leo-lion-3d.webp"
                  alt="Leo the Lion"
                  className="w-12 h-12 object-contain"
                  style={{
                    filter: 'drop-shadow(0 4px 10px rgba(255,180,50,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                  }}
                  draggable={false}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 💬 بوب أب الدرس والمعلم */}
      <AnimatePresence>
        {selectedLandmark && !debugMode && (
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
                <p className="text-sm font-bold" style={{ color: selectedLandmark.color }}>{selectedLandmark.nameEn}</p>
              </div>
              <div className="p-6">
                <div className="flex gap-3 bg-white/5 rounded-2xl p-4 mb-5">
                  <img src="/english/characters/leo-lion-3d.webp" alt="Leo" className="w-10 h-10 object-contain flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white/50 mb-1">ليو الأسد يقول:</div>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">&quot;{selectedLandmark.description}&quot;</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3].map(s => (
                    <Star key={s} size={28} 
                      fill={s <= getStars(selectedLandmark.id) ? '#FFD700' : 'transparent'} 
                      color={s <= getStars(selectedLandmark.id) ? '#FFD700' : '#333'} />
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleLandmarkStart}
                  className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedLandmark.color}, ${selectedLandmark.color}99)`, 
                    borderBottom: `4px solid ${selectedLandmark.color}66` 
                  }}>
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

      {/* 💡 رسالة الترحيب والتعليمات السريعة */}
      <AnimatePresence>
        {showIntro && !debugMode && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ delay: 0.5 }}
            className="fixed bottom-4 right-4 z-40 max-w-[260px]">
            <div className="rounded-2xl p-3 shadow-2xl border border-white/10 relative" style={{ background: 'rgba(19,23,34,0.97)' }}>
              <button onClick={() => setShowIntro(false)}
                className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 z-10">
                <X size={12} />
              </button>
              <div className="flex gap-2 items-center pr-5">
                <motion.img src="/english/characters/leo-lion-3d.webp" alt="Leo" className="w-9 h-9 object-contain flex-shrink-0"
                  animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1, repeat: 2 }} />
                <div className="flex-1 text-right">
                  <div className="text-[10px] font-bold text-[#FFD700]">Leo the Lion 🦁</div>
                  <p className="text-[11px] text-white/80 leading-tight font-medium">
                    Hello <strong className="text-white">{heroName || 'صديقي'}</strong>! {isMobileView ? 'اضغط على المعالم لتبدأ' : 'اسحب الخريطة وكبّر بالعجلة 🖱️'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowIntro(false)}
                className="w-full mt-2 py-1.5 rounded-lg font-black text-[11px] text-white"
                style={{ background: 'linear-gradient(135deg, #4CC9F0, #7209B7)' }}>
                Let&apos;s Go! 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📤 نافذة تصدير الكود البرمجي للإحداثيات */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowExportModal(false)}>
            <div className="bg-slate-900 rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-800" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-lg text-white">📤 تصدير الإحداثيات المصممة</h2>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors">
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? 'تم النسخ!' : 'نسخ الكود'}
                  </button>
                  <button onClick={() => setShowExportModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black transition-colors">✕ إغلاق</button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">💡 قم بنسخ هذا الكود واستبدال كتل الإحداثيات (`COORDS_DESKTOP_MAP_1` و `COORDS_MOBILE_MAP_1`) داخل ملف الخريطة.</p>
              <pre className="bg-slate-950 p-4 rounded-2xl overflow-auto text-[11px] flex-1 border border-slate-800 text-green-400 font-mono select-all">{generateExportCode()}</pre>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
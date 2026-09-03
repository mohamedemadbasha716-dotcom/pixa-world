'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, User, ChevronDown, ArrowLeft } from 'lucide-react';

// 🇩🇪 خريطة كل درس ألماني في انهي خريطة
const GERMAN_LESSON_TO_MAP: Record<string, string> = {
  // الخريطة 1
  'german-letter-lesson': 'map-1',
  'german-number-lesson': 'map-1',
  'german-forest': 'map-1',
  'german-family': 'map-1',
  'german-lake-lesson': 'map-1',
  'german-castle-lesson': 'map-1',
  // الخريطة 2
  'german-school': 'map-2',
  'german-house': 'map-2',
  'german-toys': 'map-2',
  'german-food': 'map-2',
  'german-time': 'map-2',
  'german-final-test': 'map-2',
  'german-final': 'map-2',
  'german-daily': 'map-2',
  // الخريطة 3
  'german-frankfurt-lesson': 'map-3',
  'german-body-lesson': 'map-3',
  'german-health-lesson': 'map-3',
  'german-sports-lesson': 'map-3',
  'german-feelings-lesson': 'map-3',
  'german-frank-test': 'map-3',
  // الخريطة 4
  'german-transport-lesson': 'map-4',
  'german-places-lesson': 'map-4',
  'german-shopping-lesson': 'map-4',
  'german-directions-lesson': 'map-4',
  'german-countries-lesson': 'map-4',
  'german-berlin-test': 'map-4',
  // الخريطة 5
  'german-pronouns-lesson': 'map-5',
  'german-verbs-lesson': 'map-5',
  'german-questions-lesson': 'map-5',
  'german-conversation-lesson': 'map-5',
  'german-holidays-lesson': 'map-5',
  'german-final-a1-test': 'map-5',
};

// 🇪🇸 خريطة كل درس إسباني في انهي خريطة
const SPANISH_LESSON_TO_MAP: Record<string, string> = {
  // الخريطة 1
  'spanish-alphabet-lesson': 'map-1',
  'spanish-numbers-lesson': 'map-1',
  'spanish-colors-lesson': 'map-1',
  'spanish-family-lesson': 'map-1',
  'spanish-fruits-lesson': 'map-1',
  'spanish-animals-lesson': 'map-1',
  'spanish-greetings-lesson': 'map-1',
  'spanish-faro-test': 'map-1',
  // الخريطة 2
  'spanish-body-lesson': 'map-2',
  'spanish-clothes-lesson': 'map-2',
  'spanish-food-lesson': 'map-2',
  'spanish-house-lesson': 'map-2',
  'spanish-school-lesson': 'map-2',
  'spanish-feelings-lesson': 'map-2',
  'spanish-games-lesson': 'map-2',
  'spanish-consuegra-test': 'map-2',
  // الخريطة 3
  'spanish-time-lesson': 'map-3',
  'spanish-health-lesson': 'map-3',
  'spanish-sports-lesson': 'map-3',
  'spanish-shopping-lesson': 'map-3',
  'spanish-transport-lesson': 'map-3',
  'spanish-countries-lesson': 'map-3',
  'spanish-art-lesson': 'map-3',
  'spanish-sagrada-test': 'map-3',
  // الخريطة 4
  'spanish-verbs-regular-lesson': 'map-4',
  'spanish-verbs-irregular-lesson': 'map-4',
  'spanish-nature-lesson': 'map-4',
  'spanish-entertainment-lesson': 'map-4',
  'spanish-recipes-lesson': 'map-4',
  'spanish-communication-lesson': 'map-4',
  'spanish-places-lesson': 'map-4',
  'spanish-alhambra-test': 'map-4',
  // الخريطة 5
  'spanish-fiestas-lesson': 'map-5',
  'spanish-vacaciones-lesson': 'map-5',
  'spanish-arte-lesson': 'map-5',
  'spanish-deporte-lesson': 'map-5',
  'spanish-medioambiente-lesson': 'map-5',
  'spanish-hispano-lesson': 'map-5',
  'spanish-lectura-lesson': 'map-5',
  'spanish-palacio-final-test': 'map-5',
};

export default function GlobalReturnFix() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLesson, setIsLesson] = useState(false);
  const [lang, setLang] = useState<'de' | 'es'>('de');
  const [open, setOpen] = useState(false);
  const [currentMapLabel, setCurrentMapLabel] = useState('1');

  useEffect(() => {
    const isGermanLesson = pathname.includes('german-');
    const isSpanishLesson = pathname.includes('spanish-');

    if (isGermanLesson) {
      setIsLesson(true);
      setLang('de');

      for (const [lessonKey, mapId] of Object.entries(GERMAN_LESSON_TO_MAP)) {
        if (pathname.includes(lessonKey)) {
          localStorage.setItem('lastGermanMap', mapId);
          localStorage.setItem('lastGermanMapLesson', lessonKey);
          const num = mapId.replace('map-', '');
          setCurrentMapLabel(num);
          console.log(`💾 [DE] حفظ: ${lessonKey} -> ${mapId}`);
          break;
        }
      }

      const fromMap = searchParams.get('fromMap') || searchParams.get('map');
      if (fromMap) {
        localStorage.setItem('lastGermanMap', fromMap);
        setCurrentMapLabel(fromMap.replace('map-', ''));
      }
    } else if (isSpanishLesson) {
      setIsLesson(true);
      setLang('es');

      for (const [lessonKey, mapId] of Object.entries(SPANISH_LESSON_TO_MAP)) {
        if (pathname.includes(lessonKey)) {
          localStorage.setItem('lastSpanishMap', mapId);
          localStorage.setItem('es_current_map', mapId.replace('map-', ''));
          localStorage.setItem('lastSpanishMapLesson', lessonKey);
          const num = mapId.replace('map-', '');
          setCurrentMapLabel(num);
          console.log(`💾 [ES] حفظ: ${lessonKey} -> ${mapId}`);
          break;
        }
      }

      const fromMap = searchParams.get('fromMap') || searchParams.get('map');
      if (fromMap) {
        localStorage.setItem('lastSpanishMap', fromMap);
        localStorage.setItem('es_current_map', fromMap.replace('map-', ''));
        setCurrentMapLabel(fromMap.replace('map-', ''));
      }
    } else {
      setIsLesson(false);
    }

    // ✅ إذا كنا في صفحة الخريطة للألماني أو الإسباني
    if (pathname.includes('character-and-map')) {
      const isSpanishMap = pathname.includes('spanish-character-and-map');
      const mapFromUrl = searchParams.get('map');
      
      if (mapFromUrl) {
        if (isSpanishMap) {
          localStorage.setItem('lastSpanishMap', mapFromUrl);
          localStorage.setItem('es_current_map', mapFromUrl.replace('map-', ''));
        } else {
          localStorage.setItem('lastGermanMap', mapFromUrl);
        }
        setCurrentMapLabel(mapFromUrl.replace('map-', ''));
      }

      const handleLessonClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a, button, [data-lesson]');
        if (!target) return;
        
        const href = target.getAttribute('href') || '';
        const lessonId = target.getAttribute('data-lesson') || href;
        
        const dictionary = isSpanishMap ? SPANISH_LESSON_TO_MAP : GERMAN_LESSON_TO_MAP;
        const storageKey = isSpanishMap ? 'lastSpanishMap' : 'lastGermanMap';

        for (const [lessonKey, mapId] of Object.entries(dictionary)) {
          if (lessonId.includes(lessonKey) || href.includes(lessonKey)) {
            localStorage.setItem(storageKey, mapId);
            if (isSpanishMap) {
              localStorage.setItem('es_current_map', mapId.replace('map-', ''));
            }
            console.log(`📍 كليك على ${lessonKey} من ${mapId}`);
            break;
          }
        }
      };

      document.addEventListener('click', handleLessonClick, true);
      return () => document.removeEventListener('click', handleLessonClick, true);
    }
  }, [pathname, searchParams]);

  if (!isLesson) return null;

  const getReturnMapUrl = () => {
    const isSpanish = lang === 'es';
    const baseUrl = isSpanish ? '/spanish-character-and-map' : '/character-and-map';
    const storageKey = isSpanish ? 'lastSpanishMap' : 'lastGermanMap';
    const dictionary = isSpanish ? SPANISH_LESSON_TO_MAP : GERMAN_LESSON_TO_MAP;

    // 1- من الـ URL
    const fromMap = searchParams.get('fromMap') || searchParams.get('map');
    if (fromMap) {
      return `${baseUrl}?map=${fromMap}&from=lesson`;
    }
    
    // 2- من localStorage
    if (typeof window !== 'undefined') {
      const lastMap = localStorage.getItem(storageKey);
      if (lastMap) {
        return `${baseUrl}?map=${lastMap}&from=lesson`;
      }
    }
    
    // 3- تخمين من اسم الدرس الحالي
    for (const [lessonKey, mapId] of Object.entries(dictionary)) {
      if (pathname.includes(lessonKey)) {
        return `${baseUrl}?map=${mapId}&from=lesson`;
      }
    }
    
    return `${baseUrl}?from=lesson`;
  };

  const getCharacterSelectionUrl = () => {
    return lang === 'es' 
      ? '/spanish-character-and-map?selectCharacter=true' 
      : '/character-and-map?selectCharacter=true';
  };

  return (
    <>
      {/* ✅ إخفاء كل أزرار الهوم القديمة للألماني والإسباني */}
      <style>{`
        button:has(svg.lucide-home) {
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* ✅ القائمة المنسدلة الموحدة */}
      <div className="fixed top-[75px] left-3 z-[9999] md:top-[80px] md:left-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] md:text-xs text-white bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70 transition-all shadow-lg"
          dir="rtl"
        >
          <ArrowLeft size={12} />
          <span>عودة {currentMapLabel !== '1' ? `(خريطة ${currentMapLabel})` : ''}</span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={10} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 w-64 rounded-xl overflow-hidden bg-[#0f0a2a]/95 backdrop-blur-xl border border-white/15 shadow-2xl"
              dir="rtl"
            >
              <button
                onClick={() => {
                  const url = getReturnMapUrl();
                  console.log('🔙 راجع لـ:', url);
                  router.push(url);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-right hover:bg-white/10 transition-all border-b border-white/10"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Map size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[13px] text-white">خريطة الدرس {currentMapLabel !== '1' ? currentMapLabel : ''}</div>
                  <div className="text-[10px] text-white/50">ارجع لنفس الخريطة {currentMapLabel !== '1' ? `(خريطة ${currentMapLabel})` : ''}</div>
                </div>
              </button>

              <button
                onClick={() => {
                  router.push('/');
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-right hover:bg-white/10 transition-all border-b border-white/10"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Home size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[13px] text-white">الصفحة الرئيسية</div>
                  <div className="text-[10px] text-white/50">القائمة الرئيسية</div>
                </div>
              </button>

              <button
                onClick={() => {
                  router.push(getCharacterSelectionUrl());
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-right hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[13px] text-white">اختيار الشخصية</div>
                  <div className="text-[10px] text-white/50">غير اسمك</div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
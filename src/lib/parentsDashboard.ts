import { supabase } from './supabase';
import { getDeviceId } from './playerData';

export interface LanguageStats {
  langCode: 'de' | 'es';
  langNameAr: string;
  langFlag: string;
  langColor: string;
  totalLessons: number;
  completedLessons: number;
  totalStars: number;
  earnedStars: number;
  progressPercent: number;
  lastLessonName: string;
  lastActivity: string | null;
}

export interface ParentDashboardData {
  isLoggedIn: boolean;
  parentEmail: string | null;
  playerName: string;
  playerType: string;
  totalPoints: number;
  totalStars: number;
  totalCompletedLessons: number;
  streakDays: number;
  languages: LanguageStats[];
  strengths: {
    listening: number;
    speaking: number;
    writing: number;
  };
  weeklyActivity: { day: string; lessons: number }[];
  subscription: {
    planType: string;
    isActive: boolean;
    daysRemaining: number | null;
    expiresAt: string | null;
  };
}

const GERMAN_LESSON_IDS = [
  'hamburg', 'cologne', 'center', 'berlin', 'lake', 'neuschwanstein',
  'heidelberg-school', 'karl-house', 'toys-island', 'munich-market', 'clock-tower', 'adventurer-castle',
  'zeil-street', 'senckenberg-museum', 'charite-hospital', 'allianz-arena', 'palmengarten', 'main-tower',
  'berlin-hauptbahnhof', 'brandenburg-gate-2', 'kudamm-street', 'museum-island', 'embassy-district', 'fernsehturm',
  'heidelberg-uni', 'anna-amalia-library', 'goethe-house', 'semperoper', 'christmas-market', 'goethe-institut',
];

const SPANISH_LESSON_IDS = [
  'es-muniellos-alphabet', 'es-covadonga-numbers', 'es-catedrales-colors', 'es-horreo-family',
  'es-ribera-fruits', 'es-somiedo-animals', 'es-guggenheim-greetings', 'es-faro-test',
  'es-segovia-body', 'es-traje-clothes', 'es-candido-food', 'es-cuenca-house',
  'es-salamanca-school', 'es-greco-feelings', 'es-mayor-games', 'es-consuegra-test',
  'es-portvell-time', 'es-santpau-health', 'es-campnou-sports', 'es-boqueria-shopping',
  'es-metrovalencia-transport', 'es-ciencias-countries', 'es-dali-art', 'es-sagrada-test',
  'es-sevilla-verbs-regular', 'es-merida-verbs-irregular', 'es-donana-nature', 'es-malaga-entertainment',
  'es-triana-recipes', 'es-correos-communication', 'es-mezquita-places', 'es-alhambra-test',
  'es-puertasol-fiestas', 'es-palma-vacaciones', 'es-prado-arte', 'es-bernabeu-deporte',
  'es-teide-medioambiente', 'es-america-hispano', 'es-biblioteca-lectura', 'es-palacio-final-test',
];

export async function getParentDashboardData(): Promise<ParentDashboardData> {
  const deviceId = getDeviceId();
  
  // 1️⃣ التحقق من تسجيل دخول ولي الأمر
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const parentEmail = user?.email || null;

  let playerQuery = supabase.from('players').select('*');
  let progressQuery = supabase.from('lesson_progress').select('*');
  let subscriptionQuery = supabase.from('subscriptions').select('*').eq('is_active', true);

  // 🔑 إذا كان الأب مسجل دخول -> نبحث بـ user_id من أي مكان في العالم
  if (user) {
    playerQuery = playerQuery.eq('user_id', user.id);
    progressQuery = progressQuery.eq('user_id', user.id);
    subscriptionQuery = subscriptionQuery.eq('user_id', user.id);
  } else {
    // إذا لم يكن مسجلاً -> نبحث بـ device_id للجهاز الحالي
    playerQuery = playerQuery.eq('device_id', deviceId);
    progressQuery = progressQuery.eq('device_id', deviceId);
    subscriptionQuery = subscriptionQuery.eq('device_id', deviceId);
  }

  const { data: player } = await playerQuery.limit(1).single();
  const { data: allProgress } = await progressQuery;
  const { data: subscription } = await subscriptionQuery.order('created_at', { ascending: false }).limit(1).single();

  const progressList = allProgress || [];

  const germanProgress = progressList.filter(p => !p.lesson_id.startsWith('es-'));
  const spanishProgress = progressList.filter(p => p.lesson_id.startsWith('es-'));

  const germanCompleted = germanProgress.filter(p => p.completed).length;
  const germanStars = germanProgress.reduce((sum, p) => sum + (p.stars || 0), 0);
  const germanLastLesson = germanProgress
    .filter(p => p.completed)
    .sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())[0];

  const spanishCompleted = spanishProgress.filter(p => p.completed).length;
  const spanishStars = spanishProgress.reduce((sum, p) => sum + (p.stars || 0), 0);
  const spanishLastLesson = spanishProgress
    .filter(p => p.completed)
    .sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime())[0];

  const totalCompleted = germanCompleted + spanishCompleted;
  const totalStars = germanStars + spanishStars;
  const totalPoints = totalStars * 100;

  const completedDates = progressList
    .filter(p => p.completed && p.completed_at)
    .map(p => new Date(p.completed_at!).toDateString());
  const uniqueDates = Array.from(new Set(completedDates)).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = (new Date(uniqueDates[i - 1]).getTime() - new Date(uniqueDates[i]).getTime()) / 86400000;
      if (diff === 1) streak++;
      else break;
    }
  }

  const totalPossibleStars = progressList.length * 3;
  const performanceRatio = totalPossibleStars > 0 ? totalStars / totalPossibleStars : 0;
  const strengths = {
    listening: Math.min(100, Math.round(performanceRatio * 100 + 15)),
    speaking: Math.min(100, Math.round(performanceRatio * 100 + 5)),
    writing: Math.min(100, Math.round(performanceRatio * 100 + 10)),
  };

  const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const weeklyActivity = daysOfWeek.map((day, i) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - i));
    const dateStr = targetDate.toDateString();
    const count = progressList.filter(p => p.completed_at && new Date(p.completed_at).toDateString() === dateStr).length;
    return { day, lessons: count };
  });

  let daysRemaining: number | null = null;
  if (subscription?.expires_at) {
    const expiresAt = new Date(subscription.expires_at);
    const diff = expiresAt.getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return {
    isLoggedIn,
    parentEmail,
    playerName: player?.hero_name || 'بطلنا الصغير',
    playerType: player?.hero_type || 'boy',
    totalPoints,
    totalStars,
    totalCompletedLessons: totalCompleted,
    streakDays: streak,
    languages: [
      {
        langCode: 'de',
        langNameAr: 'الألمانية',
        langFlag: '🇩🇪',
        langColor: '#FFD700',
        totalLessons: GERMAN_LESSON_IDS.length,
        completedLessons: germanCompleted,
        totalStars: GERMAN_LESSON_IDS.length * 3,
        earnedStars: germanStars,
        progressPercent: Math.round((germanCompleted / GERMAN_LESSON_IDS.length) * 100),
        lastLessonName: germanLastLesson?.lesson_id || 'لم يبدأ بعد',
        lastActivity: germanLastLesson?.completed_at || null,
      },
      {
        langCode: 'es',
        langNameAr: 'الإسبانية',
        langFlag: '🇪🇸',
        langColor: '#FF6B35',
        totalLessons: SPANISH_LESSON_IDS.length,
        completedLessons: spanishCompleted,
        totalStars: SPANISH_LESSON_IDS.length * 3,
        earnedStars: spanishStars,
        progressPercent: Math.round((spanishCompleted / SPANISH_LESSON_IDS.length) * 100),
        lastLessonName: spanishLastLesson?.lesson_id || 'لم يبدأ بعد',
        lastActivity: spanishLastLesson?.completed_at || null,
      },
    ],
    strengths,
    weeklyActivity,
    subscription: {
      planType: subscription?.plan_type || 'free',
      isActive: !!subscription?.is_active,
      daysRemaining,
      expiresAt: subscription?.expires_at || null,
    },
  };
}
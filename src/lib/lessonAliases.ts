// 🔗 توحيد معرّفات الدروس
//
// المعرفات القانونية هي التي تقرؤها الخرائط ومنطق الفتح ولوحة ولي الأمر
// (playerData.LESSON_ORDER / ES_LESSON_ORDER). بعض صفحات الدروس كانت تحفظ
// التقدم بمعرفات محتوى مختلفة، فكان تقدم الطفل لا يظهر على الخريطة ولا يفتح
// الدرس التالي. هذه الترجمة تعمل عند الكتابة والقراءة معًا، فتبقى الصفوف
// المحفوظة قديمًا مقروءة، وتُحفظ الصفوف الجديدة بالمعرف القانوني.

export const LESSON_ID_ALIASES: Record<string, string> = {
  // 🇩🇪 الخريطة الألمانية 1
  'german-forest': 'center',
  'german-family': 'berlin',
  // 🇩🇪 الخريطة الألمانية 3 (فرانكفورت)
  'frankfurt-clothes': 'zeil-street',
  'frankfurt-body': 'senckenberg-museum',
  'frankfurt-health': 'charite-hospital',
  'frankfurt-sports': 'allianz-arena',
  'frankfurt-feelings': 'palmengarten',
  'frankfurt-frank-test': 'main-tower',
  // 🇩🇪 الخريطة الألمانية 4 (برلين)
  'berlin-transport': 'berlin-hauptbahnhof',
  'berlin-places': 'brandenburg-gate-2',
  'berlin-shopping': 'kudamm-street',
  'berlin-directions': 'museum-island',
  'berlin-countries': 'embassy-district',
  'berlin-test': 'fernsehturm',
};

export function canonicalLessonId(lessonId: string): string {
  return LESSON_ID_ALIASES[lessonId] ?? lessonId;
}

/** كل المعرفات المخزنة التي تشير لنفس الدرس (القانوني أولًا). */
export function equivalentLessonIds(lessonId: string): string[] {
  const canonical = canonicalLessonId(lessonId);
  const aliases = Object.keys(LESSON_ID_ALIASES).filter(
    (k) => LESSON_ID_ALIASES[k] === canonical
  );
  return [canonical, ...aliases];
}

export interface ProgressRowLike {
  lesson_id: string;
  stars: number;
  completed: boolean;
  completed_at?: string | null;
  updated_at?: string;
}

/**
 * توحيد صفوف التقدم المقروءة: ترجمة المعرفات القديمة إلى القانونية ودمج
 * التكرارات لنفس الدرس (أعلى نجوم، مكتمل إذا أكمله أي صف، وبيانات الموضع
 * من أحدث صف). لا تعدّل قاعدة البيانات، فقط القراءة.
 */
export function normalizeProgressRows<T extends ProgressRowLike>(rows: T[]): T[] {
  const byId = new Map<string, T>();
  for (const row of rows) {
    const canonical = canonicalLessonId(row.lesson_id);
    const existing = byId.get(canonical);
    if (!existing) {
      byId.set(canonical, { ...row, lesson_id: canonical });
      continue;
    }
    const newer = (row.updated_at ?? '') > (existing.updated_at ?? '') ? row : existing;
    byId.set(canonical, {
      ...newer,
      lesson_id: canonical,
      stars: Math.max(existing.stars, row.stars),
      completed: existing.completed || row.completed,
      completed_at: existing.completed_at ?? row.completed_at ?? null,
    });
  }
  return [...byId.values()];
}

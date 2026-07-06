// ═══════════════════════════════════════
// 🌳 Forest Objects - إحداثيات الكلمات على صورة الغابة
// 📍 لمرحلة الـ Test في درس الأبجدية الإسبانية
// ═══════════════════════════════════════

// 🎯 نوع الـ Polygon (مجموعة نقاط لرسم شكل الكلمة على الصورة)
export type Polygon = number[]; // [x1, y1, x2, y2, x3, y3, ...]

// 🎯 نوع الـ Box (مستطيل بسيط)
export type Box = { x: number; y: number; w: number; h: number };

// 🎯 نوع البيانات لكل حرف (مصفوفة من الـ Polygons أو Boxes)
export type LetterShapes = Polygon[] | Box[];

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب (Desktop)
// (placeholder - هتحدد بأداة الفرشاة لاحقاً)
// ═══════════════════════════════════════
export const FOREST_OBJECTS_DESKTOP: Record<string, Polygon[]> = {
  // 🥇 المجموعة الأولى (A-I)
  'A': [], // Árbol - شجرة
  'B': [], // Bosque - غابة
  'C': [], // Conejo - أرنب
  'D': [], // Delfín - دلفين
  'E': [], // Estrella - نجمة
  'F': [], // Flor - وردة
  'G': [], // Gato - قطة
  'H': [], // Hoja - ورقة شجر
  'I': [], // Isla - جزيرة

  // 🥈 المجموعة الثانية (J-Q)
  'J': [], // Jirafa - زرافة
  'K': [], // Koala - كوالا
  'L': [], // León - أسد
  'M': [], // Mariposa - فراشة
  'N': [], // Nube - سحابة
  'Ñ': [], // Niño - طفل ⭐
  'O': [], // Oso - دب
  'P': [], // Pájaro - طائر
  'Q': [], // Queso - جبنة

  // 🥉 المجموعة الثالثة (R-Z)
  'R': [], // Río - نهر
  'S': [], // Sol - شمس
  'T': [], // Tortuga - سلحفاة
  'U': [], // Uva - عنب
  'V': [], // Vaca - بقرة
  'W': [], // Web - موقع إلكتروني
  'X': [], // Xilófono - إكسيلوفون
  'Y': [], // Yate - يخت
  'Z': [], // Zorro - ثعلب
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل (Mobile)
// (placeholder - هتحدد بأداة الفرشاة لاحقاً)
// ═══════════════════════════════════════
export const FOREST_OBJECTS_MOBILE: Record<string, Polygon[]> = {
  // 🥇 المجموعة الأولى (A-I)
  'A': [],
  'B': [],
  'C': [],
  'D': [],
  'E': [],
  'F': [],
  'G': [],
  'H': [],
  'I': [],

  // 🥈 المجموعة الثانية (J-Q)
  'J': [],
  'K': [],
  'L': [],
  'M': [],
  'N': [],
  'Ñ': [],
  'O': [],
  'P': [],
  'Q': [],

  // 🥉 المجموعة الثالثة (R-Z)
  'R': [],
  'S': [],
  'T': [],
  'U': [],
  'V': [],
  'W': [],
  'X': [],
  'Y': [],
  'Z': [],
};

// ═══════════════════════════════════════
// 🖼️ صور الخلفية لمرحلة Test
// ═══════════════════════════════════════
export const FOREST_IMAGE_DESKTOP = '/spanish/card-image/alphabet/bosque-pc.webp';
export const FOREST_IMAGE_MOBILE = '/spanish/card-image/alphabet/bosque-mob.webp';

// ═══════════════════════════════════════
// 🎯 Helper: جلب صورة الخلفية المناسبة
// ═══════════════════════════════════════
export function getForestImage(isMobile: boolean): string {
  return isMobile ? FOREST_IMAGE_MOBILE : FOREST_IMAGE_DESKTOP;
}

// ═══════════════════════════════════════
// 🎯 Helper: جلب إحداثيات الكلمات
// ═══════════════════════════════════════
export function getForestObjects(isMobile: boolean): Record<string, Polygon[]> {
  return isMobile ? FOREST_OBJECTS_MOBILE : FOREST_OBJECTS_DESKTOP;
}

// ═══════════════════════════════════════
// 🎯 Helper: التحقق من تطابق نقطة مع Polygon
// (Ray Casting Algorithm)
// ═══════════════════════════════════════
export function isPointInPolygon(px: number, py: number, polygon: Polygon): boolean {
  let inside = false;
  const len = polygon.length;
  for (let i = 0, j = len - 2; i < len; j = i, i += 2) {
    const xi = polygon[i], yi = polygon[i + 1];
    const xj = polygon[j], yj = polygon[j + 1];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// ═══════════════════════════════════════
// 🎯 Helper: اختبار الضربة (Hit Test)
// يختبر إذا كانت نقطة الضغط ضمن أي من polygons الكلمة
// ═══════════════════════════════════════
export function hitTest(px: number, py: number, shapes: Polygon[]): boolean {
  if (!shapes || shapes.length === 0) {
    // ⚠️ لو مفيش shapes محددة، اعتبره hit صح (مؤقتاً للاختبار)
    return true;
  }
  return shapes.some(polygon => {
    if (Array.isArray(polygon) && polygon.length >= 6) {
      return isPointInPolygon(px, py, polygon);
    }
    return false;
  });
}

// ═══════════════════════════════════════
// 🎯 Helper: تحويل Polygon لـ SVG points
// ═══════════════════════════════════════
export function polygonToSvgPoints(polygon: Polygon): string {
  const points: string[] = [];
  for (let i = 0; i < polygon.length; i += 2) {
    points.push(`${polygon[i]},${polygon[i + 1]}`);
  }
  return points.join(' ');
}
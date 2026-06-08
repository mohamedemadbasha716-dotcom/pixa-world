export type Box = { x: number; y: number; w: number; h: number };

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب (1537x1023)
// ═══════════════════════════════════════
export const HARBOR_OBJECTS_DESKTOP: Record<string, Box[]> = {
  A: [{ x: 16, y: 47, w: 11, h: 22 }],
  B: [{ x: 47, y: 58, w: 23, h: 23 }],
  C: [
    { x: 36, y: 36, w: 18, h: 25 },
    { x: 52, y: 25, w: 25, h: 22 },
  ],
  D: [{ x: 64, y: 48, w: 14, h: 22 }],
  E: [
    { x: 4, y: 70, w: 12, h: 20 },
    { x: 65, y: 78, w: 12, h: 18 },
  ],
  F: [
    { x: 5, y: 67, w: 10, h: 10 },
    { x: 21, y: 78, w: 13, h: 10 },
    { x: 53, y: 78, w: 10, h: 8 },
  ],
  G: [{ x: 22, y: 33, w: 22, h: 30 }],
  H: [{ x: 42, y: 5, w: 9, h: 30 }],
  I: [{ x: 80, y: 22, w: 14, h: 18 }],
  J: [{ x: 4, y: 18, w: 10, h: 28 }],
  K: [{ x: 17, y: 0, w: 30, h: 35 }],
  L: [{ x: 88, y: 4, w: 9, h: 45 }],
  M: [
    { x: 65, y: 0, w: 12, h: 12 },
    { x: 75, y: 5, w: 14, h: 14 },
    { x: 62, y: 56, w: 14, h: 22 },
  ],
  N: [{ x: 16, y: 70, w: 22, h: 22 }],
  O: [{ x: 33, y: 68, w: 22, h: 28 }],
  P: [{ x: 22, y: 53, w: 17, h: 30 }],
  Q: [{ x: 86, y: 60, w: 12, h: 32 }],
  R: [{ x: 11, y: 60, w: 8, h: 32 }],
  S: [{ x: 56, y: 26, w: 32, h: 22 }],
  T: [{ x: 0, y: 50, w: 9, h: 20 }],
  U: [{ x: 1, y: 3, w: 11, h: 17 }],
  V: [{ x: 15, y: 0, w: 7, h: 8 }],
  W: [
    { x: 55, y: 55, w: 35, h: 20 },
    { x: 30, y: 70, w: 30, h: 20 },
    { x: 60, y: 75, w: 25, h: 18 },
  ],
  X: [{ x: 35, y: 88, w: 22, h: 10 }],
  Y: [{ x: 76, y: 47, w: 22, h: 22 }],
  Z: [{ x: 16, y: 27, w: 18, h: 8 }],
};

// ═══════════════════════════════════════
// 📱 إحداثيات الموبايل (768x1376) - مضبوطة بدقة
// ═══════════════════════════════════════
export const HARBOR_OBJECTS_MOBILE: Record<string, Box[]> = {
  M: [
    { x: 3, y: 1, w: 15, h: 7 },
    { x: 60, y: 3, w: 12, h: 6 },
    { x: 70, y: 7, w: 13, h: 6 },
  ],
  K: [{ x: 15, y: 2, w: 38, h: 22 }],
  H: [{ x: 35, y: 6, w: 12, h: 16 }],
  L: [{ x: 70, y: 8, w: 14, h: 22 }],
  Z: [{ x: 0, y: 18, w: 22, h: 8 }],
  C: [
    { x: 38, y: 19, w: 22, h: 16 },
    { x: 45, y: 26, w: 45, h: 8 },
  ],
  G: [{ x: 14, y: 26, w: 18, h: 14 }],
  I: [{ x: 0, y: 12, w: 18, h: 12 }],
  S: [{ x: 42, y: 24, w: 50, h: 13 }],
  Y: [{ x: 55, y: 36, w: 35, h: 14 }],
  D: [{ x: 38, y: 42, w: 16, h: 12 }],
  Q: [{ x: 72, y: 47, w: 16, h: 14 }],
  A: [{ x: 13, y: 49, w: 18, h: 13 }],
  P: [{ x: 18, y: 57, w: 16, h: 13 }],
  B: [{ x: 40, y: 58, w: 32, h: 13 }],
  O: [{ x: 33, y: 66, w: 18, h: 12 }],
  R: [
    { x: 60, y: 63, w: 8, h: 10 },
    { x: 70, y: 88, w: 18, h: 8 },
  ],
  E: [{ x: 5, y: 64, w: 16, h: 12 }],
  N: [{ x: 13, y: 70, w: 22, h: 14 }],
  F: [
    { x: 8, y: 64, w: 12, h: 6 },
    { x: 16, y: 72, w: 14, h: 6 },
    { x: 32, y: 70, w: 12, h: 6 },
  ],
  X: [{ x: 42, y: 75, w: 22, h: 8 }],
  T: [{ x: 40, y: 68, w: 12, h: 10 }],
  U: [{ x: 3, y: 87, w: 20, h: 12 }],
  V: [{ x: 22, y: 83, w: 8, h: 6 }],
  J: [{ x: 30, y: 87, w: 16, h: 12 }],
  W: [
    { x: 30, y: 48, w: 20, h: 8 },
    { x: 50, y: 53, w: 25, h: 8 },
    { x: 8, y: 56, w: 22, h: 6 },
  ],
};

// ═══════════════════════════════════════
// 📐 أبعاد الصور
// ═══════════════════════════════════════
export const HARBOR_IMAGE_DESKTOP = {
  width: 1537,
  height: 1023,
  src: '/images/harbor-hamburg.png',
};

export const HARBOR_IMAGE_MOBILE = {
  width: 768,
  height: 1376,
  src: '/images/Hamburg-mob.jpeg',
};

// ═══════════════════════════════════════
// 🎯 Backward Compatibility (للديسكتوب الافتراضي)
// ═══════════════════════════════════════
export const HARBOR_OBJECTS = HARBOR_OBJECTS_DESKTOP;
export const HARBOR_IMAGE = HARBOR_IMAGE_DESKTOP;

// ═══════════════════════════════════════
// 🆕 دوال جديدة تختار حسب الجهاز
// ═══════════════════════════════════════
export function getHarborImage(isMobile: boolean) {
  return isMobile ? HARBOR_IMAGE_MOBILE : HARBOR_IMAGE_DESKTOP;
}

export function getHarborObjects(isMobile: boolean) {
  return isMobile ? HARBOR_OBJECTS_MOBILE : HARBOR_OBJECTS_DESKTOP;
}
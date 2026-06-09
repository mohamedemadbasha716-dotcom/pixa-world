export type Box = { x: number; y: number; w: number; h: number };
export type Polygon = number[]; // [x1, y1, x2, y2, x3, y3, ...]

// ═══════════════════════════════════════
// 🖥️ إحداثيات الديسكتوب (Box - زي ما هي)
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
// 📱 إحداثيات الموبايل (Polygon - هتظبطها بالفرشاة)
// كل عنصر = polygon من نقاط [x1,y1,x2,y2,...]
// ═══════════════════════════════════════
export const HARBOR_OBJECTS_MOBILE: Record<string, Polygon[]> = {
  A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: [], I: [],
  J: [], K: [], L: [], M: [], N: [], O: [], P: [], Q: [], R: [],
  S: [], T: [], U: [], V: [], W: [], X: [], Y: [], Z: [],
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
// 🎯 Backward Compatibility
// ═══════════════════════════════════════
export const HARBOR_OBJECTS = HARBOR_OBJECTS_DESKTOP;
export const HARBOR_IMAGE = HARBOR_IMAGE_DESKTOP;

export function getHarborImage(isMobile: boolean) {
  return isMobile ? HARBOR_IMAGE_MOBILE : HARBOR_IMAGE_DESKTOP;
}

export function getHarborObjects(isMobile: boolean) {
  return isMobile ? HARBOR_OBJECTS_MOBILE : HARBOR_OBJECTS_DESKTOP;
}

// ═══════════════════════════════════════
// 🎯 Point-in-Polygon Algorithm (Ray Casting)
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
// 🎯 Hit Test - يدعم النوعين
// ═══════════════════════════════════════
export function hitTest(
  pctX: number,
  pctY: number,
  shapes: (Box | Polygon)[]
): boolean {
  return shapes.some(shape => {
    if (Array.isArray(shape)) {
      // Polygon
      return isPointInPolygon(pctX, pctY, shape);
    } else {
      // Box
      return pctX >= shape.x && pctX <= shape.x + shape.w &&
             pctY >= shape.y && pctY <= shape.y + shape.h;
    }
  });
}

// ═══════════════════════════════════════
// 🎯 Get Bounding Box من Polygon (للـ Hint)
// ═══════════════════════════════════════
export function getPolygonBounds(polygon: Polygon): Box {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < polygon.length; i += 2) {
    minX = Math.min(minX, polygon[i]);
    maxX = Math.max(maxX, polygon[i]);
    minY = Math.min(minY, polygon[i + 1]);
    maxY = Math.max(maxY, polygon[i + 1]);
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

// ═══════════════════════════════════════
// 🎯 SVG points string من Polygon
// ═══════════════════════════════════════
export function polygonToSvgPoints(polygon: Polygon): string {
  const points: string[] = [];
  for (let i = 0; i < polygon.length; i += 2) {
    points.push(`${polygon[i]},${polygon[i + 1]}`);
  }
  return points.join(' ');
}
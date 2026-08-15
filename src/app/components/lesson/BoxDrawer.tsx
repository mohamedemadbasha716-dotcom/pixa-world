'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Copy, Trash2, Download } from 'lucide-react';
import type { Polygon, Box } from '@/data/german/forest-objects';
import {
  isPointInPolygon,
  polygonToSvgPoints,
  getPolygonBounds,
} from '@/data/german/forest-objects';
import { FOREST_SECTIONS, type ForestWord } from '@/data/german/forest';

type Mode = 'paint' | 'erase';

interface BoxDrawerProps {
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  existingBoxes?: Record<string, Polygon[]>;
  sectionId?: string;
  onClose?: () => void;
}

const GRID_STEP = 0.5;

// ═══════════════════════════════════════
// 🔧 Mask ⇄ Polygons
// ═══════════════════════════════════════
function polygonsToMask(polys: Polygon[]): Set<string> {
  const mask = new Set<string>();
  if (!polys || polys.length === 0) return mask;
  for (let x = 0; x <= 100; x += GRID_STEP) {
    for (let y = 0; y <= 100; y += GRID_STEP) {
      for (const p of polys) {
        if (isPointInPolygon(x, y, p)) {
          const gx = Math.round(x / GRID_STEP) * GRID_STEP;
          const gy = Math.round(y / GRID_STEP) * GRID_STEP;
          mask.add(`${gx},${gy}`);
          break;
        }
      }
    }
  }
  return mask;
}

function clusterToPolygon(cluster: string[]): Polygon {
  const points = cluster.map(k => { const [x, y] = k.split(',').map(Number); return { x, y }; });
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  const pointSet = new Set(cluster);
  const boundary: { x: number; y: number }[] = [];
  for (const p of points) {
    const neighbors = [
      `${Math.round((p.x - GRID_STEP) * 10) / 10},${p.y}`,
      `${Math.round((p.x + GRID_STEP) * 10) / 10},${p.y}`,
      `${p.x},${Math.round((p.y - GRID_STEP) * 10) / 10}`,
      `${p.x},${Math.round((p.y + GRID_STEP) * 10) / 10}`,
    ];
    if (neighbors.some(n => !pointSet.has(n))) boundary.push(p);
  }
  if (boundary.length < 3) return [];
  boundary.sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  const step = Math.max(1, Math.floor(boundary.length / 40));
  const simplified = boundary.filter((_, i) => i % step === 0);
  const flat: number[] = [];
  for (const p of simplified) {
    flat.push(Math.round(p.x * 100) / 100);
    flat.push(Math.round(p.y * 100) / 100);
  }
  return flat;
}

function maskToPolygons(mask: Set<string>): Polygon[] {
  if (mask.size === 0) return [];
  const visited = new Set<string>();
  const polygons: Polygon[] = [];

  const findConnected = (startKey: string): string[] => {
    const cluster: string[] = [];
    const queue: string[] = [startKey];
    visited.add(startKey);
    while (queue.length > 0) {
      const key = queue.shift()!;
      cluster.push(key);
      const [xs, ys] = key.split(',').map(Number);
      for (let dx = -GRID_STEP; dx <= GRID_STEP; dx += GRID_STEP) {
        for (let dy = -GRID_STEP; dy <= GRID_STEP; dy += GRID_STEP) {
          if (dx === 0 && dy === 0) continue;
          const nx = Math.round((xs + dx) * 10) / 10;
          const ny = Math.round((ys + dy) * 10) / 10;
          const nkey = `${nx},${ny}`;
          if (mask.has(nkey) && !visited.has(nkey)) {
            visited.add(nkey);
            queue.push(nkey);
          }
        }
      }
    }
    return cluster;
  };

  for (const key of mask) {
    if (visited.has(key)) continue;
    const cluster = findConnected(key);
    if (cluster.length < 3) continue;
    const poly = clusterToPolygon(cluster);
    if (poly.length >= 6) polygons.push(poly);
  }
  return polygons;
}

// ═══════════════════════════════════════
// 🎨 Component
// ═══════════════════════════════════════
export default function BoxDrawer({
  imageSrc,
  naturalWidth,
  naturalHeight,
  existingBoxes = {},
  sectionId = 'fruits',
  onClose,
}: BoxDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('paint');
  const [brushSize, setBrushSize] = useState<number>(3);
  const [showAll, setShowAll] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [shapes, setShapes] = useState<Record<string, Polygon[]>>({});
  const [maskPoints, setMaskPoints] = useState<Set<string>>(new Set());

  // كلمات القسم
  const sectionWords: ForestWord[] = useMemo(() => {
    if (sectionId === 'colors') {
      return FOREST_SECTIONS.find(s => s.id === 'colors')?.words ?? [];
    }
    const others = FOREST_SECTIONS.filter(s => s.id !== 'colors');
    return others.flatMap(s => s.words);
  }, [sectionId]);

  const [selectedWord, setSelectedWord] = useState<string>(sectionWords[0]?.word ?? '');
  const currentWordData = sectionWords.find(w => w.word === selectedWord);

  // ✅ تحميل البيانات مرة واحدة فقط عند mount
  const loadedRef = useRef(false);
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setShapes(existingBoxes);
    if (existingBoxes[selectedWord]) {
      setMaskPoints(polygonsToMask(existingBoxes[selectedWord]));
    }
  }, [existingBoxes, selectedWord]);

  // Recompute mask عند تغيير الكلمة (بعد الـ mount الأول)
  useEffect(() => {
    if (!loadedRef.current) return;
    if (shapes[selectedWord]) {
      setMaskPoints(polygonsToMask(shapes[selectedWord]));
    } else {
      setMaskPoints(new Set());
    }
  }, [selectedWord]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    let cx = 0, cy = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      cx = e.touches[0].clientX; cy = e.touches[0].clientY;
    } else {
      cx = (e as React.MouseEvent).clientX; cy = (e as React.MouseEvent).clientY;
    }
    const x = ((cx - rect.left) / rect.width) * 100;
    const y = ((cy - rect.top) / rect.height) * 100;
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  };

  const applyBrushAt = (cx: number, cy: number) => {
    const r = brushSize;
    const startX = Math.max(0, cx - r);
    const endX = Math.min(100, cx + r);
    const startY = Math.max(0, cy - r);
    const endY = Math.min(100, cy + r);
    const next = new Set(maskPoints);
    for (let x = startX; x <= endX; x += GRID_STEP) {
      for (let y = startY; y <= endY; y += GRID_STEP) {
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy <= r * r) {
          const gx = Math.round(x / GRID_STEP) * GRID_STEP;
          const gy = Math.round(y / GRID_STEP) * GRID_STEP;
          const key = `${gx},${gy}`;
          if (mode === 'paint') next.add(key);
          else next.delete(key);
        }
      }
    }
    setMaskPoints(next);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pt = getCoords(e);
    if (!pt) return;
    setIsDrawing(true);
    setCursorPos(pt);
    applyBrushAt(pt.x, pt.y);
  };
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pt = getCoords(e);
    if (!pt) return;
    setCursorPos(pt);
    if (isDrawing) applyBrushAt(pt.x, pt.y);
  };
  const handleEnd = () => setIsDrawing(false);
  const handleLeave = () => { setIsDrawing(false); setCursorPos(null); };

  // Save current mask to shapes
  const saveCurrentWord = () => {
    const polys = maskToPolygons(maskPoints);
    setShapes(prev => ({ ...prev, [selectedWord]: polys }));
    setStatusMsg(`✅ تم حفظ ${polys.length} شكل لـ ${selectedWord}`);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  // Switch word (auto-save current first)
  const switchWord = (newWord: string) => {
    if (selectedWord && maskPoints.size > 0) {
      const polys = maskToPolygons(maskPoints);
      setShapes(prev => ({ ...prev, [selectedWord]: polys }));
    }
    setSelectedWord(newWord);
  };

  const clearCurrent = () => {
    if (!confirm(`مسح تظليل "${selectedWord}"؟`)) return;
    setMaskPoints(new Set());
    setShapes(prev => ({ ...prev, [selectedWord]: [] }));
    setStatusMsg(`🗑️ تم مسح ${selectedWord}`);
    setTimeout(() => setStatusMsg(''), 2000);
  };

  const clearAll = () => {
    if (!confirm('مسح كل الأشكال لكل الكلمات؟')) return;
    setShapes({});
    setMaskPoints(new Set());
    setStatusMsg(`💥 تم مسح الكل`);
    setTimeout(() => setStatusMsg(''), 2000);
  };

  const generateCode = (): string => {
    const finalShapes: Record<string, Polygon[]> = { ...shapes };
    if (maskPoints.size > 0) {
      finalShapes[selectedWord] = maskToPolygons(maskPoints);
    }
    let code = '{\n';
    sectionWords.forEach(w => {
      const polys = finalShapes[w.word] || [];
      const comment = `// ${w.wordAr} ${w.emoji}`;
      const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(w.word) ? w.word : `'${w.word}'`;
      if (polys.length === 0) {
        code += `  ${key}: [], ${comment}\n`;
      } else {
        code += `  ${key}: [ ${comment}\n`;
        polys.forEach(p => { code += `    [${p.join(', ')}],\n`; });
        code += `  ],\n`;
      }
    });
    code += '}\n';
    return code;
  };

  const copyCode = () => {
    saveCurrentWord();
    setTimeout(() => {
      navigator.clipboard.writeText(generateCode());
      setStatusMsg('📋 تم النسخ!');
      setTimeout(() => setStatusMsg(''), 2500);
    }, 50);
  };

  const downloadCode = () => {
    saveCurrentWord();
    setTimeout(() => {
      const blob = new Blob([generateCode()], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sectionId}-polygons.txt`;
      a.click();
    }, 50);
  };

  const totalShapes = Object.values(shapes).reduce((s, arr) => s + arr.length, 0);
  const wordsWithShapes = sectionWords.filter(w => (shapes[w.word] || []).length > 0).length;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-900 text-white flex flex-col"
      style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">

      {/* ═══ Header ═══ */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h1 className="font-black text-lg">أداة الفرشاة - رسم الإحداثيات</h1>
              <p className="text-xs text-gray-400">
                القسم: <span className="text-cyan-400 font-black">{sectionId}</span> •
                {' '}المرسوم: <span className="text-green-400 font-black">{wordsWithShapes}/{sectionWords.length}</span> •
                {' '}الأشكال: <span className="text-yellow-400 font-black">{totalShapes}</span> •
                {' '}النقاط: <span className="text-cyan-400 font-black">{maskPoints.size}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={saveCurrentWord} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-black">💾 حفظ الكلمة</button>
            <button onClick={() => setShowAll(s => !s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${showAll ? 'bg-purple-600' : 'bg-gray-700'}`}>
              {showAll ? '👁️ إخفاء الكل' : '👁️ إظهار الكل'}
            </button>
            <button onClick={clearCurrent} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 rounded-lg text-xs font-black">🗑️ مسح الكلمة</button>
            <button onClick={clearAll} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-black">💥 مسح الكل</button>
            <button onClick={copyCode} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-black flex items-center gap-1">
              <Copy size={12} /> نسخ
            </button>
            <button onClick={downloadCode} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-black flex items-center gap-1">
              <Download size={12} /> تحميل
            </button>
            {onClose && (
              <button onClick={onClose} className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs font-black">✕ إغلاق</button>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Tools ═══ */}
      <div className="bg-gray-800 border-b border-gray-700 p-2">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
            <button onClick={() => setMode('paint')}
              className={`px-3 py-1 rounded text-xs font-black ${mode === 'paint' ? 'bg-green-600' : 'text-gray-400'}`}>
              🖌️ فرشاة
            </button>
            <button onClick={() => setMode('erase')}
              className={`px-3 py-1 rounded text-xs font-black ${mode === 'erase' ? 'bg-red-600' : 'text-gray-400'}`}>
              🧹 ممحاة
            </button>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-black text-gray-300">حجم:</span>
            <input type="range" min="0.5" max="10" step="0.5" value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))} className="w-32" />
            <span className="text-xs font-black text-cyan-400 w-10 text-center">{brushSize.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 5, 8].map(s => (
              <button key={s} onClick={() => setBrushSize(s)}
                className={`w-8 h-8 rounded-lg text-xs font-black ${brushSize === s ? 'bg-cyan-600' : 'bg-gray-700'}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Words Bar ═══ */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {sectionWords.map(w => {
            const count = (shapes[w.word] || []).length;
            const isSelected = selectedWord === w.word;
            return (
              <button key={w.word} onClick={() => switchWord(w.word)}
                className={`relative flex flex-col items-center justify-center rounded-lg px-2.5 py-1.5 min-w-[70px] transition-all border-2 ${isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-gray-500'}`}
                style={{ background: isSelected ? `linear-gradient(135deg, ${w.gradient[0]}, ${w.gradient[1]})` : count > 0 ? '#1F5F4D' : '#374151' }}
                title={`${w.word} - ${w.wordAr}`}>
                <span className="text-lg leading-none">{w.emoji}</span>
                <span className="font-black text-[10px] mt-0.5 leading-none">{w.word}</span>
                <span className="text-[8px] font-bold opacity-90 leading-none mt-0.5">{w.wordAr}</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-gray-900">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {statusMsg && (<div className="bg-blue-600 text-white text-center py-2 font-black text-sm">{statusMsg}</div>)}

      {/* ═══ Current word info ═══ */}
      {currentWordData && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-3xl border-2"
            style={{ background: `linear-gradient(135deg, ${currentWordData.gradient[0]}, ${currentWordData.gradient[1]})`, borderColor: currentWordData.color }}>
            {currentWordData.emoji}
          </div>
          <div className="flex-1">
            <div className="font-black text-base">
              {currentWordData.word} <span className="text-sm text-gray-400">({currentWordData.wordAr})</span>
            </div>
            <div className="text-xs text-gray-400">
              ظلل على العنصر في الصورة بالفرشاة • اضغط "حفظ الكلمة" لحفظ التظليل
            </div>
          </div>
        </div>
      )}

      {/* ═══ Canvas ═══ */}
      <div className="flex-1 p-3 flex justify-center items-start overflow-auto bg-gray-950">
        <div ref={containerRef} className="relative select-none"
          style={{
            maxWidth: naturalHeight > naturalWidth ? '450px' : '95%',
            maxHeight: 'calc(100vh - 280px)',
            aspectRatio: `${naturalWidth} / ${naturalHeight}`,
            cursor: mode === 'paint' ? 'crosshair' : 'not-allowed',
            touchAction: 'none',
          }}
          onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleLeave}
          onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}>

          <img src={imageSrc} alt="target" className="w-full h-full object-contain pointer-events-none" draggable={false} />

          {/* Show other words as light overlays */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {showAll && Object.entries(shapes).map(([word, polys]) => {
              if (word === selectedWord) return null;
              const wd = sectionWords.find(w => w.word === word);
              if (!wd) return null;
              return polys.map((p, i) => (
                <polygon key={`${word}-${i}`} points={polygonToSvgPoints(p)}
                  fill={wd.color} fillOpacity={0.28} stroke={wd.color} strokeWidth={0.3} />
              ));
            })}
          </svg>

          {/* Current word paint */}
          {currentWordData && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Array.from(maskPoints).map((key, i) => {
                const [x, y] = key.split(',').map(Number);
                return (<rect key={i} x={x - GRID_STEP / 2} y={y - GRID_STEP / 2}
                  width={GRID_STEP} height={GRID_STEP} fill={currentWordData.color} fillOpacity={0.5} />);
              })}
            </svg>
          )}

          {/* Brush cursor */}
          {cursorPos && currentWordData && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx={cursorPos.x} cy={cursorPos.y} r={brushSize}
                fill={mode === 'paint' ? currentWordData.color : '#FF4444'} fillOpacity={0.2}
                stroke={mode === 'paint' ? currentWordData.color : '#FF4444'} strokeWidth={0.3} strokeDasharray="0.5,0.5" />
            </svg>
          )}

          {/* Labels */}
          {showAll && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Object.entries(shapes).map(([word, polys]) => {
                if (!polys.length) return null;
                return polys.map((p, i) => {
                  const b = getPolygonBounds(p);
                  return (
                    <text key={`lb-${word}-${i}`} x={b.x + b.w / 2} y={b.y + b.h / 2}
                      fontSize="2.5" fontWeight="900" fill="white" stroke="black" strokeWidth="0.3"
                      textAnchor="middle" dominantBaseline="middle">{word}</text>
                  );
                });
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
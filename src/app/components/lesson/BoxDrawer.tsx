'use client';
import { useState, useRef, useEffect } from 'react';
import { Copy, Trash2, Eye, EyeOff, Download, Square, Plus } from 'lucide-react';

type Box = { x: number; y: number; w: number; h: number };
type NamedBox = { name: string; boxes: Box[] };
type Mode = 'draw' | 'brush';

interface BoxDrawerProps {
  imageSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  existingBoxes?: Record<string, Box[]>;
  onClose?: () => void;
}

export default function BoxDrawer({ 
  imageSrc, 
  naturalWidth, 
  naturalHeight,
  existingBoxes = {},
  onClose 
}: BoxDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const [mode, setMode] = useState<Mode>('draw');
  const [currentName, setCurrentName] = useState<string>('');
  const [namedBoxes, setNamedBoxes] = useState<NamedBox[]>([]);
  const [showExisting, setShowExisting] = useState(true);
  const [brushSize, setBrushSize] = useState(30);
  const [editMode, setEditMode] = useState<'edit' | 'new'>('edit');

  // 🎯 تحميل العناصر الموجودة كنقطة بداية للتعديل
  useEffect(() => {
    if (Object.keys(existingBoxes).length > 0) {
      const initial: NamedBox[] = Object.entries(existingBoxes).map(([name, boxes]) => ({
        name,
        boxes: [...boxes],
      }));
      setNamedBoxes(initial);
      setCurrentName(Object.keys(existingBoxes)[0]);
    }
  }, [existingBoxes]);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  
  const [isBrushing, setIsBrushing] = useState(false);
  const [brushPoints, setBrushPoints] = useState<{ x: number; y: number }[]>([]);
  
  const getRelativePos = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!imgRef.current) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return null;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'draw') return;
    const pos = getRelativePos(e.clientX, e.clientY);
    if (!pos) return;
    setIsDrawing(true);
    setStartPoint(pos);
    setCurrentBox({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === 'draw' && isDrawing && startPoint) {
      const pos = getRelativePos(e.clientX, e.clientY);
      if (!pos) return;
      const x = Math.min(startPoint.x, pos.x);
      const y = Math.min(startPoint.y, pos.y);
      const w = Math.abs(pos.x - startPoint.x);
      const h = Math.abs(pos.y - startPoint.y);
      setCurrentBox({ x, y, w, h });
    } else if (mode === 'brush' && isBrushing) {
      const pos = getRelativePos(e.clientX, e.clientY);
      if (!pos) return;
      setBrushPoints(prev => [...prev, pos]);
    }
  };

  const handleMouseUp = () => {
    if (mode === 'draw' && isDrawing && currentBox && currentBox.w > 0.5 && currentBox.h > 0.5) {
      addBoxToCurrent(currentBox);
    } else if (mode === 'brush' && isBrushing && brushPoints.length > 0) {
      const xs = brushPoints.map(p => p.x);
      const ys = brushPoints.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const box: Box = {
        x: parseFloat(minX.toFixed(1)),
        y: parseFloat(minY.toFixed(1)),
        w: parseFloat((maxX - minX).toFixed(1)),
        h: parseFloat((maxY - minY).toFixed(1)),
      };
      if (box.w > 0.5 && box.h > 0.5) addBoxToCurrent(box);
      setBrushPoints([]);
    }
    setIsDrawing(false);
    setIsBrushing(false);
    setStartPoint(null);
    setCurrentBox(null);
  };

  const handleBrushStart = (e: React.MouseEvent) => {
    if (mode !== 'brush') return;
    const pos = getRelativePos(e.clientX, e.clientY);
    if (!pos) return;
    setIsBrushing(true);
    setBrushPoints([pos]);
  };

  const addBoxToCurrent = (box: Box) => {
    if (!currentName) {
      alert('⚠️ اختر عنصر الأول من القائمة');
      return;
    }
    
    const roundedBox: Box = {
      x: parseFloat(box.x.toFixed(1)),
      y: parseFloat(box.y.toFixed(1)),
      w: parseFloat(box.w.toFixed(1)),
      h: parseFloat(box.h.toFixed(1)),
    };
    
    setNamedBoxes(prev => {
      const existing = prev.find(nb => nb.name === currentName);
      if (existing) {
        return prev.map(nb => 
          nb.name === currentName 
            ? { ...nb, boxes: [...nb.boxes, roundedBox] }
            : nb
        );
      }
      return [...prev, { name: currentName, boxes: [roundedBox] }];
    });
  };

  const removeBox = (name: string, idx: number) => {
    setNamedBoxes(prev => 
      prev.map(nb => 
        nb.name === name 
          ? { ...nb, boxes: nb.boxes.filter((_, i) => i !== idx) }
          : nb
      )
    );
  };

  const clearCurrentBoxes = () => {
    if (!currentName) return;
    if (confirm(`مسح كل صناديق "${currentName}"؟`)) {
      setNamedBoxes(prev => 
        prev.map(nb => 
          nb.name === currentName 
            ? { ...nb, boxes: [] }
            : nb
        )
      );
    }
  };

  const clearAll = () => {
    if (confirm('هل تريد مسح كل الصناديق؟')) {
      setNamedBoxes(prev => prev.map(nb => ({ ...nb, boxes: [] })));
    }
  };

  const generateCode = (): string => {
    let code = '';
    namedBoxes.forEach(({ name, boxes }) => {
      if (boxes.length === 0) return;
      if (boxes.length === 1) {
        const b = boxes[0];
        code += `  ${name}: [{ x: ${b.x}, y: ${b.y}, w: ${b.w}, h: ${b.h} }],\n`;
      } else {
        code += `  ${name}: [\n`;
        boxes.forEach(b => {
          code += `    { x: ${b.x}, y: ${b.y}, w: ${b.w}, h: ${b.h} },\n`;
        });
        code += `  ],\n`;
      }
    });
    return code;
  };

  const copyCode = () => {
    const code = generateCode();
    navigator.clipboard.writeText(code);
    alert('✅ تم نسخ الكود!');
  };

  const downloadCode = () => {
    const code = `// Boxes generated on ${new Date().toLocaleString()}\n{\n${generateCode()}}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boxes.txt';
    a.click();
  };

  const getColorForName = (name: string): string => {
    const colors = ['#FF4D6D', '#4CC9F0', '#FFD700', '#58CC02', '#9D4EDD', '#F72585', '#FF9500', '#00D9FF'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col" dir="ltr">
      <div className="bg-gray-900 border-b border-gray-700 p-3 flex items-center gap-3 flex-wrap">
        <h2 className="text-white font-black text-lg">🎨 Box Drawer Tool</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 ${
              mode === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Square size={14} /> رسم مستطيل
          </button>
          <button
            onClick={() => setMode('brush')}
            className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 ${
              mode === 'brush' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            🖌️ فرشاة
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
          <label className="text-white text-xs font-bold">العنصر:</label>
          <select
            value={currentName}
            onChange={e => {
              if (e.target.value === '__new__') {
                const newName = prompt('اسم العنصر الجديد:');
                if (newName && newName.trim()) {
                  setCurrentName(newName.trim());
                  setNamedBoxes(prev => {
                    if (prev.find(nb => nb.name === newName.trim())) return prev;
                    return [...prev, { name: newName.trim(), boxes: [] }];
                  });
                }
              } else {
                setCurrentName(e.target.value);
              }
            }}
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm w-40 outline-none border border-gray-600 cursor-pointer"
          >
            {namedBoxes.length === 0 && <option value="">-- اختر --</option>}
            {namedBoxes.map(nb => (
              <option key={nb.name} value={nb.name}>
                {nb.name} ({nb.boxes.length})
              </option>
            ))}
            <option value="__new__" style={{ background: '#4CC9F0', color: 'black' }}>
              ➕ إضافة جديد
            </option>
          </select>
        </div>

        {currentName && (
          <button
            onClick={clearCurrentBoxes}
            className="px-3 py-1.5 rounded-lg font-bold text-sm bg-orange-600 text-white flex items-center gap-1.5"
          >
            🗑️ مسح صناديق {currentName}
          </button>
        )}

        {mode === 'brush' && (
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <label className="text-white text-xs font-bold">حجم:</label>
            <input
              type="range" min="10" max="80" value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-white text-xs">{brushSize}px</span>
          </div>
        )}

        <button
          onClick={() => setShowExisting(!showExisting)}
          className="px-3 py-1.5 rounded-lg font-bold text-sm bg-gray-700 text-white flex items-center gap-1.5"
        >
          {showExisting ? <Eye size={14} /> : <EyeOff size={14} />}
          إظهار الكل
        </button>

        <div className="ml-auto flex gap-2">
          <button onClick={copyCode}
            className="px-3 py-1.5 rounded-lg font-bold text-sm bg-green-600 text-white flex items-center gap-1.5">
            <Copy size={14} /> نسخ الكود
          </button>
          <button onClick={downloadCode}
            className="px-3 py-1.5 rounded-lg font-bold text-sm bg-blue-600 text-white flex items-center gap-1.5">
            <Download size={14} /> تحميل
          </button>
          <button onClick={clearAll}
            className="px-3 py-1.5 rounded-lg font-bold text-sm bg-red-600 text-white flex items-center gap-1.5">
            <Trash2 size={14} /> مسح الكل
          </button>
          {onClose && (
            <button onClick={onClose}
              className="px-3 py-1.5 rounded-lg font-bold text-sm bg-gray-600 text-white">
              ✕ إغلاق
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-gray-950">
          <div 
            ref={containerRef}
            className="relative inline-block"
            style={{ cursor: mode === 'draw' ? 'crosshair' : 'none' }}
            onMouseDown={mode === 'draw' ? handleMouseDown : handleBrushStart}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="target"
              className="block max-w-full max-h-[calc(100vh-120px)] select-none"
              draggable={false}
              style={{ userSelect: 'none' }}
            />

            {namedBoxes.map(({ name, boxes }) => {
              const isActive = name === currentName;
              const shouldShow = showExisting || isActive;
              if (!shouldShow) return null;
              
              return boxes.map((b, idx) => (
                <div
                  key={`box-${name}-${idx}`}
                  className="absolute border-2"
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.w}%`,
                    height: `${b.h}%`,
                    borderColor: getColorForName(name),
                    background: isActive ? `${getColorForName(name)}55` : `${getColorForName(name)}20`,
                    boxShadow: isActive ? `0 0 15px ${getColorForName(name)}` : 'none',
                    opacity: isActive ? 1 : 0.5,
                    borderStyle: isActive ? 'solid' : 'dashed',
                  }}
                >
                  <span 
                    className="absolute -top-5 left-0 text-[10px] font-black px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ 
                      background: getColorForName(name), 
                      color: 'white',
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {name} #{idx + 1}
                  </span>
                  {isActive && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBox(name, idx); }}
                      className="absolute -top-5 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ));
            })}

            {currentBox && mode === 'draw' && (
              <div
                className="absolute border-2 border-yellow-400 bg-yellow-400/30 pointer-events-none"
                style={{
                  left: `${currentBox.x}%`,
                  top: `${currentBox.y}%`,
                  width: `${currentBox.w}%`,
                  height: `${currentBox.h}%`,
                }}
              />
            )}

            {mode === 'brush' && brushPoints.map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${brushSize}px`,
                  height: `${brushSize}px`,
                  background: `${getColorForName(currentName || 'x')}66`,
                  border: `2px solid ${getColorForName(currentName || 'x')}`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-black text-sm mb-2">
              📋 العناصر ({namedBoxes.length})
            </h3>
            <div className="text-xs text-gray-400">
              الأبعاد الطبيعية: {naturalWidth} × {naturalHeight}
            </div>
            <div className="text-xs text-yellow-400 mt-1">
              اضغط على أي عنصر عشان تعدله
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {namedBoxes.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                لا توجد عناصر - أضف عنصر جديد
              </p>
            ) : (
              namedBoxes.map(({ name, boxes }) => {
                const isActive = name === currentName;
                return (
                  <div 
                    key={name} 
                    onClick={() => setCurrentName(name)}
                    className={`rounded-lg p-2 cursor-pointer transition-all ${
                      isActive ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-750'
                    }`}
                    style={{
                      borderLeft: isActive ? `4px solid ${getColorForName(name)}` : '4px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ background: getColorForName(name) }}
                      />
                      <span className={`font-bold text-sm flex-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {name}
                      </span>
                      <span className="text-gray-400 text-xs">{boxes.length}</span>
                      {isActive && <span className="text-yellow-400 text-xs">✏️</span>}
                    </div>
                    {boxes.map((b, idx) => (
                      <div key={idx} className="text-[10px] text-gray-300 font-mono flex justify-between">
                        <span>x:{b.x} y:{b.y} w:{b.w} h:{b.h}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeBox(name, idx); }}
                          className="text-red-400 hover:text-red-300"
                        >✕</button>
                      </div>
                    ))}
                    {boxes.length === 0 && (
                      <p className="text-[10px] text-gray-500 italic">لا توجد صناديق - ارسم واحد</p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {namedBoxes.some(nb => nb.boxes.length > 0) && (
            <div className="border-t border-gray-700 p-3">
              <h4 className="text-white font-bold text-xs mb-2">📄 الكود:</h4>
              <pre className="bg-black text-green-400 text-[10px] p-2 rounded max-h-40 overflow-auto font-mono">
                {generateCode()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
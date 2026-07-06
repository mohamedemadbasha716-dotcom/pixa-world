'use client';
import { motion } from 'framer-motion';

interface SpanishCharsKeyboardProps {
  chars: string[];
  onChar: (c: string) => void;
  color: string;
}

// ═══════════════════════════════════════
// 🇪🇸 كل الحروف الخاصة الأسبانية
// ═══════════════════════════════════════
const ALL_SPANISH_SPECIAL_CHARS = [
  // 🥇 الحرف الأهم في الأسبانية
  'ñ', 'Ñ',
  
  // 🔤 حروف العلة مع التشكيل (acentos)
  'á', 'é', 'í', 'ó', 'ú',
  'Á', 'É', 'Í', 'Ó', 'Ú',
  
  // 💧 U مع نقطتين (diéresis) - زي pingüino
  'ü', 'Ü',
  
  // ❓❗ علامات الاستفهام والتعجب المقلوبة
  '¿', '¡',
];

// ═══════════════════════════════════════
// 🔍 استخراج الحروف الخاصة المطلوبة لكلمة معينة
// ═══════════════════════════════════════
export function getRequiredSpanishSpecialChars(word: string): string[] {
  const found = new Set<string>();
  
  for (const char of word) {
    if (ALL_SPANISH_SPECIAL_CHARS.includes(char)) {
      // أضف الحرف الصغير
      found.add(char.toLowerCase());
      
      // أضف الحرف الكبير لو مختلف
      const upper = char.toUpperCase();
      if (upper !== char.toLowerCase() && ALL_SPANISH_SPECIAL_CHARS.includes(upper)) {
        found.add(upper);
      }
    }
  }
  
  // ترتيب منطقي: ñ الأول، بعدين حروف العلة، بعدين علامات الترقيم
  const order = [
    'ñ', 'Ñ',
    'á', 'é', 'í', 'ó', 'ú',
    'Á', 'É', 'Í', 'Ó', 'Ú',
    'ü', 'Ü',
    '¿', '¡',
  ];
  
  return order.filter(c => found.has(c));
}

// ═══════════════════════════════════════
// 🔧 Helper: تطبيع النص الأسباني للمقارنة (تجاهل التشكيل)
// ═══════════════════════════════════════
export function normalizeSpanish(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')                  // فصل الحروف عن التشكيل
    .replace(/[\u0300-\u036f]/g, '')   // حذف التشكيل (acentos)
    .replace(/ñ/g, 'n')                // ñ → n
    .replace(/[¿¡]/g, '')              // حذف علامات الاستفهام/التعجب المقلوبة
    .trim();
}

// ═══════════════════════════════════════
// 🎯 Helper: التحقق من تطابق الكلمة الأسبانية
// ═══════════════════════════════════════
export function isSpanishWordMatch(
  input: string,
  target: string,
  strict: boolean = false
): boolean {
  if (strict) {
    return input.trim().toLowerCase() === target.trim().toLowerCase();
  }
  return normalizeSpanish(input) === normalizeSpanish(target);
}

// ═══════════════════════════════════════
// ⌨️ المكون الرئيسي
// ═══════════════════════════════════════
export default function SpanishCharsKeyboard({ 
  chars, 
  onChar, 
  color 
}: SpanishCharsKeyboardProps) {
  if (chars.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 justify-center flex-wrap"
    >
      {chars.map(c => (
        <motion.button
          key={c}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08, y: -2 }}
          onMouseDown={e => {
            e.preventDefault();
            onChar(c);
          }}
          className="w-12 h-12 rounded-2xl font-black text-2xl border-2 transition-all select-none"
          style={{
            borderColor: color,
            background: `linear-gradient(135deg, ${color}33, ${color}11)`,
            color: 'white',
            boxShadow: `0 4px 16px ${color}55, inset 0 1px 0 ${color}66`,
            textShadow: `0 0 12px ${color}aa`,
            backdropFilter: 'blur(10px)',
          }}
        >
          {c}
        </motion.button>
      ))}
    </motion.div>
  );
}
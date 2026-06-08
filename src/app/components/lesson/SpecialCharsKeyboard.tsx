'use client';
import { motion } from 'framer-motion';

interface SpecialCharsKeyboardProps {
  chars: string[];
  onChar: (c: string) => void;
  color: string;
}

const ALL_SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

export function getRequiredSpecialChars(word: string): string[] {
  const found = new Set<string>();
  for (const char of word) {
    if (ALL_SPECIAL_CHARS.includes(char)) {
      found.add(char.toLowerCase());
      const upper = char.toUpperCase();
      if (upper !== char.toLowerCase()) found.add(upper);
    }
  }
  return Array.from(found);
}

export default function SpecialCharsKeyboard({ chars, onChar, color }: SpecialCharsKeyboardProps) {
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
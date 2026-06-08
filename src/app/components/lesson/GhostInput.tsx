'use client';
import { forwardRef } from 'react';

interface GhostInputProps {
  value: string;
  onChange: (val: string) => void;
  onEnter?: () => void;
  ghostText: string;
  color: string;
  status?: 'idle' | 'correct' | 'wrong';
  fontSize?: string;
  maxLength?: number;
  inputMode?: 'text' | 'numeric';
  direction?: 'ltr' | 'rtl';
  uppercase?: boolean;
  numbersOnly?: boolean;
}

const GhostInput = forwardRef<HTMLInputElement, GhostInputProps>(({
  value,
  onChange,
  onEnter,
  ghostText,
  color,
  status = 'idle',
  fontSize = '1.8rem',
  maxLength,
  inputMode = 'text',
  direction = 'ltr',
  uppercase = false,
  numbersOnly = false,
}, ref) => {
  const borderColor =
    status === 'correct' ? '#22c55e'
    : status === 'wrong' ? '#ef4444'
    : `${color}55`;

  const boxShadow =
    status === 'correct' ? '0 0 30px #22c55e66'
    : status === 'wrong' ? '0 0 30px #ef444466'
    : `inset 0 1px 0 ${color}33, 0 8px 30px ${color}22`;

  return (
    <div
      className="relative w-full rounded-2xl border-2 transition-all overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
        borderColor,
        boxShadow,
      }}
    >
      {/* 👻 الكلمة المرجعية - ثابتة دايماً في الخلفية */}
      <div
        className="absolute inset-0 flex items-center justify-center font-black pointer-events-none select-none"
        style={{
          fontSize,
          color: color,
          opacity: 0.25,
          direction,
          letterSpacing: '0.05em',
          textShadow: `0 0 30px ${color}88`,
          fontFamily: 'inherit',
          paddingBottom: '4px',
        }}
        aria-hidden="true"
      >
        {ghostText}
      </div>

      {/* ✍️ الـ input فوق - شفاف تماماً */}
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={e => {
          let v = e.target.value;
          if (numbersOnly) v = v.replace(/\D/g, '');
          if (uppercase) v = v.toUpperCase();
          onChange(v);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && value && onEnter) onEnter();
        }}
        maxLength={maxLength}
        inputMode={inputMode}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder=""
        className="relative w-full text-center font-black py-5 outline-none border-0 text-white"
        style={{
          fontSize,
          direction,
          background: 'transparent',
          caretColor: color,
          textShadow: `0 2px 8px rgba(0,0,0,0.6), 0 0 15px ${color}66`,
        }}
      />
    </div>
  );
});

GhostInput.displayName = 'GhostInput';

export default GhostInput;
// src/app/components/lesson/GrammarMiniPhase.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Volume2, Sparkles, MessageCircle } from 'lucide-react';
import { speakWord } from '@/lib/audio/speech';
import { playCoinSound, playBuzzSound } from '@/lib/audio/sounds';

// ════════════════════════════════════════
// 🎯 Types
// ════════════════════════════════════════
export interface GrammarChoice {
  de: string;
  ar: string;
  emoji: string;
}

export interface GrammarItem {
  promptAr: string;
  promptDe: string;
  choices: GrammarChoice[];
  correctIndex: number;
  patternAr: string;
}

// 🆕 Dialogue Types
export interface DialogueTurn {
  speaker: 'karl' | 'child';
  textDe: string;
  textAr: string;
  // لو speaker = child → choices
  choices?: GrammarChoice[];
  correctIndex?: number;
}

export interface DialogueItem {
  type: 'dialogue';
  titleAr: string;
  scenario: string; // 🎭 السياق
  turns: DialogueTurn[];
}

// 🆕 Unified Item Type
export type LessonGrammarItem = 
  | { type: 'grammar'; data: GrammarItem }
  | { type: 'dialogue'; data: DialogueItem };

// ════════════════════════════════════════
// Section interface (مرن للدروس المختلفة)
// ════════════════════════════════════════
export interface GrammarSection {
  id: string;
  title: string;
  accentColor: string;
  gradient: string[];
  grammarItems?: GrammarItem[];      // قديم (forest)
  dialogueItems?: DialogueItem[];    // جديد
  // أو unified:
  lessonItems?: LessonGrammarItem[]; // الأحدث
}

// ════════════════════════════════════════
// Props
// ════════════════════════════════════════
type AnswerState = 'idle' | 'correct' | 'wrong';

interface GrammarMiniPhaseProps {
  section: any; // مرن - بياخد ForestSection أو FamilyGroup
  isMobile: boolean;
  onComplete: (correctCount: number) => void;
  onCorrect: (clientX: number, clientY: number) => void;
  onKarlReact: (mood: 'happy' | 'sad' | 'celebrate' | 'idle') => void;
}

// ════════════════════════════════════════
// 🎨 PatternBadge
// ════════════════════════════════════════
function PatternBadge({ text, color, icon = 'sparkles' }: { 
  text: string; 
  color: string;
  icon?: 'sparkles' | 'message';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
      style={{
        background: `${color}22`,
        border: `1px solid ${color}55`,
      }}
    >
      {icon === 'sparkles' ? (
        <Sparkles size={12} style={{ color }} />
      ) : (
        <MessageCircle size={12} style={{ color }} />
      )}
      <span
        className="font-black text-[11px] md:text-xs"
        style={{ color }}
      >
        {text}
      </span>
    </motion.div>
  );
}

// ════════════════════════════════════════
// 🔘 ChoiceButton
// ════════════════════════════════════════
function ChoiceButton({
  choice,
  index,
  state,
  isCorrect,
  showAsCorrectHint,
  disabled,
  accentColor,
  isMobile,
  onClick,
}: {
  choice: GrammarChoice;
  index: number;
  state: AnswerState;
  isCorrect: boolean;
  showAsCorrectHint: boolean;
  disabled: boolean;
  accentColor: string;
  isMobile: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const isSelected = state !== 'idle';
  
  let bgColor = 'rgba(255,255,255,0.06)';
  let borderColor = `${accentColor}44`;
  
  if (isSelected) {
    bgColor = isCorrect ? 'rgba(88,204,2,0.25)' : 'rgba(255,68,68,0.25)';
    borderColor = isCorrect ? '#58CC02' : '#FF4444';
  } else if (showAsCorrectHint) {
    bgColor = 'rgba(88,204,2,0.2)';
    borderColor = '#58CC02';
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300 }}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 rounded-2xl border-2 text-right transition-all"
      style={{
        background: bgColor,
        borderColor,
        padding: isMobile ? '10px 14px' : '14px 20px',
        boxShadow: isSelected && isCorrect
          ? '0 0 20px rgba(88,204,2,0.3)'
          : isSelected && !isCorrect
          ? '0 0 20px rgba(255,68,68,0.3)'
          : showAsCorrectHint
          ? '0 0 15px rgba(88,204,2,0.2)'
          : 'none',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <span
        className="flex-shrink-0"
        style={{ fontSize: isMobile ? '1.4rem' : '1.8rem' }}
      >
        {choice.emoji}
      </span>

      <div className="flex-1 text-right">
        <div
          className="font-black text-white leading-tight"
          style={{
            fontSize: isMobile ? '0.85rem' : '1rem',
            direction: 'ltr',
            textAlign: 'left',
          }}
        >
          {choice.de}
        </div>
        <div
          className="font-bold mt-0.5"
          style={{
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            color: isSelected && isCorrect
              ? '#58CC02'
              : isSelected && !isCorrect
              ? '#FF4444'
              : showAsCorrectHint
              ? '#58CC02'
              : 'rgba(255,255,255,0.5)',
          }}
        >
          {choice.ar}
        </div>
      </div>

      <AnimatePresence>
        {(isSelected || showAsCorrectHint) && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: isCorrect || showAsCorrectHint ? '#58CC02' : '#FF4444',
            }}
          >
            {isCorrect || showAsCorrectHint ? (
              <Check size={14} className="text-white" strokeWidth={3} />
            ) : (
              <X size={14} className="text-white" strokeWidth={3} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ════════════════════════════════════════
// 📝 GrammarQuestionView (للأسئلة العادية)
// ════════════════════════════════════════
function GrammarQuestionView({
  item,
  questionNumber,
  totalQuestions,
  accentColor,
  isMobile,
  onAnswer,
}: {
  item: GrammarItem;
  questionNumber: number;
  totalQuestions: number;
  accentColor: string;
  isMobile: boolean;
  onAnswer: (correct: boolean, clientX: number, clientY: number) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');

  const speakCorrectSentence = () => {
    const correctChoice = item.choices[item.correctIndex];
    speakWord(correctChoice.de);
  };

  const handleChoice = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(index);
    const isCorrect = index === item.correctIndex;
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      playCoinSound();
      speakCorrectSentence();
    } else {
      playBuzzSound();
      setTimeout(() => speakCorrectSentence(), 800);
    }

    setTimeout(() => {
      onAnswer(isCorrect, e.clientX, e.clientY);
    }, 1400);
  };

  return (
    <motion.div
      key={`q-${questionNumber}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="w-full flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <PatternBadge text={item.patternAr} color={accentColor} icon="sparkles" />
        <span className="font-black text-white/50 text-xs">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      <div
        className="rounded-2xl p-4 text-center border"
        style={{
          background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`,
          borderColor: `${accentColor}44`,
        }}
      >
        <p
          className="font-black text-white mb-1"
          style={{ fontSize: isMobile ? '0.95rem' : '1.15rem' }}
        >
          {item.promptAr}
        </p>

        <div className="flex items-center justify-center gap-2 mt-2">
          <div
            className="px-4 py-2 rounded-xl font-black text-white"
            style={{
              background: `${accentColor}33`,
              border: `2px solid ${accentColor}66`,
              fontSize: isMobile ? '1rem' : '1.2rem',
              direction: 'ltr',
            }}
          >
            {item.promptDe}
          </div>

          <button
            onClick={speakCorrectSentence}
            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all active:scale-90"
            style={{
              borderColor: `${accentColor}66`,
              background: `${accentColor}22`,
              color: 'white',
            }}
          >
            <Volume2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {item.choices.map((choice, idx) => {
          const isThisSelected = selectedIndex === idx;
          const isThisCorrect = idx === item.correctIndex;
          const showAsCorrectHint =
            selectedIndex !== null &&
            selectedIndex !== item.correctIndex &&
            idx === item.correctIndex;

          return (
            <ChoiceButton
              key={idx}
              choice={choice}
              index={idx}
              state={isThisSelected ? answerState : 'idle'}
              isCorrect={isThisCorrect}
              showAsCorrectHint={showAsCorrectHint}
              disabled={selectedIndex !== null}
              accentColor={accentColor}
              isMobile={isMobile}
              onClick={(e) => handleChoice(idx, e)}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {answerState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-2 rounded-xl font-black text-sm"
            style={{
              background:
                answerState === 'correct'
                  ? 'rgba(88,204,2,0.2)'
                  : 'rgba(255,68,68,0.2)',
              color: answerState === 'correct' ? '#58CC02' : '#FF4444',
              border: `1px solid ${
                answerState === 'correct' ? '#58CC0255' : '#FF444455'
              }`,
            }}
          >
            {answerState === 'correct' ? (
              <><Check size={16} /> ممتاز! اتعلمت جملة ألمانية 🎉</>
            ) : (
              <><X size={16} /> الإجابة الصحيحة اتلونت باللون الأخضر</>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}// ════════════════════════════════════════
// 💬 DialogueView (للمحادثات)
// ════════════════════════════════════════
function DialogueView({
  item,
  questionNumber,
  totalQuestions,
  accentColor,
  isMobile,
  onAnswer,
}: {
  item: DialogueItem;
  questionNumber: number;
  totalQuestions: number;
  accentColor: string;
  isMobile: boolean;
  onAnswer: (correct: boolean, clientX: number, clientY: number) => void;
}) {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [allCorrect, setAllCorrect] = useState(true);
  const [shownTurns, setShownTurns] = useState<number[]>([0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentTurn = item.turns[currentTurnIdx];
  const isLastTurn = currentTurnIdx === item.turns.length - 1;

  // تشغيل صوت Karl لما يتكلم
  useEffect(() => {
    if (currentTurn?.speaker === 'karl') {
      const t = setTimeout(() => speakWord(currentTurn.textDe), 500);
      return () => clearTimeout(t);
    }
  }, [currentTurnIdx, currentTurn]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [shownTurns]);

  // لو الـ turn الحالي بتاع Karl → عدّي تلقائياً للي بعده
  useEffect(() => {
    if (currentTurn?.speaker === 'karl' && currentTurnIdx < item.turns.length - 1) {
      const t = setTimeout(() => {
        const nextIdx = currentTurnIdx + 1;
        setCurrentTurnIdx(nextIdx);
        setShownTurns(prev => [...prev, nextIdx]);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [currentTurnIdx, currentTurn, item.turns.length]);

  const handleChoice = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (selectedIndex !== null || !currentTurn.choices) return;

    setSelectedIndex(index);
    const isCorrect = index === currentTurn.correctIndex;
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      playCoinSound();
      const correctChoice = currentTurn.choices[currentTurn.correctIndex!];
      speakWord(correctChoice.de);
    } else {
      playBuzzSound();
      setAllCorrect(false);
      const correctChoice = currentTurn.choices[currentTurn.correctIndex!];
      setTimeout(() => speakWord(correctChoice.de), 800);
    }

    setTimeout(() => {
      if (isLastTurn) {
        // خلاص المحادثة
        onAnswer(allCorrect && isCorrect, e.clientX, e.clientY);
      } else {
        // كمّل للمحادثة الجاية
        const nextIdx = currentTurnIdx + 1;
        setCurrentTurnIdx(nextIdx);
        setShownTurns(prev => [...prev, nextIdx]);
        setSelectedIndex(null);
        setAnswerState('idle');
      }
    }, 1800);
  };

  return (
    <motion.div
      key={`dialogue-${questionNumber}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="w-full flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <PatternBadge text={item.titleAr} color={accentColor} icon="message" />
        <span className="font-black text-white/50 text-xs">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Scenario */}
      <div
        className="rounded-2xl p-3 text-center border"
        style={{
          background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`,
          borderColor: `${accentColor}44`,
        }}
      >
        <p
          className="font-bold text-white/80"
          style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
        >
          🎭 {item.scenario}
        </p>
      </div>

      {/* Chat Messages */}
      <div 
        className="flex flex-col gap-2 rounded-2xl p-3"
        style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxHeight: isMobile ? '180px' : '240px',
          overflowY: 'auto',
        }}
      >
        {shownTurns.map((turnIdx) => {
          const turn = item.turns[turnIdx];
          const isKarl = turn.speaker === 'karl';
          
          return (
            <motion.div
              key={`turn-${turnIdx}`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`flex items-end gap-2 ${isKarl ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className="flex-shrink-0 rounded-full flex items-center justify-center border-2"
                style={{
                  width: isMobile ? 28 : 36,
                  height: isMobile ? 28 : 36,
                  background: isKarl 
                    ? `linear-gradient(135deg, #FFD700, #FFA500)`
                    : `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                  borderColor: 'rgba(255,255,255,0.4)',
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                }}
              >
                {isKarl ? '🦅' : '👤'}
              </div>

              {/* Message Bubble */}
              <div
                className="rounded-2xl px-3 py-2 max-w-[75%]"
                style={{
                  background: isKarl
                    ? 'rgba(255,215,0,0.15)'
                    : `${accentColor}22`,
                  border: `1px solid ${isKarl ? 'rgba(255,215,0,0.3)' : `${accentColor}44`}`,
                  borderBottomLeftRadius: isKarl ? '4px' : '16px',
                  borderBottomRightRadius: isKarl ? '16px' : '4px',
                }}
              >
                <p
                  className="font-black text-white leading-tight"
                  style={{
                    fontSize: isMobile ? '0.85rem' : '1rem',
                    direction: 'ltr',
                    textAlign: 'left',
                  }}
                >
                  {turn.textDe}
                </p>
                <p
                  className="font-bold text-white/60 mt-0.5"
                  style={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                >
                  {turn.textAr}
                </p>
                
                {isKarl && (
                  <button
                    onClick={() => speakWord(turn.textDe)}
                    className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <Volume2 size={10} className="text-white/70" />
                    <span className="text-[9px] font-bold text-white/70">استمع</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Choices للطفل */}
      {currentTurn?.speaker === 'child' && currentTurn.choices && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <p className="text-center text-xs font-black text-white/60">
            👇 اختار ردك على Karl
          </p>
          {currentTurn.choices.map((choice, idx) => {
            const isThisSelected = selectedIndex === idx;
            const isThisCorrect = idx === currentTurn.correctIndex;
            const showAsCorrectHint =
              selectedIndex !== null &&
              selectedIndex !== currentTurn.correctIndex &&
              idx === currentTurn.correctIndex;

            return (
              <ChoiceButton
                key={`${currentTurnIdx}-${idx}`}
                choice={choice}
                index={idx}
                state={isThisSelected ? answerState : 'idle'}
                isCorrect={isThisCorrect}
                showAsCorrectHint={showAsCorrectHint}
                disabled={selectedIndex !== null}
                accentColor={accentColor}
                isMobile={isMobile}
                onClick={(e) => handleChoice(idx, e)}
              />
            );
          })}
        </motion.div>
      )}

      {/* لما Karl يتكلم */}
      {currentTurn?.speaker === 'karl' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-white/50"
        >
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⏳ Karl بيتكلم...
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}// ════════════════════════════════════════
// 🎯 GrammarMiniPhase - Main Component
// ════════════════════════════════════════
export default function GrammarMiniPhase({
  section,
  isMobile,
  onComplete,
  onCorrect,
  onKarlReact,
}: GrammarMiniPhaseProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // 🆕 توحيد الـ items من مصادر مختلفة
  const unifiedItems: LessonGrammarItem[] = (() => {
    // لو فيه lessonItems جاهزة → استخدمها مباشرة
    if (section.lessonItems && section.lessonItems.length > 0) {
      return section.lessonItems;
    }
    
    const items: LessonGrammarItem[] = [];
    
    // grammarItems (forest وغيره)
    if (section.grammarItems && section.grammarItems.length > 0) {
      section.grammarItems.forEach((g: GrammarItem) => {
        items.push({ type: 'grammar', data: g });
      });
    }
    
    // dialogueItems (family وغيره)
    if (section.dialogueItems && section.dialogueItems.length > 0) {
      section.dialogueItems.forEach((d: DialogueItem) => {
        items.push({ type: 'dialogue', data: d });
      });
    }
    
    return items;
  })();

  const totalQ = unifiedItems.length;
  const currentItem = unifiedItems[currentQ];

  const handleAnswer = (
    isCorrect: boolean,
    clientX: number,
    clientY: number
  ) => {
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      onKarlReact('happy');
      onCorrect(clientX, clientY);
    } else {
      onKarlReact('sad');
    }

    const nextQ = currentQ + 1;
    if (nextQ >= totalQ) {
      setFinished(true);
      setTimeout(() => {
        onComplete(isCorrect ? correctCount + 1 : correctCount);
      }, 800);
    } else {
      setTimeout(() => {
        setCurrentQ(nextQ);
      }, 1500);
    }
  };

  // Progress bar
  const progress = ((currentQ) / totalQ) * 100;

  // لو مفيش أي items → روح section-success مباشرة
  useEffect(() => {
    if (totalQ === 0) {
      onComplete(0);
    }
  }, [totalQ, onComplete]);

  if (totalQ === 0) return null;

  return (
    <motion.div
      key={`grammar-${section.id || section.groupId}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Glass Card Container */}
      <div
        className="relative rounded-[1.5rem] overflow-hidden"
        style={{
          background: 'rgba(20,15,55,0.65)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '2px solid rgba(255,255,255,0.18)',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${section.accentColor}33`,
        }}
      >
        {/* Top accent glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${section.accentColor}25, transparent 60%)`,
          }}
        />

        <div
          className="relative z-10"
          style={{ padding: isMobile ? '14px' : '20px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${section.accentColor}33` }}
            >
              {currentItem?.type === 'dialogue' ? '💬' : '📝'}
            </div>
            <div className="flex-1">
              <h3
                className="font-black text-white leading-tight"
                style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
              >
                {currentItem?.type === 'dialogue' 
                  ? 'محادثة مع Karl! 🦅' 
                  : 'حان وقت الجمل! 🚀'}
              </h3>
              <p
                className="font-bold text-white/50 leading-none"
                style={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
              >
                {currentItem?.type === 'dialogue'
                  ? 'رد على Karl باللي اتعلمته'
                  : 'استخدم اللي اتعلمته في جملة كاملة'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="w-full rounded-full mb-4 overflow-hidden"
            style={{
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${section.gradient[0]}, ${section.gradient[1]})`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {!finished ? (
              currentItem?.type === 'grammar' ? (
                <GrammarQuestionView
                  key={`grammar-q-${currentQ}`}
                  item={currentItem.data}
                  questionNumber={currentQ + 1}
                  totalQuestions={totalQ}
                  accentColor={section.accentColor}
                  isMobile={isMobile}
                  onAnswer={handleAnswer}
                />
              ) : (
                <DialogueView
                  key={`dialogue-q-${currentQ}`}
                  item={currentItem.data}
                  questionNumber={currentQ + 1}
                  totalQuestions={totalQ}
                  accentColor={section.accentColor}
                  isMobile={isMobile}
                  onAnswer={handleAnswer}
                />
              )
            ) : (
              // Done screen
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                  transition={{ duration: 0.8 }}
                  style={{ fontSize: '3rem' }}
                >
                  {correctCount === totalQ ? '🌟' : correctCount >= totalQ / 2 ? '👍' : '💪'}
                </motion.div>
                <div>
                  <p className="font-black text-white text-lg">
                    {correctCount}/{totalQ} إجابات صح!
                  </p>
                  <p
                    className="font-bold text-sm mt-1"
                    style={{ color: section.accentColor }}
                  >
                    {correctCount === totalQ
                      ? 'مثالي! أنت نجم 🌟'
                      : correctCount >= totalQ / 2
                      ? 'كويس جداً! كمّل 💪'
                      : 'تمام! هتتحسن أكتر 📚'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
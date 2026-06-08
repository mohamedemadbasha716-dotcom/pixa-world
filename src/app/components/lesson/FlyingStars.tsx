'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { type RefObject } from 'react';

export interface FlyingStar {
  id: number;
  x: number;
  y: number;
}

interface FlyingStarsProps {
  stars: FlyingStar[];
  targetRef?: RefObject<HTMLElement | null>;
}

export default function FlyingStars({ stars, targetRef }: FlyingStarsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {stars.map(star => {
          const target = targetRef?.current?.getBoundingClientRect();
          const endX = target
            ? target.left + target.width / 2 - 20
            : star.x - 20;
          const endY = target
            ? target.top + target.height / 2 - 20
            : star.y - 150;

          return (
            <motion.div
              key={star.id}
              initial={{
                x: star.x - 20,
                y: star.y - 20,
                scale: targetRef ? 1.8 : 1.4,
                opacity: 1,
              }}
              animate={{
                x: endX,
                y: endY,
                scale: targetRef ? 0.4 : 0.2,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: targetRef ? 0.75 : 0.9,
                ease: [0.3, 0.7, 0.4, 1],
              }}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <polygon
                  points="20,2 24.9,14.5 38.5,14.5 27.8,22.3 31.7,35.5 20,27.5 8.3,35.5 12.2,22.3 1.5,14.5 15.1,14.5"
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
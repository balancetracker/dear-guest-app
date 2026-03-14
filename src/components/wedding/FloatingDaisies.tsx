import React from 'react';
import { motion } from 'framer-motion';

const daisies = [
  { emoji: '🌼', x: '5%', y: '15%', size: 28, delay: 0 },
  { emoji: '🌸', x: '92%', y: '25%', size: 22, delay: 0.5 },
  { emoji: '🌺', x: '8%', y: '45%', size: 20, delay: 1 },
  { emoji: '✨', x: '88%', y: '55%', size: 18, delay: 1.5 },
  { emoji: '🌼', x: '15%', y: '70%', size: 24, delay: 2 },
  { emoji: '🌷', x: '85%', y: '80%', size: 20, delay: 2.5 },
  { emoji: '💐', x: '50%', y: '90%', size: 18, delay: 3 },
  { emoji: '🌸', x: '30%', y: '10%', size: 16, delay: 0.8 },
  { emoji: '✨', x: '70%', y: '35%', size: 14, delay: 1.2 },
  { emoji: '🌼', x: '45%', y: '60%', size: 20, delay: 1.8 },
  { emoji: '🌺', x: '75%', y: '12%', size: 18, delay: 0.3 },
  { emoji: '✨', x: '20%', y: '88%', size: 16, delay: 2.2 },
];

export default function FloatingDaisies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {daisies.map((d, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            left: d.x,
            top: d.y,
            fontSize: `${d.size}px`,
          }}
          animate={{
            y: [0, -12, 0, 8, 0],
            x: [0, 6, -6, 0],
            rotate: [0, 15, -10, 5, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut',
          }}
        >
          {d.emoji}
        </motion.span>
      ))}
    </div>
  );
}

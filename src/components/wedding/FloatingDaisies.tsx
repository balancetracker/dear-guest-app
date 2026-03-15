import React from 'react';
import { motion } from 'framer-motion';

const daisies = [
  { emoji: '✦', x: '8%', y: '20%', size: 12, delay: 0 },
  { emoji: '✧', x: '90%', y: '30%', size: 10, delay: 1 },
  { emoji: '✦', x: '12%', y: '55%', size: 10, delay: 2 },
  { emoji: '✧', x: '85%', y: '65%', size: 12, delay: 1.5 },
  { emoji: '✦', x: '50%', y: '85%', size: 8, delay: 3 },
  { emoji: '✧', x: '25%', y: '10%', size: 8, delay: 0.5 },
];

export default function FloatingDaisies() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {daisies.map((d, i) => (
        <motion.span
          key={i}
          className="absolute text-gold-light/30"
          style={{ left: d.x, top: d.y, fontSize: `${d.size}px` }}
          animate={{
            y: [0, -8, 0, 5, 0],
            rotate: [0, 10, -5, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 7 + Math.random() * 3,
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

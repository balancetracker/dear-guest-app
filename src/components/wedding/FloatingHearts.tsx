import React, { useEffect, useState } from 'react';

const CUTE_HEARTS = ['💗', '💕', '💖', '🤍', '♡', '🩷', '🩵'];

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; bottom: number; emoji: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => {
        const next = [...prev, {
          id: Date.now(),
          left: 10 + Math.random() * 80,
          bottom: Math.random() * 15,
          emoji: CUTE_HEARTS[Math.floor(Math.random() * CUTE_HEARTS.length)],
        }];
        if (next.length > 8) next.shift();
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {hearts.map(h => (
        <span
          key={h.id}
          className="absolute animate-float-up"
          style={{
            left: `${h.left}%`,
            bottom: `${h.bottom}%`,
            fontSize: `${16 + Math.random() * 8}px`,
            opacity: 0.5,
            filter: 'drop-shadow(0 0 6px hsl(var(--blush) / 0.4))',
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';

const CUTE_EMOJIS = ['💕', '🦋', '🌷', '💐', '🕊️', '💍', '🎀', '🌹', '✨', '💗', '🌺', '🤍'];

interface EmojiDrop {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function CuteEmojiRain() {
  const [drops, setDrops] = useState<EmojiDrop[]>([]);

  useEffect(() => {
    setDrops(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: CUTE_EMOJIS[i % CUTE_EMOJIS.length],
      left: 5 + Math.random() * 90,
      delay: Math.random() * 18,
      duration: 14 + Math.random() * 10,
      size: 14 + Math.random() * 10,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {drops.map(d => (
        <span
          key={d.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${d.left}%`,
            top: '-30px',
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            fontSize: `${d.size}px`,
            opacity: 0.45,
            filter: 'drop-shadow(0 0 4px hsl(var(--gold) / 0.3))',
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; bottom: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => {
        const next = [...prev, { id: Date.now(), left: 20 + Math.random() * 60, bottom: Math.random() * 20 }];
        if (next.length > 15) next.shift();
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {hearts.map(h => (
        <span
          key={h.id}
          className="absolute animate-float-up text-primary"
          style={{ left: `${h.left}%`, bottom: `${h.bottom}%`, fontSize: '20px' }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

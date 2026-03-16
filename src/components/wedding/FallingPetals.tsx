import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Reduced count for performance
    setPetals(Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 12 + Math.random() * 10,
      size: 12 + Math.random() * 8,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map(p => (
        <span
          key={p.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
            top: '-20px',
            opacity: 0.4,
            filter: 'saturate(0.6)',
          }}
        >
          {['🌸', '🌺', '🏵️', '💮', '🌷'][p.id % 5]}
        </span>
      ))}
    </div>
  );
}

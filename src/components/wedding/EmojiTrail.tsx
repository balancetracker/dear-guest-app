import React, { useEffect, useRef, useCallback } from 'react';

const TRAIL_EMOJIS = ['💗', '✨', '🌸', '💕', '🦋', '🌷', '💖', '🤍', '🎀', '🌺'];

interface TrailParticle {
  x: number;
  y: number;
  emoji: string;
  id: number;
  opacity: number;
  scale: number;
  vx: number;
  vy: number;
}

export default function EmojiTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<TrailParticle[]>([]);
  const frameRef = useRef<number>(0);
  const counterRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const throttleRef = useRef(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - throttleRef.current < 80) return;
    throttleRef.current = now;

    const dx = x - lastPosRef.current.x;
    const dy = y - lastPosRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 12) return;

    lastPosRef.current = { x, y };
    counterRef.current++;

    particlesRef.current.push({
      x,
      y,
      emoji: TRAIL_EMOJIS[counterRef.current % TRAIL_EMOJIS.length],
      id: counterRef.current,
      opacity: 0.8,
      scale: 0.6 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 2,
    });

    if (particlesRef.current.length > 15) {
      particlesRef.current.shift();
    }
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => spawnParticle(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) spawnParticle(t.clientX, t.clientY);
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [spawnParticle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const particles = particlesRef.current;

      particles.forEach(p => {
        p.opacity -= 0.02;
        p.scale *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
      });

      particlesRef.current = particles.filter(p => p.opacity > 0);

      // Update DOM
      const children = container.children;
      // Remove extra
      while (children.length > particlesRef.current.length) {
        container.removeChild(container.lastChild!);
      }
      // Add missing
      while (children.length < particlesRef.current.length) {
        const span = document.createElement('span');
        span.className = 'fixed pointer-events-none z-50';
        span.style.transition = 'none';
        container.appendChild(span);
      }
      // Update
      particlesRef.current.forEach((p, i) => {
        const el = children[i] as HTMLElement;
        el.textContent = p.emoji;
        el.style.left = `${p.x}px`;
        el.style.top = `${p.y}px`;
        el.style.opacity = String(p.opacity);
        el.style.transform = `translate(-50%, -50%) scale(${p.scale})`;
        el.style.fontSize = '18px';
        el.style.filter = 'drop-shadow(0 0 4px hsl(345 45% 72% / 0.4))';
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" />;
}

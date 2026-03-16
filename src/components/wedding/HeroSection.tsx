import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import heroBg from '@/assets/hero-bg.jpg';

const spring = { type: "spring" as const, duration: 1, bounce: 0.05 };

interface HeroPetal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function HeroPetals() {
  const [petals, setPetals] = useState<HeroPetal[]>([]);

  useEffect(() => {
    setPetals(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 8,
      size: 14 + Math.random() * 10,
    })));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute animate-petal-fall"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
            top: '-20px',
            opacity: 0.5,
            filter: 'saturate(0.7)',
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const { lang } = useLanguage();
  const { settings } = useWeddingData();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.38]);

  const names = lang === 'km' ? settings.coupleNamesKm : settings.coupleNames;
  const date = lang === 'km' ? settings.weddingDateKm : settings.weddingDate;
  const bgImage = settings.heroImage || heroBg;

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY, scale: bgScale }}>
        <img src={bgImage} alt="Wedding hero background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-background/45 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--ivory)/0.55),transparent_34%),radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.18),transparent_24%)]" />
      </motion.div>

      <HeroPetals />

      <motion.div
        className="absolute top-[18%] left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-gold-light/15 blur-[110px] pointer-events-none"
        style={{ y: glowY }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[18%] h-[13rem] w-[13rem] rounded-full bg-primary/15 blur-[90px] pointer-events-none"
        style={{ y: glowY }}
      />

      <motion.div className="relative z-10 max-w-lg px-6 sm:px-8" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.p
          className={`mb-8 text-xs uppercase tracking-[0.35em] text-muted-foreground/80 ${lang === 'km' ? 'font-khmer text-sm' : 'font-sans'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          {lang === 'km' ? 'ពិធីមង្គលការ' : 'The Wedding of'}
        </motion.p>

        <motion.h1
          className={`${lang === 'km' ? 'text-4xl sm:text-5xl font-khmer leading-tight' : 'text-5xl sm:text-6xl md:text-7xl font-display'} mb-4 font-bold text-foreground`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.5 }}
        >
          {names}
        </motion.h1>

        <motion.div
          className="my-6 flex items-center justify-center gap-4"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ ...spring, delay: 0.7 }}
        >
          <div className="hero-line flex-1 max-w-[72px]" />
          <span className="animate-gentle-float text-lg text-gold">✦</span>
          <div className="hero-line flex-1 max-w-[72px]" />
        </motion.div>

        <motion.p
          className={`${lang === 'km' ? 'text-base font-khmer' : 'font-display text-lg italic'} text-muted-foreground`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.9 }}
        >
          {date}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: 1.2 }}
        >
          <motion.div
            className="glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm text-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="animate-sparkle text-gold">✨</span>
            <span className={lang === 'km' ? 'font-khmer' : 'font-display italic'}>
              {lang === 'km' ? 'រំកិលចុះក្រោម' : 'Scroll to explore'}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

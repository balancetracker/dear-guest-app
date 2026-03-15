import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();

  const names = lang === 'km' ? settings.coupleNamesKm : settings.coupleNames;
  const date = lang === 'km' ? settings.weddingDateKm : settings.weddingDate;
  const bgImage = settings.heroImage || heroBg;

  return (
    <motion.section
      className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Contained petals */}
      <HeroPetals />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold-light/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-lg">
        <motion.p
          className={`text-muted-foreground/80 text-xs tracking-[0.35em] uppercase mb-8 ${lang === 'km' ? 'font-khmer text-sm' : 'font-sans'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          {lang === 'km' ? 'ពិធីមង្គលការ' : 'The Wedding of'}
        </motion.p>

        <motion.h1
          className={`${lang === 'km' ? 'text-4xl sm:text-5xl font-khmer leading-tight' : 'text-5xl sm:text-6xl md:text-7xl font-display'} font-bold text-foreground mb-4`}
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
          <div className="section-divider flex-1 max-w-[60px]" />
          <span className="text-gold text-lg animate-gentle-float">✦</span>
          <div className="section-divider flex-1 max-w-[60px]" />
        </motion.div>

        <motion.p
          className={`${lang === 'km' ? 'text-base font-khmer' : 'text-lg font-display italic'} text-muted-foreground`}
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
            className="inline-flex items-center gap-2 glass-strong rounded-full px-5 py-2 text-sm text-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="animate-sparkle text-gold">✨</span>
            <span className={lang === 'km' ? 'font-khmer' : 'font-display italic'}>
              {lang === 'km' ? 'រំកិលចុះក្រោម' : 'Scroll to explore'}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import heroBg from '@/assets/hero-bg.jpg';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function HeroSection() {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();

  const names = lang === 'km' ? settings.coupleNamesKm : settings.coupleNames;
  const date = lang === 'km' ? settings.weddingDateKm : settings.weddingDate;
  const bgImage = settings.heroImage || heroBg;

  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
      </div>

      <div className="relative z-10 px-6 max-w-lg">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <p className={`text-muted-foreground text-sm tracking-widest uppercase mb-4 ${lang === 'km' ? 'font-khmer' : 'font-sans'}`}>
            {lang === 'km' ? 'ពិធីមង្គលការ' : 'We are getting married'}
          </p>
        </motion.div>

        <motion.h1
          className={`text-5xl md:text-7xl font-semibold text-foreground mb-4 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          {names}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...spring, delay: 0.6 }}
          className="my-6"
        >
          <img src={divider} alt="" className="w-48 mx-auto opacity-70" />
        </motion.div>

        <motion.p
          className={`text-lg text-muted-foreground ${lang === 'km' ? 'font-khmer' : 'font-sans'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.8 }}
        >
          {date}
        </motion.p>

        <motion.div
          className="mt-8 text-4xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 1 }}
        >
          <span className="animate-sparkle inline-block">💍</span>
        </motion.div>
      </div>
    </motion.section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import floralCorner from '@/assets/floral-corner.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

interface Props { guestName: string; }

export default function GreetingSection({ guestName }: Props) {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();
  const desc = lang === 'km' ? settings.weddingDescriptionKm : settings.weddingDescription;

  return (
    <motion.section
      className="relative py-24 flex items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={spring}
    >
      <img src={floralCorner} alt="" className="absolute top-0 right-0 w-28 opacity-40 scale-x-[-1] pointer-events-none" />

      <div className="max-w-md px-6">
        <motion.div
          className="glass-card rounded-3xl p-8"
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={spring}
        >
          <p className={`text-lg text-muted-foreground ${lang === 'km' ? 'font-khmer' : 'font-sans'}`}>
            {t('greeting.dear')}
          </p>
          <h2 className={`text-4xl md:text-5xl font-semibold text-foreground mt-2 mb-6 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
            {guestName || t('greeting.guest')}
          </h2>
          <p className={`text-foreground/80 leading-relaxed ${lang === 'km' ? 'font-khmer' : 'font-sans'}`}>
            {desc || t('greeting.message')}
          </p>
          <div className="mt-6 text-3xl">💐</div>
        </motion.div>
      </div>
    </motion.section>
  );
}

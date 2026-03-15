import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.1 };

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  return (
    <motion.button
      onClick={() => setLang(lang === 'en' ? 'km' : 'en')}
      className="fixed top-4 right-4 z-40 backdrop-blur-sm text-foreground rounded-full px-4 py-2 text-sm shadow-surface border border-border font-khmer bg-secondary"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}>
      
      {t('lang.switch')}
    </motion.button>);

}
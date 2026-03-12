import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import { toast } from 'sonner';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function GiftSection() {
  const { t, lang } = useLanguage();
  const { bankName, bankAccount, bankQR } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(bankAccount).then(() => {
      setCopied(true);
      toast.success(t('gift.copied'));
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.section
      className="py-24 px-6 bg-card/50"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-md mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('gift.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <motion.div
          className="glass-card rounded-3xl p-8 mb-6"
          whileHover={{ scale: 1.01 }}
        >
          <div className="text-4xl mb-4">🎁</div>
          
          {bankQR && (
            <div className="mb-6">
              <img src={bankQR} alt="Bank QR Code" className="w-56 h-56 object-contain mx-auto rounded-2xl shadow-surface" />
            </div>
          )}

          <p className={`text-sm text-muted-foreground mb-1 ${fontClass}`}>{t('gift.bank')}</p>
          <p className="text-xl font-semibold text-foreground">{bankName}</p>
          <div className="mt-3 bg-background/50 rounded-xl py-3 px-4 inline-block">
            <p className="text-2xl font-display font-bold text-foreground tracking-wider">{bankAccount}</p>
          </div>
        </motion.div>

        <motion.button
          onClick={copyAccount}
          className={`bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display shadow-surface ${fontClass}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {copied ? `✅ ${t('gift.copied')}` : `📋 ${t('gift.copy')}`}
        </motion.button>
      </div>
    </motion.section>
  );
}

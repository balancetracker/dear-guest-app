import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function WishesSection() {
  const { t, lang } = useLanguage();
  const { wishes, addWish } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    addWish(name.trim(), message.trim());
    setName('');
    setMessage('');
  };

  return (
    <motion.section
      className="py-24 px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('wishes.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        {/* Wish form */}
        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('wishes.name')}
            maxLength={100}
            className={`w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 ${fontClass}`}
          />
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t('wishes.placeholder')}
            maxLength={500}
            rows={3}
            className={`w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none ${fontClass}`}
          />
          <motion.button
            type="submit"
            className={`bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display shadow-surface ${fontClass}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            💌 {t('wishes.send')}
          </motion.button>
        </form>

        {/* Wishes display */}
        <div className="grid gap-4 sm:grid-cols-2">
          {wishes.map((w, i) => (
            <motion.div
              key={w.id}
              className="bg-card rounded-2xl p-5 shadow-surface border border-border text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.1 }}
            >
              <p className={`text-foreground mb-2 ${fontClass}`}>{w.message}</p>
              <p className={`text-sm text-muted-foreground ${fontClass}`}>— {w.guestName}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

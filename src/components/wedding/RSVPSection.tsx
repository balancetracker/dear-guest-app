import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

interface Props { guestName: string; }

export default function RSVPSection({ guestName }: Props) {
  const { t, lang } = useLanguage();
  const { updateRSVP } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';
  const [attending, setAttending] = useState<boolean | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) return;
    updateRSVP(guestName || 'Guest', attending ? 'attending' : 'not_attending', numGuests);
    setSubmitted(true);
    if (attending) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#F4C2C2', '#E0B4A5', '#FFFDD0', '#D4A574', '#FFB6C1'],
      });
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6, x: 0.3 }, colors: ['#F4C2C2', '#FFFDD0'] });
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6, x: 0.7 }, colors: ['#E0B4A5', '#D4A574'] });
      }, 300);
    }
  };

  if (submitted) {
    return (
      <motion.section
        className="py-24 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="glass-card rounded-3xl p-10 max-w-md mx-auto"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={spring}
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 className={`text-2xl font-semibold text-foreground ${fontClass}`}>{t('rsvp.success')}</h2>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="py-24 px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-md mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('rsvp.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <motion.button
              type="button"
              onClick={() => setAttending(true)}
              className={`w-full p-5 rounded-2xl transition-all ${attending === true ? 'glass-strong ring-2 ring-ring shadow-lg scale-[1.02]' : 'glass-card hover:shadow-md'}`}
              whileTap={{ scale: 0.98 }}
            >
              <span className={`text-lg ${fontClass}`}>✅ {t('rsvp.attending')}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setAttending(false)}
              className={`w-full p-5 rounded-2xl transition-all ${attending === false ? 'glass-strong ring-2 ring-ring shadow-lg scale-[1.02]' : 'glass-card hover:shadow-md'}`}
              whileTap={{ scale: 0.98 }}
            >
              <span className={`text-lg ${fontClass}`}>😔 {t('rsvp.not_attending')}</span>
            </motion.button>
          </div>

          {attending && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <label className={`block text-sm text-muted-foreground mb-2 ${fontClass}`}>{t('rsvp.guests')}</label>
              <select
                value={numGuests}
                onChange={e => setNumGuests(Number(e.target.value))}
                className="w-full min-h-[48px] rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 text-foreground focus:ring-2 focus:ring-ring"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={attending === null}
            className={`w-full bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display text-lg shadow-surface disabled:opacity-50 ${fontClass}`}
            whileHover={{ scale: attending !== null ? 1.03 : 1 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('rsvp.submit')}
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

function useCountdown(dateStr: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(dateStr).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dateStr]);
  return time;
}

export default function DetailsSection() {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();
  const countdown = useCountdown(settings.weddingDateTime);
  const fontClass = lang === 'km' ? 'font-khmer' : '';

  const dateDisplay = lang === 'km' ? settings.weddingDateKm : settings.weddingDate;
  const timeDisplay = lang === 'km' ? settings.weddingTimeKm : settings.weddingTime;
  const venueDisplay = lang === 'km' ? settings.venueNameKm : settings.venueName;

  return (
    <motion.section
      className="py-24 px-6 bg-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-lg mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('details.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <div className="grid grid-cols-1 gap-6 mb-10">
          <div className="bg-background rounded-2xl p-6 shadow-surface border border-border">
            <p className={`text-sm text-muted-foreground ${fontClass}`}>{t('details.date')}</p>
            <p className={`text-lg font-semibold text-foreground ${fontClass}`}>{dateDisplay}</p>
          </div>
          <div className="bg-background rounded-2xl p-6 shadow-surface border border-border">
            <p className={`text-sm text-muted-foreground ${fontClass}`}>{t('details.time')}</p>
            <p className={`text-lg font-semibold text-foreground ${fontClass}`}>{timeDisplay}</p>
          </div>
          <div className="bg-background rounded-2xl p-6 shadow-surface border border-border">
            <p className={`text-sm text-muted-foreground ${fontClass}`}>{t('details.venue')}</p>
            <p className={`text-lg font-semibold text-foreground ${fontClass}`}>{venueDisplay}</p>
          </div>
        </div>

        {/* Countdown */}
        <p className={`text-muted-foreground mb-4 ${fontClass}`}>{t('details.countdown')}</p>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { val: countdown.days, label: t('details.days') },
            { val: countdown.hours, label: t('details.hours') },
            { val: countdown.minutes, label: t('details.minutes') },
            { val: countdown.seconds, label: t('details.seconds') },
          ].map(({ val, label }) => (
            <div key={label} className="bg-background rounded-2xl p-4 shadow-surface border border-border">
              <div className="text-3xl font-display font-bold text-foreground">{val}</div>
              <div className={`text-xs text-muted-foreground mt-1 ${fontClass}`}>{label}</div>
            </div>
          ))}
        </div>

        <motion.a
          href={settings.calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display text-lg shadow-surface ${fontClass}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          📅 {t('details.calendar')}
        </motion.a>
      </div>
    </motion.section>
  );
}

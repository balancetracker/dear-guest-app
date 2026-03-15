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

function generateICSUrl(settings: { weddingDateTime: string; coupleNames: string; venueName: string }) {
  const start = new Date(settings.weddingDateTime);
  const end = new Date(start.getTime() + 4 * 3600000); // 4 hours
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${settings.coupleNames} Wedding`,
    `LOCATION:${settings.venueName}`,
    'DESCRIPTION:Wedding Ceremony',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export default function DetailsSection() {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();
  const countdown = useCountdown(settings.weddingDateTime);
  const fontClass = lang === 'km' ? 'font-khmer' : '';

  const dateDisplay = lang === 'km' ? settings.weddingDateKm : settings.weddingDate;
  const timeDisplay = lang === 'km' ? settings.weddingTimeKm : settings.weddingTime;
  const venueDisplay = lang === 'km' ? settings.venueNameKm : settings.venueName;

  const icsUrl = generateICSUrl(settings);

  const handleAddToCalendar = () => {
    // Try to download .ics file which will open in phone's calendar app
    const a = document.createElement('a');
    a.href = icsUrl;
    a.download = 'wedding.ics';
    a.click();
  };

  return (
    <motion.section
      className="py-24 px-6"
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

        <div className="grid grid-cols-1 gap-4 mb-10">
          {[
            { label: t('details.date'), value: dateDisplay, icon: '📅' },
            { label: t('details.time'), value: timeDisplay, icon: '🕐' },
            { label: t('details.venue'), value: venueDisplay, icon: '📍' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-6 flex items-center gap-4"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.1 }}
            >
              <span className="text-3xl">{item.icon}</span>
              <div className="text-left">
                <p className={`text-sm text-muted-foreground ${fontClass}`}>{item.label}</p>
                <p className={`text-lg font-semibold text-foreground ${fontClass}`}>{item.value}</p>
              </div>
            </motion.div>
          ))}
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
            <motion.div
              key={label}
              className="glass-card rounded-2xl p-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-display font-bold text-foreground">{val}</div>
              <div className={`text-xs text-muted-foreground mt-1 ${fontClass}`}>{label}</div>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={handleAddToCalendar}
          className={`inline-flex items-center gap-2 bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display text-lg shadow-surface ${fontClass}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          📅 {t('details.calendar')}
        </motion.button>
      </div>
    </motion.section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

const defaultProgram = [
  { time_en: '07:00 AM', time_km: '07:00 ព្រឹក', title_en: 'Guest Reception', title_km: 'ពិធីទទួលភ្ញៀវ' },
  { time_en: '08:00 AM', time_km: '08:00 ព្រឹក', title_en: 'Sampeas Pdeum Ceremony', title_km: 'ពិធីសំពះផ្ទឹម' },
  { time_en: '09:00 AM', time_km: '09:00 ព្រឹក', title_en: 'Hair Cutting Ceremony', title_km: 'ពិធីកាត់សក់' },
  { time_en: '10:00 AM', time_km: '10:00 ព្រឹក', title_en: 'Wrist Tying Ceremony', title_km: 'ពិធីចងដៃ' },
  { time_en: '12:00 PM', time_km: '12:00 ថ្ងៃត្រង់', title_en: 'Lunch Reception', title_km: 'អាហារថ្ងៃត្រង់' },
  { time_en: '06:00 PM', time_km: '06:00 ល្ងាច', title_en: 'Wedding Reception Party', title_km: 'ពិធីជប់លៀងអាពាហ៍ពិពាហ៍' },
];

export default function TimelineSection() {
  const { t, lang } = useLanguage();
  const { programSchedule } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';

  const items = programSchedule.length > 0 ? programSchedule : defaultProgram;

  return (
    <motion.section
      className="py-24 px-6 bg-card/50"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('timeline.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-12" />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border/50 md:-translate-x-1/2" />

          {items.map((item, i) => {
            const time = lang === 'km' ? item.time_km : item.time_en;
            const title = lang === 'km' ? item.title_km : item.title_en;

            return (
              <motion.div
                key={i}
                className="relative flex items-start mb-8 md:mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 }}
              >
                {/* Mobile layout: icon left, content right */}
                {/* Desktop layout: alternating */}
                <div className="hidden md:flex w-full items-center">
                  {i % 2 === 0 ? (
                    <>
                      <div className="w-5/12 text-right pr-8">
                        <motion.div className="glass-card rounded-2xl p-5" whileHover={{ scale: 1.02 }}>
                          <p className={`text-sm font-semibold text-accent-foreground mb-1 ${fontClass}`}>{time}</p>
                          <h3 className={`font-semibold text-foreground ${fontClass}`}>{title}</h3>
                        </motion.div>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-primary/60 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-surface border-4 border-background z-10">
                        🕐
                      </div>
                      <div className="w-5/12" />
                    </>
                  ) : (
                    <>
                      <div className="w-5/12" />
                      <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-primary/60 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-surface border-4 border-background z-10">
                        🕐
                      </div>
                      <div className="w-5/12 text-left pl-8">
                        <motion.div className="glass-card rounded-2xl p-5" whileHover={{ scale: 1.02 }}>
                          <p className={`text-sm font-semibold text-accent-foreground mb-1 ${fontClass}`}>{time}</p>
                          <h3 className={`font-semibold text-foreground ${fontClass}`}>{title}</h3>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile layout */}
                <div className="flex md:hidden items-start w-full">
                  <div className="relative z-10 w-10 h-10 bg-primary/60 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-surface border-4 border-background flex-shrink-0 ml-1">
                    🕐
                  </div>
                  <motion.div className="glass-card rounded-2xl p-4 ml-4 flex-1" whileHover={{ scale: 1.02 }}>
                    <p className={`text-sm font-semibold text-accent-foreground mb-1 ${fontClass}`}>{time}</p>
                    <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

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
      className="py-24 px-4 sm:px-6 bg-card/50"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('timeline.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-12" />

        {/* Clean vertical timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 sm:-translate-x-px" />

          <div className="space-y-6">
            {items.map((item, i) => {
              const time = lang === 'km' ? item.time_km : item.time_en;
              const title = lang === 'km' ? item.title_km : item.title_en;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: i * 0.08 }}
                >
                  {/* Desktop: alternating layout */}
                  <div className="hidden sm:grid sm:grid-cols-[1fr_40px_1fr] items-center gap-0">
                    {isLeft ? (
                      <>
                        <div className="text-right pr-5">
                          <div className="glass-card rounded-xl p-4 inline-block text-right">
                            <p className={`text-xs font-semibold text-primary mb-0.5 ${fontClass}`}>{time}</p>
                            <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <div className="w-9 h-9 rounded-full bg-primary/15 border-[3px] border-primary/40 flex items-center justify-center text-xs z-10">
                            🕐
                          </div>
                        </div>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div className="flex justify-center">
                          <div className="w-9 h-9 rounded-full bg-primary/15 border-[3px] border-primary/40 flex items-center justify-center text-xs z-10">
                            🕐
                          </div>
                        </div>
                        <div className="text-left pl-5">
                          <div className="glass-card rounded-xl p-4 inline-block text-left">
                            <p className={`text-xs font-semibold text-primary mb-0.5 ${fontClass}`}>{time}</p>
                            <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile: left-aligned */}
                  <div className="flex sm:hidden items-center gap-3">
                    <div className="relative z-10 w-9 h-9 rounded-full bg-primary/15 border-[3px] border-primary/40 flex items-center justify-center text-xs flex-shrink-0 ml-0.5">
                      🕐
                    </div>
                    <div className="glass-card rounded-xl p-3 flex-1">
                      <p className={`text-xs font-semibold text-primary mb-0.5 ${fontClass}`}>{time}</p>
                      <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
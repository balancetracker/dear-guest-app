import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.08 };

export default function TimelineSection() {
  const { t, lang } = useLanguage();
  const { programSchedule } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';

  const items = programSchedule
    .filter((item) => item.time_en || item.time_km || item.title_en || item.title_km)
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const isEmpty = items.length === 0;

  return (
    <motion.section
      className="py-14 sm:py-20 px-5 bg-champagne/30"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-xl mx-auto text-center">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('timeline.title')}
        </h2>
        <div className="section-divider mb-10" />

        {isEmpty ? (
          <div className="luxury-card rounded-xl p-5 text-center">
            <p className={`text-sm text-muted-foreground ${fontClass}`}>
              {lang === 'km'
                ? 'មិនទាន់មានដំណើរកម្មវិធីនៅឡើយទេ។'
                : 'Program schedule has not been published yet.'}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-light to-transparent sm:-translate-x-px" />

            <div className="space-y-4">
              {items.map((item, i) => {
                const time = (lang === 'km' ? item.time_km || item.time_en : item.time_en || item.time_km) || '';
                const title = (lang === 'km' ? item.title_km || item.title_en : item.title_en || item.title_km) || '';
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={item.id || i}
                    className="relative"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: i * 0.06 }}
                  >
                    {/* Desktop */}
                    <div className="hidden sm:grid sm:grid-cols-[1fr_36px_1fr] items-center gap-0">
                      {isLeft ? (
                        <>
                          <div className="text-right pr-4">
                            <div className="luxury-card rounded-xl p-3 inline-block text-right">
                              <p className={`text-[11px] font-semibold text-gold mb-0.5 ${fontClass}`}>{time}</p>
                              <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-champagne border-2 border-gold-light flex items-center justify-center text-xs z-10 shadow-glow">
                              ✦
                            </div>
                          </div>
                          <div />
                        </>
                      ) : (
                        <>
                          <div />
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-champagne border-2 border-gold-light flex items-center justify-center text-xs z-10 shadow-glow">
                              ✦
                            </div>
                          </div>
                          <div className="text-left pl-4">
                            <div className="luxury-card rounded-xl p-3 inline-block text-left">
                              <p className={`text-[11px] font-semibold text-gold mb-0.5 ${fontClass}`}>{time}</p>
                              <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="flex sm:hidden items-center gap-3">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-champagne border-2 border-gold-light flex items-center justify-center text-xs flex-shrink-0 ml-1 shadow-glow">
                        ✦
                      </div>
                      <div className="luxury-card rounded-xl p-3 flex-1">
                        <p className={`text-[11px] font-semibold text-gold mb-0.5 ${fontClass}`}>{time}</p>
                        <h3 className={`font-semibold text-foreground text-sm ${fontClass}`}>{title}</h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

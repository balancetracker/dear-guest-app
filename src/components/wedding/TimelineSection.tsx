import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

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

        {isEmpty ? (
          <div className="glass-card rounded-xl p-6 text-center">
            <p className={`text-sm text-muted-foreground ${fontClass}`}>
              {lang === 'km'
                ? 'មិនទាន់មានដំណើរកម្មវិធីនៅឡើយទេ។ សូមពិនិត្យម្ដងទៀតនៅពេលក្រោយ។'
                : 'Program schedule has not been published yet. Please check back soon.'}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 sm:-translate-x-px" />

            <div className="space-y-6">
              {items.map((item, i) => {
                const time = (lang === 'km' ? item.time_km || item.time_en : item.time_en || item.time_km) || '';
                const title = (lang === 'km' ? item.title_km || item.title_en : item.title_en || item.title_km) || '';
                const isLeft = i % 2 === 0;

                return (
                  <motion.div
                    key={item.id || i}
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
        )}
      </div>
    </motion.section>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

const timelineData = [
  { key: 'first_meet', icon: '☕', year: '2020' },
  { key: 'first_date', icon: '🌙', year: '2021' },
  { key: 'engagement', icon: '💍', year: '2024' },
  { key: 'wedding', icon: '💒', year: '2025' },
];

export default function TimelineSection() {
  const { t, lang } = useLanguage();
  const fontClass = lang === 'km' ? 'font-khmer' : '';

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
          {t('timeline.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-12" />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          {timelineData.map((item, i) => (
            <motion.div
              key={item.key}
              className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.15 }}
            >
              <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="bg-card rounded-2xl p-5 shadow-surface border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{item.year}</p>
                  <h3 className={`font-semibold text-foreground mb-1 ${fontClass}`}>
                    {t(`timeline.${item.key}`)}
                  </h3>
                  <p className={`text-sm text-muted-foreground ${fontClass}`}>
                    {t(`timeline.${item.key}_desc`)}
                  </p>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-lg shadow-surface border-4 border-background z-10">
                {item.icon}
              </div>

              <div className="w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

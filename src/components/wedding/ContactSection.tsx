import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function ContactSection() {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();

  const contacts = [
    { icon: '📱', label: 'Telegram', href: settings.contactTelegram },
    { icon: '📞', label: 'Phone', href: `tel:${settings.contactPhone}` },
    { icon: '📘', label: 'Facebook', href: settings.contactFacebook },
    { icon: '✉️', label: 'Email', href: `mailto:${settings.contactEmail}` },
  ];

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
          {t('contact.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <div className="grid grid-cols-2 gap-4">
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-medium text-foreground">{c.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

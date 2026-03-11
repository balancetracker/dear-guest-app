import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function GallerySection() {
  const { t, lang } = useLanguage();
  const { photos } = useWeddingData();

  // Use placeholder images if no photos uploaded
  const displayPhotos = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
  ];

  return (
    <motion.section
      className="py-24 px-6 bg-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('gallery.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <div className="columns-2 gap-4 space-y-4">
          {displayPhotos.map((photo, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid rounded-2xl overflow-hidden shadow-surface border border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.1 }}
            >
              <img
                src={photo}
                alt={`Wedding photo ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

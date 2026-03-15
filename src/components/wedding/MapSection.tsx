import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.08 };

export default function MapSection() {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';
  const mapsUrl = settings.mapLat && settings.mapLng
    ? `https://www.google.com/maps/search/?api=1&query=${settings.mapLat},${settings.mapLng}`
    : '#';

  return (
    <motion.section
      className="py-14 sm:py-20 px-5"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('map.title')}
        </h2>
        <div className="section-divider mb-8" />

        <div className="rounded-2xl overflow-hidden mb-5 gold-border shadow-luxury">
          {settings.mapEmbedUrl ? (
            <iframe src={settings.mapEmbedUrl} width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Wedding venue" />
          ) : settings.mapLat && settings.mapLng ? (
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(settings.mapLng) - 0.01},${parseFloat(settings.mapLat) - 0.008},${parseFloat(settings.mapLng) + 0.01},${parseFloat(settings.mapLat) + 0.008}&layer=mapnik&marker=${settings.mapLat},${settings.mapLng}`}
              width="100%" height="280" style={{ border: 0 }} loading="lazy" title="Wedding venue"
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-champagne/30">
              <p>📍 Map not configured</p>
            </div>
          )}
        </div>

        <motion.a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-full min-h-[44px] px-6 py-2.5 text-sm shadow-luxury ${fontClass}`}
          style={{ background: 'linear-gradient(135deg, hsl(38 55% 58%), hsl(38 60% 48%))', color: 'white' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          📍 {t('map.open')}
        </motion.a>
      </div>
    </motion.section>
  );
}

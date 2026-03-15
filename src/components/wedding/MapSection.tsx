import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function MapSection() {
  const { t, lang } = useLanguage();
  const { settings } = useWeddingData();
  const fontClass = lang === 'km' ? 'font-khmer' : '';
  const mapsUrl = settings.mapLat && settings.mapLng
    ? `https://www.google.com/maps/search/?api=1&query=${settings.mapLat},${settings.mapLng}`
    : '#';

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
          {t('map.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <div className="glass-card rounded-2xl overflow-hidden mb-6">
          {settings.mapEmbedUrl ? (
            <iframe
              src={settings.mapEmbedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding venue location"
            />
          ) : settings.mapLat && settings.mapLng ? (
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                parseFloat(settings.mapLng) - 0.01
              },${parseFloat(settings.mapLat) - 0.008},${
                parseFloat(settings.mapLng) + 0.01
              },${parseFloat(settings.mapLat) + 0.008}&layer=mapnik&marker=${settings.mapLat},${settings.mapLng}`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              title="Wedding venue location"
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>📍 Map not configured yet</p>
            </div>
          )}
        </div>

        <motion.a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 bg-accent text-accent-foreground rounded-full min-h-[48px] px-6 py-3 font-display shadow-surface ${fontClass}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          📍 {t('map.open')}
        </motion.a>
      </div>
    </motion.section>
  );
}
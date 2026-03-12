import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';
import divider from '@/assets/divider.png';

const spring = { type: "spring" as const, duration: 0.8, bounce: 0.1 };

export default function GallerySection() {
  const { t, lang } = useLanguage();
  const { photos } = useWeddingData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayPhotos = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
  ];

  const navigateLightbox = (dir: number) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + displayPhotos.length) % displayPhotos.length;
    setLightboxIndex(next);
  };

  return (
    <motion.section
      className="py-24 px-6 bg-card/50"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-3xl md:text-4xl font-semibold text-foreground mb-2 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
          {t('gallery.title')}
        </h2>
        <img src={divider} alt="" className="w-32 mx-auto opacity-50 mb-10" />

        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {displayPhotos.map((photo, i) => (
            <motion.div
              key={i}
              className="break-inside-avoid rounded-2xl overflow-hidden glass-card cursor-pointer group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }}
              onClick={() => setLightboxIndex(i)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={photo}
                  alt={`Wedding photo ${i + 1}`}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                  <span className="text-card text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={spring}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={displayPhotos[lightboxIndex]}
                alt=""
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              {/* Close */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-foreground text-lg hover:bg-card/90 transition-colors"
              >
                ✕
              </button>
              {/* Prev */}
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-foreground text-xl hover:bg-card/90 transition-colors"
              >
                ‹
              </button>
              {/* Next */}
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-foreground text-xl hover:bg-card/90 transition-colors"
              >
                ›
              </button>
              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-strong rounded-full px-4 py-1 text-sm text-foreground">
                {lightboxIndex + 1} / {displayPhotos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

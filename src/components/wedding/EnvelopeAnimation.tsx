import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import floralCorner from '@/assets/floral-corner.png';

interface EnvelopeProps {
  guestName: string;
  onOpen: () => void;
  isOpen: boolean;
}

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.1 };

export default function EnvelopeAnimation({ guestName, onOpen, isOpen }: EnvelopeProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floral corners */}
          <img src={floralCorner} alt="" className="absolute top-0 left-0 w-32 md:w-48 opacity-60 pointer-events-none" />
          <img src={floralCorner} alt="" className="absolute top-0 right-0 w-32 md:w-48 opacity-60 pointer-events-none scale-x-[-1]" />
          <img src={floralCorner} alt="" className="absolute bottom-0 left-0 w-32 md:w-48 opacity-60 pointer-events-none scale-y-[-1]" />
          <img src={floralCorner} alt="" className="absolute bottom-0 right-0 w-32 md:w-48 opacity-60 pointer-events-none scale-[-1]" />

          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...spring, duration: 0.8 }}
          >
            {/* Envelope */}
            <div className="relative w-72 h-48 md:w-96 md:h-64">
              {/* Envelope body */}
              <div className="absolute inset-0 bg-card rounded-lg shadow-surface border border-border" />
              
              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-primary/30 rounded-t-lg origin-top"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateX: 0 }}
                whileHover={{ rotateX: -15 }}
                transition={spring}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">💌</span>
                </div>
              </motion.div>

              {/* Card inside */}
              <div className="absolute inset-4 top-8 bg-card rounded border border-border flex flex-col items-center justify-center p-4 text-center">
                <p className="text-sm text-muted-foreground font-khmer">{t('envelope.to')}</p>
                <p className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-1">
                  {guestName || t('greeting.guest')}
                </p>
              </div>
            </div>

            {/* Open button */}
            <motion.button
              onClick={onOpen}
              className="bg-accent text-accent-foreground rounded-full min-h-[48px] px-8 py-3 font-display text-lg shadow-surface"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
            >
              {t('hero.open')}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

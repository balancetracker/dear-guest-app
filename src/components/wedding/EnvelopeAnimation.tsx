import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import confetti from 'canvas-confetti';
import floralCorner from '@/assets/floral-corner.png';

interface EnvelopeProps {
  guestName: string;
  onOpen: () => void;
  isOpen: boolean;
}

const spring = { type: "spring" as const, duration: 0.5, bounce: 0.1 };

function launchFireworks() {
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ['#f9a8d4', '#fbbf24', '#f472b6', '#fb923c', '#a78bfa', '#34d399'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  // Big center burst
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors,
      startVelocity: 45,
      gravity: 0.8,
      shapes: ['circle', 'square'],
      scalar: 1.2
    });
  }, 200);

  // Star bursts
  [600, 1200, 1800].forEach((delay) => {
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors,
        startVelocity: 30,
        gravity: 1,
        ticks: 80
      });
    }, delay);
  });
}

export default function EnvelopeAnimation({ guestName, onOpen, isOpen }: EnvelopeProps) {
  const { t, lang } = useLanguage();

  const handleOpen = useCallback(() => {
    launchFireworks();
    onOpen();
  }, [onOpen]);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/10"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating emojis */}
          {['🌼', '🌸', '🌺', '💐', '🌷', '✨', '🌼', '🌸'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl opacity-30 pointer-events-none"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${5 + Math.random() * 90}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              {emoji}
            </motion.span>
          ))}

          {/* Floral corners */}
          <img src={floralCorner} alt="" className="absolute top-0 left-0 w-28 md:w-40 opacity-40 pointer-events-none" />
          <img src={floralCorner} alt="" className="absolute top-0 right-0 w-28 md:w-40 opacity-40 pointer-events-none scale-x-[-1]" />
          <img src={floralCorner} alt="" className="absolute bottom-0 left-0 w-28 md:w-40 opacity-40 pointer-events-none scale-y-[-1]" />
          <img src={floralCorner} alt="" className="absolute bottom-0 right-0 w-28 md:w-40 opacity-40 pointer-events-none scale-[-1]" />

          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...spring, duration: 0.8 }}
          >
            {/* Envelope */}
            <motion.div
              className="relative w-72 h-48 md:w-96 md:h-64 cursor-pointer"
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={handleOpen}
            >
              {/* Envelope body */}
              <div className="absolute inset-0 rounded-2xl bg-primary/30 border border-primary/50 shadow-xl backdrop-blur-sm" />

              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1/2 bg-primary/20 backdrop-blur-sm rounded-t-2xl origin-top"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateX: 0 }}
                whileHover={{ rotateX: -20 }}
                transition={spring}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="text-3xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💌
                  </motion.span>
                </div>
              </motion.div>

              {/* Card inside */}
              <div className="absolute inset-4 top-8 bg-card/90 backdrop-blur-sm rounded-xl border border-border/30 flex flex-col items-center justify-center p-4 text-center shadow-sm">
                <p className={`text-sm text-muted-foreground ${lang === 'km' ? 'font-khmer' : 'font-sans'}`}>
                  {t('envelope.to')}
                </p>
                <p className={`text-2xl md:text-3xl font-semibold text-foreground mt-1 ${lang === 'km' ? 'font-khmer' : 'font-display'}`}>
                  {guestName || t('greeting.guest')}
                </p>
                <motion.div
                  className="mt-2 text-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  💕
                </motion.div>
              </div>
            </motion.div>

            {/* Open button */}
            <motion.button
              onClick={handleOpen}
              className={`min-h-[48px] px-10 py-3 text-lg shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground rounded-full ${lang === 'km' ? 'font-khmer' : 'font-sans'}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              animate={{ y: [0, -3, 0] }}
            >
              ✨ {t('hero.open')}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

}
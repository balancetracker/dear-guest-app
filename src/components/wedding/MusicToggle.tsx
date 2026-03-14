import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWeddingData } from '@/contexts/WeddingDataContext';

export default function MusicToggle() {
  const { t } = useLanguage();
  const { settings } = useWeddingData();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string>('');

  const getMusicSource = () => {
    // Check for uploaded music (base64) first, then URL
    return settings.musicFile || settings.musicUrl;
  };

  useEffect(() => {
    // Reset audio when source changes
    const src = getMusicSource();
    if (audioRef.current && currentUrlRef.current !== src) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
    }
  }, [settings.musicUrl, settings.musicFile]);

  const toggle = () => {
    const src = getMusicSource();
    if (!src) return;

    if (!audioRef.current || currentUrlRef.current !== src) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      currentUrlRef.current = src;
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-4 left-4 z-40 glass-strong text-foreground rounded-full w-10 h-10 flex items-center justify-center text-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle music"
    >
      {playing ? t('music.on') : t('music.off')}
    </motion.button>
  );
}

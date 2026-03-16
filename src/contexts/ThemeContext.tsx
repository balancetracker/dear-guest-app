import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'gold' | 'pink' | 'lavender' | 'rainbow';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'wedding-theme';

export const THEME_INFO: Record<ThemeName, { label: string; emoji: string; description: string; colors: string[] }> = {
  gold: {
    label: 'Champagne Gold',
    emoji: '✨',
    description: 'Classic luxury with warm gold tones',
    colors: ['#D4A76A', '#E8C8A0', '#F4E4D0', '#C9A96E'],
  },
  pink: {
    label: 'Blush Pink',
    emoji: '🌸',
    description: 'Soft romantic pink with rosy warmth',
    colors: ['#E8A0B4', '#F4C2D0', '#FFD6E0', '#D4708A'],
  },
  lavender: {
    label: 'Dreamy Lavender',
    emoji: '💜',
    description: 'Elegant purple with gentle calm',
    colors: ['#B8A0D4', '#D0B8E8', '#E8D0F4', '#9A7EBE'],
  },
  rainbow: {
    label: 'Pastel Rainbow',
    emoji: '🌈',
    description: 'Playful mix of soft pastel colors',
    colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemeName) || 'gold';
    } catch {
      return 'gold';
    }
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

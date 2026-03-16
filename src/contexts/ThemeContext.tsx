import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ThemeName = 'gold' | 'pink' | 'lavender' | 'rainbow';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'wedding-theme';
const VALID_THEMES: ThemeName[] = ['gold', 'pink', 'lavender', 'rainbow'];

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

function isValidTheme(t: string): t is ThemeName {
  return VALID_THEMES.includes(t as ThemeName);
}

// Use any-typed client to avoid strict type issues with unsynced schema
const db = supabase as any;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && isValidTheme(stored)) return stored;
    } catch {}
    return 'gold';
  });
  const [loading, setLoading] = useState(true);

  // Load theme from database on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data } = await db
          .from('settings')
          .select('theme')
          .limit(1)
          .single();

        if (data?.theme && isValidTheme(data.theme)) {
          setThemeState(data.theme as ThemeName);
          try { localStorage.setItem(STORAGE_KEY, data.theme); } catch {}
        }
      } catch {
        // Column may not exist yet, use localStorage fallback
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Listen for realtime theme changes
  useEffect(() => {
    const channel = db
      .channel('theme-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload: any) => {
        const newTheme = payload.new?.theme;
        if (newTheme && isValidTheme(newTheme)) {
          setThemeState(newTheme as ThemeName);
          try { localStorage.setItem(STORAGE_KEY, newTheme); } catch {}
        }
      })
      .subscribe();

    return () => { db.removeChannel(channel); };
  }, []);

  const setTheme = useCallback(async (t: ThemeName) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}

    // Save to database
    try {
      const { data: existing } = await db
        .from('settings')
        .select('id')
        .limit(1)
        .single();

      if (existing?.id) {
        await db
          .from('settings')
          .update({ theme: t })
          .eq('id', existing.id);
      }
    } catch {
      // Column may not exist yet
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

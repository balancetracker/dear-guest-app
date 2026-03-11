import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Guest {
  id: string;
  name: string;
  rsvpStatus: 'pending' | 'attending' | 'not_attending';
  numberOfGuests: number;
}

export interface Wish {
  id: string;
  guestName: string;
  message: string;
  timestamp: number;
}

interface WeddingData {
  guests: Guest[];
  wishes: Wish[];
  photos: string[];
  bankName: string;
  bankAccount: string;
  bankQR: string;
  addGuest: (name: string) => void;
  removeGuest: (id: string) => void;
  updateRSVP: (name: string, status: 'attending' | 'not_attending', numGuests: number) => void;
  addWish: (name: string, message: string) => void;
  addPhoto: (url: string) => void;
  removePhoto: (url: string) => void;
  setBankInfo: (name: string, account: string, qr: string) => void;
}

const WeddingDataContext = createContext<WeddingData | null>(null);

const STORAGE_KEY = 'wedding_data';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function WeddingDataProvider({ children }: { children: ReactNode }) {
  const saved = loadData();
  const [guests, setGuests] = useState<Guest[]>(saved?.guests ?? [
    { id: '1', name: 'Sokha', rsvpStatus: 'pending', numberOfGuests: 1 },
    { id: '2', name: 'Vicheka', rsvpStatus: 'pending', numberOfGuests: 1 },
    { id: '3', name: 'Bopha', rsvpStatus: 'attending', numberOfGuests: 2 },
  ]);
  const [wishes, setWishes] = useState<Wish[]>(saved?.wishes ?? [
    { id: '1', guestName: 'Bopha', message: 'Congratulations! Wishing you a lifetime of love and happiness! 💕', timestamp: Date.now() - 86400000 },
  ]);
  const [photos, setPhotos] = useState<string[]>(saved?.photos ?? []);
  const [bankName, setBankName] = useState(saved?.bankName ?? 'ABA Bank');
  const [bankAccount, setBankAccount] = useState(saved?.bankAccount ?? '001 234 567');
  const [bankQR, setBankQR] = useState(saved?.bankQR ?? '');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ guests, wishes, photos, bankName, bankAccount, bankQR }));
  }, [guests, wishes, photos, bankName, bankAccount, bankQR]);

  const addGuest = (name: string) => {
    setGuests(prev => [...prev, { id: crypto.randomUUID(), name, rsvpStatus: 'pending', numberOfGuests: 1 }]);
  };
  const removeGuest = (id: string) => setGuests(prev => prev.filter(g => g.id !== id));
  const updateRSVP = (name: string, status: 'attending' | 'not_attending', numGuests: number) => {
    setGuests(prev => prev.map(g => g.name.toLowerCase() === name.toLowerCase() ? { ...g, rsvpStatus: status, numberOfGuests: numGuests } : g));
  };
  const addWish = (guestName: string, message: string) => {
    setWishes(prev => [...prev, { id: crypto.randomUUID(), guestName, message, timestamp: Date.now() }]);
  };
  const addPhoto = (url: string) => setPhotos(prev => [...prev, url]);
  const removePhoto = (url: string) => setPhotos(prev => prev.filter(p => p !== url));
  const setBankInfo = (name: string, account: string, qr: string) => {
    setBankName(name);
    setBankAccount(account);
    setBankQR(qr);
  };

  return (
    <WeddingDataContext.Provider value={{ guests, wishes, photos, bankName, bankAccount, bankQR, addGuest, removeGuest, updateRSVP, addWish, addPhoto, removePhoto, setBankInfo }}>
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData() {
  const ctx = useContext(WeddingDataContext);
  if (!ctx) throw new Error('useWeddingData must be inside WeddingDataProvider');
  return ctx;
}

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

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

export interface WeddingSettings {
  coupleNames: string;
  coupleNamesKm: string;
  weddingDate: string;
  weddingDateKm: string;
  weddingTime: string;
  weddingTimeKm: string;
  venueName: string;
  venueNameKm: string;
  weddingDateTime: string;
  calendarUrl: string;
  mapLat: string;
  mapLng: string;
  mapEmbedUrl: string;
  contactTelegram: string;
  contactPhone: string;
  contactFacebook: string;
  contactEmail: string;
  musicUrl: string;
  musicFile: string;
  heroImage: string;
  weddingDescription: string;
  weddingDescriptionKm: string;
}

interface WeddingData {
  guests: Guest[];
  wishes: Wish[];
  photos: string[];
  bankName: string;
  bankAccount: string;
  bankQR: string;
  settings: WeddingSettings;
  addGuest: (name: string) => void;
  removeGuest: (id: string) => void;
  updateRSVP: (name: string, status: 'attending' | 'not_attending', numGuests: number) => void;
  addWish: (name: string, message: string) => void;
  addPhoto: (url: string) => void;
  removePhoto: (url: string) => void;
  setBankInfo: (name: string, account: string, qr: string) => void;
  updateSettings: (s: Partial<WeddingSettings>) => void;
}

const WeddingDataContext = createContext<WeddingData | null>(null);

const STORAGE_KEY = 'wedding_data';
const BLOB_DB_NAME = 'wedding_blobs';
const BLOB_STORE = 'blobs';

const defaultSettings: WeddingSettings = {
  coupleNames: 'Dara & Sophea',
  coupleNamesKm: 'តារា & សុភា',
  weddingDate: 'Saturday, 20 December 2026',
  weddingDateKm: 'ថ្ងៃសៅរ៍ ២០ ខែធ្នូ ២០២៦',
  weddingTime: '11:30 AM',
  weddingTimeKm: '១១:៣០ ព្រឹក',
  venueName: 'The Grand Palace Hotel',
  venueNameKm: 'សណ្ឋាគារ ព្រះបរមរាជវាំង',
  weddingDateTime: '2026-12-20T11:30:00',
  calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Dara+%26+Sophea&dates=20261220T043000Z/20261220T120000Z&details=Wedding+Ceremony&location=The+Grand+Palace+Hotel',
  mapLat: '11.5564',
  mapLng: '104.9282',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7!2d104.9282!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDMzJzIzLjAiTiAxMDTCsDU1JzQxLjUiRQ!5e0!3m2!1sen!2skh!4v1',
  contactTelegram: 'https://t.me/',
  contactPhone: '+85512345678',
  contactFacebook: 'https://facebook.com/',
  contactEmail: 'wedding@example.com',
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  musicFile: '',
  heroImage: '',
  weddingDescription: 'We joyfully invite you to celebrate the beginning of our new journey together.',
  weddingDescriptionKm: 'យើងខ្ញុំសូមគោរពអញ្ជើញអ្នកមកចូលរួមពិធីមង្គលការរបស់យើង។',
};

// --- IndexedDB helpers for large binary data ---
function openBlobDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(BLOB_DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(BLOB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveBlobData(key: string, value: string) {
  try {
    const db = await openBlobDB();
    const tx = db.transaction(BLOB_STORE, 'readwrite');
    tx.objectStore(BLOB_STORE).put(value, key);
    await new Promise<void>((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); });
    db.close();
  } catch (e) {
    console.warn('Failed to save blob to IndexedDB:', e);
  }
}

async function loadBlobData(key: string): Promise<string> {
  try {
    const db = await openBlobDB();
    const tx = db.transaction(BLOB_STORE, 'readonly');
    const req = tx.objectStore(BLOB_STORE).get(key);
    const result = await new Promise<string>((res, rej) => {
      req.onsuccess = () => res((req.result as string) || '');
      req.onerror = () => rej(req.error);
    });
    db.close();
    return result;
  } catch {
    return '';
  }
}

function isBase64(s: string) {
  return s.startsWith('data:');
}

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
  const [settings, setSettings] = useState<WeddingSettings>({ ...defaultSettings, ...saved?.settings });
  const [blobsLoaded, setBlobsLoaded] = useState(false);

  // Load large blobs from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const [musicBlob, heroBlob, qrBlob, photosBlob] = await Promise.all([
        loadBlobData('musicFile'),
        loadBlobData('heroImage'),
        loadBlobData('bankQR'),
        loadBlobData('photos'),
      ]);
      if (musicBlob) setSettings(prev => ({ ...prev, musicFile: musicBlob }));
      if (heroBlob) setSettings(prev => ({ ...prev, heroImage: heroBlob }));
      if (qrBlob) setBankQR(qrBlob);
      if (photosBlob) {
        try {
          const parsed = JSON.parse(photosBlob);
          if (Array.isArray(parsed) && parsed.length > 0) setPhotos(parsed);
        } catch {}
      }
      setBlobsLoaded(true);
    })();
  }, []);

  // Save small data to localStorage (exclude large base64 strings)
  useEffect(() => {
    // Filter out base64 photos for localStorage, keep URL-based ones
    const smallPhotos = photos.filter(p => !isBase64(p));
    const smallSettings = {
      ...settings,
      musicFile: '', // stored in IndexedDB
      heroImage: isBase64(settings.heroImage) ? '' : settings.heroImage,
    };
    const smallBankQR = isBase64(bankQR) ? '' : bankQR;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        guests, wishes, photos: smallPhotos, bankName, bankAccount, bankQR: smallBankQR, settings: smallSettings,
      }));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }, [guests, wishes, photos, bankName, bankAccount, bankQR, settings]);

  // Save large blobs to IndexedDB
  useEffect(() => {
    if (!blobsLoaded) return;
    saveBlobData('musicFile', settings.musicFile);
  }, [settings.musicFile, blobsLoaded]);

  useEffect(() => {
    if (!blobsLoaded) return;
    if (isBase64(settings.heroImage)) {
      saveBlobData('heroImage', settings.heroImage);
    }
  }, [settings.heroImage, blobsLoaded]);

  useEffect(() => {
    if (!blobsLoaded) return;
    if (isBase64(bankQR)) {
      saveBlobData('bankQR', bankQR);
    }
  }, [bankQR, blobsLoaded]);

  useEffect(() => {
    if (!blobsLoaded) return;
    const base64Photos = photos.filter(p => isBase64(p));
    if (base64Photos.length > 0) {
      saveBlobData('photos', JSON.stringify(base64Photos));
    }
  }, [photos, blobsLoaded]);

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
  const updateSettings = useCallback((s: Partial<WeddingSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  }, []);

  return (
    <WeddingDataContext.Provider value={{ guests, wishes, photos, bankName, bankAccount, bankQR, settings, addGuest, removeGuest, updateRSVP, addWish, addPhoto, removePhoto, setBankInfo, updateSettings }}>
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData() {
  const ctx = useContext(WeddingDataContext);
  if (!ctx) throw new Error('useWeddingData must be inside WeddingDataProvider');
  return ctx;
}

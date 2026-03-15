import React, { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'km';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  'hero.names': { en: 'Dara & Sophea', km: 'តារា & សុភា' },
  'hero.date': { en: 'Saturday, 14 December 2025', km: 'ថ្ងៃសៅរ៍ ១៤ ខែធ្នូ ២០២៥' },
  'hero.open': { en: 'Open Invitation', km: 'បើកសំបុត្រអញ្ជើញ' },
  'greeting.dear': { en: 'Dear', km: 'ជូនចំពោះ' },
  'greeting.message': { en: 'You are warmly invited to celebrate our wedding.', km: 'សូមអញ្ជើញចូលរួមអបអរសាទរពិធីមង្គលការរបស់យើង។' },
  'greeting.guest': { en: 'Honored Guest', km: 'ភ្ញៀវកិត្តិយស' },
  'timeline.title': { en: 'Wedding Program', km: 'ដំណើរកម្មវិធី' },
  'gallery.title': { en: 'Our Moments', km: 'វិនាទីរបស់យើង' },
  'details.title': { en: 'Wedding Details', km: 'ព័ត៌មានពិធីមង្គលការ' },
  'details.date': { en: 'Date', km: 'កាលបរិច្ឆេទ' },
  'details.time': { en: 'Time', km: 'ម៉ោង' },
  'details.time_value': { en: '11:30 AM', km: '១១:៣០ ព្រឹក' },
  'details.venue': { en: 'Venue', km: 'ទីកន្លែង' },
  'details.venue_name': { en: 'The Grand Palace Hotel', km: 'សណ្ឋាគារ ព្រះបរមរាជវាំង' },
  'details.calendar': { en: 'Save to Calendar', km: 'រក្សាទុកក្នុងប្រតិទិន' },
  'details.countdown': { en: 'Counting down to our big day', km: 'រាប់ថយក្រោយរហូតដល់ថ្ងៃពិសេស' },
  'details.days': { en: 'Days', km: 'ថ្ងៃ' },
  'details.hours': { en: 'Hours', km: 'ម៉ោង' },
  'details.minutes': { en: 'Minutes', km: 'នាទី' },
  'details.seconds': { en: 'Seconds', km: 'វិនាទី' },
  'map.title': { en: 'Location', km: 'ទីតាំង' },
  'map.open': { en: 'Open in Google Maps', km: 'បើកក្នុង Google Maps' },
  'rsvp.title': { en: 'RSVP', km: 'ការឆ្លើយតប' },
  'rsvp.attending': { en: 'Yes, I will attend', km: 'បាទ/ចាស ខ្ញុំនឹងចូលរួម' },
  'rsvp.not_attending': { en: 'Sorry, I cannot attend', km: 'សូមទោស ខ្ញុំមិនអាចចូលរួមបាន' },
  'rsvp.guests': { en: 'Number of guests', km: 'ចំនួនភ្ញៀវ' },
  'rsvp.submit': { en: 'Send RSVP', km: 'ផ្ញើការឆ្លើយតប' },
  'rsvp.success': { en: 'Thank you for your response!', km: 'សូមអរគុណសម្រាប់ការឆ្លើយតប!' },
  'gift.title': { en: 'Wedding Gift', km: 'អំណោយមង្គលការ' },
  'gift.bank': { en: 'Bank Transfer', km: 'ផ្ទេរប្រាក់តាមធនាគារ' },
  'gift.copy': { en: 'Copy Account Number', km: 'ចម្លងលេខគណនី' },
  'gift.copied': { en: 'Copied!', km: 'បានចម្លង!' },
  'contact.title': { en: 'Contact Us', km: 'ទំនាក់ទំនង' },
  'wishes.title': { en: 'Guest Wishes', km: 'ជូនពរពីភ្ញៀវ' },
  'wishes.placeholder': { en: 'Write your wishes for the couple...', km: 'សរសេរពាក្យជូនពរជូនគូស្នេហ៍...' },
  'wishes.name': { en: 'Your name', km: 'ឈ្មោះរបស់អ្នក' },
  'wishes.send': { en: 'Send Wishes', km: 'ផ្ញើពាក្យជូនពរ' },
  'lang.switch': { en: '🇰🇭 ខ្មែរ', km: '🇬🇧 English' },
  'music.on': { en: '🎵', km: '🎵' },
  'music.off': { en: '🔇', km: '🔇' },
  'admin.title': { en: 'Admin Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង' },
  'admin.guests': { en: 'Guests', km: 'ភ្ញៀវ' },
  'admin.add_guest': { en: 'Add Guest', km: 'បន្ថែមភ្ញៀវ' },
  'admin.photos': { en: 'Photos', km: 'រូបថត' },
  'admin.settings': { en: 'Settings', km: 'ការកំណត់' },
  'admin.rsvp': { en: 'RSVP Responses', km: 'ការឆ្លើយតប' },
  'admin.wishes_tab': { en: 'Wishes', km: 'ពាក្យជូនពរ' },
  'admin.login': { en: 'Admin Login', km: 'ចូលគ្រប់គ្រង' },
  'admin.password': { en: 'Password', km: 'ពាក្យសម្ងាត់' },
  'admin.enter': { en: 'Login', km: 'ចូល' },
  'envelope.to': { en: 'To', km: 'ជូនចំពោះ' },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('km');

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}

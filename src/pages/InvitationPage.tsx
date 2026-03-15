import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import EnvelopeAnimation from '@/components/wedding/EnvelopeAnimation';
import FallingPetals from '@/components/wedding/FallingPetals';
import FloatingHearts from '@/components/wedding/FloatingHearts';
import FloatingDaisies from '@/components/wedding/FloatingDaisies';
import SparkleEffect from '@/components/wedding/SparkleEffect';
import LanguageSwitcher from '@/components/wedding/LanguageSwitcher';
import MusicToggle from '@/components/wedding/MusicToggle';
import HeroSection from '@/components/wedding/HeroSection';
import GreetingSection from '@/components/wedding/GreetingSection';
import TimelineSection from '@/components/wedding/TimelineSection';
import GallerySection from '@/components/wedding/GallerySection';
import DetailsSection from '@/components/wedding/DetailsSection';
import MapSection from '@/components/wedding/MapSection';
import RSVPSection from '@/components/wedding/RSVPSection';
import GiftSection from '@/components/wedding/GiftSection';
import ContactSection from '@/components/wedding/ContactSection';
import WishesSection from '@/components/wedding/WishesSection';

export default function InvitationPage() {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('guest') || '';
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="relative">
        <EnvelopeAnimation
          guestName={guestName}
          onOpen={() => setEnvelopeOpen(true)}
          isOpen={envelopeOpen}
        />

        {envelopeOpen && (
          <>
            <FallingPetals />
            <FloatingHearts />
            <FloatingDaisies />
            <SparkleEffect />
            <LanguageSwitcher />
            <MusicToggle />

            <main>
              <HeroSection />
              <GreetingSection guestName={guestName} />
              <TimelineSection />
              <GallerySection />
              <DetailsSection />
              <MapSection />
              <RSVPSection guestName={guestName} />
              <GiftSection />
              <WishesSection />
              <ContactSection />

              {/* Footer */}
              <footer className="py-12 text-center text-muted-foreground text-sm">
                <p className="font-display text-lg">Made with ❤️</p>
              </footer>
            </main>
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

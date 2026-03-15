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
      <div className="relative min-h-screen bg-background">
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

            <main className="relative z-[1]">
              <HeroSection />
              <GreetingSection guestName={guestName} />
              <DetailsSection />
              <TimelineSection />
              <GallerySection />
              <MapSection />
              <RSVPSection guestName={guestName} />
              <GiftSection />
              <WishesSection />
              <ContactSection />

              {/* Footer */}
              <footer className="py-10 text-center">
                <div className="section-divider mb-4" />
                <p className="font-display text-sm text-muted-foreground italic">Made with love ♡</p>
              </footer>
            </main>
          </>
        )}
      </div>
    </LanguageProvider>
  );
}

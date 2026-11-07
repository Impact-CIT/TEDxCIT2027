import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/hero/Hero';
import { WhatIsTEDxSection } from './components/sections/WhatIsTEDxSection';
import { ScrollExpansionSection } from './components/sections/ScrollExpansionSection';
import { AboutVideoSection } from './components/sections/AboutVideoSection';
import { ImpactStatsSection } from './components/sections/ImpactStatsSection';
import { PastEventsSection } from './components/sections/PastEventsSection';
import { SponsorSection } from './components/sections/SponsorSection';
import { CinematicFramesSection } from './components/sections/CinematicFramesSection';
import { ApplyToSpeakModal } from './components/ApplyToSpeakModal';

// Dedicated Legal & Compliance Pages
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import DeliveryPolicy from './pages/DeliveryPolicy';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import Organizers from './pages/Organizers';

// Native Apply to Speak Flow Pages & Admin Portal
import AnonymousVoices from './pages/AnonymousVoices';
import SpeakerNomination from './pages/SpeakerNomination';
import AdminSubmissions from './pages/AdminSubmissions';

/**
 * Normalizes browser pathname for routing
 */
function getNormalizedPath() {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.pathname.toLowerCase().trim();
  return raw.length > 1 ? raw.replace(/\/+$/, '') : raw || '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getNormalizedPath);
  const [isSpeakModalOpen, setIsSpeakModalOpen] = useState(false);
  const openSpeakModal = () => setIsSpeakModalOpen(true);
  const closeSpeakModal = () => setIsSpeakModalOpen(false);

  // Listen to popstate and history navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      setCurrentPath(getNormalizedPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // When visiting /apply-to-speak directly, open the modal in an effect
  useEffect(() => {
    if (currentPath === '/apply-to-speak') {
      setIsSpeakModalOpen(true);
    }
  }, [currentPath]);

  // Render the appropriate main content based on URL route
  const renderContent = () => {
    switch (currentPath) {
      // 1. Apply to Speak Flow Native Pages
      case '/apply/anonymous-voices':
      case '/apply-to-speak/anonymous-voices':
      case '/anonymous-voices':
        return <AnonymousVoices />;

      case '/apply/speaker-nomination':
      case '/apply-to-speak/speaker-nomination':
      case '/speaker-nomination':
      case '/nominate-speaker':
        return <SpeakerNomination />;

      // 2. Admin Curation Portal
      case '/admin':
      case '/admin/submissions':
      case '/curation':
        return <AdminSubmissions />;

      // 3. Legal & Compliance Pages
      case '/terms-and-conditions':
      case '/terms':
        return <TermsConditions />;

      case '/privacy-policy':
      case '/privacy':
        return <PrivacyPolicy />;

      case '/cancellation-and-refund':
      case '/refund-policy':
      case '/refunds':
        return <RefundPolicy />;

      case '/shipping-and-delivery':
      case '/ticket-delivery':
      case '/delivery':
        return <DeliveryPolicy />;

      case '/contact-us':
      case '/contact':
      case '/partner-with-us':
        return <ContactUs />;

      // 4. Organizers Page & Team Route
      case '/organizers':
      case '/organisers':
      case '/team':
      case '/meet-our-team':
        return <Organizers />;

      // 5. Home Landing Page
      case '/apply-to-speak':
      case '/':
      case '/home':
      case '':
        return (
          <main className="flex-1 w-full flex flex-col">
            {/* Full-screen Edge-to-Edge UNTAPPED Hero Section */}
            <Hero />

            {/* What is TEDx Section */}
            <WhatIsTEDxSection />

            {/* Cinematic Scroll-Driven Visual Expansion Section */}
            <ScrollExpansionSection
              images={[
                '/images/beyond-seen-1.jpg',
                '/images/beyond-seen-2.jpg',
              ]}
              imageLabels={[
                'Organizing Committee',
                'Team & Crew',
              ]}
            />

            {/* 50/50 Split Stage Video & TEDx CIT Mission Section */}
            <AboutVideoSection
              videoSrc="/videos/tedx-cit-speaker.mp4"
              posterSrc="/images/tedx-speaker-stage-poster.jpg"
              onApplyToSpeak={openSpeakModal}
            />

            {/* 3-Frame Rotating Stage Showcase Section */}
            <CinematicFramesSection intervalMs={3000} />

            {/* Dynamic Scroll Count-Up Impact Metrics Section */}
            <ImpactStatsSection />

            {/* Past Events Glassy Cards Section */}
            <PastEventsSection />

            {/* Infinite Marquee Sponsors Section */}
            <SponsorSection />
          </main>
        );

      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#F5F5F2] selection:bg-[#FF2B25] selection:text-white flex flex-col relative font-sans">
      {/* Apply to Speak Accessible Modal */}
      <ApplyToSpeakModal isOpen={isSpeakModalOpen} onClose={closeSpeakModal} />

      {/* Main Website Page Content */}
      <div className="w-full flex flex-col min-h-screen">
        {/* Full-width Grid Architectural Navbar */}
        <Navbar currentPath={currentPath} onApplyToSpeak={openSpeakModal} />

        {/* Dynamic Route Content */}
        {renderContent()}

        {/* Global footer */}
        <Footer />
      </div>
    </div>
  );
}

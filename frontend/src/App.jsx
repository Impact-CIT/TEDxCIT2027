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
import { CinematicStage } from './components/stage/CinematicStage';
import { ApplyToSpeakModal } from './components/ApplyToSpeakModal';

// Dedicated Legal & Compliance Pages (Required for Razorpay Merchant Approval)
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import DeliveryPolicy from './pages/DeliveryPolicy';
import ContactUs from './pages/ContactUs';
import DelegateRegistration from './pages/DelegateRegistration';
import NotFound from './pages/NotFound';

/**
 * Normalizes browser pathname for routing
 */
function getNormalizedPath() {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.pathname.toLowerCase().trim();
  // Strip trailing slash unless root
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

  // When opening the home page, the cinematic stage animation plays first.
  // For legal / compliance pages or when ?skip=true is present, bypass the 3D ceremony immediately.
  const isHomePage = currentPath === '/' || currentPath === '/home';
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('skip') === 'true') {
        return false;
      }
      // If the visitor directly accessed a legal policy page or registration, do not show stage intro
      if (!isHomePage) {
        return false;
      }
    }
    return isHomePage;
  });

  // Render the appropriate main content based on URL route
  const renderContent = () => {
    switch (currentPath) {
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

      case '/apply-to-speak':
        // Open the modal on the current page instead of navigating to ContactUs
        if (!isSpeakModalOpen) openSpeakModal();
        // Fall back to home so there's always a page behind the modal
        return (
          <main className="flex-1 w-full flex flex-col">
            <Hero />
            <WhatIsTEDxSection />
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
            <AboutVideoSection
              videoSrc="/videos/tedx-cit-speaker.mp4"
              posterSrc="/images/tedx-speaker-stage-poster.jpg"
              onApplyToSpeak={openSpeakModal}
            />
            <CinematicFramesSection intervalMs={3000} />
            <ImpactStatsSection />
            <PastEventsSection />
            <SponsorSection />
          </main>
        );

      case '/register':
      case '/delegates':
      case '/passes':
      case '/registration':
        return <DelegateRegistration />;

      case '/':
      case '/home':
      case '':
        // Full Home Landing Page
        return (
          <main className="flex-1 w-full flex flex-col">
            {/* Full-screen Edge-to-Edge UNTAPPED Hero Section */}
            <Hero />

            {/* What is TEDx Section (Directly below Hero Header) */}
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

            {/* 50/50 Split Stage Video (16:9 Frame) & TEDx CIT Mission Section */}
            <AboutVideoSection
              videoSrc="/videos/tedx-cit-speaker.mp4"
              posterSrc="/images/tedx-speaker-stage-poster.jpg"
              onApplyToSpeak={openSpeakModal}
            />

            {/* 3-Frame Rotating Stage Showcase Section (Cycles every 3 seconds to new 3 images) */}
            <CinematicFramesSection intervalMs={3000} />

            {/* Dynamic Scroll Count-Up Impact Metrics Section (A Decade of Impact) */}
            <ImpactStatsSection />

            {/* Past Events Glassy Cards Section (Past events. Lasting ideas.) */}
            <PastEventsSection />

            {/* Infinite Marquee Sponsors Section (Our Sponsors) */}
            <SponsorSection />
          </main>
        );

      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#F5F5F2] selection:bg-[#FF2B25] selection:text-white flex flex-col relative">
      {/* Apply to Speak Modal — available on every page */}
      <ApplyToSpeakModal isOpen={isSpeakModalOpen} onClose={closeSpeakModal} />
      {/* 1. Cinematic 3D Stage Opening Ceremony Intro (Home page only) */}
      {isHomePage && isIntroActive && (
        <CinematicStage
          onComplete={() => {
            setIsIntroActive(false);
            if (typeof window !== 'undefined') {
              window.scrollTo(0, 0);
            }
          }}
        />
      )}

      {/* 2. Main Website Page Content */}
      <div
        className={`w-full flex flex-col transition-opacity duration-700 ${
          isHomePage && isIntroActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 min-h-screen'
        }`}
      >
        {/* Full-width Grid Architectural Navbar */}
        <Navbar currentPath={currentPath} onApplyToSpeak={openSpeakModal} />

        {/* Dynamic Route Content */}
        {renderContent()}

        {/* Global Footer with All Mandatory Razorpay Legal Policies & Contact Info */}
        <Footer />
      </div>
    </div>
  );
}

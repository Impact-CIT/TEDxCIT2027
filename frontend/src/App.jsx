import React, { useState } from 'react';
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

export default function App() {
  // When opening the website, the cinematic stage animation plays first.
  // When the animation ends (or on Skip), it automatically transitions to the home page.
  const [isIntroActive, setIsIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // Allow bypassing only if explicitly requested via ?skip=true
      if (params.get('skip') === 'true') {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#000000] text-[#F5F5F2] selection:bg-[#FF2B25] selection:text-white flex flex-col relative">
      {/* 1. Cinematic 3D Stage Opening Ceremony Intro */}
      {isIntroActive && (
        <CinematicStage
          onComplete={() => {
            setIsIntroActive(false);
            if (typeof window !== 'undefined') {
              window.scrollTo(0, 0);
            }
          }}
        />
      )}

      {/* 2. Main Website Home Page (Revealed upon ceremony completion) */}
      <div className={`w-full flex flex-col transition-opacity duration-700 ${isIntroActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 min-h-screen'}`}>
        {/* Full-width Grid Architectural Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {/* Full-screen Edge-to-Edge UNTAPPED Hero Section */}
          <Hero />

          {/* What is TEDx Section (Directly below Hero Header) */}
          <WhatIsTEDxSection />

          {/* Cinematic Scroll-Driven Visual Expansion Section */}
          <ScrollExpansionSection />

          {/* 50/50 Split Stage Video (16:9 Frame) & TEDx CIT Mission Section */}
          <AboutVideoSection
            videoSrc="/videos/tedx-cit-speaker.mp4"
            posterSrc="/images/tedx-speaker-stage-poster.jpg"
          />

          {/* 3-Frame Rotating Stage Showcase Section (Cycles every 3 seconds to new 3 images) */}
          {/* USER IMAGES PROMPT:
              To supply your own custom images, pass imageSets prop or update DEFAULT_IMAGE_SETS.
          */}
          <CinematicFramesSection intervalMs={3000} />

          {/* Dynamic Scroll Count-Up Impact Metrics Section (A Decade of Impact) */}
          <ImpactStatsSection />

          {/* Past Events Glassy Cards Section (Past events. Lasting ideas.) */}
          <PastEventsSection />

          {/* Infinite Marquee Sponsors Section (Our Sponsors) */}
          <SponsorSection />
        </main>

        {/* Global Footer (Matching Reference Layout) */}
        <Footer />
      </div>
    </div>
  );
}

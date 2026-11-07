'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Handshake } from 'lucide-react';

export interface SponsorItem {
  name: string;
  logo: string;
  category?: string;
}

export interface SponsorSectionProps {
  /** Section heading */
  title?: string;
  /** Eyebrow label */
  eyebrow?: string;
  /** Optional custom sponsors array */
  sponsors?: SponsorItem[];
  /** Optional custom CSS classes */
  className?: string;
}

const DEFAULT_SPONSORS: SponsorItem[] = [
  { name: 'AGS Cinemas', logo: 'AGS', category: 'Entertainment Partner' },
  { name: 'Aswins', logo: 'ASW', category: 'Hospitality Partner' },
  { name: 'BIG FM', logo: '92.7 BIG', category: 'Radio Partner' },
  { name: 'Deyga Organics', logo: 'DEYGA', category: 'Wellness Partner' },
  { name: 'Krafton Gaming', logo: 'KRAFTON', category: 'Gaming Partner' },
  { name: 'Pepsi', logo: 'PEPSI', category: 'Beverage Partner' },
  { name: 'Vikatan Media', logo: 'VIKATAN', category: 'Media Partner' },
];

interface SponsorCardProps {
  name: string;
  logo: string;
  category?: string;
  index: number;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ name, logo, category, index }) => {
  return (
    <div
      className="sponsor-card-wrapper group relative mx-4 sm:mx-6 w-[320px] sm:w-[360px] lg:w-[380px] shrink-0 select-none cursor-pointer"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* 1. Gradient Border Glow on Hover (TEDx Crimson) */}
      <div className="absolute -inset-px rounded-2xl opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100 bg-gradient-to-r from-[#EB0028] via-[#EB0028] to-[#C80022]" />

      {/* 2. Ambient Deep Red Glow behind Card */}
      <div className="absolute -inset-4 rounded-3xl bg-[#EB0028]/0 blur-2xl transition-all duration-500 group-hover:bg-[#EB0028]/25 pointer-events-none" />

      {/* 3. Glassy Card Container */}
      <div className="sponsor-card relative overflow-hidden rounded-2xl bg-[#0A0A0C]/85 backdrop-blur-xl border border-white/10 p-7 sm:p-8 transition-all duration-500 group-hover:border-[#EB0028]/70 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_50px_-15px_rgba(235,0,40,0.4)]">
        
        {/* Shimmer Light Reflection on Hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer pointer-events-none" />

        {/* Top Partner Category Pill (if present) */}
        {category && (
          <div className="flex justify-center mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8E93] group-hover:text-[#EB0028] transition-colors">
              {category}
            </span>
          </div>
        )}

        {/* Logo Monogram / Display Area */}
        <div className="flex h-20 sm:h-24 items-center justify-center">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-[#EB0028] transition-colors duration-300 font-['Inter',sans-serif]">
            {logo}
          </span>
        </div>

        {/* TED Red Center Divider Line */}
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#EB0028]/60 to-transparent" />

        {/* Sponsor Brand Name */}
        <p className="text-center text-sm sm:text-base font-semibold text-[#A0A0A5] transition-colors duration-300 group-hover:text-white">
          {name}
        </p>

        {/* Corner Architectural Brackets (Active on Hover) */}
        <div className="absolute left-3.5 top-3.5 h-6 sm:h-7 w-6 sm:w-7 border-l-2 border-t-2 border-white/20 group-hover:border-[#EB0028] transition-colors duration-300" />
        <div className="absolute bottom-3.5 right-3.5 h-6 sm:h-7 w-6 sm:w-7 border-b-2 border-r-2 border-white/20 group-hover:border-[#EB0028] transition-colors duration-300" />
      </div>
    </div>
  );
};

const cinematicEase = [0.16, 1, 0.3, 1] as const;

/**
 * SponsorSection — Continuous Horizontal Infinite Marquee with AI Slope Architecture
 */
export const SponsorSection: React.FC<SponsorSectionProps> = ({
  eyebrow = 'OUR SUPPORTERS & COLLABORATORS',
  title = 'Our Sponsors',
  sponsors = DEFAULT_SPONSORS,
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  /* ========= ENTRY ANIMATION VIA INTERSECTION OBSERVER ========= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('enter-active');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="sponsors-section"
      className={`relative w-full bg-[#000000] py-24 sm:py-28 lg:py-32 border-t border-[#1C1C1E] overflow-hidden enter-section ${className}`}
      aria-label="TEDx Chennai Institute of Technology Sponsors and Partners"
    >
      {/* Refined Theatrical Ambient Red Hue */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-[#EB0028]/14 rounded-full blur-[200px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* ================= SECTION TITLE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.85, ease: cinematicEase }}
        className="relative z-10 mb-16 sm:mb-20 text-center px-4"
      >
        {/* Monospace Eyebrow */}
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#8E8E93]">
            {eyebrow}
          </span>
        </div>

        {/* Main Title with Two-Tone Red + White */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Inter',sans-serif]">
          <span>Our </span>
          <span className="relative inline-block">
            <span className="text-[#EB0028] drop-shadow-[0_4px_24px_rgba(235,0,40,0.3)]">Sponsors</span>
            {/* TED Red Underline Bar */}
            <span
              className="absolute -bottom-3 sm:-bottom-4 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#EB0028] to-transparent opacity-80"
              aria-hidden="true"
            />
          </span>
        </h2>
      </motion.div>

      {/* ================= INFINITE MARQUEE SLIDER ================= */}
      <div className="relative z-10 mt-12 sm:mt-16">
        {/* Left and Right Edge Vignette Fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-44 z-20 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-44 z-20 bg-gradient-to-l from-black via-black/80 to-transparent" />

        <div className="sponsor-marquee-container flex overflow-hidden">
          {/* Track 1: First continuous run */}
          <div className="sponsor-track flex shrink-0 items-center">
            {sponsors.map((sponsor, idx) => (
              <div key={`track1-${idx}`} className="sponsor-item">
                <SponsorCard
                  name={sponsor.name}
                  logo={sponsor.logo}
                  category={sponsor.category}
                  index={idx}
                />
              </div>
            ))}
          </div>

          {/* Track 2: Seamless duplicate run for infinite marquee */}
          <div className="sponsor-track flex shrink-0 items-center" aria-hidden="true">
            {sponsors.map((sponsor, idx) => (
              <div key={`track2-${idx}`} className="sponsor-item">
                <SponsorCard
                  name={sponsor.name}
                  logo={sponsor.logo}
                  category={sponsor.category}
                  index={idx}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Partnership Call to Action */}
      <div className="relative z-10 mt-16 sm:mt-20 flex justify-center px-4">
        <a
          href="/partner-with-us"
          onClick={(e) => handleNavigate(e, '/partner-with-us')}
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.18em] text-[#A0A0A5] hover:text-white hover:border-[#EB0028]/60 hover:bg-[#EB0028]/10 transition-all duration-300"
        >
          <Handshake className="w-3.5 h-3.5 text-[#EB0028]" />
          <span>BECOME AN OFFICIAL PARTNER</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#EB0028]" />
        </a>
      </div>

      {/* ================= PURE CSS FOR 60FPS SMOOTH MARQUEE ================= */}
      <style>{`
        /* -------- SECTION ENTRY TRANSITION -------- */
        .enter-section {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .enter-section.enter-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* -------- INFINITE HORIZONTAL SCROLL TICKER -------- */
        .sponsor-marquee-container {
          width: 100%;
          cursor: grab;
        }

        .sponsor-track {
          animation: marqueeScroll 32s linear infinite;
          will-change: transform;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause scroll when ANY card is hovered */
        .sponsor-track:has(.sponsor-item:hover) {
          animation-play-state: paused;
        }

        /* -------- SPACING & Z-INDEX -------- */
        .sponsor-item {
          padding: 0 4px;
          position: relative;
          z-index: 1;
        }

        .sponsor-item:hover {
          z-index: 100;
        }

        /* -------- HOVER SCALE & CARD TRANSITIONS -------- */
        .sponsor-item:hover .sponsor-card {
          transform: scale(1.15);
        }

        .sponsor-card {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.35s ease,
                      box-shadow 0.35s ease;
          will-change: transform;
        }

        /* -------- SHIMMER ANIMATION -------- */
        @keyframes shimmerWave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .group:hover .animate-shimmer {
          animation: shimmerWave 1.4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default SponsorSection;

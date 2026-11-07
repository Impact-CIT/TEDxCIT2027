'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, Compass, Zap } from 'lucide-react';

export interface WhyUntappedSectionProps {
  /** Optional subhead text */
  subhead?: string;
  /** Optional CTA button text */
  ctaText?: string;
  /** Optional CTA link */
  ctaLink?: string;
  /** Optional custom CSS classes */
  className?: string;
}

const transitionEase = [0.16, 1, 0.3, 1] as const;

/**
 * WhyUntappedSection — 50/50 Split Theme Curatorial Manifesto
 * with High-End Architectural Styling & Framer Motion Suite
 *
 * Placed below "Moments That Spark Transformation" and above "Past Events".
 *
 * Implements:
 * - Institutional architectural caliber matching WhatIsTEDxSection.
 * - Staggered Framer Motion entrance reveals.
 * - 3 interactive pillar cards: Latent Depths, Unmapped Inquiry, Catalytic Courage.
 * - Two-tone White + TED Red headings, uniform non-italic typography, zero emojis.
 */
export const WhyUntappedSection: React.FC<WhyUntappedSectionProps> = ({
  subhead = 'THEME CONCEPT & CURATORIAL MANIFESTO',
  ctaText = 'EXPLORE 2027 LINEUP',
  ctaLink = '/speakers',
  className = '',
}) => {
  // Universal client navigation handler
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
      id="why-untapped"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-24 sm:py-28 lg:py-36 relative overflow-hidden ${className}`}
      aria-label="Why UNTAPPED Theme"
    >
      {/* Background Ambient Stage Red Hue */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#EB0028]/14 rounded-full blur-[200px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* FULL SCREEN WIDTH CONTAINER (50/50 Split Layout) */}
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
        
        {/* =========================================================================
            LEFT COLUMN (50%): Iconic UNTAPPED Architectural Brand Card
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: transitionEase }}
          className="w-full flex flex-col justify-center"
        >
          <div className="w-full rounded-2xl bg-[#09090C]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-10 lg:p-12 xl:p-14 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] group transition-all duration-500 hover:border-[#EB0028]/50 hover:shadow-[0_30px_90px_rgba(235,0,40,0.18)]">
            
            {/* Ambient Theatrical Red Glow inside Card */}
            <div
              className="absolute -top-28 -right-28 w-80 h-80 bg-[#EB0028]/12 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-125"
              aria-hidden="true"
            />

            {/* Top Brand Tag */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB0028] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EB0028]" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#8E8E93]">
                  THEME CURATION // TEDxCIT
                </span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#6E6E73]">
                EDITION 06
              </span>
            </div>

            {/* Huge UNTAPPED Lettermark */}
            <div className="mb-10 select-none">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tight leading-none text-[#EB0028] font-['Inter',sans-serif] uppercase drop-shadow-[0_8px_30px_rgba(235,0,40,0.25)]">
                UNTAPPED
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-0.5 w-8 bg-[#EB0028]" />
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[#A0A0A5]">
                  THE POWER OF UNCHARTED POTENTIAL
                </span>
              </div>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              
              {/* Pillar 1: Latent Depths */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#EB0028]/40 hover:bg-[#EB0028]/5 group/pillar">
                <div className="flex items-center gap-2 text-[#EB0028] mb-2">
                  <Flame className="w-4 h-4 transition-transform duration-300 group-hover/pillar:scale-110" />
                  <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                    LATENT DEPTHS
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed group-hover/pillar:text-[#D1D1D6] transition-colors">
                  Unseen reserves of human intellect, resilience, and creative intuition.
                </p>
              </div>

              {/* Pillar 2: Unmapped Inquiry */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#EB0028]/40 hover:bg-[#EB0028]/5 group/pillar">
                <div className="flex items-center gap-2 text-[#EB0028] mb-2">
                  <Compass className="w-4 h-4 transition-transform duration-300 group-hover/pillar:scale-110" />
                  <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                    UNMAPPED INQUIRY
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed group-hover/pillar:text-[#D1D1D6] transition-colors">
                  Daring to question rigid silos and cross into unfamiliar territories.
                </p>
              </div>

              {/* Pillar 3: Catalytic Courage */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#EB0028]/40 hover:bg-[#EB0028]/5 group/pillar">
                <div className="flex items-center gap-2 text-[#EB0028] mb-2">
                  <Zap className="w-4 h-4 transition-transform duration-300 group-hover/pillar:scale-110" />
                  <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                    CATALYTIC COURAGE
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed group-hover/pillar:text-[#D1D1D6] transition-colors">
                  Translating hidden ideas into monumental shifts that redefine tomorrow.
                </p>
              </div>

            </div>

            {/* Bottom Glow Line on Hover */}
            <div
              className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#EB0028] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* =========================================================================
            RIGHT COLUMN (50%): Headline & Descriptive Copy with Framer Reveal
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: transitionEase, delay: 0.12 }}
          className="w-full flex flex-col justify-center"
        >
          {/* Eyebrow Label */}
          <div className="mb-4 sm:mb-5 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.22em] text-[#8E8E93]">
              {subhead}
            </span>
          </div>

          {/* Two-Tone Headline: "WHY" in White + "UNTAPPED?" in TED Red */}
          <div className="mb-8 font-['Inter',sans-serif]">
            <h2 className="flex items-baseline gap-x-3 sm:gap-x-4 flex-wrap whitespace-nowrap">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-6xl font-extrabold tracking-tight text-white uppercase leading-none">
                WHY
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-6xl font-black text-[#EB0028] tracking-tight leading-none drop-shadow-[0_4px_24px_rgba(235,0,40,0.25)]">
                UNTAPPED?
              </span>
            </h2>
          </div>

          {/* Curatorial Narrative */}
          <div className="space-y-4 sm:space-y-5 text-[#A0A0A5] text-[15px] sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed font-normal mb-10 max-w-2xl">
            <p>
              Human history is shaped not by what was obvious, but by what lay quietly beneath the surface. <strong className="text-white font-medium">UNTAPPED</strong> represents the reservoir of dormant possibilities — unconventional thoughts, suppressed inquiries, and emerging paradigms that are yet to be revealed.
            </p>
            <p>
              At TEDx Chennai Institute of Technology 2027, our curatorial vision focuses on breakthroughs at the boundary lines: from artificial cognition and biomimetic urban design to non-linear storytelling and grassroots resilience.
            </p>
            <p>
              Stepping into the red circle is an invitation to cross past comfortable certainties. We gather not just to witness inspiring talks, but to catalyze dialogues that unlock the <strong className="text-white font-medium">untapped genius</strong> within our community and beyond.
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <a
              href={ctaLink}
              onClick={(e) => handleNavigate(e, ctaLink)}
              className="group relative inline-flex items-center gap-3 bg-[#EB0028] hover:bg-[#C80022] active:bg-[#C80022] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.16em] px-8 py-4.5 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-[#EB0028]/25 hover:shadow-[#EB0028]/45 hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="relative z-10">{ctaText}</span>
              <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

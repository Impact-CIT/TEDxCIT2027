'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Lightbulb, Users } from 'lucide-react';

export interface WhatIsTEDxSectionProps {
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
 * WhatIsTEDxSection — High-End Editorial & Architectural 50/50 Section
 *
 * Designed to institutional perfection:
 * - Left 50%: The Iconic TEDx Architectural Brand Dossier with refined pillars and subtle crimson stage glow.
 * - Right 50%: Editorial typographic layout explaining the global TEDx initiative.
 * - Restrained, ultra-smooth Framer Motion viewport entrance animations.
 * - Zero emojis, uniform non-italic typography, crisp two-tone White + TED Red headings.
 */
export const WhatIsTEDxSection: React.FC<WhatIsTEDxSectionProps> = ({
  subhead = 'x = INDEPENDENTLY ORGANIZED TED EVENT',
  ctaText = 'LEARN MORE ABOUT TEDx',
  ctaLink = 'https://www.ted.com/about/programs-initiatives/tedx-program',
  className = '',
}) => {
  return (
    <section
      id="what-is-tedx"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-24 sm:py-28 lg:py-36 relative overflow-hidden ${className}`}
      aria-label="What is TEDx"
    >
      {/* Refined Theatrical Crimson Backdrop Glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#EB0028]/14 rounded-full blur-[200px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* FULL SCREEN WIDTH CONTAINER (50/50 Split Layout) */}
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
        
        {/* =========================================================================
            LEFT COLUMN (50%): Iconic TEDx Architectural Brand Card
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: transitionEase }}
          className="w-full flex flex-col justify-center"
        >
          <div className="w-full rounded-2xl bg-[#09090C]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-10 lg:p-12 xl:p-14 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] group transition-all duration-500 hover:border-[#EB0028]/50 hover:shadow-[0_30px_90px_rgba(235,0,40,0.18)]">
            
            {/* Theatrical Ambient Red Glow inside Card */}
            <div
              className="absolute -top-28 -right-28 w-80 h-80 bg-[#EB0028]/12 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-125"
              aria-hidden="true"
            />

            {/* Top Status Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB0028] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EB0028]" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#8E8E93]">
                  GLOBAL MOVEMENT // TEDx INITIATIVE
                </span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#6E6E73]">
                EST. 2009
              </span>
            </div>

            {/* Massive Official TEDx Lettermark */}
            <div className="mb-10 select-none">
              <div className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none text-[#EB0028] font-['Inter',sans-serif] drop-shadow-[0_8px_30px_rgba(235,0,40,0.25)]">
                TED<span className="lowercase font-bold text-[0.8em]">x</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-0.5 w-8 bg-[#EB0028]" />
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[#A0A0A5]">
                  x = independently organized event
                </span>
              </div>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              
              {/* Pillar 1: Ideas */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#EB0028]/40 hover:bg-[#EB0028]/5 group/pillar">
                <div className="flex items-center gap-2 text-[#EB0028] mb-2">
                  <Lightbulb className="w-4 h-4 transition-transform duration-300 group-hover/pillar:scale-110" />
                  <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                    IDEAS
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed group-hover/pillar:text-[#D1D1D6] transition-colors">
                  Catalysts that challenge conventions and ignite deep inquiry.
                </p>
              </div>

              {/* Pillar 2: Community */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#EB0028]/40 hover:bg-[#EB0028]/5 group/pillar">
                <div className="flex items-center gap-2 text-[#EB0028] mb-2">
                  <Users className="w-4 h-4 transition-transform duration-300 group-hover/pillar:scale-110" />
                  <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                    COMMUNITY
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed group-hover/pillar:text-[#D1D1D6] transition-colors">
                  Grassroots changemakers united by boundless curiosity.
                </p>
              </div>

              {/* Pillar 3: Global */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-300 hover:border-[#EB0028]/40 hover:bg-[#EB0028]/5 group/pillar">
                <div className="flex items-center gap-2 text-[#EB0028] mb-2">
                  <Globe className="w-4 h-4 transition-transform duration-300 group-hover/pillar:scale-110" />
                  <span className="font-mono text-xs tracking-wider uppercase text-white font-bold">
                    GLOBAL
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] leading-relaxed group-hover/pillar:text-[#D1D1D6] transition-colors">
                  Dialogues that travel far beyond regional borders.
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
          {/* Eyebrow with Pulsing Dot */}
          <div className="mb-4 sm:mb-5 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.22em] text-[#8E8E93]">
              {subhead}
            </span>
          </div>

          {/* Two-Tone Headline: "WHAT IS" (white) + "TEDx?" (TED Red) */}
          <div className="mb-8 font-['Inter',sans-serif]">
            <h2 className="flex items-baseline gap-x-3 sm:gap-x-4 flex-wrap whitespace-nowrap">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-6xl font-extrabold tracking-tight text-white uppercase leading-none">
                WHAT IS
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[54px] 2xl:text-6xl font-black text-[#EB0028] tracking-tight leading-none drop-shadow-[0_4px_24px_rgba(235,0,40,0.25)]">
                TED<span className="lowercase font-bold text-[0.8em]">x</span>?
              </span>
            </h2>
          </div>

          {/* Descriptive Copy with Elegant Typography */}
          <div className="space-y-4 sm:space-y-5 text-[#A0A0A5] text-[15px] sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed font-normal mb-10 max-w-2xl">
            <p>
              In the spirit of ideas worth spreading, TED has created a program called <strong className="text-white font-medium">TEDx</strong>. TEDx is a program of local, self-organized events that bring people together to share a TED-like experience.
            </p>
            <p>
              At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where <strong className="text-white font-medium">x = independently organized TED event</strong>.
            </p>
            <p>
              The TED Conference provides general guidance for the TEDx program, but individual TEDx events, including ours at <strong className="text-white font-medium">Chennai Institute of Technology</strong>, are self-organized under a free license granted by TED.
            </p>
          </div>

          {/* Professional Action CTA Button */}
          <div className="pt-2">
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
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

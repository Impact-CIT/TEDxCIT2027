'use client';

import React from 'react';
import { ArrowUpRight, Sparkles, Globe, Lightbulb, Users } from 'lucide-react';

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

/**
 * WhatIsTEDxSection — 50/50 Split "What is TEDx?" Section
 * Positioned directly below the UNTAPPED Hero Header section.
 *
 * Modeled after the architectural caliber of AboutVideoSection:
 * - Left 50%: Iconic TEDx brand card with definition, pillars, and subtle crimson glow
 * - Right 50%:
 *    - Subhead: "x = INDEPENDENTLY ORGANIZED TED EVENT"
 *    - Line 1: "WHAT IS" in pure white
 *    - Line 2: "TEDx" in official TED red (#EB0028)
 *    - 3 readable paragraphs explaining the global TEDx initiative
 *    - "LEARN MORE ABOUT TEDx ↗" CTA button
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
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-16 sm:py-20 lg:py-28 relative overflow-hidden ${className}`}
      aria-label="What is TEDx"
    >
      {/* Background Ambient Stage Red Hue */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#EB0028]/7 rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />

      {/* FULL SCREEN WIDTH CONTAINER (50/50 Split Layout) */}
      <div className="w-full px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center">
        
        {/* =========================================================================
            LEFT COLUMN (50%): Iconic TEDx Architectural Brand Card
            ========================================================================= */}
        <div className="w-full flex flex-col justify-center">
          <div className="w-full rounded-sm bg-[#080808] border border-[#262626] p-8 sm:p-10 lg:p-12 xl:p-14 relative overflow-hidden shadow-2xl group transition-all duration-300 hover:border-[#EB0028]/40">
            
            {/* Ambient Background Gradient */}
            <div
              className="absolute -top-20 -right-20 w-80 h-80 bg-[#EB0028]/12 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Top Brand Tag */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#1C1C1E]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#8E8E93]">
                  GLOBAL MOVEMENT
                </span>
              </div>
              <span className="text-[11px] font-mono uppercase text-[#6E6E73] tracking-widest">
                EST. 2009
              </span>
            </div>

            {/* Huge Official TEDx Lettermark */}
            <div className="mb-8 select-none">
              <div className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none text-[#EB0028] font-['Inter',sans-serif]">
                TED<span className="lowercase font-bold text-[0.8em]">x</span>
              </div>
              <div className="mt-3 font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8E8E93]">
                x = independently organized event
              </div>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1C1C1E]">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[#EB0028]">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px] tracking-wider uppercase text-white font-semibold">
                    IDEAS
                  </span>
                </div>
                <span className="text-xs text-[#8E8E93] leading-relaxed">
                  Catalysts that challenge conventions and ignite inquiry.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[#EB0028]">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px] tracking-wider uppercase text-white font-semibold">
                    COMMUNITY
                  </span>
                </div>
                <span className="text-xs text-[#8E8E93] leading-relaxed">
                  Local grassroots changemakers united by curiosity.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[#EB0028]">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px] tracking-wider uppercase text-white font-semibold">
                    GLOBAL
                  </span>
                </div>
                <span className="text-xs text-[#8E8E93] leading-relaxed">
                  Discussions that travel far beyond regional borders.
                </span>
              </div>
            </div>

            {/* Bottom Hover Laser */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EB0028] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (50%): Headline & Descriptive Copy
            ========================================================================= */}
        <div className="w-full flex flex-col justify-center">
          
          {/* 1. Small Subhead / Eyebrow */}
          <div className="mb-4 sm:mb-5 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EB0028]" aria-hidden="true" />
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.2em] text-[#8E8E93]">
              {subhead}
            </span>
          </div>

          {/* 2. Headline:
              Line 1: "WHAT IS" (white)
              Line 2: "TEDx" (red)
          */}
          <div className="mb-7 sm:mb-8 font-['Inter',sans-serif]">
            {/* Line 1: WHAT IS in White */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white uppercase leading-none mb-2 sm:mb-3">
              WHAT IS
            </h2>

            {/* Line 2: TEDx in RED */}
            <div className="flex items-baseline gap-x-2.5 sm:gap-x-3.5">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black text-[#EB0028] tracking-tight">
                TED<span className="lowercase font-bold text-[0.8em]">x</span>?
              </span>
            </div>
          </div>

          {/* 3. Description (3 readable paragraphs with elegant typography) */}
          <div className="space-y-4 sm:space-y-5 text-[#A0A0A5] text-[15px] sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed font-normal mb-8 sm:mb-10 max-w-2xl">
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

          {/* 4. Action CTA Button */}
          <div className="pt-1">
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-[#EB0028] hover:bg-[#D00024] active:bg-[#B5001F] text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] px-8 py-4.5 rounded-none transition-all duration-200 cursor-pointer shadow-lg shadow-[#EB0028]/25 hover:shadow-[#EB0028]/40 hover:-translate-y-0.5"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

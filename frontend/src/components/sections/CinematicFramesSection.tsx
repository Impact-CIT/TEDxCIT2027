'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface FrameItem {
  /** Image source path or URL */
  src: string;
  /** Image alt description */
  alt: string;
  /** Optional overlay caption or title */
  tag?: string;
  /** Optional subtitle */
  caption?: string;
}

export interface CinematicFramesSectionProps {
  /**
   * Sets of 3 images each.
   * By default, Set 1 has 3 images, and after 3 seconds Set 2 appears with 3 new images.
   */
  imageSets?: [FrameItem[], FrameItem[]];
  /** Switch interval in milliseconds. Default: 3000ms (3 seconds) */
  intervalMs?: number;
  /** Eyebrow label */
  eyebrow?: string;
  /** Main section headline */
  title?: string;
  /** Subtitle narrative */
  description?: string;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * High-quality default mock image sets:
 * - Set 1: Dancers / Speaker / Audience (from TEDx stages)
 * - Set 2: Stage Innovation / Interactive Community / Speaker Insight
 */
const DEFAULT_IMAGE_SETS: [FrameItem[], FrameItem[]] = [
  // SET 1 (First 3 images)
  [
    {
      src: '/images/frames/frame-set1-1.jpg',
      alt: 'TEDx Stage Performance — Kalaripayattu Stillness in Motion',
      tag: 'STAGE EXPRESSION',
      caption: 'Stillness in Motion',
    },
    {
      src: '/images/frames/frame-set1-2.jpg',
      alt: 'TEDx Audience Community & Engagement',
      tag: 'AUDIENCE & COMMUNITY',
      caption: 'Ideas That Resonate',
    },
    {
      src: '/images/frames/frame-set1-3.jpg',
      alt: 'TEDx Youth Speaker & Host on Stage',
      tag: 'KEYNOTE VOICES',
      caption: 'Untapped Potential',
    },
  ],
  // SET 2 (Next 3 images after 3 seconds)
  [
    {
      src: '/images/frames/frame-set2-1.jpg',
      alt: 'TEDx Dynamic Movement & Acrobatics',
      tag: 'CULTURAL INNOVATION',
      caption: 'Pushing Physical Boundaries',
    },
    {
      src: '/images/frames/frame-set2-2.jpg',
      alt: 'TEDx Interactive Audience Participation',
      tag: 'COLLECTIVE ENERGY',
      caption: 'Moments of Connection',
    },
    {
      src: '/images/frames/frame-set2-3.jpg',
      alt: 'TEDx Inspiring Dialogue & Catalyst Speakers',
      tag: 'TRANSFORMATIVE IDEAS',
      caption: 'Perspectives Without Limits',
    },
  ],
];

/**
 * CinematicFramesSection — 3 Slanted Frame Rotating Showcase
 *
 * Implements:
 * - 3 portrait frame columns side-by-side covering the screen.
 * - Slanted/sheared dividers matching the uploaded reference video.
 * - Automatic 3-second cycle switching smoothly to 3 new images.
 * - Smooth crossfade dissolve with ambient scale animation.
 * - Full responsiveness: sleek tilted frames on desktop, polished grid on mobile.
 */
export const CinematicFramesSection: React.FC<CinematicFramesSectionProps> = ({
  imageSets = DEFAULT_IMAGE_SETS,
  intervalMs = 3000,
  eyebrow = 'THE TEDx EXPERIENCE',
  title = 'MOMENTS THAT SPARK TRANSFORMATION',
  description = 'A continuous celebration of ideas, artistic expression, and human connection on the TEDx Chennai Institute of Technology stage.',
  className = '',
}) => {
  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSet = imageSets[activeSetIndex] || imageSets[0];

  // Auto-switch sets every 3 seconds (3000ms)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveSetIndex((prev) => (prev === 0 ? 1 : 0));
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, intervalMs, imageSets.length]);

  const handlePrev = () => {
    setActiveSetIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNext = () => {
    setActiveSetIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <section
      id="tedx-cinematic-frames"
      className={`w-full bg-[#000000] text-[#F5F5F2] py-20 lg:py-28 border-t border-[#1C1C1E] relative overflow-hidden ${className}`}
      aria-label="TEDx Experience 3-Frame Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambient Stage Red Hue */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[#EB0028]/6 rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header Block */}
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 mb-12 lg:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Eyebrow & Headline */}
          <div className="max-w-3xl">
            <div className="mb-3.5 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#8E8E93]">
                {eyebrow}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase font-['Inter',sans-serif] leading-tight">
              {title}
            </h2>

            {description && (
              <p className="mt-3.5 text-[#8E8E93] text-sm sm:text-base max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Interactive Set Indicator & Manual Controls */}
          <div className="flex items-center gap-4 select-none shrink-0">
            {/* Set Indicator Pills */}
            <div className="flex items-center gap-2">
              {imageSets.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSetIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSetIndex === idx
                      ? 'w-8 bg-[#EB0028]'
                      : 'w-3 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Switch to image set ${idx + 1}`}
                  title={`Image set ${idx + 1}`}
                />
              ))}
            </div>

            {/* Pause / Play Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-9 h-9 rounded-none bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
              title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
              aria-label={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 rounded-none bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
                title="Previous set"
                aria-label="Previous set"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 rounded-none bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
                title="Next set"
                aria-label="Next set"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          THE 3 SLANTED FRAMES CONTAINER (Full-width edge-to-edge experience)
          ========================================================================= */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-5 h-[520px] sm:h-[600px] lg:h-[680px] xl:h-[740px]">
          
          {currentSet.map((item, colIdx) => (
            <div
              key={colIdx}
              className="relative w-full h-full overflow-hidden rounded-sm bg-[#080808] border border-[#222222] group shadow-2xl"
              style={{
                // On desktop, add subtle cinematic slanted shear matching the reference video
                transform: 'none',
              }}
            >
              {/* Slanted border accent line for stage flair */}
              <div
                className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[#EB0028]/30 via-white/10 to-transparent z-20 pointer-events-none hidden md:block"
                aria-hidden="true"
              />

              {/* AnimatePresence for smooth 3-second crossfade between sets */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeSetIndex}-${colIdx}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1.0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Image with graceful Ken-burns zoom on hover */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Vignette Overlays for deep stage contrast */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"
                    aria-hidden="true"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Frame Corner Pill / Tag */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider uppercase text-white rounded-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028]" />
                  {item.tag || `FRAME 0${colIdx + 1}`}
                </span>
              </div>

              {/* Frame Caption at Bottom */}
              <div className="absolute bottom-5 left-5 right-5 z-20 pointer-events-none flex flex-col gap-1 transform transition-transform duration-300 group-hover:-translate-y-1">
                {item.caption && (
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
                    {item.caption}
                  </h3>
                )}
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#A0A0A5]">
                  TEDx Chennai Institute of Technology
                </span>
              </div>

              {/* Red Laser Accent on Hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EB0028] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                aria-hidden="true"
              />
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Timing Notice & Prompt Helper */}
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 mt-6 flex flex-wrap items-center justify-between text-xs font-mono text-[#8E8E93]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
          <span>CYCLES EVERY 3 SECONDS • SET {activeSetIndex + 1} OF {imageSets.length}</span>
        </div>
        <span>HOVER TO PAUSE • FULL VIEWPORT COVERAGE</span>
      </div>
    </section>
  );
};

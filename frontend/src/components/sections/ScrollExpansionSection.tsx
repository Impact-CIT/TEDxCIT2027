'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollExpansionSectionProps {
  /** Optional custom CSS classes for the section wrapper */
  className?: string;
  /** Optional single image URL */
  imgSrc?: string;
  /** Optional array of image URLs to crossfade between */
  images?: string[];
  /** Optional image alt text */
  imgAlt?: string;
  /** Optional image labels/captions */
  imageLabels?: string[];
  /** Interval in ms between image crossfades (default 4500ms) */
  intervalMs?: number;
}

const DEFAULT_IMAGES = [
  '/images/beyond-seen-1.jpg',
  '/images/beyond-seen-2.jpg',
];

const DEFAULT_LABELS = [
  'Organizing Committee',
  'Team & Crew',
];

/**
 * ScrollExpansionSection — Cinematic Scroll-Driven Visual Expansion
 * for TEDx Chennai Institute of Technology.
 *
 * Implements a rock-solid scroll track architecture:
 * - Outer track has guaranteed scroll distance (240vh desktop / 200vh mobile)
 * - Visual starts at 82% width (92% mobile) × 55vh (48vh mobile) with 6px radius
 * - As the visitor scrolls, GSAP scrubs the visual smoothly to 100vw × 100vh full-bleed
 * - Supports user-provided team photos with smooth crossfade and interactive tabs
 * - Deep cinematic scrim overlay ensures high contrast and legibility for the headline:
 *   "THERE IS MORE THAN MEETS THE EYE."
 */
export const ScrollExpansionSection: React.FC<ScrollExpansionSectionProps> = ({
  className = '',
  imgSrc,
  images,
  imgAlt = 'TEDx Chennai Institute of Technology — Behind the Scenes',
  imageLabels,
  intervalMs = 4500,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);
  const artworkInnerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const scrimOverlayRef = useRef<HTMLDivElement>(null);
  const badgeControlsRef = useRef<HTMLDivElement>(null);

  // Determine active images list
  const resolvedImages = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (imgSrc) return [imgSrc];
    return DEFAULT_IMAGES;
  }, [images, imgSrc]);

  const resolvedLabels = React.useMemo(() => {
    if (imageLabels && imageLabels.length > 0) return imageLabels;
    return DEFAULT_LABELS;
  }, [imageLabels]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through images if multiple are provided
  useEffect(() => {
    if (resolvedImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [resolvedImages.length, intervalMs, isPaused]);

  const handleImageError = useCallback((index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  }, []);

  const allImagesFailed = resolvedImages.every((_, idx) => failedImages[idx]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion: set final expanded state immediately
        gsap.set(visualWrapperRef.current, {
          width: '100vw',
          height: '100svh',
          borderRadius: '0px',
          borderColor: 'transparent',
        });
        gsap.set(labelRef.current, { opacity: 0 });
        gsap.set(badgeControlsRef.current, { opacity: 0 });
        gsap.set(scrimOverlayRef.current, { opacity: 0.85 });
        gsap.set(headlineRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const isMobile = window.innerWidth < 768;
      const initialWidth = isMobile ? '92vw' : '82vw';
      const initialHeight = isMobile ? '48vh' : '55vh';

      // Coordinated master GSAP scrub timeline linked to trackRef
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1a. Eyebrow label fades out quickly as expansion begins
      tl.to(
        labelRef.current,
        {
          opacity: 0,
          y: -22,
          duration: 0.18,
          ease: 'power1.out',
        },
        0
      );

      // 1b. Badge controls fade out as full expansion approaches
      tl.to(
        badgeControlsRef.current,
        {
          opacity: 0,
          y: 15,
          duration: 0.25,
          ease: 'power1.out',
        },
        0.35
      );

      // 2. Expand framed visual from 82% to 100vw, 55vh to 100svh, radius 6px to 0px
      tl.fromTo(
        visualWrapperRef.current,
        {
          width: initialWidth,
          height: initialHeight,
          borderRadius: '6px',
          borderColor: '#292929',
        },
        {
          width: '100vw',
          height: '100svh',
          borderRadius: '0px',
          borderColor: 'transparent',
          ease: 'power2.inOut',
          duration: 0.72,
        },
        0
      );

      // 3. Subtle zoom-in camera push for theatrical depth
      tl.fromTo(
        artworkInnerRef.current,
        {
          scale: 1,
        },
        {
          scale: 1.12,
          ease: 'power1.inOut',
          duration: 0.8,
        },
        0
      );

      // 4. Subtle cinematic scrim deepens to guarantee headline readability
      tl.fromTo(
        scrimOverlayRef.current,
        {
          opacity: 0.15,
        },
        {
          opacity: 0.85,
          ease: 'power2.inOut',
          duration: 0.45,
        },
        0.28
      );

      // 5. Reveal editorial headline "THERE IS MORE THAN MEETS THE EYE."
      tl.fromTo(
        headlineRef.current,
        {
          opacity: 0,
          y: 45,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          duration: 0.45,
        },
        0.48
      );
    }, trackRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className={`relative w-full h-[220vh] sm:h-[240vh] lg:h-[260vh] bg-[#000000] text-[#F5F5F2] font-sans select-none z-30 ${className}`}
      aria-label="Beyond What Is Seen — Theatrical Visual Expansion"
    >
      {/* ========================================================
          STICKY PINNED CONTAINER
          Remains fixed in view while the user scrolls through the 240vh track
          ======================================================== */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen h-[100svh] flex items-center justify-center overflow-hidden"
      >
        {/* ========================================================
            EDITORIAL EYEBROW LABEL
            Positioned above the framed visual prior to expansion
            ======================================================== */}
        <div
          ref={labelRef}
          className="absolute bottom-[calc(50%+28vh+12px)] md:bottom-[calc(50%+28.5vh+18px)] text-center transition-opacity duration-300 pointer-events-none z-20"
        >
          <span className="font-mono text-[11px] sm:text-xs md:text-[13px] tracking-[0.24em] uppercase text-[#8E8E93]">
            BEYOND WHAT IS SEEN
          </span>
        </div>

        {/* ========================================================
            CENTERED RECTANGULAR VISUAL
            Expands from 82% width / 55vh height to full 100vw / 100vh
            ======================================================== */}
        <div
          ref={visualWrapperRef}
          className="relative flex items-center justify-center overflow-hidden shadow-2xl shadow-black/90 border border-[#292929] will-change-[width,height,border-radius,border-color] w-[92vw] md:w-[82vw] h-[48vh] md:h-[55vh] rounded-[6px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Inner Artwork / Image Container (Scales smoothly during scrub) */}
          <div
            ref={artworkInnerRef}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            {!allImagesFailed ? (
              /* Custom User-Provided Photos (Crossfading) */
              resolvedImages.map((src, idx) => {
                const isVisible = idx === currentIndex && !failedImages[idx];
                return (
                  <div
                    key={src}
                    className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      zIndex: isVisible ? 2 : 1,
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                  >
                    <img
                      src={src}
                      alt={resolvedLabels[idx] || `${imgAlt} - Photo ${idx + 1}`}
                      onError={() => handleImageError(idx)}
                      className="w-full h-full object-cover object-[center_32%] select-none pointer-events-none"
                    />
                  </div>
                );
              })
            ) : (
              /* Fallback Original Abstract Glowing Crimson UNTAPPED Artwork */
              <svg
                className="w-full h-full object-cover"
                viewBox="0 0 1600 1000"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                role="img"
                aria-label={imgAlt}
              >
                <defs>
                  <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#1C0206" />
                    <stop offset="45%" stopColor="#0A0103" />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>
                  <radialGradient id="coreBloom" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EB0028" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#EB0028" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#66000F" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ribbonRed1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EB0028" />
                    <stop offset="40%" stopColor="#EB0028" />
                    <stop offset="85%" stopColor="#5E000C" />
                    <stop offset="100%" stopColor="#170003" />
                  </linearGradient>
                </defs>
                <rect width="1600" height="1000" fill="url(#bgGrad)" />
                <circle cx="800" cy="500" r="460" fill="url(#coreBloom)" />
              </svg>
            )}
          </div>

          {/* ========================================================
              CINEMATIC SCRIM OVERLAY
              Darkens as visual reaches full-bleed to guarantee text legibility
              ======================================================== */}
          <div
            ref={scrimOverlayRef}
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/65 pointer-events-none will-change-[opacity] z-10"
          />

          {/* ========================================================
              IMAGE SELECTOR TABS / PILLS
              Allows viewing each photo directly with active indicator
              ======================================================== */}
          {resolvedImages.length > 1 && !allImagesFailed && (
            <div
              ref={badgeControlsRef}
              className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-25 flex items-center gap-2 pointer-events-auto will-change-[opacity,transform]"
            >
              {resolvedImages.map((src, idx) => {
                const isActive = idx === currentIndex;
                const label = resolvedLabels[idx] || `Photo 0${idx + 1}`;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all duration-300 border backdrop-blur-md cursor-pointer ${
                      isActive
                        ? 'bg-[#EB0028]/95 text-white border-[#EB0028] shadow-[0_0_18px_rgba(235,0,40,0.6)]'
                        : 'bg-black/60 text-[#F5F5F2]/75 border-white/20 hover:border-white/50 hover:text-white'
                    }`}
                    aria-label={`Show ${label}`}
                  >
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        isActive ? 'bg-white' : 'bg-[#8E8E93] group-hover:bg-white'
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ========================================================
              EDITORIAL TRANSITION HEADLINE
              "THERE IS MORE THAN MEETS THE EYE."
              ======================================================== */}
          <div
            ref={headlineRef}
            className="relative z-20 flex flex-col items-center justify-center text-center px-6 sm:px-10 max-w-5xl will-change-[opacity,transform] pointer-events-none"
          >
            <span className="font-mono text-xs sm:text-sm tracking-[0.28em] text-[#EB0028] uppercase mb-4 sm:mb-6 font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              THE UNEXPLORED REALITY
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-black tracking-[-0.04em] sm:tracking-[-0.055em] leading-[1.04] text-[#FFFFFF] select-none drop-shadow-[0_8px_40px_rgba(0,0,0,0.95)]">
              <span>THERE IS </span>
              <span className="text-[#EB0028] drop-shadow-[0_0_35px_rgba(235,0,40,0.85)]">MORE</span>
              <span className="block mt-1 sm:mt-2">
                <span>THAN </span>
                <span className="text-[#EB0028] drop-shadow-[0_0_35px_rgba(235,0,40,0.85)]">MEETS</span>
                <span> THE EYE.</span>
              </span>
            </h2>

            <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base md:text-lg text-[#E0E0E0] font-normal leading-relaxed tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
              Every groundbreaking breakthrough began as an invisible spark waiting beneath the surface.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollExpansionSection;

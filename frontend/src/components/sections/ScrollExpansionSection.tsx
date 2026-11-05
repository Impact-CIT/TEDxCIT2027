'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollExpansionSectionProps {
  /** Optional custom CSS classes for the section wrapper */
  className?: string;
  /** Optional custom image URL (the user can supply their own photo/artwork) */
  imgSrc?: string;
  /** Optional image alt text */
  imgAlt?: string;
}

/**
 * ScrollExpansionSection — Cinematic Scroll-Driven Visual Expansion
 * for TEDx Chennai Institute of Technology.
 *
 * Implements a rock-solid scroll track architecture:
 * - Outer track has guaranteed scroll distance (240vh desktop / 200vh mobile)
 * - Visual starts at 82% width (92% mobile) × 55vh (48vh mobile) with 6px radius
 * - As the visitor scrolls, GSAP scrubs the visual smoothly to 100vw × 100vh full-bleed
 * - First-class image support: Accepts custom image (imgSrc) or renders the UNTAPPED abstract visual
 * - Reveals the bold editorial headline "THERE IS MORE THAN MEETS THE EYE."
 */
export const ScrollExpansionSection: React.FC<ScrollExpansionSectionProps> = ({
  className = '',
  imgSrc,
  imgAlt = 'TEDx Chennai Institute of Technology — UNTAPPED Visual Artwork',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);
  const artworkInnerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const scrimOverlayRef = useRef<HTMLDivElement>(null);

  const [imageError, setImageError] = useState(false);

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
        gsap.set(scrimOverlayRef.current, { opacity: 0.65 });
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

      // 1. Label fades out as expansion begins
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
          scale: 1.15,
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
          opacity: 0.65,
          ease: 'power2.inOut',
          duration: 0.45,
        },
        0.35
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
        0.5
      );
    }, trackRef);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  const hasCustomImage = Boolean(imgSrc && !imageError);

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
        >
          {/* Inner Artwork / Image Container (Scales smoothly during scrub) */}
          <div
            ref={artworkInnerRef}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            {hasCustomImage ? (
              /* Custom User-Provided Image */
              <img
                src={imgSrc}
                alt={imgAlt}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              /* Original Abstract Glowing Crimson UNTAPPED Artwork */
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
                  <radialGradient
                    id="bgGrad"
                    cx="50%"
                    cy="50%"
                    r="70%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="#1C0206" />
                    <stop offset="45%" stopColor="#0A0103" />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>

                  <radialGradient
                    id="coreBloom"
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor="#FF2B25" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#EB0028" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#66000F" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient
                    id="ribbonRed1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FF4D5A" />
                    <stop offset="40%" stopColor="#EB0028" />
                    <stop offset="85%" stopColor="#5E000C" />
                    <stop offset="100%" stopColor="#170003" />
                  </linearGradient>

                  <linearGradient
                    id="ribbonRed2"
                    x1="100%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="20%" stopColor="#FF4D5A" />
                    <stop offset="60%" stopColor="#EB0028" />
                    <stop offset="100%" stopColor="#240005" />
                  </linearGradient>

                  <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="30" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <rect width="1600" height="1000" fill="url(#bgGrad)" />
                <circle cx="800" cy="500" r="460" fill="url(#coreBloom)" />

                <g opacity="0.32" stroke="#EB0028" strokeWidth="1">
                  <circle cx="800" cy="500" r="410" strokeDasharray="3 6" />
                  <circle cx="800" cy="500" r="320" strokeDasharray="8 8" />
                  <circle cx="800" cy="500" r="210" strokeDasharray="2 4" />
                  <circle cx="800" cy="500" r="110" />
                  <line x1="800" y1="50" x2="800" y2="950" strokeDasharray="4 8" opacity="0.2" />
                  <line x1="150" y1="500" x2="1450" y2="500" strokeDasharray="4 8" opacity="0.2" />
                </g>

                <g filter="url(#crimsonGlow)">
                  <path
                    d="M240 680 C 420 300, 680 180, 950 260 C 1220 340, 1420 620, 1260 780 C 1100 940, 750 910, 520 800 C 340 710, 180 820, 240 680 Z"
                    fill="url(#ribbonRed1)"
                    opacity="0.82"
                  />
                  <path
                    d="M1360 320 C 1180 700, 920 820, 650 740 C 380 660, 180 380, 340 220 C 500 60, 850 90, 1080 200 C 1260 290, 1420 180, 1360 320 Z"
                    fill="url(#ribbonRed2)"
                    opacity="0.75"
                  />
                  <ellipse
                    cx="800"
                    cy="500"
                    rx="340"
                    ry="170"
                    transform="rotate(-28 800 500)"
                    stroke="#EB0028"
                    strokeWidth="12"
                    opacity="0.9"
                  />
                  <ellipse
                    cx="800"
                    cy="500"
                    rx="340"
                    ry="170"
                    transform="rotate(32 800 500)"
                    stroke="#FF4D5A"
                    strokeWidth="4"
                    opacity="0.7"
                  />
                </g>

                <circle cx="800" cy="500" r="14" fill="#FFFFFF" opacity="0.95" />
                <circle cx="800" cy="500" r="48" fill="#FF4D5A" opacity="0.45" />

                <text
                  x="80"
                  y="940"
                  fill="#8E8E93"
                  fontSize="12"
                  fontFamily="monospace"
                  letterSpacing="0.2em"
                  opacity="0.5"
                >
                  12.977° N, 80.056° E / CIT CHENNAI
                </text>
                <text
                  x="1320"
                  y="940"
                  fill="#8E8E93"
                  fontSize="12"
                  fontFamily="monospace"
                  letterSpacing="0.2em"
                  opacity="0.5"
                >
                  EDITION 2027 // UNTAPPED
                </text>
              </svg>
            )}
          </div>

          {/* ========================================================
              CINEMATIC SCRIM OVERLAY
              Darkens as visual reaches full-bleed to guarantee text legibility
              ======================================================== */}
          <div
            ref={scrimOverlayRef}
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35 pointer-events-none will-change-[opacity]"
          />

          {/* ========================================================
              EDITORIAL TRANSITION HEADLINE
              "THERE IS MORE THAN MEETS THE EYE."
              ======================================================== */}
          <div
            ref={headlineRef}
            className="relative z-20 flex flex-col items-center justify-center text-center px-6 sm:px-10 max-w-5xl will-change-[opacity,transform]"
          >
            <span className="font-mono text-xs sm:text-sm tracking-[0.26em] text-[#FF4D5A] uppercase mb-4 sm:mb-6">
              THE UNEXPLORED REALITY
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-black tracking-[-0.04em] sm:tracking-[-0.055em] leading-[1.04] text-[#F5F5F2] select-none">
              <span>THERE IS </span>
              <span className="text-[#EB0028]">MORE</span>
              <span className="block mt-1 sm:mt-2">
                <span>THAN </span>
                <span className="text-[#EB0028]">MEETS</span>
                <span> THE EYE.</span>
              </span>
            </h2>

            <p className="mt-6 sm:mt-8 max-w-xl text-sm sm:text-base md:text-lg text-[#BDBDBD] font-normal leading-relaxed tracking-tight">
              Every groundbreaking breakthrough began as an invisible spark waiting beneath the surface.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollExpansionSection;

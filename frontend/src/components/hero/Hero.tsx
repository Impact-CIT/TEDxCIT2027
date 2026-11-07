'use client';

import React, { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useTransform,
} from 'framer-motion';

export interface HeroProps {
  /** Optional custom CSS classes for the section container */
  className?: string;
}

/**
 * Editorial cubic-bezier deceleration curve
 */
const cinematicEase = [0.16, 1, 0.3, 1] as const;

/**
 * Full-Screen Editorial Hero Section for TEDx Chennai Institute of Technology.
 * Official Event Theme: UNTAPPED
 *
 * Rich Cinematic Motion Suite:
 * - 3D Mouse Parallax Float on UNTAPPED
 * - Floating ambient theater dust / ember motes
 * - Live pulsing TEDx status radar beacon
 * - Infinite continuous editorial ticker at the bottom
 * - Traveling crimson laser on the vertical divider
 * - Interactive laser border beam on the CTA button
 * - Zero letter clipping; 100% crisp, uncut typography
 */
export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  // Cursor-following interactive ambient glow & 3D parallax
  const mouseX = useMotionValue(720);
  const mouseY = useMotionValue(450);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100 });

  // 3D Parallax offset for UNTAPPED headline
  const parallaxHeadlineX = useTransform(smoothX, [0, 1440], [-10, 10]);
  const parallaxHeadlineY = useTransform(smoothY, [0, 900], [-8, 8]);

  // Subtle counter-parallax for the right column
  const parallaxRightX = useTransform(smoothX, [0, 1440], [6, -6]);
  const parallaxRightY = useTransform(smoothY, [0, 900], [5, -5]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const ambientSpotlight = useMotionTemplate`radial-gradient(850px circle at ${smoothX}px ${smoothY}px, rgba(235, 0, 40, 0.085), transparent 70%)`;

  // Pre-calculated ambient particles to ensure deterministic rendering
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        top: `${(i * 19) % 95}%`,
        left: `${(i * 29) % 96}%`,
        size: (i % 3) + 2,
        duration: 8 + (i % 6) * 1.5,
        delay: (i % 5) * 0.8,
        driftX: (i % 2 === 0 ? 1 : -1) * (15 + (i % 10)),
        driftY: -(30 + (i % 25)),
      })),
    []
  );

  return (
    <section
      onPointerMove={handlePointerMove}
      className={`relative w-full min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-92px)] bg-[#000000] text-[#F5F5F2] flex flex-col justify-between overflow-x-hidden font-sans select-none ${className}`}
      aria-label="Event Theme: UNTAPPED"
    >
      {/* ========================================================
          CINEMATIC AMBIENT LIGHTING
          1. Interactive cursor spotlight beam
          2. Atmospheric breathing crimson aura
          3. Floating cinematic dust / ember particles
          ======================================================== */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{ background: ambientSpotlight }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: [0.35, 0.65, 0.35],
          scale: [0.95, 1.1, 0.95],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute left-[4%] top-[20%] -z-10 h-[520px] w-[750px] rounded-full bg-[#EB0028]/16 blur-[150px]"
      />

      {/* Floating Theater Dust Motes / Particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.15, 0.5, 0.15],
              x: [0, p.driftX, 0],
              y: [0, p.driftY, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            className="absolute rounded-full bg-[#F5F5F2]/40"
          />
        ))}
      </div>

      {/* ========================================================
          MAIN EDITORIAL GRID
          ======================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row items-stretch w-full relative z-10">
        {/* ========================================================
            LEFT COLUMN — 68% Width
            Features 3D subtle parallax glide + intact, uncut typography
            ======================================================== */}
        <div className="w-full lg:w-[68%] xl:w-[68%] flex flex-col justify-start pl-6 sm:pl-10 lg:pl-14 xl:pl-16 pr-2 sm:pr-3 lg:pr-4 pt-8 sm:pt-10 lg:pt-12 xl:pt-14 pb-12 lg:pb-16 border-b lg:border-b-0">
          {/* Eyebrow Label with pulsing live status beacon */}
          <div className="mb-3 sm:mb-4 lg:mb-5 flex items-center space-x-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB0028] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EB0028]" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs md:text-[13px] tracking-[0.18em] uppercase text-[#8E8E93]">
              CHENNAI / IDEAS WORTH SPREADING
            </span>
          </div>

          {/* 
            Massive UNTAPPED headline with 3D Parallax Tilt:
            - UN in off-white (#F5F5F2)
            - TAPPED in TED red (#EB0028)
            - 100% uncut, clean, solid glyph rendering
          */}
          <div className="will-change-transform">
            <h1 className="text-left font-black tracking-[-0.055em] sm:tracking-[-0.06em] leading-[0.82] select-none text-[clamp(5.5rem,16.8vw,18.8rem)]">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: cinematicEase, delay: 0.12 }}
                className="block text-[#F5F5F2]"
              >
                UN
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: cinematicEase, delay: 0.22 }}
                className="block text-[#EB0028] drop-shadow-[0_0_50px_rgba(235,0,40,0.5)]"
              >
                TAPPED
              </motion.span>
            </h1>
          </div>
        </div>

        {/* ========================================================
            CONTAINED VERTICAL SEPARATING LINE
            ======================================================== */}
        <div className="hidden lg:flex flex-col justify-center items-center shrink-0 py-8 relative">
          <div className="relative w-[1px] h-[360px] xl:h-[420px] bg-[#292929] overflow-hidden">
            {/* Traveling laser beam along divider */}
            <motion.div
              animate={{ y: ['-100%', '250%'] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.2,
              }}
              className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-[#EB0028] to-transparent opacity-90"
            />
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN — 32% Width
            Positioned down with counter-parallax float
            ======================================================== */}
        <div className="w-full lg:w-[32%] xl:w-[32%] pl-5 sm:pl-7 lg:pl-7 xl:pl-8 pr-6 sm:pr-8 lg:pr-10 xl:pr-12 pt-12 sm:pt-16 lg:pt-[170px] xl:pt-[190px] pb-12 lg:pb-16 flex flex-col justify-start">
          <div className="max-w-md lg:max-w-[440px] xl:max-w-[490px]">
            {/* Enlarged, high-impact editorial introductory copy */}
            <p className="text-2xl sm:text-3xl lg:text-[28px] xl:text-[32px] leading-[1.28] sm:leading-[1.3] text-[#F5F5F2] font-medium tracking-[-0.025em]">
              Discover unexplored perspectives, challenge what you know, and uncover ideas waiting to make an impact.
            </p>

            {/* Action Buttons: PARTNER WITH US and REGISTER NOW (Side-by-Side) */}
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-row items-center gap-3 sm:gap-3.5 flex-wrap">
              <motion.a
                href="/contact-us"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/contact-us');
                  window.dispatchEvent(new Event('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
                transition={{ duration: 0.2 }}
                className="group relative inline-flex items-center justify-between space-x-3.5 border border-[#292929] hover:border-[#EB0028] bg-transparent px-4 sm:px-5 lg:px-5.5 py-3 sm:py-3.5 text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase text-[#F5F5F2] hover:text-white transition-all duration-300 rounded-none overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-[#EB0028] whitespace-nowrap"
              >
                {/* Subtle red background curtain sweep on hover */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#EB0028]/25 via-[#EB0028]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="relative z-10">PARTNER WITH US</span>
                <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#EB0028]" />
              </motion.a>

              <motion.a
                href="/apply-to-speak"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/apply-to-speak');
                  window.dispatchEvent(new Event('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
                transition={{ duration: 0.2 }}
                className="group relative inline-flex items-center justify-between space-x-3.5 bg-[#EB0028] hover:bg-[#C80022] border border-[#EB0028] px-4.5 sm:px-5.5 lg:px-6 py-3 sm:py-3.5 text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase text-white transition-all duration-300 rounded-none overflow-hidden shadow-lg shadow-[#EB0028]/25 hover:shadow-[#EB0028]/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-white whitespace-nowrap cursor-pointer"
              >
                <span className="relative z-10">APPLY TO SPEAK</span>
                <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CINEMATIC CONTINUOUS MARQUEE TICKER AT BOTTOM
          Infinite sliding ticker anchoring the lower viewport edge
          ======================================================== */}
      <div className="w-full border-t border-[#1C1C1E] bg-[#000000]/80 backdrop-blur-sm py-2.5 overflow-hidden z-20">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex whitespace-nowrap font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[#6E6E73]"
        >
          <span className="inline-block px-4">
            TEDx Chennai Institute of Technology <span className="text-[#EB0028] font-bold">/</span> THEME: UNTAPPED <span className="text-[#EB0028] font-bold">/</span> DISCOVER UNEXPLORED PERSPECTIVES <span className="text-[#EB0028] font-bold">/</span> IDEAS WORTH SPREADING <span className="text-[#EB0028] font-bold">/</span> CIT CAMPUS CHENNAI <span className="text-[#EB0028] font-bold">/</span>
          </span>
          <span className="inline-block px-4">
            TEDx Chennai Institute of Technology <span className="text-[#EB0028] font-bold">/</span> THEME: UNTAPPED <span className="text-[#EB0028] font-bold">/</span> DISCOVER UNEXPLORED PERSPECTIVES <span className="text-[#EB0028] font-bold">/</span> IDEAS WORTH SPREADING <span className="text-[#EB0028] font-bold">/</span> CIT CAMPUS CHENNAI <span className="text-[#EB0028] font-bold">/</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

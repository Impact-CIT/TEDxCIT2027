'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ArrowUpRight, Film } from 'lucide-react';

export interface AboutVideoSectionProps {
  /** Video source path or URL */
  videoSrc?: string;
  /** Optional custom poster image to display before/while the video plays */
  posterSrc?: string;
  /** Small subhead / eyebrow label */
  subhead?: string;
  /** CTA button label. Default: "APPLY TO SPEAK" */
  ctaText?: string;
  /** CTA button link destination. Default: "/apply-to-speak" */
  ctaLink?: string;
  /** Optional custom CSS class for the section wrapper */
  className?: string;
}

const transitionEase = [0.16, 1, 0.3, 1] as const;

/**
 * Parses potential YouTube or Vimeo video identifiers
 */
function getEmbedUrl(src?: string): { type: 'youtube' | 'vimeo' | 'html5'; url: string } | null {
  if (!src || !src.trim()) return null;
  const s = src.trim();

  // YouTube match
  const ytMatch = s.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return {
      type: 'youtube',
      url: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&playsinline=1&modestbranding=1&rel=0`,
    };
  }

  // Raw 11-char YouTube ID
  if (/^[\w-]{11}$/.test(s)) {
    return {
      type: 'youtube',
      url: `https://www.youtube.com/embed/${s}?autoplay=1&mute=1&loop=1&playlist=${s}&controls=0&playsinline=1&modestbranding=1&rel=0`,
    };
  }

  // Vimeo match
  const vimeoMatch = s.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`,
    };
  }

  return { type: 'html5', url: s };
}

/**
 * AboutVideoSection — Full-Width Edge-to-Edge 50/50 Stage Section
 * for TEDx Chennai Institute of Technology.
 *
 * Implements:
 * - 50/50 responsive layout covering the screen with an immersive 16:9 stage reel.
 * - Seamless automatic background playback (muted by default with user sound toggle).
 * - Two-Tone Headline: "ABOUT" (white) + "TEDx" (red) + "CHENNAI INSTITUTE OF TECHNOLOGY" (white, wrapping gracefully).
 * - Smooth scroll-driven Framer Motion entrance reveals.
 */
export const AboutVideoSection: React.FC<AboutVideoSectionProps> = ({
  videoSrc = '',
  posterSrc = '/images/stage-speaker-crop.jpg',
  subhead = 'IDEAS WORTH SPREADING. PERSPECTIVES WITHOUT LIMITS.',
  ctaText = 'APPLY TO SPEAK',
  ctaLink = '/apply-to-speak',
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const embedInfo = getEmbedUrl(videoSrc);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setHasVideoError(true);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
    };
  }, [embedInfo]);

  // Client navigation handler
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
      id="about-tedx-cit"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-24 sm:py-28 lg:py-36 relative overflow-hidden ${className}`}
      aria-label="About TEDx Chennai Institute of Technology"
    >
      {/* Subtle Background Glow Accent */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#EB0028]/14 rounded-full blur-[200px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* FULL SCREEN WIDTH GRID: Covers the entire width of screen */}
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
        
        {/* =========================================================================
            LEFT HALF: Big 16:9 Video Frame
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: transitionEase }}
          className="w-full flex flex-col justify-center"
        >
          <div
            className="w-full aspect-video rounded-2xl overflow-hidden bg-[#0A0A0C] border border-white/10 relative group shadow-[0_24px_80px_rgba(0,0,0,0.9)] flex items-center justify-center select-none transition-all duration-500 hover:border-[#EB0028]/50 hover:shadow-[0_30px_90px_rgba(235,0,40,0.18)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* 1. Iframe for YouTube or Vimeo */}
            {embedInfo && (embedInfo.type === 'youtube' || embedInfo.type === 'vimeo') ? (
              <iframe
                src={embedInfo.url}
                title="TEDx Chennai Institute of Technology Video"
                className="w-full h-full absolute inset-0 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : embedInfo && embedInfo.type === 'html5' && !hasVideoError ? (
              /* 2. HTML5 Video for local MP4 or remote video file */
              <video
                ref={videoRef}
                src={embedInfo.url}
                poster={posterSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover object-center absolute inset-0"
              />
            ) : (
              /* 3. 16:9 Video Placeholder with Stage Speaker Background */
              <div className="w-full h-full relative absolute inset-0 flex items-center justify-center">
                <img
                  src={posterSrc}
                  alt="TEDx Stage Speaker"
                  className="w-full h-full object-cover object-center opacity-85 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Central Stage Badge */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <span className="text-xs font-mono uppercase tracking-[0.22em] text-white/90 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
                    <span>TEDx CIT STAGE BROADCAST</span>
                  </span>
                </div>
              </div>
            )}

            {/* Video Live Badge (Top-Left) */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-white rounded-lg shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
              <span>STAGE ARCHIVE</span>
            </div>

            {/* Bottom Controls for HTML5 Video (Audio Toggle - Autoplays) */}
            {embedInfo?.type === 'html5' && !hasVideoError && (
              <div
                className={`absolute bottom-4 right-4 z-20 flex items-center gap-2 transition-opacity duration-300 ${
                  isHovered || !isPlaying ? 'opacity-100' : 'opacity-85'
                }`}
              >
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-all cursor-pointer shadow-lg"
                  title={isMuted ? 'Unmute sound' : 'Mute sound'}
                  aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Subtext below video with high-tech status readout */}
          <div className="mt-3.5 flex items-center justify-between text-xs font-mono text-[#8E8E93] px-1">
            <span className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-[#EB0028]" />
              <span>OFFICIAL HIGHLIGHT RECORD</span>
            </span>
            <span className="tracking-widest">16:9 CINEMATIC 4K REEL</span>
          </div>
        </motion.div>

        {/* =========================================================================
            RIGHT HALF: Content Column with Framer Motion Reveal
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

          {/* Two-Tone Headline */}
          <div className="mb-8 font-['Inter',sans-serif]">
            {/* Line 1: ABOUT in White (Upper Line) */}
            <h2 className="text-[22px] min-[390px]:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[40px] font-extrabold tracking-tight text-white uppercase leading-none mb-2 sm:mb-2.5">
              ABOUT
            </h2>

            {/* Line 2: TEDx in RED (Same bigger font size as ABOUT) + CHENNAI INSTITUTE OF TECHNOLOGY (Half the font size of TEDx) on the SAME LINE */}
            <div className="flex flex-nowrap items-baseline gap-x-2 sm:gap-x-2.5 lg:gap-x-3 whitespace-nowrap text-[22px] min-[390px]:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[40px] leading-none">
              <span className="font-black text-[#EB0028] tracking-tight shrink-0 leading-none drop-shadow-[0_4px_24px_rgba(235,0,40,0.25)]">
                TED<span className="lowercase font-bold text-[0.8em]">x</span>
              </span>
              <span className="text-[0.48em] sm:text-[0.5em] font-bold text-white tracking-tight uppercase leading-none shrink-0">
                CHENNAI INSTITUTE OF TECHNOLOGY
              </span>
            </div>
          </div>

          {/* Description Paragraphs */}
          <div className="space-y-4 sm:space-y-5 text-[#A0A0A5] text-[15px] sm:text-base lg:text-[16px] xl:text-[17px] leading-relaxed font-normal mb-10 max-w-2xl">
            <p>
              TEDx Chennai Institute of Technology is an independently organized TEDx event that brings together curious minds, diverse perspectives and ideas worth sharing.
            </p>
            <p>
              Inspired by TED&apos;s mission of spreading ideas, we create a platform for thought-provoking conversations, unconventional perspectives and stories that challenge the way we see the world.
            </p>
            <p>
              Through speakers, experiences and meaningful exchanges, we aim to spark curiosity, inspire action and make ideas travel beyond boundaries.
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

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ArrowUpRight, Film } from 'lucide-react';

export interface AboutVideoSectionProps {
  /**
   * Video source path or URL.
   * Can be:
   *  1. Local MP4 in `frontend/public/videos/` (e.g. `"/videos/my-tedx-video.mp4"`)
   *  2. Direct MP4/WebM URL
   *  3. YouTube URL or Video ID
   *  4. Vimeo URL
   * Leave blank/undefined to display the 16:9 stage video placeholder.
   */
  videoSrc?: string;

  /**
   * Optional custom poster image to display before/while the video plays.
   * Default: "/images/stage-speaker-crop.jpg"
   */
  posterSrc?: string;

  /**
   * Small subhead / eyebrow label.
   * Default: "IDEAS WORTH SPREADING. PERSPECTIVES WITHOUT LIMITS."
   */
  subhead?: string;

  /**
   * Main section header.
   * Default: "ABOUT TEDx CHENNAI INSTITUTE OF TECHNOLOGY"
   */
  header?: React.ReactNode;

  /**
   * Descriptive paragraphs about TEDx Chennai Institute of Technology.
   */
  description?: React.ReactNode;

  /**
   * CTA button label. Default: "APPLY TO SPEAK"
   */
  ctaText?: string;

  /**
   * CTA button link destination. Default: "#apply-to-speak"
   */
  ctaLink?: string;

  /**
   * Optional custom CSS class for the section wrapper.
   */
  className?: string;
}

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
 * AboutVideoSection — 16:9 Frame Video & Editorial Narrative
 * for TEDx Chennai Institute of Technology.
 *
 * Left: 16:9 framed video player with interactive controls and stage fallback placeholder.
 * Right: Header, subhead, 3 elegant descriptive paragraphs, and Apply to Speak CTA button.
 */
export const AboutVideoSection: React.FC<AboutVideoSectionProps> = ({
  videoSrc = '',
  posterSrc = '/images/stage-speaker-crop.jpg',
  subhead = 'IDEAS WORTH SPREADING. PERSPECTIVES WITHOUT LIMITS.',
  header = (
    <>
      ABOUT <span className="text-[#EB0028] font-black">TED<sup className="text-sm -top-4 font-bold lowercase">x</sup></span> CHENNAI INSTITUTE OF TECHNOLOGY
    </>
  ),
  description = (
    <div className="space-y-4 sm:space-y-5 text-[#A0A0A5] text-[15px] sm:text-base lg:text-[17px] leading-relaxed font-normal">
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
  ),
  ctaText = 'APPLY TO SPEAK',
  ctaLink = '#apply-to-speak',
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const embedInfo = getEmbedUrl(videoSrc);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

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

  return (
    <section
      id="about-tedx-cit"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-14 xl:px-20 relative overflow-hidden ${className}`}
      aria-label="About TEDx Chennai Institute of Technology"
    >
      {/* Subtle Background Glow Accent */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#EB0028]/8 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-14 xl:gap-16 items-center">
        
        {/* =========================================================================
            LEFT COLUMN: 16:9 Frame Video / Stage Speaker Media Container
            ========================================================================= */}
        <div className="w-full flex flex-col justify-center">
          <div
            className="w-full aspect-video rounded-sm overflow-hidden bg-[#0A0A0A] border border-[#262626] relative group shadow-2xl shadow-black/80 flex items-center justify-center select-none"
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
                  className="w-full h-full object-cover object-left opacity-85 transition-opacity duration-300 group-hover:opacity-95"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Central Play Button Placeholder */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-3 pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl group-hover:scale-105 group-hover:border-[#EB0028] group-hover:text-[#EB0028] transition-all duration-300">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#A0A0A5] bg-black/70 px-3 py-1 rounded-sm border border-white/10">
                    16:9 Video Frame
                  </span>
                </div>
              </div>
            )}

            {/* Video Live Badge (Top-Left) */}
            <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none flex items-center gap-2 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-white rounded-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
              <span>TEDx CIT</span>
            </div>

            {/* Bottom Controls for HTML5 Video */}
            {embedInfo?.type === 'html5' && !hasVideoError && (
              <div
                className={`absolute bottom-3 right-3 z-20 flex items-center gap-2 transition-opacity duration-300 ${
                  isHovered || !isPlaying ? 'opacity-100' : 'opacity-80'
                }`}
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-none bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause video' : 'Play video'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-none bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute sound' : 'Mute sound'}
                  aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Subtext below video */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#8E8E93] px-1">
            <span className="flex items-center gap-1.5">
              <Film className="w-3 h-3 text-[#EB0028]" />
              <span>STAGE ARCHIVE</span>
            </span>
            <span>16:9 CINEMATIC REEL</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Header, Subhead & Description
            ========================================================================= */}
        <div className="w-full flex flex-col justify-center">
          
          {/* 1. Small Subhead / Eyebrow */}
          <div className="mb-4 sm:mb-5 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EB0028]" aria-hidden="true" />
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.2em] text-[#8E8E93]">
              {subhead}
            </span>
          </div>

          {/* 2. Main Section Header */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] font-bold tracking-tight text-white leading-[1.15] mb-6 font-['Inter',sans-serif]">
            {header}
          </h2>

          {/* 3. Description (3 readable paragraphs) */}
          <div className="mb-8 sm:mb-10">
            {description}
          </div>

          {/* 4. Action CTA Button */}
          <div className="pt-1">
            <a
              href={ctaLink}
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

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ArrowUpRight } from 'lucide-react';

export interface AboutVideoSectionProps {
  /**
   * Video source path or URL.
   * Can be:
   *  1. Local video file placed in `frontend/public/videos/` (e.g. `"/videos/tedx-speaker.mp4"`)
   *  2. Direct MP4/WebM HTTPS URL
   *  3. YouTube URL or ID (e.g. `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"` or `"dQw4w9WgXcQ"`)
   *  4. Vimeo URL
   * Leave empty or undefined to display the official stage speaker poster fallback.
   */
  videoSrc?: string;

  /**
   * Optional custom poster image to display before/while the video plays.
   * Defaults to `/images/reference-speaker.jpg`.
   */
  posterSrc?: string;

  /**
   * Top eyebrow label text.
   * Default: "YOUR IDEA STARTS HERE"
   */
  eyebrow?: string;

  /**
   * Main editorial display headline.
   */
  headline?: React.ReactNode;

  /**
   * Subtitle / descriptive paragraphs about TEDx Chennai Institute of Technology.
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
   * Optional custom CSS class for the section container.
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
 * AboutVideoSection — 50/50 Split Stage Video & Editorial Narrative Section
 * for TEDx Chennai Institute of Technology.
 */
export const AboutVideoSection: React.FC<AboutVideoSectionProps> = ({
  videoSrc = '',
  posterSrc = '/images/reference-speaker.jpg',
  eyebrow = 'YOUR IDEA STARTS HERE',
  headline,
  description,
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
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] relative overflow-hidden ${className}`}
      aria-label="About TEDx Chennai Institute of Technology and Call for Speakers"
    >
      <div className="w-full flex flex-col lg:flex-row min-h-[600px] lg:min-h-[720px] xl:min-h-[780px]">
        
        {/* =========================================================================
            LEFT COLUMN (50%): Stage Video / Speaker Media
            ========================================================================= */}
        <div
          className="relative w-full lg:w-1/2 min-h-[440px] sm:min-h-[520px] lg:min-h-full bg-[#050505] overflow-hidden flex items-center justify-center select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Ambient Red Glow */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 bg-[#EB0028]/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Render Iframe for YouTube/Vimeo */}
          {embedInfo && (embedInfo.type === 'youtube' || embedInfo.type === 'vimeo') ? (
            <iframe
              src={embedInfo.url}
              title="TEDx Speaker Video"
              className="w-full h-full absolute inset-0 border-0 pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : embedInfo && embedInfo.type === 'html5' && !hasVideoError ? (
            /* Render HTML5 Video for local MP4 or remote video link */
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
            /* Fallback high-impact stage visual */
            <div className="w-full h-full relative absolute inset-0">
              <img
                src={posterSrc}
                alt="TEDx Stage Speaker"
                className="w-full h-full object-cover object-left"
                loading="lazy"
              />
            </div>
          )}

          {/* Gradient Vignette: Seamless blending into black & right column */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-transparent to-black/25 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black"
            aria-hidden="true"
          />

          {/* Bottom Floating Control Bar */}
          <div
            className={`absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between transition-opacity duration-300 ${
              isHovered || !isPlaying ? 'opacity-100' : 'opacity-85'
            }`}
          >
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono tracking-wider text-white">
              <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
              <span>TEDx CIT STAGE</span>
            </div>

            {/* Play/Pause & Audio Toggle for HTML5 videos */}
            {embedInfo?.type === 'html5' && !hasVideoError && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-none bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause video' : 'Play video'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-none bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-[#EB0028] hover:border-[#EB0028] transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute sound' : 'Mute sound'}
                  aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (50%): Editorial Narrative & Call to Action
            ========================================================================= */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-16 xl:px-20 py-16 sm:py-20 lg:py-24 bg-[#000000] relative z-10">
          
          {/* Subtle Ambient Crimson Haze */}
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-[#EB0028]/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* 1. Monospace Eyebrow */}
          <div className="mb-6 sm:mb-8 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#EB0028]" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#8E8E93]">
              {eyebrow}
            </span>
          </div>

          {/* 2. Bold Display Headline (Exact 3-line cadence from reference) */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[52px] 2xl:text-[60px] font-bold tracking-tight text-white leading-[1.08] mb-8 font-['Inter',sans-serif]">
            {headline || (
              <>
                Do you have an idea<br className="hidden md:inline" /> to share with the<br className="hidden md:inline" /> world?
              </>
            )}
          </h2>

          {/* 3. Descriptive Body Copy */}
          <div className="text-[#A0A0A5] text-base sm:text-lg leading-relaxed max-w-xl mb-10 font-normal">
            {description || (
              <>
                <p className="mb-4">
                  We're always searching for unique ideas to inspire our community of leaders and changemakers.
                </p>
                <p className="text-[#8E8E93] text-sm sm:text-base leading-relaxed">
                  <strong className="text-white font-medium">TEDx Chennai Institute of Technology</strong> provides an independent stage for forward-thinking pioneers, researchers, and creators. We foster transformative dialogues that spark change across technology, design, and humanity.
                </p>
              </>
            )}
          </div>

          {/* 4. Official TED Red CTA Button */}
          <div className="pt-2">
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

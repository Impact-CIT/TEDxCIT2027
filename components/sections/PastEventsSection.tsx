'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useInView } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
  Users,
  Mic,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  Radio,
} from 'lucide-react';

export interface PastEventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  link: string;
  edition?: string;
  theme?: string;
  year?: string;
  tagline?: string;
  stats?: {
    talks: string;
    delegates: string;
    views: string;
  };
  highlights?: string[];
  curatorQuote?: string;
}

export interface PastEventsSectionProps {
  /** Section heading. Default: "Past events. Lasting ideas." */
  title?: string;
  /** Eyebrow text. Default: "CHRONICLES // 2021 — 2026 ARCHIVE" */
  eyebrow?: string;
  /** Subtitle narrative */
  description?: string;
  /** Optional custom events data */
  events?: PastEventItem[];
  /** Optional custom CSS classes */
  className?: string;
}

export const DEFAULT_PAST_EVENTS: PastEventItem[] = [
  {
    id: 'cit-2026',
    edition: '06',
    year: '2026',
    theme: 'UNTAPPED',
    title: 'TEDxCIT 2026: UNTAPPED',
    tagline: 'Unlocking dormant human potential, synthetic cognition, and non-linear courage.',
    date: '2026-02-18',
    location: 'Main Auditorium, CIT Chennai',
    image: '/images/frames/frame-set1-1.jpg',
    link: '#',
    stats: {
      talks: '14 Talks',
      delegates: '1,200+ Attendees',
      views: '450K+ Views',
    },
    highlights: [
      'Neuromorphic Artificial Intelligence Keynote',
      'Biomimetic Megacity Planning',
      'Magnetoplasmadynamic Deep-Space Propulsion',
    ],
    curatorQuote: 'The stage where unmapped trajectories converged into transformative action.',
  },
  {
    id: 'cit-2025',
    edition: '05',
    year: '2025',
    theme: 'BREAKING BOUNDARIES',
    title: 'TEDxCIT 2025: Breaking Boundaries',
    tagline: 'Dismantling conventional thresholds across quantum sciences, bio-design, and human empathy.',
    date: '2025-03-22',
    location: 'Innovation Hall, CIT Campus',
    image: '/images/frames/frame-set1-2.jpg',
    link: '#',
    stats: {
      talks: '12 Talks',
      delegates: '1,050 Attendees',
      views: '380K+ Views',
    },
    highlights: [
      'Quantum Memory Cartography & Resilience',
      'Living Concrete Micro-Ecologies',
      'Ethics of Autonomous Legal Systems',
    ],
    curatorQuote: 'Boundaries only exist until a bold idea reimagines the horizon.',
  },
  {
    id: 'cit-2024',
    edition: '04',
    year: '2024',
    theme: 'THE HUMAN HORIZON',
    title: 'TEDxCIT 2024: The Human Horizon',
    tagline: 'Navigating the intersection of synthetic biology, ancestral memory, and planetary stewardship.',
    date: '2024-04-10',
    location: 'CIT Convention Centre',
    image: '/images/frames/frame-set1-3.jpg',
    link: '#',
    stats: {
      talks: '11 Talks',
      delegates: '900 Attendees',
      views: '290K+ Views',
    },
    highlights: [
      'Acoustic Architecture & Brain Waves',
      'Oceanic Microplastic Filtration Enzymes',
      'Generative Narrative Sculptures',
    ],
    curatorQuote: 'In the twilight between humanity and algorithm, empathy remains our compass.',
  },
  {
    id: 'cit-2023',
    edition: '03',
    year: '2023',
    theme: 'CATALYSTS OF CHANGE',
    title: 'TEDxCIT 2023: Catalysts of Change',
    tagline: 'Accelerating micro-innovations into macro-cultural shifts across education, clean energy, and health.',
    date: '2023-09-14',
    location: 'Main Auditorium, CIT Chennai',
    image: '/images/frames/frame-set2-1.jpg',
    link: '#',
    stats: {
      talks: '10 Talks',
      delegates: '800 Attendees',
      views: '220K+ Views',
    },
    highlights: [
      'Solid-State Battery Breakthroughs',
      'Rural Healthcare Tele-Diagnostics',
      'Philosophy of Machine Sentience',
    ],
    curatorQuote: 'A single spark of insight holds the momentum to redirect a generation.',
  },
  {
    id: 'cit-2022',
    edition: '02',
    year: '2022',
    theme: 'INFINITE RESONANCES',
    title: 'TEDxCIT 2022: Infinite Resonances',
    tagline: 'Harmonizing ancient acoustic traditions and modern harmonic mathematics for neurological therapy.',
    date: '2022-10-05',
    location: 'CIT Open Amphitheatre',
    image: '/images/frames/frame-set2-2.jpg',
    link: '#',
    stats: {
      talks: '9 Talks',
      delegates: '700 Attendees',
      views: '185K+ Views',
    },
    highlights: [
      'Vedic Acoustics in Modern Frequency Medicine',
      'Geometry of Sustainable Fractals',
      'Autonomous Drone Swarms for Forestation',
    ],
    curatorQuote: 'Every idea echoes far beyond the room where it was first spoken.',
  },
  {
    id: 'cit-2021',
    edition: '01',
    year: '2021',
    theme: 'IGNITING CURIOSITY',
    title: 'TEDxCIT 2021: Igniting Curiosity',
    tagline: 'The inaugural virtual gathering lighting fires of curiosity across borders during unprecedented global shifts.',
    date: '2021-11-20',
    location: 'Virtual Global Stage, Chennai',
    image: '/images/frames/frame-set2-3.jpg',
    link: '#',
    stats: {
      talks: '8 Talks',
      delegates: '2,500+ Virtual Delegates',
      views: '160K+ Views',
    },
    highlights: [
      'Post-Pandemic Educational Metamorphosis',
      'Space-Tech Miniaturization by Student Pioneers',
      'Virtual Reality as an Empathy Amplifier',
    ],
    curatorQuote: 'The journey of a thousand ideas began right here.',
  },
];

const AUTO_CYCLE_DURATION_MS = 3000; // 3 seconds per edition

/**
 * PastEventsSection — Kinetic Slit-Scan Architectural Accordion
 *
 * Implements an Autonomous "Come and Go" Animation Loop:
 * - Automatically expands and collapses each edition continuously.
 * - Progress gauge bar visualizes the countdown of the active panel.
 * - Smooth cubic-bezier spring expansion and contraction across the 6 monolithic slices.
 * - Pauses gracefully when hovered or clicked, resumes seamlessly when cursor exits.
 * - Interactive Timeline ruler with animated laser tracker.
 * - Full archival dossier modal on request.
 */
export const PastEventsSection: React.FC<PastEventsSectionProps> = ({
  title = 'Past events. Lasting ideas.',
  eyebrow = 'CHRONICLES // 2021 — 2026 ARCHIVE',
  description = 'Six transformative gatherings. A continuous kinetic continuum of visionaries who took the red circle at Chennai Institute of Technology to challenge conventions and ignite enduring change.',
  events = DEFAULT_PAST_EVENTS,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-10% 0px -10% 0px' });

  // Currently active edition ID
  const [activeId, setActiveId] = useState<string>(events[0]?.id || 'cit-2026');
  // Auto-cycle state (ENABLED BY DEFAULT so it automatically comes and goes)
  const [isAutoCycleEnabled, setIsAutoCycleEnabled] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [modalEvent, setModalEvent] = useState<PastEventItem | null>(null);

  const activeIndex = events.findIndex((e) => e.id === activeId);
  const activeEvent = events[activeIndex] || events[0];

  // Automatic "Come and Go" Cycle Engine
  useEffect(() => {
    // Only auto-cycle when enabled, not hovered, modal is closed, and section is visible
    if (!isAutoCycleEnabled || isHovered || modalEvent || !isInView) return;

    const timer = setInterval(() => {
      setActiveId((currentId) => {
        const idx = events.findIndex((e) => e.id === currentId);
        const nextIdx = (idx + 1) % events.length;
        return events[nextIdx].id;
      });
      setCycleIndex((prev) => prev + 1);
    }, AUTO_CYCLE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isAutoCycleEnabled, isHovered, modalEvent, isInView, events]);

  // Handle modal body scroll locking and smooth scroll pause
  useEffect(() => {
    if (modalEvent) {
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        (window as any).__lenis.start();
      }
    };
  }, [modalEvent]);

  // Steppers for left/right navigation
  const handlePrev = useCallback(() => {
    const prevIdx = activeIndex === 0 ? events.length - 1 : activeIndex - 1;
    setActiveId(events[prevIdx].id);
    setCycleIndex((prev) => prev + 1);
  }, [activeIndex, events]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % events.length;
    setActiveId(events[nextIdx].id);
    setCycleIndex((prev) => prev + 1);
  }, [activeIndex, events]);

  // Keyboard navigation when section is in view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalEvent) {
        if (e.key === 'Escape') setModalEvent(null);
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalEvent, handlePrev, handleNext]);

  return (
    <section
      ref={sectionRef}
      id="past-events"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-20 sm:py-28 lg:py-32 relative overflow-hidden select-none font-sans ${className}`}
      aria-label="Past Events and Lasting Ideas"
    >
      {/* Soundwave Equalizer, Progress Fill, and Ken-Burns Styles */}
      <style>{`
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 22px; }
        }
        .eq-bar-1 { animation: soundWave 1.1s ease-in-out infinite 0.1s; }
        .eq-bar-2 { animation: soundWave 1.1s ease-in-out infinite 0.3s; }
        .eq-bar-3 { animation: soundWave 1.1s ease-in-out infinite 0.15s; }
        .eq-bar-4 { animation: soundWave 1.1s ease-in-out infinite 0.4s; }
        .eq-bar-5 { animation: soundWave 1.1s ease-in-out infinite 0.25s; }

        .spine-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        @keyframes progressCountdown {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes panelReveal {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes kenBurnsSlow {
          0% { transform: scale(1.05); }
          50% { transform: scale(1.11) translate(-0.5%, -0.5%); }
          100% { transform: scale(1.05); }
        }

        .animate-panel-in {
          animation: panelReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-ken-burns {
          animation: kenBurnsSlow 9s ease-in-out infinite;
        }
      `}</style>

      {/* Atmospheric Ambient Glow */}
      <div
        className="absolute top-1/3 -right-48 w-[800px] h-[600px] bg-[#EB0028]/14 rounded-full blur-[200px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-48 w-[700px] h-[500px] bg-[#EB0028]/10 rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-[92%] max-w-7xl mx-auto relative z-10">
        
        {/* =========================================================================
            HEADER: "Past events. Lasting ideas."
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 sm:mb-14 border-b border-[#1C1C1E] pb-8">
          <div className="max-w-2xl">
            {/* Monospace Eyebrow with Animated Equalizer */}
            <div className="mb-3.5 flex items-center gap-3">
              <div className="flex items-end gap-1 h-5 px-1 bg-[#EB0028]/10 border border-[#EB0028]/25 rounded-md py-0.5">
                <span className="w-0.5 bg-[#EB0028] rounded-full eq-bar-1" />
                <span className="w-0.5 bg-[#EB0028] rounded-full eq-bar-2" />
                <span className="w-0.5 bg-[#EB0028] rounded-full eq-bar-3" />
                <span className="w-0.5 bg-[#EB0028] rounded-full eq-bar-4" />
                <span className="w-0.5 bg-[#EB0028] rounded-full eq-bar-5" />
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#8E8E93]">
                {eyebrow}
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Inter',sans-serif] leading-[1.08]">
              Past events.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EB0028] via-[#EB0028] to-[#EB0028]">
                Lasting ideas.
              </span>
            </h2>

            {description && (
              <p className="mt-3.5 text-[#8E8E93] text-sm sm:text-base leading-relaxed font-normal">
                {description}
              </p>
            )}
          </div>

          {/* Chrono Controls: Auto Status Indicator + Steppers */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Auto Telemetry Status Pill */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border border-white/10 bg-[#0D0D10] text-[#8E8E93]">
              <span className="relative flex h-2 w-2">
                {!isHovered && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB0028] opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EB0028]" />
              </span>
              <span className="text-white/80">{isHovered ? 'Paused on Hover' : 'Live Archive'}</span>
            </div>

            {/* Left / Right Navigation Steppers */}
            <div className="flex items-center gap-1 bg-[#0D0D10] border border-white/10 p-1 rounded-xl">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Previous edition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-xs text-white/90">
                0{activeIndex + 1} / 0{events.length}
              </span>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Next edition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CHRONOLOGY PROGRESS TRACK (Interactive Timeline Ruler)
            ========================================================================= */}
        <div className="mb-8 hidden sm:block">
          <div className="grid grid-cols-6 gap-2 border-b border-[#222226] pb-3">
            {events.map((ev, idx) => {
              const isActive = ev.id === activeId;
              return (
                <button
                  key={ev.id}
                  onClick={() => {
                    setActiveId(ev.id);
                    setCycleIndex((prev) => prev + 1);
                  }}
                  className={`text-left group transition-all duration-300 cursor-pointer pb-1 relative ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[#EB0028] scale-150 shadow-[0_0_8px_#EB0028]' : 'bg-[#666]'
                      }`}
                    />
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {ev.year || '2026'}
                    </span>
                  </div>
                  <span className="block text-[11px] font-mono text-[#8E8E93] truncate uppercase">
                    {ev.theme || ev.title}
                  </span>

                  {/* Active Edition Laser Progress Bar */}
                  {isActive && (
                    <div className="absolute -bottom-3 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
                      <div
                        key={`track-${cycleIndex}`}
                        className="h-full bg-[#EB0028] shadow-[0_0_10px_#EB0028]"
                        style={{
                          animation:
                            isAutoCycleEnabled && !isHovered
                              ? `progressCountdown ${AUTO_CYCLE_DURATION_MS}ms linear forwards`
                              : 'none',
                          width: isAutoCycleEnabled && !isHovered ? '0%' : '100%',
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            DESKTOP VIEW: KINETIC ARCHITECTURAL ACCORDION WALL (h-[580px] - h-[620px])
            Autonomous "Come and Go" kinetic breathing motion across the slices.
            ========================================================================= */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden md:flex w-full h-[580px] lg:h-[620px] rounded-3xl overflow-hidden border border-white/10 bg-[#070709] shadow-[0_30px_100px_rgba(0,0,0,0.85)] relative"
        >
          {events.map((event, index) => {
            const isActive = event.id === activeId;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveId(event.id);
                  setCycleIndex((prev) => prev + 1);
                }}
                className={`relative h-full overflow-hidden transition-all duration-800 cursor-pointer border-r last:border-r-0 border-white/10 ${
                  isActive
                    ? 'flex-[5] bg-[#0A0A0D]'
                    : 'flex-[0.8] hover:flex-[1.15] bg-[#050507]'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* 1. Background Imagery with Smooth Zoom and Lighting */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                      isActive
                        ? 'animate-ken-burns filter brightness-70 contrast-115 saturate-110'
                        : 'scale-100 filter brightness-25 contrast-125 saturate-0'
                    }`}
                  />
                  {/* Cinematic Shadow Gradients */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 transition-opacity duration-700 ${
                      isActive ? 'opacity-90' : 'opacity-95'
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 transition-opacity duration-700 ${
                      isActive ? 'opacity-80' : 'opacity-100'
                    }`}
                  />
                </div>

                {/* 2. COLLAPSED SLICE VIEW: Vertical Typographic Spine */}
                {!isActive && (
                  <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between items-center py-8 group transition-opacity duration-500">
                    {/* Top Edition Numeral */}
                    <span className="w-8 h-8 rounded-lg bg-black/70 border border-white/15 text-[#EB0028] font-mono text-xs font-bold flex items-center justify-center shadow-md group-hover:border-[#EB0028]/50 transition-colors">
                      0{index + 1}
                    </span>

                    {/* Rotated Vertical Monolith Title */}
                    <div className="spine-text font-mono text-xs uppercase tracking-[0.25em] text-[#D1D1D6] font-semibold whitespace-nowrap opacity-75 group-hover:opacity-100 transition-opacity">
                      <span>{event.theme || 'UNTAPPED'}</span>
                      <span className="text-[#EB0028] mx-2">•</span>
                      <span className="text-white/60">{event.year}</span>
                    </div>

                    {/* Bottom Indicator Pip */}
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-[#EB0028] transition-colors" />
                  </div>
                )}

                {/* 3. EXPANDED SLICE VIEW: Full Panavision Cinematic Stage (The "Come" state) */}
                {isActive && (
                  <div
                    key={`content-${event.id}-${cycleIndex}`}
                    className="relative z-10 w-full h-full p-8 lg:p-12 flex flex-col justify-between animate-panel-in"
                  >
                    {/* Active Slice Auto-Cycle Progress Countdown Bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden">
                      <div
                        key={`bar-${cycleIndex}`}
                        className="h-full bg-[#EB0028] shadow-[0_0_12px_#EB0028]"
                        style={{
                          animation:
                            isAutoCycleEnabled && !isHovered
                              ? `progressCountdown ${AUTO_CYCLE_DURATION_MS}ms linear forwards`
                              : 'none',
                          width: isAutoCycleEnabled && !isHovered ? '0%' : '100%',
                        }}
                      />
                    </div>

                    {/* Parallax Background Year Outline Watermark */}
                    <div
                      className="pointer-events-none absolute bottom-4 right-6 text-[140px] lg:text-[200px] font-black tracking-tighter text-white/[0.04] font-['Inter',sans-serif] leading-none select-none"
                      aria-hidden="true"
                    >
                      {event.year}
                    </div>

                    {/* Top Bar: Archival Tags & Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#EB0028] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(235, 0, 40,0.5)]">
                          EDITION {event.edition || `0${index + 1}`}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#E5E5EA] font-mono text-xs uppercase tracking-wider">
                          CIT {event.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA]">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-[#EB0028]" />
                          <span>{event.date}</span>
                        </span>
                        <span className="hidden lg:flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
                          <span>{event.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Center / Bottom Content Area */}
                    <div className="max-w-3xl">
                      {/* Theme Code Moniker */}
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-[#EB0028] font-bold mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
                        <span>THEME FOCUS</span>
                        <span className="text-white/30">//</span>
                        <span className="text-white/90">{event.theme || 'UNTAPPED'}</span>
                      </div>

                      {/* Main Title */}
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] font-['Inter',sans-serif]">
                        {event.title}
                      </h3>

                      {/* Manifesto / Tagline */}
                      <p className="mt-3 text-sm sm:text-base text-[#D1D1D6] leading-relaxed max-w-2xl font-normal">
                        {event.tagline}
                      </p>

                      {/* Triad Impact Metric Strip */}
                      <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
                        <div>
                          <span className="block text-[10px] font-mono uppercase text-[#8E8E93] tracking-wider">
                            TALK SESSIONS
                          </span>
                          <span className="block text-xl font-bold text-white mt-0.5">
                            {event.stats?.talks || '12 Talks'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono uppercase text-[#8E8E93] tracking-wider">
                            ATTENDEES
                          </span>
                          <span className="block text-xl font-bold text-white mt-0.5">
                            {event.stats?.delegates || '1,000+'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono uppercase text-[#8E8E93] tracking-wider">
                            GLOBAL STREAM
                          </span>
                          <span className="block text-xl font-bold text-[#EB0028] mt-0.5">
                            {event.stats?.views || '350K+'}
                          </span>
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="mt-8 flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalEvent(event);
                          }}
                          className="px-6 py-3 rounded-xl bg-[#EB0028] hover:bg-[#C80022] text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_4px_25px_rgba(235, 0, 40,0.4)] hover:shadow-[0_6px_35px_rgba(235, 0, 40,0.6)] flex items-center gap-2 cursor-pointer"
                        >
                          <span>Inspect Full Archive Dossier</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            MOBILE & TABLET VIEW: EXPANDING VERTICAL ARCHITECTURAL DRAWERS
            Automatically cycles through editions on mobile too!
            ========================================================================= */}
        <div
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 3000)}
          className="md:hidden flex flex-col gap-3"
        >
          {events.map((event, index) => {
            const isActive = event.id === activeId;

            return (
              <div
                key={event.id}
                onClick={() => {
                  setActiveId(isActive ? '' : event.id);
                  setCycleIndex((prev) => prev + 1);
                }}
                className={`rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'border-[#EB0028] bg-[#0C0C0F] shadow-[0_15px_40px_rgba(235, 0, 40,0.25)]'
                    : 'border-white/10 bg-[#08080A]'
                }`}
              >
                {/* Mobile Drawer Countdown Line */}
                {isActive && isAutoCycleEnabled && !isHovered && (
                  <div className="h-[2px] bg-white/10 w-full overflow-hidden">
                    <div
                      key={`mob-bar-${cycleIndex}`}
                      className="h-full bg-[#EB0028]"
                      style={{
                        animation: `progressCountdown ${AUTO_CYCLE_DURATION_MS}ms linear forwards`,
                      }}
                    />
                  </div>
                )}

                {/* Drawer Header (Always Visible) */}
                <div className="relative p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        isActive
                          ? 'bg-[#EB0028] text-white shadow-[0_0_15px_rgba(235, 0, 40,0.5)]'
                          : 'bg-white/5 border border-white/10 text-[#EB0028]'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <span className="block text-xs font-mono uppercase text-[#8E8E93]">
                        CIT {event.year}
                      </span>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {event.theme || event.title}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-transform duration-300 ${
                      isActive
                        ? 'border-[#EB0028] text-[#EB0028] rotate-90'
                        : 'border-white/10 text-white/40'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Drawer Body (Expands when Active) */}
                {isActive && (
                  <div className="p-5 pt-0 border-t border-white/10 space-y-4 animate-panel-in">
                    <div className="h-44 rounded-xl overflow-hidden relative mt-4 border border-white/10">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-white/80 flex items-center justify-between">
                        <span>{event.date}</span>
                        <span>{event.stats?.talks || '12 Talks'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#D1D1D6] leading-relaxed">
                      {event.tagline}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalEvent(event);
                      }}
                      className="w-full py-3 rounded-xl bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <span>Open Edition Dossier</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE ARCHIVE DOSSIER MODAL
          ========================================================================= */}
      {modalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn"
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          onClick={() => setModalEvent(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0C0C0E] border border-[#2B2B30] rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setModalEvent(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white hover:bg-[#EB0028] hover:border-[#EB0028] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body with Custom Modal Scrollbar */}
            <div
              className="overflow-y-auto flex-1 overscroll-contain p-6 sm:p-10 space-y-8 custom-modal-scrollbar"
              data-lenis-prevent="true"
              tabIndex={0}
            >
              {/* Header Hero Image */}
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={modalEvent.image}
                  alt={modalEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-black/60 to-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EB0028] text-white text-[10px] font-mono uppercase tracking-widest rounded-full mb-2">
                    <span>EDITION {modalEvent.edition || '06'} ARCHIVE</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {modalEvent.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#A1A1AA] flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#EB0028]" />
                      <span>{modalEvent.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
                      <span>{modalEvent.location}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Tagline / Manifesto */}
              <div className="p-5 rounded-2xl bg-[#141418] border border-[#26262B]">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EB0028] font-bold block mb-1">
                  EDITION MANIFESTO & THEME
                </span>
                <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
                  "{modalEvent.tagline}"
                </p>
              </div>

              {/* Impact Metrics Trio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="block text-[10px] font-mono uppercase text-[#8E8E93] tracking-wider">
                    TALKS DELIVERED
                  </span>
                  <span className="block text-2xl font-black text-white mt-1">
                    {modalEvent.stats?.talks || '12 Talks'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="block text-[10px] font-mono uppercase text-[#8E8E93] tracking-wider">
                    AUDIENCE REACH
                  </span>
                  <span className="block text-2xl font-black text-white mt-1">
                    {modalEvent.stats?.delegates || '1,000+'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="block text-[10px] font-mono uppercase text-[#8E8E93] tracking-wider">
                    DIGITAL STREAM
                  </span>
                  <span className="block text-2xl font-black text-[#EB0028] mt-1">
                    {modalEvent.stats?.views || '350K+'}
                  </span>
                </div>
              </div>

              {/* Landmark Keynotes & Highlights */}
              {modalEvent.highlights && modalEvent.highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#8E8E93] mb-3">
                    LANDMARK TALKS & TALENT HIGHLIGHTS
                  </h4>
                  <div className="space-y-2">
                    {modalEvent.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#121215] border border-white/5 text-sm text-[#E5E5EA]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#EB0028] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curator Quote */}
              {modalEvent.curatorQuote && (
                <div className="p-4 rounded-xl bg-[#EB0028]/5 border border-[#EB0028]/20 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#EB0028] shrink-0 mt-0.5" />
                  <p className="text-sm font-normal text-white/90">
                    "{modalEvent.curatorQuote}"
                  </p>
                </div>
              )}
            </div>

            {/* Docked Action Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E11]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
              <button
                onClick={() => setModalEvent(null)}
                className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
              >
                Close Dossier
              </button>

              <a
                href="/speakers"
                onClick={() => setModalEvent(null)}
                className="px-6 py-2.5 bg-[#EB0028] hover:bg-[#C80022] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(235,0,40,0.4)] flex items-center gap-2"
              >
                <span>View 2027 Speaker Lineup</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

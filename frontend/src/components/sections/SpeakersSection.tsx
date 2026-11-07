'use client';

import React, { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { ArrowRight, Mic, Clock, MapPin, X, Share2, Check, Quote } from 'lucide-react';

export interface SpeakerItem {
  id: string;
  name: string;
  designation: string;
  topic: string;
  image: string;
  category?: string;
  sessionNumber?: string;
  sessionTime?: string;
  bio?: string;
  talkSummary?: string;
  quote?: string;
  link?: string;
}

export interface SpeakersSectionProps {
  /** Section heading. Default: "Visionary minds. Uncharted ideas." */
  title?: string;
  /** Eyebrow text. Default: "OFFICIAL LINEUP • TEDxCIT 2027" */
  eyebrow?: string;
  /** Subtitle narrative */
  description?: string;
  /** Optional custom speakers data */
  speakers?: SpeakerItem[];
  /** Optional custom CSS classes */
  className?: string;
  /** Whether to show category filter pills. Default: true */
  showFilters?: boolean;
}

export const DEFAULT_SPEAKERS: SpeakerItem[] = [
  {
    id: 'speaker-aris-thorne',
    name: 'Dr. Aris Thorne',
    designation: 'Director of Cognitive Robotics & AI Systems, MIT',
    topic: 'The Architecture of Unconscious Machines',
    image: '/images/reference-speaker.jpg',
    category: 'Technology',
    sessionNumber: '01',
    sessionTime: '10:00 AM - 10:30 AM',
    talkSummary:
      'Exploring how emergent neuromorphic computing and synthetic intuitive networks are challenging our definitions of intent, cognition, and machine intelligence.',
    bio: 'Dr. Thorne is a world-renowned roboticist specializing in non-deterministic neural networks and embodied AI. His laboratory has pioneered adaptive architectures currently deployed in deep-space exploration probes.',
    quote: 'Intelligence is not merely computing certainty; it is navigating the beauty of uncertainty.',
  },
  {
    id: 'speaker-maya-lin',
    name: 'Maya Lin-Vanderbilt',
    designation: 'Ecological Architect & Founder, EarthBio Systems',
    topic: 'Rewiring the Biosphere: Micro-Ecologies in Concrete Jungles',
    image: '/images/stage-speaker-crop.jpg',
    category: 'Sustainability',
    sessionNumber: '02',
    sessionTime: '10:45 AM - 11:15 AM',
    talkSummary:
      'How living bacterial concrete, photosynthetic skyscraper facades, and mycorrhizal urban networks can transform hyper-dense cities into net-oxygen generators.',
    bio: 'Maya combines synthetic biology with monumental civil design. Her award-winning ecological installations have been commissioned in over 14 global metropolises.',
    quote: 'We must stop designing structures that displace nature and start engineering habitats that invite it back.',
  },
  {
    id: 'speaker-rajeshwari-sundaram',
    name: 'Rajeshwari Sundaram',
    designation: 'Ethnomusicologist & Quantum Acoustics Researcher',
    topic: 'Ancient Frequencies: The Quantum Geometry of Sound',
    image: '/images/tedx-speaker-stage-poster.jpg',
    category: 'Humanities',
    sessionNumber: '03',
    sessionTime: '11:30 AM - 12:00 PM',
    talkSummary:
      'Uncovering the mathematical resonance codes of classical temple architectures and how acoustic frequency interference shapes human neurochemistry.',
    bio: 'Trained at the intersection of classical Carnatic music traditions and modern computational acoustics, Rajeshwari bridges ancient sonic heritage with neurological therapy.',
    quote: 'Sound is the oldest architecture humanity has ever constructed.',
  },
  {
    id: 'speaker-vikramaditya-sen',
    name: 'Dr. Vikramaditya Sen',
    designation: 'Neurosurgeon & Cognitive Cartography Lead, NeuralSync',
    topic: 'Memory Cartography: Decoding the Geometry of Human Resilience',
    image: '/images/frames/frame-set1-1.jpg',
    category: 'Science',
    sessionNumber: '04',
    sessionTime: '01:30 PM - 02:00 PM',
    talkSummary:
      'A deep dive into how high-density neural imaging is mapping where traumatic memories dwell in 3D cortex coordinates—and how non-invasive targeted frequencies can dissolve trauma.',
    bio: 'Pioneering brain-computer interface surgeon with over 20 years in neuroplasticity research, Dr. Sen leads global clinical trials on neural trauma remediation.',
    quote: 'Our memories do not live in isolation; they are living constellations waiting to be re-charted.',
  },
  {
    id: 'speaker-elena-rostova',
    name: 'Elena Rostova',
    designation: 'Principal Urban Futurist & Chief Design Officer, Studio Morphosis',
    topic: 'Cities That Breathe: Biomimicry at Megacity Scale',
    image: '/images/frames/frame-set1-2.jpg',
    category: 'Design',
    sessionNumber: '05',
    sessionTime: '02:15 PM - 02:45 PM',
    talkSummary:
      'Rethinking transit veins, thermodynamic building envelopes, and solar canopy algorithms inspired by cardiovascular systems and desert flora.',
    bio: 'Recognized by Architectural Review as a Vanguard Fellow, Elena has engineered micro-climate master plans for coastal regions facing severe meteorological shifts.',
    quote: 'A truly smart city does not monitor its citizens; it adapts to their pulse.',
  },
  {
    id: 'speaker-kaviraj-ananth',
    name: 'Kaviraj Ananth',
    designation: 'Aerospace Propulsion Engineer & Deep-Space Systems Lead',
    topic: 'Beyond Earth Orbit: The Quantum Leap of Deep-Space Propulsion',
    image: '/images/frames/frame-set1-3.jpg',
    category: 'Technology',
    sessionNumber: '06',
    sessionTime: '03:00 PM - 03:30 PM',
    talkSummary:
      'The engineering breakthroughs bringing magnetoplasmadynamic thrusters and miniaturized fusion drives from blackboard equations to interstellar reality.',
    bio: 'Kaviraj has contributed to flagship interplanetary propulsion trajectories and currently directs an international aerospace coalition designing outer-solar-system probes.',
    quote: 'The stars have never moved further away; we simply forgot how boldly we used to sail.',
  },
];

/**
 * SpeakersSection — Glassy Cards with Card Reveal & Hover Expansion Animation
 *
 * Implements:
 * - Headline: "Visionary minds. Uncharted ideas."
 * - Glassy speaker cards in a responsive 3-column grid
 * - Exact keyframe cardReveal animation with staggered delay (index * 120ms)
 * - Interactive hover states:
 *   - Background scale zoom (1.12x)
 *   - Glassy gradient transition
 *   - Floating session badge reveals in top-right
 *   - Expanding accent line (w-12 -> w-full)
 *   - Expandable talk topic container (max-h-0 -> max-h-[140px])
 *   - "Explore Speaker & Talk" action trigger (max-h-0 -> max-h-[30px])
 * - Clickable modal dialog for full speaker dossier & session schedule
 */
export const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  title = 'Visionary minds. Uncharted ideas.',
  eyebrow = 'OFFICIAL LINEUP • TEDxCIT 2027',
  description = 'Meet the groundbreaking thinkers, innovators, and changemakers stepping into the red circle at Chennai Institute of Technology to ignite dialogues that shape our collective future.',
  speakers = DEFAULT_SPEAKERS,
  className = '',
  showFilters = true,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  const [activeSpeaker, setActiveSpeaker] = useState<SpeakerItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Handle modal body scroll locking and smooth scroll pause
  useEffect(() => {
    if (activeSpeaker) {
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
  }, [activeSpeaker]);

  const handleShareSpeaker = (speaker: SpeakerItem) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${speaker.name} at TEDxCIT 2027`,
          text: `Discover ${speaker.name}'s talk on "${speaker.topic}" at TEDxCIT 2027!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="speakers"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-20 lg:py-28 relative overflow-hidden ${className}`}
      aria-label="Speakers and Keynote Lineup"
    >
      {/* Inline styles for the exact cardReveal keyframe and hover transitions */}
      <style>{`
        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.92);
            filter: blur(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        .speaker-card-reveal {
          animation: cardReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .speaker-card {
          transition: all 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .speaker-card:hover {
          box-shadow:
            0 24px 60px rgba(235, 0, 40, 0.28),
            0 0 0 1px rgba(235, 0, 40, 0.25);
          transform: translateY(-8px);
          border-color: rgba(235, 0, 40, 0.5);
        }
      `}</style>

      {/* Atmospheric Background Red Glow Accent */}
      <div
        className="absolute top-1/4 right-1/4 w-[750px] h-[550px] bg-[#EB0028]/14 rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/5 w-[650px] h-[450px] bg-[#EB0028]/10 rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-[90%] max-w-7xl mx-auto">
        {/* =========================================================================
            HEADER: "Visionary minds. Uncharted ideas."
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            {/* Monospace Eyebrow */}
            <div className="mb-3.5 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#8E8E93]">
                {eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Inter',sans-serif] leading-[1.1]">
              Visionary minds. <span className="text-[#EB0028]">Uncharted ideas.</span>
            </h2>

            {description && (
              <p className="mt-4 text-[#8E8E93] text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#8E8E93] uppercase tracking-wider">
            <Mic className="w-4 h-4 text-[#EB0028]" />
            <span>{speakers.length} CONFIRMED SPEAKERS</span>
          </div>
        </div>

        {/* =========================================================================
            6+ GLASSY CARDS GRID: With Exact Animation and Card Design
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => {
            return (
              <div
                key={speaker.id}
                onClick={() => setActiveSpeaker(speaker)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveSpeaker(speaker);
                  }
                }}
                className={`speaker-card group relative w-full max-w-[400px] h-[480px] rounded-2xl overflow-hidden shadow-lg mx-auto cursor-pointer block border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-md select-none ${
                  isInView ? 'speaker-card-reveal' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* 1. Background Image with 1.12x Zoom on Hover */}
                <div className="absolute inset-0 overflow-hidden bg-[#111111]">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    onError={(e) => {
                      // Fallback if image path does not exist yet
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/reference-speaker.jpg';
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.12]"
                    loading="lazy"
                  />
                </div>

                {/* 2. Glassy Gradient Transition Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/75 group-hover:to-black/35 backdrop-blur-[1px]" />

                {/* 3. Glowing Border on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#EB0028]/50 transition-all duration-500 pointer-events-none z-20" />

                {/* 4. Floating Session Badge in Top-Right (Appears on Hover) */}
                <div className="absolute top-5 right-5 z-10 opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="bg-black/80 backdrop-blur-xl rounded-xl px-4 py-3 text-center border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgba(235,0,40,0.35)]">
                    <span className="block text-[10px] font-bold tracking-[0.25em] text-[#EB0028] uppercase leading-none">
                      SESSION
                    </span>
                    <span className="block text-2xl font-light text-white leading-none mt-1 font-['Inter',sans-serif]">
                      {speaker.sessionNumber || '01'}
                    </span>
                    <span className="block text-[10px] text-white/60 mt-0.5 font-mono uppercase tracking-wider">
                      {speaker.category || 'TALK'}
                    </span>
                  </div>
                </div>

                {/* 5. Bottom Content Area */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                  {/* Expanding Accent Bar (w-12 -> w-full) */}
                  <div className="h-[2px] w-12 bg-[#EB0028] rounded-full mb-3.5 transition-all duration-700 ease-out group-hover:w-full" />

                  {/* Speaker Name */}
                  <h3 className="text-white text-[22px] font-bold leading-snug font-['Inter',sans-serif] tracking-tight mb-1 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white">
                    {speaker.name}
                  </h3>

                  {/* Speaker Designation */}
                  <p className="text-[#A1A1AA] text-xs sm:text-sm font-medium tracking-wide line-clamp-1 transition-colors group-hover:text-white/90">
                    {speaker.designation}
                  </p>

                  {/* Expandable Topic Details Container */}
                  <div className="flex flex-col gap-0 mt-0 mb-0 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:gap-2 group-hover:mt-3 group-hover:mb-3.5 group-hover:max-h-[140px] group-hover:opacity-100">
                    <div className="flex items-start gap-2.5 text-white/90 pt-2 border-t border-white/10">
                      <Mic size={15} className="text-[#EB0028] shrink-0 mt-0.5" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono text-[#EB0028] font-bold uppercase tracking-[0.2em] leading-tight">
                          TALK TOPIC
                        </span>
                        <span className="text-sm font-semibold text-white/95 leading-snug mt-0.5 line-clamp-2">
                          "{speaker.topic}"
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable "View Profile" Link */}
                  <div
                    className="flex items-center gap-2 text-[#EB0028] font-bold uppercase tracking-[0.18em] text-[11px] max-h-0 overflow-hidden opacity-0 transition-all duration-400 ease-out group-hover:max-h-[30px] group-hover:opacity-100 group-hover:translate-x-1"
                    style={{ transitionDelay: '80ms' }}
                  >
                    <span>Explore Speaker & Talk</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
      </div>

      {/* =========================================================================
          SPEAKER DETAIL MODAL
          ========================================================================= */}
      {activeSpeaker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          onClick={() => setActiveSpeaker(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0B0B0C] border border-[#2A2A2E] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveSpeaker(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white/80 hover:text-white hover:bg-[#EB0028] hover:border-[#EB0028] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Modal Body */}
            <div
              className="overflow-y-auto flex-1 overscroll-contain p-6 sm:p-8 md:p-10 space-y-6 custom-modal-scrollbar"
              data-lenis-prevent="true"
              tabIndex={0}
            >
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start pr-8 sm:pr-10">
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#EB0028]/40 shadow-xl shrink-0 bg-[#161616]">
                  <img
                    src={activeSpeaker.image}
                    alt={activeSpeaker.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/reference-speaker.jpg';
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#EB0028] mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#EB0028]" />
                    <span>SESSION {activeSpeaker.sessionNumber || '01'}</span>
                    <span className="text-[#8E8E93]">•</span>
                    <span className="text-[#8E8E93]">{activeSpeaker.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    {activeSpeaker.name}
                  </h3>

                  <p className="mt-1.5 text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
                    {activeSpeaker.designation}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-[#8E8E93]">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-[#EB0028]" />
                      <span>{activeSpeaker.sessionTime || '10:00 AM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
                      <span>Main Auditorium Stage</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#141416] border border-[#2A2A2E] relative overflow-hidden">
                <div className="h-full w-1.5 bg-[#EB0028] absolute left-0 top-0 bottom-0" />
                <div className="pl-3">
                  <span className="text-[11px] font-mono text-[#EB0028] font-bold uppercase tracking-[0.2em] block mb-1">
                    KEYNOTE TOPIC
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    "{activeSpeaker.topic}"
                  </h4>
                  {activeSpeaker.talkSummary && (
                    <p className="mt-3 text-sm text-[#D1D1D6] leading-relaxed">
                      {activeSpeaker.talkSummary}
                    </p>
                  )}
                </div>
              </div>

              {activeSpeaker.bio && (
                <div>
                  <h5 className="text-xs font-mono uppercase tracking-widest text-[#8E8E93] mb-2">
                    BIOGRAPHY & BACKGROUND
                  </h5>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{activeSpeaker.bio}</p>
                </div>
              )}

              {activeSpeaker.quote && (
                <div className="p-4 rounded-xl bg-[#EB0028]/5 border border-[#EB0028]/20 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#EB0028] shrink-0 mt-0.5" />
                  <p className="text-sm font-normal text-white/90">"{activeSpeaker.quote}"</p>
                </div>
              )}
            </div>

            {/* Docked Action Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E11]/95 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleShareSpeaker(activeSpeaker)}
                className="px-4 py-2.5 border border-white/20 hover:border-white/50 text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied' : 'Share Speaker'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveSpeaker(null)}
                  className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="/register"
                  className="px-6 py-2.5 bg-[#EB0028] hover:bg-[#C80022] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(235,0,40,0.35)] flex items-center justify-center gap-2"
                >
                  <span>Attend Talk</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


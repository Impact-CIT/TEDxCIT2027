'use client';

import React, { useRef } from 'react';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import { useInView } from 'framer-motion';

export interface PastEventItem {
  id: string;
  title: string;
  date: string; // ISO date string e.g. "2026-03-15"
  location: string;
  image: string;
  link: string;
}

export interface PastEventsSectionProps {
  /** Section heading. Default: "Past events. Lasting ideas." */
  title?: string;
  /** Eyebrow text. Default: "EDITIONS & ARCHIVE" */
  eyebrow?: string;
  /** Subtitle narrative */
  description?: string;
  /** Optional custom events data. Defaults to 6 past TEDx CIT events */
  events?: PastEventItem[];
  /** Optional custom CSS classes */
  className?: string;
}

const DEFAULT_PAST_EVENTS: PastEventItem[] = [
  {
    id: 'cit-2026',
    title: 'TEDxCIT 2026: UNTAPPED',
    date: '2026-02-18',
    location: 'Main Auditorium, CIT Chennai',
    image: '/images/frames/frame-set1-1.jpg',
    link: '#',
  },
  {
    id: 'cit-2025',
    title: 'TEDxCIT 2025: Breaking Boundaries',
    date: '2025-03-22',
    location: 'Innovation Hall, CIT Campus',
    image: '/images/frames/frame-set1-2.jpg',
    link: '#',
  },
  {
    id: 'cit-2024',
    title: 'TEDxCIT 2024: The Human Horizon',
    date: '2024-04-10',
    location: 'CIT Convention Centre',
    image: '/images/frames/frame-set1-3.jpg',
    link: '#',
  },
  {
    id: 'cit-2023',
    title: 'TEDxCIT 2023: Catalysts of Change',
    date: '2023-09-14',
    location: 'Main Auditorium, CIT Chennai',
    image: '/images/frames/frame-set2-1.jpg',
    link: '#',
  },
  {
    id: 'cit-2022',
    title: 'TEDxCIT 2022: Infinite Resonances',
    date: '2022-10-05',
    location: 'CIT Open Amphitheatre',
    image: '/images/frames/frame-set2-2.jpg',
    link: '#',
  },
  {
    id: 'cit-2021',
    title: 'TEDxCIT 2021: Igniting Curiosity',
    date: '2021-11-20',
    location: 'Virtual Global Stage, Chennai',
    image: '/images/frames/frame-set2-3.jpg',
    link: '#',
  },
];

/**
 * Parses date string into day, month, and year parts
 */
function getDateParts(dateStr: string) {
  const d = new Date(dateStr);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: months[d.getMonth()] || 'MAR',
    year: d.getFullYear().toString(),
  };
}

/**
 * Formats date into readable string e.g. "March 15, 2026"
 */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * PastEventsSection — 6 Glassy Cards with Card Reveal & Hover Expansion Animation
 *
 * Implements:
 * - Headline: "Past events. Lasting ideas."
 * - 6 glassy event cards in a responsive 3-column grid
 * - Exact keyframe cardReveal animation with staggered delay (index * 120ms)
 * - Interactive hover states:
 *   - Background scale zoom (1.12x)
 *   - Glassy gradient transition
 *   - Floating date badge reveals in top-right
 *   - Expanding accent line (w-12 -> w-full)
 *   - Expandable date & location details (max-h-0 -> max-h-[120px])
 *   - "View Details ↗" action trigger (max-h-0 -> max-h-[30px])
 */
export const PastEventsSection: React.FC<PastEventsSectionProps> = ({
  title = 'Past events. Lasting ideas.',
  eyebrow = 'ARCHIVE & EDITIONS',
  description = 'Explore the previous gatherings, visionary speakers, and groundbreaking dialogues that have defined the TEDx Chennai Institute of Technology stage.',
  events = DEFAULT_PAST_EVENTS,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      id="past-events"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-20 lg:py-28 relative overflow-hidden ${className}`}
      aria-label="Past Events and Lasting Ideas"
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

        .event-card-reveal {
          animation: cardReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .event-card {
          transition: all 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .event-card:hover {
          box-shadow:
            0 24px 60px rgba(235, 0, 40, 0.28),
            0 0 0 1px rgba(235, 0, 40, 0.25);
          transform: translateY(-8px);
          border-color: rgba(235, 0, 40, 0.5);
        }
      `}</style>

      {/* Subtle Background Glow Accent */}
      <div
        className="absolute top-1/3 right-1/4 w-[750px] h-[550px] bg-[#EB0028]/6 rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-[90%] max-w-7xl mx-auto">
        
        {/* =========================================================================
            HEADER: "Past events. Lasting ideas."
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sm:mb-16">
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
              Past events. <span className="text-[#EB0028]">Lasting ideas.</span>
            </h2>

            {description && (
              <p className="mt-4 text-[#8E8E93] text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#8E8E93] uppercase tracking-wider">
            <span>6 EDITIONS ARCHIVED</span>
          </div>
        </div>

        {/* =========================================================================
            6 GLASSY CARDS GRID: With Exact Animation and Card Design
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => {
            const { day, month, year } = getDateParts(event.date);

            return (
              <a
                key={event.id}
                href={event.link}
                className={`event-card group relative w-full max-w-[400px] h-[460px] rounded-2xl overflow-hidden shadow-lg mx-auto cursor-pointer block border border-white/10 bg-[#0A0A0A]/70 backdrop-blur-md ${
                  isInView ? 'event-card-reveal' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* 1. Background Image with 1.12x Zoom on Hover */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
                    loading="lazy"
                  />
                </div>

                {/* 2. Glassy Gradient Transition Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/75 group-hover:to-black/35 backdrop-blur-[1px]" />

                {/* 3. Glowing Border on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#EB0028]/50 transition-all duration-500 pointer-events-none z-20" />

                {/* 4. Floating Date Badge in Top-Right (Appears on Hover) */}
                <div className="absolute top-5 right-5 z-10 opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="bg-black/80 backdrop-blur-xl rounded-xl px-4 py-3 text-center border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgba(235,0,40,0.35)]">
                    <span className="block text-[10px] font-bold tracking-[0.25em] text-[#EB0028] uppercase leading-none">
                      {month}
                    </span>
                    <span className="block text-3xl font-light text-white leading-none mt-1.5 font-['Inter',sans-serif]">
                      {day}
                    </span>
                    <span className="block text-[10px] text-white/50 mt-0.5 font-mono">
                      {year}
                    </span>
                  </div>
                </div>

                {/* 5. Bottom Content Area */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                  {/* Expanding Accent Bar */}
                  <div className="h-[2px] w-12 bg-[#EB0028] rounded-full mb-4 transition-all duration-700 ease-out group-hover:w-full" />

                  {/* Event Title */}
                  <h3 className="text-white text-[22px] font-bold leading-snug font-['Inter',sans-serif] tracking-tight mb-0 transition-all duration-500 group-hover:translate-x-1 group-hover:mb-2">
                    {event.title}
                  </h3>

                  {/* Expandable Details Container (Date & Location) */}
                  <div className="flex flex-col gap-0 mt-0 mb-0 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:gap-2 group-hover:mt-2 group-hover:mb-4 group-hover:max-h-[120px] group-hover:opacity-100">
                    <div className="flex items-center gap-2.5 text-white/80">
                      <CalendarDays size={16} className="text-[#EB0028] shrink-0" />
                      <span className="text-sm font-normal tracking-wide">
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2.5 text-white/80">
                        <MapPin size={16} className="text-[#EB0028] shrink-0" />
                        <span className="text-sm font-normal tracking-wide truncate">
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expandable "View Details" Link */}
                  <div
                    className="flex items-center gap-2 text-[#EB0028] font-bold uppercase tracking-[0.18em] text-[11px] max-h-0 overflow-hidden opacity-0 transition-all duration-400 ease-out group-hover:max-h-[30px] group-hover:opacity-100 group-hover:translate-x-1"
                    style={{ transitionDelay: '80ms' }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </div>
                </div>

              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};


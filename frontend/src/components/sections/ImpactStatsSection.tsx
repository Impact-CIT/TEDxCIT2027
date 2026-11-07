'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, TrendingUp, Users, Radio, Globe } from 'lucide-react';

export interface StatItem {
  /** Target numeric value to count up to */
  value: number;
  /** Suffix to append after number (e.g., "+", "M", "k") */
  suffix?: string;
  /** Prefix to prepend before number (e.g., "$") */
  prefix?: string;
  /** Label underneath the stat (e.g., "SPEAKERS") */
  label: string;
  /** Sub-description underneath label */
  sublabel?: string;
  /** Whether to format with commas (e.g., 8,000 vs 8000). Default: false */
  useGrouping?: boolean;
}

export interface ImpactStatsSectionProps {
  /** Section title. Default: "A Decade of Impact" */
  title?: string;
  /** Descriptive tagline on the right. */
  description?: string;
  /** List of stats items. Defaults to 200+ SPEAKERS, 8000+ ATTENDEES, 20M VIEWS */
  stats?: StatItem[];
  /** Count up animation duration in milliseconds. Default: 2000ms */
  durationMs?: number;
  /** Optional custom CSS classes */
  className?: string;
}

const DEFAULT_STATS: StatItem[] = [
  {
    value: 200,
    suffix: '+',
    label: 'SPEAKERS',
    sublabel: 'Visionaries across science, tech, art & humanity',
    useGrouping: false,
  },
  {
    value: 8000,
    suffix: '+',
    label: 'ATTENDEES',
    sublabel: 'Delegates, innovators & passionate thinkers',
    useGrouping: false,
  },
  {
    value: 20,
    suffix: 'M',
    label: 'VIEWS',
    sublabel: 'Global reach across talks & media platforms',
    useGrouping: false,
  },
];

const cinematicEase = [0.16, 1, 0.3, 1] as const;

/**
 * Single animated counter component
 */
const AnimatedCounter: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  useGrouping?: boolean;
  isInView: boolean;
  durationMs?: number;
}> = ({ target, prefix = '', suffix = '', useGrouping = false, isInView, durationMs = 2000 }) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animId: number;

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutExpo(progress);

      const nextVal = Math.round(easedProgress * target);
      setCurrent(nextVal);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [isInView, target, durationMs]);

  const formattedNumber = useGrouping ? current.toLocaleString() : current.toString();

  return (
    <span className="tabular-nums">
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

/**
 * ImpactStatsSection — Animated Count-Up Metrics Section with AI Slope Architecture
 *
 * Implements:
 * - Top & bottom sloped laser accents with cyber mesh background.
 * - Headline: "A Decade of Impact" in two-tone white + TED red.
 * - 3 large statistics with interactive frosted glass cards, glowing laser lines,
 *   and smooth count-up triggered on scroll.
 * - Staggered Framer Motion entrance animations.
 */
export const ImpactStatsSection: React.FC<ImpactStatsSectionProps> = ({
  title = 'A Decade of Impact',
  description = 'We expose echo chambers, break down silos, and spotlight "ideas worth spreading" from all over the world.',
  stats = DEFAULT_STATS,
  durationMs = 2200,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      id="tedx-impact-stats"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-24 lg:py-32 relative overflow-hidden ${className}`}
      aria-label="TEDx Chennai Institute of Technology Impact Metrics"
    >
      {/* Deep Breathing Theatrical Ambient Red Aura */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#EB0028]/14 rounded-full blur-[200px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-[1700px] mx-auto">
        
        {/* =========================================================================
            TOP ROW: Title & Tagline Narrative with Framer Motion Reveal
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.85, ease: cinematicEase }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16 mb-16 sm:mb-20 lg:mb-24"
        >
          {/* Left: Eyebrow + "A Decade of Impact" */}
          <div className="max-w-2xl">
            <div className="mb-3.5 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#8E8E93]">
                HISTORICAL TELEMETRY // 2017 — 2027
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold tracking-tight text-white font-['Inter',sans-serif] leading-[1.08]">
              A Decade of <span className="text-[#EB0028] drop-shadow-[0_4px_24px_rgba(235,0,40,0.3)]">Impact</span>
            </h2>
          </div>

          {/* Right: Narrative Description */}
          <div className="max-w-xl">
            <p className="text-[#A0A0A5] text-base sm:text-lg lg:text-[19px] leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </motion.div>

        {/* =========================================================================
            BOTTOM ROW: 3 Large Animated Statistics in Sloped Cards
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.85, ease: cinematicEase, delay: idx * 0.12 }}
              className="group relative rounded-2xl bg-[#09090C]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 transition-all duration-500 hover:border-[#EB0028]/60 hover:bg-[#0D0D12] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(235,0,40,0.18)] overflow-hidden"
            >
              {/* Corner Architectural Brackets */}
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/10 group-hover:border-[#EB0028] transition-colors duration-300" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/10 group-hover:border-[#EB0028] transition-colors duration-300" />

              {/* Laser accent line along top on hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Index Telemetry */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[11px] text-[#8E8E93] uppercase tracking-[0.2em] group-hover:text-[#EB0028] transition-colors">
                  METRIC // 0{idx + 1}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#EB0028] transition-colors" />
              </div>

              {/* Giant Metric Number */}
              <div className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-none mb-4 font-['Inter',sans-serif] group-hover:text-white transition-colors">
                <AnimatedCounter
                  target={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  useGrouping={item.useGrouping}
                  isInView={isInView}
                  durationMs={durationMs}
                />
              </div>

              {/* Expanding Accent Line */}
              <div className="w-12 h-[2px] bg-[#EB0028] my-4 transition-all duration-500 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-[#EB0028] group-hover:to-transparent" />

              {/* Monospace Uppercase Category Label */}
              <span className="block font-mono text-sm sm:text-base uppercase tracking-[0.2em] text-white font-bold mb-1.5">
                {item.label}
              </span>

              {/* Sublabel description */}
              {item.sublabel && (
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  {item.sublabel}
                </p>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

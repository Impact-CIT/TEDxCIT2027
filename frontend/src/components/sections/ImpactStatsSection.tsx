'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export interface StatItem {
  /** Target numeric value to count up to */
  value: number;
  /** Suffix to append after number (e.g., "+", "M", "k") */
  suffix?: string;
  /** Prefix to prepend before number (e.g., "$") */
  prefix?: string;
  /** Label underneath the stat (e.g., "SPEAKERS") */
  label: string;
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
    useGrouping: false,
  },
  {
    value: 8000,
    suffix: '+',
    label: 'ATTENDEES',
    useGrouping: false,
  },
  {
    value: 20,
    suffix: 'M',
    label: 'VIEWS',
    useGrouping: false,
  },
];

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
 * ImpactStatsSection — Animated Count-Up Metrics Section
 *
 * Implements:
 * - Headline: "A Decade of Impact"
 * - Tagline: "We expose echo chambers, break down silos, and spotlight 'ideas worth spreading' from all over the world."
 * - 3 large statistics (200+ SPEAKERS, 8000+ ATTENDEES, 20M VIEWS) separated by crisp vertical lines
 * - Dynamically counts up as soon as visitor scrolls into view
 */
export const ImpactStatsSection: React.FC<ImpactStatsSectionProps> = ({
  title = 'A Decade of Impact',
  description = 'We expose echo chambers, break down silos, and spotlight "ideas worth spreading" from all over the world.',
  stats = DEFAULT_STATS,
  durationMs = 2200,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Triggers count-up when section enters viewport
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      id="tedx-impact-stats"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-20 lg:py-28 relative overflow-hidden ${className}`}
      aria-label="TEDx Chennai Institute of Technology Impact Metrics"
    >
      {/* Subtle Background Glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-[#EB0028]/5 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 max-w-[1700px] mx-auto">
        
        {/* =========================================================================
            TOP ROW: Title & Tagline Narrative
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 lg:gap-16 mb-16 sm:mb-20 lg:mb-24">
          
          {/* Left: "A Decade of Impact" */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-bold tracking-tight text-white font-['Inter',sans-serif] leading-[1.08]">
            {title}
          </h2>

          {/* Right: Narrative Description */}
          <p className="text-[#A0A0A5] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-xl font-normal pt-1 lg:pt-2">
            {description}
          </p>
        </div>

        {/* =========================================================================
            BOTTOM ROW: 3 Large Animated Statistics with Vertical Dividers
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-end ${
                idx > 0
                  ? 'md:border-l md:border-[#222222] md:pl-10 lg:pl-14 xl:pl-16'
                  : 'md:pr-10 lg:pr-14'
              }`}
            >
              {/* Giant Metric Number */}
              <div className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-none mb-3 sm:mb-4 font-['Inter',sans-serif]">
                <AnimatedCounter
                  target={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  useGrouping={item.useGrouping}
                  isInView={isInView}
                  durationMs={durationMs}
                />
              </div>

              {/* Monospace Uppercase Category Label */}
              <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-[#8E8E93] font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


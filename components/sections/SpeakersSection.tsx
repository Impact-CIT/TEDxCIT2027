'use client';

import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

export interface SpeakerItem {
  id: string;
  name: string;
  designation: string;
  image: string;
}

export interface SpeakersSectionProps {
  /** Section heading. Default: "Visionary minds. Uncharted ideas." */
  title?: string;
  /** Eyebrow text */
  eyebrow?: string;
  /** Subtitle narrative */
  description?: string;
  /** Optional custom speakers data */
  speakers?: SpeakerItem[];
  /** Optional custom CSS classes */
  className?: string;
}

export const DEFAULT_SPEAKERS: SpeakerItem[] = [
  {
    id: 'aysha-sanober',
    name: 'Aysha Sanober',
    designation: 'Action Coalitions Leader, Generation Equality/UN Women',
    image: '/Speakers/Aysha Sanober.JPG',
  },
  {
    id: 'harini-viswanathan',
    name: 'Harini Viswanathan',
    designation: 'Software Engineer, Bank of America',
    image: '/Speakers/Harini Viswanathan.JPG',
  },
  {
    id: 'shalini-robert',
    name: 'Shalini Robert',
    designation: 'Founder, The Roberts Charitable Trust',
    image: '/Speakers/Shalini Robert.JPG',
  },
  {
    id: 'preethikha-s',
    name: 'Preethikha S',
    designation: 'Student, Chennai Institute of Technology',
    image: '/Speakers/Preethika S.JPG',
  },
  {
    id: 'arti-dosanjh',
    name: 'Arti Dosanjh',
    designation: 'Director, Delivery at Sapiens',
    image: '/Speakers/Arti Dosanjh.JPG',
  },
  {
    id: 'swetha-kishore',
    name: 'Swetha Kishore',
    designation: 'Founder & CEO, Lafayette by Mug Cakes',
    image: '/Speakers/Swetha Kishore.JPG',
  },
  {
    id: 'indhumathi-l',
    name: 'Indhumathi L',
    designation: 'Test Specialist',
    image: '/Speakers/Indhumathi L.JPG',
  },
  {
    id: 'magathi-narayanan',
    name: 'Magathi Narayanan',
    designation: 'Student, Chennai Institute of Technology',
    image: '/Speakers/Magathi Narayanan.JPG',
  },
  {
    id: 'sangamithra-k',
    name: 'Sangamithra K',
    designation: 'Student, Chennai Institute of Technology',
    image: '/Speakers/Sangamithra.JPG',
  },
  {
    id: 'mrudula-oruganti',
    name: 'Mrudula Oruganti',
    designation: 'Founder, The Parenting Hub & Senior Alliance Cloud Solutions Engineer, Gigamon',
    image: '/Speakers/Mrudula Oraganti.JPG',
  },
  {
    id: 'vaisali-sridhar-babu',
    name: 'Vaisali Sridhar Babu',
    designation: 'Vice President, BFSI',
    image: '/Speakers/Vaisali Sridhar Babu.JPG',
  },
  {
    id: 'sachitha-s',
    name: 'Sachitha S',
    designation: 'Student, Chennai Institute of Technology',
    image: '/Speakers/Sachitha S.JPG',
  },
  {
    id: 'indu-gopalakrishnan',
    name: 'Indu Gopalakrishnan',
    designation: 'Founder, Project Kintsugi',
    image: '/Speakers/Indu Gopalakrishnan.JPG',
  },
  {
    id: 'ranjini-manian',
    name: 'Ranjini Manian',
    designation: 'Founder Chair, Global Adjustments Foundation - ChampionWoman',
    image: '/Speakers/Ranjini Manian.JPG',
  },
  {
    id: 'immaculate-reshma',
    name: 'Immaculate Reshma',
    designation: 'Product Manager, Zoho',
    image: '/Speakers/Immaculate Reshma.JPG',
  },
  {
    id: 'merlin-jennifer',
    name: 'Merlin Jennifer',
    designation: 'Student, Chennai Institute of Technology',
    image: '/Speakers/Merlin Jennifer.JPG',
  },
  {
    id: 'arasi-arul',
    name: 'Arasi Arul',
    designation: 'Director, TN W.O.M.E.N. & Member, National Human Rights Commission',
    image: '/Speakers/Arasi Arul.JPG',
  },
  {
    id: 'yamini-lakshmipathy',
    name: 'Yamini Lakshmipathy',
    designation: 'Director of Engineering, Fourkites',
    image: '/Speakers/Yamini Lakshmipathy.JPG',
  },
  {
    id: 'preethi-sri-s',
    name: 'Preethi Sri S',
    designation: 'Global Head, Digital Expansion Solution Engineering',
    image: '/Speakers/Preethi Sri.JPG',
  },
  {
    id: 'ambika-natarajan',
    name: 'Ambika Natarajan',
    designation: 'Senior Vice President, HCLTech',
    image: '/Speakers/Ambika Natarajan.JPG',
  },
  {
    id: 'zohra-fakrudeen-ali',
    name: 'Zohra Fakrudeen Ali',
    designation: 'Student, Chennai Institute of Technology',
    image: '/Speakers/Zohra Fakrudeen Ali.JPG',
  },
];

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  title = 'Visionary minds. Uncharted ideas.',
  eyebrow = '',
  description = 'Every idea has a story, every perspective holds a possibility, and every voice has the power to spark change. Meet the minds who dare to explore beyond the obvious and bring the untapped into the spotlight.',
  speakers = DEFAULT_SPEAKERS,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <section
      ref={sectionRef}
      id="speakers-section"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-24 sm:py-28 lg:py-36 relative overflow-hidden font-sans ${className}`}
      aria-label="TEDx Chennai Institute of Technology Speakers"
    >
      <style>{`
        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        .speaker-card-reveal {
          animation: cardReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .speaker-card {
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .speaker-card:hover {
          box-shadow:
            0 24px 60px rgba(235, 0, 40, 0.22),
            0 0 0 1px rgba(235, 0, 40, 0.35);
          transform: translateY(-6px);
          border-color: rgba(235, 0, 40, 0.5);
        }
      `}</style>

      {/* Atmospheric Background Red Glow Accent */}
      <div
        className="absolute top-1/4 right-1/4 w-[750px] h-[550px] bg-[#EB0028]/12 rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/5 w-[600px] h-[450px] bg-[#EB0028]/10 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-[1700px] mx-auto relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-[#1C1C1E] pb-10">
          <div className="w-full max-w-5xl">
            {eyebrow && (
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#8E8E93]">
                  {eyebrow}
                </span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Inter',sans-serif] leading-[1.1]">
              {title.includes('.') ? (
                <>
                  {title.split('.')[0]}.{' '}
                  <span className="text-[#EB0028]">{title.split('.')[1]}</span>
                </>
              ) : (
                title
              )}
            </h2>

            {description && (
              <p className="mt-4 text-[#8E8E93] text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-4xl lg:max-w-5xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* 21 Speaker Cards Grid: Purely hoverable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {speakers.map((speaker, index) => {
            return (
              <div
                key={speaker.id}
                className={`speaker-card group relative w-full h-[470px] rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] select-none ${isInView ? 'speaker-card-reveal' : 'opacity-0'
                  }`}
                style={{
                  animationDelay: `${Math.min(index * 60, 600)}ms`,
                }}
              >
                {/* 1. Portrait Image with Subtle Zoom on Hover */}
                <div className="absolute inset-0 overflow-hidden bg-[#0A0A0A]">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* 2. Base Dark Gradient Overlay (ensures text readability) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />

                {/* 3. Subtle Crimson Hover Aura */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#EB0028]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* 4. Bottom Content Area: Name and Position Only */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-7">
                  {/* Expanding Accent Bar */}
                  <div className="h-[2px] w-10 bg-[#EB0028] rounded-full mb-3.5 transition-all duration-500 ease-out group-hover:w-20" />

                  {/* Speaker Name */}
                  <h3 className="text-white text-xl sm:text-2xl font-bold font-['Inter',sans-serif] tracking-tight leading-snug group-hover:text-white transition-colors">
                    {speaker.name}
                  </h3>

                  {/* Speaker Position */}
                  <p className="text-[#A1A1AA] text-xs sm:text-sm font-medium tracking-wide mt-1.5 leading-relaxed group-hover:text-white/95 transition-colors">
                    {speaker.designation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

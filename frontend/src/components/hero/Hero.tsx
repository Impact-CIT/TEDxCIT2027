import React from 'react';

export interface HeroProps {
  /** Optional custom CSS classes for the section container */
  className?: string;
}

/**
 * Full-Screen Editorial Hero Section for TEDx Chennai Institute of Technology.
 * Official Event Theme: UNTAPPED
 *
 * Implements exact typographic alignment matching the reference crop:
 * - Left Column (68%): UN (off-white) & TAPPED (TED red) extending right up to the divider line
 * - Small Contained Divider: NOT full height; gracefully spans the content zone
 * - Right Column (32%): Big, bold editorial copy and enlarged button brought down alongside TAPPED
 */
export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  return (
    <section
      className={`relative w-full min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-92px)] bg-[#000000] text-[#F5F5F2] flex flex-col justify-between overflow-x-hidden font-sans ${className}`}
      aria-label="Event Theme: UNTAPPED"
    >
      <div className="flex-1 flex flex-col lg:flex-row items-stretch w-full">
        {/* ========================================================
            LEFT COLUMN — 68% Width
            TAPPED extends across the column right up against the divider,
            matching the tight clearance in the reference screenshot.
            ======================================================== */}
        <div className="w-full lg:w-[68%] xl:w-[68%] flex flex-col justify-start pl-6 sm:pl-10 lg:pl-14 xl:pl-16 pr-2 sm:pr-3 lg:pr-4 pt-8 sm:pt-10 lg:pt-12 xl:pt-14 pb-12 lg:pb-16 border-b lg:border-b-0">
          {/* Eyebrow Label with crisp, tight spacing matching reference */}
          <div className="mb-3 sm:mb-4 lg:mb-5">
            <span className="font-mono text-[11px] sm:text-xs md:text-[13px] tracking-[0.18em] uppercase text-[#8E8E93]">
              CHENNAI / IDEAS WORTH SPREADING
            </span>
          </div>

          {/* 
            Massive, extended UNTAPPED headline:
            - UN in off-white (#F5F5F2)
            - TAPPED in TED red (#FF2B25)
            - Sized and tracked to span across the left column right up to the divider line
          */}
          <h1 className="text-left font-black tracking-[-0.055em] sm:tracking-[-0.06em] leading-[0.82] select-none text-[clamp(5.5rem,16.8vw,18.8rem)]">
            <span className="block text-[#F5F5F2]">UN</span>
            <span className="block text-[#FF2B25]">TAPPED</span>
          </h1>
        </div>

        {/* ========================================================
            SMALL CONTAINED VERTICAL SEPARATING LINE
            Not full height: elegant ~420px line centered along content,
            leaving generous empty breathing room above and below.
            ======================================================== */}
        <div className="hidden lg:flex flex-col justify-center items-center shrink-0 py-8">
          <div className="w-[1px] h-[360px] xl:h-[420px] bg-[#292929]" />
        </div>

        {/* ========================================================
            RIGHT COLUMN — 32% Width
            Positioned down with large typography and bold CTA button:
            Top padding set to pt-16 sm:pt-20 lg:pt-[250px] xl:pt-[280px]
            anchoring the text across TAPPED and the button in the lower zone.
            ======================================================== */}
        <div className="w-full lg:w-[32%] xl:w-[32%] pl-5 sm:pl-7 lg:pl-7 xl:pl-8 pr-6 sm:pr-8 lg:pr-10 xl:pr-12 pt-16 sm:pt-20 lg:pt-[250px] xl:pt-[280px] pb-12 lg:pb-16 flex flex-col justify-start">
          <div className="max-w-md lg:max-w-[440px] xl:max-w-[490px]">
            {/* Enlarged, high-impact editorial introductory copy */}
            <p className="text-2xl sm:text-3xl lg:text-[28px] xl:text-[32px] leading-[1.28] sm:leading-[1.3] text-[#F5F5F2] font-medium tracking-[-0.025em]">
              Discover unexplored perspectives, challenge what you know, and uncover ideas waiting to make an impact.
            </p>

            {/* Enlarged Outlined Rectangular Button aligned directly below the text */}
            <div className="mt-10 sm:mt-12 lg:mt-14">
              <a
                href="/partner-with-us"
                className="group inline-flex items-center justify-between space-x-8 border border-[#292929] hover:border-[#F5F5F2] bg-transparent px-8 py-4.5 sm:px-9 sm:py-5 text-sm sm:text-[14px] lg:text-[15px] font-bold tracking-[0.1em] uppercase text-[#F5F5F2] hover:text-[#FF2B25] transition-all duration-300 rounded-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25]"
              >
                <span>PARTNER WITH US</span>
                <span
                  className="inline-block text-base sm:text-lg transition-transform duration-200 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

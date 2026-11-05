'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface FooterProps {
  className?: string;
  logoSrc?: string;
}

/* =========================================================================
   Pixel-Perfect Social Icons
   ========================================================================= */

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Footer Component matching the reference design for TEDx Chennai Institute of Technology.
 *
 * Left:
 *  - Official TEDx Chennai Institute of Technology logo / branding
 *  - License and copyright notice
 *
 * Right:
 *  - Social media icon links (Facebook, Instagram, LinkedIn, X, YouTube)
 *  - Privacy Policy link
 *  - Interactive "BACK TO TOP ↗" smooth scroll action
 */
export const Footer: React.FC<FooterProps> = ({
  className = '',
}) => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer
      id="site-footer"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] py-12 sm:py-16 px-6 sm:px-10 lg:px-14 xl:px-20 relative select-none ${className}`}
      role="contentinfo"
      aria-label="TEDx Chennai Institute of Technology Footer"
    >
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-10">
        
        {/* =========================================================================
            LEFT COLUMN: Official TEDx CIT Branding & Copyright
            ========================================================================= */}
        <div className="flex flex-col gap-3">
          {/* TEDx Wordmark / Logo */}
          <a
            href="/"
            aria-label="TEDx Chennai Institute of Technology Home"
            className="group inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
          >
            <div className="flex items-baseline gap-1.5 font-['Inter',sans-serif]">
              <span className="text-[#EB0028] font-black text-2xl sm:text-3xl tracking-tight leading-none">
                TED<span className="lowercase font-bold text-[0.8em]">x</span>
              </span>
              <span className="text-white font-medium text-xl sm:text-2xl tracking-tight leading-none">
                Chennai Institute of Technology
              </span>
            </div>
          </a>

          {/* Copyright & Official License Notice */}
          <div className="text-xs text-[#8E8E93] font-normal leading-relaxed">
            <p>© {new Date().getFullYear()} TEDx Chennai Institute of Technology. All rights reserved.</p>
            <p className="text-[11px] text-[#6E6E73] mt-0.5">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Social Icons, Privacy Policy & Back to Top
            ========================================================================= */}
        <div className="flex flex-col items-start md:items-end gap-5 sm:gap-6">
          
          {/* Social Media Link Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-[#EB0028] hover:border-[#EB0028] hover:bg-white/5 transition-all duration-200"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-[#EB0028] hover:border-[#EB0028] hover:bg-white/5 transition-all duration-200"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-[#EB0028] hover:border-[#EB0028] hover:bg-white/5 transition-all duration-200"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-[#EB0028] hover:border-[#EB0028] hover:bg-white/5 transition-all duration-200"
            >
              <XTwitterIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-[#EB0028] hover:border-[#EB0028] hover:bg-white/5 transition-all duration-200"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Privacy Policy & Back to Top Navigation */}
          <div className="flex items-center gap-6 sm:gap-8 text-xs font-mono uppercase tracking-[0.14em]">
            <a
              href="/privacy-policy"
              className="text-[#8E8E93] hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 text-white hover:text-[#EB0028] transition-colors duration-200 cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;

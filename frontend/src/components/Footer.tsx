'use client';

import React from 'react';
import { ArrowUpRight, MapPin, Mail, ShieldCheck } from 'lucide-react';

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
 * Enhanced Global Footer for TEDx Chennai Institute of Technology.
 * Includes complete legal policy links and contact data required for Razorpay KYC merchant verification.
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

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new Event('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="site-footer"
      className={`w-full bg-[#000000] text-[#F5F5F2] border-t border-[#1C1C1E] pt-12 sm:pt-16 pb-12 px-6 sm:px-10 lg:px-14 xl:px-20 relative select-none ${className}`}
      role="contentinfo"
      aria-label="TEDx Chennai Institute of Technology Footer"
    >
      <div className="max-w-[1700px] mx-auto space-y-10">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-start justify-between">
          
          {/* =========================================================================
              LEFT COLUMN (6 cols): Official TEDx CIT Branding & Location
              ========================================================================= */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {/* TEDx Wordmark / Logo */}
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
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

            {/* License Notice */}
            <div className="text-xs text-[#8E8E93] font-normal leading-relaxed max-w-xl">
              <p className="text-[11px] text-[#6E6E73]">
                This independent TEDx event is operated under official license from TED.
              </p>
              <p className="mt-1">
                Theme: <strong>UNTAPPED</strong> • Hosted by Chennai Institute of Technology, Kundrathur, Chennai.
              </p>
            </div>

            {/* Campus Address & Verified Contact info (Critical for Razorpay KYC) */}
            <div className="pt-2 text-xs text-[#A1A1A6] space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#EB0028] shrink-0" />
                <span>Chennai Institute of Technology, Sarathy Nagar, Kundrathur, Chennai, Tamil Nadu 600069</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#EB0028] shrink-0" />
                <span>Helpdesk: <a href="mailto:tedx@citchennai.net" className="text-white hover:underline">tedx@citchennai.net</a></span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (6 cols): Socials & Back to Top
              ========================================================================= */}
          <div className="md:col-span-6 flex flex-col items-start md:items-end justify-between gap-6 h-full">
            
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

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.14em] text-white hover:text-[#EB0028] transition-colors duration-200 cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>

          </div>

        </div>

        {/* =========================================================================
            BOTTOM COMPLIANCE BAR: Mandatory Razorpay Legal Policies & Copyright
            ========================================================================= */}
        <div className="border-t border-[#1C1C1E] pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-xs text-[#8E8E93]">
          
          {/* Copyright notice */}
          <div>
            <p>© {new Date().getFullYear()} TEDx Chennai Institute of Technology. All rights reserved.</p>
          </div>

          {/* Mandatory Razorpay KYC Compliance Navigation Links */}
          <nav aria-label="Legal and Compliance" className="flex flex-wrap items-center gap-y-2 gap-x-5 sm:gap-x-7 font-mono uppercase tracking-wider text-[11px]">
            <a
              href="/terms-and-conditions"
              onClick={(e) => handleNav(e, '/terms-and-conditions')}
              className="text-[#8E8E93] hover:text-white transition-colors"
            >
              Terms & Conditions
            </a>

            <span className="text-[#333333] hidden sm:inline" aria-hidden="true">•</span>

            <a
              href="/privacy-policy"
              onClick={(e) => handleNav(e, '/privacy-policy')}
              className="text-[#8E8E93] hover:text-white transition-colors"
            >
              Privacy Policy
            </a>

            <span className="text-[#333333] hidden sm:inline" aria-hidden="true">•</span>

            <a
              href="/cancellation-and-refund"
              onClick={(e) => handleNav(e, '/cancellation-and-refund')}
              className="text-[#8E8E93] hover:text-white transition-colors"
            >
              Cancellation & Refund
            </a>

            <span className="text-[#333333] hidden sm:inline" aria-hidden="true">•</span>

            <a
              href="/shipping-and-delivery"
              onClick={(e) => handleNav(e, '/shipping-and-delivery')}
              className="text-[#8E8E93] hover:text-white transition-colors"
            >
              Ticket Delivery
            </a>

            <span className="text-[#333333] hidden sm:inline" aria-hidden="true">•</span>

            <a
              href="/contact-us"
              onClick={(e) => handleNav(e, '/contact-us')}
              className="text-[#EB0028] hover:text-white font-semibold transition-colors"
            >
              Contact Us
            </a>
          </nav>

        </div>

      </div>
    </footer>
  );
};

export default Footer;

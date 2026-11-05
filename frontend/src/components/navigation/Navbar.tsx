'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { NAV_ITEMS, type NavItem } from './navConfig';

export type { NavItem };
export { NAV_ITEMS };

export interface NavbarProps {
  /** Optional custom CSS classes for the header container */
  className?: string;
  /** Optional override for the official logo source */
  logoSrc?: string;
  /** Optional override for current path (useful in testing or router contexts) */
  currentPath?: string;
}

/**
 * Universal safe hook to extract the current pathname.
 * Resilient across Next.js, React Router, Vite, SSR, and client environments.
 */
function useCurrentPath(pathOverride?: string): string {
  const [clientPath, setClientPath] = useState<string>(() => {
    if (typeof window !== 'undefined') return window.location.pathname || '/';
    return '/';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updatePath = () => setClientPath(window.location.pathname || '/');
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  return pathOverride !== undefined ? pathOverride : clientPath;
}

/**
 * Framer Motion animation variants for the mobile overlay
 */
const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const linkListVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
};

const linkItemVariants: Variants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

/**
 * Premium Cinematic Grid Navigation Bar for TEDx Chennai Institute of Technology.
 * - Left End: Official TEDx branding logo
 * - Right End: All navigation links and enlarged CTA buttons
 * - Subtle cinematic entrance animation and interactive hover effects
 */
export const Navbar: React.FC<NavbarProps> = ({
  className = '',
  logoSrc = '/tedx-logo.svg',
  currentPath,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = useCurrentPath(currentPath);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);

  // Separate standard text links from the two boxed CTA buttons
  const mainLinks = NAV_ITEMS.filter((item) => !item.isButton);
  const ctaButtons = NAV_ITEMS.filter((item) => item.isButton);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile navigation overlay is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        firstNavLinkRef.current?.focus();
      }, 150);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // Accessible keyboard handler: Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Close mobile menu callback
  const handleCloseMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className={`relative top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ease-in-out font-sans bg-[#000000] border-b ${
        isScrolled ? 'border-[#333333]' : 'border-[#292929]'
      } ${className}`}
      role="banner"
    >
      {/* 
        Substantial navbar height (80px sm / 86px md / 92px lg).
        Left End: Branding logo
        Right End: All links & enlarged CTAs, matching reference layout
      */}
      <div className="flex h-[80px] sm:h-[86px] lg:h-[92px] w-full items-stretch justify-between">
        {/* ========================================================
            LEFT END: Official TEDx Logo
            ======================================================== */}
        <div className="flex items-center pl-6 sm:pl-10 lg:pl-14 xl:pl-16 pr-6 shrink-0">
          <a
            href="/"
            aria-label="TEDx Chennai Institute of Technology Home"
            className="group inline-flex items-center transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25]"
          >
            <img
              src={logoSrc}
              alt="TEDx Chennai Institute of Technology"
              width={320}
              height={42}
              className="h-9 sm:h-10 lg:h-[38px] w-auto object-contain select-none"
            />
          </a>
        </div>

        {/* ========================================================
            RIGHT END: Navigation Links + Enlarged Outlined CTAs
            ======================================================== */}
        <div className="hidden md:flex items-stretch shrink-0 pr-6 sm:pr-8 lg:pr-10 xl:pr-14">
          {/* Navigation Links with vertical dividing borders */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-stretch"
          >
            {mainLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex items-center justify-center px-4 lg:px-6 xl:px-8 border-l border-[#292929] text-[13px] lg:text-[14px] font-semibold tracking-[0.06em] uppercase transition-colors duration-250 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25] ${
                    isActive ? 'text-[#FF2B25]' : 'text-[#F5F5F2] hover:text-[#FF2B25]'
                  }`}
                >
                  <span className="relative py-1.5">
                    {item.label}
                    {/* Animated thin red underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#FF2B25] transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Enlarged Outlined Action Buttons on the far right */}
          <div className="flex items-center border-l border-[#292929] pl-5 lg:pl-6 xl:pl-8 space-x-3 xl:space-x-4 shrink-0">
            {ctaButtons.map((btn) => {
              const isActive = pathname === btn.href || pathname.startsWith(`${btn.href}/`);
              return (
                <motion.a
                  key={btn.href}
                  href={btn.href}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  transition={{ duration: 0.2 }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative overflow-hidden border bg-transparent px-5 sm:px-6 lg:px-6 xl:px-7 py-3 lg:py-3.5 text-xs sm:text-[13px] lg:text-[14px] font-bold tracking-[0.08em] uppercase transition-all duration-300 rounded-none whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25] ${
                    isActive
                      ? 'border-[#FF2B25] text-[#FF2B25]'
                      : 'border-[#292929] text-[#F5F5F2] hover:border-[#FF2B25] hover:text-white'
                  }`}
                >
                  <span
                    className="absolute inset-0 bg-[#FF2B25]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{btn.label}</span>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center px-5">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center space-y-1.5 p-2 text-[#F5F5F2] transition-colors hover:text-[#FF2B25] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25]"
          >
            <motion.span
              animate={
                isMobileMenuOpen
                  ? { rotate: 45, y: 7.5, backgroundColor: '#FF2B25' }
                  : { rotate: 0, y: 0, backgroundColor: '#F5F5F2' }
              }
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="block h-[1.5px] w-6 rounded-full"
            />
            <motion.span
              animate={
                isMobileMenuOpen
                  ? { opacity: 0, scaleX: 0 }
                  : { opacity: 1, scaleX: 1, backgroundColor: '#F5F5F2' }
              }
              transition={{ duration: 0.2 }}
              className="block h-[1.5px] w-6 rounded-full"
            />
            <motion.span
              animate={
                isMobileMenuOpen
                  ? { rotate: -45, y: -7.5, backgroundColor: '#FF2B25' }
                  : { rotate: 0, y: 0, backgroundColor: '#F5F5F2' }
              }
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="block h-[1.5px] w-6 rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#000000] px-6 py-8 sm:px-10 font-sans"
          >
            {/* Mobile Header Row */}
            <div className="flex items-center justify-between border-b border-[#292929] pb-6">
              <a
                href="/"
                onClick={handleCloseMenu}
                aria-label="TEDx Chennai Institute of Technology Home"
                className="inline-flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25]"
              >
                <img
                  src={logoSrc}
                  alt="TEDx Chennai Institute of Technology"
                  width={240}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              </a>
              <button
                type="button"
                onClick={handleCloseMenu}
                aria-label="Close navigation overlay"
                className="flex h-10 w-10 items-center justify-center rounded-none border border-[#292929] text-[#F5F5F2] transition-colors hover:border-[#FF2B25] hover:text-[#FF2B25] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25]"
              >
                <span className="text-xl leading-none">✕</span>
              </button>
            </div>

            {/* Staggered Navigation Links */}
            <motion.nav
              aria-label="Mobile Navigation"
              variants={linkListVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col space-y-6 py-8"
            >
              {NAV_ITEMS.map((item, index) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <motion.div key={item.href} variants={linkItemVariants}>
                    <a
                      ref={index === 0 ? firstNavLinkRef : undefined}
                      href={item.href}
                      onClick={handleCloseMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block font-sans text-2xl sm:text-3xl font-bold uppercase tracking-tight transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2B25] ${
                        isActive
                          ? 'text-[#FF2B25]'
                          : 'text-[#F5F5F2] hover:text-[#FF2B25]'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {isActive && (
                          <span
                            className="h-2 w-2 rounded-full bg-[#FF2B25]"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </a>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Mobile Footer Meta */}
            <div className="border-t border-[#292929] pt-6 flex flex-col sm:flex-row justify-between text-xs text-[#8E8E93]">
              <span className="font-mono tracking-widest uppercase">
                CHENNAI / IDEAS WORTH SPREADING
              </span>
              <span className="mt-2 sm:mt-0 font-normal">
                TEDx Chennai Institute of Technology
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

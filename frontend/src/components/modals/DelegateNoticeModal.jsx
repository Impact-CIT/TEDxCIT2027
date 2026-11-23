import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, ArrowRight } from 'lucide-react';

/**
 * DelegateNoticeModal
 * Displayed when visitors click "Register Now" or "Book Delegate Pass"
 * while delegate pass registrations are not yet open.
 * Directs them to apply as an anonymous student speaker.
 */
/**
 * Helper to open the delegate notice modal from any component or button
 */
export const openDelegateModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-delegate-modal'));
  }
};

export default function DelegateNoticeModal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.stop();
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        if (typeof window !== 'undefined' && window.__lenis) {
          window.__lenis.start();
        }
      };
    }
  }, [isOpen]);

  const handleGoToAnonymousVoices = (e) => {
    e.preventDefault();
    onClose();
    window.history.pushState({}, '', '/apply/anonymous-voices');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Dialog Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delegate-notice-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg bg-[#0C0C0E] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/90 overflow-hidden"
          >
            {/* Background Red Ambient Accent */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 bg-[#EB0028]/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Eyebrow Status Pill */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EB0028]/15 border border-[#EB0028]/30 text-[10px] font-mono text-[#EB0028] uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] animate-pulse" />
                <span>REGISTRATIONS NOT YET OPEN</span>
              </span>
            </div>

            {/* Modal Heading */}
            <h2
              id="delegate-notice-title"
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3"
            >
              Delegate Passes <span className="text-[#EB0028]">Coming Soon</span>
            </h2>

            {/* Notice Description */}
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
              Registrations for delegate passes are not yet opened. Applications and booking details will be released soon.
            </p>

            {/* Callout Card: Student Speaker Application (Anonymous Voices) */}
            <div className="bg-[#141418] border border-white/10 rounded-xl p-5 mb-6 relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#EB0028]/15 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028] shrink-0 mt-0.5">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base leading-snug">
                    Participate as a Student Speaker
                  </h3>
                  <p className="text-[#8E8E93] text-xs sm:text-sm mt-1 leading-relaxed">
                    Student speaker applications are currently active! If you have an idea worth spreading, apply through <strong className="text-white">Anonymous Voices</strong> to take the stage.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleGoToAnonymousVoices}
                className="flex-1 py-3 px-5 bg-[#EB0028] hover:bg-[#C80022] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(235,0,40,0.35)] hover:shadow-[0_6px_28px_rgba(235,0,40,0.5)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Apply for Anonymous Voices</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onClose}
                className="py-3 px-5 border border-white/15 hover:border-white/30 text-[#A1A1AA] hover:text-white text-xs font-mono uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

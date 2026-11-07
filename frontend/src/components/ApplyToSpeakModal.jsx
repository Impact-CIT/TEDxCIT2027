import React, { useEffect, useRef, useCallback } from 'react';

const CARDS = [
  {
    id: 'anonymous-voices',
    title: 'Anonymous Voices',
    tagline: 'Exclusive to Students of CIT Group of Institutions',
    btnLabel: 'Apply Now (CIT Students)',
    route: '/apply/anonymous-voices',
  },
  {
    id: 'speaker-nomination',
    title: 'Speaker Nomination',
    tagline: 'Open to All Innovators, Leaders & Thinkers',
    btnLabel: 'Nominate a Speaker',
    route: '/apply/speaker-nomination',
  },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ApplyToSpeakModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const el = dialogRef.current;
    const focusable = Array.from(el.querySelectorAll(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const timer = setTimeout(() => first?.focus(), 60);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    el.addEventListener('keydown', handleTab);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = original;
    };
  }, [isOpen, handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSelectOption = (route) => {
    onClose();
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      window.dispatchEvent(new Event('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md transition-all duration-300"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-heading"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0A0A0A] border border-[#2A2A2A] shadow-2xl shadow-black/95 text-[#F5F5F2]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#E62B1E #111',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF554F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E62B1E]" />
              <span>TEDxChennai Institute of Technology &bull; 2027</span>
            </div>
            <h2
              id="apply-modal-heading"
              className="text-white font-bold text-2xl sm:text-3xl tracking-tight leading-none"
            >
              Apply to Speak
            </h2>
            <p className="text-xs sm:text-sm text-[#85858D] mt-2">Share an idea worth spreading on the TEDxCIT stage.</p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="mt-0.5 shrink-0 w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-[#A0A0A5] hover:border-[#E62B1E] hover:text-white active:bg-[#E62B1E]/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62B1E] cursor-pointer"
          >
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        {/* Modal Body: Two Option Cards */}
        <div className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5 sm:mb-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#777780] mb-1">Choose your application path</p>
              <p className="text-white text-sm sm:text-base font-medium">Which opportunity is right for you?</p>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777780]">Theme: The Untapped</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CARDS.map((card, index) => (
              <article
                key={card.id}
                className="group relative flex min-h-[218px] flex-col justify-between overflow-hidden bg-[#101010] border border-white/[0.09] p-5 sm:p-6"
                aria-label={card.title}
              >
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-[#E62B1E] via-[#E62B1E]/50 to-transparent" aria-hidden="true" />
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono tracking-[0.16em] text-[#66666F]">0{index + 1} / 02</span>
                    <div className="w-10 h-10 rounded-lg border border-[#E62B1E]/20 bg-[#E62B1E]/[0.07] text-[#FF554F] flex items-center justify-center">
                      {index === 0 ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <circle cx="12" cy="8" r="3.5" />
                          <path d="M5 21a7 7 0 0 1 14 0M19 8v6m-3-3h6" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <path d="M12 3 14.8 9.2 21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-xl sm:text-2xl tracking-tight leading-tight mb-3">
                    {card.title}
                  </h3>
                  <div>
                    <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-[#B5B5BD] bg-white/[0.035] border border-white/[0.08] px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E62B1E]" aria-hidden="true" />
                      {card.tagline}
                    </span>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-7">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(card.route)}
                    className="w-full inline-flex items-center justify-between gap-3 bg-[#E62B1E] hover:bg-[#CF241B] text-white font-semibold text-xs sm:text-sm tracking-wide py-3.5 px-4 sm:px-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62B1E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] cursor-pointer"
                  >
                    <span>{card.btnLabel}</span>
                    <span className="text-base" aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyToSpeakModal;

import React, { useEffect, useRef, useCallback } from 'react';
import SPEAK_CONFIG from '../config/speakConfig';

const CARDS = [
  {
    id: 'anonymous-voices',
    title: 'Anonymous Voices',
    tagline: 'Exclusive to Students of CIT Group of Institutions',
    description:
      'Have an idea waiting to be discovered? Pitch your own talk. Exclusive to students of CIT Group of Institutions.',
    longDescription:
      'Anonymous Voices offers a unique opportunity to bring your ideas, perspectives, and stories to the TEDx stage. This year, TEDxChennai Institute of Technology explores the theme The Untapped, celebrating unexplored possibilities, unheard perspectives, hidden potential, and ideas that challenge the way we see the world. If you have a powerful perspective, an unconventional idea, or a story that aligns with this theme, we want to hear from you! Fill out the form and nominate yourself for an opportunity to become a speaker at TEDxChennai Institute of Technology. Please upload your 3-5 minute video for Round 1. Your submission will be reviewed by our selection panel, and shortlisted candidates will advance to Round 2.',
    deadline: SPEAK_CONFIG.anonymousVoicesDeadlineFormatted,
    btnLabel: 'Apply Now (CIT Students)',
    route: '/apply/anonymous-voices',
  },
  {
    id: 'speaker-nomination',
    title: 'Speaker Nomination',
    tagline: 'Open to All Innovators, Leaders & Thinkers',
    description:
      'Nominate yourself or someone whose voice carries purpose and whose ideas deserve a platform.',
    longDescription:
      'Every individual holds an unexplored idea, an untold story, and a potential waiting to be discovered. We invite you to nominate a speaker whose voice carries purpose, whose journey sparks curiosity, and whose ideas have the potential to challenge perspectives and open doors to new possibilities.',
    contacts: SPEAK_CONFIG.contacts,
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
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-[#1E1E1E]">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#E62B1E]">
              <span className="h-2 w-2 rounded-full bg-[#E62B1E] animate-pulse" />
              <span>TEDxChennai Institute of Technology &rsquo;27 &bull; The Untapped &bull; 11 Feb</span>
            </div>
            <h2
              id="apply-modal-heading"
              className="text-white font-extrabold text-2xl sm:text-3xl uppercase tracking-tight leading-none"
            >
              Apply to Speak
            </h2>
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
        <div className="p-6 sm:p-8">
          <p className="text-[#A0A0A5] text-sm sm:text-base mb-6 leading-relaxed max-w-2xl">
            Choose your participation category for{' '}
            <span className="text-[#E62B1E] font-semibold">TEDxCIT 2027: The Untapped</span>. Each card navigates to its dedicated application portal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CARDS.map((card) => (
              <article
                key={card.id}
                className="flex flex-col justify-between bg-[#111111] border border-[#262626] p-6 sm:p-7 hover:border-[#E62B1E]/70 focus-within:border-[#E62B1E] transition-all duration-300 group shadow-lg shadow-black/50"
                aria-label={card.title}
              >
                <div>
                  {/* Category Accent Line */}
                  <div className="w-10 h-[3px] bg-[#E62B1E] mb-4 group-hover:w-16 transition-all duration-300" aria-hidden="true" />

                  {/* Title */}
                  <h3 className="text-white font-extrabold text-xl sm:text-2xl uppercase tracking-wide leading-tight mb-2">
                    {card.title}
                  </h3>

                  {/* Badge */}
                  <div className="mb-3">
                    <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#E62B1E] bg-[#E62B1E]/10 border border-[#E62B1E]/30 px-2.5 py-1">
                      {card.tagline}
                    </span>
                  </div>

                  {/* One Line Description */}
                  <p className="text-[#F5F5F2] text-sm font-medium leading-relaxed mb-4">
                    {card.description}
                  </p>

                  {/* Detail text */}
                  <p className="text-[#8E8E93] text-xs sm:text-[13px] leading-relaxed border-t border-[#1F1F1F] pt-4 mb-4 line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    {card.longDescription}
                  </p>

                  {/* Specific Meta */}
                  {card.deadline && (
                    <div className="text-xs text-[#A0A0A5] mb-4 bg-black/40 p-2.5 border border-[#222]">
                      <span className="text-[#E62B1E] font-mono font-semibold uppercase tracking-wider block mb-0.5">
                        Registration Deadline
                      </span>
                      <span>{card.deadline}</span>
                    </div>
                  )}

                  {card.contacts && (
                    <div className="text-xs text-[#8E8E93] mb-4 bg-black/40 p-2.5 border border-[#222]">
                      <span className="text-[#F5F5F2] font-mono uppercase tracking-wider block mb-1">
                        Queries & Contact
                      </span>
                      {card.contacts.map((c) => (
                        <div key={c.name} className="flex justify-between py-0.5">
                          <span>{c.name}</span>
                          <span className="text-[#E62B1E] font-mono">{c.phone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(card.route)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#E62B1E] hover:bg-[#c5231a] active:bg-[#a81c14] text-white font-bold text-xs uppercase tracking-[0.14em] py-3.5 px-6 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62B1E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] cursor-pointer shadow-md shadow-[#E62B1E]/20"
                  >
                    <span>{card.btnLabel}</span>
                    <span aria-hidden="true">→</span>
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

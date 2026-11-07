import React, { useEffect, useRef, useCallback } from 'react';

// ─── Form URL config — change these in one place ────────────────────────────
export const SPEAK_FORM_URLS = {
  anonymousVoices:
    'https://docs.google.com/forms/d/e/1FAIpQLSfiLLhK0dkt2d48hKTUCQV2vN3-oTEV9aG26KL8L8FsHnge5A/viewform',
  speakerNomination:
    'https://docs.google.com/forms/d/e/1FAIpQLSfUVLzUsiqlk6-actCmTSPDK4cfMo3AZfvgYiMmZiKoc7PMeQ/viewform',
};

// ─── Card data ───────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'anonymous-voices',
    title: 'Anonymous Voices',
    tagline: 'Exclusive to Students of CIT Group of Institutions.',
    description:
      'Have an idea waiting to be discovered? Pitch your own talk. Exclusive to students of CIT Group of Institutions.',
    longDescription:
      'Anonymous Voices offers a unique opportunity to bring your ideas, perspectives, and stories to the TEDx stage. This year, TEDxChennai Institute of Technology explores the theme \u2018The Untapped\u2019, celebrating unexplored possibilities, unheard perspectives, hidden potential, and ideas that challenge the way we see the world. If you have a powerful perspective, an unconventional idea, or a story that aligns with this theme, we want to hear from you! Fill out the form and nominate yourself for an opportunity to become a speaker at TEDxChennai Institute of Technology. Please upload your 3\u20135 minute video for Round 1. Your submission will be reviewed by our selection panel, and shortlisted candidates will advance to Round 2.',
    deadline: '[INSERT CONFIRMED DEADLINE]',
    btnLabel: 'Apply Now',
    url: SPEAK_FORM_URLS.anonymousVoices,
    accent: '#E62B1E',
  },
  {
    id: 'speaker-nomination',
    title: 'Speaker Nomination',
    tagline: null,
    description:
      'Nominate yourself or someone whose voice carries purpose and whose ideas deserve a platform.',
    longDescription:
      'Every individual holds an unexplored idea, an untold story, and a potential waiting to be discovered. We invite you to nominate a speaker whose voice carries purpose, whose journey sparks curiosity, and whose ideas have the potential to challenge perspectives and open doors to new possibilities.',
    contacts: [
      { name: 'Shubhavi R V', phone: '+91 63840 93306' },
      { name: 'Sachin G', phone: '+91 97910 31117' },
    ],
    btnLabel: 'Nominate Now',
    url: SPEAK_FORM_URLS.speakerNomination,
    accent: '#E62B1E',
  },
];

// ─── Focus-trap helper ───────────────────────────────────────────────────────
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function useFocusTrap(ref, isOpen) {
  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const el = ref.current;
    const focusable = Array.from(el.querySelectorAll(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Auto-focus first element
    setTimeout(() => first?.focus(), 60);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) { e.preventDefault(); return; }
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
    return () => el.removeEventListener('keydown', handleTab);
  }, [isOpen, ref]);
}

// ─── Single card ─────────────────────────────────────────────────────────────
function OptionCard({ card }) {
  return (
    <article
      className="flex flex-col gap-4 bg-[#111111] border border-[#2A2A2A] p-6 sm:p-7
                 hover:border-[#E62B1E]/60 focus-within:border-[#E62B1E]/60
                 transition-colors duration-250 group"
      aria-label={card.title}
    >
      {/* Red accent line */}
      <div className="w-8 h-[2px] bg-[#E62B1E]" aria-hidden="true" />

      {/* Title */}
      <h3 className="text-white font-extrabold text-lg sm:text-xl uppercase tracking-wide leading-tight">
        {card.title}
      </h3>

      {/* One-liner */}
      <p className="text-[#A0A0A5] text-sm leading-relaxed">
        {card.description}
      </p>

      {/* Long description */}
      <p className="text-[#6E6E73] text-[13px] leading-relaxed border-t border-[#222222] pt-4">
        {card.longDescription}
      </p>

      {/* Deadline (Anonymous Voices only) */}
      {card.deadline && (
        <p className="text-[13px] text-[#A0A0A5]">
          <span className="text-white font-semibold">Registration Deadline:</span>{' '}
          <span className="text-[#E62B1E]">{card.deadline}</span>
        </p>
      )}

      {/* Tagline badge (CIT exclusive) */}
      {card.tagline && (
        <p className="text-[12px] font-mono uppercase tracking-widest text-[#E62B1E] border border-[#E62B1E]/30 px-3 py-1.5 self-start">
          {card.tagline}
        </p>
      )}

      {/* Contacts (Speaker Nomination only) */}
      {card.contacts && (
        <div className="text-[13px] text-[#A0A0A5] space-y-1 border-t border-[#222222] pt-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#6E6E73] mb-2">
            Queries
          </p>
          {card.contacts.map((c) => (
            <p key={c.name}>
              <span className="text-white font-medium">{c.name}</span>
              {' — '}
              <a
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                className="text-[#E62B1E] hover:underline focus:outline-none focus-visible:underline"
              >
                {c.phone}
              </a>
            </p>
          ))}
        </div>
      )}

      {/* CTA button */}
      <div className="mt-auto pt-2">
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#E62B1E] hover:bg-[#c5231a] active:bg-[#a81c14]
                     text-white font-bold text-xs uppercase tracking-[0.12em]
                     px-6 py-3 transition-colors duration-200
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E62B1E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
        >
          {card.btnLabel}
          {/* External link arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>
    </article>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
/**
 * ApplyToSpeakModal
 *
 * Props:
 *   isOpen   {boolean}   — controlled open state
 *   onClose  {function}  — called when the modal should close
 */
export function ApplyToSpeakModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useFocusTrap(dialogRef, isOpen);

  // Escape key closes
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = original;
    };
  }, [isOpen, handleKeyDown]);

  // Clicking the dark backdrop closes modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8
                 bg-black/80 backdrop-blur-sm"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-heading"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
                   bg-[#0A0A0A] border border-[#2A2A2A]
                   shadow-2xl shadow-black/90
                   animate-[fadeSlideUp_0.22s_ease-out_both]"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#E62B1E #111',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-[#1E1E1E]">
          <div>
            {/* Eyebrow */}
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#E62B1E] mb-2">
              TEDxChennai Institute of Technology &rsquo;27 &mdash; The Untapped &bull; 11 Feb
            </p>
            <h2
              id="apply-modal-heading"
              className="text-white font-extrabold text-2xl sm:text-3xl uppercase tracking-tight leading-none"
            >
              Apply to Speak
            </h2>
          </div>

          {/* Close button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="mt-0.5 shrink-0 w-9 h-9 flex items-center justify-center
                       border border-[#2A2A2A] text-[#A0A0A5]
                       hover:border-[#E62B1E] hover:text-white
                       active:bg-[#E62B1E]/10
                       transition-colors duration-150
                       focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E62B1E]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body: two cards */}
        <div className="p-6 sm:p-8">
          <p className="text-[#6E6E73] text-sm mb-6">
            Choose how you&apos;d like to participate in{' '}
            <span className="text-[#E62B1E] font-semibold">TEDxCIT 2027: The Untapped</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CARDS.map((card) => (
              <OptionCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animation injected once */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

export default ApplyToSpeakModal;

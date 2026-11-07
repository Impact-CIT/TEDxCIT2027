import React, { useState, useEffect } from 'react';
import SPEAK_CONFIG from '../config/speakConfig';

const DRAFT_STORAGE_KEY = 'tedx_draft_anonymous_voices';

export default function AnonymousVoices() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    contactNumber: '',
    communicationEmail: '',
    socialLinks: '',
    institution: 'Chennai Institute of Technology',
    graduationYear: '2027',
    department: 'AIDS',
    section: '',
    talkTitle: '',
    coreMessage: '',
    uniquePerspective: '',
    visionBridge: '',
    themeRelevance: '',
    criticismResponse: '',
    talkStructure: '',
    recordedSpeechUrl: '',
    website_url_hp: '', // Bot honeypot
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [draftSavedTime, setDraftSavedTime] = useState(null);
  const [registrationDeadline, setRegistrationDeadline] = useState(SPEAK_CONFIG.anonymousVoicesDeadline);
  const [deadlineFormatted, setDeadlineFormatted] = useState(SPEAK_CONFIG.anonymousVoicesDeadlineFormatted);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [deadlineLoaded, setDeadlineLoaded] = useState(false);
  const [deadlineLoadError, setDeadlineLoadError] = useState(null);

  const isPastDeadline = deadlineLoaded && new Date() > new Date(registrationDeadline);

  useEffect(() => {
    let active = true;
    fetch('/api/speak/config')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Could not load registration deadline.');
        }
        if (active) {
          setRegistrationDeadline(result.data.anonymousVoicesDeadline);
          setDeadlineFormatted(result.data.anonymousVoicesDeadlineFormatted);
          setRegistrationEnabled(result.data.anonymousVoicesEnabled === true);
        }
      })
      .catch((err) => {
        if (active) setDeadlineLoadError(err.message || 'Could not load registration deadline.');
      })
      .finally(() => {
        if (active) setDeadlineLoaded(true);
      });
    return () => { active = false; };
  }, []);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed.submissionMode;
        setFormData((prev) => ({ ...prev, ...parsed, website_url_hp: '' }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Autosave draft to localStorage
  useEffect(() => {
    if (submitSuccess) return;
    const handler = setTimeout(() => {
      try {
        const toSave = { ...formData };
        delete toSave.website_url_hp;
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toSave));
        setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {
        // Storage full or unavailable
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [formData, submitSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = formData.contactNumber.replace(/[\s-]/g, '');

    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Valid student email is required (preferably @citchennai.net).';
    }
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!formData.contactNumber.trim() || !/^[6789]\d{9}$/.test(phoneDigits.slice(-10))) {
      errs.contactNumber = 'Enter a valid 10-digit Indian phone number.';
    }
    if (!formData.communicationEmail || !emailRegex.test(formData.communicationEmail.trim())) {
      errs.communicationEmail = 'Valid communication email is required.';
    }
    if (!formData.socialLinks.trim()) {
      errs.socialLinks = 'Links to LinkedIn and social media profiles are required.';
    }
    if (!formData.section.trim()) {
      errs.section = 'Section is required (e.g. A, B, C).';
    }
    if (!formData.talkTitle.trim()) {
      errs.talkTitle = 'Title of your talk is required.';
    }
    if (!formData.coreMessage.trim()) {
      errs.coreMessage = 'Core message description is required.';
    }
    if (!formData.uniquePerspective.trim()) {
      errs.uniquePerspective = 'Unique personal perspective description is required.';
    }
    if (!formData.visionBridge.trim()) {
      errs.visionBridge = 'Vision description is required.';
    }
    if (!formData.themeRelevance.trim()) {
      errs.themeRelevance = 'Relevance to "The Untapped" is required.';
    }
    if (!formData.criticismResponse.trim()) {
      errs.criticismResponse = 'Response to potential criticism is required.';
    }
    if (!formData.talkStructure.trim()) {
      errs.talkStructure = 'Talk structure description is required.';
    }

    if (!formData.recordedSpeechUrl.trim() || !/^https?:\/\/.+/i.test(formData.recordedSpeechUrl.trim())) {
      errs.recordedSpeechUrl = 'A valid shareable link (Drive/YouTube/Vimeo) is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!deadlineLoaded || deadlineLoadError) {
      setServerError(deadlineLoadError || 'Registration settings are still loading. Please try again.');
      return;
    }

    if (isPastDeadline) {
      setServerError(`Registrations closed on ${deadlineFormatted} IST.`);
      return;
    }

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/anonymous-voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Submission failed. Please check your details.');
      }

      // Success
      setSubmitSuccess(true);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError(err.message || 'Network error occurred while submitting. Your form details are preserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!deadlineLoaded || deadlineLoadError || !registrationEnabled) {
    return (
      <div className="w-full min-h-[70vh] bg-[#000000] text-[#F5F5F2] flex items-center justify-center px-4 py-16 font-sans">
        <div className="max-w-xl w-full border border-[#262626] bg-[#0A0A0A] p-8 sm:p-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF554F] mb-3">TEDxCIT 2027 · Anonymous Voices</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {!deadlineLoaded ? 'Checking application availability' : registrationEnabled ? 'Applications unavailable' : 'Applications are closed'}
          </h1>
          <p className="text-sm leading-relaxed text-[#A0A0A8] mb-7">
            {deadlineLoadError || (!deadlineLoaded
              ? 'Please wait while we check the current registration status.'
              : 'Anonymous Voices applications are not currently accepting submissions.')}
          </p>
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 bg-[#E62B1E] hover:bg-[#c5231a] text-white font-semibold text-xs uppercase tracking-wide px-6 py-3 transition-colors cursor-pointer"
          >
            Return to Home <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="w-full min-h-[80vh] bg-[#000000] text-[#F5F5F2] flex items-center justify-center px-4 py-20 font-sans">
        <div className="max-w-2xl w-full bg-[#0E0E0E] border border-[#262626] p-8 sm:p-12 text-center shadow-2xl relative">
          <div className="w-16 h-16 bg-[#E62B1E]/15 border border-[#E62B1E] text-[#E62B1E] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#E62B1E] block mb-2">
            SUBMISSION RECEIVED &bull; ANONYMOUS VOICES
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
            Thank you! Your submission has been received.
          </h1>
          <p className="text-[#A0A0A5] text-base sm:text-lg leading-relaxed mb-8">
            Your submission for <span className="text-white font-semibold">TEDxCIT 2027: The Untapped</span> will be carefully evaluated by our selection panel. Shortlisted student candidates will advance to Round 2.
          </p>
          <div className="bg-black/60 p-4 border border-[#222] text-xs text-[#8E8E93] font-mono mb-8">
            Please monitor <span className="text-white">{formData.email}</span> and your communication email for further announcements and scheduling updates.
          </div>
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 bg-[#E62B1E] hover:bg-[#c5231a] text-white font-bold text-xs uppercase tracking-[0.16em] px-8 py-4 transition-colors cursor-pointer"
          >
            <span>Return to Home</span>
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#000000] text-[#F5F5F2] font-sans py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-[#8E8E93]">
          <button
            onClick={handleBackToHome}
            className="hover:text-[#E62B1E] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>←</span>
            <span>Home</span>
          </button>
          {draftSavedTime && (
            <span className="text-[#6E6E73]">
              Draft saved locally ({draftSavedTime})
            </span>
          )}
        </div>

        {/* Header Hero Section */}
        <div className="border border-[#262626] bg-[#0A0A0A] p-6 sm:p-10 mb-8 relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#E62B1E] bg-[#E62B1E]/10 border border-[#E62B1E]/30 px-3 py-1">
              EXCLUSIVE TO STUDENTS OF CIT GROUP OF INSTITUTIONS
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#A0A0A5] bg-black/60 px-3 py-1 border border-[#222]">
              THEME: THE UNTAPPED &bull; 11 FEB
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            Anonymous Voices
          </h1>

          <p className="text-[#A0A0A5] text-sm sm:text-base leading-relaxed mb-6">
            Do you have an idea waiting to be discovered? Anonymous Voices offers a unique opportunity to bring your ideas, perspectives, and stories to the TEDx stage. This year, TEDxChennai Institute of Technology explores the theme <span className="text-white font-medium">The Untapped</span>, celebrating unexplored possibilities, unheard perspectives, hidden potential, and ideas that challenge the way we see the world. If you have a powerful perspective, an unconventional idea, or a story that aligns with this theme, we want to hear from you! Please share a link to your 3-5 minute video for Round 1. Your submission will be reviewed by our selection panel, and shortlisted candidates will advance to Round 2.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1F1F1F] text-xs font-mono">
            <div>
              <span className="text-[#8E8E93]">Registration Deadline: </span>
              <span className="text-[#E62B1E] font-bold">{deadlineFormatted} IST</span>
            </div>
            {!deadlineLoaded ? (
              <span className="text-[#A0A0A5]">CHECKING DEADLINE</span>
            ) : isPastDeadline ? (
              <span className="text-[#E62B1E] bg-[#E62B1E]/15 px-3 py-1 font-bold">REGISTRATIONS CLOSED</span>
            ) : (
              <span className="text-emerald-400 bg-emerald-950/50 px-3 py-1 border border-emerald-800">APPLICATIONS ACTIVE</span>
            )}
          </div>
        </div>

        {deadlineLoadError && (
          <div className="bg-[#E62B1E]/15 border border-[#E62B1E] p-5 mb-8 text-white">
            <p className="text-sm">{deadlineLoadError} Refresh the page before submitting.</p>
          </div>
        )}

        {/* Deadline Notice */}
        {isPastDeadline && (
          <div className="bg-[#E62B1E]/10 border border-[#E62B1E] p-6 mb-8 text-center">
            <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">Registrations Closed</h3>
            <p className="text-[#A0A0A5] text-sm">
              The submission deadline for Anonymous Voices was {deadlineFormatted} IST. New applications are currently closed.
            </p>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="bg-[#E62B1E]/15 border border-[#E62B1E] p-5 mb-8 text-white flex items-start gap-3">
            <span className="text-[#E62B1E] text-xl font-bold">⚠</span>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Submission Error</h4>
              <p className="text-sm text-[#F5F5F2]">{serverError}</p>
            </div>
          </div>
        )}

        {/* Main Application Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Honeypot anti-bot input */}
          <input
            type="text"
            name="website_url_hp"
            value={formData.website_url_hp}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          {/* Section 1: Submitter Details */}
          <div className="bg-[#0C0C0C] border border-[#242424] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1F1F1F]">
              <span className="w-2.5 h-2.5 bg-[#E62B1E]" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                1. Student Profile & Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Full Name <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Kumar"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.fullName && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Email ID <span className="text-[#E62B1E]">*</span>{' '}
                  <span className="text-[#6E6E73] normal-case">(@citchennai.net encouraged)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@citchennai.net"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.email && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.email}</p>}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Contact Number <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.contactNumber && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.contactNumber}</p>}
              </div>

              {/* Communication Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Email ID (For Further Communication) <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="email"
                  name="communicationEmail"
                  value={formData.communicationEmail}
                  onChange={handleChange}
                  placeholder="secondary/active email"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.communicationEmail && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.communicationEmail}</p>}
              </div>

              {/* Social Links */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Links to your LinkedIn and other social media profiles <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="text"
                  name="socialLinks"
                  value={formData.socialLinks}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile, https://github.com/..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.socialLinks && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.socialLinks}</p>}
              </div>

              {/* Institution Radio */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-3">
                  Name of Institution <span className="text-[#E62B1E]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SPEAK_CONFIG.institutions.map((inst) => (
                    <label
                      key={inst}
                      className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-colors ${
                        formData.institution === inst
                          ? 'border-[#E62B1E] bg-[#E62B1E]/10 text-white'
                          : 'border-[#262626] bg-[#141414] text-[#A0A0A5] hover:border-[#383838]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="institution"
                        value={inst}
                        checked={formData.institution === inst}
                        onChange={handleChange}
                        className="accent-[#E62B1E]"
                      />
                      <span className="text-sm font-medium">{inst}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Year of Graduation <span className="text-[#E62B1E]">*</span>
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors cursor-pointer"
                >
                  {SPEAK_CONFIG.graduationYears.map((yr) => (
                    <option key={yr} value={yr}>
                      Class of {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Department <span className="text-[#E62B1E]">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors cursor-pointer"
                >
                  {SPEAK_CONFIG.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Section <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.section && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.section}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Your Talk for the TEDx Stage */}
          <div className="bg-[#0C0C0C] border border-[#242424] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1F1F1F]">
              <span className="w-2.5 h-2.5 bg-[#E62B1E]" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                Your Talk for the TEDx Stage - Anonymous Voices
              </h2>
            </div>

            <div className="space-y-6">
              {/* Talk Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Title of your talk for the TEDx stage <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="text"
                  name="talkTitle"
                  value={formData.talkTitle}
                  onChange={handleChange}
                  placeholder="Working title for your TEDx talk"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.talkTitle && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.talkTitle}</p>}
              </div>

              {/* Core Message */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  How would you describe the core message of your talk in a way that sparks curiosity and leaves the audience eager to learn more? <span className="text-[#E62B1E]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="coreMessage"
                  value={formData.coreMessage}
                  onChange={handleChange}
                  placeholder="Articulate the central idea worth spreading..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                />
                {errors.coreMessage && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.coreMessage}</p>}
              </div>

              {/* Unique Perspective */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  What unique personal perspective or voice do you bring to this topic that no one else can? <span className="text-[#E62B1E]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="uniquePerspective"
                  value={formData.uniquePerspective}
                  onChange={handleChange}
                  placeholder="Your personal experiences, research, or observations..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                />
                {errors.uniquePerspective && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.uniquePerspective}</p>}
              </div>

              {/* Vision Bridge */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  How does your vision bridge the gap between present realities and future possibilities? <span className="text-[#E62B1E]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="visionBridge"
                  value={formData.visionBridge}
                  onChange={handleChange}
                  placeholder="Explain the transformative arc of your thought..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                />
                {errors.visionBridge && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.visionBridge}</p>}
              </div>

              {/* Theme Relevance */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  What makes it timely or relevant to the theme "The Untapped"? <span className="text-[#E62B1E]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="themeRelevance"
                  value={formData.themeRelevance}
                  onChange={handleChange}
                  placeholder="How does it explore unexplored possibilities, hidden potential, or unheard perspectives?"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                />
                {errors.themeRelevance && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.themeRelevance}</p>}
              </div>

              {/* Criticism Response */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  What is one criticism your talk might receive, and how would you respond to it? <span className="text-[#E62B1E]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="criticismResponse"
                  value={formData.criticismResponse}
                  onChange={handleChange}
                  placeholder="Anticipate counter-arguments and share your thoughtful rebuttal..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                />
                {errors.criticismResponse && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.criticismResponse}</p>}
              </div>

              {/* Talk Structure */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  How will you structure your talk to effectively engage the audience in the allocated time? <span className="text-[#E62B1E]">*</span>
                </label>
                <textarea
                  rows={4}
                  name="talkStructure"
                  value={formData.talkStructure}
                  onChange={handleChange}
                  placeholder="Outline key milestones: Hook / Problem / Evidence / Climax / Call to Action..."
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                />
                {errors.talkStructure && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.talkStructure}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Recorded Speech (3-5 minutes) */}
          <div className="bg-[#0C0C0C] border border-[#242424] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#1F1F1F]">
              <span className="w-2.5 h-2.5 bg-[#E62B1E]" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                Recorded Speech (3-5 minutes) <span className="text-[#E62B1E]">*</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#A0A0A5] mb-6 leading-relaxed">
              Provide a publicly accessible link to your 3-5 minute recorded video (Google Drive, YouTube unlisted, or Vimeo). Make sure link permissions are set to &ldquo;Anyone with link can view&rdquo;.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                Shareable Video Link <span className="text-[#E62B1E]">*</span>
              </label>
              <input
                type="url"
                name="recordedSpeechUrl"
                value={formData.recordedSpeechUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/... or https://youtu.be/..."
                className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
              />
              {errors.recordedSpeechUrl && (
                <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.recordedSpeechUrl}</p>
              )}
              <p className="text-[11px] text-[#6E6E73] mt-2 font-mono">
                Tip: Ensure sharing permission is set to "Anyone on the internet with the link can view".
              </p>
            </div>
          </div>

          {/* Submit Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1F1F1F]">
            <p className="text-xs text-[#8E8E93]">
              By submitting, you certify that this idea and recording are your own authentic work.
            </p>

            <button
              type="submit"
              disabled={isSubmitting || !deadlineLoaded || deadlineLoadError || isPastDeadline}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#E62B1E] hover:bg-[#c5231a] active:bg-[#a81c14] text-white font-bold text-xs uppercase tracking-[0.16em] px-10 py-4.5 transition-all shadow-lg shadow-[#E62B1E]/20 cursor-pointer ${
                isSubmitting || !deadlineLoaded || deadlineLoadError || isPastDeadline ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Anonymous Voices Talk</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

const DRAFT_STORAGE_KEY = 'tedx_draft_speaker_nomination';

export default function SpeakerNomination() {
  const [formData, setFormData] = useState({
    // Nominator Details
    email: '',
    fullName: '',
    contactNumber: '',
    communicationEmail: '',
    workStatus: 'Student', // 'Student' | 'Working Professional'
    currentProfession: '',
    organization: '',
    areYouNominatingYourself: 'No', // 'Yes' | 'No'

    // Self Nomination Section (if Yes)
    selfBio: '',
    selfSocialLinks: '',
    selfMediaLinks: '',
    selfUniqueIdea: '',
    selfKeyTakeaways: '',

    // Nominee Section (if No)
    nomineeName: '',
    nomineeQualification: '',
    nomineeOrganization: '',
    nomineeBio: '',
    nomineeSocialLinks: '',
    nomineeMediaLinks: '',
    nomineeUniquePerspective: '',

    // Bot honeypot
    website_url_hp: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [draftSavedTime, setDraftSavedTime] = useState(null);
  const [registrationDeadline, setRegistrationDeadline] = useState(null);
  const [deadlineFormatted, setDeadlineFormatted] = useState(null);
  const [deadlineLoaded, setDeadlineLoaded] = useState(false);
  const [deadlineLoadError, setDeadlineLoadError] = useState(null);

  const isSelf = formData.areYouNominatingYourself === 'Yes';
  const isPastDeadline = deadlineLoaded && registrationDeadline && new Date() > new Date(registrationDeadline);

  useEffect(() => {
    let active = true;
    fetch('/api/speak/config')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Could not load registration deadline.');
        }
        if (active) {
          setRegistrationDeadline(result.data.speakerNominationDeadline);
          setDeadlineFormatted(result.data.speakerNominationDeadlineFormatted);
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

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed, website_url_hp: '' }));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Autosave draft
  useEffect(() => {
    if (submitSuccess) return;
    const timer = setTimeout(() => {
      try {
        const toSave = { ...formData };
        delete toSave.website_url_hp;
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toSave));
        setDraftSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {
        // Storage full or unavailable
      }
    }, 600);
    return () => clearTimeout(timer);
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

    // Nominator Details Validation
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Valid nominator email address is required.';
    }
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }
    if (!formData.contactNumber.trim() || !/^[6789]\d{9}$/.test(phoneDigits.slice(-10))) {
      errs.contactNumber = 'Enter a valid 10-digit Indian phone number.';
    }
    if (!formData.communicationEmail || !emailRegex.test(formData.communicationEmail.trim())) {
      errs.communicationEmail = 'Valid communication email address is required.';
    }
    if (!formData.currentProfession.trim()) {
      errs.currentProfession = 'Current profession is required.';
    }
    if (!formData.organization.trim()) {
      errs.organization = 'Organization you currently work or study at is required.';
    }

    // Conditional Validation based on areYouNominatingYourself
    if (isSelf) {
      if (!formData.selfBio.trim()) {
        errs.selfBio = 'Brief biography about yourself is required.';
      }
      if (!formData.selfSocialLinks.trim()) {
        errs.selfSocialLinks = 'Links to your LinkedIn and other social profiles are required.';
      }
      if (!formData.selfUniqueIdea.trim()) {
        errs.selfUniqueIdea = 'The unique idea you want to share in the talk is required.';
      }
      if (!formData.selfKeyTakeaways.trim()) {
        errs.selfKeyTakeaways = 'Key takeaways you want the audience to know or feel are required.';
      }
    } else {
      if (!formData.nomineeName.trim()) {
        errs.nomineeName = "Nominee's name is required.";
      }
      if (!formData.nomineeQualification.trim()) {
        errs.nomineeQualification = 'Qualification / professional description of the nominee is required.';
      }
      if (!formData.nomineeOrganization.trim()) {
        errs.nomineeOrganization = 'Current organization of the nominee is required.';
      }
      if (!formData.nomineeBio.trim()) {
        errs.nomineeBio = 'Brief biography about the nominee is required.';
      }
      if (!formData.nomineeSocialLinks.trim()) {
        errs.nomineeSocialLinks = 'Links to LinkedIn and social profiles of the nominee are required.';
      }
      if (!formData.nomineeMediaLinks.trim()) {
        errs.nomineeMediaLinks = 'Links to online videos or articles of the proposed nominee are required.';
      }
      if (!formData.nomineeUniquePerspective.trim()) {
        errs.nomineeUniquePerspective = 'Unique perspective the nominee brings to the stage is required.';
      }
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
      setServerError(`Speaker nominations closed on ${deadlineFormatted} IST.`);
      return;
    }

    if (!validate()) {
      const firstError = document.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        website_url_hp: formData.website_url_hp,
        nominatorDetails: {
          email: formData.email,
          fullName: formData.fullName,
          contactNumber: formData.contactNumber,
          communicationEmail: formData.communicationEmail,
          workStatus: formData.workStatus,
          currentProfession: formData.currentProfession,
          organization: formData.organization,
        },
        isSelfNomination: isSelf,
        // Only include the active conditional branch!
        ...(isSelf
          ? {
              selfNomination: {
                bio: formData.selfBio,
                socialLinks: formData.selfSocialLinks,
                mediaLinks: formData.selfMediaLinks,
                uniqueIdea: formData.selfUniqueIdea,
                keyTakeaways: formData.selfKeyTakeaways,
              },
            }
          : {
              nominee: {
                nomineeName: formData.nomineeName,
                qualification: formData.nomineeQualification,
                organization: formData.nomineeOrganization,
                bio: formData.nomineeBio,
                socialLinks: formData.nomineeSocialLinks,
                mediaLinks: formData.nomineeMediaLinks,
                uniquePerspective: formData.nomineeUniquePerspective,
              },
            }),
      };

      const res = await fetch('/api/speaker-nominations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit nomination. Please review your entries.');
      }

      setSubmitSuccess(true);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError(err.message || 'An error occurred while submitting. Your entered data has been preserved.');
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
            NOMINATION RECORDED &bull; TEDxCIT 2027
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
            Thank you! Your nomination has been received.
          </h1>
          <p className="text-[#A0A0A5] text-base sm:text-lg leading-relaxed mb-8">
            Our curation committee reviews all nominations in accordance with TEDx guidelines and the theme <span className="text-white font-semibold">The Untapped</span>. We will get in touch with you if the profile is shortlisted.
          </p>
          <div className="bg-black/60 p-4 border border-[#222] text-xs text-[#8E8E93] font-mono mb-8">
            Questions? Contact: Shubhavi R V (+91 63840 93306) &bull; Sachin G (+91 97910 31117)
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

        {/* Hero Section */}
        <div className="border border-[#262626] bg-[#0A0A0A] p-6 sm:p-10 mb-8 relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#E62B1E] bg-[#E62B1E]/10 border border-[#E62B1E]/30 px-3 py-1">
              SPEAKER CURATION &bull; THE UNTAPPED
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#A0A0A5] bg-black/60 px-3 py-1 border border-[#222]">
              DATE: 11TH FEBRUARY 2027
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            Speaker Nomination
          </h1>

          <p className="text-[#A0A0A5] text-sm sm:text-base leading-relaxed">
            TEDxChennai Institute of Technology is back! Every individual holds an unexplored idea, an untold story, and a potential waiting to be discovered. TEDxChennai Institute of Technology returns on 11th February with the theme <span className="text-white font-medium">The Untapped</span>. We invite you to nominate a speaker whose voice carries purpose, whose journey sparks curiosity, and whose ideas have the potential to challenge perspectives and open doors to new possibilities.
          </p>
          <div className="mt-5 pt-4 border-t border-[#1F1F1F] text-xs font-mono">
            {!deadlineLoaded ? (
              <span className="text-[#A0A0A5]">CHECKING DEADLINE</span>
            ) : isPastDeadline ? (
              <span className="text-[#E62B1E] font-bold">NOMINATIONS CLOSED: {deadlineFormatted} IST</span>
            ) : deadlineFormatted ? (
              <span className="text-[#A0A0A5]">Registration deadline: <span className="text-[#E62B1E] font-bold">{deadlineFormatted} IST</span></span>
            ) : (
              <span className="text-emerald-400">NOMINATIONS OPEN</span>
            )}
          </div>
        </div>

        {deadlineLoadError && (
          <div className="bg-[#E62B1E]/15 border border-[#E62B1E] p-5 mb-8 text-white">
            <p className="text-sm">{deadlineLoadError} Refresh the page before submitting.</p>
          </div>
        )}

        {isPastDeadline && (
          <div className="bg-[#E62B1E]/10 border border-[#E62B1E] p-6 mb-8 text-center">
            <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">Nominations Closed</h3>
            <p className="text-[#A0A0A5] text-sm">
              Speaker nominations closed on {deadlineFormatted} IST. New nominations are currently closed.
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

        {/* Nomination Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
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

          {/* Section 1: Details of the Nominator */}
          <div className="bg-[#0C0C0C] border border-[#242424] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1F1F1F]">
              <span className="w-2.5 h-2.5 bg-[#E62B1E]" />
              <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                Details of the Nominator
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
                  placeholder="Your full name"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.fullName && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Email ID <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@domain.com"
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

              {/* Email ID for further communication */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Email ID (For Further Communication) <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="email"
                  name="communicationEmail"
                  value={formData.communicationEmail}
                  onChange={handleChange}
                  placeholder="Secondary / primary contact email"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.communicationEmail && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.communicationEmail}</p>}
              </div>

              {/* Work Status Radio */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-3">
                  Choose your work status <span className="text-[#E62B1E]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Student', 'Working Professional'].map((status) => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-colors ${
                        formData.workStatus === status
                          ? 'border-[#E62B1E] bg-[#E62B1E]/10 text-white'
                          : 'border-[#262626] bg-[#141414] text-[#A0A0A5] hover:border-[#383838]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="workStatus"
                        value={status}
                        checked={formData.workStatus === status}
                        onChange={handleChange}
                        className="accent-[#E62B1E]"
                      />
                      <span className="text-sm font-medium">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Current Profession */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Current profession <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="text"
                  name="currentProfession"
                  value={formData.currentProfession}
                  onChange={handleChange}
                  placeholder="e.g. AI Researcher, Undergraduate Student, Product Designer"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.currentProfession && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.currentProfession}</p>}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                  Organization you currently work/study at? <span className="text-[#E62B1E]">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Company, University or Institute name"
                  className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                />
                {errors.organization && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.organization}</p>}
              </div>

              {/* Are you nominating yourself? Radio */}
              <div className="sm:col-span-2 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white font-bold mb-3">
                  Are you nominating yourself? <span className="text-[#E62B1E]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Yes — I am nominating myself', val: 'Yes' },
                    { label: 'No — I am nominating someone else', val: 'No' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                        formData.areYouNominatingYourself === opt.val
                          ? 'border-[#E62B1E] bg-[#E62B1E]/15 text-white font-semibold'
                          : 'border-[#262626] bg-[#141414] text-[#A0A0A5] hover:border-[#383838]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="areYouNominatingYourself"
                        value={opt.val}
                        checked={formData.areYouNominatingYourself === opt.val}
                        onChange={handleChange}
                        className="accent-[#E62B1E]"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Section 2A: Details for Self Nomination (ONLY IF YES) */}
          {isSelf && (
            <div className="bg-[#0C0C0C] border border-[#242424] p-6 sm:p-8 animate-[fadeSlideUp_0.2s_ease-out]">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1F1F1F]">
                <span className="w-2.5 h-2.5 bg-[#E62B1E]" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                  Details for Self Nomination
                </h2>
              </div>

              <div className="space-y-6">
                {/* Biography */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Please share a brief biography about yourself <span className="text-[#E62B1E]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="selfBio"
                    value={formData.selfBio}
                    onChange={handleChange}
                    placeholder="Your background, journey, credentials, and passion..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                  />
                  {errors.selfBio && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.selfBio}</p>}
                </div>

                {/* Social Profiles */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Links to your LinkedIn and other social media profiles <span className="text-[#E62B1E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="selfSocialLinks"
                    value={formData.selfSocialLinks}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/... , https://twitter.com/..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                  />
                  {errors.selfSocialLinks && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.selfSocialLinks}</p>}
                </div>

                {/* Media Links (optional) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Links to any online videos, articles or social works <span className="text-[#6E6E73] normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="selfMediaLinks"
                    value={formData.selfMediaLinks}
                    onChange={handleChange}
                    placeholder="Past talks, publications, news features..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                  />
                </div>

                {/* Unique Idea */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    What is the unique idea that you want to share in the TEDx talk? <span className="text-[#E62B1E]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="selfUniqueIdea"
                    value={formData.selfUniqueIdea}
                    onChange={handleChange}
                    placeholder="The core idea worth spreading that challenges assumptions..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                  />
                  {errors.selfUniqueIdea && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.selfUniqueIdea}</p>}
                </div>

                {/* Key Takeaways */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    In a few sentences, what are the key takeaways you want the audience to know or feel after hearing this talk? <span className="text-[#E62B1E]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="selfKeyTakeaways"
                    value={formData.selfKeyTakeaways}
                    onChange={handleChange}
                    placeholder="The tangible insights, shifts in perspective, or inspiration listeners walk away with..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                  />
                  {errors.selfKeyTakeaways && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.selfKeyTakeaways}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Conditional Section 2B: Details of the Nominee (ONLY IF NO) */}
          {!isSelf && (
            <div className="bg-[#0C0C0C] border border-[#242424] p-6 sm:p-8 animate-[fadeSlideUp_0.2s_ease-out]">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1F1F1F]">
                <span className="w-2.5 h-2.5 bg-[#E62B1E]" />
                <h2 className="text-xl font-bold uppercase tracking-wide text-white">
                  Details of the Nominee
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nominee's Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                      Nominee's Name <span className="text-[#E62B1E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="nomineeName"
                      value={formData.nomineeName}
                      onChange={handleChange}
                      placeholder="Candidate's full name"
                      className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                    />
                    {errors.nomineeName && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeName}</p>}
                  </div>

                  {/* Current Organization of the Nominee */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                      Current organization of the nominee <span className="text-[#E62B1E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="nomineeOrganization"
                      value={formData.nomineeOrganization}
                      onChange={handleChange}
                      placeholder="Nominee's company or institution"
                      className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                    />
                    {errors.nomineeOrganization && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeOrganization}</p>}
                  </div>
                </div>

                {/* Qualification / Professional Description */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Qualification / professional description of the nominee <span className="text-[#E62B1E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomineeQualification"
                    value={formData.nomineeQualification}
                    onChange={handleChange}
                    placeholder="e.g. Lead Climate Scientist, Founder at EcoInnovate, Author"
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                  />
                  {errors.nomineeQualification && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeQualification}</p>}
                </div>

                {/* Brief Biography */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Please share a brief biography about the nominee <span className="text-[#E62B1E]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="nomineeBio"
                    value={formData.nomineeBio}
                    onChange={handleChange}
                    placeholder="Their story, milestone achievements, and public presence..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                  />
                  {errors.nomineeBio && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeBio}</p>}
                </div>

                {/* LinkedIn and Social Profiles */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Links to the LinkedIn and other social media profiles of the nominee <span className="text-[#E62B1E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomineeSocialLinks"
                    value={formData.nomineeSocialLinks}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/... , https://twitter.com/..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                  />
                  {errors.nomineeSocialLinks && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeSocialLinks}</p>}
                </div>

                {/* Online Videos or Articles */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    Links to any online videos or articles of the proposed nominee <span className="text-[#E62B1E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomineeMediaLinks"
                    value={formData.nomineeMediaLinks}
                    onChange={handleChange}
                    placeholder="YouTube videos, podcast appearances, interviews, publications..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors"
                  />
                  {errors.nomineeMediaLinks && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeMediaLinks}</p>}
                </div>

                {/* Unique Perspective */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A5] mb-2">
                    What's one unique perspective the nominee will bring to the TEDx stage and how will it help the audience? <span className="text-[#E62B1E]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="nomineeUniquePerspective"
                    value={formData.nomineeUniquePerspective}
                    onChange={handleChange}
                    placeholder="Why this person's voice carries purpose and aligns with 'The Untapped'..."
                    className="w-full bg-[#141414] border border-[#2B2B2B] text-white px-4 py-3 text-sm focus:border-[#E62B1E] focus:outline-none transition-colors resize-y"
                  />
                  {errors.nomineeUniquePerspective && <p className="field-error text-xs text-[#E62B1E] mt-1.5">{errors.nomineeUniquePerspective}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Submit Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1F1F1F]">
            <p className="text-xs text-[#8E8E93]">
              Review all details carefully before submitting. Our team will verify nominee credentials.
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
                  <span>Submitting Nomination...</span>
                </>
              ) : (
                <>
                  <span>Submit Speaker Nomination</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Contact Info */}
        <div className="mt-12 p-6 border border-[#242424] bg-[#0A0A0A] text-center text-xs font-mono text-[#8E8E93]">
          <p className="uppercase tracking-wider text-[#F5F5F2] mb-1 font-semibold">
            For queries, contact:
          </p>
          <p>
            Shubhavi R V &mdash; <a href="tel:+916384093306" className="text-[#E62B1E] hover:underline">+91 63840 93306</a>
            {' '}|{' '}
            Sachin G &mdash; <a href="tel:+919791031117" className="text-[#E62B1E] hover:underline">+91 97910 31117</a>
          </p>
        </div>

      </div>
    </div>
  );
}

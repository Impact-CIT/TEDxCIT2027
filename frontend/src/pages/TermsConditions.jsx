import React, { useEffect } from 'react';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#F5F5F2] pt-28 pb-20 px-4 sm:px-8 lg:px-14 xl:px-20 font-sans selection:bg-[#FF2B25] selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#8E8E93] hover:text-[#FF2B25] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </a>
        </div>

        {/* Header */}
        <div className="border-b border-[#262626] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF2B25]/10 border border-[#FF2B25]/30 text-[#FF2B25] text-xs font-mono uppercase tracking-widest mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm font-mono text-[#8E8E93]">
            Last Updated: November 2026 • Effective for TEDxCIT 2027: UNTAPPED
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#D1D1D6]">

          {/* Section 1 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">01.</span> About the Event & Licensing
            </h2>
            <p className="mb-3">
              <strong>TEDxCIT 2027</strong> (&quot;Event&quot;) is an independently organized TEDx event operated under official license granted by TED Conferences LLC. The event is organized and hosted by <strong>Chennai Institute of Technology</strong>, located at Sarathy Nagar, Kundrathur, Chennai, Tamil Nadu 600069, India.
            </p>
            <p>
              By accessing our website, purchasing delegate passes, or attending TEDxCIT 2027, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, please refrain from registering or using the website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">02.</span> Delegate Pass Categories & Eligibility
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-[#FF2B25] pl-4">
                <h3 className="font-semibold text-white">Student Delegate Pass (₹100)</h3>
                <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
                  Applicable strictly to bona fide school, college, and university students. Attendees booking a Student Delegate Pass <strong>must present a valid student identity card</strong> during physical check-in at the registration desk on the event day. Failure to produce a valid ID may result in denial of entry without refund.
                </p>
              </div>
              <div className="border-l-2 border-[#FF2B25] pl-4">
                <h3 className="font-semibold text-white">Professional Delegate Pass (₹200)</h3>
                <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
                  Open to corporate professionals, academicians, entrepreneurs, researchers, and general delegates. Includes priority seating, access to executive networking zones, and premium delegate kit.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">03.</span> Payment Gateway & Pricing Transparency
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li>All payments are securely routed and processed through <strong>Razorpay Payment Gateway</strong> (Razorpay Software Private Limited).</li>
              <li>Pass rates are listed in <strong>Indian Rupees (INR / ₹)</strong>. Any applicable statutory levies, taxes, or gateway convenience charges will be displayed before final payment confirmation.</li>
              <li>A booking is considered confirmed only upon the generation of a valid Razorpay Payment ID and subsequent issuance of an automated digital registration confirmation email.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">04.</span> Entry & Venue Protocol
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Security Screening:</strong> All attendees are subject to security screening upon entering the Chennai Institute of Technology auditorium and campus premises. Prohibited items include hazardous materials, sharp objects, unauthorized banners, and outside food/beverages.
              </p>
              <p>
                <strong>Right of Admission:</strong> The organizing committee reserves the right of admission. Any attendee engaging in disruptive behavior, harassment, hate speech, or non-compliance with venue protocols will be escorted from the premises without a refund.
              </p>
              <p>
                <strong>Photography & Recording:</strong> By attending the event, delegates grant TEDxCIT and TED Conferences the irrevocable right to photograph, film, and record their likeness and voice for archival, promotional, and educational distribution across global media channels.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">05.</span> Event Schedule & Postponement
            </h2>
            <p>
              While every effort is made to maintain the scheduled roster of speakers and performances, organizers reserve the right to alter speaker lineups, timings, or session agendas due to unforeseen circumstances or emergencies beyond our reasonable control. In case of event postponement, passes will remain valid for the rescheduled date.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">06.</span> Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to this contract shall be subject to the exclusive jurisdiction of the competent courts situated in <strong>Chennai, Tamil Nadu, India</strong>.
            </p>
          </section>

          {/* Contact Box */}
          <div className="p-6 bg-[#121212] border border-[#262626] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white uppercase">Questions regarding our Terms?</h4>
              <p className="text-xs text-[#8E8E93] mt-0.5">Contact the organizing team at Chennai Institute of Technology.</p>
            </div>
            <a
              href="/contact-us"
              className="px-5 py-2.5 bg-[#FF2B25] hover:bg-[#d61e19] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Contact Support
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}


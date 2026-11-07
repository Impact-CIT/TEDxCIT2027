import React, { useEffect } from 'react';
import { Truck, Mail, QrCode, CheckCircle2, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

export default function DeliveryPolicy() {
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
            <Truck className="w-3.5 h-3.5" />
            <span>Fulfillment & Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-3 text-sm font-mono text-[#8E8E93]">
            Digital Pass Fulfillment & Entry Credentials • TEDxCIT 2027
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#D1D1D6]">

          {/* Quick Notice Card */}
          <div className="bg-[#0E0E0E] border border-[#FF2B25]/30 p-6 sm:p-8 rounded-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm bg-[#FF2B25]/10 border border-[#FF2B25]/30 flex items-center justify-center text-[#FF2B25] shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  100% Digital Pass Issuance (No Physical Shipping)
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1 leading-relaxed">
                  TEDxCIT 2027 is an eco-conscious paperless initiative. All delegate passes are delivered electronically. <strong>No physical paper tickets or badges will be shipped via courier or postal mail</strong> prior to the event. Physical delegate kits and identity badges are collected on-site at the campus on the day of the event.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Fulfillment Process */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">01.</span> Delivery Timeline & Method
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-[#FF2B25] pl-4">
                <h3 className="font-semibold text-white">Instant On-Screen Confirmation</h3>
                <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
                  Immediately upon completing payment via Razorpay, your screen will display a verified confirmation screen featuring your <strong>Unique Registration ID (REG-XXXXX)</strong> and pass confirmation details.
                </p>
              </div>
              <div className="border-l-2 border-[#FF2B25] pl-4">
                <h3 className="font-semibold text-white">Automated Email Dispatch (Within 15 Minutes)</h3>
                <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
                  An official digital receipt and confirmation pass will be dispatched automatically to your registered email address within <strong>15 minutes</strong> of successful payment capture.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Contents of Digital Delivery */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">02.</span> What Your Digital Delivery Contains
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li><strong>Unique Registration Identifier:</strong> Linked to your personal registration profile.</li>
              <li><strong>Pass Tier Confirmation:</strong> Detailed benefits for Student Delegate Pass (₹100) or Professional Delegate Pass (₹200).</li>
              <li><strong>Venue Access Guidelines:</strong> Campus entry gates, parking instructions, and auditorium reporting times.</li>
              <li><strong>Razorpay Tax Invoice / Receipt:</strong> Itemized proof of payment for your records.</li>
            </ul>
          </section>

          {/* Section 3: On-Site Check-in */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">03.</span> Event Day Physical Badge Collection
            </h2>
            <p className="mb-3">
              To collect your official physical event wristband, delegate badge, and event kit at the Chennai Institute of Technology registration counter:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li>Display your digital confirmation email or Registration ID on your smartphone (or a printed copy).</li>
              <li>Present a valid government photo ID (Aadhaar, Driving License, Passport, Voter ID).</li>
              <li><strong>Student Pass holders:</strong> Must present an active School or College Student Identity Card.</li>
            </ul>
          </section>

          {/* Section 4: Non-Receipt Support */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">04.</span> What If You Haven&apos;t Received Your Email?
            </h2>
            <p className="mb-3">
              If you do not find the confirmation email in your inbox within 30 minutes of payment:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-[#D1D1D6]">
              <li>Check your <em>Spam</em>, <em>Promotions</em>, or <em>Junk</em> email folders.</li>
              <li>Verify that the email address entered during registration was spelled accurately.</li>
              <li>If still not located, contact our delegate helpdesk at <strong className="text-white">tedx@citchennai.net</strong> with your bank transaction reference or Razorpay payment ID. Our team will verify and re-issue your digital pass within 4 hours.</li>
            </ol>
          </section>

        </div>

      </div>
    </div>
  );
}


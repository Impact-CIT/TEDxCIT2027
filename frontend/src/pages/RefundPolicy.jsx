import React, { useEffect } from 'react';
import { RefreshCw, Clock, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RefundPolicy() {
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
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Billing & Transaction Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Cancellation & Refund Policy
          </h1>
          <p className="mt-3 text-sm font-mono text-[#8E8E93]">
            Last Updated: November 2026 • Official Guidelines for TEDxCIT 2027 Passes
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#D1D1D6]">

          {/* Highlights Box for Quick Underwriter Audit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D0D0D] border border-[#262626] p-5 rounded-sm">
              <div className="flex items-center gap-2 text-[#FF2B25] font-mono text-xs uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Turnaround Time</span>
              </div>
              <div className="text-xl font-bold text-white">7–10 Days</div>
              <p className="text-xs text-[#8E8E93] mt-1">Direct to original source of payment</p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#262626] p-5 rounded-sm">
              <div className="flex items-center gap-2 text-[#FF2B25] font-mono text-xs uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Duplicate Payments</span>
              </div>
              <div className="text-xl font-bold text-white">5–7 Days</div>
              <p className="text-xs text-[#8E8E93] mt-1">Automatic technical reconciliation</p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#262626] p-5 rounded-sm">
              <div className="flex items-center gap-2 text-[#FF2B25] font-mono text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Gateway Provider</span>
              </div>
              <div className="text-xl font-bold text-white">Razorpay</div>
              <p className="text-xs text-[#8E8E93] mt-1">Secure automated reversal</p>
            </div>
          </div>

          {/* Section 1: Standard Pass Purchases */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">01.</span> General Cancellation Policy
            </h2>
            <p className="mb-3">
              TEDxCIT 2027 operates on strict capacity limits in accordance with TED license constraints and campus auditorium fire safety regulations. Consequently:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li>All delegate pass purchases (Student Delegate Passes at ₹100 and Professional Delegate Passes at ₹200) are <strong>strictly non-refundable and non-cancellable</strong> once successfully booked.</li>
              <li>Passes are allocated to a single named individual and cannot be transferred, resold, or exchanged for other merchandise without prior written consent from the organizing committee.</li>
            </ul>
          </section>

          {/* Section 2: Event Postponement / Cancellation by Organizers */}
          <section className="bg-[#0E0E0E] border border-[#FF2B25]/30 p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">02.</span> Organizer Cancellation or Rescheduling
            </h2>
            <div className="space-y-3">
              <p>
                In the rare event that TEDxCIT 2027 is postponed, rescheduled, or cancelled entirely due to force majeure, government health/safety directives, adverse weather, or institutional emergencies:
              </p>
              <div className="bg-[#141414] p-4 border-l-2 border-[#FF2B25] text-xs sm:text-sm text-[#E5E5EA] space-y-2">
                <p className="font-semibold text-white">Full Refund Guarantee:</p>
                <p>
                  1. If the event is permanently cancelled, a <strong>100% full refund</strong> will be initiated automatically to all registered delegates.
                </p>
                <p>
                  2. All refunds are processed via the <strong>Razorpay Payment Gateway</strong> and credited back directly to the original payment source (credit/debit card, UPI account, or net banking) within <strong>7 to 10 working days</strong>.
                </p>
                <p>
                  3. If the event is rescheduled, your pass remains valid for the revised date. Delegates unable to attend on the new date may request a refund within 5 days of the postponement announcement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Technical Errors & Double Debits */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">03.</span> Duplicate Charges & Technical Glitches
            </h2>
            <p className="mb-3">
              If your bank account or card is debited multiple times due to a network interruption, gateway timeout, or transaction glitch:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li>Any uncaptured or duplicate charge is automatically detected and reversed by Razorpay within <strong>24 to 48 hours</strong>.</li>
              <li>The reversed funds will reflect in your bank account or card balance within <strong>5 to 7 working days</strong>, subject to your card issuer/bank&apos;s settlement schedule.</li>
              <li>If the duplicate charge is not automatically reversed within 72 hours, please email your transaction details to <strong className="text-white">tedx@citchennai.net</strong>.</li>
            </ul>
          </section>

          {/* Section 4: Refund Claim Procedure */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#FF2B25] font-mono">04.</span> How to Request a Refund or Report an Issue
            </h2>
            <p className="mb-4">
              To submit a billing inquiry or claim an authorized refund, please provide the following details to our support desk:
            </p>
            <div className="bg-[#141414] border border-[#2B2B2B] p-4 rounded-sm text-xs sm:text-sm font-mono text-[#A1A1A6] space-y-1">
              <p>• Full Name as registered</p>
              <p>• Registered Email ID & Mobile Number</p>
              <p>• Razorpay Payment ID (e.g., pay_xxxxxxxxxx)</p>
              <p>• Razorpay Order ID (e.g., order_xxxxxxxxxx)</p>
              <p>• Screenshot of the debit confirmation from your bank/UPI app</p>
            </div>
            <p className="mt-4 text-xs text-[#8E8E93]">
              Send your request to: <span className="text-white font-semibold">tedx@citchennai.net</span> with the subject line <em>&quot;REFUND QUERY - [Your Name] - [Order ID]&quot;</em>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}


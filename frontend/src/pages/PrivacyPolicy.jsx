import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Server, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#F5F5F2] pt-28 pb-20 px-4 sm:px-8 lg:px-14 xl:px-20 font-sans selection:bg-[#EB0028] selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#8E8E93] hover:text-[#EB0028] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </a>
        </div>

        {/* Header */}
        <div className="border-b border-[#262626] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EB0028]/10 border border-[#EB0028]/30 text-[#EB0028] text-xs font-mono uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Privacy <span className="text-[#EB0028]">Policy</span>
          </h1>
          <p className="mt-3 text-sm font-mono text-[#8E8E93]">
            Last Updated: November 2026 • TEDx Chennai Institute of Technology
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-10 text-sm sm:text-base leading-relaxed text-[#D1D1D6]">

          {/* Section 1 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#EB0028] font-mono">01.</span> Introduction & Scope
            </h2>
            <p>
              TEDxCIT 2027 (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy, confidentiality, and security of all delegates, attendees, speakers, and website visitors. This Privacy Policy outlines our procedures concerning the collection, storage, use, and protection of personal data in compliance with the Digital Personal Data Protection Act (DPDPA), 2023, and Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#EB0028] font-mono">02.</span> Information We Collect
            </h2>
            <p className="mb-3">During registration or speaker applications, we collect only necessary personal data, including:</p>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li><strong>Contact Information:</strong> Full Name, Primary Email Address, and Contact Mobile Number.</li>
              <li><strong>Academic / Professional Background:</strong> College/University Name, Department, Year of Study, Roll Number (for Student Delegates), or Organization Name and Designation (for Professional Delegates).</li>
              <li><strong>Event Identification:</strong> Unique Registration ID, pass category selected, and dietary preferences (if applicable for lunch catering).</li>
              <li><strong>Technical Metadata:</strong> IP address, browser type, device information, and interaction logs collected automatically for fraud prevention and performance optimization.</li>
            </ul>
          </section>

          {/* Section 3 - CRITICAL RAZORPAY COMPLIANCE */}
          <section className="bg-[#0E0E0E] border-2 border-[#EB0028]/40 p-6 sm:p-8 rounded-sm shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#EB0028]" />
              <span>03. Payment Security & Financial Data</span>
            </h2>
            <div className="space-y-3">
              <p>
                <strong>Zero Financial Storage Guarantee:</strong> All payment transactions on this website are securely handled through <strong>Razorpay Payment Gateway</strong> (Razorpay Software Private Limited), an RBI-authorized Payment Aggregator complying with the highest international security standard: <strong>PCI-DSS Level 1</strong>.
              </p>
              <div className="p-4 bg-[#141414] border border-[#2B2B2B] rounded-sm text-xs sm:text-sm text-[#A1A1A6]">
                <p>
                  <strong>Important:</strong> TEDxCIT 2027 <strong>NEVER</strong> collects, stores, accesses, or processes your sensitive financial credentials — including credit/debit card numbers, CVVs, expiration dates, net banking passwords, or UPI PINs. All financial inputs are encrypted and submitted directly to Razorpay through secure 256-bit TLS/SSL channels.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#EB0028] font-mono">04.</span> Purpose of Data Collection
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[#D1D1D6]">
              <li>To issue and verify digital delegate passes and generate entry QR codes.</li>
              <li>To communicate critical event updates, venue schedules, speaker schedules, and logistical instructions.</li>
              <li>To provide certificates of participation to verified attendees following the event.</li>
              <li>To prevent fraudulent pass duplication, chargebacks, and unauthorized ticket reselling.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#EB0028] font-mono">05.</span> Disclosure & Third-Party Sharing
            </h2>
            <p>
              We <strong>do not sell, rent, lease, or monetize</strong> your personal information to third-party advertisers or external marketing agencies. Data is shared strictly with authorized service providers under confidentiality agreements:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-[#D1D1D6]">
              <li><strong>Razorpay:</strong> Exclusively for transaction verification, settlement, and fraud prevention.</li>
              <li><strong>Chennai Institute of Technology Administration:</strong> For on-campus security clearance, physical visitor logging, and emergency medical preparedness.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-[#EB0028] font-mono">06.</span> Grievance Officer & Contact
            </h2>
            <p className="mb-3">
              In accordance with Information Technology Act 2000 and the Digital Personal Data Protection Act, 2023, the details of the Grievance Officer for data protection inquiries are:
            </p>
            <div className="border-l-2 border-[#EB0028] pl-4 text-xs sm:text-sm text-[#A1A1A6] space-y-1">
              <p><strong>Designation:</strong> Data Grievance Officer, TEDxCIT 2027</p>
              <p><strong>Institution:</strong> Chennai Institute of Technology</p>
              <p><strong>Address:</strong> Sarathy Nagar, Kundrathur, Chennai, Tamil Nadu - 600069, India</p>
              <p><strong>Email:</strong> tedx@citchennai.net</p>
              <p><strong>Response SLA:</strong> Within 48 hours of receipt of query</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}


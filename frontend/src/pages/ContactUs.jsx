import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Building2, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Delegate Registration Query',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#F5F5F2] pt-28 pb-20 px-4 sm:px-8 lg:px-14 xl:px-20 font-sans selection:bg-[#FF2B25] selection:text-white">
      <div className="max-w-5xl mx-auto">
        
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
            <Building2 className="w-3.5 h-3.5" />
            <span>Organizer Information</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Contact Us
          </h1>
          <p className="mt-3 text-sm font-mono text-[#8E8E93]">
            TEDx Chennai Institute of Technology Organizing Committee
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Official Contact Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Campus Address Card */}
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-7 rounded-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#FF2B25]/10 border border-[#FF2B25]/30 flex items-center justify-center text-[#FF2B25] shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#8E8E93]">
                    Physical Campus & Registered Office
                  </h3>
                  <p className="text-lg font-bold text-white mt-1">Chennai Institute of Technology</p>
                  <p className="text-sm text-[#A1A1A6] mt-1.5 leading-relaxed">
                    Sarathy Nagar, Kundrathur, SH-113, Chennai,<br />
                    Tamil Nadu 600069, India.
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://maps.google.com/?q=Chennai+Institute+of+Technology"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF2B25] hover:underline uppercase"
                    >
                      <span>View on Google Maps ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-7 rounded-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#FF2B25]/10 border border-[#FF2B25]/30 flex items-center justify-center text-[#FF2B25] shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#8E8E93]">
                    Official Email Contacts
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="text-[#8E8E93]">General & Ticketing Inquiries:</span>{' '}
                      <a href="mailto:tedx@citchennai.net" className="text-white hover:text-[#FF2B25] font-semibold underline">
                        tedx@citchennai.net
                      </a>
                    </p>
                    <p className="text-sm">
                      <span className="text-[#8E8E93]">Organizer Lead:</span>{' '}
                      <a href="mailto:sanjithcodez@gmail.com" className="text-white hover:text-[#FF2B25] font-semibold underline">
                        sanjithcodez@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpline & Timings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 rounded-sm">
                <div className="flex items-center gap-2 text-[#FF2B25] font-mono text-xs uppercase tracking-wider mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Helpline Phone</span>
                </div>
                <div className="text-sm font-bold text-white">+91 44 7111 9111</div>
                <p className="text-xs text-[#8E8E93] mt-1">CIT Campus Central Switchboard</p>
              </div>

              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 rounded-sm">
                <div className="flex items-center gap-2 text-[#FF2B25] font-mono text-xs uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Operating Hours</span>
                </div>
                <div className="text-sm font-bold text-white">9:00 AM – 6:00 PM IST</div>
                <p className="text-xs text-[#8E8E93] mt-1">Monday through Saturday</p>
              </div>
            </div>

            {/* License Note */}
            <div className="p-4 bg-[#121212] border border-[#262626] rounded-sm text-xs text-[#8E8E93] leading-relaxed">
              <strong className="text-white">Independent Event Disclosure:</strong> TEDxCIT 2027 is operated under a license from TED Conferences LLC. For inquiries regarding global TED programs, visit <a href="https://www.ted.com" target="_blank" rel="noreferrer" className="text-[#FF2B25] underline">ted.com</a>.
            </div>

          </div>

          {/* Right Column: Interactive Query Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-[#8E8E93] mb-6">
                Have questions about delegate passes, tickets, or sponsorships? Our team will get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="p-6 bg-[#0E1F13] border border-[#1D6334] rounded-sm text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#28A745] mx-auto" />
                  <h4 className="font-bold text-white text-base">Message Transmitted!</h4>
                  <p className="text-xs text-[#A1A1A6]">
                    Thank you for contacting the TEDxCIT 2027 organizing committee. A coordinator will reach out shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 text-xs font-mono text-[#FF2B25] uppercase tracking-wider hover:underline"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sanjith Kumar"
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    >
                      <option value="Delegate Registration Query">Delegate Registration / Pass Query</option>
                      <option value="Payment / Razorpay Issue">Payment / Razorpay Issue</option>
                      <option value="Speaker Nomination">Speaker Nomination</option>
                      <option value="Partnership / Sponsorship">Partnership / Sponsorship</option>
                      <option value="General Query">General Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Type your message or inquiry here..."
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FF2B25] hover:bg-[#d61e19] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


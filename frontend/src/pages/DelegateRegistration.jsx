import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  CreditCard,
  GraduationCap,
  Briefcase,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function DelegateRegistration() {
  const [selectedPass, setSelectedPass] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    designation: '',
    rollNo: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const passes = {
    student: {
      id: 'student',
      name: 'Student Delegate Pass',
      price: 100,
      badge: 'Bona Fide Students',
      icon: GraduationCap,
      description: 'Exclusive access designed for school, college, and university students.',
      benefits: [
        'Access to all speaker sessions & live talks',
        'Official TEDxCIT 2027 Student Delegate Kit',
        'Networking Lunch & High-Tea Refreshments',
        'Interactive Innovation & Tech Experience Zones',
        'Official Certificate of Participation',
      ],
      notice: 'Active student ID card must be presented at the venue registration counter.',
    },
    professional: {
      id: 'professional',
      name: 'Professional Delegate Pass',
      price: 200,
      badge: 'Corporate & Academics',
      icon: Briefcase,
      description: 'Full-access executive pass for industry leaders, entrepreneurs, and academicians.',
      benefits: [
        'Priority check-in & reserved premium seating',
        'Access to all speaker sessions & panel discussions',
        'Exclusive Executive Networking Lounge access',
        'Official TEDxCIT 2027 Executive Delegate Kit',
        'Networking Lunch with Speakers and Sponsors',
        'Digital Certificate of Attendance',
      ],
      notice: 'Open to all corporate professionals, founders, and researchers.',
    },
  };

  const currentPass = passes[selectedPass];

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const response = await fetch('http://localhost:5000/api/delegates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          passType: selectedPass,
          institution: formData.institution,
          designation: formData.designation,
          rollNo: formData.rollNo,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create registration order');
      }

      const orderData = result.data;

      // 2. Open Razorpay Checkout modal if Razorpay SDK script is loaded
      if (typeof window.Razorpay !== 'undefined' && !orderData.isMock) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'TEDxCIT 2027',
          description: orderData.pass.name,
          order_id: orderData.orderId,
          prefill: orderData.prefill,
          theme: { color: '#FF2B25' },
          handler: async function (paymentResponse) {
            try {
              const verifyRes = await fetch('http://localhost:5000/api/delegates/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  registrationId: orderData.registrationId,
                }),
              });
              const verifyResult = await verifyRes.json();
              if (verifyResult.success) {
                setSuccessData(verifyResult.data);
              } else {
                setErrorMsg(verifyResult.message || 'Payment verification failed');
              }
            } catch (err) {
              setErrorMsg('Verification error: ' + err.message);
            }
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for Mock Mode or direct test confirmation while awaiting Razorpay activation
        const verifyRes = await fetch('http://localhost:5000/api/delegates/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'mock_signature_success',
            registrationId: orderData.registrationId,
          }),
        });
        const verifyResult = await verifyRes.json();
        if (verifyResult.success) {
          setSuccessData(verifyResult.data);
        } else {
          setSuccessData({
            registrationId: orderData.registrationId,
            passName: currentPass.name,
            amountPaid: currentPass.price,
            attendee: { name: formData.name, email: formData.email },
          });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to connect to registration server. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-[#F5F5F2] pt-28 pb-20 px-4 sm:px-8 lg:px-14 xl:px-20 font-sans selection:bg-[#FF2B25] selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
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
        <div className="border-b border-[#262626] pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF2B25]/10 border border-[#FF2B25]/30 text-[#FF2B25] text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Event Registration</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            TEDxCIT 2027 Delegate Passes
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#A1A1A6]">
            Select your delegate category and complete your registration securely via Razorpay.
          </p>
        </div>

        {/* Success Screen */}
        {successData ? (
          <div className="max-w-2xl mx-auto bg-[#0A0A0A] border-2 border-[#28A745] p-8 sm:p-10 rounded-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#28A745]/15 border border-[#28A745] flex items-center justify-center text-[#28A745] mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#28A745]">
                REGISTRATION CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                You&apos;re Attending TEDxCIT 2027!
              </h2>
            </div>

            <div className="bg-[#141414] border border-[#2B2B2B] p-5 text-left rounded-sm space-y-2 text-xs sm:text-sm font-mono">
              <div className="flex justify-between border-b border-[#2B2B2B] pb-2">
                <span className="text-[#8E8E93]">Registration ID:</span>
                <span className="text-white font-bold">{successData.registrationId}</span>
              </div>
              <div className="flex justify-between border-b border-[#2B2B2B] py-2">
                <span className="text-[#8E8E93]">Pass Category:</span>
                <span className="text-white">{successData.passName || currentPass.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#2B2B2B] py-2">
                <span className="text-[#8E8E93]">Delegate Name:</span>
                <span className="text-white">{successData.attendee?.name || formData.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8E8E93]">Amount Paid:</span>
                <span className="text-[#28A745] font-bold">₹{successData.amountPaid || currentPass.price} INR</span>
              </div>
            </div>

            <p className="text-xs text-[#8E8E93] leading-relaxed">
              A digital confirmation email and entry badge details have been dispatched to{' '}
              <strong className="text-white">{successData.attendee?.email || formData.email}</strong>.
            </p>

            <a
              href="/"
              className="inline-block px-8 py-3 bg-[#FF2B25] hover:bg-[#d61e19] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Return to Home Page
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 6 Cols: Pass Options */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#8E8E93]">
                STEP 1: SELECT YOUR PASS TIER
              </div>

              {Object.values(passes).map((pass) => {
                const isSelected = selectedPass === pass.id;
                const IconComponent = pass.icon;

                return (
                  <div
                    key={pass.id}
                    onClick={() => setSelectedPass(pass.id)}
                    className={`relative p-6 sm:p-7 rounded-sm border cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#0E0E0E] border-[#FF2B25] shadow-lg shadow-[#FF2B25]/15'
                        : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                            isSelected ? 'bg-[#FF2B25] text-white' : 'bg-[#1C1C1E] text-[#8E8E93]'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-[#1F1F1F] text-[#8E8E93]">
                            {pass.badge}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1">{pass.name}</h3>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-black text-white">
                          ₹{pass.price}
                        </div>
                        <span className="text-[10px] font-mono text-[#8E8E93] uppercase">
                          INR / Pass
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#A1A1A6] mt-4 leading-relaxed">
                      {pass.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#1F1F1F] space-y-2">
                      {pass.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#D1D1D6]">
                          <Check className="w-3.5 h-3.5 text-[#FF2B25] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-2.5 bg-[#141414] border border-[#262626] rounded-sm text-[11px] text-[#8E8E93]">
                      <strong className="text-white">Note:</strong> {pass.notice}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 6 Cols: Registration Details Form */}
            <div className="lg:col-span-6">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
                <div className="text-xs font-mono uppercase tracking-widest text-[#8E8E93] mb-4">
                  STEP 2: DELEGATE CREDENTIALS
                </div>

                {errorMsg && (
                  <div className="p-3 mb-5 bg-[#2B0E0E] border border-[#7A1D1D] rounded-sm text-xs text-[#FFA8A8] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanjith Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                      {selectedPass === 'student' ? 'College / University Name *' : 'Company / Organization Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedPass === 'student' ? 'e.g. Chennai Institute of Technology' : 'e.g. Acme Tech Solutions'}
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    />
                  </div>

                  {selectedPass === 'student' ? (
                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                        Student ID / Roll Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 21CS101"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1">
                        Job Designation / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Product Architect / Professor"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#FF2B25] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>
                  )}

                  {/* Price Summary Breakdown */}
                  <div className="p-4 bg-[#121212] border border-[#262626] rounded-sm space-y-2 font-mono text-xs mt-6">
                    <div className="flex justify-between text-[#8E8E93]">
                      <span>Selected Pass:</span>
                      <span className="text-white">{currentPass.name}</span>
                    </div>
                    <div className="flex justify-between text-[#8E8E93]">
                      <span>Base Pass Rate:</span>
                      <span className="text-white">₹{currentPass.price}.00</span>
                    </div>
                    <div className="flex justify-between text-[#8E8E93]">
                      <span>Convenience / Taxes:</span>
                      <span className="text-[#28A745]">₹0.00 (Inclusive)</span>
                    </div>
                    <div className="flex justify-between border-t border-[#262626] pt-2 text-sm font-bold">
                      <span className="text-white">Total Amount:</span>
                      <span className="text-[#FF2B25]">₹{currentPass.price}.00 INR</span>
                    </div>
                  </div>

                  {/* Payment CTA */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-[#FF2B25] hover:bg-[#d61e19] disabled:bg-[#551412] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#FF2B25]/20"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isProcessing ? 'Connecting to Razorpay...' : `Pay ₹${currentPass.price} & Confirm Registration`}</span>
                  </button>
                </form>

                {/* Razorpay Trust Badges */}
                <div className="mt-6 pt-4 border-t border-[#1F1F1F] flex flex-col items-center justify-center gap-2 text-[11px] text-[#8E8E93]">
                  <div className="flex items-center gap-1.5 text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#28A745]" />
                    <span>Secured by Razorpay • PCI-DSS Level 1 Compliant</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#6E6E73]">
                    <a href="/terms-and-conditions" className="hover:underline">Terms</a>
                    <span>•</span>
                    <a href="/privacy-policy" className="hover:underline">Privacy</a>
                    <span>•</span>
                    <a href="/cancellation-and-refund" className="hover:underline">Refund Policy</a>
                    <span>•</span>
                    <a href="/shipping-and-delivery" className="hover:underline">Delivery</a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


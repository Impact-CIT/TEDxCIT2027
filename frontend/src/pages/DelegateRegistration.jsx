import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  CreditCard,
  GraduationCap,
  Briefcase,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export default function DelegateRegistration() {
  const [selectedPass, setSelectedPass] = useState('student');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [attendedBefore, setAttendedBefore] = useState('No');
  const [heardAbout, setHeardAbout] = useState('');
  const [declaration, setDeclaration] = useState(false);

  // Student Delegate Specific Fields
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [section, setSection] = useState('');

  // Professional Delegate Specific Fields
  const [organisationName, setOrganisationName] = useState('');
  const [jobDesignation, setJobDesignation] = useState('');
  const [industryDomain, setIndustryDomain] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

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
      notice: 'Open to corporate professionals, founders, researchers, and academicians.',
    },
  };

  const currentPass = passes[selectedPass];

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!declaration) {
      setErrorMsg('Please confirm the declaration before proceeding.');
      return;
    }

    setIsProcessing(true);

    // Build payload with only requested fields
    const payload = {
      name,
      email,
      phone,
      linkedin,
      passType: selectedPass,
      attendedBefore,
      heardAbout,
      declaration,
      ...(selectedPass === 'student'
        ? {
            collegeName,
            department,
            yearOfStudy,
            section,
          }
        : {
            organisationName,
            jobDesignation,
            industryDomain,
            experienceYears,
          }),
    };

    try {
      // 1. Create order on backend
      const response = await fetch('http://localhost:5000/api/delegates/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create registration order');
      }

      const orderData = result.data;

      // 2. Open Razorpay Checkout modal if loaded
      if (typeof window.Razorpay !== 'undefined' && !orderData.isMock) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'TEDxCIT 2027',
          description: orderData.pass.name,
          order_id: orderData.orderId,
          prefill: orderData.prefill,
          theme: { color: '#EB0028' },
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
            attendee: { name, email },
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
    <div className="w-full min-h-screen bg-[#000000] text-[#F5F5F2] pt-28 pb-20 px-4 sm:px-8 lg:px-14 xl:px-20 font-sans selection:bg-[#EB0028] selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#8E8E93] hover:text-[#EB0028] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </a>
        </div>

        {/* Header */}
        <div className="border-b border-[#262626] pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EB0028]/10 border border-[#EB0028]/30 text-[#EB0028] text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
            <span>Official Event Registration</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            TEDxCIT 2027 <span className="text-[#EB0028]">Delegate Passes</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#A1A1A6]">
            Select your delegate category and fill in the registration details to proceed with Razorpay payment.
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
                <span className="text-white">{successData.attendee?.name || name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8E8E93]">Amount Paid:</span>
                <span className="text-[#28A745] font-bold">₹{successData.amountPaid || currentPass.price} INR</span>
              </div>
            </div>

            <p className="text-xs text-[#8E8E93] leading-relaxed">
              A digital confirmation email and entry badge details have been dispatched to{' '}
              <strong className="text-white">{successData.attendee?.email || email}</strong>.
            </p>

            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block px-8 py-3 bg-[#EB0028] hover:bg-[#C80022] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Return to Home Page
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Pass Selection */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-[#8E8E93]">
                STEP 1: CHOOSE YOUR PASS TIER
              </div>

              {Object.values(passes).map((pass) => {
                const isSelected = selectedPass === pass.id;
                const IconComponent = pass.icon;

                return (
                  <div
                    key={pass.id}
                    onClick={() => setSelectedPass(pass.id)}
                    className={`relative p-6 rounded-sm border cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#0E0E0E] border-[#EB0028] shadow-lg shadow-[#EB0028]/15'
                        : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                            isSelected ? 'bg-[#EB0028] text-white' : 'bg-[#1C1C1E] text-[#8E8E93]'
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
                          <Check className="w-3.5 h-3.5 text-[#EB0028] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-2.5 bg-[#141414] border border-[#262626] rounded-sm text-[11px] text-[#8E8E93]">
                      <strong className="text-white">Notice:</strong> {pass.notice}
                    </div>
                  </div>
                );
              })}

              {/* Price Summary Breakdown */}
              <div className="p-5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-sm space-y-2.5 font-mono text-xs">
                <div className="text-xs font-mono uppercase tracking-widest text-[#8E8E93] mb-2">
                  ORDER SUMMARY
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Pass Type:</span>
                  <span className="text-white">{currentPass.name}</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Ticket Rate:</span>
                  <span className="text-white">₹{currentPass.price}.00</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Gateway Taxes:</span>
                  <span className="text-[#28A745]">₹0.00 (Included)</span>
                </div>
                <div className="flex justify-between border-t border-[#262626] pt-2.5 text-sm font-bold">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-[#EB0028]">₹{currentPass.price}.00 INR</span>
                </div>
              </div>
            </div>

            {/* Right Column: Delegate Registration Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-6 sm:p-8 rounded-sm">
                <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#EB0028]">
                      STEP 2: DELEGATE INFORMATION
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      {selectedPass === 'student' ? 'Student Delegate Details' : 'Professional Delegate Details'}
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-[#1A1A1A] text-xs font-mono text-[#8E8E93]">
                    {selectedPass === 'student' ? '11 Required Fields' : '11 Required Fields'}
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3.5 mb-6 bg-[#2B0E0E] border border-[#7A1D1D] rounded-sm text-xs text-[#FFA8A8] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5 text-xs">
                  
                  {/* Row 1: Full Name & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sanjith Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Mobile Number & LinkedIn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                        LinkedIn Profile *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                      />
                    </div>
                  </div>

                  {/* ========================================================
                      STUDENT DELEGATE SPECIFIC FIELDS
                      College Name, Department, Year of Study, Section
                      ======================================================== */}
                  {selectedPass === 'student' && (
                    <>
                      <div>
                        <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                          College Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chennai Institute of Technology"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Department *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Computer Science"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Year of Study *
                          </label>
                          <select
                            required
                            value={yearOfStudy}
                            onChange={(e) => setYearOfStudy(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Section *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. A, B, C or N/A"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* ========================================================
                      PROFESSIONAL DELEGATE SPECIFIC FIELDS
                      Organisation Name, Job Designation, Industry/Domain, Experience Years
                      ======================================================== */}
                  {selectedPass === 'professional' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Organisation Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Google / Infosys / Startup"
                            value={organisationName}
                            onChange={(e) => setOrganisationName(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Job Designation *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Senior Software Engineer"
                            value={jobDesignation}
                            onChange={(e) => setJobDesignation(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Industry / Domain *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Information Technology / Finance"
                            value={industryDomain}
                            onChange={(e) => setIndustryDomain(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                            Years of Professional Experience *
                          </label>
                          <select
                            required
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                            className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                          >
                            <option value="">Select Experience</option>
                            <option value="0 - 2 years">0 - 2 years</option>
                            <option value="3 - 5 years">3 - 5 years</option>
                            <option value="6 - 10 years">6 - 10 years</option>
                            <option value="10+ years">10+ years</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Common Field: Have you attended a TEDx event before? */}
                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                      Have you attended a TEDx event before? *
                    </label>
                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="radio"
                          name="attendedBefore"
                          value="Yes"
                          checked={attendedBefore === 'Yes'}
                          onChange={(e) => setAttendedBefore(e.target.value)}
                          className="accent-[#EB0028] cursor-pointer"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="radio"
                          name="attendedBefore"
                          value="No"
                          checked={attendedBefore === 'No'}
                          onChange={(e) => setAttendedBefore(e.target.value)}
                          className="accent-[#EB0028] cursor-pointer"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {/* Common Field: How did you hear about this event? */}
                  <div>
                    <label className="block text-[#8E8E93] uppercase font-mono tracking-wider mb-1.5">
                      How did you hear about this event? *
                    </label>
                    <select
                      required
                      value={heardAbout}
                      onChange={(e) => setHeardAbout(e.target.value)}
                      className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#EB0028] text-white px-3.5 py-2.5 outline-none rounded-none text-xs transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="Social Media (Instagram / LinkedIn / Twitter)">Social Media (Instagram / LinkedIn / Twitter)</option>
                      <option value="College / University Announcement">College / University Announcement</option>
                      <option value="Friends / Word of Mouth">Friends / Word of Mouth</option>
                      <option value="Campus Posters / Banners">Campus Posters / Banners</option>
                      <option value="Professional Network / Colleagues">Professional Network / Colleagues</option>
                      <option value="TED / TEDx Website">TED / TEDx Website</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Common Field: Declaration Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 p-3.5 bg-[#141414] border border-[#262626] rounded-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={declaration}
                        onChange={(e) => setDeclaration(e.target.checked)}
                        className="mt-0.5 accent-[#EB0028] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs text-[#E5E5EA] leading-relaxed">
                        <strong>Declaration:</strong> I confirm that the information provided is accurate.
                      </span>
                    </label>
                  </div>

                  {/* Payment CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-[#EB0028] hover:bg-[#C80022] disabled:bg-[#551412] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#EB0028]/25"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {isProcessing
                          ? 'Generating Razorpay Order...'
                          : `Proceed to Pay ₹${currentPass.price} via Razorpay`}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Razorpay Trust Footer */}
                <div className="mt-6 pt-4 border-t border-[#1F1F1F] flex flex-col items-center justify-center gap-2 text-[11px] text-[#8E8E93]">
                  <div className="flex items-center gap-1.5 text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#28A745]" />
                    <span>Secured by Razorpay • 256-Bit SSL • PCI-DSS Level 1 Compliant</span>
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

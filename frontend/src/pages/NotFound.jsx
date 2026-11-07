import React, { useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoHome = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-[70vh] bg-[#000000] text-[#F5F5F2] pt-32 pb-20 px-6 flex items-center justify-center font-sans selection:bg-[#EB0028] selection:text-white">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#EB0028]/10 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028] mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#EB0028]">
            404 • UNEXPLORED TERRITORY
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E93] mt-3 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has moved. Explore the TEDxCIT 2027 homepage or register for a delegate pass.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto px-6 py-3 bg-[#EB0028] hover:bg-[#C80022] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return to Home
          </button>
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/register');
              window.dispatchEvent(new Event('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3 border border-[#2B2B2B] hover:border-[#EB0028] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
}


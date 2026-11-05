import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AuditoriumScene } from './AuditoriumScene';
import { audioEngine } from './audioEngine';

export interface CinematicStageProps {
  onComplete: () => void;
}

export const CinematicStage: React.FC<CinematicStageProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneInstanceRef = useRef<AuditoriumScene | null>(null);

  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [phaseName, setPhaseName] = useState<string>('COMPLETE DARKNESS');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [webGLError, setWebGLError] = useState<boolean>(false);

  // Smooth exit transition into home page
  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [isFadingOut, onComplete]);

  // Audio Toggle
  const handleToggleSound = useCallback(() => {
    audioEngine.init();
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Check WebGL availability
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  // Initialize Scene
  useEffect(() => {
    if (!containerRef.current) return;

    if (!checkWebGLSupport()) {
      setWebGLError(true);
      return;
    }

    try {
      const scene = new AuditoriumScene(containerRef.current, {
        onPhaseChange: (phase, name) => {
          setCurrentPhase(phase);
          setPhaseName(name);
        },
        onComplete: () => {
          // When the reveal animation finishes, automatically transition to home page!
          handleFinish();
        },
      });

      sceneInstanceRef.current = scene;

      return () => {
        scene.dispose();
        sceneInstanceRef.current = null;
        audioEngine.dispose();
      };
    } catch (err) {
      console.error('Failed to initialize 3D Auditorium Scene:', err);
      setWebGLError(true);
    }
  }, [checkWebGLSupport, handleFinish]);

  // Keyboard Shortcuts: Space / Enter / Esc immediately skips to home page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleFinish();
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish, handleToggleSound]);

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-screen h-[100svh] overflow-hidden bg-[#000000] text-[#F5F5F2] font-sans select-none transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="3D Auditorium Stage Experience"
      />

      {/* ========================================================
          NON-WEBGL ACCESSIBILITY FALLBACK
          ======================================================== */}
      {webGLError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-6 text-center">
          <div className="max-w-xl border border-[#292929] bg-[#0c0c0e] p-8 sm:p-12">
            <span className="font-black text-4xl text-[#EB0028] tracking-tight block mb-4">TEDx</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F2] mb-3">
              CHENNAI INSTITUTE OF TECHNOLOGY
            </h1>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E8E93] mb-8">
              x = independently organized TED event
            </p>
            <p className="text-sm text-[#A0A0A5] mb-8 leading-relaxed">
              Your browser does not currently support WebGL hardware acceleration.
              Proceeding directly to the main site.
            </p>
            <button
              onClick={handleFinish}
              className="inline-flex items-center space-x-3 border border-[#EB0028] bg-[#EB0028] px-6 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white hover:bg-[#d40023] transition-colors"
            >
              <span>ENTER MAIN SITE</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          CINEMATIC TOP BAR OVERLAY
          ======================================================== */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-6 lg:p-8 pointer-events-none">
        {/* Stage Status Indicator */}
        <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-md px-4 py-1.5 border border-white/10 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A0A0A5]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB0028] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EB0028]" />
          </span>
          <span>AUDITORIUM STAGE / {phaseName}</span>
        </div>

        {/* Right Action Group */}
        <div className="pointer-events-auto flex items-center space-x-2 sm:space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Enable Audio' : 'Mute Audio'}
            className="inline-flex items-center space-x-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#A0A0A5] hover:text-white transition-colors bg-black/40 backdrop-blur-md px-3 py-2 border border-white/10 hover:border-white/30"
            title="Toggle Stage Audio (M)"
          >
            <span>{isMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={handleFinish}
            className="inline-flex items-center space-x-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-white transition-all bg-[#EB0028]/25 hover:bg-[#EB0028] px-4 py-2 border border-[#EB0028] shadow-[0_0_15px_rgba(235,0,40,0.3)]"
            title="Skip Intro to Home Page (Space / Enter)"
          >
            <span>SKIP INTRO</span>
            <span>»</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          BOTTOM AUTO-PROCEED STATUS
          ======================================================== */}
      <footer className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        {currentPhase >= 4 && (
          <div className="pointer-events-auto flex items-center space-x-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#A0A0A5] bg-black/60 backdrop-blur-md px-5 py-2 border border-white/10">
            <span>PROCEEDING TO HOME PAGE...</span>
            <button
              onClick={handleFinish}
              className="text-[#EB0028] hover:text-white font-bold transition-colors ml-2 underline underline-offset-4"
            >
              ENTER NOW →
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default CinematicStage;

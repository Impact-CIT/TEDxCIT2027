'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Augment window object for global access
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export interface SmoothScrollProps {
  enabled?: boolean;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ enabled = true }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize Lenis with tuned spring damping for butter-smooth gliding
    const lenis = new Lenis({
      lerp: 0.085, // Silky, organic deceleration glide without sluggish drag
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: false, // Preserves native fluid momentum on touch and precision trackpads
      infinite: false,
      autoRaf: false, // Synced directly with GSAP's ticker
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // 1. Synchronize Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 2. Drive Lenis updates directly inside GSAP's ticker
    // This guarantees GSAP ScrollTrigger and page scroll occur on the EXACT same frame
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(500, 33); // Smooth out frame drops gracefully without hitching

    // 3. Keep layout measurements accurate on resize & DOM changes
    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Initial refresh after microtask / DOM layout stabilizes
    const timer = setTimeout(handleResize, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, [enabled]);

  return null;
};

export default SmoothScroll;


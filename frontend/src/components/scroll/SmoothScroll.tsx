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

    // Detect touch device
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    // Initialize Lenis with optimized settings for zero-lag responsiveness
    const lenis = new Lenis({
      duration: 1.05, // Responsive easing duration (swift and buttery, not dragging)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: false, // We sync directly with GSAP's ticker to eliminate scroll lag and jitter!
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
    gsap.ticker.lagSmoothing(0); // Critical: prevents jumpy lag-smoothing stutter

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


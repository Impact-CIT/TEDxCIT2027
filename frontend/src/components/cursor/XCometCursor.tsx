'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
  decay: number;
  type: 'dust' | 'smoke' | 'spark';
  color: string;
  rotation?: number;
}

export const XCometCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. Detect touch devices — never hijack or run custom cursor on mobile/touch screens
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    if (isTouchDevice) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Enable custom cursor CSS hiding native arrow on fine pointer devices
    document.body.classList.add('custom-cursor-enabled');

    // 2. High-DPI & Viewport Configuration
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
    };

    onResize();

    // 3. State Coordinates
    // Direct zero-lag position tracking
    const pos = { x: width / 2, y: height / 2 };
    const mouse = { x: width / 2, y: height / 2 };
    const lastPos = { x: width / 2, y: height / 2 };

    let isVisible = false; // Initially false until first mousemove
    let cursorOpacity = 0;
    let isHovering = false;
    let isMouseDown = false;
    let currentScale = 1.0;
    let targetScale = 1.0;

    // Visual State: Starts at 45 degrees so 4-point star forms an iconic "X"
    let currentRotation = Math.PI / 4;

    // Particles array (capped to prevent lag)
    const MAX_PARTICLES = 130;
    const particles: Particle[] = [];

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    // 4. Mouse Listeners
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) {
        isVisible = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        lastPos.x = mouse.x;
        lastPos.y = mouse.y;
      }
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      isHovering = !!target.closest(
        'a, button, input, select, textarea, [role="button"], .cursor-hover, [data-cursor-hover]'
      );
    };

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related) {
        isHovering = false;
      } else {
        isHovering = !!related.closest(
          'a, button, input, select, textarea, [role="button"], .cursor-hover, [data-cursor-hover]'
        );
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      // Burst 8-12 TEDx crimson & gold sparks on click
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = random(2.0, 5.5);
        particles.push({
          x: pos.x,
          y: pos.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1,
          maxLife: 1,
          size: random(1.5, 3.0),
          alpha: 1.0,
          decay: random(0.03, 0.06),
          type: 'spark',
          color: Math.random() > 0.4 ? '255, 43, 37' : '255, 235, 180',
        });
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onWindowLeave = () => {
      isVisible = false;
    };

    const onWindowEnter = () => {
      isVisible = true;
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', checkHover, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onWindowLeave, { passive: true });
    document.documentElement.addEventListener('mouseenter', onWindowEnter, { passive: true });

    // 5. Render Loop (High Performance 60-144 FPS)
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth fade in / out when mouse enters / leaves window
      const targetOpacity = isVisible ? 1 : 0;
      cursorOpacity += (targetOpacity - cursorOpacity) * 0.2;

      // 1. Direct Zero-Lag Position Update
      pos.x = mouse.x;
      pos.y = mouse.y;

      const vx = pos.x - lastPos.x;
      const vy = pos.y - lastPos.y;
      const speed = Math.hypot(vx, vy);

      // 2. Smooth Scale & Rotation (Snappy yet organic)
      targetScale = isMouseDown ? 0.85 : isHovering ? 1.55 : 1.0;
      currentScale += (targetScale - currentScale) * 0.22;

      // Fixed iconic 45° TED "X" angle (reticle orientation)
      currentRotation = Math.PI / 4;

      // 3. Continuous Interpolated Emitters (Zero Gap Trail)
      if (cursorOpacity > 0.1 && (speed > 0.3 || isHovering)) {
        const dist = Math.hypot(vx, vy);
        const steps = Math.min(Math.ceil(dist / 2.5), 12);

        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const activeX = lastPos.x + (pos.x - lastPos.x) * t;
          const activeY = lastPos.y + (pos.y - lastPos.y) * t;

          // A. TEDx Red Embers & Golden Star Dust
          if (Math.random() < 0.65 && particles.length < MAX_PARTICLES) {
            const r = 16 * currentScale;
            const angle = Math.random() * Math.PI * 2;
            const d = Math.random() * r;
            const isRed = Math.random() > 0.35;

            particles.push({
              x: activeX + Math.cos(angle) * d,
              y: activeY + Math.sin(angle) * d,
              vx: (Math.random() - 0.5) * 0.7 - vx * 0.05,
              vy: (Math.random() - 0.5) * 0.7 - vy * 0.05,
              life: 1,
              maxLife: 1,
              size: random(0.8, 2.2),
              alpha: random(0.4, 0.9),
              decay: random(0.016, 0.028), // ~0.7-1.0s life
              type: 'dust',
              color: isRed ? '255, 43, 37' : '255, 236, 179',
            });
          }
        }

        // B. Subtle Ruby Smoke Trail on Fast Movements
        if (speed > 5 && Math.random() < 0.2 && particles.length < MAX_PARTICLES) {
          particles.push({
            x: pos.x + random(-8, 8),
            y: pos.y + random(-8, 8),
            vx: -vx * 0.08 + random(-0.3, 0.3),
            vy: -vy * 0.08 + random(-0.3, 0.3),
            life: 1,
            maxLife: 1,
            size: random(18, 34),
            alpha: 0.1,
            decay: random(0.02, 0.04),
            type: 'smoke',
            color: '180, 25, 25',
          });
        }
      }

      lastPos.x = pos.x;
      lastPos.y = pos.y;

      // 4. Render Ambient Radial Aura (TEDx Red Glow)
      if (cursorOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = cursorOpacity;
        ctx.globalCompositeOperation = 'screen';

        const glowRadius = 38 * currentScale;
        const ambientGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        ambientGrad.addColorStop(0, isHovering ? 'rgba(235, 0, 40, 0.28)' : 'rgba(235, 0, 40, 0.15)');
        ambientGrad.addColorStop(0.5, 'rgba(235, 0, 40, 0.05)');
        ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = ambientGrad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Render & Update Particle Trail
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === 'smoke') {
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          const currentSize = p.size * (1 + (1 - p.life) * 0.8);
          const currentAlpha = p.alpha * p.life;

          const smokeGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize);
          smokeGrad.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
          smokeGrad.addColorStop(1, `rgba(${p.color}, 0)`);

          ctx.fillStyle = smokeGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Dust & Sparks
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha * p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 6. The Signature TEDx "X" Cursor
      if (cursorOpacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = cursorOpacity;
        ctx.globalCompositeOperation = 'source-over';
        ctx.translate(pos.x, pos.y);
        ctx.rotate(currentRotation);
        ctx.scale(currentScale, currentScale);

        const starSize = 13;
        const innerSize = 2.4;

        // Radiant Gradient: Crisp White hot center -> Radiant TEDx Red -> Crimson Edge
        const starGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, starSize);
        starGrad.addColorStop(0, '#FFFFFF');
        starGrad.addColorStop(0.35, '#FFFFFF');
        starGrad.addColorStop(0.65, '#EB0028');
        starGrad.addColorStop(1, '#D80020');

        ctx.fillStyle = starGrad;
        ctx.strokeStyle = 'rgba(255, 235, 220, 0.75)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = isHovering ? 22 : 12;
        ctx.shadowColor = 'rgba(235, 0, 40, 0.9)';

        // 4-Point Faceted Cross rotated at 45° to form the sharp "X"
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(starSize, 0);
          ctx.lineTo(innerSize, innerSize);
          ctx.rotate(Math.PI / 2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // High-precision Center Aim Dot (Pure White)
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', checkHover);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onWindowLeave);
      document.documentElement.removeEventListener('mouseenter', onWindowEnter);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999999,
      }}
      aria-hidden="true"
    />
  );
};

export default XCometCursor;


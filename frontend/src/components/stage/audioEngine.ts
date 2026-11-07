/**
 * Theatrical Audio Synthesizer for TEDx Chennai Institute of Technology Cinematic Stage.
 * Built using the Web Audio API with zero external audio assets.
 * 
 * Provides:
 * - Ultra-deep cavernous auditorium room tone (sub-bass resonant air)
 * - Theatrical spotlight ignition relay clicks & lamp ballast surge sizzle
 * - Cinematic sub-harmonic reveal swell
 */

class StageAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Start subtle ambient room tone
      this.startRoomTone();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked by browser policy:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cavernous auditorium room resonance: low-frequency rumble & air-con draft
   */
  private startRoomTone() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // Create 2 seconds of pink/brownish noise buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.ambientNoiseSource = this.ctx.createBufferSource();
      this.ambientNoiseSource.buffer = noiseBuffer;
      this.ambientNoiseSource.loop = true;

      // Resonant deep lowpass filter (auditorium body resonance around 52Hz)
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(65, this.ctx.currentTime);
      lowpass.Q.setValueAtTime(4.0, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

      this.ambientNoiseSource.connect(lowpass);
      lowpass.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.ambientNoiseSource.start();
    } catch {
      // Ignore if autoplay prevented
    }
  }

  /**
   * Heavy mechanical relay switch + lamp arc ignition surge
   */
  public playSpotlightIgnition() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Mechanical contactor 'CLACK' (quick pitch drop impulse)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(650, now);
      clickOsc.frequency.exponentialRampToValueAtTime(75, now + 0.04);

      clickGain.gain.setValueAtTime(0.28, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      clickOsc.connect(clickGain);
      clickGain.connect(this.masterGain);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      // 2. High-power transformer electrical hum (120Hz + 240Hz harmonics)
      const humOsc = this.ctx.createOscillator();
      const humGain = this.ctx.createGain();
      humOsc.type = 'sawtooth';
      humOsc.frequency.setValueAtTime(118, now + 0.01);
      humOsc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

      const humFilter = this.ctx.createBiquadFilter();
      humFilter.type = 'bandpass';
      humFilter.frequency.setValueAtTime(240, now);
      humFilter.Q.setValueAtTime(3.5, now);

      humGain.gain.setValueAtTime(0.001, now);
      humGain.gain.linearRampToValueAtTime(0.22, now + 0.03);
      humGain.gain.exponentialRampToValueAtTime(0.02, now + 0.55);
      humGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

      humOsc.connect(humFilter);
      humFilter.connect(humGain);
      humGain.connect(this.masterGain);

      humOsc.start(now);
      humOsc.stop(now + 1.25);
    } catch {
      // Audio node failure fallback
    }
  }

  /**
   * Cinematic deep sub-harmonic swell when the spotlights converge on the TEDx identity
   */
  public playRevealSwell() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 3.5;

      // Sub-harmonic oscillator (F1 ~ 43.65 Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(43.65, now);
      subOsc.frequency.linearRampToValueAtTime(46.25, now + duration);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.exponentialRampToValueAtTime(0.35, now + 1.2);
      subGain.gain.linearRampToValueAtTime(0.18, now + duration - 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.masterGain);

      subOsc.start(now);
      subOsc.stop(now + duration);

      // Overtone chord shimmer (warm cinematic brass/pad tone)
      const shimmerOsc = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(130.81, now); // C3

      const shimmerFilter = this.ctx.createBiquadFilter();
      shimmerFilter.type = 'lowpass';
      shimmerFilter.frequency.setValueAtTime(220, now);
      shimmerFilter.frequency.linearRampToValueAtTime(680, now + 2.0);

      shimmerGain.gain.setValueAtTime(0.001, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.14, now + 1.5);
      shimmerGain.gain.linearRampToValueAtTime(0.001, now + duration);

      shimmerOsc.connect(shimmerFilter);
      shimmerFilter.connect(shimmerGain);
      shimmerGain.connect(this.masterGain);

      shimmerOsc.start(now);
      shimmerOsc.stop(now + duration);
    } catch {
      // Audio node failure fallback
    }
  }

  public dispose() {
    try {
      if (this.ambientNoiseSource) {
        this.ambientNoiseSource.stop();
        this.ambientNoiseSource.disconnect();
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
    } catch {
      // Silent dispose
    }
    this.ctx = null;
    this.isInitialized = false;
  }
}

export const audioEngine = new StageAudioEngine();


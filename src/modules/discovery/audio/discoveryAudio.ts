/**
 * ORBIT ACADEMY — DISCOVERY AUDIO & LAURA SPEECH SYNTHESIS ENGINE
 * Web Audio API synthesizer for spacecraft SFX + Web Speech API for Laura narration.
 */

class DiscoveryAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isSfxMuted: boolean = false;
  private isVoiceMuted: boolean = false;
  private speechRate: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural pleasant English voices for LAURA
    const preferred = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Female')))
    ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];
    
    if (preferred) {
      this.selectedVoice = preferred;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // ---------------------------------------------------------------------------
  // 1. PROCEDURAL SPACECRAFT SOUND SYNTHESIS (Web Audio API)
  // ---------------------------------------------------------------------------

  /**
   * Spacecraft Engine Ignition Rumble
   */
  public playIgnitionRumble() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);
      filter.frequency.linearRampToValueAtTime(320, now + 1.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch {}
  }

  /**
   * Spacecraft Thruster Burn Pulse
   */
  public playThrusterBoost() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.exponentialRampToValueAtTime(260, now + 1.2);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(60, now);
      osc2.frequency.linearRampToValueAtTime(140, now + 1.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.6);
      osc2.stop(now + 1.6);
    } catch {}
  }

  /**
   * Telemetry confirmation chime (tactile HUD feedback)
   */
  public playTelemetryChime(pitch: number = 880) {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  /**
   * Orbit insertion retro-thruster braking sound
   */
  public playOrbitInsertion() {
    if (this.isSfxMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 1.5);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // 2. LAURA SPEECH SYNTHESIS & NARRATION (Web Speech API)
  // ---------------------------------------------------------------------------

  public speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
      onBoundary?: (charIndex: number) => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      callbacks?.onEnd?.();
      return;
    }

    this.stopSpeech();

    if (this.isVoiceMuted) {
      callbacks?.onEnd?.();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.speechRate;
      utterance.pitch = 1.05; // Slightly warm friendly pitch for LAURA

      utterance.onstart = () => {
        this.playTelemetryChime(980);
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        callbacks?.onError?.(e);
      };

      utterance.onboundary = (e) => {
        if (e.name === 'word' || e.name === 'sentence') {
          callbacks?.onBoundary?.(e.charIndex);
        }
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      callbacks?.onError?.(err);
    }
  }

  public pauseSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resumeSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public setSpeechRate(rate: number) {
    this.speechRate = rate;
  }

  public toggleVoiceMute(): boolean {
    this.isVoiceMuted = !this.isVoiceMuted;
    if (this.isVoiceMuted) {
      this.stopSpeech();
    }
    return this.isVoiceMuted;
  }

  public toggleSfxMute(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    return this.isSfxMuted;
  }

  public getIsVoiceMuted(): boolean {
    return this.isVoiceMuted;
  }

  public getIsSfxMuted(): boolean {
    return this.isSfxMuted;
  }

  public getSpeechRate(): number {
    return this.speechRate;
  }

  public isSpeaking(): boolean {
    return this.currentUtterance !== null;
  }
}

export const discoveryAudio = new DiscoveryAudioEngine();

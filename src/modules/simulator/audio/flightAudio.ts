/**
 * ORBIT ACADEMY — FLIGHT SIMULATOR AUDIO SYNTHESIZER
 * Pure Web Audio API synthesized procedural spaceflight sound design:
 * - Throttle-responsive rocket engine roar & rumble
 * - Pressurized RCS cold-gas attitude burst hiss
 * - Atmospheric entry rushing wind
 * - Master caution alarm beeps
 * - Docking capture latch & surface touchdown thump
 */

class FlightAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Continuous Engine Sound Nodes
  private engineNoiseNode: AudioBufferSourceNode | null = null;
  private engineFilterNode: BiquadFilterNode | null = null;
  private engineGainNode: GainNode | null = null;
  private engineRumbleOsc: OscillatorNode | null = null;
  private engineRumbleGain: GainNode | null = null;
  private isEngineRunning: boolean = false;

  // Continuous Wind Sound Nodes
  private windNoiseNode: AudioBufferSourceNode | null = null;
  private windFilterNode: BiquadFilterNode | null = null;
  private windGainNode: GainNode | null = null;
  private isWindRunning: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orbit_audio_master_muted') ?? localStorage.getItem('orbit_flight_audio_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }

      window.addEventListener('orbit-master-audio-toggled', (e: Event) => {
        const detail = (e as CustomEvent<{ muted: boolean }>).detail;
        if (detail && typeof detail.muted === 'boolean') {
          this.setMuted(detail.muted);
        }
      });
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_flight_audio_muted', String(muted));
    }
    if (muted) {
      this.stopContinuousSounds();
    }
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Subtle tactical button select tick
   */
  public playClick(freq = 880) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  private createPinkNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  /**
   * Continuous Rocket Engine Roar (Dynamically modulated by throttle: 0.0 to 1.0)
   */
  public updateEngineSound(throttle: number, engineIgnited: boolean) {
    if (this.isMuted || !engineIgnited || throttle <= 0.01) {
      if (this.isEngineRunning) {
        this.stopEngineSound();
      }
      return;
    }

    const ctx = this.initCtx();
    if (!ctx) return;

    if (!this.isEngineRunning) {
      try {
        const noiseBuf = this.createPinkNoiseBuffer(ctx, 3);
        this.engineNoiseNode = ctx.createBufferSource();
        this.engineNoiseNode.buffer = noiseBuf;
        this.engineNoiseNode.loop = true;

        this.engineFilterNode = ctx.createBiquadFilter();
        this.engineFilterNode.type = 'lowpass';
        this.engineFilterNode.frequency.value = 180 + throttle * 450;

        this.engineGainNode = ctx.createGain();
        this.engineGainNode.gain.value = Math.min(0.28, throttle * 0.28);

        this.engineNoiseNode.connect(this.engineFilterNode);
        this.engineFilterNode.connect(this.engineGainNode);
        this.engineGainNode.connect(ctx.destination);
        this.engineNoiseNode.start();

        // Sub-bass rumble oscillator
        this.engineRumbleOsc = ctx.createOscillator();
        this.engineRumbleOsc.type = 'sawtooth';
        this.engineRumbleOsc.frequency.value = 42 + throttle * 30;

        this.engineRumbleGain = ctx.createGain();
        this.engineRumbleGain.gain.value = Math.min(0.14, throttle * 0.14);

        this.engineRumbleOsc.connect(this.engineRumbleGain);
        this.engineRumbleGain.connect(ctx.destination);
        this.engineRumbleOsc.start();

        this.isEngineRunning = true;
      } catch {
        this.isEngineRunning = false;
      }
    } else {
      // Modulate running nodes smoothly
      const now = ctx.currentTime;
      if (this.engineFilterNode) {
        this.engineFilterNode.frequency.setTargetAtTime(180 + throttle * 550, now, 0.08);
      }
      if (this.engineGainNode) {
        this.engineGainNode.gain.setTargetAtTime(Math.min(0.28, throttle * 0.28), now, 0.08);
      }
      if (this.engineRumbleOsc) {
        this.engineRumbleOsc.frequency.setTargetAtTime(42 + throttle * 32, now, 0.08);
      }
      if (this.engineRumbleGain) {
        this.engineRumbleGain.gain.setTargetAtTime(Math.min(0.14, throttle * 0.14), now, 0.08);
      }
    }
  }

  public stopEngineSound() {
    try {
      if (this.engineNoiseNode) {
        this.engineNoiseNode.stop();
        this.engineNoiseNode.disconnect();
        this.engineNoiseNode = null;
      }
      if (this.engineRumbleOsc) {
        this.engineRumbleOsc.stop();
        this.engineRumbleOsc.disconnect();
        this.engineRumbleOsc = null;
      }
    } catch {}
    this.isEngineRunning = false;
  }

  /**
   * Atmospheric Rushing Wind Sound (Modulated by dynamic pressure / velocity)
   */
  public updateAtmosphericWind(dynamicPressureKPa: number) {
    if (this.isMuted || dynamicPressureKPa <= 0.2) {
      if (this.isWindRunning) {
        this.stopWindSound();
      }
      return;
    }

    const ctx = this.initCtx();
    if (!ctx) return;

    const normalizedQ = Math.min(1.0, dynamicPressureKPa / 45); // Max out around 45 kPa

    if (!this.isWindRunning) {
      try {
        const noiseBuf = this.createPinkNoiseBuffer(ctx, 2);
        this.windNoiseNode = ctx.createBufferSource();
        this.windNoiseNode.buffer = noiseBuf;
        this.windNoiseNode.loop = true;

        this.windFilterNode = ctx.createBiquadFilter();
        this.windFilterNode.type = 'bandpass';
        this.windFilterNode.frequency.value = 400 + normalizedQ * 800;
        this.windFilterNode.Q.value = 1.2;

        this.windGainNode = ctx.createGain();
        this.windGainNode.gain.value = normalizedQ * 0.15;

        this.windNoiseNode.connect(this.windFilterNode);
        this.windFilterNode.connect(this.windGainNode);
        this.windGainNode.connect(ctx.destination);
        this.windNoiseNode.start();

        this.isWindRunning = true;
      } catch {
        this.isWindRunning = false;
      }
    } else {
      const now = ctx.currentTime;
      if (this.windFilterNode) {
        this.windFilterNode.frequency.setTargetAtTime(400 + normalizedQ * 800, now, 0.1);
      }
      if (this.windGainNode) {
        this.windGainNode.gain.setTargetAtTime(normalizedQ * 0.15, now, 0.1);
      }
    }
  }

  public stopWindSound() {
    try {
      if (this.windNoiseNode) {
        this.windNoiseNode.stop();
        this.windNoiseNode.disconnect();
        this.windNoiseNode = null;
      }
    } catch {}
    this.isWindRunning = false;
  }

  public stopContinuousSounds() {
    this.stopEngineSound();
    this.stopWindSound();
  }

  /**
   * Quick Pressurized RCS Burst Hiss (Attitude translation)
   */
  public playRcsBurst() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const duration = 0.08;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {}
  }

  /**
   * Master Caution / Danger Warning Dual Tone Beep
   */
  public playMasterCaution() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1050, now + 0.12);
      osc.frequency.setValueAtTime(800, now + 0.24);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  /**
   * Docking Soft Capture Metallic Clink & Lock
   */
  public playDockingCapture() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  /**
   * Touchdown Thump on Regolith / Ground
   */
  public playTouchdownThump(safe = true) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(safe ? 110 : 80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

      gain.gain.setValueAtTime(safe ? 0.25 : 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  /**
   * Mission Victory Chime
   */
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.46);
      });
    } catch {}
  }
}

export const flightAudio = new FlightAudioSynthesizer();

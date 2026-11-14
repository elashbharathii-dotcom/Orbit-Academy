/**
 * Procedural Web Audio Synthesizer for Mars Survival
 * Uses Web Audio API oscillator & noise synthesis without requiring external audio files.
 */

class MarsAudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private breathingTimer: number | null = null;
  private alarmOsc: OscillatorNode | null = null;
  private alarmGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.startAmbientWind();
      this.startBreathingLoop();
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }
    if (this.windGain) {
      this.windGain.gain.value = muted ? 0 : 0.08;
    }
  }

  private startAmbientWind() {
    if (!this.ctx) return;

    // Generate 4 seconds of noise buffer for looping wind
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.2;
      output[i] = (b0 + b1 + b2) * 0.4;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 240;
    this.windFilter.Q.value = 1.8;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = this.isMuted ? 0 : 0.08;

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.ctx.destination);
    whiteNoise.start();
  }

  public updateWindIntensity(stormIntensity: number) {
    if (!this.windFilter || !this.windGain || this.isMuted) return;
    // Storm raises wind filter frequency and volume
    const targetFreq = 220 + stormIntensity * 450;
    const targetVol = 0.08 + stormIntensity * 0.18;
    this.windFilter.frequency.setTargetAtTime(targetFreq, this.ctx?.currentTime || 0, 0.5);
    this.windGain.gain.setTargetAtTime(targetVol, this.ctx?.currentTime || 0, 0.5);
  }

  private startBreathingLoop() {
    if (this.breathingTimer) return;
    // Cyclical breathing sound every 4.5 seconds
    this.breathingTimer = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      this.playBreathingSound();
    }, 4500);
  }

  private playBreathingSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(70, now + 1.8);

    filter.type = 'lowpass';
    filter.frequency.value = 280;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  public playJumpThrust() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playDrillHarvest() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Drill harmonic tone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(420, now);
    osc1.frequency.linearRampToValueAtTime(580, now + 0.5);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(840, now);
    osc2.frequency.linearRampToValueAtTime(1160, now + 0.5);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);

    // Chime upon collection complete
    setTimeout(() => {
      this.playChime(880);
      setTimeout(() => this.playChime(1320), 100);
    }, 550);
  }

  public playChime(freq = 880) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playAirlockCycle() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Airlock pressurization hiss
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(660, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.3);

    setTimeout(() => this.playChime(1046.5), 1400); // High C chime
  }

  public playGeigerTick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  public playWarningBuzzer() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.setValueAtTime(180, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playAlarm() {
    this.playWarningBuzzer();
  }

  public triggerCriticalAlarm(enable: boolean) {
    if (!this.ctx || this.isMuted) {
      if (this.alarmOsc) {
        this.alarmOsc.stop();
        this.alarmOsc = null;
      }
      return;
    }

    if (enable && !this.alarmOsc) {
      const now = this.ctx.currentTime;
      this.alarmOsc = this.ctx.createOscillator();
      this.alarmGain = this.ctx.createGain();

      this.alarmOsc.type = 'square';
      this.alarmOsc.frequency.setValueAtTime(900, now);

      this.alarmGain.gain.setValueAtTime(0.06, now);

      this.alarmOsc.connect(this.alarmGain);
      this.alarmGain.connect(this.ctx.destination);
      this.alarmOsc.start();
    } else if (!enable && this.alarmOsc) {
      this.alarmOsc.stop();
      this.alarmOsc = null;
    }
  }

  public cleanup() {
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
    }
    if (this.alarmOsc) {
      this.alarmOsc.stop();
      this.alarmOsc = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioSystem = new MarsAudioSystem();

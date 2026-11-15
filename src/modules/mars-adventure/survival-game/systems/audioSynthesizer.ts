/**
 * Procedural Web Audio Synthesizer for Mars Survival
 * Real-time synthesis of atmospheric wind, spacesuit servos, footsteps, rover traction motors,
 * scanners, life-support alarms, and cinematic notifications.
 */

class MarsAudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private breathingTimer: number | null = null;
  private alarmOsc: OscillatorNode | null = null;
  private alarmGain: GainNode | null = null;

  // Continuous Rover Engine Motor Synth
  private roverMotorOsc: OscillatorNode | null = null;
  private roverMotorGain: GainNode | null = null;

  // Continuous Visor Scanner Synth
  private scannerOsc: OscillatorNode | null = null;
  private scannerGain: GainNode | null = null;

  // Master & Channel Volume Controls
  private masterGain: GainNode | null = null;
  private masterVolume: number = 1.0;
  private effectsVolume: number = 0.9;
  private musicVolume: number = 0.7;

  // Footstep throttle timer to prevent overlapping click spikes
  private lastFootstepTime = 0;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.connect(this.ctx.destination);
      this.startAmbientWind();
      this.startBreathingLoop();
      this.initRoverMotor();
    } catch {
      // AudioContext blocked by browser autoplay policy until user gesture
    }
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public setEffectsVolume(val: number) {
    this.effectsVolume = Math.max(0, Math.min(1, val));
  }

  public getEffectsVolume(): number {
    return this.effectsVolume;
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  private ensureContext() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended' && !this.isMuted) {
      this.ctx.resume();
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
    if (this.roverMotorGain && muted) {
      this.roverMotorGain.gain.value = 0;
    }
    if (this.scannerGain && muted) {
      this.scannerGain.gain.value = 0;
    }
  }

  private startAmbientWind() {
    if (!this.ctx) return;

    // Generate 4 seconds of pink/red noise buffer for looping wind
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
    const now = this.ctx?.currentTime || 0;
    const targetFreq = 220 + stormIntensity * 450;
    const targetVol = 0.08 + stormIntensity * 0.22;
    this.windFilter.frequency.setTargetAtTime(targetFreq, now, 0.4);
    this.windGain.gain.setTargetAtTime(targetVol, now, 0.4);
  }

  private startBreathingLoop() {
    if (this.breathingTimer) return;
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
    gain.gain.linearRampToValueAtTime(0.032, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.001, now + 1.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  // ---------------- FOOTSTEP PROCEDURAL SYNTHESIS ----------------
  public playFootstep(surface: 'regolith' | 'metal' = 'regolith', isSprint = false) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    if (now - this.lastFootstepTime < 0.18) return; // Debounce
    this.lastFootstepTime = now;

    if (surface === 'regolith') {
      // Crunchy Martian regolith soil step (Bandpassed noise + soft low-frequency thud)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isSprint ? 380 : 280, now);
      filter.Q.value = 1.4;

      const gain = this.ctx.createGain();
      const vol = isSprint ? 0.08 : 0.055;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } else {
      // Metallic outpost interior flooring step
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSprint ? 260 : 220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(isSprint ? 0.09 : 0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  // ---------------- SUIT SERVO PROCEDURAL SOUND ----------------
  public playSuitServo(type: 'jump' | 'land' | 'step' | 'interact' | 'collect' = 'jump') {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    if (type === 'jump') {
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    } else if (type === 'land') {
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.22);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    } else if (type === 'interact') {
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    } else if (type === 'collect') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(340, now + 0.18);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(720, now + 0.08);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    }

    const duration = type === 'land' ? 0.22 : type === 'collect' ? 0.18 : 0.12;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  // ---------------- CONTINUOUS ROVER ELECTRIC MOTOR ----------------
  private initRoverMotor() {
    if (!this.ctx) return;
    try {
      this.roverMotorOsc = this.ctx.createOscillator();
      this.roverMotorOsc.type = 'triangle';
      this.roverMotorOsc.frequency.value = 65; // Idle electric hum

      this.roverMotorGain = this.ctx.createGain();
      this.roverMotorGain.gain.value = 0; // Off until driving

      this.roverMotorOsc.connect(this.roverMotorGain);
      this.roverMotorGain.connect(this.ctx.destination);
      this.roverMotorOsc.start();
    } catch {
      // Wait for user gesture
    }
  }

  public updateRoverAudio(speedKmH: number, isBraking: boolean) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    if (!this.roverMotorOsc) {
      this.initRoverMotor();
    }

    const now = this.ctx.currentTime;
    const speedRatio = Math.min(1.0, speedKmH / 35.0);

    if (this.roverMotorOsc && this.roverMotorGain) {
      if (speedKmH > 0.5) {
        // Frequency shifts from 70Hz up to 260Hz with throttle
        const targetFreq = 70 + speedRatio * 190;
        const targetGain = 0.035 + speedRatio * 0.065;
        this.roverMotorOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);
        this.roverMotorGain.gain.setTargetAtTime(targetGain, now, 0.1);
      } else {
        this.roverMotorGain.gain.setTargetAtTime(0, now, 0.2);
      }
    }

    // Play brake friction squeal if braking hard at speed
    if (isBraking && speedKmH > 8.0) {
      this.playRoverBrake();
    }
  }

  public playRoverBrake() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.14);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // ---------------- VISOR SCANNER AUDIO ----------------
  public setScannerAudio(active: boolean) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    if (active) {
      if (!this.scannerOsc) {
        this.scannerOsc = this.ctx.createOscillator();
        this.scannerOsc.type = 'sine';
        this.scannerOsc.frequency.setValueAtTime(1100, now);

        this.scannerGain = this.ctx.createGain();
        this.scannerGain.gain.setValueAtTime(0.001, now);
        this.scannerGain.gain.linearRampToValueAtTime(0.045, now + 0.15);

        this.scannerOsc.connect(this.scannerGain);
        this.scannerGain.connect(this.ctx.destination);
        this.scannerOsc.start(now);
      }
    } else if (this.scannerOsc && this.scannerGain) {
      this.scannerGain.gain.setValueAtTime(this.scannerGain.gain.value, now);
      this.scannerGain.gain.linearRampToValueAtTime(0.0001, now + 0.15);
      setTimeout(() => {
        if (this.scannerOsc) {
          this.scannerOsc.stop();
          this.scannerOsc = null;
        }
      }, 160);
    }
  }

  // ---------------- CINEMATIC FANFARES & NOTIFICATIONS ----------------
  public playFacilityUpgradeFanfare() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    // Ascending major chord fanfare: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq);
      }, i * 90);
    });
  }

  public playMissionComplete() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq);
      }, i * 110);
    });
  }

  // ---------------- STORYTELLING & CAMPAIGN NARRATIVE AUDIO ----------------
  public playCommBeep() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1800, now + 0.05);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playRadioTransmission() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    noise.connect(filter);
    filter.connect(this.ctx.destination);
    noise.start(now);

    setTimeout(() => {
      this.playCommBeep();
    }, 120);
  }

  public playChapterFanfare() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq);
      }, i * 130);
    });
  }

  // ---------------- EXISTING SIGNATURES (PRESERVED) ----------------
  public playJumpThrust() {
    this.playSuitServo('jump');
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

    setTimeout(() => this.playChime(1046.5), 1400);
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
    if (this.roverMotorOsc) {
      this.roverMotorOsc.stop();
      this.roverMotorOsc = null;
    }
    if (this.scannerOsc) {
      this.scannerOsc.stop();
      this.scannerOsc = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioSystem = new MarsAudioSystem();

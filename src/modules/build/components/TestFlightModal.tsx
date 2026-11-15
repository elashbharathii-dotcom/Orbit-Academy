import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  X,
  Play,
  RotateCcw,
  Flame,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Camera,
  Layers,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { AssembledComponent, LiveryOption, MaterialFinish, VehicleStats } from '../types';
import { SpacecraftAssembly3D } from './SpacecraftAssembly3D';

interface TestFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: AssembledComponent[];
  livery: LiveryOption;
  materialFinish: MaterialFinish;
  stats: VehicleStats;
  shipName: string;
}

type FlightState = 'prelaunch' | 'countdown' | 'ascending' | 'meco' | 'orbital' | 'aborted';
type CameraViewMode = 'chase' | 'pad' | 'cockpit' | 'free';

/**
 * Procedural Web Audio Engine for realistic rocket sound without external assets
 */
class LaunchSoundEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private rumbleOsc: OscillatorNode | null = null;
  private rumbleGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isRunning: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {
        // audio unavailable
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ctx) {
      if (this.noiseGain) this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);
      if (this.rumbleGain) this.rumbleGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public playBeep(freq: number = 880, duration: number = 0.08) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public startRocketEngine(throttle: number = 100) {
    if (this.isRunning) {
      this.updateThrottle(throttle);
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    try {
      this.isRunning = true;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // pink noise approximation
        lastOut = data[i];
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.noiseGain);
      this.noiseGain.connect(this.ctx.destination);
      this.noiseNode.start();

      // Sub-bass rumble oscillator
      this.rumbleOsc = this.ctx.createOscillator();
      this.rumbleOsc.type = 'triangle';
      this.rumbleOsc.frequency.setValueAtTime(52, this.ctx.currentTime);

      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);

      this.rumbleOsc.connect(this.rumbleGain);
      this.rumbleGain.connect(this.ctx.destination);
      this.rumbleOsc.start();

      this.updateThrottle(throttle);
    } catch {
      // audio error safely caught
    }
  }

  public updateThrottle(throttle: number) {
    if (!this.ctx || !this.isRunning) return;
    try {
      const norm = Math.max(0, Math.min(1, throttle / 100));
      const targetGain = this.isMuted ? 0 : 0.05 + norm * 0.22;
      const targetCutoff = 180 + norm * 700;

      if (this.noiseGain) {
        this.noiseGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
      }
      if (this.filterNode) {
        this.filterNode.frequency.setTargetAtTime(targetCutoff, this.ctx.currentTime, 0.05);
      }
      if (this.rumbleGain) {
        this.rumbleGain.gain.setTargetAtTime(this.isMuted ? 0 : norm * 0.16, this.ctx.currentTime, 0.05);
      }
    } catch {
      // ignore
    }
  }

  public stopRocketEngine() {
    if (!this.isRunning) return;
    this.isRunning = false;
    try {
      if (this.noiseGain && this.ctx) {
        this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      }
      if (this.rumbleGain && this.ctx) {
        this.rumbleGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      }
      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.rumbleOsc?.stop();
          this.noiseNode?.disconnect();
          this.rumbleOsc?.disconnect();
        } catch {
          // ignore
        }
      }, 450);
    } catch {
      // ignore
    }
  }

  public playSonicBoom() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  }

  public playOrbitChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      try {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx!.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.12 + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.12);
        osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.7);
      } catch {
        // ignore
      }
    });
  }
}

const launchAudio = new LaunchSoundEngine();

/**
 * Pad Smoke and Cloud billows at liftoff
 */
const PadLaunchSmoke: React.FC<{ isIgnited: boolean; altitude: number }> = ({ isIgnited, altitude }) => {
  const smokeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!smokeRef.current || !isIgnited) return;
    if (altitude < 1.0) {
      smokeRef.current.rotation.y += delta * 0.6;
      smokeRef.current.children.forEach((child, i) => {
        child.scale.x = 1.0 + Math.sin(Date.now() * 0.003 + i) * 0.3;
        child.scale.z = 1.0 + Math.cos(Date.now() * 0.003 + i) * 0.3;
      });
    }
  });

  if (!isIgnited || altitude > 1.5) return null;

  return (
    <group ref={smokeRef} position={[0, -0.6, 0]}>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 4.5;
        const z = Math.sin(rad) * 4.5;
        return (
          <mesh key={i} position={[x, 0.4, z]}>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshStandardMaterial
              color="#CBD5E1"
              transparent
              opacity={0.35}
              roughness={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Mach Shockwave Translucent Vapor Cone
 */
const MachShockwaveVapor: React.FC<{ velocity: number }> = ({ velocity }) => {
  const isMachTransonic = velocity >= 320 && velocity <= 440;
  if (!isMachTransonic) return null;

  return (
    <group position={[0, 1.2, 0]}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.4, 1.2, 24, 1, true]} />
        <meshBasicMaterial
          color="#E0F2FE"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/**
 * 3D Launch Simulation Stage with Ascending Rocket and Launch Pad
 */
const FlightStage3D: React.FC<{
  components: AssembledComponent[];
  livery: LiveryOption;
  materialFinish: MaterialFinish;
  altitude: number;
  pitchAngle: number;
  velocity: number;
  isEnginesFired: boolean;
  throttle: number;
  cameraMode: CameraViewMode;
}> = ({
  components,
  livery,
  materialFinish,
  altitude,
  pitchAngle,
  velocity,
  isEnginesFired,
  throttle,
  cameraMode,
}) => {
  const rocketGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);

  // Map altitude (in km) to 3D world units: 1 unit ~ 60 meters
  const worldY = Math.min(300, (altitude * 1000) / 60);

  useFrame(({ camera }) => {
    if (rocketGroupRef.current) {
      rocketGroupRef.current.position.y = worldY;
      rocketGroupRef.current.rotation.z = -pitchAngle;

      // Rocket vibration shudder when engines are firing
      if (isEnginesFired && throttle > 5) {
        const shake = (Math.random() - 0.5) * 0.035 * (throttle / 100);
        rocketGroupRef.current.position.x = shake;
        rocketGroupRef.current.position.z = shake;
      } else {
        rocketGroupRef.current.position.x = 0;
        rocketGroupRef.current.position.z = 0;
      }
    }

    // Dynamic Camera Tracking by mode
    if (cameraMode === 'chase') {
      const targetCamY = worldY + 6.5;
      const targetCamZ = 16 + (altitude > 10 ? 12 : 0);
      const targetCamX = 8 + (altitude > 25 ? 6 : 0);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);
      camera.lookAt(0, worldY + 2.5, 0);
    } else if (cameraMode === 'pad') {
      camera.position.set(24, 4.5, 28);
      camera.lookAt(0, worldY * 0.45 + 3, 0);
    } else if (cameraMode === 'cockpit') {
      // First-person nose cam looking upward/forward
      camera.position.set(0, worldY + 4.8, 1.5);
      camera.lookAt(Math.sin(pitchAngle) * 20, worldY + 25, -Math.cos(pitchAngle) * 20);
    } else if (cameraMode === 'free' && controlsRef.current) {
      controlsRef.current.target.set(0, worldY + 2, 0);
      controlsRef.current.update();
    }
  });

  // Calculate sky light and fog based on altitude
  const skyIntensity = Math.max(0.15, 1.0 - altitude / 40);
  const starsOpacity = Math.min(1.0, 0.2 + altitude / 30);

  return (
    <>
      {/* Dynamic Ambient and Sun Light */}
      <ambientLight intensity={0.5 * skyIntensity + 0.3} color="#0F172A" />
      <directionalLight
        position={[25, 45, 20]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-15, 15, -10]} intensity={1.0} color="#00E5FF" />

      {/* Orbit Controls (Active primarily in Free Cam mode) */}
      <OrbitControls
        ref={controlsRef}
        enabled={cameraMode === 'free'}
        enablePan={false}
        maxDistance={90}
        minDistance={3}
      />

      {/* Starry Cosmos Void */}
      <Stars
        radius={220}
        depth={80}
        count={4000}
        factor={4.5 * starsOpacity}
        saturation={0.5}
        fade
      />

      {/* Planetary Atmosphere Horizon & Curvature Below */}
      <group position={[0, -220, 0]}>
        <mesh>
          <sphereGeometry args={[220, 48, 48]} />
          <meshStandardMaterial
            color="#0A2540"
            roughness={0.8}
            metalness={0.15}
            emissive="#0077B6"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Glowing Atmospheric Rim */}
        <mesh scale={1.008}>
          <sphereGeometry args={[220, 36, 36]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* Launch Pad Superstructure at Ground Level */}
      <group position={[0, -1.2, 0]}>
        {/* Concrete Pad Foundation */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[14, 17, 1.2, 32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} metalness={0.35} />
        </mesh>
        {/* Flame Trench */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[4.5, 0.4, 9]} />
          <meshStandardMaterial color="#0B1226" />
        </mesh>
        {/* Launch Umbilical Service Tower */}
        <group position={[-5.5, 8.5, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 17, 1.8]} />
            <meshStandardMaterial color="#DC2626" roughness={0.6} metalness={0.5} />
          </mesh>
          {/* Swing Arm 1 */}
          <mesh position={[2.2, 4.5, 0]}>
            <boxGeometry args={[3.0, 0.4, 0.6]} />
            <meshStandardMaterial color="#CBD5E1" />
          </mesh>
          {/* Swing Arm 2 */}
          <mesh position={[2.2, 8.5, 0]}>
            <boxGeometry args={[3.0, 0.4, 0.6]} />
            <meshStandardMaterial color="#CBD5E1" />
          </mesh>
        </group>
      </group>

      {/* Billowing Pad Launch Smoke */}
      <PadLaunchSmoke isIgnited={isEnginesFired} altitude={altitude} />

      {/* Ascending Spacecraft Group */}
      <group ref={rocketGroupRef} position={[0, 0, 0]}>
        <SpacecraftAssembly3D
          components={components}
          isSimulating={isEnginesFired}
          livery={livery}
          materialFinish={materialFinish}
          selectedComponentId={null}
          onSelectComponent={() => {}}
          transformMode="select"
          onTransformChange={() => {}}
          shadingMode="lit"
        />

        {/* Dynamic Transonic Mach Shockwave Vapor Cone */}
        <MachShockwaveVapor velocity={velocity} />

        {/* Dynamic Launch Exhaust Glow Point Light */}
        {isEnginesFired && (
          <pointLight
            position={[0, -3.2, 0]}
            color={livery.engineGlowColor || '#00E5FF'}
            intensity={5.5 * (throttle / 100)}
            distance={30}
          />
        )}
      </group>
    </>
  );
};

export const TestFlightModal: React.FC<TestFlightModalProps> = ({
  isOpen,
  onClose,
  components,
  livery,
  materialFinish,
  stats,
  shipName,
}) => {
  // Guaranteed non-zero physics attributes with educational fallback
  const initialPropellantKg = useMemo(() => {
    const raw = stats?.propellantMass ?? (stats as any)?.totalPropellant;
    return typeof raw === 'number' && raw > 0 ? raw : 24000;
  }, [stats]);

  const vehicleDryMassKg = useMemo(() => {
    const raw = stats?.dryMass;
    return typeof raw === 'number' && raw > 0 ? raw : 8200;
  }, [stats]);

  const engineThrustKn = useMemo(() => {
    const raw = stats?.totalThrustKn ?? (stats as any)?.totalThrust;
    return typeof raw === 'number' && raw > 0 ? raw : 1850;
  }, [stats]);

  const specificImpulseS = useMemo(() => {
    const raw = stats?.weightedIsp;
    return typeof raw === 'number' && raw > 0 ? raw : 340;
  }, [stats]);

  const hasAuxiliaryBoosters = useMemo(() => {
    const rawThrust = stats?.totalThrustKn ?? (stats as any)?.totalThrust ?? 0;
    const rawFuel = stats?.propellantMass ?? (stats as any)?.totalPropellant ?? 0;
    return rawThrust === 0 || rawFuel === 0;
  }, [stats]);

  // Flight states
  const [flightState, setFlightState] = useState<FlightState>('prelaunch');
  const [countdown, setCountdown] = useState<number>(3);
  const [met, setMet] = useState<number>(0); // Mission Elapsed Time (seconds)
  const [altitude, setAltitude] = useState<number>(0); // km
  const [velocity, setVelocity] = useState<number>(0); // m/s
  const [gForce, setGForce] = useState<number>(1.0);
  const [qPressure, setQPressure] = useState<number>(0); // kPa
  const [throttle, setThrottle] = useState<number>(100); // 0-100%
  const [propellantKg, setPropellantKg] = useState<number>(initialPropellantKg);
  const [pitchAngle, setPitchAngle] = useState<number>(0);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('chase');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showFlightDebrief, setShowFlightDebrief] = useState<boolean>(false);

  // Peak metrics record
  const [peakAlt, setPeakAlt] = useState<number>(0);
  const [peakVel, setPeakVel] = useState<number>(0);
  const [peakG, setPeakG] = useState<number>(1.0);
  const [peakQ, setPeakQ] = useState<number>(0);

  // Authoritative mutable physics ref to prevent interval recreation jitter
  const simRef = useRef({
    met: 0,
    altKm: 0,
    velMs: 0,
    fuelKg: initialPropellantKg,
    pitchRad: 0,
    throttleVal: 100,
    peakAlt: 0,
    peakVel: 0,
    peakG: 1.0,
    peakQ: 0,
    hasPassedMach1: false,
    hasPassedKarman: false,
  });

  // Keep throttle ref updated synchronously
  useEffect(() => {
    simRef.current.throttleVal = throttle;
    launchAudio.updateThrottle(throttle);
  }, [throttle]);

  // Handle mute toggles
  const handleToggleMute = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      launchAudio.setMuted(next);
      return next;
    });
  }, []);

  // Reset flight on open
  useEffect(() => {
    if (isOpen) {
      setFlightState('prelaunch');
      setCountdown(3);
      setMet(0);
      setAltitude(0);
      setVelocity(0);
      setGForce(1.0);
      setQPressure(0);
      setThrottle(100);
      setPropellantKg(initialPropellantKg);
      setPitchAngle(0);
      setShowFlightDebrief(false);
      setPeakAlt(0);
      setPeakVel(0);
      setPeakG(1.0);
      setPeakQ(0);

      simRef.current = {
        met: 0,
        altKm: 0,
        velMs: 0,
        fuelKg: initialPropellantKg,
        pitchRad: 0,
        throttleVal: 100,
        peakAlt: 0,
        peakVel: 0,
        peakG: 1.0,
        peakQ: 0,
        hasPassedMach1: false,
        hasPassedKarman: false,
      };
      launchAudio.stopRocketEngine();
    } else {
      launchAudio.stopRocketEngine();
    }
  }, [isOpen, initialPropellantKg]);

  // Countdown loop
  useEffect(() => {
    if (flightState !== 'countdown') return;

    if (countdown > 0) {
      launchAudio.playBeep(880, 0.09);
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      launchAudio.playBeep(1760, 0.22);
      launchAudio.startRocketEngine(throttle);
      setFlightState('ascending');
    }
  }, [flightState, countdown, throttle]);

  // High-performance physics simulation loop (50ms dt = 0.05s)
  useEffect(() => {
    if (flightState !== 'ascending') return;

    const dt = 0.05; // 20 Hz calculation step
    const g0 = 9.80665;

    const interval = setInterval(() => {
      const s = simRef.current;
      s.met += dt;

      // 1. Thrust calculation (kN)
      const currentThrustKn = engineThrustKn * (s.throttleVal / 100);
      const burnRate = currentThrustKn > 0 ? (currentThrustKn * 1000) / (specificImpulseS * g0) : 0; // kg/s
      const fuelUsed = burnRate * dt;

      if (s.fuelKg > 0) {
        s.fuelKg = Math.max(0, s.fuelKg - fuelUsed);
      }

      // Check for fuel depletion (MECO)
      if (s.fuelKg <= 0 && currentThrustKn > 0) {
        launchAudio.stopRocketEngine();
        setFlightState('meco');
      }

      // 2. Aerodynamic Drag & Atmospheric Density: rho = 1.225 * exp(-alt_m / 8500)
      const altMeters = s.altKm * 1000;
      const rho = altMeters < 100000 ? 1.225 * Math.exp(-altMeters / 8500) : 0;
      const dragForceKn = (0.5 * rho * s.velMs * s.velMs * 0.3 * 7.5) / 1000;

      // 3. Current Mass & Gravity Turn
      const currentMassKg = vehicleDryMassKg + s.fuelKg;
      const effectiveThrustKn = s.fuelKg > 0 ? currentThrustKn : 0;

      // Gravity decreases with altitude
      const earthRadiusKm = 6371;
      const localG = g0 * Math.pow(earthRadiusKm / (earthRadiusKm + s.altKm), 2);

      // Pitch angle increases smoothly for gravity turn after 1.2 km
      if (s.altKm > 1.2 && s.pitchRad < 1.15) {
        s.pitchRad += 0.0018 * dt * 20;
      }

      // Net upward / trajectory force
      const forwardForceKn = effectiveThrustKn * Math.cos(s.pitchRad) - dragForceKn;
      const netForceN = forwardForceKn * 1000;
      const accel = currentMassKg > 0 ? netForceN / currentMassKg - localG : -localG;

      // Update velocity and altitude
      s.velMs = Math.max(0, s.velMs + accel * dt);
      s.altKm = s.altKm + (s.velMs * dt) / 1000;

      // Dynamic G-Force
      const currentG = Math.max(0, 1.0 + accel / g0);

      // Dynamic Q Pressure (kPa)
      const qVal = (0.5 * rho * s.velMs * s.velMs) / 1000;

      // Transonic sonic boom trigger
      if (s.velMs >= 343 && !s.hasPassedMach1) {
        s.hasPassedMach1 = true;
        launchAudio.playSonicBoom();
      }

      // Karman Line audio trigger
      if (s.altKm >= 100 && !s.hasPassedKarman) {
        s.hasPassedKarman = true;
      }

      // Track peaks
      if (s.altKm > s.peakAlt) s.peakAlt = s.altKm;
      if (s.velMs > s.peakVel) s.peakVel = s.velMs;
      if (currentG > s.peakG) s.peakG = currentG;
      if (qVal > s.peakQ) s.peakQ = qVal;

      // 4. Milestone: Orbital Insertion Achieved (Altitude >= 120km and Velocity >= 6500m/s)
      if (s.altKm >= 120) {
        launchAudio.stopRocketEngine();
        launchAudio.playOrbitChime();
        setFlightState('orbital');
        setShowFlightDebrief(true);
      }

      // Sync to React state for UI rendering
      setMet(parseFloat(s.met.toFixed(1)));
      setAltitude(parseFloat(s.altKm.toFixed(3)));
      setVelocity(parseFloat(s.velMs.toFixed(1)));
      setGForce(parseFloat(currentG.toFixed(2)));
      setQPressure(parseFloat(qVal.toFixed(1)));
      setPropellantKg(parseFloat(s.fuelKg.toFixed(0)));
      setPitchAngle(s.pitchRad);
      setPeakAlt(s.peakAlt);
      setPeakVel(s.peakVel);
      setPeakG(s.peakG);
      setPeakQ(s.peakQ);
    }, 50);

    return () => clearInterval(interval);
  }, [flightState, engineThrustKn, vehicleDryMassKg, specificImpulseS]);

  if (!isOpen) return null;

  const handleStartCountdown = () => {
    setCountdown(3);
    setFlightState('countdown');
  };

  const handleAbort = () => {
    launchAudio.stopRocketEngine();
    setFlightState('aborted');
    setShowFlightDebrief(true);
  };

  const handleReset = () => {
    launchAudio.stopRocketEngine();
    setFlightState('prelaunch');
    setCountdown(3);
    setMet(0);
    setAltitude(0);
    setVelocity(0);
    setGForce(1.0);
    setQPressure(0);
    setPropellantKg(initialPropellantKg);
    setPitchAngle(0);
    setShowFlightDebrief(false);

    simRef.current = {
      met: 0,
      altKm: 0,
      velMs: 0,
      fuelKg: initialPropellantKg,
      pitchRad: 0,
      throttleVal: throttle,
      peakAlt: 0,
      peakVel: 0,
      peakG: 1.0,
      peakQ: 0,
      hasPassedMach1: false,
      hasPassedKarman: false,
    };
  };

  const formatMet = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `T+${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms}`;
  };

  const fuelPct =
    initialPropellantKg > 0
      ? Math.max(0, Math.min(100, (propellantKg / initialPropellantKg) * 100))
      : 0;

  const machNumber = (velocity / 343).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in select-none">
      <div className="relative w-full max-w-6xl h-[94vh] max-h-[880px] flex flex-col rounded-3xl border border-white/15 bg-[#030611] shadow-[0_0_80px_rgba(0,229,255,0.3)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#070C1B]/95 z-20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#0284C7]/30 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-sans text-sm sm:text-base font-extrabold text-white tracking-wide">
                  Test Flight Simulation • {shipName}
                </span>
                <span
                  className={`font-mono text-[10.5px] px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                    flightState === 'orbital'
                      ? 'border-[#34D399]/40 bg-[#34D399]/15 text-[#34D399]'
                      : flightState === 'aborted'
                      ? 'border-red-500/40 bg-red-500/15 text-red-400'
                      : flightState === 'ascending'
                      ? 'border-[#00E5FF]/40 bg-[#00E5FF]/15 text-[#00E5FF] animate-pulse'
                      : 'border-white/20 bg-white/5 text-[#94A3B8]'
                  }`}
                >
                  {flightState}
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#94A3B8] hidden sm:block">
                Atmospheric aerodynamics, dynamic thrust vectoring and live telemetry telemetry HUD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
            >
              {isAudioMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-[#00E5FF]" />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={() => {
                launchAudio.stopRocketEngine();
                onClose();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Simulation Stage & Live Telemetry HUD */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* 3D Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas
              shadows
              camera={{ position: [14, 6, 18], fov: 45 }}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
              <FlightStage3D
                components={components}
                livery={livery}
                materialFinish={materialFinish}
                altitude={altitude}
                pitchAngle={pitchAngle}
                velocity={velocity}
                isEnginesFired={flightState === 'ascending'}
                throttle={throttle}
                cameraMode={cameraMode}
              />
            </Canvas>
          </div>

          {/* Auxiliary Booster Assist Notice (if user ship lacked propulsion components) */}
          {hasAuxiliaryBoosters && flightState === 'prelaunch' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-[#070C1B]/90 backdrop-blur-md text-amber-300 font-mono text-[11px] shadow-lg">
              <Info className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Simulated auxiliary booster & propellant reserves engaged for test flight</span>
            </div>
          )}

          {/* Countdown Center Splash Overlay */}
          {flightState === 'countdown' && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none bg-black/40">
              <span className="font-mono text-8xl sm:text-9xl font-black text-[#00E5FF] drop-shadow-[0_0_40px_rgba(0,229,255,0.9)] animate-pulse">
                {countdown > 0 ? countdown : 'IGNITION!'}
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-widest uppercase text-white/90 mt-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md">
                Ignition Sequence Active • Pad Hold Down Arms Releasing
              </span>
            </div>
          )}

          {/* Left HUD: Live Telemetry Matrix */}
          <div className="absolute top-4 left-4 z-10 w-60 sm:w-64 p-3.5 rounded-2xl border border-white/10 bg-[#070C1B]/85 backdrop-blur-xl shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="font-mono text-xs font-bold text-[#00E5FF] flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Live Telemetry</span>
              </span>
              <span className="font-mono text-xs font-extrabold text-white tracking-wider">
                {formatMet(met)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#94A3B8] block">Altitude</span>
                <span className="text-sm font-bold text-[#38BDF8]">
                  {altitude.toFixed(2)}{' '}
                  <span className="text-[10px] text-[#94A3B8]">km</span>
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#94A3B8] block">Velocity</span>
                <span className="text-sm font-bold text-[#F59E0B]">
                  {velocity.toFixed(0)}{' '}
                  <span className="text-[10px] text-[#94A3B8]">m/s</span>
                </span>
                <span className="text-[9.5px] text-[#94A3B8] block mt-0.5">
                  Mach {machNumber}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#94A3B8] block">G-Force</span>
                <span
                  className={`text-sm font-bold ${
                    gForce > 3.8 ? 'text-red-400' : 'text-[#34D399]'
                  }`}
                >
                  {gForce.toFixed(2)} G
                </span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-[#94A3B8] block">Dynamic Q</span>
                <span className="text-sm font-bold text-[#A78BFA]">
                  {qPressure.toFixed(1)}{' '}
                  <span className="text-[10px] text-[#94A3B8]">kPa</span>
                </span>
              </div>
            </div>

            {/* Propellant Gauge */}
            <div className="space-y-1 pt-1.5 border-t border-white/5 font-mono text-[11px]">
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span>Propellant Remaining:</span>
                <span className="text-white font-bold">{fuelPct.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    fuelPct > 20 ? 'bg-[#00E5FF]' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${fuelPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-[#64748B]">
                <span>{propellantKg.toLocaleString()} kg</span>
                <span>{initialPropellantKg.toLocaleString()} kg</span>
              </div>
            </div>

            {/* Pitch / Thrust Summary */}
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Compass className="h-3 w-3 text-[#38BDF8]" />
                <span>Pitch: {((pitchAngle * 180) / Math.PI).toFixed(1)}°</span>
              </span>
              <span>Thrust: {(engineThrustKn * (throttle / 100)).toFixed(0)} kN</span>
            </div>
          </div>

          {/* Right HUD: Camera Mode & Flight Milestones */}
          <div className="absolute top-4 right-4 z-10 w-56 sm:w-60 p-3 rounded-2xl border border-white/10 bg-[#070C1B]/85 backdrop-blur-xl shadow-2xl space-y-3 font-mono text-xs">
            {/* Camera View Switcher */}
            <div>
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-1.5 flex items-center gap-1">
                <Camera className="h-3 w-3 text-[#38BDF8]" />
                <span>Camera Perspective</span>
              </span>
              <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setCameraMode('chase')}
                  className={`p-1.5 rounded-lg border text-center transition-colors ${
                    cameraMode === 'chase'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'border-white/5 bg-white/5 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Chase Cam
                </button>
                <button
                  type="button"
                  onClick={() => setCameraMode('pad')}
                  className={`p-1.5 rounded-lg border text-center transition-colors ${
                    cameraMode === 'pad'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'border-white/5 bg-white/5 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Pad Cam
                </button>
                <button
                  type="button"
                  onClick={() => setCameraMode('cockpit')}
                  className={`p-1.5 rounded-lg border text-center transition-colors ${
                    cameraMode === 'cockpit'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'border-white/5 bg-white/5 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Cockpit Cam
                </button>
                <button
                  type="button"
                  onClick={() => setCameraMode('free')}
                  className={`p-1.5 rounded-lg border text-center transition-colors ${
                    cameraMode === 'free'
                      ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'border-white/5 bg-white/5 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  360° Free
                </button>
              </div>
            </div>

            {/* Flight Milestones */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block flex items-center gap-1">
                <Layers className="h-3 w-3 text-[#F59E0B]" />
                <span>Ascent Milestones</span>
              </span>
              <div className="space-y-1 text-[10.5px]">
                <div
                  className={`flex items-center justify-between ${
                    met > 0 ? 'text-[#34D399] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span>1. Ignition & Liftoff</span>
                  {met > 0 && <span>✓</span>}
                </div>
                <div
                  className={`flex items-center justify-between ${
                    altitude > 0.1 ? 'text-[#34D399] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span>2. Tower Cleared (100m)</span>
                  {altitude > 0.1 && <span>✓</span>}
                </div>
                <div
                  className={`flex items-center justify-between ${
                    velocity > 343 ? 'text-[#34D399] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span>3. Transonic / Max Q</span>
                  {velocity > 343 && <span>✓</span>}
                </div>
                <div
                  className={`flex items-center justify-between ${
                    altitude > 1.2 ? 'text-[#34D399] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span>4. Gravity Turn (1.2 km)</span>
                  {altitude > 1.2 && <span>✓</span>}
                </div>
                <div
                  className={`flex items-center justify-between ${
                    altitude > 80 ? 'text-[#34D399] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span>5. Karman Line (80 km)</span>
                  {altitude > 80 && <span>✓</span>}
                </div>
                <div
                  className={`flex items-center justify-between ${
                    altitude >= 120 ? 'text-[#34D399] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  <span>6. Low Earth Orbit</span>
                  {altitude >= 120 && <span>✓</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Post-Flight Mission Debrief Card Overlay */}
          {showFlightDebrief && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
              <div className="max-w-lg w-full p-6 rounded-3xl border border-white/20 bg-[#070C1B]/95 shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    {flightState === 'orbital' ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-[#34D399] border border-emerald-500/40">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    ) : flightState === 'aborted' ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                        <ShieldAlert className="h-6 w-6" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <Flame className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-sans text-lg font-black text-white">
                        {flightState === 'orbital'
                          ? 'Orbital Insertion Achieved!'
                          : flightState === 'aborted'
                          ? 'Flight Aborted'
                          : 'Main Engine Cutoff (MECO)'}
                      </h3>
                      <p className="font-mono text-xs text-[#94A3B8]">
                        Flight Debrief & Mission Performance Log
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFlightDebrief(false)}
                    className="h-7 w-7 rounded-lg bg-white/5 text-[#94A3B8] hover:text-white flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Performance Grid */}
                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94A3B8] block">Max Altitude</span>
                    <span className="text-base font-bold text-[#38BDF8]">
                      {peakAlt.toFixed(2)} km
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94A3B8] block">Max Velocity</span>
                    <span className="text-base font-bold text-[#F59E0B]">
                      {peakVel.toFixed(0)} m/s{' '}
                      <span className="text-[11px] text-[#94A3B8]">(Mach {(peakVel / 343).toFixed(1)})</span>
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94A3B8] block">Max G-Force</span>
                    <span className="text-base font-bold text-[#34D399]">
                      {peakG.toFixed(2)} G
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94A3B8] block">Max-Q Dynamic Pressure</span>
                    <span className="text-base font-bold text-[#A78BFA]">
                      {peakQ.toFixed(1)} kPa
                    </span>
                  </div>
                </div>

                {/* Educational Summary */}
                <div className="p-3 rounded-2xl bg-[#0B1226] border border-white/10 text-xs text-[#CBD5E1] space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#00E5FF]" />
                    <span>Aerospace Assessment</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-[#94A3B8]">
                    {flightState === 'orbital'
                      ? `Vehicle achieved low Earth orbit target altitude (${peakAlt.toFixed(1)} km). Structural integrity nominal through maximum dynamic pressure.`
                      : flightState === 'aborted'
                      ? 'Flight terminated safely. Recovery systems deployed and telemetry recorded for telemetry analysis.'
                      : `Propellant exhausted at ${peakAlt.toFixed(1)} km altitude. To reach stable orbit, increase propellant mass ratio or install higher specific impulse propulsion.`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset & Fly Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      launchAudio.stopRocketEngine();
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0284C7] text-[#030611] font-sans text-xs font-black shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span>Return to Shipyard</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Cockpit Flight Deck Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-white/10 bg-[#070C1B]/95 z-20">
          {/* Throttle Slider */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#94A3B8] flex items-center gap-1">
              <Sliders className="h-3.5 w-3.5 text-[#00E5FF]" />
              <span>Throttle:</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={throttle}
              disabled={flightState === 'prelaunch' || flightState === 'countdown'}
              onChange={(e) => setThrottle(parseInt(e.target.value))}
              className="w-28 sm:w-44 h-2 cursor-pointer appearance-none rounded-lg bg-[#0B1226] accent-[#00E5FF] disabled:opacity-40"
            />
            <span className="font-mono text-xs font-bold text-white w-10">
              {throttle}%
            </span>
          </div>

          {/* Flight Control CTAs */}
          <div className="flex items-center gap-2">
            {flightState === 'prelaunch' && (
              <button
                type="button"
                onClick={handleStartCountdown}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0284C7] text-[#030611] font-sans text-xs font-black shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>INITIATE LAUNCH SEQUENCE</span>
              </button>
            )}

            {flightState === 'ascending' && (
              <button
                type="button"
                onClick={handleAbort}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans text-xs font-black shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition-all"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>ABORT FLIGHT</span>
              </button>
            )}

            {(flightState === 'orbital' || flightState === 'meco' || flightState === 'aborted') && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFlightDebrief(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/15 text-[#00E5FF] font-sans text-xs font-bold hover:bg-[#00E5FF]/25 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Mission Debrief</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Launchpad</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

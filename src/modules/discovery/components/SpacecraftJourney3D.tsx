import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialId } from '../../../types';
import { PLANET_DISCOVERY_PROFILES } from '../data/discoveryData';
import { usePlanetaryTexture } from '../../../utils/planetaryTextures';
import { discoveryAudio } from '../audio/discoveryAudio';
import { JourneyCameraMode } from '../types';
import {
  FastForward,
  Play,
  Pause,
  Gauge,
  Navigation,
  Crosshair,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Radio,
} from 'lucide-react';

interface SpacecraftJourney3DProps {
  destinationId: CelestialId | string;
  onComplete: () => void;
  onCancel: () => void;
}

/**
 * AAA Cinematic Spacecraft Model with detailed hull, glowing ion thrusters, and dynamic lighting
 */
function CinematicVessel({
  enginePower = 1.0,
  isBraking = false,
}: {
  enginePower: number;
  isBraking: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftPlumeRef = useRef<THREE.Mesh>(null);
  const rightPlumeRef = useRef<THREE.Mesh>(null);
  const brakePlumeLeftRef = useRef<THREE.Mesh>(null);
  const brakePlumeRightRef = useRef<THREE.Mesh>(null);
  const leftGlowRef = useRef<THREE.PointLight>(null);
  const rightGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 1.0 + Math.sin(t * 40) * 0.15 + Math.cos(t * 22) * 0.08;

    // Subtle gentle ship idle banking / pitch
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.04;
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.06;
    }

    // Main thruster plumes
    if (leftPlumeRef.current && rightPlumeRef.current) {
      const pScale = (isBraking ? 0.35 : 1.9) * enginePower * flicker;
      leftPlumeRef.current.scale.set(1.0, 1.0, pScale);
      rightPlumeRef.current.scale.set(1.0, 1.0, pScale);
    }

    // Retro-brake thruster plumes
    if (brakePlumeLeftRef.current && brakePlumeRightRef.current) {
      const bScale = isBraking ? 1.4 * flicker : 0.01;
      brakePlumeLeftRef.current.scale.set(1.0, 1.0, bScale);
      brakePlumeRightRef.current.scale.set(1.0, 1.0, bScale);
    }

    // Dynamic thruster point lights
    if (leftGlowRef.current && rightGlowRef.current) {
      const intensity = (isBraking ? 2.5 : 5.0) * enginePower * flicker;
      leftGlowRef.current.intensity = intensity;
      rightGlowRef.current.intensity = intensity;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      {/* 1. Main Fuselage Hull (Multi-segment aerodynamic aerospace body) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.78, 3.8, 12]} />
        <meshStandardMaterial
          color="#E2E8F0"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Hull Armor Plates (Dark Navy Accents) */}
      <mesh position={[0, 0.05, 0.2]}>
        <boxGeometry args={[0.95, 0.42, 2.6]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* 2. Cockpit Canopy (Glowing Cyan HUD Visor) */}
      <mesh position={[0, 0.36, -0.95]}>
        <sphereGeometry args={[0.48, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.85}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Cockpit Frame Ribs */}
      <mesh position={[0, 0.4, -0.95]}>
        <torusGeometry args={[0.49, 0.03, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3. Aerodynamic Swept Delta Wings */}
      <mesh position={[0, -0.06, 0.5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.09, 1.6]} />
        <meshStandardMaterial color="#1E293B" metalness={0.75} roughness={0.25} />
      </mesh>

      {/* Left & Right Wing Stabilizers / Winglets */}
      <group position={[-2.1, 0.32, 0.5]}>
        <mesh>
          <boxGeometry args={[0.08, 0.72, 1.0]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Navigation Port Red Light */}
        <pointLight position={[0, 0.4, -0.4]} color="#EF4444" distance={3} intensity={2} />
      </group>

      <group position={[2.1, 0.32, 0.5]}>
        <mesh>
          <boxGeometry args={[0.08, 0.72, 1.0]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Navigation Starboard Green Light */}
        <pointLight position={[0, 0.4, -0.4]} color="#10B981" distance={3} intensity={2} />
      </group>

      {/* 4. Dual High-Thrust Ion Engines */}
      {/* Left Engine Pod */}
      <group position={[-0.55, 0, 1.9]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.34, 1.0, 20]} />
          <meshStandardMaterial color="#090D16" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Nozzle Inner Ring */}
        <mesh position={[0, 0, 0.5]}>
          <ringGeometry args={[0.15, 0.28, 24]} />
          <meshBasicMaterial color={isBraking ? '#F59E0B' : '#00E5FF'} side={THREE.DoubleSide} />
        </mesh>
        <pointLight
          ref={leftGlowRef}
          position={[0, 0, 0.6]}
          color={isBraking ? '#F59E0B' : '#00E5FF'}
          distance={14}
          intensity={5}
        />
        {/* Left Plume */}
        <mesh ref={leftPlumeRef} position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.34, 2.4, 20]} />
          <meshBasicMaterial
            color={isBraking ? '#F59E0B' : '#00E5FF'}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Right Engine Pod */}
      <group position={[0.55, 0, 1.9]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.34, 1.0, 20]} />
          <meshStandardMaterial color="#090D16" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Nozzle Inner Ring */}
        <mesh position={[0, 0, 0.5]}>
          <ringGeometry args={[0.15, 0.28, 24]} />
          <meshBasicMaterial color={isBraking ? '#F59E0B' : '#00E5FF'} side={THREE.DoubleSide} />
        </mesh>
        <pointLight
          ref={rightGlowRef}
          position={[0, 0, 0.6]}
          color={isBraking ? '#F59E0B' : '#00E5FF'}
          distance={14}
          intensity={5}
        />
        {/* Right Plume */}
        <mesh ref={rightPlumeRef} position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.34, 2.4, 20]} />
          <meshBasicMaterial
            color={isBraking ? '#F59E0B' : '#00E5FF'}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 5. Forward Retro-Braking Thrusters (Fires in Stage 3) */}
      <group position={[-0.8, -0.05, -0.4]} rotation={[0, Math.PI, 0]}>
        <mesh ref={brakePlumeLeftRef} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 1.2, 16]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[0.8, -0.05, -0.4]} rotation={[0, Math.PI, 0]}>
        <mesh ref={brakePlumeRightRef} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 1.2, 16]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Relativistic Warp Particle Streaks simulating high-velocity space flight
 */
function WarpParticleTunnel({ velocity = 1.0 }: { velocity: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const count = 2200;
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 70;
      pos[i3 + 1] = (Math.random() - 0.5) * 70;
      pos[i3 + 2] = (Math.random() - 0.5) * 160;
      spd[i] = Math.random() * 25 + 30;
    }

    return { positions: pos, speeds: spd };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < pos.length / 3; i++) {
      const i3 = i * 3;
      pos[i3 + 2] += delta * speeds[i] * velocity * 2.8;

      if (pos[i3 + 2] > 80) {
        pos[i3 + 2] = -80;
        pos[i3] = (Math.random() - 0.5) * 70;
        pos[i3 + 1] = (Math.random() - 0.5) * 70;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#38BDF8"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Approaching Destination Planet Mesh — looms massive in the viewport as journey advances
 */
function ApproachingDestination({
  destinationId,
  progress,
}: {
  destinationId: string;
  progress: number; // 0 to 1
}) {
  const texture = usePlanetaryTexture(destinationId as any);
  const profile = PLANET_DISCOVERY_PROFILES[destinationId];
  const primaryColor = profile?.visuals?.primaryColor || '#38BDF8';
  const glowColor = profile?.visuals?.glowColor || '#1D4ED8';

  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Position moves smoothly closer: from -140 down to -20
  const zPos = -140 + progress * 115;
  // Size grows from subtle sphere to massive planetary horizon (scale 1.2 to 8.5)
  const scale = 1.2 + Math.pow(progress, 1.4) * 7.5;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group position={[0, -0.8, zPos]} scale={[scale, scale, scale]}>
      {/* Planet Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshStandardMaterial
          map={texture || null}
          color={texture ? '#FFFFFF' : primaryColor}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Multi-layered Atmospheric Glow */}
      <mesh ref={atmosphereRef} scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.38}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh scale={[1.14, 1.14, 1.14]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Camera Motion System responding to Camera Mode
 */
function FlightCamera({
  mode,
  progress,
}: {
  mode: JourneyCameraMode;
  progress: number;
}) {
  useFrame((state) => {
    if (mode === 'chase') {
      // Third-person chase cam with slight dynamic camera lag
      state.camera.position.set(0, 2.0, 7.2);
      state.camera.lookAt(0, 0.4, -25);
    } else if (mode === 'cockpit') {
      // Pilot POV forward view looking toward approaching world
      state.camera.position.set(0, 0.45, -1.1);
      state.camera.lookAt(0, 0.45, -60);
    } else if (mode === 'flyby') {
      // Cinematic side flyby
      const camX = Math.sin(progress * Math.PI) * 14 + 6;
      state.camera.position.set(camX, 2.8, 4);
      state.camera.lookAt(0, 0, 0);
    } else if (mode === 'orbit') {
      // 360-degree orbital sweep around the starship
      const angle = progress * Math.PI * 2.5;
      state.camera.position.set(Math.cos(angle) * 8, 2.4, Math.sin(angle) * 8);
      state.camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

export const SpacecraftJourney3D: React.FC<SpacecraftJourney3DProps> = ({
  destinationId,
  onComplete,
  onCancel,
}) => {
  const profile = PLANET_DISCOVERY_PROFILES[destinationId] || PLANET_DISCOVERY_PROFILES.neptune;

  // Flight duration: 11 seconds for cinematic progression
  const [flightTimeSeconds, setFlightTimeSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<JourneyCameraMode>('chase');
  const [lauraSubtitle, setLauraSubtitle] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(discoveryAudio.getIsVoiceMuted());

  const totalDuration = 11.0;
  const progress = Math.min(1.0, flightTimeSeconds / totalDuration);

  // Narration scripts for Journey Stages
  const stage1Narration = useMemo(() => {
    if (destinationId === 'neptune') {
      return "Welcome aboard, explorer! We are approaching Neptune, the mysterious blue ice giant at the edge of our Solar System. Prepare for an extraordinary journey.";
    }
    return `Welcome aboard, explorer! We have initiated transit trajectory toward ${profile.name}. Prepare for orbital encounter.`;
  }, [destinationId, profile.name]);

  const stage2Narration = useMemo(() => {
    if (destinationId === 'neptune') {
      return "Look ahead! You are witnessing Neptune's magnificent blue atmosphere. Its powerful winds can reach approximately 2,100 kilometres per hour!";
    }
    return `Look ahead! We are approaching the upper exosphere of ${profile.name}. Orbital insertion telemetry is locked.`;
  }, [destinationId, profile.name]);

  // Handle speaking Laura narration
  const speakNarrative = useCallback((text: string) => {
    setLauraSubtitle(text);
    setIsVoiceActive(true);
    discoveryAudio.speak(text, {
      onStart: () => setIsVoiceActive(true),
      onEnd: () => setIsVoiceActive(false),
      onError: () => setIsVoiceActive(false),
    });
  }, []);

  // Audio & Laura Voice Trigger Sequences
  useEffect(() => {
    discoveryAudio.playIgnitionRumble();

    // Stage 1 narration at t=0.6s
    const t0 = setTimeout(() => {
      speakNarrative(stage1Narration);
    }, 600);

    const t1 = setTimeout(() => discoveryAudio.playThrusterBoost(), 1400);

    // Stage 2 narration at t=5.2s
    const t2 = setTimeout(() => {
      speakNarrative(stage2Narration);
      discoveryAudio.playThrusterBoost();
    }, 5200);

    const t3 = setTimeout(() => discoveryAudio.playOrbitInsertion(), 9600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      discoveryAudio.stopSpeech();
    };
  }, [speakNarrative, stage1Narration, stage2Narration]);

  // Frame tick loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setFlightTimeSeconds((prev) => {
        const next = prev + 0.1;
        if (next >= totalDuration) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return totalDuration;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, onComplete, totalDuration]);

  // Telemetry Metrics calculation
  const speedKmS = Math.round(
    progress < 0.2
      ? progress * 5 * 140
      : progress > 0.8
      ? (1.0 - progress) * 5 * 140 + 28
      : 140 + Math.sin(progress * 10) * 18
  );

  const distanceRemainingAU = (
    profile.astronomy.semiMajorAxisAU * (1.0 - progress)
  ).toFixed(2);

  const phaseStageText =
    progress < 0.25
      ? 'STAGE 1: HYPER-PROPULSION IGNITION'
      : progress < 0.75
      ? 'STAGE 2: INTERPLANETARY TRANSIT'
      : progress < 0.95
      ? 'STAGE 3: RETRO-BRAKING & CAPTURE'
      : 'STAGE 4: PARKING ORBIT ACHIEVED';

  const handleToggleMute = () => {
    const next = discoveryAudio.toggleVoiceMute();
    setIsMuted(next);
    if (next) {
      setIsVoiceActive(false);
    }
  };

  const handleReplayCurrentVoice = () => {
    if (progress < 0.5) {
      speakNarrative(stage1Narration);
    } else {
      speakNarrative(stage2Narration);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#02050D] font-sans text-[#F8FAFC] select-none flex flex-col justify-between">
      {/* 1. Realtime 3D Three.js Journey Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 2, 7.5], fov: 52, near: 0.1, far: 500 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#02050D']} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[12, 22, 18]} intensity={2.0} color="#FFFFFF" />

          {/* Dynamic Flight Camera */}
          <FlightCamera mode={cameraMode} progress={progress} />

          {/* 3D Vessel with dynamic thrusters and retro-brakes */}
          <CinematicVessel
            enginePower={progress > 0.92 ? 0.3 : 1.0}
            isBraking={progress > 0.75 && progress < 0.95}
          />

          {/* Relativistic Warp Particle Tunnel */}
          <WarpParticleTunnel velocity={progress > 0.85 ? 0.4 : 1.3} />

          {/* Approaching Destination Planet (grows massive in the viewport) */}
          <ApproachingDestination destinationId={destinationId} progress={progress} />
        </Canvas>
      </div>

      {/* 2. Top Flight Telemetry HUD */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 pt-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#38BDF8]/40 bg-[#38BDF8]/15 text-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.4)] backdrop-blur-xl">
            <Navigation className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#38BDF8]">
              INTERPLANETARY TRANSIT TRAJECTORY
            </span>
            <h1 className="font-sans text-xl sm:text-2xl font-black text-white tracking-wide">
              JOURNEY TO {profile.name.toUpperCase()}
            </h1>
          </div>
        </div>

        {/* Flight Actions: Skip / Abort */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              discoveryAudio.playTelemetryChime(1100);
              discoveryAudio.stopSpeech();
              onComplete();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[#38BDF8]/50 bg-[#38BDF8]/20 px-3.5 py-1.5 font-mono text-xs font-bold text-white hover:bg-[#38BDF8]/35 transition-all backdrop-blur-xl shadow-lg"
          >
            <span>Skip to Planet</span>
            <FastForward className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              discoveryAudio.stopSpeech();
              onCancel();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3.5 py-1.5 font-mono text-xs text-[#94A3B8] hover:text-white transition-all backdrop-blur-xl"
          >
            <span>Abort</span>
          </button>
        </div>
      </header>

      {/* 3. Center Flight Dynamics HUD Reticle */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <div className="rounded-full border border-white/15 bg-[#070C1B]/80 px-4 py-1.5 backdrop-blur-md shadow-lg">
          <span className="font-mono text-xs font-semibold text-[#38BDF8] tracking-widest uppercase">
            {phaseStageText}
          </span>
        </div>

        {/* Distance Remaining Counter */}
        <div className="mt-2 font-mono text-xs text-[#94A3B8]">
          Distance to Encounter: <strong className="text-white tabular-nums">{distanceRemainingAU} AU</strong>
        </div>
      </div>

      {/* 4. LAURA AI EXPEDITION VOICE HUD OVERLAY (Synchronized Speech & Subtitles) */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 pointer-events-auto">
        <div className="rounded-2xl border border-[#38BDF8]/40 bg-[#070C1B]/90 p-4 backdrop-blur-2xl shadow-[0_0_35px_rgba(2,5,13,0.9)] flex flex-col sm:flex-row items-center gap-3.5">
          {/* Laura Avatar & Visualizer */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] text-[#02050D] shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
              {isVoiceActive && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981]" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#38BDF8]">
                <Radio className="h-3 w-3 animate-pulse" />
                <span>LAURA AI SPACE GUIDE</span>
              </div>
              <div className="text-xs font-bold text-white">Trans-Orbital Comms</div>
            </div>
          </div>

          {/* Subtitles text display */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="font-sans text-xs sm:text-sm text-[#E2E8F0] leading-relaxed line-clamp-2 sm:line-clamp-3">
              "{lauraSubtitle || stage1Narration}"
            </p>
          </div>

          {/* Voice Controls: Replay / Mute */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleReplayCurrentVoice}
              title="Replay Voice Narration"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute Laura Voice' : 'Mute Laura Voice'}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                isMuted
                  ? 'border-red-500/40 bg-red-500/10 text-red-400'
                  : 'border-white/10 bg-white/5 text-[#38BDF8] hover:text-white'
              }`}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Cockpit Flight Telemetry & Camera Modes */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-6 sm:px-10 flex flex-col gap-3">
        {/* Progress Bar */}
        <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#10B981] transition-all duration-100 shadow-[0_0_15px_#38BDF8]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* Telemetry Readouts and Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#070C1B]/90 p-3.5 backdrop-blur-2xl">
          {/* Velocity Telemetry */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Gauge className="h-4 w-4 text-[#38BDF8]" />
              <span className="text-[#94A3B8]">Velocity:</span>
              <span className="font-bold text-white tabular-nums">{speedKmS} km/s</span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-white/10" />

            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <Crosshair className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-[#94A3B8]">Target:</span>
              <span className="font-bold text-white">{profile.name}</span>
            </div>
          </div>

          {/* Camera Modes Selector */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[#64748B] text-[10px] uppercase tracking-wider mr-1">Camera:</span>
            {(['chase', 'cockpit', 'flyby', 'orbit'] as JourneyCameraMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCameraMode(mode)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  cameraMode === mode
                    ? 'bg-[#38BDF8] text-[#02050D] font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    : 'bg-white/5 text-[#94A3B8] hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Pause / Resume */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-[#94A3B8] hover:text-white transition-all"
          >
            {isPaused ? <Play className="h-3.5 w-3.5 text-[#10B981]" /> : <Pause className="h-3.5 w-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

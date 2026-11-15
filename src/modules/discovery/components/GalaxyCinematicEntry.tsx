import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Compass,
  Sparkles,
  Rocket,
  ChevronRight,
  Eye,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { discoveryAudio } from '../audio/discoveryAudio';

interface GalaxyCinematicEntryProps {
  onEnterSolarSystem: () => void;
  onExploreGalaxy: () => void;
  onContinueExploration: () => void;
  onOpenProgress: () => void;
  exploredCount: number;
  totalPlanets: number;
}

/**
 * Procedural 3D Milky Way Spiral Galaxy Simulation
 * 12,000 instanced/buffer particles simulating logarithmic spiral arms, core bulge, and nebula dust
 */
function SpiralGalaxy3D() {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Generate Milky Way spiral arms
  const { positions, colors } = useMemo(() => {
    const count = 14000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const arms = 4; // Milky Way has 4 major spiral arms: Scutum-Centaurus, Perseus, Norma, Sagittarius
    const maxRadius = 45;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.2) * maxRadius;
      const spinAngle = r * 0.35;
      const armAngle = ((i % arms) * ((2 * Math.PI) / arms));

      // Random scatter off the spiral spine
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.8 + r * 0.12);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.6 + r * 0.08);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.8 + r * 0.12);

      pos[i3] = Math.cos(armAngle + spinAngle) * r + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(armAngle + spinAngle) * r + randomZ;

      // Color gradation: Brilliant golden-white core transitioning to sapphire-blue spiral arms and violet periphery
      const ratio = r / maxRadius;
      if (ratio < 0.18) {
        // Galactic Bulge: Warm white / Gold
        col[i3] = 1.0;
        col[i3 + 1] = 0.92;
        col[i3 + 2] = 0.75;
      } else if (ratio < 0.65) {
        // Mid Arms: Azure Blue & Cyan OB star associations
        col[i3] = 0.22 + Math.random() * 0.2;
        col[i3 + 1] = 0.65 + Math.random() * 0.35;
        col[i3 + 2] = 1.0;
      } else {
        // Outer Rim: Deep Violet & Pink H-II Star-Forming Regions
        col[i3] = 0.75 + Math.random() * 0.25;
        col[i3 + 1] = 0.45 + Math.random() * 0.2;
        col[i3 + 2] = 0.95;
      }
    }

    return { positions: pos, colors: col };
  }, []);

  // Ambient Galactic Dust Clouds
  const dustData = useMemo(() => {
    const dustCount = 4500;
    const pos = new Float32Array(dustCount * 3);
    const col = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 40 + 2;
      pos[i3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 4;
      pos[i3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 4;

      col[i3] = 0.25;
      col[i3 + 1] = 0.12;
      col[i3 + 2] = 0.45;
    }

    return { pos, col };
  }, []);

  // Continuous Majestic Rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.025;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.08;
      // Gentle breathing pulse
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group rotation={[Math.PI * 0.28, 0, Math.PI * 0.08]}>
      {/* 1. Core Luminous Bulge */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial color="#FDE68A" transparent opacity={0.65} />
      </mesh>

      {/* 2. Galactic Starfield Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. Deep Cosmic Nebula Dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustData.pos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[dustData.col, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          vertexColors
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 4. Sol System Location Beacon (Orion Arm ~26,000 light-years from core) */}
      <group position={[16.5, 0.4, 8.5]}>
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
        <mesh>
          <ringGeometry args={[0.55, 0.72, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Camera Motion Controller responding to mouse position for cinematic parallax
 */
function CameraRig() {
  useFrame((state) => {
    const x = state.pointer.x * 4;
    const y = state.pointer.y * 3;
    state.camera.position.x += (x - state.camera.position.x) * 0.03;
    state.camera.position.y += (18 + y - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export const GalaxyCinematicEntry: React.FC<GalaxyCinematicEntryProps> = ({
  onEnterSolarSystem,
  onExploreGalaxy,
  onContinueExploration,
  onOpenProgress,
  exploredCount,
  totalPlanets,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(discoveryAudio.getIsSfxMuted());

  const handleToggleMute = () => {
    const next = discoveryAudio.toggleSfxMute();
    discoveryAudio.toggleVoiceMute();
    setIsMuted(next);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#02050D] font-sans text-[#F8FAFC] select-none flex flex-col justify-between">
      {/* 1. Realtime 3D WebGL Milky Way Simulation */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 22, 36], fov: 48, near: 0.1, far: 500 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#02050D']} />
          <ambientLight intensity={0.4} />
          <CameraRig />
          <SpiralGalaxy3D />
        </Canvas>
      </div>

      {/* 2. Top Aerospace Flight HUD & Audio Controls */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 pt-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#38BDF8]">
              DISCOVERY MODE 2.0 // DEEP SPACE OBSERVATORY
            </span>
            <h1 className="font-sans text-xl sm:text-2xl font-black tracking-tight text-white">
              MILKY WAY GALAXY
            </h1>
          </div>
        </div>

        {/* Audio Mute & Telemetry Readout */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio & SFX' : 'Mute Audio & SFX'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#070C1B]/80 text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition-all backdrop-blur-xl"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-[#38BDF8]" />}
          </button>

          <button
            type="button"
            onClick={onOpenProgress}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3.5 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#F59E0B]/40 hover:text-white transition-all backdrop-blur-xl"
          >
            <Trophy className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>Exploration: <strong className="text-white">{exploredCount} / {totalPlanets}</strong></span>
          </button>
        </div>
      </header>

      {/* 3. Center Target Reticle: Sol System Beacon Callout */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
        {/* Pulsing Beacon Frame */}
        <div className="relative flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-40" />
            <span className="absolute h-10 w-10 rounded-full border border-[#38BDF8]/60 animate-spin-slow" />
            <span className="relative h-4 w-4 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] shadow-[0_0_16px_#F59E0B]" />
          </div>

          <div className="mt-3 rounded-full border border-white/10 bg-[#070C1B]/85 px-4 py-1 backdrop-blur-md">
            <span className="font-mono text-xs text-[#FBBF24] font-semibold tracking-wider uppercase">
              SECTOR 001: SOL SYSTEM DETECTED
            </span>
          </div>
          <span className="mt-1 font-mono text-[10px] text-[#94A3B8]">
            Orion Cygnus Arm • 26,000 Light-Years from Galactic Center
          </span>
        </div>
      </div>

      {/* 4. Bottom Command Console & Mode Selectors */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-8 sm:px-10 flex flex-col items-center gap-5">
        {/* Cinematic Action Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Action 1: Enter Solar System (Primary Call to Action) */}
          <button
            type="button"
            onClick={() => {
              discoveryAudio.playTelemetryChime(1046);
              onEnterSolarSystem();
            }}
            className="group relative flex items-center justify-between rounded-2xl border border-[#38BDF8]/50 bg-gradient-to-r from-[#0E1E3D] via-[#07132B] to-[#0A1A3A] p-4 shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-[#38BDF8] hover:shadow-[0_0_40px_rgba(56,189,248,0.45)] transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#38BDF8]/20 text-[#38BDF8] group-hover:scale-110 transition-transform">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#38BDF8]">
                  PRIMARY INITIATIVE
                </span>
                <h3 className="font-sans text-sm font-extrabold text-white group-hover:text-[#38BDF8] transition-colors">
                  Enter Solar System
                </h3>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#38BDF8] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Action 2: Explore Galaxy (Deep Space Camera Mode) */}
          <button
            type="button"
            onClick={() => {
              discoveryAudio.playTelemetryChime(880);
              onExploreGalaxy();
            }}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#070C1B]/80 p-4 hover:border-white/25 hover:bg-[#0B1530]/90 transition-all cursor-pointer backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#94A3B8] group-hover:text-white transition-colors">
                <Eye className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  SPECTRAL SURVEY
                </span>
                <h3 className="font-sans text-sm font-bold text-[#E2E8F0] group-hover:text-white transition-colors">
                  Explore Galaxy
                </h3>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#64748B] group-hover:text-white transition-colors" />
          </button>

          {/* Action 3: Continue Exploration (Direct Jump) */}
          <button
            type="button"
            onClick={() => {
              discoveryAudio.playTelemetryChime(784);
              onContinueExploration();
            }}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#070C1B]/80 p-4 hover:border-[#F59E0B]/40 hover:bg-[#121A2E]/90 transition-all cursor-pointer backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#F59E0B]">
                  RESUME MISSION
                </span>
                <h3 className="font-sans text-sm font-bold text-[#E2E8F0] group-hover:text-white transition-colors">
                  Continue Exploration
                </h3>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F59E0B] transition-colors" />
          </button>
        </div>

        {/* Telemetry Footer Status */}
        <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-[#64748B]">
          <span>MILKY WAY DIAMETER: 100,000 LIGHT-YEARS</span>
          <span>•</span>
          <span>STELLAR POPULATION: ~100–400 BILLION STARS</span>
          <span>•</span>
          <span className="text-[#38BDF8]">CALIBRATED NASA ASTROPHYSICS</span>
        </div>
      </footer>
    </div>
  );
};

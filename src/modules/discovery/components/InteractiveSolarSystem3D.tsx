import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialId } from '../../../types';
import { PLANET_DISCOVERY_PROFILES } from '../data/discoveryData';
import { usePlanetaryTexture, useEarthCloudsTexture, useSaturnRingTexture } from '../../../utils/planetaryTextures';
import { discoveryAudio } from '../audio/discoveryAudio';
import {
  RotateCcw,
  Info,
  ChevronRight,
} from 'lucide-react';

interface InteractiveSolarSystem3DProps {
  onSelectPlanet: (planetId: CelestialId) => void;
  onBackToGalaxy: () => void;
  selectedPlanetId: CelestialId | null;
}

// Visual scaling parameters for interactive exploration
const PLANET_VISUAL_SPECS: Record<
  CelestialId,
  {
    radius: number;
    orbitDistance: number;
    orbitSpeed: number;
    tiltDeg: number;
    hasRings?: boolean;
    color: string;
  }
> = {
  sun: { radius: 3.8, orbitDistance: 0, orbitSpeed: 0, tiltDeg: 7.25, color: '#FBBF24' },
  mercury: { radius: 0.65, orbitDistance: 8.5, orbitSpeed: 1.4, tiltDeg: 0.034, color: '#94A3B8' },
  venus: { radius: 1.05, orbitDistance: 12.0, orbitSpeed: 1.15, tiltDeg: 177.3, color: '#E2BF84' },
  earth: { radius: 1.12, orbitDistance: 16.5, orbitSpeed: 0.95, tiltDeg: 23.44, color: '#38BDF8' },
  mars: { radius: 0.78, orbitDistance: 21.0, orbitSpeed: 0.78, tiltDeg: 25.19, color: '#EF4444' },
  jupiter: { radius: 2.35, orbitDistance: 28.5, orbitSpeed: 0.45, tiltDeg: 3.13, color: '#F97316' },
  saturn: { radius: 1.95, orbitDistance: 36.0, orbitSpeed: 0.32, tiltDeg: 26.73, hasRings: true, color: '#FCD34D' },
  uranus: { radius: 1.45, orbitDistance: 43.5, orbitSpeed: 0.22, tiltDeg: 97.77, hasRings: true, color: '#6EE7B7' },
  neptune: { radius: 1.42, orbitDistance: 50.0, orbitSpeed: 0.16, tiltDeg: 28.32, color: '#60A5FA' },
};

/**
 * Individual 3D Planet Mesh within the Interactive Solar System
 */
interface SolarPlanetProps {
  planetId: CelestialId;
  onSelect: (id: CelestialId) => void;
  isHovered: boolean;
  onHover: (id: CelestialId | null) => void;
  timeScale?: number;
}

const SolarPlanet: React.FC<SolarPlanetProps> = ({
  planetId,
  onSelect,
  isHovered,
  onHover,
  timeScale = 1.0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const spec = PLANET_VISUAL_SPECS[planetId];
  const texture = usePlanetaryTexture(planetId);
  const cloudsTexture = useEarthCloudsTexture();
  const ringTexture = useSaturnRingTexture();

  // Orbital angle tracking
  const angleRef = useRef<number>(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    // Orbital revolution around Sun
    if (groupRef.current && spec.orbitDistance > 0) {
      angleRef.current += delta * spec.orbitSpeed * 0.25 * timeScale;
      groupRef.current.position.x = Math.cos(angleRef.current) * spec.orbitDistance;
      groupRef.current.position.z = Math.sin(angleRef.current) * spec.orbitDistance;
    }

    // Axial rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.55;
    }
  });

  return (
    <>
      {/* 1. Orbit Path Circle */}
      {spec.orbitDistance > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[spec.orbitDistance - 0.05, spec.orbitDistance + 0.05, 128]} />
          <meshBasicMaterial
            color={isHovered ? '#38BDF8' : '#334155'}
            transparent
            opacity={isHovered ? 0.45 : 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 2. Planetary Group */}
      <group ref={groupRef}>
        {/* Tilt Group for Axial Tilt */}
        <group rotation={[0, 0, (spec.tiltDeg * Math.PI) / 180]}>
          {/* Planet Sphere */}
          <mesh
            ref={meshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(planetId);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(planetId);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              onHover(null);
              document.body.style.cursor = 'default';
            }}
          >
            <sphereGeometry args={[spec.radius, 48, 48]} />
            <meshStandardMaterial
              map={texture || null}
              color={texture ? '#FFFFFF' : spec.color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Earth Clouds Sphere */}
          {planetId === 'earth' && (
            <mesh ref={cloudsRef}>
              <sphereGeometry args={[spec.radius * 1.025, 48, 48]} />
              <meshStandardMaterial
                map={cloudsTexture || null}
                transparent
                opacity={0.4}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Saturn Ring System */}
          {planetId === 'saturn' && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[spec.radius * 1.35, spec.radius * 2.5, 64]} />
              <meshStandardMaterial
                map={ringTexture || null}
                color={ringTexture ? '#FFFFFF' : '#EAB308'}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Uranus Ring System */}
          {planetId === 'uranus' && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[spec.radius * 1.25, spec.radius * 1.6, 64]} />
              <meshBasicMaterial
                color="#6EE7B7"
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Hover / Selection Reticle Bracket */}
          {isHovered && (
            <mesh>
              <ringGeometry args={[spec.radius * 1.25, spec.radius * 1.32, 32]} />
              <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      </group>
    </>
  );
};

/**
 * Sun Core Mesh with Point Light and Corona
 */
const SolCore: React.FC<{ onSelect: (id: CelestialId) => void }> = ({ onSelect }) => {
  const sunTexture = usePlanetaryTexture('sun');
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Point Light radiating outward */}
      <pointLight position={[0, 0, 0]} intensity={3.5} distance={150} decay={1.0} color="#FFF8E7" />

      {/* Sun Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('sun');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[PLANET_VISUAL_SPECS.sun.radius, 48, 48]} />
        <meshBasicMaterial map={sunTexture || null} color={sunTexture ? '#FFFFFF' : '#FBBF24'} />
      </mesh>

      {/* Coronal Glow Halo */}
      <mesh>
        <sphereGeometry args={[PLANET_VISUAL_SPECS.sun.radius * 1.22, 32, 32]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.22} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export const InteractiveSolarSystem3D: React.FC<InteractiveSolarSystem3DProps> = ({
  onSelectPlanet,
  onBackToGalaxy,
}) => {
  const [hoveredPlanetId, setHoveredPlanetId] = useState<CelestialId | null>(null);
  const [timeScale, setTimeScale] = useState<number>(1.0);
  const [scaleMode, setScaleMode] = useState<'illustrative' | 'astronomical'>('illustrative');

  const hoveredProfile = hoveredPlanetId ? PLANET_DISCOVERY_PROFILES[hoveredPlanetId] : null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#02050D] font-sans text-[#F8FAFC] select-none">
      {/* 1. Realtime 3D Three.js Solar System Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 42, 60], fov: 45, near: 0.1, far: 1000 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#02050D']} />
          <ambientLight intensity={0.15} />

          {/* Deep Space Background Stars */}
          <Stars radius={250} depth={80} count={6000} factor={4} saturation={0.5} fade />

          {/* Sun & Core Point Light */}
          <SolCore onSelect={onSelectPlanet} />

          {/* All 8 Revolving Planets */}
          {(['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as CelestialId[]).map(
            (id) => (
              <SolarPlanet
                key={id}
                planetId={id}
                onSelect={onSelectPlanet}
                isHovered={hoveredPlanetId === id}
                onHover={setHoveredPlanetId}
                timeScale={timeScale}
              />
            )
          )}

          {/* Smooth Mouse & Touch Orbit Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={10}
            maxDistance={150}
            maxPolarAngle={Math.PI / 2 + 0.15}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* 2. Top Navigation Bar */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 pt-5 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToGalaxy}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:border-[#38BDF8]/40 hover:text-white transition-all backdrop-blur-xl"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>Galaxy View</span>
          </button>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
            <h1 className="font-sans text-sm sm:text-base font-extrabold text-white tracking-wide">
              SOLAR SYSTEM EXPLORER
            </h1>
          </div>
        </div>

        {/* Orbit Speed & Scale Controls */}
        <div className="flex items-center gap-2.5">
          {/* Time Scrubber */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/80 px-2.5 py-1 text-xs font-mono text-[#94A3B8] backdrop-blur-xl">
            <span>Speed:</span>
            <button
              type="button"
              onClick={() => setTimeScale(0.5)}
              className={`px-1.5 py-0.5 rounded ${timeScale === 0.5 ? 'bg-[#38BDF8] text-[#02050D] font-bold' : 'hover:text-white'}`}
            >
              0.5x
            </button>
            <button
              type="button"
              onClick={() => setTimeScale(1.0)}
              className={`px-1.5 py-0.5 rounded ${timeScale === 1.0 ? 'bg-[#38BDF8] text-[#02050D] font-bold' : 'hover:text-white'}`}
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => setTimeScale(2.5)}
              className={`px-1.5 py-0.5 rounded ${timeScale === 2.5 ? 'bg-[#38BDF8] text-[#02050D] font-bold' : 'hover:text-white'}`}
            >
              2.5x
            </button>
          </div>

          {/* Scale Mode Toggle */}
          <button
            type="button"
            onClick={() => setScaleMode(scaleMode === 'illustrative' ? 'astronomical' : 'illustrative')}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#070C1B]/80 px-3 py-1.5 font-mono text-xs text-[#94A3B8] hover:text-white hover:border-[#38BDF8]/40 transition-all backdrop-blur-xl capitalize"
          >
            <Info className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>{scaleMode} Scale</span>
          </button>
        </div>
      </header>

      {/* 3. Hovered Planet Live Telemetry Reticle Card */}
      {hoveredProfile && (
        <div className="pointer-events-none absolute left-6 top-20 z-20 w-80 rounded-2xl border border-[#38BDF8]/30 bg-[#070C1B]/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#38BDF8]">
                CELESTIAL TARGET
              </span>
              <h2 className="font-sans text-lg font-black text-white">{hoveredProfile.name}</h2>
            </div>
            <span className="font-mono text-xs text-[#94A3B8]">{hoveredProfile.latinName}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-[#64748B] block">Distance to Sol:</span>
              <span className="font-bold text-white">{hoveredProfile.astronomy.semiMajorAxisAU} AU</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Diameter:</span>
              <span className="font-bold text-white">
                {hoveredProfile.physics.equatorialDiameterKm.toLocaleString()} km
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block">Orbital Period:</span>
              <span className="font-bold text-white">
                {hoveredProfile.astronomy.orbitalPeriodDays.toFixed(1)} Days
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block">Gravity:</span>
              <span className="font-bold text-white">{hoveredProfile.physics.surfaceGravityMs2} m/s²</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-2.5 py-1.5 font-mono text-[10px] text-[#38BDF8]">
            <span>Click to launch Spacecraft Journey</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* 4. Bottom Horizontal Quick-Select Planetary Dock */}
      <footer className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-full max-w-4xl px-4">
        <div className="flex items-center justify-between overflow-x-auto rounded-2xl border border-white/10 bg-[#070C1B]/85 p-2 backdrop-blur-2xl shadow-2xl scrollbar-none gap-2">
          {Object.values(PLANET_DISCOVERY_PROFILES).map((p) => {
            const isHovered = hoveredPlanetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  discoveryAudio.playTelemetryChime(920);
                  onSelectPlanet(p.id);
                }}
                onMouseEnter={() => setHoveredPlanetId(p.id)}
                onMouseLeave={() => setHoveredPlanetId(null)}
                className={`group flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 font-sans text-xs transition-all ${
                  isHovered
                    ? 'border border-[#38BDF8] bg-[#38BDF8]/20 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'border border-transparent bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: p.visuals.primaryColor }}
                />
                <span className="font-semibold">{p.name}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

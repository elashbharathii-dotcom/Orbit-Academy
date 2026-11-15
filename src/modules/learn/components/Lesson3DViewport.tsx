import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';
import { LessonTrekExplorer3D } from './LessonTrekExplorer3D';
import { NasaTrekBody } from '../../../services/nasa/types';
import { WebGLErrorBoundary } from '../../../components/common/WebGLErrorBoundary';

export interface ViewportAnnotation {
  label: string;
  position: [number, number, number];
  note: string;
}

export interface Lesson3DVisualizationConfig {
  type:
    | 'trek-surface'
    | 'solar-corona'
    | 'planetary-cutaway'
    | 'spacecraft-orbit'
    | 'dna-molecule'
    | 'magnetosphere'
    | 'milky-way';
  targetBody?: string;
  title?: string;
  annotations?: ViewportAnnotation[];
}

interface Lesson3DViewportProps {
  config: Lesson3DVisualizationConfig;
  className?: string;
  onAnnotationSelect?: (annotation: ViewportAnnotation) => void;
}

/**
 * 3D Solar Coronal Loops with dynamic plasma arcs
 */
const SolarCoronaModel: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const arcsGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (arcsGroupRef.current) {
      arcsGroupRef.current.rotation.y += delta * 0.08;
      arcsGroupRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Sun Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2, 48, 48]} />
        <meshStandardMaterial
          color="#FFA500"
          emissive="#FF4500"
          emissiveIntensity={2.5}
          roughness={0.4}
        />
      </mesh>
      {/* Outer Corona Glow Shell */}
      <mesh scale={1.22}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#FDE047"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Magnetic Arc Loops */}
      <group ref={arcsGroupRef}>
        {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={idx} rotation={[rad * 0.5, rad, rad * 0.3]}>
              <mesh position={[2.1, 0, 0]}>
                <torusGeometry args={[0.7, 0.035, 16, 48, Math.PI]} />
                <meshStandardMaterial
                  color="#FEF08A"
                  emissive="#FF8C00"
                  emissiveIntensity={3.0}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

/**
 * 3D Planetary Cutaway showing Core, Mantle, and Crust layers
 */
const PlanetaryCutawayModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Metallic Inner Core */}
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.9}
          roughness={0.2}
          emissive="#B45309"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Silicate Mantle Cutaway Shell */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32, 0, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#DC2626"
          roughness={0.7}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Outer Crust Shell Cutaway */}
      <mesh>
        <sphereGeometry args={[2.3, 36, 36, 0, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.6}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Cross-section cut plane indicator */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[0.85, 2.3, 32]} />
        <meshBasicMaterial color="#1E293B" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/**
 * 3D Spacecraft Trajectory executing Hohmann Transfer
 */
const SpacecraftOrbitModel: React.FC = () => {
  const shipRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.6;
    if (shipRef.current) {
      // Elliptical transfer path: a=3.2, b=2.2
      const x = Math.cos(t) * 3.4;
      const z = Math.sin(t) * 2.2;
      shipRef.current.position.set(x, 0, z);
      shipRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group>
      {/* Central Gravitational Body (Sun / Planet) */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial color="#0284C7" emissive="#0369A1" emissiveIntensity={0.8} />
      </mesh>
      {/* Elliptical Transfer Orbit Track */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.36, 3.42, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner Orbit Track */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.84, 64]} />
        <meshBasicMaterial color="#94A3B8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Moving Spacecraft */}
      <group ref={shipRef}>
        {/* Hull */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.16, 0.6, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Solar Arrays */}
        <mesh position={[0.45, 0, 0]}>
          <boxGeometry args={[0.65, 0.02, 0.25]} />
          <meshStandardMaterial color="#1E3A8A" emissive="#3B82F6" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[-0.45, 0, 0]}>
          <boxGeometry args={[0.65, 0.02, 0.25]} />
          <meshStandardMaterial color="#1E3A8A" emissive="#3B82F6" emissiveIntensity={0.4} />
        </mesh>
        {/* Engine Glow */}
        <pointLight color="#00E5FF" intensity={2} distance={3} />
      </group>
    </group>
  );
};

/**
 * 3D DNA Double Helix with Base Pairs & Microgravity Stress Sites
 */
const DnaMoleculeModel: React.FC = () => {
  const dnaGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (dnaGroupRef.current) {
      dnaGroupRef.current.rotation.y += delta * 0.35;
    }
  });

  const basePairs = useMemo(() => {
    const list = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const y = (i - count / 2) * 0.22;
      const angle = i * 0.45;
      const r = 1.1;
      const x1 = Math.cos(angle) * r;
      const z1 = Math.sin(angle) * r;
      const x2 = Math.cos(angle + Math.PI) * r;
      const z2 = Math.sin(angle + Math.PI) * r;
      const isDamaged = i === 12 || i === 13; // simulated radiation damage marker
      list.push({ y, x1, z1, x2, z2, angle, isDamaged, idx: i });
    }
    return list;
  }, []);

  return (
    <group ref={dnaGroupRef}>
      {basePairs.map((bp) => (
        <group key={bp.idx} position={[0, bp.y, 0]}>
          {/* Rung connection cylinder */}
          <mesh rotation={[0, -bp.angle, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 2.2, 12]} />
            <meshStandardMaterial
              color={bp.isDamaged ? '#EF4444' : '#00E5FF'}
              emissive={bp.isDamaged ? '#B91C1C' : '#0284C7'}
              emissiveIntensity={bp.isDamaged ? 1.5 : 0.4}
            />
          </mesh>
          {/* Sugar-Phosphate Strand Node 1 */}
          <mesh position={[bp.x1, 0, bp.z1]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Sugar-Phosphate Strand Node 2 */}
          <mesh position={[bp.x2, 0, bp.z2]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#818CF8" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * 3D Earth Magnetosphere Bow Shock deflecting Solar Wind
 */
const MagnetosphereModel: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] -= delta * 5.0; // stream from right (+X) to left (-X)
        if (positions[i] < -6) {
          positions[i] = 6 + Math.random() * 2;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particlePositions = useMemo(() => {
    const pos = new Float32Array(350 * 3);
    for (let i = 0; i < 350; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Central Earth */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshStandardMaterial color="#1E3A8A" emissive="#0284C7" emissiveIntensity={0.5} />
      </mesh>

      {/* Bow Shock Parabolic Magnetic Barrier */}
      <group position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[2.8, 0.4, 3.5, 32, 1, true]} />
          <meshStandardMaterial
            color="#00E5FF"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      </group>

      {/* Van Allen Radiation Belts */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.18, 16, 48]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.22, 16, 48]} />
        <meshStandardMaterial color="#34D399" transparent opacity={0.25} />
      </mesh>

      {/* Solar Wind Particle Stream */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#FBBF24" transparent opacity={0.7} />
      </points>
    </group>
  );
};

/**
 * 3D Milky Way Spiral Galaxy Model
 */
const MilkyWayModel: React.FC = () => {
  const galaxyRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={galaxyRef} rotation={[0.4, 0, 0]}>
      {/* Galactic Core Sagittarius A* */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFA500" emissive="#FF4500" emissiveIntensity={2.5} />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FDE047" transparent opacity={0.25} />
      </mesh>

      {/* Spiral Arms Disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 4.2, 64]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#818CF8"
          emissiveIntensity={0.3}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Barred Central Bulge */}
      <mesh rotation={[0, 0.4, 0]}>
        <boxGeometry args={[2.6, 0.35, 0.8]} />
        <meshStandardMaterial color="#FCD34D" emissive="#F59E0B" emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

/**
 * Universal Embedded 3D Lesson Viewport
 */
export const Lesson3DViewport: React.FC<Lesson3DViewportProps> = ({
  config,
  className = '',
  onAnnotationSelect,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeAnnotation, setActiveAnnotation] = useState<ViewportAnnotation | null>(null);
  const [cameraResetCounter, setCameraResetCounter] = useState<number>(0);

  const handleResetCamera = () => {
    setCameraResetCounter((c) => c + 1);
  };

  const handleAnnotationClick = (annot: ViewportAnnotation) => {
    setActiveAnnotation(annot);
    if (onAnnotationSelect) {
      onAnnotationSelect(annot);
    }
  };

  const trekTarget = (config.targetBody || 'mars').toLowerCase() as NasaTrekBody;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border border-white/10 bg-[#030611] overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50' : className || 'w-full h-[420px]'
      }`}
    >
      {/* Top Floating Control Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-[#070C1B]/90 backdrop-blur-xl shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-sans text-xs font-bold text-white">
              {config.title || 'Interactive 3D Scientific Model'}
            </span>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] font-bold">
              {config.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#070C1B]/90 text-[#94A3B8] hover:text-white hover:bg-white/10 backdrop-blur-xl transition-all shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Viewport'}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#070C1B]/90 text-[#94A3B8] hover:text-white hover:bg-white/10 backdrop-blur-xl transition-all shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3D Canvas Stage */}
      <div className="flex-1 w-full h-full relative">
        {config.type === 'trek-surface' ? (
          <LessonTrekExplorer3D
            trekBody={trekTarget}
          />
        ) : (
          <WebGLErrorBoundary
            fallbackTitle="3D Model Schematic Mode"
            fallbackDescription="Scientific structure annotations and spatial diagrams are online. The 3D model is operating in low-resource telemetry mode."
          >
            <Canvas
              key={cameraResetCounter}
              camera={{ position: [0, 2.5, 7.5], fov: 42 }}
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
              <ambientLight intensity={0.6} color="#0F172A" />
              <directionalLight position={[15, 25, 15]} intensity={2.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00E5FF" />
              <Stars radius={180} depth={60} count={2500} factor={3.5} saturation={0.5} fade />

              <OrbitControls
                enablePan={false}
                maxDistance={25}
                minDistance={2}
                autoRotate={false}
              />

              <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
                {config.type === 'solar-corona' && <SolarCoronaModel />}
                {config.type === 'planetary-cutaway' && <PlanetaryCutawayModel />}
                {config.type === 'spacecraft-orbit' && <SpacecraftOrbitModel />}
                {config.type === 'dna-molecule' && <DnaMoleculeModel />}
                {config.type === 'magnetosphere' && <MagnetosphereModel />}
                {config.type === 'milky-way' && <MilkyWayModel />}
              </Float>
            </Canvas>
          </WebGLErrorBoundary>
        )}

        {/* Floating Annotation Callout Card */}
        {activeAnnotation && (
          <div className="absolute bottom-4 left-4 max-w-sm p-3.5 rounded-2xl border border-white/15 bg-[#070C1B]/95 backdrop-blur-2xl shadow-2xl z-20 space-y-1 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{activeAnnotation.label}</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveAnnotation(null)}
                className="text-[#94A3B8] hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#CBD5E1] leading-relaxed">
              {activeAnnotation.note}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Interactive HUD Dock */}
      {config.annotations && config.annotations.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 border-t border-white/10 bg-[#070C1B]/90 backdrop-blur-xl overflow-x-auto z-10">
          <span className="font-mono text-[10px] uppercase font-bold text-[#94A3B8] flex items-center gap-1 px-1 flex-shrink-0">
            <Compass className="w-3 h-3 text-[#38BDF8]" />
            <span>Landmarks:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {config.annotations.map((annot, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnnotationClick(annot)}
                className={`px-2.5 py-1 rounded-lg border text-left font-mono text-[10.5px] transition-all flex-shrink-0 ${
                  activeAnnotation?.label === annot.label
                    ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : 'border-white/5 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                }`}
              >
                {annot.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

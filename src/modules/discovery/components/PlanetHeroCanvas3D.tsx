import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialId } from '../../../types';
import {
  usePlanetaryTexture,
  useEarthCloudsTexture,
  useSaturnRingTexture,
} from '../../../utils/planetaryTextures';
import { WebGLErrorBoundary } from '../../../components/common/WebGLErrorBoundary';

interface PlanetHeroCanvas3DProps {
  planetId: CelestialId;
  glowColor?: string;
  primaryColor?: string;
}

/**
 * Creates radial UV mapping for planetary rings
 */
function createRadialRingGeometry(innerRadius: number, outerRadius: number, segments: number = 128) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 8);
  const pos = geometry.attributes.position;
  const uvs = geometry.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const dist = Math.sqrt(x * x + y * y);
    const u = (dist - innerRadius) / (outerRadius - innerRadius);
    uvs.setXY(i, u, 0.5);
  }
  uvs.needsUpdate = true;
  return geometry;
}

const AXIAL_TILTS: Record<CelestialId, number> = {
  sun: 0.126,
  mercury: 0.0006,
  venus: 3.096, // 177.3 deg
  earth: 0.409, // 23.44 deg
  mars: 0.44,   // 25.19 deg
  jupiter: 0.054,// 3.13 deg
  saturn: 0.466, // 26.73 deg
  uranus: 1.706, // 97.77 deg
  neptune: 0.494,// 28.32 deg
};

const ATMOSPHERE_GLOW_COLORS: Record<CelestialId, string> = {
  sun: '#F59E0B',
  mercury: '#94A3B8',
  venus: '#F59E0B',
  earth: '#38BDF8',
  mars: '#EF4444',
  jupiter: '#FB923C',
  saturn: '#FCD34D',
  uranus: '#22D3EE',
  neptune: '#3B82F6',
};

const PlanetHeroSphere: React.FC<{ planetId: CelestialId }> = ({ planetId }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load official high-res photographic maps with zero-frame fallback
  const texture = usePlanetaryTexture(planetId);
  const cloudsTexture = useEarthCloudsTexture();
  const saturnRingTexture = useSaturnRingTexture();

  // Axial tilt in radians
  const axialTiltRad = AXIAL_TILTS[planetId] || 0.4;
  const glowHex = ATMOSPHERE_GLOW_COLORS[planetId] || '#38BDF8';

  // Base sphere radius: scaled so the upper dome crests behind the centered title & CTA
  const radius = 2.45;

  // Saturn rings geometry
  const saturnRingGeometry = useMemo(() => {
    if (planetId !== 'saturn') return null;
    return createRadialRingGeometry(radius * 1.35, radius * 2.65, 128);
  }, [planetId, radius]);

  // Uranus delicate ring
  const uranusRingGeometry = useMemo(() => {
    if (planetId !== 'uranus') return null;
    return createRadialRingGeometry(radius * 1.25, radius * 1.7, 96);
  }, [planetId, radius]);

  // Subtle continuous rotation and animated planetary movement
  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.065;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -1.82, 0]}
      rotation={[axialTiltRad * 0.35, 0, axialTiltRad * 0.45]}
    >
      {/* 1. Main Planetary Surface Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={planetId === 'mercury' || planetId === 'mars' ? 0.88 : 0.45}
          metalness={planetId === 'mercury' ? 0.25 : 0.08}
        />
      </mesh>

      {/* 2. Earth Clouds Layer */}
      {planetId === 'earth' && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.012, 64, 64]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.48}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 3. Saturn Ring System */}
      {planetId === 'saturn' && saturnRingGeometry && (
        <mesh geometry={saturnRingGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            map={saturnRingTexture || null}
            color={saturnRingTexture ? '#FFFFFF' : '#EAB308'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
            roughness={0.7}
          />
        </mesh>
      )}

      {/* 4. Uranus Delicate Ring */}
      {planetId === 'uranus' && uranusRingGeometry && (
        <mesh geometry={uranusRingGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#A5F3FC"
            side={THREE.DoubleSide}
            transparent
            opacity={0.45}
            roughness={0.8}
          />
        </mesh>
      )}

      {/* 5. Atmospheric Fresnel Rim Glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.025, 48, 48]} />
        <meshBasicMaterial
          color={glowHex}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const PlanetHeroCanvas3D: React.FC<PlanetHeroCanvas3DProps> = ({
  planetId,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <WebGLErrorBoundary fallbackTitle="Planetary Canvas" fallbackHeight="h-full">
        <Canvas
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: [0, 0, 4.8],
            fov: 44,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]}
        >
          {/* Deep Space Ambient Lighting */}
          <ambientLight intensity={0.24} />

          {/* Primary Sun Directional Keylight */}
          <directionalLight
            position={[-5, 3.2, 4]}
            intensity={2.1}
            color="#FFFBEB"
          />

          {/* Subtle Celestial Rim Light */}
          <directionalLight
            position={[5, -2, -3]}
            intensity={0.35}
            color="#38BDF8"
          />

          {/* Star-Filled Milky Way Background */}
          <Stars
            radius={90}
            depth={50}
            count={3200}
            factor={3.8}
            saturation={0}
            fade
            speed={0.4}
          />

          {/* Animated 3D Planet */}
          <PlanetHeroSphere planetId={planetId} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getPlanetarySurfaceTexture } from '../../utils/planetaryTextures';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface SunProps {
  radius?: number;
}

/**
 * Ultra-Realistic Central Star (Sol) — Phase 6C
 * 
 * Features:
 * - High-resolution 2K SDO/SOHO convective photosphere map
 * - Multi-layer dynamic plasma rotation simulating solar differential rotation
 * - Restrained physical coronal halo (additive Fresnel falloff)
 * - Calibrated photometric point light casting shadows across the planetary system
 * - Interactive reset to Macro System Overview upon click
 */
export const Sun: React.FC<SunProps> = ({ radius = 4.6 }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const plasmaLayerRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);

  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === 'sun';
  const isHovered = hoveredPlanetId === 'sun';

  // 2K SDO Photosphere texture with procedural fallback
  const sunTexture = useMemo(() => getPlanetarySurfaceTexture('sun'), []);

  useFrame((_, delta) => {
    // 1. Equatorial photosphere rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.035;
    }

    // 2. Turbulent convective plasma counter-rotation
    if (plasmaLayerRef.current) {
      plasmaLayerRef.current.rotation.y -= delta * 0.02;
      plasmaLayerRef.current.rotation.z += delta * 0.01;
    }

    // 3. Coronal breath
    if (coronaRef.current) {
      coronaRef.current.rotation.y += delta * 0.012;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectPlanet(null);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredPlanet('sun');
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredPlanet(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Primary Photometric Point Light Source */}
      <pointLight
        color="#FFFBF2"
        intensity={3.4}
        distance={320}
        decay={0.3}
        castShadow
        shadow-bias={-0.0002}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 2. Soft Chromospheric Fill Light */}
      <pointLight
        color="#FEF08A"
        intensity={0.9}
        distance={140}
        decay={0.4}
      />

      {/* 3. Photosphere Globe (SDO / SOHO Photographic Surface) */}
      <mesh
        ref={coreRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          map={sunTexture}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Convective Plasma Haze Layer (Simulates boiling solar granules) */}
      <mesh ref={plasmaLayerRef} scale={[1.008, 1.008, 1.008]}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          map={sunTexture}
          transparent={true}
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* 5. Inner Solar Corona (Restrained Additive Limb Halo) */}
      <mesh ref={coronaRef} scale={[1.055, 1.055, 1.055]}>
        <sphereGeometry args={[radius, 36, 36]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent={true}
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* 6. Outer Subtle Radiant Haze (Non-intrusive soft glow) */}
      <mesh ref={outerGlowRef} scale={[1.18, 1.18, 1.18]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#D97706"
          transparent={true}
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* 7. Minimal Mission Control Label */}
      <Html
        position={[0, radius * 1.38, 0]}
        center
        distanceFactor={38}
        zIndexRange={[10, 30]}
        className="pointer-events-auto select-none"
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="Sol: Mission Control & Home"
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          className={`flex items-center gap-1.5 rounded-md border px-2 py-0.5 backdrop-blur-md transition-all cursor-pointer ${
            isHovered || isSelected
              ? 'border-[#F59E0B] bg-[#0A0F1D]/90 text-[#F59E0B]'
              : 'border-transparent bg-[#0A0F1D]/40 text-[#94A3B8]'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
            SOL // MISSION CONTROL
          </span>
        </div>
      </Html>
    </group>
  );
};

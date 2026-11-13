import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getSunTexture } from '../../utils/textureGenerator';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface SunProps {
  radius?: number;
}

/**
 * Luminous Central Star (Sol)
 * Features:
 * - Granular convective surface texture with sunspot clusters
 * - Interactive click: clicking Sol returns camera to Macro System Overview
 * - Coronal radiance halos & point light source
 */
export const Sun: React.FC<SunProps> = ({ radius = 4.6 }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerHaloRef = useRef<THREE.Mesh>(null);

  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === 'sun';
  const isHovered = hoveredPlanetId === 'sun';

  const sunTexture = useMemo(() => getSunTexture(), []);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.04;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.025;
      coronaRef.current.rotation.z += delta * 0.012;
    }
    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.y += delta * 0.008;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Clicking Sol resets to macro overview or selects Sun
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
      {/* 1. Primary Solar Point Light Source */}
      <pointLight
        color="#FFF9ED"
        intensity={3.2}
        distance={250}
        decay={0.35}
        castShadow
      />

      {/* 2. Soft Ambient Chromosphere Fill */}
      <pointLight
        color="#FDE68A"
        intensity={1.2}
        distance={120}
        decay={0.45}
      />

      {/* 3. Textured Solar Surface Sphere */}
      <mesh
        ref={coreRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          map={sunTexture}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Inner Coronal Flare Halo */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.09, 36, 36]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* 5. Outer Diffuse Radiance Corona */}
      <mesh ref={outerHaloRef}>
        <sphereGeometry args={[radius * 1.28, 32, 32]} />
        <meshBasicMaterial
          color="#D97706"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* 6. Minimal Sol Label */}
      <Html
        position={[0, radius * 1.4, 0]}
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

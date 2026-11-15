import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MoonDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useMoonTexture } from '../../utils/planetaryTextures';
import { setCelestialPosition } from '../../utils/celestialRegistry';

interface PlanetMoonProps {
  moon: MoonDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * ORBIT ACADEMY — AAA PLANETARY MOON (NATURAL SATELLITE)
 * 
 * Renders an authentic 3D natural satellite orbiting its parent planet in local coordinates:
 * - Geologically classified procedural surface mapping (cratered, icy, volcanic, grooved, methane, smooth)
 * - Keplerian-inspired local orbital motion with axial spin
 * - Local hairline orbital trajectory ring with dynamic focus highlights
 * - Realtime world-coordinate registration for cinematic camera zoom & tracking
 * - Interactive pointer selection and hover reticle
 */
export const PlanetMoon: React.FC<PlanetMoonProps> = ({
  moon,
  speedScale = 0.45,
  initialAngleOffset = 0,
}) => {
  const moonGroupRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(initialAngleOffset);
  const worldPosVec = useMemo(() => new THREE.Vector3(), []);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { selectedMoonId, selectMoon } = useSolarSystem();
  const isSelected = selectedMoonId === moon.id;

  const {
    id,
    name,
    visualRadius,
    orbitRadius,
    orbitSpeedMultiplier,
    primaryColor,
    textureType,
  } = moon;

  // Reactively loaded geological procedural texture
  const texture = useMoonTexture(id, textureType, primaryColor);

  useFrame((_, delta) => {
    // 1. Orbital Revolution around parent planet
    angleRef.current += delta * orbitSpeedMultiplier * speedScale * 0.8;
    const x = Math.cos(angleRef.current) * orbitRadius;
    const z = Math.sin(angleRef.current) * orbitRadius;

    if (moonGroupRef.current) {
      moonGroupRef.current.position.set(x, 0, z);

      // Register world coordinates for camera zoom controller
      moonGroupRef.current.getWorldPosition(worldPosVec);
      setCelestialPosition(id, worldPosVec);
    }

    // 2. Axial Spin (tidally locked or proportional)
    if (moonMeshRef.current) {
      moonMeshRef.current.rotation.y += delta * 0.5 * speedScale;
    }
  });

  return (
    <>
      {/* 1. Local Moon Orbit Ring Trajectory */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.025, orbitRadius + 0.025, 64]} />
        <meshBasicMaterial
          color={isSelected ? '#38BDF8' : isHovered ? '#67E8F9' : '#38BDF8'}
          transparent={true}
          opacity={isSelected ? 0.45 : isHovered ? 0.22 : 0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Moon Body */}
      <group
        ref={moonGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          if (selectMoon) selectMoon(moon.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <mesh ref={moonMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[visualRadius, 32, 32]} />
          <meshStandardMaterial
            map={texture}
            color="#FFFFFF"
            roughness={textureType === 'ice' ? 0.52 : 0.88}
            metalness={textureType === 'ice' ? 0.12 : 0.03}
            emissive={isSelected ? '#38BDF8' : isHovered ? '#0284C7' : '#0B132B'}
            emissiveIntensity={isSelected ? 0.35 : isHovered ? 0.18 : 0.04}
          />
        </mesh>

        {/* Selected Moon Reticle Ring */}
        {isSelected && (
          <mesh scale={[1.45, 1.45, 1.45]}>
            <sphereGeometry args={[visualRadius, 16, 16]} />
            <meshBasicMaterial
              color="#38BDF8"
              wireframe={true}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        )}

        {/* Floating Moon Badge on Hover or Selection */}
        {(isSelected || isHovered) && (
          <Html
            position={[0, visualRadius * 1.6, 0]}
            center
            distanceFactor={38}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none whitespace-nowrap rounded-md border border-cyan-400/40 bg-[#070D1E]/90 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)] backdrop-blur-md">
              {name}
            </div>
          </Html>
        )}
      </group>
    </>
  );
};

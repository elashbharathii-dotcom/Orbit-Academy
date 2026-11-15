import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MoonDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface PlanetMoonProps {
  moon: MoonDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * ORBIT ACADEMY — PLANETARY MOON (NATURAL SATELLITE)
 * 
 * Renders an authentic 3D natural satellite orbiting its parent planet in local coordinates:
 * - Keplerian-inspired local orbital motion
 * - Local hairline orbital trajectory ring
 * - Selection / hover state with cyan reticle
 * - Interactive pointer selection
 */
export const PlanetMoon: React.FC<PlanetMoonProps> = ({
  moon,
  speedScale = 0.45,
  initialAngleOffset = 0,
}) => {
  const moonGroupRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef<number>(initialAngleOffset);

  const { selectedMoonId, selectMoon } = useSolarSystem();
  const isSelected = selectedMoonId === moon.id;

  const {
    visualRadius,
    orbitRadius,
    orbitSpeedMultiplier,
    primaryColor,
  } = moon;

  useFrame((_, delta) => {
    // 1. Orbital Revolution around parent planet
    angleRef.current += delta * orbitSpeedMultiplier * speedScale * 0.8;
    const x = Math.cos(angleRef.current) * orbitRadius;
    const z = Math.sin(angleRef.current) * orbitRadius;

    if (moonGroupRef.current) {
      moonGroupRef.current.position.set(x, 0, z);
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
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 64]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent={true}
          opacity={isSelected ? 0.35 : 0.08}
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
      >
        <mesh ref={moonMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[visualRadius, 24, 24]} />
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.88}
            metalness={0.05}
          />
        </mesh>

        {/* Selected Moon Reticle Pip */}
        {isSelected && (
          <mesh scale={[1.4, 1.4, 1.4]}>
            <sphereGeometry args={[visualRadius, 16, 16]} />
            <meshBasicMaterial
              color="#38BDF8"
              wireframe={true}
              transparent={true}
              opacity={0.65}
            />
          </mesh>
        )}
      </group>
    </>
  );
};

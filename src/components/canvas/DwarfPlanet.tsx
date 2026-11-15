import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DwarfPlanetDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { setCelestialPosition } from '../../utils/celestialRegistry';

interface DwarfPlanetProps {
  data: DwarfPlanetDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * ORBIT ACADEMY — DWARF PLANET (Pluto, Ceres, Haumea, Makemake, Eris)
 * 
 * Features:
 * - Keplerian orbital revolution and continuous coordinate registration
 * - Special geometry for Haumea (triaxial elongated ellipsoid)
 * - Binary companion Charon for Pluto
 * - Interactive pointer selection and hover reticles
 */
export const DwarfPlanet: React.FC<DwarfPlanetProps> = ({
  data,
  speedScale = 0.45,
  initialAngleOffset = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const charonRef = useRef<THREE.Group>(null);
  const angleRef = useRef<number>(initialAngleOffset);
  const worldPosVec = useMemo(() => new THREE.Vector3(), []);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { selectedDwarfPlanetId, selectDwarfPlanet, viewingMode } = useSolarSystem();
  const isSelected = selectedDwarfPlanetId === data.id;

  const {
    id,
    name,
    orbitRadius,
    visualRadius,
    primaryColor,
  } = data;

  const isScientific = viewingMode === 'scientific';
  const effectiveOrbitRadius = isScientific ? orbitRadius * 1.15 : orbitRadius;

  useFrame((_, delta) => {
    // 1. Orbital revolution
    const speed = (0.35 / Math.sqrt(effectiveOrbitRadius)) * speedScale;
    angleRef.current += delta * speed * 0.35;

    const x = Math.cos(angleRef.current) * effectiveOrbitRadius;
    const z = Math.sin(angleRef.current) * effectiveOrbitRadius;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);

      // Register world position for camera controller
      groupRef.current.getWorldPosition(worldPosVec);
      setCelestialPosition(id, worldPosVec);
    }

    // 2. Axial rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.6;
    }

    // 3. Pluto's binary companion Charon
    if (id === 'pluto' && charonRef.current) {
      charonRef.current.rotation.y += delta * 1.8 * speedScale;
    }
  });

  return (
    <group>
      {/* 1. Subordinate Hairline Orbit Trajectory */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[effectiveOrbitRadius - 0.04, effectiveOrbitRadius + 0.04, 96]} />
        <meshBasicMaterial
          color={isSelected ? '#38BDF8' : '#64748B'}
          transparent={true}
          opacity={isSelected ? 0.38 : 0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Dwarf Planet Body */}
      <group
        ref={groupRef}
        position={[effectiveOrbitRadius, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (selectDwarfPlanet) selectDwarfPlanet(id);
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
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          scale={id === 'haumea' ? [1.4, 0.8, 0.7] : [1, 1, 1]}
        >
          <sphereGeometry args={[visualRadius, 32, 32]} />
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.85}
            metalness={0.04}
            emissive={isSelected ? primaryColor : isHovered ? '#38BDF8' : '#0B132B'}
            emissiveIntensity={isSelected ? 0.28 : isHovered ? 0.15 : 0.04}
          />
        </mesh>

        {/* Selected Reticle */}
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

        {/* Binary Companion Charon for Pluto */}
        {id === 'pluto' && (
          <group ref={charonRef}>
            <group position={[visualRadius * 2.8, 0, 0]}>
              <mesh castShadow receiveShadow>
                <sphereGeometry args={[visualRadius * 0.52, 20, 20]} />
                <meshStandardMaterial
                  color="#94A3B8"
                  roughness={0.92}
                  metalness={0.02}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* Floating Reticle Badge on Hover or Selection */}
        {(isSelected || isHovered) && (
          <Html
            position={[0, visualRadius * 1.8, 0]}
            center
            distanceFactor={40}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none whitespace-nowrap rounded-md border border-amber-400/40 bg-[#070D1E]/95 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] backdrop-blur-md">
              {name} (Dwarf Planet)
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBodyDefinition } from '../../types';

interface PlanetProps {
  data: CelestialBodyDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * 3D Celestial Body (Planet)
 * Implements:
 * 1. Continuous orbital revolution in the XZ plane around Sol.
 * 2. Scientifically aligned axial tilt (Z-axis).
 * 3. Individual axial rotation about its tilted Y-axis.
 * 4. Realistic MeshStandardMaterial responding to central Sun illumination (day/night terminators).
 * 5. Distinct planetary ring geometries for Saturn and Uranus.
 */
export const Planet: React.FC<PlanetProps> = ({
  data,
  speedScale = 0.4,
  initialAngleOffset = 0,
}) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const ringsMeshRef = useRef<THREE.Mesh>(null);
  
  // Track orbital angle over time
  const angleRef = useRef<number>(initialAngleOffset);

  const {
    visualRadius,
    visualOrbitRadius,
    orbitSpeedMultiplier,
    rotationSpeedMultiplier,
    axialTiltDeg,
    primaryColor,
    secondaryColor,
    hasRings,
  } = data.visual;

  // Axial tilt in radians
  const axialTiltRad = THREE.MathUtils.degToRad(axialTiltDeg);

  useFrame((_, delta) => {
    // 1. Orbital Revolution
    if (orbitGroupRef.current && visualOrbitRadius > 0) {
      angleRef.current += delta * orbitSpeedMultiplier * speedScale;
      orbitGroupRef.current.position.x = Math.cos(angleRef.current) * visualOrbitRadius;
      orbitGroupRef.current.position.z = Math.sin(angleRef.current) * visualOrbitRadius;
    }

    // 2. Axial Rotation
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += delta * rotationSpeedMultiplier * 0.8;
    }

    // 3. Ring Rotation (synchronized with axial tilt)
    if (ringsMeshRef.current) {
      ringsMeshRef.current.rotation.z += delta * rotationSpeedMultiplier * 0.4;
    }
  });

  return (
    <group ref={orbitGroupRef} position={[visualOrbitRadius, 0, 0]}>
      {/* Tilt Container: Applies the planet's specific axial inclination */}
      <group rotation={[0, 0, axialTiltRad]}>
        
        {/* Planet Surface Sphere */}
        <mesh ref={planetMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[visualRadius, 36, 36]} />
          <meshStandardMaterial
            color={primaryColor}
            roughness={0.75}
            metalness={0.1}
          />
        </mesh>

        {/* Earth Specular Atmospheric Glow / Cloud Hint */}
        {data.id === 'earth' && (
          <mesh scale={[1.025, 1.025, 1.025]}>
            <sphereGeometry args={[visualRadius, 32, 32]} />
            <meshStandardMaterial
              color="#BAE6FD"
              transparent
              opacity={0.22}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              roughness={1.0}
            />
          </mesh>
        )}

        {/* Saturn Ring System */}
        {hasRings && data.id === 'saturn' && (
          <mesh ref={ringsMeshRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[visualRadius * 1.45, visualRadius * 2.5, 64]} />
            <meshStandardMaterial
              color={secondaryColor || '#D8C29D'}
              side={THREE.DoubleSide}
              transparent
              opacity={0.88}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        )}

        {/* Uranus Thin Dust Ring System */}
        {hasRings && data.id === 'uranus' && (
          <mesh ref={ringsMeshRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[visualRadius * 1.35, visualRadius * 1.6, 48]} />
            <meshStandardMaterial
              color="#55BCA5"
              side={THREE.DoubleSide}
              transparent
              opacity={0.35}
              roughness={0.9}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

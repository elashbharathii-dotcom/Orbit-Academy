import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBodyDefinition } from '../../types';
import { AtmosphereRim } from './AtmosphereRim';
import {
  getMercuryTexture,
  getVenusTexture,
  getEarthSurfaceTexture,
  getEarthCloudTexture,
  getMarsTexture,
  getJupiterTexture,
  getSaturnSurfaceTexture,
  getSaturnRingTexture,
  getUranusTexture,
  getNeptuneTexture,
} from '../../utils/textureGenerator';

interface PlanetProps {
  data: CelestialBodyDefinition;
  speedScale?: number;
  initialAngleOffset?: number;
}

/**
 * High-Realism 3D Celestial Body (Planet)
 * Features:
 * - Scientifically calibrated procedural surface textures
 * - Real day/night terminator lines cast by Sol
 * - Dual-layer dynamic atmosphere & rotating cloud systems for Earth
 * - Multi-band translucent ring system for Saturn (Cassini Division)
 * - Atmospheric Rayleigh Fresnel rims for Earth, Venus, Uranus, and Neptune
 * - Precise axial inclinations and continuous orbital revolutions
 */
export const Planet: React.FC<PlanetProps> = ({
  data,
  speedScale = 0.45,
  initialAngleOffset = 0,
}) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const ringsMeshRef = useRef<THREE.Mesh>(null);

  // Track orbital position angle over time
  const angleRef = useRef<number>(initialAngleOffset);

  const { id } = data;
  const {
    visualRadius,
    visualOrbitRadius,
    orbitSpeedMultiplier,
    rotationSpeedMultiplier,
    axialTiltDeg,
    primaryColor,
    hasRings,
  } = data.visual;

  // Retrieve cached high-resolution procedural textures
  const surfaceTexture = useMemo(() => {
    switch (id) {
      case 'mercury':
        return getMercuryTexture();
      case 'venus':
        return getVenusTexture();
      case 'earth':
        return getEarthSurfaceTexture();
      case 'mars':
        return getMarsTexture();
      case 'jupiter':
        return getJupiterTexture();
      case 'saturn':
        return getSaturnSurfaceTexture();
      case 'uranus':
        return getUranusTexture();
      case 'neptune':
        return getNeptuneTexture();
      default:
        return null;
    }
  }, [id]);

  const earthCloudsTexture = useMemo(() => {
    return id === 'earth' ? getEarthCloudTexture() : null;
  }, [id]);

  const saturnRingTexture = useMemo(() => {
    return id === 'saturn' ? getSaturnRingTexture() : null;
  }, [id]);

  // Convert axial inclination to radians
  const axialTiltRad = THREE.MathUtils.degToRad(axialTiltDeg);

  useFrame((_, delta) => {
    // 1. Orbital Revolution around Sol
    if (orbitGroupRef.current && visualOrbitRadius > 0) {
      angleRef.current += delta * orbitSpeedMultiplier * speedScale;
      orbitGroupRef.current.position.x = Math.cos(angleRef.current) * visualOrbitRadius;
      orbitGroupRef.current.position.z = Math.sin(angleRef.current) * visualOrbitRadius;
    }

    // 2. Axial Planetary Rotation
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += delta * rotationSpeedMultiplier * 0.8;
    }

    // 3. Earth Dynamic Cloud Drift (slightly faster than crust rotation for atmospheric realism)
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += delta * rotationSpeedMultiplier * 0.95;
    }

    // 4. Ring System Alignment
    if (ringsMeshRef.current) {
      ringsMeshRef.current.rotation.z += delta * rotationSpeedMultiplier * 0.2;
    }
  });

  return (
    <group ref={orbitGroupRef} position={[visualOrbitRadius, 0, 0]}>
      {/* Axial Tilt Container */}
      <group rotation={[0, 0, axialTiltRad]}>
        
        {/* 1. Main Planet Surface Sphere */}
        <mesh ref={planetMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[visualRadius, 48, 48]} />
          <meshStandardMaterial
            map={surfaceTexture}
            color={surfaceTexture ? '#FFFFFF' : primaryColor}
            roughness={id === 'earth' ? 0.6 : 0.85}
            metalness={0.05}
          />
        </mesh>

        {/* 2. Earth: Dynamic Swirling Cloud Layer */}
        {id === 'earth' && earthCloudsTexture && (
          <mesh ref={cloudsMeshRef} scale={[1.018, 1.018, 1.018]}>
            <sphereGeometry args={[visualRadius, 40, 40]} />
            <meshStandardMaterial
              map={earthCloudsTexture}
              transparent={true}
              opacity={0.88}
              blending={THREE.NormalBlending}
              depthWrite={false}
              roughness={1.0}
            />
          </mesh>
        )}

        {/* 3. Earth: Rayleigh Atmospheric Scattering Rim */}
        {id === 'earth' && (
          <AtmosphereRim radius={visualRadius} color="#38BDF8" intensity={1.15} falloff={2.6} />
        )}

        {/* 4. Venus: Dense Sulfuric Atmosphere Rim */}
        {id === 'venus' && (
          <AtmosphereRim radius={visualRadius} color="#FDE68A" intensity={0.9} falloff={3.0} />
        )}

        {/* 5. Uranus: Aquamarine Methane Atmospheric Rim */}
        {id === 'uranus' && (
          <AtmosphereRim radius={visualRadius} color="#5EEAD4" intensity={1.1} falloff={2.5} />
        )}

        {/* 6. Neptune: Royal Azure Methane Atmospheric Rim */}
        {id === 'neptune' && (
          <AtmosphereRim radius={visualRadius} color="#3B82F6" intensity={1.2} falloff={2.4} />
        )}

        {/* 7. Saturn: High-Definition Ring System with Cassini Division */}
        {hasRings && id === 'saturn' && (
          <mesh ref={ringsMeshRef} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[visualRadius * 1.45, visualRadius * 2.6, 96]} />
            <meshStandardMaterial
              map={saturnRingTexture || undefined}
              color="#EADBBE"
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.92}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        )}

        {/* 8. Uranus: Delicate Tilted Dust Ring System */}
        {hasRings && id === 'uranus' && (
          <mesh ref={ringsMeshRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[visualRadius * 1.35, visualRadius * 1.62, 64]} />
            <meshStandardMaterial
              color="#5EEAD4"
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.32}
              roughness={0.9}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSunTexture } from '../../utils/textureGenerator';

interface SunProps {
  radius?: number;
}

/**
 * Luminous Central Star (Sol)
 * Features:
 * - Granular convective surface texture with sunspot clusters
 * - Multi-layer additive coronal halos simulating dynamic flares
 * - Core point-light emitter delivering realistic day/night shadows across all 8 planets
 */
export const Sun: React.FC<SunProps> = ({ radius = 4.6 }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerHaloRef = useRef<THREE.Mesh>(null);

  // Retrieve cached high-resolution procedural solar texture
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
      <mesh ref={coreRef}>
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
    </group>
  );
};

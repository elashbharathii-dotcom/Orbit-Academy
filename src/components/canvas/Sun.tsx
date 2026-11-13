import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
  radius?: number;
}

/**
 * Luminous Central Star (Sol)
 * Acts as the primary point-light emitter for the entire 3D solar system.
 * Features an emissive core, atmospheric coronal halo, and slow axial spin.
 */
export const Sun: React.FC<SunProps> = ({ radius = 4.6 }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const outerHaloRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.03;
      coronaRef.current.rotation.z += delta * 0.015;
    }
    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Solar Point Light Source */}
      {/* Distance is set high enough to reach Neptune at orbit radius 51.5 */}
      <pointLight
        color="#FFF6E5"
        intensity={2.8}
        distance={220}
        decay={0.4}
      />

      {/* Secondary Soft Fill Light to avoid harsh specular clipping */}
      <pointLight
        color="#FDE68A"
        intensity={1.0}
        distance={100}
        decay={0.5}
      />

      {/* 1. Emissive Solar Core Mesh */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color="#FDE047"
          toneMapped={false}
        />
      </mesh>

      {/* 2. Inner Coronal Glow Shell */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[radius * 1.08, 36, 36]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Outer Diffuse Radiance Glow Shell */}
      <mesh ref={outerHaloRef}>
        <sphereGeometry args={[radius * 1.25, 32, 32]} />
        <meshBasicMaterial
          color="#D97706"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

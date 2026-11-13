import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMilkyWayTexture } from '../../utils/planetaryTextures';

interface MilkyWayBackgroundProps {
  radius?: number;
  opacity?: number;
}

/**
 * Deep Space Milky Way Panorama (Phase 6C)
 * 
 * Features:
 * - Genuine all-sky astronomical survey projection (ESA Gaia / Tycho-2)
 * - Restrained, realistic luminosity avoiding exaggerated fantasy nebulae
 * - Inside-out sphere rendering at boundary of celestial far plane
 * - Extremely slow cosmological axial drift
 */
export const MilkyWayBackground: React.FC<MilkyWayBackgroundProps> = ({
  radius = 650,
  opacity = 0.45,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => getMilkyWayTexture(), []);

  // Subtle cosmological orientation drift
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.0004;
      meshRef.current.rotation.x += delta * 0.0002;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[radius, 48, 32]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

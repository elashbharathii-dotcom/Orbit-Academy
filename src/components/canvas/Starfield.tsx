import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

/**
 * Multi-layer deep space starfield with realistic astronomical color variation
 * and subtle twinkling depth.
 */
export const Starfield: React.FC<StarfieldProps> = ({ count = 2400 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate spherical distribution of stars with authentic stellar color classes
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Stellar spectral classification colors (O/B: blue-white, A/F: white, G: yellow, K/M: orange-red)
    const stellarHues = [
      new THREE.Color('#F8FAFC'), // Pure White
      new THREE.Color('#BFDBFE'), // Class O/B Blue-White
      new THREE.Color('#BAE6FD'), // Pale Cyan
      new THREE.Color('#FEF08A'), // Class G Solar Yellow
      new THREE.Color('#FED7AA'), // Class K Orange-Amber
    ];

    for (let i = 0; i < count; i++) {
      // Uniform spherical surface distribution at radius 200–350
      const radius = 180 + Math.random() * 150;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      pos[i * 3] = radius * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Pick a random spectral class color
      const color = stellarHues[Math.floor(Math.random() * stellarHues.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  // Subtle rotation of the stellar sphere to simulate cosmological stillness
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.0012;
      pointsRef.current.rotation.x += delta * 0.0006;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

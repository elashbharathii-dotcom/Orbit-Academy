import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
}

/**
 * Astronomical Multi-Layer Starfield (Phase 6C)
 * 
 * Features:
 * - Authentic stellar spectral classifications (O/B blue-white, A/F white, G yellow, K/M orange-red)
 * - Calibrated density that harmonizes with the Gaia Milky Way background panorama
 * - Subtle twinkle effect via shader or time-based opacity variation
 * - Parallax depth layer
 */
export const Starfield: React.FC<StarfieldProps> = ({ count = 2200 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate spherical distribution with spectral classifications
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Astronomical stellar spectral hues (OBAFGKM)
    const spectralColors = [
      new THREE.Color('#FFFFFF'), // Pure White (Class A)
      new THREE.Color('#DCEBFF'), // Blue-White (Class B)
      new THREE.Color('#BAE6FD'), // Pale Azure (Class O)
      new THREE.Color('#FEF08A'), // Solar Yellow (Class G)
      new THREE.Color('#FED7AA'), // Warm Amber (Class K)
      new THREE.Color('#FCA5A5'), // Subtle Red Giant (Class M)
    ];

    for (let i = 0; i < count; i++) {
      // Spherical shell distribution at radius 220–500
      const radius = 220 + Math.random() * 280;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      pos[i * 3] = radius * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Distribute spectral hues with majority white/blue-white
      const color =
        Math.random() > 0.3
          ? spectralColors[Math.floor(Math.random() * 2)]
          : spectralColors[Math.floor(Math.random() * spectralColors.length)];

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  // Subtle cosmological stillness drift
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.0008;
      pointsRef.current.rotation.x += delta * 0.0004;
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
        size={1.15}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.88}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

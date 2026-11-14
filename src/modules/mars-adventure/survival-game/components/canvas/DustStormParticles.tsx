import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';

export const DustStormParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const dustIntensity = useMarsGameStore((state) => state.solCycle.dustStormIntensity);

  const count = 1200;

  const [positions, initialOffsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return [pos, offsets];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const speed = 12 + dustIntensity * 28;

    for (let i = 0; i < count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Dust wind blows primarily along X-axis with vertical turbulence
      x += delta * speed;
      y += Math.sin(initialOffsets[i] + Date.now() * 0.002) * delta * 1.5;

      // Wrap around bounding volume
      if (x > 40) x = -40;
      if (y > 16) y = 0.5;
      if (y < 0.2) y = 14;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16 + dustIntensity * 0.12}
        color="#D97706" // Warm Martian ochre dust
        transparent
        opacity={0.35 + dustIntensity * 0.4}
        depthWrite={false}
      />
    </points>
  );
};

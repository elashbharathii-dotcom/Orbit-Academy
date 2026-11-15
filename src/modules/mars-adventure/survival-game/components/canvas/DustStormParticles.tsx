import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';

export const DustStormParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const dustIntensity = useMarsGameStore((state) => state.solCycle.dustStormIntensity);
  const isInsideHab = useMarsGameStore((state) => state.isInsideHab);
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const roverPos = useMarsGameStore((state) => state.roverPosition);
  const controlMode = useMarsGameStore((state) => state.settings.controlMode);

  const count = 900; // Optimized particle budget

  const [positions, initialOffsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return [pos, offsets];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    // Follow player/rover position across 360m world
    const targetX = controlMode === 'driving_rover' ? roverPos[0] : playerPos[0];
    const targetZ = controlMode === 'driving_rover' ? roverPos[2] : playerPos[2];
    pointsRef.current.position.set(targetX, 0, targetZ);

    const pos = pointsRef.current.geometry.attributes.position;
    const speed = 14 + dustIntensity * 32;

    for (let i = 0; i < count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Dust wind blows along X-axis with vertical turbulence
      x += delta * speed;
      y += Math.sin(initialOffsets[i] + Date.now() * 0.002) * delta * 1.5;

      // Wrap around bounding volume relative to center
      if (x > 35) x = -35;
      if (y > 15) y = 0.5;
      if (y < 0.2) y = 13.5;

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    // Airlock environmental seal: fade out dust when sheltered inside habitat
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (mat) {
      const targetOpacity = isInsideHab ? 0.0 : 0.32 + dustIntensity * 0.45;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 6.0);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.16 + dustIntensity * 0.12}
        color="#D97706"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
};

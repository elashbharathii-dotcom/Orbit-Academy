import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KuiperBeltProps {
  count?: number;
  innerRadius?: number;
  outerRadius?: number;
  speedScale?: number;
}

/**
 * ORBIT ACADEMY — KUIPER BELT (Outer Trans-Neptunian Icy Disc)
 * 
 * High-Performance Instanced Rendering:
 * - Single GPU draw call for 1,400+ icy planetesimals and cometary nuclei
 * - Authentic methane, water-ice, and tholin-tinted organic color variations
 * - Keplerian slow outer orbital drift beyond Neptune
 * - Vertical Gaussian dispersion representing scattered disc and classical Kuiper belt
 */
export const KuiperBelt: React.FC<KuiperBeltProps> = ({
  count = 1400,
  innerRadius = 130.0,
  outerRadius = 175.0,
  speedScale = 0.45,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const [planetesimals, dummy] = useMemo(() => {
    const list: Array<{
      radius: number;
      angle: number;
      speed: number;
      height: number;
      scale: number;
      rotSpeed: number;
      rotAxis: THREE.Vector3;
    }> = [];

    const dummyObj = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const r = innerRadius + Math.pow(Math.random(), 0.8) * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      // Ultra-slow Keplerian velocity in deep outer solar system
      const speed = (0.12 / Math.sqrt(r)) * (0.8 + Math.random() * 0.4);
      // Inclination scatter up to 15 degrees
      const height = (Math.random() - 0.5) * (r * 0.12);
      const scale = 0.05 + Math.random() * 0.11;

      const rotAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      list.push({
        radius: r,
        angle,
        speed,
        height,
        scale,
        rotSpeed: Math.random() * 0.4 + 0.1,
        rotAxis,
      });
    }

    return [list, dummyObj];
  }, [count, innerRadius, outerRadius]);

  // Color gradient: mixture of pale nitrogen ice, bluish water-ice, and reddish tholins
  useMemo(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    const colors = ['#E2E8F0', '#BAE6FD', '#E0F2FE', '#CBD5E1', '#FCA5A5', '#F1F5F9'];

    for (let i = 0; i < count; i++) {
      const c = colors[i % colors.length];
      color.set(c);
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < planetesimals.length; i++) {
      const p = planetesimals[i];
      p.angle += p.speed * delta * speedScale * 0.4;

      const x = Math.cos(p.angle) * p.radius;
      const z = Math.sin(p.angle) * p.radius;
      const y = p.height;

      dummy.position.set(x, y, z);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.rotateOnAxis(p.rotAxis, p.rotSpeed * delta);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#BAE6FD"
        roughness={0.92}
        metalness={0.06}
        transparent={true}
        opacity={0.75}
      />
    </instancedMesh>
  );
};

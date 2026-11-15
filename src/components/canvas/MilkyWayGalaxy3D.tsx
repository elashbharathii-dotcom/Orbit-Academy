import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MILKY_WAY_DATA } from '../../data/milkyWayData';
import { Html } from '@react-three/drei';

interface MilkyWayGalaxy3DProps {
  speedScale?: number;
}

/**
 * ORBIT ACADEMY — MILKY WAY GALAXY 3D ENVIRONMENT
 * 
 * Physically and astrometrically inspired 3D visualization:
 * - 25,000 instanced particle stars mapped across logarithmic spiral arms
 * - Sagittarius A* supermassive black hole core and central stellar bar bulge
 * - Pulsing marker highlighting the Solar System's location on the Orion Spur (26,000 ly from core)
 * - Grounded in ESA Gaia DR3 astrometric data
 */
export const MilkyWayGalaxy3D: React.FC<MilkyWayGalaxy3DProps> = ({ speedScale = 0.45 }) => {
  const galaxyGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);

  // Generate 25,000 Spiral Arm Stars
  const { positions, colors } = useMemo(() => {
    const totalStars = 25000;
    const pos = new Float32Array(totalStars * 3);
    const col = new Float32Array(totalStars * 3);

    let starIdx = 0;
    const arms = MILKY_WAY_DATA.spiralArms;

    // 1. Generate stars along spiral arms (75% of total)
    const armStarsCount = Math.floor(totalStars * 0.75);
    const starsPerArm = Math.floor(armStarsCount / arms.length);

    arms.forEach((arm) => {
      const baseColor = new THREE.Color(arm.color);
      for (let i = 0; i < starsPerArm; i++) {
        // Parametric angle theta
        const t = Math.random();
        const theta = t * Math.PI * 3.2; // 1.6 rotations
        // Logarithmic spiral radius: r = a * exp(b * theta)
        const a = 20;
        const b = arm.growthFactor;
        const r = a * Math.exp(b * theta) + (Math.random() - 0.5) * 14;

        // Apply arm angular offset
        const finalAngle = theta + arm.armAngleOffset + (Math.random() - 0.5) * 0.35;
        const x = Math.cos(finalAngle) * r;
        const z = Math.sin(finalAngle) * r;
        // Vertical disk thickness falls off with distance from center
        const verticalSpread = Math.exp(-r / 160) * 8 + 1.5;
        const y = (Math.random() - 0.5) * (Math.random() - 0.5) * verticalSpread * 4;

        pos[starIdx * 3] = x;
        pos[starIdx * 3 + 1] = y;
        pos[starIdx * 3 + 2] = z;

        // Color variation (mix arm color with warm stellar white/blue)
        const starColor = baseColor.clone();
        if (Math.random() > 0.6) {
          starColor.lerp(new THREE.Color('#FFFFFF'), Math.random() * 0.7);
        } else if (Math.random() > 0.3) {
          starColor.lerp(new THREE.Color('#FDE047'), Math.random() * 0.5);
        }

        col[starIdx * 3] = starColor.r;
        col[starIdx * 3 + 1] = starColor.g;
        col[starIdx * 3 + 2] = starColor.b;

        starIdx++;
      }
    });

    // 2. Generate Dense Central Galactic Bulge (25% of total)
    while (starIdx < totalStars) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.pow(Math.random(), 2.2) * 36; // concentrated near center

      // Oblate spheroid shape for central bar
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.5;
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      const z = r * Math.cos(phi);

      pos[starIdx * 3] = x;
      pos[starIdx * 3 + 1] = y;
      pos[starIdx * 3 + 2] = z;

      // Warm golden / yellow-white core stars (older Population II stars)
      const coreColor = new THREE.Color(
        Math.random() > 0.4 ? '#FDE047' : Math.random() > 0.2 ? '#FB923C' : '#FFFFFF'
      );
      col[starIdx * 3] = coreColor.r;
      col[starIdx * 3 + 1] = coreColor.g;
      col[starIdx * 3 + 2] = coreColor.b;

      starIdx++;
    }

    return { positions: pos, colors: col };
  }, []);

  // Slow, majestic galactic rotation
  useFrame((_, delta) => {
    if (galaxyGroupRef.current) {
      galaxyGroupRef.current.rotation.y += delta * 0.015 * speedScale;
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += delta * 0.1 * speedScale;
    }
  });

  // Sol location coordinates on the Orion Spur (approx 105 units out)
  const solPos: [number, number, number] = [72, 1.2, 75];

  return (
    <group ref={galaxyGroupRef}>
      {/* 1. Central Supermassive Black Hole & Stellar Bulge Glow */}
      <group position={[0, 0, 0]}>
        <pointLight color="#FDE047" intensity={8.5} distance={280} decay={1.4} />

        {/* Core Luminous Sphere */}
        <mesh ref={coreMeshRef}>
          <sphereGeometry args={[7.5, 32, 32]} />
          <meshBasicMaterial color="#FFFBEB" />
        </mesh>

        {/* Accretion Disk & Gravitational Glow */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.0, 24.0, 64]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent={true}
            opacity={0.42}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Sagittarius A* HTML Label */}
        <Html position={[0, 10, 0]} center distanceFactor={140}>
          <div className="font-mono text-[10px] font-bold text-amber-300 bg-black/80 px-2.5 py-1 rounded-lg border border-amber-500/50 shadow-lg whitespace-nowrap pointer-events-none">
            SAGITTARIUS A* (GALACTIC CORE)
          </div>
        </Html>
      </group>

      {/* 2. Instanced Spiral Arms Starfield */}
      <points>
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
          size={0.65}
          vertexColors={true}
          transparent={true}
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 3. Solar System Location Marker on Orion-Cygnus Spur */}
      <group position={solPos}>
        {/* Pulsing Target Marker */}
        <mesh>
          <sphereGeometry args={[1.6, 16, 16]} />
          <meshBasicMaterial color="#38BDF8" wireframe={true} />
        </mesh>
        <pointLight color="#38BDF8" intensity={2.0} distance={40} />

        {/* Sun Location Callout */}
        <Html position={[0, 3.5, 0]} center distanceFactor={110}>
          <div className="font-mono text-[10px] font-bold text-cyan-300 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] whitespace-nowrap flex items-center gap-1.5 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>OUR SOLAR SYSTEM (ORION SPUR — 26,000 LY)</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

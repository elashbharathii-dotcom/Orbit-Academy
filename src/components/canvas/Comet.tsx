import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CometProps {
  semiMajorAxis?: number;
  eccentricity?: number;
  inclinationDeg?: number;
}

/**
 * Highly Eccentric Solar System Comet (Halley analogue)
 * 
 * Features:
 * - Keplerian orbital mechanics on an eccentric ellipse
 * - Faster near perihelion (Sun close-approach), slow near aphelion
 * - Dynamic ion tail that always extends radially away from Sol (0, 0, 0)
 * - Sublimating gas coma with additive glow
 */
export const Comet: React.FC<CometProps> = ({
  semiMajorAxis = 48,
  eccentricity = 0.74,
  inclinationDeg = 18,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const tailMeshRef = useRef<THREE.Mesh>(null);
  const meanAnomalyRef = useRef<number>(0.8);

  // Orbital constants
  const a = semiMajorAxis;
  const e = eccentricity;
  const incRad = (inclinationDeg * Math.PI) / 180;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Advance mean anomaly: higher velocity near perihelion
    const currentDist = Math.max(12, groupRef.current.position.length());
    const velocityMult = Math.sqrt(2 / currentDist - 1 / a);
    meanAnomalyRef.current += delta * 0.04 * velocityMult;

    const M = meanAnomalyRef.current;

    // Approximate eccentric anomaly E from Kepler's equation M = E - e*sin(E)
    let E = M;
    for (let i = 0; i < 4; i++) {
      E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    }

    // True anomaly and radius in orbital plane
    const xOrb = a * (Math.cos(E) - e);
    const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

    // Rotate into 3D space with inclination
    const x = xOrb;
    const y = yOrb * Math.sin(incRad);
    const z = yOrb * Math.cos(incRad);

    groupRef.current.position.set(x, y, z);

    // Direct comet tail radially away from the Sun (origin)
    if (tailMeshRef.current) {
      const dirAwayFromSun = new THREE.Vector3(x, y, z).normalize();
      const tailLength = Math.max(8, 28 - currentDist * 0.4);
      tailMeshRef.current.scale.set(1, tailLength, 1);
      
      // Orient cylinder towards dirAwayFromSun
      tailMeshRef.current.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dirAwayFromSun
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Icy Nucleus */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>

      {/* 2. Sublimating Gas Coma Glow */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Dynamic Radiant Dust / Ion Tail (pointing away from Sol) */}
      <mesh ref={tailMeshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 1.4, 1, 16, 1, true]} />
        <meshBasicMaterial
          color="#93C5FD"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};


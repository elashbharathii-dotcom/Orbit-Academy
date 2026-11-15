import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthMagnetosphere3DProps {
  kpIndex: number;
  solarWindSpeedKmS: number;
  imfBz: number;
}

export const EarthMagnetosphere3D: React.FC<EarthMagnetosphere3DProps> = ({
  kpIndex = 5,
  solarWindSpeedKmS = 540,
  imfBz = -5.0,
}) => {
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const auroraNorthRef = useRef<THREE.Mesh>(null);
  const auroraSouthRef = useRef<THREE.Mesh>(null);
  const bowShockRef = useRef<THREE.Mesh>(null);
  const fieldLinesGroupRef = useRef<THREE.Group>(null);

  // Dynamic magnetopause standoff distance based on Kp & solar wind dynamic pressure
  // High Kp & high solar wind compress the day-side standoff distance
  const standoffDistance = useMemo(() => {
    const windCompression = (solarWindSpeedKmS - 400) / 1200;
    return Math.max(5.2, 10.5 - kpIndex * 0.45 - windCompression);
  }, [kpIndex, solarWindSpeedKmS]);

  // Aurora oval scale expands toward equator as Kp rises (Kp 1: radius 0.65, Kp 9: radius 1.35)
  const auroraScale = useMemo(() => {
    return 0.75 + (kpIndex / 9) * 0.65;
  }, [kpIndex]);

  // Aurora glow intensity increases dramatically with Kp and southward Bz
  const auroraIntensity = useMemo(() => {
    const bzFactor = imfBz < 0 ? Math.min(2.0, 1.0 + Math.abs(imfBz) * 0.1) : 0.8;
    return Math.min(3.5, (0.8 + (kpIndex / 9) * 2.2) * bzFactor);
  }, [kpIndex, imfBz]);

  // Generate 3D Dipole Magnetic Field Lines: r = L * sin^2(theta)
  const dipoleLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    const numLines = 16;
    const LValues = [3.2, 4.6, 6.2, 8.0]; // L-shell shells

    for (const L of LValues) {
      for (let i = 0; i < numLines; i++) {
        const phi = (i / numLines) * Math.PI * 2;
        const points: THREE.Vector3[] = [];
        const steps = 36;

        for (let j = 0; j <= steps; j++) {
          const theta = (j / steps) * Math.PI; // 0 (North Pole) to PI (South Pole)
          const sinTheta = Math.sin(theta);
          const r = L * sinTheta * sinTheta;

          // Day-side compression (assuming Sun is in -Z direction)
          const zCoord = r * Math.cos(theta);
          const compression = zCoord < 0 ? 0.72 : 1.35; // Compresses day-side, stretches night-side

          const x = r * sinTheta * Math.cos(phi) * 1.0;
          const y = zCoord; // Polar axis aligned with Y
          const z = r * sinTheta * Math.sin(phi) * compression;

          // Only keep points outside Earth radius
          if (x * x + y * y + z * z >= 3.6) {
            points.push(new THREE.Vector3(x, y, z));
          }
        }

        if (points.length > 2) {
          lines.push(points);
        }
      }
    }
    return lines;
  }, []);

  // Frame animation loop
  useFrame((_, delta) => {
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += delta * 0.1;
    }
    if (auroraNorthRef.current) {
      auroraNorthRef.current.rotation.z += delta * 0.2;
    }
    if (auroraSouthRef.current) {
      auroraSouthRef.current.rotation.z -= delta * 0.2;
    }
    if (fieldLinesGroupRef.current) {
      fieldLinesGroupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      {/* 1. Central 3D Earth Globe */}
      <mesh ref={earthMeshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.0, 48, 48]} />
        <meshStandardMaterial
          color="#1D4ED8"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* Earth Cloud and Atmospheric Haze */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.06, 32, 32]} />
        <meshStandardMaterial
          color="#38BDF8"
          transparent
          opacity={0.35}
          roughness={1.0}
        />
      </mesh>

      {/* 2. North Polar Aurora Oval (557.7 nm Atomic Oxygen Green & 427.8 nm N2 Purple) */}
      <mesh
        ref={auroraNorthRef}
        position={[0, 1.95, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.5 * auroraScale, 0.95 * auroraScale, 48]} />
        <meshBasicMaterial
          color={kpIndex >= 6 ? '#A855F7' : '#10B981'}
          transparent
          opacity={0.75 * (auroraIntensity / 2)}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. South Polar Aurora Oval */}
      <mesh
        ref={auroraSouthRef}
        position={[0, -1.95, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.5 * auroraScale, 0.95 * auroraScale, 48]} />
        <meshBasicMaterial
          color={kpIndex >= 6 ? '#A855F7' : '#10B981'}
          transparent
          opacity={0.75 * (auroraIntensity / 2)}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Compressed Day-Side Bow Shock Paraboloid */}
      <mesh
        ref={bowShockRef}
        position={[0, 0, -standoffDistance]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[standoffDistance * 1.6, 0.2, standoffDistance * 0.8, 32, 1, true]}
        />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.22}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Magnetopause Boundary Shell */}
      <mesh position={[0, 0, -standoffDistance * 0.7]}>
        <sphereGeometry args={[standoffDistance * 0.9, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 6. Night-Side Magnetotail Plasma Sheet Streamers */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -2, 0.8, 2, -5, 1.2, 35,
                2, 0.8, 2, 5, 1.2, 35,
                -2, -0.8, 2, -5, -1.2, 35,
                2, -0.8, 2, 5, -1.2, 35,
                0, 0, 2, 0, 0, 42,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#38BDF8" transparent opacity={0.3} />
      </lineSegments>

      {/* 7. Dipole Magnetic Field Lines */}
      <group ref={fieldLinesGroupRef}>
        {dipoleLines.map((pts, idx) => {
          const geometry = new THREE.BufferGeometry().setFromPoints(pts);
          return (
            <primitive key={idx} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
              color: idx % 2 === 0 ? '#00F0FF' : '#38BDF8',
              transparent: true,
              opacity: 0.28,
            }))} />
          );
        })}
      </group>

      {/* Sunlight coming from the Sun (-Z direction) */}
      <directionalLight position={[0, 0, -25]} intensity={3.5} color="#FFF8E7" />
      <ambientLight color="#0F172A" intensity={0.4} />
    </group>
  );
};

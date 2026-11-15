import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NasaSolarFlare, NasaCmeEvent } from '../../../services/nasa/types';

interface SunHeliosphere3DProps {
  flares: NasaSolarFlare[];
  cmes: NasaCmeEvent[];
  selectedFlare: NasaSolarFlare | null;
  onSelectFlare: (flare: NasaSolarFlare) => void;
}

// Convert solar coordinates string (e.g. "N18E42", "S22W15") to spherical 3D position
function parseSolarCoordinates(coordStr: string, radius: number): THREE.Vector3 {
  if (!coordStr || coordStr.length < 6) return new THREE.Vector3(radius * 0.8, radius * 0.5, radius * 0.3);

  const latSign = coordStr[0] === 'S' ? -1 : 1;
  const latVal = parseInt(coordStr.slice(1, 3), 10) || 15;
  const lonSign = coordStr[3] === 'W' ? -1 : 1;
  const lonVal = parseInt(coordStr.slice(4, 6), 10) || 30;

  const phi = (90 - latSign * latVal) * (Math.PI / 180);
  const theta = (lonSign * lonVal) * (Math.PI / 180);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export const SunHeliosphere3D: React.FC<SunHeliosphere3DProps> = ({
  flares,
  cmes,
  selectedFlare,
  onSelectFlare,
}) => {
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const coronaMeshRef = useRef<THREE.Mesh>(null);
  const cmeParticlesRef = useRef<THREE.Points>(null);

  // Dynamic CME particles propagating into space scaled by real NASA DONKI CME speed
  const cmeSpeedMultiplier = useMemo(() => {
    if (!cmes || cmes.length === 0) return 1.0;
    const speeds = cmes.map((c) => c.cmeAnalyses?.[0]?.speed || 500);
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    return Math.max(0.6, Math.min(2.5, avgSpeed / 500));
  }, [cmes]);

  const particleCount = 750;
  const { particlePositions, particleVelocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spawn near solar surface with outward velocity
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = 4.2 + Math.random() * 32.0;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.6; // Concentrated near ecliptic plane
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // Outward velocity vector along Parker spiral
      const speed = (0.08 + Math.random() * 0.12) * cmeSpeedMultiplier;
      vel[i * 3] = (pos[i * 3] / r) * speed;
      vel[i * 3 + 1] = (pos[i * 3 + 1] / r) * speed;
      vel[i * 3 + 2] = (pos[i * 3 + 2] / r) * speed;
    }

    return { particlePositions: pos, particleVelocities: vel };
  }, [cmeSpeedMultiplier]);

  // Animation frame loop
  useFrame((_, delta) => {
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.08;
    }
    if (coronaMeshRef.current) {
      coronaMeshRef.current.rotation.y -= delta * 0.04;
      coronaMeshRef.current.rotation.z += delta * 0.02;
    }

    // Update CME plasma particle positions
    if (cmeParticlesRef.current) {
      const positions = cmeParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i * 3];
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3 + 2] += particleVelocities[i * 3 + 2];

        const distSq =
          positions[i * 3] ** 2 +
          positions[i * 3 + 1] ** 2 +
          positions[i * 3 + 2] ** 2;

        // Reset particles that have traveled beyond 45 units
        if (distSq > 2025) {
          const phi = Math.random() * Math.PI;
          const theta = Math.random() * Math.PI * 2;
          const r = 4.2 + Math.random() * 0.8;
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
          positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
      }
      cmeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Luminous Solar Core Mesh */}
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[4.0, 64, 64]} />
        <meshBasicMaterial color="#FFF1A8" />
      </mesh>

      {/* 2. Solar Photosphere & Chromosphere Glow Mesh */}
      <mesh ref={coronaMeshRef}>
        <sphereGeometry args={[4.45, 48, 48]} />
        <meshStandardMaterial
          color="#FF6B00"
          emissive="#FF4500"
          emissiveIntensity={2.8}
          roughness={0.7}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* 3. Outer Coronal Atmosphere Layer */}
      <mesh>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFA726"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 4. Active Solar Flare Flares & Eruption Arcs from DONKI FLR */}
      {flares.slice(0, 6).map((flare, idx) => {
        const pos = parseSolarCoordinates(flare.sourceLocation, 4.3);
        const isSelected = selectedFlare?.flrId === flare.flrId;
        const isXClass = flare.classType.startsWith('X');

        return (
          <group key={flare.flrId || idx} position={pos}>
            {/* Eruption Core Beacon */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectFlare(flare);
              }}
            >
              <sphereGeometry args={[isSelected ? 0.42 : 0.28, 16, 16]} />
              <meshBasicMaterial
                color={isXClass ? '#FF0055' : '#FFB703'}
              />
            </mesh>

            {/* Pulsing Flare Glow Ring */}
            <mesh>
              <ringGeometry args={[0.3, isSelected ? 1.1 : 0.7, 32]} />
              <meshBasicMaterial
                color={isXClass ? '#FF0055' : '#FFAA00'}
                transparent
                opacity={isSelected ? 0.85 : 0.45}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Flare Magnetic Loop Arc */}
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.5, 0.06, 8, 24, Math.PI]} />
              <meshBasicMaterial
                color={isXClass ? '#FF2A75' : '#FFC72C'}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* 5. CME Coronal Mass Ejection Particle Cloud */}
      <points ref={cmeParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.35}
          color="#FF9E00"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 6. Parker Spiral Interplanetary Magnetic Field Reference Streamers */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                0, 0, 0, 15, 0, 15,
                0, 0, 0, -18, 0, 12,
                0, 0, 0, 12, 0, -18,
                0, 0, 0, -16, 0, -14,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FFB703" transparent opacity={0.2} />
      </lineSegments>

      {/* Central Solar Sunlight Source */}
      <pointLight color="#FFF8E7" intensity={8.5} distance={200} decay={1.2} />
      <ambientLight color="#1A243B" intensity={0.5} />
    </group>
  );
};

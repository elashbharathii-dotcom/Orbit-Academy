import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated Articulated Robotic Welding Arm
 */
const RoboticWeldingArm: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  speed?: number;
}> = ({ position, rotationY = 0, speed = 1 }) => {
  const baseRef = useRef<THREE.Group>(null);
  const upperArmRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const sparkLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (baseRef.current) {
      baseRef.current.rotation.y = rotationY + Math.sin(t * 0.4) * 0.35;
    }
    if (upperArmRef.current) {
      upperArmRef.current.rotation.z = -0.4 + Math.sin(t * 0.8) * 0.2;
    }
    if (forearmRef.current) {
      forearmRef.current.rotation.z = 0.8 + Math.cos(t * 0.7) * 0.3;
    }
    if (sparkLightRef.current) {
      // Periodic welding sparks
      const sparkCycle = Math.sin(t * 6);
      sparkLightRef.current.intensity = sparkCycle > 0.6 ? 2.5 + Math.random() * 2.0 : 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base Pedestal on Floor */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.8, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Yellow Safety Ring */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.06, 16]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Articulated Base Group */}
      <group ref={baseRef} position={[0, 0.85, 0]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.7]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Upper Arm Pivot */}
        <group ref={upperArmRef} position={[0, 0.8, 0]}>
          <mesh castShadow position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 2.2, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Hydraulic Cylinder */}
          <mesh position={[0.2, 0.9, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Forearm Pivot */}
          <group ref={forearmRef} position={[0, 2.2, 0]}>
            <mesh castShadow position={[0, 0.9, 0]}>
              <cylinderGeometry args={[0.14, 0.16, 1.8, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Welding Torch Head */}
            <group position={[0, 1.8, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.25, 0.35, 0.25]} />
                <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <coneGeometry args={[0.08, 0.3, 12]} />
                <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
              </mesh>
              <pointLight ref={sparkLightRef} color="#00E5FF" distance={5} intensity={1} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

/**
 * Floating Holographic Diagnostic Telemetry Display
 */
const HolographicDiagnostics: React.FC<{
  position: [number, number, number];
  rotationY?: number;
}> = ({ position, rotationY = 0 }) => {
  const holoGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (holoGroup.current) {
      holoGroup.current.position.y = position[1] + Math.sin(t * 1.5) * 0.12;
      holoGroup.current.rotation.y = rotationY + Math.cos(t * 0.5) * 0.15;
    }
  });

  return (
    <group ref={holoGroup} position={position}>
      {/* Holographic Wireframe Console Pane */}
      <mesh>
        <planeGeometry args={[2.8, 1.8]} />
        <meshBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Glowing Neon Cyan Border */}
      <mesh>
        <planeGeometry args={[2.84, 1.84]} />
        <meshBasicMaterial
          color="#00E5FF"
          wireframe
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Telemetry Rings inside HUD */}
      <mesh position={[-0.7, 0.2, 0.02]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 24]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.6, 0.3, 0.02]}>
        <planeGeometry args={[0.9, 0.12]} />
        <meshBasicMaterial color="#34D399" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.6, 0.05, 0.02]}>
        <planeGeometry args={[0.7, 0.1]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.45, 0.02]}>
        <planeGeometry args={[2.2, 0.2]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/**
 * AAA Futuristic 3D Spacecraft Hangar Workshop Environment
 */
export const ShipyardEnvironment3D: React.FC<{
  quality?: 'performance' | 'balanced' | 'high' | 'ultra';
}> = ({ quality = 'high' }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const holoRingRef = useRef<THREE.Group>(null);
  const craneRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.012;
    }
    if (holoRingRef.current) {
      holoRingRef.current.rotation.y -= delta * 0.025;
    }
    if (craneRef.current) {
      const t = state.clock.getElapsedTime();
      craneRef.current.position.z = Math.sin(t * 0.2) * 4.5;
    }
  });

  const isUltra = quality === 'ultra';
  const isHighOrUltra = quality === 'high' || quality === 'ultra';

  return (
    <group position={[0, -2.6, 0]}>
      {/* =================================================================== */}
      {/* 1. DISTANT PLANETARY SPHERE & CELESTIAL HORIZON (Hangar Vista)      */}
      {/* =================================================================== */}
      <group position={[0, 18, -65]} rotation={[0.2, 0.4, -0.1]}>
        {/* Giant Celestial Globe */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[26, isHighOrUltra ? 64 : 32, isHighOrUltra ? 64 : 32]} />
          <meshStandardMaterial
            color="#1E3A8A"
            roughness={0.65}
            metalness={0.1}
            emissive="#0369A1"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Swirling Atmospheric Cloud Shell */}
        <mesh scale={[1.015, 1.015, 1.015]}>
          <sphereGeometry args={[26, 32, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.35}
            roughness={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Atmospheric Rayleigh Blue Scattering Halo */}
        <mesh scale={[1.04, 1.04, 1.04]}>
          <sphereGeometry args={[26, 32, 32]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.28}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Distant Spacecraft Silhouettes Outside Hangar */}
      <group position={[-18, 14, -40]} rotation={[0, 0.8, 0.2]}>
        <mesh>
          <coneGeometry args={[0.6, 2.2, 8]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        <pointLight color="#38BDF8" intensity={1.5} distance={8} />
      </group>

      <group position={[24, 16, -45]} rotation={[0, -0.6, -0.1]}>
        <mesh>
          <coneGeometry args={[0.5, 1.8, 8]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        <pointLight color="#F59E0B" intensity={1.2} distance={8} />
      </group>

      {/* =================================================================== */}
      {/* 2. MASSIVE HANGAR SUPERSTRUCTURE, GANTRY ARCHES & OVERHEAD CRANE     */}
      {/* =================================================================== */}
      <group ref={ringRef} position={[0, 4, -18]}>
        {/* Giant Circular Framing Portal Ring */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[18, 1.4, 16, 64]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.85} />
        </mesh>

        {/* Structural Rib Columns (Vertical Gantry Arches) */}
        {[-14, -8, 8, 14].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.65, 0.85, 22, 12]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.7} />
            </mesh>
            <pointLight
              position={[x > 0 ? -0.8 : 0.8, 4, 0]}
              color="#F59E0B"
              intensity={0.9}
              distance={12}
            />
          </group>
        ))}

        {/* Upper Overhead Crane Beam */}
        <mesh position={[0, 11, 0]}>
          <boxGeometry args={[32, 1.2, 1.6]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.6} />
        </mesh>

        {/* Animated Moving Gantry Crane Trolley */}
        <group ref={craneRef} position={[0, 10.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 0.8, 2.2]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Crane Cables */}
          {[-0.8, 0.8].map((cx, i) => (
            <mesh key={i} position={[cx, -1.8, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 3.2, 8]} />
              <meshBasicMaterial color="#94A3B8" />
            </mesh>
          ))}
          {/* Crane Spreader Beam */}
          <mesh position={[0, -3.4, 0]}>
            <boxGeometry args={[2.4, 0.3, 0.8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
          </mesh>
          <pointLight position={[0, -3.8, 0]} color="#00E5FF" intensity={1.8} distance={10} />
        </group>
      </group>

      {/* =================================================================== */}
      {/* 3. ROBOTIC WELDING & FABRICATION ARMS                                */}
      {/* =================================================================== */}
      <RoboticWeldingArm position={[-6.2, 0, 2.8]} rotationY={0.6} speed={1.1} />
      <RoboticWeldingArm position={[6.2, 0, -2.4]} rotationY={-2.2} speed={0.9} />

      {/* =================================================================== */}
      {/* 4. HOLOGRAPHIC DIAGNOSTIC DISPLAYS                                   */}
      {/* =================================================================== */}
      <HolographicDiagnostics position={[-4.5, 3.2, 3.5]} rotationY={0.4} />
      <HolographicDiagnostics position={[4.5, 3.6, -3.2]} rotationY={-2.5} />

      {/* =================================================================== */}
      {/* 5. REFLECTIVE FLOOR, LAUNCH PEDESTAL & DOCKING PAD                  */}
      {/* =================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Reflective Dark Floor Baseplate with Specular Metallic Panels */}
        <mesh receiveShadow position={[0, -0.15, 0]}>
          <cylinderGeometry args={[14.5, 15.5, 0.3, 64]} />
          <meshPhysicalMaterial
            color="#070C1B"
            roughness={0.22}
            metalness={0.92}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
          />
        </mesh>

        {/* Magnetic Levitation Platform (Central glowing emitter disc) */}
        <mesh receiveShadow position={[0, 0.01, 0]}>
          <cylinderGeometry args={[4.8, 5.2, 0.12, 48]} />
          <meshStandardMaterial
            color="#0B1226"
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>

        {/* Outer Circular Warning Hazard Ring (Amber / Black striping) */}
        <mesh receiveShadow position={[0, 0.02, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[10.5, 11.2, 64]} />
          <meshBasicMaterial
            color="#F59E0B"
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Concentric Rotating Holographic Light Rings */}
        <group ref={holoRingRef} position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
            <ringGeometry args={[7.2, 7.5, 64]} />
            <meshBasicMaterial
              color="#00E5FF"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
            <ringGeometry args={[4.2, 4.4, 48]} />
            <meshBasicMaterial
              color="#38BDF8"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
            <ringGeometry args={[2.0, 2.15, 36]} />
            <meshBasicMaterial
              color="#A78BFA"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Radial Runway Direction Spoke Markers */}
          {[
            0,
            Math.PI * 0.25,
            Math.PI * 0.5,
            Math.PI * 0.75,
            Math.PI,
            Math.PI * 1.25,
            Math.PI * 1.5,
            Math.PI * 1.75,
          ].map((ang, i) => (
            <mesh
              key={i}
              position={[Math.cos(ang) * 5.8, 0.01, Math.sin(ang) * 5.8]}
              rotation={[0, -ang, 0]}
            >
              <boxGeometry args={[2.2, 0.02, 0.08]} />
              <meshBasicMaterial color="#38BDF8" transparent opacity={0.75} />
            </mesh>
          ))}
        </group>

        {/* Central Mag-Lev Emitter Core */}
        <mesh position={[0, 0.07, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Circular Coordinate Floor Grid */}
        <gridHelper args={[28, 28, '#00E5FF', '#1E293B']} position={[0, 0.08, 0]} />

        {/* Glowing Pad Edge Spotlight Bollards */}
        {[
          [-8, 8],
          [8, 8],
          [-8, -8],
          [8, -8],
          [0, 11],
          [0, -11],
          [-11, 0],
          [11, 0],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.22, 0.9, 12]} />
              <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#00E5FF' : '#F59E0B'} />
            </mesh>
            <pointLight
              position={[0, 1.0, 0]}
              color={i % 2 === 0 ? '#00E5FF' : '#F59E0B'}
              intensity={isUltra ? 1.6 : 1.0}
              distance={7}
            />
          </group>
        ))}

        {/* Industrial Tool Consoles & Power Inverters */}
        {[
          [-9.5, 3.5],
          [9.5, -4.2],
          [-7.5, -8.2],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0.5, z]} rotation={[0, i * 0.8, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.9, 1.2]} />
              <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1.22, 0.08, 1.22]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

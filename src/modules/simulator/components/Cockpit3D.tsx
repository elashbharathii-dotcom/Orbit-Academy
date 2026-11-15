import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpacecraftFlightState, FlightControls } from '../types';

interface Cockpit3DProps {
  flightState: SpacecraftFlightState;
  flightControls: FlightControls;
}

export const Cockpit3D: React.FC<Cockpit3DProps> = ({
  flightControls,
}) => {
  const stickRef = useRef<THREE.Group>(null);
  const throttleRef = useRef<THREE.Mesh>(null);

  // Smoothly animate stick & throttle lever in 3D
  useFrame(() => {
    if (stickRef.current) {
      stickRef.current.rotation.x = THREE.MathUtils.lerp(
        stickRef.current.rotation.x,
        flightControls.pitch * 0.35,
        0.2
      );
      stickRef.current.rotation.z = THREE.MathUtils.lerp(
        stickRef.current.rotation.z,
        -flightControls.roll * 0.35,
        0.2
      );
    }

    if (throttleRef.current) {
      // Throttle lever slides along Y/Z axis
      const targetZ = -0.15 + flightControls.throttle * 0.25;
      throttleRef.current.position.z = THREE.MathUtils.lerp(
        throttleRef.current.position.z,
        targetZ,
        0.2
      );
    }
  });

  return (
    <group position={[0, -0.2, 0.4]}>
      {/* 1. Cockpit Canopy Frame Structure */}
      {/* Front Dashboard Deck */}
      <mesh position={[0, -0.65, -0.8]} receiveShadow>
        <boxGeometry args={[2.4, 0.35, 1.2]} />
        <meshStandardMaterial color="#0b1329" roughness={0.7} metalness={0.6} />
      </mesh>

      {/* Main Center Avionics Console */}
      <mesh position={[0, -0.4, -1.0]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[1.6, 0.6, 0.15]} />
        <meshStandardMaterial color="#070c1b" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* Center Screen Glowing Display Surface */}
      <mesh position={[0, -0.38, -0.92]} rotation={[-0.45, 0, 0]}>
        <planeGeometry args={[1.1, 0.42]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.35} />
      </mesh>

      {/* Left Screen Surface */}
      <mesh position={[-0.65, -0.38, -0.85]} rotation={[-0.45, 0.3, 0]}>
        <planeGeometry args={[0.42, 0.38]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.25} />
      </mesh>

      {/* Right Screen Surface */}
      <mesh position={[0.65, -0.38, -0.85]} rotation={[-0.45, -0.3, 0]}>
        <planeGeometry args={[0.42, 0.38]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.25} />
      </mesh>

      {/* 2. Canopy Structural Struts (Framing the Viewport) */}
      {/* Left A-Pillar */}
      <mesh position={[-1.15, 0.35, -0.55]} rotation={[0.4, 0.3, -0.35]}>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Right A-Pillar */}
      <mesh position={[1.15, 0.35, -0.55]} rotation={[0.4, -0.3, 0.35]}>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Top Transverse Canopy Arch */}
      <mesh position={[0, 1.05, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 3. Interactive Flight Control Stick */}
      <group ref={stickRef} position={[0.28, -0.45, -0.35]}>
        {/* Stick Base Gimbal */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Stick Shaft */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.018, 0.022, 0.28, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Ergonomic Flight Grip */}
        <mesh position={[0, 0.28, 0.02]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.045, 0.12, 0.06]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.3} />
        </mesh>
        {/* Weapon / Stage Trigger Button (Red) */}
        <mesh position={[0, 0.33, 0.05]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* 4. Interactive Throttle Lever Quadrant */}
      <group position={[-0.38, -0.48, -0.35]}>
        {/* Throttle Track Slot */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.35]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.6} />
        </mesh>

        {/* Sliding Throttle Lever */}
        <mesh ref={throttleRef} position={[0, 0.06, 0]}>
          <boxGeometry args={[0.055, 0.11, 0.04]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* 5. Cockpit Interior Ambient LED Glow */}
      <pointLight position={[0, -0.1, -0.4]} color="#0ea5e9" intensity={0.45} distance={1.8} />
      <pointLight position={[0.4, -0.3, -0.2]} color="#f59e0b" intensity={0.25} distance={1.2} />
    </group>
  );
};

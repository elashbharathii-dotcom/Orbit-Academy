import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  SpacecraftFlightState,
  FlightControls,
  MissionDefinition,
  CameraViewMode,
} from '../types';
import { Cockpit3D } from './Cockpit3D';

interface MissionEnvironment3DProps {
  flightState: SpacecraftFlightState;
  flightControls: FlightControls;
  mission: MissionDefinition;
  cameraMode: CameraViewMode;
}

export const MissionEnvironment3D: React.FC<MissionEnvironment3DProps> = ({
  flightState,
  flightControls,
  mission,
  cameraMode,
}) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const issRef = useRef<THREE.Group>(null);
  const asteroidRef = useRef<THREE.Group>(null);
  const shipChaseRef = useRef<THREE.Group>(null);
  const exhaustPlumeRef = useRef<THREE.Mesh>(null);

  // Rotate planet & tumble asteroid slowly
  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.02;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.025;
    }
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x += delta * 0.04;
      asteroidRef.current.rotation.y += delta * 0.06;
    }
    if (issRef.current) {
      issRef.current.rotation.z += delta * 0.01;
    }

    // Flicker rocket engine exhaust plume with throttle
    if (exhaustPlumeRef.current) {
      if (flightControls.engineIgnited && flightControls.throttle > 0.01) {
        const flicker = 0.85 + Math.random() * 0.3;
        exhaustPlumeRef.current.scale.set(
          1,
          flightControls.throttle * 3.5 * flicker,
          1
        );
        exhaustPlumeRef.current.visible = true;
      } else {
        exhaustPlumeRef.current.visible = false;
      }
    }

    // Sync chase ship rotation with flight state
    if (shipChaseRef.current && cameraMode !== 'cockpit') {
      shipChaseRef.current.rotation.x = flightState.rotation.x;
      shipChaseRef.current.rotation.y = flightState.rotation.y;
      shipChaseRef.current.rotation.z = flightState.rotation.z;
    }
  });

  const target = mission.targetBody;

  return (
    <>
      {/* 1. Deep Space Cosmic Background */}
      <color attach="background" args={['#02040a']} />
      <Stars radius={250} depth={80} count={6000} factor={4} saturation={0.5} fade speed={1} />

      {/* 2. Primary Solar Lighting */}
      <ambientLight intensity={target === 'sun' ? 2.5 : 0.25} />
      <directionalLight
        position={target === 'sun' ? [0, 0, 50] : [80, 40, 60]}
        intensity={target === 'sun' ? 4.0 : 1.8}
        color={target === 'sun' ? '#fed7aa' : '#f8fafc'}
      />

      {/* 3. 3D Cockpit Structure (Rendered in Cockpit Camera Mode) */}
      {cameraMode === 'cockpit' && (
        <Cockpit3D
          flightState={flightState}
          flightControls={flightControls}
        />
      )}

      {/* 4. External Spacecraft Model (Visible in Chase Mode) */}
      {cameraMode !== 'cockpit' && (
        <group ref={shipChaseRef} position={[0, 0, 0]}>
          {/* Main Command Capsule Body */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.9, 2.2, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Service Module Cylinder */}
          <mesh position={[0, -1.6, 0]}>
            <cylinderGeometry args={[0.88, 0.88, 1.4, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
          </mesh>

          {/* Engine Bell */}
          <mesh position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.5, 0.7, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.9} />
          </mesh>

          {/* Dynamic Rocket Exhaust Flame */}
          <mesh ref={exhaustPlumeRef} position={[0, -3.2, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.42, 1.2, 12]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
          </mesh>

          {/* Solar Arrays (if deployed) */}
          {flightControls.solarDeployed && (
            <group position={[0, -1.6, 0]}>
              {/* Left Wing */}
              <mesh position={[-2.4, 0, 0]}>
                <boxGeometry args={[3.2, 0.6, 0.05]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Right Wing */}
              <mesh position={[2.4, 0, 0]}>
                <boxGeometry args={[3.2, 0.6, 0.05]} />
                <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.9} />
              </mesh>
            </group>
          )}

          {/* Landing Gear (if deployed) */}
          {flightControls.gearDeployed && (
            <group position={[0, -2.4, 0]}>
              {[-0.85, 0.85].map((x, idx) => (
                <mesh key={idx} position={[x, -0.4, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
                  <meshStandardMaterial color="#64748b" metalness={0.8} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}

      {/* 5. Celestial Body Environments */}
      {/* A. EARTH / LEO ENVIRONMENT */}
      {(target === 'earth' || target === 'iss') && (
        <group position={[0, -140, -60]}>
          {/* Earth Body */}
          <mesh ref={planetRef}>
            <sphereGeometry args={[120, 64, 64]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Atmospheric Limb Glow */}
          <mesh ref={atmosphereRef}>
            <sphereGeometry args={[122.5, 64, 64]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.25}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      )}

      {/* B. INTERNATIONAL SPACE STATION (ISS) 3D MODEL */}
      {target === 'iss' && (
        <group ref={issRef} position={[0, 4, -45]}>
          {/* Main Central Truss Beam */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[22, 0.6, 0.6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>

          {/* Pressurized Modules (Destiny, Unity, Zvezda) */}
          <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 6.5, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* International Docking Adapter (IDA-2) Target Ring */}
          <mesh position={[0, 0, 4.8]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.65, 0.1, 16, 24]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Left Solar Array Wings */}
          <mesh position={[-8.5, 0, 0]}>
            <boxGeometry args={[6.5, 3.2, 0.08]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Right Solar Array Wings */}
          <mesh position={[8.5, 0, 0]}>
            <boxGeometry args={[6.5, 3.2, 0.08]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* C. MOON / LUNAR SURFACE ENVIRONMENT */}
      {target === 'moon' && (
        <group position={[0, -110, -50]}>
          <mesh ref={planetRef}>
            <sphereGeometry args={[95, 64, 64]} />
            <meshStandardMaterial
              color="#94a3b8"
              roughness={0.95}
              metalness={0.05}
            />
          </mesh>
        </group>
      )}

      {/* D. MARS / JEZERO RED ENVIRONMENT */}
      {target === 'mars' && (
        <group position={[0, -120, -55]}>
          {/* Mars Sphere */}
          <mesh ref={planetRef}>
            <sphereGeometry args={[105, 64, 64]} />
            <meshStandardMaterial
              color="#dc2626"
              roughness={0.85}
              metalness={0.15}
            />
          </mesh>

          {/* Thin Martian Orange Haze */}
          <mesh ref={atmosphereRef}>
            <sphereGeometry args={[107, 64, 64]} />
            <meshBasicMaterial
              color="#ea580c"
              transparent
              opacity={0.18}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      )}

      {/* E. ASTEROID BENNU (TUMBLING BOULDER BODY) */}
      {target === 'asteroid' && (
        <group ref={asteroidRef} position={[0, 0, -35]}>
          <mesh>
            <dodecahedronGeometry args={[8.5, 2]} />
            <meshStandardMaterial
              color="#334155"
              roughness={0.95}
              metalness={0.2}
              flatShading
            />
          </mesh>
        </group>
      )}

      {/* F. SUN / PARKER PERIHELION ENVIRONMENT */}
      {target === 'sun' && (
        <group position={[0, 0, -140]}>
          <mesh>
            <sphereGeometry args={[75, 48, 48]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>

          {/* Intense Solar Corona Glow */}
          <mesh>
            <sphereGeometry args={[88, 48, 48]} />
            <meshBasicMaterial color="#fdba74" transparent opacity={0.3} side={THREE.BackSide} />
          </mesh>
        </group>
      )}
    </>
  );
};

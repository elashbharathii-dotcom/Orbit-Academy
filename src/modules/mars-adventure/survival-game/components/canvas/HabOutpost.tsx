import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';

export const HabOutpost: React.FC = () => {
  const doorOpen = useMarsGameStore((state) => state.doorOpen);
  const renovations = useMarsGameStore((state) => state.renovations);

  const dishRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const commPulseRef = useRef<THREE.Mesh>(null);
  const reactorCoilRef = useRef<THREE.Group>(null);

  // Door slide references
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  const rearDoorLeftRef = useRef<THREE.Mesh>(null);
  const rearDoorRightRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // 1. Communication dish & beacon
    const commActive = renovations.comm_room;
    if (dishRef.current) {
      dishRef.current.rotation.y += delta * (commActive ? 0.8 : 0.15);
    }
    if (beaconRef.current) {
      beaconRef.current.intensity = commActive
        ? 1.5 + Math.sin(Date.now() * 0.008) * 1.0
        : 0.4 + Math.sin(Date.now() * 0.003) * 0.3;
    }
    if (commPulseRef.current && commActive) {
      const scale = 1.0 + ((Date.now() % 2000) / 2000) * 1.8;
      commPulseRef.current.scale.set(scale, scale, scale);
      const mat = commPulseRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 1.0 - (Date.now() % 2000) / 2000);
      }
    }

    // 2. Main Outer Airlock Sliding Doors
    const targetDoorX = doorOpen ? 0.95 : 0;
    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.lerp(
        leftDoorRef.current.position.x,
        -targetDoorX,
        delta * 6.0
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.lerp(
        rightDoorRef.current.position.x,
        targetDoorX,
        delta * 6.0
      );
    }

    // 3. Habitat Expansion Rear Sliding Doors
    const expansionUnlocked = renovations.hab_expansion;
    const targetRearDoorX = expansionUnlocked ? 0.85 : 0;
    if (rearDoorLeftRef.current) {
      rearDoorLeftRef.current.position.x = THREE.MathUtils.lerp(
        rearDoorLeftRef.current.position.x,
        -targetRearDoorX,
        delta * 4.0
      );
    }
    if (rearDoorRightRef.current) {
      rearDoorRightRef.current.position.x = THREE.MathUtils.lerp(
        rearDoorRightRef.current.position.x,
        targetRearDoorX,
        delta * 4.0
      );
    }

    // 4. Power Room Reactor Energy Coil Rotation
    if (reactorCoilRef.current && renovations.power_room) {
      reactorCoilRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group position={[0, 0, 0]} name="HabOutpostAlpha">
      {/* ========================================================
          1. PRIMARY HABITAT DOME (ALPHA DOME)
      ======================================================== */}
      {/* Geodesic Dome Exterior */}
      <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[7.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#F1F5F9"
          roughness={0.25}
          metalness={0.8}
          bumpScale={0.05}
        />
      </mesh>

      {/* Habitat Base Foundation Ring */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[7.8, 8.2, 0.8, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Habitat Interior Floor */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[7.4, 32]} />
        <meshStandardMaterial color="#1E293B" roughness={0.6} />
      </mesh>

      {/* --------------------------------------------------------
          UPGRADE 1: POWER ROOM RESTORATION & CEILING LIGHTS
      -------------------------------------------------------- */}
      {renovations.power_room ? (
        /* Operational Power: Crisp bright white/cyan halogen illumination */
        <group name="PowerRoomOperational">
          <pointLight position={[0, 4.2, 0]} color="#F8FAFC" intensity={1.8} distance={18} />
          <pointLight position={[0, 2.5, -3.0]} color="#38BDF8" intensity={1.2} distance={10} />
          {/* Overhead Halogen Chandelier Fixture */}
          <group position={[0, 5.2, 0]}>
            <mesh>
              <cylinderGeometry args={[1.6, 1.6, 0.15, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[1.4, 1.4, 0.05, 16]} />
              <meshBasicMaterial color="#E0F2FE" />
            </mesh>
          </group>

          {/* Active Reactor Core on Interior Back Wall */}
          <group position={[0, 1.2, -6.0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.9, 1.1, 2.2, 16]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Pulsing Energy Coils */}
            <group ref={reactorCoilRef}>
              {[0.4, -0.4].map((offsetY, i) => (
                <mesh key={i} position={[0, offsetY, 0]}>
                  <torusGeometry args={[1.05, 0.08, 12, 24]} />
                  <meshBasicMaterial color="#F59E0B" />
                </mesh>
              ))}
            </group>
            <pointLight position={[0, 0.8, 0.5]} color="#F59E0B" intensity={1.2} distance={5} />
          </group>
        </group>
      ) : (
        /* Damaged Power Grid: Dim emergency red strobe and flickering lights */
        <group name="PowerRoomDamaged">
          <pointLight position={[0, 2.5, 0]} color="#EF4444" intensity={0.45} distance={12} />
          <pointLight position={[0, 1.5, -3.2]} color="#EF4444" intensity={0.6} distance={6} />
          {/* Emergency Red Warning Beacon in Ceiling */}
          <mesh position={[0, 4.5, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      )}

      {/* --------------------------------------------------------
          INTERIOR TERMINAL: LIFE SUPPORT & GENERAL TELEMETRY
      -------------------------------------------------------- */}
      <group position={[0, 0.8, -3.2]} name="TelemetryTerminal">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.1, 0.7]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.32, 0.37]}>
          <planeGeometry args={[1.3, 0.55]} />
          <meshBasicMaterial color={renovations.power_room ? '#38BDF8' : '#EF4444'} />
        </mesh>
        <pointLight
          position={[0, 0.4, 0.6]}
          color={renovations.power_room ? '#38BDF8' : '#EF4444'}
          intensity={0.6}
          distance={3}
        />
      </group>

      {/* --------------------------------------------------------
          INTERIOR TERMINAL: SPACE CENTER MATERIAL VAULT
          Position: [-3.2, 0.8, -2.0]
      -------------------------------------------------------- */}
      <group position={[-3.2, 0.8, -2.0]} rotation={[0, Math.PI / 4, 0]} name="VaultTerminal">
        {/* Terminal Pedestal */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.1, 0.7]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Vault Hologram Screen */}
        <mesh position={[0, 0.35, 0.37]}>
          <planeGeometry args={[1.0, 0.5]} />
          <meshBasicMaterial color="#06B6D4" />
        </mesh>
        {/* Vault Door Emblem */}
        <mesh position={[0, -0.15, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 0.5, 0.6]} color="#06B6D4" intensity={0.9} distance={3.5} />
      </group>

      {/* --------------------------------------------------------
          INTERIOR TERMINAL: BASE RENOVATION & ENGINEERING DESK
          Position: [3.2, 0.8, -2.0]
      -------------------------------------------------------- */}
      <group position={[3.2, 0.8, -2.0]} rotation={[0, -Math.PI / 4, 0]} name="RenovationTerminal">
        {/* Terminal Pedestal */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.1, 0.7]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Blueprint Hologram Screen */}
        <mesh position={[0, 0.35, 0.37]}>
          <planeGeometry args={[1.0, 0.5]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        {/* Gear Emblem */}
        <mesh position={[0, -0.15, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 8]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0.5, 0.6]} color="#F59E0B" intensity={0.9} distance={3.5} />
      </group>

      {/* --------------------------------------------------------
          UPGRADE 2: STORAGE ROOM RESTORATION (LOCKERS & CARGO)
      -------------------------------------------------------- */}
      {renovations.storage_room && (
        <group position={[-5.4, 0, 0.5]} rotation={[0, Math.PI / 2, 0]} name="StorageRoomModules">
          {/* Heavy Equipment Lockers Unit 1 & 2 */}
          {[-1.0, 1.0].map((offsetX, i) => (
            <group key={i} position={[offsetX, 1.3, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.4, 2.4, 0.8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Locker Door Seams & Handles */}
              <mesh position={[0, 0, 0.42]}>
                <boxGeometry args={[1.2, 2.1, 0.04]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Cyan Status LED */}
              <mesh position={[0.45, 0.9, 0.45]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#06B6D4" />
              </mesh>
            </group>
          ))}
          {/* Stacked Cargo Transport Pods */}
          <group position={[0, 0.4, 0.6]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.7, 0.7]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.36]}>
              <planeGeometry args={[1.2, 0.25]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
          </group>
          <pointLight position={[0, 1.8, 0.8]} color="#06B6D4" intensity={0.6} distance={4} />
        </group>
      )}

      {/* --------------------------------------------------------
          UPGRADE 3: GREENHOUSE BIO-DOME RESTORATION & UV CROPS
      -------------------------------------------------------- */}
      {renovations.greenhouse && (
        <group position={[5.2, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]} name="GreenhouseBioDome">
          {/* Hydroponic Plant Beds (3 levels) */}
          {[-0.9, 0.9].map((offsetZ, i) => (
            <group key={i} position={[0, 0, offsetZ]}>
              {/* Hydroponic Tray Container */}
              <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.4, 0.7]} />
                <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Regolith Growth Medium */}
              <mesh position={[0, 0.68, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.05, 0.6]} />
                <meshStandardMaterial color="#78350F" roughness={0.9} />
              </mesh>
              {/* Lush Green Crop Foliage */}
              {[-0.5, 0, 0.5].map((plantX, j) => (
                <group key={j} position={[plantX, 0.75, 0]}>
                  <mesh castShadow>
                    <sphereGeometry args={[0.16, 8, 8]} />
                    <meshStandardMaterial color="#22C55E" roughness={0.5} />
                  </mesh>
                  <mesh position={[0.08, 0.05, 0.05]} castShadow>
                    <sphereGeometry args={[0.12, 6, 6]} />
                    <meshStandardMaterial color="#16A34A" roughness={0.6} />
                  </mesh>
                </group>
              ))}
              {/* Overhead Magenta UV LED Grow Light Fixture */}
              <mesh position={[0, 1.8, 0]} castShadow>
                <boxGeometry args={[1.5, 0.08, 0.2]} />
                <meshStandardMaterial color="#0F172A" metalness={0.8} />
              </mesh>
              <mesh position={[0, 1.74, 0]}>
                <planeGeometry args={[1.4, 0.15]} />
                <meshBasicMaterial color="#E879F9" />
              </mesh>
            </group>
          ))}
          {/* Vibrant UV Grow Light Glow */}
          <pointLight position={[0, 1.6, 0]} color="#D946EF" intensity={1.4} distance={6} />
          <pointLight position={[0, 0.7, 0]} color="#22C55E" intensity={0.4} distance={3} />
        </group>
      )}

      {/* --------------------------------------------------------
          UPGRADE 4: COMMUNICATION ROOM & ROTATING DEEP-SPACE DISH
      -------------------------------------------------------- */}
      <group position={[0, 7.5, 0]} name="CommMastSection">
        {/* Structural Antenna Mast */}
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.28, 4.5, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Beacon Light */}
        <pointLight
          ref={beaconRef}
          position={[0, 2.4, 0]}
          color={renovations.comm_room ? '#06B6D4' : '#EF4444'}
          distance={35}
        />
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial color={renovations.comm_room ? '#06B6D4' : '#EF4444'} />
        </mesh>
        {/* Parabolic Radar Dish */}
        <group ref={dishRef} position={[0, 1.6, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
            <coneGeometry args={[1.4, 0.45, 20, 1, true]} />
            <meshStandardMaterial
              color="#F8FAFC"
              metalness={0.85}
              roughness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Feed Horn */}
          <mesh position={[0, 0.35, 0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial color="#38BDF8" metalness={0.9} />
          </mesh>
        </group>
        {/* Telemetry Pulse Wave Animation */}
        {renovations.comm_room && (
          <mesh ref={commPulseRef} position={[0, 2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.1, 32]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* --------------------------------------------------------
          UPGRADE 5: HABITAT EXPANSION MODULE (SECONDARY DOME)
      -------------------------------------------------------- */}
      {/* Rear Corridor Connector at z = -7.4 */}
      <group position={[0, 1.4, -7.4]} name="ExpansionCorridor">
        {/* Tunnel Housing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.6, 3.2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Corridor Interior Lighting */}
        <pointLight position={[0, 0.8, 0]} color="#F8FAFC" intensity={renovations.hab_expansion ? 0.8 : 0.2} distance={5} />

        {/* Sliding Rear Bulkhead Door Panels */}
        <mesh ref={rearDoorLeftRef} position={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 2.1, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh ref={rearDoorRightRef} position={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 2.1, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Bulkhead Status Indicator */}
        <mesh position={[0, 1.15, 0.1]}>
          <planeGeometry args={[0.5, 0.15]} />
          <meshBasicMaterial color={renovations.hab_expansion ? '#10B981' : '#EF4444'} />
        </mesh>
      </group>

      {/* Secondary Geodesic Dome (Living Quarters & Observation Wing) */}
      <group position={[0, 0, -14.5]} name="SecondaryHabDome">
        {/* Secondary Dome Shell */}
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
          <sphereGeometry args={[5.5, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={renovations.hab_expansion ? '#F1F5F9' : '#64748B'}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Foundation Ring */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[5.7, 6.0, 0.7, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Floor */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <circleGeometry args={[5.4, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>

        {/* Observation Deck Windows (Facing North onto Crater Rim) */}
        <mesh position={[0, 1.8, -5.2]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.8, 1.2]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.4}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>

        {/* Interior Lighting & Comfort Fixtures if Unlocked */}
        {renovations.hab_expansion && (
          <group name="ExpansionInterior">
            <pointLight position={[0, 3.2, 0]} color="#F8FAFC" intensity={1.5} distance={14} />
            <pointLight position={[0, 1.2, -4.0]} color="#38BDF8" intensity={0.8} distance={6} />
            {/* Central Holographic Observation Table */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.0, 0.8, 0.8, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 0.05, 16]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        )}
      </group>

      {/* ========================================================
          2. PRESSURIZED AIRLOCK MODULE (ENTRANCE TUNNEL)
      ======================================================== */}
      <group position={[0, 1.4, 7.8]} name="AirlockModule">
        {/* Tunnel Housing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.8, 3.4]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Outer Door Frame at z = 1.7 */}
        <mesh position={[0, 0, 1.72]} castShadow>
          <boxGeometry args={[2.4, 2.4, 0.15]} />
          <meshStandardMaterial color="#0284C7" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Dynamic Sliding Door Panels */}
        <mesh ref={leftDoorRef} position={[-0.45, 0, 1.74]} castShadow>
          <boxGeometry args={[0.95, 2.1, 0.08]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh ref={rightDoorRef} position={[0.45, 0, 1.74]} castShadow>
          <boxGeometry args={[0.95, 2.1, 0.08]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* External Door Control Terminal Panel */}
        <group position={[1.4, 0, 1.78]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.5, 0.1]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[0.2, 0.3]} />
            <meshBasicMaterial color={doorOpen ? '#10B981' : '#EF4444'} />
          </mesh>
        </group>

        {/* Status Indicator LED */}
        <mesh position={[1.2, 0.9, 1.75]}>
          <boxGeometry args={[0.2, 0.2, 0.05]} />
          <meshBasicMaterial color={doorOpen ? '#10B981' : '#EF4444'} />
        </mesh>

        <pointLight
          position={[1.2, 0.9, 2.0]}
          color={doorOpen ? '#10B981' : '#EF4444'}
          intensity={0.7}
          distance={4}
        />
      </group>

      {/* ========================================================
          3. PHOTOVOLTAIC SOLAR ARRAY FIELD (AT Z = 18)
      ======================================================== */}
      <group position={[0, 0, 18]} name="PhotovoltaicArray">
        {[-4, 0, 4].map((offsetX, idx) => (
          <group key={idx} position={[offsetX, 0, 0]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 2.4, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 6, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.8, 0.08, 1.8]} />
              <meshStandardMaterial color="#0369A1" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          4. MOXIE ATMOSPHERIC PROCESSOR & O2 STORAGE TANKS
      ======================================================== */}
      <group position={[-6.2, 0, 4.5]} name="MOXIEProcessor">
        <mesh position={[-0.8, 1.4, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.6, 1.6, 8, 16]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.8, 1.4, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.6, 1.6, 8, 16]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.8, 0.8]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.6, 1.2]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

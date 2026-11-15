import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';

export const HabOutpost: React.FC = () => {
  const renovations = useMarsGameStore((state) => state.renovations);
  const facilityRenovations = useMarsGameStore((state) => state.facilityRenovations);
  const doorOpen = useMarsGameStore((state) => state.doorOpen);
  const activeCraftingJob = useMarsGameStore((state) => state.activeCraftingJob);
  const isBlackout = useMarsGameStore((state) => state.powerGrid.isBlackout);
  const solCycle = useMarsGameStore((state) => state.solCycle);

  const dishRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const commPulseRef = useRef<THREE.Mesh>(null);
  const reactorCoilRef = useRef<THREE.Group>(null);
  const fabLaserRef = useRef<THREE.Group>(null);
  const shredderDrumRef = useRef<THREE.Group>(null);
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  const rearDoorLeftRef = useRef<THREE.Mesh>(null);
  const rearDoorRightRef = useRef<THREE.Mesh>(null);
  const commandHolomapRef = useRef<THREE.Group>(null);
  const algaeBubbleRef = useRef<THREE.Mesh>(null);
  const garageLiftRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // 0. Fabrication & Disassembly Animations
    if (fabLaserRef.current) {
      if (activeCraftingJob) {
        fabLaserRef.current.position.y = 1.0 + Math.sin(Date.now() * 0.006) * 0.35;
        fabLaserRef.current.rotation.y += delta * 3.0;
      } else {
        fabLaserRef.current.position.y = 1.0;
      }
    }
    if (shredderDrumRef.current) {
      shredderDrumRef.current.rotation.x += delta * 0.7;
    }

    // 1. Communication dish & beacon (Command & Comm Room levels)
    const commLvl = facilityRenovations?.comm_room ?? (renovations.comm_room ? 1 : 0);
    if (dishRef.current) {
      const rotSpeed = commLvl >= 2 ? 0.8 : commLvl === 1 ? 0.2 : 0;
      dishRef.current.rotation.y += delta * rotSpeed;
    }
    if (beaconRef.current) {
      beaconRef.current.intensity =
        commLvl >= 2
          ? 1.8 + Math.sin(Date.now() * 0.008) * 1.0
          : commLvl === 1
            ? 0.8 + Math.sin(Date.now() * 0.004) * 0.4
            : 0.3;
    }
    if (commPulseRef.current && commLvl >= 2) {
      const scale = 1.0 + ((Date.now() % 2000) / 2000) * 1.8;
      commPulseRef.current.scale.set(scale, scale, scale);
      const mat = commPulseRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 1.0 - (Date.now() % 2000) / 2000);
      }
    }

    // 2. Command Centre Rotating Hologram
    const cmdLvl = facilityRenovations?.command_centre ?? 0;
    if (commandHolomapRef.current && cmdLvl >= 2) {
      commandHolomapRef.current.rotation.y += delta * 0.6;
    }

    // 3. Greenhouse Algae Photobioreactor Bubbles
    const ghLvl = facilityRenovations?.greenhouse ?? (renovations.greenhouse ? 1 : 0);
    if (algaeBubbleRef.current && ghLvl >= 3) {
      algaeBubbleRef.current.position.y = 1.0 + Math.sin(Date.now() * 0.004) * 0.25;
    }

    // 4. Main Outer Airlock Sliding Doors
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

    // 5. Habitat Expansion Rear Sliding Doors
    const expansionUnlocked =
      (facilityRenovations?.living_quarters ?? 0) >= 1 ||
      (facilityRenovations?.greenhouse ?? 0) >= 1 ||
      renovations.hab_expansion;
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

    // 6. Engineering Workshop Reactor Coil Rotation
    const engLvl = facilityRenovations?.engineering_workshop ?? (renovations.power_room ? 1 : 0);
    if (reactorCoilRef.current && engLvl >= 1) {
      reactorCoilRef.current.rotation.y += delta * (engLvl >= 3 ? 3.0 : 1.5);
    }

    // 7. Garage Hoist Animation
    const garageLvl = facilityRenovations?.rover_garage ?? 0;
    if (garageLiftRef.current && garageLvl >= 3) {
      garageLiftRef.current.position.y = 1.2 + Math.sin(Date.now() * 0.002) * 0.3;
    }
  });

  const cmdLvl = facilityRenovations?.command_centre ?? 0;
  const ghLvl = facilityRenovations?.greenhouse ?? (renovations.greenhouse ? 1 : 0);
  const engLvl = facilityRenovations?.engineering_workshop ?? (renovations.power_room ? 1 : 0);
  const garageLvl = facilityRenovations?.rover_garage ?? 0;
  const lqLvl = facilityRenovations?.living_quarters ?? (renovations.hab_expansion ? 1 : 0);
  const commLvl = facilityRenovations?.comm_room ?? (renovations.comm_room ? 1 : 0);
  const expansionUnlocked = lqLvl >= 1 || ghLvl >= 1 || renovations.hab_expansion;

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
          FACILITY 3: ENGINEERING WORKSHOP & REACTOR POWER GRID
          Position: West Sector [-3.6, 0, 1.0]
      -------------------------------------------------------- */}
      {engLvl >= 1 ? (
        <group name="PowerRoomOperational">
          <pointLight
            position={[0, 4.2, 0]}
            color={isBlackout ? '#EF4444' : '#F8FAFC'}
            intensity={isBlackout ? 0.35 : engLvl >= 3 ? 2.2 : 1.8}
            distance={18}
          />
          <pointLight
            position={[0, 2.5, -3.0]}
            color={isBlackout ? '#EF4444' : '#38BDF8'}
            intensity={isBlackout ? 0.2 : 1.2}
            distance={10}
          />
          {isBlackout && (
            <pointLight
              position={[0, 3.5, 0]}
              color="#EF4444"
              intensity={1.5}
              distance={15}
            />
          )}
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
                  <meshBasicMaterial color={engLvl >= 3 ? '#00F0FF' : '#F59E0B'} />
                </mesh>
              ))}
            </group>
            <pointLight
              position={[0, 0.8, 0.5]}
              color={engLvl >= 3 ? '#00F0FF' : '#F59E0B'}
              intensity={engLvl >= 3 ? 1.8 : 1.2}
              distance={engLvl >= 3 ? 7 : 5}
            />
          </group>
        </group>
      ) : (
        /* Level 0 Damaged Power Grid: Dim emergency red strobe and flickering warning lights */
        <group name="PowerRoomDamaged">
          <pointLight position={[0, 2.5, 0]} color="#EF4444" intensity={0.45} distance={12} />
          <pointLight position={[0, 1.5, -3.2]} color="#EF4444" intensity={0.6} distance={6} />
          <mesh position={[0, 4.5, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      )}

      {/* --------------------------------------------------------
          FACILITY 1: COMMAND CENTRE & EXPLORATION RADAR
          Position: North Sector [0, 0, -3.6]
      -------------------------------------------------------- */}
      <group position={[0, 0.8, -3.4]} name="CommandCentreFacility">
        {/* Main Command Console Desk */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.1, 0.8]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Main Status Screens */}
        <mesh position={[0, 0.35, 0.42]}>
          <planeGeometry args={[1.6, 0.55]} />
          <meshBasicMaterial color={cmdLvl >= 1 ? '#00F0FF' : '#EF4444'} />
        </mesh>
        {/* Curved Side Monitors */}
        <mesh position={[-0.9, 0.35, 0.3]} rotation={[0, 0.3, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color={cmdLvl >= 1 ? '#38BDF8' : '#7F1D1D'} />
        </mesh>
        <mesh position={[0.9, 0.35, 0.3]} rotation={[0, -0.3, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color={cmdLvl >= 2 ? '#10B981' : '#7F1D1D'} />
        </mesh>

        {/* Mission Operations Terminal Interface Terminal [0.7, 0.58, 0.1] */}
        <group position={[0.7, 0.58, 0.1]} rotation={[-0.35, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.04, 0.38]} />
            <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 0.32]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <pointLight position={[0, 0.25, 0]} color="#00F0FF" intensity={0.6} distance={1.8} />
        </group>

        {/* Planetary Science & Blueprint Research Terminal [-0.7, 0.58, 0.1] */}
        <group position={[-0.7, 0.58, 0.1]} rotation={[-0.35, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.04, 0.38]} />
            <meshStandardMaterial color="#581C87" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 0.32]} />
            <meshBasicMaterial color="#A855F7" />
          </mesh>
          <pointLight position={[0, 0.25, 0]} color="#A855F7" intensity={0.6} distance={1.8} />
        </group>

        {/* Intelligent Base AI & Autonomous Command Hub Console [0.0, 0.58, 0.1] */}
        <group position={[0.0, 0.58, 0.1]} rotation={[-0.35, 0, 0]} name="IntelligentBaseAIConsole">
          <mesh castShadow>
            <boxGeometry args={[0.58, 0.045, 0.38]} />
            <meshStandardMaterial color="#0E7490" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Holographic Touch Screen */}
          <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.52, 0.32]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>
          {/* AI Status LED Ring */}
          <mesh position={[0, 0.028, -0.09]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.035, 0.05, 16]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          <pointLight position={[0, 0.3, 0]} color="#06B6D4" intensity={0.8} distance={2.2} />
        </group>

        {/* Level 2 & 3: 3D Rotating Topographic Mars Holomap */}
        {cmdLvl >= 2 && (
          <group ref={commandHolomapRef} position={[0, 0.95, 0]}>
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshBasicMaterial color="#F97316" wireframe transparent opacity={0.65} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.45, 0.48, 24]} />
              <meshBasicMaterial color="#00F0FF" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
            <pointLight position={[0, 0.2, 0]} color="#00F0FF" intensity={0.9} distance={3} />
          </group>
        )}

        {/* Level 3: Quantum Computing Server Tower with fiber optic conduits */}
        {cmdLvl >= 3 && (
          <group position={[1.4, 0.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 1.8, 0.6]} />
              <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.15} />
            </mesh>
            {[-0.4, 0, 0.4].map((slotY, i) => (
              <mesh key={i} position={[0, slotY, 0.31]}>
                <planeGeometry args={[0.4, 0.12]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
            ))}
            <pointLight position={[0, 0.8, 0.4]} color="#00F0FF" intensity={1.2} distance={4} />
          </group>
        )}

        <pointLight
          position={[0, 0.4, 0.7]}
          color={cmdLvl >= 1 ? '#00F0FF' : '#EF4444'}
          intensity={cmdLvl >= 2 ? 1.0 : 0.6}
          distance={3.5}
        />
      </group>

      {/* --------------------------------------------------------
          FACILITY 3: DISASSEMBLY & FABRICATION WORKSHOP ASSETS
      -------------------------------------------------------- */}
      {/* Machine 1: Disassembly Shredder */}
      <group position={[-3.6, 0, 1.5]} rotation={[0, Math.PI / 3, 0]} name="DisassemblyMachine">
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 1.1, 0.85]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.15, 0.05]} castShadow>
          <cylinderGeometry args={[0.38, 0.28, 0.35, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
        </mesh>
        <group ref={shredderDrumRef} position={[0, 1.1, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.38, 8]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.15} />
          </mesh>
          {[-0.12, 0, 0.12].map((yOffset, i) => (
            <mesh key={i} position={[0, yOffset, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
              <boxGeometry args={[0.26, 0.04, 0.08]} />
              <meshStandardMaterial color="#EF4444" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
        <mesh position={[0, 0.45, 0.44]}>
          <planeGeometry args={[0.85, 0.4]} />
          <meshBasicMaterial color={engLvl >= 1 ? '#10B981' : '#7F1D1D'} />
        </mesh>
        <pointLight position={[0, 0.9, 0.6]} color={engLvl >= 1 ? '#10B981' : '#7F1D1D'} intensity={0.8} distance={3.5} />
      </group>

      {/* Machine 2: Molecular Sintering Fabrication Unit */}
      <group position={[3.6, 0, 1.5]} rotation={[0, -Math.PI / 3, 0]} name="FabricationUnit">
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 1.1, 0.85]} />
          <meshStandardMaterial color="#0F172A" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[1.1, 0.65, 0.7]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} metalness={0.2} transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, 0.96, 0]} receiveShadow>
          <boxGeometry args={[0.85, 0.06, 0.55]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <group ref={fabLaserRef} position={[0, 1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.08, 0.2]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.015, 0.03, 0.3, 8]} />
            <meshBasicMaterial color={activeCraftingJob ? '#00F0FF' : '#F59E0B'} transparent opacity={0.8} />
          </mesh>
        </group>
        <mesh position={[0, 0.45, 0.44]}>
          <planeGeometry args={[0.85, 0.4]} />
          <meshBasicMaterial color={activeCraftingJob ? '#00F0FF' : engLvl >= 1 ? '#38BDF8' : '#7F1D1D'} />
        </mesh>
        <pointLight
          position={[0, 1.2, 0.5]}
          color={activeCraftingJob ? '#00F0FF' : '#38BDF8'}
          intensity={activeCraftingJob ? 1.6 : engLvl >= 1 ? 0.8 : 0.2}
          distance={4}
        />
      </group>

      {/* Machine 3: Electronics & Avionics Workbench (Level 2+ Operational) */}
      {engLvl >= 2 && (
        <group position={[0, 0, 4.0]} rotation={[0, Math.PI, 0]} name="ElectronicsWorkbench">
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.95, 0.65]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.99, 0]} receiveShadow>
            <boxGeometry args={[1.4, 0.02, 0.55]} />
            <meshStandardMaterial color="#0284C7" roughness={0.6} />
          </mesh>
          <mesh position={[-0.35, 1.3, 0.15]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.55, 0.4]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <mesh position={[0.35, 1.3, 0.15]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.55, 0.4]} />
            <meshBasicMaterial color="#06B6D4" />
          </mesh>
          <group position={[0.55, 1.05, -0.05]} rotation={[0.4, -0.6, 0.3]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
          </group>
          <pointLight position={[0, 1.2, 0.4]} color="#06B6D4" intensity={0.7} distance={3} />
        </group>
      )}

      {/* Material Vault Terminal [-3.2, 0.8, -2.0] */}
      <group position={[-3.2, 0.8, -2.0]} rotation={[0, Math.PI / 4, 0]} name="VaultTerminal">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.1, 0.7]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, 0.37]}>
          <planeGeometry args={[1.0, 0.5]} />
          <meshBasicMaterial color="#06B6D4" />
        </mesh>
        <mesh position={[0, -0.15, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.9} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 0.5, 0.6]} color="#06B6D4" intensity={0.9} distance={3.5} />
      </group>

      {/* Renovation Master Console [3.2, 0.8, -2.0] */}
      <group position={[3.2, 0.8, -2.0]} rotation={[0, -Math.PI / 4, 0]} name="RenovationTerminal">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.1, 0.7]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, 0.37]}>
          <planeGeometry args={[1.0, 0.5]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        <mesh position={[0, -0.15, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 8]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0.5, 0.6]} color="#F59E0B" intensity={0.9} distance={3.5} />
      </group>

      {/* Heavy Equipment Lockers Unit (Level 2+ Storage) */}
      {engLvl >= 2 && (
        <group position={[-5.4, 0, 0.5]} rotation={[0, Math.PI / 2, 0]} name="StorageRoomModules">
          {[-1.0, 1.0].map((offsetX, i) => (
            <group key={i} position={[offsetX, 1.3, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.4, 2.4, 0.8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, 0.42]}>
                <boxGeometry args={[1.2, 2.1, 0.04]} />
                <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0.45, 0.9, 0.45]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color="#06B6D4" />
              </mesh>
            </group>
          ))}
          <pointLight position={[0, 1.8, 0.8]} color="#06B6D4" intensity={0.6} distance={4} />
        </group>
      )}

      {/* ========================================================
          FACILITY 6: COMMUNICATIONS ROOM & ROOFTOP RADAR MAST
          Position: Roof Mast [0, 7.5, 0]
      ======================================================== */}
      <group position={[0, 7.5, 0]} name="CommMastSection">
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.28, 4.5, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight
          ref={beaconRef}
          position={[0, 2.4, 0]}
          color={commLvl >= 1 ? '#06B6D4' : '#EF4444'}
          distance={35}
        />
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial color={commLvl >= 1 ? '#06B6D4' : '#EF4444'} />
        </mesh>
        {/* Parabolic Radar Dish */}
        <group ref={dishRef} position={[0, 1.6, 0]}>
          <mesh rotation={[commLvl >= 1 ? Math.PI / 4 : Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[1.4, 0.45, 20, 1, true]} />
            <meshStandardMaterial
              color="#F8FAFC"
              metalness={0.85}
              roughness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.35, 0.4]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial color="#38BDF8" metalness={0.9} />
          </mesh>
        </group>
        {/* Level 2 & 3: Telemetry Pulse Wave Animation */}
        {commLvl >= 2 && (
          <mesh ref={commPulseRef} position={[0, 2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.1, 32]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}
        {/* Level 3: Quantum Entanglement Resonator Rings */}
        {commLvl >= 3 && (
          <group position={[0, 3.2, 0]}>
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.6, 0.04, 8, 24]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
            <mesh rotation={[-Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.75, 0.04, 8, 24]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        )}
      </group>

      {/* ========================================================
          FACILITY 4: ROVER MAINTENANCE GARAGE (EXTERIOR SERVICE BAY)
          Position: [8.5, 0, 4.0]
      ======================================================== */}
      <group position={[8.5, 0, 4.0]} name="RoverGarageFacility">
        {/* Service Pad Concrete Foundation */}
        <mesh position={[0, 0.05, 0]} receiveShadow>
          <boxGeometry args={[6.5, 0.1, 7.5]} />
          <meshStandardMaterial
            color={garageLvl >= 1 ? '#334155' : '#1E293B'}
            roughness={0.8}
            metalness={0.3}
          />
        </mesh>

        {/* Level 1+: Painted Industrial Yellow/Black Hazard Stripes */}
        {garageLvl >= 1 && (
          <group position={[0, 0.11, 0]}>
            {/* Left and Right Yellow Hazard Rails */}
            <mesh position={[-3.1, 0, 0]}>
              <boxGeometry args={[0.2, 0.02, 7.2]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <mesh position={[3.1, 0, 0]}>
              <boxGeometry args={[0.2, 0.02, 7.2]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            {/* Night Service Floodlight Mast */}
            <mesh position={[3.0, 1.8, -3.4]} castShadow>
              <cylinderGeometry args={[0.08, 0.1, 3.6, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <pointLight position={[3.0, 3.6, -3.4]} color="#F8FAFC" intensity={1.8} distance={15} />
          </group>
        )}

        {/* Level 2+: Cantilever Steel Canopy & Wireless Induction Pad */}
        {garageLvl >= 2 && (
          <group name="GarageCanopyAndInduction">
            {/* Heavy Canopy Overhead Roof */}
            <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[6.8, 0.25, 7.8]} />
              <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Support Pillars */}
            {[-3.1, 3.1].map((px, i) => (
              <mesh key={i} position={[px, 1.9, -3.5]} castShadow>
                <cylinderGeometry args={[0.15, 0.18, 3.8, 12]} />
                <meshStandardMaterial color="#64748B" metalness={0.8} />
              </mesh>
            ))}
            {/* Wireless Ground Induction Charging Deck */}
            <mesh position={[0, 0.12, 0]}>
              <planeGeometry args={[3.2, 4.5]} />
              <meshBasicMaterial color="#00F0FF" transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.35, 24]} />
              <meshBasicMaterial color="#00F0FF" side={THREE.DoubleSide} />
            </mesh>
            <pointLight position={[0, 0.6, 0]} color="#00F0FF" intensity={1.4} distance={6} />
          </group>
        )}

        {/* Level 3: Robotic Diagnostic Arm & Hydraulic Hoist */}
        {garageLvl >= 3 && (
          <group ref={garageLiftRef} position={[-2.4, 1.2, 1.0]} name="RoboticServiceArm">
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.4, 0.6]} />
              <meshStandardMaterial color="#0284C7" metalness={0.8} />
            </mesh>
            <mesh position={[0.6, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
            <mesh position={[1.2, 0, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <pointLight position={[1.2, 0, 0]} color="#10B981" intensity={1.2} distance={4} />
          </group>
        )}
      </group>

      {/* ========================================================
          REAR CORRIDOR & SECONDARY HAB DOME (FACILITIES 2 & 5)
      ======================================================== */}
      {/* Rear Corridor Connector at z = -7.4 */}
      <group position={[0, 1.4, -7.4]} name="ExpansionCorridor">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 2.6, 3.2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.7} />
        </mesh>
        <pointLight position={[0, 0.8, 0]} color="#F8FAFC" intensity={expansionUnlocked ? 0.8 : 0.2} distance={5} />

        {/* Sliding Rear Bulkhead Door Panels */}
        <mesh ref={rearDoorLeftRef} position={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 2.1, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh ref={rearDoorRightRef} position={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 2.1, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.15, 0.1]}>
          <planeGeometry args={[0.5, 0.15]} />
          <meshBasicMaterial color={expansionUnlocked ? '#10B981' : '#EF4444'} />
        </mesh>
      </group>

      {/* Secondary Geodesic Dome */}
      <group position={[0, 0, -14.5]} name="SecondaryHabDome">
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
          <sphereGeometry args={[5.5, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={expansionUnlocked ? '#F1F5F9' : '#64748B'}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[5.7, 6.0, 0.7, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.4} />
        </mesh>
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

        {/* Central Observation Table */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.0, 0.8, 0.8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.05, 16]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>

        {/* --------------------------------------------------------
            FACILITY 2: GREENHOUSE BIO-DOME WING [EAST: x = +3.2]
        -------------------------------------------------------- */}
        <group position={[3.2, 0, 0]} name="GreenhouseBioWing">
          {ghLvl >= 1 ? (
            /* Level 1+ Repaired Hydroponic Trays */
            <group>
              {[-1.1, 1.1].map((offsetZ, i) => (
                <group key={i} position={[0, 0, offsetZ]}>
                  <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.6, 0.4, 0.8]} />
                    <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 0.68, 0]} receiveShadow>
                    <boxGeometry args={[1.5, 0.05, 0.7]} />
                    <meshStandardMaterial color="#78350F" roughness={0.9} />
                  </mesh>

                  {/* Level 2+: Lush Green Sprouting Potato Crops */}
                  {ghLvl >= 2 && (
                    <group>
                      {[-0.5, 0, 0.5].map((plantX, j) => (
                        <group key={j} position={[plantX, 0.76, 0]}>
                          <mesh castShadow>
                            <sphereGeometry args={[0.18, 8, 8]} />
                            <meshStandardMaterial color="#22C55E" roughness={0.5} />
                          </mesh>
                          <mesh position={[0.08, 0.06, 0.06]} castShadow>
                            <sphereGeometry args={[0.13, 6, 6]} />
                            <meshStandardMaterial color="#16A34A" roughness={0.6} />
                          </mesh>
                        </group>
                      ))}
                      {/* UV Grow Lamp Fixtures */}
                      <mesh position={[0, 1.8, 0]} castShadow>
                        <boxGeometry args={[1.5, 0.08, 0.2]} />
                        <meshStandardMaterial color="#0F172A" metalness={0.8} />
                      </mesh>
                      <mesh position={[0, 1.74, 0]}>
                        <planeGeometry args={[1.4, 0.15]} />
                        <meshBasicMaterial color="#E879F9" />
                      </mesh>
                    </group>
                  )}
                </group>
              ))}
              <pointLight position={[0, 1.6, 0]} color={ghLvl >= 2 ? '#D946EF' : '#F8FAFC'} intensity={1.4} distance={6} />
            </group>
          ) : (
            /* Level 0 Abandoned Greenhouse Trays */
            <group>
              <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.6, 0.3, 1.8]} />
                <meshStandardMaterial color="#334155" roughness={0.9} />
              </mesh>
              <pointLight position={[0, 1.0, 0]} color="#EF4444" intensity={0.2} distance={3} />
            </group>
          )}

          {/* Level 3: Vertical Algae Photobioreactor Column */}
          {ghLvl >= 3 && (
            <group position={[0.9, 0, 0]} name="AlgaePhotobioreactor">
              <mesh position={[0, 1.4, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 2.2, 16]} />
                <meshStandardMaterial color="#10B981" transparent opacity={0.65} roughness={0.1} />
              </mesh>
              <mesh ref={algaeBubbleRef} position={[0, 1.0, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshBasicMaterial color="#34D399" />
              </mesh>
              <pointLight position={[0, 1.4, 0]} color="#10B981" intensity={1.6} distance={5} />
            </group>
          )}
        </group>

        {/* --------------------------------------------------------
            FACILITY 5: LIVING QUARTERS & MED-BAY [WEST: x = -3.2]
        -------------------------------------------------------- */}
        <group position={[-3.2, 0, 0]} name="LivingQuartersFacility">
          {lqLvl >= 1 ? (
            /* Level 1+ Repaired Crew Bunk Beds */
            <group>
              {[-1.0, 1.0].map((offsetZ, i) => (
                <group key={i} position={[0, 0, offsetZ]}>
                  {/* Bunk Bed Frame */}
                  <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.6, 0.45, 0.85]} />
                    <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
                  </mesh>
                  {/* Quilted Mattress / Sleeping Bag */}
                  <mesh position={[0, 0.72, 0]} receiveShadow>
                    <boxGeometry args={[1.5, 0.12, 0.75]} />
                    <meshStandardMaterial color={lqLvl >= 2 ? '#0284C7' : '#475569'} roughness={0.7} />
                  </mesh>
                  {/* Reading Lamp Sconce */}
                  <mesh position={[-0.7, 1.1, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.2, 0.1]} />
                    <meshBasicMaterial color={lqLvl >= 2 ? '#38BDF8' : '#F59E0B'} />
                  </mesh>
                </group>
              ))}
              <pointLight position={[0, 1.5, 0]} color={lqLvl >= 2 ? '#38BDF8' : '#F59E0B'} intensity={1.2} distance={6} />
            </group>
          ) : (
            /* Level 0 Stripped Aluminium Frames */
            <group>
              <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.5, 0.2, 1.6]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.4} />
              </mesh>
              <pointLight position={[0, 1.0, 0]} color="#EF4444" intensity={0.2} distance={3} />
            </group>
          )}

          {/* Level 3: Medical Bio-Bed & Vital Decontamination Unit */}
          {lqLvl >= 3 && (
            <group position={[-0.8, 0, 0]} name="MedicalBioBed">
              <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 0.7, 1.8]} />
                <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.8} />
              </mesh>
              {/* Holographic Diagnostic Canopy */}
              <mesh position={[0, 1.5, 0]}>
                <planeGeometry args={[0.7, 1.5]} />
                <meshBasicMaterial color="#00F0FF" transparent opacity={0.4} side={THREE.DoubleSide} />
              </mesh>
              <pointLight position={[0, 1.4, 0]} color="#00F0FF" intensity={1.5} distance={4} />
            </group>
          )}
        </group>
      </group>

      {/* ========================================================
          PRESSURIZED AIRLOCK MODULE (ENTRANCE TUNNEL)
      ======================================================== */}
      <group position={[0, 1.4, 7.8]} name="AirlockModule">
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.8, 3.4]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 1.72]} castShadow>
          <boxGeometry args={[2.4, 2.4, 0.15]} />
          <meshStandardMaterial color="#0284C7" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh ref={leftDoorRef} position={[-0.45, 0, 1.74]} castShadow>
          <boxGeometry args={[0.95, 2.1, 0.08]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh ref={rightDoorRef} position={[0.45, 0, 1.74]} castShadow>
          <boxGeometry args={[0.95, 2.1, 0.08]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
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
          PHOTOVOLTAIC SOLAR ARRAY FIELD (AT Z = 18)
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
            {/* Operational Inverter Diode Indicator */}
            <mesh position={[0, 0.6, 0.15]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color={solCycle.isDaytime && !isBlackout ? '#10B981' : '#475569'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          MOXIE ATMOSPHERIC PROCESSOR & O2 STORAGE TANKS
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

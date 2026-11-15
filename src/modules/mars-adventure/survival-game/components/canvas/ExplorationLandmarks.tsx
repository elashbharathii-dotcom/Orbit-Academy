import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { getTerrainHeight } from './MarsTerrain';

export const ExplorationLandmarks: React.FC = () => {
  const discoveredIds = useMarsGameStore((state) => state.discoveredLandmarkIds);
  const targeted = useMarsGameStore((state) => state.targetedInteractable);
  const visorScanActive = useMarsGameStore((state) => state.settings.visorScanActive);
  const isRoverDiscovered = discoveredIds.includes('loc_abandoned_rover');

  const beaconLightRef = useRef<THREE.PointLight>(null);
  const relayBeaconRef = useRef<THREE.PointLight>(null);
  const lavaPulseRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const time = Date.now() * 0.003;
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 0.8 + Math.sin(time * 3) * 0.6;
    }
    if (relayBeaconRef.current) {
      relayBeaconRef.current.intensity = 1.0 + Math.sin(time * 4) * 0.8;
    }
    if (lavaPulseRef.current) {
      lavaPulseRef.current.intensity = 1.5 + Math.sin(time * 1.5) * 0.5;
    }
  });

  // Coordinates:
  // 1. Abandoned Rover: [38, 0, -32]
  const yRover = getTerrainHeight(38, -32);
  // 2. Lava Tube Entrance: [-35, 0, -42]
  const yLava = getTerrainHeight(-35, -42);
  // 3. Comms Relay Tower: [42, 0, 28]
  const yTower = getTerrainHeight(42, 28);
  // 4. Jezero Delta Outcrop: [-40, 0, 22]
  const yDelta = getTerrainHeight(-40, 22);
  // 5. Crater Borealis Meteorite: [0, 0, 52]
  const yCrater = getTerrainHeight(0, 52);
  // 6. Skycrane Impact Crater: [75, 0, -55]
  const ySkycrane = getTerrainHeight(75, -55);
  // 7. Ares Geological Survey Outpost: [-75, 0, 65]
  const yAres = getTerrainHeight(-75, 65);
  // 8. Mawrth Canyon Deep-Core Rig: [85, 0, 15]
  const yCanyon = getTerrainHeight(85, 15);

  return (
    <group name="ExplorationLandmarksGroup">
      {/* ========================================================
          1. ABANDONED EXPLORATION ROVER ("Opportunity-Beta") [38, y, -32]
          ======================================================== */}
      <group position={[38, yRover, -32]} rotation={[0.08, 0.45, -0.12]}>
        {/* Weathered Rover Chassis */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.5, 1.4]} />
          <meshStandardMaterial color="#78350F" metalness={0.7} roughness={0.7} />
        </mesh>

        {/* Oxidized Upper Deck */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 1.1]} />
          <meshStandardMaterial color="#92400E" metalness={0.5} roughness={0.8} />
        </mesh>

        {/* Shattered Solar Panel Deck */}
        <mesh position={[0, 1.05, 0]} rotation={[0.05, 0, 0.08]} castShadow>
          <boxGeometry args={[2.0, 0.05, 1.3]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Tilted Pancam Sensor Mast */}
        <group position={[0.6, 1.1, 0.3]} rotation={[0.3, 0.2, -0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.06, 1.1, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.25, 0.12, 0.18]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* 6 Half-Buried Sanded Wheels */}
        {[
          [-1.1, 0.35, -0.85],
          [0, 0.32, -0.88],
          [1.1, 0.35, -0.85],
          [-1.1, 0.35, 0.85],
          [0, 0.32, 0.88],
          [1.1, 0.35, 0.85],
        ].map(([wx, wy, wz], i) => (
          <mesh key={i} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, i * 0.4]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.32, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.6} />
          </mesh>
        ))}

        {/* Recovery Avionics Core Unit (Target for scanning/salvage) */}
        <group position={[0.2, 1.15, -0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.25, 0.3]} />
            <meshStandardMaterial
              color={targeted?.id === 'scan_rover_avionics' ? '#00F0FF' : '#F59E0B'}
              emissive="#F59E0B"
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight ref={beaconLightRef} position={[0, 0.2, 0]} color={isRoverDiscovered ? '#10B981' : '#F59E0B'} distance={6} />
        </group>

        {/* Regolith Sand Drift Mound piling against chassis */}
        <mesh position={[-0.4, 0.2, 0]} scale={[2.6, 0.6, 2.2]}>
          <sphereGeometry args={[0.8, 12, 8]} />
          <meshStandardMaterial color="#854D0E" roughness={0.95} />
        </mesh>
      </group>

      {/* ========================================================
          2. ANCIENT SUBTERRANEAN LAVA TUBE CAVE [-35, y, -42]
          ======================================================== */}
      <group position={[-35, yLava, -42]}>
        {/* Massive Basalt Arch Forming Cave Mouth */}
        <mesh position={[0, 3.2, 0]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
          <torusGeometry args={[4.2, 1.8, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#1E293B" roughness={0.9} metalness={0.2} />
        </mesh>

        {/* Open Walkable Entrance Tunnel Arch Portal into Subterranean Cave System */}
        <mesh position={[0, 2.0, -1.8]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[3.2, 3.6, 3.2, 12, 1, true]} />
          <meshStandardMaterial color="#0B0F19" roughness={0.96} side={THREE.BackSide} />
        </mesh>

        {/* Columnar Basalt Cooling Joints / Spires */}
        {[
          [-3.8, 1.8, 0.4, 3.6],
          [-2.8, 2.4, -0.8, 4.8],
          [2.9, 2.2, -0.6, 4.4],
          [3.9, 1.7, 0.5, 3.4],
        ].map(([sx, sy, sz, sh], i) => (
          <mesh key={i} position={[sx, sy, sz]} castShadow>
            <cylinderGeometry args={[0.45, 0.65, sh, 6]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} metalness={0.4} />
          </mesh>
        ))}

        {/* Geothermal Deep Subsurface Glow */}
        <pointLight
          ref={lavaPulseRef}
          position={[0, 1.5, -2.5]}
          color="#EA580C"
          intensity={1.8}
          distance={14}
        />

        {/* Cave Entrance Floor Marker Ring */}
        <mesh position={[0, 0.1, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 3.0, 24]} />
          <meshBasicMaterial
            color="#EA580C"
            transparent
            opacity={visorScanActive ? 0.6 : 0.2}
          />
        </mesh>
      </group>

      {/* ========================================================
          3. DAMAGED COMMS RELAY TOWER [42, y, 28]
          ======================================================== */}
      <group position={[42, yTower, 28]} rotation={[0.2, -0.8, 1.25]}>
        {/* Overturned Triangular Steel Lattice Mast */}
        {[0, 2.5, 5.0, 7.5].map((zPos, i) => (
          <group key={i} position={[0, 0, zPos]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 1.2, 0.15]} />
              <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Cross Struts */}
            <mesh position={[0, 0, 1.2]} rotation={[0, 0, Math.PI / 4]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Cracked Parabolic Reflector Dish on Ground */}
        <group position={[0, 0.2, 8.8]} rotation={[-0.8, 0.2, 0.4]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.8, 0.4, 0.3, 16, 1, true]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Feedhorn Apex with Emergency Strobe */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <pointLight ref={relayBeaconRef} position={[0, 1.0, 0]} color="#00F0FF" distance={10} />
        </group>
      </group>

      {/* ========================================================
          4. JEZERO PALEOLAKE DELTA OUTCROP [-40, y, 22]
          ======================================================== */}
      <group position={[-40, yDelta, 22]}>
        {/* Tiered Sedimentary Strata Slabs */}
        {[
          [0, 0.4, 0, 6.5, 0.8, 5.5, '#78350F'],
          [-0.4, 1.1, -0.3, 5.2, 0.7, 4.2, '#92400E'],
          [0.2, 1.7, 0.1, 3.8, 0.6, 3.2, '#B45309'],
          [-0.1, 2.2, 0.2, 2.4, 0.5, 2.0, '#D97706'],
        ].map(([tx, ty, tz, sx, sy, sz, col], i) => (
          <mesh key={i} position={[Number(tx), Number(ty), Number(tz)]} castShadow receiveShadow>
            <boxGeometry args={[Number(sx), Number(sy), Number(sz)]} />
            <meshStandardMaterial color={String(col)} roughness={0.95} metalness={0.05} />
          </mesh>
        ))}

        {/* Exposed Smectite Clay Vein with Spectral Glint */}
        <group position={[0.5, 2.5, 0.3]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial
              color="#38BDF8"
              roughness={0.2}
              metalness={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          <pointLight color="#38BDF8" intensity={0.6} distance={4} />
        </group>
      </group>

      {/* ========================================================
          5. CRATER BOREALIS METEORITE IMPACT [0, y, 52]
          ======================================================== */}
      <group position={[0, yCrater, 52]}>
        {/* Impact Rim Ring Raised Berm */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[3.5, 6.0, 24]} />
          <meshStandardMaterial color="#451A03" roughness={0.95} />
        </mesh>

        {/* Central Impact Depression */}
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.5, 24]} />
          <meshStandardMaterial color="#1C1917" roughness={0.98} />
        </mesh>

        {/* Nickel-Iron Meteorite Monolith Core */}
        <group position={[0, 0.6, 0]} rotation={[0.4, 0.8, -0.3]}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[1.1, 1]} />
            <meshStandardMaterial
              color="#1E293B"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
          {/* Sintered Metallic Fusion Crust highlights */}
          <mesh position={[0.2, 0.3, 0.1]} scale={[1.05, 1.05, 1.05]}>
            <dodecahedronGeometry args={[0.9, 0]} />
            <meshBasicMaterial
              color="#38BDF8"
              wireframe
              transparent
              opacity={visorScanActive ? 0.7 : 0.15}
            />
          </mesh>
          <pointLight color="#60A5FA" intensity={0.5} distance={5} />
        </group>
      </group>

      {/* ========================================================
          6. SKYCRANE IMPACT CRATER [75, y, -55]
          ======================================================== */}
      <group position={[75, ySkycrane, -55]}>
        {/* Impact Bowl Depression */}
        <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[5.2, 24]} />
          <meshStandardMaterial color="#18181B" roughness={0.96} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[5.0, 7.5, 24]} />
          <meshStandardMaterial color="#3F3F46" roughness={0.94} />
        </mesh>

        {/* Shattered Hexagonal Titanium Descent Stage Frame */}
        <group position={[0, 0.4, 0]} rotation={[0.2, 0.6, -0.15]}>
          {[0, 1, 2, 3, 4, 5].map((side) => {
            const ang = (side * Math.PI) / 3;
            return (
              <mesh key={side} position={[Math.cos(ang) * 1.8, 0, Math.sin(ang) * 1.8]} rotation={[0, ang, 0]} castShadow>
                <boxGeometry args={[1.5, 0.35, 0.18]} />
                <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
              </mesh>
            );
          })}
          {/* Charred Hydrazine Propellant Tanks */}
          {[-0.8, 0.8].map((xOff, i) => (
            <mesh key={i} position={[xOff, 0.5, 0]} castShadow>
              <sphereGeometry args={[0.55, 16, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.5} />
            </mesh>
          ))}
          {/* Reaction Control Thruster Assembly (Scannable Target) */}
          <group position={[0, 0.8, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.3, 0.7, 8]} />
              <meshStandardMaterial
                color={targeted?.id === 'scan_skycrane_propellant' ? '#00F0FF' : '#E11D48'}
                emissive="#E11D48"
                emissiveIntensity={0.35}
                metalness={0.85}
              />
            </mesh>
            <pointLight position={[0, 0.4, 0]} color="#E11D48" intensity={0.9} distance={6} />
          </group>
        </group>
      </group>

      {/* ========================================================
          7. ARES GEOLOGICAL SURVEY OUTPOST [-75, y, 65]
          ======================================================== */}
      <group position={[-75, yAres, 65]}>
        {/* Equipment Shelter Footing Foundation */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.4, 3.6]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Sealed Weather Station Enclosure Box */}
        <mesh position={[-0.8, 0.9, 0]} castShadow>
          <boxGeometry args={[1.4, 1.0, 1.2]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Photovoltaic Array Panel */}
        <mesh position={[0.9, 1.1, 0]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.6, 0.08, 1.2]} />
          <meshStandardMaterial color="#0284C7" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Meteorological Anemometer & Telemetry Mast */}
        <group position={[-1.2, 2.5, 1.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.08, 3.2, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Anemometer Crossarms */}
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[0.8, 0.04, 0.04]} />
            <meshStandardMaterial color="#94A3B8" />
          </mesh>
          <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.8, 0.04, 0.04]} />
            <meshStandardMaterial color="#94A3B8" />
          </mesh>
        </group>

        {/* Broadband Seismometer Sensor Unit (Scannable Target) */}
        <group position={[0.6, 0.55, 0.8]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.3, 0.35, 12]} />
            <meshStandardMaterial
              color={targeted?.id === 'scan_ares_seismometer' ? '#00F0FF' : '#F59E0B'}
              emissive="#F59E0B"
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight position={[0, 0.4, 0]} color="#F59E0B" intensity={0.7} distance={5} />
        </group>
      </group>

      {/* ========================================================
          8. MAWRTH CANYON DEEP-CORE RIG [85, y, 15]
          ======================================================== */}
      <group position={[85, yCanyon, 15]}>
        {/* Heavy Drill Rig Foundation Skids */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 0.5, 4.2]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.5} />
        </mesh>

        {/* 4-Legged Drilling Derrick Tower */}
        {[
          [-1.6, -1.2],
          [1.6, -1.2],
          [-1.6, 1.2],
          [1.6, 1.2],
        ].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 2.8, lz]} rotation={[lz > 0 ? -0.15 : 0.15, 0, lx > 0 ? -0.15 : 0.15]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 5.0, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}

        {/* Derrick Top Crown Block */}
        <mesh position={[0, 5.3, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 1.2]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Central Rotary Kelly Drive Shaft into Bedrock */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 4.8, 8]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Rotary Drill Head & Core Extractor (Scannable Target) */}
        <group position={[0, 0.6, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.5, 0.8, 12]} />
            <meshStandardMaterial
              color={targeted?.id === 'scan_canyon_core_drill' ? '#00F0FF' : '#10B981'}
              emissive="#10B981"
              emissiveIntensity={0.3}
              metalness={0.9}
            />
          </mesh>
          <pointLight position={[0, 0.6, 0]} color="#10B981" intensity={0.8} distance={6} />
        </group>

        {/* Core Sample Storage Tray Rack */}
        <group position={[2.1, 0.7, -0.6]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.8, 1.6]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          {/* Transparent Glass Core Tubes */}
          {[-0.4, 0, 0.4].map((zOffset, ti) => (
            <mesh key={ti} position={[0, 0.2, zOffset]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
              <meshStandardMaterial color="#BAE6FD" roughness={0.1} transparent opacity={0.75} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

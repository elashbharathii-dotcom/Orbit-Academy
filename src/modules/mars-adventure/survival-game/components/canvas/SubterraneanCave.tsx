import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { ProceduralTerrainSystem } from '../../systems/proceduralTerrainSystem';

export const SubterraneanCave: React.FC = () => {
  const targeted = useMarsGameStore((state) => state.targetedInteractable);
  const playerPos = useMarsGameStore((state) => state.playerPosition);
  const visorScanActive = useMarsGameStore((state) => state.settings.visorScanActive);

  const fissureLightRef = useRef<THREE.PointLight>(null);
  const crystalLightRef = useRef<THREE.PointLight>(null);
  const helmetLightRef = useRef<THREE.SpotLight>(null);

  // Check if player is currently inside cave
  const isPlayerInside = useMemo(() => {
    return ProceduralTerrainSystem.getInstance().isPointInCave(playerPos[0], playerPos[2]);
  }, [playerPos[0], playerPos[2]]);

  // Dynamic light pulsing for fissure and crystal
  useFrame(() => {
    const time = Date.now() * 0.002;
    if (fissureLightRef.current) {
      fissureLightRef.current.intensity = 1.6 + Math.sin(time * 2.2) * 0.45;
    }
    if (crystalLightRef.current) {
      crystalLightRef.current.intensity = 1.2 + Math.cos(time * 1.8) * 0.35;
    }
    if (helmetLightRef.current) {
      // Suit flashlight activates automatically when inside the dark cave or when visor scan is on
      const targetIntensity = isPlayerInside || visorScanActive ? 3.5 : 0;
      helmetLightRef.current.intensity = THREE.MathUtils.lerp(
        helmetLightRef.current.intensity,
        targetIntensity,
        0.1
      );
      // Track player position for helmet spotlight
      helmetLightRef.current.position.set(playerPos[0], playerPos[1] + 1.8, playerPos[2]);
    }
  });

  // 1. Walkable Cavern Floor Mesh
  const caveFloorGeo = useMemo(() => {
    // Generate a fine grid over the cave bounds: x in [-42, -18], z in [-78, -40]
    const width = 24;
    const depth = 38;
    const segmentsX = 36;
    const segmentsZ = 52;
    const geo = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const terrainSys = ProceduralTerrainSystem.getInstance();

    const basaltDark = new THREE.Color('#0F172A'); // Dark volcanic basalt
    const basaltAsh = new THREE.Color('#1E293B'); // Weathered ash
    const magmaWarm = new THREE.Color('#7C2D12'); // Fissure heat tint
    const tempColor = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      // World coordinate offset
      const wx = pos.getX(i) + (-30);
      const wz = pos.getZ(i) + (-59);
      pos.setX(i, wx);
      pos.setZ(i, wz);

      const inCave = terrainSys.isPointInCave(wx, wz);
      if (inCave) {
        const fy = terrainSys.getCaveFloorHeight(wx, wz);
        pos.setY(i, fy);

        // Heat gradient near fissure at [-30, -68]
        const dFissure = Math.hypot(wx - (-30), wz - (-68));
        if (dFissure < 6.0) {
          tempColor.lerpColors(magmaWarm, basaltDark, dFissure / 6.0);
        } else {
          tempColor.lerpColors(basaltDark, basaltAsh, Math.random() * 0.3);
        }
      } else {
        // Drop non-cave perimeter vertices below visible geometry
        pos.setY(i, -25);
        tempColor.set('#000000');
      }

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 2. Arched Basalt Vault Ceiling
  const caveCeilingGeo = useMemo(() => {
    const width = 26;
    const depth = 40;
    const segmentsX = 36;
    const segmentsZ = 52;
    const geo = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
    geo.rotateX(Math.PI / 2); // Face downward

    const pos = geo.attributes.position;
    const terrainSys = ProceduralTerrainSystem.getInstance();

    for (let i = 0; i < pos.count; i++) {
      const wx = pos.getX(i) + (-30);
      const wz = pos.getZ(i) + (-59);
      pos.setX(i, wx);
      pos.setZ(i, wz);

      if (terrainSys.isPointInCave(wx, wz)) {
        const cy = terrainSys.getCaveCeilingHeight(wx, wz);
        // Add rocky stalactite bumps to ceiling
        const stalactiteBump = Math.sin(wx * 1.5) * Math.cos(wz * 1.5) * 0.35;
        pos.setY(i, cy + stalactiteBump);
      } else {
        pos.setY(i, 20); // Outside ceiling rises high
      }
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group name="SubterraneanCaveSystem">
      {/* Dynamic Helmet Flashlight attached to Player in Cavern */}
      <spotLight
        ref={helmetLightRef}
        color="#E0F2FE"
        intensity={0}
        angle={Math.PI / 4.5}
        penumbra={0.6}
        distance={28}
        castShadow
      />

      {/* 1. Walkable Cavern Floor */}
      <mesh geometry={caveFloorGeo} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.94}
          metalness={0.2}
          bumpScale={0.08}
        />
      </mesh>

      {/* 2. Arched Ceiling Mesh */}
      <mesh geometry={caveCeilingGeo} receiveShadow castShadow>
        <meshStandardMaterial
          color="#090D16"
          roughness={0.96}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Entrance Ramp Rock Portals & Archway Reinforcements [-35, -44] */}
      <group position={[-35, -1.2, -45]}>
        {/* Support Rock Arches */}
        {[-3.2, 0, 3.2].map((xOff, idx) => (
          <mesh key={idx} position={[xOff, 1.8, idx * -2.5]} rotation={[0.2, 0, 0]} castShadow>
            <torusGeometry args={[3.2, 0.7, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#1E293B" roughness={0.92} />
          </mesh>
        ))}
      </group>

      {/* 4. Deep Geothermal Cavern Vault Features [-30, -5.2, -68] */}
      <group position={[-30, -5.2, -68]}>
        {/* Thermal Magma Fissure Line */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0.4]}>
          <planeGeometry args={[1.4, 11.0]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#F97316"
            emissiveIntensity={2.5}
            roughness={0.3}
          />
        </mesh>

        {/* Fissure Glow PointLight */}
        <pointLight
          ref={fissureLightRef}
          position={[0, 1.2, 0]}
          color="#F97316"
          intensity={1.8}
          distance={18}
          decay={2}
        />

        {/* Subterranean Ancient Glacial Ice Wall (Rear Vault) */}
        <group position={[0, 2.5, -9.5]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[14.0, 5.5, 1.2]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.25}
              roughness={0.15}
              metalness={0.2}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Ancient Ice Core Sampling Target */}
          <group position={[1.5, 0, 0.8]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.25, 0.25, 1.8, 12]} />
              <meshStandardMaterial
                color={targeted?.id === 'scan_cave_ice_core' ? '#00F0FF' : '#38BDF8'}
                emissive="#00F0FF"
                emissiveIntensity={0.4}
              />
            </mesh>
            <pointLight
              ref={crystalLightRef}
              position={[0, 0.5, 0.5]}
              color="#00F0FF"
              intensity={1.2}
              distance={10}
            />
          </group>
        </group>

        {/* Columnar Basalt Spires & Rock Pillars around Chamber */}
        {[
          [-6.5, 2.2, -4.5, 5.2],
          [6.8, 2.5, -3.8, 5.8],
          [-7.2, 2.0, 3.5, 4.8],
          [6.5, 2.1, 4.2, 5.0],
          [-2.5, 2.6, 7.5, 6.0],
          [3.2, 2.4, 7.0, 5.6],
        ].map(([px, py, pz, ph], i) => (
          <group key={i} position={[px, py, pz]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.65, 0.95, ph, 6]} />
              <meshStandardMaterial color="#0B0F19" roughness={0.88} metalness={0.3} />
            </mesh>
            {/* Hanging Stalactites */}
            <mesh position={[0, ph * 0.5 + 0.8, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.4, 1.6, 5]} />
              <meshStandardMaterial color="#1E293B" roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Giant Quartz Geode & Silicate Crystal Cluster */}
        <group position={[-4.5, 0.8, -2.5]}>
          {[
            [0, 0, 0, 0.35, 1.6, 0.2],
            [0.4, -0.2, 0.3, 0.28, 1.2, -0.4],
            [-0.3, -0.1, -0.2, 0.25, 1.4, 0.5],
          ].map(([cx, cy, cz, cr, ch, rotZ], ci) => (
            <mesh key={ci} position={[cx, cy, cz]} rotation={[0.1, ci * 1.2, rotZ]} castShadow>
              <cylinderGeometry args={[0.08, cr, ch, 6]} />
              <meshStandardMaterial
                color="#A7F3D0"
                emissive="#10B981"
                emissiveIntensity={0.3}
                roughness={0.2}
                metalness={0.4}
                transparent
                opacity={0.92}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

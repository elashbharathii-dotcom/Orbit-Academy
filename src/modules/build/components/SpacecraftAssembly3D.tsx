import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  AssembledComponent,
  LiveryOption,
  MaterialFinish,
  TransformMode,
  ShadingMode,
} from '../types';
import { MATERIAL_STUDIO_FINISHES } from '../buildData';

interface SpacecraftAssembly3DProps {
  components: AssembledComponent[];
  isSimulating: boolean;
  livery: LiveryOption;
  materialFinish: MaterialFinish;
  selectedComponentId: string | null;
  onSelectComponent: (instanceId: string | null) => void;
  transformMode: TransformMode;
  onTransformChange: (
    instanceId: string,
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number]
  ) => void;
  shadingMode: ShadingMode;
  onRegisterRootGroup?: (group: THREE.Group | null) => void;
  explodedFactor?: number;
  showCenterOfMass?: boolean;
  showCenterOfThrust?: boolean;
  showMeasurementCalipers?: boolean;
}

/**
 * Animated High-Temperature Rocket Exhaust Plume & Shock Diamonds
 */
const HotFireExhaustPlume: React.FC<{
  engineType: string;
  isSimulating: boolean;
  glowColor: string;
}> = ({ engineType, isSimulating, glowColor }) => {
  const outerConeRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const diamondRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!isSimulating) return;
    const t = state.clock.getElapsedTime();

    if (outerConeRef.current) {
      const sxz = 1.0 + Math.sin(t * 40) * 0.08 + Math.cos(t * 22) * 0.04;
      const sy = 1.0 + Math.cos(t * 35) * 0.12;
      outerConeRef.current.scale.set(sxz, sy, sxz);
    }
    if (innerCoreRef.current) {
      const sy = 1.0 + Math.sin(t * 50) * 0.08;
      innerCoreRef.current.scale.set(1, sy, 1);
    }
    if (diamondRef.current) {
      diamondRef.current.position.z = -0.8 + Math.sin(t * 60) * 0.05;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 5.0 + Math.sin(t * 45) * 2.0;
    }
  });

  if (!isSimulating) return null;

  const isIon = engineType === 'e-ion-engine' || engineType === 'e-hall-thruster' || engineType === 'ft-xenon-sphere';

  if (isIon) {
    return (
      <group position={[0, 0, -1.2]} rotation={[Math.PI * 0.5, 0, 0]}>
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.06, 0.7, 2.6, 24, 1, true]} />
          <meshBasicMaterial
            color={glowColor || '#00E5FF'}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <coneGeometry args={[0.26, 1.4, 20]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.96}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight ref={lightRef} color={glowColor || '#00E5FF'} intensity={4.5} distance={14} />
      </group>
    );
  }

  return (
    <group position={[0, 0, -2.6]} rotation={[Math.PI * 0.5, 0, 0]}>
      {/* Outer turbulent flame plume */}
      <mesh ref={outerConeRef} position={[0, -1.8, 0]}>
        <coneGeometry args={[1.05, 4.4, 24, 1, true]} />
        <meshBasicMaterial
          color={glowColor || '#00E5FF'}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner high-temperature core */}
      <mesh ref={innerCoreRef} position={[0, -1.1, 0]}>
        <coneGeometry args={[0.55, 2.8, 20]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.98}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Supersonic Shock Diamonds */}
      <group ref={diamondRef} position={[0, -1.2, 0]}>
        {[-0.4, -1.0, -1.6, -2.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} scale={[0.22, 0.36, 0.22]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      <pointLight ref={lightRef} color={glowColor || '#00E5FF'} intensity={6} distance={18} />
    </group>
  );
};

/**
 * Component Selection Outlining & Bounding Wireframe
 */
const SelectionBoundingBox: React.FC<{ width: number; height: number; length?: number }> = ({
  width,
  height,
  length = 2.4,
}) => {
  return (
    <group>
      <mesh>
        <boxGeometry args={[width * 1.06, height * 1.06, length * 1.06]} />
        <meshBasicMaterial
          color="#00E5FF"
          wireframe
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Reticle corner targeting pips */}
      {[
        [-width * 0.53, height * 0.53, length * 0.53],
        [width * 0.53, height * 0.53, length * 0.53],
        [-width * 0.53, -height * 0.53, length * 0.53],
        [width * 0.53, -height * 0.53, length * 0.53],
        [-width * 0.53, height * 0.53, -length * 0.53],
        [width * 0.53, height * 0.53, -length * 0.53],
        [-width * 0.53, -height * 0.53, -length * 0.53],
        [width * 0.53, -height * 0.53, -length * 0.53],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Calculate dynamic disassembly offset along component mounting vector
 */
const getExplodedOffset = (comp: AssembledComponent, factor: number): [number, number, number] => {
  if (factor <= 0) return [0, 0, 0];
  const mult = factor * 4.6;
  let ox = 0, oy = 0, oz = 0;

  if (comp.mountSlot === 'top' || comp.category === 'cockpit' || comp.defId === 'f-nose-fairing') {
    oz = mult * 1.2;
  } else if (comp.mountSlot === 'bottom' || comp.category === 'engines' || comp.defId === 'f-tail-adapter') {
    oz = -mult * 1.35;
  }

  if (comp.mountSlot === 'radial' || comp.category === 'wings' || comp.category === 'solar_panels') {
    if (Math.abs(comp.position[0]) > 0.2) {
      ox = Math.sign(comp.position[0]) * mult * 1.35;
    }
    if (Math.abs(comp.position[1]) > 0.2) {
      oy = Math.sign(comp.position[1]) * mult * 1.0;
    }
  }

  if (comp.category === 'antennas' || comp.defId === 'a-parabolic-dish') {
    oy += mult * 1.15;
  }

  if (comp.category === 'scientific_instruments' || comp.defId === 'si-magnetometer') {
    if (Math.abs(comp.position[0]) > 0.2) {
      ox += Math.sign(comp.position[0]) * mult * 1.1;
    } else {
      oy += mult * 0.9;
    }
  }

  return [ox, oy, oz];
};

/**
 * NASA Standard Center of Mass (CoM) Indicator
 */
const CenterOfMassVisualizer: React.FC<{ comPosition: [number, number, number] }> = ({ comPosition }) => {
  return (
    <group position={comPosition}>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#FFD600" roughness={0.25} metalness={0.4} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.36, 0.04, 12, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.44, 0.52, 36]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <axesHelper args={[1.1]} />
    </group>
  );
};

/**
 * Center of Thrust (CoT) Vector Arrow
 */
const CenterOfThrustVisualizer: React.FC<{ cotPosition: [number, number, number] }> = ({ cotPosition }) => {
  return (
    <group position={cotPosition}>
      <mesh>
        <sphereGeometry args={[0.24, 20, 20]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI * 0.5, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 2.8, 12]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh position={[0, 0, 2.8]} rotation={[Math.PI * 0.5, 0, 0]}>
        <coneGeometry args={[0.18, 0.6, 16]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
    </group>
  );
};

/**
 * 3D CAD Bounding Calipers
 */
const MeasurementCalipersVisualizer: React.FC<{
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}> = ({ minX, maxX, minY, maxY, minZ, maxZ }) => {
  const width = Math.max(0.1, maxX - minX);
  const height = Math.max(0.1, maxY - minY);
  const length = Math.max(0.1, maxZ - minZ);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  return (
    <group position={[centerX, centerY, centerZ]}>
      <mesh>
        <boxGeometry args={[width, height, length]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

export const SpacecraftAssembly3D: React.FC<SpacecraftAssembly3DProps> = ({
  components,
  isSimulating,
  livery,
  materialFinish,
  selectedComponentId,
  onSelectComponent,
  transformMode,
  onTransformChange,
  shadingMode,
  onRegisterRootGroup,
  explodedFactor = 0,
  showCenterOfMass = false,
  showCenterOfThrust = false,
  showMeasurementCalipers = false,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const matConfig = MATERIAL_STUDIO_FINISHES[materialFinish] || MATERIAL_STUDIO_FINISHES.titanium;
  const isWireframe = shadingMode === 'wireframe';
  const isUnlit = shadingMode === 'unlit';
  const isCutaway = shadingMode === 'cutaway';

  // Center of Mass Calculation
  const centerOfMass = useMemo<[number, number, number]>(() => {
    let totalMass = 0;
    let sumX = 0, sumY = 0, sumZ = 0;
    for (const c of components) {
      const mass = c.mass + (c.propellantCapacity || 0) * (c.propellantFill ?? 1);
      totalMass += mass;
      sumX += c.position[0] * mass;
      sumY += c.position[1] * mass;
      sumZ += c.position[2] * mass;
    }
    if (totalMass <= 0) return [0, 0, 0];
    return [sumX / totalMass, sumY / totalMass, sumZ / totalMass];
  }, [components]);

  // Center of Thrust Calculation
  const centerOfThrust = useMemo<{ pos: [number, number, number]; totalThrust: number }>(() => {
    let totalThrust = 0;
    let sumX = 0, sumY = 0, sumZ = 0;
    for (const c of components) {
      if ((c.thrust || 0) > 0) {
        totalThrust += c.thrust;
        sumX += c.position[0] * c.thrust;
        sumY += c.position[1] * c.thrust;
        sumZ += c.position[2] * c.thrust;
      }
    }
    if (totalThrust <= 0) return { pos: [0, 0, -2], totalThrust: 0 };
    return { pos: [sumX / totalThrust, sumY / totalThrust, sumZ / totalThrust], totalThrust };
  }, [components]);

  // Bounding Box Caliper calculation
  const boundingLimits = useMemo(() => {
    let minX = 0, maxX = 0, minY = 0, maxY = 0, minZ = 0, maxZ = 0;
    if (components.length > 0) {
      minX = components[0].position[0];
      maxX = components[0].position[0];
      minY = components[0].position[1];
      maxY = components[0].position[1];
      minZ = components[0].position[2];
      maxZ = components[0].position[2];

      for (const c of components) {
        const halfW = (c.width || 1) * 0.5;
        const halfH = (c.height || 1) * 0.5;
        const halfL = (c.length || 2.4) * 0.5;
        minX = Math.min(minX, c.position[0] - halfW);
        maxX = Math.max(maxX, c.position[0] + halfW);
        minY = Math.min(minY, c.position[1] - halfH);
        maxY = Math.max(maxY, c.position[1] + halfH);
        minZ = Math.min(minZ, c.position[2] - halfL);
        maxZ = Math.max(maxZ, c.position[2] + halfL);
      }
    }
    return { minX, maxX, minY, maxY, minZ, maxZ };
  }, [components]);

  useEffect(() => {
    if (onRegisterRootGroup && rootGroupRef.current) {
      onRegisterRootGroup(rootGroupRef.current);
    }
  }, [onRegisterRootGroup]);

  // Gentle micro-thruster vibration during hot-fire simulation
  useFrame((state) => {
    if (!rootGroupRef.current) return;
    if (isSimulating) {
      const t = state.clock.getElapsedTime();
      rootGroupRef.current.position.x = Math.sin(t * 70) * 0.008;
      rootGroupRef.current.position.y = Math.cos(t * 85) * 0.008;
    } else {
      rootGroupRef.current.position.x = 0;
      rootGroupRef.current.position.y = 0;
    }
  });

  // =========================================================================
  // Physically Based Materials Suite
  // =========================================================================

  // 1. Primary Titanium / Milled Aluminum Alloy
  const primaryMaterial = useMemo(() => {
    if (isUnlit) return new THREE.MeshBasicMaterial({ color: livery.primaryColor, wireframe: isWireframe });
    if (isCutaway) {
      return new THREE.MeshPhysicalMaterial({
        color: '#0284C7',
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        metalness: 0.95,
        transmission: 0.85,
        thickness: 0.4,
        wireframe: false,
      });
    }
    const isGoldMLI = materialFinish === 'gold_insulation';
    return new THREE.MeshPhysicalMaterial({
      color: isGoldMLI ? '#F59E0B' : livery.primaryColor,
      roughness: isGoldMLI ? 0.2 : matConfig.roughness,
      metalness: isGoldMLI ? 0.98 : matConfig.metalness,
      clearcoat: isGoldMLI ? 0.6 : (matConfig.clearcoat ?? 0.3),
      clearcoatRoughness: 0.08,
      wireframe: isWireframe,
    });
  }, [livery.primaryColor, matConfig, isWireframe, isUnlit, isCutaway, materialFinish]);

  // 2. NASA Gold Kapton MLI Thermal Foil (Reflective Multi-Layer Insulation)
  const goldKaptonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#F59E0B',
      roughness: 0.18,
      metalness: 0.98,
      clearcoat: 0.65,
      clearcoatRoughness: 0.08,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 3. Carbon-Fiber Composite (Lattice Beams & Structural Ribs)
  const carbonCompositeMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#0B0F19',
      roughness: 0.42,
      metalness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.12,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 4. Aerospace Accent Material (Cadmium Orange / Mission Identity)
  const accentMaterial = useMemo(() => {
    if (isUnlit) return new THREE.MeshBasicMaterial({ color: livery.accentColor, wireframe: isWireframe });
    return new THREE.MeshPhysicalMaterial({
      color: livery.accentColor,
      roughness: 0.28,
      metalness: 0.85,
      clearcoat: 0.4,
      wireframe: isWireframe,
    });
  }, [livery.accentColor, isWireframe, isUnlit]);

  // 5. Dark Trim Alloy / Titanium Longerons
  const darkTrimMaterial = useMemo(() => {
    if (isUnlit) return new THREE.MeshBasicMaterial({ color: livery.trimColor, wireframe: isWireframe });
    return new THREE.MeshStandardMaterial({
      color: livery.trimColor,
      roughness: 0.4,
      metalness: 0.85,
      wireframe: isWireframe,
    });
  }, [livery.trimColor, isWireframe, isUnlit]);

  // 6. High-Efficiency Photovoltaic Solar Cells (Iridescent Dark Blue / Purple)
  const photovoltaicCellMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#0C4A6E',
      emissive: '#0369A1',
      emissiveIntensity: 0.3,
      roughness: 0.12,
      metalness: 0.92,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 7. Metallic Silver (Solar Gridlines, Busbars, Conduits, Flanges)
  const silverMetalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      roughness: 0.18,
      metalness: 0.95,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 8. Rocket Engine Combustion Chamber & Inconel Throat
  const engineInconelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1E293B',
      roughness: 0.32,
      metalness: 0.92,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 9. Niobium Nozzle Skirt with Heat-Treated Bronze Discoloration
  const engineNiobiumSkirtMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#78350F',
      roughness: 0.38,
      metalness: 0.88,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 10. Regenerative Cooling Tube Jacket (Copper-Alloy)
  const copperCoolingTubeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#B45309',
      roughness: 0.28,
      metalness: 0.9,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 11. Polarized Cockpit & Optical Sensor Quartz Glass
  const canopyGlassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#00E5FF',
      roughness: 0.04,
      metalness: 0.95,
      transmission: 0.88,
      thickness: 0.6,
      emissive: '#0284C7',
      emissiveIntensity: 0.35,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  // 12. Optical Sensor Lens
  const opticalLensMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#38BDF8',
      roughness: 0.02,
      metalness: 0.98,
      transmission: 0.92,
      thickness: 0.3,
      emissive: '#0284C7',
      emissiveIntensity: 0.5,
      wireframe: isWireframe,
    });
  }, [isWireframe]);

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {components.map((comp) => {
        const isSelected = selectedComponentId === comp.instanceId;
        const length = comp.length || 2.4;
        const [ox, oy, oz] = getExplodedOffset(comp, explodedFactor);
        const effectivePosition: [number, number, number] = [
          comp.position[0] + ox,
          comp.position[1] + oy,
          comp.position[2] + oz,
        ];

        const handleClick = (e: any) => {
          e.stopPropagation();
          onSelectComponent(comp.instanceId);
        };

        const partContent = (
          <group
            key={comp.instanceId}
            position={effectivePosition}
            rotation={comp.rotation}
            scale={comp.scale}
            onClick={handleClick}
          >
            {/* Selection Outline Box */}
            {isSelected && (
              <SelectionBoundingBox
                width={comp.width}
                height={comp.height}
                length={length}
              />
            )}

            {/* Exploded Assembly Leader Guidance Line & Mounting Socket Target */}
            {explodedFactor > 0.05 && Math.hypot(ox, oy, oz) > 0.1 && (
              <group position={[-ox, -oy, -oz]}>
                <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
                  <ringGeometry args={[0.18, 0.25, 20]} />
                  <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} side={THREE.DoubleSide} />
                </mesh>
                {/* 3D Cyan Leader Vector Line Connecting Back to Base Socket */}
                <line>
                  <bufferGeometry attach="geometry">
                    <bufferAttribute
                      attach="attributes-position"
                      args={[new Float32Array([0, 0, 0, ox, oy, oz]), 3]}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial attach="material" color="#00E5FF" transparent opacity={0.65} />
                </line>
              </group>
            )}

            {/* ================================================================= */}
            {/* 1. CORE SATELLITE BUS & PRIMARY STRUCTURES (Octagonal & Trusses)  */}
            {/* ================================================================= */}
            {(comp.defId === 'f-core-hull' || comp.defId === 'm-cargo-module') && (
              <group rotation={[Math.PI * 0.5, 0, 0]}>
                {/* Octagonal Heavy Titanium Main Bus */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1.5, 1.5, 5.8, 8]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>

                {/* 8 Titanium Corner Longerons (Structural Edge Stiffeners) */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  const r = 1.49;
                  return (
                    <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} rotation={[0, -angle, 0]} castShadow>
                      <boxGeometry args={[0.07, 5.82, 0.07]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                  );
                })}

                {/* Upper and Lower Payload Adapter Rings with Perimeter Bolt Studs */}
                {[-2.6, 2.6].map((y, idx) => (
                  <group key={idx} position={[0, y, 0]}>
                    <mesh castShadow>
                      <torusGeometry args={[1.52, 0.065, 12, 32]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, y > 0 ? 0.1 : -0.1, 0]}>
                      <cylinderGeometry args={[1.55, 1.55, 0.08, 16]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                  </group>
                ))}

                {/* Crinkled Gold Kapton MLI Thermal Blanket Band (Midsection) */}
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[1.525, 1.525, 2.2, 8]} />
                  <primitive object={goldKaptonMaterial} attach="material" />
                </mesh>

                {/* Recessed Isogrid Telemetry Panels (4 Faces) */}
                {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
                  <group key={i} rotation={[0, angle, 0]} position={[0, 0, 1.48]}>
                    <mesh>
                      <boxGeometry args={[0.88, 1.25, 0.03]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                    {/* Access Hatch Handle & Fasteners */}
                    <mesh position={[0, 0, 0.02]}>
                      <boxGeometry args={[0.2, 0.04, 0.02]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                  </group>
                ))}

                {/* Dual External Avionics Wiring Raceways running along hull */}
                {[-0.14, 0.14].map((x, i) => (
                  <mesh key={i} position={[x, 0, 1.53]}>
                    <cylinderGeometry args={[0.03, 0.03, 5.6, 8]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>
                ))}

                {/* Thermal Radiator Heat Rejection Louvers (Port & Starboard) */}
                {[-1.2, 1.2].map((xSide, sIdx) => (
                  <group key={sIdx} position={[xSide, 0, 0]}>
                    {[-0.8, -0.4, 0, 0.4, 0.8].map((y, lIdx) => (
                      <mesh key={lIdx} position={[0, y, 0]} rotation={[0, 0, 0.35]}>
                        <boxGeometry args={[0.05, 0.08, 0.85]} />
                        <primitive object={silverMetalMaterial} attach="material" />
                      </mesh>
                    ))}
                  </group>
                ))}
              </group>
            )}

            {comp.defId === 'f-structural-truss' && (
              <group>
                {/* 4 Carbon-Composite Corner Keel Booms */}
                {[
                  [-0.85, 0.65],
                  [0.85, 0.65],
                  [-0.85, -0.65],
                  [0.85, -0.65],
                ].map(([x, y], i) => (
                  <mesh key={i} position={[x, y, 0]} castShadow>
                    <boxGeometry args={[0.1, 0.1, 5.4]} />
                    <primitive object={carbonCompositeMaterial} attach="material" />
                  </mesh>
                ))}

                {/* Triangular Diagonal Lattice Cross-Braces */}
                {[-2.0, -1.0, 0, 1.0, 2.0].map((z, idx) => (
                  <group key={idx} position={[0, 0, z]}>
                    <mesh>
                      <torusGeometry args={[1.0, 0.045, 8, 4]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                    {/* Internal Honeycomb Perforated Equipment Deck */}
                    <mesh rotation={[Math.PI * 0.5, 0, 0]}>
                      <cylinderGeometry args={[0.85, 0.85, 0.04, 8]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                  </group>
                ))}

                {/* Central Pressurized Cryogenic Propellant Conduit */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
                  <cylinderGeometry args={[0.18, 0.18, 5.2, 16]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>
              </group>
            )}

            {/* ================================================================= */}
            {/* 2. FORWARD SCIENCE DECK & OPTICAL SUNSHADE                        */}
            {/* ================================================================= */}
            {(comp.defId === 'f-nose-fairing' || comp.defId === 'c-explorer-cockpit' || comp.defId === 'c-command-pod') && (
              <group rotation={[Math.PI * 0.5, 0, 0]}>
                {/* Truncated Aerodynamic Composite Instrument Housing / Sunshade */}
                <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
                  <cylinderGeometry args={[0.95, 1.45, 2.6, 8]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>

                {/* Gold Kapton MLI Wrap around Lower Forward Bulkhead */}
                <mesh position={[0, -0.2, 0]}>
                  <cylinderGeometry args={[1.47, 1.5, 0.8, 8]} />
                  <primitive object={goldKaptonMaterial} attach="material" />
                </mesh>

                {/* Recessed Main Science Optical Camera Aperture */}
                <group position={[0, 1.9, 0.35]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.32, 0.38, 0.5, 24]} />
                    <primitive object={darkTrimMaterial} attach="material" />
                  </mesh>
                  {/* Gold Retaining Bezel Ring */}
                  <mesh position={[0, 0.26, 0]}>
                    <torusGeometry args={[0.33, 0.035, 12, 24]} />
                    <primitive object={goldKaptonMaterial} attach="material" />
                  </mesh>
                  {/* Coated Quartz Objective Lens */}
                  <mesh position={[0, 0.22, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
                    <primitive object={opticalLensMaterial} attach="material" />
                  </mesh>
                </group>

                {/* Forward Observation Cockpit Visor / Multi-Pane Canopy */}
                <mesh position={[0, 0.9, 0.85]} rotation={[-0.38, 0, 0]}>
                  <boxGeometry args={[0.78, 1.1, 0.35]} />
                  <primitive object={canopyGlassMaterial} attach="material" />
                </mesh>
                {/* Structural Mullion Window Frame */}
                <mesh position={[0, 0.9, 0.95]} rotation={[-0.38, 0, 0]}>
                  <boxGeometry args={[0.82, 0.08, 0.38]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>

                {/* Forward Aerodynamic Telemetry Pitot Probe */}
                <group position={[0, 2.3, 0]}>
                  <mesh>
                    <cylinderGeometry args={[0.02, 0.035, 0.7, 12]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0, 0.35, 0]}>
                    <coneGeometry args={[0.04, 0.12, 12]} />
                    <primitive object={accentMaterial} attach="material" />
                  </mesh>
                </group>
              </group>
            )}

            {/* ================================================================= */}
            {/* 3. CASSEGRAIN HIGH-GAIN DEEP SPACE ANTENNA DISH (3.2m NASA DSN)   */}
            {/* ================================================================= */}
            {(comp.defId === 'a-parabolic-dish' || comp.defId === 'u-sensor-dish') && (
              <group position={[0, 0.4, 0]}>
                {/* Motorized 2-Axis Gimbal Pedestal Base */}
                <mesh castShadow position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.35, 0.45, 0.4, 16]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>
                {/* Elevation Hinge Yoke */}
                <mesh position={[0, 0.3, 0]}>
                  <boxGeometry args={[0.5, 0.25, 0.35]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>

                {/* Parabolic Reflector Assembly */}
                <group position={[0, 0.65, 0]} rotation={[-Math.PI * 0.4, 0, 0]}>
                  {/* Concave Parabolic Reflector Shell */}
                  <mesh castShadow receiveShadow>
                    <sphereGeometry args={[1.65, 36, 18, 0, Math.PI * 2, 0, 0.68]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>

                  {/* Rim Stiffener Ring */}
                  <mesh position={[0, 0, 0.65]}>
                    <torusGeometry args={[1.56, 0.035, 12, 36]} />
                    <primitive object={darkTrimMaterial} attach="material" />
                  </mesh>

                  {/* 8 Radial Carbon-Fiber Structural Backing Ribs on Convex Side */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * Math.PI) / 4;
                    return (
                      <group key={i} rotation={[0, 0, angle]}>
                        <mesh position={[0.75, 0, -0.15]} rotation={[0, 0.35, 0]}>
                          <boxGeometry args={[1.4, 0.04, 0.1]} />
                          <primitive object={carbonCompositeMaterial} attach="material" />
                        </mesh>
                      </group>
                    );
                  })}

                  {/* Quadripod Carbon-Fiber Sub-Reflector Struts */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const angle = (i * Math.PI) / 2 + Math.PI / 4;
                    const r = 1.35;
                    return (
                      <group key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.6]}>
                        <mesh rotation={[-0.45 * Math.sin(angle), 0.45 * Math.cos(angle), 0]}>
                          <cylinderGeometry args={[0.018, 0.018, 1.25, 8]} />
                          <primitive object={carbonCompositeMaterial} attach="material" />
                        </mesh>
                      </group>
                    );
                  })}

                  {/* Hyperbolic Secondary Sub-Reflector Apex & Feedhorn */}
                  <group position={[0, 0, 1.2]}>
                    <mesh castShadow>
                      <sphereGeometry args={[0.22, 16, 12, 0, Math.PI * 2, 0, 0.5]} />
                      <primitive object={goldKaptonMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, 0, -0.1]}>
                      <coneGeometry args={[0.08, 0.22, 16]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                  </group>
                </group>
              </group>
            )}

            {/* ================================================================= */}
            {/* 4. 5-PANEL DEPLOYABLE PHOTOVOLTAIC SOLAR WINGS (Europa Clipper)   */}
            {/* ================================================================= */}
            {(comp.defId === 's-dual-array' || comp.defId === 's-solar-panel') && (
              <group>
                {/* Port Wing (+X) and Starboard Wing (-X) */}
                {[-1, 1].map((sideSign, sideIdx) => (
                  <group key={sideIdx}>
                    {/* Solar Array Drive Mechanism (SADM) Gimbal Yoke */}
                    <mesh position={[sideSign * 1.6, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
                      <cylinderGeometry args={[0.16, 0.16, 0.35, 16]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                    <mesh position={[sideSign * 1.85, 0, 0]}>
                      <boxGeometry args={[0.25, 0.2, 0.3]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>

                    {/* 5 Distinct Articulating Solar Panels */}
                    {[0, 1, 2, 3, 4].map((panelIdx) => {
                      const panelWidth = 2.1;
                      const panelX = sideSign * (2.2 + panelIdx * 2.25 + panelWidth * 0.5);

                      return (
                        <group key={panelIdx} position={[panelX, 0, 0]}>
                          {/* Carbon-Composite Perimeter Panel Frame */}
                          <mesh castShadow receiveShadow>
                            <boxGeometry args={[panelWidth, 0.05, 2.2]} />
                            <primitive object={carbonCompositeMaterial} attach="material" />
                          </mesh>

                          {/* Silicon/GaAs Photovoltaic Wafer Matrix (Top & Bottom) */}
                          <mesh position={[0, 0.028, 0]}>
                            <boxGeometry args={[panelWidth * 0.96, 0.008, 2.12]} />
                            <primitive object={photovoltaicCellMaterial} attach="material" />
                          </mesh>

                          {/* Dual Silver Collector Busbars */}
                          {[-0.5, 0.5].map((bz, bIdx) => (
                            <mesh key={bIdx} position={[0, 0.034, bz]}>
                              <boxGeometry args={[panelWidth * 0.95, 0.006, 0.02]} />
                              <primitive object={silverMetalMaterial} attach="material" />
                            </mesh>
                          ))}

                          {/* Photovoltaic Cell Grid Divider Grooves (36 cells per panel) */}
                          {[-0.6, -0.2, 0.2, 0.6].map((gx, gIdx) => (
                            <mesh key={gIdx} position={[gx, 0.033, 0]}>
                              <boxGeometry args={[0.006, 0.005, 2.1]} />
                              <primitive object={darkTrimMaterial} attach="material" />
                            </mesh>
                          ))}

                          {/* Inter-Panel Scissor Hinge Knuckle Joint */}
                          {panelIdx < 4 && (
                            <group position={[sideSign * (panelWidth * 0.5 + 0.08), 0, 0]}>
                              <mesh rotation={[Math.PI * 0.5, 0, 0]}>
                                <cylinderGeometry args={[0.035, 0.035, 0.22, 12]} />
                                <primitive object={silverMetalMaterial} attach="material" />
                              </mesh>
                              {/* Torsion Deployment Spring */}
                              <mesh rotation={[0, 0, Math.PI * 0.5]}>
                                <torusGeometry args={[0.045, 0.015, 8, 16]} />
                                <primitive object={goldKaptonMaterial} attach="material" />
                              </mesh>
                            </group>
                          )}

                          {/* Outermost Wingtip Navigation Beacon Strobe */}
                          {panelIdx === 4 && (
                            <group position={[sideSign * (panelWidth * 0.5 + 0.06), 0, 0]}>
                              <mesh>
                                <boxGeometry args={[0.08, 0.08, 0.2]} />
                                <primitive object={darkTrimMaterial} attach="material" />
                              </mesh>
                              <mesh position={[sideSign * 0.05, 0, 0]}>
                                <sphereGeometry args={[0.04, 12, 12]} />
                                <meshBasicMaterial color={sideSign > 0 ? '#10B981' : '#EF4444'} />
                              </mesh>
                            </group>
                          )}
                        </group>
                      );
                    })}
                  </group>
                ))}
              </group>
            )}

            {/* ================================================================= */}
            {/* 5. AFT CONICAL TITANIUM THRUST STRUCTURE                          */}
            {/* ================================================================= */}
            {comp.defId === 'f-tail-adapter' && (
              <group rotation={[Math.PI * 0.5, 0, 0]}>
                {/* Truncated Titanium Thrust Cone */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1.2, 1.62, 2.4, 16]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>

                {/* 8 External Longitudinal Stiffener Stringers */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  return (
                    <group key={i} rotation={[0, angle, 0]} position={[0, 0, 1.41]}>
                      <mesh rotation={[0.17, 0, 0]} castShadow>
                        <boxGeometry args={[0.05, 2.4, 0.06]} />
                        <primitive object={darkTrimMaterial} attach="material" />
                      </mesh>
                    </group>
                  );
                })}

                {/* Engine Gimbal Bulkhead Ring with Mounting Lugs */}
                <mesh position={[0, -1.2, 0]}>
                  <cylinderGeometry args={[1.65, 1.65, 0.22, 24]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>
                <mesh position={[0, -1.2, 0]}>
                  <torusGeometry args={[1.66, 0.05, 8, 32]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>
              </group>
            )}

            {/* ================================================================= */}
            {/* 6. DUAL GIMBALED ROCKET PROPULSION ENGINES                        */}
            {/* ================================================================= */}
            {(comp.defId === 'e-fusion-engine' || comp.defId === 'e-raptor-bell') && (
              <group>
                {/* Twin Rocket Engine Cluster */}
                {[-0.65, 0.65].map((engineX, eIdx) => (
                  <group key={eIdx} position={[engineX, 0, 0]}>
                    {/* Spherical Injector Dome & Fuel Manifold */}
                    <mesh position={[0, 0, 0.4]} rotation={[Math.PI * 0.5, 0, 0]} castShadow>
                      <sphereGeometry args={[0.45, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                      <primitive object={engineInconelMaterial} attach="material" />
                    </mesh>

                    {/* Regeneratively Cooled Combustion Chamber with Copper Tube Fluting */}
                    <mesh position={[0, 0, 0.1]} rotation={[Math.PI * 0.5, 0, 0]} castShadow>
                      <cylinderGeometry args={[0.38, 0.38, 0.6, 24]} />
                      <primitive object={copperCoolingTubeMaterial} attach="material" />
                    </mesh>

                    {/* Narrow Sonic Throat Stiffener Collar */}
                    <mesh position={[0, 0, -0.22]} rotation={[Math.PI * 0.5, 0, 0]}>
                      <torusGeometry args={[0.26, 0.05, 12, 24]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>

                    {/* Fluted Bell Nozzle Expansion Skirt (Contoured de Laval Profile) */}
                    <mesh position={[0, 0, -1.1]} rotation={[Math.PI * 0.5, 0, 0]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.28, 0.78, 1.7, 32, 1, true]} />
                      <primitive object={engineInconelMaterial} attach="material" />
                    </mesh>

                    {/* Heat-Discolored Niobium Expansion Extension (Iridescent Bronze) */}
                    <mesh position={[0, 0, -1.75]} rotation={[Math.PI * 0.5, 0, 0]}>
                      <cylinderGeometry args={[0.78, 0.92, 0.5, 32, 1, true]} />
                      <primitive object={engineNiobiumSkirtMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, 0, -2.0]} rotation={[Math.PI * 0.5, 0, 0]}>
                      <torusGeometry args={[0.92, 0.035, 8, 32]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>

                    {/* Dual Hydraulic Gimbal Actuator Push-Rods */}
                    {[-0.32, 0.32].map((ax, aIdx) => (
                      <group key={aIdx} position={[ax, 0.28, -0.2]}>
                        <mesh rotation={[0.2, 0, 0]}>
                          <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
                          <primitive object={silverMetalMaterial} attach="material" />
                        </mesh>
                        {/* Actuator Piston Cylinder */}
                        <mesh position={[0, 0, 0.2]}>
                          <cylinderGeometry args={[0.045, 0.045, 0.35, 8]} />
                          <primitive object={darkTrimMaterial} attach="material" />
                        </mesh>
                      </group>
                    ))}

                    {/* Turbopump Housing & Hot-Gas Discharge Manifold */}
                    <mesh position={[0.35, -0.2, 0.2]} castShadow>
                      <sphereGeometry args={[0.18, 16, 16]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                  </group>
                ))}

                {/* Central High-Pressure Helium Pressurization COPV Sphere */}
                <mesh position={[0, 0, 0.5]} castShadow>
                  <sphereGeometry args={[0.32, 20, 20]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>

                {/* Animated Dynamic Hot-Fire Shock Diamond Plumes */}
                <HotFireExhaustPlume
                  engineType="e-fusion-engine"
                  isSimulating={isSimulating}
                  glowColor={livery.engineGlowColor}
                />
              </group>
            )}

            {/* ================================================================= */}
            {/* 7. NASA PSYCHE HALL-EFFECT ELECTRIC XENON THRUSTER                */}
            {/* ================================================================= */}
            {(comp.defId === 'e-hall-thruster' || comp.defId === 'e-ion-engine') && (
              <group rotation={[Math.PI * 0.5, 0, 0]}>
                {/* Machined Titanium Thruster Outer Housing */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.55, 0.55, 0.45, 24]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>

                {/* Annular Boron-Nitride Ceramic Discharge Channel */}
                <mesh position={[0, -0.2, 0]}>
                  <torusGeometry args={[0.32, 0.08, 16, 32]} />
                  <meshStandardMaterial color="#E2E8F0" roughness={0.7} metalness={0.1} />
                </mesh>

                {/* Central Magnetic Core Pole Piece */}
                <mesh position={[0, -0.2, 0]}>
                  <cylinderGeometry args={[0.18, 0.18, 0.15, 20]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>

                {/* Articulated Hollow Cathode Neutralizer on Titanium Bracket */}
                <group position={[0.42, -0.15, 0]} rotation={[0, 0, -0.25]}>
                  <mesh>
                    <cylinderGeometry args={[0.04, 0.04, 0.32, 12]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>
                  {/* Xenon Gas Supply Tube */}
                  <mesh position={[-0.08, 0.12, 0]}>
                    <torusGeometry args={[0.06, 0.012, 8, 16]} />
                    <primitive object={goldKaptonMaterial} attach="material" />
                  </mesh>
                </group>

                {/* Glowing Cyan Ion Plasma Beam Channel */}
                <mesh position={[0, -0.25, 0]}>
                  <ringGeometry args={[0.24, 0.4, 32]} />
                  <meshBasicMaterial
                    color="#00E5FF"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={isSimulating ? 1.0 : 0.65}
                  />
                </mesh>

                <HotFireExhaustPlume
                  engineType="e-hall-thruster"
                  isSimulating={isSimulating}
                  glowColor={livery.engineGlowColor}
                />
              </group>
            )}

            {/* ================================================================= */}
            {/* 8. 5-METER DEPLOYABLE MAGNETOMETER LATTICE BOOM                   */}
            {/* ================================================================= */}
            {(comp.defId === 'si-magnetometer' || comp.defId === 'd-sensor-boom') && (
              <group>
                {/* Root Deployment Canister & Spring-Loaded Hinge */}
                <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
                  <cylinderGeometry args={[0.16, 0.18, 0.4, 16]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>

                {/* 3 Triangular Carbon Longerons extending 4.8 meters */}
                {[
                  [0, 0.08],
                  [-0.07, -0.06],
                  [0.07, -0.06],
                ].map(([y, z], rodIdx) => (
                  <mesh key={rodIdx} position={[2.4, y, z]} rotation={[0, 0, Math.PI * 0.5]}>
                    <cylinderGeometry args={[0.012, 0.012, 4.8, 8]} />
                    <primitive object={carbonCompositeMaterial} attach="material" />
                  </mesh>
                ))}

                {/* Triangular Ring Bulkhead Spacers every 0.6m */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const x = 0.6 * (i + 1);
                  return (
                    <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
                      <torusGeometry args={[0.09, 0.012, 6, 3]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                  );
                })}

                {/* Mid-Span Fluxgate Sensor Pod (Wrapped in Gold MLI) */}
                <group position={[2.4, 0, 0]}>
                  <mesh>
                    <cylinderGeometry args={[0.09, 0.09, 0.28, 16]} />
                    <primitive object={goldKaptonMaterial} attach="material" />
                  </mesh>
                </group>

                {/* Tip High-Precision Dual-Axis Magnetometer Sensor Head & Sunshade */}
                <group position={[4.85, 0, 0]}>
                  <mesh castShadow>
                    <sphereGeometry args={[0.14, 16, 16]} />
                    <primitive object={goldKaptonMaterial} attach="material" />
                  </mesh>
                  <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI * 0.5]}>
                    <coneGeometry args={[0.16, 0.28, 16]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>
                </group>
              </group>
            )}

            {/* ================================================================= */}
            {/* 9. 5-DOF ARTICULATED ROBOTIC SAMPLING ARM (Perseverance / JPL)    */}
            {/* ================================================================= */}
            {comp.defId === 'si-robotic-arm' && (
              <group>
                {/* Shoulder Azimuth Turret & Pitch Yoke */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.2, 0.24, 0.22, 16]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>
                <mesh position={[0, 0.16, 0]}>
                  <boxGeometry args={[0.25, 0.18, 0.22]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>

                {/* Upper Arm Structural Carbon Tube */}
                <group position={[0.4, 0.45, 0.3]} rotation={[0.4, 0.3, -0.6]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.08, 0.09, 1.35, 12]} />
                    <primitive object={carbonCompositeMaterial} attach="material" />
                  </mesh>

                  {/* Elbow Planetary Gearbox Actuator */}
                  <group position={[0, 0.72, 0]} rotation={[-0.7, 0, 0.4]}>
                    <mesh rotation={[Math.PI * 0.5, 0, 0]}>
                      <cylinderGeometry args={[0.11, 0.11, 0.2, 16]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>

                    {/* Forearm Titanium Tube */}
                    <mesh position={[0, 0.6, 0]} castShadow>
                      <cylinderGeometry args={[0.065, 0.075, 1.15, 12]} />
                      <primitive object={primaryMaterial} attach="material" />
                    </mesh>

                    {/* 3-Axis Wrist Assembly */}
                    <group position={[0, 1.2, 0]}>
                      <mesh>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <primitive object={darkTrimMaterial} attach="material" />
                      </mesh>

                      {/* End-Effector Tool Turret (Coring Drill & Sample Chuck) */}
                      <group position={[0, 0.18, 0]}>
                        <mesh castShadow>
                          <boxGeometry args={[0.24, 0.26, 0.24]} />
                          <primitive object={silverMetalMaterial} attach="material" />
                        </mesh>
                        {/* Rotary Coring Drill Bit */}
                        <mesh position={[0, 0.2, 0]}>
                          <cylinderGeometry args={[0.03, 0.03, 0.25, 12]} />
                          <primitive object={darkTrimMaterial} attach="material" />
                        </mesh>
                        {/* Sample Collection Tube Carousel */}
                        <mesh position={[0.1, 0.05, 0]}>
                          <cylinderGeometry args={[0.045, 0.045, 0.15, 12]} />
                          <primitive object={goldKaptonMaterial} attach="material" />
                        </mesh>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            )}

            {/* ================================================================= */}
            {/* 10. MULTI-LAYER THERMAL INSULATION (Gold Kapton MLI Blanket)      */}
            {/* ================================================================= */}
            {comp.defId === 'th-mli-blanket' && (
              <group>
                {/* Crinkled Multi-Faceted Gold Foil Blanket */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[3.2, 0.08, 4.4]} />
                  <primitive object={goldKaptonMaterial} attach="material" />
                </mesh>
                {/* Black Border Velcro/Grounding Seams */}
                {[-1.58, 1.58].map((x, i) => (
                  <mesh key={i} position={[x, 0.042, 0]}>
                    <boxGeometry args={[0.06, 0.02, 4.4]} />
                    <primitive object={darkTrimMaterial} attach="material" />
                  </mesh>
                ))}
              </group>
            )}

            {/* ================================================================= */}
            {/* 11. 4-AXIS ATTITUDE CONTROL RCS THRUSTER PODS                     */}
            {/* ================================================================= */}
            {(comp.defId === 't-rcs-quad' || comp.defId === 'e-thruster-quad') && (
              <group>
                {/* CNC Machined Titanium Base Block */}
                <mesh castShadow>
                  <boxGeometry args={[0.34, 0.34, 0.34]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>

                {/* 4 Orthogonal Miniature de Laval Thruster Nozzles (+X, -X, +Y, +Z) */}
                {[
                  [0.2, 0, 0, 0, 0, -Math.PI * 0.5],
                  [-0.2, 0, 0, 0, 0, Math.PI * 0.5],
                  [0, 0.2, 0, 0, 0, 0],
                  [0, 0, 0.2, Math.PI * 0.5, 0, 0],
                ].map(([x, y, z, rx, ry, rz], i) => (
                  <group key={i} position={[x, y, z]} rotation={[rx, ry, rz]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.07, 0.035, 0.16, 12, 1, true]} />
                      <primitive object={engineInconelMaterial} attach="material" />
                    </mesh>
                    <mesh position={[0, -0.1, 0]}>
                      <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
                      <primitive object={silverMetalMaterial} attach="material" />
                    </mesh>
                  </group>
                ))}

                {/* Thermal Standoff Bracket */}
                <mesh position={[0, -0.22, 0]}>
                  <boxGeometry args={[0.25, 0.08, 0.25]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>
              </group>
            )}

            {/* ================================================================= */}
            {/* 12. RADIOISOTOPE THERMOELECTRIC GENERATOR (MMRTG)                 */}
            {/* ================================================================= */}
            {comp.defId === 'p-mmrtg-unit' && (
              <group rotation={[Math.PI * 0.5, 0, 0]}>
                {/* Cylindrical Central Pu-238 Heat Containment Canister */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.26, 0.26, 1.25, 20]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>
                <mesh position={[0, 0.64, 0]}>
                  <sphereGeometry args={[0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>

                {/* 8 Radial Heat Dissipation Cooling Fins in Star Pattern */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  return (
                    <group key={i} rotation={[0, angle, 0]}>
                      <mesh position={[0.42, 0, 0]} castShadow>
                        <boxGeometry args={[0.34, 1.15, 0.02]} />
                        <primitive object={silverMetalMaterial} attach="material" />
                      </mesh>
                    </group>
                  );
                })}

                {/* Mounting Standoff Truss */}
                <mesh position={[0, -0.68, 0]}>
                  <cylinderGeometry args={[0.15, 0.28, 0.2, 12]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>
              </group>
            )}

            {/* ================================================================= */}
            {/* 13. DUAL AUTONOMOUS CELESTIAL STAR TRACKER                        */}
            {/* ================================================================= */}
            {comp.defId === 'n-star-tracker' && (
              <group>
                {/* Machined Aluminum Electronics Housing with Heat Sink Fins */}
                <mesh castShadow>
                  <boxGeometry args={[0.4, 0.28, 0.36]} />
                  <primitive object={silverMetalMaterial} attach="material" />
                </mesh>

                {/* Dual Optical Conical Light Baffles (Angled 30 Degrees Apart) */}
                {[-0.12, 0.12].map((bx, idx) => (
                  <group key={idx} position={[bx, 0.2, 0]} rotation={[-0.25, idx > 0 ? 0.2 : -0.2, 0]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.075, 0.055, 0.32, 16, 1, true]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                    {/* Interior Knife-Edge Light Stop Rings */}
                    <mesh position={[0, 0.05, 0]}>
                      <torusGeometry args={[0.065, 0.008, 6, 16]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                    {/* Coated Objective Lens */}
                    <mesh position={[0, -0.12, 0]}>
                      <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
                      <primitive object={opticalLensMaterial} attach="material" />
                    </mesh>
                  </group>
                ))}
              </group>
            )}

            {/* ================================================================= */}
            {/* 14. AERODYNAMIC WINGS & FLIGHT CONTROL SURFACES                  */}
            {/* ================================================================= */}
            {(comp.defId === 'w-wing-advanced' || comp.defId === 'w-wing-delta' || comp.defId === 'w-wing-standard') && (
              <group>
                {/* Main Composite Airfoil Wing Body */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[comp.width || 6.8, 0.1, comp.length || 4.2]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>

                {/* Beveled Leading Edge Slat Armor */}
                <mesh position={[0, 0, (comp.length || 4.2) * 0.48]}>
                  <boxGeometry args={[(comp.width || 6.8) * 1.01, 0.12, 0.2]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>

                {/* Trailing Edge Flight Flaperons with Actuator Fairings */}
                <mesh position={[0, 0, -(comp.length || 4.2) * 0.46]}>
                  <boxGeometry args={[(comp.width || 6.8) * 0.95, 0.06, 0.24]} />
                  <primitive object={accentMaterial} attach="material" />
                </mesh>

                {/* Wingtip Vertical Winglet / Nav Light */}
                {[-1, 1].map((sign, i) => (
                  <group key={i} position={[sign * (comp.width || 6.8) * 0.49, 0.35, -(comp.length || 4.2) * 0.15]}>
                    <mesh rotation={[0, 0, sign * 0.25]}>
                      <boxGeometry args={[0.08, 0.8, 1.4]} />
                      <primitive object={darkTrimMaterial} attach="material" />
                    </mesh>
                    <mesh position={[sign * 0.08, 0.42, 0]}>
                      <sphereGeometry args={[0.06, 12, 12]} />
                      <meshBasicMaterial color={sign > 0 ? '#10B981' : '#EF4444'} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}

            {/* ================================================================= */}
            {/* 15. CRYOGENIC FUEL CELL & PROPELLANT TANKS                       */}
            {/* ================================================================= */}
            {(comp.defId === 'm-fuel-tank' || comp.defId === 'ft-cryo-methane') && (
              <group rotation={[Math.PI * 0.5, 0, 0]}>
                {/* Domed Cylindrical Cryogenic Tank with Al-Li Outer Shell */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1.3, 1.3, 4.4, 24]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>
                {/* Domed End Caps */}
                {[2.2, -2.2].map((y, i) => (
                  <mesh key={i} position={[0, y, 0]} rotation={[i === 1 ? Math.PI : 0, 0, 0]}>
                    <sphereGeometry args={[1.3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>
                ))}
                {/* External Titanium Anti-Slosh Reinforcement Rings */}
                {[-1.4, 0, 1.4].map((y, i) => (
                  <mesh key={i} position={[0, y, 0]}>
                    <torusGeometry args={[1.32, 0.045, 8, 32]} />
                    <primitive object={darkTrimMaterial} attach="material" />
                  </mesh>
                ))}
                {/* Insulated Propellant Feed Line running down tank */}
                <mesh position={[1.34, 0, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 4.6, 12]} />
                  <primitive object={goldKaptonMaterial} attach="material" />
                </mesh>
              </group>
            )}

            {/* Xenon High-Pressure COPV Sphere */}
            {comp.defId === 'ft-xenon-sphere' && (
              <group>
                <mesh castShadow>
                  <sphereGeometry args={[0.9, 24, 24]} />
                  <primitive object={carbonCompositeMaterial} attach="material" />
                </mesh>
                {/* Titanium Polar Boss Fitting & Pressure Relief Valve */}
                {[0.9, -0.9].map((y, i) => (
                  <mesh key={i} position={[0, y, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                    <primitive object={silverMetalMaterial} attach="material" />
                  </mesh>
                ))}
              </group>
            )}

            {/* Generic Fallback for Other System Items */}
            {!['f-core-hull', 'm-cargo-module', 'f-structural-truss', 'f-nose-fairing', 'c-explorer-cockpit', 'c-command-pod', 'a-parabolic-dish', 'u-sensor-dish', 's-dual-array', 's-solar-panel', 'f-tail-adapter', 'e-fusion-engine', 'e-raptor-bell', 'e-hall-thruster', 'e-ion-engine', 'si-magnetometer', 'd-sensor-boom', 'si-robotic-arm', 'th-mli-blanket', 't-rcs-quad', 'e-thruster-quad', 'p-mmrtg-unit', 'n-star-tracker', 'w-wing-advanced', 'w-wing-delta', 'w-wing-standard', 'm-fuel-tank', 'ft-cryo-methane', 'ft-xenon-sphere'].includes(comp.defId) && (
              <group>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[comp.width || 1.8, comp.height || 1.4, comp.length || 2.2]} />
                  <primitive object={primaryMaterial} attach="material" />
                </mesh>
                <mesh position={[0, (comp.height || 1.4) * 0.52, 0]}>
                  <boxGeometry args={[(comp.width || 1.8) * 0.9, 0.04, (comp.length || 2.2) * 0.9]} />
                  <primitive object={darkTrimMaterial} attach="material" />
                </mesh>
              </group>
            )}
          </group>
        );

        if (isSelected && transformMode !== 'select') {
          return (
            <TransformControls
              key={comp.instanceId}
              mode={transformMode}
              size={0.75}
              onMouseUp={(e: any) => {
                if (e && e.target && e.target.object) {
                  const obj = e.target.object;
                  onTransformChange(
                    comp.instanceId,
                    [
                      parseFloat(obj.position.x.toFixed(2)),
                      parseFloat(obj.position.y.toFixed(2)),
                      parseFloat(obj.position.z.toFixed(2)),
                    ],
                    [
                      parseFloat(obj.rotation.x.toFixed(2)),
                      parseFloat(obj.rotation.y.toFixed(2)),
                      parseFloat(obj.rotation.z.toFixed(2)),
                    ],
                    [
                      parseFloat(obj.scale.x.toFixed(2)),
                      parseFloat(obj.scale.y.toFixed(2)),
                      parseFloat(obj.scale.z.toFixed(2)),
                    ]
                  );
                }
              }}
            >
              {partContent}
            </TransformControls>
          );
        }

        return partContent;
      })}

      {/* 3D Visualizer Overlays (CoM, CoT, CAD Calipers) */}
      {showCenterOfMass && <CenterOfMassVisualizer comPosition={centerOfMass} />}
      {showCenterOfThrust && centerOfThrust.totalThrust > 0 && (
        <CenterOfThrustVisualizer cotPosition={centerOfThrust.pos} />
      )}
      {showMeasurementCalipers && (
        <MeasurementCalipersVisualizer
          minX={boundingLimits.minX}
          maxX={boundingLimits.maxX}
          minY={boundingLimits.minY}
          maxY={boundingLimits.maxY}
          minZ={boundingLimits.minZ}
          maxZ={boundingLimits.maxZ}
        />
      )}
    </group>
  );
};

import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { getTerrainHeight } from './MarsTerrain';

export const ResourceNodes: React.FC = () => {
  const resourceNodes = useMarsGameStore((state) => state.resourceNodes);
  const visorScanActive = useMarsGameStore((state) => state.settings.visorScanActive);
  const targeted = useMarsGameStore((state) => state.targetedInteractable);

  return (
    <group name="ResourceNodesGroup">
      {resourceNodes.map((node) => {
        if (node.depleted) return null;

        const y = getTerrainHeight(node.position[0], node.position[2]);
        const isTargeted = targeted?.id === node.id;

        return (
          <group key={node.id} position={[node.position[0], y, node.position[2]]}>
            {/* 1. Water Ice Outcrop */}
            {node.type === 'water_ice' && (
              <group position={[0, 0.4, 0]}>
                <mesh castShadow receiveShadow>
                  <octahedronGeometry args={[0.9, 0]} />
                  <meshStandardMaterial
                    color="#38BDF8"
                    roughness={0.1}
                    metalness={0.3}
                    transparent
                    opacity={0.88}
                  />
                </mesh>
                <pointLight color="#38BDF8" intensity={0.4} distance={3} />
              </group>
            )}

            {/* 2. Iron-Rich Hematite Spherules */}
            {node.type === 'hematite' && (
              <group position={[0, 0.25, 0]}>
                {[-0.35, 0.05, 0.38].map((offset, i) => (
                  <mesh key={i} position={[offset, (i % 2) * 0.15, (i % 3) * 0.2]} castShadow receiveShadow>
                    <sphereGeometry args={[0.35 - i * 0.05, 12, 12]} />
                    <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
                  </mesh>
                ))}
              </group>
            )}

            {/* 3. Hydrated Sulfur Minerals */}
            {node.type === 'sulfur_mineral' && (
              <group position={[0, 0.35, 0]} rotation={[0.2, 0.4, 0.1]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.5, 0.9, 0.4]} />
                  <meshStandardMaterial
                    color="#10B981"
                    roughness={0.2}
                    metalness={0.2}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                <pointLight color="#10B981" intensity={0.35} distance={3} />
              </group>
            )}

            {/* 4. Clay Regolith Outcrop */}
            {node.type === 'regolith' && (
              <group position={[0, 0.2, 0]}>
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[0.8, 1.2, 0.4, 8]} />
                  <meshStandardMaterial color="#B45309" roughness={0.9} metalness={0.1} />
                </mesh>
              </group>
            )}

            {/* 5. Silicate Quartz Core */}
            {node.type === 'silicate_crystal' && (
              <group position={[0, 0.4, 0]}>
                <mesh castShadow receiveShadow>
                  <coneGeometry args={[0.4, 1.2, 6]} />
                  <meshStandardMaterial
                    color="#FEF08A"
                    roughness={0.2}
                    metalness={0.1}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </group>
            )}

            {/* 6. Aerospace Titanium Debris */}
            {node.type === 'titanium_scrap' && (
              <group position={[0, 0.5, 0]} rotation={[0.4, 0.6, -0.3]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.4, 0.08, 0.9]} />
                  <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.2} />
                </mesh>
                <mesh position={[0.2, 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
                  <meshStandardMaterial color="#F59E0B" metalness={0.8} />
                </mesh>
              </group>
            )}

            {/* 7. Structural Scrap Metal (Salvaged Framing & Hull Truss) */}
            {node.type === 'scrap_metal' && (
              <group position={[0, 0.35, 0]} rotation={[0.15, 0.5, -0.2]}>
                {/* Main curved corrugated hull plate */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.2, 0.06, 0.8]} />
                  <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.35} />
                </mesh>
                {/* Cross-brace structural I-beam */}
                <mesh position={[0.1, 0.15, 0]} rotation={[0, 0.4, 0]} castShadow>
                  <boxGeometry args={[1.4, 0.12, 0.12]} />
                  <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.25} />
                </mesh>
                {/* Riveted corner angle bracket */}
                <mesh position={[-0.4, 0.1, 0.25]} castShadow>
                  <boxGeometry args={[0.2, 0.2, 0.3]} />
                  <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.4} />
                </mesh>
              </group>
            )}

            {/* 8. Electronic Components (Avionics Circuit Deck with LEDs) */}
            {node.type === 'electronic_parts' && (
              <group position={[0, 0.3, 0]}>
                {/* Hardened enclosure casing */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.7, 0.22, 0.5]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Gold-plated bus connectors and heatsink fins */}
                <mesh position={[0, 0.14, 0]}>
                  <boxGeometry args={[0.5, 0.05, 0.38]} />
                  <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.1} />
                </mesh>
                {/* Cyan active logic LED */}
                <mesh position={[-0.2, 0.15, 0.15]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial color="#06B6D4" />
                </mesh>
                {/* Amber sensor status LED */}
                <mesh position={[0.2, 0.15, 0.15]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial color="#F59E0B" />
                </mesh>
                <pointLight position={[0, 0.2, 0]} color="#06B6D4" intensity={0.4} distance={2.5} />
              </group>
            )}

            {/* 9. Damaged Battery Cell (Lithium-Sulfur Module) */}
            {node.type === 'damaged_battery' && (
              <group position={[0, 0.3, 0]} rotation={[0, 0.3, Math.PI / 10]}>
                {/* Heavy cylindrical battery cell */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[0.28, 0.28, 0.75, 16]} />
                  <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
                </mesh>
                {/* Hazard yellow warning band */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.285, 0.285, 0.2, 16]} />
                  <meshStandardMaterial color="#EAB308" metalness={0.2} roughness={0.5} />
                </mesh>
                {/* Anode/Cathode terminal caps */}
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
                  <meshStandardMaterial color="#EA580C" metalness={0.9} roughness={0.2} />
                </mesh>
                <pointLight position={[0, 0.45, 0]} color="#EAB308" intensity={0.25} distance={2} />
              </group>
            )}

            {/* 10. Mechanical Parts (Actuator Gear & Hydraulic Linkage) */}
            {node.type === 'mechanical_parts' && (
              <group position={[0, 0.3, 0]} rotation={[0.4, 0.2, 0]}>
                {/* Large planetary spur gear */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[0.35, 0.35, 0.12, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.2} />
                </mesh>
                {/* Center hub spline */}
                <mesh position={[0, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[0.14, 0.14, 0.18, 12]} />
                  <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
                </mesh>
                {/* Telescoping piston shaft */}
                <mesh position={[0.25, 0, 0.1]} rotation={[0, 0, Math.PI / 3]} castShadow>
                  <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
                  <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
                </mesh>
              </group>
            )}

            {/* 11. Scientific Astrobiology Core Sample */}
            {node.type === 'scientific_sample' && (
              <group position={[0, 0.35, 0]}>
                {/* Cylindrical quartz core sleeve */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[0.18, 0.18, 0.65, 16]} />
                  <meshStandardMaterial
                    color="#10B981"
                    metalness={0.3}
                    roughness={0.1}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                {/* Titanium sampling end-caps */}
                <mesh position={[0, 0.34, 0]}>
                  <cylinderGeometry args={[0.19, 0.19, 0.06, 16]} />
                  <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.34, 0]}>
                  <cylinderGeometry args={[0.19, 0.19, 0.06, 16]} />
                  <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
                </mesh>
                <pointLight position={[0, 0.1, 0]} color="#10B981" intensity={0.5} distance={3} />
              </group>
            )}

            {/* Targeted Reticle Highlight when aimed at */}
            {isTargeted && (
              <group position={[0, 1.2, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.9, 1.05, 32]} />
                  <meshBasicMaterial color="#FBBF24" transparent opacity={0.85} />
                </mesh>
                <pointLight color="#FBBF24" intensity={0.6} distance={4} />
              </group>
            )}

            {/* Visor Scanner Active Marker */}
            {visorScanActive && !isTargeted && (
              <group position={[0, 1.4, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.7, 0.85, 24]} />
                  <meshBasicMaterial
                    color={
                      node.type === 'scrap_metal'
                        ? '#F59E0B'
                        : node.type === 'electronic_parts'
                        ? '#06B6D4'
                        : node.type === 'damaged_battery'
                        ? '#EAB308'
                        : node.type === 'mechanical_parts'
                        ? '#A855F7'
                        : node.type === 'scientific_sample'
                        ? '#10B981'
                        : node.type === 'water_ice'
                        ? '#38BDF8'
                        : node.type === 'hematite'
                          ? '#F97316'
                          : node.type === 'sulfur_mineral'
                            ? '#10B981'
                            : '#FEF08A'
                    }
                    transparent
                    opacity={0.65}
                  />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

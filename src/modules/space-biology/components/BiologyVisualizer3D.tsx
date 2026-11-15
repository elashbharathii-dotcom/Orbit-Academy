import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { BioModelId } from '../types';
import { BIO_STRUCTURES } from '../biologyData';

interface BiologyVisualizer3DProps {
  selectedModelId: BioModelId;
  explodeFactor: number;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
  isRotating?: boolean;
}

/**
 * 1. Human Cell 3D Procedural Mesh
 */
const HumanCellMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const mito1Ref = useRef<THREE.Group>(null);
  const mito2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mito1Ref.current) {
      mito1Ref.current.rotation.y = t * 0.4;
    }
    if (mito2Ref.current) {
      mito2Ref.current.rotation.y = -t * 0.35;
    }
  });

  const ex = 1 + explode * 0.9;

  return (
    <group>
      {/* Translucent Outer Plasma Membrane */}
      <mesh onClick={(e) => { e.stopPropagation(); onSelect('nucleus'); }}>
        <sphereGeometry args={[2.5 * (1 + explode * 0.3), 32, 32]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transmission={0.85}
          opacity={0.35}
          transparent
          roughness={0.2}
          metalness={0.1}
          thickness={0.8}
        />
      </mesh>

      {/* Nucleus & Chromatin Core */}
      <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect('nucleus'); }}>
        <mesh>
          <sphereGeometry args={[1.1, 24, 24]} />
          <meshStandardMaterial
            color={selectedId === 'nucleus' ? '#A78BFA' : '#818CF8'}
            emissive="#818CF8"
            emissiveIntensity={selectedId === 'nucleus' ? 0.7 : 0.3}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        {/* Nuclear Pores / Chromatin Speckles */}
        <mesh scale={[1.02, 1.02, 1.02]}>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshBasicMaterial color="#C084FC" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Mitochondria Alpha */}
      <group
        ref={mito1Ref}
        position={[1.4 * ex, 0.8 * ex, 0.6 * ex]}
        onClick={(e) => { e.stopPropagation(); onSelect('mitochondria_1'); }}
      >
        <mesh>
          <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
          <meshStandardMaterial
            color={selectedId === 'mitochondria_1' ? '#FBBF24' : '#F59E0B'}
            emissive="#F59E0B"
            emissiveIntensity={selectedId === 'mitochondria_1' ? 0.8 : 0.4}
            roughness={0.3}
          />
        </mesh>
        {/* Internal Cristae Lines */}
        {[-0.2, 0, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI * 0.5]}>
            <torusGeometry args={[0.28, 0.04, 8, 16]} />
            <meshBasicMaterial color="#EA580C" />
          </mesh>
        ))}
      </group>

      {/* Mitochondria Beta */}
      <group
        ref={mito2Ref}
        position={[-1.2 * ex, -0.9 * ex, -0.4 * ex]}
        onClick={(e) => { e.stopPropagation(); onSelect('mitochondria_2'); }}
      >
        <mesh rotation={[0.4, 0.6, 0]}>
          <capsuleGeometry args={[0.26, 0.6, 8, 16]} />
          <meshStandardMaterial
            color={selectedId === 'mitochondria_2' ? '#FBBF24' : '#F59E0B'}
            emissive="#F59E0B"
            emissiveIntensity={selectedId === 'mitochondria_2' ? 0.8 : 0.4}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Endoplasmic Reticulum Ribbons */}
      <group
        position={[0.8 * ex, -0.6 * ex, 1.0 * ex]}
        onClick={(e) => { e.stopPropagation(); onSelect('er_network'); }}
      >
        {[-0.3, 0, 0.3].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[0.3, i * 0.5, 0]}>
            <torusGeometry args={[0.65 + i * 0.15, 0.08, 10, 24, Math.PI * 1.4]} />
            <meshStandardMaterial
              color={selectedId === 'er_network' ? '#00E5FF' : '#38BDF8'}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Actin Cytoskeleton Filaments */}
      <group
        position={[0, 1.8 * ex, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('cytoskeleton'); }}
      >
        {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, 0.2 * i]}>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
            <meshStandardMaterial
              color={selectedId === 'cytoskeleton' ? '#4ADE80' : '#34D399'}
              emissive="#34D399"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * 2. DNA Double Helix with Cosmic Ray Break
 */
const DnaHelixMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  const basePairCount = 20;
  const turns = 2.5;

  return (
    <group ref={groupRef}>
      {Array.from({ length: basePairCount }).map((_, i) => {
        const t = (i / (basePairCount - 1)) * Math.PI * 2 * turns;
        const y = (i - basePairCount / 2) * 0.32;
        const radius = 1.1 + explode * 0.6;
        const x1 = Math.cos(t) * radius;
        const z1 = Math.sin(t) * radius;
        const x2 = Math.cos(t + Math.PI) * radius;
        const z2 = Math.sin(t + Math.PI) * radius;

        // Simulate radiation damage at index 12
        const isDamaged = i === 12;

        return (
          <group key={i}>
            {/* Strand 1 Backbone Node */}
            <mesh
              position={[x1, y, z1]}
              onClick={(e) => { e.stopPropagation(); onSelect('sugar_phosphate'); }}
            >
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color={selectedId === 'sugar_phosphate' ? '#A78BFA' : '#818CF8'} />
            </mesh>

            {/* Strand 2 Backbone Node */}
            <mesh
              position={[x2, y, z2]}
              onClick={(e) => { e.stopPropagation(); onSelect('sugar_phosphate'); }}
            >
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color={selectedId === 'sugar_phosphate' ? '#A78BFA' : '#818CF8'} />
            </mesh>

            {/* Connecting Base Pair Rung */}
            {!isDamaged ? (
              <mesh
                position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
                rotation={[0, -t, Math.PI * 0.5]}
                onClick={(e) => { e.stopPropagation(); onSelect('base_pairs'); }}
              >
                <cylinderGeometry args={[0.04, 0.04, radius * 2, 8]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? '#00E5FF' : '#34D399'}
                  emissive={selectedId === 'base_pairs' ? '#00E5FF' : '#0284C7'}
                  emissiveIntensity={selectedId === 'base_pairs' ? 0.8 : 0.3}
                />
              </mesh>
            ) : (
              // Radiation Double-Strand Break Severed Ends
              <group
                position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
                onClick={(e) => { e.stopPropagation(); onSelect('dsb_break_zone'); }}
              >
                <mesh position={[-0.4, 0, 0]}>
                  <sphereGeometry args={[0.18, 12, 12]} />
                  <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.2} />
                </mesh>
                <mesh position={[0.4, 0, 0]}>
                  <sphereGeometry args={[0.18, 12, 12]} />
                  <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.2} />
                </mesh>
                <pointLight color="#EF4444" intensity={3} distance={5} />
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

/**
 * 3. RNA Structure Mesh
 */
const RnaMoleculeMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cloverleaf Hairpin Loop */}
      <group
        position={[0, 1.2 * (1 + explode), 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('hairpin_loop'); }}
      >
        <mesh>
          <torusGeometry args={[0.9, 0.08, 12, 32, Math.PI * 1.8]} />
          <meshStandardMaterial
            color={selectedId === 'hairpin_loop' ? '#4ADE80' : '#34D399'}
            emissive="#34D399"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Uracil Base Nodules */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.8, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
        ))}
      </group>

      {/* Stem Helix */}
      <group
        position={[0, -0.6 * (1 + explode), 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('acceptor_stem'); }}
      >
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 2.4, 12]} />
          <meshStandardMaterial
            color={selectedId === 'acceptor_stem' ? '#00E5FF' : '#38BDF8'}
            emissive="#00E5FF"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Terminal Acceptor CCA */}
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#F43F5E" />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 4. Protein Conformation & Microgravity Crystals
 */
const ProteinStructureMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const crystalRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      crystalRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.15;
    }
  });

  const ex = 1 + explode * 0.8;

  return (
    <group ref={crystalRef}>
      {/* Alpha-Helical Ribbon */}
      <group
        position={[-0.8 * ex, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('alpha_helix'); }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[0, (i - 4) * 0.32, 0]}
            rotation={[0, i * 0.8, 0]}
          >
            <torusGeometry args={[0.5, 0.08, 8, 16, Math.PI * 1.2]} />
            <meshStandardMaterial
              color={selectedId === 'alpha_helix' ? '#FBBF24' : '#F59E0B'}
              roughness={0.25}
              metalness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Beta-Sheet Planes */}
      <group
        position={[0.8 * ex, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('beta_sheet'); }}
      >
        {[-0.6, 0, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0.2, 0.3, 0.1]}>
            <boxGeometry args={[0.1, 2.2, 0.5]} />
            <meshStandardMaterial
              color={selectedId === 'beta_sheet' ? '#00E5FF' : '#38BDF8'}
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Microgravity High-Resolution Crystal Facet Shell */}
      <mesh>
        <octahedronGeometry args={[2.2 * ex, 0]} />
        <meshPhysicalMaterial
          color="#00E5FF"
          transmission={0.9}
          opacity={0.3}
          transparent
          roughness={0.05}
          metalness={0.9}
          wireframe
        />
      </mesh>
    </group>
  );
};

/**
 * 5. Plant Cell (Arabidopsis)
 */
const PlantCellMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const ex = 1 + explode * 0.8;

  return (
    <group>
      {/* Hexagonal Rigid Cellulose Cell Wall */}
      <mesh onClick={(e) => { e.stopPropagation(); onSelect('cell_wall'); }}>
        <cylinderGeometry args={[2.2 * ex, 2.2 * ex, 3.2 * ex, 6]} />
        <meshStandardMaterial
          color={selectedId === 'cell_wall' ? '#4ADE80' : '#10B981'}
          wireframe
          roughness={0.6}
        />
      </mesh>

      {/* Large Hydraulic Central Vacuole */}
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('vacuole'); }}
      >
        <cylinderGeometry args={[1.4, 1.4, 2.2, 16]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          transmission={0.8}
          opacity={0.5}
          transparent
          roughness={0.1}
        />
      </mesh>

      {/* Chloroplasts */}
      <group
        position={[1.1 * ex, 0.6 * ex, 0.4 * ex]}
        onClick={(e) => { e.stopPropagation(); onSelect('chloroplasts'); }}
      >
        {[
          [0, 0, 0],
          [-0.3, 0.6, 0.2],
          [0.3, -0.6, -0.2],
        ].map(([cx, cy, cz], i) => (
          <mesh key={i} position={[cx, cy, cz]} scale={[1, 0.5, 1]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial
              color={selectedId === 'chloroplasts' ? '#4ADE80' : '#22C55E'}
              emissive="#15803D"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Gravity-Sensing Amyloplast Statoliths (Settling Disrupted in uG) */}
      <group
        position={[0, -1.0 * ex, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('statoliths'); }}
      >
        {[-0.3, 0, 0.3].map((sx, i) => (
          <mesh key={i} position={[sx, Math.sin(i * 1.5) * 0.2, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial
              color={selectedId === 'statoliths' ? '#FDE047' : '#FBBF24'}
              emissive="#F59E0B"
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * 6. Microorganism (Bacillus & Biofilm)
 */
const MicroorganismMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const flagellaRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flagellaRef.current) {
      flagellaRef.current.rotation.z = Math.sin(t * 8) * 0.25;
    }
  });

  const ex = 1 + explode * 0.8;

  return (
    <group>
      {/* Bacterial Capsule Body */}
      <mesh
        rotation={[0, 0, Math.PI * 0.5]}
        onClick={(e) => { e.stopPropagation(); onSelect('bacterial_capsule'); }}
      >
        <capsuleGeometry args={[0.9 * ex, 2.4 * ex, 16, 24]} />
        <meshStandardMaterial
          color={selectedId === 'bacterial_capsule' ? '#C084FC' : '#A855F7'}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Biofilm Matrix Shield */}
      <mesh
        rotation={[0, 0, Math.PI * 0.5]}
        onClick={(e) => { e.stopPropagation(); onSelect('biofilm_matrix'); }}
      >
        <capsuleGeometry args={[1.3 * ex, 2.8 * ex, 12, 16]} />
        <meshPhysicalMaterial
          color="#EC4899"
          transmission={0.8}
          opacity={0.35}
          transparent
          wireframe
        />
      </mesh>

      {/* Undulating Motility Flagella */}
      <group
        ref={flagellaRef}
        position={[1.8 * ex, 0, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect('flagella'); }}
      >
        {[-0.2, 0.2].map((fy, i) => (
          <mesh key={i} position={[0, fy, 0]} rotation={[0, 0, Math.PI * 0.4]}>
            <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
            <meshStandardMaterial color="#F472B6" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * 7. Trabecular Bone Tissue (Osteoclast vs Osteoblast)
 */
const BoneTissueMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const ex = 1 + explode * 0.8;

  return (
    <group>
      {/* Mineralized Trabecular Struts (Porous Lattice) */}
      <group onClick={(e) => { e.stopPropagation(); onSelect('bone_strut'); }}>
        {[
          [-1.2, 0, 0],
          [1.2, 0, 0],
          [0, -1.2, 0],
          [0, 1.2, 0],
          [0, 0, -1.2],
          [0, 0, 1.2],
        ].map(([bx, by, bz], i) => (
          <mesh key={i} position={[bx * ex, by * ex, bz * ex]} rotation={[i * 0.4, i * 0.3, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 2.2, 12]} />
            <meshStandardMaterial
              color={selectedId === 'bone_strut' ? '#F8FAFC' : '#CBD5E1'}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Hyperactive Osteoclast (Bone Resorption) */}
      <group
        position={[1.0 * ex, 0.7 * ex, 0.4 * ex]}
        onClick={(e) => { e.stopPropagation(); onSelect('osteoclast'); }}
      >
        <mesh>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshStandardMaterial
            color={selectedId === 'osteoclast' ? '#F87171' : '#EF4444'}
            emissive="#DC2626"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Acid Resorption Pit */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.4, 0.3, 12, 1, true]} />
          <meshBasicMaterial color="#FCA5A5" wireframe />
        </mesh>
      </group>

      {/* Suppressed Osteoblast (Bone Building) */}
      <group
        position={[-1.0 * ex, -0.6 * ex, -0.3 * ex]}
        onClick={(e) => { e.stopPropagation(); onSelect('osteoblast'); }}
      >
        <mesh>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial
            color={selectedId === 'osteoblast' ? '#38BDF8' : '#0284C7'}
            emissive="#0284C7"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 8. Skeletal Muscle Sarcomere
 */
const MuscleSarcomereMesh: React.FC<{
  explode: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ explode, selectedId, onSelect }) => {
  const ex = 1 + explode * 0.8;

  return (
    <group>
      {/* Lateral Z-Discs */}
      <group onClick={(e) => { e.stopPropagation(); onSelect('z_disc'); }}>
        {[-1.8 * ex, 1.8 * ex].map((zx, i) => (
          <mesh key={i} position={[zx, 0, 0]}>
            <boxGeometry args={[0.1, 2.4, 2.4]} />
            <meshStandardMaterial
              color={selectedId === 'z_disc' ? '#818CF8' : '#6366F1'}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Myosin Thick Filaments (A-Band Central) */}
      <group onClick={(e) => { e.stopPropagation(); onSelect('myosin_thick'); }}>
        {[-0.5, 0, 0.5].map((my, i) => (
          <mesh key={i} position={[0, my * ex, 0]} rotation={[0, 0, Math.PI * 0.5]}>
            <cylinderGeometry args={[0.12, 0.12, 2.2, 12]} />
            <meshStandardMaterial
              color={selectedId === 'myosin_thick' ? '#FB7185' : '#F43F5E'}
              emissive="#BE123C"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Actin Thin Filaments (I-Band Interdigitating) */}
      <group onClick={(e) => { e.stopPropagation(); onSelect('actin_thin'); }}>
        {[-0.75, -0.25, 0.25, 0.75].map((ay, i) => (
          <mesh key={i} position={[0, ay * ex, 0.3 * ex]} rotation={[0, 0, Math.PI * 0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
            <meshStandardMaterial
              color={selectedId === 'actin_thin' ? '#38BDF8' : '#0284C7'}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export const BiologyVisualizer3D: React.FC<BiologyVisualizer3DProps> = ({
  selectedModelId,
  explodeFactor,
  selectedOrganelleId,
  onSelectOrganelle,
  isRotating = true,
}) => {
  const modelMeta = BIO_STRUCTURES.find((m) => m.id === selectedModelId) || BIO_STRUCTURES[0];

  return (
    <div className="relative w-full h-full min-h-[420px] bg-[#02050D] rounded-2xl overflow-hidden border border-white/10 select-none">
      {/* Model Scientific Metadata Badge (Top-Left) */}
      <div className="absolute top-3 left-3 z-10 p-2.5 rounded-xl border border-white/10 bg-[#070C1B]/85 backdrop-blur-xl shadow-xl max-w-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]">
            {modelMeta.modelType === 'dataset_derived' ? 'DATASET-DERIVED 3D' : 'CONCEPTUAL 3D MODEL'}
          </span>
          {modelMeta.nasaStudyRef && (
            <span className="font-mono text-[10px] font-bold text-[#F59E0B]">
              Ref: {modelMeta.nasaStudyRef}
            </span>
          )}
        </div>
        <h4 className="font-sans text-sm font-extrabold text-white leading-tight">
          {modelMeta.name}
        </h4>
        <p className="font-mono text-[10px] text-[#94A3B8] italic">
          {modelMeta.scientificName} • {modelMeta.scaleDescription}
        </p>
      </div>

      {/* Selected Organelle Callout Box (Top-Right) */}
      {selectedOrganelleId && (
        <div className="absolute top-3 right-3 z-10 p-3 rounded-xl border border-[#38BDF8]/40 bg-[#070C1B]/90 backdrop-blur-xl shadow-2xl max-w-xs space-y-1 animate-fade-in">
          {(() => {
            const org = modelMeta.organelles.find((o) => o.id === selectedOrganelleId);
            if (!org) return null;
            return (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: org.color }} />
                  <span className="font-sans text-xs font-bold text-white">{org.name}</span>
                </div>
                <p className="font-mono text-[10px] text-[#CBD5E1] leading-snug">
                  {org.description}
                </p>
                <div className="pt-1 border-t border-white/5 font-mono text-[10px] text-[#F59E0B]">
                  <strong>Spaceflight Impact:</strong> {org.spaceflightImpact}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 3D Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onPointerMissed={() => onSelectOrganelle(null)}
      >
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={isRotating}
          autoRotateSpeed={0.8}
          minDistance={2.5}
          maxDistance={12}
        />

        {/* Photometric Biological Lighting */}
        <ambientLight intensity={0.7} color="#0F172A" />
        <directionalLight position={[6, 8, 6]} intensity={2.2} />
        <pointLight position={[-6, -4, -4]} intensity={1.2} color="#00E5FF" />
        <pointLight position={[0, 4, -4]} intensity={0.8} color="#A855F7" />

        {/* Dynamic Model Switcher */}
        {selectedModelId === 'human_cell' && (
          <HumanCellMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'dna_helix' && (
          <DnaHelixMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'rna_molecule' && (
          <RnaMoleculeMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'protein_structure' && (
          <ProteinStructureMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'plant_cell' && (
          <PlantCellMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'microorganism' && (
          <MicroorganismMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'bone_tissue' && (
          <BoneTissueMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
        {selectedModelId === 'muscle_sarcomere' && (
          <MuscleSarcomereMesh explode={explodeFactor} selectedId={selectedOrganelleId} onSelect={onSelectOrganelle} />
        )}
      </Canvas>
    </div>
  );
};

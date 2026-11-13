import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface VehicleComponent {
  id: string;
  name: string;
  type: 'capsule' | 'tank' | 'engine' | 'solar' | 'antenna';
  mass: number; // kg
  thrust?: number; // kN
  power?: number; // kW
  color: string;
}

const COMPONENT_CATALOG: VehicleComponent[] = [
  { id: 'c-capsule', name: 'Crew Command Capsule', type: 'capsule', mass: 2400, color: '#F8FAFC' },
  { id: 'c-tank', name: 'Liquid Hydrolox Fuel Tank', type: 'tank', mass: 12000, color: '#EA580C' },
  { id: 'c-engine', name: 'Cryogenic Vacuum Engine', type: 'engine', mass: 1800, thrust: 420, color: '#334155' },
  { id: 'c-solar', name: 'Deployable Solar Arrays', type: 'solar', mass: 450, power: 18, color: '#38BDF8' },
  { id: 'c-antenna', name: 'Deep-Space Dish Antenna', type: 'antenna', mass: 200, color: '#94A3B8' },
];

/**
 * 3D Model Rendered in R3F Workspace
 */
const Vehicle3DModel: React.FC<{
  components: VehicleComponent[];
  isSimulating: boolean;
}> = ({ components, isSimulating }) => {
  return (
    <group position={[0, -2, 0]}>
      {/* Grid Floor */}
      <gridHelper args={[20, 20, '#38BDF8', '#1E293B']} position={[0, -0.05, 0]} />

      {/* Stacked Components */}
      {components.map((comp, idx) => {
        const yOffset = idx * 2.2;

        return (
          <group key={`${comp.id}-${idx}`} position={[0, yOffset + 1.1, 0]}>
            {comp.type === 'capsule' && (
              <mesh castShadow receiveShadow>
                <coneGeometry args={[1.1, 1.8, 32]} />
                <meshStandardMaterial color={comp.color} roughness={0.3} metalness={0.2} />
              </mesh>
            )}

            {comp.type === 'tank' && (
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[1.2, 1.2, 2.0, 32]} />
                <meshStandardMaterial color={comp.color} roughness={0.5} metalness={0.1} />
              </mesh>
            )}

            {comp.type === 'engine' && (
              <group>
                <mesh castShadow receiveShadow>
                  <coneGeometry args={[1.2, 1.6, 32]} />
                  <meshStandardMaterial color={comp.color} roughness={0.8} metalness={0.6} />
                </mesh>
                {/* Simulated Exhaust Plume */}
                {isSimulating && (
                  <mesh position={[0, -1.8, 0]}>
                    <coneGeometry args={[0.9, 2.6, 16]} />
                    <meshBasicMaterial color="#F59E0B" transparent opacity={0.8} />
                  </mesh>
                )}
              </group>
            )}

            {comp.type === 'solar' && (
              <group>
                <mesh position={[2.0, 0, 0]}>
                  <boxGeometry args={[2.4, 0.8, 0.08]} />
                  <meshStandardMaterial color={comp.color} roughness={0.2} metalness={0.8} />
                </mesh>
                <mesh position={[-2.0, 0, 0]}>
                  <boxGeometry args={[2.4, 0.8, 0.08]} />
                  <meshStandardMaterial color={comp.color} roughness={0.2} metalness={0.8} />
                </mesh>
              </group>
            )}

            {comp.type === 'antenna' && (
              <mesh position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
                <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial color={comp.color} side={THREE.DoubleSide} metalness={0.6} />
              </mesh>
            )}
          </group>
        );
      })}

      <ambientLight color="#1E293B" intensity={1.2} />
      <directionalLight position={[10, 15, 10]} intensity={2.4} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={0.6} color="#38BDF8" />
    </group>
  );
};

export const SpaceCreationStudioScreen: React.FC = () => {
  const [vehicleName, setVehicleName] = useState<string>('Artemis Explorer V');
  const [assembledParts, setAssembledParts] = useState<VehicleComponent[]>([
    COMPONENT_CATALOG[2], // engine
    COMPONENT_CATALOG[1], // tank
    COMPONENT_CATALOG[3], // solar
    COMPONENT_CATALOG[0], // capsule
  ]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Compute Physics Specs
  const totalMass = assembledParts.reduce((acc, p) => acc + p.mass, 0);
  const totalThrust = assembledParts.reduce((acc, p) => acc + (p.thrust || 0), 0);
  const totalPower = assembledParts.reduce((acc, p) => acc + (p.power || 0), 0);

  // Sea level weight on Earth = mass (kg) * 9.81 m/s^2 / 1000 (kN)
  const weightKn = (totalMass * 9.81) / 1000;
  const twr = weightKn > 0 ? (totalThrust / weightKn).toFixed(2) : '0.00';
  const isFlightReady = parseFloat(twr) >= 1.15;

  const handleAddComponent = (comp: VehicleComponent) => {
    setAssembledParts((prev) => [...prev, comp]);
  };

  const handleRemoveComponent = (idx: number) => {
    setAssembledParts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    setAssembledParts([]);
    setIsSimulating(false);
  };

  const handleToggleSimulation = () => {
    setIsSimulating((s) => !s);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030712] font-sans text-[#F8FAFC]">
      <MasterHeader />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in flex flex-col gap-6">
        {/* Studio Hero Banner */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#171A24] via-[#05070D] to-[#0A1828] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#38BDF8] animate-ping" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
                AEROSPACE ENGINEERING & 3D FABRICATION
              </span>
            </div>
            <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Spacecraft Creation Studio
            </h1>
            <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Assemble orbital launch vehicles, lunar landers, and satellites in interactive 3D space. 
              Balance structural dry mass, liquid fuel, thrust-to-weight ratios (TWR), and electrical power.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#38BDF8]">
              3D CAD WORKSPACE READY
            </span>
          </div>
        </div>

        {/* 3D Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 3D Three.js Construction Viewport */}
          <div className="lg:col-span-2 relative aspect-[16/10] min-h-[380px] rounded-3xl border border-white/10 bg-[#060A14] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/60 px-3 py-1 font-sans text-sm font-bold text-[#F8FAFC] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear Deck</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSimulation}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold transition-all ${
                    isSimulating
                      ? 'border border-[#F59E0B] bg-[#F59E0B] text-[#05070D]'
                      : 'border border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]'
                  }`}
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{isSimulating ? 'Stop Burn' : 'Engine Test Burn'}</span>
                </button>
              </div>
            </div>

            {/* Live 3D R3F Canvas */}
            <div className="absolute inset-0 h-full w-full">
              <Canvas
                shadows
                camera={{ position: [0, 4, 10], fov: 45 }}
                gl={{ antialias: true }}
              >
                <OrbitControls enablePan={true} enableZoom={true} minDistance={4} maxDistance={20} />
                <Vehicle3DModel components={assembledParts} isSimulating={isSimulating} />
              </Canvas>
            </div>

            {/* Bottom Status Telemetry */}
            <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
              <span>Assembled Stages: {assembledParts.length} Components</span>
              <span>Orbit Controls: Left Drag to Rotate • Scroll to Zoom</span>
              <span className={isFlightReady ? 'text-[#10B981] font-bold' : 'text-amber-400'}>
                {isFlightReady ? 'Flight Certified (TWR ≥ 1.15)' : 'Insufficient Thrust (TWR < 1.15)'}
              </span>
            </div>
          </div>

          {/* Right Column: Component Catalog & Engineering Telemetry */}
          <div className="flex flex-col gap-5">
            {/* Engineering Metrics Card */}
            <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="font-bold text-[#F8FAFC]">PROPULSION SPECS</span>
                {isFlightReady ? (
                  <span className="flex items-center gap-1 text-[#10B981] text-[10px] font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>LAUNCH READY</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>LOW THRUST</span>
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Gross Vehicle Mass:</span>
                  <span className="text-[#F8FAFC] font-bold">{totalMass.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Combined Engine Thrust:</span>
                  <span className="text-[#F59E0B] font-bold">{totalThrust} kN</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#94A3B8]">Thrust-to-Weight (TWR):</span>
                  <span className={`font-bold ${isFlightReady ? 'text-[#10B981]' : 'text-amber-400'}`}>
                    {twr}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#94A3B8]">Electrical Power:</span>
                  <span className="text-[#38BDF8] font-bold">+{totalPower} kW</span>
                </div>
              </div>
            </div>

            {/* Component Selector Catalog */}
            <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 shadow-xl backdrop-blur-xl flex flex-col gap-3">
              <span className="font-mono text-[10px] font-semibold text-[#94A3B8] uppercase">
                Add Modular Stage Component
              </span>

              <div className="flex flex-col gap-2">
                {COMPONENT_CATALOG.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-all hover:bg-white/5"
                  >
                    <div className="flex flex-col">
                      <span className="font-sans text-xs font-semibold text-[#F8FAFC]">
                        {item.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#94A3B8]">
                        Mass: {item.mass} kg {item.thrust ? `• Thrust: ${item.thrust} kN` : ''}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddComponent(item)}
                      title={`Add ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#05070D] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Stack Hierarchy */}
            <div className="rounded-2xl border border-white/10 bg-[#080F1D]/80 p-5 font-mono text-xs">
              <span className="font-mono text-[10px] font-semibold text-[#94A3B8] uppercase block mb-2">
                Assembled Staging Stack ({assembledParts.length})
              </span>

              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                {assembledParts.map((part, idx) => (
                  <div
                    key={`${part.id}-${idx}`}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-black/40 px-2.5 py-1.5"
                  >
                    <span>
                      {idx + 1}. {part.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

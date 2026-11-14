import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { TelemetryBadge } from '../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../components/ui/SpaceButton';
import {
  Play,
  Square,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Target,
} from 'lucide-react';

export interface VehicleComponent {
  id: string;
  name: string;
  category: 'propulsion' | 'fuel' | 'payload' | 'power' | 'avionics';
  type: 'capsule' | 'tank' | 'engine' | 'solar' | 'antenna';
  mass: number; // dry mass (kg)
  propellant?: number; // fuel mass (kg)
  thrust?: number; // vacuum thrust (kN)
  isp?: number; // specific impulse (s)
  power?: number; // net electrical power balance (kW)
  color: string;
  description: string;
}

export const COMPONENT_CATALOG: VehicleComponent[] = [
  // Propulsion
  {
    id: 'c-engine-vac',
    name: 'RS-25 Cryogenic Vacuum Engine',
    category: 'propulsion',
    type: 'engine',
    mass: 2200,
    thrust: 650,
    isp: 452,
    power: -1.5,
    color: '#334155',
    description: 'High-efficiency liquid hydrolox expander cycle engine with high specific impulse.',
  },
  {
    id: 'c-engine-booster',
    name: 'Solid Rocket Booster Stage',
    category: 'propulsion',
    type: 'engine',
    mass: 6500,
    propellant: 28000,
    thrust: 2400,
    isp: 282,
    power: 0,
    color: '#E2E8F0',
    description: 'High-thrust segmented solid propellant motor delivering raw liftoff power.',
  },
  // Fuel Tanks
  {
    id: 'c-tank-hydrolox',
    name: 'Hydrolox Cryogenic Tank Core',
    category: 'fuel',
    type: 'tank',
    mass: 2500,
    propellant: 22000,
    power: -0.2,
    color: '#EA580C',
    description: 'Insulated liquid hydrogen and oxygen propellant cell with lightweight composite tankage.',
  },
  {
    id: 'c-tank-methalox',
    name: 'Methalox High-Density Tank',
    category: 'fuel',
    type: 'tank',
    mass: 3200,
    propellant: 29000,
    power: -0.2,
    color: '#0284C7',
    description: 'Densified methane and liquid oxygen tank optimized for high volumetric efficiency.',
  },
  // Payload & Crew
  {
    id: 'c-capsule-orion',
    name: 'Deep-Space Orion Command Module',
    category: 'payload',
    type: 'capsule',
    mass: 3400,
    power: -3.5,
    color: '#F8FAFC',
    description: 'Atmospheric reentry capsule accommodating 4 astronauts with ablative heat shielding.',
  },
  {
    id: 'c-capsule-service',
    name: 'Orbital Service Propulsion Hub',
    category: 'payload',
    type: 'capsule',
    mass: 1800,
    propellant: 3500,
    thrust: 120,
    isp: 320,
    power: 2.0,
    color: '#64748B',
    description: 'Auxiliary attitude control, consumables storage, and hypergolic orbital maneuvering.',
  },
  // Power & Arrays
  {
    id: 'c-solar-wings',
    name: 'Ultraflex Deployable Solar Wings',
    category: 'power',
    type: 'solar',
    mass: 480,
    power: 32.0,
    color: '#38BDF8',
    description: 'Circular origami photovoltaic arrays generating continuous power in cis-lunar space.',
  },
  // Avionics & Communication
  {
    id: 'c-dish-antenna',
    name: 'High-Gain Deep-Space Dish',
    category: 'avionics',
    type: 'antenna',
    mass: 220,
    power: -1.2,
    color: '#CBD5E1',
    description: 'Ka-band high-gain parabolic reflector for multi-gigabit interplanetary telemetry.',
  },
];

/**
 * Animated Exhaust Plume in Three.js
 */
const EngineExhaustPlume: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const scale = 1.0 + Math.sin(t * 30) * 0.12;
      meshRef.current.scale.set(scale, 1.0 + Math.cos(t * 25) * 0.15, scale);
    }
  });

  return (
    <group position={[0, -1.8, 0]}>
      {/* Outer Fire Cone */}
      <mesh ref={meshRef}>
        <coneGeometry args={[0.9, 2.6, 24]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.85} />
      </mesh>
      {/* Inner White-Hot Core */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.45, 1.6, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
      </mesh>
      {/* Shock Diamonds */}
      <pointLight color="#F59E0B" intensity={4} distance={8} />
    </group>
  );
};

/**
 * 3D Spacecraft Model in React Three Fiber
 */
const Vehicle3DModel: React.FC<{
  components: VehicleComponent[];
  isSimulating: boolean;
}> = ({ components, isSimulating }) => {
  const stackRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stackRef.current && isSimulating) {
      // Subtle rocket vibration shudder during hot-fire
      const t = state.clock.getElapsedTime();
      stackRef.current.position.x = Math.sin(t * 80) * 0.012;
      stackRef.current.position.z = Math.cos(t * 80) * 0.012;
    } else if (stackRef.current) {
      stackRef.current.position.x = 0;
      stackRef.current.position.z = 0;
    }
  });

  return (
    <group position={[0, -3.2, 0]}>
      {/* Aerospace Launch Deck Grid */}
      <gridHelper args={[24, 24, '#38BDF8', '#132147']} position={[0, -0.05, 0]} />

      {/* Assembly Stack */}
      <group ref={stackRef}>
        {components.map((comp, idx) => {
          const yOffset = idx * 2.2;

          return (
            <group key={`${comp.id}-${idx}`} position={[0, yOffset + 1.1, 0]}>
              {comp.type === 'capsule' && (
                <mesh castShadow receiveShadow>
                  <coneGeometry args={[1.2, 1.9, 32]} />
                  <meshStandardMaterial
                    color={comp.color}
                    roughness={0.25}
                    metalness={0.35}
                    envMapIntensity={1.2}
                  />
                </mesh>
              )}

              {comp.type === 'tank' && (
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1.25, 1.25, 2.0, 32]} />
                  <meshStandardMaterial
                    color={comp.color}
                    roughness={0.4}
                    metalness={0.2}
                  />
                </mesh>
              )}

              {comp.type === 'engine' && (
                <group>
                  <mesh castShadow receiveShadow>
                    <coneGeometry args={[1.25, 1.7, 32]} />
                    <meshStandardMaterial
                      color={comp.color}
                      roughness={0.7}
                      metalness={0.65}
                    />
                  </mesh>
                  {/* Dynamic Hot-Fire Plume */}
                  {isSimulating && <EngineExhaustPlume />}
                </group>
              )}

              {comp.type === 'solar' && (
                <group>
                  {/* Left Array */}
                  <mesh position={[2.2, 0, 0]}>
                    <boxGeometry args={[2.8, 0.9, 0.08]} />
                    <meshStandardMaterial
                      color={comp.color}
                      roughness={0.15}
                      metalness={0.85}
                      emissive="#0284C7"
                      emissiveIntensity={0.25}
                    />
                  </mesh>
                  {/* Right Array */}
                  <mesh position={[-2.2, 0, 0]}>
                    <boxGeometry args={[2.8, 0.9, 0.08]} />
                    <meshStandardMaterial
                      color={comp.color}
                      roughness={0.15}
                      metalness={0.85}
                      emissive="#0284C7"
                      emissiveIntensity={0.25}
                    />
                  </mesh>
                </group>
              )}

              {comp.type === 'antenna' && (
                <mesh position={[0, 1.2, 0]} rotation={[0.45, 0, 0]}>
                  <sphereGeometry args={[0.9, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                  <meshStandardMaterial
                    color={comp.color}
                    side={THREE.DoubleSide}
                    metalness={0.75}
                    roughness={0.2}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      <ambientLight color="#0F172A" intensity={1.5} />
      <directionalLight position={[12, 18, 12]} intensity={2.5} castShadow />
      <pointLight position={[-12, 6, -12]} intensity={0.9} color="#38BDF8" />
    </group>
  );
};

export const SpaceCreationStudioScreen: React.FC = () => {
  const [vehicleName, setVehicleName] = useState<string>('Artemis Deep-Space Explorer');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [assembledParts, setAssembledParts] = useState<VehicleComponent[]>([
    COMPONENT_CATALOG[0], // engine
    COMPONENT_CATALOG[2], // fuel tank
    COMPONENT_CATALOG[6], // solar wings
    COMPONENT_CATALOG[4], // crew capsule
    COMPONENT_CATALOG[7], // deep-space dish
  ]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Physics Calculations
  const dryMass = useMemo(
    () => assembledParts.reduce((acc, p) => acc + p.mass, 0),
    [assembledParts]
  );
  const propellantMass = useMemo(
    () => assembledParts.reduce((acc, p) => acc + (p.propellant || 0), 0),
    [assembledParts]
  );
  const totalGrossMass = dryMass + propellantMass; // kg
  const totalThrustKn = useMemo(
    () => assembledParts.reduce((acc, p) => acc + (p.thrust || 0), 0),
    [assembledParts]
  );
  const netPowerKw = useMemo(
    () => assembledParts.reduce((acc, p) => acc + (p.power || 0), 0),
    [assembledParts]
  );

  // Sea-level Earth Weight: W = (M * 9.80665) / 1000 kN
  const weightKn = (totalGrossMass * 9.80665) / 1000;
  const twr = weightKn > 0 ? parseFloat((totalThrustKn / weightKn).toFixed(2)) : 0;
  const isFlightReady = twr >= 1.15;

  // Tsiolkovsky Delta-V: Δv = Isp * g0 * ln(m_wet / m_dry)
  const weightedIsp = useMemo(() => {
    const engines = assembledParts.filter((p) => p.thrust && p.thrust > 0 && p.isp);
    if (engines.length === 0) return 0;
    const totalThrust = engines.reduce((acc, e) => acc + (e.thrust || 0), 0);
    const weightedSum = engines.reduce((acc, e) => acc + (e.thrust || 0) * (e.isp || 0), 0);
    return Math.round(weightedSum / totalThrust);
  }, [assembledParts]);

  const deltaV = useMemo(() => {
    if (weightedIsp === 0 || dryMass === 0 || totalGrossMass <= dryMass) return 0;
    const massRatio = totalGrossMass / dryMass;
    return Math.round(weightedIsp * 9.80665 * Math.log(massRatio));
  }, [weightedIsp, dryMass, totalGrossMass]);

  // Mission Reachability Assessment
  const missionTargets = [
    { name: 'Suborbital Spaceflight', reqDv: 2500, reqTwr: 1.15 },
    { name: 'Low Earth Orbit (LEO)', reqDv: 9200, reqTwr: 1.20 },
    { name: 'Lunar Orbit Insertion', reqDv: 12500, reqTwr: 1.20 },
    { name: 'Mars Trans-Planetary Flyby', reqDv: 15600, reqTwr: 1.25 },
  ];

  // Component Actions
  const handleAddComponent = (comp: VehicleComponent) => {
    setAssembledParts((prev) => [...prev, comp]);
  };

  const handleRemoveComponent = (idx: number) => {
    setAssembledParts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveStage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= assembledParts.length) return;
    setAssembledParts((prev) => {
      const next = [...prev];
      const item = next.splice(fromIdx, 1)[0];
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  const handleReset = () => {
    setAssembledParts([]);
    setIsSimulating(false);
  };

  const handleToggleSimulation = () => {
    setIsSimulating((s) => !s);
  };

  const filteredCatalog = useMemo(() => {
    if (activeCategory === 'all') return COMPONENT_CATALOG;
    return COMPONENT_CATALOG.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030611] font-sans text-[#F8FAFC]">
      <MasterHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 animate-fade-in">
        
        {/* ================================================================= */}
        {/* 1. STUDIO HERO TELEMETRY BANNER                                  */}
        {/* ================================================================= */}
        <GlassCard
          variant="elevated"
          className="p-6 sm:p-8 border-glow-cyan bg-gradient-to-r from-[#0C1427]/90 via-[#070C1B]/95 to-[#161B2E]/90"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <TelemetryBadge
                  label="WORKSHOP"
                  value="3D CAD FABRICATION"
                  tone="cyan"
                  pulsing
                  icon={Rocket}
                  size="sm"
                />
                <TelemetryBadge
                  label="STAGING"
                  value={`${assembledParts.length} STAGES`}
                  tone="violet"
                  size="sm"
                />
                <TelemetryBadge
                  label="DELTA-V"
                  value={`${deltaV.toLocaleString()} m/s`}
                  tone="amber"
                  size="sm"
                />
                <TelemetryBadge
                  label="STATUS"
                  value={isFlightReady ? 'FLIGHT CERTIFIED' : 'LOW THRUST'}
                  tone={isFlightReady ? 'emerald' : 'amber'}
                  size="sm"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  <span>Spacecraft Creation Studio</span>
                  <Sparkles className="h-6 w-6 text-[#38BDF8] hidden sm:inline-block animate-pulse" />
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  Design, assemble, and hot-fire multi-stage spacecraft in an interactive 3D physics environment. Balance cryogenic propellant mass, vacuum specific impulse (I_sp), thrust-to-weight ratios (TWR), and electrical power budgets.
                </p>
              </div>
            </div>

            {/* Live TWR / Delta-V Quick Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
              <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Gross Mass</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white">
                  {(totalGrossMass / 1000).toFixed(1)} t
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Total Thrust</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#F59E0B]">
                  {totalThrustKn.toLocaleString()} kN
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Liftoff TWR</span>
                <span className={`font-mono text-xs sm:text-sm font-bold ${isFlightReady ? 'text-[#34D399]' : 'text-amber-400'}`}>
                  {twr.toFixed(2)}
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 flex flex-col justify-between">
                <span className="font-mono text-[10px] uppercase text-[#94A3B8]">Avg Isp</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#38BDF8]">
                  {weightedIsp} s
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ================================================================= */}
        {/* 2. MAIN 3D WORKBENCH & CAD FABRICATION AREA                      */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 3D Three.js Viewport (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <GlassCard
              variant="elevated"
              className="relative aspect-[16/10] min-h-[460px] flex flex-col justify-between p-4 sm:p-5 border-glow-cyan"
            >
              {/* Top Viewport Telemetry & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-[#38BDF8]" />
                  <input
                    type="text"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    data-testid="vehicle-name-input"
                    className="rounded-xl border border-white/10 bg-[#070C1B]/80 px-3 py-1 font-sans text-xs sm:text-sm font-bold text-white focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <SpaceButton
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    icon={RotateCcw}
                    data-testid="clear-deck-btn"
                  >
                    Clear Deck
                  </SpaceButton>

                  <SpaceButton
                    variant={isSimulating ? 'danger' : 'primary'}
                    size="sm"
                    onClick={handleToggleSimulation}
                    icon={isSimulating ? Square : Play}
                    data-testid="toggle-sim-btn"
                  >
                    {isSimulating ? 'Abort Test Burn' : 'Engine Hot-Fire Test'}
                  </SpaceButton>
                </div>
              </div>

              {/* R3F 3D Canvas */}
              <div className="absolute inset-0 h-full w-full">
                <Canvas
                  shadows
                  camera={{ position: [0, 4, 12], fov: 45 }}
                  gl={{ antialias: true }}
                >
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    minDistance={4}
                    maxDistance={24}
                  />
                  <Vehicle3DModel
                    components={assembledParts}
                    isSimulating={isSimulating}
                  />
                </Canvas>
              </div>

              {/* Bottom Viewport Status Bar */}
              <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[11px] text-[#94A3B8] gap-2">
                <div className="flex items-center gap-3">
                  <span>Stack Height: {(assembledParts.length * 2.2).toFixed(1)} m</span>
                  <span>•</span>
                  <span>Stages: {assembledParts.length} Components</span>
                </div>

                <span className="hidden sm:inline text-[#64748B]">
                  Orbit Controls: Left Drag to Orbit • Scroll to Zoom
                </span>

                <div className="flex items-center gap-1.5">
                  {isFlightReady ? (
                    <span className="flex items-center gap-1 text-[#34D399] font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>TWR {twr.toFixed(2)} ≥ 1.15 (GO FOR LAUNCH)</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>TWR {twr.toFixed(2)} &lt; 1.15 (HOLD LAUNCH)</span>
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Mission Capability Assessment */}
            <GlassCard variant="default" className="p-5">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#A78BFA]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#A78BFA] font-bold">
                    MISSION REACHABILITY ASSESSMENT (DELTA-V &amp; TWR)
                  </span>
                </div>
                <span className="font-mono text-xs text-white font-bold">
                  Current Capability: {deltaV.toLocaleString()} m/s
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {missionTargets.map((m) => {
                  const hasDv = deltaV >= m.reqDv;
                  const hasTwr = twr >= m.reqTwr;
                  const canReach = hasDv && hasTwr;

                  return (
                    <div
                      key={m.name}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        canReach
                          ? 'border-[#34D399]/40 bg-[#34D399]/10 text-white'
                          : 'border-white/5 bg-[#0B1226]/50 text-[#94A3B8]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-sans text-xs font-bold leading-tight">
                            {m.name}
                          </span>
                          {canReach ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#34D399] shrink-0" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <span className="font-mono text-[10px] block text-[#94A3B8]">
                          Req: {m.reqDv.toLocaleString()} m/s • TWR {m.reqTwr}
                        </span>
                      </div>

                      <span className={`font-mono text-[9.5px] font-bold mt-2 uppercase ${canReach ? 'text-[#34D399]' : 'text-amber-400'}`}>
                        {canReach ? 'Trajectory Achievable' : 'Insufficient Energy'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Telemetry & Component Catalog (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Propulsion & Power Telemetry */}
            <GlassCard variant="default" className="p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block mb-3">
                ENGINEERING TELEMETRY MATRIX
              </span>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-[#94A3B8]">Dry Mass:</span>
                  <span className="text-white font-bold">{dryMass.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-[#94A3B8]">Propellant Mass:</span>
                  <span className="text-[#38BDF8] font-bold">{propellantMass.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-[#94A3B8]">Total Gross Mass:</span>
                  <span className="text-white font-bold">{totalGrossMass.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-[#94A3B8]">Vacuum Thrust:</span>
                  <span className="text-[#F59E0B] font-bold">{totalThrustKn.toLocaleString()} kN</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-[#94A3B8]">Liftoff TWR:</span>
                  <span className={`font-bold ${isFlightReady ? 'text-[#34D399]' : 'text-amber-400'}`}>
                    {twr.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-[#94A3B8]">Mission Delta-V:</span>
                  <span className="text-[#F59E0B] font-bold">{deltaV.toLocaleString()} m/s</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[#94A3B8]">Net Electrical Balance:</span>
                  <span className={`font-bold ${netPowerKw >= 0 ? 'text-[#34D399]' : 'text-red-400'}`}>
                    {netPowerKw >= 0 ? `+${netPowerKw.toFixed(1)} kW` : `${netPowerKw.toFixed(1)} kW`}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Modular Component Library */}
            <GlassCard variant="default" className="p-5">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#38BDF8] font-bold">
                  MODULAR STAGE CATALOG
                </span>
                <span className="font-mono text-[10px] text-[#94A3B8]">
                  {COMPONENT_CATALOG.length} Parts
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['all', 'propulsion', 'fuel', 'payload', 'power', 'avionics'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] transition-all capitalize ${
                      activeCategory === cat
                        ? 'border border-[#38BDF8] bg-[#38BDF8]/20 text-[#38BDF8] font-bold'
                        : 'border border-white/5 bg-[#0B1226]/60 text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Component Items List */}
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-[#0B1226]/70 hover:border-white/15 hover:bg-white/5 transition-all"
                  >
                    <div className="flex flex-col pr-2">
                      <span className="font-sans text-xs font-semibold text-white leading-tight">
                        {item.name}
                      </span>
                      <span className="font-mono text-[9.5px] text-[#94A3B8] mt-0.5">
                        Mass: {item.mass} kg
                        {item.propellant ? ` • Fuel: ${item.propellant} kg` : ''}
                        {item.thrust ? ` • Thrust: ${item.thrust} kN` : ''}
                        {item.power ? ` • Power: ${item.power > 0 ? `+${item.power}` : item.power} kW` : ''}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddComponent(item)}
                      title={`Add ${item.name} to stack`}
                      data-testid={`add-part-${item.id}`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#030611] transition-colors shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Assembled Staging Hierarchy */}
            <GlassCard variant="default" className="p-5 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">
                  ACTIVE STAGING HIERARCHY ({assembledParts.length})
                </span>
                <span className="font-mono text-[10px] text-[#94A3B8]">
                  Top to Bottom
                </span>
              </div>

              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {assembledParts.map((part, idx) => (
                  <div
                    key={`${part.id}-${idx}`}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-[#070C1B]/80 px-2.5 py-1.5"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-mono text-[10px] text-[#38BDF8] font-bold shrink-0">
                        S{assembledParts.length - idx}
                      </span>
                      <span className="text-xs text-white truncate">
                        {part.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStage(idx, idx - 1)}
                        className="text-[#94A3B8] hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === assembledParts.length - 1}
                        onClick={() => handleMoveStage(idx, idx + 1)}
                        className="text-[#94A3B8] hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveComponent(idx)}
                        className="text-red-400 hover:text-red-300 ml-1"
                        title="Remove component"
                        data-testid={`remove-part-${idx}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

        </div>

      </main>
    </div>
  );
};

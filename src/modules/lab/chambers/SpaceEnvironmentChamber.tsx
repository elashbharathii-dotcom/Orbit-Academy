import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../../components/ui/SpaceButton';
import {
  IMPACTOR_PRESETS,
  ImpactorPreset,
  RADIATION_MATERIALS,
} from '../labData';
import {
  Shield,
  Activity,
  Play,
  Bomb,
  Wind,
  Radio,
  Flame,
} from 'lucide-react';

interface SpaceEnvironmentChamberProps {
  onLogTelemetry: (msg: string) => void;
  onMilestoneAchieved: (milestoneId: string) => void;
}

type SubExperiment = 'drag' | 'impact' | 'radiation';

export const SpaceEnvironmentChamber: React.FC<SpaceEnvironmentChamberProps> = ({
  onLogTelemetry,
  onMilestoneAchieved,
}) => {
  const [activeSubExperiment, setActiveSubExperiment] = useState<SubExperiment>('impact');

  // --- SUB-EXPERIMENT 1: AERODYNAMIC DRAG & DROP TOWER ---
  const [dragWorld, setDragWorld] = useState<'earth' | 'mars' | 'vacuum'>('earth');
  const [dropHeightM, setDropHeightM] = useState<number>(100);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [ball1Y, setBall1Y] = useState<number>(0); // Vacuum ball
  const [ball2Y, setBall2Y] = useState<number>(0); // Atmospheric ball
  const [fallTimeVac, setFallTimeVac] = useState<number | null>(null);
  const [fallTimeAtm, setFallTimeAtm] = useState<number | null>(null);

  const g_earth = 9.81;
  const rho_atm = dragWorld === 'earth' ? 1.225 : dragWorld === 'mars' ? 0.02 : 0; // kg/m3

  const handleStartDrop = () => {
    setIsDropping(true);
    setBall1Y(0);
    setBall2Y(0);

    const tVac = Math.sqrt((2 * dropHeightM) / g_earth);
    setFallTimeVac(tVac);

    // Approximate terminal drag fall time
    const tAtm = dragWorld === 'vacuum' ? tVac : tVac * (dragWorld === 'earth' ? 1.35 : 1.05);
    setFallTimeAtm(tAtm);

    const startTime = Date.now();
    const durationMs = 2800;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / durationMs;
      if (elapsed >= 1) {
        setBall1Y(100);
        setBall2Y(100);
        setIsDropping(false);
        clearInterval(interval);
      } else {
        setBall1Y(Math.min(100, Math.pow(elapsed * 1.15, 2) * 100));
        setBall2Y(Math.min(100, Math.pow(elapsed * (dragWorld === 'earth' ? 0.85 : 1.1), 1.7) * 100));
      }
    }, 16);

    onLogTelemetry(
      `DROP_TEST: Initiated comparison in ${dragWorld.toUpperCase()} (ρ=${rho_atm} kg/m³) from ${dropHeightM}m.`
    );
  };

  // --- SUB-EXPERIMENT 2: HYPERVELOCITY ASTEROID IMPACT ---
  const [asteroidDiameterM, setAsteroidDiameterM] = useState<number>(150); // meters
  const [impactVelocityKmS, setImpactVelocityKmS] = useState<number>(20.0); // km/s
  const [impactorDensity, setImpactorDensity] = useState<number>(2.6); // g/cm3
  const [isImpacting, setIsImpacting] = useState<boolean>(false);
  const [impactFlash, setImpactFlash] = useState<number>(0);

  // Physics Calculations:
  // Volume V = 4/3 pi (D/2)^3 in m^3
  const asteroidRadiusM = asteroidDiameterM / 2;
  const volumeM3 = (4 / 3) * Math.PI * Math.pow(asteroidRadiusM, 3);
  const massKg = volumeM3 * (impactorDensity * 1000);

  // Kinetic Energy E = 1/2 m v^2 in Joules
  const velocityMS = impactVelocityKmS * 1000;
  const kineticEnergyJoules = 0.5 * massKg * Math.pow(velocityMS, 2);

  // Megatons TNT (1 Mt TNT = 4.184e15 J)
  const energyMegatonsTNT = kineticEnergyJoules / 4.184e15;

  // Transient Crater Diameter D_tc = 1.161 * (E / (rho_target * g))^0.29 in km
  const craterDiameterKm = Math.min(
    250,
    1.161 * Math.pow((kineticEnergyJoules / (2600 * 9.81)), 0.29) / 1000
  );

  // Richter scale seismic magnitude: M_w = 0.67 * log10(E) - 5.87
  const richterMagnitude = Math.min(10.5, Math.max(1.0, 0.67 * Math.log10(kineticEnergyJoules) - 5.87));

  const handleLaunchImpact = () => {
    setIsImpacting(true);
    setImpactFlash(1.0);

    onLogTelemetry(
      `IMPACT_SIM: Detonation! Diameter=${asteroidDiameterM}m, v=${impactVelocityKmS}km/s -> Energy=${energyMegatonsTNT.toFixed(1)} Mt TNT, Crater=${craterDiameterKm.toFixed(2)}km`
    );

    if (energyMegatonsTNT >= 1.0) {
      onMilestoneAchieved('env-impact-test');
    }

    const interval = setInterval(() => {
      setImpactFlash((f) => {
        if (f <= 0.05) {
          clearInterval(interval);
          setIsImpacting(false);
          return 0;
        }
        return f - 0.08;
      });
    }, 40);
  };

  const handleApplyImpactorPreset = (preset: ImpactorPreset) => {
    setAsteroidDiameterM(preset.diameterM);
    setImpactVelocityKmS(preset.velocityKmS);
    setImpactorDensity(preset.densityGcm3);
    onLogTelemetry(`IMPACT_PRESET: Loaded historical analogue "${preset.name}"`);
  };

  // --- SUB-EXPERIMENT 3: COSMIC RADIATION SHIELDING ---
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('polyethylene');
  const [shieldThicknessMm, setShieldThicknessMm] = useState<number>(30); // mm
  const [radiationSource, setRadiationSource] = useState<'SPE' | 'GCR'>('SPE');

  const selectedMaterial =
    RADIATION_MATERIALS.find((m) => m.id === selectedMaterialId) ||
    RADIATION_MATERIALS[3];

  // Base unshielded dose (SPE: 8.0 mSv/hr, GCR: 1.5 mSv/day)
  const baseDose = radiationSource === 'SPE' ? 8.0 : 1.5;
  const unit = radiationSource === 'SPE' ? 'mSv/hr' : 'mSv/day';

  // Attenuation: dose = base * exp(-mu * thickness)
  const attenuationFactor = Math.exp(
    -(selectedMaterial.absorptionCoeff * (shieldThicknessMm / 15))
  );
  const transmittedDose = (baseDose * attenuationFactor).toFixed(2);
  const absorbedPct = Math.round((1 - attenuationFactor) * 100);

  useEffect(() => {
    if (absorbedPct > 60 && (selectedMaterialId === 'polyethylene' || selectedMaterialId === 'water')) {
      onMilestoneAchieved('env-radiation-shield');
    }
  }, [absorbedPct, selectedMaterialId, onMilestoneAchieved]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      {/* Sub-Experiment Mode Selector Bar */}
      <GlassCard variant="elevated" className="p-3 border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#A78BFA]" />
          <span className="font-mono text-xs font-bold text-[#F8FAFC]">
            SPACE ENVIRONMENT BENCH:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-env-bench="impact"
            onClick={() => setActiveSubExperiment('impact')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-xs transition-all ${
              activeSubExperiment === 'impact'
                ? 'border border-[#EF4444] bg-[#EF4444]/20 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
            }`}
          >
            <Bomb className="h-3.5 w-3.5" />
            <span>Hypervelocity Asteroid Impact</span>
          </button>

          <button
            type="button"
            data-env-bench="radiation"
            onClick={() => setActiveSubExperiment('radiation')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-xs transition-all ${
              activeSubExperiment === 'radiation'
                ? 'border border-[#A78BFA] bg-[#A78BFA]/20 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(167,139,250,0.3)]'
                : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Cosmic Radiation Shielding</span>
          </button>

          <button
            type="button"
            data-env-bench="drag"
            onClick={() => setActiveSubExperiment('drag')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 font-mono text-xs transition-all ${
              activeSubExperiment === 'drag'
                ? 'border border-[#38BDF8] bg-[#38BDF8]/20 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>Vacuum vs Aerodynamic Drag</span>
          </button>
        </div>
      </GlassCard>

      {/* 1. HYPERVELOCITY IMPACT EXPERIMENT */}
      {activeSubExperiment === 'impact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Visual Crater Basin Viewport */}
          <GlassCard
            variant="elevated"
            className="lg:col-span-2 relative aspect-[16/10] min-h-[400px] p-5 flex flex-col justify-between overflow-hidden border-white/10 bg-[#07050A]"
          >
            {/* Header */}
            <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Bomb className="h-4 w-4 text-[#EF4444]" />
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  KINETIC EXCAVATION BASIN // ENERGY = {energyMegatonsTNT.toFixed(1)} MT TNT
                </span>
              </div>
              <TelemetryBadge
                label={`MAGNITUDE ${richterMagnitude.toFixed(1)}`}
                tone={richterMagnitude > 7 ? 'amber' : 'cyan'}
                size="sm"
              />
            </div>

            {/* Simulated Crater Visualizer */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {/* Flash Overlay */}
              {impactFlash > 0 && (
                <div
                  className="absolute inset-0 bg-white transition-opacity pointer-events-none"
                  style={{ opacity: impactFlash }}
                />
              )}

              {/* Dynamic Crater Rings based on craterDiameterKm */}
              <div
                className="relative rounded-full border-4 border-amber-600/40 bg-gradient-to-b from-[#1C120C] to-[#0A0604] flex items-center justify-center shadow-2xl transition-all duration-700"
                style={{
                  width: `${Math.min(320, Math.max(60, craterDiameterKm * 24))}px`,
                  height: `${Math.min(320, Math.max(60, craterDiameterKm * 24))}px`,
                }}
              >
                {/* Central Peak or Melt Sheet */}
                <div className="h-8 w-8 rounded-full bg-[#EF4444]/60 blur-sm animate-pulse" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="font-mono text-sm font-bold text-[#F59E0B]">
                    Crater Ø: {craterDiameterKm >= 1 ? `${craterDiameterKm.toFixed(1)} km` : `${Math.round(craterDiameterKm * 1000)} m`}
                  </span>
                  <span className="font-mono text-[9px] text-[#94A3B8]">
                    Excavated Depth: ~{(craterDiameterKm * 0.18).toFixed(2)} km
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Action Footer */}
            <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-3 gap-3 bg-[#07050A]/80 backdrop-blur-md rounded-xl p-2.5">
              <div className="font-mono text-xs text-[#CBD5E1] flex items-center gap-3">
                <span>Mass: <strong className="text-[#F8FAFC]">{(massKg / 1e9).toFixed(2)} M Tonnes</strong></span>
                <span>Impact Speed: <strong className="text-[#38BDF8]">{impactVelocityKmS} km/s</strong></span>
              </div>

              <SpaceButton
                variant="primary"
                size="sm"
                icon={Flame}
                disabled={isImpacting}
                onClick={handleLaunchImpact}
              >
                {isImpacting ? 'EXCAVATING BASIN...' : 'LAUNCH IMPACT TEST'}
              </SpaceButton>
            </div>
          </GlassCard>

          {/* Impact Controls & Presets */}
          <div className="flex flex-col gap-4">
            <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                IMPACTOR PARAMETERS
              </span>

              {/* Asteroid Diameter Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Impactor Diameter:</span>
                  <span className="font-bold text-[#EF4444]">
                    {asteroidDiameterM >= 1000 ? `${(asteroidDiameterM / 1000).toFixed(1)} km` : `${asteroidDiameterM} meters`}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="10000"
                  step="20"
                  value={asteroidDiameterM}
                  onChange={(e) => setAsteroidDiameterM(parseInt(e.target.value, 10))}
                  className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#EF4444] cursor-pointer"
                />
              </div>

              {/* Velocity Slider */}
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Entry Velocity:</span>
                  <span className="font-bold text-[#38BDF8]">{impactVelocityKmS.toFixed(1)} km/s</span>
                </div>
                <input
                  type="range"
                  min="11.2"
                  max="70.0"
                  step="0.5"
                  value={impactVelocityKmS}
                  onChange={(e) => setImpactVelocityKmS(parseFloat(e.target.value))}
                  className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                />
              </div>

              {/* Density Selector */}
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <span className="font-mono text-[11px] text-[#94A3B8]">Composition & Density:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Comet', d: 1.5 },
                    { label: 'Stony', d: 2.6 },
                    { label: 'Iron', d: 7.8 },
                  ].map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setImpactorDensity(c.d)}
                      className={`py-1.5 px-2 rounded-lg border font-mono text-xs transition-colors ${
                        impactorDensity === c.d
                          ? 'border-[#F59E0B] bg-[#F59E0B]/20 font-bold text-[#F8FAFC]'
                          : 'border-white/5 bg-[#0B1528] text-[#94A3B8]'
                      }`}
                    >
                      {c.label} ({c.d}g)
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Historical Analogue Presets */}
            <GlassCard variant="elevated" className="p-4 border-white/10">
              <span className="font-mono text-[10px] text-[#EF4444] font-bold uppercase tracking-wider block mb-2">
                HISTORICAL IMPACT ANALOGUES
              </span>
              <div className="flex flex-col gap-1.5">
                {IMPACTOR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyImpactorPreset(p)}
                    className="p-2 rounded-xl border border-white/5 bg-[#0B1528]/50 hover:bg-[#122242] transition-colors text-left flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-sans text-xs font-bold text-[#F8FAFC]">{p.name}</span>
                      <span className="font-mono text-[9px] text-[#94A3B8]">{p.composition}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#EF4444] font-bold">LOAD →</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 2. RADIATION SHIELDING EXPERIMENT */}
      {activeSubExperiment === 'radiation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Interactive Shielding Raytracer Viewport */}
          <GlassCard
            variant="elevated"
            className="lg:col-span-2 relative aspect-[16/10] min-h-[400px] p-6 flex flex-col justify-between border-white/10 bg-[#040814]"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#A78BFA]" />
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  SPACE IONIZING RADIATION SHIELDING BENCH // {radiationSource} SOURCE
                </span>
              </div>
              <TelemetryBadge
                label={`ATTENUATION: ${absorbedPct}%`}
                tone={absorbedPct > 65 ? 'emerald' : 'amber'}
                size="sm"
              />
            </div>

            {/* Visual Particle Penetration Tunnel */}
            <div className="relative flex-1 flex items-center justify-center my-6">
              <div className="relative w-full max-w-lg h-36 rounded-2xl border border-white/10 bg-[#070D1F] flex items-center justify-between px-6 overflow-hidden">
                {/* Incoming Radiation Stream */}
                <div className="flex flex-col items-center">
                  <Radio className="h-8 w-8 text-[#EF4444] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#EF4444] font-bold mt-1">
                    {radiationSource} FLUX ({baseDose} {unit})
                  </span>
                </div>

                {/* Material Barrier Slab */}
                <div
                  className="h-28 rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all duration-300"
                  style={{
                    width: `${Math.max(24, shieldThicknessMm * 1.8)}px`,
                    backgroundColor: `${selectedMaterial.color}25`,
                    borderColor: selectedMaterial.color,
                  }}
                >
                  <span className="font-mono text-[9px] font-bold text-[#F8FAFC]">
                    {shieldThicknessMm} mm
                  </span>
                  <span className="font-sans text-[8px] text-[#CBD5E1] truncate">
                    {selectedMaterial.name.split(' ')[0]}
                  </span>
                </div>

                {/* Transmitted Protected Crew Compartment */}
                <div className="flex flex-col items-center">
                  <Shield className="h-8 w-8 text-[#10B981]" />
                  <span className="font-mono text-[9px] text-[#10B981] font-bold mt-1">
                    TRANSMITTED: {transmittedDose} {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Readout Footer */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-3 font-mono text-xs gap-3">
              <div>
                <span className="text-[#94A3B8]">Dose Reduction: </span>
                <strong className="text-[#10B981]">{absorbedPct}% absorbed</strong>
              </div>
              <div>
                <span className="text-[#94A3B8]">Hydrogen Mass Fraction: </span>
                <strong className="text-[#38BDF8]">{selectedMaterial.hydrogenContentPct}% H</strong>
              </div>
            </div>
          </GlassCard>

          {/* Shield Material & Thickness Controls */}
          <div className="flex flex-col gap-4">
            <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                RADIATION MITIGATION CONTROLS
              </span>

              {/* Source Selector */}
              <div className="flex items-center gap-2">
                {(['SPE', 'GCR'] as const).map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setRadiationSource(src)}
                    className={`flex-1 py-1.5 rounded-lg border font-mono text-xs transition-colors ${
                      radiationSource === src
                        ? 'border-[#A78BFA] bg-[#A78BFA]/20 text-[#F8FAFC] font-bold'
                        : 'border-white/5 bg-[#0B1528] text-[#94A3B8]'
                    }`}
                  >
                    {src === 'SPE' ? 'Solar Proton Storm' : 'Galactic Cosmic Rays'}
                  </button>
                ))}
              </div>

              {/* Material Selector */}
              <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
                <span className="font-mono text-[11px] text-[#94A3B8]">Shielding Material:</span>
                <div className="flex flex-col gap-1.5">
                  {RADIATION_MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setSelectedMaterialId(mat.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        selectedMaterial.id === mat.id
                          ? 'border-[#A78BFA] bg-[#A78BFA]/15 shadow-sm'
                          : 'border-white/5 bg-[#0B1528]/50 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: mat.color }} />
                        <span className="font-sans text-xs font-bold text-[#F8FAFC]">{mat.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#38BDF8]">
                        {mat.densityGcm3} g/cm³
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Thickness Slider */}
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Shield Thickness:</span>
                  <span className="font-bold text-[#A78BFA]">{shieldThicknessMm} mm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={shieldThicknessMm}
                  onChange={(e) => setShieldThicknessMm(parseInt(e.target.value, 10))}
                  className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#A78BFA] cursor-pointer"
                />
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-4 border-white/10">
              <span className="font-mono text-[10px] text-[#10B981] font-bold block mb-1">
                HYDROGEN RADIOPROTECTION:
              </span>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Light elements like Hydrogen have identical mass to incoming cosmic protons, absorbing kinetic momentum efficiently without triggering hazardous secondary nuclear fragmentation.
              </p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 3. VACUUM VS ATMOSPHERIC DRAG EXPERIMENT */}
      {activeSubExperiment === 'drag' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Dual Drop Shaft */}
          <GlassCard
            variant="elevated"
            className="lg:col-span-2 relative aspect-[16/10] min-h-[400px] p-6 flex flex-col justify-between border-white/10 bg-[#040814]"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-[#38BDF8]" />
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  DUAL TOWER: VACUUM (LEFT) VS {dragWorld.toUpperCase()} ATMOSPHERE (RIGHT)
                </span>
              </div>
              <TelemetryBadge label={`HEIGHT: ${dropHeightM}m`} tone="cyan" size="sm" />
            </div>

            {/* Twin Drop Shafts */}
            <div className="relative flex-1 flex items-center justify-center gap-12 my-4">
              {/* Shaft 1: Vacuum */}
              <div className="relative h-full w-24 rounded-2xl border border-cyan-500/30 bg-[#070D1F] flex flex-col justify-between p-2 shadow-inner">
                <span className="font-mono text-[9px] text-[#38BDF8] text-center font-bold">PURE VACUUM</span>
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#38BDF8] shadow-[0_0_16px_#38BDF8]"
                  style={{ top: `${Math.min(90, 10 + ball1Y * 0.8)}%` }}
                >
                  <span className="font-mono text-[8px] font-bold text-[#030611]">1 kg</span>
                </div>
                <div className="h-1.5 w-full rounded bg-cyan-400" />
              </div>

              {/* Shaft 2: Atmosphere */}
              <div className="relative h-full w-24 rounded-2xl border border-amber-500/30 bg-[#070D1F] flex flex-col justify-between p-2 shadow-inner">
                <span className="font-mono text-[9px] text-[#F59E0B] text-center font-bold">
                  {dragWorld.toUpperCase()}
                </span>
                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B] shadow-[0_0_16px_#F59E0B]"
                  style={{ top: `${Math.min(90, 10 + ball2Y * 0.8)}%` }}
                >
                  <span className="font-mono text-[8px] font-bold text-[#030611]">1 kg</span>
                </div>
                <div className="h-1.5 w-full rounded bg-amber-400" />
              </div>
            </div>

            {/* Controls Footer */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-3 gap-3">
              <div className="font-mono text-xs flex items-center gap-4">
                <span>Vacuum Time: <strong className="text-[#38BDF8]">{fallTimeVac ? `${fallTimeVac.toFixed(3)}s` : '--'}</strong></span>
                <span>Atmospheric Time: <strong className="text-[#F59E0B]">{fallTimeAtm ? `${fallTimeAtm.toFixed(3)}s` : '--'}</strong></span>
              </div>

              <SpaceButton
                variant="primary"
                size="sm"
                icon={Play}
                disabled={isDropping}
                onClick={handleStartDrop}
              >
                RELEASE DUAL MASSES
              </SpaceButton>
            </div>
          </GlassCard>

          {/* World Selection */}
          <div className="flex flex-col gap-4">
            <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-4">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                SELECT ATMOSPHERIC DENSITY
              </span>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'earth' as const, name: 'Earth Atmosphere (1.225 kg/m³)', desc: 'Standard aerodynamic drag' },
                  { id: 'mars' as const, name: 'Mars Atmosphere (0.020 kg/m³)', desc: 'Thin CO₂ drag' },
                  { id: 'vacuum' as const, name: 'Deep Space Vacuum (0.000 kg/m³)', desc: 'Zero drag Galileo test' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setDragWorld(w.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      dragWorld === w.id
                        ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-sm'
                        : 'border-white/5 bg-[#0B1528]/50 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-sans text-xs font-bold text-[#F8FAFC] block">{w.name}</span>
                    <span className="font-mono text-[9.5px] text-[#94A3B8]">{w.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">Tower Height:</span>
                  <span className="font-bold text-[#F8FAFC]">{dropHeightM} meters</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="200"
                  step="25"
                  value={dropHeightM}
                  onChange={(e) => setDropHeightM(parseInt(e.target.value, 10))}
                  className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#38BDF8] cursor-pointer"
                />
              </div>
            </GlassCard>

            <GlassCard variant="elevated" className="p-4 border-white/10">
              <span className="font-mono text-[10px] text-[#38BDF8] font-bold block mb-1">
                QUADRATIC DRAG FORMULA:
              </span>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Drag force F_d = ½ ρ v² C_d A opposes gravitational fall. In vacuum (ρ = 0), acceleration is purely g, verifying Apollo 15’s hammer-and-feather demonstration on the Moon.
              </p>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

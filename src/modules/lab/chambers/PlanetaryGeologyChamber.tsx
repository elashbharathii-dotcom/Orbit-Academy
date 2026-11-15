import React, { useState } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import {
  PLANETARY_GEOLOGY_DATA,
  PlanetaryGeologyProfile,
  GeologicalLayer,
} from '../labData';
import {
  Globe2,
  Layers,
  Wind,
  ArrowRightLeft,
  Compass,
} from 'lucide-react';

interface PlanetaryGeologyChamberProps {
  onLogTelemetry: (msg: string) => void;
  onMilestoneAchieved: (milestoneId: string) => void;
}

export const PlanetaryGeologyChamber: React.FC<PlanetaryGeologyChamberProps> = ({
  onLogTelemetry,
  onMilestoneAchieved,
}) => {
  // Active Primary Planet
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [comparePlanetId, setComparePlanetId] = useState<string>('mars');
  const [activeLayer, setActiveLayer] = useState<GeologicalLayer | null>(null);

  const currentPlanet =
    PLANETARY_GEOLOGY_DATA.find((p) => p.id === selectedPlanetId) ||
    PLANETARY_GEOLOGY_DATA[0];

  const comparePlanet =
    PLANETARY_GEOLOGY_DATA.find((p) => p.id === comparePlanetId) ||
    PLANETARY_GEOLOGY_DATA[1];

  // Set default active layer
  const displayLayer = activeLayer || currentPlanet.layers[0];

  const handleSelectPlanet = (planet: PlanetaryGeologyProfile) => {
    setSelectedPlanetId(planet.id);
    setActiveLayer(planet.layers[0]);
    onLogTelemetry(`GEOLOGY_CHAMBER: Loaded planetary interior core scan for ${planet.name}`);

    if (planet.id === 'venus') {
      onMilestoneAchieved('geology-compare');
    }
    if (planet.id === 'mars') {
      onMilestoneAchieved('geology-core');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      {/* Planet Selection Strip */}
      <GlassCard variant="elevated" className="p-3 border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-[#10B981]" />
          <span className="font-mono text-xs font-bold text-[#F8FAFC]">
            SELECT TERRESTRIAL BODY:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PLANETARY_GEOLOGY_DATA.map((p) => {
            const isSelected = p.id === selectedPlanetId;
            return (
              <button
                key={p.id}
                type="button"
                data-geology-planet={p.id}
                onClick={() => handleSelectPlanet(p)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all ${
                  isSelected
                    ? 'border border-[#10B981] bg-[#10B981]/15 font-bold text-[#F8FAFC] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border border-transparent bg-white/[0.02] text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.accentColor }} />
                <span>{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Main Geology Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stratigraphic Cutaway & Atmospheric Composition */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stratigraphic Interior Cutaway Card */}
          <GlassCard variant="elevated" className="p-6 border-white/10 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#38BDF8]" />
                <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
                  {currentPlanet.name} // Interior Stratigraphy & Core Layers
                </h3>
              </div>

              <TelemetryBadge
                label={currentPlanet.type.toUpperCase()}
                tone="emerald"
                size="sm"
              />
            </div>

            {/* Interactive Visual Stratigraphy Slices */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10.5px] text-[#94A3B8]">
                Click layer to inspect geological composition, state of matter, and temperature:
              </span>

              <div className="flex flex-col gap-2.5">
                {currentPlanet.layers.map((layer, idx) => {
                  const isSelected = displayLayer.name === layer.name;
                  return (
                    <div
                      key={layer.name}
                      onClick={() => setActiveLayer(layer)}
                      className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#38BDF8] bg-[#38BDF8]/15 shadow-md'
                          : 'border-white/5 bg-[#0B1528]/50 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold text-[#030611] shadow-sm"
                          style={{ backgroundColor: layer.color }}
                        >
                          L{idx + 1}
                        </span>

                        <div className="flex flex-col">
                          <span className="font-sans text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                            {layer.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#94A3B8]">
                            Depth: {layer.depthKm} • State: <strong className="text-[#CBD5E1]">{layer.state}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                        <span className="text-[#F59E0B] font-semibold">{layer.tempK}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            isSelected ? 'bg-[#38BDF8] text-[#030611]' : 'bg-white/5 text-[#94A3B8]'
                          }`}
                        >
                          {isSelected ? 'INSPECTING' : 'VIEW'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Layer Telemetry Dossier */}
            <div className="rounded-xl border border-cyan-500/20 bg-[#07132B]/80 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#38BDF8] font-bold">
                  {displayLayer.name.toUpperCase()} SPECIFICATION
                </span>
                <span className="font-mono text-[10.5px] text-[#CBD5E1]">
                  Depth: {displayLayer.depthKm}
                </span>
              </div>
              <p className="font-sans text-xs text-[#F8FAFC] leading-relaxed">
                <strong className="text-[#F59E0B]">Mineral Composition: </strong>
                {displayLayer.composition}
              </p>
              <div className="flex flex-wrap gap-4 font-mono text-[10.5px] text-[#94A3B8] border-t border-white/5 pt-2">
                <span>Thermal Range: <strong className="text-[#F8FAFC]">{displayLayer.tempK}</strong></span>
                <span>Physical State: <strong className="text-[#10B981]">{displayLayer.state}</strong></span>
              </div>
            </div>
          </GlassCard>

          {/* Atmospheric Gas Composition Card */}
          <GlassCard variant="elevated" className="p-6 border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-[#38BDF8]" />
                <h3 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC]">
                  Atmospheric Spectral Breakdown
                </h3>
              </div>

              <TelemetryBadge
                label={`P₀ = ${currentPlanet.surfacePressureBar} BAR`}
                tone={currentPlanet.surfacePressureBar > 10 ? 'amber' : 'cyan'}
                size="sm"
              />
            </div>

            {/* Gas Composition Bar */}
            <div className="flex flex-col gap-2">
              <div className="h-6 w-full rounded-xl overflow-hidden flex border border-white/10 bg-[#070C1B]">
                {currentPlanet.atmosphere.map((gas) => (
                  <div
                    key={gas.name}
                    style={{
                      width: `${Math.max(2, gas.pct)}%`,
                      backgroundColor: gas.color,
                    }}
                    title={`${gas.name} (${gas.formula}): ${gas.pct}%`}
                    className="h-full transition-all duration-500"
                  />
                ))}
              </div>

              {/* Gas Legend Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {currentPlanet.atmosphere.map((gas) => (
                  <div
                    key={gas.name}
                    className="flex items-center gap-2 p-2 rounded-lg border border-white/5 bg-[#0B1528]/50 font-mono text-xs"
                  >
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: gas.color }}
                    />
                    <div className="flex flex-col truncate">
                      <span className="text-[#F8FAFC] font-bold truncate">
                        {gas.formula} ({gas.pct}%)
                      </span>
                      <span className="text-[9.5px] text-[#94A3B8] truncate">{gas.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Planetary Geophysical Metrics & Comparative Bench */}
        <div className="flex flex-col gap-5">
          {/* Planetary Key Metrics Card */}
          <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-[#F8FAFC]">GEOPHYSICAL METRICS</span>
              <TelemetryBadge label={currentPlanet.name.split(' ')[0]} tone="emerald" size="sm" />
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.03]">
              <span className="text-[#94A3B8]">Surface Gravity (g):</span>
              <strong className="text-[#38BDF8]">{currentPlanet.surfaceGravity} m/s²</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.03]">
              <span className="text-[#94A3B8]">Mean Surface Temp:</span>
              <strong className="text-[#F59E0B]">
                {currentPlanet.surfaceTempKelvin.mean} K ({(currentPlanet.surfaceTempKelvin.mean - 273.15).toFixed(0)}°C)
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.03]">
              <span className="text-[#94A3B8]">Mean Bulk Density:</span>
              <strong className="text-[#F8FAFC]">{currentPlanet.densityGcm3} g/cm³</strong>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.03]">
              <span className="text-[#94A3B8]">Planetary Radius:</span>
              <strong className="text-[#F8FAFC]">{currentPlanet.radiusKm.toLocaleString()} km</strong>
            </div>

            <div className="flex flex-col gap-1 py-1 border-b border-white/[0.03]">
              <span className="text-[#94A3B8]">Magnetic Dynamo:</span>
              <span className="text-[#10B981] font-sans text-xs">{currentPlanet.magneticDynamo}</span>
            </div>

            <div className="flex flex-col gap-1 py-1">
              <span className="text-[#94A3B8]">Tectonic Regime:</span>
              <span className="text-[#CBD5E1] font-sans text-xs">{currentPlanet.tectonics}</span>
            </div>
          </GlassCard>

          {/* Comparative Bench: World A vs World B */}
          <GlassCard variant="elevated" className="p-5 border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F59E0B]">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>COMPARATIVE BENCH</span>
              </div>
              <span className="font-mono text-[9px] text-[#94A3B8]">SIDE-BY-SIDE</span>
            </div>

            <div className="flex items-center justify-between gap-2 font-mono text-xs">
              <span className="text-[#38BDF8] font-bold">{currentPlanet.name.split(' ')[0]}</span>
              <span className="text-[#64748B]">vs</span>
              <select
                value={comparePlanetId}
                onChange={(e) => setComparePlanetId(e.target.value)}
                className="h-7 rounded-lg border border-white/10 bg-[#070C1B] px-2 font-mono text-xs text-[#F59E0B] focus:outline-none focus:border-[#F59E0B]"
              >
                {PLANETARY_GEOLOGY_DATA.filter((p) => p.id !== currentPlanet.id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            {/* Comparison Metrics */}
            <div className="flex flex-col gap-2 font-mono text-xs border-t border-white/5 pt-2">
              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Gravity Ratio:</span>
                <span className="text-[#F8FAFC]">
                  {(currentPlanet.surfaceGravity / comparePlanet.surfaceGravity).toFixed(2)}x
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/[0.03]">
                <span className="text-[#94A3B8]">Atm Pressure:</span>
                <span className="text-[#38BDF8]">
                  {currentPlanet.surfacePressureBar} bar vs {comparePlanet.surfacePressureBar} bar
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Mean Temp:</span>
                <span className="text-[#F59E0B]">
                  {currentPlanet.surfaceTempKelvin.mean} K vs {comparePlanet.surfaceTempKelvin.mean} K
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Geological Notable Features */}
          <GlassCard variant="elevated" className="p-4 border-white/10">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#10B981] font-bold mb-2">
              <Compass className="h-3.5 w-3.5" />
              <span>NOTABLE GEOLOGICAL LANDMARKS</span>
            </div>
            <ul className="space-y-1.5 font-sans text-xs text-[#94A3B8]">
              {currentPlanet.notableFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

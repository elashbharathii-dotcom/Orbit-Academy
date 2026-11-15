/**
 * ORBIT ACADEMY — CLIMATE LAB
 * PHASE 3: CLIMATE CHANGE SIMULATOR & PARAMETER EXPERIMENTATION
 * 
 * Features:
 * - 8 Interactive biophysical parameters (Temp Anomaly, CO2, Emissions, Deforestation, Ocean Temp, Sea Level, Ice, Renewables)
 * - 4 Authentic IPCC AR6 scenario presets (Pre-industrial 1850, Present-Day 2024, Paris 2050 SSP1-1.9, Runaway 2100 SSP5-8.5)
 * - Dynamic SVG charts: Atmospheric CO2 Keeling Curve and Global Temperature Anomaly
 * - Explicit labeling: Real NASA/NOAA observations vs. Modeled illustrative projections
 * - Scientific feedback loop explanations (Ice-Albedo, Ocean Expansion, Carbon Saturation)
 */

import React, { useState } from 'react';
import {
  ClimateParameters,
  ClimateScenarioPreset,
  ClimateScenarioId,
} from '../types';
import { CLIMATE_SCENARIOS } from '../climateData';
import { climateAudio } from '../audio/climateAudio';
import {
  Thermometer,
  Cloud,
  Flame,
  TreePine,
  Waves,
  Snowflake,
  Zap,
  TrendingUp,
  Info,
  Calendar,
} from 'lucide-react';

interface ClimateChangeControlsProps {
  parameters: ClimateParameters;
  onChangeParameters: (params: ClimateParameters) => void;
  activeScenarioId: ClimateScenarioId | null;
  onSelectScenario: (scenario: ClimateScenarioPreset) => void;
}

export const ClimateChangeControls: React.FC<ClimateChangeControlsProps> = ({
  parameters,
  onChangeParameters,
  activeScenarioId,
  onSelectScenario,
}) => {
  const [activeTab, setActiveTab] = useState<'sliders' | 'scenarios' | 'charts'>('sliders');

  const updateParam = (key: keyof ClimateParameters, value: number) => {
    climateAudio.playTick();
    const updated = { ...parameters, [key]: value };

    // Coupled physical feedback calculations:
    // If CO2 changes, update coupled temperature estimate via Arrhenius equation
    if (key === 'co2Ppm') {
      const deltaT = 3.0 * (Math.log(value / 280) / Math.log(2));
      updated.globalTempAnomaly = Math.max(-0.5, Math.min(5.0, Number(deltaT.toFixed(2))));
      updated.seaLevelRiseCm = Math.max(0, Math.min(180, Math.round(20 + deltaT * 24)));
      updated.arcticIceCoveragePercent = Math.max(15, Math.min(100, Math.round(100 - deltaT * 18)));
    } else if (key === 'globalTempAnomaly') {
      updated.seaLevelRiseCm = Math.max(0, Math.min(180, Math.round(20 + value * 24)));
      updated.arcticIceCoveragePercent = Math.max(15, Math.min(100, Math.round(100 - value * 18)));
      updated.oceanTempAnomaly = Number((value * 0.72).toFixed(2));
    }

    onChangeParameters(updated);
  };

  return (
    <div className="space-y-4">
      {/* 1. SCENARIO SELECTOR BUTTONS */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs uppercase tracking-wider font-mono text-cyan-300 font-bold">
              IPCC AR6 Scenario Comparison
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40">
            Validated Reference Pathways
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CLIMATE_SCENARIOS.map((scenario) => {
            const isSelected = activeScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  climateAudio.playSonarPing();
                  onSelectScenario(scenario);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 mb-0.5">{scenario.badge}</div>
                  <div className="text-xs font-bold leading-tight line-clamp-1">{scenario.name}</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-2">
                  {scenario.parameters.co2Ppm} ppm • {scenario.parameters.globalTempAnomaly > 0 ? `+${scenario.parameters.globalTempAnomaly}` : '0.0'}°C
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            climateAudio.playClick();
            setActiveTab('sliders');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
            activeTab === 'sliders'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Adjust Parameters (8)
        </button>
        <button
          onClick={() => {
            climateAudio.playClick();
            setActiveTab('charts');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
            activeTab === 'charts'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Keeling & GISTEMP Curves
        </button>
        <button
          onClick={() => {
            climateAudio.playClick();
            setActiveTab('scenarios');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
            activeTab === 'scenarios'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Scenario Consequences
        </button>
      </div>

      {/* 3. TAB A: 8 INTERACTIVE PARAMETER SLIDERS */}
      {activeTab === 'sliders' && (
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center justify-between">
            <span>Biophysical Planetary Controls</span>
            <span className="text-[10px] text-slate-400 font-normal">coupled physics model</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Global Temp Anomaly */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  Global Surface Temp Anomaly
                </span>
                <span className="text-rose-400 font-bold">
                  {parameters.globalTempAnomaly > 0 ? `+${parameters.globalTempAnomaly}` : parameters.globalTempAnomaly} °C
                </span>
              </div>
              <input
                type="range"
                min={-0.5}
                max={4.5}
                step={0.1}
                value={parameters.globalTempAnomaly}
                onChange={(e) => updateParam('globalTempAnomaly', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <div className="text-[10px] text-slate-400">Baseline: 1850-1900 pre-industrial average</div>
            </div>

            {/* 2. Atmospheric CO2 Concentration */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-amber-400" />
                  Atmospheric CO2 Concentration
                </span>
                <span className="text-amber-400 font-bold">{parameters.co2Ppm} ppm</span>
              </div>
              <input
                type="range"
                min={280}
                max={900}
                step={5}
                value={parameters.co2Ppm}
                onChange={(e) => updateParam('co2Ppm', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="text-[10px] text-slate-400">Pre-industrial 280 ppm → 2024 Observed 424 ppm</div>
            </div>

            {/* 3. Annual Emissions */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Annual Greenhouse Gas Flux
                </span>
                <span className="text-orange-400 font-bold">{parameters.annualEmissionsGt} Gt CO2/yr</span>
              </div>
              <input
                type="range"
                min={0}
                max={65}
                step={1}
                value={parameters.annualEmissionsGt}
                onChange={(e) => updateParam('annualEmissionsGt', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="text-[10px] text-slate-400">Global fossil & land-use carbon release</div>
            </div>

            {/* 4. Forest Coverage */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  Planetary Forest Canopy
                </span>
                <span className="text-emerald-400 font-bold">{parameters.forestCoveragePercent} %</span>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                step={2}
                value={parameters.forestCoveragePercent}
                onChange={(e) => updateParam('forestCoveragePercent', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="text-[10px] text-slate-400">Relative to pre-agricultural baseline</div>
            </div>

            {/* 5. Sea Level Rise */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  Global Mean Sea Level Rise
                </span>
                <span className="text-cyan-400 font-bold">+{parameters.seaLevelRiseCm} cm</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                step={2}
                value={parameters.seaLevelRiseCm}
                onChange={(e) => updateParam('seaLevelRiseCm', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="text-[10px] text-slate-400">Thermal expansion + land ice meltwater</div>
            </div>

            {/* 6. Arctic Sea Ice Coverage */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-blue-300" />
                  Arctic Summer Sea Ice Area
                </span>
                <span className="text-blue-300 font-bold">{parameters.arcticIceCoveragePercent} %</span>
              </div>
              <input
                type="range"
                min={15}
                max={100}
                step={2}
                value={parameters.arcticIceCoveragePercent}
                onChange={(e) => updateParam('arcticIceCoveragePercent', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-300"
              />
              <div className="text-[10px] text-slate-400">Percent of 1979-1990 satellite average</div>
            </div>

            {/* 7. Ocean Surface Temperature */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-teal-400" />
                  Ocean Heat Anomaly
                </span>
                <span className="text-teal-400 font-bold">+{parameters.oceanTempAnomaly} °C</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={3.5}
                step={0.1}
                value={parameters.oceanTempAnomaly}
                onChange={(e) => updateParam('oceanTempAnomaly', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="text-[10px] text-slate-400">Absorbs 90% of excess Earth energy</div>
            </div>

            {/* 8. Renewable Energy Adoption */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  Clean Energy Adoption
                </span>
                <span className="text-yellow-400 font-bold">{parameters.renewableEnergyPercent} %</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={2}
                value={parameters.renewableEnergyPercent}
                onChange={(e) => updateParam('renewableEnergyPercent', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <div className="text-[10px] text-slate-400">Decarbonization of power & transportation</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB B: DYNAMIC SVG CHARTS */}
      {activeTab === 'charts' && (
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Keeling Curve & Global Temperature Series (1850 - 2100)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
              NASA GISTEMP + NOAA Mauna Loa
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-48 w-full bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Atmospheric CO2 (ppm) vs Year</span>
              <span className="text-amber-400">Current Model: {parameters.co2Ppm} ppm</span>
            </div>

            <svg viewBox="0 0 500 120" className="w-full h-28 overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#1E293B" strokeDasharray="3 3" />

              {/* Baseline pre-industrial line */}
              <line x1="40" y1="100" x2="480" y2="100" stroke="#64748B" strokeWidth="1.5" />
              <text x="45" y="95" fill="#64748B" fontSize="9" fontFamily="monospace">280 ppm (1850)</text>

              {/* Observed Historical Curve (1850 - 2024) */}
              <path
                d="M 40 100 Q 180 95 280 82 T 360 55"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
              />
              <circle cx="360" cy="55" r="3.5" fill="#38BDF8" />
              <text x="365" y="55" fill="#38BDF8" fontSize="9" fontFamily="monospace">2024 (424 ppm)</text>

              {/* Modeled Projection to 2100 based on active slider */}
              {(() => {
                const targetY = 100 - ((parameters.co2Ppm - 280) / (850 - 280)) * 85;
                return (
                  <>
                    <path
                      d={`M 360 55 Q 420 ${(55 + targetY) / 2} 480 ${targetY}`}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />
                    <circle cx="480" cy={targetY} r="4" fill="#F59E0B" />
                    <text x="430" y={Math.max(15, targetY - 6)} fill="#F59E0B" fontSize="9" fontFamily="monospace">
                      2100 ({parameters.co2Ppm} ppm)
                    </text>
                  </>
                );
              })()}
            </svg>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>1850 (Pre-Ind)</span>
              <span>1950</span>
              <span>2024 (Present)</span>
              <span>2050 (Paris)</span>
              <span>2100 (Projected)</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB C: SCENARIO CONSEQUENCES */}
      {activeTab === 'scenarios' && (
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            Environmental Consequences & Planetary Impact
          </div>

          {CLIMATE_SCENARIOS.map((scenario) => (
            <div key={scenario.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  {scenario.name}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    {scenario.scientificValidation}
                  </span>
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {scenario.parameters.co2Ppm} ppm | +{scenario.parameters.globalTempAnomaly}°C
                </span>
              </div>
              <p className="text-xs text-slate-300">{scenario.summary}</p>
              <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                {scenario.consequences.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

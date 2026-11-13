import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Thermometer, Wind, AlertTriangle, Flame } from 'lucide-react';

export const VenusClimateScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('venus');

  // Slider state for atmospheric CO2 fraction (0.04% to 96.5%)
  const [co2Percent, setCo2Percent] = useState<number>(96.5);

  // Compute physical runaway greenhouse properties
  const tFraction = co2Percent / 96.5;
  const surfaceTempC = Math.round(15 + tFraction * 449);
  const pressureBar = (1.0 + tFraction * 91.0).toFixed(1);
  const isLeadMelting = surfaceTempC >= 327;
  const isSupercritical = parseFloat(pressureBar) >= 73.8;

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Lab Header Banner */}
        <div className="rounded-2xl border border-[#EAB308]/30 bg-gradient-to-r from-[#1A1408] via-[#0A0F1D] to-[#261E0A] p-6 shadow-xl backdrop-blur-md">
          <span className="font-mono text-xs uppercase tracking-widest text-[#EAB308]">
            ATMOSPHERIC EXPERIMENTAL STATION
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Venus Climate & Runaway Greenhouse Simulator
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-[#CBD5E1] max-w-2xl leading-relaxed">
            Investigate how a massive carbon dioxide atmosphere traps thermal infrared radiation, 
            driving surface temperatures high enough to melt metallic lead (327°C) and generating pressures equivalent to 900 meters deep in Earth's ocean.
          </p>
        </div>

        {/* Interactive Simulation Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Atmospheric Controls */}
          <div className="lg:col-span-1 flex flex-col gap-5 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Atmospheric Mix Controller
            </h3>

            {/* CO2 Concentration Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Carbon Dioxide (CO₂)</span>
                <span className="font-bold text-[#EAB308]">{co2Percent}%</span>
              </div>
              <input
                type="range"
                min="0.04"
                max="96.5"
                step="0.5"
                value={co2Percent}
                onChange={(e) => setCo2Percent(parseFloat(e.target.value))}
                aria-label="Carbon dioxide concentration percentage"
                className="h-2 w-full appearance-none rounded-lg bg-[#11182E] accent-[#EAB308] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
                <span>Earth Level (0.04%)</span>
                <span>Venus Level (96.5%)</span>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8]">
                Atmospheric Presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCo2Percent(0.04)}
                  className="rounded-xl border border-[rgba(148,163,184,0.15)] bg-[#11182E] p-2 font-mono text-xs text-[#38BDF8] hover:border-[#38BDF8]"
                >
                  Earth Equivalent
                </button>
                <button
                  type="button"
                  onClick={() => setCo2Percent(96.5)}
                  className="rounded-xl border border-[#EAB308] bg-[#EAB308]/15 p-2 font-mono text-xs font-bold text-[#EAB308]"
                >
                  Authentic Venus
                </button>
              </div>
            </div>

            {/* Critical Phase Warnings */}
            <div className="mt-auto flex flex-col gap-2">
              {isLeadMelting && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-400">
                  <Flame className="h-4 w-4 shrink-0 text-red-400" />
                  <span>Lead Melting Point Exceeded (&gt;327°C)</span>
                </div>
              )}
              {isSupercritical && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Supercritical Fluid Phase Transition</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Telemetry Gauges */}
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Simulated Surface Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Temperature Gauge */}
              <div className="flex flex-col gap-2 rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#94A3B8]">Surface Temperature</span>
                  <Thermometer className="h-4 w-4 text-[#EAB308]" />
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#EAB308]">
                  {surfaceTempC}°C
                </div>
                <span className="font-mono text-[11px] text-[#CBD5E1]">
                  Hotter than Mercury despite receiving only 25% of Mercury's solar flux.
                </span>
              </div>

              {/* Surface Pressure Gauge */}
              <div className="flex flex-col gap-2 rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#94A3B8]">Atmospheric Pressure</span>
                  <Wind className="h-4 w-4 text-[#38BDF8]" />
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#38BDF8]">
                  {pressureBar} bar
                </div>
                <span className="font-mono text-[11px] text-[#CBD5E1]">
                  Equivalent to the crushing hydrostatic pressure 900 meters under ocean water.
                </span>
              </div>
            </div>

            {/* Cloud Deck & Ray Tracing Diagram */}
            <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#11182E]/50 p-5">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Atmospheric Profile (Sulfuric Acid Clouds H₂SO₄)
              </span>
              <div className="mt-3 flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between rounded-lg bg-[#0A0F1D] px-3 py-2">
                  <span className="text-[#EAB308]">Upper Cloud Layer (50–70 km)</span>
                  <span className="text-[#F8FAFC]">Fast 360 km/h Super-Rotating Jet Stream</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#0A0F1D] px-3 py-2">
                  <span className="text-[#CBD5E1]">Middle Haze (30–50 km)</span>
                  <span className="text-[#94A3B8]">Concentrated Sulfuric Acid Droplets</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#0A0F1D] px-3 py-2">
                  <span className="text-[#EF4444]">Surface Boundary (0–10 km)</span>
                  <span className="text-[#EF4444]">Supercritical CO₂ Fluid Sluggish Wind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};

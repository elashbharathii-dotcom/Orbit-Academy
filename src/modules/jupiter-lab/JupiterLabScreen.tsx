import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Zap } from 'lucide-react';

export const JupiterLabScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('jupiter');

  // Great Red Spot vortex speed multiplier
  const [vortexSpeed, setVortexSpeed] = useState<number>(432); // 432 km/h

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Lab Header */}
        <div className="rounded-2xl border border-[#F97316]/30 bg-gradient-to-r from-[#200D04] via-[#0A0F1D] to-[#1A0A02] p-6 shadow-xl backdrop-blur-md">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F97316]">
            JOVIAN FLUID MECHANICS & MAGNETOSPHERES
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Jupiter Planetary Science & Anticyclone Lab
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-[#CBD5E1] max-w-2xl leading-relaxed">
            Examine the fluid dynamics of the Solar System's largest planet. 
            Jupiter's rapid 9.93-hour axial rotation shears its atmosphere into counter-rotating zonal jet bands 
            and fuels the centuries-old anticyclonic superstorm: the Great Red Spot.
          </p>
        </div>

        {/* Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Great Red Spot Vortex Controller */}
          <div className="lg:col-span-1 flex flex-col gap-5 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Great Red Spot Vortex Dynamics
            </h3>

            {/* Vortex Speed Scrubber */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Anticyclonic Wind Speed</span>
                <span className="font-bold text-[#F97316]">{vortexSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="200"
                max="680"
                step="10"
                value={vortexSpeed}
                onChange={(e) => setVortexSpeed(parseInt(e.target.value, 10))}
                aria-label="Anticyclone vortex wind speed in km/h"
                className="h-2 w-full appearance-none rounded-lg bg-[#11182E] accent-[#F97316] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
                <span>Calmer Haze (200 km/h)</span>
                <span>Peak Vortex (680 km/h)</span>
              </div>
            </div>

            {/* Simulated Vortex Visualizer */}
            <div className="relative h-40 w-full rounded-xl overflow-hidden border border-[#F97316]/30 bg-[#0F0804] flex items-center justify-center">
              <div
                className="h-28 w-28 rounded-full border-2 border-dashed border-[#F97316] opacity-75 animate-spin"
                style={{ animationDuration: `${Math.max(1, (700 - vortexSpeed) / 100)}s` }}
              />
              <div
                className="absolute h-16 w-16 rounded-full bg-[#EA580C]/40 blur-sm animate-pulse"
              />
              <span className="relative z-10 font-mono text-[11px] font-bold text-[#F8FAFC]">
                {vortexSpeed} km/h
              </span>
            </div>

            <p className="font-mono text-[10px] text-[#94A3B8]">
              The Great Red Spot is larger than Earth (16,000+ km diameter) and reaches depths exceeding 300 km beneath the cloud tops.
            </p>
          </div>

          {/* Galilean Moons Orbital Resonance Station */}
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Laplace Orbital Resonance: Galilean Moons
            </h3>

            <p className="font-sans text-xs text-[#CBD5E1]">
              For every 1 orbit of Ganymede, Europa completes exactly 2 orbits, and Io completes exactly 4 orbits (4:2:1 resonance). 
              This gravitational tidal pumping continuously kneads Io’s core, producing over 400 active volcanoes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
              {[
                { name: 'Io', ratio: '4 orbits', period: '1.77 days', note: 'Most volcanic body in Solar System', color: '#FBBF24' },
                { name: 'Europa', ratio: '2 orbits', period: '3.55 days', note: 'Global subsurface liquid water ocean', color: '#38BDF8' },
                { name: 'Ganymede', ratio: '1 orbit', period: '7.15 days', note: 'Largest moon; has own magnetic field', color: '#94A3B8' },
                { name: 'Callisto', ratio: 'Non-resonant', period: '16.69 days', note: 'Most heavily cratered surface', color: '#64748B' },
              ].map((moon) => (
                <div key={moon.name} className="flex flex-col gap-1.5 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: moon.color }} />
                    <span className="font-bold text-xs text-[#F8FAFC]">{moon.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold" style={{ color: moon.color }}>
                    {moon.ratio}
                  </span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">{moon.period}</span>
                  <span className="font-sans text-[11px] text-[#CBD5E1] mt-auto pt-1">{moon.note}</span>
                </div>
              ))}
            </div>

            {/* Jovian Magnetosphere Readout */}
            <div className="rounded-xl border border-[#F97316]/25 bg-[#F97316]/10 p-4 mt-auto">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#F97316]" />
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  Massive Jovian Magnetosphere: 20,000× Earth's Field
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-[#CBD5E1]">
                Driven by metallic liquid hydrogen churning inside the deep interior, Jupiter's magnetic tail extends past the orbit of Saturn (over 650 million km).
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};

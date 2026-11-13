import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { Gauge, Thermometer } from 'lucide-react';

export const SolarExplorerScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('mercury');
  const [selectedBodyId, setSelectedBodyId] = useState<string>('mercury');

  const activeBody = CELESTIAL_BODIES.find((b) => b.id === selectedBodyId) || CELESTIAL_BODIES[1];

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Header telemetry banner */}
        <div className="rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/85 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#94A3B8]">
                CELESTIAL METRICS COMPARATOR
              </span>
              <h2 className="font-sans text-2xl font-bold text-[#F8FAFC]">
                Solar System Scale & Orbital Velocity Explorer
              </h2>
              <p className="mt-1 font-sans text-xs text-[#CBD5E1] max-w-2xl leading-relaxed">
                Compare celestial radii, orbital velocities, surface gravities, and extreme temperature ranges across the Solar System. 
                Mercury orbits at the fastest speed in the Solar System (47.4 km/s) while experiencing an extreme 610°C thermal swing between night and day.
              </p>
            </div>

            {/* Quick Planet Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CELESTIAL_BODIES.filter((b) => b.id !== 'sun').map((body) => (
                <button
                  key={body.id}
                  type="button"
                  onClick={() => setSelectedBodyId(body.id)}
                  className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-all ${
                    selectedBodyId === body.id
                      ? 'border border-[#94A3B8] bg-[#94A3B8]/20 font-bold text-[#F8FAFC]'
                      : 'border border-[rgba(148,163,184,0.15)] bg-[#11182E] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {body.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Body Focus Card */}
          <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 border-b border-[rgba(148,163,184,0.12)] pb-3">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: activeBody.visual.primaryColor }}
              />
              <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">
                {activeBody.name} ({activeBody.latinName})
              </h3>
            </div>

            <div className="mt-4 flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] py-1.5">
                <span className="text-[#94A3B8]">Classification:</span>
                <span className="text-[#F8FAFC] text-right font-semibold">{activeBody.physical.classification}</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] py-1.5">
                <span className="text-[#94A3B8]">Distance from Sun:</span>
                <span className="text-[#38BDF8] font-bold">{activeBody.physical.realDistanceAU} AU</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] py-1.5">
                <span className="text-[#94A3B8]">Equatorial Diameter:</span>
                <span className="text-[#F8FAFC] font-bold">{activeBody.physical.realDiameterKm}</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] py-1.5">
                <span className="text-[#94A3B8]">Surface Gravity:</span>
                <span className="text-[#F59E0B] font-bold">{activeBody.physical.surfaceGravityMs2} m/s²</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(148,163,184,0.08)] py-1.5">
                <span className="text-[#94A3B8]">Orbital Period:</span>
                <span className="text-[#F8FAFC]">{activeBody.physical.orbitalPeriodDays} Earth days</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#94A3B8]">Mean Temperature:</span>
                <span className="text-[#10B981] font-bold">{activeBody.physical.meanTemperatureC}°C</span>
              </div>
            </div>
          </div>

          {/* Mercury Thermal Extremes Card */}
          <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-[rgba(148,163,184,0.12)] pb-3">
              <Thermometer className="h-4 w-4 text-[#F59E0B]" />
              <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
                Thermal Range: Mercury vs Earth
              </h3>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#EF4444]">Mercury Daytime (+430°C)</span>
                  <span className="text-[#38BDF8]">Nighttime (-180°C)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#10B981] to-[#EF4444] p-0.5">
                  <div className="h-full w-full rounded-full border border-black/40" />
                </div>
                <span className="mt-1 block font-mono text-[10px] text-[#94A3B8]">
                  ΔT = 610°C thermal delta due to absence of heat-retaining atmosphere
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-[#F8FAFC]">Earth Mean Range</span>
                  <span className="text-[#10B981]">+15°C (-89°C to +57°C)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#11182E] p-0.5 border border-[rgba(148,163,184,0.2)]">
                  <div className="h-full w-[45%] mx-auto rounded-full bg-[#10B981]" />
                </div>
                <span className="mt-1 block font-mono text-[10px] text-[#94A3B8]">
                  Atmospheric blanket and water oceans regulate Earth's climate
                </span>
              </div>
            </div>
          </div>

          {/* Orbital Velocity Comparator */}
          <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-[rgba(148,163,184,0.12)] pb-3">
              <Gauge className="h-4 w-4 text-[#38BDF8]" />
              <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
                Kepler's Law: Orbital Speeds
              </h3>
            </div>

            <div className="mt-4 flex flex-col gap-2.5 font-mono text-xs">
              {[
                { name: 'Mercury', speed: '47.4 km/s', pct: '100%', color: '#94A3B8' },
                { name: 'Earth', speed: '29.8 km/s', pct: '63%', color: '#38BDF8' },
                { name: 'Jupiter', speed: '13.1 km/s', pct: '28%', color: '#F97316' },
                { name: 'Neptune', speed: '5.4 km/s', pct: '11%', color: '#60A5FA' },
              ].map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-[#CBD5E1]">{item.name}</span>
                    <span className="font-bold text-[#F8FAFC]">{item.speed}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#11182E]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: item.pct, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};

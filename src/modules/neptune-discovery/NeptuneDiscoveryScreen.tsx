import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Radio, Compass, Snowflake } from 'lucide-react';

export const NeptuneDiscoveryScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('neptune');

  // Supersonic wind simulation gauge
  const [windGaugeKmH, setWindGaugeKmH] = useState<number>(2100);
  const machSpeed = (windGaugeKmH / 1235).toFixed(1);

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Banner */}
        <div className="rounded-2xl border border-[#60A5FA]/30 bg-gradient-to-r from-[#03152E] via-[#0A0F1D] to-[#0A2540] p-6 shadow-xl backdrop-blur-md">
          <span className="font-mono text-xs uppercase tracking-widest text-[#60A5FA]">
            DEEP SPACE DISCOVERY & KUIPER BELT GATEWAY
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Neptune Supersonic Dynamics & Cosmic Discovery Center
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-[#CBD5E1] max-w-2xl leading-relaxed">
            Orbiting at the remote perimeter of the planetary system (30 AU from the Sun), 
            Neptune harbors the most violent, supersonic winds in the Solar System, 
            driven by mysterious internal heat radiation rather than sunlight.
          </p>
        </div>

        {/* Discovery Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supersonic Wind Gauge */}
          <div className="lg:col-span-1 flex flex-col gap-5 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Supersonic Jet Stream Gauge
            </h3>

            {/* Wind Speed Scrubber */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Atmospheric Jet Velocity</span>
                <span className="font-bold text-[#60A5FA]">{windGaugeKmH} km/h</span>
              </div>
              <input
                type="range"
                min="600"
                max="2400"
                step="50"
                value={windGaugeKmH}
                onChange={(e) => setWindGaugeKmH(parseInt(e.target.value, 10))}
                className="h-2 w-full appearance-none rounded-lg bg-[#11182E] accent-[#60A5FA] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
                <span>Moderate Jet (600 km/h)</span>
                <span>Peak Supersonic (2,400 km/h)</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#60A5FA]/30 bg-[#60A5FA]/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#94A3B8]">Mach Ratio:</span>
                <span className="font-mono text-base font-bold text-[#60A5FA]">Mach {machSpeed}</span>
              </div>
              <span className="mt-1 block font-mono text-[10px] text-[#CBD5E1]">
                Winds blow opposite to the direction of planetary rotation (retrograde equatorial jet).
              </span>
            </div>

            <p className="font-mono text-[10px] text-[#94A3B8]">
              Because Neptune receives 900× less solar energy than Earth, low turbulence allows winds to accelerate unimpeded to record-breaking speeds.
            </p>
          </div>

          {/* Triton Cryovolcanism & Kuiper Gateway Station */}
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Triton Cryovolcanism & Kuiper Belt Outpost
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-4">
                <div className="flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-[#38BDF8]" />
                  <span className="font-bold text-xs text-[#F8FAFC]">Moon Triton: Nitrogen Geysers</span>
                </div>
                <p className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
                  Triton is a captured dwarf planet orbiting backward (retrograde). 
                  Voyager 2 photographed geysers erupting liquid nitrogen and black organic soot 8 km into Triton’s thin atmosphere.
                </p>
                <span className="font-mono text-[10px] text-[#38BDF8] mt-auto">
                  Surface Temperature: -235°C (38 Kelvin)
                </span>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-4">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#60A5FA]" />
                  <span className="font-bold text-xs text-[#F8FAFC]">Kuiper Belt Gateway</span>
                </div>
                <p className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
                  Beyond Neptune lies the vast ring of icy debris, comets, and dwarf planets (Pluto, Eris, Haumea, Makemake) known as the Kuiper Belt.
                </p>
                <span className="font-mono text-[10px] text-[#60A5FA] mt-auto">
                  Distance: 30 to 55 Astronomical Units
                </span>
              </div>
            </div>

            {/* Deep Space Voyager 2 Heritage */}
            <div className="rounded-xl border border-[#60A5FA]/25 bg-[#11182E]/60 p-4 mt-auto">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-[#60A5FA]" />
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                  NASA Voyager 2 Flyby (August 25, 1989)
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-[#CBD5E1]">
                Voyager 2 is the only human spacecraft to have visited Neptune, discovering 6 new moons, 4 rings, and tracking the Great Dark Spot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};

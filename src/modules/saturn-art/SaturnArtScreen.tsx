import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { Sparkles } from 'lucide-react';

interface RingZone {
  name: string;
  radiusKm: string;
  thickness: string;
  opticalDepth: string;
  description: string;
}

const RING_ZONES: RingZone[] = [
  {
    name: 'D Ring',
    radiusKm: '66,900 – 74,510 km',
    thickness: 'Faint inner haze',
    opticalDepth: '0.05 (Nearly transparent)',
    description: 'Extremely faint ring closest to Saturn cloud deck; swept by atmospheric drag.',
  },
  {
    name: 'C Ring (Crepe Ring)',
    radiusKm: '74,658 – 92,000 km',
    thickness: '5 meters thin',
    opticalDepth: '0.12 (Semi-transparent)',
    description: 'Translucent amber ring containing darker, silicate-polluted water ice particles.',
  },
  {
    name: 'B Ring (Densest & Brightest)',
    radiusKm: '92,000 – 117,580 km',
    thickness: '5 to 10 meters',
    opticalDepth: '2.50 (Opaque & reflective)',
    description: 'The most massive ring component; casts deep, crisp shadows onto Saturn’s atmosphere.',
  },
  {
    name: 'Cassini Division',
    radiusKm: '117,580 – 122,170 km',
    thickness: '4,590 km wide gap',
    opticalDepth: '0.08 (Cleared resonance gap)',
    description: 'Gravitational 2:1 orbital resonance with moon Mimas clears particles out of this channel.',
  },
  {
    name: 'A Ring',
    radiusKm: '122,170 – 136,775 km',
    thickness: '10 to 30 meters',
    opticalDepth: '0.60 (Bright outer band)',
    description: 'Houses the Encke Gap (325 km wide) kept open by the shepherd moon Pan.',
  },
];

export const SaturnArtScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('saturn');
  const [activeZone, setActiveZone] = useState<RingZone>(RING_ZONES[2]); // B Ring default
  const [iceGrainSize, setIceGrainSize] = useState<number>(25); // cm

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Studio Banner */}
        <div className="rounded-2xl border border-[#FBBF24]/30 bg-gradient-to-r from-[#1F1804] via-[#0A0F1D] to-[#261E0A] p-6 shadow-xl backdrop-blur-md">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FBBF24]">
            CELESTIAL RING OPTICS & ASTRO-ART
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
            Saturn Space Art & Ring Spectroscopy Studio
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-[#CBD5E1] max-w-2xl leading-relaxed">
            Spanning over 282,000 kilometers in diameter yet averaging barely 10 meters in thickness, 
            Saturn’s rings are composed of 99% pure water ice particles ranging from microscopic snow grains to house-sized icy boulders.
          </p>
        </div>

        {/* Studio Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ring Division Selector */}
          <div className="lg:col-span-1 flex flex-col gap-3 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
              Ring Structure Spectrometry
            </h3>
            <span className="font-mono text-[11px] text-[#94A3B8]">
              Select a radial ring zone to analyze:
            </span>

            <div className="flex flex-col gap-2 mt-1">
              {RING_ZONES.map((zone) => (
                <button
                  key={zone.name}
                  type="button"
                  onClick={() => setActiveZone(zone)}
                  className={`flex flex-col items-start gap-0.5 rounded-xl p-3 text-left transition-all ${
                    activeZone.name === zone.name
                      ? 'border border-[#FBBF24] bg-[#FBBF24]/15 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                      : 'border border-[rgba(148,163,184,0.12)] bg-[#11182E] hover:border-[rgba(148,163,184,0.25)]'
                  }`}
                >
                  <span className="font-sans text-xs font-bold text-[#F8FAFC]">{zone.name}</span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">{zone.radiusKm}</span>
                </button>
              ))}
            </div>

            {/* Ice Grain Size Explorer */}
            <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-[rgba(148,163,184,0.12)]">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Ice Grain Scale:</span>
                <span className="font-bold text-[#FBBF24]">{iceGrainSize} cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="150"
                value={iceGrainSize}
                onChange={(e) => setIceGrainSize(parseInt(e.target.value, 10))}
                className="h-2 w-full appearance-none rounded-lg bg-[#11182E] accent-[#FBBF24] cursor-pointer"
              />
              <span className="font-mono text-[10px] text-[#94A3B8]">
                {iceGrainSize < 5
                  ? 'Fine Snow & Frost Particles'
                  : iceGrainSize < 50
                  ? 'Icy Clumps & Pebbles'
                  : 'Massive Boulders & Ice Chunks'}
              </span>
            </div>
          </div>

          {/* Radial Ring Visualizer & Details */}
          <div className="lg:col-span-2 flex flex-col gap-5 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.14)] pb-4">
              <div>
                <h3 className="font-sans text-xl font-bold text-[#F8FAFC]">
                  {activeZone.name}
                </h3>
                <span className="font-mono text-xs text-[#FBBF24]">
                  Radial Distance: {activeZone.radiusKm}
                </span>
              </div>
              <span className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-1 font-mono text-xs text-[#FBBF24]">
                99% Water Ice
              </span>
            </div>

            <p className="font-sans text-sm text-[#CBD5E1] leading-relaxed">
              {activeZone.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-4">
                <span className="block font-mono text-[10px] uppercase text-[#94A3B8]">
                  Vertical Disc Thickness
                </span>
                <span className="mt-1 font-mono text-lg font-bold text-[#F8FAFC]">
                  {activeZone.thickness}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-[#94A3B8]">
                  Proportionally thinner than a razor blade relative to its 282,000 km diameter.
                </span>
              </div>

              <div className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-4">
                <span className="block font-mono text-[10px] uppercase text-[#94A3B8]">
                  Optical Depth (τ)
                </span>
                <span className="mt-1 font-mono text-lg font-bold text-[#38BDF8]">
                  {activeZone.opticalDepth}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-[#94A3B8]">
                  Cassini occultation measurement of starlight penetration through the ring plane.
                </span>
              </div>
            </div>

            {/* Shepherd Moons Feature */}
            <div className="mt-auto flex items-center gap-3 rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-4">
              <Sparkles className="h-5 w-5 shrink-0 text-[#FBBF24]" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#FDE68A]">
                  Shepherd Moons: Pan, Daphnis, and Prometheus
                </span>
                <span className="text-[#E2E8F0]">
                  Tiny inner moons orbit within and alongside the ring edges, using gravity to herd particles and maintain razor-sharp gap boundaries.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};

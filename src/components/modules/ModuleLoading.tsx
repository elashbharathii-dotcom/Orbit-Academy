import React from 'react';
import { Rocket, Radio } from 'lucide-react';
import { CelestialId } from '../../types';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';

interface ModuleLoadingProps {
  planetId: CelestialId | null;
}

export const ModuleLoading: React.FC<ModuleLoadingProps> = ({ planetId }) => {
  if (!planetId) return null;

  const dest = getDestinationByPlanetId(planetId);

  return (
    <div
      role="status"
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070D]/75 backdrop-blur-md animate-fade-in"
    >
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-[rgba(148,163,184,0.2)] bg-[#0A0F1D]/95 p-8 shadow-2xl backdrop-blur-2xl max-w-[420px] text-center mx-4">
        {/* Animated Radar Pulse Core */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
            style={{ backgroundColor: dest.themeAccent }}
          />
          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl border shadow-xl"
            style={{
              backgroundColor: `${dest.themeAccent}18`,
              borderColor: `${dest.themeAccent}60`,
            }}
          >
            <Rocket className="h-6 w-6 animate-pulse" style={{ color: dest.themeAccent }} />
          </div>
        </div>

        {/* Telemetry Labels */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#38BDF8]">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>ORBITAL TRANSIT TELEMETRY</span>
          </div>

          <h2 className="font-sans text-xl font-bold tracking-tight text-[#F8FAFC]">
            Docking with {dest.shortName}
          </h2>

          <p className="font-mono text-xs text-[#94A3B8]">
            Cinematic approach to {dest.celestialId.toUpperCase()} in progress...
          </p>
        </div>

        {/* Progress Bar Animation */}
        <div className="w-full overflow-hidden rounded-full bg-[#11182E] p-0.5 border border-[rgba(148,163,184,0.15)]">
          <div
            className="h-1.5 rounded-full animate-pulse transition-all duration-1000"
            style={{
              backgroundColor: dest.themeAccent,
              width: '95%',
              boxShadow: `0 0 10px ${dest.themeAccent}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

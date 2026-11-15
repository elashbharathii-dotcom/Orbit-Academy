import React, { useState } from 'react';
import { PLANET_DISCOVERY_PROFILES, CELESTIAL_ORDER } from '../data/discoveryData';
import { CelestialId } from '../../../types';
import {
  Rocket,
  Compass,
  Thermometer,
  Weight,
  CheckCircle2,
  X,
} from 'lucide-react';

interface PlanetaryDestinationDeckProps {
  activePlanetId: string;
  onSelectPlanet: (planetId: CelestialId) => void;
  exploredPlanets: string[];
  onClose?: () => void;
}

export const PlanetaryDestinationDeck: React.FC<PlanetaryDestinationDeckProps> = ({
  activePlanetId,
  onSelectPlanet,
  exploredPlanets,
  onClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'terrestrial' | 'giants' | 'deep-space'>('all');

  const filteredOrder = CELESTIAL_ORDER.filter((id) => {
    if (filter === 'all') return true;
    if (filter === 'terrestrial') return ['mercury', 'venus', 'earth', 'moon', 'mars'].includes(id);
    if (filter === 'giants') return ['jupiter', 'saturn', 'uranus', 'neptune'].includes(id);
    if (filter === 'deep-space') return ['sun', 'milky-way'].includes(id);
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col bg-[#070C1B]/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wider text-white flex items-center gap-2">
                PLANETARY DESTINATION SELECTOR
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                  {CELESTIAL_ORDER.length} WORLDS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose a celestial body to initiate cinematic 3D spacecraft transit and surface exploration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded transition ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                All (11)
              </button>
              <button
                type="button"
                onClick={() => setFilter('terrestrial')}
                className={`px-2.5 py-1 rounded transition ${filter === 'terrestrial' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Rocky Worlds
              </button>
              <button
                type="button"
                onClick={() => setFilter('giants')}
                className={`px-2.5 py-1 rounded transition ${filter === 'giants' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Gas & Ice Giants
              </button>
              <button
                type="button"
                onClick={() => setFilter('deep-space')}
                className={`px-2.5 py-1 rounded transition ${filter === 'deep-space' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Cosmic Anchors
              </button>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {filteredOrder.map((id) => {
            const profile = PLANET_DISCOVERY_PROFILES[id];
            if (!profile) return null;

            const isCurrent = activePlanetId === id;
            const isExplored = exploredPlanets.includes(id);

            return (
              <div
                key={id}
                className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Top: Name, Latin Name & Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {profile.name}
                        </span>
                        {isExplored && (
                          <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            EXPLORED
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-serif italic text-slate-400">
                        {profile.latinName} • {profile.classification.split('(')[0].trim()}
                      </span>
                    </div>

                    <div
                      className="w-10 h-10 rounded-full flex-none flex items-center justify-center border shadow-inner"
                      style={{
                        backgroundColor: profile.visuals.primaryColor + '20',
                        borderColor: profile.visuals.primaryColor,
                      }}
                    >
                      <span className="text-xs font-mono font-bold" style={{ color: profile.visuals.primaryColor }}>
                        {profile.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {profile.tagline}
                  </p>

                  {/* Core Telemetry Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Weight className="w-3 h-3 text-cyan-400" />
                      <span>{profile.physics.gravityEarthG.toFixed(2)} g</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span>{profile.physics.meanTemperatureC}°C</span>
                    </div>
                    <div className="col-span-2 text-slate-400 text-[10px] truncate border-t border-slate-900 pt-1">
                      Distance: <span className="text-slate-200">{profile.astronomy.semiMajorAxisKm}</span>
                    </div>
                  </div>

                  {/* Featured Mission */}
                  {profile.missions && profile.missions[0] && (
                    <div className="text-[10px] text-slate-400 line-clamp-1 mb-3">
                      <span className="text-cyan-400 font-semibold">Key Mission: </span>
                      {profile.missions[0].name} ({profile.missions[0].status})
                    </div>
                  )}
                </div>

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectPlanet(id as CelestialId);
                    if (onClose) onClose();
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-slate-800 text-slate-200 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>{isCurrent ? 'ACTIVE EXPEDITION' : 'LAUNCH SPACECRAFT'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

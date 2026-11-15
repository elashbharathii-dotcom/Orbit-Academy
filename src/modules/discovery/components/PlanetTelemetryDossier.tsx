import React, { useState } from 'react';
import { PlanetDiscoveryProfile } from '../types';
import {
  Thermometer,
  Wind,
  Rocket,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { discoveryAudio } from '../audio/discoveryAudio';

interface PlanetTelemetryDossierProps {
  profile: PlanetDiscoveryProfile;
  selectedMoonId: string | null;
  onSelectMoon: (moonId: string | null) => void;
  onOpenComparison: () => void;
  onReplayJourney: () => void;
}

export const PlanetTelemetryDossier: React.FC<PlanetTelemetryDossierProps> = ({
  profile,
  selectedMoonId,
  onSelectMoon,
  onOpenComparison,
  onReplayJourney,
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'atmosphere' | 'moons' | 'missions'>('telemetry');
  const [windScrubberKmH, setWindScrubberKmH] = useState<number>(2100);

  const selectedMoon = profile.satellites.majorMoons.find((m) => m.id === selectedMoonId);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md rounded-3xl border border-white/10 bg-[#070C1B]/95 p-5 shadow-2xl backdrop-blur-2xl text-[#F8FAFC]">
      {/* 1. Header: Planet Identity & Classification */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: profile.visuals.primaryColor }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#38BDF8]">
              {profile.classification}
            </span>
          </div>
          <h1 className="mt-0.5 font-sans text-2xl sm:text-3xl font-black tracking-tight text-white">
            {profile.name}
          </h1>
          <span className="font-mono text-xs text-[#94A3B8] italic">{profile.latinName}</span>
        </div>

        {/* Action: Replay Journey */}
        <button
          type="button"
          onClick={() => {
            discoveryAudio.playTelemetryChime(950);
            onReplayJourney();
          }}
          title="Replay Cinematic Spacecraft Journey"
          className="flex items-center gap-1.5 rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-all"
        >
          <Rocket className="h-3.5 w-3.5" />
          <span>Replay Journey</span>
        </button>
      </div>

      {/* 2. Overview Tagline */}
      <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
        {profile.overviewSummary}
      </p>

      {/* 3. Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#030611] p-1 border border-white/5 font-mono text-[11px]">
        {(
          [
            { id: 'telemetry', label: 'Telemetry' },
            { id: 'atmosphere', label: 'Atmosphere' },
            { id: 'moons', label: `Moons (${profile.satellites.moonCount})` },
            { id: 'missions', label: 'Missions' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              discoveryAudio.playTelemetryChime(750);
              setActiveTab(tab.id);
            }}
            className={`py-1.5 rounded-lg text-center capitalize transition-all truncate px-1 ${
              activeTab === tab.id
                ? 'bg-[#38BDF8] text-[#030611] font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content Area */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
        {/* TAB 1: TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="space-y-3">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-xl border border-white/5 bg-[#0B1226]/80 p-2.5">
                <span className="text-[#64748B] text-[10px] block">Mean Distance to Sol:</span>
                <span className="font-bold text-white text-sm">
                  {profile.astronomy.semiMajorAxisAU} AU
                </span>
                <span className="text-[10px] text-[#94A3B8] block">
                  {profile.astronomy.semiMajorAxisKm}
                </span>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0B1226]/80 p-2.5">
                <span className="text-[#64748B] text-[10px] block">Equatorial Diameter:</span>
                <span className="font-bold text-white text-sm">
                  {profile.physics.equatorialDiameterKm.toLocaleString()} km
                </span>
                <span className="text-[10px] text-[#94A3B8] block">
                  {profile.physics.diameterEarthRatio}x Earth
                </span>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0B1226]/80 p-2.5">
                <span className="text-[#64748B] text-[10px] block">Surface Gravity:</span>
                <span className="font-bold text-white text-sm">
                  {profile.physics.surfaceGravityMs2} m/s²
                </span>
                <span className="text-[10px] text-[#94A3B8] block">
                  {profile.physics.gravityEarthG}g ({profile.physics.gravityEarthG >= 1 ? 'heavier' : 'lighter'})
                </span>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0B1226]/80 p-2.5">
                <span className="text-[#64748B] text-[10px] block">Orbital Period (Year):</span>
                <span className="font-bold text-white text-sm">
                  {profile.astronomy.orbitalPeriodDays.toFixed(1)} Days
                </span>
                <span className="text-[10px] text-[#94A3B8] block">
                  {profile.astronomy.orbitalPeriodEarthYears} Earth Years
                </span>
              </div>
            </div>

            {/* Temperature Thermometer */}
            <div className="rounded-xl border border-white/5 bg-[#0B1226]/80 p-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#38BDF8]">
                  <Thermometer className="h-4 w-4" />
                  <span className="font-bold">Thermal Spectrum</span>
                </div>
                <span className="font-bold text-white">{profile.physics.meanTemperatureC}°C</span>
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-[#94A3B8]">
                <span>Min: {profile.physics.minTemperatureC}°C</span>
                <span>Max: {profile.physics.maxTemperatureC}°C</span>
              </div>
            </div>

            {/* Surface Features Highlights */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                Astronomical & Geological Highlights
              </span>
              {profile.surfaceFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/5 bg-[#0B1226]/60 p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-white font-sans">
                    <span>{feat.title}</span>
                    {feat.coordinateOrLocation && (
                      <span className="font-mono text-[9.5px] text-[#38BDF8] font-normal">
                        {feat.coordinateOrLocation}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-sans text-[11px] text-[#94A3B8] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Side-by-side Planet Comparison Trigger */}
            <button
              type="button"
              onClick={onOpenComparison}
              className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-[#0E1E3D]/80 p-3 hover:border-[#38BDF8]/40 hover:bg-[#122852] transition-all cursor-pointer font-sans text-xs font-bold text-white"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#38BDF8]" />
                <span>Compare {profile.name} with Earth</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[#38BDF8]" />
            </button>
          </div>
        )}

        {/* TAB 2: ATMOSPHERE & CLIMATE */}
        {activeTab === 'atmosphere' && (
          <div className="space-y-3 font-sans text-xs">
            <p className="text-[#94A3B8] leading-relaxed">
              {profile.atmosphere.description}
            </p>

            {/* Gas Composition Bar Chart */}
            {profile.atmosphere.composition.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  Atmospheric Chemistry Spectrum
                </span>

                <div className="space-y-1.5">
                  {profile.atmosphere.composition.map((comp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-white">{comp.gas} ({comp.formula})</span>
                        <span className="font-bold text-[#38BDF8]">{comp.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(2, comp.percentage)}%`,
                            backgroundColor: comp.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neptune Supersonic Wind Gauge Integration */}
            {profile.id === 'neptune' && (
              <div className="rounded-xl border border-[#3B82F6]/30 bg-[#03152E]/80 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Wind className="h-4 w-4 text-[#60A5FA]" />
                    <span>Supersonic Wind Scrubber</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#60A5FA]">
                    {windScrubberKmH} km/h (Mach {(windScrubberKmH / 1235).toFixed(1)})
                  </span>
                </div>

                <input
                  type="range"
                  min="600"
                  max="2400"
                  step="50"
                  value={windScrubberKmH}
                  onChange={(e) => setWindScrubberKmH(parseInt(e.target.value, 10))}
                  className="h-1.5 w-full appearance-none rounded-lg bg-white/10 accent-[#60A5FA] cursor-pointer"
                />

                <p className="text-[10.5px] text-[#94A3B8]">
                  Neptune hosts the solar system’s most ferocious winds, powered by internal thermal heat radiating from its deep mantle.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MOONS & RINGS */}
        {activeTab === 'moons' && (
          <div className="space-y-3 font-sans text-xs">
            {profile.satellites.hasRings && (
              <div className="rounded-xl border border-white/5 bg-[#0B1226]/80 p-3">
                <span className="font-mono text-[10px] text-[#FBBF24] uppercase font-bold block">
                  Ring System Telemetry
                </span>
                <p className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
                  {profile.satellites.ringDescription}
                </p>
                {profile.satellites.ringSpanKm && (
                  <span className="font-mono text-[10px] text-white block mt-1">
                    Diameter: {profile.satellites.ringSpanKm}
                  </span>
                )}
              </div>
            )}

            {selectedMoon && (
              <div className="rounded-xl border border-[#38BDF8]/40 bg-[#38BDF8]/10 p-2.5 font-mono text-[11px] text-[#38BDF8]">
                Active Target: {selectedMoon.name} • Orbital Distance: {selectedMoon.orbitalDistanceKm.toLocaleString()} km
              </div>
            )}

            {profile.satellites.majorMoons.length === 0 ? (
              <p className="text-[#94A3B8] italic text-center py-4">
                {profile.name} has no major confirmed moons or natural satellites.
              </p>
            ) : (
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  Select Moon to Focus Camera
                </span>
                {profile.satellites.majorMoons.map((moon) => {
                  const isSelected = selectedMoonId === moon.id;
                  return (
                    <button
                      key={moon.id}
                      type="button"
                      onClick={() => onSelectMoon(isSelected ? null : moon.id)}
                      className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-white shadow-sm'
                          : 'border-white/5 bg-[#0B1226]/60 hover:bg-[#0B1226] text-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="font-sans text-white">{moon.name}</span>
                        <span className="font-mono text-[10px] text-[#38BDF8]">
                          Ø {moon.diameterKm.toLocaleString()} km
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
                        {moon.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MISSIONS & TIMELINE */}
        {activeTab === 'missions' && (
          <div className="space-y-2.5 font-sans text-xs">
            {profile.missions.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-[#0B1226]/70 p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{m.name}</span>
                  <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-[#38BDF8]">
                    {m.status} • {m.launchYear}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[#94A3B8]">
                  Agency: {m.agency} // Type: {m.type}
                </div>
                <p className="text-[11px] text-[#CBD5E1] leading-relaxed mt-1">
                  {m.keyDiscovery}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

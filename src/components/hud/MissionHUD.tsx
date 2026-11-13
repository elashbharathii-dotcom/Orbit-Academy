import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Globe, ListFilter, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { PlanetDock } from './PlanetDock';
import { PlanetDossier } from './PlanetDossier';
import { AccessibleDirectory } from '../common/AccessibleDirectory';

interface MissionHUDProps {
  speedScale: number;
  onSpeedChange: (speed: number) => void;
}

/**
 * Mission Control 2D Telemetry HUD (Phase 5)
 * Integrates:
 * - Top Status Bar with live UTC clock and speed presets
 * - Right Slide-in Planet Dossier Panel with NASA metrics
 * - Persistent Bottom Quick-Access Planet Dock
 * - Accessible 2D Celestial Directory Modal
 */
export const MissionHUD: React.FC<MissionHUDProps> = ({
  speedScale,
  onSpeedChange,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const { selectedPlanetId, selectPlanet } = useSolarSystem();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedBody = useMemo(() => {
    return selectedPlanetId ? CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId) || null : null;
  }, [selectedPlanetId]);

  const planetsCount = CELESTIAL_BODIES.filter((b) => b.id !== 'sun').length;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6 overflow-hidden">
        {/* 1. Top Mission Control Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Subsystem Badge */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/88 px-4 py-2.5 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]"></span>
              </span>
              <span className="font-sans text-sm font-bold tracking-wider text-[#F8FAFC]">
                ORBIT ACADEMY
              </span>
            </div>

            <span className="hidden h-4 w-px bg-[rgba(148,163,184,0.2)] sm:block" />

            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] sm:inline-block">
              {selectedBody ? `Focus: ${selectedBody.name}` : 'Mission Control Console'}
            </span>

            <span className="rounded border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#F59E0B]">
              PHASE 6A
            </span>
          </div>

          {/* Top Controls: 2D Directory Toggle, Overview Return, UTC Clock & Speed */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {/* 2D Accessible Directory Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDirectoryOpen(true)}
              aria-label="Open 2D accessible celestial directory"
              className="flex items-center gap-1.5 rounded-xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/88 px-3 py-2 font-mono text-xs text-[#38BDF8] shadow-lg backdrop-blur-md transition-colors hover:border-[#38BDF8] hover:bg-[#11182E]"
            >
              <ListFilter className="h-3.5 w-3.5" aria-hidden="true" />
              <span>2D Directory</span>
            </button>

            {/* Selected Body Return Control */}
            {selectedBody && (
              <div className="flex items-center gap-2 rounded-xl border border-[#F59E0B]/40 bg-[#0A0F1D]/92 px-3 py-1.5 shadow-xl backdrop-blur-md animate-fade-in">
                <div className="hidden items-center gap-1.5 font-mono text-xs text-[#F59E0B] sm:flex">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  <span className="font-bold uppercase tracking-wider">{selectedBody.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => selectPlanet(null)}
                  className="flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-2.5 py-1 font-mono text-[11px] text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC]"
                  aria-label="Return to solar system overview (or press Escape)"
                >
                  <RotateCcw className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                  <span>[ESC] Overview</span>
                </button>
              </div>
            )}

            {/* Telemetry Clock & Speed Scrubber */}
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/88 p-1.5 shadow-lg backdrop-blur-md">
              {/* UTC Clock */}
              <div className="hidden items-center gap-1.5 px-3 py-1 font-mono text-xs text-[#94A3B8] md:flex">
                <Compass className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                <span className="tabular-nums">{utcTime || '00:00:00 UTC'}</span>
              </div>

              <div className="hidden h-4 w-px bg-[rgba(148,163,184,0.2)] md:block" />

              {/* Pause / Play Button */}
              <button
                type="button"
                onClick={() => onSpeedChange(speedScale === 0 ? 0.45 : 0)}
                aria-label={speedScale === 0 ? 'Resume planetary orbit animation' : 'Pause planetary orbit animation'}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.2)] bg-[#11182E] text-[#F8FAFC] transition-colors hover:border-[#38BDF8] hover:text-[#38BDF8]"
              >
                {speedScale === 0 ? (
                  <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                ) : (
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>

              {/* Speed Presets */}
              {[0.25, 0.45, 1.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSpeedChange(preset)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                    speedScale === preset
                      ? 'border border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]'
                      : 'text-[#94A3B8] hover:bg-[#11182E] hover:text-[#F8FAFC]'
                  }`}
                >
                  {preset === 0.25 ? '0.5x' : preset === 0.45 ? '1x' : '2x'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* 2. Middle Body: Planet Dossier Panel (Right side) */}
        <PlanetDossier data={selectedBody} />

        {/* 3. Bottom Area: Quick-Access Dock & Navigation Legend */}
        <footer className="flex flex-col items-center justify-between gap-3">
          {/* Centered Planetary Quick-Access Dock */}
          <div className="w-full flex justify-center">
            <PlanetDock />
          </div>

          {/* Minimalist Legend & Controls Info */}
          <div className="flex w-full flex-col items-center justify-between gap-2 text-xs md:flex-row">
            <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#0A0F1D]/80 px-3 py-1.5 text-[11px] font-mono text-[#94A3B8] backdrop-blur-md">
              <Globe className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
              <span>
                Select Planet via <span className="text-[#F8FAFC]">Dock</span>, <span className="text-[#F8FAFC]">3D Click</span>, or <span className="text-[#F8FAFC]">Keys 1–8</span>
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#0A0F1D]/80 px-3 py-1.5 text-[11px] font-mono text-[#94A3B8] backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
              <span>NASA TELEMETRY VERIFIED // {planetsCount} PLANETS ACTIVE</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 4. Accessible 2D Celestial Directory Modal */}
      <AccessibleDirectory
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />
    </>
  );
};

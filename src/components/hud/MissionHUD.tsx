import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Globe, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface MissionHUDProps {
  speedScale: number;
  onSpeedChange: (speed: number) => void;
}

/**
 * Mission Control 2D Telemetry HUD (Phase 4 Cinematic Navigation)
 * Features:
 * - Unobtrusive Return-to-Overview control upon planet selection
 * - Live UTC Mission Clock & orbital speed controls
 * - System overview indicators and keyboard shortcut guides
 */
export const MissionHUD: React.FC<MissionHUDProps> = ({
  speedScale,
  onSpeedChange,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');
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
    return selectedPlanetId ? CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId) : null;
  }, [selectedPlanetId]);

  const planetsCount = CELESTIAL_BODIES.filter((b) => b.id !== 'sun').length;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6">
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
            {selectedBody ? `Focus: ${selectedBody.name}` : 'Mission Control Overview'}
          </span>

          <span className="rounded border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#38BDF8]">
            PHASE 4
          </span>
        </div>

        {/* Selected Body Return Control */}
        {selectedBody && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-[#F59E0B]/40 bg-[#0A0F1D]/92 px-3.5 py-1.5 shadow-xl backdrop-blur-md transition-all">
            <div className="flex items-center gap-2 font-mono text-xs text-[#F59E0B]">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="font-bold uppercase tracking-wider">
                {selectedBody.name} // {selectedBody.latinName}
              </span>
            </div>

            <div className="h-3.5 w-px bg-[rgba(148,163,184,0.2)]" />

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

        {/* Live UTC Telemetry & Orbit Speed Controls */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/88 p-1.5 shadow-lg backdrop-blur-md">
          {/* UTC Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 font-mono text-xs text-[#94A3B8]">
            <Compass className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
            <span className="tabular-nums">{utcTime || '00:00:00 UTC'}</span>
          </div>

          <div className="h-4 w-px bg-[rgba(148,163,184,0.2)]" />

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
      </header>

      {/* 2. Bottom Mission Control Footer & Navigation Legend */}
      <footer className="flex flex-col items-center justify-between gap-3 md:flex-row">
        {/* Navigation / Interaction Guide */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/88 px-4 py-2 text-xs shadow-lg backdrop-blur-md">
          <Globe className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
          <span className="font-mono text-[11px] text-[#94A3B8]">
            NAV: <span className="text-[#F8FAFC]">Click Planet / Reticle</span> Focus · <span className="text-[#F8FAFC]">[ESC]</span> Overview · <span className="text-[#F8FAFC]">1-8</span> Quick Select · <span className="text-[#F8FAFC]">Drag</span> Orbit
          </span>
        </div>

        {/* Celestial Count & Scaling Notice */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2.5 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/88 px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#94A3B8]">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" aria-hidden="true" />
            <span>SOL + {planetsCount} PLANETS VISIBLE</span>
          </div>

          <span className="hidden h-3 w-px bg-[rgba(148,163,184,0.2)] md:block" />

          <span className="hidden font-mono text-[10px] uppercase text-[#475569] md:inline-block">
            BEZIER CAMERA CHOREOGRAPHY ACTIVE
          </span>
        </div>
      </footer>
    </div>
  );
};

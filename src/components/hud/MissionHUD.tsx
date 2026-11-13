import React, { useState, useEffect } from 'react';
import { Compass, Globe, Pause, Play, Sparkles } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';

interface MissionHUDProps {
  speedScale: number;
  onSpeedChange: (speed: number) => void;
}

/**
 * Mission Control 2D Telemetry HUD (Phase 2 Overlay)
 * Built with strict adherence to design-system/orbit-academy/MASTER.md:
 * - Floating non-intrusive HUD frames
 * - Pointer-event pass-through (never blocks 3D orbit dragging)
 * - Deep Space Navy (#0A0F1D) surfaces with hairline borders
 * - Accessible vector SVG icons with ARIA labels
 */
export const MissionHUD: React.FC<MissionHUDProps> = ({
  speedScale,
  onSpeedChange,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

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
            3D Engine Online
          </span>

          <span className="rounded border border-[#38BDF8]/30 bg-[#38BDF8]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#38BDF8]">
            PHASE 2
          </span>
        </div>

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

      {/* 2. Bottom Mission Control Footer & Telemetry Legend */}
      <footer className="flex flex-col items-center justify-between gap-3 md:flex-row">
        {/* Navigation / Interaction Guide */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/88 px-4 py-2 text-xs shadow-lg backdrop-blur-md">
          <Globe className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
          <span className="font-mono text-[11px] text-[#94A3B8]">
            NAV: <span className="text-[#F8FAFC]">L-Click + Drag</span> Orbit · <span className="text-[#F8FAFC]">Scroll</span> Zoom · <span className="text-[#F8FAFC]">R-Click</span> Pan
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
            ORBIT SCALE: LOGARITHMIC // NASA METRICS PRESERVED
          </span>
        </div>
      </footer>
    </div>
  );
};

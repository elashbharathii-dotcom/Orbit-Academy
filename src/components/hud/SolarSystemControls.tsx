import React from 'react';
import { Orbit, Sparkles, Pause, Play, Compass } from 'lucide-react';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { CelestialSearchBar } from './CelestialSearchBar';

export const SolarSystemControls: React.FC = () => {
  const {
    viewingMode = 'cinematic',
    setViewingMode,
    activeEnvironment = 'solar-system',
    setActiveEnvironment,
    timeWarp = 1.0,
    setTimeWarp,
  } = useSolarSystem();

  const isMilkyWay = activeEnvironment === 'milky-way';
  const isScientific = viewingMode === 'scientific';
  const isPaused = timeWarp === 0;

  const speedOptions = [0.25, 0.5, 1.0, 2.0, 5.0];

  return (
    <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start lg:self-auto animate-fade-in">
      {/* 1. Environment Switcher: Solar System vs Milky Way 3D */}
      <div className="flex items-center rounded-full border border-white/[0.12] bg-[#0B1226]/85 p-0.5 backdrop-blur-xl shadow-lg">
        <button
          type="button"
          onClick={() => setActiveEnvironment?.('solar-system')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-mono rounded-full transition-all ${
            !isMilkyWay
              ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-bold border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
          title="Switch to Solar System 3D Environment"
        >
          <Orbit className="h-3 w-3" />
          <span className="hidden sm:inline">SOLAR SYSTEM</span>
          <span className="sm:hidden">SYSTEM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveEnvironment?.('milky-way')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-mono rounded-full transition-all ${
            isMilkyWay
              ? 'bg-[#A855F7]/25 text-[#C084FC] font-bold border border-[#A855F7]/50 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
          title="Switch to Dedicated 3D Milky Way Galaxy with Sagittarius A* and Spiral Arms"
        >
          <Sparkles className="h-3 w-3" />
          <span className="hidden sm:inline">MILKY WAY 3D</span>
          <span className="sm:hidden">GALAXY</span>
        </button>
      </div>

      {/* 2. Scale Mode Switcher: Cinematic vs Scientific AU (only applicable in Solar System) */}
      {!isMilkyWay && (
        <div className="hidden sm:flex items-center rounded-full border border-white/[0.12] bg-[#0B1226]/85 p-0.5 backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => setViewingMode?.('cinematic')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded-full transition-all ${
              !isScientific
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] font-bold border border-[#38BDF8]/40'
                : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Cinematic Mode: Enlarged planetary radii for optimal visual inspection"
          >
            <span>CINEMATIC</span>
          </button>

          <button
            type="button"
            onClick={() => setViewingMode?.('scientific')}
            className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded-full transition-all ${
              isScientific
                ? 'bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
            title="Scientific Mode: Proportional AU distances and relative Keplerian velocities"
          >
            <Compass className="h-2.5 w-2.5" />
            <span>SCIENTIFIC (AU)</span>
          </button>
        </div>
      )}

      {/* 3. Time-Warp Speed Controls */}
      <div className="flex items-center rounded-full border border-white/[0.12] bg-[#0B1226]/85 p-0.5 backdrop-blur-xl shadow-lg">
        {/* Pause / Play Toggle */}
        <button
          type="button"
          onClick={() => setTimeWarp?.(isPaused ? 1.0 : 0)}
          className={`flex items-center justify-center h-6 w-6 rounded-full transition-all ${
            isPaused
              ? 'bg-[#F59E0B]/25 text-[#F59E0B] font-bold border border-[#F59E0B]/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
          title={isPaused ? 'Resume planetary orbit motion' : 'Pause orbital revolution'}
        >
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </button>

        {/* Speed pills */}
        <div className="hidden md:flex items-center">
          {speedOptions.map((speed) => {
            const isActive = !isPaused && timeWarp === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => setTimeWarp?.(speed)}
                className={`px-1.5 py-0.5 text-[9.5px] font-mono rounded-full transition-all ${
                  isActive
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] font-bold'
                    : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
              >
                {speed}x
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Celestial Search Bar */}
      <CelestialSearchBar />
    </div>
  );
};

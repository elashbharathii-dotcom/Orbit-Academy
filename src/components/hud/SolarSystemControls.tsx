import React, { useState } from 'react';
import { Orbit, Sparkles, Pause, Play, Compass, RotateCcw, Layers, Check } from 'lucide-react';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { CelestialSearchBar } from './CelestialSearchBar';
import { GraphicsTier } from '../../types';

export const SolarSystemControls: React.FC = () => {
  const {
    viewingMode = 'cinematic',
    setViewingMode,
    activeEnvironment = 'solar-system',
    setActiveEnvironment,
    timeWarp = 1.0,
    setTimeWarp,
    graphicsTier = 'high',
    setGraphicsTier,
    showAsteroidBelt = true,
    setShowAsteroidBelt,
    showKuiperBelt = true,
    setShowKuiperBelt,
    selectPlanet,
    selectMoon,
    selectDwarfPlanet,
  } = useSolarSystem();

  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const isMilkyWay = activeEnvironment === 'milky-way';
  const isScientific = viewingMode === 'scientific';
  const isPaused = timeWarp === 0;

  const speedOptions = [0.25, 0.5, 1.0, 2.0, 5.0, 10.0];
  const graphicsOptions: GraphicsTier[] = ['low', 'medium', 'high', 'ultra'];

  const handleReset = () => {
    selectPlanet(null);
    selectMoon?.(null);
    selectDwarfPlanet?.(null);
    setTimeWarp?.(1.0);
  };

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

      {/* 2. Scale Mode Switcher: Cinematic vs Scientific AU */}
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
            title="Cinematic Mode: Visually enhanced planetary radii for tactile inspection (not to scale)"
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
            title="Scientific Mode: Proportional Keplerian AU distances and physical relative radii"
          >
            <Compass className="h-2.5 w-2.5" />
            <span>SCIENTIFIC (AU)</span>
          </button>
        </div>
      )}

      {/* 3. Layers & Belts Visibility Dropdown Toggle */}
      {!isMilkyWay && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono rounded-full border transition-all ${
              isLayersOpen
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                : 'border-white/[0.12] bg-[#0B1226]/85 text-[#94A3B8] hover:text-white'
            }`}
            title="Toggle Celestial Layers & Graphic Presets"
          >
            <Layers className="h-3 w-3" />
            <span className="hidden md:inline">LAYERS</span>
          </button>

          {isLayersOpen && (
            <div className="absolute right-0 top-8 z-40 w-48 rounded-xl border border-white/[0.15] bg-[#080E21]/95 p-2.5 shadow-2xl backdrop-blur-2xl animate-fade-in font-mono text-[10px]">
              <div className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold px-1 mb-1.5">
                Celestial Belts
              </div>
              <button
                type="button"
                onClick={() => setShowAsteroidBelt?.(!showAsteroidBelt)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left hover:bg-white/[0.06] text-white"
              >
                <span>Asteroid Belt</span>
                {showAsteroidBelt && <Check className="h-3 w-3 text-cyan-400" />}
              </button>
              <button
                type="button"
                onClick={() => setShowKuiperBelt?.(!showKuiperBelt)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left hover:bg-white/[0.06] text-white"
              >
                <span>Kuiper Belt</span>
                {showKuiperBelt && <Check className="h-3 w-3 text-cyan-400" />}
              </button>

              <div className="border-t border-white/[0.08] my-2" />

              <div className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold px-1 mb-1.5">
                Graphics Quality Tier
              </div>
              <div className="grid grid-cols-2 gap-1">
                {graphicsOptions.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setGraphicsTier?.(tier)}
                    className={`px-1.5 py-1 rounded text-center uppercase text-[9px] font-bold transition-all ${
                      graphicsTier === tier
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50'
                        : 'bg-white/[0.03] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Time-Warp Speed Controls */}
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

        {/* Reset Simulation & Camera Button */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center h-6 w-6 rounded-full text-[#64748B] hover:text-white transition-all ml-0.5"
          title="Reset simulation time and return camera to System Overview"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>

      {/* 5. Celestial Search Bar */}
      <CelestialSearchBar />
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { ListFilter, RotateCcw } from 'lucide-react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { PlanetDock } from './PlanetDock';
import { PlanetDossier } from './PlanetDossier';
import { AccessibleDirectory } from '../common/AccessibleDirectory';

/**
 * Minimalist Mission HUD (Phase 7 Elite Redesign)
 * 
 * Design Standards:
 * - 90% of viewport dedicated strictly to Three.js space immersion
 * - Completely removes speed sliders, duplicate buttons, and redundant legend badges
 * - Ultra-clean edge-aligned telemetry (Top-Left brand, Top-Right UTC & 2D Directory, Bottom Dock)
 * - Retains full keyboard accessibility & screen-reader semantics
 */
export const MissionHUD: React.FC = () => {
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

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
        {/* 1. Top Minimalist Header */}
        <header className="flex items-center justify-between gap-3 w-full">
          {/* Brand & Focus Breadcrumb */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-[#05070D]/70 px-3.5 py-1.5 backdrop-blur-xl shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]" />
              </span>
              <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#F8FAFC]">
                ORBIT ACADEMY
              </span>
            </div>

            {/* Selected Planet Breadcrumb with Esc Action */}
            {selectedBody && (
              <div className="flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#05070D]/85 px-3 py-1 font-mono text-xs text-[#F59E0B] backdrop-blur-xl animate-fade-in shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                <span className="font-semibold uppercase tracking-wider">{selectedBody.name}</span>
                <button
                  type="button"
                  onClick={() => selectPlanet(null)}
                  title="Return to solar system overview"
                  aria-label="Return to overview"
                  className="ml-1 flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-[#F8FAFC]"
                >
                  <RotateCcw className="h-2.5 w-2.5 text-[#38BDF8]" />
                  <span>[ESC]</span>
                </button>
              </div>
            )}
          </div>

          {/* Top-Right: UTC Clock & Accessible 2D Directory Button */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-full border border-white/5 bg-[#05070D]/70 px-3 py-1.5 font-mono text-[11px] text-[#94A3B8] backdrop-blur-xl tabular-nums">
              {utcTime || '00:00:00 UTC'}
            </div>

            <button
              type="button"
              onClick={() => setIsDirectoryOpen(true)}
              aria-label="Open 2D accessible celestial directory"
              title="Open 2D Celestial Directory [Accessible]"
              className="group flex items-center gap-1.5 rounded-full border border-white/5 bg-[#05070D]/70 px-3 py-1.5 font-mono text-xs text-[#94A3B8] backdrop-blur-xl transition-all hover:border-[#38BDF8]/40 hover:text-[#F8FAFC] shadow-lg"
            >
              <ListFilter className="h-3.5 w-3.5 text-[#38BDF8] transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">2D Directory</span>
            </button>
          </div>
        </header>

        {/* 2. Middle Body: Contextual Planet Dossier (Right edge) */}
        <PlanetDossier data={selectedBody} />

        {/* 3. Bottom Minimalist Planetary Dock */}
        <footer className="flex justify-center w-full pb-1">
          <PlanetDock />
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

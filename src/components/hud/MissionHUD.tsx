import React, { useMemo } from 'react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { PlanetDock } from './PlanetDock';
import { PlanetDossier } from './PlanetDossier';
import { MasterHeader } from '../navigation/MasterHeader';
import { Activity } from 'lucide-react';

/**
 * Minimalist Mission HUD (Phase 8 Elite Redesign)
 * 
 * Design Standards:
 * - 90% of viewport dedicated strictly to Three.js space immersion
 * - Unified MasterHeader with 6 Core Experiences navigation
 * - Subtle ambient telemetry strip (Top-Left)
 * - Contextual Planet Dossier on right edge
 * - Interactive Planetary Dock at bottom edge
 * - Retains full keyboard accessibility & screen-reader semantics
 */
export const MissionHUD: React.FC = () => {
  const { selectedPlanetId } = useSolarSystem();

  const selectedBody = useMemo(() => {
    return selectedPlanetId ? CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId) || null : null;
  }, [selectedPlanetId]);

  return (
    <>
      {/* 1. Top Unified Master Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-30 pointer-events-auto">
        <MasterHeader />
      </div>

      {/* 2. Main Exploration HUD Layer */}
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-3 sm:p-6 pt-16 sm:pt-20 overflow-hidden">
        {/* Top-Left Ambient Flight Telemetry Strip */}
        <div className="pointer-events-auto flex items-center gap-2 self-start animate-fade-in">
          <div className="glass-pill flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-[#94A3B8]">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </span>
            <span className="text-[#34D399] font-bold">TELEMETRY ACTIVE</span>
            <span className="text-white/20">•</span>
            <span className="hidden sm:inline">
              {selectedBody ? `TARGET: ${selectedBody.name}` : 'SOLAR SYSTEM OVERVIEW'}
            </span>
            <span className="hidden md:inline text-white/20">•</span>
            <span className="hidden md:inline text-[#38BDF8]">
              {selectedBody ? `${selectedBody.physical.realDistanceAU} AU` : '8 PLANETS'}
            </span>
          </div>

          {/* Realtime Sensor Ping Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 glass-pill px-2.5 py-1 text-[10px] font-mono text-[#64748B]">
            <Activity className="h-3 w-3 text-[#38BDF8]" />
            <span>ORBIT MECHANICS: KEPLERIAN</span>
          </div>
        </div>

        {/* 3. Middle Body: Contextual Planet Dossier (Right edge) */}
        <PlanetDossier data={selectedBody} />

        {/* 4. Bottom Minimalist Planetary Dock */}
        <footer className="flex justify-center w-full pb-2">
          <PlanetDock />
        </footer>
      </div>
    </>
  );
};

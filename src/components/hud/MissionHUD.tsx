import React, { useMemo } from 'react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { PlanetDock } from './PlanetDock';
import { PlanetDossier } from './PlanetDossier';
import { MasterHeader } from '../navigation/MasterHeader';

/**
 * Minimalist Mission HUD (Phase 7 Elite Redesign)
 * 
 * Design Standards:
 * - 90% of viewport dedicated strictly to Three.js space immersion
 * - Unified MasterHeader with 6 Core Experiences navigation
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

      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 pt-16 sm:pt-20 overflow-hidden">
        {/* Spacer for top header */}
        <div />

        {/* 2. Middle Body: Contextual Planet Dossier (Right edge) */}
        <PlanetDossier data={selectedBody} />

        {/* 3. Bottom Minimalist Planetary Dock */}
        <footer className="flex justify-center w-full pb-1">
          <PlanetDock />
        </footer>
      </div>
    </>
  );
};

import React from 'react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';

/**
 * Minimalist Planetary Quick-Access Dock (Phase 7 Elite Redesign)
 * 
 * Design Standards:
 * - Ultra-sleek floating glass bar with subtle border and backdrop blur
 * - High-contrast scientific color dots
 * - Uncluttered, restrained active state with Solar Amber indicator
 * - Direct module launcher for selected body
 */
export const PlanetDock: React.FC = () => {
  const { selectedPlanetId, selectPlanet } = useSolarSystem();
  const { launchModuleForPlanet } = useNavigation();

  return (
    <nav
      aria-label="Celestial Quick-Access Dock"
      className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#05070D]/75 p-1.5 shadow-2xl backdrop-blur-xl scrollbar-none"
    >
      {CELESTIAL_BODIES.map((body) => {
        const isSelected = selectedPlanetId === body.id;
        const isSol = body.id === 'sun';

        const handleClick = () => {
          if (isSelected && !isSol) {
            launchModuleForPlanet(body.id);
          } else {
            selectPlanet(isSelected ? null : body.id);
          }
        };

        return (
          <button
            key={body.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={isSelected && !isSol ? `Launch ${body.name} module` : `Select ${body.name}`}
            onClick={handleClick}
            className={`group relative flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8] ${
              isSelected
                ? 'border border-[#F59E0B]/50 bg-[#F59E0B]/12 text-[#F8FAFC] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'border border-transparent text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
            }`}
          >
            {/* Astronomical Color Dot */}
            <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
              {isSelected && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ backgroundColor: body.visual.primaryColor }}
                />
              )}
              <span
                className="relative inline-flex h-2 w-2 rounded-full ring-1 ring-black/40"
                style={{ backgroundColor: body.visual.primaryColor }}
              />
            </span>

            {/* Planet Name */}
            <span
              className={`font-sans tracking-wide text-[11.5px] transition-colors ${
                isSelected ? 'font-semibold text-[#F59E0B]' : 'font-medium group-hover:text-[#F8FAFC]'
              }`}
            >
              {body.name}
            </span>

            {/* Minimal Launch Action Indicator when Selected */}
            {isSelected && !isSol && (
              <span className="flex items-center rounded-full bg-[#F59E0B]/20 px-1.5 py-0.2 font-mono text-[9px] font-bold tracking-tight text-[#F59E0B] animate-pulse">
                MODULE →
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};


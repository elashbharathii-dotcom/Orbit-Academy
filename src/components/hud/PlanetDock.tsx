import React from 'react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';

/**
 * Planetary Quick-Access Navigation Dock (Phase 5)
 * Requirements:
 * - Persistent at bottom of viewport
 * - Authentic astronomical reference colors
 * - Clear active selection ring in Solar Amber (#F59E0B)
 * - Triggers cinematic camera navigation seamlessly
 * - Accessible keyboard navigation and mobile-responsive scroll
 */
export const PlanetDock: React.FC = () => {
  const { selectedPlanetId, selectPlanet } = useSolarSystem();

  return (
    <nav
      aria-label="Celestial Body Quick Selection Dock"
      className="pointer-events-auto flex max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/90 p-1.5 shadow-2xl backdrop-blur-xl scrollbar-none"
    >
      {CELESTIAL_BODIES.map((body, index) => {
        const isSelected = selectedPlanetId === body.id;
        const isSol = body.id === 'sun';

        return (
          <button
            key={body.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`Select ${body.name} (${body.latinName})`}
            onClick={() => selectPlanet(isSelected ? null : body.id)}
            className={`group relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
              isSelected
                ? 'border border-[#F59E0B] bg-[#F59E0B]/15 text-[#F8FAFC] shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'border border-transparent text-[#94A3B8] hover:border-[rgba(148,163,184,0.2)] hover:bg-[#11182E] hover:text-[#F8FAFC]'
            }`}
          >
            {/* Celestial Color Indicator Dot */}
            <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
              {isSelected && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: body.visual.primaryColor }}
                />
              )}
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full border border-black/30"
                style={{ backgroundColor: body.visual.primaryColor }}
              />
            </span>

            {/* Planet Name */}
            <span
              className={`font-semibold tracking-wide ${
                isSelected ? 'text-[#F59E0B]' : 'group-hover:text-[#F8FAFC]'
              }`}
            >
              {body.name}
            </span>

            {/* Keyboard Shortcut Hint for Desktop */}
            <span className="hidden font-mono text-[9px] text-[#475569] sm:inline-block">
              [{isSol ? '0' : index}]
            </span>
          </button>
        );
      })}
    </nav>
  );
};


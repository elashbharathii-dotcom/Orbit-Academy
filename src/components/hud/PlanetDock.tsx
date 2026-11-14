import React from 'react';
import { CELESTIAL_BODIES } from '../../data/celestialBodies';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';

/**
 * Premium Aerospace Planetary Quick-Access Dock (Phase 8 Design System)
 * 
 * Design Standards:
 * - Ultra-sleek floating glass bar with subtle specular highlight and backdrop blur
 * - High-contrast calibrated astronomical color dots with subtle halos
 * - Restrained active state with Solar Amber indicator
 * - Keyboard shortcut hint [1-8]
 * - Smooth hover feedback and touch-friendly targets
 */
export const PlanetDock: React.FC = () => {
  const { selectedPlanetId, selectPlanet, hoveredPlanetId, setHoveredPlanet } = useSolarSystem();
  const { launchModuleForPlanet } = useNavigation();

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-1.5">
      <nav
        aria-label="Celestial Quick-Access Dock"
        className="glass-panel relative flex max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-full px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] scrollbar-none"
      >
        {CELESTIAL_BODIES.map((body, index) => {
          const isSelected = selectedPlanetId === body.id;
          const isHovered = hoveredPlanetId === body.id;
          const isSol = body.id === 'sun';
          const shortcutKey = isSol ? '0' : String(index);

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
              onPointerEnter={() => setHoveredPlanet(body.id)}
              onPointerLeave={() => setHoveredPlanet(null)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 text-xs transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8] ${
                isSelected
                  ? 'border border-[#F59E0B]/50 bg-[#F59E0B]/15 text-[#F8FAFC] shadow-[0_0_16px_rgba(245,158,11,0.25)]'
                  : isHovered
                  ? 'border border-white/15 bg-white/[0.08] text-[#F8FAFC]'
                  : 'border border-transparent text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]'
              }`}
            >
              {/* Astronomical Color Dot with Corona Glow */}
              <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                {isSelected && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: body.visual.primaryColor }}
                  />
                )}
                <span
                  className="relative inline-flex h-2 w-2 rounded-full ring-1 ring-black/40 shadow-sm"
                  style={{ backgroundColor: body.visual.primaryColor }}
                />
              </span>

              {/* Planet Name */}
              <span
                className={`font-sans tracking-wide text-[11.5px] transition-colors ${
                  isSelected ? 'font-semibold text-[#F59E0B]' : 'font-medium'
                }`}
              >
                {body.name}
              </span>

              {/* Keyboard Shortcut Indicator on Desktop */}
              <span className="hidden lg:inline font-mono text-[9px] text-[#64748B] group-hover:text-[#94A3B8]">
                [{shortcutKey}]
              </span>

              {/* Direct Launch Action Badge when Selected */}
              {isSelected && !isSol && (
                <span className="flex items-center rounded-full bg-[#F59E0B]/20 px-1.5 py-0.2 font-mono text-[8.5px] font-bold tracking-tight text-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                  LAUNCH →
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Subtle Keyboard Navigation Hint */}
      <div className="hidden md:flex items-center gap-2 font-mono text-[9.5px] text-[#64748B] tracking-wider uppercase">
        <span>Keys [1-8] Focus Planet</span>
        <span>•</span>
        <span>[Esc] System Overview</span>
        <span>•</span>
        <span>[Drag / Wheel] Orbit Cam</span>
      </div>
    </div>
  );
};

import React from 'react';
import { CelestialDestination, getAllDestinations } from '../../navigation/celestialDestinations';
import { useNavigation } from '../../navigation/NavigationProvider';

interface ModuleNavigationProps {
  currentDestination: CelestialDestination;
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ currentDestination }) => {
  const { launchModuleForPlanet, returnToSolarSystem } = useNavigation();
  const destinations = getAllDestinations();

  return (
    <nav
      aria-label="Orbit Academy Modules Navigation Dock"
      className="pointer-events-auto flex items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-[#05070D]/75 p-1.5 shadow-2xl backdrop-blur-xl scrollbar-none"
    >
      {destinations.map((dest) => {
        const isActive = dest.celestialId === currentDestination.celestialId;

        return (
          <button
            key={dest.celestialId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Switch to ${dest.name}`}
            onClick={() => {
              if (dest.celestialId === 'sun') {
                returnToSolarSystem();
              } else {
                launchModuleForPlanet(dest.celestialId, { immediate: true });
              }
            }}
            className={`group relative flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8] ${
              isActive
                ? 'border border-[#F59E0B]/50 bg-[#F59E0B]/12 text-[#F8FAFC] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'border border-transparent text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'
            }`}
          >
            {/* Color Dot */}
            <span
              className="h-2 w-2 rounded-full ring-1 ring-black/40"
              style={{ backgroundColor: dest.themeAccent }}
            />
            <span className="font-sans text-[11.5px] font-medium tracking-wide">
              {dest.celestialId === 'sun' ? 'Mission Control' : dest.shortName}
            </span>
          </button>
        );
      })}
    </nav>
  );
};


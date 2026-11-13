import React from 'react';
import { RotateCcw, Sparkles, ChevronRight } from 'lucide-react';
import { CelestialDestination, getAllDestinations } from '../../navigation/celestialDestinations';
import { useNavigation } from '../../navigation/NavigationProvider';

interface ModuleHeaderProps {
  destination: CelestialDestination;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ destination }) => {
  const { returnToSolarSystem, launchModuleForPlanet } = useNavigation();

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(148,163,184,0.14)] bg-[#0A0F1D]/90 px-4 py-3 backdrop-blur-xl sm:px-6">
      {/* Left: Return Button & Module Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => returnToSolarSystem()}
          aria-label="Return to 3D Solar System"
          className="group flex items-center gap-1.5 rounded-xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-3 py-1.5 font-mono text-xs text-[#94A3B8] shadow-md transition-all hover:border-[#38BDF8] hover:bg-[#38BDF8]/10 hover:text-[#F8FAFC]"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#38BDF8] transition-transform group-hover:-rotate-45" />
          <span>[ESC] Solar System</span>
        </button>

        <span className="hidden h-5 w-px bg-[rgba(148,163,184,0.2)] sm:block" />

        <div className="flex items-center gap-2">
          {/* Planet Visual Color Dot */}
          <span
            className="h-3 w-3 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: destination.themeAccent, color: destination.themeAccent }}
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-sans text-sm font-bold tracking-wide text-[#F8FAFC] sm:text-base">
                {destination.name}
              </h1>
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${destination.themeAccent}20`,
                  color: destination.themeAccent,
                  border: `1px solid ${destination.themeAccent}40`,
                }}
              >
                {destination.badge}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#94A3B8]">
              ORBIT ACADEMY // {destination.category.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Module Switcher & Objective Pill */}
      <div className="flex items-center gap-2">
        {/* Quick Module Switcher Dropdown */}
        <div className="relative hidden md:block">
          <select
            value={destination.celestialId}
            onChange={(e) => launchModuleForPlanet(e.target.value as any, { immediate: true })}
            aria-label="Switch educational module"
            className="cursor-pointer appearance-none rounded-xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] py-1.5 pl-3 pr-8 font-mono text-xs text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          >
            {getAllDestinations().map((d) => (
              <option key={d.celestialId} value={d.celestialId} className="bg-[#0A0F1D] text-[#F8FAFC]">
                {d.celestialId === 'sun' ? '☀️ Mission Control' : `🪐 ${d.shortName}`}
              </option>
            ))}
          </select>
          <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-[#94A3B8]" />
        </div>

        {/* Objective Preview Pill */}
        <div className="hidden items-center gap-1.5 rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E]/60 px-3 py-1.5 text-xs text-[#94A3B8] lg:flex max-w-[380px]">
          <Sparkles className="h-3 w-3 shrink-0 text-[#F59E0B]" />
          <span className="truncate font-sans text-[11px] text-[#CBD5E1]">
            {destination.learningObjective}
          </span>
        </div>
      </div>
    </header>
  );
};

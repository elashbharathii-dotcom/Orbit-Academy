import React from 'react';
import { 
  X, 
  ExternalLink, 
  Orbit, 
  Compass, 
  Thermometer, 
  Weight, 
  Maximize2, 
  Moon, 
  Wind,
  Rocket
} from 'lucide-react';
import { CelestialBodyDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';

interface PlanetDossierProps {
  data: CelestialBodyDefinition | null;
}

/**
 * Mission Control Planet Dossier (Phase 5 & 7)
 * Built with strict adherence to design-system/orbit-academy/MASTER.md:
 * - Slides in from right side on Desktop; adapts to bottom drawer on Mobile
 * - Uncompromised NASA physical metrics
 * - Direct Educational Module launcher via Phase 7 Celestial Destination Registry
 */
export const PlanetDossier: React.FC<PlanetDossierProps> = ({ data }) => {
  const { selectPlanet } = useSolarSystem();
  const { launchModuleForPlanet } = useNavigation();

  if (!data) return null;

  const { name, latinName, tagline, visual, physical } = data;
  const dest = getDestinationByPlanetId(data.id);

  const handleClose = () => {
    selectPlanet(null);
  };

  const handleLaunchModule = () => {
    launchModuleForPlanet(data.id);
  };

  return (
    <aside
      aria-label={`Mission Telemetry Dossier: ${name}`}
      className="pointer-events-auto fixed right-4 top-18 z-30 max-h-[calc(100vh-6rem)] w-full max-w-[340px] overflow-y-auto rounded-2xl border border-white/10 bg-[#05070D]/80 p-4 shadow-2xl backdrop-blur-2xl transition-all duration-300 md:right-6 md:p-5 scrollbar-none"
    >
      {/* 1. Header & Close Button */}
      <div className="flex items-start justify-between border-b border-white/5 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: visual.primaryColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#38BDF8]">
              {physical.classification}
            </span>
          </div>

          <h2 className="mt-1 font-sans text-xl font-bold tracking-tight text-[#F8FAFC]">
            {name}
            <span className="ml-2 font-mono text-xs font-normal text-[#94A3B8]">
              // {latinName}
            </span>
          </h2>
          <p className="mt-0.5 text-[11px] text-[#94A3B8] leading-tight">{tagline}</p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label={`Close ${name} dossier and return to overview`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Scientific Telemetry Grid (NASA Verified Metrics) */}
      <div className="mt-3.5 space-y-3">
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          NASA ASTROPHYSICAL TELEMETRY
        </h3>

        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          {/* Distance */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
              <Compass className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>MEAN DISTANCE</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.realDistanceAU} AU</div>
            <div className="text-[9.5px] text-[#94A3B8] truncate">{physical.realDistanceKm}</div>
          </div>

          {/* Diameter */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
              <Maximize2 className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>EQUATORIAL DIAMETER</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.realDiameterKm}</div>
            <div className="text-[9.5px] text-[#94A3B8]">Mean Radius</div>
          </div>

          {/* Gravity */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
              <Weight className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>SURFACE GRAVITY</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.surfaceGravityMs2} m/s²</div>
            <div className="text-[9.5px] text-[#94A3B8]">
              {(physical.surfaceGravityMs2 / 9.807).toFixed(2)} × Earth (g)
            </div>
          </div>

          {/* Temperature */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
              <Thermometer className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>MEAN TEMP</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.meanTemperatureC} °C</div>
            <div className="text-[9.5px] text-[#94A3B8]">{physical.meanTemperatureC + 273.15} K</div>
          </div>

          {/* Orbital Period */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
              <Orbit className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>ORBITAL PERIOD</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#F8FAFC]">
              {physical.orbitalPeriodDays === 0 ? 'Stationary Sol' : `${physical.orbitalPeriodDays} d`}
            </div>
            <div className="text-[9.5px] text-[#94A3B8]">
              {physical.orbitalPeriodDays > 0 ? `${(physical.orbitalPeriodDays / 365.25).toFixed(2)} Earth yrs` : 'System Center'}
            </div>
          </div>

          {/* Moons Count */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
              <Moon className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>KNOWN MOONS</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.moonsCount}</div>
            <div className="text-[9.5px] text-[#94A3B8]">Natural Satellites</div>
          </div>
        </div>

        {/* 3. Atmospheric Composition */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#94A3B8]">
            <Wind className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
            <span className="font-semibold uppercase tracking-wider">Atmospheric Chemistry</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {physical.atmosphericComposition.map((gas, index) => (
              <span
                key={index}
                className="rounded-md border border-white/5 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#F8FAFC]"
              >
                {gas}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Educational Learning Module Launcher */}
        <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#F59E0B]">
              Learning Destination // {dest.category}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase"
              style={{
                backgroundColor: `${dest.themeAccent}18`,
                color: dest.themeAccent,
              }}
            >
              {dest.badge}
            </span>
          </div>

          <h4 className="mt-1 font-sans text-xs font-bold text-[#F8FAFC]">
            {dest.name}
          </h4>
          <p className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
            {dest.learningObjective}
          </p>

          {/* Primary Exploration Action CTA */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleLaunchModule}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-3.5 py-2 font-mono text-xs font-bold tracking-wide text-[#05070D] shadow-lg transition-all duration-200 hover:bg-[#FBBF24] hover:shadow-[0_0_16px_rgba(245,158,11,0.35)] active:scale-98"
            >
              <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dest.buttonText.toUpperCase()}</span>
              <ExternalLink className="h-3 w-3 ml-0.5 opacity-80" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

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
      className="pointer-events-auto fixed right-4 top-20 z-30 max-h-[calc(100vh-6.5rem)] w-full max-w-[390px] overflow-y-auto rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#0A0F1D]/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 md:right-6 md:p-6"
    >
      {/* 1. Header & Close Button */}
      <div className="flex items-start justify-between border-b border-[rgba(148,163,184,0.14)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: visual.primaryColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-[#38BDF8]">
              {physical.classification}
            </span>
          </div>

          <h2 className="mt-1 font-sans text-2xl font-bold tracking-tight text-[#F8FAFC]">
            {name}
            <span className="ml-2 font-mono text-sm font-normal text-[#94A3B8]">
              // {latinName}
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-[#94A3B8]">{tagline}</p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label={`Close ${name} dossier and return to overview`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(148,163,184,0.18)] bg-[#11182E] text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Scientific Telemetry Grid (NASA Verified Metrics) */}
      <div className="mt-5 space-y-4">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#F59E0B]">
          Astrophysical Telemetry (NASA Standards)
        </h3>

        <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
          {/* Distance */}
          <div className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Compass className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>MEAN DISTANCE</span>
            </div>
            <div className="mt-1 font-bold text-[#F8FAFC]">{physical.realDistanceAU} AU</div>
            <div className="text-[10px] text-[#94A3B8] truncate">{physical.realDistanceKm}</div>
          </div>

          {/* Diameter */}
          <div className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Maximize2 className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>EQUATORIAL DIAMETER</span>
            </div>
            <div className="mt-1 font-bold text-[#F8FAFC]">{physical.realDiameterKm}</div>
            <div className="text-[10px] text-[#94A3B8]">Mean Radius</div>
          </div>

          {/* Gravity */}
          <div className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Weight className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>SURFACE GRAVITY</span>
            </div>
            <div className="mt-1 font-bold text-[#F8FAFC]">{physical.surfaceGravityMs2} m/s²</div>
            <div className="text-[10px] text-[#94A3B8]">
              {(physical.surfaceGravityMs2 / 9.807).toFixed(2)} × Earth (g)
            </div>
          </div>

          {/* Temperature */}
          <div className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Thermometer className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>MEAN TEMPERATURE</span>
            </div>
            <div className="mt-1 font-bold text-[#F8FAFC]">{physical.meanTemperatureC} °C</div>
            <div className="text-[10px] text-[#94A3B8]">{physical.meanTemperatureC + 273.15} K</div>
          </div>

          {/* Orbital Period */}
          <div className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Orbit className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>ORBITAL PERIOD</span>
            </div>
            <div className="mt-1 font-bold text-[#F8FAFC]">
              {physical.orbitalPeriodDays === 0 ? 'Stationary Sol' : `${physical.orbitalPeriodDays} d`}
            </div>
            <div className="text-[10px] text-[#94A3B8]">
              {physical.orbitalPeriodDays > 0 ? `${(physical.orbitalPeriodDays / 365.25).toFixed(2)} Earth yrs` : 'System Center'}
            </div>
          </div>

          {/* Moons Count */}
          <div className="rounded-lg border border-[rgba(148,163,184,0.1)] bg-[#11182E]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Moon className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
              <span>KNOWN MOONS</span>
            </div>
            <div className="mt-1 font-bold text-[#F8FAFC]">{physical.moonsCount}</div>
            <div className="text-[10px] text-[#94A3B8]">Natural Satellites</div>
          </div>
        </div>

        {/* 3. Atmospheric Composition */}
        <div className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E]/40 p-3.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#94A3B8]">
            <Wind className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
            <span className="font-semibold uppercase">Atmospheric Chemistry</span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {physical.atmosphericComposition.map((gas, index) => (
              <span
                key={index}
                className="rounded-md border border-[rgba(56,189,248,0.2)] bg-[#38BDF8]/10 px-2 py-1 font-mono text-[10.5px] text-[#F8FAFC]"
              >
                {gas}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Educational Learning Module Launcher (Phase 7) */}
        <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
              Learning Destination // {dest.category}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase"
              style={{
                backgroundColor: `${dest.themeAccent}20`,
                color: dest.themeAccent,
              }}
            >
              {dest.badge}
            </span>
          </div>

          <h4 className="mt-1 font-sans text-sm font-bold text-[#F8FAFC]">
            {dest.name}
          </h4>
          <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
            {dest.learningObjective}
          </p>

          {/* Primary Exploration Action CTA */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleLaunchModule}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 font-mono text-xs font-bold tracking-wide text-[#05070D] shadow-lg transition-all duration-200 hover:bg-[#FBBF24] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] active:scale-98"
            >
              <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dest.buttonText.toUpperCase()}</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

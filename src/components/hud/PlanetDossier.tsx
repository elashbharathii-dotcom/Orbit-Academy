import React from 'react';
import { 
  X, 
  Orbit, 
  Compass, 
  Thermometer, 
  Weight, 
  Maximize2, 
  Moon, 
  Wind,
  Rocket,
  ChevronRight,
} from 'lucide-react';
import { CelestialBodyDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { GlassCard } from '../ui/GlassCard';
import { SpaceButton } from '../ui/SpaceButton';

interface PlanetDossierProps {
  data: CelestialBodyDefinition | null;
}

/**
 * Premium Aerospace Mission Control Planet Dossier (Phase 8 Design System)
 * 
 * Features:
 * - High-density aerospace telemetry cards with verified NASA metrics
 * - Atmospheric chemistry analysis with proportional visual spectrum
 * - Direct module launcher CTA with tactile glow feedback
 * - Responsive: Slides in seamlessly on Desktop, adapts as bottom drawer on Mobile
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
      className="pointer-events-auto fixed bottom-20 left-3 right-3 z-30 max-h-[50vh] overflow-y-auto rounded-2xl md:bottom-auto md:left-auto md:right-6 md:top-18 md:max-h-[calc(100vh-6.5rem)] md:w-full md:max-w-[360px] custom-scrollbar animate-fade-in"
    >
      <GlassCard
        variant="elevated"
        glowingBorder="none"
        className="p-3.5 sm:p-4 md:p-5 border border-white/[0.12] bg-[#0B1226]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
      >
        {/* Mobile Drawer Pill Handle */}
        <div className="flex md:hidden justify-center pb-2 -mt-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* 1. Header Banner & Close Button */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: visual.primaryColor, color: visual.primaryColor }}
                aria-hidden="true"
              />
              <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#38BDF8] truncate">
                {physical.classification}
              </span>
            </div>

            <h2 className="mt-1 font-sans text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC] truncate">
              {name}
              <span className="ml-2 font-mono text-xs font-normal text-[#94A3B8]">
                // {latinName}
              </span>
            </h2>
            <p className="mt-0.5 text-[11px] text-[#94A3B8] leading-tight truncate">{tagline}</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label={`Close ${name} dossier and return to overview`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:bg-white/[0.08] hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* 2. NASA Verified Astrophysical Telemetry */}
        <div className="mt-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              NASA ASTROPHYSICAL TELEMETRY
            </span>
            <span className="font-mono text-[9px] text-[#38BDF8]/80">VERIFIED METRICS</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {/* Distance */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                <Compass className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span>MEAN DISTANCE</span>
              </div>
              <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.realDistanceAU} AU</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">{physical.realDistanceKm}</div>
            </div>

            {/* Diameter */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                <Maximize2 className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span>EQUATORIAL DIAMETER</span>
              </div>
              <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.realDiameterKm}</div>
              <div className="text-[9.5px] text-[#94A3B8]">Mean Radius</div>
            </div>

            {/* Gravity */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04]">
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
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                <Thermometer className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span>MEAN TEMP</span>
              </div>
              <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.meanTemperatureC} °C</div>
              <div className="text-[9.5px] text-[#94A3B8]">{(physical.meanTemperatureC + 273.15).toFixed(1)} K</div>
            </div>

            {/* Orbital Period */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                <Orbit className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span>ORBITAL PERIOD</span>
              </div>
              <div className="mt-1 text-sm font-bold text-[#F8FAFC]">
                {physical.orbitalPeriodDays === 0 ? 'Stationary Sol' : `${physical.orbitalPeriodDays} d`}
              </div>
              <div className="text-[9.5px] text-[#94A3B8]">
                {physical.orbitalPeriodDays > 0
                  ? `${(physical.orbitalPeriodDays / 365.25).toFixed(2)} Earth yrs`
                  : 'System Core'}
              </div>
            </div>

            {/* Known Moons */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                <Moon className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span>KNOWN MOONS</span>
              </div>
              <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.moonsCount}</div>
              <div className="text-[9.5px] text-[#94A3B8]">Natural Satellites</div>
            </div>
          </div>

          {/* 3. Atmospheric Composition */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between font-mono text-[9.5px] text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <Wind className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span className="font-semibold uppercase tracking-wider">Atmospheric Chemistry</span>
              </div>
              <span className="text-[8.5px] text-[#64748B]">MASS SPECTRA</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {physical.atmosphericComposition.map((gas, index) => (
                <span
                  key={index}
                  className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[#F8FAFC]"
                >
                  {gas}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Educational Learning Module Destination Launcher */}
          <div className="rounded-xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#F59E0B]/10 to-[#F59E0B]/[0.02] p-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#F59E0B]">
                Module Gateway // {dest.category}
              </span>
              <span
                className="rounded px-1.5 py-0.5 font-mono text-[8.5px] font-bold uppercase"
                style={{
                  backgroundColor: `${dest.themeAccent}18`,
                  color: dest.themeAccent,
                  border: `1px solid ${dest.themeAccent}30`,
                }}
              >
                {dest.badge}
              </span>
            </div>

            <h4 className="mt-1.5 font-sans text-xs font-bold text-[#F8FAFC]">
              {dest.name}
            </h4>
            <p className="mt-1 text-[11px] text-[#94A3B8] leading-relaxed">
              {dest.learningObjective}
            </p>

            {/* Tactical Launch CTA */}
            <div className="mt-3.5">
              <SpaceButton
                variant="primary"
                size="md"
                onClick={handleLaunchModule}
                icon={Rocket}
                className="w-full justify-center text-xs tracking-wider uppercase font-bold"
              >
                <span>{dest.buttonText}</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </SpaceButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </aside>
  );
};

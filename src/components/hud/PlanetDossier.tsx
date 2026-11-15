import React from 'react';
import { 
  X, 
  Orbit, 
  Compass, 
  Weight, 
  Maximize2, 
  Moon, 
  Wind, 
  Rocket, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  ZoomIn, 
  ArrowLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { CelestialBodyDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';
import { useNavigation } from '../../navigation/NavigationProvider';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { ALL_MOONS, DWARF_PLANETS } from '../../data/celestialBodies';
import { GlassCard } from '../ui/GlassCard';
import { SpaceButton } from '../ui/SpaceButton';

interface PlanetDossierProps {
  data: CelestialBodyDefinition | null;
}

/**
 * Premium Aerospace Mission Control Object Inspector (AAA Edition)
 * 
 * Features:
 * - Multi-target telemetry: Planets, Moons, and Dwarf Planets
 * - Dual Inspector Views: Educational Summary vs Detailed Scientific Telemetry
 * - Verified NASA / JPL physical metrics (Mass, Diameter, Gravity, Temperature, Atmosphere)
 * - Interactive Moons catalog with direct close-up camera zoom
 * - Direct learning module launcher with tactile glow feedback
 * - Responsive: Slides in on desktop, adapts as bottom drawer on mobile
 */
export const PlanetDossier: React.FC<PlanetDossierProps> = ({ data }) => {
  const {
    selectPlanet,
    selectedMoonId,
    selectMoon,
    selectedDwarfPlanetId,
    selectDwarfPlanet,
    dossierMode = 'educational',
    setDossierMode,
  } = useSolarSystem();
  const { launchModuleForPlanet } = useNavigation();

  // 1. Check if a Moon is targeted
  const targetedMoon = selectedMoonId
    ? ALL_MOONS.find((m) => m.id === selectedMoonId) || null
    : null;

  // 2. Check if a Dwarf Planet is targeted
  const targetedDwarf = selectedDwarfPlanetId
    ? DWARF_PLANETS.find((d) => d.id === selectedDwarfPlanetId) || null
    : null;

  // If nothing is targeted, return null
  if (!data && !targetedMoon && !targetedDwarf) return null;

  // =========================================================================
  // VIEW A: DEDICATED NATURAL SATELLITE (MOON) INSPECTOR
  // =========================================================================
  if (targetedMoon) {
    return (
      <aside
        aria-label={`Moon Telemetry Dossier: ${targetedMoon.name}`}
        className="pointer-events-auto fixed bottom-20 left-3 right-3 z-30 max-h-[50vh] overflow-y-auto rounded-2xl md:bottom-auto md:left-auto md:right-6 md:top-18 md:max-h-[calc(100vh-6.5rem)] md:w-full md:max-w-[360px] custom-scrollbar animate-fade-in"
      >
        <GlassCard
          variant="elevated"
          glowingBorder="none"
          className="p-3.5 sm:p-4 md:p-5 border border-cyan-500/30 bg-[#0B1226]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-3 gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 font-bold">
                  SATELLITE OF {targetedMoon.parentPlanetId.toUpperCase()}
                </span>
              </div>
              <h2 className="mt-1 font-sans text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Moon className="h-4 w-4 text-cyan-400" />
                <span>{targetedMoon.name}</span>
              </h2>
              <p className="mt-0.5 text-[11px] text-[#94A3B8] leading-tight">
                Discovered in {targetedMoon.discoveredYear}
              </p>
            </div>

            <button
              type="button"
              onClick={() => selectMoon?.(null)}
              aria-label="Back to parent planet"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#94A3B8] hover:border-cyan-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Telemetry Metrics */}
          <div className="mt-3.5 space-y-3 font-mono">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">EQUATORIAL DIAMETER</div>
                <div className="mt-1 text-sm font-bold text-white">{targetedMoon.realDiameterKm}</div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">ORBITAL PERIOD</div>
                <div className="mt-1 text-sm font-bold text-white">{targetedMoon.orbitalPeriodDays} d</div>
              </div>

              {targetedMoon.realMassKg && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="text-[9px] text-[#94A3B8]">ESTIMATED MASS</div>
                  <div className="mt-1 text-[11px] font-bold text-white truncate">{targetedMoon.realMassKg}</div>
                </div>
              )}

              {targetedMoon.surfaceGravityMs2 !== undefined && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="text-[9px] text-[#94A3B8]">SURFACE GRAVITY</div>
                  <div className="mt-1 text-sm font-bold text-white">{targetedMoon.surfaceGravityMs2} m/s²</div>
                </div>
              )}
            </div>

            {/* Geological Key Feature */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3">
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                <span>Distinct Geological Feature</span>
              </div>
              <p className="mt-1.5 font-sans text-xs text-white leading-relaxed">
                {targetedMoon.keyFeature}
              </p>
            </div>

            {/* Description */}
            <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
              {targetedMoon.description}
            </p>

            {/* Return to Planet Button */}
            <button
              type="button"
              onClick={() => selectMoon?.(null)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] py-2 text-xs font-mono font-bold text-white hover:border-cyan-400 hover:bg-cyan-950/40 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-cyan-400" />
              <span>RETURN TO {targetedMoon.parentPlanetId.toUpperCase()}</span>
            </button>
          </div>
        </GlassCard>
      </aside>
    );
  }

  // =========================================================================
  // VIEW B: DWARF PLANET INSPECTOR (Pluto, Ceres, Haumea, Makemake, Eris)
  // =========================================================================
  if (targetedDwarf) {
    return (
      <aside
        aria-label={`Dwarf Planet Dossier: ${targetedDwarf.name}`}
        className="pointer-events-auto fixed bottom-20 left-3 right-3 z-30 max-h-[50vh] overflow-y-auto rounded-2xl md:bottom-auto md:left-auto md:right-6 md:top-18 md:max-h-[calc(100vh-6.5rem)] md:w-full md:max-w-[360px] custom-scrollbar animate-fade-in"
      >
        <GlassCard
          variant="elevated"
          glowingBorder="none"
          className="p-3.5 sm:p-4 md:p-5 border border-amber-500/30 bg-[#0B1226]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/[0.08] pb-3 gap-2">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold">
                {targetedDwarf.classification}
              </span>
              <h2 className="mt-1 font-sans text-lg font-bold tracking-tight text-white">
                {targetedDwarf.name}
              </h2>
              <p className="mt-0.5 text-[11px] text-[#94A3B8] leading-tight">
                {targetedDwarf.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={() => selectDwarfPlanet?.(null)}
              aria-label="Close dwarf planet dossier"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#94A3B8] hover:border-amber-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Metrics */}
          <div className="mt-3.5 space-y-3 font-mono">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">MEAN DISTANCE</div>
                <div className="mt-1 text-sm font-bold text-white">{targetedDwarf.realDistanceAU} AU</div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">DIAMETER</div>
                <div className="mt-1 text-sm font-bold text-white">{targetedDwarf.realDiameterKm}</div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">ORBITAL PERIOD</div>
                <div className="mt-1 text-sm font-bold text-white">{targetedDwarf.orbitalPeriodYears} yrs</div>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">KNOWN MOONS</div>
                <div className="mt-1 text-sm font-bold text-white">{targetedDwarf.moonsCount}</div>
              </div>
            </div>

            {/* Key Feature */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/30 p-3">
              <div className="text-[9.5px] font-bold text-amber-400 uppercase tracking-wider">
                Astronomical Key Feature
              </div>
              <p className="mt-1 font-sans text-xs text-white leading-relaxed">
                {targetedDwarf.keyFeature}
              </p>
            </div>

            <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
              {targetedDwarf.description}
            </p>
          </div>
        </GlassCard>
      </aside>
    );
  }

  // =========================================================================
  // VIEW C: PRIMARY PLANETARY OBJECT INSPECTOR
  // =========================================================================
  if (!data) return null;

  const { name, latinName, tagline, visual, physical } = data;
  const rawDest = getDestinationByPlanetId(data.id);
  const dest = rawDest || {
    category: 'Astrophysics',
    badge: 'EXPLORATION',
    name: data.name,
    learningObjective: data.tagline,
    buttonText: `Explore ${data.name}`,
    themeAccent: visual.primaryColor,
  };

  const handleClose = () => {
    selectPlanet(null);
  };

  const handleLaunchModule = () => {
    launchModuleForPlanet(data.id);
  };

  const isEducational = dossierMode === 'educational';

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

        {/* Mode Switcher: Educational Summary vs Scientific Telemetry */}
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
          <button
            type="button"
            onClick={() => setDossierMode?.('educational')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1 text-[10px] font-mono font-bold transition-all ${
              isEducational
                ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>EDUCATIONAL</span>
          </button>

          <button
            type="button"
            onClick={() => setDossierMode?.('scientific')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1 text-[10px] font-mono font-bold transition-all ${
              !isEducational
                ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>SCIENTIFIC (SI)</span>
          </button>
        </div>

        {/* 2. Content Display Based on Active Mode */}
        {isEducational ? (
          /* ================= Educational Summary View ================= */
          <div className="mt-3 space-y-3 font-sans">
            {/* Interesting Scientific Facts */}
            {physical.interestingFacts && physical.interestingFacts.length > 0 && (
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
                <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Key Astronomical Insights</span>
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] text-white/90">
                  {physical.interestingFacts.slice(0, 3).map((fact, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">SURFACE TEMP</div>
                <div className="mt-1 text-sm font-bold text-white">{physical.meanTemperatureC} °C</div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-[#94A3B8]">KNOWN MOONS</div>
                <div className="mt-1 text-sm font-bold text-white">{physical.moonsCount}</div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= Detailed Scientific Telemetry View ================= */
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {/* Distance */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                  <Compass className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                  <span>MEAN DISTANCE</span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.realDistanceAU} AU</div>
                <div className="text-[9.5px] text-[#94A3B8] truncate">{physical.realDistanceKm}</div>
              </div>

              {/* Diameter */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                  <Maximize2 className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                  <span>EQUATORIAL DIAMETER</span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.realDiameterKm}</div>
                <div className="text-[9.5px] text-[#94A3B8]">Mean Radius</div>
              </div>

              {/* Mass */}
              {physical.realMassKg && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                    <Weight className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                    <span>PLANETARY MASS</span>
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-[#F8FAFC] truncate">{physical.realMassKg}</div>
                  <div className="text-[9.5px] text-[#94A3B8]">Astrophysical Mass</div>
                </div>
              )}

              {/* Gravity */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                  <Weight className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                  <span>SURFACE GRAVITY</span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#F8FAFC]">{physical.surfaceGravityMs2} m/s²</div>
                <div className="text-[9.5px] text-[#94A3B8]">
                  {(physical.surfaceGravityMs2 / 9.807).toFixed(2)} × Earth (g)
                </div>
              </div>

              {/* Orbital Period */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
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

              {/* Rotation Period */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="flex items-center gap-1.5 text-[9.5px] text-[#94A3B8]">
                  <Calendar className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                  <span>ROTATION PERIOD</span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#F8FAFC]">
                  {physical.rotationPeriodHours.toFixed(1)} h
                </div>
                <div className="text-[9.5px] text-[#94A3B8]">Axial Day Length</div>
              </div>
            </div>

            {/* Atmospheric Composition */}
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
          </div>
        )}

        {/* 3. Natural Satellites / Moons Explorer with Direct Zoom In */}
        {visual.moons && visual.moons.length > 0 && (
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between font-mono text-[9.5px] text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <Moon className="h-3 w-3 text-[#38BDF8]" aria-hidden="true" />
                <span className="font-semibold uppercase tracking-wider">
                  Natural Satellites ({visual.moons.length})
                </span>
              </div>
              <span className="text-[8.5px] text-[#38BDF8]">CLICK TO ZOOM IN</span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {visual.moons.map((moon) => {
                const isCurrentMoon = selectedMoonId === moon.id;
                return (
                  <button
                    key={moon.id}
                    type="button"
                    onClick={() => selectMoon?.(isCurrentMoon ? null : moon.id)}
                    className={`group flex items-center justify-between rounded-lg border p-2 text-left transition-all ${
                      isCurrentMoon
                        ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                        : 'border-white/[0.06] bg-white/[0.02] text-[#94A3B8] hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: moon.primaryColor }}
                        />
                        <span className="font-mono text-[10.5px] font-bold text-white truncate">
                          {moon.name}
                        </span>
                      </div>
                      <div className="font-mono text-[8.5px] text-[#64748B] group-hover:text-[#94A3B8] mt-0.5">
                        ⌀ {moon.realDiameterKm}
                      </div>
                    </div>
                    <ZoomIn className="h-3 w-3 text-cyan-400 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Educational Learning Module Destination Launcher */}
        <div className="mt-3.5 rounded-xl border border-[#F59E0B]/30 bg-gradient-to-b from-[#F59E0B]/10 to-[#F59E0B]/[0.02] p-3.5 shadow-lg">
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
      </GlassCard>
    </aside>
  );
};

import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { MarsSurvivalGame } from './survival-game/MarsSurvivalGame';
import {
  Compass,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Gamepad2,
  FlaskConical,
  Zap,
  Target,
} from 'lucide-react';

interface MartianSample {
  id: string;
  name: string;
  location: string;
  depth: string;
  composition: string;
  organicSignatures: string;
  status: 'scanned' | 'unscanned';
  x: number;
  y: number;
}

const INITIAL_SAMPLES: MartianSample[] = [
  {
    id: 'sample-1',
    name: 'Jezero Delta Mudstone',
    location: 'Delta Front Margin (-18.38°N, 77.58°E)',
    depth: 'Core Depth: 6.2 cm',
    composition: 'Phyllosilicates (Clays), Carbonates, Magnetite',
    organicSignatures: 'Aromatic hydrocarbon traces detected',
    status: 'scanned',
    x: 35,
    y: 42,
  },
  {
    id: 'sample-2',
    name: 'Belva Crater Impactite',
    location: 'Crater Floor Sediments',
    depth: 'Core Depth: 4.8 cm',
    composition: 'Basaltic Andesite, Olivine Crystals',
    organicSignatures: 'No organic biomarkers detected',
    status: 'unscanned',
    x: 68,
    y: 30,
  },
  {
    id: 'sample-3',
    name: 'Séítah Subsurface Regolith',
    location: 'Dune Crest Outcrop',
    depth: 'Core Depth: 7.1 cm',
    composition: 'Pyroxene, Iron Oxide (Hematite), Feldspar',
    organicSignatures: 'Hydrated sulfates verified',
    status: 'unscanned',
    x: 52,
    y: 74,
  },
];

export const MarsAdventureScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('mars');
  const expeditionSectionRef = React.useRef<HTMLDivElement>(null);

  const [isExpeditionActive, setIsExpeditionActive] = useState<boolean>(false);
  const [activeExpeditionView, setActiveExpeditionView] = useState<'3d-game' | 'scanner'>('3d-game');
  const [samples, setSamples] = useState<MartianSample[]>(INITIAL_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<MartianSample>(INITIAL_SAMPLES[0]);
  const [isFiringLaser, setIsFiringLaser] = useState<boolean>(false);

  const handleStartExpedition = (mode: '3d-game' | 'scanner' = '3d-game') => {
    setActiveExpeditionView(mode);
    setIsExpeditionActive(true);
    setTimeout(() => {
      expeditionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const switchExpeditionView = (mode: '3d-game' | 'scanner') => {
    setActiveExpeditionView(mode);
    setTimeout(() => {
      expeditionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleFireLaser = (sample: MartianSample) => {
    setSelectedSample(sample);
    setIsFiringLaser(true);

    setTimeout(() => {
      setSamples((prev) =>
        prev.map((s) => (s.id === sample.id ? { ...s, status: 'scanned' } : s))
      );
      setSelectedSample({ ...sample, status: 'scanned' });
      setIsFiringLaser(false);
    }, 1200);
  };

  const handleReset = () => {
    setSamples(INITIAL_SAMPLES);
    setSelectedSample(INITIAL_SAMPLES[0]);
  };

  const scannedCount = samples.filter((s) => s.status === 'scanned').length;

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Module Header Banner */}
        <div className="rounded-3xl border border-[#EF4444]/30 bg-gradient-to-r from-[#2B0E0E] via-[#05070D] to-[#1A0A0A] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#EF4444]">
                  NASA MARS 2020 JEZERO OUTPOST
                </span>
              </div>
              <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Mars Rover Exploration & Survival Game
              </h1>
              <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
                Direct astronaut operations across Jezero Crater. Explore the 3D survival simulation,
                drive the exploration rover, renovate Outpost Alpha, or deploy the SuperCam spectrometer
                to analyze mineral core targets.
              </p>
            </div>

            {/* Launch Actions */}
            <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
              {!isExpeditionActive ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartExpedition('3d-game')}
                    className="group flex items-center gap-2.5 rounded-2xl bg-[#EF4444] px-5 py-3 font-mono text-sm font-bold text-[#FFFFFF] shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:bg-[#DC2626] hover:scale-105 active:scale-95"
                  >
                    <Gamepad2 className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
                    <span>Play 3D Survival Game</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartExpedition('scanner')}
                    className="flex items-center gap-2 rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/15 px-4 py-3 font-mono text-xs font-semibold text-[#FCA5A5] transition-all hover:bg-[#EF4444]/25"
                  >
                    <FlaskConical className="h-4 w-4" />
                    <span>Spectroscopy Lab</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExpeditionActive(false)}
                    className="flex items-center gap-2 rounded-2xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-4 py-2 font-mono text-xs text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Return to Briefing</span>
                  </button>
                  <span className="rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 px-3.5 py-1.5 font-mono text-xs font-bold text-[#FCA5A5]">
                    {scannedCount} / {samples.length} SAMPLES CACHED
                  </span>
                </div>
              )}

              <span className="font-mono text-[10px] text-[#94A3B8]">
                {isExpeditionActive ? '● EXPEDITION TELEMETRY LIVE' : 'AWAITING MISSION INITIATION'}
              </span>
            </div>
          </div>
        </div>

        {/* Rover Mission Status & Interactive Experience */}
        {isExpeditionActive ? (
          <div ref={expeditionSectionRef} className="flex flex-col gap-4 animate-fade-in scroll-mt-6">
            {/* Expedition Mode Switcher Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0A0F1D]/80 p-2 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => switchExpeditionView('3d-game')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                    activeExpeditionView === '3d-game'
                      ? 'bg-[#EF4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Gamepad2 className="h-4 w-4" />
                  <span>3D Survival: The Last Frontier</span>
                </button>

                <button
                  onClick={() => switchExpeditionView('scanner')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                    activeExpeditionView === 'scanner'
                      ? 'bg-[#EF4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FlaskConical className="h-4 w-4" />
                  <span>Raman Spectroscopy Lab</span>
                </button>
              </div>

              <span className="hidden sm:inline font-mono text-[10px] text-slate-500 pr-3">
                JEZERO CRATER OUTPOST 0.38G
              </span>
            </div>

            {/* Mode 1: 3D Mars Survival Game */}
            {activeExpeditionView === '3d-game' && (
              <MarsSurvivalGame onReturnToBriefing={() => setIsExpeditionActive(false)} />
            )}

            {/* Mode 2: Interactive 2D Spectroscopy Scanner */}
            {activeExpeditionView === 'scanner' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Interactive Jezero Radar & Rover Scanner */}
                <div className="lg:col-span-2 relative aspect-[16/10] min-h-[340px] rounded-3xl border border-white/10 bg-[#160B0B] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Compass className="h-4 w-4 text-[#EF4444]" />
                      <span className="font-mono text-xs font-semibold text-[#F8FAFC]">
                        JEZERO CRATER RADAR GRID
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-[#94A3B8] hover:text-[#F8FAFC]"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Field</span>
                      </button>
                    </div>
                  </div>

                  {/* Simulated Martian Terrain Texture with Outcrop Waypoints */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Topographic Contours */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:24px_24px]" />

                    {/* Laser Beam Animation */}
                    {isFiringLaser && (
                      <div
                        style={{
                          left: `${selectedSample.x}%`,
                          top: `${selectedSample.y}%`,
                        }}
                        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 h-48 w-0.5 bg-gradient-to-t from-red-500 via-amber-300 to-transparent shadow-[0_0_12px_#EF4444] animate-pulse z-20"
                      />
                    )}

                    {/* Sample Target Outcrops */}
                    {samples.map((sample) => {
                      const isSelected = selectedSample.id === sample.id;
                      const isScanned = sample.status === 'scanned';

                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleFireLaser(sample)}
                          style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-1 focus:outline-none z-10"
                        >
                          <div
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-300 ${
                              isSelected
                                ? 'border-[#EF4444] bg-[#EF4444]/30 scale-125 shadow-[0_0_16px_#EF4444]'
                                : isScanned
                                ? 'border-[#10B981] bg-[#10B981]/20'
                                : 'border-white/20 bg-black/60 hover:scale-110'
                            }`}
                          >
                            {isScanned ? (
                              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                            ) : (
                              <Target className="h-4 w-4 text-[#EF4444] animate-pulse" />
                            )}
                          </div>

                          <span className="rounded-full bg-black/70 border border-white/10 px-2 py-0.5 font-mono text-[9px] text-[#F8FAFC] backdrop-blur-sm whitespace-nowrap">
                            {sample.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Status */}
                  <div className="z-10 flex items-center justify-between border-t border-white/5 pt-2 text-[10.5px] font-mono text-[#94A3B8]">
                    <span>Laser Wavelength: 1064 nm (Infrared LIBS)</span>
                    <span>Subsurface Radar: RIMFAX Active</span>
                    <span>Cache Tubes Sealed: {scannedCount}</span>
                  </div>
                </div>

                {/* Right Column: Sample Telemetry & SuperCam Spectrum Analysis */}
                <div className="flex flex-col gap-5">
                  <div className="rounded-2xl border border-white/10 bg-[#05070D]/85 p-5 shadow-xl backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#EF4444]" />
                        <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                          SuperCam Spectrometry Analysis
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                          selectedSample.status === 'scanned'
                            ? 'bg-[#10B981]/20 text-[#10B981]'
                            : 'bg-[#EF4444]/20 text-[#FCA5A5]'
                        }`}
                      >
                        {selectedSample.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 font-mono text-xs">
                      <div>
                        <span className="text-[#94A3B8] text-[10px]">TARGET SPECIMEN</span>
                        <h4 className="font-sans text-base font-bold text-[#F8FAFC]">
                          {selectedSample.name}
                        </h4>
                        <p className="text-[11px] text-[#94A3B8] font-mono">{selectedSample.location}</p>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Core Depth:</span>
                        <span className="text-[#F8FAFC]">{selectedSample.depth}</span>
                      </div>

                      <div className="flex flex-col gap-1 py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Mineral Composition:</span>
                        <span className="text-[#38BDF8] font-bold">{selectedSample.composition}</span>
                      </div>

                      <div className="flex flex-col gap-1 py-1.5 border-b border-white/5">
                        <span className="text-[#94A3B8]">Astrobiology Signature:</span>
                        <span className="text-[#10B981] font-semibold">{selectedSample.organicSignatures}</span>
                      </div>

                      {/* Laser Trigger CTA */}
                      <button
                        type="button"
                        disabled={isFiringLaser}
                        onClick={() => handleFireLaser(selectedSample)}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#EF4444] py-2.5 font-mono text-xs font-bold text-[#FFFFFF] shadow-lg transition-all hover:bg-[#DC2626] disabled:opacity-50"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>{isFiringLaser ? 'PULSING SUPERCAM LASER...' : 'FIRE SUPERCAM LASER'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Mission Briefing Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0A0F1D]/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EF4444]/15 text-[#EF4444] mb-3">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                1. Navigate Jezero Crater
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                Traverse ancient river deltas that formed billions of years ago when liquid water flowed across the Martian surface.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0A0F1D]/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                2. Core Mineral Samples
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                Extract sealed titanium sample tubes for future return to Earth to search for potential microscopic fossil biosignatures.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0A0F1D]/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-sans text-sm font-bold text-[#F8FAFC]">
                3. Chart Subsurface Water Ice
              </h3>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                Probe ground-penetrating radar data mapping subsurface ice deposits critical for future human astronaut landing missions.
              </p>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
};

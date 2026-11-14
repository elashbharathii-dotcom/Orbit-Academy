import React, { useState } from 'react';
import { ModuleShell } from '../../components/modules/ModuleShell';
import { getDestinationByPlanetId } from '../../navigation/celestialDestinations';
import { MarsSurvivalGame } from './survival-game/MarsSurvivalGame';
import {
  Compass,
  Radio,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Thermometer,
  Gamepad2,
  FlaskConical,
} from 'lucide-react';

interface MartianSample {
  id: string;
  name: string;
  location: string;
  depth: string;
  composition: string;
  organicSignatures: string;
  status: 'scanned' | 'unscanned';
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
  },
  {
    id: 'sample-2',
    name: 'Belva Crater Impactite',
    location: 'Crater Floor Sediments',
    depth: 'Core Depth: 4.8 cm',
    composition: 'Basaltic Andesite, Olivine Crystals',
    organicSignatures: 'No organic biomarkers detected',
    status: 'unscanned',
  },
  {
    id: 'sample-3',
    name: 'Séítah Subsurface Regolith',
    location: 'Dune Crest Outcrop',
    depth: 'Core Depth: 7.1 cm',
    composition: 'Pyroxene, Iron Oxide (Hematite), Feldspar',
    organicSignatures: 'Hydrated sulfates verified',
    status: 'unscanned',
  },
];

export const MarsAdventureScreen: React.FC = () => {
  const destination = getDestinationByPlanetId('mars');
  const expeditionSectionRef = React.useRef<HTMLDivElement>(null);

  const [isExpeditionActive, setIsExpeditionActive] = useState<boolean>(false);
  const [activeExpeditionView, setActiveExpeditionView] = useState<'3d-game' | 'scanner'>('3d-game');
  const [samples, setSamples] = useState<MartianSample[]>(INITIAL_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<MartianSample>(INITIAL_SAMPLES[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [radarPing, setRadarPing] = useState<number>(1);

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

  const handleScanSample = (sampleId: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setSamples((prev) =>
        prev.map((s) => (s.id === sampleId ? { ...s, status: 'scanned' } : s))
      );
      setSelectedSample((prev) => ({ ...prev, status: 'scanned' }));
      setIsScanning(false);
      setRadarPing((prev) => prev + 1);
    }, 1200);
  };

  return (
    <ModuleShell destination={destination}>
      <div className="flex flex-col gap-6 w-full">
        {/* Cinematic Mars Rover Expedition Header */}
        <div className="relative overflow-hidden rounded-3xl border border-[#EF4444]/30 bg-gradient-to-r from-[#1A0A0A] via-[#0A0F1D] to-[#2B0E0E] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#EF4444] animate-ping" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#EF4444]">
                  NASA MARS 2020 TELEMETRY LINK
                </span>
                <span className="rounded bg-[#EF4444]/20 border border-[#EF4444]/40 px-2 py-0.5 font-mono text-[9px] font-bold text-[#FCA5A5]">
                  JEZERO CRATER EXPEDITION
                </span>
              </div>

              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
                Mars Rover Adventure: Red Planet Exploration
              </h2>

              <p className="font-sans text-sm text-[#CBD5E1] leading-relaxed">
                Take command of the robotic rover exploration outpost in Jezero Crater. 
                Investigate dried paleolake delta beds, conduct laser-induced breakdown spectroscopy on mineral samples, 
                and chart subsurface water-ice signatures.
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
                <button
                  type="button"
                  onClick={() => setIsExpeditionActive(false)}
                  className="flex items-center gap-2 rounded-2xl border border-[rgba(148,163,184,0.2)] bg-[#11182E] px-4 py-2 font-mono text-xs text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Mission Briefing</span>
                </button>
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

            {/* Mode 2: Existing 2D Spectroscopy Scanner */}
            {activeExpeditionView === 'scanner' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left: Interactive Radar Grid & Targets */}
            <div className="lg:col-span-1 flex flex-col gap-4 rounded-2xl border border-[#EF4444]/25 bg-[#0A0F1D]/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-[#EF4444] animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                    Radar Sweep (Ping #{radarPing})
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#10B981]">ANTENNA LOCK</span>
              </div>

              {/* Sample Target Selector */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8]">
                  Select Rock Core Target:
                </span>
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setSelectedSample(sample)}
                    className={`flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all ${
                      selectedSample.id === sample.id
                        ? 'border border-[#EF4444] bg-[#EF4444]/15 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                        : 'border border-[rgba(148,163,184,0.12)] bg-[#11182E] hover:border-[rgba(148,163,184,0.25)]'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-sans text-xs font-bold text-[#F8FAFC]">
                        {sample.name}
                      </span>
                      {sample.status === 'scanned' ? (
                        <span className="rounded bg-[#10B981]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#10B981]">
                          ANALYZED
                        </span>
                      ) : (
                        <span className="rounded bg-[#EF4444]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#EF4444]">
                          PENDING
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[#94A3B8]">
                      {sample.location}
                    </span>
                  </button>
                ))}
              </div>

              {/* Laser Scan Trigger */}
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleScanSample(selectedSample.id)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#EF4444] bg-[#EF4444] py-2.5 font-mono text-xs font-bold text-white shadow-lg transition-all hover:bg-[#DC2626] disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isScanning ? 'Firing Raman Laser Spectrometer...' : 'Fire Spectrometer Laser'}</span>
              </button>
            </div>

            {/* Right: Live Sample Telemetry Readout */}
            <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#0A0F1D]/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.14)] pb-4">
                <div>
                  <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">
                    {selectedSample.name}
                  </h3>
                  <span className="font-mono text-xs text-[#EF4444]">
                    {selectedSample.location} • {selectedSample.depth}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-[#38BDF8]" />
                  <span className="font-mono text-xs text-[#94A3B8]">Surface Temp: -65°C</span>
                </div>
              </div>

              {/* Composition Readout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                    Mineralogical Composition
                  </span>
                  <p className="mt-1 font-sans text-sm font-semibold text-[#F8FAFC]">
                    {selectedSample.composition}
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E] p-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                    Biosignature Screening
                  </span>
                  <p className="mt-1 font-sans text-sm font-semibold text-[#10B981]">
                    {selectedSample.organicSignatures}
                  </p>
                </div>
              </div>

              {/* Atmospheric Sensor Telemetry */}
              <div className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#11182E]/50 p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  Atmospheric Pressure & Composition
                </span>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-lg bg-[#0A0F1D] p-2">
                    <span className="block font-mono text-[10px] text-[#94A3B8]">Pressure</span>
                    <span className="font-mono text-xs font-bold text-[#F8FAFC]">6.1 mbar (0.6% Earth)</span>
                  </div>
                  <div className="rounded-lg bg-[#0A0F1D] p-2">
                    <span className="block font-mono text-[10px] text-[#94A3B8]">Carbon Dioxide</span>
                    <span className="font-mono text-xs font-bold text-[#EF4444]">95.3%</span>
                  </div>
                  <div className="rounded-lg bg-[#0A0F1D] p-2">
                    <span className="block font-mono text-[10px] text-[#94A3B8]">Nitrogen</span>
                    <span className="font-mono text-xs font-bold text-[#38BDF8]">2.6%</span>
                  </div>
                  <div className="rounded-lg bg-[#0A0F1D] p-2">
                    <span className="block font-mono text-[10px] text-[#94A3B8]">Water Ice Signature</span>
                    <span className="font-mono text-xs font-bold text-[#10B981]">3.8% Detected</span>
                  </div>
                </div>
              </div>

              {/* Honest Milestone Status */}
              <div className="mt-auto flex items-center gap-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#EF4444]" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-[#FCA5A5]">
                    Phase 7 Interactive Expedition Prototype
                  </span>
                  <span className="text-[#E2E8F0]">
                    Full 3D rover physics, terrain driving, and panoramic Mastcam-Z simulation are scheduled for Phase 8 milestone.
                  </span>
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

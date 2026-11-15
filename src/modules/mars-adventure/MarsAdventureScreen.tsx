import React, { useState, useRef } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { MarsSurvivalGame } from './survival-game/MarsSurvivalGame';
import { MarsRoverNavbar } from './components/MarsRoverNavbar';
import { MarsRoverSections } from './components/MarsRoverSections';
import { ClippedButton } from './components/ClippedButton';
import { MissionControlCard } from './components/MissionControlCard';
import { MissionControlSupportModal } from './components/MissionControlSupportModal';
import {
  Compass,
  CheckCircle2,
  RotateCcw,
  Gamepad2,
  FlaskConical,
  Zap,
  Target,
  ArrowLeft,
  Radio,
  Cpu,
  ThermometerSnowflake,
  Wind,
  Gauge,
  BatteryCharging,
  Layers,
  Globe,
  Mountain,
} from 'lucide-react';
import './mars-rover-theme.css';

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
    location: 'Delta Front Margin (18.38°N, 77.58°E)',
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

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4';

export const MarsAdventureScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'mission' | 'explore' | 'telemetry' | 'learn' | 'support'>('home');
  const [activeExpeditionView, setActiveExpeditionView] = useState<'3d-game' | 'scanner'>('3d-game');
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);

  // Spectroscopy Lab State
  const [samples, setSamples] = useState<MartianSample[]>(INITIAL_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<MartianSample>(INITIAL_SAMPLES[0]);
  const [isFiringLaser, setIsFiringLaser] = useState<boolean>(false);

  const expeditionRef = useRef<HTMLDivElement>(null);

  const handleLaunchRoverMission = () => {
    setActiveTab('mission');
    setIsGameActive(true);
    setActiveExpeditionView('3d-game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreMars = () => {
    setActiveTab('explore');
    setIsGameActive(true);
    setActiveExpeditionView('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleResetSamples = () => {
    setSamples(INITIAL_SAMPLES);
    setSelectedSample(INITIAL_SAMPLES[0]);
  };

  const scannedCount = samples.filter((s) => s.status === 'scanned').length;

  return (
    <div className="mars-rover-theme-root w-full min-h-screen bg-black text-white flex flex-col font-sans select-none">
      {/* 1. Global Navigation Header (Preserved) */}
      <MasterHeader />

      {/* 2. Adapted Mars Rover Navbar */}
      <MarsRoverNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'mission') {
            setIsGameActive(true);
            setActiveExpeditionView('3d-game');
          } else if (tab === 'explore') {
            setIsGameActive(true);
            setActiveExpeditionView('scanner');
          } else {
            setIsGameActive(false);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLaunchMission={handleLaunchRoverMission}
      />

      {/* 3. MAIN CONTENT ROUTING */}

      {/* VIEW: HOME */}
      {activeTab === 'home' && (
        <main className="flex-1 flex flex-col">
          {/* A. HERO SECTION (Exact Reference Replication with Mars Rover Branding) */}
          <section id="hero" className="relative flex min-h-[92vh] flex-col overflow-hidden bg-black">
            {/* Background Fullscreen CloudFront Video */}
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={HERO_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
            />
            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-1 flex-col px-5 pb-8 md:px-10 lg:px-14">
              <div className="pt-[6vh] md:pt-[8vh] lg:max-w-4xl">
                {/* Mission Status Tag */}
                <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-xs font-mono text-[#EE3F2C] backdrop-blur-md mb-4">
                  <span className="h-2 w-2 rounded-full bg-[#EE3F2C] animate-pulse" />
                  <span>PERSEVERANCE CLASS ROVER • JEZERO CRATER</span>
                </div>

                {/* Main Hero Headline */}
                <h1
                  className="animate-fade-up text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl uppercase"
                  data-editable
                >
                  EXPLORE THE RED PLANET
                </h1>

                {/* Subtitle */}
                <p className="animate-fade-up-delay mt-5 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-light">
                  Become a Mars explorer. Operate an advanced planetary rover, investigate Martian terrain, discover geological mysteries and experience the challenges of real NASA Mars exploration missions.
                </p>

                {/* Primary CTA Buttons */}
                <div className="animate-fade-up-delay mt-8 flex flex-wrap items-center gap-4">
                  <ClippedButton
                    onClick={handleLaunchRoverMission}
                    className="!px-7 !py-3.5 text-xs font-bold uppercase tracking-wider"
                  >
                    <span>LAUNCH ROVER MISSION</span>
                  </ClippedButton>

                  <ClippedButton
                    variant="outline"
                    onClick={handleExploreMars}
                    className="!px-7 !py-3.5 text-xs font-bold uppercase tracking-wider"
                  >
                    <span>EXPLORE MARS</span>
                  </ClippedButton>
                </div>
              </div>

              {/* Bottom Consultation Card: Contact Mission Control */}
              <div className="animate-fade-up-delay-2 mt-auto pt-10">
                <MissionControlCard onClick={() => setIsContactModalOpen(true)} />
              </div>
            </div>
          </section>

          {/* B. INTERACTIVE ROVER EXPEDITION & 3D SIMULATION DECK */}
          <section ref={expeditionRef} className="border-t border-white/10 py-16 px-5 md:px-10 lg:px-14 bg-black">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Expedition Mode Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveExpeditionView('3d-game')}
                    className={`clip-corner inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide transition cursor-pointer ${
                      activeExpeditionView === '3d-game'
                        ? 'bg-[#EE3F2C] text-white'
                        : 'border border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Gamepad2 className="h-4 w-4" />
                    <span>3D Survival: The Last Frontier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveExpeditionView('scanner')}
                    className={`clip-corner inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide transition cursor-pointer ${
                      activeExpeditionView === 'scanner'
                        ? 'bg-[#EE3F2C] text-white'
                        : 'border border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <FlaskConical className="h-4 w-4" />
                    <span>Raman Spectroscopy Lab</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/60">
                    CACHED TUBES: <strong className="text-white">{scannedCount} / {samples.length}</strong>
                  </span>
                  {isGameActive && (
                    <button
                      type="button"
                      onClick={() => setIsGameActive(false)}
                      className="text-xs text-white/60 hover:text-white flex items-center gap-1 font-mono transition cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Minimize</span>
                    </button>
                  )}
                </div>
              </div>

              {/* View 1: 3D Mars Rover Survival Game */}
              {activeExpeditionView === '3d-game' && (
                <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                  <MarsSurvivalGame onReturnToBriefing={() => setIsGameActive(false)} />
                </div>
              )}

              {/* View 2: Raman Spectroscopy Lab */}
              {activeExpeditionView === 'scanner' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up">
                  {/* Jezero Crater Radar Grid */}
                  <div className="lg:col-span-2 relative aspect-[16/10] min-h-[380px] rounded-3xl border border-white/10 bg-[#0C0C0C] p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-[#EE3F2C]" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                          JEZERO CRATER RADAR GRID
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetSamples}
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70 hover:text-white transition cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Targets</span>
                      </button>
                    </div>

                    {/* Interactive Radar Terrain with Waypoints */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#EE3F2C_1px,transparent_1px)] [background-size:24px_24px]" />

                      {/* Laser Beam Animation */}
                      {isFiringLaser && (
                        <div
                          style={{
                            left: `${selectedSample.x}%`,
                            top: `${selectedSample.y}%`,
                          }}
                          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 h-48 w-0.5 bg-gradient-to-t from-[#EE3F2C] via-amber-300 to-transparent shadow-[0_0_12px_#EE3F2C] animate-pulse z-20"
                        />
                      )}

                      {/* Sample Outcrops */}
                      {samples.map((sample) => {
                        const isSelected = selectedSample.id === sample.id;
                        const isScanned = sample.status === 'scanned';

                        return (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleFireLaser(sample)}
                            style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-1.5 focus:outline-none z-10 cursor-pointer"
                          >
                            <div
                              className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                                isSelected
                                  ? 'border-[#EE3F2C] bg-[#EE3F2C]/30 scale-125 shadow-[0_0_20px_#EE3F2C]'
                                  : isScanned
                                  ? 'border-emerald-400 bg-emerald-500/20'
                                  : 'border-white/20 bg-black/70 hover:scale-110'
                              }`}
                            >
                              {isScanned ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Target className="h-4 w-4 text-[#EE3F2C] animate-pulse" />
                              )}
                            </div>

                            <span className="rounded-full bg-black/80 border border-white/10 px-2.5 py-0.5 font-mono text-[9.5px] text-white whitespace-nowrap">
                              {sample.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom Status */}
                    <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/5 pt-3 text-[11px] font-mono text-white/50">
                      <span>SuperCam LIBS: 1064nm Infrared</span>
                      <span>RIMFAX Subsurface Radar: Active</span>
                      <span>Sealed Tubes: {scannedCount} / {samples.length}</span>
                    </div>
                  </div>

                  {/* Right Column: Specimen Analysis & Laser Controls */}
                  <div className="rounded-3xl border border-white/10 bg-[#0C0C0C] p-6 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-[#EE3F2C]" />
                          <h3 className="font-semibold text-sm text-white">
                            SuperCam Spectrometry
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                            selectedSample.status === 'scanned'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#EE3F2C]/20 text-[#EE3F2C] border border-[#EE3F2C]/30'
                          }`}
                        >
                          {selectedSample.status}
                        </span>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div>
                          <span className="text-white/40 text-[10px] block uppercase">Selected Target</span>
                          <h4 className="text-base font-bold text-white mt-0.5">{selectedSample.name}</h4>
                          <p className="text-[11px] text-white/60">{selectedSample.location}</p>
                        </div>

                        <div className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-white/50">Core Depth:</span>
                          <span className="text-white font-medium">{selectedSample.depth}</span>
                        </div>

                        <div className="flex flex-col gap-1 py-1.5 border-b border-white/5">
                          <span className="text-white/50">Mineral Composition:</span>
                          <span className="text-cyan-300 font-medium">{selectedSample.composition}</span>
                        </div>

                        <div className="flex flex-col gap-1 py-1.5 border-b border-white/5">
                          <span className="text-white/50">Astrobiology Signature:</span>
                          <span className="text-emerald-400 font-medium">{selectedSample.organicSignatures}</span>
                        </div>
                      </div>
                    </div>

                    <ClippedButton
                      disabled={isFiringLaser}
                      onClick={() => handleFireLaser(selectedSample)}
                      className="w-full mt-6 !py-3 text-xs font-bold uppercase tracking-wider"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>{isFiringLaser ? 'Pulsing Laser...' : 'Fire SuperCam Laser'}</span>
                      </span>
                    </ClippedButton>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* C. MARS ROVER SECTIONS (Features, About Jezero, FAQ, Mission Support) */}
          <MarsRoverSections
            onOpenContactModal={() => setIsContactModalOpen(true)}
            onLaunchMission={handleLaunchRoverMission}
            onExploreRadar={handleExploreMars}
          />
        </main>
      )}

      {/* VIEW: ROVER MISSION (3D SURVIVAL GAME) */}
      {activeTab === 'mission' && (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-sm text-white/60 hover:text-white flex items-center gap-2 font-mono transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Mission Overview</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#EE3F2C] border border-[#EE3F2C]/30 bg-[#EE3F2C]/10 px-3 py-1 rounded-full font-bold">
                3D TELEOPERATIONS ACTIVE
              </span>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <MarsSurvivalGame onReturnToBriefing={() => setActiveTab('home')} />
          </div>
        </main>
      )}

      {/* VIEW: EXPLORE MARS (RADAR & SPECTROSCOPY LAB) */}
      {activeTab === 'explore' && (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-sm text-white/60 hover:text-white flex items-center gap-2 font-mono transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Mission Overview</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full font-bold">
                RIMFAX RADAR & SUPERCAM ACTIVE
              </span>
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative aspect-[16/10] min-h-[420px] rounded-3xl border border-white/10 bg-[#0C0C0C] p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#EE3F2C]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    JEZERO CRATER RADAR GRID — HiRISE SURFACE RECONNAISSANCE
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleResetSamples}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Targets</span>
                </button>
              </div>

              {/* Radar Surface */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#EE3F2C_1px,transparent_1px)] [background-size:24px_24px]" />

                {isFiringLaser && (
                  <div
                    style={{
                      left: `${selectedSample.x}%`,
                      top: `${selectedSample.y}%`,
                    }}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 h-56 w-0.5 bg-gradient-to-t from-[#EE3F2C] via-amber-300 to-transparent shadow-[0_0_12px_#EE3F2C] animate-pulse z-20"
                  />
                )}

                {samples.map((sample) => {
                  const isSelected = selectedSample.id === sample.id;
                  const isScanned = sample.status === 'scanned';

                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleFireLaser(sample)}
                      style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-1.5 focus:outline-none z-10 cursor-pointer"
                    >
                      <div
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                          isSelected
                            ? 'border-[#EE3F2C] bg-[#EE3F2C]/30 scale-125 shadow-[0_0_20px_#EE3F2C]'
                            : isScanned
                            ? 'border-emerald-400 bg-emerald-500/20'
                            : 'border-white/20 bg-black/70 hover:scale-110'
                        }`}
                      >
                        {isScanned ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Target className="h-5 w-5 text-[#EE3F2C] animate-pulse" />
                        )}
                      </div>

                      <span className="rounded-full bg-black/80 border border-white/10 px-2.5 py-0.5 font-mono text-[9.5px] text-white whitespace-nowrap">
                        {sample.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="z-10 flex flex-wrap items-center justify-between border-t border-white/5 pt-3 text-[11px] font-mono text-white/50">
                <span>SuperCam LIBS: 1064nm Infrared</span>
                <span>RIMFAX Subsurface Radar: Active</span>
                <span>Sealed Tubes: {scannedCount} / {samples.length}</span>
              </div>
            </div>

            {/* Specimen Info */}
            <div className="rounded-3xl border border-white/10 bg-[#0C0C0C] p-6 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#EE3F2C]" />
                    <h3 className="font-semibold text-sm text-white">
                      SuperCam Spectrometry
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      selectedSample.status === 'scanned'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#EE3F2C]/20 text-[#EE3F2C] border border-[#EE3F2C]/30'
                    }`}
                  >
                    {selectedSample.status}
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-white/40 text-[10px] block uppercase">Selected Target</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{selectedSample.name}</h4>
                    <p className="text-[11px] text-white/60">{selectedSample.location}</p>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/50">Core Depth:</span>
                    <span className="text-white font-medium">{selectedSample.depth}</span>
                  </div>

                  <div className="flex flex-col gap-1 py-1.5 border-b border-white/5">
                    <span className="text-white/50">Mineral Composition:</span>
                    <span className="text-cyan-300 font-medium">{selectedSample.composition}</span>
                  </div>

                  <div className="flex flex-col gap-1 py-1.5 border-b border-white/5">
                    <span className="text-white/50">Astrobiology Signature:</span>
                    <span className="text-emerald-400 font-medium">{selectedSample.organicSignatures}</span>
                  </div>
                </div>
              </div>

              <ClippedButton
                disabled={isFiringLaser}
                onClick={() => handleFireLaser(selectedSample)}
                className="w-full mt-6 !py-3 text-xs font-bold uppercase tracking-wider"
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>{isFiringLaser ? 'Pulsing Laser...' : 'Fire SuperCam Laser'}</span>
                </span>
              </ClippedButton>
            </div>
          </div>
        </main>
      )}

      {/* VIEW: MISSION CONTROL / TELEMETRY */}
      {activeTab === 'telemetry' && (
        <main className="min-h-screen bg-black text-white px-6 py-12 md:px-12 md:py-16 animate-fade-up max-w-7xl mx-auto w-full">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Overview</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-emerald-400">DSN UPLINK ONLINE</span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                ROVER TELEMETRY & FLIGHT STATUS
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
                Mission Control Center
              </h1>
              <p className="text-base text-white/65 max-w-2xl mt-2">
                Real-time avionics, environmental parameters, power storage, and scientific subsystem telemetry from Jezero Crater.
              </p>
            </div>

            {/* Telemetry Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between text-white/50 text-xs font-mono">
                  <span>SURFACE PRESSURE</span>
                  <Gauge className="h-4 w-4 text-[#EE3F2C]" />
                </div>
                <div className="text-2xl font-bold text-white mt-3 font-mono">612 Pa</div>
                <p className="text-xs text-white/50 mt-1">0.6% Earth sea-level standard</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between text-white/50 text-xs font-mono">
                  <span>DIURNAL AMBIENT TEMP</span>
                  <ThermometerSnowflake className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-3 font-mono">-63.4 °C</div>
                <p className="text-xs text-white/50 mt-1">Thermal envelope: -125°C to +20°C</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between text-white/50 text-xs font-mono">
                  <span>MMRTG POWER LEVEL</span>
                  <BatteryCharging className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-3 font-mono">94.8%</div>
                <p className="text-xs text-white/50 mt-1">110W electrical from Plutonium-238</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between text-white/50 text-xs font-mono">
                  <span>ATMOSPHERIC DUST TAU</span>
                  <Wind className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mt-3 font-mono">0.65 Tau</div>
                <p className="text-xs text-white/50 mt-1">Solar array transmittance optimal</p>
              </div>
            </div>

            {/* Subsystem Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-[#EE3F2C]" />
                  <h3 className="font-bold text-white text-base">Mobility & Drive Kinematics</h3>
                </div>
                <div className="space-y-2 font-mono text-xs text-white/70">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Odometer Traverse:</span>
                    <strong className="text-white">28.42 km</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Wheel Slip Factor:</span>
                    <strong className="text-emerald-400">3.8% (Nominal)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Drive Motors:</span>
                    <strong className="text-emerald-400">6 / 6 Operational</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Suspension Pitch:</span>
                    <strong className="text-white">+4.2° Inclination</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-[#EE3F2C]" />
                  <h3 className="font-bold text-white text-base">Sample Caching System</h3>
                </div>
                <div className="space-y-2 font-mono text-xs text-white/70">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Hermetic Tubes Sealed:</span>
                    <strong className="text-white">{scannedCount} of 43 Tubes</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Witness Blanks:</span>
                    <strong className="text-white">5 Tubes Intact</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Internal Cleanliness:</span>
                    <strong className="text-emerald-400">Ultra-Clean Class A</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Drop Cache Depot:</span>
                    <strong className="text-cyan-400">Three Forks Ready</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Radio className="h-5 w-5 text-[#EE3F2C]" />
                  <h3 className="font-bold text-white text-base">Deep Space Uplink</h3>
                </div>
                <div className="space-y-2 font-mono text-xs text-white/70">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Earth Distance:</span>
                    <strong className="text-white">248.6 Million km</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>One-Way Light Time:</span>
                    <strong className="text-amber-400">13.8 minutes</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span>Relay Orbiter:</span>
                    <strong className="text-white">Mars Reconnaissance (MRO)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Bandwidth Rate:</span>
                    <strong className="text-emerald-400">2.0 Mbps X-Band</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Modal Action */}
            <div className="pt-4">
              <MissionControlCard onClick={() => setIsContactModalOpen(true)} />
            </div>
          </div>
        </main>
      )}

      {/* VIEW: LEARN (MARS SCIENCE & GEOLOGY) */}
      {activeTab === 'learn' && (
        <main className="min-h-screen bg-black text-white px-6 py-12 md:px-12 md:py-16 animate-fade-up max-w-7xl mx-auto w-full">
          <div className="space-y-8">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                ORBIT ACADEMY CURRICULUM
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
                Mars Planetary Science & Geology
              </h1>
              <p className="text-base text-white/65 max-w-2xl mt-2">
                Explore the geomorphology, atmospheric physics, and astrobiological significance of Mars based on genuine NASA planetary datasets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
                <Globe className="h-6 w-6 text-[#EE3F2C]" />
                <h3 className="text-lg font-bold text-white">Geologic Epochs of Mars</h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  Mars evolved through three main eras: the <strong>Noachian</strong> (wet with heavy bombardment 4.1–3.7 Ga), the <strong>Hesperian</strong> (widespread volcanism and catastrophic outflow floods 3.7–3.0 Ga), and the modern <strong>Amazonian</strong> (cold, dry, oxidized hyper-arid desert).
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
                <Mountain className="h-6 w-6 text-[#EE3F2C]" />
                <h3 className="text-lg font-bold text-white">Jezero Paleolake Delta</h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  A 45-kilometer impact crater in Syrtis Major. River water breached the rim, depositing a massive sediment fan. Mudstones and carbonates concentrated here are premier environments for fossilizing ancient microbial structures.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
                <FlaskConical className="h-6 w-6 text-[#EE3F2C]" />
                <h3 className="text-lg font-bold text-white">Laser Raman Spectroscopy</h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  SuperCam pairs Laser-Induced Breakdown Spectroscopy (LIBS) with Raman spectrometry. Inelastic scattering of laser photons reveals vibrational modes of molecular bonds, detecting carbon chains and amino acids non-destructively.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <MarsRoverSections
                onOpenContactModal={() => setIsContactModalOpen(true)}
                onLaunchMission={handleLaunchRoverMission}
                onExploreRadar={handleExploreMars}
              />
            </div>
          </div>
        </main>
      )}

      {/* VIEW: CONTACT / SUPPORT */}
      {activeTab === 'support' && (
        <main className="min-h-screen bg-black text-white px-6 py-12 md:px-12 md:py-16 animate-fade-up max-w-7xl mx-auto w-full">
          <div className="space-y-8">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Overview</span>
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#EE3F2C] font-mono font-semibold">
                ORBIT ACADEMY FLIGHT SUPPORT
              </p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
                Connect with Mission Control & Laura AI
              </h1>
              <p className="text-base text-white/65 max-w-2xl mt-2">
                Our flight directors, astrobiology instructors, and autonomous AI systems are on standby to assist your expedition.
              </p>
            </div>

            <div className="max-w-xl">
              <MissionControlCard onClick={() => setIsContactModalOpen(true)} />
            </div>

            <div className="pt-4">
              <MarsRoverSections
                onOpenContactModal={() => setIsContactModalOpen(true)}
                onLaunchMission={handleLaunchRoverMission}
                onExploreRadar={handleExploreMars}
              />
            </div>
          </div>
        </main>
      )}

      {/* 4. Working Mission Control Support Modal */}
      <MissionControlSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default MarsAdventureScreen;

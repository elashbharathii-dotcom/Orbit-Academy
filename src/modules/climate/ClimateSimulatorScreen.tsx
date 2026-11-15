/**
 * ORBIT ACADEMY — CLIMATE LAB
 * AAA ENVIRONMENTAL SCIENCE SIMULATOR UPGRADE (MASTER SCREEN)
 * 
 * Central coordinator combining:
 * - Phase 1: Realistic 3D Earth Environment with Day/Night PBR, city lights, clouds, and Rayleigh scattering
 * - Phase 2: Dynamic Weather Simulation (Hurricanes, Monsoons, Thunderstorms, Blizzards, Drought)
 * - Phase 3: Interactive Climate Change Simulator (8 parameters, IPCC AR6 scenarios, dynamic graphs)
 * - Phase 4: Dedicated 3D Environmental Ecosystems (Glacier, Ocean, Forest, Atmosphere)
 * - Phase 5: Six Structured Scientific Experiments with certified cadet XP rewards
 * - Phase 6: Laura AI Climate Science Instructor (Web Speech API narration & Q&A)
 * - Phase 7: AAA Aerospace glass design system
 * - Phase 8: Authenticated NASA & IPCC educational data
 */

import React, { useState } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  ClimateLabMode,
  ContinentRegion,
  WeatherSystemConfig,
  ClimateParameters,
  ClimateScenarioPreset,
  ClimateLayerId,
} from './types';
import {
  CONTINENT_REGIONS,
  WEATHER_PRESETS,
  CLIMATE_SCENARIOS,
  CLIMATE_LAYERS,
} from './climateData';
import { EarthEnvironment3D } from './components/EarthEnvironment3D';
import { WeatherSimulationOverlay } from './components/WeatherSimulationOverlay';
import { ClimateChangeControls } from './components/ClimateChangeControls';
import { EcosystemLabs } from './components/EcosystemLabs';
import { ClimateExperiments } from './components/ClimateExperiments';
import { LauraClimateGuide } from './components/LauraClimateGuide';
import { NasaEarthObservationHub } from './components/NasaEarthObservationHub';
import { EarthMarsClimateComparison } from './components/EarthMarsClimateComparison';
import { ClimateDashboard } from './components/ClimateDashboard';
import { earthService } from '../../services/nasa/earthService';
import { climateAudio } from './audio/climateAudio';
import { useStudentProgress } from '../../services/studentProgressService';
import {
  Globe2,
  CloudRain,
  Sliders,
  Layers,
  FlaskConical,
  Award,
  Sparkles,
  ChevronRight,
  Satellite,
  Scale,
} from 'lucide-react';

export const ClimateSimulatorScreen: React.FC = () => {
  const { progress, awardXp } = useStudentProgress();

  // 1. Navigation / Mode State
  const [activeMode, setActiveMode] = useState<ClimateLabMode>('earth-orbit');

  // 2. Geographic Focus State
  const [selectedRegion, setSelectedRegion] = useState<ContinentRegion>(CONTINENT_REGIONS[0]);

  // 3. Dynamic Weather State
  const [activeWeather, setActiveWeather] = useState<WeatherSystemConfig>(WEATHER_PRESETS[1]); // Category 5 Hurricane

  // 4. Climate Change Parameters State (Default: 2024 Present Day)
  const [climateParams, setClimateParams] = useState<ClimateParameters>({
    ...CLIMATE_SCENARIOS[1].parameters,
  });
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>('present');

  // NASA GIBS satellite layer applied to 3D Earth globe
  const [customGlobeTexture, setCustomGlobeTexture] = useState<string | undefined>(undefined);
  const [activeLayerId, setActiveLayerId] = useState<ClimateLayerId>('surface_temp');
  const [layerOpacity, setLayerOpacity] = useState<number>(0.85);
  const [selectedDate, setSelectedDate] = useState<string>('2024-06-21');

  const handleSelectLayer = (layerId: ClimateLayerId) => {
    setActiveLayerId(layerId);
    const layerDef = CLIMATE_LAYERS.find((l) => l.id === layerId);
    if (layerDef) {
      const wmsUrl = earthService.getGibsWmsUrl(layerDef.wmsLayerName, selectedDate);
      setCustomGlobeTexture(wmsUrl);
    }
  };

  const handleFocusLocation = (coords: { lat: number; lon: number }) => {
    // Jump region / focus
    setSelectedRegion({
      id: 'custom-point',
      name: `Observation Point [${coords.lat.toFixed(1)}°, ${coords.lon.toFixed(1)}°]`,
      category: 'biome',
      coordinates: coords,
      cameraPosition: [0, 2.5, 9.5],
      targetLookAt: [0, 0, 0],
      zoomLevel: 1.2,
      description: 'Custom coordinates targeted from NASA Climate Dashboard location query.',
      climateVulnerability: 'Global Energy Flux Inspection',
      temperatureTrend: 'Telemetry Synchronized',
      keyPhenomena: ['Surface Radiance', 'Solar Flux', 'Atmospheric Column'],
    });
  };

  // 5. Cadet XP and Level Progression
  const [xpNotification, setXpNotification] = useState<string | null>(null);

  // Award XP handler
  const handleAwardXp = (amount: number) => {
    awardXp(amount);
    setXpNotification(`+${amount} XP Awarded! Investigation Certified.`);
    setTimeout(() => {
      setXpNotification(null);
    }, 3500);
  };

  // Weather parameter update
  const handleUpdateWeatherParam = (key: keyof WeatherSystemConfig, val: number) => {
    setActiveWeather((prev) => ({ ...prev, [key]: val }));
  };

  // Scenario selection
  const handleSelectScenario = (scenario: ClimateScenarioPreset) => {
    setActiveScenarioId(scenario.id);
    setClimateParams({ ...scenario.parameters });
  };

  return (
    <div className="min-h-screen bg-[#02050D] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* 1. MASTER APPLICATION HEADER */}
      <MasterHeader />

      {/* 2. SUB-NAVIGATION MODE SELECTOR */}
      <div className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 z-20 sticky top-16">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('earth-orbit');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'earth-orbit'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              1. 3D Global Earth
            </button>

            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('dashboard');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              2. Climate Dashboard &amp; 8 Layers
            </button>

            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('earth-mars-comparison');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'earth-mars-comparison'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              3. Earth vs. Mars Climate
            </button>

            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('experiments');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'experiments'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              4. 5 Physical Experiments
            </button>

            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('weather');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'weather'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              5. Weather Systems
            </button>

            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('climate-change');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'climate-change'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              6. IPCC Scenarios
            </button>

            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveMode('nasa-gibs');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeMode === 'nasa-gibs'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              7. NASA GIBS &amp; EPIC
            </button>
          </div>

          {/* Right: Telemetry & XP Badges */}
          <div className="flex items-center gap-3">
            {xpNotification && (
              <div className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-lg animate-pulse flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {xpNotification}
              </div>
            )}
            <div className="bg-slate-900/80 border border-cyan-500/30 px-3 py-1 rounded-xl flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-mono text-slate-300">
                Cadet XP: <strong className="text-amber-400">{progress.totalXp.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeMode === 'dashboard' ? (
          <ClimateDashboard
            activeLayerId={activeLayerId}
            onSelectLayer={handleSelectLayer}
            layerOpacity={layerOpacity}
            onOpacityChange={setLayerOpacity}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onFocusLocation={handleFocusLocation}
          />
        ) : activeMode === 'earth-mars-comparison' ? (
          <EarthMarsClimateComparison />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT / HERO SECTION: 3D EARTH ENVIRONMENT (Dominant 7 Cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[520px] lg:h-[680px] w-full">
            <EarthEnvironment3D
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              activeWeather={activeWeather}
              climateParams={climateParams}
              availableRegions={CONTINENT_REGIONS}
              customTextureUrl={customGlobeTexture}
            />
          </div>

          {/* Region Vulnerability Callout Card */}
          <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-400">
                Biophysical Vulnerability Index
              </span>
              <div className="text-sm font-bold text-white mt-0.5">
                {selectedRegion.climateVulnerability}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Regional Trend: <span className="text-amber-300 font-mono font-semibold">{selectedRegion.temperatureTrend}</span>
              </div>
            </div>

            <div className="flex gap-1.5">
              {selectedRegion.keyPhenomena.map((phenom, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-cyan-800/40 text-cyan-300"
                >
                  {phenom}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: INTERACTIVE CONTROLS & LAURA AI GUIDE (5 Cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Dynamic Panel based on Active Mode */}
          <div className="flex-1">
            {activeMode === 'earth-orbit' && (
              <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-[10px] uppercase font-mono text-cyan-400">
                    Phase 1: Realistic 3D Earth Environment
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    Planetary Biosphere & Energy Equilibrium
                  </h2>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Welcome to Orbit Academy's flagship Environmental Science Simulator. Earth is a delicate, interconnected thermodynamic system. Explore the continents below or rotate the globe to observe authentic day/night city lights, drifting cloud layers, and Rayleigh atmospheric scattering.
                </p>

                {/* Telemetry Snapshot */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Solar Irradiance</span>
                    <div className="text-sm font-bold text-amber-400 font-mono">1,361 W/m²</div>
                    <div className="text-[10px] text-slate-500">Top of atmosphere (TOA)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Planetary Albedo</span>
                    <div className="text-sm font-bold text-cyan-400 font-mono">0.306 (30.6%)</div>
                    <div className="text-[10px] text-slate-500">Global mean solar reflectance</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Axial Obliquity</span>
                    <div className="text-sm font-bold text-white font-mono">23.44° Tilt</div>
                    <div className="text-[10px] text-slate-500">Drives seasonal variations</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Atmospheric Mass</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono">5.15 × 10¹⁸ kg</div>
                    <div className="text-[10px] text-slate-500">78% N₂, 21% O₂, 0.04% CO₂</div>
                  </div>
                </div>

                {/* Quick launch to weather or experiments */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveMode('weather')}
                    className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    Launch Weather Simulator
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveMode('experiments')}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    Cadet Experiments
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeMode === 'weather' && (
              <WeatherSimulationOverlay
                activeWeather={activeWeather}
                onSelectWeather={setActiveWeather}
                onUpdateWeatherParam={handleUpdateWeatherParam}
              />
            )}

            {activeMode === 'climate-change' && (
              <ClimateChangeControls
                parameters={climateParams}
                onChangeParameters={setClimateParams}
                activeScenarioId={activeScenarioId as any}
                onSelectScenario={handleSelectScenario}
              />
            )}

            {activeMode === 'ecosystems' && (
              <EcosystemLabs />
            )}

            {activeMode === 'experiments' && (
              <ClimateExperiments onAwardXp={handleAwardXp} />
            )}

            {activeMode === 'nasa-gibs' && (
              <NasaEarthObservationHub
                onApplyLayerToGlobe={(_id, _date, url) => {
                  setCustomGlobeTexture(url);
                }}
              />
            )}
          </div>

          {/* LAURA AI CLIMATE INSTRUCTOR */}
          <LauraClimateGuide
            currentMode={activeMode}
            selectedRegion={selectedRegion}
            activeWeather={activeWeather}
            climateParams={climateParams}
          />
        </div>
      </div>
      )}
    </main>
    </div>
  );
};

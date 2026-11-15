/**
 * ORBIT ACADEMY — REAL-TIME SPACE WEATHER COMMAND CENTER
 * Official NASA DONKI Space Physics & Heliospheric Telemetry Suite
 */

import React, { useState, useEffect } from 'react';
import {
  NasaComprehensiveSpaceWeather,
  NasaSolarFlare,
  NasaCmeEvent,
  NasaGeomagneticStorm,
} from '../../services/nasa/types';
import { nasaClient } from '../../services/nasa/nasaClient';
import { SpaceWeatherCanvas } from './components/SpaceWeatherCanvas';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import {
  Sun,
  Globe2,
  Zap,
  Activity,
  ShieldAlert,
  Wind,
  Sparkles,
  ExternalLink,
  Info,
  Radio,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const SpaceWeatherCommandCenter: React.FC = () => {
  const [data, setData] = useState<NasaComprehensiveSpaceWeather | null>(null);
  const [viewMode, setViewMode] = useState<'heliosphere' | 'magnetosphere'>('heliosphere');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'flares' | 'cmes' | 'gsts' | 'notifs'>('all');
  const [selectedFlare, setSelectedFlare] = useState<NasaSolarFlare | null>(null);
  const [lauraNarration, setLauraNarration] = useState<string>(
    'Welcome to the Space Weather Command Center. Real-time telemetry from NASA DONKI indicates Solar Cycle 25 maximum activity with elevated solar wind streams and active geomagnetic conditions.'
  );
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

  // Fetch comprehensive DONKI payload
  useEffect(() => {
    nasaClient.getComprehensiveSpaceWeather().then((res) => {
      setData(res.data);
      if (res.data.flares.length > 0) {
        setSelectedFlare(res.data.flares[0]);
      }
    });
  }, []);

  const handleSpeak = (text: string) => {
    setLauraNarration(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!isVoiceActive) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectFlare = (flare: NasaSolarFlare) => {
    setSelectedFlare(flare);
    setViewMode('heliosphere');
    handleSpeak(
      `Solar Flare ${flare.classType} observed by NASA GOES originating from Active Region ${flare.activeRegionNum || 'unassigned'} at solar coordinates ${flare.sourceLocation}. Peak X-ray flux reached at ${flare.peakTime}.`
    );
  };

  const handleSelectCme = (cme: NasaCmeEvent) => {
    setViewMode('heliosphere');
    handleSpeak(
      `Coronal Mass Ejection detected with propagation velocity of ${cme.speedKmS || 1200} kilometers per second and angular width of ${cme.halfAngle || 45} degrees. Associated note: ${cme.note}`
    );
  };

  const handleSelectGst = (gst: NasaGeomagneticStorm) => {
    setViewMode('magnetosphere');
    handleSpeak(
      `Geomagnetic storm event observed with planetary Kp index reaching ${gst.kpIndex}. This causes magnetosphere compression and triggers brilliant polar auroral electrojets.`
    );
  };

  const summary = data?.summary || {
    solarCycle: 'Solar Cycle 25 (Maximum Activity)',
    sunspotCountEstimate: 174,
    solarWindSpeedKmS: 545,
    planetaryKpIndex: 5,
    imfBzComponentNt: -6.4,
    solarWindDensityProtonsCm3: 8.2,
    dynamicPressureNPa: 4.1,
    magnetopauseStandoffRe: 8.6,
    auroraActivityLevel: 'Active',
    spaceWeatherScale: 'G1 Minor',
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#02050D] font-sans text-[#F8FAFC] overflow-hidden select-none">
      {/* 1. Global Master Header */}
      <div className="flex-none z-40">
        <MasterHeader />
      </div>

      {/* 2. Top Aerospace Telemetry Status HUD */}
      <div className="flex-none z-30 bg-[#050C1E]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              DONKI REAL-TIME TELEMETRY
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {summary.solarCycle}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            {/* Planetary Kp Index */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Planetary Kp:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                summary.planetaryKpIndex >= 7 ? 'bg-rose-950 text-rose-300 border border-rose-600/50' :
                summary.planetaryKpIndex >= 5 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
              }`}>
                Kp {summary.planetaryKpIndex} ({summary.spaceWeatherScale})
              </span>
            </div>

            {/* Solar Wind Velocity */}
            <div className="flex items-center gap-1.5 hidden md:flex">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Solar Wind:</span>
              <span className="text-white font-bold">{summary.solarWindSpeedKmS} km/s</span>
            </div>

            {/* IMF Bz Vector */}
            <div className="flex items-center gap-1.5 hidden lg:flex">
              <span className="text-slate-400">IMF Bz:</span>
              <span className={`font-bold ${summary.imfBzComponentNt < 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {summary.imfBzComponentNt > 0 ? `+${summary.imfBzComponentNt}` : summary.imfBzComponentNt} nT
              </span>
            </div>

            {/* Magnetopause Standoff */}
            <div className="flex items-center gap-1.5 hidden xl:flex">
              <span className="text-slate-400">Magnetopause:</span>
              <span className="text-white font-bold">{summary.magnetopauseStandoffRe} R⊕</span>
            </div>

            {/* Aurora Activity */}
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Aurora:</span>
              <span className="text-emerald-300 font-bold">{summary.auroraActivityLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace: 3D Canvas + Side Event Intelligence Deck */}
      <main className="relative flex-1 w-full min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* 3A. 3D WebGL Visualization Viewport */}
        <div className="relative flex-1 w-full h-full">
          <SpaceWeatherCanvas
            viewMode={viewMode}
            flares={data?.flares || []}
            cmes={data?.cmes || []}
            selectedFlare={selectedFlare}
            onSelectFlare={handleSelectFlare}
            kpIndex={summary.planetaryKpIndex}
            solarWindSpeedKmS={summary.solarWindSpeedKmS}
            imfBz={summary.imfBzComponentNt}
          />

          {/* Floating View Mode Switcher Pill */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#050C1E]/85 backdrop-blur-md border border-cyan-500/30 p-1.5 rounded-2xl shadow-2xl">
            <button
              onClick={() => {
                setViewMode('heliosphere');
                handleSpeak('Switching to Solar Heliosphere View. Visualizing active solar flares and coronal mass ejection particle clouds.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                viewMode === 'heliosphere'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Solar Heliosphere
            </button>

            <button
              onClick={() => {
                setViewMode('magnetosphere');
                handleSpeak('Switching to Earth Magnetosphere View. Visualizing day-side bow shock compression, magnetic dipole field lines, and polar aurora electrojets.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                viewMode === 'magnetosphere'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              Earth Magnetosphere & Aurora
            </button>
          </div>

          {/* Laura AI Narrative Banner */}
          <div className="absolute bottom-4 left-4 right-4 lg:right-96 z-20 bg-[#050C1E]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
                  Laura AI Space Weather Intelligence
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-200 border border-cyan-800">
                    LIVE ANALYSIS
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {lauraNarration}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex-shrink-0"
              title={isVoiceActive ? 'Mute voice narration' : 'Enable voice narration'}
            >
              {isVoiceActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3B. Side Telemetry & Event Deck */}
        <aside className="w-full lg:w-96 flex-none bg-[#050C1E]/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-cyan-500/20 flex flex-col max-h-[45vh] lg:max-h-full overflow-hidden z-20">
          {/* Deck Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                NASA DONKI Event Feed
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                CCMC Real-Time Space Weather Database
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              {(['all', 'flares', 'cmes', 'gsts'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-2 py-1 rounded uppercase transition-colors ${
                    selectedFilter === tab
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Events List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {/* 1. Solar Flares */}
            {(selectedFilter === 'all' || selectedFilter === 'flares') && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
                  <Sun className="w-3 h-3" />
                  Active Solar Flares ({data?.flares.length || 0})
                </div>
                {data?.flares.map((flare) => (
                  <div
                    key={flare.flrId}
                    onClick={() => handleSelectFlare(flare)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedFlare?.flrId === flare.flrId
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Class {flare.classType} Flare
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                        AR {flare.activeRegionNum || 'Quiet'}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                      <span>Coord: {flare.sourceLocation}</span>
                      <span>Peak: {new Date(flare.peakTime).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Coronal Mass Ejections */}
            {(selectedFilter === 'all' || selectedFilter === 'cmes') && (
              <div className="space-y-2 pt-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-orange-400 flex items-center gap-1.5 font-bold">
                  <Wind className="w-3 h-3" />
                  Coronal Mass Ejections ({data?.cmes.length || 0})
                </div>
                {data?.cmes.map((cme) => (
                  <div
                    key={cme.activityId}
                    onClick={() => handleSelectCme(cme)}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-orange-500/40 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        CME: {cme.speedKmS || 1200} km/s
                      </span>
                      <span className="text-[10px] font-mono text-orange-400">
                        Width: {cme.halfAngle || 42}°
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {cme.note}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Geomagnetic Storms */}
            {(selectedFilter === 'all' || selectedFilter === 'gsts') && (
              <div className="space-y-2 pt-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-3 h-3" />
                  Geomagnetic Storm Events ({data?.geomagneticStorms.length || 0})
                </div>
                {data?.geomagneticStorms.map((gst) => (
                  <div
                    key={gst.gstId}
                    onClick={() => handleSelectGst(gst)}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-rose-500/40 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-rose-300">
                        Storm Kp {gst.kpIndex}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(gst.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {gst.linkedEvents || 'Geomagnetic storming detected by magnetometer networks.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deck Footer / Source Attribution */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400">
              <Info className="w-3 h-3" />
              NASA GSFC CCMC DONKI
            </span>
            <a
              href="https://kauai.ccmc.gsfc.nasa.gov/DONKI/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-white flex items-center gap-1"
            >
              DONKI Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
};

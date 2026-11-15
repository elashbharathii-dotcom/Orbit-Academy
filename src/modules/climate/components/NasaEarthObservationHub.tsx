/**
 * ORBIT ACADEMY — CLIMATE LAB
 * NASA EARTH OBSERVATION HUB (NASA GIBS & EARTHDATA INTEGRATION)
 * 
 * Features:
 * - Real-time NASA GIBS Satellite Layer Selector (MODIS Terra/Aqua, VIIRS, Cloud Fraction, NDVI Vegetation, Active Fires)
 * - Historical Earth imagery time-travel comparison (compare 2 dates side-by-side or inspect historical satellite snapshots)
 * - Live satellite imagery viewer with full-resolution zoom and pan
 * - Direct integration to apply active NASA GIBS layer texture to the 3D Earth globe
 * - Explicit NASA EOSDIS scientific attribution and verified data classification badges
 */

import React, { useState, useEffect } from 'react';
import {
  NasaGibsLayer,
  NasaEonetEvent,
  NasaEpicImage,
  NasaPowerPointData,
} from '../../../services/nasa/types';
import { nasaClient } from '../../../services/nasa/nasaClient';
import { climateAudio } from '../audio/climateAudio';
import {
  Satellite,
  Calendar,
  Flame,
  Cloud,
  TreePine,
  Eye,
  ShieldCheck,
  Sparkles,
  Clock,
  Globe2,
  AlertTriangle,
  Compass,
  Wind,
  ExternalLink,
  Sun,
  Zap,
  Thermometer,
  Gauge,
  Droplets,
  RefreshCw,
} from 'lucide-react';

interface NasaEarthObservationHubProps {
  onApplyLayerToGlobe?: (layerId: string, date: string, wmsUrl: string) => void;
  onExplainWithLaura?: (topic: string, details: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'true-color': Satellite,
  atmosphere: Cloud,
  biosphere: TreePine,
  disaster: Flame,
};

export const NasaEarthObservationHub: React.FC<NasaEarthObservationHubProps> = ({
  onApplyLayerToGlobe,
  onExplainWithLaura,
}) => {
  const [activeSubDeck, setActiveSubDeck] = useState<'gibs' | 'power' | 'eonet' | 'epic'>('gibs');

  // --- 1. GIBS SATELLITE LAYERS STATE ---
  const [layers, setLayers] = useState<NasaGibsLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('MODIS_Terra_CorrectedReflectance_TrueColor');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date(Date.now() - 86400000);
    return d.toISOString().split('T')[0];
  });
  const [comparisonDate, setComparisonDate] = useState<string>('2023-08-15');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isAppliedToGlobe, setIsAppliedToGlobe] = useState<boolean>(false);

  // --- 2. NASA POWER SOLAR & METEOROLOGY STATE ---
  const [powerData, setPowerData] = useState<NasaPowerPointData | null>(null);
  const [powerLat, setPowerLat] = useState<number>(0);
  const [powerLon, setPowerLon] = useState<number>(0);
  const [isLoadingPower, setIsLoadingPower] = useState<boolean>(false);

  // --- 3. EONET ACTIVE NATURAL EVENTS STATE ---
  const [eonetEvents, setEonetEvents] = useState<NasaEonetEvent[]>([]);
  const [selectedEonetCategory, setSelectedEonetCategory] = useState<string>('all');

  // --- 4. EPIC DSCOVR EARTH IMAGERY STATE ---
  const [epicImages, setEpicImages] = useState<NasaEpicImage[]>([]);
  const [selectedEpicIndex, setSelectedEpicIndex] = useState<number>(0);

  // Load GIBS layers catalog
  useEffect(() => {
    nasaClient.getGibsLayers().then((res) => {
      setLayers(res.data.layers);
    });

    nasaClient.getEonetEvents().then((res) => {
      setEonetEvents(res.data);
    });

    nasaClient.getEpicImages().then((res) => {
      setEpicImages(res.data);
    });

    fetchPowerData(0, 0);
  }, []);

  const fetchPowerData = (lat: number, lon: number) => {
    setIsLoadingPower(true);
    nasaClient.getNasaPower(lat, lon).then((res) => {
      setPowerData(res.data);
      setIsLoadingPower(false);
    });
  };

  const activeLayer = layers.find((l) => l.id === selectedLayerId) || layers[0];

  // Primary WMS Imagery URL
  const primaryImageUrl = activeLayer
    ? nasaClient.getGibsWmsUrl(activeLayer.id, selectedDate)
    : '';

  // Historical Comparison WMS Imagery URL
  const comparisonImageUrl = activeLayer
    ? nasaClient.getGibsWmsUrl(activeLayer.id, comparisonDate)
    : '';

  const handleApplyToGlobe = () => {
    climateAudio.playSonarPing();
    setIsAppliedToGlobe(true);
    if (onApplyLayerToGlobe && activeLayer) {
      onApplyLayerToGlobe(activeLayer.id, selectedDate, primaryImageUrl);
    }
  };

  const handleAskLauraGibs = () => {
    if (onExplainWithLaura && activeLayer) {
      onExplainWithLaura(
        `NASA GIBS Satellite Observation: ${activeLayer.name}`,
        `Observing ${activeLayer.name} on ${selectedDate} captured by NASA's ${activeLayer.satellite} satellite sensor ${activeLayer.sensor}. ${activeLayer.description} This represents empirical satellite radiance data from NASA EOSDIS.`
      );
    }
  };

  const handleAskLauraEonet = (ev: NasaEonetEvent) => {
    if (onExplainWithLaura) {
      onExplainWithLaura(
        `NASA EONET Active Event: ${ev.title}`,
        `Explain the meteorological or geological forces behind ${ev.title} (Category: ${ev.categoryTitle}) observed at coordinates [${ev.latitude.toFixed(2)}, ${ev.longitude.toFixed(2)}]. Magnitude: ${ev.magnitude || 'Standard satellite thermal signature'}. How do NASA satellites monitor and track this event?`
      );
    }
  };

  const handleAskLauraEpic = (epic: NasaEpicImage) => {
    if (onExplainWithLaura) {
      onExplainWithLaura(
        `NASA EPIC Full-Disc Earth from Lagrange-1`,
        `Explain the DSCOVR spacecraft and its Earth Polychromatic Imaging Camera (EPIC) positioned 1.5 million kilometers away at the Sun-Earth Lagrange Point L1. Centroid coordinates centered at [${epic.centroidCoordinates.lat.toFixed(2)}, ${epic.centroidCoordinates.lon.toFixed(2)}]. What unique observations does EPIC provide for Earth science, cloud albedo, and atmospheric ozone?`
      );
    }
  };

  const filteredEonetEvents = selectedEonetCategory === 'all'
    ? eonetEvents
    : eonetEvents.filter((ev) => ev.category === selectedEonetCategory);

  const activeEpic = epicImages[selectedEpicIndex] || epicImages[0];

  return (
    <div className="space-y-4">
      {/* 1. MASTER DECK SELECTOR */}
      <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
                NASA Earth Observation Laboratory
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  EMPIRICAL SCIENCE DATA
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct integration with NASA EOSDIS GIBS, EONET Natural Event Tracker & DSCOVR EPIC
              </p>
            </div>
          </div>

          {/* Sub-deck Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveSubDeck('gibs');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeSubDeck === 'gibs'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              GIBS Satellites
            </button>
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveSubDeck('eonet');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeSubDeck === 'eonet'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              EONET Events & FIRMS ({eonetEvents.length})
            </button>
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveSubDeck('epic');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeSubDeck === 'epic'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              EPIC Lagrange-1 ({epicImages.length})
            </button>
            <button
              onClick={() => {
                climateAudio.playSonarPing();
                setActiveSubDeck('power');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeSubDeck === 'power'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              POWER Solar ({powerData ? 'Live' : 'Ready'})
            </button>
          </div>
        </div>

        {/* 2B. SUB-DECK B: NASA POWER SOLAR IRRADIANCE & METEOROLOGY */}
        {activeSubDeck === 'power' && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  NASA POWER: Prediction of Worldwide Energy Resources
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  MERRA-2 Reanalysis & CERES Satellite Radiative Flux Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800/40">
                1,361 W/m² SOLAR CONSTANT BASELINE
              </span>
            </div>

            {/* Region Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Presets:</span>
              {[
                { name: 'Equator (0°, 0°)', lat: 0, lon: 0 },
                { name: 'Sahara Desert (25°N, 13°E)', lat: 25, lon: 13 },
                { name: 'Amazon Basin (3°S, 60°W)', lat: -3, lon: -60 },
                { name: 'Arctic Circle (66°N, 0°)', lat: 66, lon: 0 },
              ].map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    climateAudio.playTick();
                    setPowerLat(loc.lat);
                    setPowerLon(loc.lon);
                    fetchPowerData(loc.lat, loc.lon);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                    powerLat === loc.lat && powerLon === loc.lon
                      ? 'border-cyan-400 bg-cyan-500/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>

            {/* Readouts Grid */}
            {isLoadingPower ? (
              <div className="flex items-center justify-center p-8 text-xs font-mono text-cyan-400 gap-2 border border-slate-800 rounded-xl bg-slate-900/40">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Fetching NASA POWER Solar & Meteorological fluxes...</span>
              </div>
            ) : powerData ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-yellow-400" />
                    All-Sky Insolation
                  </span>
                  <span className="text-lg font-bold text-yellow-400 mt-1">
                    {powerData.parameters.allSkySolarIrradianceWm2} W/m²
                  </span>
                  <span className="text-[9.5px] text-slate-500">Surface downward flux</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Top of Atmosphere (TOA)
                  </span>
                  <span className="text-lg font-bold text-amber-400 mt-1">
                    {powerData.parameters.topOfAtmosphereInsolationWm2} W/m²
                  </span>
                  <span className="text-[9.5px] text-slate-500">Extraterrestrial flux</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    2m Surface Temp
                  </span>
                  <span className="text-lg font-bold text-cyan-300 mt-1">
                    {powerData.parameters.temperature2mC > 0 ? `+${powerData.parameters.temperature2mC}°C` : `${powerData.parameters.temperature2mC}°C`}
                  </span>
                  <span className="text-[9.5px] text-slate-500">MERRA-2 2-meter air</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    Relative Humidity
                  </span>
                  <span className="text-lg font-bold text-blue-300 mt-1">
                    {powerData.parameters.relativeHumidity2mPercent}%
                  </span>
                  <span className="text-[9.5px] text-slate-500">Atmospheric moisture</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                    10m Wind Speed
                  </span>
                  <span className="text-lg font-bold text-emerald-300 mt-1">
                    {powerData.parameters.windSpeed10mMps} m/s
                  </span>
                  <span className="text-[9.5px] text-slate-500">Vector wind field</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] uppercase text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-purple-400" />
                    Surface Pressure
                  </span>
                  <span className="text-lg font-bold text-purple-300 mt-1">
                    {powerData.parameters.surfacePressureKpa} kPa
                  </span>
                  <span className="text-[9.5px] text-slate-500">Atmospheric pressure</span>
                </div>
              </div>
            ) : null}

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="font-mono text-[10.5px]">
                Source: {powerData?.source || 'NASA POWER / CERES & MERRA-2'} • Timestamp: {powerData?.timestamp ? new Date(powerData.timestamp).toLocaleDateString() : 'Active'}
              </span>
              <span className="text-cyan-400 font-mono text-[10px]">Verified NASA Scientific Standard</span>
            </div>
          </div>
        )}

        {/* 2A. SUB-DECK A: GIBS SATELLITE LAYERS */}
        {activeSubDeck === 'gibs' && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Active Satellite Sensors: MODIS (Terra/Aqua) & VIIRS (Suomi NPP)
              </span>
              <button
                onClick={() => {
                  climateAudio.playClick();
                  setIsCompareMode(!isCompareMode);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
                  isCompareMode
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                {isCompareMode ? 'Exit Date Comparison' : 'Historical Date Comparison'}
              </button>
            </div>

            {/* Layer preset selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {layers.map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                const Icon = CATEGORY_ICONS[layer.category] || Satellite;

                return (
                  <button
                    key={layer.id}
                    onClick={() => {
                      climateAudio.playSonarPing();
                      setSelectedLayerId(layer.id);
                      setIsAppliedToGlobe(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                        : 'bg-slate-900/50 border-slate-700/50 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold">{layer.name}</span>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {layer.satellite} • {layer.sensor}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Date bar & Action controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Observation Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  min="2000-03-01"
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    climateAudio.playTick();
                    setSelectedDate(e.target.value);
                    setIsAppliedToGlobe(false);
                  }}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {isCompareMode && (
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Historical Reference Date:</span>
                  <input
                    type="date"
                    value={comparisonDate}
                    min="2000-03-01"
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      climateAudio.playTick();
                      setComparisonDate(e.target.value);
                    }}
                    className="bg-slate-950 border border-amber-500/40 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyToGlobe}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isAppliedToGlobe
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md active:scale-95'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isAppliedToGlobe ? 'Mapped to 3D Globe' : 'Map to 3D Earth'}
                </button>

                <button
                  onClick={handleAskLauraGibs}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-700/50 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Laura
                </button>
              </div>
            </div>

            {/* Satellite Imagery Display Frame */}
            {!isCompareMode ? (
              <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                {primaryImageUrl && (
                  <img
                    src={primaryImageUrl}
                    alt={activeLayer?.name || 'NASA Satellite Imagery'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/textures/earth_daymap.jpg';
                    }}
                  />
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300">
                  {activeLayer?.attribution} • Date: {selectedDate}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative h-60 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950">
                  <img
                    src={primaryImageUrl}
                    alt={`NASA ${selectedDate}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-mono text-cyan-200">
                    Primary: {selectedDate}
                  </div>
                </div>

                <div className="relative h-60 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950">
                  <img
                    src={comparisonImageUrl}
                    alt={`NASA ${comparisonDate}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-200">
                    Historical: {comparisonDate}
                  </div>
                </div>
              </div>
            )}

            {/* Scientific Description & Attributions */}
            {activeLayer && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{activeLayer.name}</span>
                  <span className="text-[10px] text-slate-400">{activeLayer.attribution}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeLayer.description}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified NASA EOSDIS Public Domain Data • EPSG:4326 Equirectangular Projection</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2B. SUB-DECK B: NASA EONET NATURAL EVENTS & FIRMS THERMAL ALERTS */}
        {activeSubDeck === 'eonet' && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Category:</span>
                {['all', 'wildfires', 'severeStorms', 'volcanoes', 'floods'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      climateAudio.playClick();
                      setSelectedEonetCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors ${
                      selectedEonetCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                NASA Goddard EONET v3.0 Feed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/30">
              {filteredEonetEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        {ev.category === 'wildfires' && <Flame className="w-3.5 h-3.5 text-rose-400" />}
                        {ev.category === 'severeStorms' && <Wind className="w-3.5 h-3.5 text-cyan-400" />}
                        {ev.category === 'volcanoes' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {ev.category === 'floods' && <Cloud className="w-3.5 h-3.5 text-blue-400" />}
                        {ev.title}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ev.categoryTitle}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Event ID: {ev.id} • Date: {new Date(ev.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-cyan-400" />
                      [{ev.latitude.toFixed(2)}°, {ev.longitude.toFixed(2)}°]
                    </span>
                    {ev.magnitude && (
                      <span className="text-amber-300 font-medium">{ev.magnitude}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleAskLauraEonet(ev)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Explain with Laura
                    </button>
                    {ev.sourceUrl && (
                      <a
                        href={ev.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2C. SUB-DECK C: NASA EPIC DSCOVR LAGRANGE-1 FULL-DISC EARTH */}
        {activeSubDeck === 'epic' && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                NASA DSCOVR Spacecraft • Sun-Earth L1 Lagrange Orbit (1,500,000 km)
              </span>
              <button
                onClick={() => activeEpic && handleAskLauraEpic(activeEpic)}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Explain with Laura
              </button>
            </div>

            {activeEpic && (
              <div className="space-y-3">
                <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <img
                    src={activeEpic.imageUrl}
                    alt={activeEpic.caption}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/textures/earth_daymap.jpg';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300">
                    DSCOVR EPIC • Centroid: [{activeEpic.centroidCoordinates.lat.toFixed(1)}°, {activeEpic.centroidCoordinates.lon.toFixed(1)}°] • {activeEpic.date}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 font-mono">
                  {activeEpic.caption}
                </div>

                {/* Thumbnail strip */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {epicImages.map((img, idx) => (
                    <button
                      key={img.identifier}
                      onClick={() => {
                        climateAudio.playTick();
                        setSelectedEpicIndex(idx);
                      }}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border flex-shrink-0 transition-all ${
                        selectedEpicIndex === idx
                          ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.thumbUrl}
                        alt={img.identifier}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

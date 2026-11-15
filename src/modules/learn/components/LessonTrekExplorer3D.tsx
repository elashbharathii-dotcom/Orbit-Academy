import React, { useState } from 'react';
import { usePlanetaryData } from '../../../services/planetary-data/usePlanetaryData';
import { NasaTrekBody, NasaTrekNomenclature, NasaTrekBookmark } from '../../../services/nasa/types';
import { PlanetarySphere3D } from '../../planetary-preview/components/PlanetarySphere3D';
import { TrekLandmarkFeature } from '../learnData';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import {
  Globe2,
  Layers,
  MapPin,
  Compass,
  Sparkles,
  RefreshCw,
  Mountain,
  Info,
} from 'lucide-react';

interface LessonTrekExplorer3DProps {
  trekBody: NasaTrekBody;
  features?: TrekLandmarkFeature[];
  onSelectFeature?: (feature: TrekLandmarkFeature) => void;
  title?: string;
}

export const LessonTrekExplorer3D: React.FC<LessonTrekExplorer3DProps> = ({
  trekBody,
  features = [],
  onSelectFeature,
  title,
}) => {
  const {
    layers,
    activeLayer,
    selectLayerById,
    texture,
    progress,
  } = usePlanetaryData({ initialBody: trekBody });

  const [activeTab, setActiveTab] = useState<'3d' | '2d-map'>('3d');
  const [selectedFeature, setSelectedFeature] = useState<TrekLandmarkFeature | null>(
    features.length > 0 ? features[0] : null
  );

  const handleSelect = (feat: TrekLandmarkFeature) => {
    setSelectedFeature(feat);
    if (onSelectFeature) {
      onSelectFeature(feat);
    }
  };

  // Convert features to nomenclature for the 3D sphere markers
  const landmarkMarkers: NasaTrekNomenclature[] = features.map((f, idx) => ({
    id: `feat-${idx}`,
    title: f.name,
    body: trekBody,
    featureCategory: f.elevationKm && f.elevationKm > 0 ? 'Mons / Elevation' : 'Crater / Basin',
    latitude: f.lat,
    longitude: f.lon,
    bbox: `${f.lat - 1},${f.lon - 1},${f.lat + 1},${f.lon + 1}`,
    shape: 'Point',
    diameterKm: f.elevationKm ? Math.abs(f.elevationKm) * 50 : 120,
    description: f.description,
    origin: 'NASA Planetary Data System',
  }));

  const handleSphereMarkerSelect = (item: NasaTrekNomenclature | NasaTrekBookmark) => {
    const itemName = item.title;
    const matched = features.find((f) => f.name.toLowerCase() === itemName.toLowerCase());
    if (matched) {
      handleSelect(matched);
    } else {
      handleSelect({
        name: itemName,
        lat: item.latitude,
        lon: item.longitude,
        description: item.description || 'Geological feature recorded by NASA planetary cartography.',
        scientificSignificance: `Target latitude: ${item.latitude.toFixed(2)}°, longitude: ${item.longitude.toFixed(2)}°.`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0B1226]/80 border border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Globe2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-sans text-sm font-bold text-white flex items-center gap-2">
              <span>{title || `NASA ${trekBody.toUpperCase()} Scientific Terrain Explorer`}</span>
              <TelemetryBadge label="LIVE TREK WMTS" tone="cyan" size="sm" />
            </h3>
            <p className="font-mono text-[10px] text-[#94A3B8]">
              Target: {trekBody.toUpperCase()} // Equirectangular Projection // IAU Coordinates
            </p>
          </div>
        </div>

        {/* View mode toggle (3D Globe vs 2D Stitched Satellite Map) */}
        <div className="flex items-center gap-1.5 rounded-xl bg-black/40 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === '3d'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Globe</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('2d-map')}
            className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              activeTab === '2d-map'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Satellite Map</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Container */}
      <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#02050E] shadow-2xl">
        {activeTab === '3d' ? (
          <>
            <PlanetarySphere3D
              texture={texture}
              bodyName={trekBody}
              landmarks={landmarkMarkers}
              bookmarks={[]}
              selectedLandmarkId={selectedFeature?.name || null}
              onSelectLandmark={handleSphereMarkerSelect}
              isRotating={true}
            />

            {/* Orbit controls helper pill */}
            <div className="absolute top-3 left-3 pointer-events-none rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#94A3B8] border border-white/10">
              Drag to Orbit • Scroll to Zoom • Click Pins to Inspect
            </div>
          </>
        ) : (
          /* 2D Stitched Map View */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#040817] to-[#02050D]">
            {texture && texture.image ? (
              <div className="relative max-w-full max-h-full rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl">
                <img
                  src={(texture.image as HTMLCanvasElement).toDataURL?.() || ''}
                  alt={`${trekBody} stitched map`}
                  className="max-h-[360px] object-contain rounded-lg"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/75 border border-white/10 font-mono text-[9px] text-cyan-300">
                  Global Equirectangular Projection (-180° to +180° Lon / -90° to +90° Lat)
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#94A3B8] font-mono text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span>Stitching NASA WMTS Equirectangular tiles...</span>
              </div>
            )}
          </div>
        )}

        {/* Loading Progress Overlay */}
        {progress.stage === 'downloading-tiles' && (
          <div className="absolute top-3 right-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-2 shadow-lg">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Loading Tiles: {progress.percent}%</span>
          </div>
        )}

        {/* Floating Layer Switcher Bar */}
        {layers.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex flex-wrap items-center gap-1.5 rounded-xl bg-black/75 backdrop-blur-md p-1.5 border border-white/10 z-20">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#94A3B8] px-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Layers:</span>
            </span>
            {layers.map((lay) => (
              <button
                key={lay.id}
                type="button"
                onClick={() => selectLayerById(lay.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] transition-all whitespace-nowrap ${
                  activeLayer?.id === lay.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10'
                }`}
              >
                {lay.title.replace(trekBody.toUpperCase(), '').replace('Global', '').trim()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Geological Landmark Selection Strip */}
      {features.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-[10.5px] text-[#94A3B8]">
            <span className="flex items-center gap-1 font-bold text-white">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Scientific Landmarks ({features.length})</span>
            </span>
            <span>Click landmark to focus inspection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {features.map((feat) => {
              const isSelected = selectedFeature?.name === feat.name;
              return (
                <button
                  key={feat.name}
                  type="button"
                  onClick={() => handleSelect(feat)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                      : 'border-white/10 bg-[#0B1226]/60 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{feat.name}</span>
                    </span>
                    {feat.elevationKm !== undefined && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">
                        {feat.elevationKm > 0 ? `+${feat.elevationKm} km` : `${feat.elevationKm} km`}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-mono text-[9.5px] text-[#94A3B8]">
                    {feat.lat >= 0 ? `${feat.lat.toFixed(1)}°N` : `${Math.abs(feat.lat).toFixed(1)}°S`},{' '}
                    {feat.lon >= 0 ? `${feat.lon.toFixed(1)}°E` : `${Math.abs(feat.lon).toFixed(1)}°W`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Landmark Scientific Telemetry Dossier */}
      {selectedFeature && (
        <GlassCard variant="elevated" glowingBorder="cyan" className="p-4 bg-[#070C1B]/95 border-cyan-500/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="font-sans text-sm font-bold text-white">
                {selectedFeature.name}
              </h4>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-300">
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
                Lat: {selectedFeature.lat.toFixed(2)}°
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
                Lon: {selectedFeature.lon.toFixed(2)}°
              </span>
            </div>
          </div>

          <p className="text-xs text-[#E2E8F0] leading-relaxed mb-2">
            {selectedFeature.description}
          </p>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-cyan-300">Scientific Significance: </strong>
              <span>{selectedFeature.scientificSignificance}</span>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

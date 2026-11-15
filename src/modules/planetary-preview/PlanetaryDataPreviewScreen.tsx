import React, { useState } from 'react';
import { MasterHeader } from '../../components/navigation/MasterHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { NasaTrekBody, NasaTrekNomenclature, NasaTrekBookmark } from '../../services/nasa/types';
import { usePlanetaryData } from '../../services/planetary-data/usePlanetaryData';
import { PlanetarySphere3D } from './components/PlanetarySphere3D';
import {
  Globe2,
  Layers,
  MapPin,
  ExternalLink,
  Volume2,
  VolumeX,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Radio,
  Compass,
  FileText,
} from 'lucide-react';

export const PlanetaryDataPreviewScreen: React.FC = () => {
  const {
    body,
    selectBody,
    layers,
    activeLayer,
    selectLayerById,
    nomenclature,
    bookmarks,
    texture,
    isLoadingMetadata,
    progress,
    isUsingFallback,
    reloadTexture,
  } = usePlanetaryData({ initialBody: 'mars' });

  const [activeTab, setActiveTab] = useState<'3d' | '2d-stitched' | 'tiles'>('3d');
  const [selectedItem, setSelectedItem] = useState<NasaTrekNomenclature | NasaTrekBookmark | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hoverCoord, setHoverCoord] = useState<{ lat: number; lon: number } | null>(null);

  // Laura Speech Narration
  const handleNarrate = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const supportedBodies: Array<{ id: NasaTrekBody; label: string; icon: string }> = [
    { id: 'mars', label: 'Mars', icon: '🔴' },
    { id: 'moon', label: 'Moon', icon: '🌕' },
    { id: 'mercury', label: 'Mercury', icon: '⚪' },
    { id: 'titan', label: 'Titan', icon: '🪐' },
    { id: 'ceres', label: 'Ceres', icon: '🌑' },
    { id: 'vesta', label: 'Vesta', icon: '☄️' },
  ];

  return (
    <div className="min-h-screen bg-[#02050D] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* 1. MASTER APPLICATION HEADER */}
      <MasterHeader />

      {/* 2. SUB-HEADER TELEMETRY BAR */}
      <div className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 py-3 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wider text-white">
                  NASA SOLAR SYSTEM TREKS — PLANETARY DATA FOUNDATION
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  STAGE 1 VERIFIER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official OGC RESTful WMTS Layer Services • Planetary Coordinate Nomenclature • Authentic JPL Datasets
              </p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2">
            {isUsingFallback ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                AUTHENTIC OFFLINE BASELINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                LIVE NASA TREK WMTS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6 flex-1 flex flex-col gap-6">
        {/* Planetary Destination Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md p-2 rounded-xl border border-cyan-500/20">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-mono text-cyan-400 px-2 uppercase tracking-wider flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> Destination:
            </span>
            {supportedBodies.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  selectBody(b.id);
                  setSelectedItem(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  body === b.id
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activeTab === '3d' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Sphere
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('2d-stitched')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activeTab === '2d-stitched' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Stitched Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tiles')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activeTab === 'tiles' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              WMTS Tiles
            </button>
          </div>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* LEFT COLUMN: Available Data Layers (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <GlassCard className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                    NASA Map Layers ({layers.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={reloadTexture}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
                  title="Reload Active Layer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Layer Selection List */}
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                {isLoadingMetadata ? (
                  <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                    Querying NASA Solar System Treks Solr Catalog...
                  </div>
                ) : layers.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No layers cataloged for {body}.
                  </div>
                ) : (
                  layers.map((layer) => {
                    const isSelected = activeLayer?.id === layer.id;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => selectLayerById(layer.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-semibold text-white leading-snug">
                            {layer.title}
                          </h3>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                            {layer.productCat1 || 'Layer'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {layer.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-1.5 border-t border-slate-800/60">
                          <span>{layer.mission.split('(')[0].trim()}</span>
                          <span className="text-cyan-300">{layer.resolution || 'Global'}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Progress Indicator */}
              {progress.stage !== 'idle' && progress.stage !== 'ready' && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400">{progress.message}</span>
                    <span className="text-white font-bold">{progress.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Direct WMTS Tile Verification Card */}
            {activeLayer && (
              <GlassCard className="p-4 flex flex-col gap-2 text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" /> WMTS Endpoint Probe
                </span>
                <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-[10px] text-slate-300 break-all select-all">
                  {activeLayer.wmtsTemplate}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 text-[11px]">Format: {activeLayer.format?.toUpperCase()}</span>
                  <a
                    href={activeLayer.sampleTileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                  >
                    <span>Inspect Raw Tile (0/0/0)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </GlassCard>
            )}
          </div>

          {/* CENTER COLUMN: Visual Viewport (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square md:aspect-[4/3] w-full rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950">
              {activeTab === '3d' && (
                <PlanetarySphere3D
                  texture={texture}
                  bodyName={body}
                  landmarks={nomenclature}
                  bookmarks={bookmarks}
                  selectedLandmarkId={selectedItem?.id || null}
                  onSelectLandmark={setSelectedItem}
                  isRotating={isRotating}
                />
              )}

              {activeTab === '2d-stitched' && (
                <div
                  className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 cursor-crosshair"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    const lon = Math.round((x * 360 - 180) * 10) / 10;
                    const lat = Math.round(((1 - y) * 180 - 90) * 10) / 10;
                    setHoverCoord({ lat, lon });
                  }}
                  onMouseLeave={() => setHoverCoord(null)}
                >
                  {texture?.image ? (
                    <img
                      src={texture.image.toDataURL ? texture.image.toDataURL() : activeLayer?.sampleTileUrl}
                      alt="Planetary Equirectangular Projection"
                      className="max-w-full max-h-full object-contain rounded border border-cyan-500/30 shadow-2xl"
                    />
                  ) : (
                    <div className="text-center text-xs text-slate-400">Loading Stitched Texture...</div>
                  )}

                  {hoverCoord && (
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-cyan-500/40 px-2.5 py-1 rounded text-xs font-mono text-cyan-300 pointer-events-none">
                      COORDINATES: {hoverCoord.lat}°N, {hoverCoord.lon}°E
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tiles' && activeLayer && (
                <div className="w-full h-full p-4 overflow-y-auto flex flex-col gap-3">
                  <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    WMTS Zoom Level 0 Tiles (2x1 Grid)
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5 p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-[11px] font-mono text-slate-300">Tile [0, 0] — West (-180° to 0°)</span>
                      <img
                        src={activeLayer.wmtsTemplate.replace('{TileMatrix}', '0').replace('{TileRow}', '0').replace('{TileCol}', '0')}
                        alt="West Tile"
                        className="rounded border border-cyan-500/20 aspect-square object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-[11px] font-mono text-slate-300">Tile [0, 1] — East (0° to 180°)</span>
                      <img
                        src={activeLayer.wmtsTemplate.replace('{TileMatrix}', '0').replace('{TileRow}', '0').replace('{TileCol}', '1')}
                        alt="East Tile"
                        className="rounded border border-cyan-500/20 aspect-square object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Viewport Action Controls */}
              {activeTab === '3d' && (
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRotating(!isRotating)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950"
                  >
                    {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
                  </button>
                </div>
              )}
            </div>

            {/* Scientific Provenance Summary */}
            {activeLayer && (
              <GlassCard className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Scientific Attribution & Provenance
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    NASA SCIENTIFIC DATA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mission</span>
                    <span className="text-white font-semibold">{activeLayer.mission}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Instrument</span>
                    <span className="text-white font-semibold">{activeLayer.instrument}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Spatial Resolution</span>
                    <span className="text-cyan-300 font-mono">{activeLayer.resolution || 'Global'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Map Projection</span>
                    <span className="text-white font-mono">{activeLayer.projection}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                  <span className="font-semibold text-slate-300">Data Source: </span>
                  NASA Solar System Treks, Jet Propulsion Laboratory (JPL) & USGS Astrogeology Science Center.
                </div>
              </GlassCard>
            )}
          </div>

          {/* RIGHT COLUMN: Nomenclature & Landing Bookmarks (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <GlassCard className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                    Landmarks ({nomenclature.length + bookmarks.length})
                  </h2>
                </div>
              </div>

              {/* Selected Landmark Details */}
              {selectedItem ? (
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-white">{selectedItem.title}</h3>
                    <button
                      type="button"
                      onClick={() => handleNarrate(selectedItem.description)}
                      className="p-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 transition"
                      title="Listen with Laura AI"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{selectedItem.latitude.toFixed(2)}°N, {selectedItem.longitude.toFixed(2)}°E</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="text-[10px] text-slate-400 hover:text-white underline text-left pt-1"
                  >
                    Close inspector
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Select a crater, mountain, or landing site below or tap a 3D marker on the sphere.
                </p>
              )}

              {/* Landmarks List */}
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {/* Rover Landing Sites */}
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => setSelectedItem(bm)}
                    className={`p-2 rounded border cursor-pointer transition text-xs flex items-center justify-between ${
                      selectedItem?.id === bm.id
                        ? 'bg-emerald-950/50 border-emerald-400 text-white'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-none" />
                      <span className="truncate font-semibold">{bm.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 flex-none">LANDER</span>
                  </div>
                ))}

                {/* Nomenclature Features */}
                {nomenclature.map((nm) => (
                  <div
                    key={nm.id}
                    onClick={() => setSelectedItem(nm)}
                    className={`p-2 rounded border cursor-pointer transition text-xs flex items-center justify-between ${
                      selectedItem?.id === nm.id
                        ? 'bg-amber-950/50 border-amber-400 text-white'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-none" />
                      <span className="truncate">{nm.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-none">
                      {nm.featureCategory.split(',')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

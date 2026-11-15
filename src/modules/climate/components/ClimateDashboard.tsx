import React, { useState, useMemo } from 'react';
import {
  ClimateLayerId,
  ClimateLocationTelemetry,
} from '../types';
import {
  CLIMATE_LAYERS,
  NOTABLE_CLIMATE_LOCATIONS,
} from '../climateData';
import {
  Layers,
  Calendar,
  Search,
  Globe2,
  Sliders,
  Thermometer,
  Sun,
  Droplets,
  Gauge,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface ClimateDashboardProps {
  activeLayerId: ClimateLayerId;
  onSelectLayer: (layerId: ClimateLayerId) => void;
  layerOpacity: number;
  onOpacityChange: (opacity: number) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onFocusLocation?: (coords: { lat: number; lon: number }) => void;
  onExplainWithLaura?: (title: string, details: string) => void;
}

export const ClimateDashboard: React.FC<ClimateDashboardProps> = ({
  activeLayerId,
  onSelectLayer,
  layerOpacity,
  onOpacityChange,
  selectedDate,
  onDateChange,
  onFocusLocation,
  onExplainWithLaura,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<ClimateLocationTelemetry>(
    NOTABLE_CLIMATE_LOCATIONS[0]
  );

  const activeLayer =
    CLIMATE_LAYERS.find((l) => l.id === activeLayerId) || CLIMATE_LAYERS[0];

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return NOTABLE_CLIMATE_LOCATIONS;
    return NOTABLE_CLIMATE_LOCATIONS.filter((loc) =>
      loc.cityName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectLocation = (loc: ClimateLocationTelemetry) => {
    setSelectedLocation(loc);
    if (onFocusLocation) {
      onFocusLocation(loc.coordinates);
    }
  };

  const DATE_PRESETS = [
    { label: 'Summer Solstice (Jun 2024)', date: '2024-06-21' },
    { label: 'Spring Equinox (Mar 2024)', date: '2024-03-20' },
    { label: 'Winter Solstice (Dec 2023)', date: '2023-12-21' },
    { label: 'Arctic Sea Ice Min (Sep 2023)', date: '2023-09-18' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Global Viewport & Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0B1528] border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>ACTIVE SATELLITE LAYER</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-cyan-300 mt-2 truncate">
            {activeLayer.name}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Sensor: {activeLayer.sensor.split(' ')[0]} • Res: {activeLayer.spatialResolution}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>OBSERVATION DATE</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-mono font-bold text-indigo-300 mt-2">
            {selectedDate}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            NASA EOSDIS Daily Synchronized
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>LOCAL SOLAR FLUX</span>
            <Sun className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-mono font-bold text-emerald-300 mt-2">
            {selectedLocation.solarFluxWm2} W/m²
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            POWER Point: [{selectedLocation.coordinates.lat.toFixed(1)}°, {selectedLocation.coordinates.lon.toFixed(1)}°]
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1528] border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>LOCAL SURFACE SKIN</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-mono font-bold text-amber-300 mt-2">
            {selectedLocation.temperatureC > 0
              ? `+${selectedLocation.temperatureC}°C`
              : `${selectedLocation.temperatureC}°C`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {selectedLocation.cityName.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* 2. Visual Layer Selector Toolbar */}
      <div className="p-5 rounded-2xl bg-[#070C1B] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Globe2 className="w-4 h-4" />
              NASA Earth Observation Visual Layers (8 Validated Systems)
            </div>
            <p className="text-xs text-slate-400">
              Select an official satellite data layer to drape over the global environment:
            </p>
          </div>

          {/* Opacity Control Slider */}
          <div className="flex items-center gap-3 bg-[#0B1528] px-3.5 py-2 rounded-xl border border-white/5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Layer Opacity:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={layerOpacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="w-24 accent-cyan-400"
            />
            <span className="font-mono text-cyan-300 text-xs">
              {Math.round(layerOpacity * 100)}%
            </span>
          </div>
        </div>

        {/* 8 Layer Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CLIMATE_LAYERS.map((layer) => {
            const isSelected = layer.id === activeLayerId;
            return (
              <button
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-[#0B1528] border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {layer.category}
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {layer.shortName}
                </div>
                <div className="text-[10px] font-mono text-cyan-400/80 truncate mt-1">
                  {layer.units}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main 2-Column Deck: Layer Details & Scientific Legend (Left) + Date/Location Search (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Layer Specification & Scientific Color Legend (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#070C1B] border border-white/10 space-y-5">
            {/* Layer Header */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeLayer.sensor}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Platform: {activeLayer.satellite}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeLayer.name}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeLayer.description}
              </p>
            </div>

            {/* Scientific Significance Card */}
            <div className="p-3.5 rounded-xl bg-[#0B1528] border border-cyan-500/20 text-xs text-slate-300 space-y-2">
              <div>
                <strong className="text-cyan-300 font-semibold block">
                  Scientific Relevance:
                </strong>
                <p className="text-slate-400 leading-relaxed text-[11px] mt-1">
                  {activeLayer.scientificSignificance}
                </p>
              </div>

              {onExplainWithLaura && (
                <button
                  type="button"
                  onClick={() => onExplainWithLaura(activeLayer.name, activeLayer.scientificSignificance)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  Ask Laura to Explain
                </button>
              )}
            </div>

            {/* Scientific Color Legend Bar */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Scientific Legend & Calibration</span>
                <span className="font-mono text-cyan-300">Unit: {activeLayer.units}</span>
              </div>

              {/* Color Gradient Strip */}
              <div className="h-6 w-full rounded-lg overflow-hidden border border-white/10 flex">
                {activeLayer.legendStops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-full"
                    style={{ backgroundColor: stop.color }}
                    title={`${stop.label}`}
                  />
                ))}
              </div>

              {/* Tick Labels */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                {activeLayer.legendStops.map((stop, idx) => (
                  <span key={idx} className="truncate">
                    {stop.label}
                  </span>
                ))}
              </div>
            </div>

            {/* NASA Sensor Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0B1528] border border-white/5">
                <div className="text-[10px] text-slate-500 font-mono">SPATIAL RESOLUTION</div>
                <div className="font-bold text-white mt-0.5">{activeLayer.spatialResolution}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B1528] border border-white/5">
                <div className="text-[10px] text-slate-500 font-mono">TEMPORAL REVISIT</div>
                <div className="font-bold text-white mt-0.5">{activeLayer.temporalResolution}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0B1528] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500 font-mono">DATA ARCHIVE</div>
                <div className="font-bold text-cyan-300 truncate mt-0.5">{activeLayer.attribution.split('/')[1] || 'NASA EOSDIS'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Date Selection & Location Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Date Selector Card */}
          <div className="p-5 rounded-2xl bg-[#070C1B] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Calendar className="w-4 h-4" /> Date Selection
              </span>
              <span className="text-[10px] font-mono text-slate-500">NASA GIBS Time-Travel</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0B1528] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />

            {/* Date Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Benchmark Observation Dates:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {DATE_PRESETS.map((p) => (
                  <button
                    key={p.date}
                    onClick={() => onDateChange(p.date)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all ${
                      selectedDate === p.date
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                        : 'bg-[#0B1528] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold truncate text-[11px]">{p.label}</div>
                    <div className="font-mono text-[9px] text-slate-500">{p.date}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Search & Meteorological Telemetry */}
          <div className="p-5 rounded-2xl bg-[#070C1B] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <MapPin className="w-4 h-4" /> Global Point Inspection
              </span>
              <span className="text-[10px] font-mono text-slate-500">NASA POWER / MERRA-2</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search global city or region..."
                className="w-full pl-9 pr-3 py-2 bg-[#0B1528] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Quick Location Pills */}
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {filteredLocations.map((loc) => {
                const isSelected = loc.cityName === selectedLocation.cityName;
                return (
                  <button
                    key={loc.cityName}
                    onClick={() => handleSelectLocation(loc)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'bg-[#0B1528] text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {loc.cityName.split(' (')[0]}
                  </button>
                );
              })}
            </div>

            {/* Selected Location Telemetry Display */}
            <div className="p-3.5 rounded-xl bg-[#0B1528] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">{selectedLocation.cityName}</span>
                <span className="font-mono text-[10px] text-cyan-400">
                  [{selectedLocation.coordinates.lat.toFixed(1)}°, {selectedLocation.coordinates.lon.toFixed(1)}°]
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/5 font-mono">
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Temp: {selectedLocation.temperatureC}°C</span>
                </div>
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Solar: {selectedLocation.solarFluxWm2} W/m²</span>
                </div>
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Humidity: {selectedLocation.relativeHumidityPct}%</span>
                </div>
                <div className="text-slate-300 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Press: {selectedLocation.surfacePressureHpa} hPa</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Source: {selectedLocation.dataSource} • {selectedLocation.timestamp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

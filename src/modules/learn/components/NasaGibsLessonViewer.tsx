import React, { useState } from 'react';
import { Globe2, Calendar } from 'lucide-react';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';

export interface GibsLayerInfo {
  id: string;
  name: string;
  instrument: string;
  unit: string;
  description: string;
  imageUrl: string;
  timestamp: string;
}

const DEFAULT_GIBS_LAYERS: GibsLayerInfo[] = [
  {
    id: 'modis-truecolor',
    name: 'MODIS Corrected Reflectance (True Color)',
    instrument: 'Terra / MODIS (NASA GIBS)',
    unit: 'Reflectance (Bands 1-4-3)',
    description: 'Natural-color Earth imagery capturing storm tracks, continental snow cover, and cloud dynamics.',
    imageUrl: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/world.topo.bathy.200407.3x5400x2700.jpg',
    timestamp: '2026-11-14 UTC',
  },
  {
    id: 'surface-temp',
    name: 'Land Surface Temperature (LST Day)',
    instrument: 'Aqua / MODIS (NASA GIBS)',
    unit: 'Kelvin (K) / °C',
    description: 'Thermal radiative skin temperature of continents showing polar vortex freeze and equatorial heating.',
    imageUrl: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200408.3x5400x2700.jpg',
    timestamp: '2026-11-14 UTC',
  },
  {
    id: 'aerosol-depth',
    name: 'Aerosol Optical Depth (AOD)',
    instrument: 'Suomi NPP / VIIRS (NASA GIBS)',
    unit: 'Dimensionless (0.0 - 2.5)',
    description: 'Atmospheric particulate loading from desert dust storms, volcanic plumes, and biomass fires.',
    imageUrl: 'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73726/world.topo.bathy.200406.3x5400x2700.jpg',
    timestamp: '2026-11-14 UTC',
  },
];

interface NasaGibsLessonViewerProps {
  className?: string;
}

export const NasaGibsLessonViewer: React.FC<NasaGibsLessonViewerProps> = ({
  className = '',
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('modis-truecolor');
  const activeLayer = DEFAULT_GIBS_LAYERS.find((l) => l.id === selectedLayerId) || DEFAULT_GIBS_LAYERS[0];

  return (
    <div
      className={`rounded-3xl border border-[#34D399]/20 bg-[#070C1B]/95 backdrop-blur-2xl p-5 shadow-2xl space-y-4 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399]">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-extrabold text-white">
                NASA GIBS Earth Observation Imagery
              </span>
              <TelemetryBadge label="LIVE WMTS" tone="emerald" size="sm" />
            </div>
            <p className="font-mono text-[11px] text-[#94A3B8]">
              NASA Global Imagery Browse Services // EPSG:4326 Equirectangular
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8]">
          <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>{activeLayer.timestamp}</span>
        </div>
      </div>

      {/* Layer Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        {DEFAULT_GIBS_LAYERS.map((layer) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => setSelectedLayerId(layer.id)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-[11px] transition-all ${
              selectedLayerId === layer.id
                ? 'border-[#34D399] bg-[#34D399]/20 text-[#34D399] font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                : 'border-white/10 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
            }`}
          >
            {layer.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Imagery Stage */}
      <div className="relative w-full h-64 rounded-2xl bg-[#030611] border border-white/10 overflow-hidden group">
        <img
          src={activeLayer.imageUrl}
          alt={activeLayer.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-transparent pointer-events-none" />

        {/* Overlay Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
          <div className="p-2 rounded-xl bg-[#070C1B]/90 backdrop-blur-md border border-white/10 text-white">
            <span className="font-bold text-[#34D399]">{activeLayer.name}</span>
            <span className="block text-[10px] text-[#94A3B8]">{activeLayer.instrument} • {activeLayer.unit}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-mono text-[11.5px] text-[#CBD5E1] leading-relaxed">
        {activeLayer.description}
      </p>
    </div>
  );
};

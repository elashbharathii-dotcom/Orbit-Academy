import React, { useState } from 'react';
import { MapPin, Globe, CheckCircle2, XCircle, Crosshair } from 'lucide-react';
import { MapTargetZone, QuizQuestion } from '../types';
import { quizAudio } from '../audio/quizAudio';

interface InteractiveMapRendererProps {
  question?: QuizQuestion;
  targetBody?: 'mars' | 'moon' | 'earth' | 'mercury';
  targetZones?: MapTargetZone[];
  selectedZoneId?: string | null;
  onSelectZone?: (zoneId: string | null) => void;
  options?: string[];
  selectedOption?: number | null;
  correctIndex?: number;
  isSubmitted: boolean;
  onSelectOption?: (idx: number) => void;
  disabled?: boolean;
}

export const InteractiveMapRenderer: React.FC<InteractiveMapRendererProps> = ({
  question,
  targetBody: propsBody,
  targetZones: propsZones,
  selectedZoneId,
  onSelectZone,
  options: propsOptions,
  selectedOption: propsSelectedOption,
  correctIndex: propsCorrectIndex,
  isSubmitted,
  onSelectOption,
  disabled = false,
}) => {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const effectiveBody = propsBody || question?.mapTargetBody || 'mars';
  const effectiveZones = propsZones || question?.mapTargetZones || [];
  const effectiveOptions = propsOptions || question?.options || [];
  const effectiveCorrectIndex = propsCorrectIndex ?? question?.correctIndex ?? 0;
  const effectiveSelectedOption = propsSelectedOption ?? null;

  // Helper to map lat/lon (-90..+90, -180..+180) to percentage (0..100)
  const getCoordinatesPercent = (lat: number, lon: number) => {
    const x = Math.max(5, Math.min(95, ((lon + 180) / 360) * 100));
    const y = Math.max(5, Math.min(95, ((90 - lat) / 180) * 100));
    return { x, y };
  };

  const handleZoneClick = (zone: MapTargetZone, idx: number) => {
    if (isSubmitted || disabled) return;
    quizAudio.playClick(920);
    onSelectZone?.(zone.id);
    onSelectOption?.(idx);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Interactive Cartography Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#040816] shadow-2xl p-4">
        {/* Map Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="uppercase font-bold tracking-wider">
              NASA Planetary Trek 2D Equirectangular Grid // {effectiveBody.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            USGS / JPL Astrogeology Projection
          </span>
        </div>

        {/* 2D Grid Canvas */}
        <div className="relative w-full h-56 sm:h-72 rounded-xl border border-white/10 bg-gradient-to-b from-[#0B1528] to-[#040714] overflow-hidden select-none">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

          {/* Equator & Prime Meridian Guides */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/20" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-500/20" />

          {/* Planetary Target Zones / Hotspots */}
          {effectiveZones.map((zone, idx) => {
            const { x, y } = getCoordinatesPercent(zone.lat, zone.lon);
            const isSelected = selectedZoneId === zone.id || effectiveSelectedOption === idx;
            const isCorrect = isSubmitted && zone.isCorrect;
            const isWrong = isSubmitted && isSelected && !zone.isCorrect;
            const isHovered = hoveredZoneId === zone.id;

            return (
              <div
                key={zone.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                onMouseEnter={() => setHoveredZoneId(zone.id)}
                onMouseLeave={() => setHoveredZoneId(null)}
              >
                <button
                  type="button"
                  disabled={isSubmitted || disabled}
                  onClick={() => handleZoneClick(zone, idx)}
                  className={`relative p-2 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer disabled:cursor-default ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-500 text-slate-950 scale-125 ring-4 ring-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                        : isWrong
                        ? 'bg-rose-500 text-slate-950 scale-125 ring-4 ring-rose-400/40 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                        : 'bg-slate-800 text-slate-500 opacity-40'
                      : isSelected
                      ? 'bg-cyan-400 text-slate-950 scale-125 ring-4 ring-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                      : 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 hover:scale-125 hover:bg-cyan-500 hover:text-slate-950'
                  }`}
                >
                  <Crosshair className="w-4 h-4 animate-spin-slow" />
                  <span className="sr-only">{zone.name}</span>
                </button>

                {/* Floating Tooltip Pill */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-cyan-400/40 whitespace-nowrap pointer-events-none z-30 font-mono text-[10px] text-cyan-200 shadow-xl">
                    <span className="font-bold text-white block">{zone.name}</span>
                    <span>
                      {zone.lat > 0 ? `${zone.lat}°N` : `${Math.abs(zone.lat)}°S`},{' '}
                      {zone.lon > 0 ? `${zone.lon}°E` : `${Math.abs(zone.lon)}°W`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Multiple-Choice Zone Selection Cards if options present */}
      {effectiveOptions.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-slate-400 px-1">
            Pinpoint coordinate zone on the grid or select below:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {effectiveOptions.map((opt, idx) => {
              const zone = effectiveZones[idx];
              const isSelected = (zone && selectedZoneId === zone.id) || effectiveSelectedOption === idx;
              const isCorrect = isSubmitted && idx === effectiveCorrectIndex;
              const isWrong = isSubmitted && isSelected && idx !== effectiveCorrectIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted || disabled}
                  onClick={() => {
                    if (zone) onSelectZone?.(zone.id);
                    onSelectOption?.(idx);
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer disabled:cursor-default ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-950/30 text-white'
                      : isWrong
                      ? 'border-rose-500 bg-rose-950/30 text-rose-200'
                      : isSelected
                      ? 'border-cyan-400 bg-cyan-950/30 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'border-slate-800 bg-[#070c1b]/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-sm font-semibold">{opt}</span>
                  </div>

                  {isSubmitted && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

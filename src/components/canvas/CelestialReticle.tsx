import React from 'react';
import { Html } from '@react-three/drei';
import { CelestialBodyDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface CelestialReticleProps {
  data: CelestialBodyDefinition;
  yOffset: number;
}

/**
 * Minimalist Scientific Celestial Reticle & Label
 * Implements the 3 interaction tiers specified in design-system/orbit-academy/MASTER.md:
 * 1. Default: Understated minimal circular marker with 10px monospace label.
 * 2. Hover / Focus: Reticle brackets expand [ • ] in Cool Cyan, revealing distance & Latin designation.
 * 3. Selected: Target locked indicator in Solar Amber [ ☉ ].
 */
export const CelestialReticle: React.FC<CelestialReticleProps> = ({ data, yOffset }) => {
  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === data.id;
  const isHovered = hoveredPlanetId === data.id;
  const isExpanded = isSelected || isHovered;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectPlanet(isSelected ? null : data.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectPlanet(isSelected ? null : data.id);
    }
  };

  return (
    <Html
      position={[0, yOffset, 0]}
      center
      distanceFactor={32}
      zIndexRange={[10, 40]}
      className="pointer-events-auto select-none"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Select ${data.name}: ${data.tagline}`}
        aria-pressed={isSelected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerOver={() => setHoveredPlanet(data.id)}
        onPointerOut={() => setHoveredPlanet(null)}
        className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
      >
        {/* Reticle Ring / Target Brackets */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Target Brackets on Hover/Select */}
          {isExpanded && (
            <div
              className={`absolute h-7 w-7 rounded-full border border-dashed transition-all duration-200 ${
                isSelected
                  ? 'border-[#F59E0B] scale-110'
                  : 'border-[#38BDF8]/70 scale-100 animate-pulse'
              }`}
            />
          )}

          {/* Core Reticle Dot */}
          <div
            className={`h-2.5 w-2.5 rounded-full border transition-all duration-200 ${
              isSelected
                ? 'border-[#F59E0B] bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                : isHovered
                ? 'border-[#38BDF8] bg-[#38BDF8] shadow-[0_0_6px_rgba(56,189,248,0.5)]'
                : 'border-[#38BDF8]/50 bg-[#0A0F1D]/80'
            }`}
          />
        </div>

        {/* Minimal Monospace Label Frame */}
        <div
          className={`mt-1.5 flex flex-col items-center rounded-md border px-2 py-0.5 backdrop-blur-md transition-all duration-200 ${
            isSelected
              ? 'border-[#F59E0B]/50 bg-[#0A0F1D]/90 shadow-md'
              : isHovered
              ? 'border-[#38BDF8]/40 bg-[#0A0F1D]/85 shadow-sm'
              : 'border-transparent bg-[#0A0F1D]/40'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors ${
                isSelected
                  ? 'text-[#F59E0B]'
                  : isHovered
                  ? 'text-[#38BDF8]'
                  : 'text-[#94A3B8]'
              }`}
            >
              {data.name}
            </span>

            {/* Selected Status Indicator */}
            {isSelected && (
              <span className="font-mono text-[9px] font-bold text-[#F59E0B]">
                [LOCKED]
              </span>
            )}
          </div>

          {/* Expanded Secondary Telemetry revealed on hover or selection */}
          {isExpanded && (
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[9px] text-[#94A3B8]">
              <span>{data.latinName}</span>
              <span>·</span>
              <span>{data.physical.realDistanceAU} AU</span>
            </div>
          )}
        </div>
      </div>
    </Html>
  );
};

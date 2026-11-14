import React from 'react';
import { Html } from '@react-three/drei';
import { CelestialBodyDefinition } from '../../types';
import { useSolarSystem } from '../../context/SolarSystemContext';

interface CelestialReticleProps {
  data: CelestialBodyDefinition;
  yOffset: number;
}

/**
 * Ultra-Minimalist Scientific Celestial Reticle & Label (Phase 8 Design System)
 * 
 * Design Principles:
 * - Eliminates full-screen label clutter
 * - Default: Tiny 2px pinpoint astronomical marker (virtually invisible until needed)
 * - Hover / Selection: Expands into precision targeting brackets and discreet 9px monospace telemetry tag
 * - Retains full keyboard accessibility & screen-reader semantics
 */
export const CelestialReticle: React.FC<CelestialReticleProps> = ({ data, yOffset }) => {
  const { selectedPlanetId, hoveredPlanetId, selectPlanet, setHoveredPlanet } = useSolarSystem();

  const isSelected = selectedPlanetId === data.id;
  const isHovered = hoveredPlanetId === data.id;
  const isTargeted = isSelected || isHovered;

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
      distanceFactor={34}
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
        {/* Reticle Dot / Target Crosshair */}
        <div className="relative flex items-center justify-center">
          {/* Active Target Ring */}
          {isTargeted && (
            <div
              className={`absolute h-5 w-5 rounded-full border transition-all duration-300 ${
                isSelected
                  ? 'border-[#F59E0B] scale-100 shadow-[0_0_10px_rgba(245,158,11,0.45)]'
                  : 'border-[#38BDF8]/60 scale-95 animate-pulse'
              }`}
            />
          )}

          {/* Core Pinpoint Marker */}
          <div
            className={`rounded-full transition-all duration-200 ${
              isSelected
                ? 'h-2 w-2 bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]'
                : isHovered
                ? 'h-2 w-2 bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]'
                : 'h-1.5 w-1.5 bg-[#64748B]/40'
            }`}
          />
        </div>

        {/* Minimal Label — Only revealed when hovered or selected */}
        {isTargeted && (
          <div
            className={`mt-1.5 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 backdrop-blur-md transition-all duration-200 animate-fade-in ${
              isSelected
                ? 'border border-[#F59E0B]/40 bg-[#070C1B]/90 text-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'border border-white/10 bg-[#070C1B]/85 text-[#38BDF8]'
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shadow-sm"
              style={{ backgroundColor: data.visual.primaryColor }}
            />
            <span className="font-mono text-[9px] font-semibold tracking-widest uppercase">
              {data.name}
            </span>
          </div>
        )}
      </div>
    </Html>
  );
};

import React, { useState, useMemo } from 'react';
import { ColoringArtwork } from '../types';
import { resolveArtworkSuggestions } from '../coloringData';

interface SvgColoringCanvasProps {
  artwork: ColoringArtwork;
  filledRegions: Record<string, string>;
  onRegionClick: (regionId: string) => void;
  activeColor: string;
  activeTool: 'fill' | 'eraser';
  zoomLevel: number;
  panOffset: { x: number; y: number };
  isPanning: boolean;
  onMouseDownPan: (e: React.MouseEvent) => void;
  onMouseMovePan: (e: React.MouseEvent) => void;
  onMouseUpPan: () => void;
  onTouchStartPan: (e: React.TouchEvent) => void;
  onTouchMovePan: (e: React.TouchEvent) => void;
  onTouchEndPan: () => void;
  showNumberHints?: boolean;
  hoveredSuggestionNumber?: number | null;
}

export const SvgColoringCanvas: React.FC<SvgColoringCanvasProps> = ({
  artwork,
  filledRegions,
  onRegionClick,
  activeColor,
  activeTool,
  zoomLevel,
  panOffset,
  isPanning,
  onMouseDownPan,
  onMouseMovePan,
  onMouseUpPan,
  onTouchStartPan,
  onTouchMovePan,
  onTouchEndPan,
  showNumberHints = true,
  hoveredSuggestionNumber = null,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const { regionsWithSuggestions } = useMemo(() => {
    return resolveArtworkSuggestions(artwork);
  }, [artwork]);

  return (
    <div
      onMouseDown={onMouseDownPan}
      onMouseMove={onMouseMovePan}
      onMouseUp={onMouseUpPan}
      onTouchStart={onTouchStartPan}
      onTouchMove={onTouchMovePan}
      onTouchEnd={onTouchEndPan}
      className={`relative w-full aspect-[4/3] min-h-[380px] sm:min-h-[480px] md:min-h-[520px] rounded-3xl overflow-hidden bg-[#05070D] border border-white/10 shadow-2xl flex items-center justify-center select-none ${
        isPanning ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Background Subtle Coordinate Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Transformable Paper Canvas Container */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.12s ease-out',
        }}
        className="relative max-w-[92%] max-h-[92%] w-full h-full flex items-center justify-center"
      >
        {/* Crisp White Coloring Sheet */}
        <div className="relative w-full h-full max-w-[820px] max-h-[580px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-300 p-4 sm:p-6 flex items-center justify-center">
          <svg
            id="coloring-svg-canvas"
            viewBox={artwork.viewBox}
            className="w-full h-full object-contain pointer-events-auto"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
          >
            {/* Optional underlay layer (orbits, star dust, background lines) */}
            {artwork.underlaySvg && (
              <g
                pointerEvents="none"
                className="artwork-underlay select-none"
                dangerouslySetInnerHTML={{ __html: artwork.underlaySvg }}
              />
            )}

            {/* Draw every individually colorable enclosed region */}
            {regionsWithSuggestions.map((region) => {
              const currentFill = filledRegions[region.id] || '#FFFFFF';
              const isHovered = hoveredRegionId === region.id;
              const isHighlighted = hoveredSuggestionNumber === region.suggestedNumber;

              return (
                <path
                  key={region.id}
                  id={region.id}
                  d={region.path}
                  fill={currentFill}
                  stroke={isHighlighted ? region.suggestedColor : '#0F172A'}
                  strokeWidth={isHighlighted ? '4' : '2.5'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegionClick(region.id);
                  }}
                  onPointerEnter={() => setHoveredRegionId(region.id)}
                  onPointerLeave={() => setHoveredRegionId(null)}
                  className="transition-all duration-150 cursor-pointer"
                  style={{
                    filter: isHighlighted
                      ? `drop-shadow(0 0 10px ${region.suggestedColor})`
                      : isHovered
                      ? activeTool === 'eraser'
                        ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.75))'
                        : `drop-shadow(0 0 8px ${activeColor})`
                      : undefined,
                    opacity: isHovered ? 0.92 : 1.0,
                  }}
                />
              );
            })}

            {/* Optional overlay linework layer (eyes, facial expressions, black outlines, details) */}
            {artwork.overlaySvg && (
              <g
                pointerEvents="none"
                className="artwork-overlay select-none"
                dangerouslySetInnerHTML={{ __html: artwork.overlaySvg }}
              />
            )}

            {/* Color by Number Canvas Hints (1-Red, 2-Orange, etc.) */}
            {showNumberHints && (
              <g className="number-hint-overlay pointer-events-none select-none">
                {regionsWithSuggestions.map((region) => {
                  const isColored =
                    Boolean(filledRegions[region.id]) && filledRegions[region.id] !== '#FFFFFF';
                  // Hide hint bubble once region is colored to preserve clean artwork
                  if (isColored) return null;

                  const isMatch = hoveredSuggestionNumber === region.suggestedNumber;

                  return (
                    <g
                      key={`hint-${region.id}`}
                      className="transition-all duration-200"
                    >
                      {/* Outer Pulse Glow if active suggestion hovered */}
                      {isMatch && (
                        <circle
                          cx={region.centerPoint.x}
                          cy={region.centerPoint.y}
                          r="14"
                          fill={region.suggestedColor}
                          opacity="0.35"
                          className="animate-ping"
                        />
                      )}

                      {/* Circular Number Bubble */}
                      <circle
                        cx={region.centerPoint.x}
                        cy={region.centerPoint.y}
                        r={isMatch ? '11' : '8.5'}
                        fill={isMatch ? region.suggestedColor : '#FFFFFF'}
                        stroke="#0F172A"
                        strokeWidth={isMatch ? '2' : '1.5'}
                        style={{
                          filter: isMatch
                            ? `drop-shadow(0 0 8px ${region.suggestedColor})`
                            : 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))',
                        }}
                      />

                      {/* Number Label */}
                      <text
                        x={region.centerPoint.x}
                        y={region.centerPoint.y + (isMatch ? 4 : 3.5)}
                        textAnchor="middle"
                        fontSize={isMatch ? '11' : '9.5'}
                        fontWeight="900"
                        fill={isMatch && region.suggestedColor !== '#FFFFFF' ? '#FFFFFF' : '#0F172A'}
                        fontFamily="'Roboto Mono', monospace"
                      >
                        {region.suggestedNumber}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Hover Region Name Tooltip */}
      {hoveredRegionId && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#070C1B]/90 px-3.5 py-1 font-mono text-[10px] text-slate-200 backdrop-blur-md shadow-lg z-20">
          <span>Target Region: </span>
          <span className="font-bold text-[#38BDF8]">
            {artwork.regions.find((r) => r.id === hoveredRegionId)?.name || hoveredRegionId}
          </span>
        </div>
      )}
    </div>
  );
};

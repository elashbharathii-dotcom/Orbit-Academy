import React, { useState } from 'react';
import { ColoringArtwork } from '../types';

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
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

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
            {artwork.regions.map((region) => {
              const currentFill = filledRegions[region.id] || '#FFFFFF';
              const isHovered = hoveredRegionId === region.id;

              return (
                <path
                  key={region.id}
                  id={region.id}
                  d={region.path}
                  fill={currentFill}
                  stroke="#0F172A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegionClick(region.id);
                  }}
                  onPointerEnter={() => setHoveredRegionId(region.id)}
                  onPointerLeave={() => setHoveredRegionId(null)}
                  className="transition-colors duration-150 cursor-pointer"
                  style={{
                    filter: isHovered
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

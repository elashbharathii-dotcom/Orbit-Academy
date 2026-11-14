import React, { useMemo } from 'react';
import { ColoringArtwork } from '../types';
import { useColoringEngine } from '../hooks/useColoringEngine';
import { resolveArtworkSuggestions } from '../coloringData';
import { ColoringToolbar } from './ColoringToolbar';
import { SvgColoringCanvas } from './SvgColoringCanvas';
import { ColorPalette } from './ColorPalette';
import { SpaceFactPanel } from './SpaceFactPanel';

interface ColoringWorkspaceProps {
  artwork: ColoringArtwork;
  onBackToGallery: () => void;
}

export const ColoringWorkspace: React.FC<ColoringWorkspaceProps> = ({
  artwork,
  onBackToGallery,
}) => {
  const {
    filledRegions,
    activeColor,
    setActiveColor,
    recentColors,
    activeTool,
    setActiveTool,
    canUndo,
    canRedo,
    undo,
    redo,
    resetArtwork,
    handleRegionClick,
    zoomLevel,
    zoomIn,
    zoomOut,
    fitToScreen,
    panOffset,
    isPanning,
    handleMouseDownPan,
    handleMouseMovePan,
    handleMouseUpPan,
    handleTouchStartPan,
    handleTouchMovePan,
    handleTouchEndPan,
    downloadPng,
    printArtwork,
    isComplete,
    progressPercent,
    showNumberHints,
    toggleNumberHints,
    hoveredSuggestionNumber,
    setHoveredSuggestionNumber,
  } = useColoringEngine(artwork);

  const { activeSuggestions } = useMemo(() => {
    return resolveArtworkSuggestions(artwork);
  }, [artwork]);

  const coloredCount = artwork.regions.filter(
    (r) => Boolean(filledRegions[r.id]) && filledRegions[r.id] !== '#FFFFFF'
  ).length;

  return (
    <div className="flex flex-col gap-5 w-full animate-fade-in">
      {/* Top Controls Toolbar */}
      <ColoringToolbar
        artwork={artwork}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onReset={resetArtwork}
        zoomLevel={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToScreen={fitToScreen}
        onDownloadPng={downloadPng}
        onPrint={printArtwork}
        onBackToGallery={onBackToGallery}
        progressPercent={progressPercent}
        coloredCount={coloredCount}
        showNumberHints={showNumberHints}
        onToggleNumberHints={toggleNumberHints}
      />

      {/* Main Workspace: Left Canvas, Right Palette & Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
        {/* Left: Big Interactive SVG Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <SvgColoringCanvas
            artwork={artwork}
            filledRegions={filledRegions}
            onRegionClick={handleRegionClick}
            activeColor={activeColor}
            activeTool={activeTool}
            zoomLevel={zoomLevel}
            panOffset={panOffset}
            isPanning={isPanning}
            onMouseDownPan={handleMouseDownPan}
            onMouseMovePan={handleMouseMovePan}
            onMouseUpPan={handleMouseUpPan}
            onTouchStartPan={handleTouchStartPan}
            onTouchMovePan={handleTouchMovePan}
            onTouchEndPan={handleTouchEndPan}
            showNumberHints={showNumberHints}
            hoveredSuggestionNumber={hoveredSuggestionNumber}
          />

          {/* Quick Color Suggestions Bar (1-Red, 2-Orange, etc.) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#080E1E]/95 border border-white/10 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5">
              <span className="text-[10px] font-bold text-[#F59E0B] font-mono whitespace-nowrap mr-1">
                🎨 Suggested:
              </span>
              {activeSuggestions.map((sug) => {
                const isSelected = activeColor.toLowerCase() === sug.hex.toLowerCase();
                const isHovered = hoveredSuggestionNumber === sug.number;

                return (
                  <button
                    key={sug.number}
                    type="button"
                    onClick={() => {
                      setActiveColor(sug.hex);
                      setActiveTool('fill');
                    }}
                    onMouseEnter={() => setHoveredSuggestionNumber(sug.number)}
                    onMouseLeave={() => setHoveredSuggestionNumber(null)}
                    title={`${sug.number} - ${sug.name}: ${sug.targetDescription}`}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'ring-2 ring-[#38BDF8] bg-white/15 text-white scale-105'
                        : isHovered
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full flex items-center justify-center text-[9px] font-black border"
                      style={{
                        backgroundColor: sug.hex,
                        color:
                          sug.hex === '#FFFFFF' || sug.hex === '#FBBF24'
                            ? '#0F172A'
                            : '#FFFFFF',
                        borderColor: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {sug.number}
                    </span>
                    <span>{sug.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={toggleNumberHints}
              title="Toggle color-by-number canvas hints"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all shrink-0 ${
                showNumberHints
                  ? 'border border-[#38BDF8] bg-[#38BDF8]/20 text-[#38BDF8]'
                  : 'border border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span>123 Numbers</span>
              <span className="opacity-75">{showNumberHints ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] px-2">
            <span>Click or tap any enclosed region to apply active color</span>
            <span className="hidden sm:inline">Drag canvas to pan when zoomed in</span>
          </div>
        </div>

        {/* Right: Palettes & Astronomy Facts (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <ColorPalette
            activeColor={activeColor}
            onSelectColor={setActiveColor}
            recentColors={recentColors}
            artwork={artwork}
            hoveredSuggestionNumber={hoveredSuggestionNumber}
            onHoverSuggestion={setHoveredSuggestionNumber}
          />

          <SpaceFactPanel
            artwork={artwork}
            coloredCount={coloredCount}
            totalCount={artwork.regions.length}
            progressPercent={progressPercent}
            isComplete={isComplete}
          />
        </div>
      </div>
    </div>
  );
};

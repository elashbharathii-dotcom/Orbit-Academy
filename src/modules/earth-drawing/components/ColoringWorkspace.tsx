import React from 'react';
import { ColoringArtwork } from '../types';
import { useColoringEngine } from '../hooks/useColoringEngine';
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
  } = useColoringEngine(artwork);

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
          />

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

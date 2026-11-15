import React, { useMemo } from 'react';
import { ColoringArtwork } from '../types';
import { useColoringEngine } from '../hooks/useColoringEngine';
import { resolveArtworkSuggestions } from '../coloringData';
import { SvgColoringCanvas } from './SvgColoringCanvas';
import { CosmoCompanion } from './CosmoCompanion';
import {
  ArrowLeft,
  PaintBucket,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Sparkles,
  Layers,
} from 'lucide-react';

interface PlateColoringViewProps {
  artwork: ColoringArtwork;
  onBackToGallery: () => void;
  onOpenInStudio: (artwork: ColoringArtwork) => void;
}

export const PlateColoringView: React.FC<PlateColoringViewProps> = ({
  artwork,
  onBackToGallery,
  onOpenInStudio,
}) => {
  const {
    filledRegions,
    activeColor,
    setActiveColor,
    activeTool,
    setActiveTool,
    canUndo,
    canRedo,
    undo,
    redo,
    resetArtwork,
    handleRegionClick,
    zoomLevel,
    panOffset,
    isPanning,
    handleMouseDownPan,
    handleMouseMovePan,
    handleMouseUpPan,
    handleTouchStartPan,
    handleTouchMovePan,
    handleTouchEndPan,
    downloadPng,
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
    <div className="flex flex-col gap-4 w-full animate-fade-in select-none">
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[4px_4px_0px_#0B0B0B]">
        {/* Navigation & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] text-[#0B0B0B] font-mono text-xs font-bold hover:bg-[#FFFFFF] transition-all shadow-[2px_2px_0px_#9A9A9A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <div className="flex flex-col">
            <h2
              className="font-mono text-xs sm:text-sm font-black uppercase text-[#0B0B0B]"
              style={{ fontFamily: '"Silkscreen", monospace' }}
            >
              {artwork.title}
            </h2>
            <span className="font-mono text-[10px] text-[#555555]">
              {artwork.learningTopic} // {artwork.difficulty} Plate
            </span>
          </div>
        </div>

        {/* Progress & Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Progress Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] font-mono text-xs font-bold">
            <span className="text-[10px] text-[#555555]">PROGRESS:</span>
            <span className="text-[#0B0B0B]">
              {coloredCount} / {artwork.regions.length} ({progressPercent}%)
            </span>
          </div>

          {/* Number hints toggle */}
          <button
            type="button"
            onClick={toggleNumberHints}
            className={`px-2.5 py-1 border-2 border-[#0B0B0B] font-mono text-xs font-bold transition-all ${
              showNumberHints ? 'bg-[#00E5FF] text-[#0B0B0B] shadow-[2px_2px_0px_#0B0B0B]' : 'bg-[#F1F1F0] text-[#555555]'
            }`}
          >
            # Hints {showNumberHints ? 'ON' : 'OFF'}
          </button>

          {/* Tools: Fill & Eraser */}
          <button
            type="button"
            onClick={() => setActiveTool('fill')}
            className={`p-1.5 border-2 border-[#0B0B0B] transition-all ${
              activeTool === 'fill'
                ? 'bg-[#0B0B0B] text-[#F1F1F0] shadow-[2px_2px_0px_#9A9A9A]'
                : 'bg-[#F1F1F0] text-[#0B0B0B]'
            }`}
            title="Fill Color Tool"
          >
            <PaintBucket className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('eraser')}
            className={`p-1.5 border-2 border-[#0B0B0B] transition-all ${
              activeTool === 'eraser'
                ? 'bg-[#0B0B0B] text-[#F1F1F0] shadow-[2px_2px_0px_#9A9A9A]'
                : 'bg-[#F1F1F0] text-[#0B0B0B]'
            }`}
            title="Eraser Tool"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Undo / Redo / Reset */}
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] disabled:opacity-30 shadow-[2px_2px_0px_#9A9A9A]"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] disabled:opacity-30 shadow-[2px_2px_0px_#9A9A9A]"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={resetArtwork}
            className="p-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] hover:text-[#EF4444] shadow-[2px_2px_0px_#9A9A9A]"
            title="Reset Colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Switch to Studio */}
          <button
            type="button"
            onClick={() => onOpenInStudio(artwork)}
            className="flex items-center gap-1 px-3 py-1.5 border-2 border-[#0B0B0B] bg-[#00E5FF] text-[#0B0B0B] font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#0B0B0B] hover:-translate-x-0.5 hover:-translate-y-0.5"
            title="Open in full multi-layer Studio"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trace in Studio</span>
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={downloadPng}
            className="flex items-center gap-1 px-3 py-1.5 border-2 border-[#0B0B0B] bg-[#0B0B0B] text-[#F1F1F0] font-mono text-xs font-bold shadow-[2px_2px_0px_#9A9A9A]"
            title="Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PNG</span>
          </button>
        </div>
      </header>

      {/* 2. COLOR PALETTE SUGGESTIONS BAR (1-10 COLOR BY NUMBER) */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[4px_4px_0px_#0B0B0B] overflow-x-auto">
        <span
          className="font-mono text-xs font-black uppercase text-[#0B0B0B] mr-2 flex-none"
          style={{ fontFamily: '"Silkscreen", monospace' }}
        >
          SUGGESTED PALETTE:
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
              className={`flex items-center gap-1.5 px-2.5 py-1 border-2 font-mono text-xs font-bold transition-all ${
                isSelected
                  ? 'border-[#0B0B0B] bg-[#00E5FF] shadow-[2px_2px_0px_#0B0B0B] scale-105'
                  : isHovered
                  ? 'border-[#0B0B0B] bg-[#F1F1F0]'
                  : 'border-[#9A9A9A] bg-[#FFFFFF] hover:border-[#0B0B0B]'
              }`}
            >
              <span
                className="w-4 h-4 border border-[#0B0B0B] flex items-center justify-center text-[10px] font-black"
                style={{
                  backgroundColor: sug.hex,
                  color: sug.hex === '#FFFFFF' || sug.hex === '#FBBF24' ? '#0B0B0B' : '#FFFFFF',
                }}
              >
                {sug.number}
              </span>
              <span className="hidden sm:inline text-[#0B0B0B]">{sug.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN SVG COLORING CANVAS & FACT PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* SVG Canvas (8 cols) */}
        <div className="lg:col-span-8 border-2 border-[#0B0B0B] bg-[#FFFFFF] p-2 shadow-[6px_6px_0px_#0B0B0B]">
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
        </div>

        {/* Fact Card & Educational Dossier (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2 p-4 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[4px_4px_0px_#0B0B0B]">
            <div className="flex items-center gap-1.5 pb-2 border-b-2 border-dashed border-[#9A9A9A]">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <h3
                className="font-mono text-xs font-black uppercase text-[#0B0B0B]"
                style={{ fontFamily: '"Silkscreen", monospace' }}
              >
                ASTRONOMICAL DOSSIER
              </h3>
            </div>
            <p className="font-mono text-xs text-[#0B0B0B] leading-relaxed">
              {artwork.educationalFact}
            </p>
            {artwork.additionalFact && (
              <p className="font-mono text-[11px] text-[#555555] leading-relaxed pt-2 border-t border-[#E2E2E0]">
                {artwork.additionalFact}
              </p>
            )}
          </div>

          {/* Cosmo Companion */}
          <CosmoCompanion activeTool="brush" />
        </div>
      </div>
    </div>
  );
};

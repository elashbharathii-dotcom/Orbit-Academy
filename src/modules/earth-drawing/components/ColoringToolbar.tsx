import React, { useState } from 'react';
import { ColoringArtwork } from '../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { TelemetryBadge } from '../../../components/ui/TelemetryBadge';
import { SpaceButton } from '../../../components/ui/SpaceButton';
import {
  ArrowLeft,
  PaintBucket,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Printer,
  ChevronDown,
} from 'lucide-react';

interface ColoringToolbarProps {
  artwork: ColoringArtwork;
  activeTool: 'fill' | 'eraser';
  onSelectTool: (tool: 'fill' | 'eraser') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onDownloadPng: () => void;
  onPrint: (uncolored?: boolean) => void;
  onBackToGallery: () => void;
  progressPercent: number;
  coloredCount: number;
  showNumberHints?: boolean;
  onToggleNumberHints?: () => void;
}

export const ColoringToolbar: React.FC<ColoringToolbarProps> = ({
  artwork,
  activeTool,
  onSelectTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onDownloadPng,
  onPrint,
  onBackToGallery,
  progressPercent,
  coloredCount,
  showNumberHints = true,
  onToggleNumberHints,
}) => {
  const [showPrintMenu, setShowPrintMenu] = useState(false);

  return (
    <GlassCard
      variant="elevated"
      className="p-3 sm:p-4 border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl"
    >
      {/* Left: Navigation and Artwork Metadata */}
      <div className="flex items-center gap-3">
        <SpaceButton
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={onBackToGallery}
        >
          Gallery
        </SpaceButton>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-sm sm:text-base font-bold text-[#F8FAFC]">
              {artwork.title}
            </h2>
            <TelemetryBadge
              label="PROGRESS"
              value={`${coloredCount} / ${artwork.regions.length} (${progressPercent}%)`}
              tone={progressPercent === 100 ? 'emerald' : 'cyan'}
              size="sm"
            />
          </div>
          <span className="font-mono text-[10px] text-[#94A3B8]">
            {artwork.learningTopic} // {artwork.difficulty} Plate
          </span>
        </div>
      </div>

      {/* Middle/Right: Primary Tools & Workspace Actions */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Tool Switcher: Fill vs Eraser */}
        <div className="flex items-center rounded-xl border border-white/10 bg-[#070C1B] p-1">
          <button
            type="button"
            onClick={() => onSelectTool('fill')}
            title="Fill Bucket (Click or tap any enclosed region)"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
              activeTool === 'fill'
                ? 'bg-[#38BDF8] text-[#030611] font-bold shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <PaintBucket className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Color</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('eraser')}
            title="Eraser (Click or tap a region to erase back to white)"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
              activeTool === 'eraser'
                ? 'bg-rose-500 text-white font-bold shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Eraser className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Eraser</span>
          </button>
        </div>

        {/* Color-by-Number Hints Toggle */}
        {onToggleNumberHints && (
          <button
            type="button"
            onClick={onToggleNumberHints}
            title={showNumberHints ? 'Hide Number Hints (1, 2, 3...)' : 'Show Number Hints (1, 2, 3...)'}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-mono transition-all ${
              showNumberHints
                ? 'border-[#38BDF8] bg-[#38BDF8]/20 font-bold text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                : 'border-white/10 bg-[#070C1B] text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="font-bold text-[10px] bg-white/10 px-1 py-0.5 rounded text-[#F8FAFC]">123</span>
            <span className="hidden md:inline">Numbers</span>
            <span className="text-[10px] opacity-80">{showNumberHints ? 'ON' : 'OFF'}</span>
          </button>
        )}

        {/* Undo & Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last action"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#0B1226]/80 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo action"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#0B1226]/80 text-[#94A3B8] transition-colors hover:border-[#38BDF8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Reset Artwork */}
        <button
          type="button"
          onClick={onReset}
          title="Reset artwork back to white outline"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#0B1226]/80 text-[#94A3B8] transition-colors hover:border-red-400 hover:text-red-400"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center rounded-xl border border-white/10 bg-[#070C1B] p-1">
          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom Out (-25%)"
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#94A3B8] hover:text-white"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[10px] text-[#94A3B8] px-2 tabular-nums">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom In (+25%)"
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#94A3B8] hover:text-white"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onFitToScreen}
            title="Fit to Screen (100%)"
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#94A3B8] hover:text-white ml-1 border-l border-white/10 pl-1"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>

        {/* Print Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPrintMenu((p) => !p)}
            title="Print coloring page"
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0B1226]/80 px-2.5 py-1.5 font-mono text-xs text-[#94A3B8] hover:text-white hover:border-[#38BDF8] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Print</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {showPrintMenu && (
            <div className="absolute right-0 top-full mt-1.5 z-40 w-48 rounded-xl border border-white/15 bg-[#0A0F1D]/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fade-in font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowPrintMenu(false);
                  onPrint(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 hover:text-[#38BDF8] transition-colors"
              >
                Print Colored Artwork
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrintMenu(false);
                  onPrint(true);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-white/10 hover:text-[#38BDF8] transition-colors"
              >
                Print Blank Coloring Sheet
              </button>
            </div>
          )}
        </div>

        {/* PNG Export */}
        <SpaceButton
          variant="primary"
          size="sm"
          icon={Download}
          onClick={onDownloadPng}
        >
          Export PNG
        </SpaceButton>
      </div>
    </GlassCard>
  );
};

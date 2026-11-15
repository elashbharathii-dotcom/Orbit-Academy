import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Trash2,
  Save,
  Download,
  Grid3X3,
  Check,
  FileImage,
} from 'lucide-react';
import { CanvasDimensionPreset, CanvasGridType, CanvasBackdropType } from '../types';

interface StudioTopToolbarProps {
  projectTitle: string;
  onUpdateTitle: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  brushSize: number;
  onChangeBrushSize: (size: number) => void;
  brushOpacity: number;
  onChangeBrushOpacity: (opacity: number) => void;
  color: string;
  onChangeColor: (color: string) => void;
  dimensionPreset: CanvasDimensionPreset;
  onChangeDimensions: (preset: CanvasDimensionPreset) => void;
  gridType: CanvasGridType;
  onChangeGridType: (grid: CanvasGridType) => void;
  backdropType: CanvasBackdropType;
  onChangeBackdropType: (backdrop: CanvasBackdropType) => void;
  onSave: () => void;
  onExport: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
}

export const StudioTopToolbar: React.FC<StudioTopToolbarProps> = ({
  projectTitle,
  onUpdateTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  brushSize,
  onChangeBrushSize,
  brushOpacity,
  onChangeBrushOpacity,
  color,
  onChangeColor,
  dimensionPreset,
  onChangeDimensions,
  gridType,
  onChangeGridType,
  backdropType,
  onChangeBackdropType,
  onSave,
  onExport,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const handleSaveClick = () => {
    onSave();
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFFFFF] border-2 border-[#0B0B0B] shadow-[4px_4px_0px_#0B0B0B] select-none">
      {/* 1. Left: Title and History (Undo/Redo) */}
      <div className="flex items-center gap-3">
        {/* Project Title Input */}
        <div className="flex items-center gap-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] px-2.5 py-1">
          <span className="text-[10px] font-mono font-bold text-[#555555]">TITLE:</span>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-transparent font-mono text-xs sm:text-sm font-bold text-[#0B0B0B] focus:outline-none w-28 sm:w-44"
          />
        </div>

        {/* Undo & Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 border-2 border-[#0B0B0B] transition-all ${
              canUndo
                ? 'bg-[#F1F1F0] text-[#0B0B0B] hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[2px_2px_0px_#9A9A9A]'
                : 'opacity-40 bg-[#E2E2E0] cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 border-2 border-[#0B0B0B] transition-all ${
              canRedo
                ? 'bg-[#F1F1F0] text-[#0B0B0B] hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[2px_2px_0px_#9A9A9A]'
                : 'opacity-40 bg-[#E2E2E0] cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Middle: Brush Sliders, Color, Zoom */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Brush Size */}
        <div className="flex items-center gap-2 px-2 py-1 border-2 border-[#0B0B0B] bg-[#F1F1F0]">
          <span className="font-mono text-[10px] font-bold text-[#0B0B0B]">SIZE:</span>
          <input
            type="range"
            min={1}
            max={36}
            value={brushSize}
            onChange={(e) => onChangeBrushSize(Number(e.target.value))}
            className="w-16 sm:w-20 accent-[#0B0B0B] cursor-pointer"
          />
          <span className="font-mono text-xs font-bold w-5 text-right">{brushSize}px</span>
        </div>

        {/* Brush Opacity */}
        <div className="flex items-center gap-2 px-2 py-1 border-2 border-[#0B0B0B] bg-[#F1F1F0]">
          <span className="font-mono text-[10px] font-bold text-[#0B0B0B]">OPACITY:</span>
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round(brushOpacity * 100)}
            onChange={(e) => onChangeBrushOpacity(Number(e.target.value) / 100)}
            className="w-16 sm:w-20 accent-[#0B0B0B] cursor-pointer"
          />
          <span className="font-mono text-xs font-bold w-7 text-right">
            {Math.round(brushOpacity * 100)}%
          </span>
        </div>

        {/* Active Color Preview & Hex Picker */}
        <div className="flex items-center gap-1.5 border-2 border-[#0B0B0B] bg-[#FFFFFF] px-2 py-1">
          <label className="relative cursor-pointer flex items-center gap-1.5">
            <span
              className="w-5 h-5 border border-[#0B0B0B] shadow-inner"
              style={{ backgroundColor: color }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => onChangeColor(e.target.value)}
              className="sr-only"
            />
            <span className="font-mono text-xs font-bold text-[#0B0B0B] uppercase">
              {color}
            </span>
          </label>
        </div>

        {/* Canvas Dimension Preset */}
        <div className="flex items-center gap-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] px-2 py-1">
          <span className="font-mono text-[10px] font-bold text-[#555555]">RATIO:</span>
          <select
            value={dimensionPreset}
            onChange={(e) => onChangeDimensions(e.target.value as CanvasDimensionPreset)}
            className="bg-transparent font-mono text-xs font-bold text-[#0B0B0B] focus:outline-none cursor-pointer"
          >
            <option value="widescreen">16:10 (960×600)</option>
            <option value="square">1:1 Square (720×720)</option>
            <option value="standard">4:3 Standard (800×600)</option>
            <option value="portrait">3:4 Portrait (600×800)</option>
          </select>
        </div>

        {/* Grid Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextGrid: Record<CanvasGridType, CanvasGridType> = {
              none: 'space-grid',
              'space-grid': 'pixel',
              pixel: 'none',
            };
            onChangeGridType(nextGrid[gridType]);
          }}
          title={`Grid Mode: ${gridType}`}
          className={`flex items-center gap-1 px-2 py-1 border-2 border-[#0B0B0B] transition-all text-xs font-mono font-bold ${
            gridType !== 'none'
              ? 'bg-[#00E5FF] text-[#0B0B0B] shadow-[2px_2px_0px_#0B0B0B]'
              : 'bg-[#F1F1F0] text-[#555555]'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline uppercase">{gridType}</span>
        </button>

        {/* Backdrop Paper Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextBackdrop: Record<CanvasBackdropType, CanvasBackdropType> = {
              ivory: 'white',
              white: 'transparent',
              transparent: 'ivory',
            };
            onChangeBackdropType(nextBackdrop[backdropType]);
          }}
          title={`Paper Backdrop: ${backdropType}`}
          className="flex items-center gap-1 px-2 py-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] text-[#0B0B0B] hover:bg-[#FFFFFF] transition-all text-xs font-mono font-bold"
        >
          <FileImage className="w-3.5 h-3.5" />
          <span className="hidden sm:inline uppercase">{backdropType}</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] p-0.5">
          <button
            type="button"
            onClick={onZoomOut}
            className="px-1.5 py-0.5 hover:bg-[#FFFFFF] font-mono text-xs font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="font-mono text-xs font-bold px-1 min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            className="px-1.5 py-0.5 hover:bg-[#FFFFFF] font-mono text-xs font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={onFitToScreen}
            className="px-1.5 py-0.5 hover:bg-[#FFFFFF] font-mono text-[10px] border-l border-[#0B0B0B]"
            title="Fit to Screen"
          >
            FIT
          </button>
        </div>
      </div>

      {/* 3. Right: Clear, Save, Export Actions */}
      <div className="flex items-center gap-2">
        {/* Clear Canvas */}
        {showClearConfirm ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onClear();
                setShowClearConfirm(false);
              }}
              className="px-2 py-1 border-2 border-[#EF4444] bg-[#EF4444] text-[#FFFFFF] font-mono text-xs font-bold animate-pulse"
            >
              Confirm Clear
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-1.5 py-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] font-mono text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            title="Clear Drawing Canvas"
            className="p-1.5 border-2 border-[#0B0B0B] bg-[#F1F1F0] text-[#0B0B0B] hover:bg-[#FFE4E6] hover:border-[#EF4444] hover:text-[#EF4444] transition-all shadow-[2px_2px_0px_#9A9A9A]"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Save Project Button */}
        <button
          type="button"
          onClick={handleSaveClick}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#0B0B0B] bg-[#00E5FF] text-[#0B0B0B] font-mono text-xs font-black uppercase tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[3px_3px_0px_#0B0B0B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0B0B0B]"
        >
          {showSaveToast ? <Check className="w-3.5 h-3.5 text-[#0B0B0B]" /> : <Save className="w-3.5 h-3.5" />}
          <span>{showSaveToast ? 'Saved!' : 'Save'}</span>
        </button>

        {/* Export PNG */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#0B0B0B] bg-[#0B0B0B] text-[#F1F1F0] font-mono text-xs font-black uppercase tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[3px_3px_0px_#9A9A9A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#9A9A9A]"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export PNG</span>
        </button>
      </div>
    </header>
  );
};

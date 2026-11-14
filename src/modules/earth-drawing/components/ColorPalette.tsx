import React, { useMemo } from 'react';
import {
  DEFAULT_COLOR_PALETTE,
  ASTRONOMY_PRESET_COLORS,
  NUMBERED_COLOR_PALETTE,
  resolveArtworkSuggestions,
} from '../coloringData';
import { ColoringArtwork } from '../types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Pipette, Sparkles, History, Palette, ListOrdered } from 'lucide-react';

interface ColorPaletteProps {
  activeColor: string;
  onSelectColor: (color: string) => void;
  recentColors: string[];
  artwork?: ColoringArtwork;
  hoveredSuggestionNumber?: number | null;
  onHoverSuggestion?: (num: number | null) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  activeColor,
  onSelectColor,
  recentColors,
  artwork,
  hoveredSuggestionNumber,
  onHoverSuggestion,
}) => {
  // If artwork is supplied, prioritize suggestions used in this artwork, then rest of numbered palette
  const displayedSuggestions = useMemo(() => {
    if (!artwork) return NUMBERED_COLOR_PALETTE;
    const { activeSuggestions } = resolveArtworkSuggestions(artwork);
    if (activeSuggestions.length > 0) {
      // Show active suggestions for this artwork first, then any remaining
      const activeSet = new Set(activeSuggestions.map((s) => s.number));
      const remaining = NUMBERED_COLOR_PALETTE.filter((s) => !activeSet.has(s.number));
      return [...activeSuggestions, ...remaining];
    }
    return NUMBERED_COLOR_PALETTE;
  }, [artwork]);

  return (
    <GlassCard variant="elevated" className="p-4 border-white/10 flex flex-col gap-4 font-mono text-xs">
      {/* Active Color Preview & Custom Picker Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-xl border-2 border-white/40 shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: activeColor }}
          />
          <div className="flex flex-col">
            <span className="font-sans text-xs font-bold text-white uppercase tracking-wider">
              Active Color
            </span>
            <span className="text-[10px] text-[#38BDF8] uppercase font-bold">
              {activeColor}
            </span>
          </div>
        </div>

        {/* Custom Color Input Trigger */}
        <label
          title="Pick any custom color"
          className="relative flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 cursor-pointer hover:bg-white/10 hover:border-[#38BDF8] transition-colors"
        >
          <Pipette className="h-3.5 w-3.5 text-[#38BDF8]" />
          <span className="text-[10px] font-bold text-slate-200">Custom</span>
          <input
            type="color"
            value={activeColor}
            onChange={(e) => onSelectColor(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </label>
      </div>

      {/* 1. Color Suggestions (1-Red, 2-Orange, etc. - Color by Number) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
            <ListOrdered className="h-3 w-3" />
            <span>Color Suggestions</span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">1-Red, 2-Orange...</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
          {displayedSuggestions.map((sug) => {
            const isSelected = activeColor.toLowerCase() === sug.hex.toLowerCase();
            const isHovered = hoveredSuggestionNumber === sug.number;

            return (
              <button
                key={sug.number}
                type="button"
                onClick={() => onSelectColor(sug.hex)}
                onMouseEnter={() => onHoverSuggestion?.(sug.number)}
                onMouseLeave={() => onHoverSuggestion?.(null)}
                title={`${sug.number} - ${sug.name}: ${sug.targetDescription}`}
                className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#38BDF8] bg-[#38BDF8]/20 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : isHovered
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/10 bg-[#070C1B] hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {/* Number Badge with Swatch Color */}
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-black border shadow-sm"
                  style={{
                    backgroundColor: sug.hex,
                    color:
                      sug.hex === '#FFFFFF' || sug.hex === '#FBBF24' ? '#0F172A' : '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.25)',
                  }}
                >
                  {sug.number}
                </span>

                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-[11px] font-bold text-white truncate">
                    {sug.number} - {sug.name}
                  </span>
                  <span className="text-[8.5px] text-slate-400 truncate font-mono">
                    {sug.targetDescription.split(',')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Core 13-Color Standard Palette */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          <Palette className="h-3 w-3 text-[#38BDF8]" />
          <span>Standard Palette (13 Colors)</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-7 gap-2">
          {DEFAULT_COLOR_PALETTE.map((color) => {
            const isSelected = activeColor.toLowerCase() === color.hex.toLowerCase();
            const suggestionMatch = NUMBERED_COLOR_PALETTE.find(
              (s) => s.hex.toLowerCase() === color.hex.toLowerCase()
            );

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelectColor(color.hex)}
                title={`${suggestionMatch ? `${suggestionMatch.number} - ` : ''}${color.name} (${color.hex})`}
                className={`group relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)] z-10'
                    : 'hover:scale-105 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: color.hex,
                  border: color.hex === '#FFFFFF' ? '1px solid rgba(0,0,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Number hint on swatch */}
                {suggestionMatch && (
                  <span
                    className={`font-mono text-[9px] font-black ${
                      color.hex === '#FFFFFF' || color.hex === '#FBBF24'
                        ? 'text-slate-900'
                        : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {suggestionMatch.number}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#38BDF8] ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Curated Astronomical Cosmic Presets */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F59E0B] mb-2 uppercase tracking-wider">
          <Sparkles className="h-3 w-3" />
          <span>Astronomy Presets</span>
        </div>

        <div className="grid grid-cols-8 gap-2">
          {ASTRONOMY_PRESET_COLORS.map((color) => {
            const isSelected = activeColor.toLowerCase() === color.hex.toLowerCase();

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelectColor(color.hex)}
                title={`${color.name} (${color.hex})`}
                className={`group relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-[#38BDF8] scale-110 shadow-[0_0_12px_rgba(56,189,248,0.5)] z-10'
                    : 'hover:scale-105 hover:shadow-md'
                }`}
                style={{
                  backgroundColor: color.hex,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Recently Used Swatches */}
      {recentColors.length > 0 && (
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            <History className="h-3 w-3 text-cyan-400" />
            <span>Recently Used</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {recentColors.map((hex, idx) => {
              const isSelected = activeColor.toLowerCase() === hex.toLowerCase();

              return (
                <button
                  key={`${hex}-${idx}`}
                  type="button"
                  onClick={() => onSelectColor(hex)}
                  title={hex}
                  className={`h-7 w-7 shrink-0 rounded-lg transition-transform ${
                    isSelected ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: hex,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

import React from 'react';
import { DEFAULT_COLOR_PALETTE, ASTRONOMY_PRESET_COLORS } from '../coloringData';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Pipette, Sparkles, History, Palette } from 'lucide-react';

interface ColorPaletteProps {
  activeColor: string;
  onSelectColor: (color: string) => void;
  recentColors: string[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  activeColor,
  onSelectColor,
  recentColors,
}) => {
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

      {/* 1. Core 13-Color Standard Palette */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          <Palette className="h-3 w-3 text-[#38BDF8]" />
          <span>Standard Palette (13 Colors)</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-7 gap-2">
          {DEFAULT_COLOR_PALETTE.map((color) => {
            const isSelected = activeColor.toLowerCase() === color.hex.toLowerCase();

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelectColor(color.hex)}
                title={`${color.name} (${color.hex})`}
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
                {isSelected && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      color.hex === '#FFFFFF' || color.hex === '#FBBF24'
                        ? 'bg-slate-900'
                        : 'bg-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Curated Astronomical Cosmic Presets */}
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

      {/* 3. Recently Used Swatches */}
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

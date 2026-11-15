import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Palette,
  Sliders,
  BookOpen,
} from 'lucide-react';
import { StudioLayer, StrokeStyle, StudioBlendMode, ColoringArtwork } from '../types';

interface StudioRightPanelProps {
  layers: StudioLayer[];
  activeLayerId: string;
  onSelectLayer: (layerId: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  color: string;
  onChangeColor: (color: string) => void;
  recentColors: string[];
  strokeStyle: StrokeStyle;
  onChangeStrokeStyle: (style: StrokeStyle) => void;
  blendMode: StudioBlendMode;
  onChangeBlendMode: (mode: StudioBlendMode) => void;
  isFilledShape: boolean;
  onToggleFilledShape: (filled: boolean) => void;
  activeTemplate: ColoringArtwork | null;
  templateOpacity: number;
  onChangeTemplateOpacity: (opacity: number) => void;
  onClearTemplate: () => void;
  onOpenTemplateLibrary: () => void;
}

const COSMIC_SWATCHES = [
  { name: 'Deep Space Void', hex: '#0B0B0B' },
  { name: 'Pure Starlight', hex: '#FFFFFF' },
  { name: 'Aurora Cyan', hex: '#00E5FF' },
  { name: 'Cosmic Blue', hex: '#0070F3' },
  { name: 'Solar Flare Amber', hex: '#F59E0B' },
  { name: 'Mars Surface Rust', hex: '#EF4444' },
  { name: 'Alien Emerald', hex: '#10B981' },
  { name: 'Nebula Violet', hex: '#A855F7' },
  { name: 'Saturn Ring Gold', hex: '#FBBF24' },
  { name: 'Moon Regolith', hex: '#94A3B8' },
  { name: 'Jupiter Ochre', hex: '#D97706' },
  { name: 'Cosmic Magenta', hex: '#EC4899' },
];

export const StudioRightPanel: React.FC<StudioRightPanelProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onToggleVisibility,
  onToggleLock,
  onChangeOpacity,
  onMoveLayer,
  color,
  onChangeColor,
  recentColors,
  strokeStyle,
  onChangeStrokeStyle,
  blendMode,
  onChangeBlendMode,
  isFilledShape,
  onToggleFilledShape,
  activeTemplate,
  templateOpacity,
  onChangeTemplateOpacity,
  onClearTemplate,
  onOpenTemplateLibrary,
}) => {
  return (
    <aside className="flex flex-col gap-3 w-full lg:w-72 bg-[#FFFFFF] border-2 border-[#0B0B0B] p-3 shadow-[4px_4px_0px_#0B0B0B] select-none">
      {/* 1. LAYERS MANAGER */}
      <div className="flex flex-col gap-2 border-b-2 border-dashed border-[#9A9A9A] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0B0B0B]" />
            <span
              className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
              style={{ fontFamily: '"Silkscreen", monospace' }}
            >
              LAYERS ({layers.length})
            </span>
          </div>

          <button
            type="button"
            onClick={onAddLayer}
            title="Add New Layer"
            className="flex items-center gap-1 px-2 py-0.5 border border-[#0B0B0B] bg-[#F1F1F0] hover:bg-[#00E5FF] font-mono text-[10px] font-bold transition-all shadow-[1px_1px_0px_#0B0B0B]"
          >
            <Plus className="w-3 h-3" />
            <span>ADD</span>
          </button>
        </div>

        {/* Layer list */}
        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-0.5">
          {layers
            .slice()
            .reverse()
            .map((layer, reverseIdx) => {
              const actualIdx = layers.length - 1 - reverseIdx;
              const isActive = layer.id === activeLayerId;

              return (
                <div
                  key={layer.id}
                  onClick={() => onSelectLayer(layer.id)}
                  className={`flex items-center justify-between gap-1.5 p-1.5 border-2 cursor-pointer transition-all ${
                    isActive
                      ? 'border-[#0B0B0B] bg-[#00E5FF]/20 shadow-[2px_2px_0px_#0B0B0B]'
                      : 'border-[#9A9A9A] bg-[#F1F1F0] hover:border-[#0B0B0B]'
                  }`}
                >
                  {/* Left: visibility & title */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(layer.id);
                      }}
                      className="text-[#0B0B0B] hover:opacity-70 p-0.5"
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-[#9A9A9A]" />
                      )}
                    </button>

                    <span
                      className={`font-mono text-xs truncate ${
                        isActive ? 'font-bold text-[#0B0B0B]' : 'text-[#555555]'
                      }`}
                    >
                      {layer.name}
                    </span>
                  </div>

                  {/* Right: Lock, Opacity & Reorder actions */}
                  <div className="flex items-center gap-1 flex-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(layer.id);
                      }}
                      className="p-0.5 text-[#555555] hover:text-[#0B0B0B]"
                    >
                      {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>

                    <button
                      type="button"
                      disabled={actualIdx === layers.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(layer.id, 'up');
                      }}
                      className="p-0.5 disabled:opacity-20 hover:text-[#0B0B0B]"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={actualIdx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(layer.id, 'down');
                      }}
                      className="p-0.5 disabled:opacity-20 hover:text-[#0B0B0B]"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    {layers.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteLayer(layer.id);
                        }}
                        className="p-0.5 text-[#EF4444] hover:opacity-70"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Selected Layer Opacity */}
        {activeLayerId && (
          <div className="flex items-center justify-between gap-2 pt-1 font-mono text-[10px] text-[#555555]">
            <span>Active Layer Opacity:</span>
            <input
              type="range"
              min={10}
              max={100}
              value={Math.round(
                (layers.find((l) => l.id === activeLayerId)?.opacity || 1) * 100
              )}
              onChange={(e) =>
                onChangeOpacity(activeLayerId, Number(e.target.value) / 100)
              }
              className="w-24 accent-[#0B0B0B]"
            />
          </div>
        )}
      </div>

      {/* 2. COSMIC COLOR PALETTE */}
      <div className="flex flex-col gap-2 border-b-2 border-dashed border-[#9A9A9A] pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#0B0B0B]" />
            <span
              className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
              style={{ fontFamily: '"Silkscreen", monospace' }}
            >
              COSMIC SWATCHES
            </span>
          </div>

          <label className="flex items-center gap-1 font-mono text-[10px] text-[#0B0B0B] cursor-pointer">
            <input
              type="checkbox"
              checked={isFilledShape}
              onChange={(e) => onToggleFilledShape(e.target.checked)}
              className="accent-[#0B0B0B]"
            />
            <span>Fill Shape</span>
          </label>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-6 gap-1.5">
          {COSMIC_SWATCHES.map((swatch) => {
            const isSelected = color.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => onChangeColor(swatch.hex)}
                title={`${swatch.name} (${swatch.hex})`}
                className={`w-8 h-8 border-2 transition-transform ${
                  isSelected
                    ? 'border-[#0B0B0B] scale-110 shadow-[2px_2px_0px_#0B0B0B]'
                    : 'border-[#9A9A9A] hover:scale-105'
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
            );
          })}
        </div>

        {/* Recent Colors */}
        {recentColors.length > 0 && (
          <div className="flex flex-col gap-1 pt-1">
            <span className="font-mono text-[9px] font-bold text-[#9A9A9A] uppercase tracking-wider">
              RECENT:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {recentColors.map((hex, idx) => (
                <button
                  key={`${hex}-${idx}`}
                  type="button"
                  onClick={() => onChangeColor(hex)}
                  title={`Recent ${hex}`}
                  className="w-5 h-5 border border-[#0B0B0B] flex-none hover:scale-110"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. STROKE & BLEND SETTINGS */}
      <div className="flex flex-col gap-2 border-b-2 border-dashed border-[#9A9A9A] pb-3">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#0B0B0B]" />
          <span
            className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
            style={{ fontFamily: '"Silkscreen", monospace' }}
          >
            STROKE &amp; BLEND
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
          <div>
            <label className="text-[#555555] block mb-0.5">STYLE:</label>
            <select
              value={strokeStyle}
              onChange={(e) => onChangeStrokeStyle(e.target.value as StrokeStyle)}
              className="w-full p-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] font-bold focus:outline-none"
            >
              <option value="solid">Solid Line</option>
              <option value="dashed">Dashed Orbit</option>
              <option value="pixel">Pixel Crisp</option>
              <option value="glow">Cosmic Glow</option>
            </select>
          </div>

          <div>
            <label className="text-[#555555] block mb-0.5">BLEND:</label>
            <select
              value={blendMode}
              onChange={(e) => onChangeBlendMode(e.target.value as StudioBlendMode)}
              className="w-full p-1 border-2 border-[#0B0B0B] bg-[#F1F1F0] font-bold focus:outline-none"
            >
              <option value="source-over">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. TEMPLATE UNDERLAY / TRACING */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0B0B0B]" />
            <span
              className="font-mono text-xs font-black uppercase tracking-wider text-[#0B0B0B]"
              style={{ fontFamily: '"Silkscreen", monospace' }}
            >
              TRACE TEMPLATE
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenTemplateLibrary}
            className="text-[10px] font-mono font-bold text-[#0070F3] hover:underline"
          >
            Browse
          </button>
        </div>

        {activeTemplate ? (
          <div className="flex flex-col gap-1.5 p-2 border-2 border-[#0B0B0B] bg-[#F1F1F0]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold truncate">
                {activeTemplate.title}
              </span>
              <button
                type="button"
                onClick={onClearTemplate}
                title="Remove Template"
                className="text-[#EF4444] hover:opacity-70 p-0.5 font-mono text-[10px] font-bold"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 font-mono text-[9px] text-[#555555]">
              <span>Trace Opacity:</span>
              <input
                type="range"
                min={5}
                max={90}
                value={Math.round(templateOpacity * 100)}
                onChange={(e) => onChangeTemplateOpacity(Number(e.target.value) / 100)}
                className="w-20 accent-[#0B0B0B]"
              />
              <span>{Math.round(templateOpacity * 100)}%</span>
            </div>
          </div>
        ) : (
          <p className="font-mono text-[10px] text-[#777777] leading-relaxed">
            No space-art template loaded. Choose from our 10 astronomical categories to trace or sketch!
          </p>
        )}
      </div>
    </aside>
  );
};

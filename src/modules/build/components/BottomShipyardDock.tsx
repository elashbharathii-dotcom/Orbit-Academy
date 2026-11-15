import React, { useState } from 'react';
import {
  Blueprint,
  TransformMode,
  VehicleStats,
} from '../types';
import {
  MousePointer,
  Move,
  RotateCw,
  Maximize,
  Grid,
  Play,
  Square,
  Save,
  Download,
  Plus,
  ChevronUp,
  ChevronDown,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { workshopAudio } from '../audio/workshopAudio';

interface BottomShipyardDockProps {
  blueprints: Blueprint[];
  activeBlueprintId: string | null;
  onSelectBlueprint: (bp: Blueprint) => void;
  onNewDesign: () => void;
  transformMode: TransformMode;
  onTransformModeChange: (mode: TransformMode) => void;
  isSnapEnabled: boolean;
  onToggleSnap: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onSaveBlueprint: () => void;
  onExportBlueprint: () => void;
  explodedFactor?: number;
  onExplodedFactorChange?: (factor: number) => void;
  stats?: VehicleStats;
}

export const BottomShipyardDock: React.FC<BottomShipyardDockProps> = ({
  blueprints,
  activeBlueprintId,
  onSelectBlueprint,
  onNewDesign,
  transformMode,
  onTransformModeChange,
  isSnapEnabled,
  onToggleSnap,
  isSimulating,
  onToggleSimulation,
  onSaveBlueprint,
  onExportBlueprint,
  explodedFactor = 0,
  onExplodedFactorChange,
  stats,
}) => {
  const [isDockMinimized, setIsDockMinimized] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 640;
  });

  if (isDockMinimized) {
    return (
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl border border-white/10 bg-[#070C1B]/95 backdrop-blur-xl shadow-2xl z-20 max-w-sm mx-auto">
        <span className="font-mono text-xs text-[#00E5FF] font-bold flex items-center gap-1.5">
          <Grid className="h-3.5 w-3.5" />
          <span>Shipyard Dock</span>
        </span>
        <button
          type="button"
          onClick={() => setIsDockMinimized(false)}
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] font-mono text-[11px] font-bold hover:bg-[#00E5FF]/30 transition-colors cursor-pointer"
        >
          <span>Open Dock</span>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-white/10 bg-[#070C1B]/90 backdrop-blur-2xl shadow-2xl z-20 max-h-[50vh] sm:max-h-none overflow-y-auto sm:overflow-visible">
      <button
        type="button"
        onClick={() => setIsDockMinimized(true)}
        title="Minimize Dock"
        className="sm:hidden absolute top-2 right-2 text-[#94A3B8] hover:text-white p-1 bg-white/5 rounded-lg cursor-pointer"
      >
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* 1. BLUEPRINTS CAROUSEL (Left) */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[280px] max-w-sm lg:max-w-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-white/50">
            BLUEPRINT ARCHIVES
          </span>
          <span className="font-mono text-[9.5px] text-[#00E5FF]">
            {blueprints.length} DESIGNS
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {blueprints.slice(0, 5).map((bp) => {
            const isActive = activeBlueprintId === bp.id;
            return (
              <button
                key={bp.id}
                type="button"
                onClick={() => {
                  onSelectBlueprint(bp);
                  workshopAudio.playClick(1100);
                }}
                className={`group flex flex-col items-center justify-between p-1.5 rounded-xl border text-center transition-all shrink-0 w-24 h-16 cursor-pointer ${
                  isActive
                    ? 'border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/20 to-[#070C1B] shadow-[0_0_14px_rgba(0,229,255,0.35)]'
                    : 'border-white/10 bg-[#0B1226]/80 hover:border-white/30'
                }`}
              >
                <div className="flex h-7 w-full items-center justify-center rounded bg-black/50 border border-white/5 group-hover:border-[#00E5FF]/30">
                  <span className="font-mono text-[9px] font-bold text-[#00E5FF]">
                    {bp.shipClass.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <span className="font-sans text-[10px] font-bold text-white truncate w-full">
                  {bp.name}
                </span>
              </button>
            );
          })}

          {/* New Design Button */}
          <button
            type="button"
            onClick={() => {
              onNewDesign();
              workshopAudio.playClick(1400);
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-dashed border-white/20 bg-white/5 hover:border-[#F27D26] hover:bg-[#F27D26]/10 text-white/60 hover:text-[#F27D26] transition-all shrink-0 w-20 h-16 cursor-pointer"
          >
            <Plus className="h-4 w-4 mb-0.5" />
            <span className="font-sans text-[9.5px] font-bold leading-tight">New Design</span>
          </button>
        </div>
      </div>

      {/* 2. EXPLODED ASSEMBLY VIEW SLIDER (Center) */}
      <div className="flex flex-col gap-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 min-w-[210px]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1">
            <Layers className="h-3 w-3 text-[#00E5FF]" />
            <span>EXPLODED VIEW</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#00E5FF]">
              {(explodedFactor * 100).toFixed(0)}%
            </span>
            {explodedFactor > 0 && (
              <button
                type="button"
                onClick={() => {
                  onExplodedFactorChange?.(0);
                  workshopAudio.playExplodeSweep(0);
                }}
                className="text-white/40 hover:text-white p-0.5 cursor-pointer"
                title="Reset Assembly"
              >
                <RotateCcw className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={explodedFactor}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onExplodedFactorChange?.(val);
            if (Math.random() < 0.2) workshopAudio.playExplodeSweep(val);
          }}
          className="w-full accent-[#00E5FF] cursor-pointer h-1.5 bg-black/60 rounded-lg"
        />

        <div className="flex justify-between text-[9px] font-mono text-white/40">
          <span>ASSEMBLED</span>
          <span>DISASSEMBLED</span>
        </div>
      </div>

      {/* 3. BUILD & TRANSFORM TOOLS (Center) */}
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-white/50">
          GIZMO TOOLS
        </span>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1226] border border-white/10">
          <button
            type="button"
            onClick={() => {
              onTransformModeChange('select');
              workshopAudio.playClick(1000);
            }}
            title="Select Mode"
            className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all cursor-pointer ${
              transformMode === 'select'
                ? 'bg-[#00E5FF] text-[#030611] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <MousePointer className="h-3.5 w-3.5" />
            <span className="font-mono text-[8.5px] mt-0.5">Select</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTransformModeChange('translate');
              workshopAudio.playClick(1100);
            }}
            title="Move Tool [W]"
            className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all cursor-pointer ${
              transformMode === 'translate'
                ? 'bg-[#00E5FF] text-[#030611] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Move className="h-3.5 w-3.5" />
            <span className="font-mono text-[8.5px] mt-0.5">Move [W]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTransformModeChange('rotate');
              workshopAudio.playClick(1200);
            }}
            title="Rotate Tool [E]"
            className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all cursor-pointer ${
              transformMode === 'rotate'
                ? 'bg-[#00E5FF] text-[#030611] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span className="font-mono text-[8.5px] mt-0.5">Rotate [E]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTransformModeChange('scale');
              workshopAudio.playClick(1300);
            }}
            title="Scale Tool [R]"
            className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all cursor-pointer ${
              transformMode === 'scale'
                ? 'bg-[#00E5FF] text-[#030611] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Maximize className="h-3.5 w-3.5" />
            <span className="font-mono text-[8.5px] mt-0.5">Scale [R]</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleSnap();
              workshopAudio.playClick(950);
            }}
            title="Toggle Grid Snapping"
            className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all cursor-pointer ${
              isSnapEnabled
                ? 'bg-[#F27D26] text-[#030611] font-bold shadow-[0_0_10px_rgba(242,125,38,0.4)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span className="font-mono text-[8.5px] mt-0.5">Snap</span>
          </button>
        </div>
      </div>

      {/* 4. SIMULATION LAUNCH / HOT-FIRE TEST */}
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-white/50">
          HOT-FIRE TEST
        </span>

        <button
          type="button"
          onClick={() => {
            onToggleSimulation();
            workshopAudio.playClick(isSimulating ? 700 : 1800);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer ${
            isSimulating
              ? 'bg-[#EF4444] text-white shadow-[0_0_18px_rgba(239,68,68,0.6)] animate-pulse'
              : 'bg-gradient-to-r from-[#F27D26] to-[#EE3F2C] text-white shadow-[0_0_16px_rgba(242,125,38,0.45)] hover:brightness-110'
          }`}
        >
          {isSimulating ? (
            <>
              <Square className="h-4 w-4" />
              <span>Abort Fire</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Ignition Test</span>
            </>
          )}
        </button>
      </div>

      {/* 5. LIVE TELEMETRY BADGES (Inspired by Auto-Machines HUD dock) */}
      {stats && (
        <div className="hidden 2xl:flex items-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[10px]">
          <span className="px-3 py-1 bg-white text-black font-bold rounded-full">
            {(stats.totalGrossMass / 1000).toFixed(1)}t MASS
          </span>
          <span className="px-2.5 py-1 text-cyan-300 border border-cyan-400/30 bg-cyan-500/10 rounded-full font-bold">
            {stats.deltaV.toFixed(0)} m/s ΔV
          </span>
          <span className="px-2.5 py-1 text-amber-300 border border-amber-400/30 bg-amber-500/10 rounded-full font-bold">
            TWR: {stats.twr.toFixed(2)}
          </span>
          <span className="px-2.5 py-1 text-emerald-300 border border-emerald-400/30 bg-emerald-500/10 rounded-full font-bold">
            {stats.netPowerKw >= 0 ? `+${stats.netPowerKw.toFixed(0)}` : stats.netPowerKw.toFixed(0)} kW
          </span>
        </div>
      )}

      {/* 6. SAVE & EXPORT */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            onSaveBlueprint();
            workshopAudio.playClick(1500);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#E06815] text-white font-sans text-xs font-bold shadow-[0_0_16px_rgba(242,125,38,0.5)] active:scale-95 transition-all cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Save Ship</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onExportBlueprint();
            workshopAudio.playClick(1200);
          }}
          title="Export Blueprint JSON File"
          className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-white/10 bg-[#0B1226] text-white/70 font-mono text-xs hover:border-[#00E5FF]/40 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>JSON</span>
        </button>
      </div>
    </div>
  );
};

export default BottomShipyardDock;

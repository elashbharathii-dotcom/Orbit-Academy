import React, { useState } from 'react';
import {
  AssembledComponent,
  VehicleStats,
  LiveryOption,
  MaterialFinish,
  ShipClass,
} from '../types';
import {
  LIVERY_OPTIONS,
  MATERIAL_STUDIO_FINISHES,
} from '../buildData';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sliders,
  Copy,
  Trash2,
  Activity,
  Fuel,
} from 'lucide-react';

interface ShipInspectorPanelProps {
  shipName: string;
  onShipNameChange: (name: string) => void;
  shipClass: ShipClass;
  onShipClassChange: (c: ShipClass) => void;
  stats: VehicleStats;
  selectedComponent: AssembledComponent | null;
  onUpdateComponentTransform: (
    instanceId: string,
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number]
  ) => void;
  onUpdatePropellantFill: (instanceId: string, fillRate: number) => void;
  onDuplicateComponent: (instanceId: string) => void;
  onDeleteComponent: (instanceId: string) => void;
  allComponents: AssembledComponent[];
  onSelectComponent: (instanceId: string | null) => void;
  selectedLivery: LiveryOption;
  onSelectLivery: (livery: LiveryOption) => void;
  selectedMaterial: MaterialFinish;
  onSelectMaterial: (mat: MaterialFinish) => void;
  engineGlowColor: string;
  onEngineGlowColorChange: (color: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ShipInspectorPanel: React.FC<ShipInspectorPanelProps> = ({
  shipName,
  shipClass,
  onShipClassChange,
  stats,
  selectedComponent,
  onUpdateComponentTransform,
  onUpdatePropellantFill,
  onDuplicateComponent,
  onDeleteComponent,
  allComponents,
  onSelectComponent,
  selectedLivery,
  onSelectLivery,
  selectedMaterial,
  onSelectMaterial,
  engineGlowColor,
  onEngineGlowColorChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'hierarchy'>('details');
  const [openAccordion, setOpenAccordion] = useState<string>('stats');

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 bg-[#070C1B]/90 border border-white/10 rounded-2xl w-10 shrink-0 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Expand Ship Inspector"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#00E5FF] hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] -rotate-90 mt-14 whitespace-nowrap">
          Ship Inspector
        </span>
      </div>
    );
  }

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? '' : key);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[340px] sm:max-w-[360px] rounded-2xl border border-white/10 bg-[#070C1B]/90 p-3.5 backdrop-blur-xl shadow-2xl shrink-0 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="font-sans text-sm font-extrabold text-white tracking-wide">
          Ship Inspector
        </span>

        <button
          type="button"
          onClick={onToggleCollapse}
          title="Collapse Panel"
          className="flex h-6 w-6 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs (Details / Materials / Hierarchy) */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0B1226] border border-white/5 font-mono text-[11px]">
        {(['details', 'materials', 'hierarchy'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-1 rounded-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#00E5FF] text-[#030611] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin space-y-3">
        {/* =============================================================== */}
        {/* TAB 1: DETAILS (Matches Reference Image Layout)                 */}
        {/* =============================================================== */}
        {activeTab === 'details' && (
          <div className="space-y-3">
            {/* Mini Ship Silhouette Banner */}
            <div className="relative flex h-24 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1226] via-[#101F3D] to-[#070C1B] border border-white/10 overflow-hidden shadow-inner p-2">
              <div className="flex flex-col items-center">
                <span className="font-sans text-xs font-bold text-white tracking-wider uppercase">
                  {shipName}
                </span>
                <span className="font-mono text-[10px] text-[#00E5FF]">
                  {shipClass} Class Starship
                </span>
                <span className="font-mono text-[9px] text-[#64748B] mt-1">
                  Active Blueprint • {allComponents.length} Modules
                </span>
              </div>
            </div>

            {/* Specifications Key-Value Table */}
            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 p-3 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Name:</span>
                <span className="font-bold text-white truncate max-w-[160px]">{shipName}</span>
              </div>

              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Class:</span>
                <select
                  value={shipClass}
                  onChange={(e) => onShipClassChange(e.target.value as ShipClass)}
                  className="rounded bg-[#070C1B] border border-white/10 px-2 py-0.5 text-xs text-[#00E5FF] font-bold focus:outline-none"
                >
                  <option value="Explorer">Explorer</option>
                  <option value="Fighter">Fighter</option>
                  <option value="Cruiser">Cruiser</option>
                  <option value="Hauler">Hauler</option>
                  <option value="Interceptor">Interceptor</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Mass:</span>
                <span className="font-bold text-white">
                  {(stats.totalGrossMass / 1000).toFixed(1)} t
                </span>
              </div>

              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Length:</span>
                <span className="font-bold text-white">{stats.totalLengthMeters} m</span>
              </div>

              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Power:</span>
                <span
                  className={`font-bold ${
                    stats.netPowerKw >= 0 ? 'text-[#34D399]' : 'text-red-400'
                  }`}
                >
                  {stats.netPowerKw >= 0 ? `+${stats.netPowerKw} kW` : `${stats.netPowerKw} kW`}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Thrust:</span>
                <span className="font-bold text-[#F59E0B]">
                  {stats.totalThrustKn.toLocaleString()} kN
                </span>
              </div>

              <div className="flex justify-between items-center text-[#94A3B8] border-b border-white/5 pb-1">
                <span>Stability:</span>
                <span className="font-bold text-[#38BDF8]">{stats.stabilityScore}%</span>
              </div>

              {/* Mission Readiness Progress Bar */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex justify-between items-center text-[#94A3B8] text-[11px]">
                  <span>Mission Readiness:</span>
                  <span className="font-bold text-[#34D399]">{stats.missionReadiness}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#070C1B] overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#34D399] transition-all duration-300 shadow-[0_0_8px_#34D399]"
                    style={{ width: `${stats.missionReadiness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Accordion 1: Selected Component Stats & 3D Transform Inputs */}
            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion('stats')}
                className="w-full flex items-center justify-between p-2.5 font-sans text-xs font-bold text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-[#00E5FF]" />
                  <span>Component Stats</span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#94A3B8] transition-transform ${
                    openAccordion === 'stats' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'stats' && (
                <div className="p-3 border-t border-white/5 space-y-2.5 font-mono text-[11px]">
                  {selectedComponent ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{selectedComponent.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onDuplicateComponent(selectedComponent.instanceId)}
                            title="Duplicate (Ctrl+D)"
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-[#00E5FF]"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteComponent(selectedComponent.instanceId)}
                            title="Delete (Delete)"
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Numeric 3D Position Inputs */}
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block mb-1">
                          Position (X, Y, Z meters):
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['X', 'Y', 'Z'] as const).map((axis, i) => (
                            <div key={axis} className="flex items-center rounded bg-[#070C1B] border border-white/10 px-1 py-0.5">
                              <span className="text-[9px] text-[#00E5FF] font-bold mr-1">{axis}:</span>
                              <input
                                type="number"
                                step="0.2"
                                value={selectedComponent.position[i]}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const newPos = [...selectedComponent.position] as [number, number, number];
                                  newPos[i] = val;
                                  onUpdateComponentTransform(
                                    selectedComponent.instanceId,
                                    newPos,
                                    selectedComponent.rotation,
                                    selectedComponent.scale
                                  );
                                }}
                                className="w-full bg-transparent text-white font-mono text-[10px] focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cryo Propellant Fill Rate */}
                      {selectedComponent.propellantCapacity > 0 && (
                        <div className="space-y-1 pt-1 border-t border-white/5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="flex items-center gap-1 text-[#00E5FF]">
                              <Fuel className="h-3 w-3" />
                              <span>Fuel Level:</span>
                            </span>
                            <span className="text-white font-bold">
                              {Math.round(selectedComponent.propellantFill * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={Math.round(selectedComponent.propellantFill * 100)}
                            onChange={(e) =>
                              onUpdatePropellantFill(
                                selectedComponent.instanceId,
                                parseFloat(e.target.value) / 100
                              )
                            }
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#070C1B] accent-[#00E5FF]"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4 text-[#64748B]">
                      <span>No component selected in 3D viewport. Click any part to inspect.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Accordion 2: Performance Telemetry */}
            <div className="rounded-xl border border-white/10 bg-[#0B1226]/80 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion('perf')}
                className="w-full flex items-center justify-between p-2.5 font-sans text-xs font-bold text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>Performance Diagnostics</span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#94A3B8] transition-transform ${
                    openAccordion === 'perf' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openAccordion === 'perf' && (
                <div className="p-3 border-t border-white/5 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between items-center text-[#94A3B8]">
                    <span>Mission Delta-V:</span>
                    <span className="text-[#F59E0B] font-bold">
                      {stats.deltaV.toLocaleString()} m/s
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#94A3B8]">
                    <span>Liftoff TWR:</span>
                    <span
                      className={`font-bold ${
                        stats.isFlightReady ? 'text-[#34D399]' : 'text-amber-400'
                      }`}
                    >
                      {stats.twr.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#94A3B8]">
                    <span>Specific Impulse:</span>
                    <span className="text-[#A78BFA] font-bold">{stats.weightedIsp} s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 2: MATERIALS STUDIO                                         */}
        {/* =============================================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-3">
            {/* 10 PBR Material Finishes */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#94A3B8]">
                PBR Material Finish (10 Presets)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  'titanium',
                  'aluminum',
                  'carbon_fiber',
                  'ceramic_tiles',
                  'heat_alloy',
                  'glass',
                  'gold_insulation',
                  'metallic_coat',
                  'painted_gloss',
                  'solar_cells',
                ] as MaterialFinish[]).map((mKey) => {
                  const m = MATERIAL_STUDIO_FINISHES[mKey];
                  if (!m) return null;
                  const isSel = selectedMaterial === mKey;
                  return (
                    <button
                      key={mKey}
                      type="button"
                      onClick={() => onSelectMaterial(mKey)}
                      className={`flex flex-col p-2 rounded-xl border text-left transition-all ${
                        isSel
                          ? 'border-[#00E5FF] bg-[#00E5FF]/15 shadow-[0_0_10px_rgba(0,229,255,0.25)]'
                          : 'border-white/10 bg-[#0B1226] hover:border-white/20'
                      }`}
                    >
                      <span className="font-sans text-[11px] font-bold text-white truncate">
                        {m.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#64748B] mt-0.5">
                        {m.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Livery Palette Schemes */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#94A3B8]">
                Hull Livery Scheme
              </span>
              <div className="grid grid-cols-7 gap-1">
                {LIVERY_OPTIONS.map((liv) => {
                  const isSel = selectedLivery.id === liv.id;
                  return (
                    <button
                      key={liv.id}
                      type="button"
                      onClick={() => onSelectLivery(liv)}
                      title={liv.name}
                      className={`h-8 rounded-lg border flex items-center justify-center p-0.5 transition-all ${
                        isSel
                          ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/60 scale-105'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      style={{ backgroundColor: liv.primaryColor }}
                    >
                      <span
                        className="h-2 w-2 rounded-full border border-black/30"
                        style={{ backgroundColor: liv.accentColor }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Engine Plasma Glow Color */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#94A3B8]">
                Engine Plasma Glow
              </span>
              <div className="flex items-center gap-2">
                {['#00E5FF', '#38BDF8', '#818CF8', '#A78BFA', '#F59E0B', '#EA580C', '#34D399'].map(
                  (col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => onEngineGlowColorChange(col)}
                      className={`h-6 w-6 rounded-full border transition-all ${
                        engineGlowColor === col
                          ? 'border-white ring-2 ring-white/60 scale-110 shadow-lg'
                          : 'border-white/20 opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 3: HIERARCHY TREE                                           */}
        {/* =============================================================== */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-2">
              Assembly Tree ({allComponents.length} Nodes)
            </span>

            {allComponents.map((comp, idx) => {
              const isSel = selectedComponent?.instanceId === comp.instanceId;
              return (
                <div
                  key={comp.instanceId}
                  onClick={() => onSelectComponent(comp.instanceId)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    isSel
                      ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-white'
                      : 'border-white/5 bg-[#0B1226]/70 text-[#94A3B8] hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-[10px] text-[#00E5FF]">{idx + 1}.</span>
                    <span className="font-sans text-xs truncate">{comp.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComponent(comp.instanceId);
                    }}
                    title="Remove component"
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Auto-Machines Style Technical Spec Badges */}
      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-1">
        <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider bg-white/10 text-white border border-white/15 rounded-md">
          PBR / METRIC
        </span>
        <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider border border-[#00E5FF]/30 text-[#00E5FF] rounded-md">
          NASA JPL
        </span>
        <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider border border-white/15 text-white/70 rounded-md">
          TRL 9
        </span>
        <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider border border-[#F27D26]/40 text-[#F27D26] rounded-md">
          DEEP SPACE
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  X,
  Droplets,
  Layers,
  Wrench,
  Sparkles,
  Sun,
  Flame,
  ShieldCheck,
  Cpu,
  BatteryCharging,
  Settings,
  Microscope,
  Mountain,
  Gem,
  Package,
} from 'lucide-react';

interface InventoryDrawerProps {
  onClose: () => void;
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({ onClose }) => {
  const inventory = useMarsGameStore((state) => state.inventory);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);
  const craftOxygen = useMarsGameStore((state) => state.craftOxygenCanister);
  const repairSuit = useMarsGameStore((state) => state.repairSuitIntegrity);

  const getIcon = (type: string) => {
    switch (type) {
      case 'scrap_metal':
        return <Wrench className="h-5 w-5 text-amber-400" />;
      case 'electronic_parts':
        return <Cpu className="h-5 w-5 text-cyan-400" />;
      case 'damaged_battery':
        return <BatteryCharging className="h-5 w-5 text-yellow-400" />;
      case 'mechanical_parts':
        return <Settings className="h-5 w-5 text-purple-400" />;
      case 'scientific_sample':
        return <Microscope className="h-5 w-5 text-emerald-400" />;
      case 'water_ice':
        return <Droplets className="h-5 w-5 text-cyan-400" />;
      case 'hematite':
        return <Layers className="h-5 w-5 text-orange-400" />;
      case 'titanium_scrap':
        return <Wrench className="h-5 w-5 text-slate-300" />;
      case 'silicate_crystal':
        return <Sparkles className="h-5 w-5 text-yellow-300" />;
      case 'sulfur_mineral':
        return <Gem className="h-5 w-5 text-amber-300" />;
      case 'regolith':
        return <Mountain className="h-5 w-5 text-stone-400" />;
      case 'solar_cell':
        return <Sun className="h-5 w-5 text-sky-400" />;
      default:
        return <Package className="h-5 w-5 text-white" />;
    }
  };

  const weightPercent = Math.min(100, Math.round((backpackWeight / maxBackpackCapacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-white/10 bg-[#0A0F1D]/95 p-6 shadow-2xl font-mono text-slate-100 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold tracking-wider text-white">
              ASTRONAUT FIELD INVENTORY & BACKPACK
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Backpack Capacity Gauge */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3">
          <div>
            <div className="text-[10px] text-slate-400">BACKPACK WEIGHT LOAD</div>
            <div className="text-sm font-extrabold text-cyan-300">
              {backpackWeight.toFixed(1)} / {maxBackpackCapacity.toFixed(1)} KG
            </div>
          </div>
          <div className="w-40">
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${weightPercent > 90
                    ? 'bg-red-500'
                    : weightPercent > 70
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                  }`}
                style={{ width: `${weightPercent}%` }}
              />
            </div>
            <div className="text-right text-[10px] text-slate-400 mt-1">
              {weightPercent}% Capacity
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[46vh] overflow-y-auto pr-1 custom-scrollbar">
          {Object.values(inventory).map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-all ${item.count > 0
                  ? 'border-white/10 bg-[#11182E] hover:border-white/20'
                  : 'border-white/5 bg-[#0D1322]/50 opacity-50'
                }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                {getIcon(item.id)}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">{item.name}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold shrink-0 ${item.count > 0 ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-500'
                      }`}
                  >
                    x{item.count}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 leading-tight line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-1 text-[10px] text-slate-500 font-semibold">
                  {item.weightPerUnit} kg/ea • {(item.count * item.weightPerUnit).toFixed(1)} kg subtotal
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Field Fabrication & Synthesis Station */}
        <div className="mt-5 border-t border-white/10 pt-4">
          <h3 className="mb-2 text-xs font-bold tracking-wider text-amber-400 uppercase">
            Emergency Field Refiner
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Electrolyze O2 */}
            <button
              onClick={craftOxygen}
              disabled={inventory.water_ice.count < 2}
              className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-left transition-all hover:bg-cyan-500/20 disabled:opacity-40"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-cyan-200">Electrolyze O2</div>
                  <div className="text-[10px] text-slate-400">Costs 2x Water Ice</div>
                </div>
              </div>
              <span className="rounded bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                +45% O2
              </span>
            </button>

            {/* Suit Hull Repair */}
            <button
              onClick={repairSuit}
              disabled={inventory.titanium_scrap.count < 1}
              className="flex items-center justify-between rounded-xl border border-slate-500/30 bg-slate-500/10 p-3 text-left transition-all hover:bg-slate-500/20 disabled:opacity-40"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Patch Hull Seal</div>
                  <div className="text-[10px] text-slate-400">Costs 1x Titanium</div>
                </div>
              </div>
              <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                100% Hull
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
          <span>JEZERO EXPEDITION CARGO POD</span>
          <span>PRESS [C] TO TOGGLE</span>
        </div>
      </div>
    </div>
  );
};

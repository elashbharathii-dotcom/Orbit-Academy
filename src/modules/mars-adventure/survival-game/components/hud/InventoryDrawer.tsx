import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  ResourceType,
  ResourceCategory,
  RESOURCE_DEFINITIONS,
} from '../../types/survivalTypes';
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
  Battery,
  Settings,
  Microscope,
  Mountain,
  Gem,
  Package,
  UtensilsCrossed,
  Droplet,
  HeartPulse,
  Trash2,
  Vault,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface InventoryDrawerProps {
  onClose: () => void;
}

const CATEGORY_TABS: Array<{ id: 'ALL' | ResourceCategory; label: string }> = [
  { id: 'ALL', label: 'ALL SLOTS' },
  { id: 'material', label: 'MATERIALS' },
  { id: 'component', label: 'COMPONENTS' },
  { id: 'mineral', label: 'MINERALS' },
  { id: 'consumable', label: 'CONSUMABLES' },
];

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({ onClose }) => {
  const inventory = useMarsGameStore((state) => state.inventory);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);
  const craftOxygen = useMarsGameStore((state) => state.craftOxygenCanister);
  const repairSuit = useMarsGameStore((state) => state.repairSuitIntegrity);
  const dropItem = useMarsGameStore((state) => state.dropItem);
  const useConsumable = useMarsGameStore((state) => state.useConsumable);
  const openStorageModal = useMarsGameStore((state) => state.openStorageModal);

  const [activeCategory, setActiveCategory] = useState<'ALL' | ResourceCategory>('ALL');
  const [selectedResourceId, setSelectedResourceId] = useState<ResourceType>('scrap_metal');

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case 'scrap_metal':
        return <Wrench className="h-5 w-5 text-amber-400" />;
      case 'copper_wire':
        return <Wrench className="h-5 w-5 text-orange-400" />;
      case 'circuit_board':
        return <Cpu className="h-5 w-5 text-emerald-400" />;
      case 'fasteners':
        return <Wrench className="h-5 w-5 text-slate-300" />;
      case 'battery_cell':
        return <BatteryCharging className="h-5 w-5 text-cyan-400" />;
      case 'polymer':
        return <Layers className="h-5 w-5 text-amber-300" />;
      case 'food_ration':
        return <UtensilsCrossed className="h-5 w-5 text-emerald-400" />;
      case 'water':
        return <Droplet className="h-5 w-5 text-cyan-400" />;
      case 'medical_kit':
        return <HeartPulse className="h-5 w-5 text-red-400" />;
      case 'electronic_parts':
        return <Cpu className="h-5 w-5 text-cyan-400" />;
      case 'damaged_battery':
        return <Battery className="h-5 w-5 text-yellow-400" />;
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

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'exotic':
        return 'border-purple-500/50 bg-purple-500/10 text-purple-300';
      case 'rare':
        return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300';
      case 'uncommon':
        return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
      default:
        return 'border-slate-600 bg-slate-800/60 text-slate-300';
    }
  };

  const weightPercent = Math.min(100, Math.round((backpackWeight / maxBackpackCapacity) * 100));
  const isOverweight = backpackWeight > maxBackpackCapacity;
  const isHeavy = weightPercent >= 70;

  // Filter items by category
  const allItems = Object.values(inventory);
  const filteredItems = allItems.filter((item) => {
    const def = RESOURCE_DEFINITIONS[item.id];
    if (activeCategory === 'ALL') return true;
    return (def?.category ?? item.category) === activeCategory;
  });

  const selectedItem = inventory[selectedResourceId] || allItems[0];
  const selectedDef = RESOURCE_DEFINITIONS[selectedItem.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md font-mono select-none animate-fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-cyan-500/30 bg-[#0A0F1D]/98 shadow-[0_0_50px_rgba(6,182,212,0.18)] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-950/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-base font-extrabold tracking-wider text-cyan-100">
                EVA ASTRONAUT FIELD BACKPACK
              </h2>
              <p className="text-[11px] text-slate-400">
                Mass-constrained life-support inventory • 0.38g Jezero Crater expedition load
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                openStorageModal();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition-all"
            >
              <Vault className="h-4 w-4" />
              <span>OUTPOST VAULT</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Backpack Capacity Gauge */}
        <div className="border-b border-white/5 bg-[#0D1527]/60 px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] text-slate-400">CURRENT PAYLOAD LOAD</div>
                <div className="text-sm font-extrabold text-cyan-200">
                  {backpackWeight.toFixed(1)} / {maxBackpackCapacity.toFixed(1)} KG
                </div>
              </div>
              {isOverweight && (
                <div className="flex items-center gap-1.5 rounded-lg border border-red-500/50 bg-red-500/20 px-2 py-1 text-[11px] font-bold text-red-300 animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>OVERBURDENED: Sprint disabled (-25% movement)</span>
                </div>
              )}
              {!isOverweight && isHeavy && (
                <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2 py-1 text-[11px] font-bold text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>HEAVY LOAD: -{Math.round(((backpackWeight / maxBackpackCapacity - 0.70) * 0.4) * 100)}% speed</span>
                </div>
              )}
            </div>

            <div className="w-full sm:w-60">
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${isOverweight
                    ? 'bg-red-500'
                    : isHeavy
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                    }`}
                  style={{ width: `${Math.min(100, weightPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Free Space: {Math.max(0, maxBackpackCapacity - backpackWeight).toFixed(1)} KG</span>
                <span>{weightPercent}%</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-xl px-3 py-1 text-[11px] font-bold tracking-wider transition-all shrink-0 ${activeCategory === tab.id
                  ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'border border-white/5 bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area: Item Grid & Detail Inspector Pane */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 p-6 overflow-y-auto custom-scrollbar">
          {/* Left: Item Slots Grid (3 columns) */}
          <div className="md:col-span-3 space-y-2 overflow-y-auto max-h-[50vh] pr-1 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredItems.map((item) => {
                const isSelected = selectedItem.id === item.id;
                const def = RESOURCE_DEFINITIONS[item.id];
                const rarity = def?.rarity || item.rarity || 'common';
                const totalItemW = (item.count * (item.weightPerUnit ?? def?.weightPerUnit ?? 1.0)).toFixed(1);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedResourceId(item.id)}
                    className={`flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition-all ${isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : item.count > 0
                        ? `bg-[#0D1527]/80 hover:bg-[#111A30] ${getRarityBadge(rarity)}`
                        : 'border-white/5 bg-[#090D18]/50 opacity-40 hover:opacity-75'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                        {getIcon(item.id)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.weightPerUnit} kg • {totalItemW} kg total
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right ml-2">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-xs font-extrabold ${item.count > 0
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-500'
                          }`}
                      >
                        ×{item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <Package className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs">No resources in this category.</p>
              </div>
            )}
          </div>

          {/* Right: Selected Item Detailed Inspector (2 columns) */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-[#0D1527]/90 p-4">
            <div>
              {/* Item Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
                  {getIcon(selectedItem.id)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-cyan-200 truncate">{selectedItem.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 border ${getRarityBadge(selectedDef?.rarity || 'common')}`}>
                      {selectedDef?.rarity || 'COMMON'}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {selectedDef?.category || 'MATERIAL'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formula & Stack Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/30 rounded-xl p-2.5 mb-3 border border-white/5">
                <div>
                  <div className="text-[10px] text-slate-400">FORMULA</div>
                  <div className="font-bold text-slate-200 truncate">{selectedDef?.chemicalFormula || 'Standard'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">UNIT MASS</div>
                  <div className="font-bold text-amber-300">{selectedDef?.weightPerUnit || 1.0} KG/unit</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">BACKPACK QTY</div>
                  <div className="font-bold text-cyan-300">{selectedItem.count} units</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">STACK LIMIT</div>
                  <div className="font-bold text-slate-300">{selectedDef?.stackLimit || 50} units</div>
                </div>
              </div>

              {/* Description & Usefulness */}
              <div className="space-y-2 text-[11px] text-slate-300">
                <p className="leading-relaxed text-slate-400">{selectedDef?.description || selectedItem.description}</p>
                {selectedDef?.scientificProperties && (
                  <div className="rounded-xl border border-sky-500/20 bg-sky-950/20 p-2 text-[10px] text-sky-200">
                    <div className="font-bold text-sky-400 flex items-center gap-1 mb-0.5">
                      <Info className="h-3 w-3" /> SCIENTIFIC TELEMETRY
                    </div>
                    {selectedDef.scientificProperties}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Selected Item */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              {/* Consumable Action */}
              {selectedDef?.category === 'consumable' && (
                <button
                  onClick={() => useConsumable(selectedItem.id)}
                  disabled={selectedItem.count <= 0}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/30 active:scale-95 disabled:opacity-40 transition-all"
                >
                  <HeartPulse className="h-4 w-4" />
                  <span>CONSUME / USE (+Vitals)</span>
                </button>
              )}

              {/* Drop / Jettison Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => dropItem(selectedItem.id, 1)}
                  disabled={selectedItem.count <= 0}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 py-1.5 text-[11px] font-bold text-red-300 hover:bg-red-500/20 active:scale-95 disabled:opacity-40 transition-all"
                  title="Discard 1 unit to reduce weight"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>DISCARD 1</span>
                </button>
                <button
                  onClick={() => dropItem(selectedItem.id, selectedItem.count)}
                  disabled={selectedItem.count <= 0}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 py-1.5 text-[11px] font-bold text-red-300 hover:bg-red-500/20 active:scale-95 disabled:opacity-40 transition-all"
                  title="Discard all units of this item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>DISCARD ALL</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Field Fabrication & Synthesis Station */}
        <div className="border-t border-cyan-500/20 bg-cyan-950/15 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold tracking-wider text-amber-400 uppercase">
              Emergency Field Refiner & Life Support
            </h3>
            <span className="text-[10px] text-slate-400">Portable Micro-Fab Module</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Electrolyze O2 */}
            <button
              onClick={craftOxygen}
              disabled={inventory.water_ice.count < 2}
              className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-left transition-all hover:bg-cyan-500/20 disabled:opacity-40"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-cyan-200">Electrolyze O2 Canister</div>
                  <div className="text-[10px] text-slate-400">Costs 2x Subsurface Water Ice</div>
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
              className="flex items-center justify-between rounded-xl border border-slate-500/30 bg-slate-500/10 p-2.5 text-left transition-all hover:bg-slate-500/20 disabled:opacity-40"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Patch Suit Micro-Punctures</div>
                  <div className="text-[10px] text-slate-400">Costs 1x Titanium Debris</div>
                </div>
              </div>
              <span className="rounded bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                100% Hull
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-white/5 bg-[#0A0F1D] px-6 py-2.5 text-[10px] text-slate-500">
          <span>JEZERO CRATER EXPEDITION CARGO • DUAL-PHASE STORAGE ACTIVE</span>
          <span>PRESS [B] OR [C] TO TOGGLE</span>
        </div>
      </div>
    </div>
  );
};

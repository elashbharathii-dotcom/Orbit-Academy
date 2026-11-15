import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  CRAFTING_RECIPES,
  CraftingCategory,
  CraftingRecipe,
} from '../../types/craftingTypes';
import {
  RESOURCE_DEFINITIONS,
  ResourceType,
} from '../../types/survivalTypes';
import {
  X,
  Layers,
  Cpu,
  Wrench,
  BatteryCharging,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Package,
  History,
  Sparkles,
  Zap,
} from 'lucide-react';

const CATEGORY_TABS: Array<{ id: 'ALL' | CraftingCategory; label: string }> = [
  { id: 'ALL', label: 'ALL BLUEPRINTS' },
  { id: 'structural', label: 'STRUCTURAL' },
  { id: 'electrical', label: 'ELECTRICAL' },
  { id: 'utility', label: 'UTILITY & KITS' },
];

export const CraftingModal: React.FC = () => {
  const isCraftingModalOpen = useMarsGameStore((state) => state.isCraftingModalOpen);
  const closeCraftingModal = useMarsGameStore((state) => state.closeCraftingModal);
  const inventory = useMarsGameStore((state) => state.inventory);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);
  const vaultStorageWeight = useMarsGameStore((state) => state.vaultStorageWeight);
  const maxVaultCapacity = useMarsGameStore((state) => state.maxVaultCapacity);
  const activeCraftingJob = useMarsGameStore((state) => state.activeCraftingJob);
  const craftingHistory = useMarsGameStore((state) => state.craftingHistory);
  const startCrafting = useMarsGameStore((state) => state.startCrafting);
  const cancelCrafting = useMarsGameStore((state) => state.cancelCrafting);

  const [activeCategory, setActiveCategory] = useState<'ALL' | CraftingCategory>('ALL');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('recipe_metal_plate');
  const [sourceStorage, setSourceStorage] = useState<'backpack' | 'vault'>('vault');
  const [targetStorage, setTargetStorage] = useState<'backpack' | 'vault'>('backpack');
  const [showHistory, setShowHistory] = useState<boolean>(false);

  if (!isCraftingModalOpen) return null;

  const filteredRecipes = CRAFTING_RECIPES.filter((r) => {
    if (activeCategory === 'ALL') return true;
    return r.category === activeCategory;
  });

  const selectedRecipe: CraftingRecipe =
    CRAFTING_RECIPES.find((r) => r.id === selectedRecipeId) || CRAFTING_RECIPES[0];

  const outputDef = RESOURCE_DEFINITIONS[selectedRecipe.output.type];

  // Check material availability from the chosen source storage
  let canCraft = true;
  let missingReason = '';

  for (const ing of selectedRecipe.inputs) {
    const available =
      sourceStorage === 'backpack'
        ? inventory[ing.type]?.count ?? 0
        : vaultStorage[ing.type] ?? 0;
    if (available < ing.count) {
      canCraft = false;
      const ingName = RESOURCE_DEFINITIONS[ing.type]?.name || ing.type;
      missingReason = `Missing ${ing.count - available}x ${ingName}`;
      break;
    }
  }

  // Check target storage capacity
  const outputMass = selectedRecipe.output.count * (outputDef?.weightPerUnit ?? 1.0);
  if (canCraft) {
    if (targetStorage === 'backpack') {
      if (backpackWeight + outputMass > maxBackpackCapacity + 0.001) {
        canCraft = false;
        missingReason = `Backpack full! (+${outputMass.toFixed(1)} kg exceeds max payload)`;
      }
    } else {
      if (vaultStorageWeight + outputMass > maxVaultCapacity + 0.001) {
        canCraft = false;
        missingReason = `Vault capacity full!`;
      }
    }
  }

  const isBusy = activeCraftingJob !== null;
  const progressPercent = activeCraftingJob
    ? Math.min(100, Math.round((activeCraftingJob.progressSeconds / activeCraftingJob.durationSeconds) * 100))
    : 0;
  const remainingSeconds = activeCraftingJob
    ? Math.max(0, activeCraftingJob.durationSeconds - activeCraftingJob.progressSeconds).toFixed(1)
    : '0.0';

  const getRecipeIcon = (type: ResourceType) => {
    switch (type) {
      case 'metal_plate':
        return <Layers className="h-6 w-6 text-slate-300" />;
      case 'wire_assembly':
        return <Cpu className="h-6 w-6 text-orange-400" />;
      case 'repair_kit':
        return <Wrench className="h-6 w-6 text-emerald-400" />;
      case 'battery_pack':
        return <BatteryCharging className="h-6 w-6 text-cyan-400" />;
      case 'structural_frame':
        return <Layers className="h-6 w-6 text-amber-400" />;
      case 'electronics_module':
        return <Cpu className="h-6 w-6 text-purple-400" />;
      default:
        return <Package className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-cyan-500/30 bg-[#0A0F1D]/98 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-950/25 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wider text-cyan-200">
                MOLECULAR SINTERING & FABRICATION UNIT
              </h2>
              <p className="text-[11px] text-slate-400">
                Outpost Alpha automated manufacturing bay • Material processing & component synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                showHistory
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <History className="h-4 w-4" />
              <span>FAB LOG</span>
            </button>
            <button
              onClick={closeCraftingModal}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Machine Status & Live Job Progress Bar */}
        <div className="border-b border-white/5 bg-[#0D1527]/80 px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-3 w-3 rounded-full ${
                  isBusy ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span className="text-xs font-bold tracking-wider text-slate-200">
                STATUS:{' '}
                {isBusy ? (
                  <span className="text-cyan-300">
                    SINTERING {activeCraftingJob?.recipeName.toUpperCase()} — {progressPercent}%
                  </span>
                ) : (
                  <span className="text-emerald-400">READY • REACTION CHAMBER IDLE</span>
                )}
              </span>
            </div>

            {isBusy && (
              <div className="flex items-center gap-3">
                <div className="w-48 sm:w-60">
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all duration-200 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-cyan-300 mt-1 font-bold">
                    <span>ETA: {remainingSeconds}s</span>
                    <span>{progressPercent}%</span>
                  </div>
                </div>

                <button
                  onClick={cancelCrafting}
                  className="flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-300 hover:bg-red-500/25 active:scale-95 transition-all"
                  title="Cancel active job and refund 100% of materials"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>ABORT (REFUND)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Storage Routing Selectors (Draw From / Deliver To) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 bg-[#0A0F1D] px-6 py-2.5 gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-bold">DRAW FEEDSTOCK FROM:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSourceStorage('vault')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  sourceStorage === 'vault'
                    ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200'
                    : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                OUTPOST VAULT ({vaultStorageWeight.toFixed(1)}/{maxVaultCapacity} KG)
              </button>
              <button
                onClick={() => setSourceStorage('backpack')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  sourceStorage === 'backpack'
                    ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200'
                    : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                BACKPACK ({backpackWeight.toFixed(1)}/{maxBackpackCapacity} KG)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-bold">DEPOSIT OUTPUT TO:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTargetStorage('backpack')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  targetStorage === 'backpack'
                    ? 'border border-emerald-400 bg-emerald-400/20 text-emerald-200'
                    : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                BACKPACK
              </button>
              <button
                onClick={() => setTargetStorage('vault')}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  targetStorage === 'vault'
                    ? 'border border-emerald-400 bg-emerald-400/20 text-emerald-200'
                    : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                OUTPOST VAULT
              </button>
            </div>
          </div>
        </div>

        {/* Blueprint Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#0D1527]/50 px-6 py-2 overflow-x-auto custom-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`rounded-xl px-3 py-1 text-[11px] font-bold tracking-wider transition-all shrink-0 ${
                activeCategory === tab.id
                  ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200'
                  : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Work Area: Recipe Grid & Active Blueprint Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 p-5 overflow-y-auto custom-scrollbar">
          {/* Left: Recipe Browser Grid (3 columns) */}
          <div className="md:col-span-3 space-y-2.5 overflow-y-auto max-h-[48vh] pr-1 custom-scrollbar">
            {filteredRecipes.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              const def = RESOURCE_DEFINITIONS[recipe.output.type];

              // Check if can craft
              let isAffordable = true;
              for (const ing of recipe.inputs) {
                const have =
                  sourceStorage === 'backpack'
                    ? inventory[ing.type]?.count ?? 0
                    : vaultStorage[ing.type] ?? 0;
                if (have < ing.count) isAffordable = false;
              }

              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : isAffordable
                      ? 'border-white/10 bg-[#0D1527]/80 hover:border-cyan-500/30 hover:bg-[#111A30]'
                      : 'border-white/5 bg-[#090D18]/50 opacity-60 hover:opacity-85'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                      {getRecipeIcon(recipe.output.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{recipe.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Yields: +{recipe.output.count}x • {def?.weightPerUnit || 1.0} kg/ea • Cycle: {recipe.durationSeconds}s
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right ml-2">
                    {isAffordable ? (
                      <span className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> READY
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        <AlertTriangle className="h-3 w-3" /> MISSING
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Recipe Detailed Inspector & Sintering Execution (2 columns) */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-[#0D1527]/90 p-4">
            <div>
              {/* Output Item Title */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
                  {getRecipeIcon(selectedRecipe.output.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-cyan-200 truncate">{selectedRecipe.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase rounded px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {selectedRecipe.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      MASS: {outputMass.toFixed(1)} KG
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                {selectedRecipe.description}
              </p>

              {/* Required Feedstock Matrix */}
              <div className="border border-white/10 rounded-xl bg-black/30 p-3 mb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Required Ingredients</span>
                  <span className="text-cyan-300">Source: {sourceStorage.toUpperCase()}</span>
                </div>

                <div className="space-y-1.5">
                  {selectedRecipe.inputs.map((ing) => {
                    const have =
                      sourceStorage === 'backpack'
                        ? inventory[ing.type]?.count ?? 0
                        : vaultStorage[ing.type] ?? 0;
                    const ingDef = RESOURCE_DEFINITIONS[ing.type];
                    const isMet = have >= ing.count;

                    return (
                      <div
                        key={ing.type}
                        className={`flex items-center justify-between rounded-lg p-2 text-xs border ${
                          isMet
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-red-500/30 bg-red-500/10'
                        }`}
                      >
                        <span className="font-bold text-slate-200 truncate">
                          {ingDef?.name || ing.type}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-extrabold ${
                              isMet ? 'text-emerald-300' : 'text-red-400'
                            }`}
                          >
                            {have} / {ing.count}
                          </span>
                          {isMet ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Execution / Craft Action */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => startCrafting(selectedRecipe.id, sourceStorage, targetStorage)}
                disabled={!canCraft || isBusy}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-400 bg-cyan-500/25 py-2.5 text-xs font-bold text-cyan-100 hover:bg-cyan-500/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all"
              >
                <Zap className="h-4 w-4" />
                <span>
                  {isBusy
                    ? 'FABRICATION IN PROGRESS...'
                    : canCraft
                    ? `FABRICATE ${selectedRecipe.name.toUpperCase()}`
                    : missingReason.toUpperCase()}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Optional Collapsible Fabrication History Overlay */}
        {showHistory && (
          <div className="border-t border-cyan-500/20 bg-[#070B14] p-4 max-h-40 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" /> Recent Fabrication Operations
              </span>
              <span className="text-[10px] text-slate-500">Last 20 completions</span>
            </div>

            {craftingHistory.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">No previous fabrication runs recorded this mission.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {craftingHistory.map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-2">
                    <div>
                      <span className="font-bold text-slate-200">+{h.outputCount}x {h.recipeName}</span>
                      <span className="text-[9px] text-slate-500 block">{h.timestamp}</span>
                    </div>
                    <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                      → {h.targetStorage}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer info & close */}
        <div className="flex items-center justify-between border-t border-cyan-500/20 bg-cyan-950/20 px-6 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Automated Sintering Chamber: 100% material conservation guaranteed.</span>
          </div>
          <button
            onClick={closeCraftingModal}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            DISMISS [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};

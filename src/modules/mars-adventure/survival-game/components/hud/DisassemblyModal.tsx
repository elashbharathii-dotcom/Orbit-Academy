import React, { useState, useEffect } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  DISASSEMBLY_RECIPES,
  DisassemblyRecipe,
} from '../../types/craftingTypes';
import {
  RESOURCE_DEFINITIONS,
  ResourceType,
} from '../../types/survivalTypes';
import {
  X,
  Trash2,
  Package,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  Layers,
  Cpu,
  Wrench,
  BatteryCharging,
  Cog,
  Flame,
} from 'lucide-react';

export const DisassemblyModal: React.FC = () => {
  const isDisassemblyModalOpen = useMarsGameStore((state) => state.isDisassemblyModalOpen);
  const closeDisassemblyModal = useMarsGameStore((state) => state.closeDisassemblyModal);
  const inventory = useMarsGameStore((state) => state.inventory);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);
  const vaultStorageWeight = useMarsGameStore((state) => state.vaultStorageWeight);
  const maxVaultCapacity = useMarsGameStore((state) => state.maxVaultCapacity);
  const disassembleItem = useMarsGameStore((state) => state.disassembleItem);

  const [sourceStorage, setSourceStorage] = useState<'backpack' | 'vault'>('backpack');
  const [targetStorage, setTargetStorage] = useState<'backpack' | 'vault'>('vault');
  const [selectedSourceType, setSelectedSourceType] = useState<ResourceType>('damaged_battery');
  const [quantity, setQuantity] = useState<number>(1);
  const [confirmPending, setConfirmPending] = useState<boolean>(false);
  const [isShredding, setIsShredding] = useState<boolean>(false);
  const [lastDisassembled, setLastDisassembled] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!isDisassemblyModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDisassemblyModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisassemblyModalOpen, closeDisassemblyModal]);

  // Reset confirmation when selection changes
  useEffect(() => {
    setConfirmPending(false);
  }, [selectedSourceType, quantity, sourceStorage, targetStorage]);

  if (!isDisassemblyModalOpen) return null;

  const recipes = Object.values(DISASSEMBLY_RECIPES);
  const activeRecipe: DisassemblyRecipe =
    DISASSEMBLY_RECIPES[selectedSourceType] || recipes[0];

  const sourceDef = RESOURCE_DEFINITIONS[activeRecipe.sourceType];

  // Quantities in chosen source container
  const availableCount =
    sourceStorage === 'backpack'
      ? inventory[activeRecipe.sourceType]?.count ?? 0
      : vaultStorage[activeRecipe.sourceType] ?? 0;

  // Max selectable quantity
  const clampedQuantity = Math.min(Math.max(1, quantity), Math.max(1, availableCount));

  // Mass calculations
  const consumedUnitMass = sourceDef?.weightPerUnit ?? 1.0;
  const totalConsumedMass = clampedQuantity * consumedUnitMass;

  let totalRecoveredMass = 0;
  for (const out of activeRecipe.outputs) {
    const outDef = RESOURCE_DEFINITIONS[out.type];
    totalRecoveredMass += out.count * clampedQuantity * (outDef?.weightPerUnit ?? 1.0);
  }

  // Capacity validation
  let canDisassemble = availableCount >= clampedQuantity && availableCount > 0;
  let validationMessage = '';

  const netMassChange =
    sourceStorage === targetStorage ? totalRecoveredMass - totalConsumedMass : totalRecoveredMass;

  if (availableCount <= 0) {
    canDisassemble = false;
    validationMessage = `None available in ${sourceStorage.toUpperCase()}.`;
  } else if (targetStorage === 'backpack') {
    if (backpackWeight + netMassChange > maxBackpackCapacity + 0.001) {
      canDisassemble = false;
      validationMessage = `Backpack limit exceeded (+${netMassChange.toFixed(1)} kg net). Route to Outpost Vault!`;
    }
  } else {
    if (vaultStorageWeight + netMassChange > maxVaultCapacity + 0.001) {
      canDisassemble = false;
      validationMessage = `Outpost Vault full (+${netMassChange.toFixed(1)} kg net). Clear vault space.`;
    }
  }

  const handleExecuteShred = () => {
    if (!canDisassemble) return;

    if (!confirmPending) {
      setConfirmPending(true);
      return;
    }

    setIsShredding(true);
    setConfirmPending(false);

    setTimeout(() => {
      const res = disassembleItem(
        activeRecipe.sourceType,
        clampedQuantity,
        sourceStorage,
        targetStorage
      );

      setIsShredding(false);
      if (res.success) {
        setLastDisassembled(
          `Recovered scrap from ${clampedQuantity}x ${activeRecipe.name} -> ${targetStorage.toUpperCase()}`
        );
        setQuantity(1);
      }
    }, 450);
  };

  const getItemIcon = (type: ResourceType) => {
    switch (type) {
      case 'scrap_metal':
      case 'titanium_scrap':
      case 'metal_plate':
        return <Layers className="h-4 w-4 text-slate-300" />;
      case 'copper_wire':
      case 'wire_assembly':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'circuit_board':
      case 'electronic_parts':
      case 'electronics_module':
        return <Cpu className="h-4 w-4 text-purple-400" />;
      case 'damaged_battery':
      case 'battery_cell':
      case 'battery_pack':
        return <BatteryCharging className="h-4 w-4 text-red-400" />;
      case 'mechanical_parts':
      case 'fasteners':
        return <Cog className="h-4 w-4 text-cyan-400" />;
      case 'solar_cell':
      case 'silicate_crystal':
        return <Sparkles className="h-4 w-4 text-sky-300" />;
      case 'polymer':
        return <Wrench className="h-4 w-4 text-emerald-400" />;
      default:
        return <Package className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-red-500/30 bg-[#0A0F1D]/98 shadow-[0_0_60px_rgba(239,68,68,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-500/20 bg-gradient-to-r from-red-950/40 via-black to-slate-950/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wider text-red-400">
                  DISASSEMBLY & RECYCLING SHREDDER
                </h2>
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-300">
                  HIGH-TORQUE 48,000 RPM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                PULVERIZE OBSOLETE EQUIPMENT & RECOVER CRITICAL RAW METALS AND COMPONENTS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400">BLADES:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE / SHARP
              </span>
            </div>
            <button
              onClick={closeDisassemblyModal}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:border-red-400 hover:text-white transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Storage Selection & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[#0D1527]/90 px-6 py-3 text-xs">
          {/* Source Storage */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">DISASSEMBLE FROM:</span>
            <div className="flex rounded-lg border border-white/10 bg-black/40 p-0.5">
              <button
                onClick={() => setSourceStorage('backpack')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  sourceStorage === 'backpack'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BACKPACK ({backpackWeight.toFixed(1)}/{maxBackpackCapacity} KG)
              </button>
              <button
                onClick={() => setSourceStorage('vault')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  sourceStorage === 'vault'
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                VAULT ({vaultStorageWeight.toFixed(1)}/{maxVaultCapacity} KG)
              </button>
            </div>
          </div>

          {/* Target Storage */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">DEPOSIT OUTPUTS IN:</span>
            <div className="flex rounded-lg border border-white/10 bg-black/40 p-0.5">
              <button
                onClick={() => setTargetStorage('vault')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  targetStorage === 'vault'
                    ? 'bg-emerald-500 text-black shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OUTPOST VAULT
              </button>
              <button
                onClick={() => setTargetStorage('backpack')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  targetStorage === 'backpack'
                    ? 'bg-emerald-500 text-black shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BACKPACK
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Disassembly Catalog (5 Cols) */}
          <div className="md:col-span-5 flex flex-col border-r border-white/5 bg-[#070B14]/60 p-4 overflow-y-auto max-h-[60vh] md:max-h-none">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                SALVAGEABLE EQUIPMENT
              </span>
              <span className="text-[10px] text-slate-500">
                {recipes.length} SPECIFICATIONS
              </span>
            </div>

            <div className="space-y-2">
              {recipes.map((rec) => {
                const isSelected = rec.sourceType === selectedSourceType;
                const def = RESOURCE_DEFINITIONS[rec.sourceType];
                const count =
                  sourceStorage === 'backpack'
                    ? inventory[rec.sourceType]?.count ?? 0
                    : vaultStorage[rec.sourceType] ?? 0;

                return (
                  <button
                    key={rec.sourceType}
                    onClick={() => {
                      setSelectedSourceType(rec.sourceType);
                      setQuantity(1);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                        : count > 0
                        ? 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/70'
                        : 'border-white/5 bg-slate-950/30 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                          isSelected
                            ? 'border-red-400 bg-red-500/20'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        {getItemIcon(rec.sourceType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? 'text-red-300' : 'text-slate-200'
                            }`}
                          >
                            {rec.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{def?.weightPerUnit ?? 1.0} KG/EA</span>
                          <span>•</span>
                          <span className="text-amber-400">
                            YIELDS {rec.outputs.length} TYPES
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border ${
                          count > 0
                            ? 'border-red-500/30 bg-red-500/10 text-red-300'
                            : 'border-white/5 bg-black/40 text-slate-500'
                        }`}
                      >
                        {count} AVAILABLE
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Shredder Chamber & Output Analysis (7 Cols) */}
          <div className="md:col-span-7 flex flex-col bg-[#0A0F1D]/80 p-5 overflow-y-auto">
            {/* Selected Item Overview */}
            <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/20 via-black to-slate-950/40 p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold text-red-400 uppercase">
                      TARGET RECYCLING BLUEPRINT
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ID: {activeRecipe.sourceType}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    {activeRecipe.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    {activeRecipe.description}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400">AVAILABLE IN {sourceStorage.toUpperCase()}</span>
                  <span className="text-xl font-black text-red-400">
                    {availableCount} <span className="text-xs text-slate-400">UNITS</span>
                  </span>
                </div>
              </div>

              {/* Quantity Selector Bar */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">DISASSEMBLY BATCH:</span>
                  <div className="flex items-center rounded-xl border border-white/10 bg-black/50 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={clampedQuantity <= 1 || availableCount <= 0}
                      className="px-3 py-1.5 text-xs font-bold hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-black text-amber-300 min-w-[48px] text-center">
                      {clampedQuantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(availableCount, q + 1))}
                      disabled={clampedQuantity >= availableCount || availableCount <= 0}
                      className="px-3 py-1.5 text-xs font-bold hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => setQuantity(availableCount)}
                    disabled={availableCount <= 0 || clampedQuantity === availableCount}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300 hover:border-amber-400 hover:text-amber-300 disabled:opacity-30 transition-all"
                  >
                    MAX ({availableCount})
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">MASS CONSUMED:</span>
                  <span className="text-xs font-bold text-slate-200">
                    {totalConsumedMass.toFixed(2)} KG
                  </span>
                </div>
              </div>
            </div>

            {/* Expected Recovered Outputs */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      GUARANTEED RECOVERED RESOURCES
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    TOTAL YIELD MASS: +{totalRecoveredMass.toFixed(2)} KG
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {activeRecipe.outputs.map((out) => {
                    const outDef = RESOURCE_DEFINITIONS[out.type];
                    const batchCount = out.count * clampedQuantity;
                    const mass = batchCount * (outDef?.weightPerUnit ?? 1.0);

                    return (
                      <div
                        key={out.type}
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                            {getItemIcon(out.type)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-200">
                              {outDef?.name || out.type}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {out.count}x / unit • {outDef?.weightPerUnit ?? 1.0} kg/ea
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-300">
                            +{batchCount}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {mass.toFixed(1)} kg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status / Feedback / Alerts */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                {validationMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{validationMessage}</span>
                  </div>
                )}

                {lastDisassembled && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{lastDisassembled}</span>
                  </div>
                )}

                {/* Shredding In Progress Banner */}
                {isShredding && (
                  <div className="flex items-center justify-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-950/40 p-3 text-amber-300 text-xs font-bold animate-pulse">
                    <Flame className="h-5 w-5 text-amber-400 animate-spin" />
                    <span>PULVERIZING SALVAGE & SEPARATING COMPONENT ALLOYS...</span>
                  </div>
                )}

                {/* Action Confirmation & Shred Button */}
                <div className="flex items-center gap-3">
                  {confirmPending ? (
                    <div className="flex-1 flex items-center gap-3">
                      <button
                        onClick={handleExecuteShred}
                        disabled={isShredding || !canDisassemble}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-red-500 bg-red-600 px-5 py-3 text-xs font-black tracking-wider text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all hover:bg-red-500 active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>CONFIRM SHRED ({clampedQuantity}x {activeRecipe.name.toUpperCase()})</span>
                      </button>

                      <button
                        onClick={() => setConfirmPending(false)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleExecuteShred}
                      disabled={isShredding || !canDisassemble}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-xs font-black tracking-wider transition-all ${
                        canDisassemble
                          ? 'border-red-500/50 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-[1.01] active:scale-95'
                          : 'border-white/5 bg-slate-900/50 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>
                        {availableCount <= 0
                          ? 'INSUFFICIENT SALVAGE IN SOURCE'
                          : `PULVERIZE & RECOVER (${clampedQuantity}x)`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between border-t border-white/5 bg-[#070B14] px-6 py-2.5 text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>HABITAT LIFE SUPPORT ISRU PROTOCOL 4.2</span>
            <span>•</span>
            <span>MASS SPECTROMETRIC EXTRACTION: 99.8% EFFICIENCY</span>
          </div>
          <div className="flex items-center gap-2">
            <span>PRESS [ESC] TO CLOSE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
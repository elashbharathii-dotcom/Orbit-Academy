import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { ResourceType } from '../../types/survivalTypes';
import {
  Vault,
  Backpack,
  ArrowRight,
  ArrowLeft,
  X,
  Package,
  Wrench,
  Cpu,
  BatteryCharging,
  Settings,
  Microscope,
  Droplets,
  Layers,
  Sparkles,
  Gem,
  Mountain,
  Disc,
  Sun,
  AlertTriangle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench,
  Cpu,
  BatteryCharging,
  Settings,
  Microscope,
  Droplets,
  Layers,
  Sparkles,
  Gem,
  Mountain,
  Disc,
  Sun,
};

export const StorageModal: React.FC = () => {
  const isStorageModalOpen = useMarsGameStore((state) => state.isStorageModalOpen);
  const closeStorageModal = useMarsGameStore((state) => state.closeStorageModal);
  const inventory = useMarsGameStore((state) => state.inventory);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);
  const depositToStorage = useMarsGameStore((state) => state.depositToStorage);
  const depositAllToStorage = useMarsGameStore((state) => state.depositAllToStorage);
  const withdrawFromStorage = useMarsGameStore((state) => state.withdrawFromStorage);

  if (!isStorageModalOpen) return null;

  const resourceKeys = Object.keys(inventory) as ResourceType[];
  const weightPercent = Math.min(100, Math.round((backpackWeight / maxBackpackCapacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-cyan-500/30 bg-[#0A0F1D]/95 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-950/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
              <Vault className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wider text-cyan-200">
                OUTPOST ALPHA — SECURE MATERIAL VAULT
              </h2>
              <p className="text-[11px] text-slate-400">
                Deposit Mars materials into permanent space center storage for base renovations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={depositAllToStorage}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/30 active:scale-95"
            >
              <Package className="h-4 w-4" />
              <span>DEPOSIT ALL</span>
            </button>
            <button
              onClick={closeStorageModal}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dual Storage Pane Container */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 overflow-y-auto">
          {/* Left Column: Backpack Cargo */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0D1527]/80 p-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Backpack className="h-4 w-4" />
                <span>EVA ASTRONAUT BACKPACK</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200">
                  {backpackWeight.toFixed(1)} / {maxBackpackCapacity.toFixed(1)} KG
                </span>
                <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      weightPercent > 90
                        ? 'bg-red-500'
                        : weightPercent > 70
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${weightPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {resourceKeys.map((key) => {
                const item = inventory[key];
                if (!item || item.count <= 0) return null;
                const IconComponent = ICON_MAP[item.icon] || Package;
                const itemTotalWeight = item.count * item.weightPerUnit;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-cyan-500/30 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-cyan-400">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.weightPerUnit} kg/ea • {itemTotalWeight.toFixed(1)} kg total
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 mr-1">
                        ×{item.count}
                      </span>
                      <button
                        onClick={() => depositToStorage(key, 1)}
                        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 transition-all"
                        title="Deposit 1 unit"
                      >
                        +1 <ArrowRight className="inline h-3 w-3 ml-0.5" />
                      </button>
                      {item.count > 1 && (
                        <button
                          onClick={() => depositToStorage(key, item.count)}
                          className="rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-2 py-1 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/30 active:scale-95 transition-all"
                          title={`Deposit all ${item.count} units`}
                        >
                          ALL
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {resourceKeys.every((k) => (inventory[k]?.count || 0) <= 0) && (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                  <Backpack className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs">Astronaut backpack is empty.</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Explore Jezero Crater to salvage scrap and minerals.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Base Vault Storage */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0D1527]/80 p-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Vault className="h-4 w-4" />
                <span>OUTPOST PERMANENT VAULT</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Ready for Renovation
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[50vh] pr-1">
              {resourceKeys.map((key) => {
                const storedCount = vaultStorage[key] || 0;
                if (storedCount <= 0) return null;
                const item = inventory[key];
                const IconComponent = ICON_MAP[item?.icon || 'Package'] || Package;
                const canWithdraw = backpackWeight + (item?.weightPerUnit ?? 1.0) <= maxBackpackCapacity + 0.001;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-emerald-400">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          {item?.name || key}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item?.weightPerUnit ?? 1.0} kg/ea • Vault stock
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 mr-1">
                        ×{storedCount}
                      </span>
                      <button
                        onClick={() => withdrawFromStorage(key, 1)}
                        disabled={!canWithdraw}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition-all ${
                          canWithdraw
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95'
                            : 'border-slate-700 bg-slate-800/40 text-slate-600 cursor-not-allowed'
                        }`}
                        title={canWithdraw ? 'Withdraw 1 unit to backpack' : 'Backpack full'}
                      >
                        <ArrowLeft className="inline h-3 w-3 mr-0.5" /> -1
                      </button>
                    </div>
                  </div>
                );
              })}

              {resourceKeys.every((k) => (vaultStorage[k] || 0) <= 0) && (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                  <Vault className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs">Base storage vault is empty.</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Deposit materials from your backpack to fund base upgrades.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info & close */}
        <div className="flex items-center justify-between border-t border-cyan-500/20 bg-cyan-950/20 px-6 py-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Materials stored here are automatically drawn during Space Center Renovation.</span>
          </div>
          <button
            onClick={closeStorageModal}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            DISMISS [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};

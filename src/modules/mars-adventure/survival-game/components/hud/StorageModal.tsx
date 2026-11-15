import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  ResourceType,
  StorageContainerType,
  RESOURCE_DEFINITIONS,
} from '../../types/survivalTypes';
import {
  Vault,
  Backpack,
  Truck,
  ArrowRight,
  ArrowLeft,
  X,
  Package,
  Wrench,
  Cpu,
  BatteryCharging,
  Battery,
  Settings,
  Microscope,
  Droplets,
  Droplet,
  Layers,
  Sparkles,
  Gem,
  Mountain,
  Sun,
  AlertTriangle,
  UtensilsCrossed,
  HeartPulse,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench,
  Cpu,
  BatteryCharging,
  Battery,
  Settings,
  Microscope,
  Droplets,
  Droplet,
  Layers,
  Sparkles,
  Gem,
  Mountain,
  Sun,
  UtensilsCrossed,
  HeartPulse,
  Package,
};

type StorageMode = 'backpack_vault' | 'backpack_rover' | 'rover_vault';

export const StorageModal: React.FC = () => {
  const isStorageModalOpen = useMarsGameStore((state) => state.isStorageModalOpen);
  const closeStorageModal = useMarsGameStore((state) => state.closeStorageModal);
  const inventory = useMarsGameStore((state) => state.inventory);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const roverStorage = useMarsGameStore((state) => state.roverStorage);
  const backpackWeight = useMarsGameStore((state) => state.backpackWeight);
  const vaultStorageWeight = useMarsGameStore((state) => state.vaultStorageWeight);
  const roverStorageWeight = useMarsGameStore((state) => state.roverStorageWeight);
  const maxBackpackCapacity = useMarsGameStore((state) => state.maxBackpackCapacity);
  const maxRoverCapacity = useMarsGameStore((state) => state.maxRoverCapacity);
  const maxVaultCapacity = useMarsGameStore((state) => state.maxVaultCapacity);
  const transferItem = useMarsGameStore((state) => state.transferItem);
  const transferAll = useMarsGameStore((state) => state.transferAll);

  const [storageMode, setStorageMode] = useState<StorageMode>('backpack_vault');

  if (!isStorageModalOpen) return null;

  // Determine left & right containers based on active mode
  let leftType: StorageContainerType = 'backpack';
  let rightType: StorageContainerType = 'vault';
  let leftName = 'EVA ASTRONAUT BACKPACK';
  let rightName = 'OUTPOST PERMANENT VAULT';
  let leftIcon = Backpack;
  let rightIcon = Vault;
  let leftCurrentWeight = backpackWeight;
  let leftMaxCapacity = maxBackpackCapacity;
  let rightCurrentWeight = vaultStorageWeight;
  let rightMaxCapacity = maxVaultCapacity;

  if (storageMode === 'backpack_rover') {
    leftType = 'backpack';
    rightType = 'rover';
    leftName = 'EVA ASTRONAUT BACKPACK';
    rightName = 'ROVER CARGO BAY';
    leftIcon = Backpack;
    rightIcon = Truck;
    leftCurrentWeight = backpackWeight;
    leftMaxCapacity = maxBackpackCapacity;
    rightCurrentWeight = roverStorageWeight;
    rightMaxCapacity = maxRoverCapacity;
  } else if (storageMode === 'rover_vault') {
    leftType = 'rover';
    rightType = 'vault';
    leftName = 'ROVER CARGO BAY';
    rightName = 'OUTPOST PERMANENT VAULT';
    leftIcon = Truck;
    rightIcon = Vault;
    leftCurrentWeight = roverStorageWeight;
    leftMaxCapacity = maxRoverCapacity;
    rightCurrentWeight = vaultStorageWeight;
    rightMaxCapacity = maxVaultCapacity;
  }

  const leftWeightPercent = Math.min(100, Math.round((leftCurrentWeight / leftMaxCapacity) * 100));
  const rightWeightPercent = Math.min(100, Math.round((rightCurrentWeight / rightMaxCapacity) * 100));

  const resourceKeys = Object.keys(RESOURCE_DEFINITIONS) as ResourceType[];

  const getContainerCount = (container: StorageContainerType, key: ResourceType): number => {
    if (container === 'backpack') return inventory[key]?.count ?? 0;
    if (container === 'rover') return roverStorage[key] ?? 0;
    if (container === 'vault') return vaultStorage[key] ?? 0;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-cyan-500/30 bg-[#0A0F1D]/98 shadow-[0_0_60px_rgba(6,182,212,0.18)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-950/25 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
              <Vault className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wider text-cyan-200">
                MULTI-TIER EXPEDITION STORAGE TRANSFER TERMINAL
              </h2>
              <p className="text-[11px] text-slate-400">
                Atomic two-way material transfer between Backpack (25 kg), Rover (100 kg), and Outpost Vault (500 kg).
              </p>
            </div>
          </div>

          <button
            onClick={closeStorageModal}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Storage Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#0D1527]/70 px-6 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <button
              onClick={() => setStorageMode('backpack_vault')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                storageMode === 'backpack_vault'
                  ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Backpack className="h-3.5 w-3.5" />
              <span>BACKPACK ⟷ OUTPOST VAULT (500 KG)</span>
            </button>

            <button
              onClick={() => setStorageMode('backpack_rover')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                storageMode === 'backpack_rover'
                  ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>BACKPACK ⟷ ROVER CARGO (100 KG)</span>
            </button>

            <button
              onClick={() => setStorageMode('rover_vault')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shrink-0 ${
                storageMode === 'rover_vault'
                  ? 'border border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>ROVER CARGO ⟷ OUTPOST VAULT</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Atomic Transfer Active</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Dual Storage Container Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 overflow-y-auto custom-scrollbar">
          {/* Left Container */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0D1527]/90 p-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                {React.createElement(leftIcon, { className: 'h-4 w-4' })}
                <span>{leftName}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200">
                  {leftCurrentWeight.toFixed(1)} / {leftMaxCapacity.toFixed(1)} KG
                </span>
                <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      leftWeightPercent > 90
                        ? 'bg-red-500'
                        : leftWeightPercent > 70
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${leftWeightPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action: Transfer All to Right */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => transferAll(leftType, rightType)}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/25 active:scale-95 transition-all"
                title={`Transfer all items from ${leftName} to ${rightName}`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>TRANSFER ALL TO RIGHT →</span>
              </button>
            </div>

            {/* Items in Left Container */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[48vh] pr-1 custom-scrollbar">
              {resourceKeys.map((key) => {
                const count = getContainerCount(leftType, key);
                if (count <= 0) return null;
                const def = RESOURCE_DEFINITIONS[key];
                const IconComponent = ICON_MAP[def.icon] || Package;
                const unitWeight = def.weightPerUnit;
                const totalWeight = (count * unitWeight).toFixed(1);
                const canFitOne = rightCurrentWeight + unitWeight <= rightMaxCapacity + 0.001;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-cyan-500/30 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-cyan-400">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">{def.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {unitWeight} kg/ea • {totalWeight} kg
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-xs font-extrabold text-cyan-300 mr-1.5">
                        ×{count}
                      </span>
                      <button
                        onClick={() => transferItem(leftType, rightType, key, 1)}
                        disabled={!canFitOne}
                        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title={canFitOne ? `Transfer 1 unit to ${rightName}` : `${rightName} payload full`}
                      >
                        +1 <ArrowRight className="inline h-3 w-3 ml-0.5" />
                      </button>
                      {count >= 5 && (
                        <button
                          onClick={() => transferItem(leftType, rightType, key, 5)}
                          className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-2 py-1 text-[10px] font-bold text-cyan-200 hover:bg-cyan-500/25 active:scale-95 transition-all"
                          title={`Transfer 5 units to ${rightName}`}
                        >
                          +5
                        </button>
                      )}
                      <button
                        onClick={() => transferItem(leftType, rightType, key, count)}
                        className="rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-2 py-1 text-[10px] font-bold text-cyan-200 hover:bg-cyan-500/30 active:scale-95 transition-all"
                        title={`Transfer all ${count} units to ${rightName}`}
                      >
                        ALL
                      </button>
                    </div>
                  </div>
                );
              })}

              {resourceKeys.every((k) => getContainerCount(leftType, k) <= 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  {React.createElement(leftIcon, { className: 'h-8 w-8 mb-2 opacity-30' })}
                  <p className="text-xs">{leftName} is empty.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Container */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#0D1527]/90 p-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                {React.createElement(rightIcon, { className: 'h-4 w-4' })}
                <span>{rightName}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200">
                  {rightCurrentWeight.toFixed(1)} / {rightMaxCapacity.toFixed(1)} KG
                </span>
                <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      rightWeightPercent > 90
                        ? 'bg-red-500'
                        : rightWeightPercent > 70
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${rightWeightPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action: Transfer All to Left */}
            <div className="flex justify-start mb-2">
              <button
                onClick={() => transferAll(rightType, leftType)}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition-all"
                title={`Transfer all items from ${rightName} to ${leftName}`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>← TRANSFER ALL TO LEFT</span>
              </button>
            </div>

            {/* Items in Right Container */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[48vh] pr-1 custom-scrollbar">
              {resourceKeys.map((key) => {
                const count = getContainerCount(rightType, key);
                if (count <= 0) return null;
                const def = RESOURCE_DEFINITIONS[key];
                const IconComponent = ICON_MAP[def.icon] || Package;
                const unitWeight = def.weightPerUnit;
                const totalWeight = (count * unitWeight).toFixed(1);
                const canFitOne = leftCurrentWeight + unitWeight <= leftMaxCapacity + 0.001;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-emerald-400">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">{def.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {unitWeight} kg/ea • {totalWeight} kg
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-xs font-extrabold text-emerald-400 mr-1.5">
                        ×{count}
                      </span>
                      <button
                        onClick={() => transferItem(rightType, leftType, key, 1)}
                        disabled={!canFitOne}
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title={canFitOne ? `Transfer 1 unit to ${leftName}` : `${leftName} payload full`}
                      >
                        <ArrowLeft className="inline h-3 w-3 mr-0.5" /> -1
                      </button>
                      {count >= 5 && (
                        <button
                          onClick={() => transferItem(rightType, leftType, key, 5)}
                          className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-200 hover:bg-emerald-500/25 active:scale-95 transition-all"
                          title={`Transfer 5 units to ${leftName}`}
                        >
                          -5
                        </button>
                      )}
                      <button
                        onClick={() => transferItem(rightType, leftType, key, count)}
                        className="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-200 hover:bg-emerald-500/30 active:scale-95 transition-all"
                        title={`Transfer all ${count} units to ${leftName}`}
                      >
                        ALL
                      </button>
                    </div>
                  </div>
                );
              })}

              {resourceKeys.every((k) => getContainerCount(rightType, k) <= 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  {React.createElement(rightIcon, { className: 'h-8 w-8 mb-2 opacity-30' })}
                  <p className="text-xs">{rightName} is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info & close */}
        <div className="flex items-center justify-between border-t border-cyan-500/20 bg-cyan-950/20 px-6 py-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>
              Materials stored in the Outpost Permanent Vault are automatically drawn during Space Center Renovation.
            </span>
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

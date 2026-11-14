import React, { useState } from 'react';
import { useMarsGameStore, UPGRADES_DATABASE } from '../../store/useMarsGameStore';
import { UpgradeId } from '../../types/survivalTypes';
import {
  Hammer,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  Box,
  Leaf,
  Radio,
  Building2,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';

const UPGRADE_ICONS: Record<UpgradeId, React.ElementType> = {
  power_room: Zap,
  storage_room: Box,
  greenhouse: Leaf,
  comm_room: Radio,
  hab_expansion: Building2,
};

export const RenovationModal: React.FC = () => {
  const isRenovationModalOpen = useMarsGameStore((state) => state.isRenovationModalOpen);
  const closeRenovationModal = useMarsGameStore((state) => state.closeRenovationModal);
  const renovations = useMarsGameStore((state) => state.renovations);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const inventory = useMarsGameStore((state) => state.inventory);
  const purchaseRenovation = useMarsGameStore((state) => state.purchaseRenovation);

  const [selectedUpgradeId, setSelectedUpgradeId] = useState<UpgradeId>('power_room');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isRenovationModalOpen) return null;

  const selectedUpgrade = UPGRADES_DATABASE.find((u) => u.id === selectedUpgradeId) || UPGRADES_DATABASE[0];
  const isCompleted = renovations[selectedUpgrade.id];

  // Evaluate affordability from vaultStorage
  const missingItems: { name: string; needed: number; available: number }[] = [];
  let canAfford = true;

  if (!isCompleted) {
    for (const costItem of selectedUpgrade.cost) {
      const available = vaultStorage[costItem.type] || 0;
      const itemName = inventory[costItem.type]?.name || costItem.type;
      if (available < costItem.count) {
        canAfford = false;
        missingItems.push({
          name: itemName,
          needed: costItem.count,
          available,
        });
      }
    }
  }

  const handleRenovate = () => {
    setActionFeedback(null);
    const result = purchaseRenovation(selectedUpgrade.id);
    if (result.success) {
      setActionFeedback({ type: 'success', message: result.message });
    } else {
      setActionFeedback({ type: 'error', message: result.message });
    }
  };

  const completedCount = Object.values(renovations).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / UPGRADES_DATABASE.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-amber-500/30 bg-[#0A0F1D]/95 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-950/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-500/10 text-amber-300">
              <Hammer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-wider text-amber-200">
                OUTPOST ALPHA — ENGINEERING & RENOVATION STATION
              </h2>
              <p className="text-[11px] text-slate-400">
                Restore damaged base modules using materials deposited in the space center vault.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Outpost Health Progress */}
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <span>RESTORATION:</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={closeRenovationModal}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div
            className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-b border-red-500/30'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        )}

        {/* Body Grid: Left Upgrade List, Right Upgrade Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto custom-scrollbar">
          {/* Left: Progression Stages Tabs (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-800 bg-[#0D1527]/50 p-4 space-y-2.5 overflow-y-auto custom-scrollbar">
            <div className="text-[11px] font-bold tracking-wider text-slate-400 px-2 py-1 uppercase">
              Renovation Phases ({completedCount}/5 Operational)
            </div>

            {UPGRADES_DATABASE.map((upgrade, idx) => {
              const active = upgrade.id === selectedUpgradeId;
              const done = renovations[upgrade.id];
              const IconComp = UPGRADE_ICONS[upgrade.id];

              return (
                <button
                  key={upgrade.id}
                  onClick={() => {
                    setSelectedUpgradeId(upgrade.id);
                    setActionFeedback(null);
                  }}
                  className={`w-full flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                    active
                      ? 'border-amber-400/60 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : done
                      ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400/50'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        done
                          ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-400'
                          : active
                          ? 'border-amber-400/50 bg-amber-500/20 text-amber-300'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        STAGE {idx + 1}: {upgrade.name.split('&')[0]}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                        <span
                          className={`font-semibold ${
                            done ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {done ? 'OPERATIONAL' : 'DAMAGED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ChevronRight className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-slate-600'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Stage Specification (7 cols) */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-[#0A0F1D]/80">
            <div>
              {/* Sector Title & Status Badge */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    STAGE {selectedUpgrade.stageNumber} SPECIFICATION
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-100 mt-0.5">
                    {selectedUpgrade.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedUpgrade.description}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold whitespace-nowrap ${
                    isCompleted
                      ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300'
                      : 'border-amber-400/40 bg-amber-500/10 text-amber-300'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>ONLINE</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>DAMAGED</span>
                    </>
                  )}
                </div>
              </div>

              {/* Benefits Unlocked */}
              <div className="mt-4">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Facility Enhancements & Environmental Changes:
                </div>
                <div className="space-y-1.5">
                  {selectedUpgrade.unlockedBenefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-slate-300"
                    >
                      <PackageCheck className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Requirements vs Available in Vault */}
              <div className="mt-5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Required Space Center Materials:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedUpgrade.cost.map((c) => {
                    const available = vaultStorage[c.type] || 0;
                    const item = inventory[c.type];
                    const satisfied = available >= c.count || isCompleted;

                    return (
                      <div
                        key={c.type}
                        className={`rounded-2xl border p-3 flex flex-col justify-between transition-colors ${
                          satisfied
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-red-500/30 bg-red-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">
                            {item?.name || c.type}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              satisfied ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {isCompleted ? 'DEDUCTED' : `${available} / ${c.count}`}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {isCompleted
                            ? 'Phase requirements met'
                            : satisfied
                            ? 'Available in Vault Storage'
                            : `Missing ${c.count - available} in Vault`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Renovation Action Button */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                {isCompleted ? (
                  <span className="text-emerald-400 font-bold">
                    ✓ This facility section is 100% operational.
                  </span>
                ) : canAfford ? (
                  <span className="text-cyan-300 font-bold">
                    Materials confirmed in Vault. Ready to reconstruct.
                  </span>
                ) : (
                  <span className="text-red-400 font-bold">
                    Missing: {missingItems.map((m) => `${m.needed - m.available}x ${m.name}`).join(', ')}
                  </span>
                )}
              </div>

              {isCompleted ? (
                <button
                  disabled
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-6 py-2.5 text-xs font-bold text-emerald-300 opacity-80 cursor-default"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>OPERATIONAL</span>
                </button>
              ) : (
                <button
                  onClick={handleRenovate}
                  disabled={!canAfford}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border px-6 py-2.5 text-xs font-bold transition-all shadow-lg active:scale-95 ${
                    canAfford
                      ? 'border-amber-400 bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:brightness-110'
                      : 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Hammer className="h-4 w-4" />
                  <span>RENOVATE SECTION</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

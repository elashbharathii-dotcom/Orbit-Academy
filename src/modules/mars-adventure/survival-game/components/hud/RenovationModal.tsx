import React, { useState, useEffect } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  FACILITIES_DATABASE,
  FacilityId,
  RenovationLevel,
  LEVEL_NAMES,
} from '../../types/renovationTypes';
import { RESOURCE_DEFINITIONS } from '../../types/survivalTypes';
import {
  Hammer,
  CheckCircle2,
  AlertTriangle,
  X,
  Radio,
  Leaf,
  Wrench,
  Car,
  Home,
  Sparkles,
  Zap,
  Layers,
  Cpu,
  BatteryCharging,
  Cog,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const FACILITY_ICONS: Record<FacilityId, React.ElementType> = {
  command_centre: Radio,
  greenhouse: Leaf,
  engineering_workshop: Wrench,
  rover_garage: Car,
  living_quarters: Home,
  comm_room: Radio,
};

export const RenovationModal: React.FC = () => {
  const isRenovationModalOpen = useMarsGameStore((state) => state.isRenovationModalOpen);
  const closeRenovationModal = useMarsGameStore((state) => state.closeRenovationModal);
  const facilityRenovations = useMarsGameStore((state) => state.facilityRenovations);
  const activeFacilityTab = useMarsGameStore((state) => state.activeFacilityTab);
  const setActiveFacilityTab = useMarsGameStore((state) => state.setActiveFacilityTab);
  const vaultStorage = useMarsGameStore((state) => state.vaultStorage);
  const inventory = useMarsGameStore((state) => state.inventory);
  const upgradeFacility = useMarsGameStore((state) => state.upgradeFacility);

  const [selectedFacilityId, setSelectedFacilityId] = useState<FacilityId>(activeFacilityTab || 'command_centre');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync tab with external open trigger
  useEffect(() => {
    if (activeFacilityTab) {
      setSelectedFacilityId(activeFacilityTab);
    }
  }, [activeFacilityTab]);

  // Handle ESC key
  useEffect(() => {
    if (!isRenovationModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRenovationModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRenovationModalOpen, closeRenovationModal]);

  if (!isRenovationModalOpen) return null;

  const facilityList = Object.values(FACILITIES_DATABASE);
  const currentFacility = FACILITIES_DATABASE[selectedFacilityId] || facilityList[0];
  const currentLevel: RenovationLevel = facilityRenovations[currentFacility.id] || 0;
  const currentStage = currentFacility.stages[currentLevel];
  const isMaxLevel = currentLevel >= 3;
  const nextLevel = (currentLevel + 1) as RenovationLevel;
  const nextStage = !isMaxLevel ? currentFacility.stages[nextLevel] : null;

  // Calculate overall station progress (0 to 18 total levels)
  const totalLevelsCompleted = Object.values(facilityRenovations).reduce<number>(
    (acc, lvl) => acc + (lvl as number),
    0
  );
  const maxPossibleLevels = facilityList.length * 3;
  const stationProgressPercent = Math.round((totalLevelsCompleted / maxPossibleLevels) * 100);

  // Check material availability for next level
  let canAfford = !isMaxLevel;
  const materialStatus: Array<{
    type: string;
    name: string;
    needed: number;
    have: number;
    isSufficient: boolean;
  }> = [];

  if (nextStage) {
    for (const costItem of nextStage.cost) {
      const inVault = vaultStorage[costItem.type] || 0;
      const inBackpack = inventory[costItem.type]?.count || 0;
      const totalHave = inVault + inBackpack;
      const itemDef = inventory[costItem.type] || RESOURCE_DEFINITIONS[costItem.type];
      const isSufficient = totalHave >= costItem.count;
      if (!isSufficient) canAfford = false;

      materialStatus.push({
        type: costItem.type,
        name: itemDef?.name || costItem.type,
        needed: costItem.count,
        have: totalHave,
        isSufficient,
      });
    }
  }

  const handleExecuteUpgrade = () => {
    setFeedback(null);
    const res = upgradeFacility(currentFacility.id);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'scrap_metal':
      case 'metal_plate':
      case 'structural_frame':
        return <Layers className="h-4 w-4 text-slate-300" />;
      case 'copper_wire':
      case 'wire_assembly':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'circuit_board':
      case 'electronic_parts':
      case 'electronics_module':
        return <Cpu className="h-4 w-4 text-purple-400" />;
      case 'battery_cell':
      case 'battery_pack':
        return <BatteryCharging className="h-4 w-4 text-cyan-400" />;
      case 'repair_kit':
        return <Wrench className="h-4 w-4 text-emerald-400" />;
      default:
        return <Cog className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in font-mono select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-amber-500/30 bg-[#0A0F1D]/98 shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-black to-slate-950/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Hammer className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wider text-amber-300">
                  OUTPOST ALPHA — SPACE CENTRE RENOVATION MATRIX
                </h2>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                  ISRU PROTOCOL 5.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                MODULAR RESTORATION OF JEZERO CRATER PLANETARY INFRASTRUCTURE ACROSS 6 EXPLORABLE FACILITIES
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Station Progress Bar */}
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span>STATION RESTORATION: {stationProgressPercent}%</span>
              </div>
              <div className="w-36 h-2 bg-slate-900 rounded-full mt-1 overflow-hidden border border-white/10 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${stationProgressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={closeRenovationModal}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:border-amber-400 hover:text-white transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`flex items-center justify-between border-b px-6 py-2.5 text-xs ${feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              : 'border-red-500/30 bg-red-950/40 text-red-300'
              }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-[11px] underline opacity-80 hover:opacity-100">
              DISMISS
            </button>
          </div>
        )}

        {/* Main Content Area: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: 6 Explorable Facilities Roster (5 Cols) */}
          <div className="md:col-span-5 flex flex-col border-r border-white/5 bg-[#070B14]/70 p-4 overflow-y-auto max-h-[55vh] md:max-h-none">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                EXPLORABLE FACILITIES (6)
              </span>
              <span className="text-[10px] text-amber-400 font-bold">
                {totalLevelsCompleted} / {maxPossibleLevels} STAGES
              </span>
            </div>

            <div className="space-y-2">
              {facilityList.map((fac) => {
                const isSelected = fac.id === selectedFacilityId;
                const lvl = facilityRenovations[fac.id] || 0;
                const stage = fac.stages[lvl];
                const IconComp = FACILITY_ICONS[fac.id] || Hammer;

                return (
                  <button
                    key={fac.id}
                    onClick={() => {
                      setSelectedFacilityId(fac.id);
                      setActiveFacilityTab(fac.id);
                      setFeedback(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group ${isSelected
                      ? 'border-amber-500 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'border-white/10 bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/70'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${isSelected
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : lvl >= 2
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : lvl === 1
                              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                              : 'border-white/10 bg-white/5 text-slate-400'
                          }`}
                      >
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-amber-200">
                          {fac.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span
                            className={`font-semibold ${lvl === 3
                              ? 'text-emerald-400'
                              : lvl === 2
                                ? 'text-cyan-300'
                                : lvl === 1
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }`}
                          >
                            LVL {lvl} • {LEVEL_NAMES[lvl]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="text-[10px] font-bold text-slate-300">
                        {stage.conditionPercent}% COND
                      </div>
                      <div className="w-14 h-1.5 bg-black/50 rounded-full mt-1 overflow-hidden border border-white/5">
                        <div
                          className={`h-full ${lvl === 3
                            ? 'bg-emerald-400'
                            : lvl === 2
                              ? 'bg-cyan-400'
                              : lvl === 1
                                ? 'bg-amber-400'
                                : 'bg-red-500'
                            }`}
                          style={{ width: `${stage.conditionPercent}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Facility Blueprint & Upgrade Chamber (7 Cols) */}
          <div className="md:col-span-7 flex flex-col bg-[#0A0F1D]/80 p-5 overflow-y-auto">
            {/* Facility Header Overview */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-black to-slate-950/40 p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold text-amber-400 uppercase">
                      FACILITY SPECIFICATION
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{currentFacility.zone}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1">{currentFacility.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                    {currentFacility.summary}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400">CURRENT STATUS</span>
                  <span
                    className={`text-lg font-black ${currentLevel === 3
                      ? 'text-emerald-400'
                      : currentLevel === 2
                        ? 'text-cyan-400'
                        : currentLevel === 1
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                  >
                    LEVEL {currentLevel} <span className="text-xs">[{LEVEL_NAMES[currentLevel]}]</span>
                  </span>
                </div>
              </div>

              {/* Current Active Benefits Checklist */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  OPERATIONAL SUBSYSTEMS & BENEFITS:
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {currentStage.unlockedBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Upgrade Specification Section */}
            <div className="flex-1 flex flex-col justify-between">
              {isMaxLevel ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col items-center justify-center text-center my-auto">
                  <div className="h-12 w-12 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-black text-emerald-300 tracking-wider">
                    MAXIMUM SPECIFICATION ACHIEVED
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    This facility operates at Level 3 (Advanced). All quantum subsystems, automated diagnostics, and
                    maximum survival buffs are active.
                  </p>
                </div>
              ) : nextStage ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        NEXT UPGRADE: LEVEL {nextLevel} — {nextStage.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      TARGET CONDITION: {nextStage.conditionPercent}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{nextStage.description}</p>

                  {/* Future Benefits to Unlock */}
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-3 mb-4">
                    <span className="text-[10px] font-bold uppercase text-cyan-300 block mb-1">
                      UNLOCKED UPON LEVEL {nextLevel}:
                    </span>
                    <div className="space-y-1">
                      {nextStage.unlockedBenefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-200">
                          <ChevronRight className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Requirements Checklist */}
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-300 uppercase block mb-2">
                      REQUIRED COMPONENTS & SALVAGE:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {materialStatus.map((mat) => (
                        <div
                          key={mat.type}
                          className={`rounded-xl border p-2.5 flex items-center justify-between ${mat.isSufficient
                            ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                            : 'border-red-500/30 bg-red-950/20 text-red-200'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`p-1.5 rounded-lg border ${mat.isSufficient
                                ? 'border-emerald-500/30 bg-emerald-500/10'
                                : 'border-red-500/30 bg-red-500/10'
                                }`}
                            >
                              {getItemIcon(mat.type)}
                            </div>
                            <div>
                              <div className="text-xs font-bold">{mat.name}</div>
                              <div className="text-[10px] text-slate-400">
                                Need {mat.needed}x
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`text-xs font-black ${mat.isSufficient ? 'text-emerald-400' : 'text-red-400'
                                }`}
                            >
                              {mat.have} / {mat.needed}
                            </div>
                            <span className="text-[9px] uppercase text-slate-400">
                              {mat.isSufficient ? 'READY' : 'MISSING'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Action Upgrade Button */}
              {!isMaxLevel && nextStage && (
                <div className="pt-3 border-t border-white/5">
                  <button
                    onClick={handleExecuteUpgrade}
                    disabled={!canAfford}
                    className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-5 text-xs font-black tracking-wider transition-all ${canAfford
                      ? 'border border-amber-500/50 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.01] active:scale-95'
                      : 'border border-white/5 bg-slate-900/50 text-slate-500 cursor-not-allowed'
                      }`}
                  >
                    <Hammer className="h-4 w-4" />
                    <span>
                      {canAfford
                        ? `RESTORE TO LEVEL ${nextLevel} [${LEVEL_NAMES[nextLevel]}]`
                        : 'INSUFFICIENT MATERIALS IN STORAGE VAULT'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between border-t border-white/5 bg-[#070B14] px-6 py-2.5 text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>OUTPOST ALPHA RENOVATION SYSTEM 5.0</span>
            <span>•</span>
            <span>DATA-DRIVEN RECONSTRUCTION ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>PRESS [ESC] TO CLOSE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

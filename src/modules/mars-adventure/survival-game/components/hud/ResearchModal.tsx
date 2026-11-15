import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import {
  Sparkles,
  X,
  CheckCircle2,
  Cpu,
  Sun,
  Activity,
  Leaf,
  FlaskConical,
} from 'lucide-react';

export const ResearchModal: React.FC = () => {
  const isResearchModalOpen = useMarsGameStore((state) => state.isResearchModalOpen);
  const closeResearchModal = useMarsGameStore((state) => state.closeResearchModal);
  const researchDataPoints = useMarsGameStore((state) => state.researchDataPoints);
  const researchTechs = useMarsGameStore((state) => state.researchTechs);
  const unlockedTechIds = useMarsGameStore((state) => state.unlockedTechIds);
  const unlockResearchTech = useMarsGameStore((state) => state.unlockResearchTech);
  const scannableTargets = useMarsGameStore((state) => state.scannableTargets);
  const scannedTargetIds = useMarsGameStore((state) => state.scannedTargetIds);

  const [activeTab, setActiveTab] = useState<'technologies' | 'spectrometry'>('technologies');

  if (!isResearchModalOpen) return null;

  const techIcons: Record<string, React.ReactNode> = {
    tech_eva_recirculator: <Activity className="w-5 h-5 text-cyan-400" />,
    tech_pv_coating: <Sun className="w-5 h-5 text-amber-400" />,
    tech_rover_suspension: <Cpu className="w-5 h-5 text-purple-400" />,
    tech_bio_nutrients: <Leaf className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-mono select-none">
      <div className="relative w-full max-w-4xl h-[84vh] max-h-[740px] bg-zinc-950/95 border border-purple-500/40 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.18)] flex flex-col overflow-hidden text-zinc-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-zinc-900/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/40 text-purple-400">
              <FlaskConical className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-wider text-purple-300">
                  ENGINEERING WORKSHOP • RESEARCH & DEVELOPMENT LABORATORY
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300">
                  JEZERO CRATER SCIENTIFIC LAB
                </span>
              </div>
              <div className="text-xs text-zinc-400 flex items-center space-x-3 mt-0.5">
                <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AVAILABLE RESEARCH POINTS: {researchDataPoints} RP</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span>
                  BLUEPRINTS: {unlockedTechIds.length} / {researchTechs.length} UNLOCKED
                </span>
                <span className="text-zinc-600">•</span>
                <span>
                  SPECTROMETRY: {scannedTargetIds.length} / {scannableTargets.length} CATALOGED
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={closeResearchModal}
            className="p-1.5 rounded-lg border border-zinc-700 hover:border-purple-400 hover:bg-purple-500/10 text-zinc-400 hover:text-purple-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 px-6 py-2.5 border-b border-zinc-800 bg-zinc-900/30 text-xs">
          <button
            onClick={() => setActiveTab('technologies')}
            className={`px-4 py-1.5 rounded uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'technologies'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
            }`}
          >
            Technology Blueprints ({researchTechs.length})
          </button>
          <button
            onClick={() => setActiveTab('spectrometry')}
            className={`px-4 py-1.5 rounded uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'spectrometry'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
            }`}
          >
            Spectrometry & Geological Catalog ({scannableTargets.length})
          </button>
        </div>

        {/* Tab 1: Technologies Tree */}
        {activeTab === 'technologies' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-zinc-950/60">
            <div className="grid grid-cols-2 gap-4">
              {researchTechs.map((tech) => {
                const isUnlocked = unlockedTechIds.includes(tech.id);
                const canAfford = researchDataPoints >= tech.costPoints;

                return (
                  <div
                    key={tech.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isUnlocked
                        ? 'border-emerald-500/40 bg-emerald-950/15 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : canAfford
                        ? 'border-purple-500/40 bg-purple-950/20 hover:border-purple-400/70'
                        : 'border-zinc-800 bg-zinc-900/30 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700">
                            {techIcons[tech.id] || <Cpu className="w-5 h-5 text-purple-400" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-100">{tech.name}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-mono">
                              SYSTEM UPGRADE • {tech.category}
                            </div>
                          </div>
                        </div>
                        {isUnlocked ? (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>OPERATIONAL</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold font-mono text-amber-400">
                            {tech.costPoints} RP
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed mt-2">{tech.description}</p>

                      {/* Scientific Effect Tag */}
                      <div className="mt-3 p-2.5 rounded bg-zinc-950/70 border border-zinc-800/80 text-[11px] text-purple-300">
                        {tech.id === 'tech_eva_recirculator' && (
                          <span>⚡ Suit Oxygen consumption reduced by 25% (0.09/s outdoors).</span>
                        )}
                        {tech.id === 'tech_pv_coating' && (
                          <span>⚡ Solar array peak generation increased by +20% (16.8 kW peak).</span>
                        )}
                        {tech.id === 'tech_rover_suspension' && (
                          <span>⚡ Rover speed increased to 32.4 km/h (+25%) with -25% battery consumption.</span>
                        )}
                        {tech.id === 'tech_bio_nutrients' && (
                          <span>⚡ Greenhouse aeroponic crop growth accelerated by +35%.</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      {isUnlocked ? (
                        <div className="w-full py-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                          BLUEPRINT RESEARCHED
                        </div>
                      ) : (
                        <button
                          onClick={() => unlockResearchTech(tech.id)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                            canAfford
                              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                              : 'bg-zinc-800/70 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {canAfford
                              ? `UNLOCK BLUEPRINT (${tech.costPoints} RP)`
                              : `INSUFFICIENT RP (NEED ${tech.costPoints - researchDataPoints} MORE)`}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Spectrometry & Geological Catalog */}
        {activeTab === 'spectrometry' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-zinc-950/60">
            <div className="text-xs text-zinc-400 mb-2">
              All spectrally surveyed mineral concretions, skycrane aerospace debris, and astrobiological samples.
              Scan unexplored objects in Jezero Crater to earn Research Points.
            </div>
            <div className="grid grid-cols-2 gap-3">
              {scannableTargets.map((s) => {
                const isScanned = scannedTargetIds.includes(s.id);

                return (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-lg border text-xs transition-all ${
                      isScanned
                        ? 'border-cyan-500/40 bg-cyan-950/15'
                        : 'border-zinc-800 bg-zinc-900/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-zinc-100">{s.name}</span>
                      {isScanned ? (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>+{s.researchValue} RP CATALOGED</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-400">AWAITING SCAN</span>
                      )}
                    </div>
                    {s.chemicalFormula && (
                      <div className="text-[11px] font-mono text-cyan-400 mb-1">{s.chemicalFormula}</div>
                    )}
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{s.description}</p>
                    <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                      SPECTROMETRY: {s.spectrometryData}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

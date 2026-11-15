import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { CAMPAIGN_ENDINGS } from '../../data/campaignStoryData';
import { Compass, Sparkles, Home, Shield, ArrowRight } from 'lucide-react';
import { audioSystem } from '../../systems/audioSynthesizer';

export const CampaignEndingModal: React.FC = () => {
  const isOpen = useMarsGameStore((state) => state.isEndingModalOpen);
  const closeEndingModal = useMarsGameStore((state) => state.closeEndingModal);
  const endingId = useMarsGameStore((state) => state.campaignEnding) || 'ending_pioneer';
  const solNumber = useMarsGameStore((state) => state.solCycle.solNumber);
  const researchPoints = useMarsGameStore((state) => state.researchDataPoints);
  const completedMissions = useMarsGameStore((state) => state.completedMissionIds.length);
  const discoveredLandmarks = useMarsGameStore((state) => state.discoveredLandmarkIds.length);

  if (!isOpen) return null;

  const ending = CAMPAIGN_ENDINGS[endingId] || CAMPAIGN_ENDINGS['ending_pioneer'];

  const getEndingIcon = () => {
    switch (ending.id) {
      case 'ending_pioneer':
        return <Home className="h-8 w-8 text-cyan-400" />;
      case 'ending_scientist':
        return <Sparkles className="h-8 w-8 text-purple-400" />;
      case 'ending_explorer':
        return <Compass className="h-8 w-8 text-amber-400" />;
      default:
        return <Shield className="h-8 w-8 text-emerald-400" />;
    }
  };

  const handleContinueFreeRoam = () => {
    audioSystem.playChime(1000);
    closeEndingModal();
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-lg animate-fade-in font-mono">
      <div className="relative flex flex-col w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-[#070B16]/95 shadow-[0_0_80px_rgba(0,240,255,0.3)]">
        {/* Cinematic Header Graphic */}
        <div className="relative bg-gradient-to-b from-red-950/80 via-[#0A1224] to-[#070B16] p-6 sm:p-8 text-center border-b border-white/10">
          <div className="flex justify-center mb-3">
            <div className="p-3.5 rounded-2xl border border-white/20 bg-black/50 shadow-inner">
              {getEndingIcon()}
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            CAMPAIGN CONCLUDED • {ending.code}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider mt-1">
            {ending.title}
          </h1>
          <div className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border border-white/10 bg-white/5 text-slate-300">
            {ending.badge}
          </div>
        </div>

        {/* Narrative Epilogue Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[480px]">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line">
            {ending.epilogueText}
          </div>

          {/* Future of Mars Projection */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>THE FUTURE OF MARS:</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {ending.futureOfMars}
            </p>
          </div>

          {/* Expedition Summary Statistics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              EXPEDITION TELEMETRY RECORD:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <span className="text-[10px] text-slate-400 block">SOLS SURVIVED</span>
                <span className="text-base font-extrabold text-amber-400">SOL {solNumber}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <span className="text-[10px] text-slate-400 block">MISSIONS LOGGED</span>
                <span className="text-base font-extrabold text-cyan-400">{completedMissions}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <span className="text-[10px] text-slate-400 block">LANDMARKS CHARTED</span>
                <span className="text-base font-extrabold text-emerald-400">{discoveredLandmarks} / 10</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <span className="text-[10px] text-slate-400 block">RESEARCH POINTS</span>
                <span className="text-base font-extrabold text-purple-400">+{researchPoints}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 px-6 py-4 bg-[#0A0F20]">
          <span className="text-xs text-slate-400">
            Mars: Last Frontier campaign is complete. All sandbox modes remain active.
          </span>

          <button
            onClick={handleContinueFreeRoam}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/60 bg-cyan-500/20 px-6 py-2.5 text-xs font-extrabold text-cyan-200 hover:bg-cyan-500/35 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <span>CONTINUE FREE ROAM</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

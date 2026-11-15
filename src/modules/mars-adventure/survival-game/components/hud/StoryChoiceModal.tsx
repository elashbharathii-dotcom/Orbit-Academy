import React, { useState } from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { CAMPAIGN_CHOICES } from '../../data/campaignStoryData';
import { PlayerChoiceOption } from '../../types/storyTypes';
import { AlertTriangle, CheckCircle, Sparkles, X, ShieldAlert } from 'lucide-react';
import { audioSystem } from '../../systems/audioSynthesizer';

export const StoryChoiceModal: React.FC = () => {
  const activeChoiceId = useMarsGameStore((state) => state.activeChoiceModalId);
  const closeChoiceModal = useMarsGameStore((state) => state.closeChoiceModal);
  const selectPlayerChoice = useMarsGameStore((state) => state.selectPlayerChoice);

  const [selectedOption, setSelectedOption] = useState<PlayerChoiceOption | null>(null);
  const [confirmStage, setConfirmStage] = useState<boolean>(false);

  if (!activeChoiceId) return null;
  const choice = CAMPAIGN_CHOICES[activeChoiceId];
  if (!choice) return null;

  const handleSelectOption = (opt: PlayerChoiceOption) => {
    audioSystem.playChime(1050);
    setSelectedOption(opt);
    setConfirmStage(true);
  };

  const handleFinalConfirm = () => {
    if (!selectedOption) return;
    audioSystem.playFacilityUpgradeFanfare();
    selectPlayerChoice(choice.id, selectedOption.id);
    setConfirmStage(false);
    setSelectedOption(null);
  };

  const getEndingBadge = (bias: PlayerChoiceOption['endingBias']) => {
    switch (bias) {
      case 'pioneer':
        return <span className="text-[10px] text-cyan-300 font-bold">COLONIAL PIONEER BIAS</span>;
      case 'scientist':
        return <span className="text-[10px] text-purple-300 font-bold">ASTROBIOLOGY SCIENCE BIAS</span>;
      case 'explorer':
        return <span className="text-[10px] text-amber-300 font-bold">PLANETARY EXPLORER BIAS</span>;
      case 'survivor':
        return <span className="text-[10px] text-emerald-300 font-bold">SURVIVAL RESILIENCE BIAS</span>;
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-amber-500/50 bg-[#070B16]/95 p-6 shadow-[0_0_60px_rgba(245,158,11,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-amber-500/40 bg-amber-950/60 text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                CRITICAL CAMPAIGN DIRECTIVE • CHAPTER {choice.chapterId}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                {choice.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioSystem.playChime(600);
              closeChoiceModal();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Premise Description */}
        <div className="mb-5 rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>{choice.premise}</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {choice.options.map((option) => {
            const isChosen = selectedOption?.id === option.id;
            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99] ${
                  isChosen
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                    : 'border-white/10 bg-[#0C1222]/80 hover:border-amber-500/40 hover:bg-[#10172C]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {getEndingBadge(option.endingBias)}
                    {isChosen && <CheckCircle className="h-4 w-4 text-amber-400" />}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    {option.label}
                  </h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>OUTCOME:</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{option.consequencesSummary}</p>
                  {option.bonusReward && (
                    <div className="mt-2 text-[10px] text-yellow-300 font-bold bg-yellow-950/40 border border-yellow-500/30 rounded px-2 py-1">
                      {option.bonusReward}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Footer */}
        {confirmStage && selectedOption ? (
          <div className="rounded-xl border border-amber-500/60 bg-amber-950/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5 text-xs text-amber-200">
              <ShieldAlert className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <span>
                CONFIRM IRREVERSIBLE CHOICE: <strong>{selectedOption.label}</strong>. This choice permanently dictates colonial protocols.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmStage(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/10"
              >
                BACK
              </button>
              <button
                onClick={handleFinalConfirm}
                className="px-4 py-1.5 rounded-lg border border-amber-400 bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                CONFIRM DIRECTIVE
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-white/5">
            <span>Select one directive above to inspect consequences.</span>
            <span>All directives persist in local telemetry.</span>
          </div>
        )}
      </div>
    </div>
  );
};

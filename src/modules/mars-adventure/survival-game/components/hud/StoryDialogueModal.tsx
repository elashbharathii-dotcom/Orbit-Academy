import React from 'react';
import { useMarsGameStore } from '../../store/useMarsGameStore';
import { Radio, Bot, User, Cpu, Sparkles, ArrowRight, X } from 'lucide-react';
import { audioSystem } from '../../systems/audioSynthesizer';

export const StoryDialogueModal: React.FC = () => {
  const activeDialogue = useMarsGameStore((state) => state.activeDialogue);
  const dismissDialogue = useMarsGameStore((state) => state.dismissDialogue);
  const openChoiceModal = useMarsGameStore((state) => state.openChoiceModal);
  const triggerDialogue = useMarsGameStore((state) => state.triggerDialogue);

  if (!activeDialogue) return null;

  const handleNext = () => {
    audioSystem.playCommBeep();
    if (activeDialogue.choiceId) {
      const cid = activeDialogue.choiceId;
      dismissDialogue();
      openChoiceModal(cid);
    } else if (activeDialogue.nextDialogueId) {
      triggerDialogue(activeDialogue.nextDialogueId);
    } else {
      dismissDialogue();
    }
  };

  const getSpeakerIcon = () => {
    switch (activeDialogue.speaker) {
      case 'Mission Control (Houston)':
        return <Radio className="h-5 w-5 text-sky-400 animate-pulse" />;
      case 'ARES-OS (Suit AI)':
        return <Cpu className="h-5 w-5 text-cyan-400" />;
      case 'Dr. Elena Vance (Expedition Lead)':
      case 'Chief Engineer Chen':
      case 'Commander Reyes':
        return <User className="h-5 w-5 text-amber-400" />;
      default:
        return <Bot className="h-5 w-5 text-purple-400" />;
    }
  };

  const getSpeakerColor = () => {
    switch (activeDialogue.speaker) {
      case 'Mission Control (Houston)':
        return 'text-sky-400 border-sky-500/40 bg-sky-950/60';
      case 'ARES-OS (Suit AI)':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/60';
      case 'Dr. Elena Vance (Expedition Lead)':
      case 'Commander Reyes':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/60';
      default:
        return 'text-purple-400 border-purple-500/40 bg-purple-950/60';
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in font-mono">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#070B16]/95 p-5 sm:p-6 shadow-[0_0_50px_rgba(0,240,255,0.25)]">
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${getSpeakerColor()}`}>
              {getSpeakerIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  INCOMING TRANSMISSION •
                </span>
                <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                  FREQUENCY LOCK: 8.4 GHz
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white tracking-wide">
                {activeDialogue.speaker}
              </h3>
              {activeDialogue.speakerTitle && (
                <p className="text-[11px] text-slate-400">{activeDialogue.speakerTitle}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              audioSystem.playChime(600);
              dismissDialogue();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Audio Waveform Indicator */}
        <div className="flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg bg-black/50 border border-white/5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] text-slate-400 mr-2">AUDIO WAVEFORM:</span>
          <div className="flex items-end gap-1 h-3 flex-1">
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s] h-3" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s] h-2" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s] h-3" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s] h-1.5" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.25s] h-2.5" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.05s] h-3" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.35s] h-2" />
            <div className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s] h-1" />
          </div>
        </div>

        {/* Dialogue Message Body */}
        <div className="my-4 rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-slate-200">
          <p className="whitespace-pre-line">{activeDialogue.text}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500">
            [ESC] Dismiss • [SPACE/ENTER] Continue
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl border border-cyan-400/60 bg-cyan-500/20 px-5 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-500/35 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            {activeDialogue.choiceId ? (
              <>
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>DECIDE DIRECTIVE</span>
              </>
            ) : activeDialogue.nextDialogueId ? (
              <>
                <span>CONTINUE</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>ACKNOWLEDGE [ENTER]</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
